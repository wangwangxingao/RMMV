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


/**
 * 是长按结束时 
 * 
 * 
*/
TouchInput.isLongTriggered = function () {
    return this.isReleased() && this._pressedTime >= this.keyLongPress;
};
/**
 * 是短按结束时 
 * 
 * 
 */
TouchInput.isShortTriggered = function () {
    return this.isReleased() && this._pressedTime <= this.keyShortPress;
};

/**是短按 */
TouchInput.isShortTouch = function () {
    return this.isShortTriggered() && !this.isMoveLong();
};

/**是长按 */
TouchInput.isLongTouch = function () {

    return this.isLongTriggered() && !this.isMoveLong();
};

/**是结束按键 */
TouchInput.isEndTriggered = function () {
    return this.isReleased();
};


/**
 * 是按下并且移动
 */
TouchInput.isPressMove = function () {
    return this.isPressed() && this.isMoved()
};

/**是移动长距离 */
TouchInput.isMoveLong = function () {
    return this._touchMoveLong
};




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

Input.__Input_clear = Input.clear
/**清除 */
Input.clear = function () {
    Input.__Input_clear.call(this)

    this._previousKeys = {}
    this._currentChangeKeys = {}
    this._currentKeys = {}
};

Input.__Input_update = Input.update

/**更新 */
Input.update = function () {
    Input.__Input_update.call(this)
    this.keyTime++
    for (var i in this._currentChangeKeys) {
        this._currentKeys[i] = this._previousKeys[i] ? this.keyTime : -this.keyTime
    }
    this._changeKeys = this._currentChangeKeys
    this._currentChangeKeys = {}
};



Input.__Input_onKeyDown = Input._onKeyDown
/**当键按下 */
Input._onKeyDown = function (event) {
    Input._onKeyChange(event.keyCode, 1)
    Input.__Input_onKeyDown.call(this, event)
};


Input.__Input_onKeyUp = Input._onKeyUp
/**当键抬起 */
Input._onKeyUp = function (event) {
    Input._onKeyChange(event.keyCode, 0)
    Input.__Input_onKeyUp.call(this, event)
};

/**键添加 */
Input._onKeyChange = function (keyCode, type) {
    if (this._previousKeys[keyCode] != type) {
        this._currentChangeKeys[keyCode] = this._currentKeys[keyCode]
    }
    this._previousKeys[keyCode] = type
};

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
 * 是按键改变
 * @param {number} keyCode
 */
Input.isKeyChange = function (keyCode) {
    return this._changeKeys[keyCode]
}


/**
 * 是按键结束
 * @param {number} keyCode
 */
Input.isKeyEndTriggered = function (keyCode) {
    var v = Input.isKeyChange(keyCode)
    return v && v > 0 //&& (this.keyTime > v + Input.keyLongTime)
}

/**
 * 是长按结束
 * @param {number} keyCode
 */
Input.isKeyLong =
    Input.isKeyLongTouch =
    Input.isKeyLongTriggered = function (keyCode) {
        var v = Input.isKeyChange(keyCode)
        return v && v > 0 && this.keyTime >= v + this.keyLongPress
    }

/**
 * 是短按结束
 * @param {number} keyCode
 */
Input.isKeyShort =
    Input.isKeyShortTouch =
    Input.isKeyShortTriggered = function (keyCode) {
        var v = Input.isKeyChange(keyCode)
        return v && v > 0 && this.keyTime <= v + this.keyShortPress
    }






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


