var shuffle = function(numItems,useItems) {
    let len,
        items,
        index;

    if (useItems) {
        len = useItems.length;
        items = useItems;
    } else {
        len = numItems;
        items = [];
        for (index=0;index<len;index++) {
            items[index] = index;
        }
    }
    for (let i=1,swapLow,swapHigh;i<len;i++) {
        index = getEqualWeightIndex(0,{min:0,max:i})
        if (items[index] == items[i]) {
            continue
        }
        swapLow = items[index];
        swapHigh = items[i];
        items[index] = swapHigh;
        items[i] = swapLow;
    }
    return items;
}
var shuffleSteps = function(numItems) {
    let len = numItems,
        items= [],
        index,
        steps = [];

    for (index=0;index<len;index++) {
        items[index] = index;
    }

    for (let i=1,swapLow,swapHigh;i<len;i++) {
        index = getEqualWeightIndex(0,{min:0,max:i});
        steps.push([i,index]);
        if (items[index] == items[i]) {
            continue
        }
        swapLow = items[index];
        swapHigh = items[i];
        items[index] = swapHigh;
        items[i] = swapLow;
    }
    return {final:items,steps:steps};
}

var sortIntegers = function (a,b) {
    let aInt = parseInt(a),
        bInt = parseInt(b);
    return (a<b?-1:(b<a?1:0))
}

//aa.sort((a,b) => { return (parseInt(a)<parseInt(b))?-1:(parseInt(b)<parseInt(a))?1:0 })

var followNumbers = function(groupSize,maxLongestPathPct=50) {
    let groupShuffle = shuffle(groupSize),
        groupStats = new Array(groupSize).fill(0),
        groupPathIds = new Array(groupSize).fill(0),
        pathsFound = ["",], // path[0] == "",
        pathId = pathsFound.length,
        maxPath = Math.floor(groupSize*maxLongestPathPct/100.0),
        result = "freedom";

    for (let id=0;id<groupSize;id++) {
        if (groupPathIds[id]) {
            continue
        }
        let foundIds = [],
            currentId = id,
            looks = 0,
            found;

        while (looks < groupSize) {
            found = groupShuffle[currentId];
            foundIds.push(found);
            groupPathIds[found] = pathId;
            looks++;
            if (found == id) {
                groupStats[id] = looks;
                pathsFound.push(foundIds.join("->"));
                pathId = pathsFound.length;
                if (foundIds.length > maxPath) {
                    result = "death";
                }
                break;
            } else {
                currentId = found;
            }
        }

    }
    return {ids:groupShuffle,stats:groupStats,gpids:groupPathIds,paths:pathsFound,result:result}
}
