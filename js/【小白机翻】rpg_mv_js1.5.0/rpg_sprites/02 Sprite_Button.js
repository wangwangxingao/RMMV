/**----------------------------------------------------------------------------- */
/** Sprite_Button */
/** 精灵按钮 */
/** The sprite for displaying a button. */
/** 显示按钮的精灵 */

function Sprite_Button() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Sprite_Button.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_Button.prototype.constructor = Sprite_Button;
/**初始化 */
Sprite_Button.prototype.initialize = function() {
    //精灵 初始化 呼叫(this)
    Sprite.prototype.initialize.call(this);
    //触摸中 = false
    this._touching = false;
    //冷帧 = null
    this._coldFrame = null;
    //热帧 = null
    this._hotFrame = null;
    //点击操作者 = null 
    this._clickHandler = null;
};
/**更新 */
Sprite_Button.prototype.update = function() {
    //精灵 更新 呼叫(this)
    Sprite.prototype.update.call(this);
    //更新帧()
    this.updateFrame();
    //进行触摸()
    this.processTouch();
};
/**更新帧 */
Sprite_Button.prototype.updateFrame = function() {
    //帧 
    var frame;
    //如果(触摸中)
    if (this._touching) {
        //帧 = 热帧
        frame = this._hotFrame;
        //否则
    } else {
        //帧 = 冷帧
        frame = this._coldFrame;
    }
    //如果(帧)
    if (frame) {
        //设置帧(帧.x , 帧.y , 帧.宽,帧.高)
        this.setFrame(frame.x, frame.y, frame.width, frame.height);
    }
};
/**设置冷帧 
 * @param {number} x x 
 * @param {number} y y
 * @param {number} width 宽 
 * @param {number} height 高 
 */
Sprite_Button.prototype.setColdFrame = function(x, y, width, height) {
    //冷帧 = 新 矩形(x,y,宽,高)
    this._coldFrame = new Rectangle(x, y, width, height);
};
/**设置热帧
 * @param {number} x x 
 * @param {number} y y
 * @param {number} width 宽 
 * @param {number} height 高 
 */
Sprite_Button.prototype.setHotFrame = function(x, y, width, height) {
    //热帧 = 新 矩形(x,y,宽,高)
    this._hotFrame = new Rectangle(x, y, width, height);
};
/**设置点击操作者
 * @param {function} method 方法
 */
Sprite_Button.prototype.setClickHandler = function(method) {
    //点击操作者 = 方法
    this._clickHandler = method;
};
/**呼叫点击操作者 */
Sprite_Button.prototype.callClickHandler = function() {
    //如果(点击操作者)
    if (this._clickHandler) {
        //点击操作者()
        this._clickHandler();
    }
};
/**进行触摸 */
Sprite_Button.prototype.processTouch = function() {
    //如果(是活动())
    if (this.isActive()) {
        //如果(触摸输入 是刚按下() 并且 是按钮触摸())
        if (TouchInput.isTriggered() && this.isButtonTouched()) {
            //触摸中 = true
            this._touching = true;
        }
        //如果(触摸中)
        if (this._touching) {
            //如果(触摸输入 是重复按下() 并且 不是 是按钮触摸())
            if (TouchInput.isReleased() || !this.isButtonTouched()) {
                //触摸中 =false
                this._touching = false;
                //如果 (触摸输入 是重复按下())
                if (TouchInput.isReleased()) {
                    //呼叫点击操作者()
                    this.callClickHandler();
                }
            }
        }
        //否则 
    } else {
        //触摸中 = false
        this._touching = false;
    }
};
/**是活动 
 * @return {boolean}
 */
Sprite_Button.prototype.isActive = function() {
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
Sprite_Button.prototype.isButtonTouched = function() {
    //x = 画布到局部x(触摸输入 x)
    var x = this.canvasToLocalX(TouchInput.x);
    //y = 画布到局部y(触摸输入 y)
    var y = this.canvasToLocalY(TouchInput.y);
    //返回 x >=0 并且 y >=0 并且 x < 宽 并且 y < 高
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};
/**画布到局部x 
 * @param {number} x x
 * @return {number}  
 */
Sprite_Button.prototype.canvasToLocalX = function(x) {
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
Sprite_Button.prototype.canvasToLocalY = function(y) {
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