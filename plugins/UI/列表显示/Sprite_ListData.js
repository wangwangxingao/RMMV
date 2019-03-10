var ww = ww || {}
ww.UIListData = {}
ww.UIListData.deltX = 10
ww.UIListData.deltY = 10
ww.UIListData.deltTime = 60



function Sprite_UIListData() {
    this.initialize.apply(this, arguments);
}
Sprite_UIListData.prototype = Object.create(Sprite_UIList.prototype);
Sprite_UIListData.prototype.constructor = Sprite_UIListData;

Sprite_UIListData.prototype.initialize = function (w, h) {
    Sprite_UIList.prototype.initialize.call(this, w, h)
}


Sprite_UIListData.prototype.update = function () {
    Sprite_UIList.prototype.update.call(this)
    if (this.visible) {
        this.updateInput()
    }
}


Sprite_UIListData.prototype.updateInput = function () {
    if (!this._canNotInput) {

        if (TouchInput.isPressed()) {
            if (TouchInput.isTriggered() || TouchInput.isMoved()) {

                if (!this._isTouch) {
                    if (this.isTouchThis(TouchInput.x, TouchInput.y, true)) {
                        this._isTouch = true
                        this._count = 0
                        this._intX = TouchInput.x
                        this._intY = TouchInput.y

                        this._nowX = TouchInput.x
                        this._nowY = TouchInput.y

                        this._isMoveOrLong = false
                    }
                } else {
                    var deltX = TouchInput.x - this._nowX
                    var deltY = TouchInput.Y - this._nowY

                    this._nowX = TouchInput.x
                    this._nowY = TouchInput.y
                    this.isMoveOrLong()

                    this.showMoveY(deltY)
                }
            }
            this._count++
        } else {
            if (this._isTouch) {
                this.isMoveOrLong()
                if (!this._isMoveOrLong) {
                    this.clickTouch()
                }

                this._count = 0
                this._isMoveOrLong = false
                this._isTouch = false
            }

        }
    }
}
/**更新输入 */
Sprite_UIListData.prototype.isMoveOrLong = function () {

    if (this._isMoveOrLong) {
    } else {
        if (Math.abs(this._nowX - this._intX) > ww.UIListData.deltX) {
            this._isMoveOrLong = true
        } else if (Math.abs(this._nowY - this._intY) > ww.UIListData.deltY) {
            this._isMoveOrLong = true
        } else if (this._count > ww.UIListData.deltTime) {
            this._isMoveOrLong = true
        }
    }
}


/**当点击在他之中,并移动时 */
Sprite_UIListData.prototype.clickTouch = function () {
    if (this.isTouchThis(TouchInput.x, TouchInput.y, true)) {
        var c = this.worldToLocalXY(TouchInput.x, TouchInput.y)
        var y = this._showY + c.y
        for (var i = 0; i < this._spritesList.length; i++) {
            var s = this._spritesList[i]
            if (s) {
                if (y > s._touchY && y < s._touchYE) {
                    s.clickThis && s.clickThis()
                }
            }
        }
    }
}


Sprite_UIListData.prototype.worldToLocalXY = function (x, y, sprite) {
    var node = sprite || this;
    return node.worldTransform.applyInverse({ x: x, y: y }, { visible: node.worldVisible });
};

Sprite_UIListData.prototype.isTouchThis = function (x, y) {
    if (this.visible) {
        var loc = this.worldToLocalXY(x, y)
        var x = loc.x
        var y = loc.y
        var v = loc.visible
        if (this.isTouchIn(x, y)) {
            return true
        }
    }
    return false
}



/**是在之中 
* @param {boolean} type 不检查图片
* 
*/
Sprite_UIListData.prototype.isTouchIn = function (x, y) {
    if (this.anchor) {
        var x = x + this.anchor.x * this.width
        var y = y + this.anchor.y * this.height
    }
    if (this.isTouchInFrame(x, y)) {
        return true
    } else {
        return false
    }
}


/**是在区域中 */
Sprite_UIListData.prototype.isTouchInFrame = function (x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};

 





/**显示列表的窗口 */

function Sprite_ListWindow() {
    this.initialize.apply(this, arguments);
}
Sprite_ListWindow.prototype = Object.create(Sprite.prototype);
Sprite_ListWindow.prototype.constructor = Sprite_ListWindow;



Sprite_ListWindow.prototype.initialize = function (w, h, data, data2, list) {
    Sprite.prototype.initialize.call(this)
    this._down = new Sprite_UIDataShow(data)
    this._list = new Sprite_UIListData(w, h)
    this._top = new Sprite_UIDataShow(data2)
    if (list) {
        for (var i = 0; i < list.length; i++) {
            var d = list[i]
            this.addSprite(d)
        }
    }
}

Sprite_ListWindow.prototype.set = function (w, h, data, data2, list) {

    this._down.setUI(data)
    this._list.createMain(w, h)
    this._list.clear()
    this._list.refresh()
    this._top.setUI(data2)
    if (list) {
        for (var i = 0; i < list.length; i++) {
            var d = list[i]
            this.addSprite(d)
        }
    }
}




Sprite_ListWindow.prototype.addSprite = function (data) {
    var s = new Sprite_UIDataShow(data)
    this._list.addSprite(s)
}

Sprite_ListWindow.prototype.addSpriteTo = function (data, id) {
    var s = new Sprite_UIDataShow(data)
    this._list.addSpriteTo(s, id)
}

Sprite_ListWindow.prototype.clear = function () {
    this._list.clear()
}



Sprite_ListWindow.prototype.show = function () {
    this.visible = true
    this._list.visible = true
}
Sprite_ListWindow.prototype.hide = function () {
    this.visible = false
    this._list.visible = false
}


/**显示列表的场景 */

var ww = ww || {}

ww.listscene = {}
ww.listscene.set = {}


ww.listscene.listset = {}

ww.listscene.list = []

ww.listscene.add = function (name, x, y, w, h, data, data2, list) {

    ww.listscene.set[name] = {
        x: x || 0,
        y: y || 0,
        w: w || 0,
        h: h || 0,
        data: data || 0,
        data2: data2 || 0,
        list: list || []
    }
}

ww.listscene.adddata = function (name, data, id) {
    if (!ww.listscene.set[name]) {
        this.add(name)
    }
    ww.listscene.set[name].list.push(data)
    ww.listscene.list.push([name, "add", data])
}

ww.listscene.setdata = function (name, data, id) {
    if (!ww.listscene.set[name]) {
        this.add(name)
    }
    ww.listscene.set[name].list[id] = data
    ww.listscene.list.push([name, "set", data, id])
}
ww.listscene.cleardata = function (name) {
    if (!ww.listscene.set[name]) {
        this.add(name)
    }
    ww.listscene.list.push([name, "clear"])
}
ww.listscene.open = function (name) {
    if (!ww.listscene.set[name]) {
        this.add(name)
    }
    ww.listscene.list.push([name, "open"])
}
ww.listscene.close = function (name) {
    if (!ww.listscene.set[name]) {
        this.add(name)
    }
    ww.listscene.list.push([name, "close"])
}


ww.listscene.move = function (name, x, y) {
    if (!ww.listscene.set[name]) {
        this.add(name)
    }
    ww.listscene.set[name].x = x
    ww.listscene.set[name].y = y
    ww.listscene.list.push([name, "move"])
}

ww.listscene.refresh = function (name) {
    if (!ww.listscene.set[name]) {
        this.add(name)
    }
    ww.listscene.list.push([name, "refresh"])
}

ww.listscene.get = function (name) {
    if (!ww.listscene.set[name]) {
        this.add(name)
    }
    return ww.listscene.set[name]
}


function Sprite_ListScene() {
    this.initialize.apply(this, arguments);
}
Sprite_ListScene.prototype = Object.create(Sprite.prototype);
Sprite_ListScene.prototype.constructor = Sprite_ListScene;

Sprite_ListScene.prototype.initialize = function () {

    Sprite.prototype.initialize.call(this);

    this._hash = {}
};

Sprite_ListScene.prototype.update = function () {
    if (ww.listscene.list.length) {

        for (var i = 0; i < ww.listscene.list.length; i++) {
            var z = ww.listscene.list
            if (z) {
                var name = z[0]
                var set = ww.listscene.get(name)
                if (!this._hash[name]) {
                    this._hash[name] = new Sprite_ListWindow(set.w, set.h, set.data, set.data2, set.list)
                    this.addChild(this._hash[name])
                    this._hash[name].x = set.x
                    this._hash[name].y = set.y

                }
                if (z[1] == "open") {
                    this._hash[name].show()
                }
                if (z[1] == "close") {
                    this._hash[name].hide()
                }
                if (z[1] == "clear") {
                    this._hash[name].clear()
                }
                if (z[1] == "set") {
                    this._hash[name].addSpriteTo(z[2], z[3])
                }
                if (z[1] == "add") {
                    this._hash[name].addSprite(z[2])
                }
                if (z[1] == "move") {
                    this._hash[name].x = set.x
                    this._hash[name].y = set.y
                }
                if (z[1] == "refresh") {
                    this._hash[name].set(set.w, set.h, set.data, set.data2, set.list)
                    this._hash[name].x = set.x
                    this._hash[name].y = set.y
                }
            }
        }
        ww.listscene.list = []
    }

}

