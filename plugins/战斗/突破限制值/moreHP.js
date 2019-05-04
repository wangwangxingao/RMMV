
/**参数最大
 * 
 * 8项基本参数在游戏中的最大设置值
 * 
 * @param {number} paramId 参数id
 * @return {number}   
 * 
 */
Game_BattlerBase.prototype.paramMax = function(paramId) {
    //如果 (参数id === 0)
    if (paramId === 0) {
        //返回 9999999 //生命值最大9999999
        return 9999999; // MHP
        //否则 如果 (参数id === 1)
    } else if (paramId === 1) {
        //返回 99999 //魔法值最大99999
        return 99999; // MMP
        //否则 
    } else {
        //返回 99999 //其他属性最大99999
        return 99999;
    }
};



Game_Actor.prototype.paramMax = function(paramId) {
    //如果 (参数id === 0 )
    if (paramId === 0) {
        //返回 9999
        return 9999999; // MHP
    }
    //返回 游戏战斗者 参数最大 呼叫(this,参数id)
    return Game_Battler.prototype.paramMax.call(this, paramId);
};