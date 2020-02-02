class HexConvert {
    hexMap = {
        "0":0,
        "1":1,
        "2":2,
        "3":3,
        "4":4,
        "5":5,
        "6":6,
        "7":7,
        "8":8,
        "9":9,
        "A":10,"a":10,
        "B":11,"b":11,
        "C":12,"c":12,
        "D":13,"d":13,
        "E":14,"e":14,
        "F":15,"f":15
    };
    hexIntArray = [];
    hexBase = 16;
    value;

    constructor (hexInteger) {
        this.hexIntArray = ("" + hexInteger).split("");

    };

    toDecimal () {
        this.value = 0;
        for (let i=0;i<this.hexIntArray.length;i++) {
            this.value = this.value*this.hexBase + this.hexMap[this.hexIntArray[i]];
        }
        return this.value;
    }
}

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
        this.maxlen = (12 - ("" + this.baseN).length) ;
        this.maxlen = (this.maxlen < 1) ? 1 : this.maxlen;
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

// pi digits are at https://home.semitasker.com/chemical-pi/data/pi-digits.js
var testPiDigits = function(piVar, base, howMany) {
    howMany = (howMany||100)
    let π = "3." + piVar.substr(0,howMany)
    let bn = new BaseConvert(π,base,howMany)
    return bn.convert();
}

var factorInteger = function (integer) {
    let primeFactors = []
    let reduced = integer
    for (let i=2;i<reduced/2;i++) {
        let fac = {f:i,n:0}
        while (reduced % i == 0) {
            reduced /= i
            fac.n++
        }
        if (fac.n) primeFactors.push(fac)
    }
    if (reduced > 1) {
        primeFactors.push({f:reduced,n:1})
    }
    return {integer:integer,reduced:reduced,factors:primeFactors}
}

var divideAndRemain = function(numer,denom,numDigits) {
    let bn = new BaseConvert(numer,denom,numDigits);
    let beg = 0;
    let end = bn.maxlen;
    let slen = ("" + bn.inStr).length
    let div,rem;

    while (slen - beg >= 1) {
        bn.strArr.push(bn.inStr.slice(beg,end))
        beg += bn.maxlen
        end += bn.maxlen
    }

    rem = bn.divArr();
    div = bn.strArr.join("");

    return {div:div,rem:rem,bn:bn}
}

var reduceFraction = function (numerObj, denomObj) {

    let nFactors = numerObj.factors;
    let dFactors = denomObj.factors;
    let nfact = [];
    let dfact = [];
    let redu = [];
    let r;
    let k = 0;
    let reduProd = 1;
    if (nFactors.length < dFactors.length) {
        for (let i = 0;i<dFactors.length && k<nFactors.length;i++) {
            let dpeek = dFactors[i]
            let npeek = nFactors[k]
            let df = dpeek.f
            let nf = npeek.f
            let dn = dpeek.n
            let nn = npeek.n
            if (df == nf) {
                r = Math.min(dn,nn)
                redu.push({f:df,n:r})
                k++
            } else 
            if (df > nf) {
                k++
                i--
            }
        }
    } else {
        for (let i = 0;i<nFactors.length && k < dFactors.length;i++) {
            let dpeek = dFactors[k]
            let npeek = nFactors[i]
            let df = dpeek.f
            let nf = npeek.f
            let dn = dpeek.n
            let nn = npeek.n
            if (df == nf) {
                r = Math.min(dn,nn)
                redu.push({f:df,n:r})
                dFactors[k] = {f:df,n:dn-r}
                nFactors[i] = {f:nf,n:nn-r}
                k++
            } else
            if (nf > df) {
                k++
                i--
            }
        }
    }
    if (redu.length) {
        for (let i = 0;i<redu.length;i++) {
            reduProd *= (redu[i].f**redu[i].n)
        }
        for (let i=0;i<nFactors.length;i++) {
            if (nFactors[i].n == 0) continue;
            nfact.push(nFactors[i])
        }
        for (let i=0;i<dFactors.length;i++) {
            if (dFactors[i].n == 0) continue;
            dfact.push(dFactors[i])
        }
    } else {
        nfact = nFactors;
        dfact = dFactors;
    }

    return {rf:redu,rp:reduProd,nf:nfact,df:dfact}
}

var fractionToRecurringDecimal = function (numer,denom,doNotReduce) {

    let numerSign = (numer < 0 ? -1 : 1)
    let denomSign = (denom < 0 ? -1 : 1)
    let resultSign = numerSign * denomSign;
    denom *= denomSign;
    numer *= numerSign;

    // Remove value over 1.0 to give fraction 0.xxxx
    let intPart = 0
    if (numer >= denom) {
        intPart = Math.trunc(numer/denom)
        if (intPart > 0) {
            numer = numer - (intPart * denom)
        }
    }

    let origNumer = numer;
    let origDenom = denom;

   // reduce denom
    let denomFactors = factorInteger(denom);
    let numerFactors = factorInteger(numer);
    let reduc = reduceFraction(numerFactors,denomFactors);

    denomFactors.factors = reduc.df
    numerFactors.factors = reduc.nf
    numer /= reduc.rp;
    denom /= reduc.rp;
    
    console.log(" numer=" + numer + ", denom=" + denom)

    if (denom == 3800) {
        let ddddd = 1;
    }
    let reducedDenom; // broken here
    if (reduc.df && reduc.df.length) {
        reducedDenom = reduc.df[reduc.df.length-1].f
    } else {
        reducedDenom = 1
    }
    if (doNotReduce) {
        reducedDenom = origDenom
        numer = origNumer
        denom = origDenom
    }

    // possibly reduce fraction before moving on.
    // try to weed out non-repeating short fractions

    let tmpNumer = ("" + numer)
    let numerLen = tmpNumer.length 
    let numerExp = 0;
    let reducedNumer = numer;
    let reduceNumer = false;
    if (numerLen < 21) {
        numerExp = (21-numerLen);
        tmpNumer *= (10**numerExp);
        reduceNumer = true;
        //numer = tmpNumer
    }


    // reducedDenom is longest possible # of recurring decimal digits
    // lp = leading part
    let div = "" + (numer/denom)
    let maxNigits = 2*reducedDenom
    let expandNumer = "" + numer + "0".repeat(2*reducedDenom+30)
    let repLen = expandNumer.length;
    let lp = divideAndRemain(expandNumer,denom,maxNigits)
    let trimDiv 
    if (("" + div).length > 16) { // currently div contains a leading "0."
        trimDiv = ("" + div).slice(2,div.length-1) // trim '0.' and drop last, possibly rounded, digit
    } else {
        trimDiv = ("" + div).slice(2) // just remove the 0.
    }
    let result = []
    let dig;
    let err = false;
    let matchStr = []
    let repStr = lp.div;
    let found = false;
    let foundIdx = -1;
    let foundLength = 0;
    for (let i=0,j=0;i<repStr.length && j<trimDiv.length;j++) {
        if (repStr[i] == trimDiv[j]) {
            if(!found) {
                found = true
                foundIdx = j;
                foundLength = 1
                matchStr = []
            }
            matchStr[matchStr.length] = repStr[i]
            i++;
        } else {
            found = false
            foundIdx = -1;
            matchStr = [];
        }
    }

    let preMatch = trimDiv.slice(0,foundIdx)
    let matchedStr = matchStr.join("")
    let matchIndex = []
    let matchLen = 0;
    let repeatStr = "";
    let res = "";
    let head = "";

    if (matchedStr == "") {
        matchIndex[0] = -1
        matchIndex[1] = -1
    } else {
        matchIndex[0] = repStr.indexOf(matchedStr,0)
    }
    if (matchIndex[0] > -1) {
        matchIndex[1] = repStr.indexOf(matchedStr,matchIndex[0]+1)
        if (matchIndex[1] == -1) {
            preMatch += matchedStr[0]
            matchedStr = matchedStr.slice(1)
            matchIndex[0]++
        }
        while (matchIndex[1] == -1 && matchedStr.length) {
            matchIndex[1] = repStr.indexOf(matchedStr,matchIndex[0]+1)
            if (matchIndex[1] == -1) {
                preMatch += matchedStr[0]
                matchedStr = matchedStr.slice(1)
                matchIndex[0]++
            }
        }
    }

    nested:
    if (matchIndex[1] > matchIndex[0]) {
        matchLen = matchIndex[1] - matchIndex[0]
        repeatStr = repStr.substr(matchIndex[0],matchLen)
        if (repStr.length >= matchIndex[1] + matchLen) {
            for (let i = matchIndex[0],j=matchIndex[1];i<matchIndex[1];i++,j++) {
                if (repStr[i] == repStr[j]) {
                    continue
                }
                err = "match failed at repStr[" + i + "]=" + repStr[i] + ", repStr[" + j + "]=" + repStr[j];
                break nested
            }
        } else {
            err = "repStr.length=" + repStr.length + ", less than needed"
            break nested
        }
        let movedDigits = "";
        let movedCount = 0;
        for (let i=preMatch.length-1,j=repeatStr.length-1;i>=0;i--,j--) {
            if(preMatch[i] == repeatStr[j]) {
                movedDigits = preMatch[i] + movedDigits
                movedCount++
            } else {
                break
            }
        }
        if (movedCount) {
            preMatch = preMatch.slice(0,preMatch.length-movedCount)
            repeatStr = movedDigits + repeatStr.slice(0,repeatStr.length-movedCount)
        }
        head = intPart * resultSign
        let rs = ""
        if (resultSign == -1) {
            rs = "-"
        }

        res = rs + intPart + "." + preMatch + "(" + repeatStr + ")"
    } else {
        let dpIndex = div.indexOf(".")
        let divFract = ""
        if (dpIndex == -1 || div.split(".")[1].length < 15) { // 0. will be trimmed from front and trailing digit dropped
            if (dpIndex > -1) {
                divFract = div.split(".")[1];
                if (intPart != 0) {
                    div = (("" + intPart + "." + divFract) * resultSign) + ""
                } else {
                    div = ("" + (div * resultSign)) + ""
                }
            } else {
                divFract = "0"
                div = (intPart * resultSign) + ""
            }
            return {lp:{bn:{baseN:denom}},repLen:repLen,div:div,trimDiv:div,res:div,matchStr:divFract,err:"",preMatch:"",head:(intPart*resultSign),matchLen:0}
        }
    }
    return {lp:lp,div:trimDiv,trimDiv:trimDiv,repLen:repLen,res:res,matchStr:matchedStr,err:err,preMatch,head:head,matchLen:matchLen}
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