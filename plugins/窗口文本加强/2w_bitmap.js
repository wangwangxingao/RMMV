
//=============================================================================
// 2w_bitmap.js
//=============================================================================

/*:
 * @plugindesc 绘制文本加强
 * @author 汪汪
 * 
 * @help 
 *  
 * \{ \}  : 扩展  支持\{[z]  \}[z] 增加减少字号  \{}[z] 设置字号
 * \C : 扩展 支持 \C[#FFFF00]
 * \=  \=[z] 
 *     设置粗体 , 0 为 false  , 1 为true ,不填值为取现值的相反值
 * \/  \/[z] 
 *     设置斜体 , 0 为 false  , 1 为true ,不填值为取现值的相反值
 * \WJ  \WJ[z] 
 *     设置横字间隔 , 不填为 0
 * \HJ  \HJ[z] 
 *     设置纵行间隔 , 不填为 0
 * 
 */

 
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
 
 

/**绘制 */
Bitmap.prototype.drawTextEx2 = function (text, x, y, w, h, p, l) {
    if (text) {
        var textState = this._testTextEx(text, x, y, w, h, p, l);
        this._resetFontSettings();
        while (textState.index < textState.list.length) {
            this._processDrawCharacter(textState);
            textState.index++
            if (this._needsNewPage(textState)) {
                break
            }
        }
        this._resetFontSettings();
        return textState;
    } else {
        return 0;
    }
};

Bitmap.prototype._makeFontNameText = function () {
    return (this.fontBold ? "Bold " : '') + (this.fontItalic ? 'Italic ' : '') +
        this.fontSize + 'px ' + this.fontFace;
};

Bitmap.prototype._standardFontBold = function () {
    return false
};

Bitmap.prototype._standardFontItalic = function () {
    return false
};

Bitmap.prototype._fontSettings = function (i) {
    if (i || !this._fontnametext) {
        this._fontnametext = this._makeFontNameText()
    }
    return this._fontnametext
};

Bitmap.prototype._standardFontFace = function() {
	//如果 游戏系统 是中文
    if ($gameSystem.isChinese()) {
	    //返回 'SimHei, Heiti TC, sans-serif'
        return 'SimHei, Heiti TC, sans-serif';
    //否则 如果 游戏系统 是韩语
    } else if ($gameSystem.isKorean()) { 
	    //返回 'Dotum, AppleGothic, sans-serif'
        return 'Dotum, AppleGothic, sans-serif';
    //否则
    } else {
	    //返回 游戏字体
        return 'GameFont';
    }
};
/**标准字体大小 */
Bitmap.prototype._standardFontSize = function() {
	//返回 28
    return 28;
}; 
Bitmap.prototype._resetFontSettings = function () {
    this.fontItalic = this._standardFontItalic()
    this.fontBold = this._standardFontBold()
    this.fontFace = this._standardFontFace();
    this.fontSize = this._standardFontSize();
    this._fontSettings(1)
    this._resetTextColor();
};

Bitmap.prototype._changeTextColor = function (color) {
    this.textColor = color;
};

Bitmap.prototype._resetTextColor = function () {
    this._changeTextColor("#ffffff");
};
/**文本高 */
Bitmap.prototype._calcTextHeight = function () {
    var maxFontSize = this.fontSize;
    var textHeight = maxFontSize + 8;
    return textHeight;
};

Bitmap.prototype._textWidth = function (text) {
    return this.measureTextWidth(text);
};

Bitmap.prototype._makePage = function (textState) {
    return { "type": "page", "set": {}, "list": [], "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};
Bitmap.prototype._makeLine = function (textState) {
    return { "type": "line", "list": [], "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};
Bitmap.prototype._makeText = function (textState) {
    return { "type": "text", "text": "", "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};
Bitmap.prototype._makeIcon = function (textState) {
    return { "type": "icon", "icon": "", "test": { "x": 0, "y": 0, "w": 0, "h": 0 } }
};

/**测试文字增强 */
Bitmap.prototype._testTextEx = function (text, x, y, w, h, wt, ht) {
    if (text) {
        var pageset = { w: w || Infinity, h: h || Infinity, wtype: wt, htype: ht }
        var draw = { x: x || 0, y: y || 0 }
        var t = this._convertEscapeCharacters(text)
        var textState = {
            text: t,
            textindex: 0,
            tsl: [],
            textf: {},
            index: 0,
            pages: [],
            list: [],
            pageset: pageset,
            draw: draw
        };
        this._resetFontSettings();
        this._tslPushAll(textState)
        this._testMakePages(textState)
        this._testMakeList(textState)
        this._resetFontSettings();
        return textState;
    } else {
        return null;
    }
};



/**转换换码字符 */
Bitmap.prototype._convertEscapeCharacters = function(text) {
	//替换\\为\xlb
    text = text.replace(/\\/g, '\x1b');
 	//替换\xlb\xlb 为 \\
    text = text.replace(/\x1b\x1b/g, '\\');
    //替换\xlbV[n]为  变量 
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    //替换\xlbV[n]为  变量 
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
        return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
        return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    return text;
};


Bitmap.prototype._setDrawxy = function (textState, draw) {
    if (textState && draw) {
        textState.draw = draw
        return textState;
    } else {
        return null;
    }
};

Bitmap.prototype._setTextPageset = function (textState, pageset) {
    if (textState && pageset) {
        textState.pageset = pageset
        return textState;
    } else {
        return null;
    }
};


/**添加字符 */
Bitmap.prototype._testMakePages = function (textState) {
    if (textState) {
        var list = textState.tsl || []
        textState.pages = []
        var face = null
        for (var i = 0; i < list.length; i++) {
            var obj = list[i]
            var type = obj.type
            if (type == "page") {
                var face = null
                var page = this._makePage()
                page.set = obj.set
                this._testPushPage(textState, page)
            } else if (type == "line") {
                var line = this._makeLine()
                this._testPushLine(textState, line)
            } else if (type == "icon" || type == "text") {
                this._testPushText(textState, obj, face)
            } else if (type == "face") {
                var face = face || []
                face[obj.pos] = obj
                this._testPushOther(textState, obj)
            } else {
                this._testPushOther(textState, obj)
            }
        }
        this._testPushEnd(textState)
        return textState
    } else {
        return null
    }
};

Bitmap.prototype._testMakeList = function (textState) {
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


Bitmap.prototype._indexCharacter = function (textState, index) {
    return textState.list[index];
};

Bitmap.prototype._needsCharacter = function (textState) {
    return this._indexCharacter(textState, textState.index)
};
 

Bitmap.prototype._tslPushAll = function (textState) {
    this._tslPushHear(textState)
    while (textState.textindex < textState.text.length) {
        this._tslPushCharacter(textState);
    }
    this._tslPushEnd(textState)
};

/**测试添加头 */
Bitmap.prototype._tslPushHear = function (textState) {
    textState.textindex = 0
    if (textState.text[0] == '\x1b') {
        if (this._tslPushEscapeCode(textState) == "Y") {
            this._tslPushNewPageY(textState)
            return
        }
    }
    if (!textState.page) {
        this._tslPushPage(textState)
        this._tslPushLine(textState)
    }
    textState.textindex = 0
};

/**测试 添加尾 */
Bitmap.prototype._tslPushEnd = function (textState) {
    textState.textindex = 0
    delete textState.page
    delete textState.line
};


/**添加其他 */
Bitmap.prototype._tslPush = function (textState, obj) {
    textState.tsl.push(obj)
};


/**测试添加页 */
Bitmap.prototype._tslPushPage = function (textState, page) {
    var page = page || this._makePage(textState)
    textState.page = page
    this._tslPush(textState, page)
};
/**测试添加行 */
Bitmap.prototype._tslPushLine = function (textState, line) {
    var line = line || this._makeLine()
    var page = textState.page
    textState.line = line
    this._tslPush(textState, line)
};


/**页设置脸图 */
Bitmap.prototype._tslPushPic = function (textState, pic) {
    if (pic) {
        ImageManager.loadPicture(pic.name)
        var page = textState.page
        this._tslPush(textState, pic)
    }
}

/**页设置脸图 */
Bitmap.prototype._tslPushFace = function (textState, face) {
    if (face) {
        ImageManager.loadFace(face.name)
        var page = textState.page
        if (!page.set.facepos) {
            page.set.facepos = face.pos
        } else {
            //var pos = page.set.facepos
            // face.pos = pos
            if (face.pos != page.set.facepos) {
                page.set.facepos = 3
            }
        }
        this._tslPush(textState, face)
    }
}
/**添加字符 */
Bitmap.prototype._tslPushOther = function (textState, text) {
    if (text) {
        this._tslPush(textState, text)
    }
};
//****************************************************************** */

/**测试添加页 */
Bitmap.prototype._testPushPage = function (textState, page) {
    this._testPushLine(textState, 0, 1)
    var page = page || this._makePage(textState)
    textState.page = page
    textState.pages.push(page)
};


/**测试添加行 */
Bitmap.prototype._testPushLine = function (textState, line, cs) {
    var line = line || this._makeLine()
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
Bitmap.prototype._testPushText = function (textState, text, face) {

    var text = text || this._makeText()
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
        this._testPushOther(textState, text)

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
            var page2 = this._makePage(textState)
            page2.type = "addpage"
            page2.set = page.set
            this._testPushPage(textState, page2)
            //行添加到新页
            this._testPushLine(textState, line)
            if (face) {
                if (face[1]) {
                    this._testPushOther(textState, face[1])
                }
                if (face[2]) {
                    this._testPushOther(textState, face[2])
                }
            }
        }
    }
    //行放不开
    else {
        //添加新行
        var line2 = this._makeLine()
        line2.type = "addline"
        line2.set = line.set
        this._testPushLine(textState, line2)
        this._testPushText(textState, text, face)
    }
};

/**添加其他 */
Bitmap.prototype._testPushOther = function (textState, obj) {
    textState.line.list.push(obj)
};
Bitmap.prototype._testPushEnd = function (textState) {
    this._testPushLine(textState, 0, 1)
};
/***************************************************************************** */


//处理字符
Bitmap.prototype._tslPushCharacter = function (textState) {
    //检查 文本状态 文本[文本状态 索引]
    switch (textState.text[textState.textindex]) {
        //当 "\n"
        case '\n':
            //处理新行( 文本状态 )
            this._tslPushNewLine(textState);
            break;
        case '\f':
            this._tslPushNewPage(textState);
            break;
        case '\x1b':
            this._tslPushEscapeCharacter(textState, this._tslPushEscapeCode(textState));
            break;
        default:
            this._tslPushNormalCharacter(textState);
            break;
    }
};

Bitmap.prototype._tslPushEscapeCode = function (textState) {
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
Bitmap.prototype._tslPushEscapeCharacter = function (textState, code) {
    switch (code) {
        case 'C':
            this._tslPushTextColor(textState, this._tslPushTextColorEscapeParam(textState));
            break;
        case 'I':
            this._tslPushDrawIcon(textState, this._tslPushEscapeParam(textState));
            break;
        case '{':
            this._tslPushChangeFontSize(textState, 1);
            break;
        case '}':
            this._tslPushChangeFontSize(textState, -1);
            break;
        case '=':
            this._tslPushChangeFontBlod(textState);
            break;
        case '/':
            this._tslPushChangeFontItalic(textState);
            break;
        case 'WJ':
            this._tslPushWidth(textState, this._tslPushEscapeParam(textState, 0));
            break;
        case 'HJ':
            this._tslPushHeight(textState, this._tslPushEscapeParam(textState, 0));
            break;
        case 'Y':
            this._tslPushNewPageY(textState)
            break;
    }
};

//处理新行
Bitmap.prototype._tslPushWidth = function (textState, wjg) {
    textState.page.set.wjg = wjg
    var obj = {
        "type": "wjg",
        "value": wjg
    }
    this._tslPushOther(textState, obj)
};

//设置宽
Bitmap.prototype._tslPushHeight = function (textState) {
    textState.page.set.hjg = hjg
    var obj = {
        "type": "hjg",
        "value": hjg
    }
    this._tslPushOther(textState, obj)
};

//处理新行
Bitmap.prototype._tslPushNewLine = function (textState) {
    textState.textindex++;
    this._tslPushLine(textState)
};

/**进行行对象 */
Bitmap.prototype._tslPushNewLineL = function (textState) {
    var line = textState.line
    var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        line.cs = arr[1]
    }
};

/**进行新页对象 */
Bitmap.prototype._tslPushNewPage = function (textState) {
    textState.textindex++
    this._tslPushPage(textState)
    this._tslPushLine(textState)
    this._resetFontSettings();
};

/**进行新页对象 */
Bitmap.prototype._tslPushNewPageY = function (textState) {
    var page = this._makePage(textState)
    var line = this._makeLine(textState)
    var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        page.set.wz = arr[1] * 1
    }
    this._tslPushPage(textState, page)
    this._tslPushLine(textState, line)
    this._resetFontSettings();
};

/**处理正常字符 */
Bitmap.prototype._tslPushNormalCharacter = function (textState) {
    //c = 文本状态 [文本状态 索引++]
    var c = textState.text[textState.textindex++];
    
    var f = this._fontSettings()

    var textf = textState.textf
    if (textf[f]) {
        if (textf[f][c]) {
            var w = textf[f][c]["w"]
            var h = textf[f][c]["h"]
        } else {
            var w = this._textWidth(c);
            var h = this._calcTextHeight()
            textf[f][c] = { w: w, h: h }
        }
    } else {
        textf[f] = {}
        var w = this._textWidth(c);
        var h = this._calcTextHeight()
        textf[f][c] = { "w": w, "h": h }
    }
    var text = this._makeText()
    text.text = c
    text.test.w = w
    text.test.h = h
    this._tslPushOther(textState, text)
};


Bitmap.prototype._tslPushTextColor = function (textState, color) {
    this.textColor = color;
    var obj = {
        "type": "color",
        "color": color
    }
    this._tslPushOther(textState, obj)
};

Bitmap.prototype._tslPushDrawIcon = function (textState, iconId) {
    var icon = this._makeIcon()
    icon.icon = iconId
    icon.test.w = Bitmap._iconWidth + 4;
    icon.test.h = Bitmap._iconHeight + 4;
    this._tslPushOther(textState, obj)
};

Bitmap.prototype._tslPushChangeFontItalic = function (textState) {
    var Italic = !this.fontItalic
    var Italic = !!this._tslPushEscapeParam(textState, Italic)
    this._tslPushFontItalic(textState, Italic)
}
Bitmap.prototype._tslPushFontItalic = function (textState, Italic) {
    this.fontItalic = Italic;
    var obj = {
        "type": "fontItalic",
        "fontItalic": Italic
    }
    this._tslPushFont(textState, obj)
};

Bitmap.prototype._tslPushChangeFontBlod = function (textState) {
    var bold = !this.fontBold
    var bold = !!this._tslPushEscapeParam(textState, bold)
    this._tslPushFontBlod(textState, bold)
}
//制作字体型号
Bitmap.prototype._tslPushFontBlod = function (textState, bold) {
    this.fontBold = bold;
    var obj = {
        "type": "fontBold",
        "fontBold": bold
    }
    this._tslPushFont(textState, obj)
};

/**字体 */
Bitmap.prototype._tslPushChangeFontSize = function (textState, i) {
    if (i > 0) {
        var arr = /^}/.exec(textState.text.slice(textState.textindex));
        if (arr) {
            textState.textindex += arr[0].length;
            var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
            if (arr) {
                textState.textindex += arr[0].length;
                this._tslPushFontSize(textState, parseInt(arr[1]));
            } else {
                this._tslPushFontSize(textState, this._standardFontSize());
            }
        } else {
            var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
            if (arr) {
                textState.textindex += arr[0].length;
                this._tslPushFontSize(textState, this.fontSize + parseInt(arr[1]));
            } else {
                this._tslPushFontSize(textState, this.fontSize + 12)
            }
        }
    } else if (i < 0) {
        var arr = /^\[(\d+)\]/.exec(textState.text.slice(textState.textindex));
        if (arr) {
            textState.textindex += arr[0].length;
            this._tslPushFontSize(textState, this.fontSize - parseInt(arr[1]));
        } else {
            this._tslPushFontSize(textState, this.fontSize - 12)
        }
    }
}
//制作字体型号
Bitmap.prototype._tslPushFontSize = function (textState, fontSize) {
    var fontSize = Math.min(108, Math.max(fontSize, 12))
    this.fontSize = fontSize;
    var obj = {
        "type": "fontSize",
        "fontSize": fontSize
    }
    this._tslPushFont(textState, obj)
};

Bitmap.prototype._tslPushFont = function (textState, obj) {
    this._fontSettings(1)
    this._tslPushOther(textState, obj)
};



/**获取参数 */
Bitmap.prototype._tslPushEscapeParam = function (textState, un) {
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
Bitmap.prototype._tslPushEscapeParamEx = function (textState) {
    var arr = /^\[(.*?)\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return arr[1].split(/ +/)
    }
    return arr;
};


/**获取颜色参数 */
Bitmap.prototype._tslPushTextColorEscapeParam = function (textState) { 
    var arr = /^\[#\w{6}\]/.exec(textState.text.slice(textState.textindex));
    if (arr) {
        textState.textindex += arr[0].length;
        return arr[0].slice(1, 8)
    } else {
        return "#ffffff";
    }
};


Bitmap.prototype._processDrawCharacter = function (textState) {
    var obj = this._needsCharacter(textState)
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
                this.fontSize = obj.fontSize
                break
            case "fontBold":
                this.fontBold = obj.fontBold
                break
            case "fontItalic":
                this.fontItalic = obj.fontItalic
                break
            case "color":
                this.textColor = obj.color;
                break
            case "text":
                var x = textState.drawx + obj.test.x
                var y = textState.drawy + obj.test.y
                var w = obj.test.w
                var h = textState.line.test.h
                var c = obj.text
                this.drawText(c, x, y, w * 2, h); 
                break
            case "icon":
                var x = textState.drawx + obj.test.x
                var y = textState.drawy + obj.test.y
                var h = textState.line.test.h
                var iconIndex = obj.iconId
                this.drawIcon(iconIndex, x + 2, y + 2); 
                break
        }
    }
}
 Bitmap.prototype.drawIcon = function(iconIndex, x, y) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};


Bitmap.prototype._isEndOfText = function (textState) {
    return textState.index >= textState.list.length;
};

Bitmap.prototype._needsNewPage = function (textState) {
    return (!this._isEndOfText(textState) &&
        this._needsCharacter(textState) && (
            this._needsCharacter(textState).type == "page" ||
            this._needsCharacter(textState).type == "addpage")
    );
};

 