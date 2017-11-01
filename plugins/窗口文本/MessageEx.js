//=============================================================================
// MessageEx.js
//=============================================================================

/*:
 * @plugindesc 显示文本加强
 * @author 汪汪
 * 
 * @param  MessageEx 
 * @desc  显示文本加强
 * @default 汪汪, 
 * 
 * @help  
 * 使用 \PRT 时需要 PictureRotateTo.js
 * 
 *  需要在 [[ ]] 中输入参数 , 字符串的参数需要加 ""
 *  \MOVE[[x,y,w,h,c]]  移动窗口到xy,wh值为大小,c为是否清楚之前内容
 *  \BS[[visible]]   背景是否显示  visible 为 true或false ,
 *  \PS[[pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode]]   显示图片
 *  \PM[[pictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, duration]]  移动图片
 *  \PR[[pictureId, speed]] 旋转图片(速度)
 *  \PRT[[pictureId, rotation, duration]] 旋转图片到(角度) 
 *  \PT[[pictureId, tone, duration]]  设置色调
 *  \PE[[pictureId]]  消除图片
 *  \PZ[[pictureId,zindex]] 设置图片高度  <0为在窗口下面
 *  \TXY[[x,y]] 下一个字符的xy坐标 
 * 
 * 
 */








Window_Base.prototype.processEscapeCharacter = function(code, textState) {
    //检查 参数
    switch (code) {
        //当 "C"
        case 'C':
            //改变文本颜色( 文本颜色 ( 获得转换参数(文本状态) ))
            this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));
            break;
            //当 "I"
        case 'I':
            //处理绘制图标(  获得转换参数(文本状态) 文本状态)
            this.processDrawIcon(this.obtainEscapeParam(textState), textState);
            break;
            //
        case '{':
            this.makeFontBigger();
            break;
        case '}':
            this.makeFontSmaller();
            break;
        case 'MOVE':
            this.makeMove(this.obtainEscapeParamEx(textState), textState);
            break;
        case 'BS':
            this.makeBackShow(this.obtainEscapeParamEx(textState), textState);
            break;
        case 'PS':
            this.showPicture(this.obtainEscapeParamEx(textState), textState);
            break;
        case 'PM':
            this.movePicture(this.obtainEscapeParamEx(textState), textState);
            break;
        case 'PR':
            this.rotatePicture(this.obtainEscapeParamEx(textState), textState);
            break;
        case 'PRT':
            this.rotatePictureTo(this.obtainEscapeParamEx(textState), textState);
            break;

        case 'PT':
            this.tintPicture(this.obtainEscapeParamEx(textState), textState);
            break;
        case 'PE':
            this.erasePicture(this.obtainEscapeParamEx(textState), textState);
            break;
        case 'PZ':
            this.zindexPicture(this.obtainEscapeParamEx(textState), textState);
            break;
        case 'TXY':
            this.textXY(this.obtainEscapeParamEx(textState), textState);
            break;
    }

};


Window_Base.prototype.obtainEscapeParamEx = function(textState) {
    var arr = /^\[\[(.*?)\]\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        var re = "[" + arr[1] + "]"

        return JSON.parse(re)
    }
    return arr;
};


Window_Base.prototype.makeMove = function(list, textState) {
    var x = list[0]
    var y = list[1]
    var w = list[2]
    var h = list[3]
    var c = list[4]

    var b0 = this.contents
    var b = new Bitmap(w, h)
    if (!c) {
        b.blt(b0, 0, 0, b0.width, b0.height, 0, 0)
    }
    if (w && h) {
        this.move(x, y, w, h)
        this.contents = b
    } else {
        this.x = x
        this.y = y
        if (c) {
            this.contents = b
        }
    }

};



Window_Base.prototype.makeBackShow = function(list, textState) {
    this._windowSpriteContainer.visible = (list[0]) ? true : false
};



/**更新图片*/
Window_Base.prototype.picture = function(index, picture) {
    if (picture) {
        if (picture == "null") {
            picture = null
        }
        if (!this._pictures) {
            this._pictures = {}
            this._picturesSprite = {}
            this._picturesZindex = {}
        }
        if (picture) {
            this._pictures[index] = picture
            if (!this._picturesSprite[index]) {
                this._picturesSprite[index] = new Sprite_WindowPicture(index)

            }
            var s = this._picturesSprite[index]
            s.setScreen(this)
            s._zIndex = this._picturesZindex[index] || 0
            var c = this.children
            var l = c.length
            for (var i = 0; i < l; i++) {
                if (s._zIndex < (c[i]._zIndex || 0)) {
                    break
                }
            }
            this.addChildAt(s, i)
        } else {
            if (this._picturesSprite[index]) {
                this.removeChild(this._picturesSprite[index])
                delete this._picturesSprite[index]
            }
            delete this._pictures[index]
            delete this._picturesZindex[index]
        }
    } else {
        if (this._pictures) {
            return this._pictures[index]
        } else {
            return null
        }
    }
};


Window_Base.prototype.pictureZindex = function(index, zindex) {
    if (!this._pictures) {
        this._pictures = {}
        this._picturesSprite = {}
        this._picturesZindex = {}
    }
    if (this._picturesZindex[index] != zindex) {
        this._picturesZindex[index] = zindex
        var s = this._picturesSprite[index]
        if (s) {
            this.removeChild(s)
            s._zIndex = this._picturesZindex[index] || 0
            var c = this.children
            var l = c.length
            for (var i = 0; i < l; i++) {
                if (s._zIndex < (c[i]._zIndex || 0)) {
                    break
                }
            }
            this.addChildAt(s, i)
        }
    }
};


/**更新图片*/
Window_Base.prototype.updatePictures = function() {
    if (this._pictures) {
        //图片组 对每一个 (方法 图片)
        this._pictures.forEach(function(picture) {
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
 */
Window_Base.prototype.showPicture = function(list) {
    var pictureId = list[0]
    var name = list[1]
    var origin = list[2]
    var x = list[3]
    var y = list[4]
    var scaleX = list[5]
    var scaleY = list[6]
    var opacity = list[7]
    var blendMode = list[8]
    var picture = new Game_Picture();
    picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
    this.picture(pictureId, picture);
};

Window_Base.prototype.zindexPicture = function(list) {
    var pictureId = list[0]
    var zindex = list[1]
    this.pictureZindex(pictureId, zindex)
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
Window_Base.prototype.movePicture = function(list) {
    var pictureId = list[0]
    var origin = list[1]
    var x = list[2]
    var y = list[5]
    var scaleX = list[4]
    var scaleY = list[5]
    var opacity = list[6]
    var blendMode = list[7]
    var duration = list[8]
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration);
    }
};
/**旋转图片
 * @param {number} pictureId 图片id
 * @param {number} speed 速度
 * 
 */
Window_Base.prototype.rotatePicture = function(list) {
    var pictureId = list[0]
    var speed = list[1]
    var picture = this.picture(pictureId);
    if (picture) {
        picture.rotate(speed);
    }
};
/**着色图片
 * @param {number} pictureId 图片id
 * @param {[number,number,number,number]} tone 色调
 * @param {number}  duration 持续时间
 * 
 */
Window_Base.prototype.tintPicture = function(list) {

    var pictureId = list[0]
    var tone = list[1]
    var duration = list[2]
    var picture = this.picture(pictureId);
    if (picture) {
        picture.tint(tone, duration);
    }
};
/**抹去图片
 * @param {number} pictureId 图片id
 * */
Window_Base.prototype.erasePicture = function(list) {
    var pictureId = list[0]
    this.picture(pictureId, "null");
};



Window_Base.prototype.rotatePictureTo = function(pictureId, rotation, duration) {

    var pictureId = list[0]
    var rotation = list[1]
    var duration = list[2]
        //图片 = 图片(图片id)
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        //图片 旋转(速度)
        picture.rotateTo(rotation, duration);
    }
};


/**更新图片*/
Window_Base.prototype.textXY = function(list, textState) {
    textState.x = list[0]
    textState.y = list[1]

};




function Sprite_WindowPicture() {
    this.initialize.apply(this, arguments);
}



/**设置原形  */
Sprite_WindowPicture.prototype = Object.create(Sprite_Picture.prototype);
/**设置创造者 */
Sprite_WindowPicture.prototype.constructor = Sprite_WindowPicture;




Sprite_WindowPicture.prototype.setScreen = function(screen) {
    this._screen = screen
};


Sprite_WindowPicture.prototype.screen = function() {
    return this._screen

};
Sprite_WindowPicture.prototype.picture = function() {
    return this.screen() && this.screen().picture && this.screen().picture(this._pictureId);
};


Sprite_Picture.prototype.loadBitmap = function() {
    if (this._pictureName.indexOf("text/") == 0) {
        var json = this._pictureName.slice(7)
        if (json) {
            var list = JSON.parse(json)
            var w = list[0] || 0
            var h = list[1] || 0
            var text = list[2] || ""
            var wb = new Window_Base(0, 0, 1, 1)
            wb.contents = new Bitmap(w, h)
            wb.drawTextEx(text, 0, 0)
            this.bitmap = wb.contents
            wb.contents = new Bitmap(0, 0)
            wb = null
        } else {
            this.bitmap = new Bitmap()
        }
    } else {
        this.bitmap = ImageManager.loadPicture(this._pictureName);
    }
}