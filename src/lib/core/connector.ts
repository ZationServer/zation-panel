import ClusterSummaryInformation from "../definitions/clusterInformation";
import {Channel, Client} from "zation-client";
import {APIDefinition, PanelChannelPublishes} from "../definitions/apiDefinition";
import EventEmitter from "emitix";
import {Writable} from "../utils/typeUtils";
import LogMessage from "../definitions/logMessage";
import {
    BrokerInformation, ProcessedBrokerInformation,
    ProcessedServerInformation,
    ProcessedStateInformation,
    ProcessedWorkerInformation,
    ServerInformation,
    ServerType,
    WorkerInformation
} from "../definitions/serverInformation";
import HeartbeatTicker from "./heartbeatTicker";
import { generateServerName } from "../utils/serverNameGenerator";
import LatencyChecker from "./latencyChecker";

export default class Connector extends EventEmitter.Protected<{
    serverJoin: [string],
    serverLeave: [string],
    statsUpdate: [],
    logsUpdate: []
}>() {

    static DEFAULT_CLUSTER_SUMMARY: ClusterSummaryInformation = {
        resourceUsage: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        internalClientCount: 0,
        externalClientCount: 0,
        atLeastOneDebug: false,
        httpMessageCount: 0,
        wsMessageCount: 0,
        transmitMessageCount: 0,
        invokeMessageCount: 0,
        incomingHttpMessageCount: 0,
        incomingWsMessageCount: 0,
        incomingInvokeMessageCount: 0,
        incomingTransmitMessageCount: 0,
        launchedTimestamp: -1,
        memory: {totalMemMb: 0,usedMemMb: 0},
        users: {
            authUserGroupsCounts: {},
            defaultUserGroupCount: 0,
            panelUserCount: 0
        }
    }

    constructor(private readonly serverTimeout = 5000) {
        super();
        this._setServerTimeoutChecker();
    }

    readonly servers: Readonly<Record<string,ProcessedServerInformation>> = {};
    readonly serverCount: number = 0;
    private readonly serversLastActivity: Record<string,number> = {};

    readonly state?: ProcessedStateInformation;
    readonly workers: Readonly<Record<string,ProcessedWorkerInformation>> = {};
    readonly workerCount: number = 0;
    readonly brokers: Readonly<Record<string,ProcessedBrokerInformation>> = {};
    readonly brokerCount: number = 0;

    readonly clusterSummary: ClusterSummaryInformation = {...Connector.DEFAULT_CLUSTER_SUMMARY};
    readonly panelAuthUserMap: Record<string,string> = {};
    readonly defaultUserGroupName: string = "Guest";
    readonly logs: LogMessage[] = [];
    public maxLogMessagesCount: number = 40;

    private client?: Client<APIDefinition>;
    private panelCh: Channel<void,PanelChannelPublishes> | null = null;

    private latencyChecker: LatencyChecker = new LatencyChecker();
    get lastLatency(): number {
        return this.latencyChecker.lastLatency;
    }
    requireLatencyUpdates(interval: number): () => void {
        return this.latencyChecker.requireLatencyUpdates(interval,5);
    }

    private disconnect() {
        if(this.panelCh != null) {
            this.panelCh.offPublish('init');
            this.panelCh.offPublish('update');
            this.panelCh.offPublish('log');
            this.panelCh.unsubscribe();
            this.panelCh = null;
        }
    }

    async connect(client: Client<APIDefinition>) {
        this.client = client;
        this.latencyChecker.client = client;
        const ch = client.channel('#panel') as Channel<void,PanelChannelPublishes>;
        if(this.panelCh !== ch) {
            this.disconnect();
            this.panelCh = ch;
            ch.onPublish('init',this._handleNewServer.bind(this));
            ch.onPublish('update',this._handleServerUpdate.bind(this));
            ch.onPublish('log',this._handleNewLogMessage.bind(this));
            await ch.subscribe();
        }
        await client.transmit('#panel',true);
        setTimeout(() => HeartbeatTicker.instance.start(client),3000);
    }

    private _handleNewServer(info: PanelChannelPublishes['init']) {
        if(typeof info !== 'object') return;

        const id = info.id;
        const exists = this.servers.hasOwnProperty(id);

        (info as ProcessedServerInformation).name = generateServerName(info.id,info.type);

        this.serversLastActivity[id] = Date.now();
        (this.servers as Record<string,ServerInformation>)[id] = info as ProcessedServerInformation;
        switch(info.type) {
            case ServerType.Worker:
                (this.workers as Record<string,WorkerInformation>)[id] = info as ProcessedWorkerInformation;
                if(!exists) (this as Writable<Connector>).workerCount++;
                this._updatePanelAuthUserMap(info.panelAuthUserMap);
                (this as Writable<Connector>).defaultUserGroupName = info.defaultUserName;
                break;
            case ServerType.Broker:
                (this.brokers as Record<string,BrokerInformation>)[id] = info as ProcessedBrokerInformation;
                if(!exists) (this as Writable<Connector>).brokerCount++;
                break;
            case ServerType.State: (this as Writable<Connector>).state = info as ProcessedStateInformation;
        }

        if(!exists) {
            this.emit('serverJoin',id);
            (this as Writable<Connector>).serverCount++;
        }

        this._updateClusterSummary();
        this.emit('statsUpdate');
    }

    private _updatePanelAuthUserMap(map: Record<string,string>) {
        if(typeof map !== 'object' || !map) return
        for(const group in map) {
            if(map.hasOwnProperty(group)) this.panelAuthUserMap[group] = map[group];
        }
    }

    private _handleServerUpdate(info: PanelChannelPublishes['update']) {
        if(typeof info !== 'object') return;
        const id = info.id;
        if(!this.servers.hasOwnProperty(id)) return;
        Object.assign(this.servers[id],info);
        this.serversLastActivity[id] = Date.now();

        this._updateClusterSummary();
        this.emit('statsUpdate');
    }

    private _handleNewLogMessage(message: PanelChannelPublishes['log']) {
        if(typeof message !== 'object') return;
        this.logs.push(message);
        this.logs.sort((a, b) => a.timestamp - b.timestamp);
        while(this.logs.length > this.maxLogMessagesCount && this.maxLogMessagesCount > -1)
            this.logs.shift();
        this.emit('logsUpdate');
    }

    private _setServerTimeoutChecker() {
        setInterval(() => {
            for(const id in this.servers) {
                if(!this.servers.hasOwnProperty(id)) continue;
                const info = this.servers[id];
                if((Date.now() - this.serversLastActivity[id]) > this.serverTimeout) {
                    delete (this.servers as Record<string,ServerInformation>)[id];
                    switch(info.type) {
                        case ServerType.Worker:
                            delete (this.workers as Record<string,WorkerInformation>)[id];
                            (this as Writable<Connector>).workerCount--;
                            break;
                        case ServerType.Broker:
                            delete (this.brokers as Record<string,BrokerInformation>)[id];
                            (this as Writable<Connector>).brokerCount--;
                            break;
                        case ServerType.State: (this as Writable<Connector>).state = undefined;
                    }
                    (this as Writable<Connector>).serverCount--;
                    delete this.serversLastActivity[id];
                    this.emit("serverLeave",id);
                }
            }
        },this.serverTimeout + 2000);
    }

    private _updateClusterSummary() {
        if(this.serverCount <= 0)
            return (this as Writable<Connector>).clusterSummary =
                {...Connector.DEFAULT_CLUSTER_SUMMARY};

        let launchedTimestamp = Date.now(),
            cpuUsageSum = 0,
            totalMemorySum = 0,
            usedMemorySum = 0,
            internalClientCountSum = 0,
            externalClientCountSum = 0,
            httpMessageCountSum = 0,
            wsMessageCountSum = 0,
            transmitMessageCountSum = 0,
            invokeMessageCountSum = 0,
            incomingHttpMessageCountSum = 0,
            incomingWsMessageCountSum = 0,
            incomingTransmitMessageCountSum = 0,
            incomingInvokeMessageCountSum = 0,
            atLeastOneDebug = false,
            defaultUserGroupCountSum = 0,
            panelUserCountSum = 0,
            authUserGroupsCountsSum: Record<string,number> = {}

        const checkedMachines: string[] = [];
        for(const id in this.servers) {
            if(!this.servers.hasOwnProperty(id)) continue;
            const server = this.servers[id];
            if(server.launchedTimestamp < launchedTimestamp)
                launchedTimestamp = server.launchedTimestamp;

            if(checkedMachines.indexOf(server.machineId) === -1) {
                checkedMachines.push(server.machineId);
                const serverResourceUsage = server.resourceUsage.machine;
                cpuUsageSum += serverResourceUsage.cpu;
                totalMemorySum += serverResourceUsage.memory.totalMemMb;
                usedMemorySum += serverResourceUsage.memory.usedMemMb;
            }

            httpMessageCountSum += server.httpMessageCount;
            wsMessageCountSum += server.wsMessageCount;
            transmitMessageCountSum += server.transmitMessageCount;
            invokeMessageCountSum += server.invokeMessageCount;

            if(server.type === ServerType.Worker) {
                incomingHttpMessageCountSum += server.httpMessageCount;
                incomingWsMessageCountSum += server.wsMessageCount;
                incomingTransmitMessageCountSum += server.transmitMessageCount;
                incomingInvokeMessageCountSum += server.invokeMessageCount;

                externalClientCountSum += server.clientCount;
                atLeastOneDebug = atLeastOneDebug || server.debug;
                defaultUserGroupCountSum += server.users.defaultUserGroupCount;
                panelUserCountSum += server.users.panelUserCount;
                const authUserGroupsCounts = server.users.authUserGroupsCounts;
                for(const group in authUserGroupsCounts) {
                    if(!authUserGroupsCounts.hasOwnProperty(group)) continue;
                    if(authUserGroupsCountsSum.hasOwnProperty(group))
                        authUserGroupsCountsSum[group] += authUserGroupsCounts[group];
                    else authUserGroupsCountsSum[group] = authUserGroupsCounts[group];
                }
            }
            else internalClientCountSum += server.clientCount;
        }

        const cpuUsage = cpuUsageSum / checkedMachines.length;
        const memoryUsage = usedMemorySum / totalMemorySum  * 100;
        const resourceUsage = (cpuUsage + memoryUsage) / 2;

        (this as Writable<Connector>).clusterSummary = {
            launchedTimestamp,
            cpuUsage,
            memory: {totalMemMb: totalMemorySum,usedMemMb: usedMemorySum},
            memoryUsage,
            resourceUsage,
            internalClientCount: internalClientCountSum,
            externalClientCount: externalClientCountSum,
            httpMessageCount: httpMessageCountSum,
            wsMessageCount: wsMessageCountSum,
            transmitMessageCount: transmitMessageCountSum,
            invokeMessageCount: invokeMessageCountSum,
            incomingHttpMessageCount: incomingHttpMessageCountSum,
            incomingWsMessageCount: incomingWsMessageCountSum,
            incomingInvokeMessageCount: incomingInvokeMessageCountSum,
            incomingTransmitMessageCount: incomingTransmitMessageCountSum,
            atLeastOneDebug,
            users: {
                defaultUserGroupCount: defaultUserGroupCountSum,
                panelUserCount: panelUserCountSum,
                authUserGroupsCounts: authUserGroupsCountsSum
            }
        };
    }
}