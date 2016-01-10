// Defines publications and indexes etc.

Meteor.startup(function () {
  // Ensure our DB is indexed
  GameInstances._ensureIndex({"gameId": 1});
  Games._ensureIndex({"gameId": 1});
});

// Publish all games
Meteor.publish("games.all", function (options) {
  return Games.find({}, options);
});

// Publish all games that were played by a given user
Meteor.publish("games.byPlayer", function (userId, options) {
  gameInstances = GameInstances.find({players: userId}, {fields: {gameId: 1}});
  gameIds = gameInstances.map(function (doc) { return doc.gameId; });
  return Games.find({_id: {$in: gameIds}}, options);
});

// Publish all games that are actively being played by a given user
Meteor.publish("games.active.byPlayer", function (userId, options) {
  gameInstances = GameInstances.find(
    {players: userId, status: "playing"},
    {fields: {gameId: 1}
  });
  gameIds = gameInstances.map(function (doc) { return doc.gameId; });
  return Games.find({gameId: {$in: gameIds}}, options);
});

// Publish all game instances
Meteor.publish("gameInstances.all", function (options) {
  return GameInstances.find({}, options);
});

// Publish a single game instance with the given id
Meteor.publish("gameInstances.single", function (gameInstanceId, options) {
  return GameInstances.find({_id: gameInstanceId}, options);
});

// Publish game instances that are of the given game
Meteor.publish("gameInstances.byGame", function (gameId, options) {
  return GameInstances.find({gameId: gameId}, options);
});

// Publish game instances with the given author id
Meteor.publish("gameInstances.byAuthor", function (authorId, options) {
  return GameInstances.find({authorId: authorId}, options);
});

// Publish game instances where the given user is a player
Meteor.publish("gameInstances.byPlayer", function (userId, options) {
  return GameInstances.find({players: userId}, options);
});

// Publish currently active game instances where the given user is a player
Meteor.publish("gameInstances.active.byPlayer", function (userId, options) {
  return GameInstances.find({players: userId, status: "playing"}, options);
});

// Counts

Meteor.publish('gameInstances.active.byPlayer.count', function (userId) {
  Counts.publish(
    this,
    'gameInstances.active.byPlayer.count',
    GameInstances.find({players: userId, status: "playing"}));
});
