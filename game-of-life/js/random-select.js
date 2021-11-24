function getRangeIndex (list) {
    var r = Math.random();
    var pct = 0;
    var i = 0;

    while (i<list.length) {
        pct = pct + list[i];
        if (r<pct) break;
        i++;
    }
    //Log.Notice('r=' + r + ' pct=' + pct +  ' i=' + i );
    return i;
}

function runTest(list,iterations) {
    list = list?list:[.15,.35,.5];
    iterations = iterations?iterations:10000;

    let stats = new Array(list.length).fill(0);

    for (let i=0;i<iterations;i++) {
        stats[getRangeIndex(list)]++;
    }
    return stats;
} 


function randomSeed(percent,count) {
    let rStats = [0,0];
    for (let i = 0; i<count;i++) {
        rStats[(Math.random() <= percent ? 0 : 1)]++;
    }
    let list = [percent,1-percent];
    let stats = [0,0];
    for (let i=0;i<count;i++) {
        stats[getRangeIndex(list)]++;
    }
    return {rStats:rStats,stats:stats,count:count}
}