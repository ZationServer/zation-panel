import React, {Component} from 'react';
import "./tableProgressRow.css";

class TableProgressRow extends Component {

    render() {
        const progress = parseInt(this.props.progress) <= 100 ? this.props.progress : 100;
        return (
            <div className={"progressCardTooltip"} style={{maxWidth: '100px',width: '8rem', backgroundColor: '#999999', height: 20}}>
                <div style={{textAlign: 'left', padding: 1, color: 'white', width: progress, backgroundColor: 'rgba(43, 225, 98,1.0)', height: 20}}/>
                <span className="tooltipText">{progress}</span>
            </div>
        )
    }

}

export default TableProgressRow;