#! /web/servers/ns/bin/tclsh8.7

set input [read stdin]

set output [string map {\n "" \r "" < %3c > %3e # %23 - %2d % %25} $input]

puts stdout "data:image/svg+xml;utf8,$output"