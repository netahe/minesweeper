import React, {Component} from 'react';
import './App.css';
import {GameModel} from "./model/game";
import {GameControls} from "./components/game-controls";
import {Board} from "./components/board";
import {Superman} from "./components/superman";
import {FlagCount} from "./components/flag-count";
import {NotEnoughFlags, SteppedOnMine} from "./model/errors";

class Error extends Component {

}


class Game extends Component {
    constructor(props) {
        super(props);

        this.gameModel = new GameModel();

        this.state = {board: null, gameStarted: false};

        this.startGame = this.startGame.bind(this);

        this.exposeCell = this.exposeCell.bind(this);

    }


    componentDidMount() {
        this.startGame(30, 16, 99);
    }

    startGame(width, height, mines) {
        // If we alrady had a game going, we want to end it
        if (this.state.gameStarted) {
            this.gameModel.endGame();
        }

        this.gameModel.createBoard(width, height, mines);
        this.gameModel.populateBoard();
        this.gameModel.startGame();

        const snapshot = this.gameModel.getSnapshot();
        this.setState({board: snapshot, gameStarted: true, gameLost: false});

    }

    endGame() {
        this.setState({gameStarted: false});
    }

    exposeCell(x, y) {
        // If the game is already lost, there's no point in forwording moves to the game model
        if(this.state.gameLost)
            return;

        try {
            this.gameModel.exposeCell(x, y);

        } catch (e) {
            if(e instanceof SteppedOnMine) {
                this.setState({gameLost: true});

                // Unknown error, We don't really know how to deal with that
            } else {

                throw e;
            }

            // regardless of the result of the move, always update the board
        } finally {
            this.setState({board: this.gameModel.getSnapshot()});
        }

    }

    flagCell(x,y) {

        if(this.state.gameLost)
            return;

        try {
            this.gameModel.flagCell(x, y);

        } catch(e) {
            if(e instanceof NotEnoughFlags) {


                // We use the same controls for flagging and unflagging cells, so if a cell is already flagged, we just unflag it
            } else if(e instanceof CellAlreadyFlagged) {
                this.unflagCell(x,y);

            } else if(e instanceof GameWon) {
                this.setState({gameWon : true});

                // Unknown error, We don't really know how to deal with that
            } else {
                throw e;
            }

        } finally {
            this.setState({board : this.gameModel.getSnapshot(), flags : this.gameModel.getFlags()});
        }


    }

    unflagCell(x,y) {
        try {
            this.gameModel.unflagCell(x,y);

        } catch(e) {

        } finally {
            this.setState({board : this.gameModel.getSnapshot(), flags : this.gameModel.flags});
        }

    }

    startSupermanMode() {
        if(this.state.gameLost)
            return;

        let snapshot = this.gameModel.getSnapshot();

        for (let i = 0; i < snapshot.length; i++)
            for (let j = 0; j < snapshot[i].length; j++)
                snapshot[i][j].isExposed = true;

        this.setState({board: snapshot});
    }


    endSupermanMode() {
        const snapshot = this.gameModel.getSnapshot();
        this.setState({board: snapshot});
    }

    render() {
        return (
            <div>
                <GameControls startGame={this.startGame}/>
                <Superman onChecked={this.startSupermanMode} onUnChecked={this.endSupermanMode}/>
                <Board exposeCell={this.exposeCell} board={this.state.board} gameStarted={this.state.gameStarted}/>

            </div>

        )
    }
}


export default Game;
