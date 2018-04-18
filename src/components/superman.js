import React, {Component} from "react";

export class Superman extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    render() {
        return(<form><input type="checkbox" id="superman" onChange={this.onChange}/><label htmlFor="superman">Superman</label></form>)
    }

    onChange(e) {
        this.props.toggleSupermanMode();
    }
}
