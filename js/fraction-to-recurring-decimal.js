
var separateWholeAndFraction = function(numer, denom) {
    let wholePart = 0;

    while (numer >= denom) {
        wholePart += 1
        numer -= denom
    }
    return {w:wholePart,n:numer,d:denom}
}

var reduceFraction2 = function (numer, denom) {

    let numerObj = factorInteger(numer)
    let denomObj = factorInteger(denom)

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

var fractionToRecurringDecimalBroken = function (numer,denom,doNotReduce) {

    let numerSign = (numer < 0 ? -1 : 1)
    let denomSign = (denom < 0 ? -1 : 1)
    let resultSign = numerSign * denomSign;
    denom *= denomSign;
    numer *= numerSign;

    let origNumer = numer;
    let origDenom = denom;

    // Remove value over 1.0 to give fraction 0.xxxx
    let intPart = 0
    let decimalParts = separateWholeAndFraction(numer,denom);
    intPart = decimalParts.w
    denom = decimalParts.d
    numer = decimalParts.n

   // reduce denom
    //let denomFactors = factorInteger(denom);
    //let numerFactors = factorInteger(numer);
    let reduc = reduceFraction2(numer,denom);
//$$$$$$$$$$$$$$$$$$***************** Stopped Here
    denomFactors.factors = reduc.df
    numerFactors.factors = reduc.nf
    numer /= reduc.rp;
    denom /= reduc.rp;
}



// following code will work on almost all input, but is incorrect
// and will eventually fail. All failures are due to using built in
// javascript division 
// one example failure is the following fraction:
// 12953/50284
// This gives the result: 0.25759684989261
// The trailing digit here is 1, but this is rounded from:
// 0.2575968498926099 I predict that any reliance on floating point
// calculations will eventually have a case that can't be handled.

var fractionToRecurringDecimalBroken = function (numer,denom,doNotReduce) {

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
        let ddddd = 1; // just used to pause during testing
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