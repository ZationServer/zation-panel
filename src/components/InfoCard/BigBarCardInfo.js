import React, {Component} from 'react';
import InfoCard from "../../components/InfoCard/InfoCard";
import {Bar} from "react-chartjs-2";
import CustomTooltips from "../../components/chart/customTooltips";


const zeroCompensation = {
    renderZeroCompensation: function (chartInstance, d) {

        const view = d._view;
        const context = chartInstance.chart.ctx;
        const startX = view.x - view.width / 2;
        context.beginPath();
        context.strokeStyle = '#aaaaaa';
        context.moveTo(startX, view.y);
        context.lineTo(startX + view.width, view.y);
        context.stroke();
    },

    afterDatasetsDraw: function (chart, easing) {
        const meta = chart.getDatasetMeta(0);
        const dataSet = chart.config.data.datasets[0].data;
        meta.data.forEach((d, index) => {
            if(dataSet[index] === 0) {
                this.renderZeroCompensation(chart, d)
            }
        })
    }
};

class BigBarCardInfo extends Component {

    constructor(props) {
        super(props);


        this.chartOptions = {
            responsive:true,
            scaleBeginAtZero:false,
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
                        display: true,
                        beginAtZero:true
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

    }

    buildDataSet()
    {
        return {
            labels: this.props.label,
            datasets: [
                {
                    backgroundColor: 'rgba(48, 153, 187,1)',
                    borderColor: 'rgba(48, 153, 187,1)',
                    data: this.props.data
                }
            ],
        };

    }

    render() {
        return (
            <InfoCard value={this.props.value} big={true}
                      description={this.props.description}>
                <div className="chart-wrapper mx-3" style={{ height: '300px'}}>
                    <Bar options={this.chartOptions} data={this.buildDataSet.bind(this)()} height={100} plugins={[zeroCompensation]}
                         redraw={this.props.redraw}
                     />
                </div>
            </InfoCard>
        )
    }

}

export default BigBarCardInfo;
