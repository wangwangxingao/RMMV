
/**-----------------------------------------------------------------------------*/
/** Game_Troop*/
/** 游戏敌群     $gameTroop*/
/** The game object class for a troop and the battle-related data.*/
/** 敌群和战斗相关数据的游戏对象类*/
function Game_Troop() {
    this.initialize.apply(this, arguments);
}

/**设置原形 */
Game_Troop.prototype = Object.create(Game_Unit.prototype);
/**设置创造者*/
Game_Troop.prototype.constructor = Game_Troop;
/**半字母表*/
Game_Troop.LETTER_TABLE_HALF = [
    ' A',' B',' C',' D',' E',' F',' G',' H',' I',' J',' K',' L',' M',
    ' N',' O',' P',' Q',' R',' S',' T',' U',' V',' W',' X',' Y',' Z'
];
/**全字母表 */
Game_Troop.LETTER_TABLE_FULL = [
    'Ａ','Ｂ','Ｃ','Ｄ','Ｅ','Ｆ','Ｇ','Ｈ','Ｉ','Ｊ','Ｋ','Ｌ','Ｍ',
    'Ｎ','Ｏ','Ｐ','Ｑ','Ｒ','Ｓ','Ｔ','Ｕ','Ｖ','Ｗ','Ｘ','Ｙ','Ｚ'
];
/**初始化*/
Game_Troop.prototype.initialize = function() {
    //游戏小组 初始化 呼叫(this)
    Game_Unit.prototype.initialize.call(this);
    //事件解释器 = 新 游戏事件解释器()
    this._interpreter = new Game_Interpreter();
    //清除()
    this.clear();
};
/**是事件运转*/
Game_Troop.prototype.isEventRunning = function() {
    //返回 事件解释器 是运转()
    return this._interpreter.isRunning();
};
/**更新事件命令解释器*/
Game_Troop.prototype.updateInterpreter = function() {
    //事件解释器 更新()
    this._interpreter.update();
};
/**回合计数*/
Game_Troop.prototype.turnCount = function() {
    //返回 回合计数
    return this._turnCount;
};
/**成员组*/
Game_Troop.prototype.members = function() {
    //返回 敌人组
    return this._enemies;
};
/**清除*/
Game_Troop.prototype.clear = function() {
    //事件解释器 清除()
    this._interpreter.clear();
    //敌群id = 0
    this._troopId = 0;
    //事件标志 = {}
    this._eventFlags = {};
    //敌人组 = []
    this._enemies = [];
    //回合计数 = 0
    this._turnCount = 0;
    //名称计数 = {}
    this._namesCount = {};
};
/**敌群*/
Game_Troop.prototype.troop = function() {
    //返回 数据敌群组[敌群id]
    return $dataTroops[this._troopId];
};
/**安装
 * @param {number} troopId 敌群id
 * @description 清除内容,设置敌群id,然后根据敌群数据安装每一个敌人,然后制作唯一名称
*/
Game_Troop.prototype.setup = function(troopId) {
    //清除()
    this.clear();
    //敌群id = troopId//敌群id
    this._troopId = troopId;
    //敌人组 = []
    this._enemies = [];
    //敌群() 成员组 对每一个 方法(成员)
    this.troop().members.forEach(function(member) {
        //如果 ( 数据敌人组[成员 敌人id])
        if ($dataEnemies[member.enemyId]) {
            //敌人id = 成员 敌人id
            var enemyId = member.enemyId;
            //x = 成员 x 
            var x = member.x;
            //y = 成员 y
            var y = member.y;
            //敌人 = 新 游戏敌人(敌人id , x , y)
            var enemy = new Game_Enemy(enemyId, x, y);
            //如果(成员 隐藏)
            if (member.hidden) {
                //敌人 隐藏()
                enemy.hide();
            }
            //敌人组 添加(敌人)
            this._enemies.push(enemy);
        }
    //this
    }, this);
    //制作唯一名称()
    this.makeUniqueNames();
};
/**制作唯一名称*/
Game_Troop.prototype.makeUniqueNames = function() {
    //表 = 字母表()
    var table = this.letterTable();
    //成员组() 对每一个 方法(敌人)
    this.members().forEach(function(enemy) {
        //如果 (敌人 是活的() 并且 敌人 是标记空() )
        if (enemy.isAlive() && enemy.isLetterEmpty()) {
            //名称 = 敌人 原始名称()
            var name = enemy.originalName();
            //n = 名称计数[名称] || 0 
            var n = this._namesCount[name] || 0;
            //敌人 设置标记( 表[n % 表 长度])
            enemy.setLetter(table[n % table.length]);
            //名称计数[名称] = n + 1
            this._namesCount[name] = n + 1;
        }
    //this
    }, this);
    //成员组() 对每一个 方法(敌人)
    this.members().forEach(function(enemy) {
        //名称 = 敌人 原始名称()
        var name = enemy.originalName();
        //如果 (名称计数[名称] >=2 )
        if (this._namesCount[name] >= 2) {
            //敌人 设置复数(true)
            enemy.setPlural(true);
        }
    //this
    }, this);
};
/**字母表*/
Game_Troop.prototype.letterTable = function() {
    //返回 游戏系统 是中文日文韩文() ? 游戏敌群 半字母表 : 全字母表
    return $gameSystem.isCJK() ? Game_Troop.LETTER_TABLE_FULL :
            Game_Troop.LETTER_TABLE_HALF;
};
/**敌人名称组*/
Game_Troop.prototype.enemyNames = function() {
    //名称组 = []
    var names = [];
    //成员组() 对每一个 方法(敌人)
    this.members().forEach(function(enemy) {
        //名称 = 敌人 原始名称()
        var name = enemy.originalName();
        //如果(敌人 是活的 并且 不是 名称组 包含(名称) )
        if (enemy.isAlive() && !names.contains(name)) {
            //名称组 添加(名称)
            names.push(name);
        }
    });
    //返回 名称组
    return names;
};
/**满足条件*/
Game_Troop.prototype.meetsConditions = function(page) {
    //条件 = 页 条件
    var c = page.conditions;
    //如果 (不是 条件 回合结束 并且 不是 条件 回合有效 并且 不是 条件 敌人有效 并且   
    if (!c.turnEnding && !c.turnValid && !c.enemyValid &&
            //不是 条件 角色有效 并且 不是 条件 开关有效
            !c.actorValid && !c.switchValid) {
        //返回 false
        return false;  // Conditions not set
    }
    //如果(条件 回合结束 )
    if (c.turnEnding) {
        if (!BattleManager.isTurnEnd()) {
            //返回 false
            return false;
        }
    }
    //如果(条件 回合有效 )
    if (c.turnValid) {
        //n = 回合计数
        var n = this._turnCount;
        //a = 条件 回合a
        var a = c.turnA;
        //b = 条件 回合b
        var b = c.turnB;
        //如果(( b === 0  并且 n !== a ))
        if ((b === 0 && n !== a)) {
            //返回 false
            return false;
        }
        //如果( ( b>0 并且 (n<1 或者 n<a 或者 n%b !== a%b )   ) )
        if ((b > 0 && (n < 1 || n < a || n % b !== a % b))) {
            //返回 false
            return false;
        }
    }
    //如果(条件 敌人有效 )
    if (c.enemyValid) {
        //敌人 = 游戏敌群 成员组()[条件 敌人索引]
        var enemy = $gameTroop.members()[c.enemyIndex];
        //如果(不是 敌人 或者 敌人 hp比例() * 100 > 条件 敌人hp)
        if (!enemy || enemy.hpRate() * 100 > c.enemyHp) {
            //返回 false
            return false;
        }
    }
    //如果(条件 角色有效 )
    if (c.actorValid) {
        //角色 = 游戏角色组 角色(条件 角色索引) 
        var actor = $gameActors.actor(c.actorId);
        //如果(不是 角色 或者 角色 hp比例() * 100 > 条件角色hp)
        if (!actor || actor.hpRate() * 100 > c.actorHp) {
            //返回 false
            return false;
        }
    }
    //如果(条件 开关有效 )
    if (c.switchValid) {
        //如果(不是 游戏开关组 值(条件 开关id) )
        if (!$gameSwitches.value(c.switchId)) {
            //返回 false
            return false;
        }
    }
    //返回 true
    return true;
};
/**安装战斗事件*/
Game_Troop.prototype.setupBattleEvent = function() {
    //如果(不是 事件解释器 是运转() )
    if (!this._interpreter.isRunning()) {
        //如果( 事件解释器 安装储存公共事件() )
        if (this._interpreter.setupReservedCommonEvent()) {
            //返回 
            return;
        }
        //页组 = 敌群() 页组
        var pages = this.troop().pages;
        //循环 ( 开始时 i = 0 ; 当 i < 页组 长度 ; 每一次 i++)
        for (var i = 0; i < pages.length; i++) {
            //页 = 页组[i]
            var page = pages[i];
            //如果 ( 满足条件(页) 并且 不是 事件标志[i] )
            if (this.meetsConditions(page) && !this._eventFlags[i]) {
                //事件解释器 安装(页 列表)
                this._interpreter.setup(page.list);
                //如果(页 跨度 <= 1 //战斗  )
                if (page.span <= 1) {
                    //事件标志[i] = true
                    this._eventFlags[i] = true;
                }
                //中断
                break;
            }
        }
    }
};
/**增加回合*/
Game_Troop.prototype.increaseTurn = function() {
    //页组 = 敌群() 页组
    var pages = this.troop().pages;
    //循环 ( 开始时 i = 0 ; 当 i < 页组 长度 ; 每一次 i++)
    for (var i = 0; i < pages.length; i++) {
        //页 = 页组[i]
        var page = pages[i];
        //如果(页 跨度 === 1 //回合  )
        if (page.span === 1) {
            //事件标志[i] = false
            this._eventFlags[i] = false;
        }
    }
    //回合计数++
    this._turnCount++;
};
/**经验值总数*/
Game_Troop.prototype.expTotal = function() {
    //返回 死的成员组() 缩减 方法( r , 敌人 ) 
    return this.deadMembers().reduce(function(r, enemy) {
        //返回 r + 敌人 经验值()
        return r + enemy.exp();
    // 0 )
    }, 0);
};
/**金钱总数*/
Game_Troop.prototype.goldTotal = function() {
    //返回 死的成员组() 缩减 方法( r , 敌人 ) 
    return this.deadMembers().reduce(function(r, enemy) {
        //返回 r + 敌人 金钱()
        return r + enemy.gold();
    // 0 ) * 金钱比例()
    }, 0) * this.goldRate();
};
/**金钱比例*/
Game_Troop.prototype.goldRate = function() {
    //返回  游戏队伍 有金钱双倍() ? 2 : 1
    return $gameParty.hasGoldDouble() ? 2 : 1;
};
/**制作掉落物品组*/
Game_Troop.prototype.makeDropItems = function() {
    //返回 死的成员组() 缩减 方法( r , 敌人 ) 
    return this.deadMembers().reduce(function(r, enemy) {
        //返回 r 连接(敌人 制作掉落物品组() )
        return r.concat(enemy.makeDropItems());
    // [] )
    }, []);
};
