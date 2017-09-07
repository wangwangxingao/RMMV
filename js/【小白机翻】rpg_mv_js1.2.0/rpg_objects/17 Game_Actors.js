
//-----------------------------------------------------------------------------
// Game_Actors
// 游戏角色组         $gameActors
// The wrapper class for an actor array.
// 角色数组的包装类

function Game_Actors() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_Actors.prototype.initialize = function() {
    //数据 = []
    this._data = [];
};
//角色
Game_Actors.prototype.actor = function(actorId) {
    //如果(数据角色组[角色id])
    if ($dataActors[actorId]) {
        //如果(不是 数据[角色id] )
        if (!this._data[actorId]) {
            //数据[角色id] = 新 游戏角色(角色id)
            this._data[actorId] = new Game_Actor(actorId);
        }
        //返回 数据[角色id]
        return this._data[actorId];
    }
    //返回 null
    return null;
};
