// Defines server initialization code and publishes collections to the client

Meteor.startup(function () {
  // Load game fixtures if games collection empty
  if (Games.find({}).count() === 0) {
    var games = JSON.parse(Assets.getText('games_fixtures.json'));
    _.each(games, function(game) {
      Games.insert(game);
    });
  }
});
