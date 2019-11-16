
var Go = {
    move: 0,
    side: 35,
    lines: 19,
    origin: [25, 25],
    states: ["empty", "t1", "t2", "dead"],

    lineAttrs: {
        "fill": "none",
        "class": "goline",
        "stroke": "#231F20",
        "stroke-width": 1,
        "stroke-miterlimit": 10
    },

    dotAttrs: {
        "fill": "rgba(0,0,0,.85)",
        "class": "godot",
        "stroke": "none",
        "r": 4
    },

    tokenAttrs: {
        "fill": "rgba(0,0,0,.1)", // don't show the token right away!
        "class": "gotoken",
        "stroke": "#231F20",
        "stroke-width": 1,
        "stroke-miterlimit": 10,
        "r": (this.side - 1) / 2
    },

    // Build this into something useful for finding enclosed regions:
    tokenData: new Array(),

    player1Tokens: new Array(),
    player2Tokens: new Array(),
    neighbors: new Array(),

    getNeighbors2: function () {
        // min and max indexes
        var id = 0;
        var minDim = 1;
        var maxDim = this.lines - 2;
        var colPlus1, rowPlus1, colMinus1, rowMinus1;
        var tmp;

        for (var row = minDim; row <= maxDim; row++) {

            this.neighbors[row] = new Array();
            for (var col = minDim; col <= maxDim; col++) {
                // add points East/South,West then North:
                tmp = new Object();
                tmp.adjacent = new Array();
                colPlus1 = col + 1;
                colMinus1 = col - 1;
                rowPlus1 = row + 1;
                rowMinus1 = row - 1;
                var ne = se = sw = nw = 0;
                // East
                if (colPlus1 <= maxDim) {
                    tmp.adjacent[tmp.adjacent.length] = [row, colPlus1];
                    ne = se = 1;
                }
                if (rowPlus1 <= maxDim) {
                    tmp.adjacent[tmp.adjacent.length] = [rowPlus1, col];
                    if (ne == 1) {
                        tmp.adjacent[tmp.adjacent.length] = [rowPlus1, colPlus1];
                        ne = 2;
                    }
                    nw = 1;
                }
                if (colMinus1 >= minDim) {
                    tmp.adjacent[tmp.adjacent.length] = [row, colMinus1];
                    if (nw == 1) {
                        nw = 2;
                        tmp.adjacent[tmp.adjacent.length] = [rowPlus1, colMinus1]
                    }
                    sw = 1;
                }
                if (rowMinus1 >= minDim) {
                    tmp.adjacent[tmp.adjacent.length] = [rowMinus1, col];
                    if (sw == 1) {
                        sw = 2;
                        tmp.adjacent[tmp.adjacent.length] = [rowMinus1, colMinus1];
                    }
                    if (se == 1) {
                        se = 2;
                        tmp.adjacent[tmp.adjacent.length] = [rowMinus1, colPlus1];
                    }
                }

                if (tmp.adjacent.length < 8) {
                    tmp.edge = true;
                } else {
                    tmp.edge = false;
                }

                tmp.generation = 0;
                tmp.from = [0, 0];
                tmp.flood = "dry";   // dry, filling, full, wet 
                tmp.state = "empty"; // "empty","t1","t2"
                tmp.filled = false;
                tmp.player = false;
                tmp.col = col;
                tmp.row = row;
                tmp.id = id++;
                this.neighbors[row][col] = tmp;
            }
        }
    },

    flood: function (tokenType) {

        var marked = 0;
        var generation = 0;
        var data = this.tokenData;
        var adjacent;

        // loop continuously over tokenData until no new marked tokens
        for (var i = 0; i < data.length; i++) {
            if (data[i].edge && (data[i].state != tokenType)) {
                data[i].flood = "filling";
                data[i].generation = generation;
                marked++;
            } else if (data[i].edge && data[i].state == tokenType) {
                data[i].flood = "wet";
                data[i].generation = generation;
            } else {
                Log.Notice("skipped d.col=" + data[i].col + " d.row=" + data[i].row);
            }
        }

        generation++;
        while (marked > 0) {
            marked = 0;
            for (var i = 0; i < data.length; i++) {
                if ((data[i].generation == generation - 1) && data[i].flood == "filling") {

                    // cell neighbors:
                    adjacent = data[i].adjacent;

                    for (var j = 0; j < adjacent.length; j++) {

                        var coord = adjacent[j];
                        var adjacentId = this.neighbors[coord[0]][coord[1]].id;

                        // if not an edge and not the current players token and cell is dry do this
                        if (!data[adjacentId].edge
                            && (data[adjacentId].state != tokenType)
                            && (data[adjacentId].flood == "dry")
                        ) {
                            data[adjacentId].from = [data[i].row, data[i].col];
                            data[adjacentId].generation = generation;
                            data[adjacentId].flood = "filling";
                            marked++;
                        } else if (data[adjacentId].state == tokenType) {
                            data[adjacentId].flood = "wet";
                        }
                    } // end for j<adjacent.length

                    // never use this cell again
                    data[i].flood = "full";
                } // end data[i].flood = "filling"
            } // end for i<lata.length

            Log.Notice("Marked " + marked + " cells in generation " + generation);
            generation++;
            // just go through once right now
            //break;
        }

        var full = 0;
        var playerTokens = 0;
        var dry = 0;
        var wet = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].flood == "full") {
                full++;
            }
            if (data[i].flood == "dry") {
                if (data[i].state != "empty") {
                    data[i].filled = false;
                    data[i].state = "empty";
                }
                dry++;
            }
            if (data[i].flood == "wet") {
                wet++;
            }
            if (data[i].state == tokenType) {
                playerTokens++;
            }

        }
        //var score = playerTokens - wet + dry;

        Log.Notice("Dry=" + dry + " Full=" + full + " Wet=" + wet + " playerTokens=" + playerTokens);

        // reset flooding state
        //data[i].flood = "dry";
        svg.selectAll("circle.gotoken")
            .data(this.tokenData)
            .transition()
            .delay(function (d, i) { return 50 * (d.generation + 1); })
            .duration(function (d, i) {
                return (d.flood == "full" ? 200 : 400);
            })
            .ease("linear")
            .attr("fill", function (d, i) {
                return (d.flood == "full" ? "rgba(0,0,255,.5)" : d.fill);
            })
            .each("end", function (d, i) {
                d3.select(this)
                    .transition()
                    .delay(500)
                    .attr("fill", d.fill);
                d.flood = "dry";
            });

        Log.Notice("finished marking " + marked + " cells");
        // do something with the data
    },

    init: function () {
        for (var i = 1; i < this.lines; i++) {
            this.player1Tokens[i] = new Array();
            this.player2Tokens[i] = new Array();
            for (var j = 1; j < this.lines; j++) {
                this.player1Tokens[i][j] = 0;
                this.player2Tokens[i][j] = 0;
            }
        }
        // calculate neighbor points which exist:
        //this.getNeighbors();
        this.getNeighbors2();
        // subtract out the stroke-width:
        this.tokenAttrs.r = (this.side - 1) / 2;
    },


    play: function (svg) {

        this.init();
        var sideLength = this.side * (this.lines - 1);

        var body = d3.select("body");
        var rules = body.select("#rules");
        var player1 = rules.select(".player1");
        var player2 = rules.select(".player2");


        // create backing square
        svg.append("rect")
            .attr({
                "fill": "rgba(150,200,25,.85)",
                "class": "goboard",
                "stroke": "#231F20",
                "stroke-width": 2,
                "stroke-miterlimit": 10
            })
            .attr("x", this.origin[0])
            .attr("y", this.origin[1])
            .attr("height", this.side * (this.lines - 1))
            .attr("width", this.side * (this.lines - 1));


        //x1="6" y1="39" x2="78" y2="83"
        for (var i = 0; i < this.lines; i++) {
            // horizontal this.lines    
            svg.append("line")
                .attr(this.lineAttrs)
                .attr("class", "horizontal")
                .attr("x1", this.origin[0])
                .attr("y1", this.origin[1] + i * this.side)
                .attr("x2", this.origin[0] + (this.lines - 1) * this.side)
                .attr("y2", this.origin[1] + i * this.side);

            // vertical this.lines
            svg.append("line")
                .attr(this.lineAttrs)
                .attr("class", "vertical")
                .attr("x1", this.origin[0] + i * this.side)
                .attr("y1", this.origin[1])
                .attr("x2", this.origin[0] + i * this.side)
                .attr("y2", this.origin[1] + (this.lines - 1) * this.side);
        }

        // add dots at 3 6 6 interval
        var dotOrigin = [this.origin[0] + 3 * this.side, this.origin[1] + 3 * this.side];


        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                svg.append("circle")
                    .attr(this.dotAttrs)
                    .attr("cx", dotOrigin[0] + i * this.side * 6)
                    .attr("cy", dotOrigin[1] + j * this.side * 6);
            }
        }

        //this.tokenData = this.neighbors;
        for (var row = 1; row < this.lines - 1; row++) {
            for (var col = 1; col < this.lines - 1; col++) {
                svg.append("circle")
                    .attr(this.tokenAttrs)
                    .attr("cx", this.origin[0] + col * this.side)
                    .attr("cy", this.origin[1] + row * this.side);

                this.tokenData[this.tokenData.length] = this.neighbors[row][col];
            }
        }

        var tokens = svg.selectAll("circle.gotoken");

        tokens
            .data(this.tokenData)
            .transition()
            .delay(function (d, i) { return 25 * i / (i % 5 + 1) + 25; })
            .duration(100)
            .ease("linear")
            .attr("stroke", "rbga(0,0,0,0)")
            .attr("fill", "rgba(0,0,0,0)")
            .attr("stroke-width", 0);

        //svg.selectAll("circle.gotoken")
        tokens
            .on("click", function (d, i) {
                d3.select(this)
                    .transition()
                    .ease("bounce-in-out")
                    .duration(1000)
                    .attr("fill", function (d, i) {
                        if (!d.filled) {
                            d.fill = Go.move++ % 2 ? "#a3f" : "#f3a";
                            d.filled = true;
                            if (Go.move % 2 == 0) {
                                Log.Notice("move=" + Go.move + ", now player= player1");
                                var attrs = { "fill": "#a3f", "stroke": "#000" };
                                player2
                                    .attr("style", "border-color='#900'");
                                player1
                                    .attr("style", "border-color='silver'");
                                d.player = "player2";
                                d.state = "t2";
                            } else {
                                Log.Notice("move=" + Go.move + ", now player= player2");
                                var attrs = { "fill": "#f3a", "stroke": "#000" };
                                player2
                                    .style("border-color", "#900");
                                player1
                                    .style("border-color", "silver");
                                d.player = "player1";
                                d.state = "t1";
                            }

                            if (d.player == "player1") {
                                Go.player1Tokens[d.row][d.col] = 1;
                                Go.flood("t1");
                            } else {
                                Go.player2Tokens[d.row][d.col] = 1;
                                Go.flood("t2");
                            }

                        }
                        return d.fill;
                    });
            })
            .on("mouseover", function (d, i) {
                var x = d.col * Go.side + 25;
                var y = d.row * Go.side + 25;

                var fromAttrs = {
                    "fill": "none",
                    "class": "line" + i,
                    "stroke": "#f00",
                    "stroke-width": 1,
                    "stroke-miterlimit": 10
                };

                svg.append("text")
                    .attr("id", "text" + i)
                    .attr("x", x)
                    .attr("y", y)
                    .attr("fill", "#f00")
                    .text("col=" + d.col + " row=" + d.row + " from = " + d.from);

                for (var j = 0; j < d.adjacent.length; j++) {

                    var point = d.adjacent[j];
                    svg.append("line")
                        .attr(fromAttrs)
                        .attr("x1", x)
                        .attr("y1", y)
                        .attr("x2", point[1] * Go.side + 25)
                        .attr("y2", point[0] * Go.side + 25)
                        ;
                }
            })
            .on("mouseout", function (d, i) {
                d3.select("#text" + i)
                    .remove();
                d3.selectAll(".line" + i)
                    .remove();
            });
    } // end function play

} // end object Go