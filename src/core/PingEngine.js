/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {client}        from "zation-client";

export default class PingEngine {

    static startPing(intervalMs = 4000,key = 'default') {
        PingEngine.interval = setInterval(async () => {
            try {
                if(client.hasPanelAccess()) {
                    await client.transmit('#panel').send();
                }
            }
            catch (e) {}
        },intervalMs);
    }
}

