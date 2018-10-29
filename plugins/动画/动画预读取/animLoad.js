//=============================================================================
//  animLoad.js
//=============================================================================

/*:
 * @plugindesc  动画预读取 
 * @author wangwang
 * 
 * 
 * 
 * @help
 * 动画预读取
 * 
 * */


 (function () {

    var Game_Item_prototype_setObject = Game_Item.prototype.setObject
    Game_Item.prototype.setObject = function (item) {
        Game_Item_prototype_setObject.call(this, item)
        Sprite_Animation.loadBitmaps(item && item.animationId)
    };

    var learnSkill = Game_Actor.prototype.learnSkill
    Game_Actor.prototype.learnSkill = function (skillId) {
        var item = $dataSkills[skillId]
        Sprite_Animation.loadBitmaps(item && item.animationId)
        learnSkill.call(this, skillId)
    };

    Sprite_Animation.__loadBitmaps = {}
    Sprite_Animation.loadBitmaps = function (animationId) {
        if (Sprite_Animation.__loadBitmaps[animationId]) { return }

        var animation = $dataAnimations && $dataAnimations[animationId]
        var s = new Sprite_Animation(0, animation, 0, 0)
        Sprite_Animation.__loadBitmaps[animationId] = 1
    }

})()


