
/**-----------------------------------------------------------------------------  
 * Game_Timer  
 * 游戏计时     $gameTimer  
 * The game object class for the timer.  
 * 为了计时的游戏对象类  
 * @class Game_Timer */

function Game_Timer() {
    this.initialize.apply(this, arguments);
}
/**初始化
 * @method initialize
 */
Game_Timer.prototype.initialize = function() {
	//帧数 = 0
    this._frames = 0;
    //工作中 = false
    this._working = false;
};
/**更新 
 * @method update
 * @param {boolean} sceneActive 场景活动
 */
Game_Timer.prototype.update = function(sceneActive) {
	//如果( 场景活动 并且 工作中 并且 帧数 > 0 )
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
/**开始
 * @method start
 * @param {number} count 计数
 */
Game_Timer.prototype.start = function(count) {
	//帧数 = 计数
    this._frames = count;
    //工作中 = true 
    this._working = true;
};
/**停止
 * @method stop
 */
Game_Timer.prototype.stop = function() {
    //工作中 = false 
    this._working = false;
};
/**是工作中
 * @method isWorking
 * @return {boolean}
 */
Game_Timer.prototype.isWorking = function() {
	//返回 工作中
    return this._working;
};
/**秒
 * @method seconds
 * @return {number}
 */
Game_Timer.prototype.seconds = function() {
	//返回 向下取整(帧数/60)
    return Math.floor(this._frames / 60);
};
/**当期满
 * @method onExpire
 */
Game_Timer.prototype.onExpire = function() {
	//战斗管理器 中止()
    BattleManager.abort();
};
