/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Chart,registerables} from "chart.js";

import 'chartjs-adapter-moment';

Chart.defaults.animation = {
    duration: 1000
}

//todo reigster only whats needed
Chart.register(...registerables);