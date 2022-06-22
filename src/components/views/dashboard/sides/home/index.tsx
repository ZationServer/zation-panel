/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from 'react';
import {Grid} from "@mui/material";
import ExternalClientsCountStats from "../../../../lib/stats/placeableStats/cluster/externalClientsCountStats";
import OnlineWorkersCountStats from "../../../../lib/stats/placeableStats/cluster/onlineServersCountStats";
import MessageCountStats from "../../../../lib/stats/placeableStats/cluster/messageCountStats";
import NetworkStatus from "../../../../lib/stats/placeableStats/cluster/networkStatus";
import WorkloadStats from "../../../../lib/stats/placeableStats/cluster/workloadStats";
import LatencyStats from "../../../../lib/stats/placeableStats/cluster/latencyStats";
import NotFullyLicensedAlert from "../../../../lib/alerts/NotFullyLicensedAlert";

const Home: React.FC = () => {

    return (
        <div className="container-fluid">
            <div className="animated fadeIn">
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={{ xs: 3, sm: 3, md: 3 }}>
                    <NotFullyLicensedAlert/>
                    <Grid item xs={12} sm={6} md={3}>
                        <ExternalClientsCountStats mini/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <OnlineWorkersCountStats mini/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <WorkloadStats bar/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <LatencyStats mini/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <MessageCountStats/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <NetworkStatus/>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
};

export default React.memo(Home);
