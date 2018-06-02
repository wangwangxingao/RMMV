
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
    if (ResourceHandler.exists() && buttonName === 'ok') {
        ResourceHandler.retry();
    } else if (buttonName) {
	    //当前状态 键 =true
        this._currentState[buttonName] = true;  
    } 
    this._currentState[event.keyCode] = true;
};
 

/**当键抬起
 * @static
 * @method _onKeyUp
 * @param {KeyboardEvent} event
 * @private
 */ 
Input._onKeyUp = function(event) {
	//键名= 键名表[键值]
    var buttonName = this.keyMapper[event.keyCode];
    //如果键名存在
    if (buttonName) {
	    //当前键名 状态 = false
        this._currentState[buttonName] = false;
    }
    this._currentState[event.keyCode] = false; 
    // 如果 键值===0
    if (event.keyCode === 0) {  // For QtWebEngine on OS X
       //清除
        this.clear();
    }
};





