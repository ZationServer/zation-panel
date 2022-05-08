import {Chart,registerables} from "chart.js";

import 'chartjs-adapter-moment';

Chart.defaults.animation = {
    duration: 1000
}

//todo reigster only whats needed
Chart.register(...registerables);