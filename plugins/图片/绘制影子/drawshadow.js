/**生成影子 */
Bitmap.shadow = function(color, source){
    var b = new Bitmap()
    b.bltImageShadow(color,source)
    return b
}

/**绘制影子 */
Bitmap.prototype.bltImageShadow = function (color, source) {
    if (source) {
        this.resize(source.width, source.height) 
        this.fillAll(color)
        this._context.globalCompositeOperation = 'destination-in';
        this._context.drawImage(source._image, 0,0,source.width, source.height);
        this._setDirty();
    }
};
