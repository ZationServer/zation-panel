import React, {Component} from 'react';
import BigRealTimeCard from "../../../components/realTimeCardCharts/BigRealTimeCard";
import DataEngine from "../../../core/DataEngine";
import RTPieCard from "../../../components/realTimeCardCharts/RTPieCard";
import RTSwitchBarCard from "../../../components/realTimeCardCharts/RTSwitchBarCard";

const color = ['#F47B00','#2BE162','#FF4D31','#2EAFD3','#A5F62F'];

class Clients extends Component {

    render() {
        return (
            <div className="container-fluid">
                <div className="animated fadeIn">
                    <div className="row">
                        <div className="col-sm-12 col-lg-12">
                            <BigRealTimeCard redraw={true} getValue={(v) => {return v[0]}}
                                             getData={Clients.getClientCount} maxLength={40} every={1000}
                                             getDataLabel={Clients.getClientsConnectedDesc} getDescription={Clients.getClientsConnectedDesc}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12 col-lg-6">
                            <RTPieCard getData={Clients.getPieUserGroupsData} every={1000}
                                       getValue={Clients.getPieUserGroupsValue} description={"User groups"}
                            />
                        </div>
                        <div className="col-sm-12 col-lg-6">
                            <RTSwitchBarCard getData={Clients.getClientDistributionData} every={1000} postFix={"Client/s"}
                                       value={"Client distribution"} getSwitchDefault={Clients.getClientDistributionSwitchDefault}
                                             getDescription={Clients.getClientDistributionDesc}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    static getClientDistributionDesc(state) {
        return state ? 'On server' : 'On worker';
    }

    static getClientDistributionData(state)
    {
        const labels = [];
        const data = [];

        const dataEngine = DataEngine.getEngine();
        const instances = dataEngine.storage;

        if(state){
            let i = 1;
            for(let instanceId in instances){
                if(instances.hasOwnProperty(instanceId)) {
                    labels.push('Server ' + i);
                    const workers = instances[instanceId].workers;
                    let count = 0;
                    for(let workerId in workers){
                         if(workers.hasOwnProperty(workerId)){
                             count+=workers[workerId].clientCount;
                         }
                    }
                    data.push(count);
                    i++;
                }
            }
        }
        else{
            let instanceNum = 1;
            for(let instanceId in instances){
                if(instances.hasOwnProperty(instanceId)) {
                    const workers = instances[instanceId].workers;
                    for(let workerId in workers){
                        if(workers.hasOwnProperty(workerId)){
                            labels.push('Server ' + instanceNum+' - Worker '+workers[workerId].id);
                            data.push(workers[workerId].clientCount);
                        }
                    }
                    instanceNum++;
                }
            }
        }

        return {
            labels: labels,
            datasets: [{
                backgroundColor: 'rgba(48, 153, 187,1)',
                borderColor: 'rgba(48, 153, 187,1)',
                data: data
            }
            ]
        };
    }

    static getClientDistributionSwitchDefault() {
        return DataEngine.getEngine().instanceCount > 1;
    }

    static getPieUserGroupsData()
    {
        const data = {
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: [],
                    hoverBackgroundColor: [],
                    borderColor : '#343a40'
                }]
        };

        const dataEngine = DataEngine.getEngine();

        const user = dataEngine.clusterInfoStorage.user;

        Clients._addGroup(data,user.defaultUserGroupCount,dataEngine.defaultUserName,'#3099bb');

        const auth = user.authUserGroups;

        let i = 0;
        for(let group in auth){
            if(auth.hasOwnProperty(group)){
                let name = group;
                if(dataEngine.panelAuthUserMap.hasOwnProperty(group)) {
                    name = dataEngine.panelAuthUserMap[group];
                }
                Clients._addGroup(data,auth[group],name,color[i]);
            }
            i++;
            if(i === color.length){
                i = 0;
            }
        }
        return data;
    }

    static _addGroup(data,count,label,color)
    {
        data.labels.push(label);
        const dataset = data.datasets[0];
        dataset.data.push(count);
        dataset.backgroundColor.push(color);
        dataset.hoverBackgroundColor.push(color);
    }

    static getPieUserGroupsValue() {
        return ((Object.keys(DataEngine.getEngine().clusterInfoStorage.user.authUserGroups).length) +1);
    }

    static getClientsConnectedDesc(v) {
        return (v > 1 || v === 0) ? "Clients connected" : "Client connected";
    }

    static getClientCount() {
        return [DataEngine.getEngine().clusterInfoStorage.clientCount];
    }

}

export default Clients;
