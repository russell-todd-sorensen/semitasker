
var getBoundingBoxPair = function(from,to) {
    let fromItem = document.getElementById(from),
        toItem   = document.getElementById(to),
        fromData = fromItem.getBoundingClientRect(),
        toData   = toItem.getBoundingClientRect(),
        delta    = {
            x:-1*(toData.left - fromData.left),
            y:-1*(toData.top  - fromData.top),
        },
        deltaMinus = {
            x:-1*delta.x,
            y:-1*delta.y,
        },
        fromMid = {
            x:fromData.x - fromData.left + fromData.width/2,
            y:fromData.y -fromData.top + fromData.height/2,
        },
        toMid = {
            x:toData.x - fromData.left + toData.width/2,
            y:toData.y - fromData.top + toData.height/2,
        },
        midDelta = {
            dx:toMid.x - fromMid.x,
            dy:toMid.y - fromMid.y,
        },
        x1 = (fromMid.x).toFixed(3),
        y1 = (fromMid.y).toFixed(3),
        x2 = (toMid.x).toFixed(3),
        y2 = (toMid.y).toFixed(3),
        path=`M${x1}, ${y1} C${x2} ${y1} ${x1} ${y2} ${x2} ${y2}`;
    return {
        fromData:fromData,
        toData:toData,
        delta:delta,
        deltaMinus:deltaMinus,
        fromMid:fromMid,
        toMid:toMid,
        midDelta:midDelta,
        path:path,
        x1:x1,
        y1:y1,
        x2:x2,
        y2:y2,
    };
}

//Note: SVG animates from (0,0), not (50%,50%) as above for CSS
var getBoundingBoxPairSVG = function(from,to) {
    let fromItem = document.getElementById(from),
        toItem   = document.getElementById(to),
        fromData = fromItem.getBoundingClientRect(),
        toData   = toItem.getBoundingClientRect(),
        delta    = {
            x:-1*(toData.left - fromData.left),
            y:-1*(toData.top  - fromData.top),
        },
        deltaMinus = {
            x:-1*delta.x,
            y:-1*delta.y,
        },
        fromMid = {
            x:fromData.x - fromData.left,
            y:fromData.y -fromData.top,
        },
        toMid = {
            x:toData.x - fromData.left,
            y:toData.y - fromData.top,
        },
        midDelta = {
            dx:toMid.x - fromMid.x,
            dy:toMid.y - fromMid.y,
        },
        x1 = (fromMid.x).toFixed(3),
        y1 = (fromMid.y).toFixed(3),
        x2 = (toMid.x).toFixed(3),
        y2 = (toMid.y).toFixed(3),
        path=`M${x1}, ${y1} C${x2} ${y1} ${x1} ${y2} ${x2} ${y2}`;
    return {
        fromItem:fromItem,
        toItem:toItem,
        fromData:fromData,
        toData:toData,
        delta:delta,
        deltaMinus:deltaMinus,
        fromMid:fromMid,
        toMid:toMid,
        midDelta:midDelta,
        path:path,
        x1:x1,
        y1:y1,
        x2:x2,
        y2:y2,
    };
}
