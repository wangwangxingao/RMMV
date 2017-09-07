
//-----------------------------------------------------------------------------
// Game_Actor
// 游戏角色
// The game object class for an actor.
// 角色的游戏对象类

function Game_Actor() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Game_Actor.prototype = Object.create(Game_Battler.prototype);
//设置创造者
Game_Actor.prototype.constructor = Game_Actor;

//定义属性 
Object.defineProperty(Game_Actor.prototype, 'level', {
    get: function() {
        return this._level;
    },
    configurable: true
});
//初始化
Game_Actor.prototype.initialize = function(actorId) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(actorId);
};
//初始化成员
Game_Actor.prototype.initMembers = function() {
    Game_Battler.prototype.initMembers.call(this);
    this._actorId = 0;
    this._name = '';
    this._nickname = '';
    this._classId = 0;
    this._level = 0;
    this._characterName = '';
    this._characterIndex = 0;
    this._faceName = '';
    this._faceIndex = 0;
    this._battlerName = '';
    this._exp = {};
    this._skills = [];
    this._equips = [];
    this._actionInputIndex = 0;
    this._lastMenuSkill = new Game_Item();
    this._lastBattleSkill  = new Game_Item();
    this._lastCommandSymbol = '';
};
//安装
Game_Actor.prototype.setup = function(actorId) {
    var actor = $dataActors[actorId];
    this._actorId = actorId;
    this._name = actor.name;
    this._nickname = actor.nickname;
    this._profile = actor.profile;
    this._classId = actor.classId;
    this._level = actor.initialLevel;
    this.initImages();
    this.initExp();
    this.initSkills();
    this.initEquips(actor.equips);
    this.clearParamPlus();
    this.recoverAll();
};
//角色id
Game_Actor.prototype.actorId = function() {
    return this._actorId;
};
//角色
Game_Actor.prototype.actor = function() {
    return $dataActors[this._actorId];
};
//名称
Game_Actor.prototype.name = function() {
    return this._name;
};
//设置名称
Game_Actor.prototype.setName = function(name) {
    this._name = name;
};
//昵称
Game_Actor.prototype.nickname = function() {
    return this._nickname;
};
//设置昵称
Game_Actor.prototype.setNickname = function(nickname) {
    this._nickname = nickname;
};
//人物简介
Game_Actor.prototype.profile = function() {
    return this._profile;
};
//设置人物简介
Game_Actor.prototype.setProfile = function(profile) {
    this._profile = profile;
};
//行走图名称
Game_Actor.prototype.characterName = function() {
    return this._characterName;
};
//行走图索引
Game_Actor.prototype.characterIndex = function() {
    return this._characterIndex;
};
//脸名称
Game_Actor.prototype.faceName = function() {
    return this._faceName;
};
//脸索引
Game_Actor.prototype.faceIndex = function() {
    return this._faceIndex;
};
//战斗者名称
Game_Actor.prototype.battlerName = function() {
    return this._battlerName;
};
//清除状态
Game_Actor.prototype.clearStates = function() {
    Game_Battler.prototype.clearStates.call(this);
    this._stateSteps = {};
};
//抹去状态
Game_Actor.prototype.eraseState = function(stateId) {
    Game_Battler.prototype.eraseState.call(this, stateId);
    delete this._stateSteps[stateId];
};
//抹去状态计数
Game_Actor.prototype.resetStateCounts = function(stateId) {
    Game_Battler.prototype.resetStateCounts.call(this, stateId);
    this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;
};
//初始化图片
Game_Actor.prototype.initImages = function() {
    var actor = this.actor();
    this._characterName = actor.characterName;
    this._characterIndex = actor.characterIndex;
    this._faceName = actor.faceName;
    this._faceIndex = actor.faceIndex;
    this._battlerName = actor.battlerName;
};
//经验 为等级
Game_Actor.prototype.expForLevel = function(level) {
    var c = this.currentClass();
    var basis = c.expParams[0];
    var extra = c.expParams[1];
    var acc_a = c.expParams[2];
    var acc_b = c.expParams[3];
    return Math.round(basis*(Math.pow(level-1, 0.9+acc_a/250))*level*
            (level+1)/(6+Math.pow(level,2)/50/acc_b)+(level-1)*extra);
};
//初始化经验
Game_Actor.prototype.initExp = function() {
    this._exp[this._classId] = this.currentLevelExp();
};
//当前经验
Game_Actor.prototype.currentExp = function() {
    return this._exp[this._classId];
};
//当前等级经验
Game_Actor.prototype.currentLevelExp = function() {
    return this.expForLevel(this._level);
};
//下一级经验
Game_Actor.prototype.nextLevelExp = function() {
    return this.expForLevel(this._level + 1);
};
//下一级需要经验
Game_Actor.prototype.nextRequiredExp = function() {
    return this.nextLevelExp() - this.currentExp();
};
//最大等级
Game_Actor.prototype.maxLevel = function() {
    return this.actor().maxLevel;
};
//是最大等级
Game_Actor.prototype.isMaxLevel = function() {
    return this._level >= this.maxLevel();
};
//初始化技能
Game_Actor.prototype.initSkills = function() {
    this._skills = [];
    this.currentClass().learnings.forEach(function(learning) {
        if (learning.level <= this._level) {
            this.learnSkill(learning.skillId);
        }
    }, this);
};
//初始化装备
Game_Actor.prototype.initEquips = function(equips) {
    var slots = this.equipSlots();
    var maxSlots = slots.length;
    this._equips = [];
    for (var i = 0; i < maxSlots; i++) {
        this._equips[i] = new Game_Item();
    }
    for (var j = 0; j < equips.length; j++) {
        if (j < maxSlots) {
            this._equips[j].setEquip(slots[j] === 1, equips[j]);
        }
    }
    this.releaseUnequippableItems(true);
    this.refresh();
};
//装备槽
Game_Actor.prototype.equipSlots = function() {
    var slots = [];
    for (var i = 1; i < $dataSystem.equipTypes.length; i++) {
        slots.push(i);
    }
    if (slots.length >= 2 && this.isDualWield()) {
        slots[1] = 1;
    }
    return slots;
};
//装备
Game_Actor.prototype.equips = function() {
    return this._equips.map(function(item) {
        return item.object();
    });
};
//武器
Game_Actor.prototype.weapons = function() {
    return this.equips().filter(function(item) {
        return item && DataManager.isWeapon(item);
    });
};
//防具
Game_Actor.prototype.armors = function() {
    return this.equips().filter(function(item) {
        return item && DataManager.isArmor(item);
    });
};
//有武器
Game_Actor.prototype.hasWeapon = function(weapon) {
    return this.weapons().contains(weapon);
};
//有防具
Game_Actor.prototype.hasArmor = function(armor) {
    return this.armors().contains(armor);
};
//是装备改变可以
Game_Actor.prototype.isEquipChangeOk = function(slotId) {
    return (!this.isEquipTypeLocked(this.equipSlots()[slotId]) &&
            !this.isEquipTypeSealed(this.equipSlots()[slotId]));
};
//改变装备
Game_Actor.prototype.changeEquip = function(slotId, item) {
    if (this.tradeItemWithParty(item, this.equips()[slotId]) &&
            (!item || this.equipSlots()[slotId] === item.etypeId)) {
        this._equips[slotId].setObject(item);
        this.refresh();
    }
};
//强制改变装备
Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
    this._equips[slotId].setObject(item);
    this.releaseUnequippableItems(true);
    this.refresh();
};
//交换项目和队伍
Game_Actor.prototype.tradeItemWithParty = function(newItem, oldItem) {
    if (newItem && !$gameParty.hasItem(newItem)) {
        return false;
    } else {
        $gameParty.gainItem(oldItem, 1);
        $gameParty.loseItem(newItem, 1);
        return true;
    }
};
//改变装备通过id
Game_Actor.prototype.changeEquipById = function(etypeId, itemId) {
    var slotId = etypeId - 1;
    if (this.equipSlots()[slotId] === 1) {
        this.changeEquip(slotId, $dataWeapons[itemId]);
    } else {
        this.changeEquip(slotId, $dataArmors[itemId]);
    }
};
//是装备后
Game_Actor.prototype.isEquipped = function(item) {
    return this.equips().contains(item);
};
//丢弃装备
Game_Actor.prototype.discardEquip = function(item) {
    var slotId = this.equips().indexOf(item);
    if (slotId >= 0) {
        this._equips[slotId].setObject(null);
    }
};
//解放能无装备的物品
Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
    for (;;) {
        var slots = this.equipSlots();
        var equips = this.equips();
        var changed = false;
        for (var i = 0; i < equips.length; i++) {
            var item = equips[i];
            if (item && (!this.canEquip(item) || item.etypeId !== slots[i])) {
                if (!forcing) {
                    this.tradeItemWithParty(null, item);
                }
                this._equips[i].setObject(null);
                changed = true;
            }
        }
        if (!changed) {
            break;
        }
    }
};
//清除装备
Game_Actor.prototype.clearEquipments = function() {
    var maxSlots = this.equipSlots().length;
    for (var i = 0; i < maxSlots; i++) {
        if (this.isEquipChangeOk(i)) {
            this.changeEquip(i, null);
        }
    }
};
//最好装备
Game_Actor.prototype.optimizeEquipments = function() {
    var maxSlots = this.equipSlots().length;
    this.clearEquipments();
    for (var i = 0; i < maxSlots; i++) {
        if (this.isEquipChangeOk(i)) {
            this.changeEquip(i, this.bestEquipItem(i));
        }
    }
};
//最好装备项目
Game_Actor.prototype.bestEquipItem = function(slotId) {
    var etypeId = this.equipSlots()[slotId];
    var items = $gameParty.equipItems().filter(function(item) {
        return item.etypeId === etypeId && this.canEquip(item);
    }, this);
    var bestItem = null;
    var bestPerformance = -1000;
    for (var i = 0; i < items.length; i++) {
        var performance = this.calcEquipItemPerformance(items[i]);
        if (performance > bestPerformance) {
            bestPerformance = performance;
            bestItem = items[i];
        }
    }
    return bestItem;
};
//计算装备项目成绩
Game_Actor.prototype.calcEquipItemPerformance = function(item) {
    return item.params.reduce(function(a, b) {
        return a + b;
    });
};
//是技能武器种类可以
Game_Actor.prototype.isSkillWtypeOk = function(skill) {
    var wtypeId1 = skill.requiredWtypeId1;
    var wtypeId2 = skill.requiredWtypeId2;
    if ((wtypeId1 === 0 && wtypeId2 === 0) ||
            (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
            (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))) {
        return true;
    } else {
        return false;
    }
};
//是武器种类装备后
Game_Actor.prototype.isWtypeEquipped = function(wtypeId) {
    return this.weapons().some(function(weapon) {
        return weapon.wtypeId === wtypeId;
    });
};
//刷新
Game_Actor.prototype.refresh = function() {
    this.releaseUnequippableItems(false);
    Game_Battler.prototype.refresh.call(this);
};
//是角色
Game_Actor.prototype.isActor = function() {
    return true;
};
//朋友小组
Game_Actor.prototype.friendsUnit = function() {
    return $gameParty;
};
//对手小组
Game_Actor.prototype.opponentsUnit = function() {
    return $gameTroop;
};
//索引
Game_Actor.prototype.index = function() {
    return $gameParty.members().indexOf(this);
};
//是战斗成员
Game_Actor.prototype.isBattleMember = function() {
    return $gameParty.battleMembers().contains(this);
};
//是编队改变可以
Game_Actor.prototype.isFormationChangeOk = function() {
    return true;
};
//当前职业
Game_Actor.prototype.currentClass = function() {
    return $dataClasses[this._classId];
};
//是职业
Game_Actor.prototype.isClass = function(gameClass) {
    return gameClass && this._classId === gameClass.id;
};
//技能
Game_Actor.prototype.skills = function() {
    var list = [];
    this._skills.concat(this.addedSkills()).forEach(function(id) {
        if (!list.contains($dataSkills[id])) {
            list.push($dataSkills[id]);
        }
    });
    return list;
};
//可用技能
Game_Actor.prototype.usableSkills = function() {
    return this.skills().filter(function(skill) {
        return this.canUse(skill);
    }, this);
};
//特性对象
Game_Actor.prototype.traitObjects = function() {
    var objects = Game_Battler.prototype.traitObjects.call(this);
    objects = objects.concat([this.actor(), this.currentClass()]);
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
            objects.push(item);
        }
    }
    return objects;
};
//攻击元素
Game_Actor.prototype.attackElements = function() {
    var set = Game_Battler.prototype.attackElements.call(this);
    if (this.hasNoWeapons() && !set.contains(this.bareHandsElementId())) {
        set.push(this.bareHandsElementId());
    }
    return set;
};
//有无武器
Game_Actor.prototype.hasNoWeapons = function() {
    return this.weapons().length === 0;
};
//赤手元素id
Game_Actor.prototype.bareHandsElementId = function() {
    return 1;
};
//参数最大
Game_Actor.prototype.paramMax = function(paramId) {
    if (paramId === 0) {
        return 9999;    // MHP
    }
    return Game_Battler.prototype.paramMax.call(this, paramId);
};
//参数基础
Game_Actor.prototype.paramBase = function(paramId) {
    return this.currentClass().params[paramId][this._level];
};
//参数附加
Game_Actor.prototype.paramPlus = function(paramId) {
    var value = Game_Battler.prototype.paramPlus.call(this, paramId);
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
            value += item.params[paramId];
        }
    }
    return value;
};
//攻击动画id 1
Game_Actor.prototype.attackAnimationId1 = function() {
    if (this.hasNoWeapons()) {
        return this.bareHandsAnimationId();
    } else {
        var weapons = this.weapons();
        return weapons[0] ? weapons[0].animationId : 0;
    }
};
//攻击动画id 2
Game_Actor.prototype.attackAnimationId2 = function() {
    var weapons = this.weapons();
    return weapons[1] ? weapons[1].animationId : 0;
};
//赤手动画id
Game_Actor.prototype.bareHandsAnimationId = function() {
    return 1;
};
//改变经验值
Game_Actor.prototype.changeExp = function(exp, show) {
    this._exp[this._classId] = Math.max(exp, 0);
    var lastLevel = this._level;
    var lastSkills = this.skills();
    while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
        this.levelUp();
    }
    while (this.currentExp() < this.currentLevelExp()) {
        this.levelDown();
    }
    if (show && this._level > lastLevel) {
        this.displayLevelUp(this.findNewSkills(lastSkills));
    }
    this.refresh();
};
//等级上升
Game_Actor.prototype.levelUp = function() {
    this._level++;
    this.currentClass().learnings.forEach(function(learning) {
        if (learning.level === this._level) {
            this.learnSkill(learning.skillId);
        }
    }, this);
};
//等级下降
Game_Actor.prototype.levelDown = function() {
    this._level--;
};
//找到新的技能
Game_Actor.prototype.findNewSkills = function(lastSkills) {
    var newSkills = this.skills();
    for (var i = 0; i < lastSkills.length; i++) {
        var index = newSkills.indexOf(lastSkills[i]);
        if (index >= 0) {
            newSkills.splice(index, 1);
        }
    }
    return newSkills;
};
//显示等级上升
Game_Actor.prototype.displayLevelUp = function(newSkills) {
    var text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
    $gameMessage.newPage();
    $gameMessage.add(text);
    newSkills.forEach(function(skill) {
        $gameMessage.add(TextManager.obtainSkill.format(skill.name));
    });
};
//获得经验值
Game_Actor.prototype.gainExp = function(exp) {
    var newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
    this.changeExp(newExp, this.shouldDisplayLevelUp());
};
//最后经验值比例
Game_Actor.prototype.finalExpRate = function() {
    return this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate());
};
//保留成员的exp
Game_Actor.prototype.benchMembersExpRate = function() {
    return $dataSystem.optExtraExp ? 1 : 0;
};
//需要显示等级上升
Game_Actor.prototype.shouldDisplayLevelUp = function() {
    return true;
};
//改变等级
Game_Actor.prototype.changeLevel = function(level, show) {
    level = level.clamp(1, this.maxLevel());
    this.changeExp(this.expForLevel(level), show);
};
//学习技能
Game_Actor.prototype.learnSkill = function(skillId) {
    if (!this.isLearnedSkill(skillId)) {
        this._skills.push(skillId);
        this._skills.sort(function(a, b) {
            return a - b;
        });
    }
};
//忘记技能
Game_Actor.prototype.forgetSkill = function(skillId) {
    var index = this._skills.indexOf(skillId);
    if (index >= 0) {
        this._skills.splice(index, 1);
    }
};
//是学习了的技能
Game_Actor.prototype.isLearnedSkill = function(skillId) {
    return this._skills.contains(skillId);
};
//改变职业
Game_Actor.prototype.changeClass = function(classId, keepExp) {
    if (keepExp) {
        this._exp[classId] = this._exp();
    }
    this._classId = classId;
    this.changeExp(this._exp[this._classId] || 0, false);
    this.refresh();
};
//设置行走图图像
Game_Actor.prototype.setCharacterImage = function(characterName, characterIndex) {
    this._characterName = characterName;
    this._characterIndex = characterIndex;
};
//设置脸图图像
Game_Actor.prototype.setFaceImage = function(faceName, faceIndex) {
    this._faceName = faceName;
    this._faceIndex = faceIndex;
};
//设置战斗图图像
Game_Actor.prototype.setBattlerImage = function(battlerName) {
    this._battlerName = battlerName;
};
//是精灵显示
Game_Actor.prototype.isSpriteVisible = function() {
    return $gameSystem.isSideView();
};
//开始动画
Game_Actor.prototype.startAnimation = function(animationId, mirror, delay) {
    mirror = !mirror;
    Game_Battler.prototype.startAnimation.call(this, animationId, mirror, delay);
};
//进行动作开始
Game_Actor.prototype.performActionStart = function(action) {
    Game_Battler.prototype.performActionStart.call(this, action);
};
//进行动作
Game_Actor.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);
    if (action.isAttack()) {
        this.performAttack();
    } else if (action.isGuard()) {
        this.requestMotion('guard');
    } else if (action.isMagicSkill()) {
        this.requestMotion('spell');
    } else if (action.isSkill()) {
        this.requestMotion('skill');
    } else if (action.isItem()) {
        this.requestMotion('item');
    }
};
//进行动作结束
Game_Actor.prototype.performActionEnd = function() {
    Game_Battler.prototype.performActionEnd.call(this);
};
//进行攻击
Game_Actor.prototype.performAttack = function() {
    var weapons = this.weapons();
    var wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
    var attackMotion = $dataSystem.attackMotions[wtypeId];
    if (attackMotion) {
        if (attackMotion.type === 0) {
            this.requestMotion('thrust');
        } else if (attackMotion.type === 1) {
            this.requestMotion('swing');
        } else if (attackMotion.type === 2) {
            this.requestMotion('missile');
        }
        this.startWeaponAnimation(attackMotion.weaponImageId);
    }
};
//进行伤害
Game_Actor.prototype.performDamage = function() {
    Game_Battler.prototype.performDamage.call(this);
    if (this.isSpriteVisible()) {
        this.requestMotion('damage');
    } else {
        $gameScreen.startShake(5, 5, 10);
    }
    SoundManager.playActorDamage();
};
//进行闪避
Game_Actor.prototype.performEvasion = function() {
    Game_Battler.prototype.performEvasion.call(this);
    this.requestMotion('evade');
};
//进行魔法闪避
Game_Actor.prototype.performMagicEvasion = function() {
    Game_Battler.prototype.performMagicEvasion.call(this);
    this.requestMotion('evade');
};
//进行反击
Game_Actor.prototype.performCounter = function() {
    Game_Battler.prototype.performCounter.call(this);
    this.performAttack();
};
//进行死亡
Game_Actor.prototype.performCollapse = function() {
    Game_Battler.prototype.performCollapse.call(this);
    if ($gameParty.inBattle()) {
        SoundManager.playActorCollapse();
    }
};
//进行胜利
Game_Actor.prototype.performVictory = function() {
    if (this.canMove()) {
        this.requestMotion('victory');
    }
};
//进行逃跑
Game_Actor.prototype.performEscape = function() {
    if (this.canMove()) {
        this.requestMotion('escape');
    }
};
//制作动作表
Game_Actor.prototype.makeActionList = function() {
    var list = [];
    var action = new Game_Action(this);
    action.setAttack();
    list.push(action);
    this.usableSkills().forEach(function(skill) {
        action = new Game_Action(this);
        action.setSkill(skill.id);
        list.push(action);
    }, this);
    return list;
};
//制作自动战斗动作
Game_Actor.prototype.makeAutoBattleActions = function() {
    for (var i = 0; i < this.numActions(); i++) {
        var list = this.makeActionList();
        var maxValue = Number.MIN_VALUE;
        for (var j = 0; j < list.length; j++) {
            var value = list[j].evaluate();
            if (value > maxValue) {
                maxValue = value;
                this.setAction(i, list[j]);
            }
        }
    }
    this.setActionState('waiting');
};
//制作混乱动作
Game_Actor.prototype.makeConfusionActions = function() {
    for (var i = 0; i < this.numActions(); i++) {
        this.action(i).setConfusion();
    }
    this.setActionState('waiting');
};
//制作动作
Game_Actor.prototype.makeActions = function() {
    Game_Battler.prototype.makeActions.call(this);
    if (this.numActions() > 0) {
        this.setActionState('undecided');
    } else {
        this.setActionState('waiting');
    }
    if (this.isAutoBattle()) {
        this.makeAutoBattleActions();
    } else if (this.isConfused()) {
        this.makeConfusionActions();
    }
};
//当演员走
Game_Actor.prototype.onPlayerWalk = function() {
    this.clearResult();
    this.checkFloorEffect();
    if ($gamePlayer.isNormal()) {
        this.turnEndOnMap();
        this.states().forEach(function(state) {
            this.updateStateSteps(state);
        }, this);
        this.showAddedStates();
        this.showRemovedStates();
    }
};
//更新状态步骤
Game_Actor.prototype.updateStateSteps = function(state) {
    if (state.removeByWalking) {
        if (this._stateSteps[state.id] > 0) {
            if (--this._stateSteps[state.id] === 0) {
                this.removeState(state.id);
            }
        }
    }
};
//显示增加状态
Game_Actor.prototype.showAddedStates = function() {
    this.result().addedStateObjects().forEach(function(state) {
        if (state.message1) {
            $gameMessage.add(this._name + state.message1);
        }
    }, this);
};
//显示移除状态
Game_Actor.prototype.showRemovedStates = function() {
    this.result().removedStateObjects().forEach(function(state) {
        if (state.message4) {
            $gameMessage.add(this._name + state.message4);
        }
    }, this);
};
//脚步 为了回合
Game_Actor.prototype.stepsForTurn = function() {
    return 20;
};
//回合结束  在地图上
Game_Actor.prototype.turnEndOnMap = function() {
    if ($gameParty.steps() % this.stepsForTurn() === 0) {
        this.onTurnEnd();
        if (this.result().hpDamage > 0) {
            this.performMapDamage();
        }
    }
};
//检查地面效果
Game_Actor.prototype.checkFloorEffect = function() {
    if ($gamePlayer.isOnDamageFloor()) {
        this.executeFloorDamage();
    }
};
//执行地面伤害
Game_Actor.prototype.executeFloorDamage = function() {
    var damage = Math.floor(this.basicFloorDamage() * this.fdr);
    damage = Math.min(damage, this.maxFloorDamage());
    this.gainHp(-damage);
    if (damage > 0) {
        this.performMapDamage();
    }
};
//基础地面伤害
Game_Actor.prototype.basicFloorDamage = function() {
    return 10;
};
//最大地面伤害
Game_Actor.prototype.maxFloorDamage = function() {
    return $dataSystem.optFloorDeath ? this.hp : Math.max(this.hp - 1, 0);
};
//进行地图伤害
Game_Actor.prototype.performMapDamage = function() {
    if (!$gameParty.inBattle()) {
        $gameScreen.startFlashForDamage();
    }
};
//清除动作
Game_Actor.prototype.clearActions = function() {
    Game_Battler.prototype.clearActions.call(this);
    this._actionInputIndex = 0;
};
//输入动作
Game_Actor.prototype.inputtingAction = function() {
    return this.action(this._actionInputIndex);
};
//选择下一个命令
Game_Actor.prototype.selectNextCommand = function() {
    if (this._actionInputIndex < this.numActions() - 1) {
        this._actionInputIndex++;
        return true;
    } else {
        return false;
    }
};
//选择早先的命令
Game_Actor.prototype.selectPreviousCommand = function() {
    if (this._actionInputIndex > 0) {
        this._actionInputIndex--;
        return true;
    } else {
        return false;
    }
};
//最后菜单技能
Game_Actor.prototype.lastMenuSkill = function() {
    return this._lastMenuSkill.object();
};
//设置最后菜单技能
Game_Actor.prototype.setLastMenuSkill = function(skill) {
    this._lastMenuSkill.setObject(skill);
};
//最后战斗技能
Game_Actor.prototype.lastBattleSkill = function() {
    return this._lastBattleSkill.object();
};
//设置最后战斗技能
Game_Actor.prototype.setLastBattleSkill = function(skill) {
    this._lastBattleSkill.setObject(skill);
};
//最后命令符号
Game_Actor.prototype.lastCommandSymbol = function() {
    return this._lastCommandSymbol;
};
//设置最后命令符号
Game_Actor.prototype.setLastCommandSymbol = function(symbol) {
    this._lastCommandSymbol = symbol;
};
