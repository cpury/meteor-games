gameLogics.cf = {
  minPlayers: 2,
  maxPlayers: 2,

  initState: function() {
    return {
      grid: [
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1]
      ]
    };
  },

  checkMove: function(state, move) {
    if (
      !move || move.col === null ||
      move.playerN === null || move.playerN < 0 || move.playerN > 1 ||
      move.col < 0 || move.col > 6 ||
      state.grid[0][move.col] != -1
    ) {
      return false;
    }

    return true;
  },

  getFirstFreeRowInColumn: function(grid, column) {
    for (var i = 5; i >= 0; i -= 1) {
      if (grid[i][column] === -1) {
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
    // This implements a DP-like algorithm that counts
    // chains of fields.

    var getSign = function sign(x) {
      // Source: http://stackoverflow.com/a/21363133/1257278
      return x > 0 ? 1 : x < 0 ? -1 : x;
    }

    var playerNToSign = function(n) {
      if (n == 0) {
        return 1;
      } else if (n == 1) {
        return -1;
      }
      return 0;
    }

    var signToPlayerN = function(s) {
      if (s == 1) {
        return 0
      } else if (s == -1) {
        return 1;
      }
      return 0;
    }

    var checkField = function(left, topleft, top, topright, self) {
      // Given the values for fields to the left, top-left, top and top-right,
      // calculate winning values for the field in self.
      sign = playerNToSign(self);

      if (sign == 0) {
        return {
          horizontal: 0,
          diagonal1: 0,
          vertical: 0,
          diagonal2: 0
        }
      }

      field = {};

      if (left && getSign(left.horizontal) === sign) {
        field.horizontal = left.horizontal + sign;
      } else {
        field.horizontal = sign;
      }

      if (topleft && getSign(topleft.diagonal1) === sign) {
        field.diagonal1 = topleft.diagonal1 + sign;
      } else {
        field.diagonal1 = sign;
      }

      if (top && getSign(top.vertical) === sign) {
        field.vertical = top.vertical + sign;
      } else {
        field.vertical = sign;
      }

      if (topright && getSign(topright.diagonal2) === sign) {
        field.diagonal2 = topright.diagonal2 + sign;
      } else {
        field.diagonal2 = sign;
      }

      return field;
    };

    var dpGrid = [];

    var getDpGridOrNull = function(row, col) {
      if (row < 0 || row >= dpGrid.length) {
        return null;
      }
      if (col < 0 || col >= dpGrid[row].length) {
        return null;
      }
      return dpGrid[row][col];
    };

    for (var row = 0; row < newState.grid.length; row++) {
      dpGrid.push([]);
      for (var col = 0; col < newState.grid[row].length; col++) {

        var val = checkField(
          getDpGridOrNull(row, col - 1),
          getDpGridOrNull(row - 1, col - 1),
          getDpGridOrNull(row - 1, col),
          getDpGridOrNull(row - 1, col + 1),
          newState.grid[row][col]
        );

        if (Math.abs(val.horizontal) >= 4) {
          return signToPlayerN(getSign(val.horizontal));
        }
        if (Math.abs(val.diagonal1) >= 4) {
          return signToPlayerN(getSign(val.diagonal1));
        }
        if (Math.abs(val.vertical) >= 4) {
          return signToPlayerN(getSign(val.vertical));
        }
        if (Math.abs(val.diagonal2) >= 4) {
          return signToPlayerN(getSign(val.diagonal2));
        }

        dpGrid[row].push(val);
      }
    }

    return -1;
  },
};

gameAis.cf = {
  getNextMove: function(state, movesHistory) {
    var getFreeColumns = function (grid) {
      var freeColumns = [];
      for (var c = 0; c < 7; c++) {
        if (grid[0][c] === -1) {
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
