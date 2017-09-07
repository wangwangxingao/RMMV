
/**===========================================================================
 * 图块地图 显示2D 图块基底 的 游戏地图 
 * The tilemap which displays 2D tile-based game map.
 * 图块地图
 * @class Tilemap
 * @constructor
 *===========================================================================
 */ 
function Tilemap() {
    this.initialize.apply(this, arguments);
}

Tilemap.prototype = Object.create(PIXI.Container.prototype);
Tilemap.prototype.constructor = Tilemap;
//初始化
Tilemap.prototype.initialize = function() {
    PIXI.Container.call(this);
    //边缘空白
    this._margin = 20;
    //宽 = 图形 宽 + 边缘空白 *2    //856 =816+20*2
    this._width = Graphics.width + this._margin * 2;
    //高 = 图形 高 + 边缘空白 *2    //664 =624+20*2
    this._height = Graphics.height + this._margin * 2;
    //图块宽 
    this._tileWidth = 48;
    //图块高
    this._tileHeight = 48;
    //地图宽
    this._mapWidth = 0;
    //地图高
    this._mapHeight = 0;
    //地图数据
    this._mapData = null;
    //层宽
    this._layerWidth = 0;
    //层高
    this._layerHeight = 0;
    //最后图块
    this._lastTiles = [];

    /**--------------------------------------------------------------------------
     * 图块设置 使用的 位图组
     * The bitmaps used as a tileset.
     *
     * @property bitmaps
     * @type Array
     *--------------------------------------------------------------------------
     */ 
    //位图组 = []
    this.bitmaps = [];

    /**--------------------------------------------------------------------------
     * 地图滚动的原点
     * The origin point of the tilemap for scrolling.
     *
     * @property origin
     * @type Point
     *--------------------------------------------------------------------------
     */ 
    //原点 = 新 点
    this.origin = new Point();

    /**--------------------------------------------------------------------------
     * 图块设置 的 标志组
     * The tileset flags.
     *
     * @property flags
     * @type Array
     *--------------------------------------------------------------------------
     */ 
    //标志组 = []
    this.flags = [];

    /**--------------------------------------------------------------------------
     * 自动图块 动画计数
     * The animation count for autotiles.
     *
     * @property animationCount
     * @type Number
     *--------------------------------------------------------------------------
     */ 
    //动画计数 = 0
    this.animationCount = 0;

    /**--------------------------------------------------------------------------
     * 是否水平循环
     * Whether the tilemap loops horizontal.
     *
     * @property horizontalWrap
     * @type Boolean
     *--------------------------------------------------------------------------
     */ 
    //水平循环 = false
    this.horizontalWrap = false;

    /**--------------------------------------------------------------------------
     * 是否垂直循环
     * Whether the tilemap loops vertical.
     *
     * @property verticalWrap
     * @type Boolean
     *--------------------------------------------------------------------------
     */ 
    //垂直循环 = false
    this.verticalWrap = false;

	//创建层
    this._createLayers();
    //刷新
    this.refresh();
};

/**--------------------------------------------------------------------------
 * 画面宽
 * The width of the screen in pixels.
 *
 * @property width
 * @type Number
 *--------------------------------------------------------------------------
 */ 
//定义属性 宽
Object.defineProperty(Tilemap.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        if (this._width !== value) {
            this._width = value;
            this._createLayers();
        }
    }
});

/**--------------------------------------------------------------------------
 * 画面高
 * The height of the screen in pixels.
 *
 * @property height
 * @type Number
 *--------------------------------------------------------------------------
 */ 
//定义属性 高
Object.defineProperty(Tilemap.prototype, 'height', {
    get: function() {
        return this._height;
    },
    set: function(value) {
        if (this._height !== value) {
            this._height = value;
            this._createLayers();
        }
    }
});

/**--------------------------------------------------------------------------
 * 图块宽
 * The width of a tile in pixels.
 *
 * @property tileWidth
 * @type Number
 *--------------------------------------------------------------------------
 */ 
//定义属性 图块宽
Object.defineProperty(Tilemap.prototype, 'tileWidth', {
    get: function() {
        return this._tileWidth;
    },
    set: function(value) {
        if (this._tileWidth !== value) {
            this._tileWidth = value;
            this._createLayers();
        }
    }
});

/**--------------------------------------------------------------------------
 * 图块高
 * The height of a tile in pixels.
 *
 * @property tileHeight
 * @type Number
 *--------------------------------------------------------------------------
 */ 
//定义属性 图块高
Object.defineProperty(Tilemap.prototype, 'tileHeight', {
    get: function() {
        return this._tileHeight;
    },
    set: function(value) {
        if (this._tileHeight !== value) {
            this._tileHeight = value;
            this._createLayers();
        }
    }
});

/**--------------------------------------------------------------------------
 * 设置地图数据
 * Sets the tilemap data.
 *
 * @method setData
 * @param {Number} width The width of the map in number of tiles
 * @param {Number} height The height of the map in number of tiles
 * @param {Array} data The one dimensional array for the map data
 *--------------------------------------------------------------------------
 */ 
//设置数据 
Tilemap.prototype.setData = function(width, height, data) {
	//地图宽 = width
    this._mapWidth = width;
    //地图高 = height
    this._mapHeight = height;
    //地图数据 = data 
    this._mapData = data;
};

/**--------------------------------------------------------------------------
 * 检查图块是否准备好
 * Checks whether the tileset is ready to render.
 *
 * @method isReady
 * @type Boolean
 * @return {Boolean} True if the tilemap is ready
 *--------------------------------------------------------------------------
 */ 
//是准备好
Tilemap.prototype.isReady = function() {
	//循环 (开始时 i = 0 ; 当 i < 位图组 长度 ;每一次 i++)
    for (var i = 0; i < this.bitmaps.length; i++) {
	    //如果 位图组[i] 并且 不是 位图组[i] 是准备好
        if (this.bitmaps[i] && !this.bitmaps[i].isReady()) {
	        //返回 false
            return false;
        }
    }
    //返回 true
    return true;
};

/**--------------------------------------------------------------------------
 * 更新
 * Updates the tilemap for each frame.
 *
 * @method update
 *--------------------------------------------------------------------------
 */ 
//更新
Tilemap.prototype.update = function() {
	//动画计数 ++
    this.animationCount++;
    //动画帧 = 数学 向下取整 (   动画计数 / 30  )
    this.animationFrame = Math.floor(this.animationCount / 30);
    //子组 对每一个 方法(子项)
    this.children.forEach(function(child) {
	    //如果 子项 更新 (子项 更新 存在)
        if (child.update) {
	        //子项 更新
            child.update();
        }
    });
    for (var i=0; i<this.bitmaps.length;i++) {
        if (this.bitmaps[i]) {
            this.bitmaps[i].touch();
        }
    }
};
/**强制刷新图块设置
 * Forces to refresh the tileset
 *
 * @method refresh
 */
//刷新图块设置
Tilemap.prototype.refreshTileset = function() {

};

/**--------------------------------------------------------------------------
 * 刷新
 * Forces to repaint the entire tilemap.
 * @method refresh
 *--------------------------------------------------------------------------
 */ 
//刷新
Tilemap.prototype.refresh = function() {
	//需要重画
    this._needsRepaint = true;
    //最后砖的长度
    this._lastTiles.length = 0;
};

/**--------------------------------------------------------------------------
 * 更新改变
 * @method updateTransform
 * @private
 *--------------------------------------------------------------------------
 */ 
//更新改变
Tilemap.prototype.updateTransform = function() {
	//ox = 数学 向下取整 ( 原点 x )
    var ox = Math.floor(this.origin.x);
    //oy = 数学 向下取整 ( 原点 y )
    var oy = Math.floor(this.origin.y);
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
    this._sortChildren();
    PIXI.Container.prototype.updateTransform.call(this);
};

/**--------------------------------------------------------------------------
 * 创造层
 * @method _createLayers
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._createLayers = function() {
	//宽 856
    var width = this._width;
    //高 664
    var height = this._height;
    //页边 20
    var margin = this._margin;
    //图块列  19  大于等于 宽/图块宽 的最小整数 +1  
    var tileCols = Math.ceil(width / this._tileWidth) + 1;
    //图块行  15  大于等于 高/图块高 的最小整数 +1 
    var tileRows = Math.ceil(height / this._tileHeight) + 1;
    //层宽 912
    var layerWidth = tileCols * this._tileWidth;
    //层高 720
    var layerHeight = tileRows * this._tileHeight;
    //下层位图
    this._lowerBitmap = new Bitmap(layerWidth, layerHeight);
    //上层位图
    this._upperBitmap = new Bitmap(layerWidth, layerHeight);
    this._layerWidth = layerWidth;
    this._layerHeight = layerHeight;

    /**--------------------------------------------------------------------------
     * Z coordinate:
     * 0 : Lower tiles  较下层图块
     * 1 : Lower characters  较下层人物
     * 3 : Normal characters  正常人物
     * 4 : Upper tiles   较上层图块
     * 5 : Upper characters  较上层人物
     * 6 : Airship shadow  飞艇影子
     * 7 : Balloon      气球
     * 8 : Animation    动画
     * 9 : Destination  目的地
     *--------------------------------------------------------------------------
     */ 

    //创建下层
    this._lowerLayer = new Sprite();
    //下层移动到 -20,-20
    this._lowerLayer.move(-margin, -margin, width, height);
    //下层z 为0
    this._lowerLayer.z = 0;

    //创建上层
    this._upperLayer = new Sprite();
    //上层移动到 -20,-20
    this._upperLayer.move(-margin, -margin, width, height);
    //上层z 为0
    this._upperLayer.z = 4;

    //添加4个子项精灵到层
    for (var i = 0; i < 4; i++) {
        this._lowerLayer.addChild(new Sprite(this._lowerBitmap));
        this._upperLayer.addChild(new Sprite(this._upperBitmap));
    }
    //添加下层  
    this.addChild(this._lowerLayer);
    //添加上层 
    this.addChild(this._upperLayer);
};

/**--------------------------------------------------------------------------
 * 更新层位置
 * @method _updateLayerPositions
 * @param {Number} startX
 * @param {Number} startY
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._updateLayerPositions = function(startX, startY) {
	//m = 页边 20
    var m = this._margin;
    //ox = 小于等于 原点 x 的最大整数
    var ox = Math.floor(this.origin.x);
    //oy = 小于等于 原点 y 的最大整数
    var oy = Math.floor(this.origin.y);
    //x2 = (ox-m) 除 层宽(912)的余数  --  以层宽 为基准的 ox-m 到左边的距离
    var x2 = (ox - m).mod(this._layerWidth);
    //y2 = (oy-m) 除 层高(720)的余数  --  以层高 为基准的 oy-m 到上边的距离
    var y2 = (oy - m).mod(this._layerHeight);
    //w1 = 层宽(912) - x2    --   以层宽 为基准的 ox-m 到右边的距离
    var w1 = this._layerWidth - x2;
    //h2 = 层高(720) - y2    --   以层高 为基准的 oy-m 到下边的距离
    var h1 = this._layerHeight - y2;
    //w2 = 宽(856) - w1  -- x2 - 56
    var w2 = this._width - w1;
    //h2 = 高(664) - h1  -- y2 - 56
    var h2 = this._height - h1;

    for (var i = 0; i < 2; i++) {
        var children;
        if (i === 0) {
            children = this._lowerLayer.children;
        } else {
            children = this._upperLayer.children;
        }
        children[0].move(0, 0, w1, h1);
        children[0].setFrame(x2, y2, w1, h1);
        children[1].move(w1, 0, w2, h1);
        children[1].setFrame(0, y2, w2, h1);
        children[2].move(0, h1, w1, h2);
        children[2].setFrame(x2, 0, w1, h2);
        children[3].move(w1, h1, w2, h2);
        children[3].setFrame(0, 0, w2, h2);
    }
};

/**--------------------------------------------------------------------------
 * 打印所有图块
 * @method _paintAllTiles
 * @param {Number} startX
 * @param {Number} startY
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._paintAllTiles = function(startX, startY) {
    var tileCols = Math.ceil(this._width / this._tileWidth) + 1;
    var tileRows = Math.ceil(this._height / this._tileHeight) + 1;
    for (var y = 0; y < tileRows; y++) {
        for (var x = 0; x < tileCols; x++) {
            this._paintTiles(startX, startY, x, y);
        }
    }
};

/**--------------------------------------------------------------------------
 * 打印图块
 * @method _paintTiles
 * @param {Number} startX
 * @param {Number} startY
 * @param {Number} x
 * @param {Number} y
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._paintTiles = function(startX, startY, x, y) {
    var tableEdgeVirtualId = 10000;
    //现在x = 开始x + x 
    var mx = startX + x;
    //现在y = 开始y + y 
    var my = startY + y;
    //dx = 现在x * 图块宽(48)  除 层宽(912)的余数  -- 以层宽为基础的 现在图块坐标 x 
    var dx = (mx * this._tileWidth).mod(this._layerWidth);
    //dy = 现在y * 图块高(48)  除 层高(720)的余数  -- 以层宽为基础的 现在图块坐标 y
    var dy = (my * this._tileHeight).mod(this._layerHeight);
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
    var lastLowerTiles = this._readLastTiles(0, lx, ly);
    //如果 下面的图块组 不等于 之前下面的图块组
    if (!lowerTiles.equals(lastLowerTiles) ||
            (Tilemap.isTileA1(tileId0) && this._frameUpdated)) {
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
        this._writeLastTiles(0, lx, ly, lowerTiles);
    }

    var lastUpperTiles = this._readLastTiles(1, lx, ly);
    if (!upperTiles.equals(lastUpperTiles)) {
        this._upperBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
        for (var j = 0; j < upperTiles.length; j++) {
            this._drawTile(this._upperBitmap, upperTiles[j], dx, dy);
        }
        this._writeLastTiles(1, lx, ly, upperTiles);
    }
};

/**--------------------------------------------------------------------------
 * 读取最后的图块
 * @method _readLastTiles
 * @param {Number} i
 * @param {Number} x
 * @param {Number} y
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._readLastTiles = function(i, x, y) {

    var array1 = this._lastTiles[i];
    if (array1) {
        var array2 = array1[y];
        if (array2) {
            var tiles = array2[x];
            if (tiles) {
                return tiles;
            }
        }
    }
    return [];
};

/**--------------------------------------------------------------------------
 * 写最后的图块
 * @method _writeLastTiles
 * @param {Number} i
 * @param {Number} x
 * @param {Number} y
 * @param {Array} tiles
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._writeLastTiles = function(i, x, y, tiles) {
    var array1 = this._lastTiles[i];
    if (!array1) {
        array1 = this._lastTiles[i] = [];
    }
    var array2 = array1[y];
    if (!array2) {
        array2 = array1[y] = [];
    }
    array2[x] = tiles;
};

/**--------------------------------------------------------------------------
 * 画图块
 * @method _drawTile
 * @param {Bitmap} bitmap
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._drawTile = function(bitmap, tileId, dx, dy) {
    if (Tilemap.isVisibleTile(tileId)) {
        if (Tilemap.isAutotile(tileId)) {
            this._drawAutotile(bitmap, tileId, dx, dy);
        } else {
            this._drawNormalTile(bitmap, tileId, dx, dy);
        }
    }
};

/**--------------------------------------------------------------------------
 * 画普通图块
 * @method _drawNormalTile
 * @param {Bitmap} bitmap
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._drawNormalTile = function(bitmap, tileId, dx, dy) {
	//设置数字 =0
    var setNumber = 0;
    //如果  是图块a5
    if (Tilemap.isTileA5(tileId)) {
	    //设置数字 = 4
        setNumber = 4;
    } else {
	    //设置数字 = 5 +  id /256
        setNumber = 5 + Math.floor(tileId / 256);
    }
    // w = 图块宽
    var w = this._tileWidth;
    // h = 图块高
    var h = this._tileHeight;
    // sx =  (图块id/128)除2的余数 *8 + 图块id 除以8 的余数 * 宽 
    var sx = (Math.floor(tileId / 128) % 2 * 8 + tileId % 8) * w;
    // sy = (图块id除256的余数 除 8 )除16 的余数 * 高
    var sy = (Math.floor(tileId % 256 / 8) % 16) * h;
	//来源 = 图片组[setNumber//设置数字];
    var source = this.bitmaps[setNumber];
    //如果 来源
    if (source) {
	    //图片 绘制 (来源,sx,sy,w,h, dx,dy,w,h  )
        bitmap.bltImage(source, sx, sy, w, h, dx, dy, w, h);
    }
};

/**--------------------------------------------------------------------------
 * 画自动图块
 * @method _drawAutotile
 * @param {Bitmap} bitmap
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._drawAutotile = function(bitmap, tileId, dx, dy) {
	//自动图块表     基底自动图块表
    var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
    //种类
    var kind = Tilemap.getAutotileKind(tileId);
    //形状
    var shape = Tilemap.getAutotileShape(tileId);
    //tx = 种类 除以8 的余数
    var tx = kind % 8;
    //ty = 种类 / 8
    var ty = Math.floor(kind / 8);
    //bx = 0
    var bx = 0;
    //by = 0 
    var by = 0;
    //设置数字 = 0 
    var setNumber = 0;
    var isTable = false;
    //如果 是图块a1 
    if (Tilemap.isTileA1(tileId)) {
	    //水表面索引
        var waterSurfaceIndex = [0, 1, 2, 1][this.animationFrame % 4];
        //设置数字
        setNumber = 0;
        //种类 === 0 
        if (kind === 0) {
            bx = waterSurfaceIndex * 2;
            by = 0;
        //种类 === 1 
        } else if (kind === 1) {
            bx = waterSurfaceIndex * 2;
            by = 3;
        //种类 === 2
        } else if (kind === 2) {
            bx = 6;
            by = 0;
        //种类 === 3
        } else if (kind === 3) {
            bx = 6;
            by = 3;
        //除此以外
        } else {
	        //
            bx = Math.floor(tx / 4) * 8;
            by = ty * 6 + Math.floor(tx / 2) % 2 * 3;
            if (kind % 2 === 0) {
                bx += waterSurfaceIndex * 2;
            }
            else {
                bx += 6;
                autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                by += this.animationFrame % 3;
            }
        }
    //是图块a2
    } else if (Tilemap.isTileA2(tileId)) {
	    //设置数字 = 1 
        setNumber = 1;
        bx = tx * 2;
        by = (ty - 2) * 3;
        
        isTable = this._isTableTile(tileId);
    //是图块a3
    } else if (Tilemap.isTileA3(tileId)) {
        setNumber = 2;
        bx = tx * 2;
        by = (ty - 6) * 2;
        autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
    //是图块a4
    } else if (Tilemap.isTileA4(tileId)) {
        setNumber = 3;
        bx = tx * 2;
        by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
        if (ty % 2 === 1) {
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        }
    }
	// 表 =  自动图块表[shape形态]
    var table = autotileTable[shape];
    //来源 =  图片 绘制 (来源,sx,sy,w,h, dx,dy,w,h  )
    var source = this.bitmaps[setNumber];

    if (table && source) {
	    //w1 = 图块宽/2
        var w1 = this._tileWidth / 2;
        //h1 = 图块高/2
        var h1 = this._tileHeight / 2;
        for (var i = 0; i < 4; i++) {
	        //qsx =    表[i][0]   
            var qsx = table[i][0];
	        //qsy =    表[i][1]   
            var qsy = table[i][1];
            //sx1 = (bx *2 + qsx)  * w1
            var sx1 = (bx * 2 + qsx) * w1;
            //sy1 = (by *2 + qsy)  * h1
            var sy1 = (by * 2 + qsy) * h1;
            var dx1 = dx + (i % 2) * w1;
            var dy1 = dy + Math.floor(i / 2) * h1;
            if (isTable && (qsy === 1 || qsy === 5)) {
                var qsx2 = qsx;
                var qsy2 = 3;
                if (qsy === 1) {
                    qsx2 = [0,3,2,1][qsx];
                }
                var sx2 = (bx * 2 + qsx2) * w1;
                var sy2 = (by * 2 + qsy2) * h1;
                bitmap.bltImage(source, sx2, sy2, w1, h1, dx1, dy1, w1, h1);
                dy1 += h1/2;
                bitmap.bltImage(source, sx1, sy1, w1, h1/2, dx1, dy1, w1, h1/2);
            } else {
                bitmap.bltImage(source, sx1, sy1, w1, h1, dx1, dy1, w1, h1);
            }
        }
    }
};

/**--------------------------------------------------------------------------
 * 绘制桌面边缘
 * @method _drawTableEdge
 * @param {Bitmap} bitmap
 * @param {Number} tileId
 * @param {Number} dx
 * @param {Number} dy
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._drawTableEdge = function(bitmap, tileId, dx, dy) {
    if (Tilemap.isTileA2(tileId)) {
        var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        var kind = Tilemap.getAutotileKind(tileId);
        var shape = Tilemap.getAutotileShape(tileId);
        var tx = kind % 8;
        var ty = Math.floor(kind / 8);
        var setNumber = 1;
        var bx = tx * 2;
        var by = (ty - 2) * 3;
        var table = autotileTable[shape];
        if (table) {
            var source = this.bitmaps[setNumber];
            var w1 = this._tileWidth / 2;
            var h1 = this._tileHeight / 2;
            for (var i = 0; i < 2; i++) {
                var qsx = table[2 + i][0];
                var qsy = table[2 + i][1];
                var sx1 = (bx * 2 + qsx) * w1;
                var sy1 = (by * 2 + qsy) * h1 + h1/2;
                var dx1 = dx + (i % 2) * w1;
                var dy1 = dy + Math.floor(i / 2) * h1;
                bitmap.bltImage(source, sx1, sy1, w1, h1/2, dx1, dy1, w1, h1/2);
            }
        }
    }
};

/**--------------------------------------------------------------------------
 * 画阴影
 * @method _drawShadow
 * @param {Bitmap} bitmap
 * @param {Number} shadowBits
 * @param {Number} dx
 * @param {Number} dy
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._drawShadow = function(bitmap, shadowBits, dx, dy) {
    if (shadowBits & 0x0f) {
        var w1 = this._tileWidth / 2;
        var h1 = this._tileHeight / 2;
        var color = 'rgba(0,0,0,0.5)';
        for (var i = 0; i < 4; i++) {
            if (shadowBits & (1 << i)) {
                var dx1 = dx + (i % 2) * w1;
                var dy1 = dy + Math.floor(i / 2) * h1;
                bitmap.fillRect(dx1, dy1, w1, h1, color);
            }
        }
    }
};

/**--------------------------------------------------------------------------
 * 读取地图数据
 * @method _readMapData
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @return {Number}
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._readMapData = function(x, y, z) {
    if (this._mapData) {
        var width = this._mapWidth;
        var height = this._mapHeight;
        if (this.horizontalWrap) {
            x = x.mod(width);
        }
        if (this.verticalWrap) {
            y = y.mod(height);
        }
        if (x >= 0 && x < width && y >= 0 && y < height) {
            return this._mapData[(z * height + y) * width + x] || 0;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
};

/**--------------------------------------------------------------------------
 * 是较高图块
 * @method _isHigherTile
 * @param {Number} tileId
 * @return {Boolean}
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._isHigherTile = function(tileId) {
    return this.flags[tileId] & 0x10;
};

/**--------------------------------------------------------------------------
 * 是平台图块
 * @method _isTableTile
 * @param {Number} tileId
 * @return {Boolean}
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._isTableTile = function(tileId) {
    return Tilemap.isTileA2(tileId) && (this.flags[tileId] & 0x80);
};

/**--------------------------------------------------------------------------
 * 是立交桥的位置
 * @method _isOverpassPosition
 * @param {Number} mx
 * @param {Number} my
 * @return {Boolean}
 * @private
 *--------------------------------------------------------------------------
 */ 
Tilemap.prototype._isOverpassPosition = function(mx, my) {
    return false;
};

/**--------------------------------------------------------------------------
 * 排序子项
 * @method _sortChildren
 * @private
 *--------------------------------------------------------------------------
 */ 
//排序子项
Tilemap.prototype._sortChildren = function() {
    this.children.sort(this._compareChildOrder.bind(this));
};

/**--------------------------------------------------------------------------
 * 比较子项次序
 * @method _compareChildOrder
 * @param {Object} a
 * @param {Object} b
 * @private
 *--------------------------------------------------------------------------
 */ 
//比较子项次序
Tilemap.prototype._compareChildOrder = function(a, b) {
    if (a.z !== b.z) {
        return a.z - b.z;
    } else if (a.y !== b.y) {
        return a.y - b.y;
    } else {
        return a.spriteId - b.spriteId;
    }
};

// Tile type checkers 图块种类检查

Tilemap.TILE_ID_B      = 0;
Tilemap.TILE_ID_C      = 256;
Tilemap.TILE_ID_D      = 512;
Tilemap.TILE_ID_E      = 768;
Tilemap.TILE_ID_A5     = 1536;
Tilemap.TILE_ID_A1     = 2048;
Tilemap.TILE_ID_A2     = 2816;
Tilemap.TILE_ID_A3     = 4352;
Tilemap.TILE_ID_A4     = 5888;
Tilemap.TILE_ID_MAX    = 8192;
//是可见图块
Tilemap.isVisibleTile = function(tileId) {
    return tileId > 0 && tileId < this.TILE_ID_MAX;
};
//是自动图块
Tilemap.isAutotile = function(tileId) {
    return tileId >= this.TILE_ID_A1;
};
//获得自动图块种类
Tilemap.getAutotileKind = function(tileId) {
    return Math.floor((tileId - this.TILE_ID_A1) / 48);
};
//获得自动图块形状
Tilemap.getAutotileShape = function(tileId) {
    return (tileId - this.TILE_ID_A1) % 48;
};
//制作自动图块id
Tilemap.makeAutotileId = function(kind, shape) {
    return this.TILE_ID_A1 + kind * 48 + shape;
};
//是相同种类图块
Tilemap.isSameKindTile = function(tileID1, tileID2) {
    if (this.isAutotile(tileID1) && this.isAutotile(tileID2)) {
        return this.getAutotileKind(tileID1) === this.getAutotileKind(tileID2);
    } else {
        return tileID1 === tileID2;
    }
};
//是图块a1
Tilemap.isTileA1 = function(tileId) {
    return tileId >= this.TILE_ID_A1 && tileId < this.TILE_ID_A2;
};
//是图块a2
Tilemap.isTileA2 = function(tileId) {
    return tileId >= this.TILE_ID_A2 && tileId < this.TILE_ID_A3;
};
//是图块a3
Tilemap.isTileA3 = function(tileId) {
    return tileId >= this.TILE_ID_A3 && tileId < this.TILE_ID_A4;
};
//是图块a4
Tilemap.isTileA4 = function(tileId) {
    return tileId >= this.TILE_ID_A4 && tileId < this.TILE_ID_MAX;
};
//是图块a5
Tilemap.isTileA5 = function(tileId) {
    return tileId >= this.TILE_ID_A5 && tileId < this.TILE_ID_A1;
};
//是水图块
Tilemap.isWaterTile = function(tileId) {
    if (this.isTileA1(tileId)) {
        return !(tileId >= this.TILE_ID_A1 + 96 && tileId < this.TILE_ID_A1 + 192);
    } else {
        return false;
    }
};
//是瀑布图块
Tilemap.isWaterfallTile = function(tileId) {
    if (tileId >= this.TILE_ID_A1 + 192 && tileId < this.TILE_ID_A2) {
        return this.getAutotileKind(tileId) % 2 === 1;
    } else {
        return false;
    }
};
//是土地图块
Tilemap.isGroundTile = function(tileId) {
    return this.isTileA1(tileId) || this.isTileA2(tileId) || this.isTileA5(tileId);
};
//是遮蔽图块(建筑,墙壁)
Tilemap.isShadowingTile = function(tileId) {
    return this.isTileA3(tileId) || this.isTileA4(tileId);
};
//是屋顶图块
Tilemap.isRoofTile = function(tileId) {
    return this.isTileA3(tileId) && this.getAutotileKind(tileId) % 16 < 8;
};
//是墙顶部图块
Tilemap.isWallTopTile = function(tileId) {
    return this.isTileA4(tileId) && this.getAutotileKind(tileId) % 16 < 8;
};
//是墙壁部图块
Tilemap.isWallSideTile = function(tileId) {
    return (this.isTileA3(tileId) || this.isTileA4(tileId)) &&
            this.getAutotileKind(tileId) % 16 >= 8;
};
//是墙图块
Tilemap.isWallTile = function(tileId) {
    return this.isWallTopTile(tileId) || this.isWallSideTile(tileId);
};
//是地板类型自动图块
Tilemap.isFloorTypeAutotile = function(tileId) {
    return (this.isTileA1(tileId) && !this.isWaterfallTile(tileId)) ||
            this.isTileA2(tileId) || this.isWallTopTile(tileId);
};
//是墙种类自动图块
Tilemap.isWallTypeAutotile = function(tileId) {
    return this.isRoofTile(tileId) || this.isWallSideTile(tileId);
};
//是瀑布种类自动图块
Tilemap.isWaterfallTypeAutotile = function(tileId) {
    return this.isWaterfallTile(tileId);
};

// Autotile shape number to coordinates of tileset images
//基底自动图块表
Tilemap.FLOOR_AUTOTILE_TABLE = [
    [[2,4],[1,4],[2,3],[1,3]],[[2,0],[1,4],[2,3],[1,3]],
    [[2,4],[3,0],[2,3],[1,3]],[[2,0],[3,0],[2,3],[1,3]],
    [[2,4],[1,4],[2,3],[3,1]],[[2,0],[1,4],[2,3],[3,1]],
    [[2,4],[3,0],[2,3],[3,1]],[[2,0],[3,0],[2,3],[3,1]],
    [[2,4],[1,4],[2,1],[1,3]],[[2,0],[1,4],[2,1],[1,3]],
    [[2,4],[3,0],[2,1],[1,3]],[[2,0],[3,0],[2,1],[1,3]],
    [[2,4],[1,4],[2,1],[3,1]],[[2,0],[1,4],[2,1],[3,1]],
    [[2,4],[3,0],[2,1],[3,1]],[[2,0],[3,0],[2,1],[3,1]],
    [[0,4],[1,4],[0,3],[1,3]],[[0,4],[3,0],[0,3],[1,3]],
    [[0,4],[1,4],[0,3],[3,1]],[[0,4],[3,0],[0,3],[3,1]],
    [[2,2],[1,2],[2,3],[1,3]],[[2,2],[1,2],[2,3],[3,1]],
    [[2,2],[1,2],[2,1],[1,3]],[[2,2],[1,2],[2,1],[3,1]],
    [[2,4],[3,4],[2,3],[3,3]],[[2,4],[3,4],[2,1],[3,3]],
    [[2,0],[3,4],[2,3],[3,3]],[[2,0],[3,4],[2,1],[3,3]],
    [[2,4],[1,4],[2,5],[1,5]],[[2,0],[1,4],[2,5],[1,5]],
    [[2,4],[3,0],[2,5],[1,5]],[[2,0],[3,0],[2,5],[1,5]],
    [[0,4],[3,4],[0,3],[3,3]],[[2,2],[1,2],[2,5],[1,5]],
    [[0,2],[1,2],[0,3],[1,3]],[[0,2],[1,2],[0,3],[3,1]],
    [[2,2],[3,2],[2,3],[3,3]],[[2,2],[3,2],[2,1],[3,3]],
    [[2,4],[3,4],[2,5],[3,5]],[[2,0],[3,4],[2,5],[3,5]],
    [[0,4],[1,4],[0,5],[1,5]],[[0,4],[3,0],[0,5],[1,5]],
    [[0,2],[3,2],[0,3],[3,3]],[[0,2],[1,2],[0,5],[1,5]],
    [[0,4],[3,4],[0,5],[3,5]],[[2,2],[3,2],[2,5],[3,5]],
    [[0,2],[3,2],[0,5],[3,5]],[[0,0],[1,0],[0,1],[1,1]]
];
//墙自动图块表
Tilemap.WALL_AUTOTILE_TABLE = [
    [[2,2],[1,2],[2,1],[1,1]],[[0,2],[1,2],[0,1],[1,1]],
    [[2,0],[1,0],[2,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],
    [[2,2],[3,2],[2,1],[3,1]],[[0,2],[3,2],[0,1],[3,1]],
    [[2,0],[3,0],[2,1],[3,1]],[[0,0],[3,0],[0,1],[3,1]],
    [[2,2],[1,2],[2,3],[1,3]],[[0,2],[1,2],[0,3],[1,3]],
    [[2,0],[1,0],[2,3],[1,3]],[[0,0],[1,0],[0,3],[1,3]],
    [[2,2],[3,2],[2,3],[3,3]],[[0,2],[3,2],[0,3],[3,3]],
    [[2,0],[3,0],[2,3],[3,3]],[[0,0],[3,0],[0,3],[3,3]]
];
//瀑布自动图块表
Tilemap.WATERFALL_AUTOTILE_TABLE = [
    [[2,0],[1,0],[2,1],[1,1]],[[0,0],[1,0],[0,1],[1,1]],
    [[2,0],[3,0],[2,1],[3,1]],[[0,0],[3,0],[0,1],[3,1]]
];

// The important members from Pixi.js

/**--------------------------------------------------------------------------
 * [只读]图块地图子项的数组
 * [read-only] The array of children of the tilemap.
 *
 * @property children
 * @type Array
 *--------------------------------------------------------------------------
 */ 

/**--------------------------------------------------------------------------
 * [只读]包含地图子项的对象
 * [read-only] The object that contains the tilemap.
 *
 * @property parent
 * @type Object
 *--------------------------------------------------------------------------
 */ 

/**--------------------------------------------------------------------------
 * 容器增加子项
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child The child to add
 * @return {Object} The child that was added
 *--------------------------------------------------------------------------
 */ 

/**--------------------------------------------------------------------------
 * 添加一个子项到容器中指定索引处
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child The child to add
 * @param {Number} index The index to place the child in
 * @return {Object} The child that was added
 *--------------------------------------------------------------------------
 */ 

/**--------------------------------------------------------------------------
 * 从容器中删除一个子项
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child The child to remove
 * @return {Object} The child that was removed
 *--------------------------------------------------------------------------
 */ 

/**--------------------------------------------------------------------------
 * 从指定索引位置的删除一个子项
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index The index to get the child from
 * @return {Object} The child that was removed
 *--------------------------------------------------------------------------
 */ 

