var ww = ww || {}


ww.data2xls = {}

/**
 * 深度复制 
 * @param {*} that 
 * @param {*} obj 
 * @param {*} setslist 
 * @param {*} father 
 */
ww.data2xls.copyo2l = function (that, obj, setslist, father) {
    var that = that
    var i;
    var setslist = setslist || []
    var obj = obj || []
    var father = father || []
    if (typeof (that) === "object") {
        if (that === null) {
            obj.push([JSON.stringify(father), JSON.stringify(that)])
        } else if (Array.isArray(that)) {
            for (var i = 0; i < that.length; i++) {
                this.check(that, obj, setslist, father, i)
            }
        } else {
            for (i in that) {
                this.check(that, obj, setslist, father, i)
            }
        }
    } else {
        obj.push([JSON.stringify(father), JSON.stringify(that)])
    }
    return obj;
};



/**
 * 检查并处理
 * @param {*} that 
 * @param {*} obj 
 * @param {*} setslist 
 * @param {*} father 
 * @param {*} i 
 */
ww.data2xls.check = function (that, obj, setslist, father, i) {
    var list = setslist
    var save = {}
    var ch = (list.length == 0)
    for (var sl = 0; sl < list.length; sl++) {
        var sets = list[sl]
        var re = this.checksets(that, father, i, sets)
        if (!re) {
            save[sl] = list[sl]
            list[sl] = 1
        } else {
            ch = re > ch ? re : ch
        }
    }
    if (ch) {
        if (ch == 2) {
            father.push(i)
            obj.push([JSON.stringify(father), JSON.stringify(that[i])])
            father.pop()
        } else {
            father.push(i)
            this.copyo2l(that[i], obj, setslist, father)
            father.pop()
        }
    }
    for (var sl in save) {
        list[sl] = save[sl]
    }
};

/**
 * 检查是否继续 根据设置组
 * @param {*} that 原始数据
 * @param {*} father 父组
 * @param {*} i 子变量名
 * @param {*} sets 设置
 */
ww.data2xls.checksets = function (that, father, i, sets) {
    if (typeof sets == "object" && sets !== null) {
        if (Array.isArray(sets)) {
            var l = father.length
            var set = sets[l]
            return this.checkset(that, father, i, set)
        } else {
            var set = sets
            return this.checkset(that, father, i, set)
        }
    }
    return false
};


/** 
 * 检查是否继续 根据设置
 * @param {*} that 
 * @param {*} father 
 * @param {*} i 
 * @param {*} set 
 */
ww.data2xls.checkset = function (that, father, i, set) {
    if (!set) {
        return true
    } else if (typeof set == "string") {
        if (set == i) {
            return true
        } else {
            return false
        }
    } else if (typeof set == "object") {
        var type = this.checktype(that[i])

        if (set.nameTypes) {
            if (set.nameTypes.indexOf(this.checktype(i)) < 0) {
                return false
            }
        }
        if (set.names) {
            if (set.names.indexOf(i) < 0) {
                return false
            }
        }
        if (set.types) {
            if (set.types.indexOf(type) < 0) {
                return false
            }
        }
        if (set.values) {
            if (set.values.indexOf(that[i]) < 0) {
                return false
            }
        }
        if (set.has) {
            if (type == "object" || type == "array") {
                for (var name in set.has) {
                    if (!(name in that[i] && this.checkset(that[i], 0, name, set.has[name]))) {
                        return false
                    }
                }
            } else {
                return false
            }
        }
        if (set.re) {
            return set.re
        } else {
            return true
        }
    }
    return false
};


/**
 * 检查种类
 * @param {*} that 
 */
ww.data2xls.checktype = function (that) {
    var type = typeof (that)
    if (type == "object") {
        if (that === null) {
            return "null"
        } else if (Array.isArray(that)) {
            return "array"
        }
    }
    return type
};
 




/**
 * 拷贝  列表到对象
 * @param {*} list 
 * @param {*} obj 
 * @param {*} type 
 * @param {*} lang 
 */
ww.data2xls.copyl2o = function (list, obj, type,lang) {
    var obj = obj || {}
    for (var i = 0; i < list.length; i++) {
        var save = list[i]
        var key = JSON.parse(save[0]) 
        this.copyKeyValue(key, save , obj, type,lang)
    }
}; 

/**
 * 拷贝 键 值
 * @param {*} key 
 * @param {*} save 
 * @param {*} obj 
 * @param {*} type 
 * @param {*} lang 语言
 */
ww.data2xls.copyKeyValue = function (key, save, obj, type,lang) {
    if (Array.isArray(key) && key.length) {
        var o = obj
        for (var i = 0; i < key.length - 1; i++) {
            var n = key[i]
            if ((typeof o == "object") && (n in o)) {
                o = o[n]
            } else if (type) {
                o[n] = {}
                o = o[n]
            } else {
                return false
            }
        }
        var n = key[i]
        if (typeof o == "object") {
            var lang = lang|| 0 
            var value
            try {
                value = JSON.parse(save[lang +1]) 
            } catch (e) {
                try{
                    value = JSON.parse(save[1]) 
                }catch(e2){ 
                    value = ""
                } 
            } 
            o[n] = value
        }
    }
    return false
};



/**
 * 拷贝 对象到对象
 * @param {*} that 
 * @param {*} obj 
 * @param {*} type 
 */
ww.data2xls.copyo2o = function (that, obj, type) {
    var obj = obj || {}
    if (that && typeof that == "object") {
        if (typeof obj == "object") {
            for (var i in that) {
                ww.data2xls.copyKeyObj(that, obj, i, type)
            }
        }
    }
    return obj;
};

/**
 * 复制对象键
 * @param {*} that 
 * @param {*} obj 
 * @param {*} i 
 * @param {*} type 
 */
ww.data2xls.copyKeyObj = function (that, obj, i, type) {
    var i2;
    var tt = this.checktype(that[i])
    var ot = this.checktype(obj[i])
    if (tt == "object" || tt == "array") {
        if (ot == "object" || ot == "array") {
        } else if (type) {
            if (tt == "array") {
                obj[i] = []
            } else {
                obj[i] = {}
            }
        } else {
            return
        }
        for (i2 in that[i]) {
            this.copyKeyObj(that[i], obj[i], i2, type)
        }
        return
    }
    if ((i in obj) || !type) {
        obj[i] = that[i]
    }
    return;
};



ww.data2xls.getBase = function () {
    var files = DataManager._databaseFiles
    var l = []
    var o = {}
    for (var i = 0; i < files.length; i++) {
        var name = files[i].name; 
        o[name] = window[name]
    }
    ww.data2xls.copyo2l(o, l, [{ types: ["string", "object", "array"] }])
    return l
}


ww.data2xls.saveBase = function () {
    var l = this.getBase()
    ww.lsxls.save(l, "2.xls")
}




/**
  "$dataActors",
[0,"name"]
[0,"nickname"]
[0,"note"]
[0,"profile"]

"$dataClasses",
[0,"name"]
[0,"note"]

"$dataSkills",
[0,"description"]
[0,"message1"]
[0,"message2"]
[0,"name"]
[0,"note"]


"$dataItems",
[0,"description"]
[0,"name"]
[0,"note"]

"$dataWeapons",
[0,"description"]
[0,"name"]
[0,"note"]


"$dataArmors",
[0,"description"]
[0,"name"]
[0,"note"]


"$dataEnemies",
[0,"name"]
[0,"note"]


"$dataTroops",
[0,"name"]


"$dataStates",
[0,"description"]
[0,"message1"]
[0,"message2"]
[0,"message3"]
[0,"message4"]
[0,"name"]

"$dataSystem",
["armorTypes",0]


"$dataSystem",

["currencyUnit"]
["elements",0]
["equipTypes",0]
["gameTitle"]
["locale"] 
["skillTypes",0] 
["terms","basic",0]
["terms","commands",0]
["terms","params",0]
["terms","messages",0]  
["weaponTypes",0]
 

//显示名称
["displayName"]
//事件名称
["events",0,"name"]

  
    //选项
    ["events", { has: {} }, "pages", 0, "list", {
        has: { code: { values: [102] } }
    }, "parameters", { names: [0] }],
    //文本
    ["events", { has: {} }, "pages", 0, "list", {
        has: { code: { values: [401,405] } }
    },"parameters"]






 
    [ 0, "list", {
        has: { code: { values: [102] } }
    }, "parameters", { names: [0] }],
    //文本
    [ 0, "list", {
        has: { code: { values: [401,405] } }
    },"parameters"]

 
 */