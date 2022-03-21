# options
-l 0 ;# never wrap long lines.

-E, -r, or --regexp-extended ;# uses see egrep

'-s'
'--separate'
     By default, 'sed' will consider the files specified on the command
     line as a single continuous long stream.  This GNU 'sed' extension
     allows the user to consider them as separate files: range addresses
     (such as '/abc/,/def/') are not allowed to span several files, line
     numbers are relative to the start of each file, '$' refers to the
     last line of each file, and files invoked from the 'R' commands are
     rewound at the start of each file.

'--sandbox'
     In sandbox mode, 'e/w/r' commands are rejected - programs
     containing them will be aborted without being run.  Sandbox mode
     ensures 'sed' operates only on the input files designated on the
     command line, and cannot run external programs.

   If no '-e', '-f', '--expression', or '--file' options are given on
the command-line, then the first non-option argument on the command line
is taken to be the SCRIPT to be executed.

   If any command-line parameters remain after processing the above,
these parameters are interpreted as the names of input files to be
processed.  A file name of '-' refers to the standard input stream.  The
standard input will be processed if no file names are specified.


An exit status of zero indicates success, and a nonzero value indicates
failure.  GNU 'sed' returns the following exit status error values:

0
     Successful completion.

1
     Invalid command, invalid syntax, invalid regular expression or a
     GNU 'sed' extension command used with '--posix'.

2
     One or more of the input file specified on the command line could
     not be opened (e.g.  if a file is not found, or read permission is
     denied).  Processing continued with other files.

4
     An I/O error, or a serious processing error during runtime, GNU
     'sed' aborted immediately.

   Additionally, the commands 'q' and 'Q' can be used to terminate 'sed'
with a custom exit code value (this is a GNU 'sed' extension):

     $ echo | sed 'Q42' ; echo $?
     42
