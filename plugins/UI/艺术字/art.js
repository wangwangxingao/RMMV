//=============================================================================
// ArtWord.js
//=============================================================================

/*:
 * @plugindesc 显示文本加强
 * @author 汪汪
 * @version 2.0
 * 
 * @help 
 *  
 * \. \|  : 扩展  \.[z] 和 \|[z] 方法  等待z
 * \{ \}  : 扩展  支持\{[z]  \}[z] 增加减少字号  \{}[z] 设置字号
 * \C : 扩展 支持 \C[#FFFF00]
 * \Y : 一个新页  支持 \Y 和 \Y[n] 设置位置 ,
 *       0 最上面
 *       1 中间
 *       2 最下面
 *       会重置图片,间隔时间,字体,脸图等
 *       n为 3 4 5 6 7 8 时 有多个参数  \Y[n id xc yc ixc iyc xd yd]
 *       3 时id  跟随者序号 操作的本人为 0  
 *       4 时id  事件的编号 没有时优先选择本事件,然后没有本事件时选择操作者 
 *       5 时id  队伍成员编号 
 *       6 时id  角色编号 
 *       7 时id  敌群中敌人序号 
 *       8 时id  为屏幕位置种类 ( 0 时 [0,0,1,1] 1时 [0,0,屏幕,屏幕] )
 *       12 时 为2时的位置,但只显示1行
 *       11 时 为1时的位置,但只显示1行
 *       10 时 为0时的位置,但只显示1行
 * 
 *       窗口显示位置 为   
 *       选择的图片为 cx,cy,cw,ch 
 *       本窗口为 ix,iy,iw,ih
 *       x =  cx + xc * cw - ixc * iw  + xd     
 *       y =  cy + yc * ch - iyc * ih  + yd     
 *       简单来说 yc xc 为0 为 目标图片的左(上)端 0.5为中间, 1 为右(下)端
 *       ixc iyc 相当于本窗口的锚点 0 为 本窗口的左(上)端 0.5为中间, 1 为右(下)端
 *       最后结果是  本窗口锚点与目标点重合 
 *       然后 xd yd 为相对移动的距离
 *       未设置时  yc,xc ixc,iyc 的默认值为 0.5 , yd xd 为 0 
 *       也就是 窗口的中间 会和 目标的中间  对齐 
 *       
 *       位置为靠近边缘时可自动调整但不能保证效果
 * \WH[w h] :设置当前绘制页的大小
 * \T[n name index] :
 *    在message 下显示name的图片, index为编号,当不设置时为0,同一编号图片会相互替代 
 *    n 位置: 锚点 图片的 123456789顶点 坐标 message的 123456789顶点
 *            当 小于10 时 锚点 坐标 都为 n   比如 1 ,  图片以左下角正对信息框的左下角 
 *            当 大于10 时 前面为 锚点 后面为坐标  如 12 表示 以左下顶点为锚点 坐标为 message的下顶点 
 * \S[n] :设置每个字符之间间隔的时间,换页重置
 * \F[n name index] :
 *      在message 下显示name index的脸图, n位置 1 左 2 右
 * \=  \=[z] 
 *     设置粗体 , 0 为 false  , 1 为true ,不填值为取现值的相反值
 * \/  \/[z] 
 *     设置斜体 , 0 为 false  , 1 为true ,不填值为取现值的相反值
 *  
 * \NY   
 *     添加一个和上页相同设置的新页 
 * \OC[color]
 *     设置外围线条颜色 
 * \OW[number]
 *     设置外围线条粗细 
 * 
 * \WT[z] 
 *     设置本页的横向排列位置 , 不填为 0左对齐,   1 中间,2右对齐
 * \HT[z] 
 *     设置本页纵向排列位置 , 不填为 0 上对齐,  1 中间,2 下对齐
 * 
 * \AW[z] 
 *     设置本页是否根据内容调整宽, 不填为 0  不调整 1 调整
 * \AH[z] 
 *     设置本页是否根据内容调整高, 不填为 0  不调整 1 调整
 * 
 * \WH[wnum hnum] 
 *     强行设置本页大小 (不推荐使用ing)
 *  
 * \TWH[wnum hnum] 
 *     添加一个wh的文字
 * 
 *  
 * \WJ  \WJ[z] 
 *     设置横字间隔 , 不填为 0
 * \HJ  \HJ[z] 
 *     设置纵行间隔 , 不填为 0
 *  
 * 支持多个图片同时显示,移动,消失,旋转 
 * 并且可以控制图片的z值 实现相互遮盖 高度大的遮盖小的,相同时后的遮盖前的
 * 窗口的z值为0
 *  
 *  以下需要在 [[ ]] 中输入参数 , 字符串的参数需要加 "" 其中参数有连续 ]] 的 这样的请用 ] ]
 *  \BS[[visible]]   背景的显示  visible 为 true或false ,
 *  \PS[[pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode]]   显示图片
 *  \PM[[pictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, duration]]  移动图片
 *  \PR[[pictureId, speed]] 旋转图片(速度)
 *  \PRT[[pictureId, rotation, duration]] 旋转图片到(角度)  ///这个还不支持
 *  \PT[[pictureId, tone, duration]]  设置色调
 *  \PE[[pictureId]]  消除图片
 *  \PEA[[pictureId]]  全部清除图片
 *  \PES[[pictureId]]  避免一次清除图片
 *  \PZ[[pictureId,zindex]] 设置图片z值高度  <0 为在窗口下面 
 *  \FF[[z]] 设置字体名称  z为字符串 如: "黑体"
 *  \FS[[z]] 设置字体字号  z为数值
 *  \FC[[z]] 设置字体颜色  z为字符串 如: "#ffffff"
 *  \FB[[z]] 修改字体粗体  z为 true 或 false
 *  \FI[[z]] 修改字体斜体  z为 true 或 false
 *  \FR[[z]] 重设字体到默认
 *  \FFR[[z]] 设置字体名称到默认
 *  \FSR[[z]] 设置字体字号到默认
 *  \FCR[[z]] 设置字体颜色到默认
 *  
 * 
 * 
 */




Bitmap.prototype._drawTextOutline = function (text, tx, ty, maxWidth) {
    if (!this.outlineWidth) { return }
    //环境 = 环境
    var context = this._context;
    //环境 笔触模式 = 
    context.strokeStyle = this.outlineColor;
    //环境 
    context.lineWidth = this.outlineWidth;
    context.lineJoin = 'round';
    context.strokeText(text, tx, ty, maxWidth);
};


Bitmap.prototype._makeFontNameText = function () {
    //黑体 + 斜体 + 大小 + 字体
    return (this.fontBold ? "Bold " : '') + (this.fontItalic ? 'Italic ' : '') +
        this.fontSize + 'px ' + this.fontFace;
};


function ArtWord() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
//ArtWord.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
ArtWord.prototype.constructor = ArtWord;

ArtWord.deepCopy = function (that) {
    var obj
    if (typeof (that) === "object") {
        if (that === null) {
            obj = null;
        } else if (Array.isArray(that)) { //Object.prototype.toString.call(that) === '[object Array]') { 
            obj = [];
            for (var i = 0; i < that.length; i++) {
                obj[i] = this.deepCopy(that[i]);
            }
        } else {
            obj = {}
            for (var i in that) {
                obj[i] = this.deepCopy(that[i])
            }
        }
    } else {
        obj = that
    }
    return obj;
};

/**
 * 初始化
 * 
 * @param {number} aw  0 初始  
 * 1 初始内适合大小  
 * 2 适合大小
 * 
 * @param {number} ah  0 初始  
 * 1 初始内适合大小  
 * 2 适合大小
 */
ArtWord.prototype.initialize = function (w, h ) {
    //Sprite.prototype.initialize.call(this);
    this._artWidth = w || 0
    this._artHeight = h || 0
    this.bitmap = new Bitmap(w, h)
    this.contents = this.bitmap
};


ArtWord.prototype.artWidth = function () {
    return this._artWidth
};

ArtWord.prototype.artHeight = function () {
    return this._artHeight
};


ArtWord._iconWidth = 32
ArtWord._iconHeight = 32

ArtWord.prototype.standardFontBold = function () {
    return false
};

/** */
ArtWord.prototype.standardFontItalic = function () {
    return false
};

/**标准字体 */
ArtWord.prototype.standardFontFace = function () { 
    //返回 游戏字体
    return 'GameFont';

};

/**字体设置 */
ArtWord.prototype.fontSettings = function (i) {
    if (i || !this.contents._fontnametext) {
        this.contents._fontnametext = this.contents._makeFontNameText()
    }
    return this.contents._fontnametext
};


ArtWord.prototype.standardTextColor = function () {
    return '#ffffff';
};

ArtWord.prototype.standardFontSize = function () {
    return 20;
};

/**文本高 */
ArtWord.prototype.standardOutlineColor = function () {
    return 'rgba(0, 0, 0, 0.5)';
};
ArtWord.prototype.standardOutlineWidth = function () {
    return 4;
};

ArtWord.textColors = [
    '#ffffff',
]

ArtWord.prototype.textColor = function (index) {
    return ArtWord.textColors[index];
};

/**还原 */
ArtWord.prototype.resetFontSettings = function () {
    this.contents.textColor = this.standardTextColor()
    this.contents.fontItalic = this.standardFontItalic()
    this.contents.fontBold = this.standardFontBold()
    this.contents.fontFace = this.standardFontFace();
    this.contents.fontSize = this.standardFontSize();
    this.contents.outlineColor = this.standardOutlineColor();
    this.contents.outlineWidth = this.standardOutlineWidth();


    this.fontSettings(1)
    this.resetTextColor();
    this.reHjg()
    this.reWjg()
};


ArtWord.prototype.resetTextColor = function () {
    this.changeTextColor(this.normalColor());
};


/**普通颜色 */
ArtWord.prototype.normalColor = function () {
    return this.textColor(0);
};

ArtWord.prototype.changeTextColor = function (color) {
    this.contents.textColor = color;
};

ArtWord.prototype.saveFontSettings = function (bitmap) {
    if (bitmap) {
        var fontSet = {
            textColor: bitmap.textColor,
            fontItalic: bitmap.fontItalic,
            fontBold: bitmap.fontBold,
            fontFace: bitmap.fontFace,
            fontSize: bitmap.fontSize,
            outlineColor: bitmap.outlineColor,
            outlineWidth: bitmap.outlineWidth
        }

    } else {
        var fontSet = {
            textColor: this.standardTextColor(),
            fontItalic: this.standardFontItalic(),
            fontBold: this.standardFontBold(),
            fontFace: this.standardFontFace(),
            fontSize: this.standardFontSize(),
            outlineColor: this.standardOutlineColor(),
            outlineWidth: this.standardOutlineWidth(),
        }
    }
    return fontSet
}


ArtWord.prototype.loadFontSettings = function (bitmap, fontSet) {
    if (fontSet && bitmap) {
        //console.log("load",fontSet)
        bitmap.textColor = fontSet.textColor
        bitmap.fontItalic = fontSet.fontItalic
        bitmap.fontBold = fontSet.fontBold
        bitmap.fontFace = fontSet.fontFace
        bitmap.fontSize = fontSet.fontSize
        bitmap.outlineColor = fontSet.outlineColor
        bitmap.outlineWidth = fontSet.outlineWidth
    }

}




/**文本高 */
ArtWord.prototype.calcTextHeight = function () {
    var maxFontSize = this.contents.fontSize;
    var textHeight = maxFontSize + this.contents.outlineWidth * 2;
    return textHeight;
};

/**文本宽
 * @param {string} text 文本
 * @returns {number} 文本宽
 */
ArtWord.prototype.calcTextWidth = function (text) {
    return this.contents.measureTextWidth(text);
};

ArtWord.prototype.makePage = function (textState) {
    var page = {
        "type": "page",
        "set": {},
        "list": [],
        "test": { "x": 0, "y": 0, "w": 0, "h": 0 }
    }
    page.set = ArtWord.deepCopy(textState.pageset)
    return page
};
ArtWord.prototype.makeLine = function (textState) {
    return { "type": "line", "list": [], "texts": [], "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};
ArtWord.prototype.makeText = function (textState) {
    return { "type": "text", "text": "", "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};
ArtWord.prototype.makeIcon = function (textState) {
    return { "type": "icon", "icon": "", "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};
ArtWord.prototype.makeLCFText = function (textState) {
    return { "type": "lcf", "lcf": "", "lcfwh": { "w": 0, "h": 0 }, "list": [] }
};
/**测试文字增强 */
ArtWord.prototype.testTextEx = function (text, x, y, w, h, wt, ht, facepos, wz, aw, ah) {
    var text = text || ""
    var draw = { x: x || 0, y: y || 0 }
    var pageset = {
        w: w || Infinity,
        h: h || Infinity,
        wtype: wt,
        htype: ht,
        autow: aw,
        autoh: ah,
        facepos: facepos || 0,
        wz: wz || 0,
        draw: draw
    }
    var t = this.convertEscapeCharacters(text)
    var textState = {
        text: t,
        textindex: 0,
        tsl: [],
        textf: {},
        index: 0,
        pages: [],
        list: [],
        pageset: pageset,
    };

    this.resetFontSettings();

    this.tslPushAll(textState)

    this.testMakePages(textState)

    this.testMakeList(textState)

    this.resetFontSettings();
    return textState;
};
/**转换换码字符 */

ArtWord.prototype.convertEscapeCharacters = function (text) {
    //替换\为\xlb
    text = text.replace(/\\/g, '\x1b');
    //替换\xlb\xlb 为 \\
    text = text.replace(/\x1b\x1b/g, '\\');
    //替换\xlbV[n]为  变量 
    text = text.replace(/\x1bV\[(\d+)\]/gi, function () {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    //替换\xlbV[n]为  变量 
    text = text.replace(/\x1bV\[(\d+)\]/gi, function () {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bN\[(\d+)\]/gi, function () {
        return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bP\[(\d+)\]/gi, function () {
        return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit); 
    return text;
};
/**角色名称 */
ArtWord.prototype.actorName = function (n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.name() : '';
};
/**队伍成员名称 */
ArtWord.prototype.partyMemberName = function (n) {
    var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
    return actor ? actor.name() : '';
};


/**设置绘制xy */
ArtWord.prototype.setDrawxy = function (textState, draw) {
    if (textState && draw) {
        textState.draw = draw
        return textState;
    } else {
        return null;
    }
};

/**设置页设置 */
ArtWord.prototype.setTextPageset = function (textState, pageset) {
    if (textState && pageset) {
        textState.pageset = pageset
        return textState;
    } else {
        return null;
    }
};


/**制作页 */
ArtWord.prototype.testMakePages = function (textState) {
    if (textState) {
        var list = textState.tsl || []
        textState.pages = []
        for (var i = 0; i < list.length; i++) {
            var obj = list[i]
            var type = obj.type
            if (type == "page") {
                var page = this.makePage(textState)
                page.set = obj.set
                this.testPushPage(textState, page)
                //重设间隔 
                this.rejg()
            } else if (type == "line") {
                var line = this.makeLine()
                this.testPushLine(textState, line)
            } else if (type == "icon") {
                this.testPushText(textState, obj)
            } else if (type == "text") {
                this.testPushText(textState, obj)
            } else if (type == "lcf") {
                this.testPushLCFText(textState, obj)
            } else if (type == "wjg") {
                this.setWjg(obj.value)
            } else if (type == "hjg") {
                this.setHjg(obj.value)
            } else {
                this.testPushOther(textState, obj)
            }
        }
        this.testPushEnd(textState)
        return textState
    } else {
        return null
    }
};


/**测试列表 */
ArtWord.prototype.testMakeList = function (textState) {
    if (textState && textState.pages) {
        textState.list = []
        for (var pi = 0; pi < textState.pages.length; pi++) {
            var p = textState.pages[pi]
            textState.list.push(p)
            if (p && p.list) {
                for (var li = 0; li < p.list.length; li++) {
                    var l = p.list[li]
                    textState.list.push(l)
                    if (l && l.list) {
                        for (var ci = 0; ci < l.list.length; ci++) {
                            var c = l.list[ci]
                            if (c) {
                                textState.list.push(c)
                            }
                        }
                    }
                }
            }
        }
        return textState
    } else {
        return null
    }
};


ArtWord.prototype.indexCharacter = function (textState, index) {
    return textState.list[index];
};

ArtWord.prototype.needsCharacter = function (textState) {
    return this.indexCharacter(textState, textState.index)
};


ArtWord.prototype.nextCharacter = function (textState) {
    return this.indexCharacter(textState, textState.index + 1)
};

/**绘制文本状态 */
ArtWord.prototype.drawTextState = function (textState, index) {
    if (textState) {
        if (index !== undefined) {
            textState.index = index
        }
        if (!textState.index) {
            this.resetFontSettings();
        }
        if (textState.index < textState.list.length) {
            this.processDrawCharacter(textState);
            textState.index += 1
            return false
        }
    }
    return true
};

/**绘制某一页 */
ArtWord.prototype.drawTextStatePage = function (textState, pageIndex) {
    if (textState) {
        var textState = textState;
        var pageIndex = pageIndex || 0
        this.resetFontSettings();
        var pi = 0
        while (textState.index < textState.list.length) {
            this.processDrawCharacter(textState);
            textState.index += 1
            if (this.needsNewPage(textState)) {
                if (pi == pageIndex) {
                    break
                } else {
                    pi++
                }
            }
        }
        this.resetFontSettings();
        return textState.pages[0].test.w;
    } else {
        return 0;
    }
};

/** */
ArtWord.prototype.drawTextEx = function (text, x, y, w, h, p, l) {
    if (text) {
        var textState = this.testTextEx(text, x, y, w, h, p, l);
        this.resetFontSettings();
        while (textState.index < textState.list.length) {
            this.processDrawCharacter(textState);
            textState.index += 1
            if (this.needsNewPage(textState)) {
                break
            }
        }
        this.resetFontSettings();
        return textState.pages[0].test.w;
    } else {
        return 0;
    }
};



/**绘制 */
ArtWord.prototype.drawTextEx2 = function (text, x, y, w, h, p, l) {
    if (text) {
        var textState = this.testTextEx(text, x, y, w, h, p, l);
        this.resetFontSettings();
        while (textState.index < textState.list.length) {
            this.processDrawCharacter(textState);
            textState.index += 1
            if (this.needsNewPage(textState)) {
                break
            }
        }
        this.resetFontSettings();
        return textState.pages[0].test.h;
    } else {
        return 0;
    }
};

/**添加所有 */
ArtWord.prototype.tslPushAll = function (textState) {
    this.tslPushHear(textState)
    while (textState.textindex < textState.text.length) {
        this.tslPushCharacter(textState);
    }
    this.tslPushEnd(textState)
};

/**测试添加头 */
ArtWord.prototype.tslPushHear = function (textState) {
    textState.textindex = 0
    if (textState.text[0] == '\x1b') {
        if (this.tslPushEscapeCode(textState) == "Y") {
            this.tslPushNewPageY(textState)
            return
        }
    }
    if (!textState.page) {
        this.tslPushPage(textState)
        this.tslPushLine(textState)
    }
    textState.textindex = 0
};

/**测试 添加尾 */
ArtWord.prototype.tslPushEnd = function (textState) {
    textState.textindex = 0
    delete textState.page
    delete textState.line
};


/**添加其他 */
ArtWord.prototype.tslPush = function (textState, obj) {
    textState.tsl.push(obj)
};


/**测试添加页 */
ArtWord.prototype.tslPushPage = function (textState, page) {
    var page = page || this.makePage(textState)
    textState.page = page
    this.tslPush(textState, page)
};


/**测试添加行 */
ArtWord.prototype.tslPushLine = function (textState, line) {
    var line = line || this.makeLine()
    var page = textState.page
    textState.line = line
    this.tslPush(textState, line)
};


/**页设置脸图 */
ArtWord.prototype.tslPushPic = function (textState, pic) {
    if (pic) {
        //ImageManager.loadPicture(pic.name)
        var page = textState.page
        page.set.ps = page.set.ps || {}
        page.set.ps[pic.index] = pic.name
        this.tslPush(textState, pic)
    }
}



/**页设置脸图 */
ArtWord.prototype.tslPushFace = function (textState, face) {
    if (face) {
        ImageManager.loadFace(face.name)
        if (face.pos == 1 || face.pos == 0) {
            var pid = -1
        } else {
            var pid = -2
        }

        page.set.ps = page.set.ps || {}
        page.set.ps[pid] = face.name
        this.tslPush(textState, face)
    }
}


/**添加字符 */
ArtWord.prototype.tslPushOther = function (textState, text) {
    if (text) {
        this.tslPush(textState, text)
    }
};
//****************************************************************** */

/**测试添加页 */
ArtWord.prototype.testPushPage = function (textState, page) {
    /**处理上一个页 */
    this.testPushLine(textState, 0, 1)
    var page = page || this.makePage(textState)
    textState.page = page
    textState.pages.push(page)
    textState.line = null
};


/**测试添加行 */
ArtWord.prototype.testPushLine = function (textState, line, cs) {
    var line = line || this.makeLine()
    var page = textState.page
    var line0 = textState.line
    /**有页时 */
    if (page) {
        /**有上一行时 */
        if (line0) {
            var must = page.set

            //有限定行数时 
            var ph = page.test.h
            var lh = line0.test.h
            //间隔
            var jh = (ph == 0 || lh == 0) ? 0 : this.getHjg() || 0

            line0.test.y = page.test.h + jh
            page.test.h = line0.test.h + line0.test.y

            page.test.w = Math.max(page.test.w, line0.test.w)
            var fw = ArtWord._faceWidth + 24
            var w = must.w - (page.set.facepos == 3 ? fw * 2 : page.set.facepos ? fw : 0)
            var h = must.h
            /**处理宽 */
            if (w != Infinity) {
                if (line0.test.w < w) {
                    if (must.wtype === 1) {
                        /**中心对齐 */
                        line0.test.x = (w - line0.test.w) / 2
                    } else if (must.wtype === 2) {
                        /**右对齐 */
                        line0.test.x = (w - line0.test.w)
                    }
                } else {
                    /**左对齐 */
                    line0.test.x = 0
                }
            }
            /**处理高 */
            if (h != Infinity) {
                if (page.test.h < h) {
                    if (must.htype == 1 || page.set.htype === 1) {
                        page.test.y = (h - page.test.h) / 2
                    } else if (must.htype == 2) {
                        page.test.y = (h - page.test.h)
                    }
                } else {
                    page.test.y = 0
                }
            }
            page.list.push(line0)
        }
    }
    if (cs) { return }
    textState.line = line
};


ArtWord.prototype.testPushLCFText = function (textState, lcftext) {
    var lcftext = lcftext || this.makeLCFText()

    var list = lcftext.list

    if (!list.length) {
        return
    }


    var lcf = lcftext.lcf

    var lcfwh = lcftext.lcfwh
    var lcfw = lcfwh.w


    var line = textState.line
    var page = textState.page
    var pageset = page.set

    //====处理字====
    var lw = line.test.w
    var tw = text.test.w
    //宽间隔
    var jw = (lw == 0 || tw == 0) ? 0 : this.getWjg() || 0
    var sw = pageset.w
    var fw = ArtWord._faceWidth + 24
    var fw = page.set.facepos == 3 ? fw * 2 : page.set.facepos ? fw : 0


    var syw = sw - fw - lw - jw

    var rel = []
    var rei = -1
    var odw = 0
    var rel2 = []
    for (var i = 0; i < list.length; i++) {
        var re = list[i]
        odw += re.w
        if (odw + ((i == list.length - 1) ? 0 : lcfw) <= syw) {
            rei = i
        }
    }

    //如果第一个都放不下
    if (rei == -1) {
        //如果是开头
        if (lw == 0) {
            var text = this.makeText()
            text.text = re[0].text
            text.test.w = re[0].w
            text.test.h = re[0].h
            //添加字符 
            text.test.x = lw + jw
            line.test.w = text.test.x + tw
            line.test.h = Math.max(line.test.h, text.test.h)
            this.testPushLineText(textState, text)

            //====处理行====
            var ph = page.test.h
            var lh = line.test.h
            //间隔
            var jh = (ph == 0 || lh == 0) ? 0 : this.getHjg() || 0
            var sh = pageset.h
            //行能放到页中 
            if (ph + jh + lh <= sh || ph == 0) {
                //不能放到页中 或者 不是第一行
            } else {
                //添加新页
                textState.line = null
                var page2 = this.makePage(textState)
                page2.type = "addpage"
                page2.set = ArtWord.deepCopy(page.set)
                this.testPushPage(textState, page2)
                //行添加到新页
                this.testPushLine(textState, line)
            }
            rei = 0
        } else {
            //判断是否添加新页
            if (pageset.hl && page.list.length >= pageset.hl) {
                textState.line = null
                var page2 = this.makePage(textState)
                page2.type = "addpage"
                page2.set = ArtWord.deepCopy(page.set)
                this.testPushPage(textState, page2)
            }
            //添加新行
            var line2 = this.makeLine()
            line2.type = "addline"
            line2.set = line.set
            this.testPushLine(textState, line2)
        }
    } else {
        for (var i = 0; i <= rei; i++) {
            var text = this.makeText()
            text.text = re[i].text
            text.test.w = re[i].w
            text.test.h = re[i].h
            //添加字符 
            text.test.x = lw + jw
            line.test.w = text.test.x + tw
            line.test.h = Math.max(line.test.h, text.test.h)
            this.testPushLineText(textState, text)

        }
        //如果不是到达最后一个
        if (rei < list.length - 1) {
            var text = this.makeText()
            text.text = lcftext.lcf
            text.test.w = lcftext.lcfwh.w
            text.test.h = lcftext.lcfwh.h
            //添加字符 
            text.test.x = lw + jw
            line.test.w = text.test.x + tw
            line.test.h = Math.max(line.test.h, text.test.h)
            this.testPushLineText(textState, text)
        }
        //====处理行====
        var ph = page.test.h
        var lh = line.test.h
        //间隔
        var jh = (ph == 0 || lh == 0) ? 0 : this.getHjg() || 0
        var sh = pageset.h
        //行能放到页中 
        if (ph + jh + lh <= sh || ph == 0) {
            //不能放到页中 或者 不是第一行
        } else {
            //添加新页
            textState.line = null
            var page2 = this.makePage(textState)
            page2.type = "addpage"
            page2.set = ArtWord.deepCopy(page.set)
            this.testPushPage(textState, page2)
            //行添加到新页
            this.testPushLine(textState, line)
        }
    }


    var lclist2 = []
    for (var i = rei + 1; i < list.length; i++) {
        lclist2.push(list[i])
    }
    if (lclist2.length) {
        var lcftext2 = this.makeLCFText()
        lcftext2.lcf = lcf
        lcftext2.lcfwh = lcfwh
        lcftext2.list = lclist2
        //处理下一个
        this.testPushLCFText(textState, lcftext2)
    }
};

/**添加字符 */
ArtWord.prototype.testPushText = function (textState, text) {
    var text = text || this.makeText()
    var line = textState.line
    var page = textState.page
    var pageset = page.set

    //====处理字====
    var lw = line.test.w
    var tw = text.test.w
    //宽间隔
    var jw = (lw == 0 || tw == 0) ? 0 : this.getWjg() || 0
    var sw = pageset.w
    var fw = ArtWord._faceWidth + 24
    var fw = page.set.facepos == 3 ? fw * 2 : page.set.facepos ? fw : 0

    var wlp = pageset.wl && line.texts.length >= pageset.wl
    //行可以放开字  或者 第一个
    if (!wlp && (lw + jw + tw <= sw - fw || lw == 0)) {
        //添加字符 
        text.test.x = lw + jw
        line.test.w = text.test.x + tw
        line.test.h = Math.max(line.test.h, text.test.h)
        this.testPushLineText(textState, text)


        var hlp = pageset.hl && page.list.length >= pageset.hl

        //====处理行====
        var ph = page.test.h
        var lh = line.test.h
        //间隔
        var jh = (ph == 0 || lh == 0) ? 0 : this.getHjg() || 0
        var sh = pageset.h
        //行能放到页中 
        if (!hlp && (ph + jh + lh <= sh || ph == 0)) {
            //不能放到页中 或者 不是第一行
        } else {
            //添加新页
            textState.line = null
            var page2 = this.makePage(textState)
            page2.type = "addpage"
            page2.set = ArtWord.deepCopy(page.set)
            this.testPushPage(textState, page2)
            //行添加到新页 
            this.testPushLine(textState, line)
        }
    }
    //行放不开
    else {

        /**单个空格的话不添加到新行 */
        if (text.ge && text.text == " ") {
            //添加新行
            var line2 = this.makeLine()
            line2.type = "addline"
            line2.set = line.set
            this.testPushLine(textState, line2)
            return
        }

        //添加新行
        var line2 = this.makeLine()
        line2.type = "addline"
        line2.set = line.set
        this.testPushLine(textState, line2)
        this.testPushText(textState, text)
    }
};

/**添加其他 */
ArtWord.prototype.testPushOther = function (textState, obj) {
    textState.line.list.push(obj)
};


ArtWord.prototype.testPushLineText = function (textState, obj) {
    textState.line.texts.push(obj)
    textState.line.list.push(obj)
};

/**添加结束 */
ArtWord.prototype.testPushEnd = function (textState) {
    this.testPushLine(textState, 0, 1)
};

/***************************************************************************** */


//处理字符
ArtWord.prototype.tslPushCharacter = function (textState) {
    //检查 文本状态 文本[文本状态 索引]
    switch (textState.text[textState.textindex]) {
        //当 "\n"
        case '\n':
            //处理新行( 文本状态 )
            this.tslPushNewLine(textState);
            break;
        case '\f':
            this.tslPushNewPage(textState);
            break;
        case '\x1b':
            this.tslPushEscapeCharacter(textState, this.tslPushEscapeCode(textState));
            break;
        default:
            this.tslPushNormalCharacter(textState);
            break;
    }
};

/**文本状态列表 添加处理字符 */
ArtWord.prototype.tslPushEscapeCode = function (textState) {
    textState.textindex++;
    var regExp = /^[\$\.\|\^!><\{\}\\\/\=]|^[A-Z]+/i;
    var arr = regExp.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return arr[0].toUpperCase();
    } else {
        return '';
    }
};

/**文本状态列表 添加处理字符 */
ArtWord.prototype.tslPushEscapeCharacter = function (textState, code) {
    switch (code) {
        case 'C':
            this.tslPushTextColor(textState, this.tslPushTextColorEscapeParam(textState));
            break;
        case 'K':
            this.tslPushKongGe(textState);
            break;
        case 'I':
            this.tslPushDrawIcon(textState, this.tslPushEscapeParam(textState));
            break;
        case '{':
            this.tslPushChangeFontSize(textState, 1);
            break;
        case '}':
            this.tslPushChangeFontSize(textState, -1);
            break;
        case '=':
            this.tslPushChangeFontBlod(textState);
            break;
        case '/':
            this.tslPushChangeFontItalic(textState);
            break;
        case 'OC':
            this.tslPushOutColor(textState, this.tslPushTextColorEscapeParam(textState));
            break;

        case 'NL':
            this.tslPushNewLine(textState, this.tslPushEscapeParam(textState, 0));
            textState.textindex--
            break;
        case 'OW':
            this.tslPushOutWidth(textState, this.tslPushEscapeParam(textState, 0));
            break;
        case 'WJ':
            this.tslPushWJ(textState, this.tslPushEscapeParam(textState, 0));
            break;
        case 'HJ':
            this.tslPushHJ(textState, this.tslPushEscapeParam(textState, 0));
            break;
        case 'Y':
            this.tslPushNewPageY(textState)
            break
        case 'NY':
            this.tslPushNewPageY2(textState)
            break
        case 'F':
            this.tslPushFaceParam(textState)
            break;
        case 'HT':
            this.tslPushHT(textState, this.tslPushEscapeParam(textState, 0))
            break
        case 'WT':
            this.tslPushWT(textState, this.tslPushEscapeParam(textState, 0))
            break
        case 'AH':
            this.tslPushAH(textState, this.tslPushEscapeParam(textState, 0))
            break
        case 'AW':
            this.tslPushAW(textState, this.tslPushEscapeParam(textState, 0))
            break
        case 'WH':
            this.tslPushWH(textState, this.tslPushEscapeParamEx(textState))
            break
        case 'DXY':
            this.tslPushDXY(textState, this.tslPushEscapeParamEx(textState))
            break
        case 'TWH':
            this.tslPushTWH(textState, this.tslPushEscapeParamEx(textState))
            break
        case 'CWH':
            this.makeNewContents(textState, this.tslPushEscapeParamEx(textState));
            break;
        case 'FF':
        case 'FFR':
        case 'FS':
        case 'FSR':
        case 'FC':
        case 'FCR':
        case 'FI':
        case 'FB':
        case 'FR':
            this.setF(code, this.obtainEscapeParamExs(textState), textState)
            break;
    }
};




ArtWord.prototype.obtainEscapeParamExs = function (textState) {
    var arr = /^\[\[(.*?)\]\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        var re = "[" + arr[1] + "]"
        return JSON.parse(re)
    }
    return arr;
};


ArtWord.prototype.setF = function (code, list, textState) {
    switch (code) {
        //当 "C"
        case 'FF':
            this.contents.fontFace = list[0]
            break;
        case 'FFR':
            this.contents.fontFace = this.standardFontFace();
            break;
        case 'FS':
            this.contents.fontSize = list[0]
            break;
        case 'FSR':
            this.contents.fontSize = this.standardFontSize();
            break;
        case 'FC':
            this.changeTextColor(list[0]);
            break;
        case 'FCR':
            this.resetTextColor()
            break;
        case 'FI':
            this.contents.fontItalic = list[0]
            break;
        case 'FB':
            this.contents.fontBold = list[0]
            break;
        case 'FR':
            this.resetFontSettings()
            break;
    };
    if (textState) {
        this.tslPushParam(textState, code, list)
    }
}





/**设置底显示  */
/*
ArtWord.prototype.setBackShow = function(list, textState) {
    this._windowSpriteContainer.visible = (list[0]) ? true : false
};

*/

/**脸图位置 */
ArtWord.prototype.facePos = function () {
    return this._facepos || 0
}



/**设置宽间隔 */
ArtWord.prototype.setWjg = function (jg) {
    this._wjg = jg || 0
};

/**设置宽间隔 */
ArtWord.prototype.getWjg = function () {
    return this._wjg
};

ArtWord.prototype.reWjg = function () {
    this.setWjg(0)
};


ArtWord.prototype.setHjg = function (jg) {
    this._hjg = jg || 0
};

ArtWord.prototype.getHjg = function () {
    return this._hjg
};

ArtWord.prototype.reHjg = function () {
    this.setHjg(0)
};


ArtWord.prototype.setKg = function (jg) {
    this._kg = jg || 0
};
ArtWord.prototype.reKg = function () {
    this.setKg(0)
};


ArtWord.prototype.rejg = function () {
    this.reWjg()
    this.reHjg()
};


/**文本状态列表 添加行间隔 */
ArtWord.prototype.tslPushWJ = function (textState, wjg) {
    this.setWjg(wjg)
    var obj = {
        "type": "wjg",
        "value": wjg
    }
    this.tslPushOther(textState, obj)
};

/**文本状态列表 添加宽间隔 */
ArtWord.prototype.tslPushHJ = function (textState, hjg) {
    this.setHjg(hjg)
    var obj = {
        "type": "hjg",
        "value": hjg
    }
    this.tslPushOther(textState, obj)
};



ArtWord.prototype.tslPushDXY = function (textState, list) {
    if (textState && textState.page && textState.page.set) {
        textState.page.set.draw.x = (list[0] || 0) * 1
        textState.page.set.draw.y = (list[1] || 0) * 1
    }
    var obj = {
        "type": "dxy",
        "value": list
    }
    this.tslPushOther(textState, obj)
};

ArtWord.prototype.tslPushWH = function (textState, list) {
    if (textState && textState.page && textState.page.set) {
        textState.page.set.w = (list[0] || 0) * 1
        textState.page.set.h = (list[1] || 0) * 1
    }
    var obj = {
        "type": "wh",
        "value": list
    }
    this.tslPushOther(textState, obj)
};

ArtWord.prototype.makeNewContents = function (textState, list) {
    var w = (list && (list[0] || 0) * 1) || this.artWidth();
    var h = (list && (list[1] || 0) * 1) || this.artHeight()
    this.bitmap.initialize(w, h)
    this.bitmap.clear()
    this.contents = this.bitmap;

    this.resetFontSettings();
};

/**添加新行 */
ArtWord.prototype.tslPushNewLine = function (textState) {
    textState.textindex++;
    this.tslPushLine(textState)
};

/**进行行对象 */
ArtWord.prototype.tslPushNewLineL = function (textState) {
    var line = textState.line
    var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        line.cs = arr[1]
    }
};

/**进行新页对象 */
ArtWord.prototype.tslPushNewPage = function (textState) {
    textState.textindex++
    this.tslPushPage(textState)
    this.tslPushLine(textState)
    this.resetFontSettings();
};

/**进行新页对象 */
ArtWord.prototype.tslPushNewPageY = function (textState) {
    var page = this.makePage(textState)

    var line = this.makeLine(textState)
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        textState.textindex += arr[0].length;
        page.set.wz = arr[1] * 1
    }
    //console.log(arr)
    this.tslPushPage(textState, page)
    this.tslPushLine(textState, line)
    this.resetFontSettings();
};

ArtWord.prototype.tslPushNewPageY2 = function (textState) {
    var page = this.makePage(textState)

    var line = this.makeLine(textState)
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        textState.textindex += arr[0].length;
    }
    if (textState.page) {
        page.set = textState.page.set

    }
    this.tslPushPage(textState, page)
    this.tslPushLine(textState, line)
    this.resetFontSettings();
};

/**添加排版横向种类 */
ArtWord.prototype.tslPushWT = function (textState, wjg) {
    textState.page.set.wtype = wjg
};

/**添加排版竖向向种类 */
ArtWord.prototype.tslPushHT = function (textState, wjg) {
    textState.page.set.htype = wjg
};


/**添加自动宽种类 */
ArtWord.prototype.tslPushAW = function (textState, wjg) {
    textState.page.set.autow = wjg
};

/**添加自动高种类 */
ArtWord.prototype.tslPushAH = function (textState, wjg) {
    textState.page.set.autoh = wjg
};

ArtWord.textf = {}

/**处理正常字符 */
ArtWord.prototype.tslPushNormalCharacter = function (textState) {
    //c = 文本状态 [文本状态 索引++]

    if (this._kg) {
        var regExp = /^(\w+-?)+/i;
        var arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            if (arr[0]) {
                var t = arr[0]
                textState.textindex += t.length
                var tl = t.split("-")
                if (tl.length > 1) {
                    var obj = this.makeLCFText()
                    obj.lcfwh = this.loadText("-")
                    for (var i = 0; i < tl.length; i++) {
                        var fc = tl[i]
                        var re = this.loadText(fc)
                        var o = { text: fc }
                        o.w = re.w
                        o.h = re.h
                        obj.list.push(o)
                    }
                    this.tslPushOther(textState, obj)
                    return
                } else {
                    var re = this.loadText(t)
                    var text = this.makeText()
                    text.text = t
                    text.test.w = re.w
                    text.test.h = re.h
                    this.tslPushOther(textState, text)
                }
                return
            }
        }
        var regExp = /^ +/i;
        var arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            if (arr[0]) {
                var t = arr[0]
                textState.textindex += t.length
                var tl = this.loadText(t)
                var text = this.makeText()
                text.text = t
                text.test.w = re.w
                text.test.h = re.h
                this.tslPushOther(textState, text)
                return
            }
        }
    }
    var c = textState.text[textState.textindex++];
    var re = this.loadText(c)
    var text = this.makeText()
    text.text = c
    text.test.w = re.w
    text.test.h = re.h
    this.tslPushOther(textState, text)
};


/**设置改变粗体 */
ArtWord.prototype.tslPushKongGe = function (textState) {

    this.setKg(!this._kg)
    var obj = {
        "type": "liancifu",
        "value": this._kg
    }
    this.tslPushOther(textState, text)
}



/**读取文字 */
ArtWord.prototype.loadText = function (c) {
    //w = c 文本宽 
    var f = this.fontSettings()
    var textf = ArtWord.textf
    if (textf[f]) {
        if (textf[f][c]) {
            var w = textf[f][c]["w"]
            var h = textf[f][c]["h"]
        } else {
            var w = this.calcTextWidth(c);
            var h = this.calcTextHeight()
            textf[f][c] = { w: w, h: h }
        }
    } else {
        textf[f] = {}
        var w = this.calcTextWidth(c);
        var h = this.calcTextHeight()
        textf[f][c] = { w: w, h: h }
    }
    return textf[f][c]
}

/**添加空白文本宽高 */
ArtWord.prototype.tslPushTWH = function (textState, list) {
    var text = this.makeText()
    text.text = ""
    var w = list[0] * 1
    var h = list[1] * 1
    text.test.w = isFinite(w) ? w : 0
    text.test.h = isFinite(h) ? h : 0
    this.tslPushOther(textState, text)
};


/**添加文本颜色对象 */
ArtWord.prototype.tslPushTextColor = function (textState, color) {
    this.contents.textColor = color;
    var obj = {
        "type": "textColor",
        "value": color
    }
    this.tslPushOther(textState, obj)
};

/**添加描边颜色 */
ArtWord.prototype.tslPushOutColor = function (textState, color) {
    var obj = {
        "type": "outlineColor",
        "value": color
    }
    this.tslPushOther(textState, obj)
};

/**添加描边宽 */
ArtWord.prototype.tslPushOutWidth = function (textState, width) {
    var obj = {
        "type": "outlineWidth",
        "value": width
    }
    this.tslPushOther(textState, obj)
};


/**添加绘制图标 */
ArtWord.prototype.tslPushDrawIcon = function (textState, iconId) {
    var obj = this.makeIcon()
    obj.icon = iconId
    obj.test.w = ArtWord._iconWidth + 4;
    obj.test.h = ArtWord._iconHeight + 4;
    this.tslPushOther(textState, obj)
};

/**添加改变斜体 */
ArtWord.prototype.tslPushChangeFontItalic = function (textState) {
    var Italic = !this.contents.fontItalic
    var Italic = !!this.tslPushEscapeParam(textState, Italic)
    this.tslPushFontItalic(textState, Italic)
}

/**添加字体粗体 */
ArtWord.prototype.tslPushFontItalic = function (textState, Italic) {
    this.contents.fontItalic = Italic;
    var obj = {
        "type": "fontItalic",
        "value": Italic
    }
    this.tslPushFont(textState, obj)
};

/**设置改变粗体 */
ArtWord.prototype.tslPushChangeFontBlod = function (textState) {
    var bold = !this.contents.fontBold
    var bold = !!this.tslPushEscapeParam(textState, bold)
    this.tslPushFontBlod(textState, bold)
}

/**文本状态列表 添加粗体 */
ArtWord.prototype.tslPushFontBlod = function (textState, bold) {
    this.contents.fontBold = bold;
    var obj = {
        "type": "fontBold",
        "value": bold
    }
    this.tslPushFont(textState, obj)
};

/**字体 */
ArtWord.prototype.tslPushChangeFontSize = function (textState, i) {
    if (i > 0) {
        var arr = /^}/.exec(textState.text.slice(textState.textindex));
        if (arr) {
            textState.textindex += arr[0].length;
            var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
            if (arr) {
                textState.textindex += arr[0].length;
                this.tslPushFontSize(textState, parseInt(arr[1]));
            } else {
                this.tslPushFontSize(textState, this.standardFontSize());
            }
        } else {
            var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
            if (arr) {
                textState.textindex += arr[0].length;
                this.tslPushFontSize(textState, this.contents.fontSize + parseInt(arr[1]));
            } else {
                this.tslPushFontSize(textState, this.contents.fontSize + 12)
            }
        }
    } else if (i < 0) {
        var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
        if (arr) {
            textState.textindex += arr[0].length;
            this.tslPushFontSize(textState, this.contents.fontSize - parseInt(arr[1]));
        } else {
            this.tslPushFontSize(textState, this.contents.fontSize - 12)
        }
    }
}


/**文本状态列表  添加字体 */
ArtWord.prototype.tslPushFontSize = function (textState, fontSize) {
    var fontSize = fontSize
    this.contents.fontSize = fontSize;
    var obj = {
        "type": "fontSize",
        "value": fontSize
    }
    this.tslPushFont(textState, obj)
};

/**文本状态列表 添加字体 */
ArtWord.prototype.tslPushFont = function (textState, obj) {
    this.fontSettings(1)
    this.tslPushOther(textState, obj)
};



/**文本状态列表添加脸图 */
ArtWord.prototype.tslPushFaceParam = function (textState) {
    var page = textState.page
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        var pos = (arr[0] || 0) * 1
        var name = arr[1]
        var id = (arr[2] || 0) * 1
        var face = {
            "type": "face",
            "pos": pos || 1,
            "name": name,
            "id": id
        }
        this.tslPushFace(textState, face)
    }
};

/**文本状态列表添加图片 */
ArtWord.prototype.tslPushPicParam = function (textState) {
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        var pos = arr[0] * 1
        var name = arr[1]
        var index = (arr[2] || 0) * 1
        var obj = {
            "type": "pic",
            "pos": pos,
            "name": name,
            "index": index
        }
        this.tslPushPic(textState, obj)
    }
};



/**获取参数 */
ArtWord.prototype.tslPushEscapeParam = function (textState, un) {
    if (un === undefined) {
        var un = ""
    } else {
        var un = un
    }
    var arr = /^\[(.*?)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        try {
            var i = arr[1] * 1
        } catch (error) {
            var i = un
        }
        return i;
    } else {
        return un;
    }
};

/**获取参数增强 */
ArtWord.prototype.tslPushEscapeParamEx = function (textState) {
    var arr = /^\[(.*?)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return arr[1].split(/ +/)
    }
    return arr;
};

ArtWord.prototype.tslPushEscapeParamEx2 = function (textState) {
    var arr = /^\[\{(.*?)\}\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return arr[1].split(/ +/)
    }
    return arr;
};


/**获取颜色参数 */
ArtWord.prototype.tslPushTextColorEscapeParam = function (textState) {
    var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return this.textColor(parseInt(arr[1]));
    } else {
        var arr = /^\[(#\w{6})\]/.exec(textState.text.slice(textState.textindex));
        if (arr) {
            textState.textindex += arr[0].length;
            return arr[1]
        } else {
            var arr = /^\[(#\w{3})\]/.exec(textState.text.slice(textState.textindex));
            if (arr) {
                textState.textindex += arr[0].length;
                return arr[1]
            } else {
                var arr = /^\[(rgba\((.*?)\))\]/.exec(textState.text.slice(textState.textindex));
                if (arr) {
                    textState.textindex += arr[0].length;
                    return arr[1]
                } else {
                    return this.normalColor();
                }
            }
        }
    }
};



/**文本内容宽 */
ArtWord.prototype.textContentsWidth = function () {
    return this.contentsWidth()
}



/**是结束在文本 */
ArtWord.prototype.isEndOfText = function (textState) {
    return textState.index >= textState.list.length;
};

/**需要新页 */
ArtWord.prototype.needsNewPage = function (textState) {
    return (!this.isEndOfText(textState) &&
        this.needsCharacter(textState) && (
            this.needsCharacter(textState).type == "page" ||
            this.needsCharacter(textState).type == "addpage")
    );
};




/**进行绘制对象 */
ArtWord.prototype.processDrawCharacter = function (textState) {
    var obj = this.needsCharacter(textState)
    if (obj) {
        switch (obj.type) {
            case "line":
            case "addline":
                textState.line = obj;
                textState.drawx =
                    /**绘制基础位置 */
                    textState.page.set.draw.x +
                    /**页开始位置 */
                    textState.page.test.x +
                    /**脸图位置 */
                    ((textState.page.set.facepos == 1 || textState.page.set.facepos == 3) ? 168 : 0) +
                    /**行位置 */
                    textState.line.test.x
                textState.drawy =
                    textState.page.set.draw.y +
                    textState.page.test.y +
                    textState.line.test.y
                break
            case "page":
            case "addpage":
                textState.page = obj;
                break
            case "fontSize":
            case "fontBold":
            case "fontItalic":
            case "textColor":
            case "outlineColor":
            case "outlineWidth":
                this.processFont(obj.type, obj.value);
                break
            case "text":
                var x = textState.drawx + obj.test.x
                var y = textState.drawy + obj.test.y
                var w = obj.test.w
                var h = textState.line.test.h
                var c = obj.text
                this.processText(c, x, y, w * 2, h)
                this.processNormalCharacter2()
                break
            case "icon":
                var x = textState.drawx + obj.test.x
                var y = textState.drawy + obj.test.y
                var h = textState.line.test.h
                var iconIndex = obj.icon
                this.processIcon(iconIndex, x + 2, y + 2);
                this.processNormalCharacter2()
                break
            case 'FF':
            case 'FFR':
            case 'FS':
            case 'FSR':
            case 'FC':
            case 'FCR':
            case 'FI':
            case 'FB':
            case 'FR':
                this.setF(obj.type, obj.value)
                break;
        }
    }
}



ArtWord.prototype.processFont = function (type, value) {
    this.drawBitmapFont(this.contents, type, value)
}


ArtWord.prototype.processText = function (c, x, y, w, h) {
    this.drawBitmapText(this.contents, c, x, y, w, h)
}

ArtWord.prototype.processIcon = function (iconIndex, x, y) {
    this.drawBitmapIcon(this.contents, iconIndex, x, y)
}


ArtWord.prototype.cloneBitmapFont = function (b, b2) {
    var font = this.saveFontSettings(b2)
    this.loadFontSettings(b, font)
}

ArtWord.prototype.drawBitmapFont = function (b, type, value) {
    b && (b[type] = value)
};

ArtWord.prototype.drawBitmapIcon = function (b, iconIndex, x, y) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = ArtWord._iconWidth;
    var ph = ArtWord._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    b && b.blt(bitmap, sx, sy, pw, ph, x, y);
};
ArtWord.prototype.drawBitmapText = function (b, c, x, y, w, h) {
    b && b.drawText(c, x, y, w, h);
};


/**添加参数 */
ArtWord.prototype.tslPushParam = function (textState, name, value) {
    var obj = {
        "type": name,
        "value": value
    }
    this.tslPushOther(textState, obj)
};



/**进行普通文字处理2 */
ArtWord.prototype.processNormalCharacter2 = function () { };

 


/**文字精灵 */
function Sprite_Art() {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_Art.prototype = Object.create(ArtWord.prototype);
/**设置创造者 */
Sprite_Art.prototype.constructor = Sprite_Art;
/**
 * 初始化
 * 
 * @param {number} aw  0 初始  
 * 1 初始内适合大小  
 * 2 适合大小
 * 
 * @param {number} ah  0 初始  
 * 1 初始内适合大小  
 * 2 适合大小
 */
Sprite_Art.prototype.initialize = function (w, h, text, color, aw, ah) {
    ArtWord.prototype.initialize.call(this, w, h);
    this._sw = w
    this._sh = h
    this._aw = aw
    this._ah = ah
    this._text = text || ""
    this._blackColor = color || ""
    this._drawText()
};



/**设置长度 */
Object.defineProperty(Sprite_Art.prototype, 'text', {
    //获得 
    get: function () {
        return this._text;
    },
    set: function (value) {
        var value = "" + value
        if (this._text !== value) {
            this._text = value
            this._drawText()
        }
    },
    configurable: true
});


Object.defineProperty(Sprite_Art.prototype, 'sw', {
    //获得 
    get: function () {
        return this._sw;
    },
    set: function (value) {
        if (this._sw !== value) {
            this._sw = value
            this._drawText()
        }
    },
    configurable: true
});

Object.defineProperty(Sprite_Art.prototype, 'sh', {
    //获得 
    get: function () {
        return this._sh;
    },
    set: function (value) {
        if (this._sh !== value) {
            this._sh = value
            this._drawText()
        }
    },
    configurable: true
});

Object.defineProperty(Sprite_Art.prototype, 'aw', {
    //获得 
    get: function () {
        return this._aw;
    },
    set: function (value) {
        if (this._aw !== value) {
            this._aw = value
            this._drawText()
        }
    },
    configurable: true
});

Object.defineProperty(Sprite_Art.prototype, 'ah', {
    //获得 
    get: function () {
        return this._ah;
    },
    set: function (value) {
        if (this._ah !== value) {
            this._ah = value
            this._drawText()
        }
    },
    configurable: true
});


/**设置长度 */
Object.defineProperty(Sprite_Art.prototype, 'blackColor', {
    //获得 
    get: function () {
        return this._blackColor;
    },
    set: function (value) {
        if (this._blackColor !== value) {
            this._blackColor = value
            this._drawText()
        }
    },
    configurable: true
});

Object.defineProperty(Sprite_Art.prototype, 'blackColorType', {
    //获得 
    get: function () {
        return this._blackColorType;
    },
    set: function (value) {
        if (this._blackColorType !== value) {
            this._blackColorType = value
            this._drawText()
        }
    },
    configurable: true
});


Sprite_Art.prototype._drawColor = function () {
  
}


Sprite_Art.prototype._drawText = function () {
    if (this._aw || this._ah) {

        if (!this._aw || this._aw == 1) {
            var w = this._sw
        } else {
            var w = Infinity
        }

        if (!this._ah || this._ah == 1) {
            var h = this._sh
        } else {
            var h = Infinity
        }
        var texts = this.testTextEx(this.text, 0, 0, w, h)
        var page = texts.list[0]
        var test = page.test
        var w = !this._aw ? this._sw : test.x + test.w
        var h = !this._ah ? this._sh : test.y + test.h

        w = Math.ceil(w)
        h = Math.ceil(h)
        if (w != this.bitmap.width || h != this.bitmap.height) {
            this.bitmap.initialize(w, h)
        }
    }
    this.bitmap.clear()


    this._drawColor()

    var l = this._text
    if (Array.isArray(l)) {
        for (var i = 0; i < l.length; i++) {
            var t = l[i] || 0
            this.drawTextEx(t, 0, 0, this.bitmap.width, this.bitmap.height)
        }
    } else if (typeof l == "string") {
        this.drawTextEx(l, 0, 0, this.bitmap.width, this.bitmap.height)
    }
}


Sprite_Art.addEmpty = function (n, l, t) {
    var v = "" + n
    while (v.length < l) {
        v = t ? v + " " : " " + v
    }
    return v
}
 
