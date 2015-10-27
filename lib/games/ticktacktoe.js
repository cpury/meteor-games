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

  nextTurnPlayerN: function(move) {
    return (move.playerN + 1) % 2;
  },

  hasEnded: function(oldState, move, newState) {
    // Check if this move wins the game
    var isChecked = function(row, col) {
      if (row < 0 || row > 2 || col < 0 || col > 2) {
        return false;
      }
      return oldState.grid[row][col] == move.playerN;
    };

    row = move.row;
    col = move.col;

    if ((isChecked(row, col - 1) && isChecked(row, col + 1))
     || (isChecked(row, col - 2) && isChecked(row, col - 1))
     || (isChecked(row, col + 1) && isChecked(row, col + 2))) {
      return true
    }
    if ((isChecked(row - 1, col - 1) && isChecked(row + 1, col + 1))
     || (isChecked(row - 2, col - 2) && isChecked(row - 1, col - 1))
     || (isChecked(row + 1, col + 1) && isChecked(row + 2, col + 2))) {
      return true
    }
    if ((isChecked(row - 1, col) && isChecked(row + 1, col))
     || (isChecked(row - 2, col) && isChecked(row - 1, col))
     || (isChecked(row + 1, col) && isChecked(row + 2, col))) {
      return true
    }
    if ((isChecked(row - 1, col + 1) && isChecked(row + 1, col - 1))
     || (isChecked(row - 2, col + 2) && isChecked(row - 1, col + 1))
     || (isChecked(row + 1, col - 1) && isChecked(row + 2, col - 2))) {
      return true
    }

    return null;
  },
};
