/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import React, {useEffect, useRef} from "react";
import {ChartOptions, ChartData, Chart, LegendItem, LegendElement} from 'chart.js';
import {Line} from "react-chartjs-2";
import RTCard, {RTCardHandle} from "../../../cards/rtCard";
import {capitalizeFirstLetter} from "../../../../../lib/utils/string";

const RTMultiLineChartCard: React.FC<{
    valueTitle?: string | ((value: any) => string)
    unit?: string;
    interval: number;
    fetchValues: () => any[];
    valuesMerger: (values: (any)[],activeDatasets: boolean[]) => any;
    dataLabel?: ((value: any,valueIndex: number) => string) | string;
    description?: ((value: any) => string) | string;
    maxLength?: number;
    displayLegend?: boolean;
    grace?: number;
    labels?: string[];
    lineBorderColors?: string[];
    lineBackgroundColors?: string[];
    suggestedMax?: number;
}> = ({valueTitle, unit, grace,
                                  labels = [],
                                  lineBorderColors = [],
                                  lineBackgroundColors = [],
                                  displayLegend = true,interval,
                                  fetchValues, valuesMerger, maxLength = 10,
                                  dataLabel = "",
                                  description = "",
                                  suggestedMax = 20}) => {
    const chartRef = useRef<Chart<'line'>>(null);
    const values = fetchValues();
    const activeDatasets = useRef<boolean[]>(values.map(() => true));

    const mergeActiveValues = (values: any[]) => valuesMerger(values,activeDatasets.current);

    const activeMergedValues = mergeActiveValues(values);
    const desc = typeof description === 'function' ? description(activeMergedValues) : description;

    const timestamp = Date.now();
    const unitPostfix = unit != null ? (' ' + unit) : '';

    const rtCardRef = React.useRef<RTCardHandle>(null);

    const parseDataLabel = typeof dataLabel === 'function' ? dataLabel : () => dataLabel;

    const processValueTitle = (value: any) => valueTitle != null ?
        (typeof valueTitle === 'function' ? valueTitle(value) : valueTitle) : (value + unitPostfix);

    const defaultLegendClick = Chart.defaults.plugins.legend.onClick;
    const chartOptions: ChartOptions<'line'> = {
        animation: false,
        plugins: {
            legend: {
                display: displayLegend,
                labels: {
                    color: '#ffffff'
                },
                position: 'bottom',
                fullSize: true,
                onClick(event,legendItem, legendElement) {
                    defaultLegendClick.call(this,event,legendItem,legendElement);
                    activeDatasets.current[legendItem.datasetIndex] = !legendItem.hidden;
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        ` ${context.parsed.y}${unitPostfix} ${parseDataLabel(context.parsed.y,context.datasetIndex)}`
                }
            },
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
                tension: 0.2,
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
        datasets: values.map((value,index) => ({
            label: labels[index],
            backgroundColor: lineBackgroundColors[index],
            borderColor: lineBorderColors[index],
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
        }))
    };
    const data = useRef<ChartData<'line'>>(initData);

    const update = (force?: boolean) => {
        const values = fetchValues();
        const activeMergedValues = mergeActiveValues(values);
        const chart = chartRef.current;
        const datasets = data.current?.datasets;
        if(!datasets || !chart) return;

        const update = force || rtCardRef.current!.isRunning();

        if(update) {
            rtCardRef.current?.refreshValue(processValueTitle(activeMergedValues));
            if(typeof description === 'function')
                rtCardRef.current?.refreshDescription(capitalizeFirstLetter(description(activeMergedValues)));
        }

        datasets.forEach((dataset,index) => dataset.data.push({
            x: Date.now(),
            y: values[index]
        }));
        if(update) chart.update();

        datasets.forEach(dataset => {
            while(dataset.data.length > maxLength) {
                dataset.data.shift();
            }
        });
        if(update) chart.update();
    }

    useEffect(() => {
        const intervalTicker = setInterval(() => update(),interval);
        return () => clearInterval(intervalTicker);
    },[interval]);

    return (
        <RTCard ref={rtCardRef} value={processValueTitle(activeMergedValues)} big description={capitalizeFirstLetter(desc)}
                onRunningStateChange={state => state && update(true)}>
            <div className="chart-wrapper">
                <Line ref={chartRef} options={chartOptions} data={initData} height={70}/>
            </div>
        </RTCard>
    )
}

export default RTMultiLineChartCard;