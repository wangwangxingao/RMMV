
/**-----------------------------------------------------------------------------*/
/** Game_CharacterBase*/
/** 游戏人物基础*/
/** The superclass of Game_Character. It handles basic information, such as*/
/** coordinates and images, shared by all characters.*/
/** 游戏人物的超级类.包含所有人物坐标图像之类的基础信息*/

function Game_CharacterBase() {
    this.initialize.apply(this, arguments);
}

Object.defineProperties(Game_CharacterBase.prototype, {
    x: { 
	//获得 x    返回 x  可设置 true
    get: function() { return this._x; }, configurable: true },
    y: { 
	//获得 y   返回 x  可设置 true
    get: function() { return this._y; }, configurable: true }
});
/**初始化*/
Game_CharacterBase.prototype.initialize = function() {
	//初始化成员
    this.initMembers();
};
/**初始化成员*/
Game_CharacterBase.prototype.initMembers = function() {
	//x = 0
    this._x = 0;
    //y = 0
    this._y = 0;
    //真x = 0
    this._realX = 0;
    //真y = 0
    this._realY = 0;
    //移动速度 = 4
    this._moveSpeed = 4;
    //移动频率 = 5
    this._moveFrequency = 6;
    //不透明度 = 255
    this._opacity = 255;
    //混合模式 = 0
    this._blendMode = 0;
    //方向 = 2
    this._direction = 2;
    //图案 = 1
    this._pattern = 1;
    //优先级 = 1 
    this._priorityType = 1;
    //图块id = 0
    this._tileId = 0;
    //行走图名称 = ''
    this._characterName = '';
    //行走图索引 = 0
    this._characterIndex = 0;
    //是物体特征 = false
    this._isObjectCharacter = false;
    //行走动画 = true 
    this._walkAnime = true;
    //踏步动画 = false
    this._stepAnime = false;
    //方向固定 = false 
    this._directionFix = false;
    //穿透 = false
    this._through = false;
    //透明 = false
    this._transparent = false;
    //灌木丛深度 = 0
    this._bushDepth = 0;
    //动画id = 0
    this._animationId = 0;
    //气球id = 0
    this._balloonId = 0;
    //动画播放中 = false
    this._animationPlaying = false;
    //气球播放中 = false
    this._balloonPlaying = false;
    //动画计数 = 0
    this._animationCount = 0;
    //停止计数 = 0
    this._stopCount = 0;
    //跳跃计数 = 0
    this._jumpCount = 0;
    //跳跃波峰 = 0
    this._jumpPeak = 0;
    //移动成功 = true
    this._movementSuccess = true;
};
/**位于*/
Game_CharacterBase.prototype.pos = function(x, y) {
	//返回 x === x 并且  y === y 
    return this._x === x && this._y === y;
};
/**位于无穿越*/
Game_CharacterBase.prototype.posNt = function(x, y) {
    // No through
    //返回 位于(x,y) 并且 不是 是穿越()
    return this.pos(x, y) && !this.isThrough();
};
/**移动速度*/
Game_CharacterBase.prototype.moveSpeed = function() {
	//返回 移动速度
    return this._moveSpeed;
};
/**设置移动速度*/
Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed) {
	//移动速度 = moveSpeed//移动速度
    this._moveSpeed = moveSpeed;
};
/**移动频率*/
Game_CharacterBase.prototype.moveFrequency = function() {
	//返回 移动频率
    return this._moveFrequency;
};
/**设置移动频率*/
Game_CharacterBase.prototype.setMoveFrequency = function(moveFrequency) {
	//移动频率  =  moveFrequency//移动频率
    this._moveFrequency = moveFrequency;
};
/**不透明度*/
Game_CharacterBase.prototype.opacity = function() {
	//返回 不透明度
    return this._opacity;
};
/**设置不透明度*/
Game_CharacterBase.prototype.setOpacity = function(opacity) {
	//不透明度 = opacity//不透明度
    this._opacity = opacity;
};
/**混合模式*/
Game_CharacterBase.prototype.blendMode = function() {
	//返回 混合模式
    return this._blendMode;
};
/**设置混合模式*/
Game_CharacterBase.prototype.setBlendMode = function(blendMode) {
	//混合模式 =  blendMode//混合模式
    this._blendMode = blendMode;
};
/**是正常优先级*/
Game_CharacterBase.prototype.isNormalPriority = function() {
	//返回 优先级 === 1
    return this._priorityType === 1;
};
/**设置优先级*/
Game_CharacterBase.prototype.setPriorityType = function(priorityType) {
	//优先级 = priorityType//优先级 
    this._priorityType = priorityType;
};
/**是移动中*/
Game_CharacterBase.prototype.isMoving = function() {
	//返回 真x !== x 或者 真y !== y
    return this._realX !== this._x || this._realY !== this._y;
};
/**是跳跃*/
Game_CharacterBase.prototype.isJumping = function() {
	//返回 跳跃计数 > 0
    return this._jumpCount > 0;
};
/**跳跃高*/
Game_CharacterBase.prototype.jumpHeight = function() {
	//返回 ( 跳跃波峰 *  跳跃波峰 -   数学 幂(数学 绝对值(跳跃计数 - 跳跃波峰) ,2 )) / 2
	// (h^2 - ( t-h )^2 ) / 2 
    return (this._jumpPeak * this._jumpPeak -
            Math.pow(Math.abs(this._jumpCount - this._jumpPeak), 2)) / 2;
};
/**是停止*/
Game_CharacterBase.prototype.isStopping = function() {
	//返回 不是 是移动中() 并且 不是 是跳跃()
    return !this.isMoving() && !this.isJumping();
};
/**检查停止*/
Game_CharacterBase.prototype.checkStop = function(threshold) {
	//返回 停止计数 > threshold//临界值
    return this._stopCount > threshold;
};
/**重设停止计数*/
Game_CharacterBase.prototype.resetStopCount = function() {
	//停止计数 = 0
    this._stopCount = 0;
};
/**真实移动速度*/
Game_CharacterBase.prototype.realMoveSpeed = function() {
	//返回 移动速度 + ( 是猛冲中() ? 1 : 0 )
    return this._moveSpeed + (this.isDashing() ? 1 : 0);
};
/**距离根据帧*/
Game_CharacterBase.prototype.distancePerFrame = function() {
	//返回 数学 幂(2 , 真实移动速度) / 256
    return Math.pow(2, this.realMoveSpeed()) / 256;
};
/**是猛冲中*/
Game_CharacterBase.prototype.isDashing = function() {
	//返回 false
    return false;
};
/**是除错穿越*/
Game_CharacterBase.prototype.isDebugThrough = function() {
	//返回 false
    return false;
};
/**改正*/
Game_CharacterBase.prototype.straighten = function() {
	//如果( 有行走动画() 或者 有踏步动画()  )
    if (this.hasWalkAnime() || this.hasStepAnime()) {
	    //图案 = 1
        this._pattern = 1;
    }
    //动画计数 = 0
    this._animationCount = 0;
};
/**相反方向*/
Game_CharacterBase.prototype.reverseDir = function(d) {
	//返回 10 - d 
    return 10 - d;
};
/**能通过
 * @param {number} x 人物x
 * @param {number} y 人物y
 * @param {number} d 人物方向
 * @return {boolean} 
*/
Game_CharacterBase.prototype.canPass = function(x, y, d) {
	//x2 = 游戏地图 环x和方向(x,d)
    var x2 = $gameMap.roundXWithDirection(x, d);
    //y2 = 游戏地图 环y和方向(y,d)
    var y2 = $gameMap.roundYWithDirection(y, d);
    //如果( 不是 游戏地图 是有效的(x2,y2) )
    if (!$gameMap.isValid(x2, y2)) {
	    //返回 false
        return false;
    }
    //如果(  是穿越() 或者 是除错穿越() )
    if (this.isThrough() || this.isDebugThrough()) {
	    //返回 true
        return true;
    }
    //如果( 不是 是地图可通行(x,y,d) )
    if (!this.isMapPassable(x, y, d)) {
	    //返回 false
        return false;
    }
    //如果( 是和人物碰撞(x2,y2) )
    if (this.isCollidedWithCharacters(x2, y2)) {
	    //返回 false
        return false;
    }
    //返回 true
    return true;
};
/**能通过对角*/
Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert) {
	//x2 = 游戏地图 环x和方向(x,horz//水平)
    var x2 = $gameMap.roundXWithDirection(x, horz);
    //y2 = 游戏地图 环y和方向(y,vert//垂直)
    var y2 = $gameMap.roundYWithDirection(y, vert);
    //如果(  能通过(x,y,垂直)  并且  能通过(x,y2,水平) )
    if (this.canPass(x, y, vert) && this.canPass(x, y2, horz)) {
    	//返回 true
        return true;
    }
    //如果(  能通过(x,y,水平)  并且  能通过(x2,y,垂直) )
    if (this.canPass(x, y, horz) && this.canPass(x2, y, vert)) {
    	//返回 true
        return true;
    }
	//返回 false
    return false;
};
/**是地图可通行*/
Game_CharacterBase.prototype.isMapPassable = function(x, y, d) { 
	//x2 = 游戏地图 环x和方向(x,d)
    var x2 = $gameMap.roundXWithDirection(x, d);
    //y2 = 游戏地图 环y和方向(y,d)
    var y2 = $gameMap.roundYWithDirection(y, d);
    //d2 = 相反方向(d)
    var d2 = this.reverseDir(d);
    //返回 游戏地图  是可通行(x, y, d)  并且 游戏地图 是可通行(x2, y2, d2)
    return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2);
};
/**是和人物碰撞*/
Game_CharacterBase.prototype.isCollidedWithCharacters = function(x, y) {
	//返回 是和事件碰撞(x,y) 或者 是和交通工具碰撞(x,y)
    return this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
};
/**是和事件碰撞*/
Game_CharacterBase.prototype.isCollidedWithEvents = function(x, y) {
	//事件组 = 游戏地图 xy处事件无穿越(x,y)
    var events = $gameMap.eventsXyNt(x, y);
    //返回 事件组 一些 方法(事件)
    return events.some(function(event) {
	    //返回 事件 是正常优先级()
        return event.isNormalPriority();
    });
};
/**是和交通工具碰撞*/
Game_CharacterBase.prototype.isCollidedWithVehicles = function(x, y) {
	//返回 游戏地图 小船() 位于无穿越(x,y)  或者  游戏地图 帆船() 位于无穿越(x,y)
    return $gameMap.boat().posNt(x, y) || $gameMap.ship().posNt(x, y);
};
/**设置位置*/
Game_CharacterBase.prototype.setPosition = function(x, y) {
	//x = 数学 四舍五入(x)
    this._x = Math.round(x);
    //y = 数学 四舍五入(y)
    this._y = Math.round(y);
    //真x = x
    this._realX = x;
    //真y = y
    this._realY = y;
};
/**复制位置*/
Game_CharacterBase.prototype.copyPosition = function(character) {
	//x = 人物 x 
    this._x = character._x;
	//y = 人物 y 
    this._y = character._y;
    //真x = 人物 真x
    this._realX = character._realX;
    //真y = 人物 真y
    this._realY = character._realY;
    //方向 = 人物 方向
    this._direction = character._direction;
};
/**设于*/
Game_CharacterBase.prototype.locate = function(x, y) {
	//设置位置(x,y)
    this.setPosition(x, y);
    //改正()
    this.straighten();
    //刷新灌木丛深度()
    this.refreshBushDepth();
};
/**方向*/
Game_CharacterBase.prototype.direction = function() {
	//返回 方向
    return this._direction;
};
/**设置方向*/
Game_CharacterBase.prototype.setDirection = function(d) {
	//如果(不是 是方向固定() 并且 d )
    if (!this.isDirectionFixed() && d) {
	    //方向 = d 
        this._direction = d;
    }
    //重设停止计数()
    this.resetStopCount();
};
/**是图块*/
Game_CharacterBase.prototype.isTile = function() {
	//返回 图块id > 0 并且 优先级 === 0 
    return this._tileId > 0 && this._priorityType === 0;
};
/**是物体特征*/
Game_CharacterBase.prototype.isObjectCharacter = function() {
	//返回 是物体特征
    return this._isObjectCharacter;
};
/**转换y*/
Game_CharacterBase.prototype.shiftY = function() {
	//返回 是物体特征() ? 0 : 6
    return this.isObjectCharacter() ? 0 : 6;
};
/**滚动x*/
Game_CharacterBase.prototype.scrolledX = function() {
	//返回 游戏地图 校正x(真x)
    return $gameMap.adjustX(this._realX);
};
/**滚动y*/
Game_CharacterBase.prototype.scrolledY = function() {
	//返回 游戏地图 校正y(真y)
    return $gameMap.adjustY(this._realY);
};
/**画面x*/
Game_CharacterBase.prototype.screenX = function() {
	//图块宽 = 游戏地图 图块宽()
    var tw = $gameMap.tileWidth();
    //返回 数学 四舍五入( 滚动x() * 图块宽 + 图块宽 / 2 )
    return Math.round(this.scrolledX() * tw + tw / 2);
};
/**画面y*/
Game_CharacterBase.prototype.screenY = function() {
	//图块高 = 游戏地图 图块高()
    var th = $gameMap.tileHeight();
    //返回 数学 四舍五入( 滚动y() * 图块高 + 图块高 - 转换y() -  跳跃高()  )
    return Math.round(this.scrolledY() * th + th -
                      this.shiftY() - this.jumpHeight());
};
/**画面z*/
Game_CharacterBase.prototype.screenZ = function() {
	//返回 优先级 * 2 + 1 
    return this._priorityType * 2 + 1;
};
/**是画面附近*/
Game_CharacterBase.prototype.isNearTheScreen = function() {
	//图形宽 = 图形 宽
    var gw = Graphics.width;
	//图形高 = 图形 高
    var gh = Graphics.height;
	//图块宽 = 游戏地图 图块宽()
    var tw = $gameMap.tileWidth();
	//图块高 = 游戏地图 图块高()
    var th = $gameMap.tileHeight();
    //位置x = 滚动x() * 图块宽 + 图块宽/2 - 图形宽 / 2 
    var px = this.scrolledX() * tw + tw / 2 - gw / 2;
    //位置y = 滚动y() * 图块高 + 图块高/2 - 图形高 / 2 
    var py = this.scrolledY() * th + th / 2 - gh / 2;
    //返回 位置x >= -图形宽 并且 位置x <=  图形宽 并且 位置y >= -图形高 并且 位置y <=  图形高 
    return px >= -gw && px <= gw && py >= -gh && py <= gh;
};
/**更新*/
Game_CharacterBase.prototype.update = function() {
	//如果( 是停止() )
    if (this.isStopping()) {
        //更新停止
        this.updateStop();
    }
	//如果( 是跳跃() )
    if (this.isJumping()) {
        //更新跳跃
        this.updateJump();
    //否则 如果( 是移动中() )
    } else if (this.isMoving()) {
        //更新移动
        this.updateMove();
    }
    //更新动画()
    this.updateAnimation();
};
/**更新停止*/
Game_CharacterBase.prototype.updateStop = function() {
    //停止计数++
    this._stopCount++;
};
/**更新跳跃*/
Game_CharacterBase.prototype.updateJump = function() {
	//跳跃计数--
    this._jumpCount--;
    //真x = (真x * 跳跃计数 + x) / (跳跃计数 + 1.0) 
    this._realX = (this._realX * this._jumpCount + this._x) / (this._jumpCount + 1.0);
    //真y = (真y * 跳跃计数 + y) / (跳跃计数 + 1.0) 
    this._realY = (this._realY * this._jumpCount + this._y) / (this._jumpCount + 1.0);
    //刷新灌木丛深度()
    this.refreshBushDepth();
    //如果 跳跃计数 === 0
    if (this._jumpCount === 0) {
	    //真x = x = 游戏地图 环x(x)
        this._realX = this._x = $gameMap.roundX(this._x);
        //真y = y = 游戏地图 环y(y)
        this._realY = this._y = $gameMap.roundY(this._y);
    }
};
/**更新移动*/
Game_CharacterBase.prototype.updateMove = function() {
    //如果(x < 真x)
    if (this._x < this._realX) {
        //真x = 数学 最大值( 真x - 距离根据帧() , x )
        this._realX = Math.max(this._realX - this.distancePerFrame(), this._x);
    }
    //如果(x > 真x)
    if (this._x > this._realX) {
        //真x = 数学 最小值( 真x + 距离根据帧() , x )
        this._realX = Math.min(this._realX + this.distancePerFrame(), this._x);
    }
    //如果(y < 真y)
    if (this._y < this._realY) {
        //真y = 数学 最大值( 真y - 距离根据帧() , y )
        this._realY = Math.max(this._realY - this.distancePerFrame(), this._y);
    }
    //如果(y > 真y)
    if (this._y > this._realY) {
        //真y = 数学 最小值( 真y + 距离根据帧() , y )
        this._realY = Math.min(this._realY + this.distancePerFrame(), this._y);
    }
    //如果 (不是 是移动中() )
    if (!this.isMoving()) {
        //刷新灌木丛深度()
        this.refreshBushDepth();
    }
};
/**更新动画*/
Game_CharacterBase.prototype.updateAnimation = function() {
    //更新动画计数()
    this.updateAnimationCount();
    //如果 (动画计数 >= 动画等待() )
    if (this._animationCount >= this.animationWait()) {
        //更新图案()
        this.updatePattern();
        //动画计数 = 0
        this._animationCount = 0;
    }
};
/**动画等待*/
Game_CharacterBase.prototype.animationWait = function() {
    //返回 (9 - 真实移动速度() ) * 3
    return (9 - this.realMoveSpeed()) * 3;
};
/**更新动画计数*/
Game_CharacterBase.prototype.updateAnimationCount = function() {
    //如果( 是移动中() 并且 有行走动画()  )
    if (this.isMoving() && this.hasWalkAnime()) {
        //动画计数 += 1.5 
        this._animationCount += 1.5;
    //否则 如果( 有踏步动画() 并且 不是 是最初图案()  )
    } else if (this.hasStepAnime() || !this.isOriginalPattern()) {
        //动画计数++
        this._animationCount++;
    }
};
/**更新图案*/
Game_CharacterBase.prototype.updatePattern = function() {
    //如果(不是 有踏步动画() 并且 停止计数 > 0 )
    if (!this.hasStepAnime() && this._stopCount > 0) {
        //重设图案()
        this.resetPattern();
    //否则 
    } else {
        //图案 = (图案 + 1 ) % 最大图案()
        this._pattern = (this._pattern + 1) % this.maxPattern();
    }
};
/**最大图案*/
Game_CharacterBase.prototype.maxPattern = function() {
    //返回 4
    return 4;
};
/**图案*/
Game_CharacterBase.prototype.pattern = function() {
    //返回 图案 < 3 ? 图案 : 1
    return this._pattern < 3 ? this._pattern : 1;
};
/**设置图案*/
Game_CharacterBase.prototype.setPattern = function(pattern) {
    //图案 = pattern//图案
    this._pattern = pattern;
};
/**是最初图案*/
Game_CharacterBase.prototype.isOriginalPattern = function() {
    //返回 图案() === 1
    return this.pattern() === 1;
};
/**重设图案*/
Game_CharacterBase.prototype.resetPattern = function() {
    //设置图案(1)
    this.setPattern(1);
};
/**刷新灌木丛深度*/
Game_CharacterBase.prototype.refreshBushDepth = function() {
    //如果( 是正常优先级() 并且 不是 是物体特征() 并且 是在灌木丛() 并且 不是 是跳跃() )
    if (this.isNormalPriority() && !this.isObjectCharacter() &&
            this.isOnBush() && !this.isJumping()) {
        //如果(不是 是移动中() )
        if (!this.isMoving()) {
            //灌木丛深度 = 12 
            this._bushDepth = 12;
        }
    //否则 
    } else {
        //灌木丛深度 = 0
        this._bushDepth = 0;
    }
};
/**是在梯子*/
Game_CharacterBase.prototype.isOnLadder = function() {
    //返回 游戏地图 是梯子( x , y )
    return $gameMap.isLadder(this._x, this._y);
};
/**是在灌木丛*/
Game_CharacterBase.prototype.isOnBush = function() {
    //返回 游戏地图 是灌木丛( x , y)
    return $gameMap.isBush(this._x, this._y);
};
/**地域标签*/
Game_CharacterBase.prototype.terrainTag = function() {
    //返回 游戏地图 地域标签( x , y)
    return $gameMap.terrainTag(this._x, this._y);
};
/**区域id*/
Game_CharacterBase.prototype.regionId = function() {
    //返回 游戏地图 区域id( x , y)
    return $gameMap.regionId(this._x, this._y);
};
/**增加步数*/
Game_CharacterBase.prototype.increaseSteps = function() {
    //如果( 是在梯子() )
    if (this.isOnLadder()) {
        //设置方向(8)
        this.setDirection(8);
    }
    //重设停止计数()
    this.resetStopCount();
    //刷新灌木丛深度()
    this.refreshBushDepth();
};
/**图块id*/
Game_CharacterBase.prototype.tileId = function() {
    //返回 图块id
    return this._tileId;
};
/**行走图名称*/
Game_CharacterBase.prototype.characterName = function() {
    //返回 行走图名称
    return this._characterName;
};
/**行走图索引*/
Game_CharacterBase.prototype.characterIndex = function() {
    //返回 行走图索引
    return this._characterIndex;
};
/**设置图像*/
Game_CharacterBase.prototype.setImage = function(characterName, characterIndex) {
    //图块id = 0
    this._tileId = 0;
    //行走图名称 = characterName//行走图名称
    this._characterName = characterName;
    //行走图索引 = characterName//行走图索引
    this._characterIndex = characterIndex;
    //是物体特征 = 图像管理器 是物体特征(行走图名称)
    this._isObjectCharacter = ImageManager.isObjectCharacter(characterName);
};
/**设置图块图像*/
Game_CharacterBase.prototype.setTileImage = function(tileId) {
    //图块id = tileId//图块id
    this._tileId = tileId;
    //行走图名称 = ""
    this._characterName = '';
    //行走图索引 = 0
    this._characterIndex = 0;
    //是物体特征 = true
    this._isObjectCharacter = true;
};
/**检查正面事件触摸触发*/
Game_CharacterBase.prototype.checkEventTriggerTouchFront = function(d) {
    //x2 = 游戏地图 环x和方向(x,d)
    var x2 = $gameMap.roundXWithDirection(this._x, d);
    //y2 = 游戏地图 环y和方向(y,d)
    var y2 = $gameMap.roundYWithDirection(this._y, d);
    //检查事件触摸触发(x2,y2)
    this.checkEventTriggerTouch(x2, y2);
};
/**检查事件触摸触发*/
Game_CharacterBase.prototype.checkEventTriggerTouch = function(x, y) {
    //返回 false
    return false;
};
/**是移动成功的*/
Game_CharacterBase.prototype.isMovementSucceeded = function(x, y) {
    //返回 移动成功 
    return this._movementSuccess;
};
/**设置移动成功*/
Game_CharacterBase.prototype.setMovementSuccess = function(success) {
    //移动成功 = success//成功
    this._movementSuccess = success;
};
/**移动直线*/
Game_CharacterBase.prototype.moveStraight = function(d) {
    //设置移动成功( 能通过(x,y,d)  )
    this.setMovementSuccess(this.canPass(this._x, this._y, d));
    //如果( 是移动成功的() )
    if (this.isMovementSucceeded()) {
        //设置方向(d)
        this.setDirection(d);
        //x = 游戏地图 环x和方向(x,d)
        this._x = $gameMap.roundXWithDirection(this._x, d);
        //y = 游戏地图 环y和方向(y,d)
        this._y = $gameMap.roundYWithDirection(this._y, d);
        //真x = 游戏地图 x和方向(x, 相反方向(d)  )
        this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
        //真y = 游戏地图 y和方向(y, 相反方向(d)  )
        this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
        //增加步数()
        this.increaseSteps();
    //否则
    } else {
        //设置方向(d)
        this.setDirection(d);
        //检查正面事件触摸触发(d)
        this.checkEventTriggerTouchFront(d);
    }
};
/**移动对角*/
Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
    //设置移动成功( 能通过对角(x,y,水平,垂直)  )
    this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
    //如果( 是移动成功的() )
    if (this.isMovementSucceeded()) {
        //x = 游戏地图 环x和方向(x,水平)
        this._x = $gameMap.roundXWithDirection(this._x, horz);
        //y = 游戏地图 环y和方向(y,垂直)
        this._y = $gameMap.roundYWithDirection(this._y, vert);
        //真x = 游戏地图 x和方向(x, 相反方向(水平)  )
        this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
        //真y = 游戏地图 y和方向(y, 相反方向(垂直)  )
        this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
        //增加步数()
        this.increaseSteps();
    }
    //如果(方向 === 相反方向(水平) )
    if (this._direction === this.reverseDir(horz)) {
        //设置方向(水平)
        this.setDirection(horz);
    }
    //如果(方向 === 相反方向(垂直) )
    if (this._direction === this.reverseDir(vert)) {
        //设置方向(垂直)
        this.setDirection(vert);
    }
};
/**跳跃*/
Game_CharacterBase.prototype.jump = function(xPlus, yPlus) {
	//如果 数学 绝对值 (x增量) > 数学 绝对值 (y增量) 
    if (Math.abs(xPlus) > Math.abs(yPlus)) {
	    //如果 x增量 !== 0 
        if (xPlus !== 0) {
	        //设置方向( x增量 < 0 ? 4 : 6 )
            this.setDirection(xPlus < 0 ? 4 : 6);
        }
    //否则 
    } else {
	    //如果 y增量 !== 0 
        if (yPlus !== 0) {
	        //设置方向( x增量 < 0 ? 4 : 6 )
            this.setDirection(yPlus < 0 ? 8 : 2);
        }
    }
    //x += x增量
    this._x += xPlus;
    //y += y增量
    this._y += yPlus;
    //距离 = 数学 四舍五入 ( 数学 开方( x增量 * x增量 + y增量* y增量 ) )
    var distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
    //跳跃波峰 = 10 + 距离 - 移动速度 
    this._jumpPeak = 10 + distance - this._moveSpeed;
    //跳跃计数 = 跳跃波峰 * 2
    this._jumpCount = this._jumpPeak * 2;
    //重设停止计数()
    this.resetStopCount();
    //改正()
    this.straighten();
};
/**有行走动画*/
Game_CharacterBase.prototype.hasWalkAnime = function() {
    //返回 行走动画
    return this._walkAnime;
};
/**设置行走动画*/
Game_CharacterBase.prototype.setWalkAnime = function(walkAnime) {
    //行走动画 = walkAnime//行走动画
    this._walkAnime = walkAnime;
};
/**有踏步动画*/
Game_CharacterBase.prototype.hasStepAnime = function() {
    //返回 踏步动画  
    return this._stepAnime;
};
/**设置踏步动画*/
Game_CharacterBase.prototype.setStepAnime = function(stepAnime) {
    //踏步动画 = stepAnime//踏步动画
    this._stepAnime = stepAnime;
};
/**是方向固定*/
Game_CharacterBase.prototype.isDirectionFixed = function() {
    //返回 方向固定  
    return this._directionFix;
};
/**设置方向固定*/
Game_CharacterBase.prototype.setDirectionFix = function(directionFix) {
    //方向固定 = directionFix //方向固定
    this._directionFix = directionFix;
};
/**是穿透*/
Game_CharacterBase.prototype.isThrough = function() {
    //返回 穿透  
    return this._through;
};
/**设置穿透*/
Game_CharacterBase.prototype.setThrough = function(through) {
    //穿透 = through//穿透 
    this._through = through;
};
/**是透明*/
Game_CharacterBase.prototype.isTransparent = function() {
    //返回 透明
    return this._transparent;
};
/**灌木丛深度*/
Game_CharacterBase.prototype.bushDepth = function() {
    //返回 灌木丛深度
    return this._bushDepth;
};
/**设置透明*/
Game_CharacterBase.prototype.setTransparent = function(transparent) {
    //透明 = transparent//透明
    this._transparent = transparent;
};
/**请求动画*/
Game_CharacterBase.prototype.requestAnimation = function(animationId) {
    //动画id = animationId//动画id
    this._animationId = animationId;
};
/**请求气球*/
Game_CharacterBase.prototype.requestBalloon = function(balloonId) {
    //气球id = balloonId//气球id
    this._balloonId = balloonId;
};
/**动画id*/
Game_CharacterBase.prototype.animationId = function() {
    //返回 动画id
    return this._animationId;
};
/**气球id*/
Game_CharacterBase.prototype.balloonId = function() {
    //返回 气球id  
    return this._balloonId;
};
/**开始动画*/
Game_CharacterBase.prototype.startAnimation = function() {
    //动画id = 0 
    this._animationId = 0;
    //动画播放中 = true
    this._animationPlaying = true;
};
/**开始气球*/
Game_CharacterBase.prototype.startBalloon = function() {
    //气球id = 0
    this._balloonId = 0;
    //气球播放中 = true
    this._balloonPlaying = true;
};
/**是动画播放中*/
Game_CharacterBase.prototype.isAnimationPlaying = function() {
    //返回 动画id > 0 并且 动画播放中
    return this._animationId > 0 || this._animationPlaying;
};
/**是气球播放中*/
Game_CharacterBase.prototype.isBalloonPlaying = function() {
    //返回 气球id >  0 并且 气球播放中
    return this._balloonId > 0 || this._balloonPlaying;
};
/**结束动画*/
Game_CharacterBase.prototype.endAnimation = function() {
    //动画播放中 = false
    this._animationPlaying = false;
};
/**结束气球*/
Game_CharacterBase.prototype.endBalloon = function() {
    //气球播放中 = false
    this._balloonPlaying = false;
};
