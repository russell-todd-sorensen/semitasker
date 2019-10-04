

class BaseConvert {
    constructor(inString,baseN,maxNigits,decPoint) {
        this.decimalPoint = (decPoint||".")
        this.inList = inString.split(this.decimalPoint)
        this.inStr = this.inList[0];
        this.inFrac = this.inList[1];
        this.strlen = this.inStr.length
        this.fracLen = (this.inFrac ? this.inFrac.length : 0)
        this.bnStr = "";
        this.bnFrac = "";
        this.value = "";
        this.strArr = [];
        this.strFrac = [];
        this.baseN = (baseN < 2 ? 2 : (baseN || 16));
        this.vMap = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        this.maxNigits = (maxNigits||100); // prevent inf loop
        this.maxlen = 12;
    }

    convert () {
        this.value = this.decToBaseN() + this.decimalPoint + this.fracToBaseN();
        return this.value;
    }

    decToBaseN () {
        this.bnStr  = "";
        let beg = 0;
        let end = this.maxlen;
        let slen = ("" + this.inStr).length
        let rem;

        while (slen - beg >= 1) {
            this.strArr.push(this.inStr.slice(beg,end))
            beg += this.maxlen
            end += this.maxlen
        }
        while (this.strArr.length > 0) {
            rem         = this.divArr()
            this.bnStr  = this.vMap[rem] + this.bnStr;
        }
        if (this.bnStr == "") this.bnStr = "0"
        return this.bnStr;
    }

    fracToBaseN () {
        this.strFrac = this.inFrac.split("");
        this.bnFrac = "";
        let i = 0;
        let car;
        while (this.strFrac.length > 0 && i < this.maxNigits) {
            car = this.mulArr()
            this.bnFrac += this.vMap[car]
            i++;
        }
        return this.bnFrac
    }

    divArr () {
        let alen = this.strArr.length
        let res = []
        let rem = 0
        let numi,num,div,len2,begin= 0;
        for (let i=0;i<alen;i++) {
            numi = "" + this.strArr[i]
            len2 = numi.length
            num  = "" + rem + numi
            rem  = num % this.baseN
            div  = "" + (num-rem)/this.baseN
            if (div.length < len2 && begin) {
                div = "0".repeat(len2 - div.length) + div
            }
            if (div > 0 || begin) {
                res.push("" + div)
                begin = 1
            }
        }
        this.strArr = res;
        return rem;
    }

    mulArr () {
        let flen = this.strFrac.length;
        let res  = [];
        let rem  = 0;
        let car  = 0;
        let begin = 0;
        let num,mul;
        for (let i=flen-1;i>=0;i--) {
            num = this.strFrac[i];
            if (num == "0" && begin == 0) {
                continue
            }
            begin = 1;
            mul  = num * this.baseN + car;
            rem = mul % 10
            car = (mul - rem)/10
            res[res.length] = rem
        }
        this.strFrac = res.reverse()
        return car
    }
}

var mapBinaryToA = function (binaryFloat) {
    return binaryFloat.split("").map(x => {
        switch (x) {
        case '0':
            return 'a';
            break;
        case '1':
            return 'A';
            break;
        default:
            return x;
            break;
        }
    }).join("");
}

var decimalToBinaryA = function(decimal) {
    let bn = new BaseConvert(decimal,2).decToBaseN()
    return mapBinaryToA(bn);
}

var floatToBinaryA = function (float,maxNigits) { // pure fractions must start with 0.
    maxNigits = (maxNigits||12)
    let bn = new BaseConvert(float,2,maxNigits).convert()
    return mapBinaryToA(bn);
}

var decimalToHexString = function(decimal) {
    let bn = new BaseConvert(decimal,16).decToBaseN();
    return bn;
}

var floatToHexString = function (float,maxNigits) { // pure fractions must start with 0.
    float = "" + float
    let len = float.length
    maxNigits = (maxNigits||len||12)
    let bn = new BaseConvert(float,16,maxNigits).convert();
    return bn;
}

/*
    if (arguments.length == 4 && totalDigits && fractionDigits) {
        if (fractionDigits > totalDigits) {
            return null;
        }
    } else
    if (arguments.length == 3 && !totalDigits || totalDigits < 1) {
        return null
    } else
    if (fractionDigits) {

    }

1.1 binary 

value of .1         binary = 1/2   =  .5
value of .01        binary = 1/4   =  .25
value of .001       binary = 1/8   =  .125
value of .0001      binary = 1/16  =  .0625
value of .00001     binary = 1/32  =  .03125
value of .000001    binary = 1/64  =  .015675
value of .0000001   binary = 1/128 =  .0078125
sum of these                          .9922375


so .1 decimal       binary ~= .00011  (.09375 base 10)
   .2 decimal       binary ~= 


   try conversion of .75 to .11 binary

   .75 * 2 = 1.5 --> 1.0 shift right 1 spot == .1
   .5  * 2 = 1.0 --> 1.1 shift right 1 spot == .11
   only zero remains, finished



   .1101 base 2 =   0.5
   .0101 base 2 =   0.25
   .0001 base 2 =   0.000
   .0001 base 2 =   0.0625
                    0.8125
*/ 


/*
 * Binary Numbers Represented as two unique characters:

a = 0
A = 1

Base 4 Numbers:

a(white) = 0
A(black) = 1
a(black) = 2
A(white) = 3

Numbers 0 thru 128:

1.1 binary 

value of .1         binary = 1/2   =  .5
value of .01        binary = 1/4   =  .25
value of .001       binary = 1/8   =  .125
value of .0001      binary = 1/16  =  .0625
value of .00001     binary = 1/32  =  .03125
value of .000001    binary = 1/64  =  .015675
value of .0000001   binary = 1/128 =  .0078125
sum of these                          .9922375

so .1 decimal       binary ~= .00011  (.09375)
   .2 decimal       binary ~= 


   try conversion of .75 to .11 binary

   .75 * 2 = 1.5 --> 1.0 shift right 1 spot == .1
   .5  * 2 = 1.0 --> 1.1 shift right 1 spot == .11
   only zero remains, finished

*/