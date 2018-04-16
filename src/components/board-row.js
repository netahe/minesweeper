import React, {Component} from "react";
import {Square} from "./square";

export class BoardRow extends Component {
    render() {
        const squares = this.props.row.map((sq, index) => <Square exposeCell={this.props.exposeCell} key={index.toString()} row={this.props.index}
                                                                  col={index} square={sq}/>);

        return (
            <div className="board-row">
                {squares}
            </div>
        );
    }
}