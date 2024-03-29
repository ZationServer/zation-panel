/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, {useEffect} from 'react';
import {Divider, Grid, Tooltip, Typography, useMediaQuery} from "@mui/material";
import {ReactComponent as ServerBackground} from '../../../../../../assets/image/serverBackground.svg'
import {ReactComponent as Server} from '../../../../../../assets/image/server.svg'
import {ReactComponent as Crown} from '../../../../../../assets/image/crown.svg'
import {ReactComponent as Gears} from '../../../../../../assets/image/gears.svg'
import {ReactComponent as Warning} from '../../../../../../assets/image/warning.svg'
import {ReactComponent as ZationLogo} from '../../../../../../assets/image/zationLogo.svg'
import classes from "./index.module.css";
import useConnector from "../../../../../../lib/hooks/useConnector";
import {ServerType, WorkerInformation} from "../../../../../../lib/definitions/serverInformation";
import {formatServerType} from "../../../../../../lib/utils/serverType";
import {useForceUpdate} from "../../../../../../lib/hooks/useForceReload";
import TimeUtils from "../../../../../../lib/utils/time";
import {isIPv6} from "is-ip";
import IconInfoItem from "../../../../../utils/IconInfoItem";
import TagList from "../../../../../utils/TagList";
import {capitalizeFirstLetter} from "../../../../../../lib/utils/string";
import SymbolInfoBar from "./subComponents/SymbolInfoBar";

const ServerDetails: React.FC<{ id: string, interval: number }> = ({id, interval = 1000}) => {

    const forceUpdate = useForceUpdate();
    const connector = useConnector();
    const server = connector.servers[id];
    const mobileMode = useMediaQuery('(max-width:800px)');
    useEffect(() => {
        const intervalTicker = setInterval(() => forceUpdate(), interval);
        return () => clearInterval(intervalTicker);
    }, [interval,forceUpdate]);

    const hostname = (server as WorkerInformation).hostname;
    const ip = server.ip;
    const tags = (server as WorkerInformation).tags ?? [];

    function getServerWarningReasons(): string[] {
        const reasons = [];
        if (server.type === ServerType.Worker) {
            if ((server as WorkerInformation).license == null)
                reasons.push("The server does not have a license.");
            if (server.debug)
                reasons.push("The server debug mode is activated.");
        }
        const usage = server.resourceUsage;
        if (usage.machine.cpu >= 90)
            reasons.push("High CPU usage.");
        if (((usage.machine.memory.usedMemMb / usage.machine.memory.totalMemMb) * 100) > 90)
            reasons.push("High memory consumption.");
        return reasons;
    }
    const warningReasons: string[] = getServerWarningReasons();
    const activeSymbolInfoBar = server.type === ServerType.Worker;

    return (<Grid container>
        <Grid item xs={12}>
            <Grid container alignItems={"flex-start"}
                  className={[classes.rootContainer,...(activeSymbolInfoBar ? [classes.activeSymbolInfoBar] : [])].join(" ")}>
                <Grid item className={classes.serverGraphicsContainer}>
                    {mobileMode ? null : <ServerBackground className={classes.serverBackground}/>}
                    <Server className={classes.server}/>
                    {(server as WorkerInformation).leader ?
                        <Tooltip title={"Leader"}>
                            <Crown className={classes.crown}/>
                        </Tooltip>
                        : null}
                    {warningReasons.length > 0 ?
                        <Tooltip title={<div className={classes.tooltipMultiline}>{warningReasons.join("\n")}</div>}>
                            <Warning className={classes.warning}/>
                        </Tooltip>
                        : null}
                    {activeSymbolInfoBar ?
                        <SymbolInfoBar brightDeactivatedSymbols={mobileMode} server={server}
                                       className={classes.symbolInfoBar}/> : null}
                </Grid>
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
                                subTitle={capitalizeFirstLetter(server.platform)}
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
