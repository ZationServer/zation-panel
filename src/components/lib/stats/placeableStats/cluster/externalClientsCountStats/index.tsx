/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import useConnector from "../../../../../../lib/hooks/useConnector";
import RTLineChartCard from "../../../core/rtLineChartCard";

const ExternalClientsCountStats: React.FC<{
    interval?: number,
    maxLength?: number,
    mini?: boolean
}> = ({interval = 1000,maxLength = 10,mini}) => {
    const processLabel = (value: number) => (value > 1 || value === 0) ? "clients connected" : "client connected";
    const connector = useConnector();
    return <RTLineChartCard
        dataLabel={processLabel}
        description={processLabel}
        maxLength={maxLength}
        fetchValue={() => connector.workersSummary.clientCount}
        valueInfoTooltip={"Only external clients connected to the worker servers"}
        interval={interval}
        grace={10}
        mini={mini}
    />
};

export default ExternalClientsCountStats;