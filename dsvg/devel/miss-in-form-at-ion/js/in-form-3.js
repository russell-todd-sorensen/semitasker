
// Globals which should be removed:
//var sols = {"example":null};
//var myMaze = {"example":null};

var mazes = [];

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

        this.initCell();
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
    name    = "";
    cname   = "";
    svgId   = "";
    config  = {};
    rows    = 11;
    cols    = 11;
    cells   = (this.rows) * (this.cols);
    scale   = 100;
    startId = "C-0-0";
    exitId  = `V-${this.rows}-${this.cols}`;
    pathEndId = null;
    WINDOW  = 5
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
    windows = [];
    flatCells  = [];
    endCells = {};
    initialized = false;
    perimeterType = this.WINDOW;
    locale  = "en_US";
    partLabels = {
        "en_US":["open","shut","lock","wall","exit"],
        "fr_FR":["ouverte","fermée","serrure","mur","sortie"],
        "phone":["off","shut","lock","on","space","window"]};

    constructor(config) {
        this.config = config;
        this.name = this.config["mazeName"];
        this.svgId = this.config["svgId"];
        for (const [key, value] of Object.entries(this.config)) {
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
    wallPerimeter(pType) {
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

        pType = (pType?pType:this.perimeterType);

        for (let i=0,r;i<hwal.length;i++) {
            r = hwal[i];
            for (let c=0;c<this.cols;c++) {
                this.parts["H"][r][c] = pType;
                this.windows[`H-${r}-${c}`] = pType;
            }
        }
        for (let j=0,c;j<vwal.length;j++) {
            c = vwal[j];
            for (let r=0;r<this.rows;r++) {
                this.parts["V"][c][r] = pType;
                this.windows[`V-${c}-${r}`] = pType;
            }
        }
    }
    markExit(exitId,mazeObj) {
        if (!mazeObj) {
            mazeObj = this;
        }
        if (exitId) {
            mazeObj.exitId = exitId;
        }
        let [t,i,j] = (mazeObj.exitId).split("-");
        i = parseInt(i);
        j = parseInt(j);

        switch (t) {
        case "V":
        case "H": 
            mazeObj.parts[t][i][j] = mazeObj.EXIT;
            break;
        default:
            mazeObj.parts["H"][mazeObj.rows][mazeObj.cols] = mazeObj.EXIT;
            mazeObj.exitId = `H-${mazeObj.rows}-${mazeObj.cols}`;
            break;
        }
        return mazeObj.exitId;
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
    removeWindow(wallId) {
        return this.configPart(wallId,this.OPEN);
    }
    insertWindow(wallId) {
        return this.configPart(wallId,this.WINDOW);
    }
    shutDoor(partId) {
        return this.configPart(partId,this.SHUT);
    }
    lockDoor(partId) {
        return this.configPart(partId,this.LOCK);
    }
    removeWalls(wallIds) {
        let results = [];
        for (let i=0;i<wallIds.length;i++) {
            results.push(this.removeWall(wallIds[i]));
        }
        return results;
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
        case this.WINDOW:
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
        case this.WINDOW:
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
    addLocale(locale,partitionTypeArray) {
        this.partLabels[locale] = partitionTypeArray; 
    }
    setLocale(locale) {
        this.locale = locale;
    }
    getLabel(state,locale) {
        locale = locale?locale:this.locale;
        return this.partLabels[locale][parseInt(state)];
    }
    draw(svgId,mazeObj) {
        svgId   = svgId?svgId:this.svgId;
        mazeObj = mazeObj?mazeObj:this;
        //d3.select(`#${svgId} #maze1`).html("");
        if (document.querySelector(`#${svgId}`)) {
            document.querySelector(`#${svgId}`).remove();
        }
        let template = d3.select(`#${mazeObj.svgTemplateId}`).html(),
            mazeName = mazeObj.name;

        d3.select("#mazes").append("div").attr("id",mazeName);
        d3.select(`#${mazeName}`).html(template);
        d3.select(`#${mazeName} #svgtmp`).attr("id",svgId);

        let svg = d3.select(`#${svgId}`),
            width = ((1+mazeObj.cols)*(mazeObj.scale)).toFixed(2),
            height = ((1+mazeObj.rows)*(mazeObj.scale)).toFixed(2),
            maze = svg
                .append("g")
                .attr("id","maze")
                .attr("transform",`translate(10,20) scale(${(mazeObj.scale/100).toFixed(2)})`),
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
            solns = maze
                .append("g")
                .attr("id","solns")
                .attr("transform","translate(0,0)"),
            controls = maze
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
            .data(mazeObj.hparts)
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
            .data(mazeObj.vparts)
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
        d3.selectAll(`#${mazeObj.startId}`).attr("class","C-start");
        svg
            .attr("x",0)
            .attr("y",0)
            .attr("width",width)
            .attr("height",height)
            .attr("viewBox",[0,0,width,height].join(" "));

        mazeObj.initialized = true;
    }
    solve(m) {
        m.setPathEndId();
        let FWD = 1,
            BWD = -1,
            currentCell = new Cell(m,m.startId,null),
            history = [currentCell],
            len = history.length,
            direction = FWD,
            nextMove = null,
            nextCell = null,
            state = null,
            solutions = [],
            bifs = [],
            maxSolutions = 1000,
            solCount = 0;

        while (len > 0) {
            if (direction == FWD) {
                // pop next dir from cell
                nextMove = currentCell.options.pop();
                state = m.getState(nextMove);
                if (state == m.EXIT) {
                    // solution reached
                    solCount++;
                    bifs.push(len);
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
    animateTo (data) {
        let partId = data.partId,
            desiredState = data.desiredState,
            m = data.m,
            delay = data.delay/2;
        
        const origState = m.getState(partId);

        if (typeof desiredState != "number"
            ||typeof origState != "number") 
        {
            return null;
        }

        if (origState === desiredState) {
            return desiredState;
        }

        let [pt,pxx,pyy] = partId.split("-"),
            currentState = origState,
            svgId = m.svgId,
            wallId,
            cellSelector,
            partSelector,
            px,
            py;

        switch (pt) {
        case "H":
            px = parseInt(pyy);
            py = parseInt(pxx);
            if (py == 0) {
                wallId="tnw";
            } else {
                py = py-1;
                wallId="tsw";
            }
            break;
        case "V":
            px = parseInt(pxx);
            py = parseInt(pyy);
            if (px == 0) {
                wallId="tww";
            } else {
                px = px-1;
                wallId="tew";
            }
            break;
        }

        cellSelector = `#${svgId} #C-${px}-${py}`;
        partSelector = `#${svgId} #${wallId}`;

        d3.select(cellSelector).dispatch("click");
        while (currentState != desiredState) {
            d3.select(partSelector).dispatch("click");
            currentState = m.getState(partId);
            if (currentState == origState) {
                break; // loop
            }
        }
        return currentState;
    }
    animateWalls (walls, delay, desiredState) {
        let len = walls.length;
        delay = parseInt(delay);
        desiredState = parseInt(desiredState);

        if (typeof desiredState != "number") {
            return desiredState;
        }
        if (typeof delay != "number") {
            return delay;
        } else
        if (delay < 10) {
            delay = 10;
        } else
        if (delay > 2000) {
            delay = 2000;
        }

        let queue = new Queue(),
            M = this;

        for (let i=0;i<len;i++) {
            queue.add(new QueueItem(queue,M.animateTo,i*delay,{queue:queue,delay:delay,m:M,partId:walls[i],desiredState:M.WALL}));
        }
        queue.start(queue,10);
    }
}

var popUpControl = function (d,i) {
    let id = d.id,
        [_,x,y] = id.split("-"),
        svgId = d.m.svgId;
        x = parseInt(x);
        y = parseInt(y);

    let cellClass = id==d.m.startId?"C-start":"C-base",
        cell = d.m.celln[y][x],
        controls = d3.select(`#${svgId} #controls`);
        controls.html("");

    let popup = controls.append("g")
            .attr("id","popup")
            .attr("transform",`translate(${x*100},${y*100})`);

    let toggles = popup.append("g")
            .attr("id", "wallToggles")
            .attr("x",0)
            .attr("y",0);

    let tnw = toggles.append("g")
            .attr("id","tnw")
            .attr("transform","");
    let tew = toggles.append("g")
            .attr("id","tew")
            .attr("transform","rotate(90,50,50)");
    let tsw = toggles.append("g")
            .attr("id","tsw")
            .attr("transform","rotate(180,50,50)");
    let tww = toggles.append("g")
            .attr("id","tww")
            .attr("transform","rotate(-90,50,50)");

    tnw.append("path")
        .attr("id","toggle-path-nw")
        .attr("d","M 8.5 6 L 91.5 6 L 75 22 L 25 22 Z");
    tnw.append("text")
        .attr("id","toggle-text-nw")
        .attr("x","50")
        .attr("y","17")
        .html(cell.m.getLabel(cell.m.getState(cell.nw)));

    tew.append("path")
        .attr("id","toggle-path-ew")
        .attr("d","M 8.5 6 L 91.5 6 L 75 22 L 25 22 Z");
    tew.append("text")
        .attr("id","toggle-text-ew")
        .attr("x","50")
        .attr("y","17")
        .html(cell.m.getLabel(cell.m.getState(cell.ew)));

    tsw.append("path")
        .attr("id","toggle-path-sw")
        .attr("d","M 8.5 6 L 91.5 6 L 75 22 L 25 22 Z");
    tsw.append("text")
        .attr("id","toggle-text-sw")
        .attr("x","50")
        .attr("y","17")
        .html(cell.m.getLabel(cell.m.getState(cell.sw)));

    tww.append("path")
        .attr("id","toggle-path-ww")
        .attr("d","M 8.5 6 L 91.5 6 L 75 22 L 25 22 Z");
    tww.append("text")
        .attr("id","toggle-text-ww")
        .attr("x","50")
        .attr("y","17")
        .html(cell.m.getLabel(cell.m.getState(cell.ww)));

    d3.select(`#${svgId} #tnw`)
        .data([{part:"nw",cell:cell}])
        .attr("class",`H-conf-${d.m.parts["H"][y][x]}`)
        .on("click",togglePartType);
    d3.select(`#${svgId} #tew`)
        .attr("class",`V-conf-${d.m.parts["V"][x+1][y]}`)
        .data([{part:"ew",cell:cell}])
        .on("click",togglePartType);
    d3.select(`#${svgId} #tsw`)
        .attr("class",`H-conf-${d.m.parts["H"][y+1][x]}`)
        .data([{part:"sw",cell:cell}])
        .on("click",togglePartType);
    d3.select(`#${svgId} #tww`)
        .attr("class",`V-conf-${d.m.parts["V"][x][y]}`)
        .data([{part:"ww",cell:cell}])
        .on("click",togglePartType);

    popup.append("rect")
        .data([d])
        .attr("id",`P-${y}-${x}`)
        .attr("class",cellClass)
        .attr("x",25)
        .attr("y",25)
        .on("dblclick",toggleCellType);

    console.log(`Hi from ${d.id} nw = ${cell.nw}, ew=${cell.ew}`);
}

var toggleCellType = function(d,i) {

    let cellType = d.m.getState(d.id),
        newState;

    console.log(`d=${d}, i=${i}, cellType=${cellType}`);
}

var togglePartType = function(d,i) {
    let partId = d.cell[d.part],
        partState = d.cell.m.getState(partId),
        [t,x,y] = partId.split("-"),
        label,
        newState,
        me = d3.select(this);
    switch (partState) {
    case 0:
    case 1:
    case 2:
        newState = 3;
        break;
    case 5:
        newState = 3;
        d.cell.m.windows[partId] = 5;
        break;
    case 3:
        if (d.cell.m.windows[partId]) {
            newState = 5;
        } else {
            newState = 0;
        }
        break;
    case 4:
        break;
    }

    d.cell.m.setState(partId,newState);
    label = d.cell.m.getLabel(newState);
    d3.select(`#${d.cell.m.svgId} #${partId}`).attr("class",[t,"part",newState].join("-"));
    me.attr("class",[t,"conf",newState].join("-"));
    me.select("text").html(label)

    console.log(`part ${partId} in state ${partState}`)
}

var drawSolution = function (gId,solnsArray,fixedDigits) {

    fixedDigits = fixedDigits?fixedDigits:3;

    let solnsGroup = d3.select(gId),
        mulFactor = Math.pow(10,fixedDigits),
        len = solnsArray.length,
        max = parseInt(100*mulFactor/len)/mulFactor,
        min = 0,
        delta = 1,
        baseX = 50,
        baseY = 50;
        delta = parseInt(-1*(((max+min)/2)*mulFactor))/mulFactor;

    if (delta > 5) {
        delta = -5;
    }

    baseX = parseInt((baseX - Math.floor(len * delta/2))*mulFactor)/mulFactor;
    baseY = baseX;
        
    for (let i=0,soln,slen;i<len;i++) {
        soln = solnsArray[i];
        slen = soln.length;

        let d = "",
            offset = delta,
            offsetX = parseInt((baseX+(offset*i))*mulFactor)/mulFactor,
            offsetY = parseInt((baseY+(offset*i))*mulFactor)/mulFactor;

        for (let j=0;j<slen;j++) {
            let op = j==0?"M":"L",
                [_,x,y] = soln[j].split("-");

            if (x=="N1") {
                x = -1;
            }
            if (y=="N1") {
                y = -1;
            }

            d += `${op} ${(x*100+offsetX).toFixed(fixedDigits)} ${(y*100+offsetY).toFixed(fixedDigits)} `
        }

        solnsGroup.append("path")
            .attr("id",`line-${i}`)
            .attr("d",d)
            .attr("fill","none")
            .attr("stroke",`hsla(${i*65},70%,50%,1.0)`);
    }
}

var clearSols = function(solutionsId) {
    d3.select(`#${solutionsId}`).html("");
}

var wallPerimeter = function(mazeNameId) {
    let mazeName = $(`#${mazeNameId}`).val();
    myMaze[mazeName].wallPerimeter();
}

var initMaze = function(mazeNameId,colsId,rowsId,startId,exitId,removeId,insertId) {
    let mazeName = $(`#${mazeNameId}`).val(),
        cols = parseInt($(`#${colsId}`).val()),
        rows = parseInt($(`#${rowsId}`).val()),
        startCellId = $(`#${startId}`).val(),
        exitWallId  = $(`#${exitId}`).val(),
        removeWalls = JSON.parse(($(`#${removeId}`).val().trim())||"[]"),
        insertWalls = JSON.parse(($(`#${insertId}`).val().trim())||"[]"),
        prevMazePtr = document.getElementById("maze1");

    if (prevMazePtr) {
        prevMazePtr.remove();
    }

    myMaze[mazeName] = new Maze({
        name:mazeName,
        cols:cols,
        rows:rows,
        startId:startCellId,
        exitId:exitWallId,
    });

    myMaze[mazeName].wallPerimeter();
    myMaze[mazeName].insertWalls(insertWalls);
    myMaze[mazeName].removeWalls(removeWalls);
    myMaze[mazeName].markExit(exitWallId,myMaze[mazeName]);
    myMaze[mazeName].setPathEndId();
    myMaze[mazeName].draw("svg2",myMaze[mazeName]);
}

var solveMaze = function(mazeNameId,statusId) {
    let mazeName = $(`#${mazeNameId}`).val();
    sols[mazeName] = myMaze[mazeName].solve(myMaze[mazeName]);
    $(`#${statusId}`).html(`Found: ${sols[mazeName].length} solutions`);
}

var drawSols = function (solId, mazeNameId) {
    let mazeName = $(`#${mazeNameId}`).val(),
        paths = sols[mazeName];
    drawSolution(`#${solId}`,paths);
}

var buildConfig = function (configName) {
    let configChain = [configName],
        currConfigName = configName + "";

    configsFinal[configName] = new Object();

    while (configs[currConfigName] && 
        configs[currConfigName].baseConfig) 
    {
        if (configs[currConfigName].baseConfig != null) {
            currConfigName = configs[currConfigName].baseConfig + "";
            configChain.push(currConfigName);
            continue;
        }
        break;
    }

    while (configChain.length) {
       Object.assign(configsFinal[configName],configs[configChain.pop()])
    }
    return configsFinal[configName];
}

var toggleMinimize = function (id) {
    let fs = $(`#${id}`),
        cssClass = "minimize";

    if (fs.hasClass(cssClass)) {
        fs.removeClass(cssClass);
    } else {
        fs.addClass(cssClass);
    }
}

var loadMaze = function(configName) {
    config= buildConfig(configName);
    let mazeName = config["mazeName"],
        M = mazes[mazeName] = new Maze(config);

    if (config.wallPerimeterP) {
        M.wallPerimeter(config.perimeterType);
    }
    M.markExit(config.exitId,M);
    M.setPathEndId();
    if (config.animate) {
        M.draw(config.svgId,M);
        M.animateWalls(config.addWalls,config.animateDelay,M.WALL);
    } else {
        M.insertWalls(config.addWalls);
        M.draw(config.svgId,M);
    }
}

var insertWallsSlowly = function(m) {

}

var replaceMaze = function(toReplaceConfig,replaceWithConfig) {
    let rConfig,toReplaceNode,nConfig,replaceWithNode;
    if (configsFinal[toReplaceConfig]) {
        rConfig = configsFinal[toReplaceConfig];
        toReplaceNode = document.getElementById(rConfig.mazeName);
        if (toReplaceNode == null) {
            return null;
        }
    } else {
        return null;
    }

    if (configsFinal[replaceWithConfig]) {
        nConfig = configsFinal[replaceWithConfig];
    }
    if (nConfig === rConfig) {
        toReplaceNode.setAttribute("id","removing") ;
        toReplaceNode = document.getElementById("removing");
        loadMaze(replaceWithConfig);
        nConfig = configsFinal[replaceWithConfig];
    } else {
        loadMaze(replaceWithConfig);
        nConfig = configsFinal[replaceWithConfig];
    }

    replaceWithNode = document.getElementById(nConfig.mazeName);

    if (replaceWithNode != null) {
        toReplaceNode.replaceWith(replaceWithNode);
    }

    return replaceWithNode;
}
