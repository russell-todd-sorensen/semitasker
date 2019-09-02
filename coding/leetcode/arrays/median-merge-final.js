/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */

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
    console.log('***testMedian one=[' + one + '], two=[' + two + '], expect=' + expect);
    results.medianOne = median(one);
    results.medianTwo = median(two);

    results.medianOneTwo = findMedianSortedArraysLogged(one,two);
    results.medianTwoOne = findMedianSortedArraysLogged(two,one);

    results.orderEqual = (results.medianOneTwo == results.medianTwoOne);
    if (results.orderEqual) {
        results.median = results.medianOneTwo;
    } else {
        results.median = null;
    }
    
    results.oneEmpty = findMedianSortedArraysLogged([],two);
    results.twoEmpty = findMedianSortedArraysLogged(one,[]);

    results.oneEmptyEqualsMedianTwo = (results.oneEmpty == results.medianTwo);
    results.twoEmptyEqualsMedianOne = (results.twoEmpty == results.medianOne);

    results.medianEqualExpect = (results.medianOneTwo == expect);

    results.medianBetweenMedians = ( median != null &&
                                ( (results.medianOne <= results.median && results.medianTwo >= results.median)
                                || (results.medianOne >= results.median && results.medianTwo <= results.median) ) )

    return results;
}

var findMedianSortedArraysLogged = function(nums1, nums2) {

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

    for (i = 0, j = 0,index=0;index <= medianFirstIndex+1;index++) {

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
    }

    console.log('final index=' + index)
    if ((totalLength % 2) == 0) {
        return ((prevValue) + value)/2
    } else {
        return prevValue
    }
}

var findMedianSortedArrays = function(nums1, nums2) {

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

    for (i = 0, j = 0,index=0;index <= medianFirstIndex+1;index++) {

        if (((i < len1) && val1 <= val2)
            || ((val2 + 0 != val2) && (val1 + 0 == val1)))
        {
            prevValue = value;
            value = val1;
            i++
            val1 = nums1[i] + 0
        } 
        else if (((j < len2) && val2 <= val1)
            || ((val1 + 0 != val1) && (val2 + 0 == val2)))
        {
            prevValue = value;
            value = val2;
            j++
            val2 = nums2[j] + 0
        } 
        else {
            return null;
        }
    }

    if ((totalLength % 2) == 0) {
        return parseFloat(((prevValue) + value)/2.0)
    } else {
        return parseFloat(prevValue);
    }
}
