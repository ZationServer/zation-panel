import React, {Component} from 'react';
import InfoCard from "../../../components/InfoCard/InfoCard";
import {Line} from "react-chartjs-2";
import './dashboard.css';
import CustomTooltips from "../../../components/chart/customTooltips";

const cardChartData2 = {
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: 'rgba(255,255,255,.3)',
            borderColor: 'rgba(255,255,255,.55)',
            data: [{
                x: new Date(),
                y: 1
            }, {
                t: new Date(''),
                y: 10
            }]
        },
    ],
};

const cardChartOpts2 = {
    tooltips: {
        enabled: false,
        custom : CustomTooltips
    },
    maintainAspectRatio: false,
    legend: {
        display: false,
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
                },

            }],
        yAxes: [
            {
                display: false,
                ticks: {
                    display: false,
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
    },
};

class Dashboard extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-12 col-sm-6 col-lg-3">
                            <InfoCard value="10000" description="Clients connected">
                                <div className="chart-wrapper mx-3" style={{ height: '70px'}}>
                                    <Line options={cardChartOpts2} data={cardChartData2} height={70}/>
                                </div>
                            </InfoCard>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

}

export default Dashboard;
