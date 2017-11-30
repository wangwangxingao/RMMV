//=============================================================================
// MapDestination.js
//=============================================================================
/*:
 * @plugindesc 
 * MapDestination,地图目的地精灵, 
 * @author wangwang
 *
 * @param  MapDestination 
 * @desc 插件 地图目的地精灵 ,作者:汪汪
 * @default  汪汪,
 * 
 * 
 * @help
 * 调用pictures文件夹里的 destination 图片
 *  
 *  
 */


Sprite_Destination.prototype.createBitmap = function() {
    this.bitmap = ImageManager.loadPicture("destination");
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.blendMode = Graphics.BLEND_ADD;
};