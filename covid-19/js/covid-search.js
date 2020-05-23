// covid-search.js

var fieldToSearch = 'search';

var searchLength = 0;
var searchList = 'all';
var outputType = 'list';
var searchLists = new Array();
var tmpSearchList;
var index = 0;

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
            let searchList;

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
                searchList = tmpSearchList[i];

                switch (type) {
                  case 'list':
                  default:
                    $(outputSelector)
                      .append('<li class="cust icon-people" onfocus="ChemicalPi.show('
                        + searchList.id + ')" tabIndex="' + (i+10)
                        + '">' + searchList.element + '</li>\n');
                    break;
                } // end switch
            } // end for

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
                ChemicalPi.show(tmpTmpSearchList[0].id);
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
        let searchList;
        id = parseInt(id);
        for (var i = 0; i<list.length;i++) {
            searchList = list[i];
            if (searchList.id == id) {
                return i;
            }
        }
        return -1;
    },
    findByName: function (list, name) {
        let searchList;
        for (var i = 0; i<list.length;i++) {
            searchList = list[i];
            if (searchList.name == name) {
                return i;
            }
        }
        return -1;

    },
    show: function (id,theSearchList) {
        let index = ChemicalPi.find(theSearchList,id),
            startIndex,
            endIndex,
            digitString = '',
            activeClass = "active";

        if (index == -1) {
            $('#profile').html('');
        } else {
            Log.Notice('show(' + id + ') index="' + index + '"' + ' index+1="' + (index+1) + '"');
            let theData = theSearchList[index],
                html = '\n<div id="panel">';

            html += '\n<fieldset id="element-info">';
            html += '\n<div id="photo" onerror="this.style.display=\'none\'" style="background-image: url(images/';
            html += chemicalPiImage;
            html += '");"></div>';
            html += '\n<legend>Element Information</legend>';
            html += '\n<ul>';
            html += '\n<li ><label>Element Name</label><span class="';
            html += activeClass + '"><a href="https://www.chemicool.com/elements/';
            html += chemicalPi.element + '.html">' + chemicalPi.element + '</a>';
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
            list: covidStateData,
            name: 'all',
            fields: {}
        }
        searchLists['county'] = {
            list: covidCountyData,
            name: 'county',
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
