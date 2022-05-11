/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import './index.css';
import {FaPlay, FaPause} from 'react-icons/fa';
import {Grid, Tooltip} from "@mui/material";
import { reAddClassName } from '../../../../lib/utils/className';

export type RTCardHandle = {isRunning: () => boolean,refreshValue: (value: any) => void,refreshDescription: (value: any) => void};

const RTCard: React.ForwardRefRenderFunction<RTCardHandle,{
    onRunningStateChange?: (running: boolean) => void,
    className?: string,
    value?: any,
    description?: string,
    big?: boolean,
    green?: boolean,
    children: any,
    valueInfoTooltip?: string
}> = ({
          onRunningStateChange,
          className = "", value = "", description = "",
                        big, green,
          children, valueInfoTooltip
      },ref) => {

    const [valueText, setValueText] = useState(value);
    const [descriptionText, setDescriptionText] = useState(description);

    useEffect(() => {setValueText(value)},[value]);
    useEffect(() => {setDescriptionText(description)},[description]);

    const [running, setRunning] = useState(true);

    useImperativeHandle(ref, () => ({
        isRunning: () => running,
        refreshValue: (value) => setValueText(value),
        refreshDescription: (description) => setDescriptionText(description)
    }),[running]);

    const toggleRunningBtn = useRef<HTMLButtonElement>(null);

    const toggleRunning = () => {
        reAddClassName(toggleRunningBtn.current,'pulse');
        const newState = !running;
        setRunning(newState);
        if (onRunningStateChange) onRunningStateChange(newState);
    }

    return (
        <div
            className={[className,'text-white card bg-info realTimeCard',(big ? 'big-card' : ''),(green ? 'cardGreen' : '')].join(" ")}>
            <div className="pb-0 card-body">
                <Grid container>
                    <Grid item xs={12}>
                       <Grid container>
                           <Grid item>
                               <Tooltip title={valueInfoTooltip ?? ""}>
                                   <div className="value-text">
                                       {valueText}
                                   </div>
                               </Tooltip>
                           </Grid>
                           <Grid item flexGrow={1}/>
                           <Grid item>
                               <Tooltip title={running ? 'pause' : 'start'} aria-label={running ? 'pause' : 'start'}>
                                   <button ref={toggleRunningBtn} type="button" className="btn-time-control animated"
                                           onClick={toggleRunning}>{
                                       running ? <FaPause height={30} width={30} className="timeIcon"/> :
                                           <FaPlay height={20} width={20} className="timeIcon"/>
                                   }
                                   </button>
                               </Tooltip>
                           </Grid>
                       </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <div className="description-text">
                            {descriptionText}
                        </div>
                    </Grid>
                </Grid>
                {children}
            </div>
        </div>
    );
};

export default React.forwardRef(RTCard);