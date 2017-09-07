
//-----------------------------------------------------------------------------
/**从键盘和游戏手柄处理输入数据的静态类。
 * The static class that handles input data from the keyboard and gamepads.
 * 输入
 * @class Input
 */
function Input() {
    throw new Error('This is a static class');
}

/**初始化输入系统。
 * Initializes the input system.
 *
 * @static
 * @method initialize
 */
//初始化
Input.initialize = function() {
	//清除
    this.clear();
    this._wrapNwjsAlert();
    //安装 事件 处理者
    this._setupEventHandlers();
};

/**在帧中的键重复的等待时间
 * The wait time of the key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */
//键重复等待
Input.keyRepeatWait = 24;

/**在帧中的键重复的间隔时间
 * The interval of the key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */
//键重复间隔时间
Input.keyRepeatInterval = 6;

/**一个哈希表来从一个虚拟键代码转换为一个映射的键名
 * A hash table to convert from a virtual key code to a mapped key name.
 *
 * @static
 * @property keyMapper
 * @type Object
 */
//键映射
Input.keyMapper = {
    9: 'tab',       // tab
    13: 'ok',       // enter
    16: 'shift',    // shift
    17: 'control',  // control
    18: 'control',  // alt
    27: 'escape',   // escape
    32: 'ok',       // space
    33: 'pageup',   // pageup
    34: 'pagedown', // pagedown
    37: 'left',     // left arrow
    38: 'up',       // up arrow
    39: 'right',    // right arrow
    40: 'down',     // down arrow
    45: 'escape',   // insert
    81: 'pageup',   // Q
    87: 'pagedown', // W
    88: 'escape',   // X
    90: 'ok',       // Z
    96: 'escape',   // numpad 0
    98: 'down',     // numpad 2
    100: 'left',    // numpad 4
    102: 'right',   // numpad 6
    104: 'up',      // numpad 8
    120: 'debug'    // F9
};

/**一个哈希表来从手柄按钮转换为映射的键名。
 * A hash table to convert from a gamepad button to a mapped key name.
 *
 * @static
 * @property gamepadMapper
 * @type Object
 */
//手柄按钮映射
Input.gamepadMapper = {
    0: 'ok',        // A
    1: 'cancel',    // B
    2: 'shift',     // X
    3: 'menu',      // Y
    4: 'pageup',    // LB
    5: 'pagedown',  // RB
    12: 'up',       // D-pad up
    13: 'down',     // D-pad down
    14: 'left',     // D-pad left
    15: 'right',    // D-pad right
};

/**清除所有的输入数据。
 * Clears all the input data.
 *
 * @static
 * @method clear
 */
//清除
Input.clear = function() {
	//当前状态
    this._currentState = {};
    //以前的状态
    this._previousState = {};
    //游戏手柄状态
    this._gamepadStates = [];
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

/**更新的输入数据。
 * Updates the input data.
 *
 * @static
 * @method update
 */
//更新
Input.update = function() {
	//轮询游戏手柄
    this._pollGamepads();
    //如果 当前状态[最新按键]
    if (this._currentState[this._latestButton]) {
	    //按下时间 ++
        this._pressedTime++;
    } else {
	    //最新按键 设为 null
        this._latestButton = null;
    }
    //循环 名称 在 当前状态中
    for (var name in this._currentState) {
	    //如果 当前状态[名称] 并且 不是 之前的状态[名称]
        if (this._currentState[name] && !this._previousState[name]) {
	        //最新按键 = 名称
            this._latestButton = name;
            //按下时间设置为0
            this._pressedTime = 0;
            //时间 = 现在时间
            this._date = Date.now();
        }
        //之前的状态 = 当前状态
        this._previousState[name] = this._currentState[name];
    }
    //更新方向
    this._updateDirection();
};

/**检查 键当前是否按下。
 * Checks whether a key is currently pressed down.
 *
 * @static
 * @method isPressed
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is pressed
 */
//是按下
Input.isPressed = function(keyName) {
	//如果 是逃跑一致(键名) 并且 是按下 逃亡
    if (this._isEscapeCompatible(keyName) && this.isPressed('escape')) {
	    //返回 true
        return true;
    } else {
	    //返回 当前状态[键名]
        return !!this._currentState[keyName];
    }
};

/**检查是 键刚按下
 * Checks whether a key is just pressed.
 *
 * @static
 * @method isTriggered
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is triggered
 */
//是刚按下
Input.isTriggered = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isTriggered('escape')) {
        return true;
    } else {
	    // 最近的键===键名                     按下时间 === 0
        return this._latestButton === keyName && this._pressedTime === 0;
    }
};

/**检查一个 按键刚按下 或 出现按键重复的。
 * Checks whether a key is just pressed or a key repeat occurred.
 *
 * @static
 * @method isRepeated
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is repeated
 */
//是重复按下
Input.isRepeated = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isRepeated('escape')) {
        return true;
    } else {  //最近键名 === 键名 并且( 按下时间==0 或  
             // (按下时间>重复重复等待 并且 按下时间除重复的间隔时间的余数)      )
        return (this._latestButton === keyName &&
                (this._pressedTime === 0 ||
                 (this._pressedTime >= this.keyRepeatWait &&
                  this._pressedTime % this.keyRepeatInterval === 0)));
    }
};

/**检查一个按键是否被持续按下
 * Checks whether a key is kept depressed.
 *
 * @static
 * @method isLongPressed
 * @param {String} keyName The mapped name of the key
 * @return {Boolean} True if the key is long-pressed
 */
//是长按下
Input.isLongPressed = function(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isLongPressed('escape')) {
        return true;
    } else {
        return (this._latestButton === keyName &&
                this._pressedTime >= this.keyRepeatWait);
    }
};

/**[只读]为数字小键盘上​​四方向值，或者0
 * [read-only] The four direction value as a number of the numpad, or 0 for neutral.
 *
 * @static
 * @property dir4
 * @type Number
 */
//定义属性 
//方向4
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
 * @static
 * @property dir8
 * @type Number
 */
//定义属性 
//方向8
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
 * @static
 * @property date
 * @type Number
 */
//定义属性 
//时间
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
//包裹nwjs警报
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
    if (event.keyCode === 144) {    // Numlock  数字开关
        //清除
        this.clear();
    }
    var buttonName = this.keyMapper[event.keyCode];
    //如果 键名
    if (buttonName) {
	    //当前状态 键 =true
        this._currentState[buttonName] = true;
    }
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
    case 8:     // backspace  删除
    case 33:    // pageup     页上
    case 34:    // pagedown   页下
    case 37:    // left arrow  左箭头
    case 38:    // up arrow   上箭头
    case 39:    // right arrow  右箭头
    case 40:    // down arrow  下箭头
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
	//键名= 键名表[键值]
    var buttonName = this.keyMapper[event.keyCode];
    //如果键名存在
    if (buttonName) {
	    //当前键名 状态 = false
        this._currentState[buttonName] = false;
    }
    // 如果 键值===0
    if (event.keyCode === 0) {  // For QtWebEngine on OS X
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
Input._updateGamepadState = function(gamepad) {
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
    //循环 开始时 i = 0 ; 当 i < 按键组 长度 时 ; 每一次 i++
    for (var i = 0; i < buttons.length; i++) {
	    //新状态[i]= 按键组[i].按下
        newState[i] = buttons[i].pressed;
    }
    
    //如果 坐标轴[1]< -临界值
    if (axes[1] < -threshold) {
	    //新状态[12] = true 上 
        newState[12] = true;    // up
    //否则 如果 坐标轴[1] > 临界值 
    } else if (axes[1] > threshold) {
	    //新状态[13] = true 下
        newState[13] = true;    // down
    }
    //如果 坐标轴[0]< -临界值
    if (axes[0] < -threshold) {
	    //新状态[14] = true 左
        newState[14] = true;    // left
    //否则 如果 坐标轴[0] > 临界值 
    } else if (axes[0] > threshold) {
	    //新状态[15] = true 右
        newState[15] = true;    // right
    }
    //循环 开始时 j = 0 ; 当 j < 新状态 长度 时 ; 每一次 j++
    for (var j = 0; j < newState.length; j++) {
	    //
        if (newState[j] !== lastState[j]) {
            var buttonName = this.gamepadMapper[j];
            if (buttonName) {
	            //当前状态 [键名] = 新状态[j]
                this._currentState[buttonName] = newState[j];
            }
        }
    }
    this._gamepadStates[gamepad.index] = newState;
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
    if (this.isPressed('left')) {
        x--;
    }
    //是按下 right 右
    if (this.isPressed('right')) {
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
    if (this.isPressed('up')) {
        y--;
    }
    //是按下 down  下
    if (this.isPressed('down')) {
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
        return  5 - y * 3 + x;
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