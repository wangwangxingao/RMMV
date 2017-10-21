//=============================================================================
//  Message.js
//=============================================================================

/*:
 * @plugindesc  
 * Message,窗口信息显示添加背景
 * @author wangwang
 *   
 * @param  Message
 * @desc 插件 窗口信息显示添加背景 ,作者:汪汪
 * @default 汪汪
 *   
 * 
 * @param wh
 * @desc  窗口的长宽,如要使用默认值设置为0
 * @default [0,0]
 * 
 * @param pos
 * @desc 窗口各模式下的位置(第一个为上,第二个数组为中,第三个为下),使用默认值用 "undefined"
 * @default [["undefined",0],["undefined","undefined"],["undefined","undefined"]]
 * 
 * @param  bg
 * @desc 窗口背景图片设置,参数为:[名称,x,y],xy为相对坐标 ,图片放在 img 的 pictures 文件夹内 ,
 * @default ["",0,0]
 * 
 * @param  skin
 * @desc 图片放在 img 的 pictures 文件夹内 ,信息窗口中用他替代system里的窗口图片的图片,不设置使用默认的
 * @default 
 * 
 * */







Game_Message.prototype.setWindowskin = function(skin) {
    this._windowSkin = skin
};

Game_Message.prototype.windowskin = function() {
    if (!this._windowSkin && this._windowSkin !== "") {
        var p = PluginManager.find("Message")
        this._windowSkin = PluginManager.get(p, "skin", "")
    }
    return this._windowSkin;
};



Window_Message.prototype.initialize = function() {
    this.getInit()
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.openness = 0;
    this.initMembers();

    this.createBackground()

    this.createSubWindows();
    this.updatePlacement();
};
Window_Message.prototype.getInit = function() {
    var p = PluginManager.find("Message")
    this._windowSet = PluginManager.getValue(p, "wh")
    this._windowPSet = PluginManager.getValue(p, "pos")
    this._windowBSet = PluginManager.getValue(p, "bg")
};

Window_Message.prototype.loadWindowskin = function() {
    this._windowSkin = $gameMessage.windowskin()
    if (this._windowSkin) {
        this.windowskin = ImageManager.loadPicture(this._windowSkin);
    } else {
        this.windowskin = ImageManager.loadSystem('Window');
    }
};




Window_Message.prototype.createBackground = function() {
    var n = this._windowBSet[0]
    if (!n) { return }
    var s = new Sprite(ImageManager.loadPicture(this._baseName))
    s.x = this._windowBSet[1]
    s.y = this._windowBSet[2]
    this._windowBSprite = s
    this.addChildToBack(this._windowBSprite)
};


Window_Message.prototype.windowWidth = function() {
    return this._windowSet[0] || Graphics.boxWidth;
};

Window_Message.prototype.windowHeight = function() {
    return this._windowSet[1] || this.fittingHeight(this.numVisibleRows());
};

Window_Message.prototype.updatePlacement = function() {
    this._positionType = $gameMessage.positionType();
    var x = (Graphics.boxWidth - width) / 2
    var y = this._positionType * (Graphics.boxHeight - this.height) / 2;
    var pos = this._windowPSet[this._positionType]
    if (pos) {
        var z = pos[0]
        if (z && z !== undefined && z !== "undefined") {
            z = z * 1
            if (isFinite(z)) {
                x = z
            }
        }
        var z = pos[1]
        if (z && z !== undefined && z !== "undefined") {
            var z = z * 1
            if (isFinite(z)) {
                y = z
            }
        }
    }
    this.x = x
    this.y = y
    this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
};




Window_Message.prototype.update = function() {
    this.checkToNotClose();
    Window_Base.prototype.update.call(this);

    this.updataSkin()
    while (!this.isOpening() && !this.isClosing()) {
        if (this.updateWait()) {
            return;
        } else if (this.updateLoading()) {
            return;
        } else if (this.updateInput()) {
            return;
        } else if (this.updateMessage()) {
            return;
        } else if (this.canStart()) {
            this.startMessage();
        } else {
            this.startInput();
            return;
        }
    }


};

Window_Message.prototype.updataSkin = function() {
    if (this._windowSkin !== $gameMessage.windowskin()) {
        this._windowSkin = $gameMessage.windowskin()
        if (this._windowSkin) {
            this.windowskin = ImageManager.loadPicture(this._windowSkin);
        } else {
            this.windowskin = ImageManager.loadSystem('Window');
        }
    }
}