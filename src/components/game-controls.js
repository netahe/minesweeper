import React, {Component} from 'react';

export class GameControls extends Component {
    constructor(props) {
        super(props);
        this.state = {width : 8, height : 8, mines :10};

        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleChangeWidth = this.handleChangeWidth.bind(this);

        this.handleChangeHeight = this.handleChangeHeight.bind(this);

        this.handleChangeMines = this.handleChangeMines.bind(this);

    }

    handleChangeWidth(e) {
            this.setState({width : e.target.value});
    }

    handleChangeHeight(e) {
        this.setState({height : e.target.value});
    }

    handleChangeMines(e) {
        this.setState({mines : e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();

        const width = this.state.width;
        const height = this.state.height;
        const mines = this.state.mines;

        this.props.startGame(width,height,mines);
    }

    render() {
        return(
            <header>
                <h1>Hello Minesweeper</h1>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="width">Width: </label><input id="width" name="width" type="number" value={this.state.width} onChange={this.handleChangeWidth}/>
                    <label htmlFor="height">Height: </label><input id="height" name="height" type="number" value={this.state.height} onChange={this.handleChangeHeight}/>
                    <label htmlFor="mines">Mines: </label><input id="mines" name="mines" type="number" value={this.state.mines} onChange={this.handleChangeMines}/>
                    <button>Start Game</button>


                </form>
            </header>);
    }
}