/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

export default interface ResourceUsageInformation {
    machine: {
        storage: {size: number, used: number, usedPercentage: number},
        memory: {totalMemMb: number, usedMemMb: number},
        cpu: number
    },
    process: {cpu: number, memory: number}
}