import React, {Component} from 'react';
import './infoCard.css'

class InfoCard extends Component {
    render() {
        return (
            <div className="text-white bg-info card">
                <div className="pb-0 card-body">
                    <div className="text-value">
                        {this.props.value}
                    </div>
                    <div>
                        {this.props.description}
                    </div>
                </div>
                {this.props.children}
            </div>
        )
    }
}

export default InfoCard;
