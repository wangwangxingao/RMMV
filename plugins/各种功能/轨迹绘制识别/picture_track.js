//=============================================================================
// picture_track.js
//=============================================================================

/*: 
 *
 * @name picture_track 
 * @plugindesc 利用图片显示作为轨迹识别
 * @author 汪汪
 * @version 1.0
 * 
 *   
 * @help
 * 
 * 图片名为  "bh/" +[width, height, eventid, type]
 * 如 $gameScreen.showPicture(3,"bh/[1000,1000,4,0]",0,0,0,100,100,255,0)
 * 
 * 
 * 
 * 
 * 
 * 
 */

ww.track._Sprite_Picture_prototype_loadBitmap = Sprite_Picture.prototype.loadBitmap

Sprite_Picture.prototype.loadBitmap = function () {
    if (this._window) {
        this.removeChild(this._window)
        delete this._window
    }
    if (this._pictureName && this._pictureName.indexOf("bh/") == 0) {
        var json = this._pictureName.slice(3)
        if (json) {
            var list = JSON.parse(json)
            var w = list[0] || 0
            var h = list[1] || 0
            var id = list[2] || 0
            var type = list[3] || 0
         } else { 
            var w = 500
            var h = 500
            var id =   0
            var type = 0
        }
        var wb = new Sprite_Track(w, h, id,type)
        this._window = wb
        this.addChild(this._window)
    } else {
        ww.track._Sprite_Picture_prototype_loadBitmap.call(this)
    }
}
