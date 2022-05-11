/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import useConnector from "../../../../../lib/hooks/useConnector";
import RTMultiLineChartCard from "../../core/rtMultiLineChartCard";

const MemoryUsageStats: React.FC<{
    interval?: number,
    maxLength?: number,
}> = ({interval = 1000,maxLength = 10}) => {
    const connector = useConnector();
    const processValueTitle = () => Number((connector.clusterSummary.memory.usedMemMb /
        connector.clusterSummary.memory.totalMemMb) * 100).toFixed(1) + ' %';
    return <RTMultiLineChartCard
        unit={"%"}
        valueTitle={processValueTitle}
        dataLabel="used"
        description="Memory usage"
        maxLength={maxLength}
        labels={["Workers","Brokers","State"]}
        fetchValues={() => {
            let stateMemoryUsage: string | number = 0;
            if(connector.state) {
                const memory = connector.state.resourceUsage.machine.memory;
                stateMemoryUsage = Number((memory.usedMemMb / memory.totalMemMb) * 100).toFixed(0);
            }
            return [
                connector.workersSummary.memoryUsage.toFixed(0),
                connector.brokersSummary.memoryUsage.toFixed(0),
                stateMemoryUsage
            ];
        }}
        valuesMerger={(values: number[]) => {
            const sum = values.reduce((a,b) => a + b,0);
            return sum / values.length;
        }}
        interval={interval}
        grace={0}
        lineBackgroundColors={['rgba(48, 153, 187,.3)','rgba(253, 202, 64,.3)',
            'rgba(43, 225, 98,.3)']}
        lineBorderColors={['rgba(48, 153, 187,.55)' ,'rgba(253, 202, 64,.55)',
            'rgba(43, 225, 98,.55)']}
        suggestedMax={100}
    />
};

export default MemoryUsageStats;