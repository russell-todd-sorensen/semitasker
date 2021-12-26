
var animationIndex = 0;
var continueAnimation = true;

class RandomSelect {
    svg;
    defs;
    main;
    bg;
    hueDiff;
    hueStart =    0;
    top      =    0;
    numItems =   10;
    infinity = 1000;
    yOffset  =    0;
    xOffset  =   20;
    timeout  =   1000; // milliseconds
    width    = this.infinity;
    height   =   50;
    gWidth   = this.width+this.xOffset;
    gHeight  = this.width+this.xOffset;
    xAxis    = this.gHeight;
    yAxis    = this.xOffset;
    animationIndex = 0;
    continueAnimation = false;
    stats = {};

    constructor (config,svgId,numItems,infinity) {
        this.id      = config.id?config.id:"anim-2";
        this.config  = config?config:{};
        this.svgId   = svgId?svgId:
                        config.svgId?config.svgId:
                        "svg1";
        this.numItems = numItems?numItems:
                        config.numItems?config.numItems:
                        10;
        this.infinity = infinity?infinity:
                        config.infinity?config.infinity:
                        1000;
        this.width   = this.infinity;
        this.svg     = config.svg?config.svg:
                        d3.select(`#${this.svgId}`);
        this.defs    = this.svg.select("defs");
        this.main    = this.svg.select("#main")
        this.bg      = this.main.select("#bg");
        this.height  = config.height?config.height:50;
        this.hueDiff = Math.floor(360/(this.numItems+1));
        this.gWidth  = this.width+this.xOffset;
        this.gHeight = this.height+this.yOffset;

        this.main
            .attr("transform",`translate(${this.xOffset},${this.yOffset})`);
        this.bg
            .attr("height",this.gHeight)
            .attr("width", this.gWidth);

        this.getNextType = this.nextType(this.numItems,this.infinity);
        this.initialSort = this.getNextType.next().value;
        this.initialMap  = this.initialSort.m
        for (let i of this.initialMap.keys()) {
            let type = this.initialMap.get(i);
            this.defs
                .append("rect")
                .attr("id",`rect-type-${type}`)
                .attr("class",`C-${type}`)
                .attr("fill",`hsl(${type*this.hueDiff},80%,50%)`)
                .attr("stroke-width",0)
                .attr("height",`${Math.floor(this.height)}`)
                .attr("width",0.75);

            this.draw(i,type);
        }
        this.animationIndex = this.numItems;
    }
    draw(index,type) { 
        this.main
            .append("use")
            .attr("id",`ltype-${type}`)
            .attr("class",`U-${type}`)
            .attr("href",`#rect-type-${type}`)
            .attr("x",`${index}`)
            .attr("y",`${this.top}`);
    }
    start() {
        this.continueAnimation = true;
    }
    stop() {
        this.continueAnimation = false;
    }
    oneStep() {
        let nextType = this.getNextType.next().value;
        if (isNaN(nextType) || nextType == -1) {
            this.continueAnimation = false;
        } else {
            this.draw(this.animationIndex,nextType);
            this.animationIndex++;
            this.timeout = Math.max(5,Math.floor(10000/this.infinity))
        }
        return {
            continueAnimation:this.continueAnimation,
            timeout:this.timeout,
        };
    }
    animate() {
        this.continueAnimation = true;
        schedFunc.call(this,this.oneStep,1000,true,this)
    }
    *nextType (sampleSize,spaceSize) {

        let m    = new Map(),
            idx  = 0,
            type = 0,
            tmpt = 0,
            ridx = 0,
            hits = []; // by definition 0 is always chosen in first iteration

        for (;idx<sampleSize;type++,idx++) {
            m.set(idx,type);
            hits[type] = [idx];
            ridx = Math.floor((type+1)*Math.random());
            tmpt = m.get(ridx);
            if (tmpt == type) {
                continue
            } else {
                m.set(idx,tmpt);
                m.set(ridx,type);
                hits[type].push(ridx);
                hits[tmpt].push(idx);
            }
        }

        // stats is the initial randomized ordering of "types"
        this.stats = {m:m,hits:hits};
        yield this.stats;

        while (idx<spaceSize) {
            ridx = Math.floor((idx+1)*Math.random()),
            type = m.get(ridx);
            if (!isNaN(type)) {
                m.set(idx,type);
                hits[type].push(idx);
                m.delete(ridx);
                yield type;
            } else {
                yield "";
            }
            idx++;
        }
        this.stats = {m:m, hits:hits};
        yield -1;
    }
}