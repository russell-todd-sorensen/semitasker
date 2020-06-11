// covid-search.js

var fieldToSearch = 'search';

var searchLength = 0;
var searchList = 'all';
var outputType = 'list';
var searchLists = new Array();
var tmpSearchList;
var index = 0;
var currentDataTable = null;

class DataTable {

    tableName;
    tableData;

    constructor (tableName,tableData) {
        this.tableName = tableName;
        this.tableData = tableData;
    }

    configureSearchTable (selectId) {
        fieldToSearch = $('#' + selectId + ' option:selected').val();
        Data.saveSelect(selectId, this.tableName + '.restoreSearchTable');
    };
    restoreSearchTable (selectId) {
        fieldToSearch = $('#' + selectId + ' option:selected').val();
    };
    configureSearchField (selectId) {
        fieldToSearch = $('#' + selectId + ' option:selected').val();
        Data.saveSelect(selectId, this.tableName + '.restoreSearchField');
    };
    restoreSearchField (selectId) {
        fieldToSearch = $('#' + selectId + ' option:selected').val();
    };
    configureSearchList (selectId) {
        ChemicalPi.restoreSearchList(selectId);
        Data.saveCheckbox(selectId, this.tableName + '.restoreSearchList');
    };
    restoreSearchList (selectId) {
        searchList = $('#' + selectId + ':checked').val();
        tmpSearchList = searchLists[searchList].list;
    };
    configureOutputType (selectId) {
        ChemicalPi.restoreOutputType(selectId);
        Data.saveSelect(selectId, this.tableName + '.restoreOutputType');
    };
    restoreOutputType (selectId) {
        outputType = $('#' + selectId + ' option:selected').val();
    };
    restoreSearchString (inputId) {
        Data.restoreInput(inputId);
        var searchString = $('#' + inputId).val();
        searchLength = searchString.length;
    };
    write (tmpList,outputSelector,type) {
            let searchItem;

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
                searchItem = tmpSearchList[i];

                switch (type) {
                  case 'list':
                  default:
                    $(outputSelector)
                      .append('<li class="cust icon-people" onfocus="' 
                        +  this.tableName + '.show('
                        + searchItem.id + ', tmpSearchList)" tabIndex="' + (i+10)
                        + '">' + searchItem.cname + ', ' + searchItem.sname + '</li>\n');
                    break;
                } // end switch
            } // end for

    };
    search (inputId, outputSelector) {
        let evt = event,
            searchItem = {},
            searchString = $('#' + inputId).val(),
            searchRegExp = new RegExp(searchString,"i");

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

        let match = [],
            tmpTmpSearchList = [],
            myString = '';

        for (let i = 0;i<tmpSearchList.length;i++) {
            searchItem = tmpSearchList[i];
            myString = '' + searchItem[fieldToSearch];
            match = myString.match(searchRegExp);
            if (match) {
                tmpTmpSearchList.push(searchItem);
            }
        }

        if (tmpTmpSearchList.length > 0) {

            this.write(tmpTmpSearchList,outputSelector);

            if (tmpTmpSearchList.length == 1) {
                this.show(tmpTmpSearchList[0].id);
            }

            Data.saveInput(inputId, this.tableName + '.restore');
        } else {
            // restore previous search term
            if (evt.key == "Backspace") {
                return;
            }

            let newSearchString = searchString.substring(0,searchString.length-1)

            $('#' + inputId).val(newSearchString);
            searchLength = newSearchString.length;
        }
    };
    find (list, id) { // returns index of participant in list, with given id
        let searchItem = {};
        id = parseInt(id);

        for (var i = 0; i<list.length;i++) {
            searchItem = list[i];
            if (searchItem.id == id) {
                return i;
            }
        }
        return -1;
    };
    findByName (list, name) {
        let searchItem;
        for (var i = 0; i<list.length;i++) {
            searchItem = list[i];
            if (searchItem.name == name) {
                return i;
            }
        }
        return -1;

    };
    show (id,theSearchList) {
        let index = this.find(theSearchList,id),
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

            html += '\n<fieldset id="search-info">';
            html += '\n<legend>COVID-19 Data</legend>';
            html += '\n<ul>';
            html += '\n<li ><label>Location</label><span class="';
            html += 'location' + '"><a href="https://w/';
            html += theData.sname + '.html">' + theData.cname + ' ' + theData.sname + '</a>';
            html += '</span></li>';
            html += '\n<li><label>FIPS</label>' + theData.fips + '</li>';
            html += '\n<li><label>Date</label>' + theData.date + '</li>';
            html += '\n<li><label>Cases</label>' + theData.cases + '</li>';
            html += '\n<li><label>Deaths</label>' + theData.deaths + '</li>';
            html += '\n</ul>';
            html += '\n</fieldset>';
            html += '\n</div>'

            $('#profile').html(html);

            let photo = null;
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
    };
    setup () {

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
        searchLists['population'] = {
            list: covidPopData,
            name: 'pop',
            fields: {}
        }
        searchLists['tmp'] = {
            list: tmpSearchList,
            name: 'tmp',
            fields: {}
        }
        Log.Notice(this.name + ".setup()");
        Data.restoreSelect('searchTable');
        Data.restoreSelect('fieldToSearch');
        Data.restoreCheckbox('searchList');
        Data.restoreSelect('outputType');

        tmpSearchList = searchLists[searchList].list;
        searchLists['tmp'].list = tmpSearchList;
    };
    merge () {

    };
};

