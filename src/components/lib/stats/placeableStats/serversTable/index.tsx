/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import {
    WorkerInformation,
} from "../../../../../lib/definitions/serverInformation";
import useConnector from "../../../../../lib/hooks/useConnector";
import {formatServerType} from "../../../../../lib/utils/serverType";
import RTTableCard from "../../core/rtTableCard";
import AgeColumn from "./tableColumns/ageColumn";
import ProgressColumn from "./tableColumns/progressColumn";
import {useNavigate} from "react-router-dom";

const ServersTable: React.FC<{
    interval?: number;
}> = ({interval = 1000}) => {
    const connector = useConnector();
    const navigate = useNavigate();

    const fetchTableData = () => Object.values(connector.servers).map(server => {
        const machine = server.resourceUsage.machine;
        const memoryUsage = machine.memory.usedMemMb / machine.memory.totalMemMb * 100;
        return {
            id: server.id,
            name: server.name,
            type: server.type,
            leader: (server as WorkerInformation).leader,
            launchedTimestamp: server.launchedTimestamp,
            clientCount: server.clientCount,
            requestCount: server.wsMessageCount + server.httpMessageCount,
            resourceUsage: (machine.cpu + memoryUsage) / 2
        };
    });

    return (
        <RTTableCard
            title="Servers"
            fetchData={fetchTableData}
            actions={[]}
            interval={interval}
            onRowClick={(e, row) => {
                if (!row) return;
                navigate("/servers/" + row.id, {});
                e?.stopPropagation();
                e?.preventDefault();
            }}
            columns={[
                {
                    title: "Name",
                    field: "name",
                    render: row =>
                        `${row.name}` +
                        (row.leader ? " 👑" : ""),
                },
                {
                    title: "Type",
                    field: "type",
                    render: row => formatServerType(row.type),
                },
                {
                    title: "Client/s",
                    field: "clientCount",
                },
                {
                    title: "Request/s",
                    field: "requestCount",
                },
                {
                    title: "Resource Usage",
                    field: "resourceUsageSummary",
                    render: row => (
                        <ProgressColumn
                            percent={row.resourceUsage}
                        />
                    ),
                },
                {
                    title: "Age",
                    field: "launchedTimestamp",
                    render: row => (
                        <AgeColumn timestamp={row.launchedTimestamp}/>
                    ),
                },
            ]}
        />
    );
};

export default ServersTable;
