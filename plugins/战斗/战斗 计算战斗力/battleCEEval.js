//=============================================================================
// battleCEEval.js
//=============================================================================

/*:
 * @plugindesc 战斗战斗力计算
 * @author wangwang
 *   
 * @param battleCEEval
 * @desc 插件 战斗战斗力计算
 * @default 汪汪
 *
 * 
 * 
 * 
 * @help
 * 
 * 
 * @param partyEval 
 * @desc 对于我方队伍的整体计算 p 为我方队伍 ms 为战斗成员的数组 items 为物品的数组 
 * @default  ""
 * 
 * 
 * @param itemEval 
 * @desc 对于物品的基础设置,如果没有单独计算,物品根据这个计算item 为本物品 , df 为技能公式的测试值
 * @default  ""
 * 
 * 
 * @param itemHashEval 
 * @desc 对于物品的单独设置,设置的物品根据这个计算,item 为本物品 df 为技能公式的测试值  如 {"2":"item.id"}
 * @default  {}
 * 
 * 
 * 
 * @param actorEval 
 * @desc  对于角色的基础设置,如果没有单独计算,角色根据这个计算 , m 为当前角色
 * @default  "100 + m._level"
 *  
 * 
 * @param actorHashEval 
 * @desc 对于角色的单独设置,设置的角色根据这个计算, m 为当前角色 如 {"2":"m.hp + m.mp"}
 * @default  {}
 * 
 * 
 * @param troopEval 
 * @desc 对于敌方队伍的整体计算 p 为敌方队伍 ms 为战斗成员的数组 
 * @default  ""
 * 
 * 
 * @param enemyEval 
 * @desc  对于敌人的基础设置,如果没有单独计算,敌人根据这个计算 , m 为当前角色 
 * @default  ""
 *  
 * 
 * @param enemyHashEval 
 * @desc 对于敌人的单独设置,设置的敌人根据这个计算, m 为当前角色 如 {"2":"m.hp + m.mp"}
 * @default  {}
 * 
 * 
 * @param skillEval   
 * @desc  对于技能的基础设置,如果没有单独计算,技能根据这个计算 , m 为当前角色 s为技能,df 为技能公式的测试值
 * @default  "df"
 * 
 * 
 * @param skillHashEval 
 * @desc 对于技能的单独设置,设置的技能根据这个计算, m 为当前角色 s为技能,df 为技能公式的测试值, 如 {"2":"m.hp + m.mp"}
 * @default  {}
 *  
 *  
 * @param enemyId 
 * @desc 技能公式计算时用于作为对手的敌人的id
 * @default  1
 * 
 */




var ww = ww || {}
ww.PluginManager = {}
ww.PluginManager.get = function (n) {
    var find = function (n) {
        var l = PluginManager._parameters;
        var p = l[(n || "").toLowerCase()];
        if (!p) { for (var m in l) { if (l[m] && (n in l[m])) { p = l[m]; } } }
        return p || {}
    }
    var parse = function (i) {
        try { return JSON.parse(i) } catch (e) { return i }
    }
    var m, o = {}, p = find(n)
    for (m in p) { o[m] = parse(p[m]) }
    return o
}





var ww = ww || {}

ww.battleCEEval = ww.PluginManager.get('battleCEEval')



ww.battleCEEval.eval = function (troopId, newEnemyId) {

    this.newEnemyId = newEnemyId
    var pce = this.evalPartyCE(newEnemyId)
    var tce = this.evalTroopCE(troopId, newEnemyId)

    return [pce, tce]
}

ww.battleCEEval.evalPartyCE = function (newEnemyId) {
    var value = 0


    this.newEnemyId = newEnemyId
 
    value += this.evalParty()

    value += this.evalItems()

    value += this.evalActors()

    value += this.evalActorsSkills()

    //console.log(value)
    return value

}


ww.battleCEEval.evalTroopCE = function (troopId, newEnemyId) {
    var value = 0
 
    if ($dataTroops[troopId]) {
        var troop = new Game_Troop()
        troop.setup(troopId)

        this.newEnemyId = newEnemyId

        value += this.evalTroop(troop)

        value += this.evalEnemys(troop)

        value += this.evalEnemysSkills(troop)
        troop.clear(troopId)
    }
    //console.log(value)
    return value

}

/**仅计算队伍 */
ww.battleCEEval.evalParty = function () {
    var value = 0

    var p = $gameParty
    var ms = $gameParty.battleMembers()
    var items = $gameParty.items()

    var partyEval = ww.battleCEEval.partyEval

    try {
        value = eval(partyEval)
    } catch (error) {
        value = 0
    }
    value *= 1
    if (!value || isNaN(value)) { value = 0 }
    //console.log(value)
    return value
}




/**计算角色们的值 */
ww.battleCEEval.evalActors = function () {
    var value = 0


    var p = $gameParty
    var m = $gameParty.battleMembers()

    for (var i = 0; i < m.length; i++) {
        var member = m[i]
        value += this.evalActor(member)
    }

    //console.log(value)
    return value
}




/**计算成员 */
ww.battleCEEval.evalActor = function (member) {
    var value = 0
    var member = member
    var a = member
    var m = member
    //console.log(m)

    if (member) {
        var actorEval = ww.battleCEEval.actorEval
        var actorHashEval = ww.battleCEEval.actorHashEval

        actorEval = (actorHashEval && actorHashEval[member.id]) || actorEval
        //console.log(actorEval)
        try {
            value = eval(actorEval)
        } catch (error) {
            value = 0
        }
        value *= 1
        if (!value || isNaN(value)) { value = 0 }
    }

    //console.log(value)
    return value
}






/**计算角色们的技能值 */
ww.battleCEEval.evalActorsSkills = function () {
    var value = 0

    var p = $gameParty

    var ms = $gameParty.battleMembers()

    for (var i = 0; i < ms.length; i++) {
        var member = ms[i]
        value += this.evalActorSkills(member)
    }
    //console.log(value)
    return value
}





/**计算角色技能组值 */
ww.battleCEEval.evalActorSkills = function (member) {
    var value = 0
    var member = member
    if (member) {
        var skills = member.skills().concat(
            [$dataSkills[member.attackSkillId()], $dataSkills[member.guardSkillId()]]
        )
        for (var i = 0; i < skills.length; i++) {
            var s = skills[i]
            value += this.evalSkill(member, s)
        }
    }
    //console.log(value)
    return value
}







/**计算全部物品 */
ww.battleCEEval.evalItems = function () {
    var value = 0

    var items = $gameParty.items()
    for (var i = 0; i < items.length; i++) {
        var item = items[i]
        value += this.evalItem(item)
    }
    return value
}



/**计算物品 */
ww.battleCEEval.evalItem = function (item) {
    var value = 0
    var item = item
    var i = item
    var s = i

    var a = this.getBaseEnemy()
    var b = this.getBaseEnemy()
    if (item) {

        var itemEval = ww.battleCEEval.itemEval
        var itemHashEval = ww.battleCEEval.itemHashEval
        var id = item.id
        itemEval = (itemHashEval && itemHashEval[id]) || itemEval


        var df = 0
        try {
            df = eval(s.damage.formula)
        } catch (error) {
            df = 0
        }
        df *= 1
        if (!df || isNaN(df)) { df = 0 };


        try {
            var value = eval(itemEval)
        } catch (error) {
            var value = 0
        }
        value *= 1
        if (!value || isNaN(value)) { value = 0 }
    }
    return value

}







ww.battleCEEval.evalTroop = function (troop) {
    var value = 0

    var p = troop || $gameTroop
    var ms = p.battleMembers()

    var troopEval = ww.battleCEEval.troopEval

    try {
        value = eval(troopEval)
    } catch (error) {
        value = 0
    }
    value *= 1
    if (!value || isNaN(value)) { value = 0 }
    return value
}





ww.battleCEEval.evalEnemys = function (troop) {
    var value = 0

    var p = troop || $gameTroop
    var ms = p.battleMembers()


    for (var i = 0; i < ms.length; i++) {
        var member = ms[i]
        value += this.evalEnemy(member)
    }

    return value
}




/**计算成员 */
ww.battleCEEval.evalEnemy = function (member) {
    var value = 0
    var member = member
    var a = member
    var m = member

    if (member) {
        var enemyEval = ww.battleCEEval.enemyEval
        var enemyHashEval = ww.battleCEEval.enemyHashEval

        enemyEval = (enemyHashEval && enemyHashEval[member.id]) || enemyEval

        try {
            value = eval(enemyEval)
        } catch (error) {
            value = 0
        }
        value *= 1
        if (!value || isNaN(value)) { value = 0 }
    }

    return value
}




ww.battleCEEval.evalEnemysSkills = function (troop) {
    var value = 0

    var p = troop || $gameTroop
    var ms = p.battleMembers()


    for (var i = 0; i < ms.length; i++) {
        var member = ms[i]
        value += this.evalEnemySkills(member)
    }
    return value
}


ww.battleCEEval.evalEnemySkills = function (member) {
    var value = 0
    var member = member
    var a = member
    var m = a

    var b = this.getBaseEnemy()

    if (member) {
        var skills = member.skills()
        for (var i = 0; i < skills.length; i++) {
            var s = skills[i]
            value += this.evalSkill(member, s)
        }
    }
    return value
}

ww.battleCEEval.getBaseEnemy = function () {

    var id = ww.battleCEEval.newEnemyId

    this.enemy = this.enemy || new Game_Enemy(ww.battleCEEval.enemyId, 0, 0)
    if ($dataEnemies[id]) {
        this.enemy.setup(id, 0, 0)
    } else {
        this.enemy.setup(ww.battleCEEval.enemyId, 0, 0)
    }


    return this.enemy
}



/**计算技能 */
ww.battleCEEval.evalSkill = function (member, skill) {
    var value = 0
    var member = member
    var a = member
    var m = a
    var skill = skill
    var s = skill

    var b = this.getBaseEnemy()



    if (a && s) {
        var skillEval = ww.battleCEEval.skillEval
        var skillHashEval = ww.battleCEEval.skillHashEval
        skillEval = (skillHashEval && skillHashEval[s.id]) || skillEval

        var df = 0
        try {
            df = eval(s.damage.formula)
        } catch (error) {
            df = 0
        }
        df *= 1
        if (!df || isNaN(df)) { df = 0 };


        try {
            value = eval(skillEval)
        } catch (error) {
            value = 0
        }
        //console.log(value)
        value *= 1
        if (!value || isNaN(value)) { value = 0 }
    }
    return value

}



Game_Enemy.prototype.skills = function () {
    var skills = this.enemy().actions.map(function (a) {
        //返回 是有效动作(动作)
        return $dataSkills[a.skillId];
        //this )
    }, this);
    return skills
};



Game_Troop.prototype.battleMembers = function () {
    //返回 敌人组
    return this.members();
};