
//-----------------------------------------------------------------------------
// Game_Timer
// 游戏计时     $gameTimer
// The game object class for the timer.
// 为了计时的游戏对象类

function Game_Timer() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_Timer.prototype.initialize = function() {
	//帧数 = 0
    this._frames = 0;
    //工作中 = false
    this._working = false;
};
//更新
Game_Timer.prototype.update = function(sceneActive) {
	//如果( sceneActive//场景活动 并且 工作中  并且 帧数>0 )
    if (sceneActive && this._working && this._frames > 0) {
	    //帧数-- 
        this._frames--;
        //如果 ( 帧数 == 0)
        if (this._frames === 0) {
	        //当期满()
            this.onExpire();
        }
    }
};
//开始
Game_Timer.prototype.start = function(count) {
	//帧数 = 计数
    this._frames = count;
    //工作中 = true 
    this._working = true;
};
//停止
Game_Timer.prototype.stop = function() {
    //工作中 = false 
    this._working = false;
};
//是工作中
Game_Timer.prototype.isWorking = function() {
	//返回 工作中
    return this._working;
};
//秒
Game_Timer.prototype.seconds = function() {
	//返回 向下取整(帧数/60)
    return Math.floor(this._frames / 60);
};
//当期满
Game_Timer.prototype.onExpire = function() {
	//战斗管理器 中止()
    BattleManager.abort();
};
