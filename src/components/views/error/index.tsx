/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from 'react';
import './index.css';
import {Fab} from "@mui/material";
import {Refresh, Warning} from '@mui/icons-material';
import {ROOT_PANEL_PATH} from "../../../lib/utils/constants";
import Center from "../../utils/center";

const Error: React.FC<{message: string}> = ({message}) => {
    const reload = () => window.location.pathname = ROOT_PANEL_PATH;
    return (
        <Center className={"full-height"}>
            <div className={'errorContainer'}>
                <Warning className="warningIcon bounceInDown animated"/>
                <h1>{message}</h1>
                <Fab variant="extended" aria-label="Delete" onClick={reload} className="refreshButton">
                    <Refresh className="refreshIcon" />
                    Try again
                </Fab>
            </div>
        </Center>
    );
};

export default Error;
