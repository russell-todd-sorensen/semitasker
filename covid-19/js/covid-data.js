//var newXHR3;
var xhrArray = new Array();

var covidStateData;
var covidCountyData;

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

function getCovidStateTableCSV(evt) {
    if (evt.currentTarget.readyState < 4) {
        return;
    }

    parseCovidStateTableCSV(evt.currentTarget.responseText);
}

function getCovidCountyTableCSV(evt) {
    if (evt.currentTarget.readyState < 4) {
        return;
    }

    parseCovidCountyTableCSV(evt.currentTarget.responseText);
}

parseCovidStateTableCSV = function (csv) {
    covidStateData = d3.csvParse(csv, function(d,i) {
        return {
            id: parseInt(d["fips"]),
            state: d["state"],
            date: d["date"],
            cases: parseInt(d["cases"]),
            deaths: parseInt(d["deaths"]),
        };
    });
    console.log("done loading CovidStatesTable csv file");
    //setup();
};
parseCovidCountyTableCSV = function (csv) {
    covidCountyData = d3.csvParse(csv, function(d,i) {
        return {
            id: parseInt(d["fips"]),
            state: d["state"],
            county: d["county"],
            date: d["date"],
            cases: parseInt(d["cases"]),
            deaths: parseInt(d["deaths"]),
        };
    });
    console.log("done loading CovidCountyTable csv file");
    //setup();
};
//date,state,fips,cases,deaths