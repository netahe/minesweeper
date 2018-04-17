export class CellModel {
    constructor() {
        this._haveMine = false;
        this._isExposed = false;
        this._hints = 0;
        this._isFlagged = false;
    }

    get haveMine () {return this._haveMine};

    // once we set a mine, we're not going to remove it
    set haveMine (val) {
        this._haveMine = val;
    };

    get isExposed () {return this._isExposed};
    set isExposed (val) {this._isExposed = val};

    get hints () { return this._hints };
    set hints (val) {this._hints = val};

    get isFlagged() { return this._isFlagged};
    set isFlagged(val) {this._isFlagged = val};


    getSnapshot() {
        let res = new CellModel();
        res.haveMine = this.haveMine;
        res.isExposed = this.isExposed;
        res.hints = this.hints;
        res.isFlagged = this.isFlagged;

        return res;
    }
}