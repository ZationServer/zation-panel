/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import UsersInformation from "./usersInformation";

export default interface ClusterSummary {
    memory: {totalMemMb: number, usedMemMb: number},
    cpuUsage: number,
    memoryUsage: number,
    resourceUsage: number,
    launchedTimestamp: number,
    clientCount: number,
    httpMessageCount: number,
    wsMessageCount: number,
    invokeMessageCount: number,
    transmitMessageCount: number,
    atLeastOneDebug: boolean,
    users: UsersInformation
}