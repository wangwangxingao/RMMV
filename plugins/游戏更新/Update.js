//=============================================================================
// GameUpdate.js
//=============================================================================
/*:
 * @plugindesc 游戏更新
 * @author wangwang
 *
 * @param GameUpdate
 * @desc 游戏更新
 * @default 1.0
 * 
 * @param gamever
 * @desc 版本
 * @default 0
 * 
 * @param weburl
 * @desc 游戏更新网站
 * @default 
 * 
 * @param listname
 * @desc 更新列表名称
 * @default uplist.json
 *
 * @param makelistadd
 * @desc 制作更新列表的内容
 * @default ["data"]
 * 
 * @param makelistdel
 * @desc 制作更新列表的内容
 * @default ["data/actors.json"]
 * 
 * @help
 * GameUpdate.startUpdate() 开始更新
 * GameUpdate.makelist(ver) 制作更新列表文件 (版本号)
 * 
 *
 */





function GameUpdate() {
    throw new Error('This is a static class');
}
GameUpdate._uplist = { "up": {}, "del": {}, "list": {}, "err": {}, "all": 0 }
GameUpdate._webURL = ""
GameUpdate.webURL = function () {
    return this._webURL
};

GameUpdate._localURL = ""
GameUpdate.localURL = function () {
    if (!this._localURL) {
        var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, "");
        if (path.match(/^\/([A-Z]\:)/)) {
            path = path.slice(1);
        }
        this._localURL = decodeURIComponent(path);
    }
    return this._localURL
};

GameUpdate.webFileName = function (name) {
    return this.webURL() + "/" + name
}

GameUpdate._dirs = {}
GameUpdate.localFileName = function (name) {
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
GameUpdate._listname = ""
GameUpdate.listname = function () {
    return this._listname
};
GameUpdate.param = function () {
    var parse = function (i, type) {
        try {
            if (type) {
                return i
            }
            return JSON.parse(i)
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
    var p = find("GameUpdate")
    this._webURL = get(p, "weburl")
    this._listname = get(p, "listname")
    this._makelistadd = parse(get(p, "makelistadd"))
    this._makelistdel = parse(get(p, "makelistdel"))
    this._gamever = parse(get(p, "gamever"))
}
/**获取网络列表 */
GameUpdate.startUpdate = function () {
    this.param()
    if (this._webURL  && this.isLocalMode()) {
        this._uplist = { "up": {}, "del": {}, "list": {}, "err": {}, "all": 0 }
        this._weblist = null
        this._locallist = null
        this.getwebList()
        this.getLocalList()
    } else {
        console.log("无法保存")
        this._uplist = { "up": {}, "del": {}, "list": {}, "err": {}, "all": 0 }
        this.endUpdate()
    }
};


GameUpdate.isUpdateEnd = function () {
    return this._endupdate;
};



/**获取网络列表 */
GameUpdate.getwebList = function () {
    var name = this.listname()
    var xhr = new XMLHttpRequest();
    var url = this.webFileName(name);
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function () {
        if (xhr.status < 400) {
            GameUpdate._weblist = JSON.parse(xhr.responseText);
            GameUpdate.onLoadList();
        }
    };
    xhr.onerror = function () {
        GameUpdate._weblist = "err"
        GameUpdate.onLoadList();
    };
    xhr.send()
}
/**获取本地列表 */
GameUpdate.getLocalList = function () {
    var name = this.listname()
    var xhr = new XMLHttpRequest();
    var url = this.localFileName(name);
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function () {
        if (xhr.status < 400) {
            GameUpdate._locallist = JSON.parse(xhr.responseText);
            GameUpdate.onLoadList();
        }
    };
    xhr.onerror = function () {
        GameUpdate._locallist = "err"
        GameUpdate.onLoadList();
    };
    xhr.send();
};


GameUpdate.onLoadList = function () {
    if (this._weblist && this._locallist) {
        if (this._weblist == "err") {
            console.log("找不到网络更新列表")
            this.endUpdate()
            return
        }
        if (this._locallist == "err") {
            console.log("找不到本地更新列表")
            this._locallist = GameUpdate.makelist(-1)
            console.log("创建本地更新列表")
        }
        var l = this._locallist
        var w = this._weblist
        var o = this._uplist
        if (l.ver !== w.ver) {
            for (var n in l.list) {
                if (w.list[n]) {
                    if (l.list[n].ver != w.list[n].ver) {
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
                if (!l.list[n]) {
                    o.up[n] = 1
                    o.list[n] = "up"
                    o.all++
                }
            }
            this.mustUpdate()
        } else {
            this.endUpdate()

        }
    }
};

GameUpdate.mustUpdate = function () {
    var o = this._uplist
    if (o) {
        this._uping = true
        if (o.up) {
            for (var n in o.up) {
                this.saveweb(n)
            }
        }
        if (o.del) {
            for (var n in o.del) {
                this.delweb(n)
            }
        }
    } else {
        this.endUpdate()
    }
};

GameUpdate.updateUL = function (n, st) {
    var o = this._uplist
    o.list[n] = st
    if (st == "err") {
        o.err[n] = 1
    }
    o.all--
    if (o.all <= 0) {
        var t = JSON.stringify(this._weblist)
        this.saveFile(this.listname(), t)
        this.endUpdate()
    }
};

GameUpdate.endUpdate = function () {
    this._endupdate = true
}

GameUpdate.saveweb = function (n) {
    var xhr = new XMLHttpRequest();
    var url = this.webFileName(n)
    xhr.open('GET', url);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
        if (xhr.status < 400) {
            GameUpdate.saveweb2(n, new Buffer(new Uint8Array(xhr.response)));
        }
    };
    xhr.onerror = function () {
        console.log("找不到" + url)
        GameUpdate.updateUL(n, "err")
    };
    xhr.send();
};

GameUpdate.saveweb2 = function (n, t) {
    this.saveFile(n, t)
    this.updateUL(n, "saveend")
};

GameUpdate.saveweblist = function (t) {
    this.saveFile(this.listname(), JSON.stringify(t))
}

GameUpdate.delweb = function (n) {
    this.delFile(n)
    this.updateUL(n, "delend")
};


/**保存文件 */
GameUpdate.saveFile = function (n, t) {
    var fs = require('fs');
    var filePath = this.localFileName(n)
    fs.writeFileSync(filePath, t);
};

/**删除文件 */
GameUpdate.delFile = function (n) {
    var fs = require('fs');
    var filePath = this.localFileName(n)
    fs.unlinkSync(filePath);
};

/**是本地 */
GameUpdate.isLocalMode = function () {
    //Utils 是Nwjs()
    return Utils.isNwjs();
};

/**制作更新列表 */
GameUpdate.makelist = function (ver) {
    this.param()
    var ver = ver || 0 || this._gamever||0
    var o = {}
    var l = this._makelistadd 
    var l2 = this._makelistdel 
    var dir = this.localURL()
    var get = function (f) {
        var p = f ? dir + "/" + f : dir
        var fs = require('fs');
        if(fs.existsSync(p)){ 
            var stats = fs.statSync(p)
            if (stats.isDirectory()) { 
                var files = fs.readdirSync(p)
                files.forEach(function (n) {
                    var f2 = f ? f + '/' + n : n
                    get(f2, o)
                })
            } else {
                o[f] = stats
            }
        }
    }
    var de = {}
    for(var i = 0 ; i < l2.length ; i++ ){
        de[l2[i]] = 1
    }
    for (var i = 0; i < l.length; i++) {
        var path = l[i] 
        get(path)
    }
    var list = {}
    for (var n in o) {
        if(!(n in de)){
            var f = o[n]
            var v = f.ctime.getTime().toString(36) + "_" + f.size.toString(36)
            list[n] = v
        }
    }
    var web = { "ver": ver, "list": list }
    console.log(web)
    this.saveweblist(web)
    return web
};


GameUpdate.getMd5 = function (data) {
  var crypto = require('crypto'); 
  return crypto.createHash('md5').update(data).digest('hex').toUpperCase();
};




function Scene_Update() {
    //调用 初始化
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Scene_Update.prototype = Object.create(Scene_Base.prototype);
/**设置创造者 */
Scene_Update.prototype.constructor = Scene_Update;
/**初始化 */
Scene_Update.prototype.initialize = function () {
    //场景基础 初始化 呼叫(this)
    Scene_Base.prototype.initialize.call(this);
};
/**创造 */
Scene_Update.prototype.create = function () {
    //场景基础 创造 呼叫(this)
    Scene_Base.prototype.create.call(this);
    //数据管理器 读取基本数据
};

/**是准备好
 * @return {boolean}
 */
Scene_Update.prototype.isReady = function () {
    return Scene_Base.prototype.isReady.call(this)
};

/**开始 */
Scene_Update.prototype.start = function () {
    Scene_Base.prototype.start.call(this);
    if(confirm("更新/创建新列表")){
        GameUpdate.startUpdate()
    }else{
        GameUpdate.makelist() 
    }
};

Scene_Update.prototype.update = function () {
    Scene_Base.prototype.update.call(this);
    if (!GameUpdate.isUpdateEnd()) {

    } else {
        this.endUpdate()
    }
}



Scene_Update.prototype.endUpdate = function () {
    location.reload();
    //SceneManager.goto(Scene_Boot);
}


