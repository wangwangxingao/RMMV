
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
    this._data = [];
};
//角色
Game_Actors.prototype.actor = function(actorId) {
    if ($dataActors[actorId]) {
        if (!this._data[actorId]) {
            this._data[actorId] = new Game_Actor(actorId);
        }
        return this._data[actorId];
    }
    return null;
};
