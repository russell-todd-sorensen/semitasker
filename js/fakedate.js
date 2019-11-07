// Class used for testing clock hand alignment.
class fakeDate {
    #milliseconds = 0;
    #UTCSeconds   = 0;
    #UTCMinutes   = 0;
    #UTCHours     = 0;
    #UTCDate      = 0;
    #UTCMonth     = 0;
    #UTCFullYear  = 2019;
    #timezoneOffset = 0;

    constructor (date) {
        this.#milliseconds = date.ms;
        this.#UTCSeconds   = date.s;
        this.#UTCMinutes   = date.m;
        this.#UTCHours     = date.h;
        this.#UTCDate      = date.dom;
        this.#UTCMonth     = date.mon;
        this.#UTCFullYear  = date.fy;
    }

    getMilliseconds() {
        return this.#milliseconds
    }
    getUTCSeconds() {
        return this.#UTCSeconds;
    }
    getUTCMinutes() {
        return this.#UTCMinutes;
    }
    getUTCHours() {
        return this.#UTCHours;
    }
    getUTCDate() {
        return this.#UTCDate;
    }
    getUTCMonth() {
        return this.#UTCMonth;
    }
    getUTCFullYear() {
        return this.#UTCFullYear;
    }
    getTimezoneOffset() {
        return this.#timezoneOffset;
    }
    setTimezoneOffset(tz) {
        this.#timezoneOffset = tz;
    }
}

var fakedate = [] 

fakedate[0] = {
    ms:15,
    s:0,
    m:0,
    h:0,
    dom:1,
    mon:0,
    fy:2019,
}

fakedate[1] = {
    ms:15,
    s:5,
    m:0,
    h:0,
    dom:1,
    mon:0,
    fy:2019,
}

fakedate[2] = {
    ms:15,
    s:10,
    m:10,
    h:0,
    dom:1,
    mon:0,
    fy:2019,
}

fakedate[3] = {
    ms:15,
    s:15,
    m:15,
    h:0,
    dom:1,
    mon:0,
    fy:2019,
}

fakedate[4] = {
    ms:15,
    s:20,
    m:20,
    h:0,
    dom:1,
    mon:0,
    fy:2019,
}

fakedate[5] = {
    ms:15,
    s:25,
    m:25,
    h:0,
    dom:1,
    mon:0,
    fy:2019,
}

fakedate[6] = {
    ms:15,
    s:30,
    m:30,
    h:0,
    dom:1,
    mon:0,
    fy:2019,
}

fakedate[7] = {
    ms:15,
    s:35,
    m:35,
    h:0,
    dom:1,
    mon:0,
    fy:2019,
}

fakedate[8] = {
    ms:15,
    s:40,
    m:40,
    h:0,
    dom:1,
    mon:0,
    fy:2019,
}

fakedate[9] = {
    ms:15,
    s:45,
    m:45,
    h:0,
    dom:1,
    mon:0,
    fy:2019,
}

fakedate[10] = {
    ms:15,
    s:50,
    m:50,
    h:0,
    dom:1,
    mon:0,
    fy:2019,
}

fakedate[11] = {
    ms:15,
    s:55,
    m:55,
    h:0,
    dom:1,
    mon:0,
    fy:2019,
}
