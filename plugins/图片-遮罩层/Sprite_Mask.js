//=============================================================================
// spriteMask.js
//=============================================================================
/*:
 * @plugindesc 图片遮罩
 * @author 汪汪
 *
 * @param spriteMask
 * @desc 图片遮罩
 * @default 汪汪
 *
 * @help
 * 
 * 设置遮罩图片
 * $gameScreen.maskPicture(pictureId, name, scale, pos)
 * @param {number} pictureId 图片id 
 * @param {string} name 遮罩名称 放在img的pictures文件夹中的图片
 * @param {number} scale 遮罩比例
 * @param {[number,number]} pos 遮罩位置[x,y]
 * 
 * 
 * 改变id图片遮罩色调
 * $gameScreen.maskPictureTone(pictureId,tone, duration, baseTone)
 * @param {number} pictureId 图片id
 * @param {[number,number,number,number]} tone 目标色调
 * @param {number,} duration 持续时间
 * @param {[number,number,number,number]} baseTone 基础色调 不设置为[0,0,0,0]
 * 
 * 
 */



(function () {


    var ww = ww || {}

    ww.spriteMask = {} 


    ww.spriteMask.Sprite_Picture_prototype_update = Sprite_Picture.prototype.update
    Sprite_Picture.prototype.update = function () {
        ww.spriteMask.Sprite_Picture_prototype_update.call(this);
        if (this.visible) {
            this.updateMask();
        }
    };

    Sprite_Picture.prototype.setMask = function (s) {
        if (this.mask) {
            this.removeChild(this.mask)
        }
        this.mask = s
        if (this.mask) {
            this.addChild(this.mask)
        }
    }

    Sprite_Picture.prototype.updateMask = function () {
        var maskname = this.picture() ? this.picture()._maskName : ""
        if (maskname != this._maskName) {
            this._maskName = maskname
            if (this._maskName) {
                this.setMask(new Sprite(ImageManager.loadPicture(this._maskName)))
            } else {
                this.setMask(null)
            }
        }
        if (this.mask) {
            var tone = this.picture() ? this.picture()._maskTone : null
            if (tone) {
                this.mask.setColorTone(tone)
                this.picture()._maskTone = null
            }
            var scale = this.picture() ? this.picture()._maskScale : null
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

        }
        var pos = this.picture() ? this.picture()._maskPos : null
        if (pos) {
            this.mask.x = pos[0]
            this.mask.y = pos[1]
            this.picture()._maskPos = null
        }

    }


    /**
     * 设置遮罩图片
     * $gameScreen.maskPicture(pictureId, name, scale, pos)
     * @param {number} pictureId 图片id
     * @param {string} name 遮罩名称 放在img的pictures文件夹中的图片
     * @param {number} scale 遮罩比例
     * @param {[number,number]} pos 遮罩位置[x,y]
     */
    Game_Screen.prototype.maskPicture = function (pictureId, name, scale, pos) {
        var picture = this.picture(pictureId);
        if (picture) {
            picture._maskName = name;
            picture._maskScale = scale
            picture._maskPosBase = pos || [0, 0]
            picture._maskPos = picture._maskPosBase

        }
    };

    /**
     * 改变id图片遮罩色调
     * $gameScreen.maskPictureTone(pictureId,tone, duration, baseTone)
     * @param {number} pictureId 图片id
     * @param {[number,number,number,number]} tone 目标色调
     * @param {number,} duration 持续时间
     * @param {[number,number,number,number]} baseTone 基础色调
     */
    Game_Screen.prototype.maskPictureTone = function (pictureId, tone, duration, baseTone) {
        var picture = this.picture(pictureId);
        if (picture) {
            picture.tintMask(tone, duration, baseTone);
        }
    };


    /**
     * 遮罩色调
     * @param {[number,number,number,number]} tone 目标色调
     * @param {number,} duration 持续时间
     * @param {[number,number,number,number]} baseTone 基础色调
     */
    Game_Picture.prototype.tintMask = function (tone, duration, baseTone) {
        this._maskToneTarget = tone.clone();
        this._maskToneDuration = duration;
        this._maskToneBase = (baseTone ? baseTone.clone() : this._maskToneBase) || [0, 0, 0, 0]
        if (!this._maskToneDuration) {
            this._maskToneDuration = 0
            this._maskTone = this._maskToneTarget;
        } else {
            if (this._maskToneBase) {
                this._maskTone = this._maskToneBase;
            }
        }
    };


    ww.spriteMask.Game_Picture_prototype_update = Game_Picture.prototype.update
    Game_Picture.prototype.update = function () {
        ww.spriteMask.Game_Picture_prototype_update.call(this)
        this.updateMask()
    };



    Game_Picture.prototype.updateMask = function () {
        this.updateMaskTone()
    };

    Game_Picture.prototype.updateMaskTone = function () {
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