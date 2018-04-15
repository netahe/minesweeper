import {GameModel, GameOverError} from "./game";
import {randint} from "../utils";

it('test playing after game ended', () => {
    let game = new GameModel();
    game.createBoard(3,3,1);
    game.populateBoard();

    game.startGame();
    game.endGame();
game
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

it('test a whole game', () => {
    let game = new GameModel();
    game.createBoard(8,8,1);
    game.populateBoard();
    game.startGame();

    while(true) {
        let x = randint(8);
        let y = randint(8);


        try {
            console.log("Playing: (" + x + ", " + y + ")");
            game.exposeCell(x, y);

        } catch(e) {
            break;
        }
    }

});