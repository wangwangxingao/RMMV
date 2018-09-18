Sprite_Picture.prototype.initialize = function(pictureId) {
    //精灵 初始化 呼叫(this)
    Sprite.prototype.initialize.call(this);
    this._pictureId = pictureId;
    this._pictureName = '';
    this._isPicture = false;
    this.update();
};