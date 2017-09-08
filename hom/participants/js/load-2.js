

var newXHR3;

var fieldToSearch = 'search';

var searchLength = 0;
var searchList = 'active';
var outputType = 'list';
var searchLists = new Array();
var tmpSearchList;


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
  var url = urlBase + filename + ".IIF";
  newXHR3 = new XMLHttpRequest();
  newXHR3.open("GET", url, true);
  newXHR3.onreadystatechange = getIIF;
  newXHR3.ondataavailable = null;
  newXHR3.send(null);
}

function loadXHRFile(url,callback) {
  newXHR3 = new XMLHttpRequest();
  newXHR3.open("GET", url, true);
  newXHR3.onreadystatechange = callback;
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
            dob: d.CUSTFLD7,
            house: d.CUSTFLD5,
            doc: d.CUSTFLD6,
            cco: d.CUSTFLD8,
            sotp: d.CUSTFLD9,
            active: d.HIDDEN === "Y" ? false : true,
            startDate: d.CUSTFLD1,
            endDate: d.CUSTFLD2,
            search: search,
            ctype: d.CTYPE,
            voucher: d.COMPANYNAME,
            address: d.BADDR1 + '<br>' + d.BADDR2 + '<br>'
                + d.BADDR3 + '<br>' + d.BADDR4 + '<br>',
            email: d.EMAIL,
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
            dob: d.CUSTFLD7,
            house: d.CUSTFLD5,
            doc: d.CUSTFLD6,
            cco: d.CUSTFLD8,
            sotp: d.CUSTFLD9,
            active: d.HIDDEN === "Y" ? false : true,
            startDate: d.CUSTFLD1,
            endDate: d.CUSTFLD2,
            search: search,
            ctype: d.CTYPE,
            voucher: d.COMPANYNAME,
            // bad form below, remove html 
            address: d.BADDR1 + '<br>' + d.BADDR2 + '<br>'
                + d.BADDR3 + '<br>' + d.BADDR4 + '<br>',
            email: d.EMAIL,
        };

    });
    
    console.log("done loading iif file.");
    trimCustomerData(customerData,activeCustomers);
    Customer.setup();
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



var Customer = {
    configureSearchField: function (selectId) {
        fieldToSearch = $('#' + selectId + ' option:selected').val();
        //Data.saveSelect(selectId,'Customer.restoreSearchField');
        Data.saveSelect(selectId,'Data.restoreSelect');
    },
    restoreSearchField: function (selectId) {
        Data.restoreSelect(selectId);
        fieldToSearch = $('#' + selectId + ' option:selected').val();
    },
    configureSearchList: function (selectId) {
        searchList = $('#' + selectId + ' option:selected').val();
        tmpSearchList = searchLists[searchList].list;
        //Data.saveSelect(selectId,'Customer.restoreSearchList');
        Data.saveSelect(selectId,'Data.restoreSelect');
    },
    restoreSearchList: function (selectId) {
        Data.restoreSelect(selectId);
        searchList = $('#' + selectId + ' option:selected').val();
        tmpSearchList = searchLists[searchList].list;
    },
    configureOutputType: function (selectId) {
        outputType = $('#' + selectId + ' option:selected').val();
        //Data.saveSelect(selectId,'Customer.restoreOutputType');
        Data.saveSelect(selectId,'Data.restoreSelect');
    },
    restoreOutputType: function (selectId) {
        Data.restoreSelect(selectId);
        outputType = $('#' + selectId + ' option:selected').val();
    },
    restore: function (inputId) {
        Data.restoreInput(inputId);
        var searchString = $('#' + inputId).val();
        searchLength = searchString.length;
    },
    write: function (tmpList, outputSelector) {
            tmpSearchList = tmpList;
            $(outputSelector).html('');
            for (var i = 0;i<tmpSearchList.length;i++) {
                customer = tmpSearchList[i];
                // outputType is global variable
                switch (outputType) {
  
                case 'csv':
                    $(outputSelector).append(',,"' + customer.lastName 
                        + ', ' + customer.firstName
                        + '",,' + customer.house + '<br>');
                    break;
                case 'list':
                default:
                    $(outputSelector)
                      .append('<li class="cust" onclick="Customer.show('
                        + customer.id + ')" onfocus="Customer.show('
                        + customer.id + ')" tabIndex="' + (i+10)
                        + '">' + customer.name + '</li>\n');
                    break;
                }
 
            }
        
        
    },
    search: function (inputId, outputSelector) {
        evt = event;
        var searchString = $('#' + inputId).val();
        var searchRegExp = new RegExp(searchString,"i");
 
        if (tmpSearchList.length == 0) {
            tmpSearchList = searchLists[searchList].list;   
        }
        if (evt.key == "Backspace") {
            tmpSearchList = searchLists[searchList].list;
        }
        if (searchString.length <= searchLength) {
            tmpSearchList = searchLists[searchList].list;
        }
        
        searchLength = searchString.length;
        var match = [];
        var tmpTmpSearchList = [];
        for (var i = 0;i<tmpSearchList.length;i++) {
            customer = tmpSearchList[i];
            match = customer[fieldToSearch].match(searchRegExp);
            if (match) {
                tmpTmpSearchList.push(customer);
            }
        }
        if (tmpTmpSearchList.length > 0) {
            
            Customer.write(tmpTmpSearchList,outputSelector);
            
            if (tmpTmpSearchList.length == 1) {
                Customer.show(customer.id);
            }
            
            Data.saveInput(inputId,'Customer.restore');
        } else {
            // restore previous search term
            if (evt.key == "Backspace") return;
            var newSearchString = searchString.substring(0,searchString.length-1)
            $('#' + inputId).val(newSearchString);
            searchLength = newSearchString.length;
        }
    },
    find: function (list, id) { // returns index of participant in list, with given id
        var customer;
        id = parseInt(id);
        for (var i = 0; i<list.length;i++) {
            customer = list[i];
            if (customer.id == id) {
                return i;
            }
        }
        return -1;
    },
    show: function (id) {
        var index = Customer.find(tmpSearchList,id);
        var activeClass = "active";
        if (index == -1) {
            $('#profile').html('');
        } else {
            var customer = tmpSearchList[index];
            if (!customer.active) {
                activeClass = 'notActive';
            }
            var html = '\n<div id="panel">';
            html += '\n<ul>';
            html += '\n<li ><label>Participant</label><span class="';
            html += activeClass + '">' + customer.firstName + ' ' 
            html += customer.lastName + '</span></li>';
            html += '\n<li><label>House</label>' + customer.house + ' House</li>';
            if (customer.voucher.length) {
                html +=  '\n<li><label>Voucher</label>' + customer.voucher + '</li>';
            }
            html += '\n<li><label>DOC</label>' + customer.doc + '</li>';
            html += '\n<li><label>CCO</label>' + customer.cco + '</li>';
            html += '\n<li><label>SOTP</label>' 
            html +=  customer.sotp + '</label>';
            html += '\n<li><label>Active</label>';
            html += (customer.active ? 'Yes' : 'No') + '</li>';;
            html += '\n<li><label>Birthday</label>' + customer.dob + '</li>';
            html += '\n<li><label>Arrived</label>' + customer.startDate + '</li>';
            if (!customer.active) {
                html += '\n<li><label>End Date</label>' + customer.endDate + '</li>';
                html += '\n<li><label>Reason Left</label>' + customer.ctype + '</li>';
            } else {
                html += '\<li><label>Program Role</label>' + customer.ctype + '</li>';
            }
            html += '\n<li><label>Address</label>' + '<pre>' + customer.address + '</pre></li>';
    
            html += '\n</ul></div>'
            
            $('#profile').html(html);
        }
        return index;
    },
    setup: function setup () {
    
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
        
        Data.restoreSelect('fieldToSearch');
        Data.restoreSelect('searchList');
        Data.restoreSelect('outputType');
    
        tmpSearchList = searchLists[searchList].list;
        searchLists['tmp'].list = tmpSearchList;
    
    
    },

  
};
