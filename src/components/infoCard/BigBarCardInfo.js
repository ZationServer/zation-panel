import React, {Component} from 'react';
import InfoCard from "../../components/infoCard/InfoCard";
import {Bar} from "react-chartjs-2";
import CustomTooltips from "../../components/chartTools/customTooltips";
import {zeroCompensation} from "../chartTools/barZeroCompensation";

class BigBarCardInfo extends Component {

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
                            min: 0
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
            <InfoCard value={this.props.value} extraBig={true} big={true}
                      description={this.props.description}>
                <div className="chart-wrapper mx-3" style={{ height: '300px'}}>
                    <Bar options={this.chartOptions} data={this.buildDataSet.bind(this)()} height={800} plugins={[zeroCompensation]}
                         redraw={this.props.redraw}
                     />
                </div>
            </InfoCard>
        )
    }

}

export default BigBarCardInfo;
