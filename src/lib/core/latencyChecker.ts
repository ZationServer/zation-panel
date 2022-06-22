/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Client} from "zation-client";
import {Writable} from "../utils/typeUtils";

export default class LatencyChecker {

    private _client?: Client;
    set client(client: Client) {
        this._client = client;
        this.updateCurrentLatency(10);
    }

    readonly lastLatency: number = -1;

    private async updateCurrentLatency(resolution: number) {
        (this as Writable<LatencyChecker>).lastLatency = await this.processLatency(resolution);
    }

    async processLatency(resolution: number = 30): Promise<number> {
        if(!this._client) return -1;
        let timeSum = 0;
        for(let i = 0; i < resolution; i++) timeSum += await this._client.ping()
        return Math.round((timeSum / resolution) * 100) / 100;
    }

    private _currentLatencyChain: {running: boolean} | null = null;
    private updateLatencyProcessingInterval(delay: number = 1000,resolution: number = 10): void {
        if(this._currentLatencyChain != null) this._currentLatencyChain.running = false;
        const chainControl = {running: true};
        const tick = () => {
            if(!chainControl.running) return;
            Promise.all([
                this.updateCurrentLatency(resolution),
                new Promise(res => setTimeout(res,delay))
            ]).then(() => tick());
        };
        this._currentLatencyChain = chainControl;
        tick();
    }
    private clearLatencyProcessingInterval(): void {
        if(this._currentLatencyChain != null) {
            this._currentLatencyChain.running = false;
            this._currentLatencyChain = null;
        }
    }

    private _updateLatencyIntervalBasedOnRequires() {
        if(this._updateRequires.size <= 0) return this.clearLatencyProcessingInterval();
        let newDelay = Number.MAX_SAFE_INTEGER;
        let newResolution = 1;
        for(const {delay,resolution} of this._updateRequires.values()) {
            if(delay < newDelay) newDelay = delay;
            if(resolution > newResolution) newResolution = resolution;
        }
        this.updateLatencyProcessingInterval(newDelay,newResolution);
    }

    private _updateRequires: Map<symbol,{delay: number,resolution: number}> = new Map();
    public requireLatencyUpdates(delay: number, resolution: number): () => void {
        const id = Symbol();
        this._updateRequires.set(id,{delay,resolution});
        this._updateLatencyIntervalBasedOnRequires();
        return () => {
            this._updateRequires.delete(id);
            this._updateLatencyIntervalBasedOnRequires();
        };
    }

}