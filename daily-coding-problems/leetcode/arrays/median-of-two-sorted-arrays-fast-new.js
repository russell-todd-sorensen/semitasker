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

var findMedianSortedArrays = function(nums1, nums2) {
    var flen, slen;
    var first, secnd;
    //compare first item in each array
    var min, max;
    var order = [];
    if (nums1[0] <= nums2[0]) {
        first = nums1;
        secnd = nums2;
    } else {
        first = nums2;
        secnd = nums1;
    }

    flen = first.length
    slen = secnd.length


    // median index calculation
    var type = 0;
    var m1 = 0;
    var m2 = 0;
    m1 = parseInt((flen+slen)/2)
    if ((flen+slen) % 2 == 0) m2 = m1+1;

    var p1,p2,p3,p4;
    p1 = {in:first, idx: 0, val: first[0]}

    if (secnd[0] >= first[flen-1]) {
        type = 1;
        p2 = {in:first, idx: flen-1,      val: first[flen-1]}
        p3 = {in:secnd, idx: flen,        val: secnd[0]}
        p4 = {in:secnd, idx: flen+slen-1, val: secnd[slen-1]}
    } else {
        p2 = {in:secnd, idx: "unknown", val: secnd[0]}

        if (secnd[slen-1] > first[flen-1]) {
            type = 2;
            p3 = {in:first, idx: "unknown", val: first[flen-1]}
            p4 = {in:secnd, idx: flen+slen-1, val: secnd[slen-1]}
        } else {
            type = 3;
            p3 = {in:secnd, idx: "unknown", val: secnd[slen-1]}
            p4 = {in:first, idx: flen+slen-1, val: first[flen-1]}
        }
    }

    var descr;
    switch (type) {
    case 1:
        descr = "Arrays do not overlap";
        break;
    case 2:
        descr = "First Array ends in second array";
        break;
    case 3:
        descr = "Second Array is entirely in first array";
        break;
    default:
        descr = "Unknown type='" + type + "'";
        break;
    }

    console.log("Example='" + eg + "' Type='" + type + "' descr='" + descr + "'");
    // right now just workin on fully overlapping case 2
    if (type != 2) {
        return
    }

    var firstMidIndex = parseInt((flen-1)/2);
    var priorInFirst  = firstMidIndex;
    var priorInSecond = 0;
    var elementsPrior = priorInFirst + priorInSecond;
    var medianIndex   = new Array();
    var steps = 1; // indexes looked at to find median elements

    medianIndex[0] = parseInt((flen+slen-1)/2);
    if ((flen+slen) % 2 == 0) {
        medianIndex[1] = medianIndex[0]+1;
    }

    // find where this would fit in secnd.
    var result = new Array()
    rIndex = 0
    var min = 0
    var max = slen-1
    var stepIndex = firstMidIndex; // stepIndex will be used in loop
    var fcValue = first[stepIndex]; // value at middle first array
    var nextIncrement = 0
    var indexString;
    while (true && steps < 1000000) {
        result[rIndex] = findPositionAndCountSteps(secnd,min,max,fcValue);
        priorInSecond  = result[rIndex].pos + result[rIndex].compare;
        priorInFirst   = stepIndex;
        elementsPrior  = priorInFirst + priorInSecond;
        steps += result[rIndex].count;
        
        nextIncrement = parseInt((medianIndex[0] - elementsPrior + fudge)/2);
        //nextIncrement = (medianIndex[0] - elementsPrior);
        if (nextIncrement > 0) {
            stepIndex = stepIndex + (nextIncrement);
            if (stepIndex > flen-1) {
                stepIndex = flen-1
            }
            fcValue = first[stepIndex]
            min = result[rIndex].min;
            max = slen-1;
            rIndex++;
            continue;
        }
        if ((nextIncrement) < 0) {
            stepIndex = stepIndex + (nextIncrement);
            if (stepIndex < 0) {
                stepIndex = 0
            }
            fcValue = first[stepIndex]
            min = result[rIndex].min;
            max = slen-1;
            rIndex++;
            continue;            
        }
        if ((nextIncrement) == 0) {
            // I think this is the ideal case?
            if (result[rIndex].compare == 1) {
                var snd = secnd[result[rIndex].pos+1]
                var fst = first[stepIndex]
                var sub = snd<fst?snd:fst;
                medianIndex[0] = sub // removed +1
                indexString = "length='" + (slen+flen) + "' compare=1 index='" + (result[rIndex].pos+1+stepIndex) 
                    + "' to '" + (result[rIndex].pos+1+stepIndex+1)  
                    + "' secnd[" 
                    + (result[rIndex].pos+1) + "]='" 
                    + medianIndex[0] +  "'";
                if (medianIndex[1]) {
                    medianIndex[1] = first[stepIndex] // removed +1
                    indexString = indexString + " first[" 
                        + (stepIndex+1) + "]='" 
                        + medianIndex[1] + "'";
                } 
            } 
            else if (result[rIndex].compare == -1) {

                medianIndex[0] = secnd[result[rIndex].pos]
                indexString = "length='" + (slen+flen) + "' compare=-1**, secnd[" 
                    + (result[rIndex].pos) + "]='" 
                    + medianIndex[0] +  "'";
                if (medianIndex[1]) {
                    medianIndex[1] = fcValue
                }
            }
            else {
                var shortSeries = "";
                medianIndex[0] = fcValue;
                    indexString = "length='" + (slen+flen) + "' compare=0 first[" 
                        + stepIndex + "]='" 
                        + medianIndex[0] + "'";
                shortSeries = "first[" + (stepIndex-1) + "]='" 
                    + first[stepIndex-1] + "' ... first[" + (stepIndex+1) + "]=" 
                    + first[stepIndex+1] + " ok ... ";
                if (medianIndex[1]) {
                    // select smallest of followers
                    var fst = first[stepIndex+1];
                    var snd = secnd[result[rIndex].pos];
                    //var snd2 = secnd[result[rIndex].pos+1];
                    steps += 2;
                    if (snd <= fst) {
                        medianIndex[1] = snd;
                        indexString = indexString + " secnd[" 
                            + (result[rIndex].pos+1) + "]='" 
                            + medianIndex[1] +  "'";
                    } else {
                        medianIndex[1] = fst;
                        indexString = indexString + " first[" 
                            + (stepIndex+1) + "]='" 
                            + medianIndex[1] +  "'";
                    }
                    shortSeries = shortSeries + 
                    "  secnd[" + (result[rIndex].pos) + "]=" + (secnd[result[rIndex].pos])
                     + " secnd[" + (result[rIndex].pos+1) + "]=" + (secnd[result[rIndex].pos+1])
                     +  "  Idxs = '" + (stepIndex-1+result[rIndex].pos) + "' to '" 
                     + (stepIndex+1+result[rIndex].pos+1) + "' ok."
                }
                console.log("ShortSeries=" + shortSeries);
            }
            console.log("medianIndex='" + medianIndex + "'" )
            console.log(indexString + " steps='" + steps + "'");
            return medianIndex
        }
    }

};

function findPositionAndCountSteps(arr, min, max, value) {
    var result = {count:0, min:min, max:max, pos:parseInt((max-min)/2), diff:(max-min), compare:null}
    var foundVal;
    while (result.diff > 0) {
        result.count++;
        foundVal = arr[result.pos]
        if (foundVal == value) {
            result.compare = 0;
            return result;
        }
        if (result.diff == 1) {
            if (foundVal > value) {
                //result.pos--;
                result.compare = -1;
            } else if ( foundVal < value) {
                //result.pos++;
                result.compare = 1;
            }
            return result;
        }
        if (foundVal > value) {
            result.max = result.pos
            result.diff = result.max - result.min
            result.pos = result.max - parseInt(result.diff/2)
            continue
        }
        if (foundVal < value) {
            result.min = result.pos
            result.diff = result.max-result.min;
            result.pos = parseInt(result.diff/2)+result.min
            continue
        }
    }
}

function pickExample (choice) {
    switch (choice) {
    case 1:
        arr1 = [1, 2];
        arr2 = [3, 4];
        answer = (2 + 3)/2;
        break;
    case 2:
        arr1 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
        arr2 = [7,10,12,13,19,22,23,40,43,50];
        answer = (13 + 13)/2;
        break;
    case 3: 
        arr1 = [1, 3];
        arr2 = [2];
        answer = 2.0;
        break;
    case 4:
        arr1 = [1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20];
        arr2 = [7,10,12,13,19,22,23,40,43,50];
        answer = 13;
        break;
    case 5:
        arr1 = [1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20];
        arr2 = [8,10,12,13,19,22,23,40,43,50];
        arr3 = [13];
        answer = 13;
        break;
    case 6:
        arr1 = [1,2,2,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20];
        arr2 = [8,10,12,13,19,22,23,40,43,50];
        arr3 = [12]
        answer = 12;
        break;
    case 7:
        arr1 = [1,2,2,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20];
        arr2 = [7,10,12,13,19,22,23,40,43,50];
        arr3 = [12];
        answer = 13;
        break;
    case 8:
        arr1 = [1,2,2,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19,20];
        arr2 = [2,7,10,12,13,19,22,23,40,43,50];
        arr3 = [12,12]
        answer = 12;
        break;
    case 9:
        arr1 = [2,4,6,8,10,12];
        arr2 = [1,3,5,7,9,11];
        arr3 = [6,7];
        answer = 6.5;
        break;
    case 10: 
        arr1 = [1,2,3,4,5,6];
        arr2 = [3,4,5,6,7,8,9];
        arr3 = [5];
        answer = 5.0;
        break;
    case 11:
        arr1 = [1,2,3,3,3,3,4,5,6];
        arr2 = [2,3,7];
        arr3 = [3,3];
        break;
    case 12:
        arr1 = [0,1,1,1,1,2]
        arr2 = [1,1,2,2,2,2,3];
        break;
    case 13:
        arr1 = new Array();
        for (var i = 10;i<2000;i++) {
            arr1.push(i);
        }
        arr1.sort(cmpInt);
        arr2 = new Array();
        for (var j = 200;j<5000;j+=2) {
            arr2.push(j);
        }
        arr2.sort(cmpInt);
        arr3 = [1536,1536];
        fudge = 1;
        break;

    case 14:
        arr1 = new Array();
        for (var i = 10;i<2000;i++) {
            arr1.push(i);
        }
        arr1.sort(cmpInt);
        arr2 = new Array();
        for (var j = 200;j<5000;j+=2) {
            arr2.push(j);
        }
        arr2.push(190,192.197,198);
        arr2.sort(cmpInt);
        arr3 = [1535];
        fudge = 1;
        break;
    case 15:
        arr1 = new Array();
        for (var i = 500;i<50000;i+=9) {
            arr1.push(i);
        }
        arr1.sort(cmpInt);
        arr2 = new Array();
        for (var j= 230;j<49500;j+=7) {
            arr2.push(j);
        }
        arr2.sort(cmpInt);
        arr3 = [];
        fudge = 1;
        break;
    case 16:
        arr1 = new Array();
        for (var i = 500;i<50000;i+=9) {
            arr1.push(i);
        }
        arr1.sort(cmpInt);
        arr2 = new Array();
        for (var j= 40000;j<109500;j+=7) {
            arr2.push(j);
        }
        arr2.sort(cmpInt);
        arr3 = [];
        fudge = 1;
        break;
    case 17:
        arr1 = [1,5,7,20]
        arr2 = [2,6,32]
        fudge = 1;
        arr3  = [];
        break;
    }
    eg = choice;
}

function cmpInt(a,b) {
    a = parseInt(a)
    b = parseInt(b)
    return (a>b?1:b>a?-1:0)
}


var bruteForceMedianValue = function(nums1,nums2) {
    var oneArray = new Array();
    var i,j
    console.log("arr1='" + nums1 + "'");
    console.log("arr2='" + nums2 + "'");
    for (i = 0;i < nums1.length;i++) {
        oneArray.push(nums1[i])
    }
    for (j = 0;j<nums2.length;j++) {
        oneArray.push(nums2[j]);
    }
    oneArray = oneArray.sort(cmpInt);

    var medIndex = parseInt((i + j - 1)/2);
    var medValue1
    var medValue0 = oneArray[medIndex]
    var medString = "medIndex[0]='" + medIndex + "' value='" + medValue0 + "' "
    if ((i+j)%2 == 0) {
        medIndex++
        medValue1 = oneArray[medIndex]
        medValue = (medValue0 + medValue1)/2;
        medString = medString + "medIndex[1]='" + medIndex + "' value='" + medValue1 + "' Median value='" + medValue + "'"
    } else {
        medValue = medValue0;
    }
    console.log(oneArray)
    console.log(medString)
    return parseFloat(medValue)
}

var objectSort = function (obj1, obj2) {
    var diff = obj1.val - obj2.val;
    return (diff > 0 ?           1 :
            diff < 0 ?          -1 :
            obj1.id > obj2.id ?  1 :
            obj2.id > obj1.id ? -1 :
                                 0 );
}

var boxArrayItems = function (arr, idTag) {
    var arrOut = new Array();
    for (var i = 0; i<arr.length;i++) {
        arrOut[i] = {val:arr[i], id:idTag}
    }
    return arrOut
}

var combineArraysGatherStats = function (nums1, nums2) {
    var flen, slen;
    var first, secnd;
    var long, short;
    //compare first item in each array
    var min, max;
    var order = [];
    if (nums1[0] <= nums2[0]) {
        first = nums1;
        secnd = nums2;
    } else {
        first = nums2;
        secnd = nums1;
    }

    flen = first.length;
    slen = secnd.length;

    if (flen >= slen) {
        long  = first;
        short = secnd;
    } else {
        short = first;
        long  = secnd;
    }

    var result = new Array();
    var j = 0;
    var newObj;
    for (i in first) {
        newObj = {val:first[i], idTag:1, idx:j}
        result[j++] = newObj;
    }
    for (i in secnd) {
        newObj = {val:secnd[i], idTag:2, idx:j}
        result[j++] = newObj;
    }

    return result.sort(objectSort);
}


var magic = function (nums1, nums2) {
    var len1 = nums1.length;
    var len2 = nums2.length;
    var even, oneIsEven, twoIsEven;
    var combinedLen = len1 + len2;
    var oneCandidates = [];
    var twoCandidates = [];
    even = (combinedLen % 2) == 0 ? true : false;
    oneIsEven = (len1 % 2) == 0 ? true : false;
    twoIsEven = (len2 % 2) == 0 ? true : false;

    var firstIdx,secndIdx;
    // pick candidates
    var candidates = []
    if (oneIsEven) {
        firstIdx = parseInt((len1-1)/2);
        secndIdx = firstIdx+1;
        oneCandidates = [nums1[firstIdx],nums1[secndIdx]]
    } else {
        firstIdx = parseInt((len1-1)/2);
        oneCandidates = [nums1[firstIdx]];
    }
    if (twoIsEven) {
        firstIdx = parseInt((len2-1)/2);
        secndIdx = firstIdx+1;
        twoCandidates = [nums2[firstIdx],nums2[secndIdx]]
    } else {
        firstIdx = parseInt((len2-1)/2);
        twoCandidates = [nums2[firstIdx]];
    }

    var candidates = oneCandidates
    for (var i = 0;i<twoCandidates.length; i++) {
        candidates[candidates.length] = twoCandidates[i];
    }

    return candidates;
    

}