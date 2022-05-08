import React from 'react';
import {Grid} from "@mui/material";
import ExternalClientsCountStats from "../../../../lib/stats/placeableStats/externalClientsCountStats";
import OnlineWorkersCountStats from "../../../../lib/stats/placeableStats/onlineServersCountStats";
import MessageCountStats from "../../../../lib/stats/placeableStats/messageCountStats";
import NetworkStatus from "../../../../lib/stats/placeableStats/networkStatus";
import ResourceUsageStats from "../../../../lib/stats/placeableStats/resourceUsageStats";
import LatencyStats from "../../../../lib/stats/placeableStats/latencyStats";

const Home: React.FC = () => {

    return (
        <div className="container-fluid">
            <div className="animated fadeIn">
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={{ xs: 3, sm: 3, md: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <ExternalClientsCountStats mini/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <OnlineWorkersCountStats mini/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <ResourceUsageStats bar/>
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
