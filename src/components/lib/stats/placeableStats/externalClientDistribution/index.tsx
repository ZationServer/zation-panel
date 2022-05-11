/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import useConnector from "../../../../../lib/hooks/useConnector";
import RTPercentageBarCard from "../../core/rtPercentageBarCard";
import RTLineChartCard from "../../core/rtLineChartCard";

const ExternalClientDistributionStats: React.FC<{
    interval?: number,
    bar?: boolean,
    mini?: boolean,
    maxLength?: number,
}> = ({interval = 1000,maxLength = 10,bar,mini}) => {
    const connector = useConnector();
    if(!bar) return <RTLineChartCard
        description="Clients distribution"
        maxLength={maxLength}
        fetchValue={() => connector.workersSummary.clientDistribution}
        interval={interval}
        grace={0}
        mini={mini}
        valueInfoTooltip={"Standard deviation of clients across workers"}
    />
    else return <RTPercentageBarCard
        description={"Clients distribution"}
        fetchPercent={() => connector.workersSummary.clientDistribution}
        interval={interval}
    />
};

export default ExternalClientDistributionStats;