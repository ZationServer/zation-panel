import React, {Component} from 'react';
import './infoCard.css'
import {FaPlay,FaPause} from 'react-icons/fa';

const pulse = (com) => {
    console.log(com);

    com.classList.remove('pulse');
    setTimeout(() => {
        com.classList.add('pulse');
    },10);
};

class InfoCard extends Component {

    constructor(props){
        super(props);
        this.state = {
          play : true
        };
    }

    render() {
        return (
            <div className="text-white bg-info card">
                <div className="pb-0 card-body">
                        <div id="carouselButtons">
                            <button id="timeControl" type="button" className="btn btn-time-control animated" onClick={this.changeTime.bind(this)}>
                                {
                                    this.state.play ? <FaPause height={30} width={30} className="timeIcon"/> : <FaPlay height={20} width={20} className="timeIcon"/>
                                }
                            </button>
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

    changeTime(event){
        console.log(event.target);
        if(event.target.classList.contains('btn-time-control')) {
            pulse(event.target);
        }

        this.setState({
            play : !this.state.play
        });

        if(typeof this.props['onTimeChange'] === 'function'){
            this.props['onTimeChange'](this.state.play);
        }
    }
}

export default InfoCard;
