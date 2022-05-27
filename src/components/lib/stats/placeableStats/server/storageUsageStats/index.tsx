/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import useConnector from "../../../../../../lib/hooks/useConnector";
import RTPieChartCard from "../../../core/rtPieChartCard";

const StorageUsageStats: React.FC<{
    serverId: string,
    interval?: number,
    mini?: boolean,
}> = ({serverId,interval = 1000,mini}) => {
    const connector = useConnector();

    return <RTPieChartCard
        interval={interval}
        mini={mini}
        description={"Storage usage"}
        unit={"%"}
        valueTitle={(data) => data['Used'] + " % used"}
        fetchValues={() => {
            const server = connector.servers[serverId];
            if(!server) return {"Used": 0, "Free": 0}
            const storage = server.resourceUsage.machine.storage;
            return {
                "Used": storage.usedPercentage,
                "Free": 100 - storage.usedPercentage
            };
        }}
    />
};

export default StorageUsageStats;