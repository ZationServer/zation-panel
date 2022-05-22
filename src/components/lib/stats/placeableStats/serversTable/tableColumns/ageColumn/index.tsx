/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from 'react';
import "./index.css";
import TimeUtils from "../../../../../../../lib/utils/time";
import {Tooltip} from "@mui/material";

const AgeColumn: React.FC<{
    timestamp: number
}> = ({timestamp}) => {
    const age = TimeUtils.processTimeSpan(timestamp);
    return (
        <div className={"age-card-tooltip"}>
            <Tooltip title={TimeUtils.formatDateTime(timestamp)}>
                <span>{TimeUtils.processAge(age)}</span>
            </Tooltip>
        </div>
    )
}

export default AgeColumn;