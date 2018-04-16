import {randint} from "../utils";
import {CellModel} from "./cell";

export class BoardModel {
    constructor(width, height, mines) {

        BoardModel.validate(width, height, mines);

        this.cols = width;
        this.rows = height;
        this.mines = mines;

        this.flags = 0;

        this.cells = Array(this.rows);

        for (let i=0 ; i < this.rows; i++) {
            this.cells[i] = Array(this.rows);

            for (let j = 0; j < this.cols; j++) {
                this.cells[i][j] = new CellModel();
            }
        }
    }

    // TODO: more expressive errors
    static validate(width, height, mines) {
        if(width <= 0 || height <= 0 || mines <= 0) {
            throw new RangeError("0 dimension");

        } else if(width * height <= mines) {
            // A board that's completely covered with mines is technically possible to create, but why?
            throw new RangeError("Too many mines");

        } else if(width > 300 || height > 300) {

            throw RangeError("Board is too large");
        }
    }

    // make a copy of the current board state, we use it to render the board.
    getSnapshot() {
        // board
        let res = this.cells.slice(0);

        // copy the rows
        this.cells.forEach((arr) => res.push(arr.slice(0)));

        // copy the cells
        this.forEachCell((x,y,cell) => {res[x][y] = cell.getSnapshot()});

        return res;
    }

    plantMines() {
        let row, col;

        // generate #mines random locations to put mines in
        for(let i=0; i < this.mines; i++) {

            // we want exactly #mines mines, so we need to make sure we don't already
            // have a _haveMine in this location.
            do {
                row = randint(this.rows);
                col = randint(this.cols);

                // if the location *do* have a _haveMine, we just generate another (row, col) point
            } while( this.cells[row][col].haveMine)
                ;

            // when we've found a clear spot, we put a _haveMine in it
            this.plantMine(row, col);
        }
    }

    // I use this function for debugging purposes, in real game, we'll generate mine locations randomlly.
    plantMine(x,y) {
        this.cells[x][y].haveMine = true;
    }

    createHints() {

        this.forEachCell((x, y, cell) => {
            if(cell.haveMine)
                return;

            let neighbors = this.findCellNeighbors(x,y);
            cell.hints = neighbors.filter(([x,y]) => this.cells[x][y].haveMine).length;
        });
    }

    populateBoard() {
        this.plantMines();
        this.createHints();
    }

    exposeCell(x,y) {
        const cell = this.cells[x][y];
        cell.isExposed = true;

        if(cell.haveMine) {

            return 'gameOver';

        } else if(cell.hints > 0) {

            return 'ok';

        } else {
            this.cascadeExposeCell(x,y);

            return 'ok';
        }


    }

    // return the coordinates of all the cells that touches (x,y)
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
            .filter(([x,y]) => x >= 0)
            .filter(([x,y]) => x < this.rows)
            .filter(([x,y]) => y >= 0)
            .filter(([x,y]) => y < this.cols);


        return res;
    }

    // recursively expose all cells that can be _isExposed
    cascadeExposeCell(x, y) {
        let toExpose = this.findCellNeighbors(x,y);

        toExpose.forEach(([x,y]) => {
            const cell = this.cells[x][y];

            if(!cell.haveMine && !cell.isExposed) {

                cell.isExposed = true;

                if(cell.hints === 0) {
                    this.cascadeExposeCell(x, y);
                }
            }
        });
    }

    flagMine(x,y) {

        if(!this.cells[x][y].isExposed) {
            this.cells[x][y].isFlagged = true;

            this.flags++;
        }
    }

    allMinesDiscovered() {
        let count = 0;

        for(let i=0; i < this.rows; i++) {
            for(let j=0; j < this.rows; j++) {
                if(this.cells[i][j]._isFlagged && this.cells[i][j].haveMine) {
                    count++;
                }
            }
        }

        if(count === this.mines)
            return true;
        else {return false;}
    }

    // shortcut function for when we want to iterate through the entire board
    forEachCell(func) {
        for(let x=0; x < this.rows; x++) {
            for(let y=0; y < this.cols; y++) {
                func(x, y, this.cells[x][y]);
            }
        }

    }
}