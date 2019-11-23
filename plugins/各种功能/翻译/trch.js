
//=============================================================================
// trch.js
//=============================================================================
/*:
 * @plugindesc 读取翻译数据并翻译
 * @author wangwang
 * 
 * @param  trch 
 * @desc 插件 读取翻译数据并翻译 ,作者:汪汪
 * @default  汪汪
 *
 * @help 
 * 
 * ConfigManager.language = i   需要翻译的内容在表格中的位置
 * ConfigManager.save();        保存
 * 
 * 
 * 可以在 ww.trch.translates 中获取 
 * 方法为 第一个参数写法为  ["名称"]     
 * 可用  ww.trch.translates["名称"]  获取当前的值
 * 
 * 如 第一列为  ["语言"]   ,第二列为  汉语  ,第三列 为  英语
 * 则 当 ConfigManager.language  为0时 ,
 * ww.trch.translates["语言"]  的值为 汉语
 * 
 * 则 当 ConfigManager.language  为1时 ,
 * ww.trch.translates["语言"]  的值为 英语
 */

ww = ww || {}


ww.trch = {}

ww.trch.language = 0

ww.trch._loadlength = 0

ww.trch.translates = {}
ww.trch.languages = []
ww.trch.ready = false

/**读取 */
ww.trch.load = function () {
    ww.trch.loadData("translate/" + "translate" + ".json")
}

/**读取数据 */
ww.trch.loadData = function (url, onload) {

    var xhr = new XMLHttpRequest();
    var url = url
    xhr.open('GET', url);
    xhr.responseType = "string"
    var onload = onload || ww.trch.onload
    xhr.onloadend = function () {
        var result = xhr.response
        onload(result)
    };
    xhr.send()
    return xhr
}
 
/**当读取 */
ww.trch.onload = function (result) { 
    try {
        var json = JSON.parse(result)
    } catch (error) {
        var json = []
    }
    console.log(result)
    for (var i = 0; i < json.length; i++) {
        var name = json[i]
        ww.trch.loadxls(name)
    }
}


/**读取xls */
ww.trch.loadxls = function (name) {

    ww.trch._loadlength++
    ww.lsxls.load("translate/" + name + ".xls", ww.trch.onloadxls.bind(ww.trch, name))
}


ww.trch._data = {}
/**当读取xls */
ww.trch.onloadxls = function (name, result) {


    if (result && result.sheet1) {
        ww.trch._data[name] = result.sheet1
    } else {
        ww.trch._data[name] = []
    }

    ww.trch._loadlength--

    if (!ww.trch._loadlength) {
        ww.trch.onloadxlsend()
    }
}

/**当读取xls结束 */
ww.trch.onloadxlsend = function () {
    console.log("load translate end")
    ww.data2xls.copyl2o(ww.trch._data["translate"], ww.trch.translates, 1, 0)

    if (ww.trch._data["translate"] && ww.trch._data["translate"][0]) {
        ww.trch.languages = ww.trch._data["translate"][0].slice(1)
    }
    ww.trch.ready = true

    ww.trch.onTranslate()
}

/**当翻译 */
ww.trch.onTranslate = function () {
    if (ww.trch.language) {
        ww.trch.changeLanguage(ww.trch.language)
    }
}

ww.trch._dataName = { '$dataActors': 'Actors', '$dataClasses': 'Classes', '$dataSkills': 'Skills', '$dataItems': 'Items', '$dataWeapons': 'Weapons', '$dataArmors': 'Armors', '$dataEnemies': 'Enemies', '$dataTroops': 'Troops', '$dataStates': 'States', '$dataAnimations': 'Animations', '$dataTilesets': 'Tilesets', '$dataCommonEvents': 'CommonEvents', '$dataSystem': 'System', '$dataMapInfos': 'MapInfos' }

/**改变语言 */
ww.trch.changeLanguage = function (language) {
    ww.trch.language = language;
    if (ww.trch.ready) {
        ww.trch.changeLanguageData("translate", language)
        ww.trch.changeLanguageData("map", language)
        ww.trch.changeLanguageOther(language)
    }
}


ww.trch.changeLanguageOther = function (language) {
    var ns = ww.trch._dataName
    for (var i in ns) { 
        ww.trch.changeLanguageData(i, language)
    }
}

ww.trch.changeLanguageData = function (name, language) {
    // console.log(name)
    if (name == "translate") {
        ww.data2xls.copyl2o(ww.trch._data["translate"], ww.trch.translates, 1, language)
    } else if (name == "map") {
        if ($dataMap) {
            if ($gameMap && $gameMap.mapId()) {
                var id = $gameMap.mapId()
                var mapid = 'Map%1'.format((id).padZero(3));
                if (ww.trch._data[mapid]) {
                    ww.data2xls.copyl2o(ww.trch._data[mapid], $dataMap, 0, language)
                }
            }
        }
    } else { 
        var ns = ww.trch._dataName
        var tn = ns[name]
        if (window[name] && ww.trch._data[tn]) {
            ww.data2xls.copyl2o(ww.trch._data[tn], window[name], 0, language)
        }
    }
}



ww.trch.DataManager_onLoad = DataManager.onLoad
DataManager.onLoad = function (object) {
    if (object == $dataMap) {
        if (ww.trch.language) {
            ww.trch.changeLanguageData("map", ww.trch.language)
        }
    }
    ww.trch.DataManager_onLoad.call(this, object)
};


ww.trch.ConfigManager_makeData = ConfigManager.makeData
ConfigManager.makeData = function () {
    var config = ww.trch.ConfigManager_makeData.call(this);

    config.language = this.language
    return config;
};


ww.trch.ConfigManager_applyData = ConfigManager.applyData
ConfigManager.applyData = function (config) {
    ww.trch.ConfigManager_applyData.call(this, config)

    this.language = config.language

};

ww.trch.DataManager_loadDatabase =
    DataManager.loadDatabase

DataManager.loadDatabase = function () {
    ww.trch.DataManager_loadDatabase.call(this)
    ww.trch.load()
};

Object.defineProperty(ConfigManager, 'language', {
    //获得
    get: function () {
        return ww.trch.language;
    },
    //设置
    set: function (value) {
        var value = value || 0
        if (ww.trch.language != value) {
            ww.trch.language = value;
            ww.trch.changeLanguage(value)
        }
    },
    //可配置 : true
    configurable: true
});

ww.trch.Game_Actor_prototype_initMembers = Game_Actor.prototype.initMembers

Game_Actor.prototype.initMembers = function () {
    ww.trch.Game_Actor_prototype_initMembers.call(this);
    //名称 = 角色 名称
    this._name = undefined //actor.name;
    //昵称 = 角色 昵称
    this._nickname = undefined //actor.nickname;
    //人物简介 = 角色 人物简介
    this._profile = undefined // actor.profile;
};
/**安装*/
ww.trch.Game_Actor_prototype_setup = Game_Actor.prototype.setup

Game_Actor.prototype.setup = function (actorId) {
    ww.trch.Game_Actor_prototype_setup.call(this, actorId)
    //名称 = 角色 名称
    this._name = undefined //actor.name;
    //昵称 = 角色 昵称
    this._nickname = undefined //actor.nickname;
    //人物简介 = 角色 人物简介
    this._profile = undefined // actor.profile; 
};


/**名称*/
Game_Actor.prototype.name = function () {
    //返回 名称
    return this._name === undefined ? this.actor().name : this._name;
};
/**昵称*/
Game_Actor.prototype.nickname = function () {
    //返回 昵称
    return this._nickname === undefined ? this.actor().nickname : this._nickname;

};
Game_Actor.prototype.profile = function () {
    //返回 人物简介
    return this._profile === undefined ? this.actor().profile : this._profile;
};