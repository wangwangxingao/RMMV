//=============================================================================
// HBQManager.js
//=============================================================================
/*:
 * @plugindesc 黑白棋
 * @author wangwang
 *
 * @param ver
 * @desc 版本
 * @default 1.0
 *
 * @help
 * 
 * 需要三个事件，
 * 2个操作显示事件,一个棋子基础事件,
 * 事件相邻 
 * 
 * 
 * 
 * 
*/
/*
 
s = new Game_WuZi() 
s.makehbq(15,15)
s.test(1,100)
*/


function HBQManager() {
    throw new Error('This is a static class');
}


HBQManager._fpdatas = {}
HBQManager.clear = function (type) {
    if (type) {
        delete HBQManager._fpdatas[type]
    } else {
        HBQManager._fpdatas = {}
    }
}


/**复盘数据 */
HBQManager.fpdata = function (type) {
    if (!this._fpdatas[type]) {
        this._fpdatas[type] = [null,]
    }
    return this._fpdatas[this._fpid]
}

HBQManager.save = function () {
    if (this.hbq) {
        var type = this.hbq.type
        if (!this._fpdatas[type]) {
            this._fpdatas[type] = [null,]
        }
        this._fpdatas[type].push(this.DeepCopy(this.hbq._way))
        return this._fpdatas[type].length - 1
    }
    return - 1
}

/**保存 
HBQManager.save = function () {
    if (this.hbq) {
        this._fpdatas.push(this.DeepCopy(this.hbq._way))
        return this._fpdatas.length - 1
    }
    return - 1
}
*/

//安装
HBQManager.setup = function (fpid, eventid, type, set) {

    var type = type || "wzq"
    //黑白
    this._hb = 1
    //id
    this._fpid = fpid || 0

    //步数
    this._bs = -1
    //添加基础棋子 
    this.getevent(eventid)
    //是否复盘
    if (!this.fpdata()) {
        HBQManager.start(type, set)
    } else {
        HBQManager.startfupan(type)
    }
};

HBQManager.getevent = function (id) {
    this._eventId = id + 1
};

HBQManager.swap = function () {
    /*var c = this.p1()
    var c2 = this.p2()
    c2.swap(c)*/
    /*var n1 = $gamePlayer._characterName;
    var n2 = $gamePlayer._characterIndex;
    $gamePlayer.setImage(c._characterName, c._characterIndex)*/
    //c.setImage(n1, n2) 
}

HBQManager.isHb = function () {
    return this._hb
}

HBQManager.np = function () {
    this.p(this._hb)
}

HBQManager.p = function (v) {
    if (v > 0) {
        return $gameMap.event(this._eventId - v)
    }
    return false
}

HBQManager.npId = function (v) { 
    return this.pId(this._hb)
}

HBQManager.pId = function (v) {
    if (v > 0) {
        return  this._eventId - v 
    }
    return false
}

HBQManager.eId = function (v) {
    if (v >= 0) {
        return  v + this._eventId 
    }
}

HBQManager.e = function (v) {
    if (v >= 0) {
        return $gameMap.event(v + this._eventId)
    }
}

HBQManager.wz = function (v) {
    return this.e(v)
}



HBQManager.wzxy = function (x, y) {
    var wz = this.wz(0)
    var x = Math.floor(x - wz.x)
    var y = Math.floor(y - wz.y)
    return [x, y]
}


HBQManager.pto = function (p, v) {
    var c = this.p(p)
    if (c) {
        var wz = this.wz(v)
        if (wz) {
            var x = wz.x - c.x
            var y = wz.y - c.y
        } else {
            var x = 0
            var y = 0
        }
        c.setPosition(x, y);
        //c.jump(x, y);
    }
}



HBQManager.npto = function (v) {
    HBQManager.pto(this._hb, v)
}


/**独立开关 */
HBQManager.selfSwitch = function (id, p1, p2) {
    if (id > 0) {
        var key = [$gameMap._mapId, id, p1];
        $gameSelfSwitches.setValue(key, p2 === 1);
    }
};


/**设置棋子 */
HBQManager.setqz = function (hbq, z, id) {
    if (!this.isNowGame(hbq)) { return }
    var id = id
    if (id >= 0) {
        id += HBQManager._eventId
        if (z == 1) {
            this.selfSwitch(id, "A", 1)
            this.selfSwitch(id, "B", 0)
            this.selfSwitch(id, "D", 0)
        } else if (z == 2) {
            this.selfSwitch(id, "B", 1)
            this.selfSwitch(id, "A", 0)
            this.selfSwitch(id, "D", 0)
        } else {
            //空白
            this.selfSwitch(id, "D", 1)
            this.selfSwitch(id, "B", 0);
            this.selfSwitch(id, "A", 0)
        }
    }
}
/**制作棋盘 */
HBQManager.makeqp = function (hbq) {
    if (!HBQManager.isNowGame(hbq)) { return }
    //位置
    for (var hi = 0; hi < hbq.h; hi++) {
        for (var wi = 0; wi < hbq.w; wi++) {
            var id = hbq._xyid(wi, hi)
            HBQManager.copyEvent(id, wi, hi)
        }
    }
};

/**是现在的游戏 */
HBQManager.isNowGame = function (hbq) {
    return this.hbq == hbq
};


/**初始化安装 */
HBQManager.init = function (type) {
    if (type == "wzq") {
        this.hbq = new Game_WuZi()
    } else {
        this.hbq = new Game_HeiBaiQi()
    }
    $gameMap.requestRefresh()
};


/**开始 */
HBQManager.start = function (type, set) {
    this.init(type)
    this.hbq.makehbq(set)
    this.hbq.makeinit()
    //初始化位置
    this.hbq.initweizhi()
};




/**开始复盘 */
HBQManager.startfupan = function (type) {
    this.init(type)
    var fpdata = this.fpdata()
    this._bs = this.hbq.fpstart(fpdata, -1)
    //初始化位置
    this.initweizhi()
};


//复盘中 
HBQManager.fupaning = function () {
    var fpdata = this.fpdata()
    if (fpdata) {
        if (this._bs < fpdata.length) {
            return 1
        }
    }
    return 0
};

//复盘
HBQManager.fp = function () {
    return this.hbq.fp(this.fpdata(), this._bs++)
}


HBQManager.jiancha = function () {
    return this.celue()
};
//检查 
HBQManager.celue = function () {
    var i = this._hb
    var id = this.hbq.celue(i)
    return id
};
/**下一步 */
HBQManager.next = function () {
    this._hb = 3 - this._hb
    return this._hb
};

/**
 * 策略计算
 * */
HBQManager.celueInput = function () {
    var id = this.celue()
    if (id != -3) {
        if (id != -2) {
            this.hbq.luoziid(this._hb, id)
        }
    }
    return id
};

/**输入*/
HBQManager.input = function (x, y) {
    var z = this._hb
    var xy = this.wzxy(x, y)
    return this.hbq.luozi(z, xy[0], xy[1])
};
HBQManager.destinationInput = function () {
    if ($gameTemp.isDestinationValid()) {
        var x = $gameTemp._destinationX
        var y = $gameTemp._destinationY
        return this.input(x, y)
    }
}

/**触摸位置输入 */
HBQManager.touchInput = function () {
    var x = $gameMap.canvasToMapX(TouchInput.x)
    var y = $gameMap.canvasToMapY(TouchInput.y)
    return this.input(x, y)
};

/**角色位置输入 */
HBQManager.palyerInput = function () {
    return this.input($gamePlayer.x, $gamePlayer.y)
};

/**克隆*/
HBQManager.DeepCopy = function (that) {
    var that = that
    var obj, i;
    if (typeof (that) === "object") {
        if (that === null) {
            obj = null;
        } else if (Array.isArray(that)) {
            /**Object.prototype.toString.call(that) === '[object Array]') { */
            obj = [];
            for (var i = 0; i < that.length; i++) {
                obj.push(HBQManager.DeepCopy(that[i]));
            }
        } else {
            obj = {}
            for (i in that) {
                obj[i] = HBQManager.DeepCopy(that[i])
            }
        }
    } else {
        obj = that
    }
    return obj;
};


/**黑白棋结果文本*/
HBQManager.hvsbStrite = function () {
    return this.hbq.hvsbStrite()
};

/**黑白棋结果*/
HBQManager.hvsb = function () {
    return this.hbq.hvsb()
};


/**复制fid事件到tid x ,y*/
HBQManager.copyEvent = function (tid, x, y) {
    if (tid > 0) {
        var fid = this._eventId
        var tid = fid + tid
        if (DataManager.isMapLoaded()) {
            var event = HBQManager.loadDataEvent(tid)
            if (event) {
                var event = HBQManager.loadGameEvent(tid)
                var event2 = HBQManager.loadDataEvent(fid)
                var x2 = event2.x + x * 1
                var y2 = event2.y + y * 1
                event.locate(x2, y2)
            } else {
                var event = HBQManager.loadNowMapEvent(fid)
                event.id = tid
                event.x += x * 1
                event.y += y * 1
                HBQManager._changeNowMapEvent(tid, event)
            }
        }
    }
}



/**改变当前地图id事件为 event (csh 是否重设位置)*/
HBQManager._changeNowMapEvent = function (id, event) {
    if (event) {
        $dataMap.events[id] = event;
        HBQManager._addNowMapEvent(id)
    }
}




/**添加当前地图事件*/
HBQManager._addNowMapEvent = function (id) {
    if ($dataMap.events[id]) {
        $gameMap._events[id] = new Game_Event($gameMap.mapId(), id)
        if (SceneManager && SceneManager._scene && SceneManager._scene.constructor == Scene_Map) {
            if (SceneManager._scene._spriteset && SceneManager._scene._spriteset._characterSprites) {
                var spriteset = SceneManager._scene._spriteset
                var characterSprites = SceneManager._scene._spriteset._characterSprites
                var c = new Sprite_Character($gameMap._events[id])
                characterSprites.push(c)
                spriteset._tilemap.addChild(c);
            }
        }
    }
}

HBQManager.clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
}



/**读取当前地图id事件*/
HBQManager.loadDataEvent = function (id) {
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
HBQManager.loadGameEvent = function (id) {
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
/**读取当前地图id事件*/
HBQManager.loadNowMapEvent = function (id) {
    var event;
    var mapdata = $dataMap
    if (mapdata) {
        var events = mapdata.events
        if (events) {
            var event = HBQManager.clone(events[id])
        }
    }
    return event;
}









/**棋盘的设置*/
function Game_HeiBaiQi() {
    this.initialize.apply(this, arguments);
}

/**初始化*/
Game_HeiBaiQi.prototype.initialize = function () {
    this.type = "hbq"
    this.w = 0
    this.h = 0
    this._wzs = []
    this._way = []
};


/**初始化*/
Game_HeiBaiQi.prototype.makehbq = function (set) {
    var set = set || [8, 8]
    var w = set[0] || 8
    var h = set[1] || 8
    this.makeInfo(w, h)
    this.makeqp()
};

/**
 * 制作棋盘信息
 * 
*/
Game_HeiBaiQi.prototype.makeInfo = function (w, h) {
    this.w = w
    this.h = h
    this._way = []
    this.push([w, h])
}

/**
 * 制作黑白棋盘 
*/
Game_HeiBaiQi.prototype.makeqp = function () {
    HBQManager.makeqp(this)
    this._wzs = []
    for (var hi = 0; hi < this.h; hi++) {
        for (var wi = 0; wi < this.w; wi++) {
            this.setxyqz(0, wi, hi)
        }
    }
};

/**制作黑白棋盘初始落子*/
Game_HeiBaiQi.prototype.makeinit = function () {
    var w = Math.floor(this.w / 2) - 1
    var h = Math.floor(this.h / 2) - 1
    this.luozi(1 + 3, w, h)
    this.luozi(2 + 3, w + 1, h)
    this.luozi(1 + 3, w + 1, h + 1)
    this.luozi(2 + 3, w, h + 1)
};


/**初始化位置 */
Game_HeiBaiQi.prototype.initweizhi = function () {
    if (!HBQManager.isNowGame(this)) { return }
    var w = Math.floor(this.w / 2) - 1
    var h = Math.floor(this.h / 2) - 1

    var wz = HBQManager.e(0)
    //第一个事件
    var character = HBQManager.p(1)
    var x0 = wz.x;
    var y0 = wz.y;
    var x2 = x0 + w
    var y2 = y0 + h
    character.locate(x2, y2);
    //第二个事件
    var character = HBQManager.p(2)
    var x2 = x0 + w + 1
    var y2 = y0 + h
    character.locate(x2, y2);
};






/**克隆 */
Game_HeiBaiQi.prototype.clone = function () {
    var q = new Game_HeiBaiQi()
    q.h = this.h
    q.w = this.w
    q._wzs = HBQManager.DeepCopy(this._wzs)
    q._way = HBQManager.DeepCopy(this._way)
    return q
}


/**xy棋子*/
Game_HeiBaiQi.prototype.xyqz = function (x, y) {
    var id = this._xyid(x, y)
    return this.qz(id)
}

/**棋子*/
Game_HeiBaiQi.prototype.qz = function (id) {
    return id < 0 ? -1 : this._wzs[id]
}

/**
 * 设置棋子值
 * 
*/
Game_HeiBaiQi.prototype.setqz = function (z, id) {
    if (id >= 0) {
        this._wzs[id] = z
    }
    HBQManager.setqz(this, z, id)
}

/**设置棋子值*/
Game_HeiBaiQi.prototype.setxyqz = function (z, x, y) {
    var id = this._xyid(x, y)
    this.setqz(z, id)
}


Game_HeiBaiQi.prototype.xyout = function (x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) {
        return true
    }
    return false
}

/**棋子id*/
Game_HeiBaiQi.prototype._xyid = function (x, y) {
    if (this.xyout(x, y)) {
        return -1
    }
    return this._makeid(x, y)
}

/**制作棋子id*/
Game_HeiBaiQi.prototype._makeid = function (x, y) {
    return x + y * this.w
}

/**棋子id x*/
Game_HeiBaiQi.prototype._idx = function (id) {
    return id % this.w
}
/**棋子id y*/
Game_HeiBaiQi.prototype._idy = function (id) {
    return (id - id % this.w) / this.w
}

/**棋子方向点*/
Game_HeiBaiQi.prototype._xydid = function (x, y, d) {
    var x = x || 0
    var y = y || 0
    var d = d || 0
    var ds = [0, [-1, 1], [0, 1], [1, 1], [-1, 0], 0, [1, 0], [-1, -1], [0, -1], [1, -1]]
    var xyd = ds[d] || [0, 0]
    var xd = xyd[0] || 0
    var yd = xyd[1] || 0
    var xi = x + xd
    var yi = y + yd
    return this._xyid(xi, yi)
}

Game_HeiBaiQi.ds = [0, [-1, 1], [0, 1], [1, 1], [-1, 0], 0, [1, 0], [-1, -1], [0, -1], [1, -1]]

Game_HeiBaiQi.dl = [1, 2, 3, 4, 6, 7, 8, 9]

/**
 * 棋子线
 * 
*/
Game_HeiBaiQi.prototype._xydl = function (x, y, d) {
    var x = x || 0
    var y = y || 0
    var d = d || 0

    var ds = Game_HeiBaiQi.ds
    var xyd = ds[d] || [0, 0]

    var list = []

    var xd = xyd[0] || 0
    var yd = xyd[1] || 0
    var xi = x
    var yi = y

    var id = this._xyid(xi, yi)

    while (id >= 0) {
        list.push(id)
        xi += xd
        yi += yd
        var id2 = this._xyid(xi, yi)
        //如果 新id 不存在 或原id    跳出 
        if (id2 < 0 || id == id2) { break }
        id = id2
    }

    return list
}


/**xy棋子线值*/
Game_HeiBaiQi.prototype._xydlz = function (x, y, d) {
    var linz = this._xydl(x, y, d).map(function (id) {
        return this.qz(id)
    }, this)
    return linz
}

/**添加落子*/
Game_HeiBaiQi.prototype.push = function (l) {
    this._way.push(l)
}

/**能落子 方向*/
Game_HeiBaiQi.prototype.canlzb = function (i, x, y, d) {
    var lin = this._xydlz(x, y, d)
    var v = 0
    for (var lini = 0, linl = lin.length; lini < linl; lini++) {
        var z = lin[lini]
        if (lini == 0) {
            if (z != 0) { break }
        } else {
            if (z == i) {
                return v
            } else if (z == 0) {
                return 0
            } else {
                v++
            }
        }
    }
    return 0
}
/**
 * 能落子
 * 
*/
Game_HeiBaiQi.prototype.canluozi = function (i, x, y) {
    var dl = Game_HeiBaiQi.dl
    var vl = dl.map(function (di) { return this.canlzb(i, x, y, di) }, this)
    var num = vl.reduce(function (r, v) { return r + v }, 0);
    return num
}

/**能落子于id*/
Game_HeiBaiQi.prototype.canluoziid = function (i, id) {
    return this.canluozi(i, this._idx(id), this._idy(id))
}

/**
 * 计算落子 
 * 
*/
Game_HeiBaiQi.prototype.evluozi = function (i, x, y) {
    var v = this.canluozi(i, x, y)
    if (v == 0) { return 0 }
    var w = this.w
    var h = this.h
    if ((x == 0 && y == 0) || (x == w - 1 && y == h - 1) || (x == 0 && y == h - 1) || (x == w - 1 && y == 0)) {
        var z = w * h * 5
        return v + z
    }
    if ((x == 0 + 1 && y == 0 + 1) || (x == w - 1 - 1 && y == h - 1 - 1) || (x == 0 + 1 && y == h - 1 - 1) || (x == w - 1 - 1 && y == 0 + 1)) {
        var z = w * h * 1
        return v + z
    }
    if ((x == 0 + 1 && y == 0) || (x == w - 1 - 1 && y == h - 1) || (x == 0 + 1 && y == h - 1) || (x == w - 1 - 1 && y == 0) ||
        (x == 0 && y == 0 + 1) || (x == w - 1 && y == h - 1 - 1) || (x == 0 && y == h - 1 - 1) || (x == w - 1 && y == 0 + 1)) {
        var z = w * h * 2
        return v + z
    }
    if ((y == 0) || (x == w - 1) || (y == h - 1) || (y == 0)) {
        var z = w * h * 4
        return v + z
    }
    var z = w * h * 3
    return v + z
}

/**检索落子
 * 计算落子的值
*/
Game_HeiBaiQi.prototype.jsluozi = function (i) {
    var l = []
    for (var hi = 0; hi < this.h; hi++) {
        for (var wi = 0; wi < this.w; wi++) {
            var v = this.evluozi(i, wi, hi)
            if (v != 0) {
                l.push([this._xyid(wi, hi), v])
            }
        }
    }
    if (l.length < 2) { return l }
    l.sort(function (a, b) {
        return b[1] - a[1] || Math.random() - 0.5
    })
    return l
}

/**策略
 * @param {1|2} i p1 / p2
 * @return {}
*/
Game_HeiBaiQi.prototype.celue = function (i) {
    var l = this.jsluozi(i)
    var i2 = i == 2 ? 1 : 2
    if (l.length == 0) {
        //另一个人进行判断
        var l2 = this.jsluozi(i2)
        //另一个人也不能走
        if (l2.length == 0) {
            //游戏结束
            return -3
        }
        //不能走
        return -2
    }
    //返回 计算 id 
    return l[0][0]
}

/**落子 id*/
Game_HeiBaiQi.prototype.luoziid = function (i, id) {

    return this.luozi(i, this._idx(id), this._idy(id))
}

/**落子
 * @param {0|1|2|3|4|5} i 角色    
 * 0 空     
 * 1 1号    
 * 2 2号    
 * 3 初始 空    
 * 4 初始用 1号    
 * 5 初始用 2号    
 * @param {number} x x坐标    
 * @param {number} y y坐标    
*/
Game_HeiBaiQi.prototype.luozi = function (i, x, y) {
    var i = i
    var cs = false
    if (i > 2) {
        i -= 3
        cs = true
    }
    var id = this._xyid(x, y)
    if (cs) {
        this.push([i + 3, id])
        this.setxyqz(i, x, y)
        return id
    } else if (this.canluozi(i, x, y) > 0) {
        this.push([i, id])
        this.luozi0(i, x, y)
        return id
    }
    return -1
}
/**落子0 */
Game_HeiBaiQi.prototype.luozi0 = function (i, x, y) {
    var dl = [1, 2, 3, 4, 6, 7, 8, 9]
    var list = {}
    dl.forEach(function (d) {
        this.luozid(i, x, y, d)
    }, this)
    this.setxyqz(i, x, y)
}

/**落子方向 */
Game_HeiBaiQi.prototype.luozid = function (i, x, y, d) {
    var l = this._xydl(x, y, d)
    var ll = this.canlzb(i, x, y, d)
    for (var li = 1; li <= ll; li++) {
        this.setqz(i, l[li])
    }
}
/**转化字符串 */
Game_HeiBaiQi.prototype.toString = function () {
    var s = ""
    for (var i = 0; i < this.h; i++) {
        var l = this._xydlz(0, i, 6)
        s += l.join(",") + (i == this.h - 1 ? "" : "\n")
    }
    return s
}

/**胜负字符串 */
Game_HeiBaiQi.prototype.hvsbStrite = function () {
    var hb = [0, 0, 0, 0]
    for (var hi = 0; hi < this.h; hi++) {
        for (var wi = 0; wi < this.w; wi++) {
            var l = this.xyqz(wi, hi)
            hb[l]++
            if (l > 0) {
                hb[3]++
            }
        }
    }
    return "结果: " + (hb[1] == hb[2] ? "平手" : (hb[1] > hb[2] ? "红多" : "蓝多")) + " ;\n" + "红: " + hb[1] + " ; " + "蓝: " + hb[2] + " ;\n" +
        "空: " + hb[0] + " ; " + "全: " + hb[3]
}

/**计算输赢 */
Game_HeiBaiQi.prototype.hvsb = function () {
    var hb = [0, 0, 0, 0]
    for (var hi = 0; hi < this.h; hi++) {
        for (var wi = 0; wi < this.w; wi++) {
            var l = this.xyqz(wi, hi)
            hb[l]++
            if (l > 0) {
                hb[3]++
            }
        }
    }
    return (hb[1] == hb[2] ? 1.5 : hb[1] > hb[2] ? 1 : 2)
}
/**转化为字符串2 */
Game_HeiBaiQi.prototype.toString2 = function (v) {
    var s = ""
    for (var hi = 0; hi < this.h; hi++) {
        for (var wi = 0; wi < this.w; wi++) {
            var l = this.canluozi(v, wi, hi)
            s += l + ","
        }
        s += "\n"
    }
    return s
}

/**测试 */
Game_HeiBaiQi.prototype.test = function (i, t) {
    var t = t || 1000
    var i = i || 1
    var id = this.celue(i)
    console.log(this.hvsbStrite())
    if (id != -3) {
        if (id != -2) {
            this.luoziid(i, id)
            console.log(this.toString())
            console.log(this.hvsbStrite())
        }
        i = 3 - i
        setTimeout(this.test.bind(this, i, t), t)
    } else {
        console.log(this.toString())
        console.log(this.hvsbStrite())
    }
}

/**
 * 
 * 复盘处理
 *    
 * 
 */

Game_HeiBaiQi.prototype.fpstart = function (fpdata, bs) {
    var bs = bs
    for (var i = 0; i < fpdata.length && i <= 4; i++) {
        bs++
        this.fp(fpdata, i)
    }
    bs++
    return bs
}


/**
 * 复盘
 */
Game_HeiBaiQi.prototype.fp = function (fpdata, bs) {
    var bushu = bs
    bs++
    //步数等于0 
    if (bushu == 0 && fpdata.length >= 1) {
        var bu = fpdata[bushu]
        this.fpqp(bu)
        return -2
    }
    //如果有步数,返回结果
    if (fpdata[bushu]) {
        var bu = fpdata[bushu]
        this.fpbu(bu)
        return bu[1]
    }
    return -1
}

/**
 * 复盘棋盘
 * 
 */
Game_HeiBaiQi.prototype.fpqp = function (bu) {
    if (Array.isArray(bu) && bu.length === 2) {
        var w = bu[0]
        var h = bu[1]
        this.makehbq(w, h)
    }
}

/**
 * 复盘一步
 * 
*/
Game_HeiBaiQi.prototype.fpbu = function (bu) {
    if (Array.isArray(bu) && bu.length === 2) {
        var i = bu[0]
        var id = bu[1]
        this.luoziid(i, id)
        //console.log(this.toString()) 
    }
}












function Game_WuZi() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Game_WuZi.prototype = Object.create(Game_HeiBaiQi.prototype);
/**设置创造者 */
Game_WuZi.prototype.constructor = Game_WuZi;

Game_WuZi.prototype.initialize = function () {
    Game_HeiBaiQi.prototype.initialize.call(this)
    this.type = "wzq"
    this.over = false
    this._wzs2 = [[], [], []]
};

Game_WuZi.celueType = 0
Game_WuZi.c1 = [5, 220, 4200, 22000, 200000]
Game_WuZi.c2 = [2, 200, 4000, 20000, 100000]

/**初始化*/
Game_WuZi.prototype.makehbq = function (set) {
    //var set = set || [15, 15]
    var set = set || [8, 8]
    var w = set[0] || 8
    var h = set[1] || 8
    this.makeInfo(w, h)
    this.makeqp()
};

/**
 * 制作棋盘信息
 * 
*/
Game_WuZi.prototype.makeInfo = function (w, h) {
    this.w = w
    this.h = h
    this._way = []
    this.push([w, h])
}

/**
 * 制作五子棋棋盘 
*/
Game_WuZi.prototype.makeqp = function () {
    HBQManager.makeqp(this)
    this._wzs = []
    for (var hi = 0; hi < this.h; hi++) {
        for (var wi = 0; wi < this.w; wi++) {
            this.setxyqz(0, wi, hi)
        }
    }
    this.initWins(this.w, this.h)
    this._wzs2 = [[], [], []]
    for (var i = 0; i < Game_WuZi._count; i++) {
        this._wzs2[1][i] = 0;
        this._wzs2[2][i] = 0;
    }
};

/**制作五子棋棋盘初始落子*/
Game_WuZi.prototype.makeinit = function () {
};


/**初始化位置 */
Game_WuZi.prototype.initweizhi = function () {
    if (!HBQManager.isNowGame(this)) { return }
    var w = Math.floor(this.w / 2) - 1
    var h = Math.floor(this.h / 2) - 1
    var wz = HBQManager.e(0)
    //第一个事件
    var character = HBQManager.p(1)
    var x0 = wz.x;
    var y0 = wz.y;
    var x2 = x0 + w
    var y2 = y0 + h
    character.locate(x2, y2);
    //第二个事件
    var character = HBQManager.p(2)
    var x2 = x0 + w + 1
    var y2 = y0 + h
    character.locate(x2, y2);
};



/**设置棋子 */
Game_WuZi.prototype.setqz = function (z, id) {
    if (id >= 0) {
        if (z >= 0 && z <= 2) {
            this.evalsetqz(z, id)
        }
        this._wzs[id] = z
    }
    HBQManager.setqz(this, z, id)
}


Game_WuZi.prototype.canluozi = function (i, x, y) {
    var qz = this.xyqz(x, y)
    return qz == 0 ? 1 : 0
}



Game_WuZi.prototype.luozi = function (i, x, y) {
    var i = i
    var cs = false
    if (i > 2) {
        i -= 3
        cs = true
    }
    var id = this._xyid(x, y)
    if (cs) {
        this.push([i + 3, id])
        this.setxyqz(i, x, y)
        return id
    } else if (this.canluozi(i, x, y)) {
        this.push([i, id])
        this.setxyqz(i, x, y)
        return id
    }
    return -1
}

/**
 * 计算落子
 */
Game_WuZi.prototype.evalluozi = function (i, id) {
    var sc
    if (i != 1 && i != 2) {
        return sc
    }
    var i2 = i == 1 ? 2 : 1
    var z = this.qz(id)
    var wins = Game_WuZi._wins
    var win = this._wzs2
    var re
    if (this.qz(id) == 0) {
        var c1 = Game_WuZi.c1
        var c2 = Game_WuZi.c2
        var sc = [id, 0, 0, {}, {}, {}, {}]
        if (wins[id]) {
            for (var k in wins[id]) {
                var z = win[i][k] || 0
                var z2 = win[i2][k] || 0
                sc[1] += c1[z] || 0
                sc[2] += c2[z2] || 0
                sc[3][z] = (sc[3][z] || 0) + 1
                sc[4][z2] = (sc[4][z2] || 0) + 1
                sc[5][k] = z
                sc[6][k] = z2
                re = sc
            }
        }
    }
    return re
}


Game_WuZi.prototype.evalsetqz = function (i, id) {
    if (i != 1 && i != 2 && i != 0) {
        return
    }
    var z = this.qz(id)
    var wins = Game_WuZi._wins
    var count = Game_WuZi._count
    var win = this._wzs2
    if (z == 0 && (i == 1 || i == 2)) {
        var i2 = i == 1 ? 2 : 1
        if (wins[id]) {
            for (var k in wins[id]) {
                win[i][k]++; //我方胜算统计增加
                win[i2][k] += 6;  //计算机在这种赢法就不可能赢，设置一个异常的值6
                //说明黑棋已经赢了
                if (win[i][k] == 5) {
                    this.over = i2;
                }
            }
        } else {
            if (z) {
                var i = z
                var i2 = z == 1 ? 2 : 1
                for (var k = 0; k < count; k++) {
                    if (wins[id][k]) {
                        if (win[i][k]) {
                            win[i][k]--;
                        }
                        if (win[i2][k]) {
                            win[i2][k] -= 6;
                        }
                    }
                }
            }
        }
    }
}



Game_WuZi.prototype.evalOver = function () {
    var count = Game_WuZi._count
    var win = this._wzs2
    for (var k = 0; k < count; k++) {
        //如果为true说明我们在K种赢法上面胜算大了一步
        if (win[1][k] == 5) {
            this.overId =  Game_WuZi._countset[k][0] 
            this.overType = Game_WuZi._countset[k][1] 
            return this.over = 1
        }
        if (win[2][k] == 5) {
            this.overId = Game_WuZi._countset[k][0] 
            this.overType = Game_WuZi._countset[k][1]
            return this.over = 2
        }
    }
    this.over = 0
    return this.over
}



//计算机AI下棋
Game_WuZi.prototype.jsluozi = function (i) {
    var l = []
    for (var id = 0; id < this.w * this.h; id++) {
        var sc = this.evalluozi(i, id)
        if (sc) {
            l.push(sc)
        }
    }
    if (l.length < 2) { return l }
    l.sort(function (a, b) {
        return Math.max(b[1], b[2]) - Math.max(a[1], a[2]) || Math.random() - 0.5
    })
    return l
}


Game_WuZi.prototype.sort = function (a, b) {
    for (var i = 4; i >= 0; i--) {
        var u = 3
        var uz = a[u][i] || 0
        var nz = b[u][i] || 0
        var z = nz - uz
        if (z) {
            return z
        }
        var u = 4
        var uz = a[u][i] || 0
        var nz = b[u][i] || 0
        var z = nz - uz
        if (z) {
            return z
        }
    }
    return Math.random() - 0.5
}


Game_WuZi.prototype.celue = function (i) {
    if (Game_WuZi.celueType) {
        return this.celue1(i) 
    } else {
        return this.celue0(i)
    }
}
Game_WuZi.prototype.celue1 = function (i) {
    var l = this.jsluozi(i)
    console.log(l.length, l)
    var i2 = i == 2 ? 1 : 2
    //一个人无路可走 (实际上即两个人无路可走)
    if (l.length == 0) {
        //平局
        this.over = 1.5
        //游戏结束
        return -3
    } else {
        //下了也白下
        if (l[0][1] == 0 && l[0][2] == 0) {
            this.over = 1.5
            return -3
        }
        //下一个子为胜利
        if (l[0][3][4]) {
            //我方胜利
            this.over = i
            return -3
        }
        //我方无胜利可能,对方两个胜利可能
        if (l.length >= 2 && l[0][4][4] && l[1][4][4]) {
            this.over = i2
            return -3
        }
        //返回 最佳id
        return l[0][0]
    }
}

Game_WuZi.prototype.celue0 = function (i) {

    if (this.evalOver()) {
        return -3
    }

    var l = this.jsluozi(i)
    var i2 = i == 2 ? 1 : 2
    //一个人无路可走 (实际上即两个人无路可走)
    if (l.length == 0) {
        //平局
        this.over = 1.5
        //游戏结束
        return -3
    } else {
        //返回 最佳id
        return l[0][0]
    }
}
Game_WuZi.prototype.hvsb = function () {
    return this.over
}

 

Game_WuZi.prototype.hvsbStrite = function () {
    return "结果: " + (this.over == 1.5 ? "平手" : (this.over == 1 ? "1胜" : "2胜"))
}


Game_WuZi.prototype.test = function (i, t) {
    var t = t || 1000
    var i = i || 1
    var id = this.celue(i)
    //console.log(this.hvsbStrite())
    if (id != -3) {
        if (id != -2) {
            this.luoziid(i, id)
            console.log(i, id)
            console.log(this.toString())
            //console.log(this.hvsbStrite())
        }
        i = 3 - i
        setTimeout(this.test.bind(this, i, t), t)
    } else {
        console.log(this.toString())
        console.log(this.hvsbStrite())
    }
}




Game_WuZi._wins = []
Game_WuZi._w = 0
Game_WuZi._h = 0
Game_WuZi._count = 0
Game_WuZi.prototype.initWins = function (w, h) {
    if (w == Game_WuZi._w && h == Game_WuZi._h) {
        var count = Game_WuZi._count
        /** 赢法统计数组初始化结束 **/
        console.log("五子棋 " + w + " x " + h + "一共有 " + count + "种赢法");     //打印日志
        return
    }

    var wins = [];  //赢法数组      [x][y][k]   x y 代表棋盘上的一个点 k代表第几种赢法 
    var count = 0;      //代表有多少种赢法 
    var countset = []
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            var id = this._xyid(x, y)
            wins[id] = {};
        }
    }
    //横排的赢法
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h - 4; y++) {
            for (var k = 0; k < 5; k++) {
                var id = this._xyid(x, y + k)
                wins[id][count] = true;
            }
            countset[count] = [this._xyid(x, y), 0]
            count++;
        }
    }
    //竖排的赢法
    for (var x = 0; x < w - 4; x++) {
        for (var y = 0; y < h; y++) {
            for (var k = 0; k < 5; k++) {
                var id = this._xyid(x + k, y)
                wins[id][count] = true;
            }
            countset[count] = [this._xyid(x, y), 1]
            count++;
        }
    }

    //正斜线的赢法
    for (var x = 0; x < w - 4; x++) {
        for (var y = 0; y < h - 4; y++) {
            for (var k = 0; k < 5; k++) {
                var id = this._xyid(x + k, y + k)
                wins[id][count] = true;
            }
            countset[count] = [this._xyid(x, y), 2]
            count++;
        }
    }

    //反斜线的赢法
    for (var x = 0; x < w - 4; x++) {
        for (var y = h - 1; y > 3; y--) {
            for (var k = 0; k < 5; k++) {
                var id = this._xyid(x + k, y - k)
                wins[id][count] = true;
            }
            countset[count] = [this._xyid(x, y), 3]
            count++;
        }
    }

    /** 赢法统计数组初始化结束 **/
    console.log("五子棋 " + w + " x " + h + "一共有 " + count + "种赢法");     //打印日志
    Game_WuZi._count = count
    Game_WuZi._countset = countset
    Game_WuZi._wins = wins
}
