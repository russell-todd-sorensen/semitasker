

//var newXHR3;
xhrArray = new Array();

var fieldToSearch = 'search';

var searchLength = 0;
var searchList = 'active';
var outputType = 'list';
var searchLists = new Array();
var tmpSearchList;
var index = 0;
var customerData;
var activeCustomers = [];
var otherNamesData;
var activeOtherNames = [];
var customerBalancesData;
var activeCustomerBalances = [];
var salesRepData;
var activeSalesReps = [];
var customerTransactionsData;
var allTransactionsData;
var externalContactsData;

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

function loadIntuitInterchangeFormatFile(filename) {
  var urlBase = "./";
  var url = urlBase + filename + ".IIF";
  var i = xhrArray.length;
  xhrArray[i] = new XMLHttpRequest();
  var newXHR3 = xhrArray[i];
  newXHR3.open("GET", url, true);
  newXHR3.onreadystatechange = getIIF;
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

function getCSV(evt) {
  if (evt.currentTarget.readyState < 4) {
    return;
  }

  parseCustomerCSV(evt.currentTarget.responseText);
}

function getCustomerIIF(evt) {
  if (evt.currentTarget.readyState < 4) {
    return;
  }

  parseCustomerIIF(convertIIF(evt.currentTarget));
}

function getOtherNamesIIF(evt) {
  if (evt.currentTarget.readyState < 4) {
    return;
  }

  parseOtherNamesIIF(convertIIF(evt.currentTarget));
}

function getSalesRepsIIF(evt) {
  if (evt.currentTarget.readyState < 4) {
    return;
  }

  parseSalesRepsIIF(convertIIF(evt.currentTarget));
}

function getCustomerWithBalancesCSV(evt) {
  if (evt.currentTarget.readyState < 4) {
    return;
  }

  parseCustomerWithBalancesCSV(evt.currentTarget.responseText);
}

function getCustomerTransactionsCSV(evt) {
  if (evt.currentTarget.readyState < 4) {
    return;
  }

  parseCustomerTransactionsCSV(evt.currentTarget.responseText);
}

function getAllTransactionsCSV(evt) {
  if (evt.currentTarget.readyState < 4) {
    return;
  }

  parseAllTransactionsCSV(evt.currentTarget.responseText);
}

function getExternalContactsCSV(evt) {
  if (evt.currentTarget.readyState < 4) {
    return;
  }

  parseExternalContactsCSV(evt.currentTarget.responseText);
}

function convertIIF (xhr) {
  var tabRegexp = /[\t]/gi;
  return xhr.responseText.replace(tabRegexp, ',');
}

parseCustomerWithBalancesCSV = function (csv) {

    customerBalancesData = d3.csvParse(csv, function(d,i) {
        var search = d["Customer"]     +' '+
                     d["Customer Type"] +' '+
                     d["Rep"];
        return {
            name: d["Customer"],
            firstName: d["First Name"],
            lastName: d["Last Name"],
            ctype: d["Customer Type"],
            cco: d["Rep"],
            active: d["Active Status"] === "Not-active" ? false : true,
            startDate: d["Start Date"],
            projectedEndDate: d["Projected End"],
            endDate: d["End Date"],
            search: search,
            jobStatus: d["Job Status"],
            jobType: d["Job Type"],
            jobDescr: d["Job Description"],
            balance: d["Balance"],
            company: d["Company"],
            voucher: d["Company"],
            address: d["Bill to 1"] + '<br>' + d["Bill to 2"] + '<br>'
                   + d["Bill to 3"] + '<br>' + d["Bill to 4"] + '<br>',
            leaderEmail: d["Main Email"],
            phone: d["Main Phone"],
            fax: d["Fax"],
        };

    });

    console.log("done loading customerBalances csv file");
    trimData(customerBalancesData,activeCustomerBalances)
};

parseCustomerTransactionsCSV = function (csv) {

    customerTransactionsData = d3.csvParse(csv, function(d,i) {
        var search = d["Name"]     +' '+
                     d["Trans #"]  +' '+
                     d["Num"]      +' '+
                     d["Memo"]     +' '+
                     d["Amount"];
        return {
            name: d["Name"],
            active: d["Active Status"] === "Not-active" ? false : true,
            date: d["Date"],
            modifiedBy: d["Last modified by"],
            memo: d["Memo"],
            account: d["Account"],
            type: d["Type"],
            search: search,
            print: d["Print"],
            paid: d["Paid"],
            payMethod: d["Pay Meth"],
            balance: d["Balance"],
            openBalance: d["Open Balance"],
            credit: d["Credit"],
            debit: d["Debit"],
            amount: d["Amount"],
            aging: d["Aging"],
            transId: d["Trans #"],
            accountType: d["Account Type"],
        };

    });

    console.log("done loading customerTransactions csv file");
    //trimData(customerTransactionsData,activeCustomerBalances);
};


parseAllTransactionsCSV = function (csv) {

    allTransactionsData = d3.csvParse(csv, function(d,i) {
        if (d["Account"] == "") {
            return;
        }

        var accountNumber = "", accountName = "";
        var reg = /([0-9]+) (.) ([a-zA-Z0-9 -]+)/;
        var matchArray = d["Account"].match(reg);

        if (matchArray && matchArray.length == 4) {
            accountNumber = matchArray[1];
            accountName   = matchArray[3];
        }
        var split = d["Split"];
        var splitAccount = "",splitAccountName = "";

        if (split != "-SPLIT-") {
           var splitArray = split.match(reg);
           if (splitArray && splitArray.length == 4) {
               splitAccount = splitArray[1];
               splitAccountName = splitArray[3];
           }
        }

        var search = d["Account"]  +' '+
                     d["Name"]     +' '+
                     d["Trans #"]  +' '+
                     d["Num"]      +' '+
                     d["Memo"]     +' '+
                     d["Amount"];
        return {
            transId: d["Trans #"],
            type: d["Type"],
            enteredDate: d["Entered/Last Modified"],
            modifiedBy: d["Last modified by"],
            date: d["Date"],
            num: d["Num"],
            name: d["Name"],
            sourceName: d["Source Name"],
            nameStreet1: d["Name Street1"],
            nameStreet2: d["Name Street2"],
            nameCity: d["Name City"],
            nameState: d["Name State"],
            nameZip: d["Name Zip"],
            memo: d["Memo"],
            dueDate: d["Due Date"],
            item: d["Item"],
            account: d["Account"],
            accountNumber: accountNumber,
            accountName: accountName,
            rep: d["Rep"],
            clr: d["Clr"],
            splitAccount: d["Split"],
            debit: d["Debit"],
            credit: d["Credit"],
            amount: d["Amount"],
            balance: d["Balance"],
            accountType: d["Account Type"],
            splitAccountNumber: splitAccount,
            splitAccountName: splitAccountName,
            search: search
        };

    });

    console.log("done loading allTransactions csv file");
};


parseExternalContactsCSV = function (csv) {

    externalContactsData = d3.csvParse(csv, function(d,i) {
        if (d["LastName"] == "") {
            return;
        }

        return {
            contactId: d["ExtUnique"],
            type: d["ExtContType"],
            lastName: d["LastName"],
            firstName: d["FirstName"],
            email: d["ExtContEmail"],
            phone: d["ExtContPhone"],
            office: d["Office"],
            cell: d["ExtContCel"],
            fullName: d["FullName"],
            location: d["Location"],
        };
    });

    console.log("done loading external-contacts csv file");
};

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
            notes: d.NOTEPAD,
        };

    });
    console.log("done loading csv file " + i);
    trimData(customerData,activeCustomers)
};

parseCustomerIIF = function (iif) {

    console.log('parseCustomerIIF starting');
    var start = iif.search('!CUST,NAME');
    iif = iif.substring(start, iif.length-1);
    console.log('start = ' + start);
    console.log('length = ' + iif.length);
    console.log('substring start =' + iif.substring(0,15));

    customerData = d3.csvParse(iif, function(d,i) {
        var search = d.NAME     +' '+
                     d.CUSTFLD5 +' '+
                     d.CUSTFLD6 +' '+
                     d.CUSTFLD9 ;
        var repRegexp = /([a-zA-Z0-9\s]+)(:)([0-9]+)(:)([a-zA-Z0-9\s]+)/;
        var repData = d.REP;
        var rep = '';
        var repInitials = '';
        var repArray = repData.match(repRegexp);
        if (repArray) {
            rep = repArray[1];
            repInitials = repArray[5];
        }

        var custInfo  = {
            jobdesc: d.JOBDESC,
            jobtype: d.JOBTYPE,
            jobstatus: d.JOBSTATUS,
            jobstart: d.JOBSTART,
            jobprojend: d.JOBPROGEND,
            jobend: d.JOBEND,
        }

        var programStatus = custInfo.jobdesc.toLowerCase().trim();
        var programRole = false;
        var progStartDate = false;
        var custBirthday = false;

        if (programStatus == 'program status') {
            var progStatusReg = new RegExp(/(program status):([a-z0-9\'-])+/,'i');
            var progStatusArray = custInfo.jobtype.match(progStatusReg);
            if (progStatusArray) {
                programRole = progStatusArray[2];
                if (programRole.trim() != '') {
                    d.CUSTROLE = programRole;
                }
             }
        }


        var dateRegexp = new RegExp(/([0-2]?[0-9])[\/]([0-1]?[0-9])[\/]((19|20)?[0-9]{2})/);

        var custStartDate;
        if (custInfo.jobstart) {
            var custStartDateArray = custInfo.jobstart.match(dateRegexp);
            if (custStartDateArray) {
                custStartDate = custStartDateArray[0];
            }
        }

        var custBirthday;
        if (custInfo.jobprogend) {
            var custBirthdayArray = custInfo.jobprogend.match(dateRegexp);
            if (custBirthdayArray) {
                custBirthday = custBirthdayArray[0];
            }
        }

        var custEndDate;
        if (custInfo.jobend) {
            var custEndDateArray = custInfo.jobend.match(dateRegexp);
            if (custEndDateArray) {
                custEndDate = custEndDateArray[0];
            }
        }

        return {
            name: d.NAME,
            firstName: d.FIRSTNAME,
            lastName: d.LASTNAME,
            middleInitial: d.MIDINIT,
            id: d.REFNUM,
            dob: d.CUSTFLD7,
            house: d.CUSTFLD5,
            doc: d.CUSTFLD6,
            cco: d.CUSTFLD8,
            rep: rep,
            repInitials: repInitials,
            sotp: d.CUSTFLD9,
            active: d.HIDDEN === "Y" ? false : true,
            startDate: d.CUSTFLD1,
            endDate: d.CUSTFLD2,
            search: search,
            ctype: d.CTYPE,
            custRole: d.CUSTROLE,
            voucher: d.COMPANYNAME,
            // bad form below, remove html
            address: d.BADDR1 + '<br>' + d.BADDR2 + '<br>'
                   + d.BADDR3 + '<br>' + d.BADDR4 + '<br>',
            address2: d.BADDR1 + ' ' + d.BADDR2 + ' '
                   + d.BADDR3 + ' ' + d.BADDR4,
            email: d.EMAIL,
            baddr1: d.BADDR1,
            baddr2: d.BADDR2,
            baddr3: d.BADDR3,
            baddr4: d.BADDR4,
            phone1: d.PHONE1,
            phone2: d.PHONE2,
            fax: d.FAXNUM,
            notes: d.NOTEPAD + d.NOTE,
            saddr1: d.SADDR1,
            saddr2: d.SADDR2,
            saddr3: d.SADDR3,
            saddr4: d.SADDR4,
            saddr5: d.SADDR5,
            cont1: d.CONT1,
            cont2: d.CONT2,
            terms: d.TERMS,
            taxable: d.TAXABLE,
            salestaxcode: d.SALESTAXCODE,
            limit: d.LIMIT,
            resalenum: d.resalenum,
            taxitem: d.TAXITEM,
            salutation: d.SALUTATION,
            custfld3: d.CUSTFLD3,
            custfld4: d.CUSTFLD4,
            custfld10: d.CUSTFLD10,
            custfld11: d.CUSTFLD11,
            custfld12: d.CUSTFLD12,
            custfld13: d.CUSTFLD13,
            custfld14: d.CUSTFLD14,
            custfld15: d.CUSTFLD15,
            jobdesc: d.JOBDESC,
            jobtype: d.JOBTYPE,
            jobstatus: d.JOBSTATUS,
            jobstart: d.JOBSTART,
            jobprojend: d.JOBPROGEND,
            jobend: d.JOBEND,
            delcount: d.DELCOUNT,
            pricelevel: d.PRICELEVEL,

        };

    });

    console.log("done loading customer iif file.");
    trimData(customerData,activeCustomers);
    Customer.setup();
};

parseSalesRepsIIF = function (iif) {

    console.log('parseSalesRepsIIF starting');
    var start = iif.search('!SALESREP,INITIALS');
    iif = iif.substring(start, iif.length-1);
    console.log('start = ' + start);
    console.log('length = ' + iif.length);
    console.log('substring start =' + iif.substring(0,15));

    salesRepData = d3.csvParse(iif, function(d,i) {
        var search = d.ASSOCIATEDNAME +' '+
                     d.INITIALS;
        return {
            name: d.ASSOCIATEDNAME,
            initials: d.INITIALS,
            id: d.REFNUM,
            nameType: d.NAMETYPE,
            timestamp: d.TIMESTAMP,
            search: search,
            active: d.HIDDEN === "Y" ? false : true,
        };

    });

    console.log("done loading customer iif file.");
    trimData(salesRepData,activeSalesReps);
    Customer.setup();
};

parseOtherNamesIIF = function (iif) {

    console.log('parseOtherNamesIIF starting');
    var start = iif.search('!OTHERNAME,NAME');
    iif = iif.substring(start, iif.length-1);
    console.log('start = ' + start);
    console.log('length = ' + iif.length);
    console.log('substring start =' + iif.substring(0,10));

    otherNamesData = d3.csvParse(iif, function(d,i) {
        var search = d.NAME +' '+
                     d.COMPANYNAME +' '+
                     d.EMAIL;
        return {
            name: d.NAME,
            timestamp: d.TIMESTAMP,
            companyName: d.COMPANYNAME,
            salutation: d.SALUTATION,
            firstName: d.FIRSTNAME,
            lastName: d.LASTNAME,
            id: d.REFNUM,
            active: d.HIDDEN === "Y" ? false : true,
            search: search,
            address: d.BADDR1 + '<br>' + d.BADDR2 + '<br>'
                   + d.BADDR3 + '<br>' + d.BADDR4 + '<br>',
            email: d.EMAIL,
            phone1: d.PHONE1,
            phone2: d.PHONE2,
            fax: d.FAXNUM,
            notes: d.NOTE    +'<br>'+
                   d.NOTEPAD +'<br>'+
                   d.CONT1   +'<br>'+
                   d.CONT2,
        };

    });

    console.log("done loading other names iif file.");
    trimData(otherNamesData,activeOtherNames);
    //Customer.merge();
};


function trimData(inputArray,outputArray) {

    var item = {};

    for (var i = 0;i<inputArray.length;i++) {

        item = inputArray[i];

        if (item.active) {
            outputArray.push(item);
        }
    }
}

var CustomerBalances = {
      find: function (list, name) { // returns index of participant in list, with given id
        var customer;
        for (var i = 0; i<list.length;i++) {
            customer = list[i];
            if (customer.name == name) {
                return i;
            }
        }
        return -1;
    },
};


var Customer = {
    configureSearchField: function (selectId) {
        fieldToSearch = $('#' + selectId + ' option:selected').val();
        Data.saveSelect(selectId,'Customer.restoreSearchField');
    },
    restoreSearchField: function (selectId) {
        fieldToSearch = $('#' + selectId + ' option:selected').val();
    },
    configureSearchList: function (selectId) {
        Customer.restoreSearchList(selectId);
        Data.saveCheckbox(selectId,'Customer.restoreSearchList');
    },
    restoreSearchList: function (selectId) {
        searchList = $('#' + selectId + ':checked').val();
        tmpSearchList = searchLists[searchList].list;
    },
    configureOutputType: function (selectId) {
        Customer.restoreOutputType(selectId);
        Data.saveSelect(selectId,'Customer.restoreOutputType');
    },
    restoreOutputType: function (selectId) {
        outputType = $('#' + selectId + ' option:selected').val();
    },
    restoreSearchString: function (inputId) {
        Data.restoreInput(inputId);
        var searchString = $('#' + inputId).val();
        searchLength = searchString.length;
    },
    write: function (tmpList,outputSelector,type) {
            var customer;
            tmpSearchList = tmpList;
            $(outputSelector).html('');

            // outputType is global variable
            if (!type) {
                type = outputType;
            }

            if (type == 'json') {
                var re = new RegExp(/<br>/,'g');
                var re2 = new RegExp(/\'/,'g');
                var json = JSON.stringify(tmpSearchList);
                json =  json.replace(re, '*****');
                json =  "'" + json.replace(re2,"+++++") + "'";
                $(outputSelector).html(json);
                return;
            }

            for (var i = 0;i<tmpSearchList.length;i++) {
                customer = tmpSearchList[i];

                switch (type) {

                case 'csv':
                    if (i==0) {
                        // put csv header
                        $(outputSelector)
                            .append("Date,Comment,Participant,Violation,House<br>");
                    }

                    $(outputSelector)
                      .append(',,"' + customer.lastName
                        + ', ' + customer.firstName
                        + '",,' + customer.house + '<br>');
                    break;
                case 'csv-all':
                    $(outputSelector)
                      .append(  customer.id        +  ',' +
                          '"' + customer.doc       + '",' +
                          '"' + customer.name      + '",' +
                          '"' + customer.startDate + '",' +
                          '"' + customer.address2  + '",' +
                                customer.house     +  ',' +
                                customer.active    +  ',' +
                          '"' + customer.ctype     + '",' +
                          '"' + customer.firstName + '",' +
                          '"' + customer.lastName  + '",' +
                          '"' + customer.email     + '",' +
                          '"' + customer.phone1    + '"'  +
                          '<br>');
                      break;
                case 'csv-mike':
                    if (i==0) {
                        // put csv header
                        $(outputSelector)
                            .append("ParticipantId,HouseID,FirstName,LastName,Phone,Email,IsActive,ProgramEndDate,ProgramStartDate,DOCNumber,BirthDate<br>");
                    }

                    $(outputSelector)
                      .append(  customer.id        +  ',' +
                                customer.house     +  ',' +
                          '"' + customer.firstName + '",' +
                          '"' + customer.lastName  + '",' +
                          '"' + customer.phone1    + '",'  +
                          '"' + customer.email     + '",' +
                                customer.active    +  ',' +
                          '"' + customer.endDate   + '",' +
                          '"' + customer.startDate + '",' +
                          '"' + customer.doc       + '",' +
                          '"' + customer.dob       + '"'  +
                          '<br>');
                      break;
                  case 'csv-website':
                      if (i==0) {
                          // put header file
                          $(outputSelector)
                              .append('id,type,firstName,lastName,doc,arrived,house,address1,address2,address3,active<br>');
                      }


                        $(outputSelector)
                        .append(  customer.id        +  ','  +
                            '"' + customer.ctype     + '",'  +
                            '"' + customer.firstName + '",'  +
                            '"' + customer.lastName  + '",'  +
                            '"' + customer.doc       + '",'  +
                            '"' + customer.startDate + '",'  +
                                  customer.house     +  ','  +
                            '"' + customer.baddr2    + '",'  +
                            '"' + customer.baddr3    + '",'  +
                            '"' + customer.baddr4    + '",'  +
                                  customer.active    + '<br>'
                      );
                      break;
                  case 'csv-pastor-james':
                      if (i==0) {
                          // put header file
                          $(outputSelector)
                              .append('<pre id="csvpre">house,lastName,firstName,doc,address,startDate\n</pre>');
                          outputSelector = $('#csvpre');
                      }
                      $(outputSelector)
                        .append(
                                  customer.house     +  ','  +
                            '"' + customer.lastName  + '",'  +
                            '"' + customer.firstName + '",'  +
                            '"' + customer.doc       + '",'  +
                            '"' + customer.baddr3    + ' '   +
                                  customer.baddr4    + '",'  +
                                  customer.startDate    + '\n'
                      );
                      break;
                  case 'list':
                  default:
                    $(outputSelector)
                      .append('<li class="cust icon-people" onclick="Customer.show('
                        + customer.id + ')" onfocus="Customer.show('
                        + customer.id + ')" tabIndex="' + (i+10)
                        + '">' + customer.name + '</li>\n');
                    break;
                } // end switch
            } // end for

            if (type == 'csv-pastor-james') {
                var subWindow = window.open(
                    "",
                    "csv-pastor-james",
                    "height=500,width=700,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,chrome=true,titlebar=true", // options
                    "true" // replace
                    );
                subWindow.document.write(document.getElementById('csvpre').innerText);
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
    findByName: function (list, name) {
        var customer;
        for (var i = 0; i<list.length;i++) {
            customer = list[i];
            if (customer.name == name) {
                return i;
            }
        }
        return -1;

    },
    showAccount: function (name,outputSelector,justLastTransaction) {
        console.log("showAccount for " + name);
        var elem = $(outputSelector);
        var success = false;
        var foundLast = false;
        var transaction;

        elem.html('');
        var html = '<table id="accountTable">';
        html += '\n<!--<legend>Account Details for: ' + name + '</legend>-->';
        html += '\n <tr><th>Id</th><th>Date</th><th>Type</th><th>Credit</th><th>Debit</th><th>Balance</th>';
        var detail = "";

        for (var i = 0; i<customerTransactionsData.length;i++) {
            if (customerTransactionsData[i].name == name) {
                success = true;
                transaction = customerTransactionsData[i];
            } else {
                if (success) {
                    foundLast = true;
                    break;
                } else {
                    continue;
                }
            }
            var tb = parseFloat(transaction.balance).toFixed(2);
            var cssClass = "";
            if (tb > 0) {
                cssClass="negative"
            } else {
                cssClass="positive"
            }

            //console.log('transId=' + transaction.transId);

            detail = '\n <tr>\n  <td>' + transaction.transId + '</td>';
            detail += '\n  <td>' + transaction.date + '</td>';
            detail += '\n  <td>' + transaction.type + '</td>';
            detail += '\n  <td>' + transaction.credit + '</td>';
            detail += '\n  <td>' + transaction.debit + '</td>';
            detail += '\n  <td><span class="' + cssClass + '">'  + transaction.balance + '</span></td>';
            //html += '\n  <td>' + transaction.date + '</td>';
            detail += '\n </tr>';
            if (!justLastTransaction) {
                html += detail;
            }
        }

        if (justLastTransaction && justLastTransaction == true) {
             html += detail;
        }

        html += '</table>';
        elem.append(html);
    },
    show: function (id) {
        var index = Customer.find(tmpSearchList,id);

        var activeClass = "active";
        if (index == -1) {
            $('#profile').html('');
        } else {
            var customer = tmpSearchList[index];
            var cco = {
                ondoc: false,
                name: null,
                phone: null,
                cell: null,
                email: null,
            };
            var sotp = {
                insotp: false,
                name: null,
                phone: null,
                cell: null,
                email: null,
            };
            var extType,firstName,lastName,fullName,externalContact;
            var foundExternalContact = false;
            if (customer.cco != '' && customer.cco != 'N') {
                var ccoRegexp = new RegExp( /(CCO|USPO|)([\s]*)([a-z0-9\']+)([\s]+)([a-z\']+)/,'i');
                var ccoArray = customer.cco.match(ccoRegexp);
                if (ccoArray) {
                    extType = ccoArray[1];
                    firstName = ccoArray[3];
                    lastName = ccoArray[5];
                    fullName = firstName + ' ' + lastName;
                }
                for (var i = 0;i<externalContactsData.length;i++) {
                    if (externalContactsData[i].fullName == fullName) {
                        externalContact = externalContactsData[i];
                        foundExternalContact = true;
                        break;
                    }
                }
                if (foundExternalContact == true) {
                    cco.ondoc = true;
                    cco.name = fullName;
                    if (externalContact.phone.trim() == '') {
                        cco.phone = 'Not on file';
                    } else {
                        cco.phone = externalContact.phone;
                    }
                    if (externalContact.cell.trim() == '') {
                        cco.cell = 'Not on file';
                    } else {
                        cco.cell = externalContact.cell;
                    }
                    if (externalContact.email.trim() == '') {
                        cco.email = 'Not on file';
                    } else {
                        cco.email = externalContact.email;
                    }
                } else {
                    cco.ondoc = true;
                    cco.name = customer.cco;
                    cco.phone = 'Not on file';
                    cco.cell  = 'Not on file';
                    cco.email = 'Not on file';
                }
            }

            if (customer.sotp != '' && customer.sotp != 'N') {

                fullName = customer.sotp;

                for (var i = 0;i<externalContactsData.length;i++) {
                    if (externalContactsData[i].fullName == fullName) {
                        externalContact = externalContactsData[i];
                        foundExternalContact = true;
                        break;
                    }
                }

                if (fullName.trim() == 'Y') {
                    foundExternalContact = false;
                }

                if (foundExternalContact == true) {
                    sotp.insotp = true;
                    sotp.name = fullName;
                    if (externalContact.phone.trim() == '') {
                        sotp.phone = 'Not on file';
                    } else {
                        sotp.phone = externalContact.phone;
                    }
                    if (externalContact.cell.trim() == '') {
                        sotp.cell = 'Not on file';
                    } else {
                        sotp.cell = externalContact.cell;
                    }
                    if (externalContact.email.trim() == '') {
                        sotp.email = 'Not on file';
                    } else {
                        sotp.email = externalContact.email;
                    }
                 } else {
                    sotp.insotp = true;
                    sotp.name = customer.sotp;
                    sotp.phone = 'Not on file';
                    sotp.cell = 'Not on file';
                    sotp.email = 'Not on file';
                 }
            }
            if (customer.saddr1 != '') {
                customer.econtact = true;
            } else {
                customer.econtact = false;
            }
            if (!customer.active) {
                activeClass = 'notActive';
            }
            var customerBalanceId = Customer.findByName(
                customerBalancesData,customer.name);
            var customerBalance = parseFloat(
                customerBalancesData[customerBalanceId].balance).toFixed(2);
            var owesMessage = "";
            if (customerBalance > 0) {
                owesMessage = "Owes ";
            }
            var accountBalanceHtml = "<button id='accountBalanceButton' ";
            accountBalanceHtml += "onClick='Customer.showAccount(\""
                                + customer.name + "\",\"#lastTransaction\",true);'>"
                                + owesMessage + customerBalance
                                + "</button>";
            var customerInitial = customer.lastName.substring(0,1).toLowerCase();
            var customerFilename = customer.lastName.toLowerCase();
                customerFilename += '-';
                customerFilename += customer.firstName.toLowerCase();
            var customerImage = customerInitial;
                customerImage += '/';
                customerImage += customerFilename;
                customerImage += '/'
                customerImage += customerFilename;
                customerImage += '.jpg';

            var html = '\n<div id="panel">';
            html += '\n<fieldset id="participant-info">';
            html += '\n<img id="photo" onerror="this.style.display=\'none\'" src="/test/';
            html += customerImage;
            html += '">';
            html += '\n<legend>Participant Information</legend>';
            html += '\n<ul>';
            html += '\n<li ><label>Name</label><span class="';
            html += activeClass + '">' + customer.firstName + ' '
            html += customer.lastName + '</span></li>';
            html += '\n<li><label>DOC</label>' + customer.doc + '</li>';

            html += '\n<li><label>Arrived</label>' + customer.startDate + '</li>';
            if (!customer.active) {
                html += '\n<li><label>Left On</label>' + customer.endDate + '</li>';
                html += '\n<li><label>Reason</label>' + customer.ctype + '</li>';
            } else {
                html += '\n<li><label>Status</label>Still Active</li>';
                html += '\n<li><label>Role</label>' + customer.ctype + '</li>';
            }
            html += '\n<li><label>Phone</label>' + customer.phone1 + '</li>';

            html += '\n<li><label>Address</label>' + '<pre>' + customer.address + '</pre></li>';
            html += '\n<li><label>Email</label>' + customer.email + '</li>';
            html += '\n</ul>';
            html += '\n<button id="toggle-extra-info" class="hidden"' ;
            html += ' onClick="toggleExtraInfo(\'extra-info\',this);">Show More</button>';
            html += '\n<ul id="extra-info" style="display:none">';
            html += '\n<li><label>Birthday</label>' + customer.dob + '</li>';

            if (customer.voucher.length) {
                html +=  '\n<li><label>Voucher</label>' + customer.voucher + '</li>';
            }
            html += '\n<li><label>House</label>' + customer.house + ' House</li>';
            html += '\n<li><label>Balance</label>' + accountBalanceHtml + '</li>';
            html += '\n<li><label>Last Trans</label>' + '<span id="lastTransaction"></span></li>';
            html += '\n</ul>';
            html += '\n</fieldset>';

            //////////////// SOTP INFORMATION /////////////////////////
            if (sotp.insotp) {
                html += '\n<fieldset id="sotp-info">';
                html += '\n<legend>SOTP</legend>';
                html += '\n<ul>';
                html += '\n<li><label>Therapist</label>';
                html +=  sotp.name + '</li>';
                html += '\n<li><label>Phone</label>' + sotp.phone + '</li>';
                html += '\n<li><label>Cell</label>' + sotp.cell + '</li>';
                html += '\n<li><label>Email</label>' + sotp.email + '</li>';
                html += '\n</ul>';
                html += '\n</fieldset>';
            }

            ///////////////////// DOC INFORMATION //////////////////////
            if (cco.ondoc) {
                html += '\n<fieldset id="cco-info">';
                html += '\n<legend>Corrections Officer</legend>';
                html += '\n<ul>';

                html += '\n<li><label>CCO</label>' + cco.name + '</li>';
                html += '\n<li><label>Phone</label>' + cco.phone + '</li>';
                html += '\n<li><label>Cell</label>' + cco.cell + '</li>';
                html += '\n<li><label>Email</label>' + cco.email + '</li>';
                html += '\n</ul>';
                html += '\n</fieldset>';
            }

            ////////////////// EMERGENCY CONTACT INFORMATION ///////////
            if (customer.econtact) {
                html += '\n<fieldset id="emergency-contact-info">';
                html += '\n<legend>Emergency Contact</legend>';
                html += '\n<ul>';
                html += '\n<li><label>Name</label>' + customer.saddr1 + '</li>';
                html += '\n<li><label>Address</label>' + customer.saddr2 + '</li>';
                html += '\n<li><label>C,S,Z</label>' + customer.saddr3 + '</li>';
                html += '\n<li><label>Phone</label>' + customer.saddr4 + '</li>';
                html += '\n<li><label>Email</label>' + customer.saddr5 + '</li>';
                html += '\n</ul>';
                html += '\n</fieldset>';
            }

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
        Data.restoreCheckbox('searchList');
        Data.restoreSelect('outputType');

        tmpSearchList = searchLists[searchList].list;
        searchLists['tmp'].list = tmpSearchList;
    },
    merge: function () {



    },


};

var Cust = {
    configureSearchField:  function (selectId) {
        fieldToSearch = $('#' + selectId + ' option:selected').val();
        Data.saveSelect(selectId,'Data.restoreSelect');
    },
    configureSearchList: function (checkboxId) {
        searchList = $('#' + checkboxId + ':checked').val();
        tmpSearchList = searchLists[searchList].list;
        Data.saveCheckbox(checkboxId,'Log.Notice');
    },
    configureOutputType: function (selectId) {
        outputType = $('#' + selectId + ' option:selected').val();
        Data.saveSelect(selectId,'Data.restoreSelect');
    },
    restore: function (inputId) {
        Data.restoreInput(inputId);
        var searchString = $('#' + inputId).val();
        searchLength = searchString.length;
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
        Data.restoreCheckbox('searchList');
        Data.restoreSelect('outputType');

        tmpSearchList = searchLists[searchList].list;
        searchLists['tmp'].list = tmpSearchList;
    },
}
// Participant Object

var Participant = function () {

    this.write = function (tmpList, outputSelector) {
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
    };
    this.search = function (inputId, outputSelector) {
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
    };
    this.find = function (list, id) { // returns index of participant in list, with given id
        var customer;
        id = parseInt(id);
        for (var i = 0; i<list.length;i++) {
            customer = list[i];
            if (customer.id == id) {
                return i;
            }
        }
        return -1;
    };
    this.show = function (id) {
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
            html += '\n<li ><label>Name</label><span class="';
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
    };

    this.merge = function () {



    };

    return this;

};



Cust.configureSearchList = function (checkboxId) {
        searchList = $('#' + checkboxId + ' option:selected').val();
        tmpSearchList = searchLists[searchList].list;
        Data.saveCheckbox(checkboxId,'Data.restoreCheckbox');
};
