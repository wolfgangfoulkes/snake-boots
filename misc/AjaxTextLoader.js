/*****IF WE'RE RUNNING IN ASYNCH MODE
 var shaders_loaded = 0;
 xmlhttp.onreadystatechange = function() {
 //redefine this build-in function
 if (xmlhttp.readyState == 4)
 {
 shaders_loaded++;
 if shaders_loaded == 2)
 {
     linkshaderprogram();
 }
}
*****/

function getStringFromURL(url, asynch) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, asynch);
    //the third param disables concurrent processing to avoid bugs
    xmlhttp.send();
    return xmlhttp.responseText;
}