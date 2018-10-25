set finiteMeasure 4
set finite True
set count 256
set r -0.5
set i 0.6028788370
#set r 1
#set i .5

set tempR $r
set tempI $i
set tempR2   [expr {$tempR*$tempR}]
set tempI2   [expr {$tempI*$tempI}]
set tempIbyR [expr {$tempR*$tempI}]
set tempI2pR2 [expr {$tempR2 + $tempI2}]
puts "count = $count tempR = $tempR, tempI = $tempI tempI2pR2 = $tempI2pR2"

while {$count > 0 && ($tempI2pR2 < $finiteMeasure)} {
    incr count -1
    set tempR    [expr {$r - $tempI2 + $tempR2}]
    set tempI    [expr {$i + 2*$tempIbyR}]
    set tempI2   [expr {$tempI*$tempI}]
    set tempR2   [expr {$tempR*$tempR}]
    set tempIbyR [expr {$tempR*$tempI}]
    set tempI2pR2 [expr {$tempR2 + $tempI2}]
    puts "count = $count tempR = $tempR, tempI = $tempI tempI2pR2 = $tempI2pR2"
}

puts "count = $count tempR = $tempR, tempI = $tempI tempI2pR2 = $tempI2pR2"
