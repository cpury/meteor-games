// Defines publications and indexes etc.

Meteor.startup(function () {
  // Ensure our DB is indexed
  GameInstances._ensureIndex({"gameId": 1});
  Games._ensureIndex({"gameId": 1});
});

// Publish all games
Meteor.publish("games.all", function () {
  return Games.find({});
});

// Publish all games that were played by a given user
Meteor.publish("games.byPlayer", function (userId) {
  gameInstances = GameInstances.find({players: userId}, {fields: {gameId: 1}});
  gameIds = gameInstances.map(function (doc) { return doc.gameId; });
  return Games.find({_id: {$in: gameIds}});
});

// Publish all games that are actively being played by a given user
Meteor.publish("games.active.byPlayer", function (userId) {
  gameInstances = GameInstances.find(
    {players: userId, status: "playing"},
    {fields: {gameId: 1}
  });
  gameIds = gameInstances.map(function (doc) { return doc.gameId; });
  return Games.find({gameId: {$in: gameIds}});
});

// Publish all game instances
Meteor.publish("gameInstances.all", function () {
  return GameInstances.find({});
});

// Publish a single game instance with the given id
Meteor.publish("gameInstances.single", function (gameInstanceId) {
  return GameInstances.find({_id: gameInstanceId});
});

// Publish game instances that are of the given game
Meteor.publish("gameInstances.byGame", function (gameId) {
  return GameInstances.find({gameId: gameId});
});

// Publish game instances with the given author id
Meteor.publish("gameInstances.byAuthor", function (authorId) {
  return GameInstances.find({authorId: authorId});
});

// Publish game instances where the given user is a player
Meteor.publish("gameInstances.byPlayer", function (userId) {
  return GameInstances.find({players: userId});
});

// Publish currently active game instances where the given user is a player
Meteor.publish("gameInstances.active.byPlayer", function (userId) {
  return GameInstances.find({players: userId, status: "playing"});
});
