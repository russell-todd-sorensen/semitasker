
// cheat a little this way:
var tenMillPlus = function (repeat,arr) {
    return new Array(repeat).fill(arr).flat();
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