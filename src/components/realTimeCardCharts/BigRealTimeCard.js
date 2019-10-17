import React, {Component} from 'react';
import RTInfoCard from "../../components/infoCard/RTInfoCard";
import {Line} from "react-chartjs-2";
import CustomTooltips from "../../components/chartTools/customTooltips";
import {updateDataSet} from "./RealTimeFunc";

class BigRealTimeCard extends Component {

    constructor(props) {
        super(props);

        this.chartOptions = {
            animation: false,
            spanGaps : true,
            tooltips: {
                enabled: false,
                custom : CustomTooltips
            },
            maintainAspectRatio: false,
            legend: {
                display: (this.props.legend !== undefined) ? this.props.legend : true,
                labels : {
                    fontColor : '#ffffff'
                },
                position : 'bottom'
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

        const firstData = this.props.getData();


        const data = {
            datasets: [
            ],
        };

        this.state = {
            currentData : firstData,
            running : true,
            chartData : data
        };

        this.fillDataSet.bind(this)();

    }

    fillDataSet()
    {
        const d1 = new Date();
        const d2 = new Date();
        d2.setMilliseconds(d1.getMilliseconds()+((this.props.every /2) || 1000));

        this.state.currentData.forEach((value,i) => {
            this.state.chartData.datasets.push(
                {
                    label: this.props.label ? this.props.label[i] : this.props.getDataLabel(value),
                    backgroundColor: i===0 ? 'rgba(48, 153, 187,.3)' : 'rgba(43, 225, 98,.3)',
                    borderColor: i===0 ? 'rgba(48, 153, 187,.55)' : 'rgba(43, 225, 98,.55)',
                    data: [{
                        x : d1,
                        y : value
                    },
                        {
                            x : d2,
                            y : value
                        }]
                }
            );
        });

    }


    render() {
        return (
            <RTInfoCard value={this.getValue.bind(this)()} big={true}
                        description={this.getDescription.bind(this)()} onTimeChange={this.timeChange.bind(this)}>
                <div className="chart-wrapper mx-3" style={{ height: '300px'}}>
                    <Line options={this.chartOptions} data={this.state.chartData} height={70}/>
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

        this.setState({interval : interval,running : true})
    }

    process()
    {
        const datasetsCopy = this.state.chartData.datasets.slice(0);

        const data = this.props.getData();

        data.forEach((d,i) => {
            const dataCopy = datasetsCopy[i].data.slice(0);
            datasetsCopy[i].data = updateDataSet(dataCopy,{
                x: new Date(),
                y: d
            },this.props.maxLength);

            if(this.props.getDataLabel) {
                datasetsCopy[i].label = this.props.getDataLabel(d);
            }
        });

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

export default BigRealTimeCard;