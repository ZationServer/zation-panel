/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, {useEffect, useState} from 'react';
import {Grid} from "@mui/material";
import useConnector from "../../../../../lib/hooks/useConnector";
import NotFound from "../notFound";
import {useParams} from "react-router-dom";
import classes from "./index.module.css";
import ServerDetails from "../../../../lib/stats/placeableStats/server/serverDetails";
import WorkloadStats from "../../../../lib/stats/placeableStats/server/workloadStats";
import StorageUsageStats from "../../../../lib/stats/placeableStats/server/storageUsageStats";
import ClientsCountStats from "../../../../lib/stats/placeableStats/server/clientsCountStats";
import MessagesCountStats from "../../../../lib/stats/placeableStats/server/messagesCountStats";
import {ServerType} from "../../../../../lib/definitions/serverInformation";
import WorkerClientCountClusterRelationStats
    from "../../../../lib/stats/placeableStats/server/workerClientCountClusterRelationStats";

const Server: React.FC = () => {

    const {id = ""} = useParams();
    const connector = useConnector();
    const [serverExists, setServerExists] = useState(!!connector.servers[id]);
    useEffect(() => {
        const changeListener = () => setServerExists(!!connector.servers[id]);
        connector.on("serverLeave", changeListener);
        connector.on("serverJoin", changeListener);
        return () => {
            connector.off("serverLeave", changeListener);
            connector.off("serverJoin", changeListener);
        };
    }, [connector, id]);

    if (!serverExists) return <NotFound/>;
    const worker = connector.servers[id]?.type === ServerType.Worker;
    return (
        <div className={`container-fluid ` + classes.rootContainer}>
            <div className={`animated fadeIn`}>
                <Grid container direction="column">
                    <Grid item xs={12}>
                        <ServerDetails id={id} interval={1000}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={4} className={classes.chartsContainer}>
                            <Grid item sm={12} md={6}>
                                <WorkloadStats serverId={id}/>
                            </Grid>
                            <Grid item sm={12} md={6}>
                                <StorageUsageStats serverId={id}/>
                            </Grid>
                            <Grid item xs={12}>
                                <MessagesCountStats serverId={id}/>
                            </Grid>
                            <Grid item xs={worker ? 6 : 12}>
                                <ClientsCountStats serverId={id}/>
                            </Grid>
                            {worker ? <Grid item xs={6}>
                                <WorkerClientCountClusterRelationStats serverId={id}/>
                            </Grid> : null}
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
};

export default Server;
