//=============================================================================
//  TouchButton.js
//=============================================================================

/*:
 * @plugindesc  
 * PluginGet,触摸按键 
 * @author wangwang
 *   
 * @param  TouchButton
 * @desc 插件 触摸按键 ,作者:汪汪
 * @default 汪汪,TouchEx
 * 
 * 
 * @help 
 * 
 * 一些触摸按键
 *  
 * */

function Sprite_TouchButton() {
    this.initialize.apply(this, arguments);
}
Sprite_TouchButton.prototype = Object.create(Sprite_Button.prototype);
Sprite_TouchButton.prototype.constructor = Sprite_TouchButton;

Sprite_TouchButton.prototype.processTouch = function(isu) {
    if (this.isActive()) {
        var ist = TouchInput.isTriggered()
        var ism = TouchInput.isMoved()
        if (ism || ist || isu) {
            if (this.isButtonTouched()) {
                this._touching = true;
                if (ist) {
                    this.callClickHandler()
                }
            } else {
                this._touching = false;
            }
        }
    }
};


function Sprite_TouchButton2() {
    this.initialize.apply(this, arguments);
}

Sprite_TouchButton2.prototype = Object.create(Sprite_Button.prototype);
Sprite_TouchButton2.prototype.constructor = Sprite_TouchButton2;

Sprite_TouchButton2.prototype.initialize = function() {
    Sprite_Button.prototype.initialize.call(this);
    this._touchHandler = [];
};



Sprite_TouchButton2.prototype.setTouchHandler = function(i, method) {
    this._touchHandler[i] = method;
};

Sprite_TouchButton2.prototype.callTouchHandler = function(i) {
    if (this._touchHandler[i]) {
        this._touchHandler[i](this);
    }
};

Sprite_TouchButton2.prototype.processTouch = function(isu) {
    if (this.isActive()) {
        var ist = TouchInput.isTriggered()
        var ism = TouchInput.isMoved()
        if (ism || ist || isu) {
            if (this.isButtonTouched()) {
                if (!this._touching) {
                    //this._touching = true;
                    this.callTouchHandler(1)
                }
                if (ist) {
                    this.callClickHandler()
                }
            } else {
                if (this._touching) {
                    //this._touching = false;
                    this.callTouchHandler(0)
                }
            }
        }
    }
};