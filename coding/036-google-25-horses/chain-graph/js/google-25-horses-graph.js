
class Horse {
    static #idSequence = 0;
    id;
    #time = 0.0;
    stats = [];
    followers = [];
    currentPlace = 0;

    constructor() {
        this.id = this.getId();
        this.setTime();
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
            diff  = aTime - bTime;

        if (Math.abs(diff) < Number.EPSILON) {
            diff = 0;
        }
        console.log(`aTime='${aTime}', bTime='${bTime}'`);
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
    isFlattened = false;
    graphicsCallback = null;
    nullCallback = ( meetObj => {console.log(meetObj.id)});

    constructor(numHorses,maxHeat,numPlaces,graphicsCallback) {
        this.numHorses = numHorses?numHorses:25;
        this.maxHeat   = maxHeat?maxHeat:5;
        this.numPlaces = numPlaces?numPlaces:3;
        this.graphicsCallback = graphicsCallback?graphicsCallback:this.nullCallback;

        if (this.numPlaces > this.numHorses) {
            this.numPlaces = this.numHorses;
        }
        this.init();
    }
    init() {
        this.id = this.getId();
        for (let i=0;i<this.numHorses;i++) {
            this.horses.push(new Horse());
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
        if (this.horses.length >= this.maxHeat) {
            this.raceFullHeats();
        }
        if (this.horses.length > 1) {
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
            horse,
            totalHorses = 0;

        for (let i=0,following;i<this.horses.length;i++) {
            horse = this.horses[i];
            following = horse.pruneFollowers(nextPlace,this.numPlaces);
            totalHorses += following;
        }
        if (this.horses.length == 1) {
            if (remainingPlaces > 0) {
                this.winners.push(this.horses.shift());
                remainingPlaces--;
            }
            if (remainingPlaces > 0) {// was remainingPlaces>= 0
                if (this.isFlattened) { // final heat is in order, push remaining places
                    while (this.winners.length < this.numPlaces && remainingPlaces > 0) {
                        this.winners.push(horse.followers.shift());
                        remainingPlaces--;
                    }
                    return;
                }
                while (horse.followers.length > 0) {
                    this.horses.push(horse.followers.shift());
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

