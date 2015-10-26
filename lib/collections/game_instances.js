GameInstances = new Mongo.Collection("game_instances");

var getGameLogic = function(gameType) {
  if (gameType == "ttt") {
    return game_ttt;
  }
};

Meteor.methods({
  startGameInstance: function(gameId) {
    // TODO: Get game type from game instance
    // TODO: More complex opponent invitation logic
    // TODO: Add game status code to signify what's going on

    var gameType = "ttt";
    var gameLogic = getGameLogic(gameType);

    var gameInstanceId = GameInstances.insert({
      gameId: gameId,
      gameType: gameType,
      status: 'starting',
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

    GameInstances.update(
      {
        "_id": gameInstanceId
      },
      {
        $inc: {nPlayers: 1},
        $push: {players: Meteor.userId()},
        $set: {changedAt: new Date()}
      }
    );
  },

  doMove: function(gameInstanceId, move) {
    gameInstance = GameInstances.findOne(gameInstanceId);
    if (!gameInstance) {
      throw new Meteor.Error("unkown-game-instance");
    }

    var moverN = gameInstance.players.indexOf(Meteor.userId());
    move.playerN = moverN;

    if (moverN == -1) {
      throw new Meteor.Error("not-your-game");
    }

    if (gameInstance.currentTurnPlayerN != moverN) {
      throw new Meteor.Error("not-your-turn");
    }

    var gameLogic = getGameLogic(gameInstance.gameType);

    if (!gameLogic.checkMove(gameInstance.state, move)) {
      throw new Meteor.Error("invalid-move");
    }

    var newState = gameLogic.updateState(gameInstance.state, move);

    // TODO: Probably add more info to move, like player id etc.

    sets = {
      state: newState,
      currentTurnPlayerN: gameLogic.nextTurnPlayerN(moverN, move),
      changedAt: new Date()
    }

    var winnerN = gameLogic.hasEnded(newState);
    if (winnerN != null) {
      sets['status'] = 'finished';
      sets['winner'] = gameInstance.players[winnerN];
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

    return winnerN != null;
  },
});
