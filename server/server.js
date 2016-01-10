// Defines server initialization code and publishes collections to the client

Meteor.startup(function () {
  // Load game fixtures and upsert
  var games = JSON.parse(Assets.getText('games_fixtures.json'));
  _.each(games, function(game) {
    Games.upsert(
      {gameId: game.gameId},
      {$set: game}
    );
  });
});
