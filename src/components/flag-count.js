import React, {Component} from "react";

export class FlagCount extends Component {
    render() {
        return (<div>Flags: {this.props.flags}/{this.props.mines}</div>)
    }
}