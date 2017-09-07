
//=============================================================================
// 2w_message.js
//=============================================================================

/*:
 * @plugindesc 显示文本加强
 * @author 汪汪
 * 
 * @help 
 *  
 * \. \|  : 扩展  \.[z] 和 \|[z] 方法  等待z
 * \{ \}  : 扩展  支持\{[z]  \}[z] 增加减少字号  \{}[z] 设置字号
 * \C : 扩展 支持 \C[#FFFF00]
 * \Y : 一个新页  支持 \Y 和 \Y[n] 设置位置 ,
 *      带参数时 会重置图片,间隔时间,字体,脸图等
 * \T[n name] :
 *    在message 下显示name的图片, 
 *    n 位置: 锚点 图片的 123456789顶点 坐标 message的 123456789顶点
 *            当 小于10 时 锚点 坐标 都为 n   比如 1 ,  图片以左下角正对信息框的左下角 
 *            当 大于10 时 前面为 锚点 后面为坐标  如 12 表示 以左下顶点为锚点 坐标为 message的下顶点 
 * \S[n] :设置每个字符之间间隔的时间,换页重置
 * \F[n name index] :
 *      在message 下显示name index的脸图, n位置 0 左 1 左 2 右
 * \=  \=[z] 
 *     设置粗体 , 0 为 false  , 1 为true ,不填值为取现值的相反值
 * \/  \/[z] 
 *     设置斜体 , 0 为 false  , 1 为true ,不填值为取现值的相反值
 * 
 * \WJ  \WJ[z] 
 *     设置横字间隔 , 不填为 0
 * \HJ  \HJ[z] 
 *     设置纵行间隔 , 不填为 0
 * 
 * 
 * 位置为最上方时会调整高度
 * 
 */




/*deepCopy = function (that) {
    var obj
    if (typeof (that) === "object") {
        if (that === null) {
            obj = null;
        } else if (Array.isArray(that)) {  //Object.prototype.toString.call(that) === '[object Array]') { 
            obj = [];
            for (var i = 0; i < that.length; i++) {
                obj[i] = deepCopy(that[i]);
            }
        } else {
            obj = {}
            for (var i in that) {
                obj[i] = deepCopy(that[i])
            }
        }
    } else {
        obj = that
    }
    return obj;
};*/




Bitmap.prototype.initialize = function (width, height) {
    this._canvas = document.createElement('canvas');
    this._context = this._canvas.getContext('2d');
    this._canvas.width = Math.max(width || 0, 1);
    this._canvas.height = Math.max(height || 0, 1);
    this._baseTexture = new PIXI.BaseTexture(this._canvas);
    this._baseTexture.mipmap = false;
    this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this._image = null;
    this._url = '';
    this._paintOpacity = 255;
    this._smooth = false;
    this._loadListeners = [];
    this._isLoading = false;
    this._hasError = false;

    /**字体
     * The face name of the font.
     *
     * @property fontFace
     * @type String
     */
    this.fontFace = 'GameFont';

    /**字体大小
     * The size of the font in pixels.
     *
     * @property fontSize
     * @type Number
     */
    this.fontSize = 28;

    /**黑体
     * Whether the font is bold.
     *
     * @property fontBold
     * @type Boolean
     */
    this.fontBold = false;
    /**斜体
     * Whether the font is italic.
     *
     * @property fontItalic
     * @type Boolean
     */
    this.fontItalic = false;

    /**在CSS格式的文本的颜色。
     * The color of the text in CSS format.
     *
     * @property textColor
     * @type String
     */
    this.textColor = '#ffffff';

    /**在CSS格式的文本轮廓的颜色。
     * The color of the outline of the text in CSS format.
     *
     * @property outlineColor
     * @type String
     */
    this.outlineColor = 'rgba(0, 0, 0, 0.5)';

    /**文字轮廓的宽度。
     * The width of the outline of the text.
     *
     * @property outlineWidth
     * @type Number
     */
    this.outlineWidth = 4;
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

Window_Base.prototype.standardFontItalic = function () {
    return false
};

Window_Base.prototype.fontSettings = function (i) {
    if (i || !this.contents._fontnametext) {
        this.contents._fontnametext = this.contents._makeFontNameText()
    }
    return this.contents._fontnametext
};


Window_Base.prototype.resetFontSettings = function () {
    this.contents.fontItalic = this.standardFontItalic()
    this.contents.fontBold = this.standardFontBold()
    this.contents.fontFace = this.standardFontFace();
    this.contents.fontSize = this.standardFontSize();
    this.fontSettings(1)
    this.resetTextColor();
};


/**文本高 */
Window_Base.prototype.calcTextHeight = function () {
    var maxFontSize = this.contents.fontSize;
    var textHeight = maxFontSize + 8;
    return textHeight;
};


Window_Base.prototype.makePage = function (textState) {
    return { "type": "page", "set": {}, "list": [], "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
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
Window_Base.prototype.testTextEx = function (text, x, y, w, h, wt, ht) {
    if (text) {
        var pageset = { w: w || Infinity, h: h || Infinity, wtype: wt, htype: ht }
        var draw = { x: x || 0, y: y || 0 }
        var t = this.convertEscapeCharacters(text)
        var textState = {
            text:t,
            textindex: 0,
            tsl: [],
            textf: {},


            index: 0,
            pages: [],
            list: [],
            pageset: pageset,
            draw: draw
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



Window_Base.prototype.setDrawxy = function (textState, draw) {
    if (textState && draw) {
        textState.draw = draw
        return textState;
    } else {
        return null;
    }
};

Window_Base.prototype.setTextPageset = function (textState, pageset) {
    if (textState && pageset) {
        textState.pageset = pageset
        return textState;
    } else {
        return null;
    }
};


/**添加字符 */
Window_Base.prototype.testMakePages = function (textState) {
    if (textState) {
        var list = textState.tsl || []
        textState.pages = []
        var face = null
        for (var i = 0; i < list.length; i++) {
            var obj = list[i]
            var type = obj.type 
            if (type == "page") {
                var face = null 
                var page = this.makePage()
                page.set = obj.set
                this.testPushPage(textState, page)
            } else if (type == "line") {
                var line = this.makeLine()
                this.testPushLine(textState, line)
            } else if (type == "icon" || type == "text") {
                this.testPushText(textState, obj,face)
            } else if (type == "face")  { 
                var face = face || []
                face[obj.pos] = obj
                this.testPushOther(textState, obj) 
            }else {
                this.testPushOther(textState, obj)
            }
        }
        this.testPushEnd(textState) 
        return textState
    } else {
        return null
    }
};

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

/**绘制 */
Window_Base.prototype.drawTextEx2 = function (text, x, y, w, h, p, l) {
    if (text) {
        var textState = this.testTextEx(text, x, y, w, h, p, l);
        this.resetFontSettings();

        while (textState.index < textState.list.length) {
            this.processDrawCharacter(textState);
            textState.index++
            if (this.needsNewPage(textState)) {
                break
            }
        }
        this.resetFontSettings();
        return textState;
    } else {
        return 0;
    }
};

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
        this.tslPush(textState, pic)
    }
}

/**页设置脸图 */
Window_Base.prototype.tslPushFace = function (textState, face) {
    if (face) {
        ImageManager.loadFace(face.name)
        var page = textState.page
        if (!page.set.facepos) {
            page.set.facepos = face.pos
        } else {
            //var pos = page.set.facepos
           // face.pos = pos
            if(face.pos != page.set.facepos){
                page.set.facepos = 3
            } 
        }
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
    this.testPushLine(textState, 0, 1)
    var page = page || this.makePage(textState)
    textState.page = page
    textState.pages.push(page)
};
  

/**测试添加行 */
Window_Base.prototype.testPushLine = function (textState, line, cs) {
    var line = line || this.makeLine()
    var page = textState.page
    var line0 = textState.line   
    if (page) {
        if (line0) {
            var ph = page.test.h
            var lh = line0.test.h
            //间隔
            var jh = (ph == 0 || lh == 0) ? 0 : page.set.hjg || 0

            line0.test.y = page.test.h + jh
            page.test.h = line0.test.h + line0.test.y

            page.test.w = Math.max(page.test.w, line0.test.w)
            var must = textState.pageset
            var w = must.w - (page.set.facepos == 3 ? 168 * 2 : page.set.facepos ? 168 : 0)
            var h = must.h
            if (w != Infinity) {
                if (line0.test.w < w) {
                    if (must.wtype === 1 || page.set.wtype === 1) {
                        line0.test.x = (w - line0.test.w) / 2
                    } else if (must.wtype === 2) {
                        line0.test.x = (w - line0.test.w)
                    }
                } else {
                    line0.test.x = 0
                }
            }
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
Window_Base.prototype.testPushText = function (textState, text,face) {

    var text = text || this.makeText()
    var line = textState.line
    var page = textState.page
    var pageset = textState.pageset
  
    //====处理字====
    var lw = line.test.w
    var tw = text.test.w
    //宽间隔
    var jw = (lw == 0 || tw == 0) ? 0 : page.set.wjg || 0
    var sw = pageset.w
    var fw = page.set.facepos == 3 ? 168 * 2 : page.set.facepos ? 168 : 0
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
        var jh = (ph == 0 || lh == 0) ? 0 : page.set.hjg || 0
        var sh = pageset.h
        //行能放到页中 
        if (ph + jh + lh <= sh || ph == 0) {
            //不能放到页中 或者 不是第一行
        } else {
            //添加新页
            textState.line = null
            var page2 = this.makePage(textState)
            page2.type = "addpage"
            page2.set = page.set
            this.testPushPage(textState, page2) 
            //行添加到新页
            this.testPushLine(textState, line) 
            if(face){
                if(face[1]){ 
                    this.testPushOther(textState,face[1]) 
                }
                if(face[2]){
                    this.testPushOther(textState,face[2]) 
                }
            }
        }
    }
    //行放不开
    else {
        //添加新行
        var line2 = this.makeLine()
        line2.type = "addline"
        line2.set = line.set
        this.testPushLine(textState, line2)
        this.testPushText(textState, text,face)
    }
};
 
/**添加其他 */
Window_Base.prototype.testPushOther = function (textState, obj) {  
    textState.line.list.push(obj)
};
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

//处理换码字符
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
        case 'WJ':
            this.tslPushWidth(textState, this.tslPushEscapeParam(textState, 0));
            break;
        case 'HJ':
            this.tslPushHeight(textState, this.tslPushEscapeParam(textState, 0));
            break;
        case 'Y':
            this.tslPushNewPageY(textState)
            break;
    }
};

//处理新行
Window_Base.prototype.tslPushWidth = function (textState, wjg) {
    textState.page.set.wjg = wjg
    var obj = {
        "type": "wjg",
        "value": wjg
    }
    this.tslPushOther(textState, obj)
};

//设置宽
Window_Base.prototype.tslPushHeight = function (textState) {
    textState.page.set.hjg = hjg
    var obj = {
        "type": "hjg",
        "value": hjg
    }
    this.tslPushOther(textState, obj)
};

//处理新行
Window_Base.prototype.tslPushNewLine = function (textState) {
    textState.textindex++;
    this.tslPushLine(textState)
};

/**进行行对象 */
Window_Base.prototype.tslPushNewLineL = function (textState) {
    var line = textState.line
    var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        line.cs = arr[1]
    }
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
    var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        page.set.wz = arr[1] * 1
    }
    this.tslPushPage(textState, page)
    this.tslPushLine(textState, line)
    this.resetFontSettings();
};

/**处理正常字符 */
Window_Base.prototype.tslPushNormalCharacter = function (textState) {
    //c = 文本状态 [文本状态 索引++]
    var c = textState.text[textState.textindex++];
    //w = c 文本宽 
    var f = this.fontSettings()

    var textf = textState.textf
    if (textf[f]) {
        if (textf[f][c]) {
            var w = textf[f][c]["w"]
            var h = textf[f][c]["h"]
        } else {
            var w = this.textWidth(c);
            var h = this.calcTextHeight()
            textf[f][c] = { w: w, h: h }
        }
    } else {
        textf[f] = {}
        var w = this.textWidth(c);
        var h = this.calcTextHeight()
        textf[f][c] = { "w": w, "h": h }
    }
    var text = this.makeText()
    text.text = c
    text.test.w = w
    text.test.h = h
    this.tslPushOther(textState, text)
};


Window_Base.prototype.tslPushTextColor = function (textState, color) {
    this.contents.textColor = color;
    var obj = {
        "type": "color",
        "color": color
    }
    this.tslPushOther(textState, obj)
};

Window_Base.prototype.tslPushDrawIcon = function (textState, iconId) {
    var icon = this.makeIcon()
    icon.icon = iconId
    icon.test.w = Window_Base._iconWidth + 4;
    icon.test.h = Window_Base._iconHeight + 4;
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
        "fontItalic": Italic
    }
    this.tslPushFont(textState, obj)
};

Window_Base.prototype.tslPushChangeFontBlod = function (textState) {
    var bold = !this.contents.fontBold
    var bold = !!this.tslPushEscapeParam(textState, bold)
    this.tslPushFontBlod(textState, bold)
}
//制作字体型号
Window_Base.prototype.tslPushFontBlod = function (textState, bold) {
    this.contents.fontBold = bold;
    var obj = {
        "type": "fontBold",
        "fontBold": bold
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
//制作字体型号
Window_Base.prototype.tslPushFontSize = function (textState, fontSize) {
    var fontSize = Math.min(108, Math.max(fontSize, 12))
    this.contents.fontSize = fontSize;
    var obj = {
        "type": "fontSize",
        "fontSize": fontSize
    }
    this.tslPushFont(textState, obj)
};

Window_Base.prototype.tslPushFont = function (textState, obj) {
    this.fontSettings(1)
    this.tslPushOther(textState, obj)
};



/**获取参数 */
Window_Base.prototype.tslPushEscapeParam = function (textState, un) {
    if (un == undefined) {
        var un = ""
    } else {
        var un = un
    }
    var arr = /^\[\d+\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return parseInt(arr[0].slice(1));
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
        var arr = /^\[#\w{6}\]/.exec(textState.text.slice(textState.textindex));
        if (arr) {
            textState.textindex += arr[0].length;
            return arr[0].slice(1, 8)
        } else {
            return this.normalColor();
        }
    }
};




/**文本内容宽 */
Window_Base.prototype.textContentsWidth = function () {
    return this.contentsWidth()
}

Window_Message.prototype.tslPushParam = function (textState, name, value) {
    var obj = {
        "type": name,
        "value": value
    }
    this.tslPushOther(textState, obj)
};

Window_Base.prototype.processDrawCharacter = function (textState) {
    var obj = this.needsCharacter(textState)
    if (obj) { 
        switch (obj.type) {
            case "line":
            case "addline":
                textState.line = obj;
                textState.drawx = textState.draw.x +
                    textState.page.test.x +
                    ((textState.page.set.facepos == 1 || textState.page.set.facepos == 3) ? 168 : 0) +
                    textState.line.test.x
                textState.drawy = textState.draw.y +
                    textState.page.test.y +
                    textState.line.test.y 
                break
            case "page":
            case "addpage":
                textState.page = obj;
                break
            case "fontSize":
                this.contents.fontSize = obj.fontSize
                break
            case "fontBold":
                this.contents.fontBold = obj.fontBold
                break
            case "fontItalic":
                this.contents.fontItalic = obj.fontItalic
                break
            case "color":
                this.contents.textColor = obj.color;
                break
            case "text":
                var x = textState.drawx + obj.test.x
                var y = textState.drawy + obj.test.y
                var w = obj.test.w
                var h = textState.line.test.h
                var c = obj.text
                this.contents.drawText(c, x, y, w * 2, h);
                this.processNormalCharacter2()
                break
            case "icon":
                var x = textState.drawx + obj.test.x
                var y = textState.drawy + obj.test.y
                var h = textState.line.test.h
                var iconIndex = obj.iconId
                this.drawIcon(iconIndex, x + 2, y + 2);
                this.processNormalCharacter2()
                break
        }
    }
}


Window_Message.prototype.tslPushHear = function (textState) {
    if (textState.text[0] == '\x1b') {
        if (this.tslPushEscapeCode(textState) == "Y") {
            this.tslPushNewPageY(textState)
            this.tslPushHear2(textState)
            return
        }
    }
    if (!textState.page) {
        this.tslPushNewPage(textState)
        this.tslPushHear2(textState)
    }
    textState.textindex = 0
};



/**测试新页对象 */
Window_Message.prototype.tslPushNewPage = function (textState) {
    textState.textindex++
    var page = this.makePage(textState)
    var line = this.makeLine(textState)
    var type = $gameMessage.positionType()
    page.set.wz = type
    if (type == 0) {
        page.set.wtype = 1
        page.set.htype = 0
    } else {
        page.set.wtype = 0
        page.set.htype = 0
    }
    this.tslPushPage(textState, page)
    this.tslPushLine(textState, line)
    this.resetFontSettings();
};




Window_Message.prototype.tslPushHear2 = function (textState) {
    if ($gameMessage.faceName()) {
        var pos = $gameMessage.facePos()
        var name = $gameMessage.faceName()
        var id = $gameMessage.faceIndex()
        var face = {
            "type": "face",
            "pos": pos || 1,
            "name": name,
            "id": id
        }
        this.tslPushFace(textState, face)
    }
};


Window_Message.prototype.tslPushFaceParam = function (textState) {
    var page = textState.page
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        var pos = arr[0] * 1
        var name = arr[1]
        var id = arr[2] * 1
        var face = {
            "type": "face",
            "pos": pos || 1,
            "name": name,
            "id": id
        }
        this.tslPushFace(textState, face)
    }
};


Window_Message.prototype.tslPushPic = function (textState) {
    var arr = this.tslPushEscapeParamEx(textState)
    if (arr) {
        var pos = arr[0] * 1
        var name = arr[1]
        var obj = {
            "type": "pic",
            "pos": pos,
            "name": name,
        }
        this.tslPushOther(textState, obj)
    }
};

/**测试新页对象 */
Window_Message.prototype.tslPushNewPageY = function (textState) {
    var page = this.makePage(textState)
    var line = this.makeLine(textState)
    var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        var type = arr[1] * 1
        page.set.wz = type
        if (type == 0) {
            page.set.wtype = 1
            page.set.htype = 0
        } else {
            page.set.wtype = 0
            page.set.htype = 0
        }
    }
    this.tslPushPage(textState, page)
    this.tslPushLine(textState, line)
    this.resetFontSettings();
};



Window_Message.prototype.tslPushEscapeCharacter = function (textState, code) {
    switch (code) {
        case '$':
            this.tslPushParam(textState, "gold")
            break;
        case '.':
            this.tslPushParam(textState, "wait", this.tslPushEscapeParam(textState, 15));
            break;
        case '|':
            this.tslPushParam(textState, "wait", this.tslPushEscapeParam(textState, 60));
            break;
        case '!':
            this.tslPushParam(textState, "pause")
            break;
        case '>':
            this.tslPushParam(textState, "showfast", true)
            break;
        case '<':
            this.tslPushParam(textState, "showfast", false)
            break;
        case '^':
            this.tslPushParam(textState, "pauseskip", true)
            break;
        case 'S':
            this.tslPushParam(textState, "jiange", this.tslPushEscapeParam(textState, 0))
            break;
        case 'F':
            this.tslPushFaceParam(textState)
            break;
        case 'T':
            this.tslPushPic(textState)
            break;
        default:
            Window_Base.prototype.tslPushEscapeCharacter.call(this, textState, code);
            break;
    }
};



Window_Message.prototype.processDrawCharacter = function (textState) {
    var obj = this.needsCharacter(textState)
    if (obj) {
        switch (obj.type) {
            case "page":
                $gameMessage.picture().erase()
                $gameMessage.rejiange()
                $gameMessage.setFaceImage("", 0, 0)
                this.resetFontSettings();
                this.clearFlags();
            case "addpage":
                textState.page = obj;
                var page = obj
                this.contents.clear(); 
                if ("wz" in page.set) {
                    $gameMessage.setPositionType(page.set.wz)
                }
                this._pauseSkip = false;
                this.loadMessageFace();
                this.updatePlacement();
                break
            case "gold":
                this._goldWindow.open();
                break
            case "wait":
                var z = obj.value
                this.startWait(z)
                break
            case "pause":
                this.startPause();
                break
            case "showfast":
                var z = obj.value
                this._lineShowFast = z;
                break
            case "pauseskip":
                this._pauseSkip = true;
                break
            case "jiange":
                var z = obj.value
                $gameMessage.setJiange(z)
            case "face": 
                var face = obj
                if(!$gameMessage.isFaceImage(face.name, face.id, face.pos)){
                    this.clearFace(face.pos) 
                    $gameMessage.setFaceImage(face.name, face.id, face.pos)
                    this.loadMessageFace();
                    this.updateLoading()
                }  
                break
            case "pic":
                var pos = obj.pos
                var name = obj.name
                if (pos < 10) {
                    var origin = pos
                    var o = pos
                } else {
                    var origin = (Math.floor(pos / 10)) % 10
                    var o = pos % 10
                }
                var x = ((o - 1) % 3) * 0.5 * this.width
                var y = (1 - Math.floor((o - 1) / 3) * 0.5) * this.height

                var scaleX = 100
                var scaleY = 100
                var opacity = 255
                var blendMode = 0
                $gameMessage.picture().show(name, origin, x, y, scaleX,
                    scaleY, opacity, blendMode)
                break
            default:
                Window_Base.prototype.processDrawCharacter.call(this, textState)
        }
    }
}



Window_Message.prototype.updatePlacement = function () {
    this._positionType = $gameMessage.positionType();
    this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
    this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;


    if (!mapvar.value("cblopen")) {
        this.x = (Graphics.boxWidth - this.width) / 2;
    } else {
        this.x = 242
    }
    if (this._positionType == 0) {
        if (this._textState) {
            var page = this._textState.page
            if (page) {
                this.move(this.x, this.y, this.width, page.test.h + this.standardPadding() * 2);
            }
        }
    } else {
        this.move(this.x, this.y, this.width, this.windowHeight());
    }
};






Window_Message.prototype.startMessage = function () {
    this._textState = this.testTextEx($gameMessage.allText(), 0, 0, this.contents.width, this.contents.height)
    this.newPage(this._textState, 1);
    this.updatePlacement();
    this.updateBackground();
    this.open();
};




Window_Message.prototype.updateMessage = function () {
    if (this._textState) {
        while (!this.isEndOfText(this._textState)) {
            this.updateShowFast();
            this.processDrawCharacter(this._textState);
            this._textState.index++
            if (this.needsNewPage(this._textState)) {
                this.newPage(this._textState);
            }
            if (!this._showFast && !this._lineShowFast) {
                break;
            }
            if (this.pause || this._waitCount > 0) {
                break;
            }
        }
        if (this.isEndOfText(this._textState)) {
            this.onEndOfText();
        }
        return true;
    } else {
        return false;
    }
};

Window_Message.prototype.newPage = function (textState, cs) {
    if (textState) {
        textState.page = textState.list[textState.index]
        var page = textState.page
        if ("wz" in page.set) {
            $gameMessage.setPositionType(page.set.wz)
        } 
    }
    if (!this._pauseSkip && !cs) { 
        this.startPause();
    }
};



Window_Base.prototype.isEndOfText = function (textState) {
    return textState.index >= textState.list.length;
};

Window_Base.prototype.needsNewPage = function (textState) { 
    return (!this.isEndOfText(textState) &&
        this.needsCharacter(textState) && (
            this.needsCharacter(textState).type == "page" ||
            this.needsCharacter(textState).type == "addpage")
    );
};
Window_Message.prototype.isEndOfText = function (textState) {
    return textState.index >= textState.list.length;
};
Window_Message.prototype.needsNewPage = function (textState) { 
    return (!this.isEndOfText(textState) &&
        this.needsCharacter(textState) && (
            this.needsCharacter(textState).type == "page" ||
            this.needsCharacter(textState).type == "addpage")
    );
};


Window_Message.prototype.terminateMessage = function () {
    this.close();
    this._goldWindow.close();
    $gameMessage.clear();
};




Game_Message.prototype.clear0 = Game_Message.prototype.clear
Game_Message.prototype.clear = function () {
    this.clear0()
    this._facepos = 1
    this._jiange = this.jiangebase()
    this._picture = new Game_Picture()
};


Game_Message.prototype.isFaceImage = function (faceName, faceIndex, facepos) {
    return ( this._faceName == faceName && this._faceIndex == faceIndex && this._facepos == (facepos || 1) )

};
Game_Message.prototype.setFaceImage = function (faceName, faceIndex, facepos) {
    this._faceName = faceName; 
    this._faceIndex = faceIndex;
    this._facepos = facepos || 1  
};

Game_Message.prototype.jiange = function () {
    return this._jiange || 0
};
Game_Message.prototype.rejiange = function () {
    this._jiange = this.jiangebase()
};
Game_Message.prototype.jiangebase = function () {
    return 0
};
Game_Message.prototype.setJiange = function (i) {
    this._jiange = i
};
Game_Message.prototype.picture = function (i) {
    return this._picture
};

Game_Message.prototype.facePos = function () {
    return this._facepos || 0
}

Window_Base.prototype.processNormalCharacter2 = function () {
};


Window_Message.prototype.windowWidth = function () {
    return 912
};

Window_Message.prototype.windowX = function () {
    return 240
};


Window_Message.prototype.createSubWindows = function () {
    this._goldWindow = new Window_Gold(0, 0);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
    this._goldWindow.openness = 0;
    this._choiceWindow = new Window_ChoiceList(this);
    this._numberWindow = new Window_NumberInput(this);
    this._itemWindow = new Window_EventItem(this);

    this._picsprite = new Sprite_Picture2()
    this.addChildAt(this._picsprite, 0)
};

Window_Message.prototype.processNormalCharacter2 = function () {
    this.startWait($gameMessage.jiange())
};


Window_Message.prototype.drawMessageFace = function () {
    if ($gameMessage.facePos() == 1 || $gameMessage.facePos() == 0) {
        this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), 0, 0);
    } else {
        var x = this.contentsWidth() - Window_Base._faceWidth
        this.drawFace($gameMessage.faceName(), $gameMessage.faceIndex(), x, 0);
    }
};


Window_Message.prototype.clearFace = function (pos) {

    var width = Window_Base._faceWidth;
    var height = Window_Base._faceHeight;
    if (pos == 1 || pos == 0) {
        this.contents.clearRect(0, 0, width, height);
    } else {
        var x = this.contentsWidth() - Window_Base._faceWidth
        this.contents.clearRect(x, 0, width, height);
    }
};

/**更新位置 */
Window_ChoiceList.prototype.updatePlacement = function () {
    var positionType = $gameMessage.choicePositionType();
    var messageY = this._messageWindow.y;
    var messageX = this._messageWindow.x;
    var messageW = this._messageWindow.width;
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    switch (positionType) {
        case 0:
            this.x = messageX;
            break;
        case 1:
            this.x = messageX + (messageW - this.width) / 2;
            break;
        case 2:
            this.x = messageX + (messageW - this.width);
            break;
    }
    if (messageY >= Graphics.boxHeight / 2) {
        this.y = messageY - this.height;
    } else {
        this.y = messageY + this._messageWindow.height;
    }
};




Window_ChoiceList.prototype.textWidthEx = function (text) {
    var te = this.testTextEx(text, 0, 0, 0, this.contents.height)
    if (te && te.list && te.list[0]) {
        return te.list[0].test.w;
    } else {
        return 0
    }
};

function Sprite_Picture2() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Sprite_Picture2.prototype = Object.create(Sprite_Picture.prototype);
//设置创造者
Sprite_Picture2.prototype.constructor = Sprite_Picture2;
//初始化
Sprite_Picture2.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this._pictureName = '';
    this._isPicture = true;
    this.update();
};
//图片
Sprite_Picture2.prototype.picture = function () {
    return $gameMessage.picture();
};


Sprite_Picture2.prototype.updateOrigin = function () {
    var picture = this.picture();
    var o = picture.origin()
    var x = ((o - 1) % 3) * 0.5
    var y = 1 - Math.floor((o - 1) / 3) * 0.5
    this.anchor.x = x;
    this.anchor.y = y;
};
