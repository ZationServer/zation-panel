import React, {Component} from 'react';
import RealTimeCard from "../../../components/realTimeCardCharts/RealTimeCard";
import DataEngine from "../../../core/DataEngine";
import RTTableCard from "../../../components/realTimeCardCharts/RTTableCard";
import Time from "../../../core/Time";
import {FaCheck, FaTimes} from "react-icons/fa";
import TableProgressRow from "../../../components/chartTools/TableProgressRow";
import RTServerInfoCard from "../../../components/realTimeCardCharts/RTServerInfoCard";
import TableAgeRow from "../../../components/chartTools/TableAgeRow";

const workerTableColumns = [
    {title: 'Leader', field: 'leader', filtering: false, render: rowData => {
            if(rowData.leader) {
                return <FaCheck height={20}/>
            }
            else{
                return <FaTimes height={20}/>
            }
        }},
    {title: 'Id', field: 'id'},
    {title: 'Age', field: 'age', filtering: false,render: rowData => {
            return <TableAgeRow rowData={rowData}/>
        }},
    {title: 'Client/s', field: 'clientCount'},
    {title: 'Cpu Usage', field: 'cpu', render: rowData => {
            return (
                <TableProgressRow progress={rowData.cpu + '%'}/>
            );
        }},
    {title: 'Memory Usage', field: 'memory', render: rowData => {
            return (
                <TableProgressRow progress={rowData.memory + '%'}/>
            );
        }},
    {title: 'Request/s', field: 'requestCount', type: 'numeric'},
];

const brokerTableColumns = [
    {title: 'Id', field: 'id'},
    {title: 'Age', field: 'age', filtering: false,render: rowData => {
            return <TableAgeRow rowData={rowData}/>
        }},
    {title: 'Cpu Usage', field: 'cpu', render: rowData => {
            return (
                <TableProgressRow progress={rowData.cpu + '%'}/>
            );
        }},
    {title: 'Memory Usage', field: 'memory', render: rowData => {
            return (
                <TableProgressRow progress={rowData.memory + '%'}/>
            );
        }}
];

class ServerDetail extends Component {
    constructor(props){
        super(props);

        this.id = props.match.params.id
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-sm-12 col-lg-12">
                           <RTServerInfoCard id={this.id}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 col-lg-3">
                            <RealTimeCard getDataLabel={ServerDetail.getClientsConnectedDesc}
                                          getDescription={ServerDetail.getClientsConnectedDesc} maxLength={20}
                                          getData={this.getClientsConnected.bind(this)} every={2000}/>
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <RealTimeCard getDataLabel={ServerDetail.getRequestsDesc}
                                          getDescription={ServerDetail.getRequestsDesc}
                                          getData={this.getRequest.bind(this)} maxLength={20} every={4000} />
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <RealTimeCard dataLabel={"Cpu usage"} description="Cpu usage"
                                          getData={this.getCpuUsage.bind(this)}
                                          every={2000}  maxLength={20} postFix={"%"}
                            />
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <RealTimeCard dataLabel={"Memory usage"} description="Memory usage"
                                          getData={this.getMemoryUsage.bind(this)}
                                          every={2000}  maxLength={20} postFix={"mb"}
                                          getValue={this.getMemoryUsageValue.bind(this)}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-lg-12">
                            <RTTableCard columns={workerTableColumns} getData={this.getWorkerTableData.bind(this)} value={"Worker"}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-lg-12">
                            <RTTableCard columns={brokerTableColumns} getData={this.getBrokerTableData.bind(this)} value={"Broker"}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    getBrokerTableData()
    {
        const dataset = [];
        const instance = DataEngine.getEngine().storage[this.id];
        if(instance){
            const brokers = instance.brokers;
            for(let bId in brokers){
                if(brokers.hasOwnProperty(bId)) {
                    const broker = brokers[bId];
                    dataset.push({
                        id : bId,
                        age : Time.processTimeSpan(broker.brokerStartedTimestamp),
                        started : broker.brokerStartedTimestamp,
                        cpu : Number(broker.system.cpu).toFixed(1),
                        memory : Number((broker.system.memory * 100) / instance.memory.totalMemMb).toFixed(1),
                    });
                }
            }
        }
        return dataset;
    }

    getWorkerTableData()
    {
        const dataset = [];
        const instance = DataEngine.getEngine().storage[this.id];
        if(instance){
            const workers = instance.workers;
            for(let wId in workers){
                if(workers.hasOwnProperty(wId)) {
                   const worker = workers[wId];
                   dataset.push({
                       id : worker.id,
                       leader : worker.id === 0,
                       age : Time.processTimeSpan(worker.workerStartedTimestamp),
                       started : worker.workerStartedTimestamp,
                       clientCount : worker.clientCount,
                       cpu :  Number(worker.cpu).toFixed(1),
                       memory : Number((worker.memory * 100) / instance.memory.totalMemMb).toFixed(1),
                       requestCount : (worker.httpRequests + worker.wsRequests)
                   });
                }
            }
        }
        return dataset;
    }

    getMemoryUsageValue(current) {
        return Number((current / DataEngine.getEngine().storage[this.id].memory.totalMemMb) * 100).toFixed(1) + ' %';
    }

    getMemoryUsage() {
        return Number(DataEngine.getEngine().storage[this.id].memory.usedMemMb).toFixed(1);
    }

    getCpuUsage() {
        return Number(DataEngine.getEngine().storage[this.id].cpu).toFixed(1);
    }

    static getClientsConnectedDesc(v) {
        return (v > 1 || v === 0) ? "Clients connected" : "Client connected";
    }

    static getRequestsDesc(v) {
        return (v > 1 || v === 0) ? "Requests" : "Request";
    }

    getRequest()
    {
        const instance = DataEngine.getEngine().storage[this.id];
        let count = 0;
        if(instance){
            const workers = instance.workers;
            for(let wId in workers){
                if(workers.hasOwnProperty(wId)) {
                    count+=workers[wId].httpRequests;
                    count+=workers[wId].wsRequests;
                }
            }
        }
        return count;
    }

    getClientsConnected(){
        const instance = DataEngine.getEngine().storage[this.id];
        let count = 0;
        if(instance){
            const workers = instance.workers;
            for(let wId in workers){
                if(workers.hasOwnProperty(wId)) {
                    count+=workers[wId].clientCount;
                }
            }
        }
        return count;
    }

}

export default ServerDetail;
