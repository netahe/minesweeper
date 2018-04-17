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

        if(this.props.square.hints > 0) {
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
        const hints = this.props.square.hints;

        switch(hints) {
            case 1:
                return (<div className="cell number one">{this.props.square.hints}</div>);
            case 2:
                return (<div className="cell number two">{this.props.square.hints}</div>);
            case 3:
                return (<div className="cell number three">{this.props.square.hints}</div>);
            case 4:
                return (<div className="cell number four">{this.props.square.hints}</div>);
            case 5:
                return (<div className="cell number five">{this.props.square.hints}</div>);
            case 6:
                return (<div className="cell number six">{this.props.square.hints}</div>);
            case 7:
                return (<div className="cell number seven">{this.props.square.hints}</div>);
            case 8:
                return (<div className="cell number eight">{this.props.square.hints}</div>);
        }
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