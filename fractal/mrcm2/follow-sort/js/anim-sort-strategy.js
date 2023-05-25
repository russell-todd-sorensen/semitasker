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

    for (let i=0,swapLow,swapHigh;i<len;i++) { // i was 1
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

var shuffleRange = function(numItems,start=0) {
    let len = numItems,
        items= [],
        index,
        steps = [];

    for (index=start;index<len+start;index++) {
        items[index] = index;
    }

    for (let i=start,swapLow,swapHigh;i<len+start;i++) { // i was 1
        index = getEqualWeightIndex(0,{min:start,max:start+i});
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
    return (aInt<bInt?-1:(bInt<aInt?1:0));
}

//aa.sort((a,b) => { return (parseInt(a)<parseInt(b))?-1:(parseInt(b)<parseInt(a))?1:0 })

// followSort sorts a set of items in O(N) time and space,
// but requires items to contain the sorted index.
// examples of sets includes a deck of cards with fixed suit order.
class SortableItem {
    value = null;
    index = null;
    constructor (value,index) {
        this.value = value;
        this.index = index;
    }
    get value() {
        return this.value;
    }
    get index() {
        return this.index;
    }
}
class SortableSet {
    #items = [];
    #lambda;

    constructor (items, lambda) {
        this.#items = items;
        this.#lambda = lambda;
    }
    get len() {
        return this.#items.length;
    }
    compare(a,b) {
        return this.#lambda(a,b);
    }
    itemIndex(a) {
        return a.index;
    }
    itemValue(a) {
        return a.value;
    }
    getItem(itemsIndex) {
        return this.#items[itemsIndex];
    }
    getItemSortedIndex(itemsIndex) {
        return this.#items[itemsIndex].index;
    }
    destructiveSort(ss) {
        return ss.#items.sort(ss.#lambda);
    }
}

var followSort = function(shuffled) {
    let singles = shuffled.filter(((x,i) => (x==i)?true:false)),
        len = shuffled.length,
        chains = singles.map((x) => ([x])),
        chain = [],
        moves = [],
        found = chains.length,
        lastI = null,
        cId = null,
        nId = null,
        cVal = null,
        nVal = null;

    for (let i=0;i<len;i++) {
        lastI = i;
        cId = i;
        cVal = shuffled[cId];
        nId = cVal;
        nVal = shuffled[nId];
        chain = [];
        while(cId != cVal && nId != nVal) {
            moves.push([cId,nId]);
            chain.push(cId);
            shuffled[nId] = cVal;
            cId = nId;
            cVal = nVal;
            nId = cVal;
            nVal = shuffled[nId];
        }
        if (chain.length>0) {
            //moves.pop();
            found += chain.length -1;
            chains.push(chain);
            if (found >= len) {
              //  break;
            }
        }
    }
    return {shuffled:shuffled,singles:singles,moves:moves,chains:chains,lastI:lastI};
}

var followSortSwaps = function(shuffled) {

    let copy = shuffled.filter(((x) => (true))),
        len = copy.unshift(0),
        chains = [],
        found = copy.map(((x,i) => ((x)==i)?(chains.push([i])/chains.length):0)),
        chain = [],
        moves = [],
        lastI = null,
        cId = null,
        nId = null,
        cVal = null,
        nVal = null;
        console.log(`copy = ${copy}`);
        console.log(`cId=${cId}, cVal=${cVal}, nId=${nId}, nVal=${nVal}`);
    for (let i=1;i<len;i++) {
        if (found[i]>0) {
            continue;
        }
        lastI = i;
        cId = i;
        cVal = copy[cId];
        nId = 0;
        nVal = 0;
        chain = [];
        moves.push([cId,nId]);
        chain.push(cId);
        copy[0] = cVal;
        copy[cId] = 0;
        cId = nId;
        cVal = copy[cId];
        nId = cVal;
        nVal = copy[nId];
        console.log(`cId=${cId},  cVal=${cVal}, nId=${nId}, nVal=${nVal}`);
        while(cId != cVal && nId != nVal) {
            moves.push([cId,nId]);
            chain.push(cId);
            copy[nId] = cVal;
            cId = nId;
            cVal = nVal;
            nId = cVal;
            nVal = copy[nId];

            console.log(`cId=${cId},  cVal=${cVal}, nId=${nId}, nVal=${nVal}`);
        }
        if (chain.length>0) {
            for (let i=0;i<chain.length;i++) {
                found[chain[i]] = 1
            }
            //moves.pop();
            //found += chain.length -1;
            chains.push(chain);
            if (found >= len) {
               // break;
               console.log(`Would break if working lastI=${lastI}`);
            }
        }
    }
    return {copy:copy,moves:moves,chains:chains,lastI:lastI};
}

function sortableSet1() {
    let items = [];
    items.push(new SortableItem(5,5));
    items.push(new SortableItem(4,4));
    items.push(new SortableItem(3,3));
    items.push(new SortableItem(2,2));
    items.push(new SortableItem(1,1));
    items.push(new SortableItem(0,0));

    return new SortableSet(items,(a,b)=>((a.value<b.value)?-1:(b.value<a.value)?1:0));
}


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
            continue;
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
