import React, {Component} from "react";
import {GameModel} from "../model/game";
import {GameState} from "../model/board";
import {GameControls} from "./game-controls";
import {Superman} from "./superman";
import {FlagCount} from "./flag-count";
import {Board} from "./board";
import {UserMessage} from "./user-message";

export class Game extends Component {
    constructor(props) {
        super(props);

        this.gameModel = new GameModel();

        this.startGame = this.startGame.bind(this);

        this.exposeCell = this.exposeCell.bind(this);

        this.toggleFlag = this.toggleFlag.bind(this);

        this.toggleSupermanMode = this.toggleSupermanMode.bind(this);

        // The component render() method is called before we initialze the game board in componentDidMount(),
        // so we want to delay it from rendering until we're ready with the board. GameStarted will be set to be true
        // the first time we call startGame(), and stay so for the rest of the app life cycle.
        this.state = {gameStarted: false, msg : null};
    }

    componentDidMount() {
        this.startGame(8, 8, 10);
    }

    startGame(width, height, mines) {
        this.gameModel.createBoard(width, height, mines);
        this.gameModel.populateBoard();
        this.gameModel.startGame();

        const snapshot = this.gameModel.getSnapshot();
        this.setState({
            board: snapshot,
            gameOver: false,
            mines: mines,
            flags: 0,
            gameStarted: true,
            msg : null,
            superman: false
        });

    }

    endGame() {
        this.setState({gameOver: false});
    }

    exposeCell(x, y) {
        // If the game is already lost, there's no point in forwarding moves to the game model
        if (this.state.gameOver)
            return;

        const res = this.gameModel.exposeCell(x,y);

        switch (res) {
            case GameState.STEPPED_ON_MINE:
                const msg = {type : 'Error', txt : "Whoops, you lose."};
                this.setState({gameOver: true, msg : msg});
                break;

            case GameState.ALL_MINES_DISCOVERD:
                const message = {type : 'Info', txt : 'You won, Yay!'};
                this.setState({gameOver: true, msg : message});
                break;

            default:
                break;
        }

        this.setState({board: this.gameModel.getSnapshot()});


    }

    toggleFlag(x, y) {
        if(this.state.gameOver)
            return;

        const res = this.gameModel.toggleFlag(x,y);

        switch(res) {

            case GameState.TOO_MANY_FLAGS:
                console.log("Too many flags");
                const msg = {type: 'Warning', txt: "Take care, you've used all your flags."};
                this.setState({msg : msg});
                break;

            case GameState.ALL_MINES_FLAGGED:
                const message = {type : 'Info', txt : 'You won, Yay!'};
                this.setState({gameOver: true, msg : message});
                break;

            default:
                this.setState({msg : null});

        }

        this.setState({board: this.gameModel.getSnapshot(), flags: this.gameModel.flags});

    }


    toggleSupermanMode() {
        if(!this.state.superman) {
            this.state.superman = true;

            let snapshot = this.gameModel.getSnapshot();

            for (let i = 0; i < snapshot.length; i++)
                for (let j = 0; j < snapshot[i].length; j++)
                    snapshot[i][j].isExposed = true;

            this.setState({board: snapshot});

        } else {
            this.state.superman = false;

            const snapshot = this.gameModel.getSnapshot();
            this.setState({board: snapshot});
        }
    }


    render() {
        return (
            <div>
                <GameControls startGame={this.startGame}/>
                <Superman toggleSupermanMode={this.toggleSupermanMode} />
                <FlagCount flags={this.state.flags} mines={this.state.mines}/>
                <Board
                    exposeCell={this.exposeCell}
                    toggleFlag={this.toggleFlag}
                    board={this.state.board}
                    gameOver={this.state.gameOver}
                    gameStarted={this.state.gameStarted}
                />
                <UserMessage msg={this.state.msg}/>

            </div>

        )
    }
}