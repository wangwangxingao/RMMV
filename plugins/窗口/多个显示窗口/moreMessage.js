//=============================================================================
// moreMessage.js
//=============================================================================

/*:
 * @plugindesc 输入窗口切换
 * @authorw wangwang
 * 
 * 
 * @help 
 *  
 * 
 * SceneManager._scene.setMessage(name,value) 
 * name 为字符串 或者为空 为空时为主窗口
 * value 为类型,可不填(之前的那种),当为2时,这个窗口是开始并行的(并行时,只接受下面有唯一一个文本显示,如果有多个文本显示会卡住.无法继续进行,并行的窗口不接受输入操作,无法对应选项,数值输入等输入)
 * 
 * 切换到这个窗口(如果没有则创建)
 * SceneManager._scene.delMessage(name) 
 * name 为字符串  删除那个窗口 
 * 
 * SceneManager._scene.closeMessage(name) 
 * name 为字符串  关闭那个窗口(额,和删除有啥区别吗....)
 *  
 * 默认新建窗口不会主动关闭,切换之后会不再更新
 * 
*/


function Window_MessageClone() {
    this.initialize.apply(this, arguments);
}


/**设置原形  */
Window_MessageClone.prototype = Object.create(Window_Message.prototype);
/**设置创造者 */
Window_MessageClone.prototype.constructor = Window_MessageClone;

Window_MessageClone.prototype.update = function () {
    if (!this._messagestop) {
        //更新正常窗口
        this.update0()
    } else if (this._messagestop == 1) {
        //完全冻结 
        this.update1()
    } else if (this._messagestop == 2) {
        //并行开始
        this.update2()
    } else if (this._messagestop == 3) {
        //并行更新
        this.update3()
    }
}

/**终止消息 */
Window_MessageClone.prototype.terminateMessage = function () {
    if (!this._notclose) {
        this.cloneClose();
    }
    if (!this._messagestop) {
        $gameMessage.clear();
        console.log("gameMessage", "clear")
    }
};


Window_MessageClone.prototype.cloneClose = function () {
    this.close();
    this._goldWindow.close();
    console.log(this._messagename, "close")
};

Scene_Base.prototype.addMessage = function (name) {
    this._messageWindows = this._messageWindows || {}
    if (!this._messageWindows[name]) {
        var w = new Window_MessageClone();
        //添加窗口(消息窗口)
        this.addWindow(w);
        ///消息窗口 辅助窗口() 对每一个 窗口
        w.subWindows().forEach(function (window) {
            //添加窗口(窗口)
            this.addWindow(window);
        }, this);
        this._messageWindows[name] = w
        w._messagestop = 1
        w._messagename = name
        w._notclose = 1
    }
};

//设置信息
Scene_Base.prototype.setMessage = function (name, value) {
    this._messageWindows = this._messageWindows || {}
    if (!this._messageWindows[name]) {
        this.addMessage(name)
    }
    for (var i in this._messageWindows) {
        var w = this._messageWindows[i]
        if (i == name) {
            w._messagestop = value || 0
        } else {
            if (!w._messagestop) {
                w._messagestop = 1
            }
        }
    }
    var w = this._messageWindow
    if (!name) {
        w._messagestop = value || 0
    } else {
        if (!w._messagestop) {
            w._messagestop = 1
        }
    }
};

Scene_Base.prototype.delMessage = function (name) {
    this._messageWindows = this._messageWindows || {}
    var w = this._messageWindows[name]
    if (w) {
        w.subWindows().forEach(function (window) {
            this._windowLayer.removeChild(window)
        }, this);
        this._windowLayer.removeChild(w)
        delete this._messageWindows[name]
    }
};

Scene_Base.prototype.closeMessage = function (name) {
    this._messageWindows = this._messageWindows || {}
    var w = this._messageWindows[name]
    if (w) {
        w.cloneClose()
    }
};


Scene_Base.prototype.createMessageWindow = function () {
    this._messageWindow = new Window_MessageClone();
    this.addWindow(this._messageWindow);
    this._messageWindow.subWindows().forEach(function (window) {
        this.addWindow(window);
    }, this);
};

Scene_Map.prototype.createMessageWindow = function () {
    this._messageWindow = new Window_MessageClone();
    this.addWindow(this._messageWindow);
    this._messageWindow.subWindows().forEach(function (window) {
        this.addWindow(window);
    }, this);
};


Scene_Battle.prototype.createMessageWindow = function () {
    //消息窗口 = 新 窗口消息
    this._messageWindow = new Window_MessageClone();
    //添加窗口( 消息窗口 ) 
    this.addWindow(this._messageWindow);
    //消息窗口 辅助窗口 对每一个 窗口 
    this._messageWindow.subWindows().forEach(function (window) {
        //添加窗口(窗口)
        this.addWindow(window);
    }, this);
};


/**更新正常窗口 */
Window_MessageClone.prototype.update0 = function () {
    Window_Message.prototype.update.call(this);
};



/**更新冻结 */
Window_MessageClone.prototype.update1 = function () {
    Window_Base.prototype.update.call(this)
    if (this._needUpdatePlacement) {
        this.updatePlacement()
    }
};



/**更新并行开始 */
Window_MessageClone.prototype.update2 = function () {
    if (this._messagestop == 2) {
        this._messagestop = 3
        //console.log(this._messagename, "start")
        if (this.canStart()) {
            this.startMessage();
        }
        $gameMessage.clear();
    }
};


/**更新并行窗口 */
Window_MessageClone.prototype.update3 = function () {
    //检查不要关闭()
    this.checkToNotClose();
    Window_Base.prototype.update.call(this);
    if (this._needUpdatePlacement) {
        this.updatePlacement()
    }
    while (!this.isOpening() && !this.isClosing()) {
        if (this.updateWait()) {
            return;
        } else if (this.updateLoading()) {
            return;
        } else if (this.pause) {
            this.pause = false;
            //} else if (this.updateInput()) {
            //return;
            if (!this._textState) {
                this.terminateMessage();
            }
            return;
        } else if (this.updateMessage()) {
            return;
        } else {
            //this.startInput();
            return;
        }
    }
}; 