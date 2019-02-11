/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {load}        from "zation-client";
const EventEmitter = require('events');

const workerTimeout = 7000;

export default class DataEngine {

    constructor() {
        /*
        Structure
        instanceId ->
            workers ->
                workerFullId ->
                    workerStartedTimestamp
                    clientCount
                    user ->
                        defaultUserGroupCount
                        authUserGroups ->
                            userGroup
                    avgHttpRequests
                    avgWsRequests
                    cpu
                    memory
            brokerCount
            hostname
            port
            path
            postKey
            secure
            appName
            environment
            debug
            useScUws
            serverStartedTimestamp
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
        avgHttpRequests
        avgWsRequests
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

        this.processClusterStorage = false;
        this.workerCount = 0;
        this.instanceCount = 0;

        this.emitter = new EventEmitter();
    }

    connect(key = 'default')
    {
        const client = load(key);
        client.channelReact().onPubPanelOutCh('firstPong' ,(data => {
            this.firstPong(data.id,data.info);
        }));
        client.channelReact().onPubPanelOutCh('ping',(data => {
            this.workerPing(data.id);
        }));
        client.channelReact().onPubPanelOutCh('update-mainUpdate',(data => {
            this.update('update-mainUpdate',data.id,data.info);
        }));
        client.channelReact().onPubPanelOutCh('update-workerStatus',(data => {
            this.update('update-workerStatus',data.id,data.info);
        }));
    }

    _processClusterInfo()
    {
        if(this.processClusterStorage) {
            this.processClusterInfo();
        }
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
            avgHttpRequests = 0,
            avgWsRequests = 0,
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
                        avgHttpRequests+=worker.avgHttpRequests;
                        avgWsRequests+=worker.avgWsRequests;
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
            avgHttpRequests : avgHttpRequests,
            avgWsRequests : avgWsRequests,
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
                this._processClusterInfo();
                this.emitter.emit('mainUpdate',instanceId,workerFullId,idTarget);
            }
            else if(event === 'update-workerStatus') {
                idTarget.worker.avgHttpRequests = info['avgHttpRequests'];
                idTarget.worker.avgWsRequests = info['avgWsRequests'];
                this._processClusterInfo();
                this.emitter.emit('statusUpdate',instanceId,workerFullId,idTarget);
            }
            this.refreshWorkerPing(instanceId,workerFullId);
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
            instance.environment   = info['environment'];
            instance.debug         = info['debug'];
            instance.useScUws      = info['useScUws'];
            instance.serverStartedTimestamp = info['serverStartedTimestamp'];
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


    refreshWorkerPing(instanceId,workerFullId)
    {
        if(this.storage.hasOwnProperty(instanceId) &&
            this.storage[instanceId].workers.hasOwnProperty(workerFullId)) {
            const worker = this.storage[instanceId].workers[workerFullId];
            clearTimeout(worker.timeout);
            this._setWorkerTimeout(this.storage[instanceId].workers,workerFullId,instanceId);
        }
    }

    workerPing(id) {
        this.refreshWorkerPing(id['instanceId'],id['workerFullId']);
        this.emitter.emit('workerPing',id['instanceId'],id['workerFullId']);
    }

    activateProcessClusterInfo() {
        this.processClusterStorage = true;
    }

    // noinspection JSMethodCanBeStatic
    _createWorker(instance,id,info)
    {
        const workers = instance.workers;
        if(!workers.hasOwnProperty(id['workerFullId'])) {
            let worker = {};
            worker.workerStartedTimestamp = info['workerStartedTimestamp'];
            worker.clientCount = info['clientCount'];
            this._updateSystemInfo(instance,worker,info['systemInfo']);
            worker.user = info['user'];
            worker.avgHttpRequests = info['avgHttpRequests'];
            worker.avgWsRequests = info['avgWsRequests'];
            workers[id['workerFullId']] = worker;
            this.workerCount++;
            this.emitter.emit('newWorker',id['workerFullId']);
            this._setWorkerTimeout(workers,id['workerFullId'],id['instanceId']);
            this._processClusterInfo();
        }
    }

    _setWorkerTimeout(workers,workerFullId,instanceId)
    {
        workers[workerFullId].timeout = setTimeout(() => {
            delete workers[workerFullId];
            this.workerCount--;
            this.emitter.emit('workerLeft',workerFullId);
            this._checkInstanceIsDown(instanceId);
        },workerTimeout);
    }

    _checkInstanceIsDown(instanceId)
    {
        if(this.storage.hasOwnProperty(instanceId)){
            const workers = this.storage[instanceId].workers;
            let count = 0;
            for(let k in workers) {
                if(workers.hasOwnProperty(k)){
                    count++;
                }
            }
            if(count === 0) {
                delete this.storage[instanceId];
                this.instanceCount--;
                this.emitter.emit('instanceLeft',instanceId);
            }
        }
    }
}

