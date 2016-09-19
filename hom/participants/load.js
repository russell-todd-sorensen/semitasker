

var newXHR3;

var fieldToSearch = 'search';

var searchLength = 0;
var searchList = 'active';
var searchLists = new Array();
var tmpSearchList;

function setup () {

    searchLists['active'] = {
        list: activeCustomers,
        name: 'active',
        fields: {}
    }
    searchLists['all'] = {
        list: customerData,
        name: 'all',
        fields: {}
    }
    searchLists['tmp'] = {
        list: tmpSearchList,
        name: 'tmp',
        fields: {}
    }
    
    tmpSearchList = searchLists[searchList].list;
    searchLists['tmp'].list = tmpSearchList;
}

function loadCsvFile(filename) {
  var urlBase = "./";
  var url = urlBase + filename + ".csv";
  newXHR3 = new XMLHttpRequest();
  newXHR3.open("GET", url, true);
  newXHR3.onreadystatechange = getCSV;
  newXHR3.ondataavailable = null;
  newXHR3.send(null);
}

function loadIntuitInterchangeFormatFile(filename) {
  var urlBase = "./";
  var url = urlBase + filename + ".tsv";
  newXHR3 = new XMLHttpRequest();
  newXHR3.open("GET", url, true);
  newXHR3.onreadystatechange = getIIF;
  newXHR3.ondataavailable = null;
  newXHR3.send(null);
}

function getCSV(evt) {
  
  if (newXHR3.readyState < 4) {
    return;
  }

  var csv = newXHR3.responseText;
  parseCustomerCSV(csv);
}

function getIIF(evt) {
  
  if (newXHR3.readyState < 4) {
    return;
  }
  
  var tabRegexp = /[\t]/gi;
  var iif = newXHR3.responseText.replace(tabRegexp, ',');
  parseCustomerIIF(iif);
}

var index = 0;
var customerData, activeCustomers = [];

parseCustomerCSV = function (csv) {
    
    customerData = d3.csvParse(csv, function(d,i) {
        var search = d.NAME     +' '+
                     d.CUSTFLD5 +' '+
                     d.CUSTFLD6 +' '+
                     d.CUSTFLD9 ;
        return {
            name: d.NAME,
            firstName: d.FIRSTNAME,
            lastName: d.LASTNAME,
            id: d.REFNUM,
            dob: d.CUSTFLD1,
            house: d.CUSTFLD5,
            doc: d.CUSTFLD6,
            cco: d.CUSTFLD8,
            sotp: d.CUSTFLD9,
            active: d.HIDDEN === "Y" ? false : true,
            search: search
        };

    });
    console.log("done loading csv file " + i);
    trimCustomerData(customerData,activeCustomers)
};

parseCustomerIIF = function (iif) {
    
    console.log('parseCustomerIIF starting');
    var start = iif.search('!CUST,NAME');
    iif = iif.substring(start, iif.length-1);
    console.log('start = ' + start);
    console.log('length = ' + iif.length);
    console.log('substring start =' + iif.substring(0,10));
    
    customerData = d3.csvParse(iif, function(d,i) {
        var search = d.NAME     +' '+
                     d.CUSTFLD5 +' '+
                     d.CUSTFLD6 +' '+
                     d.CUSTFLD9 ;
        return {
            name: d.NAME,
            firstName: d.FIRSTNAME,
            lastName: d.LASTNAME,
            id: d.REFNUM,
            dob: d.CUSTFLD1,
            house: d.CUSTFLD5,
            doc: d.CUSTFLD6,
            cco: d.CUSTFLD8,
            sotp: d.CUSTFLD9,
            active: d.HIDDEN === "Y" ? false : true,
            search: search
        };

    });
    
    console.log("done loading iif file.");
    trimCustomerData(customerData,activeCustomers);
    setup();
};

function trimCustomerData(inputArray,outputArray) {
  
    var customer = {};
    
    for (var i = 0;i<inputArray.length;i++) {
        
        customer = inputArray[i];
        
        if (customer.active) {
            outputArray.push(customer);
        }
    }
}