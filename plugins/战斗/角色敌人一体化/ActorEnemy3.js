
Game_ActorEnemy.prototype.initialize = function (actorId) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(actorId);

};
Game_ActorEnemy.prototype.initMembers = function () {
    Game_Battler.prototype.initMembers.call(this);

    //角色id = 0
    this._actorId = 0;
    //名称 = ''
    this._name = '';
    //昵称 = ''
    this._nickname = '';
    //职业id = 0
    this._classId = 0;
    //等级 = 0
    this._level = 0;
    //行走图名称 = ''
    this._characterName = '';
    //行走图索引 = 0
    this._characterIndex = 0;
    //脸图名称 = ''
    this._faceName = '';
    //脸图索引 = 0
    this._faceIndex = 0;
    //战斗图名称 = ''
    this._battlerName = '';
    //经验值 = {}
    this._exp = {};
    //技能组 = []
    this._skills = [];
    //装备组 = []
    this._equips = [];
    //动作输入索引 = 0
    this._actionInputIndex = 0;
    //最后菜单技能 = 新 游戏项目
    this._lastMenuSkill = new Game_Item();
    //最后战斗技能 = 新 游戏项目
    this._lastBattleSkill = new Game_Item();
    //最后命令符号 = ''
    this._lastCommandSymbol = '';




    //敌人设置
    //敌人id = 0
    this._enemyId = 0;
    //标记 = ""
    this._letter = '';
    //复数 = false
    this._plural = false;
    //画面x = 0
    this._screenX = 0;
    //画面y = 0
    this._screenY = 0;
};
Game_ActorEnemy.prototype.setup = function () {




};


Game_ActorEnemy.prototype.setupActor = function (actorId) {
    //角色 = 数据角色组 [ actorId//角色id ]
    var actor = $dataActors[actorId];
    //角色id = actorId//角色id
    this._actorId = actorId;
    //名称 = 角色 名称
    this._name = actor.name;
    //昵称 = 角色 昵称
    this._nickname = actor.nickname;
    //人物简介 = 角色 人物简介
    this._profile = actor.profile;
    //职业id = 角色 职业id
    this._classId = actor.classId;
    //等级 = 角色 初始化等级
    this._level = actor.initialLevel;
    //初始化图片()
    this.initImages();
    //初始化经验值()
    this.initExp();
    //初始化技能()
    this.initSkills();
    //初始化装备组(角色 装备组)
    this.initEquips(actor.equips);
    //清除参数增加()
    this.clearParamPlus();
    //完全恢复()
    this.recoverAll();
 
};


Game_ActorEnemy.prototype.setupEnemy = function (enemyId, x, y) {
    //敌人id = enemyId//敌人id
    this._enemyId = enemyId;
    //画面x = x
    this._screenX = x;
    //画面y = y
    this._screenY = y;
    //完全恢复()
    this.recoverAll();
};

 

Game_ActorEnemy.prototype.name = function () {
    if (this.isActor()) {
        return this._name
    } else { 
        //返回 原始名称() + ( 复数 ? 标记 : "")
        return this.originalName() + (this._plural ? this._letter : '');
    }
}; 

 
Game_ActorEnemy.prototype.battlerName = function () {
    if (this.isActor()) {
        return this._battlerName;
    }else{
        return this.enemy().battlerName; 
    }
};
Game_ActorEnemy.prototype.friendsUnit = function () {
    if (this.isActor()) {


    }else{


    }

};
Game_ActorEnemy.prototype.opponentsUnit = function () {
    if (this.isActor()) {


    }else{

        
    }
};
Game_ActorEnemy.prototype.index = function () {
    if (this.isActor()) {


    }else{

        
    }
};
Game_ActorEnemy.prototype.isBattleMember = function () {
    if (this.isActor()) {


    }else{

        
    }
};
Game_ActorEnemy.prototype.traitObjects = function () {

};
Game_ActorEnemy.prototype.paramBase = function () {
    if (this.isActor()) { 
        return this.currentClass().params[paramId][this._level]; 
    }else{

        
    }
};
Game_ActorEnemy.prototype.isSpriteVisible = function () {
    if (this.isActor()) {


    }else{

        
    }
};
Game_ActorEnemy.prototype.performActionStart = function () {
    if (this.isActor()) {


    }else{

        
    }
};
Game_ActorEnemy.prototype.performAction = function () {
    if (this.isActor()) {


    }else{

        
    }
};
Game_ActorEnemy.prototype.performActionEnd = function () {
    if (this.isActor()) {


    }else{

        
    }
};
Game_ActorEnemy.prototype.performDamage = function () {
    if (this.isActor()) {


    }else{

        
    } 
};
Game_ActorEnemy.prototype.performCollapse = function () {
    if (this.isActor()) {


    }else{

        
    }
};



Game_ActorEnemy.prototype.makeActions = function () {
    if (this.isActor()) {


    }else{

        
    }
}