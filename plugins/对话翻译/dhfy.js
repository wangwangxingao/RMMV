//=============================================================================
// DHFY.js
//=============================================================================

/*:
 * @plugindesc 对话翻译
 * @author wangwang
 * 
 * @help
 * DHFY.saveTR()
 * 生成翻译文件 
 * 对于显示文本,
 * 相同的设置的显示文本,整合为一个
 * 翻译时会自动换页,也可以用 数字 101 来换页
 * 
 * 
 * DHFY.saveTR2Data(la) //la为语言
 * 把当前语言通过翻译插件转换成对应的数据文件
 * 
 * 额,目前是很鸡肋的东西
 * 
 * */

DHFY = {}
DHFY.temp = {}
DHFY.trtemp = {}

DHFY._defaultlaunge = "cn"
DHFY._launge = "cn"


/**生成翻译文件 */
DHFY.saveTR = function() {
    for (var i = 0; i < DataManager._databaseFiles.length; i++) {
        var name = DataManager._databaseFiles[i].name;
        var src = DataManager._databaseFiles[i].src;
        DHFY.saveTRFileData(src, name);
    }
};


DHFY.saveTRMapData = function(arr) {
    //如果 (地图id > 0)
    for (var i = 0; i < arr.length; i++) {
        var map = arr[i]
        if (map) {
            var mapId = map.id
                // 文件名 = 'Map%1.json' 替换 (mapId 填充0(3位)  )
            var filename = 'Map%1.json'.format(mapId.padZero(3));
            //读取数据文件(数据地图 ,文件名)
            DHFY.saveTRFileData(filename, "$dataMap");
        }
    }
};

DHFY.saveTRFileData = function(src, type) {
    var xhr = new XMLHttpRequest();
    var url = 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    //网址请求 当读取
    xhr.onload = function() {
        //如果 网址请求 状态 < 400
        if (xhr.status < 400) {
            var data = JSON.parse(xhr.responseText)
            if (type == "$dataMapInfos") {
                DHFY.saveTRMapData(data)
            }
            var obj = {}
            console.log(type)
            obj[DHFY._defaultlaunge] = DHFY.read(data, type)
            DHFY.SaveJson(obj, 'tr_' + src, "data")
        }
    };
    //网址请求 当错误
    xhr.onerror = function() {};
    //网址请求 发出
    xhr.send();
}




/**通过翻译文件保存为数据*/
DHFY.saveTR2Data = function(la) {
    var la = la || this._defaultlaunge
    for (var i = 0; i < DataManager._databaseFiles.length; i++) {
        var src = DataManager._databaseFiles[i].src;
        DHFY.saveTR2FileData(src, src, la);
    }
};


DHFY.saveTR2MapData = function(arr, la) {
    for (var i = 0; i < arr.length; i++) {
        var map = arr[i]
        if (map) {
            var mapId = map.id
            var filename = 'Map%1.json'.format(mapId.padZero(3));
            DHFY.saveTR2FileData(filename, filename, la);
        }
    }
};
DHFY.saveTR2FileData = function(name, src, la) {
    DHFY.saveTR2FileData2(name, src, la)
    var xhr = new XMLHttpRequest();
    var url = 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            DHFY.temp[name] = JSON.parse(xhr.responseText)
            if (name == "MapInfos.json") {
                DHFY.saveTR2MapData(DHFY.temp[name], la)
            }
            DHFY.onLoad2(name, src, la)
        }
    };
    xhr.onerror = function() {

    };
    DHFY.temp[name] = null
    xhr.send();
};

DHFY.saveTR2FileData2 = function(name, src, la) {
    var xhr = new XMLHttpRequest();
    var url = 'data/' + "tr_" + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            DHFY.trtemp[name] = JSON.parse(xhr.responseText)
            DHFY.onLoad2(name)
        }
    };
    xhr.onerror = function() {
        DHFY.trtemp[name] = {}
    };
    DHFY.trtemp[name] = null;
    xhr.send();
};

DHFY.onLoad2 = function(name, src, la) {
    if (DHFY.trtemp[name] && DHFY.temp[name]) {
        if (la !== DHFY._defaultlaunge) {
            if (DHFY.trtemp[name][la]) {
                var obj = DHFY.trtemp[name][la]
                var data = DHFY.deepCopyChange(DHFY.temp[name], obj)
                DHFY.SaveJson(data, src, la + "_data")
                return
            }
        }
        var data = DHFY.temp[name]
        DHFY.SaveJson(data, src, la + "_data")
    }
}



DataManager.loadDataFile = function(name, src) {
    DHFY.loadDataFile(name, src)
};

DHFY.loadDataFile = function(name, src) {
    DHFY.loadTRFile(name, src)
    var xhr = new XMLHttpRequest();
    var url = 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            DHFY.temp[name] = JSON.parse(xhr.responseText)
            DHFY.onLoad(name)
        }
    };
    xhr.onerror = function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };

    DHFY.temp[name] = null
    window[name] = null;
    xhr.send();
};

DHFY.loadTRFile = function(name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'data/' + "tr_" + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            DHFY.trtemp[name] = JSON.parse(xhr.responseText)
            DHFY.onLoad(name)
        }
    };
    xhr.onerror = function() {
        DHFY.trtemp[name] = {}
    };
    DHFY.trtemp[name] = null;
    xhr.send();
};



/**当读取 */
DHFY.onLoad = function(name) {
    if (DHFY.trtemp[name] && DHFY.temp[name]) {
        if (DHFY._launge !== DHFY._defaultlaunge) {
            var la = DHFY._launge
            if (DHFY.trtemp[name][la]) {
                var obj = DHFY.trtemp[name][la]
                var data = DHFY.deepCopyChange(DHFY.temp[name], obj)
                window[name] = data;
                DataManager.onLoad(window[name]);
                return
            }
        }
        var data = DHFY.temp[name]
        window[name] = data;
        DataManager.onLoad(window[name]);
    }
}


/**拷贝 */
DHFY.deepCopy = function(that) {
    var that = that
    var obj, i;
    if (typeof(that) === "object") {
        if (that === null) {
            obj = null;
        } else if (Array.isArray(that)) {
            obj = [];
            for (var i = 0; i < that.length; i++) {
                obj.push(DHFY.deepCopy(that[i]));
            }
        } else {
            obj = {}
            for (i in that) {
                obj[i] = DHFY.deepCopy(that[i])
            }
        }
    } else {
        obj = that
    }
    return obj;
};
/**读取 */
DHFY.read = function(data, type) {
        var obj = {}
        obj.type = type
        obj.item = DHFY.itemRead(data, type)
        if (type === "$dataMap") {
            obj.eventsitem = DHFY.itemRead(data.events, "$dataEvent")
        }
        if (type === "$dataMap") {
            obj.events = DHFY.eventsRead(data.events)
        } else if (type === "$dataTroops") {
            obj.events = DHFY.eventsRead(data)
        } else if (type === "$dataCommonEvents") {
            obj.pages = DHFY.eventPagesRead(data)
        }
        return obj
    }
    /**拷贝改变 */
DHFY.deepCopyChange = function(data, obj) {
        var data2 = DHFY.deepCopy(data)
        DHFY.change(data2, obj)
        return data2
    }
    /**项目改变 */
DHFY.change = function(data, obj) {
        if (data && obj && obj.type) {
            var type = obj.type
            DHFY.itemChange(obj.item, data)
            if (type === "$dataMap") {
                DHFY.itemChange(obj.eventsitem, data.events, "$dataEvent")
            }
            if (type === "$dataMap") {
                DHFY.eventsChange(obj.events, data.events)
            } else if (type === "$dataTroops") {
                DHFY.eventsChange(obj.events, data)
            } else if (type === "$dataCommonEvents") {
                DHFY.eventPagesChange(obj.pages, data)
            }
        }
        return data
    }
    /**项目保存内容 */
DHFY.itemReadKey = function(type) {
    var obj = {}
    switch (type) {
        case "$dataActors":
            var obj = { "name": "哈罗尔德", "nickname": "", "note": "", "profile": "" }
            break
        case "$dataAnimations":
            var obj = { "name": "打击/物理" }
            break
        case "$dataArmors":
            var obj = { "description": "", "name": "盾", "note": "" }
            break
        case "$dataClasses":
            var obj = { "name": "勇者", "note": "" }
            break
        case "$dataCommonEvents":
            var obj = { "name": "" }
            break
        case "$dataEnemies":
            var obj = { "name": "蝙蝠", "note": "" }
            break
        case "$dataItems":
            var obj = { "description": "", "name": "恢复药水", "note": "" }
            break
        case "$dataMap":
            var obj = { "displayName": "", "note": "" }
            break
        case "$dataEvent":
            var obj = { "name": "EV001", "note": "" }
            break
        case "$dataMapInfos":
            var obj = {}
            break
        case "$dataSkills":
            var obj = { "description": "", "message1": "的攻击！", "message2": "", "name": "攻击", "note": "当选择［攻击］指令时，\n将使用1号技能。" }
            break
        case "$dataStates":
            var obj = { "message1": "倒下了！", "message2": "倒下了！", "message3": "", "message4": "站了起来！", "name": "战斗不能", "note": "当HP为0时，\n将会自动附加1号状态。" }
            break
        case "$dataSystem":
            var obj = { "armorTypes": [], "currencyUnit": "G", "elements": [], "equipTypes": [], "gameTitle": "Project7", "skillTypes": [], "terms": {}, "weaponTypes": [] }
            break
        case "$dataTilesets":
            var obj = { "name": "世界地图", "note": "" }
            break
        case "$dataTroops":
            var obj = { "name": "蝙蝠*2" }
            break
        case "$dataWeapons":
            var obj = { "description": "", "name": "剑", "note": "" }
            break
    }
    return obj
}




/**项目读取 */
DHFY.itemRead = function(data, type) {
    var obj = null
    if (type === "$dataSystem" || type === "$dataMap") {
        if (data) {
            var keylist = DHFY.itemReadKey(type)
            var da = data
            if (da) {
                for (var key in keylist) {
                    if (key in da) {
                        obj = obj || {}
                        obj[key] = da[key]
                    }
                }
            }
        }
    } else {
        if (data && Array.isArray(data)) {
            var keylist = DHFY.itemReadKey(type)
            for (var di = 0; di < data.length; di++) {
                var da = data[di]
                if (da) {
                    for (var key in keylist) {
                        if (key in da) {
                            obj = obj || {}
                            obj[di] = obj[di] || {}
                            obj[di][key] = da[key]
                        }
                    }
                }
            }
        }
    }
    return obj
}

/**项目改变 */
DHFY.itemChange = function(obj, data, type) {
    if (type === "$dataSystem" || type === "$dataMap") {
        if (obj && data) {
            for (var key in obj) {
                if (key in data) {
                    data[key] = obj[key]
                }
            }
        }
    } else {
        if (obj && data && Array.isArray(data)) {
            for (var di in obj) {
                var obj2 = obj[di]
                var da = data[di]
                if (obj2 && da) {
                    for (var key in obj2) {
                        if (key in da) {
                            da[key] = obj2[key]
                        }
                    }
                }
            }
        }
    }
    return data
}


/**事件组读取 */
DHFY.eventsRead = function(data) {
    var obj = null
    if (data && Array.isArray(data)) {
        var events = data
        for (var ei = 0; ei < events.length; ei++) {
            var event = events[ei]
            if (event && event.pages) {
                var pages = this.eventPagesRead(event.pages)
                if (pages) {
                    obj = obj || {}
                    obj[ei] = pages
                }
            }
        }
    }
    return obj
}



/**事件组改变 */
DHFY.eventsChange = function(obj, data) {
    if (obj && data) {
        var events = data
        for (var ei in obj) {
            event = events[ei]
            if (event && event.pages) {
                event.pages = this.eventPagesChange(obj[ei], event.pages)
            }
        }
    }
    return data
}

/**事件页读取 */
DHFY.eventPagesRead = function(data) {
    var obj = null
    if (Array.isArray(data)) {
        var pages = data
        for (var pi = 0; pi < pages.length; pi++) {
            var page = pages[pi]
            if (page) {
                var list = page.list
                for (var li = 0; li < list.length; li++) {
                    var com = list[li]
                    var code = com.code
                    if (code === 101 || code === 102) {
                        var addid = 0
                        if (code === 101) {
                            var cc = { "code": 101, "indent": com.indent }
                            var add = []
                            while (true) {
                                var newcom = list[li + addid + 1]
                                if (newcom && newcom.code === 401 && newcom.indent === com.indent) {
                                    add = add || []
                                    add.push(newcom.parameters[0])
                                } else if (newcom && newcom.code === 101 &&
                                    newcom.indent === com.indent &&
                                    newcom.parameters[0] == com.parameters[0] &&
                                    newcom.parameters[1] == com.parameters[1] &&
                                    newcom.parameters[2] == com.parameters[2] &&
                                    newcom.parameters[3] == com.parameters[3]) {
                                    add.push(101)
                                } else {
                                    break
                                }
                                addid++
                            }
                            cc.text = add
                        }
                        if (code === 102) {
                            var cc = { "code": 102, "indent": com.indent, "text": com.parameters[0] }
                        }
                        obj = obj || {}
                        obj[pi] = obj[pi] || {}
                        obj[pi][li] = cc
                        li += addid
                    }
                }
            }

        }
    }
    return obj
}

/**事件页改变 */
DHFY.eventPagesChange = function(obj, data) {
    if (obj && data && Array.isArray(data)) {
        var pages = data
        for (var pi in obj) {
            page = pages[pi]
            if (page && page.list) {
                var list = page.list
                var temp401 = 0
                var temp402 = []
                for (var li in obj[pi]) {
                    var cc = obj[pi][li]
                    var li2 = li * 1 + temp401
                    var com = list[li2]
                    if (cc.code === 101 && com.code === cc.code && com.indent == cc.indent) {
                        var add = cc.text
                        while (true) {
                            var newcom = list[li2 + 1]
                            if (newcom && newcom.code === 401 && newcom.indent === cc.indent) {
                                list.splice(li2 + 1, 1)
                                temp401--
                            } else if (newcom && newcom.code === 101 &&
                                newcom.indent === com.indent &&
                                newcom.parameters[0] == com.parameters[0] &&
                                newcom.parameters[1] == com.parameters[1] &&
                                newcom.parameters[2] == com.parameters[2] &&
                                newcom.parameters[3] == com.parameters[3]) {
                                list.splice(li2 + 1, 1)
                                temp401--
                            } else {
                                break
                            }
                        }
                        if (add.length == 0) {
                            add = [""]
                        }
                        var addid = 1

                        var texti = 0
                        for (var cpi = 0; cpi < add.length; cpi++) {
                            if (add[cpi] === 101) {
                                temp401++
                                var newcom = { "code": 101, "indent": com.indent, "parameters": com.parameters }
                                list.splice(li2 + cpi + addid, 0, newcom)
                                texti = 0
                                continue
                            }
                            if (texti % 4 == 0 && texti != 0) {
                                temp401++
                                addid += 1
                                var newcom = { "code": 101, "indent": com.indent, "parameters": cc.parameters }
                                list.splice(li2 + cpi + addid, 0, newcom)
                            }
                            var newcom = { "code": 401, "indent": cc.indent, "parameters": [add[cpi]] }
                            temp401++
                            list.splice(li2 + cpi + addid, 0, newcom)
                        }
                    }
                    if (cc.code === 102 && com.code === cc.code && com.indent == cc.indent) {
                        com.parameters[0] = cc.text
                        var add = cc.text
                        var addid = 0
                        for (var cpi = 0; cpi < add.length; cpi++) {
                            while (true) {
                                addid++
                                var newcom = list[li2 + addid]
                                if (newcom && newcom.code === 402 && newcom.indent === cc.indent) {
                                    newcom.parameters[1] = add[cpi]
                                    break
                                }

                            }
                        }
                    }
                }
            }
        }
    }
    return data
}




DHFY.istype = function() {
    return StorageManager.isLocalMode()
}


//保存对象 (对象,文件名,文件夹名)
DHFY.SaveJson = function(json, name, wzname) {
    if (this.istype()) {
        DHFY.SaveJson2(json, name, wzname)
    } else {
        DHFY.SaveJson1(json, name)
    }

};

//保存对象 (对象,文件名,文件夹名)
DHFY.SaveJson1 = function(json, name) {
    var name = name || this.json_name || 'jsonsj.json';
    var data = JSON.stringify(json);
    /**
     * 在本地进行文件保存
     * @param  {String} data     要保存到本地的数据
     * @param  {String} filename 文件名
     */
    var saveFile = function(data, filename) {
        var urlObject = window.URL || window.webkitURL || window;
        var export_blob = new Blob([data]);
        var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
        save_link.href = urlObject.createObjectURL(export_blob);
        save_link.download = filename;
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
    };
    // download
    saveFile(data, name);
    return data;
};

//文件夹位置
DHFY.dirPath = function(name) {
    var weizhi_name = name || this.path_name || 'chucun';
    var weizhi = '/' + weizhi_name + '/';
    var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, weizhi);
    if (path.match(/^\/([A-Z]\:)/)) {
        path = path.slice(1);
    }
    var dirpath = decodeURIComponent(path);

    var fs = require('fs');
    if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath);
    }
    return dirpath;
}


//保存对象 (对象,文件名,文件夹名)
DHFY.SaveJson2 = function(json, name, wzname) {
    var name = name || this.json_name || 'jsonsj.json';
    var data = JSON.stringify(json);
    var filePath = this.dirPath(wzname) + name;
    var fs = require('fs');
    fs.writeFileSync(filePath, data);
    return data;
};