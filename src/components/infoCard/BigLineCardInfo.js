import React, {Component} from 'react';
import InfoCard from "../../components/infoCard/infoCard";
import {Line} from "react-chartjs-2";
import CustomTooltips from "../../components/chartTools/customTooltips";

const chartOptions = {
    spanGaps : true,
    tooltips: {
        enabled: false,
        custom : CustomTooltips
    },
    maintainAspectRatio: false,
    legend: {
        display: false
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

class BigLineCardInfo extends Component {

    constructor(props) {
        super(props);

        this.dataset = {
            labels: props.label,
            datasets: [
                {
                    backgroundColor: 'rgba(48, 153, 187,1)',
                    data: props.data
                }
            ],
        };
    }


    render() {
        return (
            <InfoCard value={this.props.value} big={true}
                        description={this.props.description} >
                <div className="chart-wrapper mx-3" style={{ height: '300px'}}>
                    <Line options={chartOptions} data={this.dataset} height={70}/>
                </div>
            </InfoCard>
        )
    }

}

export default BigLineCardInfo;
