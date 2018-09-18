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

/**后缀 到 加密后缀 */
Decrypter._extToEncryptExt = {};
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
};


Decrypter.decryptArrayBuffer = function(a) {
    return this.decrypt(a)
};


Decrypter.decryptText = function(a) {
    return this.decrypt(a, 1)
};




(function() {
    var f = function(c) {
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
    var p = function(a, b) { try { return b ? a : JSON.parse(a) } catch (c) { return a } }
    var g = function(a, b, c) { try { var d = a[b] } catch (e) { d = c } return void 0 === d ? c : d }
    var v = function(a, b, c) { return p(g(a, b)) || c }
    var c = function(a, b) { return a.contains(b) }
    var z = f("Decrypter")
    Decrypter._dir = g(z, "dir")
    Decrypter._webURL = g(z, "weburl")
    Decrypter._listname = g(z, "listname")
    Decrypter._plugins = g(z, "plugins");

    Decrypter._ignoreList = v(z, "ignoreList", [])
    Decrypter._encryptExt = v(z, "encryptExt", {})
    Decrypter._encryptType = v(z, "encryptType", {})
    var l = Decrypter._encryptList = v(z, "encryptList", {})
    console.log(l, c)
    Decrypter.hasEncryptedData = c(l, "data")
    Decrypter.hasEncryptedImages = c(l, "img")
    Decrypter.hasEncryptedAudio = c(l, "audio")
    Decrypter.hasEncryptedJS = (c(l, "js") || c(l, "js/plugins"))
    Decrypter.hasEncryptedVideo = c(l, "movies")

    try {
        PluginManager.start()
    } catch (error) {}
})();




/**
 * ===============================================================================
 * 加密部分
 * ===============================================================================
 */

/**加密Buffer */
Decrypter.encryptBuffer = function(a) {
    return this.encrypt(a)
}

/**加密文本 */
Decrypter.encryptText = function(data) {
    return this.encrypt(data)
}


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

/**当前文件夹 */
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

    var pro = 0
    Decrypter.ennum = 0

    var list = Decrypter._encryptList
    var dir = Decrypter.localURL()
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
    console.log(o, pro, list)
    pro = 0
    for (var n in o) {
        console.log(n)
        var v = o[n]
        var url = this.localFileName(n)

        var data = fs.readFileSync(url)
        var buffer = this.encryptBuffer(data)
        var md5 = MD5_2(buffer)
        o2[n] = md5
        var url = this.extToEncryptExt(n)
        fs.writeFileSync(url, buffer)
        console.log(n, v, url, md5)
        pro++
        console.log(pro, "/", proall, Math.floor((pro / proall) * 100) + "%")
    }
    var data = JSON.stringify(o2)
    var buffer = this.encryptText(data)
    var n = this.listname()
    var url = this.extToEncryptExt(n)
    if (n) {
        fs.writeFileSync(url, buffer)
    }
    console.log(o2, n, url)
    console.log("完成")
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
    var list = this._encryptList
    var dir = this.localURL()
    var fs = require("fs")

    //获取 文件
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
    var url = this.extToEncryptExt(n, 1)
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
    var filePath = this.extToEncryptExt(n)
    fs.writeFileSync(filePath, t);
};

/**删除文件 */
Decrypter.delFile = function(n) {
    var fs = require('fs');
    var filePath = this.extToEncryptExt(n)
    fs.unlinkSync(filePath);
};

/**是本地 */
Decrypter.isLocalMode = function() {
    //Utils 是Nwjs()
    return Utils.isNwjs();
};








(function() {
    var w = { d: {}, e: {} };


    /**计算
     * @param {[]} k 键组
     * @param {number} l 长度
     * 
     */
    w.ei = function(a, b, c) {
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


    w.rh = function() {
        if (!w.h) {
            w.h = w.t2b(w.h2)
        }
        return w.h
    };


    /**读取加密键
     * @return  {[]}
     */
    w.rk = function() {
        if (!w.k) {
            w.k = w.t2b(w.k2)
        }
        return w.k
    };


    w.t2b = function(t) {
        var l = w.l(t) / 2;
        var k = []
        for (var i = 0; i < l; i++) {
            k[i] = parseInt(t.substr(i + i, 2), 16)
            if (isNaN(k[i])) { return w.tb(t) }
        }
        return k
    };

    /**
     * 长度
     * 
     */
    w.u = function(a) {
        return new Uint8Array(a)
    };


    /**
     * 长度
     * 
     */
    w.l = function(b) {
        return b ? b.length || b.byteLength || 0 : 0
    };

    /**
     * 数组转文本
     * 
     */

    w.bt = function(b) {
        var l = w.l(b)
        var t = []
        for (var i = 0; i < l; i++) {
            t[i] = String.fromCharCode(b[i])
        }
        return t.join("");
    };
    /**
     * 文本转数组
     * 
     */

    w.tb = function(t) {
        var l = w.l(t)
        var b = w.u(l)
        for (var i = 0; i < l; i++) {
            b[i] = t.charCodeAt(i)
        }
        return b;
    };

    /**
     * arrayBuffer转Uint8Arry
     * @param {ArrayBuffer} a
     * @return {Uint8Array}  
     */
    w.ab = function(a) {
        return w.u(a);
    };

    /**
     * arrayBuffer转Uint8Arry
     * @param {Uint8Array} b
     * @return {ArrayBuffer}  
     */
    w.ba = function(b) {
        return (b || w.u()).buffer;
    };


    /**解密 头 */
    w.d.header = function(a) {
        var b = w.rh()
        if (a) {
            var c = w.l(a)
            var d = w.l(b)
            for (var i = 0; i < d; i++) {
                if (a[i] != b[i]) { return false }
            }
            return w.u(a.subarray(d))
        }
        return false
    };

    w.d.mv = function(b) {
        if (b) {
            var k = w.rk();
            var l = w.l(k)
            for (i = 0; i < l; i++) {
                b[i] = k[i] ^ b[i]
            }
        }
        return b;
    };

    w.d.exb = function(b, t) {
        if (b) {
            var k = w.rk();
            var l = w.l(b)
            var e = w.l(k)
            if (l && e) {
                var n = w.ei(k, l, t)
                var d = n
                var c = b[n]
                var t = k[d % e] ^ c
                b[n] = d = t
                for (var i = 0; i < l; i++) {
                    if (i == n) {} else {
                        var v = k[d % 16]
                        var c = b[i]
                        var t = v ^ c
                        b[i] = d = t
                    }
                }
            }
        }
        return b;
    };

    w.d.ex = function(b) {
        return this.exb(b)
    };


    w.d.zlib = function(b) {
        if (b) {
            if (Zlib) {
                var b = new Zlib.Inflate(b).decompress();
            }
        }
        return b;
    };


    w.d.lzma = function(b) {
        if (b) {
            if (LZMA) {
                var b = w.u(LZMA.decompress(b))
            }
        }
        return b;
    };


    w.d.aes = function(b) {
        if (b) {
            if (Aes) {
                var b = Aes.Ctr.decrypt(b, w.rk(), 256, 2)
            }
        }
        return b;
    };



    w.d.tl64 = function(t) {
        return LZString.decompressFromBase64(t);
    };


    /**
     * 用LZ加密文字
     */
    w.d.tl = function(t) {
        return LZString.compress(t);
    };

    w.d.taes = function(t) {
        if (t) {
            if (Aes) {
                var t = Aes.Ctr.decrypt(t, w.rk(), 256, 0)
            }
        }
        return t;
    };



    /**解密文字到utf8 */
    w.d.tu = function(t) {
        if (Utf8) {
            t = Utf8.decode(t)
        }
        return t;
    };

    /**解密文字到base64 */
    w.d.t64 = function(t) {
        if (t) {
            t = Base64.decode(t)
        }
        return t;
    };


    w.d.use = function(b, a) {
        var l = w.l(a)
        for (var i = 0; i < l; i++) {
            if (!b) { return false }
            var b = !!this[a[i]] && this[a[i]](b)
        }
        return b
    };



    /**arrd 
     * @param {Array} a 数据
     * @param {Boolean} t 种类
     * @param {[]} m 加密方法
     */
    w.decrypt = function(a, t, m) {
        if (!a) { return null }
        var m = m || w.m
        var b = w.ab(a)
        if (m) {
            b = w.d.use(b, m)
            if (!b) { throw new Error("Decrypt is wrong"); return null }
        }
        return t ? t == 1 ? w.d.tu(w.bt(b)) : b : w.ba(b)
    };

    Decrypter.decrypt = w.decrypt.bind(w);



    (function() {
        var f = function(c) {
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
        var p = function(a, b) { try { return b ? a : JSON.parse(a) } catch (c) { return a } }
        var g = function(a, b, c) { try { var d = a[b] } catch (e) { d = c } return void 0 === d ? c : d }
        var v = function(a, b, c) { return p(g(a, b)) || c }

        var z = f("Decrypter")
        w.m = v(z, "mode", [])
        w.k2 = MD5(g(z, "miyao"))
        w.h2 = g(z, "SIGNATURE") + g(z, "VER") + g(z, "REMAIN")

    })();


    console.log(k = w)

    /**加密部分 */

    /**
     * byteArray转化为buffer
     */
    w.bbu = function(b) {
        return new Buffer(b || 0);
    };


    /**
     * buffer转化为byteArray
     */
    w.bub = function(b) {
        return w.u(b);
    };


    /**
     * 加密 加头
     */
    w.e.header = function(a) {
        var b = w.rh()
        var c = w.l(a)
        var d = w.l(b)
        var r = w.u(c + d)
        if (b)(r.set(b, 0))
        if (a)(r.set(a, d))
        return r
    };


    /**
     * 用mv加密byteArray
     */
    w.e.mv = function(b) {
        if (b) {
            var k = w.rk()
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
    w.e.exb = function(b, t) {
        if (b) {
            var k = w.rk()
            var l = w.l(b)
            var e = w.l(k)
            if (l && e) {
                var n = w.ei(k, l, t)
                var d = n
                var c = b[n]
                b[n] = c ^ k[d % e]
                var d = c
                for (var i = 0; i < l; i++) {
                    if (i == n) {} else {
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
    w.e.ex = function(b) {
        return this.exb(b)
    };

    /**
     * 用zlib加密byteArry
     */
    w.e.zlib = function(b) {
        if (b) {
            if (Zlib) {
                //var l1 = w.l(b)
                //console.log(l1)
                var b = new Zlib.Deflate(b).compress();


                //var l2 = w.l(b)
                //console.log(l2)
                //var l3 = l1 - l2

                //Decrypter.ennum += l3
                //console.log(l3, Decrypter.ennum) 
            }
        }
        return b;
    };


    w.e.lzma = function(b) {
        if (b) {
            if (LZMA) {

                //var l1 = w.l(b)
                //console.log(l1)

                var b = w.u(LZMA.compress(b, 9))

                //var l2 = w.l(b)
                //console.log(l2)
                //var l3 = l1 - l2

                //Decrypter.ennum += l3
                //console.log(l3, Decrypter.ennum)
            }
        }
        return b;
    };


    /**
     * 用aes加密byteArry
     */
    w.e.aes = function(b) {
        if (b) {
            if (Aes) {
                var keys = w.rk();
                var b = Aes.Ctr.encrypt(b, keys, 256, 2)
            }
        }
        return b;
    };




    /**
     * 用base64加密文字
     */
    w.e.tl64 = function(t) {
        return LZString.compressToBase64(t);
    };


    /**
     * 用base64加密文字
     */
    w.e.tl = function(t) {
        return LZString.compress(t);
    };



    /**
     * 用aes加密文字
     */
    w.e.taes = function(t) {
        if (t) {
            if (Aes) {
                var t = Aes.Ctr.encrypt(t, w.rk(), 256, 0)
            }
        }
        return t;
    };


    /**
     * UTF加密文本
     */
    w.e.tu = function(t) {
        if (Utf8) {
            var t = Utf8.encode(t || "")
        }
        return t;
    };

    /**
     * base64加密文本
     */
    w.e.t64 = function(t) {
        if (Base64) {
            var t = Base64.encode(t || "")
        }
        return t;
    };

    /**使用各种加密手段 */
    w.e.use = function(b, a) {
        var l = w.l(a)
        for (var i = l - 1; i >= 0; i--) {
            if (!b) { return false }
            var b = !!this[a[i]] && this[a[i]](b)
        }
        return b
    };


    w.encrypt = function(b, t, m) {
        var b = t ? w.bbu(b) : b
        var b = w.bub(b)
        var m = m || w.m
        if (m) {
            b = w.e.use(b, m)
            if (!b) { throw new Error("Encrypt is wrong"); return null }
        }
        return w.bbu(b)
    };

    Decrypter.encrypt = w.encrypt.bind(w)

})();








(function() {
    'w.ei=function(b,c,a){var g=w.l(b);a=a||0;for(var d=0,e=0,f=0>=a?a-2:0;f<a;f++)d+=c,e+=b[d%g];return e%c};'
    'w.rh=function(){w.h||(w.h=w.t2b(w.h2));return w.h};'
    'w.rk=function(){w.k||(w.k=w.t2b(w.k2));return w.k};'
    'w.t2b=function(b){for(var d=w.l(b)/2,c=[],a=0;a<d;a++)if(c[a]=parseInt(b.substr(a+a,2),16),isNaN(c[a]))return w.tb(b);return c};'
    'w.u=function(a){return new Uint8Array(a)};'
    'w.l=function(a){return a?a.length||a.byteLength||0:0};'
    'w.bt=function(b){for(var d=w.l(b),c=[],a=0;a<d;a++)c[a]=String.fromCharCode(b[a]);return c.join("")};'
    'w.tb=function(b){for(var c=w.l(b),d=w.u(c),a=0;a<c;a++)d[a]=b.charCodeAt(a);return d};'
    'w.ab=function(a){return w.u(a)};'
    'w.ba=function(a){return(a||w.u()).buffer};'
    'w.d.header=function(a){var c=w.rh();if(a){w.l(a);for(var d=w.l(c),b=0;b<d;b++)if(a[b]!=c[b])return!1;return w.u(a.subarray(d))}return!1};'
    'w.d.mv=function(a){if(a){var b=w.rk(),c=w.l(b);for(i=0;i<c;i++)a[i]^=b[i]}return a};'
    'w.d.exb=function(c,a){if(c){var d=w.rk(),f=w.l(c),b=w.l(d);if(f&&b){var e=w.ei(d,f,a);a=c[e];a^=d[e%b];c[e]=a;for(b=0;b<f;b++)if(b!=e){var g=d[a%16];a=c[b];a^=g;c[b]=a}}}return c};'
    'w.d.ex=function(a){return this.exb(a)};'
    'w.d.zlib=function(a){a&&Zlib&&(a=(new Zlib.Inflate(a)).decompress());return a};'
    'w.d.lzma=function(a){a&&LZMA&&(a=w.u(LZMA.decompress(a)));return a};'
    'w.d.aes=function(a){a&&Aes&&(a=Aes.Ctr.decrypt(a,w.rk(),256,2));return a};'
    'w.d.tl64=function(a){return LZString.decompressFromBase64(a)};'
    'w.d.tl=function(a){return LZString.compress(a)};'
    'w.d.taes=function(a){a&&Aes&&(a=Aes.Ctr.decrypt(a,w.rk(),256,0));return a};'
    'w.d.tu=function(a){Utf8&&(a=Utf8.decode(a));return a};'
    'w.d.t64=function(a){a&&(a=Base64.decode(a));return a};'
    'w.d.use=function(a,c){for(var d=w.l(c),b=0;b<d;b++){if(!a)return!1;a=!!this[c[b]]&&this[c[b]](a)}return a};'
    'w.de=function(a,c,b){if(!a)return null;b=b||w.m;a=w.ab(a);if(b&&(a=w.d.use(a,b),!a))throw Error("Decrypt is wrong");return c?1==c?w.d.tu(w.bt(a)):a:w.ba(a)};'
    'Decrypter.decrypt = w.de.bind(w);'



})