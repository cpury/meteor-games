showInviteMessage = function(onComplete) {
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

  GameInstances.find(currentGameInstanceId).observe({
    changed: function (newDocument, oldDocument) {
      if (!$('#inviteMessage').hasClass('hidden') && newDocument.nPlayers >= newDocument.minPlayers) {
        hideInviteMessage();
      }
    }
  });
});
