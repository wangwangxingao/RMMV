
//-----------------------------------------------------------------------------
// Game_Vehicle
// 交通工具的游戏对象
// The game object class for a vehicle.

function Game_Vehicle() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Game_Vehicle.prototype = Object.create(Game_Character.prototype);
//设置创造者
Game_Vehicle.prototype.constructor = Game_Vehicle;
//初始化
Game_Vehicle.prototype.initialize = function(type) {
    //游戏人物 初始化 呼叫(this)
    Game_Character.prototype.initialize.call(this);
    //种类 = 种类
    this._type = type;
    //重新设定方向()
    this.resetDirection();
    //初始化移动速度()
    this.initMoveSpeed();
    //读取系统设定()
    this.loadSystemSettings();
};
//初始化成员
Game_Vehicle.prototype.initMembers = function() {
    //游戏人物 初始化成员 呼叫(this)
    Game_Character.prototype.initMembers.call(this);
    //种类 = ""
    this._type = '';
    //地图id = 0
    this._mapId = 0;
    //高度 = 0
    this._altitude = 0;
    //驾驶中 = false
    this._driving = false;
    //bgm = null
    this._bgm = null;
};
//是小船
Game_Vehicle.prototype.isBoat = function() {
    //返回 种类 == "boat" //小船
    return this._type === 'boat';
};
//是帆船
Game_Vehicle.prototype.isShip = function() {
    //返回 种类 == "ship" //帆船
    return this._type === 'ship';
};
//是天空船
Game_Vehicle.prototype.isAirship = function() {
    //返回 种类 = "airship" //天空船
    return this._type === 'airship';
};
//重新设定方向
Game_Vehicle.prototype.resetDirection = function() {
    //设置方向(4)
    this.setDirection(4);
};
//初始化移动速度
Game_Vehicle.prototype.initMoveSpeed = function() {
    //如果( 是小船() )
    if (this.isBoat()) {
        //设置移动速度(4)
        this.setMoveSpeed(4);
    //否则 如果( 是帆船() )
    } else if (this.isShip()) {
        //设置移动速度(5)
        this.setMoveSpeed(5);
    //否则 如果( 是天空船() )
    } else if (this.isAirship()) {
        //设置移动速度(6)
        this.setMoveSpeed(6);
    }
};
//交通工具
Game_Vehicle.prototype.vehicle = function() {
    //如果( 是小船() )
    if (this.isBoat()) {
        //返回 数据系统 小船 
        return $dataSystem.boat;
    //否则 如果( 是帆船() )
    } else if (this.isShip()) {
        //返回 数据系统 帆船 
        return $dataSystem.ship;
    //否则 如果( 是天空船() )
    } else if (this.isAirship()) {
        //返回 数据系统 天空船
        return $dataSystem.airship;
    //否则
    } else {
        //返回 null
        return null;
    }
};
//读取系统设定
Game_Vehicle.prototype.loadSystemSettings = function() {
    //交通工具 = 交通工具()
    var vehicle = this.vehicle();
    //地图id = 交通工具 开始地图id
    this._mapId = vehicle.startMapId;
    //设置位置 (交通工具 开始x ,交通工具 开始y)
    this.setPosition(vehicle.startX, vehicle.startY);
    //设置图像(交通工具 行走图名称 , 交通工具 行走图索引)
    this.setImage(vehicle.characterName, vehicle.characterIndex);
};
//刷新
Game_Vehicle.prototype.refresh = function() {
    //如果(驾驶中)
    if (this._driving) {
        //地图id = 游戏地图 地图id()
        this._mapId = $gameMap.mapId();
        //同步的和游戏者()
        this.syncWithPlayer();
    //否则 如果( 地图id === 游戏地图 地图id() )
    } else if (this._mapId === $gameMap.mapId()) {
        //设于(x,y)
        this.locate(this.x, this.y);
    }
    //如果(是天空船())
    if (this.isAirship()) {
        //设置优先级(驾驶中 ?返回 2 否则 返回 0)
        this.setPriorityType(this._driving ? 2 : 0);
    //否则 
    } else {
        //设置优先级(1)
        this.setPriorityType(1);
    }
    //设置行走动画(驾驶中)
    this.setWalkAnime(this._driving);
    //设置踏步动画(驾驶中)
    this.setStepAnime(this._driving);
    //设置透明度(地图id !== 游戏地图 地图id() )
    this.setTransparent(this._mapId !== $gameMap.mapId());
};
//设置位置
Game_Vehicle.prototype.setLocation = function(mapId, x, y) {
    //地图id = 地图id
    this._mapId = mapId;
    //设置位置(x,y)
    this.setPosition(x, y);
    //刷新()
    this.refresh();
};
//位于
Game_Vehicle.prototype.pos = function(x, y) {
    //如果(地图id == 游戏地图 地图id() )
    if (this._mapId === $gameMap.mapId()) {
        //返回 游戏人物 位于(this,x,y)
        return Game_Character.prototype.pos.call(this, x, y);
    //否则
    } else {
        //返回 false
        return false;
    }
};
//是地图可通行
Game_Vehicle.prototype.isMapPassable = function(x, y, d) {
    //x2 = 游戏地图 环x和方向(x,d)
    var x2 = $gameMap.roundXWithDirection(x, d);
    //y2 = 游戏地图 环y和方向(y,d)
    var y2 = $gameMap.roundYWithDirection(y, d);
    //如果( 是小船() )
    if (this.isBoat()) {
        //返回 游戏地图 是小船可通行的(x2,y2)
        return $gameMap.isBoatPassable(x2, y2);
    //否则 如果( 是帆船() )
    } else if (this.isShip()) {
        //返回 游戏地图 是帆船可通行的(x2,y2)
        return $gameMap.isShipPassable(x2, y2);
    //否则 如果( 是天空船() )
    } else if (this.isAirship()) {
        //返回 true
        return true;
    //否则
    } else {
        //返回 false
        return false;
    }
};
//上
Game_Vehicle.prototype.getOn = function() {
    //驾驶中 = true 
    this._driving = true;
    //设置行走动画(true)
    this.setWalkAnime(true);
    //设置踏步动画(true)
    this.setStepAnime(true);
    //游戏系统 保存行走bgm()
    $gameSystem.saveWalkingBgm();
    //播放bgm()
    this.playBgm();
};
//下
Game_Vehicle.prototype.getOff = function() {
    //驾驶中 = false 
    this._driving = false;
    //设置行走动画(false)
    this.setWalkAnime(false);
    //设置踏步动画(false)
    this.setStepAnime(false);
    //重新设定方向()
    this.resetDirection();
    //游戏系统 重播行走bgm()
    $gameSystem.replayWalkingBgm();
};
//设置bgm
Game_Vehicle.prototype.setBgm = function(bgm) {
    //bgm = bgm
    this._bgm = bgm;
};
//演奏bgm
Game_Vehicle.prototype.playBgm = function() {
    //声音管理器 播放bgm(bgm 或者 交通工具() bgm)
    AudioManager.playBgm(this._bgm || this.vehicle().bgm);
};
//同步的和游戏者
Game_Vehicle.prototype.syncWithPlayer = function() {
    //复制位置(游戏游戏者)
    this.copyPosition($gamePlayer);
    //刷新灌木丛深度()
    this.refreshBushDepth();
};
//画面y
Game_Vehicle.prototype.screenY = function() {
    //返回 游戏人物 画面y 呼叫(this)  - 高度
    return Game_Character.prototype.screenY.call(this) - this._altitude;
};
//阴影x
Game_Vehicle.prototype.shadowX = function() {
    //返回 画面x()
    return this.screenX();
};
//阴影y
Game_Vehicle.prototype.shadowY = function() {
    //返回 画面y() + 高度
    return this.screenY() + this._altitude;
};
//阴影不透明
Game_Vehicle.prototype.shadowOpacity = function() {
    //返回 255 * 高度 / 最大高度()
    return 255 * this._altitude / this.maxAltitude();
};
//能移动
Game_Vehicle.prototype.canMove = function() {
    //如果(是天空船() )
    if (this.isAirship()) {
        //返回 是高水平()
        return this.isHighest();
    //否则
    } else {
        //返回 true
        return true;
    }
};
//更新
Game_Vehicle.prototype.update = function() {
    //游戏人物 更新 呼叫(this)
    Game_Character.prototype.update.call(this);
    //如果(是天空船() )
    if (this.isAirship()) {
        //更新天空船
        this.updateAirship();
    }
};
//更新天空船
Game_Vehicle.prototype.updateAirship = function() {
    //更新天空船高度() 
    this.updateAirshipAltitude();
    //设置踏步动画( 是高水平() )
    this.setStepAnime(this.isHighest());
    //设置优先级(是低水平() 返回 0 否则 返回 2)
    this.setPriorityType(this.isLowest() ? 0 : 2);
};
//更新天空船高度
Game_Vehicle.prototype.updateAirshipAltitude = function() {
    //如果(驾驶中 并且 不是 是高水平() )
    if (this._driving && !this.isHighest()) {
        //高度++
        this._altitude++;
    }
    //如果(不是 驾驶中 并且 不是 是低水平() )
    if (!this._driving && !this.isLowest()) {
        //高度--
        this._altitude--;
    }
};
//最大高度
Game_Vehicle.prototype.maxAltitude = function() {
    //返回 48
    return 48;
};
//是低水平
Game_Vehicle.prototype.isLowest = function() {
    //返回 高度 <= 0
    return this._altitude <= 0;
};
//是高水平
Game_Vehicle.prototype.isHighest = function() {
    //返回 高度 >= 最大高度()
    return this._altitude >= this.maxAltitude();
};
//是起飞确定
Game_Vehicle.prototype.isTakeoffOk = function() {
    //返回 游戏游戏者 是从者组集合后()
    return $gamePlayer.areFollowersGathered();
};
//是陆地确定
Game_Vehicle.prototype.isLandOk = function(x, y, d) {
    //如果( 是天空船() )
    if (this.isAirship()) {
        //如果(不是 游戏地图 是天空船陆地可以(x,y) )
        if (!$gameMap.isAirshipLandOk(x, y)) {
            //返回 false
            return false;
        }
        //如果(游戏地图 事件组xy(x,y) 长度 > 0)
        if ($gameMap.eventsXy(x, y).length > 0) {
            //返回 false
            return false;
        }
    //否则 
    } else {
        //x2 = 游戏地图 环x和方向(x , 方向 )
        var x2 = $gameMap.roundXWithDirection(x, d);
        //y2 = 游戏地图 环y和方向(y , 方向 )
        var y2 = $gameMap.roundYWithDirection(y, d);
        //如果(不是 游戏地图 是有效(x2 ,y2) )
        if (!$gameMap.isValid(x2, y2)) {
            //返回 false
            return false;
        }
        //如果(不是 游戏地图 是通过(x2,y2,相反方向(d) ))
        if (!$gameMap.isPassable(x2, y2, this.reverseDir(d))) {
            //返回 false
            return false;
        }
        //如果(是和人物碰撞(x2,y2) )
        if (this.isCollidedWithCharacters(x2, y2)) {
            //返回 false
            return false;
        }
    }
    //返回 true
    return true;
};
