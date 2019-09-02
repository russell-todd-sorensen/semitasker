

// Will address zeros in ip address string
// Assume that string does not begin with zeros...
var divideOld3 = function(digitArray,depth,max) {
    depth--;
    var len = digitArray.length
    var resultList = [];
    var tails = [];
    var k;
    var pushArray;
    var temp, next;

    if (depth == 0 && digitArray.length < 4) {
        var breakHere = true;
    }

    for (var i=0,total=0;i<len;i++) {

        total = total * 10 + parseInt(digitArray[i])

        k = i+1;
        if (k < len) { // we cannot start another section with zero.
            next = parseInt(digitArray[k]);
            if (next == 0) {
                continue
            }
        }

        if (total <= max) {
            if (k==len && depth == 0) {
                resultList.push("" + total);
                continue
            }
            if (depth == 0) {
                continue
            }
            pushArray = [];
            for (var j=k;j<len;j++) {
                pushArray.push(digitArray[j])
            }

            iterations++;
            tails = divide(pushArray,depth,max);

            if (tails.length>0) {
                var stop = 1; // to catch debugger

                for (var r=0;r<tails.length;r++) {
                    temp = "" + total + "." + tails[r]
                    resultList.push(temp)
                }
            }
        }
    }
    return resultList
}

var divideOld2 = function(digitArray,depth,max) {
    depth--;
    var len = digitArray.length
    var resultList = [];
    var tails = [];
    var k;
    var pushArray;
    var temp;

    if (depth == 0 && digitArray.length < 4) {
        var breakHere = true;
    }

    for (var i=0,total=0;i<len;i++) {
        total = total * 10 + parseInt(digitArray[i])

        k = i+1;
        if (total <= max) {
            if (k==len && depth == 0) {
                resultList.push("" + total);
                continue
            }
            if (depth == 0) {
                continue
            }
            pushArray = [];
            for (var j=k;j<len;j++) {
                pushArray.push(digitArray[j])
            }

            iterations++;
            tails = divide(pushArray,depth,max);

            if (tails.length>0) {
                var stop = 1; // to catch debugger

                for (var r=0;r<tails.length;r++) {
                    temp = "" + total + "." + tails[r]
                    resultList.push(temp)
                }
            }
        }
    }
    return resultList
}

var divideOld = function(digitArray,depth,max) {
    depth--;
    var len = digitArray.length
    var resultList = [];
    var tails = [];
    var k;
    var pushArray;
    var temp;
    var breakHere;

    if (depth == 0 && digitArray.length < 4) {
        breakHere = true;
    }

    for (var i=0,total=0;i<len;i++) {
        total = total * 10 + parseInt(digitArray[i])
    
        if (total == 0 && depth == 1) {
            breakHere = true;
        }

        k = i+1;
        if (total <= max) {
            if (k==len && depth == 0) {
                resultList.push([total]);
                continue
            }
            if (depth == 0) {
                continue
            }
            pushArray = [];
            for (var j=k;j<len;j++) {
                pushArray.push(digitArray[j])
            }

            iterations++;
            tails = divide(pushArray,depth,max);

            if (tails.length>0) {
                var stop = 1; // to catch debugger

                for (var r=0;r<tails.length;r++) {
                    tails[r].splice(0,0,total)
                    resultList.push([tails[r]])
                }
            }
        }
    }
    return resultList
}
