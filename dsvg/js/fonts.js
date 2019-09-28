let fontString = `'Roboto', sans-serif
'Turret Road', cursive
'Big Shoulders Text', cursive
'Cute Font', cursive
'Rubik', sans-serif
'Anton', sans-serif
'Chilanka', cursive
'Josefin Sans', sans-serif
'Indie Flower', cursive
'Pacifico', cursive
'Bree Serif', serif
'Squada One', cursive
'Righteous', cursive
'Patua One', cursive
'Permanent Marker', cursive
'Saira Stencil One', cursive
'Fredoka One', cursive
'Alfa Slab One', cursive
'Archivo Black', sans-serif
'Luckiest Guy', cursive
'Concert One', cursive
'Orbitron', sans-serif
'Baloo', cursive
'Viga', sans-serif
'Monoton', cursive
'Montserrat Alternates', sans-serif
'Gochi Hand', cursive
'Sigmar One', cursive
'Audiowide', cursive
'Fugaz One', cursive
'Press Start 2P', cursive
'Rubik Mono One', sans-serif
'Bahianita', cursive
'Black Ops One', cursive
'Days One', sans-serif
'Metamorphous', cursive
'Fredericka the Great', cursive
'VT323', monospace
'Leckerli One', cursive
'Cabin Sketch', cursive
'Aclonica', sans-serif
'Cinzel Decorative', cursive
'Berkshire Swash', cursive
'Gruppo', cursive
'Shrikhand', cursive
'Nanum Brush Script', cursive
'Petit Formal Script', cursive
'Bungee Inline', cursive
'Shojumaru', cursive
'Nixie One', cursive
'Ceviche One', cursive
'Baumans', cursive
'IM Fell English', serif
'Skranji', cursive
'Gravitas One', cursive
'Coiny', cursive
'Krub', sans-serif
'Faster One', cursive
'Megrim', cursive
'Limelight', cursive
'UnifrakturMaguntia', cursive
'Bilbo Swash Caps', cursive
'Iceland', cursive
'Bungee Shade', cursive
'Poller One', cursive
'Rationale', sans-serif
'Wallpoet', cursive
'Wire One', sans-serif
'Geo', sans-serif
'Rammetto One', cursive
'Nova Round', cursive
'Milonga', cursive
'Gugi', cursive
'Germania One', cursive
'Major Mono Display', monospace
'Ruslan Display', cursive
'ZCOOL KuaiLe', cursive
'ZCOOL QingKe HuangYou', cursive
'Rum Raisin', sans-serif
'Iceberg', cursive
'UnifrakturCook', cursive
'Plaster', cursive
'Monofett', cursive
'Smokum', cursive
'Miltonian Tattoo', cursive
'Sirin Stencil', cursive
'Zilla Slab Highlight', cursive
'Snowburst One', cursive
'Original Surfer', cursive
'Keania One', cursive
'Caesar Dressing', cursive
'Geostar Fill', cursive
'Fascinate', cursive
'Hanalei', cursive
'Stalinist One', cursive
'Black And White Picture', sans-serif
'Erica One', cursive
'Kenia', cursive
'Astloch', cursive
'Galindo', cursive`;

// add default font:
fontString = "'Arial', sans-serif\n" + fontString;

var fontDict = fontString.split("\n").sort();

// normally pass in top.fontArray
let fontDictToOptions = function(dict,globalArrayName) { 
    let fontString,font,trimmed,formattedNumber,lowercase;
    let optionHTML = ""
    let fontArray = [];

    for (let i=0;i<dict.length;i++) {
        fontString = dict[i];
        font = fontString.split(",")[0];
        formattedNumber = "&nbsp;".repeat(3-("" + i).length) + i;
        trimmed = font.slice(1,font.length-1)
        lowercase = trimmed.toLowerCase()
        fontArray[lowercase] = i
        optionHTML = optionHTML
            + "\n"
            + "<option value=\""
            + font
            + "\">"
            + formattedNumber
            + ": "
            + trimmed
            + "</option>";
    }

    globalArrayName = fontArray;
    return optionHTML;
}

let fontDictToIntIndexedArray = function (dict) {

    let fontString,font,trimmed;
    let optionHTML = ""
    let fontArray = new Array();

    for (let i=0;i<dict.length;i++) {
        fontString = dict[i];
        font = fontString.split(",")[0];
        trimmed = font.slice(1,font.length-1)
        fontArray[i] = font;
    }
    return fontArray;

}

var fontArray = [];
var optionHTML = fontDictToOptions(fontDict,fontArray);
var intToFontArray = fontDictToIntIndexedArray(fontDict);
