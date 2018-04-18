export class GameError extends Error {}

export class SteppedOnMine extends GameError {}

// winning the game is not technically an error, but it is something that stops the normal flow of the game,
// specifically, by ending it.
export class GameWon extends GameError {}

export class NotEnoughFlags extends GameError {}

export class CellAlreadyFlagged extends GameError {}

export class GameOver extends GameError {}

