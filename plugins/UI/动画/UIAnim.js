var ww = ww || {}

ww.anim = {}


ww.anim.deepClone = function (that) {
    var that = that
    var obj, i;
    if (typeof (that) === "object") {
        if (that === null) {
            obj = null;
        } else if (Array.isArray(that)) { //Object.prototype.toString.call(that) === '[object Array]') { 
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

/**补全运动值 
 *  
 * @param {*} t 时间
 * @param {*} dx 移动值
 * @param {*} fx 开始值
 * @param {*} tx 目标值
 * @param {*} x 默认值
 */
ww.anim.getMoveValue = function (t, dx, fx, tx, x) {
    var fx = fx === undefined ? x : fx
    if (t === undefined) {
        if (dx) {
            if (tx === undefined) {
                var tx = fx + dx
                var t = 0
            } else {
                var t = (tx - fx) / dx
                if (t < 0) {
                    dx = -dx
                    t = -t
                }
            }
        } else {
            var tx = tx === undefined ? x : tx
            var dx = tx - fx
            var t = 0
        }
    } else {
        if (dx === undefined) {
            if (tx === undefined) {
                var tx = fx
                var dx = 0
            } else {
                var dx = (tx - fx) / (t || 1)
            }
        } else {
            if (tx === undefined) {
                var tx = dx * t + fx
            }
        }
    }
    return [t, dx, fx, tx, x]
}

ww.anim.evalIni = function (animGroup, index) {
    if (animGroup.value) {
        animGroup.value[index] = {}
    }
}

/**
 * 数值初始化
 * @param {Sprite} s 精灵
 * @param {string} sn 精灵项目名称
 * @param {{st:{},ed:{},t:number,up:{}}} anim 动画数据对象
 * @param {string} an 动画对象参数名称 
 * @param {{st:{},ed:{},t:number,up:{}}} animData 当前动画数据
 * @param {{name: string,index: number,list: [],re:false}}  animGroup 本名称动画数据组
 */
ww.anim.evalSet = function (s, sn, anim, an, animData, animValue, animGroup) {
    if (anim) {
        var animfun = anim[an]
        var t = typeof animfun
        if (t == "function") {
            animfun(s, sn, anim, an, animData, animValue, animGroup)
        } else if (t == "object") {
            if (sn) {
                ww.anim.evalSet2(s, sn, anim, an, animData, animValue, animGroup)
            } else {
                for (var i in animfun) {
                    ww.anim.evalSet(s, i, animfun, i, animData, animValue, animGroup)
                }
            }
        } else {
            if (sn) {
                if (typeof s[sn] == "function") {
                    animValue[sn] = s[sn](animfun)
                } else if (animfun === undefined) {
                    animValue[sn] = s[sn]
                } else {
                    animValue[sn] = s[sn] = animfun
                }
            }
        }
    }
}
/**
 * 
 * @param {Sprite} s 精灵
 * @param {string} sn 精灵项目名称
 * @param {{st:{},ed:{},t:number,up:{}}} anim 动画数据对象
 * @param {string} an 动画对象参数名称 
 * @param {{st:{},ed:{},t:number,up:{}}} animData 当前动画数据
 * @param {{name: string,index: number,list: [],re:false}}  animGroup 本名称动画数据组
 */
ww.anim.evalSet2 = function (s, sn, anim, an, animData, animValue, animGroup) {
    var animfun = anim[an]  
    if (typeof s[sn] == "function") {
        return s[sn](animfun)
    } else {
        return s[sn] = animfun
    }
}



/**
 * 
 * 计算数值返回
 * @param {Sprite} s 精灵
 * @param {string} sn 精灵项目名称
 * @param {{st:{},ed:{},t:number,up:{}}} anim 动画数据对象
 * @param {string} an 动画对象参数名称 
 * @param {{st:{},ed:{},t:number,up:{}}} animData 当前动画数据
 * @param {{name: string,index: number,list: [],re:false}}  animGroup 本名称动画数据组
 */
ww.anim.evalReturn = function (s, sn, anim, an, animData, animValue, animGroup) {
    if (anim) {
        var animfun = anim[an]
        var t = typeof animfun
        //为数值时,判断值
        if (t == "number") {
            animValue[an] = animValue[an] || 0
            animValue[an]++
            return animfun >= animValue[an] 
            //没有时,永远运行
        } else if (t == "function") {
            return animfun(s, sn, anim, an, animData, animValue, animGroup)
        } else if (animfun && t == "object") {
            if (sn) {
                return ww.anim.evalSet2(s, sn, anim, an, animData, animValue, animGroup)
            } else {
                var re = false
                //为对象时,判断值是否符合范围 
                for (var i in animfun) {
                    re = ww.anim.evalReturn(s, i, animfun, i, animData, animValue, animGroup) || re
                }
                return re
            }
        } else {
            return animfun !== false
        }
    }
    return false
}
/**
 * 计算数值返回2
 * @param {Sprite} s 精灵
 * @param {string} sn 精灵项目名称
 * @param {{st:{},ed:{},t:number,up:{}}} anim 动画数据对象
 * @param {string} an 动画对象参数名称 
 * @param {{st:{},ed:{},t:number,up:{}}} animData 当前动画数据
 * @param {{name: string,index: number,list: [],re:false}}  animGroup 本名称动画数据组
 */
ww.anim.evalReturn2 = function (s, sn, anim, an, animData, animValue, animGroup) {
    if (anim) {
        var animfun = anim[an]
        var t = typeof animfun
        //为数值时,判断值
        if (t == "number") {
            animValue[an] = animValue[an] || 0
            animValue[an]++
            if (animfun <= animValue[an]) {
                animValue[an] = 0
                return true
            } else {
                return false
            }
            //没有时,永远运行
        } else if (t == "function") {
            return animfun(s, sn, anim, an, animData, animValue, animGroup)
        } else if (animfun && t == "object") {
            if (sn) {
                return ww.anim.evalSet2(s, sn, anim, an, animData, animValue, animGroup)
            } else {
                var re = false
                //为对象时,判断值是否符合范围 
                for (var i in animfun) {
                    re = ww.anim.evalReturn2(s, i, animfun, i, animData, animValue, animGroup) || re
                }
                return re
            }
        } else {
            return animfun !== false
        }
    }
    return false
}



/**
 * 计算更新
 * 对于分设定 
 * anim n 为数值时
 * 增加值  
 * @param {Sprite} s 精灵
 * @param {string} sn 精灵项目名称
 * @param {{st:{},ed:{},t:number,up:{}}} anim 动画数据对象
 * @param {string} an 动画对象参数名称 
 * @param {{st:{},ed:{},t:number,up:{}}} animData 当前动画数据
 * @param {{name: string,index: number,list: [],re:false}}  animGroup 本名称动画数据组
 * 
 */
ww.anim.evalUpdate = function (s, sn, anim, an, animData, animValue, animGroup) {
    if (anim) {
        var animfun = anim[an]
        var t = typeof animfun
        if (t == "function") {
            animfun(s, sn, anim, an, animData, animValue, animGroup)
        } else if (t == "object") {
            if (sn) {
                ww.anim.evalSet2(s, sn, anim, an, animData, animValue, animGroup)
            } else {
                for (var i in animfun) {
                    this.evalUpdate(s, i, animfun, i, animData, animValue, animGroup)
                }
            }
        } else if (sn) {
            if (typeof s[sn] == "function") {
                s[sn](animfun)
            } else if (t == "number") {
                s[sn] += animfun
            } else {
                s[sn] = animfun
            }
        }
    }
}


/**
 * 转化为anim对象
 * @param {*} obj 
 */
ww.anim.animTo = function (list) {
    var l = []
    if (Array.isArray(list)) {
        if (list._isAnim) {
            return list
        }
        for (var i = 0; i < list.length; i++) {
            var animData = ww.anim.animToObject(list[i])
            if (animData) {
                l.push(animData)
            }
        }
    } else {
        var animData = ww.anim.animToObject(list)
        if (animData) {
            l.push(animData)
        }
    }
    l._isAnim = true
    return l
}

/**
 * 转化为anim对象
 * @param {*} obj 
 */
ww.anim.animToObject = function (obj) {
    var tl = typeof obj
    if (tl == "number") {
        return {
            t: obj
        }
    } else if (tl && tl == "object") {
        return obj//ww.anim.deepClone(obj)
    } else {
        return 0
    }
}



ww.anim.Sprite_prototype_initialize = Sprite.prototype.initialize
/**初始化 */
Sprite.prototype.initialize = function (bitmap) {
    this._anim = this._anim || {}
    //精灵 初始化 呼叫(this)
    ww.anim.Sprite_prototype_initialize.call(this, bitmap);
};

ww.anim.Sprite_prototype_update = Sprite.prototype.update
/**更新 */
Sprite.prototype.update = function () {
    //精灵 更新 呼叫(this)
    ww.anim.Sprite_prototype_update.call(this);
    this._updateAnim()
};

/**更新所有动画 */
Sprite.prototype._updateAnim = function () {
    this._animing = false
    if (this._anim) {
        for (var name in this._anim) {
            this._animing = true
            //for (var i = this.getAnimStep(); i >= 0; i--) {
            //更新动画
            this.animUpdate(name, this._anim[name])
            //}
        }
        if (!this._animing) {
            this._anim = null
        }
    }
};

/**
 * 动画播放中
 * 
 */
Sprite.prototype.animPlaying = function (name, c) {
    if (name) {
        if (this._anim && this._anim[name]) {
            return true
        }
    } else {
        if (this._animing) {
            return true
        }
    }
    if (c && this.children) {
        var c = c - 1
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i] && this.children[i].animPlaying && this.children[i].animPlaying(name)) {
                return true
            }
        }
    }
    return false
}

Sprite.prototype.anim = function (name) {
    if (this._anim && this._anim[name]) {
        return this._anim[name]
    }
    return false
}

/**动画开始 */
Sprite.prototype.animSt = function (name, list, re) {
    if (!list) {
        //清除动画
        return this.animClear(name, list)
    }
    //如果不是数组  
    var l = ww.anim.animTo(list)
    var animData = l[0]
    if (!animData) {
        return this.animClear(name, l)
    }
    var animGroup = {
        name: name,
        index: 0,
        data: l,
        value: [],
        re: re
    }
    //console.log(animGroup)
    this._anim = this._anim || {}
    this._anim[name] = animGroup
    this._animing = true
    this.__runAnimSt(name)
};

Sprite.prototype.animRe = function (name, re) {
    this._anim = this._anim || {}
    var animGroup = this._anim[name]
    if (animGroup) {
        animGroup.re = re
    }
}


Sprite.prototype.animAdd = function (name, list) {
    this._anim = this._anim || {}
    var animGroup = this._anim[name]
    if (animGroup && animGroup.data.length) {
        if (list) {
            var l = ww.anim.animTo(list)
            animGroup.data = animGroup.data.concat(l)
        }
    } else {
        this.animSt(name, list)
    }
};


/**单个动画更新 */
Sprite.prototype.animUpdate = function (name) {
    if (this.__runAnimRun(name)) {
        this.__runAnimUpdate(name)
        return
    }
    this.animNext(name)
}

Sprite.prototype.animNext = function (name) {
    this.__runAnimNext(name)
}

/**
 * 动画直到结束
 * @param {*} name 
 */
Sprite.prototype.animEnd = function (name) {
    if (name) {
        if (this._anim) {
            var animGroup = this._anim[name]
            if (animGroup) {
                animGroup.re = false
                while (this.anim(name)) {
                    this.__runAnimNext(name)
                }
            }
        }
    }
}




/**
 * 动画名称
 * @param {string|false} name 名称 没有时全部清除
 */
Sprite.prototype.animClear = function (name) {
    if (name) {
        if (this._anim) {
            this._anim[name] = null
            delete this._anim[name]

            for (var i in this._anim) {
                return
            }
            this._anim = null
        }
    } else {
        this._anim = null
    }
};

/**
 * 运行动画开始
 * @param {*} name 
 */
Sprite.prototype.__runAnimSt = function (name) {
    if (this._anim) {
        var animGroup = this._anim[name]
        if (animGroup) {
            var animData = animGroup.data[animGroup.index]
            if (animData) {
                ww.anim.evalIni(animGroup, animGroup.index)
                var animValue = animGroup.value[animGroup.index]
                ww.anim.evalSet(this, "", animData, "st", animData, animValue, animGroup)
                if (typeof animData.anim == "object") {
                    for (var i in animData.anim) {
                        var anim = animData.anim[i]
                        ww.anim.evalSet(this, i, anim, "st", animData, animValue, animGroup)
                    }
                }
                return
            }
        }
    }
    this.animClear(name)
};

/**
 * 运行动画
 * @param {*} name 
 */
Sprite.prototype.__runAnimRun = function (name) {
    var name = name
    if (this._anim) {
        var animGroup = this._anim[name]
        if (animGroup) {
            var animData = animGroup.data[animGroup.index]
            var animValue = animGroup.value[animGroup.index]
            return ww.anim.evalReturn(this, '', animData, "t", animData, animValue, animGroup)
        }
    }
    return false
}

/**
 * 运行动画更新
 * @param {*} name 
 */
Sprite.prototype.__runAnimUpdate = function (name) {
    var name = name
    if (this._anim) {
        var animGroup = this._anim[name]
        if (animGroup) {
            var animData = animGroup.data[animGroup.index]
            var animValue = animGroup.value[animGroup.index]
            if (ww.anim.evalReturn2(this, "", animData, "d", animData, animValue, animGroup)) {
                ww.anim.evalUpdate(this, "", animData, "up", animData, animValue, animGroup)
                if (typeof animData.anim == "object") {
                    for (var i in animData.anim) {
                        var anim = animData.anim[i]
                        if (ww.anim.evalReturn2(this, i, anim, "d", animData, animValue, animGroup)) {
                            ww.anim.evalUpdate(this, i, anim, "up", animData, animValue, animGroup)
                        }
                    }
                }
            }
        }
    }
}




/**
 * 运行动画结束
 * @param {*} name 
 */
Sprite.prototype.__runAnimNext = function (name) {
    if (this._anim) {
        var animGroup = this._anim[name]
        if (animGroup) {
            var list = animGroup.data
            var animData = list[animGroup.index]
            if (animData) {
                ww.anim.evalIni(animGroup, animGroup.index)
                var animValue = animGroup.value[animGroup.index]
                ww.anim.evalSet(this, "", animData, "ed", animData, animValue, animGroup)
                if (typeof animData.anim == "object") {
                    for (var i in animData.anim) {
                        var anim = animData.anim[i]
                        ww.anim.evalSet(s, i, anim, "ed", animData, animValue, animGroup)
                    }
                }
            }
            animGroup.index++
            if (animGroup.re && list.length) {
                animGroup.index = animGroup.index % list.length
            }
            this.__runAnimSt(name)
        }
    };
}