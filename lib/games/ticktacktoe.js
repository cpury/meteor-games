gameLogics.ttt = {
  minPlayers: 2,
  maxPlayers: 2,

  initState: function() {
    return {
      grid: [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]
    };
  },

  checkMove: function(state, move) {
    if (!move || move.row == null || move.col == null ||
      move.playerN == null || move.playerN < 0 || move.playerN > 1 ||
      move.row < 0 || move.row > 2 || move.col < 0 || move.col > 2 ||
      state.grid[move.row][move.col] != -1) {
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

  checkWin: function(oldState, move, newState, movesHistory) {
    // Check if this move wins the game
    // Return -1 for still going, n of winning player or -2 for tie
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
      return move.playerN;
    }
    if ((isChecked(row - 1, col - 1) && isChecked(row + 1, col + 1))
     || (isChecked(row - 2, col - 2) && isChecked(row - 1, col - 1))
     || (isChecked(row + 1, col + 1) && isChecked(row + 2, col + 2))) {
      return move.playerN;
    }
    if ((isChecked(row - 1, col) && isChecked(row + 1, col))
     || (isChecked(row - 2, col) && isChecked(row - 1, col))
     || (isChecked(row + 1, col) && isChecked(row + 2, col))) {
      return move.playerN;
    }
    if ((isChecked(row - 1, col + 1) && isChecked(row + 1, col - 1))
     || (isChecked(row - 2, col + 2) && isChecked(row - 1, col + 1))
     || (isChecked(row + 1, col - 1) && isChecked(row + 2, col - 2))) {
      return move.playerN;
    }

    if (movesHistory.length == 8) {
      return -2;
    }

    return -1;
  },
};

gameAis.ttt = {
  getNextMove: function(state, movesHistory) {
    var getFreeFields = function (grid) {
      var freeFields = [];
      for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 3; c++) {
          if (grid[r][c] == -1) {
            freeFields.push([r, c]);
          }
        }
      }

      return freeFields;
    }

    var freeFields = getFreeFields(state.grid);
    var field = freeFields[Math.floor(Math.random() * freeFields.length)];

    return {
      row: field[0],
      col: field[1]
    };
  }
};
