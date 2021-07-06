
var horses = [];
var heats = [];
var rankings = [];

class Horse {
    id;
    #time = 0.0;
    stats = [];

    constructor(id) {
        this.id = id;
        this.setTime();
    }

    setTime() {
        if (this.#time === 0.0) {
            this.#time = parseInt(Math.random()*10000)/100;
        }
    }

    static cmp(a,b) {
        let aTime = a.#time,
            bTime = b.#time;

        console.log(`aTime='${aTime}', bTime='${bTime}'`);
        return (aTime - bTime);
    }
    static cmp2(a,b) {
        let val = Horse.cmp(a,b);
        return (val>0?1:val<0?-1:0);
    }
}

class Heat {
    name;
    horses = new Array();
    results = [];
    idToPlace = new Map();
    raced = false;

    constructor(name,horseIds,refs) {
        this.name = name;
        if (refs) {
            for (let i=0;i<refs.length;i++) {
                this.horses[i] = refs[i];
            }
        } else {
            for (let i=0;i<horseIds.length;i++) {
                this.horses[i] = new Horse(horseIds[i]);
            }
        }
    }
    race() {
        if (this.raced === false) {
            this.horses.sort(Horse.cmp2);
            for (let i=0,id;i<this.horses.length;i++) {
                id = this.horses[i].id;
                this.results[i] = id;
                this.idToPlace.set(id,i);
                this.horses[i].stats.push({heatName:this.name,placed:i});
            }
            this.raced = true;
        }
        return this.results;
    }
    getHorseByPlace(n) {
        return this.horses[n];
    }
    getIdByPlace(n) {
        return this.horses[n].id;
    }
    getHorseById(id) {
        return this.horses[this.idToPlace.get(id)];
    }
}

/*
    Terms to (maybe) use: 
        "Also Ran": horses finishing outside 1,2,3,4.
        "Meeting": collection of races 
            conducted by a club on the same day or 
            night forms a "race meeting".
        "Listed Race"
            A "stakes race" just below a 
        "group race" or 
        "graded race" in quality.

*/

class Meeting {

    heats = [];
    horses = [];
    rankings = [];
    results = [];
    heatNameToIdx = new Map();
    numHorses;
    maxHeat;
    topPlaces;
    minHeats;
    balance;
    horsesInHeat;

    constructor(numHorses,maxHeat,topPlaces) {
        this.numHorses = numHorses?numHorses:25;
        this.maxHeat = maxHeat?maxHeat:5;
        this.topPlaces = topPlaces?topPlaces:3;
        this.minHeats = Math.ceil(this.numHorses / this.maxHeat);
        this.balance = (this.numHorses % this.maxHeat);
        this.calcHeatDistribution();
    }
    calcHeatDistribution() {
        switch (this.balance) {
        case 0: 
            this.horsesInHeat = new Array(this.minHeats).fill(this.maxHeat);
            break;
        default:
            this.horsesInHeat = new Array(this.minHeats-2).fill(this.maxHeat);
            let half = Math.ceil((this.maxHeat+this.balance)/2),
                last = this.maxHeat + this.balance - half;
            this.horsesInHeat.push(half);
            this.horsesInHeat.push(last);
        }
        return this.horsesInHeat;
    }
    populateHeats() {
        let len = this.horsesInHeat.length,
            start = 1;

        for (let i=0,name,num,ids;i<len;i++) {
            name = `Race${i}`;
            num = this.horsesInHeat[i];
            ids = this.genIdArray(num,start);
            this.heats.push(new Heat(name,ids));
            this.heatNameToIdx.set(name,this.heats.length-1);
            start += num;
        }
    }
    populateRunoffHeat(arr,path,idx) {
        arr = arr?arr:"heats";
        let ref = this[arr],
            max = this.maxHeat,
            len = ref.length<=max?ref.length:max,
            horseRefs = [],
            heatName = `Race${this.heats.length}`;
        
        for (let i=0,heat,horse;i<len;i++) {
            heat = ref[i];
            horse = heat[path][idx];
            horseRefs.push(heat[path][idx]);
            console.log(`heat ${heat.name} path=${path} index=${idx} horse=${horse.id}`)
        }
        this.heats.push(new Heat(heatName,null,horseRefs));
        this.heatNameToIdx.set(heatName,this.heats.length-1);
    }
    genIdArray(numHorses,startNum) {
        let ha = [];
        for (let i=startNum;i<(startNum+numHorses);i++) {
            ha.push(`H${i}`);
        }
        return ha;
    }
    raceHeat(n) {
        this.heats[n].race();
    }
    raceUnracedHeats() {
        let len = this.heats.length,
            heat;

        for (let i=0;i<len;i++) {
            heat = this.heats[i];
            if (!heat.raced) {
                this.results.push({
                    num:i,
                    name:heat.name,
                    result:heat.race()
                });
            }
        }
    }


}

class HorseRaceAnimate {
    meeting;
    mainDivId ="horseRaces";
    numHorses = 0;
    maxHeat = 0;
    topPlaces = 0;
    main;
    heats;
    numHeats;
    heatHandles= [];

    constructor(meeting,numHorses,maxHeat,topPlaces) {
        if (!(meeting)) {
            numHorses = numHorses?numHorses:0;
            maxHeat = maxHeat?maxHeat:0;
            topPlaces = topPlaces?topPlaces:0;
            this.meeting = meeting?meeting:new Meeting(numHorses,maxHeat,topPlaces);
        }
        this.numHorses = this.meeting.numHorses;
        this.maxHeat = this.meeting.maxHeat;
        this.topPlaces = this.meeting.topPlaces;
    }

    drawHeats() {
        this.heats = this.meeting.heats;
        this.numHeats = this.heats.length;
        this.main = d3.select(`#${this.mainDivId}`);
        this.heatIds = [];
        let heatData,
            numHorses,
            heatElement;

        for (let i=0;i<this.numHeats;i++) {
            heatData = this.heats[i];
            numHorses = heatData.horses.length;
            heatElement = this.main.append("div")
                .attr("id",heatData.name)
                .attr("class","heat");
            this.heatHandles.push(heatElement);
            heatElement.selectAll("div")
                .data(heatData.horses)
                .enter()
                .append("div")
                .attr("id",function(d,i) {
                    return d.id;
                })
                .attr("class","square")
                .append("span")
                .attr("class","horse")
                .text(function(d,i) {
                    return d.id;
                });
        }
    }
    applyHeatResults(placed,absPos,hide) {
        let len = this.heats.length;
        placed  = placed?placed:false;
        absPos  = absPos?absPos:false;
        hide    = hide?hide:false;

        for (let i=0,heat,idsToPlace,hlen,name;i<len;i++) {
            heat = this.heats[i];
            idsToPlace = heat.idToPlace;
            hlen = idsToPlace.length;
            for (let [id,place] of idsToPlace.entries()) {
                this.main.select(`#${id}`).classed(`p${place+1}`,placed);
                this.main.select(`#${id}`).classed("absPos",absPos);
                this.main.select(`#${id}`).classed("hide",hide);
            }
        }
    }
    applyWinnersHeatResults(heatIndex,htClass,pClass,absPos,hide) {
        htClass = htClass?true:false;
        pClass  = pClass?true:false;
        absPos  = absPos?true:false;
        hide    = hide?true:false;
        let horses = this.heats[heatIndex].horses,
            len = horses.length,
            horse,
            id,
            heatId,
            place;
            
        for (let i=0,horse;i<len;i++) {
            horse = horses[i];
            id = horse.id;
            heatId = horse.stats[0].heatName;
            place = i+1;
            this.main.select(`#${heatId}`)
                .classed(`ht${place}`,htClass)
                .classed("hide",hide)
                .classed("absPos",absPos);
            
            this.main.select(`#${id}`).classed(`ht${place}`,pClass);
            if (place <= this.topPlaces) {
                let heatIdx = this.meeting.heatNameToIdx.get(heatId);
                this.reclassShowPlaceHorses(heatIdx,true);
            }

        }
    }
    reclassShowPlaceHorses(heatIndex,pClass) {
        pClass = pClass?true:false;
        let horses = this.heats[heatIndex].horses,
            base   = horses[0].stats,
            placed = (base[base.length-1].placed + 1);

        if (placed == 1) {
            return;
        }
        let place, horse, id;
        for (let i=1;i<horses.length;i++) {
            place = placed+i;
            horse = horses[i];
            id    = horse.id;
            this.main.select(`#${id}`).classed(`p${place}`,pClass);
        }

    }
}

var simulate = function(hr,placed,absPos,hide) {
    hr.meeting.raceUnracedHeats();
    hr.applyHeatResults(placed?placed:false,absPos?absPos:false,hide?hide:false);
}
var simulateWinnersHeat = function(hr,htClass,pClass,absPos,hide) {
    htClass = htClass?true:false;
    pClass  = pClass?true:false;
    absPos  = absPos?true:false;
    hide    = hide?true:false;
    let heatIndex = hr.meeting.results.length;
    hr.meeting.populateRunoffHeat("heats","horses",0);
    hr.meeting.raceUnracedHeats();
    hr.applyWinnersHeatResults(heatIndex,htClass,pClass,absPos,hide);
}


