var t1 = "https://api.bilibili.com/x/v2/reply?callback=jQuery17207367607476015421_1525791380513&jsonp=jsonp&pn="
var t2 = "&type=1&oid=11357166&sort=0"


var i = 8000
var l = {}

var s = function () {
    i--
    console.log(i)
    if (i > 7990) { setTimeout(s, 1000) }
    var t = t1 + i + t2
    var z = i
    //网址请求 = 新 XML网址请求()
    var xhr = new XMLHttpRequest();
    //url位置 = "data" + src
    var url = t;
    //网址请求 打开( 'GET' , url位置)
    xhr.open('GET', url);
    //网址请求 文件类型('application/json')
    xhr.overrideMimeType('application/text');
    //网址请求 当读取
    xhr.onload = function () {
        if (xhr.status < 400) {
            if (xhr.responseText.indexOf("心高") >= 0) {
                l[z] = xhr.responseText
            }
        }
    };
    xhr.onerror = null
    xhr.send();

}
s()


