//=============================================================================
// Picture_qrcode.js
//=============================================================================
/*:
 * @plugindesc 二维码作为图片
 * @author wangwang
 *  
 * @help
 * 
 * 
 * 图片名为 
 * qr/www.baidu.com
 * 时 
 * 该图片变成文本的二维码
 * 图片名为
 * qro/{ "text":"www.baidu.com" , "width": 100,"height":100 }
 * 时
 * 解析后面的内容并作为参数进行处理二维码
 * 
 * 使用脚本调用图片 
 * $gameScreen.showPicture(pictureId, name, origin, x, y,  scaleX, scaleY, opacity, blendMode)
 * 
 * @param {number} pictureId 图片id
 * @param {number} origin 原点 参数: 0 左上角 1 中心
 * @param {number} x x坐标
 * @param {number} y y坐标
 * @param {number} scaleX 比例x  100
 * @param {number} scaleY 比例y  100
 * @param {number} opacity 不透明度  255
 * @param {number} blendMode 混合模式 默认0
 * 
 * 举例:
 *  $gameScreen.showPicture(1, "qr/www.baidu.com", 0, 10, 20,  100, 100, 255, 0)
 * 
 * 举例:
 * 
 *  $gameScreen.showPicture(1, 'qro/{ "text":"www.baidu.com" , "width": 100,"height":100 }', 0, 10, 20,  100, 100, 255, 0)
 */

var ww = ww || {}
ww.loadBitmap = ww.loadBitmap || {}
ww.loadBitmap.qrcode = {}



ww.loadBitmap.qrcode.loadBitmap = Sprite_Picture.prototype.loadBitmap

Sprite_Picture.prototype.loadBitmap = function () {
    if (this._window) {
        this.removeChild(this._window)
        delete this._window
    }
    if (this._pictureName &&
        this._pictureName.indexOf("qr/") == 0) {
        var value = this._pictureName.slice(3)
        this.bitmap = Bitmap.qrcode(value)
    } else if (this._pictureName &&
        this._pictureName.indexOf("qro/") == 0) {
        var value = this._pictureName.slice(4)
        this.bitmap = Bitmap.qrcode(JSON.parse(value))
    } else {
        ww.loadBitmap.qrcode.loadBitmap.call(this)
    }
}