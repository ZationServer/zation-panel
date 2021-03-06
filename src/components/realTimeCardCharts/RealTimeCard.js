import React, {Component} from 'react';
import RTInfoCard from "../../components/infoCard/RTInfoCard";
import {Line} from "react-chartjs-2";
import CustomTooltips from "../../components/chartTools/customTooltips";
import {updateDataSet} from "./RealTimeFunc";

class RealTimeCard extends Component {

    constructor(props) {
        super(props);

        const firstData = this.props.getData();

        this.chartOptions = {
            animation: false,
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
        d2.setMilliseconds(d1.getMilliseconds()+((this.props.every / 2) || 1000));


        const data = {
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
            currentData : firstData,
            running : true,
            chartData : data
        }
    }


    render() {
        return (
            <RTInfoCard value={this.getValue.bind(this)()} showTimeControl={true}
                        description={this.getDescription.bind(this)()} onTimeChange={this.timeChange.bind(this)}>
                <div className="chart-wrapper mx-3" style={{ height: '70px'}}>
                    <Line options={this.chartOptions} data={this.state.chartData} height={70} />
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
            return this.props.getDescription(this.state.currentData);
        }
        else {
            return '';
        }
    }

    getValue() {
        if(this.props.getValue){
            return this.props.getValue(this.state.currentData);
        }
        else {
            return this.props.postFix ? this.state.currentData + " " + this.props.postFix : this.state.currentData;
        }
    }

    timeChange(state){
        if(!state && this.state.running){
            this.setState({running : false},
                () => this.tmpNewData = false);
        }

        if(state && !this.state.running){
            if(this.tmpNewData){
                this.setState({
                    currentData : this.tmpCurrentData,
                    chartData : this.tmpChartData
                })
            }
            else {
                this.process.bind(this)();
            }
            this.setState({running : true});
        }
    }

    componentDidMount() {

        const interval = setInterval(() => {
            this.process.bind(this)();

        },this.props.every || 1000);

        this.setState({interval : interval,running : true});
    }

    process()
    {
        const datasetsCopy = this.state.chartData.datasets.slice(0);
        const dataCopy = datasetsCopy[0].data.slice(0);

        const data = this.props.getData();

        datasetsCopy[0].data = updateDataSet(dataCopy,{
            x: new Date(),
            y: data
        },this.props.maxLength);

        if(this.props.getDataLabel) {
            datasetsCopy[0].label = this.props.getDataLabel(data);
        }

        const chartData = Object.assign({},{
            datasets: datasetsCopy
        });

        if(this.state.running){
            this.setState({
                currentData : data,
                chartData : chartData
            });
        }
        else {
            this.tmpCurrentData = data;
            this.tmpChartData = chartData;
            this.tmpNewData = true;
        }
    }

    componentWillUnmount() {
        if(this.state.interval){
            clearInterval(this.state.interval);
        }
    }
}

export default RealTimeCard;