/*  Queue functions to run once in the future.

    Queue offers unique features for precision animations
    which might need to adjust their run interval at
    every invocation. 

    QueueItem offers the necessary data model required,
    see below.

    Minimum example of use:
   
    var myQueue = new Queue();
    setInterval(() => {myQueue.run()},10)

    Alternative self start:
    var myQueue = new Queue();
    myQueue.start(myQueue,10);

    Using the alternative you can then stop Queue.run()
    myQueue.stop();

    You can flush the queue of items and/or priority items:
    myQueue.flush();
    myQueue.flushPriority();
    myQueue.flushAll();

    Note flushing the queue could best be used within the
    function which queues multiple items (like in a transaction)
    and must roll back the queued work. After any function
    which queues items returns, there is no guarantee these items
    will still be in the queue in a separate function call.

    Queues are easy to setup and destroy, so it might be better
    to just create a new queue, add items and then run() the queue.
    After this the items have been moved to the main javascript queue.
   


   For more control over animations, look at
   schedule-function.js in this directory.

 */

class Queue {
    #items = [];
    #priority = [];

    constructor() {
        this.numItems = 0;
        this.numProcessed = 0;
        this.numQueued = 0;
        this.intervalId = null;
        this.running = false;
    }
    add (item) {
        this.numItems++;
        return this.#items.push(item)
    }
    addPriority (item) {
        this.numItems++;
        return this.#priority.push(item)
    }
    start (me, interval) {
        if (me === this) {
            this.intervalId = setInterval(() => {me.run()},interval)
            this.running = true;
        }
        return this.intervalId;
    }
    stop () {
        clearInterval(this.intervalId)
        this.intervalId = null;
        this.running = false;
    }
    run () {
        let len = this.#priority.length;
        let item;
        if (len) {
            for (let i = 0;i<len;i++) {
                item = this.#priority[i]
                setTimeout(item.func,0,item.data)
                this.numProcessed++
            }
        }
        this.#priority = [];
        len = this.#items.length;
        if (len) {
            for (let i=0;i<len;i++) {
                item = this.#items[i];
                setTimeout(item.func,item.timeout,item.data)
                this.numProcessed++
            }
        }
        this.#items = [];
        this.numItems = 0;
    }
    getItemCount () {
        return (this.#items.length + this.#priority.length)
    }
    flush () {
        this.#items = [];
    }
    flushPriority () {
        this.#priority = [];
    }
    flushAll () {
        this.flush();
        this.flushPriority();
    }
}

/* 
    Queue == noun 
    QueueItem == Add Item to Queue
 */

/*
    Add an item to a Queue 
    queue = refernce to Queue
    func = function reference
    timeout = minimum time in future to run func
    data = javascript object, user defined
    priorityP = if true item is added to the
        queue's priority list and will be run prior
        to non-priority items. 

 */

class QueueItem {

    constructor(queue,func,timeout,data,priorityP) {
        this.queue = queue;
        this.func = func;
        this.timeout = timeout;
        this.data = data;
        this.data.queue = queue;

        if (priorityP) {
            this.priorityP = true;
            queue.addPriority(this)
        }
        else {
            this.priorityP = false;
            queue.add(this)
        }
    }
}