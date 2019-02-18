import React, {Component} from 'react';
import RTInfoCard from "../../components/infoCard/RTInfoCard";
import DataEngine from "../../core/DataEngine";
import './realTimeNetworkCard.css';

import cytoscape from'cytoscape';
import euler from 'cytoscape-euler';
import nodeHtmlLabel from 'cytoscape-node-html-label';
nodeHtmlLabel(cytoscape);
cytoscape.use(euler);

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

        const clusterBrokersList = DataEngine.getEngine().clusterBrokerList;
        let showClusterBrokers = false;
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

        for (let instanceId in instances) {
            if (instances.hasOwnProperty(instanceId)) {
                const nodeMasterId = instanceId+'-master';
                nodes.push({
                    data : {
                        id: nodeMasterId,
                        label: 'Master ' + masterId,
                    },
                    group: "nodes",
                    classes: '11 master'
                });

                const instance = instances[instanceId];
                const workers = instance.workers;

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

    update() {
        this.setState({
            data: this._processData()
        },() => {this.resetCy();});
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
            this.componentDidMount.bind(this)();
        }
    }

    resetCy() {
        /*
        algorithm
        for checked old and new dataset
        all nodes must removed to []
        all nodes must added to []

        ids muss be unique for every process

        use cypo add/remove and batch (not update the diagram every remove or add)
         */
        this.cy.elements(this.state.data);
    }

    componentDidMount() {

        this.cy = cytoscape({
            container: document.getElementById('cy-'+this.id),
            layout: {
                name: 'euler',
                randomize: true,
                animate: false
                // some more options here...
            },
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
                    selector: 'edge',
                    style: {
                        'line-color': '#26292d',
                        'opacity': 1
                    }
                }
            ],
            elements : this.state.data
        });

        this.cy.nodeHtmlLabel([{
            query: '.11',
            valign: "top",
            halign: "center",
            valignBox: "top",
            halignBox: "center",
            tpl: function(data) {
                return '<p class="cy-title__p1">' + data.label + '</p>';
            }
        }]);


        const interval = setInterval(() => {
            this.process.bind(this)();

        }, this.props.every || 5000);

        this.setState({interval: interval, isRunning: true});
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