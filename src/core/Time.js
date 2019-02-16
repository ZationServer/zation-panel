/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export default class Time {

    static processAge(timestamp) {
       let timespan = Date.now() - timestamp;
        if(timespan < 1000) {
           return '1 sec';
       }
       else if(timespan < 60000) {
           // under 1 min
           return parseInt(timespan / 1000) + ' sec';
       }
       else if(timespan < 3.6e+6) {
           // under 1 hour
           return parseInt(timespan / 60000) + ' min';
       }
       else if(timespan < 8.64e+7) {
           // under day
           return parseInt(timespan / 3.6e+6) + ' hours';
       }
       else if(timespan < 6.048e+8) {
           // under week
           return parseInt(timespan / 8.64e+7) + ' days';
       }
       else if(timespan < 2.628e+9) {
           // under month
           return parseInt(timespan / 6.048e+8) + ' weeks';
       }
       else if(timespan < 3.154e+10) {
           // under year
           return parseInt(timespan / 2.628e+9) + ' months';
       }
       else {
           return parseInt(timespan / 3.154e+10) + ' years';
       }
    }
}
