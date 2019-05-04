/**
 * 行走图抖动震动的解决方案
 *
 *  */ 
Spriteset_Map.prototype.updateTilemap = function() {
    //图块地图 原点 x = 游戏地图 显示x() * 游戏地图 图块宽()
    this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    //图块地图 原点 y = 游戏地图 显示y() * 游戏地图 图块高()
    this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();

    this._tilemap.origin.x = Math.round(this._tilemap.origin.x)
    this._tilemap.origin.y = Math.round(this._tilemap.origin.y) 
};

 