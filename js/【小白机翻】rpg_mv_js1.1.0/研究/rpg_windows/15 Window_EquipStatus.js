
//-----------------------------------------------------------------------------
// Window_EquipStatus
// 窗口装备状态
// The window for displaying parameter changes on the equipment screen.
// 装备画面显示参数改变的窗口

function Window_EquipStatus() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_EquipStatus.prototype = Object.create(Window_Base.prototype);
//设置创造者
Window_EquipStatus.prototype.constructor = Window_EquipStatus;
//初始化
Window_EquipStatus.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._actor = null;
    this._tempActor = null;
    this.refresh();
};
//窗口宽
Window_EquipStatus.prototype.windowWidth = function() {
    return 312;
};
//窗口高
Window_EquipStatus.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};
//可见行数目
Window_EquipStatus.prototype.numVisibleRows = function() {
    return 7;
};
//设置角色
Window_EquipStatus.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};
//刷新
Window_EquipStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        this.drawActorName(this._actor, this.textPadding(), 0);
        for (var i = 0; i < 6; i++) {
            this.drawItem(0, this.lineHeight() * (1 + i), 2 + i);
        }
    }
};
//设置临时角色
Window_EquipStatus.prototype.setTempActor = function(tempActor) {
    if (this._tempActor !== tempActor) {
        this._tempActor = tempActor;
        this.refresh();
    }
};
//绘制项目
Window_EquipStatus.prototype.drawItem = function(x, y, paramId) {
    this.drawParamName(x + this.textPadding(), y, paramId);
    if (this._actor) {
        this.drawCurrentParam(x + 140, y, paramId);
    }
    this.drawRightArrow(x + 188, y);
    if (this._tempActor) {
        this.drawNewParam(x + 222, y, paramId);
    }
};
//绘制参数数字
Window_EquipStatus.prototype.drawParamName = function(x, y, paramId) {
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.param(paramId), x, y, 120);
};
//绘制当前参数
Window_EquipStatus.prototype.drawCurrentParam = function(x, y, paramId) {
    this.resetTextColor();
    this.drawText(this._actor.param(paramId), x, y, 48, 'right');
};
//绘制右箭头
Window_EquipStatus.prototype.drawRightArrow = function(x, y) {
    this.changeTextColor(this.systemColor());
    this.drawText('\u2192', x, y, 32, 'center');
};
//绘制新参数
Window_EquipStatus.prototype.drawNewParam = function(x, y, paramId) {
    var newValue = this._tempActor.param(paramId);
    var diffvalue = newValue - this._actor.param(paramId);
    this.changeTextColor(this.paramchangeTextColor(diffvalue));
    this.drawText(newValue, x, y, 48, 'right');
};
