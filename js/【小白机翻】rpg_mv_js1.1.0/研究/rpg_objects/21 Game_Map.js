
//-----------------------------------------------------------------------------
// Game_Map
// 游戏地图     $gameMap
// The game object class for a map. It contains scrolling and passage
// determination functions.
// 一个地图的游戏对象类,它包含滚动和通行决定功能

function Game_Map() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_Map.prototype.initialize = function() {
    this._interpreter = new Game_Interpreter();
    this._mapId = 0;
    this._tilesetId = 0;
    this._events = [];
    this._commonEvents = [];
    this._vehicles = [];
    //显示x
    this._displayX = 0;
    //显示y
    this._displayY = 0;
    //名称显示
    this._nameDisplay = true;
    //滚动方向
    this._scrollDirection = 2;
    this._scrollRest = 0;
    this._scrollSpeed = 4;
    //远景图名称
    this._parallaxName = '';
    this._parallaxZero = false;
    this._parallaxLoopX = false;
    this._parallaxLoopY = false;
    this._parallaxSx = 0;
    this._parallaxSy = 0;
    this._parallaxX = 0;
    this._parallaxY = 0;
    this._battleback1Name = null;
    this._battleback2Name = null;
    this.createVehicles();
};
//安装
Game_Map.prototype.setup = function(mapId) {
    if (!$dataMap) {
        throw new Error('The map data is not available');
    }
    this._mapId = mapId;
    this._tilesetId = $dataMap.tilesetId;
    this._displayX = 0;
    this._displayY = 0;
    this.refereshVehicles();
    this.setupEvents();
    this.setupScroll();
    this.setupParallax();
    this.setupBattleback();
    this._needsRefresh = false;
};
//是事件转动
Game_Map.prototype.isEventRunning = function() {
    return this._interpreter.isRunning() || this.isAnyEventStarting();
};
//图块宽
Game_Map.prototype.tileWidth = function() {
    return 48;
};
//图块高
Game_Map.prototype.tileHeight = function() {
    return 48;
};
//地图id
Game_Map.prototype.mapId = function() {
    return this._mapId;
};
//图块组id
Game_Map.prototype.tilesetId = function() {
    return this._tilesetId;
};
//显示x
Game_Map.prototype.displayX = function() {
    return this._displayX;
};
//显示y
Game_Map.prototype.displayY = function() {
    return this._displayY;
};
//远景图名称
Game_Map.prototype.parallaxName = function() {
    return this._parallaxName;
};
//战斗背景名称
Game_Map.prototype.battleback1Name = function() {
    return this._battleback1Name;
};
//战斗背景2名称
Game_Map.prototype.battleback2Name = function() {
    return this._battleback2Name;
};
//请求刷新
Game_Map.prototype.requestRefresh = function(mapId) {
    this._needsRefresh = true;
};
//是名称显示允许
Game_Map.prototype.isNameDisplayEnabled = function() {
    return this._nameDisplay;
};
//禁止名称显示
Game_Map.prototype.disableNameDisplay = function() {
    this._nameDisplay = false;
};
//能够名称显示
Game_Map.prototype.enableNameDisplay = function() {
    this._nameDisplay = true;
};
//创造交通工具们
Game_Map.prototype.createVehicles = function() {
    this._vehicles = [];
    this._vehicles[0] = new Game_Vehicle('boat');
    this._vehicles[1] = new Game_Vehicle('ship');
    this._vehicles[2] = new Game_Vehicle('airship');
};
//刷新交通工具们
Game_Map.prototype.refereshVehicles = function() {
    this._vehicles.forEach(function(vehicle) {
        vehicle.refresh();
    });
};
//交通工具们
Game_Map.prototype.vehicles = function() {
    return this._vehicles;
};
//交通工具
Game_Map.prototype.vehicle = function(type) {
    if (type ===  0 || type === 'boat') {
        return this.boat();
    } else if (type ===  1 || type === 'ship') {
        return this.ship();
    } else if (type ===  2 || type === 'airship') {
        return this.airship();
    } else {
        return null;
    }
};
//小船
Game_Map.prototype.boat = function() {
    return this._vehicles[0];
};
//帆船
Game_Map.prototype.ship = function() {
    return this._vehicles[1];
};
//天空船
Game_Map.prototype.airship = function() {
    return this._vehicles[2];
};
//安装事件们
Game_Map.prototype.setupEvents = function() {
    this._events = [];
    for (var i = 0; i < $dataMap.events.length; i++) {
        if ($dataMap.events[i]) {
            this._events[i] = new Game_Event(this._mapId, i);
        }
    }
    this._commonEvents = this.parallelCommonEvents().map(function(commonEvent) {
        return new Game_CommonEvent(commonEvent.id);
    });
    this.refreshTileEvents();
};
//事件们
Game_Map.prototype.events = function() {
    return this._events.filter(function(event) {
        return !!event;
    });
};
//事件
Game_Map.prototype.event = function(eventId) {
    return this._events[eventId];
};
//抹去事件
Game_Map.prototype.eraseEvent = function(eventId) {
    this._events[eventId].erase();
};
//并行公共事件
Game_Map.prototype.parallelCommonEvents = function() {
    return $dataCommonEvents.filter(function(commonEvent) {
        return commonEvent && commonEvent.trigger === 2;
    });
};
//设置滚动
Game_Map.prototype.setupScroll = function() {
    this._scrollDirection = 2;
    this._scrollRest = 0;
    this._scrollSpeed = 4;
};
//设置远景图
Game_Map.prototype.setupParallax = function() {
    this._parallaxName = $dataMap.parallaxName || '';
    this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
    this._parallaxLoopX = $dataMap.parallaxLoopX;
    this._parallaxLoopY = $dataMap.parallaxLoopY;
    this._parallaxSx = $dataMap.parallaxSx;
    this._parallaxSy = $dataMap.parallaxSy;
    this._parallaxX = 0;
    this._parallaxY = 0;
};
//设置战斗背景
Game_Map.prototype.setupBattleback = function() {
    if ($dataMap.specifyBattleback) {
        this._battleback1Name = $dataMap.battleback1Name;
        this._battleback2Name = $dataMap.battleback2Name;
    } else {
        this._battleback1Name = null;
        this._battleback2Name = null;
    }
};
//设置显示位置
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
};
//远景图ox
Game_Map.prototype.parallaxOx = function() {
    if (this._parallaxZero) {
        return this._parallaxX * this.tileWidth();
    } else if (this._parallaxLoopX) {
        return this._parallaxX * this.tileWidth() / 2;
    } else {
        return 0;
    }
};
//远景图oy
Game_Map.prototype.parallaxOy = function() {
    if (this._parallaxZero) {
        return this._parallaxY * this.tileHeight();
    } else if (this._parallaxLoopY) {
        return this._parallaxY * this.tileHeight() / 2;
    } else {
        return 0;
    }
};
//图块组
Game_Map.prototype.tileset = function() {
    return $dataTilesets[this._tilesetId];
};
//图块标志
Game_Map.prototype.tilesetFlags = function() {
    var tileset = this.tileset();
    if (tileset) {
        return tileset.flags;
    } else {
        return [];
    }
};
//显示名称
Game_Map.prototype.displayName = function() {
    return $dataMap.displayName;
};
//宽
Game_Map.prototype.width = function() {
    return $dataMap.width;
};
//高
Game_Map.prototype.height = function() {
    return $dataMap.height;
};
//数据
Game_Map.prototype.data = function() {
    return $dataMap.data;
};
//是横向循环
Game_Map.prototype.isLoopHorizontal = function() {
    return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
};
//是纵向循环
Game_Map.prototype.isLoopVertical = function() {
    return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
};
//是奔跑无效
Game_Map.prototype.isDashDisabled = function() {
    return $dataMap.disableDashing;
};
//遭遇表
Game_Map.prototype.encounterList = function() {
    return $dataMap.encounterList;
};
//遭遇步数
Game_Map.prototype.encounterStep = function() {
    return $dataMap.encounterStep;
};
//是大地图
Game_Map.prototype.isOverworld = function() {
    return this.tileset() && this.tileset().mode === 0;
};
//画面显示图块x
Game_Map.prototype.screenTileX = function() {
    return Graphics.width / this.tileWidth();
};
//画面显示图块y
Game_Map.prototype.screenTileY = function() {
    return Graphics.height / this.tileHeight();
};
//校正x(显示区域的x)
Game_Map.prototype.adjustX = function(x) {
    if (this.isLoopHorizontal() && x < this._displayX -
            (this.width() - this.screenTileX()) / 2) {
        return x - this._displayX + $dataMap.width;
    } else {
        return x - this._displayX;
    }
};
//校正y (显示区域的y)
Game_Map.prototype.adjustY = function(y) {
    if (this.isLoopVertical() && y < this._displayY -
            (this.height() - this.screenTileY()) / 2) {
        return y - this._displayY + $dataMap.height;
    } else {
        return y - this._displayY;
    }
};
//环x
Game_Map.prototype.roundX = function(x) {
    return this.isLoopHorizontal() ? x.mod(this.width()) : x;
};
//环y
Game_Map.prototype.roundY = function(y) {
    return this.isLoopVertical() ? y.mod(this.height()) : y;
};
//x和方向
Game_Map.prototype.xWithDirection = function(x, d) {
    return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
};
//y和方向
Game_Map.prototype.yWithDirection = function(y, d) {
    return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
};
//环x和方向
Game_Map.prototype.roundXWithDirection = function(x, d) {
    return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
};
//环x和方向
Game_Map.prototype.roundYWithDirection = function(y, d) {
    return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
};
//差距x
Game_Map.prototype.deltaX = function(x1, x2) {
    var result = x1 - x2;
    if (this.isLoopHorizontal() && Math.abs(result) > this.width() / 2) {
        if (result < 0) {
            result += this.width();
        } else {
            result -= this.width();
        }
    }
    return result;
};
//差距y
Game_Map.prototype.deltaY = function(y1, y2) {
    var result = y1 - y2;
    if (this.isLoopVertical() && Math.abs(result) > this.height() / 2) {
        if (result < 0) {
            result += this.height();
        } else {
            result -= this.height();
        }
    }
    return result;
};
//距离
Game_Map.prototype.distance = function(x1, y1, x2, y2) {
    return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
};
//画布到map x
Game_Map.prototype.canvasToMapX = function(x) {
    var tileWidth = this.tileWidth();
    var originX = this._displayX * tileWidth;
    var mapX = Math.floor((originX + x) / tileWidth);
    return this.roundX(mapX);
};
//画布到map y
Game_Map.prototype.canvasToMapY = function(y) {
    var tileHeight = this.tileHeight();
    var originY = this._displayY * tileHeight;
    var mapY = Math.floor((originY + y) / tileHeight);
    return this.roundY(mapY);
};
//自动播放
Game_Map.prototype.autoplay = function() {
    if ($dataMap.autoplayBgm) {
        AudioManager.playBgm($dataMap.bgm);
    }
    if ($dataMap.autoplayBgs) {
        AudioManager.playBgs($dataMap.bgs);
    }
};
//刷新如果需要
Game_Map.prototype.refreshIfNeeded = function() {
    if (this._needsRefresh) {
        this.refresh();
    }
};
//刷新
Game_Map.prototype.refresh = function() {
    this.events().forEach(function(event) {
        event.refresh();
    });
    this._commonEvents.forEach(function(event) {
        event.refresh();
    });
    this.refreshTileEvents();
    this._needsRefresh = false;
};
//刷新图块事件
Game_Map.prototype.refreshTileEvents = function() {
    this.tileEvents = this.events().filter(function(event) {
        return event.isTile();
    });
};
//x y 处事件
Game_Map.prototype.eventsXy = function(x, y) {
    return this.events().filter(function(event) {
        return event.pos(x, y);
    });
};
//x y 处事件(不能穿越)
Game_Map.prototype.eventsXyNt = function(x, y) {
    return this.events().filter(function(event) {
        return event.posNt(x, y);
    });
};
//x y 处图块事件(不能穿越)
Game_Map.prototype.tileEventsXy = function(x, y) {
    return this.tileEvents.filter(function(event) {
        return event.posNt(x, y);
    });
};
//x y处事件id
Game_Map.prototype.eventIdXy = function(x, y) {
    var list = this.eventsXy(x, y);
    return list.length === 0 ? 0 : list[0].eventId();
};
//滚动向下
Game_Map.prototype.scrollDown = function(distance) {
    if (this.isLoopVertical()) {
        this._displayY += distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY += distance;
        }
    } else if (this.height() >= this.screenTileY()) {
        var lastY = this._displayY;
        this._displayY = Math.min(this._displayY + distance,
            this.height() - this.screenTileY());
        this._parallaxY += this._displayY - lastY;
    }
};
//滚动向左
Game_Map.prototype.scrollLeft = function(distance) {
    if (this.isLoopHorizontal()) {
        this._displayX += $dataMap.width - distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX -= distance;
        }
    } else if (this.width() >= this.screenTileX()) {
        var lastX = this._displayX;
        this._displayX = Math.max(this._displayX - distance, 0);
        this._parallaxX += this._displayX - lastX;
    }
};
//滚动向右
Game_Map.prototype.scrollRight = function(distance) {
    if (this.isLoopHorizontal()) {
        this._displayX += distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX += distance;
        }
    } else if (this.width() >= this.screenTileX()) {
        var lastX = this._displayX;
        this._displayX = Math.min(this._displayX + distance,
            this.width() - this.screenTileX());
        this._parallaxX += this._displayX - lastX;
    }
};
//滚动向上
Game_Map.prototype.scrollUp = function(distance) {
    if (this.isLoopVertical()) {
        this._displayY += $dataMap.height - distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY -= distance;
        }
    } else if (this.height() >= this.screenTileY()) {
        var lastY = this._displayY;
        this._displayY = Math.max(this._displayY - distance, 0);
        this._parallaxY += this._displayY - lastY;
    }
};
//是有效的
Game_Map.prototype.isValid = function(x, y) {
    return x >= 0 && x < this.width() && y >= 0 && y < this.height();
};
//检查通道
Game_Map.prototype.checkPassage = function(x, y, bit) {
    var flags = this.tilesetFlags();
    var tiles = this.allTiles(x, y);
    for (var i = 0; i < tiles.length; i++) {
        var flag = flags[tiles[i]];
        if ((flag & 0x10) !== 0)  // [*] No effect on passage
            continue;
        if ((flag & bit) === 0)   // [o] Passable
            return true;
        if ((flag & bit) === bit) // [x] Impassable
            return false;
    }
    return false;
};
//图块id
Game_Map.prototype.tileId = function(x, y, z) {
    var width = $dataMap.width;
    var height = $dataMap.height;
    return $dataMap.data[(z * height + y) * width + x] || 0;
};
//层图块
Game_Map.prototype.layeredTiles = function(x, y) {
    var tiles = [];
    for (var i = 0; i < 4; i++) {
        tiles.push(this.tileId(x, y, 3 - i));
    }
    return tiles;
};
//所有图块
Game_Map.prototype.allTiles = function(x, y) {
    var tiles = this.tileEventsXy(x, y).map(function(event) {
        return event.tileId();
    });
    return tiles.concat(this.layeredTiles(x, y));
};
// 自动图块种类
Game_Map.prototype.autotileType = function(x, y, z) {
    var tileId = this.tileId(x, y, z);
    return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
};
//是可通行的
Game_Map.prototype.isPassable = function(x, y, d) {
    return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
};
//是小船可通行的
Game_Map.prototype.isBoatPassable = function(x, y) {
    return this.checkPassage(x, y, 0x0200);
};
//是帆船可通行的
Game_Map.prototype.isShipPassable = function(x, y) {
    return this.checkPassage(x, y, 0x0400);
};
//是天空船陆地可以
Game_Map.prototype.isAirshipLandOk = function(x, y) {
    return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
};
//检查层图块标志
Game_Map.prototype.checkLayeredTilesFlags = function(x, y, bit) {
    var flags = this.tilesetFlags();
    return this.layeredTiles(x, y).some(function(tileId) {
        return (flags[tileId] & bit) !== 0;
    });
};
//是梯子
Game_Map.prototype.isLadder = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
};
//是灌木丛
Game_Map.prototype.isBush = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
};
//是柜台
Game_Map.prototype.isCounter = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
};
//是伤害地形
Game_Map.prototype.isDamageFloor = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
};
//地域标签
Game_Map.prototype.terrainTag = function(x, y) {
    if (this.isValid(x, y)) {
        var flags = this.tilesetFlags();
        var tiles = this.layeredTiles(x, y);
        for (var i = 0; i < tiles.length; i++) {
            var tag = flags[tiles[i]] >> 12;
            if (tag > 0) {
                return tag;
            }
        }
    }
    return 0;
};
//区域id
Game_Map.prototype.regionId = function(x, y) {
    return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
};
//开始滚动
Game_Map.prototype.startScroll = function(direction, distance, speed) {
    this._scrollDirection = direction;
    this._scrollRest = distance;
    this._scrollSpeed = speed;
};
//是滚动中
Game_Map.prototype.isScrolling = function() {
    return this._scrollRest > 0;
};
//更新
Game_Map.prototype.update = function(sceneActive) {
    this.refreshIfNeeded();
    if (sceneActive) {
        this.updateInterpreter();
    }
    this.updateScroll();
    this.updateEvents();
    this.updateVehicles();
    this.updateParallax();
};
//更新滚动
Game_Map.prototype.updateScroll = function() {
    if (this.isScrolling()) {
        var lastX = this._displayX;
        var lastY = this._displayY;
        this.doScroll(this._scrollDirection, this.scrollDistance());
        if (this._displayX === lastX && this._displayY === lastY) {
            this._scrollRest = 0;
        } else {
            this._scrollRest -= this.scrollDistance();
        }
    }
};
//滚动距离
Game_Map.prototype.scrollDistance = function() {
    return Math.pow(2, this._scrollSpeed) / 256;
};
//做滚动
Game_Map.prototype.doScroll = function(direction, distance) {
    switch (direction) {
    case 2:
        this.scrollDown(distance);
        break;
    case 4:
        this.scrollLeft(distance);
        break;
    case 6:
        this.scrollRight(distance);
        break;
    case 8:
        this.scrollUp(distance);
        break;
    }
};
//更新事件
Game_Map.prototype.updateEvents = function() {
    this.events().forEach(function(event) {
        event.update();
    });
    this._commonEvents.forEach(function(event) {
        event.update();
    });
};
//更新交通工具
Game_Map.prototype.updateVehicles = function() {
    this._vehicles.forEach(function(vehicle) {
        vehicle.update();
    });
};
//更新远景图
Game_Map.prototype.updateParallax = function() {
    if (this._parallaxLoopX) {
        this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
    }
    if (this._parallaxLoopY) {
        this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
    }
};
//改变图块组id
Game_Map.prototype.changeTileset = function(tilesetId) {
    this._tilesetId = tilesetId;
    this.refresh();
};
//改变战斗背景
Game_Map.prototype.changeBattleback = function(battleback1Name, battleback2Name) {
    this._battleback1Name = battleback1Name;
    this._battleback2Name = battleback2Name;
};
//改变远景图
Game_Map.prototype.changeParallax = function(name, loopX, loopY, sx, sy) {
    this._parallaxName = name;
    this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
    if (this._parallaxLoopX && !loopX) {
        this._parallaxX = 0;
    }
    if (this._parallaxLoopY && !loopY) {
        this._parallaxY = 0;
    }
    this._parallaxLoopX = loopX;
    this._parallaxLoopY = loopY;
    this._parallaxSx = sx;
    this._parallaxSy = sy;
};
//更新事件解释器
Game_Map.prototype.updateInterpreter = function() {
    for (;;) {
        this._interpreter.update();
        if (this._interpreter.isRunning()) {
            return;
        }
        if (this._interpreter.eventId() > 0) {
            this.unlockEvent(this._interpreter.eventId());
            this._interpreter.clear();
        }
        if (!this.setupStartingEvent()) {
            return;
        }
    }
};
//开启事件
Game_Map.prototype.unlockEvent = function(eventId) {
    if (this._events[eventId]) {
        this._events[eventId].unlock();
    }
};
//安装开始事件
Game_Map.prototype.setupStartingEvent = function() {
    this.refreshIfNeeded();
    if (this._interpreter.setupReservedCommonEvent()) {
        return true;
    }
    if (this.setupTestEvent()) {
        return true;
    }
    if (this.setupStartingMapEvent()) {
        return true;
    }
    if (this.setupAutorunCommonEvent()) {
        return true;
    }
    return false;
};
//安装测试事件
Game_Map.prototype.setupTestEvent = function() {
    if ($testEvent) {
        this._interpreter.setup($testEvent, 0);
        $testEvent = null;
        return true;
    }
    return false;
};
//安装开始地图事件
Game_Map.prototype.setupStartingMapEvent = function() {
    var events = this.events();
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.isStarting()) {
            event.clearStartingFlag();
            this._interpreter.setup(event.list(), event.eventId());
            return true;
        }
    }
    return false;
};
//安装自动公共事件
Game_Map.prototype.setupAutorunCommonEvent = function() {
    for (var i = 0; i < $dataCommonEvents.length; i++) {
        var event = $dataCommonEvents[i];
        if (event && event.trigger === 1 && $gameSwitches.value(event.switchId)) {
            this._interpreter.setup(event.list);
            return true;
        }
    }
    return false;
};
//是任何事件开始
Game_Map.prototype.isAnyEventStarting = function() {
    return this.events().some(function(event) {
        return event.isStarting();
    });
};
