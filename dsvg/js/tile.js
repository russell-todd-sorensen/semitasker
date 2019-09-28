
let height = 50;
let width  = 63.65;
let points = new Array();
let numberOfPoints = 0;

let captureBegin = {row:0,col:0}
let captureEnd   = {row:10000,col:10000}
let rect = {
    start: {
        x: -2.10,
        y: -1.22
    },
    end: {
        x: 0.60,
        y: 1.22
    },
};

var config = {
    textId: 't2',
    pointsId: 'mPoints2',
    svgId: 'svg2',
    formFontSizeId: 'fontSize',
    formFontFamilyId: 'fontFamily',
    textHref: '#t2',                //the hash is part of the href :(
    defaultFontIndex: 4,            // Arial
    fontSize: 48,
    updateFontSize: false,
    fontFamily: 'Arial',
    updateFontFamily: false,
    noClasses: 0,
    noId: 0,
    factor:1000,
    clipBegin: {col:2,row:0},
    clipEnd: {col:-1,row:-2},
    captureBegin: {col:2,row:2},
    captureEnd: {col:10,row:10},
    rect: rect,
    height: 50,
    width: 63.65,
    svgHeight: null,
    svgWidth: null,
    maxCol: null,
    maxRow: null,
    calcMaxCol: function() {
        let pointWidth = Math.abs(this.rect.end.x - this.rect.start.x);
        let cols = Math.floor(pointWidth * this.width);
        this.maxCol = cols-1
        return this.maxCol;
    },
    calcMaxRow: function() {
        let pointHeight = Math.abs(this.rect.end.y - this.rect.start.y);
        let rows = Math.floor(pointHeight * this.height);
        this.maxRow = rows-1;
        return this.maxRow;
    },
    callbacks: [],
};

let calculatePoints = function(config) {

    if (arguments[0]) {
        rect = config.rect
        captureBegin = config.captureBegin
        captureEnd   = config.captureEnd
        if (config.height) height = config.height
        if (config.width) width = config.width
    }
    if (!config.captureEnd) {
        config.captureEnd = {col:config.calcMaxCol(),row:config.calcMaxRow()}
        captureEnd = config.captureEnd;
    }
    points = [];
    const unitsOfWidth = rect.end.x - rect.start.x;
    const unitsOfHeight = rect.end.y - rect.start.y;

    let cX,cY;
    let counter;
    let finite;
    let row,col;
    let id = 0;
    numberOfPoints = 0;

    bigloop:
    for (let x = rect.start.x,col=0; x < rect.end.x; x+=1/width,col++) {
        for (let y = rect.start.y,row=0; y < rect.end.y ; y+=1/height,row++) {
            counter = 0;
            finite = true;
            newX = x;
            newY = y;
            tmpX = x;
            tmpY = y;
            cY = y;
            cX = x;
            while (counter < 256 && finite) {
                newY = cY +  2 * tmpX * tmpY;
                newX = cX + (-1 * tmpY * tmpY) + tmpX * tmpX;
                tmpX = newX;
                tmpY = newY;
                if (newX*newX+newY*newY > 256) {
                    finite = false;
                }
                counter++;
            }

            numberOfPoints++;

            if (row > captureEnd.row && col > captureEnd.col) break bigloop;
            if (row < captureBegin.row || row > captureEnd.row) continue
            if (col < captureBegin.col || col > captureEnd.col) continue
            //if (counter == 256) continue; // This makes the m-set points empty

            points[points.length] = {
                cx:x,
                cy:y,
                counter:counter,
                finite:finite,
                row:row,
                col:col,
                id:id
            }
            id++;
        }
    }
}

let calcTileStartAndSize = function(config) {

    let startX,startY,endX,endY,svgHeight,svgWidth,addToX,addToY
    let point,point0,pointEnd;

    for (let i = 0;i<points.length;i++) {
        point = points[i]
        if (point.row == config.captureBegin.row+config.clipBegin.row
            && point.col == config.captureBegin.col+config.clipBegin.col) 
        {
            point0 = point
        } else
        if (point.row == config.captureEnd.row+config.clipEnd.row 
            && point.col == config.captureEnd.col+config.clipEnd.col) 
        {
            pointEnd = point
            break;
        }
    }

    startX = point0.cx * config.factor;
    startY = point0.cy * config.factor;
    endX = pointEnd.cx * config.factor
    endY = pointEnd.cy * config.factor
    svgHeight = endY - startY
    svgWidth  = endX - startX
    addToX = 0 - startX
    addToY = 0 - startY

    d3.select('#' + config.svgId)
        .attr('x',Math.ceil((startX+addToX)*1000)/1000)
        .attr('y',Math.ceil((startY+addToY)*1000)/1000)
        .attr('height',Math.ceil(svgHeight*1000)/1000)
        .attr('width',Math.ceil(svgWidth*1000)/1000)
        .attr('viewBox',[Math.ceil((startX+addToX)*1000)/1000,
            Math.ceil((startY+addToY)*1000)/1000,
            Math.ceil(svgWidth*1000)/1000,
            Math.ceil(svgHeight*1000)/1000].join(' '))

    config.startX=startX;
    config.startY=startY;
    config.endX=endX;
    config.endY=endY;
    config.svgHeight=svgHeight;
    config.svgWidth=svgWidth;
    config.addToX=addToX;
    config.addToY=addToY;

    return config
}

function addPoints(config) {

    let g = d3.select('#' + config.pointsId);
    g.html("");
    g.selectAll('use')
        .data(points)
        .enter()
        .append('use')
        .attr('id',function(d,i) {
            if (config.noId) {
                return
            } else {
                let val = 'p-' + d.id
                return val
            }
        })
        .attr('href',config.textHref)
        .attr('class',function(d,i) {
            if (config.noClasses) {
                return
            } else {
                const val = 'A row-' + d.row + ' col-' + d.col
                return val
            }
        })
        .attr('x', function(d,i) {
            let val = (Math.ceil((d.cx*config.factor + config.addToX)*1000)/1000);
            return val
        })
        .attr('y', function(d,i) {
            let val = (Math.ceil((d.cy*config.factor + config.addToY)*1000)/1000);
            return val
        })
        .attr('opacity', function(d,i) {
            if (d.counter == 256) {
                return 0.01
            } else {
                return (1000-Math.ceil((Math.abs((255-20*d.counter)%255)/255)*1000))/1000;
            }
        });

    runMsetCallbacks(config);
};

let callbackFunctions = [
    function(data) {
        // updates fontSize
        let fsRef = top.document.getElementById(config.formFontSizeId)
        fsRef.value = data.fontSize;
        fsRef.onchange();
    },
    function(data) {
        // updates fontFamily
        let fontIndex = config.defaultFontIndex;
        let ffRef = top.document.getElementById(config.formFontFamilyId);
        let fontData = data.fontFamily;
        if (typeof(fontData) == "number"
            && typeof(parseInt(fontData)) == "number")
        {
            fontIndex = parseInt(fontData)
        } else
        if (typeof(fontData) == "string") {
            let lowercase = fontData.toLowerCase();
            if (top.fontArray[lowercase]) {
                fontIndex = top.fontArray[lowercase];
            }
        }

        ffRef.selectedIndex = fontIndex;
        ffRef.onchange();
    }
];

let runMsetCallbacks = function(config) {
    // run final callbacks
    if (!config.callbacks || config.callbacks.length == 0) {
        return
    }
    let cb;
    for (let i=0;i<config.callbacks.length;i++) {
        cb = config.callbacks[i];
        callbackFunctions[cb.callIndex](cb)
    }
}

let createPicture = function (partialConfig) {

    if (partialConfig) {
        for (let [name,value] of Object.entries(partialConfig)) {
            config[name] = value;
        }
    } else {
        const query = document.URL.split('?')
        if (query[1]) {
            console.log("queryString=" + query[1])
            let queryEntries = query[1].split('&')
            for (let nv of queryEntries) {
                let [name, value] = nv.split("=");
                switch (name) {
                case "bc":
                case "captureBegin.col":
                    config.captureBegin.col = parseInt(value);
                    break;
                case "br":
                case "captureBegin.row":
                    config.captureBegin.row = parseInt(value);
                    break;

                case "ec":
                case "captureEnd.col":
                    config.captureEnd.col = parseInt(value);
                    break;
                case "er":
                case "captureEnd.row":
                    config.captureEnd.row = parseInt(value);
                    break;
                case "ni":
                case "noId":
                    config.noId = value;
                    break;
                case "nc":
                case "noClasses":
                    config.noClasses = value;
                    break;
                case "fs":
                case "fontSize":
                    config.fontSize = parseFloat(value);
                    config.callbacks[config.callbacks.length] = 
                        {callIndex:0,fontSize:value}
                    config.updateFontSize = true;
                    break;
                case "ff":
                case "fontFamily":
                    config.fontFamily = value;
                    config.callbacks[config.callbacks.length] = 
                        {callIndex:1,fontFamily:value}
                    config.updateFontFamily = true;
                    break;
                default:
                    break;
                }
            }
        }
    }
    calculatePoints(config);
    calcTileStartAndSize(config);
    addPoints(config)
}

let createEntirePicture = function () {

    let partialConfig = {
        captureEnd: null,
    }
    createPicture(partialConfig);
}
////////// Code from main html page: tile.html

let changeFontSize = function(formId,textId) {
    const property = "font-size"
    const fontSize = parseFloat(document.getElementById(formId).value)
    const newValue = fontSize + "px"

    replaceStyleProperty(SVGDoc,textId,property,newValue);
};

let changeFontFamily = function(selectId,textId) {
    const property = "font-family"
    const sh = document.getElementById(selectId);
    const newValue = sh.options[sh.selectedIndex].value
 
    replaceStyleProperty(SVGDoc,textId,property,newValue);
};

let replaceStyleProperty = function(doc,refId,property,newValue) {
    let ele = doc.getElementById(refId);
    let styleCode = ele.getAttributeNS(null,"style");
    let styleNVArray;
    let styleProperty;
    let styleStringArray = []
    let styleString = ""

    if (styleCode) {

        let styleList = styleCode.split(";")
        for (var i=0;i<styleList.length;i++) {
            styleNVArray = styleList[i].split(":")
            styleProperty = styleNVArray[0].trim().toLowerCase()
            if (styleProperty == property || styleProperty == "") {
                continue
            } else {
                styleStringArray[styleStringArray.length] = 
                    styleProperty + ": " + styleNVArray[1];
            }
        }
    }

    styleStringArray[styleStringArray.length] = property + ":" + newValue;
    styleString = styleStringArray.join(";")
    ele.setAttributeNS(null,"style",styleString);
}

////////// End code from tile.html

function writeSvgImage(svgId,svgParentId) {

    var svgHandle = d3.select('#' + svgId);
    var svgParentHandle = d3.select('#' + svgParentId)

    var svgWidth = svgHandle.attr("width");
    var svgHeight = svgHandle.attr("height");
    var viewbox = "0 0 " + svgWidth + " " + svgWeight;

    subWindow = window.open(
    "#svgResult",  // url to open
    "example", // window name
    "height="
    + svgHeight + ",width=" + svgWidth + ",toolbar=yes,menubar=yes,"
    + "scrollbars=yes,resizable=yes,chrome=true,titlebar=true", // options
    "true" // replace (removes current document)
    );

    var svgDoc = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
    + "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" "
    + "\"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n";

    svgDoc += document.getElementById(svgId).outerHTML 

    subWindow.document.write(svgDoc);
}
