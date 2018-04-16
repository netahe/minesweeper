import React, {Component} from "react";

export class Superman extends Component {
    render() {
        return(<form><input type="checkbox" id="superman" onChange={this.onChange}/><label htmlFor="superman">Superman</label></form>)
    }

    onChange(e) {
        if(this.checked)
            this.props.onChecked();
        else {
            this.props.onUnChecked();
        }
    }
}
