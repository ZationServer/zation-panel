/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import useConnector from "../../../../../../lib/hooks/useConnector";
import RTPercentageBarCard from "../../../core/rtPercentageBarCard";
import RTMultiLineChartCard from "../../../core/rtMultiLineChartCard";

const CpuUsageStats: React.FC<{
    interval?: number,
    simpleBar?: boolean,
    maxLength?: number,
}> = ({interval = 1000,maxLength = 10,simpleBar}) => {
    const connector = useConnector();
    if(!simpleBar) return <RTMultiLineChartCard
        unit={"%"}
        dataLabel="used"
        description="CPU usage"
        maxLength={maxLength}
        labels={["Workers","Brokers","State"]}
        valueTitle={value => Number(value).toFixed(1) + " %"}
        fetchValues={() => [
            connector.workersSummary.cpuUsage,
            connector.brokersSummary.cpuUsage,
            connector.state?.resourceUsage.machine.cpu ?? 0
        ]}
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
    else return <RTPercentageBarCard
        description={"CPU usage"}
        fetchPercent={() => connector.clusterSummary.cpuUsage}
        interval={interval}
    />
};

export default CpuUsageStats;