// JavaScript Document

// Global variables with fixed values:
var count = 0;
var solutions = 0;
var MAX_COUNT = 500000;
var MAX_SOLUTIONS = 10;
var defaultSymbols = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcd";

// Global variables which might get redefined:
var boxCols = 3;
var boxRows = 3;
var puzzleString = "";

// next string uses box map
//puzzleString =     "E000000000000914200506700000000000034900001000090000410704300000060030000030260740P";

//puzzleString =   "E200500000300002600000300087603200090002030800070006502160004000008100009000003008P";
//puzzleString = "E001506025100000300003000002410504600P";

//var boxCols = 2;
//var boxRows = 3;
//var puzzleString = "E001506025100000300003000002410504600P";
//var puzzleString = "E000460000003003206106500300000045000P";
//var puzzleString = "E009100070000002006201003000090200050008060900040001080000400805600700000020008300P";
//var puzzleString = "E000007300800050402001020050000039020560000037040710000010070200302090008008100000P";
//var puzzleString =   "E200500000300002600000300087603200090002030800070006502160004000008100009000003008P";

// very slow puzzles
var puzzleString =   "E000002800003040009090008030000000370030070005206000000700500081005200900060090400P";

//var puzzleString =   ""
//var boxCols = 1;
//var boxRows = 3;
//var puzzleString =   "E100020000P"

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
	cellRow = new Array(activeCells+2);
	cellCol = new Array(activeCells+2);
	cellBox = new Array(activeCells+2);
	cellType = new Array(activeCells+3)
	cellMask = new Array(activeCells+2);
	cellI = new Array(activeCells+2);

	cellValue = 0;
	cellRow[0] = cellCol[0] = cellBox[0] = 0;
	cellType[0] = "E"; //exit puzzle
	cellType[activeCells+1] = "P"; //print puzzle
	cellType[activeCells+2] = "0"; // was used in C++ program, not really needed here


	symbols = new Array(puzzleDimension+1);
	symbol_index = new Array(256);

	for (var i = 0; i< puzzleDimension; i++) {
		symbols[i] = defaultSymbols.charAt(i);
		symbol_index[parseInt(defaultSymbols.charCodeAt(i))] = i;
	}

	symbols[puzzleDimension] = "0";


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
			cellValue = symbol_index[puzzle[i].toString().charCodeAt()];
			Log.Notice( "cellValue(" + i + ") = " + cellValue);
			rowMask[cellRow[i]] &= ~(1<<cellValue);
			colMask[cellCol[i]] &= ~(1<<cellValue);
			boxMask[cellBox[i]] &= ~(1<<cellValue);
	 	}

  	} // end cell setup
	Log.Notice( "Start puzzle = " + puzzle);
 	setupComplete = true;
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




}



function solveSudoku() {

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
	while (AC > 0 && count < MAX_COUNT && solutions < MAX_SOLUTIONS) {

		count++;

		if (cellType[AC] == "F") {
			AC += Dir;
			continue;
		}
		if (cellType[AC] == "P") {
			Log.Notice( puzzle.toString());
			solutions++;
			printPuzzleFormatted(3);
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
	Log.Notice( "End count = " + count + " End puzzle = " + puzzle );
}

//////////////////////////////// END SUDOKU SOLVER CODE ////////////////////
//
// Formatting Information
//
/////////////////////////

function makeFormatProfile(
		beginBlock,beginBoxrow,beginRow,beginBox,beginCell,
		endCell,endBox,endRow,endBoxrow,endBlock) {
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
	var cellValue = "&nbsp;&nbsp;"
   	for (var i = 1; i <= activeCells; i++) {
		if (puzzle[i] == "0") {
			cellValue = "&nbsp;&nbsp;";
		} else {
			cellValue = puzzle[i];
		}
		if ( (i%puzzleDimension) == 1 ) {
			if ( (puzzleDimension*(cellBox[i]-1)+1) == i) {
				Log.Notice( "cellBox[" + i + "] = " + cellBox[i]);
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
				TMP += BEGIN_CELL + cellBox[i] + " bold'>" + cellValue + END_CELL;
			} else {
				TMP += BEGIN_CELL + cellBox[i] + "' id='C" + i + "' onClick='pasteNumber(\"C" + i + "\")'>" + cellValue + END_CELL;
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
	if (formatId == 4 || formatId == 6) {
		document.getElementById("t").innerHTML = TMP;
	} else {
   		Log.Notice("Solution: " + FP);
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
	var cellValue = "&nbsp;&nbsp;"

   	for (var i = 1; i <= puzzleDimension+1; i++) {

		if (symbols[i-1] == "0") {
			cellValue = "&nbsp;&nbsp;";
		} else {
			cellValue = symbols[i-1];
		}

		if ( (i%puzzleDimension) == 1 ) {
			if ( (puzzleDimension*(cellBox[i]-1)+1) == i) {
				//Log.Notice( "cellBox[" + i + "] = " + cellBox[i]);
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
	} else {
   		Log.Notice(FP);
	}
}

function doit (x) {
	x.contentEditable=true;
	x.innerHTML.selected=true;
}

boxMapString = "";
// For puzzles with strange box shapes:
//boxMapString = "E122112333P0";
//boxMapString = "E111122333111222633441122633444422663444555663778885669778885699777855999778855999P0";
