/**
 * 世界到局部xy
 * @param {number} y y
 * @return {number}  
 */
Sprite.prototype.worldToLocalXY = function (x, y, s) {
    var node = s || this;
    return node.worldTransform.applyInverse({
        x: x,
        y: y
    }, {
        visible: node.worldVisible
    });
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








function Sprite_ListBase() {
    this.initialize.apply(this, arguments);
}


ww.xinxi.sprites["text"] = Sprite_ListBase


//设置原形 
Sprite_ListBase.prototype = Object.create(Sprite.prototype);
//设置创造者
Sprite_ListBase.prototype.constructor = Sprite_ListBase;
//初始化
Sprite_ListBase.prototype.initialize = function (w, h, get) {
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

Sprite_ListBase.prototype.initGet = function (w, h, get) {
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
Sprite_ListBase.prototype.createBeiJing = function () {
    this._beijing = new Sprite()
    this.addChild(this._beijing)

    this._beijing.x = this.get("bjx") || 0
    this._beijing.y = this.get("bjy") || 0

    this._beijingb = this.get("bjb") || ""
    this._beijing.bitmap = ImageManager.loadPicture(this._beijingb)
}



/**创建页面 */
Sprite_ListBase.prototype.createPage = function () {
    if (!this._showSprite) {
        this._showSprite = new Sprite()
    }
    this.addChild(this._showSprite)
    this.createPageMask(this._pageW, this._pageH)
    this.createSprites()
}

Sprite_ListBase.prototype.createPageMask = function (w, h) {
    if (!this._pageMask) {
        this._pageMask = new Sprite()
    }
    this.addChild(this._pageMask)
    var b = new Bitmap(w, h)
    b.fillAll("#ffffff")
    this._pageMask.bitmap = b
    this._showSprite.mask = this._pageMask //setMask(s)  
}




Sprite_ListBase.prototype.createAdd = function () {
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


Sprite_ListBase.prototype.createHelp = function () {
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
Sprite_ListBase.prototype.createSprites = function () {
    this._sprites = []
    var z = this.get("sn") || 20
    for (var i = 0; i < z; i++) {
        var s = new Sprite()
        this._sprites.push(s)
        this._showSprite.addChild(s)
    }
}




/**创建侧边栏 */
Sprite_ListBase.prototype.createCbl = function () {
    this._cbl = new Sprite()
    this.addChild(this._cbl)

    this._cbl.x = this._pageW + (this.get("cbhkx") || 0)
    this._cbl.y = this.get("cbly") || 0

    this._cblb = this.get("cblb") || ""
    this._cbl.bitmap = ImageManager.loadPicture(this._cblb)

}






/**创建侧边滑块 */
Sprite_ListBase.prototype.createCbhk = function () {
    this._cbhk = new Sprite()
    this.addChild(this._cbhk)

    this._cbhk.x = this._pageW + (this.get("cbhkx") || 0)
    this._cbhkb = this.get("cbhkb") || ""
    this._cbhkh = this.get("cbhkh") || 0

    this._cbhk.bitmap = ImageManager.loadPicture(this._cbhkb)

}


/**创建清除键 */
Sprite_ListBase.prototype.createCButton = function () {
    this._CButton = new Sprite()
    this.addChild(this._CButton)

    this._CButton.x = this.get("cbx") || 0
    this._CButton.y = this.get("cby") || 0

    this._CButtonb = this.get("cbb") || ""
    this._CButton.bitmap = ImageManager.loadPicture(this._CButtonb)

}


Sprite_ListBase.prototype.get = function (name) {
    return this._get && this._get[name]
}


Sprite_ListBase.prototype.set = function (name, value) {
    this._get && (this._get[name] = value)
}



Sprite_ListBase.prototype.showing = function () {
    return this.get("_showing")
}

Sprite_ListBase.prototype.mustClear = function () {
    return this.get("_clear")
}

Sprite_ListBase.prototype.clearClear = function () {
    this.set("_clear")
}


Sprite_ListBase.prototype.allmessage = function () {
    return this.get("_all") || []
}


Sprite_ListBase.prototype.getmessage = function (index) {
    return this.allmessage()[index] || ""
}


Sprite_ListBase.prototype.alldesc = function () {
    return this.get("_alldesc") || []
}


Sprite_ListBase.prototype.getdesc = function (index) {
    return this.alldesc()[index] || ""
}


Sprite_ListBase.prototype.allvalue = function () {
    return this.get("_allvalue") || []
}


Sprite_ListBase.prototype.getvalue = function (index) {
    var v = this.allvalue()[index]
    if (v === undefined) {
        return index
    } else {
        return v
    }
}


Sprite_ListBase.prototype.end = function () {
    return this.get("_end")
}


Sprite_ListBase.prototype.mustRefresh = function () {
    return this.get("_mustre") || this._mustre
}


Sprite_ListBase.prototype.clearRefresh = function (v) {
    this._mustre = v
    return this.set("_mustre", v)
}


/**清除 */
Sprite_ListBase.prototype.clear = function () {
    this.refreshItems()
}



Sprite_ListBase.prototype.pageW = function () {
    return this._pageW
}



Sprite_ListBase.prototype.pageH = function () {
    return this._pageH
}



Sprite_ListBase.prototype.spriteLength = function () {
    return this._sprites.length
}


Sprite_ListBase.prototype.getSprite = function (index) {
    var l = this.spriteLength()
    var i = ((index % l) + l) % l
    return this._sprites[i]
}


Sprite_ListBase.prototype.show = function () {
    if (!this.visible) {
        this.visible = true
        this._item = null
    }
};

Sprite_ListBase.prototype.hide = function () {
    if (this.visible) {
        this.visible = false
        this._item = null
    }
};

Sprite_ListBase.prototype.startEvent = function (id) {
    if (!this._interpreter) {
        this._interpreter = new Game_Interpreter()
    }
    this._interpreter.setup($dataCommonEvents[id] && $dataCommonEvents[id].list);
    this._interpreter.update();
};



/**全部的高 */
Sprite_ListBase.prototype.allh = function () {
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
Sprite_ListBase.prototype.refreshItems = function () {
    this._allH = -1
    this.allh()
}


Sprite_ListBase.prototype.refresh = function () {
    this.refreshItems()
    this.refreshShowY()
}


/**
 * 页面移动
 * 
 */
Sprite_ListBase.prototype.onPageMove = function (x, y) {
    this.showMoveY(y)
}

/**滑块移动到 */
Sprite_ListBase.prototype.onHKTo = function (x, y) {
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
Sprite_ListBase.prototype.onHKMove = function (x, y) {
    if (this._cblb) {
        var y = y / this._cbl.bitmap.height * this._allH
    } else {
        var y = y / this._pageH * this._allH
    }
    this.showMoveY(y)

}

/**刷新显示位置 */
Sprite_ListBase.prototype.refreshShowY = function () {
    this.showToY(this._showY)
}



/**设置滚动条比例 */
Sprite_ListBase.prototype.setScrollBarScale = function () {
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
Sprite_ListBase.prototype.moveScrollBarToShow = function () {
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
Sprite_ListBase.prototype.showScrollBar = function () {
    this.setScrollBarScale()
    this.moveScrollBarToShow()
}



Sprite_ListBase.prototype.showToRefresh = function () {
    this.showToY(this._allH)
}

/**显示内容到y处 */
Sprite_ListBase.prototype.showToY = function (y) {
    this.allh()
    this._showY = Math.max(0, Math.min(y, this._allH - this._pageH))

    this.drawAllItem(this._showY)
    this._showSprite.y = -this._showY
    this.showScrollBar()
    this.clearRefresh()
}

/**移动偏移y */
Sprite_ListBase.prototype.showMoveY = function (y) {
    this.showToY(this._showY + y)
}

/**移动到底部 */
Sprite_ListBase.prototype.showToYEnd = function () {
    this.showToY(this._allH)
}

/**移动到顶部 */
Sprite_ListBase.prototype.showToYTop = function () {
    this.showToY(0)
}



/**显示到索引 */
Sprite_ListBase.prototype.showToIndex = function (i) {
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





Sprite_ListBase.prototype.drawAllItem = function (y) {
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

Sprite_ListBase.prototype.drawSprite = function (index) {
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
Sprite_ListBase.prototype.testItem = function (index) {
    var text = this.getmessage(index)
    if (!text) {
        return 0
    }
    var b = this.drawText(text)
    return b.height
}

/**绘制项目 */
Sprite_ListBase.prototype.drawText = function (text) {
    if (text) {
        return ImageManager.loadArtText(this.pageW(), this.pageH(), text, 0, 1)
    } else {
        return ImageManager.loadEmptyBitmap()
    }
}


Sprite_ListBase.prototype.drawHelp = function (item) {
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


Sprite_ListBase.prototype.drawHelpBeijing = function (b) {
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
Sprite_ListBase.prototype.update = function () {
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


Sprite_ListBase.prototype.updateTouch = function () {
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
                var x = 0 //TouchInput.x - this._touchX
                var y = TouchInput.y - this._touchY
                //滑块移动
                this.onHKMove(x, y)
                this._touchX = TouchInput.x
                this._touchY = TouchInput.y
            } else if (this._touch == "page") {
                var x = 0 //TouchInput.x - this._touchX
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

Sprite_ListBase.prototype.updateParallel = function () {
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


Sprite_ListBase.prototype.updateAnim = function () {}


/**更新背景 */
Sprite_ListBase.prototype.updateBeiJing = function () {
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
Sprite_ListBase.prototype.updateCbl = function () {

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
Sprite_ListBase.prototype.updateCbhk = function () {
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
Sprite_ListBase.prototype.updateCButton = function () {
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


Sprite_ListBase.prototype.onClick2XY = function () {
    if (
        Math.abs(this._touchX - TouchInput.x) < 10 &&
        Math.abs(this._touchY - TouchInput.y) < 10) {
        return true
    } else {
        return false
    }
}

Sprite_ListBase.prototype.onAddSprites = function () {
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

Sprite_ListBase.prototype.onClickAdd = function (type) {
    if (this._addbuttonSprite) {
        var s = this.onAddSprites()
        if (s && s.ab) {
            var click = s.ab[type] || 0
            if (click < 0) {} else {
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



Sprite_ListBase.prototype.onAddClickSet = function (s, type) {

}

Sprite_ListBase.prototype.onDefaultAddClick = function (s, type) {

}



/**清除按钮按下 */
Sprite_ListBase.prototype.onCClick = function () {
    var click = this.get("cclick") || 0
    if (click < 0) {} else {
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
Sprite_ListBase.prototype.onCClickSet = function (s) {
    this.setHelp()
    this.setItem()
}

Sprite_ListBase.prototype.onDefaultCClick = function () {
    this._get.clear()
    this.clear()
    this.showToY(0)
}




Sprite_ListBase.prototype.onClickSprites = function () {
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
Sprite_ListBase.prototype.onLClick = function () {
    var s = this.onClickSprites()
    if (s) {
        var click = this.get("lclick") || 0
        if (click < 0) {} else {
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


Sprite_ListBase.prototype.onLClickSet = function (s) {
    this.setHelp(s)
    this.setItem(s)
}


/**左键按下默认 */
Sprite_ListBase.prototype.onDefaultLClick = function () {

}

/**
 * ========================================
 * 右键按下
 * ======================================== 
 */
/**右键按下 */
Sprite_ListBase.prototype.onRClick = function () {
    var s = this.onClickSprites()
    if (s) {
        var click = this.get("rclick") || 0
        if (click < 0) {} else {
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

Sprite_ListBase.prototype.onDefaultRClick = function () {}

Sprite_ListBase.prototype.onRClickSet = function (s) {
    this.setHelp(s)
    this.setItem(s)
}




/**
 * ========================================
 * 设置项目
 * ======================================== 
 */
Sprite_ListBase.prototype.setItem = function (item) {
    this._item = item
    if (!item) {
        return
    }
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
Sprite_ListBase.prototype.setHelp = function (item) {
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