
function convertToBinHex(asciiField, binaryField, hexField) {
    var binary = "";
    var hex = "";
    var decimal = "";
    var ascii = $('#' + asciiField).val();
    ascii = ascii.trim();
    var char;
    var decCode;
    for (var i = 0; i<ascii.length; i++) {
        char = ascii[i];
        code = char.charCodeAt();

        Log.Notice("char='" + char + "', code='" + code + "'");
        if (code == 32) {
            decCode = " ";
            hexCode = " ";
            binCode = "< >";
        } else {
            decCode = code;
            hexCode = toHex(code) ;
            binCode = "<" + toBinary(hexCode.charAt(0)) + toBinary(hexCode.charAt(1)) + ">";
        }
        decimal = decimal + "<" + decCode + ">";
        hex = hex + "<" +  hexCode + ">";
        binary += binCode;
    }

    $('#' + binaryField).val(binary.trim());
    $('#' + hexField).val(hex.trim());

}

function toHex(decimalNumber) {
    hexChars = "0123456789ABCDEF";
    if (decimalNumber > 255) {
        return "??";
    }

    var i = decimalNumber %16;
    var j = (decimalNumber - i)/16;

    return hexChars.charAt(j) + hexChars.charAt(i);
}

function toDecimal(hexNumber) {
    hexChars = "0123456789ABCDEF";
    if (decimalNumber > 255) {
        return "??";
    }
    var i = decimalNumber %16;
    var j = (decimalNumber - i)/16;

    return hexChars.charAt(j) + hexChars.charAt(i);
}

function toBinary(hexNumber) {
    switch (hexNumber) {
    case '?':
        return " ";
    case '0':
        return '0000';
    case '1':
        return '0001';
    case '2':
        return '0010';
    case '3':
        return '0011';
    case '4':
        return '0100';
    case '5':
        return '0101';
    case '6':
        return '0110';
    case '7':
        return '0111';
    case '8':
        return '1000';
    case '9':
        return '1001';
    case 'A':
        return '1010';
    case 'B':
        return '1011';
    case 'C':
        return '1100';
    case 'D':
        return '1101';
    case 'E':
        return '1110';
    case 'F':
        return '1111';
    }
}

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

var decimalToBinaryA = function(decimal) {

    let valueMap  = ['a','A']
    let binary = "";
    let i = 0;
    let remain = 0;
    let digit;
    while (decimal > 0 && i < 100) {
        remain  = decimal % 2
        digit   = valueMap[remain]
        binary  = digit + binary;
        decimal = (decimal-remain)/2
        i++
    }

    return binary;
}


var floatToBinaryA = function (float) { // pure fractions must start with 0.

    let decimalParts = ("" + float).split(".");
    let binaryInteger = decimalToBinaryA(decimalParts[0])
    if (decimalParts.length == 1) {
        decimalParts[1] = 0
        return binaryInteger
    }
    let fraction = parseFloat("." + decimalParts[1]) * 2.0
    let valueMap  = ['a','A']
    let binary = "";
    let i = 0;
    let remain = 0;
    let digit;
    while (fraction > 0 && i < 8) {
        remain   = Math.trunc(fraction)
        digit    = valueMap[remain]
        binary   = binary + digit;
        fraction = (fraction-remain) * 2.0
        i++
    }

    return binaryInteger + "." + binary;
}


var decimalToHexString = function(decimal) {

    let valueMap   = "0123456789ABCDEF".split("");
    let hexString  = "";
    let i = 0;
    let remain = 0;
    let hexCode;
    while (decimal > 0 && i < 100) {
        remain     = decimal % 16
        hexCode    = valueMap[remain]
        hexString  = hexCode + hexString;
        decimal    = (decimal-remain)/16
        i++
    }
    if (hexString == "") hexString = "0"
    return hexString;
}

var floatToHexString = function (float) { // pure fractions must start with 0.

    let decimalParts = ("" + float).split(".");
    let hexInteger = decimalToHexString(decimalParts[0])
    if (decimalParts.length == 1) {
        decimalParts[1] = 0
        return hexInteger
    }
    let fraction = parseFloat("." + decimalParts[1]) * 16.0;
    let valueMap   = "0123456789ABCDEF".split("");
    let hexString = "";
    let i = 0;
    let remain = 0;
    let hexCode;
    while (fraction > 0 && i < 8) {
        remain      = Math.trunc(fraction)
        hexCode     = valueMap[remain]
        hexString   = hexString + hexCode;
        fraction = (fraction-remain) * 16.0
        i++
    }

    if (hexString == "") hexString = "0"

    return hexInteger + "." + hexString;
}


var decimalToBaseNString = function (decimal,baseN) {

    if (baseN < 2) { 
        return null;
    }
    let valueMap   = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let baseNString  = "";
    let i = 0;
    let remain = 0;
    let baseNCode;
    while (decimal > 0 && i < 100) {
        remain         = decimal % baseN
        baseNCode      = valueMap[remain]
        baseNString    = baseNCode + baseNString;
        decimal        = (decimal-remain)/baseN
        i++
    }
    if (baseNString == "") baseNString = "0"
    return baseNString;
}


// This function divides each array item by base
// and returns the result as an equal length or 
// shorter array and the final remainder
var divArr = function(strArr,base) {
    
    let baseN = (base||16)
    let len = strArr.length
    let res = []
    let rem = 0
    let numi,num,div,len2,begin= 0;
    for (let i=0;i<len;i++) {
        numi = "" + strArr[i]
        len2 = numi.length
        num  = "" + rem + numi
        rem  = num % baseN
        div  = "" + (num-rem)/baseN
        if (div.length < len2 && begin) {
            div = "0".repeat(len2 - div.length) + div
        }
        if (div > 0 || begin) {
            res.push("" + div)
            begin = 1
        }
    }
    return {res:res,rem:rem}
}

var decToBaseN = function (decStr,base,max) {

    let baseN = (base || 16)
    if (baseN < 2) { 
        return null;
    }

    let maxlen = (max||4)
    if (maxlen < 1) maxlen = 1
    if (maxlen > 31) maxlen = 31

    let vMap   = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let bnStr  = "";
    let beg = 0;
    let end = maxlen;
    let len = ("" + decStr).length
    let vCode;
    let strArr = []
    while (len - beg >= 1) {
        strArr.push(decStr.slice(beg,end))
        beg += maxlen
        end += maxlen
    }
    while (strArr.length > 0) {
        div      = divArr(strArr,baseN)
        strArr   = div.res
        vCode    = vMap[div.rem]
        bnStr = vCode + bnStr;
    }
    if (bnStr == "") bnStr = "0"
    return bnStr;
}


var BaseNConversion = function (fractionList,baseN) {
    this.valueMap = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    this.fractionList = fractionList;
    this.base = baseN;
    this.length = fractionList.length;
    this.fractionInts = [];
    this.currentMultiple = [];
    this.iterations = 0;
    this.returnValue = null;
    this.itemsToInt = function () {
        let val;
        for (let i=0;i<this.length;i++) {
            val = Math.trunc(this.fractionList[i]);
            this.fractionInts[i] = val;
            this.currentMultiple[i] = val;
        }
    };
    this.iterate = function () { // iterate produces one Nigit
        let tmp = [0]; // space for overflow
        let m = this.currentMultiple
        let base = this.base
        let multiplier = base
        for (i=0;i<m.length;i++) {
            tmp[i+1] = m[i] * multiplier;
        }
        let next,curr,remain, reversed = [];
        let returnValue;
        for (j=tmp.length-1;j>=0;j--) {
            curr = tmp[j]
            if (curr >= baseN) {
                remain = tmp[j] % 10
                tmp[j] = remain
                if (j > 0) {
                    tmp[j-1] += Math.trunc((curr - remain)/10)
                } 
            } 
            reversed[reversed.length] = tmp[j]
        }
        this.currentMultiple = [];
        let found = false;
        tmp = [];
        this.returnValue = reversed.pop()
        for (var k=0;k<reversed.length;k++) {
            if (found == false && reversed[k] == 0) {
                continue;
            }
            found = true;
            tmp.push(reversed[k])
        }
        this.currentMultiple = tmp.reverse();
        console.log(this.currentMultiple)
        this.length = this.currentMultiple.length;
        return this.returnValue
    };
    this.result = null;
    this.convertFraction = function(len) {
        let length;
        if (len) {
            length = len
        } else {
            length = this.length
        }
        let result = ""
        let i = 0
        while (this.currentMultiple.length && (i < length)) {
            result += this.valueMap[this.iterate()] 
            i++
        }
        this.result = result;
        return result;
    }
    this.itemsToInt();
    return this;
}

var floatToBaseNString = function (float,baseN,totalDigits,fractionDigits) { // pure fractions must start with 0.

    if (baseN < 2) {
        return null;
    }
    let defaultMaxFractionDigits = 8;
    let decimalParts = ("" + float).split("."); // this means the input was an integer
    let baseNIntString = decimalToBaseNString(decimalParts[0],baseN)
    let baseNIntLen = baseNIntString.length
    if (decimalParts.length == 1 || ((totalDigits > 0) 
        && baseNIntLen >= totalDigits)) 
    {
        let intArray = baseNIntString.split("")
        baseNIntString = ""
        for (let j = 0;j< baseNIntLen;j++) {
            if (j < totalDigits) {
                baseNIntString += intArray[j]
            } else {
                baseNIntString += "0"
            }
        }
        return baseNIntString
    } else
    if (fractionDigits || fractionDigits == 0) {
        return baseNIntString
    }

    let maxReturnDigits = 20;
    if (fractionDigits || fractionDigits == 0) {
        maxReturnDigits = (
            (fractionDigits < (totalDigits - baseNIntLen))
                ? fractionDigits 
                : (totalDigits - baseNIntLen)
        )
    }

    let fractionList = decimalParts[1].split("");
    let fractObj = new BaseNConversion(fractionList,baseN);
    let baseNFractString = fractObj.convertFraction(maxReturnDigits)

    return baseNIntString + "." + baseNFractString;
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

