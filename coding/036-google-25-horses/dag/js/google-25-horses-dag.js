
class Horse {
    static #idSequence = 0;
    id;
    #time = 0.0;
    stats; // flag to collect sorting stats
    statsData = [];
    config;
    followers = [];
    currentPlace = 0;

    constructor(config) {
        this.id = this.getId();
        this.setTime();
        if (config) {
            for (let [key,value] of Object.entries(config)) {
                this[key] = value;
            }
            this.config = config;
        }
    }

    getId() {
        if (!this.id) {
            ++Horse.#idSequence;
            this.id = `horse-${Horse.#idSequence}`;
        }
        return this.id;
    }
    setTime() {
        if (this.#time === 0.0) {
            this.#time = parseInt(Math.random()*10000)/100;
        }
    }
    getTime () {
        return this.#time;
    }
    addFollower(horse) {
        if (horse) {
            this.followers.unshift(horse);
        }
    }
    flattenHorses(flattened) {
        flattened.push(this);
        for (let i=0;i<this.followers.length;i++) {
            flattened = this.followers[i].flattenHorses(flattened);
        }
        this.followers = [];
        return flattened;
    }
    pruneFollowers(nextPlace,numPlaces) {
        let following = 0,
            follower;

        this.currentPlace = nextPlace;
        nextPlace++;

        for (let i=0;i<this.followers.length;i++) {
            follower = this.followers[i];
            following += follower.pruneFollowers(nextPlace,numPlaces);
        }
        if (nextPlace > numPlaces) {
            this.followers = [];
            following = 0;
        }
        return (1+following);
    }
    static timeDiff(a,b) {
        let aTime = a.#time,
            bTime = b.#time,
            diff  = parseInt((aTime - bTime)*100)/100;

        if (Math.abs(diff) < Number.EPSILON) {
            diff = 0;
        }
        //console.log(`aTime='${aTime}', bTime='${bTime}'`);
        if (a.stats) {
            a.statsData.push({p:"a",oid:b.id,time:aTime,amb:diff});
        }
        if (b.stats) {
            b.statsData.push({p:"b",oid:a.id,time:bTime,amb:diff});
        }
        return diff;
    }
    static cmpId(a,b) {
        let aid = parseInt(a.id.split("-")[1]),
            bid = parseInt(b.id.split("-")[1]);

        return aid<bid?-1:1;
    }
    static cmp(a,b) {
        let val = Horse.timeDiff(a,b);
        // note: in case of 0, return -1 if a.id < b.id
        return (val>0?1:val<0?-1:Horse.cmpId(a,b));
    }
}

class Heat {
    static #idSequence = 0;
    id;
    winner = null;
    horses;

    raced = false;

    constructor (horses) {
        this.horses = horses?horses:[];
        this.init();
    }
    init() {
        this.id = this.getId();
    }
    getId() {
        if (!this.id) {
            ++Heat.#idSequence;
            this.id = `heat-${Heat.#idSequence}`;
        }
        return this.id;
    }
    len() {
        return this.horses.length;
    }
    getWinner() {
        return this.race();
    }
    race() {
        if (this.raced === false) {
            this.horses.sort(Horse.cmp);
            for (let i=0,len=this.len()-1,horse;i<len;i++) {
                this.horses[i].addFollower(this.horses[i+1])
            }
            this.winner = this.horses[0];
            this.raced = true;
        }
        return this.winner;
    }
}

class Meet {
    static #idSequence = 0;
    id;
    numHorses;
    horses = [];
    maxHeat;
    heats = [];
    numPlaces;
    winners = [];
    fullHeats;
    partHeatSize;
    heatSizes = [];
    globalLinks = [];
    isFlattened = false;
    graphicsCallback = null;
    stats = false;
    statsData = [];
    nullCallback = ( meetObj => {console.log(meetObj.id)});

    constructor(numHorses,maxHeat,numPlaces,stats,graphicsCallback) {
        this.numHorses = numHorses?numHorses:0;
        this.maxHeat   = maxHeat?maxHeat:1;
        this.numPlaces = numPlaces?numPlaces:1;
        this.stats     = stats?stats:false;
        this.graphicsCallback = graphicsCallback?graphicsCallback:this.nullCallback;

        if (this.numPlaces > this.numHorses) {
            this.numPlaces = this.numHorses;
        }
        if (this.maxHeat > this.numHorses) {
            this.maxHeat = this.numHorses;
        }
        this.init();
    }
    init() {
        this.id = this.getId();
        let config = {stats:this.stats}
        for (let i=0, horse;i<this.numHorses;i++) {
            horse = new Horse(config)
            this.horses.push(horse);
            if (this.stats) {
                this.statsData.push({id:horse.id,data:horse.statsData})
            }
        }
    }
    getId() {
        if (!this.id) {
            ++Meet.#idSequence;
            this.id = `meet-${Meet.#idSequence}`;
        }
        return this.id;
    }
    raceFullHeats() {
        let horses,
            heat,
            winner;

        while (this.horses.length >= this.maxHeat) {
           horses = [];
           for (let j=0;j<this.maxHeat;j++) {
               horses.push(this.horses.shift());
           }
           heat = new Heat(horses);
           winner = heat.race();
           this.heats.push(heat);
           this.horses.push(winner);
        }
    }
    racePartHeat() {
        if (this.numPlaces == 0) {
            return;
        }

        if (this.horses.length > this.maxHeat) {
            this.raceFullHeats();
        }
        if (this.numHorses == 1 
            ||
            this.horses.length > 1
        ) {
            let horses = [],
                heat,
                winner;

            while(this.horses.length) {
                horses.push(this.horses.shift());
            }

            heat = new Heat(horses);
            winner = heat.race();
            this.heats.push(heat);
            this.horses.push(winner);

            if (this.horses.length > 1) {
                console.log(`strangeness this.horses.length=${this.horses.length}`);
                return;
            }
        }
        this.pruneFollowers()
    }
    flattenHorses() {
        let flattened = [];
        for (let i=0;i<this.horses.length;i++) {
            flattened = this.horses[i].flattenHorses(flattened);
        }
        return flattened;
    }
    pruneFollowers() {
        let nextPlace = this.winners.length+1,
            remainingPlaces = this.numPlaces-this.winners.length,
            totalHorses = 0;

        for (let i=0,horse,following;i<this.horses.length;i++) {
            horse = this.horses[i];
            following = horse.pruneFollowers(nextPlace,this.numPlaces);
            totalHorses += following;
        }
        if (this.horses.length == 1) {
            let onlyHorse = this.horses.shift();
            if (remainingPlaces > 0) {
                this.winners.push(onlyHorse);
                remainingPlaces--;
            }
            if (remainingPlaces > 0) {// was remainingPlaces>= 0
                if (this.isFlattened) { // final heat is in order, push remaining places
                    this.horses = onlyHorse.followers;
                    this.horses = this.flattenHorses();
                    while (this.winners.length < this.numPlaces && remainingPlaces > 0) {
                        this.winners.push(this.horses.shift());
                        remainingPlaces--;
                    }
                    return;
                }
                while (onlyHorse.followers.length > 0) {
                    this.horses.push(onlyHorse.followers.shift());
                }
                if (totalHorses-1 <= this.maxHeat) {
                    // place all remaining horses in final heat
                    this.horses = this.flattenHorses();
                    this.isFlattened = true;
                }
                if (this.heats.length == 1 && this.horses.length == remainingPlaces) {
                    while (this.horses.length > 0) {
                        this.winners.push(this.horses.shift());
                        remainingPlaces--;
                    }
                }
            }
        }
    }
    printResults() {

    }
    runMeet() {
        let maxRounds = this.numPlaces,
            rounds = 0;
        while (this.winners.length < this.numPlaces && rounds < maxRounds) {
            rounds++;
            this.racePartHeat();
        }
        console.log(`Horses:${this.numHorses}, maxHeat:${this.maxHeat}, numPlaces:${this.numPlaces}, Heats: ${this.heats.length}`);
        this.graphicsCallback(this);
        return this.winners;
    }
}


var animateHorseRace = function (meetObj) {
    let hHeight  = 60,
        hWidth   = 60,
        textLength = hWidth -3,
        textX    = (hWidth/2).toFixed(2),
        padding  = 15,
        halfPad  =  7.5,
        svgId    = `${meetObj.id}-svg`,
        parentId = `${meetObj.id}-parent`,
        numPlaces = meetObj.numPlaces,
        maxHeat  = meetObj.maxHeat,
        fullWidth = (numPlaces > maxHeat)?numPlaces:maxHeat,
        config = {
            height:(meetObj.heats.length + 1) * (hHeight + padding),
            width:fullWidth*(hWidth + padding),
            svgId:svgId,
            parentId:parentId,
        },
        parent = d3.select(`#${parentId}`).html(""),
        svgDoc = svgDraw(config);

        meetObj.heats.push(new Heat(meetObj.winners))
    let meetId = meetObj.id,
        meet   = svgDoc
                .append("g")
                .attr("id",meetId);

    for (let i=0,heat,heatGroup;i<meetObj.heats.length;i++) {
        heat = meetObj.heats[i];
        heatGroup = meet.append("g")
            .attr("id",heat.id)
            .attr("class","heat")
            .attr("x",padding)
            .attr("y",padding)
            .attr("transform",`translate(0,${i*(padding+hHeight)+halfPad})`);

        for (let j=0,horse,horseGroup;j<heat.len();j++) {
            horse = heat.horses[j];
            horseGroup = heatGroup
                .append("g")
                .attr("id",horse.id)
                .attr("transform",`translate(${j*(padding+hWidth)+halfPad},0)`);
            horseGroup.append("rect")
                .attr("height",hHeight)
                .attr("width",hWidth)
                .attr("class",`horse place-${j+1} place-${horse.currentPlace}`);
            horseGroup.append("text")
                .attr("class","horse-name")
                .attr("y",`${hHeight*3/8}`)
                .attr("lengthAdjust","spacingAndGlyphs")
                .attr("textLength",textLength)
                .attr("x",textX)
                .text(horse.id);
            horseGroup.append("text")
                .attr("class","horse-time")
                .attr("lengthAdjust","spacingAndGlyphs")
                .attr("textLength",textLength - 3)
                .attr("y",`${hHeight*7/8}`)
                .attr("x",textX)
                .text(horse.getTime().toFixed(2));
        }
    }

    return svgDoc;
}