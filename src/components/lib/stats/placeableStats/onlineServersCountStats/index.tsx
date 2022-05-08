import React from "react";
import useConnector from "../../../../../lib/hooks/useConnector";
import RTLineChartCard from "../../core/rtLineChartCard";

const OnlineServersCountStats: React.FC<{
    interval?: number,
    maxLength?: number,
    mini?: boolean
}> = ({interval = 1000,maxLength = 10,mini}) => {
    const processLabel = (value: number) => (value > 1 || value === 0) ? "servers online" : "server online";
    const connector = useConnector();
    return <RTLineChartCard
        valueTitle={v => v +
            ` (${connector.workerCount}-${connector.brokerCount}-${connector.state != null ? 1 : 0})`}
        dataLabel={processLabel}
        description={processLabel}
        maxLength={maxLength}
        fetchValue={() => connector.serverCount}
        interval={interval}
        grace={10}
        mini={mini}
    />
};

export default OnlineServersCountStats;