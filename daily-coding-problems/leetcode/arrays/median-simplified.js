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

var findMedianSortedArraysSimplified = function(nums1, nums2) {

    // Step 1: Find median cells of each array, this is a fixed
    // amount of info, given the length of each array, which we
    // must be assumed to possess.

    var len1 = nums1.length;
    var len2 = nums2.length;
    var len  = len1 + len2;

    // parseInt(3/2) = 1; parseInt((3-1)/2) = 1
    // parseInt(4/2) = 2; parseInt((4-1)/2) = 1 ✔
    var indexs1, indexs2;

    indexs1[0] = parseInt((len1-1)/2);
    indexs2[0] = parseInt((len2-1)/2);

    if (len1 % 2 == 0) indexs1[1] = indexs1[0]+1;
    if (len2 % 2 == 0) indexs2[1] = indexs2[0]+1;

    var median1, median2;
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
    var minmin,maxmax; sfLen , slLen, efLen, elLen;

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

}