//=============================================================================
// enemyPlusActor.js
//=============================================================================

/*:
 * @plugindesc 敌人添加角色属性
 * @author wangwang
 *   
 * @param enemyPlusActor
 * @desc 插件 敌人添加角色属性
 * @default 汪汪
 *  
 * 
 * @help 
 * 敌人添加角色属性
 * 在敌人注释中添加
 * <actorid:1>
 * 将角色1的特性,职业,等级,装备添加给敌人
 * 
 * 
 * 
 * actor/enemy 
 *  
 * actor.forceChangeEquipItem(slotId, item, type)
 * 
 * 强制替换装备不考虑其他情况
 *  slotId 装备孔id  number
 * 
 *  item 物品  
 *  $dataWeapons[id]  
 *  $dataArmors[id]  
 * 
 *  type 是否强制 ,默认强制
 *  true 不强制  
 *  false 强制  
 *  如果强制,如果没有装备孔会强制添加装备孔,
 *  但因此可能会有未知风险,不要把这些角色或敌人显示到相关界面为好
 * 
 * 
 * $gameTroop.gainExp(exp,max)
 * 敌群敌人的对应角色添加经验值(同一角色id不重复添加)
 * 
 * 当有max时,为exp-max的随机数
 * 否则为增加exp
 * 
 * */



var ww = ww || {}
ww.enemyPlusActor = {}

ww.enemyPlusActor.setup = Game_Enemy.prototype.setup



/**队伍全部经验*/
Game_Party.prototype.allExp = function () {
    //返回 数学 最大值 应用(null , 成员组() 映射 方法(角色)
    return this.members().reduce(function (r, actor) {
        //返回 角色 等级
        return r + actor ? actor.currentExp() : 0;
    }, 0);
};

/**
 * 强制替换装备不考虑其他情况
 * @param {number} slotId 装备孔id
 * @param {$dataWeapons[id]|$dataArmors[id]} item 物品  
 *  $dataWeapons[id]  
 *  $dataArmors[id]  
 * @param {boolean} type 是否强制 ,默认强制
 *  true 不强制  
 *  false 强制  
 */
Game_Actor.prototype.forceChangeEquipItem = function (slotId, item, type) {
    if (!type) {

        for (var i = 0; i <= slotId; i++) {
            //装备组[i] = 新 游戏项目
            if (!this._equips[i]) {
                this._equips[i] = new Game_Item();
            }
        }
    }
    if (this._equips[slotId]) {
        this._equips[slotId].setObject(item);
    }
    Game_Battler.prototype.refresh.call(this);
};

/** 
 * 
 * @param {number} slotId 装备孔id
 * @param {$dataWeapons[id]|$dataArmors[id]} item 物品  
 *  $dataWeapons[id]  
 *  $dataArmors[id]  
 * @param {boolean} type 是否强制 ,默认强制
 *  true 不强制  
 *  false 强制  
*/
Game_Enemy.prototype.forceChangeEquipItem = function (slotId, item, type) {
    if (!type) {
        if (!this._equips) {
            this._equips = []
        }
        for (var i = 0; i <= slotId; i++) {
            //装备组[i] = 新 游戏项目
            if (!this._equips[i]) {
                this._equips[i] = new Game_Item();
            }
        }
    }
    if (this._equips && this._equips[slotId]) {
        this._equips[slotId].setObject(item);
    }
    Game_Battler.prototype.refresh.call(this);
};

Game_Troop.prototype.gainExpAuto = function () {
    //最高等级
    var pml = $gameParty.highestLevel()

    //队伍的全部经验
    var pae = $gameParty.allExp()

    var exp = 150 * pml

    this.gainExp(exp)


}




Game_Troop.prototype.gainExp = function (exp, max) {
    var actorList = []
    if (!max) {
        var max = exp
    }
    this.members().forEach(function (enemy) {
        if (enemy && enemy._actorId && 
            (actorList.indexOf(enemy._actorId) < 0)) {
            actorList.push(enemy._actorId)
        }
    }, this);
    for (var i = 0; i < actorList.length; i++) {
        var actorId = actorList[i]
        var actor = $gameActors.actor(actorId)
        if (actor) {
            var addExp = Math.floor((exp + Math.randomInt(max - exp)) * actor.exr);
            
            console.log(actor,addExp)

            var newExp = actor.currentExp() + addExp
            //改变经验值(新经验值 , 需要显示等级上升() )
            actor.changeExp(newExp, false);
        }
    }
}


Game_Enemy.prototype.setup = function (enemyId, x, y) {
    ww.enemyPlusActor.setup.call(this, enemyId, x, y)

    var enemy = $dataEnemies[enemyId]
    if (enemy && enemy.meta["actorid"]) {
        var actorId = enemy.meta["actorid"] * 1
        this.plusSetActor(actorId)
    }

    //完全恢复()
    this.recoverAll();
};




/**添加设置角色 */
Game_Enemy.prototype.plusSetActor = function (actorId) {
    var actor = $gameActors.actor(actorId)
    if (actor) {

        this.plusSetActorId(actor._actorId)
        this.plusSetClassId(actor._classId)
        this.plusSetLevel(actor._level)
        this.plusSetSkills(actor._skills)
        this.plusSetEquips(actor._equips)

    } else {
        this._plusActor = false
        this.plusSetActorId(0)
        this.plusSetClassId(0)
        this.plusSetLevel(0)
        this.plusSetSkills(0)
        this.plusSetEquips(0)
    }
}

/**设置添加种类
 * @param {0|1|2} type 种类  
 *  0 叠加  
 *  1 只敌人  
 *  2 只角色
 */
Game_Enemy.prototype.plusSetPlusType = function (type) {
    this._plusType = type || 0
}

/**
 * 设置角色id
 * 
 */
Game_Enemy.prototype.plusSetActorId = function (actorId) {
    this._actorId = actorId || 0
}

/**
 * 设置职业id
 */
Game_Enemy.prototype.plusSetClassId = function (classId) {
    this._classId = classId || 0// 0; 
}
/**设置等级 */
Game_Enemy.prototype.plusSetLevel = function (level) {
    this._level = level || 0 //  0; 
}
/**设置技能组
 * 
 * @param {[number]} skills 技能组
 */
Game_Enemy.prototype.plusSetSkills = function (skills) {
    if (skills) {
        this._skills = JsonEx.makeDeepCopy(skills)
    } else {
        this._skills = 0
    }
}


/**设置装备组
 * @param {[Game_Item]} equips 装备组
 * 
 * 
 */
Game_Enemy.prototype.plusSetEquips = function (equips) {
    if (equips) {
        this._equips = JsonEx.makeDeepCopy(equips)
    } else {
        this._equips = 0
    }
}



/**角色 */
Game_Enemy.prototype.actor = function () {
    return $dataActors[this._actorId];
}
/**当前职业 */
Game_Enemy.prototype.currentClass = function () {
    return $dataClasses[this._classId];
}

/**技能组(无用) */
Game_Enemy.prototype.skills = function () {
    //列表 = []
    if (this._skills) {
        var list = [];
        //技能组 连接(添加技能组() ) 对每一个 方法(id)
        this._skills.concat(this.addedSkills()).forEach(function (id) {
            //如果 (不是 列表 包含(数据技能组[id]) )
            if (!list.contains($dataSkills[id])) {
                //列表 添加(数据技能组[id])
                list.push($dataSkills[id]);
            }
        });
        //返回 列表
        return list;
    } else {
        return null
    }
};


/**是学习了的技能 */
Game_Enemy.prototype.isLearnedSkill = function (skillId) {
    if (this._skills) {
        return this._skills.concat(this.addedSkills()).contains(skillId);
    } else {
        return true
    }
};

/**是动作允许 */
Game_Enemy.prototype.isActionValid = function (action) {
    return this.isLearnedSkill(action.skillId) &&
        this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]);
};

/**装备对象 */
Game_Enemy.prototype.equips = function () {
    if (this._equips) {
        return this._equips.map(function (item) {
            //返回 项目 对象
            return item.object();
        });
    } else {
        return []
    }
};



/**特征对象组*/
Game_Enemy.prototype.traitObjects = function () {

    var objects = Game_Battler.prototype.traitObjects.call(this);

    if (!this._plusType || this._plusType == 1) {
        objects.push(this.enemy())
    }

    if (!this._plusType || this._plusType == 2) {

        if (this.actor()) {
            objects.push(this.actor());
        }

        if (this.currentClass()) {
            objects.push(this.currentClass());
        }

        //装备组 = 装备组()
        var equips = this.equips();
        if (equips) {
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

        }
    }

    return objects
};



Game_Enemy.prototype.paramBase = function (paramId) {

    var paramBase = 0

    if (!this._plusType || this._plusType == 1) {
        paramBase += this.enemy().params[paramId];
    }
    if (!this._plusType || this._plusType == 2) {
        if (this.currentClass()) {
            paramBase += this.currentClass().params[paramId][this._level];
        }
    }
    return paramBase
}