function Key() {
    this.initialize.apply(this, arguments);
}

Key.prototype.initialize = function (name,i,x,y,time) {
    this.name = name
    this._lastData = []
}

Key.prototype.set = function (i, x, y, time) {
    if (!this._data || this._data[0] !== i) {
        this._data = [i, [], time, time, 0]
        this._lastData.push(this._data)
        this._xy = null
    } else {
        this._data[3] = time
        this._data[4] = this._data[3] - this._data[2]
    }
    if (!this._xy || this._xy[0] !== x || this._xy[1] !== y) {
        this._xy = [x, y, time, time]
        this._data[1].push(this._xy)
    } else {
        this._xy[3] = time
        this._xy[4] = this._xy[3] - this._xy[2]
    }
} 

Key.prototype.getI = function () {
    return this._data || this._data[0]
}


function KeysData (){
    this._keys = {} 
}

KeysData.prototype.setKey = function(name,i,x,y,time){
    this._keys[name] = this._keys[name] || new Key(name)
    this._keys[name].set(i,x,y,time)
}



KeysData.prototype.getKey = function(name){
    return this._keys[name] 
}



function KeyInput() {
    throw new Error('This is a static class');
}

/**
 * 初始化
 * 
 * 初始化输入系统。
 * Initializes the KeyInput system.
 *
 * @static
 * @method initialize
 */
KeyInput.initialize = function () {
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
KeyInput.keyRepeatWait = 24;

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
KeyInput.keyRepeatInterval = 6;


/**
 * 清除
 * 
 * 清除所有的输入数据。
 * Clears all the KeyInput data.
 *
 * @static
 * @method clear
 */
KeyInput.clear = function () {
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

/**
 * 更新
 * 
 * 更新的输入数据。
 * Updates the KeyInput data.
 * 
 * @static
 * @method update
 */
KeyInput.update = function () {
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
            //按下时间=0
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


/**包裹nwjs警报
 * @static
 * @method _wrapNwjsAlert
 * @private
 */
KeyInput._wrapNwjsAlert = function () {
    if (Utils.isNwjs()) {
        var _alert = window.alert;
        window.alert = function () {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            _alert.apply(this, arguments);
            win.focus();
            KeyInput.clear();
        };
    }
};





/**安装事件处理者
 * @static
 * @method _setupEventHandlers
 * @private
 */
KeyInput._setupEventHandlers = function () {
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
KeyInput._onKeyDown = function (event) {
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
    if (ResourceHandler.exists() && buttonName === 'ok') {
        ResourceHandler.retry();
    } else if (buttonName) {
        //当前状态 键 =true
        this._currentState[buttonName] = true;
    }
};




/**需要避免默认
 * @static
 * @method _shouldPreventDefault
 * @param {number} keyCode
 * @private
 */
KeyInput._shouldPreventDefault = function (keyCode) {
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
KeyInput._onKeyUp = function (event) {
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
KeyInput._onLostFocus = function () {
    //清除
    this.clear();
};

