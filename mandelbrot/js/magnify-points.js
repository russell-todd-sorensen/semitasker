
var calculateColor = function (arr,col,row) {
    let base = 40*(9-row) + col*4,
        r = arr[base++],
        g = arr[base++],
        b = arr[base++],
        a = Math.floor(arr[base]/2.55)/100;
      return `rgba(${r},${g},${b},${a})`;
};

var showPoints = function (containerId) {
  let data    = CurrentData,
      len     = data.coord.length,
      coords  = [],
      container = d3.select("#" + containerId),
      factor  = 1,
      xOffset = 10,
      yOffset = 10,
      minX    = data.objectInfo.startX,
      minY    = data.objectInfo.startY,
      maxX    = data.objectInfo.endX,
      maxY    = data.objectInfo.endY,
      diffX   = maxX - minX,
      diffY   = maxY - minY,
      dx      = data.dx,
      dy      = data.dy,
      chartX  = 0,
      chartY  = 180,
      tmpCoord,
      color;

  for (let i=0;i<len;i++) {
      tmpCoord = data.coord[i];
      chartX = 0 + 20*tmpCoord.col;
      chartY = 180 - 20*tmpCoord.row;
      tmpCoord.chartX = chartX;
      tmpCoord.chartY = chartY;
      color = calculateColor(data.pixels,tmpCoord.col,tmpCoord.row);
      tmpCoord.color = color;
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

  container.selectAll("circle.point")
    .data(coords)
    .enter()
    .append('circle')
    .attr("id",function(d,i) {return "p-" + i})
    .attr("class","point")
    //.attr("xlink:href","#point-def-circle")
    .attr("cx",function(d,i) {
      let x = d.chartX;
      return x;
    })
    .attr("cy", function (d,i) {
      let y = d.chartY;
      return y;
    })
    .attr("r", 9)
    .attr("fill",function(d,i) {
      return d.color;
    })
    .attr("title",function(d,i) {
      return `x=${d.x}, y=${d.y}`
    });
};