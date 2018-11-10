
var setupOptionCellsOriginal = function() {
    re = /C([1-9]+[0-9]*)/;
    $(".numberCell").each(function() {
        var matchArray,cType, cellNumber, cMask;
        var html = "";//cType, rMask, cMask, bMask;
        var id= this.id;
        Log.Notice("id='" + id + "'");

        matchArray = id.match(re);

        if (!matchArray) {
            Log.Notice("cell with id='" + id + "' not parsed for cellNumber." );
            return;
        }
        cellNumber = parseInt(matchArray[1]);
        cType = cellType[cellNumber];

        Log.Notice("cellNumber='" + cellNumber + "' cellType='" + cellType + "'");
        if (cType != 'A') {
            return;
        }
        cMask = rowMask[cellRow[cellNumber]] & colMask[cellCol[cellNumber]] & boxMask[cellBox[cellNumber]];

        for (var i=0;i<puzzleDimension;i++) {
            if ( (cMask & (1<<i)) != 0) {
                html += "<div class='optionCell'>" + defaultSymbols[i] + "</div>"
            } else {
                html += "<div class='optionCell'>&nbsp;</div>"
            }
        }
        $(this).html(html);
        Log.Notice("cMask='" + cMask + "'");
    });
}

// toggleOption enables removing options manually.

var toggleOption = false;

var markCell = false;

var selectOption = function (cellNumber, sIndex) {
    if (markCell) {
        softSelectOption(cellNumber,sIndex);
        return false;
    }
    if (toggleOption) {
        removeCellOption(cellNumber, sIndex);
    } else {
        updateMaskValues(cellNumber, sIndex);
        setupOptionCells();
    }
}

var unSelectOption = function (cellNumber) {
    resetMaskValues(cellNumber);
    setupOptionCells();
}


var selectLegendOption = function (targetId, sIndex) {
    $('#' + targetId).html(defaultSymbols[sIndex]);
}

var softSelectOption = function(cellNumber, sIndex) {
    $('#t #C' + cellNumber + ' .optionCell').each(function() {
        if (this.id == 'C' + cellNumber + '-' + sIndex) {
            if($(this).hasClass('marked')) {
                $(this).removeClass('marked');
            } else {
                $(this).addClass('marked');
            }
        } else {
            $(this).removeClass('marked');
        }
    })
}

var setupOptionCells = function() {
    re = /C([1-9]+[0-9]*)/;
    $(" #t .cell").each(function() {
        var matchArray, cType, cellNumber, cMask, uMask, classAttVal;
        var html = "";//cType, rMask, cMask, bMask;
        var id= this.id;
        //Log.Notice("id='" + id + "'");

        matchArray = id.match(re);

        if (!matchArray) {
            Log.Error("cell with id='" + id + "' not parsed for cellNumber." );
            return;
        }
        cellNumber = parseInt(matchArray[1]);
        cType = cellType[cellNumber];

        //Log.Notice("cellNumber='" + cellNumber + "' cType='" + cType + "'");
        if (cType == 'F' || cType == 'V') {
            classAttVal = $(this).attr('class');
            if  (classAttVal && classAttVal.indexOf("fixed") == -1) {
                $('#' + id).attr("class", classAttVal + " fixed");
            }
        }

        if (cType == 'V') {
            $(this).html(puzzle[cellNumber]);
            setTimeout("$('#" + id + "').attr('onClick','unSelectOption(\"" + cellNumber + "\");');",10);
        }

        if (cType != 'A') {
            return;
        }

        $(this).attr('onClick','');
        $(this).removeClass('fixed');

        // This mask is based upon only the givens and guessed cells
        cMask = rowMask[cellRow[cellNumber]] & colMask[cellCol[cellNumber]] & boxMask[cellBox[cellNumber]];

        if (cellMask[cellNumber]) {
            uMask = cellMask[cellNumber];
        } else {
            uMask = cMask;
        }
        uMask &= cMask;
        for (var i=0;i<puzzleDimension;i++) {
            if ( (uMask & (1<<i)) != 0) {
                html += "<div id='" + id + "-" + i + "' class='optionCell' onClick='selectOption(" + cellNumber + "," + i + ")'>" + defaultSymbols[i] + "</div>"
            } else {
                html += "<div id='" + id + "-" + i + "' class='optionCell'  onClick='addCellOption(" + cellNumber + "," + i + ")'><span class='hn'>" + defaultSymbols[i] + "</span></div>"
            }
        }
        $(this).html(html);
        //Log.Notice("cMask='" + cMask + "'");
    });
    return false;
};

var setupLegendCell = function() {
    var cellNumber = activeCells+2;
    var cId = 'C' + cellNumber;
    var html = "";
    var uMask;

    cellType[cId] = 'L';
    uMask = cellMask[cId] = cellMask[0];
    $('#legendCellOptions').html("");
    $('#legendCellOptions').append("<div id='" + cId + "' class='cell'></div>");
    $('#legendCellOptions').append("<div id='legendCellLargeOption' class='cell box1 bold fixed'></div>");

    for (var i=0;i<puzzleDimension;i++) {
            html += "<div class='optionCell' onClick='selectLegendOption(\"legendCellLargeOption\"," + i + ")'>" + defaultSymbols[i] + "</div>"
    }

    $('#' + cId).html(html);
};


var choosePuzzle = function(id) {

    var rs = $('#remap-symbols-input').val();
    remapPuzzleSymbols(rs);
    solveSudokuX(boxCols, boxRows, boxMapString);
}

var remapPuzzleSymbols = function(rs) {
    if (rs.length > 0) {
        remapSymbols = rs;

        fillRemapSymbols();
    }
    if (remapSymbols.length > 0) {
        //for (var i=0;i<remapSymbols.length;i++) {
        //    defaultSymbols[i] = remapSymbols[i];
        //}
        defaultSymbols = "" + remapSymbols;
        var puzzleStringTmp = ["E"];
        var val;
        for (var i=1;i<puzzleString.length;i++) {
            val = parseInt(puzzleString[i]);
            if (val == 0) {
                puzzleStringTmp[i] = "0";
            } else {
                puzzleStringTmp[i] = remapSymbols[val-1];
            }
        }
        puzzleStringTmp[i+1] = "P";
        puzzleString = puzzleStringTmp.join("");
    } else {
        defaultSymbols = "" + defaultSymbolsProto;
    }
}

var updateSymbols = function(selectId, inputId) {
    var s = $('#' + selectId + " option:selected").val();
    $('#' + inputId).val(s);
}

var fillRemapSymbols = function() {
    if (remapSymbols.length<boxCols*boxRows) {
        remapSymbols += defaultSymbolsProto.substring(remapSymbols.length,boxCols*boxRows);
    }
}

var viewPuzzle = function(id) {
    var value = $('#' + id).val();
    var puzzle;
    Log.Notice('value=' + value);
    var integerValue = parseInt(value);

    if (
        (integerValue > -1) &&
        (integerValue < (sudokuData.length-1))
    ) {
        puzzle = sudokuData[integerValue];
        puzzleString = puzzle.puzzle_string;
        boxCols = puzzle.box_cols;
        boxRows = puzzle.box_rows;
        boxMapString = puzzle.box_map;
        remapSymbols = puzzle.remap_symbols;
        puzzleName = puzzle.name;
        setupSudoku();
        setupComplete = false;
        if (boxMapString.length > 0) {
            boxMapString = "E" + boxMapString + "P0";
        }
        // was remap symbols here
    }

    var formattedPuzzle = printPuzzleFormatted(3);
    $('#t').html("<div id='puzzle-graphic'>" + formattedPuzzle + "</div>");
    $('#puzzle-info').html("");

    if (boxMapString.length>0) {
        $('#puzzle-info').append("<div id='box-map-string'>" + boxMapString + "</div>");
    }

    //if (remapSymbols.length<boxCols*boxRows) {
    //    remapSymbols += defaultSymbolsProto.substring(remapSymbols.length,boxCols*boxRows);
    //}
    fillRemapSymbols();

    symbolOptions = [];

    for (var i=0;i<sudokuData.length;i++) {
        symbolOptions[sudokuData[i].remap_symbols] = sudokuData[i].remap_symbols;
    }

    $('#puzzle-info').append("<div id='remap-symbols'>Symbols: <input class='symbol-input' type='string' id='remap-symbols-input' value='" + remapSymbols + "' /></div>");
    $('#puzzle-info').append("<select class='symbol-input' id='remap-symbol-choices' name='remap-symbol-choices' onChange='updateSymbols(\"remap-symbol-choices\",\"remap-symbols-input\")'>"
        + "<option  class='symbol-input' selected value='" + remapSymbols + "'>" + remapSymbols + "</option>"  );


    var traditionalSymbols = defaultSymbolsProto.substring(0,boxCols*boxRows);
    $('#remap-symbol-choices').append("<option value='" + traditionalSymbols + "'>" + traditionalSymbols + "</option>");

    for (var s in symbolOptions) {
        $('#remap-symbol-choices').append("<option class='symbol-input' value='" + s + "'>" + s + "</option>");
    }

}
