var ww = ww || {}

ww.x2d = {

}

ww.x2d._file = {}


ww.x2d.data = {}




/**
 * 
 */

ww.x2d.data.enemy = {
    "xlsx": "详细敌人属性.xlsx",
    //工作簿名称
    "sheets": [
        {   //开始行数
            "start": 1,
            //头是否添加空值
            "head": 1,
            //保存名称
            "save": "Enemies.json",
            //基础对象
            "base": {
                "id": 1,
                "actions": [],
                "battlerHue": 0,
                "battlerName": "",
                "dropItems": [{
                    "dataId": 1,
                    "denominator": 1,
                    "kind": 0
                }, {
                    "dataId": 1,
                    "denominator": 1,
                    "kind": 0
                }, {
                    "dataId": 1,
                    "denominator": 1,
                    "kind": 0
                }],
                "exp": 0,
                "traits": [],
                "gold": 0,
                "name": "",
                "note": "",
                "params": [100, 0, 10, 10, 10, 10, 10, 10]
            },
            //设置的键索引
            "set": [
                //0: "序号"  
                ["id","toNumber"],
                //1: "名称"
                ["name","toTrim"],
                //2: "生命"​​​​
                ["params", 0,"toNumber"],
                //3: "能量"​​​​
                ["params", 1,"toNumber"],
                //4: "物理攻击"​​​​
                ["params", 2,"toNumber"],
                //5: "物理防御"​​​​
                ["params", 3,"toNumber"],
                //6: "魔法攻击"​​​​
                ["params", 4,"toNumber"],
                //7: "魔法防御"​​​​
                ["params", 5,"toNumber"],
                //8: "敏捷"​​​​
                ["params", 6,"toNumber"],
                //9: "幸运"  
                ["params", 7,"toNumber"]
            ], 
        }
    ],
}


/**
 * 转换为前后无空格字符串 
 * @param {string} value 字符串
 */
ww.x2d.toTrim = function (value) {
    return ("" + value || "").replace(/^\s+|\s+$/g, "")
}

/**
 * 转换为数字 
 * @param {number|string} value 数字
 */
ww.x2d.toNumber = function (value) {
    return value * 1
}

/**设置键 
 * 
 * @param {object} obj 对象
 * @param {[string|number]} key 键的数组
 * @param {*} value 值
 */
ww.x2d.setKey = function (obj, key, value) {
    if (obj) {
        var o = obj
        if (Array.isArray(key) && key.length > 0) {
            for (var i = 0, l = key.length - 1; i < l; i++) {
                o = obj[key[i]]
                if (!o) {
                    return
                }
            }
            if (typeof o == "object") {
                o[key[i]] = value
            }
        }
    }
}


/**
 * 克隆对象
 * @param {object} obj 
 */
ww.x2d.clone = function (obj) {
    return JSON.parse(JSON.stringify(obj))
}

/**
 * 改变工作簿
 * @param {*} sheet 工作簿
 * @param {*} start 开始列数
 * @param {*} obj 对象
 * @param {*} re 返回值
 */
ww.x2d.changeSheet = function (sheet, start, obj, re) {
    var re = re || []
    if (Array.isArray(sheet)) {
        for (var li = start || 0; li < sheet.length; li++) {
            var l = sheet[li]
            var d = this.clone(obj.base)
            for (var id = 0; id < obj.set.length; id++) {
                var key = obj.set[id]
                var type = key.pop()
                var value = l[id]
                if (type) {
                    if( obj.fun && typeof obj.fun[type] =="function"  ) {
                        value = obj.fun[type](value) 
                    }else if (typeof ww.x2d[type] == "function") {
                        value = ww.x2d[type](value)
                    } 
                }
                ww.x2d.setKey(d, key, value)
            }
            re.push(d)
        }
    }
}

/**
 * 改变
 * @param {*} xlsx 
 * @param {*} obj 
 */
ww.x2d.change = function (xlsx, obj) {
    var re = []
    if (xlsx && obj) {
        if (obj.head) {
            re.push(null)
        }
        if (Array.isArray(obj.sheets)) {
            for (var i = 0; i < obj.sheets.length; i++) {
                var sheetname = obj.sheets[i]
                var sheet = xlsx[sheetname]
                if (Array.isArray(obj.sheets)) {
                    var start = obj.start[i] || 0
                }
                var start = start || 0
                ww.x2d.changeSheet(sheet, start, obj, re)
            }
        }
    }
    return re
}


ww.x2d.change2 = function (xlsx, obj) {
    if (xlsx && obj) {
        var re = []
        if (obj.head) {
            re.push(null)
        }
        var sheet = xlsx
        var start = obj.start
        var start = start || 0
        ww.x2d.changeSheet(sheet, start, obj, re)
        return re
    }
}


ww.x2d.changeSave = function (re, obj) {
    var text = JSON.stringify(re)
    var blob = new Blob([text], {
        type: "text/plain"
    })
    ww.lsxls.downBlob(blob, obj.save)
    //ww.lsxls.writeFileSync(obj.save, JSON.stringify(re)) 
}
/**
 * 运行
 * @param {*} name 
 */
ww.x2d.run = function (name) {
    var obj = ww.x2d.data[name]
    if (obj && typeof obj == "object") {

        var v = ww.x2d._file[name]
        if (v || v == 0) {
            ww.x2d._file[name] = v || 0
            ww.lsxls.load(obj.xlsx, function (xlsx) {
                var ls = xlsx[1]
                var data = []
                if (Array.isArray(ls)) {
                    if (Array.isArray(obj.sheets)) {
                        for (var i = 0; i < ls.length; i++) {
                            var x = ls[i]
                            var o = obj.sheets[i]
                            if (x && o) {
                                var d = ww.x2d.change2(x, o)
                            } else {
                                var d = []
                            }
                            ww.x2d.changeSave(d, o)
                            data.push(d)
                        }
                    } else {
                        var x = ls[0]
                        var o = obj
                        if (x && o) {
                            var d = ww.x2d.change2(x, o)
                        } else {
                            var d = []
                        }
                        ww.x2d.changeSave(d, o)
                        data = d
                    }
                }
                var data = ww.x2d.change(xlsx, obj)
                ww.lsxls._file[name] = {
                    xlsx: xlsx,
                    data: data
                }
                /*var text = JSON.stringify(data)
                var blob = new Blob([text], {
                    type: "text/plain"
                })
                ww.lsxls.downBlob(blob, obj.save)*/
            }, true)
        }
        return true
    } else {
        return false
    }

}



//ww.x2d.run(ww.x2d.data.enemy)