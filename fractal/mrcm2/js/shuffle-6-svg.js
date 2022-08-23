
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

class PageState {
    config;
    params;
    url;
    forms;
    formIdMap = new Map();
    constructor(state={}) {
        if (state.url) {
            this.url = state.url;
        } else {
            this.url = new URL(window.location.href);
        }
        if (state.params) {
            this.params = state.params;
        } else {
            this.params = new URLSearchParams(this.url.search);
        }
        if (state.forms) {
            this.forms = state.forms;
        } else {
            this.forms = document.forms;
        }
        this.mapIds(this.formIdMap,this.forms);
        if (state.config) {
            this.config = state.config;
            this.sync(this.config,"url2form")
        }
        if (state.events) {
            for (let i=0,data;i<state.events.length;i++) {
                data = state.events[i];
                const evt = new Event(...data.desc);
                document.getElementById(data.target).dispatchEvent(evt);
            }
        }
    }
    get search() {
        return this.url.search;
    }
    mapIds(map,iterable) {
        for (let i=0;i<iterable.length;i++) {
            map.set(iterable[i].id,i);
        }
    }
    param(which) {
        let value;
        if (this.params.has(which)) {
            value = this.params.get(which);
        } 
        return value;
    }
    setParam(which,value) {
        if (!this.params.has(which)) {
            console.log(`setParam adding ${which} with value ${value}`);
        }
        this.params.set(which,value);
        return value;
    }
    formCount() {
        return this.forms.length;
    }
    getForm(index) {
        if (this.forms.length > index) {
            return this.forms[index]
        } 
    }
    sync(config,mode="url2form") {
        let map = config.map,
            len = map.length;
        mode = mode?mode:config.mode;

        switch (mode) {
        case "form2url":
            for (let i=0;i<len;i++) {
                let mapping = map[i],
                    form = this.forms[this.formIdMap.get(mapping.form)];
                this.setParam(mapping.urlvar,form.elements[mapping.formvar].value);
            }
            break;
        case "url2form":
        default:
            for (let i=0;i<len;i++) {
                let mapping = map[i],
                    form = this.forms[this.formIdMap.get(mapping.form)],
                    val = this.param(mapping.urlvar);
                form.elements[mapping.formvar].value = val?val:mapping.default;
            }
            break;
        }
    }
}

class Visualization {
    static #idCounter = 0;
    name;
    state;
    constructor(conf={
        tmpl:"vis",
        state:null,
    }) {
        this.setName(conf.tmpl);
        this.state = conf.state;
    }
    setName(tmpl="vis") {
        this.name = `${tmpl}-${Visualization.#idCounter++}`;
        return this.name;
    }
}

class PrisonerSearch extends Visualization {
    numPrisoners;
    numColumns;
    dataGeometry = new Map();
    dataAnimMap  = new Map();
    gidMap       = new Map();
    dataBbox = {};
    superGrid={
        svg:{id:"svgvis",class:""},
        groupwrapper:{id:"file-box-room",class:"file-box-wrapper",x:20,y:20},
        anchor:{id:"anchor",class:"anchor-grid"},
        rowHeads:{id:"row-heads",class:"row-grid"},
        colHeads:{id:"col-heads",class:"col-grid"},
        dataGrid:{id:"data-grid",class:"data-grid"},
        itemDims:{height:100,width:100,gap:20},
        anchorLabel:(text => text),
        colLabel:(col => col),
        rowLabel:(row => row),
        dataVals:((col,row) => {return row*10+col}),
        dataId:((index) => {return index;})
    };
    constructor(state) {
        super({
            tmpl:"PrisonerSearch",
            state:state,
        });
        this.updateState();
    }
    updateState() {
        this.numPrisoners = this.state.param("gs");
        this.numColumns   = this.state.param("cols");
    }
    sync(mode="form2url") {
        this.state.sync(this.state.config,mode);
        this.updateState();
    }
    setupSuperGrid(parentId,sgConfig=null) {
        sgConfig = sgConfig?sgConfig:this.superGrid;
        let parent = document.getElementById(parentId),
            xmlns = "http://www.w3.org/2000/svg",
            cols = parseInt(this.numColumns),
            rows = parseInt(Math.ceil(this.numPrisoners/cols)),
            itemFullWidth=sgConfig.itemDims.width+sgConfig.itemDims.gap,
            itemFullHeight=sgConfig.itemDims.height+sgConfig.itemDims.gap,
            groupWrapX = sgConfig.groupwrapper.x,
            groupWrapY = sgConfig.groupwrapper.y,
            dataWidth=itemFullWidth*cols,
            dataHeight=itemFullHeight*rows,
            width = (cols+1)*itemFullWidth+groupWrapX,
            height = (rows+1)*itemFullHeight+groupWrapY,
            svgDoc,
            groupwrapper,
            gwElement,
            anchor,
            child,
            rowHead,
            colHead,
            dataGrid;

        parent.innerHTML="";
        let svgTemplate = this.getPageTemplate("#svg-template");

        if (svgTemplate) {
            if (sgConfig.svg && sgConfig.svg.id) {
                svgTemplate.setAttribute("id",sgConfig.svg.id);
            }
            if (sgConfig.svg && sgConfig.svg.class) {
                svgTemplate.setAttribute("class",sgConfig.svg.class);
            }
            svgTemplate.setAttribute("height",height);
            svgTemplate.setAttribute("width",width);
            svgTemplate.setAttribute("viewbox",`0 0 ${width} ${height}`)
            svgDoc = parent.appendChild(svgTemplate);
        } else {
            return this.superGrid;
        }
        //parent.setAttribute("style",`grid-template-columns:1fr ${cols}fr; grid-template-rows:1fr ${rows}fr;height:${height}px;width:${width}px;`);
        if (sgConfig.groupwrapper) {
            groupwrapper = document.createElementNS(xmlns,"g");
            groupwrapper.setAttribute("id",sgConfig.groupwrapper.id);
            groupwrapper.setAttribute("class",sgConfig.groupwrapper.class);
            groupwrapper.setAttribute("transform",`translate(${groupWrapX},${groupWrapY})`);
            gwElement = svgDoc.appendChild(groupwrapper);
        }
        if (sgConfig.anchor) {
            anchor = document.createElementNS(xmlns,"g");
            anchor.setAttribute("id",sgConfig.anchor.id);
            anchor.setAttribute("class",sgConfig.anchor.class);
            anchor.setAttribute("transform",`translate(0,0)`)
            child = gwElement.appendChild(anchor);
        }
        if (sgConfig.colHeads) {
            colHead = document.createElementNS(xmlns,"g");
            colHead.setAttribute("id",sgConfig.colHeads.id);
            colHead.setAttribute("class",sgConfig.colHeads.class);
            colHead.setAttribute("transform",`translate(${itemFullWidth},0)`);
            child = gwElement.appendChild(colHead);
        }
        if (sgConfig.rowHeads) {
            rowHead = document.createElementNS(xmlns,"g");
            rowHead.setAttribute("id",sgConfig.rowHeads.id);
            rowHead.setAttribute("class",sgConfig.rowHeads.class);
            rowHead.setAttribute("transform",`translate(0,${itemFullHeight})`);
            child = gwElement.appendChild(rowHead);
        }
        if (sgConfig.dataGrid) {
            dataGrid = document.createElementNS(xmlns,"g");
            dataGrid.setAttribute("id",sgConfig.dataGrid.id);
            dataGrid.setAttribute("class",sgConfig.dataGrid.class);
            dataGrid.setAttribute("transform",`translate(${itemFullWidth},${itemFullHeight})`);
            child = gwElement.appendChild(dataGrid);
        }
        this.superGrid = sgConfig;
        return this.superGrid;
    }
    getGid(index) {
        return this.gidMap.get(index);
    }
    getPageTemplate(selector) {
        let docFragment = null,
            firstElementChild = null,
            clone = "";
        if ('content' in document.createElement('template')) {
            docFragment = document.querySelector(selector);
            firstElementChild = docFragment.content.firstElementChild;
            clone = firstElementChild.cloneNode(true);
        } 
        return clone;
    }
    getAnimationTemplate(selector) {
        let docFragment = document.querySelector(selector);
        return docFragment.cloneNode(true);
    }
    getDataBbox() {
        return this.dataBbox;
    }
    setupGrid(parentId,sgConfig=null) {
        this.sync();

        sgConfig = this.setupSuperGrid(parentId,sgConfig);

        let anchorId      = sgConfig.anchor.id,
            dataGridId    = sgConfig.dataGrid.id,
            colGridId     = sgConfig.colHeads.id,
            rowGridId     = sgConfig.rowHeads.id,
            ifw           = sgConfig.itemDims.width+sgConfig.itemDims.gap,
            ifh           = sgConfig.itemDims.height+sgConfig.itemDims.gap,
            parent        = document.getElementById(dataGridId),
            anchor        = document.getElementById(anchorId),
            cHead         = document.getElementById(colGridId),
            rHead         = document.getElementById(rowGridId),
            cols          = this.numColumns,
            rows          = Math.ceil(this.numPrisoners/cols),
            xmlns         = "http://www.w3.org/2000/svg",
            anchorHead    = document.createElementNS(xmlns,"g"),
            anchorRect    = document.createElementNS(xmlns,"use"),
            aContent      = document.createElementNS(xmlns,"text"),
            aContentTxt   = document.createTextNode(this.superGrid.anchorLabel("0"));
        anchorHead.setAttribute("id","atext");
        anchorHead.setAttribute("transform",`translate(0,0)`);
        anchorRect.setAttribute("href",`#item`);
        aContent.appendChild(aContentTxt);
        anchorHead.appendChild(anchorRect);
        anchorHead.appendChild(aContent)
        anchor.appendChild(anchorHead);

        for (let row=0,index=0;row<rows;row++) {
            let rowHead  = document.createElementNS(xmlns,"g"),
                rowRect  = document.createElementNS(xmlns,"use"),
                rContent = document.createElementNS(xmlns,"text"),
                content  = document.createTextNode(this.superGrid.rowLabel(row+1));

            rowHead.setAttribute("id",`row-${row+1}`);
            rowRect.setAttribute("href",`#item`);
            rowHead.setAttribute("transform",`translate(0,${(row)*ifh})`);
            rowHead.appendChild(rowRect);
            rContent.appendChild(content);
            rowHead.appendChild(rContent);
            rHead.appendChild(rowHead);

            for (let col=0;col<cols&&index<this.numPrisoners;col++,index++) {
                if (row==0) {
                    let colHead = document.createElementNS(xmlns,"g"),
                        colRect = document.createElementNS(xmlns,"use"),
                        hContent = document.createElementNS(xmlns,"text"),
                        content = document.createTextNode(this.superGrid.colLabel(col+1));

                    colHead.setAttribute("id",`col-${col+1}`);
                    colRect.setAttribute("href",`#item`);
                    colHead.setAttribute("transform",`translate(${(col)*ifw},0)`);
                    colHead.appendChild(colRect);
                    hContent.appendChild(content);
                    colHead.appendChild(hContent);
                    cHead.appendChild(colHead);
                }
                // visible and moveable content div
                const fileBox  = document.createElementNS(xmlns,"g"),
                      fileRect = document.createElementNS(xmlns,"use"),
                      dContent = document.createElementNS(xmlns,"text"),
                       content = document.createTextNode(`${sgConfig.dataVals(col+1,row)}`),
                       gid     = `pris${index}`,
                       gx      = (col)*ifw,
                       gy      = (row)*ifh;
                fileBox.setAttribute("id",gid);
                fileBox.setAttribute("class",`data col${col} row${row}`);
                fileBox.setAttribute("transform",`translate(${gx},${gy})`);
                fileRect.setAttribute("href",`#item`);
                fileRect.setAttribute("id",`bbox${index}`);
                fileBox.appendChild(fileRect);
                dContent.appendChild(content);
                fileBox.appendChild(dContent);

                let animId = null,
                    mpathId= null,
                    animTemplate = this.getAnimationTemplate("#animation-template");

                if (animTemplate) {
                    animId = `data-anim-${index}`;
                    animTemplate.setAttribute("id",animId);
                    animTemplate.setAttribute("begin",`${gid}.click;${gid}.move`)
                    let mpathSel = animTemplate.querySelector("mpath");
                    if (mpathSel) {
                        mpathId=`mpath-anim-${index}`;
                        mpathSel.setAttribute("id",mpathId);
                    }
                }
                fileBox.appendChild(animTemplate);
                parent.appendChild(fileBox);
                this.gidMap.set(index,gid);
                this.dataAnimMap.set(gid,{
                    content:content,
                    animId:animId,
                    mpathId:mpathId,
                });
                this.dataGeometry.set(index,{
                    col:col,
                    row:row,
                    gx:gx,
                    gy:gy,
                });
            }
        }
        this.dataBbox = parent.getBoundingClientRect();
    }
    setupRowColLabels(parentId,labels={}) {

    }
    saveState(mode="form2url") {
        this.state.sync(this.state,mode);
        this.updateState();
    }
    swapData(aIndex,bIndex) {
        let aGid = this.getGid(aIndex),
            bGid = this.getGid(bIndex);
        this.gidMap.set(bIndex,aGid);
        this.gidMap.set(aIndex,bGid);
    }
    animateDataSwap(aIndex,bIndex) {
        let didSwap = false;
        if (aIndex === bIndex) {
            return didSwap;
        }
        let aGid  = this.getGid(aIndex),
            bGid  = this.getGid(bIndex),
            //bbInf = getBoundingBoxPairSVG(aGid,bGid),
            bbInf = getBoundingBoxPairSVG(`bbox${aIndex}`,`bbox${bIndex}`),
            dataBbox = this.getDataBbox(),
            relLocA = {
                x:(bbInf.fromData.left - dataBbox.left),
                y:(bbInf.fromData.top - dataBbox.top),
            },
            relLocB = {
                x:(bbInf.toData.left - dataBbox.left),
                y:(bbInf.toData.top - dataBbox.top),
            },
            aGeo  = this.dataGeometry.get(aIndex),
            bGeo  = this.dataGeometry.get(bIndex),
            aAnim = this.dataAnimMap.get(aGid),
            bAnim = this.dataAnimMap.get(bGid),
            optionsA = {
                x1:aGeo.gx,
                x2:bGeo.gx,
                y1:aGeo.gy,
                y2:bGeo.gy,
                sweep:0,
                dir:1,
                agx:aGeo.gx,
                agy:aGeo.gy,
                bgx:bGeo.gx,
                bgy:bGeo.gy,
                acx:relLocA.x,
                acy:relLocA.y,
                bcx:relLocB.x,
                bcy:relLocB.y,
            },
            pathA = calcSVGPathFromTo(optionsA),
            a2b   = pathA.a2b,
            b2a   = pathA.b2a,
            animA = document.getElementById(aAnim.animId),
            animB = document.getElementById(bAnim.animId),
            aGroup = document.getElementById(aGid),
            bGroup = document.getElementById(bGid),
            eventA = new Event("move"),
            eventB = new Event('move');

        animA.setAttribute("path",a2b);
        animB.setAttribute("path",b2a);

        // Draw path info. Note a=>x1,y1 and b=>x2,y2
        let a2bPath = document.getElementById("a2bPath"),
            b2aPath = document.getElementById("b2aPath"),
            a2bLine = document.getElementById("a2bLine");

        a2bPath.setAttribute("d",a2b);
        a2bPath.setAttribute("transform",`translate(${aGeo.gx},${aGeo.gy})`);
        b2aPath.setAttribute("d",b2a);
        b2aPath.setAttribute("transform",`translate(${bGeo.gx},${bGeo.gy})`);
        a2bLine.setAttribute("x1",aGeo.gx);
        a2bLine.setAttribute("y1",aGeo.gy);
        a2bLine.setAttribute("x2",bGeo.gx);
        a2bLine.setAttribute("y2",bGeo.gy);

        aGroup.setAttribute("transform",`translate(${aGeo.gx},${aGeo.gy})`);
        bGroup.setAttribute("transform",`translate(${bGeo.gx},${bGeo.gy})`);
        aGroup.dispatchEvent(eventA);
        bGroup.dispatchEvent(eventB);
        this.swapData(aIndex,bIndex);
    }
}

