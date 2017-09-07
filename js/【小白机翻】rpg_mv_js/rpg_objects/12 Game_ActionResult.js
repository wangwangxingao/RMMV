
//-----------------------------------------------------------------------------
// Game_ActionResult
// 游戏动作结果
// The game object class for a result of a battle action. For convinience, all
// member variables in this class are public.
// 这个游戏对象类为了一个战斗动作结果.

function Game_ActionResult() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_ActionResult.prototype.initialize = function() {
	//清除
    this.clear();
};
//清除
Game_ActionResult.prototype.clear = function() {
	//使用过的 = false
    this.used = false;
    //未击中的 = false
    this.missed = false;
    //闪避的 = false
    this.evaded = false;
    //物理 = false
    this.physical = false;
    //消耗 = false 
    this.drain = false;
    //暴击 = false
    this.critical = false;
    //成功 = false
    this.success = false;
    //hp效果 = false
    this.hpAffected = false;
    //hp伤害 =  0
    this.hpDamage = 0;
    //mp伤害 = 0
    this.mpDamage = 0;
    //tp伤害 = 0
    this.tpDamage = 0;
    this.addedStates = [];
    this.removedStates = [];
    this.addedBuffs = [];
    this.addedDebuffs = [];
    this.removedBuffs = [];
};
//添加状态对象
Game_ActionResult.prototype.addedStateObjects = function() {
	//返回 添加的状态 映射 ( 方法 id )
    return this.addedStates.map(function(id) {
	    //返回 数据状态[id]
        return $dataStates[id];
    });
};
//移除状态对象
Game_ActionResult.prototype.removedStateObjects = function() {
    return this.removedStates.map(function(id) {
        return $dataStates[id];
    });
};
//是状态影响后
Game_ActionResult.prototype.isStatusAffected = function() {
    return (this.addedStates.length > 0 || this.removedStates.length > 0 ||
            this.addedBuffs.length > 0 || this.addedDebuffs.length > 0 ||
            this.removedBuffs.length > 0);
};
//是击中
Game_ActionResult.prototype.isHit = function() {
    return this.used && !this.missed && !this.evaded;
};
//是状态添加后
Game_ActionResult.prototype.isStateAdded = function(stateId) {
    return this.addedStates.contains(stateId);
};
//添加添加状态
Game_ActionResult.prototype.pushAddedState = function(stateId) {
    if (!this.isStateAdded(stateId)) {
        this.addedStates.push(stateId);
    }
};
//是状态移除
Game_ActionResult.prototype.isStateRemoved = function(stateId) {
    return this.removedStates.contains(stateId);
};
//添加移除状态
Game_ActionResult.prototype.pushRemovedState = function(stateId) {
    if (!this.isStateRemoved(stateId)) {
        this.removedStates.push(stateId);
    }
};
//是增益效果添加
Game_ActionResult.prototype.isBuffAdded = function(paramId) {
    return this.addedBuffs.contains(paramId);
};
//添加添加增益效果
Game_ActionResult.prototype.pushAddedBuff = function(paramId) {
    if (!this.isBuffAdded(paramId)) {
        this.addedBuffs.push(paramId);
    }
};
//是负面效果添加
Game_ActionResult.prototype.isDebuffAdded = function(paramId) {
    return this.addedDebuffs.contains(paramId);
};
//添加添加负面效果
Game_ActionResult.prototype.pushAddedDebuff = function(paramId) {
    if (!this.isDebuffAdded(paramId)) {
        this.addedDebuffs.push(paramId);
    }
};
//是效果移除
Game_ActionResult.prototype.isBuffRemoved = function(paramId) {
    return this.removedBuffs.contains(paramId);
};
//添加移除效果
Game_ActionResult.prototype.pushRemovedBuff = function(paramId) {
    if (!this.isBuffRemoved(paramId)) {
        this.removedBuffs.push(paramId);
    }
};
