
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
    Game_Character.prototype.initialize.call(this);
    this._memberIndex = memberIndex;
    this.setTransparent($dataSystem.optTransparent);
    this.setThrough(true);
};
//刷新
Game_Follower.prototype.refresh = function() {
    var characterName = this.isVisible() ? this.actor().characterName() : '';
    var characterIndex = this.isVisible() ? this.actor().characterIndex() : 0;
    this.setImage(characterName, characterIndex);
};
//角色
Game_Follower.prototype.actor = function() {
    return $gameParty.battleMembers()[this._memberIndex];
};
//是显示的
Game_Follower.prototype.isVisible = function() {
    return this.actor() && $gamePlayer.followers().isVisible();
};
//更新
Game_Follower.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    this.setMoveSpeed($gamePlayer.realMoveSpeed());
    this.setOpacity($gamePlayer.opacity());
    this.setBlendMode($gamePlayer.blendMode());
    this.setWalkAnime($gamePlayer.hasWalkAnime());
    this.setStepAnime($gamePlayer.hasStepAnime());
    this.setDirectionFix($gamePlayer.isDirectionFixed());
    this.setTransparent($gamePlayer.isTransparent());
};
//追逐角色
Game_Follower.prototype.chaseCharacter = function(character) {
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
    if (sx !== 0 && sy !== 0) {
        this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
    } else if (sx !== 0) {
        this.moveStraight(sx > 0 ? 4 : 6);
    } else if (sy !== 0) {
        this.moveStraight(sy > 0 ? 8 : 2);
    }
    this.setMoveSpeed($gamePlayer.realMoveSpeed());
};
