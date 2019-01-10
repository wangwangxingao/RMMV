var ww = ww || {}



ww.set = {}


/**
 * 检查种类
 * @param {*} that 检查目标
 */
ww.set.checktype = function (that) {
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
 * 拷贝 对象到对象
 * @param {*} that  源对象
 * @param {*} obj  目标对象
 * @param {*} type  是否强制
 */
ww.set.o2o = function (that, obj, type) {
    var obj = obj || {}
    if (that && typeof that == "object") {
        if (typeof obj == "object") {
            for (var i in that) {
                ww.set.copyKeyObj(that, obj, i, type)
            }
        }
    }
    return obj;
};

/**
 * 复制对象键
 * @param {*} that  源对象
 * @param {*} obj  目标对象
 * @param {*} i  键名称
 * @param {*} type  是否强制 
 */
ww.set.copyKeyObj = function (that, obj, i, type) {
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
