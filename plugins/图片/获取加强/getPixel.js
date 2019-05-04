;(function () {
    Bitmap_prototype_initialize=Bitmap.prototype.initialize
    Bitmap.prototype.initialize = function(width, height) {
        Bitmap_prototype_initialize.apply(this, arguments)
        
        this._pixelhash = {}
        this._alphaPixelhash = {}
    };
 
    var Bitmap_prototype__setDirty = Bitmap.prototype._setDirty
    Bitmap.prototype._setDirty = function () {

        this._pixelhash = {}
        this._alphaPixelhash = {}
        Bitmap_prototype__setDirty.call(this)
    };

    /**获得像素
     * 返回指定点像素的颜色。
     * Returns pixel color at the specified point.
     *
     * @method getPixel
     * @param {number} x 位图中像素的x坐标  The x coordinate of the pixel in the bitmap
     * @param {number} y 位图中像素的y坐标  The y coordinate of the pixel in the bitmap
     * @return {string}  像素颜色（十六进制格式） The pixel color (hex format)
     */
    Bitmap.prototype.getPixel = function (x, y) {

        var id = x + "," + y
        if (this._pixelhash[id]) {
            return this._pixelhash[id]
        } else {
            var data = this._context.getImageData(x, y, 1, 1).data;
            var result = '#';
            for (var i = 0; i < 3; i++) {
                result += data[i].toString(16).padZero(2);
            }
            return this._pixelhash[id] = result
        }
    };

    /**获得透明像素
     * 返回指定点透明像素值。
     * Returns alpha pixel value at the specified point.
     *
     * @method getAlphaPixel
     * @param {number} x 位图中像素的x坐标 The x coordinate of the pixel in the bitmap
     * @param {number} y 位图中像素的y坐标 The y coordinate of the pixel in the bitmap
     * @return {string} 透明像素值  The alpha value
     */
    Bitmap.prototype.getAlphaPixel = function (x, y) { 
        var id = x + "," + y
        if (this._alphaPixelhash[id] !== undefined) {
            return this._alphaPixelhash[id]
        } else {
            var data = this._context.getImageData(x, y, 1, 1).data;
            var result = data[3]; 
            return this._alphaPixelhash[id] = result
        }
    };


})();