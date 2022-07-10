// JavaScript Document

// Global variables with fixed values:
var on = true;
var off = false;
var count = 0;
var solutions = 0;
var solutionsList = [];
var MAX_COUNT = 500000000;
var MAX_SOLUTIONS = 10;
var defaultSymbolsProto = "123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var defaultSymbols      = "" + defaultSymbolsProto;
//var symbolIndexValues = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";


var symbolIndex = new Array(defaultSymbols.length);
var i = 0
for (; i<defaultSymbols.length; i++) {
    symbolIndex[defaultSymbols[i]] = i;

}

//symbolIndex["0"] = i;
// Global variables which might get redefined:
var boxCols = 3;
var boxRows = 3;
var puzzleString = "";
var boxMapString = "";
var puzzleName = "No Name";

var symbolOptions; // symbol sets available in list of puzzles

var xhrArray  = new Array();

var Puzzles = [];
Puzzles[0] = "E900300007500900200000024300000008060460090013090400000003570000001009002700002005P";// x-wing
Puzzles[1] = "E030000000000903201670020030900807000007000500000306007080090016102508000000000020P"
Puzzles[2] = "E000000000012034567034506182001058206008600001020007050003705028080060700207083615P"
Puzzles[3] = "E000000000000012034001500026000400078070801302803207041007008060306145087508706413P"
Puzzles[4] = "E003020600900305001001806400008102900700000008006708200002609500800203009005010300P"
Puzzles[5] = "E200080300060070084030500209000105408000000000402706000301007040720040060004010003P"
Puzzles[6] = "E000000001000002000003000045000000260000030000040500000000010704206008000300000000P"
Puzzles[7] = "E000000000000001023004056000000400000070000605800009000000700080005300000060000000P"
Puzzles[8] = "E000000014970000000000200000000003605001000000000000200060000730200140000000800000P"
Puzzles[9] = "E100000500000000802000900000600000040000070010080050000400107000050000300000400000P"
puzzleString=Puzzles[2];


// Globals which must be defined later:
var puzzle;
var puzzleDimension;
var activeCells;
var symbols;
var symbol_index;
var cellRow;
var cellCol;
var cellBox;
var cellType;
var cellMask;
var cellI;
var rowMask;
var colMask;
var boxMask;
var boxMapString;
var setupComplete = false;

var baseFontSize = 72; // variable from 72 to 108

// No defined args, but setupSudoku will act
// differently with supplied args:
// setupSudoku(boxCols, boxRows)
//   allow changing box shape from 3x3
//
// setupSudoku(boxCols, boxRows, boxMapString)
//   allows adding non-rectangular box shapes.




function setupSudoku() {

    Log.Notice( "Running setupSudoku()...");
    var doCellBox = true;

    if (setupSudoku.arguments.length > 1) {
        args = setupSudoku.arguments;
        boxCols = args[0];
        boxRows = args[1];
    }
    puzzleDimension = boxCols * boxRows;
    activeCells = puzzleDimension * puzzleDimension;
    puzzle = new Array(activeCells+3);

    boxStyle("50","50");

    puzzle[0] = "E";
    for (var i = 1; i <= activeCells; i++) {
        puzzle[i] = "0";
    }

    if (puzzleString.length > 0) {
        for (var i = 1; i <= activeCells; i++) {
            puzzle[i] = puzzleString[i];
        }
    }

    puzzle[activeCells+1] = "P";
    puzzle[activeCells+2] = "0";

    // working arrays
    cellRow  = new Array(activeCells+2);
    cellCol  = new Array(activeCells+2);
    cellBox  = new Array(activeCells+2);
    cellType = new Array(activeCells+3);
    cellMask = new Array(activeCells+2);
    cellI    = new Array(activeCells+2);

    cellValue = 0;
    cellRow[0] = cellCol[0] = cellBox[0] = 0;
    cellType[0] = "E"; //exit puzzle
    cellType[activeCells+1] = "P"; //print puzzle
    cellType[activeCells+2] = "0"; // was used in C++ program, not really needed here


    symbols = new Array(puzzleDimension+1);
    symbol_index = new Array(puzzleDimension+1);

    for (var i = 0; i< puzzleDimension; i++) {
        symbols[i] = defaultSymbols[i];
        symbol_index[defaultSymbols[i]] = i;
    }

    symbols[puzzleDimension] = "0";
    symbol_index["0"] = puzzleDimension;

    // mask arrays
    rowMask = new Array(puzzleDimension+1);
    colMask = new Array(puzzleDimension+1);
    boxMask = new Array(puzzleDimension+1);

    rowMask[0] = colMask[0] = boxMask[0] = cellMask[0] = ( (1<<puzzleDimension)-1 );
    
    for (var i = 1; i<=puzzleDimension; i++) {
        rowMask[i] = rowMask[0];
        colMask[i] = colMask[0];
        boxMask[i] = boxMask[0];
    }

    if ((setupSudoku.arguments.length > 2) && (args[2].length == activeCells + 3) ) {
        doCellBox = false;
        for (var i = 0; i<args[2].length; i++) {
            cellBox[i] = args[2][i];
        }
        Log.Notice("Created Box Cell Map = " + cellBox);
    }

    for (var i = 1; i <= activeCells; i++) {
        cellRow[i] = ( Math.floor((i-1) / puzzleDimension ) + 1);
        cellCol[i] = ( ((i-1) % puzzleDimension ) + 1);
        if (doCellBox) {
            cellBox[i] = (Math.floor((cellCol[i]-1)/boxRows)) + 1 + Math.floor((cellRow[i]-1)/boxCols)*boxCols;
        }
        if (puzzle[i] == '0') {
            cellType[i] = 'A';
        } else {
            cellType[i] = 'F';
            //cellValue = symbolIndex[puzzle[i]];
            cellValue = symbol_index[puzzle[i]];
            Log.Notice( "cellValue(" + i + ") = " + cellValue);
            rowMask[cellRow[i]] &= ~(1<<cellValue);
            colMask[cellCol[i]] &= ~(1<<cellValue);
            boxMask[cellBox[i]] &= ~(1<<cellValue);
        }
    } // end cell setup

    Log.Notice( "Start puzzle = " + puzzle);
    setupComplete = true;
}

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
        $(`#${id}`).html("Mark Mode: Mark");
    } else {
        $(`#${id}`).html("Mark Mode: Clear");
        $(".marked").each(function() {
            $(this).removeClass(["marked",...markClasses]);
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

var boxStyle = function() {
    var boxCount = puzzleDimension;
    var rgbValues = "0123456789ABCDEF";
    var rHex, gHex, bHex, color;
    $('#dynamic').html("");
    for (var r = 0, g=0,b=0;r<boxCount;r++,g++,b++) {
        rHex =  (1 + (r * 3))%16;
        gHex =  (7 + (g * 7))%16;
        bHex = (11 + (b * 2))%16;
        color = '#' + rgbValues[rHex] + rgbValues[gHex] + rgbValues[bHex];
        Log.Debug("rHex=" + rHex + " gHex=" + gHex + " bHex=" + bHex + " color=" + color);
        $('#dynamic').append(".box" + (r+1) + " {background-color:" + color + ";}\n");
    }
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

var boxDimensionsOld = function(cssSelector) {
    var baseFontSize, baseHeight, baseWidth, baseHeightVW, baseWidthVW, optionCellFactor,
        baseOptionHeight, baseOptionWidth, totalWidth, totalHeight,
        rowPaddingBottom, cellSpan, baseOptionLineHeight;

    baseHeightVW = 100;
    baseWidthVW = 100;
    totalWidth = 108;
    totalHeight = 108;
    cellSpan = Math.ceil(Math.pow(puzzleDimension,.5));

    var firstOptionCell, value;
    var success = false;
    for (firstOptionCell = 1;firstOptionCell <= puzzleDimension*puzzleDimension;firstOptionCell++) {
        value = $('#C' + firstOptionCell + '-0').css('font-size');
        if (value && parseFloat(value) != NaN) {
            success = true;
            break;
        }
    }
    if (success) {
        var cellSelector = '#C' + firstOptionCell;
        var optionCellSelector = cellSelector + '-0';
    
        baseFontSize = parseFloat($(optionCellSelector).css('font-size'));
        baseWidth = parseFloat($(cellSelector).css('width'));
        baseHeight = baseWidth;
        baseOptionWidth  = parseFloat($(optionCellSelector).css('width'));
        baseOptionHeight = parseFloat($(optionCellSelector).css('height'));
        baseOptionLineHeight = parseFloat($(optionCellSelector).css('line-height'));
        optionCellFactor = baseOptionHeight/baseHeightVW
    } else {
        error('waaa')
    }

    if (puzzleDimension < 10) {
        rowPaddingBottom = 4.4;
    } else {
        rowPaddingBottom = 4.0;
    }

    if (puzzleDimension > 15) {
        baseOptionHeight -= Math.pow(puzzleDimension,.5)+1;
        baseOptionWidth  -= Math.pow(puzzleDimension,.5)+1;
    }

    // .screen is 1200px wide we will measure and normalize,
    // vw Values are in proportion to the view width of a 9x9 puzzle
    var vwValues = {
        screen: 100,
        cellHeight: 10.5,
        cellWidth: 10.5,
        optionHeight: 3.55,
        optionWidth: 3.5,
        lineHeight: 3.5,
        fontSize:2.9,
        fixedFontSize:8.0,
    };

    var norm100vw = (parseFloat($('.screen').css('width')))/1450;
    var norm100vwLT1200 = (parseFloat($('.screen').css('width')))/1275;
    // cell is 10.5x10.5vw

    var factor = (9.0/puzzleDimension)*1000;

    var width, height, optionWidth, optionHeight, lineHeight, fontSize;
    
    width        = Math.round(factor*(vwValues.cellWidth*norm100vw))/1000;
    height       = Math.round(factor*(vwValues.cellHeight*norm100vw))/1000;
    optionWidth  = Math.round(factor*(vwValues.optionWidth*norm100vw))/1000;
    optionHeight = Math.round(factor*(vwValues.optionHeight*norm100vw))/1000;
    lineHeight   = Math.round(factor*(vwValues.lineHeight*norm100vw))/1000;
    fontSize     = Math.round(factor*(vwValues.fontSize*norm100vw))/1000;
    fixedFSize   = Math.round(factor*(vwValues.fixedFontSize*norm100vw))/1000;

    $(cssSelector).append(
        ".cell \{\n\theight: "
        + height 
        + "vw;\n\twidth: "
        + width
        + "vw;\n\}\n");

    $(cssSelector).append(
        ".optionCell \{\n\tfont-size:"
        + (fontSize)
        + "vw;\n\theight:"
        + (optionHeight)
        + "vw;\n\twidth:"
        + (optionWidth)
        + "vw;\n\t"
        + "line-height:"
        + (lineHeight)
        + "vw;\n"
        + "\}\n"
    );

    $(cssSelector).append(
        ".row \{\n\tpadding-bottom:"
        + rowPaddingBottom
        + "px;\n\}\n"
        + ".fixed \{\n\tfont-size:" 
        + fixedFSize + "vw;\n\}\n"
    );

    widthLT        = Math.round(factor*(vwValues.cellWidth*norm100vwLT1200))/1000;
    heightLT       = Math.round(factor*(vwValues.cellHeight*norm100vwLT1200))/1000;
    optionWidthLT  = Math.round(factor*(vwValues.optionWidth*norm100vwLT1200))/1000;
    optionHeightLT = Math.round(factor*(vwValues.optionHeight*norm100vwLT1200))/1000;
    lineHeightLT   = Math.round(factor*(vwValues.lineHeight*norm100vwLT1200))/1000;
    fontSizeLT     = Math.round(factor*(vwValues.fontSize*norm100vwLT1200))/1000;
    fixedFSizeLT   = Math.round(factor*(vwValues.fixedFontSize*norm100vwLT1200))/1000;

    $(cssSelector).append(
        "@media (min-width: 0px) and (max-width: 1200px) {\n"
        + "\t.cell \{\n\t\theight: "
        + heightLT 
        + "vw;\n\t\twidth: "
        + widthLT
        + "vw;\n\t\}\n");

    $(cssSelector).append(
        "\t.optionCell \{\n\t\tfont-size:"
        + (fontSizeLT)
        + "vw;\n\t\theight:"
        + (optionHeightLT)
        + "vw;\n\t\twidth:"
        + (optionWidthLT)
        + "vw;\n\t\tline-height:"
        + (lineHeightLT)
        + "vw;\n"
        + "\t\}\n"
    );

    $(cssSelector).append(
        "\t.fixed \{\n\t\tfont-size:" 
        + fixedFSizeLT + "vw;\n\t\}\n"
    );

    $(cssSelector).append("\}")
}

var solveSudoku = function(numSolutions,solutionsListFormat) {
    numSolutions = numSolutions?numSolutions:MAX_SOLUTIONS;
    solutionsListFormat = solutionsListFormat?solutionsListFormat:0;

    Log.Notice( "Starting solveSudoku...");

    if (!setupComplete) {
        if (boxMapString.length > 0) {
            setupSudoku(boxCols,boxRows,boxMapString);
        } else {
            setupSudoku(boxCols,boxRows);
        }
    }

    count = 0;
    solutions = 0;
    var AC = 1; // current cell
    var Dir = 1; // direction -1 or 1

    // print puzzle before solving:
    printPuzzleFormatted(6);

    bigLoop:
    while (AC > 0 && count < MAX_COUNT && solutions < numSolutions) {

        count++;

        if (cellType[AC] == "F") {
            AC += Dir;
            continue;
        }
        if (cellType[AC] == "P") {
            Log.Notice( puzzle.toString());
            solutions++;
            printPuzzleFormatted(3);
            solutionsList.push(printPuzzleFormatted(solutionsListFormat))
            Dir = -1;
            AC += Dir;
            continue;
        }
        if (cellType[AC] != "A") {
            Log.Error("Unexpected cellType = " + cellType[AC].toString());
            break bigLoop;
        }

        // cellType is A

        if (Dir == 1) {
            cellMask[AC] = rowMask[cellRow[AC]] & colMask[cellCol[AC]] & boxMask[cellBox[AC]];
            cellI[AC] = 0;

            while ( (cellI[AC] <= puzzleDimension) && ( (cellMask[AC] & (1<<cellI[AC])) == 0) )  {
                cellI[AC]++;
            }
            if (cellI[AC] > puzzleDimension) {
                puzzle[AC] = "0";
                Dir = -1;
                AC += Dir;
                continue;
            }
            // new value for puzzle cell
            puzzle[AC] = symbols[cellI[AC]];
            rowMask[cellRow[AC]] &= ~(1<< cellI[AC]);
            colMask[cellCol[AC]] &= ~(1<< cellI[AC]);
            boxMask[cellBox[AC]] &= ~(1<< cellI[AC]);

            AC += Dir;
            // end Dir = 1
        } else {
            //Dir = -1

            cellValue = 1<<cellI[AC]; // always works

            // add old value back to masks
            rowMask[cellRow[AC]] |= cellValue;
            colMask[cellCol[AC]] |= cellValue;
            boxMask[cellBox[AC]] |= cellValue;

            while (( ++cellI[AC] <= puzzleDimension) && ( (cellMask[AC] & (1<<cellI[AC])) == 0) ) {
                //loop
            }
            if (cellI[AC] > puzzleDimension) {
                puzzle[AC] = "0";
                AC += Dir;
                continue;
            }

            // try next value and reverse direction
            puzzle[AC] = symbols[cellI[AC]];
            rowMask[cellRow[AC]] &= ~(1<< cellI[AC]);
            colMask[cellCol[AC]] &= ~(1<< cellI[AC]);
            boxMask[cellBox[AC]] &= ~(1<< cellI[AC]);

            Dir = 1;
            AC += Dir;
            continue;
        } // end Dir = -1
    } // end while
    Log.Notice("End count = " + count + " End puzzle = " + puzzle );
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

var formatProfiles = new Array(20);

formatProfiles[0] = new makeFormatProfile();
formatProfiles[1] = new makeFormatProfile("","-","","","","","",".","-","");
formatProfiles[2] = new makeFormatProfile("<xmp><table border='0'>","<tr><td><table border='1'>\n","\n <tr>","<td> </td>","<td><span class='data'>","</span></td>","<td> </td>","</tr>","\n</table></td></tr>","</table></xmp>");
formatProfiles[3] = new makeFormatProfile("<xmp>",".\n"," -","[","<",">","]","-\n",".\n","</xmp>");
formatProfiles[9] = new makeFormatProfile();
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
        } else if (formatId==9) {

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

    sudokuData = d3.csvParse(csv, function(d,i) {

        var name = d["puzzle_name"];
        var box_cols = d["box_cols"];
        var box_rows = d["box_rows"];
        var box_map  = d["box_map"];
        var puzzle_string =  d["puzzle_string"];
        var remap_symbols = d["remap_symbols"];
        var notes = d["notes"];
        var    puzzle_length = puzzle_string.length;
        var puzzle_dimension, dimension_root;

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

    Log.Debug("done loading sudoku-puzzles csv file")
};
