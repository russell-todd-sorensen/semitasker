// Clock Hands Movement
class Clock {

    #timezoneOffset = -8; // PST

    constructor (hourId,minuteId, secondId, subSecondOneId,subSecondTwoId) {
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
        }
    }
    start (animationFunction, timeout, data) {
        let da = (data?data:this.data)
        let obj = da.obj;
        let af = (animationFunction?animationFunction:this.runFunction);
        let to = (timeout?timeout:1000)
        obj.continueAnimation = true;
        scheduleFunction(af,to,true,true,da);
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
        }

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
    run (data) {
        let date = new Date();
        let millisecond = date.getMilliseconds();
        let obj  = data.obj;
        obj.set(date,data);
        return {continueAnimation:obj.continueAnimation,timeout:(1000-millisecond)}
    }
    setTimezoneOffset(tz) {
        this.#timezoneOffset = tz;
        this.data.timezoneOffset = tz;
    }
    getTimezoneOffset() {
        return this.#timezoneOffset;
    }
}
