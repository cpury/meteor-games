// Define the global gameLogics and gameAis objects first.

// Each gameLogic needs the following members:
// minPlayers: The minimum number of players required to play this game
// maxPlayers: The maximum number of players required to play this game
// initState(): Return the empty state
// checkMove(state, move): Return true if the given move is valid in the given state
// updateState(state, move): Return new state after given move
// nextTurnPlayerN(move): Based on move, return the index of the next turn's player
// checkWin(oldState, move, newState, movesHistory): Based on the old state,
//     the executed move, the resulting new state, and a history of previous
//     moves, determine if the game is finished and who won.
//     Return index of winning player, or -2 for a tie, or -1 for ongoing.

// Each gameAi needs the following members:
// getNextMove(state, movesHistory): Given the current state and history of
//     moves, return the next move the AI player should execute.

gameLogics = {};
gameAis = {};
