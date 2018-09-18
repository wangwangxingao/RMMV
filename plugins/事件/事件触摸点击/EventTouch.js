//=============================================================================
// EventTouch.js
//=============================================================================
/*:
 * @plugindesc 
 * EventTouch,事件点击触摸, 
 * @author wangwang
 *
 * @param  EventTouch 
 * @desc 插件 事件点击触摸 ,作者:汪汪
 * @default  汪汪,TouchEx
 * 
 * 
 * @help
 *  
 * 
 * 
 * 设置方法
 * 事件中使用插件方法: switch 
 * 使用标签来判断执行,
 * 使用中断事件中止执行
 * 
 *  
 *  
 */






/**更新*/
Game_Event.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    this.checkEventTriggerAuto();
    this.updateParallel();

};


Game_Event.prototype.setupPage = function() {
    this._label = null //
    if (this._pageIndex >= 0) {
        this.setupPageSettings();
        this._label = this.getLabel() ///
    } else {
        this.clearPageSettings();
    }

    this.refreshBushDepth();
    this.clearStartingFlag();
    this.checkEventTriggerAuto();
};

Game_Event.prototype.getLabel = function() {
    var label = null
    var list = this.list()
    for (var i = 0; i < list.length; i++) {
        var command = list[i];
        if (command.code === 118) {
            label = label || {}
            label[command.parameters[0]] = i
        }
    }
    return label
}

/**更新*/
Game_Event.prototype.updateTouch = function() {
    if (this._interpreter) {} else {
        if (this._label && this._trigger === 0) {
            if (this._istouch == this._lasttouch) {} else {
                if (this._istouch == 2) {
                    if ("touch" in this._label) {
                        this.start()
                    }
                } else if (this._istouch == 1) {
                    if (this._lasttouch == 0) {
                        if ("movein" in this._label) {
                            this.start()
                        }
                    }
                } else {
                    if (this._lasttouch) {
                        if ("moveout" in this._label) {
                            this.start()
                        }
                    }
                }
                this._lasttouch = this._istouch
            }
        }
    }
};



Game_Interpreter.prototype.jumpTolabel = function(labelName, label) {

    var labelName = labelName || "";
    if (labelName in label) {
        this.jumpTo(label[labelName] || 0);
        return true;
    }
    return false;
};


Game_Interpreter.prototype.thisEvent = function(param) {
    return $gameMap.event(param > 0 ? param : this._eventId);
};


Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // to be overridden by plugins
    //通过插件来覆盖 
    if (command == "switch") {
        var e = this.thisEvent()
        if (e && e._label) {
            if (e._istouch == 1) {
                this.jumpTolabel("movein", e._label)
            } else if (e._istouch == 2) {
                this.jumpTolabel("touch", e._label)
            } else if (e._istouch == 0) {
                this.jumpTolabel("moveout", e._label)
            }
        }
    }
};





Sprite_Character.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this.updateTouch()
    this.updateBitmap();
    this.updateFrame();
    this.updatePosition();
    this.updateAnimation();
    this.updateBalloon();
    this.updateOther();
};

Sprite_Character.prototype.updateTouch = function() {
    if (this._character) {
        if (this._character._label) {
            var tri = TouchInput.isTriggered() ? 2 : TouchInput.isMoved() ? 1 : 0
            if (tri) {
                var x = Sprite.spriteToLocalX(this.parent, TouchInput.x)
                var y = Sprite.spriteToLocalY(this.parent, TouchInput.y)
                this.isTouch(x, y, 1, tri)
                this._character._istouch = this._istouch
                this._character.updateTouch()
            }
        }

    }
}


/**画布到局部x 
 * @param {number} x x
 * @return {number}  
 */
Sprite.spriteToLocalX = function(sprite, x) {
    var node = sprite;
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
Sprite.spriteToLocalY = function(sprite, y) {
    var node = sprite;
    while (node) {
        y -= node.y;
        node = node.parent;
    }
    return y;
};

/**
 * 父类的x 
 * 父类的y
 */
Sprite.prototype.isTouch = function(x, y, type, tri) {
    this._istouch = 0
    if (this.visible) {
        var x = x - this.x
        var y = y - this.y
        for (var i = 0; i < this.children.length; i++) {
            var s = this.children[i]
            if (s.isTouch && s.isTouch(x, y, type, tri)) {
                this._istouch = tri
            }
        }
        if (!this._istouch && this.isTouchBitamp && this.isTouchBitamp(x, y, type)) {
            this._istouch = tri
        }
    }
    return this._istouch
}



Sprite.prototype.isTouchBitamp = function(x, y, type) {
    var a = this.rotation
    if (a) {
        if (a == 1.5707963267948966) {
            var x = y
            var y = -x
        } else if (a == 3.141592653589793) {
            var x = -x
            var y = -y
        } else if (a == 4.71238898038469) {
            var x = -y
            var y = x
        } else if (a == 6.283185307179586) {
            var x = x
            var y = y
        } else {
            r = Math.sqrt(x * x + y * y)
            var a = Math.atan2(y, x) - a
            var x = r * Math.cos(a)
            var y = r * Math.sin(a)
        }
    }
    if (this.anchor) {
        var x = x + this.anchor.x * this.width
        var y = y + this.anchor.y * this.height
    }
    //console.log(x2, y2)
    if (this.isTouchInFrame(x, y)) {
        return type || this.isTouchInBitamp(x, y)
    } else {
        return false
    }
}


Sprite.prototype.isTouchInFrame = function(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};

Sprite.prototype.isTouchInBitamp = function(x, y) {
    if (this._frame) {
        var x = x + this._frame.x
        var y = y + this._frame.y
    }
    if (this.bitmap && this.bitmap.getAlphaPixel(x, y)) {
        return true
            //console.log("bitmap")
    }
    return false
}