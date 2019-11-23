//=============================================================================
// mapActorEquit.js
//=============================================================================
/*: 
 * @name mapActorEquit 
 * @plugindesc 地图显示角色装备
 * @author 汪汪
 * @version 2.0
 * 
 * 
 * @param mapActorEquit 
 * @desc  地图显示角色装备
 * @default 汪汪
 * 
 * @param open 
 * @desc  窗口打开的开关,默认199号
 * @default 199
 * 
 * 
 * @param update 
 * @desc  窗口刷新频率(帧),不设置为不更新
 * @default 60
 * 
 * 
 * @param windowSet 
 * @desc  窗口设置,height 窗口固有高  lineHeight 窗口每一行添加的高 ,scale 缩放比例,backOpacity 窗口背景不透明度 
 * @default {"x":0,"y":0,"width":500,"height":10,"lineHeight":144,"scale":0.5,"backOpacity":255}
 * 
 * 
 * @param windowText
 * @desc  显示的文本 
 * @default "\\f[15]装备信息"
 * 
 * 
 * @param windowTextSet 
 * @desc  text设置 width height 为显示文本的图片的大小
 * @default {"x":72,"y":0,"width":200,"height":100}
 * 
 * @param actorPos 
 * @desc  每个角色位置设置
 * @default {"x":0,"y":0,"ix":0,"iy":144}
 * 
 * 
 * @param faceSet 
 * @desc  脸图设置,width和height为缩放到的大小,不设置为默认大小
 * @default {"x":0,"y":0,"width":64,"height":64}
 * 
 * 
 * @param text
 * @desc  显示的文本 
 * @default "\\f[15]装备信息"
 * 
 * 
 * @param textSet 
 * @desc  text设置 width height 为显示文本的图片的大小
 * @default {"x":72,"y":0,"width":200,"height":100}
 * 
 * 
 * 
 * @param equipPos 
 * @desc  装备位置设置
 * @default {"x":72,"y":50,"ix":48,"iy":0}
 * 
 * 
 * 
 * @param equipBase
 * @desc  装备图标设置,width和height为缩放到的大小,不设置为默认大小
 * @default {"x":0,"y":0,"width":0,"height":0}
 * 
 * 
 * @param equipState 
 * @desc  装备状态图标设置, o 为 不透明度,width和height为缩放到的大小,不设置为默认大小
 * @default {"o":125,"x":0,"y":0,"width":0,"height":0}
 * 
 * 
 * @param equipDurability 
 * @desc  装备损害显示图标,不会损坏的显示为0,只小于1为3,小于0.5为2,小于0.2为1,可以以此类推添加
 * @default [0,1,3,0.5,2,0.2,1]
 *  
 * 
 * 
 * @help
 * 调用脚本 即立刻刷新
 * ww.mapActorEquit.refresh = true 
 * 
 * */

var ww = ww || {}
ww.plugin = {
    find: function (n, l, p, m) {
        l = PluginManager._parameters;
        p = l[(n || "").toLowerCase()];
        if (!p) {
            for (m in l) {
                if (l[m] && l[m][n]) {
                    p = l[m]
                }
            }
        };
        return p || {}
    },
    parse: function (i) {
        try {
            return JSON.parse(i)
        } catch (e) {
            try {
                return eval(i)
            } catch (e2) {
                return i
            }
        }
    },
    get: function (n, o, p) {
        o = o || {};
        p = this.find(n);
        for (n in p) {
            o[n] = this.parse(p[n])
        };
        return o
    }
};


ww.mapActorEquit = {};

ww.plugin.get("mapActorEquit", ww.mapActorEquit);

ww.isObject = function (o) {
    return o && typeof o == "object"
}




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




function Sprite_UIDataShow() {
    this.initialize.apply(this, arguments);
}
//设置原形 
Sprite_UIDataShow.prototype = Object.create(Sprite.prototype);
//设置创造者
Sprite_UIDataShow.prototype.constructor = Sprite_UIDataShow;


/**初始化 */
Sprite_UIDataShow.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.initData()
    this.refresh()
};



Sprite_UIDataShow.prototype.initData = function () {
    this._data = {}
}
/**
 * 
 * @param {*} n 名称
 * @param {*} v 值
 * @param {*} d 默认值
 * @param {*} u 是否跳过
 */
Sprite_UIDataShow.prototype.set = function (n, v, d, u) {
    if (u || v !== undefined) {
        v = v || d
        if (this._data[n] !== v) {
            this._data[n] = v
            this._change = true
        }
    }
}

Sprite_UIDataShow.prototype.setWH = function (w, h) {
    this.set("width", w, 0)
    this.set("height", h, 0)
}
Sprite_UIDataShow.prototype.setType = function (v) {
    if (this._data.type != v) {
        this._data.type = v
        this._change = true
    }
}
Sprite_UIDataShow.prototype.setValue = function (v) {
    this.set("value", v, "", 1)
}

Sprite_UIDataShow.prototype.setIndex = function (v) {
    this.set("index", v, 0, 1)
}

Sprite_UIDataShow.prototype.setText = function (v, x, y) {
    this.setType("text")
    this.set("value", v, "", 1)
    this.set("x", x, 0, 1)
    this.set("y", y, 0, 1)
}

Sprite_UIDataShow.prototype.setIcon = function (v) {
    this.setType("icon")
    this.set("value", v, "", 1)
}

Sprite_UIDataShow.prototype.setFace = function (v, i) {
    this.setType("face")
    this.set("value", v, "", 1)
    this.set("index", i, 0, 1)
}


Sprite_UIDataShow.prototype.setPic = function (v) {
    this.setType("picture")
    this.set("value", v, "", 1)
}

Sprite_UIDataShow.prototype.setRect = function (v) {
    this.setType("rect")
    this.set("value", v, "", 1)
}

Sprite_UIDataShow.prototype.setByObject = function (o) {
    if (ww.isObject(o)) {
        this.x = o.x || 0
        this.y = o.y || 0

        this.opacity = o.o || 255
        this.setWH(o.width, o.height)
    }
}


Sprite_UIDataShow.prototype.update = function () {
    Sprite.prototype.update.call(this)
    if (this._change) {
        this.refresh()
    }
}

Sprite_UIDataShow.prototype.refresh = function () {
    this._change = false
    var showData = this._data
    var width = showData.width || 0
    var height = showData.height || 0
    var value = showData.value
    var bitmap
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



function Sprite_UIActorEquips() {
    this.initialize.apply(this, arguments);
}
Sprite_UIActorEquips.prototype = Object.create(Sprite.prototype);
Sprite_UIActorEquips.prototype.constructor = Sprite_UIActorEquips;

Sprite_UIActorEquips.prototype.initialize = function (actor) {
    Sprite.prototype.initialize.call(this);
    this.create()
    this.setActor(actor)
};

Sprite_UIActorEquips.prototype.setActor = function (actor) {
    if (this._battler != actor) {
        this._battler = actor
    }
    this.refresh()

}
Sprite_UIActorEquips.prototype.create = function () {
    this.createFace()

    this.createText()
    this.createEquips()

}
Sprite_UIActorEquips.prototype.createFace = function () {
    this._face = new Sprite_UIDataShow()
    this._face.setFace("", 0)
    this._face.setByObject(ww.mapActorEquit.faceSet)

    this.addChild(this._face)

};


Sprite_UIActorEquips.prototype.createText = function () {
    this._text = new Sprite_UIDataShow()
    this._text.setByObject(ww.mapActorEquit.textSet)
    this._text.setText(ww.mapActorEquit.text, ww.mapActorEquit.textSx || 0, ww.mapActorEquit.textSy || 0)
    this.addChild(this._text)
};


Sprite_UIActorEquips.prototype.createEquips = function () {

    this._equips = new Sprite()

    this.addChild(this._equips)


};

Sprite_UIActorEquips.prototype.makeEquips = function () {

    if (this._battler) {

        var items = this._battler.equips()

        this.setEquipLength(items.length)
        this.setEquipPos()
        this.setEquips(items)
    } else {
        this.setEquipLength(0)
    }



};
Sprite_UIActorEquips.prototype.setEquipPos = function () {
    var d = ww.mapActorEquit.equipPos
    if (ww.isObject(d)) {
        var l = this._equips.children.length
        for (var index = 0; index < l; index++) {
            var e = this._equips.children[index];
            e.x = (d.x || 0) + (d.ix || 0) * (index || 0)
            e.y = (d.y || 0) + (d.iy || 0) * (index || 0)
        }
    }
}

Sprite_UIActorEquips.prototype.setEquipLength = function (length) {
    var children = this._equips.children
    var l = children.length
    if (l < length) {
        while (l < length) {
            this._equips.addChild(this.createEquip())
            l++
        }
    } else if (l > length) {
        children.length = length < 0 ? 0 : length
    }
}





Sprite_UIActorEquips.prototype.setEquips = function (items) {
    var l = this._equips.children.length
    for (var index = 0; index < l; index++) {
        var e = this._equips.children[index];
        var item = items[index]
        if (item) {
            e._base.setIcon(item.iconIndex)
        } else {
            e._base.setIcon(0)
        }
        e._state.setIcon(this.getEquipDurabilityIcon(item))

    }
}


Sprite_UIActorEquips.prototype.getEquipDurabilityIcon = function (item) {
    if (item) {
        var cur = DataManager.getDurability(item);
        var max = DataManager.getMaxDurability(item);
        var d = ww.mapActorEquit.equipDurability
        if (Array.isArray(d)) {
            if (cur > 0) {
                var f = cur / max
                var re = 0
                for (var index = 1; index < d.length; index += 2) {
                    var v = d[index];
                    var icon = d[index + 1]
                    if (f <= v) {
                        re = icon
                    } else {
                        break
                    }
                }
                return re
            } else {
                return d[0] || 0;
            }
        }
    }
    return 0

}
Sprite_UIActorEquips.prototype.createEquip = function () {
    var s = new Sprite()

    var d = ww.mapActorEquit.equipBase
    var base = new Sprite_UIDataShow()
    base.setIcon()
    base.setByObject(d)
    s._base = base

    s.addChild(base)
    var state = new Sprite_UIDataShow()
    state.setIcon()
    var d = ww.mapActorEquit.equipState
    state.setByObject(d)


    s._state = state


    s.addChild(state)

    return s

};
Sprite_UIActorEquips.prototype.refresh = function () {
    if (this._battler) {
        this._face.setFace(this._battler.faceName(), this._battler.faceIndex())
        this.visible = true
    } else {
        this.visible = false
    }
    this.makeEquips()
};




function Sprite_MapActorEquit() {
    this.initialize.apply(this, arguments);
}
Sprite_MapActorEquit.prototype = Object.create(Sprite.prototype);
Sprite_MapActorEquit.prototype.constructor = Sprite_MapActorEquit;


Sprite_MapActorEquit.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this)
    this.refresh()
}




Sprite_MapActorEquit.prototype.refresh = function () {
    var m = $gameParty.members()
    this.setActorLength(m.length)
    for (var index = 0; index < m.length; index++) {
        var element = m[index];
        var e = this.children[index]
        e.setActor(element)
    }

}

Sprite_MapActorEquit.prototype.setActorLength = function (length) {
    var children = this.children
    var l = children.length
    if (l < length) {
        var d = ww.mapActorEquit.actorPos
        var x = 0
        var y = 0
        var ix = 0
        var iy = 0
        if (ww.isObject(d)) {
            x = (d.x || 0)
            ix = (d.ix || 0)
            y = (d.y || 0)
            iy = (d.iy || 0)
        }
        while (l < length) {
            var e = this.createEquip()
            e.x = x + ix * l
            e.y = y + iy * l
            this.addChild(e)
            l++
        }
    } else if (l > length) {
        children.length = length < 0 ? 0 : length
    }
}
Sprite_MapActorEquit.prototype.createEquip = function () {
    return new Sprite_UIActorEquips()
}




function Window_MapActorEquit() {
    this.initialize.apply(this, arguments);
}
Window_MapActorEquit.prototype = Object.create(Window_Base.prototype);
Window_MapActorEquit.prototype.constructor = Window_MapActorEquit;

Window_MapActorEquit.prototype.initialize = function () {
    Window_Base.prototype.initialize.call(this)
    this._show = new Sprite_MapActorEquit()
    this._windowContentsSprite.addChild(this._show)

    this._text = new Sprite_UIDataShow()
    this._text.setByObject(ww.mapActorEquit.windowTextSet)
    this._text.setText(ww.mapActorEquit.windowText, ww.mapActorEquit.windowTextSx || 0, ww.mapActorEquit.windowTextSy || 0)
    this._windowContentsSprite.addChild(this._text)

    this.refresh()
    this.openness = 0
    this._time = 0
}



Window_MapActorEquit.prototype.getOpen = function () {
    if (ww.mapActorEquit.open) {
        return $gameSwitches.value(ww.mapActorEquit.open)
    } else {
        return ww.mapActorEquit.open !== false
    }
}

Window_MapActorEquit.prototype.updateTime = function () {
    if (ww.mapActorEquit.update) {
        this._time--
        if (this._time < 0) {
            ww.mapActorEquit.refresh = true
            this._time = ww.mapActorEquit.update
        }
    }
}
Window_MapActorEquit.prototype.update = function () {
    Window_Base.prototype.update.call(this)
    this.updateTime()
    if (ww.mapActorEquit.refresh) {
        this.refresh()
    }
    if (this.getOpen()) {
        this.open()
    } else {
        this.close()
    }
}
Window_MapActorEquit.prototype.refresh = function () {
    ww.mapActorEquit.refresh = false
    var m = $gameParty.members()
    var d = ww.mapActorEquit.windowSet
    if (ww.isObject(d)) {
        var w = d.width || 0
        var h = (d.lineHeight || 0) * m.length + (d.height || 0)
        var x = d.x || 0
        var y = d.y || 0
        this.move(x, y, w, h)
        if (d.scale) {
            this.scale.x = d.scale
            this.scale.y = d.scale
        } else {
            this.scale.x = 1
            this.scale.y = 1
        }
        if (d.backOpacity !== undefined) {
            this.backOpacity = d.backOpacity || 0
        } 
    } else {
        this.scale.x = 1
        this.scale.y = 1
        this.backOpacity = 0
    }
    this._show.refresh()
}




ww.mapActorEquit.createSpriteset = Scene_Map.prototype.createSpriteset;
Scene_Map.prototype.createSpriteset = function () {
    ww.mapActorEquit.createSpriteset.call(this);
    this._mapActorEquit = new Window_MapActorEquit()
    this.addChild(this._mapActorEquit)


};