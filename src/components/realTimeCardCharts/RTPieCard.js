import React, {Component} from 'react';
import RTInfoCard from "../../components/infoCard/RTInfoCard";
import {Pie} from "react-chartjs-2";

const chartOptions = {
    maintainAspectRatio: false,
    legend: {
        display: true,
        labels : {
            fontColor : '#ffffff'
        },
        position : 'bottom',
        borderColor : '#343a40'
    },
    layout: {
        padding: {
            top: 8,
            right : 8,
            left : 8,
            bottom : 15
        }
    }
};

class RTPieCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isRunning : true,
            data : this.props.getData()
        };
    }

    render() {
        return (
            <RTInfoCard value={this.getValue.bind(this)()} big={true} height={'29rem'}
                        description={this.getDescription.bind(this)()} onTimeChange={this.timeChange.bind(this)}>
                <div className="chart-wrapper mx-3" style={{ height: '400px'}}>
                    <Pie options={chartOptions} data={this.state.data} height={195}/>
                </div>
            </RTInfoCard>
        )
    }

    getDescription()
    {
        if(this.props.description){
            return this.props.description;
        }
        if(this.props.getDescription){
            return this.props.getDescription(this.state.value);
        }
        else {
            return '';
        }
    }

    getValue() {
        if(this.props.getValue){
            return this.props.getValue(this.state.value);
        }
        else {
            return this.props.postFix ? this.state.value + " " + this.props.postFix : this.state.value;
        }
    }

    timeChange(state){
        if(!state && this.state.isRunning){
            clearInterval(this.state.interval);
            this.setState({isRunning : false});
        }

        if(state && !this.state.isRunning){
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
            data : this.props.getData()
        });
    }

    componentWillUnmount() {
        if(this.state.interval){
            clearInterval(this.state.interval);
        }
    }
}

export default RTPieCard;