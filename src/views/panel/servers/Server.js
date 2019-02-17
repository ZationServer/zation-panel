import React, {Component} from 'react';
import BigRealTimeCard from "../../../components/realTimeCardCharts/BigRealTimeCard";
import DataEngine from "../../../core/DataEngine";
import RTTableCard from "../../../components/realTimeCardCharts/RTTableCard";
import Time from "../../../core/Time";
import {FaCheck, FaInfoCircle, FaTimes} from 'react-icons/fa';
import TableProgressRow from "../../../components/chartTools/TableProgressRow";

const serverTableColumns = [
    {title: 'Leader', field: 'leader', filtering: false, render: rowData => {
            if(rowData.leader) {
                return <FaCheck height={20}/>
            }
            else{
                return <FaTimes height={20}/>
            }
        }},
    {title: 'Id', field: 'id'},
    {title: 'Age', field: 'age', filtering: false},
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
    {title: 'Worker', field: 'workerCount', type: 'numeric'},
    {title: 'Broker', field: 'brokerCount', type: 'numeric'},
    {title: 'Request/s', field: 'requestCount', type: 'numeric'},
];

class Server extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-sm-6 col-lg-6">
                            <BigRealTimeCard legend={false} description="Cpu usage" getData={Server.getCpuUsage} maxLength={20}
                                             every={1000} postFix={"%"} label={["Cpu usage"]}/>
                        </div>
                        <div className="col-sm-6 col-lg-6">
                            <BigRealTimeCard legend={false} label={"Memory usage"} description="Memory usage" getData={Server.getMemoryUsage}
                                             every={2000}  maxLength={10} postFix={"mb"} getValue={Server.getMemoryUsagePercent}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-lg-12">
                            <RTTableCard actions={[{
                                    icon: FaInfoCircle,
                                    tooltip: 'Show more information',
                                    onClick: (event, rowData) => {this.props.history.push('server/'+rowData.id);},
                                    iconProps: {
                                        style:{
                                            fontSize: 30
                                        }
                                    }
                                }
                            ]} columns={serverTableColumns} getData={Server.getServerTableData} value={"Server"}/>
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
                    leader: instance.master.isLeader,
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

export default Server;
