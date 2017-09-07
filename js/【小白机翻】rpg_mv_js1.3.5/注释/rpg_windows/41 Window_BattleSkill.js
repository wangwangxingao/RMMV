
//-----------------------------------------------------------------------------
// Window_BattleSkill
// 窗口战斗技能
// The window for selecting a skill to use on the battle screen.
// 战斗画面选择一个技能使用的窗口

function Window_BattleSkill() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_BattleSkill.prototype = Object.create(Window_SkillList.prototype);
//设置创造者
Window_BattleSkill.prototype.constructor = Window_BattleSkill;
//初始化
Window_BattleSkill.prototype.initialize = function(x, y, width, height) {
    Window_SkillList.prototype.initialize.call(this, x, y, width, height);
    this.hide();
};
//显示
Window_BattleSkill.prototype.show = function() {
    this.selectLast();
    this.showHelpWindow();
    Window_SkillList.prototype.show.call(this);
};
//隐藏
Window_BattleSkill.prototype.hide = function() {
    this.hideHelpWindow();
    Window_SkillList.prototype.hide.call(this);
};
