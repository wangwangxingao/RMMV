
//-----------------------------------------------------------------------------
// Game_Player
// 游戏游戏者     $gamePlayer
// The game object class for the player. It contains event starting
// determinants and map scrolling functions.
// 游戏者的游戏对象类.包含事件开始判定和地图滚动方法

function Game_Player() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Game_Player.prototype = Object.create(Game_Character.prototype);
//设置创造者
Game_Player.prototype.constructor = Game_Player;
//初始化
Game_Player.prototype.initialize = function() {
	//继承 游戏角色 初始化
    Game_Character.prototype.initialize.call(this);
    //设置透明(数据系统 开始透明)
    this.setTransparent($dataSystem.optTransparent);
};
//初始化成员
Game_Player.prototype.initMembers = function() {
	//继承 游戏角色 初始化成员
    Game_Character.prototype.initMembers.call(this);
    //交通工具种类 = "walk" //步行
    this._vehicleType = 'walk';
    //交通工具上中
    this._vehicleGettingOn = false;
    //交通工具下中
    this._vehicleGettingOff = false;
    //猛冲中 = false
    this._dashing = false;
    //需要地图重新载入 = false
    this._needsMapReload = false;
    //传送中 = false
    this._transferring = false;
    //新地图id = 0
    this._newMapId = 0;
    //新x = 0
    this._newX = 0;
    //新y = 0
    this._newY = 0;
    //新方向 = 0
    this._newDirection = 0;
    //淡入种类 = 0
    this._fadeType = 0;
    //从者组  = 新 游戏从者组
    this._followers = new Game_Followers();
    //遭遇计数 = 0
    this._encounterCount = 0;
};
//清除传送信息
Game_Player.prototype.clearTransferInfo = function() {
    //传送中 = false
    this._transferring = false;
    //新地图id = 0
    this._newMapId = 0;
    //新x = 0
    this._newX = 0;
    //新y = 0
    this._newY = 0;
    //新方向 = 0
    this._newDirection = 0;
};
//从者组
Game_Player.prototype.followers = function() {
    //返回 从者组
    return this._followers;
};
//刷新
Game_Player.prototype.refresh = function() {
	//角色 = 游戏队伍 领导者
    var actor = $gameParty.leader();
    //行走图名称 = 角色 如果 存在 返回 角色 行走图名称 否则 返回  ""
    var characterName = actor ? actor.characterName() : '';
    //行走图索引 = 角色 如果 存在 返回 角色 行走图索引 否则 返回  ""
    var characterIndex = actor ? actor.characterIndex() : 0;
    //设置图像(行走图名称,行走图索引)
    this.setImage(characterName, characterIndex);
    //随从组 刷新
    this._followers.refresh();
};
//是停止
Game_Player.prototype.isStopping = function() {
	//如果 交通工具上中 或者 交通工具下中
    if (this._vehicleGettingOn || this._vehicleGettingOff) {
	    //返回 false 
        return false;
    }
    //返回 继承 游戏角色 是停止
    return Game_Character.prototype.isStopping.call(this);
};
//储存传送
Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
	//传送中 = true
    this._transferring = true;
    //新地图id = mapId
    this._newMapId = mapId;
    //新x = x
    this._newX = x;
    //新y = y
    this._newY = y;
    //新方向 = d
    this._newDirection = d;
    //淡入种类 = fadeType
    this._fadeType = fadeType;
};
//请求地图重装
Game_Player.prototype.requestMapReload = function() {
	//需要地图重装 = true
    this._needsMapReload = true;
};
//是传送中
Game_Player.prototype.isTransferring = function() {
	//返回 传送中
    return this._transferring;
};
//新地图id
Game_Player.prototype.newMapId = function() {
	//返回 新地图id
    return this._newMapId;
};
//淡入种类
Game_Player.prototype.fadeType = function() {
	//返回 淡入种类
    return this._fadeType;
};
//表现传送
Game_Player.prototype.performTransfer = function() {
	//如果 是传送中
    if (this.isTransferring()) {
	    //设置方向(新方向)
        this.setDirection(this._newDirection);
        //如果( 新地图id !== 游戏地图 地图id) 或者  (需要地图重装 )
        if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
	        //游戏地图 安装 (新地图id)
            $gameMap.setup(this._newMapId);
            //需要地图重装 = false
            this._needsMapReload = false;
        }
        //位于 (新x,新y)
        this.locate(this._newX, this._newY);
        //刷新
        this.refresh();
        //清除传送信息
        this.clearTransferInfo();
    }
};
//是地图可通行
Game_Player.prototype.isMapPassable = function(x, y, d) {
	//交通工具 
    var vehicle = this.vehicle();
    //如果 交通工具
    if (vehicle) {
	    //返回 交通工具 是地图可通行(x,y,d)
        return vehicle.isMapPassable(x, y, d);
    } else {
	    //返回 继承 游戏角色 是地图可通行
        return Game_Character.prototype.isMapPassable.call(this, x, y, d);
    }
};
//交通工具
Game_Player.prototype.vehicle = function() {
	//返回 游戏地图 交通工具[交通工具种类]
    return $gameMap.vehicle(this._vehicleType);
};
//是在小船
Game_Player.prototype.isInBoat = function() {
	//返回 交通工具种类 === 'boat'  //小船
    return this._vehicleType === 'boat';
};
//是在帆船
Game_Player.prototype.isInShip = function() {
	//返回 交通工具种类 === 'ship'  //帆船
    return this._vehicleType === 'ship';
};
//是在天空船
Game_Player.prototype.isInAirship = function() {
	//返回 交通工具种类 === 'airship' //天空船
    return this._vehicleType === 'airship';
};
//是在交通工具
Game_Player.prototype.isInVehicle = function() {
	//返回 是在帆船 或者 是在帆船 或者 是在天空船
    return this.isInBoat() || this.isInShip() || this.isInAirship();
};
//是普通
Game_Player.prototype.isNormal = function() {
	//返回 交通工具种类 === 'walk'  并且  不是 是强制移动路线
    return this._vehicleType === 'walk' && !this.isMoveRouteForcing();
};
//是猛冲中
Game_Player.prototype.isDashing = function() {
	//返回 猛冲中
    return this._dashing;
};
//是除错通行
Game_Player.prototype.isDebugThrough = function() {
	//返回 输入 
    return Input.isPressed('control') && $gameTemp.isPlaytest();
};
//是碰撞
Game_Player.prototype.isCollided = function(x, y) {
    if (this.isThrough()) {
        return false;
    } else {
        return this.pos(x, y) || this._followers.isSomeoneCollided(x, y);
    }
};
//中心x
Game_Player.prototype.centerX = function() {
    return (Graphics.width / $gameMap.tileWidth() - 1) / 2.0;
};
//中心y
Game_Player.prototype.centerY = function() {
    return (Graphics.height / $gameMap.tileHeight() - 1) / 2.0;
};
//中心
Game_Player.prototype.center = function(x, y) {
    return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
};
//设于
Game_Player.prototype.locate = function(x, y) {
    Game_Character.prototype.locate.call(this, x, y);
    this.center(x, y);
    this.makeEncounterCount();
    if (this.isInVehicle()) {
        this.vehicle().refresh();
    }
    this._followers.synchronize(x, y, this.direction());
};
//增加步数
Game_Player.prototype.increaseSteps = function() {
    Game_Character.prototype.increaseSteps.call(this);
    if (this.isNormal()) {
        $gameParty.increaseSteps();
    }
};
//制作遭遇计数
Game_Player.prototype.makeEncounterCount = function() {
    var n = $gameMap.encounterStep();
    this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + 1;
};
//制作遭遇敌群id
Game_Player.prototype.makeEncounterTroopId = function() {
    var encounterList = [];
    var weightSum = 0;
    $gameMap.encounterList().forEach(function(encounter) {
        if (this.meetsEncounterConditions(encounter)) {
            encounterList.push(encounter);
            weightSum += encounter.weight;
        }
    }, this);
    if (weightSum > 0) {
        var value = Math.randomInt(weightSum);
        for (var i = 0; i < encounterList.length; i++) {
            value -= encounterList[i].weight;
            if (value < 0) {
                return encounterList[i].troopId;
            }
        }
    }
    return 0;
};
//满足条件
Game_Player.prototype.meetsEncounterConditions = function(encounter) {
    return (encounter.regionSet.length === 0 ||
            encounter.regionSet.contains(this.regionId()));
};
//执行遭遇
Game_Player.prototype.executeEncounter = function() {
    if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
        this.makeEncounterCount();
        var troopId = this.makeEncounterTroopId();
        if ($dataTroops[troopId]) {
            BattleManager.setup(troopId, true, false);
            BattleManager.onEncounter();
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
//开始地图事件
Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    if (!$gameMap.isEventRunning()) {
        $gameMap.eventsXy(x, y).forEach(function(event) {
            if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                event.start();
            }
        });
    }
};
//移动通过输入 
Game_Player.prototype.moveByInput = function() {
    if (!this.isMoving() && this.canMove()) {
        var direction = this.getInputDirection();
        if (direction > 0) {
            $gameTemp.clearDestination();
        } else if ($gameTemp.isDestinationValid()){
            var x = $gameTemp.destinationX();
            var y = $gameTemp.destinationY();
            direction = this.findDirectionTo(x, y);
        }
        if (direction > 0) {
            this.executeMove(direction);
        }
    }
};
//能移动
Game_Player.prototype.canMove = function() {
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
        return false;
    }
    if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
        return false;
    }
    if (this._vehicleGettingOn || this._vehicleGettingOff) {
        return false;
    }
    if (this.isInVehicle() && !this.vehicle().canMove()) {
        return false;
    }
    return true;
};
//获得输入方向
Game_Player.prototype.getInputDirection = function() {
    return Input.dir4;
};
//执行移动
Game_Player.prototype.executeMove = function(direction) {
    this.moveStraight(direction);
};
//更新
Game_Player.prototype.update = function(sceneActive) {
    var lastScrolledX = this.scrolledX();
    var lastScrolledY = this.scrolledY();
    var wasMoving = this.isMoving();
    this.updateDashing();
    if (sceneActive) {
        this.moveByInput();
    }
    Game_Character.prototype.update.call(this);
    this.updateScroll(lastScrolledX, lastScrolledY);
    this.updateVehicle();
    if (!this.isMoving()) {
        this.updateNonmoving(wasMoving);
    }
    this._followers.update();
};
//更新猛冲中
Game_Player.prototype.updateDashing = function() {
    if (this.isMoving()) {
        return;
    }
    if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
        this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
    } else {
        this._dashing = false;
    }
};
//是猛冲按键按下
Game_Player.prototype.isDashButtonPressed = function() {
    var shift = Input.isPressed('shift');
    if (ConfigManager.alwaysDash) {
        return !shift;
    } else {
        return shift;
    }
};
//更新滚动
Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
    var x1 = lastScrolledX;
    var y1 = lastScrolledY;
    var x2 = this.scrolledX();
    var y2 = this.scrolledY();
    if (y2 > y1 && y2 > this.centerY()) {
        $gameMap.scrollDown(y2 - y1);
    }
    if (x2 < x1 && x2 < this.centerX()) {
        $gameMap.scrollLeft(x1 - x2);
    }
    if (x2 > x1 && x2 > this.centerX()) {
        $gameMap.scrollRight(x2 - x1);
    }
    if (y2 < y1 && y2 < this.centerY()) {
        $gameMap.scrollUp(y1 - y2);
    }
};
//更新交通工具
Game_Player.prototype.updateVehicle = function() {
    if (this.isInVehicle() && !this.areFollowersGathering()) {
        if (this._vehicleGettingOn) {
            this.updateVehicleGetOn();
        } else if (this._vehicleGettingOff) {
            this.updateVehicleGetOff();
        } else {
            this.vehicle().syncWithPlayer();
        }
    }
};
//更新交通工具上
Game_Player.prototype.updateVehicleGetOn = function() {
    if (!this.areFollowersGathering() && !this.isMoving()) {
        this.setDirection(this.vehicle().direction());
        this.setMoveSpeed(this.vehicle().moveSpeed());
        this._vehicleGettingOn = false;
        this.setTransparent(true);
        if (this.isInAirship()) {
            this.setThrough(true);
        }
        this.vehicle().getOn();
    }
};
//更新交通工具下
Game_Player.prototype.updateVehicleGetOff = function() {
    if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
        this._vehicleGettingOff = false;
        this._vehicleType = 'walk';
        this.setTransparent(false);
    }
};
//更新不移动
Game_Player.prototype.updateNonmoving = function(wasMoving) {
    if (!$gameMap.isEventRunning()) {
        if (wasMoving) {
            $gameParty.onPlayerWalk();
            this.checkEventTriggerHere([1,2]);
            if ($gameMap.setupStartingEvent()) {
                return;
            }
        }
        if (this.triggerAction()) {
            return;
        }
        if (wasMoving) {
            this.updateEncounterCount();
        } else {
            $gameTemp.clearDestination();
        }
    }
};
//触发动作
Game_Player.prototype.triggerAction = function() {
    if (this.canMove()) {
        if (this.triggerButtonAction()) {
            return true;
        }
        if (this.triggerTouchAction()) {
            return true;
        }
    }
    return false;
};
//触发按键动作
Game_Player.prototype.triggerButtonAction = function() {
    if (Input.isTriggered('ok')) {
        if (this.getOnOffVehicle()) {
            return true;
        }
        this.checkEventTriggerHere([0]);
        if ($gameMap.setupStartingEvent()) {
            return true;
        }
        this.checkEventTriggerThere([0,1,2]);
        if ($gameMap.setupStartingEvent()) {
            return true;
        }
    }
    return false;
};
//触摸触发动作
Game_Player.prototype.triggerTouchAction = function() {
    if ($gameTemp.isDestinationValid()){
        var direction = this.direction();
        var x1 = this.x;
        var y1 = this.y;
        var x2 = $gameMap.roundXWithDirection(x1, direction);
        var y2 = $gameMap.roundYWithDirection(y1, direction);
        var x3 = $gameMap.roundXWithDirection(x2, direction);
        var y3 = $gameMap.roundYWithDirection(y2, direction);
        var destX = $gameTemp.destinationX();
        var destY = $gameTemp.destinationY();
        if (destX === x1 && destY === y1) {
            return this.triggerTouchActionD1(x1, y1);
        } else if (destX === x2 && destY === y2) {
            return this.triggerTouchActionD2(x2, y2);
        } else if (destX === x3 && destY === y3) {
            return this.triggerTouchActionD3(x2, y2);
        }
    }
    return false;
};
//触摸触发动作1
Game_Player.prototype.triggerTouchActionD1 = function(x1, y1) {
    if ($gameMap.airship().pos(x1, y1)) {
        if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
            return true;
        }
    }
    this.checkEventTriggerHere([0]);
    return $gameMap.setupStartingEvent();
};
//触摸触发动作d2
Game_Player.prototype.triggerTouchActionD2 = function(x2, y2) {
    if ($gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2)) {
        if (TouchInput.isTriggered() && this.getOnVehicle()) {
            return true;
        }
    }
    if (this.isInBoat() || this.isInShip()) {
        if (TouchInput.isTriggered() && this.getOffVehicle()) {
            return true;
        }
    }
    this.checkEventTriggerThere([0,1,2]);
    return $gameMap.setupStartingEvent();
};
//触摸触发动作d3
Game_Player.prototype.triggerTouchActionD3 = function(x2, y2) {
    if ($gameMap.isCounter(x2, y2)) {
        this.checkEventTriggerThere([0,1,2]);
    }
    return $gameMap.setupStartingEvent();
};
//更新遭遇计数 
Game_Player.prototype.updateEncounterCount = function() {
    if (this.canEncounter()) {
        this._encounterCount -= this.encounterProgressValue();
    }
};
//能遭遇
Game_Player.prototype.canEncounter = function() {
    return (!$gameParty.hasEncounterNone() && $gameSystem.isEncounterEnabled() &&
            !this.isInAirship() && !this.isMoveRouteForcing() && !this.isDebugThrough());
};
//遭遇进度值
Game_Player.prototype.encounterProgressValue = function() {
    var value = $gameMap.isBush(this.x, this.y) ? 2 : 1;
    if ($gameParty.hasEncounterHalf()) {
        value *= 0.5;
    }
    if (this.isInShip()) {
        value *= 0.5;
    }
    return value;
};
//检查事件触发 这里
Game_Player.prototype.checkEventTriggerHere = function(triggers) {
    if (this.canStartLocalEvents()) {
        this.startMapEvent(this.x, this.y, triggers, false);
    }
};
//检查事件触发 那里
Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    if (this.canStartLocalEvents()) {
        var direction = this.direction();
        var x1 = this.x;
        var y1 = this.y;
        var x2 = $gameMap.roundXWithDirection(x1, direction);
        var y2 = $gameMap.roundYWithDirection(y1, direction);
        this.startMapEvent(x2, y2, triggers, true);
        if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
            var x3 = $gameMap.roundXWithDirection(x2, direction);
            var y3 = $gameMap.roundYWithDirection(y2, direction);
            this.startMapEvent(x3, y3, triggers, true);
        }
    }
};
//检查事件触摸触发
Game_Player.prototype.checkEventTriggerTouch = function(x, y) {
    if (this.canStartLocalEvents()) {
        this.startMapEvent(x, y, [1,2], true);
    }
};
//能开始局部事件
Game_Player.prototype.canStartLocalEvents = function() {
    return !this.isInAirship();
};
//上下交通工具
Game_Player.prototype.getOnOffVehicle = function() {
    if (this.isInVehicle()) {
        return this.getOffVehicle();
    } else {
        return this.getOnVehicle();
    }
};
//上交通工具
Game_Player.prototype.getOnVehicle = function() {
    var direction = this.direction();
    var x1 = this.x;
    var y1 = this.y;
    var x2 = $gameMap.roundXWithDirection(x1, direction);
    var y2 = $gameMap.roundYWithDirection(y1, direction);
    if ($gameMap.airship().pos(x1, y1)) {
        this._vehicleType = 'airship';
    } else if ($gameMap.ship().pos(x2, y2)) {
        this._vehicleType = 'ship';
    } else if ($gameMap.boat().pos(x2, y2)) {
        this._vehicleType = 'boat';
    }
    if (this.isInVehicle()) {
        this._vehicleGettingOn = true;
        if (!this.isInAirship()) {
            this.forceMoveForward();
        }
        this.gatherFollowers();
    }
    return this._vehicleGettingOn;
};
//下交通工具
Game_Player.prototype.getOffVehicle = function() {
    if (this.vehicle().isLandOk(this.x, this.y, this.direction())) {
        if (this.isInAirship()) {
            this.setDirection(2);
        }
        this._followers.synchronize(this.x, this.y, this.direction());
        this.vehicle().getOff();
        if (!this.isInAirship()) {
            this.forceMoveForward();
            this.setTransparent(false);
        }
        this._vehicleGettingOff = true;
        this.setMoveSpeed(4);
        this.setThrough(false);
        this.makeEncounterCount();
        this.gatherFollowers();
    }
    return this._vehicleGettingOff;
};
//强制移动
Game_Player.prototype.forceMoveForward = function() {
    this.setThrough(true);
    this.moveForward();
    this.setThrough(false);
};
//是在伤害地面
Game_Player.prototype.isOnDamageFloor = function() {
    return $gameMap.isDamageFloor(this.x, this.y) && !this.isInAirship();
};
//移动折线
Game_Player.prototype.moveStraight = function(d) {
    if (this.canPass(this.x, this.y, d)) {
        this._followers.updateMove();
    }
    Game_Character.prototype.moveStraight.call(this, d);
};
//移动对角
Game_Player.prototype.moveDiagonally = function(horz, vert) {
    if (this.canPassDiagonally(this.x, this.y, horz, vert)) {
        this._followers.updateMove();
    }
    Game_Character.prototype.moveDiagonally.call(this, horz, vert);
};
//跳跃
Game_Player.prototype.jump = function(xPlus, yPlus) {
    Game_Character.prototype.jump.call(this, xPlus, yPlus);
    this._followers.jumpAll();
};
//显示从者
Game_Player.prototype.showFollowers = function() {
    this._followers.show();
};
//隐藏从者
Game_Player.prototype.hideFollowers = function() {
    this._followers.hide();
};
//集合从者
Game_Player.prototype.gatherFollowers = function() {
    this._followers.gather();
};
//是从者集合中
Game_Player.prototype.areFollowersGathering = function() {
    return this._followers.areGathering();
};
//是从者集合后
Game_Player.prototype.areFollowersGathered = function() {
    return this._followers.areGathered();
};
