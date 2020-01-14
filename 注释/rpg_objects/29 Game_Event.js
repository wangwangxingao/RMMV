
/**-----------------------------------------------------------------------------  
 * Game_Event  
 * 游戏事件  
 * The game object class for an event. It contains functionality for event page  
 * switching and running parallel process events.  
 * 事件的游戏对象类.包含事件页开关和运转并行事件*/

function Game_Event() {
    this.initialize.apply(this, arguments);
}

/**设置原形 */
Game_Event.prototype = Object.create(Game_Character.prototype);
/**设置创造者*/
Game_Event.prototype.constructor = Game_Event;
/**初始化*/
Game_Event.prototype.initialize = function(mapId, eventId) {
    //游戏人物 初始化 呼叫(this)
    Game_Character.prototype.initialize.call(this);
    //地图id = 地图id
    this._mapId = mapId;
    //事件id = 事件id
    this._eventId = eventId;
    //设于(事件() x , 事件() y)
    this.locate(this.event().x, this.event().y);
    //刷新()
    this.refresh();
};
/**初始化成员*/
Game_Event.prototype.initMembers = function() {
    //游戏人物 初始化成员 呼叫(this)
    Game_Character.prototype.initMembers.call(this);
    //移动种类 = 0
    this._moveType = 0;
    //触发 = 0
    this._trigger = 0;
    //开始中 = false
    this._starting = false;
    //抹去的 = false
    this._erased = false;
    //页索引 = -2 
    this._pageIndex = -2;
    //原始图案 = 1
    this._originalPattern = 1;
    //原始方向 = 2
    this._originalDirection = 2;
    //锁方向 = 0
    this._prelockDirection = 0;
    //锁的 = false
    this._locked = false;
};
/**事件id*/
Game_Event.prototype.eventId = function() {
    //返回 事件id
    return this._eventId;
};
/**事件*/
Game_Event.prototype.event = function() {
    //返回 数据地图 事件组[事件id]
    return $dataMap.events[this._eventId];
};
/**页*/
Game_Event.prototype.page = function() {
    //返回 事件() 页组 [页索引]
    return this.event().pages[this._pageIndex];
};
/**列表*/
Game_Event.prototype.list = function() {
    //返回 页()列表
    return this.page().list;
};
/**是碰撞和人物*/
Game_Event.prototype.isCollidedWithCharacters = function(x, y) {
    //返回 游戏人物 是碰撞和人物 呼叫(this, x,y) 或者 是碰撞和游戏者()
    return (Game_Character.prototype.isCollidedWithCharacters.call(this, x, y) ||
            this.isCollidedWithPlayerCharacters(x, y));
};
/**是碰撞和事件*/
Game_Event.prototype.isCollidedWithEvents = function(x, y) {
    //事件组 = 游戏地图 事件组xy无穿越(x,y)
    var events = $gameMap.eventsXyNt(x, y);
    //返回 事件组 长度 > 0
    return events.length > 0;
};
/**是碰撞和游戏者*/
Game_Event.prototype.isCollidedWithPlayerCharacters = function(x, y) {
    //返回 是正常优先级() 不去 游戏游戏者 是碰撞(x,y)
    return this.isNormalPriority() && $gamePlayer.isCollided(x, y);
};
/**锁*/
Game_Event.prototype.lock = function() {
    //如果(不是 锁的)
    if (!this._locked) {
        //锁方向 = 方向()
        this._prelockDirection = this.direction();
        //转向游戏者()
        this.turnTowardPlayer();
        //锁的 = true
        this._locked = true;
    }
};
/**解锁*/
Game_Event.prototype.unlock = function() {
    //如果( 锁的 )
    if (this._locked) {
        //锁的 = false 
        this._locked = false;
        //设置方向( 锁方向 )
        this.setDirection(this._prelockDirection);
    }
};
/**更新停止*/
Game_Event.prototype.updateStop = function() {
    //如果( 锁的 )
    if (this._locked) {
        //重设停止计数()
        this.resetStopCount();
    }
    //游戏人物 更新停止 呼叫(this)
    Game_Character.prototype.updateStop.call(this);
    //如果(不是 是强制移动路线() )
    if (!this.isMoveRouteForcing()) {
        //更新自己的运动()
        this.updateSelfMovement();
    }
};
/**更新自己的运动*/
Game_Event.prototype.updateSelfMovement = function() {
    //如果(是画面附近() 并且 检查停止( 停止计数临界()  ))
    if (this.isNearTheScreen() && this.checkStop(this.stopCountThreshold())) {
        //检查(移动种类)
        switch (this._moveType) {
        //当 1 :
        case 1:
            //移动种类随机()
            this.moveTypeRandom();
            //中断
            break;
        //当 2 :
        case 2:
            //移动种类向游戏者() 
            this.moveTypeTowardPlayer();
            //中断
            break;
        //当 3 :
        case 3:
            //移动种类定制()
            this.moveTypeCustom();
            //中断
            break;
        }
    }
};
/**停止计数临界*/
Game_Event.prototype.stopCountThreshold = function() {
    //返回 30 * (5 - 设置移动频率() )
    return 30 * (5 - this.moveFrequency());
};
/**移动种类随机*/
Game_Event.prototype.moveTypeRandom = function() {
    //检查 (数学 随机整数(6) )
    switch (Math.randomInt(6)) {
    //当 0 : 当 1 :
    case 0: case 1:
        //移动随机()
        this.moveRandom();
        //中断
        break;
    //当 2 : 当 3 : 当 4 :
    case 2: case 3: case 4:
        //移动前进()
        this.moveForward();
        //中断
        break;
    //当 5 : 
    case 5:
        //重设停止计数()
        this.resetStopCount();
        //中断
        break;
    }
};
/**移动种类向游戏者*/
Game_Event.prototype.moveTypeTowardPlayer = function() {
    //如果(是游戏者附近() )
    if (this.isNearThePlayer()) {
        //检查 (数学 随机整数(6) )
        switch (Math.randomInt(6)) {
        //当 0 : 当 1 : 当 2 : 当 3 :
        case 0: case 1: case 2: case 3:
            //移动向游戏者
            this.moveTowardPlayer();
            //中断
            break;
        //当 4: 
        case 4:
            //移动随机()
            this.moveRandom();
            //中断
            break;
        //当 5: 
        case 5:
            //移动前进()
            this.moveForward();
            //中断
            break;
        }
    //否则
    } else {
        //移动随机()
        this.moveRandom();
    }
};
/**是游戏者附近*/
Game_Event.prototype.isNearThePlayer = function() {
    //sx = 数学 绝对值( 三角x从(游戏游戏者 x)  )
    var sx = Math.abs(this.deltaXFrom($gamePlayer.x));
    //sy = 数学 绝对值( 三角y从(游戏游戏者 y)  )
    var sy = Math.abs(this.deltaYFrom($gamePlayer.y));
    //返回 sx + sy < 20
    return sx + sy < 20;
};
/**移动种类定制*/
Game_Event.prototype.moveTypeCustom = function() {
    //更新移动路线() 
    this.updateRoutineMove();
};
/**是开始中*/
Game_Event.prototype.isStarting = function() {
    //返回 开始中
    return this._starting;
};
/**清除开始中标志*/
Game_Event.prototype.clearStartingFlag = function() {
    //开始中 = false
    this._starting = false;
};
/**是触发在*/
Game_Event.prototype.isTriggerIn = function(triggers) {
    //返回 触发组 包含(触发)
    return triggers.contains(this._trigger);
};
/**开始*/
Game_Event.prototype.start = function() {
    //列表 = 列表()
    var list = this.list();
    //如果( 列表  并且 列表 长度 > 1 )
    if (list && list.length > 1) {
        //开始中 = true
        this._starting = true;
        //如果( 是触发在([0,1,2])  )
        if (this.isTriggerIn([0,1,2])) {
            //锁()
            this.lock();
        }
    }
};
/**抹去*/
Game_Event.prototype.erase = function() {
    //抹去的 = true 
    this._erased = true;
    //刷新()
    this.refresh();
};
/**刷新*/
Game_Event.prototype.refresh = function() {
    //新页索引 = 　抹去的　?　-1　: 寻找适当页索引()
    var newPageIndex = this._erased ? -1 : this.findProperPageIndex();
    //如果 (页索引 !== 新页索引)
    if (this._pageIndex !== newPageIndex) {
        //页索引 = 新页索引
        this._pageIndex = newPageIndex;
        //安装页()
        this.setupPage();
    }
};
/**寻找适当页索引*/
Game_Event.prototype.findProperPageIndex = function() {
    //页组 = 事件()页组
    var pages = this.event().pages;
    //循环(开始时 i = 页组 长度 - 1 ; i >=0 ; 每次 i--)
    for (var i = pages.length - 1; i >= 0; i--) {
        //页 = 页组[i]
        var page = pages[i];
        //如果(满足条件组(页))
        if (this.meetsConditions(page)) {
            //返回 i
            return i;
        }
    }
    //返回 -1
    return -1;
};
/**满足条件组*/
Game_Event.prototype.meetsConditions = function(page) {
    //c = 页 条件组
    var c = page.conditions;
    //如果(c 开关1有效)
    if (c.switch1Valid) {
        //如果(不是 游戏开关组 值(c 开关1id))
        if (!$gameSwitches.value(c.switch1Id)) {
            //返回 false
            return false;
        }
    }
    //如果(c 开关2有效)
    if (c.switch2Valid) {
        //如果(不是 游戏开关组 值(c 开关2id))
        if (!$gameSwitches.value(c.switch2Id)) {
            //返回 false
            return false;
        }
    }
    //如果(c 变量有效)
    if (c.variableValid) {
        //如果(游戏变量组 值(c 变量id) < c 变量值 )
        if ($gameVariables.value(c.variableId) < c.variableValue) {
            //返回 false
            return false;
        }
    }
    //如果(c 独立开关有效)
    if (c.selfSwitchValid) {
        //键 = [地图id , 事件id ,c 独立开关]
        var key = [this._mapId, this._eventId, c.selfSwitchCh];
        //如果(游戏独立开关组 值(键) !== true)
        if ($gameSelfSwitches.value(key) !== true) {
            //返回 false
            return false;
        }
    }
    //如果(c 物品开关有效)
    if (c.itemValid) {
        //物品 = 数据物品组[c 物品id]
        var item = $dataItems[c.itemId];
        //如果(不是 游戏队伍 有物品(item) )
        if (!$gameParty.hasItem(item)) {
            //返回 false
            return false;
        }
    }
    //如果(c 角色开关有效)
    if (c.actorValid) {
        //角色 = 游戏角色组 角色(c 角色id)
        var actor = $gameActors.actor(c.actorId);
        //如果(不是 游戏队伍 成员组() 包含(角色))
        if (!$gameParty.members().contains(actor)) {
            //返回 false
            return false;
        }
    }
    //返回 true
    return true;
};
/**安装页*/
Game_Event.prototype.setupPage = function() {
    //如果(页索引 >= 0)
    if (this._pageIndex >= 0) {
        //安装页安装()
        this.setupPageSettings();
    //否则
    } else {
        //清除页安装()
        this.clearPageSettings();
    }
    //刷新灌木丛深度()
    this.refreshBushDepth();
    //清除开始中标志()
    this.clearStartingFlag();
    //检查事件触发自动()
    this.checkEventTriggerAuto();
};
/**清除页安装*/
Game_Event.prototype.clearPageSettings = function() {
    //设置图像("", 0)
    this.setImage('', 0);
    //移动种类 = 0
    this._moveType = 0;
    //触发 = null
    this._trigger = null;
    //事件解释器 = null
    this._interpreter = null;
    //设置穿透(true)
    this.setThrough(true);
};
/**安装页安装*/
Game_Event.prototype.setupPageSettings = function() {
    //页 = 页()
    var page = this.page();
    //图像 = 页 图像
    var image = page.image;
    //如果( 图像 图块id > 0)
    if (image.tileId > 0) {
        //设置图块图像(图像 图块id)
        this.setTileImage(image.tileId);
    //否则
    } else {
        //设置图像( 图像 行走图名称,行走图索引)
        this.setImage(image.characterName, image.characterIndex);
    }
    //如果(原始方向 !== 图像 方向)
    if (this._originalDirection !== image.direction) {
        //原始方向  = 图像 方向
        this._originalDirection = image.direction;
        //锁方向 = 0
        this._prelockDirection = 0;
        //设置方向固定(false)
        this.setDirectionFix(false);
        //设置方向(图像 方向)
        this.setDirection(image.direction);
    }
    //如果(原始图案 !== 图像 图案)
    if (this._originalPattern !== image.pattern) {
        //原始图案 = 图像 图案
        this._originalPattern = image.pattern;
        //设置图案(图像 图案)
        this.setPattern(image.pattern);
    }
    //设置移动速度(页 移动速度)
    this.setMoveSpeed(page.moveSpeed);
    //设置移动频率(页 移动频率)
    this.setMoveFrequency(page.moveFrequency);
    //设置优先级(页 优先级)
    this.setPriorityType(page.priorityType);
    //设置行走动画(页 行走动画)
    this.setWalkAnime(page.walkAnime);
    //设置踏步动画(页 踏步动画)
    this.setStepAnime(page.stepAnime);
    //设置方向固定(页 方向固定)
    this.setDirectionFix(page.directionFix);
    //设置穿透(页 穿透)
    this.setThrough(page.through);
    //设置移动路线(页 移动路线)
    this.setMoveRoute(page.moveRoute);
    //移动种类 = 页 移动种类
    this._moveType = page.moveType;
    //触发 = 页 触发
    this._trigger = page.trigger;
    //如果(触发 === 4)
    if (this._trigger === 4) {
        //事件解释器 = 新 事件解释器()
        this._interpreter = new Game_Interpreter();
    //否则
    } else {
        //事件解释器 = null
        this._interpreter = null;
    }
};
/**是最初图案*/
Game_Event.prototype.isOriginalPattern = function() {
    //返回 图案() === 原始图案
    return this.pattern() === this._originalPattern;
};
/**重设最初*/
Game_Event.prototype.resetPattern = function() {
    //设置图案( 原始图案 )
    this.setPattern(this._originalPattern);
};
/**检查事件触摸触发*/
Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
    //如果(不是 游戏地图 是事件运转() )
    if (!$gameMap.isEventRunning()) {
        //如果(触发 === 2 并且 游戏游戏者 位于(x,y) )
        if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
            //如果(不是 是跳跃() 并且 是正常优先级() )
            if (!this.isJumping() && this.isNormalPriority()) {
                //开始()
                this.start();
            }
        }
    }
};
/**检查事件触发自动*/
Game_Event.prototype.checkEventTriggerAuto = function() {
    //如果(触发 == 3)
    if (this._trigger === 3) {
        //开始()
        this.start();
    }
};
/**更新*/
Game_Event.prototype.update = function() {
    //游戏人物 更新 呼叫(this)
    Game_Character.prototype.update.call(this);
    //检查事件触发自动()
    this.checkEventTriggerAuto();
    //更新并行()
    this.updateParallel();
};
/**更新并行*/
Game_Event.prototype.updateParallel = function() {
    //如果( 事件解释器 )
    if (this._interpreter) {
        //如果 (不是 事件解释器 是运转() )
        if (!this._interpreter.isRunning()) {
            //事件解释器 安装(列表(),事件id)
            this._interpreter.setup(this.list(), this._eventId);
        }
        //事件解释器 更新()
        this._interpreter.update();
    }
};
/**设于*/
Game_Event.prototype.locate = function(x, y) {
    //游戏人物 设于 呼叫(this,x,y)
    Game_Character.prototype.locate.call(this, x, y);
    //锁方向 = 0
    this._prelockDirection = 0;
};
/**强制移动路线*/
Game_Event.prototype.forceMoveRoute = function(moveRoute) {
    //游戏人物 强制移动路线 呼叫(this, 移动路线)
    Game_Character.prototype.forceMoveRoute.call(this, moveRoute);
    //锁方向 = 0
    this._prelockDirection = 0;
};
