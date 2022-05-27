/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, {useEffect} from "react";
import useConnector from "../../../../lib/hooks/useConnector";
import {Alert, Grid} from "@mui/material";
import {useForceUpdate} from "../../../../lib/hooks/useForceReload";

const NotFullyLicensedAlert: React.FC<{
    interval?: number,
}> = ({interval = 1000}) => {

    const forceUpdate = useForceUpdate();
    const connector = useConnector();
    useEffect(() => {
        const intervalTicker = setInterval(() => forceUpdate(), interval);
        return () => clearInterval(intervalTicker);
    }, [interval]);

    if (!connector.clusterSummary.atLeastOneWithoutLicense) return null;
    return (<Grid item xs={12}>
        <Alert severity="warning">Not all workers in the cluster do have a license. Notice that this cluster can only be
            used for testing!</Alert>
    </Grid>)
};

export default NotFullyLicensedAlert;