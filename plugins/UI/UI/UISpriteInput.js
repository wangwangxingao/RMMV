
(function () {

    var Sprite_prototype_update = Sprite.prototype.update
    /**更新 */
    Sprite.prototype.update = function () {
        //精灵 更新 呼叫(this)
        Sprite_prototype_update.call(this);
        this.__updateInput()
    };

    Sprite.prototype.__updateInput = function () {

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







    /**
     * 是移动到在精灵上或移动出精灵上 
     * 
     */ 
    Sprite.prototype.TouchInputMoveIn = function () { 
        if (TouchInput.isMoved() || TouchInput.isTriggered()) {
            var movein = this.isTouchInputThis()
            if (this._TouchInputMoveIn != movein) {
                this._TouchInputMoveIn = movein
                if (typeof this.__TouchInputMoveIn == "function") {
                    this.__TouchInputMoveIn(movein)
                }
            }
        }

    }

    /**
     * 是触摸在精灵上 
     * 
     */

    Sprite.prototype.TouchInputisTouchIn = function () {
        if (TouchInput.isTriggered()) {
            var t = this.isTouchInputThis()
            if (this._TouchInputisTouchIn != t) {
                this._TouchInputisTouchIn = t
                if (typeof this.__TouchInputisTouchIn == "function") {
                    this.__TouchInputisTouchIn(t)
                }
            }
        }
    }

    /**
     * 是触摸在精灵上并且按着移动
     * 
     */
    Sprite.prototype.TouchInputisTouchInPressMove = function () {
        if (this._TouchInputisTouchIn) {
            if (TouchInput.isPressMove()) {
                var x = TouchInput.isMoveDeltX()
                var y = TouchInput.isMoveDeltY()
                if (x || y) {
                    this._TouchInputisTouchInPressMove = true
                    if (typeof this.__TouchInputisTouchInPressMove == "function") {
                        this.__TouchInputisTouchInPressMove(x, y)
                    }
                    return
                }
            }
        }
        this._TouchInputisTouchInPressMove = false
    }
 
})();
