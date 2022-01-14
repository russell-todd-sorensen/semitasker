
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
    xOffset  =    0;
    timeout  =   1000; // milliseconds
    width    = this.infinity;
    height   =   50;
    gWidth   = this.width+this.xOffset;
    gHeight  = this.width+this.xOffset;
    xAxis    = this.gHeight;
    yAxis    = this.xOffset;
    animType = "lazy";
    animationIndex = 0;
    continueAnimation = false;
    stats = {};
    steps = [];
    typeDefs = new Map();

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
        this.visType = config.visType?config.visType:"lazy";
        this.defs    = this.svg.select("defs");
        this.main    = this.svg.select("#main")
        this.bg      = this.main.select("#bg");
        this.height  = config.height?config.height:50;
        this.hueDiff = Math.floor(360/(this.numItems+1));
        this.itemDimX = 10;
        this.itemDimY = 10;
        this.gWidth  = this.width+this.xOffset+this.itemDimX;
        this.gHeight = this.height+this.yOffset+this.itemDimY;

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
                .attr("class",`defShape C-${type}`)
                .attr("fill",`hsla(${type*this.hueDiff},80%,50%,.7)`)
                .attr("stroke-width",0)
                .attr("height",this.itemDimY)
                .attr("width",this.itemDimX);
            this.drawInit(i,type);
        }
    }
    drawInit(index,type) { 
        this.main
            .append("use")
            .attr("id",`ltype-${type}`)
            .attr("class",`defShape U-${type}`)
            .attr("href",`#rect-type-${type}`)
            .attr("x",-12)
            .attr("y",`${this.top + type*this.itemDimY}`);
    }
    draw(index,type) { 
        this.main
            .append("use")
            .attr("id",`ltype-${type}`)
            .attr("class",`defShape U-${type}`)
            .attr("href",`#rect-type-${type}`)
            .attr("x",`${index}`)
            .attr("y",`${this.top + type*this.itemDimY}`);
    }
    oneStep() {
        let nextType = this.getNextType.next().value;
        if (isNaN(nextType) || nextType == -1) {
            this.continueAnimation = false;
        } else if (nextType === "") {
            this.animationIndex++;
            this.timeout = 1;
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
    animateStep(index,dir) {
        let from = index + dir,
            fstep = from==-1?[{ty:null,fr:null,to:null}]:this.steps[from],
            tstep = this.steps[index],
            main = this.main;

        if (tstep.length == 0) {
            return;
        }
        const t = main.transition()
            .duration(500);
        
        const posUpdate = main.selectAll("use")
            .data(tstep, function(d) {
                return d ? `ltype-${d.ty}` : this.id;
            })

                if (i==0) {
                    main.select(`#ltype-${d.ty}`)
                        .call(update => update.transition(t)
                            .attr("x","${d.to}")
                            )
                } else {
                    main.select(`#ltype-${d.ty}`)
                        .call(update => update.transition(t)
                            .attr("x","${d.to")
                        )
                }
    }
    *nextType (sampleSize,spaceSize) {

        let m    = new Map(),
            idx  = 0,
            type = 0,
            tmpt = 0,
            ridx = 0,
            hits = []; // by definition 0 is always chosen in first iteration

        for (let step;idx<sampleSize;type++,idx++) {
            m.set(idx,type);
            hits[type] = [idx];
            step = [{ty:type,fr:null,to:idx}];
            //this.steps.push([{ty:type,fr:null,to:idx}]);
            ridx = Math.floor((type+1)*Math.random());
            tmpt = m.get(ridx);
            if (tmpt != type) {
                m.set(idx,tmpt);
                m.set(ridx,type);
                hits[type].push(ridx);
                hits[tmpt].push(idx);
                step.push({ty:type,fr:idx,to:ridx},{ty:tmpt,fr:ridx,to:idx});
            }
            this.steps.push(step);
        }

        // stats is the initial randomized ordering of "types"
        this.stats = {m:m,hits:hits};
        yield this.stats;

        while (idx<spaceSize) {
            ridx = Math.floor((idx+1)*Math.random()),
            type = m.get(ridx);
            if (!isNaN(type)) {
                m.set(idx,type);
                this.steps.push([{ty:type,fr:ridx,to:idx}]);
                hits[type].push(idx);
                m.delete(ridx);
                yield type;
            } else {
                this.steps.push([]);
                yield "";
            }
            idx++;
        }
        this.stats = {m:m, hits:hits};
        yield -1;
    }
}
