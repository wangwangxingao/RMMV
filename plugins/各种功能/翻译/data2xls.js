
//=============================================================================
// data2xls.js
//=============================================================================
/*:
 * @plugindesc 表格与对象的转换
 * @author wangwang
 * 
 * @param  data2xls 
 * @desc 插件 表格与对象的转换 ,作者:汪汪
 * @default  汪汪
 *
 * 
 * @param  pluginMust 
 * @desc 插件需要的其他插件支持
 * @default  xlsxcoremin,lsxls
 * 
 * 
 * @help 
 * 对象转换为表格
 * ww.data2xls.copyo2l(that, re, setslist, father) 
 * @param {*} that 源 源对象
 * @param {*} re 返回数组 
 * @param {*} setslist 设置列表
 * @param {*} father 父
 * 
 * 表格转化为对象
 * ww.data2xls.copyl2o()
 */

var ww = ww || {}


ww.data2xls = {}
/**字符串化 */
ww.data2xls.stringify = function (that) {

    return that || ""


    return JSON.stringify(that)

}
/**解析 */
ww.data2xls.parse = function (that) {

    return that || ""
    return JSON.parse(that)
}

/**
 * 深度复制  对象转化为数组
 * @param {*} that 源 源对象
 * @param {*} re 返回数组 
 * @param {*} setslist 设置列表
 * @param {*} path 父地址
 */
ww.data2xls.copyo2l = function (that, re, setslist, path) {
    var that = that
    var i;
    var setslist = setslist || []
    var re = re || []
    var path = path || []
    if (typeof (that) === "object") {
        if (that === null) {
            re.push([JSON.stringify(path), ww.data2xls.stringify(that)])
        } else if (Array.isArray(that)) {
            for (var i = 0; i < that.length; i++) {
                this.check(that, re, setslist, path, i)
            }
        } else {
            for (i in that) {
                this.check(that, re, setslist, path, i)
            }
        }
    } else {
        re.push([JSON.stringify(path), ww.data2xls.stringify(that)])
    }
    return re;
};



/**
 * 检查并处理
 * @param {*} that 原始数据
 * @param {*} re 对象
 * @param {*} setslist 设置列表
 * @param {*} path 父地址
 * @param {*} i 子变量名  
 */
ww.data2xls.check = function (that, re, setslist, path, i) {
    var list = setslist
    var save = {}
    var ch = (list.length == 0)
    for (var sl = 0; sl < list.length; sl++) {
        var sets = list[sl]
        var r = this.checksets(that, path, i, sets)
        if (!r) {
            save[sl] = list[sl]
            list[sl] = 1
        } else {
            ch = r > ch ? r : ch
        }
    }
    if (ch) {
        if (ch == 2) {
            path.push(i)
            re.push([JSON.stringify(path), ww.data2xls.stringify(that[i])])
            path.pop()
        } else {
            path.push(i)
            this.copyo2l(that[i], re, setslist, path)
            path.pop()
        }
    }
    for (var sl in save) {
        list[sl] = save[sl]
    }
};

/**
 * 检查是否继续 根据设置组
 * @param {*} that 原始数据
 * @param {*} path 父组
 * @param {*} i 子变量名
 * @param {*} sets 设置 
 */
ww.data2xls.checksets = function (that, path, i, sets) {
    if (typeof sets == "object" && sets !== null) {
        if (Array.isArray(sets)) {
            var l = path.length
            var set = sets[l]
            return this.checkset(that, path, i, set)
        } else {
            var set = sets
            return this.checkset(that, path, i, set)
        }
    }
    return false
};


/** 
 * 检查是否继续 根据设置 
 * @param {*} that 原始数据
 * @param {*} path 父组地址
 * @param {*} i 子变量名
 * @param {*} set 设置  
 * 无  允许  
 * 字符串  子变量名 与其相等  
 * 数组  子变量 在其中  
 * 对象   
 * nameTypes 子变量名类型 在其中  
 * names 子变量名 在其中  
 * types 子变量类型 在其中  
 * values 子变量值 在其中  
 * has  存在此参数  
 * re  返回
 * 数值   
 * 1 子变量值存在  
 * 2 子变量值 为字符串  
 * -1 不允许
 */
ww.data2xls.checkset = function (that, path, i, set) {
    if (!set) {
        return true
    } else {
        var stype = this.checktype(set)
        if (stype == "string") {
            if (set == i) {
                return true
            } else {
                return false
            }
        } else if (stype == "array") {
            if (set.indexOf(i) >= 0) {
                return true
            }
        } else if (stype == "object") {
            var type = this.checktype(that[i])

            //当前 参数 种类
            if (set.nameTypes) {
                if (set.nameTypes.indexOf(this.checktype(i)) < 0) {
                    return false
                }
            }
            //当前 参数 名称
            if (set.names) {
                if (set.names.indexOf(i) < 0) {
                    return false
                }
            }
            //子值 种类
            if (set.types) {
                if (set.types.indexOf(type) < 0) {
                    return false
                }
            }
            //子值 值
            if (set.values) {
                if (set.values.indexOf(that[i]) < 0) {
                    return false
                }
            }
            /**有这个参数 */
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
        } else if (set == 1 && that[i]) {
            return true
        } else if (set = 2 && typeof (that[i]) == "string") {
            return true

        }
    }
    return false
};


/**
 * 检查种类
 * @param {*} that 原始数据
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
 * 
 * @param {*} list 列表
 * @param {*} obj 对象
 * @param {*} type 种类
 * @param {*} lang 语言
 */
ww.data2xls.copyl2o = function (list, obj, type, lang) {
    var obj = obj || {}
    if (Array.isArray(list)) {

        for (var i = 0; i < list.length; i++) {
            var save = list[i]

            if (save) {
                try {
                    var key = JSON.parse(save[0])
                    this.copyKeyValue(key, save, obj, type, lang)
                } catch (error) {

                }
            }

        }
    }
    return obj
};

/**
 * 拷贝 键 值
 * @param {*} key 键
 * @param {*} save 保存
 * @param {*} obj 对象
 * @param {*} type 种类
 * @param {*} lang 语言
 */
ww.data2xls.copyKeyValue = function (key, save, obj, type, lang) {
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
            var lang = lang || 0
            var value
            try {
                if (save[lang + 1] === undefined) {
                    value = ww.data2xls.parse(save[1])
                } else {
                    value = ww.data2xls.parse(save[lang + 1])
                }
            } catch (e) {
                try {
                    value = ww.data2xls.parse(save[1])
                } catch (e2) {
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


