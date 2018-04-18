class Array2D {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = [];
    }

    forEachRow(func) {

    }

    forEachElement(func) {
        for(let i=0 ; i < this.rows; i++) {
            for(let j=0; j < this.cols; j++) {
                func(i,j, thid.data[i][j]);
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