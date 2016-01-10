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
    $('#gameOverviewSegment').addClass('loading');
  }
});

Template.gameOverview.helpers({
  "games": function () {
    // Return all the games
    return Games.find({});
  }
});

Template.gameCard.events({
  "click .new.game.button": function (event) {
    var btn = $(event.target);
    var slug = this.slug;

    btn.addClass('loading');
    Session.set("loadingState", true);

    // Try starting a new game instance
    Meteor.call("startGameInstance", this.gameId, function (err, data) {
      if (data === false) {
        // Simulation, so ignore
        return;
      }

      btn.removeClass('loading');

      if (err) {
        Session.set("loadingState", false);
        // TODO: Add error message
        console.log("Error while starting game:", err);
        return;
      }

      FlowRouter.go('/games/' + slug + '/' + data + '/');
    });
  }
});
