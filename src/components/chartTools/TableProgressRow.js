import React, {Component} from 'react';
import "./tableProgressRow.css";

class TableProgressRow extends Component {

    render() {
        return (
            <div className={"progressCardTooltip"} style={{maxWidth: '100px',width: '8rem', backgroundColor: '#999999', height: 20}}>
                <div style={{textAlign: 'left', padding: 1, color: 'white', width: this.props.progress, backgroundColor: 'rgba(43, 225, 98,1.0)', height: 20}}/>
                <span className="tooltipText">{this.props.progress}</span>
            </div>
        )
    }

}

export default TableProgressRow;