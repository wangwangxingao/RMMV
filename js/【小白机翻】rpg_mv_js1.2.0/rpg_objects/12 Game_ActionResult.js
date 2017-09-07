
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
	//使用的 = false
    this.used = false;
    //未击中的 = false
    this.missed = false;
    //闪避的 = false
    this.evaded = false;
    //物理 = false
    this.physical = false;
    //吸收 = false 
    this.drain = false;
    //会心 = false
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
    //添加的状态
    this.addedStates = [];
    //移除的状态
    this.removedStates = [];
    //添加的正面效果组
    this.addedBuffs = [];
    //添加的负面效果组
    this.addedDebuffs = [];
    //移除的效果组
    this.removedBuffs = [];
};
//添加状态对象
Game_ActionResult.prototype.addedStateObjects = function() {
	//返回 添加的状态 映射 方法(id )
    return this.addedStates.map(function(id) {
	    //返回 数据状态[id]
        return $dataStates[id];
    });
};
//移除状态对象
Game_ActionResult.prototype.removedStateObjects = function() {
	//返回 移除的状态 映射 方法(id)
    return this.removedStates.map(function(id) {
	    //返回 数据状态id
        return $dataStates[id];
    });
};
//是状态影响后
Game_ActionResult.prototype.isStatusAffected = function() {
	//返回 ( 添加的状态 长度 > 0  或者 移除的状态 长度 > 0  或者 
	//       添加的正面效果组 长度 > 0  或者 添加的负面效果组  长度 > 0  或者  
	//       移除的效果组 长度 > 0   )
    return (this.addedStates.length > 0 || this.removedStates.length > 0 ||
            this.addedBuffs.length > 0 || this.addedDebuffs.length > 0 ||
            this.removedBuffs.length > 0);
};
//是击中
Game_ActionResult.prototype.isHit = function() {
	//返回 使用的 并且 不是 未击中的 并且 不是 闪避的
    return this.used && !this.missed && !this.evaded;
};
//是状态添加后
Game_ActionResult.prototype.isStateAdded = function(stateId) {
	//返回 添加的状态 包含 ( 状态id )
    return this.addedStates.contains(stateId);
};
//增加添加状态
Game_ActionResult.prototype.pushAddedState = function(stateId) {
	//如果 ( 不是 是状态添加后( 状态id ))
    if (!this.isStateAdded(stateId)) {
	    //添加的状态 添加 ( 状态id )
        this.addedStates.push(stateId);
    }
};
//是状态移除后
Game_ActionResult.prototype.isStateRemoved = function(stateId) {
	//返回 移除的状态 包含 ( 状态id )
    return this.removedStates.contains(stateId);
};
//增加移除状态
Game_ActionResult.prototype.pushRemovedState = function(stateId) { 
	//如果 ( 不是 是状态移除后( 状态id ))
    if (!this.isStateRemoved(stateId)) { 
	    //移除的状态 添加 ( 状态id )
        this.removedStates.push(stateId);
    }
};
//是正面效果添加
Game_ActionResult.prototype.isBuffAdded = function(paramId) {
	//返回 添加的正面效果组 包含 ( 参数id )
    return this.addedBuffs.contains(paramId);
};
//增加添加正面效果
Game_ActionResult.prototype.pushAddedBuff = function(paramId) {
	//如果 ( 不是 是正面效果添加( 参数id ))
    if (!this.isBuffAdded(paramId)) {
	    //添加的正面效果组 添加 ( 参数id )
        this.addedBuffs.push(paramId);
    }
};
//是负面效果添加
Game_ActionResult.prototype.isDebuffAdded = function(paramId) {
	//返回 添加的负面效果组 包含 ( 参数id )
    return this.addedDebuffs.contains(paramId);
};
//增加添加负面效果
Game_ActionResult.prototype.pushAddedDebuff = function(paramId) {
	//如果 ( 不是 是负面效果添加( 参数id ))
    if (!this.isDebuffAdded(paramId)) {
	    //添加的负面效果组 添加 ( 参数id )
        this.addedDebuffs.push(paramId);
    }
};
//是效果移除
Game_ActionResult.prototype.isBuffRemoved = function(paramId) {
	//返回 移除的效果 包含 ( 参数id )
    return this.removedBuffs.contains(paramId);
};
//增加移除效果
Game_ActionResult.prototype.pushRemovedBuff = function(paramId) {
	//如果 ( 不是 是效果移除( 参数id ))
    if (!this.isBuffRemoved(paramId)) {
	    //移除的效果 添加 ( 参数id )
        this.removedBuffs.push(paramId);
    }
};
