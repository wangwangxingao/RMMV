
/**-----------------------------------------------------------------------------*/
/** Game_Actor*/
/** 游戏角色*/
/** The game object class for an actor.*/
/** 角色的游戏对象类*/

function Game_Actor() {
    this.initialize.apply(this, arguments);
}

/**设置原形 */
Game_Actor.prototype = Object.create(Game_Battler.prototype);
/**设置创造者*/
Game_Actor.prototype.constructor = Game_Actor;

/**定义属性 */
Object.defineProperty(Game_Actor.prototype, 'level', {
	//获取
    get: function() {
	    //返回 等级
        return this._level;
    },
    //可设置的 true
    configurable: true
});
/**初始化*/
Game_Actor.prototype.initialize = function(actorId) {
	//游戏战斗者 初始化 呼叫(this)
    Game_Battler.prototype.initialize.call(this);
    //安装( 角色id )
    this.setup(actorId);
};
/**初始化成员*/
Game_Actor.prototype.initMembers = function() {
	//游戏战斗者 初始化成员 呼叫(this)
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
    this._lastBattleSkill  = new Game_Item();
    //最后命令符号 = ''
    this._lastCommandSymbol = '';
};
/**安装*/
Game_Actor.prototype.setup = function(actorId) {
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
/**角色id*/
Game_Actor.prototype.actorId = function() {
	//返回 角色id
    return this._actorId;
};
/**角色*/
Game_Actor.prototype.actor = function() {
	//返回 数据角色组 [角色id]
    return $dataActors[this._actorId];
};
/**名称*/
Game_Actor.prototype.name = function() {
	//返回 名称
    return this._name;
};
/**设置名称*/
Game_Actor.prototype.setName = function(name) {
	//名称 = name//名称
    this._name = name;
};
/**昵称*/
Game_Actor.prototype.nickname = function() {
	//返回 昵称
    return this._nickname;
};
/**设置昵称*/
Game_Actor.prototype.setNickname = function(nickname) {
	//昵称 = nickname//昵称
    this._nickname = nickname;
};
/**人物简介*/
Game_Actor.prototype.profile = function() {
	//返回 人物简介
    return this._profile;
};
/**设置人物简介*/
Game_Actor.prototype.setProfile = function(profile) {
	//人物简介 = profile//人物简介
    this._profile = profile;
};
/**行走图名称*/
Game_Actor.prototype.characterName = function() {
	//返回 行走图名称
    return this._characterName;
};
/**行走图索引*/
Game_Actor.prototype.characterIndex = function() {
	//返回 行走图索引
    return this._characterIndex;
};
/**脸图名称*/
Game_Actor.prototype.faceName = function() {
	//返回 脸图名称
    return this._faceName;
};
/**脸图索引*/
Game_Actor.prototype.faceIndex = function() {
	//返回 脸图索引
    return this._faceIndex;
};
/**战斗图名称*/
Game_Actor.prototype.battlerName = function() {
	//返回 战斗图名称
    return this._battlerName;
};
/**清除状态组*/
Game_Actor.prototype.clearStates = function() {
	//游戏战斗者 清除状态组 呼叫(this)
    Game_Battler.prototype.clearStates.call(this);
    //状态步骤组 = {}
    this._stateSteps = {};
};
/**抹去状态*/
Game_Actor.prototype.eraseState = function(stateId) {
	//游戏战斗者 抹去状态 呼叫(this,状态id)
    Game_Battler.prototype.eraseState.call(this, stateId);
    //删除 状态步骤组[状态id]
    delete this._stateSteps[stateId];
};
/**抹去状态计数*/
Game_Actor.prototype.resetStateCounts = function(stateId) {
	//游戏战斗者 抹去状态计数(状态id) 呼叫(this,状态id)
    Game_Battler.prototype.resetStateCounts.call(this, stateId);
    //状态步骤组[状态id]  =  数据状态组[状态id] 
    this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;
};
/**初始化图片*/
Game_Actor.prototype.initImages = function() {
	//角色 = 角色 
    var actor = this.actor();
    //行走图名称 = 角色 行走图名称
    this._characterName = actor.characterName; 
    //行走图索引 = 角色 行走图索引
    this._characterIndex = actor.characterIndex;
    //脸图名称 =   角色 脸图名称
    this._faceName = actor.faceName;
    //脸图索引 = 角色 脸图索引
    this._faceIndex = actor.faceIndex;
    //战斗图名称 = 角色 战斗图名称
    this._battlerName = actor.battlerName;
};
/**经验值为等级*/
Game_Actor.prototype.expForLevel = function(level) {
	//c = 当前职业
    var c = this.currentClass();
    //基础值 = c 经验值参数组[0]
    var basis = c.expParams[0];
    //修正值 = c 经验值参数组[1]
    var extra = c.expParams[1];
    //增加度a = c 经验值参数组[2]
    var acc_a = c.expParams[2];
    //增加度b = c 经验值参数组[3]
    var acc_b = c.expParams[3];
    //返回 数学 四舍五入( 基础值 *  ( 数学 幂(等级-1,0.9+增加度a/250 ) ) * 等级 * 
    return Math.round(basis*(Math.pow(level-1, 0.9+acc_a/250))*level*
            //   (等级+1) / (6 + 数学 幂(等级 , 2) /50/增加度b  )  +  (等级-1) * 修正值 )
            (level+1)/(6+Math.pow(level,2)/50/acc_b)+(level-1)*extra);
};
/**初始化经验值*/
Game_Actor.prototype.initExp = function() {
	//经验值[职业id] = 当前等级经验值()
    this._exp[this._classId] = this.currentLevelExp();
};
/**当前经验值*/
Game_Actor.prototype.currentExp = function() {
	//返回 经验值[职业id]
    return this._exp[this._classId];
};
/**当前等级经验值*/
Game_Actor.prototype.currentLevelExp = function() {
	//返回 经验值为等级(等级)
    return this.expForLevel(this._level);
};
/**下一级经验值*/
Game_Actor.prototype.nextLevelExp = function() {
	//返回 经验值为等级(等级+1)
    return this.expForLevel(this._level + 1);
};
/**下一级需要经验值*/
Game_Actor.prototype.nextRequiredExp = function() {
	//返回 下一级经验值() - 当前经验值()
    return this.nextLevelExp() - this.currentExp();
};
/**最大等级*/
Game_Actor.prototype.maxLevel = function() {
	//返回 角色 最大等级 
    return this.actor().maxLevel;
};
/**是最大等级*/
Game_Actor.prototype.isMaxLevel = function() {
	//返回 等级 >= 最大等级 
    return this._level >= this.maxLevel();
};
/**初始化技能*/
Game_Actor.prototype.initSkills = function() {
	//技能组 = []
    this._skills = [];
    //当前职业 学习组 对每一个 方法( 学习 )
    this.currentClass().learnings.forEach(function(learning) {
	    //如果 学习 等级 <= 等级
        if (learning.level <= this._level) {
	        //学习技能 (学习 技能id)
            this.learnSkill(learning.skillId);
        }
    }, this);
};
/**初始化装备组*/
Game_Actor.prototype.initEquips = function(equips) {
	//槽组 = 装备槽组
    var slots = this.equipSlots();
    //最大槽数 = 槽组 长度
    var maxSlots = slots.length;
    //装备组 = []
    this._equips = [];
    //循环 ( 开始时 i = 0 ; 当 i < 最大槽数 ; 每一次 i++)
    for (var i = 0; i < maxSlots; i++) {
	    //装备组[i] = 新 游戏项目
        this._equips[i] = new Game_Item();
    }
    //循环 ( 开始时 j = 0 ; 当 j < 装备组 长度 ; 每一次 j++)
    for (var j = 0; j < equips.length; j++) {
	    //如果 j < 最大槽数
        if (j < maxSlots) {
	        //装备组[j] 设置装备( 槽组[j] === 1 , 装备组[j] )
            this._equips[j].setEquip(slots[j] === 1, equips[j]);
        }
    }
    //解放不能装备的物品(true)
    this.releaseUnequippableItems(true);
    //刷新
    this.refresh();
};
/**装备槽组*/
Game_Actor.prototype.equipSlots = function() {
	//槽组 =  []
    var slots = []; 
    //循环 ( 开始时 i = 1 ; 当 i < 数据系统 装备种类组 ; 每一次 i++)
    for (var i = 1; i < $dataSystem.equipTypes.length; i++) {
	    //槽组 添加(i)
        slots.push(i);
    }
    //如果 槽组 长度 >= 2 并且 是双刀流
    if (slots.length >= 2 && this.isDualWield()) {
	    //槽组[1] = 1
        slots[1] = 1;
    }
    //返回 槽组
    return slots;
};
/**装备组
 * @return {[object]}
 * 
*/
Game_Actor.prototype.equips = function() {
	//返回 装备组 映射 方法(项目)
    return this._equips.map(function(item) {
	    //返回 项目 对象
        return item.object();
    });
};
/**武器组
 * @return {[object]}
 * 
*/
Game_Actor.prototype.weapons = function() {
	//返回 装备组 过滤 方法(项目)
    return this.equips().filter(function(item) {
	    //返回 项目 并且 数据管理器 是武器(项目)
        return item && DataManager.isWeapon(item);
    });
};
/**防具组
 * @return {[object]}
 * 
*/
Game_Actor.prototype.armors = function() {
	//返回 装备组 过滤 方法(项目)
    return this.equips().filter(function(item) {
	    //返回 项目 并且 数据管理器 是防具(项目)
        return item && DataManager.isArmor(item);
    });
};
/**有武器
 * @param {object} weapon 武器
 * @return {boolean}
 * 
*/
Game_Actor.prototype.hasWeapon = function(weapon) {
	//返回 武器组 包含 (weapon//武器)
    return this.weapons().contains(weapon);
};
/**有防具
 * @param {object} armor 武器
 * @return {boolean}
 * 
*/
Game_Actor.prototype.hasArmor = function(armor) {
	//返回 防具组 包含 (armor//防具) 
    return this.armors().contains(armor);
};
/**是装备改变可以
 * @param {number} slotId 槽id
*/
Game_Actor.prototype.isEquipChangeOk = function(slotId) {
	//返回 ( 不是 是装备种类锁定( 装备槽组 槽id )  并且 不是 是装备种类封印 ( 装备槽组 槽id )     )
    return (!this.isEquipTypeLocked(this.equipSlots()[slotId]) &&
            !this.isEquipTypeSealed(this.equipSlots()[slotId]));
};
/**改变装备*/
Game_Actor.prototype.changeEquip = function(slotId, item) {
	//如果 交物品和队伍 物品 装备组[槽id]) 并且 (不是 物品 或者 装备槽组[槽id] === 物品 装备种类id)
    if (this.tradeItemWithParty(item, this.equips()[slotId]) &&
            (!item || this.equipSlots()[slotId] === item.etypeId)) {
	    //装备组[槽id] 设置对象 (item)
        this._equips[slotId].setObject(item);
        //刷新
        this.refresh();
    }
};
/**强制改变装备*/
Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
	//装备组[槽id] 设置对象 (item)
    this._equips[slotId].setObject(item);
    //解放不能装备的物品(true)
    this.releaseUnequippableItems(true);
    //刷新
    this.refresh();
};
/**交换物品和队伍*/
Game_Actor.prototype.tradeItemWithParty = function(newItem, oldItem) {
	//如果 ( 新物品 并且 不是 游戏队伍 有物品(新物品))
    if (newItem && !$gameParty.hasItem(newItem)) {
	    //返回 false
        return false;
    //否则 
    } else {
	    //游戏队伍 获得物品( 旧物品 ,1 )
        $gameParty.gainItem(oldItem, 1);
	    //游戏队伍 获得物品( 新物品 ,1 )
        $gameParty.loseItem(newItem, 1);
        //返回 true
        return true;
    }
};
/**改变装备通过id*/
Game_Actor.prototype.changeEquipById = function(etypeId, itemId) {
	//槽id = 装备种类id - 1
    var slotId = etypeId - 1;
    //如果 ( 装备槽组[槽id] === 1)
    if (this.equipSlots()[slotId] === 1) {
	    //改变装备( 槽id , 数据武器组 [项目id] )
        this.changeEquip(slotId, $dataWeapons[itemId]);
    } else { 
	    //改变装备( 槽id , 数据防具组 [项目id] )
        this.changeEquip(slotId, $dataArmors[itemId]);
    }
};
/**是装备*/
Game_Actor.prototype.isEquipped = function(item) {
	//返回 装备组() 包含 ( 项目 )
    return this.equips().contains(item);
};
/**丢弃装备*/
Game_Actor.prototype.discardEquip = function(item) {
	//槽id = 装备组() 索引于 (项目)
    var slotId = this.equips().indexOf(item);
    //如果 槽id >=  0
    if (slotId >= 0) {
	    //装备组[槽id] 设置对象 (null)
        this._equips[slotId].setObject(null);
    }
};
/**解放不能装备的物品*/
Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
	//循环
    for (;;) {
	    //槽组 = 装备槽组
        var slots = this.equipSlots();
        //装备组 = 装备组
        var equips = this.equips();
        //改变 = false
        var changed = false;
        //循环 ( 开始时 i = 0 ; 当 i < 装备组 长度 ; 每一次 i++)
        for (var i = 0; i < equips.length; i++) {
	        //项目 = 装备组[i]
            var item = equips[i];
            //如果 项目 并且 ( 不是 能装备(项目) 或者 项目 装备种类id  !== 槽组[i]  )
            if (item && (!this.canEquip(item) || item.etypeId !== slots[i])) {
	            //如果 (不是 强迫)
                if (!forcing) {
	                //交换物品和队伍(null ,项目 )
                    this.tradeItemWithParty(null, item);
                }
                //装备组[i] 设置对象 (null)
                this._equips[i].setObject(null);
                //改变 = true 
                changed = true;
            }
        }
        //如果 不是 改变 
        if (!changed) {
	        //跳出
            break;
        }
    }
};
/**清除装备*/
Game_Actor.prototype.clearEquipments = function() {
    //最大槽数 = 装备槽组() 长度
    var maxSlots = this.equipSlots().length;
    //循环 (开始时 i = 0 ;当 i<最大槽数 ; 每一次 i++ )
    for (var i = 0; i < maxSlots; i++) {
        //如果 ( 是装备改变可以(i) )
        if (this.isEquipChangeOk(i)) {
            //改变装备(i,null)
            this.changeEquip(i, null);
        }
    }
};
/**最好装备*/
Game_Actor.prototype.optimizeEquipments = function() {
    //最大槽数 = 装备槽组() 长度
    var maxSlots = this.equipSlots().length;
    //清除装备()
    this.clearEquipments();
    //循环 (开始时 i = 0 ;当 i<最大槽数 ;每一次 i++)
    for (var i = 0; i < maxSlots; i++) {
        //如果 (是装备改变可以(i))
        if (this.isEquipChangeOk(i)) {
            //改变装备(i,最好装备项目(i))
            this.changeEquip(i, this.bestEquipItem(i));
        }
    }
};
/**最好装备项目
 * @param {number} slotId 槽id
 * @return {object}
*/
Game_Actor.prototype.bestEquipItem = function(slotId) {
    //装备种类id = 装备槽组()[槽id]
    var etypeId = this.equipSlots()[slotId];
    //项目组 = 游戏队伍 装备物品组() 过滤 (项目)
    var items = $gameParty.equipItems().filter(function(item) {
        //返回 项目 装备种类id === 装备种类id 并且 能装备(项目)
        return item.etypeId === etypeId && this.canEquip(item);
    //this
    }, this);
    //最好项目 = null
    var bestItem = null;
    //最好性能 = -1000
    var bestPerformance = -1000;
    //循环(开始时 i = 0 ;当 i < 项目组 长度 ;每一次 i++)
    for (var i = 0; i < items.length; i++) {
        //性能 = 计算装备项目成绩(项目组[i])
        var performance = this.calcEquipItemPerformance(items[i]);
        //如果(性能>最好性能)
        if (performance > bestPerformance) {
            //最好性能 = 性能
            bestPerformance = performance;
            //最好项目 = 项目组[i]
            bestItem = items[i];
        }
    }
    //返回 最好项目
    return bestItem;
};
/**计算装备项目成绩
 * @param {object} item
*/
Game_Actor.prototype.calcEquipItemPerformance = function(item) {
    //返回 项目 参数组 缩减 方法(a,b)
    return item.params.reduce(function(a, b) {
        //返回 a + b
        return a + b;
    });
};
/**是技能武器种类可以*/
Game_Actor.prototype.isSkillWtypeOk = function(skill) {
    //武器种类id1 = 技能 需要武器种类id1
    var wtypeId1 = skill.requiredWtypeId1;
    //武器种类id2 = 技能 需要武器种类id2
    var wtypeId2 = skill.requiredWtypeId2;
    //如果((武器种类id1 === 0 并且 武器种类id2 ===0 ) 或者
    if ((wtypeId1 === 0 && wtypeId2 === 0) ||
            //(武器种类id1>0 并且 是武器种类装备后(武器种类id1)) 或者
            (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
            //(武器种类id2>0 并且 是武器种类装备后(武器种类id2)))
            (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))) {
        //返回 true
        return true;
    //否则 
    } else {
        //返回 false
        return false;
    }
};
/**是武器种类装备后*/
Game_Actor.prototype.isWtypeEquipped = function(wtypeId) {
    //返回 武器组() 一些  方法(武器)
    return this.weapons().some(function(weapon) {
        //返回 武器 武器种类id === wtypeId// 武器种类id
        return weapon.wtypeId === wtypeId;
    });
};
/**刷新*/
Game_Actor.prototype.refresh = function() {
    //解放不能装备的物品(false)
    this.releaseUnequippableItems(false);
    //游戏战斗者 刷新　呼叫(this)
    Game_Battler.prototype.refresh.call(this);
};
/**是角色*/
Game_Actor.prototype.isActor = function() {
    //返回 true
    return true;
};
/**朋友小组*/
Game_Actor.prototype.friendsUnit = function() {
    //返回 游戏队伍
    return $gameParty;
};
/**对手小组*/
Game_Actor.prototype.opponentsUnit = function() {
    //返回 游戏敌群
    return $gameTroop;
};
/**索引*/
Game_Actor.prototype.index = function() {
    //返回 游戏队伍 成员组() 索引于(this)
    return $gameParty.members().indexOf(this);
};
/**是战斗成员*/
Game_Actor.prototype.isBattleMember = function() {
    //返回 游戏队伍 战斗成员组() 包含(this)
    return $gameParty.battleMembers().contains(this);
};
/**是编队改变可以*/
Game_Actor.prototype.isFormationChangeOk = function() {
    //返回 true
    return true;
};
/**当前职业*/
Game_Actor.prototype.currentClass = function() {
    //返回 数据职业组[职业id]
    return $dataClasses[this._classId];
};
/**是职业*/
Game_Actor.prototype.isClass = function(gameClass) {
    //返回 gameClass//游戏职业 并且 职业id === gameClass//游戏职业 id 
    return gameClass && this._classId === gameClass.id;
};
/**技能*/
Game_Actor.prototype.skills = function() {
    //列表 = []
    var list = [];
    //技能组 连接(添加技能组() ) 对每一个 方法(id)
    this._skills.concat(this.addedSkills()).forEach(function(id) {
        //如果 (不是 列表 包含(数据技能组[id]) )
        if (!list.contains($dataSkills[id])) {
            //列表 添加(数据技能组[id])
            list.push($dataSkills[id]);
        }
    });
    //返回 列表
    return list;
};
/**可用技能组*/
Game_Actor.prototype.usableSkills = function() {
    //返回 技能组() 过滤 方法(技能)
    return this.skills().filter(function(skill) {
        //返回 能用(技能)
        return this.canUse(skill);
    //,this
    }, this);
};
/**特性对象组*/
Game_Actor.prototype.traitObjects = function() {
    //对象组 = 游戏战斗者 特性对象组 呼叫(this)
    var objects = Game_Battler.prototype.traitObjects.call(this);
    //对象组 = 对象组 连接 ( [角色(), 当前职业()] )
    objects = objects.concat([this.actor(), this.currentClass()]);
    //装备组 = 装备组()
    var equips = this.equips();
    //循环 (开始时 i=0 ;当 i <装备组 长度 ;每一次 i++)
    for (var i = 0; i < equips.length; i++) {
        //项目 = 装备组[i]
        var item = equips[i];
        //如果 (项目)
        if (item) {
            //对象组 添加(项目)
            objects.push(item);
        }
    }
    //返回 对象组
    return objects;
};
/**攻击元素组*/
Game_Actor.prototype.attackElements = function() {
    //组 = 游戏战斗者 攻击元素组 呼叫(this)
    var set = Game_Battler.prototype.attackElements.call(this);
    //如果(没有武器() 并且 不是 组 包含(赤手元素id) )
    if (this.hasNoWeapons() && !set.contains(this.bareHandsElementId())) {
        //组 添加(赤手元素id)
        set.push(this.bareHandsElementId());
    }
    //返回 组
    return set;
};
/**没有武器*/
Game_Actor.prototype.hasNoWeapons = function() {
    //返回 武器组 长度 === 0
    return this.weapons().length === 0;
};
/**空手元素id*/
Game_Actor.prototype.bareHandsElementId = function() {
    //返回 1
    return 1;
};
/**参数最大*/
Game_Actor.prototype.paramMax = function(paramId) {
    //如果 (参数id === 0 )
    if (paramId === 0) {
        //返回 9999
        return 9999;    // MHP
    }
    //返回 游戏战斗者 参数最大 呼叫(this,参数id)
    return Game_Battler.prototype.paramMax.call(this, paramId);
};
/**参数基础*/
Game_Actor.prototype.paramBase = function(paramId) {
    //返回 当前职业() 参数组[参数id][等级]
    return this.currentClass().params[paramId][this._level];
};
/**参数附加*/
Game_Actor.prototype.paramPlus = function(paramId) {
    //值 = 游戏战斗者 参数增加 呼叫(this,参数id)
    var value = Game_Battler.prototype.paramPlus.call(this, paramId);
    //装备组 = 装备组()
    var equips = this.equips();
    //循环 (开始时 i = 0 ;当 i <装备组 长度 ;每一次 i++)
    for (var i = 0; i < equips.length; i++) {
        //项目 = 装备组[i] 
        var item = equips[i];
        //如果(项目)
        if (item) {
            //值 += 项目 参数组[参数id]
            value += item.params[paramId];
        }
    }
    //返回 值
    return value;
};
/**攻击动画id 1*/
Game_Actor.prototype.attackAnimationId1 = function() {
    //如果( 没有武器() )
    if (this.hasNoWeapons()) {
        //返回 赤手动画id
        return this.bareHandsAnimationId();
    //否则
    } else {
        //武器组 = 武器组()
        var weapons = this.weapons();
        //返回  武器组[0] ? 武器组[0] 动画id : 0
        return weapons[0] ? weapons[0].animationId : 0;
    }
};
/**攻击动画id 2*/
Game_Actor.prototype.attackAnimationId2 = function() {
    //武器组 = 武器组()
    var weapons = this.weapons();
    //返回 武器组[1] ? 武器组[1] 动画id : 0
    return weapons[1] ? weapons[1].animationId : 0;
};
/**赤手动画id*/
Game_Actor.prototype.bareHandsAnimationId = function() {
    //返回 1
    return 1;
};
/**改变经验值*/
Game_Actor.prototype.changeExp = function(exp, show) {
    //经验值[职业id] = 数学 最大值 (exp//经验值 , 0 )
    this._exp[this._classId] = Math.max(exp, 0);
    //之前等级 = 等级
    var lastLevel = this._level;
    //之前技能组 = 技能组()
    var lastSkills = this.skills();
    //当(不是 是最大等级() 并且 当前经验值() >= 下一级经验值() )
    while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
        //等级上升()
        this.levelUp();
    }
    //当(当前经验值() < 当前等级经验值() )
    while (this.currentExp() < this.currentLevelExp()) {
        //等级下降()
        this.levelDown();
    }
    //如果 (show//显示 并且 等级 > 之前等级)
    if (show && this._level > lastLevel) {
        //显示等级上升( 寻找新技能组(之前技能组) )
        this.displayLevelUp(this.findNewSkills(lastSkills));
    }//刷新()
    this.refresh();
};
/**等级上升*/
Game_Actor.prototype.levelUp = function() {
    //等级++
    this._level++;
    //当前职业 学习组 对每一个 方法(学习)
    this.currentClass().learnings.forEach(function(learning) {
        //如果(学习 等级 === 等级)
        if (learning.level === this._level) {
            //学习技能 (学习 技能id)
            this.learnSkill(learning.skillId);
        }
    //,this
    }, this);
};
/**等级下降*/
Game_Actor.prototype.levelDown = function() {
    //等级--
    this._level--;
};
/**寻找新技能组*/
Game_Actor.prototype.findNewSkills = function(lastSkills) {
    //新技能组 = 技能组
    var newSkills = this.skills();
    //循环(开始时 i = 0 ;当 i < 之前技能组 长度;每一次 i++)
    for (var i = 0; i < lastSkills.length; i++) {
        //索引 = 新技能组 索引于(之前技能组[i])
        var index = newSkills.indexOf(lastSkills[i]);
        //如果(索引 >= 0 )
        if (index >= 0) {
            //新技能组 剪接 (索引,1)
            newSkills.splice(index, 1);
        }
    }
    //返回 新技能组
    return newSkills;
};
/**显示等级上升*/
Game_Actor.prototype.displayLevelUp = function(newSkills) {
    //文本 = 文本管理器 等级提高 替换 (名称 , 文本管理器 等级 ,等级)
    var text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
    //游戏消息 新页()
    $gameMessage.newPage();
    //游戏消息 添加(文本)
    $gameMessage.add(text);
    //新技能组 对每一个 方法(技能)
    newSkills.forEach(function(skill) {
        //游戏消息 添加( 文本管理器 获得技能 替换 (技能 名称)  )
        $gameMessage.add(TextManager.obtainSkill.format(skill.name));
    });
};
/**获得经验值*/
Game_Actor.prototype.gainExp = function(exp) {
    //新经验值 = 当前经验值() + 数学 四舍五入(经验值 * 最后经验值比例() )
    var newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
    //改变经验值(新经验值 , 需要显示等级上升() )
    this.changeExp(newExp, this.shouldDisplayLevelUp());
};
/**最后经验值比例*/
Game_Actor.prototype.finalExpRate = function() {
    //返回 经验值比例 * (  是战斗成员() ? 1 : 保留成员的经验值比例() )
    return this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate());
};
/**保留成员的经验值比例*/
Game_Actor.prototype.benchMembersExpRate = function() {
    //返回  数据系统 选择额外经验值 ? 1 : 0
    return $dataSystem.optExtraExp ? 1 : 0;
};
/**需要显示等级上升*/
Game_Actor.prototype.shouldDisplayLevelUp = function() {
    //返回 true
    return true;
};
/**改变等级*/
Game_Actor.prototype.changeLevel = function(level, show) {
    //等级 = 等级 在之间 (1 ,最大等级() )
    level = level.clamp(1, this.maxLevel());
    //改变经验值( 经验值为等级(等级) ,show//显示 )
    this.changeExp(this.expForLevel(level), show);
};
/**学习技能*/
Game_Actor.prototype.learnSkill = function(skillId) {
    //如果 (不是 是学习了的技能(技能id) )
    if (!this.isLearnedSkill(skillId)) {
        //技能组 添加 (技能id)
        this._skills.push(skillId);
        //技能组 排序 方法(a,b)
        this._skills.sort(function(a, b) {
            //返回 a - b
            return a - b;
        });
    }
};
/**忘记技能*/
Game_Actor.prototype.forgetSkill = function(skillId) {
    //索引 = 技能组 索引于 ( 技能id )
    var index = this._skills.indexOf(skillId);
    //如果(索引 >= 0)
    if (index >= 0) {
        //技能组 剪接 (索引,1)
        this._skills.splice(index, 1);
    }
};
/**是学习了的技能*/
Game_Actor.prototype.isLearnedSkill = function(skillId) {
    return this._skills.contains(skillId);
};
/**有技能 */
Game_Actor.prototype.hasSkill = function(skillId) {
    return this.skills().contains($dataSkills[skillId]);
};
/**改变职业*/
Game_Actor.prototype.changeClass = function(classId, keepExp) {
    //如果(keepExp//保留经验值)
    if (keepExp) {
        //经验值[职业id] = 当前经验值()
        this._exp[classId] = this.currentExp();
    }
    //职业id = classId//职业id
    this._classId = classId;
    //改变经验值( 经验值[职业id] || 0 ,false )
    this.changeExp(this._exp[this._classId] || 0, false);
    //刷新()
    this.refresh();
};
/**设置行走图图像*/
Game_Actor.prototype.setCharacterImage = function(characterName, characterIndex) {
    //行走图名称 = characterName
    this._characterName = characterName;
    //行走图索引 = characterIndex
    this._characterIndex = characterIndex;
};
/**设置脸图图像*/
Game_Actor.prototype.setFaceImage = function(faceName, faceIndex) {
    //脸图名称 = faceName
    this._faceName = faceName;
    //脸图索引 = faceIndex
    this._faceIndex = faceIndex;
};
/**设置战斗图图像*/
Game_Actor.prototype.setBattlerImage = function(battlerName) {
    //战斗图名称 = battlerName
    this._battlerName = battlerName;
};
/**是精灵显示*/
Game_Actor.prototype.isSpriteVisible = function() {
    //返回 游戏系统 是侧视()
    return $gameSystem.isSideView();
};
/**开始动画*/
Game_Actor.prototype.startAnimation = function(animationId, mirror, delay) {
    //镜反 = 不是 mirror //镜反
    mirror = !mirror;
    //游戏战斗者 开始动画 呼叫(this,animationId //动画id, mirror//镜反, delay//延迟 )
    Game_Battler.prototype.startAnimation.call(this, animationId, mirror, delay);
};
/**表现动作开始*/
Game_Actor.prototype.performActionStart = function(action) {
    //游戏战斗者 表现动作开始 呼叫(this, 动作 )
    Game_Battler.prototype.performActionStart.call(this, action);
};
/**表现动作*/
Game_Actor.prototype.performAction = function(action) {
    //游戏战斗者 表现动作 呼叫(this, 动作 )
    Game_Battler.prototype.performAction.call(this, action);
    //如果(动作 是攻击() )
    if (action.isAttack()) {
        //表现攻击()
        this.performAttack();
    //如果(动作 是防御() )
    } else if (action.isGuard()) {
        //请求动作( 'guard'//防御 )
        this.requestMotion('guard');
    //如果(动作 是魔法技能() )
    } else if (action.isMagicSkill()) {
        //请求动作( 'spell'//吟唱 )
        this.requestMotion('spell');
    //如果(动作 是技能() )
    } else if (action.isSkill()) {
        //请求动作( 'skill'//技能 )
        this.requestMotion('skill');
    //如果(动作 是物品() )
    } else if (action.isItem()) {
        //请求动作( 'item'//物品 )
        this.requestMotion('item');
    }
};
/**表现动作结束*/
Game_Actor.prototype.performActionEnd = function() {
    //游戏战斗者 表现动作结束 呼叫(this)
    Game_Battler.prototype.performActionEnd.call(this);
};
/**表现攻击*/
Game_Actor.prototype.performAttack = function() {
    //武器组 = 武器组()
    var weapons = this.weapons();
    //武器种类id =  武器组[0] ? 武器组[0] 武器种类id : 0
    var wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
    //攻击动作 = 数据系统 攻击动作组[ 武器种类id ]
    var attackMotion = $dataSystem.attackMotions[wtypeId];
    //如果 ( 攻击动作 )
    if (attackMotion) {
        //如果 (攻击动作 种类 === 0)
        if (attackMotion.type === 0) {
            //请求动作( 'thrust'//突刺 )
            this.requestMotion('thrust');
        //否则 如果 (攻击动作 种类 === 1)
        } else if (attackMotion.type === 1) {
            //请求动作( 'swing'//挥舞 )
            this.requestMotion('swing');
        //否则 如果 (攻击动作 种类 === 2)
        } else if (attackMotion.type === 2) {
            //请求动作( 'missile'//飞行道具 )
            this.requestMotion('missile');
        }
        //开始武器动画(攻击动作 武器图像id )
        this.startWeaponAnimation(attackMotion.weaponImageId);
    }
};
/**表现伤害*/
Game_Actor.prototype.performDamage = function() {
    //游戏战斗者 表现伤害 呼叫(this)
    Game_Battler.prototype.performDamage.call(this);
    if (this.isSpriteVisible()) {
        //请求动作( 'damage'//伤害 )
        this.requestMotion('damage');
    } else {
        //游戏画面 开始震动(5,5,10)
        $gameScreen.startShake(5, 5, 10);
    }
    //声音管理器 播放角色伤害()
    SoundManager.playActorDamage();
};
/**表现闪避*/
Game_Actor.prototype.performEvasion = function() {
    //游戏战斗者 表现闪避 呼叫(this)
    Game_Battler.prototype.performEvasion.call(this);
    //请求动作( 'evade'//闪避 )
    this.requestMotion('evade');
};
/**表现魔法闪避*/
Game_Actor.prototype.performMagicEvasion = function() {
    //游戏战斗者 表现魔法闪避 呼叫(this)
    Game_Battler.prototype.performMagicEvasion.call(this);
    //请求动作( 'evade'//闪避 )
    this.requestMotion('evade');
};
/**表现反击*/
Game_Actor.prototype.performCounter = function() {
    //游戏战斗者 表现反击 呼叫(this)
    Game_Battler.prototype.performCounter.call(this);
    //表现攻击()
    this.performAttack();
};
/**表现死亡*/
Game_Actor.prototype.performCollapse = function() {
    //游戏战斗者 表现死亡 呼叫(this)
    Game_Battler.prototype.performCollapse.call(this);
    //如果 (游戏队伍 在战斗() )
    if ($gameParty.inBattle()) {
        //声音管理器 播放角色死亡()
        SoundManager.playActorCollapse();
    }
};
/**表现胜利*/
Game_Actor.prototype.performVictory = function() {
    //如果 ( 能移动() )
    if (this.canMove()) {
        //请求动作( 'victory'//胜利 )
        this.requestMotion('victory');
    }
};
/**表现逃跑*/
Game_Actor.prototype.performEscape = function() {
    //如果 ( 能移动() )
    if (this.canMove()) {
        //请求动作( 'escape'//逃跑 )
        this.requestMotion('escape');
    }
};
/**制作动作表*/
Game_Actor.prototype.makeActionList = function() {
    //列表 = []
    var list = [];
    //动作 = 新 游戏动作(this)
    var action = new Game_Action(this);
    //动作 设置攻击()
    action.setAttack();
    //列表 添加 (动作)
    list.push(action);
    //可用技能组() 对每一个 方法(技能)
    this.usableSkills().forEach(function(skill) {
        //动作 = 新 游戏动作(this)
        action = new Game_Action(this);
        //动作 设置技能(技能id)
        action.setSkill(skill.id);
        //列表 添加 (动作)
        list.push(action);
    //,this
    }, this);
    //返回 列表
    return list;
};
/**制作自动战斗动作*/
Game_Actor.prototype.makeAutoBattleActions = function() {
    //循环(开始时 i = 0 ;当 i < 动作组总个数 ; 每一次 i++)
    for (var i = 0; i < this.numActions(); i++) {
        //列表 = 制作动作表()
        var list = this.makeActionList();
        //最大值 = 数字 最小值
        var maxValue = Number.MIN_VALUE;
        //循环(开始时 j = 0 ; j< 列表 长度 ;每一次 j++ )
        for (var j = 0; j < list.length; j++) {
            //值 = 列表[j] 评估()
            var value = list[j].evaluate();
            //如果(值 > 最大值 )
            if (value > maxValue) {
                //最大值 = 值
                maxValue = value;
                //设置动作(i , 列表[j] )
                this.setAction(i, list[j]);
            }
        }
    }
    //设置动作状态( "waiting"//等待 ) 
    this.setActionState('waiting');
};
/**制作混乱动作*/
Game_Actor.prototype.makeConfusionActions = function() {
    //循环(开始时 i = 0 ;当 i < 动作组总个数 ; 每一次 i++)
    for (var i = 0; i < this.numActions(); i++) {
        //动作(i) 设置混乱()
        this.action(i).setConfusion();
    }
    //设置动作状态( "waiting"//等待 ) 
    this.setActionState('waiting');
};
/**制作动作组*/
Game_Actor.prototype.makeActions = function() {
    //游戏战斗者 制作动作组 呼叫(this)
    Game_Battler.prototype.makeActions.call(this);
    //如果( 动作组总个数() > 0 )
    if (this.numActions() > 0) {
        //设置动作状态( "undecided"//未定的 )
        this.setActionState('undecided');
    //否则
    } else {
        //设置动作状态( "waiting"//等待 )
        this.setActionState('waiting');
    }
    //如果( 是自动战斗() )
    if (this.isAutoBattle()) {
        //制作自动战斗动作组()
        this.makeAutoBattleActions();
    //否则 如果 ( 是混乱的() )
    } else if (this.isConfused()) {
        //制作混乱动作组()
        this.makeConfusionActions();
    }
};
/**当演员走*/
Game_Actor.prototype.onPlayerWalk = function() {
    //清除结果()
    this.clearResult();
    //检查地面效果()
    this.checkFloorEffect();
    //如果(游戏游戏者 是普通() )
    if ($gamePlayer.isNormal()) {
        //回合结束在地图上()
        this.turnEndOnMap();
        //状态组 对每一个 方法(状态)
        this.states().forEach(function(state) {
            //更新状态步骤(状态)
            this.updateStateSteps(state);
        //,this
        }, this);
        //显示增加状态()
        this.showAddedStates();
        //显示移除状态()
        this.showRemovedStates();
    }
};
/**更新状态步骤*/
Game_Actor.prototype.updateStateSteps = function(state) {
    //如果( 状态 移除通过步行 )
    if (state.removeByWalking) {
        //如果 ( 状态步骤组[状态 id] > 0 )
        if (this._stateSteps[state.id] > 0) {
            //如果(--状态步骤组[状态 id] === 0 )
            if (--this._stateSteps[state.id] === 0) {
                //移除状态(状态 id)
                this.removeState(state.id);
            }
        }
    }
};
/**显示增加状态*/
Game_Actor.prototype.showAddedStates = function() {
    //结果() 添加状态对象() 对每一个 方法(状态)
    this.result().addedStateObjects().forEach(function(state) {
        //如果 (状态 消息1)
        if (state.message1) {
            //游戏消息 添加( 名称 + 状态 消息1)
            $gameMessage.add(this._name + state.message1);
        }
    //,this
    }, this);
};
/**显示移除状态*/
Game_Actor.prototype.showRemovedStates = function() {
    //结果() 移除状态对象() 对每一个 方法(状态)
    this.result().removedStateObjects().forEach(function(state) {
        //如果 (状态 消息4)
        if (state.message4) {
            //游戏消息 添加( 名称 + 状态 消息4)
            $gameMessage.add(this._name + state.message4);
        }
    //,this
    }, this);
};
/**步数为了回合*/
Game_Actor.prototype.stepsForTurn = function() {
    //返回 20
    return 20;
};
/**回合结束在地图上*/
Game_Actor.prototype.turnEndOnMap = function() {
    //如果 (游戏队伍 步数() % 步数为了回合() == 0 )
    if ($gameParty.steps() % this.stepsForTurn() === 0) {
        //当回合结束
        this.onTurnEnd();
        //如果 ( 结果() hp伤害 > 0  )
        if (this.result().hpDamage > 0) {
            //表现地图伤害()
            this.performMapDamage();
        }
    }
};
/**检查地面效果*/
Game_Actor.prototype.checkFloorEffect = function() {
    //如果 (游戏游戏者 是在伤害地面() )
    if ($gamePlayer.isOnDamageFloor()) {
        //执行地面伤害()
        this.executeFloorDamage();
    }
};
/**执行地面伤害*/
Game_Actor.prototype.executeFloorDamage = function() {
    //伤害 = 数学 向下取整(基础地面伤害() * 地面伤害比例)
    var damage = Math.floor(this.basicFloorDamage() * this.fdr);
    //伤害 = 数学 最小值(伤害, 最大地面伤害())
    damage = Math.min(damage, this.maxFloorDamage());
    //获得hp(-伤害)
    this.gainHp(-damage);
    //如果 (伤害 > 0)
    if (damage > 0) {
        //表现地图伤害()
        this.performMapDamage();
    }
};
/**基础地面伤害*/
Game_Actor.prototype.basicFloorDamage = function() {
    //返回 10
    return 10;
};
/**最大地面伤害*/
Game_Actor.prototype.maxFloorDamage = function() {
    //返回  数据系统 选择地面死亡 ? hp : 数学 最大值(hp-1,0)
    return $dataSystem.optFloorDeath ? this.hp : Math.max(this.hp - 1, 0);
};
/**表现地图伤害*/
Game_Actor.prototype.performMapDamage = function() {
    //如果(不是 游戏队伍 在战斗()  )
    if (!$gameParty.inBattle()) {
        //游戏画面 开始闪烁为了伤害()
        $gameScreen.startFlashForDamage();
    }
};
/**清除动作*/
Game_Actor.prototype.clearActions = function() {
    //游戏战斗者 清除动作  呼叫(this)
    Game_Battler.prototype.clearActions.call(this);
    //动作输入索引 = 0
    this._actionInputIndex = 0;
};
/**输入动作*/
Game_Actor.prototype.inputtingAction = function() {
    //返回 动作(动作输入索引)
    return this.action(this._actionInputIndex);
};
/**选择下一个命令*/
Game_Actor.prototype.selectNextCommand = function() {
    //如果 (动作输入索引 < 动作组总个数() - 1 )
    if (this._actionInputIndex < this.numActions() - 1) {
        //动作输入索引++
        this._actionInputIndex++;
        //返回 true
        return true;
    } else {
        //返回 false
        return false;
    }
};
/**选择早先的命令*/
Game_Actor.prototype.selectPreviousCommand = function() {
    //如果 (动作输入索引 > 0)
    if (this._actionInputIndex > 0) {
        //动作输入索引 --
        this._actionInputIndex--;
        //返回 true
        return true;
    //否则
    } else {
        //返回 false
        return false;
    }
};
/**最后菜单技能*/
Game_Actor.prototype.lastMenuSkill = function() {
    //返回 最后战斗技能 对象()
    return this._lastMenuSkill.object();
};
/**设置最后菜单技能*/
Game_Actor.prototype.setLastMenuSkill = function(skill) {
    //最后菜单技能 设置对象(技能)
    this._lastMenuSkill.setObject(skill);
};
/**最后战斗技能*/
Game_Actor.prototype.lastBattleSkill = function() {
    //返回 最后战斗技能 对象()
    return this._lastBattleSkill.object();
};
/**设置最后战斗技能*/
Game_Actor.prototype.setLastBattleSkill = function(skill) {
    //最后战斗技能 设置对象(技能)
    this._lastBattleSkill.setObject(skill);
};
/**最后命令符号*/
Game_Actor.prototype.lastCommandSymbol = function() {
    //返回 最后命令符号
    return this._lastCommandSymbol;
};
/**设置最后命令符号*/
Game_Actor.prototype.setLastCommandSymbol = function(symbol) {
    //最后命令符号 = 符号
    this._lastCommandSymbol = symbol;
};

Game_Actor.prototype.testEscape = function(item) {
    return item.effects.some(function(effect, index, ar) {
        return effect && effect.code === Game_Action.EFFECT_SPECIAL;
    });
};

Game_Actor.prototype.meetsUsableItemConditions = function(item) {
    if($gameParty.inBattle() && !BattleManager.canEscape() && this.testEscape(item)){
        return false;
    }
    return Game_BattlerBase.prototype.meetsUsableItemConditions.call(this, item);
};

