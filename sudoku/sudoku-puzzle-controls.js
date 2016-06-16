// JavaScript Document

// code to change sudoku numbers on click
var sNumber = "&nbsp;&nbsp;";
var sudokuMoves = new Array(1);
var sudokuMoveIndex = 0;

function grabNumber(elem) {
	sNumber = elem.innerHTML;
	Log("Notice", "Grabbed '" + sNumber + "'");
}

function pasteNumber(id) {
	//document.getElementById(id).innerHTML = sNumber;
	var currValue = document.getElementById(id).innerHTML;
	if (currValue == "") {
		currValue = "&nbsp;&nbsp;"
	}
	sudokuMoves[sudokuMoveIndex] = [id, currValue, sNumber];
	sudokuMoveIndex++;
	document.getElementById(id).innerHTML = sNumber;
	Log("Notice", "Dropped '" + sNumber + "' on " +  id);
}

function goBackOneStep() {
	
	if (sudokuMoveIndex == 0) {
		return null
	} else {
		sudokuMoveIndex--
	}
	var move = sudokuMoves[sudokuMoveIndex];
	document.getElementById(move[0]).innerHTML = move[1];
	Log("Notice", "Back one step, restored " + move[0] + " to '" + move[1] + "'");
}

function goFwdOneStep() {
	
	var move = sudokuMoves[sudokuMoveIndex];
	document.getElementById(move[0]).innerHTML = move[2];
	Log("Notice", "Forward one step, restored " + move[0] + " to '" + move[2] + "'");
	sudokuMoveIndex++;
}

// Functions are used recursively with setTimeout, so instead of 'this', use myPlayer
function startOver() {

    while (sudokuMoveIndex > 0) {
		goBackOneStep();
	}

	var len = sudokuMoves.length;
	for (var i = 0; i < len; i++ ) {
		delete sudokuMoves[i];
	}
	sudokuMoveIndex = 0;
}

function rewind() {
	if (sudokuMoveIndex == 0) {
		setTimeout('myPlayer.play()',myPlayer.timeout);
	} else {
		goBackOneStep();
		setTimeout('myPlayer.rewind()',myPlayer.timeout);
	}
}

function play() {
	if (sudokuMoveIndex >= myPlayer.startIndex) {
		Log("Notice", "Ending replay");
		return null;
	} else {
		Log("Notice", "Playing with sudokuMoveIndex = " + sudokuMoveIndex + " and startIndex = " + myPlayer.startIndex);
	}
	goFwdOneStep();
	setTimeout('myPlayer.play()',myPlayer.timeout)

}

function replayAll(timeout) {
	this.timeout = timeout;
	this.startIndex = sudokuMoveIndex;
	this.rewind = rewind;
	this.play = play;
	this.startOver = startOver;
	Log("Notice", "Created replayAll object with startIndex = " + this.startIndex);
}

var myPlayer;
