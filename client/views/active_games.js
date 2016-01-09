Template.activeGames.onCreated(function () {
  var self = this;

  // Once the data is ready, remove loading state
  self.autorun(function (c) {
    if(!FlowRouter.subsReady()) {
      $('#activeGamesSegment').addClass('loading');
      c.stop();
    }
  });

  // Subscribe to the game instances and games collections
  self.autorun(function () {
    self.subscribe("games.active.byPlayer", Meteor.userId());
    self.subscribe(
      "gameInstances.active.byPlayer",
      Meteor.userId(),
      { limit: 5, sort: {createdAt: 1} });
  });
});

Template.activeGames.onRendered(function () {
  // If the template is rendered, but data is not ready, add loading state
  if (!FlowRouter.subsReady()) {
    $('#activeGamesSegment').addClass('loading');
  }
});

Template.activeGamesList.helpers({
  "gameInstances": function () {
    // Return all the games
    return GameInstances.find(
      {
        players: Meteor.userId(),
        status: "playing"
      },
      { sort: {createdAt: 1} }
    );
  }
});

Template.activeGameEntry.helpers({
  "url": function () {
    // Return the game instance's URL
    gameInstance = this;
    game = gameInstance.getGame();

    return '/games/' + game.slug + '/' + gameInstance._id + '/';
  },

  "gameName": function () {
    return this.getGame().name;
  },

  "age": function () {
    gameInstance = this;
    game = this.getGame();

    return moment(this.createdAt).fromNow();
  }
});
