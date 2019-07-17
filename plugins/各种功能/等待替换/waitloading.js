
Graphics.setLoadingImage = function (src) {
    this._loadingImage = ImageManager.loadSystem("Loading")
};
Graphics._paintUpperCanvas = function () {
    this._clearUpperCanvas(); 
    if (this._loadingImage && this._loadingCount >= 20) {
        if(!this._loadingImage.canvas){return}
        var context = this._upperCanvas.getContext('2d');
        var dx = (this._width - this._loadingImage.width) / 2;
        var dy = (this._height - this._loadingImage.height) / 2;
        var alpha = ((this._loadingCount - 20) / 30).clamp(0, 1);
        context.save();
        context.globalAlpha = alpha;
        context.drawImage(this._loadingImage.canvas, dx, dy);
        context.restore();
    }
};



