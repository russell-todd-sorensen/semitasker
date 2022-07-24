
var addressStats = function (inArray,slice) {
    let stats = new Map(),
        len   = inArray.length,
        i     = 0;

    for (let key;i<len-slice;i++) {
        key = inArray.slice(i,slice+i).join("");
        if (!stats.get(key)) {
            stats.set(key,1);
        } else {
            stats.set(key,(stats.get(key)+1));
        }
    }
    return stats;
}

var addressStatsFromString = function (inArray,slice) {
    let stats = new Map(),
        len   = inArray.length,
        i     = 0;

    for (let key;i<len-slice;i++) {
        key = inArray.slice(i,slice+i);
        if (!stats.get(key)) { // change to stats.has(key)
            stats.set(key,1);
        } else {
            stats.set(key,(stats.get(key)+1));
        }
    }
    return stats;
}

var addressStatsIntKeys = function (inArray,slice) {
    let stats = new Map(),
        len   = inArray.length,
        i     = 0;

    for (let key;i<len-slice;i++) {
        key = parseInt(inArray.slice(i,slice+i).join(""));
        if (!stats.get(key)) {
            stats.set(key,1);
        } else {
            stats.set(key,(stats.get(key)+1));
        }
    }
    return stats;
}

var sortStatsByKey = function(m) {
    for (let [key,val] of m.keys()) {

    }
}

// returns index of cumulative precentage of range of random value
var getRangeIndex = function (probabilityList) {
    let r = Math.random(),
        len = probabilityList.length,
        pct = 0.0,
        i = 0;

    while (i<len) {
        pct = pct + probabilityList[i];
        if (r-pct<Number.EPSILON) break;
        i++;
    }
    return i;
}

var getEqualWeightIndex = function(divisions=0,minmax={min:0,max:0}) {
    let min = parseInt(minmax.min),
        max = parseInt(minmax.max),
        scale;

    if (divisions) {
        min = 0;
        max = parseInt(divisions);
    }
    scale = (max-min+1);
    return Math.floor(Math.random()*scale+min);
}