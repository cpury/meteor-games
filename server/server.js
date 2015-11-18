// Defines server initialization code and publishes collections to the client

Meteor.startup(function () {
  // Ensure our DB is indexed
  GameInstances._ensureIndex({"gameId": 1});
  Games._ensureIndex({"gameId": 1});

  // Load game fixtures if games collection empty
  if (Games.find({}).count() === 0) {
    console.log("Empty games :(");
    var games = JSON.parse(Assets.getText('games_fixtures.json'));
    _.each(games, function(game) {
      Games.insert(game);
    });
  }
});

Meteor.publish("games", function() {
  return Games.find({});
})

Meteor.publish("gameInstances", function () {
  return GameInstances.find({});
});
