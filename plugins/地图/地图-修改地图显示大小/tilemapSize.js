
Game_Map.prototype.setTileMapSize = function (x, y, w, h) {
    //返回 图形 宽 / 图块宽()
    this._tileMapPosX = x || 0
    this._tileMapPosY = y || 0
    this._tileMapWidth = w || (Graphics.width + 40)
    this._tileMapHeight = h || (Graphics.height + 40)
};


Game_Map.prototype.tileMapPosX = function () {
    //返回 图形 宽 / 图块宽()
    return this._tileMapPosX || 0
};
/**画面显示图块y*/
Game_Map.prototype.tileMapPosY = function () {
    //返回 图形 高 / 图块高()
    return this._tileMapPosY || 0
};


Game_Map.prototype.tileMapWidth = function () {
    //返回 图形 宽 / 图块宽()
    return this._tileMapWidth ||  (Graphics.width + 40)
};
/**画面显示图块y*/
Game_Map.prototype.tileMapHeight = function () {
    //返回 图形 高 / 图块高()
    return this._tileMapHeight || (Graphics.height + 40)
};




Game_Map.prototype.screenTileX = function () {
    //返回 图形 宽 / 图块宽()
    return this.tileMapWidth() / this.tileWidth();
};
/**画面显示图块y*/
Game_Map.prototype.screenTileY = function () {
    //返回 图形 高 / 图块高()
    return this.tileMapHeight() / this.tileHeight();
};

Game_Player.prototype.centerX = function () {
    //返回 (图形 宽 / 游戏地图 图块宽() - 1) / 2.0
    return ($gameMap.tileMapWidth() / $gameMap.tileWidth() - 1) / 2.0;
};
/**中心y*/
Game_Player.prototype.centerY = function () {
    //返回 (图形 高 / 游戏地图 图块高() - 1) / 2.0
    return ($gameMap.tileMapHeight() / $gameMap.tileHeight() - 1) / 2.0;
};


Spriteset_Map.prototype.updateTilemap = function () {


    this.x = $gameMap.tileMapPosX()
    this.y = $gameMap.tileMapPosY()

    var width = $gameMap.tileMapWidth()
    var height = $gameMap.tileMapHeight()
    if (this._tilemap.width != width || this._tilemap.height != height) {

        //console.log(width, height)
        this._tilemap.width = width
        this._tilemap.height = height
        this.setMakeMask(width, height)
    }


    //图块地图 原点 x = 游戏地图 显示x() * 游戏地图 图块宽()
    this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    //图块地图 原点 y = 游戏地图 显示y() * 游戏地图 图块高()
    this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
};


Game_Map.prototype.canvasToMapX = function (x) {
    //图块宽 = 图块宽()
    var tileWidth = this.tileWidth();
    //原点x = 显示x * 图块宽
    var originX = this._displayX * tileWidth;
    //地图x = 数学 向下取整( (原点x + x) / 图块宽 ) 
    var mapX = Math.floor((originX + x - $gameMap.tileMapPosX()) / tileWidth);
    //返回 环x(地图x)
    return this.roundX(mapX);
};
/**画布到地图y*/
Game_Map.prototype.canvasToMapY = function (y) {
    //图块高 = 图块高()
    var tileHeight = this.tileHeight();
    //原点y = 显示y * 图块高
    var originY = this._displayY * tileHeight;
    //地图y = 数学 向下取整( (原点y + y) / 图块高 ) 
    var mapY = Math.floor((originY + y - $gameMap.tileMapPosY()) / tileHeight);
    //返回 环y(地图y)
    return this.roundY(mapY);
};





Spriteset_Map.prototype.setMask = function (s) {
    if (this.mask) {
        this.removeChild(this.mask)
    }
    this.mask = s
    if (this.mask) {
        this.addChild(this.mask)
    }
}


Spriteset_Map.prototype.setMakeMask = function (w, h) {
    var bitmap = new Bitmap(w, h)
    bitmap.fillAll("#fff")
    this.setMask(new Sprite(bitmap))
}


