
//-----------------------------------------------------------------------------
// Game_Followers
// 游戏从者组
// The wrapper class for a follower array.
// 包装类为了从者数组

function Game_Followers() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_Followers.prototype.initialize = function() {
    //显示 = 游戏系统 开始从者组
    this._visible = $dataSystem.optFollowers;
    //集合中 = false
    this._gathering = false;
    //数据 = []
    this._data = [];
    //循环 (开始时 i = 1 ; 当 i < 游戏队伍 最大战斗成员数() ;每一次 i++)
    for (var i = 1; i < $gameParty.maxBattleMembers(); i++) {
        //数据 添加 (新 游戏从者(i))
        this._data.push(new Game_Follower(i));
    }
};
//是显示
Game_Followers.prototype.isVisible = function() {
    //返回 显示
    return this._visible;
};
//显示
Game_Followers.prototype.show = function() {
    //显示 = true
    this._visible = true;
};
//隐藏
Game_Followers.prototype.hide = function() {
    //显示 = false
    this._visible = false;
};
//从者
Game_Followers.prototype.follower = function(index) {
    //返回 数据[索引]
    return this._data[index];
};
//对每一个
Game_Followers.prototype.forEach = function(callback, thisObject) {
    //数据 对每一个 (呼叫返回 , this对象 )
    this._data.forEach(callback, thisObject);
};
//反转每一个
Game_Followers.prototype.reverseEach = function(callback, thisObject) {
    //数据 倒序()
    this._data.reverse();
    //数据 对每一个 (呼叫返回 , this对象 )
    this._data.forEach(callback, thisObject);
    //数据 倒序()
    this._data.reverse();
};
//刷新
Game_Followers.prototype.refresh = function() {
    //对每一个 (从者)
    this.forEach(function(follower) {
        //返回 从者 刷新()
        return follower.refresh();
    }, this);
};
///更新
Game_Followers.prototype.update = function() {
    //如果( 是集合中() )
    if (this.areGathering()) {
        //如果(不是 是移动中() )
        if (!this.areMoving()) {
            //更新移动()
            this.updateMove();
        }
        //如果( 是集合后() )
        if (this.areGathered()) {
            //集合中 = false
            this._gathering = false;
        }
    }
    //对每一个(从者)
    this.forEach(function(follower) {
        //从者 更新()
        follower.update();
    // this)
    }, this);
};
//更新移动
Game_Followers.prototype.updateMove = function() {
    //循环 (开始时 i = 数据 长度 - 1 ; 当 i >= 0 ;每一次 i-- )
    for (var i = this._data.length - 1; i >= 0; i--) {
        //临近人物 = ( i> 0 ? 返回 数据[i-1] 否则 返回 游戏游戏者 )
        var precedingCharacter = (i > 0 ? this._data[i - 1] : $gamePlayer);
        //数据[i] 追逐角色(临近人物)
        this._data[i].chaseCharacter(precedingCharacter);
    }
};
//跳跃全都
Game_Followers.prototype.jumpAll = function() {
    //如果(游戏游戏者 是跳跃中() )
    if ($gamePlayer.isJumping()) {
        //循环 (开始时 i = 0 ; 当 i < 数据 长度   ;每一次 i++ )
        for (var i = 0; i < this._data.length; i++) {
            //从者 = 数据[i]
            var follower = this._data[i];
            //sx = 游戏游戏者 三角x从(从者 x )
            var sx = $gamePlayer.deltaXFrom(follower.x);
            //sy = 游戏游戏者 三角y从(从者 y )
            var sy = $gamePlayer.deltaYFrom(follower.y);
            //从者 跳跃(sx , sy)
            follower.jump(sx, sy);
        }
    }
};
//同步
Game_Followers.prototype.synchronize = function(x, y, d) {
    //对每一个(从者)
    this.forEach(function(follower) {
        //从者 设于(x,y)
        follower.locate(x, y);
        //从者 设置方向(d)
        follower.setDirection(d);
    // this)
    }, this);
};
//集合
Game_Followers.prototype.gather = function() {
    //集合中 = true
    this._gathering = true;
};
//是集合中
Game_Followers.prototype.areGathering = function() {
    //返回 集合中
    return this._gathering;
};
//显示从者组
Game_Followers.prototype.visibleFollowers = function() {
    //返回 数据 过滤 (从者)
    return this._data.filter(function(follower) {
        //返回 从者 是显示()
        return follower.isVisible();
    // this)
    }, this);
};
//是移动中
Game_Followers.prototype.areMoving = function() {
    //返回 显示从者组() 一些(从者)
    return this.visibleFollowers().some(function(follower) {
        //返回 从者 是移动中()
        return follower.isMoving();
    // this)
    }, this);
};
//是集合后
Game_Followers.prototype.areGathered = function() {
    //返回 显示从者组() 所有(从者)
    return this.visibleFollowers().every(function(follower) {
        //返回 不是 从者 是移动中() 并且 从者 位于 (游戏游戏者 x , 游戏游戏者 y)
        return !follower.isMoving() && follower.pos($gamePlayer.x, $gamePlayer.y);
    // this)
    }, this);
};
//是有人碰撞
Game_Followers.prototype.isSomeoneCollided = function(x, y) {
    //返回 显示从者组() 一些(从者)
    return this.visibleFollowers().some(function(follower) {
        //返回 从者 位于(x,y)
        return follower.pos(x, y);
    // this)
    }, this);
};
