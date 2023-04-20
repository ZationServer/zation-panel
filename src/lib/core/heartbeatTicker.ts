/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Client} from "zation-client";
import {PanelAPIDefinition} from "../definitions/apiDefinition";

export default class HeartbeatTicker {

    public static readonly instance: HeartbeatTicker = new HeartbeatTicker();
    private constructor() {}

    private interval: NodeJS.Timer | null = null;

    start(client: Client<PanelAPIDefinition>, intervalMs = 4000) {
        HeartbeatTicker.instance.stop();
        this.interval = setInterval(async () => {
            try {
                if(client.authToken?.panelAccess)
                    await client.transmit('#panel');
            }
            catch (_) {}
        },intervalMs);
    }

    stop() {
        if(this.interval == null) return;
        clearInterval(this.interval);
        this.interval = null;
    }
}

