/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {load}        from "zation-client";
const EventEmitter = require('events');

const workerCheckTime = 7000;
const workerTimeout = 5000;

export default class DataEngine {

    constructor() {
        /*
        Structure
        instanceId ->
            workers ->
                workerFullId ->
                    id
                    workerStartedTimestamp
                    clientCount
                    user ->
                        defaultUserGroupCount
                        authUserGroups ->
                            userGroup
                    httpRequests
                    wsRequests
                    cpu
                    memory
            brokerCount
            brokers ->
                id ->
                    pid
                    system ->
                        cpu
                        memory
                brokerStartedTimestamp
            master ->
                isLeader
                pid
                clusterMode
            hostname
            port
            path
            postKey
            secure
            appName
            debug
            useScUws
            serverStartedTimestamp
            ip
            cpuModel
            cpuCount
            platform
            oos
            drive ->
                totalGb
                usedGb
                usedPercentage
            memory ->
                totalMemMb
                usedMemMb
            net ->
                inputMb
                outputMb
            cpu
         */
        this.storage = {};
        /*
        cpu
        memory ->
            totalMemMb
            usedMemMb
        drive ->
            totalGb
            usedGb
        net ->
            inputMb
            outputMb
        brokerCount
        serverStartedTimestamp
        clientCount
        httpRequests
        wsRequests
        debug
        useScUws
        user ->
            defaultUserGroupCount
            authUserGroups ->
                userGroup
         */
        this.clusterInfoStorage = {};
        /*
        userGroupName
         */
        this.panelAuthUserMap = {};
        this.defaultUserName = '';

        this.clusterBrokerList = [];

        this.workerCount = 0;
        this.instanceCount = 0;

        this.emitter = new EventEmitter();
        this.setWorkerTimeoutChecker();
    }

    connect(key = 'default')
    {
        const client = load(key);
        client.channelReact().onPubPanelOutCh('firstPong' ,(data => {
            this.firstPong(data.id,data.info);
        }));
        client.channelReact().onPubPanelOutCh('update-mainUpdate',(data => {
            this.update('update-mainUpdate',data.id,data.info);
        }));
        client.channelReact().onPubPanelOutCh('update-workerStatus',(data => {
            this.update('update-workerStatus',data.id,data.info);
        }));
        client.channelReact().onPubPanelOutCh('update-node',(data => {
            this.update('update-node',data.id,data.info);
        }));
    }

    processClusterInfo()
    {
        let startedTime = Date.now(),
            cpuFullUsage = 0,
            totalMemory = 0,
            usedMemory = 0,
            usedDrive = 0,
            totalDrive = 0,
            netInput = 0,
            netOutput = 0,
            brokerCount = 0,
            clientCount = 0,
            httpRequests = 0,
            wsRequests = 0,
            debug = false,
            useScUws = true,
            defaultUserGroupCount = 0,
            authUserGroup = {};

        for(let instanceId in this.storage) {
            if(this.storage.hasOwnProperty(instanceId)) {
                const instance = this.storage[instanceId];

                if(instance.serverStartedTimestamp < startedTime) {
                    startedTime = instance.serverStartedTimestamp;
                }
                if(instance.cpu) {
                    cpuFullUsage+=instance.cpu;
                }
                if(instance.memory) {
                    totalMemory+=instance.memory['totalMemMb'];
                    usedMemory+=instance.memory['usedMemMb'];
                }
                if(instance.drive) {
                    totalDrive+=instance.drive['totalGb'];
                    usedDrive+=instance.drive['usedGb'];
                }
                if(instance.net) {
                    netInput+=instance.net['inputMb'];
                    netOutput+=instance.net['outputMb'];
                }
                brokerCount+=instance.brokerCount;

                if(instance.debug) {
                    debug = true;
                }

                if(!instance.useScUws){
                    useScUws = false;
                }

                for(let workerFullId in instance.workers) {
                    if(instance.workers.hasOwnProperty(workerFullId))
                    {
                        const worker = instance.workers[workerFullId];
                        clientCount+=worker.clientCount;
                        httpRequests+=worker.httpRequests;
                        wsRequests+=worker.wsRequests;
                        defaultUserGroupCount+=worker.user['defaultUserGroupCount'];
                        this._processAuthUserGroup(authUserGroup,worker.user['authUserGroups']);
                    }
                }
            }
        }

        this.clusterInfoStorage = {
            cpu : (cpuFullUsage / this.instanceCount),
            memory : {
                totalMemMb : totalMemory,
                usedMemMb : usedMemory
            },
            drive : {
                totalGb : totalDrive,
                usedGb : usedDrive
            },
            net : {
                inputMb : netInput,
                outputMb : netOutput
            },
            brokerCount : brokerCount,
            serverStartedTimestamp : startedTime,
            clientCount : clientCount,
            httpRequests : httpRequests,
            wsRequests : wsRequests,
            debug : debug,
            useScUws : useScUws,
            user : {
                defaultUserGroupCount : defaultUserGroupCount,
                authUserGroups : authUserGroup
            }
        };

        this.emitter.emit('clusterUpdate');
    }

    // noinspection JSMethodCanBeStatic
    _processAuthUserGroup(authUserMain,authUserGroup)
    {
        for(let group in authUserGroup) {
            if(authUserGroup.hasOwnProperty(group)) {
                if(!authUserMain.hasOwnProperty(group)){
                    authUserMain[group] = authUserGroup[group];
                }
                else {
                    authUserMain[group]+=authUserGroup[group];
                }
            }
        }
    }

    static getEngine() {
        if (!DataEngine.instance) {
            DataEngine.instance = new DataEngine();
        }
        return DataEngine.instance;
    }

    static reset(){
        DataEngine.instance = new DataEngine();
    }

    update(event,id,info)
    {
        const instanceId = id['instanceId'];
        const workerFullId = id['workerFullId'];

        if(this._checkWorkerExists(instanceId,workerFullId))
        {
            const idTarget = this._getIdTarget(instanceId,workerFullId);
            if(event === 'update-mainUpdate') {
                this._updateSystemInfo(idTarget.instance,idTarget.worker,info['systemInfo']);
                idTarget.worker.clientCount = info["clientCount"];
                idTarget.worker.user = info['user'];
                this.emitter.emit('mainUpdate',instanceId,workerFullId,idTarget);
            }
            else if(event === 'update-workerStatus') {
                idTarget.worker.httpRequests = info['httpRequests'];
                idTarget.worker.wsRequests = info['wsRequests'];
                this.emitter.emit('statusUpdate',instanceId,workerFullId,idTarget);
            }
            else if(event === 'update-node') {
                idTarget.instance.brokers = info['brokers'];
                idTarget.instance.master = info['master'];
                this.clusterBrokerList = info['cBrokers'];
                this.emitter.emit('nodeUpdate',instanceId,workerFullId,idTarget);
            }
            this.refreshWorkerPing(idTarget.worker);
        }
    }

    _checkWorkerExists(instanceId,workerFullId) {
        let res = false;
        if(this.storage.hasOwnProperty(instanceId) &&
            this.storage[instanceId].workers.hasOwnProperty(workerFullId)) {
            res = true;
        }
        return res;
    }

    _getIdTarget(instanceId,workerFullId) {
        return {
            instance : this.storage[instanceId],
            worker : this.storage[instanceId].workers[workerFullId]
        }
    }

    _updatePanelAuthUserMap(map)
    {
        if(typeof map === 'object'){
            for(let k in map) {
                if(map.hasOwnProperty(k) && !this.panelAuthUserMap.hasOwnProperty(k)){
                    this.panelAuthUserMap[k] = map[k];
                }
            }
        }
    }

    _updatePanelDefaultName(name) {
        if(!this.defaultUserName) {
            this.defaultUserName = name;
        }
    }

    firstPong(id,info) {
        const instanceId = id['instanceId'];
        if(!this.storage.hasOwnProperty(instanceId)) {
            let instance = {};
            instance.brokerCount   = info['brokerCount'];
            instance.hostname      = info['hostname'];
            instance.port          = info['port'];
            instance.path          = info['path'];
            instance.postKey       = info['postKey'];
            instance.secure        = info['secure'];
            instance.appName       = info['appName'];
            instance.debug         = info['debug'];
            instance.useScUws      = info['useScUws'];
            instance.serverStartedTimestamp = info['serverStartedTimestamp'];
            instance.ip            = info['ip'];
            this._updatePanelAuthUserMap(info['panelAuthUserMap']);
            this._updatePanelDefaultName(info['defaultUserName']);
            const generalSystemInfo = info['generalSystemInfo'];
            instance.cpuModel = generalSystemInfo['cpuModel'];
            instance.cpuCount = generalSystemInfo['cpuCount'];
            instance.platform = generalSystemInfo['platform'];
            instance.oos      = generalSystemInfo['oos'];
            instance.workers = {};
            this.storage[instanceId] = instance;
            this.instanceCount++;
            this.emitter.emit('newInstance',instanceId);
            this._createWorker(instance,id,info);
        }
        else {
            this._createWorker(this.storage[instanceId],id,info);
        }

        if(id['workerId'] === 0){
            this.clusterBrokerList = info['cBrokers'];
            this.storage[instanceId].brokers = info['brokers'];
            this.storage[instanceId].master = info['master'];
        }
    }

    // noinspection JSMethodCanBeStatic
    _updateSystemInfo(instance,worker,info)
    {
        const instanceInfo = info['instance'];
        instance.drive = instanceInfo['drive'];
        instance.memory = instanceInfo['memory'];
        instance.net = instanceInfo['net'];
        instance.cpu = instanceInfo['cpu'];
        const pidInfo = info['pid'];
        worker.cpu = pidInfo['cpu'];
        worker.memory = pidInfo['memory'];
    }


    // noinspection JSMethodCanBeStatic
    refreshWorkerPing(worker) {
        worker.timeout = Date().now;
    }

    setTaskProcessClusterInfo() {
        setInterval(() => {
            this.processClusterInfo();
        },1000)
    }

    // noinspection JSMethodCanBeStatic
    _createWorker(instance,id,info)
    {
        const workers = instance.workers;
        if(!workers.hasOwnProperty(id['workerFullId'])) {
            let worker = {};
            worker.id = id['workerId'];
            worker.workerStartedTimestamp = info['workerStartedTimestamp'];
            worker.clientCount = info['clientCount'];
            this._updateSystemInfo(instance,worker,info['systemInfo']);
            worker.user = info['user'];
            worker.httpRequests = info['httpRequests'];
            worker.wsRequests = info['wsRequests'];
            workers[id['workerFullId']] = worker;
            this.workerCount++;
            this.emitter.emit('newWorker',id['workerFullId']);
            this.refreshWorkerPing(worker);
        }
    }

    setWorkerTimeoutChecker()
    {
        setInterval(() => {
            for (let instanceId in this.storage) {
                if (this.storage.hasOwnProperty(instanceId)) {
                    const workers = this.storage[instanceId].workers;
                    for (let workerId in workers) {
                        if (workers.hasOwnProperty(workerId) && ((Date.now() - workers[workerId].timeout) > workerTimeout)) {
                            delete workers[workerId];
                            this.workerCount--;
                            this.emitter.emit('workerLeft', workerId);
                        }
                    }
                    this._checkInstanceIsDown(this.storage[instanceId],instanceId);
                }
            }
        },workerCheckTime);
    }

    _checkInstanceIsDown(instance,id)
    {
        const workers = instance.workers;
        let count = 0;
        for(let k in workers) {
            if(workers.hasOwnProperty(k)){
                count++;
            }
        }
        if(count === 0) {
            delete this.storage[id];
            this.instanceCount--;
            this.emitter.emit('instanceLeft',id);
        }
    }
}

