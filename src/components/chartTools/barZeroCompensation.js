
export const zeroCompensation = {
    renderZeroCompensation: function (chartInstance, d) {

        const view = d._view;
        const context = chartInstance.chart.ctx;
        const startX = view.x - view.width / 2;
        context.beginPath();
        context.strokeStyle = '#aaaaaa';
        context.moveTo(startX, view.y);
        context.lineTo(startX + view.width, view.y);
        context.stroke();
    },

    afterDatasetsDraw: function (chart, easing) {
        const meta = chart.getDatasetMeta(0);
        const dataSet = chart.config.data.datasets[0].data;
        meta.data.forEach((d, index) => {
            if(dataSet[index] === 0) {
                this.renderZeroCompensation(chart, d)
            }
        })
    }
};