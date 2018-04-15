
function Sprite_UIChioce() {
    this.initialize.apply(this, arguments);
}


Sprite_UIChioce.prototype = Object.create(Sprite.prototype);
Sprite_UIChioce.prototype.constructor = Sprite_UIChioce;

Sprite_UIChioce.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this)
    this._index = -1
    this.active = true
    this._items = [] 
};

Sprite_UIChioce.prototype.activate = function () {
    this.active = true;
};
/**不活动 */
Sprite_UIChioce.prototype.deactivate = function () {
    this.active = false;
};







Sprite_UIChioce.prototype.items = function () {
    return this._items
};


Sprite_UIChioce.prototype.itemsLength = function () {
    return this._items.length
};




/**更新 */
Sprite_UIChioce.prototype.update = function () {
    Sprite.prototype.update.call(this)
    if (this.active) {
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
    var index = (this._index - 1 + this.itemsLength()) % this.itemsLength()
    this.select(index);
}

/**上 */
Sprite_UIChioce.prototype.inputUp = function () {
    var index = (this._index + 1 + this.itemsLength()) % this.itemsLength()
    this.select(index);
}


/**左 */
Sprite_UIChioce.prototype.inputLeft = function () {
    this.inputUp()
}

/**右 */
Sprite_UIChioce.prototype.inputRight = function () {
    this.inputDown()

}


Sprite_UIChioce.prototype.inputOk = function () {

}


Sprite_UIChioce.prototype.inputCancel = function () {

}

  

/**触摸输入 */
Sprite_UIChioce.prototype.updateTouchInput = function () {
    this.onTouch(TouchInput.isTriggered())
};


Sprite_UIChioce.prototype.isCursorMovable = function () {
    return this.active
};





Sprite_UIChioce.prototype.onTouch = function (triggered) {
    var lastIndex = this._index
    var x = TouchInput._wx;
    var y = TouchInput._wy;
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
                this.inputOk();
            }
        } else {
            this.select(hitIndex);
            if (triggered) {
                this.inputOk();
            }
        }
    }
    //索引 !== 最后的索引
    if (this._index !== lastIndex) {
        //播放光标
        SoundManager.playCursor();
    }
};


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



Sprite_UIChioce.prototype.select = function (i) {
    this.active = false;
};

Sprite_UIChioce.prototype.reselect = function () {
    this.selece(-1)
};


Sprite_UIChioce.prototype.iniselect = function () {
    this.selece(0)
};

Sprite_UIChioce.prototype.select = function (i) {
    if (this._index !== i) {
        this._index = i
        this.onSelece(i)
    }
};



Sprite_UIChioce.prototype.onSelece = function (i) {

};







function Sprite_UIFourChioce() {
    this.initialize.apply(this, arguments);
}


Sprite_UIFourChioce.prototype = Object.create(Sprite_UIChioce.prototype);
Sprite_UIFourChioce.prototype.constructor = Sprite_UIFourChioce;

Sprite_UIFourChioce.prototype.initialize = function () {
    Sprite_UIChioce.prototype.initialize.call(this) 
    this.createFour()
};
Sprite_UIFourChioce.prototype.createFour = function () {
    this._four = []


    this._four[0] = new Sprite()
    this._four[1] = new Sprite()
    this._four[2] = new Sprite()
    this._four[3] = new Sprite()
    this._four[0].bitmap = ImageManager.loadPicture()



    
};

 

Sprite_UIFourChioce.prototype.isCancelEnabled = function () {
    return $gameMessage.choiceCancelType() !== -1;
}; 



/**呼叫确定处理 */
Sprite_UIFourChioce.prototype.callOkHandler = function () {
    $gameMessage.onChoice(this.index());
    this._messageWindow.terminateMessage();
    this.close();
};
/**呼叫取消处理 */
Sprite_UIFourChioce.prototype.callCancelHandler = function () {
    $gameMessage.onChoice($gameMessage.choiceCancelType());
    this._messageWindow.terminateMessage();
    this.close();
};
