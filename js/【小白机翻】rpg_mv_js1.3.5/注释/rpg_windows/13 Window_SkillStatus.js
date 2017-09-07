
//-----------------------------------------------------------------------------
// Window_SkillStatus
// 窗口技能状态
// The window for displaying the skill user's status on the skill screen.
// 技能画面显示技能使用状态的窗口

function Window_SkillStatus() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_SkillStatus.prototype = Object.create(Window_Base.prototype);
//设置创造者
Window_SkillStatus.prototype.constructor = Window_SkillStatus;
//初始化
Window_SkillStatus.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
};
//设置角色
Window_SkillStatus.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};
//刷新
Window_SkillStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        var w = this.width - this.padding * 2;
        var h = this.height - this.padding * 2;
        var y = h / 2 - this.lineHeight() * 1.5;
        var width = w - 162 - this.textPadding();
        this.drawActorFace(this._actor, 0, 0, 144, h);
        this.drawActorSimpleStatus(this._actor, 162, y, width);
    }
};
