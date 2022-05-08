export default interface ResourceUsageInformation {
    machine: {
        drive: {totalGb: number, usedGb: number, usedPercentage: number},
        memory: {totalMemMb: number, usedMemMb: number},
        cpu: number
    },
    process: {cpu: number, memory: number}
}