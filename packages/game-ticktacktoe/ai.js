// Defines AI for the Tick Tack Toe game

// Right now simply random
gameAis.ttt = {
  getNextMove: function (state, movesHistory) {
    // Determine the next move. Simply select a random free cell

    var getFreeCells = function (grid) {
      // Returns all the free cells in the grid
      var freeCells = [];
      for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 3; c++) {
          if (grid[r][c] === -1) {
            freeCells.push([r, c]);
          }
        }
      }

      return freeCells;
    }

    // Select a random free cell
    var freeCells = getFreeCells(state.grid);
    var field = freeCells[Math.floor(Math.random() * freeCells.length)];

    return {
      row: field[0],
      col: field[1]
    };
  }
};
