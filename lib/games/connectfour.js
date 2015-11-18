// Defines game logic and AI for the Connect Four game

// Connect Four logic
gameLogics.cf = {
  minPlayers: 2,
  maxPlayers: 2,

  initState: function () {
    // Initialize the empty state. Here, an empty grid.

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

  checkMove: function (state, move) {
    // Check if the given move is valid in the given state

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

  getFirstFreeRowInColumn: function (grid, column) {
    // Helper to determine the first free row in a given column

    for (var i = 5; i >= 0; i -= 1) {
      if (grid[i][column] === -1) {
        return i;
      }
    }
    return false;
  },

  updateState: function (state, move) {
    // Update the state based on the given move

    row = this.getFirstFreeRowInColumn(state.grid, move.col)
    state.grid[row][move.col] = move.playerN;
    return state;
  },

  nextTurnPlayerN: function (move) {
    // Determine the next player's index. Simple round-robin.
    return (move.playerN + 1) % 2;
  },

  checkWin: function (oldState, move, newState, movesHistory) {
    // Check if this move wins the game
    // This implements a DP-like algorithm that counts
    // chains of neighboring, same-colored cells.

    // TODO: Check for draws

    // We're counting positively for the first player, and negatively for
    // the second. That's why we need some sign methods defined below.

    var getSign = function sign(x) {
      // Get the sign value of a given value (-1, 1 or 0)
      // Source: http://stackoverflow.com/a/21363133/1257278 :>
      return x > 0 ? 1 : x < 0 ? -1 : x;
    }

    var playerNToSign = function (n) {
      // Helper to convert a player index to a sign
      if (n == 0) {
        return 1;
      } else if (n == 1) {
        return -1;
      }
      return 0;
    }

    var signToPlayerN = function (s) {
      // Helper to convert a sign back to a player index
      if (s == 1) {
        return 0
      } else if (s == -1) {
        return 1;
      }
      return 0;
    }

    var checkField = function (left, topleft, top, topright, self) {
      // Helper called on each field to determine chains.
      // Given the values for fields to the left, top-left, top and top-right,
      // calculate winning values for the field in self.
      // Returns an object with counters for each possible orientation.

      sign = playerNToSign(self);

      // If this is an empty cell, return 0 for all
      if (sign == 0) {
        return {
          horizontal: 0,
          diagonal1: 0,
          vertical: 0,
          diagonal2: 0
        }
      }

      // For each possible orientation, check if the current cell's color
      // matches the ongoing chain. If so, add the sign to the chain length,
      // if not, reset it to 1 or -1.

      field = {};

      // Horizontal chains
      if (left && getSign(left.horizontal) === sign) {
        field.horizontal = left.horizontal + sign;
      } else {
        field.horizontal = sign;
      }

      // Diagonal chains from top left to bottom right
      if (topleft && getSign(topleft.diagonal1) === sign) {
        field.diagonal1 = topleft.diagonal1 + sign;
      } else {
        field.diagonal1 = sign;
      }

      // Vertical chains
      if (top && getSign(top.vertical) === sign) {
        field.vertical = top.vertical + sign;
      } else {
        field.vertical = sign;
      }

      // Diagonal chains from top right to bottom left
      if (topright && getSign(topright.diagonal2) === sign) {
        field.diagonal2 = topright.diagonal2 + sign;
      } else {
        field.diagonal2 = sign;
      }

      return field;
    };

    // This is the DP-like grid we're using to keep track of chain lengths
    var dpGrid = [];

    var getDpGridOrNull = function (row, col) {
      // Helper to retrieve a cell's value in the dpGrid,
      // or null if outside boundaries
      if (row < 0 || row >= dpGrid.length) {
        return null;
      }

      if (col < 0 || col >= dpGrid[row].length) {
        return null;
      }

      return dpGrid[row][col];
    };

    // Now go through the game's grid cell by cell and create the dpGrid
    for (var row = 0; row < newState.grid.length; row++) {
      dpGrid.push([]);
      for (var col = 0; col < newState.grid[row].length; col++) {

        // Get the chain length values for each direction, based on previous cells
        var val = checkField(
          getDpGridOrNull(row, col - 1),
          getDpGridOrNull(row - 1, col - 1),
          getDpGridOrNull(row - 1, col),
          getDpGridOrNull(row - 1, col + 1),
          newState.grid[row][col]
        );

        // Determine if any of the orientations contain a chain of winning
        // length. If so, return the player index associated with the chain's sign.

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

// Connect Four AI player
// Right now simply random
gameAis.cf = {
  getNextMove: function (state, movesHistory) {
    // Determine the next move. Simply select a random free column
    var getFreeColumns = function (grid) {
      // Helper that returns all columns that have free space
      var freeColumns = [];

      for (var c = 0; c < 7; c++) {
        if (grid[0][c] === -1) {
          freeColumns.push(c);
        }
      }

      return freeColumns;
    }

    // Select a random free column
    var freeColumns = getFreeColumns(state.grid);
    var column = freeColumns[Math.floor(Math.random() * freeColumns.length)];

    return { col: column };
  }
};
