
class MRCM {
    w = 1.0;
    h = 1.0;
    M = [];
    constructor(w=1.0,h=1.0,...m) {
        this.w=w?w:1.0; //w != 0
        this.h=h?h:1.0; //h != 0
        this.M = m?[...m]:[];
    }
}

var CM = [];
CM.push(
    new MRCM(600,600,
        new Matrix(0,0,0,.27,.5,0,.02),
        new Matrix(-.139,.263,.246,.224,.57,-.036,.15),
        new Matrix(.17,-.215,.222,.176,.408,.0893,.13),
        new Matrix(.781,.034,-.032,.739,.1075,.27,.7)
    )
);

var MATRIX = [];
{
    let w = 600,
        h = 600;

    MATRIX[0]    = new Array();
    MATRIX[0][0] = new Matrix(0,0,0,.27,.5*w,0*h,.02);
    MATRIX[0][1] = new Matrix(-.139,.263,.246,.224,.57*w,-.036*h,.15);
    MATRIX[0][2] = new Matrix(.17,-.215,.222,.176,.408*w,.0893*h,.13);
    MATRIX[0][3] = new Matrix(.781,.034,-.032,.739,.1075*w,.27*h,.7);


    MATRIX[1]    = new Array();
    MATRIX[1][0] = new Matrix(.5,0,0,.5,0,h-.5*h,.333);
    MATRIX[1][1] = new Matrix(.5,0,0,.5,0,0,.333);
    MATRIX[1][2] = new Matrix(.5,0,0,.5,.5*w,h-.5*h,.334);

    MATRIX[2]    = new Array();
    MATRIX[2][0] = new Matrix(0,-.5,.5,0,.5*w,0,.333);
    MATRIX[2][1] = new Matrix(0,.5,-.5,0,.5*w,.5*w,.333);
    MATRIX[2][2] = new Matrix(.5,0,0,.5,.25*w,.5*w,.334);

    MATRIX[3]    = new Array();
    MATRIX[3][0] = new Matrix(0,.577,-.577,0,.0951*w,.5893*w,.333);
    MATRIX[3][1] = new Matrix(0,.577,-.577,0,.4413*w,.7893*w,.333);
    MATRIX[3][2] = new Matrix(0,.577,-.577,0,.0952*w,.9893*w,.334);

    MATRIX[4]    = new Array();
    MATRIX[4][0] = new Matrix(.333,0,0,.333,.333*w,.666*w,.2); // magenta
    MATRIX[4][1] = new Matrix(0,.333,1,0,.666*w,0*w,.4); //  blueish
    MATRIX[4][2] = new Matrix(0,-.333,1,0,.333*w,0*w,.4); // greenish

    MATRIX[5]    = new Array();
    MATRIX[5][0] = new Matrix(.387,.430,.430,-.387,.2560*w,.522*w,.333); //magenta
    MATRIX[5][1] = new Matrix(.441,-.091,-.009,-.322,.4219*w,.5059*w,.333); //blueish
    MATRIX[5][2] = new Matrix(-.468,.020,-.113,.015,.4*w,.4*w,.334); // greenish

    MATRIX[6]    = new Array();
    MATRIX[6][0] = new Matrix(.255,0,0,.255,.3726*w,.6714*w,.16);
    MATRIX[6][1] = new Matrix(.255,0,0,.255,.1146*w,.2232*w,.16);
    MATRIX[6][2] = new Matrix(.255,0,0,.255,.6306*w,.2232*w,.16);
    MATRIX[6][3] = new Matrix(.37,-.642,.642,.37,.6356*w,-.0061*w,.52); // purple

    MATRIX[7]    = new Array();
    MATRIX[7][0] = new Matrix(.382,0,0,.382,.3072*w,.619*w,.2);
    MATRIX[7][1] = new Matrix(.382,0,0,.382,.6033*w,.4044*w,.2);
    MATRIX[7][2] = new Matrix(.382,0,0,.382,.0139*w,.4044*w,.2);
    MATRIX[7][3] = new Matrix(.382,0,0,.382,.1253*w,.0595*w,.2);
    MATRIX[7][4] = new Matrix(.382,0,0,.382,.4920*w,.0595*w,.2); // limegreen

    MATRIX[8]    = new Array();
    MATRIX[8][0] = new Matrix(.195,-.488,.344,.443,.4431*w,.2452*w,.2);
    MATRIX[8][1] = new Matrix(.462,.414,-.252,.361,.2511*w,.5692*w,.2);
    MATRIX[8][2] = new Matrix(-.058,-.07,.453,-.111,.5976*w,.0969*w,.2);
    MATRIX[8][3] = new Matrix(-.035,.07,-.469,-.022,.4884*w,.5069*w,.2);
    MATRIX[8][4] = new Matrix(-.637,0,0,.501,.8562*w,.2513*w,.2);

    MATRIX[9]    = new Array();
    MATRIX[9][0] = new Matrix(.849,.037,-.037,.849,.075*w,.183*w,.70);
    MATRIX[9][1] = new Matrix(.197,-.226,.226,.197,.4*w,.049*w,.13);
    MATRIX[9][2] = new Matrix(-.15,.283,.26,.237,.575*w,-.084*w,.13);
    MATRIX[9][3] = new Matrix(0,0,0,.16,.5*w,0*w,.04);

    MATRIX[10]    = new Array();
    MATRIX[10][0] = new Matrix(.849,.137,-.037,.849,.075*w,.183*w,.70);
    MATRIX[10][1] = new Matrix(.197,-.226,.226,.197,.4*w,.049*w,.13);
    MATRIX[10][2] = new Matrix(-.15,.283,.46,.237,.575*w,-.084*w,.13);
    MATRIX[10][3] = new Matrix(0,0,0,.16,.5*w,0*w,.04);

    MATRIX[11]    = new Array();
    MATRIX[11][0] = new Matrix(.387,.430,.430,-.387,.2560*w,.522*w,.333); //magenta
    MATRIX[11][1] = new Matrix(.441,-.091,-.109,-.322,.4219*w,.5059*w,.333); //blueish
    MATRIX[11][2] = new Matrix(-.468,.020,-.113,.015,.4*w,.4*w,.334); // greenish

    MATRIX[12]    = new Array();
    MATRIX[12][0] = new Matrix(.5,0,0,-.5,.5*w,.5*h,.333);
    MATRIX[12][1] = new Matrix(.5,0,0,-.5,0,h,.333);
    MATRIX[12][2] = new Matrix(.5,0,0,-.5,.5*w,h,.334);

    MATRIX[13]    = new Array();
    MATRIX[13][0] = new Matrix(0,-.6,-.6,0,0,0,.333);
    MATRIX[13][1] = new Matrix(0,-.5,-.5,0,0,.5*h,.333);
    MATRIX[13][2] = new Matrix(0,-.5,-.5,0,.5*w,.5*h,.334);

    MATRIX[14]    = new Array();
    MATRIX[14][0] = new Matrix(.5,0,0,.5,.5*w,0,.333);
    MATRIX[14][1] = new Matrix(.5,0,0,.5,0,.5*h,.333);
    MATRIX[14][2] = new Matrix(.5,0,0,.5,.5*w,.5*h,.334);

    MATRIX[15]    = new Array();
    MATRIX[15][0] = new Matrix(.849,.037,-.037,.849,.075*w,.1830*h,.7);
    MATRIX[15][1] = new Matrix(.197, .226,-.226,.197,.400*w,.0490*h,.13);
    MATRIX[15][2] = new Matrix(-.150,.283,.260,.237,.575*w,-.084*h,.15);
    MATRIX[15][3] = new Matrix(0,0,0,.16,.5*w,0*h,.02);

    let ww = 300;
    let hh = 500;
    MATRIX[16]    = new Array();
    MATRIX[16][0] = new Matrix(.849,.037,-.037,.849,(0.5*ww-.075*ww),-.01*hh,.7);
    MATRIX[16][1] = new Matrix(.197, -.226,.226,.197,.320*ww,hh-.1550*hh,.13);
    MATRIX[16][2] = new Matrix(-.150,-.283,-.260,.237,ww+.3*ww,hh-.164*hh,.15);
    MATRIX[16][3] = new Matrix(0,0,0,.16,.5*ww,0*hh,.02);

}