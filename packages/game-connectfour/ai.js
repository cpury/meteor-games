// Defines AI for the Connect Four game

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
