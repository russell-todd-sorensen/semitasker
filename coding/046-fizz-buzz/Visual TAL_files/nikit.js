var aryClassElements=new Array();function getElementsByClassName(strClassName,obj){if(obj.className==strClassName){aryClassElements[aryClassElements.length]=obj;}
for(var i=0;i<obj.childNodes.length;i++)
getElementsByClassName(strClassName,obj.childNodes[i]);}
function hideDiscussions()
{aryClassElements.length=0;getElementsByClassName('discussion',document.body);for(var i=0;i<aryClassElements.length;i++){aryClassElements[i].style.display='none';}}
function toggleDiscussion(n)
{try{if(document.getElementById('discussion'+n).style.display=='inline'){document.getElementById('discussion'+n).style.display='none';document.getElementById('togglediscussionbutton'+n).innerHTML='Show'+document.getElementById('togglediscussionbutton'+n).innerHTML.substring(4);}
else{document.getElementById('discussion'+n).style.display='inline';document.getElementById('togglediscussionbutton'+n).innerHTML='Hide'+document.getElementById('togglediscussionbutton'+n).innerHTML.substring(4);}}catch(e){}
return false;}
function ajaxpage(url,postData,containerid){ajaxpage(url,postData,containerid,0);}
function ajaxpage(url,postData,containerid){var page_request=false
if(window.XMLHttpRequest)
page_request=new XMLHttpRequest()
else if(window.ActiveXObject){try{page_request=new ActiveXObject('Msxml2.XMLHTTP')}
catch(e){try{page_request=new ActiveXObject('Microsoft.XMLHTTP')}
catch(e){}}}
else
return false
page_request.onreadystatechange=function(){loadpage(page_request,containerid)}
if(postData.length){page_request.open('POST',url,true);page_request.setRequestHeader('Content-type','text/xml');page_request.send(postData);}
else{page_request.open('GET',url,true);page_request.send(null);}}
function loadpage(page_request,containerid){if(page_request.readyState==4&&(page_request.status==200||window.location.href.indexOf('http')==-1)){if(page_request.responseText.length){document.getElementById(containerid).innerHTML=page_request.responseText;}}}
function getBackRefs(page,containerid)
{ajaxpage('/ref/'+page+'?A=1','',containerid)}
function versionCompare(N,W)
{var A=-1;var B=-1;var i=-1;for(i=0;i<1000&&(A<0||B<0);i++){try{var p=document.getElementById('historyA'+i);if(p.checked){A=p.value;}
p=document.getElementById('historyB'+i);if(p.checked){B=p.value;}}
catch(err){break}}
location.href='/diff/'+encodeURIComponent(N)+'?V='+B+'&D='+A+'#diff0';}
function nikitGetCookie(cname){var name=cname+'=';var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)==' ')c=c.substring(1);if(c.indexOf(name)==0)return c.substring(name.length,c.length);}
return '';}
function nikitUser(){var e=nikitGetCookie('wikit_e');var sid=nikitGetCookie('wikit_sid');if(e==''||e=='deleted'){document.getElementById('ul_SMenu').innerHTML="<li><a rel='nofollow' href='/_login?U="+encodeURI(window.location.href)+"'>Sign in</a></li>";document.getElementById('li_idPageNoEdit').style.display='block';}else{document.getElementById('name_SMenu').innerHTML=e;document.getElementById('ul_SMenu').innerHTML="<li><a rel='nofollow' href='/page/"+encodeURI(e)+"'>User page</a></li>";document.getElementById('ul_SMenu').innerHTML+="<li><a rel='nofollow' href='/_logout?U="+encodeURI(window.location.href)+"'>Sign out</a></li>";if(sid!=''&&sid!='deleted'){document.getElementById('ul_SMenu').innerHTML+="<li><hr></li>";document.getElementById('ul_SMenu').innerHTML+="<li><a rel='nofollow' href='/_session'>Settings</a></li>";}
document.getElementById('li_idPageEdit').style.display='block';}}
function initToolTips(){$(document).ready(function(){$('[data-toggle="tooltip"]').tooltip();});}
function previewPageNewWindow(){var txt=document.getElementById('editarea').value;document.getElementById('previewData').value=txt;document.getElementById('doDiffs').value='0';document.getElementById('previewForm').submit();return false;}
function previewDiffsNewWindow(){var txt=document.getElementById('editarea').value;document.getElementById('previewData').value=txt;document.getElementById('doDiffs').value='1';document.getElementById('previewForm').submit();return false;}
function before_selection_after(txtareaid,before_markup,after_markup,defvalue){var useragent=navigator.userAgent.toLowerCase();var is_gecko=useragent.indexOf('gecko')!=-1;var txtarea=document.getElementById(txtareaid);if(!is_gecko){var within=document.selection.createRange().text;if(within.length==0)
within=defvalue;txtarea.focus();document.selection.createRange().text=before_markup+within+after_markup;}else{var sel_start=txtarea.selectionStart;var sel_end=txtarea.selectionEnd;var before=txtarea.value.substring(0,sel_start);var within=txtarea.value.substring(sel_start,sel_end);var scroll_pos=txtarea.scrollTop;if(within.length==0)
within=defvalue;var after=txtarea.value.substring(sel_end);txtarea.value=before+before_markup+within+after_markup+after;txtarea.selectionStart=sel_start+before_markup.length;txtarea.selectionEnd=sel_start+before_markup.length+within.length;txtarea.focus();txtarea.scrollTop=scroll_pos;}}
function surround_selection(txtareaid,markup,defvalue){before_selection_after(txtareaid,markup,markup,defvalue);}
function insert_at_selection(txtareaid,markup){before_selection_after(txtareaid,markup,'','');}
function bold(txtareaid){surround_selection(txtareaid,"'''",'bold text');return false;}
function italic(txtareaid){surround_selection(txtareaid,"''",'italic text');return false;}
function teletype(txtareaid){surround_selection(txtareaid,"`",'teletype text');return false;}
function superscript(txtareaid){return false;}
function subscript(txtareaid){return false;}
function heading1(txtareaid){before_selection_after(txtareaid,'\n**','**\n','your heading1');return false;}
function heading2(txtareaid){before_selection_after(txtareaid,'\n***','***\n','your heading2');return false;}
function heading3(txtareaid){before_selection_after(txtareaid,'\n****','****\n','your heading3');return false;}
function hruler(txtareaid){insert_at_selection(txtareaid,'\n----\n');return false;}
function list_bullets(txtareaid){before_selection_after(txtareaid,'\n   * ','\n','your bullet item');return false;}
function list_numbers(txtareaid){before_selection_after(txtareaid,'\n   1. ','\n','your numbered item');return false;}
function align_center(txtareaid){surround_selection(txtareaid,'\n!!!!!!\n','your centered text');return false;}
function wiki_link(txtareaid){before_selection_after(txtareaid,'[',']','your wiki page name');return false;}
function url_link(txtareaid){insert_at_selection(txtareaid,'http://here.com/what.html%|%link name%|%');return false;}
function img_link(txtareaid){insert_at_selection(txtareaid,'[http://here.com/photo.gif|png|jpg]');return false;}
function code(txtareaid){surround_selection(txtareaid,'\n======\n','your script');return false;}
function table(txtareaid){insert_at_selection(txtareaid,'\n%|header|row|%\n&|data|row|&\n&|data|row|&\n&|data|row|&\n');return false;}
function sort_tables(){$(function(){$('table').tablesorter({theme:'bootstrap',headerTemplate:'{content} {icon}',sortReset:true,sortRestart:true,widgets:['uitheme']});});}
$(document).ready(function(){$('.nocache').each(function(){var sep=(this.href.indexOf('?')!=-1)?'&':'?';var now=new Date().getTime();$(this).attr('href',this.href+sep+now);});});