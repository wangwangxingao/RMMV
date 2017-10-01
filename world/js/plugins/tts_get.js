//http://appcdn.fanyi.baidu.com/zhdict/mp3/wo3.mp3



saveweb = function(n) {
    var xhr = new XMLHttpRequest();
    var url = "http://appcdn.fanyi.baidu.com/zhdict/mp3/" + n + ".mp3"
    xhr.open('GET', url);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
        if (xhr.status < 400) {
            var t = new Buffer(new Uint8Array(xhr.response))
            saveFile(n, t);
        }
    };
    xhr.onerror = function() {
        console.log("找不到" + url)
    };
    xhr.send();
};


saveFile = function(n, t) {
    var fs = require('fs');
    var filePath = "/tts/" + n + ".mp3"
    fs.writeFileSync(filePath, t);
};