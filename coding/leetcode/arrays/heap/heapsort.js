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

class HeapEntry {
    constructor (apos, b, sum) {
        this.apos = (apos?apos:0);
        this.b = (b?b:0);
        this.sum = (sum?sum:0);
        return this;
    }
}

class Heap {

    heap = [];
    entries = 0;
    failedAt = -1; // result of verify();

    constructor () {
        this.heap[0] = new HeapEntry(0,0,0);
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

        this.history[this.history.length] = this.heap;

        let q;
        var p;

        q = j;

        p = q<<1;

        while (p < n) {
            if (this.heap[p + 1].sum < this.heap[p].sum) {
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
        while ((q > j) && (this.heap[0].sum < this.heap[p].sum)) {
            this.heap[q] = this.heap[p];
            q = p;
            p = q>>1
        }
        this.heap[q] = this.heap[0];
    }
    // init is used to fix heap prior to removing entries
    init() {
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
        this.failedAt = -1;
        let max = Math.floor(n/2);
        let i = 1;
        let pass = true;
        let val;
        while (i<=max && pass) {
            val = this.peek(i).sum
            if (val > this.peek(i*2).sum) {
                pass = false;
            }
            if (i<max && val > this.peek(i*2+1).sum) {
                pass = false
            }
            i++
        }
        if (!pass) {
            this.failedAt = (i - 1);
        }
        return pass
    }
    push(entry) { // remove the 0th element and push on two copies
        this.heap.shift()
        this.heap.unshift(entry);
        this.heap.unshift(entry);
        this.entries++;
        this.permute(1,this.entries)
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
}


// makeHeap creates a heap with a possibly incorrect internal rep,
// or an intermediate rep for testing/debugging algorithm:
function makeHeap (arr) {
    var h = new Heap();
    h.heap = []
    for (let i = 0;i<arr.length;i++) {
        h.heap.push(new HeapEntry(i,i,arr[i]));
        h.entries++
    }
    h.entries--
    return h
}

//$$$$$$$$$$$$$$$$$ GENERIC HEAPENTRIES $$$$$$$$$$$$$$$$$$$$$$$$$$//

