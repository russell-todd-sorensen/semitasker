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
	num: {
		x: 22,
		y: 85,
		dx: 2*384-17,
		dy: 64
	},
	pname: {
		x: 55,
		dx: 385,
		y: 90,
		dy: 64
	},
	docid: {
		x: 375,
		dx: 383,
		y: 90,
		dy: 64
	},
	role: {
	    x: 208,
		dx: 400,
		y: 108,
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


function deleteLabel (index,svgId) {
	var svg = d3.select('#' + svgId);
	var template = '#label-' + index;
	svg.select(template).remove();
	svg.select(template + "-house").remove();
	svg.select(template + "-pname").remove();
	svg.select(template + "-docid").remove();
	svg.select(template + "-role").remove();
}
// Generate One Label
function generateLabel (index,svgId,data) {

	var svg = d3.select('#' + svgId);
	var rect = svg.append('rect');
	rect
	 .attr('id','label-' + index)
	 .attr('class','label8366')
	 .attr('x',getItemX('label',index))
	 .attr('y',getItemY('label',index))
	 .on('click', function (d,i) {
	 	  var data = this.id;
	 	  var re = /(label-)([0-9]*)/;
	 	  var match =  data.match(re);
	 	  var labelId = match[0];
	 	  $('#' + formIds.editIndex).val(match[2]);
	
	 	  getLabelData(labelId,formIds.docid);	
	 	  getLabelData(labelId,formIds.pname);
	 });
	 
	 if (data.house == null && 
		data.pname == null &&
	    data.docid == null &&
	    data.role == null &&
	    data.extra == null ) {
	 	rect.classed('null', false);
	 	//rect.classed('null', true);
		//
	 } else { 
	 	 return null;
	 }
	 
	 svg
	  .append('text')
	  .attr('id','num-' + index)
	  .attr('class','num')
	  .attr('x',getItemX('num',index))
	  .attr('y',getItemY('num',index))
	  .text(index + '/' + (29-index));

}

// Generate all labels from given starting point
function createLabels(startIndex, svgId, labelDataArray) {
	
	var count = labelDataArray.length;
	for (var i = startIndex, j = 0; i < count+startIndex; i++, j++) {
		generateLabel(i,'svg',labelDataArray[j]);
	}
}

function destroyLabels(startIndex,svgId,labelDataArray) {
	var count = labelDataArray.length;
	for (var i = startIndex, j = 0; i < count+startIndex; i++, j++) {
		deleteLabel(i,'svg');
	}
}