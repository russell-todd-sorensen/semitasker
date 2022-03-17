// JavaScript Document

var svg;
var subWindow; // used in displaying svg in separate window
var myTartan;

class Tartan {
    threadX = 0;
    threadY = 0;
    currentPixelX = 0;
    currentPixelY = 0;
    side = 4;
    end = 2;
    threadBox = 4; // this.side / this.end * 2
    threadCount = 0;
    threadsToWeave = 0;
    svgData = "";
    data = null;
    currentClass = null;
    datasetExp;
    dsStyleArray;
    reverseData;
    svgBody;
    svgContainer;
    height;
    width;
    svg;

    constructor(dataId, threads, forExport, reverseThreads, tartanOptions) {

        this.data = tartanDataObjects[parseInt(dataId)];

        if (forExport === "yes") {
            this.threadCount = this.data.getThreadCount();
        } else {
            this.threadCount = threads ? threads : 100;
        }

        let threadSchedule = this.data.getThreadSchedule()
        Log.Notice("forExport=" + forExport + " data=" + threadSchedule);
        this.datasetExp = new Array();
        this.dsStyleArray = new Array();
        if (reverseThreads === "yes") {
            this.reverseData = new Array();
            for (let i = threadSchedule.length-1; i >= 0; i--) {
                this.reverseData[this.reverseData.length] = threadSchedule[i];
            }
            this.init(this.reverseData, this.datasetExp, this.dsStyleArray, this.threadCount, tartanOptions );
            generateThreadSchedule2(this.reverseData);
        } else {
            this.init(threadSchedule, this.datasetExp, this.dsStyleArray, this.threadCount, tartanOptions );
            generateThreadSchedule2(this.data);
        }
    }

    weave (colorArray, styleArray) {
        this.svgBody = d3.select(document.body);
        this.svgContainer =  this.svgBody.select("#svg-container");
        this.svgContainer.html("");
        this.width = this.threadsToWeave * this.end;
        this.height = this.width;
        this.viewbox =  [0, 0, this.width, this.height].join(" ")
        this.svg = this.svgContainer
            .append("svg")
            .attr("version", "1.1")
            .attr("id", "svg1")
            .attr("xmlns", "http://www.w3.org/2000/svg")
            .attr("x", 0)
            .attr("y", 0)
            .attr('height', this.height)
            .attr('width', this.width)
            .attr('viewbox', this.viewbox);

        this.writeStyle(this.svg, styleArray);

        let horizontalRows = this.svg
          .append("g")
          .attr("id","horizontal-rows")
          .attr("x", 0)
          .attr("y", 0);

        let x1, x2, y1, y2, cssClass;

        while (this.threadY < this.threadsToWeave) {

            x1 = 0;
            y1 = (this.threadY + .5)*this.end;
            x2 = this.threadsToWeave * this.end;
            y2 = y1;
            cssClass = colorArray[this.threadY%this.threadCount] 
                + " hor-" 
                + this.threadY % this.threadBox; // right?

            Log.Notice("horizontalRows threadY=" + this.threadY + ", x1=" + x1 + ", y1=" + y1);

            horizontalRows
                .append("line")
                .attr("class", cssClass)
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2);

            this.threadY++;
        }

        let verticalCols = this.svg
            .append("g")
            .attr("id","vertical-cols")
            .attr("x", 0)
            .attr("y", 0);

        this.threadX=0;
        this.threadY=0;
        this.currentPixelX = 0;
        this.currentPixelY = 0;

        while (this.threadX < this.threadsToWeave) {

            x1 = (this.threadX + 0.5)*this.end;
            y1 = 0;
            x2 = x1;
            y2 = this.threadsToWeave * this.end;
            cssClass = colorArray[this.threadX%this.threadCount]
                + " vert-" 
                + this.threadX % this.threadBox;

            verticalCols
                .append("line")
                .attr("class", cssClass)
                .attr("x1", x1)
                .attr("y1", y1)
                .attr("x2", x2)
                .attr("y2", y2);

          this.threadX++;
        }

        Log.Notice("colorArray.length=" + colorArray.length);

        // de-initialize tartan
        this.threadX=0;
        this.threadY=0;
        this.currentPixelX = 0;
        this.currentPixelY = 0;
        this.threadCount = 0;
        this.threadsToWeave = 0;

        this.svgData = this.svgContainer.html();
    };

    writeStyle (svg, styleArray) {

        var style = "";

        for (var i = 0; i<styleArray.length; i++) {
            var color = styleArray[i][1];

            style = style
                + "\n." + styleArray[i][0] + " \{\n"  // this is a CSS Class
                + "fill: none;\n"
                + "stroke: " + color + ";\n"
                + "stroke-dasharray: " + this.side + ", " + this.side + ";\n"
                + "stroke-width: " + this.end  + ";\n"
                + "\}\n";
        }

        for (var i = 0; i< parseInt(2*this.side / this.end ); i++) {
            style = style
                + "\n.hor-" + i + " \{\n"
                + "stroke-dashoffset: " + parseInt(i * this.end) + ";\n"
                + "\}\n\n"
                + "\n.vert-" + i + " \{\n"
                + "stroke-dashoffset: " + parseInt(this.side + i * this.end) + ";\n"
                + "\}\n\n";
        }

        this.svg
            .append("style")
            .text(style);
    };

    getOptions(tartanOptions) {
        // nothing here yet
        for (let option in tartanOptions) {
            this[option] = tartanOptions[option];
        }
    };

    writeSvgImage() {

        let svgHandle = $("#svg1"),
            styleHandle = $("body style"),
            width = this.width,
            height = this.height,
            viewbox = this.viewbox;

        subWindow = window.open(
            "#svg",  // url to open
            "example", // window name
            "height="
                + height + ",width=" + width + ",toolbar=yes,menubar=yes,"
                + "scrollbars=yes,resizable=yes,chrome=true,titlebar=true", // options
            "true" // replace (removes current document)
        );

        let svgDoc = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
            + "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" "
            + "\"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n";

        svgDoc += this.svgData;

        subWindow.document.write(svgDoc);
    };

    init(inputArray, outputArray, styleArray, threadsToWeave, tartanOptions) {

        this.getOptions(tartanOptions);

        this.expandColorArray(inputArray, outputArray, styleArray);
        Log.Notice("outputArray=" + outputArray);
        this.threadCount = outputArray.length;

        if (arguments.length >= 4) {
            this.threadsToWeave = threadsToWeave;
        } else {
            this.threadsToWeave = this.threadCount;
        }

        this.weave(outputArray, styleArray);

        Log.Notice("Finished with tartan");
    };
    expandColorArray(inArray, outArray, styleArray) {

        let index = 0,
            key,
            color,
            colorName,
            repeat,
            found = false,
            styleId,
            styleIndex = 0,
            lastRepeat;

        for (let i = 0; i<inArray.length; i++) {
            key = inArray[i].key;
            color = '#' + this.data.getPallet()[key].value;
            colorName = this.data.getPallet()[key].name;
            repeat = inArray[i].value;
            found = false;

            for (let k = 0; k < styleArray.length; k++) {
                if (styleArray[k][1] == color) {
                    found = true;
                    styleId = styleArray[k][0];
                    break;
                }
            }

            if (!found) {
                styleId = "c" + styleArray.length;
                styleArray[styleIndex] = [styleId, color, colorName];
                styleIndex++;
            }
            for (let j = 0; j < repeat; j++) {
                outArray[index] = styleId;
                index++;
            }
            lastRepeat = repeat;
        }

        // add reversed array
        if (this.data.getSymmetry() == "reflect fcp") {
            for (let i = outArray.length - lastRepeat-1; i >= inArray[0].value; i--) {
                outArray[index] = outArray[i];
                index++;
            }
        }
        Log.Notice("finished expandColorArray");
    }
};

function expandColorArray(inArray, outArray, styleArray) {

    let index = 0,
        color,
        repeat,
        found = false,
        styleId;

    for (let i = 0; i<inArray.length; i++) {
        color = inArray[i][0];
        repeat = inArray[i][1];
        found = false;
        styleId;

        for (let k = 0; k < styleArray.length; k++) {
            if (styleArray[k][1] == color) {
                found = true;
                styleId = styleArray[k][0];
                break;
            }
        }

        if (!found) {
            styleId = "c" + styleArray.length;
            styleArray[styleArray.length] = [styleId, color];
        }
        for (let j = 0; j < repeat; j++) {
            outArray[index] = styleId;
            index++;
        }
    }

    // add reversed array
    for (let i = outArray.length -1; i >= 0; i--) {
        outArray[index] = outArray[i];
        index++;
    }

    Log.Notice("finished expandColorArray");
}

// calculate threads using tartan data
function calculateTartanThreads(data) {

    let threadCount = 0;
    for (let i = 0; i< data.length; i++) {
        threadCount += data[i][1] * 2;
    }

    return threadCount;
}

// calculate threads using tartan index
function calculateThreadCount(index) {

    let tartanData = dataset[index],
        tartanName = tartanData[0],
        tartanThreads = tartanData[1],
        count = 0;

    for (var i = 0; i<tartanThreads.length;i++) {
        count += tartanThreads[i][1];
    }

    return [tartanName, count];
}

function generateThreadSchedule(threadData) {

    let threadTable = $('#threadTable'),
        extraStyle = "";

    threadTable.html("<div class='threadData'>Thread Schedule</div>\n"); 

    for (let i = 0; i<threadData.length;i++) {
        color = threadData[i][0];
        if (color == "black") {
            extraStyle= " color: white;";
        } else {
            extraStyle = "";
        }
        threadTable
            .append("<div class='threadData' style='background-color: "
                +  color + ";" + extraStyle + "' >" + color
                +  " (" + threadData[i][1] + ")</div>\n" );
    }
}

function generateThreadSchedule2(threadData) {

    let threadTable = $('#threadTable'),
        extraStyle = "";

    threadTable.html("<div class='threadDataHeader'>Thread Schedule</div>\n"); 

    for (var i = 0; i<threadData.length;i++) {
        color = threadData[i][0];
        if (color == "white") {
            extraStyle= " background-color: grey;";
        } else {
            extraStyle = " background-color: white;";
        }
        threadTable
            .append("<div class='thread-color' style='color: "
            + color + ";" + extraStyle
            + " border-color:"
            + color + ";' >"
            + color
            + "<br> (" + threadData[i][1] + ")"
            + "</div><div class='threadData' style='background-color: "
            + color + ";"
            + " border-color: "
            + color + ";' >"
            + "</div>\n" );
    }
}

function doTartan(evt) {

    let id = $('#tartan option:selected').attr("value"),
        weave = $('#weave option:selected').attr("value"),
        forExport = $('#tartans input.forExport:checked').attr("value"),
        reverseThreads = $('#tartans input.reverse:checked').attr("value"),
        threads = $('#tartans input#threads').val();

    Log.Notice("threads=" + threads);

    if (reverseThreads == undefined) {
        reverseThreads = "no";
    }
    if (forExport == undefined) {
        forExport = "no";
    }
    if (parseInt(threads) > 3  && parseInt(threads) < 20000 ) {
        // do nothing
    } else {
        threads = 100;
    }

    Log.Notice("id= " + id + " threads='" + threads + "' weave =" + weave );

    if (parseInt(id) == 0) {
        return false;
    }

    myTartan = new Tartan(id, threads, forExport, reverseThreads, {side: weave * 2, threadBox: weave * 2});
}

function writeSvgImage() {

    let svgHandle = $("#svg1"),
        styleHandle = $("body style"),
        width = svgHandle.attr("width"),
        height = svgHandle.attr("height"),
        viewbox = "0 0 " + width + " " + height;

    subWindow = window.open(
        "#svg",  // url to open
        "example", // window name
        "height="
            + height + ",width=" + width + ",toolbar=yes,menubar=yes,"
            + "scrollbars=yes,resizable=yes,chrome=true,titlebar=true", // options
        "true" // replace (removes current document)
    );

    let svgDoc = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
        + "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" "
        + "\"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n";

    svgDoc += Tartan.svgData;

    subWindow.document.write(svgDoc);
}


