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

    if (gameInstance.status == 'playing') {
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

    if (cell.html()) {
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
            Meteor.call("doMove", FlowRouter.getParam("instanceId"), "ai", function (err, data) {
              if (err) {
                console.log("Error doing AI move:", err);
                return;
              }
            }),
            1000);
        }
      }
    });
  },
});
