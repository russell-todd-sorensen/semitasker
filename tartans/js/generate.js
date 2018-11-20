// JavaScript Document

var svg;
var subWindow; // used in displaying svg in separate window

var Tartan = {
  threadX: 0,
  threadY: 0,
  currentPixelX: 0,
  currentPixelY: 0,
  side: 4,
  end: 2,
  threadBox: 4, // this.side / this.end * 2
  threadCount: 0,
  threadsToWeave: 0,
  svgData: "",

  currentClass: null,


  weave: function (colorArray, styleArray) {
   var svgBody = d3.select(document.body);
   var svgContainer =  svgBody.select("#svg-container");
   svgContainer.html("");
   var width = this.threadsToWeave * this.end;
   var height = width;

   svg = svgContainer
    .append("svg")
    .attr("version", "1.1")
    .attr("id", "Tartan-In-SVG")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("x", 0)
    .attr("y", 0)
    .attr('height', height)
    .attr('width', width)
    .attr('viewbox', "0 0 " + width + " " + height);

    this.writeStyle(svg, styleArray);

    var horizontalRows = svg
      .append("g")
      .attr("id","horizontal-rows")
      .attr("x", 0)
      .attr("y", 0);

    var x1, x2, y1, y2, cssClass;

    while (this.threadY < this.threadsToWeave) {
      //Log.Notice("threadY=" + this.threadY);
      x1 = (3 - (this.threadY + 3)%4)*this.end;
      if (x1 == 6) {x1 = -2;}
      y1 = (this.threadY + .5)*this.end;
      x2 = this.threadsToWeave * this.end;
      y2 = y1;
      cssClass = colorArray[this.threadY%this.threadCount];
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

    var verticalCols = svg
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
       y1 = (2 - this.threadX%4)*this.end;
       x2 = x1;
       y2 = this.threadsToWeave * this.end;
       cssClass = colorArray[this.threadX%this.threadCount];

      verticalCols
        .append("line")
        .attr("class", cssClass)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
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

    this.svgData = svgContainer.html();

  },
  writeStyle: function (svg, styleArray) {

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
    svg
      .append("style")
      .text(style);
  },
  getOptions: function (tartanOptions) {
    // nothing here yet
    for (option in tartanOptions) {
      this[option] = tartanOptions[option];
    }
  },
  init: function (inputArray, outputArray, styleArray, threadsToWeave, tartanOptions) {

    this.getOptions(tartanOptions);

    expandColorArray(inputArray, outputArray, styleArray);
    Log.Notice("outputArray=" + outputArray);
    this.threadCount = outputArray.length;
    if (arguments.length >= 4) {
      this.threadsToWeave = threadsToWeave;
    } else {
      this.threadsToWeave = this.threadCount;
    }

    this.weave2(outputArray, styleArray);

    Log.Notice("Finished with tartan");
  }
};

function expandColorArray(inArray, outArray, styleArray) {
  var index = 0;

  for (var i = 0; i<inArray.length; i++) {
    var color = inArray[i][0];
    var repeat = inArray[i][1];
    var found = false;
    var styleId;
    for (var k = 0; k < styleArray.length; k++) {
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
    for (var j = 0; j < repeat; j++) {
      outArray[index] = styleId;
      index++;
    }
  }

  // add reversed array
  for (var i = outArray.length -1; i >= 0; i--) {
    outArray[index] = outArray[i];
    index++;
  }
  Log.Notice("finished expandColorArray");
}

// calculate threads using tartan data
function calculateTartanThreads(data) {
  var threadCount = 0;
  for (var i = 0; i< data.length; i++) {
    threadCount += data[i][1] * 2;
  }
  return threadCount;
}

// calculate threads using tartan index
function calculateThreadCount(index) {
  var tartanData = dataset[index];
  var tartanName = tartanData[0];
  var tartanThreads = tartanData[1];
  var count = 0;
  for (var i = 0; i<tartanThreads.length;i++) {
    count += tartanThreads[i][1];
  }
  return [tartanName, count];
}

function loadTartan(id, threads, forExport,reverseThreads, tartanOptions) {
  if (parseInt(id) == 0) {
    return false;
  }

  var data = dataset[parseInt(id)][1];
  if (forExport === "yes") {
    threads = calculateTartanThreads(data);
  }

  Log.Notice("forExport=" + forExport + " data=" + data);
  datasetExp = new Array();
  dsStyleArray = new Array();

  if (reverseThreads === "yes") {
    var reverseData = new Array();
    for(var i = data.length-1; i >= 0; i--) {
      reverseData[reverseData.length] = data[i];
    }
    Tartan.init(reverseData, datasetExp, dsStyleArray, parseInt(threads), tartanOptions );
    generateThreadSchedule2(reverseData);
  } else {
    Tartan.init(data, datasetExp, dsStyleArray, parseInt(threads), tartanOptions );
    generateThreadSchedule2(data);
  }

}

function generateThreadSchedule(threadData) {

  var threadTable = $('#threadTable');
  var extraStyle = "";
  threadTable.html("<div class='threadData'>Thread Schedule</div>\n"); // clear out table
  for (var i = 0; i<threadData.length;i++) {
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

  var threadTable = $('#threadTable');
  var extraStyle = "";
  threadTable.html("<div class='threadDataHeader'>Thread Schedule</div>\n"); // clear out table
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
  var id = $('#tartan option:selected').attr("value");
  var weave = $('#weave option:selected').attr("value");
  var forExport = $('#tartans input.forExport:checked').attr("value")
  var reverseThreads = $('#tartans input.reverse:checked').attr("value")
  var threads = $('#tartans input#threads').val();
  Log.Notice("threads=" + threads);
  if (reverseThreads == undefined) {
    reverseThreads = "no";
  }
  if (forExport == undefined) {
    forExport = "no";
  }
   if (parseInt(threads) > 50  && parseInt(threads) < 1200 ) {
    // do nothing
  } else {
      threads = 50;
  }
  Log.Notice("id= " + id + " threads='" + threads + "' weave =" + weave );
  loadTartan(id, threads, forExport, reverseThreads, {side: weave * 2, threadBox: weave * 2});
}

function writeSvgImage() {

  var svgHandle = $("#svg1");
  var styleHandle = $("body style");

  var width = svgHandle.attr("width");
  var height = svgHandle.attr("height");
  var viewbox = "0 0 " + width + " " + height;

  subWindow = window.open(
   "#svg",  // url to open
   "example", // window name
   "height="
     + height + ",width=" + width + ",toolbar=yes,menubar=yes,"
     + "scrollbars=yes,resizable=yes,chrome=true,titlebar=true", // options
   "true" // replace (removes current document)
   );

  var svgDoc = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n"
  + "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" "
  + "\"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n";

  svgDoc += Tartan.svgData;

  subWindow.document.write(svgDoc);
}


Tartan.weave2 = function (colorArray, styleArray) {
  var svgBody = d3.select(document.body);
  var svgContainer =  svgBody.select("#svg-container");
  svgContainer.html("");
  var width = this.threadsToWeave * this.end;
  var height = width;

  svg = svgContainer
    .append("svg")
    .attr("version", "1.1")
    .attr("id", "Tartan-In-SVG")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("x", 0)
    .attr("y", 0)
    .attr('height', height)
    .attr('width', width)
    .attr('viewbox', "0 0 " + width + " " + height);

  this.writeStyle(svg, styleArray);

  var horizontalRows = svg
    .append("g")
    .attr("id","horizontal-rows")
    .attr("x", 0)
    .attr("y", 0);

  var x1, x2, y1, y2, cssClass;

  while (this.threadY < this.threadsToWeave) {

    x1 = 0;
    y1 = (this.threadY + .5)*this.end;
    x2 = this.threadsToWeave * this.end;
    y2 = y1;
    cssClass = colorArray[this.threadY%this.threadCount] + " ";
    cssClass += "hor-" + this.threadY % this.threadBox;
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

  var verticalCols = svg
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
     cssClass = colorArray[this.threadX%this.threadCount] + " ";
     cssClass += "vert-" + this.threadX % this.threadBox;
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

  this.svgData = svgContainer.html();

};
