/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, {useEffect, useState} from 'react';
import './index.css';
import RTCard, {RTCardHandle} from "../../../cards/rtCard";

const RTPercentageBarCard: React.FC<{
    fetchPercent: () => number,
    description?: string,
    interval?: number
}> = ({fetchPercent,description = "",interval = 1000}) => {

    const rtCardRef = React.useRef<RTCardHandle>(null);
    const getPercent = () => Math.max(Math.min(fetchPercent(),100),0);
    const update = (force?: boolean) => {
        if(!force && !rtCardRef.current?.isRunning()) return;
        setPercent(getPercent());
    }

    useEffect(() => {
        const intervalTicker = setInterval(() => update(),interval);
        return () => clearInterval(intervalTicker);
    },[interval]);

    const [percent,setPercent] = useState(getPercent());
    return (
        <RTCard ref={rtCardRef} value={percent.toFixed(1) + ' %'} description={description} onRunningStateChange={state => state && update(true)}>
            <div className="progress-wrapper">
                <div className={"progress"}>
                    <div className={"progress-bar"} style={{width : (percent + '%')}} aria-valuemin={0} aria-valuemax={100}/>
                </div>
            </div>
        </RTCard>
    )
}

export default RTPercentageBarCard;