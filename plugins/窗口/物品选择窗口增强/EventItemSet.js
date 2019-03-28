//=============================================================================
// EventItemSet.js
//=============================================================================

/*:
 * @plugindesc 事件中物品选择窗口的设置
 * @author wangwang
 *   
 * @param EventItemSet
 * @desc 插件 场景修改窗口位置
 * @default 汪汪
 *    
 * @param needsNumber
 * @desc 是否显示数值的开关名,注意是开关!
 * @default 100
 * 
 * @param x
 * @desc 窗口x的变量名
 * @default 101
 * 
 * @param y
 * @desc 窗口y的变量名
 * @default 102
 * 
 * 
 * @param width
 * @desc 窗口的宽的变量名
 * @default 103
 * 
 * 
 * @param height
 * @desc 窗口的高的变量名
 * @default 104
 * 
 * 
 * @param maxCols
 * @desc 窗口的最大列的变量名
 * @default 0
 * 
 * 
 * @param spacing
 * @desc 窗口的行距的变量名
 * @default 0
 * 
 * 
 * @param background
 * @desc 窗口背景的变量名
 * @default 105
 * 
 * @param backgroundX
 * @desc 窗口背景y的变量名
 * @default 0
 * 
 * @param backgroundY
 * @desc 窗口背景y的变量名
 * @default 0
 * 
 * @help
 * 值为变量或开关的id号,如果为0则不改变
 * */


var ww = ww || {}

ww.EventItemSet = {}
ww.EventItemSet.param = ww.PluginManager.get("EventItemSet")






Window_EventItem.prototype.start = function () {
    this.resizeOnStart()
    this.refresh();
    this.updatePlacement();
    this.select(0);
    this.open();
    this.activate();
};

Window_EventItem.prototype.needsNumber = function () {
    var needsNumber = ww.EventItemSet.param["needsNumber"]
    if (needsNumber) {
        return $gameSwitches.value(needsNumber)
    } else {
        return true;
    }
    //return true;
};



Window_EventItem.prototype.resizeOnStart = function () {
    var w = ww.EventItemSet.param["width"]
    if (w) {
        this.width = $gameVariables.value(w)
    }
    var h = ww.EventItemSet.param["height"]
    if (h) {
        var h = $gameVariables.value(h)
        this.heigth = h
    }

    var b = ww.EventItemSet.param["background"]
    if (b) {
        var b = $gameVariables.value(b) || ""
        var x = ww.EventItemSet.param["x"]
        if (x) {
            var x = $gameVariables.value(x)
        } else {
            var x = 0
        }
        var y = ww.EventItemSet.param["y"]
        if (y) {
            var y = $gameVariables.value(y)
        } else {
            var y = 0
        }
        this.setBackgroundName(b, x, y)
    }
    /* if (this._messageWindow.y >= Graphics.boxHeight / 2) {
        this.y = 0;
    } else {
        this.y = Graphics.boxHeight - this.height;
    }*/
};




Window_EventItem.prototype.updatePlacement = function () {
    var x = ww.EventItemSet.param["x"]
    if (x) {
        this.x = $gameVariables.value(x)
    }
    var y = ww.EventItemSet.param["y"]
    if (y) {
        this.y = $gameVariables.value(y)
    }
    /* if (this._messageWindow.y >= Graphics.boxHeight / 2) {
        this.y = 0;
    } else {
        this.y = Graphics.boxHeight - this.height;
    }*/
};



Window_EventItem.prototype.maxCols = function () {
    var x = ww.EventItemSet.param["maxCols"]
    if (x) {
        return $gameVariables.value(x)
    } else {
        return 2
    }
    return 2;
};


/**行距 */
Window_EventItem.prototype.spacing = function () {
    var x = ww.EventItemSet.param["spacing"]
    if (x) {
        return $gameVariables.value(x)
    } else {
        return 48
    }
    return 48;
};




Window_EventItem.prototype.setBackgroundName = function (name, x, y) {
    if (!name) {
        this.opacity = 255;
    } else {
        this.opacity = 0;
    }
    if (!this._dimmerSprite) {
        this._dimmerSprite = new Sprite();
        this._dimmerSprite.bitmap = new Bitmap(0, 0);
        this.addChildToBack(this._dimmerSprite);
    }
    this._dimmerSprite.bitmap = ImageManager.loadPicture(name || "")
    this._dimmerSprite.x = x || 0
    this._dimmerSprite.y = y || 0
    this._dimmerSprite.visible = !!name;
    this.updateBackgroundDimmer();
};