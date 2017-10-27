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






Game_CharacterBase.prototype.update = function() {
    if (this.isStopping()) {
        this.updateStop();
    }
    if (this.isJumping()) {
        this.updateJump();
    } else if (this.isMoving()) {
        this.updateMove();
    }
    this.updateAnimation();

    this.updatePicture() /** */
};

Game_CharacterBase.prototype.updatePicture = function() {
    if (!this._picture) {
        this._picture = new Game_Picture()
    }
    if (this._picture) {
        this._picture.update();
    }
};



Game_CharacterBase.prototype.picture = function() {
    return this._picture;
};


Sprite_Character.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this.updateBitmap();
    this.updateFrame();
    this.updatePosition();
    this.updateAnimation();
    this.updateBalloon();

    this.updatePicture() /** */

    this.updateOther();
};



Sprite_Character.prototype.updatePicture = function() {
    if (!this._picture) {
        this._picture = new Sprite_PictureUp(this._character)
        this.addChild(this._picture)
        console.log(this._character, this, this._picture)
    }
    if (this._picture._pictureCharacter != this._character) {
        this._picture._pictureCharacter = this._character
    }
}


function Sprite_PictureUp() {
    this.initialize.apply(this, arguments);
}

Sprite_PictureUp.prototype = Object.create(Sprite_Picture.prototype);
Sprite_PictureUp.prototype.constructor = Sprite_PictureUp;

Sprite_PictureUp.prototype.initialize = function(character) {
    this._pictureCharacter = character;
    Sprite_Picture.prototype.initialize.call(this);

};

Sprite_PictureUp.prototype.picture = function() {
    return this._pictureCharacter && this._pictureCharacter.picture();
};

Sprite_PictureUp.prototype.loadBitmap = function() {
    if (this._pictureName) {
        if (this._pictureName.indexOf("pictures/") == 0) {
            var name = this._pictureName.slice(9)
            this.bitmap = ImageManager.loadPicture(name);
        } else {
            if (this._pictureName.indexOf("text/") == 0) {
                var json = this._pictureName.slice(5)
                if (json) {
                    var list = JSON.parse(json)
                } else {
                    var list = [0, 0, ""]
                }
            } else {
                var list = [200, 100, this._pictureName]
            }
            var w = list[0] || 0
            var h = list[1] || 0
            var text = list[2] || ""
            var wb = new Window_Base(0, 0, 1, 1)
            wb.contents = new Bitmap(w, h)
            wb.drawTextEx(text, 0, 0)
            this.bitmap = wb.contents
            wb.contents = new Bitmap(0, 0)
            wb = null
        }
    } else {
        this.bitmap = ImageManager.loadPicture(this._pictureName);
    }
};