/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from 'react';
import {Grid} from "@mui/material";
import MemoryUsageStats from "../../../../lib/stats/placeableStats/cluster/memoryUsageStats";
import CpuUsageStats from "../../../../lib/stats/placeableStats/cluster/cpuUsageStats";
import ServersTable from "../../../../lib/stats/placeableStats/cluster/serversTable";
import AddServerRecommendationAlert from "../../../../lib/alerts/AddServerRecommendationAlert";

const Servers: React.FC = () => {

    return (
        <div className="container-fluid">
            <div className="animated fadeIn">
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={{ xs: 3, sm: 3, md: 3 }}>
                    <AddServerRecommendationAlert type={'broker'} workloadMark={10}/>
                    <AddServerRecommendationAlert type={'worker'}/>
                    <Grid item xs={12} sm={6} md={6}>
                        <CpuUsageStats/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <MemoryUsageStats/>
                    </Grid>
                    <Grid item xs={12}>
                        <ServersTable/>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
};

export default React.memo(Servers);
