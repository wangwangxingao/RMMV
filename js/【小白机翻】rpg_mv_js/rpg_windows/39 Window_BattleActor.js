
//-----------------------------------------------------------------------------
// Window_BattleActor
// 窗口战斗角色
// The window for selecting a target actor on the battle screen.
// 战斗画面选择一个目标角色的窗口

function Window_BattleActor() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_BattleActor.prototype = Object.create(Window_BattleStatus.prototype);
//设置创造者
Window_BattleActor.prototype.constructor = Window_BattleActor;
//初始化
Window_BattleActor.prototype.initialize = function(x, y) {
    Window_BattleStatus.prototype.initialize.call(this);
    this.x = x;
    this.y = y;
    this.openness = 255;
    this.hide();
};
//显示
Window_BattleActor.prototype.show = function() {
    this.select(0);
    Window_BattleStatus.prototype.show.call(this);
};
//隐藏
Window_BattleActor.prototype.hide = function() {
    Window_BattleStatus.prototype.hide.call(this);
    $gameParty.select(null);
};
//选择
Window_BattleActor.prototype.select = function(index) {
    Window_BattleStatus.prototype.select.call(this, index);
    $gameParty.select(this.actor());
};
//角色
Window_BattleActor.prototype.actor = function() {
    return $gameParty.members()[this.index()];
};
