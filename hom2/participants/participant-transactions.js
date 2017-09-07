

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
var indexCounter = 0;

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
  Customer.setup();
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
        var index = indexCounter++;
        var search = d["Account"]  +' '+
                     d["Name"]     +' '+
                     d["Trans #"]  +' '+
                     d["Num"]      +' '+
                     d["Memo"]     +' '+
                     d["Amount"];
        return {
            index: index,
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
        return {
            name: d.NAME,
            firstName: d.FIRSTNAME,
            lastName: d.LASTNAME,
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
            fax: d.FAX,
            notes: d.NOTEPAD,
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
        Data.saveSelect(selectId,'Customer.restoreSearchList');
    },
    restoreSearchList: function (selectId) {
        searchList = $('#' + selectId + ' option:selected').val();
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
            var account;
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
                account = tmpSearchList[i];
 
                switch (type) {
  
                case 'csv':
                    if (i==0) {
                        // put csv header
                        $(outputSelector)
                            .append("Date,Comment,Participant,Violation,House<br>");
                    }

                    $(outputSelector)
                      .append(',,"' + account.lastName 
                        + ', ' + account.firstName
                        + '",,' + account.house + '<br>');
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
                  case 'transactionList':
                  default:
                    index = customer.index;
                    $(outputSelector)
                      .append('<li class="cust icon-people" onclick="Customer.showTransaction('
                        + index + ')" onfocus="Customer.showTransaction('
                        + index + ')" tabIndex="' + (i+10)
                        + '">' + customer.name + ' (' + index + ') </li>\n');
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
                Customer.showTransaction(customer.index);
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
    find: function (list, ind) { // returns index of participant in list, with given id
        var customer;
        ind = parseInt(ind);
        for (var i = 0; i<list.length;i++) {
            customer = list[i];
            if (customer.index == ind) {
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
                
            console.log('transId=' + transaction.transId);
            
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
    showTransaction: function (ind) {
        console.log('id=' + ind);
        var index = Customer.find(tmpSearchList,ind);
        console.log('index=' + index);
        var activeClass = "active";
        if (index == -1) {
            $('#profile').html('');
        } else {
            var customer = tmpSearchList[index];
            if (!customer.active) {
                activeClass = 'notActive';
            }

            var accountBalanceHtml = "<button id='accountBalanceButton' ";
            accountBalanceHtml += "onClick='Customer.showTransaction(\"" 
                                + customer.transId + "\",\"#lastTransaction\",true);'>"
 
                                + "</button>";
            
            var html = '\n<div id="panel">';
            html += '\n<ul>';
            html += '\n<li><label>Transaction Id</label>' + customer.transId + '</li>';
            html += '\n<li ><label>Account</label>' + customer.accountNumber 
            html += ' ' + customer.accountName + '</li>';
            html += '\n<li><label>Type</label>' + customer.accountType + '</li>';
            html += '\n<li><label>Amount</label>' + customer.amount + '</li>';
            html += '\n<li><label>Balance</label>' + customer.balance + '</li>';
            html += '\n<li><label>Last Transaction</label>' + '<span id="lastTransaction"></span></li>'
            html += '\n<li><label>Date</label>' + customer.date + '</li>';
            html += '\n<li><label>Date Entered</label>' + customer.enteredDate + '</li>';
            html += '\n<li><label>Date Due</label>' + customer.dueDate + '</li>';
            html += '\n<li><label>Memo</label>' + customer.memo + '</label>';
            html += '\n<li><label>Name</label>' + customer.name + '<br>';
            html += customer.nameStreet1 + '<br>' + customer.nameStreet2 + '<br>';
            html += customer.nameCity + ' ' + customer.nameState + ' ' + customer.nameZip + '</li>';
            html += '\n</ul></div>'
            
            $('#profile').html(html);
        }
        return index
        
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
            
            var html = '\n<div id="panel">';
            html += '\n<ul>';
            html += '\n<li ><label>Participant</label><span class="';
            html += activeClass + '">' + customer.firstName + ' ' 
            html += customer.lastName + '</span></li>';
            html += '\n<li><label>House</label>' + customer.house + ' House</li>';
            if (customer.voucher.length) {
                html +=  '\n<li><label>Voucher</label>' + customer.voucher + '</li>';
            }
            html += '\n<li><label>Balance</label>' + accountBalanceHtml + '</li>';
            html += '\n<li><label>Last Transaction</label>' + '<span id="lastTransaction"></span></li>'
            html += '\n<li><label>DOC</label>' + customer.doc + '</li>';
            html += '\n<li><label>CCO</label>' + customer.cco + '</li>';
            html += '\n<li><label>SOTP</label>' 
            html +=  customer.sotp + '</label>';
            html += '\n<li><label>Active</label>';
            html += (customer.active ? 'Yes' : 'No') + '</li>';
            html += '\n<li><label>Birthday</label>' + customer.dob + '</li>';
            html += '\n<li><label>Arrived</label>' + customer.startDate + '</li>';
            if (!customer.active) {
                html += '\n<li><label>End Date</label>' + customer.endDate + '</li>';
                html += '\n<li><label>Reason Left</label>' + customer.ctype + '</li>';
            } else {
                html += '\n<li><label>Program Role</label>' + customer.ctype + '</li>';
            }
            if (customer.notes.length > 0) {
                html += '\n<li><label>Notes</label><div class="notes">' + customer.notes + '</div></li>';
            }
            html += '\n<li><label>Address</label>' + '<pre>' + customer.address + '</pre></li>';
            html += "\n<li><label>Full Account</label> <button id='accountBalanceButton' "
            html += "onClick='Customer.showAccount(\"" 
                                + customer.name + "\",\"#accountLedger\");'>Full Ledger</button>";
            html += "\n<div id=\"accountLedger\"></div></li>";
            html += '\n</ul></div>'
            
            $('#profile').html(html);
        }
        return index;
    },
    setup: function setup () {
    
        searchLists['customerTrans'] = {
            list: customerTransactionsData,
            name: 'active',
            fields: {}
        }
        searchLists['all'] = {
            list: allTransactionsData,
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
    merge: function () {
        
        
        
    },

  
};

