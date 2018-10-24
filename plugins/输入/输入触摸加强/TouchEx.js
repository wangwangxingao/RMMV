//=============================================================================
//  InputTouchEx.js
//=============================================================================

/*:
 * @plugindesc  InputTouchEx
 * InputTouchEx,输入触摸增强 
 * @author wangwang
 *   
 * @param  InputTouchEx
 * @desc 插件 输入触摸增强 ,作者:汪汪
 * @default 汪汪
 * 
 * 
 * @help
 * 
 * 
 * */



/**
 * 参数
 * 
 */

/**长按间隔 */
TouchInput.keyLongPress = 60
/**短按间隔 */
TouchInput.keyShortPress = 20
/**键移动X */
TouchInput.keyMoveX = 5
/**键移动Y */
TouchInput.keyMoveY = 5

/**时间计数 */
Input.keyTime = 1;
/**长按间隔 */
Input.keyLongPress = 60
/**短按间隔 */
Input.keyShortPress = 20




/**
 * 
 * 触摸输入增强 
 * 
 * 
 */


/**时间按键比较 
 * 
 * @param {number} time 时间
 * @param {number} type 0 == 1> 2 >= 3< 4 <= 5 !=  6 %= 7 %!= 
 * @param {number} value  值
 * 
 * 
*/
Input.isTimeValue = function (time, type, value) {
    var value = value || 0
    if (type == 0) {
        return time == value
    } else if (type == 1) {
        return time > value
    } else if (type == 2) {
        return time >= value
    } else if (type == 3) {
        return time < value
    } else if (type == 4) {
        return time <= value
    } else if (type == 5) {
        return time != value
    } else if (type == 6) {
        return time % value == 0
    } else if (type == 7) {
        return time % value != 0
    }
    return false
}



/**
 * 是按键判断 
 * @param {number} type 0 == 1> 2 >= 3< 4 <= 5 !=  6 %= 7 %!=  
 * @param {number} value  值
*/
TouchInput.isTimeTriggered = function (type, value) {
    return this.isPressed() && Input.isTimeValue(this._pressedTime, type, value)
};

 


/**
 * 是按下时 大于 
 * 
 * 
*/
TouchInput.isTimeLong = function (value) {
    return this.isTimeTriggered(2, value);
};

/** 
 * 是按下时 小于 
 *  
 */
TouchInput.isTimeShort = function (value) {
    return this.isTimeTriggered(3, value);
};


/**
 * 是按下时 长按 
 * 
 * 
*/
TouchInput.isLongTriggered = function () {
    return this.isTimeTriggered(2, this.keyLongPress);
};


/**
 * 是按下时 短按
 *  
 */
TouchInput.isShortTriggered = function () {
    return this.isKeyTime(4, this.keyShortPress);
};



/**
 * 是短按 并且无移动
 * 
 * 
*/
TouchInput.isShortTouch = function () {
    return this.isShortTriggered() && !this.isMoveLong();
};

/**
 * 是长按 并且无移动
 * 
 */
TouchInput.isLongTouch = function () {
    return this.isLongTriggered() && !this.isMoveLong();
};



/**
 * 
 * 按键结束时 按的时间
*/
TouchInput.isEndTime = function () {
    return this.isReleased() && this._pressedTime
};


/**
 * 是结束按键 
 * */
TouchInput.isEndTriggered = function () {
    return this.isReleased();
};


/**
 * 是按键判断  
 * 按键结束时
 * @param {number} type 0 == 1> 2 >= 3< 4 <= 5 !=  6 %= 7 %!=  
 * @param {number} value  值
*/
TouchInput.isEndTimeTriggered = function (type, value) {
    return this.isReleased() && Input.isTimeValue(this._pressedTime, type, value)
};





/**
 * 结束时 是 大于等于 value 时间
 *  @param {number} value 值
 * 
 * 
*/
TouchInput.isEndTimeLong = function (value) {
    return this.isEndTimeTriggered(2, value);
};

/** 
 * 结束时 是 小于等于  value 时间
 *  @param {number} value 值
 */
TouchInput.isEndTimeShort = function (value) {
    return this.isEndTimeTriggered(3, value);
};


/**
 * 结束时是 长按 
 *    
 * 
*/
TouchInput.isEndLongTriggered = function () {
    return this.isEndTimeTriggered(2, this.keyLongPress);
};


/**
 * 结束时是短按
 *  
 */
TouchInput.isEndShortTriggered = function () {
    return this.isEndTimeTriggered(4, this.keyShortPress);
};



/**
 * 结束时是短按 并且无移动
 *  @param {number} value 值
 * 
 * 
*/
TouchInput.isEndShortTouch = function () {
    return this.isEndShortTriggered() && !this.isMoveLong();
};

/**
 * 结束时是长按 并且无移动
 * 
 */
TouchInput.isEndLongTouch = function () {
    return this.isEndLongTriggered() && !this.isMoveLong();
};






/**
 * 是按下并且移动
 */
TouchInput.isPressMove = function () {
    return this.isPressed() && this.isMoved()
};


/**
 * 是移动长距离 
 * 
*/
TouchInput.isMoveLong = function () {
    return this._touchMoveLong
};



TouchInput.__clear = TouchInput.clear
TouchInput.clear = function () {
    TouchInput.__clear.call(this)
    this._deltX = 0
    this._deltY = 0
    this._lastXY = undefined
}
TouchInput.__update = TouchInput.update
TouchInput.update = function () {
    TouchInput.__update.call(this)

    if (this._lastXY) {
        this._deltX = this._x - this._lastXY[0]
        this._deltY = this._y - this._lastXY[1]
    } else {
        this._lastXY = []
        this._deltX = 0
        this._deltY = 0
    }
    this._lastXY[0] = this._x
    this._lastXY[1] = this._y
}


TouchInput.__TouchInput_onMouseMove = TouchInput._onMouseMove
/**当鼠标移动 */
TouchInput._onMouseMove = function (event) {
    //画布x
    var x = Graphics.pageToCanvasX(event.pageX);
    //画布y
    var y = Graphics.pageToCanvasY(event.pageY);
    //当移动(x,y)
    this._onMove(x, y);

    //_TouchInput_onMouseMove.call(this,event)
};


/**  
    this._events.moved = true;
    this._x = x;
    this._y = y;
 */
TouchInput.__TouchInput_onMove = TouchInput._onMove
/**当移动 */
TouchInput._onMove = function (x, y) {
    TouchInput.__TouchInput_onMove.call(this, x, y)
    TouchInput._onPressedMove(x, y)
};



TouchInput.__TouchInput_onTrigger = TouchInput._onTrigger
/**当触发时 */
TouchInput._onTrigger = function (x, y) {
    TouchInput.__TouchInput_onTrigger.call(this, x, y)
    this._tirggerX = x
    this._tirggerY = y
    this._touchMoveLong = false
};

/**当按下并且移动时 */
TouchInput._onPressedMove = function (x, y) {
    if (this.isPressed()) {
        if (!this._touchMoveLong) {
            if (Math.abs(this._tirggerX - x) >= TouchInput.keyMoveX) {
                this._touchMoveLong = true
            } else if (Math.abs(this._tirggerY - y) >= TouchInput.keyMoveY) {
                this._touchMoveLong = true
            }
        }
    }
};



/**
 * 
 * 按键增强 
 * 
 * 
 */


/**
 * 是按键改变
 * @param {number} keyCode
 */
Input.isKeyChange = function (keyCode) {
    return this._changeKeys[keyCode]
}
/**
 * 是键当前时间
 * @param {number} keyCode
 */
Input.isKeyCurrent = function (keyCode) {
    return this._currentKeys[keyCode]
}


/**
 * 是键按下
 * @param {number} keyCode
 */
Input.isKeyPressed = function (keyCode) {
    return this._currentKeys[keyCode] > 0
}




/**
 * 是键按下瞬间
 * @param {number} keyCode
 */
Input.isKeyTriggered = function (keyCode) {
    return this._currentKeys[keyCode] == this.keyTime
}


/**
 * 按下键时间
 * @param {number} keyCode
 */
Input.isTimeTriggered = function (keyCode, type, value) {
    return this.isKeyPressed() && Input.isTimeValue(this._currentKeys[keyCode], type, value)
}

/**
 * 是按键结束时间判断
 * @param {number} keyCode
 */
Input.isTimeLong = function (keyCode, value) {
    return this.isTimeTriggered(keyCode, 4, this.keyTime - value)
}

/**
 * 是按键结束瞬间
 * @param {number} keyCode
 */
Input.isTimeShort = function (keyCode, value) {
    return this.isTimeTriggered(keyCode, 2, this.keyTime - value)
}


/**
 * 是按下时 长按 
 * 
 * 
*/
Input.isLongTriggered = function (keyCode) {
    return this.isTimeTriggered(keyCode, 4, this.keyTime - this.keyLongPress);
};



/**
 * 是按下时 短按
 *  
 */
Input.isShortTriggered = function (keyCode) {
    return this.isTimeTriggered(keyCode, 2, this.keyTime - this.keyShortPress);
};



Input.isEndTriggered = function (keyCode) {
    var v = Input.isKeyChange(keyCode)
    return v && v > 0
}



/**
 * 按键结束时 按下的时间
 * @param {number} keyCode
 * @param {number} value 按下时间长于的值
 */
Input.isEndTime = function (keyCode) {
    var v = Input.isKeyChange(keyCode)
    return v && v > 0 && v
}

Input.isEndTimeTriggered = function (keyCode, type, value) {
    var v = Input.isKeyChange(keyCode)
    return v && v > 0 && Input.isTimeValue(v, type, value)
}

Input.isEndTimeLong = function (keyCode, value) {
    return Input.isEndTimeTriggered(keyCode, 4, this.keyTime - value)
}

Input.isEndTimeShort = function (keyCode, value) {
    return Input.isEndTimeTriggered(keyCode, 2, this.keyTime - value)
}


Input.isEndLongTouch = function (keyCode) {
    return Input.isEndTimeTriggered(keyCode, 4, this.keyTime - this.keyLongPress)
}

Input.isEndLongTriggered = function (keyCode) {
    return Input.isEndTimeTriggered(keyCode, 4, this.keyTime - this.keyLongPress)
}

Input.isEndShortTouch = function (keyCode) {
    return Input.isEndTimeTriggered(keyCode, 2, this.keyTime - this.keyShortPress)
}

Input.isEndShortTriggered = function (keyCode) {
    return Input.isEndTimeTriggered(keyCode, 2, this.keyTime - this.keyShortPress)
}


 



Input.__clear = Input.clear
/**清除 */
Input.clear = function () {
    Input.__clear.call(this)

    //过去的键(保存全部)
    this._previousKeys = {}
    //当前所有键
    this._currentChangeKeys = {}
    //当前键
    this._currentKeys = {}
};

Input.__update = Input.update
/**输入
 * 更新 */
Input.update = function () {
    Input.__update.call(this)
    //添加按键计时
    this.keyTime++
    //对所有改变进行
    for (var i in this._currentChangeKeys) {
        this._currentKeys[i] = this._previousKeys[i] ? this.keyTime : -this.keyTime
    }
    //改变的键保存
    this._changeKeys = this._currentChangeKeys
    //当前改变键清空
    this._currentChangeKeys = {}
};



Input.__onKeyDown = Input._onKeyDown
/**当键按下 */
Input._onKeyDown = function (event) {
    Input._onKeyChange(event.keyCode, 1)
    Input.__onKeyDown.call(this, event)
};


Input.__onKeyUp = Input._onKeyUp
/**当键抬起 */
Input._onKeyUp = function (event) {
    Input._onKeyChange(event.keyCode, 0)
    Input.__onKeyUp.call(this, event)
};

/**键添加 */
Input._onKeyChange = function (keyCode, type) {
    if (this._previousKeys[keyCode] != type) {
        this._currentChangeKeys[keyCode] = this._currentKeys[keyCode]
    }
    this._previousKeys[keyCode] = type
};



/*
event.keyCode 值大全
    8 = BackSpace BackSpace 
    9 = Tab Tab 
    12 = Clear 
    13 = Enter 
    16 = Shift_L 
    17 = Control_L 
    18 = Alt_L 
    19 = Pause 
    20 = Caps_Lock 
    27 = Escape Escape 
    32 = space space 
    33 = Prior 
    34 = Next 
    35 = End 
    36 = Home 
    37 = Left 
    38 = Up 
    39 = Right 
    40 = Down 
    41 = Select 
    42 = Print 
    43 = Execute 
    45 = Insert 
    46 = Delete 
    47 = Help 
    48 = 0 equal braceright 
    49 = 1 exclam onesuperior 
    50 = 2 quotedbl twosuperior 
    51 = 3 section threesuperior 
    52 = 4 dollar 
    53 = 5 percent 
    54 = 6 ampersand 
    55 = 7 slash braceleft 
    56 = 8 parenleft bracketleft 
    57 = 9 parenright bracketright 
    65 = a A 
    66 = b B 
    67 = c C 
    68 = d D 
    69 = e E EuroSign 
    70 = f F 
    71 = g G 
    72 = h H 
    73 = i I 
    74 = j J 
    75 = k K 
    76 = l L 
    77 = m M mu 
    78 = n N 
    79 = o O 
    80 = p P 
    81 = q Q at 
    82 = r R 
    83 = s S 
    84 = t T 
    85 = u U 
    86 = v V 
    87 = w W 
    88 = x X 
    89 = y Y 
    90 = z Z 
    96 = KP_0 KP_0 
    97 = KP_1 KP_1 
    98 = KP_2 KP_2 
    99 = KP_3 KP_3 
    100 = KP_4 KP_4 
    101 = KP_5 KP_5 
    102 = KP_6 KP_6 
    103 = KP_7 KP_7 
    104 = KP_8 KP_8 
    105 = KP_9 KP_9 
    106 = KP_Multiply KP_Multiply 
    107 = KP_Add KP_Add
    108 = KP_Separator KP_Separator 
    109 = KP_Subtract KP_Subtract 
    110 = KP_Decimal KP_Decimal 
    111 = KP_Divide KP_Divide 
    112 = F1 
    113 = F2 
    114 = F3 
    115 = F4 
    116 = F5 
    117 = F6 
*/

