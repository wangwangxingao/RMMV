//=============================================================================
// ww_moreParallax.js
//=============================================================================
/*:
 * @plugindesc 远景图做地图*添加版
 * @author wangwang
 *
 * @param  ww_moreParallax
 * @desc 插件 远景图做地图*添加版,作者:汪汪
 * @default 汪汪 
 *
 * @help   
 * 远景图做地图*添加版
 * 把远景图铺在地图上,和地图一起移动的效果..(额,就是编辑器里的那种效果) 
 * 格式
 * $gameMap._parallaxs = {t1:{name:"远景图名称",z:10},t2:{name:"远景图名称",z:1}  }
 * 可以无限添加
 * 如 {t1:{name:"远景图名称",z:10},t2:{name:"远景图名称",z:1}t3:{name:"远景图名称",z:10},t4:{name:"远景图名称",z:10} }
 * 
 * name的值为远景图名称
 * z为高度
 * 
 * 
 * 
 * 
 * 
 * 
 *  
 */
ww = ww || {}

ww.moreParallax = {}

ww.moreParallax.Spriteset_Map_prototype_updateParallax = Spriteset_Map.prototype.updateParallax


Spriteset_Map.prototype.updateParallax = function () {

    ww.moreParallax.Spriteset_Map_prototype_updateParallax.call(this)

    this.updateParallaxs()
}


Spriteset_Map.prototype.updateParallaxs = function () {

    this._parallaxs = this._parallaxs || {}
    var parallaxs = $gameMap._parallaxs || {}
    for (var i in this._parallaxs) {

        if (i in parallaxs) {
        } else {
            var parallax = this._parallaxs[i]
            //基础精灵 移除子项(远景图)
            this._tilemap.removeChild(parallax);
            delete this._parallaxs[i]
        }
    }
    for (var i in parallaxs) {

        var name = parallaxs[i].name
        if (i in this._parallaxs) {
            if (this._parallaxs[i]._parallaxName != name) {
                if (this._parallaxs[i].bitmap && Graphics.isWebGL() != true) {
                    //画布重新添加远景图()
                    this._canvasReAddParallaxs(i, name);
                } else {
                    //远景图 位图  =  图像管理器 读取远景图(远景图名称)
                    var bitmap = ImageManager.loadParallax(name);

                    bitmap.addLoadListener((function () {
                        if (this._parallaxs[i]._parallaxName == name) {
                            this._parallaxs[i].move(0, 0, bitmap.width, bitmap.height)
                        }
                    }).bind(this))
                    this._parallaxs[i].bitmap = bitmap
                }
            }
        } else {
            this._canvasReAddParallaxs(i, name)
        }
        this._parallaxs[i].z = parallaxs[i].z
    }

};
/**----------------------------------------------------------------------------- */
/**更新图块地图 */
/**----------------------------------------------------------------------------- */
Spriteset_Map.prototype.updateTilemap = function () {
    var dx = $gameMap.displayX() * $gameMap.tileWidth();
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

    if (this._parallaxs) {

        for (var i in this._parallaxs) {

            //远景图 原点 x = 游戏地图 远景图ox()
            this._parallaxs[i].origin.x = dx // $gameMap.parallaxOx();
            //远景图 原点 y = 游戏地图 远景图oy()
            this._parallaxs[i].origin.y = dy // $gameMap.parallaxOy();


        }

    }

};




Spriteset_Map.prototype._canvasReAddParallaxs = function (i, name) {

    if (this._parallaxs[i]) {
        this._tilemap.removeChild(this._parallaxs[i]);
    }
    this._parallaxs[i] = new TilingSprite();
    this._parallaxs[i]._parallaxName = name

    var bitmap = ImageManager.loadParallax(name);
    bitmap.addLoadListener((function () {
        if (this._parallaxs[i]._parallaxName == name) {
            this._parallaxs[i].move(0, 0, bitmap.width, bitmap.height)
        }
    }).bind(this))
    this._parallaxs[i].bitmap = bitmap
    this._tilemap.addChild(this._parallaxs[i]);

};