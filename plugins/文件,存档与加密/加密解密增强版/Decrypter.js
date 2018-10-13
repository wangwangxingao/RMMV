//=============================================================================
// Decrypter.js
//=============================================================================
/*:
 * @plugindesc 仿mv加密
 * @author wangwang
 *
 * 
 * @param Decrypter
 * @desc 仿mv加密解密
 * @default 1.0
 * 
 * @param mvheader
 * @desc 使用原本的头
 * @default false
 * 
 * @param SIGNATURE
 * @desc 游戏签名:
 * @default RMMV游戏
 * 
 * @param VER
 * @desc 游戏版本:
 * @default 1.0
 * 
 * @param REMAIN
 * @desc 游戏签名
 * @default 1.0
 * 
 *  
 * @param miyao
 * @desc 输入密钥
 * @default 测试
 *   
 * @param mode
 * @desc 模式: "header","mv","ex","aes","zlib","lzma" 
 * @default {"b":["header","ex"],"t":["header","ex"]}
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
 * @param weburl
 * @desc 游戏更新网站
 * @default 
 * 
 * @param listname
 * @desc 更新列表名称
 * @default updateList.json
 * 
 *
 * @help 
 * 
 * 使用:
 * 加入本插件,并设置为on
 * 进入游戏,f8,使用 Decrypter.startEncrypt() 生成加密文件夹,
 * 使用 Decrypter.saveMY("test","miyao")  //参数可更改
 * 即可生成 以"test"加密的miyao.js
 * 
 * 
 * 发布时,
 * 将本插件删除,
 * 将DecrypterPlayer插件(可以改名)加入并设置好
 * 将上面生成的miyao插件加入
 * 将本插件从游戏文件中删除,将已经加密的文件从游戏文件中删除
 * 进入游戏时将提示输入密钥,如上例则输入 test 
 * 即可进入游戏,
 * 
 * 
 * mode 模式: 
 *  "header" 头        
 *  "mv" mv原版加密 
 *  "ex" 加强原版加密  
 *  "aes"aes加密 ,需要aes.js
 *  "zlib" zlib压缩,需要zlib.js
 *  "lzma" lzma压缩,需要lzma.js
 * 使用时类似 ["header","ex"] ,可以为空(然而好像没有意义..) 
 * mv原版加密加密对文本无效的样子..
 * 
 * 
 * 
 * 生成加密文件
 * Decrypter.startEncrypt()  
 * 开始更新
 * Decrypter.startUpdate()
 * 
 * 
 * 
 * 
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
    if (!this._localURL) {
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
        }
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
        var fs = require('fs');
        var d = ""
        for (var i = 0; i < namelist.length - 1; i++) {
            d = d + ((d || dirPath) ? '/' : "") + namelist[i];
            var d2 = dirPath + d
            if (!this._dirs[d]) {
                if (!fs.existsSync(d2)) {
                    fs.mkdirSync(d2);
                }
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




/**
 * ===============================================================================
 * 加密部分
 * ===============================================================================
 */
/**保存文件 */
Decrypter.saveFile = function (n, t) {
    var fs = require('fs');
    var filePath = this.extToEncryptExt(n)
    fs.writeFileSync(filePath, t);
};

/**删除文件 */
Decrypter.delFile = function (n) {
    var fs = require('fs');
    var filePath = this.extToEncryptExt(n)
    fs.unlinkSync(filePath);
};


/**加密Buffer */
Decrypter.encryptBuffer = function (a) {
    return this.encrypt(a, 0, "b")
}

/**加密文本 */
Decrypter.encryptText = function (data) {
    return this.encrypt(data, 0, "t")
}


Decrypter.getEncryptMust = function (url) {
    if (this.checkImgIgnore(url)) {
        return null
    }
    var ext = url.split('.').pop();
    if (ext === "ogg" || ext === "m4a") {
        if (this.hasEncryptedAudio) {
            return this._encryptType[ext];
        }
    } else if (ext === "png") {
        if (this.hasEncryptedImages) {
            return this._encryptType[ext];
        }
    } else if (ext === "json") {
        if (this.hasEncryptedData) {
            return this._encryptType[ext];
        }
    } else if (ext === "js") {
        if (this.hasEncryptedJS) {
            return this._encryptType[ext];
        }
    } else {
        return this._encryptType[ext]
    }
    return null
};




/**生成加密 */
Decrypter.startEncrypt = function () {
    if (!Utils.isNwjs()) {
        Decrypter.log("not is Nwjs")
        return {}
    }
    var o = {}
    var o2 = {}

    var nt = Date.now()
    Decrypter.log(nt)
    var pro = 0
    Decrypter.ennum = 0

    var list = Decrypter._encryptList
    var fs = require('fs');
    var get = function (f) {
        var p = Decrypter.localFileName(f)
        if (fs.existsSync(p)) {
            var stats = fs.statSync(p)
            if (stats.isDirectory()) {
                var files = fs.readdirSync(p)
                files.forEach(function (n) {
                    var f2 = f ? f + '/' + n : n
                    get(f2, o)
                })
            } else {
                var must = Decrypter.getEncryptMust(f)
                if (must) {
                    o[f] = must
                    pro++
                }
            }
        }
    }
    for (var i = 0; i < list.length; i++) {
        var d = list[i]
        get(d)
    }
    var proall = pro
    var nt2 = Date.now()
    Decrypter.log("读取列表时间", nt2 - nt)
    Decrypter.log(o, pro, list)
    pro = 0
    for (var n in o) {
        var nt2 = Date.now()
        Decrypter.log(n)
        var v = o[n]
        var url = this.localFileName(n)

        var data = fs.readFileSync(url)
        if (v == "t") {
            var buffer = this.encryptText(data)
        } else {
            var buffer = this.encryptBuffer(data)
        }
        var md5 = MD5_2(buffer)
        o2[n] = md5

        Decrypter.saveFile(n, buffer)
        Decrypter.log(n, v, url, md5)
        pro++

        var nt3 = Date.now()
        Decrypter.log(n, "使用时间", nt3 - nt2)
        Decrypter.log(pro, "/", proall, Math.floor((pro / proall) * 100) + "%", nt3 - nt)

    }
    var data = JSON.stringify(o2)
    var buffer = this.encryptText(data)
    var n = this.listname()
    if (n) {
        Decrypter.saveFile(n, buffer)
    }
    Decrypter.log(o2, n)

    var nt3 = Date.now()
    Decrypter.log("完成", "使用时间", nt3 - nt)


    //this.saveMY()
    return o2
}







/**
 * 
 * 网络更新部分 
 * 
 */

/**更新列表 */
Decrypter._updateList = null

/**更新列表 */
Decrypter.updateList = function () {
    return this._updateList
};



/**开始更新 */
Decrypter.startUpdate = function () {
    this.param()
    if (this._webURL && this.isLocalMode()) {
        this.initUL()
        this._weblist = null
        this._locallist = null

        this.updateUL("web", "st")
        this.updateUL("loc", "st")

        this.getwebList()
        this.getLocalList()

    } else {
        alert("无网络地址" + "无法保存到本地")
        this._updateList = null
        this.endUpdate()
    }
};


Decrypter.isUpdateEnd = function () {
    return this._endupdate;
};

/**获取网络列表 */
Decrypter.getwebList = function () {
    var name = this.listname()
    var xhr = new XMLHttpRequest();
    var url = this.extToEncryptExt(name, 1);
    xhr.open('GET', url);
    xhr.responseType = "arraybuffer"
    xhr.onload = function () {
        if (xhr.status < 400) {
            try {
                Decrypter._weblist = JSON.parse(Decrypter.decryptText(xhr.response))
            } catch (error) {
                Decrypter._weblist = "err"
            }
            Decrypter.onLoadList();
        }
    };
    xhr.onerror = function () {
        Decrypter._weblist = "err"
        Decrypter.onLoadList();
    };
    xhr.send()
}

/**制作本地列表 */
Decrypter.makelist = function () {
    if (!Utils.isNwjs()) {
        Decrypter.log("not is Nwjs")
        return {}
    }
    var o2 = {}
    var o = {}
    var list = this._encryptList
    var dir = this.localURL()
    var fs = require("fs")

    //获取 文件
    var get = function (f) {
        var p = Decrypter.localFileName(f)
        if (fs.existsSync(p)) {
            var stats = fs.statSync(p)
            if (stats.isDirectory()) {
                var files = fs.readdirSync(p)
                files.forEach(function (n) {
                    var f2 = f ? f + '/' + n : n
                    get(f2, o)
                })
            } else {
                var must = Decrypter.getEncryptMust(f)
                if (must) {
                    o[f] = must
                }
            }
        }
    }
    for (var i = 0; i < list.length; i++) {
        var d = list[i]
        get(d)
    }
    for (var n in o) {
        var v = o[n]
        var url = this.extToEncryptExt(n)
        try {
            var data = fs.readFileSync(url)
        } catch (error) {
            var data = null
        }
        if (data) {
            var buffer = new Buffer(data)
            o2[n] = MD5_2(buffer)
        }
    }
    return o2
}


/**获取本地列表 */
Decrypter.getLocalList = function () {
    var name = this.listname()
    var xhr = new XMLHttpRequest();
    var url = this.extToEncryptExt(name);
    xhr.open('GET', url);
    xhr.responseType = "arraybuffer"
    xhr.onload = function () {
        if (xhr.status < 400) {
            try {
                Decrypter._locallist = JSON.parse(Decrypter.decryptText(xhr.response))
            } catch (error) {
                Decrypter._locallist = "err"
            }
            Decrypter.onLoadList();
        }
    };
    xhr.onerror = function () {
        Decrypter._locallist = "err"
        Decrypter.onLoadList();
    };
    xhr.send();
};

/**当读取列表 */
Decrypter.onLoadList = function () {
    if (this._weblist && this._locallist) {
        if (this._weblist == "err") {
            Decrypter.log("找不到网络更新列表")
            this.endUpdate()
            Decrypter.updateUL("web", "err")
            Decrypter.updateUL("loc", "end")
            return
        }
        if (this._locallist == "err") {
            Decrypter.log("找不到本地更新列表")
            this._locallist = Decrypter.makelist(-1)
            Decrypter.log("创建本地更新列表")
        }
        var l = this._locallist
        var w = this._weblist
        var o = this.updateList()
        for (var n in l) {
            if (w.list[n]) {
                if (l[n] != w.list[n]) {
                    o.up[n] = 1
                    o.list[n] = "up"
                    o.all++
                }
            } else {
                o.del[n] = 1
                o.list[n] = "del"
                o.all++
            }
        }
        for (var n in w.list) {
            if (!l[n]) {
                o.up[n] = 1
                o.list[n] = "up"
                o.all++
            }
        }
        this.mustUpdate()
        Decrypter.updateUL("web", "end")
        Decrypter.updateUL("loc", "end")
    }
};

/**需要更新 */
Decrypter.mustUpdate = function () {
    var o = this.updateList()
    if (o) {
        if (o.up) {
            for (var n in o.up) {
                if (o.up[n]) {
                    o.up[n] = 0
                    this.saveweb(n)
                }
            }
        }
        if (o.del) {
            for (var n in o.del) {
                if (o.del[n]) {
                    o.del[n] = 0
                    this.delweb(n)
                }
            }
        }
    } else {
        this.endUpdate()
    }
};


Decrypter.initUL = function () {
    this._updateList = { list: {}, up: {}, del: {}, end: {}, err: {}, all: 0 }
    return this._updateList
};

Decrypter.updateUL = function (n, st) {
    var o = this.updateList()
    o.list[n] = st
    if (st == "err") {
        o.err[n] = 1
        o.all--
    }
    if (st == "end") {
        o.end[n] = 1
        o.all--
    } else if (st == "up") {
        o.up[n] = 1
        o.all++
    } else if (st == "del") {
        o.del[n] = 1
        o.all++
    } else if (st == "st") {
        o.all++
    }
    if (o.all <= 0) {
        this.endUL()
    }
    Decrypter.log(o)
};


Decrypter.endUL = function () { }


Decrypter.saveweb = function (n) {
    var xhr = new XMLHttpRequest();
    var url = this.extToEncryptExt(n, 1)
    xhr.open('GET', url);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
        if (xhr.status < 400) {
            Decrypter.saveweb2(n, new Buffer(xhr.response));
        }
    };
    xhr.onerror = function () {
        Decrypter.log("找不到" + url)
        Decrypter.updateUL(n, "err")
    };
    xhr.send();
};

Decrypter.saveweb2 = function (n, t) {
    this.saveFile(n, t)
    this.updateUL(n, "end")
};

Decrypter.delweb = function (n) {
    this.delFile(n)
    this.updateUL(n, "end")
};



/**是本地 */
Decrypter.isLocalMode = function () {
    //Utils 是Nwjs()
    return Utils.isNwjs();
};








(function () {
    var w = { d: {}, e: {} };


    /**计算
     * @param {[]} a 键组
     * @param {number} b 长度
     * @param {number} c 计算次数
     * 
     */
    w.ei = function (a, b, c) {
        var l = w.l(a)
        var c = c || 0;
        var z = 0;
        var v = 0;
        for (var i = (c <= 0 ? c - 2 : 0); i < c; i++) {
            z += b;
            v += a[z % l]
        }
        return (v) % b
    };



    /**
     * 读取模式
     * @param {string|[string]} m 
     */
    w.rm = function (m) {
        return typeof (m) == "string" ? w.m[m] || w.m : m || w.m
    };


    w.mh = function (h) {  
        var b = []; 
        for (i = 0; i < h.length; i+=2) {
            b.push( parseInt("0x" + h.substr(i, 2), 16));
        } 
        return b
    }

    /**
     * 读取头
     * @param {string} h 
     */
    w.rh = function (h) {
        return h ||  w.h
    };


    /**
     * 读取键
     * @param {*} k 
     */
    w.rk = function (k) {
        return k || w.k
    };


    /**
     * 文本转化为数组
     * @param {string} t 
     */
    w.t2b = function (t) {
        var l = w.l(t) / 2;
        var k = []
        for (var i = 0; i < l; i++) {
            k[i] = parseInt(t.substr(i + i, 2), 16)
            if (isNaN(k[i])) { return w.tb(t) }
        }
        return k
    };

    /**
     * 转化为Uint8Array
     * @param {ArrayBuffer|number} a 
     * @return {Uint8Array}
     */
    w.u = function (a) {
        return new Uint8Array(a)
    };


    /**
     * 长度
     * @param {[]|ArrayBuffer} b 
     * @return {number}
     */
    w.l = function (b) {
        return b ? b.length || b.byteLength || 0 : 0
    };

    /**
     * 数组转化为文本
     * @param {[]|Uint8Array|Blob} b 数组
     * @return {string}  文本
     */
    w.bt = function (b) {
        var l = w.l(b)
        var t = []
        for (var i = 0; i < l; i++) {
            t[i] = String.fromCharCode(b[i])
        }
        return t.join("");
    };

    /**
     * 文本转化为数组
     * @param {string} t 文本
     * @return {Uint8Array} Uint8Array数组
     */
    w.tb = function (t) {
        var l = w.l(t)
        var b = w.u(l)
        for (var i = 0; i < l; i++) {
            b[i] = t.charCodeAt(i)
        }
        return b;
    };

    /**
     * arrayBuffer转Uint8Arry
     * @param {ArrayBuffer} a arrayBuffer数据
     * @return {Uint8Array}  Uint8Arry数据
     */
    w.ab = function (a) {
        return w.u(a);
    };

    /**
     * Uint8Arry转arrayBuffer
     * @param {Uint8Array} b Uint8Arry数据
     * @return {ArrayBuffer} arrayBuffer数据
     */
    w.ba = function (b) {
        return (b || w.u()).buffer;
    };


    /**
     * 加头
     * @param {Uint8Array} b Uint8Arry数据
     * @param {[]} k 密钥
     * @param {[]} h 文件头
     * 
     */
    w.d.header = function (b, k, h) {
        var a = w.rh(h)
        if (b) {
            var c = w.l(b)
            var d = w.l(a)
            for (var i = 0; i < d; i++) {
                if (b[i] != a[i]) { return false }
            }
            return w.u(b.subarray(d))
        }
        return false
    };

    /**
     * mv 加密 的解密
     * @param {Uint8Array} b Uint8Arry数据
     * @param {[]} k 密钥
     * @param {[]} h 文件头
     */
    w.d.mv = function (b, k, h) {
        if (b) {
            var k = w.rk(k);
            var l = w.l(k)
            for (i = 0; i < l; i++) {
                b[i] = k[i] ^ b[i]
            }
        }
        return b;
    };
    /**
     * ex 
     * 加密的解密 
     * @param {Uint8Array} b Uint8Arry数据
     * @param {[]} k 密钥
     * @param {[]} h 文件头
     */
    w.d.exb = function (b, k, h, t) {
        if (b) {
            var k = w.rk(k);
            var l = w.l(b)
            var e = w.l(k)
            if (l && e) {
                var n = w.ei(k, l, t)
                var d = n
                var c = b[n]
                var t = k[d % e] ^ c
                b[n] = d = t
                for (var i = 0; i < l; i++) {
                    if (i == n) { } else {
                        var v = k[d % e]
                        var c = b[i]
                        var t = v ^ c
                        b[i] = d = t
                    }
                }
            }
        }
        return b;
    };

    /**
     * ex 
     * 加密的解密
     * @param {Uint8Array} b Uint8Arry数据
     * @param {[]} k 密钥
     * @param {[]} h 文件头
     * 
    */
    w.d.ex = function (b, k, h) {
        return this.exb(b, k, h)
    };


    /**
     * zlib 解压缩
     * @param {Uint8Array} b Uint8Arry数据
     * @param {[]} k 密钥
     * @param {[]} h 文件头
     */
    w.d.zlib = function (b, k, h) {
        if (b) {
            if (Zlib) {
                var b = new Zlib.Inflate(b).decompress();
            }
        }
        return b;
    };

    /**
     * LZMA 解压缩
     * @param {Uint8Array} b Uint8Arry数据
     * @param {[]} k 密钥
     * @param {[]} h 文件头
     */
    w.d.lzma = function (b, k, h) {
        if (b) {
            if (LZMA) {
                var b = w.u(LZMA.decompress(b))
            }
        }
        return b;
    };

    /**
     * pako 解压缩
     * @param {Uint8Array} b Uint8Arry数据
     * @param {[]} k 密钥
     * @param {[]} h 文件头
     */
    w.d.pako = function (b, k, h) {
        if (b) {
            if (pako) {
                var b = pako.inflate(b)
            }
        }
        return b;
    };

    /**
     * aes 解加密
     * @param {Uint8Array} b Uint8Arry数据
     * @param {[]} k 密钥
     * @param {[]} h 文件头
     */
    w.d.aes = function (b, k, h) {
        if (b) {
            if (Aes) {
                var b = Aes.Ctr.decrypt(b, w.rk(k), 256, 2)
            }
        }
        return b;
    };



    w.d.tl64 = function (t, k, h) {
        return LZString.decompressFromBase64(t);
    };


    /**
     * 用LZ加密文字
     */
    w.d.tl = function (t, k, h) {
        return LZString.compress(t);
    };

    w.d.taes = function (t, k, h) {
        if (t) {
            if (Aes) {
                var t = Aes.Ctr.decrypt(t, w.rk(k), 256, 0)
            }
        }
        return t;
    };



    /**解密文字到utf8 */
    w.d.tu = function (t, k, h) {
        if (Utf8) {
            t = Utf8.decode(t)
        }
        return t;
    };

    /**解密文字到base64 */
    w.d.t64 = function (t, k, h) {
        if (t) {
            t = Base64.decode(t)
        }
        return t;
    };


    /**使用方法 */
    w.d.use = function (b, m, k, h) {
        var l = w.l(m)
        for (var i = 0; i < l; i++) {
            if (!b) { return false } 
            var b = !!this[m[i]] && this[m[i]](b, k, h)

        }
        return b
    };



    /**
     * 解密 
     * @param {Array} a 数据
     * @param {Boolean} t 种类
     * @param {[]} m 加密方法
     * @param {} k 密码
     * @param {} h 头
     */
    w.decrypt = function (a, t, m, k, h) {
        if (!a) { return null }
        var m = w.rm(m)
        var b = w.ab(a)
        if (m) {
            b = w.d.use(b, m, k, h)
            if (!b) { throw new Error("Decrypt is wrong"); return null }
        }
        return t ? t == 1 ? w.d.tu(w.bt(b)) : b : w.ba(b)
    };


    /**读取 */
    w.load = function () {
        w.m = JSON.parse(w.m2)
        w.h = w.uh ? w.mh(w.h2) : w.t2b(w.h2)
        w.k = w.t2b(w.k2)
    }

    Decrypter.decrypt = w.decrypt.bind(w);




    w.loadMY = function (v) {
        return false
        var k = v || window.prompt("输入", "");
        var r = w.s.data
        //Decrypter.log(r, k)
        var d = w.decrypt(r, 1, ["ex"], w.t2b(k), [])
        //Decrypter.log(d)
        var l = JSON.parse(w.d.tl64(d))
        w.m2 = l[0]
        w.k2 = l[1]
        w.h2 = l[2]
        w.uh = l[3]
        w.load()

        return true
        //Decrypter.log(w.m2, w.h2, w.k2)
    };


    w.loadMY() || (function () {
        //w.loadMY()
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

        var z = f("Decrypter")
        w.m2 = g(z, "mode")
        w.k2 = MD5(g(z, "miyao"))
        w.h2 = g(z, "SIGNATURE") + g(z, "VER") + g(z, "REMAIN")
        w.uh = v(z, "mvheader")

        w.load()
        //Decrypter.log(w)
    })();




    //Decrypter.log(k = w)

    /**加密部分 */

    /**
     * byteArray转化为buffer
     */
    w.bbu = function (b) {
        return new Buffer(b || 0);
    };


    /**
     * buffer转化为byteArray
     */
    w.bub = function (b) {
        return w.u(b);
    };


    /**
     * 加密 加头
     */
    w.e.header = function (a, k, h) {
        var b = w.rh(h)
        var c = w.l(a)
        var d = w.l(b)
        var r = w.u(c + d)
        if (b) (r.set(b, 0))
        if (a) (r.set(a, d))
        return r
    };


    /**
     * 用mv加密byteArray
     */
    w.e.mv = function (b, k, h) {
        if (b) {
            var k = w.rk(k)
            var l = w.l(k)
            for (i = 0; i < l; i++) {
                b[i] = k[i] ^ b[i]
            }
        }
        return b
    };



    /**
     * 用ex加密byteArray
     */
    w.e.exb = function (b, k, h, t) {
        if (b) {
            var k = w.rk(k)
            var l = w.l(b)
            var e = w.l(k)
            if (l && e) {
                var n = w.ei(k, l, t)
                var d = n
                var c = b[n]
                b[n] = c ^ k[d % e]
                var d = c
                for (var i = 0; i < l; i++) {
                    if (i == n) { } else {
                        var c = b[i]
                        b[i] = c ^ k[d % e]
                        d = c
                    }
                }
            }
        }
        return b
    };

    /**
     * 用ex加密byteArray
     */
    w.e.ex = function (b, k, h) {
        return this.exb(b, k, h)
    };

    /**
     * 用zlib加密byteArry
     */
    w.e.zlib = function (b, k, h) {
        if (b) {
            if (Zlib) {
                Decrypter.log("Zlib压缩:")
                var l1 = w.l(b)
                var t1 = Date.now()
                Decrypter.log("原大小:", l1)

                var b = new Zlib.Deflate(b).compress();

                var l2 = w.l(b)
                var t2 = Date.now()
                Decrypter.log("压缩后:", l2)
                var l3 = l1 - l2
                Decrypter.ennum += l3
                Decrypter.log("压缩量", l3, "压缩比例:", l1 / l2, "压缩时间", t2 - t1, "总压缩量", Decrypter.ennum)
            }
        }
        return b;
    };


    /** */
    w.e.pako = function (b, k, h, v) {
        if (b) {
            if (pako) {
                Decrypter.log("pako压缩:")
                var l1 = w.l(b)
                var t1 = Date.now()
                Decrypter.log("原大小:", l1)

                var b = pako.deflate(b, { level: v || 9 })


                var l2 = w.l(b)
                var t2 = Date.now()
                Decrypter.log("压缩后:", l2)
                var l3 = l1 - l2
                Decrypter.ennum += l3
                Decrypter.log("压缩量", l3, "压缩比例:", l1 / l2, "压缩时间", t2 - t1, "总压缩量", Decrypter.ennum)
            }
        }
        return b;
    };


    /**用lzma加密 */
    w.e.lzma = function (b, k, h, v) {
        if (b) {
            if (LZMA) {
                Decrypter.log("lzma压缩:")
                var l1 = w.l(b)
                var t1 = Date.now()
                Decrypter.log("原大小:", l1)

                var b = w.u(LZMA.compress(b, v || 9))


                var l2 = w.l(b)
                var t2 = Date.now()
                Decrypter.log("压缩后:", l2)
                var l3 = l1 - l2
                Decrypter.ennum += l3
                Decrypter.log("压缩量", l3, "压缩比例:", l1 / l2, "压缩时间", t2 - t1, "总压缩量", Decrypter.ennum)
            }
        }
        return b;
    };


    /**
     * 用aes加密byteArry
     */
    w.e.aes = function (b, k, h) {
        if (b) {
            if (Aes) {
                Decrypter.log("aes加密:")
                var l1 = w.l(b)
                Decrypter.log("原大小:", l1)
                var b = Aes.Ctr.encrypt(b, w.rk(k), 256, 2)
                var l2 = w.l(b)
                Decrypter.log("压缩后:", l2)
                var l3 = l1 - l2
                Decrypter.ennum += l3
                Decrypter.log("压缩量", l3, "总压缩量", Decrypter.ennum)
            }
        }
        return b;
    };


    /**
     * 用base64加密文字
     */
    w.e.tl64 = function (t, k, h) {
        return LZString.compressToBase64(t);
    };


    /**
     * 用base64加密文字
     */
    w.e.tl = function (t, k, h) {
        return LZString.compress(t);
    };



    /**
     * 用aes加密文字
     */
    w.e.taes = function (t, k, h) {
        if (t) {
            if (Aes) {
                var t = Aes.Ctr.encrypt(t, w.rk(k), 256, 0)
            }
        }
        return t;
    };


    /**
     * UTF加密文本
     */
    w.e.tu = function (t, k, h) {
        if (Utf8) {
            var t = Utf8.encode(t || "")
        }
        return t;
    };

    /**
     * base64加密文本
     */
    w.e.t64 = function (t, k, h) {
        if (Base64) {
            var t = Base64.encode(t || "")
        }
        return t;
    };

    /**
     * 使用各种加密手段
     * 
     * @param {Uint8Array} b Uint8Arry数据
     * @param {[string]} m 模式
     * @param {null|[]} k 密钥
     * @param {null|[]} h 文件头
     * 
     */
    w.e.use = function (b, m, k, h, v) {
        var l = w.l(m)
        for (var i = l - 1; i >= 0; i--) {
            if (!b) { return false }
            //Decrypter.log(b, m[i])
            var b = !!this[m[i]] && this[m[i]](b, k, h, v)
        }
        return b
    };

    /**加密 */
    w.encrypt = function (b, f, m, k, h, v) {
        var b = f ? w.bbu(b) : b
        var b = w.bub(b)
        var m = w.rm(m)
        if (m) {
            b = w.e.use(b, m, k, h, v)
            if (!b) { throw new Error("Encrypt is wrong"); return null }
        }
        return w.bbu(b)
    };


    /**保存密钥 */
    w.saveMY = function (k, n) {
        var k = k || window.prompt("输入", "");
        var t = w.e.tl64(JSON.stringify([w.m2, w.k2, w.h2, w.uh]))
        var t2 = w.encrypt(t, 1, ["ex"], w.t2b(k), [])
        var t2 = JSON.stringify(t2)


        var t1 = '(function(){var b={d:{},e:{},ei:function(a,e,c){var d=b.l(a);c=c||0;for(var g=0,f=0,h=0>=c?c-2:0;h<c;h++)g+=e,f+=a[g%d];return f%e},rm:function(a){return"string"==typeof a?b.m[a]||b.m:a||b.m},mh:function(a){var b=[];for(i=0;i<a.length;i+=2)b.push(parseInt("0x"+a.substr(i,2),16));return b},rh:function(a){return a||b.h},rk:function(a){return a||b.k},t2b:function(a){for(var e=b.l(a)/2,c=[],d=0;d<e;d++)if(c[d]=parseInt(a.substr(d+d,2),16),isNaN(c[d]))return b.tb(a);return c},u:function(a){return new Uint8Array(a)},l:function(a){return a?a.length||a.byteLength||0:0},bt:function(a){for(var e=b.l(a),c=[],d=0;d<e;d++)c[d]=String.fromCharCode(a[d]);return c.join("")},tb:function(a){for(var e=b.l(a),c=b.u(e),d=0;d<e;d++)c[d]=a.charCodeAt(d);return c},ab:function(a){return b.u(a)},ba:function(a){return(a||b.u()).buffer}};b.d.header=function(a,e,c){e=b.rh(c);if(a){b.l(a);c=b.l(e);for(var d=0;d<c;d++)if(a[d]!=e[d])return!1;return b.u(a.subarray(c))}return!1};b.d.mv=function(a,e,c){if(a)for(e=b.rk(e),c=b.l(e),i=0;i<c;i++)a[i]^=e[i];return a};b.d.exb=function(a,e,c,d){if(a){e=b.rk(e);c=b.l(a);var g=b.l(e);if(c&&g){var f=b.ei(e,c,d);d=a[f];d^=e[f%g];a[f]=d;for(var h=0;h<c;h++)if(h!=f){var k=e[d%g];d=a[h];d^=k;a[h]=d}}}return a};b.d.ex=function(a,b,c){return this.exb(a,b,c)};b.d.zlib=function(a,b,c){a&&Zlib&&(a=(new Zlib.Inflate(a)).decompress());return a};b.d.lzma=function(a,e,c){a&&LZMA&&(a=b.u(LZMA.decompress(a)));return a};b.d.pako=function(a,b,c){a&&pako&&(a=pako.inflate(a));return a};b.d.aes=function(a,e,c){a&&Aes&&(a=Aes.Ctr.decrypt(a,b.rk(e),256,2));return a};b.d.tl64=function(a,b,c){return LZString.decompressFromBase64(a)};b.d.tl=function(a,b,c){return LZString.compress(a)};b.d.taes=function(a,e,c){a&&Aes&&(a=Aes.Ctr.decrypt(a,b.rk(e),256,0));return a};b.d.tu=function(a,b,c){Utf8&&(a=Utf8.decode(a));return a};b.d.t64=function(a,b,c){a&&(a=Base64.decode(a));return a};b.d.use=function(a,e,c,d){for(var g=b.l(e),f=0;f<g;f++){if(!a)return!1;a=!!this[e[f]]&&this[e[f]](a,c,d)}return a};b.decrypt=function(a,e,c,d,g){if(!a)return null;c=b.rm(c);a=b.ab(a);if(c&&(a=b.d.use(a,c,d,g),!a))throw Error("Decrypt is wrong");return e?1==e?b.d.tu(b.bt(a)):a:b.ba(a)};b.load=function(){b.m=JSON.parse(b.m2);b.h=b.uh?b.mh(b.h2):b.t2b(b.h2);b.k=b.t2b(b.k2)};Decrypter.decrypt=b.decrypt.bind(b);b.s='
         
        
        
        var t3 = ';b.loadMY=function(a){a=a||window.prompt("\u8f93\u5165","");a=b.decrypt(b.s.data,1,["ex"],b.t2b(a),[]);a=JSON.parse(b.d.tl64(a));b.m2=a[0];b.k2=a[1];b.h2=a[2];b.uh=a[3];b.load();return!0};b.loadMY()})();'
        Decrypter.log(t1, t2, t3)
        Decrypter.log(t1 + t2 + t3)

        var n = n || window.prompt("输入", "") || "miyao"
        var n = Decrypter.localFileName("js/plugins/" + n + ".js")
        var fs = require('fs');
        fs.writeFileSync(n, t1 + t2 + t3);
    }

    Decrypter.log(encrypt = w)

    Decrypter.encrypt = w.encrypt.bind(w)
    Decrypter.saveMY = w.saveMY.bind(w)


})();