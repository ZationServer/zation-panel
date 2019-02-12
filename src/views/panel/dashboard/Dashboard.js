import React, {Component} from 'react';
import './dashboard.css';
import DataEngine from "../../../core/DataEngine";
import RealTimeCard from "../../../components/RealTimeCard/RealTimeCard";
import BigRealTimeCard from "../../../components/RealTimeCard/BigRealTimeCard";

class Dashboard extends Component {

    render() {
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-sm-6 col-lg-3">
                            <RealTimeCard getDataLabel={Dashboard.getClientsConnectedDesc} getDescription={Dashboard.getClientsConnectedDesc} maxLength={10} getData={Dashboard.getClientsConnected} every={2300}/>
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <RealTimeCard dataLabel={"Worker"} getDescription={Dashboard.getWorkerDesc} getData={Dashboard.getWorkerOnline} maxLength={10} every={5000} />
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <RealTimeCard dataLabel={"Cpu usage"} description="Cpu usage" getData={Dashboard.getCpuUsage} every={2300} maxLength={10} postFix={"%"}/>
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <RealTimeCard dataLabel={"Memory usage"} description="Memory usage" getData={Dashboard.getMemoryUsage} every={2500}  maxLength={10} postFix={"mb"} getValue={Dashboard.getMemoryUsagePercent}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-lg-12">
                            <BigRealTimeCard description="Requests in total" label={['WebSocket Requests','HTTP Requests']}
                                             getValue={(v) => {return v.reduce((a, b) => a + b, 0);}} getData={Dashboard.getRequestData} maxLength={20} every={1000}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    static getRequestData() {
        return [DataEngine.getEngine().clusterInfoStorage.wsRequests,
            DataEngine.getEngine().clusterInfoStorage.httpRequests];
    }

    static getWorkerDesc() {
        return "Worker online (" + DataEngine.getEngine().instanceCount + " Server)"
    }

    static getClientsConnectedDesc(v) {
        return (v > 1 || v === 0) ? "Clients connected" : "Client connected";
    }

    static getClientsConnected() {
        return DataEngine.getEngine().clusterInfoStorage.clientCount;
    }

    static getCpuUsage() {
        return Number(DataEngine.getEngine().clusterInfoStorage.cpu).toFixed(1);
    }

    static getMemoryUsage() {
        return Number(DataEngine.getEngine().clusterInfoStorage.memory.usedMemMb).toFixed(1);
    }

    static getMemoryUsagePercent(current)
    {
        return Number((current / DataEngine.getEngine().clusterInfoStorage.memory.totalMemMb) * 100).toFixed(1) + ' %';
    }

    static getWorkerOnline() {
        return DataEngine.getEngine().workerCount;
    }

}

export default Dashboard;
