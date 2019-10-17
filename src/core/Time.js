/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export default class Time {

    static processDate(timestamp){
        return (new Date(timestamp)).toLocaleString('en-GB',{dateStyle : 'full',timeStyle : 'long'});
    }

    static processTimeSpan(timestamp) {
        return Date.now() - timestamp;
    }

    static processAge(timespan) {
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
           const res = parseInt(timespan / 3.6e+6);
           return res + (res === 1 ? ' hour' : ' hours');
       }
       else if(timespan < 6.048e+8) {
           // under week
           const res = parseInt(timespan / 8.64e+7);
           return res + (res === 1 ? ' day' : ' days');
       }
       else if(timespan < 2.628e+9) {
           // under month
           const res = parseInt(timespan / 6.048e+8);
           return res + (res === 1 ? ' week' : ' weeks');
       }
       else if(timespan < 3.154e+10) {
           // under year
           const res = parseInt(timespan / 2.628e+9);
           return res + (res === 1 ? ' month' : ' months');
       }
       else {
           const res = parseInt(timespan / 3.154e+10);
           return res + (res === 1 ? ' year' : ' years');
       }
    }
}
