Examples of Tcl Templating Tool <tic-tac-toe>:

.tcl  files =>  execute script then source template
.tmpl files =>  template files as written
.cmp  files =>  template files as compiled
.tcl~ files =>  shows source of .tcl files

You can view the source of all files except the .tcl files
 which execute. Use the .tcl~ to see the content of these
 files.

Variables and arguments have a limited form. Neither can 
 contain [, not even array variables, this is for safety.
 
Variable references must begin with a letter.

In a template file, there is a minimum need to use escapes.
 1. Dollar sign '$' only needs to be escaped if the following
    text matches a variable expression. $1.24 or $ don't 
    need to be escaped. 
 2. Square bracket '[' only needs to be escaped if the following
    text matches a command (see below). [file ...] would not need
    escaping since the [file] command is not a template command.

Command arguments are delimited as words (see Tcl) with the
 exception that no opening square bracket can be in the plain
 text of an argument. Variable values can contain square brackets,
 for example [regexp $pattern $string a b] where pattern could be:
 {[a-zA-Z]}. Since $pattern contains a square bracket, it can't
 be set in the .tmpl file, but must be created in the controller
 script.

Commands all have the form [command arg arg ... *], where * is either
 empty or /. The / slash indicates that any following whitespace
 be removed. Using just ], preserves whitespace.

The [ws] and [ws/] commands either terminate, start or continue 
 whitespace removal. 

The [comment arg ] or [comment arg /] commands allow a one arg,
 potentially multi-line comment:

[comment {this is a comment}] 

The [ws arg *] command is an additional method to comment.
 
The compiler is a syntax validating parser. When a syntax
 error is detected, the parser exits, leaving  behind a 
 partially compiled result. The result is easy to examine
 to determine the location of the syntax error.

The compiler can also be used at a command line. Type in
 the text of a template and see the result. 

The result of compiling a template is a Tcl script which can
 be sourced by a Tcl script which as set any required variable
 references. The result of sourcing a compiled template is 
 stored in a local variable __string. 

Compiler commands are in two broad categories:
 1. Those which return a value
 2. Those which don't return a vaule

Since some of the commands below have a dual mode in Tcl, only one mode
 is supported. Viewing a compiled template or typing in commands
 at a command line will quickly reveal which mode is used. 

In general, commands which transform data but leave variable values 
 unchanged print out using:
  append __string ...

Those commands which alter the value of a variable or are block commands
 such as [if]...[/if] and [foreach]...[/foreach] are printed as script
 level commands and don't append to __string.

Only commands which have distinctly different argument signatures have
 the potential to support both modes. One example is [set]
  [set a]   ==> prints 'append __string [set a]'
  [set a b] ==> prints 'set a b'

Currently [regexp] follows the second form. Although the signatures could
 be different enough to support both, [regexp] returning a 0/1 indication 
 is impossible to use, as it would need to be used as an argument, which
 cannot contain square brackets. 

The compiler currently has these commands:

[if]
 [elseif]..
 [else]
[/if]

[while]
[/while]

[foreach]
[/foreach]

[foreacharray]
[/foreacharray]

[continue]

[break]

[expr]

[set]

[incr]

[switch]
 [case] [/case]
[/switch]

[string]

[format]

[scan]

[join]

[regexp]
 
[lindex]

[lsearch]

[llength]

[lset]

[lrange]

[assign] (foreach varList dataList {break})

[mc] (::msgcat::mc)

[ws] (whitespace tool)



