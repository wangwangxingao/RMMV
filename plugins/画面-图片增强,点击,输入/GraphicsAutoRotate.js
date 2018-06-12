/*:
 * @plugindesc 强制横屏
 * @author 汪汪
 * @help
 * 如果要关闭，
 * Graphics._rotateLock = true
 * 即可
 *  
 */

Graphics.rotate = function (type) {
    this.rotateTo(type)
    this.rotateLock(true)
    this._updateAllElements();
}


Graphics.rotateLock = function (type) {
    this._rotateLock = type
}

Graphics.rotateTo = function (type) {
    var type = type || 0
    if (this._rotate != type) {
        if (type == 1) {
            this._setElementSet(this._base, this._rotateSet[1], "style")
        } else if (type == 2) {
            this._setElementSet(this._base, this._rotateSet[2], "style")
        } else if (type == 3) {
            this._setElementSet(this._base, this._rotateSet[3], "style")
        } else {
            this._setElementSet(this._base, this._rotateSet[0], "style")
            type = 0
        }
        this._rotate = type
    }
}


Graphics.canAutoRotate = function () {
    return !this._rotateLock //&& Utils.isMobileDevice()

}

Graphics._updateAutoRotate = function (orientation) {
    //console.log(orientation)
    if (this.canAutoRotate()) { 
        if (orientation == 0) {
            Graphics.rotateTo(3)
        } else if (orientation == 180) {
            Graphics.rotateTo(1)
        } else if (orientation == 90) {
            Graphics.rotateTo(0)
        } else if (orientation == -90) {
            Graphics.rotateTo(2)
        }
    }
}

Graphics._onWindowResize = function () {
    if (window.innerHeight > window.innerWidth) {
        var orientation = 0
    } else {
        var orientation = 90
    }
    this._updateAutoRotate(orientation)
    this._updateAllElements();
};




Graphics._setupEventHandlers = function () {
    window.addEventListener('resize', this._onWindowResize.bind(this));
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    document.addEventListener('touchend', this._onTouchEnd.bind(this));
    ("onorientationchange" in window) && document.addEventListener('onorientationchange', this._onWindowRotate.bind(this));
};



Graphics._onWindowRotate = function () {
    this._updateAutoRotate(window.orientation)
    this._updateAllElements();
};




SceneManager.initGraphics = function () {
    var type = this.preferableRendererType();
    Graphics.initialize(this._screenWidth, this._screenHeight, type);
    Graphics.boxWidth = this._boxWidth;
    Graphics.boxHeight = this._boxHeight;
    Graphics.setLoadingImage('img/system/Loading.png');
    if (Utils.isOptionValid('showfps')) {
        Graphics.showFps();
    }
    if (type === 'webgl') {
        this.checkWebGL();
    } 
    if ("orientation" in window) {
        Graphics._onWindowRotate()
		
    }else {
        Graphics._onWindowResize()
    } 
	Graphics._rotateLock = true
};