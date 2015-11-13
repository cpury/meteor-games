Template.home.onCreated(function () {
  var self = this;
  self.autorun(function () {
    showLoadingModal();
    self.subscribe("games", function () {
      hideLoadingModal();
    });
  });
});

Template.gameOverview.helpers({
  "games": function () {
    return Games.find({});
  }
});

Template.home.events({
  "click #tttCard .new.game.button": function (event) {
    var btn = $(event.target);

    btn.addClass('loading');
    showLoadingModal();

    Meteor.call("startGameInstance", "ttt", function (err, data) {
      btn.removeClass('loading');

      if (err) {
        hideLoadingModal();
        //sAlert.error('Failed to add comment...'); // TODO Add semantic alerts... Nag?
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

    Meteor.call("startGameInstance", "cf", function (err, data) {
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
