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
        if(this._haveMine === true)
            return;
        else {
            this._haveMine = true;
        }
    };

    get isExposed () {return this._isExposed};
    set isExposed (val) {this._isExposed = val};

    get hints () { return this._hints };
    set hints (val) {this._hints = val};

    get isFlagged() { return this._isFlagged};
    set isFlagged(val) {this._isFlagged = val};


    getSnapshot() {

        return {'haveMine' : this.haveMine, 'isExposed' : this.isExposed, 'hints' : this.hints, 'isFlagged' : this.isFlagged};
    }
}