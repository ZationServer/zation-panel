/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {load}        from "zation-client";

export default class PingEngine {

    static startPing(intervalMs = 4000,key = 'default') {
        PingEngine.interval = setInterval(async () => {
            try {
                await load(key).pubPanelInCh('ping',{});
            }
            catch (e) {}
        },intervalMs);
    }
}

