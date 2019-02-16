import React, {Component} from 'react';
import BigRealTimeCard from "../../../components/realTimeCardCharts/BigRealTimeCard";
import DataEngine from "../../../core/DataEngine";
import RTTableCard from "../../../components/realTimeCardCharts/RTTableCard";
import Time from "../../../core/Time";

const serverTableColumns = [
    {title: 'Id', field: 'id'},
    {title: 'Age', field: 'age', },
    {title: 'Clients', field: 'clientCount'},
    {title: 'Cpu Usage', field: 'cpu', render: rowData => {
            const score = rowData.cpu + '%';
            return (
                <div style={{width: '100%', backgroundColor: '#999999', height: 20}}>
                    <div style={{textAlign: 'left', padding: 1, color: 'white', width: score, backgroundColor: 'rgba(43, 225, 98,1.0)', height: 20}}/>
                </div>
            );
        }},
    {title: 'Memory Usage', field: 'memory', render: rowData => {
            const score = rowData.memory + '%';
            return (
                <div style={{width: '100%', backgroundColor: '#999999', height: 20}}>
                    <div style={{textAlign: 'left', padding: 1, color: 'white', width: score, backgroundColor: 'rgba(43, 225, 98,1.0)', height: 20}}/>
                </div>
            );
        }},
    {title: 'Worker', field: 'workerCount', type: 'numeric'},
    {title: 'Broker', field: 'brokerCount', type: 'numeric'},
    {title: 'Requests', field: 'requestCount', type: 'numeric'},
];

class Servers extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-sm-6 col-lg-6">
                            <BigRealTimeCard legend={false} description="Cpu usage" getData={Servers.getCpuUsage} maxLength={20}
                                             every={1000} postFix={"%"} label={["Cpu usage"]}/>
                        </div>
                        <div className="col-sm-6 col-lg-6">
                            <BigRealTimeCard legend={false} label={"Memory usage"} description="Memory usage" getData={Servers.getMemoryUsage}
                                             every={2000}  maxLength={10} postFix={"mb"} getValue={Servers.getMemoryUsagePercent}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-lg-12">
                            <RTTableCard columns={serverTableColumns} getData={Servers.getServerTableData} value={"Server"}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    static getServerTableData()
    {
        const dataset = [];
        const instances = DataEngine.getEngine().storage;
        for(let instanceId in instances){
            if(instances.hasOwnProperty(instanceId)){
                const instance = instances[instanceId];
                const workers = instance.workers;
                let workerCount = 0,clientCount = 0,reqCount = 0;
                for(let workerId in workers){
                    if(workers.hasOwnProperty(workerId)){
                        workerCount++;
                        const worker = workers[workerId];
                        clientCount+=worker.clientCount;
                        reqCount+=worker.httpRequests;
                        reqCount+=worker.wsRequests;
                    }
                }

                let data = {
                    id : instanceId,
                    age : Time.processAge(instance.serverStartedTimestamp),
                    workerCount : workerCount,
                    brokerCount : instance.brokerCount,
                    requestCount : reqCount,
                    cpu : instance.cpu,
                    clientCount : clientCount,
                    memory : '?'
                };

                if(instance.memory){
                    data.memory = Number((instance.memory.usedMemMb * 100) / instance.memory.totalMemMb).toFixed(1);
                }

                dataset.push(data);
            }
        }
        return dataset;
    }

    static getCpuUsage() {
        return [Number(DataEngine.getEngine().clusterInfoStorage.cpu).toFixed(1)];
    }

    static getMemoryUsage() {
        return [Number(DataEngine.getEngine().clusterInfoStorage.memory.usedMemMb).toFixed(1)];
    }

    static getMemoryUsagePercent(current)
    {
        return Number((current / DataEngine.getEngine().clusterInfoStorage.memory.totalMemMb) * 100).toFixed(1) + ' %';
    }

}

export default Servers;
