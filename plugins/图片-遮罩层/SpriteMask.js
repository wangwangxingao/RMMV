//=============================================================================
// spriteMask.js
//=============================================================================
/*:
 * @plugindesc 精灵遮罩
 * @author 汪汪
 *
 * @param spriteMask
 * @desc 图片遮罩
 * @default 汪汪
 *
 * @help
 * 
 * 设置遮罩图片
 * sprite.maskPicture(  name, scale, pos)
 * @param {string} name 遮罩名称 放在img的pictures文件夹中的图片
 * @param {number} scale 遮罩比例
 * @param {[number,number]} pos 遮罩位置[x,y]
 * 
 * 
 * 改变id图片遮罩色调
 * sprite.maskPictureTone(  tone, duration, baseTone)
 * @param {[number,number,number,number]} tone 目标色调
 * @param {number,} duration 持续时间
 * @param {[number,number,number,number]} baseTone 基础色调 不设置为[0,0,0,0]
 * 
 * 
 */

(function () {


    var ww = ww || {}

    ww.spriteMask = {}


    ww.spriteMask.Sprite_prototype_update = Sprite.prototype.update
    Sprite.prototype.update = function () {
        ww.spriteMask.Sprite_prototype_update.call(this);
        if (this.visible) {
            this.updateMask();
        }
    };

    Sprite.prototype.setMask = function (s) {
        if (this.mask) {
            this.removeChild(this.mask)
        }
        this.mask = s
        if (this.mask) {
            this.addChild(this.mask)
        }
    }

    Sprite.prototype.updateMask = function () {
        var maskname = this._maskName || ""
        if (maskname != this._maskName2) {
            this._maskName2 = maskname
            if (this._maskName2) {
                this.setMask(new Sprite(ImageManager.loadPicture(this._maskName2)))
            } else {
                this.setMask(null)
            }
        }
        if (this.mask) {
            this.updateMaskTone()
            var tone = this._maskTone  
            if (tone) {
                this.mask.setColorTone(tone)
                this._maskTone = null
            }
            var scale = this._maskScale  
            if (scale &&
                (this.mask.iscale != scale || this.mask.i2widht != this.width ||
                    this.mask.i2height != this.heigth) &&
                (this.mask.width && this.mask.height)) {
                this.mask.iwidth = 1 / this.mask.width
                this.mask.iheight = 1 / this.mask.height
                this.mask.i2widht = this.width
                this.mask.i2height = this.height
                this.mask.scale.x = this.mask.iwidth * this.width * scale
                this.mask.scale.y = this.mask.iheight * this.height * scale
                this.mask.iscale = scale
            }
            var pos = this._maskPos 
            if (pos) {
                this.mask.x = pos[0]
                this.mask.y = pos[1]
                this._maskPos = null
            }
        }
    }


    /**
     * 设置遮罩图片
     * sprite.maskPicture(  name, scale, pos)
     * @param {string} name 遮罩名称 放在img的pictures文件夹中的图片
     * @param {number} scale 遮罩比例
     * @param {[number,number]} pos 遮罩位置[x,y]
     */
    Sprite.prototype.maskPicture = function (name, scale, pos) { 
        this._maskName = name;
        this._maskScale = scale 
        this._maskPos =  pos || [0, 0]
    };

    /**
     * 改变id图片遮罩色调
     * sprite.maskPictureTone(tone, duration, baseTone)
     * @param {[number,number,number,number]} tone 目标色调
     * @param {number,} duration 持续时间
     * @param {[number,number,number,number]} baseTone 基础色调
     */
    Sprite.prototype.maskPictureTone = function (tone, duration, baseTone) { 
        this.tintMask(tone, duration, baseTone);
    };


    /**
     * 遮罩色调
     * @param {[number,number,number,number]} tone 目标色调
     * @param {number,} duration 持续时间
     * @param {[number,number,number,number]} baseTone 基础色调
     */
    Sprite.prototype.tintMask = function (tone, duration, baseTone) {
        this._maskToneTarget = (tone ? tone.clone() : this._maskToneBase) || [0, 0, 0, 0];
        this._maskToneDuration = duration;
        this._maskToneBase = (baseTone ? baseTone.clone() : this._maskToneBase) || [0, 0, 0, 0]
        if (!this._maskToneDuration) {
            this._maskToneDuration = 0
            this._maskToneBase = this._maskTone = this._maskToneTarget;
        } else {
            if (this._maskToneBase) {
                this._maskTone = this._maskToneBase;
            }
        }
    };

    Sprite.prototype.updateMaskTone = function () {
        if (this._maskToneDuration > 0) {
            var d = this._maskToneDuration;
            for (var i = 0; i < 4; i++) {
                this._maskToneBase[i] = (this._maskToneBase[i] * (d - 1) + this._maskToneTarget[i]) / d;
            }
            this._maskToneDuration--;
            this._maskTone = this._maskToneBase
        }
    };
})()