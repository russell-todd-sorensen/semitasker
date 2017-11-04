// mouthful-search.js

function getElement(attr,value) {
  var chemicalData = new Object();
  for (var i = 0;i < chemicalPiData.length ;i++) {
    chemicalData = chemicalPiData[i];
    if (chemicalData === undefined) {
      chemicalData =  chemicalPiData[chemicalPiData.length-1];
    }
    if (chemicalData[attr] == value) {
      break;
    }
  }
  return chemicalData;
}

function getMouthful(atomicNumber) {
  var mouthful = '';
  var value = '';
  var index = parseInt(atomicNumber);
  for (var i = 10*index; i< (10*index+10); i++) {
    value = piDigits[i];
    if (value === undefined) {
      return ' 3 ';
    }
    mouthful += value  + ' ';
  }
  return mouthful;
}

function getPeriodicTableLength() {
  if (chemicalPiData) {
    return chemicalPiData.length;
  } else {
    return -1
  }

}
