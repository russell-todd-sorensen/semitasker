// JavaScript Document

var count;
var solutions;
var MAX_COUNT = 400000000;
var MAX_SOLUTIONS = 3;


//var boxCols = 2;
//var boxRows = 3;
//var puzzleString = "E001506025100000300003000002410504600P";
//var puzzleString = "E000460000003003206106500300000045000P";

var boxCols = 4;
var boxRows = 4;
//var puzzleString = "E009100070000002006201003000090200050008060900040001080000400805600700000020008300P";
//var puzzleString = "E000007300800050402001020050000039020560000037040710000010070200302090008008100000P";
var puzzleString =   "E200500000300002600000300087603200090002030800070006502160004000008100009000003008P";
var puzzleString =   ""
//var boxCols = 1;
//var boxRows = 3;
//var puzzleString =   "E000000000P"
var puzzleDimension = parseInt(boxCols * boxRows);
var activeCells = parseInt(puzzleDimension * puzzleDimension);
var puzzle = new Array(activeCells+3);

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

var defaultSymbols = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcd";

var symbols = new Array(puzzleDimension+1);
var symbol_index = new Array(256);

for (var i = 0; i<puzzleDimension; i++) {
	symbols[i] = defaultSymbols.charAt(i);
	symbol_index[parseInt(defaultSymbols.charCodeAt(i))] = i;
}
symbols[puzzleDimension] = "0";

// working arrays
var cellRow = new Array(activeCells+2);
var cellCol = new Array(activeCells+2);
var cellBox = new Array(activeCells+2);
var cellType = new Array(activeCells+3)
var cellMask = new Array(activeCells+2);
var cellI = new Array(activeCells+2);

var cellValue = 0;
cellRow[0] = cellCol[0] = cellBox[0] = 0;
cellType[0] = "E"; //exit puzzle
cellType[activeCells+1] = "P"; //print puzzle
cellType[activeCells+2] = "0"; // was used in C++ program, not really needed here

// mask arrays
var rowMask = new Array(puzzleDimension+1);
var colMask = new Array(puzzleDimension+1);
var boxMask = new Array(puzzleDimension+1);

rowMask[0] = colMask[0] = boxMask[0] = cellMask[0] = ( (1<<puzzleDimension)-1 );
for (var i = 1; i<=puzzleDimension; i++) {
	rowMask[i] = rowMask[0];
	colMask[i] = colMask[0];
	boxMask[i] = boxMask[0];
}

var setupComplete = false;

function setupSudoku() {
  for (var i = 1; i <= activeCells; i++) {
	  cellRow[i] = ( Math.floor((i-1) / puzzleDimension ) + 1);
	  cellCol[i] = ( ((i-1) % puzzleDimension ) + 1);
	  cellBox[i] = (Math.floor((cellCol[i]-1)/boxRows)) + 1 + Math.floor((cellRow[i]-1)/boxCols)*boxCols;
	  if (puzzle[i] == '0') {
		  cellType[i] = 'A';
	  } else {
		  cellType[i] = 'F';
		  cellValue = symbol_index[puzzle[i].toString().charCodeAt()];
		  Log("Notice", "cellValue(" + i + ") = " + cellValue);
		  rowMask[cellRow[i]] &= ~(1<<cellValue);
		  colMask[cellCol[i]] &= ~(1<<cellValue);
		  boxMask[cellBox[i]] &= ~(1<<cellValue);
	  }
	  setupComplete = true;
  } // end cell setup
}

function solveSudoku() {
	
	Log("Notice", "Starting solveSudoku...");
	var curPuzzle = puzzle.toString();
	if (!setupComplete) {
		  setupSudoku();
	}
	count = 0;
	solutions = 0;
	var AC = 1; // current cell
	var Dir = 1; // direction -1 or 1
	bigLoop:
	while (AC > 0 && count < MAX_COUNT && solutions < MAX_SOLUTIONS) {
		
		count++;
		
		if (cellType[AC] == "F") {
			AC += Dir;
			continue;
		}
		if (cellType[AC] == "P") {
			Log("Notice", puzzle.toString());
			solutions++;
			printPuzzle();
			Dir = -1;
			AC += Dir;
			continue;
		}
		if (cellType[AC] != "A") {
			Log("Error", "Unexpected cellType = " + cellType[AC].toString());
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
		} else { //Dir = -1
		
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
	Log ("Notice", "End count = " + count + " End puzzle = " + puzzle );
}
 
function printPuzzle() {
   var FP = "Count = " + count + "\n";
   for (var i = 1; i <= activeCells; i++) {
	   
	   FP += puzzle[i] + " ";
	   if ( (i%puzzleDimension) == 0 ) {
		   FP += "\n";
		   if ( (puzzleDimension*cellBox[i]) == i) {
			  FP += "\n";
		   }
	   } else if ( (i%boxRows ) == 0 ) {
		   FP += " ";
	   }
   }
   FP += "\n"
   Log("SOLUTION", FP);
}
