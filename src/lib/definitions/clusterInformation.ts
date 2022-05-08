import UsersInformation from "./usersInformation";

export default interface ClusterInformation {
    cpuUsage: number,
    memory: {totalMemMb: number, usedMemMb: number},
    memoryUsage: number,
    resourceUsage: number,
    launchedTimestamp: number,
    internalClientCount: number,
    externalClientCount: number,
    httpMessageCount: number,
    wsMessageCount: number,
    invokeMessageCount: number,
    transmitMessageCount: number,
    incomingHttpMessageCount: number,
    incomingWsMessageCount: number,
    incomingInvokeMessageCount: number,
    incomingTransmitMessageCount: number,
    atLeastOneDebug: boolean,
    users: UsersInformation
}