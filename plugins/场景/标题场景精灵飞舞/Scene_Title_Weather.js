
function Weather2() {
    this.initialize.apply(this, arguments);
}


Weather2.prototype = Object.create(Weather.prototype);
Weather2.prototype.constructor = Weather2;
/**初始化 */
Weather2.prototype.initialize = function (bitmap) {
    Weather.prototype.initialize.call(this);

    this._pictureBitmap = bitmap || new Bitmap() 
};



Weather2.prototype._createDimmer = function () {
    ///this._dimmerSprite = new ScreenSprite();
    //this._dimmerSprite.setColor(80, 80, 80);
    //this.addChild(this._dimmerSprite);
};


Weather2.prototype._updateDimmer = function () {
    //   this._dimmerSprite.opacity = Math.floor(this.power * 6);
};

Weather2.prototype._updateSprite = function (sprite) {
    switch (this.type) {
        case 'rain':
            this._updateRainSprite(sprite);
            break;
        case 'storm':
            this._updateStormSprite(sprite);
            break;
        case 'snow':
            this._updateSnowSprite(sprite);
            break;
        case "picture":
            this._updatePictureSprite(sprite);

            break;
    }
    if (sprite.opacity < 40) {
        this._rebornSprite(sprite);
    }
};

Weather2.prototype._updatePictureSprite = function (sprite) {
    sprite.bitmap = this._pictureBitmap;
    sprite.rotation = Math.PI / 16;
    sprite.ax -= 1 * Math.sin(sprite.rotation);
    sprite.ay += 1 * Math.cos(sprite.rotation); 
    sprite.opacity -= 1;
};



Scene_Title.prototype.create = function () {
    //场景基础 创建 呼叫(this)
    Scene_Base.prototype.create.call(this);
    //创建背景()
    this.createBackground();
    //创建前景()
    this.createForeground();
    //创建窗口层()
    this.createWindowLayer();
    //创建命令窗口()
    this.createCommandWindow();
    this.createWeather();
};


Scene_Title.prototype.createWeather = function () {
    this._weather = new Weather2()
    this._weather._pictureBitmap = ImageManager.loadPicture("1")
    this._weather.type = "picture"
    this._weather.power = "picture"
    this.addChild(this._weather)
}