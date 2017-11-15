//var newXHR3;
var xhrArray = new Array();

var chemicalPiData;
var beginElement = {
  element: '',
  symbol: '',
  id: -1,
  atomicNumber: -1
};

function loadCsvFile(filename) {
  var urlBase = "./";
  var url = urlBase + filename + ".csv";
  var i = xhrArray.length;
  xhrArray[i] = new XMLHttpRequest();
  var newXHR3 = xhrArray[i];
  newXHR3.open("GET", url, true);
  newXHR3.onreadystatechange = getCSV;
  newXHR3.ondataavailable = null;
  newXHR3.send(null);
}

function loadXHRFile(url,callback) {
  var i = xhrArray.length;
  xhrArray[i] = new XMLHttpRequest();
  var newXHR3 = xhrArray[i];
  newXHR3.open("GET", url, true);
  newXHR3.onreadystatechange = callback;
  newXHR3.ondataavailable = null;
  newXHR3.send(null);
}

function getPeriodicTableCSV(evt) {
  if (evt.currentTarget.readyState < 4) {
    return;
  }

  parsePeriodicTableCSV(evt.currentTarget.responseText);
}

parsePeriodicTableCSV = function (csv) {
    chemicalPiData = d3.csvParse(csv, function(d,i) {
        return {
            id: parseInt(d["AtomicNumber"]),
            element: d["Element"],
            symbol: d["Symbol"],
            atomicNumber: parseInt(d["AtomicNumber"])
        };

    });
    chemicalPiData[chemicalPiData.length] = beginElement;
    console.log("done loading PeriodicTable csv file");
    setup();
};
