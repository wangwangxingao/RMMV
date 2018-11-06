//=============================================================================
// trchTo.js
//=============================================================================
/*:
 * @plugindesc 读取翻译数据并翻译,并保存数据到文件夹
 * @author wangwang
 * 
 * @param  trchTo 
 * @desc 插件 读取翻译数据并翻译,保存数据到文件夹 ,作者:汪汪
 * @default  汪汪
 *
 * @help 
 *  
 * ww.trchTo.trTo(l)  l 语言编号
 * 
 */

ww = ww || {}


ww.trchTo = {}

ww.trchTo.language = 0

ww.trchTo._loadlength = 0

ww.trchTo.translates = {}
ww.trchTo.languages = []
ww.trchTo.ready = false
ww.trchTo.load = function () {
    ww.trchTo.loadData("translate/" + "translate" + ".json")
}
ww.trchTo.loadxls = function (name) {
    ww.trchTo._loadlength++
    console.log(name)
    ww.lsxls.load("translate/" + name + ".xls", ww.trchTo.onloadxls.bind(ww.trchTo, name))
}

/**读取数据 */
ww.trchTo.loadData = function (url, onload) {
    var xhr = new XMLHttpRequest();
    var url = url
    xhr.open('GET', url);
    xhr.responseType = "string"
    var onload = onload || ww.trchTo.onload
    xhr.onloadend = function () {
        var result = xhr.response
        console.log(result)
        onload(result)
    };
    xhr.send()
    return xhr
}

/**当读取 */
ww.trchTo.onload = function (result) {
    try {
        var json = JSON.parse(result)
    } catch (error) {
        var json = []
    }
    console.log(json)
    for (var i = 0; i < json.length; i++) {
        var name = json[i]
        console.log(name, i)
        ww.trchTo.loadxls(name)
    }
}


ww.trchTo._data = {}
ww.trchTo.onloadxls = function (name, result) {
    console.log(name, result)
    if (result && result.sheet1) {
        ww.trchTo._data[name] = result.sheet1
    } else {
        ww.trchTo._data[name] = []
    }

    ww.trchTo._loadlength--

    if (!ww.trchTo._loadlength) {
        ww.trchTo.onloadxlsend()
    }
}


ww.trchTo.onloadxlsend = function () {
    console.log("load translate end")
    ww.data2xls.copyl2o(ww.trchTo._data["translate"], ww.trchTo.translates, 1, 0)

    if (ww.trchTo._data["translate"] && ww.trchTo._data["translate"][0]) {
        ww.trchTo.languages = ww.trchTo._data["translate"][0].slice(1)
    }
    ww.trchTo.ready = true
}





ww.trchTo._filedata = {}
ww.trchTo._filedataindex = {}


ww.trchTo._databaseFiles = [
    'Actors',
    'Classes',
    'Skills',
    'Items',
    'Weapons',
    'Armors',
    'Enemies',
    'Troops',
    'States',
    'Animations',
    'Tilesets',
    'CommonEvents',
    'System',
    'MapInfos',
];

ww.trchTo.trTo = function (language) {
    var files = ww.trchTo._databaseFiles
    //循环,读取所有 数据库文件列表 里的项目
    for (var i = 0; i < files.length; i++) {
        var name = files[i]
        var src = name + ".json";
        ww.trchTo.loadFileData(name, src, name, 0, language);
    }
}


ww.trchTo.loadFileData = function (name, url, type, onload, language) {
    ww.trchTo._filedataindex[language] = ww.trchTo._filedataindex[language] || 0
    ww.trchTo._filedataindex[language]++
    var onload = onload || ww.trchTo._trTo
    if (ww.trchTo._filedata[name]) {
        var result = ww.trchTo._filedata[name]
        onload(result, name, url, type, language)
    } else {
        var xhr = new XMLHttpRequest();
        var url2 = "data/" + url
        xhr.open('GET', url2);
        xhr.responseType = "string"
        xhr.onloadend = function () {
            var result = xhr.response
            try {
                var result = JSON.parse(result)
            } catch (error) {
                var result = []
            }
            ww.trchTo._filedata[name] = result
            onload(result, name, url, type, language)
        };
        xhr.send()
        return xhr
    }
}
/**
 * 
 * 
 */
ww.trchTo._trTo = function (result, name, url, type, language) {

    var json = JSON.parse(JSON.stringify(result))

    if (name == "MapInfos") {
        for (var i = 0; i < json.length; i++) {
            var d = json[i]
            if (d && d.id) {
                var n = 'Map%1'.format((d.id).padZero(3));
                ww.trchTo.loadFileData(n, n + ".json", "Map", 0, language)
            }
        }
    }

    var s = ww.data2xls.copyl2o(ww.trchTo._data[name], json, 1, language)
    console.log(s)
    var l = JSON.stringify(s)

    ww.lsxls.writeFileSync("translateTo/" + language + "/" + name + ".json", l)

    ww.trchTo._filedataindex[language]--

    if (!ww.trchTo._filedataindex[language]) {
        ww.trchTo.ontrend(language)
    }
}


ww.trchTo.ontrend = function (language) {
    console.log("translate" + language + " end")
}

ww.trchTo.load()
