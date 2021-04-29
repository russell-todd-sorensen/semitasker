var popUpControl = function (d,i) {
    let id = d.id,
        [_,x,y] = id.split("-");
        x = parseInt(x);
        y = parseInt(y);

    let cellClass = id==d.m.startId?"C-start":"C-base",
        cell = d.m.celln[y][x],
        controls = d3.select("#controls");
        controls.html("");

    let popup = controls.append("g")
            .attr("id","popup")
            .attr("transform",`translate(${x*100},${y*100})`);

popup.append("use")
    .attr("id",`P-${y}-${x}`)
    .attr("href","#conf-cell-base")
    .attr("class",cellClass)
    .attr("x",0)
    .attr("y",0);
popup.append("use")
    .attr("id",`nw-${y}-${x}`)
    .attr("href","#hconf-base")
    .attr("class",`H-conf-${d.m.parts["H"][y][x]}`)
    .attr("x",0)
    .attr("y",0);
popup.append("use")
    .attr("id",`sw-${y+1}-${x}`)
    .attr("href","#hconf-base")
    .attr("class",`H-conf-${d.m.parts["H"][y+1][x]}`)
    .attr("x",0)
    .attr("y",100);
popup.append("use")
    .attr("id",`ew-${y}-${x+1}`)
    .attr("href","#vconf-base")
    .attr("class",`V-conf-${d.m.parts["V"][x+1][y]}`)
    .attr("x",100)
    .attr("y",0);
popup.append("use")
    .attr("id",`ww-${y}-${x}`)
    .attr("href","#vconf-base")
    .attr("class",`V-conf-${d.m.parts["V"][x][y]}`)
    .attr("x",0)
    .attr("y",0);

    console.log(`Hi from ${d.id} nw = ${cell.nw}, ew=${cell.ew}`);
}