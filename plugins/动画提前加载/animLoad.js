(function () {
    var Game_Item_prototype_setObject = Game_Item.prototype.setObject
    Game_Item.prototype.setObject = function (item) {
        Game_Item_prototype_setObject.call(this, item)
        this.itemLoadAnimation(item && item.animationId) 
    };
    
    Game_Item.prototype.itemLoadAnimation = function (index) {
        var animation = $dataAnimations && $dataAnimations[index]
        if (animation) {
            //名称1 = 动画 动画1名称
            var name1 = animation.animation1Name;
            //名称2 = 动画 动画2名称
            var name2 = animation.animation2Name;
            //色相1 = 动画 动画1色相
            var hue1 = animation.animation1Hue;
            //色相2 = 动画 动画2色相
            var hue2 = animation.animation2Hue;
            //图片1 = 图片管理器 读取动画(名称1 ,色相1)
            this._bitmap1 = ImageManager.loadAnimation(name1, hue1);
            //图片2 = 图片管理器 读取动画(名称2 ,色相2)
            this._bitmap2 = ImageManager.loadAnimation(name2, hue2);
        }
    };
})()