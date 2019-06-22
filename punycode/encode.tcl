set problem {
    # Enter problem description, exactly started

}

set solution {
    # Enter thoughts on an approach to the solution
    # and a final explaination of the actual solution.
    6.3 Encoding procedure

   let n = initial_n
   let delta = 0
   let bias = initial_bias
   let h = b = the number of basic code points in the input
   copy them to the output in order, followed by a delimiter if b > 0
   {if the input contains a non-basic code point < n then fail}
   while h < length(input) do begin
     let m = the minimum {non-basic} code point >= n in the input
     let delta = delta + (m - n) * (h + 1), fail on overflow
     let n = m
     for each code point c in the input (in order) do begin
       if c < n {or c is basic} then increment delta, fail on overflow
       if c == n then begin
         let q = delta
         for k = base to infinity in steps of base do begin
           let t = tmin if k <= bias {+ tmin}, or
                   tmax if k >= bias + tmax, or k - bias otherwise
           if q < t then break
           output the code point for digit t + ((q - t) mod (base - t))
           let q = (q - t) div (base - t)
         end
         output the code point for digit q
         let bias = adapt(delta, h + 1, test h equals b?)
         let delta = 0
         increment h
       end
     end
     increment delta and n
   end

   The full statement enclosed in braces (checking whether the input
   contains a non-basic code point less than n) can be omitted if all
   code points less than initial_n are basic code points (which is true
   for Punycode if code points are unsigned).

   The brace-enclosed conditions "non-basic" and "or c is basic" can be
   omitted if initial_n exceeds all basic code points (which is true for
   Punycode), because the code point being tested is never less than
   initial_n.

   In the assignment of t, where t is clamped to the range tmin through
   tmax, "+ tmin" can always be omitted.  This makes the clamping
   calculation incorrect when bias < k < bias + tmin, but that cannot
   happen because of the way bias is computed and because of the
   constraints on the parameters.

   The checks for overflow are necessary to avoid producing invalid
   output when the input contains very large values or is very long.

   The increment of delta at the bottom of the outer loop cannot
   overflow because delta < length(input) before the increment, and
   length(input) is already assumed to be representable.  The increment
   of n could overflow, but only if h == length(input), in which case
   the procedure is finished anyway.

6.4 Overflow handling

   For IDNA, 26-bit unsigned integers are sufficient to handle all valid
   IDNA labels without overflow, because any string that needed a 27-bit
   delta would have to exceed either the code point limit (0..10FFFF) or
   the label length limit (63 characters).  However, overflow handling
   is necessary because the inputs are not necessarily valid IDNA
   labels.

   If the programming language does not provide overflow detection, the
   following technique can be used.  Suppose A, B, and C are
   representable nonnegative integers and C is nonzero.  Then A + B
   overflows if and only if B > maxint - A, and A + (B * C) overflows if
   and only if B > (maxint - A) div C, where maxint is the greatest
   integer for which maxint + 1 cannot be represented.  Refer to
   appendix C "Punycode sample implementation" for demonstrations of
   this technique in the C language.

   The decoding and encoding algorithms shown in sections 6.2 and 6.3
   handle overflow by detecting it whenever it happens.  Another
   approach is to enforce limits on the inputs that prevent overflow
   from happening.  For example, if the encoder were to verify that no
   input code points exceed M and that the input length does not exceed
   L, then no delta could ever exceed (M - initial_n) * (L + 1), and
   hence no overflow could occur if integer variables were capable of
   representing values that large.  This prevention approach would
   impose more restrictions on the input than the detection approach
   does, but might be considered simpler in some programming languages.

   In theory, the decoder could use an analogous approach, limiting the
   number of digits in a variable-length integer (that is, limiting the
   number of iterations in the innermost loop).  However, the number of
   digits that suffice to represent a given delta can sometimes
   represent much larger deltas (because of the adaptation), and hence
   this approach would probably need integers wider than 32 bits.

   Yet another approach for the decoder is to allow overflow to occur,
   but to check the final output string by re-encoding it and comparing
   to the decoder input.  If and only if they do not match (using a
   case-insensitive ASCII comparison) overflow has occurred.  This
   delayed-detection approach would not impose any more restrictions on
   the input than the immediate-detection approach does, and might be
   considered simpler in some programming languages.

   In fact, if the decoder is used only inside the IDNA ToUnicode
   operation [IDNA], then it need not check for overflow at all, because
   ToUnicode performs a higher level re-encoding and comparison, and a
   mismatch has the same consequence as if the Punycode decoder had
   failed.

}

set pagedir [ns_server -server ns pagedir]
set path [string trimleft [file dirname [ns_conn url]] /]
set fileDirectory [file join $pagedir $path]
source [file join $fileDirectory punycode.tcl]


set u_label "ↈaↀbↁcↇ"
set log_level $::punycode::log_level

set form [ns_conn form]
set u_label [ns_set get $form u $u_label]
set log_level [ns_set get $form l $log_level]
set ::punycode::log_level $log_level

if {[catch {
    set result [::punycode::encode $u_label]
    set ok 1
} err]} {
    global errorInfo
    set result $errorInfo
    set ok 0
}

set select [::punycode::buildSelect]

set unicode [list "no result"]

if {$ok} {
    set unicode [::punycode::formatAsUnicode $u_label]
} 

ns_return 200 text/html "<!DOCTYPE html>
<html>
<head>
<title>Encode Unicode Label as Punycode</title>
<link rel='stylesheet' href='punycode.css' />
<style>

</style>
</head>
<body>
<!--  method='POST' encoding='multi-part/formdata' -->
<form autocomplete='off' spellcheck='false' id='form1'>
<fieldset>
<legend>Options for IDN Encode to Punycode</legend>
<ul>
 <li>
  <label for='u'>Unicode Label</label>
  <input name='u' id='u' value='$u_label'>
 </li>
 <li>
  <label for='l'>Logging Level</label>
  <select id='l' name='l' >
  [join $select "\n   "]
  </select>
 </li>
 <li>
  <input type='submit' value='Try it'/>
 </li>
 </ul>
</fieldset>
</form>
<div id='result'>
<a href='decode.tcl?a=$result&l=$log_level' id='link'>Decode $result</a>
<pre>
u_label = '$u_label'
a_label = '$result'
w / ACE = 'xn--$result'

Encode Traces:
[join $::punycode::log \n]

[join $unicode \n]

</pre>
</div>
</body>
</html>"
