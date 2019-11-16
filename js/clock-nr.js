// Clock Hands Movement
class Clock {

    #queue;
    #timezoneOffset = -8; // PST
    #stats = [{h:0,m:0,s:0,ms:0,diff:0}];
    #days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    #daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    constructor (queue,hourId,minuteId, secondId, subSecondOneId,subSecondTwoId) {
        this.#queue = (queue?queue:new Queue());
        this.hourId = (hourId?hourId:"hour-hand");
        this.minuteId = (minuteId?minuteId:"minute-hand");
        this.secondId = (secondId?secondId:"second-hand");
        this.subSecondOneId = (subSecondOneId?subSecondOneId:"sub-second-hand-1");
        this.subSecondTwoId = (subSecondTwoId?subSecondTwoId:"sub-second-hand-2");
        this.continueAnimation = false;
        this.runFunction = this.run;

        this.data = {
            obj:this,
            hourId:this.hourId,
            minuteId:this.minuteId,
            secondId:this.secondId,
            subSecondOneId:this.subSecondOneId,
            subSecondTwoId:this.subSecondTwoId,
            timezoneOffset:this.#timezoneOffset,
            queue:this.#queue,
        }
        return this
    }
    start (animationFunction, timeout, data) {
        let da = (data?data:this.data)
        let obj = da.obj;
        let af = (animationFunction?animationFunction:this.runFunction);
        let to = (timeout?timeout:1000)
        obj.continueAnimation = true;
        this.continueAnimation = true;
        da.af = af;
        da.timeout = to;
        // Initial queue uses priority scheduling
        new QueueItem(obj.#queue,af,to,da,true)
    }
    set (dateObj,dataObj) {
        let date = (dateObj?dateObj:new Date())
        let data = (dataObj?dataObj:this.data)
        let obj  = data.obj
        let d    = document;
        let millisecond = date.getMilliseconds();
        let second = date.getUTCSeconds();
        let minute = date.getUTCMinutes();
        let hour = (date.getUTCHours() % 12);
        let day = date.getUTCDate();
        let month = date.getUTCMonth() + 1;
        let year = date.getUTCFullYear();
        // Adjust for Timezone Difference, if any
        let tzo = date.getTimezoneOffset();
        let timezoneOffset = obj.getTimezoneOffset()
        let origHour = hour;
        if (tzo == 0) {
            hour = date.getUTCHours() + timezoneOffset;
            if (hour < 0) {
                let i = 0
                while (hour < 0) {
                    hour += 12
                    i++
                }
                // quick timezone fix, do better with constructed date
                hour = hour % 12
                day -= 1
            }
            if (day < 1) {
                month--
                if (month < 1) {
                    year--
                    month = 12
                }
                // back to day
                day = this.#daysInMonth[month-1]
            }
        }

        this.pushStat(hour,minute,second,millisecond);

        let sAngle = second * 6;
        let mAngle = minute * 6 + (sAngle/60);
        let hAngle = hour  * 30 + (mAngle/12);
        let secondElement = d.getElementById(data.secondId)
        secondElement.setAttribute('transform','rotate(' + sAngle + ')')
        let minuteElement = d.getElementById(data.minuteId)
        minuteElement.setAttribute('transform','rotate(' + mAngle + ')')
        let hourElement = d.getElementById(data.hourId)
        hourElement.setAttribute('transform','rotate(' + hAngle + ')')
    }
    pushStat(hour,minute,second,millisecond) {
        let prev = this.#stats[this.#stats.length-1]
        let diff  = (second - prev.s)
        if (diff < 1) {
            if (minute == prev.m) {
                this.print('stats')
            }
        }
        if (this.#stats.length > 70) {
            //this.print('stats');
            this.resetStats();
        }
        this.#stats.push({h:hour,m:minute,s:second,ms:millisecond,diff:diff});
    }
    run (data) {
        let date = new Date();
        let millisecond = date.getMilliseconds();
        let obj  = data.obj;
        obj.set(date,data);
        data.continueAnimation = obj.continueAnimation
        data.timeout = 1000-millisecond
        return new QueueItem(obj.#queue,data.af,data.timeout,data,false);
    }
    stop () {
        this.continueAnimation = false;
    }
    setTimezoneOffset(tz) {
        this.#timezoneOffset = tz;
        this.data.timezoneOffset = tz;
    }
    getTimezoneOffset() {
        return this.#timezoneOffset;

    }
    resetStats() {
        this.#stats = [{h:0,m:0,s:0,ms:0,diff:0}];
    }
    getStats() {
        return this.#stats;
    }
    print(preId) {
        let pre = document.getElementById(preId)
        let html = ""
        for (let i = 0;i<this.#stats.length;i++ ) {
            html += "h:" + this.#stats[i].h 
            + ", m:" + this.#stats[i].m
            + ", s:" + this.#stats[i].s 
            + " ms: " +  this.#stats[i].ms 
            + ", diff:" + this.#stats[i].diff
            + " <br />";
        }
        pre.innerHTML = html
    }
}
