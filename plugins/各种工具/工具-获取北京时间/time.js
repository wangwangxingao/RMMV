var xhr = new XMLHttpRequest();
var url = 'http://www.time.ac.cn/time.asp';
xhr.open('GET', url);
//xhr.overrideMimeType('xml/html');
xhr.onload = function () {
    if (xhr.status < 400) {
        var text = xhr.responseText
        var year = /<year>(.+)<\/year>/.exec(text)[1]
        var month = /<month>(.+)<\/month>/.exec(text)[1]
        var day = /<day>(.+)<\/day>/.exec(text)[1]
        var hour = /<hour>(.+)<\/hour>/.exec(text)[1]
        var minite = /<minite>(.+)<\/minite>/.exec(text)[1]
        var second = /<second>(.+)<\/second>/.exec(text)[1]
        console.log(year, month, day, hour, minite, second)
    }
}; 
xhr.send();