var playerChars = ['X', 'O'];

Template.tickTackToe.onCreated(function () {
  var self = this;
  self.autorun(function () {
    showLoadingModal();

    self.subscribe("gameInstances", function () {
      var currentGameInstanceId = FlowRouter.getParam("instanceId");
      var currentGameInstance = GameInstances.findOne(currentGameInstanceId);

      if (!currentGameInstance) {
        FlowRouter.go('/');
      }

      if (currentGameInstance.players.indexOf(Meteor.userId()) == -1) {
        Meteor.call("joinGameInstance", currentGameInstanceId, function (err, data) {
          hideLoadingModal();
          if (err) {
            console.log("Error while joining game:", err);
            return;
          }
        });
      } else {
        hideLoadingModal();
      }
    });
  });
});

Template.tickTackToe.helpers({
  currentGameInstance: function () {
    return GameInstances.findOne(FlowRouter.getParam("instanceId"));
  },

  isMyTurn: function () {
    if (!FlowRouter.subsReady()) {
      return false;
    }

    var currentGameInstance = GameInstances.findOne(FlowRouter.getParam("instanceId"));
    // TODO: Find out if it's my turn
  },
});

Template.tttBoard.helpers({
  grid: function (row, col) {
    if (!FlowRouter.subsReady()) {
      return '';
    }

    var currentGameInstance = GameInstances.findOne(FlowRouter.getParam("instanceId"));

    if (!currentGameInstance) {
      return '';
    }

    var grid = currentGameInstance.state.grid;
    var val = grid[row][col]
    return playerChars[val];
  },
});

Template.tickTackToe.events({
  "click .ttt.container td": function (event) {
    var cell = $(event.target);
    var row = parseInt(cell.parent().attr('id')[1]);
    var col = parseInt(cell.attr('id')[1]);

    var move = {
      row: row,
      col: col,
    };

    Meteor.call("doMove", FlowRouter.getParam("instanceId"), move, function (err, data) {
      if (err) {
        console.log("Error doing move:", err);
        return;
      }

      console.log("Move successful:", data);
    });
  }
});
