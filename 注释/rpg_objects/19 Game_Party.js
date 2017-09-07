
/**-----------------------------------------------------------------------------*/
/** Game_Party*/
/** 游戏队伍  $gameParty*/
/** The game object class for the party. Information such as gold and items is*/
/** included.*/
/** 队伍的游戏对象类.包含物品和金钱这样的信息*/

function Game_Party() {
    this.initialize.apply(this, arguments);
}

/**设置原形 */
Game_Party.prototype = Object.create(Game_Unit.prototype);
/**设置创造者*/
Game_Party.prototype.constructor = Game_Party;

/**游戏队伍 能力遭遇减半*/
Game_Party.ABILITY_ENCOUNTER_HALF    = 0;
/**游戏队伍 能力遭遇无效*/
Game_Party.ABILITY_ENCOUNTER_NONE    = 1;
/**游戏队伍 能力突然袭击 */
Game_Party.ABILITY_CANCEL_SURPRISE   = 2;
/**游戏队伍 能力先发制人*/
Game_Party.ABILITY_RAISE_PREEMPTIVE  = 3;
/**游戏队伍 能力金钱双倍*/
Game_Party.ABILITY_GOLD_DOUBLE       = 4;
/**游戏队伍 能力物品掉落双倍*/
Game_Party.ABILITY_DROP_ITEM_DOUBLE  = 5;


/**初始化*/
Game_Party.prototype.initialize = function() {
    //游戏小组 初始化 呼叫(this)
    Game_Unit.prototype.initialize.call(this);
    //金钱 = 0
    this._gold = 0;
    //步数 = 0
    this._steps = 0;
    //最后项目 = 新 游戏项目()
    this._lastItem = new Game_Item();
    //菜单角色id = 0
    this._menuActorId = 0;
    //目标角色id = 0
    this._targetActorId = 0;
    //角色组 = []
    this._actors = [];
    //初始化所有物品()
    this.initAllItems();
};
/**初始化所有物品*/
Game_Party.prototype.initAllItems = function() {
    //物品组 = {}
    this._items = {};
    //武器组 = {}
    this._weapons = {};
    //防具组 = {}
    this._armors = {};
};
/**存在*/
Game_Party.prototype.exists = function() {
    //返回 角色组 长度 > 0
    return this._actors.length > 0;
};
/**大小*/
Game_Party.prototype.size = function() {
    //返回 成员组 长度 
    return this.members().length;
};
/**是空的*/
Game_Party.prototype.isEmpty = function() {
    //返回 大小() === 0 
    return this.size() === 0;
};
/**成员组*/
Game_Party.prototype.members = function() {
    //返回 在战斗() ? 战斗成员组() :  所有成员组()
    return this.inBattle() ? this.battleMembers() : this.allMembers();
};
/**所有成员组*/
Game_Party.prototype.allMembers = function() {
    //返回 角色组 映射 方法(id)
    return this._actors.map(function(id) {
        //返回 游戏角色组 角色(id)
        return $gameActors.actor(id);
    });
};
/**战斗成员组*/
Game_Party.prototype.battleMembers = function() {
    //返回 所有成员组() 切割(0 , 最大战斗成员数() ) 过滤 方法(角色)
    return this.allMembers().slice(0, this.maxBattleMembers()).filter(function(actor) {
        //角色 是出现的()
        return actor.isAppeared();
    });
};
/**最大战斗成员数*/
Game_Party.prototype.maxBattleMembers = function() {
    //返回 4
    return 4;
};
/**领导者*/
Game_Party.prototype.leader = function() {
    //返回 战斗成员组()[0]
    return this.battleMembers()[0];
};
/**复活战斗成员组*/
Game_Party.prototype.reviveBattleMembers = function() {
    //战斗成员组() 对每一个 方法(角色)
    this.battleMembers().forEach(function(actor) {
        //如果(角色 是死的())
        if (actor.isDead()) {
            //角色 设置hp(1)
            actor.setHp(1);
        }
    });
};
/**物品组*/
Game_Party.prototype.items = function() {
    //列表 = []
    var list = [];
    //循环 (id 在 物品组)
    for (var id in this._items) {
        //列表 添加( 数据物品组[id] )
        list.push($dataItems[id]);
    }
    //返回 列表
    return list;
};
/**武器组*/
Game_Party.prototype.weapons = function() {
    //列表 = []
    var list = [];
    //循环 (id 在 武器组)
    for (var id in this._weapons) {
        //列表 添加( 数据武器组[id] )
        list.push($dataWeapons[id]);
    }
    //返回 列表
    return list;
};
/**防具组*/
Game_Party.prototype.armors = function() {
    //列表 = []
    var list = [];
    //循环 (id 在 防具组)
    for (var id in this._armors) {
        //列表 添加( 数据防具组[id] )
        list.push($dataArmors[id]);
    }
    //返回 列表
    return list;
};
/**装备物品组*/
Game_Party.prototype.equipItems = function() {
    //返回 武器组() 连接 (防具组())
    return this.weapons().concat(this.armors());
};
/**所有物品组*/
Game_Party.prototype.allItems = function() {
    //返回 物品组() 连接 (装备物品组())
    return this.items().concat(this.equipItems());
};
/**物品容器*/
Game_Party.prototype.itemContainer = function(item) {
    //如果(不是 项目)
    if (!item) {
        //返回 null
        return null;
    //否则 如果(数据管理器 是物品(项目))
    } else if (DataManager.isItem(item)) {
        //返回 物品组
        return this._items;
    //否则 如果(数据管理器 是武器(项目))
    } else if (DataManager.isWeapon(item)) {
        //返回 武器组
        return this._weapons;
    //否则 如果(数据管理器 是防具(项目))
    } else if (DataManager.isArmor(item)) {
        //返回 防具组
        return this._armors;
    //否则 
    } else {
        //返回 null
        return null;
    }
};
/**安装开始成员*/
Game_Party.prototype.setupStartingMembers = function() {
    //角色组 = []
    this._actors = [];
    //数据系统 队伍成员组 对每一个 方法(成员id) 
    $dataSystem.partyMembers.forEach(function(actorId) {
        //如果(游戏角色组 角色(角色id))
        if ($gameActors.actor(actorId)) {
            //角色组 添加(角色id)
            this._actors.push(actorId);
        }
    //this
    }, this);
};
/**名称*/
Game_Party.prototype.name = function() {
    //战斗成员组数 = 战斗成员组 长度
    var numBattleMembers = this.battleMembers().length;
    //如果(战斗成员组数 === 0 )
    if (numBattleMembers === 0) {
        //返回 ""
        return '';
    //否则 如果(战斗成员组数 === 1 )
    } else if (numBattleMembers === 1) {
        //返回 领导者() 名称
        return this.leader().name();
    //否则
    } else {
	    //返回 文本管理器 队伍名称 替换( 领导者() 名称)
        return TextManager.partyName.format(this.leader().name());
    }
};
/**安装战斗测试*/
Game_Party.prototype.setupBattleTest = function() {
    //安装战斗测试成员()
    this.setupBattleTestMembers();
    //安装战斗测试物品()
    this.setupBattleTestItems();
};
/**安装战斗测试成员*/
Game_Party.prototype.setupBattleTestMembers = function() {
    //数据系统 测试战斗者组 对每一个 方法(战斗者)
    $dataSystem.testBattlers.forEach(function(battler) {
        //角色 = 游戏角色组 角色(战斗者 角色id)
        var actor = $gameActors.actor(battler.actorId);
        //如果(角色)
        if (actor) {
            //角色 改变等级(战斗者 等级 ,false)
            actor.changeLevel(battler.level, false);
            //角色 初始化装备(战斗者 装备组)
            actor.initEquips(battler.equips);
            //角色 完全恢复()
            actor.recoverAll();
            //添加角色(战斗者 角色id)
            this.addActor(battler.actorId);
        }
    //this )
    }, this);
};
/**安装战斗测试物品*/
Game_Party.prototype.setupBattleTestItems = function() {
    //数据物品组 对每一个 (物品)
    $dataItems.forEach(function(item) {
        //如果(物品 并且 物品 名称 长度 > 0)
        if (item && item.name.length > 0) {
            //获得物品(物品 , 最大物品数(物品))
            this.gainItem(item, this.maxItems(item));
        }
    //this )
    }, this);
};
/**最高等级*/
Game_Party.prototype.highestLevel = function() {
    //返回 数学 最大值 应用(null , 成员组() 映射 方法(角色)
    return Math.max.apply(null, this.members().map(function(actor) {
        //返回 角色 等级
        return actor.level;
    }));
};
/**增加角色*/
Game_Party.prototype.addActor = function(actorId) {
	//如果(不是 角色组 包含(角色id) )
    if (!this._actors.contains(actorId)) {
	    //角色组 添加 (角色id)
        this._actors.push(actorId);
        //游戏游戏者 刷新()
        $gamePlayer.refresh();
        //游戏地图 请求刷新()
        $gameMap.requestRefresh();
    }
};
/**移除角色*/
Game_Party.prototype.removeActor = function(actorId) {
	//如果(角色组 包含(角色id) )
    if (this._actors.contains(actorId)) {
        //角色组 剪接 (角色组 索引于(角色id) , 1 )
        this._actors.splice(this._actors.indexOf(actorId), 1);
        //游戏游戏者 刷新()
        $gamePlayer.refresh();
        //游戏地图 请求刷新()
        $gameMap.requestRefresh();
    }
};
/**金钱*/
Game_Party.prototype.gold = function() {
	//返回 金钱
    return this._gold;
};
/**获得金钱*/
Game_Party.prototype.gainGold = function(amount) {
	//金钱 = (金钱 + 数量 ) 在之间(0,最大金钱)
    this._gold = (this._gold + amount).clamp(0, this.maxGold());
};
/**失去金钱*/
Game_Party.prototype.loseGold = function(amount) {
	//获得金钱(-数量)
    this.gainGold(-amount);
};
/**最大金钱*/
Game_Party.prototype.maxGold = function() {
	//返回 99999999
    return 99999999;
};
/**步数*/
Game_Party.prototype.steps = function() {
	//返回 步数
    return this._steps;
};
/**增加步数*/
Game_Party.prototype.increaseSteps = function() {
	//步数++
    this._steps++;
};
/**物品数字*/
Game_Party.prototype.numItems = function(item) {
	//容器 = 物品容器(项目)
    var container = this.itemContainer(item);
    //返回  容器 ? 容器[项目id] || 0 : 0
    return container ? container[item.id] || 0 : 0;
};
/**最大物品数*/
Game_Party.prototype.maxItems = function(item) {
	//返回 99
    return 99;
};
/**有最大物品数*/
Game_Party.prototype.hasMaxItems = function(item) {
	//返回 物品数字(项目) >= 最大物品数(项目)
    return this.numItems(item) >= this.maxItems(item);
};
/**有项目*/
Game_Party.prototype.hasItem = function(item, includeEquip) {
	//如果 (包含装备 === 未定义)
    if (includeEquip === undefined) {
	    //包含装备 = false
        includeEquip = false;
    }
    //如果( 物品数字(项目)>0 )
    if (this.numItems(item) > 0) {
	    //返回 true
        return true;
    //否则 如果 (  包含装备 并且 是任何成员装备(项目)   )
    } else if (includeEquip && this.isAnyMemberEquipped(item)) {
	    //返回 true
        return true;
    //否则 
    } else {
	    //返回 false
        return false;
    }
};
/**是任何成员装备*/
Game_Party.prototype.isAnyMemberEquipped = function(item) {
    //返回 成员组() 一些 方法(角色)
    return this.members().some(function(actor) {
        //返回 角色 装备组() 包含(项目)
        return actor.equips().contains(item);
    });
};
/**获得物品*/
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    //容器 = 物品容器(项目)
    var container = this.itemContainer(item);
    //如果(容器)
    if (container) {
        //之前数目 = 物品数字(项目)
        var lastNumber = this.numItems(item);
        //新数目 = 之前数目 +  数量
        var newNumber = lastNumber + amount;
        //容器[项目 id] = 新数目 在之间(0 , 最大物品数(项目) )
        container[item.id] = newNumber.clamp(0, this.maxItems(item));
        //如果(容器[项目 id] === 0 )
        if (container[item.id] === 0) {
            //删除 容器[项目 id]
            delete container[item.id];
        }
        //如果(包含装备 并且 新数目 < 0 )
        if (includeEquip && newNumber < 0) {
            //抛弃成员装备(项目 , -新数目 )
            this.discardMembersEquip(item, -newNumber);
        }
        //游戏地图 请求刷新()
        $gameMap.requestRefresh();
    }
};
/**抛弃成员装备*/
Game_Party.prototype.discardMembersEquip = function(item, amount) {
    //n = 数目
    var n = amount;
    //成员组 对每一个 方法(角色)
    this.members().forEach(function(actor) {
        //当( n > 0 并且 角色 是装备(项目) )
        while (n > 0 && actor.isEquipped(item)) {
            //角色 丢弃装备(项目)
            actor.discardEquip(item);
            //n--
            n--;
        }
    });
};
/**失去物品*/
Game_Party.prototype.loseItem = function(item, amount, includeEquip) {
    //获得物品(项目 , -数目 , 包含装备 )
    this.gainItem(item, -amount, includeEquip);
};
/**消耗物品*/
Game_Party.prototype.consumeItem = function(item) {
    //如果( 数据管理器 是物品(项目) 并且 项目 可消耗 )
    if (DataManager.isItem(item) && item.consumable) {
        //失去物品(项目 , 1 )
        this.loseItem(item, 1);
    }
};
/**能使用*/
Game_Party.prototype.canUse = function(item) {
    //返回 成员组() 一些 方法(角色)
    return this.members().some(function(actor) {
        //返回 角色 能使用(项目)
        return actor.canUse(item);
    });
};
/**能输入*/
Game_Party.prototype.canInput = function() {
    //返回 成员组() 一些 方法(角色)
    return this.members().some(function(actor) {
        //返回 角色 能输入()
        return actor.canInput();
    });
};
/**是全部死了*/
Game_Party.prototype.isAllDead = function() {
    //如果(游戏小组 是全部死了 呼叫(this) )
    if (Game_Unit.prototype.isAllDead.call(this)) {
        //返回 在战斗() 或者 不是 是空的()
        return this.inBattle() || !this.isEmpty();
    //否则 
    } else {
        //返回 false
        return false;
    }
};
/**当游戏者走*/
Game_Party.prototype.onPlayerWalk = function() {
    //成员组() 对每一个 方法(角色)
    this.members().forEach(function(actor) {
        //返回 角色 当游戏者走()
        return actor.onPlayerWalk();
    });
};
/**菜单角色*/
Game_Party.prototype.menuActor = function() {
    //角色 = 游戏角色组 角色(菜单角色id)
    var actor = $gameActors.actor(this._menuActorId);
    //如果(不是 成员组() 包含(角色) )
    if (!this.members().contains(actor)) {
        //角色 = 成员组()[0]
        actor = this.members()[0];
    }
    //返回 角色
    return actor;
};
/**设置菜单角色*/
Game_Party.prototype.setMenuActor = function(actor) {
    //菜单角色id = 角色 角色id()
    this._menuActorId = actor.actorId();
};
/**制作菜单角色下一个*/
Game_Party.prototype.makeMenuActorNext = function() {
    //索引 = 成员组() 索引于 ( 菜单角色() )
    var index = this.members().indexOf(this.menuActor());
    //如果(索引 >= 0 )
    if (index >= 0) {
        //索引 =( 索引 + 1 ) % 成员组() 长度
        index = (index + 1) % this.members().length;
        //设置菜单角色( 成员组()[索引] )
        this.setMenuActor(this.members()[index]);
    //否则 
    } else {
        //设置菜单角色( 成员组()[0] )
        this.setMenuActor(this.members()[0]);
    }
};
/**制作菜单角色之前的*/
Game_Party.prototype.makeMenuActorPrevious = function() {
    //索引 = 成员组() 索引于 ( 菜单角色() )
    var index = this.members().indexOf(this.menuActor());
    //如果(索引 >= 0 )
    if (index >= 0) {
        //索引 =( 索引 + 成员组() 长度 - 1 ) % 成员组() 长度
        index = (index + this.members().length - 1) % this.members().length;
        //设置菜单角色( 成员组()[索引] )
        this.setMenuActor(this.members()[index]);
    //否则 
    } else {
        //设置菜单角色( 成员组()[0] )
        this.setMenuActor(this.members()[0]);
    }
};
/**目标角色*/
Game_Party.prototype.targetActor = function() {
    //角色 = 游戏角色组 角色( 目标角色id )
    var actor = $gameActors.actor(this._targetActorId);
    //如果(不是 成员组() 包含(角色) )
    if (!this.members().contains(actor)) {
        //角色 = 成员组()[0]
        actor = this.members()[0];
    }
    //返回 角色
    return actor;
};
/**设置目标角色*/
Game_Party.prototype.setTargetActor = function(actor) {
    //目标角色id = 角色 角色id
    this._targetActorId = actor.actorId();
};
/**最后项目*/
Game_Party.prototype.lastItem = function() {
    //返回 最后项目 对象()
    return this._lastItem.object();
};
/**设置最后项目*/
Game_Party.prototype.setLastItem = function(item) {
    //最后项目 设置对象(项目)
    this._lastItem.setObject(item);
};
/**交换命令*/
Game_Party.prototype.swapOrder = function(index1, index2) {
    //临时 = 角色组[索引]
    var temp = this._actors[index1];
    //角色组[索引1] = 角色组[索引2]
    this._actors[index1] = this._actors[index2];
    //角色组[索引2] = 临时
    this._actors[index2] = temp;
    //游戏游戏者 刷新()
    $gamePlayer.refresh();
};
/**行走图为了保存文件*/
Game_Party.prototype.charactersForSavefile = function() {
    //返回 战斗成员组() 映射 方法(角色)
    return this.battleMembers().map(function(actor) {
        //返回 [角色 行走图名称() , 角色 行走图索引() ]
        return [actor.characterName(), actor.characterIndex()];
    });
};
/**脸图为了保存文件*/
Game_Party.prototype.facesForSavefile = function() {
    //返回 战斗成员组() 映射 方法(角色)
    return this.battleMembers().map(function(actor) {
        //返回 [角色 脸图名称() , 角色 脸图索引() ]
        return [actor.faceName(), actor.faceIndex()];
    });
};
/**队伍能力*/
Game_Party.prototype.partyAbility = function(abilityId) {
    //返回 战斗成员组() 一些 方法(角色)
    return this.battleMembers().some(function(actor) {
        //返回 角色 队伍能力(能力id)
        return actor.partyAbility(abilityId);
    });
};
/**有遭遇减半*/
Game_Party.prototype.hasEncounterHalf = function() {
    //返回 队伍能力( 游戏队伍 能力遭遇减半 //0 )
    return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);
};
/**有无遭遇*/
Game_Party.prototype.hasEncounterNone = function() {
    //返回 队伍能力( 游戏队伍 能力遭遇无效 //1 )
    return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);
};
/**有取消突袭*/
Game_Party.prototype.hasCancelSurprise = function() {
    //返回 队伍能力( 游戏队伍 能力突然袭击 //2 )
    return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);
};
/**有提升先发制人*/
Game_Party.prototype.hasRaisePreemptive = function() {
    //返回 队伍能力( 游戏队伍 能力先发制人 //3 )
    return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);
};
/**有金钱双倍*/
Game_Party.prototype.hasGoldDouble = function() {
    //返回 队伍能力( 游戏队伍 能力金钱双倍 //4 )
    return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);
};
/**有掉落物品双倍*/
Game_Party.prototype.hasDropItemDouble = function() {
    //返回 队伍能力( 游戏队伍 能力物品掉落双倍 //5 )
    return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);
};
/**先发制人比例*/
Game_Party.prototype.ratePreemptive = function(troopAgi) {
    //比例 =   敏捷() >= 敌群敏捷 ? 0.05 : 0.03
    var rate = this.agility() >= troopAgi ? 0.05 : 0.03;
    //如果( 有提升先发制人() )
    if (this.hasRaisePreemptive()) {
        //比例 *= 4 
        rate *= 4;
    }
    //返回 比例
    return rate;
};
/**突袭几率*/
Game_Party.prototype.rateSurprise = function(troopAgi) {
    //比例 =   敏捷() >= 敌群敏捷 ? 0.03 : 0.05
    var rate = this.agility() >= troopAgi ? 0.03 : 0.05;
    //如果( 有取消突袭() )
    if (this.hasCancelSurprise()) {
        //比例 = 0
        rate = 0;
    }
    //返回 比例
    return rate;
};
/**表现胜利*/
Game_Party.prototype.performVictory = function() {
    //成员组() 对每一个 方法(角色)
    this.members().forEach(function(actor) {
        //角色 表现胜利()
        actor.performVictory();
    });
};
/**表现逃跑*/
Game_Party.prototype.performEscape = function() {
    //成员组() 对每一个 方法(角色)
    this.members().forEach(function(actor) {
        //角色 表现逃跑()
        actor.performEscape();
    });
};
/**移除战斗状态*/
Game_Party.prototype.removeBattleStates = function() {
    //成员组() 对每一个 方法(角色)
    this.members().forEach(function(actor) {
        //角色 移除战斗状态()
        actor.removeBattleStates();
    });
};
/**请求动作刷新*/
Game_Party.prototype.requestMotionRefresh = function() {
    //成员组() 对每一个 方法(角色)
    this.members().forEach(function(actor) {
        //角色 请求动作刷新()
        actor.requestMotionRefresh();
    });
};
