/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from 'react';
import {Grid, Tooltip} from "@mui/material";
import {ReactComponent as Certificate} from '../.././../../../../../assets/image/certificate.svg'
import {ReactComponent as Protected} from '../../../../../../../assets/image/protected.svg'
import {ReactComponent as Debug} from '../../../../../../../assets/image/debug.svg'
import {WorkerInformation} from "../../../../../../../lib/definitions/serverInformation";

const SymbolInfoBar: React.FC<{
    server: WorkerInformation,
    brightDeactivatedSymbols?: boolean,
    className?: string
}> = ({
          server,
          brightDeactivatedSymbols,
          className
      }) => {
    const deactivatedColor = brightDeactivatedSymbols ? "rgba(76,78,80,0.85)" : "rgba(6,8,10,0.45)";
    return (<Grid container className={className} spacing={1.2}>
        <Grid item>
            <Tooltip title={server.license != null ? "The server does have a valid license." :
                "The server does not have a license."}>
                <Certificate style={{fill: server.license != null ? "#4AFFA8" : deactivatedColor}}/>
            </Tooltip>
        </Grid>
        <Grid item>
            <Tooltip title={`TLS is ${server.tls ? "activated" : "deactivated"}.`}>
                <Protected style={{fill: server.tls ? "#4AFFA8" : deactivatedColor}}/>
            </Tooltip>
        </Grid>
        {server.debug ? <Grid item>
            <Tooltip title={"The server is running in debug mode."}>
                <Debug/>
            </Tooltip>
        </Grid> : null}
    </Grid>);
};

export default SymbolInfoBar;
