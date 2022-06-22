/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {CustomAPIDefinition} from "zation-client";
import {DynamicServerInformation, ServerInformation} from "./serverInformation";
import LogMessage from "./logMessage";

export interface PanelChannelPublishes {
    init: ServerInformation,
    update: DynamicServerInformation,
    log: LogMessage
}

export type APIDefinition = CustomAPIDefinition<{
    controllers: {
        "#panel/auth": [{username: any,password: any},void]
    }
    receivers: {
        '#panel': boolean | undefined
    },
    channels: {
        '#panel': {
            publishes: PanelChannelPublishes,
            member: void
        }
    }
}>;