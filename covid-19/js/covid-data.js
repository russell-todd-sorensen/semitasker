//var newXHR3;
var xhrArray = new Array(),
    covidStateData = [],
    covidCountyData = [],
    covidStatePopData = [],
    covidCountyPopData = [],
    stateTable,
    countyTable,
    statePopTable,
    countyPopTable,
    tableNameToObj = [];

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

function get2019statePopTableCSV(evt) {
    if (evt.currentTarget.readyState < 4) {
        return;
    }

    parse2019statePopTableCSV(evt.currentTarget.responseText);
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

    Log.Notice("done loading CovidStatesTable csv file");
    stateTable = new DataTable("stateTable",covidStateData);
    tableNameToObj["stateTable"] = stateTable;
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

    Log.Notice("done loading CovidCountyTable csv file");
    countyTable = new DataTable("countyTable",covidCountyData);
    tableNameToObj["countyTable"] = countyTable;
    initialSetup();
};

parse2019statePopTableCSV = function (csv) {
    covidStatePopData = d3.csvParse(csv, function(d,i) {
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

    Log.Notice("done loading 2019StatePopulationTable csv file");
    statePopTable = new DataTable("statePopTable",covidStatePopData);
    tableNameToObj["statePopTable"] = statePopTable;
};


let fieldToSearch = "sname",
    tableToSearch = "stateTable",
    searchList = 'state',
    outputType = 'list',
    searchLength = 0,
    searchLists = new Array(),
    tmpSearchList,
    index = 0,
    slLists = [];

searchLists['state'] = {
    list: covidStateData,
    table: stateTable,
    name: 'state',
    fields: [
        {
            name:"id",
            type: "integer",
            descr: "Internal Reference Number",
        },
        {
            name:"fips",
            type:"integer",
            descr:"Federal Jurisdictional Code", 
        },
        {
            name:"sname",
            type:"string",
            descr:"State Name",
        },
        {
            name:"cname",
            type:"string",
            value:"all",
            descr:"County Name",
        },
        {
            name:"date",
            type:"date",
            descr:"Date for this datapoint",
        },
        {
            name:"cases",
            type:"integer",
            descr:"total positive cases",
        },
        {
            name:"deaths",
            type:"integer",
            descr:"total deaths",
        }
    ],
}
searchLists['county'] = {
    data: covidCountyData,
    table: countyTable,
    name: 'county',
    fields: [
        {
            name:"id",
            type: "integer",
            descr: "Internal Reference Number",
        },
        {
            name:"fips",
            type:"integer",
            descr:"Federal Jurisdictional Code", 
        },
        {
            name:"sname",
            type:"string",
            descr:"State Name",
        },
        {
            name:"cname",
            type:"string",
            descr:"County Name",
        },
        {
            name:"date",
            type:"date",
            descr:"Date for this datapoint",
        },
        {
            name:"cases",
            type:"integer",
            descr:"total positive cases",
        },
        {
            name:"deaths",
            type:"integer",
            descr:"total deaths",
        }]
},
searchLists['statePop'] = {
    data: covidStatePopData,
    name: 'statePop',
    fields: [
        {
            name:"id",
            type: "integer",
            descr: "Internal Reference Number",
        },
        {
            name:"fips",
            type:"integer",
            descr:"Federal Jurisdictional Code", 
        },
        {
            name:"jurType",
            type:"string",
            descr:"Jurisdiction Type (FIPS)"
        },
        {
            name:"sname",
            type:"string",
            descr:"State Name",
        },
        {
            name:"cname",
            type:"string",
            descr:"County Name",
        },
        {
            name:"population",
            type:"integer",
            descr:"Population of Jurisdiction.",
        },
        {
            name:"change",
            type:"integer",
            descr:"Change since last year.",
        },
        {
            name:"births",
            type:"integer",
            descr:"total births over year",
        },
        {
            name:"deaths",
            type:"integer",
            descr:"total deaths over year",
        }
    ]
},
searchLists['countyPop'] = {
    data: covidCountyPopData,
    name: 'countyPop',
    fields: [
        {
            name:"id",
            type: "integer",
            descr: "Internal Reference Number",
        },
        {
            name:"fips",
            type:"integer",
            descr:"Federal Jurisdictional Code", 
        },
        {
            name:"jurType",
            type:"string",
            descr:"Jurisdiction Type (FIPS)"
        },
        {
            name:"sname",
            type:"string",
            descr:"State Name",
        },
        {
            name:"cname",
            type:"string",
            descr:"County Name",
        },
        {
            name:"population",
            type:"integer",
            descr:"Population of Jurisdiction.",
        },
        {
            name:"change",
            type:"integer",
            descr:"Change since last year.",
        },
        {
            name:"births",
            type:"integer",
            descr:"total births over year",
        },
        {
            name:"deaths",
            type:"integer",
            descr:"total deaths over year",
        }
    ],
};

searchLists['tmp'] = {
    list: tmpSearchList,
    name: 'tmp',
    fields: {},
};
