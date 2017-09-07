
/**-----------------------------------------------------------------------------*/
/** Game_Map*/
/** 游戏地图     $gameMap*/
/** The game object class for a map. It contains scrolling and passage*/
/** determination functions.*/
/** 一个地图的游戏对象类,它包含滚动和通行决定功能*/

function Game_Map() {
    this.initialize.apply(this, arguments);
}
/**初始化*/
Game_Map.prototype.initialize = function() {
	//事件解释器 = 新 游戏事件解释器()
    this._interpreter = new Game_Interpreter();
    //地图id = 0 
    this._mapId = 0;
    //图块设置id = 0
    this._tilesetId = 0;
    //事件组 = []
    this._events = [];
    //公共事件组 = []
    this._commonEvents = [];
    //交通工具组 = []
    this._vehicles = [];
    //显示x = 0
    this._displayX = 0;
    //显示y = 0 
    this._displayY = 0;
    //名称显示 = true 
    this._nameDisplay = true;
    //滚动方向 = 2
    this._scrollDirection = 2;
    //滚动剩余 = 0
    this._scrollRest = 0;
    //滚动速度 = 4
    this._scrollSpeed = 4;
    //远景图名称 = ""
    this._parallaxName = '';
    //远景图0视差 = false
    this._parallaxZero = false;
    //远景图循环x = false
    this._parallaxLoopX = false;
    //远景图循环y = false
    this._parallaxLoopY = false;
    //远景图开始x = 0
    this._parallaxSx = 0;
    //远景图开始y = 0
    this._parallaxSy = 0;
    //远景图x = 0
    this._parallaxX = 0;
    //远景图y = 0
    this._parallaxY = 0;
    //战斗背景1名称 = null
    this._battleback1Name = null;
    //战斗背景2名称 = null
    this._battleback2Name = null;
    //创造交通工具组()
    this.createVehicles();
};
/**安装*/
Game_Map.prototype.setup = function(mapId) {
    //如果(不是 数据地图)
    if (!$dataMap) {
        //抛出 新 错误('The map data is not available' // 地图数据不可用  )
        throw new Error('The map data is not available');
    }
    //地图id = mapId//地图id
    this._mapId = mapId;
    //图块设置id = 数据地图 图块设置id
    this._tilesetId = $dataMap.tilesetId;
    //显示x = 0
    this._displayX = 0;
    //显示y = 0 
    this._displayY = 0;
    //刷新交通工具组()
    this.refereshVehicles();
    //安装事件组()
    this.setupEvents();
    //安装滚动()
    this.setupScroll();
    //安装远景图()
    this.setupParallax();
    //安装战斗背景()
    this.setupBattleback();
    //需要刷新 = false
    this._needsRefresh = false;
};
/**是事件运转*/
Game_Map.prototype.isEventRunning = function() {
    //返回 事件解释器 是运转() 或者 是任何事件开始()
    return this._interpreter.isRunning() || this.isAnyEventStarting();
};
/**图块宽*/
Game_Map.prototype.tileWidth = function() {
    //返回 48
    return 48;
};
/**图块高*/
Game_Map.prototype.tileHeight = function() {
    //返回 48
    return 48;
};
/**地图id*/
Game_Map.prototype.mapId = function() {
    //返回 地图id
    return this._mapId;
};
/**图块设置id*/
Game_Map.prototype.tilesetId = function() {
    //返回 图块设置id
    return this._tilesetId;
};
/**显示x*/
Game_Map.prototype.displayX = function() {
    //返回 显示x
    return this._displayX;
};
/**显示y*/
Game_Map.prototype.displayY = function() {
    //返回 显示y
    return this._displayY;
};
/**远景图名称*/
Game_Map.prototype.parallaxName = function() {
    //返回 远景图名称
    return this._parallaxName;
};
/**战斗背景1名称*/
Game_Map.prototype.battleback1Name = function() {
    //返回 战斗背景1名称
    return this._battleback1Name;
};
/**战斗背景2名称*/
Game_Map.prototype.battleback2Name = function() {
    //返回 战斗背景2名称
    return this._battleback2Name;
};
/**请求刷新*/
Game_Map.prototype.requestRefresh = function(mapId) {
    //需要刷新 = true 
    this._needsRefresh = true;
};
/**是名称显示允许*/
Game_Map.prototype.isNameDisplayEnabled = function() {
    //返回 名称显示
    return this._nameDisplay;
};
/**禁止名称显示*/
Game_Map.prototype.disableNameDisplay = function() {
    //名称显示 = false
    this._nameDisplay = false;
};
/**能够名称显示*/
Game_Map.prototype.enableNameDisplay = function() {
    //名称显示 = true
    this._nameDisplay = true;
};
/**创造交通工具组*/
Game_Map.prototype.createVehicles = function() {
    //交通工具组 = []
    this._vehicles = [];
    //交通工具组[0] = 新 游戏交通工具("boat"//小船)
    this._vehicles[0] = new Game_Vehicle('boat');
    //交通工具组[1] = 新 游戏交通工具("ship"//帆船)
    this._vehicles[1] = new Game_Vehicle('ship');
    //交通工具组[2] = 新 游戏交通工具("airship"//天空船)
    this._vehicles[2] = new Game_Vehicle('airship');
};
/**刷新交通工具组*/
Game_Map.prototype.refereshVehicles = function() {
    //交通工具组 对每一个 方法(交通工具)
    this._vehicles.forEach(function(vehicle) {
        //交通工具 刷新()
        vehicle.refresh();
    });
};
/**交通工具组*/
Game_Map.prototype.vehicles = function() {
    //返回 交通工具组
    return this._vehicles;
};
/**交通工具*/
Game_Map.prototype.vehicle = function(type) {
    //如果(种类 === 0 或者 种类 === "boat"//小船 )
    if (type ===  0 || type === 'boat') {
        //返回 小船()
        return this.boat();
    //否则 如果(种类 === 1 或者 种类 === "ship"//帆船 )
    } else if (type ===  1 || type === 'ship') {
        //返回 帆船()
        return this.ship();
    //否则 如果(种类 === 2 或者 种类 === "airship"//天空船 )
    } else if (type ===  2 || type === 'airship') {
        //返回 天空船()
        return this.airship();
    //否则
    } else {
        //返回 null
        return null;
    }
};
/**小船*/
Game_Map.prototype.boat = function() {
    //返回 交通工具组[0]
    return this._vehicles[0];
};
/**帆船*/
Game_Map.prototype.ship = function() {
    //返回 交通工具组[1]
    return this._vehicles[1];
};
/**天空船*/
Game_Map.prototype.airship = function() {
    //返回 交通工具组[2]
    return this._vehicles[2];
};
/**安装事件组*/
Game_Map.prototype.setupEvents = function() {
    //事件组 = []
    this._events = [];
    //循环 (开始时 i = 0 ;当 i < 数据地图 事件组 长度 ; 每一次 i++)
    for (var i = 0; i < $dataMap.events.length; i++) {
        //如果(数据地图 事件组[i])
        if ($dataMap.events[i]) {
            //事件组[i] = 新 游戏事件(地图id , i)
            this._events[i] = new Game_Event(this._mapId, i);
        }
    }
    //公共事件组 = 并行公共事件组() 映射 方法 (公共事件)
    this._commonEvents = this.parallelCommonEvents().map(function(commonEvent) {
        //返回 新 游戏公共事件(公共事件 id)
        return new Game_CommonEvent(commonEvent.id);
    });
    //刷新图块事件()
    this.refreshTileEvents();
};
/**事件组*/
Game_Map.prototype.events = function() {
    //返回 事件组 过滤 方法(事件)
    return this._events.filter(function(event) {
        //返回 !!事件
        return !!event;
    });
};
/**事件*/
Game_Map.prototype.event = function(eventId) {
    //返回 事件组[事件id]
    return this._events[eventId];
};
/**抹去事件*/
Game_Map.prototype.eraseEvent = function(eventId) {
    //事件组[事件id] 抹去()
    this._events[eventId].erase();
};
/**并行公共事件组*/
Game_Map.prototype.parallelCommonEvents = function() {
    //返回 数据公共事件组 过滤 方法(公共事件)
    return $dataCommonEvents.filter(function(commonEvent) {
        //返回 公共事件 并且 公共事件 触发 === 2 
        return commonEvent && commonEvent.trigger === 2;
    });
};
/**安装滚动*/
Game_Map.prototype.setupScroll = function() {
    //滚动方向 = 2
    this._scrollDirection = 2;
    //滚动剩余 = 0
    this._scrollRest = 0;
    //滚动速度 = 4
    this._scrollSpeed = 4;
};
/**安装远景图*/
Game_Map.prototype.setupParallax = function() {
    //远景图名称 = 数据地图 远景图名称 或者 ""
    this._parallaxName = $dataMap.parallaxName || '';
    //远景图0视差 = 图像管理器 是0视差(远景图名称)
    this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
    //远景图循环x = 数据地图 远景图循环x
    this._parallaxLoopX = $dataMap.parallaxLoopX;
    //远景图循环y = 数据地图 远景图循环y
    this._parallaxLoopY = $dataMap.parallaxLoopY;
    //远景图开始x = 数据地图 远景图开始x
    this._parallaxSx = $dataMap.parallaxSx;
    //远景图开始y = 数据地图 远景图开始y
    this._parallaxSy = $dataMap.parallaxSy;
    //远景图x = 0
    this._parallaxX = 0;
    //远景图y = 0
    this._parallaxY = 0;
};
/**安装战斗背景*/
Game_Map.prototype.setupBattleback = function() {
    //如果(数据地图 指定战斗背景)
    if ($dataMap.specifyBattleback) {
        //战斗背景1名称 = 数据地图 战斗背景1名称
        this._battleback1Name = $dataMap.battleback1Name;
        //战斗背景2名称 = 数据地图 战斗背景2名称
        this._battleback2Name = $dataMap.battleback2Name;
    //否则
    } else {
        //战斗背景1名称 = null
        this._battleback1Name = null;
        //战斗背景2名称 = null
        this._battleback2Name = null;
    }
};
/**设置显示位置*/
Game_Map.prototype.setDisplayPos = function(x, y) {
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
/**图块设置*/
Game_Map.prototype.tileset = function() {
    //返回 数据图块设置[图块设置id]
    return $dataTilesets[this._tilesetId];
};
/**图块设置标志组*/
Game_Map.prototype.tilesetFlags = function() {
    //图块设置 = 图块设置()
    var tileset = this.tileset();
    //如果(图块设置)
    if (tileset) {
        //返回 图块设置 标志组
        return tileset.flags;
    //否则 
    } else {
        //返回 []
        return [];
    }
};
/**显示名称*/
Game_Map.prototype.displayName = function() {
    //返回 数据地图 显示名称
    return $dataMap.displayName;
};
/**宽*/
Game_Map.prototype.width = function() {
    //返回 数据地图 宽
    return $dataMap.width;
};
/**高*/
Game_Map.prototype.height = function() {
    //返回 数据地图 高
    return $dataMap.height;
};
/**数据*/
Game_Map.prototype.data = function() {
    //返回 数据地图 数据
    return $dataMap.data;
};
/**是横向循环*/
Game_Map.prototype.isLoopHorizontal = function() {
    //返回 数据地图 滚动种类 === 2 或者 数据地图 滚动种类 === 3 
    return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
};
/**是纵向循环*/
Game_Map.prototype.isLoopVertical = function() {
    //返回 数据地图 滚动种类 === 1 或者 数据地图 滚动种类 === 3 
    return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
};
/**是奔跑禁止*/
Game_Map.prototype.isDashDisabled = function() {
    //返回 数据地图 禁止奔跑
    return $dataMap.disableDashing;
};
/**遭遇表*/
Game_Map.prototype.encounterList = function() {
    //返回 数据地图 遭遇表
    return $dataMap.encounterList;
};
/**遭遇步数*/
Game_Map.prototype.encounterStep = function() {
    //返回 数据地图 遭遇步数
    return $dataMap.encounterStep;
};
/**是大地图*/
Game_Map.prototype.isOverworld = function() {
    //返回 图块设置() 并且 图块设置() 模式 === 0 
    return this.tileset() && this.tileset().mode === 0;
};
/**画面显示图块x*/
Game_Map.prototype.screenTileX = function() {
    //返回 图形 宽 / 图块宽()
    return Graphics.width / this.tileWidth();
};
/**画面显示图块y*/
Game_Map.prototype.screenTileY = function() {
    //返回 图形 高 / 图块高()
    return Graphics.height / this.tileHeight();
};
/**校正x(显示区域的x)*/
Game_Map.prototype.adjustX = function(x) {
	//如果( 是横向循环() 并且 x < 显示x - ( ( 宽() - 画面显示图块x() ) / 2 )      )
    if (this.isLoopHorizontal() && x < this._displayX -
            (this.width() - this.screenTileX()) / 2) {
	    //返回 x - 显示x + 数据地图 宽
        return x - this._displayX + $dataMap.width;
    //否则
    } else {
	    //返回 x - 显示x  
        return x - this._displayX;
    }
};
/**校正y(显示区域的y)*/
Game_Map.prototype.adjustY = function(y) {
	//如果( 是纵向循环() 并且 y < 显示y - ( ( 高() - 画面显示图块y() ) / 2  )    )
    if (this.isLoopVertical() && y < this._displayY -
            (this.height() - this.screenTileY()) / 2) {
	    //返回 y - 显示y + 数据地图 高
        return y - this._displayY + $dataMap.height;
    //否则
    } else {
	    //返回 y - 显示y  
        return y - this._displayY;
    }
};
/**环x*/
Game_Map.prototype.roundX = function(x) {
    //返回  是横向循环() ? x 求余数( 宽() ) : x 
    return this.isLoopHorizontal() ? x.mod(this.width()) : x;
};
/**环y*/
Game_Map.prototype.roundY = function(y) {
    //返回  是纵向循环() ? y 求余数( 高() ) : y 
    return this.isLoopVertical() ? y.mod(this.height()) : y;
};
/**x和方向*/
Game_Map.prototype.xWithDirection = function(x, d) {
    //返回 x + (  d === 6 ? 1 : d === 4 ? -1 : 0) 
    return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
};
/**y和方向*/
Game_Map.prototype.yWithDirection = function(y, d) {
    //返回 y + (  d === 2 ? 1 : d === 8 ? -1 : 0) 
    return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
};
/**环x和方向*/
Game_Map.prototype.roundXWithDirection = function(x, d) {
    //返回 环x() + (  d === 6 ? 1 : d === 4 ? -1 : 0) 
    return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
};
/**环y和方向*/
Game_Map.prototype.roundYWithDirection = function(y, d) {
    //返回 环y() + (  d === 2 ? 1 : d === 8 ? -1 : 0) 
    return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
};
/**三角x*/
Game_Map.prototype.deltaX = function(x1, x2) {
    //结果 = x1 - x2 
    var result = x1 - x2;
    //如果( 是横向循环() 并且 数学 绝对值(结果) > 宽() / 2  )
    if (this.isLoopHorizontal() && Math.abs(result) > this.width() / 2) {
        //如果(结果 < 0 )
        if (result < 0) {
            //结果 += 宽()
            result += this.width();
        //否则
        } else {
            //结果 -= 宽()
            result -= this.width();
        }
    }
    //返回 结果
    return result;
};
/**三角y*/
Game_Map.prototype.deltaY = function(y1, y2) {
    //结果 = y1 - y2 
    var result = y1 - y2;
    //如果( 是纵向循环() 并且 数学 绝对值(结果) > 高() / 2  )
    if (this.isLoopVertical() && Math.abs(result) > this.height() / 2) {
        //如果(结果 < 0 )
        if (result < 0) {
            //结果 += 高()
            result += this.height();
        //否则
        } else {
            //结果 -= 高()
            result -= this.height();
        }
    }
    //返回 结果
    return result;
};
/**距离*/
Game_Map.prototype.distance = function(x1, y1, x2, y2) {
    //返回 数学 绝对值( 三角x(x1,x2) ) + 数学 绝对值( 三角y(y1,y2) )
    return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
};
/**画布到地图x*/
Game_Map.prototype.canvasToMapX = function(x) {
    //图块宽 = 图块宽()
    var tileWidth = this.tileWidth();
    //原点x = 显示x * 图块宽
    var originX = this._displayX * tileWidth;
    //地图x = 数学 向下取整( (原点x + x) / 图块宽 ) 
    var mapX = Math.floor((originX + x) / tileWidth);
    //返回 环x(地图x)
    return this.roundX(mapX);
};
/**画布到地图y*/
Game_Map.prototype.canvasToMapY = function(y) {
    //图块高 = 图块高()
    var tileHeight = this.tileHeight();
    //原点y = 显示y * 图块高
    var originY = this._displayY * tileHeight;
    //地图y = 数学 向下取整( (原点y + y) / 图块高 ) 
    var mapY = Math.floor((originY + y) / tileHeight);
    //返回 环y(地图y)
    return this.roundY(mapY);
};
/**自动播放*/
Game_Map.prototype.autoplay = function() {
    //如果(数据地图 自动播放bgm)
    if ($dataMap.autoplayBgm) {
        //音频管理器 播放bgm(数据地图 bgm)
        AudioManager.playBgm($dataMap.bgm);
    }
    //如果(数据地图 自动播放bgs)
    if ($dataMap.autoplayBgs) {
        //音频管理器 播放bgs(数据地图 bgs)
        AudioManager.playBgs($dataMap.bgs);
    }
};
/**刷新如果需要*/
Game_Map.prototype.refreshIfNeeded = function() {
    //如果(需要刷新 )
    if (this._needsRefresh) {
        //刷新()
        this.refresh();
    }
};
/**刷新*/
Game_Map.prototype.refresh = function() {
    //事件组() 对每一个 方法(事件)
    this.events().forEach(function(event) {
        //事件 刷新()
        event.refresh();
    });
    //公共事件组() 对每一个 方法(事件)
    this._commonEvents.forEach(function(event) {
        //事件 刷新()
        event.refresh();
    });
    //刷新图块事件组()
    this.refreshTileEvents();
    //需要刷新 = false
    this._needsRefresh = false;
};
/**刷新图块事件组*/
Game_Map.prototype.refreshTileEvents = function() {
    //图块事件组 = 事件组() 过滤 方法(事件)
    this.tileEvents = this.events().filter(function(event) {
        //返回 事件 是图块()
        return event.isTile();
    });
};
/**事件组xy*/
Game_Map.prototype.eventsXy = function(x, y) {
    //返回 事件组 过滤 方法(事件)
    return this.events().filter(function(event) {
        //返回 事件 位于(x,y)
        return event.pos(x, y);
    });
};
/**事件组xy无穿越*/
Game_Map.prototype.eventsXyNt = function(x, y) {
    //返回 事件组 过滤 方法(事件)
    return this.events().filter(function(event) {
        //返回 事件 位于无穿越(x,y)
        return event.posNt(x, y);
    });
};
/**图块事件组xy*/
Game_Map.prototype.tileEventsXy = function(x, y) {
    //返回 图块事件组 过滤 方法(事件)
    return this.tileEvents.filter(function(event) {
        //返回 事件 位于无穿越(x,y)
        return event.posNt(x, y);
    });
};
/**事件idxy*/
Game_Map.prototype.eventIdXy = function(x, y) {
    //列表 = 事件组xy(x,y)
    var list = this.eventsXy(x, y);
    //返回 列表 长度 ===  0 ? 0 : 列表[0] 事件id
    return list.length === 0 ? 0 : list[0].eventId();
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
};
/**滚动向左*/
Game_Map.prototype.scrollLeft = function(distance) {
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
};
/**滚动向右*/
Game_Map.prototype.scrollRight = function(distance) {
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
};
/**滚动向上*/
Game_Map.prototype.scrollUp = function(distance) {
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
};
/**是有效的*/
Game_Map.prototype.isValid = function(x, y) {
    //返回 x >= 0 并且 x < 宽() 并且 y >= 0  并且 y < 高() 
    return x >= 0 && x < this.width() && y >= 0 && y < this.height();
};
/**检查通道*/
Game_Map.prototype.checkPassage = function(x, y, bit) {
	//标志组 = 图块设置标志组()
    var flags = this.tilesetFlags();
    //图块组 = 所有图块组(x,y)
    var tiles = this.allTiles(x, y);
    //循环 开始时 i=0 ; 当 i < 图块组 长度 ; 每一次 i++
    for (var i = 0; i < tiles.length; i++) {
	    //标志  = 标志组 [ 图块组[i]]
        var flag = flags[tiles[i]];
        //如果 ( 标志 & 0x10//10000  !=== 0 ) //不影响通行
        if ((flag & 0x10) !== 0)  // [*] No effect on passage'
        	//下一个
            continue;
        //如果(  (标志 & 比特) === 0 )//通过
        if ((flag & bit) === 0)   // [o] Passable
        	//返回 true
            return true;
        //如果(  (标志 & 比特) === 比特 )//不能通过
        if ((flag & bit) === bit) // [x] Impassable
        	//返回 false
            return false;
    }
    //返回 false
    return false;
};
/**图块id*/
Game_Map.prototype.tileId = function(x, y, z) {
    //宽 = 数据地图 宽
    var width = $dataMap.width;
    //高 = 数据地图 高
    var height = $dataMap.height;
    //返回 游戏地图 数据[ ( z * 高 + y )  * 宽 + x ] || 0
    return $dataMap.data[(z * height + y) * width + x] || 0;
};
/**层图块组*/
Game_Map.prototype.layeredTiles = function(x, y) {
    //图块组 = []
    var tiles = [];
    //循环 (开始时 i = 0 ; 当 i <  4 ;每一次 i++)
    for (var i = 0; i < 4; i++) {
        //图块组 添加( 图块id( x,y,3-i )  )
        tiles.push(this.tileId(x, y, 3 - i));
    }
    //返回 图块组 
    return tiles;
};
/**所有图块组*/
Game_Map.prototype.allTiles = function(x, y) {
    //图块组 = 图块事件组xy ( x,y) 映射 ( 事件 )
    var tiles = this.tileEventsXy(x, y).map(function(event) {
        //返回 事件 图块id
        return event.tileId();
    });
    //返回 图块组 连接( 层图块组(x,y) )
    return tiles.concat(this.layeredTiles(x, y));
};
/**自动图块种类*/
Game_Map.prototype.autotileType = function(x, y, z) {
    //图块id = 图块id(x,y,z)
    var tileId = this.tileId(x, y, z);
    //返回 图块id >= 2048 ?  数学 向下取整( (图块id-2048)/48 ) : -1 
    return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
};
/**是可通行的*/
Game_Map.prototype.isPassable = function(x, y, d) {
	//返回 检查通道(x,y, ( 1<<(d/2-1)) //2的(d/2-1)次方  & 0x0f //1111  )
    return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
};
/**是小船可通行的*/
Game_Map.prototype.isBoatPassable = function(x, y) {
	//返回 检查通道(x,y, 0x0200 //1000000000  )
    return this.checkPassage(x, y, 0x0200);
};
/**是帆船可通行的*/
Game_Map.prototype.isShipPassable = function(x, y) {
	//返回 检查通道(x,y, 0x0400 //10000000000  )
    return this.checkPassage(x, y, 0x0400);
};
/**是天空船陆地可以*/
Game_Map.prototype.isAirshipLandOk = function(x, y) {
	//返回 检查通道(x,y, 0x0800 //100000000000  ) 并且 检查通道(x, y,  0x0f //1111 )
    return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
};
/**检查层图块标志*/
Game_Map.prototype.checkLayeredTilesFlags = function(x, y, bit) {
    //标志组 = 图块设置标志组()
    var flags = this.tilesetFlags();
    //返回 层图块组(x,y) 一些 (图块id)
    return this.layeredTiles(x, y).some(function(tileId) {
        //返回 (标志组[图块id] & 比特) !== 0 
        return (flags[tileId] & bit) !== 0;
    });
};
/**是梯子*/
Game_Map.prototype.isLadder = function(x, y) {
    //返回 是有效的(x,y) 并且 检查层图块标志( x , y, 0x20)
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
};
/**是灌木丛*/
Game_Map.prototype.isBush = function(x, y) {
    //返回 是有效的(x,y) 并且 检查层图块标志( x , y, 0x40)
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
};
/**是柜台*/
Game_Map.prototype.isCounter = function(x, y) {
    //返回 是有效的(x,y) 并且 检查层图块标志( x , y, 0x80)
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
};
/**是伤害地形*/
Game_Map.prototype.isDamageFloor = function(x, y) {
    //返回 是有效的(x,y) 并且 检查层图块标志( x , y, 0x100)
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
};
/**地域标签*/
Game_Map.prototype.terrainTag = function(x, y) {
    //如果( 是有效的(x,y) )
    if (this.isValid(x, y)) {
    //标志组 = 图块设置标志组()
        var flags = this.tilesetFlags();
        //图块组 = 层图块组(x,y)
        var tiles = this.layeredTiles(x, y);
        //循环 (开始时 i = 0 ; 当 i < 图块组长度 ;每一次 i++)
        for (var i = 0; i < tiles.length; i++) {
            //标签 = 标志组[图块组[i] ] >> 12
            var tag = flags[tiles[i]] >> 12;
            //如果(标签 > 0 )
            if (tag > 0) {
                //返回 标签
                return tag;
            }
        }
    }
    return 0;
};
/**区域id*/
Game_Map.prototype.regionId = function(x, y) {
    //返回 是有效的(x,y) ?  图块id(x,y,5) : 0
    return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
};
/**开始滚动*/
Game_Map.prototype.startScroll = function(direction, distance, speed) {
    //滚动方向 = 方向
    this._scrollDirection = direction; 
    //滚动剩余 = 剩余
    this._scrollRest = distance;
    //滚动速度 = 速度
    this._scrollSpeed = speed;
};
/**是滚动中*/
Game_Map.prototype.isScrolling = function() {
    //返回 滚动剩余 > 0 
    return this._scrollRest > 0;
};
/**更新*/
Game_Map.prototype.update = function(sceneActive) {
    //刷新如果需要()
    this.refreshIfNeeded();
    //如果 ( 场景活动 )
    if (sceneActive) {
        //更新事件解释器()
        this.updateInterpreter();
    }
    //更新滚动()
    this.updateScroll();
    //更新事件组()
    this.updateEvents();
    //更新交通工具组()
    this.updateVehicles();
    //更新远景图()
    this.updateParallax();
};
/**更新滚动*/
Game_Map.prototype.updateScroll = function() {
    //如果( 是滚动中() )
    if (this.isScrolling()) {
        //最后x = 显示x
        var lastX = this._displayX;
        //最后y = 显示y
        var lastY = this._displayY;
        //做滚动(滚动方向 , 滚动距离 )
        this.doScroll(this._scrollDirection, this.scrollDistance());
        //如果 ( 显示x == 最后x 并且 显示y === 最后y )
        if (this._displayX === lastX && this._displayY === lastY) {
            //滚动剩余 = 0 
            this._scrollRest = 0;
        //否则
        } else {
            //滚动剩余 -= 滚动距离
            this._scrollRest -= this.scrollDistance();
        }
    }
};
/**滚动距离*/
Game_Map.prototype.scrollDistance = function() {
    //返回 数学 幂(2 , 滚动速度 ) / 256
    return Math.pow(2, this._scrollSpeed) / 256;
};
/**做滚动*/
Game_Map.prototype.doScroll = function(direction, distance) {
    //检查 (方向)
    switch (direction) {
    //当 2 : 
    case 2:
        //滚动向下(距离)
        this.scrollDown(distance);
        //中断
        break;
    case 4:
        //滚动向左(距离)
        this.scrollLeft(distance);
        //中断
        break;
    case 6:
        //滚动向右(距离)
        this.scrollRight(distance);
        //中断
        break;
    case 8:
        //滚动向上(距离)
        this.scrollUp(distance);
        //中断
        break;
    }
};
/**更新事件组*/
Game_Map.prototype.updateEvents = function() {
    //事件组() 对每一个 (事件)
    this.events().forEach(function(event) {
        //事件 更新()
        event.update();
    });
    //公共事件组() 对每一个 (事件)
    this._commonEvents.forEach(function(event) {
        //事件 更新()
        event.update();
    });
};
/**更新交通工具组*/
Game_Map.prototype.updateVehicles = function() {
    //交通工具 对每一个 (交通工具)
    this._vehicles.forEach(function(vehicle) {
        //交通工具 更新()
        vehicle.update();
    });
};
/**更新远景图*/
Game_Map.prototype.updateParallax = function() {
    //如果 ( 远景图循环x )
    if (this._parallaxLoopX) {
        //远景图x += 远景图开始x / 图块宽() / 2
        this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
    }
    //如果 ( 远景图循环y )
    if (this._parallaxLoopY) {
        //远景图y += 远景图开始y / 图块高() / 2
        this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
    }
};
/**改变图块设置*/
Game_Map.prototype.changeTileset = function(tilesetId) {
    //图块设置id = 图块设置id
    this._tilesetId = tilesetId;
    //刷新
    this.refresh();
};
/**改变战斗背景*/
Game_Map.prototype.changeBattleback = function(battleback1Name, battleback2Name) {
    //战斗背景1名称 = 战斗背景1名称
    this._battleback1Name = battleback1Name;
    //战斗背景2名称 = 战斗背景2名称
    this._battleback2Name = battleback2Name;
};
/**改变远景图*/
Game_Map.prototype.changeParallax = function(name, loopX, loopY, sx, sy) {
    //远景图名称 = 名称
    this._parallaxName = name;
    //远景图0视差 = 图像管理器 是0视差 ( 远景图名称 )
    this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
    //如果(远景图循环x 并且 不是 循环x )
    if (this._parallaxLoopX && !loopX) {
        //远景图x = 0 
        this._parallaxX = 0;
    }
    //如果(远景图循环y 并且 不是 循环y )
    if (this._parallaxLoopY && !loopY) {
        //远景图y = 0 
        this._parallaxY = 0;
    }
    //远景图循环x = 循环x 
    this._parallaxLoopX = loopX;
    //远景图循环y = 循环y 
    this._parallaxLoopY = loopY;
    //远景图开始x = 开始x
    this._parallaxSx = sx;
    //远景图开始y = 开始y
    this._parallaxSy = sy;
};
/**更新事件解释器*/
Game_Map.prototype.updateInterpreter = function() {
    //循环(;;)
    for (;;) {
                
        /** 2w: 
         * 
         * 当事件解释器 不运转时
         *     list没有时,或者 终止时(命令没有了时)  
         * 可以运行下面的 
         * 
         * 当运转时,跳出循环
         * 
         */

        //事件解释器 更新()
        this._interpreter.update();
        //如果( 事件解释器 是运转() )
        if (this._interpreter.isRunning()) {
            //返回
            return;
        }

        //如果( 事件解释器 事件id() > 0 )
        if (this._interpreter.eventId() > 0) {
            //解锁事件( 事件解释器 事件id() )
            this.unlockEvent(this._interpreter.eventId());
            //事件解释器 清除()
            this._interpreter.clear();
        }


        /** 2w: 
         * 
         * 如果没有安装了事件,退出循环
         * 如果安装了事件,继续循环 
         * 
         */

        //如果(不是 安装开始事件() )
        if (!this.setupStartingEvent()) {
            //返回 
            return;
        }

    }
};
/**解锁事件*/
Game_Map.prototype.unlockEvent = function(eventId) {
    //如果( 事件组[事件id] )
    if (this._events[eventId]) {
        //如果( 事件组[事件id] 解锁() )
        this._events[eventId].unlock();
    }
};
/**安装开始事件*/
Game_Map.prototype.setupStartingEvent = function() {
    //刷新如果需要()
    this.refreshIfNeeded();
    //如果( 事件解释器 安装储存公共事件() )
    if (this._interpreter.setupReservedCommonEvent()) {
        //返回 true 
        return true;
    }
    //如果( 安装测试事件() )
    if (this.setupTestEvent()) {
        //返回 true 
        return true;
    }
    //如果( 安装开始地图事件() )
    if (this.setupStartingMapEvent()) {
        //返回 true 
        return true;
    }
    //如果( 安装自动公共事件() )
    if (this.setupAutorunCommonEvent()) {
        //返回 true 
        return true;
    }
    //返回 false 
    return false;
};
/**安装测试事件*/
Game_Map.prototype.setupTestEvent = function() {
    //如果( 测试事件)
    if ($testEvent) {
        //事件解释器 安装 (测试事件 , 0)
        this._interpreter.setup($testEvent, 0);
        //测试事件 = null 
        $testEvent = null;
        //返回 true 
        return true;
    }
    //返回 false 
    return false;
};
/**安装开始地图事件*/
Game_Map.prototype.setupStartingMapEvent = function() {
    //事件组 = 事件组()
    var events = this.events();
    //循环 (开始时 i = 0 ; 当 i < 事件组 长度 ;每次 i++ )
    for (var i = 0; i < events.length; i++) {
        //事件 = 事件组[i]
        var event = events[i];
        //如果(事件 是开始中() )
        if (event.isStarting()) {
            //事件 清除开始标志()
            event.clearStartingFlag();
            //事件解释器 安装 (事件 列表 , 事件 事件id)
            this._interpreter.setup(event.list(), event.eventId());
            //返回 true 
            return true;
        }
    }
    //返回 false 
    return false;
};
/**安装自动公共事件*/
Game_Map.prototype.setupAutorunCommonEvent = function() {
    //循环 (开始时 i = 0 ; 当 i < 数据公共事件组 长度 ;每次 i++ )
    for (var i = 0; i < $dataCommonEvents.length; i++) {
        //事件 = 数据公共事件组[i]
        var event = $dataCommonEvents[i];
        //如果( 事件 并且 事件 触发 === 1 并且 游戏开关组 值(事件 开关id) )
        if (event && event.trigger === 1 && $gameSwitches.value(event.switchId)) {
            //事件解释器 安装 (事件 列表)
            this._interpreter.setup(event.list);
            //返回 true 
            return true;
        }
    }
    //返回 false 
    return false;
};
/**是任何事件开始*/
Game_Map.prototype.isAnyEventStarting = function() {
    //返回 事件组() 一些 (事件)
    return this.events().some(function(event) {
        //返回 事件 是开始中()
        return event.isStarting();
    });
};
