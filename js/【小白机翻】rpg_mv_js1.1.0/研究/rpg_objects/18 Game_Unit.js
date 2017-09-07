
//-----------------------------------------------------------------------------
// Game_Unit
// 游戏小组
// The superclass of Game_Party and Game_Troop.
// 队伍和敌群 的 超级类

function Game_Unit() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_Unit.prototype.initialize = function() {
    this._inBattle = false;
};
//在战斗
Game_Unit.prototype.inBattle = function() {
    return this._inBattle;
};
//成员组
Game_Unit.prototype.members = function() {
    return [];
};
//活的成员组
Game_Unit.prototype.aliveMembers = function() {
    return this.members().filter(function(member) {
        return member.isAlive();
    });
};
//死的成员组
Game_Unit.prototype.deadMembers = function() {
    return this.members().filter(function(member) {
        return member.isDead();
    });
};
//可动成员组
Game_Unit.prototype.movableMembers = function() {
    return this.members().filter(function(member) {
        return member.canMove();
    });
};
//清除动作
Game_Unit.prototype.clearActions = function() {
    return this.members().forEach(function(member) {
        return member.clearActions();
    });
};
//敏捷
Game_Unit.prototype.agility = function() {
	//成员组 = 成员组
    var members = this.members();
    //如果 成员组 长度 == 0
    if (members.length === 0) {
	    //返回 1
        return 1;
    }
	//和 =  成员 调用回调函数 方法 (r, 成员)
    var sum = members.reduce(function(r, member) {
	    //返回 r + 成员 敏捷
        return r + member.agi;
    //初始值为 0
    }, 0);
    //返回 和 / 成员组 长度
    return sum / members.length;
};
//目标比例和
Game_Unit.prototype.tgrSum = function() {
	//返回 活的成员组 调用回调函数 方法 (r, 成员)
    return this.aliveMembers().reduce(function(r, member) {
	    //返回 r + 成员 目标比例
        return r + member.tgr;
    //初始值为 0 
    }, 0);
};
//随机目标
Game_Unit.prototype.randomTarget = function() {
	//目标比例随机 =  随机数 *  目标比例和
    var tgrRand = Math.random() * this.tgrSum();
    //目标 = null
    var target = null;
    //活的成员组 对每一个 (成员)
    this.aliveMembers().forEach(function(member) {
	    //目标比例随机 - 成员 目标比例
        tgrRand -= member.tgr;
        //如果 目标比例随机 <= 0 并且 不是 目标  
        if (tgrRand <= 0 && !target) {
	        //目标 = 成员
            target = member;
        }
    });
    //返回 成员
    return target;
};
//随机死亡目标
Game_Unit.prototype.randomDeadTarget = function() {
    var members = this.deadMembers();
    if (members.length === 0) {
        return null;
    }
    return members[Math.floor(Math.random() * members.length)];
};
//流畅目标
Game_Unit.prototype.smoothTarget = function(index) {
	//如果 索引 < 0
    if (index < 0) {
	    //索引 = 0
        index = 0;
    }
    //成员 = 成员组[索引]
    var member = this.members()[index];
    //返回  如果 (成员 并且 成员是活的) 返回 成员 否则 返回 活的成员组[0]
    return (member && member.isAlive()) ? member : this.aliveMembers()[0];
};
//流畅死亡目标
Game_Unit.prototype.smoothDeadTarget = function(index) {
    if (index < 0) {
        index = 0;
    }
    var member = this.members()[index];
    return (member && member.isDead()) ? member : this.deadMembers()[0];
};
//清除结果
Game_Unit.prototype.clearResults = function() {
    this.members().forEach(function(member) {
        member.clearResult();
    });
};
//当战斗开始
Game_Unit.prototype.onBattleStart = function() {
    this.members().forEach(function(member) {
        member.onBattleStart();
    });
    this._inBattle = true;
};
//当战斗结束
Game_Unit.prototype.onBattleEnd = function() {
    this._inBattle = false;
    this.members().forEach(function(member) {
        member.onBattleEnd();
    });
};
//制作动作
Game_Unit.prototype.makeActions = function() {
    this.members().forEach(function(member) {
        member.makeActions();
    });
};
//选择
Game_Unit.prototype.select = function(activeMember) {
    this.members().forEach(function(member) {
        if (member === activeMember) {
            member.select();
        } else {
            member.deselect();
        }
    });
};
//是全部死了
Game_Unit.prototype.isAllDead = function() {
    return this.aliveMembers().length === 0;
};
//替代战斗
Game_Unit.prototype.substituteBattler = function() {
    var members = this.members();
    for (var i = 0; i < members.length; i++) {
        if (members[i].isSubstitute()) {
            return members[i];
        }
    }
};
