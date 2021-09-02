# default is φ(m=4,n=0)

set form [ns_conn form]
set n [ns_set get $form n 0]
set m [ns_set get $form m 4]

namespace eval A {

    variable ua
    set ua(3) ↑
    set ua(4) ↑↑
    set ua(5) ↑↑↑
    set ua(6) ↑↑↑↑
    set ua(7) ↑↑↑↑↑

    proc φ5 {n} {
        variable ua
        set op $ua(5) 
        return [list 2 $op [expr {$n+3}] -3]
    }

    proc φ4 {n} {
        variable ua
        set op $ua(4) 
        return [list 2 $op [expr {$n+3}] -3]
    }

    proc φ3 {n} {
        variable ua
        set op $ua(3)
        return [list 2 $op [expr {$n+3}] -3]
        #return "not implemented: φ3($n)"
    }

    proc φ {m n} {
        
        switch -exact -- $m {
            0 {
                return [expr {$n + 1}]
            }
            1 {
                return [expr {$n + 2}]
            }
            2 {
                return [expr {2*($m+$n) - 1}]
            }
            3 {
                return [φ3 $n] 
            }
            4 {
                return [φ4 $n]
            }
            5 {
                return [φ5 $n]
            }
            default {
                variable ua
                set op [string repeat $ua(3) [expr {$m-2}]]
                return [list 2 $op [expr {$n+3}] -3]
            }
        }

    } 
}

set result [::A::φ $m $n]

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Ack Knuth-up-arrow V5</title>
<style>
#c,
#n,
#m,
#m2 {
    width: 75px;
}
#form1 li {
    height: 1.5em;
}
</style>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form id='form1' autocomplete='off' spellcheck='false'>
<ul>
 <li>
  <label for='m'>M (small int)</label>
  <input name='m' id='m'  value='$m'>
 </li>
 <li>
  <label for='n'>N (small int)</label>
  <input name='n' id='n' value='$n'>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</form>
<pre>
m = '$m'
n = '$n'
φ($m,$n)='[join $result ""]'
</pre>
</body>
</html>"