
class Cell {
    id      = null;
    maze    = null;
    prevId  = null;
    options = [];
    optopen = [];
    enterId = null;
    exitId  = null;
    col     = null;
    row     = null;
    links   = null;
    dirs    = ["nw","ew","sw","ww"];

    constructor(maze, id, enterId) {
        this.maze = maze;
        this.id   = id;
        this.enterId = enterId;

        this.initCell()
    }
    initCell() {
        let [_,col,row] = this.id.split("-");
        this.row = row;
        this.col = col;
        this.links = this.maze.celln[row][col];
        if (this.links.id != this.id) { 
            console.log(`Error given id ${this.id} != found id ${this.links.id}`);
            return;
        }

        for (let i=0,dir;i<this.dirs.length;i++) {
            dir = this.dirs[i];
            
            if (this.links[dir] != this.enterId) {
                let dirState = this.maze.getState(this.links[dir]);
                if (dirState == this.maze.EXIT) {
                    this.options = [this.links[dir]];
                    return;
                } else
                if (dirState == this.maze.OPEN) {
                    this.options.unshift(this.links[dir]);
                    this.optopen.unshift(this.links[dir]);
                }
            }
        }
    }
    shutOrLockDoors(skipId) {
        let len = this.optopen.length;
        for (let i=0,linkId;i<len;i++) {
            linkId = this.optopen[i];
            if (linkId != this.enterId && linkId != skipId) {
                this.maze.shutOrLockDoor(linkId);
            }
        }
    }
    openOrUnlockDoors() {
        let len = this.optopen.length;
        for (let i=0,linkId;i<len;i++) {
            linkId = this.optopen[i];
            if (linkId != this.enterId) {
                this.maze.openOrUnlockDoor(linkId);
            }
        }
    }
}

class Maze {
    rows    = 11;
    cols    = 11;
    cells   = (this.rows) * (this.cols);
    scale   = 100;
    startId = "C-0-0";
    exitId  = `V-${this.rows}-${this.cols}`;
    pathEndId = null;
    EXIT    = 4;
    WALL    = 3;
    OPEN    = 0;
    SHUT    = 1;
    LOCK    = 2;
    ERROR   = -1;
    N       = 0;
    E       = 1;
    S       = 2;
    W       = 3;
    state   = [];
    celln   = [];
    parts   = [];
    hparts  = [];
    vparts  = [];
    flatCells  = [];
    endCells = {};
    initialized = false;

    constructor(config) {
        for (const [key, value] of Object.entries(config)) {
            this[key] = value;
        }
        this.setCells();
        this.setParts();
    }
    setCells(cols,rows) {
        if (cols) {
            this.cols = cols;
        }
        if (rows) {
            this.rows = rows;
        }
        this.cells = (this.rows) * (this.cols);
        for (let r=0;r<this.rows;r++) {
            this.celln[r] = [];
            for (let c=0,tmpCell;c<this.cols;c++) {
                tmpCell = {
                     m:this,
                     c:c,
                     r:r,
                    id:`C-${c}-${r}`,
                    nw:`H-${r}-${c}`,
                    ew:`V-${c+1}-${r}`,
                    sw:`H-${r+1}-${c}`,
                    ww:`V-${c}-${r}`,
                }
                this.celln[r][c] = tmpCell;
                this.flatCells.push(tmpCell);
            }
        }
    }
    setParts () {
        let n    = this.N,
            e    = this.E,
            s    = this.S,
            w    = this.W,
            wall = this.WALL,
            open = this.OPEN,
            hmax = this.rows+1,
            vmax = this.cols+1;

        this.parts["H"] = [];
        this.parts["V"] = [];

        for (let h=0;h<hmax;h++) {
            this.parts["H"][h] = [];
            for (let c=0;c<this.cols;c++) {
                this.parts["H"][h][c] = 0; 
            }
        }
        for (let v=0;v<vmax;v++) {
            this.parts["V"][v] = [];
            for (let r=0;r<this.rows;r++) {
                this.parts["V"][v][r] = 0; 
            }
        }
    }
    setPathEndId(peId) {

        if (peId) {
            this.pathEndId = peId;
        } else {
            let [t,i,j] = this.exitId.split("-"),
                row,
                col;
            i = parseInt(i);
            j = parseInt(j);
            switch (t) {
            case "H":
                if (i==0) {
                    row = "N1";
                } else {
                    row = i;
                }
                col = j;
                break;
            case "V": 
                if (i==0) {
                    col = "N1";
                } else {
                    col = i;
                }
                row = j;
                break;
            }
            this.pathEndId = `C-${col}-${row}`;
        }
    }
    wallPerimeter(logit) {
        let n    = this.N,
            e    = this.E,
            s    = this.S,
            w    = this.W,
            wall = this.WALL,
            open = this.OPEN,
            hmax = this.rows+1,
            vmax = this.cols+1,
            hwal = [0,this.rows],
            vwal = [0,this.cols];

        for (let i=0,r;i<hwal.length;i++) {
            r = hwal[i];
            for (let c=0;c<this.cols;c++) {
                this.parts["H"][r][c] = wall;
            }
        }
        for (let j=0,c;j<vwal.length;j++) {
            c = vwal[j];
            for (let r=0;r<this.rows;r++) {
                this.parts["V"][c][r] = wall;
            }
        }
    }
    markExit(exitId) {
        if (exitId) {
            this.exitId = exitId;
        }
        let [t,i,j] = (this.exitId).split("-");
        i = parseInt(i);
        j = parseInt(j);

        switch (t) {
        case "V":
        case "H": 
            this.parts[t][i][j] = this.EXIT;
            break;
        default:
            this.parts["H"][this.rows][this.cols] = this.EXIT;
            this.exitId = `H-${this.rows}-${this.cols}`;
            break;
        }
        return this.exitId;
    }
    wallStart(startId,state) {
        if (startId) {
            this.startId = startId;
        }

        let [t,x,y] = (this.startId).split("-");
        x = parseInt(x);
        y = parseInt(y);

        if (!state) {
            state = [null,this.wall,null,null];
        }
        for (let k=0;k<state.length;k++) {
            let st = state[k];

            if (st == null) continue;

            switch (k) {
            case this.N: 
                this.parts["H"][y][x] = st;
                break;
            case this.E: 
                this.parts["V"][x+1][y] = st;
                break;
            case this.S: 
                this.parts["H"][y+1][x] = st;
                break;
            case this.W: 
                this.parts["V"][x][y] = st;
                break;
            }
        }
    }
    configPart(id,action) {
        let [t,i,j] = (id).split("-");
        i = parseInt(i);
        j = parseInt(j);

        switch (t) {
        case "V":
        case "H": 
            this.parts[t][i][j] = action;
            break;
        default:
            error(`unknown type=${t} id=${id} action=${action}`)
            break;
        }
        return id;
    }
    adjacentCell(fromId,thruId) {
        let [_,fCol,fRow] = fromId.split("-"),
            [type,i,__] = thruId.split("-"),
            adjId = "C-",
            toCol,
            toRow;
            i = parseInt(i);

        switch (type) {
        case "H": 
            toCol = parseInt(fCol);
            if (parseInt(fRow) < i) {
                toRow = i;
            } else {
                toRow = i-1;
            }
            adjId = adjId + toCol + "-" + toRow
            break; 
        case "V":
            toRow = parseInt(fRow);
            if (parseInt(fCol) < i) {
                toCol = i;
            } else {
                toCol = i-1;
            }
            adjId = adjId + toCol + "-" + toRow;
            break;
        }
        return adjId;
    }
    removeWall(wallId) {
        return this.configPart(wallId,this.OPEN);
    }
    insertWall(wallId) {
        return this.configPart(wallId,this.WALL);
    }
    shutDoor(partId) {
        return this.configPart(partId,this.SHUT);
    }
    lockDoor(partId) {
        return this.configPart(partId,this.LOCK);
    }
    insertWalls(wallIds) {
        let results = [];
        for (let i=0;i<wallIds.length;i++) {
            results.push(this.insertWall(wallIds[i]));
        }
        return results;
    }
    openOrUnlockDoor(partId) {
        let [t,i,j] = (partId).split("-"),
            state = this.parts[t][i][j],
            newState = state;

        switch (state) {
        case this.OPEN: 
        case this.WALL: 
            break;
        case this.LOCK: 
            newState = this.SHUT;
            break;
        case this.SHUT: 
            newState = this.OPEN;
            break;
        default: 
            newState = this.ERROR;
            break;
        }
        if (newState != this.ERROR) {
            this.parts[t][i][j] = newState;
        }
        return newState;
    }
    shutOrLockDoor(partId) {
        let [t,i,j] = (partId).split("-"),
            state = this.parts[t][i][j],
            newState = state;

        switch (state) {
        case this.LOCK: 
        case this.WALL: 
            break;
        case this.OPEN: 
            newState = this.SHUT;
            break;
        case this.SHUT: 
            newState = this.LOCK;
            break;
        default: 
            newState = this.ERROR;
            break;
        }
        if (newState != this.ERROR) {
            this.parts[t][i][j] = newState;
        }
        return newState;
    }
    getState(partId) {
        if (partId) {
            let [t,i,j] = (partId).split("-");
            i = parseInt(i);
            j = parseInt(j);
            return this.parts[t][i][j];
        } else {
            return this.ERROR;
        }
    }
    setState(partId,state) {
        let [t,i,j] = (partId).split("-");
        i = parseInt(i);
        j = parseInt(j);
        this.parts[t][i][j] = state;
        return state;
    }
    draw(svgId,mazeObj) {
        d3.select(`#${svgId} #maze1`).html("");

        let svg = d3.select(`#${svgId}`),
            maze = svg
                .append("g")
                .attr("id","maze1")
                .attr("transform","translate(100,100)"),
            cells = maze 
                .append("g")
                .attr("id","cells")
                .attr("transform","translate(0,0)"),
            hwalls = maze
                .append("g")
                .attr("id","hwalls")
                .attr("transform","translate(0,0)"),
            vwalls = maze
                .append("g")
                .attr("id","vwalls")
                .attr("transform","translate(0,0)"),
            solns  = maze
                .append("g")
                .attr("id","solns")
                .attr("transform","translate(0,0)"),
            controls  = maze
                .append("g")
                .attr("id","controls")
                .attr("transform","translate(0,0)");
        
        // flatten cells 2dim array
        let flatCells = mazeObj.flatCells,
            rows = mazeObj.rows,
            cols = mazeObj.cols,
            parts = mazeObj.parts; //partitions (walls/doors)

        cells.html("");
        cells.selectAll("use")
            .data(flatCells)
            .enter()
            .append('use')
            .attr("id",function(d,i) {
                return d.id;
            })
            .attr("href","#cell-base")
            .attr("x",function(d,i) {
                return (d.c*100)
            })
            .attr("y",function(d,i) {
                return (d.r*100)
            })
            .attr("class","C-base")
            .attr("title",function(d,i) {
                return d.id;
            })
            .on("click",popUpControl)
            ;

        // flatten wall/doors
        let H = parts["H"],
            dim = 100;

        for (let y=0,r;y<H.length;y++) {
            r = H[y];
            for (let x=0,c;x<r.length;x++) {
                mazeObj.hparts.push({
                    x:x*dim,
                    y:y*dim,
                    idx:["H",y,x],
                    id:`H-${y}-${x}`,
                    state:r[x],
                    type:"H",
                });
            }
        }

        let V = parts["V"];

        for (let x=0,c;x<V.length;x++) {
            c = V[x];
            for (let y=0;y<c.length;y++) {
                mazeObj.vparts.push({
                    x:x*dim,
                    y:y*dim,
                    idx:["V",x,y],
                    id:`V-${x}-${y}`,
                    state:c[y],
                    type:"V",
                });
            }
        }

        hwalls.html("");
        hwalls.selectAll("use")
            .data(myMaze.hparts)
            .enter()
            .append("use")
            .attr("id",function(d,i) {
                return d.id;
            })
            .attr("href","#hwall-base")
            .attr("x",function(d,i) {
                return d.x;
            })
            .attr("y",function(d,i) {
                return d.y;
            })
            .attr("class",function(d,i) {
                return `${d.type}-part-${d.state}`
            })
            .on("click",function(d,i) {
                let wall = d3.select(this),
                    wallId = wall.attr("id");
                console.log(`Clicked on ${wallId} starting from ${mazeObj.startId}`);
            })
            ;

        vwalls.html("");
        vwalls.selectAll("use")
            .data(myMaze.vparts)
            .enter()
            .append("use")
            .attr("id",function(d,i) {
                return d.id;
            })
            .attr("href","#vwall-base")
            .attr("x",function(d,i) {
                return d.x;
            })
            .attr("y",function(d,i) {
                return d.y;
            })
            .attr("class",function(d,i) {
                return `${d.type}-part-${d.state}`
            });
        d3.select(`#${mazeObj.startId}`).attr("class","C-start");
        this.initialized = true;
    }
    solve(m) {
        let FWD = 1,
            BWD = -1,
            currentCell = new Cell(m,m.startId,null),
            history = [currentCell],
            len = history.length,
            direction = FWD,
            nextMove = null,
            nextCell = null,
            state = null,
            solutions = [];

        while (len > 0) {
            if (direction == FWD) {
                // pop next dir from cell
                nextMove = currentCell.options.pop();
                state = m.getState(nextMove);
                if (state == m.EXIT) {
                    // solution reached
                    let sol = [];
                    for (let i=0;i<len;i++) {
                        sol.push(history[i].id) 
                    }
                    if (m.pathEndId) {
                        sol.push(m.pathEndId)
                    }
                    solutions.push(sol);
                    direction = BWD;
                } else
                if (state == m.OPEN) {
                    // possible shut/lock doors
                    currentCell.shutOrLockDoors(nextMove);
                    // move to next cell
                    nextCell = m.adjacentCell(currentCell.id,nextMove);
                    history.push(new Cell(m,nextCell,nextMove));
                    len++;
                    currentCell = history[len-1]
                } else { // reached end of options
                    direction = BWD;
                }
                
            } else {
                currentCell.openOrUnlockDoors();
                history.pop();
                len--;
                if (len > 0) {
                    currentCell = history[len-1];
                    currentCell.openOrUnlockDoors();
                }
                direction = FWD;
            }
        }
        return solutions; 
    }
}

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
        .attr("id", "wallToggles")
        .attr("href","#toggles")
        .attr("x",0)
        .attr("y",0);

    d3.select("#tnw")
        .data([{part:"nw",cell:cell}])
        .attr("class",`H-conf-${d.m.parts["H"][y][x]}`)
        .on("click",togglePartType);
    d3.select("#tew")
        .attr("class",`V-conf-${d.m.parts["V"][x+1][y]}`)
        .data([{part:"ew",cell:cell}])
        .on("click",togglePartType);
    d3.select("#tsw")
        .attr("class",`H-conf-${d.m.parts["H"][y+1][x]}`)
        .data([{part:"sw",cell:cell}])
        .on("click",togglePartType);
    d3.select("#tww")
        .attr("class",`V-conf-${d.m.parts["V"][x][y]}`)
        .data([{part:"ww",cell:cell}])
        .on("click",togglePartType);

    popup.append("use")
        .data([d])
        .attr("id",`P-${y}-${x}`)
        .attr("href","#conf-cell-base")
        .attr("class",cellClass)
        .attr("x",25)
        .attr("y",25)
        .on("dblclick",toggleCellType)
    console.log(`Hi from ${d.id} nw = ${cell.nw}, ew=${cell.ew}`);

    
}

var toggleCellType = function(d,i) {
    console.log(`d=${d}, i=${i}`);
}
var togglePartType = function(d,i) {    
    let partId = d.cell[d.part],
        partState = d.cell.m.getState(partId);

    console.log(`part ${partId} in state ${partState}`)
}

var drawSolution = function (gId,solnsArray) {
    let solnsGroup = d3.select(gId),
        len = solnsArray.length,
        max = (100/len).toFixed(2),
        min = 1,
        delta = 1,
        baseX = 50,
        baseY = 50;
        delta = -1*(((max+min)/2).toFixed(2));

    if (delta > 5) {
        delta = -5;
    }

    baseX = baseX - Math.floor(len * delta/2)
    baseY = baseX;
        
    for (let i=0,soln,slen;i<len;i++) {
        soln = solnsArray[i];
        slen = soln.length;
        let d = "",
            offset = delta,
            offsetX = baseX+(offset*i),
            offsetY = baseY+(offset*i);
        for (let j=0;j<slen;j++) {
            let op = j==0?"M":"L",
                [_,x,y] = soln[j].split("-");
                if (x=="N1") {
                    x = -1;
                }
                if (y=="N1") {
                    y = -1;
                }

            d += `${op} ${x*100+offsetX} ${y*100+offsetY} `
        }
        solnsGroup.append("path")
            .attr("id",`line-${i}`)
            .attr("d",d)
            .attr("fill","none")
            .attr("stroke",`hsla(${i*50},70%,50%,1.0)`);
    }
}

