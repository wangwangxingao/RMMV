
//-----------------------------------------------------------------------------
// Window_BattleStatus
// 窗口战斗状态
// The window for displaying the status of party members on the battle screen.
// 战斗画面显示队伍成员状态的窗口

function Window_BattleStatus() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_BattleStatus.prototype = Object.create(Window_Selectable.prototype);
//设置创造者
Window_BattleStatus.prototype.constructor = Window_BattleStatus;
//初始化
Window_BattleStatus.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = Graphics.boxWidth - width;
    var y = Graphics.boxHeight - height;
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.openness = 0;
};
//窗口宽
Window_BattleStatus.prototype.windowWidth = function() {
    return Graphics.boxWidth - 192;
};
//窗口高
Window_BattleStatus.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};
//可见行数目
Window_BattleStatus.prototype.numVisibleRows = function() {
    return 4;
};
//最大项目 
Window_BattleStatus.prototype.maxItems = function() {
    return $gameParty.battleMembers().length;
};
//刷新
Window_BattleStatus.prototype.refresh = function() {
    this.contents.clear();
    this.drawAllItems();
};
//绘制项目
Window_BattleStatus.prototype.drawItem = function(index) {
    var actor = $gameParty.battleMembers()[index];
    this.drawBasicArea(this.basicAreaRect(index), actor);
    this.drawGaugeArea(this.gaugeAreaRect(index), actor);
};
//基础区域矩形
Window_BattleStatus.prototype.basicAreaRect = function(index) {
    var rect = this.itemRectForText(index);
    rect.width -= this.gaugeAreaWidth() + 15;
    return rect;
};
//计量区域矩形
Window_BattleStatus.prototype.gaugeAreaRect = function(index) {
    var rect = this.itemRectForText(index);
    rect.x += rect.width - this.gaugeAreaWidth();
    rect.width = this.gaugeAreaWidth();
    return rect;
};
//计量区域宽
Window_BattleStatus.prototype.gaugeAreaWidth = function() {
    return 330;
};
//绘制基础区域
Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
    this.drawActorName(actor, rect.x + 0, rect.y, 150);
    this.drawActorIcons(actor, rect.x + 156, rect.y, rect.width - 156);
};
//绘制计量区域
Window_BattleStatus.prototype.drawGaugeArea = function(rect, actor) {
    if ($dataSystem.optDisplayTp) {
        this.drawGaugeAreaWithTp(rect, actor);
    } else {
        this.drawGaugeAreaWithoutTp(rect, actor);
    }
};
//绘制tp计量
Window_BattleStatus.prototype.drawGaugeAreaWithTp = function(rect, actor) {
    this.drawActorHp(actor, rect.x + 0, rect.y, 108);
    this.drawActorMp(actor, rect.x + 123, rect.y, 96);
    this.drawActorTp(actor, rect.x + 234, rect.y, 96);
};
//绘制无tp计量区域
Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
    this.drawActorHp(actor, rect.x + 0, rect.y, 201);
    this.drawActorMp(actor, rect.x + 216,  rect.y, 114);
};
