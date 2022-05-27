/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import useConnector from "../../../../../../lib/hooks/useConnector";
import RTPercentageBarCard from "../../../core/rtPercentageBarCard";
import RTLineChartCard from "../../../core/rtLineChartCard";

const WorkloadStats: React.FC<{
    interval?: number,
    bar?: boolean,
    mini?: boolean,
    maxLength?: number,
}> = ({interval = 1000,maxLength = 10,bar,mini}) => {
    const connector = useConnector();
    if(!bar) return <RTLineChartCard
        unit={"%"}
        valueTitle={v => v + ' %'}
        description="Workload"
        maxLength={maxLength}
        fetchValue={() => connector.clusterSummary.workload}
        interval={interval}
        grace={0}
        mini={mini}
        suggestedMax={100}
    />
    else return <RTPercentageBarCard
        description={"Workload"}
        fetchPercent={() => connector.clusterSummary.workload}
        interval={interval}
    />
};

export default WorkloadStats;