/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, {useEffect} from "react";
import RTCard, {RTCardHandle} from "../../../cards/rtCard";
import classes from "./index.module.css";
import {useNavigate} from "react-router-dom";

import cytoscape from 'cytoscape';
import useConnector from "../../../../../lib/hooks/useConnector";
import {deepEqual} from "queric";
require('cytoscape-node-html-label')(cytoscape);
cytoscape.use(require('cytoscape-euler'));

const LAYOUT_OPTIONS = {
    name: 'euler',
    animate: 'end',
    randomize : true,
    pull: 0.000001,
    theta: 0.5,
    fit: true,
    padding: 100
};

const STYLES = [
    {
        selector: 'core',
        style: {
            'active-bg-color': '#06080a'
        } as any
    },
    {
        selector: 'node',
        style: {
            'background-color': '#60b8d2',
            'overlay-shape': 'ellipse',
            'overlay-color': '#1e5b6d',
        }
    },
    {
        selector: 'edge',
        style: {
            'line-color': '#3a4248',
            'opacity': 1
        }
    },
    {
        selector: '.cy-light-edge',
        style: {
            'line-color': '#3a4248',
            'opacity': 0.5
        }
    },
    {
        selector: '.cy-worker',
        style: {
            'background-color': '#60b8d2',
        }
    },
    {
        selector: '.cy-state',
        style: {
            'background-color': '#80FF72',
        }
    },
    {
        selector: '.cy-broker',
        style: {
            'background-color': '#FF6978',
        }
    },
    {
        selector: '.cy-leader',
        style: {
            'background-color': '#FFF07C',
        }
    },
];

const NetworkStatus: React.FC<{
    interval?: number;
}> = ({interval = 5000}) => {
    const connector = useConnector();
    const rtCardRef = React.useRef<RTCardHandle>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const cyRef = React.useRef<cytoscape.Core | null>(null);
    const structureRef = React.useRef<cytoscape.ElementsDefinition | null>(null);

    const navigate = useNavigate();

    const buildStructure = () => {
        const edges: cytoscape.EdgeDefinition[] = [];
        const nodes: cytoscape.NodeDefinition[] = [];

        const brokers = connector.brokers,
            workers = connector.workers,
            state = connector.state,
            stateActive = state != null;

        const stateNodeId = 'state';
        if(stateActive) {
            nodes.push({
                data: {
                    id: stateNodeId,
                    primaryLabel: state!.name,
                    secondaryLabel: "State",
                    serverId: state!.id
                },
                group: "nodes",
                classes: "cy-label cy-state"
            });
        }

        for(const brokerId in brokers) {
            if(!brokers.hasOwnProperty(brokerId)) continue;
            const broker = brokers[brokerId];
            const brokerNodeId = `broker-${brokerId}`;
            nodes.push({
                data: {
                    id: brokerNodeId,
                    primaryLabel: broker.name,
                    secondaryLabel: "Broker",
                    serverId: brokerId
                },
                group: "nodes",
                classes: "cy-label cy-broker"
            })
            if(stateActive && broker.connectedToState) {
                edges.push({
                    data: {
                        id: `${brokerNodeId}.${stateNodeId}`,
                        source: brokerNodeId,
                        target: stateNodeId,
                    },
                    group: "edges",
                    classes: 'cy-light-edge'
                });
            }
        }

        for(const workerId in workers) {
            if(!workers.hasOwnProperty(workerId)) continue;
            const worker = workers[workerId], workerNodeId = `worker-${workerId}`;
            const classNames = ["cy-worker","cy-label"];
            if(worker.leader) classNames.push("cy-leader");
            nodes.push({
                data : {
                    id: workerNodeId,
                    primaryLabel: worker.name,
                    secondaryLabel: "Worker",
                    leader: worker.leader,
                    serverId: workerId
                },
                group: "nodes",
                classes: classNames.join(" ")
            });
            if(stateActive && worker.connectedToState) {
                edges.push({
                    data: {
                        id: `${workerNodeId}.${stateNodeId}`,
                        source: workerNodeId,
                        target: stateNodeId,
                    },
                    group: "edges",
                    classes: 'cy-light-edge'
                });
            }
            const workerBrokers = worker.brokers;
            for(let i = 0, len = workerBrokers.length; i < len; i++) {
                const brokerId = workerBrokers[i];
                const brokerNodeId = `broker-${brokerId}`;
                if(brokers[brokerId] == null) continue;
                edges.push({
                    data: {
                        id: `${workerNodeId}.${brokerNodeId}`,
                        source: workerNodeId,
                        target: brokerNodeId,
                    },
                    group: "edges",
                    classes: 'cy-light-edge'
                });
            }
        }
        return {nodes,edges};
    };

    const parseElementIds = (structure: cytoscape.ElementsDefinition) => {
        const elements = [...structure.nodes,...structure.edges];
        return elements.map(element => element.data.id);
    }

    const updateNetwork = (currentStructure: cytoscape.ElementsDefinition,newStructure: cytoscape.ElementsDefinition) => {
        const cy = cyRef.current;
        if(!cy) return;

        const currentElementIds = parseElementIds(currentStructure);
        const newElements = [...newStructure.nodes,...newStructure.edges];

        cy.startBatch();
        let modified = false;

        newElements.forEach(newElement => {
            const id = newElement.data.id;
            if(!id) return;
            const currentIndexOfId = currentElementIds.indexOf(id);
            if(currentIndexOfId !== -1) {
                //Update existing element data
                const currentElement = cy.$id(id);
                if(currentElement != null && !deepEqual(currentElement.data(),newElement.data)) {
                    if(newElement.data.leader) currentElement.addClass("cy-leader")
                    else currentElement.removeClass("cy-leader");

                    currentElement.data(newElement.data);
                    modified = true;
                }
                currentElementIds.splice(currentIndexOfId, 1);
            }
            else {
                cy.add(newElement);
                modified = true;
            }
        });

        currentElementIds.forEach(id => {
            if(id == null) return;
            cy.remove(cy.getElementById(id));
            modified = true;
        });

        if(modified) cy.layout(LAYOUT_OPTIONS).run();
        cy.endBatch();
    };

    const update = (force?: boolean) => {
        if(!force && !rtCardRef.current!.isRunning()) return;
        const currentStructure = structureRef.current;
        if(!currentStructure) return;

        const newStructure = buildStructure();
        structureRef.current = newStructure;

        updateNetwork(currentStructure,newStructure);
    }

    useEffect(() => {
        if(!containerRef.current) return;
        const structure = buildStructure();
        structureRef.current = structure;
        const cy = cytoscape({
            container: containerRef.current,
            layout: LAYOUT_OPTIONS,
            maxZoom: 2,
            minZoom: 0.4,
            style: STYLES,
            elements: structure
        });
        // @ts-ignore
        cy.nodeHtmlLabel([{
            query: '.cy-label',
            valign: "top",
            halign: "center",
            valignBox: "top",
            halignBox: "center",
            tpl: (data: any) => `<div>
                    ${`<p class="${classes.label} ${classes.primaryLabel}">` + data.primaryLabel + '</p>'}
                    ${`<p class="${[classes.label,classes.secondaryLabel,
                ...(data.leader ? [classes.secondaryLeaderLabel] : [])].join(" ")}">` + (data.leader ? "👑 " : "") + 
                    data.secondaryLabel + '</p>'}
                </div>`
        }]);

        const doubleClickDelayMs = 350;
        let previousTapStamp: number;
        cy.on('tap', (e) => {
            const currentTapStamp = e.timeStamp;
            const msFromLastTap = currentTapStamp - previousTapStamp;
            previousTapStamp = currentTapStamp;
            if(msFromLastTap < doubleClickDelayMs) e.target.trigger('doubleTap', e);
            else {
                const serverId = e.target.data()?.serverId;
                if(serverId != null) {
                    navigate("/servers/" + serverId,{});
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        });
        cy.on('doubleTap',() => {
            cy.layout(LAYOUT_OPTIONS).run();
        });
        cyRef.current = cy;
    },[containerRef]);

    useEffect(() => {
        const intervalTicker = setInterval(() => update(),interval);
        return () => clearInterval(intervalTicker);
    },[interval]);

    return (
        <RTCard ref={rtCardRef} value={"Network"} big className={classes.card}
                onRunningStateChange={state => state && update(true)}>
            <div className={classes.wrapper}>
                <div className={classes.container} ref={containerRef}/>
            </div>
        </RTCard>
    )
}

export default NetworkStatus;