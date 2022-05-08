export default class TimeUtils {

    static formatDateTime(timestamp: number){
        return (new Date(timestamp)).toLocaleString('en-GB',{dateStyle : 'full',timeStyle : 'long'});
    }

    static formatTime(timestamp: number){
        return (new Date(timestamp)).toLocaleString('en-GB',{timeStyle : 'long'});
    }

    static processTimeSpan(timestamp: number) {
        return Date.now() - timestamp;
    }

    static processAge(timespan: number) {
        if(timespan < 1000) return '1 sec';
        else if(timespan < 60000) {
            // under 1 min
            return Math.trunc(timespan / 1000) + ' sec';
        }
        else if(timespan < 3.6e+6) {
            // under 1 hour
            return Math.trunc(timespan / 60000) + ' min';
        }
        else if(timespan < 8.64e+7) {
            // under day
            const res = Math.trunc(timespan / 3.6e+6);
            return res + (res === 1 ? ' hour' : ' hours');
        }
        else if(timespan < 6.048e+8) {
            // under week
            const res = Math.trunc(timespan / 8.64e+7);
            return res + (res === 1 ? ' day' : ' days');
        }
        else if(timespan < 2.628e+9) {
            // under month
            const res = Math.trunc(timespan / 6.048e+8);
            return res + (res === 1 ? ' week' : ' weeks');
        }
        else if(timespan < 3.154e+10) {
            // under year
            const res = Math.trunc(timespan / 2.628e+9);
            return res + (res === 1 ? ' month' : ' months');
        }
        else {
            const res = Math.trunc(timespan / 3.154e+10);
            return res + (res === 1 ? ' year' : ' years');
        }
    }
}
