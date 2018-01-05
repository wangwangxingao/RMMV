//=============================================================================
// ww_AnimationBig.js
//=============================================================================
/*:
 * @plugindesc 
 * ww_AnimationBig,动画图片加强, 
 * @author wangwang
 *
 * @param  ww_AnimationBig
 * @desc 插件 动画图片加强 ,作者:汪汪
 * @default  汪汪
 *   
 * 
 * 
 * @help 
 *  
 * 当第一个动画图片设置为 "kongbai" 时
 * 会按照第二个动画的图片名称中主要部分,进行替换 
 * 如第一个为kongbai 第二个为 am_10
 * 那么他就会按照 图片名把原有的 图案 修改为 "am" + "_" + 图案
 * 也就是  图案为1   , 会使用 am_1 ,为 8 则会用am_8替换原有的图案 
 *  
 * 
 */










(function() {



    var _Sprite_Animation_prototype_initMembers = Sprite_Animation.prototype.initMembers
    Sprite_Animation.prototype.initMembers = function() {
        _Sprite_Animation_prototype_initMembers.call(this)
        this._bitmaps = null
        this._animation2 = false
    };

    Sprite_Animation.prototype.loadBitmaps = function() {
        this._bitmaps = null
        var name1 = this._animation.animation1Name;
        if (name1 == "kongbai") {
            this._bitmaps = {}
            var name2 = this._animation.animation2Name;
            var hue1 = this._animation.animation1Hue;
            var hue2 = this._animation.animation2Hue;
            if (name2) {
                var basename = name2.split("_")[0]
                var frames = this._animation.frames
                for (var i = 0; i < frames.length; i++) {
                    var frame = frames[i]
                    for (var i2 = 0; i2 < frame.length; i2++) {
                        var c = frame[i2]
                        var p = c[0]
                        if (p >= 0) {
                            this._bitmaps[p] = ImageManager.loadAnimation(basename + "_" + p, hue2);
                        }
                    }
                }
            }
        } else {
            var name2 = this._animation.animation2Name;
            var hue1 = this._animation.animation1Hue;
            var hue2 = this._animation.animation2Hue;
            this._bitmap1 = ImageManager.loadAnimation(name1, hue1);
            this._bitmap2 = ImageManager.loadAnimation(name2, hue2);
        }
    }

    /**是准备好 */
    Sprite_Animation.prototype.isReady = function() {
        if (this._bitmaps) {
            var v = true
            for (var i in this._bitmaps) {
                v = v && this._bitmaps[i].isReady()
            }
            return v
        } else {
            return this._bitmap1 && this._bitmap1.isReady() && this._bitmap2 && this._bitmap2.isReady();
        }
    };


    /**更新单元精灵 */
    Sprite_Animation.prototype.updateCellSprite = function(sprite, cell) {

        var pattern = cell[0];
        if (pattern >= 0) {
            if (this._bitmaps) {
                sprite.bitmap = this._bitmaps[pattern] || new Bitmap();
            } else {
                var sx = pattern % 5 * 192;
                var sy = Math.floor(pattern % 100 / 5) * 192;
                sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
                sprite.setFrame(sx, sy, 192, 192);
            }
            var mirror = this._mirror;
            sprite.x = cell[1];
            sprite.y = cell[2];

            sprite.rotation = cell[4] * Math.PI / 180;
            sprite.scale.x = cell[3] / 100;
            if (cell[5]) {
                sprite.scale.x *= -1;
            }
            if (mirror) {
                sprite.x *= -1;
                sprite.rotation *= -1;
                sprite.scale.x *= -1;
            }
            sprite.scale.y = cell[3] / 100;
            sprite.opacity = cell[6];
            sprite.blendMode = cell[7];
            sprite.visible = true;
        } else {
            sprite.visible = false;
        }
    }
})()