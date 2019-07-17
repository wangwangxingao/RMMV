
/**添加状态
 * @param {namber} stateId 状态id
 * @param {namber} value 数量
*/
Game_Battler.prototype.addStateMore = function (stateId, value) {
    var value = value || 0
    //如果 是状态可添加(stateId状态id)
    if (this.isStateAddable(stateId)) {
        for (var i = 0; i < vlaue; i++) {
            this.addNewState(stateId);
        }
        //刷新
        this.refresh();
        //重置状态计数(状态id)
        this.resetStateCounts(stateId);
        //结果 增加添加状态
        this._result.pushAddedState(stateId);
    }
};



/**
 * 设置状态数量 
 * @param {namber} stateId 状态id
 * @param {namber} value 数量
*/
Game_Battler.prototype.setStateMore = function (stateId, value) { 
    var v = this.getStateMore(stateId)
    if (v > value) {
        var n = v - value
        this.addStateMore(stateId,n)
    } else if(v < value){
        var n = value - v 
        this.clearStateMore(stateId,n) 
    }
    //重置状态计数(状态id)
    this.resetStateCounts(stateId);

};

/**清空状态数量 
 * @param {namber} stateId 状态id
 * @param {namber} value 数量
*/
Game_Battler.prototype.clearStateMore = function (stateId) {
    var index = this._states.indexOf(stateId);
    for (; index >= 0;) {
        this._states.splice(index, 1);
        var index = this._states.indexOf(stateId);
    }
    delete this._stateTurns[stateId];
    this.refresh()
};
/**删除状态数量
 * 
 * @param {namber} stateId 状态id
 * @param {namber} value 数量
*/
Game_Battler.prototype.removeStateMore = function (stateId, value) {
    var value = value || 0
    var index = this._states.indexOf(stateId);
    for (var i = 0; i < value && index >= 0; i++) {
        this._states.splice(index, 1);
        var index = this._states.indexOf(stateId);
        if (index < 0) {
            delete this._stateTurns[stateId];
        }
    }
    this.refresh()
};

/**获取状态的数量
 *  
 * @param {namber} stateId 状态id
 * @returns {namber}   数量
*/
Game_Battler.prototype.getStateMore = function (stateId) {
    var z = 0
    for (var i = 0; i < this._states.length; i++) {
        var id = this._states[i]
        if (id == stateId) {
            z++
        }
        return z
    }
};
