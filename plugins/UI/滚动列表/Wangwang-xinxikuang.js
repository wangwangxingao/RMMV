//=============================================================================
// ww_xixi.js
//=============================================================================

/*:
 * @plugindesc 信息框基础
 * @author 汪汪
 * @version 2.0
 * 
 * 
 * @param ww_xinxi 
 * @desc   信息框基础
 * @default 1.0
 * 
 *  
 * @param saveid 
 * @desc   信息框数据保存的位置,默认100号变量
 * @default 100
 * 
 * @param savesize
 * @desc   信息框数据保存数量
 * @default 50
 *  
 * 
 * @help  
 * 
 * 获取 id 窗口 
 * ww.xinxi.get(id)   
 * 
 * 设置 id 窗口 
 * ww.xinxi.get(id,obj)  
 *  
 * 删除 id 窗口
 * ww.xinxi.del(id)
 * 
 * 清空 id 窗口
 * ww.xinxi.clear(id)
 * 
 * 刷新 id 窗口
 * ww.xinxi.refresh(id)
 * 
 * 显示 id 窗口
 * ww.xinxi.show(id)
 * 
 * 隐藏 id 窗口
 * ww.xinxi.hide(id)
 * 
 * 判断是否 id 窗口显示中
 * ww.xinxi.isshow(id)
 *  
 * 
 * =========== 
 * 窗口参数设置
 * =========== 
 * 
 * 获取窗口 1
 * s = ww.xinxi.set(1)  
 * 设置参数  
 * type 种类 默认为"text" 信息框 ,根据该值设置不同窗口
 * w : 200  显示内容宽
 * h : 300  显示内容高
 *  
 * cclick 清除键调用的公共事件  为0则为默认设置 公共事件最好不要有等待等效果,为并行
 * lclick 左键点击调用的公共事件 为0则为默认设置  公共事件最好不要有等待等效果,为并行
 * rclick 右键点击用的公共事件  为0则为默认设置 公共事件最好不要有等待等效果,为并行
 * vid  赋值的变量id 如果为0则不设置 ,左键右键都会赋值,赋值的为设置的 value 或者 如果未设置值则为 索引号
 * 
 * 
 * 
 * 
 * bjb 背景图片名
 * bjx 背景x坐标
 * bjy 背景y坐标
 * 
 * cblb 侧边栏图片名
 * cblx 侧边栏x坐标  相对窗口的页面右侧
 * cbly 侧边栏y坐标   点击侧边栏时可以移动滑块到该位置
 * 
 * cbhkx 侧边滑块x坐标  相对窗口的页面右侧
 * cbhkw 侧边滑块的宽
 * cbhkh 侧边滑块的最小高
 * cbhkl 侧边滑块黑框的宽度
 * 
 * cbb 清除按钮图片名 
 * cbx 清除按钮x坐标  
 * cby 清除按钮y坐标  按下时清空窗口
 * 
 * helpx 帮助窗口 x
 * helpy 帮助窗口 y
 * helpw 帮助窗口 宽
 * helph 帮助窗口 高
 * helpbw 帮助窗口背景的w偏离值(背景比帮助窗口宽大的值)
 * helpbh 帮助窗口背景的b偏离值(背景比帮助窗口高大的值)
 * helpbl  帮助窗口背景的框的宽度
 * 
 * 
 * 
 * =========== 
 * 信息框的方法
 * =========== 
 * 
 * ============================
 * 
 * 添加 内容 text 到 id 窗口 最后
 * ww.xinxi.push(id,text) 
 * 添加 内容 值 到 id 窗口 最后  如果设置值则返回的为值,否则为索引号
 * ww.xinxi.pushValue(id,value) 
 * 添加 内容 说明 到 id 窗口 最后 如果有说明则显示说明
 * ww.xinxi.pushDesc(id,text)
 *  
 * ============================
 * 添加 内容 text 到 id 窗口 最上面
 * ww.xinxi.unshiftValue(id,text)
 * 
 * 
 * 添加 内容  值 到 id 窗口 最上面    如果设置值则返回的为值,否则为索引号
 * ww.xinxi.unshift(id,text) 
 * 
 * 添加 内容 说明  到 id 窗口 最上面  如果有说明则显示说明
 * ww.xinxi.unshiftDesc(id,text)
 * ============================
 * 
 * 删除 id 窗口 最后 内容(包括值和说明)
 * ww.xinxi.pop(id ) 
 * ============================
 * 删除 id 窗口 最上面 内容(包括值和说明)
 * ww.xinxi.unshift(id )
 * 
 * =========== 
 * 范例
 * 
 * 设置好窗口后, 用编号的图片上显示这个窗口 
 * 如下,即1号图片调用1号窗口,大小为宽180,高220,位置为x25,y30
 * =========== 
 * 
 * 
 * 
 *   ww.xinxi.set(1,{  bjb: "Test-0", bjx:-15,bjy:-40 ,cbhkx:5,cbhkw: 30,cbhkh: 30,cbhkl: 4,cblb: "Test-1",cblx: 10,cbly:40, cbb: "Test-3",cbx:180,cby:0})  
 *   $gameScreen.showPicture(1,"x/180,220,1", 0,125, 130,100, 100, 255, 0);
 *  
 * 
 * //如果设置了w,h则可以不输入前面的宽和高 
 *   ww.xinxi.set(1,{ w:180,h:120,  bjb: "Test-0", bjx:-15,bjy:-40 ,cbhkx:5, cbhkw: 30,cbhkh: 30,cbhkl: 4,cblb: "Test-1",cblx: 10,cbly:40, cbb: "Test-3",cbx:180,cby:0})  
 *   $gameScreen.showPicture(1,"x/1", 0,125, 130,100, 100, 255, 0);
 * 
 * 
 * 
 */











var ww = ww || {};


ww.xinxi = {};
ww.xinxi.saveid = 100;
ww.xinxi.savesize = 50;

ww.plugin.get("ww_xinxi", ww.xinxi);

ww.xinxi._hash = {};
ww.xinxi.sprites = {}
/**获取 */
ww.xinxi.get = function (index) {
    if (this.saveid) {
        var v = $gameVariables._data
        if (!v[this.saveid] || typeof v[this.saveid] != "object") {
            v[this.saveid] = {}
        }
        var hash = v[this.saveid]
    } else {
        var hash = this._hash
    }
    if (!hash[index]) {
        hash[index] = new Game_XinXi()
    }
    return hash[index]
};

/**设置 */
ww.xinxi.set = function (index, o) {
    var xinxi = this.get(index)
    xinxi.set(o)
    return xinxi
};

/**删除 */
ww.xinxi.del = function (index) {
    if (this.saveid) {
        var v = $gameVariables._data
        if (!v[this.saveid] || typeof v[this.saveid] != "object") {
            v[this.saveid] = {}
        }
        var hash = v[this.saveid]
    } else {
        var hash = this._hash
    }
    if (hash[index]) {
        delete hash[index]
    }
    return hash
};



/**清空 内容和值 */
ww.xinxi.clear = function (index) {
    var xinxi = this.get(index)
    xinxi.clear()
    return xinxi
};

/**尾部添加 */
ww.xinxi.push = function (index, list, type) {
    var xinxi = this.get(index)
    xinxi.push(list, type)
    return xinxi
};


/**头部添加 */
ww.xinxi.unshift = function (index, list) {
    var xinxi = this.get(index)
    xinxi.unshift(list)
    return xinxi
};


/**移除尾部 */
ww.xinxi.pop = function (index, type) {
    var xinxi = this.get(index)
    xinxi.pop(type)
    xinxi.popValue(type)
    xinxi.popDesc(type)
    return xinxi
};

/**移除头部 */
ww.xinxi.shift = function (index) {
    var xinxi = this.get(index)
    xinxi.shift()
    xinxi.shiftValue(type)
    xinxi.shiftDesc(type)
    return xinxi
};


ww.xinxi.push2 = function (index, list, type) {
    var xinxi = this.get(index)
    xinxi.push2(list, type)
    return xinxi
};


ww.xinxi.unshift2 = function (index, list, type) {
    var xinxi = this.get(index)
    xinxi.unshift2(list, type)
    return xinxi
};



/**尾部添加值 */
ww.xinxi.pushValue = function (index, list, type) {
    var xinxi = this.get(index)
    xinxi.pushValue(list, type)
    return xinxi
};

/**头部添加值 */
ww.xinxi.unshiftValue = function (index, list) {
    var xinxi = this.get(index)
    xinxi.unshiftValue(list)
    return xinxi
};



/**尾部添加值 */
ww.xinxi.pushDecs = function (index, list, type) {
    var xinxi = this.get(index)
    xinxi.pushDesc(list, type)
    return xinxi
};

/**头部添加值 */
ww.xinxi.unshiftDesc = function (index, list) {
    var xinxi = this.get(index)
    xinxi.unshiftDesc(list)
    return xinxi
};



/**移动 */
ww.xinxi.to = function (index, v) {
    var xinxi = this.get(index)
    xinxi.to(v)
    return xinxi
};
/**移动添加 */
ww.xinxi.toadd = function (index, v) {
    var xinxi = this.get(index)
    xinxi.toadd(v)
    return xinxi
};
/**显示 */
ww.xinxi.show = function (index) {
    var xinxi = this.get(index)
    xinxi.show()
    return xinxi
};
/**隐藏 */
ww.xinxi.hide = function (index) {
    var xinxi = this.get(index)
    xinxi.hide()
    return xinxi
};

ww.xinxi.refresh = function (index) {
    var xinxi = this.get(index)
    xinxi.refresh()
    return xinxi
};

/**显示窗口打开情况 */
ww.xinxi.isshow = function (index) {
    var xinxi = this.get(index)
    return xinxi.isshow()
};



/**模式0 
 * 不添加显示信息
 * 
*/
ww.xinxi.me0 = function (id) {
    this.type = 0
    this.id = id
};

/**模式1
 * 添加显示信息,同时显示
 */
ww.xinxi.me1 = function (id) {
    this.type = 1
    this.id = id
};

/**模式2 
 * 添加显示信息,不显示
 * 
*/
ww.xinxi.me2 = function (id) {
    this.type = 2
    this.id = id
};




function Game_XinXi() {
    this.initialize.apply(this, arguments);
}



Game_XinXi.prototype.initialize = function () {
    this.type = "text"
    this.clear()
    this.show()
}


/**清除 */
Game_XinXi.prototype.clear = function () {
    this._all = []
    this._allvalue = []
    this._alldesc = []
    this._end = 0
    this._mustre = true
    this._clear = true
    this._item = null
    this._animId = -1
}


/**设置 */
Game_XinXi.prototype.set = function (o) {
    if (o && (typeof o == "object")) {
        for (var i in o) {
            this[i] = o[i]
        }
    }
}

Game_XinXi.prototype.hide = function () {
    this._showing = false
};


Game_XinXi.prototype.show = function () {
    this._showing = true
};

Game_XinXi.prototype.isshow = function () {
    return this._showing
};

Game_XinXi.prototype.refresh = function () {
    this._mustre = true
};

/**改变 */
Game_XinXi.prototype.change = function (c, m) {
    if (c) {
        var m = "" + (m || "")
        var m = ArtWord.convertEscapeCharacters(m)
    }
    return m
}


Game_XinXi.prototype.getSavesize = function () {
    return (this.savesize === undefined ? ww.xinxi.savesize : this.savesize) || 0
};

/**添加到数组 */
Game_XinXi.prototype.pushOfList = function (all, list, c, type) {
    //if(!Array.isArray(all)){return}
    if (Array.isArray(list)) {
        if (type) {
            for (var i = 0; i < list.length; i++) {
                var m = this.change(c, list[i])
                all.unshift(m)
            }
        } else {
            for (var i = 0; i < list.length; i++) {
                var m = this.change(c, list[i])
                all.push(m)
            }
        }
    } else {
        var m = this.change(c, list)
        if (type) {
            all.unshift(m)
        } else {
            all.push(m)
        }
    }
    this.popTosize(all, type)
    this._mustre = true
}

/**删除到值 */
Game_XinXi.prototype.popTosize = function (all, type) {
    var z = this.getSavesize()
    if (z > 0) {
        if (type) {
            while (all.length > z) {
                all.pop()
            }
        } else {
            while (all.length > z) {
                all.shift()
            }
        }
    }
    this._mustre = true
}

/**删除全部 */
Game_XinXi.prototype.popOfList = function (all, type) {
    if (type) {
        all.shift();
    } else {
        all.pop();
    }
    this._mustre = true
}

/**信息内容添加删除 */
Game_XinXi.prototype.push = function (list) {
    this.pushOfList(this._all, list, true, false)
    this._end = this._all.length - 1
};
Game_XinXi.prototype.push2 = function (list) {
    this.pushOfList(this._all, list, false, false)
    this._end = this._all.length - 1
};
Game_XinXi.prototype.unshift = function (list) {
    this.pushOfList(this._all, list, true, true)
    this._end = 0
}
Game_XinXi.prototype.unshift2 = function (list) {
    this.pushOfList(this._all, list, false, true)
    this._end = 0
};

Game_XinXi.prototype.pop = function () {
    this.popOfList(this._all, false)
};
Game_XinXi.prototype.shift = function () {
    this.popOfList(this._all, true)
};



/**值添加删除 */
Game_XinXi.prototype.pushValue = function (list) {
    this.pushOfList(this._allvalue, list, false, false)
};
Game_XinXi.prototype.unshiftValue = function (list) {
    this.pushOfList(this._allvalue, list, false, true)
};
Game_XinXi.prototype.popValue = function () {
    this.popOfList(this._allvalue, false)
};
Game_XinXi.prototype.shiftValue = function () {
    this.popOfList(this._allvalue, true)
};


/**说明添加 */
Game_XinXi.prototype.pushDesc = function (list) {
    this.pushOfList(this._alldesc, list, true, false)
};
Game_XinXi.prototype.unshiftDesc = function (list) {
    this.pushOfList(this._alldesc, list, true, true)
};
Game_XinXi.prototype.popDesc = function () {
    this.popOfList(this._alldesc, false)
};

Game_XinXi.prototype.shiftDesc = function () {
    this.popOfList(this._alldesc, true)
};





/**移动到 */
Game_XinXi.prototype.to = function (end) {
    this._end = end || 0
    this._end.clamp(0, this._all.length - 1)
};

/**移动添加 */
Game_XinXi.prototype.toadd = function (v) {
    this.to(this._end + (v || 0))
};




ww.xinxi.Game_Interpreter_prototype_command101 = Game_Interpreter.prototype.command101;
Game_Interpreter.prototype.command101 = function () {

    ww.xinxi.Game_Interpreter_prototype_command101.call(this)
    if (ww.xinxi.type == 1 || ww.xinxi.type == 2) {
        if ($gameMessage.hasText()) {
            ww.xinxi.push(ww.xinxi.id, $gameMessage.allText())
        }
    }
    if ($gameMessage.isChoice() ||
        $gameMessage.isNumberInput() ||
        $gameMessage.isItemChoice()) {
    } else {
        if (ww.xinxi.type == 2) {
            $gameMessage.clear()
        }
    };
    return false
};


ww.xinxi.Sprite_Picture_prototype_loadBitmap = Sprite_Picture.prototype.loadBitmap;
Sprite_Picture.prototype.loadBitmap = function () {
    if (this._window) {
        this.removeChild(this._window)
        delete this._window
    }
    if (this._pictureName && this._pictureName.indexOf("x/") == 0) {
        var json = this._pictureName.slice(2)
        if (json) {
            var list = JSON.parse("[" + json + "]")
            var w = list[0] || 0
            var h = list[1] || 0
            var id = list[2] || 0
            if (h == 0) {
                var id = w
                var w = 0
                var h = 0
            }
        } else {
            var w = 300
            var h = 300
            var id = 0
        }
        var set = ww.xinxi.get(id)
        var f = ww.xinxi.sprites[set.type]
        if (f) {
            var wb = new f(w, h, set)
        } else if (set.type == "wupin") {
            var wb = new Sprite_WuPin(w, h, set)
        } else if (set.type == "shopbuy") {
            var wb = new Sprite_ShopBuy(w, h, set)
        } else if (set.type == "shopsell") {
            var wb = new Sprite_ShopSell(w, h, set)
        } else {
            var wb = new Sprite_XinXi(w, h, set)
        }
        this._window = wb
        this.addChild(this._window)
        if (w == 0 && h == 0) {
            this.bitmap = ImageManager.loadEmptyBitmap()
        } else {
            this.bitmap = new Bitmap(w, h)
        }
    } else {
        ww.xinxi.Sprite_Picture_prototype_loadBitmap.call(this)
    }
}


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
* @param {boolean|number} b 是否检查位图(每层-1)
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
    }
    return false
}




function Sprite_XinXi() {
    this.initialize.apply(this, arguments);
}


ww.xinxi.sprites["text"] = Sprite_XinXi


//设置原形 
Sprite_XinXi.prototype = Object.create(Sprite.prototype);
//设置创造者
Sprite_XinXi.prototype.constructor = Sprite_XinXi;
//初始化
Sprite_XinXi.prototype.initialize = function (w, h, get) {
    Sprite.prototype.initialize.call(this);
    this.initGet(w, h, get)
    this.createBeiJing()
    this.createPage()
    this.createCbl()
    this.createCbhk()
    this.createCButton()
    //this.createAdd()
    this.createHelp()
    this.refresh()
    this.showToRefresh()
};

Sprite_XinXi.prototype.initGet = function (w, h, get) {
    this._get = get
    var w = w || this.get("w") || 0
    var h = h || this.get("h") || 0
    this._pageW = w
    this._pageH = h
    this._hash = {}
    this._showY = 0
    this._touchId = 0
}

/**创建背景 */
Sprite_XinXi.prototype.createBeiJing = function () {
    this._beijing = new Sprite()
    this.addChild(this._beijing)

    this._beijing.x = this.get("bjx") || 0
    this._beijing.y = this.get("bjy") || 0

    this._beijingb = this.get("bjb") || ""
    this._beijing.bitmap = ImageManager.loadPicture(this._beijingb)
}



/**创建页面 */
Sprite_XinXi.prototype.createPage = function () {
    if (!this._showSprite) {
        this._showSprite = new Sprite()
    }
    this.addChild(this._showSprite)
    this.createPageMask(this._pageW, this._pageH)
    this.createSprites()
}

Sprite_XinXi.prototype.createPageMask = function (w, h) {
    if (!this._pageMask) {
        this._pageMask = new Sprite()
    }
    this.addChild(this._pageMask)
    var b = new Bitmap(w, h)
    b.fillAll("#ffffff")
    this._pageMask.bitmap = b
    this._showSprite.mask = this._pageMask //setMask(s)  
}




Sprite_XinXi.prototype.createAdd = function () {
    this._addbuttonSprite = null
    this._addbutton = this.get("addbutton")
    if (this._addbutton) {
        this._addbuttonSprite = []
        for (var i = 0; i < this._addbutton.length; i++) {
            var ab = this._addbutton[i]
            var s = new Sprite()
            s.x = ab.x
            s.y = ab.y
            s.ab = ab
            s.bitmap = ImageManager.loadPicture(ab.b)
            this._addbuttonSprite.push(s)
            this.addChild(s)
        }
    }
}


Sprite_XinXi.prototype.createHelp = function () {
    this._help = null

    this._helpx = this.get("helpx") || 0
    this._helpy = this.get("helpy") || 0
    this._helpw = this.get("helpw") || 0
    this._helph = this.get("helph") || 0

    this._helpbl = this.get("helpbl") || 0
    this._helpbw = this.get("helpbw") || 0
    this._helpbh = this.get("helpbh") || 0

    //if (!this._helpw) { item = null } 
    this._helpSprite = new Sprite()
    this._helpBeijingSprite = new Sprite()
    this.addChild(this._helpBeijingSprite)
    this.addChild(this._helpSprite)
    this._helpSprite.x = this._helpx
    this._helpSprite.y = this._helpy
    this._helpBeijingSprite.x = this._helpx - this._helpbw
    this._helpBeijingSprite.y = this._helpy - this._helpbh

    if (!this._helpw) {
        this._helpSprite.visible = false
        this._helpBeijingSprite.visible = false
    }
}


/**创建页面 */
Sprite_XinXi.prototype.createSprites = function () {
    this._sprites = []
    var z = this.get("sn") || 20
    for (var i = 0; i < z; i++) {
        var s = new Sprite()
        this._sprites.push(s)
        this._showSprite.addChild(s)
    }
}




/**创建侧边栏 */
Sprite_XinXi.prototype.createCbl = function () {
    this._cbl = new Sprite()
    this.addChild(this._cbl)

    this._cbl.x = this._pageW + (this.get("cbhkx") || 0)
    this._cbl.y = this.get("cbly") || 0

    this._cblb = this.get("cblb") || ""
    this._cbl.bitmap = ImageManager.loadPicture(this._cblb)

}






/**创建侧边滑块 */
Sprite_XinXi.prototype.createCbhk = function () {
    this._cbhk = new Sprite()
    this.addChild(this._cbhk)

    this._cbhk.x = this._pageW + (this.get("cbhkx") || 0)


    this._cbhkb = this.get("cbhkb") || ""
    this._cbhkh = this.get("cbhkh") || 0

    this._cbhk.bitmap = ImageManager.loadPicture(this._cbhkb)

}


/**创建清除键 */
Sprite_XinXi.prototype.createCButton = function () {
    this._CButton = new Sprite()
    this.addChild(this._CButton)

    this._CButton.x = this.get("cbx") || 0
    this._CButton.y = this.get("cby") || 0

    this._CButtonb = this.get("cbb") || ""
    this._CButton.bitmap = ImageManager.loadPicture(this._CButtonb)

}


Sprite_XinXi.prototype.get = function (name) {
    return this._get && this._get[name]
}


Sprite_XinXi.prototype.set = function (name, value) {
    this._get && (this._get[name] = value)
}



Sprite_XinXi.prototype.showing = function () {
    return this.get("_showing")
}

Sprite_XinXi.prototype.mustClear = function () {
    return this.get("_clear")
}

Sprite_XinXi.prototype.clearClear = function () {
    this.set("_clear")
}


Sprite_XinXi.prototype.allmessage = function () {
    return this.get("_all") || []
}


Sprite_XinXi.prototype.getmessage = function (index) {
    return this.allmessage()[index] || ""
}


Sprite_XinXi.prototype.alldesc = function () {
    return this.get("_alldesc") || []
}


Sprite_XinXi.prototype.getdesc = function (index) {
    return this.alldesc()[index] || ""
}


Sprite_XinXi.prototype.allvalue = function () {
    return this.get("_allvalue") || []
}


Sprite_XinXi.prototype.getvalue = function (index) {
    var v = this.allvalue()[index]
    if (v === undefined) {
        return index
    } else {
        return v
    }
}


Sprite_XinXi.prototype.end = function () {
    return this.get("_end")
}


Sprite_XinXi.prototype.mustRefresh = function () {
    return this.get("_mustre") || this._mustre
}


Sprite_XinXi.prototype.clearRefresh = function (v) {
    this._mustre = v
    return this.set("_mustre", v)
}


/**清除 */
Sprite_XinXi.prototype.clear = function () {
    this.refreshItems()
}



Sprite_XinXi.prototype.pageW = function () {
    return this._pageW
}



Sprite_XinXi.prototype.pageH = function () {
    return this._pageH
}



Sprite_XinXi.prototype.spriteLength = function () {
    return this._sprites.length
}


Sprite_XinXi.prototype.getSprite = function (index) {
    var l = this.spriteLength()
    var i = ((index % l) + l) % l
    return this._sprites[i]
}


Sprite_XinXi.prototype.show = function () {
    if (!this.visible) {
        this.visible = true
        this._item = null
    }
};

Sprite_XinXi.prototype.hide = function () {
    if (this.visible) {
        this.visible = false
        this._item = null
    }
};

Sprite_XinXi.prototype.startEvent = function (id) {
    if (!this._interpreter) {
        this._interpreter = new Game_Interpreter()
    }
    this._interpreter.setup($dataCommonEvents[id] && $dataCommonEvents[id].list);
    this._interpreter.update();
};



/**全部的高 */
Sprite_XinXi.prototype.allh = function () {
    if (this._allH < 0) {
        var list = []
        var list2 = []
        var l = this.allmessage()
        var allh = 0
        for (var index = 0; index < l.length; index++) {
            list.push(allh)
            allh += this.testItem(index)
            list2.push(allh)
        }
        this._allH = allh
        this._allHlist = list
        this._allHlist2 = list2
    }
    return this._allH
}




/**刷新 */
Sprite_XinXi.prototype.refreshItems = function () {
    this._allH = -1
    this.allh()
}


Sprite_XinXi.prototype.refresh = function () {
    this.refreshItems()
    this.refreshShowY()
}


/**
 * 页面移动
 * 
 */
Sprite_XinXi.prototype.onPageMove = function (x, y) {
    this.showMoveY(y)
}

/**滑块移动到 */
Sprite_XinXi.prototype.onHKTo = function (x, y) {
    if (this._cblb) {
        var y = y / this._cbl.bitmap.height * this._allH
    } else {
        var y = y / this._pageH * this._allH
    }
    this.showToY(y)
}

/**
 * 滑块移动
 * 
 */
Sprite_XinXi.prototype.onHKMove = function (x, y) {
    if (this._cblb) {
        var y = y / this._cbl.bitmap.height * this._allH
    } else {
        var y = y / this._pageH * this._allH
    }
    this.showMoveY(y)

}

/**刷新显示位置 */
Sprite_XinXi.prototype.refreshShowY = function () {
    this.showToY(this._showY)
}



/**设置滚动条比例 */
Sprite_XinXi.prototype.setScrollBarScale = function () {
    if (this._allH && this._allH > this._pageH) {
        var scale = this._pageH / this._allH
        if (this._cbhkb) {
            if (this._cblb) {
                var scale = (this._cbl.bitmap.height / this._cbhk.bitmap.height) * scale
            } else {
                var scale = (this._pageH / this._cbhk.bitmap.height) * scale
            }
            scale = Math.max(scale, this._cbhkh / this._cbhk.bitmap.height)

        } else {
            var scale = scale
        }
        this._cbhk.scale.y = scale
        this._cbhk.visible = true
        this._cbl.visible = true
    } else {
        this._cbhk.scale.y = 1
        this._cbhk.visible = false
        this._cbl.visible = false
    }
}




/**移动滚动条位置到目前位置 */
Sprite_XinXi.prototype.moveScrollBarToShow = function () {
    if (this._allH) {
        if (this._cblb) {
            var y = (this._cbl.bitmap.height / this._allH) * this._showY
        } else {
            var y = (this._pageH / this._allH) * this._showY
        }
        this._cbhk.y = this._cbl.y + y
        this._cbhk.visible = true
        this._cbl.visible = true
    } else {
        this._cbhk.visible = false
        this._cbl.visible = false
    }
}


/**显示滚动条 */
Sprite_XinXi.prototype.showScrollBar = function () {
    this.setScrollBarScale()
    this.moveScrollBarToShow()
}



Sprite_XinXi.prototype.showToRefresh = function () {
    this.showToY(this._allH)
}

/**显示内容到y处 */
Sprite_XinXi.prototype.showToY = function (y) {
    this.allh()
    this._showY = Math.max(0, Math.min(y, this._allH - this._pageH))

    this.drawAllItem(this._showY)
    this._showSprite.y = -this._showY
    this.showScrollBar()
    this.clearRefresh()
}

/**移动偏移y */
Sprite_XinXi.prototype.showMoveY = function (y) {
    this.showToY(this._showY + y)
}

/**移动到底部 */
Sprite_XinXi.prototype.showToYEnd = function () {
    this.showToY(this._allH)
}

/**移动到顶部 */
Sprite_XinXi.prototype.showToYTop = function () {
    this.showToY(0)
}



/**显示到索引 */
Sprite_XinXi.prototype.showToIndex = function (i) {
    if (i < 0) {
        this._index = 0
        this.showToYTop()

    } else if (i >= this.allmessage().length) {
        this._index = Math.max(0, this.allmessage().length - 1)
        this.showToYEnd()
    } else {
        this._index = i
        var y = this._allHlist[this._index]
        this.showToY(y)

    }
}





Sprite_XinXi.prototype.drawAllItem = function (y) {
    this.allh()
    for (var i = 0; i < this._allHlist2.length; i++) {
        var z = this._allHlist2[i]
        if (z > y) {
            break
        }
    }
    var up = Math.max(0, Math.floor((i) * 0.1) * 10)
    for (var i = 0; i < this.spriteLength(); i++) {
        this.drawSprite(i + up)
    }
}

Sprite_XinXi.prototype.drawSprite = function (index) {
    var text = this.getmessage(index)
    var s = this.getSprite(index)
    if (s._text !== text) {
        s._text = text
        s.bitmap = this.drawText(text)
    }
    s._index = index
    s.y = this._allHlist[index]
}


/**获取项目高 */
Sprite_XinXi.prototype.testItem = function (index) {
    var text = this.getmessage(index)
    if (!text) { return 0 }
    var b = this.drawText(text)
    return b.height
}

/**绘制项目 */
Sprite_XinXi.prototype.drawText = function (text) {
    if (text) {
        return ImageManager.loadArtText(this.pageW(), this.pageH(), text, 0, 1)
    } else {
        return ImageManager.loadEmptyBitmap()
    }
}


Sprite_XinXi.prototype.drawHelp = function (item) {
    if (item) {
        //var can = this.isItemEffectsValid(item) ? "(当前使用没有效果)" : "(不可使用)" 
        var t = item
        var w = this._helpw
        var h = this._helph
        return ImageManager.loadArtText(w, h, t, 0, 2)
    } else {
        return 0
    }
};


Sprite_XinXi.prototype.drawHelpBeijing = function (b) {
    if (b) {
        var w = b.width
        var h = b.height
        var bw = w + this._helpbw + this._helpbw
        var bh = h + this._helpbh + this._helpbh
        var bl = this._helpbl

        var x = bl
        var y = bl
        var w = bw - bl - bl
        var h = bh - bl - bl

        var b = new Bitmap(bw, bh)
        b.fillAll("#000")
        b.fillRect(x, y, w, h, "#fff")
        return b
    } else {
        return ImageManager.loadEmptyBitmap()
    }
};


/**更新 */
Sprite_XinXi.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this.showing()) {
        this.show()
        this.updateParallel()
        /*this.updateBeiJing()
        this.updateCbl()
        this.updateCbhk()
        this.updateCButton()*/
        if (this.mustClear()) {
            this.clear()
            this.clearClear()
        }
        if (this.mustRefresh()) {
            this.refreshItems()
            this.showToRefresh()
        }
        this.updateTouch()
        this.updateAnim()
        /*if (this.mustRefresh()) {
            if (this._isEnd && this.end()) {
                this.showToYEnd()
            } else {
                this.refreshShowY()
            }
        }*/
    } else {
        this.hide()
        if (this.mustClear()) {
            this._isEnd = true
            this.clear()
            this.clearClear()
        }
        if (this.mustRefresh()) {
            this.refreshItems()
            this.showToRefresh()
        }
        /* if (this.mustRefresh()) {
             if (this._isEnd && this.end()) {
                 this.showToYEnd()
             } else {
                 this.refreshShowY()
             }
         }*/
    }
};


Sprite_XinXi.prototype.updateTouch = function () {
    if (TouchInput.isPressed()) {
        if (TouchInput.isTriggered()) {
            this.setHelp()
            if (this._cbhk.isTouchInputThis()) {
                this._touch = "hk"
            } else if (this._cbl.isTouchInputThis()) {
                this._touch = "to"
                var loc = this._cbl.worldToLocalXY(TouchInput.x, TouchInput.y)
                this.onHKTo(loc.x, loc.y)
                this._touch = "hk"
            } else if (this._CButtonb && this._CButton.isTouchInputThis()) {
                this._touch = "clear"
                this.onCClick()
            } else if (this._pageMask.isTouchInputThis()) {
                this._touch = "page"
                //this._lastTouch = "page"
            }
            this._touchMove = false
            this._touchX = TouchInput.x
            this._touchY = TouchInput.y
            this._touchId = 0
        } else if (TouchInput.isMoved()) {
            this._touchMove = true
            if (this._touch == "hk") {
                var x = 0//TouchInput.x - this._touchX
                var y = TouchInput.y - this._touchY
                //滑块移动
                this.onHKMove(x, y)
                this._touchX = TouchInput.x
                this._touchY = TouchInput.y
            } else if (this._touch == "page") {
                var x = 0//TouchInput.x - this._touchX
                var y = this._touchY - TouchInput.y
                //页面上移动
                this.onPageMove(x, y)
                this._touchX = TouchInput.x
                this._touchY = TouchInput.y
            }
        }
    } else {
        //右键
        if (TouchInput.isCancelled()) {
            if (this._pageMask.isTouchInputThis()) {
                this.onRClick()
            }
            //左键 
        } else if (!this._touchMove) {
            if (this._touch == "page") {
                this.onLClick()
            }
        }
        //清空
        this._touchMove = 0
        this._touchId = 0
        this._touch = 0
    }
    this._touchId++
}

Sprite_XinXi.prototype.updateParallel = function () {
    //如果( 事件解释器 )
    if (this._interpreter) {
        //如果 (不是 事件解释器 是运转() )
        if (!this._interpreter.isRunning()) {
            //事件解释器 安装(列表(),事件id)
            this._interpreter = null;
        }
        if (this._interpreter) {
            //事件解释器 更新()
            this._interpreter.update();
        }
    }
};


Sprite_XinXi.prototype.updateAnim = function () {
}


/**更新背景 */
Sprite_XinXi.prototype.updateBeiJing = function () {
    var b = this.get("bjb") || ""
    if (this._beijingb != b) {
        this._beijingb = b
        this._beijing.bitmap = ImageManager.loadPicture(this._beijingb)
    }
    if (this._beijingb) {
        this._beijing.x = this.get("bjx") || 0
        this._beijing.y = this.get("bjy") || 0
    }
}

/**更新侧边栏 */
Sprite_XinXi.prototype.updateCbl = function () {

    var b = this.get("cblb") || ""
    if (this._cblb != b) {
        this._cblb = b
        this._cbl.bitmap = ImageManager.loadPicture(this._cblb)
    }
    if (this._cblb) {
        this._cbl.x = this._pageW + (this.get("cblx") || 0)
        this._cbl.y = this.get("cbly") || 0
    }
}


/**更新侧边滑块*/
Sprite_XinXi.prototype.updateCbhk = function () {
    var b = this.get("cbhkb") || ""
    if (this._cbhkb != b) {
        this._cbhkb = b
        this._cbhk.bitmap = ImageManager.loadPicture(this._cbhkb)
    }
    if (this._cbhkb) {
        this._cbhk.x = this._pageW + (this.get("cbhkx") || 0)
    }
}



/**更新背景 */
Sprite_XinXi.prototype.updateCButton = function () {
    var b = this.get("cbb") || ""
    if (this._CButtonb != b) {
        this._CButtonb = b
        this._CButton.bitmap = ImageManager.loadPicture(this._CButtonb)
    }
    if (this._CButtonb) {
        this._CButton.x = this.get("cbx") || 0
        this._CButton.y = this.get("cby") || 0
    }
}


Sprite_XinXi.prototype.onClick2XY = function () {
    if (
        Math.abs(this._touchX - TouchInput.x) < 10 &&
        Math.abs(this._touchY - TouchInput.y) < 10) {
        return true
    } else {
        return false
    }
}

Sprite_XinXi.prototype.onAddSprites = function () {
    if (this._addbuttonSprite) {
        var l = this._addbuttonSprite
        for (var i = 0; i < l.length; i++) {
            var s = l[i]
            if (s && s.isTouchInputThis()) {
                return s
            }
        }
    }
}

Sprite_XinXi.prototype.onClickAdd = function (type) {
    if (this._addbuttonSprite) {
        var s = this.onAddSprites()
        if (s && s.ab) {
            var click = s.ab[type] || 0
            if (click < 0) {
            } else {
                this.onAddClickSet(s, type)
                if (click) {
                    this.startEvent(click)
                } else {
                    this.onDefaultAddClick(s, type)
                }
            }
            return s
        }
    }
}



Sprite_XinXi.prototype.onAddClickSet = function (s, type) {

}

Sprite_XinXi.prototype.onDefaultAddClick = function (s, type) {

}



/**清除按钮按下 */
Sprite_XinXi.prototype.onCClick = function () {
    var click = this.get("cclick") || 0
    if (click < 0) {
    } else {
        this.onCClickSet()
        if (click) {
            this.startEvent(click)
        } else {
            this.onDefaultCClick()
        }
    }
}


/**
 * ========================================
 * 清除按钮按下
 * ======================================== 
 */
Sprite_XinXi.prototype.onCClickSet = function (s) {
    this.setHelp()
    this.setItem()
}

Sprite_XinXi.prototype.onDefaultCClick = function () {
    this._get.clear()
    this.clear()
    this.showToY(0)
}




Sprite_XinXi.prototype.onClickSprites = function () {
    for (var i = 0; i < this.spriteLength(); i++) {
        var s = this.getSprite(i)
        if (s && s.isTouchInputThis()) {
            return s
        }
    }

}

/**
 * ========================================
 * 左键按下
 * ======================================== 
 */
/**当左键按下 */
Sprite_XinXi.prototype.onLClick = function () {
    var s = this.onClickSprites()
    if (s) {
        var click = this.get("lclick") || 0
        if (click < 0) {
        } else {
            this.onLClickSet(s)
            if (click) {
                this.startEvent(click)
            } else {
                this.onDefaultLClick()
            }
        }
        return s
    }
}


Sprite_XinXi.prototype.onLClickSet = function (s) {
    this.setHelp(s)
    this.setItem(s)
}


/**左键按下默认 */
Sprite_XinXi.prototype.onDefaultLClick = function () {

}

/**
 * ========================================
 * 右键按下
 * ======================================== 
 */
/**右键按下 */
Sprite_XinXi.prototype.onRClick = function () {
    var s = this.onClickSprites()
    if (s) {
        var click = this.get("rclick") || 0
        if (click < 0) {
        } else {
            this.onRClickSet(s)
            if (click) {
                this.startEvent(click)
            } else {
                this.onDefaultRClick()
            }
        }
        return s
    }
}

Sprite_XinXi.prototype.onDefaultRClick = function () {
}

Sprite_XinXi.prototype.onRClickSet = function (s) {
    this.setHelp(s)
    this.setItem(s)
}




/**
 * ========================================
 * 设置项目
 * ======================================== 
 */
Sprite_XinXi.prototype.setItem = function (item) {
    this._item = item
    if (!item) { return }
    var vid = this.get("vid") || 0
    if (vid) {
        var index = item._index
        var v = this.getvalue(index)
        $gameVariables.setValue(vid, v)
    }
}



/**
 * 设置帮助
 */
Sprite_XinXi.prototype.setHelp = function (item) {
    if (!this._helpw || !item) {
        this._helpBeijingSprite.visible = false
        this._helpSprite.visible = false
        return
    }


    var index = item._index
    var desc = this.getdesc(index)

    if (this._help != item) {
        this._help = item
        var b = this.drawHelp(desc)
        if (b) {
            var b2 = this.drawHelpBeijing(b)
        } else {
            var b = ImageManager.loadEmptyBitmap()
            var b2 = ImageManager.loadEmptyBitmap()
        }
        this._helpSprite.bitmap = b
        this._helpBeijingSprite.bitmap = b2
    }

    if (desc) {
        this._helpBeijingSprite.visible = true
        this._helpSprite.visible = true
    } else {
        this._helpBeijingSprite.visible = false
        this._helpSprite.visible = false
    }
}

