Template.gameOverview.onCreated(function () {
  var self = this;

  // Subscribe to the games collection
  self.autorun(function () {
    self.subscribe("games", function () {
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

Template.home.events({
  "click #tttCard .new.game.button": function (event) {
    var btn = $(event.target);

    btn.addClass('loading');
    showLoadingModal();

    // Try starting a Tick Tack Toe game
    Meteor.call("startGameInstance", "ttt", function (err, data) {
      if (data === false) {
        // This is for the simulation that we want to ignore
        return;
      }

      btn.removeClass('loading');

      if (err) {
        hideLoadingModal();
        // TODO Add semantic alerts... Nag?
        console.log("Error while starting game:", err);
        return;
      }

      FlowRouter.go('/games/tick-tack-toe/' + data + '/');
    });
  },

  "click #cfCard .new.game.button": function (event) {
    var btn = $(event.target);

    btn.addClass('loading');
    showLoadingModal();

    // Try starting a Connect Four game
    Meteor.call("startGameInstance", "cf", function (err, data) {
      if (data === false) {
        // This is for the simulation that we want to ignore
        return;
      }

      btn.removeClass('loading');

      if (err) {
        hideLoadingModal();
        //sAlert.error('Failed to add comment...'); // TODO Add semantic alerts... Nag?
        console.log("Error while starting game:", err);
        return;
      }

      FlowRouter.go('/games/connect-four/' + data + '/');
    });
  }
});
