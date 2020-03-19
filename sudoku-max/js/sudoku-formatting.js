


var updateMaskValues = function (cellIndex, sIndex) {

    cellValue = sIndex;

    rowMask[cellRow[cellIndex]] &= ~(1<<cellValue);
    colMask[cellCol[cellIndex]] &= ~(1<<cellValue);
    boxMask[cellBox[cellIndex]] &= ~(1<<cellValue);
    cellType[cellIndex] = 'V'; // variable
    puzzle[cellIndex] = symbols[cellValue];
}

var resetMaskValues = function (cellIndex) {

    cellValue = symbol_index[puzzle[cellIndex]];
    // add old value back to masks
    rowMask[cellRow[cellIndex]] |= (1<<cellValue);
    colMask[cellCol[cellIndex]] |= (1<<cellValue);
    boxMask[cellBox[cellIndex]] |= (1<<cellValue);
    cellType[cellIndex] = 'A';
    puzzle[cellIndex]   = '0';
}

var removeCellOption = function (cellIndex, sIndex) {
    if (cellMask[cellIndex] == undefined) {
        cellMask[cellIndex] = rowMask[cellRow[cellIndex]]
            & colMask[cellCol[cellIndex]]
            & boxMask[cellBox[cellIndex]];
    }

    cellMask[cellIndex] &= ~(1<<sIndex);
    setupOptionCells()
}

var addCellOption = function (cellIndex, sIndex) {
    if (cellMask[cellIndex] == undefined) {
        cellMask[cellIndex] = rowMask[cellRow[cellIndex]]
            & colMask[cellCol[cellIndex]]
            & boxMask[cellBox[cellIndex]];
    }

    cellMask[cellIndex] |= (1<<sIndex);

    if (cellMask[cellIndex] ==
            (rowMask[cellRow[cellIndex]]
            & colMask[cellCol[cellIndex]]
            & boxMask[cellBox[cellIndex]]
            )
        )
    {
        cellMask[cellIndex] = undefined;
    }
    setupOptionCells();
}


var resetCellOptions = function() {
    var allMask = cellMask[0] + 0;
    cellMask = new Array(cellMask.length);
    cellMask[0] = allMask + 0;
    toggleOptionMode('toggle-button',off);
    setupOptionCells();
}

var toggleOptionMode = function(id) {
    if (arguments.length == 2) {
        toggleOption = arguments[1]
    } else {
        toggleOption = !(toggleOption);
    }
    if (toggleOption) {
        $('#' + id).html("Option Mode: Toggle");
    } else {
        $('#' + id).html("Option Mode: Select");
    }
}

var toggleMarkMode = function(id) {
    if (arguments.length == 2) {
        markCell = arguments[1]
    } else {
        markCell = !(markCell);
    }
    if (markCell) {
        $('#' + id).html("Mark Mode: Mark");
    } else {
        $('#' + id).html("Mark Mode: Clear");
        $('.marked').each(function() {
            $(this).removeClass('marked');
        })
    }
}

function solveSudokuX () {

    Log.Notice( "Starting solveSudoku...");

    if (!setupComplete) {
        if (boxMapString.length > 0) {
            setupSudoku(boxCols,boxRows,boxMapString);
        } else {
            setupSudoku(boxCols,boxRows);
        }
    }

    printPuzzleFormatted(6);
    setupOptionCells();
    boxDimensions('#dynamic');

    setupLegendCell();
}


var boxStyle = function(sat, lev) {
    var boxCount = puzzleDimension;
    var color, hue;
    $('#dynamic').html("");
    for (var i = 0;i<boxCount;i++) {
        hue = ((boxCount+1) * 7 * i) % 360;
        color = "hsl(" + hue + "," + sat + "%,"  + lev + "%)";
        Log.Debug("color=" + color);
        $('#dynamic').append(".box" + (i+1) + " {background-color:" + color + ";}\n");
    }
}


var boxDimensions = function(cssSelector) {
    //$(cssSelector).html('');
    var baseHeight, baseWidth,totahHeight, totalWidth,cellSpan,rowPaddingBottom;
    baseHeight = 100;
    baseWidth = 100;
    baseOptionHeight = 100;
    baseOptionWidth  = 100;
    totalWidth = 108;
    totalHeight = 108;
    cellSpan = Math.ceil(Math.pow(puzzleDimension,.5));

    baseFontSize = parseInt($('#baseFontSize').val())

    if (puzzleDimension < 10) {
        rowPaddingBottom = 4.4;
    } else {
        rowPaddingBottom = 4.0;
    }

    if (puzzleDimension > 15) {
        baseOptionHeight -= Math.pow(puzzleDimension,.5)+1;
        baseOptionWidth  -= Math.pow(puzzleDimension,.5)+1;
    }

    $(cssSelector).append(".cell \{\n\theight: "+baseHeight+"px;\n\twidth: "+baseWidth+"px;\n\}\n");
    $(cssSelector).append(
        ".optionCell \{\n\tfont-size:"
        + (baseFontSize/cellSpan)
        + "px;\n\theight:"
        + (baseOptionHeight/cellSpan)
        + "px;\n\twidth:"
        + (baseOptionWidth/cellSpan)
        + "px;\n\t"
        + "line-height:"
        + (baseOptionHeight/cellSpan)
        + "px;\n"
        + "\}\n"
    );

    $(cssSelector).append(".row \{\n\tpadding-bottom:"
         + rowPaddingBottom
        + "px;\n\}\n"
    );
}

//////////////////////////////// END SUDOKU SOLVER CODE ////////////////////
//
// Formatting Information
//
/////////////////////////

function makeFormatProfile(
    beginBlock,beginBoxrow,beginRow,beginBox,beginCell,
    endCell,endBox,endRow,endBoxrow,endBlock
) {
this.beginBlock = beginBlock    || "";
this.beginBoxrow = beginBoxrow  || "";
this.beginRow = beginRow        || "";
this.beginBox = beginBox        || "";
this.beginCell = beginCell      || "";
this.endCell = endCell          || "";
this.endBox = endBox            || "";
this.endRow = endRow            || "";
this.endBoxrow = endBoxrow      || "";
this.endBlock = endBlock        || "";
}

var formatProfiles = new Array(9);

formatProfiles[0] = new makeFormatProfile();
formatProfiles[1] = new makeFormatProfile("","","","",""," "," ","\n","\n","");
formatProfiles[2] = new makeFormatProfile("<xmp><table border='0'>","<tr><td><table border='1'>\n","\n <tr>","<td> </td>","<td><span class='data'>","</span></td>","<td> </td>","</tr>","\n</table></td></tr>","</table></xmp>");
formatProfiles[3] = new makeFormatProfile("<xmp>",".\n"," -","[","<",">","]","-\n",".\n","</xmp>");

// Current HTML format:
formatProfiles[4] = new makeFormatProfile("<div class='top'>\n"," <div class='boxrow'>\n","  <div class='row'>\n","    <div class='leftbox'> </div>\n","    <div class='cell'","</span></span></div>\n","    <div class='rightbox'> </div>\n","  </div>\n"," </div><!-- ? -->\n","</div>\n");

formatProfiles[6] = new makeFormatProfile("<div class='top'>\n"," <div class='boxrow'>\n","  <div class='row'>\n","    <div class='leftbox'> </div>\n","    <div class='cell box","</div>\n","    <div class='rightbox'> </div>\n","  </div>\n"," </div>\n","</div>\n");

formatProfiles[5] = new makeFormatProfile("<div class='top'>\n"," <div class='boxrow'>\n","  <div class='row'>\n","    <div class='leftbox'> </div>\n","    <div class='cell' ","</span></span></div>\n","    <div class='rightbox'> </div>\n","  </div>\n","<!-- ? -->\n","</div></xmp>\n");

formatProfiles[7] = new makeFormatProfile("<div class='top'>\n"," <div class='boxrow'>\n","  <div class='row'>\n","    <div class='leftbox'> </div>\n","    <div class='cell curves bold' onClick='grabNumber(this)' >","</div>\n","    <div class='rightbox'> </div>\n","  </div>\n"," </div>\n","</div>\n");

formatProfiles[8] = new makeFormatProfile("<div class='top2'>\n"," <div class='boxrow2'>\n","  <div class='row2'>\n","    <div class='leftbox2'> </div>\n","    <div class='cell2 boxP","</div>\n","    <div class='rightbox2'> </div>\n","  </div>\n"," </div>\n","</div>\n");


function printPuzzleFormatted(formatId) {

    var fObj = formatProfiles[formatId];
    var BEGIN_BLOCK  = fObj.beginBlock;   // default ""
    var BEGIN_BOXROW = fObj.beginBoxrow;  // default ""
    var BEGIN_ROW =    fObj.beginRow;     // default ""
    var BEGIN_BOX =    fObj.beginBox;     // default ""
    var BEGIN_CELL =   fObj.beginCell;    // default ""
    var END_CELL =     fObj.endCell;     // default " "
    var END_BOX =      fObj.endBox;      // default " "
    var END_ROW =      fObj.endRow;     // default "\n"
    var END_BOXROW =   fObj.endBoxrow;  // default "\n"
    var END_BLOCK  =   fObj.endBlock;     // default ""
    var FP = "#" + solutions + " Count = " + count +"\n";
    var TMP = BEGIN_BLOCK;
    var cellValue = "&nbsp;"

    for (var i = 1; i <= activeCells; i++) {
        if (puzzle[i] == "0") {
            cellValue = "&nbsp;";
        } else {
            cellValue = puzzle[i];
        }

        if ( (i%puzzleDimension) == 1 ) {
            if ( (puzzleDimension*(cellBox[i]-1)+1) == i) {
                Log.Notice("cellBox[" + i + "] = " + cellBox[i]);
                TMP += BEGIN_BOXROW;
            }
            TMP += BEGIN_ROW;
        }

        if ( (i%boxRows) == 1 ) {
            TMP += BEGIN_BOX;
        }

        if (formatId == 4) {
            TMP += BEGIN_CELL + " onClick='pasteNumber(\"C" + i + "\")'><span class='data'><span id='C" + i + "' class='input2 box" + cellBox[i] + "'>" + cellValue + END_CELL;
        } else if (formatId == 6 || formatId == 8) {
            if (puzzle[i] != 0) {
                TMP += BEGIN_CELL + cellBox[i] + " bold' id='C" + i + "'>" + cellValue + END_CELL;
            } else {
                TMP += BEGIN_CELL + cellBox[i] + "' id='C" + i + "' onClick=''>" + cellValue + END_CELL;
            }
        } else {
            TMP += BEGIN_CELL + puzzle[i] + END_CELL;
        }

        if ( (i%boxRows ) == 0 ) {
            TMP += END_BOX;
        }

        if ( (i%puzzleDimension) == 0 ) {
            TMP += END_ROW;
            if ( (puzzleDimension*cellBox[i]) == i) {
                TMP += END_BOXROW;
            }
        }

    }

    TMP += END_BLOCK;
    FP += TMP;

    if (formatId == 4 || formatId == 6 ) {
        document.getElementById("t").innerHTML = TMP;
        drawBoxEdges();
    } else {
        if (formatId == 8) {
            printPuzzleFormatted(3);
        } else {
            Log.Notice("SOLUTION: " + FP);
        }
    }

    return TMP;
}

// Toolbar (selects current drop value
function printToolBar(formatId) {

    var fObj = formatProfiles[formatId];
    var BEGIN_BLOCK  = fObj.beginBlock;   // default ""
    var BEGIN_BOXROW = fObj.beginBoxrow;  // default ""
    var BEGIN_ROW =    fObj.beginRow;     // default ""
    var BEGIN_BOX =    fObj.beginBox;     // default ""
    var BEGIN_CELL =   fObj.beginCell;    // default ""
    var END_CELL =     fObj.endCell;     // default " "
    var END_BOX =      fObj.endBox;      // default " "
    var END_ROW =      fObj.endRow;     // default "\n"
    var END_BOXROW =   fObj.endBoxrow;  // default "\n"
    var END_BLOCK  =   fObj.endBlock;     // default ""
    var FP = "";
    //var FP = "#" + solutions + " Count = " + count +"\n";
    var TMP = BEGIN_BLOCK;
    var cellValue = "&nbsp;"

    for (var i = 1; i <= puzzleDimension+1; i++) {

        if (symbols[i-1] == "0") {
            cellValue = "&nbsp;";
        } else {
            cellValue = symbols[i-1];
        }

        if ( (i%puzzleDimension) == 1 ) {
            if ( (puzzleDimension*(cellBox[i]-1)+1) == i) {
                //Log.Notice(cellBox[" + i + "] = " + cellBox[i]);
                TMP += BEGIN_BOXROW;
                TMP += BEGIN_ROW;
            }
                //TMP += BEGIN_ROW;
           }
        if ( (i%boxRows) == 1 ) {
            TMP += BEGIN_BOX;
        }

        if (formatId == 7) {
            TMP += BEGIN_CELL + cellValue + END_CELL;
        } else {
            TMP += BEGIN_CELL + symbols[i-1] + END_CELL;
        }

        if ( (i%boxRows ) == 0 ) {
               TMP += END_BOX;
        }
        if ( (i%(puzzleDimension+1)) == 0 ) {
            TMP += END_ROW;
            if ( ((puzzleDimension+1)*cellBox[i]) == i) {
                TMP += END_BOXROW;
            }
        }
    }

    TMP += END_BLOCK
    FP += TMP;

    if (formatId == 7) {
        document.getElementById("t2").innerHTML = TMP;
        document.getElementById("t3").style.visibility = "visible";
        document.getElementById("t3").style.display = "inline-block";
    } else {
           Log.Notice(FP);
    }
}

var drawBoxEdges = function () {
    var cellCount = puzzleDimension*puzzleDimension;
    var lastCell = cellCount+1
    var firstCell = 0;
    var upIndex, downIndex, nextIndex, prevIndex;
    var shadeColor = 'rgba(0,0,0,.5)'
    var rightShadeColor = 'rgba(0,0,0,.45)'
    var lightColor = 'rgba(0,0,0,.1)'
    var topLightColor = 'rgba(0,0,0,.15)'
    for (var i = 1; i<=cellCount;i++) {
        //nextIndex, prevIndex
        nextIndex = i+1;
        prevIndex = i-1;
        upIndex = i-puzzleDimension;
        downIndex = i+puzzleDimension;

        if (prevIndex > firstCell && cellBox[i] == cellBox[prevIndex]) {
            document.getElementById('C'+i).style.borderLeftColor = lightColor;
            document.getElementById('C'+prevIndex).style.borderRightColor = rightShadeColor;
        }
        if (upIndex > firstCell && cellBox[i] == cellBox[upIndex]) {
            document.getElementById('C'+i).style.borderTopColor = topLightColor;
            document.getElementById('C'+upIndex).style.borderBottomColor = shadeColor;
        }
    }
}


////// LOAD EXTERNAL PUZZLES /////

//// csv field names:
/// puzzle_string,box_cols,box_rows,box_map,puzzle_name,notes

function getSudokuPuzzlesCSV(evt) {
    if (evt.currentTarget.readyState < 4) {
        return;
    }

    parseSudokuPuzzlesCSV(evt.currentTarget.responseText);

    $('#puzzle-data').attr('max', sudokuData.length-1);
    $('#puzzle-data').attr('placeholder', '0 to ' + (sudokuData.length-1) + ' or -1 to enter puzzle');
}


var sudokuData;

var parseSudokuPuzzlesCSV = function (csv) {

    sudokuData = d3.csv.parse(csv, function(d,i) {

        var name = d["puzzle_name"];
        var box_cols = d["box_cols"];
        var box_rows = d["box_rows"];
        var box_map  = d["box_map"];
        var puzzle_string =  d["puzzle_string"];
        var remap_symbols = d["remap_symbols"];
        var notes = d["notes"];
        var puzzle_length = puzzle_string.length;
        var puzzle_dimension, 
            dimension_root;

        if (!(box_cols && box_rows)) {

            if (puzzle_length == 0) {
                puzzle_string = "0"
                puzzle_length = 1;
                box_cols = 1;
                box_rows = 1;
            }

            puzzle_dimension = Math.pow(puzzle_length,.5);
            dimension_root = Math.pow(puzzle_dimension,.5);
            if (dimension_root != Math.floor(dimension_root)) {
                // puzzle not perfect square, box_cols and box_rows should be set.
                box_cols = 0;
                box_rows = 0;
            } else {
                box_cols = box_rows = dimension_root;
            }
        }

        else if (parseInt(box_cols) && parseInt(box_rows)) {
            var expected_length = (box_cols*box_cols*box_rows*box_rows)
            if (puzzle_length < expected_length ) {
                for (var i = puzzle_length;i<expected_length;i++) {
                    puzzle_string += "0"
                }
            }
        }

        puzzle_string = "E" + puzzle_string + "P";

        if (!box_map) {
            box_map = "";
        }
        if (!notes) {
            notes = "";
        }
        if (!name) {
            name = "Puzzle(" + puzzle_dimension + ") " + i + ", box_cols="+ box_cols + ", box_rows=" + box_rows;
        }
        if (!remap_symbols) {
            remap_symbols = "";
        }
        var search =  name + ' ' + notes;

        return {
            search: search,
            name: name,
            box_cols: box_cols,
            box_rows: box_rows,
            box_map: box_map,
            puzzle_string: puzzle_string,
            remap_symbols: remap_symbols,
            notes: notes,
            puzzle_length: puzzle_length
        };
    });

    Log.Debug("done loading sudoku-puzzles csv file");

    solveAll(sudokuData,"#my-results");
};
