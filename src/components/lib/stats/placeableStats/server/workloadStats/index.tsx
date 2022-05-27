/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import useConnector from "../../../../../../lib/hooks/useConnector";
import RTPercentageBarCard from "../../../core/rtPercentageBarCard";
import RTMultiLineChartCard from "../../../core/rtMultiLineChartCard";
import server from "../../../../../views/dashboard/sides/server";

const WorkloadStats: React.FC<{
    serverId: string,
    interval?: number,
    simpleBar?: boolean,
    maxLength?: number,
}> = ({serverId,interval = 1000,maxLength = 10,simpleBar}) => {
    const connector = useConnector();

    const getResourceUsage = (): {cpuUsage: number, memoryUsage: number} => {
        const server = connector.servers[serverId];
        if(!server) return {
            memoryUsage: 0,
            cpuUsage: 0,
        };
        const cpuUsage = server.resourceUsage.machine.cpu;
        const memory = server.resourceUsage.machine.memory;
        const memoryUsage = memory.totalMemMb <= 0 ? 0 :
            (Math.round((memory.usedMemMb / memory.totalMemMb * 100) * 100) / 100);
        return {
            cpuUsage,
            memoryUsage
        };
    }

    const getTooltipInfo = () => {
        const server = connector.servers[serverId];
        if(!server) return "";
        return `CPU: ${server.cpuModel}`;
    }

    if(!simpleBar) return <RTMultiLineChartCard
        unit={"%"}
        dataLabel="used"
        description="Workload"
        maxLength={maxLength}
        labels={["CPU usage","Memory usage"]}
        valueTitle={value => Number(value).toFixed(1) + " %"}
        valueInfoTooltip={getTooltipInfo()}
        fetchValues={() => {
            const resourceUsages = getResourceUsage();
            return [resourceUsages.cpuUsage,resourceUsages.memoryUsage];
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
    else return <RTPercentageBarCard
        description={"Workload"}
        fetchPercent={() => {
            const resourceUsages = getResourceUsage();
            return (resourceUsages.cpuUsage + resourceUsages.memoryUsage) / 2;
        }}
        interval={interval}
    />
};

export default WorkloadStats;