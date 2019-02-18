import React, {Component} from 'react';
import "./tableAgeRow.css";
import Time from "../../core/Time";

class TableAgeRow extends Component {

    render() {
        return (
            <div className={"ageCardTooltip"}>
                <span>{Time.processAge(this.props.rowData.age)}</span>
                <span className="tooltipText">{Time.processDate(this.props.rowData.started)}</span>
            </div>
        )
    }

}

export default TableAgeRow;