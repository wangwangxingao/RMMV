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
 * 
 * @param  base 
 * @desc  地基的判断,放在最底层平台下面 区域id ,可以是多个
 * @default  [2,3]
 * 
 * @param  pt 
 * @desc  平台的判断 区域id 可以是多个 ,当按着下时,会掠过平台直到有地基的平台 
 * @default  [19]
 * 
 * @param  sz 
 * @desc  绳子的判断  可以是多个,遇到绳子且 按着上时 停在绳子上
 * @default  [18]
 * 
 * @help
 *   
 * 对于角色 
 * $gamePlayer.jumpV(x,y,t) 
 * x 坐标位移,
 * y 跳跃的坐标高度,
 * t 时间
 * 
 * $gamePlayer.jumpNum()
 * 当前的跳跃次数 
 * 
 * 
 */




/**地基的判断,放在最底层平台下面 区域id ,可以是多个*/
//Game_CharacterBase.baseId = []

/**平台的判断 区域id 可以是多个 ,当按着下时,会掠过平台直到有地基的平台 */
//Game_CharacterBase.ptId = []

/**绳子的判断  可以是多个,遇到绳子且 按着上时 停在绳子上 */
//Game_CharacterBase.szId = []



Game_CharacterBase.baseId = []
Game_CharacterBase.ptId = []
Game_CharacterBase.szId = []



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
    Game_CharacterBase.baseId = getValue(p, "base") || []
    Game_CharacterBase.ptId = getValue(p, "pt") || []
    Game_CharacterBase.szId = getValue(p, "sz") || []
}
ww_JumpPt()



/**获取跳跃次数 */
Game_CharacterBase.prototype.jumpNum = function() {
    return this._jumpNum || 0
}



/**是v跳跃中 */
Game_CharacterBase.prototype.isJumpingV = function() {
    return this._g
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
    return ww_JumpPt._Game_CharacterBase_prototype_isJumping.call(this) || this.isJumpingV();
};


Game_CharacterBase.prototype.isJumpOnBase = function(x, y) {
    var id = $gameMap.regionId(x, y)
    if (Game_CharacterBase.baseId.indexOf(id) >= 0) {
        return true
    } else {
        return false
    }
}

Game_CharacterBase.prototype.isJumpOnPt = function(x, y) {
    var id = $gameMap.regionId(x, y)
    if (Game_CharacterBase.ptId.indexOf(id) >= 0) {
        return true
    } else {
        return false
    }
}

Game_CharacterBase.prototype.isJumpOnSz = function(x, y) {
    var id = $gameMap.regionId(x, y)
    if (Game_CharacterBase.szId.indexOf(id) >= 0) {
        return true
    } else {
        return false
    }
}


Game_CharacterBase.prototype.jumpV = function(x, y, g) {
    if (x !== 0) {
        this.setDirection(x < 0 ? 4 : 6);
    }
    var y = Math.round(y || 0)
    this._realY -= this.jumpHeight1()
    this._jumpNum = this.jumpNum() + 1
    if (y <= 0 || g == 0) {
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
        this._x += x * this._jumpCountAll;
    } else if (g > 0) {
        var t = g
        this._jumpCount = this._jumpCountAll = t + t
        this._jumpVx = (x || 0) / this._jumpCountAll
        this._jumpVy = 2 * (y || 0) / t
        this._g = -this._jumpVy / t
        this._x += x
    }
    this.resetStopCount();
    this.straighten();
};



ww_JumpPt._Game_CharacterBase_prototype_updateJump = Game_CharacterBase.prototype.updateJump
Game_CharacterBase.prototype.updateJump = function() {
    if (this.isJumpingV()) {
        this.updateJump1() * $gameMap.tileHeight();
    } else {
        ww_JumpPt._Game_CharacterBase_prototype_updateJump.call(this)
    }
};


Game_CharacterBase.prototype.updateJump1 = function() {
    this._jumpCount--;
    this._realX += this._jumpVx
    var t = this._jumpCountAll - this._jumpCount
    if (t > this._jumpCount) {
        this.updateJumpDown()
    } else {
        this.updateJumpUp()
    }
};




Game_CharacterBase.prototype.updateJumpUp = function() {
    var h = this.jumpHeight1()
    var y0 = $gameMap.roundY(Math.round(this._realY - h));
    this._jumpCount--;
    var h = this.jumpHeight1()
    var y10 = $gameMap.roundY(this._realY - h);
    var y1 = $gameMap.roundY(Math.round(this._realY - h));
    this._jumpCount++;

    if (this._jumpVx > 0) {
        var x = $gameMap.roundX(Math.ceil(this._realX))
    } else if (this._jumpVx < 0) {
        var x = $gameMap.roundX(Math.floor(this._realX))
    } else {
        var x = $gameMap.roundX(Math.round(this._realX))
    }

    if (!(x >= 0 && x < $gameMap.width())) {
        this._jumpVx = 0
    }

    if (y10 <= y0) {
        for (var i = 0; i + y0 >= y1; i--) {
            var y = y0 + i
            if (this.isJumpOnSz(x, y) && this._jumpUp) {
                this.jumpEnd(x, y)
                return
            }
        }
    }
};




Game_CharacterBase.prototype.updateJumpDown = function() {
    var h = this.jumpHeight1()
    var y0 = $gameMap.roundY(Math.round(this._realY - h));
    this._jumpCount--;
    var h = this.jumpHeight1()
    var y10 = $gameMap.roundY(this._realY - h);
    var y1 = $gameMap.roundY(Math.round(this._realY - h));
    this._jumpCount++;

    if (this._jumpVx > 0) {
        var x = $gameMap.roundX(Math.ceil(this._realX))
    } else if (this._jumpVx < 0) {
        var x = $gameMap.roundX(Math.floor(this._realX))
    } else {
        var x = $gameMap.roundX(Math.round(this._realX))
    }

    if (!(x >= 0 && x < $gameMap.width())) {
        this._jumpVx = 0
    }
    if (y10 >= y0) {
        for (var i = 0; i + y0 <= y1; i++) {
            var y = y0 + i
            if (this.isJumpOnPt(x, y)) {
                if (this.isJumpOnBase(x, y + 1)) {
                    this.jumpEnd(x, y)
                    return
                } else if (this._jumpDown) {

                } else {
                    this.jumpEnd(x, y)
                    return
                }
            }
            if (this.isJumpOnSz(x, y) && this._jumpUp) {
                this.jumpEnd(x, y)
                return
            }
        }
    }
}


Game_CharacterBase.prototype.jumpEnd = function(x, y) {
    this._x = x
    this._y = y
    this._realX = this._realX
    this._realY = y //-= this.jumpHeight1()
    this._jumpVx = 0
    this._jumpVy = 0
    this._g = 0
    this._jumpCount = 0
    this._jumpNum = 0
}



ww_JumpPt._Game_CharacterBase_prototype_jumpHeight = Game_CharacterBase.prototype.jumpHeight
Game_CharacterBase.prototype.jumpHeight = function() {
    if (this.isJumpingV()) {
        return this.jumpHeight1() * $gameMap.tileHeight()
    } else {
        return ww_JumpPt._Game_CharacterBase_prototype_jumpHeight.call(this)
    }
}



Game_CharacterBase.prototype.jumpHeight1 = function() {
    var g = this._g
    if (g < 0) {
        var t = this._jumpCountAll - this._jumpCount
        return this._jumpVy * t + Math.pow(t, 2) * g / 2;
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