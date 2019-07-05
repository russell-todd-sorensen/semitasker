
// returns index of cumulative precentage of range of random value
// if second argument is passed, it is used instead of the random value;
function getRangeIndex (list) {
	var r = Math.random();
	var pct = 0;
	var i = 0;

	while (i<list.length) {
		pct = pct + list[i];
		if (r<pct) break;
		i++;
	}
	//Log.Notice('r=' + r + ' pct=' + pct +  ' i=' + i );
	return i;
}

var MatrixPre = function (r,s,φ,ψ,e,f,pct) {
	var a = r * Math.cos(φ);
	var b = -s * Math.sin(ψ);
	var c = r * Math.sin(φ);
	var d = s * Math.cos(ψ);

	if (a*1000000.0 < 1) {
		a = 0;
	}
	if (b*1000000.0 < 1) {
		b = 0;
	}
	if (c*1000000.0 < 1) {
		c = 0;
	}
	if (d*1000000.0 < 1) {
		d = 0;
	}

	return new Matrix(a,b,c,d,e,f,pct);
}

var imageContractionEstimate = function(m) {
	var delta = 0.01;
	var total = 0.00;
	for (var i = 0; i<m.length;i++) {
		total = total + Math.max(m[i].contraction,delta);
	}
	for (var i = 0; i<m.length;i++) {
		m[i].pctEst = Math.max(m[i].contraction,delta)/total;
	}
}
