//=============================================================================
// ww_JumpPT.js
//=============================================================================
/*:
 * @plugindesc 
 * ww_JumpPT,跳跃平台, 
 * @author wangwang
 *
 * @param  ww_JumpPT 
 * @desc 插件 跳跃平台 ,作者:汪汪
 * @default  汪汪
 *  
 * @param  base 
 * @desc  地基的判断,其他和平台一样,但按下时不会掠过,('_')建议最底下铺满..
 * @default  [2,3]
 * 
 * @param  pt 
 * @desc  平台的判断 区域id 可以是多个,当按着下时,会掠过平台,当下落时会优先落在平台上
 * @default  [19]
 * 
 * @param  sz 
 * @desc  绳子的判断,可以是多个,遇到绳子且按着上时,会停在绳子上(当然也可以修改下...)
 * @default  [18]
 * 
 * @param  qb 
 * @desc  墙壁的判断,将要碰到墙壁时,x方向会停止移动,但y方向依然会运动(上升下落),和其他不同,墙壁是一个预判断,
 * @default  [18]
 * 
 * @param  psid 
 * @desc  角色落地时会把该id开关打开,这样可以触发公共事件了,('_')
 * @default  10
 * 
 * @help 
 * 
 * $gamePlayer.jumpV(x,y,t,list) 
 * x 坐标位移,
 * y 跳跃的坐标高度,(为负时自动修正为0)
 * t 时间
 * list 数组,可以不设置,由[x,y,x,y]这样的组成,xy为坐标,设置时,经过该坐标时会掠过所有判断(对墙壁无效)
 * 
 * $gamePlayer.jumpNum()
 * 当前角色的跳跃次数  
 * 
 * $gamePlayer.isJumpingV()
 * 返回现在是否跳跃,如果在 返回结果为 g (重力加速度,负值)
 * 
 * $gamePlayer.isJumpingE()
 * 返回现在是否在一个跳跃平台事件上,如果在 返回结果为 这个事件
 * 
 * 移动区域 
 * 事件注释为 
 * base 
 * pt
 * qb
 * sz 
 * 之一时,为移动区域,判断同上
 * 落在移动区域上的人物会跟随移动区域来移动,
 * 使用 $gamePlayer.setJumpE(null)可解除这种绑定
 * 与这些区域绑定时有如下效果 
 * 如果行走方向有另一个(base,pt,sz之中)移动区域,则可以行走,否则会跳跃,
 * 当为上下时,跳跃默认为掠过该位置,往下一平台..
 * (该事件为base平台时无效,请注意不要让这些平台与base重合,否则一直下落不要怪我...)
 * 
 * 角色在跳跃时会触发
 * 经过的 
 * 优先级和角色相同 的
 * 启动方式为 决定键,玩家接触,事件接触 的
 * 事件,
 * 但不保证完美运行...建议只使用比较简单的事件.
 * 
 * 
 */






ww_JumpPt = function() {
    var find = function(name) {
        var name = name || ""
        var pm = name.toLowerCase()
        var parameters = PluginManager._parameters[pm];
        if (parameters) {} else {
            var pls = PluginManager._parameters
            for (var n in pls) {
                if (pls[n] && (name in pls[n])) {
                    parameters = pls[n]
                }
            }
        }
        return parameters || {}
    }

    var get = function(p, n, unde) {
        try {
            var i = p[n]
        } catch (e) {
            var i = unde
        }
        return i === undefined ? unde : i
    }

    var getValue = function(p, n, unde, type) {
        var i = get(p, n, unde)
        try {
            if (type) {
                return i
            }
            return JSON.parse(i)
        } catch (e) {
            return i
        }
    }
    var p = find("ww_JumpPT")
    var j = {}
    j["base"] = getValue(p, "base") || []
    j["pt"] = getValue(p, "pt") || []
    j["sz"] = getValue(p, "sz") || []
    j["qb"] = getValue(p, "qb") || []
    ww_JumpPt.jumpTypes = j
    ww_JumpPt.playJumpEndSId = getValue(p, "psid") || 0
}
ww_JumpPt()





/**获取跳跃次数 */
Game_CharacterBase.prototype.jumpNum = function() {
    return this._jumpNum || 0
}






/**跳跃下开关 */
Game_CharacterBase.prototype.jumpDownSwitch = function(i) {
    this._jumpDown = !!i
}


/**跳跃上开关 */
Game_CharacterBase.prototype.jumpUpSwitch = function(i) {
    this._jumpUp = !!i
}


ww_JumpPt._Game_CharacterBase_prototype_isJumping = Game_CharacterBase.prototype.isJumping
Game_CharacterBase.prototype.isJumping = function() {
    return ww_JumpPt._Game_CharacterBase_prototype_isJumping.call(this) || this.isJumpingV() || this.isJumpingE();
};


/**是v跳跃中 */
Game_CharacterBase.prototype.isJumpingV = function() {
    return this._g
}

/**是移动事件中 */
Game_CharacterBase.prototype.isJumpingE = function() {
    return this._jumpMoveEvent;
};



Game_CharacterBase.prototype.isJumpOn = function(type, x, y) {
    var id = $gameMap.regionId(x, y)
    var jumptypes = ww_JumpPt.jumpTypes
    if (jumptypes && jumptypes[type] && jumptypes[type].indexOf(id) >= 0) {
        return true
    } else {
        return false
    }
}


Game_CharacterBase.prototype.isJumpOnBase = function(x, y) {
    return this.isJumpOn("base", x, y)
}

Game_CharacterBase.prototype.isJumpOnPt = function(x, y) {
    return this.isJumpOn("pt", x, y)
}

Game_CharacterBase.prototype.isJumpOnSz = function(x, y) {
    return this.isJumpOn("sz", x, y)
}

Game_CharacterBase.prototype.isJumpOnQb = function(x, y) {
    return this.isJumpOn("qb", x, y) || !(x >= 0 && x < $gameMap.width())
}



ww_JumpPt._Game_Map_prototype_setupEvents = Game_Map.prototype.setupEvents
Game_Map.prototype.setupEvents = function() {
    ww_JumpPt._Game_Map_prototype_setupEvents.call(this)
    var es = this.events()
    var types = {
        base: [],
        pt: [],
        sz: [],
        qd: []
    }
    for (var i = 0; i < es.length; i++) {
        var e = es[i]
        if (e && e.event()) {
            var name = e.event().note
            if (types[name]) {
                types[name].push(e)
            }
        }
    }
    this._jumpEvents = types
};


Game_Map.prototype.jumpEvents = function(types) {
    if (this._jumpEvents) {
        var es = []
        for (var i = 0; i < types.length; i++) {
            var name = types[i]
            es = es.concat(this._jumpEvents[name] || [])
        }
        return es
    } else {
        return this.events()
    }
}

Game_CharacterBase.prototype.isJumpOnEvent = function(x, y, type) {
    if (this.canStartLocalEvents()) {
        var es = $gameMap.jumpEvents(type)
        for (var i = 0; i < es.length; i++) {
            var e = es[i]
            if (e && e.pos(x, y)) {
                return e
            }
        }
    }
    return false
}


Game_CharacterBase.prototype.initJumpTouchEnd = function() {
    this._JumpTouchEnd = {}
}

Game_CharacterBase.prototype.setJumpTouchEnd = function(x, y, z) {
    if (this._JumpTouchEnd) {
        this._JumpTouchEnd[x + "," + y] = z
    }
}
Game_CharacterBase.prototype.getJumpTouchEnd = function(x, y) {
    if (this._JumpTouchEnd) {
        return this._JumpTouchEnd[x + "," + y]
    }
}


Game_CharacterBase.prototype.jumpV = function(x, y, g, list) {
    if (g) {
        this.setJumpE(null)
        this._jumpNum = this.jumpNum() + 1
    }
    this.initJumpTouchEnd()

    if (list) {
        for (var i = 0; i < list.length; i += 2) {
            this.setJumpTouchEnd(list[i], list[i + 1], 3)
        }
    }
    if (x !== 0) {
        this.setDirection(x < 0 ? 4 : 6);
    }
    var y = Math.round(y || 0)
    y = y > 0 ? y : 0
    if (g == 0) {
        this._jumpVx = 0
        this._jumpVy = 0
        this._g = 0
        this._jumpCount = this._jumpCountAll = 0
        this._jumpNum = 0
    } else if (g < 0) {
        this._g = g
        this._jumpVx = x || 0
        this._jumpVy = -y * g
        this._jumpCount = this._jumpCountAll = y + y
    } else if (g > 0) {
        var t = g
        this._jumpCount = this._jumpCountAll = t + t
        this._jumpVx = (x || 0) / this._jumpCountAll
        this._jumpVy = 2 * (y || 0) / t
        this._g = ((-this._jumpVy) || (-2 / t)) / t
    }
    this.resetStopCount();
    this.straighten();
};



ww_JumpPt._Game_CharacterBase_prototype_updateJump = Game_CharacterBase.prototype.updateJump
Game_CharacterBase.prototype.updateJump = function() {
    if (this.isJumpingE()) {
        this.updateJumpE()
    } else if (this.isJumpingV()) {
        this.updateJumpV();
        //this._x = $gameMap.roundX(Math.round(this._realX))
        //this._y = $gameMap.roundX(Math.round(this._realY))
    } else {
        ww_JumpPt._Game_CharacterBase_prototype_updateJump.call(this)
    }
};

/**设置跳跃事件 */
Game_CharacterBase.prototype.setJumpE = function(e) {
    this._jumpMoveEvent = e
    if (e) {
        this._jumpMoveEventLx = e._x
        this._jumpMoveEventLy = e._y
        this._jumpMoveEventRx = e._realX
        this._jumpMoveEventRy = e._realY
    }
}

/**移动跟着 */
Game_CharacterBase.prototype.moveByJumpE = function() {
    var e = this._jumpMoveEvent
    if (e) {
        var dx = e._x - this._jumpMoveEventLx
        var dy = e._y - this._jumpMoveEventLy
        var rx = e._realX - this._jumpMoveEventRx
        var ry = e._realY - this._jumpMoveEventRy
        this._x += dx
        this._y += dy
        this._realX += rx
        this._realY += rx
        if (this.onJumpEMove()) {
            if (e._realX < this._realX) {
                this._realX = Math.max(this._realX - this.distancePerFrame(), e._realX);
            }
            if (e._realX > this._realX) {
                this._realX = Math.min(this._realX + this.distancePerFrame(), e._realX);
            }
            if (this._y < this._realY) {
                this._realY = Math.max(this._realY - this.distancePerFrame(), e._realY);
            }
            if (this._y > this._realY) {
                this._realY = Math.min(this._realY + this.distancePerFrame(), e._realY);
            }

        }
        this.setJumpE(e)
    }
}

Game_CharacterBase.prototype.onJumpEMove = function() {
    var e = this._jumpMoveEvent
    if (e) {
        return this._realX != e._realX || this._realY != e._realY
    }
}


Game_CharacterBase.prototype.updateAnimationCountE = function() {
    if (this.onJumpEMove() && this.hasWalkAnime()) {
        this._animationCount += 1.5;
    }
};



Game_CharacterBase.prototype.updateJumpE = function() {
    this.moveByJumpE()
    if (this.onJumpEMove()) {
        this.updateAnimationCountE()
    } else {
        this.updateJumpEInput()
    }
};



Game_CharacterBase.prototype.updateJumpEInput = function() {}



ww_JumpPt._Game_Player_prototype_canMove = Game_Player.prototype.canMove
Game_Player.prototype.canMove = function() {
    return ww_JumpPt._Game_Player_prototype_canMove.call(this) && !this.isJumping();
};


Game_Player.prototype.updateJumpEInput = function() {
    var direction = this.getInputDirection();
    if (direction > 0) {
        $gameTemp.clearDestination();
    }
    if (direction > 0) {
        var d = direction
        this.setDirection(d)
        var x2 = $gameMap.roundXWithDirection(this._x, d);
        var y2 = $gameMap.roundYWithDirection(this._y, d);
        var e = this.isJumpOnEvent(x2, y2, ["sz", "pt", "base"])
        if (e) {
            this.setJumpE(e)
            this._x = x2
            this._y = y2
        } else {
            var e = this.isJumpingE()
            if (e) {
                if (e.event().note == "base") {

                } else {
                    this.jumpV(x2 - this._x, this._y - y2, 15, [this._x, this._y])
                }
            }
        }
    }
}






Game_CharacterBase.prototype.updateJumpV = function() {
    this._jumpCount--;
    var moveX = this.jumpMoveX()
    var moveY = this.jumpMoveY()

    var rx0 = this._realX
    var ry0 = this._realY

    var rx1 = this._realX = rx0 + moveX
    var ry1 = this._realY = ry0 + moveY

    var x0 = $gameMap.roundX(Math.round(rx0))
    var x1 = $gameMap.roundX(Math.round(rx1))
    var x01 = $gameMap.roundX(rx1)

    var y0 = $gameMap.roundX(Math.round(ry0))
    var y10 = $gameMap.roundX(ry0)
    var y1 = $gameMap.roundX(Math.round(ry1))
        //console.log(x0, x1, x01, y0, y1, y10) 
        //右跳
    if (moveX > 0) {
        if (x01 > x1) {
            for (var xi = x0; xi <= x1; xi++) {
                if (this.isJumpOnQb(xi + 1, y0) || this.isJumpOnEvent(xi + 1, y0, ["qb"])) {
                    this.jumpXEnd(xi)
                    x1 = xi
                    break
                }
            }
        }
        //左跳
    } else if (moveX < 0) {
        if (x01 < x1) {
            for (var xi = x0; xi >= x1; xi--) {
                if (this.isJumpOnQb(xi - 1, y0) || this.isJumpOnEvent(xi - 1, y0, ["qb"])) {
                    this.jumpXEnd(xi)
                    x1 = xi
                    break
                }
            }
        }
    }
    /**上跳 */
    if (moveY < 0) {
        if (y10 <= y0) {
            for (var yi = y0; yi >= y1; yi--) {
                if (moveX > 0) {
                    for (var xi = x0; xi <= x1; xi++) {
                        if (this.touchJump(xi, yi, 1)) { return }
                    }
                } else {
                    for (var xi = x0; xi >= x1; xi--) {
                        if (this.touchJump(xi, yi, 1)) { return }
                    }
                }
            }
        }
    } else {
        if (y10 >= y0) {
            for (var yi = y0; yi <= y1; yi++) {
                if (moveX > 0) {
                    for (var xi = x0; xi <= x1; xi++) {
                        if (this.touchJump(xi, yi, 2)) { return }
                    }
                } else {
                    for (var xi = x0; xi >= x1; xi--) {
                        if (this.touchJump(xi, yi, 2)) { return }
                    }
                }
            }
        }
    }
    if (Math.abs(moveX) > 10 || Math.abs(moveX) > 10) {
        this.jumpEnd(x0, y0)
    }
};



Game_CharacterBase.prototype.touchJump = function(x, y, type) {
    var have = this.getJumpTouchEnd(x, y)
    if (have == type || have == 3) {
        return false
    }
    //console.log(x, y, type)
    this.touchEvent(x, y)
    if (type == 2) {
        if (this._jumpDown) {
            var e = this.isJumpOnEvent(x, y, ["base"])
            if (e) {
                this.setJumpE(e)
                this.jumpEnd(x, y)
                return true
            }
            if (this.isJumpOnBase(x, y)) {
                this.jumpEnd(x, y)
                return true
            }
        } else {
            var e = this.isJumpOnEvent(x, y, ["pt", "base"])
            if (e) {
                this.setJumpE(e)
                this.jumpEnd(x, y)
                return true
            }
            if (this.isJumpOnBase(x, y)) {
                this.jumpEnd(x, y)
                return true
            }
            if (this.isJumpOnPt(x, y)) {
                //console.log("pt")
                this.jumpEnd(x, y)
                return true
            }
        }
    }
    //绳子判断
    var e = this.isJumpOnEvent(x, y, ["sz"])
    if (e && this._jumpUp) {
        this.setJumpE(e)
        this.jumpEnd(x, y)
        return true
    }
    if (this.isJumpOnSz(x, y) && this._jumpUp) {
        this.jumpEnd(x, y)
        return true
    }
    this.setJumpTouchEnd(x, y, type)

    return false
}


Game_CharacterBase.prototype.touchEvent = function(x, y) {}

Game_Player.prototype.touchEvent = function(x, y) {
    this.startJumpEvent(x, y)
}


Game_CharacterBase.prototype.jumpXEnd = function(x, y) {
    this._realX = x
    this._jumpVx = 0
}

Game_CharacterBase.prototype.jumpEnd = function(x, y) {
    this._x = x
    this._y = y
    this._realX = this._realX
    this._realY = y
    this._jumpVx = 0
    this._jumpVy = 0
    this._g = 0
    this._jumpCount = 0
    this._jumpNum = 0

    if (this.getJumpEndSid()) {
        $gameSwitches.setValue(this.getJumpEndSid(), true)
    }

}

Game_CharacterBase.prototype.setJumpEndSid = function(i) {
    this._jumpEndSId = i
}
Game_CharacterBase.prototype.getJumpEndSid = function() {
    return this._jumpEndSId
}

Game_Player.prototype.jumpEnd = function(x, y) {
    Game_CharacterBase.prototype.jumpEnd.call(this, x, y)
    if (ww_JumpPt.playJumpEndSId) {
        $gameSwitches.setValue(ww_JumpPt.playJumpEndSId, true)
    }
}

ww_JumpPt._Game_CharacterBase_prototype_jumpHeight = Game_CharacterBase.prototype.jumpHeight
Game_CharacterBase.prototype.jumpHeight = function() {
    if (this.isJumpingV()) {
        return 0
    } else {
        return ww_JumpPt._Game_CharacterBase_prototype_jumpHeight.call(this)
    }
}



Game_CharacterBase.prototype.jumpMoveX = function() {
    var g = this._g
    if (g < 0) {
        return this._jumpVx;
    } else {
        return 0
    }
};

Game_CharacterBase.prototype.jumpMoveY = function() {
    var g = this._g
    if (g < 0) {
        var t = this._jumpCountAll - this._jumpCount
        return -(this._jumpVy + g * t + g / 2);
    } else {
        return 0
    }
};



ww_JumpPt._Game_Player_prototype_updateJump = Game_Player.prototype.updateJump
Game_Player.prototype.updateJump = function() {
    if (Input.dir4 == 8) {
        this.jumpUpSwitch(true)
    } else {
        this.jumpUpSwitch(false)
    }
    if (Input.dir4 == 2) {
        this.jumpDownSwitch(true)
    } else {
        this.jumpDownSwitch(false)
    }
    ww_JumpPt._Game_Player_prototype_updateJump.call(this)
};


Game_CharacterBase.prototype.startJumpEvent = function(x, y) {
    if (this.canStartLocalEvents()) {
        //开始地图事件(x,y,触发组 ,false)
        this.startMapEvent(x, y, [0, 1, 2], true);
    }
}