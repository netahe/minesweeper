import {GameModel, GameOverError} from "./game";
import {randint} from "../utils/utils";

import {GameOver, GameWon, NotEnoughFlags, SteppedOnMine} from "./errors";

/**
 * as per Jest, when we test functions that generate exceptions, the argument to expect() should always be a callback.
 */

it('test playing after game ended', () => {
    let game = new GameModel();
    game.createBoard(3,3,1);
    game.populateBoard();

    game.startGame();
    game.endGame();

    expect(() => {game.exposeCell(1,1)}).toThrow(GameOver);
});

it('test game lost', () => {
    let game = new GameModel();
    game.createBoard(3,3,1);
    game.board.plantMine(1,1);
    game.board.createHints();

    game.startGame();

    expect(() => {game.exposeCell(1,1)}).toThrow(SteppedOnMine);


});

it('test game won', () => {
    let game = new GameModel();
    game.createBoard(3,3,1);
    game.board.plantMine(1,1);
    game.board.createHints();

    game.startGame();


    expect(() => {game.toggleFlag(1,1)}).toThrow(GameWon);
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
            //console.log("Playing: (" + x + ", " + y + ")");
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


it('tests flagging all mines', () => {
    let game = new GameModel();
    game.createBoard(3,3,1);

    let board = game.board;

    board.plantMine(1,1);
    board.createHints();


    expect(() => {game.toggleFlag(1,1)}).toThrow(GameWon);
});

it('test putting too many flags', () => {
    let game = new GameModel();
    game.createBoard(3,3,1);

    let board = game.board;

    board.plantMine(1,1);
    board.createHints();

    game.toggleFlag(0,0);

    expect(() => {game.toggleFlag(1,1)}).toThrow(NotEnoughFlags);
});