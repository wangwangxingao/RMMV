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
 * @param SIGNATURE
 * @desc 游戏签名:
 * @default RMMV
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
 * @desc 模式(mv原版加密)
 * @default ['base','zlib']
 * 
 * @param dir
 * @desc 保存位置
 * @default encrypt/
 * 
 * @param encryptList
 * @desc 加密列表,如 : ["img","data","audio","js","js/plugins"]
 * @default   ["img","audio","data","js/plugins"]
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
 * @default plugins.js
 * 
 * @param ignoreList
 * @desc 忽略列表
 * @default []
 * 
 * @param weburl
 * @desc 游戏更新网站
 * @default https://raw.githubusercontent.com/wangwangxingao/world/master
 * 
 * @param listname
 * @desc 更新列表名称
 * @default updateList.json
 * 
 *
 * @help 
 * 生成加密文件
 * Decrypter.startEncrypt()
 * 开始更新
 * Decrypter.startUpdate()
 * 
 *
 */



var MD5 = function(e) {
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
    e = function(a) {
        a = a.replace(/\r\n/g, "\n");
        for (var b = "", d = 0; d < a.length; d++) {
            var c = a.charCodeAt(d);
            128 > c ? b += String.fromCharCode(c) : (127 < c && 2048 > c ? b += String.fromCharCode(c >> 6 | 192) : (b += String.fromCharCode(c >> 12 | 224), b += String.fromCharCode(c >> 6 & 63 | 128)), b += String.fromCharCode(c & 63 | 128))
        }
        return b
    }(e);
    f = function(a) {
        var b, c = a.length;
        b = c + 8;
        for (var d = 16 * ((b - b % 64) / 64 + 1), e = Array(d - 1), f, g = 0; g < c;) b = (g - g % 4) / 4, f = g % 4 * 8, e[b] |= a.charCodeAt(g) << f, g++;
        b = (g - g % 4) / 4;
        e[b] |= 128 << g % 4 * 8;
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
var MD5_2 = function(data) { try { return require('crypto').createHash('md5').update(data).digest('hex').toUpperCase() } catch (e) { return "D41D8CD98F00B204E9800998ECF8427E" }; };


/**
 * 读取数据文件
 * @param {string} name 名称
 * @param {string} src 地址
 */
DataManager.loadDataFile = function(name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'data/' + src;
    if (Decrypter.hasEncryptedData && !Decrypter.checkImgIgnore(url)) {
        var url = Decrypter.extToEncryptExt(url)
        xhr.open('GET', url);
        xhr.responseType = "arraybuffer"
        xhr.onload = function() {
            if (xhr.status < 400) {
                window[name] = JSON.parse(Decrypter.decryptText(xhr.response));
                DataManager.onLoad(window[name]);
            }
        };
    } else {
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function() {
            if (xhr.status < 400) {
                window[name] = JSON.parse(xhr.responseText);
                DataManager.onLoad(window[name]);
            }
        };
    }
    xhr.onerror = function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    window[name] = null;
    xhr.send();
};

/**
 * 读取
 * @param {{}} object 对象
 */
DataManager.onLoad = function(object) {
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


Graphics._playVideo = function(src) {
    if (Decrypter.hasEncryptedVideo && !Decrypter.checkImgIgnore(src)) {
        var requestFile = new XMLHttpRequest();
        requestFile.open("GET", src);
        requestFile.responseType = "arraybuffer";
        requestFile.send();
        requestFile.onload = function() {
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
Graphics._playVideo2 = function(url) {
    this._video.onloadeddata = this._onVideoLoad.bind(this);
    this._video.onerror = this._videoLoader;
    this._video.onended = this._onVideoEnd.bind(this);
    this._videoLoading = true;
    this._video.src = url;
    this._video.load();
};

PluginManager._loadScriptEnd = []
PluginManager.loadScriptEnd = function(url, response) {

    var IncludeJS = function(re) {
        eval(re.response)
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
PluginManager.loadScript2 = function(src, path) {
    if (Decrypter.hasEncryptedJS) {
        var xhr = new XMLHttpRequest();
        var url = path ? 'js/' + src : PluginManager._path + src;
        var url2 = url
        if (!Decrypter.checkImgIgnore(url)) {
            url2 = Decrypter.extToEncryptExt(url)
            xhr.responseType = "arraybuffer"
            xhr.onload = function() {
                if (xhr.status < 400) {
                    PluginManager.loadScriptEnd(url, Decrypter.decryptText(xhr.response))
                }
            };
        } else {
            xhr.overrideMimeType('application/json');
            xhr.onload = function() {
                if (xhr.status < 400) {
                    PluginManager.loadScriptEnd(url, xhr.responseText)
                }
            };
        }
        xhr.onerror = function() {
            DataManager._errorUrl = DataManager._errorUrl || url;
        };
        this._loadScriptEnd.push({ url: url, response: false })
        xhr.open('GET', url2);
        xhr.send();
    };
}


PluginManager.setup2 = function(plugins) {
    //插件组 对每一个 方法(插件)
    plugins.forEach(function(plugin) {
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

PluginManager.start = function() {
    if (Decrypter._plugins) {
        PluginManager.loadScript2(Decrypter._plugins)
    }
};


/**解密图片*/
Decrypter.decryptImg = function(url, bitmap) {
    url = this.extToEncryptExt(url);

    var requestFile = new XMLHttpRequest();
    requestFile.open("GET", url);
    requestFile.responseType = "arraybuffer";
    requestFile.send();

    requestFile.onload = function() {
        if (this.status < Decrypter._xhrOk) {
            var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
            bitmap._image.src = Decrypter.createBlobUrl(arrayBuffer);
            bitmap._image.addEventListener('load', bitmap._loadListener = Bitmap.prototype._onLoad.bind(bitmap));
            bitmap._image.addEventListener('error', bitmap._errorListener = bitmap._loader || Bitmap.prototype._onError.bind(bitmap));
        }
    };

    requestFile.onerror = function() {
        if (bitmap._loader) {
            bitmap._loader();
        } else {
            bitmap._onError();
        }
    };
};



/**解密 音频*/
Decrypter.decryptHTML5Audio = function(url, bgm, pos) {
    var requestFile = new XMLHttpRequest();
    requestFile.open("GET", url);
    requestFile.responseType = "arraybuffer";
    requestFile.send();
    requestFile.onload = function() {
        if (this.status < Decrypter._xhrOk) {
            var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
            var url = Decrypter.createBlobUrl(arrayBuffer);
            AudioManager.createDecryptBuffer(url, bgm, pos);
        }
    };
};



/**切arraybuffer头*/
Decrypter.cutArrayHeader = function(arrayBuffer, length) {
    return arrayBuffer.slice(length);
};
/**创建 blob url地址*/
Decrypter.createBlobUrl = function(arrayBuffer) {
    var blob = new Blob([arrayBuffer]);
    var url = window.URL.createObjectURL(blob)
    return url;
};



/**加密图像 */
Decrypter.hasEncryptedImages = false;
/**加密音频 */
Decrypter.hasEncryptedAudio = false;
/**加密数据 */
Decrypter.hasEncryptedData = false;

Decrypter._requestImgFile = [];
Decrypter._headerlength = 16;
Decrypter._xhrOk = 400;
Decrypter._encryptionKey = "";
Decrypter._ignoreList = [
    "img/system/Window.png"
];
/** */
Decrypter.SIGNATURE = "5250474d56000000";
Decrypter.VER = "000301";
Decrypter.REMAIN = "0000000000";


/**检查是否需要跳过
 * @param {string} url 地址
 * 
 */
Decrypter.checkImgIgnore = function(url) {
    for (var cnt = 0; cnt < this._ignoreList.length; cnt++) {
        if (url === this._ignoreList[cnt]) return true;
    }
    return false;
};

/**计算
 * @param {[]} keys 键组
 * @param {number} cl 长度
 */
Decrypter.evalIni = function(keys, cl) {
    var l = keys.length
    return (keys[cl % l] + keys[(cl + cl) % l]) % cl
}


Decrypter._makeheader = null
Decrypter.makeHeader = function() {
    if (!Decrypter._makeheader) {
        var header = [];
        var ref = "" + Decrypter.SIGNATURE + Decrypter.VER + Decrypter.REMAIN;
        for (i = 0; i < ref.length; i++) {
            header[i] = ref.charCodeAt(i) //parseInt("0x" + ref.substr(i * 2, 2), 16);
        }
        Decrypter._makeheader = header
    }
    return Decrypter._makeheader
}

Decrypter._makeheader = null
Decrypter.makeHeader = function() {
    if (!Decrypter._makeheader) {
        var header = [];
        var ref = Decrypter.SIGNATURE + Decrypter.VER + Decrypter.REMAIN;
        for (i = 0; i < ref.length / 2; i++) {
            header[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
        }
        Decrypter._makeheader = header
    }
    return Decrypter._makeheader
}





/**读取加密键
 * @return  {[]}
 */
Decrypter.readEncryptionkey = function() {
    if (!this._encryptionKey) {
        var encryptionKey = Decrypter._encryptionKey2.split(/(.{2})/).filter(Boolean);
        var keys = []
        for (var i = 0; i < encryptionKey.length; i++) {
            keys[i] = parseInt(encryptionKey[i], 16)
        }
        this._encryptionKey = keys
    }
    return this._encryptionKey
};





/**后缀 到 加密后缀 */
Decrypter._extToEncryptExt = {}
Decrypter.extToEncryptExt = function(url, t) {
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
}




Decrypter.bt = function(byteArray) {
    var l = byteArray ? byteArray.length || byteArray.byteLength : 0
    var plaintxt = new Array(l)
    for (var i = 0; i < l; i++) {
        plaintxt[i] = String.fromCharCode(byteArray[i])
    }
    return plaintxt.join("");
};


Decrypter.tb = function(text) {
    var text = text || ""
    var l = text ? text.length : 0
    var byteArray = new Uint8Array(l)
    for (var i = 0; i < l; i++) {
        byteArray[i] = text.charCodeAt(i)
    }
    return byteArray;
};


Decrypter.ab = function(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer || 0)
    return byteArray;
};


Decrypter.ba = function(byteArray) {
    var byteArray = byteArray || new Uint8Array()
    var arraybuffer = byteArray.buffer
    return arraybuffer;
};


Decrypter.d = {}

Decrypter.d.bmv = function(byteArray) {
    if (byteArray) {
        var l = Decrypter._headerlength
        var keys = Decrypter.readEncryptionkey();
        for (i = 0; i < l; i++) {
            var key = keys[i]
            var code = byteArray[i]
            byteArray[i] = key ^ code
        }
    }
    return byteArray;
};


Decrypter.d.bex = function(byteArray) {
    if (byteArray) {
        var keys = Decrypter.readEncryptionkey();
        var l = byteArray.length || byteArray.byteLength
        if (l > 0) {
            var ini = Decrypter.evalIni(keys, l)
            var keyid = ini
            var code = byteArray[ini]
            var tcode = keys[keyid % 16] ^ code
            byteArray[ini] = tcode
            var keyid = tcode
            for (var i = 0; i < l; i++) {
                if (i == ini) {} else {
                    var key = keys[keyid % 16]
                    var code = byteArray[i]
                    var tcode = key ^ code
                    keyid = tcode
                }
                byteArray[i] = tcode
            }
        }
    }
    return byteArray;
};



Decrypter.d.bzlib = function(byteArray) {
    if (byteArray) {
        if (Zlib) {
            var inflate = new Zlib.Inflate(byteArray);
            var byteArray = inflate.decompress();
        }
    }
    return byteArray;
};



Decrypter.d.baes = function(byteArray) {
    if (byteArray) {
        if (Aes) {
            var keys = Decrypter.readEncryptionkey();
            var byteArray = Aes.Ctr.decrypt(byteArray, keys, 256, 2)
        }
    }
    return byteArray;
};


Decrypter.d.lzma = function(byteArray) {
    if (byteArray) {
        if (LZMA) {
            var byteArray = new Uint8Array(LZMA.decompress(byteArray))
        }
    }
    return byteArray;
};


Decrypter.d.tl = function(text) {
    return LZString.decompressFromBase64(text);
};



/**
 * 用base64加密文字
 */
Decrypter.d.tl = function(text) {
    return LZString.compress(text);
};

Decrypter.d.taes = function(text) {
    if (text) {
        if (Aes) {
            var keys = Decrypter.readEncryptionkey();
            var text = Aes.Ctr.decrypt(text, keys, 256, 0)
        }
    }
    return text;
};





Decrypter.d.header = function(a, b) {
    var b = Decrypter.makeHeader()
    if (a) {
        var c = a ? a.length || a.byteArray : 0
        var d = b ? b.length || b.byteLength : 0
        for (var i = 0; i < d; i++) {
            if (a[i] != b[i]) { return false }
        }
        return new Uint8Array(a.subarray(d))
    }
    return false
};



Decrypter.d.tu = function(text) {
    var text = text || ""
    if (Utf8) {
        text = Utf8.decode(text)
    }
    return text;
};


Decrypter.d.t64 = function(text) {
    var text = text || ""
    if (Base64) {
        text = Base64.decode(text)
    }
    return text;
};


Decrypter.d.use = function(b, l) {
    if (l) {
        for (var i = 0; i < l.length; i++) {
            var b = this[l[i]](b)
        }
    }
    return b
};


Decrypter.decrypt = function(arrayBuffer, t) {
    if (!arrayBuffer) { return null }
    var b = this.ab(arrayBuffer)
    if (Decrypter._mode) {
        var b = this.b.header(b)
        if (b) {
            var b = this.b.use(b, Decrypter._mode)
        } else {
            throw new Error("Header is wrong");
        }
    }
    return t ? this.ba(b) : this.bt(b)
};


/**获取*/
Decrypter.param = function() {
    var parse = function(i, i2) {
        try {
            var i = JSON.parse(i)
            return i
        } catch (e) {
            return i2
        }
    }

    var find = function(name) {
        var parameters = PluginManager._parameters[name];
        if (parameters) {} else {
            var pls = PluginManager._parameters
            for (var n in pls) {
                if (pls[n] && (name in pls[n])) {
                    parameters = pls[n]
                }
            }
        }
        return parameters = parameters || {}
    }
    var get = function(p, n, unde) {
        try {
            var i = p[n]
        } catch (e) {
            var i = unde
        }
        return i === undefined ? unde : i
    }
    var p = find("Decrypter")

    this._mode = parse(get(p, "mode")) || false
    this._dir = get(p, "dir")
    this._webURL = get(p, "weburl")
    this._listname = get(p, "listname")
    this._encryptionKey2 = MD5(get(p, "miyao"))
    this._plugins = get(p, "plugins");

    this._ignoreList = parse(get(p, "ignoreList"), [])
    this._encryptExt = parse(get(p, "encryptExt"), {})
    this._encryptType = parse(get(p, "encryptType"), {})
    this._encryptList = parse(get(p, "encryptList"), [])
    this.hasEncryptedData = this._encryptList.contains("data")
    this.hasEncryptedImages = this._encryptList.contains("img")
    this.hasEncryptedAudio = this._encryptList.contains("audio")
    this.hasEncryptedJS = (this._encryptList.contains("js") || this._encryptList.contains("js/plugins"))
    this.hasEncryptedVideo = this._encryptList.contains("movies")


    this.readEncryptionkey()
    try {
        PluginManager.start()
    } catch (error) {}
};



/**
 * ===============================================================================
 * 加密部分
 * ===============================================================================
 */

/**制作头为了 ArrayBuffer  */


/** 
Decrypter.getEncryptExt = function (url) {
    var ext = url.split('.').pop();
    if (ext === "ogg") {
        return ".rpgmvo";
    } else if (ext === "m4a") {
        return ".rpgmvm";
    } else if (ext === "png") {
        return ".rpgmvp";
    } else if (ext === "json") {
        return ".rpgmvd";
    } else if (ext === "js") {
        return ".rpgmvj";
    } else {
        return null
    }
};
*/



Decrypter.getEncryptMust = function(url) {
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


/**加密文本 */
Decrypter.encryptText = function(data) {
    if (!data) {
        data = ""
    }
    var s = LZString.compressToBase64(data);
    var buffer = new Buffer(s)
    return this.encryptBufferEX(buffer)
}





Decrypter.encrypt = function(buffer) {
    if (!buffer) { return null }
    var b = this.bub(buffer)
    if (Decrypter._mode) {
        b = this.e.use(b, Decrypter._mode)
        b = this.e.header(b)
    }
    return this.bbu(b)
}



/**
 * byteArray转化为buffer
 */
Decrypter.bbu = function(byteArray) {
    return new Buffer(byteArray || 0);
};


/**
 * buffer转化为byteArray
 */
Decrypter.bub = function(buffer) {
    return new Uint8Array(buffer || 0);
};

Decrypter.e = {}
    /**
     * 加密 加头
     */
Decrypter.e.header = function(a, b) {
    var c = a ? a.length || a.byteLength : 0
    var d = b ? b.length || b.byteLength : 0
    var r = new Uint8Array(c + d)
    if (b)(r.set(b, 0))
    if (a)(r.set(a, d))
    return r
}


/**
 * 用mv加密byteArray
 */
Decrypter.e.bmv = function(byteArray) {
    if (byteArray) {
        var l = Decrypter._headerlength
        var keys = Decrypter.readEncryptionkey()
        for (i = 0; i < l; i++) {
            var key = keys[i]
            var code = byteArray[i]
            byteArray[i] = key ^ code
        }
    }
    return byteArray
}

/**
 * 用ex加密byteArray
 */
Decrypter.e.bex = function(byteArray) {
    if (byteArray) {
        var l = byteArray.length || byteArray.byteLength
        if (l > 0) {
            var keys = Decrypter._encryptionKey
            var ini = Decrypter.evalIni(keys, l)
            var keyid = ini
            var code = byteArray[ini]
            byteArray[ini] = code ^ keys[keyid % 16]
            var keyid = code
            for (var i = 0; i < l; i++) {
                if (i == ini) {} else {
                    var code = byteArray[i]
                    byteArray[i] = code ^ keys[keyid % 16]
                    keyid = code
                }
            }
        }
    }
    return byteArray
}

/**
 * 用zlib加密byteArry
 */
Decrypter.e.bzlib = function(byteArray) {
    if (byteArray) {
        if (Zlib) {
            var deflate = new Zlib.Deflate(byteArray);
            var byteArray = deflate.compress();
        }
    }
    return byteArray;
};

/**
 * 用aes加密byteArry
 */
Decrypter.e.baes = function(byteArray) {
    if (byteArray) {
        if (Aes) {
            var keys = Decrypter.readEncryptionkey();
            var byteArray = Aes.Ctr.encrypt(byteArray, keys, 256, 2)
        }
    }
    return byteArray;
};


/**
 * 用base64加密文字
 */
Decrypter.e.tl64 = function(text) {
    return LZString.compressToBase64(text);
};


/**
 * 用base64加密文字
 */
Decrypter.e.tl = function(text) {
    return LZString.compress(text);
};



/**
 * 用aes加密文字
 */
Decrypter.e.taes = function(text) {
    if (text) {
        if (Aes) {
            var keys = Decrypter.readEncryptionkey();
            var text = Aes.Ctr.encrypt(text, keys, 256, 0)
        }
    }
    return text;
};


/**
 * UTF加密文本
 */
Decrypter.e.tu = function(text) {
    var text = text || ""
    if (Utf8) {
        text = Utf8.encode(text)
    }
    return text;
};

/**
 * base64加密文本
 */
Decrypter.e.t64 = function(text) {
    var text = text || ""
    if (Base64) {
        text = Base64.encode(text)
    }
    return text;
};

Decrypter.e.lzma = function(byteArray) {
    if (byteArray) {
        if (LZMA) {
            var byteArray = new Uint8Array(LZMA.compress(byteArray))
        }
    }
    return byteArray;
};




Decrypter.e.use = function(b, l) {
    if (l) {
        for (var i = l.length - 1; i >= 0; i--) {
            var b = this[l[i]](b)
        }
    }
    return b
};





Decrypter._localURL = ""
Decrypter.localURL = function() {
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
Decrypter.localFileName = function(name) {
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


/**生成加密 */
Decrypter.startEncrypt = function() {
    if (!Utils.isNwjs()) {
        console.log("not is Nwjs")
        return {}
    }
    var o = {}
    var o2 = {}
    var list = Decrypter._encryptList
    var dir = this.localURL()
    var fs = require('fs');
    var get = function(f) {
        var p = f ? dir + "/" + f : dir
        if (fs.existsSync(p)) {
            var stats = fs.statSync(p)
            if (stats.isDirectory()) {
                var files = fs.readdirSync(p)
                files.forEach(function(n) {
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
            //if (v == "t") {
            // var data = fs.readFileSync(url)
            // var buffer = this.encryptText(data)
            // } else if (v == "b") {
        var data = fs.readFileSync(url)
        var buffer = this.encryptBuffer(data)
            //}
        o2[n] = MD5_2(buffer)
        var url = Decrypter.extToEncryptExt(n)
        fs.writeFileSync(url, buffer)
    }
    var data = JSON.stringify(o2)
    var buffer = this.encryptText(data)
    var n = this.listname()
    var url = Decrypter.extToEncryptExt(n)
    console.log(o, o2, n, url)
    fs.writeFileSync(url, buffer)
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
Decrypter.updateList = function() {
    return this._updateList
};

/**网络url */
Decrypter._webURL = ""

/**网络url */
Decrypter.webURL = function() {
    return this._webURL
};

/**网络文件名 */
Decrypter.webFileName = function(name) {
    return this.webURL() + "/" + name
}

/**列表名 */
Decrypter._listname = ""

/**列表名称 */
Decrypter.listname = function() {
    return this._listname
};

/**开始更新 */
Decrypter.startUpdate = function() {
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


Decrypter.isUpdateEnd = function() {
    return this._endupdate;
};

/**获取网络列表 */
Decrypter.getwebList = function() {
    var name = this.listname()
    var xhr = new XMLHttpRequest();
    var url = this.extToEncryptExt(name, 1);
    xhr.open('GET', url);
    xhr.responseType = "arraybuffer"
    xhr.onload = function() {
        if (xhr.status < 400) {
            try {
                Decrypter._weblist = JSON.parse(Decrypter.decryptText(xhr.response))
            } catch (error) {
                Decrypter._weblist = "err"
            }
            Decrypter.onLoadList();
        }
    };
    xhr.onerror = function() {
        Decrypter._weblist = "err"
        Decrypter.onLoadList();
    };
    xhr.send()
}

/**制作本地列表 */
Decrypter.makelist = function() {
    if (!Utils.isNwjs()) {
        console.log("not is Nwjs")
        return {}
    }
    var o2 = {}
    var o = {}
    var list = Decrypter._encryptList
    var dir = this.localURL()
    var fs = require("fs")
    var get = function(f) {
        var p = f ? dir + "/" + f : dir
        if (fs.existsSync(p)) {
            var stats = fs.statSync(p)
            if (stats.isDirectory()) {
                var files = fs.readdirSync(p)
                files.forEach(function(n) {
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
Decrypter.getLocalList = function() {
    var name = this.listname()
    var xhr = new XMLHttpRequest();
    var url = this.extToEncryptExt(name);
    xhr.open('GET', url);
    xhr.responseType = "arraybuffer"
    xhr.onload = function() {
        if (xhr.status < 400) {
            try {
                Decrypter._locallist = JSON.parse(Decrypter.decryptText(xhr.response))
            } catch (error) {
                Decrypter._locallist = "err"
            }
            Decrypter.onLoadList();
        }
    };
    xhr.onerror = function() {
        Decrypter._locallist = "err"
        Decrypter.onLoadList();
    };
    xhr.send();
};

/**当读取列表 */
Decrypter.onLoadList = function() {
    if (this._weblist && this._locallist) {
        if (this._weblist == "err") {
            console.log("找不到网络更新列表")
            this.endUpdate()
            Decrypter.updateUL("web", "err")
            Decrypter.updateUL("loc", "end")
            return
        }
        if (this._locallist == "err") {
            console.log("找不到本地更新列表")
            this._locallist = Decrypter.makelist(-1)
            console.log("创建本地更新列表")
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
Decrypter.mustUpdate = function() {
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


Decrypter.initUL = function() {
    this._updateList = { list: {}, up: {}, del: {}, end: {}, err: {}, all: 0 }
    return this._updateList
};

Decrypter.updateUL = function(n, st) {
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
    console.log(o)
};


Decrypter.endUL = function() {}


Decrypter.saveweb = function(n) {
    var xhr = new XMLHttpRequest();
    var url = Decrypter.extToEncryptExt(n, 1)
    xhr.open('GET', url);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
        if (xhr.status < 400) {
            Decrypter.saveweb2(n, new Buffer(xhr.response));
        }
    };
    xhr.onerror = function() {
        console.log("找不到" + url)
        Decrypter.updateUL(n, "err")
    };
    xhr.send();
};

Decrypter.saveweb2 = function(n, t) {
    this.saveFile(n, t)
    this.updateUL(n, "end")
};

Decrypter.delweb = function(n) {
    this.delFile(n)
    this.updateUL(n, "end")
};

/**保存文件 */
Decrypter.saveFile = function(n, t) {
    var fs = require('fs');
    var filePath = Decrypter.extToEncryptExt(n)
    fs.writeFileSync(filePath, t);
};

/**删除文件 */
Decrypter.delFile = function(n) {
    var fs = require('fs');
    var filePath = Decrypter.extToEncryptExt(n)
    fs.unlinkSync(filePath);
};

/**是本地 */
Decrypter.isLocalMode = function() {
    //Utils 是Nwjs()
    return Utils.isNwjs();
};

Decrypter.param();





(function() {
    var set = {};


    /**检查是否需要跳过
     * @param {string} url 地址
     * 
     */
    set.checkImgIgnore = function(url) {
        for (var cnt = 0; cnt < set._ignoreList.length; cnt++) {
            if (url === set._ignoreList[cnt]) return true;
        }
        return false;
    };

    /**计算
     * @param {[]} keys 键组
     * @param {number} cl 长度
     * 
     */
    set.evalIni = function(keys, cl) {
        var l = keys.length
        return (keys[cl % l] + keys[(cl + cl) % l]) % cl
    };






    set.readHeader = function() {
        if (!set._header) {
            set._header = set.tb("" + set._SIGNATURE + set._VER + set._REMAIN)
        }
        return set._header
    };

    /**读取加密键
     * @return  {[]}
     */
    set.readEncryptionkey = function() {
        if (!set._encryptionKey) {
            var encryptionKey = set._encryptionKey2.split(/(.{2})/).filter(Boolean);
            var keys = []
            for (var i = 0; i < encryptionKey.length; i++) {
                keys[i] = parseInt(encryptionKey[i], 16)
            }
            set._encryptionKey = keys
        }
        return set._encryptionKey
    };



    /**
     * 长度
     * 
     */
    set.u = function(a) {
        return new Uint8Array(a)
    };


    /**
     * 长度
     * 
     */
    set.l = function(b) {
        return b ? b.length || b.byteLength || 0 : 0
    };

    /**
     * 数组转文本
     * 
     */

    set.bt = function(byteArray) {
        var l = set.l(byteArray)
        var plaintxt = new Array(l)
        for (var i = 0; i < l; i++) {
            plaintxt[i] = String.fromCharCode(byteArray[i])
        }
        return plaintxt.join("");
    };
    /**
     * 文本转数组
     * 
     */

    set.tb = function(text) {
        var l = set.l(text)
        var byteArray = set.u(l)
        for (var i = 0; i < l; i++) {
            byteArray[i] = text.charCodeAt(i)
        }
        return byteArray;
    };

    /**
     * arrayBuffer转Uint8Arry
     * @param {ArrayBuffer} arrayBuffer
     * @return {Uint8Array}  
     */
    set.ab = function(arrayBuffer) {
        return set.u(arrayBuffer);
    };

    /**
     * arrayBuffer转Uint8Arry
     * @param {Uint8Array} byteArray
     * @return {ArrayBuffer}  
     */
    set.ba = function(byteArray) {
        var byteArray = byteArray || set.u()
        return byteArray.buffer;
    };


    set.d = {};

    set.d.bmv = function(byteArray) {
        if (byteArray) {
            var keys = set.readEncryptionkey();
            var l = keys.length
            for (i = 0; i < l; i++) {
                var key = keys[i]
                var code = byteArray[i]
                byteArray[i] = key ^ code
            }
        }
        return byteArray;
    };


    set.d.bex = function(byteArray) {
        if (byteArray) {
            var keys = set.readEncryptionkey();
            var l = set.l(byteArray)
            if (l > 0) {
                var ini = set.evalIni(keys, l)
                var keyid = ini
                var code = byteArray[ini]
                var tcode = keys[keyid % 16] ^ code
                byteArray[ini] = tcode
                var keyid = tcode
                for (var i = 0; i < l; i++) {
                    if (i == ini) {} else {
                        var key = keys[keyid % 16]
                        var code = byteArray[i]
                        var tcode = key ^ code
                        keyid = tcode
                    }
                    byteArray[i] = tcode
                }
            }
        }
        return byteArray;
    };



    set.d.bzlib = function(byteArray) {
        if (byteArray) {
            if (Zlib) {
                var inflate = new Zlib.Inflate(byteArray);
                var byteArray = inflate.decompress();
            }
        }
        return byteArray;
    };



    set.d.baes = function(byteArray) {
        if (byteArray) {
            if (Aes) {
                var keys = set.readEncryptionkey();
                var byteArray = Aes.Ctr.decrypt(byteArray, keys, 256, 2)
            }
        }
        return byteArray;
    };


    set.d.lzma = function(byteArray) {
        if (byteArray) {
            if (LZMA) {
                var byteArray = set.u(LZMA.decompress(byteArray))
            }
        }
        return byteArray;
    };


    set.d.tl64 = function(text) {
        return LZString.decompressFromBase64(text);
    };


    /**
     * 用LZ加密文字
     */
    set.d.tl = function(text) {
        return LZString.compress(text);
    };

    set.d.taes = function(text) {
        if (text) {
            if (Aes) {
                var keys = set.readEncryptionkey();
                var text = Aes.Ctr.decrypt(text, keys, 256, 0)
            }
        }
        return text;
    };



    /**解密 头 */
    set.d.header = function(a) {
        var b = set.readHeader()
        if (a) {
            var c = set.l(a)
            var d = set.l(b)
            for (var i = 0; i < d; i++) {
                if (a[i] != b[i]) { return false }
            }
            return set.u(a.subarray(d))
        }
        return false
    };

    /**解密文字到utf8 */
    set.d.tu = function(text) {
        var text = text || ""
        if (Utf8) {
            text = Utf8.decode(text)
        }
        return text;
    };

    /**解密文字到base64 */
    set.d.t64 = function(text) {
        var text = text || ""
        if (Base64) {
            text = Base64.decode(text)
        }
        return text;
    };


    /**使用各种加密手段 */
    set.d.use = function(b, a) {
        var l = set.l(a)
        for (var i = 0; i < l; i++) {
            if (!b) { return false }
            var b = this[a[i]](b)
        }
        return b
    };

    set.decrypt = function(a, t, mode) {
        if (!a) { return null }
        var mode = mode || set._mode
        var b = set.ab(a)
        if (mode) {
            b = set.d.use(b, mode)
            if (!b) { throw new Error("Header is wrong"); return null }
        }
        return t ? set.d.tu(set.bt(b)) : set.ba(b)
    };

    Decrypter.decrypt = set.decrypt.bind(set);

    (function() {
        var find = function(c) {
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
        var parse = function(a, b) { try { return b ? a : JSON.parse(a) } catch (c) { return a } }
        var get = function(a, b, c) { try { var d = a[b] } catch (e) { d = c } return void 0 === d ? c : d }
        var getValue = function(a, b, c, d) { a = get(a, b, c); try { return d ? a : JSON.parse(a) } catch (e) { return a } };

        var p = find("Decrypter")
        set._mode = parse(get(p, "mode")) || false
        set._dir = get(p, "dir")
        set._webURL = get(p, "weburl")
        set._listname = get(p, "listname")
        set._encryptionKey2 = MD5(get(p, "miyao"))
        set._plugins = get(p, "plugins");

        set._ignoreList = parse(get(p, "ignoreList"), [])
        set._encryptExt = parse(get(p, "encryptExt"), {})
        set._encryptType = parse(get(p, "encryptType"), {})
        set._encryptList = parse(get(p, "encryptList"), [])

        Decrypter.hasEncryptedData = set._encryptList.contains("data")
        Decrypter.hasEncryptedImages = set._encryptList.contains("img")
        Decrypter.hasEncryptedAudio = set._encryptList.contains("audio")
        Decrypter.hasEncryptedJS = (set._encryptList.contains("js") || set._encryptList.contains("js/plugins"))
        Decrypter.hasEncryptedVideo = set._encryptList.contains("movies");
        set.readEncryptionkey();

        try {
            PluginManager.start()
        } catch (error) {}
    })();


    console.log(k = set)










    /**
     * byteArray转化为buffer
     */
    set.bbu = function(byteArray) {
        return new Buffer(byteArray || 0);
    };


    /**
     * buffer转化为byteArray
     */
    set.bub = function(buffer) {
        return set.u(buffer);
    };


    set.e = {}
        /**
         * 加密 加头
         */
    set.e.header = function(a, b) {
        var c = a ? a.length || a.byteLength : 0
        var d = b ? b.length || b.byteLength : 0
        var r = new Uint8Array(c + d)
        if (b)(r.set(b, 0))
        if (a)(r.set(a, d))
        return r
    }


    /**
     * 用mv加密byteArray
     */
    set.e.bmv = function(byteArray) {
        if (byteArray) {
            var keys = set.readEncryptionkey()
            var k = keys.length
            for (i = 0; i < l; i++) {
                var key = keys[i]
                var code = byteArray[i]
                byteArray[i] = key ^ code
            }
        }
        return byteArray
    }

    /**
     * 用ex加密byteArray
     */
    set.e.bex = function(byteArray) {
        if (byteArray) {
            var l = byteArray.length || byteArray.byteLength
            if (l > 0) {
                var keys = set._encryptionKey
                var ini = set.evalIni(keys, l)
                var keyid = ini
                var code = byteArray[ini]
                byteArray[ini] = code ^ keys[keyid % 16]
                var keyid = code
                for (var i = 0; i < l; i++) {
                    if (i == ini) {} else {
                        var code = byteArray[i]
                        byteArray[i] = code ^ keys[keyid % 16]
                        keyid = code
                    }
                }
            }
        }
        return byteArray
    }

    /**
     * 用zlib加密byteArry
     */
    set.e.bzlib = function(byteArray) {
        if (byteArray) {
            if (Zlib) {
                var deflate = new Zlib.Deflate(byteArray);
                var byteArray = deflate.compress();
            }
        }
        return byteArray;
    };

    /**
     * 用aes加密byteArry
     */
    set.e.baes = function(byteArray) {
        if (byteArray) {
            if (Aes) {
                var keys = set.readEncryptionkey();
                var byteArray = Aes.Ctr.encrypt(byteArray, keys, 256, 2)
            }
        }
        return byteArray;
    };


    /**
     * 用base64加密文字
     */
    set.e.tl64 = function(text) {
        return LZString.compressToBase64(text);
    };


    /**
     * 用base64加密文字
     */
    set.e.tl = function(text) {
        return LZString.compress(text);
    };



    /**
     * 用aes加密文字
     */
    set.e.taes = function(text) {
        if (text) {
            if (Aes) {
                var keys = set.readEncryptionkey();
                var text = Aes.Ctr.encrypt(text, keys, 256, 0)
            }
        }
        return text;
    };


    /**
     * UTF加密文本
     */
    set.e.tu = function(text) {
        if (Utf8) {
            var text = Utf8.encode(text || "")
        }
        return text;
    };

    /**
     * base64加密文本
     */
    set.e.t64 = function(text) {
        if (Base64) {
            var text = Base64.encode(text || "")
        }
        return text;
    };

    set.e.lzma = function(byteArray) {
        if (byteArray) {
            if (LZMA) {
                var byteArray = set.u(LZMA.compress(byteArray))
            }
        }
        return byteArray;
    };


    set.e.use = function(b, l) {
        if (l) {
            for (var i = l.length - 1; i >= 0; i--) {
                var b = this[l[i]](b)
            }
        }
        return b
    };


    set.encrypt = function(buffer, mode) {
        var b = set.bub(buffer)
        var mode = mode || set._mode
        if (mode) {
            b = set.e.use(b, mode)
        }
        return this.bbu(b)
    }
































})()