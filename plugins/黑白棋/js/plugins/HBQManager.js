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
 * 需要两个事件，
 * 一个电脑操作事件,一个棋子基础事件,
 * 假设前者id为3,则后者应为4,且后面没有其他事件
 * 会自动填充棋盘
 * 
 * 
 *  
*/

 


function HBQManager() {
  throw new Error('This is a static class');
}


HBQManager.ways = [null,]

HBQManager.save = function () {
  if (this.hbq) {
    this.ways.push(this.DeepCopy(this.hbq._way))
    return this.ways.length - 1
  }
  return - 1
}
HBQManager.save = function () {
  if (this.hbq) {
    this.ways.push(this.DeepCopy(this.hbq._way))
    return this.ways.length - 1
  }
  return - 1
}
HBQManager.jxjh = function () { 
  this._jh = 1 - this._jh
  return this._jh
}
//安装
HBQManager.setup = function (id,eventid) {
  //黑白
  this._hb = 1
  //id
  this._id = id || 0
  //交换
  this._jh = 0
  //步数
  this._bs = -1 
  //添加基础棋子 
  this.getevent(eventid) 
  //是否复盘
  if (!this.ways[this._id]) {
    HBQManager.start(8, 8)
  } else {
    HBQManager.startfupan()
  }
};
 
HBQManager.getevent = function (id) { 
  this._eventId = id 
};



//开始
HBQManager.init = function () {
  this.hbq = new Game_HeiBaiQi()
  this.hbq.setqz = function (z, id) {
    var id = id 
    if (id >= 0) {
      this._wzs[id] = z
      id += HBQManager._eventId
      if (z == 1) {
        this.selfSwitch(id, "A", 0)
        this.selfSwitch(id, "B", 1)
        this.selfSwitch(id, "D", 1)
      } else if (z == 2) {
        this.selfSwitch(id, "B", 0)
         this.selfSwitch(id, "A", 1)
         this.selfSwitch(id, "D", 1)
      } else { 
        this.selfSwitch(id, "D", 0)
        this.selfSwitch(id, "B", 1); 
        this.selfSwitch(id, "A", 1)
      }
    }
  }
  this.hbq.makeqp = function () {
    this._wzs = []
    //位置
    for (var hi = 0; hi < this.h; hi++) {
      for (var wi = 0; wi < this.w; wi++) {
        var id = this._xyid(wi,hi) 
        HBQManager.copyEvent(id , wi,hi )
        this.setxyqz(0, wi, hi)
      }
    }
  };  
  $gameMap.requestRefresh()
};

HBQManager.startfupan = function () {
  this.init()
  for (var i = 0; i < this.ways[this._id].length && i <= 4; i++) {
    this._bs++
    this.fp(i)
  }
//初始化位置
  this.initweizhi()
};

HBQManager.start = function (w, h) {
  this.init()
  this.hbq.makehbq(w, h)
  this.hbq.makeinit()
//初始化位置
  this.initweizhi()
};
//初始化位置
HBQManager.initweizhi = function ( ) { 
  var w = Math.floor(this.hbq.w / 2) - 1
  var h = Math.floor(this.hbq.h / 2) - 1
  
  var wz = $gameMap.event(HBQManager._eventId )
  var character = $gamePlayer
  var x0 = wz.x;
  var y0 = wz.y;  
  var x2 = x0 + w  
  var y2 = y0 + h 
  character.locate(x2,y2); 
  var character =  $gameMap.event(HBQManager._eventId-1) 
  var x2 = x0 + w + 1  
  var y2 = y0 + h 
  character.locate(x2,y2);  
 
};

//复盘中 
HBQManager.fupaning = function () {
  if (this.ways[this._id]) {
    this._bs++
    if (this._bs < this.ways[this._id].length) {
      return 1
    }
  }
  return 0
};

//复盘
HBQManager.fp = function () {
  var bushu = this._bs
  var list = this.ways[this._id]
  if (bushu == 0 && list.length >= 1) {
    var bu = list[0]
    this.hbq.fpqp(bu)
    return -2
  }
  if (list[bushu]) {
    var bu = list[bushu]
    this.hbq.fpbu(bu)
    return bu[1]
  }
  return -1
}



//检查 
HBQManager.jiancha = function () {
  var i = this._hb
  var id = this.hbq.celue(i)
  if (id == "game over") {
    return -3
  } else if (id == "no way") {
    return -2
  }
  return id
};
//下一步
HBQManager.next = function () {
  this._hb = 3 - this._hb
  return this._hb
};

//策略
HBQManager.celue = function () {
  var i = this._hb
  var id = this.hbq.celue(i)
  if (id != "game over") {
    if (id != "no way") {
      this.hbq.luoziid(i, id)
    }
  }
  return id
};
//输入
HBQManager.input = function (x, y) {
  var z = this._hb
  var id = -1 
  var ids = $gameMap.eventsXy(x, y)
  for (var i = 0; i < ids.length; i++) {
    id = ids[i].eventId() - this._eventId
    if (id >= 0 && id < this.hbq.w * this.hbq.h) { break }
  }
  return this.hbq.luoziid(z, id)
};



//克隆
HBQManager.DeepCopy = function (that) {
  var that = that
  var obj, i;
  if (typeof (that) === "object") {
    if (that === null) {
      obj = null;
    } else if (Array.isArray(that)) {
      //Object.prototype.toString.call(that) === '[object Array]') { 
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


//黑白棋结果文本
HBQManager.hvsbStrite = function () {
  return this.hbq.hvsbStrite()
};

//黑白棋结果
HBQManager.hvsb = function () {
  return this.hbq.hvsb()
};




//复制fid事件到tid x ,y
HBQManager.copyEvent = function ( tid, x, y) { 
  if(tid>0){
    var fid = this._eventId  
    var tid = fid + tid   
    if (DataManager.isMapLoaded()) {
      var event = HBQManager.loadDataEvent(tid)
      if( event ){  
        var event = HBQManager.loadGameEvent(tid)
        
        var event2 = HBQManager.loadDataEvent(fid)
        var x2 = event2.x + x * 1 
        var y2 = event2.y + y * 1 
        event.locate(x2,y2)  
      }else{ 
        var event = HBQManager.loadNowMapEvent(fid)
        event.id = tid 
        event.x += x * 1
        event.y += y * 1  
        HBQManager._changeNowMapEvent(tid, event ) 
      } 
    }
  } 
}



//改变当前地图id事件为 event (csh 是否重设位置)
HBQManager._changeNowMapEvent = function (id, event) {
  if (event) {  
    $dataMap.events[id] = event; 
    HBQManager._addNowMapEvent(id)
  } 
}



 
//添加当前地图事件
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



//读取当前地图id事件
HBQManager.loadDataEvent = function (id) {
  var event;
  var mapdata = $dataMap
  if (mapdata) {
    var events = mapdata.events
    if (events) {
      var event =  events[id] 
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
      var event =  events[id]
    }
  }
  return event;
}
//读取当前地图id事件
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




























//棋盘的设置
function Game_HeiBaiQi() {
  this.initialize.apply(this, arguments);
}

//初始化
Game_HeiBaiQi.prototype.initialize = function () {
  this.w = 0
  this.h = 0
  this._wzs = []
  this._way = []
};

// Control Self Switch 操作独立开关
Game_HeiBaiQi.prototype.selfSwitch = function (id, p1, p2) {
  //如果(事件id > 0 )
  if (id > 0) {
    //键 = [地图id ,时间id , 参数组[0] ]
    var key = [$gameMap._mapId, id, p1];
    //游戏独立开关组 设置值(键 , 参数组[1] === 0 )
    $gameSelfSwitches.setValue(key, p2 === 0);
  }
};

//初始化
Game_HeiBaiQi.prototype.makehbq = function (w, h) {
  this.makeInfo(w, h)
  this.makeqp()
};

//制作棋盘信息
Game_HeiBaiQi.prototype.makeInfo = function (w, h) {
  //信息 
  this.w = w
  this.h = h
  this._way = []
  this.push([w, h])
}
//制作黑白棋盘
Game_HeiBaiQi.prototype.makeqp = function () {
  this._wzs = []
  //位置  
  for (var hi = 0; hi < this.h; hi++) {
    for (var wi = 0; wi < this.w; wi++) {
      this.setxyqz(0, wi, hi)
    }
  }
};

//制作黑白棋盘初始落子
Game_HeiBaiQi.prototype.makeinit = function () {
  var w = Math.floor(this.w / 2) - 1
  var h = Math.floor(this.h / 2) - 1
  this.luozi(1 + 3, w, h)
  this.luozi(2 + 3, w + 1, h)
  this.luozi(1 + 3, w + 1, h + 1)
  this.luozi(2 + 3, w, h + 1)
};





//克隆 
Game_HeiBaiQi.prototype.clone = function () {
  var q = new Game_HeiBaiQi()
  q.h = this.h
  q.w = this.w
  q._wzs = HBQManager.DeepCopy(this._wzs)
  q._way = HBQManager.DeepCopy(this._way)
  return q
}


//xy棋子
Game_HeiBaiQi.prototype.xyqz = function (x, y) {
  var id = this._xyid(x, y)
  return this.qz(id)
}

//棋子
Game_HeiBaiQi.prototype.qz = function (id) {
  return id < 0 ? -1 : this._wzs[id]
}

//设置棋子值
Game_HeiBaiQi.prototype.setqz = function (z, id) {
  if (id >= 0) {
    this._wzs[id] = z
  }
}

//设置棋子值
Game_HeiBaiQi.prototype.setxyqz = function (z, x, y) {
  var id = this._xyid(x, y)
  this.setqz(z, id)
}

//棋子id
Game_HeiBaiQi.prototype._xyid = function (x, y) {
  if (x < 0 || y < 0 || x >= this.w || y >= this.h) {
    return -1
  }
  return this._makeid(x, y)
}

//制作棋子id
Game_HeiBaiQi.prototype._makeid = function (x, y) {
  return x + y * this.w
}

//棋子id x
Game_HeiBaiQi.prototype._idx = function (id) {
  return id % this.w
}
//棋子id y
Game_HeiBaiQi.prototype._idy = function (id) {
  return (id - id % this.w) / this.w
}

//棋子方向点
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


//棋子线
Game_HeiBaiQi.prototype._xydl = function (x, y, d) {
  var x = x || 0
  var y = y || 0
  var d = d || 0

  var ds = [0, [-1, 1], [0, 1], [1, 1], [-1, 0], 0, [1, 0], [-1, -1], [0, -1], [1, -1]]
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
    //如果 新id 不存在 或原id  跳出
    if (id2 < 0 || id == id2) { break }
    id = id2
  }

  return list
}


//xy棋子线值
Game_HeiBaiQi.prototype._xydlz = function (x, y, d) {
  var linz = this._xydl(x, y, d).map(function (id) {
    return this.qz(id)
  }, this)
  return linz
}

//添加落子
Game_HeiBaiQi.prototype.push = function (l) {
  this._way.push(l)
}

//能落子 方向
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
//能落子
Game_HeiBaiQi.prototype.canluozi = function (i, x, y) {
  var dl = [1, 2, 3, 4, 6, 7, 8, 9]
  var vl = dl.map(function (di) { return this.canlzb(i, x, y, di) }, this)
  var num = vl.reduce(function (r, v) { return r + v }, 0);
  return num
}
//
Game_HeiBaiQi.prototype.canluoziid = function (i, id) {
  return this.canluozi(i, this._idx(id), this._idy(id))
}

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

//检索落子
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
    var v = b[1] - a[1]
    if (v == 0) { return Math.random() - 0.5 }
    return v
  })
  return l
}

//策略
Game_HeiBaiQi.prototype.celue = function (i) {
  var l = this.jsluozi(i)
  var i2 = i == 2 ? 1 : 2
  if (l.length == 0) {
    var l2 = this.jsluozi(i2)
    if (l2.length == 0) {
      return "game over"
    }
    return "no way"
  }
  return l[0][0]
}
//落子 id
Game_HeiBaiQi.prototype.luoziid = function (i, id) {
  return this.luozi(i, this._idx(id), this._idy(id))
}
//落子
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

Game_HeiBaiQi.prototype.luozi0 = function (i, x, y) {
  var dl = [1, 2, 3, 4, 6, 7, 8, 9]
  var list = {}
  dl.forEach(function (d) {
    this.luozid(i, x, y, d)
  }, this)
  this.setxyqz(i, x, y)
}


Game_HeiBaiQi.prototype.luozid = function (i, x, y, d) {
  var l = this._xydl(x, y, d)
  var ll = this.canlzb(i, x, y, d)
  for (var li = 1; li <= ll; li++) {
    this.setqz(i, l[li])
  }
}

Game_HeiBaiQi.prototype.toString = function () {
  var s = ""
  for (var i = 0; i < this.h; i++) {
    var l = this._xydlz(0, i, 6)
    s += l.join(",") + (i == this.h - 1 ? "" : "\n")
  }
  return s
}


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
  return "结果: " + (hb[1] > hb[2] ? "平手":( hb[1] > hb[2] ? "红多" : "蓝多")) + " ;\n" + "红: " + hb[1] + " ; " + "蓝: " + hb[2] + " ;\n" +
    "空: " + hb[0] + " ; " + "全: " + hb[3]
}

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

Game_HeiBaiQi.prototype.test = function () {
  var i = 1
  var id = this.celue(i)
  console.log(this.hvsbStrite())
  while (id != "game over") {
    if (id != "no way") {
      this.luoziid(i, id)
      console.log(this.toString())
      console.log(this.hvsbStrite()) 
    }
    i = 3 - i
    id = this.celue(i)
  }
  console.log(this.toString())
  console.log(this.hvsbStrite())
}




Game_HeiBaiQi.prototype.fpqp = function (bu) {
  if (Array.isArray(bu) && bu.length === 2) {
    var w = bu[0]
    var h = bu[1]
    this.makehbq(w, h)
  }
}
//复盘
Game_HeiBaiQi.prototype.fpbu = function (bu) {
  if (Array.isArray(bu) && bu.length === 2) {
    var i = bu[0]
    var id = bu[1]
    this.luoziid(i, id)
    //console.log(this.toString())
  }
}








