GameInstances = new Mongo.Collection("game_instances");

var getGameLogic = function(gameType) {
  if (gameType == "ttt") {
    return game_ttt;
  }
};

var getGameAI = function(gameType) {
  if (gameType == "ttt") {
    return ai_ttt;
  }
};

Meteor.methods({
  startGameInstance: function(gameId) {
    // TODO: Get game type from game instance

    var gameType = "ttt";
    var gameLogic = getGameLogic(gameType);

    var gameInstanceId = GameInstances.insert({
      gameId: gameId,
      gameType: gameType,
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

    return gameInstanceId;
  },

  joinGameInstance: function(gameInstanceId) {
    gameInstance = GameInstances.findOne(gameInstanceId);
    if (!gameInstance) {
      throw new Meteor.Error("unkown-game-instance");
    }

    if (gameInstance.players.indexOf(Meteor.userId()) > -1) {
      throw new Meteor.Error("already-joined");
    }

    if (gameInstance.nPlayers >= gameInstance.maxPlayers) {
      throw new Meteor.Error("game-full");
    }

    var set = {
      changedAt: new Date()
    };

    if (gameInstance.status == 'waitingForPlayers' && gameInstance.nPlayers + 1 >= gameInstance.minPlayers) {
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
  },

  addAIPlayer: function(gameInstanceId) {
    gameInstance = GameInstances.findOne(gameInstanceId);
    if (!gameInstance) {
      throw new Meteor.Error("unkown-game-instance");
    }

    if (gameInstance.players.indexOf(Meteor.userId()) == -1) {
      throw new Meteor.Error("not-your-game");
    }

    if (gameInstance.nPlayers >= gameInstance.maxPlayers) {
      throw new Meteor.Error("game-full");
    }

    var set = {
      changedAt: new Date()
    };

    if (gameInstance.status == 'waitingForPlayers' && gameInstance.nPlayers + 1 >= gameInstance.minPlayers) {
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
  },

  doMove: function(gameInstanceId, move) {
    gameInstance = GameInstances.findOne(gameInstanceId);
    if (!gameInstance) {
      throw new Meteor.Error("unkown-game-instance");
    }

    if (gameInstance.status == 'finished') {
      throw new Meteor.Error("game-finished");
    }

    var playerN = -1;

    if (move == 'ai') {
      if (gameInstance.players[gameInstance.currentTurnPlayerN] != 'ai') {
        throw new Meteor.Error("not-ai-turn");
      }

      if (this.isSimulation) {
        return; // Don't run this on client, since we might be using randomness
      }


      var gameAI = getGameAI(gameInstance.gameType);
      move = gameAI.getNextMove(gameInstance.state, gameInstance.moves);

      playerN = gameInstance.currentTurnPlayerN;
    } else {
      playerN = gameInstance.players.indexOf(Meteor.userId());
    }

    if (playerN == -1) {
      throw new Meteor.Error("not-your-game");
    }

    if (gameInstance.currentTurnPlayerN != playerN) {
      throw new Meteor.Error("not-your-turn");
    }

    move.playerN = playerN;

    var gameLogic = getGameLogic(gameInstance.gameType);

    if (!gameLogic.checkMove(gameInstance.state, move)) {
      throw new Meteor.Error("invalid-move");
    }

    var newState = gameLogic.updateState(gameInstance.state, move);

    sets = {
      state: newState,
      currentTurnPlayerN: gameLogic.nextTurnPlayerN(move),
      changedAt: new Date()
    }

    var win = gameLogic.checkWin(gameInstance.state, move, newState, gameInstance.moves);
    if (win != -1) {
      sets.status = 'finished';
      if (win >= 0) {
        sets.winner = win;
      }
    }

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

    return win != -1;
  },
});
