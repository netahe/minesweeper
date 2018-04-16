import React, {Component} from "react";

export class Square extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    render() {

        if( !this.props.square.isExposed ) {
            return this.renderCoveredCell();
        }

        if(this.props.square.isFlagged) {
            return Square.renderFlaggedCell();
        }

        if(this.props.square.haveMine) {
            return Square.renderMine();
        }

        if(this.props.square.hints >= 0) {
            return this.renderNumber();
        }


        return Square.renderEmptyCell();

    }

    handleClick() {
        this.props.exposeCell(this.props.row, this.props.col);
    }
    static renderMine() {
        return (<div  className="cell mine" />)
    }

    renderNumber() {
        return (<div className="cell number">{this.props.square.hints}</div>)
    }

    static renderEmptyCell() {
        return (<div className="cell empty" />)
    }

    renderCoveredCell() {
        return (<div onClick={this.handleClick} className="cell covered" />)
    }

    static renderFlaggedCell() {
        return (<div className="cell flagged">flag</div>);
    }
}