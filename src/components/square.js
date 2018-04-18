import React, {Component} from "react";

export class Square extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    render() {

        if( this.props.square.isExposed ) {

            if (this.props.square.haveMine) {
                return Square.renderMine();
            }

            if (this.props.square.hints > 0) {
                return this.renderNumber();
            }

            return Square.renderEmptyCell();

        } else {
            if(this.props.square.isFlagged)
                return this.renderFlaggedCell();

            else {
                return this.renderCoveredCell();
            }
        }
    }

    handleClick(e) {
        if(e.shiftKey) {
            this.props.toggleFlag(this.props.row, this.props.col)
        } else {
            this.props.exposeCell(this.props.row, this.props.col);
        }
    }


    static renderMine() {
        return (<div  className="cell mine" >*</div>)
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

    renderFlaggedCell() {
        return (<div onClick={this.handleClick} className="cell covered flagged"> F </div>);
    }
}