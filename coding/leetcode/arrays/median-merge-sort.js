/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
if (false) {
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
}

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

var findMedianSortedArraysSimplifiedBroken = function(nums1, nums2) {

    var totalLength = nums1.length + nums2.length ;
    var medianFirstIndex = Math.floor((totalLength-1)/2);

    if (totalLength == 0) {
        return null
    }
    if (nums1.length == 0) {
        return median(nums2);
    } 
    else if (nums2.length == 0) {
        return median(nums1);
    }

    var i,j,index,value,prevValue;
    value = 0;
    prevValue = 0;
    val1 = nums1[0] + 0
    val2 = nums2[0] + 0

    for (i = 0, j = 0,index=0;index <= medianFirstIndex+1;) {

        if ((val1 != undefined) && val1 <= val2) {
            prevValue = value;
            value = val1;
            console.log('index = ' + index + ', nums1[' + i + '] =' + value + ', prevValue=' + prevValue)
            i++
            val1 = nums1[i] + 0
        } 
        else if ((val2 != undefined) && val2 <= val1) {
            prevValue = value;
            value = val2;
            console.log('index = ' + index + ', nums2[' + j + '] =' + value + ', prevValue=' + prevValue)
            j++
            val2 = nums2[j] + 0
        } 
        else {
            break;
        }

        index++
    }
    console.log('final index=' + index)
    if ((totalLength % 2) == 0) {
        return ((prevValue) + value)/2
    } else {
        return prevValue
    }
}



var findMedianSortedArraysSimplified = function(nums1, nums2) {

    var len1 = nums1.length;
    var len2 = nums2.length;
    var totalLength = len1 + len2;
    var medianFirstIndex = Math.floor((totalLength-1)/2);

    if (totalLength == 0) {
        return null
    }
    if (len1 == 0) {
        return median(nums2);
    } 
    else if (len2 == 0) {
        return median(nums1);
    }

    var i,j,index,value,prevValue;
    value = 0;
    prevValue = 0;
    val1 = nums1[0] + 0
    val2 = nums2[0] + 0

    for (i = 0, j = 0,index=0;index <= medianFirstIndex+1;) {

        if (((i < len1) && val1 <= val2)
            || ((val2 + 0 != val2) && (val1 + 0 == val1)))
        {
            prevValue = value;
            value = val1;
            console.log('index = ' + index + ', nums1[' + i + '] =' + value + ', prevValue=' + prevValue)
            i++
            val1 = nums1[i] + 0
        } 
        else if (((j < len2) && val2 <= val1)
            || ((val1 + 0 != val1) && (val2 + 0 == val2)))
        {
            prevValue = value;
            value = val2;
            console.log('index = ' + index + ', nums2[' + j + '] =' + value + ', prevValue=' + prevValue)
            j++
            val2 = nums2[j] + 0
        } 
        else {
            return null;
        }

        index++
    }
    console.log('final index=' + index)
    if ((totalLength % 2) == 0) {
        return ((prevValue) + value)/2
    } else {
        return prevValue
    }
}
