var SPACE = " ";

var escapes = new Array();
escapes["\n"]  = ""
escapes["\r"]  = ""
escapes[SPACE] = "%20"

escapes["<"] = "%3C"
escapes[">"] = "%3E"
escapes["#"] = "%23"
escapes["%"] = "%25"
escapes["{"] = "%7B"
escapes["}"] = "%7D"
escapes["|"] = "%7C"
escapes["\\"] = "%5C"
escapes["^"] = "%5E"
escapes["~"] = "%7E"
escapes["["] = "%5B"
escapes["]"] = "%5D"
escapes["`"] = "%60"
escapes[";"] = "%3B"
escapes["/"] = "%2F"
escapes["?"] = "%3F"
escapes[":"] = "%3A"
escapes["@"] = "%40"
escapes["="] = "%3D"
escapes["&"] = "%26"
escapes["$"] = "%24"
escapes["\""] = "'"


function urlencodeSVG (svgDocument) {
    regUnLT = /</g;
    regUnGT = />/g;
    regUnAmp = /&/g;
    regUnNL  = /\n/g;
    regUnCR  = /\r/g;  
    regUnHash = /\#/g;
    regUnDash = /\-/g;
    regUnPct  = /%/g;
    regUnDQ   = /\"/g;

    if (svgDocument == undefined || svgDocument == null) {
        svgDocument = "";
        return svgDocument;
    }

    return svgDocument
        .replace(regUnPct, escapes["%"])
        .replace(regUnDQ, escapes["\""])
        .replace(regUnAmp, escapes["&"])
        .replace(regUnGT, escapes[">"])
        .replace(regUnLT, escapes["<"])
        .replace(regUnNL, escapes["\n"])
        .replace(regUnCR, escapes["\r"])
        .replace(regUnHash, escapes["#"])
}

