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
 * 
 * 支持标签 : 
 * 
 * 没有按着的时候鼠标移动到(在图片范围内)
 * ["touchMoveIn"] 
 * 没有按着的时候鼠标移动出(在图片范围内)
 * ["touchMoveOut"]
 * 鼠标按下瞬间(在图片范围内)
 * ["touchClickDown"]
 * 鼠标抬起瞬间(按下时在图片范围内)
 * ["touchClickUp"]
 * 鼠标按下时移动(按下时在图片范围内)
 * ["touchClickMove"]
 * 鼠标长按一段时间后(按下时在图片范围内(不判断是否移动))
 * ["touchClickLong"] 
 * 鼠标按下时移动,移动到(按下时在图片范围内)
 * ["touchClickMoveIn"]
 * 鼠标按下时移动,移动出(按下时在图片范围内)
 * ["touchClickMoveOut"]
 * 
 * 人物与事件距离,
 * 当y 为-1 时,  xy距离之和 <= x 
 * 当y 为-2 时,  直线距离 <= x,
 * 当y>=0 时 ,   x距离 <= x ,y距离<=y 
 * ["nearIn",x,y]
 * ["nearOut",x,y]
 * 
 * 当满足条件时会运行事件
 *  
 * 为什么加括号和双引号,额,因为好取值...
 * 
 * 
 * 
 * 跳转方法: switch e 
 * 跳转到触发事件的那个标签,e代表是事件
 * 
 *  
 * 设置图片公共事件: pce pid cid
 * pid 为 图片的id号, cid为公共事件id号
 * 需要在图片显示后使用 
 * 跳转方法: switch p id 
 * 跳转到触发图片的那个标签,id为图片的id ,需要配合事件绑定公共事件使用..
 * 
 *  
 * 
 */




/**更新 */
Scene_Map.prototype.update = function() {
    //更新主要增加()
    this.updateMainMultiply();
    //如果( 是场景改变确定())
    if (this.isSceneChangeOk()) {
        //更新场景()
        this.updateScene();
        //否则 如果( 场景管理器 是下一个场景(场景战斗))
    } else if (SceneManager.isNextScene(Scene_Battle)) {
        //更新遭遇效果()
        this.updateEncounterEffect();
    }
    //更新等待计数()
    this.updateWaitCount();
    //更新目的地()
    this.updateDestination();
    //场景基础 更新 呼叫(this)
    Scene_Base.prototype.update.call(this);

};

/**开始事件
 * @param {string} label 标签
 * @param {number} near 距离
 * @param {[number]} trigger 触发设置
 * 
 * */
Game_Map.prototype.eventStart = function(label, near, trigger) {
    if (label) {
        var es = this.events()
        for (var i = 0; i < es.length; i++) {
            var e = es[i]
            if (e && e._label && (!near || e.isNearPlayer(near)) && (!trigger || trigger.indexOf(e._trigger))) {
                e._label.startEvent(label)
            }
        }
    }
};


Game_Event.prototype.setupPage = function() {
    if (this._pageIndex >= 0) {
        this.setupPageSettings();
    } else {
        this.clearPageSettings();
    }
    //安装标签
    this.setupLabel() ///

    this.refreshBushDepth();
    this.clearStartingFlag();
    this.checkEventTriggerAuto();
};


Game_Event.prototype.setupLabel = function() {
    this._label = null // 
    var have = false
    var list = this.list()
    if (list) {
        var label = new Game_Label(this)
        for (var i = 0; i < list.length; i++) {
            var command = list[i];
            if (command.code === 118) {
                have = true
                label.addLabel(command.parameters[0], i)
            }
        }
    }
    this._label = have ? label : null
    return
}




/**更新*/
Game_Event.prototype.checkEventNear = function(long) {
    if (this._label) {
        if (this._label.haveNear()) {
            this._label.startNear(Math.abs(this.deltaXFrom($gamePlayer.x)),
                Math.abs(this.deltaYFrom($gamePlayer.y))
            )
        }
    }
};

Game_Event.prototype.checkEventTriggerAuto = function() {
    if (this._trigger === 3) {
        this.start();
    }
    this.checkEventNear()
};


Game_Event.prototype.start = function(type) {
    if (type && this._label && !this._label.have(type)) {
        return
    }
    //列表 = 列表()
    var list = this.list();
    //如果( 列表  并且 列表 长度 > 1 )
    if (list && list.length > 1) {
        //开始中 = true
        this._starting = true;
        //如果( 是触发在([0,1,2])  )
        if (this.isTriggerIn([0, 1, 2])) {
            //锁()
            this.lock();
        }
    }
};

Game_Event.prototype.isNearPlayer = function(v) {
    var sx = Math.abs(this.deltaXFrom($gamePlayer.x));
    var sy = Math.abs(this.deltaYFrom($gamePlayer.y));
    var isnear = false
    if (v[2] == -1) {
        var isnear = (x + y <= v[1])
    } else if (v[2] == -2) {
        var isnear = (Math.pow(x, 2) + Math.pow(y, 2) <= Math.pow(v[1], 2))
    } else {
        var isnear = (x <= v[1] && y <= v[2])
    }
    if (isnear) {
        if (v[0]) {
            return true
        }
    } else {
        if (!v[0]) {
            return true
        }
    }
    return false
};


Game_Interpreter.prototype.thisEvent = function(param) {
    return $gameMap.event(param > 0 ? param : this._eventId);
};

Game_Interpreter.prototype.thisPicture = function(param) {
    return $gameScreen.picture(param > 0 ? param : 0);
};


Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // to be overridden by plugins
    //通过插件来覆盖 
    if (command == "switch") {
        if (args[0] == "e") {
            //var i = args[1] * 1
            var e = this.thisEvent()
            if (e && e._label) {
                var id = e._label.find()
                id > 0 ? this.jumpTo(id) : 0
            }
        } else if (args[0] == "p") {
            var i = args[1] * 1
            var e = this.thisPicture(i)
            if (e && e._label) {
                var id = e._label.find()
                id > 0 ? this.jumpTo(id) : 0
            }
        }
    };
    if (command == "pce") {
        var i = args[0] * 1
        var ei = args[1] * 1
        var p = $gameScreen.picture(i)
        if (p) {
            p.setCommonEvent(ei)
        }


    }
}

Sprite.prototype.eventFrom = function() {
    return false
}




Sprite_Character.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this.updateBitmap();
    this.updateFrame();
    this.updatePosition();
    this.updateAnimation();
    this.updateBalloon();
    this.updateOther();
    if (this.visible) {
        this.updateTouch()
    }
};



Sprite_Character.prototype.eventFrom = function() {
    return this._character
}

Sprite_Picture.prototype.eventFrom = function() {
    return this.picture()
}


Sprite.prototype.updateTouch = function() {
    var e = this.eventFrom()
    if (e) {
        var label = e._label
        if (label) {
            //需要判断触摸
            if (label.haveTouch()) {
                if (TouchInput.isPressed()) {
                    this.updatePressed(label)
                } else {
                    this.updateNotPressed(label)
                }
            }
        }
    }
}




Sprite.prototype.updatePressed = function(label) {
    if (label.haveTouchClick()) {
        //当第一次按下时
        if (label.stuteCheck("click", true)) {
            if (this.checkTouch()) {
                label.setStute("clickin", [TouchInput.x, TouchInput.y])
                $gameTemp.clearDestination()
                label.setStute("clicklong", false)
                if (label.haveTouchType("touchClickDown")) {
                    label.startTouch("touchClickDown")
                }
            } else {
                label.setStute("clickin", false)
            }
            //其他时候
        } else {
            if (label.getStute("clickin")) {
                //长按时
                if (label.haveTouchType("touchClickLong")) {
                    if (TouchInput.isLongPressed()) {
                        if (label.stuteCheck("clicklong", true)) {
                            label.startTouch("touchClickLong")
                        }
                    }
                }
                //移动时
                if (label.haveTouchType("touchClickMove")) {
                    if (TouchInput.isMoved()) {
                        label.startTouch("touchClickMove")
                    }
                }
            }
            if (label.haveTouchClickMove()) {
                if (TouchInput.isMoved()) {
                    var touch = this.checkTouch()
                    if (touch) {
                        if (label.stuteCheck("clickmovein", true)) {
                            if (label.haveTouchType("touchClickMoveIn")) {
                                label.startTouch("touchClickMoveIn")
                            }
                        }
                    } else {
                        if (label.stuteCheck("clickmovein", false)) {
                            if (label.haveTouchType("touchClickMoveIn")) {
                                label.startTouch("touchClickMoveOut")
                            }
                        }
                    }
                }
            }
        }
    }
}


Sprite.prototype.updateNotPressed = function(label) {
    /**刚刚抬起*/
    if (label.haveTouchClick()) {
        if (label.stuteCheck("click", false)) {
            /**之前是在图片中 */
            if (label.getStute("clickin")) {
                //触发抬起
                label.startTouch("touchClickUp")
                label.setStute("clicklong", false)
                label.setStute("clickin", false)
            }
        }
    }
    if (label.haveTouchMove()) {
        if (TouchInput.isMoved()) {
            var touch = this.checkTouch()

            if (touch) {
                if (label.stuteCheck("movein", true)) {
                    label.startTouch("touchMoveIn")
                }
            } else {
                if (label.stuteCheck("movein", false)) {
                    label.startTouch("touchMoveOut")
                }
            }
        }
    }
}


Sprite.prototype.checkTouch = function() {
    var x = Sprite.spriteToLocalX(this.parent, TouchInput.x)
    var y = Sprite.spriteToLocalY(this.parent, TouchInput.y)
    var touch = this.isTouch(x, y, 1) //[0, 0])
    return touch
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
Sprite.prototype.isTouch = function(x, y, type) {
    if (this.visible) {
        var x = x - this.x
        var y = y - this.y
        for (var i = 0; i < this.children.length; i++) {
            var s = this.children[i]
            if (s.isTouch && s.isTouch(x, y, type)) {
                return true
            }
        }
        if (!this._istouch && this.isTouchBitamp && this.isTouchBitamp(x, y, type)) {
            return true
        }
    }
    return false
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
    if (this.isTouchInFrame(x, y, type)) {
        return type || this.isTouchInBitamp(x, y)
    } else {
        return false
    }
}


Sprite.prototype.isTouchInFrame = function(x, y, type) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
    //
    return (x >= 0 - type[0]) &&
        (y >= 0 - type[1]) &&
        (x < this.width + type[0]) &&
        (y < this.height + type[1]);
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



Sprite_Picture.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    if (this.visible) {
        this.updateOrigin();
        this.updatePosition();
        this.updateScale();
        this.updateTone();
        this.updateOther();

        this.updateTouch()
    }
};



function Game_Label() {
    this.initialize.apply(this, arguments);
}

Game_Label.prototype.initialize = function(event) {
    this.clear()
    this.event = event
}

Game_Label.prototype.clear = function() {
    this.touch = null
    this.near = null
    this.stute = {}
    this.label = {}
}

Game_Label.prototype.addLabel = function(str, id) {
    if (str) {
        if (str.indexOf("[") == 0) {
            var list = JSON.parse(str)
            switch (list[0]) {
                case "touchMoveIn":
                case "touchMoveOut":
                case "touchClickDown":
                case "touchClickUp":
                case "touchClickMove":
                case "touchClickMoveIn":
                case "touchClickMoveOut":
                case "touchClickLong":
                    this.touch = this.touch || {}
                    this.touch[list[0]] = { type: list[0], value: list, label: str }
                    break
                case "nearIn":
                case "nearOut":
                    this.near = this.near || []
                    this.near.push({ type: list[0], value: list, label: str })
                    break;
                default:
                    break;
            }

        }
        this.label[str] = id
    }
}




Game_Label.prototype.startTouch = function(type) {
    var value = this.haveTouchType(type)
    if (value) {
        var str = value.label
        $gameTemp.clearDestination()
        this.startEvent(str)
    }
}

Game_Label.prototype.startEvent = function(str) {
    this._start = str
    if (this.event) {
        this.event.start(str)
    }
}


Game_Label.prototype.haveNear = function() {
    return this.near
}


Game_Label.prototype.startNear = function(x, y) {
    var t = this.stuteCheck("x", x)
    t = this.stuteCheck("y", y) || t
    console.log(x, y, t)
    if (t && this.near) {
        for (var i = 0; i < this.near.length; i++) {
            var o = this.near[i]
            var v = o.value
            var str = o.label
            var isnear = false
            if (v[2] == -1) {
                var isnear = (x + y <= v[1])
            } else if (v[2] == -2) {
                var isnear = (Math.pow(x, 2) + Math.pow(y, 2) <= Math.pow(v[1], 2))
            } else {
                var isnear = (x <= v[1] && y <= v[2])
            }
            if (this.stuteCheck(str, isnear)) {
                if (isnear) {
                    if (v[0] == "nearIn" && isnear) {
                        this.startEvent(str)
                        return
                    }
                } else {
                    if (v[0] == "nearOut") {
                        this.startEvent(str)
                        return
                    }
                }
            }
        }
    }
}




Game_Label.prototype.have = function(type) {
    return this.label && (type in this.label)
}
Game_Label.prototype.find = function(type) {
    var type = type || this._start
    return this.label && (type in this.label) ? this.label[type] : -1
}

Game_Label.prototype.haveTouch = function() {
    return this.touch
}


Game_Label.prototype.haveTouchType = function(i) {
    return this.touch && this.touch[i]
}

/**需要捕捉移动 */
Game_Label.prototype.haveTouchMove = function() {
    return this.touch && (
        this.touch["touchMoveIn"] ||
        this.touch["touchMoveOut"]
    )
}

/**需要捕捉按下 */
Game_Label.prototype.haveTouchClick = function() {
    return this.touch && (
        this.touch["touchClickDown"] ||
        this.touch["touchClickMove"] ||
        this.touch["touchClickMoveIn"] ||
        this.touch["touchClickMoveOut"] ||
        this.touch["touchClickLong"] ||
        this.touch["touchClickUp"]
    )
}


Game_Label.prototype.haveTouchClickMove = function() {
    return this.touch && (
        this.touch["touchClickMoveIn"] ||
        this.touch["touchClickMoveOut"]
    )
}



Game_Label.prototype.stuteCheck = function(i, v) {
    if (this.stute[i] === v) {
        return false
    } else {
        this.stute[i] = v
        return true
    }
}

Game_Label.prototype.getStute = function(i) {
    return this.stute[i]
}


Game_Label.prototype.setStute = function(i, v) {
    this.stute[i] = v
}



Game_Picture.prototype.setCommonEvent = function(i) {
    this._commonEventId = i
    this.setupLabel()
};


Game_Picture.prototype.setupLabel = function() {
    this._label = null // 
    var have = false
    var list = this.list()
    if (list) {
        var label = new Game_Label(this)
        for (var i = 0; i < list.length; i++) {
            var command = list[i];
            if (command.code === 118) {
                have = true
                label.addLabel(command.parameters[0], i)
            }
        }
    }
    this._label = have ? label : null
    return
}

Game_Picture.prototype.event = function() {
    //返回 数据公共事件组[公共事件id]
    return $dataCommonEvents[this._commonEventId];
};


/**列表*/
Game_Picture.prototype.list = function() {
    //返回 事件() 列表
    return this.event() && this.event().list;
};

Game_Picture.prototype.start = function() {
    $gameTemp.reserveCommonEvent(this._commonEventId)
};