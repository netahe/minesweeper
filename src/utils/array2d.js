/**
 * TODO: I want to user this class to abstract away some of the low-level board operation, but I'm not sure I have time to get into that.
 */

class Array2D {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = Array(rows);

        for(let i=0; i < this.rows; i++) {
            this.data[i] = Array(cols);

            for(let j=0;  j < this.cols; j++){
                this.data[i][j] = {}
            }
        }
    }

    forEachRow(func) {
        for(let i=0; i < this.rows; i++) {
            func(i, this.data[i]);
        }
    }

    forEachElement(func) {
        for(let i=0 ; i < this.rows; i++) {
            for(let j=0; j < this.cols; j++) {
                func(i,j, this.data[i][j]);
            }
        }
    }

    getElement(x,y) {
        return this.data[x][y];
    }

    getRow(row) {
        return this.data[row];
    }
}