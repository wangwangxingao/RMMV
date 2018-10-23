



/**判断时把随从也加入思考 */
Game_Event.prototype.checkEventTriggerTouch = function (x, y) {
    //如果(不是 游戏地图 是事件运转() )
    if (!$gameMap.isEventRunning()) {
        //如果(触发 === 2 并且 游戏游戏者 位于(x,y) )
        // if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
        if (this._trigger === 2 && $gamePlayer.isCollided(x, y)) {
            //如果(不是 是跳跃() 并且 是正常优先级() )
            if (!this.isJumping() && this.isNormalPriority()) {
                //开始()
                this.start();
            }
        }
    }
};