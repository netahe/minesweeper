import {randint} from "../utils";
import {CellModel} from "./cell";

export class BoardModel {
    constructor(width, height, mines) {

        this.validate(width, height, mines);

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

    validate(width, height, mines) {
        if(width <= 0 || height <= 0 || mines <= 0) {
            throw new RangeError("0 dimension");

        } else if(width * height <= mines) {
            // A board that's completely covered with mines is technically possible to create, but why?
            throw new RangeError("Too many mines");

        } else if(width > 300 || height > 300) {

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

        this.forEachCell((x, y, cell) => {
            if(cell.mine)
                return;

            let neighbors = this.findCellNeighbors(x,y);
            cell.hints = neighbors.filter(([x,y]) => this.cells[x][y].haveMine).length;
        });
    }

    populateBoard() {
        this.plantMines();
        this.markNeighborOfMines();
    }

    exposeCell(x,y) {
        const cell = this.cells[x][y];

        if(cell.haveMine()) {
            cell.exposeCell();

            return 'gameOver';

        } else if(cell.hints > 0) {

            return 'ok';

        } else {
            this.cascadeExposeCell(x,y);

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
            .filter(([x,y]) => x >= 0)
            .filter(([x,y]) => x < this.rows)
            .filter(([x,y]) => y >= 0)
            .filter(([x,y]) => y < this.cols);


        return res;
    }

    cascadeExposeCell(x, y) {
        let toExpose = this.findCellNeighbors(x,y);

        toExpose.forEach(([x,y]) => {
            const cell = this.cells[x][y];

            if(!cell.mine && !cell.exposed) {

                cell.exposed = true;

                if(cell.hints === 0) {
                    this.cascadeExposeCell(x, y);
                }
            }
        });
    }

    flagMine(x,y) {

        if(!this.cells[x][y].exposed) {
            this.cells[x][y].flagMine();

            this.flags++;
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

    forEachCell(func) {
        for(let x=0; x < this.rows; x++) {
            for(let y=0; y < this.cols; y++) {
                func(x, y, this.cells[x][y]);
            }
        }

    }
}