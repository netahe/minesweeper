import {GameModel, GameOverError} from "./game";
import {randint} from "../utils/utils";

import {GameState} from "./board";


it('test playing after game ended', () => {
    let game = new GameModel();
    game.createBoard(3,3,1);
    game.populateBoard();

    game.startGame();
    game.endGame();

    expect(() => {game.exposeCell(1,1)}).toThrow(GameOverError);
});

it('test game lost', () => {
    let game = new GameModel();
    game.createBoard(3,3,1);
    game.board.plantMine(1,1);
    game.board.createHints();

    game.startGame();

    expect(game.exposeCell(1,1)).toBe(GameState.STEPPED_ON_MINE);


});

it('test game won', () => {
    let game = new GameModel();
    game.createBoard(3,3,1);
    game.board.plantMine(1,1);
    game.board.createHints();

    game.startGame();
    game.exposeCell(0,0);
    game.exposeCell(0,1);
    game.exposeCell(0,2);

    game.exposeCell(1,0);
    game.exposeCell(1,2);

    game.exposeCell(2,0);
    game.exposeCell(2,1);
    game.exposeCell(2,2);

    expect(game.toggleFlag(1,1)).toBe(GameState.ALL_MINES_FLAGGED);
    expect(game.gameOver).toBe(true)


});

it('test a whole game', () => {
    let game = new GameModel();
    game.createBoard(8,8,1);
    game.populateBoard();
    game.startGame();

    while(true) {
        let x = randint(8);
        let y = randint(8);


        try {
            game.exposeCell(x, y);

        } catch(e) {
            break;
        }
    }

});

it('tests making snapshot', () => {
   let game = new GameModel();
   game.createBoard(30,16,99);
   game.populateBoard();

   const snapshot = game.getSnapshot();

   expect(snapshot).not.toBe(game.board.cells);
});


it('test putting too many flags', () => {
    let game = new GameModel();
    game.createBoard(3,3,1);

    let board = game.board;

    board.plantMine(1,1);
    board.createHints();

    game.toggleFlag(1,1);

    expect(game.toggleFlag(0,0)).toBe(GameState.TOO_MANY_FLAGS);
});

it('test unflagging cell', () => {
   let game = new GameModel();
   game.createBoard(3,3,2);
   game.populateBoard();

   game.toggleFlag(0,0);
   game.toggleFlag(0,0);

   expect(game.board.cells[0][0].isFlagged).toBe(false);
   expect(game.flags).toBe(0);
});

it('test flagging cell', () => {
    let game = new GameModel();
    game.createBoard(3,3,2);
    game.populateBoard();

    game.toggleFlag(0,0);

    expect(game.board.cells[0][0].isFlagged).toBe(true);
    expect(game.flags).toBe(1);
});