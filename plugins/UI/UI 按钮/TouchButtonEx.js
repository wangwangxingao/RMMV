/**----------------------------------------------------------------------------- */
/** Sprite_ButtonEx */
/** 精灵按钮 */
/** The sprite for displaying a button. */
/** 显示按钮的精灵 */

function Sprite_ButtonExEx() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Sprite_ButtonEx.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_ButtonEx.prototype.constructor = Sprite_ButtonEx;
/**初始化 */
Sprite_ButtonEx.prototype.initialize = function () {
    //精灵 初始化 呼叫(this)
    Sprite.prototype.initialize.call(this);
    //触摸中 = false
    this._touching = false;
    this._type = 0
    this._hotframes = []
    this._coldframes = []
    this._clickHandler = {}
    this._touchHandler = {};
};
/**更新 */
Sprite_ButtonEx.prototype.update = function () {
    //精灵 更新 呼叫(this)
    Sprite.prototype.update.call(this);
    //更新帧()
    this.updateFrame();
    //进行触摸()
    this.processTouch();
};
/**更新帧 */
Sprite_ButtonEx.prototype.updateFrame = function () {
    //帧 
    var frame;
    //如果(触摸中)
    if (this._touching) {
        frame = this._hotframes[this._type];
    } else {
        frame = this._coldframes[this._type];
    }
    if (frame) {
        this.setFrame(frame.x, frame.y, frame.width, frame.height);
    }
};










Sprite_ButtonEx.prototype.setHotFrames = function (list) {
    this._hotframes = []
    for (var i = 0; i < list.length; i++) {
        var l = list[i]
        this._hotframes[i] = new Rectangle(l[0], l[1], l[2], l[3]);
    }
};


Sprite_ButtonEx.prototype.setColdFrames = function (list) {
    this._coldframes = []
    for (var i = 0; i < list.length; i++) {
        var l = list[i]
        this._coldframes[i] = new Rectangle(l[0], l[1], l[2], l[3]);
    }
};

/**设置点击操作者
 * @param {function} method 方法
 */
Sprite_ButtonEx.prototype.setClickHandler = function (method, i) {
    //点击操作者 = 方法
    this._clickHandler[i] = method;
};
/**呼叫点击操作者 */
Sprite_ButtonEx.prototype.callClickHandler = function (i, x, y) {
    //如果(点击操作者)
    if (this._clickHandler[i]) {
        //点击操作者()
        this._clickHandler[i](x, y, this._type);
    }
};



/**设置点击操作者
 * @param {function} method 方法
 */
Sprite_ButtonEx.prototype.setTouchHandler = function (method, i) {
    //点击操作者 = 方法
    this._clickHandler[i] = method;
};
/**呼叫点击操作者 */
Sprite_ButtonEx.prototype.callTouchHandler = function (i, x, y) {
    //如果(点击操作者)
    if (this._clickHandler[i]) {
        //点击操作者()
        this._clickHandler[i](x, y, this._type);
    }
};



Sprite_ButtonEx.prototype.nextType = function () {
    this._type = (this._type + 2) % this._frames.length
};


Sprite_ButtonEx.prototype.processTouch = function () {
    if (this.isActive()) {
        var ist = TouchInput.isTriggered()
        var ism = TouchInput.isMoved()
        if (ism || ist) {
            //x = 画布到局部x(触摸输入 x)
            var x = this.canvasToLocalX(TouchInput.x);
            //y = 画布到局部y(触摸输入 y)
            var y = this.canvasToLocalY(TouchInput.y);
            if (this.isButtonTouched(x, y)) {
                if (!this._touching) {
                    this.callTouchHandler(1, x, y)
                }
                if (ist) {
                    this.callTouchHandler(2, x, y)
                }
            } else {
                if (this._touching) {
                    this.callTouchHandler(0, x, y)
                }
            }
        }
    }
};

/**是活动 
 * @return {boolean}
 */
Sprite_ButtonEx.prototype.isActive = function () {
    //节点 = this
    var node = this;
    //当(节点)
    while (node) {
        //如果(不是 节点 可见度)
        if (!node.visible) {
            //返回 false
            return false;
        }
        //节点= 节点.父类
        node = node.parent;
    }
    //返回 ture
    return true;
};
/**是按钮触摸  
 * @return {boolean}
 */
Sprite_ButtonEx.prototype.isButtonTouched = function (x, y) {
    //返回 x >=0 并且 y >=0 并且 x < 宽 并且 y < 高
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};
/**画布到局部x 
 * @param {number} x x
 * @return {number}  
 */
Sprite_ButtonEx.prototype.canvasToLocalX = function (x) {
    //节点 = this
    var node = this;
    //当(节点)
    while (node) {
        //x -= 节点.x
        x -= node.x;
        //节点= 节点.父类
        node = node.parent;
    }
    //返回 x
    return x;
};
/**画布到局部y
 * @param {number} y y
 * @return {number}  
 */
Sprite_ButtonEx.prototype.canvasToLocalY = function (y) {
    //节点 = this
    var node = this;
    //当(节点)
    while (node) {
        //y -= 节点.y
        y -= node.y;
        //节点= 节点.父类
        node = node.parent;
    }
    //返回 y
    return y;
};