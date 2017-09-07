
//-----------------------------------------------------------------------------
// Sprite_Button
// 按钮精灵
// The sprite for displaying a button.
// 显示按钮的精灵

function Sprite_Button() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Sprite_Button.prototype = Object.create(Sprite.prototype);
//设置创造者
Sprite_Button.prototype.constructor = Sprite_Button;
//初始化
Sprite_Button.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._touching = false;
    this._coldFrame = null;
    this._hotFrame = null;
    this._clickHandler = null;
};
//更新
Sprite_Button.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateFrame();
    this.processTouch();
};
//更新帧
Sprite_Button.prototype.updateFrame = function() {
    var frame;
    if (this._touching) {
        frame = this._hotFrame;
    } else {
        frame = this._coldFrame;
    }
    if (frame) {
        this.setFrame(frame.x, frame.y, frame.width, frame.height);
    }
};
//设置颜色帧
Sprite_Button.prototype.setColdFrame = function(x, y, width, height) {
    this._coldFrame = new Rectangle(x, y, width, height);
};
//设置热帧
Sprite_Button.prototype.setHotFrame = function(x, y, width, height) {
    this._hotFrame = new Rectangle(x, y, width, height);
};
//设置点击操作者
Sprite_Button.prototype.setClickHandler = function(method) {
    this._clickHandler = method;
};
//呼叫点击操作者
Sprite_Button.prototype.callClickHandler = function() {
    if (this._clickHandler) {
        this._clickHandler();
    }
};
//进行触摸
Sprite_Button.prototype.processTouch = function() {
    if (this.isActive()) {
        if (TouchInput.isTriggered() && this.isButtonTouched()) {
            this._touching = true;
        }
        if (this._touching) {
            if (TouchInput.isReleased() || !this.isButtonTouched()) {
                this._touching = false;
                if (TouchInput.isReleased()) {
                    this.callClickHandler();
                }
            }
        }
    } else {
        this._touching = false;
    }
};
//是活动
Sprite_Button.prototype.isActive = function() {
    var node = this;
    while (node) {
        if (!node.visible) {
            return false;
        }
        node = node.parent;
    }
    return true;
};
//是按钮触摸
Sprite_Button.prototype.isButtonTouched = function() {
    var x = this.canvasToLocalX(TouchInput.x);
    var y = this.canvasToLocalY(TouchInput.y);
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
};
//画布到局部x
Sprite_Button.prototype.canvasToLocalX = function(x) {
    var node = this;
    while (node) {
        x -= node.x;
        node = node.parent;
    }
    return x;
};
//画布到局部y
Sprite_Button.prototype.canvasToLocalY = function(y) {
    var node = this;
    while (node) {
        y -= node.y;
        node = node.parent;
    }
    return y;
};
