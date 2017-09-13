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
var ltslateblue = "ltsteelblue";
var ltsteelblue = "ltsteelblue";
var lightpink = "lightpink";
var vlightpink = "#ffdae0";
var dkyellow = "goldenrod";
var limegreen = "limegreen";

dataset[dataset.length] = ["Choose a Tartan Pattern", []];
dataset[dataset.length] = ["TEST 1", [["green", 2], ["grey", 2], ["red", 4], ["grey", 2], ["tan", 6]]];		
dataset[dataset.length] = ["TEST 2", [["blue", 2], ["grey", 2], ["red", 4], ["grey", 8], ["green", 8]]];

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
	[navy, 14], [slategray, 4], [ltsteelblue, 14], [vlightpink, 4],
	[slategray, 4], [navy, 40], [black, 36], [dkpeach, 32], [white, 8], 
	[dkpeach, 6], [white, 6], [dkpeach, 6], [white, 6], [dkpeach, 5]
]
];
// CORNWALL 
dataset[dataset.length] = ["CORNWALL", [
	[dkorange, 3], [black, 6], [ltsteelblue, 14], [dkyellow, 52], [black, 52], 
	[white, 5]
]
];
// DUNDAS 
dataset[dataset.length] = ["DUNDAS", [
	[black, 1], [green, 2], [orange, 1], [green, 24], [black, 12],
	[darkblue, 16], [black, 2]]
	];
// DUNCAN
dataset[dataset.length] = ["DUNCAN", [
	[darkblue, 4], [dkgreen, 20], [white, 6], [dkgreen, 20], 
	[purpleblue, 20], [orange, 2]]
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
	[dkorange, 6], [slateblue, 6], [dkpurple, 48], [white, 4], [black, 44],
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
// DOUGLAS CLAN
dataset[dataset.length] = ["DOUGLAS CLAN", [
	[dkorange, 6], [black, 12], [greygreen, 2], [black, 12], [greygreen, 2],
	[black, 4], [greygreen, 8], [black, 2], [greygreen, 8], [dkorange, 6],
	[black, 3], [greygreen, 6], [black, 12], [lightgrey, 16], [black, 3],
	[lightgrey, 6], [greygreen, 3]]
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