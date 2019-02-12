import React, {Component} from 'react';
import './infoCard.css'

class InfoCard extends Component {

    constructor(props){
        super(props);
        this.state = {
          play : true
        };
    }

    render() {
        return (
            <div className={"text-white bg-info card" + (this.props.big ? ' big-card' : '')}>
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
