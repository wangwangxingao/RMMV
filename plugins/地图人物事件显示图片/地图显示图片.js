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
 * 当 前面有 t/ 时 为绘制文字 ,后面跟 [长,宽,文字]
 * 当前面有 f/ 时为 图片 ,后面跟 [脸图名,索引]
 * 实例 
 *  
 *  $gameMap.event(1).picture().show('t/[1000,100,"s546tsa156tsfssgdffa asffads \\nat"]',0, 0, 0, 100, 100, 255, 0  )  
 *  
 * 
 */



Game_Picture.prototype.update = function() {
    //更新移动
    this.updateMove();
    //更新色调
    this.updateTone();
    //更新旋转
    this.updateRotation();
    this.updateNext()
};


Game_Picture.prototype.updateNext = function() {
    if (this._duration <= 0 && this._toneDuration <= 0 && this._rotationDuration <= 0) {
        //console.log("next")
        this.nextMethod()
    }
};



Game_Picture.prototype.nextMethod = function() {
    if (this._methods) {
        var method = this._methods[this._methodsIndex];
        //如果 方法 名称 并且 方法 名称 存在 
        if (method && method.name && this[method.name]) {
            // 方法 名称 应用 方法 参数
            this[method.name].apply(this, method.params);
        }
        this._methodsIndex += 1
        if (this._methodsre && this._methods.length <= this._methodsIndex) {
            this._methodsIndex = 0
        }
    }
};



Game_Picture.prototype.setParentSet = function() {
    this._p
};





Game_Picture.prototype.move = function(origin, x, y, scaleX, scaleY,
    opacity, blendMode, duration) {

    if ((duration||0) <= 0) {
        //原点 = 原点
        this._origin = origin;
        //x = x 
        this._x = x;
        //y = y 
        this._y = y;
        //比例x = 比例x 
        this._scaleX = scaleX;
        //比例y = 比例y
        this._scaleY = scaleY;
        //不透明度 = 不透明度
        this._opacity = opacity;
        //混合模式 = 混合模式
        this._blendMode = blendMode;
    } else {
        //原点 = 原点
        this._origin = origin;
        //目标x = x 
        this._targetX = x;
        //目标y = y 
        this._targetY = y;
        //目标比例x = 比例x 
        this._targetScaleX = scaleX;
        //目标比例y = 比例y
        this._targetScaleY = scaleY;
        //目标不透明度 = 不透明度
        this._targetOpacity = opacity;
        //混合模式 = 混合模式
        this._blendMode = blendMode;
        //持续时间 = 持续时间
        this._duration = duration;
    }
};


/**初始化旋转*/
Game_Picture.prototype.initRotation = function() {
    this._angle = 0;
    this._rotationSpeed = 0;
    this._rotationTarget = 0;
    this._rotationDuration = 0
};


/**
 * 更新旋转
 */
Game_Picture.prototype.updateRotation = function() {
    if (this._rotationSpeed !== 0) {
        this._angle += this._rotationSpeed / 2;
    }
    if (this._rotationDuration > 0) {
        var d = this._rotationDuration;
        this._angle = (this._angle * (d - 1) + this._rotationTarget) / d;
        this._rotationDuration--;
    }
};


/**
 * 旋转到
 * @param {number} rotation 角度 
 * @param {number} duration 持续时间 ,0时为立刻
 * 
 */
Game_Picture.prototype.rotateTo = function(rotation, duration) {
    this._rotationTarget = rotation || 0;
    this._rotationDuration = duration || 0;
    if (this._rotationDuration <= 0) {
        this._angle = this._rotationTarget
    }
};


/**
 * 设置原点
 * @param {number|[number,number]|{x:number,y:number}}origin 原点
 * 
 */
Game_Picture.prototype.setOrigin = function(origin) {
    this._origin = origin || 0
};




/**
 * 设置原点
 * @param {number|[number,number]|{x:number,y:number}}origin 原点
 * 
 */
Game_Picture.prototype.setParentOrigin = function(origin) {
    this._parentOrigin = origin
};



/**
 * 设置方法
 * @param {[{name: string, params: []} ]}list 方法
 * @param {boolean} re 返回
 * 
 */
Game_Picture.prototype.setMethod = function(list, re) {
    this._methods = list || []
    this._methodsIndex = 0
    this._methodsre = re
};


/**
 * 设置索引
 * @param {number }index 索引
 * 
 */
Game_Picture.prototype.setMethodIndex = function(index) {
    this._methodsIndex = index
};

/**
 * 设置方法返回
 * @param {boolean} re 返回
 * 
 */
Game_Picture.prototype.setMethodRe = function(re) {
    this._methodsre = re
};

Game_Picture.prototype.pushMethod = function(methodName) {
    if (!this._methods) { this.setMethod() }
    //方法参数 = 数组 切割 呼叫 (参数,1)
    var methodArgs = Array.prototype.slice.call(arguments, 1);
    //方法组 添加 ( {名称:方法名称 ,参数:方法参数} )
    this._methods.push({ name: methodName, params: methodArgs });
}


/**
 *
 * Game_CharacterBase
 * 
 * */



var _Game_CharacterBase_prototype_initMembers = Game_CharacterBase.prototype.initMembers
Game_CharacterBase.prototype.initMembers = function() {
    _Game_CharacterBase_prototype_initMembers.call(this)
    this._pictures = {}
}



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

    this.updatePictures() /** */
};



Game_CharacterBase.prototype.picture = function(pictureId) {
    return this._pictures[pictureId]
};





/**更新图片*/
Game_CharacterBase.prototype.updatePictures = function() {
    if (this._pictures) {
        for (var n in this._pictures) {
            var picture = this._pictures[n]
            if (picture) {
                //图片 更新
                picture.update();
            }
        }
        /*  //图片组 对每一个 (方法 图片)
                this._pictures.forEach(function(picture) {  //如果 图片 
                    if (picture) {  //图片 更新
                        picture.update();
                    }
                });*/
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
Game_CharacterBase.prototype.showPicture = function(pictureId, name, origin, x, y,
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
Game_CharacterBase.prototype.movePicture = function(pictureId, origin, x, y, scaleX,
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
Game_CharacterBase.prototype.rotatePicture = function(pictureId, speed) {
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
Game_CharacterBase.prototype.tintPicture = function(pictureId, tone, duration) {
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
Game_CharacterBase.prototype.erasePicture = function(pictureId) {
    //真实图片id = 真实图片id(图片id)
    var realPictureId = this.picture(pictureId)
        //图片组[真实图片id] = null
    this._pictures[realPictureId] = null;
};



Game_CharacterBase.prototype.setPictureParentOrigin = function(pictureId, origin) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setParentOrigin(origin);
    }
};

/**
 * 设置图片
 * 
 * @param {number} pictureId 图片id
 * @param {number|[number,number]|{x:number,y:number}}origin 原点
 * 
 */
Game_CharacterBase.prototype.setPictureOrigin = function(pictureId, origin) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setOrigin(origin);
    }
};



Game_CharacterBase.prototype.setMethodPicture = function(pictureId, list, re) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setMethod(list, re);
    }
};


Game_CharacterBase.prototype.setMethodRePicture = function(pictureId, re) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setMethodRe(re);
    }
};

Game_CharacterBase.prototype.setMethodIndexPicture = function(pictureId, index) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setMethodIndex(index);
    }
};



Game_CharacterBase.prototype.pushMethodPicture = function(pictureId) {
    var picture = this.picture(pictureId);
    if (picture) {
        var methodArgs = Array.prototype.slice.call(arguments, 1);
        picture.pushMethod.apply(picture, methodArgs);
    }
};






/**
 * 旋转图片到
 * 
 * @param {number} pictureId 图片id
 * @param {number} rotation 角度 
 * @param {number} duration 持续时间 ,0时为立刻
 * 
 */

Game_Screen.prototype.rotatePictureTo = function(pictureId, rotation, duration) {
    //图片 = 图片(图片id)
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        //图片 旋转(速度)
        picture.rotateTo(rotation, duration);
    }
};


Game_Screen.prototype.setPictureParentOrigin = function(pictureId, origin) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setParentOrigin(origin);
    }
};

/**
 * 设置图片
 * 
 * @param {number} pictureId 图片id
 * @param {number|[number,number]|{x:number,y:number}}origin 原点
 * 
 */
Game_Screen.prototype.setPictureOrigin = function(pictureId, origin) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setOrigin(origin);
    }
};




Game_Screen.prototype.setMethodPicture = function(pictureId, list, re) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setMethod(list, re);
    }
};


Game_Screen.prototype.setMethodRePicture = function(pictureId, re) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setMethodRe(re);
    }
};

Game_Screen.prototype.setMethodIndexPicture = function(pictureId, index) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setMethodIndex(index);
    }
};



Game_Screen.prototype.pushMethodPicture = function(pictureId) {
    var picture = this.picture(pictureId);
    if (picture) {
        var methodArgs = Array.prototype.slice.call(arguments, 1);
        picture.pushMethod.apply(picture, methodArgs);
    }
};



Sprite_Picture.prototype.loadBitmap = function() {
    if(this._window){
        this.removeChild(this._window)
        delete this._window 
    }
    if (this._pictureName.indexOf("m/") == 0) {
        var json = this._pictureName.slice(2)
        if (json) {
            var list = JSON.parse(json)
            var w = list[0] || 0
            var h = list[1] || 0
            var text = list[2] || ""
            var wb = new Window_Message(0, 0, w, h)
            wb.drawTextEx(text, 0, 0) 
            this._window = wb
            this.addChild(this._window)
            this.bitmap = new Bitmap(w, h)
        } else {
            this.bitmap = new Bitmap()
        }
    }else if (this._pictureName.indexOf("w/") == 0) {
        var json = this._pictureName.slice(2)
        if (json) {
            var list = JSON.parse(json)
            var w = list[0] || 0
            var h = list[1] || 0
            var text = list[2] || ""
            var wb = new Window_Base(0, 0, w, h)
            wb.drawTextEx(text, 0, 0) 
            this._window = wb
            this.addChild(this._window)
            this.bitmap = new Bitmap(w, h)
        } else {
            this.bitmap = new Bitmap()
        }
    }else if (this._pictureName.indexOf("t/") == 0) {
        var json = this._pictureName.slice(2)
        if (json) {
            var list = JSON.parse(json)
            var w = list[0] || 0
            var h = list[1] || 0
            var text = list[2] || ""
            var wb = new Window_Base(0, 0, 1, 1)
            wb.contents = new Bitmap(w, h)
            wb.drawTextEx(text, 0, 0)
            this.bitmap = wb.contents
                ///wb.contents = new Bitmap(0, 0)
            wb = null
        } else {
            this.bitmap = new Bitmap()
        }
    } else if (this._pictureName.indexOf("f/") == 0) {
        var json = this._pictureName.slice(2)
        if (json) {
            var list = JSON.parse(json)
            var faceName = list[0] || ""
            var faceIndex = list[1] || 0
            this.bitmap = ImageManager.loadFace(faceName);
            var that = this
            this.bitmap.addLoadListener(
                function() {
                    var pw = Window_Base._faceWidth;
                    var ph = Window_Base._faceHeight;
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


Sprite_Picture.prototype.updatePosition = function() {
    var picture = this.picture();
    var x = picture.x()
    var y = picture.y()
    var ox = 0
    var oy = 0
    var po = picture._parentOrigin
    if (po) {
        var ox = po[0]
        var oy = po[1]
    }
    var x = x - (this.parent ? this.parent.width * ox : 0)
    var y = y - (this.parent ? this.parent.height * oy : 0)
    this.x = Math.floor(x);
    this.y = Math.floor(y);
};




/**更新原点 */
Sprite_Picture.prototype.updateOrigin = function() {
    var picture = this.picture();
    var origin = picture.origin()
    var t = typeof(origin)
    if (t == "object") {

    } else if (t == "number") {
        var list = [
            [0, 0],
            [0.5, 0.5],
            [1, 1],
            [0, 0.5],
            [1, 0.5],
            [0.5, 0],
            [0.5, 1],
            [1, 0],
            [0, 1]
        ]
        var origin = list[origin] || [0, 0]
    } else {
        var origin = [0, 0]
    }
    this.anchor.x = origin.x || origin[0] || 0;
    this.anchor.y = origin.y || origin[1] || 0;
};





function Sprite_WindowPicture() {
    this.initialize.apply(this, arguments);
}


/**设置原形  */
Sprite_WindowPicture.prototype = Object.create(Sprite_Picture.prototype);
/**设置创造者 */
Sprite_WindowPicture.prototype.constructor = Sprite_WindowPicture;

Sprite_WindowPicture.prototype.initialize = function(pictureId, screen) {
    this.setScreen(screen)
    Sprite_Picture.prototype.initialize.call(this, pictureId);

};

Sprite_WindowPicture.prototype.setScreen = function(screen) {
    this._screen = screen
};


Sprite_WindowPicture.prototype.screen = function() {
    return this._screen

};
Sprite_WindowPicture.prototype.picture = function() {
    return this.screen() && this.screen().picture && this.screen().picture(this._pictureId);
};




var Sprite_Character_prototype_update = Sprite_Character.prototype.update
Sprite_Character.prototype.update = function() {
    Sprite_Character_prototype_update.call(this)
    this.updatePictures()
}

Sprite_Character.prototype.updatePictures = function() {
    if (this._character) {
        if (!this._pictures) { this._pictures = {} }
        var del = []
        var ps = this._character._pictures
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
        if (this._character._changeZindex) {
            this._character._changeZindex = false
            this.sortPicture()
        }
    }
}




Sprite_Character.prototype.sortPicture = function() {
    this.children.sort(function(a, b) {
        var az = a._zIndex || 0
        var bz = b._zIndex || 0
        if (az == bz) {
            return a.spriteId - b.spriteId
        } else {
            return az - bz
        }
    })
}





Sprite_Character.prototype.addPicture = function(n) {
    this._pictures[n] = new Sprite_WindowPicture(n, this._character)
    this.addChild(this._pictures[n])
}


Sprite_Character.prototype.delPicture = function(n) {
    this.removeChild(this._pictures[n])
    delete this._pictures[n]
}