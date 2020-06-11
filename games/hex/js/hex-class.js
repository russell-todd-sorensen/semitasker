// Game of Hex using javascript / d3.js graphics in SVG

//var move = 0;
//var backingHexFill = "rgba(150,200,25,.85)";
//var largeHexFill = "rgba(150,200,25,.40)";
//var hexSide = 75;

//var startingCentroid = [325,350];

// Default hexagon attributes
//var hexAttrs = {
//    "fill": "#faa",
//    "class": "hexagon",
//    "stroke": "#231F20",
//    "stroke-miterlimit": 10
//};

class playHex {

    // d3 references
    move = 0;
    svg = d3.select("svg");
    body = d3.select("body");
    rules = this.body.select("#rules");
    player1 = this.rules.select(".player1");
    player2 = this.rules.select(".player2");
    largeMatrix = new Array();
    specialMatrix = new Array();
    largeMatrixIndex = 0;

    ///// Following are the defaults used in constructor:
    startingCentroid = [325,350];
    hexSide = 75;
    hexAttrs = {
        "fill": "#faa",
        "class": "hexagon",
        "stroke": "#231F20",
        "stroke-miterlimit": 10
    };
    backingHexFill    = "rgba(150,200,25,.85)";
    largeHexFill      = "rgba(150,200,25,.40)";
    ////////// Finish constructor supplied options

    directions        = ["n", "ne", "e", "se","s","sw", "w", "nw"];
    directionsRight   = ["center", "ne", "e", "se", "s"];
    specialDirections = ["center", "w", "nnw", "nne", "e", "sse", "ssw"];
    allDirections     = ["n", "nne", "ne", "e", "se", "sse", "s", "ssw", "sw", "w", "nw", "nnw"];
    innerHexagon;
    innerInnerHexagon;
    centroid;
    innerCentroid;

    // *********************************************************************** //
    // functions used here

    arrayToPoints(array) {
        let i = -1,
            sides = array.length,
            svgPoints = "";

        while (++i<sides) {
            svgPoints += array[i][0] + "," + array[i][1] + " ";
        }

        return svgPoints;
    };
    trim(num,by) {
        by = by?by:1000;
        return Math.round(num*by)/by;
    }
    createHexPointsArray (side, centroid) {

        // side  = distance from pointy side to center
        // xyDim = distance from flat side to center
        let hexagon = new Array(6),
            xyDim   = Math.cos(Math.PI/6)*side;

        hexagon[0] = [this.trim(centroid[0] - side/2), this.trim(centroid[1] - xyDim)];
        hexagon[1] = [this.trim(centroid[0] + side/2), this.trim(centroid[1] - xyDim)];
        hexagon[2] = [this.trim(centroid[0] + side),   this.trim(centroid[1])        ];
        hexagon[3] = [this.trim(centroid[0] + side/2), this.trim(centroid[1] + xyDim)];
        hexagon[4] = [this.trim(centroid[0] - side/2), this.trim(centroid[1] + xyDim)];
        hexagon[5] = [this.trim(centroid[0] - side),   this.trim(centroid[1])        ];

        return hexagon;
    };

    createSvgHexagon(svg, hexagon, hexAttrs) {

        let alen = arguments.length;

        if(alen < 3) {
            hexAttrs = this.hexAttrs;
        }

        svg
        .append("polygon")
        .attr(hexAttrs)
        .attr("points", this.arrayToPoints(hexagon));

        return hexagon;
    };

    getPolyCentroid(polygon) {
        return d3.geom.polygon(polygon).centroid();
    };

    getAdjacentCentroid(side, centroid, direction, scale) {
    
        let alen = arguments.length;
        if (alen < 4) {
            scale = 1;
        }

        // generate centroid x=scale
        side *= scale;

        let xyDim = Math.cos(Math.PI/6)*side,
            newCentroid = new Array(2);

        switch (direction) {// primary directions:
        case "s": 
            newCentroid = [centroid[0], centroid[1] + 2*xyDim];
            break;        
        case "n":
            newCentroid = [centroid[0], centroid[1] - 2*xyDim];
            break;
        case "nw": 
            newCentroid = [centroid[0]-3/2*side, centroid[1]-xyDim];
            break;
        case "ne":
            newCentroid = [centroid[0]+3/2*side, centroid[1]-xyDim];
            break;
        case "se":
            newCentroid = [centroid[0]+3/2*side, centroid[1]+xyDim];
            break;
        case "sw":
            newCentroid = [centroid[0]-3/2*side, centroid[1]+xyDim];
            break;
        // secondary directions (not really adjacent):
        case "w":
            newCentroid = [centroid[0]-3*side, centroid[1]];
            break;
        case "e":
            newCentroid = [centroid[0]+3*side, centroid[1]];
            break;
        case "nne": 
            newCentroid = [centroid[0] + 3/2*side, centroid[1] - 3*xyDim];
            break;
        case "nnw": 
            newCentroid = [centroid[0] - 3/2*side, centroid[1] - 3*xyDim];
            break;
        case "ssw": 
            newCentroid = [centroid[0] - 3/2*side, centroid[1] + 3*xyDim];
            break;
        case "sse": 
            newCentroid = [centroid[0] + 3/2*side, centroid[1] + 3*xyDim];
            break;
        case "self":
        case "center":
            newCentroid = [centroid[0], centroid[1]];
            break;
        default: 
            Log.Error("unknown direction: '" + direction + "'");
            break;
        }

        return [this.trim(newCentroid[0]), this.trim(newCentroid[1])]
    };


    generateCentroids (matrix, centroid, side, directions, scale) {
        if (arguments.length < 5) {
            scale = 1;
        }
        for (var j in directions) {
            matrix[matrix.length] = this.getAdjacentCentroid(side, centroid, directions[j], scale);
        }
    };

    getDirectionMap(direction) {

        let map;

        switch (direction) {
        case "nne":
            map = ["e", "sse", "ssw", "w", "nnw"];
            break;
        case "e":
            map = ["sse", "ssw", "w", "nnw", "nne",];
            break;
        case "sse":
            map = ["ssw", "w","nnw", "nne", "e",];
            break;
        case "ssw":
            map = ["w", "nnw", "nne", "e", "sse",];
            break;
        case "w":
            map = ["nnw", "nne", "e", "sse", "ssw",];
            break;
        case "nnw":
            map = ["nne", "e", "sse", "ssw", "w",];
            break;
        case "center":
        case "self":
            map = ["nnw", "nne", "e", "sse", "ssw", "w",];
            break;
        }

        return map;
    }

    constructor(startingCentroid,hexSide,hexAttrs,backingHexFill,largeHexFill) {
        let hex = [];
        if (startingCentroid && startingCentroid.length == 2) {
            this.startingCentroid = startingCentroid;
        }
        if (hexSide) {
            this.hexSide = hexSide;
        }
        if (hexAttrs) {
            this.hexAttrs = hexAttrs;
        }
        if (backingHexFill) {
            this.backingHexFill = backingHexFill;
        }
        if (largeHexFill) {
            this.largeHexFill = largeHexFill;
        }

        this.generateCentroids(this.largeMatrix, this.startingCentroid, 
            this.hexSide, this.specialDirections )

        // Copy of matrix used to fill in blanks
        for (let i = 0; i<this.largeMatrix.length; i++) {
            this.specialMatrix[i] = this.largeMatrix[i];
        }

        this.generateCentroids(this.largeMatrix, this.startingCentroid, 
            this.hexSide, ["n", "ne",  "se", "s", "sw", "nw"]);

        // add in extra centroids at 2x 
        this.generateCentroids(this.largeMatrix, this.startingCentroid, 
            this.hexSide, ["n", "ne", "se", "s", "sw", "nw"], 2);

        // Create large backing hexagon.
        let backingHexAttrs = new Object(this.hexAttrs);
        backingHexAttrs.class="backing-hexagon";
        backingHexAttrs.fill = this.backingHexFill;
        backingHexAttrs.transform="rotate(" 
            + 30 
            + ", " 
            + this.startingCentroid[0] + ", " 
            + this.startingCentroid[1] + ")";

        hex = this.createHexPointsArray(9.3*this.hexSide*Math.cos(Math.PI/3),
             this.startingCentroid);

        this.createSvgHexagon(this.svg, hex, backingHexAttrs);

        // create secondary large backing hexagons
        let largeHexAttrs = new Object(this.hexAttrs);
        largeHexAttrs.class="large-hexagon";
        largeHexAttrs.fill = this.largeHexFill;
        largeHexAttrs.transform="";

        for (let i = 0; i<this.largeMatrix.length; i++) {
            hex = this.createHexPointsArray(this.hexSide, this.largeMatrix[i]);
            this.createSvgHexagon(this.svg, hex, largeHexAttrs);
            Log.Notice("hex i=" + i + " at=" + this.largeMatrix[i]);
        }

        let miniMatrix = new Array();
        for (let i = 0; i<this.largeMatrix.length;i++) {
            this.generateCentroids(miniMatrix, this.largeMatrix[i],
                this.hexSide/3, ["center", "n", "ne", "se", "s", "sw", "nw"]);
        }

        // add in special stuff
        for (let i = 0; i< this.specialMatrix.length; i++) {
            this.generateCentroids(miniMatrix, this.specialMatrix[i],
                this.hexSide/3, this.getDirectionMap(this.specialDirections[i]));
        }

        let miniData = new Array();
        this.hexAttrs.fill = "#999";
        this.hexAttrs.class = "hexagon";

        for (let i = 0; i< miniMatrix.length; i++) {
            hex = this.createHexPointsArray(this.hexSide/3, miniMatrix[i]);
            miniData[i] = {
                thisObj: this,
                "side": this.hexSide/3,
                "class": "hexagon",
                "centroid": miniMatrix[i],
                "hex": hex,
                "filled": false,
                "fill": "#999"
            }
            this.createSvgHexagon(this.svg, hex, this.hexAttrs);
        }
        this.svg
        .selectAll("polygon.hexagon")
        .data(miniData)
        .attr("fill","#fff")
        .transition("bounce-out-in")
        .delay(function (d, i) { return i * 200;})
        .duration(1400)
        .attr("stroke-dashoffset",0)
        .attr(this.hexAttrs)
        .attr("stroke-width",(d,i) => { return 0.5 })
        //.attr("stroke-linecap","round")
        //.attr("stroke-dasharray",(d,i) => {
        //    return "0 30.1";
        //})
        .attr("opacity", function (d,i) { 
            //return 1.1 - 1/( Math.ceil((i+1)/6));
            return .75;
        });
         
        this.svg
        .selectAll("polygon.hexagon")
        .on("click", function(d,i) {
            d3
            .select(this)
            //.transition()
            //.ease("bounce-in-out")
            //.duration(2000)
            .attr("fill", function(d,i) {
                let move = (d.thisObj.move++ + 1);
                if (!d.filled) {
                    let attrs;
                    d.filled = true;
                    //d.fill = (move%2 ?"#a3f":"#f3a");

                    if (move%2) {
                        Log.Notice("move=" + move + ", now player= player1" );
                        attrs = {"class":"token-player1"};
                        d.thisObj.player2
                            .attr("style", "border-color='#900'");
                        d.thisObj.player1
                            .attr("style", "border-color='silver'");
                    } else {
                        Log.Notice("move=" + move + ", now player= player2" );
                        attrs = {"class":"token-player2"};
                        d.thisObj.player2
                            .style("border-color","#900");
                        d.thisObj.player1
                            .style("border-color","silver");
                    }
                    d.thisObj.svg.insert("circle")
                        .attr("cx", d.centroid[0])
                        .attr("cy", d.centroid[1])
                        .attr("r",  d.side * Math.cos(Math.PI/6))
                        .attr(attrs);
                    if (false) {
                        d3.select(this)
                        .append("animation")
                        .attr("attributeName","stroke-dashoffset")
                        .attr("begin","0s")
                        .attr("dur","1s")
                        .attr("from","0")
                        .attr("to","30.1")
                        .attr("repeatCount","indefinite");
                    }
                }
                return d.fill;
            });
        });
    }; // end constructor
};
