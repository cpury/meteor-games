Template.gameOverview.onCreated(function () {
  var self = this;

  // Subscribe to the games collection
  self.autorun(function () {
    self.subscribe("games.all", function () {
      // Once the games are loaded, disable loading spinner of game overview
      $('#gameOverviewSegment').removeClass('loading');
    });
  });
});

Template.gameOverview.onRendered(function () {
  // If the template is rendered, but data is not ready, add loading state
  if (!FlowRouter.subsReady("games")) {
    Template.instance().$('#gameOverviewSegment').addClass('loading');
  }
});

Template.gameOverview.helpers({
  "games": function () {
    // Return all the games
    return Games.find({});
  }
});

Template.gameCard.events({
  "click .new.game.button": function (event, instance) {
    var btn = instance.$(event.target);
    var slug = this.game.slug;

    btn.addClass('loading');
    Session.set("loadingState", true);

    // Try starting a new game instance
    Meteor.call("startGameInstance", this.game.gameId, function (err, data) {
      if (data === false) {
        // Simulation, so ignore
        return;
      }

      btn.removeClass('loading');

      if (err) {
        Session.set("loadingState", false);
        sAlert.error("Could not create game: " + err);
        return;
      }

      FlowRouter.go('/games/' + slug + '/' + data + '/');
    });
  }
});
