//=============================================================================
// EventTouch.js
//=============================================================================
/*:
 * @plugindesc 
 * EventTouch,事件点击触摸, 
 * @author wangwang
 *
 * @param  EventTouch 
 * @desc 插件 事件点击触摸 ,作者:汪汪
 * @default  汪汪,TouchEx
 * 
 * 
 * @help
 *  
 *  
 * 
 *  
 *  
 */




/**更新*/
Game_Event.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    this.checkEventTriggerAuto();
    this.updateParallel();
};


ww.popup._Game_Event_prototype_setupPage  = Game_Event.prototype.setupPage  
    Game_Event.prototype.setupPage = function() {
    this._label = null //
    if (this._pageIndex >= 0) {
        this._label = this.getLabel() ///
    }
    ww.popup._Game_Event_prototype_setupPage.call(this)
};

Game_Event.prototype.getLabel = function() {
    var label = null
    var list = this.list()
    for (var i = 0; i < list.length; i++) {
        var command = list[i];
        if (command.code === 118) {
            label = label || {}
            label[command.parameters[0]] = i
        }
    }
    return label
}

/**更新*/
Game_Event.prototype.updateTouch = function() {
    if (this._interpreter) {} else {
        if (this._label && this._trigger === 0) {
            if (this._istouch == this._lasttouch) {} else {
                if (this._istouch == 2) {
                    if ("touch" in this._label) {
                        this.start()
                    }
                } else if (this._istouch == 1) {
                    if (this._lasttouch == 0) {
                        if ("movein" in this._label) {
                            this.start()
                        }
                    }
                } else {
                    if (this._lasttouch) {
                        if ("moveout" in this._label) {
                            this.start()
                        }
                    }
                }
                this._lasttouch = this._istouch
            }
        }
    }
};



Game_Interpreter.prototype.jumpTolabel = function(labelName, label) {

    var labelName = labelName || "";
    if (labelName in label) {
        this.jumpTo(label[labelName] || 0);
        return true;
    }
    return false;
};


Game_Interpreter.prototype.thisEvent = function(param) {
    return $gameMap.event(param > 0 ? param : this._eventId);
};


Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // to be overridden by plugins
    //通过插件来覆盖 
    if (command == "switch") {
        var e = this.thisEvent()
        if (e && e._label) {
            if (e._istouch == 1) {
                this.jumpTolabel("movein", e._label)
            } else if (e._istouch == 2) {
                this.jumpTolabel("touch", e._label)
            } else if (e._istouch == 0) {
                this.jumpTolabel("moveout", e._label)
            }
        }
    }
};

 