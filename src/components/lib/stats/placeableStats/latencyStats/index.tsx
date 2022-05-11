/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, { useEffect } from "react";
import useConnector from "../../../../../lib/hooks/useConnector";
import RTLineChartCard from "../../core/rtLineChartCard";

const LatencyStats: React.FC<{
    interval?: number,
    maxLength?: number,
    mini?: boolean
}> = ({interval = 1000,maxLength = 10,mini}) => {
    const connector = useConnector();
    useEffect(() => {
        return connector.requireLatencyUpdates(interval);
    },[connector,interval]);
    return <RTLineChartCard
        unit={"ms"}
        description="Latency"
        maxLength={maxLength}
        fetchValue={() => connector.lastLatency}
        interval={interval}
        grace={10}
        mini={mini}
        suggestedMax={10}
        valueInfoTooltip={"Only to the currently connected worker"}
    />
};

export default LatencyStats;