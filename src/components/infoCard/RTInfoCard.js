import React, {Component} from 'react';
import './infoCard.css'
import {FaPlay, FaPause, FaArrowsAltH} from 'react-icons/fa';

const pulse = (id) => {
    const node = document.getElementById(id);
    if(node){
        node.classList.remove('pulse');
        setTimeout(() => {
            node.classList.add('pulse');
        }, 10);
    }
};

class RTInfoCard extends Component {

    constructor(props) {
        super(props);

        this.btnSwitchId = 'rt-switchControl-' + RTInfoCard.btnSwitchId;
        this.btnTimeId = 'rt-timeControl-' + RTInfoCard.btnTimeId;
        RTInfoCard.btnTimeId++;
        RTInfoCard.btnSwitchId++;
        this.defaultSwitch = this.props.switchDefault;

        this.state = {
            play: true,
            switch: this.defaultSwitch
        };
    }

    render() {
        return (
            <div style={this.props.height ? {height : this.props.height} : (this.props.minHeight ? {minHeight : this.props.minHeight} : {})}
                 className={"text-white bg-info card" + (this.props.big ? ' big-card' : '') + (this.props.green ? ' cardGreen' : '')}>
                <div className="pb-0 card-body">
                    <div id="carouselButtons">
                        <button id={this.btnTimeId} type="button" className="btn btn-time-control animated"
                                onClick={this.changeTime.bind(this)}>
                            {
                                this.state.play ? <FaPause height={30} width={30} className="timeIcon"/> :
                                    <FaPlay height={20} width={20} className="timeIcon"/>
                            }
                        </button>
                        {
                            this.props.switch?
                                <button id={this.btnSwitchId} type="button" className="btn btn-switch-control animated"
                                onClick={this.btnSwitch.bind(this)}>
                                    <FaArrowsAltH height={30} width={30} className="switchIcon"/>
                                </button> : undefined
                        }
                    </div>
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

    changeTime() {
        pulse(this.btnTimeId);
        this.setState({
            play: !this.state.play
        },() => {
            if (typeof this.props['onTimeChange'] === 'function') {
                this.props['onTimeChange'](this.state.play);
            }
        });
    }

    btnSwitch() {
        pulse(this.btnSwitchId);
        this.setState({
            switch: !this.state.switch
        },() => {
            if (typeof this.props['onSwitchChange'] === 'function') {
                this.props['onSwitchChange'](this.state.switch);
            }
        });
    }
}

RTInfoCard.btnSwitchId = 0;
RTInfoCard.btnTimeId = 0;

export default RTInfoCard;
