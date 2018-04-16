import React, { Component } from 'react';
import './App.css';
import {GameModel} from "./model/game";


class Superman extends Component {
    render() {
        return(<form><input type="checkbox" id="superman"/><label htmlFor="superman">Superman</label></form>)
    }

    onChecked() {

    }
}

class GameControls extends Component {
    render() {
        return(
        <header>
            <h1>Hello Minesweeper</h1>
            <form>
                <label htmlFor="width">Width: </label><input id="width" name="width" type="number"/>
                <label htmlFor="height">Height: </label><input id="height" name="height" type="number"/>
                <label htmlFor="mines">Mines: </label><input id="mines" name="mines" type="number"/>
                <button onSubmit={this.props.onSubmit}>Start Game</button>


            </form>
        </header>);
    }
}

class Game extends Component {
  constructor(props) {
      super(props);

      this.state = {'gameStarted' : true};

      this.gameModel = new GameModel();
      this.gameModel.createBoard(200,200,10);
      this.gameModel.populateBoard();

  }

  startGame(width, height, mines) {
    this.gameModel = new GameModel();
    this.gameModel.createBoard(width, height, mines);
    this.gameModel.populateBoard();

    this.setState({board : this.gameModel.getSnapshot(), gameStarted : true });
  }

  exposeCell(x,y) {
      this.gameModel.exposeCell(x,y);

      this.setState({board : this.gameModel.getSnapshot() });
  }



  render() {
    return (
        <div>
            <GameControls onSubmit={this.startGame}/>
            <Superman/>
            <Board board={this.gameModel.board} gameStarted={true}/>

        </div>

    )
  }
}

class Board extends Component {
    render() {
        if (this.props.gameStarted) {

            const rows = this.props.board.cells.map((row, index) => <BoardRow key={index.toString()} row={row}/>);

            return (
                <div className="board">
                    {rows}
                </div>
            );
        } else {
            return ( <div className="board" /> );
        }
    }
}



class BoardRow extends Component {
    render() {
        const squares = this.props.row.map((sq, index) => <Square key={index.toString()} isExposed={sq.isExposed} haveMine={sq.haveMine} hints={sq.hints} />);

        return(
            <div className="board-row">
                {squares}
            </div>
        );
    }

}

class Square extends Component {

    render() {

        if( !this.props.isExposed ) {
            return Square.renderCoveredCell();
        }

        if(this.props.haveMine) {
            return Square.renderMine();
        }

        if(this.props.hints >= 0) {
            return this.renderNumber();
        }


        return Square.renderEmptyCell();

    }


    static renderMine() {
      return (<div className="cell mine" />)
    }

    renderNumber() {
        return (<div className="cell number">{this.props.hints}</div>)
    }

    static renderEmptyCell() {
      return (<div className="cell empty" />)
    }

    static renderCoveredCell() {
      return (<div className="cell covered" />)
    }
 }

export default Game;
