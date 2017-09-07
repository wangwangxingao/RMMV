
/**-----------------------------------------------------------------------------*/
/** Game_Player*/
/** 游戏游戏者     $gamePlayer*/
/** The game object class for the player. It contains event starting*/
/** determinants and map scrolling functions.*/
/** 游戏者的游戏对象类.包含事件开始判定和地图滚动方法*/

function Game_Player() {
    this.initialize.apply(this, arguments);
}

/**设置原形 */
Game_Player.prototype = Object.create(Game_Character.prototype);
/**设置创造者*/
Game_Player.prototype.constructor = Game_Player;
/**初始化*/
Game_Player.prototype.initialize = function() {
	//游戏角色 初始化 呼叫(this)
    Game_Character.prototype.initialize.call(this);
    //设置透明(数据系统 开始透明)
    this.setTransparent($dataSystem.optTransparent);
};
/**初始化成员*/
Game_Player.prototype.initMembers = function() {
	//游戏角色 初始化成员 呼叫(this)
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
/**清除传送信息*/
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
/**从者组*/
Game_Player.prototype.followers = function() {
    //返回 从者组
    return this._followers;
};
/**刷新*/
Game_Player.prototype.refresh = function() {
	//角色 = 游戏队伍 领导者
    var actor = $gameParty.leader();
    //行走图名称 = 角色 ?  角色 行走图名称 :  ""
    var characterName = actor ? actor.characterName() : '';
    //行走图索引 = 角色 ?  角色 行走图索引 :  ""
    var characterIndex = actor ? actor.characterIndex() : 0;
    //设置图像(行走图名称,行走图索引)
    this.setImage(characterName, characterIndex);
    //从者组 刷新
    this._followers.refresh();
};
/**是停止*/
Game_Player.prototype.isStopping = function() {
	//如果 交通工具上中 或者 交通工具下中
    if (this._vehicleGettingOn || this._vehicleGettingOff) {
	    //返回 false 
        return false;
    }
    //返回 游戏角色 是停止 呼叫(this)
    return Game_Character.prototype.isStopping.call(this);
};
/**预约传送*/
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
/**请求地图重装*/
Game_Player.prototype.requestMapReload = function() {
	//需要地图重装 = true
    this._needsMapReload = true;
};
/**是传送中*/
Game_Player.prototype.isTransferring = function() {
	//返回 传送中
    return this._transferring;
};
/**新地图id*/
Game_Player.prototype.newMapId = function() {
	//返回 新地图id
    return this._newMapId;
};
/**淡入种类*/
Game_Player.prototype.fadeType = function() {
	//返回 淡入种类
    return this._fadeType;
};
/**表现传送*/
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
        //设于 (新x,新y)
        this.locate(this._newX, this._newY);
        //刷新
        this.refresh();
        //清除传送信息
        this.clearTransferInfo();
    }
};
/**是地图可通行*/
Game_Player.prototype.isMapPassable = function(x, y, d) {
	//交通工具 
    var vehicle = this.vehicle();
    //如果 交通工具
    if (vehicle) {
	    //返回 交通工具 是地图可通行(x,y,d)
        return vehicle.isMapPassable(x, y, d);
    } else {
	    //返回 游戏角色 是地图可通行 呼叫(this)
        return Game_Character.prototype.isMapPassable.call(this, x, y, d);
    }
};
/**交通工具*/
Game_Player.prototype.vehicle = function() {
	//返回 游戏地图 交通工具[交通工具种类]
    return $gameMap.vehicle(this._vehicleType);
};
/**是在小船*/
Game_Player.prototype.isInBoat = function() {
	//返回 交通工具种类 === 'boat'  //小船
    return this._vehicleType === 'boat';
};
/**是在帆船*/
Game_Player.prototype.isInShip = function() {
	//返回 交通工具种类 === 'ship'  //帆船
    return this._vehicleType === 'ship';
};
/**是在天空船*/
Game_Player.prototype.isInAirship = function() {
	//返回 交通工具种类 === 'airship' //天空船
    return this._vehicleType === 'airship';
};
/**是在交通工具*/
Game_Player.prototype.isInVehicle = function() {
	//返回 是在帆船() 或者 是在帆船() 或者 是在天空船()
    return this.isInBoat() || this.isInShip() || this.isInAirship();
};
/**是普通*/
Game_Player.prototype.isNormal = function() {
	//返回 交通工具种类 === 'walk'  并且  不是 是强制移动路线()
    return this._vehicleType === 'walk' && !this.isMoveRouteForcing();
};
/**是猛冲中*/
Game_Player.prototype.isDashing = function() {
	//返回 猛冲中
    return this._dashing;
};
/**是除错通行*/
Game_Player.prototype.isDebugThrough = function() {
	//返回 输入 是按下('control') 并且 游戏临时 是游戏测试()
    return Input.isPressed('control') && $gameTemp.isPlaytest();
};
/**是碰撞*/
Game_Player.prototype.isCollided = function(x, y) {
    //如果( 是穿透() )
    if (this.isThrough()) {
        //返回 false
        return false;
    //否则 
    } else {
        //返回 位于(x,y) 或者 从者组 是有人碰撞(x,y)
        return this.pos(x, y) || this._followers.isSomeoneCollided(x, y);
    }
};
/**中心x*/
Game_Player.prototype.centerX = function() {
    //返回 (图形 宽 / 游戏地图 图块宽() - 1) / 2.0
    return (Graphics.width / $gameMap.tileWidth() - 1) / 2.0;
};
/**中心y*/
Game_Player.prototype.centerY = function() {
    //返回 (图形 高 / 游戏地图 图块高() - 1) / 2.0
    return (Graphics.height / $gameMap.tileHeight() - 1) / 2.0;
};
/**中心*/
Game_Player.prototype.center = function(x, y) {
    //返回 游戏地图 设置显示位置( x - 中心x() , y - 中心y())
    return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
};
/**设于*/
Game_Player.prototype.locate = function(x, y) {
    //游戏人物 设于 呼叫(this , x , y)
    Game_Character.prototype.locate.call(this, x, y);
    //中心(x,y)
    this.center(x, y);
    //制作遭遇计数()
    this.makeEncounterCount();
    //如果( 是在交通工具() )
    if (this.isInVehicle()) {
        //交通工具() 刷新()
        this.vehicle().refresh();
    }
    //从者组 同步(x,y ,方向() )
    this._followers.synchronize(x, y, this.direction());
};
/**增加步数*/
Game_Player.prototype.increaseSteps = function() {
    //游戏人物 增加步数 呼叫(this , x , y)
    Game_Character.prototype.increaseSteps.call(this);
    //如果( 是普通() )
    if (this.isNormal()) {
        //游戏队伍 增加步数()
        $gameParty.increaseSteps();
    }
};
/**制作遭遇计数*/
Game_Player.prototype.makeEncounterCount = function() {
    //n = 游戏地图 制作遭遇步数()
    var n = $gameMap.encounterStep();
    //遭遇计数 = 数学 随机整数(n) +  数学 随机整数(n) + 1
    this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + 1;
};
/**制作遭遇敌群id*/
Game_Player.prototype.makeEncounterTroopId = function() {
    //遭遇列表 = [] 
    var encounterList = [];
    //宽总数
    var weightSum = 0;
    //游戏地图 遭遇列表 对每一个 (遭遇)
    $gameMap.encounterList().forEach(function(encounter) {
        //如果(满足遭遇条件(遭遇)  )
        if (this.meetsEncounterConditions(encounter)) {
            //遭遇列表 添加(遭遇)
            encounterList.push(encounter);
            //宽总数 += 遭遇 宽
            weightSum += encounter.weight;
        }
    // , this)
    }, this);
    //如果(宽总数 > 0 )
    if (weightSum > 0) {
        //值  =  随机整数(宽总数 )
        var value = Math.randomInt(weightSum);
        //循环(开始时 i = 0 ; 当 i < 遭遇列表 长度 ;每一次 i++ )
        for (var i = 0; i < encounterList.length; i++) {
            //值 -= 遭遇列表[i] 宽
            value -= encounterList[i].weight;
            //如果( 值 < 0 )
            if (value < 0) {
                //返回 遭遇列表[i] 敌群id
                return encounterList[i].troopId;
            }
        }
    }
    //返回 0
    return 0;
};
/**满足遭遇条件*/
Game_Player.prototype.meetsEncounterConditions = function(encounter) {
    //返回 ( 遭遇 条件组 长度  === 0 或者 遭遇 条件组 包含( 区域id()  )   )
    return (encounter.regionSet.length === 0 ||
            encounter.regionSet.contains(this.regionId()));
};
/**执行遭遇*/
Game_Player.prototype.executeEncounter = function() {
    //如果( 不是 游戏地图 是事件运转() 并且 遭遇计数 <= 0  )
    if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
        //制作遭遇计数()
        this.makeEncounterCount();
        //敌群id = 制作遭遇敌群id()
        var troopId = this.makeEncounterTroopId();
        //如果( 数据敌群[敌群id] )
        if ($dataTroops[troopId]) {
            //战斗管理器 安装( 敌群id , true , false )
            BattleManager.setup(troopId, true, false);
            //战斗管理器 当遭遇()
            BattleManager.onEncounter();
            //返回 true
            return true;
        //否则
        } else {
            //返回 false
            return false;
        }
    //否则 
    } else {
        //返回 false
        return false;
    }
};
/**开始地图事件*/
Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    //如果( 不是 游戏地图 是事件运转()  )
    if (!$gameMap.isEventRunning()) {
        //游戏地图 事件组xy(x,y) 对每一个 (事件)
        $gameMap.eventsXy(x, y).forEach(function(event) {
            //如果(事件 是触发在(触发组) 并且 事件 是正常优先级() === 正常 )
            if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                //事件 开始()
                event.start();
            }
        });
    }
};
/**移动通过输入 */
Game_Player.prototype.moveByInput = function() {
    //如果(不是 是移动中() 并且 能移动())
    if (!this.isMoving() && this.canMove()) {
        //方向 = 获得输入方向()
        var direction = this.getInputDirection();
        //如果(方向 > 0 )
        if (direction > 0) {
            //游戏临时 清除()
            $gameTemp.clearDestination();
        //否则 如果 ( 游戏临时 是有效目的地() )
        } else if ($gameTemp.isDestinationValid()){
            //x = 游戏临时 目的地x()
            var x = $gameTemp.destinationX();
            //y = 游戏临时 目的地y()
            var y = $gameTemp.destinationY();
            //方向 = 寻找方向到(x,y)
            direction = this.findDirectionTo(x, y);
        }
        //如果( 方向 > 0 )
        if (direction > 0) {
            //执行移动(方向)
            this.executeMove(direction);
        }
    }
};
/**能移动*/
Game_Player.prototype.canMove = function() {
    //如果( 游戏地图 是事件运转() 或者 游戏消息 是忙碌() )
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
        //返回 false
        return false;
    }
    //如果( 是强制移动路线() 或者 是从者集合中() )
    if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
        //返回 false
        return false;
    }
    //如果( 交通工具上中 或者 交通工具下中 )
    if (this._vehicleGettingOn || this._vehicleGettingOff) {
        //返回 false
        return false;
    }
    //如果( 是在交通工具() 并且 不是 交通工具() 能移动() )
    if (this.isInVehicle() && !this.vehicle().canMove()) {
        //返回 false
        return false;
    }
    //返回 true
    return true;
};
/**获得输入方向*/
Game_Player.prototype.getInputDirection = function() {
    //返回 输入 方向4
    return Input.dir4;
};
/**执行移动*/
Game_Player.prototype.executeMove = function(direction) {
    //移动直线(方向)
    this.moveStraight(direction);
};
/**更新*/
Game_Player.prototype.update = function(sceneActive) {
    //最后滚动x = 滚动x()
    var lastScrolledX = this.scrolledX();
    //最后滚动y = 滚动y()
    var lastScrolledY = this.scrolledY();
    //是移动 = 是移动中()
    var wasMoving = this.isMoving();
    //更新猛冲中()
    this.updateDashing();
    //如果( 场景活动)
    if (sceneActive) {
        //移动通过输入()
        this.moveByInput();
    }
    //游戏人物 更新 呼叫(this)
    Game_Character.prototype.update.call(this);
    //更新滚动(最后滚动x , 最后滚动y)
    this.updateScroll(lastScrolledX, lastScrolledY);
    //更新交通工具()
    this.updateVehicle();
    //如果(不是 是移动中() )
    if (!this.isMoving()) {
        //更新不移动(是移动)
        this.updateNonmoving(wasMoving);
    }
    //从者组 更新()
    this._followers.update();
};
/**更新猛冲中*/
Game_Player.prototype.updateDashing = function() {
    //如果( 是移动中() )
    if (this.isMoving()) {
        //返回 
        return;
    }
    //如果( 能移动() 并且 不是 是在交通工具() 并且 不是 游戏地图 是奔跑禁止() )
    if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
        //猛冲 =  是猛冲按键按下 或者 游戏临时 是有效目的地()   
        this._dashing =  this.isDashButtonPressed() || $gameTemp.isDestinationValid();   // || $gameTemp.isDestinationValid();
    //否则
    } else {
        //猛冲 = false
        this._dashing = false;
    }
};
/**是猛冲按键按下*/
Game_Player.prototype.isDashButtonPressed = function() {
    //shift = 输入 是按下("shift")
    var shift = Input.isPressed('shift');
    //如果(配置管理器 始终冲刺)
    if (ConfigManager.alwaysDash) {
        //返回 不是 shift 
        return !shift;
    //否则
    } else {
        //返回 shift
        return shift;
    }
};
/**更新滚动*/
Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
    //x1 = 最后滚动x
    var x1 = lastScrolledX;
    //x2 = 最后滚动y
    var y1 = lastScrolledY;
    //x2 = 滚动x()
    var x2 = this.scrolledX();
    //y2 = 滚动y()
    var y2 = this.scrolledY();
    //如果(y2> y1 并且 y2 > 中心y() )
    if (y2 > y1 && y2 > this.centerY()) {
        //游戏地图 滚动下(y2-y1)
        $gameMap.scrollDown(y2 - y1);
    }
    //如果(x2 < x1 并且 x2 < 中心x() )
    if (x2 < x1 && x2 < this.centerX()) {
        //游戏地图 滚动左(x1-x2)
        $gameMap.scrollLeft(x1 - x2);
    }
    //如果(x2> x1 并且 x2 > 中心x() )
    if (x2 > x1 && x2 > this.centerX()) {
        //游戏地图 滚动右(x2-x1)
        $gameMap.scrollRight(x2 - x1);
    }
    //如果(y2 < y1 并且 y2 > 中心y() )
    if (y2 < y1 && y2 < this.centerY()) {
        //游戏地图 滚动上(y1-y2)
        $gameMap.scrollUp(y1 - y2);
    }
};
/**更新交通工具*/
Game_Player.prototype.updateVehicle = function() {
    //如果(是在交通工具() 并且 不是 是从者集合中() )
    if (this.isInVehicle() && !this.areFollowersGathering()) {
        //如果( 交通工具上中() )
        if (this._vehicleGettingOn) {
            //更新交通工具上()
            this.updateVehicleGetOn();
        //如果( 交通工具下中() )
        } else if (this._vehicleGettingOff) {
            //更新交通工具下()
            this.updateVehicleGetOff();
        //否则
        } else {
            //交通工具() 同步的和游戏者() 
            this.vehicle().syncWithPlayer();
        }
    }
};
/**更新交通工具上*/
Game_Player.prototype.updateVehicleGetOn = function() {
    //如果(不是 是从者集合中() 并且 不是 是移动中() )
    if (!this.areFollowersGathering() && !this.isMoving()) {
        //设置方向( 交通工具() 方向()  )
        this.setDirection(this.vehicle().direction());
        //设置移动速度( 交通工具() 移动速度() )
        this.setMoveSpeed(this.vehicle().moveSpeed());
        //交通工具上中 = false
        this._vehicleGettingOn = false;
        //设置透明(true)
        this.setTransparent(true);
        //如果( 是在天空船() )
        if (this.isInAirship()) {
            //设置穿透(true)
            this.setThrough(true);
        }
        //交通工具() 上()
        this.vehicle().getOn();
    }
};
/**更新交通工具下*/
Game_Player.prototype.updateVehicleGetOff = function() {
    //如果( 不是 是从者集合中() 并且 交通工具() 是低水平() )
    if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
        //交通工具下中 = false
        this._vehicleGettingOff = false;
        //交通工具种类 = "walk"//步行
        this._vehicleType = 'walk';
        //设置透明(false)
        this.setTransparent(false);
    }
};
/**更新不移动*/
Game_Player.prototype.updateNonmoving = function(wasMoving) {
    //如果(不是 游戏地图 是事件运转() )
    if (!$gameMap.isEventRunning()) {
        //如果( 是移动中 )
        if (wasMoving) {
            //游戏队伍 当游戏者行走
            $gameParty.onPlayerWalk();
            
            /**
             * 2w:
             * 检查游戏者位置是否有 
             *     有优先级 与普通人物不同 的事件,
             *     事件触发是 2 玩家接触或 2 事件接触  
             * 开始这事件  
             * 
             **/

            //检查事件触发这里( [1,2] )
            this.checkEventTriggerHere([1,2]);
            //如果(游戏地图 安装开始事件() )
            if ($gameMap.setupStartingEvent()) {
                //返回 
                return;
            }
        }
        //如果( 触发动作() )
        if (this.triggerAction()) {
            //返回 
            return;
        }
        //如果( 是移动中 )
        if (wasMoving) {
            //更新遭遇计数()
            this.updateEncounterCount();
        //否则
        } else {
            //游戏临时 清除目的地()
            $gameTemp.clearDestination();
        }
    }
};
/**触发动作*/
Game_Player.prototype.triggerAction = function() {
    //如果( 能移动() )
    if (this.canMove()) {
        //如果 (触发按键动作() )
        if (this.triggerButtonAction()) {
            //返回 true
            return true;
        }
        //如果 (触发触摸动作() )
        if (this.triggerTouchAction()) {
            //返回 true 
            return true;
        }
    }
    //返回 false
    return false;
};
/**触发按键动作*/
Game_Player.prototype.triggerButtonAction = function() {
    //如果(输入 是("ok") )
    if (Input.isTriggered('ok')) {
        //如果( 上下交通工具() )
        if (this.getOnOffVehicle()) {
            //返回 true
            return true;
        }
        //检查事件触发这里( [0] )
        this.checkEventTriggerHere([0]);
        //如果(游戏地图 安装开始事件() )
        if ($gameMap.setupStartingEvent()) {
            //返回 true
            return true;
        }
        //检查事件触发那里([0,1,2])
        this.checkEventTriggerThere([0,1,2]);
        //如果(游戏地图 安装开始事件() )
        if ($gameMap.setupStartingEvent()) {
            //返回 true
            return true;
        }
    }
    return false;
};
/**触发触摸动作*/
Game_Player.prototype.triggerTouchAction = function() {
    //如果(游戏临时 是有效目的地() )
    if ($gameTemp.isDestinationValid()){
        //方向 = 方向
        var direction = this.direction();
        //x1 = x
        var x1 = this.x;
        //y1 = y
        var y1 = this.y;
        //x2 = 游戏地图 环x和方向(x1 , 方向 )
        var x2 = $gameMap.roundXWithDirection(x1, direction);
        //y2 = 游戏地图 环y和方向(y1 , 方向 )
        var y2 = $gameMap.roundYWithDirection(y1, direction);
        //x3 = 游戏地图 环x和方向(x2 , 方向 )
        var x3 = $gameMap.roundXWithDirection(x2, direction);
        //y3 = 游戏地图 环y和方向(y2 , 方向 )
        var y3 = $gameMap.roundYWithDirection(y2, direction);
        //目的地x = 游戏临时 目的地x()
        var destX = $gameTemp.destinationX();
        //目的地y = 游戏临时 目的地y()
        var destY = $gameTemp.destinationY();
        //如果(目的地x == x1 并且 目的地y == y1)
        if (destX === x1 && destY === y1) {
            //返回 触发触摸动作d1(x1,y1)
            return this.triggerTouchActionD1(x1, y1);
        //否则 如果(目的地x == x2 并且 目的地y == y2)
        } else if (destX === x2 && destY === y2) {
            //返回 触发触摸动作d2(x2,y2)
            return this.triggerTouchActionD2(x2, y2);
        //否则 如果(目的地x == x3 并且 目的地y == y3)
        } else if (destX === x3 && destY === y3) {
            //返回 触发触摸动作d3(x2,y2)
            return this.triggerTouchActionD3(x2, y2);
        }
    }
    //返回 false
    return false;
};
/**触发触摸动作d1*/
Game_Player.prototype.triggerTouchActionD1 = function(x1, y1) {
    //如果(游戏地图 天空船() 位于(x1,y1) )
    if ($gameMap.airship().pos(x1, y1)) {
        //如果(触摸输入 是刚按下() 并且 上下交通工具() )
        if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
            //返回 true
            return true;
        }
    }
    //检查事件触发那里([0])
    this.checkEventTriggerHere([0]);
    //返回 游戏地图 安装开始事件()
    return $gameMap.setupStartingEvent();
};
/**触发触摸动作d2*/
Game_Player.prototype.triggerTouchActionD2 = function(x2, y2) {
    //如果(游戏地图 小船() 位于(x2,y2) 或者 游戏地图 帆船() 位于(x2,y2) )
    if ($gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2)) {
        //如果 (触摸输入 是刚按下() 并且 上交通工具() )
        if (TouchInput.isTriggered() && this.getOnVehicle()) {
            //返回 true
            return true;
        }
    }
    //如果(是在小船() 或者 是在帆船() )
    if (this.isInBoat() || this.isInShip()) {
        //如果 (触摸输入 是刚按下() 并且 下交通工具() )
        if (TouchInput.isTriggered() && this.getOffVehicle()) {
            //返回 true
            return true;
        }
    }
    //检查事件触发那里([0,1,2])
    this.checkEventTriggerThere([0,1,2]);
    //返回 游戏地图 安装开始事件()
    return $gameMap.setupStartingEvent();
};
/**触发触摸动作d3*/
Game_Player.prototype.triggerTouchActionD3 = function(x2, y2) {
    //如果 (游戏地图 是柜台(x2,y2))
    if ($gameMap.isCounter(x2, y2)) {
        //检查事件触发那里([0,1,2])
        this.checkEventTriggerThere([0,1,2]);
    }
    //返回 游戏地图 安装开始事件()
    return $gameMap.setupStartingEvent();
};
/**更新遭遇计数 */
Game_Player.prototype.updateEncounterCount = function() {
    //如果( 能遭遇() )
    if (this.canEncounter()) {
        //遭遇计数 -= 遭遇进度值()
        this._encounterCount -= this.encounterProgressValue();
    }
};
/**能遭遇*/
Game_Player.prototype.canEncounter = function() {
    //返回 (不是 游戏队伍 有无遭遇() 并且 游戏系统 是启用遭遇() 并且 不是 是在天空船() 并且 不是 是强制移动路线 并且 不是 是除错通行() )
    return (!$gameParty.hasEncounterNone() && $gameSystem.isEncounterEnabled() &&
            !this.isInAirship() && !this.isMoveRouteForcing() && !this.isDebugThrough());
};
/**遭遇进度值*/
Game_Player.prototype.encounterProgressValue = function() {
    //值 = 游戏地图 是灌木丛(x,y) ? 2 : 1
    var value = $gameMap.isBush(this.x, this.y) ? 2 : 1;
    //如果 (游戏队伍 有遭遇减半() )
    if ($gameParty.hasEncounterHalf()) {
        //值 *= 0.5
        value *= 0.5;
    }
    //如果( 是在帆船() )
    if (this.isInShip()) {
        //值 *= 0.5
        value *= 0.5;
    }
    //返回 值
    return value;
};
/**检查事件触发这里*/
Game_Player.prototype.checkEventTriggerHere = function(triggers) {
    //如果( 能开始局部事件() )
    if (this.canStartLocalEvents()) {
        //开始地图事件(x,y,触发组 ,false)
        this.startMapEvent(this.x, this.y, triggers, false);
    }
};
/**检查事件触发那里*/
Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    //如果( 能开始局部事件() )
    if (this.canStartLocalEvents()) {
        //方向 = 方向()
        var direction = this.direction();
        //x1 = x
        var x1 = this.x;
        //y1 = y
        var y1 = this.y;
        //x2 = 游戏地图 环x和方向(x1 , 方向 )
        var x2 = $gameMap.roundXWithDirection(x1, direction);
        //y2 = 游戏地图 环y和方向(y1 , 方向 )
        var y2 = $gameMap.roundYWithDirection(y1, direction);
        //开始地图事件(x2,y2 ,触发组 , true)
        this.startMapEvent(x2, y2, triggers, true);
        //如果(不是 游戏地图 是任何事件开始() 并且 游戏地图 是柜台(x2,y2))
        if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
            //x3 = 游戏地图 环x和方向(x2 , 方向 )
            var x3 = $gameMap.roundXWithDirection(x2, direction);
            //y3 = 游戏地图 环y和方向(y2 , 方向 )
            var y3 = $gameMap.roundYWithDirection(y2, direction);
            //开始地图事件(x3,y3 ,触发组 , true)
            this.startMapEvent(x3, y3, triggers, true);
        }
    }
};
/**检查事件触发触摸*/
Game_Player.prototype.checkEventTriggerTouch = function(x, y) {
	//如果( 能开始局部事件() )
    if (this.canStartLocalEvents()) {
        //开始地图事件( x,y ,[1,2] , true )
        this.startMapEvent(x, y, [1,2], true);
    }
};
/**能开始局部事件*/
Game_Player.prototype.canStartLocalEvents = function() {
    //返回 不是 是在天空船()
    return !this.isInAirship();
};
/**上下交通工具*/
Game_Player.prototype.getOnOffVehicle = function() {
    //如果( 是在交通工具() )
    if (this.isInVehicle()) {
        //返回 下交通工具()
        return this.getOffVehicle();
    //否则
    } else {
        //返回 上交通工具()
        return this.getOnVehicle();
    }
};
/**上交通工具*/
Game_Player.prototype.getOnVehicle = function() {
        //方向 = 方向()
    var direction = this.direction();
        //x1 = x
    var x1 = this.x;
        //y1 = y
    var y1 = this.y;
        //x2 = 游戏地图 环x和方向(x1 , 方向 )
    var x2 = $gameMap.roundXWithDirection(x1, direction);
        //y2 = 游戏地图 环y和方向(y1 , 方向 )
    var y2 = $gameMap.roundYWithDirection(y1, direction);
    //如果(游戏地图 天空船() 位于(x1,y1) )
    if ($gameMap.airship().pos(x1, y1)) {
        //交通工具种类 = "airship" //天空船
        this._vehicleType = 'airship';
    //否则 如果(游戏地图 帆船() 位于(x2,y2) )
    } else if ($gameMap.ship().pos(x2, y2)) {
        //交通工具种类 = "ship" //帆船
        this._vehicleType = 'ship';
    //否则 如果(游戏地图 小船() 位于(x2,y2) )
    } else if ($gameMap.boat().pos(x2, y2)) {
        //交通工具种类 = "boat" //小船
        this._vehicleType = 'boat';
    }
    //如果(是在交通工具() )
    if (this.isInVehicle()) {
        //交通工具上中 = true
        this._vehicleGettingOn = true;
        //如果(不是 是在天空船() )
        if (!this.isInAirship()) {
            //强制移动前进()
            this.forceMoveForward();
        }
        //集合从者组()
        this.gatherFollowers();
    }
    //返回 交通工具上中
    return this._vehicleGettingOn;
};
/**下交通工具*/
Game_Player.prototype.getOffVehicle = function() {
    //如果(交通工具() 是陆地确定(x,y,方向()) )
    if (this.vehicle().isLandOk(this.x, this.y, this.direction())) {
        //如果(是在天空船() )
        if (this.isInAirship()) {
            //设置方向(2)
            this.setDirection(2);
        }
        //从者组 同步(x,y,方向() )
        this._followers.synchronize(this.x, this.y, this.direction());
        //交通工具() 下()
        this.vehicle().getOff();
        //如果(不是 是在天空船() )
        if (!this.isInAirship()) {
            //强制移动前进()
            this.forceMoveForward();
            //设置透明(false)
            this.setTransparent(false);
        }
        //交通工具下中 = true 
        this._vehicleGettingOff = true;
        //设置移动速度(4)
        this.setMoveSpeed(4);
        //设置穿透(false)
        this.setThrough(false);
        //制作遭遇计数()
        this.makeEncounterCount();
        //集合从者组()
        this.gatherFollowers();
    }
    //返回 交通工具下中
    return this._vehicleGettingOff;
};
/**强制移动前进*/
Game_Player.prototype.forceMoveForward = function() {
    //设置穿透(true)
    this.setThrough(true);
    //移动前进()
    this.moveForward();
    //设置穿透(false)
    this.setThrough(false);
};
/**是在伤害地面*/
Game_Player.prototype.isOnDamageFloor = function() {
    //返回 游戏地图 是伤害地面(x,y) 并且 不是 是在天空船()
    return $gameMap.isDamageFloor(this.x, this.y) && !this.isInAirship();
};
/**移动直线*/
Game_Player.prototype.moveStraight = function(d) {
    //返回 ( 能通过(x,y,d) )
    if (this.canPass(this.x, this.y, d)) {
        //从者组 更新移动()
        this._followers.updateMove();
    }
    //游戏人物 移动直线 呼叫(this,d)
    Game_Character.prototype.moveStraight.call(this, d);
};
/**移动对角*/
Game_Player.prototype.moveDiagonally = function(horz, vert) {
    //如果(能通过对角(x,y,水平,垂直) )
    if (this.canPassDiagonally(this.x, this.y, horz, vert)) {
        //从者组 更新移动()
        this._followers.updateMove();
    }
    //游戏人物 移动对角(this,水平,垂直)
    Game_Character.prototype.moveDiagonally.call(this, horz, vert);
};
/**跳跃*/
Game_Player.prototype.jump = function(xPlus, yPlus) {
    //游戏人物 跳跃 呼叫(this, xPlus//x增量, yPlus//y增量)
    Game_Character.prototype.jump.call(this, xPlus, yPlus);
    //从者组 跳跃全都()
    this._followers.jumpAll();
};
/**显示从者组*/
Game_Player.prototype.showFollowers = function() {
    //从者组 显示()
    this._followers.show();
};
/**隐藏从者组*/
Game_Player.prototype.hideFollowers = function() {
    //从者组 隐藏()
    this._followers.hide();
};
/**集合从者组*/
Game_Player.prototype.gatherFollowers = function() {
    //从者组 集合()
    this._followers.gather();
};
/**是从者组集合中*/
Game_Player.prototype.areFollowersGathering = function() {
    //返回 从者组 是集合中()
    return this._followers.areGathering();
};
/**是从者组集合后*/
Game_Player.prototype.areFollowersGathered = function() {
    //返回 从者组 是集合后()
    return this._followers.areGathered();
};
