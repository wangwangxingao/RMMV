


Window_Status.prototype.drawParameters = function (x, y) {
    var lineHeight = this.lineHeight();
    for (var i = 0; i < 6; i++) {
        if (i < 2) {
            var paramId = i + 2;
            var y2 = y + lineHeight * i;
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.param(paramId), x, y2, 160);
            this.resetTextColor();
            this.drawText(this._actor.param(paramId), x + 160, y2, 60, 'right');
        } else if (i > 3) { 
            var paramId = i + 2;
            var y2 = y + lineHeight * (i - 2);
            this.changeTextColor(this.systemColor());
            this.drawText(TextManager.param(paramId), x, y2, 160);
            this.resetTextColor();
            this.drawText(this._actor.param(paramId), x + 160, y2, 60, 'right'); 
        }
    }
};


Window_EquipStatus.prototype.refresh = function () {
    this.contents.clear();
    if (this._actor) {
        this.drawActorName(this._actor, this.textPadding(), 0);
        for (var i = 0; i < 6; i++) {
            if (i < 2) {
                this.drawItem(0, this.lineHeight() * (1 + i), 2 + i);
            } else if (i > 3) {
                this.drawItem(0, this.lineHeight() * (1 + i - 2), 2 + i);
            }
        }
    }
};




Window_MenuCommand.prototype.addOptionsCommand = function () {
    //if (this.needsCommand('options')) {
    //var enabled = this.isOptionsEnabled();
    //this.addCommand(TextManager.options, 'options', enabled);
    //}
};




Window_TitleCommand.prototype.makeCommandList = function () {
    this.addCommand(TextManager.newGame, 'newGame');
    this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
    //    this.addCommand(TextManager.options,   'options');
};

