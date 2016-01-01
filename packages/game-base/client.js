// Contains high-level helpers to use in the client

gameComponent = {
  // The characters used for each player's cell
  playerChars: ['X', 'O'],

  // Reactively returns the current game instance id
  getGameInstanceId: function() {
    return FlowRouter.getParam("instanceId");
  },

  // Reactively returns the current game instance
  getGameInstance: function() {
    return GameInstances.findOne(this.getGameInstanceId());
  },

  // Return a string that describes the state of the game
  getGameStatusString: function() {
    var gameInstance = this.getGameInstance();
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

  // Return whether it's the current player's turn or not
  isMyTurn: function() {
    var gameInstance = this.getGameInstance();
    if (!gameInstance) {
      return false;
    }

    return gameInstance.hasTurn(Meteor.userId());
  }
};
