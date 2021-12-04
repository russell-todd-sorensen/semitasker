
// cheat a little this way:
var tenMillPlus = function (repeat,arr) {
    return new Array(repeat).fill(arr).flat();
}

function genIntegerList(len,min,max) {
    len = len?len:10;
    min = min?min:0;
    max = max?max:2**30;

    let range = max-min,
        list  = [];

    // Min Range value check
    if (range < Number.EPSILON) {
        console.log(`Error: min (${min}) and max (${max}) differ by less than Number.EPSILON (${Number.EPSILON})`);
        return [];
    }

    for (let i=0;i<len;i++) {
        list.push(min + parseInt(Math.random()*range));
    }
    return list;
}
// using splice seriously hurts performance
function genPairedArrayWithMarker(len,min,max,marker) {
        len = len?len:10;
        min = min?min:0;
        max = max?max:2**30;
        marker = marker?marker:(min + parseInt(Math.random*(max-min))),
        removeWhenDone = "removeWhenDone";

    let pArray   = [marker,removeWhenDone],
        pLen     = pArray.length,
        halfLen  = parseInt(Math.floor(len/2)),
        randList = genIntegerList(halfLen,min,max),
        item,
        spliceIdx1,
        spliceIdx2;

    while (randList.length > 0) {
        item = randList.pop();
        spliceIdx1 = parseInt(pArray.length*Math.random());
        pArray.splice(spliceIdx1,0,item);
        spliceIdx2 = parseInt(pArray.length*Math.random());
        pArray.splice(spliceIdx2,0,item);
    }
    pArray.pop(); //remove removeWhenDone
    return pArray;
}

function genIntegerList2(len,min,max) {
    len = len?len:10;
    min = min?min:0;
    max = max?max:2**30;

    let range = max-min+1,                  //Note: Math.random() never returns max, so add one;
        list  = new Array(len).fill(min-1);

    for (let i=0;i<len;i++) {
        list[i] = (min + parseInt(Math.random()*range));
    }
    return list;
}

// using splice seriously hurts performance

function genPairedArrayWithMarker2 (len,min,max,marker) {
        len = len?len:10;
        min = min?min:0;
        max = max?max:2**30;
        marker = marker?marker:(min + parseInt(Math.random*(max-min)));

    let removeWhenDone = "removeWhenDone",
        halfLen  = parseInt(Math.floor(len/2)),
        randList = genIntegerList2(halfLen,min,max),
        pArray = [randList,marker,new Array(halfLen).fill(min-1),removeWhenDone].flat(),
        item,
        returnObj = {randList:randList,marker:marker,pArray:null}

    // mix in marker with randList:
    let markerIdx = randList.length,
        swapIdx = parseInt(markerIdx*Math.random());
    item = pArray[markerIdx];
    pArray[markerIdx] = pArray[swapIdx];
    pArray[swapIdx] = item;
 

    for (let i=0,j=halfLen+1;i<halfLen;i++,j++) { 
        item = randList[i];
        swapIdx = parseInt(j*Math.random());
        pArray[j] = 0+pArray[swapIdx];
        pArray[swapIdx] = 0+item;
    }
    returnObj.pArray = pArray;
    pArray.pop(); //remove removeWhenDone
    //return pArray;
    return returnObj;
}

function genPairedArrayWithMarker3 (len,min,max,marker) {
    len    = Math.floor(len?len:10);
    min    = Math.floor(min?min:0);
    max    = Math.floor(max?max:2**30);
    marker = Math.floor(marker?marker:intInRange(min,max));

    let start = new Date().valueOf(),
        check = Math.floor(len/10);

    console.log(`${start} Start gen Paired array`);

    let halfLen   = Math.floor(len/2),
        randList  = genIntegerList3(halfLen,min,max),
        pArray    = [randList,marker,new Array(halfLen).fill(min-1)].flat(),
        returnObj = {randList:randList,marker:marker,pArray:null},
        markerIdx = randList.length,
        swapIdx   = indexInRange(0,markerIdx),
        item      = pArray[markerIdx];

    pArray[markerIdx] = pArray[swapIdx];
    pArray[swapIdx]   = item;

    console.log(`${new Date().valueOf() - start} Done generating ${halfLen} random ints.`)
    console.log(`genPairedArrayWithMarker3 len=${len} min=${min}, max=${max} marker=${marker}`);

    for (let i=0,j=halfLen+1;i<halfLen;i++,j++) { 
        item            = randList[i];
        swapIdx         = indexInRange(0,j);
        pArray[j]       = pArray[swapIdx];
        pArray[swapIdx] = item;
        if (i%check == 0) {
            console.log(`${new Date().valueOf() - start} Elapsed in ${i} iterations.`)
        }
    }
    returnObj.pArray = pArray;
    //return pArray;
    console.log(`${new Date().valueOf() - start} Total Elapsed.`)
    return returnObj;
}

// Test Math.random() distro over range [0,N)
// Speculate that  Math.round(N*Math.random()) 
// produces half as many 0's and N's as 
// 1 to N-1 entries.


function intInRangeOld(min,max) {
    
    let min1 = Math.floor(min),
        max1 = Math.floor(max),
        range1 = max1-min1,
        range2 = range1+1,
        randVal = Math.random();

    return [
        Math.floor(min1+1+range1*randVal),
        Math.floor(min1+range1*randVal),
        min1+Math.floor(range2*randVal),
        min1+1+Math.floor(range2*randVal),
    ];
    
}

function integerIndexTest(min,max) {

    min = Math.floor(min),
    max = Math.floor(max);

    let rand    = Math.random(),
        range   = max-min+1,
        index   = Math.floor(rand*range),
        integer = index+min;

    return [
        integer,
        index
    ];
}

function indexInRange(min,max) {

    min = Math.floor(min),
    max = Math.floor(max),
    range = max-min+1;
    return (Math.floor(Math.random()*range-min));
}

function intInRange(min,max) {
    min = Math.floor(min),
    max = Math.floor(max),
    range = max-min+1;

    return (Math.floor(Math.random()*range));
}

function genIntegerList3(len,min,max) {
    len = len?len:10;
    min = min?min:0;
    max = max?max:2**30;
    start = new Date().valueOf();
    check = Math.floor(len/10);

    let list  = new Array(len).fill(min-1);

    for (let i=0;i<len;i++) {
        if (i%check == 0) {
            console.log(`${new Date().valueOf() - start} elapsed creating ${i} random ints`)
        }
        list[i] = intInRange(min,max);
    }
    console.log(`${new Date().valueOf() - start} finished creating ${len} random ints`)
    return list;
}


function runRangeTest (num,min,max) {

    let numArr = [],
        size = (integerIndexTest(min,max)).length;

    for (let i=0;i<size;i++) {
        numArr[i] = [];
    }
    for (let i=0,result;i<num;i++) {
        result = integerIndexTest(min,max);
        for (let j=0;j<size;j++) {
            if (numArr[j][result[j]] ||
                numArr[j][result[j]] == 0) 
            {
                numArr[j][result[j]]++;
            } else {
                numArr[j][result[j]] = 1;
            }
        }
    }
    return numArr
}