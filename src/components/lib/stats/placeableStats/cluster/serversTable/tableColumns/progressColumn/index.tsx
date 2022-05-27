/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from 'react';
import "./index.module.css";
import {Tooltip} from "@mui/material";
import classes from "./index.module.css";

const ProgressColumn: React.FC<{
    percent: number
}> = ({percent}) => {
    percent = Math.max(Math.min(Math.ceil(percent), 100), 0);
    return (
        <Tooltip title={percent + ' %'}>
            <div className={classes.progressBar}>
                <div className={classes.progressBarIndicator} style={{width: (percent + '%')}}
                     aria-valuemin={0} aria-valuemax={100}/>
            </div>
        </Tooltip>
    )
};

export default ProgressColumn;