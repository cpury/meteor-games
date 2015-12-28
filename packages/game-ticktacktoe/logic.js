// Defines game logic for the Tick Tack Toe game

gameLogics.ttt = {
  minPlayers: 2,
  maxPlayers: 2,

  initState: function () {
    // Initialize the empty state. Here, an empty grid.
    return {
      grid: [
        [-1, -1, -1],
        [-1, -1, -1],
        [-1, -1, -1]
      ]
    };
  },

  checkMove: function (state, move) {
    // Check if the given move is valid in the given state

    if (!move || move.row === null || move.col === null ||
      move.playerN === null || move.playerN < 0 || move.playerN > 1 ||
      move.row < 0 || move.row > 2 || move.col < 0 || move.col > 2 ||
      state.grid[move.row][move.col] != -1) {
      return false;
    }

    return true;
  },

  updateState: function (state, move) {
    // Update the state based on the given move
    state.grid[move.row][move.col] = move.playerN;
    return state;
  },

  nextTurnPlayerN: function (move) {
    // Determine the next player's index. Simple round-robin.
    return (move.playerN + 1) % 2;
  },

  checkWin: function (oldState, move, newState, movesHistory) {
    // Check if this move wins the game.
    // This looks at the cell this move colored in, and all possible
    // winning chains it could be a part of.

    var isChecked = function (row, col) {
      // Helper that returns true if the given position contains the current
      // player's check. Works with off-the-grid coordinates (will return false).
      if (row < 0 || row > 2 || col < 0 || col > 2) {
        return false;
      }

      return oldState.grid[row][col] === move.playerN;
    };

    row = move.row;
    col = move.col;

    // Check for each possible chain this cell could be a part of.
    // If one of the chains is complete, return the current player's index.

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

    // Simply return a draw if the game has been going on for 9 moves now
    if (movesHistory.length === 8) {
      return -2;
    }

    // Nobody won and there are still free cells
    return -1;
  },
};
