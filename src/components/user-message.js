import React, {Component} from "react";

export class UserMessage extends Component {
    render() {

        if(this.props.msg === null) {
            return (<div />);
        } else {
            if(this.props.msg.type === 'Error') {
                return (<div className="error msg">{this.props.msg.txt}</div> );
            }

            if(this.props.msg.type === 'Warning') {
                return (<div className="warning msg">{this.props.msg.txt}</div> );
            }

            if(this.props.msg.type === 'Info') {
                return (<div className="info msg">{this.props.msg.txt}</div> );
            }
        }
    }
}