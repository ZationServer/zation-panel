export default interface ServersTypeGroupSummary {
    clientCount: number,
    clientDistribution: number,
    memory: {totalMemMb: number, usedMemMb: number},
    cpuUsage: number,
    memoryUsage: number,
    httpMessageCount: number,
    wsMessageCount: number,
    invokeMessageCount: number,
    transmitMessageCount: number
}