
//-----------------------------------------------------------------------------
// Game_CommonEvent
// 游戏公共事件
// The game object class for a common event. It contains functionality for
// running parallel process events.
// 公共事件的游戏对象类.它包含运转事件的功能

function Game_CommonEvent() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_CommonEvent.prototype.initialize = function(commonEventId) {
    //公共事件id = commonEventId //公共事件id
    this._commonEventId = commonEventId;
    //刷新()
    this.refresh();
};
//事件
Game_CommonEvent.prototype.event = function() {
    //返回 数据公共事件组[公共事件id]
    return $dataCommonEvents[this._commonEventId];
};
//列表
Game_CommonEvent.prototype.list = function() {
    //返回 事件() 列表
    return this.event().list;
};
//刷新
Game_CommonEvent.prototype.refresh = function() {
    //如果(是活动的() )
    if (this.isActive()) {
        //如果(不是 事件解释器)
        if (!this._interpreter) {
            //事件解释器 = 新 游戏事件解释器()
            this._interpreter = new Game_Interpreter();
        }
    //否则 
    } else {
        //事件解释器 = null
        this._interpreter = null;
    }
};
//是活动的
Game_CommonEvent.prototype.isActive = function() {
    //事件 = 事件()
    var event = this.event();
    //返回 事件 触发 === 2 并且 游戏开关组 值(事件 开关id)
    return event.trigger === 2 && $gameSwitches.value(event.switchId);
};
//更新
Game_CommonEvent.prototype.update = function() {
    //如果(事件解释器)
    if (this._interpreter) {
        //如果(不是 事件解释器 是运转() )
        if (!this._interpreter.isRunning()) {
            //事件解释器 安装( 列表() )
            this._interpreter.setup(this.list());
        }
        //事件解释器 更新()
        this._interpreter.update();
    }
};
