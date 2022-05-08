import React, {useEffect, useRef} from "react";
import {ChartOptions, ChartData, Chart} from 'chart.js';
import {Line} from "react-chartjs-2";
import RTCard, {RTCardHandle} from "../../../cards/rtCard";
import {capitalizeFirstLetter} from "../../../../../lib/utils/string";

const RTLineChartCard: React.FC<{
    valueTitle?: string | ((value: any) => string)
    valueInfoTooltip?: string,
    unit?: string;
    interval: number;
    fetchValue: () => any;
    dataLabel?: ((value: any) => string) | string;
    description?: ((value: any) => string) | string;
    maxLength?: number;
    grace?: number;
    mini?: boolean;
    suggestedMax?: number;
}> = ({valueTitle, valueInfoTooltip, unit,
                             grace,mini,
                             interval,fetchValue, maxLength = 10,
                             dataLabel = "",
                             description = "",
                             suggestedMax = 20}) => {

    const chartRef = useRef<Chart<'line'>>(null);
    const value = fetchValue();
    const desc = typeof description === 'function' ? description(value) : description;
    const timestamp = Date.now();
    const unitPostfix = unit != null ? (' ' + unit) : '';

    const rtCardRef = React.useRef<RTCardHandle>(null);

    const parseDataLabel = typeof dataLabel === 'function' ? dataLabel : () => dataLabel;

    const processValueTitle =  (value: any) => valueTitle != null ?
        (typeof valueTitle === 'function' ? valueTitle(value) : valueTitle) : (value + unitPostfix);

    const chartOptions: ChartOptions<'line'> = {
        animation: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        ` ${context.parsed.y}${unitPostfix} ${parseDataLabel(context.parsed.y)}`
                }
            }
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
        scales: {
            x: {
                display: false,
                type: 'time' as any,
                grid: {
                    color: 'transparent',
                },
                beginAtZero: true,
                ticks: {
                    display: false,
                }
            },
            y: {
                display: false,
                grace,
                beginAtZero: true,
                ticks: {
                    display: false,
                },
                suggestedMin: 0,
                suggestedMax
            }
        },
        elements: {
            line: {
                tension: mini ? 0.00001 : 0.2,
                borderWidth: 1,
                fill: true,
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4,
            },
        }
    };

    const initData: ChartData<'line'> = {
        datasets: [
            {
                backgroundColor: mini ? 'rgba(255,255,255,.3)' : 'rgba(48, 153, 187,.3)',
                borderColor: mini ? 'rgba(255,255,255,.55)' : 'rgba(48, 153, 187,.55)',
                spanGaps: true,
                data: [
                    {
                        x: timestamp,
                        y: value
                    },
                    {
                        x: timestamp + interval / 2,
                        y: value
                    }]
            },
        ],
    };
    const data = useRef<ChartData<'line'>>(initData);

    const update = (force?: boolean) => {
        const value = fetchValue();
        const dataset = data.current.datasets[0];
        const chart = chartRef.current;
        if(!dataset || ! chart) return;

        const update = force || rtCardRef.current!.isRunning();

        if(update) {
            rtCardRef.current?.refreshValue(processValueTitle(value));
            if(typeof description === 'function')
                rtCardRef.current?.refreshDescription(capitalizeFirstLetter(description(value)));
        }

        dataset.data.push({
            x: Date.now(),
            y: value
        });
        if(update) chart.update();

        while(dataset.data.length > maxLength) {
            dataset.data.shift();
            if(update) chart.update();
        }
    }

    useEffect(() => {
        const intervalTicker = setInterval(() => update(),interval);
        return () => clearInterval(intervalTicker);
    },[interval]);

    return (
        <RTCard ref={rtCardRef} value={processValueTitle(value)} description={capitalizeFirstLetter(desc)}
                onRunningStateChange={state => state && update(true)} big={!mini} valueInfoTooltip={valueInfoTooltip}>
            <div className="chart-wrapper">
                <Line ref={chartRef} options={chartOptions} data={initData} height={70}/>
            </div>
        </RTCard>
    )
}

export default RTLineChartCard;