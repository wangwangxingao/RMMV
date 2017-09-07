//document.getElementsByClassName("card-image")

//var url = 'http://el.cncgcg.com/search.php?act=details&id=2675';


var hash = {}

hash3 = {}
get = function() {
    var url0 = 'http://el.cncgcg.com/search.php?act=details&id=';
    var read = function(ui) {
        var s = function(t) {
            var z = {}
            var el = document.createElement("div")
            el.innerHTML = t

            var la = el.getElementsByClassName("table card-table")
            var f = function(o) {
                var l = o.children
                if (l && l.length > 0) {
                    var re = []
                    for (var i = 0; i < l.length; i++) {
                        re.push(f(l[i]))
                    }
                } else {
                    var re = o.innerHTML
                }
                return re
            }
            z.list = f(la[0])
            return z
        }
        var s2 = function(t) {
            try {
                var z = {}
                var el = document.createElement("div")
                el.innerHTML = t
                var la = el.getElementsByClassName("table card-table")[0]
                z.name = la.children[0].innerHTML
                if (z.name) {
                    GameUpdate.saveweb(el.getElementsByClassName("card-image")[0].src, ui)

                    var lb = la.children[1]
                    var f = function(o) {
                        var l = o.children
                        if (l && l.length > 0) {
                            var re = []
                            for (var i = 0; i < l.length; i++) {
                                re.push(f(l[i]))
                            }
                        } else {
                            var re = o.innerHTML
                        }
                        return re
                    }
                    z.list = f(lb)
                    return z
                } else {
                    return 0
                }
            } catch (e) {
                return 0
            }
        }
        var xhr = new XMLHttpRequest();
        var url = url0 + ui
        console.log("网址 " + url)
        xhr.open('GET', url);
        xhr.onload = function() {
            if (xhr.status < 400) {
                var r = s2(xhr.response)
                if (r) {
                    hash[ui] = r
                }
            }
        };
        xhr.onerror = function() {
            console.log(url);
        };
        xhr.send();
    }
    for (var ui = 2675; ui < 2677; ui++) {
        try {
            read((ui).padZero(4))
        } catch (error) {
            console.log(error)
        }
    }
}






function GameUpdate() {
    throw new Error('This is a static class');
}
GameUpdate._localURL = ""
GameUpdate.localURL = function() {
    if (!this._localURL) {
        var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, "");
        if (path.match(/^\/([A-Z]\:)/)) {
            path = path.slice(1);
        }
        this._localURL = decodeURIComponent(path);
    }
    return this._localURL
};
GameUpdate._dirs = {}
GameUpdate.localFileName = function(name) {
    if (name) {
        var namelist = name.split("/")
        var dirPath = this.localURL()
        var fs = require('fs');
        var d = ""
        for (var i = 0; i < namelist.length - 1; i++) {
            d = d + '/' + namelist[i];
            var d2 = dirPath + d
            if (!this._dirs[d]) {
                if (!fs.existsSync(d2)) {
                    fs.mkdirSync(d2);
                }
                this._dirs[d] = 1
            }
        }
        d = d + '/' + namelist[i]
        return dirPath + d
    }
}

GameUpdate.saveweb = function(url, n) {
    try {

        var ext = url.split('.').pop();
        var filePath = this.localFileName("yhzl/" + n + "." + ext)
        fs = require('fs');
        if (fs.existsSync(filePath)) {
            hash3[n] = 1
            console.log(n + "." + ext)
            return
        }

        var xhr = new XMLHttpRequest();
        console.log("图片:  " + url)
        xhr.open('GET', url);

        var ext = url.split('.').pop();
        xhr.responseType = "arraybuffer";
        xhr.onload = function() {
            if (xhr.status < 400) {
                GameUpdate.saveFile(n + "." + ext, new Buffer(new Uint8Array(xhr.response)));
            }
        };
        xhr.onerror = function() {
            console.log("找不到" + url)
        };
        xhr.send();
    } catch (error) {
        console.log("找不到" + url)
    }
};

GameUpdate.saveFile = function(n, t) {
    try {
        var fs = require('fs');
        var filePath = this.localFileName("yhzl/" + n)
        fs.writeFileSync(filePath, t);
    } catch (error) {
        console.log("不能保存" + n)
    }
};



var hash2 = {}
get2 = function() {
    var url0 = 'http://el.cncgcg.com/search.php?act=details&id=';
    var read = function(ui) {
        var xhr = new XMLHttpRequest();
        var url = url0 + ui
        xhr.open('GET', url);
        xhr.onload = function() {
            if (xhr.status < 400) {
                hash2[ui] = xhr.response
            }
        };
        xhr.onerror = function() {
            console.log(url);
        };
        xhr.send();
    }
    for (var ui = 0; ui < 4000; ui++) {
        try {
            read((ui).padZero(4))
        } catch (error) {
            console.log(error)
        }
    }
}