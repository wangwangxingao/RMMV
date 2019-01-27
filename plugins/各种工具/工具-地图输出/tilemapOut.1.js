
function Tilemap2() {
    this.initialize.apply(this, arguments);
}

Tilemap2.prototype = Object.create(Tilemap.prototype);
Tilemap2.prototype.constructor = Tilemap2;
/**初始化*/
Tilemap2.prototype.initialize = function () {
    this._startX = 0
    this._startY = 0
    this._addX = 20
    this._addY = 20
    Tilemap.prototype.initialize.call(this);
    this._margin = 0;
    this._width = Graphics.width + this._margin * 2;
    this._height = Graphics.height + this._margin * 2;

    this.refresh();
};

/**设置数据 */
Tilemap2.prototype.setData = function (width, height, data) {
    this._mapWidth = width;
    this._mapHeight = height;
    this._mapData = data;

    this._width = width * this._tileWidth
    this._height = height * this._tileHeight

    this._createLayers();
};


Tilemap2.prototype.updateTransform = function () {
    /* //ox = 数学 向下取整 ( 原点 x )
     var ox = 0   //Math.floor(this.origin.x);
     //oy = 数学 向下取整 ( 原点 y )
     var oy = 0 // Math.floor(this.origin.y);
     //开始x =  数学 向下取整(  ( ox - 边缘空白 )/ 图块宽 (48)  )
     var startX = Math.floor((ox - this._margin) / this._tileWidth);
     //开始y = 数学 向下取整(   (oy - 边缘空白) / 图块高(48)   )
     var startY = Math.floor((oy - this._margin) / this._tileHeight);
     //更新层位置( 开始x , 开始y )
     this._updateLayerPositions(startX, startY);
     //如果 需要重画  或者 最后动画帧 != 动画帧  或者 最后开始x != 开始x 或者 最后开始y != 开始y 
     if (this._needsRepaint || this._lastAnimationFrame !== this.animationFrame ||
         this._lastStartX !== startX || this._lastStartY !== startY) {
         this._frameUpdated = this._lastAnimationFrame !== this.animationFrame;
         this._lastAnimationFrame = this.animationFrame;
         this._lastStartX = startX;
         this._lastStartY = startY;
         this._paintAllTiles(startX, startY);
         this._needsRepaint = false;
     }
     this._sortChildren();*/
    // PIXI.Container.prototype.updateTransform.call(this);
};


Tilemap2.prototype.update = function () {
    //动画计数 ++
    this.animationCount++;
    //动画帧 = 数学 向下取整 (   动画计数 / 30  )
    this.animationFrame = Math.floor(this.animationCount / 30);

    if (this._lastAnimationFrame !== this.animationFrame) {
        this._lastAnimationFrame = this.animationFrame

        if (this._startX < this._mapWidth) {
            this._paintAllTiles(this._startX, this._startY)
            this._startX += this._addX
        } else {
            this._startX = 0
            if (this._startY < this._mapHeight) {
                this._startY += this._addY
            }
        }
    }
};


Tilemap2.prototype._paintAllTiles = function (startX, startY) {
    var tileCols = Math.ceil(this._width / this._tileWidth) + 1;
    var tileRows = Math.ceil(this._height / this._tileHeight) + 1;
    for (var y = 0; y < this._addY; y++) {
        for (var x = 0; x < this._addX; x++) {
            this._paintTiles(startX, startY, x, y);
        }
    }
};




Tilemap2.prototype._paintTiles = function (startX, startY, x, y) {
    var tableEdgeVirtualId = 10000;
    //现在x = 开始x + x 
    var mx = startX + x;
    //现在y = 开始y + y 
    var my = startY + y;
    //dx = 现在x * 图块宽(48)  除 层宽(912)的余数  -- 以层宽为基础的 现在图块坐标 x 
    var dx = mx * this._tileWidth;
    //dy = 现在y * 图块高(48)  除 层高(720)的余数  -- 以层宽为基础的 现在图块坐标 y
    var dy = my * this._tileHeight;
    //层x 
    var lx = dx / this._tileWidth;
    //层y
    var ly = dy / this._tileHeight;
    //0层图块
    var tileId0 = this._readMapData(mx, my, 0);
    //1层图块
    var tileId1 = this._readMapData(mx, my, 1);
    //2层图块
    var tileId2 = this._readMapData(mx, my, 2);
    //3层图块
    var tileId3 = this._readMapData(mx, my, 3);
    //阴影
    var shadowBits = this._readMapData(mx, my, 4);
    //y的上面图块
    var upperTileId1 = this._readMapData(mx, my - 1, 1);
    //下面的图块组
    var lowerTiles = [];
    //上面的图块组
    var upperTiles = [];
    //是较高图块
    if (this._isHigherTile(tileId0)) {
        upperTiles.push(tileId0);
    } else {
        lowerTiles.push(tileId0);
    }
    //是较高图块
    if (this._isHigherTile(tileId1)) {
        upperTiles.push(tileId1);
    } else {
        lowerTiles.push(tileId1);
    }
    //下面的图块组 添加 阴影
    lowerTiles.push(-shadowBits);

    //如果 y的上面图块 是平台图块 并且  不是 1层图块 是平台图块
    if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
        // 如果 不是  0层图块 是遮蔽图块(建筑,墙壁)
        if (!Tilemap.isShadowingTile(tileId0)) {
            //下面的图块组 添加 10000 +  y的上面图块 
            lowerTiles.push(tableEdgeVirtualId + upperTileId1);
        }
    }

    //如果 是立交桥的位置
    if (this._isOverpassPosition(mx, my)) {
        upperTiles.push(tileId2);
        upperTiles.push(tileId3);
    } else {
        //如果是较高图块
        if (this._isHigherTile(tileId2)) {
            upperTiles.push(tileId2);
        } else {
            lowerTiles.push(tileId2);
        }
        //如果是较高图块
        if (this._isHigherTile(tileId3)) {
            upperTiles.push(tileId3);
        } else {
            lowerTiles.push(tileId3);
        }
    }

    //之前下面的图块组 
    // var lastLowerTiles = this._readLastTiles(0, lx, ly);
    //如果 下面的图块组 不等于 之前下面的图块组
    //if (!lowerTiles.equals(lastLowerTiles) ||
    //   (Tilemap.isTileA1(tileId0) && this._frameUpdated)) {
    this._lowerBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
    for (var i = 0; i < lowerTiles.length; i++) {
        var lowerTileId = lowerTiles[i];
        if (lowerTileId < 0) {
            this._drawShadow(this._lowerBitmap, shadowBits, dx, dy);
        } else if (lowerTileId >= tableEdgeVirtualId) {
            this._drawTableEdge(this._lowerBitmap, upperTileId1, dx, dy);
        } else {
            this._drawTile(this._lowerBitmap, lowerTileId, dx, dy);
        }
    }
    // this._writeLastTiles(0, lx, ly, lowerTiles);
    //  }

    //var lastUpperTiles = this._readLastTiles(1, lx, ly);
    // if (!upperTiles.equals(lastUpperTiles)) {
    //     this._upperBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
    for (var j = 0; j < upperTiles.length; j++) {
        this._drawTile(this._upperBitmap, upperTiles[j], dx, dy);
    }
    //   this._writeLastTiles(1, lx, ly, upperTiles);
    // }
};




var  ww = ww||{}
 ww.onLoad = function ( ) {

    var gmap = $dataMap
    //图块地图 = 新 图块地图()
    var tilemap = new Tilemap2();
    //图块地图 图块宽 = 游戏地图 图块宽()
    tilemap.tileWidth = $gameMap.tileWidth();
    //图块地图 图块高 = 游戏地图 图块高()
    tilemap.tileHeight = $gameMap.tileHeight();
    //图块地图 设置地图(游戏地图 宽() ,游戏地图 高(),游戏地图 数据())
    tilemap.setData(gmap.width, gmap.height, gmap.data);
    //图块地图 横循环 = 游戏地图 是横循环()
    tilemap.horizontalWrap = gmap.scrollType === 2 || gmap.scrollType === 3;
    //图块地图 纵循环 = 游戏地图 是纵循环()
    tilemap.verticalWrap = gmap.scrollType === 1 || gmap.scrollType === 3;;

    var tileset = $dataTilesets[gmap.tilesetId];
    //如果(摊图块设置)
    if (tileset) {
        //读取图块设置名字组 = 图块设置 图块设置名称组
        var tilesetNames = tileset.tilesetNames;
        //循环 (开始时 i = 0 ; 当 i <  图块设置名称组 长度 ;每一次 i++)
        for (var i = 0; i < tilesetNames.length; i++) {
            //图块地图 位图[i] = 图像管理器 读取图块设置(图块设置名称组[i])
            tilemap.bitmaps[i] = ImageManager.loadTileset(tilesetNames[i]);
        }
        tilemap.flags = tileset.flags;
    }
    return tilemap 
}