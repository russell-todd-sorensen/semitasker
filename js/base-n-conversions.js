// BaseConvert takes string rep of base 10 integer
// and converts to string rep of integer in new base.

class BaseConvert {

    constructor(inString,baseN,maxNigits) {
        this.inString = inString;
        this.inArray = inString.split("");
        this.baseN = (baseN < 2 ? 2 : (baseN || 16));
        this.valueMap = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        this.maxNigits = (maxNigits||100); // prevent inf loop
    }
    toBaseNInt() {
        let res = ""
        let i = 0;
        let cod,rem
        let val = this.inString
        while (val > 0 && i < this.maxNigits+5) {
            rem = val % this.baseN
            res = this.valueMap[rem] + res
            val = (val - rem) / this.baseN
            i++
        }
        if (res == "") res = "0"
        return res
    }
    tryloop() {
        let arr = this.inArray.reverse()
        let len = arr.length
        let rem,con;
        let bas = 2;
        let out = ""
        let i   = 0
        while (i < len) {
            let val = arr[i]
            let j = 0
            while (val > bas && j < 100) {
                rem = val % bas
                out = this.valueMap[rem] + out
                val = (val - rem) / bas
                j++
            }
            out = this.valueMap[val%bas] + out
            i++;
        }
        return out
    }
}


/* METHOD T0 SUPPORT UNLIMITED LENGTH INTEGER 

input integer is decimal convert to array

"17" => ["1","7"]

Step 1: multiply by desired base (base 16)

["16", "112"]
prev = 0
res = ""
loop () {
    next = a.pop() + prev
    rem = next % base
    val = v[rem]
    next = (next-rem)/base
    while (next > base) {
        res = val + res
        next = next
    }













**/