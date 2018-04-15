const GAMEOVER = 'gameover';


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

export class CellModel {
    constructor() {
        this.mine = false;
        this.exposed = false;
        this.surrondingMines = 0;
        this.flag = false;
    }

    haveMine() {
        return this.mine;
    }

    plantMine() {
        this.mine = true;
    }

    markNeighborMines(num) {
        this.surrondingMines = num;
    }

    countNeighborMines() {
        return this.surrondingMines;
    }

    exposeCell() {
        this.exposed = true;
    }

    flagMine() {
        this.flag = true;
    }

    unflagMine() {
        this.flag = false;
    }
}

export class BoardModel {
    constructor(width, height, mines) {

        this.validate(width, height, mines);

        this.cols = width;
        this.rows = height;
        this.mines = mines;

        this.cells = Array(this.rows);

        for (let i=0 ; i < this.rows; i++) {
            this.cells[i] = Array(this.rows);

            for (let j = 0; j < this.cols; j++) {
                this.cells[i][j] = new CellModel();
            }
        }
    }

    validate(width, height, mines) {
        if(width <= 0 || height <= 0 || mines <= 0) {
            throw new RangeError("0 dimension");

        } else if(width * height <= mines) {
            // A board that's completely covered with mines is technically possible to create, but why?
            throw new RangeError("Too many mines");

        } else if(width > 50 || height > 50) {
            // The implementation of minesweeper on my computer let you define arbitrarily large boards,
            // and it really fucks with your computer. I think board of size 50 * 50 = 2500 is large enough boundary for
            // a game.
            throw RangeError("Board is too large");
        }
    }

    plantMines() {
        let row, col;

        // generate #mines random locations to put mines in
        for(let i=0; i < this.mines; i++) {

            // we want exactly #mines mines, so we need to make sure we don't already
            // have a mine in this location.
            do {
                row = randint(this.rows);
                col = randint(this.cols);

                // if the location *do* have a mine, we just generate another (row, col) point
            } while( this.cells[row][col].haveMine())
                ;

            // when we've found a clear spot, we put a mine in it
            this.plantMine(row, col);
        }
    }

    plantMine(x,y) {
        this.cells[x][y].plantMine();
    }

    markNeighborOfMines() {

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {

                // if a cell contains a mine, we don't care about its neighbor mines
                if (this.cells[i][j].haveMine()) {
                    continue;

                } else {
                    let neighbors = this.findCellNeighbors(i,j);

                    // count how many mines border the cell
                    this.cells[i][j].markNeighborMines(
                        neighbors
                            .filter(point => this.cells[point[0]][point[1]].haveMine()).length

                    )
                }
            }
        }
    }

    populateBoard() {
        this.plantMines();
        this.markNeighborOfMines();
    }

    exposeCell(x,y) {
        if(this.cells[x][y].haveMine()) {
            this.cells[x][y].exposeCell();

            return 'gameOver';
            
        } else if(this.cells[x][y].surrondingMines > 0) {
            this.cells[x][y].exposeCell();
            this.cascadeExposeCell(x,y);

            return 'ok';

        } else {
            this.cells[x][y].exposeCell();

            return 'ok';
        }


    }

    findCellNeighbors(x, y) {
        let prevRow = x-1, nextRow = x+1, nextCol = y+1, prevCol = y-1;

        let res = [
            [prevRow, prevCol],
            [prevRow, y],
            [prevRow, nextCol],
            [x, prevCol],
            [x, nextCol],
            [nextRow, prevCol],
            [nextRow, y],
            [nextRow, nextCol]];

        res = res
            .filter(point => point[0] >= 0)
            .filter(point => point[0] < this.rows)
            .filter(point => point[1] >= 0)
            .filter(point => point[1] < this.cols);


        return res;
    }

    cascadeExposeCell(x, y) {

    }

    flagMine(x,y) {
        if(!this.cells[x][y].exposed) {
            this.cells[x][y].flagMine();
        }
    }

    allMinesDiscoverd() {
        let count = 0;

        for(let i=0; i < this.rows; i++) {
            for(let j=0; j < this.rows; j++) {
                if(this.cells[i][j].flag && this.cells[i][j].haveMine()) {
                    count++;
                }
            }
        }

        if(count === this.mines)
            return true;
        else {return false;}
    }
}



// return a random integer in  [0, range)
function randint(range) {
    return Math.floor(Math.random() * range);
}