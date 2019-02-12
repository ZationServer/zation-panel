import React, {Component} from 'react';
import RTInfoCard from "../../components/InfoCard/RTInfoCard";
import {Line} from "react-chartjs-2";
import CustomTooltips from "../../components/chart/customTooltips";
import {updateDataSet} from "./RealTimeFunc";

class BigRealTimeCard extends Component {

    constructor(props) {
        super(props);

        this.chartOptions = {
            spanGaps : true,
            tooltips: {
                enabled: false,
                custom : CustomTooltips
            },
            maintainAspectRatio: false,
            legend: {
                display: true,
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
            value : firstData,
            isRunning : true,
            data : data
        };

        this.fillDataSet.bind(this)();

    }

    fillDataSet()
    {
        const d1 = new Date();
        const d2 = new Date();
        d2.setMilliseconds(d1.getMilliseconds()+(this.interval || 1000));

        this.state.value.forEach((value,i) => {
            this.state.data.datasets.push(
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
                    <Line options={this.chartOptions} data={this.state.data} height={70}/>
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

        const interval = setInterval(() => {
            this.process.bind(this)();

        },this.props.every || 1000);

        this.setState({interval : interval,isRunning : true})
    }

    process()
    {
        const datasetsCopy = this.state.data.datasets.slice(0);

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

        this.setState({
            value : data,
            data : Object.assign({},{
                datasets: datasetsCopy
            })
        });
    }

    componentWillUnmount() {
        if(this.state.interval){
            clearInterval(this.state.interval);
        }
    }
}

export default BigRealTimeCard;