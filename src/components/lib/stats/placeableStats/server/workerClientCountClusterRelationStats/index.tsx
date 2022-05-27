/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import useConnector from "../../../../../../lib/hooks/useConnector";
import RTLineChartCard from "../../../core/rtLineChartCard";

const WorkerClientCountClusterRelationStats: React.FC<{
    serverId: string,
    interval?: number,
    maxLength?: number,
    mini?: boolean
}> = ({serverId, interval = 1000, maxLength = 10, mini}) => {
    const connector = useConnector();
    return <RTLineChartCard
        dataLabel={"clients of the cluster"}
        description={"clients of the cluster"}
        unit={"%"}
        maxLength={maxLength}
        fetchValue={() => {
            const server = connector.servers[serverId];
            const serverClients = !server ? 0 : server.clientCount;
            const totalClients = connector.workersSummary.clientCount;
            return totalClients <= 0 ? 0 :
                (Math.round(((serverClients / totalClients) * 100) * 100) / 100);
        }}
        interval={interval}
        grace={10}
        mini={mini}
    />
};

export default WorkerClientCountClusterRelationStats;