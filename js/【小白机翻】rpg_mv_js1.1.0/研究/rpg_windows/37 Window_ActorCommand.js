
//-----------------------------------------------------------------------------
// Window_ActorCommand
// 窗口角色命令
// The window for selecting an actor's action on the battle screen.
// 战斗画面选择一个角色动作的窗口

function Window_ActorCommand() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_ActorCommand.prototype = Object.create(Window_Command.prototype);
//设置创造者
Window_ActorCommand.prototype.constructor = Window_ActorCommand;
//初始化
Window_ActorCommand.prototype.initialize = function() {
    var y = Graphics.boxHeight - this.windowHeight();
    Window_Command.prototype.initialize.call(this, 0, y);
    this.openness = 0;
    this.deactivate();
    this._actor = null;
};
//窗口宽
Window_ActorCommand.prototype.windowWidth = function() {
    return 192;
};
//可见行数目
Window_ActorCommand.prototype.numVisibleRows = function() {
    return 4;
};
//制作命令列表
Window_ActorCommand.prototype.makeCommandList = function() {
    if (this._actor) {
        this.addAttackCommand();
        this.addSkillCommands();
        this.addGuardCommand();
        this.addItemCommand();
    }
};
//增加攻击命令
Window_ActorCommand.prototype.addAttackCommand = function() {
    this.addCommand(TextManager.attack, 'attack', this._actor.canAttack());
};
//增加技能命令
Window_ActorCommand.prototype.addSkillCommands = function() {
    var skillTypes = this._actor.addedSkillTypes();
    skillTypes.sort(function(a, b) {
        return a - b;
    });
    skillTypes.forEach(function(stypeId) {
        var name = $dataSystem.skillTypes[stypeId];
        this.addCommand(name, 'skill', true, stypeId);
    }, this);
};
//增加防御命令
Window_ActorCommand.prototype.addGuardCommand = function() {
    this.addCommand(TextManager.guard, 'guard', this._actor.canGuard());
};
//增加物品命令
Window_ActorCommand.prototype.addItemCommand = function() {
    this.addCommand(TextManager.item, 'item');
};
//安装
Window_ActorCommand.prototype.setup = function(actor) {
    this._actor = actor;
    this.clearCommandList();
    this.makeCommandList();
    this.refresh();
    this.selectLast();
    this.activate();
    this.open();
};
//处理确定
Window_ActorCommand.prototype.processOk = function() {
    if (this._actor) {
        if (ConfigManager.commandRemember) {
            this._actor.setLastCommandSymbol(this.currentSymbol());
        } else {
            this._actor.setLastCommandSymbol('');
        }
    }
    Window_Command.prototype.processOk.call(this);
};
//选择列表
Window_ActorCommand.prototype.selectLast = function() {
    this.select(0);
    if (this._actor && ConfigManager.commandRemember) {
        var symbol = this._actor.lastCommandSymbol();
        this.selectSymbol(symbol);
        if (symbol === 'skill') {
            var skill = this._actor.lastBattleSkill();
            if (skill) {
                this.selectExt(skill.stypeId);
            }
        }
    }
};
