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
          if (currentGameInstance.nPlayers + 1 < currentGameInstance.minPlayers) {
            showInviteMessage();
          }
        });
      } else {
        hideLoadingModal();
        if (currentGameInstance.nPlayers < currentGameInstance.minPlayers) {
          showInviteMessage();
        }
      }

      GameInstances.find(currentGameInstanceId).observeChanges({
        changed: function (id, fields) {
          if (fields.status != null || fields.currentTurnPlayerN != null) {
            $('#statusString').transition('jiggle');
          }
        }
      });
    });
  });
});

Template.tickTackToe.helpers({
  currentGameInstance: function () {
    return GameInstances.findOne(FlowRouter.getParam("instanceId"));
  },

  gameStatusString: function () {
    gameInstance = GameInstances.findOne(FlowRouter.getParam("instanceId"));
    if (!gameInstance) {
      return '';
    }

    playerN = gameInstance.players.indexOf(Meteor.userId());

    if (gameInstance.status == 'waitingForPlayers') {
      return 'Waiting for players'

    } else if (gameInstance.status == 'playing') {
      if (gameInstance.currentTurnPlayerN == playerN) {
        return 'Your Turn!'
      } else {
        return 'Player ' + parseInt(gameInstance.currentTurnPlayerN + 1) + '\'s Turn'
      }

    } else if(gameInstance.status == 'finished') {
      if (gameInstance.winner == null) {
        return 'It\'s a tie!';
      }

      if (gameInstance.winner == playerN) {
        return 'You Won!'
      } else {
        return 'Player ' + parseInt(gameInstance.winner + 1) + ' Won!'
      }
    }
  },

  isMyTurn: function () {
    if (!FlowRouter.subsReady()) {
      return false;
    }

    currentGameInstance = GameInstances.findOne(FlowRouter.getParam("instanceId"));
    playerN = gameInstance.players.indexOf(Meteor.userId());

    return (currentGameInstance.currentTurnPlayerN === playerN);
  },
});

Template.tttBoard.helpers({
  rows: function() {
    if (!FlowRouter.subsReady()) {
      return null;
    }

    var currentGameInstance = GameInstances.findOne(FlowRouter.getParam("instanceId"));

    if (!currentGameInstance) {
      return null;
    }

    return currentGameInstance.state.grid;
  },
});

Template.tttColumn.helpers({
  cell: function(val) {
    if (val == -1) {
      return '';
    }
    return playerChars[val];
  },
});

var runAI = function() {
  Meteor.call("doMove", FlowRouter.getParam("instanceId"), "ai", function (err, data) {
    if (err) {
      console.log("Error doing AI move:", err);
      return;
    }
  });
}

Template.tickTackToe.events({
  "click .ttt.container td": function (event) {
    var cell = $(event.target);
    var row = parseInt(cell.parent().attr('id')[1]);
    var col = parseInt(cell.attr('id')[1]);

    var currentGameInstanceId = FlowRouter.getParam("instanceId")
    var currentGameInstance = GameInstances.findOne(currentGameInstanceId)

    if (currentGameInstance.status != 'playing') {
      return;
    }

    if (currentGameInstance.state.grid[row][col] != -1) {
      return;
    }

    var move = {
      row: row,
      col: col,
    };

    Meteor.call("doMove", FlowRouter.getParam("instanceId"), move, function (err, data) {
      if (err) {
        console.log("Error doing move:", err);
        return;
      }

      // Check if it's AI's turn
      if (!data) {
        var currentGameInstance = GameInstances.findOne(FlowRouter.getParam("instanceId"));
        if (currentGameInstance.players.indexOf('ai') != -1) {
          setTimeout(
            runAI,
            1000);
        }
      }
    });
  },
});
