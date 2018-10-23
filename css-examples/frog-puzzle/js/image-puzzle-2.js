// JavaScript Document

var puzzleImage = new Image();
//var emptyY, emptyX;

function processForm (form) {
	
	Log.Notice("Processing form...");
	puzzleImage.src = $(':input#image').val();
	Log.Notice("Image=" + puzzleImage.src);
	var tileDim = $(':input#tile-size').val();
	var puzzleRowsNCols = $(':input#rows-n-cols').val();
	var border = $(':input#border').val();
	//image, tileMin, rowsTry, colsTry, border
	setTimeout("generatePuzzle(puzzleImage,"+ tileDim + "," + puzzleRowsNCols 
			+ "," + puzzleRowsNCols + "," + border + ");", 1000);
}

function generatePuzzle (image, tileMin, rowsTry, colsTry, border) {
	
	var height = image.height;
	var width = image.width;
	
	if (arguments.length < 5) {
		borderWidth = 1; // get from CSS class .line border-width
	} else {
		borderWidth = border;
	}
	if (arguments.length < 4) {
		cols = 4;
	} else {
		cols = colsTry;
	}
	if (arguments.length < 3) {
		rows = 4;
	} else {
		rows = rowsTry;
	}
	if (arguments.length < 2) {
		minDim = 75;
	} else {
		minDim = tileMin;
	}

	var tileHeight, tileWidth;
	var adjustedHeight, adjustedWidth;
	
	d3.select("#picture")
		.style("width", width + "px")
		.style("height", height + "px")
		.style("background-image", "url(" + image.src + ")");
	
	// test out the puzzle dimensions vs minimum
	while (cols > 0 && width/cols < minDim) {
		Log.Notice("cols=" + cols + "width/cols=" + width/cols);
		cols--;
	}
	
	if (cols == 0) {
		Log.Error("Cols is zero");
		cols = 1;
	}
		
	tileWidth = Math.floor(width/cols);
	
	while (rows > 0 && height/rows < minDim) {
		rows--;
	}
	
	if (rows == 0) {
		Log.Error("Rows is zero");
		rows = 1;
	}
	
	tileHeight = Math.floor(height/rows);
	
	var puzzleWidth =  tileWidth * cols + (2*borderWidth*cols);
	var puzzleHeight =  tileHeight * rows + (2*borderWidth* rows);
	
	Log.Notice("tileHeight=" + tileHeight + " tileWidth=" + tileWidth);
	Log.Notice ("rows=" + rows + " cols=" + cols);
	
	var puzzle = d3.select('#puzzle')
	 	.style("width",puzzleWidth + "px")
		.style("height",puzzleHeight + "px");
	var tileId;
	var tileX, tileY;
	
	var tileData = new Array();
	var puzzleDropzone = new Array();
	
	// create the tileData 
	for (var row = 0; row<rows; row++) {
		puzzleDropzone[row] = new Array();
		for (var col = 0; col<cols; col++) {
			var tmp = new Object();
			tmp.row = row;
			tmp.col = col;
			tmp.tileId = "t-" + row + "-" + col;
			tmp.class = "tile";
			
			tmp.tileX = tileWidth * col + (2*borderWidth*col);
			tmp.tileY = tileHeight * row + (2*borderWidth*row); 
			
			tileData[tileData.length] = tmp;
			puzzleDropzone[row][col] = {right: tmp.tileX, bottom: tmp.tileY, tileId: tmp.tileId};
		}
	}
	
  puzzle.selectAll(".tile")
	  .data(tileData)
		.enter()
		.append("div")
		.attr("id", function(d,i) {return d.tileId;})
		.attr("class", function(d,i) {return d.class;})
		.style("bottom", function(d,i) {return d.tileY + "px";})
		.style("right", function(d,i) {return d.tileX + "px";})
		.style("height", function(d,i) {return tileHeight + "px";})
		.style("width", function(d,i) {return tileWidth + "px";})
		.style("background-image", function(d,i) {return "url(" + image.src + ")";})
		.style("background-position", function(d,i) {
			return "" + (d.tileX + tileWidth - (2*d.col*borderWidth)) 
				        + "px " + (d.tileY + tileHeight - (2*d.row*borderWidth)) + "px"; 
		} );
	
  // remove the empty piece
	var emptyY = 0;
	var emptyX = cols-1;
	var empty = puzzleDropzone[emptyY][emptyX];
	d3.select("#" + empty.tileId).remove();
	empty.tileId = "empty";

	d3.selectAll(".tile")
    //.on("mouseover", function(d,i,e) {
		//	evt = d3.event;
		//	Log.Notice("in mouseover at x=" + evt.pageX + " y=" + evt.pageY);
		//	d3.select(this)
		//	  .append("div")
		//		.attr("class", "popup")
		//		.attr("id", "popup-" + d.tileId)
		//		//.style("top", (evt.pageY/2) + "px")
		//		//.style("left", (evt.pageX/2) + "px")
		//		.text("tileId=" + d.tileId 
		//		     + "\nrow=" + d.row 
		//				 + "\ncol=" + d.col);
		//	Log.Notice("done it!");
		//})
		//.on("mouseout", function(d,i,e) {
		//	evt = d3.event;
		//	d3.select("#popup-" + d.tileId).remove();
		//})
		.on("click", function(d,i,e) {
			var event = d3.event;

			origRow = d.row;
			origCol = d.col;
			
			// figure out which direction the piece is going
			var moveTo = [rows,cols];
			var foundMoveTo = false;
			while (true) {

				if (d.row+1 < rows && puzzleDropzone[d.row+1][d.col].tileId == "empty") {
					moveTo = [d.row+1, d.col];
					foundMoveTo = true;
					break;
				}
				if (d.row-1 >= 0 && puzzleDropzone[d.row-1][d.col].tileId == "empty"){
					moveTo = [d.row-1, d.col];
					foundMoveTo = true;
					break;
				}
				if (d.col+1 < cols && puzzleDropzone[d.row][d.col+1].tileId == "empty") {
					moveTo = [d.row, d.col+1];
					foundMoveTo = true;
					break;
				}
				if (d.col-1 >= 0 && puzzleDropzone[d.row][d.col-1].tileId == "empty") {
					moveTo = [d.row, d.col-1];
					foundMoveTo = true;
					break;
				}
				// always exit
				break;
			}
			
			if (!foundMoveTo) {
				Log.Notice("No place to move");
				return;
			} else {
				Log.Notice("Moving to " + moveTo);
			}
			
			d.row = moveTo[0];
			d.col = moveTo[1];
			
			var dropZone = puzzleDropzone[d.row][d.col];
			
			if (dropZone.tileId != "empty") {
				// restore current tile
				Log.Notice("trying to move tile into non-empty position row="
				   + d.row + " col=" + d.col);
				d.row = origRow;
				d.col = origCol;

			} else {
			
				Log.Notice("Move tile into empty position row=" + d.row 
					+ " col=" + d.col + " from row=" + origRow + " col=" + origCol);  
				
				d3.select(this)
				  .transition()
					.duration(500)
					.style("bottom", dropZone.bottom + "px")
					.style("right", dropZone.right + "px");
				
				// update the tileID stuff here as well
				puzzleDropzone[d.row][d.col].tileId = d.tileId;
				puzzleDropzone[origRow][origCol].tileId = "empty";
				Log.Notice("From: dropzone[" + origRow + "][" + origCol + "].tileId=" 
					 + puzzleDropzone[origRow][origCol].tileId );
				Log.Notice("To:   dropzone[" + d.row + "][" + d.col + "].tileId="  
					 + puzzleDropzone[d.row][d.col].tileId );

			}
	  });
		
		function nextMoves(exclude) {
			var row = emptyY;
			var col = emptyX;
			var tmpChoices = [1,2,3,4] // go w, e, n, s
			var choices = [];
			
			// add to exclude the impossible moves
			if (emptyX-1 < 0) {
				// exclude 1
				exclude[exclude.length] = 1;
			}
			if (emptyX+1 >= cols) {
				// exclude 2
				exclude[exclude.length] = 2;
			}
			if (emptyY-1 < 0) {
				// exclude 3
				exclude[exclude.length] = 3;
			}
			if (emptyY+1 >= rows) {
				// exclude 4
				exclude[exclude.length] = 4;
			}
			
			var found = 0;
			
			for (var j = 0; j<tmpChoices.length; j++) {
				found = 0;
				for (var i = 0; i<exclude.length; i++) {
					if (exclude[i] == tmpChoices[j]) {
						found = 1;
						break;
					}
				}
				if (found == 0) {
					choices[choices.length] = tmpChoices[j];
				}
			}
			
			Log.Notice("nextMoves choices=" + choices + " exclude=" + exclude);

			return choices;
			
		}
		
		function randomizePuzzle() {
			
			var steps = 2*rows*cols;
			var rand;
			var dropzone;
			var exclude = [];
			var choices = [];
			// initialize Math.random()
			var rand, index = Math.floor(Math.random(Date.now)*choices.length);
			
			while (steps > 0) {
				
				// avoid moving tile back to where it just came from
				choices = nextMoves(exclude);
				index = Math.floor(Math.random()*choices.length);
				
				if (typeof(index) == "number") {
					rand = choices[index];
				} else {
					Log.Notice("index is not a number index=" + index + " typeof(index)=" + typeof(index));
					break;
				}
				
				if (typeof(rand) != "number") {
					Log.Notice("rand is not a number rand=" + rand + " typeof(rand)=" + typeof(rand) + " index=" + index);
					break;
				}
				
				Log.Notice("choices=" + choices + " index=" + index + " randvalue=" + rand);
				
				switch (rand) {
				case 1:  // piece goes w
					if (emptyX - 1 >= 0) {
						Log.Notice("Case 1: To y,x=" + emptyY + "," 
						   + emptyX + " From=" + emptyY + "," + (emptyX-1));
							 
						emptyX--;
						exclude = [2];
						dropzone = puzzleDropzone[emptyY][emptyX];
						$('#' + dropzone.tileId).click();

					}
					break;
				case 2: // piece goes e
					if (emptyX+1 < cols) {
						
						Log.Notice("Case 2: To y,x=" + emptyY + ","
						   + emptyX + " From=" + emptyY + "," + (emptyX+1));
						emptyX++;
						exclude = [1];
						dropzone = puzzleDropzone[emptyY][emptyX];
						$('#' + dropzone.tileId).click();

					}
					break;
				case 3: // piece goes n
					if (emptyY - 1 >= 0) {
						Log.Notice("Case 3: To y,x=" + emptyY + "," + emptyX
						   + " From=" + (emptyY-1) + "," + emptyX);
						emptyY--;
						exclude = [4];
						dropzone = puzzleDropzone[emptyY][emptyX];
						$('#' + dropzone.tileId).click();
						
					}
					break;
				case 4: // piece goes s
					if (emptyY+1 < rows) {
						Log.Notice("Case 4: To y,x=" + emptyY + ","
						   + emptyX + " From=" + (emptyY+1) + "," + emptyX);
						emptyY++;
						exclude = [3];
						dropzone = puzzleDropzone[emptyY][emptyX];
						$('#' + dropzone.tileId).click();
						
					}
					break;
				default:
					break;
				} // end switch
				
				
				// since every step should succeed, we decr steps:
				steps--;
				
			} // end while
			
			
			
		}
		

		randomizePuzzle();
		return; 
}

