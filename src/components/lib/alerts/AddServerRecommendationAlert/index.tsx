/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, {useEffect, useRef} from "react";
import useConnector from "../../../../lib/hooks/useConnector";
import {Alert, Grid} from "@mui/material";
import {useForceUpdate} from "../../../../lib/hooks/useForceReload";

const AddServerRecommendationAlert: React.FC<{
    interval?: number,
    type: 'broker' | 'worker',
    workloadMark?: number,
    workloadTime?: number

}> = ({
          interval = 1000,
          type,
          workloadMark = 90,
          workloadTime = 4000
      }) => {

    const forceUpdate = useForceUpdate();
    const connector = useConnector();
    const passedTimestampRef = useRef<number | null>(null);
    useEffect(() => {
        const intervalTicker = setInterval(() => forceUpdate(), interval);
        return () => clearInterval(intervalTicker);
    }, [interval,forceUpdate]);

    let renderWarning = false;
    let workload: number = 0;
    if (type === 'worker') workload = connector.workersSummary.workload;
    else if (type === 'broker') workload = connector.brokersSummary.workload;

    if (workload > workloadMark) {
        if (passedTimestampRef.current == null)
            passedTimestampRef.current = Date.now();
        const passedTimestamp = passedTimestampRef.current;
        if ((Date.now() - passedTimestamp) >= workloadTime)
            renderWarning = true;
    } else passedTimestampRef.current = null;

    if (!renderWarning) return null;
    return (<Grid item xs={12}>
        <Alert severity="warning">{`High ${type} workload. Please consider adding more ${type}s on other machines to distribute the workload.`}</Alert>
    </Grid>)
};

export default AddServerRecommendationAlert;