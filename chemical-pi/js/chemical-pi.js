//var newXHR3;
xhrArray = new Array();

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

function loadXHRFile(url,callback) {
  var i = xhrArray.length;
  xhrArray[i] = new XMLHttpRequest();
  var newXHR3 = xhrArray[i];
  newXHR3.open("GET", url, true);
  newXHR3.onreadystatechange = callback;
  newXHR3.ondataavailable = null;
  newXHR3.send(null);
}

function getPeriodicTableCSV(evt) {
  if (evt.currentTarget.readyState < 4) {
    return;
  }

  parsePeriodicTableCSV(evt.currentTarget.responseText);
}

parsePeriodicTableCSV = function (csv) {
    var count = 0
    chemicalPiData = d3.csvParse(csv, function(d,i) {
        if (count++ < 5) {
          Log.Notice('Element=' + d["Element"] + ' displayColumn=' + parseInt(d["DisplayColumn"]) + ' elecConfig='
           + d["ElectronConfiguration"]);
        }
        var search = d["Element"]                +' '+
                     d["Symbol"]                 +' '+
                     d["ElectronConfiguration"]  +' '+
                     d["Discoverer"]             +' '+
                     d["Phase"];
        return {
            id: parseInt(d["AtomicNumber"]),
            element: d["Element"],
            symbol: d["Symbol"],
            atomicNumber: parseInt(d["AtomicNumber"]),
            atomicWeight: parseFloat(d["AtomicWeight"]),
            period: parseInt(d["Period"]),
            group: parseInt(d["Group"]),
            phase: d["Phase"],
            mostStableCrystal: d["MostStableCrystal"],
            type: d["Type"],
            search: search,
            ionicRadius: parseFloat(d["IonicRadius"]),
            atomicRadius: parseFloat(d["AtomicRadius"]),
            electronegativity: parseFloat(d["Electronegativity"]),
            firstIonizationPotential: parseFloat(d["FirstIonizationPotential"]),
            density: parseFloat(d["Density"]),
            meltingPointK: parseFloat(d["MeltingPointK"]),
            boilingPointK: parseFloat(d["BoilingPointK"]),
            isotopes: d["Isotopes"],
            discoverer: d["Discoverer"],
            yearOfDiscovery: parseInt(d["YearOfDiscovery"]),
            specificHeatCapacity: parseFloat(d["SpecificHeatCapacity"]),
            electronConfiguration: d["ElectronConfiguration"],
            displayRow: parseInt(d["DisplayRow"]),
            displayColumn: parseInt(d["DisplayColumn"])
        };

    });

    console.log("done loading PeriodicTable csv file");
    ChemicalPi.setup();
};
