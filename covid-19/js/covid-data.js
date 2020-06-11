//var newXHR3;
var xhrArray = new Array();

var covidStateData = [],
    covidCountyData = [],
    covidPopData = [],
    stateTable,
    countyTable,
    popTable;

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

function get2019PopulationTableCSV(evt) {
    if (evt.currentTarget.readyState < 4) {
        return;
    }

    parse2019PopulationTableCSV(evt.currentTarget.responseText);
}

parseCovidStateTableCSV = function (csv) {
    covidStateData = d3.csvParse(csv, function(d,i) {
        return {
            id: i,
            fips: parseInt(d["fips"]),
            sname: d["state"],
            cname: "all",
            date: d["date"],
            cases: parseInt(d["cases"]),
            deaths: parseInt(d["deaths"]),
        };
    });
    console.log("done loading CovidStatesTable csv file");
    stateTable = new DataTable("stateTable",covidStateData);
};

parseCovidCountyTableCSV = function (csv) {
    covidCountyData = d3.csvParse(csv, function(d,i) {
        return {
            id: i,
            fips: parseInt(d["fips"]),
            sname: d["state"],
            cname: d["county"],
            date: d["date"],
            cases: parseInt(d["cases"]),
            deaths: parseInt(d["deaths"]),
        };
    });
    console.log("done loading CovidCountyTable csv file");
    countyTable = new DataTable("countyTable",covidCountyData);
    countyTable.setup();
};

parse2019PopulationTableCSV = function (csv) {
    covidPopData = d3.csvParse(csv, function(d,i) {
        return {
            id: i,
            fips: parseInt(d["STATE"]),
            sname: d["NAME"],
            cname: "all",
            pop: d["POPESTIMATE2019"],
            change: d["NPOPCHG_2019"],
            births: d["BIRTHS2019"],
            deaths: d["DEATHS2019"],
        };
    });
    console.log("done loading 2019PopulationTable csv file");
    popTable = new DataTable("popTable",covidPopData);
};
