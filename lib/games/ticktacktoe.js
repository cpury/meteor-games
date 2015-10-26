game_ttt = {
  minPlayers: 2,
  maxPlayers: 2,

  initState: function() {
    return {
      grid: [[null, null, null], [null, null, null], [null, null, null]]
    };
  },

  checkMove: function(state, move) {
    if (!move || move.row == null || move.col == null ||
      move.playerN == null || move.playerN < 0 || move.playerN > 1 ||
      move.row < 0 || move.row > 2 || move.col < 0 || move.col > 2 ||
      state.grid[move.row][move.col] != null) {
      return false;
    }

    return true;
  },

  updateState: function(state, move) {
    state.grid[move.row][move.col] = move.playerN;
    return state;
  },

  nextTurnPlayerN: function(moverN, move) {
    return (moverN + 1) % 2;
  },

  hasEnded: function(state) {
    // Check if someone has won and return the n of the player
    return null;
  },
};
