// Defines all methods used for basic game logic

Meteor.methods({
  startGameInstance: function (gameId) {
    // Method to start a new game instance with the given game id
    // Returns the new game instance object's id

    // Don't run this on client
    if (this.isSimulation) {
      return false;
    }

    // Retrieve game and gameLogic, or throw errors if not found
    game = Games.findOne({"gameId": gameId});

    if (!game) {
      return Meteor.Error("unknown-game");
    }

    var gameLogic = gameLogics[gameId];

    if (!gameLogic) {
      return Meteor.Error("game-not-implemented");
    }

    // Create a game instance and store its id
    var gameInstanceId = GameInstances.insert({
      gameId: gameId,
      status: 'waitingForPlayers',
      winner: null,
      authorId: Meteor.userId(),
      players: [Meteor.userId()],
      nPlayers: 1,
      minPlayers: gameLogic.minPlayers,
      maxPlayers: gameLogic.maxPlayers,
      currentTurnPlayerN: 0,
      nMoves: 0,
      moves: [],
      state: gameLogic.initState(),
      createdAt: new Date(),
      changedAt: new Date()
    });

    // Increase counter of games started
    Games.update(
      {
        "gameId": gameId
      },
      {
        $inc: {nGamesStarted: 1}
      }
    );

    return gameInstanceId;
  },

  joinGameInstance: function (gameInstanceId) {
    // Have the current player join the given game instance, if possible

    // Don't run this on client
    if (this.isSimulation) {
      return false;
    }

    // Retrieve given game instance or throw error
    gameInstance = GameInstances.findOne(gameInstanceId);
    if (!gameInstance) {
      throw new Meteor.Error("unkown-game-instance");
    }

    // Check if the user has already joint this game
    if (gameInstance.players.indexOf(Meteor.userId()) > -1) {
      throw new Meteor.Error("already-joined");
    }

    // Check if the game is full already
    if (gameInstance.nPlayers >= gameInstance.maxPlayers) {
      throw new Meteor.Error("game-full");
    }

    // We might have to set different fields, so keep it flexible
    var set = {
      changedAt: new Date()
    };

    // If this new player would fill the game, set the status to 'playing'
    if (
      gameInstance.status === 'waitingForPlayers'
      && gameInstance.nPlayers + 1 >= gameInstance.minPlayers
    ) {
      set.status = 'playing';
    }

    GameInstances.update(
      {
        "_id": gameInstanceId
      },
      {
        $inc: {nPlayers: 1},
        $push: {players: Meteor.userId()},
        $set: set
      }
    );

    return true;
  },

  addAIPlayer: function (gameInstanceId) {
    // Have an AI player join the game instance

    // Don't run this on client
    if (this.isSimulation) {
      return false;
    }

    // Retrieve game instance or throw error
    gameInstance = GameInstances.findOne(gameInstanceId);
    if (!gameInstance) {
      throw new Meteor.Error("unkown-game-instance");
    }

    // Check if calling user is part of the game
    if (gameInstance.players.indexOf(Meteor.userId()) === -1) {
      throw new Meteor.Error("not-your-game");
    }

    // Check if the game is full already
    if (gameInstance.nPlayers >= gameInstance.maxPlayers) {
      throw new Meteor.Error("game-full");
    }

    // We might have to set different fields, so keep it flexible
    var set = {
      changedAt: new Date()
    };

    // If the ai player would fill the game, set the status to 'playing'
    if (
      gameInstance.status === 'waitingForPlayers'
      && gameInstance.nPlayers + 1 >= gameInstance.minPlayers
    ) {
      set.status = 'playing';
    }

    GameInstances.update(
      {
        "_id": gameInstanceId
      },
      {
        $inc: {nPlayers: 1},
        $push: {players: 'ai'},
        $set: set
      }
    );

    return true;
  },

  doMove: function (gameInstanceId, move) {
    // Have the current user execute the given move on the given game instance
    // If 'move' is set to 'ai', this causes the AI to make the next move

    // Retrieve game instance or throw error
    gameInstance = GameInstances.findOne(gameInstanceId);
    if (!gameInstance) {
      throw new Meteor.Error("unkown-game-instance");
    }

    // Throw error if the game has ended already
    if (gameInstance.status === 'finished') {
      throw new Meteor.Error("game-finished");
    }

    // playerN is supposed to be the index of the moving player
    var playerN = -1;

    // Treat AI moves differently
    if (move === 'ai') {
      // Check if the calling user is part of the game
      if (gameInstance.players.indexOf(Meteor.userId()) === -1) {
        throw new Meteor.Error("not-your-game")
      }

      // Check if the next player is indeed an AI player
      if (gameInstance.players[gameInstance.currentTurnPlayerN] !== 'ai') {
        throw new Meteor.Error("not-ai-turn");
      }

      // Don't run this on client, since we might be using randomness
      if (this.isSimulation) {
        return false;
      }

      // Call AI logic to get the next move
      var gameAI = gameAis[gameInstance.gameId];
      move = gameAI.getNextMove(gameInstance.state, gameInstance.moves);

      playerN = gameInstance.currentTurnPlayerN;
    } else {
      playerN = gameInstance.players.indexOf(Meteor.userId());

      // Check if the calling user is part of the game
      if (playerN === -1) {
        throw new Meteor.Error("not-your-game");
      }

      // Check if its actually the player's turn
      if (gameInstance.currentTurnPlayerN != playerN) {
        throw new Meteor.Error("not-your-turn");
      }
    }

    // Set the move object's playerN property
    move.playerN = playerN;

    var gameLogic = gameLogics[gameInstance.gameId];

    // Check if the move is valid
    if (!gameLogic.checkMove(gameInstance.state, move)) {
      throw new Meteor.Error("invalid-move");
    }

    // Update the game state
    var newState = gameLogic.updateState(gameInstance.state, move);

    // Flexible update on the game instance object
    // Update the state, also the determine who's turn it is next
    sets = {
      state: newState,
      currentTurnPlayerN: gameLogic.nextTurnPlayerN(move),
      changedAt: new Date()
    }

    // Check if someone won, or if its a draw
    var win = gameLogic.checkWin(gameInstance.state, move, newState, gameInstance.moves);
    if (win != -1) {
      // The game has ended
      sets.status = 'finished';

      // Is there a winner? If so, add it to the sets object
      if (win >= 0) {
        sets.winner = win;
      }

      // Increase the nGamesFinished counter on the game object
      Games.update(
        {
          "gameId": gameInstance.gameId
        },
        {
          $inc: {nGamesFinished: 1}
        }
      );
    }

    // Finally, update the game instance object based on the sets object
    GameInstances.update(
      {
        "_id": gameInstanceId
      },
      {
        $inc: {nMoves: 1},
        $push: {moves: move},
        $set: sets
      }
    );

    // Return whether the game has ended or not
    return win != -1;
  },
});
