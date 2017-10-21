function Sprite_TouchButton() {
    this.initialize.apply(this, arguments);
}

Sprite_TouchButton.prototype = Object.create(Sprite_Button.prototype);
Sprite_TouchButton.prototype.constructor = Sprite_TouchButton;


Sprite_TouchButton.prototype.processTouch = function() {
    var ist = TouchInput.isTriggered()
    var ism = TouchInput.isMoved()
    if (ism || ist) {
        if (this.isButtonTouched()) {
            this._touching = true;
            if (ist) {
                this.callClickHandler()
            }
        } else {
            this._touching = false;
        }
    }
};