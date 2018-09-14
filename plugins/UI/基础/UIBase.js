
var Sprite_prototype_initialize = Sprite.prototype.initialize
/**初始化 */
Sprite.prototype.initialize = function (bitmap) {
    //精灵 初始化 呼叫(this)
    Sprite_prototype_initialize.call(this, bitmap);
    this._anm = {}
};

var Sprite_prototype_update = Sprite.prototype.update
/**更新 */
Sprite.prototype.update = function () {
    //精灵 更新 呼叫(this)
    Sprite_prototype_update.call(this);
    this.updateAnm()
};

/**更新所有动画 */
Sprite.prototype.updateAnm = function () {
    this._anming = false
    for (var name in this._anm) {
        this._anming = true
        for (var i = this.getAnmStep(); i >= 0; i--) {

            this.anmUpdate(name, this._anm[name])
        }
    }
};

Sprite.prototype.getAnmStep = function () {
    return this._anmStep || 0
};

Sprite.prototype.setAnmStep = function (i) {
    return this._anmStep = i
};

/**动画播放中 */
Sprite.prototype.anmPlaying = function (name) {
    if (name) {
        return this._anm[name]
    } else {
        return this._anming
    }
}



Sprite.prototype.anmPlaying = function (name) {
    if (name) {
        if (this._anm[name]) {
            return true
        }
    } else {
        if (this._anming) {
            return true
        }
    }
    if (this.children) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i] && this.children[i].anmPlaying && this.children[i].anmPlaying(name)) {
                return true
            }
        }
    }
    return false
}




/**动画开始 */
Sprite.prototype.anmSt = function (name, list) {
    if (!list) { return this.anmClear(name, list) }
    if (!Array.isArray(list)) {
        var list = [list]
        var oa = list
    }
    var oa = list[0]
    if (!oa) { return this.anmClear(name, list) }
    if (oa.st) {
        oa.st(this, oa, name, list)
    }
    if (oa.ste) {
        eval(oa.ste)
    }
    if (oa.set) {
        for (var n in oa.set) {
            var set = oa.set[n]
            if ("fr" in set) {
                this[n] = set.fr
            } else {
                set.fr = this[n]
            }
        }
    }
    this._anm[name] = list
    this._anming = true
};



Sprite.prototype.anmAdd = function (name, list) {
    var oa = this._anm[name]

    if (oa && oa.length) {
        if (list) {
            if (!Array.isArray(list)) {
                var list = [list]
            }
            this._anm[name] = oa.concat(list)
        }
    } else {
        this.anmSt(name, list)
    }
};


/**单个动画更新 */
Sprite.prototype.anmUpdate = function (name, list) {
    if (list) {
        var oa = list[0]
        if (oa) {
            if (oa.t) {
                if (oa.set) {
                    for (var n in oa.set) {
                        var set = oa.set[n]
                        if (set.d) {
                            this[n] += set.d
                        }
                        if (set.e) {
                            this[n] = eval(set.e)
                        }
                    }
                }
                if (oa.up) {
                    oa.up(this, oa, name, list)
                }
                if (oa.upe) {
                    eval(oa.upe)
                }
                oa.t -= 1
                return
            }
        }
    }
    this.anmEnd(name, list)
}


/**动画结束 */
Sprite.prototype.anmEnd = function (name, list) {
    if (list) {
        var oa = list.shift()
        if (oa) {
            if (oa.end) {
                oa.end(this, oa, name, list)
            }
            if (oa.ende) {
                eval(oa.ende)
            }
        }
        var oa = list[0]
        if (!oa) { return this.anmClear(name, list) }
        if (oa.st) {
            oa.st(this, oa, name, list)
        }
        if (oa.ste) {
            eval(oa.ste)
        }
        if (oa.set) {
            for (var n in oa.set) {
                var set = oa.set[n]
                if ("fr" in set) {
                    this[n] = set.fr
                } else {
                    set.fr = this[n]
                }
            }
        }
    } else {
        this.anmClear(name, list)
    }
};


Sprite.prototype.anmClear = function (name, list) {
    if (name) {
        this._anm[name] = null
        delete this._anm[name]
    } else {
        this._anm = {}
    }
};






/**画布到局部x 
* @param {number} x x
* @return {number}  
*/
Sprite.prototype.spriteToLocalX = function (x, sprite) {
    var node = sprite || this;
    while (node) {
        x -= node.x;
        node = node.parent;
    }
    return x;
};
/**画布到局部y
* @param {number} y y
* @return {number}  
*/
Sprite.prototype.priteToLocalY = function (y, sprite) {
    var node = sprite || this;
    while (node) {
        y -= node.y;
        node = node.parent;
    }
    return y;
};




Sprite.prototype.worldToLocalXY = function (x, y, sprite) {
    var node = sprite || this;
    return node.worldTransform.applyInverse({ x: x, y: y }, { visible: node.worldVisible });
};



/**
* 是触摸自己
* @param {number} x x坐标
* @param {number} y y坐标
* @param {boolean} type 是否不检查位图(true 为不检查 )
* @param {bolean}c 是否检查子图(true 为 检查 )
* 
* 
*/
Sprite.prototype.isTouchThis = function (x, y, type, c) {
    if (this.visible) {
        var loc = this.worldToLocalXY(x,y)
        var lx = loc.x 
        var ly = loc.y
        var lv = loc.visible 
      
        if(lv){
            if (c) {
                for (var i = 0; i < this.children.length; i++) {
                    var s = this.children[i]
                    if (s && s.isTouchThis && s.isTouchThis(x, y, type,c)) {
                        return true
                    }
                }
            } 
 
            if (this.isTouchIn && this.isTouchIn(lx, ly, type)) {
                return true
            }
        } 
    }
    return false
}



/**是在之中 
* @param {boolean} type 不检查图片
* 
*/
Sprite.prototype.isTouchIn = function (x, y, type) {
    if (this.anchor) {
        var x = x + this.anchor.x * this.width
        var y = y + this.anchor.y * this.height
    }
    if (this.isTouchInFrame(x, y, type)) {
        return type || this.isTouchInBitamp(x, y)
    } else {
        return false
    }
}


/**是在区域中 */
Sprite.prototype.isTouchInFrame = function (x, y, type) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};


/**是在位图上不透明点 */
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


