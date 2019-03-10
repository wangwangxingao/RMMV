


var ww = ww || {} 
ww.UIData = ww.UIData ||{}

/*
ww.UIData.goto = function () {
    SceneManager.goto(Scene_GUI)
}
ww.UIData.load = function (data) {
    ww.UIData.save = data
    SceneManager.goto(Scene_GUI)
}
*/
ww.UIData.click = function (data) {
    if (data) {
        var v = data.value
        return v
    }
    return 0
}




ww.UIData.make = function (name, type, value, x, y, width, height, children, object) {
    return {
        name: name || "",
        type: type || "",
        x: x || 0,
        y: y || 0,
        width: width || 100,
        height: height || 100,
        value: value || "",
        children: children || [],
        object: object || {}
    }
}



function Sprite_UIDataShow() {
    this.initialize.apply(this, arguments);
}
//设置原形 
Sprite_UIDataShow.prototype = Object.create(Sprite.prototype);
//设置创造者
Sprite_UIDataShow.prototype.constructor = Sprite_UIDataShow;



/**初始化 */
Sprite_UIDataShow.prototype.initialize = function (data) {
    Sprite.prototype.initialize.call(this);
    this._data = data
    this._childList = []
};

/**设置 */
Sprite_UIDataShow.prototype.setUI = function (data) {
    this._data = data
    if (!data) {
        this.visible = false
    } else {
        this.visible = true
        this.refesh()
    }
}




Sprite_UIDataShow.prototype.update = function () {
    if (this._data) {
        this.updateData()
    }
    Sprite.prototype.update.call(this)
}


Sprite_UIDataShow.prototype.updateData = function () {
    if (this._data) {
        if (this._type != this._data.type || this._value != this._data.value
            || this._w != this._data.width || this._h != this._data.height) {
            this._type = this._data.type
            this._value = this._data.value
            this._w = this._data.width
            this._h = this._data.height
            if (this._type == "bitmap") {
                this.bitmap = ImageManager.loadPicture(this._data.value)
            } else if (this._type == "text") {
                this.bitmap = new Bitmap(this._data.width, this._data.height)
                var w = this.bitmap.window()
                this.bitmap.clear()
                w.drawTextEx(this._data.value, 0, 0, this.bitmap.width, this.bitmap.height)
            } else if (this._type == "color") {
                this.bitmap = new Bitmap(this._data.width, this._data.height)

                var r = Math.randomInt(255)
                var g = Math.randomInt(255)
                var b = Math.randomInt(255)
                var a = 0.2
                if (!this._data.value) {
                    this._data.value = "rgba(" + r + "," + g + "," + b + "," + a + ")"
                }
                this._value = this._data.value
                this.bitmap.fillAll(this._value)
            } else {//if (this._type == "base") {
                this.bitmap = new Bitmap(this._data.width, this._data.height)
            }
        }
        this.x = this._data.x
        this.y = this._data.y
    }
}


Sprite_UIDataShow.prototype.refesh = function () {
    if (this._data) {

        this.updateData()
        var adds = this._data.children
        if (Array.isArray(adds)) {
            var i0 = this._childList.length
            var i1 = adds.length
            for (var i = i0; i < i1; i++) {
                var add = adds[i]
                var sprite = new Sprite_UIDataShow()
                sprite.setUI(add)
                this._childList.push(sprite)
                this.addChild(sprite)
            }
            for (var i = i0 - 1; i >= 0; i--) {
                var sprite = this._childList[i]
                if (i < i1) {
                    var add = adds[i]
                    sprite.setUI(add)
                } else {
                    this.removeChild(sprite)
                    this._childList.pop()
                }
            }
        } else {
            while (this._childList.length) {
                var sprite = this._childList.pop()
                //sprite.clear()
                this.removeChild(sprite)
            }
        }
    }
}



Sprite_UIDataShow.prototype.touchInput = function () {
    if (this.visible && this.isTouchThis(TouchInput.x, TouchInput.y)) {
        this.clickThis()
    }
}

Sprite_UIDataShow.prototype.clickThis = function () {
    if (this.data) {
        ww.UIData.click(this.data)
    }
}




