import React, {Component} from 'react';
import RTInfoCard from "../../components/infoCard/RTInfoCard";
import DataEngine from "../../core/DataEngine";
import {Sigma, RandomizeNodePositions, RelativeSize, NOverlap} from 'react-sigma';
import {CameraZoom} from "../sigmaJs/CameraZoom";

const settings = {
    drawEdges: true,
    clone: false,
    defaultNodeColor: '#3099bb',
    defaultLabelColor:'#ffffff',
    labelThreshold:0,
    minNodeSize : 10,
    maxNodeSize : 15,
    minEdgeSize : 1,
    maxEdgeSize : 3,
    fontStyle : "NexaBold",
    labelSize: "proportional",
    webglOversamplingRatio : 4,
};

class RealTimeNetworkCard extends Component {

    constructor(props) {
        super(props);

        this.id = RealTimeNetworkCard.id;
        RealTimeNetworkCard.id++;

        this.state = {
            data: this._processData(),
            isRunning: true,
        };
    }

    _processData() {
        const instances = DataEngine.getEngine().storage;

        const edges = [];
        const nodes = [];

        let masterId = 1;
        let nodeId = 0;
        let edgeId = 0;

        const clusterBrokersList = DataEngine.getEngine().clusterBrokerList;
        let showClusterBrokers = false;
        const clusterBrokers = [];

        if (Array.isArray(clusterBrokersList)) {
            showClusterBrokers = true;
            clusterBrokersList.forEach((v, id) => {
                nodes.push({
                    id: nodeId,
                    label: 'Cluster-Broker ' + id,
                    size : 2
                });
                clusterBrokers.push(nodeId);
            });
            nodeId++;
        }

        for (let instanceId in instances) {
            if (instances.hasOwnProperty(instanceId)) {
                nodes.push({
                    id: nodeId,
                    label: 'Master ' + masterId,
                    size : 3,
                    color : '#2be162'
                });

                const instance = instances[instanceId];
                const workers = instance.workers;
                const nodeMasterId = nodeId;

                for (let workerFullId in workers) {
                    nodeId++;
                    if (workers.hasOwnProperty(workerFullId)) {
                        nodes.push({
                            id: nodeId,
                            label: 'Worker ' + workers[workerFullId].id,
                            size : 2
                        });
                        edges.push({
                            id : edgeId,
                            source: nodeId,
                            target: nodeMasterId,
                            size : 2
                        });
                        edgeId++;
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
                        nodeId++;
                        nodes.push({
                            id: nodeId,
                            label: 'Broker ' + brokerId,
                            size : 2
                        });
                        edges.push({
                            id : edgeId,
                            source: nodeId,
                            target: nodeMasterId,
                            size : 2
                        });
                        edgeId++;

                        if (showClusterBrokers) {
                            for(let i = 0; i < clusterBrokers.length; i++) {
                                edges.push({
                                    id : edgeId,
                                    source: nodeId,
                                    target: clusterBrokers[i],
                                    size : 2
                                });
                                edgeId++;
                            }
                        }
                    }
                }
                nodeId++;
                masterId++;
            }
        }
        return {
            nodes: nodes,
            edges: edges
        }
    }

    update() {
        this.setState({
            data: this._processData()
        });
    }

    render() {
        return (
            <RTInfoCard value={'Network'} showTimeControl={true} onTimeChange={this.timeChange.bind(this)} big={true} height={'35rem'}>
                <div className="chart-wrapper mx-3" style={{height: '15rem'}}>
                    <Sigma style={{height : '30.5rem', top : '-14.5rem',position : 'relative'}} graph={this.state.data} settings={settings}>
                        <RelativeSize initialSize={5}/>
                        <RandomizeNodePositions/>
                        <NOverlap gridSize={13} maxIterations={100} nodeMargin={18}/>
                        <CameraZoom/>
                    </Sigma>
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
            this.componentDidMount.bind(this)();
        }
    }

    componentDidMount() {

        const interval = setInterval(() => {
            this.process.bind(this)();

        }, this.props.every || 5000);

        this.setState({interval: interval, isRunning: true});

        this.update();
    }

    process() {
        this.update();
    }

    componentWillUnmount() {
        if (this.state.interval) {
            clearInterval(this.state.interval);
        }
    }
}

RealTimeNetworkCard.id = 0;

export default RealTimeNetworkCard;