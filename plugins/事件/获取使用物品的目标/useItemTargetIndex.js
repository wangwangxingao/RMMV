
Game_Action.prototype.applyGlobal = function() {
    //项目 效果组 对每一个 效果
    this.item().effects.forEach(function(effect) {
        //如果 效果 编码 === 游戏 项目效果公共事件
        if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
            //游戏临时 储存公共事件(效果 数据id)
            $gameTemp.reserveCommonEvent(effect.dataId);
        }
        //this
    }, this); 
    $gameTemp._useItemTargetIndex = this._targetIndex
};