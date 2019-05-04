

function Sprite_gdt() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Sprite_gdt.prototype = Object.create(Sprite.prototype);
//设置创造者
Sprite_gdt.prototype.constructor = Sprite_gdt;
//初始化
Sprite_gdt.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);

    this._touch = 0

    this._gbtb = ""
    this.bitmap = ImageManager.loadPicture(this._gbtb)

    this._hk = new Sprite()
    this._hkb = ""
    this._hk.bitmap = ImageManager.loadPicture(this._hkb)
    this.addChild(this._hk)
};



Sprite_gdt.prototype.setgbt = function (name) {
    var name = name || ""
    if (name != this._gbtb) {
        this._gbtb = name
        this.bitmap = ImageManager.loadPicture(this._gbtb)
    }
}


Sprite_gdt.prototype.sethk = function (name) {
    var name = name || ""
    if (name != this._hkb) {
        this._hkb = name
        this.bitmap = ImageManager.loadPicture(this._hkb)
    }
}

Sprite_gdt.prototype.getgbtH = function () {
    return this.bitmap.height
}

/**获取滑块图片高 */
Sprite_gdt.prototype.gethkH = function () {
    return this._hk.bitmap.height
}


/**设置全部高 */
Sprite_gdt.prototype.setAllHeight = function (v) {
    this._allh = v || 0
};

/**设置页面位置 */
Sprite_gdt.prototype.setPageY = function (v) {
    this._pagey = v || 0
};


/**设置页面高 */
Sprite_gdt.prototype.setPageHeight = function (v) {
    this._pageh = v || 0
};

/**页面比例 */
Sprite_gdt.prototype.pageScale = function () {
    if (this._allh) {
        return this._pageh / this._allh
    }
    return 0
};


/**滑块位置y */
Sprite_gdt.prototype.hkY = function () {
    return this._pagey * this.pageScale()
};

/**滑块比例 */
Sprite_gdt.prototype.hkScale = function () {
    var hkh = this.gethkH()
    var gdth = this.getgbtH()
    var s = gdth * this.pageScale()
    return s > 0 ? hkh / s : 0
};



/**
 * 更新滑块
 */
Sprite_gdt.prototype.updateHk = function () {
    if (this._hkb) {
        this._hk.scale.y = this.hkScale()
        this._hk.y = this.hkY()
    }
};


Sprite_gdt.prototype.updateTouch = function () {
    if (this.visible) {
        if (TouchInput.isPressed()) {
            if (TouchInput.isTriggered()) {
                if (this._hk.isTouchInputThis()) {
                    this._touch = "hk"
                    this._touchX = TouchInput.x
                    this._touchY = TouchInput.y
                } else {
                    if (this.isTouchInputThis()) {
                        var loc = this.worldToLocalXY(x, y)
                        this.onTo(loc.x, loc.y)
                    }
                    this._touch = 0
                }
            } else if (TouchInput.isMoved()) {
                if (this._touch == "hk") {
                    this.onMove(TouchInput.x - this._touchX, TouchInput.y - this._touchY)
                }
            }
        } else {
            this._touch = 0
        }
    }
};



Sprite_gdt.prototype.onTo = function (x, y) {
    if (this._allh) {
        var my = y || 0
        var ry = my / this.getgbtH() //this.pageScale() 
        if (this._onTo) {
            this._onTo(x, ry)
        }
    }
}



Sprite_gdt.prototype.onMove = function (x, y) {
    if (this._allh) {
        var my = y || 0
        var ry = my / this.getgbtH() //this.pageScale() 
        if (this._onMove) {
            this._onMove(x, ry)
        }
    }
}








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
* @param {boolean|number} b 是否检查位图(每层-1)
* @param {boolean|number} c 是否检查子图(每层-1 ) 
* @param {boolean} up 是否是从上往下判断 
* 
*/
Sprite.prototype.isTouchInputThis = function (b, c, up) {
    var x = TouchInput.x
    var y = TouchInput.y
    var b = b === true ? -1 : b
    var c = c === true ? -1 : c
    return this.isTouchThis(x, y, b, c, up)
}


/**
* 是触摸自己
* @param {number} x x坐标
* @param {number} y y坐标
* @param {boolean|number} b 是否检查位图(每层-1)
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
            var b2 = b ? b - 1 : 0
            var c2 = c - 1
            var l = this.children.length
            if (up) {
                if (c) {
                    for (var i = l - 1; i >= 0; i--) {
                        var s = this.children[i]
                        if (s && s.isTouchThis && s.isTouchThis(x, y, b2, c2, up)) {
                            return true
                        }
                    }
                }
                if (this.isTouchIn && this.isTouchIn(lx, ly, b)) {
                    return true
                }
            } else {
                if (this.isTouchIn && this.isTouchIn(lx, ly, b)) {
                    return true
                }
                if (c) {
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
 * @param {boolean} b 检查图片
 * 
 */
Sprite.prototype.isTouchIn = function (x, y, b) {
    if (this.anchor) {
        var x = x + this.anchor.x * this.width
        var y = y + this.anchor.y * this.height
    }
    return this.isTouchInFrame(x, y, b) && (!b || this.isTouchInBitamp(x, y))
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





