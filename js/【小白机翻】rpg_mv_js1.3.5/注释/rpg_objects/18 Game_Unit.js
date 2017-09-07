
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
    //在战斗 = false
    this._inBattle = false;
};
//在战斗
Game_Unit.prototype.inBattle = function() {
    //返回 在战斗 
    return this._inBattle;
};
//成员组
Game_Unit.prototype.members = function() {
    //返回 []
    return [];
};
//活的成员组
Game_Unit.prototype.aliveMembers = function() {
    //返回 成员组 过滤 方法(成员)
    return this.members().filter(function(member) {
        //返回 成员 是活的()
        return member.isAlive();
    });
};
//死的成员组
Game_Unit.prototype.deadMembers = function() {
    //返回 成员组 过滤 方法(成员)
    return this.members().filter(function(member) {
        //返回 成员 是死的
        return member.isDead();
    });
};
//可动成员组
Game_Unit.prototype.movableMembers = function() {
    //返回 成员组 过滤 方法(成员)
    return this.members().filter(function(member) {
        //返回 成员 能移动()
        return member.canMove();
    });
};
//清除动作
Game_Unit.prototype.clearActions = function() {
    //返回 成员组 对每一个 方法(成员)
    return this.members().forEach(function(member) {
        //返回 成员 清除动作()
        return member.clearActions();
    });
};
//敏捷
Game_Unit.prototype.agility = function() {
	//成员组 = 成员组
    var members = this.members();
    //如果 (成员组 长度 == 0)
    if (members.length === 0) {
	    //返回 1
        return 1;
    }
	//和 =  成员 缩减 方法 (r, 成员)
    var sum = members.reduce(function(r, member) {
	    //返回 r + 成员 敏捷
        return r + member.agi;
    // } ,0 )
    }, 0);
    //返回 和 / 成员组 长度
    return sum / members.length;
};
//目标比例和
Game_Unit.prototype.tgrSum = function() {
	//返回 活的成员组 缩减 方法(r, 成员)
    return this.aliveMembers().reduce(function(r, member) {
	    //返回 r + 成员 目标比例
        return r + member.tgr;
    //}, 0 )
    }, 0);
};
//随机目标
Game_Unit.prototype.randomTarget = function() {
	//目标比例随机 =  随机数 *  目标比例和
    var tgrRand = Math.random() * this.tgrSum();
    //目标 = null
    var target = null;
    //活的成员组 对每一个 方法(成员)
    this.aliveMembers().forEach(function(member) {
	    //目标比例随机 -= 成员 目标比例
        tgrRand -= member.tgr;
        //如果 (目标比例随机 <= 0 并且 不是 目标  )
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
    //成员组 = 死的成员组()
    var members = this.deadMembers();
    //如果(成员组 长度 === 0 )
    if (members.length === 0) {
        //返回 null
        return null;
    }
    //返回 成员组[数学 向下取整 (数学 随机数() * 成员组 长度)]
    return members[Math.floor(Math.random() * members.length)];
};
//流畅目标
Game_Unit.prototype.smoothTarget = function(index) {
	//如果 (索引 < 0)
    if (index < 0) {
	    //索引 = 0
        index = 0;
    }
    //成员 = 成员组[索引]
    var member = this.members()[index];
    //返回  如果 (成员 并且 成员是活的() ) 返回 成员 否则 返回 活的成员组([0]
    return (member && member.isAlive()) ? member : this.aliveMembers()[0];
};
//流畅死亡目标
Game_Unit.prototype.smoothDeadTarget = function(index) {
    //如果 (索引 < 0 )
    if (index < 0) {
	    //索引 = 0
        index = 0;
    }
    //成员 = 成员组[索引]
    var member = this.members()[index];
    //返回  如果 (成员 并且 成员是死的() ) 返回 成员 否则 返回 死的成员组([0]
    return (member && member.isDead()) ? member : this.deadMembers()[0];
};
//清除结果
Game_Unit.prototype.clearResults = function() {
    //成员组 对每一个 方法(成员)
    this.members().forEach(function(member) {
        //成员 清除结果()
        member.clearResult();
    });
};
//当战斗开始
Game_Unit.prototype.onBattleStart = function() {
    //成员组 对每一个 方法(成员)
    this.members().forEach(function(member) {
        //成员 当战斗开始()
        member.onBattleStart();
    });
    //在战斗 = true 
    this._inBattle = true;
};
//当战斗结束
Game_Unit.prototype.onBattleEnd = function() {
    //在战斗 = false
    this._inBattle = false;
    //成员组 对每一个 方法(成员)
    this.members().forEach(function(member) {
        //成员 当战斗结束()
        member.onBattleEnd();
    });
};
//制作动作
Game_Unit.prototype.makeActions = function() {
    //成员组 对每一个 方法(成员)
    this.members().forEach(function(member) {
        //成员 制作动作()
        member.makeActions();
    });
};
//选择
Game_Unit.prototype.select = function(activeMember) {
    //成员组 对每一个 方法(成员)
    this.members().forEach(function(member) {
        //如果(成员 === 活动成员)
        if (member === activeMember) {
            //成员 选择()
            member.select();
        //否则
        } else {
            //成员 取消()
            member.deselect();
        }
    });
};
//是全部死了
Game_Unit.prototype.isAllDead = function() {
    //返回 活的成员组() 长度 === 0
    return this.aliveMembers().length === 0;
};
//替代战斗
Game_Unit.prototype.substituteBattler = function() {
    //成员组 = 成员组()
    var members = this.members();
    //循环(开始时 i = 0 ;当 i < 成员组 长度 ; 每一次 i++)
    for (var i = 0; i < members.length; i++) {
        //如果(成员组[i] 是替代()  )
        if (members[i].isSubstitute()) {
            //返回 成员组[i]
            return members[i];
        }
    }
};
