
//=============================================================================
// SaoLei.js
//=============================================================================
/*:
 * @plugindesc 扫雷
 * @author wangwang
 *
 * @param ver
 * @desc 版本
 * @default 1.0
 *
 * @help
 * 
 * ===================================================
 * 初始化
 * 
 * $saolei = new SaoLei(2,5,5,6)
 * 基础事件 2号事件(之后不要有事件)
 * 宽 5
 * 高 5
 * 雷数 6
 * 
 * ===================================================
 * 使用更新默认方式
 * 当结束时返回 true 
 * 
 * $saolei.update()
 * 
 * 
 * ===================================================
 * 
 * 
 * $saolei.input(1,0)
 * 插拔旗子
 * 
 * 
 * $saolei.input(1,1)
 * 翻开雷区
 * 
 * 
 * 
 * 获取角色位置雷区Id
 * $saolei.inputId()
 * 
 * 获取角色位置雷区情况(9为雷)
 * $saolei.inputLeiQu()
 * 
 * 
 * 获取角色位置插旗情况(0 (false)为没有插旗,1 为已经翻开, 2为插旗了) 
 * $saolei.inputQi()
 * 
 * 
 * ===================================================
 * 
 * 输入 
 * 
 * $saolei.updateTouchInput()
 * 触摸时把角色移动到触摸位置
 * 
 * 
 * ===================================================
 *  
 * 
 * 触摸输入时
 * 
 * 单击 插拔旗
 * 长按 翻开雷区
 * 
 * 插旗只能插指定地雷数的旗
 * 当 翻开地雷 或者 除插旗外都翻开时 结束
 * 
 * 
 * 
 * ===================================================
 * 是游戏结束 
 * $saolei.end()
 * 
 * 游戏结束返回true
 * 
 * 
 * ===================================================
 * 结果
 * 
 * var z = $saolei.gameEval()
 * "未标的地雷数" , z[0]
 * "标错的旗子数" , z[1]
 * "正确的旗子数" , z[2]
 * 
 * =================================================== 
 * 胜利
 * 
 * $saolei.win()
 * 无标错或未标旗子时返回true
 * 
 * ===================================================
 * 
 * 
 * 
 * 刷新
 * 
 * 雷区重置
 * $saolei.refresh() 
 * 
 * ===================================================
 * 
 *  
*/

var $saolei = null

function SaoLei() {
    this.initialize.apply(this, arguments);

}

//设置创造者
SaoLei.prototype.constructor = SaoLei;

SaoLei.prototype.initialize = function (id, x, y, z) {
    this._x = x
    this._y = y
    this._z = z
    this.make()
    this.setup(id)
    console.log(this.makeSprite2())
};

SaoLei.prototype.gameEval = function () {
    var r = [0, 0, 0]
    for (var i = 0; i < this._leiqu.length; i++) {
        var z0 = (this._leiqu[i] == 9)
        var z1 = (this._xianshi[i] == 2)
        if (z0) {
            if (!z1) {
                //未插旗的地雷
                r[0]++
            } else {
                //正确的旗子
                r[2]++
            }
        } else {
            if (z1) {
                //错误的旗子
                r[1]++
            }
        }
    }
    return r
}


SaoLei.prototype.win = function () {
    var r = [0, 0, 0]
    for (var i = 0; i < this._leiqu.length; i++) {
        var z0 = (this._leiqu[i] == 9)
        var z1 = (this._xianshi[i] == 2)
        if (z0) {
            if (!z1) {
                //未插旗的地雷
                r[0]++
            } else {
                //正确的旗子
                r[2]++
            }
        } else {
            if (z1) {
                //错误的旗子
                r[1]++
            }
        }
    }
    return r[0] == 0 && r[1] == 0
}





SaoLei.prototype.update = function () {
    if (this.end()) {
        return true
    }
    var ok = Input.isTriggered('ok')
    if (ok) {
    } else {
        ok = this.updateTouchInput()
        if (ok) {
            shift = true
            if (TouchInput.isLongPressed()) {
                this.input(true, true)
                shift = false
            }
        }
    }
    this.input(ok, shift)
    return false
}

SaoLei.prototype.updateTouchInput = function () {
    if (TouchInput.isRepeated()) {
        var x = $gameMap.canvasToMapX(TouchInput.x);
        var y = $gameMap.canvasToMapY(TouchInput.y);
        var x0 = x - this._eventx
        var y0 = y - this._eventy
        if (x0 >= 0 && x0 < this._x && y0 >= 0 && y0 <= this._y) {
            $gamePlayer.locate(x, y)
            return true
        }
    }
    return false
}

SaoLei.prototype.inputId = function(){ 
    var x = $gamePlayer._x
    var y = $gamePlayer._y
    var x0 = x - this._eventx
    var y0 = y - this._eventy
    var id = y0 * this._x + x0
    if (x0 >= 0 && x0 < this._x && y0 >= 0 && y0 <= this._y) {
        var id = y0 * this._x + x0
        return id
    }else{
        return -1
    } 
}


SaoLei.prototype.inputLeiQu = function(){ 
    var id = this.inputId()
    if(id>=0){  
        return this.getLeiQu(id)
    } 
}

SaoLei.prototype.inputQi = function(){ 
    var id = this.inputId()
    if(id>=0){  
        return this.getQi(id)
    } 
}



/**输入 */
SaoLei.prototype.input = function (ok, shift) {
    if (ok) {
        var id = this.inputId()
        if(id>=0){ 
            if (shift) {
                this.dianji2(id)
            } else {
                this.dianji(id)
            } 
        } 
    }
}

/**刷新 */
SaoLei.prototype.refresh = function () {
    this.make()
    var all = this._x * this._y
    for (var i = 0; i < all; i++) {
        this.showleiqu(i, 11)
    }
}

/**安装 */
SaoLei.prototype.setup = function (id) {
    this.getevent(id)
    this.makeEvent()
}

/**设置雷区 */
SaoLei.prototype.setLeiQu = function (id, num) {
    this._leiqu[id] = num
}

/**获取雷区 */
SaoLei.prototype.getLeiQu = function (id) {
    return this._leiqu[id]
}

/**设置 */
SaoLei.prototype.setQi = function (id, num) {
    if (num == 0) {
        if (this._xianshi[id]) {
            this._xsshu--
        }
    } else {
        if (!this._xianshi[id]) {
            this._xsshu++
        }
    }
    if (num == 2) {
        if (!this._xianshi[id]) {
            this._qishu++
        }
    } else {
        if (this._xianshi[id] == 2) {
            this._qishu--
        }
    }
    this._xianshi[id] = num
}

/**获取显示内容 */
SaoLei.prototype.getQi = function (id) {
    return this._xianshi[id]
}


//制作扫雷区
SaoLei.prototype.make = function (x, y, z) {
    var all = this._x * this._y
    var lei = []

    this._qishu = 0
    this._xsshu = 0
    this._leiqu = []
    this._xianshi = []

    for (var i = 0; i < all; i++) {
        this.setLeiQu(i, 0)
        this._xianshi[i] = 0
        lei[i] = i
    }
    for (var i = 0; i < this._z; i++) {
        var lid = Math.floor(lei.length * Math.random())
        var id = lei[lid]
        this._leiqu[id] = 9
        lei.splice(lid, 1)
    }
    for (var i = 0; i < all; i++) {
        this.makenum(i)
    }
};


//安装
SaoLei.prototype.showleiqu = function (id, z) {
    var e = $gameMap.event(id + this._eventId)
    var l = [[4,0],[4,1],[4,2],[6,0],[6,1],[6,2],[8,0],[8,1],[8,2],[2,2],[2,1],[2,0]]
    if (e) {
        var dp = l[z] || [4,0]
        var d = dp[0]
        var p = dp[1] 
        e._direction = d
        e._originalPattern = p
        e._pattern = p
    }
};


/**获取事件 */
SaoLei.prototype.getevent = function (id) {
    this._eventId = id
    this._eventx = $gameMap.event(this._eventId)._x
    this._eventy = $gameMap.event(this._eventId)._y
};
//棋子id x
SaoLei.prototype._idx = function (id) {
    return id % this._x
}
//棋子id y
SaoLei.prototype._idy = function (id) {
    return (id - id % this._x) / this._y
}

/**制作事件 */
SaoLei.prototype.makeEvent = function () {
    for (var i = 1; i < this._leiqu.length; i++) {
        var x = this._idx(i)
        var y = this._idy(i)
        SaoLei.copyEvent(this._eventId, i, this._eventx + x, this._eventy + y)
    }
};

/**制作精灵 */
SaoLei.prototype.makeSprite = function () {
    var t = ""
    for (var yi = 0; yi < this._y; yi++) {
        t += "\n"
        for (var xi = 0; xi < this._x; xi++) {
            var id = xi + yi * this._x
            t += this._leiqu[id]
        }
    }
    return t
};

/**制作精灵2 */
SaoLei.prototype.makeSprite2 = function () {
    var t = ""
    for (var yi = 0; yi < this._y; yi++) {
        t += "\n"
        for (var xi = 0; xi < this._x; xi++) {
            var id = xi + yi * this._x
            if (this._xianshi[id] == 1) {
                t += this._leiqu[id]
            } else if (this._xianshi[id] == 2) {
                t += "F"
            } else {
                t += "H"
            }
        }
    }
    return t
};

/**制作数目 */
SaoLei.prototype.makenum = function (id) {
    if (this.getLeiQu(id) === 9) {
        return
    }
    var num = 0
    for (var d = 1; d < 10; d++) {
        var id2 = this.idd(id, d)
        if (this.getLeiQu(id2) === 9) {
            num++
        }
    }
    this.setLeiQu(id, num)
};

/**结束 */
SaoLei.prototype.end = function () {
    return this._xianshi.length == this._xsshu
};

/**通过方向 获取id */
SaoLei.prototype.idd = function (id, d) {
    var x = id % this._x
    var y = (id - x) / this._x
    var dn = [0, [-1, 1], [0, 1], [1, 1], [-1, 0], 0, [1, 0], [-1, -1], [0, -1], [1, -1]]
    var xyd = dn[d] || [0, 0]
    var x2 = x + xyd[0]
    var y2 = y + xyd[1]
    if (x2 < 0 || y2 < 0 || x2 >= this._x || y2 >= this._y) {
        return -1
    }
    return y2 * this._x + x2
};

/**插拔旗 */
SaoLei.prototype.dianji2 = function (id) {
    if (!this._xianshi[id]) {
        if (this._qishu < this._z) {
            this.setQi(id, 2)
            this.showleiqu(id, 10)
            console.log(this.makeSprite2())
        }
    } else if (this._xianshi[id] == 2) {
        this.setQi(id, 0)
        this.showleiqu(id, 11)
        console.log(this.makeSprite2())
    }
};

/**翻雷区 */
SaoLei.prototype.dianji = function (id) {
    if (!this._xianshi[id]) {
        if (this.getLeiQu(id) == 9) {
            this.showall(id)
            this.dead(id)
        } else {
            this.show(id)
        }
        console.log(this.makeSprite2())
    }
};

/**死亡 */
SaoLei.prototype.dead = function (id) {
    var e = $gameMap.event(id + this._eventId)
    e.requestAnimation(1)
};

/**显示所有雷区 */
SaoLei.prototype.showall = function (id) {
    var all = this._x * this._y
    for (var i = 0; i < all; i++) {
        var z = this._xianshi[i]
        this.setQi(i, z || 1)
        var num = this.getLeiQu(i)
        if (num == 9 && z == 2) {
            num = 10
        }
        this.showleiqu(i, num)
    }
}

/**显示雷区 */
SaoLei.prototype.show = function (id) {
    this.setQi(id, 1)
    var num = this.getLeiQu(id)
    this.showleiqu(id, num)
    if (num == 0) {
        for (var d = 1; d < 10; d++) {
            var id2 = this.idd(id, d)
            if (id2 >= 0 && d != 5 && !this._xianshi[id2]) {
                this.show(id2)
            }
        }
    }
};

//复制fid事件到tid x ,y
SaoLei.copyEvent = function (fid, id, x, y) {
    if (fid > 0 && id > 0) {
        var fid = fid
        var tid = fid + id
        if (DataManager.isMapLoaded()) {
            var event = SaoLei.loadDataEvent(tid)
            if (event) {
                var event = SaoLei.loadGameEvent(tid)
            } else {
                var event = SaoLei._changeNowMapEvent(fid, tid)
            }
            event.locate(x, y)
        }
    }
}

//改变当前地图id事件为 event (csh 是否重设位置)
SaoLei._changeNowMapEvent = function (fid, tid) {
    return SaoLei._addNowMapEvent(fid, tid)
}

//添加当前地图事件
SaoLei._addNowMapEvent = function (fid, tid) {
    $gameMap._events[tid] = new Game_Event($gameMap.mapId(), fid)
    if (SceneManager && SceneManager._scene && SceneManager._scene.constructor == Scene_Map) {
        if (SceneManager._scene._spriteset && SceneManager._scene._spriteset._characterSprites) {
            var spriteset = SceneManager._scene._spriteset
            var characterSprites = SceneManager._scene._spriteset._characterSprites
            var c = new Sprite_Character($gameMap._events[tid])
            characterSprites.push(c)
            spriteset._tilemap.addChild(c);
        }
    }
    return $gameMap._events[tid]
}

//读取当前地图id事件
SaoLei.loadDataEvent = function (id) {
    var event;
    var mapdata = $dataMap
    if (mapdata) {
        var events = mapdata.events
        if (events) {
            var event = events[id]
        }
    }
    return event;
}
SaoLei.loadGameEvent = function (id) {
    var event;
    var mapdata = $gameMap
    if (mapdata) {
        var events = mapdata._events
        if (events) {
            var event = events[id]
        }
    }
    return event;
}