// skewX and skewY are for adjusting alignment on page due to printer fuzz
var skewX = 2.0;
var skewY = 0;


// Data for the 8366 Label and alignment of text fields
var labelData = {
	label: {
		x: 51,
		dx: 384,
		y: 48,
		dy: 64
	},
	house: {
		x: 208,
		dx: 400,
		y: 61,
		dy: 64
	},
	pname: {
		x: 55,
		dx: 385,
		y: 96,
		dy: 64
	},
	docid: {
		x: 375,
		dx: 383,
		y: 96,
		dy: 64
	}
};
		

// zero indexed row and column helpers:
function getRow (index) {
	return Math.floor(index/2);
}	
function getCol (index) {
	return index % 2;
}


// generic base+step*index+skew calculation
function getItemX (item, index) {
	return labelData[item].x + getCol(index) * labelData[item].dx + skewX;
}

function getItemY (item, index) {
	return labelData[item].y + getRow(index) * labelData[item].dy + skewY;
}

// Generate One Label
function generateLabel (index,svgId,data) {

	var svg = d3.select('#' + svgId);
	svg
	 .append('rect')
	 .attr('id','label-' + index)
	 .attr('class','label8366')
	 .attr('x',getItemX('label',index))
	 .attr('y',getItemY('label',index));
	 
	 svg
	  .append('text')
	  .attr('id','label-' + index + '-house')
	  .attr('class','house')
	  .attr('x',getItemX('house',index))
	  .attr('y',getItemY('house',index))
	  .text(data.house);
	  
	 svg
	  .append('text')
	  .attr('id','label-' + index + '-pname')
	  .attr('class','pname')
	  .attr('x',getItemX('pname',index))
	  .attr('y',getItemY('pname',index))
	  .text(data.pname);
	  
  	 svg
	  .append('text')
	  .attr('id','label-' + index + '-docid')
	  .attr('class','docid')
	  .attr('x',getItemX('docid',index))
	  .attr('y',getItemY('docid',index))
	  .text(data.docid); 
}

// Generate all labels from given starting point
function createLabels (startIndex, svgId, labelDataArray) {
	
	var count = labelDataArray.length;
	for (var i = startIndex, j = 0; i < count+startIndex; i++, j++) {
		generateLabel(i,'svg',labelDataArray[j]);
	}
}
