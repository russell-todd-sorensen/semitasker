
/*  Fully functional heapsort-generic code, but with additional 
    diagnostic features.
*/


class SimpleType {
    constructor(val) {
        this.val = val;
        return this;
    }
    lt (b) {
        return (this.val < b.val)
    }
    value () {
        return this.val;
    }
}

class ComplexType {
    constructor(apos,b,sum) {
        this.apos = (apos?apos:0);
        this.b = (b?b:0);
        this.sum = (sum?sum:0);
        return this;
    }
    lt (b) {
        return (this.sum < b.sum)
    }
    value () {
        return this.sum;
    }
}

class CTReverse {
    constructor(apos,b,sum) {
        this.apos = (apos?apos:0);
        this.b = (b?b:0);
        this.sum = (sum?sum:0);
        return this;
    }
    lt (b) {
        return (this.sum > b.sum)
    }
    value () {
        return this.sum;
    }
}

class Heap {
    heap = [];
    entries = 0;
    ops = 0; // for counting O()
    history = [];
    failedAt = -1; // result of verify();
    constructor (type) {
        this.entryType = type;
        this.heap[0] = new this.entryType();
        return this;
    }
    lt (aIdx, bIdx) { // will use object at aIdx to compare with bIdx
        // not used
    }
    add (entry,pos) {
        let entryPos = (pos?pos:this.heap.length)
        this.heap[entryPos] = entry;
        if (entryPos > 0) {
            this.entries++
        }
        return entryPos;
    }
    add0 (entry) {
        this.heap[0] = entry;
    }
    get (pos) {
        if (pos && pos < 0) {
            return null;
        }
        let entryPos = (pos?pos:0)
        if (entryPos < this.heap.length) {
            return this.heap[entryPos]
        } else {
            return null;
        }
    }
    getEntries () {
        return this.entries;
    }
    permute (j,n) {

        this.history[this.history.length] = this.heap;

        let q;
        var p;

        q = j;

        p = q<<1;

        while (p < n) {
            this.ops++;
            /*if (this.heap[p + 1].sum < this.heap[p].sum) { */
            if (this.heap[p+1].lt(this.heap[p])) {
                ++p;
            }
            this.heap[q] = this.heap[p]
            q = p
            p = q<<1
        }
        if (p == n) {
            this.ops++;
            this.heap[q] = this.heap[p]
            q = p;
        }
        p = q>>1
        while ((q > j) && (this.ops++) && (this.heap[0].lt(this.heap[p]))) { 
            this.heap[q] = this.heap[p];
            q = p;
            p = q>>1
        }
        this.ops++;
        this.heap[q] = this.heap[0];
    }    
    permuteZ (j,n,z) {

        this.history[this.history.length] = this.heap;

        let q;
        var p;

        q = j;

        p = q<<1;

        while (p < n) {
            this.ops++;
            if (this.heap[p+1].lt(this.heap[p])) {
                ++p;
            }
            this.heap[q] = this.heap[p]
            q = p
            p = q<<1
        }
        if (p == n) {
            this.ops++;
            this.heap[q] = this.heap[p]
            q = p;
        }
        p = q>>1
        while ((q > j) && (this.ops++) && (this.heap[0].lt(this.heap[p]))) {
            this.heap[q] = this.heap[p];
            q = p;
            p = q>>1
        }
        this.ops++;
        this.heap[q] = this.heap[z];
    }
    init() {
        let n = this.getEntries();
        let j = Math.floor(n / 2) + 1;
        while (j > 1) {
            --j;
            this.add0(this.peek(j))
            this.permuteZ(j,n,0)
        }
    }
    verify() {
        let n = this.getEntries();
        this.failedAt = [];
        let max = Math.floor(n/2);
        let i = 1;
        let pass = true;
        let val;
        while (i<=max) {
            if ( (this.heap[i*2].lt(this.heap[i])) ) {
                this.failedAt.push({i:i,k:2*i})
                pass = false;
            }
            if ((i*2+1)<=n && (this.heap[i*2+1].lt(this.heap[i])) ) {
                this.failedAt.push({i:i,k:2*i+1})
                pass = false
            }
            i++
        }
        return pass
    }
    push(entry) { // remove the 0th element and push on two copies
        this.heap.shift()
        this.heap.unshift(entry);
        this.heap.unshift(entry);
        this.entries++;
        this.ops++;
        return this.heap;
    }
    peek(pos) {
        if (pos && pos<=this.entries) {
            return this.heap[pos]
        } else {
            return null;
        }
    }
    pop() {
        if (this.entries == 0) {
            return null;
        }
        let tmp = this.heap[1]
        this.heap[0] = this.heap[this.entries]
        this.heap[this.entries] = null;
        this.heap.pop(); //removed the unused element
        this.entries--
        if (this.entries > 0) {
            this.permute(1,this.entries)
        }
        return tmp;
    }
    sort() {
        let len = 0 + this.entries;
        for (let i = 0;i<len;i++) {
            let tmp = this.heap[1]
            this.heap[0] = this.heap[this.entries]
            this.permute(1,this.entries)
            this.heap[this.entries] = tmp;
            this.entries--
        }
    }
    getOps() {
        return this.ops;
    }
    resetOps() {
        let ops = this.ops;
        this.ops = 0;
        return ops;
    }
}

var snapshot = [];
var failedAt = [];
var ordered  = [];

function testHeapSort(n,min,max,verifyEachStep,exitOnFailure) {

    h = new Heap();
    let val;
    let verified = true;
    snapshot = [];
    ordered  = [];

    for (let i = 0;i<n;i++) {
        val = Math.ceil((Math.random()*(max-min))+min)
        h.push(new ComplexType(i,('b' + i), val))
        snapshot[snapshot.length] = h.heap.map(x => (x==null?0:x.sum))
        if (verifyEachStep) {
            verified = h.verify();
        }
        if (exitOnFailure && h.failedAt.length > 0) {
            return 
        }
    }

    console.log('Added n=' 
        + n + ', ops=' 
        + h.getOps() 
        + ', n*log2(n)=' 
        + (n * (Math.ceil(1000*Math.log2(n))/1000)));
    if (!verifyEachStep) {
        verified = h.verify();
    }

    if (!verified) {
        let failedNodes = "";
        let failedNode;
        for (let i=0;i<h.failedAt.length;i++) {
            failedNode = h.failedAt[i]
            failedNodes = failedNodes + "i="
            + failedNode.i + ", val="
            + h.get(failedNode.i).sum + ", k="
            + failedNode.k + ", val="
            + h.get(failedNode.k).sum + "; "
        }
        console.log("heap =[" + h.heap.map(x => (x==null?0:x.sum)).toString() + "]")
        console.log("Failed verification at " + failedNodes + " running init()")
        h.init();
    }

    verified = h.verify();

    if (!verified) {
        console.log("failed second verification at " + h.failedAt + " quitting.")
        return;
    }

    while (verified && h.getEntries() > 0) {
        snapshot[snapshot.length] = h.heap.map(x => (x==null?0:x.sum))
        ordered[ordered.length] = h.pop().sum
    }

    snapshot[snapshot.length] = h.heap.map(x => (x==null?0:x.sum))

    console.log('Added and Removed n=' 
        + n + ', ops=' 
        + h.getOps() 
        + ', 2*n*log2(n)=' 
        + (2 * n * Math.ceil(1000*Math.log2(n))/1000));

    console.log('[' + ordered.toString() + ']');

    let i = 0;
    let passed = true;
    let blurb = ""
    while (i < (n-1)) {
        if (ordered[i] > ordered[i+1]) {
            passed = false
            blurb = "ordered["+i+"]=''" + ordered[i] + "'' and ordered[" + (i+1) + "]=''" + ordered[i+1] + "'"
            break
        }
        i++
    }
    console.log("Popped values: " + passed + " " + blurb);
}

//var arr2 = [10, 23, 13, 31, 62, 30, 33, 116, 89, 107, 54, 111, 200, 135, 140, 132, 144, 133, 144, 177];
//var arrt = [111,111,19,40,40,46,41,118,48,120,46,63,120,170,198,76,140,151,194]

function makeHeap (arr) {
    var h = new Heap();
    h.heap = []
    for (let i = 0;i<arr.length;i++) {
        h.heap.push(new ComplexType(i,i,arr[i]));
        h.entries++
    }
    h.entries--
    return h
}

//var arr3 = [66,93,72,76,5,81,44,19,63,3,89,10,65,46,100,39,86,81,54,16]
//var h3 = new Heap(SimpleType);

function addEntries (h,arr) {
    let test = 0;
    for (let i = 0;i<arr.length;i++) {
        h.push(new ComplexType(i,'b'+i,arr[i]))
        test = i;
    }
    return h
}

function addEntriesReverse (h,arr) {
    let test = 0;
    for (let i = 0;i<arr.length;i++) {
        h.push(new CTReverse(i,'b'+i,arr[i]))
        test = i;
    }
    return h
}

function sumLogN(n) {
    let total = 0;
    for (let i=n;i>0;i--) {
        total += Math.log2(i)
    }
    return total;
}

function pushRandom(heap,n,min,max) {
    let h = heap;
    for (let i = 0;i<n;i++) {
        val = Math.ceil((Math.random()*(max-min))+min)
        h.push(new ComplexType(i,('b' + i), val))
    }
}

function pushRandomReverse(heap,n,min,max) {
    let h = heap;
    for (let i = 0;i<n;i++) {
        val = Math.ceil((Math.random()*(max-min))+min)
        h.push(new CTReverse(i,('b' + i), val))
    }
}
