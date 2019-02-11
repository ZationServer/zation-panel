import React, {Component} from 'react';
import InfoCard from "../../../components/InfoCard/InfoCard";
import {Line} from "react-chartjs-2";
import './dashboard.css';
import CustomTooltips from "../../../components/chart/customTooltips";
import DataEngine from "../../../core/DataEngine";

const updateDataSet = (data,newData) =>{
  if(data.length >= 20) {
      const tmpData = data.splice(1);
      tmpData.push(newData);
      return tmpData;
  }
  else {
      data.push(newData);
      return data;
  }
};

const connectedClientsData = {
    datasets: [
        {
            label: 'Clients connected',
            backgroundColor: 'rgba(255,255,255,.3)',
            borderColor: 'rgba(255,255,255,.55)',
            data: [{
                x: Date.parse('01 Jan 1970 00:00:00 GMT'),
                y: 1
            }, {
                t: Date.parse('01 Jan 1970 00:00:01 GMT'),
                y: 10
            },
                {
                    t: Date.parse('01 Jan 1970 00:00:02 GMT'),
                    y: 4
                },

                {
                    t: Date.parse('01 Jan 1970 00:00:03 GMT'),
                    y: 9
                },
                {
                    t: Date.parse('01 Jan 1970 00:00:04 GMT'),
                    y: 19
                },{
                    t: Date.parse('01 Jan 1970 00:00:05 GMT'),
                    y: 2
                },
                {
                    t: Date.parse('01 Jan 1970 00:00:06 GMT'),
                    y: 39
                }

            ]
        },
    ],
};

const cardChartOpts = {
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
            top: 8
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
                    autoSkip: true,
                    min: 0,
                    max: 2,
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
    },
};

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();

        this.state = {
            connectedClients : 0,
            connectedClientsData : {
                datasets: [
                    {
                        label: 'Clients connected',
                        backgroundColor: 'rgba(255,255,255,.3)',
                        borderColor: 'rgba(255,255,255,.55)',
                        data: []
                    },
                ],
            }
        }
    }


    render() {
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-12 col-sm-6 col-lg-3">
                            <InfoCard value={this.state.connectedClients} description="Clients connected" >
                                <div className="chart-wrapper mx-3" style={{ height: '70px'}}>
                                    <Line options={cardChartOpts} data={this.state.connectedClientsData} height={70}/>
                                </div>
                            </InfoCard>
                        </div>

                    </div>
                </div>
            </div>
        )
    }


    componentDidMount() {

        const connectedClientsInterval = setInterval(() => {
            const connectedClients = DataEngine.getEngine().clusterInfoStorage.clientCount + parseInt(Math.random()*10000);

            const datasetsCopy = this.state.connectedClientsData.datasets.slice(0);
            const dataCopy = datasetsCopy[0].data.slice(0);

            datasetsCopy[0].data = updateDataSet(dataCopy,{
                x: new Date(),
                y: connectedClients
            });

            console.log(datasetsCopy);

            if(connectedClients !== this.state.connectedClients) {
                this.setState({
                    connectedClients : connectedClients,
                    connectedClientsData : Object.assign({},{
                        datasets: datasetsCopy
                    })
                });
            }

        },1000);

        this.setState({connectedClientsInterval : connectedClientsInterval})
    }

    componentWillUnmount() {
        clearInterval(this.state.connectedClientsInterval);
    }

}

export default Dashboard;
