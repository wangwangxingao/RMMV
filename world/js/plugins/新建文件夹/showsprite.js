












Spriteset_Map.prototype.createCharacters = function () {
    this._characterSprites = [];
    $gameMap.vehicles().forEach(function (vehicle) {
        this.addCharacters(vehicle);
    }, this);
    $gamePlayer.followers().reverseEach(function (follower) {
        this.addCharacters(follower);
    }, this);
    this.addCharacters($gamePlayer);
};

Spriteset_Map.prototype.addCharacters = function (character) {
    var s = new Sprite_Character(character)
    this._characterSprites.push(s);
    this._tilemap.addChild(s);
};

Spriteset_Map.prototype.delCharacters = function (character) {
    var z = 0
    for (var i = 0; i < this._characterSprites.length; i++) {
        var s = this._characterSprites[i]
        if (s._character == character) {
            z = 1
            break
        }
    }
    if (z) {
        this._tilemap.removeChild(s);
        this._characterSprites.splice(i, 1)
    }
};


Game_Map.prototype.setup0 = Game_Map.prototype.setup
Game_Map.prototype.setup = function (mapId) {

    this._ldx = Infinity
    this._ldy = Infinity
    this._hashevent = {}
    this._change = [[], []]

    var gw = Graphics.width;
    var gh = Graphics.height;
    var tw = this.tileWidth();
    var th = this.tileHeight();
    this._gtx = gw / tw
    this._gty = gh / th

    this.setup0(mapId)
};

Game_Map.prototype.setDisplayPos = function (x, y) {
    //如果( 是横向循环() )
    if (this.isLoopHorizontal()) {
        //显示x = x 求余数( 宽() )
        this._displayX = x.mod(this.width());
        //远景图x = x
        this._parallaxX = x;
        //否则
    } else {
        //结束x = 宽() - 画面显示图块x()
        var endX = this.width() - this.screenTileX();
        //显示x = 结束x < 0 ? 结束x / 2 : x 在之间(0,结束x)
        this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
        //远景图x = 显示x 
        this._parallaxX = this._displayX;
    }
    //如果( 是纵向循环() )
    if (this.isLoopVertical()) {
        //显示y = y 求余数( 高() )
        this._displayY = y.mod(this.height());
        //远景图y = y
        this._parallaxY = y;
    } else {
        //结束y = 高() - 画面显示图块y()
        var endY = this.height() - this.screenTileY();
        //显示y = 结束x < 0 ? 结束y / 2 : y 在之间(0,结束y)
        this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
        //远景图y = 显示x 
        this._parallaxY = this._displayY;
    }
    this.t()
};

Game_Event.prototype.setPosition = function (x, y) {
    Game_Character.prototype.setPosition.call(this, x, y)
    $gameMap.r(this)
};
Spriteset_Map.prototype.updateTilemap = function () {
    this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
    this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    $gameMap._change && $gameMap._change[2] && this.updatechange()
};

Spriteset_Map.prototype.updatechange = function () {
    var c = $gameMap._change
    var l = c[0]
    var t = this
    l.forEach(function (e) {
        t.delCharacters(e)
    })
    var l = c[1]
    l.forEach(function (e) {
        t.addCharacters(e)
    })
    $gameMap._change = [[], []]
};

Game_Map.prototype.t = function () {
    var cx = this._displayX - this._ldx
    var cy = this._displayY - this._ldy
    var gw = this._gtx
    var gh = this._gty
    var c = 1
    if (Math.abs(cx) > gw) {
        this._ldx = this._displayX
        c = 0
    }
    if (Math.abs(cy) > gh) {
        this._ldy = this._displayY
        c = 0
    }
    if (c) { return }

    this.events().forEach(function (event) {
        this.r(event)
    }, this);
}

/**滚动向下*/
Game_Map.prototype.r = function (event) {

    var upchild = this._hashevent
    var change = this._change
    var i = event.eventId()
    var x = event.scrolledX()
    var y = event.scrolledY()
    var gw = this._gtx
    var gh = this._gty

    var gw1 = gw * 1.5
    var gw2 = gw1 + gw
    var gh1 = gh * 1.5
    var gh2 = gh1 + gh

    var px = y
    var py = y
    var z2 = (px >= -gw2 && px <= gw2 && py >= -gh2 && py <= gh2) ? 1 : 0

    var z1 = z2 ? (px >= -gw1 && px <= gw1 && py >= -gh1 && py <= gh1) ? 1 : 0 : 0

    if (z1 && !upchild[i]) {
        upchild[i] = 1
        change[1].push(event)
        change[2] = 1
    }
    if (!z2 && upchild[i]) {
        upchild[i] = 0
        change[0].push(event)
        change[2] = 1
    }

};
/**滚动向下*/
Game_Map.prototype.scrollDown = function (distance) {
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
        //否则 如果( 高 >= 画面显示图块y() )
    } else if (this.height() >= this.screenTileY()) {
        //最后y = 显示y
        var lastY = this._displayY;
        //显示y = 数学 最小值(显示y + 距离 , 高() - 画面显示图块y() )
        this._displayY = Math.min(this._displayY + distance,
            this.height() - this.screenTileY());
        //远景图y += 显示y - 最后y
        this._parallaxY += this._displayY - lastY;
    }
    this.t()
};
/**滚动向左*/
Game_Map.prototype.scrollLeft = function (distance) {
    //如果( 是横向循环() )
    if (this.isLoopHorizontal()) {
        //显示x += 数据地图 宽 - 距离
        this._displayX += $dataMap.width - distance;
        //显示x %= 数据地图 宽
        this._displayX %= $dataMap.width;
        //如果 ( 远景图循环x )
        if (this._parallaxLoopX) {
            //远景图x -= 距离
            this._parallaxX -= distance;
        }
        //否则 如果( 宽() >= 画面显示图块x() )
    } else if (this.width() >= this.screenTileX()) {
        //最后x = 显示x 
        var lastX = this._displayX;
        //显示x = 数学 最大值(显示x - 方向 ,  0 )
        this._displayX = Math.max(this._displayX - distance, 0);
        //远景图x += 显示x - 最后x
        this._parallaxX += this._displayX - lastX;
    }
    this.t()
};
/**滚动向右*/
Game_Map.prototype.scrollRight = function (distance) {
    //如果( 是横向循环() )
    if (this.isLoopHorizontal()) {
        //显示x += 数据地图 宽 + 距离
        this._displayX += distance;
        //显示x %= 数据地图 宽
        this._displayX %= $dataMap.width;
        //如果 ( 远景图循环x )
        if (this._parallaxLoopX) {
            //远景图x += 距离
            this._parallaxX += distance;
        }
        //否则 如果( 宽() >= 画面显示图块x() )
    } else if (this.width() >= this.screenTileX()) {
        //最后x = 显示x 
        var lastX = this._displayX;
        //显示x = 数学 最小值(显示x + 方向 ,  宽() - 画面显示图块x() )
        this._displayX = Math.min(this._displayX + distance,
            this.width() - this.screenTileX());
        //远景图x += 显示x - 最后x
        this._parallaxX += this._displayX - lastX;
    }
    this.t()
};
/**滚动向上*/
Game_Map.prototype.scrollUp = function (distance) {
    //如果( 是纵向循环() )
    if (this.isLoopVertical()) {
        //显示y += 数据地图 高 -  距离
        this._displayY += $dataMap.height - distance;
        //显示y %= 数据地图 高  
        this._displayY %= $dataMap.height;
        //如果(远景图循环y )
        if (this._parallaxLoopY) {
            //远景图y -= 距离
            this._parallaxY -= distance;
        }
        //否则 如果( 高 >= 画面显示图块y() )
    } else if (this.height() >= this.screenTileY()) {
        //最后y = 显示y
        var lastY = this._displayY;
        //显示y = 数学 最大值(显示y - 距离 , 0 )
        this._displayY = Math.max(this._displayY - distance, 0);
        //远景图y += 显示y - 最后y
        this._parallaxY += this._displayY - lastY;
    }
    this.t()
};

