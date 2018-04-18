import React, {Component} from "react";
import {BoardRow} from "./board-row";


export class Board extends Component {
    render() {

        if (this.props.gameStarted) {
            const rows = this.props.board.map((row, index) => <BoardRow key={index.toString()}
                                                                        toggleFlag={this.props.toggleFlag}
                                                                        exposeCell={this.props.exposeCell} index={index}
                                                                        row={row}/>);

            return (
                <div className="board">
                    {rows}
                </div>
            );
        } else {
            return(<div className="board"/> );
        }

    }

}