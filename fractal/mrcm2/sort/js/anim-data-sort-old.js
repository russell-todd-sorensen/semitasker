class as {
    animateDataSort(startIndex) {
        let aIndex = parseInt(startIndex),
            aGeo   = this.dataGeometry.get(aIndex),
            aGid   = this.getGid(aIndex),
            aAnim  = this.dataAnimMap.get(aGid),
            bIndex = parseInt(aAnim.sortIndex),
            maxCount = this.numItems,
            count = 0,
            bGeo,
            bGid,
            bAnim,
            optionsA,pathA,a2b,animA,aGroup,eventA;

        while (count < maxCount && aIndex != bIndex ) {  //bIndex != startIndex
            bGeo = this.dataGeometry.get(bIndex);
            bGid = this.getGid(bIndex);
            bAnim = this.dataAnimMap.get(bGid);
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
                testEllipse:["ellipseA","ellipseB"],
            };
            pathA = calcSVGPathFromTo(optionsA);
            a2b   = pathA.a2b;
            animA = document.getElementById(aAnim.animId);
            aGroup = document.getElementById(aGid);
            eventA = new Event("move");
            animA.setAttribute("path",a2b);

            let a2bPath = document.getElementById("a2bPath"),
                a2bLine = document.getElementById("a2bLine"),
                centroid = document.getElementById("centroid"),
                degreeLine = document.getElementById("degreeLine"),
                bias = pathA.bias,
                calcCY = ((pathA.r >0 && pathA.r<90)?pathA.r:90).toFixed(3);
            //console.log(`bias=${bias},pathA.dx=${pathA.dx},pathA.dy=${pathA.dy}`);
            a2bPath.setAttribute("d",a2b);
            a2bPath.setAttribute("transform",`translate(${aGeo.gx},${aGeo.gy})`);
            a2bLine.setAttribute("x1",aGeo.gx);
            a2bLine.setAttribute("y1",aGeo.gy);
            a2bLine.setAttribute("x2",bGeo.gx);
            a2bLine.setAttribute("y2",bGeo.gy);
            centroid.setAttribute("cx",pathA.midx);
            centroid.setAttribute("cy",pathA.midy);
            degreeLine.setAttribute("d",`M${pathA.midx},${pathA.midy} v-${calcCY}`);
            degreeLine.setAttribute("transform",`rotate(${(pathA.deg*bias).toFixed(3)},${pathA.midx},${pathA.midy})`);

            aGroup.setAttribute("transform",`translate(${aGeo.gx},${aGeo.gy})`);
            console.log(`Move ${count} aIndex=${aIndex} to bIndex=${bIndex}`);
            count++;
            aGroup.dispatchEvent(eventA);
            this.gidMap.set(bIndex,aGid);
            aIndex = bIndex;
            aGeo   = bGeo;
            aGid   = bGid;
            aAnim  = bAnim;
            bIndex = parseInt(aAnim.sortIndex);
        }
        console.log(`bIndex = ${bIndex} Gid=${aGid}`)
        return bIndex;
    }
}