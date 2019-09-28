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
        remain   = parseInt(fraction)
        digit    = valueMap[remain]
        binary   = binary + digit;
        fraction = (fraction-remain) * 2.0
        i++
    }

    return binaryInteger + "." + binary;
}

/* 
 * This code and the above code 
 * has been moved to /js/binary-hex-conversions.js
 * 
 

var floatToHex = function (float) { // pure fractions must start with 0.

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
        remain   = parseInt(fraction)
        digit    = valueMap[remain]
        binary   = binary + digit;
        fraction = (fraction-remain) * 2.0
        i++
    }

    return binaryInteger + "." + binary;
}

 *
 */

/*

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

