var component = gameComponent;

Template.tickTackToe.onCreated(function () {
  var self = this;

  self.autorun(function () {
    Session.set("loadingState", true);

    self.subscribe("gameInstances.single", component.getGameInstanceId(), function () {
      var gameInstance = component.getGameInstance();

      // If the game instance given in the URL doesn't exist, go home
      if (!gameInstance) {
        Session.set("loadingState", false);
        return FlowRouter.go('/');
      }

      // If the user is not part of this game instance, let her join
      if (!gameInstance.isPlayer(Meteor.userId())) {
        Meteor.call("joinGameInstance", component.getGameInstanceId(), function (err, data) {
          if (data === false) {
            return;
          }

          if (err) {
            console.log("Error while joining game:", err);
            return;
          }

          Session.set("loadingState", false);

          if (component.getGameInstance().nPlayers + 1 < gameInstance.minPlayers) {
            // If not enough players for the game, show the invite message
            showInviteMessage();
          }
        });
      } else {
        Session.set("loadingState", false);

        if (component.getGameInstance().nPlayers < gameInstance.minPlayers) {
          // If not enough players for the game, show the invite message
          showInviteMessage();
        }
      }

      // Observe changes in the game instance to animate the status field
      GameInstances.find(component.getGameInstanceId()).observeChanges({
        changed: function (id, fields) {
          if (fields.status != null || fields.currentTurnPlayerN != null) {
            // Animate the status string
            gameInstance = component.getGameInstance()
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

Template.tickTackToe.helpers({
  currentGameInstance: function () {
    return component.getGameInstance();
  },

  gameStatusString: function () {
    return component.getGameStatusString();
  },

  isMyTurn: function () {
    return component.isMyTurn();
  },
});

Template.tttBoard.helpers({
  rows: function() {
    // Return the rows of the game instance's grid
    var gameInstance = component.getGameInstance();
    if (!gameInstance) {
      return null;
    }

    return gameInstance.state.grid;
  },
});

Template.tttColumn.helpers({
  cellPlayer: function(row, col) {
    // Return the player index (or -1) of the given cell
    var gameInstance = component.getGameInstance();
    if (!gameInstance) {
      return '';
    }

    return gameInstance.state.grid[row][col];
  },

  cell: function(row, col) {
    // Return the player's character for the given cell
    var gameInstance = component.getGameInstance();
    if (!gameInstance) {
      return '';
    }

    var val = gameInstance.state.grid[row][col];

    if (val === -1) {
      return '';
    }

    return component.playerChars[val];
  },
});

Template.tickTackToe.events({
  "click .ttt.container td": function (event) {
    var cell = $(event.target);
    var row = parseInt(cell.parent().attr('id')[1]);
    var col = parseInt(cell.attr('id')[1]);

    var gameInstance = component.getGameInstance();

    // Do nothing if no running game instance
    if (!gameInstance || !gameInstance.isPlaying()) {
      return;
    }

    // Do nothing if the cell is already taken
    if (gameInstance.state.grid[row][col] != -1) {
      return;
    }

    var move = {
      row: row,
      col: col,
    };

    // Try executing the move
    Meteor.call("doMove", component.getGameInstanceId(), move, function (err, data) {
      if (err) {
        console.log("Error doing move:", err);
        return;
      }
    });
  },
});
