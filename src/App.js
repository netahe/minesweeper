import React, {Component} from 'react';
import './App.css';
import {GameModel} from "./model/game";
import {GameControls} from "./components/game-controls";
import {Board} from "./components/board";
import {Superman} from "./components/superman";


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
        if(this.state.gameLost)
            return;

        try {
            this.gameModel.exposeCell(x, y);

        } catch (e) {

            this.setState({gameLost: true});
        }

        this.setState({board: this.gameModel.getSnapshot()});
    }

    flagMine(x,y) {
        if(this.state.gameLost)
            return;

        this.gameModel.flagMine(x,y);

        this.setState({board : this.gameModel.getSnapshot()});
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
