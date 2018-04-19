import {BoardModel, GameState} from "./board";


export class GameOverError extends Error {}

/**
 * The state of a game is either ended or ongoing, if it is ended, it is either won or lost.
 * at every step of the game, the GameModel sends a request to the BoardModel to update its state,
 * and changes the game state according to the response from the BoardModel.
 */
export class GameModel {
    constructor() {
        this._board = null;
        this.gameOver = true;
    }

    createBoard(width, height, mines) {
        this.board = new BoardModel(width, height, mines);
    }

    get board () {return this._board};
    set board (board) {this._board = board};

    get flags() { return this.board.flags; }

    startGame() {
        this.gameOver = false;
    }

    exposeCell(x, y) {
        if(this.gameOver)
            throw new GameOverError();

        const res = this.board.exposeCell(x,y);

        switch(res) {
            case GameState.STEPPED_ON_MINE:
                this.endGame();
                return res;

            case GameState.ALL_MINES_DISCOVERD:
                this.endGame();
                return res;

            default:
                break;
        }
    }

    populateBoard() {
        this.board.populateBoard();
    }

    endGame() {
        this.gameOver = true;
    }


    toggleFlag(x,y) {
        const res = this.board.toggleFlag(x,y);

        switch (res) {
            case GameState.TOO_MANY_FLAGS:
                return res;

            case GameState.ALL_MINES_FLAGGED:
                this.endGame();
                return res;

            default:
                break;
        }
    }


    // creates a copy of the board for the GUI to render
    getSnapshot() {
        return this.board.getSnapshot();
    }
}