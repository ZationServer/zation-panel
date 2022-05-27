/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from 'react';
import {Grid} from "@mui/material";
import ClientsCountStats from "../../../../lib/stats/placeableStats/cluster/externalClientsCountStats";
import UserGroupsStats from "../../../../lib/stats/placeableStats/cluster/userGroupsStats";
import ExternalClientDistributionStats from "../../../../lib/stats/placeableStats/cluster/externalClientDistributionStats";

const Clients: React.FC = () => {

    return (
        <div className="container-fluid">
            <div className="animated fadeIn">
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={{ xs: 3, sm: 3, md: 3 }}>
                    <Grid item xs={12}>
                        <ClientsCountStats/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <UserGroupsStats/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <ExternalClientDistributionStats/>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
};

export default React.memo(Clients);
