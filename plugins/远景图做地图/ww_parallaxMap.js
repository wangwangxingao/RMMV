//=============================================================================
// ww_parallaxMap.js
//=============================================================================
/*:
 * @plugindesc 远景图做地图*简版
 * @author wangwang
 *
 * @param  ww_parallaxMap
 * @desc 插件 远景图做地图*简版,作者:汪汪
 * @default 汪汪 
 *
 * @help   
 * 远景图做地图*简版
 * 把远景图铺在地图上,和地图一起移动的效果..(额,就是编辑器里的那种效果)
 * (额,图片太大不知道会不会卡..无事件纯测试本插件,基本可以稳定在为60fps)
 *  
 */

Spriteset_Map.prototype.updateParallax = function () {
    //如果(远景图名称 !== 游戏地图 远景图名称())
    if (this._parallaxName !== $gameMap.parallaxName()) {
        //远景图名称 = 游戏地图 远景图名称()
        this._parallaxName = $gameMap.parallaxName();
        //如果(远景图 位图 并且 图像 是webgl()!= true  )
        if (this._parallax.bitmap && Graphics.isWebGL() != true) {
            //画布重新添加远景图()
            this._canvasReAddParallax();
        } else {

            var name = this._parallaxName
            //远景图 位图  =  图像管理器 读取远景图(远景图名称)
            var bitmap = ImageManager.loadParallax(name);

            bitmap.addLoadListener((function () {
                if (this._parallaxName == name) {
                    this._parallax.move(0, 0, bitmap.width, bitmap.height)
                }
            }).bind(this))
            this._parallax.bitmap = bitmap
            console.log(this._parallax)
        }
    }
};
/**----------------------------------------------------------------------------- */
/**更新图块地图 */
/**----------------------------------------------------------------------------- */
Spriteset_Map.prototype.updateTilemap = function () { 
    var dx =  $gameMap.displayX() * $gameMap.tileWidth();
    var dy = $gameMap.displayY() * $gameMap.tileHeight();
    //图块地图 原点 x = 游戏地图 显示x() * 游戏地图 图块宽()
    this._tilemap.origin.x = dx 
    //图块地图 原点 y = 游戏地图 显示y() * 游戏地图 图块高()
    this._tilemap.origin.y = dy
  
    //如果(远景图 位图)
    if (this._parallax.bitmap) {
        //远景图 原点 x = 游戏地图 远景图ox()
        this._parallax.origin.x = dx // $gameMap.parallaxOx();
        //远景图 原点 y = 游戏地图 远景图oy()
        this._parallax.origin.y = dy // $gameMap.parallaxOy();
    }
};


Spriteset_Map.prototype._canvasReAddParallax = function () {
    //索引 = 基础精灵 子组 索引在(远景图)
    var index = this._baseSprite.children.indexOf(this._parallax);
    //基础精灵 移除子项(远景图)
    this._baseSprite.removeChild(this._parallax);
    //远景图 = 新 平铺精灵()
    this._parallax = new TilingSprite();
 
    var name = this._parallaxName 
    var bitmap = ImageManager.loadParallax(name); 
    bitmap.addLoadListener((function () {
        if (this._parallaxName == name) {
            this._parallax.move(0, 0, bitmap.width, bitmap.height)
        }
    }).bind(this))
    this._parallax.bitmap = bitmap 
    this._baseSprite.addChildAt(this._parallax, index);
};