// Defines a single game instance
GameInstances = new Mongo.Collection("game_instances");

// Defines a kind of game
Games = new Mongo.Collection("games");

GameInstances.helpers({
  // Returns the corresponding game instance
  getGame: function() {
    return Games.findOne(this.gameId);
  },

  // Returns the author user instance
  getAuthor: function() {
    return Meteor.users.findOne(this.authorId);
  },

  // Returns a cursor through the players participating in this instance.
  // Note: The order is not in the order joined
  getPlayers: function() {
    return Meteor.users.find({_id: {$in: this.players}});
  },

  // Returns true if the given user is playing in this instance.
  isPlayer: function(userId) {
    return this.players.indexOf(userId) !== -1;
  },

  // Returns the playerN of the given user id, or -1 if not playing
  getPlayerNOfUser: function(userId) {
    return this.players.indexOf(userId);
  },

  // Returns true if the given user has the current turn.
  hasTurn: function(userId) {
    return this.currentTurnPlayerN === this.getPlayerNOfUser(userId);
  },

  // Returns true if the game instance has at least one AI player
  hasAIPlayer: function() {
    return _.contains(this.players, 'ai');
  },

  // Returns true if the game instance has at least one human player
  hasHumanPlayer: function() {
    return _.some(this.players, function(player) {
      return player !== 'ai';
    });
  },

  // Returns true if the game instance has started
  hasStarted: function() {
    return this.status !== 'waitingForPlayers';
  },

  // Returns true if the game instance is currently being played
  isPlaying: function() {
    return this.status === 'playing';
  },

  // Returns true if the game instance has finished
  hasFinished: function() {
    return this.status === 'finished';
  },

  // Returns true if the game instance was a draw
  isDraw: function() {
    return this.status === 'finished' && this.winner === null;
  },

  // Returns true if the given user is the winner of this instance
  isWinner: function(userId) {
    return this.winner === this.getPlayerNOfUser(userId);
  }
});
