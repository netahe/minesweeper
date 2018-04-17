import {BoardModel, GameState} from "./board";
import {GameWon, NotEnoughFlags, SteppedOnMine} from "./errors";

export class GameOverError extends Error {
    constructor() {
        super();

    }
}

/**
 * The state of a game is either ended or ongoing, if it is ended, it is either won or lost.
 * at every step of the game, the GameModel sends a request to the BoardModel to update its state,
 * and changes the game state according to the response from the BoardModel.
 */
export class GameModel {
    constructor() {
        this._board = null;
        this.gameOver = true;
        this.gameWon = false;
    }

    createBoard(width, height, mines) {
        this.board = new BoardModel(width, height, mines);
    }

    get board () {return this._board};
    set board (board) {this._board = board};

    startGame() {
        this.gameOver = false;
    }

    exposeCell(x, y) {
        const res = this.board.exposeCell(x,y);

        switch(res) {
            case GameState.STEPPED_ON_MINE:
                throw new SteppedOnMine('You lost!!!');

            case GameState.OK:
                break;
        }
    }

    populateBoard() {
        this.board.populateBoard();
    }

    endGame() {
        this.gameOver = true;
    }

    unflagCell(x,y) {
        const res = this.board.unflagCell(x,y);

        switch (res) {
            case GameState.CELL_NOT_FLAGGED:
                this.flagCell(x,y);
                break;
            case GameState.OK:
                break;
        }
    }

    flagCell(x, y) {
        const res = this.board.flagMine(x,y);

        switch(res) {
            case GameState.ALL_MINES_FLAGGED:
                throw new GameWon('You win!!!');

            case GameState.TOO_MANY_FLAGS:
                throw new NotEnoughFlags();

            case GameState.CELL_ALREADY_FLAGGED:
                this.unflagCell(x,y);

            case GameState.OK:
                break;
        }
    }

    // creates a copy of the board for the GUI
    getSnapshot() {
        return this.board.getSnapshot();
    }
}