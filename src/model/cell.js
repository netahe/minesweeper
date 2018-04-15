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