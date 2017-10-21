function Sprite_TouchClickButton() {
    this.initialize.apply(this, arguments);
}

Sprite_TouchClickButton.prototype = Object.create(Sprite_Button.prototype);
Sprite_TouchClickButton.prototype.constructor = Sprite_TouchClickButton;

Sprite_TouchClickButton.prototype.initialize = function() {
    Sprite_Button.prototype.initialize.call(this);
    this._touchHandler = [];
};



Sprite_TouchClickButton.prototype.setTouchHandler = function(i, method) {
    this._touchHandler[i] = method;
};

Sprite_TouchClickButton.prototype.callTouchHandler = function(i) {
    if (this._touchHandler[i]) {
        this._touchHandler[i]();
    }
};

Sprite_TouchClickButton.prototype.processTouch = function() {
    var ist = TouchInput.isTriggered()
    var ism = TouchInput.isMoved()
    if (ism || ist) {
        if (this.isButtonTouched()) {
            if (!this._touching) {
                this._touching = true;
                this.callTouchHandler(1)
            }
            if (ist) {
                this.callClickHandler()
            }
        } else {
            if (this._touching) {
                this._touching = false;
                this.callTouchHandler(0)
            }
        }
    }
};