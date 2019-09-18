let dict;
let title;
let anagrams = 0;
let anagramGroups = [];
let filterChecked = "";

let reSetup = function (dictId) {

  dictId = parseInt(dictId);

  if (!(dictId && ((dictId - dictId) == 0))) {
    dictId = parseInt(document.location.href.split("?")[1]);
    if (!((dictId - dictId) == 0)
      || (Dictionaries.length-1 < dictId) ) dictId = 0;
  }

  let dictData = Dictionaries[dictId], url;
  if (dictData["url"]) {
    url = dictData["url"];
  } else {
    url = "https://home.semitasker.com/coding/desmos/data/"
      + dictData["dir"] + "/" + dictData["file"];
  }

  let title = "Anagrams using " + dictData["label"] + " Dictionary"
  fetch(
    url
  ).then(
    (res) => res.text()
  ).then(
    (text) => {
    dict = text.split("\n");
    rootNode = [];
    document.getElementById("title").innerHTML = title;
    anagrams = 0;
    setup(rootNode);
    displayStats("stats", dictId);
  });
};

let displayStats = function (statsId,dictId) {

  let dictRef,selected;
  let selectDict = "<select id='dict' "
    + "onchange='changeDictionary(\"dict\")' >\n"

  for (let i = 0;i<Dictionaries.length;i++) {
    dictRef = Dictionaries[i]
    if (dictId == i) {
      selected = " selected ";
    } else {
      selected = "";
    }
    selectDict = selectDict
      + "  <option value='"
      + i
      + "'"
      + selected
      + ">"
      + dictRef["label"]
      + "</option>\n";
  }
  selectDict += "</select>\n"

  // some lines are long because extra spaces would break the formatting :()
  document.getElementById(statsId).innerHTML = `
  <div><span id='dictionary'>Dictionary:</span><span
    id='dict-path'> ${Dictionaries[dictId]["dir"]} ${Dictionaries[dictId]["file"]}</span></div>
  <div><span
    id='description'>Description:</span><span
    id='label'> ${Dictionaries[dictId]["label"]}</span></div>
  <div><span>Entries:</span><span> ${dict.length}</span></div>
  <div><span>Anagrams:</span><span> ${anagrams}</span></div>
  <div><span>Anagram Groups:</span><span> ${Object.entries(anagramGroups).length}</span></div>
  <div><span
    id='filter-label'>Filter List?:</span><span><input
    id='filter' name='filter' type='checkbox' value='1'
    onchange='toggleFilteredAnagramTrie("filter")' /></span></div>
  <div><span id='choose-dict'>Choose Dict:</span><span>${selectDict}</span></div>`
};

let changeDictionary = function (selectId) {
  const optionList = document.getElementsByTagName("option");
  let dictId = 0;
  for (let i = 0;i<optionList.length;i++) {
    if (optionList[i].selected) {
      dictId = i;
      break;
    }
  }
  const href = location.href.split("?")[0]
  location.href = href + "?" + dictId
  // ^-- This causes the page to reload with new href
};

let rootNode = [];
let AddNodePath = function (root,path) {
  const pathArray = path.toLowerCase().split("").sort();
  const pathSortJoined = pathArray.join("");
  let tmp = root
  for (let i = 0;i<pathArray.length;i++) {
    if (pathArray[i] == " ") continue;
    if (tmp[pathArray[i]] == undefined) {
      tmp[pathArray[i]] = []
      tmp = tmp[pathArray[i]]
    } else {
      tmp = tmp[pathArray[i]]
    }
  }
  if (tmp["anagrams"]) {
    tmp["anagrams"].push(path)
    anagrams++;
    anagramGroups[pathSortJoined] = tmp["anagrams"];
  } else {
    tmp["anagrams"] = [path]
  }
  return rootNode
};

let toggleFilteredAnagramTrie = function(filterId) {
  const filterValue = document.getElementById(filterId).checked;
  if (filterValue == true) {
    setupFilteredAnagramTrie();
  } else {
    reSetup();
  }
};

let setupFilteredAnagramTrie = function () {
  // called after setup(root), requires global anagramGroups and rootNode
  rootNode = []; //reset, we will rebuild the rootNode trie structure

  for (let [key, value] of Object.entries(anagramGroups)) {
    let tmp = rootNode;
    for (let letter of key.split("")) {
      if (!tmp[letter]) {
        tmp[letter] = [];
      }
      tmp = tmp[letter];
    }
    tmp.anagrams = value;
  }
};

let setup = function(root) {
  const len = dict.length;
  for (let i = 0; i<len;i++) {
    AddNodePath(root,dict[i]);
  }
};

let Dictionaries = [];
let dictionary = function (dir,file,label,url) {
  this.dir = dir;
  this.file = file;
  this.label = label;
  if (url) this.url = url;
  return this;
};

let url3000 = "https://gist.githubusercontent.com/dlants/"
url3000 += "d3b25b0f6c0bf8d023f65e86498bf9e6/raw/"
url3000 += "b310b5aff00f62f5073b3b8d366f5a639aa88ee3/3000-words.txt"

Dictionaries[Dictionaries.length] = new dictionary("Internet",
  "3000-words.txt","GitHub 3000 Word", url3000);
Dictionaries[Dictionaries.length] = new dictionary("Special",
  "google-10000.txt","Google 10,000");
Dictionaries[Dictionaries.length] = new dictionary("American",
  "2of12inf.txt","American 2 of 12, Inf");
Dictionaries[Dictionaries.length] = new dictionary("American",
  "2of12.txt","American 2 of 12");
Dictionaries[Dictionaries.length] = new dictionary("International",
  "3of6all.txt","International 3 of 6 All");
Dictionaries[Dictionaries.length] = new dictionary("International",
  "5d+2a.txt","International 5D + 2A");
Dictionaries[Dictionaries.length] = new dictionary("Special",
  "467k-english-words.txt","467K English Words");

let howDeep = 0;
let printStructure = function(root,depth) {
  let result = "";
  let anagramText = "";
  const indent = " ".repeat(howDeep*2);
  let child = "";
  howDeep++;
  for (let [key, value] of Object.entries(root).sort()) {
    if (key == "anagrams") {
      anagramText = indent
        + "anagrams:"
        +  JSON.stringify(root["anagrams"], null, 0) + "\n"
    } else if (depth > 0) {
      child = printStructure(value,depth-1)
      if (child.length > 0) {
        result = result  + indent + "--" + key + ":\n" + child ;
      }
    }
  }
  howDeep--;
  return anagramText + result;
};

let onInput = function(inputId,outputId) {
    const word = document.getElementById(inputId).value
    let found = true;
    let stringValue = "[]";
    let tmp = rootNode;

    for (let letter of word.split("").sort()) {
      if (tmp[letter]) {
        tmp = tmp[letter];
      } else {
        found = false;
        break;
      }
    }

    if (found && tmp["anagrams"]) {
        stringValue = JSON.stringify(tmp["anagrams"], null, 2);
    }

    document.getElementById(outputId).innerHTML = stringValue;
}

let quickPrint = function(root,depth) {
  howDeep = 0;
  if (depth <= 0) {
    depth = parseInt(document.getElementById("depth").value);
  }
  const startInput = document.getElementById("start");
  const start = startInput.innerText;
  const letterArray = start.split("").sort()
  let foundStart = "";
  let notFound = "";
  for (let letter of letterArray) {
    if (root[letter]) {
      root = root[letter];
      foundStart += letter;
    } else {
      notFound = "<span id='excluded-letters'>"
        + letterArray.slice(foundStart.length).join("") + "</span>";
      foundStart += notFound;
      break;
    }
  }

  startInput.innerHTML = foundStart;
  document.getElementById("printed").innerHTML = printStructure(root,depth);
}

reSetup();