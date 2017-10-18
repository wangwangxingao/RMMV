//=============================================================================
// EventTouch.js
//=============================================================================
/*:
 * @plugindesc EventTouch,事件点击触摸
 * @author wangwang
 *
 *
 * @help
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
    //游戏人物 更新 呼叫(this)
    Game_Character.prototype.update.call(this);
    //检查事件触发自动()
    this.checkEventTriggerAuto();
    //更新并行()
    this.updateParallel();

    this.updateTouch()
};


Game_Event.prototype.setupPage = function() {
    this._label = {}
        //如果(页索引 >= 0)
    if (this._pageIndex >= 0) {
        //安装页安装()
        this.setupPageSettings();
        this._label = this.getLabel()
    } else {
        this.clearPageSettings();
    }

    this.refreshBushDepth();
    //清除开始中标志()
    this.clearStartingFlag();
    //检查事件触发自动()
    this.checkEventTriggerAuto();
};

Game_Event.prototype.getLabel = function() {
    var label = {}
    var list = this.list()
    for (var i = 0; i < list.length; i++) {
        //命令 = 列表[i]
        var command = list[i];
        //如果 (命令 编码 === 118 并且 命令 参数[0] == 标签名)
        if (command.code === 118) {
            label[command.parameters[0]] = i
        }
    }
    return label
}

/**更新*/
Game_Event.prototype.updateTouch = function() {
    if (this._interpreter) {} else {
        if (this._trigger === 0) {
            if (this._istouch == this._lasttouch) {} else {
                if (this._istouch == 2) {
                    if (this._label["touch"] >= 0) {
                        this.start()
                    }
                } else if (this._istouch == 1) {
                    if (this._lasttouch == 0) {
                        if (this._label["movein"] >= 0) {
                            this.start()
                        }
                    }
                } else {
                    if (this._lasttouch) {
                        if (this._label["moveout"] >= 0) {
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
        if (e) {
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


TouchInput._onMouseMove = function(event) {
    //画布x
    var x = Graphics.pageToCanvasX(event.pageX);
    //画布y
    var y = Graphics.pageToCanvasY(event.pageY);
    //当移动(x,y)
    this._onMove(x, y);
};

Tilemap.prototype.isTouch = function(x, y, type, tri) {
    Sprite.prototype.isTouch.call(this, x, y, type, tri)
}


Tilemap.prototype.update = function() {
    var tri = TouchInput.isTriggered() ? 2 : TouchInput.isMoved() ? 1 : 0
    if (tri) {
        var x = Sprite.spriteToLocalX(this.parent, TouchInput.x)
        var y = Sprite.spriteToLocalY(this.parent, TouchInput.y)
        this.isTouch(x, y, 1, tri)
    }

    this.animationCount++;
    this.animationFrame = Math.floor(this.animationCount / 30);
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
    for (var i = 0; i < this.bitmaps.length; i++) {
        if (this.bitmaps[i]) {
            this.bitmaps[i].touch();
        }
    }
};




Sprite_Character.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this.updateBitmap();
    this.updateFrame();
    this.updatePosition();
    this.updateAnimation();
    this.updateBalloon();
    this.updateOther();
    this.updateCharacter()
};

Sprite_Character.prototype.updateCharacter = function() {
    if (this._character) {
        this._character._istouch = this._istouch
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