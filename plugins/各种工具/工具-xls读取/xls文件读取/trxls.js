
//=============================================================================
// trxls.js
//=============================================================================
/*:
 * @plugindesc 翻译数据保存到表格
 * @author wangwang
 * 
 * @param  trxls 
 * @desc 插件 翻译数据保存到表格 ,作者:汪汪
 * @default  汪汪
 *
 * @help
 * f8 / f12
 * console 选项
 * 输入 ww.trxls.save()
 * 等待 save translate end  结束
 * 保存的文件 第一行的第一列为翻译的原数据的位置,请勿修改,
 * 之后第二列为 language =0 时的结果, 第三列为 = 1 时的结果 以此类推
 * 如果为空则调用 = 0 时的结果 如果 = 0 为 空 ,则为 空
 * 不需要修改的可以删除那一行,当进行翻译时不会处理
 * 
 * 
 * 
 * translate.xls中的数据为  其他数据 ,
 * 可以在 ww.trch.translates中获取 
 * 方法为 第一个参数写法为  ["名称"]     
 * 可用  ww.trch.translates["名称"]  获取当前的值
 * 
 * 如 第一列为  ["语言"]   ,第二列为  汉语  ,第三列 为  英语
 * 则 当 ConfigManager.language  为0时 ,
 * ww.trch.translates["语言"]  的值为 汉语
 * 
 * 则 当 ConfigManager.language  为1时 ,
 * ww.trch.translates["语言"]  的值为 英语
 * 
 */



var ww = ww || {}


ww.trxls = {}


ww.trxls._databaseFiles = [
    { name: '$dataActors', src: 'Actors.json' },
    { name: '$dataClasses', src: 'Classes.json' },
    { name: '$dataSkills', src: 'Skills.json' },
    { name: '$dataItems', src: 'Items.json' },
    { name: '$dataWeapons', src: 'Weapons.json' },
    { name: '$dataArmors', src: 'Armors.json' },
    { name: '$dataEnemies', src: 'Enemies.json' },
    { name: '$dataTroops', src: 'Troops.json' },
    { name: '$dataStates', src: 'States.json' },
    { name: '$dataAnimations', src: 'Animations.json' },
    { name: '$dataTilesets', src: 'Tilesets.json' },
    { name: '$dataCommonEvents', src: 'CommonEvents.json' },
    { name: '$dataSystem', src: 'System.json' },
    { name: '$dataMapInfos', src: 'MapInfos.json' }
];


ww.trxls._dataindex = 0
ww.trxls._data = {}
ww.trxls._dataname = []


/**
 * 保存
 */
ww.trxls.save = function () {
    var files = ww.trxls._databaseFiles
    //循环,读取所有 数据库文件列表 里的项目
    for (var i = 0; i < files.length; i++) {
        var name = files[i].name;
        var src = files[i].src;

        ww.trxls.loadData(name, src, name);
    }
}





ww.trxls.loadData = function (name, url, type, onload) {
    ww.trxls._dataindex++
    var xhr = new XMLHttpRequest();
    var url = "data/" + url
    xhr.open('GET', url);
    xhr.responseType = "string"
    var onload = onload || ww.trxls.onload
    xhr.onloadend = function () {
        var result = xhr.response
        onload(result, name, url, type)
    };
    xhr.send()
    return xhr
}
/**
 * 
 * 
 */
ww.trxls.onload = function (result, name, url, type) {
    try {
        var json = JSON.parse(result)
    } catch (error) {
        var json = []
    }
    ww.trxls._data[name] = json

    if (name == "$dataMapInfos") {

        for (var i = 0; i < json.length; i++) {
            var d = json[i]
            if (d && d.id) {
                var n = 'Map%1'.format((d.id).padZero(3));
                ww.trxls.loadData(n, n + ".json", "$dataMap")
            }
        }
    }

    var l = ww.data2xls.copyo2l(json, 0, ww.trxls.xlsset[type])
    ww.lsxls.save(l, "translate/" + name + ".xls")

    ww.trxls._dataname.push(name)

    ww.trxls._dataindex--



    if (!ww.trxls._dataindex) {

        var json = ww.trxls._translate()
    
        ww.trxls._data["translate"] = json
        var l = ww.data2xls.copyo2l(json, 0, ww.trxls.xlsset['translate']) 
        ww.lsxls.save( l, "translate/" + "translate" + ".xls") 
        ww.trxls._dataname.push("translate") 

 
        var t = JSON.stringify(ww.trxls._dataname) 
        ww.lsxls.writeFileSync("translate/" + "translate"  + ".json", t )
  
        ww.trxls.onloadend()
    }
}

ww.trxls._translate  = function () { 
    return  {"语言":"汉语"}
}


ww.trxls.onloadend = function (result, name, url) {
    console.log("save translate end")
}




ww.trxls.xlsset = {


    "$dataMapInfos": [
        [-1]
    ],

    "$dataTilesets": [
        [-1]
    ],

    "$dataAnimations": [
        [-1]
    ],
    "$dataActors": [
        [1, ["name" , "nickname", "note","profile"]]
    ],


    "$dataClasses": [
        [1, ["name", "note"]]
    ],


    "$dataSkills": [
        [1, ["description", "message1", "message2", "name", "note"]]
    ],



    "$dataItems": [
        [1, ["description", "name", "note"]]
    ],


    "$dataWeapons": [
        [1, ["description", "name", "note"]]
    ],



    "$dataArmors": [
        [1, ["description", "name", "note"]]
    ],



    "$dataEnemies": [
        [1, ["name", "note"]]
    ],



    "$dataTroops": [
        [1, ["name"]]
    ],


    "$dataStates": [
        [1, ["description", "message1", "message2", "message3", "message4", "name"]],
    ],




    "$dataSystem": [
        ["armorTypes", 0],
        ["currencyUnit"],
        ["elements", 0],
        ["equipTypes", 0],
        ["gameTitle"],
        ["locale"],
        ["skillTypes", 0],
        ["terms", "basic", 0],
        ["terms", "commands", 0],
        ["terms", "params", 0],
        ["terms", "messages", 0],
        ["weaponTypes", 0]
    ],

    "$dataCommonEvents": [
        [1, "list", {
            has: { code: { values: [102, 108, 408] } }
        }, "parameters", { names: [0] }],
        //文本
        [1, "list", {
            has: { code: { values: [401, 405] } }
        }, "parameters"],

    ],

    "$dataMap": [
        //显示名称
        ["displayName"],
        //事件名称
        ["events",  1, "name"],

        //选项
        ["events", 1, "pages", 1, "list", {
            has: { code: { values: [102, 108, 408] } }
        }, "parameters", { names: [0] }],
        //文本
        ["events", 1, "pages", 1, "list", {
            has: { code: { values: [401, 405] } }
        }, "parameters"]
    ],

    "translate":[
    ]


}





