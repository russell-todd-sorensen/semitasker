

var newXHR3;

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

  var iff = newXHR3.responseText;
  parseCustomerIIF(iif);
}

var index = 0;
var customerData, activeCustomers = [];

parseCustomerCSV = function (csv) {
    
    customerData = d3.csvParse(csv, function(d,i) {
 
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
            active: d.HIDDEN === "Y" ? false : true
        };

    });
    console.log("done loading csv file " + i);
    trimCustomerData(customerData,activeCustomers)
};

parseCustomerIIF = function (iif) {
    
    console.log('parseCustomerIIF starting');
    var start = iff.search('!CUST');
    iif = iif.substring(start, iif.length-1);
    console.log('start = ' + start);
    console.log('length = ' + iff.length);
    console.log('substring start =' + iff.substring(0,10));
    
    customerData = d3.tsvParse(iif, function(d,i) {
 
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
            active: d.HIDDEN === "Y" ? false : true
        };

    });
    
    console.log("done loading iif file.");
    trimCustomerData(customerData,activeCustomers);
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