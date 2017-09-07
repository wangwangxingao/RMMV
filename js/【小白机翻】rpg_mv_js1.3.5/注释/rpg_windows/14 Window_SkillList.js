
//-----------------------------------------------------------------------------
// Window_SkillList
// 窗口技能列表
// The window for selecting a skill on the skill screen.
// 技能画面选择技能的窗口

function Window_SkillList() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_SkillList.prototype = Object.create(Window_Selectable.prototype);
//设置创造者
Window_SkillList.prototype.constructor = Window_SkillList;
//初始化
Window_SkillList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    //角色 = null
    this._actor = null;
    //技能种类id
    this._stypeId = 0;
    //数据 = []
    this._data = [];
};
//设置角色
Window_SkillList.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.resetScroll();
    }
};
//设置技能种类id
Window_SkillList.prototype.setStypeId = function(stypeId) {
    if (this._stypeId !== stypeId) {
        this._stypeId = stypeId;
        this.refresh();
        this.resetScroll();
    }
};
//最大列
Window_SkillList.prototype.maxCols = function() {
    return 2;
};
//行距
Window_SkillList.prototype.spacing = function() {
    return 48;
};
//最大项目
Window_SkillList.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};
//项目
Window_SkillList.prototype.item = function() {
    return this._data && this.index() >= 0 ? this._data[this.index()] : null;
};
//是当前项目允许
Window_SkillList.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this._data[this.index()]);
};
//包含
Window_SkillList.prototype.includes = function(item) {
    return item && item.stypeId === this._stypeId;
};
//是允许
Window_SkillList.prototype.isEnabled = function(item) {
    return this._actor && this._actor.canUse(item);
};
//制作项目列表
Window_SkillList.prototype.makeItemList = function() {
    if (this._actor) {
        this._data = this._actor.skills().filter(function(item) {
            return this.includes(item);
        }, this);
    } else {
        this._data = [];
    }
};
//选择列表
Window_SkillList.prototype.selectLast = function() {
    var skill;
    if ($gameParty.inBattle()) {
        skill = this._actor.lastBattleSkill();
    } else {
        skill = this._actor.lastMenuSkill();
    }
    var index = this._data.indexOf(skill);
    this.select(index >= 0 ? index : 0);
};
//绘制项目
Window_SkillList.prototype.drawItem = function(index) {
    var skill = this._data[index];
    if (skill) {
        var costWidth = this.costWidth();
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(skill));
        this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
        this.drawSkillCost(skill, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};
//消耗宽
Window_SkillList.prototype.costWidth = function() {
    return this.textWidth('000');
};
//绘制技能消耗
Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
    if (this._actor.skillTpCost(skill) > 0) {
        this.changeTextColor(this.tpCostColor());
        this.drawText(this._actor.skillTpCost(skill), x, y, width, 'right');
    } else if (this._actor.skillMpCost(skill) > 0) {
        this.changeTextColor(this.mpCostColor());
        this.drawText(this._actor.skillMpCost(skill), x, y, width, 'right');
    }
};
//更新帮助
Window_SkillList.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
};
//刷新
Window_SkillList.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};
