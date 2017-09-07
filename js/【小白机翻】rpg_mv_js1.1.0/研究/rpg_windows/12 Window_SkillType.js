
//-----------------------------------------------------------------------------
// Window_SkillType
// 窗口技能种类
// The window for selecting a skill type on the skill screen.
// 技能画面选择技能种类的窗口

function Window_SkillType() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_SkillType.prototype = Object.create(Window_Command.prototype);
//设置创造者
Window_SkillType.prototype.constructor = Window_SkillType;
//初始化
Window_SkillType.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
    this._actor = null;
};
//窗口宽
Window_SkillType.prototype.windowWidth = function() {
    return 240;
};
//设置角色
Window_SkillType.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.selectLast();
    }
};
//可见行数目
Window_SkillType.prototype.numVisibleRows = function() {
    return 4;
};
//制作命令列表
Window_SkillType.prototype.makeCommandList = function() {
    if (this._actor) {
        var skillTypes = this._actor.addedSkillTypes();
        skillTypes.sort(function(a, b) {
            return a - b;
        });
        skillTypes.forEach(function(stypeId) {
            var name = $dataSystem.skillTypes[stypeId];
            this.addCommand(name, 'skill', true, stypeId);
        }, this);
    }
};
//更新
Window_SkillType.prototype.update = function() {
    Window_Command.prototype.update.call(this);
    if (this._skillWindow) {
        this._skillWindow.setStypeId(this.currentExt());
    }
};
//设置技能窗口
Window_SkillType.prototype.setSkillWindow = function(skillWindow) {
    this._skillWindow = skillWindow;
    this.update();
};
//选择列表
Window_SkillType.prototype.selectLast = function() {
    var skill = this._actor.lastMenuSkill();
    if (skill) {
        this.selectExt(skill.stypeId);
    } else {
        this.select(0);
    }
};
