// The characters used for each player's cell
var playerChars = ['X', 'O'];

var gameInstanceId = null;
var gameReady = false;

var getGameInstance = function() {
  return GameInstances.findOne(gameInstanceId);
};

Template.connectFour.onCreated(function () {
  var self = this;

  gameInstanceId = FlowRouter.getParam("instanceId");

  self.autorun(function () {
    showLoadingModal();

    self.subscribe("gameInstances", function () {
      var gameInstance = getGameInstance();

      // If the game instance given in the URL doesn't exist, go home
      if (!gameInstance) {
        FlowRouter.go('/');
      }

      // If the user is not part of this game instance, let her join
      if (!gameInstance.isPlaying(Meteor.userId())) {
        Meteor.call("joinGameInstance", gameInstanceId, function (err, data) {
          if (data === false) {
            return;
          }

          if (err) {
            console.log("Error while joining game:", err);
            return;
          }

          gameReady = true;
          hideLoadingModal();

          if (getGameInstance().nPlayers + 1 < gameInstance.minPlayers) {
            // If not enough players for the game, show the invite message
            showInviteMessage();
          }
        });
      } else {
        gameReady = true;
        hideLoadingModal();

        if (getGameInstance().nPlayers < gameInstance.minPlayers) {
          // If not enough players for the game, show the invite message
          showInviteMessage();
        }
      }

      // Observe changes in the game instance to update the session and jiggle
      // the status field
      GameInstances.find(gameInstanceId).observeChanges({
        changed: function (id, fields) {
          if (fields.status != null || fields.currentTurnPlayerN != null) {
            // Animate the status string
            gameInstance = getGameInstance()
            winner = gameInstance.winner
            playerN = gameInstance.players.indexOf(Meteor.userId());

            if (winner == null) {
              $('#statusString').transition('jiggle');
            } else if (winner === playerN) {
              $('#statusString').transition('bounce');
            } else {
              $('#statusString').transition('shake');
            }
          }
        }
      });
    });
  });
});

Template.connectFour.helpers({
  currentGameInstance: function () {
    return getGameInstance();
  },

  gameStatusString: function () {
    // Return a string that describes the state of the game
    var gameInstance = getGameInstance();
    if (!gameInstance) {
      return '';
    }

    playerN = gameInstance.getPlayerNOfUser(Meteor.userId());

    if (!gameInstance.hasStarted()) {
      return 'Waiting for players'

    } else if (!gameInstance.hasFinished()) {
      if (gameInstance.currentTurnPlayerN === playerN) {
        return 'Your Turn!'
      } else {
        return 'Player ' + parseInt(gameInstance.currentTurnPlayerN + 1) + '\'s Turn'
      }

    } else {
      if (gameInstance.isDraw()) {
        return 'It\'s a tie!';
      }

      if (gameInstance.isWinner(Meteor.userId())) {
        return 'You Won!'
      } else {
        return 'Player ' + parseInt(gameInstance.winner + 1) + ' Won!'
      }
    }
  },

  isMyTurn: function () {
    // Return whether it's the current player's turn or not
    var gameInstance = getGameInstance();
    if (!gameInstance) {
      return false;
    }

    return gameInstance.hasTurn(Meteor.userId());
  },
});

Template.cfBoard.helpers({
  rows: function() {
    // Return the rows of the game instance's grid
    var gameInstance = getGameInstance();
    if (!gameInstance) {
      return null;
    }

    return gameInstance.state.grid;
  },
});

Template.cfColumn.helpers({
  cellPlayer: function(row, col) {
    // Return the player index (or -1) of the given cell
    var gameInstance = getGameInstance();
    if (!gameInstance) {
      return '';
    }

    return gameInstance.state.grid[row][col];
  },

  cell: function(row, col) {
    // Return the player's character for the given cell
    var gameInstance = getGameInstance();
    if (!gameInstance) {
      return '';
    }

    var val = gameInstance.state.grid[row][col];

    if (val === -1) {
      return '';
    }

    return playerChars[val];
  },
});

Template.connectFour.events({
  "click .cf.container td": function (event) {
    var cell = $(event.target);
    var row = parseInt(cell.parent().attr('id')[1]);
    var col = parseInt(cell.attr('id')[1]);

    var gameInstance = getGameInstance();

    // Do nothing if no running game instance
    if (!gameInstance || gameInstance.status != 'playing') {
      return;
    }

    // Do nothing if the cell is already taken
    if (gameInstance.state.grid[row][col] != -1) {
      return;
    }

    var move = {
      col: col,
    };

    // Try executing the move
    Meteor.call("doMove", gameInstanceId, move, function (err, data) {
      if (err) {
        console.log("Error doing move:", err);
        return;
      }
    });
  },
});
