
class Matrix {
    constructor(a, b, c, d, e, f, pct) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        this.invariant = {
            x: function () {
                return -this.e * (this.d - 1) + this.b * this.f
                    / ((this.a - 1) * (this.d - 1) - this.b * this.c);
            },
            y: function () {
                return -this.f * (this.a - 1) + this.c * this.e
                    / ((this.a - 1) * (this.d - 1) - this.b * this.c);
            }
        };
        this.transformPoint = function (x, y) {
            return {
                x: this.a * x + this.b * y + this.e,
                y: this.c * x + this.d * y + this.f,
            };
        };
        this.r = Math.sqrt(this.a * this.a + this.c * this.c);
        this.s = Math.sqrt(this.b * this.b + this.d * this.d);
        this.φ = 0.0;
        this.ψ = 0.0;
        if (this.a != 0 && this.r != 0) {
            this.φ = Math.acos(this.a / this.r);
        }
        else if (this.c != 0 && this.r != 0) {
            this.φ = Math.asin(this.c / this.r);
        }
        if (this.b != 0 && this.s != 0) {
            this.ψ = Math.asin(-this.b / this.s);
        }
        else if (this.c != 0 && this.s != 0) {
            this.ψ = Math.acos(this.d / this.s);
        }
        this.ap = this.r * Math.cos(-this.φ);
        this.bp = -this.s * Math.sin(-this.ψ);
        this.cp = this.r * Math.sin(-this.φ);
        this.dp = this.s * Math.cos(-this.ψ);
        this.pct = pct;
        this.pctEst = 0;
        this.p = this.a * this.a + this.b * this.b + this.c * this.c + this.d * this.d;
        this.q = Math.pow(this.a * this.d - this.b * this.c, 2);
        this.contraction = Math.sqrt((this.p
            + Math.sqrt(this.p * this.p - 4 * this.q)) / 2);
        this.toString = function () {
            return 'a=' + this.a + ' b=' + this.b + ' c=' + this.c
                + ' d=' + this.d + ' e=' + this.e + ' f=' + this.f
                + ' r=' + this.r + ' s=' + this.s + ' φ=' + this.φ
                + ' ψ=' + this.ψ;
        };
        this.toMatrix = function () {
            return 'matrix(' + this.a + ' ' + this.b + ' ' + this.c
                + ' ' + this.d + ' ' + ((this.e)) + ' ' + ((this.f)) + ')';
        };
        this.toMatrixP = function () {
            return 'matrix(' + this.ap + ' ' + this.bp + ' ' + this.cp
                + ' ' + this.dp + ' ' + this.e + ' ' + this.f + ')';
        };
        this.toPath = function () {
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
        };
        this.toPolygonPoints = function () {
            var path = '';
            var inv = { x: this.invariant.x(), y: this.invariant.y() };
            var point0, point;
            // 0 0
            point0 = this.transformPoint(0, 0);
            path += point0.x + ' ' + point0.y;
            point = this.transformPoint(600, 0);
            path += ', ' + point.x + ' ' + point.y;
            point = this.transformPoint(600, 600);
            path += ', ' + point.x + ' ' + point.y;
            point = this.transformPoint(0, 600);
            path += ', ' + point.x + ' ' + point.y;
            path += ', ' + point0.x + ' ' + point0.y;
            return path;
        };
        return this;
    }
}

