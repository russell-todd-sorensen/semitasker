// JavaScript Document

var dataset = new Array();
var datasetExp; // = new Array();
var dsStyleArray; // = new Array();

var orange = "orange";
var black = "black";
var green = "green";
var dkgreen = "darkgreen";
var white = "white";
var slateblue = "slateblue";
var slateblue = "#336699";
var red = "red";
var yellow = "yellow";
var blue = "blue";
var gray = "gray";
var dkolivegr = "darkolivegreen";
var greygreen = "#667777";
var lightgrey = "lightgray";
var lightgray = "lightgray";
var vlightgray = "#cccccc";
var dkorange = "#d2691e";
var orangered = "orangered";
var brntorange = "#a85418";
var slategray = "slategray";
var forestgreen = "forestgreen";
var magenta = "magenta";
var lightpurple = "#b366b3";
var skyblue = "skyblue";
var darkblue = "darkblue";
var purpleblue = "#6666ff";
var dkpurple = "#330066";
var ltblack = "#262626";
var mustardyellow = "#996600";
var peach = "#ff9966";
var offwhite = "#dddddd";
var ltpurple = "#b366b3";
var turquoise = "turquoise";
var dkpeach = "#e69063";
var purple = "purple";
var navy = "navy";
var ltslateblue = "lightsteelblue";
var ltsteelblue = "lightsteelblue";
var lightpink = "lightpink";
var vlightpink = "#ffdae0";
var dkyellow = "goldenrod";
var goldenrod = "goldenrod";
var gold = "gold";
var limegreen = "limegreen";
var midnightblue = "midnightblue";

var MacFarlaneDress_DB = "#202060";
var MacFarlaneDress_K = "#101010";
var MacFarlaneDress_CW = "#FCFCFC";
var MacFarlaneDress_DG = "#003820";
var MacFarlaneDress_R = "#C80000";

var MacFarlaneLordLyon_K = "#101010";
var MacFarlaneLordLyon_C = "#A00048";
var MacFarlaneLordLyon_HG = "#285800";
var MacFarlaneLordLyon_P = "#780078";
var MacFarlaneLordLyon_W = "#E0E0E0";

var Anderson_AL = "#48A4C0"; // Anderson Blue
var Anderson_K  = "#101010"; // Black
var Anderson_GO = "#BC8C00"; // Dark Gold
var Anderson_DG = "#003820"; // Dark Green
var Anderson_NB = "#003C64"; // Navy Blue
var Anderson_R  = "#C80000"; // Red
var Anderson_W  = "#E0E0E0"; // White
var Anderson_DY = "#E8C000"; // Gold
var Anderson_G  = "#006818"; // Green
var Anderson_B  = "#2C2C80"; // Blue


dataset[dataset.length] = ["Choose a Tartan Pattern", []];

dataset[dataset.length] = ["Anderson", [[Anderson_R, 6], [Anderson_AL, 12], [Anderson_R, 4], [Anderson_K, 4], [Anderson_R, 4], [Anderson_AL, 36],
	[Anderson_K, 6], [Anderson_W, 6], [Anderson_K, 6], [Anderson_DY, 4], [Anderson_K, 4], [Anderson_DY, 4], [Anderson_K, 8], [Anderson_R, 4], [Anderson_B, 8], [Anderson_R, 6], 
	[Anderson_G, 12], [Anderson_R, 4], [Anderson_G, 12], [Anderson_R, 8]
]];

dataset[dataset.length] = ["MacFarlane Dress", [[MacFarlaneDress_DB, 8], [MacFarlaneDress_CW, 4], [MacFarlaneDress_R, 12],
 	[MacFarlaneDress_K, 2], [MacFarlaneDress_DB, 24], [MacFarlaneDress_DG, 8], [MacFarlaneDress_DB, 4], [MacFarlaneDress_R, 12],
	[MacFarlaneDress_DB, 2], [MacFarlaneDress_R, 12], [MacFarlaneDress_CW, 4], [MacFarlaneDress_DG, 16], [MacFarlaneDress_R, 4],
	[MacFarlaneDress_CW, 32], [MacFarlaneDress_R, 8]]
 ];

dataset[dataset.length] = ["MacFarlane Lord Lyon", [[MacFarlaneLordLyon_HG, 6 ],[MacFarlaneLordLyon_W, 8],[MacFarlaneLordLyon_C, 6], [MacFarlaneLordLyon_K, 8],
	[MacFarlaneLordLyon_P, 24], [MacFarlaneLordLyon_HG, 4], [MacFarlaneLordLyon_W, 4], [MacFarlaneLordLyon_C, 6], [MacFarlaneLordLyon_K, 2], [MacFarlaneLordLyon_C, 6],
 	[MacFarlaneLordLyon_W, 4], [MacFarlaneLordLyon_HG, 24], [MacFarlaneLordLyon_K, 2], [MacFarlaneLordLyon_C, 42]]
];

dataset[dataset.length] = ["TEST 1", [["green", 2], ["grey", 2], ["red", 4], ["grey", 2], ["tan", 6]]];
dataset[dataset.length] = ["TEST 2", [["blue", 2], ["grey", 2], ["red", 4], ["grey", 8], ["green", 8]]];
dataset[dataset.length] = ["TEST 3", [
	[purple, 2], [white, 4], [ltsteelblue, 12], [black, 2], [ltsteelblue, 34], [white, 2], [ltsteelblue, 12], [dkolivegr, 8], [black, 2],
	[dkolivegr, 4], [navy, 4], [lightpurple, 24], [white, 4], [lightpink, 2], [black, 3]
]
 ];
// ABERDEEN
dataset[dataset.length] = ["ABERDEEN", [
	[white, 2], [dkorange, 54], [white, 4], [dkorange, 54], [white, 4], [black, 32],
	[dkolivegr, 8], [white, 4], [dkorange, 16], [white, 2], [dkorange, 16], [white, 4],
	[skyblue, 20], [white, 4], [purple, 6], [dkorange, 22], [white, 4],  // is this where thihgs end
	[dkorange, 22], [purple, 6], [white, 4], [black, 24], [dkolivegr, 8], [black, 24],
	[white, 4], [purple, 6], [dkorange, 22], [white, 4], [dkorange, 22], [purple, 6],
	[white, 4], [purple, 12], [skyblue, 8], [white, 2]
]
];
// AMERICAN ST ANDREWS
dataset[dataset.length] = ["AMERICAN ST. ANDREWS", [
	[navy, 14], [slategray, 4], //[ltsteelblue, 14], removed for now
	// changing dkpeach to orangered
  [vlightpink, 4],
	[slategray, 4], [navy, 40], [black, 36], [orangered, 32], [white, 8],
	[orangered, 6], [white, 6], [orangered, 6], [white, 6], [orangered, 5]
]
];
// CORNWALL
dataset[dataset.length] = ["CORNWALL", [
  // changing dkyellow/goldenrod to gold dkorange to orange
	[dkorange, 3], [black, 6], [ltsteelblue, 14], [dkyellow, 52], [black, 52],
	[white, 5]
]
];
// DUNDAS
dataset[dataset.length] = ["DUNDAS", [
  // green to dkgreen, darkblue to dkpurple, orange to dkorange
	[black, 2], [dkgreen, 4], [dkorange, 2], [dkgreen, 24], [black, 12],
	[dkpurple, 16], [black, 2]]
	];
// DUNCAN
dataset[dataset.length] = ["DUNCAN", [
  // orange to dkorange, darkblue to midnightblue
	[midnightblue, 4], [dkgreen, 20], [white, 6], [dkgreen, 20],
	[purpleblue, 20], [dkorange, 2]]
];
// MACFARLANE
dataset[dataset.length] = ["MACFARLANE", [
	[orange, 48], [black, 8], [dkgreen, 16], [white, 4], [orange, 12],
	[black, 2], [orange, 12], [white, 4], [dkgreen, 6], [slateblue, 48],
	[black, 16], [orange, 16], [white, 12], [dkgreen, 2]]
	];
// MACLEOD OF ARGENTINA
dataset[dataset.length] = ["MACLEOD OF ARGENTINA", [
	[red, 4], [yellow, 32], [blue, 24], [white, 6], [blue, 18]]
];
dataset[dataset.length] = ["CHRISTIE", [
	[peach, 12], [offwhite, 4], [peach, 24], [dkgreen, 32], [black, 4],
	[yellow, 4], [black, 14], [slategray, 12], [black, 4], [slategray, 10],
	[peach, 16]
	]
];
// CLARK
dataset[dataset.length] = ["CLARK", [
	[black, 4], [lightgray, 8], [slateblue, 36], [black, 36], [lightgray, 8],
	[slateblue, 12], [lightgray, 8], [slateblue, 20], [lightgray, 4]
	]

];
// CULLODEN CLAN
dataset[dataset.length] = ["COLLODEN CLAN", [
	[dkorange, 6], [slateblue, 6], [dkpurple, 48], [white, 4], [black, 44], [white, 4],
	[black, 44], [gray, 44], [black, 4], [slategray, 6]
	]
];
dataset[dataset.length] = ["COLLODEN CLAN 2", [
	[dkorange, 6], [skyblue, 6], [dkpurple, 48], [yellow, 4], [black, 44],
	[black, 44], [lightgray, 44], [black, 4], [slategray, 6]
	]
];
dataset[dataset.length] = ["COLLODEN CLAN 3", [
	[dkorange, 6], [slateblue, 4], [dkpurple, 44], [vlightgray, 6],
	[ltblack, 36], [vlightgray, 56], [black, 6], [vlightgray, 5]
	]

];
dataset[dataset.length] = ["COLLODEN CLAN 4", [
	[yellow, 3], [black, 4], [mustardyellow, 26], [black, 26], [white, 4],
	[dkpurple, 28], [skyblue, 6], [dkorange, 5]
	]

];
// DUNDEE
dataset[dataset.length] = ["DUNDEE", [
	[dkorange, 48], [black, 32], [dkorange, 4], [dkgreen, 48],
	[yellow, 8], [white, 4], [magenta, 4], [white, 4], [yellow, 8],
	[skyblue, 14], [white, 3], [lightpurple, 12], [white, 6]]
];

// colors for dundee 2
var ddOrange = "#d45439";
var ddGreen = "#40522f";
var ddWhite = "#dcd3da";
var ddPurple = "#8b529b";
var ddYellow = "#e9bb4c";
var ddBlue = "#6686aa";

// DUNDEE 2
dataset[dataset.length] = ["DUNDEE 2", [
	[ddOrange, 48], [black, 32], [ddOrange, 4], [ddGreen, 48],
	[ddYellow, 8], [ddWhite, 4], [ddPurple, 4], [ddWhite, 4], [ddYellow, 8],
	[ddBlue, 14], [ddWhite, 3], [ddPurple, 12], [ddWhite, 6]]
];

// DUNLOP
dataset[dataset.length] = ["DUNLOP", [
	[black, 3], [dkorange, 2], [black, 64], [white, 2], [slateblue, 64],
	[orange, 2], [slateblue, 2], [white, 3]]
];
// DUNBAR
dataset[dataset.length] = ["DUNBAR", [
	[white, 1], [slateblue, 4], [dkorange, 30], [white, 2], [dkgreen, 4],
	[white, 2], [dkgreen, 12], [white, 2], [dkgreen, 4], [white, 2],
	[yellow, 12], [dkgreen, 6]]
];

// DUNBAR 2
// data for dunbar 2
var dbWhite = "#dfd7dc";
var dbYellow = "#e5bc47";
var dbGreen = "#324d25";
var dbBlue = "#4b5396";
var dbOrange = "#d75c37";

dataset[dataset.length] = ["DUNBAR 2", [
	[dbWhite, 1], [dbBlue, 4], [dbOrange, 30], [dbWhite, 2], [dbGreen, 4],
	[dbWhite, 2], [dbGreen, 12], [dbWhite, 2], [dbGreen, 4], [dbWhite, 2],
	[dbYellow, 12], [dbGreen, 6]]
];


// DOUGLAS CLAN
dataset[dataset.length] = ["DOUGLAS CLAN", [
	[dkorange, 6], [black, 12], [greygreen, 2], [black, 12], [greygreen, 2],
	[black, 4], [greygreen, 8], [black, 2], [greygreen, 8], [dkorange, 6],
	[black, 3], [greygreen, 6], [black, 12], [lightgrey, 16], [black, 3],
	[lightgrey, 6], [greygreen, 3]]
];

// for douglas clan 2
var dcOrange = "#d74f34";
var dcLtGray = "#c6c3c1";
var dcDkLimeGreen = "#cfcd4b";
var dcDarkGray = "#808579";

// DOUGLAS CLAN 2
dataset[dataset.length] = ["DOUGLAS CLAN 2", [
	[dcOrange, 6], [black, 12], [dcDarkGray, 2], [black, 12], [dcDarkGray, 2],
	[black, 4], [dcDarkGray, 8], [black, 2], [dcDarkGray, 8], [dcOrange, 6],
	[black, 3], [dcDkLimeGreen, 6], [black, 12], [dcLtGray, 16], [black, 3],
	[dcLtGray, 6], [dcDarkGray, 3]]
];

// GORDON
dataset[dataset.length] = ["The GORDON CLAN", [
	[ltpurple, 14], [white, 4], [orange, 14], [white, 4], [ltpurple, 28], [white, 4],
	[dkgreen, 32], [turquoise, 12], [dkgreen, 10], [dkorange, 16], [black, 10],
	[dkorange, 16], [black, 1]
	]
];
// GRANDFATHER GAMES N. AMERICA
dataset[dataset.length] = ["GRANDFATHER GAMES N. AMERICA", [
	[dkorange, 3], [dkgreen, 48], [black, 4], [gray, 28], [black, 4], [slateblue, 48],
	[white, 3]
]
];
// KINNI ESON
dataset[dataset.length] = ["KINNI ESON", [
	[purple, 6], [black, 64], [lightgray, 38], [dkgreen, 4], [lightgray, 38],
	[dkgreen, 4], [lightgray, 38], [black, 64], [dkorange, 8], [black, 64],
	[lightgray, 38], [limegreen, 4], [lightgray, 19]
]
];
// ST. ANDREWS
dataset[dataset.length] = ["ST. ANDREWS", [
	[brntorange, 11], [slategray, 2], [brntorange, 22], [slateblue, 2],
	[white, 18], [dkolivegr, 22], [slateblue, 2], [dkolivegr, 11]]
];
// MACFIE
dataset[dataset.length] = ["MACFIE", [
	[orange, 14], [dkgreen, 8], [yellow, 4], [white, 4], [orange, 12],
	[black, 2], [orange, 12], [white, 4], [dkgreen, 6], [slateblue, 48],
	[black, 16], [orange, 16], [white, 12], [dkgreen, 2]]
];
dataset[dataset.length] = ["ULSTER", [
	[black, 1], [yellow, 2], [black, 2], [dkpeach, 40], [purple, 2], [dkgreen, 4],
	[dkpeach, 2], [dkgreen, 40], [purple, 2], [dkgreen, 20]
]
];


	// expand datasets
