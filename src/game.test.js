import {GameModel, BoardModel, CellModel, GameOverError} from './game';

let {it, expect} = global;


it('test the creation of an empty board', () => {
    let game = new GameModel();

    game.createBoard(8,10, 30);
    let board = game.board;

    // first cell
    expect(board.cells[0][0].mine).toBe(false);
    expect(board.cells[0][0].exposed).toBe(false);

    // last cell
    expect(board.cells[9][7].mine).toBe(false);
    expect(board.cells[9][7].exposed).toBe(false);
});



it('test that the right number of mines are generated', () => {
    let game = new GameModel();

    game.createBoard(5,4, 6);
    let board = game.board;

    board.populateBoard();

    let mineCount = 0;
    for(let i=0; i < board.rows; i++) {
        for(let j=0; j < board.cols; j++) {

            if(board.cells[i][j].haveMine()) {
                mineCount++;
            }
        }
    }
    expect(mineCount).toBe(6);
});

it('BoardModel.findCellNeighbors() returns a correct result', () => {
    let game = new GameModel();

    game.createBoard(3,3,3);

    let board = game.board;

    expect(board.findCellNeighbors(0,0)).toEqual([[0,1], [1,0], [1,1]]);

    expect(board.findCellNeighbors(1,1)).toEqual([[0,0], [0,1], [0,2], [1,0], [1,2], [2,0], [2,1], [2,2]]);

});

it('make sure that neighboring mines are marked correctly', () => {
    /**
     * x 2 o o
     * x 3 o o
     * x 2 o o
     * 1 1 o o
     */
    let game = new GameModel();

    game.createBoard(4,4,3);

    let board = game.board;
    board.plantMine(0,0);
    board.plantMine(1,0);
    board.plantMine(2,0);

    board.markNeighborOfMines();

    expect(board.cells[1][1].surrondingMines).toBe(3);
    expect(board.cells[2][1].surrondingMines).toBe(2);
    expect(board.cells[3][1].surrondingMines).toBe(1);

    expect(board.cells[0][2].surrondingMines).toBe(0);
    expect(board.cells[3][3].surrondingMines).toBe(0);

});

// We need to wrap the call to BoardModel constructor because of Jest reasons

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

it('test playing after game ended', () => {
    let game = new GameModel();
    game.createBoard(3,3,1);
    game.populateBoard();

    game.startGame();
    game.endGame();

    function exposeCell() {
        game.exposeCell(1,1);
    }

    expect(exposeCell).toThrow(GameOverError);
});

it('test game lost', () => {
    let game = new GameModel();
    game.createBoard(3,3,1);
    game.board.plantMine(1,1);
    game.board.markNeighborOfMines();

    game.startGame();
    game.exposeCell(1,1);

    expect(game.gameOver).toBe(true);
    expect(game.gameWon).toBe(false);

});

it('test game won', () => {
    let game = new GameModel();
    game.createBoard(3,3,1);
    game.board.plantMine(1,1);
    game.board.markNeighborOfMines();

    game.startGame();
    game.flagMine(1,1);

    expect(game.gameOver).toBe(true);
    expect(game.gameWon).toBe(true);

});

it('test cascade exposed cells', () => {
    /**
     * x 2 o o
     * x 3 o o
     * x 2 o o
     * 1 1 o o
     */
    let game = new GameModel();

    game.createBoard(4,4,3);

    let board = game.board;
    board.plantMine(0,0);
    board.plantMine(1,0);
    board.plantMine(2,0);

    board.markNeighborOfMines();

    board.exposeCell(0,3);

    // all three righmost columns should be exposed
    expect(board.cells[0][1].exposed).toBe(true);
    expect(board.cells[1][1].exposed).toBe(true);
    expect(board.cells[2][1].exposed).toBe(true);
    expect(board.cells[3][1].exposed).toBe(true);

    expect(board.cells[0][2].exposed).toBe(true);
    expect(board.cells[1][2].exposed).toBe(true);
    expect(board.cells[2][2].exposed).toBe(true);
    expect(board.cells[3][2].exposed).toBe(true);

    expect(board.cells[0][3].exposed).toBe(true);
    expect(board.cells[1][3].exposed).toBe(true);
    expect(board.cells[2][3].exposed).toBe(true);
    expect(board.cells[3][3].exposed).toBe(true);

    // the leftmost column should remine hidden
    expect(board.cells[0][0].exposed).toBe(false);
    expect(board.cells[1][0].exposed).toBe(false);
    expect(board.cells[2][0].exposed).toBe(false);
    expect(board.cells[3][0].exposed).toBe(false);

});

//
//
// /**
//  *
//  * o o 1 x
//  * 1 1 2 1
//  * 1 x 1 o
//  * 1 1 1 o
//  */
// testBoard2 = new Board(4,4,2);
// testBoard2.plantMine(0,3);
// testBoard2.plantMine(2,1);
// testBoard2.markNeighborMines();
//
//
// /**
//  *
//  * 1 1 1
//  * 1 x 1
//  * 1 1 1
//  */
// testBoard3 = new Board(3,3,1);
// testBoard3.plantMine(1,1);
// testBoard3.markNeighborMines();

//
// // test: game over
// game = new Game();
// game.createBoard(3,3,1);
// game.board.plantMine(1,1);
// game.board.markNeighborMines();
//
// game.startGame();
// game.board.cells[1][1].exposeCell();
//
// assert_equal(game.gameEnd == true);
// assert_equal(game.gameOver == true);
//
// // test: generate new bord mid-game
// game = new Game();
// game.createBoard(3,3,1);
// game.populateBoard();
//
// game.startGame();
// game.createBoard(); // should throw an error
//
// // test: game won, all cells exposed
// game = new Game();
// game.createBoard(3,3,1);
// game.board.plantMine(1,1);
// game.board.markNeighborMines();
//
// game.startGame();
// game.board.cells[0][0].exposeCell();
// game.board.cells[0][1].exposeCell();
// game.board.cells[0][2].exposeCell();
//
// game.board.cells[1][0].exposeCell();
// game.board.cells[1][2].exposeCell();
//
// game.board.cells[2][0].exposeCell();// }
//
// assert_equal(mineCount, 30);
// assert_equal(gameSize, 8 * 10);
//
//
// game.board.cells[2][1].exposeCell();
// game.board.cells[2][2].exposeCell();
//
// assert_equal(game.gameEnd == true);
// assert_equal(game.gameOver == false);
//
//
// // test: game won, all mines marked
// game = new Game();
// game.createBoard(3,3,1);
// game.board.plantMine(1,1);
// game.board.markNeighborMines();
//
// game.startGame();
// game.board.markAsMine(1,1);
//
// assert_equal(game.gameEnd == true);
// assert_equal(game.gameOver == false);
