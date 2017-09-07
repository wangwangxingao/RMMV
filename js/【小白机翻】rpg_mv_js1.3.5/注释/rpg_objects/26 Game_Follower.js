
//-----------------------------------------------------------------------------
// Game_Follower
// 游戏从者
// The game object class for a follower. A follower is an allied character, 
// other than the front character, displayed in the party.
//  对于跟随者的游戏对象类。追随者是一个专职的人物，不同于前面的人物，在队伍的显示。

function Game_Follower() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Game_Follower.prototype = Object.create(Game_Character.prototype);
//设置创造者
Game_Follower.prototype.constructor = Game_Follower;
//初始化
Game_Follower.prototype.initialize = function(memberIndex) {
    //游戏人物 初始化 呼叫(this)
    Game_Character.prototype.initialize.call(this);
    //成员索引 = 成员索引
    this._memberIndex = memberIndex;
    //设置透明(数据系统 开始透明)
    this.setTransparent($dataSystem.optTransparent);
    //设置穿透(true)
    this.setThrough(true);
};
//刷新
Game_Follower.prototype.refresh = function() {
    //行走图名称 = 是显示的() ? 返回 角色() 行走图名称() 否则 返回 ""
    var characterName = this.isVisible() ? this.actor().characterName() : '';
    //行走图索引 = 是显示的() ? 返回 角色() 行走图索引() 否则 返回 0
    var characterIndex = this.isVisible() ? this.actor().characterIndex() : 0;
    //设置图像(行走图名称, 行走图索引)
    this.setImage(characterName, characterIndex);
};
//角色
Game_Follower.prototype.actor = function() {
    //返回 游戏队伍 战斗成员组() [成员索引]
    return $gameParty.battleMembers()[this._memberIndex];
};
//是显示的
Game_Follower.prototype.isVisible = function() {
    //返回 角色() 并且 游戏游戏者 从者组() 是显示的()
    return this.actor() && $gamePlayer.followers().isVisible();
};
//更新
Game_Follower.prototype.update = function() {
    //游戏人物 更新 呼叫(this)
    Game_Character.prototype.update.call(this);
    //设置移动速度(游戏游戏者 真移动速度() )
    this.setMoveSpeed($gamePlayer.realMoveSpeed());
    //设置不透明度(游戏游戏者 不透明度() )
    this.setOpacity($gamePlayer.opacity());
    //设置合成模式(游戏游戏者 合成模式() )
    this.setBlendMode($gamePlayer.blendMode());
    //设置行走动画(游戏游戏者 有行走动画() )
    this.setWalkAnime($gamePlayer.hasWalkAnime());
    //设置踏步动画(游戏游戏者 有踏步动画() )
    this.setStepAnime($gamePlayer.hasStepAnime());
    //设置方向固定(游戏游戏者 是方向固定的() )
    this.setDirectionFix($gamePlayer.isDirectionFixed());
    //设置透明(游戏游戏者 是透明() )
    this.setTransparent($gamePlayer.isTransparent());
};
//追逐角色
Game_Follower.prototype.chaseCharacter = function(character) {
    //sx = 三角x从(人物 x)
    var sx = this.deltaXFrom(character.x);
    //sy = 三角y从(人物 y)
    var sy = this.deltaYFrom(character.y);
    //如果(sx !== 0 并且 sy !== 0 )
    if (sx !== 0 && sy !== 0) {
        //移动斜线(sx > 0 返回4 否则 返回 6 , sy >0 返回 8 否则 返回 2 )
        this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
    //否则 如果(sx !== 0 )
    } else if (sx !== 0) {
        //移动直线(sx > 0 返回4 否则 返回 6 )
        this.moveStraight(sx > 0 ? 4 : 6);
    //否则 如果(sy !== 0 )
    } else if (sy !== 0) {
        //移动直线(sy >0 返回 8 否则 返回 2 )
        this.moveStraight(sy > 0 ? 8 : 2);
    }
    //设置移动速度( 游戏游戏者 真移动速度() )
    this.setMoveSpeed($gamePlayer.realMoveSpeed());
};
