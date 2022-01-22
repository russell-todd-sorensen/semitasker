
class Matrix {
    a;ap;
    b;bp;
    c;cp;
    d;dp;
    e;
    f;
    p;
    q;
    r;
    s;
    φ = 0.0;
    ψ = 0.0;
    pctEst = 0;
    pct;
    contraction;

    constructor(a, b, c, d, e, f, pct) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        this.pct = pct;
        this.p = this.a * this.a + this.b * this.b + this.c * this.c + this.d * this.d;
        this.q = Math.pow(this.a * this.d - this.b * this.c, 2);
        this.r = Math.sqrt(this.a * this.a + this.c * this.c);
        this.s = Math.sqrt(this.b * this.b + this.d * this.d);
        this.contraction = Math.sqrt((this.p
            + Math.sqrt(this.p * this.p - 4 * this.q)) / 2);

        if (this.a != 0 && this.r != 0) {
            this.φ = Math.acos(this.a / this.r);
        }
        else if (this.c != 0 && this.r != 0) {
            this.φ = Math.asin(this.c / this.r);
        }
        if (this.b != 0 && this.s != 0) {
            this.ψ = Math.asin(-this.b / this.s);
        }
        else if (this.d != 0 && this.s != 0) {
            this.ψ = Math.acos(this.d / this.s); // changing to 
        }
        // check following formulas again:
        this.ap = this.r * Math.cos(-this.φ);
        this.bp = -this.s * Math.sin(-this.ψ);
        this.cp = this.r * Math.sin(-this.φ);
        this.dp = this.s * Math.cos(-this.ψ);
    }
    invX(denom) {
        let numer = (-this.e * (this.d - 1) + this.b * this.f);

        if (denom != 0) {
            return (numer/denom);
        } else {
            return Infinity;
        }
    }
    invY(denom) {
        let numer =  (-this.f * (this.a - 1) + this.c * this.e);

        if (denom != 0) {
            return (numer/denom);
        } else {
            return Infinity;
        }
    }
    invariant() {
        let denom = ((this.a - 1) * (this.d - 1) - this.b * this.c);
        if (Math.abs(denom) <= Number.EPSILON) {
            return {x:Infinity,y:Infinity,e:true}
        } 
        return {
            x:this.invX(denom),
            y:this.invY(denom),
            e:false,
        };
    };
    transformPoint(x, y) {
        return {
            x: this.a * x + this.b * y + this.e,
            y: this.c * x + this.d * y + this.f,
        };
    };
    toString() {
        return 'a=' + this.a + ' b=' + this.b + ' c=' + this.c
            + ' d=' + this.d + ' e=' + this.e + ' f=' + this.f
            + ' r=' + this.r + ' s=' + this.s + ' φ=' + this.φ
            + ' ψ=' + this.ψ;
    }
    toMatrix() {
        return 'matrix(' + this.a + ' ' + this.b + ' ' + this.c
            + ' ' + this.d + ' ' + ((this.e)) + ' ' + ((this.f)) + ')';
    }
    toMatrixP() {
        return 'matrix(' + this.ap + ' ' + this.bp + ' ' + this.cp
            + ' ' + this.dp + ' ' + this.e + ' ' + this.f + ')';
    }
    toPath() {
        var path = 'M ';
        var inv = { x: this.invariant.x(), y: this.invariant.y() };
        var point;
        // 0 0
        point = this.transformPoint(0, 0);
        path += point.x + ' ' + point.y;
        point = this.transformPoint(600, 0);
        path += ' L ' + point.x + ' ' + point.y;
        point = this.transformPoint(600, 600);
        path += ' L ' + point.x + ' ' + point.y;
        point = this.transformPoint(600, 0);
        path += ' L ' + point.x + ' ' + point.y;
        path += ' Z';
        return path;
    }
    toPolygonPoints() {
        let path = '',
            inv = this.invariant(),
            point0,
            point;
        // 0 0
        point0 = this.transformPoint(0, 0);
        path += point0.x + ' ' + point0.y;
        point = this.transformPoint(600, 0);
        path += ', ' + point.x + ' ' + point.y;
        point = this.transformPoint(600, 600);
        path += ', ' + point.x + ' ' + point.y;
        point = this.transformPoint(0, 600);
        path += ', ' + point.x  + ' ' + point.y;
        path += ', ' + point0.x + ' ' + point0.y;

        return path;
    }
}

class MRCM {
    w = 1.0;
    h = 1.0;
    cmId;
    desc;
    Mnorm = [];
    M = [];
    constructor(w,h,cmId,desc,...m) {
        this.w=w?w:1.0; //w != 0
        this.h=h?h:1.0; //h != 0
        this.cmId=cmId;
        this.desc=desc?desc:`MRCM-${cmId}`;
        for (let i=0,matrix;i<m.length;i++) {
            this.Mnorm[i]=m[i];
            this.M[i] = new Matrix(
                m[i].a*1,
                m[i].b*1,
                m[i].c*1,
                m[i].d*1,
                m[i].e*this.w,
                m[i].f*this.h,
                m[i].pct*1
            )
        }
    }
}

var CM = [];
CM.push(
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Leaf`,
        {a:0,b:0,c:0,d:.27,e:.5,f:0,pct:.02},
        {a:-.139,b:.263,c:.246,d:.224,e:.57,f:-.036,pct:.15},
        {a:.17,b:-.215,c:.222,d:.176,e:.408,f:.0893,pct:.13},
        {a:.781,b:.034,c:-.032,d:.739,e:.1075,f:.27,pct:.7},
    )
);
CM.push(
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Sierpinski Gasket`,
        {a:.5,b:0,c:0,d:.5,e:0,f:.5,pct:.333},
        {a:.5,b:0,c:0,d:.5,e:0,f:0,pct:.333},
        {a:.5,b:0,c:0,d:.5,e:.5,f:.5,pct:.334},
    )
);
CM.push(
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: SG2`,
        {a:0,b:-0.5,c:.5,d:0,e:.5,f:0,pct:.333},
        {a:0,b:0.5,c:-.5,d:0,e:.5,f:.5,pct:.333},
        {a:.5,b:0,c:0,d:.5,e:.25,f:.5,pct:.334},
    )
);

CM.push(
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Fractal Blob`,
        {a:0,b:.577,c:-.577,d:0,e:.0951,f:.5893,pct:.333},
        {a:0,b:.577,c:-.577,d:0,e:.4413,f:.7893,pct:.333},
        {a:0,b:.577,c:-.577,d:0,e:.0952,f:.9893,pct:.334},
    )
);

CM.push(
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Sierpinski Maze`,
        {a:.333,b:0,c:0,d:.333,e:.333,f:.666,pct:.2},
        {a:0,b:.333,c:1,d:0,e:.666,f:0,pct:.4},
        {a:0,b:-.333,c:1,d:0,e:.333,f:0,pct:.4},
    )
);

CM.push(
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Twig`,
    {a:.387,b:.430,c:.430,d:-.387,e:.2560,f:.522,pct:.333},
    {a:0.441,b:-.091,c:-.009,d:-.322,e:.4219,f:.5059,pct:.333},
    {a:-.468,b:.020,c:-.113,d:.015,e:.4,f:.4,pct:.334},
    )
);

CM.push(
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Snowflake`,
    {a:0.255,b:0,c:0,d:.255,e:.3726,f:.6714,pct:.16},
    {a:0.255,b:0,c:0,d:.255,e:.1146,f:.2232,pct:.16},
    {a:0.255,b:0,c:0,d:.255,e:.6306,f:.2232,pct:.16},
    {a:0.37,b:-.642,c:.642,d:.37,e:.6356,f:-.0061,pct:.52},
    )
);

CM.push(
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Pentagons`,
        {a:0.382,b:0,c:0,d:.382,e:.3072,f:.619,pct:.2},
        {a:0.382,b:0,c:0,d:.382,e:.6033,f:.4044,pct:.2},
        {a:0.382,b:0,c:0,d:.382,e:.0139,f:.4044,pct:.2},
        {a:0.382,b:0,c:0,d:.382,e:.1253,f:.0595,pct:.2},
        {a:0.382,b:0,c:0,d:.382,e:.4920,f:.0595,pct:.2},
    )
);

CM.push(
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Tree`,
        {a:0.195,b:-.488,c:.344,d:.443,e:.4431,f:.2452,pct:.2},
        {a:0.462,b:.414,c:-.252,d:.361,e:.2511,f:.5692,pct:.2},
        {a:-.058,b:-.07,c:.453,d:-.111,e:.5976,f:.0969,pct:.2},
        {a:-.035,b:.07,c:-.469,d:-.022,e:.4884,f:.5069,pct:.2},
        {a:-.637,b:0,c:0,d:.501,e:.8562,f:.2513,pct:.2},
    )
);

CM.push(
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Leaf2`,
        {a:0.849,b:.037,c:-.037,d:.849,e:.075,f:.183,pct:.70},
        {a:0.197,b:-.226,c:.226,d:.197,e:.4,f:.049,pct:.13},
        {a:-0.15,b:.283,c:.26,d:.237,e:.575,f:-.084,pct:.13},
        {a:0,b:0,c:0,d:.16,e:.5,f:0,pct:.04},
    )
);

CM.push(  // Matrix ..: Squares1
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Squares1`,
        {a:.5,b:0,c:0,d:.5,e:0,f:.5,pct:.333333},
        {a:.5,b:0,c:0,d:.5,e:0,f:0,pct:.333333},
        {a:.5,b:0,c:0,d:.5,e:.5,f:.5,pct:.333334},
    )
);
CM.push(  // Matrix ..: Squares2
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Squares2`,
        {a:.5,b:0,c:0,d:.5,e:0,f:0,pct:.333333},  // V1(x,y) = (x/2,y/2)
        {a:.5,b:0,c:0,d:.5,e:.5,f:0,pct:.333334}, // V2(x,y) = ((x+1)/2,y/2)
        {a:.5,b:0,c:0,d:.5,e:0,f:.5,pct:.333333}, // V3(x,y) = (x/2,(y+1)/2)
    )
);

CM.push(  // Matrix ..: Squares3
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Squares3`,
        {a:.5,b:0,c:0,d:.5,e:0,f:.5,pct:.333333},
        {a:.5,b:0,c:0,d:.5,e:.25,f:0,pct:.333333},
        {a:.5,b:0,c:0,d:.5,e:.5,f:.5,pct:.333334},
    )
);
CM.push( // Matrix ..: Sierpinski Carpet
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Sierpinski Carpet`,
     {a:1/3,b:0,c:0,d:1/3,e:0,f:0,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:1/3,f:0,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:2/3,f:0,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:0,f:1/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:2/3,f:1/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:0,f:2/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:1/3,f:2/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:2/3,f:2/3,pct:1/8},
    )
);
CM.push( // Matrix ..: Sierpinski Carpet 2
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Sierpinski Carpet 2`,
     {a:1/3,b:0,c:0,d:1/3,e:0,f:0,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:1/3,f:0,pct:1/8},
     {a:1/4,b:0,c:0,d:1/4,e:3/5,f:1/5,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:0,f:1/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:2/3,f:1/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:0,f:2/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:1/3,f:2/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:2/3,f:2/3,pct:1/8},
    )
);
CM.push( // Matrix 15: Sierpinski Carpet 3
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Sierpinski Carpet 3`,
     {a:0,b:1/3,c:1/3,d:0,e:-1,f:0,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:1/3,f:0,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:2/3,f:0,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:0,f:1/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:2/3,f:1/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:0,f:2/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:1/3,f:2/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:2/3,f:2/3,pct:1/8},
    )
);
CM.push( // Matrix ..: Sierpinski Carpet 4
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Sierpinski Carpet 4`,
     {a:0,b:1/3,c:1/3,d:0,e:-1,f:-1,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:1/3,f:0,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:2/3,f:0,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:0,f:1/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:2/3,f:1/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:0,f:2/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:1/3,f:2/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:2/3,f:2/3,pct:1/8},
    )
);
CM.push( // Matrix ..: Sierpinski Carpet 5
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Sierpinski Carpet 5`,
     {a:0,b:1/3,c:1/3,d:0,e:-1/3,f:-1/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:1/3,f:0,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:2/3,f:0,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:0,f:1/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:2/3,f:1/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:0,f:2/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:1/3,f:2/3,pct:1/8},
     {a:1/3,b:0,c:0,d:1/3,e:2/3,f:2/3,pct:1/8},
    )
);
//{a:0,b:1,c:-1,d:0,e:1,f:0,pct:1.0000}
//{a:1/3,b:0,c:0,d:1/3,e:0,f:0,pct:1/8},

CM.push(
    new MRCM(600,600,CM.length,`Matrix ${CM.length}: Fractal Line?`,
        {a:.5,b:0,c:0,d:.5,e:0,f:.5,pct:1/3},
        {a:.5,b:0,c:0,d:.5,e:1,f:0,pct:1/3},
        {a:.1,b:0,c:0,d:.1,e:1/2,f:1/2,pct:1/3},
    )
);