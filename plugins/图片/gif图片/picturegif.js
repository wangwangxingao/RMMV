//=============================================================================
//  picturegif.js
//=============================================================================

/*:
 * @plugindesc  
 * picturegif , 显示gif图片
 * @author wangwang
 *   
 * @param  picturegif
 * @desc 插件 显示gif图片 
 * @default
 * 
 * 
 * 
 * @help
 * 
 * 图片名 为 
 * g/gifname,index,time,runs
 * 
 * gifname为文件名,
 * index 为初始时 的索引
 * time为运行的时间,越小gif播放越慢 为0时不运行,1为正常速度(最大为1帧对应gif一帧)
 * runs为运行次数,为0时不运行,播放一次次数-1 ,Infinity 永远运行
 * 
 * 举例 
 * 
 * g/0,0,1,100
 * 
 * 
 */

var ww = ww || {}
ww.picturegif = ww.picturegif || {}



ww.picturegif._Sprite_Picture_prototype_loadBitmap = Sprite_Picture.prototype.loadBitmap

Sprite_Picture.prototype.loadBitmap = function () {
    if (this._pictureName && this._pictureName.indexOf("g/") == 0) {
        if (this._window) {
            this.removeChild(this._window)
            delete this._window
        }
        var value = this._pictureName.slice(2)
        var arr = value.split(",")
        arr[1] = (arr[1] || 0) * 1
        arr[2] = (arr[2] || 0) * 1
        arr[3] = (arr[3] || 0) * 1
        var s = new Sprite_Gif(arr[0], arr[1], arr[2], arr[3])
        if (s) {
            this._window = s
            this.addChild(this._window)
        }
    } else {
        ww.picturegif._Sprite_Picture_prototype_loadBitmap.call(this)
    }
}