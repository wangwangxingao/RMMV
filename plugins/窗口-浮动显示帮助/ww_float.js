//=============================================================================
// Window_FloatHelp.js
//=============================================================================
/*:
 * @plugindesc 窗口浮动帮助
 * @author wangwang
 *
 * @param  Window_FloatHelp 
 * @desc 确定是窗口浮动帮助的参数,请勿修改
 * @default 汪汪 
 *
 * @param 浮动
 * @desc 浮动设置
 * @default 浮动设置
 *
 * @param startCount
 * @desc 开始计数,决定窗口出现前等待的时间
 * @default -100
 *
 * @param addCount
 * @desc 添加计数,决定窗口透明度改变速度
 * @default 5
 *
 * @param endCont
 * @desc 结束计数,决定窗口最后透明度
 * @default 255
 *
 * @param 窗口
 * @desc 窗口设置
 * @default 窗口设置
 *
 * @param pictureWidth
 * @desc 图片宽
 * @default 144
 *
 * @param minWidth
 * @desc 窗口最小宽
 * @default 0
 *
 * @param minHeight
 * @desc 窗口最小高
 * @default 0
 * 
 * @param maxWidth
 * @desc 窗口最大宽
 * @default 408
 *
 * @param maxHeight
 * @desc 窗口最大高
 * @default 316 
 *
 * @param 滚动
 * @desc 滚动设置
 * @default 滚动设置
 *
 * @param startYCount
 * @desc 开始y计数,决定当需要滚动时,滚动前暂时停留的时间
 * @default -100
 *
 * @param addYCount
 * @desc 添加y计数,决定当需要滚动时,计数更新速度
 * @default 1
 *
 * @param waitYCont
 * @desc 等待y计数,决定当需要滚动时,滚动完成后停留的时间
 * @default 100
 *
 * @help
 * 帮助的信息
 * \nw 换行 其他如 显示文本
 *
 *
 */
Window_Selectable.prototype.setHelpWindowItem = function (item) {
    if (this._helpWindow) {
        this._helpWindow.setLy(this)
        this._helpWindow.setItem(item);
    }
};

Scene_MenuBase.prototype.createHelpWindow = function () {
    this._helpWindow = new Window_Help();
    this.addChild(this._helpWindow);
};


Scene_Battle.prototype.createHelpWindow = function () {
    //帮助窗口 = 新 窗口帮助
    this._helpWindow = new Window_Help();
    //帮助窗口 设为 不可见 
    this._helpWindow.visible = false;
    //添加窗口(帮助窗口) 
    this.addChild(this._helpWindow);
};




Window_Base.deepCopy = function (that) {
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



Bitmap._window = null
Bitmap.prototype.window = function () {
    if (!Bitmap._window) {
        Bitmap._window = new Window_Base()
    }
    Bitmap._window.contents = this
    return Bitmap._window
}




Bitmap.prototype._makeFontNameText = function () {
    return (this.fontBold ? "Bold " : '') + (this.fontItalic ? 'Italic ' : '') +
        this.fontSize + 'px ' + this.fontFace;
};


Window_Base.prototype.standardFontBold = function () {
    return false
};

/** */
Window_Base.prototype.standardFontItalic = function () {
    return false
};

/**字体设置 */
Window_Base.prototype.fontSettings = function (i) {
    if (i || this._fontnametext) {
        this._fontnametext = this.makeFontSettings(this.contents)
    }
    return this._fontnametext
};


Window_Base.prototype.standardTextColor = function () {
    return '#ffffff';
};

Window_Base.prototype.standardFontSize = function () {
    return 20;
};

/**文本高 */
Window_Base.prototype.standardOutlineColor = function () {

    return 'rgba(0, 0, 0, 0.5)';
};
Window_Base.prototype.standardOutlineWidth = function () {

    return 4;
};


Window_Base.prototype.standardBS = function () {
    return true;
};

/**还原 */
Window_Base.prototype.resetFontSettings = function () {
    this.contents.textColor = this.standardTextColor()
    this.contents.fontItalic = this.standardFontItalic()
    this.contents.fontBold = this.standardFontBold()
    this.contents.fontFace = this.standardFontFace();
    this.contents.fontSize = this.standardFontSize();
    this.contents.outlineColor = this.standardOutlineColor();
    this.contents.outlineWidth = this.standardOutlineWidth();

    this._windowSpriteContainer.visible = this.standardBS()

    this.fontSettings(1)
    this.reHjg()
    this.reWjg()
    this.rejiange()
};


Window_Base.prototype.makeFontSettings = function (bitmap) {
    if (bitmap) {
        return "" +
            (bitmap.fontFace || "") + " " +
            (bitmap.fontSize || "") + " " +
            (bitmap.fontItalic || "") + " " +
            (bitmap.fontBold || "") + " " +
            (bitmap.textColor || "") + " " +
            (bitmap.outlineColor || "") + " " +
            (bitmap.outlineWidth || "")
    } else {
        return ""
    }
}





Window_Base.prototype.saveFontSettings = function (bitmap) {
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


Window_Base.prototype.loadFontSettings = function (bitmap, fontSet) {
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
Window_Base.prototype.calcTextHeight = function () {
    var maxFontSize = this.contents.fontSize;
    var textHeight = maxFontSize + 8;
    return textHeight;
};


Window_Base.prototype.makePage = function (textState) {
    var page = {
        "type": "page",
        "set": {},
        "list": [],
        "test": { "x": 0, "y": 0, "w": 0, "h": 0 }
    }
    page.set = Window_Base.deepCopy(textState.pageset)
    return page
};
Window_Base.prototype.makeLine = function (textState) {
    return { "type": "line", "list": [], "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};
Window_Base.prototype.makeText = function (textState) {
    return { "type": "text", "text": "", "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};
Window_Base.prototype.makeIcon = function (textState) {
    return { "type": "icon", "icon": "", "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};

/**测试文字增强 */
Window_Base.prototype.testTextEx = function (text, x, y, w, h, wt, ht, facepos, wz) {
    if (text) {
        var draw = { x: x || 0, y: y || 0 }
        var pageset = {
            w: w || Infinity,
            h: h || Infinity,
            wtype: wt,
            htype: ht,
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
    } else {
        return null;
    }
};


/**设置绘制xy */
Window_Base.prototype.setDrawxy = function (textState, draw) {
    if (textState && draw) {
        textState.draw = draw
        return textState;
    } else {
        return null;
    }
};

/**设置页设置 */
Window_Base.prototype.setTextPageset = function (textState, pageset) {
    if (textState && pageset) {
        textState.pageset = pageset
        return textState;
    } else {
        return null;
    }
};


/**制作页 */
Window_Base.prototype.testMakePages = function (textState) {
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
            } else if (type == "icon" || type == "text") {
                this.testPushText(textState, obj)
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
Window_Base.prototype.testMakeList = function (textState) {
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

Window_Base.prototype.indexCharacter = function (textState, index) {
    return textState.list[index];
};

Window_Base.prototype.needsCharacter = function (textState) {
    return this.indexCharacter(textState, textState.index)
};

Window_Base.prototype.nextCharacter = function (textState) {
    return this.indexCharacter(textState, textState.index + 1)
};

/** */
Window_Base.prototype.drawTextEx = function (text, x, y, w, h, wt, ht) {
    if (text) {
        var textState = this.testTextEx(text, x, y, w, h, wt, ht);
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
Window_Base.prototype.drawTextEx2 = function (text, x, y, w, h, wt, ht) {
    if (text) {
        var textState = this.testTextEx(text, x, y, w, h, wt, ht);
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


Window_Base.prototype.drawTextEx3 = function (text, x, y, w, h, wt, ht) {
    if (text) {
        var textState = this.testTextEx(text, x, y, w, h, wt, ht);
        this.resetFontSettings();
        while (textState.index < textState.list.length) {
            this.processDrawCharacter(textState);
            textState.index += 1
            if (this.needsNewPage(textState)) {
                break
            }
        }
        this.resetFontSettings();
        return textState.pages[0].test;
    } else {
        return 0;
    }
};


/**添加所有 */
Window_Base.prototype.tslPushAll = function (textState) {
    this.tslPushHear(textState)
    while (textState.textindex < textState.text.length) {
        this.tslPushCharacter(textState);
    }
    this.tslPushEnd(textState)
};

/**测试添加头 */
Window_Base.prototype.tslPushHear = function (textState) {
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
Window_Base.prototype.tslPushEnd = function (textState) {
    textState.textindex = 0
    delete textState.page
    delete textState.line
};


/**添加其他 */
Window_Base.prototype.tslPush = function (textState, obj) {
    textState.tsl.push(obj)
};


/**测试添加页 */
Window_Base.prototype.tslPushPage = function (textState, page) {
    var page = page || this.makePage(textState)
    textState.page = page
    this.tslPush(textState, page)
};


/**测试添加行 */
Window_Base.prototype.tslPushLine = function (textState, line) {
    var line = line || this.makeLine()
    var page = textState.page
    textState.line = line
    this.tslPush(textState, line)
};


/**页设置脸图 */
Window_Base.prototype.tslPushPic = function (textState, pic) {
    if (pic) {
        ImageManager.loadPicture(pic.name)
        var page = textState.page
        page.set.ps = page.set.ps || {}
        page.set.ps[pic.index] = pic.name
        this.tslPush(textState, pic)
    }
}

/**页设置脸图 */
Window_Base.prototype.tslPushFace = function (textState, face) {
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
Window_Base.prototype.tslPushOther = function (textState, text) {
    if (text) {
        this.tslPush(textState, text)
    }
};
//****************************************************************** */

/**测试添加页 */
Window_Base.prototype.testPushPage = function (textState, page) {
    /**处理上一个页 */
    this.testPushLine(textState, 0, 1)
    var page = page || this.makePage(textState)
    textState.page = page
    textState.pages.push(page)
    textState.line = null
};


/**测试添加行 */
Window_Base.prototype.testPushLine = function (textState, line, cs) {
    var line = line || this.makeLine()
    var page = textState.page
    var line0 = textState.line
    /**有页时 */
    if (page) {
        /**有上一行时 */
        if (line0) {
            var ph = page.test.h
            var lh = line0.test.h
            //间隔
            var jh = (ph == 0 || lh == 0) ? 0 : this.getHjg() || 0

            line0.test.y = page.test.h + jh
            page.test.h = line0.test.h + line0.test.y

            page.test.w = Math.max(page.test.w, line0.test.w)
            var must = page.set
            var fw = Window_Base._faceWidth + 24
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



/**添加字符 */
Window_Base.prototype.testPushText = function (textState, text) {
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
    var fw = Window_Base._faceWidth + 24
    var fw = page.set.facepos == 3 ? fw * 2 : page.set.facepos ? fw : 0
    //行可以放开字 
    if (lw + jw + tw <= sw - fw || lw == 0) {
        //添加字符 
        text.test.x = lw + jw
        line.test.w = text.test.x + tw
        line.test.h = Math.max(line.test.h, text.test.h)
        this.testPushOther(textState, text)

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
            page2.set = Window_Base.deepCopy(page.set)
            this.testPushPage(textState, page2)
            //行添加到新页
            this.testPushLine(textState, line)

        }
    }
    //行放不开
    else {
        //添加新行
        var line2 = this.makeLine()
        line2.type = "addline"
        line2.set = line.set
        this.testPushLine(textState, line2)
        this.testPushText(textState, text)
    }
};

/**添加其他 */
Window_Base.prototype.testPushOther = function (textState, obj) {
    textState.line.list.push(obj)
};

/**添加结束 */
Window_Base.prototype.testPushEnd = function (textState) {
    this.testPushLine(textState, 0, 1)
};

/***************************************************************************** */


//处理字符
Window_Base.prototype.tslPushCharacter = function (textState) {
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
Window_Base.prototype.tslPushEscapeCode = function (textState) {
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
Window_Base.prototype.tslPushEscapeCharacter = function (textState, code) {
    switch (code) {
        case 'C':
            this.tslPushTextColor(textState, this.tslPushTextColorEscapeParam(textState));
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
        case 'HT':
            this.tslPushHT(textState, this.tslPushEscapeParam(textState, 0))
            break
        case 'WT':
            this.tslPushWT(textState, this.tslPushEscapeParam(textState, 0))
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
    }
};






Window_Base.prototype.obtainEscapeParamExs = function (textState) {
    var arr = /^\[\[(.*?)\]\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        var re = "[" + arr[1] + "]"
        return JSON.parse(re)
    }
    return arr;
};






/**脸图位置 */
Window_Base.prototype.facePos = function () {
    return this._facepos || 0
}


/**文字间隔 */
Window_Base.prototype.jiange = function () {
    return this._jiange || 0
};

/**还原间隔 */
Window_Base.prototype.rejiange = function () {
    this._jiange = this.jiangebase()
};

/**间隔基础 */
Window_Base.prototype.jiangebase = function () {
    return 0
};

/**设置间隔 */
Window_Base.prototype.setJiange = function (i) {
    this._jiange = i
};

Window_Base.prototype.setWjg = function (jg) {
    this._wjg = jg || 0
};

Window_Base.prototype.getWjg = function () {
    return this._wjg
};

Window_Base.prototype.reWjg = function () {
    this.setWjg(0)
};


Window_Base.prototype.setHjg = function (jg) {
    this._hjg = jg || 0
};

Window_Base.prototype.getHjg = function () {
    return this._hjg
};

Window_Base.prototype.reHjg = function () {
    this.setHjg(0)
};


Window_Base.prototype.rejg = function () {
    this.reWjg()
    this.reHjg()
};


/**文本状态列表 添加行间隔 */
Window_Base.prototype.tslPushWJ = function (textState, wjg) {
    this.setWjg(wjg)
    var obj = {
        "type": "wjg",
        "value": wjg
    }
    this.tslPushOther(textState, obj)
};

/**文本状态列表 添加宽间隔 */
Window_Base.prototype.tslPushHJ = function (textState, hjg) {
    this.setHjg(hjg)
    var obj = {
        "type": "hjg",
        "value": hjg
    }
    this.tslPushOther(textState, obj)
};



Window_Base.prototype.tslPushDXY = function (textState, list) {
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

Window_Base.prototype.tslPushWH = function (textState, list) {
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

Window_Base.prototype.makeNewContents = function (textState, list) {
    var w = (list && (list[0] || 0) * 1) || this.windowWidth();
    var h = (list && (list[1] || 0) * 1) || this.windowHeight()
    this.contents = new Bitmap(w, h);
    this.resetFontSettings();
};

/**添加新行 */
Window_Base.prototype.tslPushNewLine = function (textState) {
    textState.textindex++;
    this.tslPushLine(textState)
};

/**进行行对象 */
Window_Base.prototype.tslPushNewLineL = function (textState) {
    textState.textindex+=2;
    this.tslPushLine(textState)
};

/**进行新页对象 */
Window_Base.prototype.tslPushNewPage = function (textState) {
    textState.textindex++
    this.tslPushPage(textState)
    this.tslPushLine(textState)
    this.resetFontSettings();
};

/**进行新页对象 */
Window_Base.prototype.tslPushNewPageY = function (textState) {
    var page = this.makePage(textState)

    var line = this.makeLine(textState)
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        textState.textindex += arr[0].length;
        page.set.wz = arr[1] * 1
    }
    this.tslPushPage(textState, page)
    this.tslPushLine(textState, line)
    this.resetFontSettings();
};

Window_Base.prototype.tslPushNewPageY2 = function (textState) {
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


Window_Base.prototype.tslPushWT = function (textState, wjg) {
    textState.page.set.wtype = wjg
};

Window_Base.prototype.tslPushHT = function (textState, wjg) {
    textState.page.set.htype = wjg
};



Window_Base.textf = {}

/**处理正常字符 */
Window_Base.prototype.tslPushNormalCharacter = function (textState) {
    //c = 文本状态 [文本状态 索引++]
    var c = textState.text[textState.textindex++];
    //w = c 文本宽 
    var f = this.fontSettings()
    var textf = Window_Base.textf
    if (textf[f]) {
        if (textf[f][c]) {
            var w = textf[f][c]["w"]
            var h = textf[f][c]["h"]
        } else {
            var w = this.textWidth(c);
            var h = this.calcTextHeight()
            var w2 = w + w
            var b = new Bitmap(w2, h)
            this.cloneBitmapFont(b, this.contents)
            b.drawText(c, 0, 0, w2, h)

            textf[f][c] = { w: w, h: h, b: b }
        }
    } else {
        textf[f] = {}
        var w = this.textWidth(c);
        var h = this.calcTextHeight()

        var w2 = w + w
        var b = new Bitmap(w2, h)
        this.cloneBitmapFont(b, this.contents)
        b.drawText(c, 0, 0, w2, h)
        textf[f][c] = { "w": w, "h": h, b: b }
    }
    var text = this.makeText()
    text.text = c
    text.test.w = w
    text.test.h = h
    this.tslPushOther(textState, text)
};



Window_Base.prototype.tslPushTWH = function (textState, list) {
    var text = this.makeText()
    text.text = ""
    var w = list[0] * 1
    var h = list[1] * 1
    text.test.w = isFinite(w) ? w : 0
    text.test.h = isFinite(h) ? h : 0
    this.tslPushOther(textState, text)
};


Window_Base.prototype.tslPushTextColor = function (textState, color) {
    this.contents.textColor = color;
    var obj = {
        "type": "textColor",
        "value": color
    }
    this.tslPushFont(textState, obj)
};

Window_Base.prototype.tslPushOutColor = function (textState, color) {
    var obj = {
        "type": "outlineColor",
        "value": color
    }
    this.tslPushFont(textState, obj)
};

Window_Base.prototype.tslPushOutWidth = function (textState, width) {
    var obj = {
        "type": "outlineWidth",
        "value": width
    }
    this.tslPushFont(textState, obj)
};



Window_Base.prototype.tslPushDrawIcon = function (textState, iconId) {
    var obj = this.makeIcon()
    obj.icon = iconId
    obj.test.w = Window_Base._iconWidth + 4;
    obj.test.h = Window_Base._iconHeight + 4;
    this.tslPushOther(textState, obj)
};


Window_Base.prototype.tslPushChangeFontItalic = function (textState) {
    var Italic = !this.contents.fontItalic
    var Italic = !!this.tslPushEscapeParam(textState, Italic)
    this.tslPushFontItalic(textState, Italic)
}


Window_Base.prototype.tslPushFontItalic = function (textState, Italic) {
    this.contents.fontItalic = Italic;
    var obj = {
        "type": "fontItalic",
        "value": Italic
    }
    this.tslPushFont(textState, obj)
};

/**设置粗体 */
Window_Base.prototype.tslPushChangeFontBlod = function (textState) {
    var bold = !this.contents.fontBold
    var bold = !!this.tslPushEscapeParam(textState, bold)
    this.tslPushFontBlod(textState, bold)
}

/**文本状态列表 添加粗体 */
Window_Base.prototype.tslPushFontBlod = function (textState, bold) {
    this.contents.fontBold = bold;
    var obj = {
        "type": "fontBold",
        "value": bold
    }
    this.tslPushFont(textState, obj)
};

/**字体 */
Window_Base.prototype.tslPushChangeFontSize = function (textState, i) {
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
Window_Base.prototype.tslPushFontSize = function (textState, fontSize) {
    var fontSize = Math.min(108, Math.max(fontSize, 12))
    this.contents.fontSize = fontSize;
    var obj = {
        "type": "fontSize",
        "value": fontSize
    }
    this.tslPushFont(textState, obj)
};

/**文本状态列表 添加字体 */
Window_Base.prototype.tslPushFont = function (textState, obj) {
    this.fontSettings(1)
    this.tslPushOther(textState, obj)
};



/**文本状态列表添加脸图 */
Window_Base.prototype.tslPushFaceParam = function (textState) {
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
Window_Base.prototype.tslPushPicParam = function (textState) {
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
Window_Base.prototype.tslPushEscapeParam = function (textState, un) {
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
Window_Base.prototype.tslPushEscapeParamEx = function (textState) {
    var arr = /^\[(.*?)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return arr[1].split(/ +/)
    }
    return arr;
};


/**获取颜色参数 */
Window_Base.prototype.tslPushTextColorEscapeParam = function (textState) {
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
Window_Base.prototype.textContentsWidth = function () {
    return this.contentsWidth()
}



/**是结束在文本 */
Window_Base.prototype.isEndOfText = function (textState) {
    return textState.index >= textState.list.length;
};

/**需要新页 */
Window_Base.prototype.needsNewPage = function (textState) {
    return (!this.isEndOfText(textState) &&
        this.needsCharacter(textState) && (
            this.needsCharacter(textState).type == "page" ||
            this.needsCharacter(textState).type == "addpage")
    );
};




/**进行绘制对象 */
Window_Base.prototype.processDrawCharacter = function (textState) {
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
            case "fontFace":
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
        }
    }
}



Window_Base.prototype.processFont = function (type, value) {
    this.drawBitmapFont(this.contents, type, value)
    this.fontSettings(1)
}


Window_Base.prototype.processText = function (c, x, y, w, h) {
    this.drawBitmapText(this.contents, c, x, y, w, h)
}

Window_Base.prototype.processIcon = function (iconIndex, x, y) {
    this.drawBitmapIcon(this.contents, iconIndex, x, y)
}


Window_Base.prototype.cloneBitmapFont = function (b, b2) {
    var font = b2 || this.saveFontSettings()
    b && font && this.loadFontSettings(b, font)
}

Window_Base.prototype.drawBitmapFont = function (b, type, value) {
    b && (b[type] = value)
};

Window_Base.prototype.drawBitmapIcon = function (b, iconIndex, x, y) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    b && b.blt(bitmap, sx, sy, pw, ph, x, y);
};


Window_Base.prototype.drawBitmapText = function (b, c, x, y, w, h) {
    b && b.drawText(c, x, y, w, h);
};

Window_Base.prototype.drawBitmapText = function (b, c, x, y, w, h) {
    if (!b) { return }
    var f = this.fontSettings()
    var textf = Window_Base.textf
    if (textf && textf[f] && textf[f][c]) {
        var bitmap = textf[f][c].b
        if (bitmap) {
            b.blt(bitmap, 0, 0, w, h, x, y, w, h)
        }
    }
};



/**进行普通文字处理2 */
Window_Base.prototype.processNormalCharacter2 = function () { };








function Window_FloatHelp() {
    this.initialize.apply(this, arguments);
}


Window_Help = Window_FloatHelp


//设置原形 
Window_FloatHelp.prototype = Object.create(Window_Base.prototype);
//设置创造者
Window_FloatHelp.prototype.constructor = Window_FloatHelp;

//图片宽
Window_FloatHelp._px = 144

//窗口最小宽
Window_FloatHelp._ckiw = 0
//窗口最小高
Window_FloatHelp._ckih = 0
//窗口最大宽
Window_FloatHelp._ckaw = 408
//窗口最大高
Window_FloatHelp._ckah = 312
//开始y计数
Window_FloatHelp._startYCount = -100
//添加y计数
Window_FloatHelp._addYCount = 1
//等待y计数
Window_FloatHelp._waitYCont = 100
//开始计数
Window_FloatHelp._startCount = -100
//添加计数
Window_FloatHelp._addCount = 5
//结束计数
Window_FloatHelp._endCont = 255

//读取
Window_FloatHelp.load = function () {
    for (var i = 0; i < $plugins.length; i++) {
        var plugin = $plugins[i]
        if (plugin.parameters["Window_FloatHelp"]) {
            if (plugin.status == true) {
                var w = plugin.parameters["minWidth"] * 1
                Window_FloatHelp._ckiw = isFinite(w) ? w : Window_FloatHelp._ckiw
                var h = plugin.parameters["minHeight"] * 1
                Window_FloatHelp._ckih = isFinite(h) ? h : Window_FloatHelp._ckih
                var w = plugin.parameters["maxWidth"] * 1
                Window_FloatHelp._ckaw = isFinite(w) ? w : Window_FloatHelp._ckaw
                var h = plugin.parameters["maxHeight"] * 1
                Window_FloatHelp._ckah = isFinite(h) ? h : Window_FloatHelp._ckah

                var h = plugin.parameters["startYCount"] * 1
                Window_FloatHelp._startYCount = isFinite(h) ? h : Window_FloatHelp._startYCount
                var h = plugin.parameters["addYCount"] * 1
                Window_FloatHelp._addYCount = isFinite(h) ? h : Window_FloatHelp._addYCount
                var h = plugin.parameters["waitYCont"] * 1
                Window_FloatHelp._waitYCont = isFinite(h) ? h : Window_FloatHelp._waitYCont
                var h = plugin.parameters["startCount"] * 1
                Window_FloatHelp._startCount = isFinite(h) ? h : Window_FloatHelp._startCount
                var h = plugin.parameters["addCount"] * 1
                Window_FloatHelp._addCount = isFinite(h) ? h : Window_FloatHelp._addCount
                var h = plugin.parameters["endCont"] * 1
                Window_FloatHelp._endCont = isFinite(h) ? h : Window_FloatHelp._endCont
            }
        }
    }
}
Window_FloatHelp.load()

//初始化
Window_FloatHelp.prototype.initialize = function (w, h) {
    Window_Base.prototype.initialize.call(this, 0, 0, 0, 0);
    this._textWh = [0, 0]
    this._text = '';
    this._picture = new Sprite()
    this._picture.bitmap = new Bitmap()
    this.startFloat()
    this._lywin = null
    this._lyindax = -10
    this._ckw = 0 //w || 0
    this._ckh = 0 //h || 0
};

//开始计数
Window_FloatHelp.prototype.startCount = function () {
    return Window_FloatHelp._startCount
};

//添加计数
Window_FloatHelp.prototype.addCount = function () {
    return Window_FloatHelp._addCount
};
//设置计数
Window_FloatHelp.prototype.setCount = function (i) {
    this._count = i || 0
};
//结束计数
Window_FloatHelp.prototype.endCont = function (i) {
    return Window_FloatHelp._endCont
};

//开始y计数
Window_FloatHelp.prototype.startYCount = function () {
    return Window_FloatHelp._startYCount
};
//添加y计数
Window_FloatHelp.prototype.addYCount = function () {
    return Window_FloatHelp._addYCount
};
//设置y计数
Window_FloatHelp.prototype.setYCount = function (i) {
    this._ycount = i || 0
};
//结束y计数
Window_FloatHelp.prototype.endYCont = function () {
    var c = this.contents.height - (this.height - this.standardPadding() * 2)
    return c
};

//等待y计数
Window_FloatHelp.prototype.waitYCont = function () {
    return Window_FloatHelp._waitYCont
};


//更新
Window_FloatHelp.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    this.updateFloat()
};

//更新浮动
Window_FloatHelp.prototype.updateFloat = function () {
    if (this._text) {
        if (this._count < this.endCont()) {
            this._count += this.addCount()
            this._count = Math.min(this._count, this.endCont())
            if (this._count >= 0) {
                this.setOpacity(this._count)
            }
        } else {
            if (this._ygd == true) {
                if (this._ycount < this.endYCont() + this.waitYCont()) {
                    this._ycount += this.addYCount()
                    if (this._ycount > 0) {
                        if (this._ycount < this.endYCont()) {
                            this.origin.y = Math.round(this._ycount)
                        } else if (this._ycount < this.endYCont() + this.waitYCont()) {
                            this.origin.y = this.contents.height - (this.height - this.standardPadding() * 2)
                        }
                    }
                } else {
                    this.origin.y = 0
                    this._ycount = this.startYCount()
                }
            }
        }
    }
};



//开始浮动
Window_FloatHelp.prototype.startFloat = function () {
    this._ycount = this.startYCount()
    this._ygd = false
    this._count = this.startCount()
    this.setOpacity(this._count)
    this.updateXywh()
    this.origin.y = 0
};


Window_FloatHelp.prototype.updateXywh = function () {
    if (this._lywin) {
        var rect = this.getRect(this._lywin)
        var x0 = rect.x
        var y0 = rect.y
        var x1 = rect.x + rect.width
        var y1 = rect.y + rect.height
        var x = 0
        var y = 0
        var w = this._ckw
        var h = this._ckh

        if (!w && !h) {
            var wh = this.getWh()
            var w = wh[0].clamp(Window_FloatHelp._ckiw, Window_FloatHelp._ckaw)
            var h = wh[1].clamp(Window_FloatHelp._ckih, Window_FloatHelp._ckah)
        }
        w += Window_FloatHelp._px
        var s = this.standardPadding()
        var sw = SceneManager._screenWidth
        if ((sw - x1 - w) > (x0 - w)) {
            x = x1 + s
        } else {
            x = x0 - w + s
        }
        var sh = SceneManager._screenHeight
        if ((sh - y1 - h) > (y0 - h)) {
            y = y1 + s
        } else {
            y = y0 - h + s
        }
        this.setMove(x, y, w, h)
    }
};

Window_FloatHelp.prototype.getWh = function () {
    return this._textWh
};

Window_FloatHelp.prototype.getRect = function (ly) {
    var ly = ly
    var rect = ly.itemRect(ly._index)
    rect.x -= ly.canvasToLocalX(0)
    rect.y -= ly.canvasToLocalY(0)
    return rect
};

Window_FloatHelp.prototype.setMove = function (x, y, w, h) {
    var w = w || 0
    var h = h || 0
    var x = x || 0
    var y = y || 0
    var x = x.clamp(0, SceneManager._screenWidth - w)
    var y = y.clamp(0, SceneManager._screenHeight - h)
    this.move(x, y, w, h)
};

//设置来源层
Window_FloatHelp.prototype.setLy = function (win) {
    this._lywin = win;
    this._lyindex = -10
};


//设置文本
Window_FloatHelp.prototype.setText = function (text) {
    this._text = text;
    this.startFloat()
    this.refresh()
};





//设置不透明度
Window_FloatHelp.prototype.setOpacity = function (i) {
    var i = i || 0
    this.opacity = i
    this.contentsOpacity = i
    this.backOpacity = Math.min(i, this.standardBackOpacity())
    this._picture.opacity = i
}


//清除
Window_FloatHelp.prototype.clear = function () {
    this.setText('');
};

//设置项目
Window_FloatHelp.prototype.setItem = function (item) {
    if(item){p
        var text = ""
    }else{
        if(item.meta && "help" in item.meta ){
            var set = null 
            try {
                var set = JSON.parse(item.meta.help) 
            } catch (error) { 
            }  
            var list = DataMessage.pushList(item)

            var text = DataMessage.list2Text(list,"\n")

        }else{

            var text = item.description || ''
        }
    }



    this.setText(item ? item.description : '');
};

//刷新
Window_FloatHelp.prototype.refresh = function () {
    this._textWh = [0, 0]
    this.setPicture("")
    this.contents.clear();

    var w = this._ckw
    var h = this._ckh
 
    if (!w && !h) {
        this._textWh = this.drawTextEx3(this._text, Window_FloatHelp._px, 0, Window_FloatHelp._ckaw);
    } else {
        this._textWh = this.drawTextEx3(this._text, Window_FloatHelp._px, 0, Window_FloatHelp._ckaw);
    
    }
};



Window_FloatHelp.prototype.drawTextEx3 = function (text, x, y, w, h, wt, ht) {
    if (text) {
        var textState = this.testTextEx(text, x, y, w, h, wt, ht);
        var texttest = textState.pages[0].test
        var w = texttest.w + x
        var h = texttest.h

        this.contents = new Bitmap(w, h);
        this.resetFontSettings();
        while (textState.index < textState.list.length) {
            this.processDrawCharacter(textState);
            textState.index += 1
            if (this.needsNewPage(textState)) {
                break
            }
        }
        this.resetFontSettings();
        return [w, h];
    } else {
        return [0, 0];
    }
};


Window_FloatHelp.prototype.tslPushEscapeCharacter = function (textState, code) {
    switch (code) {
        case "T":
            this.setPicture(tslPushEscapeParam)
            break
    }
    Window_Base.prototype.tslPushEscapeCharacter.call(this, textState, code)
};




Window_FloatHelp.prototype.setPicture = function (name) { 
    if(name){}
    this._picture.bitmap = ImageManager.loadPicture(name) 
};

