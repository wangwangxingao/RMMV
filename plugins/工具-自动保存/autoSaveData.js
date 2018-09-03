//=============================================================================
// autoSaveData.js
//=============================================================================
/*:
 * @plugindesc 自动保存游戏数据
 * @author wangwang
 *
 * @param autoSaveData
 * @desc 自动保存游戏数据
 * @default 汪汪
 *
 * @param tempTime
 * @desc 临时保存的时间间隔(s)
 * @default 600
 * 
 * @param tempLength
 * @desc 临时保存的数量
 * @default 10
 *
 * @param lastTime
 * @desc 永久保存的时间间隔(s)
 * @default 3600
 * 
 * 
 * @param compress 
 * @desc 需要自动压缩(压缩需要一些时间)
 * @default true
 * 
 * 
 * @param mustAutoSave
 * @desc 需要自动保存,运行游戏时根据时间进行自动保存
 * @default true
 * 
 * 
 * @param mustAutoDel
 * @desc 需要自动删除,删除多余的保存文件
 * @default true
 * 
 * 
 *
 * @help 
 * 
 * 
 * 
 * autoSaveData.save() 临时保存
 * 
 * autoSaveData.parseMD5("520ECB2E44B63985094AF75E0C832B17")
 * 解压md5对应的数据
 * 
 * autoSaveData.showSaveTimeLine()
 * 显示保存的时间线
 *  
 * 
 * */
autoSaveData = {}


PluginManager.find = function (n) {
    var l = PluginManager._parameters;
    var p = l[(n || "").toLowerCase()];
    if (!p) { for (var m in l) { if (l[m] && l[m][n] == "汪汪") { p = l[m]; } } }
    return p || {}
}

PluginManager.parse = function (i) {
    try { return JSON.parse(i) } catch (e) { return i }
}

PluginManager.get = function (n) {
    var m, o = {}, p = this.find(n)
    for (m in p) { o[m] = this.parse(p[m]) }
    return o
}


autoSaveData = PluginManager.get("autoSaveData")

autoSaveData._saveJson = {}




autoSaveData._dirs = {}

//autoSaveData.fs = require("fs")
/**保存文件 */
autoSaveData.saveFile = function (n, t) {
    var fs = require('fs');
    var filePath = n
    fs.writeFileSync(filePath, t);
};

/**删除文件 */
autoSaveData.delFile = function (n) {
    var fs = require('fs');
    var filePath = n
    fs.unlinkSync(filePath);
};


autoSaveData.localFileName = function (name) {
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



autoSaveData.dirName2Url = function (dirpath, name) {
    if (name) {
        var url = dirpath + '/' + name
    } else {
        var url = dirpath
    }
    return url
}

/**本地地址
 * 
 */
autoSaveData.localURL = function () {
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









/**解析md5 */
autoSaveData.parseMD5 = function (md5) {
    var url = this.localFileName("auto/" + md5 + ".json")
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function () {
        if (xhr.status < 400) {

            if (autoSaveData.compress) {
                var data = LZString.decompressFromBase64(xhr.responseText)
            } else {
                var data = xhr.responseText
            }
            try {
                var json = JSON.parse(data)
                autoSaveData.onParseMD5(md5, json);
            } catch (error) {
            }
        }
    };
    xhr.onerror = function () {

    };
    xhr.send();

}


autoSaveData.onParseMD5 = function (md5, json) {
    for (var i in json) {
        var path = this.localFileName("auto/" + md5 + "/" + i)
        var data = json[i]
        this.saveFile(path, data)
    }
}








/** 
 * 读取自动保存过去的列表进行判断
 * 
 * 
 */




autoSaveData.loadAutoLastList = function () {

    this.localFileName("auto/savelist.json")

    var xhr = new XMLHttpRequest();

    var url = "auto/savelist.json";
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function () {
        if (xhr.status < 400) {
            autoSaveData._saveList = JSON.parse(xhr.responseText);
            autoSaveData.onloadAutoLastList()
        }
    };
    xhr.onerror = function () {
        autoSaveData._saveList = {};
        autoSaveData.onloadAutoLastList()
    };
    xhr.send();
}



autoSaveData.makeSaveTimeLine = function () {
 
    var l = {}
    var l2 = []
    for (var md5 in this._saveList) {
        var list = this._saveList[md5]
        for (var i = 0; i < list.length; i++) {
            l[list[i]] = md5
            l2.push([list[i], md5])
        }
    }
    this._saveTimeLine = l
    this._saveTimeList = l2
}




autoSaveData.onloadAutoLastList = function () {
 
    this.makeSaveTimeLine()

    if (this.mustAutoSave) {
        this.autoSave()
    } else {  
        if(this.mustAutoDel){ 
            this.autoDel()
        }else{
            console.log(autoSaveData.showSaveTimeLine()) 
        } 
    } 
};



/**自动保存 */
autoSaveData.autoSave = function () {
    var l = this.showSaveTimeList()
    var last = l[l.length - 1]
    this._saveTime = autoSaveData.getHouZhui()
    if (last) {
        var tempTime = (isFinite(this.tempTime) ? this.tempTime : 0) * 1000
        if (this._saveTime - last[0] > tempTime) {
            this.saveLoad()
        }
    } else {
        this.saveLoad()
    }
}



autoSaveData.showSaveTimeLine = function () {
    var l = {}
    for (var time in this._saveTimeLine) {
        var n = autoSaveData.getTime(time)
        l[n] = this._saveTimeLine[time]
    }

    return l
};

/**显示保存时间列表 */
autoSaveData.showSaveTimeList = function () {
    var l = []
    for (var time in this._saveTimeLine) {
        var n = autoSaveData.getTime(time);
        var md5 = this._saveTimeLine[time];
        var t = time * 1;
        l.push([t, n, md5])
    }
    l.sort(function (a, b) {
        return a[0] - b[0]
    })

    return l
};


/**获取时间 */
autoSaveData.getTime = function (time) {
    var myDate = new Date();
    myDate.setTime(time)
    var ye = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    var mo = (myDate.getMonth() + 1).padZero(2); //获取当前月份(0-11,0代表1月)
    var d = myDate.getDate().padZero(2); //获取当前日(1-31)
    var h = myDate.getHours().padZero(2); //获取当前小时数(0-23)
    var m = myDate.getMinutes().padZero(2); //获取当前分钟数(0-59)
    var s = myDate.getSeconds().padZero(2); //获取当前秒数(0-59)
    var ms = myDate.getMilliseconds().padZero(3); //获取当前毫秒数(0-999) 
    var list = [ye, mo, d, h, m, s, ms]
    return list;
}

 

/**保存 */
autoSaveData.save = function(){ 
    this._saveTime = autoSaveData.getHouZhui() 
    this.saveLoad() 
}

/**进行保存需要的读取 */
autoSaveData.saveLoad = function () {
    autoSaveData.loadAll()
}




/**
 * 
 * 
 * 读取数据准备保存
 * 
 * 
 */








autoSaveData.loadAll = function () {
    autoSaveData.savelength = 0
    autoSaveData.save = {};

    var loadList = this.loadList;
    var l = loadList.length;
    autoSaveData.savelength += l

    for (var i = 0; i < l; i++) {
        var name = this.loadList[i];
        autoSaveData.loadDataFile(name);
    }

}



autoSaveData.loadList = [
    'MapInfos.json',
    'Actors.json',
    'Classes.json',
    'Skills.json',
    'Items.json',
    'Weapons.json',
    'Armors.json',
    'Enemies.json',
    'Troops.json',
    'States.json',
    'Animations.json',
    'Tilesets.json',
    'CommonEvents.json',
    'System.json'
]




autoSaveData.loadDataFile = function (name) {
    //网址请求 = 新 XML网址请求()
    var xhr = new XMLHttpRequest();

    var src = name;
    //url位置 = "data" + src
    var url = "data/" + src;
    //网址请求 打开( 'GET' , url位置)
    xhr.open('GET', url);
    //网址请求 文件类型('application/json')
    xhr.overrideMimeType('application/json');
    //网址请求 当读取
    xhr.onload = function () {
        //如果 网址请求 状态 < 400
        if (xhr.status < 400) {
            //窗口[name] = json解析(网址请求 返回text) 
            autoSaveData._saveJson[name] = xhr.responseText;
            if (name == "MapInfos.json") {
                autoSaveData.loadAllMap(autoSaveData._saveJson[name])
            }
            autoSaveData.savelength--

            if (autoSaveData.savelength <= 0) {
                autoSaveData.onAllDataLoad()
            }
        }
    };
    //网址请求 当错误
    xhr.onerror = function () {
        autoSaveData.savelength--

    };
    //窗口[name] = null
    autoSaveData._saveJson[name] = null;
    //网址请求 发出
    xhr.send();
};


/**读取所有地图 */
autoSaveData.loadAllMap = function (data) {
    var loadList = JSON.parse(data);


    var l = loadList.length
    autoSaveData.savelength += l

    for (var i = 0; i < l; i++) {
        var map = loadList[i]
        if (map) {
            this.loadMapData(map.id)
        } else {
            autoSaveData.savelength--
        }
    }
}


/**读取地图数据 */
autoSaveData.loadMapData = function (mapId) {
    //如果 (地图id > 0)
    if (mapId > 0) {
        // 文件名 = 'Map%1.json' 替换 (mapId 填充0(3位)  )
        var filename = 'Map%1.json'.format(mapId.padZero(3));
        this.loadDataFile(filename);
        //否则
    } else {
        autoSaveData.savelength--
    }
};

/**获取后缀 */
autoSaveData.getHouZhui = function () {

    //var myDate = new Date() 
    return Date.now() //myDate.toJSON() 
}



/**获取MD5 */
autoSaveData.getMd5 = function (date, type) {
    var t = type || "md5"
    var c = require('crypto')
    var m = c.createHash(t)
    m.update(date)
    var z = m.digest("hex").toUpperCase();;
    return z
}

/**当读取 */
autoSaveData.onAllDataLoad = function () {
 

    if (this.compress) {
        this._saveText = LZString.compressToBase64(JSON.stringify(this._saveJson))
    } else {
        this._saveText = JSON.stringify(this._saveJson)
    }
    this._saveMD5 = autoSaveData.getMd5(this._saveText)
    console.log(this._saveMD5)
    autoSaveData.saveThis()
}



/**进行保存 */
autoSaveData.saveThis = function () {
    var md5 = this._saveMD5;
    if (!autoSaveData._saveList[md5]) {
        autoSaveData._saveList[md5] = []
        var path = this.localFileName("auto/" + md5 + ".json")

        autoSaveData.saveFile(path, this._saveText)
    }
    autoSaveData._saveList[md5].push(this._saveTime)

    this.makeSaveTimeLine()

    if (this.mustAutoDel) {
        this.autoDel()
    } else { 
        console.log(autoSaveData.showSaveTimeLine()) 
    }
}







autoSaveData.autoDel = function () {

    var l = this.showSaveTimeList()

    var templist = []
    var delList = {}
    var saveMD5 = {}
    var last

    for (var i = 0; i < l.length; i++) {

        var set = l[i]

        var time = set[0]
        var md5 = set[2]


        if (saveMD5[md5]) {
            //saveMD5[md5] = true
        } else {
            if (last) {

                var lastTime = (isFinite(this.lastTime) ? this.lastTime : 0) * 1000
                if (time - last[0] > lastTime) {
                    last = set
                    saveMD5[md5] = true
                } else {
                    templist.push(set)
                }
            } else {
                last = set
                saveMD5[md5] = true
            }
        }
    }

    var l = templist;

    var tempLength = (isFinite(this.tempLength) ? this.tempLength : 10);
    for (var i = l.length - 1; i >= 0; i--) {
        var set = l[i];
        var time = set[0];
        var md5 = set[2];
        if (saveMD5[md5] || delList[md5]) {
        } else {
            if (tempLength < 0) {
                delList[md5] = true;
            } else {
                saveMD5[md5] = true;
                tempLength--;
            }
        }
    }

    for (var md5 in delList) {
        delete autoSaveData._saveList[md5]
        var path = this.localFileName("auto/" + md5 + ".json")
        autoSaveData.delFile(path)
    }



    var path = this.localFileName("auto/" + "savelist" + ".json");
    autoSaveData.saveFile(path, JSON.stringify(autoSaveData._saveList))

    this.makeSaveTimeLine()

    console.log(autoSaveData.showSaveTimeLine())
}



/**
 * 删除md5
 * @param {*} md5 
 */
autoSaveData.delMD5 = function (md5) {

    delete autoSaveData._saveList[md5]
    var path = this.localFileName("auto/" + "savelist" + ".json")
    autoSaveData.saveFile(path, JSON.stringify(autoSaveData._saveList))

    var path = this.localFileName("auto/" + md5 + ".json")
    autoSaveData.delFile(path)

    this.makeSaveTimeLine()

}


/**
 * 删除时间
 * @param {*} time 
 */

autoSaveData.delTime = function (time) {
    var time = time * 1
    var md5 = this._saveTimeLine[time]

    var list = autoSaveData._saveList[md5]
    if (list) {
        var index = list.indexOf(time)
        list.splice(index, 1)
    }
    if (!list || !list.length) {
        this.delMD5(md5)
    }else{
        this.makeSaveTimeLine() 
    }
 

}





autoSaveData.autoGo = function () {

    autoSaveData.loadAutoLastList()
}


autoSaveData.autoGo()