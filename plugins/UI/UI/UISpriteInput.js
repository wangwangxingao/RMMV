(function () {


    /**
     * 世界到局部xy
     * @param {number} y y
     * @return {number}  
     */
    Sprite.prototype.worldToLocalXY = function (x, y, s) {
        var node = s || this;
        return node.worldTransform.applyInverse({
            x: x,
            y: y
        }, {
            visible: node.worldVisible
        });
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
     * 快速判断鼠标是否触摸到自己
     * @param {number} x x坐标
     * @param {number} y y坐标
     * @param {boolean|number} b 是否检查位图 
     */
    Sprite.prototype.isTouchInputThisFast = function (b) {
        return this.isTouchThisFast(TouchInput.x, TouchInput.y, b)
    }

    /**
     * 快速判断是否触摸到自己
     * @param {number} x x坐标
     * @param {number} y y坐标
     * @param {boolean|number} b 是否检查位图 
     * 
     * 
     */
    Sprite.prototype.isTouchThisFast = function (x, y, b) {
        if (this.visible) {
            var loc = this.worldToLocalXY(x, y)
            var lx = loc.x
            var ly = loc.y
            var lv = loc.visible
            if (lv) {
                if (this.isTouchIn && this.isTouchIn(lx, ly, b)) {
                    return true
                }
            }
            return false
        }
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
                var c2 = c ? c - 1 : 0
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







    /**
     * 是移动到在精灵上或移动出精灵上 
     * 
     */
    Sprite.prototype.updateTouchInputMoveIn = function (b, c, up) {
        if (TouchInput.isMoved() || TouchInput.isTriggered()) {
            var movein = this.isTouchInputThis(b, c, up)
            if (this._TouchInputMoveIn != movein) {
                this._TouchInputMoveIn = movein ? {
                    x: TouchInput.x,
                    y: TouchInput.y
                } : 0
                this._TouchInputisTouchInPressMove = false
                this.onTouchInputMoveIn(this._TouchInputMoveIn)
            }
        }
    }

    /**
     * @param {{x:number,y:number}} touchIn 触摸在其中的{x,y}
     *  
     */
    Sprite.prototype.onTouchInputMoveIn = function (touchIn) {

    }

    /**
     * 是触摸在精灵上 
     * 
     */

    Sprite.prototype.updateTouchInputTouchIn = function (b, c, up) {
        if (TouchInput.isTriggered()) {
            var t = this.isTouchInputThis(b, c, up)
            if (this._TouchInputTouchIn != t) {
                this._TouchInputTouchIn = t ? {
                    x: TouchInput.x,
                    y: TouchInput.y
                } : 0
                this.onTouchInputTouchIn(this._TouchInputTouchIn)
            }
        }
    }
    /**
     * 当触摸在其中
     * @param {{x:number,y:number}} touchIn 触摸在其中的{x,y}
     */
    Sprite.prototype.onTouchInputTouchIn = function (touchIn) {

    }


    /**
     * 更新触摸在精灵上并且按着移动
     * 
     */
    Sprite.prototype.updateTouchInputInAndMove = function () {
        if (this._TouchInputTouchIn) {
            if (TouchInput.isPressed()) {
                if (TouchInput.isMoved()) {
                    this.onTouchInputInAndMove(this._TouchInputTouchIn, TouchInput.x, TouchInput.y)
                }
            } else {
                var m = this._TouchInputTouchInAndMove
                var i = this._TouchInputTouchIn

                this._TouchInputTouchInAndMove = false
                this._TouchInputTouchIn = false

                this.onTouchMoveInUp(m, i)

            }
        }
    }

    /**
     * 当触摸在之中然后移动
     * @param {{x:number,y:number}} touchIn 触摸在其中的{x,y}
     */
    Sprite.prototype.onTouchInputInAndMove = function (touchIn, x, y) {
        this._TouchInputTouchInAndMove = true
    }
    /**
     * 当触摸在其中并抬起
     * @param {*} moveed 是否移动
     * @param {{x:number,y:number}} touchIn 触摸在其中的{x,y}
     */
    Sprite.prototype.onTouchInputMoveInUp = function (moveed, touchIn) {

    }

})();