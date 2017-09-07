
//-----------------------------------------------------------------------------
// Window_BattleActor
// 窗口战斗角色
// The window for selecting a target actor on the battle screen.
// 战斗画面选择一个目标角色的窗口

function Window_BattleActor() {
    this.initialize.apply(this, arguments);
}

//设置原形 (窗口战斗状态)
Window_BattleActor.prototype = Object.create(Window_BattleStatus.prototype);
//设置创造者
Window_BattleActor.prototype.constructor = Window_BattleActor;
//初始化
Window_BattleActor.prototype.initialize = function(x, y) {
	//窗口战斗状态 初始化 呼叫(this)
    Window_BattleStatus.prototype.initialize.call(this);
    //x = x
    this.x = x;
    //y = y
    this.y = y;
    //开放性 = 255 
    this.openness = 255;
    //隐藏
    this.hide();
};
//显示
Window_BattleActor.prototype.show = function() {
	//选择 (0)
    this.select(0);
	//窗口战斗状态 显示 呼叫(this)
    Window_BattleStatus.prototype.show.call(this);
};
//隐藏
Window_BattleActor.prototype.hide = function() {
	//窗口战斗状态 隐藏 呼叫(this)
    Window_BattleStatus.prototype.hide.call(this);
    //游戏队伍 选择(null)
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
