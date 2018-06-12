//=============================================================================
//  2w_ScreenPictureUp.js
//=============================================================================

/*:
 * @plugindesc  
 * 2w_ScreenPictureUp , 显示图片增强,破解图片最大限制
 * @author wangwang
 *   
 * @param  2w_ScreenPictureUp
 * @desc 插件 显示图片/文字 ,作者:汪汪
 * @default 汪汪
 * 
 * 
 * @help
 *   
 * 
 * 举例
 * 
 * 
 * $gameScreen.setInputCommand("cs",2)
 * 把元素"cs" 绑定2号事件(在选中cs时,按下enter键会调用2号公共事件)
 * 
 * 定义 "mapout" "mapin"
 * $gameScreen.setInputCommand("mapout",2)
 * 把 "mapout" 绑定 2号公共事件
 * 当离开地图(转化地图,移动场景时),可以强制运行 2号公共事件
 * 
 * $gameScreen.setInputCommand("mapin",3)
 * 把 "mapin" 绑定 3号公共事件 
 * 当进入地图(转化地图,移动场景进入地图时),可以强制运行3号公共事件 
 * 以上两种情况,不支持再次调用公共事件,不支持暂停等,如果要调用公共事件,可以使用  Scene_Map.runInterpreter(公共事件id)
 * 用于清空处理,进入地图
 *  
 * 
 * 
 * $gameScreen.setPictureCommand(1,2,1)
 * 把图片1绑定2号公共事件,不检查位图是否空白
 * 
 * 
 * $gameScreen.showPicture(1,"x/[100,100]",0,0,0,100,100,255,0)
 * 把图片1作为信息框,大小为 100 * 100 (默认隐藏状态)
 * 
 * 注意"" 和 '' 
 * 'xb/["图片名",消息框x坐标,消息y坐标,宽,高]'
 * 'tb/["图片名",文本框x坐标,文本框y坐标,宽,高,文本内容]'
 * 
 * $gameScreen.hidePictureXinXi(1) 
 * 图片1的信息框隐藏(如果有的话)
 * 
 * $gameScreen.showPictureXinXi(1,1) 
 * 图片1的信息框显示隐藏(参数为：图片ID ， 1是显示 0 是隐藏)
 * 
 * $gameScreen.pushPictureXinXi(1 ,"消息") 
 * 图片1的信息框添加一条内容,为 "消息"
 * 
 * $gameScreen.addPictureXinXiEnd(1 , -3 ) 
 * 图片1的信息框内的显示移动 -3 行(向上移动3行)
 * 
 * $gameScreen.clearPictureXinXi(1) 
 * 图片1的信息框清空内容
 *  
 * $gameScreen.showPicture(1,"t/[100,100]",0,0,0,100,100,255,0)
 * 把图片1作为文本框,大小为 100 * 100 
 *   
 * $gameScreen.hidePictureText(1) 
 * 图片1的文本框隐藏(如果有的话)
 * 
 * 
 * $gameScreen.showPictureText(1) 
 * 图片1的文本框显示(如果有的话)
 *   
 * $gameScreen.setPictureText(1,"消息") 
 * 图片1的文本框内的文本设置为 "消息"
 *  
 *  
 * 
 * $gameScreen.showPictureText(1) 
 * 图片1的文本框显示(如果有的话)
 *   
 * $gameScreen.setPictureText(1,"消息") 
 * 图片1的文本框内的文本设置为 "消息"
 * 
 * 
 * 
 * $gameScreen.clearPictureChouMa(1,2) 
 * 对于图片1 , 清除子图 2
 *  
 * $gameScreen.clearPictureAllChouMa(1) 
 * 对于图片1 , 清除所有子图 
 * 
 * $gameScreen.showPictureChouMa(1,2,"1",0,0,100,100, 80  ,50) 
 * 对于图片1 ,设置一个子图2 ,名称为 "3" , 初始位置为 0 ,0 目标位置100,100,比例 80% ,持续时间50帧 
 * 对于子图,其在设置公共事件时的索引 为  父图 + "-" + 子图 
 * 也就是 图片1 数字的子图 2 其应用 "1-2" 表示 
 *   
 * 
 *   
 * 显示图片
 * .showPicture(pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode) 
 * 移动图片
 * .movePicture (pictureId, origin, x, y, scaleX,scaleY, opacity, blendMode, duration)
 * 着色图片
 * .tintPicture  (pictureId, tone, duration)
 * 抹去图片
 * .erasePicture  (pictureId)
 * 
 * 
 * 设置图片位置种类
 * .setPicturePositionType (pictureId, positionType)
 *      positionType 为数组 ,[type,id,pw,ph,tw,th,dx,dy]
 *      type 种类,
 *            0 父类精灵 , 
 *            1 地图图块位置, id参数为图块坐标,数组[x,y]
 *            2 地图像素位置, id参数为真实位置(即图块坐标*图块大小),数组[x,y]
 *            3 事件位置,id小于等于0为角色及随从
 *            5 队伍成员,id为队伍中的位置
 *            6 角色id,  id 为角色id
 *            7 敌人id(暂无)
 *            8 画面位置 id  0为一个像素, 1为整个画面
 *      id   id参数  如果不能确定存在,那么会自动隐藏
 *      pw   位于以上确定精灵的宽的比例
 *      ph   位于以上确定精灵的高的比例 
 *      tw   位于本精灵的宽的比例
 *      th   位于本精灵的高的比例
 *      dx   偏移x 
 *      dy   偏移y
 *      
 *      最终位置为(type ,id 确定的精灵为p)
 *       x = p的x + pw * p的宽 - 本精灵的宽 * tw + dx  
 *       y = p的y + ph * p的高 - 本精灵的高 * th + dy  
 * 
 * 
 * 设置图片方法组
 * .setPictureMethod(pictureId, list, re)
 * 
 *  list为数组 
 *  [{name:方法名,params:[参数,参数,参数]},{name:方法名,params:[参数,参数,参数]}]
 *  re 播放完后是否重新开始
 *  对于有等待的图片操作,会等待完后进行下一个方法,
 *  如 
 *  让1号图片在 0 ,100 到 100 , 100 之间来回移动
 *  .setPictureMethod(1, [{name:"move",params:[0,0 , 100,100,100,255,0,100]},{name:"movePicture",params:[0,100,100,100,100,255,0,100]}],true)
 *  让1号图片在 0 ,100 到 100 , 100 之间来回移动
 * 
 *  
 * 
 * 当name中 前面有 t/ 时 为绘制文字 ,后面跟 [长,宽,文字]
 * 当name中 前面有 w/ 时 为绘制窗口 ,后面跟[ 长,宽,文字]
 * 
 * 当name中 前面有 f/ 时为 图片 ,后面跟 [脸图名,索引]
 * 
 *  
 * 
 */

var ww = ww || {}

ww._ScreenPictureUp = {}




Game_Screen.prototype.updatePictures = function () {
    if (this._pictures) {
        for (var i in this._pictures) {
            var picture = this._pictures[i]
            if (picture) {
                //图片 更新
                picture.update();
            }
        }
    }
};


Game_Screen.prototype.clearPictures = function () {
    this._delpictures = this._delpictures || {}
    if (!this._pictures) {
        this._pictures = {}
    } else {
        for (var i in this._pictures) {
            this._delpictures[i] = true
        }
        this._pictures = {}
    }
    this._uppictures = {}
    this._addpictures = {}
};


Game_Screen.prototype.delPicture = function (id) {
    delete this._addpictures[id]
    this._delpictures[id] = true
};

Game_Screen.prototype.addPicture = function (id) {
    this._addpictures[id] = true
    delete this._delpictures[id]
};


Game_Screen.prototype.eraseBattlePictures = function () {
    // this._pictures = this._pictures.slice(0, this.maxPictures() + 1);
};


Game_Screen.prototype.picture = function (pictureId) {
    return this._pictures[pictureId];
};

Game_Screen.prototype.showPicture = function (pictureId, name, origin, x, y,
    scaleX, scaleY, opacity, blendMode) {

    var picture = new Game_Picture();
    picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
    this._pictures[pictureId] = picture;
    this.addPicture(pictureId)
    picture._textshowing = true
};

Game_Screen.prototype.movePicture = function (pictureId, origin, x, y, scaleX,
    scaleY, opacity, blendMode, duration) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration);
    }
};

Game_Screen.prototype.rotatePicture = function (pictureId, speed) {
    //图片 = 图片(图片id)
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        //图片 旋转(速度)
        picture.rotate(speed);
    }
};

Game_Screen.prototype.tintPicture = function (pictureId, tone, duration) {
    //图片 = 图片(图片id)
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        //图片 着色 (色调 ,持续时间)
        picture.tint(tone, duration);
    }
};

Game_Screen.prototype.erasePicture = function (pictureId) {
    delete this._pictures[pictureId];
    this.delPicture(pictureId)
};



Game_Screen.prototype.pictureCommand = function (pictureId) {
    return this._pictureCommands && this._pictureCommands[pictureId]
};


Game_Screen.prototype.pictureTouchType = function (pictureId) {
    return this._pictureTouchTypes && this._pictureTouchTypes[pictureId]
};


Game_Screen.prototype.setPictureCommand = function (pictureId, ci, type) {
    if (!this._pictureCommands) {
        this._pictureCommands = {}
    }
    if (!this._pictureTouchTypes) {
        this._pictureTouchTypes = {}
    }
    this._pictureCommands[pictureId] = ci || 0
    this._pictureTouchTypes[pictureId] = type || 0
};



Game_Screen.prototype.inputCommand = function (inputId) {
    return this._inputCommands && this._inputCommands[inputId]
};


Game_Screen.prototype.setInputCommand = function (inputId, ci) {
    if (!this._inputCommands) {
        this._inputCommands = {}
    }
    this._inputCommands[inputId] = ci || 0
};



/**
 * 旋转图片到
 * 
 * @param {number} pictureId 图片id
 * @param {number} rotation 角度 
 * @param {number} duration 持续时间 ,0时为立刻
 * 
 */

Game_Screen.prototype.rotatePictureTo = function (pictureId, rotation, duration) {
    //图片 = 图片(图片id)
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        //图片 旋转(速度)
        picture.rotateTo(rotation, duration);
    }
};


/**设置图片位置种类 */
Game_Screen.prototype.setPicturePositionType = function (pictureId, positionType) {
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        //图片 旋转(速度)
        picture.setPositionType(positionType);
    }
};




Game_Screen.prototype.hidePictureXinXi = function (pictureId) {
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        //图片 旋转(速度)
        picture.hideXinXi();
    }
};

Game_Screen.prototype.showPictureXinXi = function (pictureId, aid) {
    var picture = this.picture(pictureId);
    if (picture) {
        if (aid == 1) {
            picture.showXinXi();
        }
        else {
            picture.hideXinXi();
        }
    }
};

Game_Screen.prototype.hidePictureText = function (pictureId) {
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        //图片 旋转(速度)
        picture.hideText();
    }
};

Game_Screen.prototype.showPictureText = function (pictureId) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.showText();
    }
};


Game_Screen.prototype.clearPictureXinXi = function (pictureId) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.clearXinXi();
    }
};


Game_Screen.prototype.setPictureText = function (pictureId, text) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setText(text);
    }
};

Game_Screen.prototype.pushPictureXinXi = function (pictureId, text, type) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.pushXinXi(text, type);
    }
};

Game_Screen.prototype.addPictureXinXiEnd = function (pictureId, v) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.addXinXiEnd(v);
    }
};





Game_Screen.prototype.clearPictureChouMa = function (pictureId, i) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.clearChouMa(i);
    }
};

Game_Screen.prototype.clearPictureAllChouMa = function (pictureId) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.clearAllChouMa();
    }
};

Game_Screen.prototype.showPictureChouMa = function (pictureId, i, name, x, y, x2, y2, scale, d) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.showChouMa(i, name, x, y, x2, y2, scale, d);
    }
};


/**
 * 设置图片
 * 
 * @param {number} pictureId 图片id
 * @param {number|[number,number]|{x:number,y:number}}origin 原点
 * 
 */
Game_Screen.prototype.setPictureOrigin = function (pictureId, origin) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setOrigin(origin);
    }
};




Game_Screen.prototype.setPictureMethod = function (pictureId, list, re) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setMethod(list, re);
    }
};


Game_Screen.prototype.setPictureMethodRe = function (pictureId, re) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setMethodRe(re);
    }
};

Game_Screen.prototype.setPictureMethodIndex = function (pictureId, index) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.setMethodIndex(index);
    }
};



Game_Screen.prototype.pushPictureMethod = function (pictureId) {
    var picture = this.picture(pictureId);
    if (picture) {
        var methodArgs = Array.prototype.slice.call(arguments, 1);
        picture.pushMethod.apply(picture, methodArgs);
    }
};



ww._ScreenPictureUp._Game_Picture_prototype_initialize = Game_Picture.prototype.initialize
Game_Picture.prototype.initialize = function () {
    ww._ScreenPictureUp._Game_Picture_prototype_initialize.call(this)

    this.clearOther()

};




ww._ScreenPictureUp._Game_Picture_prototype_erase = Game_Picture.prototype.erase
Game_Picture.prototype.erase = function () {
    ww._ScreenPictureUp._Game_Picture_prototype_erase.call(this)

    this.clearOther()
};



Game_Picture.prototype.clearOther = function () {
    this.clearText()
    this.clearXinXi()
    this.clearPictures()
};




Game_Picture.prototype.clearText = function () {
    this._textall = ""
    this._textmustre = true
    this._textshowing = false
};


Game_Picture.prototype.clearXinXi = function () {
    this._xinxiall = []
    this._xinxiopindex = 0
    this._xinxiend = 0
    this._xinximustre = false
    this._xinxishowing = false
    this._xinxiclear = true
};



Game_Picture.prototype.setText = function (text) {
    this._textall = "" + text
    this._textmustre = true
};

/**显示文本 */
Game_Picture.prototype.showText = function () {
    this._textshowing = true
};

/**隐藏文本 */
Game_Picture.prototype.hideText = function () {
    this._textshowing = false
};

/**添加信息 */
Game_Picture.prototype.pushXinXi = function (list, type) {
    this._xinxiopindex = this._xinxiall.length - 1
    if (Array.isArray(list)) {
        for (var i = 0; i < list.length; i++) {
            var m = list[i]
            if (type) {
                this._xinxiall.unshift("" + m)
            } else {
                this._xinxiall.push("" + m)
            }
        }
    } else {
        if (type) {
            this._xinxiall.unshift("" + list)
        } else {
            this._xinxiall.push("" + list)
        }
    }
    if (type) {
        this._xinxiend = 0
    } else {
        this._xinxiend = this._xinxiall.length - 1
    }
    this._xinximustre = true
};



Game_Picture.prototype.addXinXiEnd = function (v) {
    this._xinxiend += v
    this._xinxiend.clamp(0, this._xinxiall.length - 1)
    this._xinximustre = true
};


Game_Picture.prototype.hideXinXi = function () {
    this._xinxishowing = false
};


Game_Picture.prototype.showXinXi = function () {
    this._xinxishowing = true
};




Game_Picture.prototype.clearPictures = function () {
    this._delpictures = this._delpictures || {}
    if (!this._pictures) {
        this._pictures = {}
    } else {
        for (var i in this._pictures) {
            this._delpictures[i] = true
        }
        this._pictures = {}
    }
    this._uppictures = {}
    this._addpictures = {}
    this._chouma = 0
};


Game_Picture.prototype.delPicture = function (id) {
    delete this._addpictures[id]
    this._delpictures[id] = true
};

Game_Picture.prototype.addPicture = function (id) {
    this._addpictures[id] = true
    delete this._delpictures[id]
};

Game_Picture.prototype.showChouMa = function (i, name, x, y, x2, y2, scale, d) {
    var picture = new Game_Picture()
    picture.show(name, 0, x, y, scale, scale, 255, 0)
    picture.move(0, x2, y2, scale, scale, 255, 0, d)

    picture._zIndex = this._chouma++
    if (!this._pictures) {
        this._pictures = {}
    }
    this._pictures[i] = picture
    this.addPicture(i)
};

Game_Picture.prototype.clearChouMa = function (i) {
    if (!this._pictures) {
        this._pictures = {}
    }
    delete this._pictures[i]
    this.delPicture(i)
};


Game_Picture.prototype.clearAllChouMa = function (i) {
    this.clearPictures()
};





ww._ScreenPictureUp._Game_Picture_prototype_update = Game_Picture.prototype.update
Game_Picture.prototype.update = function () {
    ww._ScreenPictureUp._Game_Picture_prototype_update.call(this)
    this.updateOther()
};



Game_Picture.prototype.updateOther = function () {
    //this.updateNext()
    this.updatePictures()
};


Game_Picture.prototype.updatePictures = function () {
    if (this._pictures) {
        for (var i in this._pictures) {
            var picture = this._pictures[i]
            if (picture) {
                //图片 更新
                picture.update();
            }
        }
    }
};


/**更新下一个 */
Game_Picture.prototype.updateNext = function () {
    if (this._duration <= 0 && this._toneDuration <= 0 && this._rotationDuration <= 0) {
        this.nextMethod()
    }
};


/**下一个方法 */
Game_Picture.prototype.nextMethod = function () {
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

/**设置位置种类 */
Game_Picture.prototype.positionType = function () {
    return this._positionType
};

/**设置位置种类 */
Game_Picture.prototype.setPositionType = function (positionType) {
    this._positionType = positionType
};


/**移动到 */
Game_Picture.prototype.move = function (origin, x, y, scaleX, scaleY,
    opacity, blendMode, duration) {

    if ((duration || 0) <= 0) {
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
        //持续时间 = 持续时间
        this._duration = 0;
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
Game_Picture.prototype.initRotation = function () {
    this._angle = 0;
    this._rotationSpeed = 0;
    this._rotationTarget = 0;
    this._rotationDuration = 0
};


/**
 * 更新旋转
 */
Game_Picture.prototype.updateRotation = function () {
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
Game_Picture.prototype.rotateTo = function (rotation, duration) {
    this._rotationTarget = rotation || 0;
    this._rotationDuration = duration || 0;
    if (this._rotationDuration <= 0) {
        this._angle = this._rotationTarget
    }
};





/**
 * 设置方法
 * @param {[{name: string, params: []} ]}list 方法
 * @param {boolean} re 返回
 * 
 */
Game_Picture.prototype.setMethod = function (list, re) {
    this._methods = list || []
    this._methodsIndex = 0
    this._methodsre = re
};


/**
 * 设置索引
 * @param {number }index 索引
 * 
 */
Game_Picture.prototype.setMethodIndex = function (index) {
    this._methodsIndex = index
};

/**
 * 设置方法返回
 * @param {boolean} re 返回
 * 
 */
Game_Picture.prototype.setMethodRe = function (re) {
    this._methodsre = re
};


/**
 * 添加方法
 * @param {string} methodName
 * @param {} params
 */
Game_Picture.prototype.pushMethod = function (methodName) {
    if (!this._methods) { this.setMethod() }
    //方法参数 = 数组 切割 呼叫 (参数,1)
    var methodArgs = Array.prototype.slice.call(arguments, 1);
    //方法组 添加 ( {名称:方法名称 ,参数:方法参数} )
    this._methods.push({ name: methodName, params: methodArgs });
}





Sprite_Picture.prototype.updateBitmap = function () {
    var picture = this.picture();
    if (picture) {
        var pictureName = picture.name();
        if (this._pictureName !== pictureName) {
            this._pictureName = pictureName;
            this.loadBitmap();
        }
        this.visible = true;
    } else {
        this._pictureName = '';
        this.bitmap = null;
        this.visible = false;
        if (this._window) {
            this.removeChild(this._window)
            delete this._window
        }
    }
};







Sprite_Picture.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    if (this.visible) {
        this.updateOrigin();
        this.updatePosition();
        this.updateScale();
        this.updateTone();
        this.updateOther();

        this.updateTouch()
    }
};


Sprite_Picture.prototype.updateTouch = function () {
    if (this.opacity && TouchInput.isTriggered()) {
        var pictureId = this.pictureWorldId()
        var ci = $gameScreen.pictureCommand(pictureId)
        if (ci && this.isTouchThis(TouchInput.x, TouchInput.y, $gameScreen.pictureTouchType(pictureId), 1)) {
            $gameTemp.reserveCommonEvent(ci)
            $gameMap._pictureTouch = false
        }
    }
};


Scene_Map.prototype.update = function () {
    $gameMap._pictureTouch = true
    //更新主要增加()
    this.updateMainMultiply();

    if (Graphics._isElement(document.activeElement)) {
        if (Input.isTriggered("ok")) {
            var id = document.activeElement.id
            var ci = $gameScreen.inputCommand(id)
            if (ci) {
                $gameTemp.reserveCommonEvent(ci)
            }
        }
        $gameMap._pictureTouch = false
    }
    //如果( 是场景改变确定())
    if (this.isSceneChangeOk() && $gameMap._pictureTouch) {
        //更新场景()
        this.updateScene();
        //否则 如果( 场景管理器 是下一个场景(场景战斗))
    } else if (SceneManager.isNextScene(Scene_Battle)) {
        //更新遭遇效果()
        this.updateEncounterEffect();
    }
    //更新等待计数()
    this.updateWaitCount();
    //场景基础 更新 呼叫(this)
    Scene_Base.prototype.update.call(this);
    //更新目的地()
    this.updateDestination();
};



ww._ScreenPictureUp.Scene_Map_prototype_terminate = Scene_Map.prototype.terminate
Scene_Map.prototype.terminate = function () {
    var id = $gameScreen.inputCommand("mapout")
    Scene_Map.runInterpreter(id)
    ww._ScreenPictureUp.Scene_Map_prototype_terminate.call(this)
};
ww._ScreenPictureUp.Scene_Map_prototype_start = Scene_Map.prototype.start

Scene_Map.prototype.start = function () { 
    ww._ScreenPictureUp.Scene_Map_prototype_start.call(this);
    var id = $gameScreen.inputCommand("mapin")
    Scene_Map.runInterpreter(id)

};


Scene_Map.runInterpreter = function (id) {
    if (id && $dataCommonEvents[id]) {
        var interpreter = new Game_Interpreter();
        interpreter.setup($dataCommonEvents[id].list);
        while (interpreter.isRunning()) {
            if (!interpreter.executeCommand()) {
                break;
            }
            if (interpreter.checkFreeze()) {
                break;
            }
        }
    }
}




Scene_Map.prototype.isMapTouchOk = function () {
    //返回 是活动() 并且 游戏游戏者 能移动()
    return this.isActive() && $gamePlayer.canMove() && $gameMap._pictureTouch;
};




Sprite_Picture.prototype.pictureWorldId = function () {
    return (this.parent && this.parent.pictureWorldId) ? this.parent.pictureWorldId() + "-" + this._pictureId : this._pictureId
};





Sprite_Picture.prototype.loadBitmap = function () {
    if (this._window) {
        this.removeChild(this._window)
        delete this._window
    }
    if (this._pictureName.indexOf("xb/") == 0) {
        var json = this._pictureName.slice(3)
        if (json) {
            var list = JSON.parse(json)
            var name = list[0] || ""
            var x = list[1] || 0
            var y = list[2] || 0
            var w = list[3] || 0
            var h = list[4] || 0
        } else {
            var name = ""
            var x = 0
            var y = 0
            var w = 100
            var h = 30
        }
        var wb = new Sprite_XinXi(w, h, this)
        this._window = wb
        this.addChild(this._window)

        this._window.x = x
        this._window.y = y
        this.bitmap = ImageManager.loadPicture(name)
    } else if (this._pictureName.indexOf("tb/") == 0) {
        var json = this._pictureName.slice(3)
        if (json) {
            var list = JSON.parse(json)
            var name = list[0] || ""
            var x = list[1] || 0
            var y = list[2] || 0
            var w = list[3] || 0
            var h = list[4] || 0
            var text = list[5] || ""
        } else {
            var name = ""
            var x = 0
            var y = 0
            var w = 100
            var h = 30
            var text = ""
        }
        if (text) {
            var picture = this.picture()
            picture._textshowing = true
            picture._textmustre = picture._textall ? true : false
        }
        var wb = new Sprite_UIStringText(w, h, "" + text, this)
        this._window = wb
        this.addChild(this._window)
        this._window.x = x
        this._window.y = y

        this.bitmap = ImageManager.loadPicture(name)
    } else if (this._pictureName.indexOf("x/") == 0) {
        var json = this._pictureName.slice(2)
        if (json) {
            var list = JSON.parse(json)
            var w = list[0] || 0
            var h = list[1] || 0
        } else {
            var w = 300
            var h = 300
        }
        var wb = new Sprite_XinXi(w, h, this)
        this._window = wb
        this.addChild(this._window)
        this.bitmap = new Bitmap(w, h)
    } else if (this._pictureName.indexOf("t/") == 0) {
        var json = this._pictureName.slice(2)
        if (json) {
            var list = JSON.parse(json)
            var w = list[0] || 0
            var h = list[1] || 0
            var text = list[2] || ""
        } else {
            var w = 100
            var h = 30
            var text = ""
        }
        var wb = new Sprite_UIStringText(w, h, "" + text, this)
        this._window = wb
        this.addChild(this._window)
        this.bitmap = new Bitmap(w, h)
    } else if (this._pictureName.indexOf("m/") == 0) {
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
    } else if (this._pictureName.indexOf("w/") == 0) {
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
    } else if (this._pictureName.indexOf("f/") == 0) {
        var json = this._pictureName.slice(2)
        if (json) {
            var list = JSON.parse(json)
            var faceName = list[0] || ""
            var faceIndex = list[1] || 0
            this.bitmap = ImageManager.loadFace(faceName);
            var that = this
            this.bitmap.addLoadListener(
                function () {
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


Sprite_Picture.prototype.updatePosition = function () {
    var picture = this.picture();
    //var bxy = this.getPosition(picture)
    var x = picture.x()
    var y = picture.y()
    this.x = Math.floor(x) //bxy[0] + x);
    this.y = Math.floor(y) //Math.floor(bxy[1] + y);
};





function Sprite_MorePicture() {
    this.initialize.apply(this, arguments);
}


/**设置原形  */
Sprite_MorePicture.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_MorePicture.prototype.constructor = Sprite_MorePicture;

Sprite_MorePicture.prototype.initialize = function (screen) {
    Sprite.prototype.initialize.call(this);
    this.setScreen(screen)
};
Sprite_MorePicture.prototype.setScreen = function (screen) {
    this._screen = screen
};


Sprite_MorePicture.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updatePictures()
}

Sprite_MorePicture.prototype.updatePictures = function () {
    if (this._screen) {
        if (!this._pictures) { this._pictures = {} }
        var ps = this._screen._pictures || {}
        var del = this._screen._delpictures || {}
        var add = this._screen._addpictures || {}
        var change = false
        //添加的图片
        for (var n in add) {
            if (ps[n] && !this._pictures[n]) {
                change = true
                this.addPicture(n, this._screen)
            }
        }
        //删除的图片
        var ps2 = this._pictures
        for (var n in del) {
            if (ps2[n]) {
                this.delPicture(n)
            }
        }
        if (change) {
            this.sortPicture()
        }

        this._screen._delpictures = {}
        this._screen._addpictures = {}
    }
}




Sprite_MorePicture.prototype.sortPicture = function () {
    this.children.sort(function (a, b) {
        var az = a._zIndex || 0
        var bz = b._zIndex || 0
        if (az == bz) {
            var ai = (a._pictureId || 0) * 1
            var bi = (b._pictureId || 0) * 1
            if (ai == bi) {
                return a.spriteId - b.spriteId
            } else {
                return ai - bi
            }
        } else {
            return az - bz
        }
    })
}





Sprite_MorePicture.prototype.addPicture = function (n, screen) {
    this._pictures[n] = new Sprite_WindowPicture(n, screen)
    this.addChild(this._pictures[n])
}


Sprite_MorePicture.prototype.delPicture = function (n) {
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
    this._isPicture = false
};

Sprite_WindowPicture.prototype.setScreen = function (screen) {
    this._screen = screen
};


Sprite_WindowPicture.prototype.screen = function () {
    return this._screen
};



Sprite_WindowPicture.prototype.picture = function () {
    return this._screen && this._screen._pictures && this._screen._pictures[this._pictureId];
};




Sprite_WindowPicture.prototype.update = function () {
    Sprite_Picture.prototype.update.call(this);
    this.updatePictures()
}

Sprite_WindowPicture.prototype.updatePictures = function () {
    var picture = this.picture()
    if (picture) {
        if (!this._pictures) { this._pictures = {} }
        var ps = picture._pictures || {}
        var del = picture._delpictures || {}
        var add = picture._addpictures || {}
        var change = false
        //添加的图片
        for (var n in add) {
            if (ps[n] && !this._pictures[n]) {
                change = true
                this.addPicture(n, picture)
            }
        }
        //删除的图片
        var ps2 = this._pictures
        for (var n in del) {
            if (ps2[n]) {
                this.delPicture(n)
            }
        }
        if (change) {
            // this.sortPicture()
        }
        picture._delpictures = {}
        picture._addpictures = {}
    }

}




Sprite_WindowPicture.prototype.sortPicture = function () {
    this.children.sort(function (a, b) {
        var az = a._zIndex || 0
        var bz = b._zIndex || 0
        if (az == bz) {
            var ai = (a._pictureId || 0) * 1
            var bi = (b._pictureId || 0) * 1
            if (ai == bi) {
                return a.spriteId - b.spriteId
            } else {
                return ai - bi
            }
        } else {
            return az - bz
        }
    })
}





Sprite_WindowPicture.prototype.addPicture = function (n, screen) {
    this._pictures[n] = new Sprite_WindowPicture(n, screen)
    this.addChild(this._pictures[n])
}


Sprite_WindowPicture.prototype.delPicture = function (n) {
    this.removeChild(this._pictures[n])
    delete this._pictures[n]
}






Spriteset_Base.prototype.createPictures = function () {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var x = (Graphics.width - width) / 2;
    var y = (Graphics.height - height) / 2;
    this._pictureContainer = new Sprite_MorePicture($gameScreen);
    this._pictureContainer.setFrame(x, y, width, height);
    this.addChild(this._pictureContainer);
};




