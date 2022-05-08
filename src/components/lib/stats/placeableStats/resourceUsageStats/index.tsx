import React from "react";
import useConnector from "../../../../../lib/hooks/useConnector";
import RTPercentageBarCard from "../../core/rtPercentageBarCard";
import RTLineChartCard from "../../core/rtLineChartCard";

const ResourceUsageStats: React.FC<{
    interval?: number,
    bar?: boolean,
    mini?: boolean,
    maxLength?: number,
}> = ({interval = 1000,maxLength = 10,bar,mini}) => {
    const connector = useConnector();
    if(!bar) return <RTLineChartCard
        unit={"%"}
        valueTitle={v => v + ' %'}
        dataLabel="used"
        description="Resource usage"
        maxLength={maxLength}
        fetchValue={() => connector.clusterSummary.resourceUsage}
        interval={interval}
        grace={0}
        mini={mini}
        suggestedMax={100}
    />
    else return <RTPercentageBarCard
        description={"Resource usage"}
        fetchPercent={() => connector.clusterSummary.resourceUsage}
        interval={interval}
    />
};

export default ResourceUsageStats;