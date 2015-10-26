Template.home.onCreated(function () {
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
  }
});
