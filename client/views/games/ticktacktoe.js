// The characters used for each player's cell
var playerChars = ['X', 'O'];

Template.tickTackToe.onCreated(function () {
  var self = this;

  self.autorun(function () {
    showLoadingModal();

    self.subscribe("gameInstances", function () {
      var currentGameInstanceId = FlowRouter.getParam("instanceId");
      var currentGameInstance = GameInstances.findOne(currentGameInstanceId);

      // If the game instance given in the URL doesn't exist, go home
      if (!currentGameInstance) {
        FlowRouter.go('/');
      }

      Session.set('gameInstance', currentGameInstance);

      // If the user is not part of this game instance, let her join
      if (currentGameInstance.players.indexOf(Meteor.userId()) === -1) {
        Meteor.call("joinGameInstance", currentGameInstanceId, function (err, data) {
          if (data === false) {
            return;
          }

          if (err) {
            console.log("Error while joining game:", err);
            return;
          }

          Session.set('gameReady', true);
          hideLoadingModal();

          if (currentGameInstance.nPlayers + 1 < currentGameInstance.minPlayers) {
            // If not enough players for the game, show the invite message
            showInviteMessage();
          }
        });
      } else {
        Session.set('gameReady', true);
        hideLoadingModal();

        if (currentGameInstance.nPlayers < currentGameInstance.minPlayers) {
          // If not enough players for the game, show the invite message
          showInviteMessage();
        }
      }

      // Observe changes in the game instance to update the session and jiggle
      // the status field
      GameInstances.find(currentGameInstanceId).observeChanges({
        changed: function (id, fields) {
          var currentGameInstanceId = FlowRouter.getParam("instanceId");
          var currentGameInstance = GameInstances.findOne(currentGameInstanceId);
          Session.set('gameInstance', currentGameInstance);

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
    return Session.get('gameInstance');
  },

  gameStatusString: function () {
    // Return a string that describes the state of the game
    gameInstance = Session.get('gameInstance');
    if (!gameInstance) {
      return '';
    }

    playerN = gameInstance.players.indexOf(Meteor.userId());

    if (gameInstance.status === 'waitingForPlayers') {
      return 'Waiting for players'

    } else if (gameInstance.status === 'playing') {
      if (gameInstance.currentTurnPlayerN === playerN) {
        return 'Your Turn!'
      } else {
        return 'Player ' + parseInt(gameInstance.currentTurnPlayerN + 1) + '\'s Turn'
      }

    } else if(gameInstance.status === 'finished') {
      if (gameInstance.winner === null) {
        return 'It\'s a tie!';
      }

      if (gameInstance.winner === playerN) {
        return 'You Won!'
      } else {
        return 'Player ' + parseInt(gameInstance.winner + 1) + ' Won!'
      }
    }
  },

  isMyTurn: function () {
    // Return whether it's the current player's turn or not
    gameInstance = Session.get('gameInstance');
    if (!gameInstance) {
      return false;
    }

    playerN = gameInstance.players.indexOf(Meteor.userId());

    return (gameInstance.currentTurnPlayerN === playerN);
  },
});

Template.tttBoard.helpers({
  rows: function() {
    // Return the rows of the game instance's grid
    gameInstance = Session.get('gameInstance');
    if (!gameInstance) {
      return null;
    }

    return gameInstance.state.grid;
  },
});

Template.tttColumn.helpers({
  cellPlayer: function(row, col) {
    // Return the player index (or -1) of the given cell
    gameInstance = Session.get('gameInstance');
    if (!gameInstance) {
      return '';
    }
    return gameInstance.state.grid[row][col];
  },

  cell: function(row, col) {
    // Return the player's character for the given cell
    gameInstance = Session.get('gameInstance');
    if (!gameInstance) {
      return '';
    }

    val = gameInstance.state.grid[row][col];

    if (val === -1) {
      return '';
    }

    return playerChars[val];
  },
});

Template.tickTackToe.events({
  "click .ttt.container td": function (event) {
    var cell = $(event.target);
    var row = parseInt(cell.parent().attr('id')[1]);
    var col = parseInt(cell.attr('id')[1]);

    var currentGameInstanceId = FlowRouter.getParam("instanceId");
    var currentGameInstance = Session.get('gameInstance');

    // Do nothing if no running game instance
    if (!currentGameInstance || currentGameInstance.status != 'playing') {
      return;
    }

    // Do nothing if the cell is already taken
    if (currentGameInstance.state.grid[row][col] != -1) {
      return;
    }

    var move = {
      row: row,
      col: col,
    };

    // Try executing the move
    Meteor.call("doMove", FlowRouter.getParam("instanceId"), move, function (err, data) {
      if (err) {
        console.log("Error doing move:", err);
        return;
      }
    });
  },
});
