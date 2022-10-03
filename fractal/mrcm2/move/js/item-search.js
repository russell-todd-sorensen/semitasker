
class ItemSearch extends Visualization {
    numItems;
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
            tmpl:"ItemSearch",
            state:state,
        });
        this.updateState();
    }
    updateState() {
        this.numItems = this.state.param("gs");
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
            rows = parseInt(Math.ceil(this.numItems/cols)),
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
            rows          = Math.ceil(this.numItems/cols),
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

            for (let col=0;col<cols&&index<this.numItems;col++,index++) {
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
        if (false && (aIndex > bIndex)) {
            let tmp = aIndex;
            aIndex = 0+bIndex;
            bIndex = tmp;
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
                testEllipse:["ellipseA","ellipseB","ellipseC","ellipseD"],
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
            a2bLine = document.getElementById("a2bLine"),
            centroid = document.getElementById("centroid");

        a2bPath.setAttribute("d",a2b);
        a2bPath.setAttribute("transform",`translate(${aGeo.gx},${aGeo.gy})`);
        b2aPath.setAttribute("d",b2a);
        b2aPath.setAttribute("transform",`translate(${bGeo.gx},${bGeo.gy})`);
        a2bLine.setAttribute("x1",aGeo.gx);
        a2bLine.setAttribute("y1",aGeo.gy);
        a2bLine.setAttribute("x2",bGeo.gx);
        a2bLine.setAttribute("y2",bGeo.gy);
        centroid.setAttribute("cx",pathA.midx);
        centroid.setAttribute("cy",pathA.midy);
        console.log(`r=${pathA.r},a2b=${a2b},b2a=${b2a}`)
        aGroup.setAttribute("transform",`translate(${aGeo.gx},${aGeo.gy})`);
        bGroup.setAttribute("transform",`translate(${bGeo.gx},${bGeo.gy})`);
        aGroup.dispatchEvent(eventA);
        bGroup.dispatchEvent(eventB);
        this.swapData(aIndex,bIndex);
    }
}
