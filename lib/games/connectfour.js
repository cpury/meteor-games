game_cf = {
  minPlayers: 2,
  maxPlayers: 2,

  initState: function() {
    return {
      grid: [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null]
      ]
    };
  },

  checkMove: function(state, move) {
    if (
      !move || move.col == null ||
      move.playerN == null || move.playerN < 0 || move.playerN > 1 ||
      move.col < 0 || move.col > 6 ||
      state.grid[0][move.col] != null
    ) {
      return false;
    }

    return true;
  },

  getFirstFreeRowInColumn: function(grid, column) {
    for (var i = 5; i >= 0; i -= 1) {
      if (grid[i][column] == null) {
        return i;
      }
    }
    return false;
  },

  updateState: function(state, move) {
    row = this.getFirstFreeRowInColumn(state.grid, move.col)
    state.grid[row][move.col] = move.playerN;
    return state;
  },

  nextTurnPlayerN: function(move) {
    return (move.playerN + 1) % 2;
  },

  checkWin: function(oldState, move, newState, movesHistory) {
    // Check if this move wins the game
    // Return -1 for still going, n of winning player or -2 for tie

    var positionHash = function(row, col) {
      return row + 10 * col;
    };

    checked = {};
    checked[positionHash(move.row, move.col)] = 1;

    // TODO Implement algorithm

    var recursiveCheck = function(row, col) {

    }

    return -1;
  },
};

ai_cf = {
  getNextMove: function(state, movesHistory) {
    var getFreeColumns = function (grid) {
      var freeColumns = [];
      for (var c = 0; c < 7; c++) {
        if (grid[0][c] == null) {
          freeColumns.push(c);
        }
      }

      return freeColumns;
    }

    var freeColumns = getFreeColumns(state.grid);
    var column = freeColumns[Math.floor(Math.random() * freeColumns.length)];

    return {
      col: column
    };
  }
};
