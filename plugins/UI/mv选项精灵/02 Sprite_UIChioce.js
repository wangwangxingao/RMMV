
function Sprite_UIChioce() {
    this.initialize.apply(this, arguments);
}


Sprite_UIChioce.prototype = Object.create(Sprite_UITalkBase.prototype);
Sprite_UIChioce.prototype.constructor = Sprite_UIChioce;

Sprite_UIChioce.prototype.initialize = function (messageWindow) {
    Sprite_UITalkBase.prototype.initialize.call(this)
    this._messageWindow = messageWindow
    this._index = -1
    this.active = false
    this._items = []
    this._texts = []
};
/**活动 */
Sprite_UIChioce.prototype.activate = function () {
    this.active = true;
};
/**不活动 */
Sprite_UIChioce.prototype.deactivate = function () {
    this.active = false;
};

/**开始 */
Sprite_UIChioce.prototype.start = function () {
    this.onStart()
    this.makeCommandList();
    this.selectDefault();
    this.open();
};

/**当开始 */
Sprite_UIChioce.prototype.onStart = function () {
}

/**打开 */
Sprite_UIChioce.prototype.open = function () {
    Sprite_UITalkBase.prototype.open.call(this)
    this.activate()
};

/**关闭 */
Sprite_UIChioce.prototype.close = function () {
    Sprite_UITalkBase.prototype.close.call(this)
    this.deactivate()
};

/**选择默认 */
Sprite_UIChioce.prototype.selectDefault = function () {
    this.reselect()
    this.select($gameMessage.choiceDefaultType());
};


/**生成命令列表 */
Sprite_UIChioce.prototype.makeCommandList = function () {
    var choices = $gameMessage.choices();
    this._items = []
    for (var i = 0; i < this._texts.length; i++) {
        var ts = this._texts[i]
        if (i < choices.length) {
            ts.text = choices[i]
            this._items.push(ts)
        } else {
            ts.text = ""
        }
    }
};





/**项目组 */
Sprite_UIChioce.prototype.items = function () {
    return this._items
};

/**项目组长 */
Sprite_UIChioce.prototype.itemsLength = function () {
    return this._items.length
};
/**能输入 */
Sprite_UIChioce.prototype.canInput = function () {
    return this.active
};


/**更新 */
Sprite_UIChioce.prototype.update = function () {
    Sprite_UITalkBase.prototype.update.call(this)
    if (this.canInput()) {
        this.updateInputOrTouch()
    }
};

/**更新输入和触摸输入 */
Sprite_UIChioce.prototype.updateInputOrTouch = function () {
    this.updateInput()
    this.updateTouchInput()
};


/**键盘输入 */
Sprite_UIChioce.prototype.updateInput = function () {
    if (Input.isRepeated('down')) {
        this.inputDown();
    }
    if (Input.isRepeated('up')) {
        this.inputUp();
    }
    if (Input.isRepeated('right')) {
        this.inputRight();
    }
    if (Input.isRepeated('left')) {
        this.inputLeft();
    }
    if (Input.isTriggered('ok')) {
        this.inputOk();
    }
    if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
        this.inputCancel()
    }
};





/**下 */
Sprite_UIChioce.prototype.inputDown = function () {
    var index = (this._index + 1 + this.itemsLength()) % this.itemsLength()
    this.select(index);
    SoundManager.playCursor();

}

/**上 */
Sprite_UIChioce.prototype.inputUp = function () {
    var index = (this._index - 1 + this.itemsLength()) % this.itemsLength()
    this.select(index);
    SoundManager.playCursor();

}


/**左 */
Sprite_UIChioce.prototype.inputLeft = function () {
    this.inputUp()
}

/**右 */
Sprite_UIChioce.prototype.inputRight = function () {
    this.inputDown()
}


/**输入取消 */
Sprite_UIChioce.prototype.inputCancel = function () {
    if (this.isCancelEnabled()) {
        this.callCancelHandler()
    }
}



/**输入ok */
Sprite_UIChioce.prototype.inputOk = function () {
    if (this._index >= 0) {
        this.onOk(this._index)
        SoundManager.playCursor(); 
    }
}

/**是取消允许 */
Sprite_UIChioce.prototype.isCancelEnabled = function () {
    return $gameMessage.choiceCancelType() !== -1;
};



/**呼叫确定处理 */
Sprite_UIChioce.prototype.callOkHandler = function () {
    $gameMessage.onChoice(this._index);
    this._messageWindow.terminateMessage();
    this.close();
};


/**呼叫取消处理 */
Sprite_UIChioce.prototype.callCancelHandler = function () {
    this.select($gameMessage.choiceCancelType())
    this.inputOk()
};


/**触摸输入 */
Sprite_UIChioce.prototype.updateTouchInput = function () {
    this.onTouch(TouchInput.isTriggered())
};

/**当触摸 */
Sprite_UIChioce.prototype.onTouch = function (triggered) {
    var lastIndex = this._index
    var x = TouchInput.x;// TouchInput._wx;
    var y = TouchInput.y;
    if (this._lastwx != x || this._lastwy != y || triggered) {
        this._lastwx = x
        this._lastwy = y
    } else {
        return
    }
    var hitIndex = this.hitTest2(x, y);
    if (hitIndex >= 0) {
        if (hitIndex === this._index) {
            if (triggered) {
                //输入ok
                this.inputOk();
            }
        } else {
            //选择点击项目
            this.select(hitIndex);
            if (triggered) {
                this.inputOk();
            }
        }
    }

};

/**触摸2 */
Sprite_UIChioce.prototype.hitTest2 = function (x, y) {
    var items = this.items()
    if (items) {
        for (var i = 0; i < items.length; i++) {
            var s = items[i]
            if (s && s.isTouchThis(x, y, 1)) {
                return i
            }
        }
    }
    return -1;
};



/**重新选择 */
Sprite_UIChioce.prototype.reselect = function () {
    this.select(-1)
    this.onSelect(-1)
};

/**初始化选择 */
Sprite_UIChioce.prototype.iniselect = function () {
    this.select(0)
};

/**选择 */
Sprite_UIChioce.prototype.select = function (i) {
    if (this._index !== i) { 
        this.onSelect(i) 
    }
};


Sprite_UIChioce.prototype.onOk = function () {

};

/**当选择 */
Sprite_UIChioce.prototype.onSelect = function (i) {
    //this._index = i
    this._index = i

};



function Sprite_UIWaitChioce() {
    this.initialize.apply(this, arguments);
}


Sprite_UIWaitChioce.prototype = Object.create(Sprite_UIChioce.prototype);
Sprite_UIWaitChioce.prototype.constructor = Sprite_UIWaitChioce;

Sprite_UIWaitChioce.prototype.initialize = function (w) {
    Sprite_UIChioce.prototype.initialize.call(this, w)
    this._waitStart = 0  
    this._waitStartTime = 0


    this._waitEnd = 0 
    this._waitEndTime = 0
    
    this._waitSelect = 0 
    this._waitSelectTime = 0
};


/**开始 */
Sprite_UIWaitChioce.prototype.start = function () {
    Sprite_UIChioce.prototype.start.call(this)
    this._waitEnd = 0
};


/**能输入 */
Sprite_UIWaitChioce.prototype.canInput = function () {
    return this.active && !this._waitEnd
};



/**当确定时 */
Sprite_UIWaitChioce.prototype.onOk = function () {
    Sprite_UIChioce.prototype.onOk.call(this)
    this._waitEnd = 1
    this._waitEndTime = 25
};


/**更新 */
Sprite_UIWaitChioce.prototype.update = function () {
    Sprite_UIChioce.prototype.update.call(this)
    this.updateStart()
    this.updateEnd()
    this.updateSelect()

 
};

 
/**更新开始 */
Sprite_UIWaitChioce.prototype.updateStart = function () {
    if (this._waitEnd) {
        if (this._waitEndTime-- > 0) {
            this.updateEndTime()
        } else {
            this.onStartTimeEnd()
        }
    }
};
 

/**更新开始时间 */
Sprite_UIWaitChioce.prototype.updateStartTime = function () { 

};



 
/**更新更新结束 */
Sprite_UIWaitChioce.prototype.updateEnd = function () {

    if (this._waitEnd) {
        if (this._waitEndTime-- > 0) {
            this.updateEndTime()
        } else {
            this.onEndTimeEnd()
        }
    }
};



/**更新结束时间 */
Sprite_UIWaitChioce.prototype.updateEndTime = function () { 
  
};





/**呼叫结束 */
Sprite_UIWaitChioce.prototype.onEndTimeEnd  = function () {
    this._waitEnd = 0
    this.callOkHandler()
};



 
/**更新选择 */
Sprite_UIWaitChioce.prototype.updateSelect = function () {
    if (this._waitSelect) {
        if (this._waitSelectTime-- > 0) {
            this.updateSelectTime()
        } else {
            this.onSelectTimeEnd()
        }
    }
};






/**更新选择时间 */
Sprite_UIWaitChioce.prototype.updateSelectTime = function () {

};

/**当选择结束 */
Sprite_UIWaitChioce.prototype.onSelectTimeEnd = function () {

};






