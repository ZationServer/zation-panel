import React, {Component} from 'react';
import RTInfoCard from "../../components/infoCard/RTInfoCard";
import DataEngine from "../../core/DataEngine";
import './realTimeNetworkCard.css';

import cytoscape from'cytoscape';
import euler from 'cytoscape-euler';
import nodeHtmlLabel from 'cytoscape-node-html-label';
nodeHtmlLabel(cytoscape);
cytoscape.use(euler);

const layoutOptions = {
    name: 'euler',
    randomize: true,
    animate: true
};

class RealTimeNetworkCard extends Component {

    constructor(props) {
        super(props);

        this.id = RealTimeNetworkCard.id;
        RealTimeNetworkCard.id++;

        this.currentData = this._processData();

        this.state = {
            isRunning: true,
        };

    }

    process() {
        const ids = this._datasetIds(this.currentData);
        this.currentData = this._processData();
        this._runBuildCommands(this._buildCommands(ids,this.currentData));
    }

    _buildCommands(ids,newData){
        const elements = newData.edges.concat(newData.nodes);
        const addNodes = [];
        const addEdges = [];

        elements.forEach((e) => {
            const id = e.data.id;
            if(ids.indexOf(id) !== -1) {
                const index = ids.indexOf(id);
                ids.splice(index, 1);
            }
            else{
                if(e.group === "nodes"){
                    addNodes.push(e);
                }
                else{
                    addEdges.push(e);
                }
            }
        });
        return {removeIds : ids,addNodes : addNodes, addEdges : addEdges};
    }

    _runBuildCommands(commands)
    {
        this.cy.startBatch();

        let changes = false;

        commands.removeIds.forEach((id) => {
            this.cy.remove(this.cy.getElementById(id));
            changes = true;
        });

        commands.addNodes.forEach((e) => {
            this.cy.add(e);
            changes = true;
        });

        commands.addEdges.forEach((e) => {
            this.cy.add(e);
            changes = true;
        });

        if(changes){
            this.cy.layout(layoutOptions).run();
        }

        this.cy.endBatch();
    }

    _datasetIds(data){
        const ids = [];
        const elements = data.edges.concat(data.nodes);
        elements.forEach((e) => {
            ids.push(e.data.id);
        });
        return ids;
    }

    _processData() {
        const instances = DataEngine.getEngine().storage;

        const edges = [];
        const nodes = [];

        let masterId = 1;

        const clusterBrokersList = DataEngine.getEngine().clusterBrokerList;
        let showClusterBrokers = false;
        let showClusterState = false;
        const clusterBrokers = [];

        if (Array.isArray(clusterBrokersList)) {
            showClusterBrokers = true;
            clusterBrokersList.forEach((v, id) => {
                const nodeId = 'cBroker'+v+id;
                nodes.push({
                    data : {
                        id: nodeId,
                        label: 'Cluster-Broker ' + id,
                    },
                    group: "nodes",
                    classes: '11'
                });
                clusterBrokers.push(nodeId);
            });
        }

        if(DataEngine.getEngine().clusterInfoStorage.stateServerActive) {
            showClusterState = true;
            nodes.push({
                data : {
                    id: 'cState',
                    label: 'Cluster-State',
                },
                group: "nodes",
                classes: '11'
            });
        }

        for (let instanceId in instances) {
            if (instances.hasOwnProperty(instanceId)) {

                const instance = instances[instanceId];
                const workers = instance.workers;
                const nodeMasterId = instanceId+'-master';

                const masterClass = instance.master['isLeader'] ? 'masterLeader' : 'master';

                nodes.push({
                    data : {
                        id: nodeMasterId,
                        label: 'Master ' + masterId,
                    },
                    group: "nodes",
                    classes: '11 '+masterClass
                });

                if(showClusterState && instance.master['stateServerConnected']) {
                    edges.push({
                        data : {
                            id : nodeMasterId+'cluster-state',
                            source: nodeMasterId,
                            target: 'cState',
                        },
                        group: "edges",
                        classes: 'lightEdge'
                    });
                }

                for (let workerFullId in workers) {
                    if (workers.hasOwnProperty(workerFullId)) {
                        const workerNodeId = instanceId+'-worker-'+workerFullId;
                        nodes.push({
                            data : {
                                id: workerNodeId,
                                label: 'Worker ' + workers[workerFullId].id,
                            },
                            group: "nodes",
                            classes: '11'
                        },);
                        edges.push({
                            data : {
                                id : nodeMasterId+workerNodeId,
                                source: nodeMasterId,
                                target: workerNodeId,
                            },
                            group: "edges"
                        });
                    }
                }

                let brokers;
                if (instance.brokers) {
                    brokers = instance.brokers;
                } else {
                    brokers = {};
                    for (let i = 0; i <= instance.brokerCount; i++) {
                        brokers[i] = null;
                    }
                }

                for (let brokerId in brokers) {
                    if (brokers.hasOwnProperty(brokerId)) {
                        const brokerNodeId = instanceId+'-broker-'+brokerId;
                        nodes.push({
                            data : {
                                id: brokerNodeId,
                                label: 'Broker ' + brokerId,
                            },
                            group: "nodes",
                            classes: '11'
                        });
                        edges.push({
                            data : {
                                id : nodeMasterId+brokerNodeId,
                                source: nodeMasterId,
                                target: brokerNodeId,
                            },
                            group: "edges"
                        });

                        if (showClusterBrokers) {
                            for(let i = 0; i < clusterBrokers.length; i++) {
                                edges.push({
                                    data : {
                                        id : brokerNodeId+clusterBrokers[i],
                                        source: brokerNodeId,
                                        target: clusterBrokers[i]
                                    },
                                    group: "edges"
                                });
                            }
                        }
                    }
                }
                masterId++;
            }
        }
        return {
            nodes: nodes,
            edges: edges
        }
    }

    render() {
        return (
            <RTInfoCard value={'Network'} showTimeControl={true} onTimeChange={this.timeChange.bind(this)} big={true} height={'35rem'}>
                <div className="chart-wrapper mx-3" style={{height: '15rem'}}>
                    <div id={"cy-"+this.id} style={{height : '30.5rem', top : '-14.5rem',position : 'relative'}}/>
                </div>
            </RTInfoCard>
        )
    }

    timeChange(state){
        if(!state && this.state.isRunning){
            clearInterval(this.state.interval);
            this.setState({isRunning : false});
        }

        if(state && !this.state.isRunning){
            this.process.bind(this)();
            this.setInterval.bind(this)();
        }
    }

    componentDidMount() {
        this.cy = cytoscape({
            container: document.getElementById('cy-'+this.id),
            layout : layoutOptions,
            style: [
                {
                    selector: 'node',
                    style: {
                        'background-color': '#3099bb',
                    }
                },
                {
                    selector: '.master',
                    style: {
                        'background-color': '#2be162',
                    }
                },
                {
                    selector: '.masterLeader',
                    style: {
                        'background-color': '#ffff00',
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'line-color': '#26292d',
                        'opacity': 1
                    }
                },
                {
                    selector: '.lightEdge',
                    style: {
                        'line-color': '#26292d',
                        'opacity': 0.5
                    }
                }
            ],
            elements : this.currentData
        });

        // noinspection JSUnresolvedFunction
        this.cy.nodeHtmlLabel([{
            query: '.11',
            valign: "top",
            halign: "center",
            valignBox: "top",
            halignBox: "center",
            tpl: function(data) {
                // noinspection CheckTagEmptyBody
                return '<p class="cy-title__p1">' + data.label + '</p>';
            }
        }]);

        this.cy.layout(layoutOptions).run();

        this.setInterval();
    }

    setInterval(){
        const interval = setInterval(() => {
            this.process.bind(this)();

        }, this.props.every || 5000);

        this.setState({interval: interval, isRunning: true});
    }

    componentWillUnmount() {
        if (this.state.interval) {
            clearInterval(this.state.interval);
        }
    }
}

RealTimeNetworkCard.id = 0;

export default RealTimeNetworkCard;