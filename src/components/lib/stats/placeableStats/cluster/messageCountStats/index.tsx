/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React from "react";
import useConnector from "../../../../../../lib/hooks/useConnector";
import RTMultiLineChartCard from "../../../core/rtMultiLineChartCard";

const MessageCountStats: React.FC<{
    interval?: number,
    maxLength?: number,
}> = ({interval = 1000,maxLength = 40}) => {
    const connector = useConnector();
    const DATA_TYPE_LABELS = ["WebSocket","Transmit","Invoke","HTTP"];
    const processLabel = (value: number,index: number) => DATA_TYPE_LABELS[index] + ' ' +
        ((value > 1 || value === 0) ? "messages" : "message");
    return <RTMultiLineChartCard
        dataLabel={processLabel}
        description="Total incoming messages"
        labels={["WebSocket messages","Transmit messages","Invoke messages","HTTP messages"]}
        maxLength={maxLength}
        fetchValues={() => [
            connector.workersSummary.wsMessageCount,
            connector.workersSummary.transmitMessageCount,
            connector.workersSummary.invokeMessageCount,
            connector.workersSummary.httpMessageCount
        ]}
        valuesMerger={(values: number[],activeDatasets) => {
            const activeValues = values.map((v,i) => activeDatasets[i] ? v : 0);
            return activeDatasets[0] ? (activeValues[0] + activeValues[3]) :
                activeValues.slice(1).reduce((a,b) => a + b,0);
        }}
        interval={interval}
        grace={0}
        lineBackgroundColors={['rgba(48, 153, 187,.3)','rgba(253, 202, 64,.3)',
            'rgba(110, 37, 148,.3)','rgba(43, 225, 98,.3)']}
        lineBorderColors={['rgba(48, 153, 187,.55)' ,'rgba(253, 202, 64,.55)',
            'rgba(110, 37, 148,.55)','rgba(43, 225, 98,.55)']}
    />
};

export default MessageCountStats;