import React, { Component } from 'react';
import './App.css';
import {GameModel} from "./game";

class Game extends Component {
  constructor(props) {
      super(props);

      this.state = new GameModel();
  }

  createBoard(width, height, mines) {
      return (<Board width={width} height={height} mines={mines} />);
  }

  render() {
    return (
      <header>
      <h1>Hello Minesweeper</h1>
          <form>
              <label htmlFor="width">Width: </label><input id="width" type="number" />
              <label htmlFor="height">Height: </label><input id="height" type="number"/>
              <label htmlFor="mines">Mines: </label><input id="mines" type="number"/>

          </form>

          {this.createBoard(8,10,10)}
      </header>



    )
  }
}

class Board extends Component {
    constructor(props) {
      super(props);

    }

    onClick() {

    }

    render() {
      return (<div><p>Board with width={this.props.width} height={this.props.height} mines={this.props.mines}</p></div>);
    }
}


class Cell extends Component {
    paintMine() {
      return (<div class="cell mine"></div>)
    }

    paintNumber() {
      return (<div class="cell number"></div>)
    }

    paintEmptyCell() {
      return (<div class="cell empty"></div>)
    }

    paintCoveredCell() {
      return (<div class="cell covered"></div>)
    }
 }

export default Game;
