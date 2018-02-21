
/**-----------------------------------------------------------------------------*/
/** Game_Character*/
/** 游戏人物*/
/** The superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event.*/
/** 游戏游戏者,游戏从者,游戏交通工具,游戏事件的超级类*/

function Game_Character() {
    this.initialize.apply(this, arguments);
}

/**设置原形 */
Game_Character.prototype = Object.create(Game_CharacterBase.prototype);
/**设置创造者*/
Game_Character.prototype.constructor = Game_Character;

/**路线结束*/
Game_Character.ROUTE_END               = 0;
/**路线移动下*/
Game_Character.ROUTE_MOVE_DOWN         = 1;
/**路线移动左*/
Game_Character.ROUTE_MOVE_LEFT         = 2;
/**路线移动右*/
Game_Character.ROUTE_MOVE_RIGHT        = 3;
/**路线移动上*/
Game_Character.ROUTE_MOVE_UP           = 4;
/**路线移动下左*/
Game_Character.ROUTE_MOVE_LOWER_L      = 5;
/**路线移动下右*/
Game_Character.ROUTE_MOVE_LOWER_R      = 6;
/**路线移动上左*/
Game_Character.ROUTE_MOVE_UPPER_L      = 7;
/**路线移动上右*/
Game_Character.ROUTE_MOVE_UPPER_R      = 8;
/**路线移动随机*/
Game_Character.ROUTE_MOVE_RANDOM       = 9;
/**路线移动接近*/
Game_Character.ROUTE_MOVE_TOWARD       = 10;
/**路线移动远离*/
Game_Character.ROUTE_MOVE_AWAY         = 11;
/**路线移动前进*/
Game_Character.ROUTE_MOVE_FORWARD      = 12;
/**路线移动后退*/
Game_Character.ROUTE_MOVE_BACKWARD     = 13;
/**路线跳*/
Game_Character.ROUTE_JUMP              = 14;
/**路线等待*/
Game_Character.ROUTE_WAIT              = 15;
/**路线转下*/
Game_Character.ROUTE_TURN_DOWN         = 16;
/**路线转左*/
Game_Character.ROUTE_TURN_LEFT         = 17;
/**路线转右*/
Game_Character.ROUTE_TURN_RIGHT        = 18;
/**路线转上*/
Game_Character.ROUTE_TURN_UP           = 19;
/**路线转90度右*/
Game_Character.ROUTE_TURN_90D_R        = 20;
/**路线转90度左*/
Game_Character.ROUTE_TURN_90D_L        = 21;
/**路线转180度*/
Game_Character.ROUTE_TURN_180D         = 22;
/**路线转90度左右*/
Game_Character.ROUTE_TURN_90D_R_L      = 23;
/**路线转随机*/
Game_Character.ROUTE_TURN_RANDOM       = 24;
/**路线转向游戏者*/
Game_Character.ROUTE_TURN_TOWARD       = 25;
/**路线转离游戏者*/
Game_Character.ROUTE_TURN_AWAY         = 26;
/**路线开关开*/
Game_Character.ROUTE_SWITCH_ON         = 27;
/**路线开关关*/
Game_Character.ROUTE_SWITCH_OFF        = 28;
/**路线改变移动速度*/
Game_Character.ROUTE_CHANGE_SPEED      = 29;
/**路线改变移动频率*/
Game_Character.ROUTE_CHANGE_FREQ       = 30;
/**路线行走动画开*/
Game_Character.ROUTE_WALK_ANIME_ON     = 31;
/**路线行走动画关*/
Game_Character.ROUTE_WALK_ANIME_OFF    = 32;
/**路线踏步动画开*/
Game_Character.ROUTE_STEP_ANIME_ON     = 33;
/**路线踏步动画关*/
Game_Character.ROUTE_STEP_ANIME_OFF    = 34;
/**路线方向固定开*/
Game_Character.ROUTE_DIR_FIX_ON        = 35; 
/**路线方向固定关*/
Game_Character.ROUTE_DIR_FIX_OFF       = 36;
/**路线穿透开*/
Game_Character.ROUTE_THROUGH_ON        = 37;
/**路线穿透关*/
Game_Character.ROUTE_THROUGH_OFF       = 38;
/**路线透明开*/
Game_Character.ROUTE_TRANSPARENT_ON    = 39;
/**路线透明关*/
Game_Character.ROUTE_TRANSPARENT_OFF   = 40;
/**路线改变图像*/
Game_Character.ROUTE_CHANGE_IMAGE      = 41;
/**路线改变不透明度*/
Game_Character.ROUTE_CHANGE_OPACITY    = 42;
/**路线改变合成方式*/
Game_Character.ROUTE_CHANGE_BLEND_MODE = 43;
/**路线播放se*/
Game_Character.ROUTE_PLAY_SE           = 44;
/**路线脚本*/
Game_Character.ROUTE_SCRIPT            = 45;
/**初始化*/
Game_Character.prototype.initialize = function() {
    //游戏人物基础 初始化 呼叫(this)
    Game_CharacterBase.prototype.initialize.call(this);
};
/**初始化成员*/
Game_Character.prototype.initMembers = function() {
    //游戏人物基础 初始化成员 呼叫(this)
    Game_CharacterBase.prototype.initMembers.call(this);
    //强制移动路线 = false
    this._moveRouteForcing = false;
    //移动路线 = null
    this._moveRoute = null;
    //移动路线索引 = 0
    this._moveRouteIndex = 0;
    //原始移动路线 = null
    this._originalMoveRoute = null;
    //原始移动路线索引 = 0
    this._originalMoveRouteIndex = 0;
    //等待计数 = 0 
    this._waitCount = 0;
};
/**记录移动路线*/
Game_Character.prototype.memorizeMoveRoute = function() {
    //原始移动路线 = 移动路线
    this._originalMoveRoute       = this._moveRoute;
    //原始移动路线索引 = 移动路线索引
    this._originalMoveRouteIndex  = this._moveRouteIndex;
};
/**恢复移动路线*/
Game_Character.prototype.restoreMoveRoute = function() {
    //移动路线 = 原始移动路线
    this._moveRoute          = this._originalMoveRoute;
    //移动路线索引 = 原始移动路线索引
    this._moveRouteIndex     = this._originalMoveRouteIndex;
    //原始移动路线 = null
    this._originalMoveRoute  = null;
};
/**是强制移动路线*/
Game_Character.prototype.isMoveRouteForcing = function() {
    //返回 强制移动路线
    return this._moveRouteForcing;
};
/**设置移动路线*/
Game_Character.prototype.setMoveRoute = function(moveRoute) {
    //移动路线 = 移动路线
    this._moveRoute = moveRoute;
    //移动路线索引 = 0
    this._moveRouteIndex = 0;
    //强制移动路线 = false
    this._moveRouteForcing = false;
};
/**强制移动路线*/
Game_Character.prototype.forceMoveRoute = function(moveRoute) {
    //如果(不是 原始移动路线)
    if (!this._originalMoveRoute) {
        //记录移动路线()
        this.memorizeMoveRoute();
    }
    //移动路线 = 移动路线
    this._moveRoute = moveRoute;
    //移动路线索引 = 0
    this._moveRouteIndex = 0;
    //强制移动路线 = true
    this._moveRouteForcing = true;
    //等待计数 = 0
    this._waitCount = 0;
};
/**更新停止*/
Game_Character.prototype.updateStop = function() {
    //游戏人物基础 更新停止 呼叫(this)
    Game_CharacterBase.prototype.updateStop.call(this);
    //如果(强制移动路线)
    if (this._moveRouteForcing) {
        //更新移动路线()
        this.updateRoutineMove();
    }
};
/**更新移动路线*/
Game_Character.prototype.updateRoutineMove = function() {
    //如果(等待计数 > 0 )
    if (this._waitCount > 0) {
        //等待计数 --
        this._waitCount--;
    //否则
    } else {
        //设置移动成功(true)
        this.setMovementSuccess(true);
        //命令 = 移动路线 列表[移动路线索引]
        var command = this._moveRoute.list[this._moveRouteIndex];
        //如果(命令)
        if (command) {
            //进行移动命令(命令)
            this.processMoveCommand(command);
            //增加移动路线索引()
            this.advanceMoveRouteIndex();
        }
    }
};
/**进行移动命令*/
Game_Character.prototype.processMoveCommand = function(command) {
    //gc = 游戏人物 
    var gc = Game_Character;
    //参数组 = 命令 参数组
    var params = command.parameters;
    //检查(命令 编码)
    switch (command.code) {
    //当 游戏人物 路线结束 /**0*/:
    case gc.ROUTE_END:
        //进行路线结束()
        this.processRouteEnd();
		//中断
        break;
    //当 游戏人物 路线移动下 /**1*/:
    case gc.ROUTE_MOVE_DOWN:
        //移动直线(2)
        this.moveStraight(2);
		//中断
        break;
    //当 游戏人物 路线移动左 /**2*/:
    case gc.ROUTE_MOVE_LEFT:
        //移动直线(4)
        this.moveStraight(4);
		//中断
        break;
    //当 游戏人物 路线移动右 /**3*/:
    case gc.ROUTE_MOVE_RIGHT:
        //移动直线(6)
        this.moveStraight(6);
		//中断
        break;
    //当 游戏人物 路线移动上 /**4*/:
    case gc.ROUTE_MOVE_UP:
        //移动直线(8)
        this.moveStraight(8);
		//中断
        break;
    //当 游戏人物 路线移动下左 /**5*/:
    case gc.ROUTE_MOVE_LOWER_L:
        //移动对角(4,2)
        this.moveDiagonally(4, 2);
		//中断
        break;
    //当 游戏人物 路线移动下右 /**6*/:
    case gc.ROUTE_MOVE_LOWER_R:
        //移动对角(6,2)
        this.moveDiagonally(6, 2);
		//中断
        break;
    //当 游戏人物 路线移动上左 /**7*/:
    case gc.ROUTE_MOVE_UPPER_L:
        //移动对角(4,8)
        this.moveDiagonally(4, 8);
		//中断
        break;
    //当 游戏人物 路线移动上右 /**8*/:
    case gc.ROUTE_MOVE_UPPER_R:
        //移动对角(6,8)
        this.moveDiagonally(6, 8);
		//中断
        break;
    //当 游戏人物 路线移动随机 /**9*/:
    case gc.ROUTE_MOVE_RANDOM:
        //移动随机()
        this.moveRandom();
		//中断
        break;
    //当 游戏人物 路线移动接近 /**10*/:
    case gc.ROUTE_MOVE_TOWARD:
        //移动向游戏者()
        this.moveTowardPlayer();
		//中断
        break;
	//当 游戏人物 路线移动远离 /**11*/:
    case gc.ROUTE_MOVE_AWAY:
        //移动远离从游戏者()
        this.moveAwayFromPlayer();
		//中断
        break;
	//当 游戏人物 路线移动前进 /**12*/:
    case gc.ROUTE_MOVE_FORWARD:
        //移动前进()
        this.moveForward();
		//中断
        break;
	//当 游戏人物 路线移动后退 /**13*/:
    case gc.ROUTE_MOVE_BACKWARD:
        //移动后退()
        this.moveBackward();
		//中断
        break;
	//当 游戏人物 路线跳 /**14*/:
    case gc.ROUTE_JUMP:
        //跳(参数组[0],参数组[1])
        this.jump(params[0], params[1]);
		//中断
        break;
	//当 游戏人物 路线等待 /**15*/:
    case gc.ROUTE_WAIT:
        //等待计数 = 参数组[0] - 1 
        this._waitCount = params[0] - 1;
		//中断
        break;
	//当 游戏人物 路线转下 /**16*/:
    case gc.ROUTE_TURN_DOWN:
        //设置方向(2)
        this.setDirection(2);
		//中断
        break;
	//当 游戏人物 路线转左 /**17*/:
    case gc.ROUTE_TURN_LEFT:
        //设置方向(4)
        this.setDirection(4);
		//中断
        break;
	//当 游戏人物 路线转右 /**18*/:
    case gc.ROUTE_TURN_RIGHT:
        //设置方向(6)
        this.setDirection(6);
		//中断
        break;
	//当 游戏人物 路线转上 /**19*/:
    case gc.ROUTE_TURN_UP:
        //设置方向(8)
        this.setDirection(8);
		//中断
        break;
	//当 游戏人物 路线转90度右 /**20*/:
    case gc.ROUTE_TURN_90D_R:
        //右转90()
        this.turnRight90();
		//中断
        break;
	//当 游戏人物 路线转90度左 /**21*/:
    case gc.ROUTE_TURN_90D_L:
        //左转90()
        this.turnLeft90();
		//中断
        break;
	//当 游戏人物 路线转180度 /**22*/:
    case gc.ROUTE_TURN_180D:
        //转180()
        this.turn180();
		//中断
        break;
	//当 游戏人物 路线转90度左右 /**23*/:
    case gc.ROUTE_TURN_90D_R_L:
        //转左或右90()
        this.turnRightOrLeft90();
		//中断
        break;
	//当 游戏人物 路线转随机 /**24*/:
    case gc.ROUTE_TURN_RANDOM:
        this.turnRandom();
		//中断
        break;
	//当 游戏人物 路线转向游戏者 /**25*/:
    case gc.ROUTE_TURN_TOWARD:
        //转向游戏者()
        this.turnTowardPlayer();
		//中断
        break;
	//当 游戏人物 路线转离游戏者 /**26*/:
    case gc.ROUTE_TURN_AWAY:
        //转离游戏者()
        this.turnAwayFromPlayer();
		//中断
        break;
	//当 游戏人物 路线开关开 /**27*/:
    case gc.ROUTE_SWITCH_ON:
        //游戏开关组 设置值( 参数组[0], true)
        $gameSwitches.setValue(params[0], true);
		//中断
        break;
	//当 游戏人物 路线开关关 /**28*/:
    case gc.ROUTE_SWITCH_OFF:
        //游戏开关组 设置值( 参数组[0], false)
        $gameSwitches.setValue(params[0], false);
		//中断
        break;
	//当 游戏人物 路线改变移动速度 /**29*/:
    case gc.ROUTE_CHANGE_SPEED:
        //设置移动速度(参数组[0] )
        this.setMoveSpeed(params[0]);
		//中断
        break;
	//当 游戏人物 路线改变移动频率 /**30*/:
    case gc.ROUTE_CHANGE_FREQ:
        //设置移动频率(参数组[0] )
        this.setMoveFrequency(params[0]);
		//中断
        break;
	//当 游戏人物 路线行走动画开 /**31*/:
    case gc.ROUTE_WALK_ANIME_ON:
        //设置行走动画(true)
        this.setWalkAnime(true);
		//中断
        break;
	//当 游戏人物 路线行走动画关 /**32*/:
    case gc.ROUTE_WALK_ANIME_OFF:
        //设置行走动画(false)
        this.setWalkAnime(false);
		//中断
        break;
	//当 游戏人物 路线踏步动画开 /**33*/:
    case gc.ROUTE_STEP_ANIME_ON:
        //设置踏步动画(true)
        this.setStepAnime(true);
		//中断
        break;
	//当 游戏人物 路线踏步动画关 /**34*/:
    case gc.ROUTE_STEP_ANIME_OFF:
        //设置踏步动画(false)
        this.setStepAnime(false);
		//中断
        break;
	//当 游戏人物 路线方向固定开 /**35*/:
    case gc.ROUTE_DIR_FIX_ON:
        //设置方向固定(true)
        this.setDirectionFix(true);
		//中断
        break;
	//当 游戏人物 路线方向固定关 /**36*/:
    case gc.ROUTE_DIR_FIX_OFF:
        //设置方向固定(false)
        this.setDirectionFix(false);
		//中断
        break;
	//当 游戏人物 路线穿透开 /**37*/:
    case gc.ROUTE_THROUGH_ON:
        //设置穿透(true)
        this.setThrough(true);
		//中断
        break;
	//当 游戏人物 路线穿透关 /**38*/:
    case gc.ROUTE_THROUGH_OFF:
        //设置穿透(false)
        this.setThrough(false);
		//中断
        break;
	//当 游戏人物 路线透明开 /**39*/:
    case gc.ROUTE_TRANSPARENT_ON:
        //设置透明(true)
        this.setTransparent(true);
		//中断
        break;
	//当 游戏人物 路线透明关 /**40*/:
    case gc.ROUTE_TRANSPARENT_OFF:
        //设置透明(false)
        this.setTransparent(false);
		//中断
        break;
	//当 游戏人物 路线改变图像 /**41*/:
    case gc.ROUTE_CHANGE_IMAGE:
        //设置图像(参数组[0], 参数组[1])
        this.setImage(params[0], params[1]);
		//中断
        break;
	//当 游戏人物 路线改变不透明度 /**42*/:
    case gc.ROUTE_CHANGE_OPACITY:
        //设置不透明度(参数组[0])
        this.setOpacity(params[0]);
		//中断
        break;
	//当 游戏人物 路线改变合成方式 /**43*/:
    case gc.ROUTE_CHANGE_BLEND_MODE:
        //设置合成方式(参数组[0])
        this.setBlendMode(params[0]);
		//中断
        break;
	//当 游戏人物 路线播放se /**44*/:
    case gc.ROUTE_PLAY_SE:
        //音频管理器 播放se( 参数组[0])
        AudioManager.playSe(params[0]);
		//中断
        break;
    //当 游戏人物 路线脚本 /**45*/:
    case gc.ROUTE_SCRIPT:
        //估值( 参数组[0] )
        eval(params[0]);
		//中断
        break;
    }
};
/**三角x从*/
Game_Character.prototype.deltaXFrom = function(x) {
    //返回 游戏地图 三角x( x, x)
    return $gameMap.deltaX(this.x, x);
};
/**三角y从*/
Game_Character.prototype.deltaYFrom = function(y) {
    //返回 游戏地图 三角y( y,y)
    return $gameMap.deltaY(this.y, y);
};
/**移动随机*/
Game_Character.prototype.moveRandom = function() {
    //d = 2 + 数学 随机整数(4) * 2
    var d = 2 + Math.randomInt(4) * 2;
    //如果(能通过(x,y,d))
    if (this.canPass(this.x, this.y, d)) {
        //移动直线(d)
        this.moveStraight(d);
    }
};
/**移动向人物*/
Game_Character.prototype.moveTowardCharacter = function(character) {
    //sx = 三角x从(人物 x)
    var sx = this.deltaXFrom(character.x);
    //sy = 三角y从(人物 y)
    var sy = this.deltaYFrom(character.y);
    //如果( 数学 绝对值(sx) > 数学 绝对值(sy) )
    if (Math.abs(sx) > Math.abs(sy)) {
        //移动直线(sx > 0 ? 4 : 6)
        this.moveStraight(sx > 0 ? 4 : 6);
        //如果(不是 是移动成功的(0 并且 sy != 0 ))
        if (!this.isMovementSucceeded() && sy !== 0) {
            //移动直线(sy > 0 ? 8 : 2)
            this.moveStraight(sy > 0 ? 8 : 2);
        }
    //否则 如果(sy !== 0 )
    } else if (sy !== 0) {
        //移动直线(sy > 0 ? 8 : 2)
        this.moveStraight(sy > 0 ? 8 : 2);
        //如果(不是 是移动成功的(0 并且 sx != 0 ))
        if (!this.isMovementSucceeded() && sx !== 0) {
            //移动直线(sx > 0 ? 4 : 6)
            this.moveStraight(sx > 0 ? 4 : 6);
        }
    }
};
/**移动远离从人物*/
Game_Character.prototype.moveAwayFromCharacter = function(character) {
    //sx = 三角x从(人物 x)
    var sx = this.deltaXFrom(character.x);
    //sy = 三角y从(人物 y)
    var sy = this.deltaYFrom(character.y);
    //如果( 数学 绝对值(sx) > 数学 绝对值(sy) )
    if (Math.abs(sx) > Math.abs(sy)) {
        //移动直线(sx > 0 ? 6 : 4)
        this.moveStraight(sx > 0 ? 6 : 4);
        //如果(不是 是移动成功的(0 并且 sy != 0 ))
        if (!this.isMovementSucceeded() && sy !== 0) {
            //移动直线(sy > 0 ? 2 : 8)
            this.moveStraight(sy > 0 ? 2 : 8);
        }
    //否则 如果(sy !== 0 )
    } else if (sy !== 0) {
        //移动直线(sy > 0 ? 2 : 8)
        this.moveStraight(sy > 0 ? 2 : 8);
        //如果(不是 是移动成功的(0 并且 sx != 0 ))
        if (!this.isMovementSucceeded() && sx !== 0) {
            //移动直线(sx > 0 ? 6 : 4)
            this.moveStraight(sx > 0 ? 6 : 4);
        }
    }
};
/**转向人物*/
Game_Character.prototype.turnTowardCharacter = function(character) {
    //sx = 三角x从(人物 x)
    var sx = this.deltaXFrom(character.x);
    //sy = 三角y从(人物 y)
    var sy = this.deltaYFrom(character.y);
    //如果( 数学 绝对值(sx) > 数学 绝对值(sy) )
    if (Math.abs(sx) > Math.abs(sy)) {
        //设置方向 ( sx > 0 ? 4 : 6  )
        this.setDirection(sx > 0 ? 4 : 6);
    //否则 如果(sy !== 0 )
    } else if (sy !== 0) {
        //设置方向 ( sy > 0 ? 8 : 2  )
        this.setDirection(sy > 0 ? 8 : 2);
    }
};
/**转离人物*/
Game_Character.prototype.turnAwayFromCharacter = function(character) {
    //sx = 三角x从(人物 x)
    var sx = this.deltaXFrom(character.x);
    //sy = 三角y从(人物 y)
    var sy = this.deltaYFrom(character.y);
    //如果( 数学 绝对值(sx) > 数学 绝对值(sy) )
    if (Math.abs(sx) > Math.abs(sy)) {
        //设置方向 ( sx > 0 ? 6 : 4 )
        this.setDirection(sx > 0 ? 6 : 4);
    //否则 如果(sy !== 0 )
    } else if (sy !== 0) {
        //设置方向 ( sy > 0 ? 2 : 8 )
        this.setDirection(sy > 0 ? 2 : 8);
    }
};
/**转向游戏者*/
Game_Character.prototype.turnTowardPlayer = function() {
    //转向人物(游戏游戏者)
    this.turnTowardCharacter($gamePlayer);
};
/**转离游戏者*/
Game_Character.prototype.turnAwayFromPlayer = function() {
    //转离人物(游戏游戏者)
    this.turnAwayFromCharacter($gamePlayer);
};
/**移动向游戏者*/
Game_Character.prototype.moveTowardPlayer = function() {
    //移动向人物(游戏游戏者)
    this.moveTowardCharacter($gamePlayer);
};
/**移动远离从游戏者*/
Game_Character.prototype.moveAwayFromPlayer = function() {
    //移动远离从人物(游戏游戏者)
    this.moveAwayFromCharacter($gamePlayer);
};
/**移动前进*/
Game_Character.prototype.moveForward = function() {
    //移动直线( 方向() )
    this.moveStraight(this.direction());
};
/**移动后退(不转身)*/
Game_Character.prototype.moveBackward = function() {
    //之前方向固定 = 是方向固定()
    var lastDirectionFix = this.isDirectionFixed();
    //设置方向固定(true)
    this.setDirectionFix(true);
    //移动直线( 相反方向( 方向() )  )
    this.moveStraight(this.reverseDir(this.direction()));
    //设置方向固定(之前方向固定)
    this.setDirectionFix(lastDirectionFix);
};
/**进行路线结束*/
Game_Character.prototype.processRouteEnd = function() {
    //如果( 移动路线 重复)
    if (this._moveRoute.repeat) {
        //移动路线索引 = -1
        this._moveRouteIndex = -1;
    //否则 如果(强制移动路线)
    } else if (this._moveRouteForcing) {
        //强制移动路线 = false
        this._moveRouteForcing = false;
        //恢复移动路线()
        this.restoreMoveRoute();
    }
};
/**增加移动路线索引*/
Game_Character.prototype.advanceMoveRouteIndex = function() {
    //移动路线 = 移动路线
    var moveRoute = this._moveRoute;
    //如果( 移动路线 并且 (是移动成功的() 或者 移动路线 跳过 )   )
    if (moveRoute && (this.isMovementSucceeded() || moveRoute.skippable)) {
        //数命令 = 移动路线 列表 长度 - 1
        var numCommands = moveRoute.list.length - 1;
        //移动路线索引++
        this._moveRouteIndex++;
        //如果(移动路线  重复 并且 移动路线索引 >= 数命令)
        if (moveRoute.repeat && this._moveRouteIndex >= numCommands) {
            //移动路线索引 = 0 
            this._moveRouteIndex = 0;
        }
    }
};
/**右转90*/
Game_Character.prototype.turnRight90 = function() {
    //检查( 方向() )
    switch (this.direction()) {
    //当 2 :
    case 2:
        //设置方向(4)
        this.setDirection(4);
        //中断
        break;
    //当 4 :
    case 4:
        //设置方向(8)
        this.setDirection(8);
        //中断
        break;
    //当 6 :
    case 6:
        //设置方向(2)
        this.setDirection(2);
        //中断
        break;
    //当 8 :
    case 8:
        //设置方向(6)
        this.setDirection(6);
        //中断
        break;
    }
};
/**左转90*/
Game_Character.prototype.turnLeft90 = function() {
    //检查( 方向() )
    switch (this.direction()) {
    //当 2 :
    case 2:
        //设置方向(6)
        this.setDirection(6);
        //中断
        break;
    //当 4 :
    case 4:
        //设置方向(2)
        this.setDirection(2);
        //中断
        break;
    //当 6 :
    case 6:
        //设置方向(8)
        this.setDirection(8);
        //中断
        break;
    //当 8 :
    case 8:
        //设置方向(4)
        this.setDirection(4);
        //中断
        break;
    }
};
/**转180*/
Game_Character.prototype.turn180 = function() {
    //设置方向( 相反方向(方向() ) )
    this.setDirection(this.reverseDir(this.direction()));
};
/**转左或右90*/
Game_Character.prototype.turnRightOrLeft90 = function() {
    //检查(数学 随机整数(2) )
    switch (Math.randomInt(2)) {
    //当 0 :
    case 0:
        //右转90()
        this.turnRight90();
        //中断
        break;
    //当 1 :
    case 1:
        //左转90()
        this.turnLeft90();
        //中断
        break;
    }
};
/**随机转*/
Game_Character.prototype.turnRandom = function() {
    //设置方向(2 + 数学 随机整数(4) * 2)
    this.setDirection(2 + Math.randomInt(4) * 2);
};
/**交换*/
Game_Character.prototype.swap = function(character) {
    //新x = 人物 x
    var newX = character.x;
    //新y = 人物 y
    var newY = character.y;
    //人物 设于(x,y)
    character.locate(this.x, this.y);
    //设于(新x ,新y )
    this.locate(newX, newY);
};
/**寻找方向到*/
Game_Character.prototype.findDirectionTo = function(goalX, goalY) {
    //搜寻限制 = 搜寻限制()
    var searchLimit = this.searchLimit();
    //地图宽 = 游戏地图 宽()
    var mapWidth = $gameMap.width();
    //节点列表 = []
    var nodeList = [];
    //打开列表 = []
    var openList = [];
    //关闭列表 = []
    var closedList = [];
    //开始 = {}
    var start = {};
    //最好 = 开始
    var best = start;
    //如果(x == 目标x 并且 y == 目标y)
    if (this.x === goalX && this.y === goalY) {
        //返回 0
        return 0;
    }

    //开始 父亲 = null
    start.parent = null;
    //开始 x = x
    start.x = this.x;
    //开始 y = y
    start.y = this.y;
    //开始 g = 0
    start.g = 0;
    //开始 f = 游戏地图 距离(开始 x ,开始 y , 目标x ,目标y)
    start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
    //节点列表 添加(开始)
    nodeList.push(start);
    //打开列表 添加(开始 y * 地图宽 + 开始 x)
    openList.push(start.y * mapWidth + start.x);
    
    //当(节点列表 长度 > 0)
    while (nodeList.length > 0) {
        //最好索引 = 0
        var bestIndex = 0;
        //循环(开始时 i = 0 ;当 i < 节点列表 长度 ; 每一次 i++)
        for (var i = 0; i < nodeList.length; i++) {
            //如果(节点列表[i] f < 节点列表[最好索引] f)
            if (nodeList[i].f < nodeList[bestIndex].f) {
                //最好索引 = i
                bestIndex = i;
            }
        }
        
        //当前 = 节点列表[最好索引]
        var current = nodeList[bestIndex];
        //x1 = 当前 x
        var x1 = current.x;
        //y1 = 当前 y
        var y1 = current.y;
        //位置1 = y1 * 地图宽 + x1
        var pos1 = y1 * mapWidth + x1;
        //g1 = 当前 g
        var g1 = current.g;
        
        //节点列表 剪切(最好索引 ,1)
        nodeList.splice(bestIndex, 1);
        //打开列表 剪切(打开列表 索引于(位置1) ,1)
        openList.splice(openList.indexOf(pos1), 1);
        //关闭列表 添加(位置1)
        closedList.push(pos1);

        //如果(当前 x == 目标x 并且 当前 y == 目标y)
        if (current.x === goalX && current.y === goalY) {
            //最好 = 当前
            best = current;
            //中断
            break;
        }

        //如果( g1 >= 搜寻限制 )
        if (g1 >= searchLimit) {
            //下一个
            continue;
        }

        //循环 (开始时 j = 0 ;当 j < 4 ;每一次 j++)
        for (var j = 0; j < 4; j++) {
            //方向 = 2+j*2
            var direction = 2 + j * 2;
            //x2 = 游戏地图 环x和方向(x1 ,方向 )
            var x2 = $gameMap.roundXWithDirection(x1, direction);
            //y2 = 游戏地图 环y和方向(y1 ,方向 )
            var y2 = $gameMap.roundYWithDirection(y1, direction);
            //位置2 = y2 * 地图宽 + x2
            var pos2 = y2 * mapWidth + x2;

            //如果(关闭列表 包含(位置2))
            if (closedList.contains(pos2)) {
                //下一个
                continue;
            }
            //如果(不是 能通过(x1,y1,方向))
            if (!this.canPass(x1, y1, direction)) {
                //下一个
                continue;
            }

            //g2 = g1 + 1
            var g2 = g1 + 1;
            //索引2 = 打开列表 索引于(位置2)
            var index2 = openList.indexOf(pos2);

            //如果(索引列表 < 0 或者 g2 < 节点列表[索引2] g)
            if (index2 < 0 || g2 < nodeList[index2].g) {
                //邻居
                var neighbor;
                //如果(索引2 >= 0)
                if (index2 >= 0) {
                    //邻居 = 节点列表[索引2]
                    neighbor = nodeList[index2];
                //否则 
                } else {
                    //邻居 = {}
                    neighbor = {};
                    //节点列表 添加(邻居)
                    nodeList.push(neighbor);
                    //打开列表 添加(位置2)
                    openList.push(pos2);
                }
                //邻居 父亲 = 当前
                neighbor.parent = current;
                //邻居 x = x2
                neighbor.x = x2;
                //邻居 y = y2 
                neighbor.y = y2;
                //邻居 g = g2
                neighbor.g = g2;
                //邻居 f = g2 + 游戏地图 距离(x2,y2,目标x,目标y)
                neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
                //如果(不是 最好 或者 邻居 f - 邻居 g < 最好 f - 最好 g )
                if (!best || neighbor.f - neighbor.g < best.f - best.g) {
                    //最好 = 邻居
                    best = neighbor;
                }
            }
        }
    }
    
    //节点 = 最好
    var node = best;
    //当(节点 父亲 并且 节点 父亲 !== 开始)
    while (node.parent && node.parent !== start) {
        //节点 = 节点 父亲
        node = node.parent;
    }

    //三角x1 = 游戏地图 三角x(节点 x ,开始 x) 
    var deltaX1 = $gameMap.deltaX(node.x, start.x);
    //三角y1 = 游戏地图 三角y(节点 y, 开始 y)
    var deltaY1 = $gameMap.deltaY(node.y, start.y);
    //如果(三角y1 > 0)
    if (deltaY1 > 0) {
        //返回 2
        return 2;
    //否则 如果(三角x1 < 0)
    } else if (deltaX1 < 0) {
        //返回 4
        return 4;
    //否则 如果(三角x1 > 0)
    } else if (deltaX1 > 0) {
        return 6;
    //否则 如果(三角y1 < 0)
    } else if (deltaY1 < 0) {
        //返回 8
        return 8;
    }

    //三角x2 = 三角x从(目标x)
    var deltaX2 = this.deltaXFrom(goalX);
    //三角y2 = 三角y从(目标y)
    var deltaY2 = this.deltaYFrom(goalY);
    //如果(数学 绝对值(三角x2) > 数学 绝对值(三角y2) )
    if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
        //返回 三角x2 > 0 ?  4 : 6 
        return deltaX2 > 0 ? 4 : 6;
    //否则 如果(三角y2 !== 0)
    } else if (deltaY2 !== 0) {
        //返回 三角y2 > 0 ?  4 : 6 
        return deltaY2 > 0 ? 8 : 2;
    }
    
    //返回 0
    return 0;
};
/**搜寻限制*/
Game_Character.prototype.searchLimit = function() {
    //返回 12
    return 12;
};
