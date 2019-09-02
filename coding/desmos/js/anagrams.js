let dict;
let title;
let anagrams = 0;
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

  document.getElementById(statsId).innerHTML = `
  <div>Dictionary: ${Dictionaries[dictId]['dir']} 
  ${Dictionaries[dictId]['file']}</div>
  <div>Description: ${Dictionaries[dictId]['label']}</div>
  <div>Entries: ${dict.length}</div>
  <div>Anagrams: ${anagrams}</div>` 


}

var rootNode = [];
var AddNodePath = function (root,path) {
    var pathArray = path.toLowerCase().split("").sort();
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
    } else {
      tmp['anagrams'] = [path]
    }
    return rootNode
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
Dictionaries[Dictionaries.length] = new dictionary('','','GitHub 3000 Word',
  'https://gist.githubusercontent.com/dlants/d3b25b0f6c0bf8d023f65e86498bf9e6/raw/b310b5aff00f62f5073b3b8d366f5a639aa88ee3/3000-words.txt');
Dictionaries[Dictionaries.length] = new dictionary('Special','google-10000.txt','Google 10,000');
Dictionaries[Dictionaries.length] = new dictionary('American','2of12inf.txt','American 2 of 12, Inf');
Dictionaries[Dictionaries.length] = new dictionary('American','2of12.txt','American 2 of 12');
Dictionaries[Dictionaries.length] = new dictionary('International','3of6all.txt','International 3 of 6 All');
Dictionaries[Dictionaries.length] = new dictionary('International','5d+2a.txt','International 5D + 2A');

var howDeep = 0;

var printStructure = function(root,depth) {
  var result = ""
  var anagrams = ""
  var indent = " ".repeat(howDeep*2);
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
  startInput.value = start.split("").sort().join("");
  
  for (let letter of start.split("").sort()) {
    if (root[letter]) {
      root = root[letter]
    } else {
      break
    }
  }
  var text = printStructure(root,depth)
  document.getElementById('printed').innerHTML = text;
}

reSetup();