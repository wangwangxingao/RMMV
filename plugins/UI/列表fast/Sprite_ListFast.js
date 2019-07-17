//=============================================================================
// ww_list.js
//=============================================================================

/*:
 * @plugindesc 列表框加速
 * @author 汪汪
 * @version 2.0
 * 
 * 
 * 
 */










function Sprite_ListFast() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Sprite_ListFast.prototype = Object.create(Sprite.prototype);
//设置创造者
Sprite_ListFast.prototype.constructor = Sprite_ListFast;
//初始化
Sprite_ListFast.prototype.initialize = function (w, h, itemh) {
    Sprite.prototype.initialize.call(this);
    //this._get = get
    this._isEnd = true
    this._sprites = []
    this._items = []
    this.createMain(w, h, itemh)

    this.refresh()
    //this.showToYEnd()
};


Sprite_ListFast.prototype.allItems = function(){ 
    return this._items
};

Sprite_ListFast.prototype.getItem = function(index){ 
    return this.allItems(index)
};

/**创建页面 */
Sprite_ListFast.prototype.createMain = function (w, h, itemh) {
    this._showY = 0
    this._touchTime = 0

    var w = w || 0
    var h = h || 0
    var itemh = itemh || 0

    this.width = w
    this.height = h
    this._pageW = w
    this._pageH = h
    this._itemHeigth = itemh
    if (!this._showSprite) {
        this._showSprite = new Sprite()
    }
    this.addChild(this._showSprite)
    this.createPageMask(w, h)
    this.createSprites()

}

Sprite_ListFast.prototype.createPageMask = function (w, h) {
    if (!this._pageMask) {
        this._pageMask = new Sprite()
    }
    this.addChild(this._pageMask)
    var b = new Bitmap(w, h)
    b.fillAll("#ffffff")
    this._pageMask.bitmap = b
    this._showSprite.mask = this._pageMask //setMask(s)  
}


/**创建页面 */
Sprite_ListFast.prototype.createSprites = function () {
    var v = 10
    if (this._itemHeigth) {
        v = Math.ceil(this._pageH / this._itemHeigth) + 1
    }
    this.createSpriteTo(v)
}

Sprite_ListFast.prototype.createSpriteTo = function (v) {
    for (var i = this.spriteLength(); i < v; i++) {
        this.createSprite()
    }
}


Sprite_ListFast.prototype.createSprite = function () {
    var s = new Sprite()
    this._sprites.push(s)
    this._showSprite.addChild(s)
}


/**页高 */
Sprite_ListFast.prototype.pageW = function () {
    return this._pageW
}

/**页宽 */
Sprite_ListFast.prototype.pageH = function () {
    return this._pageH
}

/**获取项目高 */
Sprite_ListFast.prototype.getItemH = function (index) {
    if (this._itemHeigth) {
        return this._itemHeigth
    } else {
        return this.testItemH(index)
    }
}

/**测试项目高 */
Sprite_ListFast.prototype.testItemH = function (index) {
    /*var text = this.getItem(index)
    if (!text) { return 0 }
    var b = this.drawText(text)*/
    return 0//b.height
}

/**精灵长度 */
Sprite_ListFast.prototype.spriteLength = function () {
    return this._sprites.length
}

/**获取可用精灵 */
Sprite_ListFast.prototype.getSprite = function (index) {
    var l = this.spriteLength()
    var i = ((index % l) + l) % l
    return this._sprites[i]
}


/**绘制精灵 */
Sprite_ListFast.prototype.drawItem = function (index, hide) {
    var text = this.getItem(index)
    var s = this.getSprite(index)
    /*if (hide) { return s.visible = false }
    s.visible = true */
    if (s._text !== text) {
        s._text = text
        //s.bitmap = this.drawText(text)
    }
    s._index = index
    s.y = this.getItemY(index)
}


/**获取开始项目 */
Sprite_ListFast.prototype.getStartItem = function (y) {
    var y = y || 0
    if (this._itemHeigth) {
        var i = Math.floor(y / this._itemHeigth) - 1
        i = Math.max(0, i)
    } else {
        for (var i = 0; i < this._allHlist2.length; i++) {
            var z = this._allHlist2[i]
            if (z > y) {
                break
            }
        }
    }
    return i
}

/**获取结束项目 */
Sprite_ListFast.prototype.getEndItem = function (y) {
    var y = y || 0
    if (this._itemHeigth) {
        var i = Math.ceil(y / this._itemHeigth) + 1
    } else {
        for (var i = 0; i < this._allHlist.length; i++) {
            var z = this._allHlist[i]
            if (z > y) {
                break
            }
        }
    }
    return i
}


/**获取项目y坐标 */
Sprite_ListFast.prototype.getItemY = function (index) {
    var index = index || 0
    if (this._itemHeigth) {
        var y = this._itemHeigth * index
    } else {
        if (index >= 0 && index < this._allHlist.length) {
            var y = this._allHlist[index]
        } else {
            var y = -1000
        }
    }
    return y
}



Sprite_ListFast.prototype.drawAllItem = function (y) {
    this.evalAllH(y + this._pageH)

    var start = this.getStartItem(y)
    var end = this.getEndItem(y + this._pageH)

    this._start = start
    this._end = end

    var all = end - start + 1
    this.createSpriteTo(all)

    var nl = this.spriteLength()
    //this.evalAllHIndex(this._end)
    for (var i = 0; i < nl; i++) {
        if (i < all) {
            this.drawItem(start + i)
        } else {
            this.drawItem(start + i, true)
        }
    }
}






/**计算需要的高 */
Sprite_ListFast.prototype.evalAllH = function (y) {
    if (this._evalAllHToY >= y) {
        return this._allH
    } else {
        if (this._itemHeigth) {
            var l = this.allItems()
            this._allH = l.length * this._itemHeigth
            this._evalAllHToY = this._allH
            this._evalAllHToIndex = Infinity
        } else {
            var list = []
            var list2 = []
            var l = this.allItems()
            var allh = 0
            var ll = l.length
            for (var index = 0; index < ll && allh <= y; index++) {
                list.push(allh)
                allh += this.getItemH(index)
                list2.push(allh)
            }
            this._allH = allh
            this._allHlist = list
            this._allHlist2 = list2
            this._evalAllHToY = this._allH
        }
    }
    return this._allH
}


Sprite_ListFast.prototype.evalAllHIndex = function (indexto) {

    if (this._itemHeigth) {
        return
    }

    var y = this.getItemY(indexto)
    if (y < 0) {
        y = Infinity
    }
    if (this._evalAllHToY >= y) {
        return this._allH
    } else {
        if (this._itemHeigth) {
            var l = this.allItems()
            this._allH = l.length * this._itemHeigth
            this._evalAllHToY = this._allH
        } else {
            var list = []
            var list2 = []
            var l = this.allItems()
            var allh = 0
            var ll = l.length
            for (var index = 0; index < ll && allh <= y && index <= indexto; index++) {
                list.push(allh)
                allh += this.getItemH(index)
                list2.push(allh)
            }
            this._allH = allh
            this._allHlist = list
            this._allHlist2 = list2
            this._evalAllHToY = this._allH
        }
    }
    return this._allH
}

Sprite_ListFast.prototype.clear = function(){
    this.refresh()
}

/**刷新 */
Sprite_ListFast.prototype.refresh = function () {
    this.refreshItems()
    this.refreshShowY()
}

/**刷新所有项目的位置 */
Sprite_ListFast.prototype.refreshItems = function () {
    this.refreshAllH()
}

/**刷新所有的高 */
Sprite_ListFast.prototype.refreshAllH = function () {
    this._evalAllHToY = -Infinity
}

/**刷新显示位置 */
Sprite_ListFast.prototype.refreshShowY = function () {
    this.showToY(this._showY)
}

Sprite_ListFast.prototype.refreshItem = function (index) {
    var index = index || 0
    if (this._end && index > this._end) {
        this._evalAllHToY = this.getItemY(this._end)
    } else {
        this.refresh()
    }
}






Sprite_ListFast.prototype.updateParallel = function () {
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


Sprite_ListFast.prototype.startEvent = function (id) {
    if (!this._interpreter) {
        this._interpreter = new Game_Interpreter()
    }
    this._interpreter.setup($dataCommonEvents[id] && $dataCommonEvents[id].list);
    this._interpreter.update();
};




/**更新 */
Sprite_ListFast.prototype.update = function () {
    Sprite.prototype.update.call(this);
    /* if (this.showing()) {
         this.visible = true*/
    this.updateParallel()
    /*this.updateBeiJing()
    this.updateCbl()
    this.updateCbhk()
    this.updateClearButton() 
    if (this.mustClear()) {
        //this._isEnd = true
        this.clear()
        this.clearMustClear()
    }
    if (this.mustRefresh()) {
        this.refresh()
        this.clearMustRefresh()
        //this.showToYEnd()
    }*/
    this.updateTouch()
    /*if (this.mustRefresh()) {
        if (this._isEnd && this.end()) {
            this.showToYEnd()
        } else {
            this.refreshShowY()
        }
    } 
    } else {
        this.visible = false 
     if (this.mustClear()) {
        //this._isEnd = true
        this.clear()
        this.clearClear()
    }
    if (this.mustRefresh()) {
        this.refreshItems()
        this.showToYEnd()
    } 
    if (this.mustRefresh()) {
         if (this._isEnd && this.end()) {
             this.showToYEnd()
         } else {
             this.refreshShowY()
         }
     }
}*/
};

Sprite_ListFast.prototype.updateTouch = function () {
    if (TouchInput.isPressed()) {
        if (TouchInput.isTriggered()) {
            /*if (this._cbhk.isTouchInputThis()) {
                this._touch = "hk"
            } else if (this._cbl.isTouchInputThis()) {
                this._touch = "to"
                var loc = this._cbl.worldToLocalXY(TouchInput.x, TouchInput.y)
                this.onHKTo(loc.x, loc.y)
                this._touch = "hk"
            } else if (this._clearbutton.isTouchInputThis()) {
                this._touch = "clear"
                this.onCClick()
            } else */
            if (this._pageMask.isTouchInputThis()) {
                this._touch = "page"
                //this._lastTouch = "page"
            }
            this._touchMove = false
            this._touchX = TouchInput.x
            this._touchY = TouchInput.y
            this._touchTime = 0
        } else if (TouchInput.isMoved()) {
            this._touchMove = true
            /*if (this._touch == "hk") {
                var x = 0//TouchInput.x - this._touchX
                var y = TouchInput.y - this._touchY
                //滑块移动
                this.onHKMove(x, y)
                this._touchX = TouchInput.x
                this._touchY = TouchInput.y
            } else*/
            if (this._touch == "page") {
                var x = 0//TouchInput.x - this._touchX
                var y = this._touchY - TouchInput.y
                //页面上移动
                this.onPageMove(x, y)
                this._touchX = TouchInput.x
                this._touchY = TouchInput.y
            }
        }
        //this._touchTime++ 
    } else {
        //右键
        /*if (TouchInput.isCancelled() && this._pageMask.isTouchInputThis()) {
            this.onRClick()
            //左键 
        } else */
        if (this._touch == "page" && !this._touchMove) {
            this.onLClick()
        }
        //清空
        this._touchMove = 0
        //this._touchTime = 0
        this._touch = 0
    }
}
/*
Sprite_ListFast.prototype.onClick2XY = function () {
    if (
        Math.abs(this._touchX - TouchInput.x) < 10 &&
        Math.abs(this._touchY - TouchInput.y) < 10) {
        return true
    } else {
        return false
    }
}*/


Sprite_ListFast.prototype.onClickSprites = function () {
    for (var i = 0; i < this.spriteLength(); i++) {
        var s = this.getSprite(i)
        if (s && s.isTouchInputThis()) {
            return s
        }
    }
}



/**
 * 页面移动
 * 
 */
Sprite_ListFast.prototype.onPageMove = function (x, y) {
    this.showMoveY(y)
}




/**显示内容到y处 */
Sprite_ListFast.prototype.showToY = function (y) {
    this.evalAllH(y + this._pageH)
    this._showY = Math.max(0, Math.min(y, this._allH - this._pageH))
    //var z = this._allH - this._pageH
    /*if (z <= 0 || this._showY == this._allH - this._pageH) {
        this._isEnd = true
    } else {
        this._isEnd = false
    }*/
    this.drawAllItem(this._showY)
    this._showSprite.y = -this._showY
    //this.clearMustRefresh()
}

/**显示移动偏移y */
Sprite_ListFast.prototype.showMoveY = function (y) {
    this.showToY(this._showY + y)
}

/**显示移动到底部 */
Sprite_ListFast.prototype.showToYEnd = function () {
    this.showToY(Infinity)
}

/**显示移动到顶部 */
Sprite_ListFast.prototype.showToYTop = function () {
    this.showToY(0)
}


/**显示到索引 */
Sprite_ListFast.prototype.showToIndex = function (i) {
    if (i < 0) {
        this._index = 0
        this.showToYTop()
    } else if (i >= this.allItems().length) {
        this._index = Math.max(0, this.allItems().length - 1)
        this.showToYEnd()
    } else {
        this._index = i
        var y = this._allHlist[this._index]
        this.showToY(y)
    }
}
