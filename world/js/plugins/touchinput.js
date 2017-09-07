function KeyInput() {
    this.initialize.apply(this, arguments);
}
KeyInput.prototype.initialize = function() {
    this.clear()
};
KeyInput.prototype.clear = function() {
    this._last = []
    this.setTemp(0)
};

/**设置当前 */
KeyInput.prototype.setTemp = function(i) {
    this._temp = {
        "down": i,
        "move": [],
        "start": null,
        "end": null,
    }
};
/**储存临时 */
KeyInput.prototype.saveTemp = function() {
    this._last.unshift(this._temp)
};


/**当前 */
KeyInput.prototype.key = function() {
    return this._temp
};

/**最后键 */
KeyInput.prototype.lastkey = function() {
    return this._last[0]
};

/**改变按键 */
KeyInput.prototype.keyChange = function(i, time, x, y) {
    this.saveTemp()
    this.setTemp(i)
    this.keyPush(time, x, y)
};

/**添加 */
KeyInput.prototype.keyPush = function(time, x, y) {
    var a = [time, x, y]
    this._temp.move.unshift(a)
    if (this._temp.start) {
        this._temp.ti = false
    } else {
        this._temp.start = a
        this._temp.ti = true
    }
    this._temp.end = a
};

/**触发 */
KeyInput.prototype.keyisTi = function(temp) {
    return temp.ti
};

/**按下 */
KeyInput.prototype.keyisDown = function(temp) {
    return temp.down
};

/**长时间 */
KeyInput.prototype.keyisLong = function(temp) {
    if (temp.start) {
        return temp.end[0] - temp.start[0]
    } else {
        return null
    }
};

/**移动 */
KeyInput.prototype.keyisMove = function(temp) {
    return temp.move.length
};



function KeyBoard() {
    this.initialize.apply(this, arguments);
}

/**键时间 */
KeyBoard._keyTime = 1
    /**更新 */
KeyBoard.update = function() {
    this._keyTime++
};

/**初始化 */
KeyBoard.prototype.initialize = function() {
    this.clear();
};

/**清除 */
KeyBoard.prototype.clear = function() {
    this._keyboard = {}
    this._keyboardInput = {}
};
/**时间 */
KeyBoard.prototype.time = function() {
    return KeyBoard._keyTime
};

/**按键基础 */
KeyBoard.prototype.keyInputBase = function(i, z, x, y) {
    if (!this._keyboardInput[i]) {
        this._keyboardInput[i] = new KeyInput()
    }
    this._keyboardInput[i].keyChange(z, this.time(), x, y)
};

/**移动基础 */
KeyBoard.prototype.keyInputMove = function(i, x, y) {
    if (!this._keyboardInput[i]) {
        this._keyboardInput[i] = new KeyInput()
    }
    this._keyboardInput[i].keyPush(this.time(), x, y)
};

/**键移动 */
KeyBoard.prototype.keyMove = function(i, x, y) {
    this.keyInputMove(i, x, y)
};

/**按键 */
KeyBoard.prototype.keyDown = function(i, x, y) {
    this._keyboard[i] = true
    this.keyInputBase(i, 1, x, y)
};

/**抬起 */
KeyBoard.prototype.keyUp = function(i, x, y) {
    delete this._keyboard[i]
    this.keyInputBase(i, 0, x, y)
};

/**是按下 */
KeyBoard.prototype.iskeyDown = function(i) {
    return !!this._keyboard[i]
};

/**是抬起 */
KeyBoard.prototype.iskeyUp = function(i) {
    return !this._keyboard[i]
};


KeyBoard.prototype.keys = function() {
    return Object.getOwnPropertyNames(this._keyboard)
};

KeyBoard.prototype.length = function() {
    return this.keys().length
};


KeyBoard.prototype.key = function(i) {
    return this._keyboardInput[i]
};


function MouseKeyBoard() {
    this.initialize.apply(this, arguments);
}

/**设置原形 */
MouseKeyBoard.prototype = Object.create(KeyBoard.prototype);
/**设置创造者*/
MouseKeyBoard.prototype.constructor = MouseKeyBoard;


MouseKeyBoard.prototype.keyMove = function(i, x, y) {
    if (this.iskeyDown(2)) {
        this.keyInputMove(2, x, y)
    }
    if (this.iskeyDown(0)) {
        this.keyInputMove(0, x, y)
    }
};



//-----------------------------------------------------------------------------





//-----------------------------------------------------------------------------
/**从键盘和游戏手柄处理输入数据的静态类。
 * The static class that handles input data from the keyboard and gamepads.
 * 输入
 * @class Input
 */
/**function Input() {
    throw new Error('This is a static class');
}
*/
/**
 * 初始化
 * 
 * 初始化输入系统。
 * Initializes the input system.
 *
 * @static
 * @method initialize
 */
Input.initialize = function() {
    //清除
    this.clear();
    //包裹nwjs警报
    this._wrapNwjsAlert();
    //安装事件处理者
    this._setupEventHandlers();
};

/**
 * 键重复等待
 * 
 * 在帧中的键重复的等待时间
 * The wait time of the key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */
Input.keyRepeatWait = 24;

/**
 * 键重复间隔时间
 * 
 * 在帧中的键重复的间隔时间
 * The interval of the key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */
Input.keyRepeatInterval = 6;

/**
 * 键映射
 * 
 * 一个哈希表来从一个虚拟键代码转换为一个映射的键名
 * A hash table to convert from a virtual key code to a mapped key name.
 *
 * @static
 * @property keyMapper
 * @type Object
 */
Input.keyMapper = {
    9: 'tab', // tab
    13: 'ok', // enter
    16: 'shift', // shift
    17: 'control', // control
    18: 'control', // alt
    27: 'escape', // escape
    32: 'ok', // space
    33: 'pageup', // pageup
    34: 'pagedown', // pagedown
    37: 'left', // left arrow
    38: 'up', // up arrow
    39: 'right', // right arrow
    40: 'down', // down arrow
    45: 'escape', // insert
    81: 'pageup', // Q
    87: 'pagedown', // W
    88: 'escape', // X
    90: 'ok', // Z
    96: 'escape', // numpad 0
    98: 'down', // numpad 2
    100: 'left', // numpad 4
    102: 'right', // numpad 6
    104: 'up', // numpad 8
    120: 'debug' // F9
};

/**
 * 手柄按钮映射
 * 
 * 一个哈希表来从手柄按钮转换为映射的键名。
 * A hash table to convert from a gamepad button to a mapped key name.
 *
 * @static
 * @property gamepadMapper
 * @type Object
 */
Input.gamepadMapper = {
    0: 'ok', // A
    1: 'cancel', // B
    2: 'shift', // X
    3: 'menu', // Y
    4: 'pageup', // LB
    5: 'pagedown', // RB
    12: 'up', // D-pad up
    13: 'down', // D-pad down
    14: 'left', // D-pad left
    15: 'right', // D-pad right
};

/**
 * 清除
 * 
 * 清除所有的输入数据。
 * Clears all the input data.
 *
 * @static
 * @method clear
 */
Input.clear = function() {
    //当前状态
    this._keyboard = new KeyBoard();
    //游戏手柄状态
    this._gamepadStates = {};
    //最新键
    this._latestButton = null;
    //按下时间
    this._pressedTime = 0;
    //4方向
    this._dir4 = 0;
    //8方向
    this._dir8 = 0;
    //优先轴
    this._preferredAxis = '';
    //日期
    this._date = 0;
};

/**
 * 更新
 * 
 * 更新的输入数据。
 * Updates the input data.
 * 
 * @static
 * @method update
 */
Input.update = function() {
    this._updateDirection();
};



/**[只读]为数字小键盘上​​四方向值，或者0
 * [read-only] The four direction value as a number of the numpad, or 0 for neutral.
 *
 * 方向4
 * 
 * @static
 * @property dir4
 * @type Number
 */
//定义属性 
Object.defineProperty(Input, 'dir4', {
    get: function() {
        //返回 _dir4
        return this._dir4;
    },
    configurable: true
});

/**[只读]​​八个方向值为数字小键盘上，或者为0中性。
 * [read-only] The eight direction value as a number of the numpad, or 0 for neutral.
 *
 * 方向8
 * 
 * @static
 * @property dir8
 * @type Number
 */
//定义属性
Object.defineProperty(Input, 'dir8', {
    get: function() {
        //返回 _dir8
        return this._dir8;
    },
    configurable: true
});

/**[只读]的最后一个输入的时间 ​​毫秒
 * [read-only] The time of the last input in milliseconds.
 *
 * 时间
 * 
 * @static
 * @property date
 * @type Number
 */
//定义属性 
Object.defineProperty(Input, 'date', {
    get: function() {
        //返回 _date
        return this._date;
    },
    configurable: true
});

/**包裹nwjs警报
 * @static
 * @method _wrapNwjsAlert
 * @private
 */
Input._wrapNwjsAlert = function() {
    if (Utils.isNwjs()) {
        var _alert = window.alert;
        window.alert = function() {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            _alert.apply(this, arguments);
            win.focus();
            Input.clear();
        };
    }
};

/**安装事件处理者
 * @static
 * @method _setupEventHandlers
 * @private
 */
//安装事件处理者
Input._setupEventHandlers = function() {
    //文件 添加事件监听 ('keydown', 当键按下(绑定(this)))
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    //文件 添加事件监听 ('keyup', 当键抬起(绑定(this)))
    document.addEventListener('keyup', this._onKeyUp.bind(this));
    //窗口 添加事件监听 ('blur', 当失去焦点(绑定(this)))
    window.addEventListener('blur', this._onLostFocus.bind(this));
};

/**当键按下
 * @static
 * @method _onKeyDown
 * @param {KeyboardEvent} event
 * @private
 */
//当键按下
Input._onKeyDown = function(event) {
    //如果 需要避免默认 (键值)
    if (this._shouldPreventDefault(event.keyCode)) {
        //避免默认
        event.preventDefault();
    }
    //键值===144
    if (event.keyCode === 144) { // Numlock  数字开关
        //清除
        this.clear();
    }
    //当前状态 键 =true
    this._keyboard.keyDown(event.keyCode)
};

/**需要避免默认
 * @static
 * @method _shouldPreventDefault
 * @param {Number} keyCode
 * @private
 */
//需要避免默认
Input._shouldPreventDefault = function(keyCode) {
    switch (keyCode) {
        case 8: // backspace  删除
        case 33: // pageup     页上
        case 34: // pagedown   页下
        case 37: // left arrow  左箭头
        case 38: // up arrow   上箭头
        case 39: // right arrow  右箭头
        case 40: // down arrow  下箭头
            return true;
    }
    return false;
};

/**当键抬起
 * @static
 * @method _onKeyUp
 * @param {KeyboardEvent} event
 * @private
 */
//当键抬起
Input._onKeyUp = function(event) {
    this._keyboard.keyUp(event.keyCode)
        // 如果 键值===0
    if (event.keyCode === 0) { // For QtWebEngine on OS X
        //清除
        this.clear();
    }
};

/**当失去焦点
 * @static
 * @method _onLostFocus
 * @private
 */
//当失去焦点
Input._onLostFocus = function() {
    //清除
    this.clear();
};

/**轮询游戏手柄
 * @static
 * @method _pollGamepads
 * @private
 */
//轮询游戏手柄
Input._pollGamepads = function() {
    //浏览器获得 游戏手柄组
    if (navigator.getGamepads) {
        //游戏手柄组 = 浏览器获得游戏手柄组
        var gamepads = navigator.getGamepads();
        //如果 游戏手柄组 存在
        if (gamepads) {
            //循环 在 游戏手柄组
            for (var i = 0; i < gamepads.length; i++) {
                //游戏手柄 = 游戏手柄组[i]
                var gamepad = gamepads[i];
                //如果 游戏手柄 并且 游戏手柄 连接的
                if (gamepad && gamepad.connected) {
                    //更新 游戏手柄状态[游戏手柄]
                    this._updateGamepadState(gamepad);
                }
            }
        }
    }
};

/**更新游戏手柄状态
 * @static
 * @method _updateGamepadState
 * @param {Gamepad} gamepad
 * @param {Number} index
 * @private
 */
//更新游戏手柄状态
Input._updateGamepadState = function(gamepad, i) {
    // 最后状态 = 游戏手柄 状态[游戏手柄.索引]
    var lastState = this._gamepadStates[gamepad.index] || [];
    //新的状态 = []
    var newState = [];
    //按键组 = 游戏手柄.按键组
    var buttons = gamepad.buttons;
    //坐标轴 = 游戏手柄 坐标轴 
    var axes = gamepad.axes;
    //临界值 = 0.5
    var threshold = 0.5;

    newState[12] = false;
    newState[13] = false;
    newState[14] = false;
    newState[15] = false;
    //循环 开始时 i = 0 ; 当 i < 按键组 长度 时 ; 每一次 i++
    for (var i = 0; i < buttons.length; i++) {
        //新状态[i] = 按键组[i].按下
        newState[i] = buttons[i].pressed;
    }
    //如果 坐标轴[1]< -临界值
    if (axes[1] < -threshold) {
        //新状态[12] = true 上 
        newState[12] = true; // up
        //否则 如果 坐标轴[1] > 临界值 
    } else if (axes[1] > threshold) {
        //新状态[13] = true 下
        newState[13] = true; // down
    }
    //如果 坐标轴[0]< -临界值
    if (axes[0] < -threshold) {
        //新状态[14] = true 左
        newState[14] = true; // left
        //否则 如果 坐标轴[0] > 临界值 
    } else if (axes[0] > threshold) {
        //新状态[15] = true 右
        newState[15] = true; // right
    }
    //循环 开始时 j = 0 ; 当 j < 新状态 长度 时 ; 每一次 j++
    for (var j = 0; j < newState.length; j++) {
        //按下
        if (newState[j]) {
            newState[j] = (lastState[j] || 0) + 1;
        } else {
            //抬起
            newState[j] = 0
        }
    }
    this._gamepadStates[gamepad.index] = newState
};

/**更新方向
 * @static
 * @method _updateDirection
 * @private
 */
Input._updateDirection = function() {
    var x = this._signX();
    var y = this._signY();
    //8 方向
    this._dir8 = this._makeNumpadDirection(x, y);

    if (x !== 0 && y !== 0) {
        //优先轴 设置为 x
        if (this._preferredAxis === 'x') {
            y = 0;
        } else {
            x = 0;
        }
        // x 不等于0
    } else if (x !== 0) {
        //优先轴 设置为 y
        this._preferredAxis = 'y';
        //  y不等于0
    } else if (y !== 0) {
        //优先轴 设置为 x
        this._preferredAxis = 'x';
    }
    //4 方向
    this._dir4 = this._makeNumpadDirection(x, y);
};

/**标记x
 * @static
 * @method _signX
 * @private
 */
Input._signX = function() {
    var x = 0;
    //是按下 left 左
    if (this.isPressed(37)) {
        x--;
    }
    //是按下 right 右
    if (this.isPressed(39)) {
        x++;
    }
    return x;
};

/**标记y
 * @static
 * @method _signY
 * @private
 */
Input._signY = function() {
    var y = 0;
    //是按下 up 上
    if (this.isPressed(38)) {
        y--;
    }
    //是按下 down  下
    if (this.isPressed(40)) {
        y++;
    }
    return y;
};

/**制作数字方向
 * @static
 * @method _makeNumpadDirection
 * @param {Number} x
 * @param {Number} y
 * @return {Number}
 * @private
 */
Input._makeNumpadDirection = function(x, y) {
    if (x !== 0 || y !== 0) {
        return 5 - y * 3 + x;
    }
    return 0;
};

/**是逃跑一致
 * @static
 * @method _isEscapeCompatible
 * @param {String} keyName
 * @return {Boolean}
 * @private
 */
Input._isEscapeCompatible = function(keyName) {
    // 键名=== 'cancel' 或 'menu'
    return keyName === 'cancel' || keyName === 'menu';
};

Input.isPressed = function(keyName) {
    return this._keyboard.iskeyDown(keyName)
    return false
};

Input.isRepeated = function(keyName) {
    return false
};

Input.isLongPressed = function(keyName) {
    return false
};

Input.initialize()




//-----------------------------------------------------------------------------
/**来自鼠标和触摸屏处理输入数据的静态类
 * The static class that handles input data from the mouse and touchscreen.
 * 触摸输入 
 * @class TouchInput
 */
/**function TouchInput() {
    throw new Error('This is a static class');
}
*/
/**初始化触摸系统
 * Initializes the touch system.
 *
 * @static
 * @method initialize
 */
//初始化
TouchInput.initialize = function() {
    //清除
    this.clear();
    //安装 事件处理组()
    this._setupEventHandlers();
};


/**清除所有的触摸数据。
 * Clears all the touch data.
 *
 * @static
 * @method clear
 */
//清除
TouchInput.clear = function() {
    this._mousekeyboard = new MouseKeyBoard()
    this._touchkeyboard = new KeyBoard()
};


//更新
TouchInput.update = function() {
    KeyBoard.update()
};

/**安装事件处理组
 * @static
 * @method _setupEventHandlers
 * @private
 */
//安装事件处理组
TouchInput._setupEventHandlers = function() {
    //鼠标按下
    document.addEventListener('mousedown', this._onMouseDown.bind(this));
    //鼠标移动
    document.addEventListener('mousemove', this._onMouseMove.bind(this));
    //鼠标抬起
    document.addEventListener('mouseup', this._onMouseUp.bind(this));
    //轮
    document.addEventListener('wheel', this._onWheel.bind(this));
    //触摸开始
    document.addEventListener('touchstart', this._onTouchStart.bind(this));
    //触摸移动
    document.addEventListener('touchmove', this._onTouchMove.bind(this));
    //触摸结束
    document.addEventListener('touchend', this._onTouchEnd.bind(this));
    //触摸取消
    document.addEventListener('touchcancel', this._onTouchCancel.bind(this));
    //指针按下
    // document.addEventListener('pointerdown', this._onPointerDown.bind(this));
};

/**当鼠标按下
 * @static
 * @method _onMouseDown
 * @param {MouseEvent} event
 * @private
 */
//当鼠标按下
TouchInput._onMouseDown = function(event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    this._mousekeyboard.keyDown(event.button, x, y)
};

//当鼠标移动
TouchInput._onMouseMove = function(event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    this._mousekeyboard.keyMove(event.button, x, y);
    //this._touch.keyAllMove(x, y)
};


//当鼠标抬起
TouchInput._onMouseUp = function(event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    this._mousekeyboard.keyUp(event.button, x, y)
        //this._touch.keyAll(   x, y)
};



/**当触摸开始
 * @static
 * @method _onTouchStart
 * @param {TouchEvent} event
 * @private
 */
//当触摸开始
TouchInput._onTouchStart = function(event) {
    //循环 在 事件改变触摸组
    for (var i = 0; i < event.changedTouches.length; i++) {
        //触摸 =  事件改变触摸组[i]
        var touch = event.changedTouches[i];
        //画布x
        var x = Graphics.pageToCanvasX(touch.pageX);
        //画布y
        var y = Graphics.pageToCanvasY(touch.pageY);
        //id 
        var id = touch.identifier

        //是在画布中
        if (Graphics.isInsideCanvas(x, y)) {
            //避免默认
            event.preventDefault();
        }
        this._touchkeyboard.keyDown(id, x, y)
    }
    if (window.cordova || window.navigator.standalone) {
        //避免默认
        event.preventDefault();
    }
};

/**当触摸移动
 * @static
 * @method _onTouchMove
 * @param {TouchEvent} event
 * @private
 */
//当触摸移动
TouchInput._onTouchMove = function(event) {
    //循环 在 事件改变触摸组
    for (var i = 0; i < event.changedTouches.length; i++) {
        //触摸 = 事件改变触摸组[i]
        var touch = event.changedTouches[i];
        //画布x
        var x = Graphics.pageToCanvasX(touch.pageX);
        //画布y
        var y = Graphics.pageToCanvasY(touch.pageY);
        var id = touch.identifier
        this._touchkeyboard.keyMove(id, x, y)
    }
};

/**当触摸结束
 * @static
 * @method _onTouchEnd
 * @param {TouchEvent} event
 * @private
 */
//当触摸结束
TouchInput._onTouchEnd = function(event) {
    //循环 在 事件改变触摸组
    for (var i = 0; i < event.changedTouches.length; i++) {
        //触摸 = 事件改变触摸组[i]
        var touch = event.changedTouches[i];
        //画布x
        var x = Graphics.pageToCanvasX(touch.pageX);
        //画布y
        var y = Graphics.pageToCanvasY(touch.pageY);
        var id = touch.identifier
        this._touchkeyboard.keyUp(id, x, y)
    }
};

/**当触摸取消
 * @static
 * @method _onTouchCancel
 * @param {TouchEvent} event
 * @private
 */
//当触摸取消
TouchInput._onTouchCancel = function(event) {
    this._screenPressed = false;
};

/**当指示物按下
 * @static
 * @method _onPointerDown
 * @param {PointerEvent} event
 * @private
 */
//当指示物按下
TouchInput._onPointerDown = function(event) {
    if (event.pointerType === 'touch' && !event.isPrimary) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            // For Microsoft Edge
            this._onCancel(x, y);
            event.preventDefault();
        }
    }
};

TouchInput.initialize()