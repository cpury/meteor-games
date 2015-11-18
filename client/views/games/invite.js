showInviteMessage = function(onComplete) {
  // Helper to show the invite message

  var inviteMessage = $('#inviteMessage');
  if (!inviteMessage.hasClass('hidden')) {
    return;
  }

  inviteMessage.transition({
    animation   : 'fade up in',
    duration    : '400ms',
    displayType : 'block',
    onComplete  : onComplete
  });
};

hideInviteMessage = function(onComplete) {
  // Helper to hide the invite message

  var inviteMessage = $('#inviteMessage');
  if (inviteMessage.hasClass('hidden')) {
    return;
  }

  inviteMessage.transition({
    animation   : 'fade down out',
    duration    : '400ms',
    displayType : 'block',
    onComplete  : onComplete
  });
};

Template.inviteMessage.events({
  "click #addAiButton": function (event) {
    event.preventDefault();

    currentGameInstanceId = FlowRouter.getParam("instanceId");
    if (!currentGameInstanceId) {
      return false;
    }

    $("#addAiButton").addClass('loading');

    // Try adding an AI to the current game instance
    Meteor.call("addAIPlayer", currentGameInstanceId, function(err, data) {
      if (data === false) {
        return;
      }
      $("#addAiButton").removeClass('loading');
    });
  },
});

Template.inviteMessage.onCreated(function () {
  var currentGameInstanceId = FlowRouter.getParam("instanceId");

  // Observe the game instance to hide the invite message if not needed anymore
  GameInstances.find(currentGameInstanceId).observe({
    changed: function (newDocument, oldDocument) {
      if (
        !$('#inviteMessage').hasClass('hidden')
        && newDocument.nPlayers >= newDocument.minPlayers
      ) {
        hideInviteMessage();
      }
    }
  });
});
