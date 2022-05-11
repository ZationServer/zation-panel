/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from 'react';
import {Grid} from "@mui/material";
import MemoryUsageStats from "../../../../lib/stats/placeableStats/memoryUsageStats";
import CpuUsageStats from "../../../../lib/stats/placeableStats/cpuUsageStats";

const Servers: React.FC = () => {

    return (
        <div className="container-fluid">
            <div className="animated fadeIn">
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} rowSpacing={{ xs: 3, sm: 3, md: 3 }}>
                    <Grid item xs={12} sm={6} md={6}>
                        <CpuUsageStats/>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <MemoryUsageStats/>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
};

export default React.memo(Servers);
