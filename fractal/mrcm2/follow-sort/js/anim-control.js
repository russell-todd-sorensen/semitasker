
class AnimControl {
    vis;
    #queue;
    #queueInterval;
    steps;
    firstStep;
    lastStep;
    animMap = new Map();
    current = {next:0,prev:null};
    constructor(vis) {
        this.vis=vis;
    }
    next() {
        let stepToExec = this.current.next,
            nextText;
        if (stepToExec === null) {
            return `${this.current.prev},+`;
        }
        this.vis.animateDataSwap(...this.steps[stepToExec]);
        this.current.prev = stepToExec;
        if (stepToExec < this.lastStep) {
            this.current.next++;
            nextText = this.current.next;
        } else {
            this.current.next=null
            nextText = "+"
        }
        return `${this.current.prev},${nextText}`;
    }
    prev() {
        let stepToExec = this.current.prev,
            prevText;
        if (stepToExec === null) {
            return `-,${this.current.next}`;
        }
        this.vis.animateDataSwap(...this.steps[stepToExec]);
        this.current.next = stepToExec;
        if (stepToExec > this.firstStep) {
            this.current.prev--;
            prevText = this.current.prev;
        } else {
            this.current.prev=null
            prevText = "-"
        }
        //return this.current.prev;
        return `${prevText},${this.current.next}`
    }
    init(containerId) {
        this.vis.setupGrid(containerId);
        this.createSwaps();
    }
    initQueue(containerId,animData=null) {
        this.init(containerId);
        if (animData === null) {
            return;
        }
        this.animData = Object.assign(
            {
                events:[
                    {
                        name:"prev",eventTargetId:"prevButton",eventName:"click",timeout:this.vis.timeout,target:null,
                    },
                    {
                        name:"next",eventTargetId:"nextButton",eventName:"click",timeout:this.vis.timeout,target:null,
                    }
                ],
                timeout:this.vis.timeout,
            },animData);
        let len = this.animData.events.length;
        for (let i=0;i<len;i++) {
            let evtData = this.animData.events[i];
            evtData.target = document.getElementById(evtData.eventTargetId);
            this.animMap.set(evtData.name,evtData);
        }
        this.#queue = new Queue();
    }
    runStep(itemData) {
        let data = itemData.data,
            evtData = data.animMap.get(itemData.eventName),
            evt = new Event(evtData.eventName);
        evtData.target.dispatchEvent(evt);
        if (data.current[itemData.eventName] == null) {
            data.#queue.stop();
        } else {
            data.makeQueueItem(itemData.eventName,evtData.timeout);
        }
    }
    makeQueueItem(eventName,timeout) {
        let queueItem = new QueueItem(
            this.#queue,
            this.runStep,
            timeout,
            {eventName:eventName,data:this},
            false
        );
    }
    startQueue() {
        this.makeQueueItem("next",this.animData.timeout);
        this.#queue.start(this.#queue,this.animData.timeout);
    }
    createSwaps() {
        let shuffleInfo = shuffleRange(parseInt(this.vis.getItemCount()),1);
        this.steps = shuffleInfo.steps;
        this.stepCount = this.steps.length;
        this.final = shuffleInfo.final;
        this.firstStep = 0;
        this.lastStep = this.stepCount-1;
        this.current = {next:0,prev:null};
    }
    createSortSwaps() {
        let currentMap = [];
        let sortInfo = followSortSwaps(this.final);
    }
}
