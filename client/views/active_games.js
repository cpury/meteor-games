var DEFAULT_PAGE = 5;

Template.activeGames.onCreated(function () {
  var self = this;

  Session.set('activeGames.maxInstances', DEFAULT_PAGE);

  // Once the data is ready, remove loading state
  self.autorun(function () {
    if(FlowRouter.subsReady()) {
      $('#activeGamesSegment').removeClass('loading');
    }
  });

  // Subscribe to the game instances and games collections
  self.autorun(function () {
    var maxInstances = Session.get('activeGames.maxInstances');

    self.subscribe("games.active.byPlayer", Meteor.userId());
    self.subscribe(
      "gameInstances.active.byPlayer",
      Meteor.userId(),
      { limit: maxInstances, sort: {createdAt: 1} },
      function () {
        $('#loadMoreGameInstances').removeClass('loading');
      }
    );
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

Template.activeGamesList.events({
  "click #loadMoreGameInstances": function (event) {
    var btn = $(event.target);
    btn.addClass('loading');

    var n = Session.get('activeGames.maxInstances');
    Session.set('activeGames.maxInstances', n + DEFAULT_PAGE)
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
