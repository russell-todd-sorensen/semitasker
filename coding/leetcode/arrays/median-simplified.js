/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var fudge = 1 ;// this affects how quickly a solution is found
              ;// but might cause the answer to be wrong!
              ;// 1 works, 0 is slower, 2 does not work.

var arr1, arr2, arr3; // arr3 is the expected return array
var answer;           // the decimal median value
var oneArray;         // used for brute force and display
var eg;
var steps;
var result;           // trace results
var points = [];

var median = function(arr) {
    var val1, val2, medianValue
    var len = arr.length

    if (len == 0) {
        return null;
    }

    var medianIndex1 = parseInt((len - 1)/2);
    val1 = arr[medianIndex1]
    if (len % 2 == 0) {
        val2 = arr[medianIndex1+1]
        medianValue = parseFloat((val1+val2)/2)
    } else {
        medianValue = parseFloat(val1)
    }
    return medianValue
}

var testMedian = function (one,two,expect) {

    var results = {}

    results.medianOne = median(one);
    results.medianTwo = median(two);

    results.medianOneTwo = findMedianSortedArraysSimplified(one,two);
    results.medianTwoOne = findMedianSortedArraysSimplified(two,one);

    results.orderEqual = (results.medianOneTwo == results.medianTwoOne);
    if (results.orderEqual) {
        results.median = results.medianOneTwo;
    } else {
        results.median = null;
    }
    
    results.oneEmpty = findMedianSortedArraysSimplified([],two);
    results.twoEmpty = findMedianSortedArraysSimplified(one,[]);

    results.oneEmptyEqualsMedianTwo = (results.oneEmpty == results.medianTwo);
    results.twoEmptyEqualsMedianOne = (results.twoEmpty == results.medianOne);

    results.medianEqualExpect = (results.medianOneTwo == expect);

    results.medianBetweenMedians = ( median != null &&
                                ( (results.medianOne <= results.median && results.medianTwo >= results.median)
                                || (results.medianOne >= results.median && results.medianTwo <= results.median) ) )

    return results;
}

var findMedianSortedArraysSimplified = function(nums1, nums2) {

  
    // Step 1: Find median cells of each array, this is a fixed
    // amount of info, given the length of each array, which we
    // must be assumed to possess.

    var len1 = nums1.length;
    var len2 = nums2.length;
    var len  = len1 + len2;

    // Step 1.5: Make sure both arrays have at least one element.
    if (len == 0) {
        return null
    }
    else if (len1 == 0) {
        return median(nums2);
    } 
    else if (len2 == 0) {
        return median(nums1);
    } 

    // parseInt(3/2) = 1; parseInt((3-1)/2) = 1
    // parseInt(4/2) = 2; parseInt((4-1)/2) = 1 ✔
    var indexs1 = new Array();
    var indexs2 = new Array();

    indexs1[0] = parseInt((len1-1)/2);
    indexs2[0] = parseInt((len2-1)/2);

    if (len1 % 2 == 0) indexs1[1] = indexs1[0]+1;
    if (len2 % 2 == 0) indexs2[1] = indexs2[0]+1;

    var median1 = new Array();
    var median2 = new Array();
    var medval1, medval2;
    var max1, max2, min1, min2;

    median1[0] = nums1[indexs1[0]]
    median2[0] = nums2[indexs2[0]]

    min1 = max1 = medval1 = median1[0];
    min2 = max2 = medval2 = median2[0];

    if (indexs1[1]) {
        median1[1] = nums1[indexs1[1]];
        medval1    = (medval1 + median1[1])/2;
        max1       = median1[1];
    }

    if (indexs2[1]) {
        median2[1] = nums2[indexs2[1]]
        medval2    = (medval2 + median2[1])/2;
        max2       = median2[1];
    }

    var minValue = min1 < min2 ? min1 : min2;
    var maxValue = max1 > max2 ? max1 : max2;
    var arrayWithMinMedian = min1 < min2 ? nums1 : nums2;
    var arrayWithMaxMedian = max1 > max2 ? nums1 : nums2;

    // bail point 
    if (minValue == maxValue) return minValue;

    var maxArray    = max1 > max2         ? nums1 : nums2;
    var minArray    = maxArray === nums1  ? nums2 : nums1;
    var longArray   = len1 > len2         ? nums1 : nums2;
    var shrtArray   = longArray === nums1 ? nums2 : nums1;

    var minLen      = minArray.length
    var maxLen      = maxArray.length
    var longLen     = longArray.length
    var shrtLen     = shrtArray.length

    // minmin * * * minValue * * maxValue * * * * maxmax
    var startsFrst, startsLast, endsFrst, endsLast;
    var minmin,maxmax, sfLen, slLen, efLen, elLen;

    if (minArray[0] < maxArray[0]) {
        startsFrst  = minArray
        startsLast  = maxArray
        minmin      = minArray[0]
        sfLen       = minLen;
        slLen       = maxLen;
    } else {
        startsFrst  = maxArray
        startsLast  = minArray
        minmin      = maxArray[0]
        sfLen       = maxLen;
        slLen       = minLen;
    }

    if (minArray[minLen-1] < maxArray[maxLen-1]) {
        endsFrst = minArray
        endsLast = maxArray
        maxmax   = maxArray[maxLen-1]
        efLen    = minLen;
        elLen    = maxLen;
    } else {
        endsFrst = maxArray
        endsLast = minArray
        maxmax   = minArray[minLen-1]
        efLen    = maxLen;
        elLen    = minLen;
    }

    // check for overlap.
    var overlapP = startsFrst[sfLen-1] >= startsLast[0] ? true : false;

    var medianIndex1 = parseInt((len-1)/2);
    var FirstMedianElement, SecondMedianElement
    if (overlapP == false) {
        if ((sfLen - 1) >= medianIndex1) {
            FirstMedianElement = startsFrst[medianIndex1]
            if (len % 2 == 0) {
                if ((sfLen - 1) >= medianIndex1+1) {
                    SecondMedianElement = startsFrst[medianIndex1+1]
                } else {
                    SecondMedianElement = startsLast[0]
                }
                return median([FirstMedianElement,SecondMedianElement])
            } else {
                return FirstMedianElement
            }
        } else {
            FirstMedianElement = startsLast[medianIndex1-sfLen]
            if (len % 2 == 0) {
                SecondMedianElement = startsLast[medianIndex1-sfLen+1]
                return median([FirstMedianElement,SecondMedianElement])
            } else {
                return FirstMedianElement
            }
        }
    }

    // The arrays overlap

    // do they completely overlap? like (a1,a5) ?
    if (startsFrst == endsLast) {
        if (startsFrst == arrayWithMinMedian) {
            // Find where maxValue is in startsFrst
            //var maxIndexInMinArray = sortInto(startsLast,maxValue);
        }
    }

    return "Unfinished"
}


// minOrMax is passed as third arg = -1, 0 or 1
var sortIntoOld = function(arr, value) {
    var minOrMax = 0;

    if (arguments.length > 2) {
        minOrMax = arguments[2];
    } 

    var len = arr.length;
    var notFound = true;
    var index = parseInt((len-1)/2);
    var previousIndex = index;
    var exactMatch = false;
    var firstValue = arr[index];

    var diff, max, min, count;
    max = len -1;
    min = 0;
    count = 0;

    if (value <= arr[0]) return 0;
    if (value >= arr[len-1]) return len;

    while (notFound) {
        diff = value - arr[index];
        previousIndex = index;
        count++
        if (diff == 0) {
            exactMatch = true;
            notFound = false;
            break;
        }
        else if (diff > 0) {
            min = index
            index = parseInt(max - (max-min)/2);
        }
        else {
            max = index
            index = parseInt(min + (max-min)/2)
        }
        if (count > len/2) break;
        if ((previousIndex - index) == 0) {
            index = index + 1;
            break;
        }
    }
    return {idx:index,prev:previousIndex,diff:(index-previousIndex), count:count};
}

var sortInto = function(arr, value) {
    return sortIntoEx(arr,value,0,cmpFloat);
}

var sortIntoEx = function(arr, value, minOrMax, compareFn) {

    var len = arr.length;
    var notFound = true;
    var index = parseInt((len-1)/2);
    var previousIndex = index;
    var exactMatch = false;
    var firstValue = arr[index];

    var diff, max, min, count;
    max = len -1;
    min = 0;
    count = 0;

    if (compareFn(value, arr[0]) < 0) return 0;
    if (compareFn(value, arr[len-1]) > 0) return len;

    while (notFound) {
        diff = compareFn(value, arr[index]);
        previousIndex = index;
        count++
        if (diff == 0) {
            exactMatch = true;
            notFound = false;
            break;
        }
        else if (diff == 1) {
            min = index
            index = parseInt(max - (max-min)/2);
        }
        else {
            max = index
            index = parseInt(min + (max-min)/2)
        }
        if (count > len/2) break;
        if ((previousIndex - index) == 0) {
            index = index + 1;
            break;
        }
    }
    return {idx:index,prev:previousIndex,diff:diff, count:count};
}

function cmpInt(a,b) {
    a = parseInt(a)
    b = parseInt(b)
    return (a>b?1:b>a?-1:0)
}

function cmpFloat(a,b) {
    a = parseFloat(a)
    b = parseFloat(b)
    return (a>b?1:b>a?-1:0)
}

function cmpGeneric(a,b) {
    return (a>b?1:b>a?-1:0)
}

// minOrMax is passed as third arg = -1, 0 or 1
var sortIntoMinMax = function(arr, value, minOrMax,compareFn) {
 
    var len = arr.length;
    var notFound = true;
    var index = parseInt((len-1)/2);
    var previousIndex = index;
    var exactMatch = false;
    var firstValue = arr[index];

    var diff, max, min, count;
    max = len -1;
    min = 0;
    count = 0;

    if (value <= arr[0]) {
        if (value == arr[0]) {
            for (var i = 1; i < max;i++) {
                if (arr[i] != value) return {idx:i,previousIndex:0,diff:0,count:(index+1)}
            }
        } else {
            return {idx:0,previousIndex:0,diff:0,count:1}
        }
    }
    if (value >= arr[len-1]) return len;

    while (notFound) {
        diff = value - arr[index];
        previousIndex = index;
        count++
        if (diff == 0) {
            exactMatch = true;
            notFound = false;
            break;
        }
        else if (diff > 0) {
            min = index
            index = parseInt(max - (max-min)/2);
        }
        else {
            max = index
            index = parseInt(min + (max-min)/2)
        }
        if (count > len/2) break;
        if ((previousIndex - index) == 0) {
            index = index + 1;
            break;
        }
    }
    return {idx:index,prev:previousIndex,diff:(index-previousIndex), count:count};
}


var a1 = [0,1,2,3,4]
var a2 = [5,6,7,8,9]
var a3 = [10,11,12,13,14]
var a4 = [3,4,5,6,7]
var a5 = [1,2,3]
var a0 =  [0,1,2,3,4, 5, 6, 7, 8, 9,10]
var a00 = [0,2,4,6,8,10,12,14,16,18,20]
var s0 = [1,2]
var s1 = ['a','b','c','d','e']
var allResults = [
    testMedian(a1,a4,3.5),
    testMedian(a1,a2,4.5),
    testMedian(a1,a3,7),
    testMedian(a2,a3,9.5),
    testMedian([1],[2],1.5),
    testMedian([1,2],[3],2.0),
    testMedian([1],[],1.0),
    testMedian([],[],null),
    testMedian(a1,a5,2),
];