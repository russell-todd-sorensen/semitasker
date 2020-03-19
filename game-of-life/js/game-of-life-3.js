

var Games = new Array();
var animationFunctions = new Array();
var formData;

var gameOfLife = function (width, height, initData) {
    this.width = width;
    this.height = height;
    this.cellCount = this.height*this.width;
    this.initData = initData;
    this.cellState;// = new Array(this.cellCount);
    this.neighborhood;// = new Array(this.cellCount);
    this.cellNeighbors;// = new Array(this.cellCount);
    this.continueAnimation = false;

    this.init = function () {
        var cellIndex = 0;
        this.cellState = new Array(this.cellCount);
        this.neighborhood = new Array(this.cellCount);
        this.cellNeighbors = new Array(this.cellCount);
        var nb; // neighbor index array
        for (var row=0;row<this.height;row++) {
            for (var col=0;col<this.width;col++) {// note incr of cellIndex
                this.cellState[cellIndex] = 0;
                nb = new Object();
                nb.c = cellIndex;
                if (row>0) {
                    if (col>0) {
                        nb.nw = cellIndex-width-1;
                    }
                    else {
                        nb.nw = null;
                    }
                    nb.n = cellIndex-width;
                    if (col<width-1) {
                        nb.ne = cellIndex-width+1;
                    }
                    else {
                        nb.ne = null;
                    }
                }
                else {
                    nb.nw = nb.n = nb.ne = null;
                }
                if (col>0) {
                    nb.w = cellIndex-1;
                }
                else {
                    nb.w = null;
                }
                if (col<width-1) {
                    nb.e = cellIndex+1;
                }
                else {
                    nb.e = null;
                }
                if (row<height-1) {
                    if (col>0) {
                        nb.sw = cellIndex+width-1;
                    }
                    else {
                        nb.sw = null;
                    }
                    nb.s = cellIndex+width;
                    if (col<width-1) {
                        nb.se = cellIndex+width+1;
                    }
                    else {
                        nb.se = null;
                    }
                }
                else {
                    nb.sw = nb.s = nb.se = null;
                }
                this.cellNeighbors[cellIndex] = nb;
                cellIndex++;
            }
        }
    };
    this.randomSeed = function (percent) {
        var livingCellCount = Math.floor(this.cellCount * percent);
        var indexArray = new Array(this.cellCount);
        var indexChoice,cell;
        var swapIndex = indexArray.length;
        for (var i = 0; i<indexArray.length;i++) {
            //indexArray[i] = i;
            this.cellState[i] = (Math.random() <= percent ? 1 : 0);
        }
        return;
        for (var i = 0; i<livingCellCount;i++) {
            indexChoice = Math.floor(Math.random()*swapIndex);
            cell = indexArray[indexChoice];
            this.cellState[cell] = 1;
            indexArray[indexChoice] = swapIndex;
            swapIndex--;
        }
    };
    this.directions = ['nw','n','ne','w','e','sw','s','se'];
    this.pollNeighbors = function () {
        var total,dir,cell;
        for (var i=0;i<this.cellCount;i++) {
            cell = this.cellNeighbors[i];
            total = 0;
            for (var d in this.directions) {
                dir = this.directions[d];
                if (cell[dir] == null) continue;
                total += this.cellState[cell[dir]];
            }
            this.neighborhood[i] = total;
        }
    };
    this.pollNeighborParity = function () {
        var cell,total,parity;
        for (var i=0;i<this.cellCount;i++) {
            cell = this.cellNeighbors[i];
            total = this.cellState[i];
            if (cell['s'] != null)
                total += this.cellState[cell['s']];
            if (cell['w'] != null)
                total += this.cellState[cell['w']];
            if (cell['n'] != null)
                total += this.cellState[cell['n']];
            if (cell['e'] != null)
                total += this.cellState[cell['e']];

            parity = total%2;
            this.neighborhood[i] = parity;
        }
    };
    this.pollNeighborParity2 = function () {
        var cell,total,parity;
        for (var i=0;i<this.cellCount;i++) {
            cell = this.cellNeighbors[i];
            total = this.cellState[i];
            if (cell['sw'] != null)
                total += this.cellState[cell['sw']];
            if (cell['nw'] != null)
                total += this.cellState[cell['nw']];
            if (cell['ne'] != null)
                total += this.cellState[cell['ne']];
            if (cell['se'] != null)
                total += this.cellState[cell['se']];

            parity = total%2;
            this.neighborhood[i] = parity;
        }
    };
    this.pollNeighborNorthSouth1 = function () {
        var cell,totalNorthSouth,totalEastWest,parity;
        for (var i=0;i<this.cellCount;i++) {
            cell = this.cellNeighbors[i];
            totalNorthSouth = this.cellState[i];
            if (cell['s'] != null)
                totalNorthSouth += this.cellState[cell['s']];
            if (cell['n'] != null)
                totalNorthSouth += this.cellState[cell['n']];
            totalEastWest = this.cellState[i];
            if (cell['e'] != null)
                totalEastWest += this.cellState[cell['e']];
            if (cell['w'] != null)
                totalEastWest += this.cellState[cell['w']];

            parity = (totalNorthSouth-totalEastWest)%2;
            this.neighborhood[i] = parity;
        }
    };
    this.pollNeighborNorthSouth2 = function () {
        var cell,totalNorthSouth,totalEastWest,parity;
        for (var i=0;i<this.cellCount;i++) {
            cell = this.cellNeighbors[i];
            totalNorthSouth = this.cellState[i];
            if (cell['s'] != null)
                totalNorthSouth += this.cellState[cell['s']];
            if (cell['n'] != null)
                totalNorthSouth += this.cellState[cell['n']];
            totalEastWest = this.cellState[i];
            if (cell['e'] != null)
                totalEastWest += this.cellState[cell['e']];
            if (cell['w'] != null)
                totalEastWest += this.cellState[cell['w']];

            parity = (totalEastWest-totalNorthSouth)%2;
            this.neighborhood[i] = parity;
        }
    };
    this.pollNeighbor = function (cellId) {
        var cell = this.cellNeighbors[cellId];
        var total = 0;
        for (var d in this.directions) {
            dir = this.directions[d];
            if (cell[dir] == null) {
                continue;
            }
            total += this.cellState[cell[dir]];
        }

        return total;
    };
}

function createGameBoard(id,gameId) {
    document.getElementById(id).nodeValue="";
    var g = d3.select('#' + id);


    g.selectAll('rect')
        .data(Games[gameId].cellNeighbors)
        .enter()
        .append('rect')
        .attr('id',function(d,i) {return 'c-' + i;})
        .attr('height',cellDim)
        .attr('width',cellDim)
        .attr('rx',5)
        .attr('ry',5)
        .attr('x', function(d,i) {
            var col = i%width;
            return col*cellDim + xOffset;
        })
        .attr('y', function(d,i) {
            var row = Math.floor(i/width);
            return row*cellDim + yOffset;
        })
        .attr('fill', function (d,i) {
            if (Games[gameId].cellState[i] == 1) {
                return formData.data.fadeInColor;
            } else {
                return 'hsla(0,0%,0%,1.0)';
            }
         })
        .on('mouseover', function (d,i) {
            var cell = d3.select(this);
            var cellId = cell.attr('id');
            var idList = cellId.split('-');
            var id = parseInt(idList[1]);
            d3.select("#cellNumber").text(i);
            d3.select('#cellNeighbors').text(Games[gameId].neighborhood[i]);
        })
        .on('click', function (d,i) {
            // was processGameOfLifeForm()
            var objId = formData.data.objId;
            var myGame = Games[objId];

            if (myGame.cellState[i] == 1) {
                cellDie(formData.data,i);
            } else {
                cellAlive(formData.data,i);
            }
        })
        .on('mouseout', function (d,i) {

        });

     g.append('rect')
        .attr('x',xOffset)
        .attr('y',yOffset)
        .attr('height',cellDim*height)
        .attr('width',cellDim*width)
        .attr('id','boardBoundary');

}

////////////////// LIVE AND DIE FUNCTIONS ////////////

function cellDie (data,id) {

    var objId = data.objId;
    var myGame = Games[objId];

    d3.select('#c-' + id)
        .transition()
        .ease(data.ease)
        .duration(data.fadeOut)
        .attr('fill',data.fadeOutColor)
        .each('end', function (d,i) {
             // was processGameOfLifeForm()
            if (formData.data.persist) {
                return;
            }
            var objId = formData.data.objId;
            var myGame = Games[objId];
            var cell = d3.select(this);
            cell
                .transition()
                .ease(formData.data.ease)
                .duration(formData.data.fadeEnd)
                .attr('fill',data.fadeEndColor);
        });

    myGame.cellState[id] = 0;
}

function cellAlive (data,id) {

  var objId = data.objId;
  var myGame = Games[objId];

    d3.select('#c-' + id)
        .transition()
        .ease(data.ease)
        .duration(data.fadeIn)
        .attr('fill',data.fadeInColor);

    myGame.cellState[id] = 1;
}

animationFunctions[0] = function (data) {

    var objId = data.objId;
    var myGame = Games[objId];

    myGame.pollNeighbors();

    for (var i=0;i<myGame.cellCount;i++) {
        if (myGame.cellState[i] == 1) { // alive
            switch (myGame.neighborhood[i]) {
            case 2:
            case 3:
                break;
            default:
                cellDie(data,i);
                break;
            }
        }
        else { // dead
            switch (myGame.neighborhood[i]) {
            case 3:
                cellAlive(data,i);
                break;
            default:
                break;
            }
        }
    }

    return myGame.continueAnimation;
}

animationFunctions[1] = function (data) {

    var objId = data.objId;
    var myGame = Games[objId];

    myGame.pollNeighbors();

    for (var i=0;i<myGame.cellCount;i++) {
        switch (myGame.neighborhood[i]) {
        case 0:
        case 1:
        case 2:
        case 3:
            if (myGame.cellState[i] == 1) { // alive
                cellDie(data,i);
            }
            break;
        case 4:
            break; // no change
        case 5:
        case 6:
        case 7:
        case 8:
            if (myGame.cellState[i] == 0) { // dead
                cellAlive(data,i);
            }
            break;
        }
    }

    return myGame.continueAnimation;
}

animationFunctions[2] = function (data) { // one-out-of-eight

    var objId = data.objId;
    var myGame = Games[objId];

    myGame.pollNeighbors();

    for (var i=0;i<myGame.cellCount;i++) {
        switch (myGame.neighborhood[i]) {
        case 1:
            if (myGame.cellState[i] == 0) { 
                cellAlive(data,i);
            }
            break;
        default:
            break;
        }
    }

    return myGame.continueAnimation;
}

animationFunctions[3] = function (data) { // parity rule

    var objId = data.objId;
    var myGame = Games[objId];
    var parity;

    myGame.pollNeighborParity();

    for (var i=0;i<myGame.cellCount;i++) {
        parity = myGame.neighborhood[i];
        if (parity == myGame.cellState[i]) {
            continue; // no change in state;
        } else if (parity == 1) {
            cellAlive(data,i);
        } else {
            cellDie(data,i);
        }
    }
    return myGame.continueAnimation;
}

animationFunctions[4] = function (data) { // parity rule 2

    var objId = data.objId;
    var myGame = Games[objId];
    var parity;

    myGame.pollNeighborParity2();

    for (var i=0;i<myGame.cellCount;i++) {
        parity = myGame.neighborhood[i];
        if (parity == myGame.cellState[i]) {
            continue; // no change in state;
        } else if (parity == 1) {
            cellAlive(data,i);
        } else {
            cellDie(data,i);
        }
    }
    return myGame.continueAnimation;
}

animationFunctions[5] = function (data) { // north south 1

    var objId = data.objId;
    var myGame = Games[objId];
    var parity;

    myGame.pollNeighborNorthSouth1();

    for (var i=0;i<myGame.cellCount;i++) {
        parity = myGame.neighborhood[i];
        if (parity == myGame.cellState[i]) {
            continue; // no change in state;
        } else if (parity == 1) {
            cellAlive(data,i);
        } else {
            cellDie(data,i);
        }
    }

    return myGame.continueAnimation;
}
animationFunctions[6] = function (data) { // north south 2

    var objId = data.objId;
    var myGame = Games[objId];
    var parity;

    myGame.pollNeighborNorthSouth2();

    for (var i=0;i<myGame.cellCount;i++) {
        parity = myGame.neighborhood[i];
        if (parity == myGame.cellState[i]) {
            continue; // no change in state;
        } else if (parity == 1) {
            cellAlive(data,i);
        } else {
            cellDie(data,i);
        }
    }

    return myGame.continueAnimation;
}

var startAnimationPre = function() {

     // was processGameOfLifeForm()

    startAnimation(formData.id,formData.timeout,formData.data);
}

var startAnimation = function (animationFunctionId,timeout, data) {
    var objId = data.objId;
    var myGame = Games[objId];
    var animationFunction = animationFunctions[animationFunctionId];

    myGame.continueAnimation = true;

    if (timeout < 10) timeout = 10;

    scheduleFunction(animationFunction, timeout, true, true, data);
};

var stopAnimation = function() {
     // was processGameOfLifeForm()
    var data = formData.data;
    var objId = data.objId;
    var myGame = Games[objId];

    myGame.continueAnimation = false;
};

var processGameOfLifeForm = function () {

    var gameId=parseInt($('#gameId').val());

    return {
        id:parseInt($('#animationFunctionId option:selected').val()),
        timeout:parseInt($('#timeout').val()),
        data:{
            objId:gameId,
            randomSeedValue:parseFloat($('#randomSeedValue').val())/100,
            fadeIn:parseInt($('#fadeIn').val()),
            fadeInColor:$('#fadeInColor').val(),
            fadeOut:parseInt($('#fadeOut').val()),
            fadeOutColor:$('#fadeOutColor').val(),
            fadeEnd:parseInt($('#fadeEnd').val()),
            fadeEndColor:$('#fadeEndColor').val(),
            persist:($('#persist').attr('checked') == undefined ? false : true),
            cellsWide:parseInt($('#cellsWide').val()),
            cellsHigh:parseInt($('#cellsHigh').val()),
            ease:$('#ease option:selected').val(),
        }
    };
}

function gameInit() {

    formData = null;
    var gameboard = document.getElementById('gameBoard');
    gameboard.innerHTML = "";

    formData   = processGameOfLifeForm();
    var data   = formData.data;
    // these are global variables
    width      = data.cellsWide;
    height     = data.cellsHigh;
    var objId  = data.objId;

    Games[objId] = new gameOfLife(width,height,{});

    var myGame = Games[objId];

    myGame.init();
    myGame.randomSeed(data.randomSeedValue);

    createGameBoard('gameBoard',objId);
}
