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
                const client = load(key);
                if(client.isAuthenticated()) {
                    await client.pubPanelInCh('ping',{});
                }
            }
            catch (e) {}
        },intervalMs);
    }
}

