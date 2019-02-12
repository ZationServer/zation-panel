import React, {Component} from 'react';
import RTInfoCard from "../../components/InfoCard/RTInfoCard";
import Chart from 'chart.js';
import CustomTooltips from "../../components/chart/customTooltips";
import {updateDataSet} from "./RealTimeFunc";

class RealTimeCard extends Component {

    constructor(props) {
        super(props);

        this.id = RealTimeCard.id;
        RealTimeCard.id++;

        const firstData = this.props.getData();

        this.chartOptions = {
            spanGaps : true,
            tooltips: {
                enabled: false,
                custom : CustomTooltips
            },
            maintainAspectRatio: false,
            legend: {
                display: false,
            },
            layout: {
                padding: {
                    top: 8,
                    right : 8,
                    left : 8
                }
            },
            scales: {
                xAxes: [
                    {
                        type: 'time',
                        time: {
                            unit: 'millisecond'
                        },
                        gridLines: {
                            color: 'transparent',
                            zeroLineColor: 'transparent',
                        },
                        ticks: {
                            fontSize: 2,
                            fontColor: 'transparent',
                            beginAtZero:true
                        },

                    }],
                yAxes: [
                    {
                        display: false,
                        ticks: {
                            display: false
                        },
                    }],
            },
            elements: {
                line: {
                    tension: 0.00001,
                    borderWidth: 1,
                },
                point: {
                    radius: 4,
                    hitRadius: 10,
                    hoverRadius: 4,
                },
            }
        };


        if(this.props.postFix){
            this.chartOptions.tooltips.callbacks = {
                label: (tooltipItems) => {
                    return tooltipItems.yLabel + ' ' + this.props.postFix;
                }
            };
        }

        const d1 = new Date();
        const d2 = new Date();
        d2.setMilliseconds(d1.getMilliseconds()+(this.interval || 1000));


        this.data = {
            datasets: [
                {
                    label: this.props.getDataLabel ? this.props.getDataLabel(firstData) :
                        (this.props.dataLabel ? this.props.dataLabel : ''),
                    backgroundColor: 'rgba(255,255,255,.3)',
                    borderColor: 'rgba(255,255,255,.55)',
                    data: [{
                        x : d1,
                        y : firstData
                    },
                    {
                        x : d2,
                        y : firstData
                    }]
                },
            ],
        };

        this.state = {
            value : firstData,
            isRunning : true,
        }
    }


    render() {
        return (
            <RTInfoCard value={this.getValue.bind(this)()} showTimeControl={true}
                        description={this.getDescription.bind(this)()} onTimeChange={this.timeChange.bind(this)}>
                <div className="chart-wrapper mx-3" style={{ height: '70px'}}>
                    <canvas id={"lineChart-"+this.id} height="70"/>
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

        const ctx = document.getElementById("lineChart-"+this.id).getContext('2d');
        this.chart = new Chart(ctx,{
            type : 'line',
            data : this.data,
            options : this.chartOptions
        });

        const interval = setInterval(() => {
            this.process.bind(this)();

        },this.props.every || 1000);

        this.setState({interval : interval,isRunning : true})
    }

    process()
    {
        const newData = this.props.getData();

        this.data.datasets[0].data = updateDataSet(this.data.datasets[0].data,{
            x: new Date(),
            y: newData
        },this.props.maxLength);

        if(this.props.getDataLabel) {
            this.data.datasets[0].label = this.props.getDataLabel(newData);
        }

        this.setState({
            value : newData,
        });

        this.chart.update();
    }

    componentWillUnmount() {
        if(this.state.interval){
            clearInterval(this.state.interval);
        }
    }
}

RealTimeCard.id = 0;

export default RealTimeCard;
