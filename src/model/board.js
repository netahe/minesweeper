import {randint} from "../utils/utils";
import {CellModel} from "./cell";

/**
 * The state of a board is a union of the states of all its cells. The BoardModel updates its state in response
 * to requests from the GameModel.
 */

export const GameState = {
    'STEPPED_ON_MINE'       : Symbol(),
    'OK'                    : Symbol(),
    'ALL_MINES_FLAGGED'     : Symbol(),
    'TOO_MANY_FLAGS'        : Symbol(),
    'ALL_MINES_DISCOVERED'   : Symbol()
};

export class BoardModel {
    constructor(width, height, mines) {

        BoardModel.validate(width, height, mines);

        this.cols = width;
        this.rows = height;
        this.mines = mines;

        this.flags = 0;

        this.cells = Array(this.rows);

        for (let i=0 ; i < this.rows; i++) {
            this.cells[i] = Array(this.cols);

            for (let j = 0; j < this.cols; j++) {
                this.cells[i][j] = new CellModel();
            }
        }
    }

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
        let res = Array(this.rows);

        for(let i=0; i < this.rows; i++) {
            res[i] = Array(this.cols);

            for(let j=0; j < this.cols; j++) {
                res[i][j] = this.cells[i][j].getSnapshot();
            }
        }

        return res;
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
            } while( this.cells[row][col].haveMine)
                ;

            // when we've found a clear spot, we put a mine in it
            this.plantMine(row, col);
        }
    }

    // I use this function for debugging purposes, in real game, we'll generate mine locations randomlly.
    plantMine(x,y) {
        this.cells[x][y].haveMine = true;
    }

    createHints() {

        this._forEachCell((x, y, cell) => {
            if(cell.haveMine)
                return;

            let neighbors = this._findCellNeighbors(x,y);
            cell.hints = neighbors.filter(([x,y]) => this.cells[x][y].haveMine).length;
        });
    }

    populateBoard() {
        this.plantMines();
        this.createHints();
    }

    exposeCell(x,y) {
        const cell = this.cells[x][y];

        // You can't expose a flagged cell
        if(cell.isFlagged)
            return GameState.OK;

        cell.isExposed = true;

        if(cell.haveMine) {
            return GameState.STEPPED_ON_MINE;

        } else if(this._allMinesDiscoverd()) {
            return GameState.ALL_MINES_DISCOVERED;

        } else if(cell.hints > 0) {

            return GameState.OK;

        } else {
            this._cascadeExposeCell(x,y);

            return GameState.OK;
        }
    }

    // return the coordinates of all the cells that touches (x,y)
    _findCellNeighbors(x, y) {
        let prevRow = x-1, nextRow = x+1, nextCol = y+1, prevCol = y-1;

        // all possible points
        let res = [
            [prevRow, prevCol],
            [prevRow, y],
            [prevRow, nextCol],
            [x, prevCol],
            [x, nextCol],
            [nextRow, prevCol],
            [nextRow, y],
            [nextRow, nextCol]];

        // filter points that are out of the bounds of the board
        res = res
            .filter(([x,y]) => x >= 0)
            .filter(([x,y]) => x < this.rows)
            .filter(([x,y]) => y >= 0)
            .filter(([x,y]) => y < this.cols);


        return res;
    }

    // recursively expose all cells that can be exposed
    _cascadeExposeCell(x, y) {
        let toExpose = this._findCellNeighbors(x,y);

        toExpose.forEach(([x,y]) => {
            const cell = this.cells[x][y];

            if(!cell.haveMine && !cell.isExposed && !cell.isFlagged) {

                cell.isExposed = true;

                if(cell.hints === 0) {
                    this._cascadeExposeCell(x, y);
                }
            }
        });
    }

    toggleFlag(x,y) {
        let cell = this.cells[x][y];

        // if the cell is already exposed, flags are irrelevant
        if(cell.isExposed)
            return GameState.OK;

        // there is a flag, so we want to remove it
        if(cell.isFlagged) {
            cell.isFlagged = false;
            this.flags--;


        // no flag, we want to add it
        } else {
            cell.isFlagged = true;
            this.flags++;

            if(this._allMinesFlagged())
                return GameState.ALL_MINES_FLAGGED;

            if(this.flags > this.mines)
                return GameState.TOO_MANY_FLAGS;

            else
                return GameState.OK;
        }
    }

    // all cells not containing mines are exposed
    _allMinesDiscoverd() {
        let res = true;

        this._forEachCell((x,y,cell) => {
            if(!cell.haveMine && !cell.isExposed)
                res = false;
        });

        return res;
    }

    // all mines, and only the mines, are flagged, everything else is exposed.
    _allMinesFlagged() {
        let res = true;

        // all cells are either flagged correctly, or exposed
        this._forEachCell((x, y, cell) => {
            if((cell.isFlagged && cell.haveMine )|| cell.isExposed)
                ;
            else
                res = false;
        });

        return res;
    }

    // shortcut function for when we want to iterate through the entire board
    _forEachCell(func) {
        for(let x=0; x < this.rows; x++) {
            for(let y=0; y < this.cols; y++) {
                func(x, y, this.cells[x][y]);
            }
        }
    }
}