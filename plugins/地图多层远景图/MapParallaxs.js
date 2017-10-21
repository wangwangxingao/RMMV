//=============================================================================
// MapParallaxs.js
//=============================================================================
/*:
 * @plugindesc MapParallaxs,地图多层远景图
 * @author wangwang
 *
 * 
 * @param  MapParallaxs 
 * @desc 插件 地图多层远景图 ,作者:汪汪
 * @default  汪汪
 *
 * @help
 *  
 * 设置方法
 * $gameMap.setParallaxsIndex(编号,名称,层高,x循环,y循环,初始x,初始y,比例x,比例y,地图id)
 * 编号:默认0, 
 * 名称:默认 "",
 * 层高:默认0,
 * x循环:默认不循环 ,
 * y循环:默认不循环,
 * 初始x:默认0,
 * 初始y:默认0, 
 * 比例x:默认1,
 * 比例y:默认1,
 * 地图id:默认当前地图
 *  
 */






var Game_Map_prototype_initialize = Game_Map.prototype.initialize
Game_Map.prototype.initialize = function() {
    Game_Map_prototype_initialize.call(this)

    this._parallax1X = 0
    this._parallax0X = 0
    this._parallax1Y = 0
    this._parallax0Y = 0

    this._parallaxsRe = true
};



var Game_Map_prototype_setup = Game_Map.prototype.setup
Game_Map.prototype.setup = function(mapId) {
    Game_Map_prototype_setup.call(this, mapId)

    this._parallax1X = 0
    this._parallax0X = 0
    this._parallax1Y = 0
    this._parallax0Y = 0
    this.allParallaxsUpdate()
}


/**全部更新 */
Game_Map.prototype.allParallaxsUpdate = function() {
    this._parallaxsRe = true
};


Game_Map.prototype.getParallaxs = function(mapId) {
    if (mapId === undefined) {
        var mapId = this._mapId
    } else {
        var mapId = mapId
    }
    $gameVariables._data[100] = $gameVariables._data[100] || {}
    return $gameVariables._data[100][mapId] || {}
};

Game_Map.prototype.setParallaxs = function(parallaxs, mapId) {
    if (mapId === undefined) {
        var mapId = this._mapId
    } else {
        var mapId = mapId
    }
    $gameVariables._data[100] = $gameVariables._data[100] || {}
    return $gameVariables._data[100][mapId] = parallaxs
};



Game_Map.prototype.setParallaxsIndex = function(index, name, zIndex, loopX, loopY, sx, sy, ox, oy, mapId) {
    if (mapId === undefined) {
        var mapId = this._mapId
    } else {
        var mapId = mapId
    }
    var parallaxs = this.getParallaxs(mapId)

    var index = index || 0

    var parallax = parallaxs[index] || {}

    parallax._parallaxName = name || "";
    parallax._zIndex = zIndex || 0
    parallax._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);

    parallax._parallaxLoopX = loopX || false;
    parallax._parallaxLoopY = loopY || false;
    parallax._parallaxSx = sx || 0;
    parallax._parallaxSy = sy || 0;
    parallax._parallaxOx = ox === undefined ? 1 : 1 * ox;
    parallax._parallaxOy = oy === undefined ? 1 : 1 * ox;
    parallaxs[index] = parallax
    return this.setParallaxs(parallaxs)
};


/**远景图ox*/
Game_Map.prototype.parallaxsOx = function(parallax) {
    var parallaxX = 0
    if (parallax._parallaxLoopX) {
        parallaxX = this._parallax1X * parallax._parallaxOx + parallax._parallaxSx / this.tileWidth() / 2;
    } else {
        parallaxX = this._parallax0X * parallax._parallaxOx
    }
    if (parallax._parallaxZero) {
        return parallaxX * this.tileWidth();
    } else if (parallax._parallaxLoopX) {
        return parallaxX * this.tileWidth() / 2;
    } else {
        return 0;
    }
};
/**远景图oy*/
Game_Map.prototype.parallaxsOy = function(parallax) {
    var parallaxY = 0
    if (parallax._parallaxLoopY) {
        parallaxY = this._parallax1Y * parallax._parallaxOy + parallax._parallaxSy / this.tileHeight() / 2;
    } else {
        parallaxY = this._parallax0Y * parallax._parallaxOy
    }
    if (parallax._parallaxZero) {
        return parallaxY * this.tileHeight();
    } else if (parallax._parallaxLoopY) {
        return parallaxY * this.tileHeight() / 2;
    } else {
        return 0;
    }
};


Game_Map.prototype.setDisplayPos = function(x, y) {
    if (this.isLoopHorizontal()) {
        this._displayX = x.mod(this.width());
        this._parallaxX = x;
    } else {
        var endX = this.width() - this.screenTileX();
        this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
        this._parallaxX = this._displayX;
    }
    if (this.isLoopVertical()) {
        this._displayY = y.mod(this.height());
        this._parallaxY = y;
    } else {
        var endY = this.height() - this.screenTileY();
        this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
        this._parallaxY = this._displayY;
    }

    this._parallax1Y = this._parallaxY;
    this._parallax0Y = this._parallaxY;
    this._parallax1X = this._parallaxX;
    this._parallax0X = this._parallaxX;

};



/**远景图ox*/
Game_Map.prototype.parallaxOx = function() {
    //如果(远景图0视差)
    if (this._parallaxZero) {
        //返回 远景图x * 图块宽()
        return this._parallaxX * this.tileWidth();
        //否则 如果 ( 远景图循环x )
    } else if (this._parallaxLoopX) {
        //返回 远景图x * 图块宽() / 2 
        return this._parallaxX * this.tileWidth() / 2;
        //否则 
    } else {
        //返回 0 
        return 0;
    }
};

/**远景图oy*/
Game_Map.prototype.parallaxOy = function() {
    //如果(远景图0视差)
    if (this._parallaxZero) {
        //返回 远景图y * 图块高()
        return this._parallaxY * this.tileHeight();
        //否则 如果 ( 远景图循环y )
    } else if (this._parallaxLoopY) {
        //返回 远景图y * 图块高() / 2 
        return this._parallaxY * this.tileHeight() / 2;
        //否则 
    } else {
        //返回 0 
        return 0;
    }
};




/**滚动向下*/
Game_Map.prototype.scrollDown = function(distance) {
    //如果( 是纵向循环() )
    if (this.isLoopVertical()) {
        //显示y += 距离
        this._displayY += distance;
        //显示y %= 数据地图 高
        this._displayY %= $dataMap.height;
        //如果(远景图循环y )
        if (this._parallaxLoopY) {
            //远景图y += 距离
            this._parallaxY += distance;
        }
        this._parallaxs1Y += distance
    } else if (this.height() >= this.screenTileY()) {
        var lastY = this._displayY;
        this._displayY = Math.min(this._displayY + distance,
            this.height() - this.screenTileY());
        this._parallaxY += this._displayY - lastY;


        this._parallaxs1Y += this._displayY - lastY
        this._parallaxs0Y += this._displayY - lastY;
    }
};




/**滚动向左*/
Game_Map.prototype.scrollLeft = function(distance) {
    if (this.isLoopHorizontal()) {
        this._displayX += $dataMap.width - distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX -= distance;
        }
        this._parallax1X -= distance;

    } else if (this.width() >= this.screenTileX()) {
        var lastX = this._displayX;
        this._displayX = Math.max(this._displayX - distance, 0);
        this._parallaxX += this._displayX - lastX;

        this._parallax1X += this._displayX - lastX;;
        this._parallax0X += this._displayX - lastX;;

    }
};
/**滚动向右*/
Game_Map.prototype.scrollRight = function(distance) {
    if (this.isLoopHorizontal()) {
        this._displayX += distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX += distance;
        }
        this._parallax1X += distance;

    } else if (this.width() >= this.screenTileX()) {
        var lastX = this._displayX;
        this._displayX = Math.min(this._displayX + distance,
            this.width() - this.screenTileX());
        this._parallaxX += this._displayX - lastX;

        this._parallax1X += this._displayX - lastX;;
        this._parallax0X += this._displayX - lastX;;

    }
};
/**滚动向上*/
Game_Map.prototype.scrollUp = function(distance) {
    //如果( 是纵向循环() )
    if (this.isLoopVertical()) {
        this._displayY += $dataMap.height - distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY -= distance;
        }

        this._parallax1Y -= distance;

    } else if (this.height() >= this.screenTileY()) {
        var lastY = this._displayY;
        this._displayY = Math.max(this._displayY - distance, 0);
        this._parallaxY += this._displayY - lastY;

        this._parallax1Y += this._displayY - lastY;
        this._parallax0Y += this._displayY - lastY;

    }
};



var Spriteset_Map_prototype_createLowerLayer = Spriteset_Map.prototype.createLowerLayer
Spriteset_Map.prototype.createLowerLayer = function() {
    Spriteset_Map_prototype_createLowerLayer.call(this);
    this.createParallaxs();
};


var Spriteset_Map_prototype_update = Spriteset_Map.prototype.update

Spriteset_Map.prototype.update = function() {
    Spriteset_Map_prototype_update.call(this);
    this.updateParallaxs();
};

Spriteset_Map.prototype.createParallaxs = function() {
    this._parallaxs = {}
    $gameMap.allParallaxsUpdate()
};


/**创建远景图 */
Spriteset_Map.prototype.createParallaxsIndex = function(index, parallaxName, zIndex) {
    var parallax = new TilingSprite();
    parallax.bitmap = ImageManager.loadParallax(parallaxName);
    parallax.move(0, 0, Graphics.width, Graphics.height);
    parallax._parallaxName = parallaxName
    parallax._zIndex = zIndex
    this._parallaxs[index] = parallax
    this.addParallaxsIndex(index)
};

/**添加远景图 */
Spriteset_Map.prototype.addParallaxsIndex = function(index) {
    var parallax = this._parallaxs[index]
    if (parallax) {
        var c = this._baseSprite.children
        var l = c.length
        for (var i = 1; i < l; i++) {
            if (parallax._zIndex < (c[i]._zIndex || 0)) {
                break
            }
        }
        this._baseSprite.addChildAt(parallax, i)
    }
};

/**移除远景图 */
Spriteset_Map.prototype.removeParallaxsIndex = function(index) {
    var parallax = this._parallaxs[index]
    if (parallax) {
        this._baseSprite.removeChild(parallax)
    }
};


/**改变zindex */
Spriteset_Map.prototype.changeParallaxsZindexIndex = function(index) {
    this.removeParallaxsIndex(index)
    this.addParallaxsIndex(index)
};

Spriteset_Map.prototype.updateParallaxs = function() {
    if ($gameMap._parallaxsRe) {
        for (var index in this._parallaxs) {
            this.removeParallaxsIndex(index)
        }
        this._parallaxs = {}
        $gameMap._parallaxsRe = false
    }

    var update = $gameMap.getParallaxs()
    for (var index in update) {
        var parallax = update[index]
        var p = this._parallaxs[index]
        if (p) {
            this.updateParallaxsIndex(index, parallax._parallaxName, parallax._zIndex)
        } else {
            this.createParallaxsIndex(index, parallax._parallaxName, parallax._zIndex)
        }
        this.updateParallaxsOxOyIndex(index, parallax)
    }
};


Spriteset_Map.prototype.updateParallaxsIndex = function(index, parallaxName, zIndex) {
    var parallax = this._parallaxs[index]
    if (parallax._parallaxName !== parallaxName) {
        if (parallax.bitmap && Graphics.isWebGL() != true) {
            this.removeParallaxsIndex(index);
            this.createParallaxsIndex(index, parallaxName, zIndex)
            return
        } else {
            parallax._parallaxName = parallaxName
            parallax.bitmap = ImageManager.loadParallax(parallaxName);
        }
    }
    if (parallax._zIndex != zIndex) {
        parallax._zIndex = zIndex
        this.removeParallaxsIndex(index);
        this.addParallaxsIndex(index);
    }
}



Spriteset_Map.prototype.updateParallaxsOxOyIndex = function(index, parallax) {
    var p = this._parallaxs[index]
    p.origin.x = $gameMap.parallaxsOx(parallax);
    p.origin.y = $gameMap.parallaxsOy(parallax);
}