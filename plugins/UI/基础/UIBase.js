DataManager.deepClone = function (that) {
    var that = that
    var obj, i;
    if (typeof (that) === "object") {
        if (that === null) {
            obj = null;
        } else if (Array.isArray(that)) {  //Object.prototype.toString.call(that) === '[object Array]') { 
            obj = [];
            for (var i = 0; i < that.length; i++) {
                obj.push(this.deepClone(that[i]));
            }
        } else {
            obj = {}
            for (i in that) {
                obj[i] = this.deepClone(that[i])
            }
        }
    } else {
        obj = that
    }
    return obj;
};

/**值的赋予 */

Sprite.prototype.__getSpriteValue = function (o1, name1) {
    if (Array.isArray(name1)) {
        for (var i = 0; i < name1.length - 1; i++) {
            var n = name1[i]
            if (o1 && typeof o1 == "object") {
                o1 = o1[n]
            } else {
                return
            }
        }
        var name1 = name1[i]
    }
    if (o1 && typeof o1 == "object") {
        return [o1, name1]
    }

}

Sprite.prototype.__setSpriteValue = function (s, set, oa, anmobj, type, name1, name2) {
    var js = 0
    var t1 = 0
    var t2 = 0
    if (type) {
        var t1 = Math.floor(type * 0.01)
        var t2 = Math.floor(type * 0.1 - t1 * 10)
        var js = Math.floor(type % 10)
    }

    var o1 = s
    var o2 = set
    if (t1 == 2) {
        o1 = s
    } else if (t1 == 3) {
        o1 = set
    } else if (t1 == 4) {
        o1 = oa
    } else if (t1 == 5) {
        o1 = anmobj
    } else if (t1 == 6) {
        oa.value = oa.value || {}
        o1 = oa.value
    }
    if (t2 == 2) {
        o2 = s
    } else if (t2 == 3) {
        o2 = set
    } else if (t2 == 4) {
        o2 = oa
    } else if (t2 == 5) {
        o2 = anmobj
    } else if (t2 == 6) {
        oa.value = oa.value || {}
        o2 = oa.value
    }
    if (Array.isArray(name1)) {
        for (var i = 0; i < name1.length - 1; i++) {
            var n = name1[i]
            if (o1 && typeof o1 == "object") {
                o1 = o1[n]
            } else {
                return
            }
        }
        var name1 = name1[i]
    }
    if (Array.isArray(name2)) {
        for (var i = 0; i < name2.length - 1; i++) {
            var n = name2[i]
            if (o2 && typeof o2 == "object") {
                o2 = o2[n]
            } else {
                return
            }
        }
        var name2 = name2[i]
    }

    if (o1 && o2 && typeof o2 == "object" && typeof o1 == "object") {
        if (js == 0) {
            o1[name1] = o2[name2]
        } else if (js == 1) {
            o1[name1] = o1[name1] + o2[name2]
        } else if (js == 2) {
            o1[name1] = o1[name1] - o2[name2]
        } else if (js == 3) {
            o1[name1] = o1[name1] * o2[name2]
        } else if (type == 4) {
            o1[name1] = o1[name1] / o2[name2]
        } else if (js == 5) {
            o1[name1] = o1[name1] % o2[name2]
        }
    }
}

/**值的比较 */
Sprite.prototype.__setEvalValue = function (time, type, value) {
    var value = value || 0
    if (type == 0) {
        return value
    } else if (type == 1) {
        return time + value
    } else if (type == 2) {
        return time - value
    } else if (type == 3) {
        return time * value
    } else if (type == 4) {
        return time / value
    } else if (type == 5) {
        return time % value
    }
    return 0
}


Sprite.prototype.__setEvalValue = function (time, type, value) {
    var value = value || 0
    if (type == 0) {
        return value
    } else if (type == 1) {
        return time + value
    } else if (type == 2) {
        return time - value
    } else if (type == 3) {
        return time * value
    } else if (type == 4) {
        return time / value
    } else if (type == 5) {
        return time % value
    }else if (type == 6) {
        return value + time
    } else if (type == 7) {
        return value - time 
    } else if (type == 8 ) {
        return value * time
    } else if (type == 9) {
        return value /time
    } else if (type == 10) {
        return value % time 
    }
    return 0
}

Sprite.prototype.__isEvalValue = function (time, type, value) { 
    var value = value || 0
    if (type == 0) {
        return time == value
    } else if (type == 1) {
        return time > value
    } else if (type == 2) {
        return time >= value
    } else if (type == 3) {
        return time < value
    } else if (type == 4) {
        return time <= value
    } else if (type == 5) {
        return time != value
    } else if (type == 6) {
        return time % value == 0
    } else if (type == 7) {
        return time % value != 0
    }
    return false
}



var Sprite_prototype_initialize = Sprite.prototype.initialize
/**初始化 */
Sprite.prototype.initialize = function (bitmap) {
    //精灵 初始化 呼叫(this)
    Sprite_prototype_initialize.call(this, bitmap);
    this._anm = this._anm || {}
};

var Sprite_prototype_update = Sprite.prototype.update
/**更新 */
Sprite.prototype.update = function () {
    //精灵 更新 呼叫(this)
    Sprite_prototype_update.call(this);
    this._updateAnm()
};

/**更新所有动画 */
Sprite.prototype._updateAnm = function () {
    this._anming = false
    for (var name in this._anm) {
        this._anming = true
        for (var i = this.getAnmStep(); i >= 0; i--) {
            //更新动画
            this.anmUpdate(name, this._anm[name])
        }
    }
};

/**
 * 获取动画步数
 * 
 */
Sprite.prototype.getAnmStep = function () {
    return this._anmStep || 0
};

/**
 * 设置动画步数
 */
Sprite.prototype.setAnmStep = function (i) {
    return this._anmStep = i
};


/**
 * 动画播放中
 * 
 */
Sprite.prototype.anmPlaying = function (name, c) {
    if (name) {
        if (this._anm[name]) {
            return true
        }
    } else {
        if (this._anming) {
            return true
        }
    }
    if (c && this.children) {
        var c = c - 1
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i] && this.children[i].anmPlaying && this.children[i].anmPlaying(name)) {
                return true
            }
        }
    }
    return false
}

Sprite.prototype.anmTo = function (obj) { 
    var tl = typeof obj
    if (tl == "number") {
        return { t: obj }
    } else if (tl && tl == "object") {
        return DataManager.deepClone(obj)
    } else {
        return 0
    }
}

/**动画开始 */
Sprite.prototype.anmSt = function (name, list, re) {
    if (!list) {
        //清除动画
        return this.anmClear(name, list)
    }
    //如果不是数组  
    var l = []

    if (Array.isArray(list)) {
        for (var i = 0; i < list.length; i++) {
            var o = this.anmTo(list[i])
            if (o) {
                l.push(o)
            }
        }
    } else {
        var o = this.anmTo(list)
        if (o) {
            l.push(o)
        }
    }

    var oa = l[0]
    if (!oa) {
        return this.anmClear(name, l)
    }
    var anmobj = {
        name: name,
        index: 0,
        list: l,
        value: {},
        re: re
    }
    console.log(anmobj)
    this._anm = this._anm || {}
    this._anm[name] = anmobj
    this._anming = true

    this.__runAnmSt(name)
};

Sprite.prototype.anmRe = function (name, re) {
    this._anm = this._anm || {}
    var oa = this._anm[name]
    if (oa) {
        oa.type = re
    }
}


Sprite.prototype.anmAdd = function (name, list) {
    this._anm = this._anm || {}
    var oa = this._anm[name]
    if (oa && oa.list.length) {
        if (list) {
            var l = []
            if (Array.isArray(list)) {
                for (var i = 0; i < list.length; i++) {
                    var o = this.anmTo(list[i])
                    if (o) {
                        l.push(o)
                    }
                }
            } else {
                var o = this.anmTo(list)
                if (o) {
                    l.push(o)
                }
            }
            this._anm[name] = oa.list.concat(l)
        }
    } else {
        this.anmSt(name, list)
    }
};


/**单个动画更新 */
Sprite.prototype.anmUpdate = function (name) {
    if (this.__runAnmRun(name)) {
        this.__runAnmUpdate(name)
        return
    }
    this.anmEnd(name)
}

Sprite.prototype.anmEnd = function (name) {

    this.__runAnmEnd(name)
}

/**
 * 动画清除
 */
Sprite.prototype.anmClear = function (name, list) {
    if (name) {
        this._anm = this._anm || {}
        this._anm[name] = null
        delete this._anm[name]
    } else {
        this._anm = {}
    }
};


/**
 * 数值初始化
 * 
 * 
 */
Sprite.prototype.__evalini = function (s, set, n, n2, oa, anmobj) {
    if (set) {
        var v = set[n]
        var t = typeof v
        if (t == "function") {
            v(s, set, n, n2, oa, anmobj)
        } else if (t == "object") {
            for (var i in set[n]) {
                s[i] = v[i]
            }
        } else {
            if (n2) {
                if (t == "undefind") {
                    oa.value[n2] = s[n2]
                } else {
                    s[n2] = v
                }
            }
        }
    }
}


/**
 * 
 * 计算数值返回
 * 
 * 
 * 
 */
Sprite.prototype.__evalReturn = function (s, set, n, n2, oa, anmobj) {
    if (set) {
        var v = set[n]
        var t = typeof v
        //为数值时,判断值
        if (t == "number") {
            var z = "__" + n + n2
            oa.value[z] = oa.value[z] || 0
            oa.value[z]++
            return v >= oa.value[z]
            //没有时,永远运行
        } else if (!t) {
            //主设置没有时停止
            if (n2) {
                return true
            } else {
                //单个设置没有时继续
                return false
            }
        } else if (t == "function") {
            return v(s, set, n, n2, oa, anmobj)
        } else if (t == "object") {
            //为对象时,判断值是否符合范围
            if (n2) {
                if (Array.isArray(v)) {
                    var vz = s[n2]
                    var vil = v
                    for (var vi = 0; vi < vil.length; vi + 2) {
                        if (!this.__isEvalValue(vz, vil[vi], vil[vi + 1])) {
                            return false
                        }
                    }
                } else {
                    for (var i in v) {
                        var vz = oa.value[i]
                        var vil = v[i]
                        if (Array.isArray(vil)) {
                            for (var vi = 0; vi < vil.length; vi + 2) {
                                if (!this.__isEvalValue(vz, vil[vi], vil[vi + 1])) {
                                    return false
                                }
                            }
                        }
                    }
                }
            } else {
                //为对象时,判断值是否符合范围
                for (var i in v) {
                    var vz = s[i]
                    var vil = v[i]
                    if (Array.isArray(vil)) {
                        for (var vi = 0; vi < vil.length; vi + 2) {
                            if (!this.__isEvalValue(vz, vil[vi], vil[vi + 1])) {
                                return false
                            }
                        }
                    }
                }
            }
            return true
        } else {
            return true
        }
    }
    return false
}




/**
 * 计算更新
 * 对于分设定 
 * set n 为数值时
 * 增加值
 * 为对象时  
 * 如果是数组 ,进行计算
 * 如果是对象 ,对对象名对应的值进行计算
 * 
 * 否则 赋值
 *  
 * 
 */
Sprite.prototype.evalUpdate = function (s, set, n, n2, oa, anmobj) {
    if (set) {
        var v = set[n]
        var t = typeof v
        //为数值时,判断值
        if (t == "number") {
            if (n2) {
                s[n2] += v
            }
            //没有时,永远运行
        } else if (t == "function") {
            return v(s, set, n, n2, oa, anmobj)
        } else if (v && t == "object") {
            if (n2) {
                if (Array.isArray(v)) {
                    var vz = s[n2]
                    var vil = v
                    for (var vi = 0; vi < vil.length; vi + 2) {
                        vz = this.__setEvalValue(vz, vil[vi + 1], vil[vi])
                    }
                    s[n2] = vz

                } else {
                    for (var i in v) {
                        var vz = oa.value[i]
                        var vil = v[i]
                        if (Array.isArray(vil)) {
                            for (var vi = 0; vi < vil.length; vi + 2) {
                                vz = this.__setEvalValue(vz, vil[vi + 1], vil[vi])
                            }
                            s[n2] = vz
                        } else {
                            s[n2] = vil || vz
                        }
                    }

                }
            } else {
                //为对象时,判断值是否符合范围
                for (var i in v) {
                    var vz = s[i]
                    var vil = v[i]
                    if (Array.isArray(vil)) {
                        for (var vi = 0; vi < vil.length; vi + 2) {
                            vz = this.__setEvalValue(vz, vil[vi + 1], vil[vi])
                        }
                        s[i] = vz
                    } else {
                        s[i] = vil
                    }
                }
            }
        } else {
            if (n2 && t != "undefined") {
                s[n2] = v
            }
        }
    }
}



Sprite.prototype.__runAnmSt = function (name) {
    var name = name
    this._anm = this._anm || {}
    var anmobj = this._anm[name]
    var list = anmobj.list
    var index = anmobj.index
    var oa = list[index]
    var s = this
    if (oa) {
        oa.value = {}
        this.evalini(s, oa, "fr", "", oa, anmobj)
        if (typeof oa.set == "object") {
            for (var i in oa.set) {
                var set = oa.set[i]
                this.__evalini(s, set, "fr", i, oa, anmobj)
            }
        }
    } else {
        this.anmClear(name)
    }
};

Sprite.prototype.__runAnmRun = function (name) {
    var name = name
    this._anm = this._anm || {}
    var anmobj = this._anm[name]
    var list = anmobj.list
    var index = anmobj.index
    var oa = list[index]
    var s = this
    if (oa) {
        return this.__evalReturn(s, oa, "t", "", oa, anmobj)
    }
    return false
}

Sprite.prototype.__runAnmUpdate = function (name) {
    var name = name
    this._anm = this._anm || {}
    var anmobj = this._anm[name]
    var list = anmobj.list
    var index = anmobj.index
    var oa = list[index]
    var s = this
    if (oa) {
        if (this.__evalReturn(s, oa, "d", "", oa, anmobj)
        ) {
            this.__evalUpdate(s, oa, "up", "", oa, anmobj)
            if (typeof oa.set == "object") {
                for (var i in oa.set) {
                    var set = oa.set[i]
                    if (this.__evalReturn(s, set, "d", i, oa, anmobj)) {
                        this.__evalUpdate(s, set, "up", i, oa, anmobj)
                    }
                }
            }
        }
    }
}



/**动画结束 */
Sprite.prototype.__runAnmEnd = function (name) {
    var name = name
    this._anm = this._anm || {}
    var anmobj = this._anm[name]
    var list = anmobj.list
    var index = anmobj.index
    var oa = list[index]
    var s = this
    if (oa) {
        this.__evalini(s, oa, "ed", "", s, oa, anmobj)
        if (typeof oa.set == "object") {
            for (var i in oa.set) {
                var set = oa.set[i]
                this.__evalini(s, set, "ed", i, s, oa, anmobj)
            }
        }
    }
    anmobj.index++
    if (anmobj.re && list.length) {
        anmobj.index = anmobj.index % list.length
    }
    this.__runAnmSt(name)
};









/**
 * 世界到局部xy
 * @param {number} y y
 * @return {number}  
 */
Sprite.prototype.worldToLocalXY = function (x, y, s) {
    var node = s || this;
    return node.worldTransform.applyInverse({ x: x, y: y }, { visible: node.worldVisible });
};


/**
* 是触摸输入自己 
* @param {boolean|number} b 是否不检查位图(每层-1)
* @param {boolean|number} c 是否检查子图(每层-1 ) 
* @param {boolean} up 是否是从上往下判断 
* 
*/
Sprite.prototype.isTouchInputThis = function (b, c, up) {
    var x = TouchInput.x
    var y = TouchInput.y
    var b = b === true ? -1 : b
    var c = c === true ? -1 : c
    this.isTouchThis(x, y, b, c, up)
}


/**
* 是触摸自己
* @param {number} x x坐标
* @param {number} y y坐标
* @param {boolean|number} b 是否不检查位图(每层-1)
* @param {boolean|number} c 是否检查子图(每层-1 ) 
* @param {boolean} up 是否是从上往下判断 
* 
*/
Sprite.prototype.isTouchThis = function (x, y, b, c, up) {
    if (this.visible) {
        var loc = this.worldToLocalXY(x, y)
        var lx = loc.x
        var ly = loc.y
        var lv = loc.visible
        if (lv) {
            if (c) {
                var b2 = b ? b - 1 : 0
                var c2 = c - 1
                var l = this.children.length
                if (up) {
                    for (var i = l - 1; i >= 0; i--) {
                        var s = this.children[i]
                        if (s && s.isTouchThis && s.isTouchThis(x, y, b2, c2, up)) {
                            return true
                        }
                    }
                    if (this.isTouchIn && this.isTouchIn(lx, ly, b)) {
                        return true
                    }
                } else {
                    if (this.isTouchIn && this.isTouchIn(lx, ly, b)) {
                        return true
                    }
                    for (var i = 0; i < l; i++) {
                        var s = this.children[i]
                        if (s && s.isTouchThis && s.isTouchThis(x, y, b2, c2, up)) {
                            return true
                        }
                    }
                }
            }
        }
    }
    return false
}


/**
 * 是在之中 
 * @param {number} x x坐标
 * @param {number} y y坐标
 * @param {boolean} type 不检查图片
 * 
 */
Sprite.prototype.isTouchIn = function (x, y, b) {
    if (this.anchor) {
        var x = x + this.anchor.x * this.width
        var y = y + this.anchor.y * this.height
    }
    return this.isTouchInFrame(x, y, b) && (b || this.isTouchInBitamp(x, y))
}


/**
 * 是在区域中
 * @param {number} x  x
 * @param {number} y  y
 * 
 * 
 */
Sprite.prototype.isTouchInFrame = function (x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};


/**
 * 是在位图上不透明点
 * @param {number} x  x
 * @param {number} y  y
 * 
 */
Sprite.prototype.isTouchInBitamp = function (x, y) {
    if (this._realFrame) {
        var x = x + this._realFrame.x
        var y = y + this._realFrame.y
    }
    if (this.bitmap && this.bitmap.getAlphaPixel(x, y)) {
        return true
        //console.log("bitmap")
    }
    return false
}
