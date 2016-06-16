<%@ Page Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true" CodeFile="SudokuSolver.aspx.cs" Inherits="Sudoku_SudokuSolver" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent" >
<meta charset="utf-8">
<title>Sudoku Solver!</title>
<link rel="stylesheet" href="./css/sudoku-test-6.css" media="all" type="text/css" >


<script type="text/javascript" src="./js/logger.js"></script>

<script type="text/javascript" >
    //setup logging element id
    Logger = "logger2";
</script>

<script type="text/javascript" src="./js/sudoku-lib-6.js" ></script>
<script type="text/javascript" >

    // code to change sudoku numbers on click
    var sNumber = "&nbsp;&nbsp;";

    // sudokuMoves array grows dynamically
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
        Log("Notice", "Dropped '" + sNumber + "' on " + id);
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
        for (var i = 0; i < len; i++) {
            delete sudokuMoves[i];
        }
        sudokuMoveIndex = 0;
    }

    function rewind() {
        if (sudokuMoveIndex == 0) {
            setTimeout('myPlayer.play()', myPlayer.timeout);
        } else {
            goBackOneStep();
            setTimeout('myPlayer.rewind()', myPlayer.timeout);
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
        setTimeout('myPlayer.play()', myPlayer.timeout)

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

    function gotoPage(id) {
        if (id == "photoPage") {
            document.getElementById("P1").style.display = "block";
            document.getElementById("appTitle").style.display = "none";
        }
        document.getElementById("firstPage").style.display = "none";
        document.getElementById(id).style.display = "block";
    }
</script>
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
   <div id="puzzle">
 <div class="leftPhone"></div>
 <div class="Screen">
 <div id="t">
  <!-- Puzzle Goes Here -->
  <div class="top">
   <div class="row">
    <div class="camera">
     <div id="P1" class="photo"></div>
     <div class="appTitle curves" id="appTitle">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sudoku Solver!</div>

     <div id="firstPage">
      <div class="camera-buttons">
       <div class="cell curves box1 bold" onClick="gotoPage('photoPage');">Use Camera to Load Puzzle</div>
       <div class="cell curves box1 bold" onClick="gotoPage('handEnterPage');">Hand Enter Puzzle</div>
      </div>
     </div>

     <div id="photoPage">
      <div class="camera-buttons">
       <div class="cell curves box1 bold" onClick="setupSudoku(boxCols,boxRows,boxMapString);document.getElementById('P1').innerHTML=printPuzzleFormatted(3);">Capture Puzzle using Camera</div>
       <div class="cell curves box2 bold" onClick='solveSudoku(boxCols, boxRows, boxMapString); printToolBar(7);'>Load Puzzle (after capture)</div>
      </div>
     </div>

     <!-- Following is input for puzzle by hand -->

     <div id="handEnterPage">
      <div class="cell curves bold" >Puzzle: <input type="text" size="60" maxlength="81" name="puzzle" value=""/></div>
      <div class="camera-buttons" >
       <div class="cell curves bold" >BoxCols: <input type="text" size="2" maxlength="2" name="boxCols" value="3"/></div>
       <div class="cell curves bold" >BoxRows: <input type="text" size="2" maxlength="2" name="boxRows" value="3"/></div>
       <div class="cell curves" onClick="setupSudoku2(document.forms[0].boxCols.value,document.forms[0].boxRows.value,document.forms[0].puzzle.value);document.getElementById('P1').innerHTML=printPuzzleFormatted(3);solveSudoku(boxCols, boxRows, boxMapString); printToolBar(7);">Enter Puzzle By Hand</div>
      </div>
     </div>

    </div>
   </div>
  </div>
  <!-- End Puzzle -->
 </div>
 <div id="t3">
  <div class="top">
   <div class="boxrow">
    <div class="row">
      <div id="Bkw" class="cell curves bold" onclick='goBackOneStep()'>&lt;</div>
      <div class="rightbox"> </div>
    </div>
    <div class="row">
      <div id="Fwd" class="cell curves bold" onclick='goFwdOneStep()'>&gt;</div>
      <div class="rightbox"> </div>
    </div>
   </div>
   <div class="boxrow">
    <div class="row">
      <div id="Play" class="cell curves bold" onclick='myPlayer = new replayAll(500);myPlayer.rewind();'>P</div>
      <div class="rightbox"> </div>
    </div>
    <div class="row">
      <div id="X" class="cell curves bold" onclick='startOver()'>X</div>
      <div class="rightbox"> </div>
    </div>
   </div>
  </div>
 </div>

 <div id="t2"><!-- Controls Go Here --></div>
 </div>
 <div class="rightPhone"></div>
</div>
<div class="spacer"></div>
<pre id="logger2" onMouseOver='Log("Notice", "Mouse is over me now")'>
</pre>

<!--
<p id="target" onClick='solveSudoku(boxCols, boxRows, boxMapString); printToolBar(7);' >Solve me (click here)</p>
-->
</asp:Content>
