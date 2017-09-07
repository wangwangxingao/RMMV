//=============================================================================
// Decrypter.js
//=============================================================================
/*:
 * @plugindesc 仿mv加密
 * @author wangwang
 *
 * @param Decrypter
 * @desc 仿mv加密
 * @default 1.0
 *
 * @param miyao
 * @desc 输入密钥
 * @default 测试
 *
 * @param mode
 * @desc 模式(mv原版加密)
 * @default true
 * 
 * @param dir
 * @desc 保存位置
 * @default encrypt/
 * 
 * @param listname
 * @desc 更新列表名称
 * @default uplist.json
 * 
 * @param encryptList
 * @desc 加密列表,如 : ["img","data","audio","js","js/plugins"]
 * @default   ["img","audio","data","js"]
 * 
 * @param ignoreList
 * @desc 忽略列表
 * @default []
 * 
 * @param weburl
 * @desc 游戏更新网站
 * @default https://raw.githubusercontent.com/wangwangxingao/world/master
 * 
 * 
 * @param exthash
 * @desc 加密后缀
 * @default {"ogg":".rpgmvo","m4a":".rpgmvm","png":".rpgmvp","js":".rpgmvj","json":".rpgmvd"}
 * 
 * @param modehash
 * @desc 加密方式
 * @default {"ogg":"buffer","m4a":"buffer","png":"buffer","js":"text","json":"text"}
 * 
 * @help 
 * 
 * 
 * 
 * 
 *
 */


var MD5 = function (e) { function g(a, b) { var c, d, e, f; e = a & 2147483648; f = b & 2147483648; c = a & 1073741824; d = b & 1073741824; a = (a & 1073741823) + (b & 1073741823); return c & d ? a ^ 2147483648 ^ e ^ f : c | d ? a & 1073741824 ? a ^ 3221225472 ^ e ^ f : a ^ 1073741824 ^ e ^ f : a ^ e ^ f } function h(a, b, c, d, e, f, n) { a = g(a, g(g(b & c | ~b & d, e), n)); return g(a << f | a >>> 32 - f, b) } function k(a, b, c, d, e, f, n) { a = g(a, g(g(b & d | c & ~d, e), n)); return g(a << f | a >>> 32 - f, b) } function l(a, b, d, c, e, f, n) { a = g(a, g(g(b ^ d ^ c, e), n)); return g(a << f | a >>> 32 - f, b) } function m(a, b, d, c, e, f, n) { a = g(a, g(g(d ^ (b | ~c), e), n)); return g(a << f | a >>> 32 - f, b) } function p(a) { var b = "", d, c; for (c = 0; 3 >= c; c++)d = a >>> 8 * c & 255, d = "0" + d.toString(16), b += d.substr(d.length - 2, 2); return b } var f = [], q, r, t, u, a, b, c, d; e = function (a) { a = a.replace(/\r\n/g, "\n"); for (var b = "", d = 0; d < a.length; d++) { var c = a.charCodeAt(d); 128 > c ? b += String.fromCharCode(c) : (127 < c && 2048 > c ? b += String.fromCharCode(c >> 6 | 192) : (b += String.fromCharCode(c >> 12 | 224), b += String.fromCharCode(c >> 6 & 63 | 128)), b += String.fromCharCode(c & 63 | 128)) } return b }(e); f = function (a) { var b, c = a.length; b = c + 8; for (var d = 16 * ((b - b % 64) / 64 + 1), e = Array(d - 1), f, g = 0; g < c;)b = (g - g % 4) / 4, f = g % 4 * 8, e[b] |= a.charCodeAt(g) << f, g++; b = (g - g % 4) / 4; e[b] |= 128 << g % 4 * 8; e[d - 2] = c << 3; e[d - 1] = c >>> 29; return e }(e); a = 1732584193; b = 4023233417; c = 2562383102; d = 271733878; for (e = 0; e < f.length; e += 16)q = a, r = b, t = c, u = d, a = h(a, b, c, d, f[e + 0], 7, 3614090360), d = h(d, a, b, c, f[e + 1], 12, 3905402710), c = h(c, d, a, b, f[e + 2], 17, 606105819), b = h(b, c, d, a, f[e + 3], 22, 3250441966), a = h(a, b, c, d, f[e + 4], 7, 4118548399), d = h(d, a, b, c, f[e + 5], 12, 1200080426), c = h(c, d, a, b, f[e + 6], 17, 2821735955), b = h(b, c, d, a, f[e + 7], 22, 4249261313), a = h(a, b, c, d, f[e + 8], 7, 1770035416), d = h(d, a, b, c, f[e + 9], 12, 2336552879), c = h(c, d, a, b, f[e + 10], 17, 4294925233), b = h(b, c, d, a, f[e + 11], 22, 2304563134), a = h(a, b, c, d, f[e + 12], 7, 1804603682), d = h(d, a, b, c, f[e + 13], 12, 4254626195), c = h(c, d, a, b, f[e + 14], 17, 2792965006), b = h(b, c, d, a, f[e + 15], 22, 1236535329), a = k(a, b, c, d, f[e + 1], 5, 4129170786), d = k(d, a, b, c, f[e + 6], 9, 3225465664), c = k(c, d, a, b, f[e + 11], 14, 643717713), b = k(b, c, d, a, f[e + 0], 20, 3921069994), a = k(a, b, c, d, f[e + 5], 5, 3593408605), d = k(d, a, b, c, f[e + 10], 9, 38016083), c = k(c, d, a, b, f[e + 15], 14, 3634488961), b = k(b, c, d, a, f[e + 4], 20, 3889429448), a = k(a, b, c, d, f[e + 9], 5, 568446438), d = k(d, a, b, c, f[e + 14], 9, 3275163606), c = k(c, d, a, b, f[e + 3], 14, 4107603335), b = k(b, c, d, a, f[e + 8], 20, 1163531501), a = k(a, b, c, d, f[e + 13], 5, 2850285829), d = k(d, a, b, c, f[e + 2], 9, 4243563512), c = k(c, d, a, b, f[e + 7], 14, 1735328473), b = k(b, c, d, a, f[e + 12], 20, 2368359562), a = l(a, b, c, d, f[e + 5], 4, 4294588738), d = l(d, a, b, c, f[e + 8], 11, 2272392833), c = l(c, d, a, b, f[e + 11], 16, 1839030562), b = l(b, c, d, a, f[e + 14], 23, 4259657740), a = l(a, b, c, d, f[e + 1], 4, 2763975236), d = l(d, a, b, c, f[e + 4], 11, 1272893353), c = l(c, d, a, b, f[e + 7], 16, 4139469664), b = l(b, c, d, a, f[e + 10], 23, 3200236656), a = l(a, b, c, d, f[e + 13], 4, 681279174), d = l(d, a, b, c, f[e + 0], 11, 3936430074), c = l(c, d, a, b, f[e + 3], 16, 3572445317), b = l(b, c, d, a, f[e + 6], 23, 76029189), a = l(a, b, c, d, f[e + 9], 4, 3654602809), d = l(d, a, b, c, f[e + 12], 11, 3873151461), c = l(c, d, a, b, f[e + 15], 16, 530742520), b = l(b, c, d, a, f[e + 2], 23, 3299628645), a = m(a, b, c, d, f[e + 0], 6, 4096336452), d = m(d, a, b, c, f[e + 7], 10, 1126891415), c = m(c, d, a, b, f[e + 14], 15, 2878612391), b = m(b, c, d, a, f[e + 5], 21, 4237533241), a = m(a, b, c, d, f[e + 12], 6, 1700485571), d = m(d, a, b, c, f[e + 3], 10, 2399980690), c = m(c, d, a, b, f[e + 10], 15, 4293915773), b = m(b, c, d, a, f[e + 1], 21, 2240044497), a = m(a, b, c, d, f[e + 8], 6, 1873313359), d = m(d, a, b, c, f[e + 15], 10, 4264355552), c = m(c, d, a, b, f[e + 6], 15, 2734768916), b = m(b, c, d, a, f[e + 13], 21, 1309151649), a = m(a, b, c, d, f[e + 4], 6, 4149444226), d = m(d, a, b, c, f[e + 11], 10, 3174756917), c = m(c, d, a, b, f[e + 2], 15, 718787259), b = m(b, c, d, a, f[e + 9], 21, 3951481745), a = g(a, q), b = g(b, r), c = g(c, t), d = g(d, u); return (p(a) + p(b) + p(c) + p(d)).toUpperCase() };
var MD5_2 = function (data) { try { return require('crypto').createHash('md5').update(data).digest('hex').toUpperCase() } catch (e) { return "D41D8CD98F00B204E9800998ECF8427E" }; };



Graphics._onKeyDown = function (event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
            case 113:   // F2
                event.preventDefault();
                this._switchFPSMeter();
                break;
            case 114:   // F3
                event.preventDefault();
                this._switchStretchMode();
                break;
            case 115:   // F4
                event.preventDefault();
                this._switchFullScreen();
                break;
            case 117:   // F6
                Decrypter.startUpdate()
                break
        }
    }
};


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

Decrypter.hasEncryptedImages = false;
Decrypter.hasEncryptedAudio = false;
Decrypter.hasEncryptedData = false;

Decrypter._requestImgFile = [];
Decrypter._headerlength = 16;
Decrypter._xhrOk = 400;
Decrypter._encryptionKey = "";
Decrypter._ignoreList = [
    "img/system/Window.png"
];
Decrypter.SIGNATURE = "5250474d56000000";
Decrypter.VER = "000301";
Decrypter.REMAIN = "0000000000";




/**检查是否需要跳过*/
Decrypter.checkImgIgnore = function (url) {
    for (var cnt = 0; cnt < this._ignoreList.length; cnt++) {
        if (url === this._ignoreList[cnt]) return true;
    }
    return false;
};


Decrypter.evalIni = function (keys, cl) {
    var l = this._headerlength
    return (keys[cl % l] + keys[(cl + cl) % l]) % cl
}



/**读取加密键 */
Decrypter.readEncryptionkey = function () {
    if (!this._encryptionKey) {
        var encryptionKey = Decrypter._encryptionKey2.split(/(.{2})/).filter(Boolean);
        var keys = []
        for (var i = 0; i < this._headerlength; i++) {
            keys[i] = parseInt(encryptionKey[i], 16)
        }
        this._encryptionKey = keys
    }
    return this._encryptionKey
};




/**切arraybuffer头*/
Decrypter.cutArrayHeader = function (arrayBuffer, length) {
    return arrayBuffer.slice(length);
};
/**创建 blob url地址*/
Decrypter.createBlobUrl = function (arrayBuffer) {
    var blob = new Blob([arrayBuffer]);
    var url = window.URL.createObjectURL(blob)
    return url;
};

/**后缀 到 加密后缀 */

Decrypter._extToEncryptExt = {}
Decrypter.extToEncryptExt = function (url, t) {
    var t = t ? "1" : "0"
    var n = t + url
    if (this._extToEncryptExt[n]) {
        return this._extToEncryptExt[n]
    } else {

        var n0 = "0" + url
        var n1 = "1" + url

        var ext = url.split('.').pop();
        var encryptedExt = ext;
        var exts = this._exthash
        if (ext !== url) {
            encryptedExt = (exts && exts[ext]) || "." + ext;
            var url2 = url.slice(0, url.lastIndexOf(ext) - 1) + encryptedExt
        } else {
            var url2 = url
        };
        this._extToEncryptExt[n1] = this.webFileName(this._dir + url2)
        this._extToEncryptExt[n0] = this.localFileName(this._dir + url2)
        return this._extToEncryptExt[n]
    }
}


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

PluginManager.loadScript2 = function (src, path) {
    function IncludeJS(url, source) {
        if (source != null) {
            var body = document.getElementsByTagName('body').item(0);
            var s = document.createElement("script");
            s.language = "javascript";
            s.type = "text/javascript";
            try {
                //IE8以及以下不支持这种方式，需要通过text属性来设置
                s.appendChild(document.createTextNode(source));
            }
            catch (ex) {
                s.text = source;
            }
            s.id = url;
            body.appendChild(s);
        }
    }
    if (Decrypter.hasEncryptedJS) {
        var xhr = new XMLHttpRequest();
        var url = path ? 'js/' + src : PluginManager._path + src;
        if (!Decrypter.checkImgIgnore(url)) {
            var url = Decrypter.extToEncryptExt(url)
            xhr.responseType = "arraybuffer"
            xhr.onload = function () {
                if (xhr.status < 400) {
                    IncludeJS(url, Decrypter.decryptText(xhr.response))
                }
            };
        } else {
            xhr.overrideMimeType('application/json');
            xhr.onload = function () {
                if (xhr.status < 400) {
                    IncludeJS(url, xhr.responseText)
                }
            };
        }
        xhr.onerror = function () {
            DataManager._errorUrl = DataManager._errorUrl || url;
        };
        xhr.open('GET', url, false);
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
    PluginManager.loadScript2('plugins2.js', 1)
    PluginManager.setup2($plugins)
};



/**解密 arraybuffer */
Decrypter.decryptArrayBuffer = function (arrayBuffer) {
    if (Decrypter._encryptMode) {
        return this.decryptArrayBufferMV(arrayBuffer)
    } else {
        return this.decryptArrayBufferEX(arrayBuffer)
    }
};

/**解密 arraybuffer mv版 */
Decrypter.decryptArrayBufferMV = function (arrayBuffer) {
    if (!arrayBuffer) return new ArrayBuffer(0);
    var header = new Uint8Array(arrayBuffer, 0, this._headerlength);
    var i;
    var ref = this.SIGNATURE + this.VER + this.REMAIN;
    var refBytes = new Uint8Array(16);
    for (i = 0; i < this._headerlength; i++) {
        refBytes[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
    }
    for (i = 0; i < this._headerlength; i++) {
        if (header[i] !== refBytes[i]) {
            throw new Error("Header is wrong");
        }
    }
    arrayBuffer = this.cutArrayHeader(arrayBuffer, Decrypter._headerlength);
    var keys = this.readEncryptionkey();
    if (arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer);
        for (i = 0; i < this._headerlength; i++) {
            var key = keys[i]
            var code = byteArray[i]
            byteArray[i] = key ^ code
        }
    }
    return arrayBuffer;
};

/**解密 arraybuffer  加强版 */
Decrypter.decryptArrayBufferEX = function (arrayBuffer) {
    if (!arrayBuffer) {
        return null;
    }
    var header = new Uint8Array(arrayBuffer, 0, this._headerlength);
    var i;
    var ref = this.SIGNATURE + this.VER + this.REMAIN;
    var refBytes = new Uint8Array(16);
    for (i = 0; i < this._headerlength; i++) {
        refBytes[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
    }
    for (i = 0; i < this._headerlength; i++) {
        if (header[i] !== refBytes[i]) {
            throw new Error("Header is wrong");
        }
    }
    var keys = this.readEncryptionkey();
    var arrayBuffer = this.cutArrayHeader(arrayBuffer, Decrypter._headerlength);
    var byteArray = new Uint8Array(arrayBuffer);
    var cl = byteArray.length
    if (cl > 0) {
        var keys = this._encryptionKey

        var ini = this.evalIni(keys, cl)

        var keyid = ini
        var i = ini

        var key = keys[keyid % 16]
        var code = byteArray[i]
        var tcode = key ^ code
        var keyid0 = tcode

        var keyid = -1
        for (var i = 0; i < cl; i++) {
            if (i == ini) {
                var tcode = keyid0
            } else {
                if (keyid == -1) {
                    keyid = keyid0
                }
                var key = keys[keyid % 16]
                var code = byteArray[i]
                var tcode = key ^ code
                keyid = tcode
            }
            byteArray[i] = tcode
        }
    }
    return arrayBuffer;
};


/**解密文本 */
Decrypter.decryptText = function (arrayBuffer) {
    //如果(不是 二进制缓存)返回 null
    if (!arrayBuffer) {
        return null;
    }

    //头 = 新 Uint8数组(二进制缓存 , 0 , 头长度)
    var header = new Uint8Array(arrayBuffer, 0, this._headerlength);
    var i;
    var ref = this.SIGNATURE + this.VER + this.REMAIN;
    var refBytes = new Uint8Array(16);
    for (i = 0; i < this._headerlength; i++) {
        refBytes[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
    }
    for (i = 0; i < this._headerlength; i++) {
        if (header[i] !== refBytes[i]) {
            throw new Error("Header is wrong");
        }
    }
    //读取加密键()
    var keys = this.readEncryptionkey();
    var arrayBuffer = this.cutArrayHeader(arrayBuffer, Decrypter._headerlength);
    var byteArray = new Uint8Array(arrayBuffer);
    var t = ""
    var cl = byteArray.length
    if (cl > 0) {

        var ini = this.evalIni(keys, cl)

        var keyid = ini
        var i = ini

        var key = keys[keyid % 16]
        var code = byteArray[i]
        var tcode = key ^ code

        var keyid0 = tcode

        var keyid = -1
        for (var i = 0; i < cl; i++) {
            if (i == ini) {
                var tcode = keyid0
            } else {
                if (keyid == -1) {
                    keyid = keyid0
                }
                var key = keys[keyid % 16]
                var code = byteArray[i]
                var tcode = key ^ code
                keyid = tcode
            }
            t += String.fromCharCode(tcode)
        }
    }
    var data = LZString.decompressFromBase64(t)
    return data;
};


/**获取*/
Decrypter.param = function () {
    var parse = function (i, type) {
        try {
            if (type) {
                return i
            }
            var i = JSON.parse(i)
            return i
        } catch (e) {
            return i
        }
    }

    var find = function (name) {
        var parameters = PluginManager._parameters[name];
        if (parameters) {
        } else {
            var pls = PluginManager._parameters
            for (var n in pls) {
                if (pls[n] && (name in pls[n])) {
                    parameters = pls[n]
                }
            }
        }
        return parameters = parameters || {}
    }
    var get = function (p, n, unde) {
        try {
            var i = p[n]
        } catch (e) {
            var i = unde
        }
        return i === undefined ? unde : i
    }
    var p = find("Decrypter")

    this._encryptMode =  parse(get(p, "mode")) || false
    this._dir = get(p, "dir") ||""
    this._ignoreList = parse(get(p, "ignoreList")) ||[]
    this._encryptList = parse(get(p, "encryptList")) ||[]
    this._exthash = parse(get(p, "exthash")) ||{}
    this._modehash = parse(get(p, "modehash")) ||{}

    this._webURL = get(p, "weburl") ||""
    this._listname = get(p, "listname") ||""


    var have = function (i) {
        return (this._encryptList.indexOf(i) >= 0)
    }
    var data = have("data")
    var img = have("img")
    var audio = have("audio")
    var js = (have("js") || have("js/plugins"))
    var video = have("movies")

    Decrypter._encryptionKey2 = MD5(get(p, "miyao"))
    Decrypter.hasEncryptedImages = img;
    Decrypter.hasEncryptedAudio = audio;
    Decrypter.hasEncryptedData = data;
    Decrypter.hasEncryptedJS = js;
    Decrypter.hasEncryptedVideo = video;

     

    Decrypter.readEncryptionkey()

    try {
        PluginManager.start()

    } catch (error) {

    }
};





/**
 * 
 * 
 * 
 * 加密部分
 * 
 * 
 * 
 * 
 */
/**制作头为了 ArrayBuffer  */
Decrypter._makeheader = null
Decrypter.makeHeader = function () {
    if (!Decrypter._makeheader) {
        var header = new Buffer(16);
        var ref = Decrypter.SIGNATURE + Decrypter.VER + Decrypter.REMAIN;
        for (i = 0; i < Decrypter._headerlength; i++) {
            header[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
        }
        Decrypter._makeheader = header
    }
    return Decrypter._makeheader
}




Decrypter.getEncryptMust = function (url) {
    if (this.checkImgIgnore(url)) {
        return null
    }
    var ext = url.split('.').pop();
    var modes = this._modehash 
    if (!this.hasEncryptedAudio) { 
        if (ext === "ogg"||ext === "m4a") {
            return null 
        }
    }
    if (!this.hasEncryptedImages) {
        if (ext === "png") {
            return null;
        }
    }
    if (!this.hasEncryptedData) {
        if (ext === "json") {
            return null;
        }
    }
    if (!this.hasEncryptedJS) {
        if (ext === "js") {
            return null;
        }
    }
    return modes[ext] || null 
};


/**加密文本 */
Decrypter.encryptText = function (data) {
    if (!data) {
        data = ""
    }
    var s = LZString.compressToBase64(data);
    var buffer = new Buffer(s)
    return this.encryptBufferEX(buffer)
}

/**加密 ArrayBuffer */
Decrypter.encryptArrayBuffer = function (arrayBuffer) {
    if (this._encryptMode) {
        return this.encryptArrayBufferMV(arrayBuffer)
    } else {
        return this.encryptArrayBufferEX(arrayBuffer)
    }
}

/**加密 ArrayBuffer */
Decrypter.encryptArrayBufferEX = function (arrayBuffer) {
    var buffer = null
    if (arrayBuffer) {
        var buffer = new Buffer(new Uint8Array(arrayBuffer));
    }
    return this.encryptBufferEX(buffer)
}

/**加密 ArrayBuffer */
Decrypter.encryptArrayBufferMV = function (arrayBuffer) {
    var buffer = null
    if (arrayBuffer) {
        var buffer = new Buffer(new Uint8Array(arrayBuffer));
    }
    return this.encryptBufferMV(buffer)
}
Decrypter.encryptBuffer = function (buffer) {
    if (this._encryptMode) {
        return this.encryptBufferMV(buffer)
    } else {
        return this.encryptBufferEX(buffer)
    }
}

/**加密 buffer */
Decrypter.encryptBufferMV = function (buffer) {
    var eD = []
    if (!buffer) {
        var buffer = new buffer()
    } else {
        var keys = Decrypter._encryptionKey
        for (i = 0; i < this._headerlength; i++) {
            var key = keys[i]
            var code = buffer[i]
            buffer[i] = key ^ code
        }
    }
    eD = [this.makeHeader(), buffer]
    eD = Buffer.concat(eD)
    return eD
}


/**加密*/
Decrypter.encryptBufferEX = function (buffer) {
    var eD = []
    var buffer = buffer
    if (!buffer) {
        var buffer = new Buffer()
    } else {
        var cl = buffer.length
        if (cl > 0) {
            var keys = this._encryptionKey
            var ini = this.evalIni(keys, cl)

            var keyid = ini
            var i = ini

            var code = buffer[i]
            var key = keys[keyid % 16]
            var tcode = code ^ key
            buffer[i] = tcode
            var keyid0 = code

            var keyid = -1
            for (var i = 0; i < cl; i++) {
                if (i == ini) { } else {
                    if (keyid == -1) {
                        keyid = keyid0
                    }
                    var code = buffer[i]
                    var key = keys[keyid % 16]
                    var tcode = code ^ key
                    buffer[i] = tcode
                    keyid = code
                }
            }
        }
    }
    eD = [this.makeHeader(), buffer]
    eD = Buffer.concat(eD)
    return eD
}



Decrypter._localURL = ""
Decrypter.localURL = function () {
    if (!this._localURL) {
        var pathname = window.location.pathname
        var path = pathname.replace(/(\/www|)\/[^\/]*$/, "");
        if (path.match(/^\/([A-Z]\:)/)) {
            path = path.slice(1);
        }
        this._localURL = decodeURIComponent(path);
    }
    return this._localURL
};


Decrypter._dirs = {}
/**本地文件位置名称 */
Decrypter.localFileName = function (name) {
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



Decrypter.encryptSave = function () {
    if (!Utils.isNwjs()) {
        console.log("not is Nwjs")
        return {}
    }
    var o = {}
    var o2 = {}
    var list = Decrypter._encryptList
    var dir = this.localURL()
    var fs = require('fs');
    var get = function (f) {
        var p = f ? dir + "/" + f : dir
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
        var url = this.localFileName(n)
        if (v == "text") {
            var data = fs.readFileSync(url, "utf-8")
            var buffer = this.encryptText(data)
        } else if (v == "buffer") {
            var data = fs.readFileSync(url)
            var buffer = this.encryptBuffer(data)
        }
        o2[n] = MD5_2(buffer)
        var url = Decrypter.extToEncryptExt(n)
        fs.writeFileSync(url, buffer)
    }
    var data = JSON.stringify(o2)
    var buffer = this.encryptText(data)
    var n = this.listname()
    var url = Decrypter.extToEncryptExt(n)
    console.log(o2, n, url)
    fs.writeFileSync(url, buffer)
    return o2
}




Decrypter._uplist = null
Decrypter.uplist = function () {
    return this._uplist
};

Decrypter._webURL = ""
Decrypter.webURL = function () {
    return this._webURL
};
Decrypter.webFileName = function (name) {
    return this.webURL() + "/" + name
}

Decrypter._listname = ""
/**列表名称 */
Decrypter.listname = function () {
    return this._listname
};


/**获取网络列表 */
Decrypter.startUpdate = function () {
    this.param()
    if (this._webURL && this.isLocalMode()) {
        this.initUL()
        this._weblist = null
        this._locallist = null

        this.getwebList()
        this.getLocalList()

    } else {
        alert("无法保存到本地")
        this._uplist = null
        this.endUpdate()
    }
};


Decrypter.isUpdateEnd = function () {
    return this._endupdate;
};

/**获取网络列表 */
Decrypter.getwebList = function () {
    var name = this.listname()
    this.updateUL(name, "web")

    var xhr = new XMLHttpRequest();
    var url = this.extToEncryptExt(name, 1);
    xhr.open('GET', url);
    xhr.responseType = "arraybuffer"
    xhr.onload = function () {
        if (xhr.status < 400) {
            try {
                Decrypter._webre = xhr.response
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

Decrypter.makelist = function () {
    if (!Utils.isNwjs()) {
        console.log("not is Nwjs")
        return {}
    }
    var o2 = {}
    var o = {}
    var list = Decrypter._encryptList
    var dir = this.localURL()
    var fs = require("fs")
    var get = function (f) {
        var p = f ? dir + "/" + f : dir
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
            var buffer = data
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

Decrypter.onLoadList = function () {
    if (this._weblist && this._locallist) {
        if (this._weblist == "err") {
            console.log("找不到网络更新列表")
            Decrypter.updateUL(this.listname(), "err")
            return
        }

        if (this._locallist == "err") {
            console.log("找不到本地更新列表")
            this._locallist = Decrypter.makelist(-1)
            console.log("创建本地更新列表")
        }
        var l = this._locallist
        var w = this._weblist
        for (var n in l) {
            if (w[n]) {
                if (l[n] != w[n]) {
                    this.updateUL(n, "up")
                }
            } else {
                this.updateUL(n, "del")
            }
        }
        for (var n in w) {
            if (!l[n]) {
                this.updateUL(n, "up")
            }
        }
        this.mustUpdate()
    }
};


Decrypter.mustUpdate = function () {
    var o = this.uplist()
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
        if (o.all !== 1) {
            Decrypter.saveweb2(this.listname(), new Buffer(new Uint8Array(this._webre)))
        } else {
            Decrypter.updateUL("not must", "end")
        }
    } else {
        Decrypter.updateUL("not uplist", "end")
    }
};



Decrypter.initUL = function () {
    this._uplist = { list: {}, up: {}, del: {}, end: {}, err: {}, all: 0 }
    return this._uplist
};

Decrypter.updateUL = function (n, st) {
    var o = this.uplist()
    o.list[n] = st
    if (st == "err") {
        o.err[n] = 1
        o.all--
    } else if (st == "end") {
        o.end[n] = 1
        o.all--
    } else if (st == "up") {
        o.up[n] = 1
        o.all++
    } else if (st == "del") {
        o.del[n] = 1
        o.all++
    } else {
        o.all++
    }
    if (o.all <= 0) {
        this.endUL()
    }
    console.log(o.all + "  " + n + "    " + st)
};


Decrypter.endUL = function () { alert('end') }


Decrypter.saveweb = function (n) {
    var xhr = new XMLHttpRequest();
    var url = Decrypter.extToEncryptExt(n, 1)
    xhr.open('GET', url);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
        if (xhr.status < 400) {
            Decrypter.saveweb2(n, new Buffer(new Uint8Array(xhr.response)));
        }
    };
    xhr.onerror = function () {
        console.log("找不到" + url)
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

/**保存文件 */
Decrypter.saveFile = function (n, t) {
    var fs = require('fs');
    var filePath = Decrypter.extToEncryptExt(n)
    fs.writeFileSync(filePath, t);
};

/**删除文件 */
Decrypter.delFile = function (n) {
    var fs = require('fs');
    var filePath = Decrypter.extToEncryptExt(n)
    fs.unlinkSync(filePath);
};

/**是本地 */
Decrypter.isLocalMode = function () {
    //Utils 是Nwjs()
    return Utils.isNwjs();
};

Decrypter.param()
