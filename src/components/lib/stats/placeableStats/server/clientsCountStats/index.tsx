/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import useConnector from "../../../../../../lib/hooks/useConnector";
import RTLineChartCard from "../../../core/rtLineChartCard";

const ClientsCountStats: React.FC<{
    serverId: string,
    interval?: number,
    maxLength?: number,
    mini?: boolean
}> = ({serverId,interval = 1000,maxLength = 10,mini}) => {
    const processLabel = (value: number) => (value > 1 || value === 0) ? "clients connected" : "client connected";
    const connector = useConnector();
    return <RTLineChartCard
        dataLabel={processLabel}
        description={processLabel}
        maxLength={maxLength}
        fetchValue={() => {
            const server = connector.servers[serverId];
            return !server ? 0 : server.clientCount;
        }}
        interval={interval}
        grace={10}
        mini={mini}
    />
};

export default ClientsCountStats;