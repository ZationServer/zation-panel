/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Divider, Grid, Stack, Tooltip, Typography} from "@mui/material";
import useConnector from "../../../../../lib/hooks/useConnector";
import {useForceUpdate} from "../../../../../lib/hooks/useForceReload";
import LogCard from "../../../../lib/cards/logCard";
import {FaPause, FaPlay} from "react-icons/fa";
import {reAddClassName} from "../../../../../lib/utils/className";
import "./index.css";

const LiveLogs: React.FC = () => {

    const connector = useConnector();
    const forceUpdate = useForceUpdate();

    const [running, setRunning] = useState(true);
    const toggleRunningBtn = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const toggleRunning = useCallback((state?: boolean) => {
        const newState = state != null ? state : !running;
        if (newState == running) return;
        reAddClassName(toggleRunningBtn.current, 'pulse');
        setRunning(newState);
    }, [toggleRunningBtn, running]);

    const update = useCallback(() => running && forceUpdate(), [forceUpdate, running]);

    useEffect(() => {
        connector.on("logsUpdate", update);
        return () => connector.off("logsUpdate", update);
    }, [connector, update])

    useEffect(() => {
        const list = listRef.current;
        if(list == null) return;
        const handleScroll = (event: any) => {
            const scrollTop = event?.target?.scrollTop ?? 0;
            toggleRunning(scrollTop <= 0);
        };
        list.addEventListener('scroll', handleScroll);
        return () => list.removeEventListener("scroll", handleScroll);
    }, [toggleRunning,listRef])

    return (
        <div className="container-fluid animated fadeIn">
            <Grid container spacing={1} className="live-log-root" direction={"column"} flexWrap={"nowrap"}>
                <Grid item>
                    <Grid container direction={"row"} alignItems={"center"}>
                        <Grid item>
                            <Typography typography={'h1'} className={"live-logs-header"}>
                                Live logs
                            </Typography>
                        </Grid>
                        <Grid item flexGrow={1}/>
                        <Grid item>
                            <Tooltip title={running ? 'pause' : 'start'} aria-label={running ? 'pause' : 'start'}>
                                <button ref={toggleRunningBtn} type="button" className="btn-time-control animated"
                                        onClick={() => toggleRunning()}>{
                                    running ? <FaPause height={30} width={30} className="timeIcon"/> :
                                        <FaPlay height={20} width={20} className="timeIcon"/>
                                }
                                </button>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Divider className={"live-log-divider"}/>
                </Grid>
                <Grid item flexGrow={1} className="live-log-list" ref={listRef}>
                    <Stack sx={{width: '100%'}} spacing={2} direction="column-reverse">
                        {
                            connector.logs.map(log =>
                                <LogCard key={log.server + log.timestamp + log.content} message={log}/>)
                        }
                    </Stack>
                </Grid>
            </Grid>
        </div>
    )
};

export default React.memo(LiveLogs);
