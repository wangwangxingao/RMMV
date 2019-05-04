//=============================================================================
// ww_xixi.js
//=============================================================================

/*:
 * @plugindesc 显示信息
 * @author 汪汪
 * @version 2.0
 * 
 * @help  
 * 
 * 获取窗口 1
 * s = ww.xinxi.get(1)  
 * 设置参数  
 * s.set({  bjb: "Test-0", cbhkb: "Test-2",cblb: "Test-1", cbb: "Test-3"})
 * bjb 背景图片名 bjx 背景x坐标  bjy 背景y坐标
 * cblb 侧边栏图片名 cblx 侧边栏x坐标 cbly 侧边栏y坐标   点击侧边栏时可以移动滑块到该位置
 * cbhkb 侧边滑块名 cbhkx 侧边滑块x坐标  滑块需要与显示内容高度相同,按下滑块滑动可以调整窗口
 * cbb 清除按钮图片名 cbx 清除按钮x坐标  cby 清除按钮y坐标  按下时清空
 * 
 * 
 * 设置窗口 1
 * 
 *   ww.xinxi.set(1,{  bjb: "Test-0", bjx:-15,bjy:-40 , cbhkb: "Test-2",cbhkx:5,cblb: "Test-1",cblx: 10,cbly:40, cbb: "Test-3",cbx:180,cby:0})  
 *   $gameScreen.showPicture(3,"x/180,220,1", 0,125, 130,100, 100, 255, 0);
 *  
 * 
 * 设置好窗口后,使用以下命令,用编号的图片上显示这个窗口 
 * 如上,即3号图片调用1号窗口,大小为宽300,高200,位置为x25,y30
 * 
 * 
 * 清空 id 窗口
 * ww.xinxi.clear(id)
 * 
 * 显示 id 窗口
 * ww.xinxi.show(id)
 * 
 * 隐藏 id 窗口
 * ww.xinxi.hide(id)
 * 
 * 
 * 添加 内容 text 到 id 窗口 最后
 * ww.xinxi.push(id,text)
 * 
 *  
 * 添加 内容 text 到 id 窗口 最上面
 * ww.xinxi.unshift(id,text)
 * 
 * 
 * 删除 id 窗口 最后 内容
 * ww.xinxi.pop(id )
 * 
 *  
 * 删除 id 窗口 最上面 内容
 * ww.xinxi.unshift(id )
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */











var ww = ww || {}


ww.xinxi = {}

ww.xinxi.me0 = function (id) {
    this.type = 0
    this.id = id
}

ww.xinxi.me1 = function (id) {
    this.type = 1
    this.id = id
}

ww.xinxi.me2 = function (id) {
    this.type = 2
    this.id = id
}

ww.xinxi.Sprite_Picture_prototype_loadBitmap = Sprite_Picture.prototype.loadBitmap
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
        } else {
            var w = 300
            var h = 300
            var id = 0
        }
        var wb = new Sprite_XinXi(w, h, ww.xinxi.get(id))
        this._window = wb
        this.addChild(this._window)
        this.bitmap = new Bitmap(w, h)
    } else {
        ww.xinxi.Sprite_Picture_prototype_loadBitmap.call(this)
    }
}

ww.xinxi.Game_Interpreter_prototype_command101 = Game_Interpreter.prototype.command101
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


ww.xinxi._hash = {}

ww.xinxi.get = function (index) {
    if (!this._hash[index]) {
        this._hash[index] = new ww.xinxi.xinxi()
    }
    return this._hash[index]
}

ww.xinxi.set = function (index, o) {
    var xinxi = this.get(index)
    xinxi.set(o)
}

ww.xinxi.clear = function (index) {
    var xinxi = this.get(index)
    xinxi.clear()
}

ww.xinxi.push = function (index, list, type) {
    var xinxi = this.get(index)
    xinxi.push(list, type)
}

ww.xinxi.unshift = function (index, list) {
    var xinxi = this.get(index)
    xinxi.unshift(list)
}

ww.xinxi.push = function (index, list, type) {
    var xinxi = this.get(index)
    xinxi.push(list, type)
}


ww.xinxi.pop = function (index, type) {
    var xinxi = this.get(index)
    xinxi.pop(type)
}
ww.xinxi.shift = function (index) {
    var xinxi = this.get(index)
    xinxi.shift()
}
ww.xinxi.to = function (index, v) {
    var xinxi = this.get(index)
    xinxi.to(v)
}
ww.xinxi.toadd = function (index, v) {
    var xinxi = this.get(index)
    xinxi.toadd(v)
}

ww.xinxi.show = function (index) {
    var xinxi = this.get(index)
    xinxi.show()
}
ww.xinxi.hide = function (index) {
    var xinxi = this.get(index)
    xinxi.hide()
}


ww.xinxi.xinxi = function () {
    this.clear()
    this.show()
}

ww.xinxi.xinxi.prototype.clear = function () {
    this._all = []
    this._end = 0
    this._mustre = true
    this._clear = true
}

ww.xinxi.xinxi.prototype.set = function (o) {
    if (o && (typeof o == "object")) {
        for (var i in o) {
            this[i] = o[i]
        }
    }
}


ww.xinxi.xinxi.prototype.unshift = function (list) {
    this.push(list, true)
}

ww.xinxi.xinxi.prototype.push = function (list, type) {
    if (Array.isArray(list)) {
        for (var i = 0; i < list.length; i++) {
            var m = list[i]
            var m = "" + m
            var m = ArtWord.convertEscapeCharacters(m)
            if (type) {
                this._all.unshift(m)
            } else {
                this._all.push(m)
            }
        }
    } else {
        var m = list 
        var m = "" + m
        var m = ArtWord.convertEscapeCharacters(m)
        if (type) {
            this._all.unshift(m)
        } else {
            this._all.push(m)
        }
    }
    if (type) {
        this._end = 0
    } else {
        this._end = this._all.length - 1
    }
    this._mustre = true
};


ww.xinxi.xinxi.prototype.pop = function (type) {
    if (type) {
        this._all.shift()
    } else {
        this._all.pop()
    }
    this._mustre = true
};


ww.xinxi.xinxi.prototype.shift = function () {
    this.pop(true)
};

ww.xinxi.xinxi.prototype.to = function (end) {
    this._end = end || 0
    this._end.clamp(0, this._all.length - 1)
};


ww.xinxi.xinxi.prototype.toadd = function (v) {
    this.to(this._end + (v || 0))
};


ww.xinxi.xinxi.prototype.hide = function () {
    this._showing = false
};


ww.xinxi.xinxi.prototype.show = function () {
    this._showing = true
};


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

//设置原形 
Sprite_XinXi.prototype = Object.create(Sprite.prototype);
//设置创造者
Sprite_XinXi.prototype.constructor = Sprite_XinXi;
//初始化
Sprite_XinXi.prototype.initialize = function (w, h, get) {
    Sprite.prototype.initialize.call(this);
    this._get = get
    this._isEnd = true
    this._hash = {}
    this._showY = 0
    this.createBeiJing()
    this.createPage(w, h)
    this.createCbl()
    this.createCbhk()
    this.createClear()
    this.refresh()
    this.refreshShowY()
};


Sprite_XinXi._textHash = {}

/**创建页面 */
Sprite_XinXi.prototype.createPage = function (w, h) {
    //var w = this.getValue("pw") || 0
    //var h = this.getValue("ph") || 0
    this._pageW = w
    this._pageH = h
    if (!this._page) {
        this._page = new Sprite()
        this.addChild(this._page)
    }
    var b = new Bitmap(w, h)
    b.fillAll("#ffffff")
    this._page.bitmap = b


    if (!this._showSprite) {
        this._showSprite = new Sprite()
    }
    this.addChild(this._showSprite)


    this._showSprite.mask = this._page //setMask(s)  


    this.createSprites()
}

/**创建页面 */
Sprite_XinXi.prototype.createSprites = function () {
    this._sprites = []
    for (var i = 0; i < 20; i++) {
        var s = new Sprite()
        this._sprites.push(s)
        this._showSprite.addChild(s)
    }
}




/**创建背景 */
Sprite_XinXi.prototype.createCbl = function () {
    this._cbl = new Sprite()
    this.addChild(this._cbl)

    this._cbl.x = this.getValue("cblx")
    this._cbl.y = this.getValue("cbly")

    this._cblb = this.getValue("cblb") || ""
    this._cbl.bitmap = ImageManager.loadPicture(this._cblb)


}


/**更新背景 */
Sprite_XinXi.prototype.updateCbl = function () {

    var b = this.getValue("cblb") || ""
    if (this._cblb != b) {
        this._cblb = b
        this._cbl.bitmap = ImageManager.loadPicture(this._cblb)
    }
    if (this._cblb) {
        this._cbl.x = this._pageW + (this.getValue("cblx") || 0)
        this._cbl.y = this.getValue("cbly") || 0
    }
}





/**创建背景 */
Sprite_XinXi.prototype.createCbhk = function () {
    this._cbhk = new Sprite()
    this.addChild(this._cbhk)

    this._cbhk.x = this.getValue("cbhkx")

    this._cbhkb = this.getValue("cbhkb") || ""

    this._cbhk.bitmap = ImageManager.loadPicture(this._cbhkb)



}



/**更新侧边栏 */
Sprite_XinXi.prototype.updateCbhk = function () {
    var b = this.getValue("cbhkb") || ""
    if (this._cbhkb != b) {
        this._cbhkb = b
        this._cbhk.bitmap = ImageManager.loadPicture(this._cbhkb)
    }
    if (this._cbhkb) {
        this._cbhk.x = this._pageW + (this.getValue("cbhkx") || 0)
    }
}


/**创建背景 */
Sprite_XinXi.prototype.createBeiJing = function () {
    this._beijing = new Sprite()
    this.addChild(this._beijing)

    this._beijing.x = this.getValue("bjx") || 0
    this._beijing.y = this.getValue("bjy") || 0

    this._beijingb = this.getValue("bjb") || ""
    this._beijing.bitmap = ImageManager.loadPicture(this._beijingb)
}


/**更新背景 */
Sprite_XinXi.prototype.updateBeiJing = function () {
    var b = this.getValue("bjb") || ""
    if (this._beijingb != b) {
        this._beijingb = b
        this._beijing.bitmap = ImageManager.loadPicture(this._beijingb)
    }
    if (this._beijingb) {
        this._beijing.x = this.getValue("bjx") || 0
        this._beijing.y = this.getValue("bjy") || 0
    }
}


/**创建背景 */
Sprite_XinXi.prototype.createClear = function () {
    this._clearbutton = new Sprite()
    this.addChild(this._clearbutton)

    this._clearbutton.x = this.getValue("cbx") || 0
    this._clearbutton.y = this.getValue("cby") || 0

    this._clearbuttonb = this.getValue("cbb") || ""
    this._clearbutton.bitmap = ImageManager.loadPicture(this._clearbuttonb)


}


/**更新背景 */
Sprite_XinXi.prototype.updateClearButton = function () {
    var b = this.getValue("cbb") || ""
    if (this._clearbuttonb != b) {
        this._clearbuttonb = b
        this._clearbutton.bitmap = ImageManager.loadPicture(this._clearbuttonb)
    }
    if (this._clearbuttonb) {
        this._clearbutton.x = this.getValue("cbx") || 0
        this._clearbutton.y = this.getValue("cby") || 0
    }
}




Sprite_XinXi.prototype.getValue = function (name) {
    return this._get && this._get[name]
}


Sprite_XinXi.prototype.setValue = function (name, value) {
    this._get && (this._get[name] = value)
}



Sprite_XinXi.prototype.showing = function () {
    return this.getValue("_showing")
}

Sprite_XinXi.prototype.mustClear = function () {
    return this.getValue("_clear")
}

Sprite_XinXi.prototype.clearClear = function () {
    this.setValue("_clear")
}


Sprite_XinXi.prototype.allmessage = function () {
    return this.getValue("_all") || []
}


Sprite_XinXi.prototype.getmessage = function (index) {
    return this.allmessage()[index] || ""
}


Sprite_XinXi.prototype.end = function () {
    return this.getValue("_end")
}


Sprite_XinXi.prototype.mustRefresh = function () {
    return this.getValue("_mustre") || this._mustre
}


Sprite_XinXi.prototype.clearRefresh = function (v) {
    this._mustre = v
    return this.setValue("_mustre", v)
}


/**清除 */
Sprite_XinXi.prototype.clear = function () {
    this._allH = -1
    this.allh()
}



Sprite_XinXi.prototype.pageW = function () {
    return this._pageW
}



Sprite_XinXi.prototype.pageH = function () {
    return this._pageH
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
        if (this._hash[text]) { return this._hash[text] }
        var t = new Sprite_Art(this.pageW(), this.pageH(), text, 0, 0, 1)
        this._hash[text] = t.bitmap
        return this._hash[text]
    } else {
        return ImageManager.loadEmptyBitmap()
    }
}


Sprite_XinXi.prototype.spriteLength = function () {
    return this._sprites.length
}


Sprite_XinXi.prototype.getSprite = function (index) {
    var l = this.spriteLength()
    var i = ((index % l) + l) % l
    return this._sprites[i]
}





Sprite_XinXi.prototype.drawSprite = function (index) {
    var text = this.getmessage(index)
    var s = this.getSprite(index)
    if (s._text !== text) {
        s._text = text
        s.bitmap = this.drawText(text)
    }
    s.y = this._allHlist[index]
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


/**更新 */
Sprite_XinXi.prototype.update = function () {
    Sprite.prototype.update.call(this);
    if (this.showing()) {
        this.visible = true
        this.updateBeiJing()
        this.updateCbl()
        this.updateCbhk()
        this.updateClearButton()
        if (this.mustClear()) {
            this._isEnd = true
            this.clear()
            this.clearClear()
        }
        if (this.mustRefresh()) {
            this.refresh()
        }
        this.updateTouch()
        if (this.mustRefresh()) {
            if (this.end()) {
                this.showToYEnd()
            } else {
                this.refreshShowY()
            }
        }
    } else {
        this.visible = false
    }
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
Sprite_XinXi.prototype.refresh = function () {
    this.clear()
}



Sprite_XinXi.prototype.updateTouch = function () {
    if (TouchInput.isPressed()) {
        if (TouchInput.isTriggered()) {
            if (this._cbhk.isTouchInputThis()) {
                this._touch = "hk"
                this._touchX = TouchInput.x
                this._touchY = TouchInput.y
            } else if (this._cbl.isTouchInputThis()) {
                this._touch = "to"
                var loc = this._cbl.worldToLocalXY(TouchInput.x, TouchInput.y)
                this.onTo(loc.x, loc.y)
            } else if (this._clearbutton.isTouchInputThis()) {
                this._get.clear()
                this.clear()
                this.showToY(0)
            } else {
                this._touch = 0
            }
        } else if (TouchInput.isMoved()) {
            if (this._touch == "hk") {
                this.onMove(TouchInput.x - this._touchX, TouchInput.y - this._touchY)
                this._touchX = TouchInput.x
                this._touchY = TouchInput.y
            }
        }
    } else {
        this._touch = 0
    }
}



Sprite_XinXi.prototype.onTo = function (x, y) {
    if (this._cblb) {
        var y = y / this._cbl.bitmap.height * this._allH
    } else {
        var y = y / this._pageH * this._allH
    }
    this.showToY(y)
}


Sprite_XinXi.prototype.onMove = function (x, y) {
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
    this.moveScrollBarToShow()
    this.setScrollBarScale()
}

/**显示内容到y处 */
Sprite_XinXi.prototype.showToY = function (y) {
    this.allh()
    this._showY = Math.max(0, Math.min(y, this._allH - this._pageH))
    var z = this._allH - this._pageH
    if (z <= 0 || this._showY == this._allH - this._pageH) {
        this._isEnd = true
    } else {
        this._isEnd = false
    }
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



Bitmap.prototype._drawTextOutline = function (text, tx, ty, maxWidth) {
    if (!this.outlineWidth) { return }
    //环境 = 环境
    var context = this._context;
    //环境 笔触模式 = 
    context.strokeStyle = this.outlineColor;
    //环境 
    context.lineWidth = this.outlineWidth;
    context.lineJoin = 'round';
    context.strokeText(text, tx, ty, maxWidth);
};


Bitmap.prototype._makeFontNameText = function () {
    //黑体 + 斜体 + 大小 + 字体
    return (this.fontBold ? "Bold " : '') + (this.fontItalic ? 'Italic ' : '') +
        this.fontSize + 'px ' + this.fontFace;
};


function ArtWord() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
//ArtWord.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
ArtWord.prototype.constructor = ArtWord;

ArtWord.deepCopy = function (that) {
    var obj
    if (typeof (that) === "object") {
        if (that === null) {
            obj = null;
        } else if (Array.isArray(that)) { //Object.prototype.toString.call(that) === '[object Array]') { 
            obj = [];
            for (var i = 0; i < that.length; i++) {
                obj[i] = this.deepCopy(that[i]);
            }
        } else {
            obj = {}
            for (var i in that) {
                obj[i] = this.deepCopy(that[i])
            }
        }
    } else {
        obj = that
    }
    return obj;
};



ArtWord.convertEscapeCharacters = function (text) {
    //替换\为\xlb
    text = text.replace(/\\/g, '\x1b');
    //替换\xlb\xlb 为 \\
    text = text.replace(/\x1b\x1b/g, '\\');
    //替换\xlbV[n]为  变量 
    text = text.replace(/\x1bV\[(\d+)\]/gi, function () {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    //替换\xlbV[n]为  变量 
    text = text.replace(/\x1bV\[(\d+)\]/gi, function () {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bN\[(\d+)\]/gi, function () {
        return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bP\[(\d+)\]/gi, function () {
        return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    return text;
};
/**角色名称 */
ArtWord.actorName = function (n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.name() : '';
};
/**队伍成员名称 */
ArtWord.partyMemberName = function (n) {
    var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
    return actor ? actor.name() : '';
};

/**
 * 初始化
 * 
 * @param {number} aw  0 初始  
 * 1 初始内适合大小  
 * 2 适合大小
 * 
 * @param {number} ah  0 初始  
 * 1 初始内适合大小  
 * 2 适合大小
 */
ArtWord.prototype.initialize = function (w, h) {
    //Sprite.prototype.initialize.call(this);
    this._artWidth = w || 0
    this._artHeight = h || 0
    this.bitmap = new Bitmap(w, h)
    this.contents = this.bitmap
};


ArtWord.prototype.artWidth = function () {
    return this._artWidth
};

ArtWord.prototype.artHeight = function () {
    return this._artHeight
};


ArtWord._iconWidth = 32
ArtWord._iconHeight = 32

ArtWord.prototype.standardFontBold = function () {
    return false
};

/** */
ArtWord.prototype.standardFontItalic = function () {
    return false
};

/**标准字体 */
ArtWord.prototype.standardFontFace = function () {
    //返回 游戏字体
    return 'GameFont';

};

/**字体设置 */
ArtWord.prototype.fontSettings = function (i) {
    if (i || !this.contents._fontnametext) {
        this.contents._fontnametext = this.contents._makeFontNameText()
    }
    return this.contents._fontnametext
};


ArtWord.prototype.standardTextColor = function () {
    return '#ffffff';
};

ArtWord.prototype.standardFontSize = function () {
    return 20;
};

/**文本高 */
ArtWord.prototype.standardOutlineColor = function () {
    return 'rgba(0, 0, 0, 0.5)';
};
ArtWord.prototype.standardOutlineWidth = function () {
    return 4;
};

ArtWord.textColors = [
    '#ffffff',
]

ArtWord.prototype.textColor = function (index) {
    return ArtWord.textColors[index];
};

/**还原 */
ArtWord.prototype.resetFontSettings = function () {
    this.contents.textColor = this.standardTextColor()
    this.contents.fontItalic = this.standardFontItalic()
    this.contents.fontBold = this.standardFontBold()
    this.contents.fontFace = this.standardFontFace();
    this.contents.fontSize = this.standardFontSize();
    this.contents.outlineColor = this.standardOutlineColor();
    this.contents.outlineWidth = this.standardOutlineWidth();


    this.fontSettings(1)
    this.resetTextColor();
    this.reHjg()
    this.reWjg()
};


ArtWord.prototype.resetTextColor = function () {
    this.changeTextColor(this.normalColor());
};


/**普通颜色 */
ArtWord.prototype.normalColor = function () {
    return this.textColor(0);
};

ArtWord.prototype.changeTextColor = function (color) {
    this.contents.textColor = color;
};

ArtWord.prototype.saveFontSettings = function (bitmap) {
    if (bitmap) {
        var fontSet = {
            textColor: bitmap.textColor,
            fontItalic: bitmap.fontItalic,
            fontBold: bitmap.fontBold,
            fontFace: bitmap.fontFace,
            fontSize: bitmap.fontSize,
            outlineColor: bitmap.outlineColor,
            outlineWidth: bitmap.outlineWidth
        }

    } else {
        var fontSet = {
            textColor: this.standardTextColor(),
            fontItalic: this.standardFontItalic(),
            fontBold: this.standardFontBold(),
            fontFace: this.standardFontFace(),
            fontSize: this.standardFontSize(),
            outlineColor: this.standardOutlineColor(),
            outlineWidth: this.standardOutlineWidth(),
        }
    }
    return fontSet
}


ArtWord.prototype.loadFontSettings = function (bitmap, fontSet) {
    if (fontSet && bitmap) {
        bitmap.textColor = fontSet.textColor
        bitmap.fontItalic = fontSet.fontItalic
        bitmap.fontBold = fontSet.fontBold
        bitmap.fontFace = fontSet.fontFace
        bitmap.fontSize = fontSet.fontSize
        bitmap.outlineColor = fontSet.outlineColor
        bitmap.outlineWidth = fontSet.outlineWidth
    }

}




/**文本高 */
ArtWord.prototype.calcTextHeight = function () {
    var maxFontSize = this.contents.fontSize;
    var textHeight = maxFontSize + this.contents.outlineWidth * 2;
    return textHeight;
};

/**文本宽
 * @param {string} text 文本
 * @returns {number} 文本宽
 */
ArtWord.prototype.calcTextWidth = function (text) {
    return this.contents.measureTextWidth(text);
};

ArtWord.prototype.makePage = function (textState) {
    var page = {
        "type": "page",
        "set": {},
        "list": [],
        "test": { "x": 0, "y": 0, "w": 0, "h": 0 }
    }
    page.set = ArtWord.deepCopy(textState.pageset)
    return page
};
ArtWord.prototype.makeLine = function (textState) {
    return { "type": "line", "list": [], "texts": [], "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};
ArtWord.prototype.makeText = function (textState) {
    return { "type": "text", "text": "", "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};
ArtWord.prototype.makeIcon = function (textState) {
    return { "type": "icon", "icon": "", "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};
ArtWord.prototype.makeLCFText = function (textState) {
    return { "type": "lcf", "lcf": "", "lcfwh": { "w": 0, "h": 0 }, "list": [] }
};
/**测试文字增强 */
ArtWord.prototype.testTextEx = function (text, x, y, w, h, wt, ht, facepos, wz, aw, ah) {
    var text = text || ""
    var draw = { x: x || 0, y: y || 0 }
    var pageset = {
        w: w || Infinity,
        h: h || Infinity,
        wtype: wt,
        htype: ht,
        autow: aw,
        autoh: ah,
        facepos: facepos || 0,
        wz: wz || 0,
        draw: draw
    }
    var t = this.convertEscapeCharacters(text)
    var textState = {
        text: t,
        textindex: 0,
        tsl: [],
        textf: {},
        index: 0,
        pages: [],
        list: [],
        pageset: pageset,
    };

    this.resetFontSettings();

    this.tslPushAll(textState)

    this.testMakePages(textState)

    this.testMakeList(textState)

    this.resetFontSettings();
    return textState;
};
/**转换换码字符 */

ArtWord.prototype.convertEscapeCharacters = function (text) {
    //替换\为\xlb
    text = text.replace(/\\/g, '\x1b');
    //替换\xlb\xlb 为 \\
    text = text.replace(/\x1b\x1b/g, '\\');
    //替换\xlbV[n]为  变量 
    text = text.replace(/\x1bV\[(\d+)\]/gi, function () {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    //替换\xlbV[n]为  变量 
    text = text.replace(/\x1bV\[(\d+)\]/gi, function () {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bN\[(\d+)\]/gi, function () {
        return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bP\[(\d+)\]/gi, function () {
        return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    return text;
};
/**角色名称 */
ArtWord.prototype.actorName = function (n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.name() : '';
};
/**队伍成员名称 */
ArtWord.prototype.partyMemberName = function (n) {
    var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
    return actor ? actor.name() : '';
};


/**设置绘制xy */
ArtWord.prototype.setDrawxy = function (textState, draw) {
    if (textState && draw) {
        textState.draw = draw
        return textState;
    } else {
        return null;
    }
};

/**设置页设置 */
ArtWord.prototype.setTextPageset = function (textState, pageset) {
    if (textState && pageset) {
        textState.pageset = pageset
        return textState;
    } else {
        return null;
    }
};


/**制作页 */
ArtWord.prototype.testMakePages = function (textState) {
    if (textState) {
        var list = textState.tsl || []
        textState.pages = []
        for (var i = 0; i < list.length; i++) {
            var obj = list[i]
            var type = obj.type
            if (type == "page") {
                var page = this.makePage(textState)
                page.set = obj.set
                this.testPushPage(textState, page)
                //重设间隔 
                this.rejg()
            } else if (type == "line") {
                var line = this.makeLine()
                this.testPushLine(textState, line)
            } else if (type == "icon") {
                this.testPushText(textState, obj)
            } else if (type == "text") {
                this.testPushText(textState, obj)
            } else if (type == "lcf") {
                this.testPushLCFText(textState, obj)
            } else if (type == "wjg") {
                this.setWjg(obj.value)
            } else if (type == "hjg") {
                this.setHjg(obj.value)
            } else {
                this.testPushOther(textState, obj)
            }
        }
        this.testPushEnd(textState)
        return textState
    } else {
        return null
    }
};


/**测试列表 */
ArtWord.prototype.testMakeList = function (textState) {
    if (textState && textState.pages) {
        textState.list = []
        for (var pi = 0; pi < textState.pages.length; pi++) {
            var p = textState.pages[pi]
            textState.list.push(p)
            if (p && p.list) {
                for (var li = 0; li < p.list.length; li++) {
                    var l = p.list[li]
                    textState.list.push(l)
                    if (l && l.list) {
                        for (var ci = 0; ci < l.list.length; ci++) {
                            var c = l.list[ci]
                            if (c) {
                                textState.list.push(c)
                            }
                        }
                    }
                }
            }
        }
        return textState
    } else {
        return null
    }
};


ArtWord.prototype.indexCharacter = function (textState, index) {
    return textState.list[index];
};

ArtWord.prototype.needsCharacter = function (textState) {
    return this.indexCharacter(textState, textState.index)
};


ArtWord.prototype.nextCharacter = function (textState) {
    return this.indexCharacter(textState, textState.index + 1)
};

/**绘制文本状态 */
ArtWord.prototype.drawTextState = function (textState, index) {
    if (textState) {
        if (index !== undefined) {
            textState.index = index
        }
        if (!textState.index) {
            this.resetFontSettings();
        }
        if (textState.index < textState.list.length) {
            this.processDrawCharacter(textState);
            textState.index += 1
            return false
        }
    }
    return true
};

/**绘制某一页 */
ArtWord.prototype.drawTextStatePage = function (textState, pageIndex) {
    if (textState) {
        var textState = textState;
        var pageIndex = pageIndex || 0
        this.resetFontSettings();
        var pi = 0
        while (textState.index < textState.list.length) {
            this.processDrawCharacter(textState);
            textState.index += 1
            if (this.needsNewPage(textState)) {
                if (pi == pageIndex) {
                    break
                } else {
                    pi++
                }
            }
        }
        this.resetFontSettings();
        return textState.pages[0].test.w;
    } else {
        return 0;
    }
};

/** */
ArtWord.prototype.drawTextEx = function (text, x, y, w, h, p, l) {
    if (text) {
        var textState = this.testTextEx(text, x, y, w, h, p, l);
        this.resetFontSettings();
        while (textState.index < textState.list.length) {
            this.processDrawCharacter(textState);
            textState.index += 1
            if (this.needsNewPage(textState)) {
                break
            }
        }
        this.resetFontSettings();
        return textState.pages[0].test.w;
    } else {
        return 0;
    }
};



/**绘制 */
ArtWord.prototype.drawTextEx2 = function (text, x, y, w, h, p, l) {
    if (text) {
        var textState = this.testTextEx(text, x, y, w, h, p, l);
        this.resetFontSettings();
        while (textState.index < textState.list.length) {
            this.processDrawCharacter(textState);
            textState.index += 1
            if (this.needsNewPage(textState)) {
                break
            }
        }
        this.resetFontSettings();
        return textState.pages[0].test.h;
    } else {
        return 0;
    }
};

/**添加所有 */
ArtWord.prototype.tslPushAll = function (textState) {
    this.tslPushHear(textState)
    while (textState.textindex < textState.text.length) {
        this.tslPushCharacter(textState);
    }
    this.tslPushEnd(textState)
};

/**测试添加头 */
ArtWord.prototype.tslPushHear = function (textState) {
    textState.textindex = 0
    if (textState.text[0] == '\x1b') {
        if (this.tslPushEscapeCode(textState) == "Y") {
            this.tslPushNewPageY(textState)
            return
        }
    }
    if (!textState.page) {
        this.tslPushPage(textState)
        this.tslPushLine(textState)
    }
    textState.textindex = 0
};

/**测试 添加尾 */
ArtWord.prototype.tslPushEnd = function (textState) {
    textState.textindex = 0
    delete textState.page
    delete textState.line
};


/**添加其他 */
ArtWord.prototype.tslPush = function (textState, obj) {
    textState.tsl.push(obj)
};


/**测试添加页 */
ArtWord.prototype.tslPushPage = function (textState, page) {
    var page = page || this.makePage(textState)
    textState.page = page
    this.tslPush(textState, page)
};


/**测试添加行 */
ArtWord.prototype.tslPushLine = function (textState, line) {
    var line = line || this.makeLine()
    var page = textState.page
    textState.line = line
    this.tslPush(textState, line)
};


/**页设置脸图 */
ArtWord.prototype.tslPushPic = function (textState, pic) {
    if (pic) {
        //ImageManager.loadPicture(pic.name)
        var page = textState.page
        page.set.ps = page.set.ps || {}
        page.set.ps[pic.index] = pic.name
        this.tslPush(textState, pic)
    }
}



/**页设置脸图 */
ArtWord.prototype.tslPushFace = function (textState, face) {
    if (face) {
        ImageManager.loadFace(face.name)
        if (face.pos == 1 || face.pos == 0) {
            var pid = -1
        } else {
            var pid = -2
        }

        page.set.ps = page.set.ps || {}
        page.set.ps[pid] = face.name
        this.tslPush(textState, face)
    }
}


/**添加字符 */
ArtWord.prototype.tslPushOther = function (textState, text) {
    if (text) {
        this.tslPush(textState, text)
    }
};
//****************************************************************** */

/**测试添加页 */
ArtWord.prototype.testPushPage = function (textState, page) {
    /**处理上一个页 */
    this.testPushLine(textState, 0, 1)
    var page = page || this.makePage(textState)
    textState.page = page
    textState.pages.push(page)
    textState.line = null
};


/**测试添加行 */
ArtWord.prototype.testPushLine = function (textState, line, cs) {
    var line = line || this.makeLine()
    var page = textState.page
    var line0 = textState.line
    /**有页时 */
    if (page) {
        /**有上一行时 */
        if (line0) {
            var must = page.set

            //有限定行数时 
            var ph = page.test.h
            var lh = line0.test.h
            //间隔
            var jh = (ph == 0 || lh == 0) ? 0 : this.getHjg() || 0

            line0.test.y = page.test.h + jh
            page.test.h = line0.test.h + line0.test.y

            page.test.w = Math.max(page.test.w, line0.test.w)
            var fw = ArtWord._faceWidth + 24
            var w = must.w - (page.set.facepos == 3 ? fw * 2 : page.set.facepos ? fw : 0)
            var h = must.h
            /**处理宽 */
            if (w != Infinity) {
                if (line0.test.w < w) {
                    if (must.wtype === 1) {
                        /**中心对齐 */
                        line0.test.x = (w - line0.test.w) / 2
                    } else if (must.wtype === 2) {
                        /**右对齐 */
                        line0.test.x = (w - line0.test.w)
                    }
                } else {
                    /**左对齐 */
                    line0.test.x = 0
                }
            }
            /**处理高 */
            if (h != Infinity) {
                if (page.test.h < h) {
                    if (must.htype == 1 || page.set.htype === 1) {
                        page.test.y = (h - page.test.h) / 2
                    } else if (must.htype == 2) {
                        page.test.y = (h - page.test.h)
                    }
                } else {
                    page.test.y = 0
                }
            }
            page.list.push(line0)
        }
    }
    if (cs) { return }
    textState.line = line
};


ArtWord.prototype.testPushLCFText = function (textState, lcftext) {
    var lcftext = lcftext || this.makeLCFText()

    var list = lcftext.list

    if (!list.length) {
        return
    }


    var lcf = lcftext.lcf

    var lcfwh = lcftext.lcfwh
    var lcfw = lcfwh.w


    var line = textState.line
    var page = textState.page
    var pageset = page.set

    //====处理字====
    var lw = line.test.w
    var tw = text.test.w
    //宽间隔
    var jw = (lw == 0 || tw == 0) ? 0 : this.getWjg() || 0
    var sw = pageset.w
    var fw = ArtWord._faceWidth + 24
    var fw = page.set.facepos == 3 ? fw * 2 : page.set.facepos ? fw : 0


    var syw = sw - fw - lw - jw

    var rel = []
    var rei = -1
    var odw = 0
    var rel2 = []
    for (var i = 0; i < list.length; i++) {
        var re = list[i]
        odw += re.w
        if (odw + ((i == list.length - 1) ? 0 : lcfw) <= syw) {
            rei = i
        }
    }

    //如果第一个都放不下
    if (rei == -1) {
        //如果是开头
        if (lw == 0) {
            var text = this.makeText()
            text.text = re[0].text
            text.test.w = re[0].w
            text.test.h = re[0].h
            //添加字符 
            text.test.x = lw + jw
            line.test.w = text.test.x + tw
            line.test.h = Math.max(line.test.h, text.test.h)
            this.testPushLineText(textState, text)

            //====处理行====
            var ph = page.test.h
            var lh = line.test.h
            //间隔
            var jh = (ph == 0 || lh == 0) ? 0 : this.getHjg() || 0
            var sh = pageset.h
            //行能放到页中 
            if (ph + jh + lh <= sh || ph == 0) {
                //不能放到页中 或者 不是第一行
            } else {
                //添加新页
                textState.line = null
                var page2 = this.makePage(textState)
                page2.type = "addpage"
                page2.set = ArtWord.deepCopy(page.set)
                this.testPushPage(textState, page2)
                //行添加到新页
                this.testPushLine(textState, line)
            }
            rei = 0
        } else {
            //判断是否添加新页
            if (pageset.hl && page.list.length >= pageset.hl) {
                textState.line = null
                var page2 = this.makePage(textState)
                page2.type = "addpage"
                page2.set = ArtWord.deepCopy(page.set)
                this.testPushPage(textState, page2)
            }
            //添加新行
            var line2 = this.makeLine()
            line2.type = "addline"
            line2.set = line.set
            this.testPushLine(textState, line2)
        }
    } else {
        for (var i = 0; i <= rei; i++) {
            var text = this.makeText()
            text.text = re[i].text
            text.test.w = re[i].w
            text.test.h = re[i].h
            //添加字符 
            text.test.x = lw + jw
            line.test.w = text.test.x + tw
            line.test.h = Math.max(line.test.h, text.test.h)
            this.testPushLineText(textState, text)

        }
        //如果不是到达最后一个
        if (rei < list.length - 1) {
            var text = this.makeText()
            text.text = lcftext.lcf
            text.test.w = lcftext.lcfwh.w
            text.test.h = lcftext.lcfwh.h
            //添加字符 
            text.test.x = lw + jw
            line.test.w = text.test.x + tw
            line.test.h = Math.max(line.test.h, text.test.h)
            this.testPushLineText(textState, text)
        }
        //====处理行====
        var ph = page.test.h
        var lh = line.test.h
        //间隔
        var jh = (ph == 0 || lh == 0) ? 0 : this.getHjg() || 0
        var sh = pageset.h
        //行能放到页中 
        if (ph + jh + lh <= sh || ph == 0) {
            //不能放到页中 或者 不是第一行
        } else {
            //添加新页
            textState.line = null
            var page2 = this.makePage(textState)
            page2.type = "addpage"
            page2.set = ArtWord.deepCopy(page.set)
            this.testPushPage(textState, page2)
            //行添加到新页
            this.testPushLine(textState, line)
        }
    }


    var lclist2 = []
    for (var i = rei + 1; i < list.length; i++) {
        lclist2.push(list[i])
    }
    if (lclist2.length) {
        var lcftext2 = this.makeLCFText()
        lcftext2.lcf = lcf
        lcftext2.lcfwh = lcfwh
        lcftext2.list = lclist2
        //处理下一个
        this.testPushLCFText(textState, lcftext2)
    }
};

/**添加字符 */
ArtWord.prototype.testPushText = function (textState, text) {
    var text = text || this.makeText()
    var line = textState.line
    var page = textState.page
    var pageset = page.set

    //====处理字====
    var lw = line.test.w
    var tw = text.test.w
    //宽间隔
    var jw = (lw == 0 || tw == 0) ? 0 : this.getWjg() || 0
    var sw = pageset.w
    var fw = ArtWord._faceWidth + 24
    var fw = page.set.facepos == 3 ? fw * 2 : page.set.facepos ? fw : 0

    var wlp = pageset.wl && line.texts.length >= pageset.wl
    //行可以放开字  或者 第一个
    if (!wlp && (lw + jw + tw <= sw - fw || lw == 0)) {
        //添加字符 
        text.test.x = lw + jw
        line.test.w = text.test.x + tw
        line.test.h = Math.max(line.test.h, text.test.h)
        this.testPushLineText(textState, text)


        var hlp = pageset.hl && page.list.length >= pageset.hl

        //====处理行====
        var ph = page.test.h
        var lh = line.test.h
        //间隔
        var jh = (ph == 0 || lh == 0) ? 0 : this.getHjg() || 0
        var sh = pageset.h
        //行能放到页中 
        if (!hlp && (ph + jh + lh <= sh || ph == 0)) {
            //不能放到页中 或者 不是第一行
        } else {
            //添加新页
            textState.line = null
            var page2 = this.makePage(textState)
            page2.type = "addpage"
            page2.set = ArtWord.deepCopy(page.set)
            this.testPushPage(textState, page2)
            //行添加到新页 
            this.testPushLine(textState, line)
        }
    }
    //行放不开
    else {

        /**单个空格的话不添加到新行 */
        if (text.ge && text.text == " ") {
            //添加新行
            var line2 = this.makeLine()
            line2.type = "addline"
            line2.set = line.set
            this.testPushLine(textState, line2)
            return
        }

        //添加新行
        var line2 = this.makeLine()
        line2.type = "addline"
        line2.set = line.set
        this.testPushLine(textState, line2)
        this.testPushText(textState, text)
    }
};

/**添加其他 */
ArtWord.prototype.testPushOther = function (textState, obj) {
    textState.line.list.push(obj)
};


ArtWord.prototype.testPushLineText = function (textState, obj) {
    textState.line.texts.push(obj)
    textState.line.list.push(obj)
};

/**添加结束 */
ArtWord.prototype.testPushEnd = function (textState) {
    this.testPushLine(textState, 0, 1)
};

/***************************************************************************** */


//处理字符
ArtWord.prototype.tslPushCharacter = function (textState) {
    //检查 文本状态 文本[文本状态 索引]
    switch (textState.text[textState.textindex]) {
        //当 "\n"
        case '\n':
            //处理新行( 文本状态 )
            this.tslPushNewLine(textState);
            break;
        case '\f':
            this.tslPushNewPage(textState);
            break;
        case '\x1b':
            this.tslPushEscapeCharacter(textState, this.tslPushEscapeCode(textState));
            break;
        default:
            this.tslPushNormalCharacter(textState);
            break;
    }
};

/**文本状态列表 添加处理字符 */
ArtWord.prototype.tslPushEscapeCode = function (textState) {
    textState.textindex++;
    var regExp = /^[\$\.\|\^!><\{\}\\\/\=]|^[A-Z]+/i;
    var arr = regExp.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return arr[0].toUpperCase();
    } else {
        return '';
    }
};

/**文本状态列表 添加处理字符 */
ArtWord.prototype.tslPushEscapeCharacter = function (textState, code) {
    switch (code) {
        case 'C':
            this.tslPushTextColor(textState, this.tslPushTextColorEscapeParam(textState));
            break;
        case 'K':
            this.tslPushKongGe(textState);
            break;
        case 'I':
            this.tslPushDrawIcon(textState, this.tslPushEscapeParam(textState));
            break;
        case '{':
            this.tslPushChangeFontSize(textState, 1);
            break;
        case '}':
            this.tslPushChangeFontSize(textState, -1);
            break;
        case '=':
            this.tslPushChangeFontBlod(textState);
            break;
        case '/':
            this.tslPushChangeFontItalic(textState);
            break;
        case 'OC':
            this.tslPushOutColor(textState, this.tslPushTextColorEscapeParam(textState));
            break;

        case 'NL':
            this.tslPushNewLine(textState, this.tslPushEscapeParam(textState, 0));
            textState.textindex--
            break;
        case 'OW':
            this.tslPushOutWidth(textState, this.tslPushEscapeParam(textState, 0));
            break;
        case 'WJ':
            this.tslPushWJ(textState, this.tslPushEscapeParam(textState, 0));
            break;
        case 'HJ':
            this.tslPushHJ(textState, this.tslPushEscapeParam(textState, 0));
            break;
        case 'Y':
            this.tslPushNewPageY(textState)
            break
        case 'NY':
            this.tslPushNewPageY2(textState)
            break
        case 'F':
            this.tslPushFaceParam(textState)
            break;
        case 'HT':
            this.tslPushHT(textState, this.tslPushEscapeParam(textState, 0))
            break
        case 'WT':
            this.tslPushWT(textState, this.tslPushEscapeParam(textState, 0))
            break
        case 'AH':
            this.tslPushAH(textState, this.tslPushEscapeParam(textState, 0))
            break
        case 'AW':
            this.tslPushAW(textState, this.tslPushEscapeParam(textState, 0))
            break
        case 'WH':
            this.tslPushWH(textState, this.tslPushEscapeParamEx(textState))
            break
        case 'DXY':
            this.tslPushDXY(textState, this.tslPushEscapeParamEx(textState))
            break
        case 'TWH':
            this.tslPushTWH(textState, this.tslPushEscapeParamEx(textState))
            break
        case 'CWH':
            this.makeNewContents(textState, this.tslPushEscapeParamEx(textState));
            break;
        case 'FF':
        case 'FFR':
        case 'FS':
        case 'FSR':
        case 'FC':
        case 'FCR':
        case 'FI':
        case 'FB':
        case 'FR':
            this.setF(code, this.obtainEscapeParamExs(textState), textState)
            break;
    }
};




ArtWord.prototype.obtainEscapeParamExs = function (textState) {
    var arr = /^\[\[(.*?)\]\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        var re = "[" + arr[1] + "]"
        return JSON.parse(re)
    }
    return arr;
};


ArtWord.prototype.setF = function (code, list, textState) {
    switch (code) {
        //当 "C"
        case 'FF':
            this.contents.fontFace = list[0]
            break;
        case 'FFR':
            this.contents.fontFace = this.standardFontFace();
            break;
        case 'FS':
            this.contents.fontSize = list[0]
            break;
        case 'FSR':
            this.contents.fontSize = this.standardFontSize();
            break;
        case 'FC':
            this.changeTextColor(list[0]);
            break;
        case 'FCR':
            this.resetTextColor()
            break;
        case 'FI':
            this.contents.fontItalic = list[0]
            break;
        case 'FB':
            this.contents.fontBold = list[0]
            break;
        case 'FR':
            this.resetFontSettings()
            break;
    };
    if (textState) {
        this.tslPushParam(textState, code, list)
    }
}





/**设置底显示  */
/*
ArtWord.prototype.setBackShow = function(list, textState) {
    this._windowSpriteContainer.visible = (list[0]) ? true : false
};

*/

/**脸图位置 */
ArtWord.prototype.facePos = function () {
    return this._facepos || 0
}



/**设置宽间隔 */
ArtWord.prototype.setWjg = function (jg) {
    this._wjg = jg || 0
};

/**设置宽间隔 */
ArtWord.prototype.getWjg = function () {
    return this._wjg
};

ArtWord.prototype.reWjg = function () {
    this.setWjg(0)
};


ArtWord.prototype.setHjg = function (jg) {
    this._hjg = jg || 0
};

ArtWord.prototype.getHjg = function () {
    return this._hjg
};

ArtWord.prototype.reHjg = function () {
    this.setHjg(0)
};


ArtWord.prototype.setKg = function (jg) {
    this._kg = jg || 0
};
ArtWord.prototype.reKg = function () {
    this.setKg(0)
};


ArtWord.prototype.rejg = function () {
    this.reWjg()
    this.reHjg()
};


/**文本状态列表 添加行间隔 */
ArtWord.prototype.tslPushWJ = function (textState, wjg) {
    this.setWjg(wjg)
    var obj = {
        "type": "wjg",
        "value": wjg
    }
    this.tslPushOther(textState, obj)
};

/**文本状态列表 添加宽间隔 */
ArtWord.prototype.tslPushHJ = function (textState, hjg) {
    this.setHjg(hjg)
    var obj = {
        "type": "hjg",
        "value": hjg
    }
    this.tslPushOther(textState, obj)
};



ArtWord.prototype.tslPushDXY = function (textState, list) {
    if (textState && textState.page && textState.page.set) {
        textState.page.set.draw.x = (list[0] || 0) * 1
        textState.page.set.draw.y = (list[1] || 0) * 1
    }
    var obj = {
        "type": "dxy",
        "value": list
    }
    this.tslPushOther(textState, obj)
};

ArtWord.prototype.tslPushWH = function (textState, list) {
    if (textState && textState.page && textState.page.set) {
        textState.page.set.w = (list[0] || 0) * 1
        textState.page.set.h = (list[1] || 0) * 1
    }
    var obj = {
        "type": "wh",
        "value": list
    }
    this.tslPushOther(textState, obj)
};

ArtWord.prototype.makeNewContents = function (textState, list) {
    var w = (list && (list[0] || 0) * 1) || this.artWidth();
    var h = (list && (list[1] || 0) * 1) || this.artHeight()
    this.bitmap.initialize(w, h)
    this.bitmap.clear()
    this.contents = this.bitmap;

    this.resetFontSettings();
};

/**添加新行 */
ArtWord.prototype.tslPushNewLine = function (textState) {
    textState.textindex++;
    this.tslPushLine(textState)
};

/**进行行对象 */
ArtWord.prototype.tslPushNewLineL = function (textState) {
    var line = textState.line
    var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        line.cs = arr[1]
    }
};

/**进行新页对象 */
ArtWord.prototype.tslPushNewPage = function (textState) {
    textState.textindex++
    this.tslPushPage(textState)
    this.tslPushLine(textState)
    this.resetFontSettings();
};

/**进行新页对象 */
ArtWord.prototype.tslPushNewPageY = function (textState) {
    var page = this.makePage(textState)

    var line = this.makeLine(textState)
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        textState.textindex += arr[0].length;
        page.set.wz = arr[1] * 1
    }
    this.tslPushPage(textState, page)
    this.tslPushLine(textState, line)
    this.resetFontSettings();
};

ArtWord.prototype.tslPushNewPageY2 = function (textState) {
    var page = this.makePage(textState)

    var line = this.makeLine(textState)
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        textState.textindex += arr[0].length;
    }
    if (textState.page) {
        page.set = textState.page.set

    }
    this.tslPushPage(textState, page)
    this.tslPushLine(textState, line)
    this.resetFontSettings();
};

/**添加排版横向种类 */
ArtWord.prototype.tslPushWT = function (textState, wjg) {
    textState.page.set.wtype = wjg
};

/**添加排版竖向向种类 */
ArtWord.prototype.tslPushHT = function (textState, wjg) {
    textState.page.set.htype = wjg
};


/**添加自动宽种类 */
ArtWord.prototype.tslPushAW = function (textState, wjg) {
    textState.page.set.autow = wjg
};

/**添加自动高种类 */
ArtWord.prototype.tslPushAH = function (textState, wjg) {
    textState.page.set.autoh = wjg
};

ArtWord.textf = {}

/**处理正常字符 */
ArtWord.prototype.tslPushNormalCharacter = function (textState) {
    //c = 文本状态 [文本状态 索引++]

    if (this._kg) {
        var regExp = /^(\w+-?)+/i;
        var arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            if (arr[0]) {
                var t = arr[0]
                textState.textindex += t.length
                var tl = t.split("-")
                if (tl.length > 1) {
                    var obj = this.makeLCFText()
                    obj.lcfwh = this.loadText("-")
                    for (var i = 0; i < tl.length; i++) {
                        var fc = tl[i]
                        var re = this.loadText(fc)
                        var o = { text: fc }
                        o.w = re.w
                        o.h = re.h
                        obj.list.push(o)
                    }
                    this.tslPushOther(textState, obj)
                    return
                } else {
                    var re = this.loadText(t)
                    var text = this.makeText()
                    text.text = t
                    text.test.w = re.w
                    text.test.h = re.h
                    this.tslPushOther(textState, text)
                }
                return
            }
        }
        var regExp = /^ +/i;
        var arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            if (arr[0]) {
                var t = arr[0]
                textState.textindex += t.length
                var tl = this.loadText(t)
                var text = this.makeText()
                text.text = t
                text.test.w = re.w
                text.test.h = re.h
                this.tslPushOther(textState, text)
                return
            }
        }
    }
    var c = textState.text[textState.textindex++];
    var re = this.loadText(c)
    var text = this.makeText()
    text.text = c
    text.test.w = re.w
    text.test.h = re.h
    this.tslPushOther(textState, text)
};


/**设置改变粗体 */
ArtWord.prototype.tslPushKongGe = function (textState) {

    this.setKg(!this._kg)
    var obj = {
        "type": "liancifu",
        "value": this._kg
    }
    this.tslPushOther(textState, text)
}



/**读取文字 */
ArtWord.prototype.loadText = function (c) {
    //w = c 文本宽 
    var f = this.fontSettings()
    var textf = ArtWord.textf
    if (textf[f]) {
        if (textf[f][c]) {
            var w = textf[f][c]["w"]
            var h = textf[f][c]["h"]
        } else {
            var w = this.calcTextWidth(c);
            var h = this.calcTextHeight()
            textf[f][c] = { w: w, h: h }
        }
    } else {
        textf[f] = {}
        var w = this.calcTextWidth(c);
        var h = this.calcTextHeight()
        textf[f][c] = { w: w, h: h }
    }
    return textf[f][c]
}

/**添加空白文本宽高 */
ArtWord.prototype.tslPushTWH = function (textState, list) {
    var text = this.makeText()
    text.text = ""
    var w = list[0] * 1
    var h = list[1] * 1
    text.test.w = isFinite(w) ? w : 0
    text.test.h = isFinite(h) ? h : 0
    this.tslPushOther(textState, text)
};


/**添加文本颜色对象 */
ArtWord.prototype.tslPushTextColor = function (textState, color) {
    this.contents.textColor = color;
    var obj = {
        "type": "textColor",
        "value": color
    }
    this.tslPushOther(textState, obj)
};

/**添加描边颜色 */
ArtWord.prototype.tslPushOutColor = function (textState, color) {
    var obj = {
        "type": "outlineColor",
        "value": color
    }
    this.tslPushOther(textState, obj)
};

/**添加描边宽 */
ArtWord.prototype.tslPushOutWidth = function (textState, width) {
    var obj = {
        "type": "outlineWidth",
        "value": width
    }
    this.tslPushOther(textState, obj)
};


/**添加绘制图标 */
ArtWord.prototype.tslPushDrawIcon = function (textState, iconId) {
    var obj = this.makeIcon()
    obj.icon = iconId
    obj.test.w = ArtWord._iconWidth + 4;
    obj.test.h = ArtWord._iconHeight + 4;
    this.tslPushOther(textState, obj)
};

/**添加改变斜体 */
ArtWord.prototype.tslPushChangeFontItalic = function (textState) {
    var Italic = !this.contents.fontItalic
    var Italic = !!this.tslPushEscapeParam(textState, Italic)
    this.tslPushFontItalic(textState, Italic)
}

/**添加字体粗体 */
ArtWord.prototype.tslPushFontItalic = function (textState, Italic) {
    this.contents.fontItalic = Italic;
    var obj = {
        "type": "fontItalic",
        "value": Italic
    }
    this.tslPushFont(textState, obj)
};

/**设置改变粗体 */
ArtWord.prototype.tslPushChangeFontBlod = function (textState) {
    var bold = !this.contents.fontBold
    var bold = !!this.tslPushEscapeParam(textState, bold)
    this.tslPushFontBlod(textState, bold)
}

/**文本状态列表 添加粗体 */
ArtWord.prototype.tslPushFontBlod = function (textState, bold) {
    this.contents.fontBold = bold;
    var obj = {
        "type": "fontBold",
        "value": bold
    }
    this.tslPushFont(textState, obj)
};

/**字体 */
ArtWord.prototype.tslPushChangeFontSize = function (textState, i) {
    if (i > 0) {
        var arr = /^}/.exec(textState.text.slice(textState.textindex));
        if (arr) {
            textState.textindex += arr[0].length;
            var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
            if (arr) {
                textState.textindex += arr[0].length;
                this.tslPushFontSize(textState, parseInt(arr[1]));
            } else {
                this.tslPushFontSize(textState, this.standardFontSize());
            }
        } else {
            var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
            if (arr) {
                textState.textindex += arr[0].length;
                this.tslPushFontSize(textState, this.contents.fontSize + parseInt(arr[1]));
            } else {
                this.tslPushFontSize(textState, this.contents.fontSize + 12)
            }
        }
    } else if (i < 0) {
        var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
        if (arr) {
            textState.textindex += arr[0].length;
            this.tslPushFontSize(textState, this.contents.fontSize - parseInt(arr[1]));
        } else {
            this.tslPushFontSize(textState, this.contents.fontSize - 12)
        }
    }
}


/**文本状态列表  添加字体 */
ArtWord.prototype.tslPushFontSize = function (textState, fontSize) {
    var fontSize = fontSize
    this.contents.fontSize = fontSize;
    var obj = {
        "type": "fontSize",
        "value": fontSize
    }
    this.tslPushFont(textState, obj)
};

/**文本状态列表 添加字体 */
ArtWord.prototype.tslPushFont = function (textState, obj) {
    this.fontSettings(1)
    this.tslPushOther(textState, obj)
};



/**文本状态列表添加脸图 */
ArtWord.prototype.tslPushFaceParam = function (textState) {
    var page = textState.page
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        var pos = (arr[0] || 0) * 1
        var name = arr[1]
        var id = (arr[2] || 0) * 1
        var face = {
            "type": "face",
            "pos": pos || 1,
            "name": name,
            "id": id
        }
        this.tslPushFace(textState, face)
    }
};

/**文本状态列表添加图片 */
ArtWord.prototype.tslPushPicParam = function (textState) {
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        var pos = arr[0] * 1
        var name = arr[1]
        var index = (arr[2] || 0) * 1
        var obj = {
            "type": "pic",
            "pos": pos,
            "name": name,
            "index": index
        }
        this.tslPushPic(textState, obj)
    }
};



/**获取参数 */
ArtWord.prototype.tslPushEscapeParam = function (textState, un) {
    if (un === undefined) {
        var un = ""
    } else {
        var un = un
    }
    var arr = /^\[(.*?)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        try {
            var i = arr[1] * 1
        } catch (error) {
            var i = un
        }
        return i;
    } else {
        return un;
    }
};

/**获取参数增强 */
ArtWord.prototype.tslPushEscapeParamEx = function (textState) {
    var arr = /^\[(.*?)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return arr[1].split(/ +/)
    }
    return arr;
};

ArtWord.prototype.tslPushEscapeParamEx2 = function (textState) {
    var arr = /^\[\{(.*?)\}\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return arr[1].split(/ +/)
    }
    return arr;
};


/**获取颜色参数 */
ArtWord.prototype.tslPushTextColorEscapeParam = function (textState) {
    var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return this.textColor(parseInt(arr[1]));
    } else {
        var arr = /^\[(#\w{6})\]/.exec(textState.text.slice(textState.textindex));
        if (arr) {
            textState.textindex += arr[0].length;
            return arr[1]
        } else {
            var arr = /^\[(#\w{3})\]/.exec(textState.text.slice(textState.textindex));
            if (arr) {
                textState.textindex += arr[0].length;
                return arr[1]
            } else {
                var arr = /^\[(rgba\((.*?)\))\]/.exec(textState.text.slice(textState.textindex));
                if (arr) {
                    textState.textindex += arr[0].length;
                    return arr[1]
                } else {
                    return this.normalColor();
                }
            }
        }
    }
};



/**文本内容宽 */
ArtWord.prototype.textContentsWidth = function () {
    return this.contentsWidth()
}



/**是结束在文本 */
ArtWord.prototype.isEndOfText = function (textState) {
    return textState.index >= textState.list.length;
};

/**需要新页 */
ArtWord.prototype.needsNewPage = function (textState) {
    return (!this.isEndOfText(textState) &&
        this.needsCharacter(textState) && (
            this.needsCharacter(textState).type == "page" ||
            this.needsCharacter(textState).type == "addpage")
    );
};




/**进行绘制对象 */
ArtWord.prototype.processDrawCharacter = function (textState) {
    var obj = this.needsCharacter(textState)
    if (obj) {
        switch (obj.type) {
            case "line":
            case "addline":
                textState.line = obj;
                textState.drawx =
                    /**绘制基础位置 */
                    textState.page.set.draw.x +
                    /**页开始位置 */
                    textState.page.test.x +
                    /**脸图位置 */
                    ((textState.page.set.facepos == 1 || textState.page.set.facepos == 3) ? 168 : 0) +
                    /**行位置 */
                    textState.line.test.x
                textState.drawy =
                    textState.page.set.draw.y +
                    textState.page.test.y +
                    textState.line.test.y
                break
            case "page":
            case "addpage":
                textState.page = obj;
                break
            case "fontSize":
            case "fontBold":
            case "fontItalic":
            case "textColor":
            case "outlineColor":
            case "outlineWidth":
                this.processFont(obj.type, obj.value);
                break
            case "text":
                var x = textState.drawx + obj.test.x
                var y = textState.drawy + obj.test.y
                var w = obj.test.w
                var h = textState.line.test.h
                var c = obj.text
                this.processText(c, x, y, w * 2, h)
                this.processNormalCharacter2()
                break
            case "icon":
                var x = textState.drawx + obj.test.x
                var y = textState.drawy + obj.test.y
                var h = textState.line.test.h
                var iconIndex = obj.icon
                this.processIcon(iconIndex, x + 2, y + 2);
                this.processNormalCharacter2()
                break
            case 'FF':
            case 'FFR':
            case 'FS':
            case 'FSR':
            case 'FC':
            case 'FCR':
            case 'FI':
            case 'FB':
            case 'FR':
                this.setF(obj.type, obj.value)
                break;
        }
    }
}



ArtWord.prototype.processFont = function (type, value) {
    this.drawBitmapFont(this.contents, type, value)
}


ArtWord.prototype.processText = function (c, x, y, w, h) {
    this.drawBitmapText(this.contents, c, x, y, w, h)
}

ArtWord.prototype.processIcon = function (iconIndex, x, y) {
    this.drawBitmapIcon(this.contents, iconIndex, x, y)
}


ArtWord.prototype.cloneBitmapFont = function (b, b2) {
    var font = this.saveFontSettings(b2)
    this.loadFontSettings(b, font)
}

ArtWord.prototype.drawBitmapFont = function (b, type, value) {
    b && (b[type] = value)
};

ArtWord.prototype.drawBitmapIcon = function (b, iconIndex, x, y) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = ArtWord._iconWidth;
    var ph = ArtWord._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    b && b.blt(bitmap, sx, sy, pw, ph, x, y);
};
ArtWord.prototype.drawBitmapText = function (b, c, x, y, w, h) {
    b && b.drawText(c, x, y, w, h);
};


/**添加参数 */
ArtWord.prototype.tslPushParam = function (textState, name, value) {
    var obj = {
        "type": name,
        "value": value
    }
    this.tslPushOther(textState, obj)
};



/**进行普通文字处理2 */
ArtWord.prototype.processNormalCharacter2 = function () { };




/**文字精灵 */
function Sprite_Art() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_Art.prototype = Object.create(ArtWord.prototype);
/**设置创造者 */
Sprite_Art.prototype.constructor = Sprite_Art;
/**
 * 初始化
 * 
 * @param {number} aw  0 初始  
 * 1 初始内适合大小  
 * 2 适合大小
 * 
 * @param {number} ah  0 初始  
 * 1 初始内适合大小  
 * 2 适合大小
 */
Sprite_Art.prototype.initialize = function (w, h, text, color, aw, ah) {
    ArtWord.prototype.initialize.call(this, w, h);
    this._sw = w
    this._sh = h
    this._aw = aw
    this._ah = ah
    this._text = text || ""
    this._blackColor = color || ""
    this._drawText()
};



/**设置长度 */
Object.defineProperty(Sprite_Art.prototype, 'text', {
    //获得 
    get: function () {
        return this._text;
    },
    set: function (value) {
        var value = "" + value
        if (this._text !== value) {
            this._text = value
            this._drawText()
        }
    },
    configurable: true
});


Object.defineProperty(Sprite_Art.prototype, 'sw', {
    //获得 
    get: function () {
        return this._sw;
    },
    set: function (value) {
        if (this._sw !== value) {
            this._sw = value
            this._drawText()
        }
    },
    configurable: true
});

Object.defineProperty(Sprite_Art.prototype, 'sh', {
    //获得 
    get: function () {
        return this._sh;
    },
    set: function (value) {
        if (this._sh !== value) {
            this._sh = value
            this._drawText()
        }
    },
    configurable: true
});

Object.defineProperty(Sprite_Art.prototype, 'aw', {
    //获得 
    get: function () {
        return this._aw;
    },
    set: function (value) {
        if (this._aw !== value) {
            this._aw = value
            this._drawText()
        }
    },
    configurable: true
});

Object.defineProperty(Sprite_Art.prototype, 'ah', {
    //获得 
    get: function () {
        return this._ah;
    },
    set: function (value) {
        if (this._ah !== value) {
            this._ah = value
            this._drawText()
        }
    },
    configurable: true
});


/**设置长度 */
Object.defineProperty(Sprite_Art.prototype, 'blackColor', {
    //获得 
    get: function () {
        return this._blackColor;
    },
    set: function (value) {
        if (this._blackColor !== value) {
            this._blackColor = value
            this._drawText()
        }
    },
    configurable: true
});

Object.defineProperty(Sprite_Art.prototype, 'blackColorType', {
    //获得 
    get: function () {
        return this._blackColorType;
    },
    set: function (value) {
        if (this._blackColorType !== value) {
            this._blackColorType = value
            this._drawText()
        }
    },
    configurable: true
});


Sprite_Art.prototype._drawColor = function () {

}


Sprite_Art.prototype._drawText = function () {
    if (this._aw || this._ah) {

        if (!this._aw || this._aw == 1) {
            var w = this._sw
        } else {
            var w = Infinity
        }

        if (!this._ah || this._ah == 1) {
            var h = this._sh
        } else {
            var h = Infinity
        }
        var texts = this.testTextEx(this.text, 0, 0, w, h)
        var page = texts.list[0]
        var test = page.test
        var w = !this._aw ? this._sw : test.x + test.w
        var h = !this._ah ? this._sh : test.y + test.h

        w = Math.ceil(w)
        h = Math.ceil(h)
        if (w != this.bitmap.width || h != this.bitmap.height) {
            this.bitmap.initialize(w, h)
        }
    }
    this.bitmap.clear()


    this._drawColor()

    var l = this._text
    if (Array.isArray(l)) {
        for (var i = 0; i < l.length; i++) {
            var t = l[i] || 0
            this.drawTextEx(t, 0, 0, this.bitmap.width, this.bitmap.height)
        }
    } else if (typeof l == "string") {
        this.drawTextEx(l, 0, 0, this.bitmap.width, this.bitmap.height)
    }
}


Sprite_Art.addEmpty = function (n, l, t) {
    var v = "" + n
    while (v.length < l) {
        v = t ? v + " " : " " + v
    }
    return v
}

