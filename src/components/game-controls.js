import React, {Component} from 'react';

export class GameControls extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        const width = data.get("width");
        const height = data.get("height");
        const mines = data.get("mines");

        this.props.startGame(width,height,mines);
    }

    render() {
        return(
            <header>
                <h1>Hello Minesweeper</h1>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="width">Width: </label><input id="width" name="width" type="number"/>
                    <label htmlFor="height">Height: </label><input id="height" name="height" type="number"/>
                    <label htmlFor="mines">Mines: </label><input id="mines" name="mines" type="number"/>
                    <button>Start Game</button>


                </form>
            </header>);
    }
}