Bitmap.bltLoad = function (w, h, bitmap, sx, sy, sw, sh, tx, ty, tw, th) {

    var bitmap2 = new Bitmap(w, h)
    bitmap2._loadingState = 'wait'
    bitmap.addLoadListener(function () {
        bitmap2._loadingState = 'loaded'
        bitmap2.blt(bitmap, sx, sy, sw, sh, tx, ty, tw, th)
        bitmap2._callLoadListeners();
    });
    return bitmap2
}


Bitmap._window = null
Bitmap.prototype.window = function () {
    if (!Bitmap._window) {
        Bitmap._window = new Window_ShowUI()
    }
    Bitmap._window.contents = this
    return Bitmap._window
}


function Window_ShowUI() {
    this.initialize.apply(this, arguments);
}
//设置原形 
Window_ShowUI.prototype = Object.create(Window_Base.prototype);
//设置创造者
Window_ShowUI.prototype.constructor = Window_ShowUI;

Window_ShowUI.prototype.processEscapeCharacter = function (code, textState) {
    //检查 参数
    switch (code) {
        //当 "C"
        case 'C':
            //改变文本颜色( 文本颜色 ( 获得转换参数(文本状态) ))
            this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));
            break;
            //当 "I"
        case 'I':
            //处理绘制图标(  获得转换参数(文本状态) 文本状态)
            this.processDrawIcon(this.obtainEscapeParam(textState), textState);
            break;
            //
        case '{':
            this.makeFontBigger();
            break;
        case '}':
            this.makeFontSmaller();
            break;
        case 'F':
            this.makeFontSize(this.obtainEscapeParam(textState), textState);
            break;
    }
}

Window_ShowUI.prototype.makeFontSize = function (iconIndex, textState) {
    this.contents.fontSize = iconIndex || 0
};






function Game_ShowUI(id, showData, setData, children) {
    this.initialize.apply(this, arguments);
}

Game_ShowUI.prototype.constructor = Game_ShowUI;
Game_ShowUI.prototype.initialize = function (id, showData, setData, children) {
    this.id = id
    this.showData = showData || 0;
    this.setData = setData || 0;
    this.children = children || [];
    this.refesh()
    return this
}


Game_ShowUI.prototype.refesh = function () {
    this.refreshShow = true
    this.refreshSet = true
    this.refreshChildren = true
    return this
}

/**
 * 新ui
 * @param {*} id 
 * @param {*} showData 
 * @param {*} setData 
 * @param {*} children 
 */
Game_ShowUI.prototype.new = function (id, showData, setData, children) {
    return new Game_ShowUI(id, showData, setData, children)
}
Game_ShowUI.new = function (id, showData, setData, children) {
    return new Game_ShowUI(id, showData, setData, children)
}


Game_ShowUI.prototype.setId = function (id) {
    if (id !== undefined) {
        this.id = id
    }
    return this
}

Game_ShowUI.prototype.isObject = function (o) {
    return o && typeof o == "object"
}

Game_ShowUI.prototype.setSet = function (setData, fg) {
    if (setData !== undefined) {
        if (fg && this.isObject(setData) && this.isObject(this.setData)) {
            for (var i in setData) {
                this.setData[i] = setData[i]
            }
        } else {
            this.setData = setData || 0;
        }
        this.refreshSet = true
    }
    return this
}
Game_ShowUI.prototype.setShow = function (showData) {
    if (showData !== undefined) { 
        this.showData = showData || 0;
        this.refreshShow = true
    }
    return this
}

Game_ShowUI.prototype.setChildren = function (children) {
    if (children !== undefined) {
        this.children = children || [];
        this.refreshChildren = true
    }
    return this
}

Game_ShowUI.prototype.set = function (id, showData, setData, children) {
    this.setId(id)
    this.setShow(showData)
    this.setSet(setData)
    this.setChildren(children)
    return this
}

Game_ShowUI.prototype.push = function (ui) {
    this.children.push(ui)
    this.refreshChildren = true
    return this
}



Game_ShowUI.prototype.pushUI = function (id, showData, setData, children) {
    var ui = this.new(id, showData, setData, children)
    this.push(ui)
    return this
}

Game_ShowUI.prototype.getChild = function (index) {
    return this.children[index]
}

Game_ShowUI.prototype.childLength = function () {
    return this.children.length
}


Game_ShowUI.prototype.setChildLength = function (length) {

    var l = this.children.length
    if (l < length) {
        while (l < length) {
            this.push(new Game_ShowUI(l))
            l++
        }
        this.refreshChildren = true
    } else if (l > length) {
        this.children.length = length < 0 ? 0 : length
        this.refreshChildren = true
    }
}

Game_ShowUI.prototype.setChild = function (index, ui) {
    this.children[index] = ui
    this.refreshChildren = true
    return this
}

Game_ShowUI.prototype.setChildUI = function (index, id, showData, setData, children) {
    this.setChild(index, this.new(id, showData, setData, children))
    return this
}

Game_ShowUI.prototype.remove = function (id) {
    var index = this.indexOf(id)
    this.removeIndex(index)
    return this
}
Game_ShowUI.prototype.removeIndex = function (index) {
    if (index >= 0) {
        this.children.splice(index, 1)
        this.refreshChildren = true
    }
    return this
}

Game_ShowUI.prototype.indexOf = function (id) {
    for (var index = 0; index < this.children.length; index++) {
        var element = this.children[index];
        if (element && element.id == id) {
            return index
        }
    }
    return -1
}


Game_ShowUI.prototype.findChild = function (id) {
    for (var index = 0; index < this.children.length; index++) {
        var element = this.children[index];
        if (element && element.id == id) {
            return element
        }
    }
}


Game_ShowUI.prototype.find = function () {
    for (var index = 0; index < arguments.length; index++) {
        var element = arguments[index];
        var e = e ? e.findChild(element) : this.findChild(element)
        if (!e) {
            return
        }
    }
    return e
}


Game_ShowUI.prototype.setScaleXY = function (x, y) {
    this.setSet({
        scaleX: x,
        scaleY: y
    }, 1)
    return this
}

Game_ShowUI.prototype.setXY = function (x, y) {
    this.setSet({
        x: x,
        y: y
    }, 1)
    return this
}


Game_ShowUI.prototype.setAddXY = function (x, y) {
    if (this.isObject(this.setData)) {
        this.setSet({
            x: (this.setData.x || 0) + x,
            y: (this.setData.y || 0) + y
        }, 1)
    } else {
        this.setSet({
            x: x,
            y: y
        })
    }
    return this
}

Game_ShowUI.prototype.setEmpty = function () {
    this.setShow({
        type: "",
        value: "",
        width: 0,
        height: 0
    })
    return this
}

Game_ShowUI.prototype.setFace = function (faceName, index, width, height) {
    this.setShow({
        type: "face",
        value: faceName || "",
        index: index || 0,
        width: width || 0,
        height: height || 0
    })
    return this
}

/**
 * 设置图标
 * @param {*} value 
 * @param {*} width 
 * @param {*} height 
 */
Game_ShowUI.prototype.setIcon = function (value, width, height) {
    this.setShow({
        type: "icon",
        value: value || "",
        width: width || 0,
        height: height || 0
    })
    return this
}




Game_ShowUI.prototype.setPicture = function (value) {
    this.setShow({
        type: "picture",
        value: value || "",
        width: width || 0,
        height: height || 0
    })
    return this
}

Game_ShowUI.prototype.setText = function (value, width, height, x, y) {
    this.setShow({
        type: "text",
        value: value || "",
        width: width || 0,
        height: height || 0,
        x: x || 0,
        y: y || 0
    })
    return this
}


Game_ShowUI.prototype.setRect = function (value, width, height) {
    this.setShow({
        type: "rect",
        value: value || "",
        width: width || 0,
        height: height || 0
    })
    return this
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
    this._data = null
    this._childList = []
    this.setUI(data)
};

/**设置 */
Sprite_UIDataShow.prototype.setUI = function (data) {
    this._data = data
    if (!data) {
        this.visible = false
        this._childList.length = 0
        this.children.length = 0
    } else {
        this.visible = true
        this.refesh()
    }
}


Sprite_UIDataShow.prototype.update = function () {
    if (this._data) {
        this.updateShow()
        this.updateSet()
        this.updateChildren()
    }
    Sprite.prototype.update.call(this)
}
/**更新设置 */
Sprite_UIDataShow.prototype.updateSet = function () {
    if (this._data.refreshSet) {
        this._data.refreshSet = false
        this.refreshSet()
    }
}


/**更新显示 */
Sprite_UIDataShow.prototype.updateShow = function () {
    if (this._data.refreshShow) {
        this._data.refreshShow = false
        this.refreshShow()
    }
}

/**更新子项 */
Sprite_UIDataShow.prototype.updateChildren = function () {
    if (this._data.refreshChildren) {
        this._data.refreshChildren = false
        this.refreshChildren()
    }
}

/**刷新设置 */
Sprite_UIDataShow.prototype.refreshSet = function () {
    if (!this._data) {
        return
    }
    var setData = this._data.setData
    if (setData) {
        for (var i in setData) {
            if (typeof this[i] == "function") {
                if (Array.isArray(setData[i])) {
                    this[i].apply(this, setData[i])
                } else {
                    this[i](setData[i])
                }
            } else {
                this[i] = setData[i]
            }
        }
    }
}


Sprite_UIDataShow.prototype.refreshShow = function (load) {
    if (!this._data) {
        return
    }
    var showData = this._data.showData
    if (showData) {
        var width = showData.width || 0
        var height = showData.height || 0
        var value = showData.value
        this.scale.x = 1
        this.scale.y = 1
        var bitmap
        this.setFrame(0, 0, 0, 0);
        if (showData.type == "face") {
            var faceName = value || ""
            var faceIndex = (showData.index || 0) * 1
            var bitmap = ImageManager.loadFace(faceName);
            var sw = Window_Base._faceWidth;
            var sh = Window_Base._faceHeight;
            var sx = faceIndex % 4 * sw;
            var sy = Math.floor(faceIndex / 4) * sh;
            //this.setFrame(sx, sy, sw, sh);
            if (width && height && sw && sh) {
                this.bitmap = Bitmap.bltLoad(width, height, bitmap, sx, sy, sw, sh, 0, 0, width, height)
            } else {
                this.bitmap = Bitmap.bltLoad(sw, sh, bitmap, sx, sy, sw, sh, 0, 0, sw, sh)

                //this.setFrame(sx, sy, sw, sh);
            }
        } else if (showData.type == "icon") {
            var iconIndex = (value || 0) * 1
            var bitmap = ImageManager.loadSystem('IconSet');
            var sw = Window_Base._iconWidth;
            var sh = Window_Base._iconHeight;
            var sx = iconIndex % 16 * sw;
            var sy = Math.floor(iconIndex / 16) * sh;
            this.bitmap = bitmap
            if (width && height && sw && sh) {
                this.bitmap = Bitmap.bltLoad(width, height, bitmap, sx, sy, sw, sh, 0, 0, width, height)
            } else {
                this.bitmap = Bitmap.bltLoad(sw, sh, bitmap, sx, sy, sw, sh, 0, 0, sw, sh)
            }
        } else if (showData.type == "picture") {
            var bitmap = ImageManager.loadPicture(value)
            this.bitmap = bitmap
            if (width && height) {
                this.bitmap = Bitmap.bltLoad(width, height, bitmap, sx, sy, sw, sh, 0, 0, width, height)
            }
        } else if (showData.type == "text") {
            if (width && height && value) {
                this.bitmap = new Bitmap(showData.width, showData.height)
                var text = value || ""
                var w = this.bitmap.window()
                w.drawTextEx(text, showData.x || 0, showData.y || 0)
            } else {
                this.bitmap = ImageManager.loadEmptyBitmap()
            }
        } else if (showData.type == "rect") {
            if (width && height) {
                this.bitmap = new Bitmap(width, height)
                if (Array.isArray(value)) {
                    this.bitmap.gradientFillRect(0, 0, this.bitmap.width, this.bitmap.height, value[0] || "rgba(0,0,0,0)", value[1] || "rgba(0,0,0,0)")
                } else {
                    this.bitmap.fillAll(value || "rgba(0,0,0,0)");
                }
            } else {
                this.bitmap = ImageManager.loadEmptyBitmap()
            }
        } else {
            this.bitmap = ImageManager.loadEmptyBitmap()
        }
    }
}


Sprite_UIDataShow.prototype.refesh = function () {
    if (this._data) {
        this.refreshSet()
        this.refreshShow()
        this.refreshChildren()
    } else {
        this.visible = false
    }
}



Sprite_UIDataShow.prototype.refreshChildren = function () {
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






/*
d = Game_ShowUI.new().setIcon(1, 100, 100).push(Game_ShowUI.new().setRect("blue", 200, 10))
s = new Sprite_UIDataShow(d)

SceneManager._scene.addChild(s);

*/