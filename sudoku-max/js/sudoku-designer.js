
var designSteps = [];
solutionsList = [];
solutionsArray = [];
var valueMap = [];
var cellValueSize = [];
var designSudokuPuzzle = function(data,maxSolutions) {

    //let data = startPuzzleData.split(",");
    //puzzleString = data[0];
    //boxCols = data[1]?data[1]:boxCols;
    //boxRows = data[2]?data[2]:boxRows;
    //boxMapString = data[3]?data[3]:boxMapString;
    //remapSymbols = data[4]?data[4]:"";
    //puzzleName   = data[5]?data[5]:`${boxCols}x${boxRows}-Sudoku`;
    puzzleLength = data.puzzle_length;
    //puzzleString = (data.puzzle_string).slice(1,puzzleLength-1);
    puzzleString = data.puzzle_string;
    boxCols      = data.box_cols;
    boxRows      = data.box_rows;
    boxMapString = `E${data.box_map}P0`;
    remapSymbols = data.remap_symbols;
    puzzleName   = data.name;
    notes        = data.notes;

    setupSudoku(boxCols,boxRows,boxMapString);

    solutionsList = [];
    solutionsArray = [];
    numValuesInCell = [];
    valueMap = [];
    solveSudoku(maxSolutions,0);
    len = solutionsList.length;
    for (let j=0;j<len;j++) {
        solutionsArray[j] = solutionsList[j].split("");
    }
/*
    for (let i=0,map;i<puzzleLength;i++) {
        map = new Map();
        for (let j=0,value;j<len;j++) {
            value = solutionsArray[j][i];
            if (map.has(value)) {
                map.set(value,map.get(value).push(j));
            } else {
                map.set(value,[j]);
            }
        }
    }
*/
    for (let i=0,map;i<puzzleLength;i++) {
        map = new Map();
        for (let j=0,value,aval;j<len;j++) {
            value = solutionsArray[j][i];
            if (map.has(value)) {
                aval = map.get(value)
                aval.push(j)
                map.set(value,aval);
            } else {
                map.set(value,[j]);
            }
        }
        //numValuesInCell[i] = map.size;
        valueMap[i] = map;
    }
    cellValueSize = valueMap.map(x=>x.size);
}