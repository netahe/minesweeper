// We need to wrap the call to BoardModel constructor because of Jest reasons

import {BoardModel} from "./board";

it('create board with too many mines', () => {
    function createBoard() {
        new BoardModel(3,3,10);
    }

    expect(createBoard).toThrow(RangeError);
});

it('create board with #board_size number of mines', () => {
    function createBoard() {
        new BoardModel(3,3,9);
    }

    expect(createBoard).toThrow(RangeError);
});

it('create really large board', () => {
    function createBoard() {
        new BoardModel(100000, 100000, 50);
    }

    expect(createBoard).toThrow(RangeError);
});

it('create board with negative width', () => {
    function createBoard() {
        new BoardModel(-10, 11, 5);
    }

    expect(createBoard).toThrow(RangeError);
});

it('create board with negative height', () => {
    function createBoard() {
        new BoardModel(10, -11, 5);
    }

    expect(createBoard).toThrow(RangeError);
});

it('create board with negative number of mines', () => {
    function createBoard() {
        new BoardModel(10, 11, -5);
    }

    expect(createBoard).toThrow(RangeError);
});

it('test the creation of an empty board', () => {
    let board = new BoardModel(8,10,30);

    // first cell
    expect(board.cells[0][0]._haveMine).toBe(false);
    expect(board.cells[0][0]._isExposed).toBe(false);

    // last cell
    expect(board.cells[9][7]._haveMine).toBe(false);
    expect(board.cells[9][7]._isExposed).toBe(false);
});

it('test that the right number of mines are generated', () => {
    let board = new BoardModel(5,4,6);

    board.populateBoard();

    let mineCount = 0;
    for(let i=0; i < board.rows; i++) {
        for(let j=0; j < board.cols; j++) {

            if(board.cells[i][j].haveMine) {
                mineCount++;
            }
        }
    }
    expect(mineCount).toBe(6);
});

it('make sure that neighboring mines are marked correctly', () => {
    /**
     * x 2 o o
     * x 3 o o
     * x 2 o o
     * 1 1 o o
     */

    let board = new BoardModel(4,4,3);
    board.plantMine(0,0);
    board.plantMine(1,0);
    board.plantMine(2,0);

    board.createHints(); 

    expect(board.cells[1][1].hints).toBe(3);
    expect(board.cells[2][1].hints).toBe(2);
    expect(board.cells[3][1].hints).toBe(1);

    expect(board.cells[0][2].hints).toBe(0);
    expect(board.cells[3][3].hints).toBe(0);

});

it('test cascade isExposed cells', () => {
    /**
     * x 2 o o
     * x 3 o o
     * x 2 o o
     * 1 1 o o
     */
    let board = new BoardModel(4,4,3);
    board.plantMine(0,0);
    board.plantMine(1,0);
    board.plantMine(2,0);

    board.createHints();

    board.exposeCell(0,3);

    // all three righmost columns should be _isExposed
    expect(board.cells[0][1].isExposed).toBe(true);
    expect(board.cells[1][1].isExposed).toBe(true);
    expect(board.cells[2][1].isExposed).toBe(true);
    expect(board.cells[3][1].isExposed).toBe(true);

    expect(board.cells[0][2].isExposed).toBe(true);
    expect(board.cells[1][2].isExposed).toBe(true);
    expect(board.cells[2][2].isExposed).toBe(true);
    expect(board.cells[3][2].isExposed).toBe(true);

    expect(board.cells[0][3].isExposed).toBe(true);
    expect(board.cells[1][3].isExposed).toBe(true);
    expect(board.cells[2][3].isExposed).toBe(true);
    expect(board.cells[3][3].isExposed).toBe(true);

    // the leftmost column should remine hidden
    expect(board.cells[0][0].isExposed).toBe(false);
    expect(board.cells[1][0].isExposed).toBe(false);
    expect(board.cells[2][0].isExposed).toBe(false);
    expect(board.cells[3][0].isExposed).toBe(false);

});

it('BoardModel.findCellNeighbors() returns a correct result', () => {
    let board = new BoardModel(3,3,3);

    expect(board.findCellNeighbors(0,0)).toEqual([[0,1], [1,0], [1,1]]);

    expect(board.findCellNeighbors(1,1)).toEqual([[0,0], [0,1], [0,2], [1,0], [1,2], [2,0], [2,1], [2,2]]);

});

it('tests BoardModel.forEachCell()', () => {
    let board = new BoardModel(3,3,2);
    board.populateBoard();

    let exposedCells = 0;
    let mines = 0;

    board.forEachCell((x, y, cell) => {
        if(cell.exposed === true)
            exposedCells++;
        if(cell.mine === true)
            mines++;
    });

    expect(exposedCells).toBe(0);
    expect(mines).toBe(2);
});

