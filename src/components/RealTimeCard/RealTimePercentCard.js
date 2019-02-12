import React, {Component} from 'react';
import RTInfoCard from "../../components/InfoCard/RTInfoCard";
import './realTimePercentCard.css';

class RealTimePercentCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value : this.props.getPercent(),
            isRunning : true,
        }
    }


    render() {
        return (
            <RTInfoCard value={this.state.value + ' %'} showTimeControl={true}
                        description={this.props.description} onTimeChange={this.timeChange.bind(this)}>
                <div className="chart-wrapper mx-3" style={{ height: '70px'}}>
                   <div className={"progress mb-3"}>
                       <div className={"progress-bar"} style={{width : (this.state.value + '%')}} aria-valuemin="0" aria-valuemax="100">
                       </div>
                   </div>
                </div>
            </RTInfoCard>
        )
    }

    timeChange(state){
        if(state && this.state.isRunning){
            clearInterval(this.state.interval);
            this.setState({isRunning : false});
        }

        if(!state && !this.state.isRunning){
            this.process.bind(this)();
            this.componentDidMount.bind(this)();
        }
    }

    componentDidMount() {

        const interval = setInterval(() => {
            this.process.bind(this)();

        },this.props.every || 1000);

        this.setState({interval : interval,isRunning : true})
    }

    process()
    {
        this.setState({
            value : this.props.getPercent()
        });
    }

    componentWillUnmount() {
        if(this.state.interval){
            clearInterval(this.state.interval);
        }
    }
}

export default RealTimePercentCard;