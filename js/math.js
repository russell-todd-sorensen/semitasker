
class Integer {
    constructor (int) {
        this.raw = int;
        this.sign = null;
        this.value = this.raw * this.getSign();
        this.exp = Math.trunc(Math.log10(this.value));
        this.factors;
        this.reduced;
        this.factorInteger();
        this.isPrime = (this.factors.length == 1 ? true : false);
    }
    getSign() {
        if (!this.sign) {
            this.sign = (this.raw < 0 ? -1 : 1)
        }
        return this.sign;
    };
    factorInteger() {
        this.factors = []
        this.reduced = this.value;
        for (let i=2;i<=this.reduced/2;i++) {
            let fac = {f:i,n:0}
            while (this.reduced % i == 0) {
                this.reduced /= i
                fac.n++
            }
            if (fac.n) this.factors.push(fac)
        }
        if (this.reduced > 1) {
            this.factors.push({f:this.reduced,n:1})
        }
    };
}

class Rational {
    constructor (numer, denom) {
        this.numer = new Integer(numer);
        this.denom = new Integer(denom);
        this.sign  = this.numer.sign * this.denom.sign;
        this.rnum  = null;
        this.rden  = null;
        this.numFact = null;
        this.denFact = null;
        this.rationalValue = null;
        this.factoredValue = null;
        this.reduce()
    }
    signString() {
        return (this.sign < 0 ? "-" : "")
    }
    reduce() {
        let nFactors = this.numer.factors;
        let dFactors = this.denom.factors;
        let nfact = [];
        let dfact = [];
        let redu = [];
        let r;
        let k = 0;
        let reduProd = 1;
        if (nFactors.length < dFactors.length) {
            for (let i = 0;i<dFactors.length && k<nFactors.length;i++) {
                let dpeek = dFactors[i]
                let npeek = nFactors[k]
                let df = dpeek.f
                let nf = npeek.f
                let dn = dpeek.n
                let nn = npeek.n
                if (df == nf) {
                    r = Math.min(dn,nn)
                    redu.push({f:df,n:r})
                    dFactors[i] = {f:df,n:dn-r}
                    nFactors[k] = {f:nf,n:nn-r}
                    k++
                } else 
                if (df > nf) {
                    k++
                    i--
                }
            }
        } else {
            for (let i = 0;i<nFactors.length && k < dFactors.length;i++) {
                let dpeek = dFactors[k]
                let npeek = nFactors[i]
                let df = dpeek.f
                let nf = npeek.f
                let dn = dpeek.n
                let nn = npeek.n
                if (df == nf) {
                    r = Math.min(dn,nn)
                    redu.push({f:df,n:r})
                    dFactors[k] = {f:df,n:dn-r}
                    nFactors[i] = {f:nf,n:nn-r}
                    k++
                } else
                if (nf > df) {
                    k++
                    i--
                }
            }
        }
    
        if (redu.length > 0) {
            for (let i = 0;i<redu.length;i++) {
                reduProd *= (redu[i].f**redu[i].n)
            }
            for (let i=0;i<nFactors.length;i++) {
                if (nFactors[i].n == 0) continue;
                nfact.push(nFactors[i])
            }
            for (let i=0;i<dFactors.length;i++) {
                if (dFactors[i].n == 0) continue;
                dfact.push(dFactors[i])
            }
        } else {
            nfact = nFactors;
            dfact = dFactors;
        }

        this.rnum = this.numer.value / reduProd
        this.rden = this.denom.value / reduProd
        if (this.rden == 1) {
            this.rationalValue = this.signString() + this.rnum
        } else {
            this.rationalValue = this.signString() + this.rnum + "/" + this.rden
        }
        this.factoredValue = "";
        let fl = []
        let nf = [];
        let df = [];
        for (let i = 0;i<nfact.length;i++) {
            nf = nfact[i]
            if (nf.n == 1) {
                fl[fl.length] = nf.f + ""
            } else {
                fl[fl.length] = nf.f + "<sup>" + nf.n + "</sup>"
            }
        }
        this.factoredValue = "" + this.signString() + fl.join("*")
        if (this.factoredValue == "-" || this.factoredValue == "") {
            this.factoredValue += "1"
        }
        if (dfact.length > 0 && dfact[dfact.length-1] != "1") {
            this.factoredValue += "/"
            fl = []
            for (let i = 0;i<dfact.length;i++) {
                df = dfact[i]
                if (df.n == 1) {
                    fl[fl.length] = df.f + ""
                } else {
                    fl[fl.length] = df.f + "<sup>" + df.n + "</sup>"
                }
            }
            this.factoredValue = this.factoredValue + fl.join("*")
        }

        this.numFact = nfact;
        this.denFact = dfact;
    }
}
