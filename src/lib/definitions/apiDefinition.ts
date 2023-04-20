/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {APIDefinition, ChannelDef, ControllerDef, ReceiverDef} from "zation-client";
import {DynamicServerInformation, ServerInformation} from "./serverInformation";
import LogMessage from "./logMessage";

export interface PanelChannelPublishes {
    init: ServerInformation,
    update: DynamicServerInformation,
    log: LogMessage
}

export type PanelAPIDefinition = APIDefinition<{
    '#panel/auth': ControllerDef<{username: any,password: any},void>,
    '#panel': ReceiverDef<boolean | undefined> & ChannelDef<PanelChannelPublishes,void>
}>;