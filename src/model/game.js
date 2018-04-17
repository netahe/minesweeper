import {BoardModel} from "./board";

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
                break;
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

    flagMine(x, y) {
        this.board.flagMine(x,y);

        if(this.board.allMinesDiscovered()) {
            this.gameWon = true;
            this.endGame();
        }
    }

    // creates a copy of the board for the GUI
    getSnapshot() {
        return this.board.getSnapshot();
    }
}