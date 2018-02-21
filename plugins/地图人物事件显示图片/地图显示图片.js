//=============================================================================
//  CharacterPictureUp.js
//=============================================================================

/*:
 * @plugindesc  
 * CharacterPictureUp ,人物显示图片/文字
 * @author wangwang
 *   
 * @param  CharacterPictureUp
 * @desc 插件 人物显示图片/文字 ,作者:汪汪
 * @default 汪汪
 * 
 * 
 * @help
 * 
 * 获取插件数据
 * 获取人物/事件的picture  
 * 获取事件(1号) : 
 * $gameMap.event(1).picture() 
 * 控制人物的
 * $gamePlayer.picture()
 * 跟随人物的
 * $gamePlayer.followers().follower(1).picture()
 * 
 * 
 * 图片显示
 * picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode)  
 * picture.move(origin, x, y, scaleX, scaleY,opacity, blendMode, duration) 
 * picture.rotate(speed)
 * picture.tint(tone, duration)  
 * picture.erase()
 * 
 * 当 前面有 text/ 时 为绘制文字 ,后面跟 [长,宽,文字]
 * 当前面有 pictures/ 时为 图片 ,后面跟 图片名
 * 实例 
 *  
 *  $gameMap.event(1).picture().show('text/[1000,100,"s546tsa156tsfssgdffa asffads \\nat"]',0, 0, 0, 100, 100, 255, 0  )  
 *  
 * 
 */

var _Game_CharacterBase_prototype_initMembers = Game_CharacterBase.prototype.initMembers
Game_CharacterBase.prototype.initMembers = function () {
    _Game_CharacterBase_prototype_initMembers.call(this)
    this._pictures = {}
}



Game_CharacterBase.prototype.update = function () {
    if (this.isStopping()) {
        this.updateStop();
    }
    if (this.isJumping()) {
        this.updateJump();
    } else if (this.isMoving()) {
        this.updateMove();
    }
    this.updateAnimation();

    this.updatePictures() /** */
};






/**更新图片*/
Game_CharacterBase.prototype.updatePictures = function () {
    if (this._pictures) {
        //图片组 对每一个 (方法 图片)
        this._pictures.forEach(function (picture) {
            //如果 图片 
            if (picture) {
                //图片 更新
                picture.update();
            }
        });
    }
};



/**显示图片
 * @param {number} pictureId 图片id
 * @param {number} origin 原点
 * @param {number} x x
 * @param {number} y y
 * @param {number} scaleX 比例x
 * @param {number} scaleY 比例y
 * @param {number} opacity 不透明度
 * @param {number} blendMode 混合模式 
 * @param {number} duration 持续时间 
 */
Game_CharacterBase.prototype.showPicture = function (pictureId, name, origin, x, y,
    scaleX, scaleY, opacity, blendMode) {
    //真实图片id = 真实图片id(图片id)
    var pictureId = pictureId;
    //图片 = 新 游戏图片
    var picture = new Game_Picture();
    //图片 显示(名称,原点,x,y,比例x,比例y,不透明度,混合方式)
    picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
    //图片组[真实图片id] = 图片
    this._pictures[pictureId] = picture;
};
/**移动图片
 * @param {number} pictureId 图片id
 * @param {number} origin 原点
 * @param {number} x x
 * @param {number} y y
 * @param {number} scaleX 比例x
 * @param {number} scaleY 比例y
 * @param {number} opacity 不透明度
 * @param {number} blendMode 混合模式 
 * @param {number} duration 持续时间 
 */
Game_CharacterBase.prototype.movePicture = function (pictureId, origin, x, y, scaleX,
    scaleY, opacity, blendMode, duration) {
    //图片 = 图片(图片id)
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        //图片 移动  (原点,x,y,比例x,比例y,不透明度,混合方式,持续时间)
        picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration);
    }
};
/**旋转图片
 * @param {number} pictureId 图片id
 * @param {number} speed 速度
 * 
 */
Game_CharacterBase.prototype.rotatePicture = function (pictureId, speed) {
    //图片 = 图片(图片id)
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        //图片 旋转(速度)
        picture.rotate(speed);
    }
};
/**着色图片
 * @param {number} pictureId 图片id
 * @param {[number,number,number,number]} tone 色调
 * @param {number}  duration 持续时间
 * 
 */
Game_CharacterBase.prototype.tintPicture = function (pictureId, tone, duration) {
    //图片 = 图片(图片id)
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        //图片 着色 (色调 ,持续时间)
        picture.tint(tone, duration);
    }
};
/**抹去图片
 * @param {number} pictureId 图片id
 * */
Game_CharacterBase.prototype.erasePicture = function (pictureId) {
    //真实图片id = 真实图片id(图片id)
    var realPictureId = this.picture(pictureId)
    //图片组[真实图片id] = null
    this._pictures[realPictureId] = null;
};




Sprite_Character.prototype.updatePicture = function () {
    if (this._screen) {
        if (!this._pictures) { this._pictures = {} }
        var del = []
        var ps = this._screen._pictures
        if (ps) {
            for (var n in ps) {
                if (!this._pictures[n]) {
                    this.addPicture(n)
                }
            }
        }
        var ps2 = this._pictures
        for (var n in ps2) {
            if (!ps[n]) {
                this.delPicture(n)
            }
        }
    }
}


Sprite_Character.prototype.updatePicture = function () {
    if (this._screen) {
        if (!this._pictures) { this._pictures = {} }
        var del = []
        var ps = this._screen._pictures
        if (ps) {
            for (var n in ps) {
                if (!this._pictures[n]) {
                    this.addPicture(n)
                }
            }
        }
        var ps2 = this._pictures
        for (var n in ps2) {
            if (!ps[n]) {
                this.delPicture(n)
            }
        }
        if (this._screen._changeZindex) {
            this._screen._changeZindex = false
            this.sortPicture()
        }
    }
}




Sprite_Character.prototype.sortPicture = function () {
    this.children.sort(function (a, b) {
        var az = a._zIndex || 0
        var bz = b._zIndex || 0
        if (az == bz) {
            return a.spriteId - b.spriteId
        } else {
            return az - bz
        }
    })
}





Sprite_Character.prototype.addPicture = function (n) {
    this._pictures[n] = new Sprite_WindowPicture(n,this._screen)
    this.addChild(this._pictures[n])
}

 
Sprite_Character.prototype.delPicture = function (n) { 
    this.removeChild(this._pictures[n])
    delete this._pictures[n]
}



 
function Sprite_WindowPicture() {
    this.initialize.apply(this, arguments);
}


/**设置原形  */
Sprite_WindowPicture.prototype = Object.create(Sprite_Picture.prototype);
/**设置创造者 */
Sprite_WindowPicture.prototype.constructor = Sprite_WindowPicture;

Sprite_WindowPicture.prototype.initialize = function (pictureId, screen) {
    this.setScreen(screen)
    Sprite_Picture.prototype.initialize.call(this, pictureId);

};
Sprite_WindowPicture.prototype.setScreen = function (screen) {
    this._screen = screen
};


Sprite_WindowPicture.prototype.screen = function () {
    return this._screen

};
Sprite_WindowPicture.prototype.picture = function () {
    return this.screen() && this.screen().picture && this.screen().picture(this._pictureId);
};


Sprite_Picture.prototype.loadBitmap = function () {
    if (this._pictureName.indexOf("text/") == 0) {
        var json = this._pictureName.slice(5)
        if (json) {
            var list = JSON.parse("[" + json + "]")
            var w = list[0] || 0
            var h = list[1] || 0
            var text = list[2] || ""
            var wb = new Game_CharacterBase(0, 0, 1, 1)
            wb.contents = new Bitmap(w, h)
            wb.drawTextEx(text, 0, 0)
            this.bitmap = wb.contents
            wb.contents = new Bitmap(0, 0)
            wb = null
        } else {
            this.bitmap = new Bitmap()
        }
    } else if (this._pictureName.indexOf("face/") == 0) {
        var json = this._pictureName.slice(5)
        if (json) {
            var list = JSON.parse("[" + json + "]")
            var faceName = list[0] || ""
            var faceIndex = list[1] || 0
            this.bitmap = ImageManager.loadFace(faceName);
            var that = this
            this.bitmap.addLoadListener(
                function () {
                    var pw = Game_CharacterBase._faceWidth;
                    var ph = Game_CharacterBase._faceHeight;
                    var sw = pw
                    var sh = ph
                    var sx = faceIndex % 4 * pw + (pw - sw) / 2;
                    var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
                    that.setFrame(sx, sy, sw, sh);
                }
            )
        } else {
            this.bitmap = new Bitmap()
        }
    } else {
        this.bitmap = ImageManager.loadPicture(this._pictureName);
    }
}





Sprite_Picture.prototype.updateOrigin = function () {
    var picture = this.picture();
    var o = picture.origin()
    if (Array.isArray(o)) {
        this.anchor.x = o[0];
        this.anchor.y = o[1];
    } else {
        if (picture.origin() === 0) {
            this.anchor.x = 0;
            this.anchor.y = 0;
        } else {
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
        }
    }
};


Sprite_WindowPicture.prototype.updateOrigin = function () {
    var picture = this.picture();
    var o = picture.origin()
    if (Array.isArray(o)) {
        this.anchor.x = o[0];
        this.anchor.y = o[1];
    } else {
        if (o > 0 && o < 10) {
            var x = ((o - 1) % 3) * 0.5
            var y = 1 - Math.floor((o - 1) / 3) * 0.5
            this.anchor.x = x;
            this.anchor.y = y;
        } else {
            this.anchor.x = 0;
            this.anchor.y = 0;
        }
    }
};