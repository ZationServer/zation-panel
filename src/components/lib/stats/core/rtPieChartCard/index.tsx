import React, {useEffect, useState} from "react";
import {ChartOptions, ChartData} from 'chart.js';
import {Pie} from "react-chartjs-2";
import RTCard, {RTCardHandle} from "../../../cards/rtCard";

type PieData = Record<string,any>;

const COLORS = ['rgba(244,171,0,0.7)','rgba(48,153,187,0.7)','rgba(244,123,0,0.7)',
    'rgba(43,225,98,0.7)','rgba(255,77,49,0.7)','rgba(46,175,211,0.7)','rgba(165,246,47,0.7)'];

const CHART_OPTIONS: ChartOptions<'pie'> = {
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            labels : {
                color : '#ffffff'
            },
            position : 'bottom',
        }
    },
    borderColor: "rgba(0, 0, 0, 0)",
    layout: {
        padding: {
            top: 8,
            right : 8,
            left : 8,
            bottom : 15
        }
    }
};

const RTPieChartCard: React.FC<{
    valueTitle?: string | ((value: PieData) => string)
    valueInfoTooltip?: string,
    unit?: string;
    interval: number;
    fetchValues: () => PieData;
    description?: string;
    maxLength?: number;
    mini?: boolean;
}> = ({valueTitle, valueInfoTooltip, unit, mini,
          interval,fetchValues, description = ""}) => {

    const rtCardRef = React.useRef<RTCardHandle>(null);

    const unitPostfix = unit != null ? (' ' + unit) : '';
    const processValueTitle =  (values: PieData) => valueTitle != null ?
        (typeof valueTitle === 'function' ? valueTitle(values) : valueTitle) : (values + unitPostfix);

    const [chartData,setChartData] = useState<ChartData<'pie'>>({
        datasets: []
    });

    const updatePieChartData = (data: PieData) => {
        const labels: string[] = [],
            values: number[] = [],
            colors: string[] = [];
        const chartData: ChartData<'pie'> = {
            labels,
            datasets: [{
                data: values,
                backgroundColor: colors
            }]
        }
        let index = 0;
        for(const key in data) {
            if(!data.hasOwnProperty(key)) continue;
            if(labels[index] !== key) labels[index] = key;
            values.push(data[key]);
            colors.push(COLORS[index] ?? "rgba(48,153,187,0.7)");
            index++;
        }
        setChartData(chartData);
    }

    useEffect(() => {
        update(true);
    },[])

    const update = (force?: boolean) => {
        const update = force || rtCardRef.current!.isRunning();
        if(!update) return;
        const values = fetchValues();
        updatePieChartData(values);
        rtCardRef.current?.refreshValue(processValueTitle(values));
    }

    useEffect(() => {
        const intervalTicker = setInterval(() => update(),interval);
        return () => clearInterval(intervalTicker);
    },[interval]);

    return (
        <RTCard ref={rtCardRef} onRunningStateChange={state => state && update(true)} big={!mini}
                valueInfoTooltip={valueInfoTooltip} description={description}>
            <div className="chart-wrapper">
                <Pie options={CHART_OPTIONS} data={chartData} height={195}/>
            </div>
        </RTCard>
    )
}

export default RTPieChartCard;