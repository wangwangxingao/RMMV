//=============================================================================
// jinglingget.js
//=============================================================================
/*:
 * @plugindesc 精灵
 * @author wangwang
 *
 * @param  jinglingget 
 * @desc 确定是精灵捕捉的参数,请勿修改
 * @default 汪汪 
 *
 * 
 * 
 * @param  actorStartId 
 * @desc 新建角色开始的id
 * @default 4 
 * 
 * @param  saveid 
 * @desc 物品数据保存的变量id
 * @default 100
 * 
 * 
 * @param  ItemStartId 
 * @desc 新建物品开始的id
 * @default 10
 * 
 * 
 * @param  buzuoState 
 * @desc 确定是捕捉的状态
 * @default 10 
 * 
 * 
 * 
 * @param  pictures 
 * @desc 精灵图片的位置
 * @default jl
 * 
 * 
 * 
 * @param  nameLength 
 * @desc 精灵重命名的长度
 * @default 8
 * 
 * 
 * 
 * 
 * @param  partySize 
 * @desc 队伍最多精灵数
 * @default 6
 * 
 * 
 * @param  addCommands 
 * @desc 第一个为选项名,第二个 数字为调用相应公共事件,字符串为相应操作,第三个 1 在队伍中才能用,2 不在队伍中才能用,0或者未设置时为都可用
 * @default [["查看", 'show'],["添加", 100],["重命名", 'namechange'],["入队", 'add'],["离队", 'remove',1],["取消", 'quxiao'],["释放", 'del']]
 *  
 *  
 * 
 * 
 * @help
 * 
 * 
 * ww.jingling.buzuo(5,1)  
 * 获取一个1号角色的精灵,使用基础为5号物品
 * 
 * 
 * ww.jingling.buzuoDiren(5)
 * 遍历敌群,捕捉第一个有  捕捉状态的敌人,使用的基础为 5 号物品
 * 
 * 
 * 当在菜单中选择精灵球后 会给下面赋值
 * 
 * ww.jingling.lsItem    物品对象
 * ww.jingling.lsItemId   物品id
 * ww.jingling.lsActor    角色对象
 * ww.jingling.lsActorId   角色id
 * ww.jingling.lsActorUseId   角色种类id
 * 
 * 
 * 当精灵球捕捉成功后  会给下面赋值
 * 
 * ww.jingling.bzItem   物品对象
 * ww.jingling.bzItemId  物品id
 * ww.jingling.bzActor   角色对象
 * ww.jingling.bzActorId   角色id
 * ww.jingling.bzActorUseId   角色种类id
 * 
 * 先判断有没有,然后再使用
 * 
 * 
 * 
 * 最后为  ByLs 的 临时选择的精灵的处理(菜单中选择的) 
 * 最后为  ByBz 的 最近捕捉的精灵的处理(捕捉的) 
 * 
 * ==============================
 * 当前有无临时/捕捉的精灵
 * ============================== 
 * ww.jingling.hasLs()  
 * ww.jingling.hasBz()  
 * 
 * ==============================
 * 显示精灵信息界面
 * ============================== 
 * ww.jingling.showJLByLs()  
 * ww.jingling.showJLByBz()  
 * 
 * ==============================
 * 释放精灵
 * ============================== 
 * ww.jingling.shifangByLs()  
 * ww.jingling.shifangByBz()  
 * 
 * ==============================
 * 精灵是否在队伍中
 * ============================== 
 * ww.jingling.isInGamePartyByLs()  
 * ww.jingling.isInGamePartyByBz()  
 * 
 *  
 * 
 * ==============================
 * 精灵入队
 * ============================== 
 * ww.jingling.addActorByLs()  
 * ww.jingling.addActorByBz()  
 * 
 *  
 * ==============================
 * 精灵离队
 * ============================== 
 * ww.jingling.removeActorByLs()  
 * ww.jingling.removeActorByBz()   
 * 
 * ==============================
 * 精灵改名
 * ============================== 
 * ww.jingling.changeNameByLs()  
 * ww.jingling.changeNameByBz()  
 * 
 * 
 * ==============================
 * 获取参数
 * ==============================
 * 
 * ww.jingling.getParamByLs( type )  
 * ww.jingling.getParamByBz( type )  
 * 
 * 
 * 获取捕捉的精灵原本的敌人的参数 
 * ww.jingling.getParamByBzEnemy( type )  
 * 以下为种类,使用时添加""  如 "level"
 * 获取临时精灵的等级
 * ww.jingling.getParamByLs( "level" )  
 * 
 * == 等级 ==
 *  level
 * ==  Hit Points hp生命值  == 
 *  hp 
 * ==  Magic Points mp魔法值  == 
 *  mp 
 * ==  Tactical Points tp战术值  == 
 *  tp 
 * ==  Maximum Hit Points   最大hp生命值  == 
 *  mhp 
 * ==  Maximum Magic Points  最大mp魔法值  == 
 *  mmp 
 * ==  ATtacK power  攻击力  == 
 *  atk 
 * ==  DEFense power  防御力  == 
 *  def 
 * ==  Magic ATtack power  魔法攻击力  == 
 *  mat 
 * ==  Magic DeFense power  魔法防御力  == 
 *  mdf 
 * ==  AGIlity  敏捷  == 
 *  agi 
 * ==  LUcK  运气  == 
 *  luk 
 * ==  HIT rate 命中比例  == 
 *  hit 
 * ==  EVAsion rate 闪避比例  == 
 *  eva 
 * ==  CRItical rate 会心比例  == 
 *  cri 
 * ==  Critical EVasion rate 会心回避比例  == 
 *  cev 
 * ==  Magic EVasion rate  魔法躲避比例  == 
 *  mev 
 * ==  Magic ReFlection rate 魔法反射比例  == 
 *  mrf 
 * ==  CouNTer attack rate 反击比例  == 
 *  cnt 
 * ==  Hp ReGeneration rate hp恢复比例  == 
 *  hrg 
 * ==  Mp ReGeneration rate  mp恢复比例  == 
 *  mrg 
 * ==  Tp ReGeneration rate  tp恢复比例  == 
 *  trg 
 * ==  TarGet Rate  目标比例  == 
 *  tgr 
 * ==  GuaRD effect rate 防守效果比例  == 
 *  grd 
 * ==  RECovery effect rate  恢复效果比例  == 
 *  rec 
 * ==  PHArmacology  药物知识  == 
 *  pha 
 * ==  Mp Cost Rate   mp消耗比例  == 
 *  mcr 
 * ==  Tp Charge Rate tp充能比例  == 
 *  tcr 
 * ==  Physical Damage Rate  物理伤害比例  == 
 *  pdr 
 * ==  Magical Damage Rate  魔法伤害比例  == 
 *  mdr 
 * ==  Floor Damage Rate    地面伤害比例  == 
 *  fdr 
 * ==  EXperience Rate  经验值比例  == 
 *  exr 
 * 
 * 
 * 
 * 
 * 
 * */





var ww = ww || {}



ww.plugin = ww.plugin || { find: function (n, l, p, m) { l = PluginManager._parameters; p = l[(n || "").toLowerCase()]; if (!p) { for (m in l) { if (l[m] && n in l[m]) { p = l[m] } } }; return p || {} }, parse: function (i) { try { return JSON.parse(i) } catch (e) { try { return eval(i) } catch (e2) { return i } } }, get: function (n, o, p) { o = o || {}; p = this.find(n); for (n in p) { o[n] = this.parse(p[n]) }; return o } };


ww.jingling = {}

/**角色基础id */
ww.jingling.actorStartId = 4


/**保存的变量id */
ww.jingling.saveid = 100
/**
 * 物品的基础值 
 * 新建的物品从该值计算
*/
ww.jingling.ItemStartId = 10


/**捕捉的状态 */
ww.jingling.buzuoState = 10
/**图片的位置(在pictures文件夹中的 jl 文件夹中,名字为角色id )
 */
ww.jingling.pictures = "jl"
/**起名最大值 */
ww.jingling.nameLength = 8
/**队伍最大值 */
ww.jingling.partySize = 6
ww.jingling.addCommands = [["查看", "show"], ["重命名", "namechange"], ["入队", "add"], ["离队", "remove", 1], ["取消", "quxiao"], ["释放", "del"]]

ww.plugin.get("jinglingget", ww.jingling)



/**显示的设置 */
ww.jingling.setList = [
    "name",
    "luk",
    "mhp",
    "mmp",
    "atk",
    "def",
    "mat",
    "mdf",
    "agi",
    "profile"
]

/**显示内容
 * 
 */
ww.jingling.showSet = {
    "name": "%1",
    "luk": "潜力:%1",
    "mhp": "生命:%1",
    "mmp": "魔力:%1",
    "atk": "物攻:%1",
    "def": "防御:%1",
    "mat": "魔攻:%1",
    "mdf": "魔防:%1",
    "agi": "敏捷:%1",
    "profile": "%1"
}

/**
 * ==========================
 * 创建新角色
 * ==========================
 * 
 */


Game_Actors.prototype.getNewId = function () {
    for (var i = ww.jingling.actorStartId; i < this._data.length; i++) {
        if (!this._data[i]) {
            break
        }
    }
    return i
}


/**角色*/
Game_Actors.prototype.actor = function (actorId, useActorId) {
    if (this._data[actorId]) {
        return this._data[actorId]
    }
    if (actorId < ww.jingling.actorStartId) {
        //如果(数据角色组[角色id])
        if ($dataActors[actorId]) {
            //如果(不是 数据[角色id] )
            if (!this._data[actorId]) {
                this._data[actorId] = new Game_Actor(actorId);
            }
            //返回 数据[角色id]
            return this._data[actorId];
        }
    } else if (useActorId && $dataActors[useActorId]) {
        if (!this._data[actorId]) {
            this._data[actorId] = new Game_Actor(actorId, useActorId);
        }
        return this._data[actorId];
    }
    //返回 null
    return null;
};




Game_Actors.prototype.delete = function (actorId) {
    if (this._data[actorId]) {
        delete this._data[actorId];
    }
};


Game_Actor.prototype.initialize = function (actorId, useActorId) {
    //游戏战斗者 初始化 呼叫(this)
    Game_Battler.prototype.initialize.call(this);
    if (!useActorId) {
        var useActorId = actorId
    }
    //真实使用的角色id
    this._useActorId = useActorId
    this.setup(useActorId);
    //目前使用的角色id 
    this._actorId = actorId
};



Game_Actor.prototype.useActorId = function () {
    return this._useActorId
};



Game_Actor.prototype.actorId = function () {
    return this._actorId;
};


Game_Actor.prototype.actor = function () {
    //返回 数据角色组 [角色id]
    return $dataActors[this._useActorId];
};




/**
 * ==========================
 * 创建新物品
 * ==========================
 * 
 */

ww.jingling.extractSaveContents = DataManager.extractSaveContents
DataManager.extractSaveContents = function (contents) {
    ww.jingling.extractSaveContents.call(this, contents)
    ww.jingling.loadsave()
}


ww.jingling.getsave = function (type) {
    var v = $gameVariables._data
    if (!v[this.saveid] || typeof v[this.saveid] != "object") {
        v[this.saveid] = {}
    }
    var hash = v[this.saveid]
    if (!hash[type]) {
        hash[type] = []
    }
    return hash[type]
};

ww.jingling.loadsave = function () {
    var v = $gameVariables._data
    if (!v[this.saveid] || typeof v[this.saveid] != "object") {
        v[this.saveid] = {}
    }
    var hash = v[this.saveid]
    for (var type in hash) {
        if (Array.isArray(hash[type])) {
            this.initCreate(hash[type], type)
        }
    }
};

ww.jingling.setsave = function (i, set, type) {
    var l = this.getsave(type)
    l[i] = set
}

ww.jingling.deepCopy = function (that) {
    var that = that
    var obj, i;
    if (!that) {
        obj = that
    } else if (typeof (that) == "object") {
        if (Array.isArray(that)) {
            obj = [];
            for (var i = 0; i < that.length; i++) {
                obj.push(this.deepCopy(that[i]));
            }
        } else {
            obj = {}
            for (i in that) {
                obj[i] = this.deepCopy(that[i])
            }
        }
    } else {
        obj = that
    }
    return obj;
};



ww.jingling.makeItem = function (id, set) {
    if (Array.isArray(set)) {
        var baseId = set[0]
        var addId = set[1]
        if ($dataItems[baseId] && addId) {
            var obj = this.deepCopy($dataItems[baseId])
            obj.id = id
            obj.baseId = baseId
            obj.addId = addId
            return obj
        } else {
            return null
        }
    } else {
        return null
    }
}



ww.jingling.itemContainer = function (type) {
    if (type == "item") {
        return $dataItems
    } else {
        return null
    }
}



ww.jingling.itemMake = function (type) {
    if (type == "item") {
        return "makeItem"
    } else {
        return null
    }
}
ww.jingling.getItemStartId = function (type) {
    if (type == "item") {
        return this.ItemStartId
    } else {
        return 0
    }
}



ww.jingling.initCreate = function (sets, type) {
    var container = this.itemContainer(type)
    if (!container) {
        return
    }
    var make = this.itemMake(type)
    if (!make) {
        return
    }
    var baseid = this.getItemStartId(type)
    if (!baseid) {
        return
    }

    for (var i = 0, id = baseid; i < sets.length; i++ , id++) {
        container[id] = this[make](id, sets[i]);
    }
    container.length = id + 1
}



/**添加项目 */
ww.jingling.add = function (set, type) {
    var container = this.itemContainer(type)
    if (!container) {
        return
    }
    var make = this.itemMake(type)
    if (!make) {
        return
    }
    var baseid = this.getItemStartId(type)
    if (!baseid) {
        return
    }
    for (var id = baseid, i = 0; id < container.length; id++ , i++) {
        if (!container[id]) {
            break
        }
    }
    //设置对象
    container[id] = this[make](id, set);

    this.setsave(i, set, type);

    return id
}


ww.jingling.remove = function (id, type) {
    var container = this.itemContainer(type)
    if (!container) {
        return
    }

    var baseid = this.getItemStartId(type)
    if (!baseid) {
        return
    }
    var i = id - baseid
    //设置对象
    container[id] = null;
    this.setsave(i, null, type);
    return id
}

ww.jingling.addItem = function (set) {
    return this.add(set, "item")
}

ww.jingling.removeItem = function (id) {
    return this.remove(id, "item")
}









/**
 * ==========================
 * 捕捉
 * ==========================
 * 
 */



ww.jingling.buzuoDiren = function (useid) {
    ww.jingling.bzEnemy = null
    ww.jingling.bzItem = null
    ww.jingling.bzItemId = null
    ww.jingling.bzActor = null
    ww.jingling.bzActorId = null
    ww.jingling.bzActorUseId = null
    if ($gameTroop) {
        var m = $gameTroop.members()
        if (m && m.length) {
            for (var i = 0; i < m.length; i++) {
                var e = m[i]
                if (e && e.isStateAffected(ww.jingling.buzuoState)) {
                    ww.jingling.bzEnemy = e
                    var actorid = e._enemyId
                    e.escape()
                    return ww.jingling.buzuo(useid, actorid)
                }
            }
        }
    }
}


/**捕捉一个精灵 */
ww.jingling.buzuo = function (useid, actorid) {
    ww.jingling.bzItem = null
    ww.jingling.bzItemId = null
    ww.jingling.bzActor = null
    ww.jingling.bzActorId = null
    ww.jingling.bzActorUseId = null
    if (useid && actorid) {
        var newid = $gameActors.getNewId()
        var actor = $gameActors.actor(newid, actorid)
        if (actor) {
            var itemId = ww.jingling.addItem([useid, newid])
            actor._jlqid = itemId
            var item = $dataItems[itemId]
            $gameParty.gainItem(item, 1)

            ww.jingling.bzItem = item
            ww.jingling.bzItemId = itemId
            ww.jingling.bzActor = actor
            ww.jingling.bzActorId = newid
            ww.jingling.bzActorUseId = actorid
            return actor
        }
    }
}

/**获取角色通过物品 */
ww.jingling.getActorIdByItem = function (item) {
    if (item) {
        return item.addId
    }
}

/**获取角色通过物品 */
ww.jingling.getActorByItem = function (item) {
    var actorId = this.getActorIdByItem(item)
    if (actorId) {
        return $gameActors.actor(actorId)
    }
}

/**获取角色id通过物品id */
ww.jingling.getActorIdByItemId = function (itemid) {
    var item = $dataItems[itemid]
    return this.getActorIdByItem(item)
}

/**获取角色通过物品id */
ww.jingling.getActorByItemId = function (itemid) {
    var item = $dataItems[itemid]
    return this.getActorByItem(item)
}


/**获取角色对应的物品id */
ww.jingling.getItemIdByActor = function (actor) {
    if (actor) {
        return actor._jlqid
    }
}
/**获取角色对应的物品 */
ww.jingling.getItemByActor = function (actor) {
    var id = this.getItemIdByActor(actor)
    return $dataItems[id]
}


/**获取角色对应的物品的基础id */
ww.jingling.getItemBaseIdByActor = function (actor) {
    var item = this.getItemByActor(actor)
    return this.getItemBaseIdByItem(item)

}
/**获取角色对应的物品的基础id */
ww.jingling.getItemBaseIdByItem = function (item) {
    if (item) {
        return item.baseId
    }
}


/**获取角色对应的物品id */
ww.jingling.getItemIdByActorId = function (actorId) {
    var actor = $gameActors.actor(actorId)
    return this.getItemIdByActor(actor)
}
/**获取角色对应的物品 */
ww.jingling.getItemByActorId = function (actorId) {
    var actor = $gameActors.actor(actorId)
    return this.getItemByActor(actor)
}


/**获取角色对应的物品的基础id */
ww.jingling.getItemBaseIdByActorId = function (actorId) {
    var actor = $gameActors.actor(actorId)
    return this.getItemBaseIdByActor(actor)
}

/**
 * =======================
 * 获取角色参数
 * 
 * =======================
 * 
 */

ww.jingling.getParamByBzEnemy = function (type) {
    return this.getParamByActor(this.bzEnemy, type)
}

ww.jingling.getParamByLs = function (type) {
    this.getParamByActorId(this.lsActor, type)
}
ww.jingling.getParamByBz = function (type) {
    this.getParamByActorId(this.bzActor, type)
}

ww.jingling.getParamByActor = function (actor, type) {
    if (actor) {
        if (typeof actor[type] == "function") {
            return actor[type]()
        } else {
            return actor[type]
        }
    }
}


ww.jingling.getParamByActorId = function (actorId, type) {
    if (actorId && $gameActors._data[actorId]) {
        return this.getParamByActor($gameActors.actor(actorId), type)
    }
}

ww.jingling.getParamByItem = function (item, type) {
    if (item) {
        if (item.addId) {
            this.getParamByActorId(item.addId, type)
        }
    }
}


ww.jingling.getParamByItemId = function (itemid, type) {
    if (itemid) {
        var item = $dataItems[itemid]
        this.getParamByItem(item, type)
    }
}




/**有临时的精灵 */
ww.jingling.hasLs = function () {
    return !!this.lsActor
}

/**有捕捉的精灵 */
ww.jingling.hasBz = function () {
    return !!this.bzActor
}



/**
 * ===============================
 * 查看精灵
 * ===============================
 * 
 */
ww.jingling.showJLByLs = function () {
    this.showJLByActorId(this.lsActorId)
}

ww.jingling.showJLByBz = function () {
    this.showJLByActorId(this.bzActorId)
}




/**查看精灵 通过 角色 */
ww.jingling.showJLByActor = function (actor) {
    if (actor) {
        var id = actor.actorId()
        this.showJLByActorId(id)
    }
}
/**查看精灵 通过 角色id */
ww.jingling.showJLByActorId = function (actorId) {
    if (actorId) {
        SceneManager.push(Scene_JinglingStatus);
        SceneManager.prepareNextScene(actorId);
    }
}

/**查看精灵 通过 物品 */
ww.jingling.showJLByItem = function (item) {
    if (item) {
        var id = item.addId
        this.showJLByActorId(id)
    }
}

/**查看精灵 通过 物品id*/
ww.jingling.showJLByItemId = function (itemid) {
    if (itemid) {
        var item = $dataItems[itemid]
        this.showJLByItem(item)
    }
}





/**
 * ===============================
 * 释放精灵
 * ===============================
 * 
 */


/**释放临时 */
ww.jingling.shifangByLs = function () {
    this.shifangByItem(this.lsItem)
}

/**释放捕捉 */
ww.jingling.shifangByBz = function () {
    this.shifangByItem(this.bzItem)
}


/**释放精灵球通过物品 */
ww.jingling.shifangByItem = function (item) {
    if (item) {
        if (item.addId) {
            $gameParty.gainItem(item, -1)
            $gameParty.removeActor(item.addId)
            $gameActors.delete(item.addId)
            ww.jingling.removeItem(item.id)
        }
    }
}



/**释放通过物品id */
ww.jingling.shifangByItemId = function (itemid) {
    if (itemid) {
        var item = $dataItems[itemid]
        this.shifangByItem(item)
    }
}


/**释放 通过角色id */
ww.jingling.shifangByActorId = function (actorId) {
    var actor = $gameActors.actor(actorId)
    this.shifangByActor(actor)
}


/**释放通过角色 */
ww.jingling.shifangByActor = function (actor) {
    if (actor) {
        var jlqid = actor._jlqid
        if (jlqid) {
            this.shifangByItemId(jlqid)
        }
    }
}

/**
 * =============================
 * 精灵是否在队伍中
 * ============================= 
 */


/**临时角色在其中 */
ww.jingling.isInGamePartyByLs = function () {
    return this.isInGamePartyByActorId(this.lsActorId)
}
ww.jingling.isInGamePartyByBz = function () {
    return this.isInGamePartyByActorId(this.bzActorId)
}


/**角色在其中 */

ww.jingling.isInGamePartyByActorId = function (actorId) {
    return $gameParty && $gameParty._actors.contains(actorId)
}

ww.jingling.isInGamePartyByActor = function (actor) {
    if (actor) {
        return this.isInGamePartyByActorId(actor.actorId())
    }
    return false
}



ww.jingling.isInGamePartyByItem = function (item) {
    if (item) {
        if (item.addId) {
            return this.isInGamePartyByActorId(item.addId)
        }
    }
    return false
}

ww.jingling.isInGamePartyByItemId = function (itemid) {
    if (itemid) {
        var item = $dataItems[itemid]
        this.isInGamePartyByItem(item)
    }
    return false
}


/**
 * ================================
 * 
 * 
 * 精灵入队 
 * 
 * ================================
 * 
 * */


/**临时精灵入队 */
ww.jingling.addActorByLs = function (type) {
    this.addActorByActorId(this.lsActorId, type)
}
/**捕捉入队 */
ww.jingling.addActorByBz = function (type) {
    this.addActorByActorId(this.bzActorId, type)
}

ww.jingling.addActorByActor = function (actor, type) {
    if (actor) {
        return this.addActorByActorId(actor.actorId(), type)
    }
}


ww.jingling.addActorByActorId = function (actorId, type) {
    if (actorId && $gameActors._data[actorId]) {
        if (type) {
            $gameParty.addActor(actorId)
        } else {
            $gameParty.addActorOnTop(actorId)
        }
    }
}

/**精灵入队 */
ww.jingling.addActorByItem = function (item, type) {
    if (item) {
        if (item.addId) {
            this.addActorByActorId(item.addId, type)
        }
    }
}


/**精灵入队 */

ww.jingling.addActorByItemId = function (itemid, type) {
    if (itemid) {
        var item = $dataItems[itemid]
        this.addActorByItem(item, type)
    }
}

/**
 * ================================
 * 
 * 
 * 精灵离队
 * 
 * ================================
 * 
 * */


ww.jingling.removeActorByLs = function () {
    this.removeActorByActorId(this.lsActorId)
}

ww.jingling.removeActorByBz = function () {
    this.removeActorByActorId(this.bzActorId)
}

ww.jingling.removeActorByActor = function (actor) {
    if (actor) {
        return this.removeActorByActorId(actor.actorId())
    }
}

/**精灵离队 */
ww.jingling.removeActorByActorId = function (actorId) {
    $gameParty.removeActor(actorId)
}


/**精灵离队 */
ww.jingling.removeActorByItem = function (item) {
    if (item) {
        if (item.addId) {
            this.removeActorByActorId(item.addId)
        }
    }
}

/**精灵离队 */
ww.jingling.removeActorByItemId = function (itemid) {
    if (itemid) {
        var item = $dataItems[itemid]
        this.removeActorByItem(item)
    }
}



/**
 * ================================
 * 
 * 
 * 精灵改名
 * 
 * ================================
 * 
 * */


/**精灵改名通过临时 */
ww.jingling.changeNameByLs = function () {
    this.changeNameByActorId(this.lsActorId)
}
/**精灵改名通过捕捉 */

ww.jingling.changeNameByBz = function () {
    this.changeNameByActorId(this.bzActorId)
}
/**精灵改名通过角色 */
ww.jingling.changeNameByActor = function (actor) {
    if (actor) {
        return this.changeNameByActorId(actor.actorId())
    }
}

/**精灵改名 通过角色id */
ww.jingling.changeNameByActorId = function (actorId) {
    if (actorId && $gameActors._data[actorId]) {
        SceneManager.push(Scene_Name);
        SceneManager.prepareNextScene(actorId, ww.jingling.nameLength);
    }
}


/**精灵改名 */
ww.jingling.changeNameByItem = function (item) {
    if (item) {
        if (item.addId) {
            this.changeNameByActorId(item.addId)
        }
    }
}

/**精灵改名 */
ww.jingling.changeNameByItemId = function (itemid) {
    if (itemid) {
        var item = $dataItems[itemid]
        this.changeNameByItem(item)
    }
}


/**
 * 
 * 
 * 
 * 
 * 
 * 
 */

Game_Party.prototype.addActorOnTop = function (actorId) {
    //如果(不是 角色组 包含(角色id) )
    if (this._actors.contains(actorId)) {
        this._actors.splice(this._actors.indexOf(actorId), 1);
    }
    this._actors.unshift(actorId);
    if (this._actors.length > ww.jingling.partySize) {
        this._actors.length = ww.jingling.partySize
    }
    //游戏游戏者 刷新()
    $gamePlayer.refresh();
    //游戏地图 请求刷新()
    $gameMap.requestRefresh();
};

Game_Party.prototype.addActor = function (actorId) {
    //如果(不是 角色组 包含(角色id) )
    if (this._actors.contains(actorId)) {
        this._actors.splice(this._actors.indexOf(actorId), 1);
    }
    this._actors.push(actorId);
    if (this._actors.length > ww.jingling.partySize) {
        this._actors.length = ww.jingling.partySize
    }
    $gamePlayer.refresh();
    $gameMap.requestRefresh();
};




/**
 * ==========================
 * 显示
 * ==========================
 * 
 */


/**修改绘制名称 */
Window_Base.prototype.drawItemName = function (item, x, y, width) {
    width = width || 312;
    if (item) {
        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x + 2, y + 2);
        if (item.addId) {
            var actor = $gameActors.actor(item.addId)
            if (actor) {
                this.drawText(actor.name(), x + iconBoxWidth, y, width - iconBoxWidth);
            } else {
                this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
            }
        } else {
            this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
        }
    }
};

/** */
DataMessage.pushJingLingList = function (item, setList, list) {
    var list = list || []
    if (item && item.addId) {
        var actor = $gameActors.actor(item.addId)
        if (actor) {
            var setList = setList || ww.jingling.setList
            var showSet = ww.jingling.showSet
            for (var i = 0; i < setList.length; i++) {
                var type = setList[i]
                if (showSet[type]) {
                    var v = ""
                    if (typeof actor[type] == "function") {
                        v = actor[type]()
                    } else {
                        v = actor[type]
                    }
                    var r = showSet[type].format(v)
                    list.push(r)
                }
            }
        }
    }
    return list
}

Window_FloatHelp.prototype.setItem = function (item) {
    if (!item) {
        var text = ""
        this.setText(text || '');
    } else {
        if (item.addId) {
            var list = DataMessage.pushJingLingList(item)
            var text = DataMessage.list2Text(list, "\n")
            var actor = $gameActors.actor(item.addId)


            this.setText(text || '');

            if (actor && ww.jingling.pictures) {
                this.setPicture(actor._useActorId, ww.jingling.pictures)
            } else {
                this.setPicture("")
            }
        } else {
            if (item.meta && "help" in item.meta) {
                var set = null
                try {
                    var set = JSON.parse(item.meta.help)
                } catch (error) {

                }
                var list = DataMessage.pushList(item, set)

                var text = DataMessage.list2Text(list, "\n")

            } else {
                var text = item.description
            }


            this.setText(text || '');
            if (item.meta && item.meta.pic) {
                var is = DataMessage.isObj(item)
                this.setPicture(item.meta.pic, is)
            }
        }
    }
    console.log(text)
};


function Window_JingLingCategory() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Window_JingLingCategory.prototype = Object.create(Window_ItemCategory.prototype);
/**设置创造者 */
Window_JingLingCategory.prototype.constructor = Window_JingLingCategory;



Window_JingLingCategory.prototype.makeCommandList = function () {
    this.addCommand("时间", 'jingling');
    this.addCommand("种类", 'jingling1');
};

function Scene_JinglingItem() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Scene_JinglingItem.prototype = Object.create(Scene_Item.prototype);
/**设置创造者 */
Scene_JinglingItem.prototype.constructor = Scene_JinglingItem;
/**初始化 */
Scene_JinglingItem.prototype.initialize = function () {
    Scene_Item.prototype.initialize.call(this);
};





Scene_JinglingItem.prototype.create = function () {
    Scene_Item.prototype.create.call(this);
    this.createJinglingWindow();
};


Scene_JinglingItem.prototype.createCategoryWindow = function () {
    this._categoryWindow = new Window_JingLingCategory();
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.y = this._helpWindow.height;
    this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._categoryWindow);
};


Scene_JinglingItem.prototype.createJinglingWindow = function () {
    this._jinglingWindow = new Window_JinglingCommand();

    var addCommands = ww.jingling.addCommands || []

    for (var i = 0; i < addCommands.length; i++) {
        var command = addCommands[i]
        if (command) {
            var handername = "h" + i
            var name = command[0] || ""
            var value = command[1] || 0
            var use = command[2] || 0
            this._jinglingWindow.setHandler(handername, this.onJingLingDo.bind(this, value));
        }
    }
    this._jinglingWindow.setHandler('cancel', this.onJingLingCancel.bind(this));
    this.addWindow(this._jinglingWindow);
};





Scene_JinglingItem.prototype.startEvent = function (id) {
    if ($dataCommonEvents[id]) {
        if (!this._interpreter) {
            this._interpreter = new Game_Interpreter()
        }
        this._interpreter.setup($dataCommonEvents[id].list);
        this._interpreter.update();
    } 
};

Scene_JinglingItem.prototype.startEvent2 = function (id) {
    if ($dataCommonEvents[id]) {
        $gameTemp.reserveCommonEvent(id);
    } 
};

Scene_JinglingItem.prototype.onJingLingDo = function (type) {
    var item = this.item()
    ww.jingling.lsItem = null
    ww.jingling.lsItemId = null
    ww.jingling.lsActor = null
    ww.jingling.lsActorId = null
    ww.jingling.lsActorUseId = null
    if (item && item.addId) {
        var actor = ww.jingling.getActorByItem(item)
        if (actor) {
            ww.jingling.lsItem = item
            ww.jingling.lsItemId = item.id
            ww.jingling.lsActor = actor
            ww.jingling.lsActorId = item.addId
            ww.jingling.lsActorUseId = actor._useActorId
            if (type == "show") {
                this.onJingLingShow()
            } else if (type == "namechange") {
                this.onJingLingNameChange()
            } else if (type == "add") {
                this.onJingLingAdd()
            } else if (type == "remove") {
                this.onJingLingRemove()
            } else if (type == "quxiao") {
                this.onJingLingCancel()
            } else if (type == "del") {
                this.onJingLingDel()
            } else if (typeof type == 'number') {
                this.startEvent(type)
            } else if (typeof type == "string") {
                this.startEvent2(type * 1)
            }
        }
    }
    this.onJingLingCancel()
}


Scene_JinglingItem.prototype.onJingLingShow = function () {
    var item = this.item()
    if (item) {
        var id = item.addId
        if (id) {
            SceneManager.push(Scene_JinglingStatus);
            SceneManager.prepareNextScene(id);
        }
    }
};



Scene_JinglingItem.prototype.onJingLingAdd = function () {
    ww.jingling.addActorByItem(this.item())

};


Scene_JinglingItem.prototype.onJingLingNameChange = function () {
    var item = this.item()
    if (item) {
        var id = item.addId
        if (id) {
            SceneManager.push(Scene_Name);
            SceneManager.prepareNextScene(id, ww.jingling.nameLength);
        }
    }

};

Scene_JinglingItem.prototype.onJingLingRemove = function () {
    ww.jingling.removeActorByItem(this.item())

};

Scene_JinglingItem.prototype.onJingLingDel = function () {
    ww.jingling.shifangByItem(this.item())

};


Scene_JinglingItem.prototype.onJingLingCancel = function () {
    this.hideSubWindow(this._jinglingWindow);
};

Scene_JinglingItem.prototype.determineItem = function () {
    var item = this.item();

    if (item && item.addId) {
        this._jinglingWindow.setItem(item);
        this.showSubWindow(this._jinglingWindow);
        this._jinglingWindow.x = this._helpWindow.x
        this._jinglingWindow.y = this._helpWindow.y

    } else {
        var action = new Game_Action(this.user());
        var item = this.item();
        action.setItemObject(item);
        if (action.isForFriend()) {
            this.showSubWindow(this._actorWindow);
            this._actorWindow.selectForItem(this.item());
        } else {
            this.useItem();
            this.activateItemWindow();
        }
    }
};



Scene_JinglingItem.prototype.update = function () {
    Scene_ItemBase.prototype.update.call(this);
    if (this._categoryWindow.active !== true && this._itemWindow.active !== true && this._actorWindow.active !== true && this._jinglingWindow.active !== true) {
        this._categoryWindow.activate();
    }

    if (this._interpreter) {
        //如果 (不是 事件解释器 是运转() )
        if (!this._interpreter.isRunning()) {
            //事件解释器 安装(列表(),事件id)
            this._interpreter = null;
        }
        if (this._interpreter) {
            //事件解释器 更新()
            this._interpreter.update();
        }
    }
};





function Window_JinglingCommand() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Window_JinglingCommand.prototype = Object.create(Window_Command.prototype);
Window_JinglingCommand.prototype.constructor = Window_JinglingCommand;
/**初始化 */
Window_JinglingCommand.prototype.initialize = function () {
    Window_Command.prototype.initialize.call(this, 0, 0);
    //this.updatePlacement();
    this.open();
    this.hide()
};

Window_JinglingCommand.prototype.setItem = function (item) {
    this._item = item
    this.refresh()
};

/**窗口宽 */
Window_JinglingCommand.prototype.windowWidth = function () {
    return 240;
};
/**更新位置 */
Window_JinglingCommand.prototype.updatePlacement = function () {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = Graphics.boxHeight - this.height - 96;
};





/**制作命令列表 */
Window_JinglingCommand.prototype.makeCommandList = function () {
    var inparty = ww.jingling.isInGamePartyByItem(this._item)

    var addCommands = ww.jingling.addCommands || []

    for (var i = 0; i < addCommands.length; i++) {
        var command = addCommands[i]
        if (command) {
            var handername = "h" + i
            var name = command[0] || ""
            var value = command[1] || 0
            var use = command[2] || 0
            var value2 = use ? use == 1 ? inparty : !inparty : undefined
            this.addCommand(name, handername, value2);
        }
    }
};



function Scene_JinglingStatus() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Scene_JinglingStatus.prototype = Object.create(Scene_MenuBase.prototype);
/**设置创造者 */
Scene_JinglingStatus.prototype.constructor = Scene_JinglingStatus;
/**初始化 */
Scene_JinglingStatus.prototype.initialize = function () {
    Scene_MenuBase.prototype.initialize.call(this);
};


Scene_JinglingStatus.prototype.prepare = function (actorId) {
    //角色id  = actorId
    this._actorId = actorId;
};
/**创建 */
Scene_JinglingStatus.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this._statusWindow = new Window_Status();
    this._statusWindow.setHandler('cancel', this.popScene.bind(this));
    //this._statusWindow.setHandler('pagedown', this.nextActor.bind(this));
    //this._statusWindow.setHandler('pageup',   this.previousActor.bind(this));
    //状态窗口 预约脸图()
    this._statusWindow.reserveFaceImages();
    //添加窗口(状态窗口)
    this.addWindow(this._statusWindow);
};

Scene_JinglingStatus.prototype.start = function () {
    Scene_MenuBase.prototype.start.call(this);
    this.refreshActor();
};


Scene_JinglingStatus.prototype.actor = function () {
    return $gameActors.actor(this._actorId)
};

/**刷新角色 */
Scene_JinglingStatus.prototype.refreshActor = function () {
    var actor = this.actor();
    this._statusWindow.setActor(actor);
};
/**当角色改变 */
Scene_JinglingStatus.prototype.onActorChange = function () {
    this.refreshActor();
    this._statusWindow.activate();
};



Window_MenuCommand.prototype.makeCommandList = function () {
    this.addJingLingCommands()
    this.addMainCommands();
    this.addFormationCommand();
    this.addOriginalCommands();
    this.addOptionsCommand();
    this.addSaveCommand();
    this.addGameEndCommand();
};

Window_MenuCommand.prototype.addJingLingCommands = function () {
    this.addCommand("精灵", 'jingling');

}


Scene_Menu.prototype.createCommandWindow = function () {
    //命令窗口 = 新 命令窗口(0,0)
    this._commandWindow = new Window_MenuCommand(0, 0);
    //命令窗口 设置处理("item"//物品 , 命令物品 绑定(this))
    this._commandWindow.setHandler('jingling', this.commandJingLing.bind(this));
    this._commandWindow.setHandler('item', this.commandItem.bind(this));
    //命令窗口 设置处理("skill"//技能 , 命令个人 绑定(this))
    this._commandWindow.setHandler('skill', this.commandPersonal.bind(this));
    //命令窗口 设置处理("equip"//装备 , 命令个人 绑定(this))
    this._commandWindow.setHandler('equip', this.commandPersonal.bind(this));
    //命令窗口 设置处理("status"//状态 , 命令个人 绑定(this))
    this._commandWindow.setHandler('status', this.commandPersonal.bind(this));
    //命令窗口 设置处理("formation"//编队 , 命令编队 绑定(this))
    this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
    //命令窗口 设置处理("options"//选项 , 命令选项 绑定(this))
    this._commandWindow.setHandler('options', this.commandOptions.bind(this));
    //命令窗口 设置处理("save"//保存 , 命令保存 绑定(this))
    this._commandWindow.setHandler('save', this.commandSave.bind(this));
    //命令窗口 设置处理("gameEnd"//游戏结束 , 命令结束游戏 绑定(this))
    this._commandWindow.setHandler('gameEnd', this.commandGameEnd.bind(this));
    //命令窗口 设置处理("cancel"//取消 , 删除场景 绑定(this))
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    //添加窗口(命令窗口)
    this.addWindow(this._commandWindow);
};


Scene_Menu.prototype.commandJingLing = function () {
    SceneManager.push(Scene_JinglingItem)
}




Window_ItemList.prototype.includes = function (item) {
    switch (this._category) {
        case 'item':
            return DataManager.isItem(item) && item.itypeId === 1 && !item.addId;
        case 'jingling':
        case 'jingling1':
            return DataManager.isItem(item) && item.addId;
        case 'weapon':
            return DataManager.isWeapon(item);
        case 'armor':
            return DataManager.isArmor(item);
        case 'keyItem':
            return DataManager.isItem(item) && item.itypeId === 2 && !item.addId;
        default:
            return false;
    }
};



/**绘制项目数字 */
Window_ItemList.prototype.drawItemNumber = function (item, x, y, width) {
    if (item && item.addId) {

        // this.drawText(':', x, y, width - this.textWidth('00'), 'right');
        this.drawText(ww.jingling.isInGamePartyByItem(item) ? "队伍中" : "", x, y, width, 'right');
    } else if (this.needsNumber()) {
        this.drawText(':', x, y, width - this.textWidth('00'), 'right');
        this.drawText($gameParty.numItems(item), x, y, width, 'right');
    }
};





Game_Party.prototype.canUse = function (item) {
    if (item && item.addId) {
        return true
    }
    //返回 成员组() 一些 方法(角色)
    return this.members().some(function (actor) {
        //返回 角色 能使用(项目)
        return actor.canUse(item);
    });
};




Window_ItemList.prototype.makeItemList = function () {
    this._data = $gameParty.allItems().filter(function (item) {
        return this.includes(item);
    }, this);
    if (this._category == "jingling") {
    } else if (this._category == "jingling1") {
        this._data.sort(function (a, b) {
            if (!a) {
                return -1
            }
            if (!b) {
                return 1
            }
            var aa = $gameActors.actor(a.addId)
            var ba = $gameActors.actor(b.addId)

            var ai = (aa && aa._useActorId) || 0
            var bi = (ba && ba._useActorId) || 0
            return ai - bi || a.id - b.id
        })

    }

    if (this.includes(null)) {
        this._data.push(null);
    }
};