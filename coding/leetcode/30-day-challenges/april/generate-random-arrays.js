
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