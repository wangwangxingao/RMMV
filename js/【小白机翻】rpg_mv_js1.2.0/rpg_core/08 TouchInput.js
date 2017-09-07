
//-----------------------------------------------------------------------------
/**来自鼠标和触摸屏处理输入数据的静态类
 * The static class that handles input data from the mouse and touchscreen.
 * 触摸输入 
 * @class TouchInput
 */
function TouchInput() {
    throw new Error('This is a static class');
}

/**初始化触摸系统
 * Initializes the touch system.
 *
 * @static
 * @method initialize
 */
TouchInput.initialize = function() {
	//清除
    this.clear();
    //安装 事件处理者
    this._setupEventHandlers();
};

/**在帧中的伪键重复的等待时间
 * The wait time of the pseudo key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */
TouchInput.keyRepeatWait = 24;

/**在帧中的伪键重复的间隔时间。
 * The interval of the pseudo key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */
TouchInput.keyRepeatInterval = 6;

/**清除所有的触摸数据。
 * Clears all the touch data.
 *
 * @static
 * @method clear
 */
TouchInput.clear = function() {
	//鼠标按下
    this._mousePressed = false;
    //屏幕按下
    this._screenPressed = false;
    //按下时间
    this._pressedTime = 0;
    //事件
    this._events = {};
    //事件 触发
    this._events.triggered = false;
    //事件 取消
    this._events.cancelled = false;
    //事件 移动
    this._events.moved = false;
    //事件释放
    this._events.released = false;
    //事件 轮x
    this._events.wheelX = 0;
    //事件 轮y
    this._events.wheelY = 0;
    //触发
    this._triggered = false;
    //取消
    this._cancelled = false;
    //移动
    this._moved = false;
    //释放
    this._released = false;
    //轮x
    this._wheelX = 0;
    //轮y
    this._wheelY = 0;
    this._x = 0;
    this._y = 0;
    //日期
    this._date = 0;
};

/**更新触摸数据
 * Updates the touch data.
 *
 * @static
 * @method update
 */
TouchInput.update = function() {
	//触发  = 事件 触发
    this._triggered = this._events.triggered;
    //取消  = 事件 取消
    this._cancelled = this._events.cancelled;
    //移动 = 事件 移动
    this._moved = this._events.moved;
    //释放 = 事件释放
    this._released = this._events.released;
    //轮x = 事件轮x
    this._wheelX = this._events.wheelX;
    //轮y = 事件轮y
    this._wheelY = this._events.wheelY;
    this._events.triggered = false;
    this._events.cancelled = false;
    this._events.moved = false;
    this._events.released = false;
    this._events.wheelX = 0;
    this._events.wheelY = 0;
    //是按下
    if (this.isPressed()) {
	    //按下时间 ++ 
        this._pressedTime++;
    }
};

/**检查鼠标按键或触摸屏当前是否按下。
 * Checks whether the mouse button or touchscreen is currently pressed down.
 *
 * @static
 * @method isPressed
 * @return {Boolean} True if the mouse button or touchscreen is pressed
 */
//是按下
TouchInput.isPressed = function() {
	//返回 鼠标按下  或 触摸按下
    return this._mousePressed || this._screenPressed;
};

/**检查是否鼠标左键或触摸屏刚按下
 * Checks whether the left mouse button or touchscreen is just pressed.
 *
 * @static
 * @method isTriggered
 * @return {Boolean} True if the mouse button or touchscreen is triggered
 */
//是刚按下
TouchInput.isTriggered = function() {
	// 返回 触发
    return this._triggered;
};

/**检查是否鼠标左键或触摸屏刚按或者出现一个伪按键重复。
 * Checks whether the left mouse button or touchscreen is just pressed
 * or a pseudo key repeat occurred.
 *
 * @static
 * @method isRepeated
 * @return {Boolean} True if the mouse button or touchscreen is repeated
 */
//是重复按下
TouchInput.isRepeated = function() {
	//返回  (鼠标按下  或 触摸按下)  并且 (  鼠标左键或触摸屏刚按下   或 
	 //   (按下时间大于等于 重复的等待时间 并且 按下时间除重复的间隔时间 的余数等于0) )
    return (this.isPressed() &&
            (this._triggered ||
             (this._pressedTime >= this.keyRepeatWait &&
              this._pressedTime % this.keyRepeatInterval === 0)));
};

/**检查鼠标左键或触摸屏是否保持按下
 * Checks whether the left mouse button or touchscreen is kept depressed.
 *
 * @static
 * @method isLongPressed
 * @return {Boolean} True if the left mouse button or touchscreen is long-pressed
 */
//是长按下
TouchInput.isLongPressed = function() {
	//返回  鼠标按下  并且 按下时间大于等于 重复的等待时间
    return this.isPressed() && this._pressedTime >= this.keyRepeatWait;
};

/**检查是否鼠标右键刚好按下
 * Checks whether the right mouse button is just pressed.
 *
 * @static
 * @method isCancelled
 * @return {Boolean} True if the right mouse button is just pressed
 */
TouchInput.isCancelled = function() {
	//返回 取消 _cancelled
    return this._cancelled;
};

/**检查鼠标或手指在触摸屏上是否被移动
 * Checks whether the mouse or a finger on the touchscreen is moved.
 *
 * @static
 * @method isMoved
 * @return {Boolean} True if the mouse or a finger on the touchscreen is moved
 */
TouchInput.isMoved = function() {
	//返回 移动 _moved
    return this._moved;
};

/**检查是否鼠标左键或触摸屏被松开
 * Checks whether the left mouse button or touchscreen is released.
 *
 * @static
 * @method isReleased
 * @return {Boolean} True if the mouse button or touchscreen is released
 */
TouchInput.isReleased = function() {
	//返回 松开 _released
    return this._released;
};

/**[只读]​​水平滚动量
 * [read-only] The horizontal scroll amount.
 *
 * @static
 * @property wheelX
 * @type Number
 */
//定义属性 
Object.defineProperty(TouchInput, 'wheelX', {
    get: function() {
        return this._wheelX;
    },
    configurable: true
});

/**[只读]​​垂直滚动量
 * [read-only] The vertical scroll amount.
 *
 * @static
 * @property wheelY
 * @type Number
 */
//定义属性 
Object.defineProperty(TouchInput, 'wheelY', {
    get: function() {
        return this._wheelY;
    },
    configurable: true
});

/**[只读]​​最新触摸事件的画布区域的x坐标。
 * [read-only] The x coordinate on the canvas area of the latest touch event.
 *
 * @static
 * @property x
 * @type Number
 */
//定义属性 
Object.defineProperty(TouchInput, 'x', {
    get: function() {
        return this._x;
    },
    configurable: true
});

/**[只读]​​最新触摸事件的画布区域的y坐标。
 * [read-only] The y coordinate on the canvas area of the latest touch event.
 *
 * @static
 * @property y
 * @type Number
 */
//定义属性 
Object.defineProperty(TouchInput, 'y', {
    get: function() {
        return this._y;
    },
    configurable: true
});

/**[只读]最后一个输入的时间的​​毫秒
 * [read-only] The time of the last input in milliseconds.
 *
 * @static
 * @property date
 * @type Number
 */
//定义属性 
Object.defineProperty(TouchInput, 'date', {
    get: function() {
        return this._date;
    },
    configurable: true
});

/**安装事件操作者
 * @static
 * @method _setupEventHandlers
 * @private
 */
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
    document.addEventListener('pointerdown', this._onPointerDown.bind(this));
};

/**当鼠标按下
 * @static
 * @method _onMouseDown
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onMouseDown = function(event) {
	//时间 按键==0
    if (event.button === 0) {
	    //运行 当左键按下
        this._onLeftButtonDown(event);
    } else if (event.button === 1) {
	    //运行 当中间键按下
        this._onMiddleButtonDown(event);
    } else if (event.button === 2) {
	    //运行 当右键按下
        this._onRightButtonDown(event);
    }
};

/**当左键按下
 * @static
 * @method _onLeftButtonDown
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onLeftButtonDown = function(event) {
	//x  = 画布x
    var x = Graphics.pageToCanvasX(event.pageX);
    //y  = 画布y
    var y = Graphics.pageToCanvasY(event.pageY);
    //是画布内部
    if (Graphics.isInsideCanvas(x, y)) {
	    //鼠标按下 _mousePressed = true
        this._mousePressed = true;
        //按下时间 _pressedTime = 0
        this._pressedTime = 0;
        //当触发(x,y)
        this._onTrigger(x, y);
    }
};

/**当中间按下
 * @static
 * @method _onMiddleButtonDown
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onMiddleButtonDown = function(event) {
};

/**当右键按下
 * @static
 * @method _onRightButtonDown
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onRightButtonDown = function(event) {
	//x  = 画布x
    var x = Graphics.pageToCanvasX(event.pageX);
    //y  = 画布y
    var y = Graphics.pageToCanvasY(event.pageY);
    //是画布内部
    if (Graphics.isInsideCanvas(x, y)) {
	    //当取消(x,y)
        this._onCancel(x, y);
    }
};

/**当鼠标移动
 * @static
 * @method _onMouseMove
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onMouseMove = function(event) {
	//如果 鼠标按下
    if (this._mousePressed) {
	    //画布x
        var x = Graphics.pageToCanvasX(event.pageX);
        //画布y
        var y = Graphics.pageToCanvasY(event.pageY);
        //运行  当移动(x,y)
        this._onMove(x, y);
    }
};

/**当鼠标抬起
 * @static
 * @method _onMouseUp
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onMouseUp = function(event) {
	//如果 事件按键 ===0
    if (event.button === 0) {
	    //画布 x
        var x = Graphics.pageToCanvasX(event.pageX);
        //画布 y
        var y = Graphics.pageToCanvasY(event.pageY);
        //鼠标 按下
        this._mousePressed = false;
        //允许 当释放(x,y)
        this._onRelease(x, y);
    }
};

/**当滚动
 * @static
 * @method _onWheel
 * @param {WheelEvent} event
 * @private
 */
TouchInput._onWheel = function(event) {
	//事件 轮x
    this._events.wheelX += event.deltaX;
    //事件 轮y
    this._events.wheelY += event.deltaY;
    //避免缺省
    event.preventDefault();
};

/**当触摸开始
 * @static
 * @method _onTouchStart
 * @param {TouchEvent} event
 * @private
 */
TouchInput._onTouchStart = function(event) {
	//循环 在 事件改变触摸们
    for (var i = 0; i < event.changedTouches.length; i++) {
	    //触摸 =  事件改变触摸们[i]
        var touch = event.changedTouches[i];
        //画布x
        var x = Graphics.pageToCanvasX(touch.pageX);
        //画布y
        var y = Graphics.pageToCanvasY(touch.pageY);
        //是在画布中
        if (Graphics.isInsideCanvas(x, y)) {
	        //屏幕按下 = true
            this._screenPressed = true;
            //按下时间=0
            this._pressedTime = 0;
            //触摸大于等于 2
            if (event.touches.length >= 2) {
	            //当取消(x,y)
                this._onCancel(x, y);
            } else {
	            //当触发(x,y)
                this._onTrigger(x, y);
            }
            //避免默认
            event.preventDefault();
        }
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
TouchInput._onTouchMove = function(event) {
	//循环 在 事件改变触摸们
    for (var i = 0; i < event.changedTouches.length; i++) {
	    //触摸 = 事件改变触摸们[i]
        var touch = event.changedTouches[i];
        //画布x
        var x = Graphics.pageToCanvasX(touch.pageX);
        //画布y
        var y = Graphics.pageToCanvasY(touch.pageY);
        //当移动 (x,y)
        this._onMove(x, y);
    }
};

/**当触摸结束
 * @static
 * @method _onTouchEnd
 * @param {TouchEvent} event
 * @private
 */
TouchInput._onTouchEnd = function(event) {
	//循环 在 事件改变触摸们
    for (var i = 0; i < event.changedTouches.length; i++) {
	    //触摸 = 事件改变触摸们[i]
        var touch = event.changedTouches[i];
        //画布x
        var x = Graphics.pageToCanvasX(touch.pageX);
        //画布y
        var y = Graphics.pageToCanvasY(touch.pageY);
        //屏幕按下 = false
        this._screenPressed = false;
        //当释放(x,y)
        this._onRelease(x, y);
    }
};

/**当触摸取消
 * @static
 * @method _onTouchCancel
 * @param {TouchEvent} event
 * @private
 */
TouchInput._onTouchCancel = function(event) {
    this._screenPressed = false;
};

/**当指示物按下
 * @static
 * @method _onPointerDown
 * @param {PointerEvent} event
 * @private
 */
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

/**当触发
 * @static
 * @method _onTrigger
 * @param {Number} x
 * @param {Number} y
 * @private
 */
TouchInput._onTrigger = function(x, y) {
    this._events.triggered = true;
    this._x = x;
    this._y = y;
    this._date = Date.now();
};

/**当取消 x,y
 * @static
 * @method _onCancel
 * @param {Number} x
 * @param {Number} y
 * @private
 */
TouchInput._onCancel = function(x, y) {
    this._events.cancelled = true;
    this._x = x;
    this._y = y;
};

/**当移动 x,y
 * @static
 * @method _onMove
 * @param {Number} x
 * @param {Number} y
 * @private
 */
TouchInput._onMove = function(x, y) {
    this._events.moved = true;
    this._x = x;
    this._y = y;
};

/**当释放
 * @static
 * @method _onRelease
 * @param {Number} x
 * @param {Number} y
 * @private
 */
TouchInput._onRelease = function(x, y) {
    this._events.released = true;
    this._x = x;
    this._y = y;
};