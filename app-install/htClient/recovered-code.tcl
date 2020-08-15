Wow! Let me show you an example from my event driven http client.

This is the complicated state machine (called from [filevent $machine $client]):

proc ::htclient::statusMachine { client } {

    set state [getVar $client state]

    switch -exact -- $state {
        httpversion {
            htHTTPVersion $client
        }
        statuscode {
            htStatusCode $client
        }
        reasonphrase {
            htReasonPhrase $client
        }
        cleanup {
            log Debug "htCleanup $client"
            htCleanup $client
        }
        default {
            log Error "statusMachine: unknown state $state"
            htError $client
        }
    }
}

There are multiple state machines to handle various tasks (sending a
request vs. receiving a response vs. receiving a chunked response).
The idea is that different machines have different states to handle
different circumstances. Machines can share state code since all
macines and all state procs share the same interface (they take the
clientID) as a single argument.

Note that every state machine also share the final two states:
"cleanup" and "default".

Looking through this code:

<a href="http://junom.com/gitweb/gitweb.perl?p=htclient.git;a=blob;f=htclient.tcl" 
    rel="nofollow">http://junom.com/gitweb/gitweb.perl?p=htclient.git;a=blob;f=htclient.tcl</a>

I see exactly one use of [while], but it isn't used as a loop
construct. The only loop in the htclient code is provided by the event
loop. (There are a few [for] loops used to setup data). This is by
design: I needed a client that would work with a Tk application and
http::geturl switches channels to blocking mode when reading a chunk
encoded response...not good).

Anyway, I had thought I would need, or could use [yield] to handle a
difficult problem: how to keep large http requests (where the Tk
application uploads a large file) from freezing the application.

For instance here is my code for sending the request:

proc ::htclient::htSend { client } {

    set sock [getVar $client sock]

    puts -nonewline $sock [getVar $client request]

    flush $sock

    if {![htPending output $sock]} {
        log Debug "htSend sent '[getVar $client request]'"
        setVar $client state httpversion
    } else {
        log Debug "htSend still sending pending = [htPending input $sock]"
        setVar $client state sendwait
    }

    log Debug "htSend end state $client = [getVar $client state]"
}

I know those first three lines are complicated, and the following [if]
can be removed, since [chan pending] will always return 0 after [puts]
returns. The log statement is obviously not part of the control
structure, so we basically have a total of four lines of effective
code here...very complicated stuff.

Now here is what I did so that a large $request wouldn't take up too much time:

proc ::htclient::htSendChunk { client } {

    variable clientSendBufIndex

    set chunkSize 20
    set requestLength [getVar $client request-length]

    set lastChunk 0

    if {$clientSendBufIndex($client) + $chunkSize <= $requestLength} {
        set chunkEnd [expr {$clientSendBufIndex($client) + $chunkSize - 1}]
        set chunk [string range [getVar $client request] $clientSendBufIndex($client) $chunkEnd]
        set clientSendBufIndex($client) [expr {$chunkEnd +1}]
    } else {
        set chunkEnd end
        set chunk [string range [getVar $client request] $clientSendBufIndex($client) $chunkEnd]
        set clientSendBufIndex($client) $requestLength
        set lastChunk 1
    }

    set sock [getVar $client sock]

    puts -nonewline $sock $chunk

    flush $sock

    if {$lastChunk} {
        if {![htPending output $sock]} {
            log Debug "htSendChunk sent '[getVar $client request]'"
            setVar $client state httpversion
        } else {
            log Debug "htSendChunk still sending pending = [htPending input $sock]"
            setVar $client state sendwait
        }
    }

    log Debug "htSendChunk end state $client = [getVar $client state] chunkEnd = $chunkEnd"
    log Debug "htSendChunk sent: '$chunk'"
}

Basically just a little more complicated. I hard coded the "chunk"
size for testing 20 chars allows me to use small requests for testing
and see more than one invocation of the above code per request.

The new code just maintains an index into the $request and sends a
certain length chunk from this string. The last send, changes the
state.

I thought about this for a few hours before I realized that [yield]
would not help at all here.

I ran the head of the above code on a few urls, the code and log files are here:

What you see in the log files is five simultaneous requests/responses
(geturl does one at a time, no overlap). I used wish8.6 to source the
script file. You could write a Tk GUI which would allow you to click
on a current request and cancel it (by setting the state to "cleanup",
or executing htCleanup if no events are firing). htCleanup only
deletes state data and closes the socket, request/response still
exist. another procedure htEraseClient is used to free all resources.

This type of design would make much more sense with a POP
client/server since the conversation is considerably more complicated.

Please don't get the idea that I'm an event cheerleader: I use
AOLserver which uses threads, but I wrote htclient in an attempt to
understand events in Tcl.

Now I'm going to work on using coroutines to stop/start long running
computations (using a sudoku solver as the example ... the time to
solve some puzzles is many orders of magnitude higher than the typical
puzzle).


> In the view of various other people, dividing sequential logic into separate
> "sub-events" is a work-around for not having coroutines, and is harder to
> maintain.

It's called modular programming. The new NRE core follows this concept
(a little) by dividing a single command implementation into three
potentially reusable C functions.

> A more modular approach may involve an object storing the state, and the
> logic being split into different methods. The effect is the same: if you
> don't have coroutines, you may have to refactor your code to use events.

You can't handle I/O in Tcl without events, my htClient code proves
(it is still example code, but is large enough to demonstrate
capabilities) you don't need coroutines or complicated code to use
events.

That doesn't make coroutines any less interesting.

tom jackson

