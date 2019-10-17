import React, {Component} from 'react';
import RTInfoCard from "../../components/infoCard/RTInfoCard";
import {Bar} from "react-chartjs-2";
import CustomTooltips from "../../components/chartTools/customTooltips";
import {zeroCompensation} from "../chartTools/barZeroCompensation";

class RTSwitchBarCard extends Component {

    constructor(props) {
        super(props);

        this.chartOptions = {
            scaleBeginAtZero:true,
            barBeginAtOrigin:true,
            tooltips: {
                enabled: false,
                custom: CustomTooltips
            },
            maintainAspectRatio: false,
            legend: {
                display: false,
            },

            scales: {
                xAxes: [
                    {
                        display: false,
                        barPercentage: 0.8,
                    }],
                yAxes: [
                    {
                        ticks : {
                            beginAtZero:true,
                            suggestedMin: 0,
                            min: 0,
                            callback: function (value) { if (Number.isInteger(value)) { return value; } },
                            stepSize: 1
                        },
                        display: true,
                    }],
            },
        };

        if(this.props.postFix){
            this.chartOptions.tooltips.callbacks = {
                label: (tooltipItems) => {
                    return tooltipItems.yLabel + ' ' + this.props.postFix;
                }
            };
        }

        this.switchDefault = this.props.getSwitchDefault();

        this.state = {
            isRunning : true,
            data : this.props.getData(this.switchDefault),
            switch : this.switchDefault,
            switchTooltip : this.getSwitchTooltip(this.switchDefault)
        };
    }

    render() {
        const {switchTooltip,data} = this.state;
        return (
            <RTInfoCard value={this.getValue.bind(this)()} big={true} switch={true} switchDefault={this.switchDefault}
                        onSwitchChange={this.switchChange.bind(this)}
                        switchTooltip={switchTooltip}
                        height={'29rem'}
                        description={this.getDescription.bind(this)()} onTimeChange={this.timeChange.bind(this)}>
                <div className="chart-wrapper mx-3" style={{ height: '320px'}}>
                    <Bar options={this.chartOptions} data={data} height={500} plugins={[zeroCompensation]}
                         redraw={this.props.redraw}
                    />
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
            return this.props.getDescription(this.state.switch);
        }
        else {
            return '';
        }
    }

    getValue() {
        if(this.props.value){
            return this.props.value;
        }
        else if(this.props.getValue){
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

    switchChange(state){
        this.setState({switch : state,switchTooltip : this.getSwitchTooltip(state)});
        this.process();
    }

    getSwitchTooltip(state) {
       return state ? 'On worker' : 'On server';
    }

    componentDidMount() {

        const interval = setInterval(() => {
            this.process.bind(this)();

        },this.props.every || 1000);

        this.setState({interval : interval,isRunning : true})
    }

    process(){
        this.setState({
            data : this.props.getData(this.state.switch)
        });
    }


    componentWillUnmount() {
        if(this.state.interval){
            clearInterval(this.state.interval);
        }
    }
}

export default RTSwitchBarCard;