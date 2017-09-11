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
 * $gameVariables._data[1] = new SaoLei(2,5,5,6)
 * 基础事件 2号事件(之后不要有事件)
 * 宽 5
 * 高 5
 * 雷数 6
 * 
 * ===================================================
 * 更新 
 * 
 * 当结束时返回 true 
 * 
 * $gameVariables._data[1].update()
 * 
 * 键盘输入时
 *   
 * 按 ok 键 翻开雷区
 * 按 shift + ok 插拔旗
 * 
 * 触摸输入时
 * 
 * 单击 插拔旗
 * 长按 翻开雷区
 * 
 * 插旗只能插指定地雷数的旗
 * 当 翻开地雷 或者 除插旗外都翻开时 结束
 * 
 * ===================================================
 * 结果
 * 
 * var z = $gameVariables._data[1].gameEval()
 * "未标的地雷数" , z[0]
 * "标错的旗子数" , z[1]
 * "正确的旗子数" , z[2]
 * 
 * ===================================================
 * 刷新
 * 
 * 雷区重置
 * $gameVariables._data[1].refresh() 
 * 
 * ===================================================
 * 
 *  
 */


function SaoLei() {
    this.initialize.apply(this, arguments);

}

//设置创造者
SaoLei.prototype.constructor = SaoLei;

SaoLei.prototype.initialize = function(id, x, y, z) {
    this._x = x
    this._y = y
    this._z = z
    this.make()
    this.setup(id)
    console.log(this.makeSprite2())
};

SaoLei.prototype.gameEval = function() {
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


SaoLei.prototype.update = function() {
    if (this.isend()) {
        return true
    }
    var shift = Input.isPressed('shift')
    var ok = Input.isTriggered('ok')
    if (ok) {} else {
        ok = this.updateTouchInput()
        if (ok) {
            shift = true
            if (TouchInput.isLongPressed()) {
                this.updateInput(true, true)
                shift = false
            }
        }
    }
    this.updateInput(ok, shift)
    return false
}


SaoLei.prototype.updateTouchInput = function() {
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


SaoLei.prototype.updateInput = function(ok, shift) {
    if (ok) {
        var x = $gamePlayer._x
        var y = $gamePlayer._y
        var x0 = x - this._eventx
        var y0 = y - this._eventy
        if (x0 >= 0 && x0 < this._x && y0 >= 0 && y0 <= this._y) {
            var id = y0 * this._x + x0
            if (shift) {
                this.dianji2(id)
            } else {
                this.dianji(id)
            }
        }
    }
}

SaoLei.prototype.refresh = function() {
    this.make()
    var all = this._x * this._y
    for (var i = 0; i < all; i++) {
        this.showleiqu(i, 11)
    }
}

SaoLei.prototype.setup = function(id) {
    this.getevent(id)
    this.makeEvent()
}

SaoLei.prototype.setLeiQu = function(id, num) {
    this._leiqu[id] = num
}
SaoLei.prototype.getLeiQu = function(id) {
    return this._leiqu[id]
}


SaoLei.prototype.setQi = function(id, num) {
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
SaoLei.prototype.getQu = function(id) {
    return this._xianshi[id]
}


//制作扫雷区
SaoLei.prototype.make = function(x, y, z) {
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
SaoLei.prototype.showleiqu = function(id, z) {
    var e = $gameMap.event(id + this._eventId)
    if (e) {
        if (z == 0) {
            var d = 4
            var p = 0

        } else if (z == 1) {
            var d = 4
            var p = 1

        } else if (z == 2) {
            var d = 4
            var p = 2

        } else if (z == 3) {
            var d = 6
            var p = 0

        } else if (z == 4) {
            var d = 6
            var p = 1

        } else if (z == 5) {
            var d = 6
            var p = 2

        } else if (z == 6) {
            var d = 8
            var p = 0

        } else if (z == 7) {
            var d = 8
            var p = 1

        } else if (z == 8) {
            var d = 8
            var p = 2
        } else if (z == 9) {
            var d = 2
            var p = 2
        } else if (z == 10) {
            var d = 2
            var p = 1
        } else if (z == 11) {
            var d = 2
            var p = 0
        }
        e._direction = d
        e._originalPattern = p
    }
};



SaoLei.prototype.getevent = function(id) {
    this._eventId = id
    this._eventx = $gameMap.event(this._eventId)._x
    this._eventy = $gameMap.event(this._eventId)._y
};
//棋子id x
SaoLei.prototype._idx = function(id) {
        return id % this._x
    }
    //棋子id y
SaoLei.prototype._idy = function(id) {
    return (id - id % this._x) / this._y
}

SaoLei.prototype.makeEvent = function() {
    for (var i = 1; i < this._leiqu.length; i++) {
        var x = this._idx(i)
        var y = this._idy(i)
        SaoLei.copyEvent(this._eventId, i, this._eventx + x, this._eventy + y)
    }
};


SaoLei.prototype.makeSprite = function() {
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

SaoLei.prototype.makeSprite2 = function() {
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


SaoLei.prototype.makenum = function(id) {
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


SaoLei.prototype.isend = function() {
    return this._xianshi.length == this._xsshu
};

SaoLei.prototype.idd = function(id, d) {
    var x = id % this._x
    var y = (id - x) / this._x
    var dn = [0, [-1, 1],
        [0, 1],
        [1, 1],
        [-1, 0], 0, [1, 0],
        [-1, -1],
        [0, -1],
        [1, -1]
    ]
    var xyd = dn[d] || [0, 0]
    var x2 = x + xyd[0]
    var y2 = y + xyd[1]
    if (x2 < 0 || y2 < 0 || x2 >= this._x || y2 >= this._y) {
        return -1
    }
    return y2 * this._x + x2
};

SaoLei.prototype.dianji2 = function(id) {
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

SaoLei.prototype.dianji = function(id) {
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

SaoLei.prototype.dead = function(id) {
    var e = $gameMap.event(id + this._eventId)
    e.requestAnimation(1)
};

SaoLei.prototype.showall = function(id) {
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

SaoLei.prototype.show = function(id) {
    this.setQi(id, 1)
    var num = this.getLeiQu(id)
    this.showleiqu(id, num)
    if (num == 0) {
        for (var d = 1; d < 10; d++) {
            var id2 = this.idd(id, d)
            if (id2 >= 0 && d != 5 && !this._xianshi[id2]) {
                this.show(id2)
                console.log(id2)
            }
        }
    }
};

//复制fid事件到tid x ,y
SaoLei.copyEvent = function(fid, id, x, y) {
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
SaoLei._changeNowMapEvent = function(fid, tid) {
    return SaoLei._addNowMapEvent(fid, tid)
}

//添加当前地图事件
SaoLei._addNowMapEvent = function(fid, tid) {
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
SaoLei.loadDataEvent = function(id) {
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
SaoLei.loadGameEvent = function(id) {
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