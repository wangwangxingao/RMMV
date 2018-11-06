//=============================================================================
//  tilemapOut.js
//=============================================================================

/*:
 * @plugindesc  
 * tilemapOut ,地图输出图片 
 * @author wangwang
 *   
 * @param  tilemapOut
 * @desc 插件 地图输出图片 ,作者:汪汪
 * @default 汪汪
 * 
 * 
 * @help
 *   
 * ww.tilemapOut(地图id , 最大宽(单位:图块),最大高(单位:图块),x缩放比例 ,y缩放比例 )
 * 地图id 为0 时 为 输出所有
 * 最大宽高 为0 时 为 地图的宽或高
 * 缩放比例为 0 时默认为 1 
 * 只绘制地图部分
 * 
 * 
 */




var ww = ww || {}
ww.tilemapOut = function (mapId, tx, ty, sx, sy) {
    var sx = sx||1
    var sy = sy||1 
    if (mapId) {
        ww.tilemapOut.loadMap(mapId, tx, ty, sx, sy)
    } else {

        for (var i = 0; i < $dataMapInfos.length; i++) {
            var info = $dataMapInfos[i]
            if (info) {
                ww.tilemapOut.loadMap(info.id, tx, ty, sx, sy)
            }
        }
    }
}

ww.tilemapOut._tileMaps = {}
ww.tilemapOut._dataMaps = {}
ww.tilemapOut._event = {}

ww.tilemapOut.loadMap = function (mapId, tx, ty, sx, sy) {
    if (mapId > 0 && $dataMapInfos && $dataMapInfos[mapId]) {

        if (ww.tilemapOut._dataMaps[mapId]) {
            ww.tilemapOut.onLoad(mapId, tx, ty, sx, sy)
        } else {
            var filename = 'Map%1.json'.format(mapId.padZero(3));
            var xhr = new XMLHttpRequest();
            var url = 'data/' + filename;
            xhr.open('GET', url);
            xhr.overrideMimeType('application/json');
            xhr.onload = function () {
                if (xhr.status < 400) {
                    ww.tilemapOut._dataMaps[mapId] = JSON.parse(xhr.responseText);
                    ww.tilemapOut.onLoad(mapId, tx, ty, sx, sy)
                }
            };
            xhr.send();
        }
    }
}

ww.tilemapOut.onLoad = function (mapId, tx, ty, sx, sy) {
    var gmap = ww.tilemapOut._dataMaps[mapId]

    if (gmap) {
        if (!this._tileMaps[mapId]) {
            //图块地图 = 新 图块地图()
            var tilemap = new Tilemap();
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
            this._tileMaps[mapId] = tilemap
        }

        this._event[mapId] = [tx, ty, sx, sy]
        !this._wait && ww.tilemapOut.waitRead()
    }

}


ww.tilemapOut.waitRead = function () {
    this._wait = false
    for (var i in this._event) {
        var l = this._event[i]
        var tilemap = this._tileMaps[i]
        var tx = l[0]
        var ty = l[1]
        var sx = l[2]
        var sy = l[3]
        if (tilemap.isReady()) {
            tilemap.update()
            tilemap._paintAllTiles2(i, tx, ty, sx, sy)
            delete this._event[i]
        } else {
            this._wait = true
        }
    }
    if (this._wait) {
        requestAnimationFrame(this.waitRead.bind(this))
    }
}




Tilemap.prototype._paintAllTiles2 = function (mapId, tx, ty, sx, sy) {
    var width = this._mapWidth
    var height = this._mapHeight
    var tileCols = tx || width;
    var tileRows = ty || height;

    var bitmaps = {}
    for (var mx = 0, startX = 0; startX < width; mx += 1, startX = mx * tileCols) {
        for (var my = 0, startY = 0; startY < height; my += 1, startY = my * tileRows) {

            var w = width - startX
            w = tileCols < w ? tileCols : w
            var h = height - startY
            h = tileRows < h ? tileRows : h


            var bitmap0 = new Bitmap(w * this._tileWidth, h * this._tileHeight)
            for (var y = 0; y <= h; y++) {
                for (var x = 0; x < w; x++) {
                    this._paintTiles2(bitmap0, startX, startY, x, y);
                }
            }


            if (sx == 1 && sy == 1) {
                var bitmap = bitmap0
                var sxy = ""


            } else {

                var w1 = bitmap0.width
                var h1 = bitmap0.height
                var w2 = w1 * sx
                var h2 = h1 * sy

                var bitmap = new Bitmap(w2, h2)
                bitmap.blt(bitmap0, 0, 0, w1, h1, 0, 0, w2, h2)
                var sxy = "," + sx +"x"+sy
            }
            bitmaps[mx + "," + my] = bitmap

            var name = $dataMapInfos[mapId].name
            if (tileCols == width && tileRows == height) {
                var big = ""
                var index = ""
            } else {
                var big = "," + tileCols + "x" + tileRows + ""
                var index = "," + mx + "-" + my
            }

            ww.tilemapOut.savePng(bitmap, mapId + "," + name + big +sxy + index + ".png", "tilemapOut/")
        }
    }
    console.log(mapId, bitmaps)
    return bitmaps
};



Tilemap.prototype._paintTiles2 = function (bitmap, startX, startY, x, y) {
    var tableEdgeVirtualId = 10000;
    //现在x = 开始x + x 
    var mx = startX + x;
    //现在y = 开始y + y 
    var my = startY + y;
    //dx = 现在x * 图块宽(48)  除 层宽(912)的余数  -- 以层宽为基础的 现在图块坐标 x 
    var dx = x * this._tileWidth;
    //dy = 现在y * 图块高(48)  除 层高(720)的余数  -- 以层宽为基础的 现在图块坐标 y
    var dy = y * this._tileHeight;
    //层x 
    var lx = x;
    //层y
    var ly = y;
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
    //var lastLowerTiles = this._readLastTiles(0, lx, ly);
    //如果 下面的图块组 不等于 之前下面的图块组

    // bitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
    for (var i = 0; i < lowerTiles.length; i++) {
        var lowerTileId = lowerTiles[i];
        if (lowerTileId < 0) {
            this._drawShadow(bitmap, shadowBits, dx, dy);
        } else if (lowerTileId >= tableEdgeVirtualId) {
            this._drawTableEdge(bitmap, upperTileId1, dx, dy);
        } else {
            this._drawTile(bitmap, lowerTileId, dx, dy);
        }
    }
    // bitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
    for (var j = 0; j < upperTiles.length; j++) {
        this._drawTile(bitmap, upperTiles[j], dx, dy);
    }
};



ww.tilemapOut._localURL = null
ww.tilemapOut.localURL = function () {
    if (!this._localURL) {
        if (typeof require === 'function' && typeof process === 'object') {
            var path = require('path');
            var base = path.dirname(process.mainModule.filename);
            /* 打包时 
            if (path.basename(base) == "www") {
                var base = path.dirname(base);
            } 
            */
            this._localdir = base;
        }
    }
    return this._localURL
};

ww.tilemapOut._dirs = {}

/**本地文件位置名称 */
ww.tilemapOut.dirPath = function (name) {
    if (name) {
        var namelist = name.split("/")
        var dirPath = this.localURL()
        var fs = require('fs');
        var d = ""
        for (var i = 0; i < namelist.length - 1; i++) {
            d = d + ((d || dirPath) ? '/' : "") + namelist[i];
            var d2 = dirPath + d
            if (!this._dirs[d]) {
                if (!fs.existsSync(d2)) {
                    fs.mkdirSync(d2);
                }
                this._dirs[d] = 1
            }
        }
        d = d + ((d || dirPath) ? '/' : "") + namelist[i];
        return dirPath + d
    }
}



ww.tilemapOut.savePng = function (bitmap, name, wzname) {
    var name = name || 'tupian.png';
    if (!bitmap || !bitmap.canvas) {
        return bitmap
    };

    var imgData = bitmap.canvas.toDataURL();
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');

    var filePath = this.dirPath((wzname || "baocun/") + name);

    var fs = require("fs");
    fs.writeFile(filePath, dataBuffer, function (err) {
        if (err) {
            return false;
        } else {
            return true;
        }
    });
    return imgData;
}