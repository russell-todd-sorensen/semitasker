// chemical-pi-search.js

var fieldToSearch = 'search';

var searchLength = 0;
var searchList = 'all';
var outputType = 'list';
var searchLists = new Array();
var tmpSearchList;
var index = 0;
var chemicalPiData;

var ChemicalPi = {
    configureSearchField: function (selectId) {
        fieldToSearch = $('#' + selectId + ' option:selected').val();
        Data.saveSelect(selectId,'ChemicalPi.restoreSearchField');
    },
    restoreSearchField: function (selectId) {
        fieldToSearch = $('#' + selectId + ' option:selected').val();
    },
    configureSearchList: function (selectId) {
        ChemicalPi.restoreSearchList(selectId);
        Data.saveCheckbox(selectId,'ChemicalPi.restoreSearchList');
    },
    restoreSearchList: function (selectId) {
        searchList = $('#' + selectId + ':checked').val();
        tmpSearchList = searchLists[searchList].list;
    },
    configureOutputType: function (selectId) {
        ChemicalPi.restoreOutputType(selectId);
        Data.saveSelect(selectId,'ChemicalPi.restoreOutputType');
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
            var chemicalPi;
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
                chemicalPi = tmpSearchList[i];

                switch (type) {

                case 'csv':
                    if (i==0) {
                        // put csv header
                        $(outputSelector)
                            .append("Date,Comment,Participant,Violation,House<br>");
                    }

                    $(outputSelector)
                      .append(',,"' + chemicalPi.lastName
                        + ', ' + chemicalPi.firstName
                        + '",,' + chemicalPi.house + '<br>');
                    break;
                case 'csv-all':
                    $(outputSelector)
                      .append(  chemicalPi.id        +  ',' +
                          '"' + chemicalPi.doc       + '",' +
                          '"' + chemicalPi.name      + '",' +
                          '"' + chemicalPi.startDate + '",' +
                          '"' + chemicalPi.address2  + '",' +
                                chemicalPi.house     +  ',' +
                                chemicalPi.active    +  ',' +
                          '"' + chemicalPi.ctype     + '",' +
                          '"' + chemicalPi.firstName + '",' +
                          '"' + chemicalPi.lastName  + '",' +
                          '"' + chemicalPi.email     + '",' +
                          '"' + chemicalPi.phone1    + '"'  +
                          '<br>');
                      break;
                case 'csv-mike':
                    if (i==0) {
                        // put csv header
                        $(outputSelector)
                            .append("ParticipantId,HouseID,FirstName,LastName,Phone,Email,IsActive,ProgramEndDate,ProgramStartDate,DOCNumber,BirthDate<br>");
                    }

                    $(outputSelector)
                      .append(  chemicalPi.id        +  ',' +
                                chemicalPi.house     +  ',' +
                          '"' + chemicalPi.firstName + '",' +
                          '"' + chemicalPi.lastName  + '",' +
                          '"' + chemicalPi.phone1    + '",'  +
                          '"' + chemicalPi.email     + '",' +
                                chemicalPi.active    +  ',' +
                          '"' + chemicalPi.endDate   + '",' +
                          '"' + chemicalPi.startDate + '",' +
                          '"' + chemicalPi.doc       + '",' +
                          '"' + chemicalPi.dob       + '"'  +
                          '<br>');
                      break;
                  case 'csv-website':
                      if (i==0) {
                          // put header file
                          $(outputSelector)
                              .append('id,type,firstName,lastName,doc,arrived,house,address1,address2,address3,active<br>');
                      }


                        $(outputSelector)
                        .append(  chemicalPi.id        +  ','  +
                            '"' + chemicalPi.ctype     + '",'  +
                            '"' + chemicalPi.firstName + '",'  +
                            '"' + chemicalPi.lastName  + '",'  +
                            '"' + chemicalPi.doc       + '",'  +
                            '"' + chemicalPi.startDate + '",'  +
                                  chemicalPi.house     +  ','  +
                            '"' + chemicalPi.baddr2    + '",'  +
                            '"' + chemicalPi.baddr3    + '",'  +
                            '"' + chemicalPi.baddr4    + '",'  +
                                  chemicalPi.active    + '<br>'
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
                                  chemicalPi.house     +  ','  +
                            '"' + chemicalPi.lastName  + '",'  +
                            '"' + chemicalPi.firstName + '",'  +
                            '"' + chemicalPi.doc       + '",'  +
                            '"' + chemicalPi.baddr3    + ' '   +
                                  chemicalPi.baddr4    + '",'  +
                                  chemicalPi.startDate    + '\n'
                      );
                      break;
                  case 'list':
                  default:
                    $(outputSelector)
                      .append('<li class="cust icon-people" onfocus="ChemicalPi.show('
                        + chemicalPi.id + ')" tabIndex="' + (i+10)
                        + '">' + chemicalPi.element + '</li>\n');
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
        var myString = '';
        for (var i = 0;i<tmpSearchList.length;i++) {
            chemicalPi = tmpSearchList[i];
            myString = '' + chemicalPi[fieldToSearch];
            match = myString.match(searchRegExp);
            if (match) {
                tmpTmpSearchList.push(chemicalPi);
            }
        }
        if (tmpTmpSearchList.length > 0) {

            ChemicalPi.write(tmpTmpSearchList,outputSelector);

            if (tmpTmpSearchList.length == 1) {
                ChemicalPi.show(chemicalPi.id);
            }

            Data.saveInput(inputId,'ChemicalPi.restore');
        } else {
            // restore previous search term
            if (evt.key == "Backspace") return;
            var newSearchString = searchString.substring(0,searchString.length-1)
            $('#' + inputId).val(newSearchString);
            searchLength = newSearchString.length;
        }
    },
    find: function (list, id) { // returns index of participant in list, with given id
        var chemicalPi;
        id = parseInt(id);
        for (var i = 0; i<list.length;i++) {
            chemicalPi = list[i];
            if (chemicalPi.id == id) {
                return i;
            }
        }
        return -1;
    },
    findByName: function (list, name) {
        var chemicalPi;
        for (var i = 0; i<list.length;i++) {
            chemicalPi = list[i];
            if (chemicalPi.name == name) {
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

        for (var i = 0; i<chemicalPiTransactionsData.length;i++) {
            if (chemicalPiTransactionsData[i].name == name) {
                success = true;
                transaction = chemicalPiTransactionsData[i];
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
        var index = ChemicalPi.find(tmpSearchList,id);
        var startPiIndex, endPiIndex, elementPiDigits, digitString = '';
        var activeClass = "active";
        if (index == -1) {
            $('#profile').html('');
        } else {
            var chemicalPi = tmpSearchList[index];
            startPiIndex = parseInt(chemicalPi.atomicNumber) * 10;
            endPiIndex = startPiIndex + 10;
            for (var i = startPiIndex; i < endPiIndex; i++) {
              digitString += ' '
              digitString += piDigits[i];
            }
            var nextElement = chemicalPiData[index+1].symbol;
            var chemicalPiImage = '';
            var mouthful = '<nobr><b>' + chemicalPi.symbol + '</b> - ' + digitString + ' - <b>' + nextElement + '</b></nobr>';
            var html = '\n<div id="panel">';
            html += '\n<fieldset id="element-info">';
            html += '\n<div id="photo" onerror="this.style.display=\'none\'" style="background-image: url(images/';
            html += chemicalPiImage;
            html += '");"></div>';
            html += '\n<legend>Element Information</legend>';
            html += '\n<ul>';
            html += '\n<li ><label>Element Name</label><span class="';
            html += activeClass + '">' + chemicalPi.element ;
            html += '</span></li>';
            html += '\n<li><label>Symbol</label>' + chemicalPi.symbol + '</li>';
            html += '\n<!--<li><label>&pi; Digits</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + digitString + '</li>-->';
            html += '\n<li><label>Mouthful</label>' + mouthful + '</li>';

            html += '\n<li><label>Atomic Number</label>' + chemicalPi.atomicNumber + '</li>';

            html += '\n<li><label>Atomic Weight</label>' + chemicalPi.atomicWeight + '</li>';

            html += '\n<li><label>Period</label>' + '<pre>' + chemicalPi.period + '</pre></li>';
            html += '\n<li><label>Group</label>' + chemicalPi.group + '</li>';
            html += '\n<li><label>Phase</label>' + chemicalPi.phase + '</li>';
            html += '\n<li><label>Most Stbl Cr</label>' + chemicalPi.mostStableCrystal + '</li>';
            html += '\n<li><label>Type</label>' + chemicalPi.type + '</li>';
            html += '\n<li><label>Ionic Radius</label>' + chemicalPi.ionicRadius + '</li>';
            html += '\n<li><label>Atomic Radius</label>' + chemicalPi.atomicRadius + '</li>';
            html += '\n<li><label>Electronegativity</label>' + chemicalPi.electronegativity + '</li>';
            html += '\n<li><label>1st Ion Potential</label>' + chemicalPi.firstIonizationPotential + '</li>';
            html += '\n<li><label>Density</label>' + chemicalPi.density + '</li>';
            html += '\n<li><label>Melting Point</label>' + chemicalPi.meltingPointK + '&deg;K</li>';
            html += '\n<li><label>Boiling Point</label>' + chemicalPi.boilingPointK + '&deg;K</li>';
            html += '\n<li><label>Isotopes</label>' + chemicalPi.isotopes + '</li>';
            html += '\n<li><label>Discovered By</label>' + chemicalPi.discoverer + '</li>';
            html += '\n<li><label>Year Discovered</label>' + chemicalPi.yearOfDiscovery + '</li>';
            html += '\n<li><label>Specific Heat</label>' + chemicalPi.specificHeatCapacity + '</li>';
            html += '\n<li><label>Electron Configuration</label>' + chemicalPi.electronConfiguration + '</li>';
            html += '\n<li><label>Column</label>' + chemicalPi.displayColumn + '</li>';
            html += '\n<li><label>Row</label>' + chemicalPi.displayRow + '</li>';

            html += '\n</ul>';
            html += '\n</fieldset>';
            html += '\n</div>'

            $('#profile').html(html);

            if (photo) {
              $('#photo').resizable({
                    alsoResize: null,
                    animate: false,
                    animateDuration: "slow",
                    animateEasing: "swing",
                    aspectRatio: false,
                    autoHide: false,
                    containment: false,
                    ghost: false,
                    grid: false,
                    handles: "s,w,sw",
                    helper: false,
                    maxHeight: null,
                    maxWidth: null,
                    minHeight: 10,
                    minWidth: 40,
                    zIndex: 1000
                  });
            }
        }
        return index;
    },
    setup: function setup () {

        searchLists['all'] = {
            list: chemicalPiData,
            name: 'all',
            fields: {}
        }
        searchLists['tmp'] = {
            list: tmpSearchList,
            name: 'tmp',
            fields: {}
        }
        Log.Notice("ChemicalPi.setup()");
        Data.restoreSelect('fieldToSearch');
        Data.restoreCheckbox('searchList');
        Data.restoreSelect('outputType');

        tmpSearchList = searchLists[searchList].list;
        searchLists['tmp'].list = tmpSearchList;
    },
    merge: function () {



    },


};
