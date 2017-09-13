
function escapeHTML(html) {
  regUnLT = /</g;
  regUnGT = />/g;
  regUnAmp = /&/g;
  
  if (html == undefined || html == null) {
    html = "";
    return html;
  }
  
  return html
    .replace(regUnAmp, "&amp;")
    .replace(regUnGT, "&gt;")
    .replace(regUnLT, "&lt;")
}

function escapeAllHTML(html) {
  regUnLT = /</g;
  regUnGT = />/g;
  regUnAmp = /&/g;
  regUnSQuote = /\'/g;
  regUnDQuote = /\"/g;
  
  if (html == undefined || html == null) {
    html = "";
    return html;
  }
  
  return html
    .replace(regUnAmp, "&amp;")
    .replace(regUnGT, "&gt;")
    .replace(regUnLT, "&lt;")
    .replace(regUnSQuote, "&apos;")
    .replace(regUnDQuote, "&quote;")
}

function escapeQuotes(html) {
    
  regUnSQuote = /\'/g;
  regUnDQuote = /\"/g;
  
  if (html == undefined || html == null) {
    html = "";
    return html;
  }
  
  return html
    .replace(regUnSQuote, "\\\'")
    .replace(regUnDQuote, "\\\"");
}

function unescapeHTML(html) {
  
  var regLT = /&lt;/gi;
  var regGT = /&gt;/gi;
  var regNBSP = /&nbsp;/gi;
  var regAmp = /&amp;/gi;
  
  if (html == undefined || html == null) {
    html = "";
    return html;
  }
  
  return html
    .replace(regLT, "<")
    .replace(regGT, ">")
    .replace(regNBSP, " ");
}
