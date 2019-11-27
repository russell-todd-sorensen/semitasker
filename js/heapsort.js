/*

Origins of HeapSort implimentation: 
https://home.semitasker.com/coding/027-heaps/Enumerating%20Solutions.pdf

and the heapsort software, description and code:

https://cr.yp.to/sortedsums.html

struct heap_entry {
  int apos;
  int32 b;
  int64 sum;
} ;
*/
/* insert h[0], delete h[j] 

static inline void heap_permute(struct heap_entry *h,int j,int n)
{
    int p;
    int q;

    q = j;

    while ((p = q << 1) < n) {
        if (h[p + 1].sum < h[p].sum) ++p;
        h[q] = h[p]; q = p;
    }
    if (p == n) {
        h[q] = h[p]; q = p;
    }
    while ((q > j) && (h[0].sum < h[p = q >> 1].sum)) {
        h[q] = h[p]; q = p;
    }
    h[q] = h[0];
}
*/

/* simpleType box */
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

/* complex type box */
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

// This will sort from largest to smallest
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
    constructor (type) {
        this.entryType = type;
        //this.heap[0] = new this.entryType();
        this.add0(new this.entryType())
        return this;
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

        let q;
        var p;

        q = j;

        p = q<<1;

        while (p < n) {
            if (this.heap[p+1].lt(this.heap[p])) {
                ++p;
            }
            this.heap[q] = this.heap[p]
            q = p
            p = q<<1
        }
        if (p == n) {
            this.heap[q] = this.heap[p]
            q = p;
        }
        p = q>>1
        while ((q > j) && (this.heap[0].lt(this.heap[p]))) { 
            this.heap[q] = this.heap[p];
            q = p;
            p = q>>1
        }
        this.heap[q] = this.heap[0];
    }
    permuteZ (j,n,z) {

        let q;
        var p;

        q = j;

        p = q<<1;

        while (p < n) {
            if (this.heap[p+1].lt(this.heap[p])) {
                ++p;
            }
            this.heap[q] = this.heap[p]
            q = p
            p = q<<1
        }
        if (p == n) {
            this.heap[q] = this.heap[p]
            q = p;
        }
        p = q>>1
        while ((q > j) && (this.heap[0].lt(this.heap[p]))) {
            this.heap[q] = this.heap[p];
            q = p;
            p = q>>1
        }
        this.heap[q] = this.heap[z];
    }
    init(ver) {
        let n = this.getEntries();
        let j = Math.floor(n / 2) + 1;
        while (j > 1) {
            --j;
            this.add0(this.peek(j))
            this.permute(j,n)
        }
    }
    verify() {
        let n = this.getEntries();
        this.failedAt = [];
        let max = Math.floor(n/2);
        let i = 1;
        let pass = true;
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
    sort() { // This is like pop(), but stores reverse copy from n down to 1
        let len = 0 + this.entries;
        for (let i = 0;i<len;i++) {
            let tmp = this.heap[1]
            this.heap[0] = this.heap[this.entries]
            this.permute(1,this.entries)
            this.heap[this.entries] = tmp;
            this.entries--
        }
    }
}