import {BoardModel} from "./board";

export class GameOverError extends Error {
    constructor() {
        super();

    }
}

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
        if( this.gameOver === true) {
            throw new GameOverError();
        }

        let result = this.board.exposeCell(x,y);
        if(result === 'gameOver') {
            this.gameWon = false;

            this.endGame();
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

        if(this.board.allMinesDiscoverd()) {
            this.gameWon = true;
            this.endGame();
        }

    }
}