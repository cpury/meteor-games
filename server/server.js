Meteor.startup(function () {
  GameInstances._ensureIndex({"gameId": 1});
  Games._ensureIndex({"gameId": 1});

  // Load fixtures:
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
