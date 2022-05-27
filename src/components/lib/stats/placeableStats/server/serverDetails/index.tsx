/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, {useEffect} from 'react';
import {Grid, Typography, useMediaQuery, Tooltip, Divider} from "@mui/material";
import {ReactComponent as ServerBackground} from '../../../../../../assets/image/serverBackground.svg'
import {ReactComponent as Server} from '../../../../../../assets/image/server.svg'
import {ReactComponent as Crown} from '../../../../../../assets/image/crown.svg'
import {ReactComponent as Gears} from '../../../../../../assets/image/gears.svg'
import {ReactComponent as ZationLogo} from '../../../../../../assets/image/zationLogo.svg'
import classes from "./index.module.css";
import useConnector from "../../../../../../lib/hooks/useConnector";
import {WorkerInformation} from "../../../../../../lib/definitions/serverInformation";
import {formatServerType} from "../../../../../../lib/utils/serverType";
import {useForceUpdate} from "../../../../../../lib/hooks/useForceReload";
import TimeUtils from "../../../../../../lib/utils/time";
import {isIPv6} from "is-ip";
import IconInfoItem from "../../../../../utils/IconInfoItem";
import TagList from "../../../../../utils/TagList";

const ServerDetails: React.FC<{ id: string, interval: number }> = ({id, interval = 1000}) => {

    const forceUpdate = useForceUpdate();
    const connector = useConnector();
    const server = connector.servers[id];
    const mobileMode = useMediaQuery('(max-width:800px)');
    useEffect(() => {
        const intervalTicker = setInterval(() => forceUpdate(), interval);
        return () => clearInterval(intervalTicker);
    }, [interval]);

    const hostname = (server as WorkerInformation).hostname;
    const ip = server.ip;
    const tags = (server as WorkerInformation).tags ?? [];

    return (<Grid container>
        <Grid item xs={12}>
            <Grid container alignItems={"flex-start"} className={classes.rootContainer}>
                {!mobileMode ? <Grid item className={classes.serverGraphicsContainer}>
                    <ServerBackground className={classes.serverBackground}/>
                    <Server className={classes.server}/>
                    {(server as WorkerInformation).leader ?
                        <Tooltip title={"Leader"}>
                            <Crown className={classes.crown}/>
                        </Tooltip>
                        : null}
                </Grid> : <Grid item>
                    <Server className={classes.serverMobile}/>
                </Grid>}
                <Grid item className={classes.infoContainer}>
                    <Grid container direction="column" spacing={0.1}>
                        <Grid item xs={12}>
                            <Typography className={classes.serverTypeTypography}>
                                {formatServerType(server.type) + " server"}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.serverNameContainer}>
                            <Tooltip title={"Id: " + server.id}>
                                <Typography>
                                    {server.name}
                                </Typography>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                            <Tooltip title={hostname != null ? ip : ""}>
                                <Typography className={classes.detailInfoTypography}>
                                    {`${hostname ?? (isIPv6(ip) ? `[${ip}]` : ip)}` +
                                        `:${server.port}${server.path}${server.tls ? " (TLS)" : ""}`}
                                </Typography>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                            <Tooltip title={TimeUtils.formatDateTime(server.launchedTimestamp)}>
                                <Typography className={classes.detailInfoTypography}>
                                    Launched {TimeUtils.processAge(TimeUtils.processTimeSpan(server.launchedTimestamp))} ago
                                </Typography>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider className={classes.infoDivider}/>
                        </Grid>
                        <Grid item xs={12}>
                            <IconInfoItem
                                title={server.os}
                                subTitle={server.platform}
                                icon={<Gears className={classes.operatingSystemIcon}/>}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <IconInfoItem
                                title={server.serverVersion}
                                subTitle={"Zation"}
                                icon={<ZationLogo className={classes.zationIcon}/>}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Divider className={classes.rootDivider}/>
            </Grid>
            {
                tags.length > 0 && (<>
                    <Grid item xs={12}>
                        <TagList className={classes.tagsContainer} tags={tags}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider className={classes.rootDividerLight}/>
                    </Grid>
                </>)
            }
        </Grid>


    </Grid>)
};

export default ServerDetails;
