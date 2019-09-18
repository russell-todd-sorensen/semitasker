let dict;
let title;
let anagrams = 0;
let anagramGroups = [];
let filterChecked = "";

var reSetup = function (dictId) {

  dictId = parseInt(dictId);

  if (dictId && ((dictId - dictId) == 0)) {
    // cool
  } else {
    dictId = parseInt(document.location.href.split("?")[1]);
    if (!((dictId - dictId) == 0) ) dictId = 0;
  }
  var url;
  var dictData = Dictionaries[dictId];
  if (dictData['url']) {
    url = dictData['url']
  } else {
    url = 'https://home.semitasker.com/coding/desmos/data/' + dictData['dir'] + '/' + dictData['file']
  }
  var title = 'Anagrams using ' + dictData['label'] + ' Dictionary'
  fetch(
    url
  ).then(
    (res) => res.text()
  ).then(
    (text) => {
    dict = text.split('\n');
    rootNode = [];
    document.getElementById('title').innerHTML = title;
    anagrams = 0;
    setup(rootNode);
    displayStats('stats', dictId);
  });
}

var displayStats = function (statsId,dictId) {

  var dictRef,selected;
  var selectDict = "<select id='dict' onchange='changeDictionary(\"dict\")' >\n"
  for (var i = 0;i<Dictionaries.length;i++) {
    dictRef = Dictionaries[i]
    if (dictId == i) {
      selected = " selected "
    } else {
      selected = ""
    }
    selectDict = selectDict 
      + "  <option value='" 
      + i 
      + "'" 
      + selected 
      + ">"
      + dictRef['label']
      + "</option>\n"
  }
  selectDict += "</select>\n"

  document.getElementById(statsId).innerHTML = `
  <div><span id='dictionary'>Dictionary:</span><span 
    id='dict-path'> ${Dictionaries[dictId]['dir']} ${Dictionaries[dictId]['file']}</span></div>
  <div><span 
    id='description'>Description:</span><span 
    id='label'> ${Dictionaries[dictId]['label']}</span></div>
  <div><span>Entries:</span><span> ${dict.length}</span></div>
  <div><span>Anagrams:</span><span> ${anagrams}</span></div>
  <div><span>Anagram Groups:</span><span> ${Object.entries(anagramGroups).length}</span></div>
  <div><span 
    id='filter-label'>Filter List?:</span><span><input 
    id='filter' name='filter' type='checkbox' value='1'
    onchange='toggleFilteredAnagramTrie("filter")' /></span></div>
  <div><span id='choose-dict'>Choose Dict:</span><span>${selectDict}</span></div>`
}

var changeDictionary = function (selectId) {
  var optionList = document.getElementsByTagName('option');
  var dictId = 0;
  for (var i = 0;i<optionList.length;i++) {
    if (optionList[i].selected) {
      dictId = i;
      break;
    }
  }
  var href = location.href.split('?')[0]
  location.href = href + '?' + dictId
  // ^-- This causes the page to reload with new href
}

var rootNode = [];
var AddNodePath = function (root,path) {
  var pathArray = path.toLowerCase().split("").sort();
  var pathSortJoined = pathArray.join("");
  var val;
  var tmp = root
  for (var i = 0;i<pathArray.length;i++) {
    if (pathArray[i] == " ") continue; 
    if (tmp[pathArray[i]] == undefined) {
      tmp[pathArray[i]] = []
      tmp = tmp[pathArray[i]]
    } else {
      tmp = tmp[pathArray[i]]
    }
  }
  if (tmp['anagrams']) {
    tmp['anagrams'].push(path)
    anagrams++;
    anagramGroups[pathSortJoined] = tmp['anagrams'];
  } else {
    tmp['anagrams'] = [path]
  }
  return rootNode
}

var toggleFilteredAnagramTrie = function(filterId) {
  var filterValue = document.getElementById(filterId).checked;
  if (filterValue == true) {
    setupFilteredAnagramTrie();
  } else {
    reSetup();
  }
}

var setupFilteredAnagramTrie = function () {
  // called after setup(root), requires global anagrams and rootNode
  rootNode = []; //reset
  var tmp
  for (let [key, value] of Object.entries(anagramGroups)) {
    tmp = rootNode
    for (let letter of key.split("")) {
      if (tmp[letter]) {
        // nice
      } else {
        tmp[letter] = []
      }
      tmp = tmp[letter]
    }
    tmp.anagrams = value
  }
}

var setup = function(root) {
  var dLen = dict.length;
  for (var i = 0; i<dLen;i++) {
    AddNodePath(root,dict[i])
  }
}

var Dictionaries = [];
var dictionary = function (dir,file,label,url) {
  this.dir = dir;
  this.file = file;
  this.label = label;
  if (url) this.url = url;
  return this;
};
Dictionaries[Dictionaries.length] = new dictionary('Internet','3000-words.txt','GitHub 3000 Word',
  'https://gist.githubusercontent.com/dlants/d3b25b0f6c0bf8d023f65e86498bf9e6/raw/b310b5aff00f62f5073b3b8d366f5a639aa88ee3/3000-words.txt');
Dictionaries[Dictionaries.length] = new dictionary('Special','google-10000.txt','Google 10,000');
Dictionaries[Dictionaries.length] = new dictionary('American','2of12inf.txt','American 2 of 12, Inf');
Dictionaries[Dictionaries.length] = new dictionary('American','2of12.txt','American 2 of 12');
Dictionaries[Dictionaries.length] = new dictionary('International','3of6all.txt','International 3 of 6 All');
Dictionaries[Dictionaries.length] = new dictionary('International','5d+2a.txt','International 5D + 2A');
Dictionaries[Dictionaries.length] = new dictionary('Special','467k-english-words.txt','467K English Words')
var howDeep = 0;

var printStructure = function(root,depth) {
  var result = ""
  var anagrams = ""
  var indent = " ".repeat(howDeep*2);
  var child = "";
  howDeep++
  for (let [key, value] of Object.entries(root).sort()) {
    if (key == "anagrams") {
      anagrams = indent + "anagrams:" +  JSON.stringify(root["anagrams"], null, 0) + "\n"
    } else if (depth > 0) {
      child = printStructure(value,depth-1)
      if (child.length > 0) {
        result = result  + indent + "--" + key + ":\n" + child ;
      }
    }
  }
  howDeep--
  return anagrams + result
}

function onInput(inputId,outputId) {
    const word = document.getElementById(inputId).value
    var found = true;
    var stringValue = "[]"
    var tmp = rootNode

    for (let letter of word.split("").sort()) {
      if (tmp[letter]) {
        tmp = tmp[letter]
      } else {
        found = false;
        break;
      }
    }

    if (found && tmp['anagrams']) {
        stringValue = JSON.stringify(tmp['anagrams'], null, 2)
    }

    document.getElementById(outputId).innerHTML = stringValue;
}

var quickPrint = function(root,depth) {
  howDeep = 0;
  if (depth <= 0) {
    depth = parseInt(document.getElementById('depth').value);
  }
  var startInput = document.getElementById('start')
  var start = startInput.value;
  var foundStart = ""
  for (let letter of start.split("").sort()) {
    if (root[letter]) {
      root = root[letter]
      foundStart += letter
    } else {
      break
    }
  }

  startInput.value = foundStart;
  var text = printStructure(root,depth)
  document.getElementById('printed').innerHTML = text;
}

reSetup();