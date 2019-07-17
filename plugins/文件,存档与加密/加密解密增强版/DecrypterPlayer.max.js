//=============================================================================
// Decrypter.js
//=============================================================================
/*:
 * @plugindesc 仿mv加密
 * @author wangwang
 *
 * @param Decrypter
 * @desc 仿mv加密解密
 * @default 1.0 
 * 
 * @param dir
 * @desc 保存位置
 * @default encrypt/
 * 
 * @param encryptList
 * @desc 加密列表,如 : ["img","data","audio","js","js/plugins"]
 * @default   ["img","audio","data"]
 * 
 * @param encryptExt
 * @desc 加密种类
 * @default   { "ogg": "rmo", "m4a": "rmm", "png": "rmp", "js": "rmj", "json": "rmd" }
 * 
 * @param encryptType
 * @desc 加密种类
 * @default   { "ogg": "b", "m4a": "b", "png": "b", "js": "t", "json": "t" }
 * 
 * @param plugins
 * @desc 加密插件组
 * @default  
 * 
 * @param ignoreList
 * @desc 忽略列表
 * @default []
 *  
 * 
 *
 * @help 
 * 
 * 
 *
 */

var MD5 = function (e) {
    function g(a, b) {
        var c, d, e, f;
        e = a & 2147483648;
        f = b & 2147483648;
        c = a & 1073741824;
        d = b & 1073741824;
        a = (a & 1073741823) + (b & 1073741823);
        return c & d ? a ^ 2147483648 ^ e ^ f : c | d ? a & 1073741824 ? a ^ 3221225472 ^ e ^ f : a ^ 1073741824 ^ e ^ f : a ^ e ^ f
    }

    function h(a, b, c, d, e, f, n) { a = g(a, g(g(b & c | ~b & d, e), n)); return g(a << f | a >>> 32 - f, b) }

    function k(a, b, c, d, e, f, n) { a = g(a, g(g(b & d | c & ~d, e), n)); return g(a << f | a >>> 32 - f, b) }

    function l(a, b, d, c, e, f, n) { a = g(a, g(g(b ^ d ^ c, e), n)); return g(a << f | a >>> 32 - f, b) }

    function m(a, b, d, c, e, f, n) { a = g(a, g(g(d ^ (b | ~c), e), n)); return g(a << f | a >>> 32 - f, b) }

    function p(a) {
        var b = "",
            d, c;
        for (c = 0; 3 >= c; c++) d = a >>> 8 * c & 255, d = "0" + d.toString(16), b += d.substr(d.length - 2, 2);
        return b
    }
    var f = [],
        q, r, t, u, a, b, c, d;
    e = function (a) {
        a = a.replace(/\r\n/g, "\n");
        for (var b = "", d = 0; d < a.length; d++) {
            var c = a.charCodeAt(d);
            128 > c ? b += String.fromCharCode(c) : (127 < c && 2048 > c ? b += String.fromCharCode(c >> 6 | 192) : (b += String.fromCharCode(c >> 12 | 224), b += String.fromCharCode(c >> 6 & 63 | 128)), b += String.fromCharCode(c & 63 | 128))
        }
        return b
    }(e);
    f = function (a) {
        var b, c = a.length;
        b = c + 8;
        for (var d = 16 * ((b - b % 64) / 64 + 1), e = Array(d - 1), f, g = 0; g < c;) b = (g - g % 4) / 4, f = g % 4 * 8, e[b] |= a.charCodeAt(g) << f, g++;
        e[(g - g % 4) / 4] |= 128 << g % 4 * 8;
        e[d - 2] = c << 3;
        e[d - 1] = c >>> 29;
        return e
    }(e);
    a = 1732584193;
    b = 4023233417;
    c = 2562383102;
    d = 271733878;
    for (e = 0; e < f.length; e += 16) q = a, r = b, t = c, u = d, a = h(a, b, c, d, f[e + 0], 7, 3614090360), d = h(d, a, b, c, f[e + 1], 12, 3905402710), c = h(c, d, a, b, f[e + 2], 17, 606105819), b = h(b, c, d, a, f[e + 3], 22, 3250441966), a = h(a, b, c, d, f[e + 4], 7, 4118548399), d = h(d, a, b, c, f[e + 5], 12, 1200080426), c = h(c, d, a, b, f[e + 6], 17, 2821735955), b = h(b, c, d, a, f[e + 7], 22, 4249261313), a = h(a, b, c, d, f[e + 8], 7, 1770035416), d = h(d, a, b, c, f[e + 9], 12, 2336552879), c = h(c, d, a, b, f[e + 10], 17, 4294925233), b = h(b, c, d, a, f[e + 11], 22, 2304563134), a = h(a, b, c, d, f[e + 12], 7, 1804603682), d = h(d, a, b, c, f[e + 13], 12, 4254626195), c = h(c, d, a, b, f[e + 14], 17, 2792965006), b = h(b, c, d, a, f[e + 15], 22, 1236535329), a = k(a, b, c, d, f[e + 1], 5, 4129170786), d = k(d, a, b, c, f[e + 6], 9, 3225465664), c = k(c, d, a, b, f[e + 11], 14, 643717713), b = k(b, c, d, a, f[e + 0], 20, 3921069994), a = k(a, b, c, d, f[e + 5], 5, 3593408605), d = k(d, a, b, c, f[e + 10], 9, 38016083), c = k(c, d, a, b, f[e + 15], 14, 3634488961), b = k(b, c, d, a, f[e + 4], 20, 3889429448), a = k(a, b, c, d, f[e + 9], 5, 568446438), d = k(d, a, b, c, f[e + 14], 9, 3275163606), c = k(c, d, a, b, f[e + 3], 14, 4107603335), b = k(b, c, d, a, f[e + 8], 20, 1163531501), a = k(a, b, c, d, f[e + 13], 5, 2850285829), d = k(d, a, b, c, f[e + 2], 9, 4243563512), c = k(c, d, a, b, f[e + 7], 14, 1735328473), b = k(b, c, d, a, f[e + 12], 20, 2368359562), a = l(a, b, c, d, f[e + 5], 4, 4294588738), d = l(d, a, b, c, f[e + 8], 11, 2272392833), c = l(c, d, a, b, f[e + 11], 16, 1839030562), b = l(b, c, d, a, f[e + 14], 23, 4259657740), a = l(a, b, c, d, f[e + 1], 4, 2763975236), d = l(d, a, b, c, f[e + 4], 11, 1272893353), c = l(c, d, a, b, f[e + 7], 16, 4139469664), b = l(b, c, d, a, f[e + 10], 23, 3200236656), a = l(a, b, c, d, f[e + 13], 4, 681279174), d = l(d, a, b, c, f[e + 0], 11, 3936430074), c = l(c, d, a, b, f[e + 3], 16, 3572445317), b = l(b, c, d, a, f[e + 6], 23, 76029189), a = l(a, b, c, d, f[e + 9], 4, 3654602809), d = l(d, a, b, c, f[e + 12], 11, 3873151461), c = l(c, d, a, b, f[e + 15], 16, 530742520), b = l(b, c, d, a, f[e + 2], 23, 3299628645), a = m(a, b, c, d, f[e + 0], 6, 4096336452), d = m(d, a, b, c, f[e + 7], 10, 1126891415), c = m(c, d, a, b, f[e + 14], 15, 2878612391), b = m(b, c, d, a, f[e + 5], 21, 4237533241), a = m(a, b, c, d, f[e + 12], 6, 1700485571), d = m(d, a, b, c, f[e + 3], 10, 2399980690), c = m(c, d, a, b, f[e + 10], 15, 4293915773), b = m(b, c, d, a, f[e + 1], 21, 2240044497), a = m(a, b, c, d, f[e + 8], 6, 1873313359), d = m(d, a, b, c, f[e + 15], 10, 4264355552), c = m(c, d, a, b, f[e + 6], 15, 2734768916), b = m(b, c, d, a, f[e + 13], 21, 1309151649), a = m(a, b, c, d, f[e + 4], 6, 4149444226), d = m(d, a, b, c, f[e + 11], 10, 3174756917), c = m(c, d, a, b, f[e + 2], 15, 718787259), b = m(b, c, d, a, f[e + 9], 21, 3951481745), a = g(a, q), b = g(b, r), c = g(c, t), d = g(d, u);
    return (p(a) + p(b) + p(c) + p(d)).toUpperCase()
};

var MD5_2 = function (data) { try { return require('crypto').createHash('md5').update(data).digest('hex').toUpperCase() } catch (e) { return "D41D8CD98F00B204E9800998ECF8427E" }; };


var Utf8 = {}; // Utf8 namespace

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @param {String} strUni Unicode string to be encoded as UTF-8
 * @returns {String} encoded string
 */
Utf8.encode = function (strUni) {
    // use regular expressions & String.replace callback function for better efficiency 
    // than procedural approaches
    var strUtf = strUni.replace(
        /[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
        function (c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
        }
    );
    strUtf = strUtf.replace(
        /[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
        function (c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
        }
    );
    return strUtf;
}

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @param {String} strUtf UTF-8 string to be decoded back to Unicode
 * @returns {String} decoded string
 */
Utf8.decode = function (strUtf) {
    // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
    var strUni = strUtf.replace(
        /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
        function (c) { // (note parentheses for precence)
            var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
            return String.fromCharCode(cc);
        }
    );
    strUni = strUni.replace(
        /[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
        function (c) { // (note parentheses for precence)
            var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
            return String.fromCharCode(cc);
        }
    );
    return strUni;
}



/**
 * 读取数据文件
 * @param {string} name 名称
 * @param {string} src 地址
 */
DataManager.loadDataFile = function (name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'data/' + src;
    if (Decrypter.hasEncryptedData && !Decrypter.checkImgIgnore(url)) {
        var url = Decrypter.extToEncryptExt(url)
        xhr.open('GET', url);
        xhr.responseType = "arraybuffer"
        xhr.onload = function () {
            if (xhr.status < 400) {
                window[name] = JSON.parse(Decrypter.decryptText(xhr.response));
                DataManager.onLoad(window[name]);
            }
        };
    } else {
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function () {
            if (xhr.status < 400) {
                window[name] = JSON.parse(xhr.responseText);
                DataManager.onLoad(window[name]);
            }
        };
    }
    xhr.onerror = function () {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    window[name] = null;
    xhr.send();
};

/**
 * 读取
 * @param {{}} object 对象
 */
DataManager.onLoad = function (object) {
    var array;
    if (object === $dataMap) {
        this.extractMetadata(object);
        array = object.events;
    } else {
        array = object;
    }
    if (Array.isArray(array)) {
        for (var i = 0; i < array.length; i++) {
            var data = array[i];
            if (data && data.note !== undefined) {
                this.extractMetadata(data);
            }
        }
    }
    if (object === $dataSystem) {
        Scene_Boot.loadSystemImages();
    }
};


Graphics._playVideo = function (src) {
    if (Decrypter.hasEncryptedVideo && !Decrypter.checkImgIgnore(src)) {
        var requestFile = new XMLHttpRequest();
        requestFile.open("GET", src);
        requestFile.responseType = "arraybuffer";
        requestFile.send();
        requestFile.onload = function () {
            if (this.status < Decrypter._xhrOk) {
                var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
                var url = Decrypter.createBlobUrl(arrayBuffer);
                Graphics._playVideo2(url);
            }
        };
    } else {
        this._playVideo2(url)
    }
};
Graphics._playVideo2 = function (url) {
    this._video.onloadeddata = this._onVideoLoad.bind(this);
    this._video.onerror = this._videoLoader;
    this._video.onended = this._onVideoEnd.bind(this);
    this._videoLoading = true;
    this._video.src = url;
    this._video.load();
};

PluginManager._loadScriptEnd = []
PluginManager.loadScriptEnd = function (url, response) {

    var IncludeJS = function (re) {
        try {
            if (re.response != null) {
                var os = document.createElement("script");
                os.language = "javascript";
                os.type = "text/javascript";
                os.id = re.url;
                os.defer = true;
                try {
                    os.appendChild(document.createTextNode(re.response));
                } catch (ex) {
                    os.text = re.response;
                }
                document.body.appendChild(os)
            }
        } catch (e) {
            eval(re.response)
        }
        return true
    }
    var t = 1
    for (var i = 0; i < this._loadScriptEnd.length; i++) {
        var o = this._loadScriptEnd[i]
        if (o.url == url) {
            if (!o.response) {
                o.response = response
            }
        }
        if (o.response) {
            t && (o.response !== true) && IncludeJS(o) && (o.response = true)
        } else {
            t = 0
        }
    }

}

/**读取脚本2 */
PluginManager.loadScript2 = function (src, path) {
    if (Decrypter.hasEncryptedJS) {
        var xhr = new XMLHttpRequest();
        var url = path ? 'js/' + src : PluginManager._path + src;
        var url2 = url
        if (!Decrypter.checkImgIgnore(url)) {
            url2 = Decrypter.extToEncryptExt(url)
            xhr.responseType = "arraybuffer"
            xhr.onload = function () {
                if (xhr.status < 400) {
                    PluginManager.loadScriptEnd(url, Decrypter.decryptText(xhr.response))
                }
            };
        } else {
            xhr.overrideMimeType('application/json');
            xhr.onload = function () {
                if (xhr.status < 400) {
                    PluginManager.loadScriptEnd(url, xhr.responseText)
                }
            };
        }
        xhr.onerror = function () {
            DataManager._errorUrl = DataManager._errorUrl || url;
        };
        this._loadScriptEnd.push({ url: url, response: false })
        xhr.open('GET', url2);
        xhr.send();
    };
}


PluginManager.setup2 = function (plugins) {
    //插件组 对每一个 方法(插件)
    plugins.forEach(function (plugin) {
        //如果 (插件 状态 并且 不是 脚本组 包含 (插件 名称) )
        if (plugin.status && !this._scripts.contains(plugin.name)) {
            //设置参数组(插件 名称 , 插件 参数组)
            this.setParameters(plugin.name, plugin.parameters);
            //读取脚本(插件 名称 + ".js")
            this.loadScript2(plugin.name + '.js');
            //脚本组 添加 (插件 名称)
            this._scripts.push(plugin.name);
        }
        //,this)
    }, this);

};

PluginManager.start = function () {
    if (Decrypter._plugins) {
        PluginManager.loadScript2(Decrypter._plugins)
    }
};





Decrypter.log = function () {
    return
}


/** 
 * 解密部分  
 * */


Decrypter.decryptArrayBuffer = function (a) {
    return this.decrypt(a, 0, "b")
};


Decrypter.decryptText = function (a) {
    return this.decrypt(a, 1, "t")
};



/**解密图片*/
Decrypter.decryptImg = function (url, bitmap) {
    url = this.extToEncryptExt(url);

    var requestFile = new XMLHttpRequest();
    requestFile.open("GET", url);
    requestFile.responseType = "arraybuffer";
    requestFile.send();

    requestFile.onload = function () {
        if (this.status < Decrypter._xhrOk) {
            var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
            bitmap._image.src = Decrypter.createBlobUrl(arrayBuffer);
            bitmap._image.addEventListener('load', bitmap._loadListener = Bitmap.prototype._onLoad.bind(bitmap));
            bitmap._image.addEventListener('error', bitmap._errorListener = bitmap._loader || Bitmap.prototype._onError.bind(bitmap));
        }
    };

    requestFile.onerror = function () {
        if (bitmap._loader) {
            bitmap._loader();
        } else {
            bitmap._onError();
        }
    };
};


/**解密 音频*/
Decrypter.decryptHTML5Audio = function (url, bgm, pos) {
    var requestFile = new XMLHttpRequest();
    requestFile.open("GET", url);
    requestFile.responseType = "arraybuffer";
    requestFile.send();
    requestFile.onload = function () {
        if (this.status < Decrypter._xhrOk) {
            var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
            var url = Decrypter.createBlobUrl(arrayBuffer);
            AudioManager.createDecryptBuffer(url, bgm, pos);
        }
    };
};

/**创建 blob url地址*/
Decrypter.createBlobUrl = function (arrayBuffer) {
    var blob = new Blob([arrayBuffer]);
    var url = window.URL.createObjectURL(blob)
    return url;
};





/**列表名称 */
Decrypter.listname = function () {
    return this._listname
}


/**本地地址
 * 
 */
Decrypter.localURL = function () {
    if (this._localURL === undefined) {
        if (Utils.isNwjs()) {
            var path = require('path');
            var base = path.dirname(process.mainModule.filename)
            var fa = path.basename(base)

            /*
            if (fa == "www") {
                var base = path.dirname(base);
            }*/
            this._localURL = base;
        } else {
            this._localURL = "";
        }
        /* 
        var path = null;// require &&typeof(require) =="function" && require('path');  
        if (path) {
            this._localURL = path.dirname(process.mainModule.filename)
        } else {
            var pathname = window.location.pathname
            var path = pathname.replace(/(\/www|)\/[^\/]*$/, "");
            if (path.match(/^\/([A-Z]\:)/)) {
                path = path.slice(1);
            }
            this._localURL = decodeURIComponent(path);
        } */
    }
    return this._localURL
};

/**当前文件夹 */
Decrypter._dirs = {}

/**本地文件位置名称 */
Decrypter.localFileName = function (name) {
    if (name) {
        var namelist = name.split("/")
        var dirPath = this.localURL()

        var d = ""
        for (var i = 0; i < namelist.length - 1; i++) {
            d = d + ((d || dirPath) ? '/' : "") + namelist[i];
            var d2 = dirPath + d
            if (!this._dirs[d]) {

                this._dirs[d] = 1
            }
        }
        d = d + ((d || dirPath) ? '/' : "") + namelist[i];
        return dirPath + d
    }
}


/**网络url */
Decrypter.webURL = function () {
    return this._webURL || ""
};

/**网络文件名 */
Decrypter.webFileName = function (name) {
    return this.webURL() + "/" + name
}


/**检查是否需要跳过
 * @param {string} url 地址
 * 
 */
Decrypter.checkImgIgnore = function (url) {
    for (var cnt = 0; cnt < this._ignoreList.length; cnt++) {
        if (url === this._ignoreList[cnt]) return true;
    }
    return false;
};

/**后缀 到 加密后缀 */
Decrypter._extToEncryptExt = {};
Decrypter.extToEncryptExt = function (url, t) {
    var t = t ? "1" : "0"
    var n = t + url
    if (this._extToEncryptExt[n]) {
        return this._extToEncryptExt[n]
    } else {

        var n0 = "0" + url
        var n1 = "1" + url

        var ext = url.split('.').pop();
        var encryptedExt = ".";
        if (ext !== url) {
            if (this._encryptExt[ext]) {
                encryptedExt += this._encryptExt[ext];
            } else {
                encryptedExt += ext;
            }
            var url2 = url.slice(0, url.lastIndexOf(ext) - 1) + encryptedExt
        } else {
            var url2 = url
        };
        this._extToEncryptExt[n1] = this.webFileName(this._dir + url2)
        this._extToEncryptExt[n0] = this.localFileName(this._dir + url2)

        return this._extToEncryptExt[n]
    }
};



(function () {
    var f = function (c) {
        c = c || "";
        var d = c.toLowerCase(),
            e = PluginManager._parameters[d];
        if (!e) {
            var b = PluginManager._parameters,
                a;
            for (a in b)
                if (b[a] && c in b[a]) { e = b[a]; break }
            b = $plugins;
            for (a = 0; a < b.length; a++)
                if (b[a] && (d = b[a].parameters) && c in d) { e = d; break }
        }
        return e || {}
    };
    var p = function (a, b) { try { return b ? a : JSON.parse(a) } catch (c) { return a } }
    var g = function (a, b, c) { try { var d = a[b] } catch (e) { d = c } return void 0 === d ? c : d }
    var v = function (a, b, c) { return p(g(a, b)) || c }
    var c = function (a, b) { return a.contains(b) }
    var z = f("Decrypter")
    Decrypter._dir = g(z, "dir")
    Decrypter._webURL = g(z, "weburl")
    Decrypter._listname = g(z, "listname")
    Decrypter._plugins = g(z, "plugins");

    Decrypter._ignoreList = v(z, "ignoreList", [])
    Decrypter._encryptExt = v(z, "encryptExt", {})
    Decrypter._encryptType = v(z, "encryptType", {})
    var l = Decrypter._encryptList = v(z, "encryptList", {})
    //Decrypter.log(l, c)
    Decrypter.hasEncryptedData = c(l, "data")
    Decrypter.hasEncryptedImages = c(l, "img")
    Decrypter.hasEncryptedAudio = c(l, "audio")
    Decrypter.hasEncryptedJS = (c(l, "js") || c(l, "js/plugins"))
    Decrypter.hasEncryptedVideo = c(l, "movies")

    try {
        PluginManager.start()
    } catch (error) { }
})();

