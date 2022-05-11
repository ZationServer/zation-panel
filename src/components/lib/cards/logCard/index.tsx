/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import {Divider, Grid, Paper, Typography} from "@mui/material";
import {ErrorOutline, InfoOutlined, WarningAmberOutlined,
    BugReportOutlined, CheckOutlined, HourglassEmptyOutlined,
    PriorityHighOutlined, ReportGmailerrorredOutlined, RocketLaunchOutlined,
    SvgIconComponent} from "@mui/icons-material";
import "./index.css";
import LogMessage, {Color as LogColor} from "../../../../lib/definitions/logMessage";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimeUtils from "../../../../lib/utils/time";
import {hexToRgb} from "../../../../lib/utils/color";
import useConnector from "../../../../lib/hooks/useConnector";
import {NavLink} from "react-router-dom";

const COLOR_MAP: Record<LogColor, string> = {
    [LogColor.Black]: "#000000",
    [LogColor.Red]: "#ed4337",
    [LogColor.Green]: "#80FF72",
    [LogColor.Yellow]: "#FFF07C",
    [LogColor.Blue]: "#2364AA",
    [LogColor.Magenta]: "#CC59D2",
    [LogColor.Cyan]: "#16b7ec",
    [LogColor.White]: "#ffffff"
};

const ICON_MAP: Record<string,SvgIconComponent> = {
    "debug": BugReportOutlined,
    "launch-debug": BugReportOutlined,
    "info": InfoOutlined,
    "success": CheckOutlined,
    "busy": HourglassEmptyOutlined,
    "warning": WarningAmberOutlined,
    "error": ErrorOutline,
    "failed": ReportGmailerrorredOutlined,
    "fatal": PriorityHighOutlined,
    "active": RocketLaunchOutlined
};

const LogCard: React.FC<{message: LogMessage}> = ({message}) => {

    const colorCode = message.category.color;
    const hexColor = colorCode == null ? '#ffffff' : COLOR_MAP[colorCode];
    const Icon = ICON_MAP[message.category.name.toLowerCase()] || InfoOutlined;

    const connector = useConnector();
    const formatServerId = (id: string) => {
        const server = connector.servers[id];
        return server ? (server.name + ` (${id})`) : id;
    };

    return (
        <Paper className="log-paper" variant="outlined" style={{borderColor: hexColor,backgroundColor: hexToRgb(hexColor,0.1)}}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container spacing={1} alignItems={"flex-start"}>
                        <Grid item>
                            <Grid container alignItems={"center"}>
                                <Grid item className={"log-icon-container"}>
                                    <Icon style={{color: hexColor}} className="log-icon"/>
                                </Grid>
                                <Grid item>
                                    <Grid container direction={"column"}>
                                        <Grid item>
                                            <NavLink to={"/servers/" + message.server} target="_blank">
                                                <Typography className="log-text log-id-text">{formatServerId(message.server)}</Typography>
                                            </NavLink>
                                        </Grid>
                                        <Grid item>
                                            <Typography className="log-text log-type-text">{message.category.name.toLowerCase()}</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item flexGrow={1}/>
                        <Grid item>
                            <Grid container direction={"row"} alignItems={"center"}>
                                <Grid item>
                                    <AccessTimeIcon className="log-icon access-time-icon"/>
                                </Grid>
                                <Grid item>
                                    <Typography className="log-text log-time-text">{TimeUtils.formatTime(message.timestamp)}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Divider style={{borderColor: hexColor}} className="log-divider"/>
                </Grid>
                <Grid item xs={12}>
                    <Typography className="log-text log-content-text">{message.content}</Typography>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default LogCard;