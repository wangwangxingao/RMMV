
function Sprite_UIList() {
    this.initialize.apply(this, arguments);
}
Sprite_UIList.prototype = Object.create(Sprite.prototype);
Sprite_UIList.prototype.constructor = Sprite_UIList;


/**初始化
 * 
 */
Sprite_UIList.prototype.initialize = function (w, h) {
    Sprite.prototype.initialize.call(this)

    this.createMain(w, h)
    //显示到Y
    this.refresh()
};


Sprite_UIList.prototype.createMain = function (w, h) {

    this._index = -1

    this._allW = 0
    this._allH = 0
    this._showX = 0
    this._showY = 0
    this._showW = 0
    this._showH = 0

    this.width = 0
    this.height = 0

    //放所有对象的列表
    this._spritesList = []

    this.createShowSprite()
    this.createBarSprite(w, h)
 
    this.setShowWH(w, h)

}



/**创建显示精灵 */
Sprite_UIList.prototype.createShowSprite = function (w, h) {

    if (!this._showSprite) { 
        this._showSprite = new Sprite()
    } 
    this.addChild(this._showSprite)
}

/**创建进度条精灵 */
Sprite_UIList.prototype.createBarSprite = function (w, h) {
    var w = w || 0
    var h = h || 0

    var x = w - 5
    var y = 0

    var b = new Bitmap(5, h)

    if (!this._scrollBarSprite) {

        this._scrollBarSprite = new Sprite()
    }
    var s = this._scrollBarSprite
    s.visible = false // = new Bitmap(10,h) 
    s.bitmap = b
    b.fillAll("#ffffff")
    s.x = x
    s.y = y

    this.addChild(this._scrollBarSprite)

}




/**设置显示的宽和高 */
Sprite_UIList.prototype.setShowWH = function (w, h) {
    this._showW = w || 0
    this._showH = h || 0

    this.width = w || 0
    this.height = h || 0

    //设置遮罩
    this.makeMask(0, 0, w, h)
}


/**刷新 */
Sprite_UIList.prototype.refresh = function () {
    this.refreshSpritesPos()
    this.refreshShowY()
};

/**刷新精灵位置 */
Sprite_UIList.prototype.refreshSpritesPos = function () {
    this._allH = 0
    //不断把精灵添加到最后
    for (var i = 0; i < this._spritesList.length; i++) {
        var s = this._spritesList[i]
        if (s) {
            this.addSpritePosToEnd(s)
        }
    }
};

/**刷新显示位置 */
Sprite_UIList.prototype.refreshShowY = function () {
    this.showToY(this._showY)
    this.setScrollBarScale()
    this.moveScrollBarToShow()

}


/**添加精灵 */
Sprite_UIList.prototype.addSprite = function (s, xywh) {
    if (!s) { return }
    this.setSpriteXywh(s, xywh)

    var index = this._spritesList.indexOf(s)
    if (index >= 0) {
        this._spritesList[index] = null

        this._spritesList.push(s)
        this.addSpriteOnShow(s)

        this.refresh()
    } else {
        //添加到列表
        this._spritesList.push(s)
        this.addSpriteOnShow(s)

        this.addSpritePosToEnd(s)
        this.setScrollBarScale()
    }
};



Sprite_UIList.prototype.addSpriteTo = function (s, id, xywh) {
    if (!s) { return }

    this.setSpriteXywh(s, xywh)


    var s2 = this._spritesList[id]

    this.removeSpriteOnShow(s2)


    this.deleteSpriteOnList(s)


    this._spritesList[id] = s
    this.addSpriteOnShow(s)

    //this._mustRefreshShowPos = true 
    this.refresh()
};

/**添加精灵在 */
Sprite_UIList.prototype.addSpriteAt = function (s, id, xywh) {

    if (!s) { return }
    this.setSpriteXywh(s, xywh)


    this.deleteSpriteOnList(s)


    this._spritesList.splice(id, 0, s)


    this.addSpriteOnShow(s)

    //this._mustRefreshShowPos = true

    this.refresh()
};

/**移除精灵 */
Sprite_UIList.prototype.removeSprite = function (s) {

    this.removeSpriteOnList(s)
    this.removeSpriteOnShow(s)

    this.refresh()

};

/**删除精灵 */
Sprite_UIList.prototype.deleteSprite = function (s) {

    this.deleteSpriteOnList(s)
    this.removeSpriteOnShow(s)

    this.refresh()

};


/**添加精灵在显示 */
Sprite_UIList.prototype.addSpriteOnShow = function (s) {
    if (s) {

        this._showSprite.addChild(s)
    }
}


/**移除精灵 */
Sprite_UIList.prototype.removeSpriteOnList = function (s) {
    if (!s) { return }
    var index = this._spritesList.indexOf(s)
    if (index >= 0) {
        this._spritesList.splice(index, 1)
    }
}

/**删除精灵在列表中 */
Sprite_UIList.prototype.deleteSpriteOnList = function (s) {
    if (!s) { return }
    var index = this._spritesList.indexOf(s)
    if (index >= 0) {
        this._spritesList[index] = null
    }
};

/**删除精灵在精灵中 */
Sprite_UIList.prototype.deleteSpriteOnShow = function (s) {
    if (!s) { return }
    this._showSprite.removeChild(s)
};

/**移除精灵在精灵中 */
Sprite_UIList.prototype.removeSpriteOnShow = function (s) {
    if (!s) { return }
    this._showSprite.removeChild(s)
}



/**
 * 添加精灵位置到最后
 * @param {sprite} s 精灵
 * @param {[number,number,number,number]} xywh   位置设置  
 * x 偏移x  
 * y 偏移y  
 * w 长  
 * h 宽  
 * 
 */
Sprite_UIList.prototype.addSpritePosToEnd = function (s) {


    this.setSpriteXywh(s)

    var xywh = s.xywh

    var x = xywh[0]
    var y = xywh[1]
    var w = xywh[2]
    var h = xywh[3]

    //精灵的y
    s._touchY = this._allH 
    //s.x = x
    s.y = this._allH + y

    //全部的高 += h
    this._allH += h
    
    s._touchYE = this._allH 

};

/**设置精灵xywh
 * @param {sprite} s 精灵
 * @param {[number,number,number,number]} xywh   位置设置  
 * x 偏移x  
 * y 偏移y  
 * w 总长  
 * h 总宽  
 */
Sprite_UIList.prototype.setSpriteXywh = function (s, xywh) {
    if (!xywh) {
        var xywh = [s.x, s.y, s.x + s.width, s.y + s.height]
    }
    s.xywh = xywh
    return xywh
};


/**设置滚动条比例 */
Sprite_UIList.prototype.setScrollBarScale = function () {
    if (this._allH > this._showH) {
        var scale = this._showH / this._allH
        this._scrollBarSprite.scale.y = scale
        this._scrollBarSprite.visible = true
    } else {
        this._scrollBarSprite.visible = false
    }
}


Sprite_UIList.prototype.__pagetoO = [{ fr: { opacity: 255 }, t: 0 }, 30, { t: 255, up: { opacity: -1 } }]


/**移动滚动条位置到目前位置 */
Sprite_UIList.prototype.moveScrollBarToShow = function () {
    if (this._allH) {
        var y = (this._showH / this._allH) * this._showY
        this._scrollBarSprite.y = y
    } else {
        this._scrollBarSprite.visible = false
    }
}


/**显示滚动条 */
Sprite_UIList.prototype.showScrollBar = function () {
    this.moveScrollBarToShow()
    if (this._scrollBarSprite.visible) {
        this._scrollBarSprite.anmSt("o", this.__pagetoO)
    }
}

/**清除 */
Sprite_UIList.prototype.clear = function () {
    for (var i = 0; i < this._spritesList.length; i++) {
        var s = this._spritesList[i]
        if (s) {
            this._showSprite.removeChild(s)
        }
    }
    this._spritesList.length = 0
    this._allH = 0
    //this._mustRefreshShowPos = true
    this.refresh()
}



/**显示内容到y处 */
Sprite_UIList.prototype.showToY = function (y) {
    this._showY = Math.max(0,Math.min(y, this._allH - this._showH))
    this._showSprite.y = -this._showY
    this.showScrollBar()
}

/**移动偏移y */
Sprite_UIList.prototype.showMoveY = function (y) {
    this.showToY(this._showY + y)
}

/**移动到底部 */
Sprite_UIList.prototype.showToYEnd = function () {
    this.showToY(this._allH)
}

/**移动到顶部 */
Sprite_UIList.prototype.showToYTop = function () {
    this.showToY(0)
}



/**显示到索引 */
Sprite_UIList.prototype.showToIndex = function (i) {
    if (i < 0) {
        this._index = 0
        this.showToYTop()

    } else if (i >= this._spritesList.length) {
        this._index = Math.max(0, this._spritesList.length - 1)

        this.showToYEnd()
    } else {
        this._index = i

        var s = this._spritesList[i]
        if (s) {
            this.setSpriteXywh(s)
            var xywh = s.xywh
            var x = xywh[0]
            var y = xywh[1]
            var w = xywh[2]
            var h = xywh[3]
            this.showToY(s.y - y)
        } else {
            this.showToIndex(i + 1)
        }
    }
}



/**更新输入 */
Sprite_UIList.prototype.__updateInput = function () {

    /* if( this._mustRefreshShowPos){
        this.refresh() 
    } */

    if (Input.isKeyTriggered("touch2")) {
        console.log("click,click")
    }
    this.TouchInputisTouchIn()
    this.TouchInputisTouchInPressMove()
}


/**当点击在他之中,并移动时 */
Sprite_UIList.prototype.__TouchInputisTouchInPressMove = function (x, y) {
    if (y) {
        this.showMoveY(-y)
    }
}



/**

var s = new Sprite_UIList(300,400)
SceneManager._scene.addChild(s)

b = ImageManager.loadEnemy("actor1_3")

a = new Sprite(b)


a = new Sprite(b) ; s.addSpritePosToEnd(a)
a = new Sprite(b) ; s.addSpritePosToEnd(a)
a = new Sprite(b) ; s.addSpritePosToEnd(a)
a = new Sprite(b) ; s.addSpritePosToEnd(a)
a = new Sprite(b) ; s.addSpritePosToEnd(a)
a = new Sprite(b) ; s.addSpritePosToEnd(a)
a = new Sprite(b) ; s.addSpritePosToEnd(a)
a = new Sprite(b) ; s.addSpritePosToEnd(a)

  */