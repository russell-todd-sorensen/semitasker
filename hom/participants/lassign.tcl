set list {a b c d}
lassign $list x y z zz

ns_return 200 text/plain "
x=$x
y=$y
z=$z
zz=$zz"