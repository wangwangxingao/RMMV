
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
    this._objectsList = []

    this._showSprite = new Sprite()

    this._scrollBarSprite = new Sprite()
    this._scrollBarSprite.visible = false // = new Bitmap(10,h) 

    this.addChild(this._showSprite)
    this.addChild(this._scrollBarSprite)

    this.setShowWH(w, h)
    // this._evalInMapIndex = []
};


/**设置显示的宽和高 */
Sprite_UIList.prototype.setShowWH = function (w, h) {
    this._showW = w || 0
    this._showH = h || 0

    this.width = w || 0
    this.height = h || 0

    var b = new Bitmap(5, h)
    this._scrollBarSprite.bitmap = b
    b.fillAll("#ffffff")
    this._scrollBarSprite.x = this.width - 5

    this.makeMask(0, 0, w, h)


    this.showToY(this._showY)
    this.setScrollBarScale()
    this.moveScrollBarToShow()
}




/**刷新精灵位置 */
Sprite_UIList.prototype.refreshShowPos = function () {
    this._allH = 0
    for (var i = 0; i < this._objectsList.length; i++) {
        var s = this._objectsList[i]
        if (s) {
            this.addSpritePosToEnd(s)
        }
    }
    this.showToY(this._showY)
    this.setScrollBarScale()
    this.moveScrollBarToShow()
};


/**添加精灵 */
Sprite_UIList.prototype.addSprite = function (s, xywh) {
    if (!s) { return }
    this.setSpriteXywh(s, xywh)

    var index = this._objectsList.indexOf(s)
    if (index >= 0) {
        this._objectsList[index] = null

        this._objectsList.push(s)
        this._showSprite.addChild(s)

        this.refreshShowPos()
    } else {
        //添加到列表
        this._objectsList.push(s)
        this._showSprite.addChild(s)

        this.addSpritePosToEnd(s)
        this.setScrollBarScale()
    }
};



Sprite_UIList.prototype.addSpriteTo = function (s, id, xywh) {
    if (!s) { return }

    this.setSpriteXywh(s, xywh)


    var s2 = this._objectsList[id]

    this.removeSpriteOnSprite(s2)


    this.deleteSpriteOnList(s)


    this._objectsList[id] = s
    this._showSprite.addChild(s)

    //this._mustRefreshShowPos = true 
    this.refreshShowPos()
};


Sprite_UIList.prototype.addSpriteAt = function (s, id, xywh) {

    if (!s) { return }
    this.setSpriteXywh(s, xywh)


    this.deleteSpriteOnList(s)


    this._objectsList.splice(id, 0, s)
    this._showSprite.addChild(s)

    //this._mustRefreshShowPos = true

    this.refreshShowPos()
};



Sprite_UIList.prototype.removeSpriteOnList = function (s) {
    if (!s) { return }
    var index = this._objectsList.indexOf(s)
    if (index >= 0) {
        this._objectsList.splice(index, 1)
    }
}

Sprite_UIList.prototype.deleteSpriteOnList = function (s) {
    if (!s) { return }
    var index = this._objectsList.indexOf(s)
    if (index >= 0) {
        this._objectsList[index] = null
    }
};


Sprite_UIList.prototype.deleteSpriteOnSprite = function (s) {
    if (!s) { return }
    this._showSprite.removeChild(s)
};


Sprite_UIList.prototype.removeSpriteOnSprite = function (s) {
    if (!s) { return }
    this._showSprite.removeChild(s)
}

/**移除精灵 */
Sprite_UIList.prototype.removeSprite = function (s) {

    this.removeSpriteOnList(s)
    this.removeSpriteOnSprite(s)

    this.refreshShowPos()

};

/**删除精灵 */
Sprite_UIList.prototype.deleteSprite = function (s) {

    this.deleteSpriteOnList(s)
    this.removeSpriteOnSprite(s)

    this.refreshShowPos()

};



/**
 * 添加精灵位置到最后
 * xywh  x 偏移x y偏移y  w 长 h 宽
 * 
 */
Sprite_UIList.prototype.addSpritePosToEnd = function (s) {


    this.setSpriteXywh(s)

    var xywh = s.xywh

    var x = xywh[0]
    var y = xywh[1]
    var w = xywh[2]
    var h = xywh[3]

    s.y = this._allH + y
    this._allH += h
};

/**设置精灵xywh */
Sprite_UIList.prototype.setSpriteXywh = function (s, xywh) {
    if (!xywh) {
        var xywh = [s.x, s.y, s.width, s.height]
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



Sprite_UIList.prototype.showScrollBar = function () {
    this.moveScrollBarToShow()
    if (this._scrollBarSprite.visible) {
        this._scrollBarSprite.anmSt("o", this.__pagetoO)
    }
}

Sprite_UIList.prototype.clear = function () {
    for (var i = 0; i < this._objectsList.length; i++) {
        var s = this._objectsList[i]
        if (s) {
            this._showSprite.removeChild(s)
        }
    }
    this._objectsList.length = 0
    this._allH = 0
    //this._mustRefreshShowPos = true
    this.refreshShowPos()
}



/**显示内容到y处 */
Sprite_UIList.prototype.showToY = function (y) {
    this._showY = Math.min(Math.max(y, 0), this._allH - this._showH)
    this._showSprite.y = -this._showY
    this.showScrollBar()
}


/**移动到底部 */
Sprite_UIList.prototype.showToYEnd = function () {
    this.showToY(this._allH)
}

/**移动到顶部 */
Sprite_UIList.prototype.showToYTop = function () {
    this.showToY(0)
}


/**移动y */
Sprite_UIList.prototype.showMoveY = function (y) {
    this.showToY(this._showY + y)
}

/**显示到索引 */
Sprite_UIList.prototype.showToIndex = function (i) {
    if (i < 0) {
        this._index = 0
        this.showToYTop()

    } else if (i >= this._objectsList.length) {
        this._index = Math.max(0, this._objectsList.length - 1)

        this.showToYEnd()
    } else {
        this._index = i

        var s = this._objectsList[i]
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
        this.refreshShowPos() 
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