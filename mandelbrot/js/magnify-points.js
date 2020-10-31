
var calculateColor = function (arr,col,row,width,height) {
        width = width?width:10;
        height= height?height:10;
    let base = 4*(width*row + col);
        //base = 40*(9-row) + col*4,
        r = arr[base++],
        g = arr[base++],
        b = arr[base++],
        a = Math.floor(arr[base]/2.55)/100;
    return `rgba(${r},${g},${b},${a})`;
};

var showPoints = function (containerId,cId,svgId,pointDim,pixelType) {
  containerId = containerId?containerId:"pointsContainer";
  cId = cId?cId:"coordsContainer";
  svgId = svgId?svgId:"all";
  pointDim = pointDim?pointDim:20;
  pixelType = pixelType?pixelType:"circle";

  let data    = CurrentData,
      len     = data.coord.length,
      coords  = [],
      container = d3.select("#" + containerId),
      coordCont = d3.select("#"+ cId),
      svg     = d3.select("#" + svgId),
      factor  = 1,
      xOffset = pointDim*1,
      yOffset = pointDim*1,
      radius  = pointDim/2-1,
      minX    = data.objectInfo.startX,
      minY    = data.objectInfo.startY,
      maxX    = data.objectInfo.endX,
      maxY    = data.objectInfo.endY,
      diffX   = maxX.minus(minX),
      diffY   = maxY.minus(minY),
      dx      = data.dx,
      dy      = data.dy,
      chartX  = 0,
      chartY  = 0,
      tmpCoord,
      color,
      width = data.objectInfo.width,
      height = data.objectInfo.height;

  for (let i=0;i<len;i++) {
      tmpCoord = data.coord[i];
      chartX = pointDim*tmpCoord.col + xOffset;
      chartY = pointDim*tmpCoord.row + yOffset;//180 - 20*tmpCoord.row;
      tmpCoord.chartX = chartX;
      tmpCoord.chartY = chartY;
      color = calculateColor(data.pixels,tmpCoord.col,tmpCoord.row,width,height);
      tmpCoord.color = color;
      tmpCoord.polarity = ((data.polarity[i])==true?1:-1);
      tmpCoord.count = CurrentData.counters[i];
      coords.push(tmpCoord);
  }

  // coord = {
  //   x:x,
  //   y:y,
  //   col:col,
  //   row:row,
  //   chartX:chartX,
  //   chartY:chartY,
  //   color:color
  // }
  let svgX      = pointDim*(-1).toString(),
      svgY      = pointDim*(-1).toString(),
      svgWidth  = width*pointDim + 60,
      svgHeight = height*pointDim + 60;

  svg
    .attr("x",svgX)
    .attr("y",svgY)
    .attr("width",svgWidth)
    .attr("height",svgHeight)
    .attr("viewBox",[svgX,svgY,svgWidth,svgHeight].join(" "));

  container.html("");

  if (pixelType == "circle") {
    container.selectAll("circle.point")
      .data(coords)
      .enter()
      .append('circle')
      .attr("id",function(d,i) {return "p-" + i})
      .attr("class","point")
      .attr("cx",function(d,i) {
        let x = d.chartX;
        return x;
      })
      .attr("cy", function (d,i) {
        let y = d.chartY;
        return y;
      })
      .attr("r", radius)
      .attr("fill",function(d,i) {
        return d.color;
      })
      .attr("title",function(d,i) {
        return `x=${d.x}, y=${d.y}, p=${d.polarity}`
      })
      .on("mouseover", function(d,i){
        document.getElementById("x-coord").innerHTML = `X: ${d.x}`;
        document.getElementById("y-coord").innerHTML = `Y: ${d.y}`;
        document.getElementById("polarity").innerHTML = `P: ${d.polarity}`;
        document.getElementById("iter-count").innerHTML = `C: ${d.count}`;
        coordCont
          .attr("transform",`translate(${d.chartX + 10}, ${d.chartY + 10})`);
      })
      .on("mouseout", function(d,i) {
        document.getElementById("x-coord").innerHTML = "X: ";
        document.getElementById("y-coord").innerHTML = "Y: "; 
        document.getElementById("polarity").innerHTML = "P: "; 
        document.getElementById("iter-count").innerHTML = "C: "; 
      });
  } else {

    container.selectAll("use")
      .data(coords)
      .enter()
      .append('use')
      .attr("href","#point-def-rect")
      .attr("id",function(d,i) {return `p-${i}`})
      .attr("class",function(d,i) {return `c-${d.count}`})
      .attr("x",function(d,i) {
        let x = d.chartX - radius;
        return x;
      })
      .attr("y", function (d,i) {
        let y = d.chartY - radius;
        return y;
      })
      .attr("fill",function(d,i) {
        return d.color;
      })
      .attr("title",function(d,i) {
        return `x=${d.x}, y=${d.y}, p=${d.polarity}`
      })
      .on("mouseover", function(d,i){
        document.getElementById("x-coord").innerHTML = `X: ${d.x}`;
        document.getElementById("y-coord").innerHTML = `Y: ${d.y}`;
        document.getElementById("polarity").innerHTML = `P: ${d.polarity}`;
        document.getElementById("iter-count").innerHTML = `C: ${d.count}`;
        coordCont
        .attr("transform",`translate(${d.chartX + 10}, ${d.chartY + 10})`);
      })
      .on("mouseout", function(d,i) {
        document.getElementById("x-coord").innerHTML = "X: ";
        document.getElementById("y-coord").innerHTML = "Y: "; 
        document.getElementById("polarity").innerHTML = "P: "; 
        document.getElementById("iter-count").innerHTML = "C: "; 
      });
  }
};