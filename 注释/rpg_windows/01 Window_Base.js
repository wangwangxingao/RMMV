
/**----------------------------------------------------------------------------- */
/** Window_Base */
/** 窗口基础 */
/** The superclass of all windows within the game. */
/** 游戏中所有窗口的超级类 */

function Window_Base() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Window_Base.prototype = Object.create(Window.prototype);
/**设置创造者 */
Window_Base.prototype.constructor = Window_Base;
/**初始化 
 * @param {number} x x
 * @param {number} y y
 * @param {number} width 宽
 * @param {number} height 高
*/
Window_Base.prototype.initialize = function(x, y, width, height) {
    Window.prototype.initialize.call(this);
	//读取窗口皮肤 
    this.loadWindowskin();
    //移动
    this.move(x, y, width, height); 
	//更新填充
    this.updatePadding();
	//更新背景不透明度
    this.updateBackOpacity();
    //更新色调
    this.updateTone();
    //创建内容
    this.createContents();
    //打开中  = false
    this._opening = false;
    //关闭中 = false
    this._closing = false;
    //模糊精灵 = null
    this._dimmerSprite = null;
};

/**图标宽 = 32  */
Window_Base._iconWidth  = 32; 
/**图标高 = 32  */
Window_Base._iconHeight = 32;
/**脸图宽 = 144 */
Window_Base._faceWidth  = 144;
/**脸图高 - 144 */
Window_Base._faceHeight = 144;

/**行高 */
Window_Base.prototype.lineHeight = function() {
	//返回 36
    return 36;
};
/**标准字体 */
Window_Base.prototype.standardFontFace = function() {
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
Window_Base.prototype.standardFontSize = function() {
	//返回 28
    return 28;
};
/**标准填充 */
Window_Base.prototype.standardPadding = function() {
	//返回 18
    return 18;
};
/**文本填充 */
Window_Base.prototype.textPadding = function() {
	//返回 6
    return 6;
};
/**标准背景不透明 */
Window_Base.prototype.standardBackOpacity = function() {
	//返回 192
    return 192;
};
/**读取窗口皮肤 */
Window_Base.prototype.loadWindowskin = function() {
	//窗口皮肤 = 图像管理器 读取系统("window")
    this.windowskin = ImageManager.loadSystem('Window');
};
/**更新填充 */
Window_Base.prototype.updatePadding = function() {
	//填充 = 标准填充
    this.padding = this.standardPadding();
};
/**更新背景不透明度 */
Window_Base.prototype.updateBackOpacity = function() {
	//背景不透明度 = 标准背景不透明度
    this.backOpacity = this.standardBackOpacity();
};
/**内容宽 */
Window_Base.prototype.contentsWidth = function() {
	//返回 宽 - 标准填充 * 2 
    return this.width - this.standardPadding() * 2;
};
/**内容高 */
Window_Base.prototype.contentsHeight = function() {
	//返回 高 - 标准填充 * 2  
    return this.height - this.standardPadding() * 2;
};
/**适宜高 */
Window_Base.prototype.fittingHeight = function(numLines) {
	//返回 行数 * 行高 + 标准填充 * 2 
    return numLines * this.lineHeight() + this.standardPadding() * 2;
};
/**更新色调 */
Window_Base.prototype.updateTone = function() {
	//色调 = 游戏系统 窗口色调
    var tone = $gameSystem.windowTone();
    //设置色调 (色调[0],色调[1],色调[2])
    this.setTone(tone[0], tone[1], tone[2]);
};
/**创建内容 */
Window_Base.prototype.createContents = function() {
    this.contents = new Bitmap(this.contentsWidth(), this.contentsHeight());
    this.resetFontSettings();
};
/**重设字体设定 */
Window_Base.prototype.resetFontSettings = function() {
    this.contents.fontFace = this.standardFontFace();
    this.contents.fontSize = this.standardFontSize();
    this.resetTextColor();
};
/**重设字体颜色 */
Window_Base.prototype.resetTextColor = function() {
    this.changeTextColor(this.normalColor());
};
/**更新 */
Window_Base.prototype.update = function() {
    Window.prototype.update.call(this);
    this.updateTone();
    this.updateOpen();
    this.updateClose();
    this.updateBackgroundDimmer();
};
/**更新打开 */
Window_Base.prototype.updateOpen = function() {
    if (this._opening) {
        this.openness += 32;
        if (this.isOpen()) {
            this._opening = false;
        }
    }
};
/**更新关闭 */
Window_Base.prototype.updateClose = function() {
    if (this._closing) {
        this.openness -= 32;
        if (this.isClosed()) {
            this._closing = false;
        }
    }
};
/**打开 */
Window_Base.prototype.open = function() {
    if (!this.isOpen()) {
        this._opening = true;
    }
    this._closing = false;
};
/**关闭 */
Window_Base.prototype.close = function() {
    if (!this.isClosed()) {
        this._closing = true;
    }
    this._opening = false;
};
/**是打开中 */
Window_Base.prototype.isOpening = function() {
    return this._opening;
};
/**是关闭中 */
Window_Base.prototype.isClosing = function() {
    return this._closing;
};
/**显示 */
Window_Base.prototype.show = function() {
    this.visible = true;
};
/**隐藏 */
Window_Base.prototype.hide = function() {
    this.visible = false;
};
/**活动 */
Window_Base.prototype.activate = function() {
    this.active = true;
};
/**不活动 */
Window_Base.prototype.deactivate = function() {
    this.active = false;
};
/**文本颜色 */
Window_Base.prototype.textColor = function(n) {
    var px = 96 + (n % 8) * 12 + 6;
    var py = 144 + Math.floor(n / 8) * 12 + 6;
    return this.windowskin.getPixel(px, py);
};
/**普通颜色 */
Window_Base.prototype.normalColor = function() {
    return this.textColor(0);
};
/**系统颜色 */
Window_Base.prototype.systemColor = function() {
    return this.textColor(16);
};
/**危机颜色 */
Window_Base.prototype.crisisColor = function() {
    return this.textColor(17);
};
/**死亡颜色 */
Window_Base.prototype.deathColor = function() {
    return this.textColor(18);
};
/**计量背景颜色 */
Window_Base.prototype.gaugeBackColor = function() {
    return this.textColor(19);
};
/**hp计量颜色1 */
Window_Base.prototype.hpGaugeColor1 = function() {
    return this.textColor(20);
};
/**hp计量颜色2 */
Window_Base.prototype.hpGaugeColor2 = function() {
    return this.textColor(21);
};
/**mp计量颜色1 */
Window_Base.prototype.mpGaugeColor1 = function() {
    return this.textColor(22);
};
/**mp计量颜色2 */
Window_Base.prototype.mpGaugeColor2 = function() {
    return this.textColor(23);
};
/**mp消耗颜色 */
Window_Base.prototype.mpCostColor = function() {
    return this.textColor(23);
};
/**力量上升颜色 */
Window_Base.prototype.powerUpColor = function() {
    return this.textColor(24);
};
/**力量下降颜色 */
Window_Base.prototype.powerDownColor = function() {
    return this.textColor(25);
};
/**tp计量颜色1 */
Window_Base.prototype.tpGaugeColor1 = function() {
    return this.textColor(28);
};
/**tp计量颜色2 */
Window_Base.prototype.tpGaugeColor2 = function() {
    return this.textColor(29);
};
/**tp消耗颜色 */
Window_Base.prototype.tpCostColor = function() {
    return this.textColor(29);
};
/**未定颜色 */
Window_Base.prototype.pendingColor = function() {
    return this.windowskin.getPixel(120, 120);
};
/**半透明的不透明度 */
Window_Base.prototype.translucentOpacity = function() {
    return 160;
};
/**改变文本颜色 */
Window_Base.prototype.changeTextColor = function(color) {
    this.contents.textColor = color;
};
/**改变绘制不透明度 */
Window_Base.prototype.changePaintOpacity = function(enabled) {
    this.contents.paintOpacity = enabled ? 255 : this.translucentOpacity();
};
/**绘制文本 */
Window_Base.prototype.drawText = function(text, x, y, maxWidth, align) {
    this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
};
/**文本宽 */
Window_Base.prototype.textWidth = function(text) {
    return this.contents.measureTextWidth(text);
};
/**绘制文本加强 */
Window_Base.prototype.drawTextEx = function(text, x, y) {
	//如果 text 
    if (text) {
	    //文本状态 = { 索引: 0,x:x ,y:y,左:x }
        var textState = { index: 0, x: x, y: y, left: x };
        //文本状态 文本 = 转换换码
        textState.text = this.convertEscapeCharacters(text);
        //文本状态 高 = 计算文本高(文本状态 ,false)
        textState.height = this.calcTextHeight(textState, false);
        //重设字体设定
        this.resetFontSettings();
        //当 文本状态 索引 < 文本状态 文本 行
        while (textState.index < textState.text.length) {
	        //处理字符 文本状态
            this.processCharacter(textState);
        }
        //返回 文本状态 x - x
        return textState.x - x;
    } else {
        return 0;
    }
};
/**转换换码字符 */
Window_Base.prototype.convertEscapeCharacters = function(text) {
	//替换\为\xlb
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
/**角色名称 */
Window_Base.prototype.actorName = function(n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.name() : '';
};
/**队伍成员名称 */
Window_Base.prototype.partyMemberName = function(n) {
    var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
    return actor ? actor.name() : '';
};
/**处理字符 */
Window_Base.prototype.processCharacter = function(textState) {
	//检查 文本状态 文本[文本状态 索引]
    switch (textState.text[textState.index]) {
	//当 "\n"
    case '\n':
    	//处理新行( 文本状态 )
        this.processNewLine(textState);
        break;
    case '\f':
        this.processNewPage(textState);
        break;
    case '\x1b':
        this.processEscapeCharacter(this.obtainEscapeCode(textState), textState);
        break;
    default:
        this.processNormalCharacter(textState);
        break;
    }
};
/**处理正常字符 */
Window_Base.prototype.processNormalCharacter = function(textState) {
	//c = 文本状态 [文本状态 索引++]
    var c = textState.text[textState.index++];
    //w = c 文本宽
    var w = this.textWidth(c);
    //内容 绘制文本 (c ,文本状态 x,文本状态 y, w*2 , 文本状态 高 )
    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
    //文本状态 x += w
    textState.x += w;
};
/**处理新行 */
Window_Base.prototype.processNewLine = function(textState) {
	//文本状态 x = 文本状态 左
    textState.x = textState.left;
    //文本状态 y += 文本状态 高
    textState.y += textState.height;
    //文本状态 高 = 计算文本高 (文本状态 ,false)
    textState.height = this.calcTextHeight(textState, false);
    //文本状态 索引++
    textState.index++;
};
/**处理新页 */
Window_Base.prototype.processNewPage = function(textState) {
    textState.index++;
};
/**获得转换代码 */
Window_Base.prototype.obtainEscapeCode = function(textState) {
    textState.index++;
    var regExp = /^[\$\.\|\^!><\{\}\\]|^[A-Z]+/i;
    var arr = regExp.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return arr[0].toUpperCase();
    } else {
        return '';
    }
};
/**获得转换参数 */
Window_Base.prototype.obtainEscapeParam = function(textState) {
    var arr = /^\[\d+\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return parseInt(arr[0].slice(1));
    } else {
        return '';
    }
};
/**处理换码字符 */
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
    }
};
/**处理绘制图标 */
Window_Base.prototype.processDrawIcon = function(iconIndex, textState) {
    this.drawIcon(iconIndex, textState.x + 2, textState.y + 2);
    textState.x += Window_Base._iconWidth + 4;
};
/**制作加大字体 */
Window_Base.prototype.makeFontBigger = function() {
	//如果 内容 字号 <= 96
    if (this.contents.fontSize <= 96) {
	    //内容 字号 += 12
        this.contents.fontSize += 12;
    }
};
/**制作缩小字体 */
Window_Base.prototype.makeFontSmaller = function() {
	//如果 内容 字号 >= 24
    if (this.contents.fontSize >= 24) {
	    //内容 字号 -= 24
        this.contents.fontSize -= 12;
    }
};
/**计算文本高 */
Window_Base.prototype.calcTextHeight = function(textState, all) {
	//最后字体号 = 内容 字号
    var lastFontSize = this.contents.fontSize;
    //文本高 = 0
    var textHeight = 0;
    //行 = 文本状态 文本 剪切 (文本状态 索引) 切割 ("\n" )
    var lines = textState.text.slice(textState.index).split('\n');
    //最大行数 = 全 ?  行 长度 : 1
    var maxLines = all ? lines.length : 1;
	
    for (var i = 0; i < maxLines; i++) {
        var maxFontSize = this.contents.fontSize;
        var regExp = /\x1b[\{\}]/g;
        for (;;) {
            var array = regExp.exec(lines[i]);
            if (array) {
                if (array[0] === '\x1b{') {
                    this.makeFontBigger();
                }
                if (array[0] === '\x1b}') {
                    this.makeFontSmaller();
                }
                if (maxFontSize < this.contents.fontSize) {
                    maxFontSize = this.contents.fontSize;
                }
            } else {
                break;
            }
        }
        textHeight += maxFontSize + 8;
    }

    this.contents.fontSize = lastFontSize;
    return textHeight;
};
/**绘制图标 */
Window_Base.prototype.drawIcon = function(iconIndex, x, y) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};
/**绘制脸 */
Window_Base.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
    width = width || Window_Base._faceWidth;
    height = height || Window_Base._faceHeight;
    var bitmap = ImageManager.loadFace(faceName);
    var pw = Window_Base._faceWidth;
    var ph = Window_Base._faceHeight;
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    var sx = faceIndex % 4 * pw + (pw - sw) / 2;
    var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};
/**绘制人物 */
Window_Base.prototype.drawCharacter = function(characterName, characterIndex, x, y) {
    var bitmap = ImageManager.loadCharacter(characterName);
    var big = ImageManager.isBigCharacter(characterName);
    var pw = bitmap.width / (big ? 3 : 12);
    var ph = bitmap.height / (big ? 4 : 8);
    var n = characterIndex;
    var sx = (n % 4 * 3 + 1) * pw;
    var sy = (Math.floor(n / 4) * 4) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
};
/**绘制计量 */
Window_Base.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + this.lineHeight() - 8;
    this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
};
/**hp颜色 */
Window_Base.prototype.hpColor = function(actor) {
    if (actor.isDead()) {
        return this.deathColor();
    } else if (actor.isDying()) {
        return this.crisisColor();
    } else {
        return this.normalColor();
    }
};
/**mp颜色 */
Window_Base.prototype.mpColor = function(actor) {
    return this.normalColor();
};
/**tp颜色 */
Window_Base.prototype.tpColor = function(actor) {
    return this.normalColor();
};
/**绘制角色人物 */
Window_Base.prototype.drawActorCharacter = function(actor, x, y) {
    this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
};
/**绘制角色脸 */
Window_Base.prototype.drawActorFace = function(actor, x, y, width, height) {
    this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
};
/**绘制角色名称 */
Window_Base.prototype.drawActorName = function(actor, x, y, width) {
    width = width || 168;
    this.changeTextColor(this.hpColor(actor));
    this.drawText(actor.name(), x, y, width);
};
/**绘制角色职业 */
Window_Base.prototype.drawActorClass = function(actor, x, y, width) {
    width = width || 168;
    this.resetTextColor();
    this.drawText(actor.currentClass().name, x, y, width);
};
/**绘制角色昵称 */
Window_Base.prototype.drawActorNickname = function(actor, x, y, width) {
    width = width || 270;
    this.resetTextColor();
    this.drawText(actor.nickname(), x, y, width);
};
/**绘制角色等级 */
Window_Base.prototype.drawActorLevel = function(actor, x, y) {
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.levelA, x, y, 48);
    this.resetTextColor();
    this.drawText(actor.level, x + 84, y, 36, 'right');
};
/**绘制角色图标 */
Window_Base.prototype.drawActorIcons = function(actor, x, y, width) {
    width = width || 144;
    var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
    for (var i = 0; i < icons.length; i++) {
        this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
    }
};
/**绘制当前和最大 */
Window_Base.prototype.drawCurrentAndMax = function(current, max, x, y,
                                                   width, color1, color2) {
    var labelWidth = this.textWidth('HP');
    var valueWidth = this.textWidth('0000');
    var slashWidth = this.textWidth('/');
    var x1 = x + width - valueWidth;
    var x2 = x1 - slashWidth;
    var x3 = x2 - valueWidth;
    if (x3 >= x + labelWidth) {
        this.changeTextColor(color1);
        this.drawText(current, x3, y, valueWidth, 'right');
        this.changeTextColor(color2);
        this.drawText('/', x2, y, slashWidth, 'right');
        this.drawText(max, x1, y, valueWidth, 'right');
    } else {
        this.changeTextColor(color1);
        this.drawText(current, x1, y, valueWidth, 'right');
    }
};
/**绘制角色hp */
Window_Base.prototype.drawActorHp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x, y, 44);
    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
                           this.hpColor(actor), this.normalColor());
};
/**绘制角色mp */
Window_Base.prototype.drawActorMp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.mpGaugeColor1();
    var color2 = this.mpGaugeColor2();
    this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.mpA, x, y, 44);
    this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
                           this.mpColor(actor), this.normalColor());
};
/**绘制角色tp */
Window_Base.prototype.drawActorTp = function(actor, x, y, width) {
    width = width || 96;
    var color1 = this.tpGaugeColor1();
    var color2 = this.tpGaugeColor2();
    this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.tpA, x, y, 44);
    this.changeTextColor(this.tpColor(actor));
    this.drawText(actor.tp, x + width - 64, y, 64, 'right');
};
/**绘制角色减益状态 */
Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
    var lineHeight = this.lineHeight();
    var x2 = x + 180;
    var width2 = Math.min(200, width - 180 - this.textPadding());
    this.drawActorName(actor, x, y);
    this.drawActorLevel(actor, x, y + lineHeight * 1);
    this.drawActorIcons(actor, x, y + lineHeight * 2);
    this.drawActorClass(actor, x2, y);
    this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
    this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
};
/**绘制物品名称 */
Window_Base.prototype.drawItemName = function(item, x, y, width) {
    width = width || 312;
    if (item) {
        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x + 2, y + 2);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
    }
};
/**绘制货币数值 */
Window_Base.prototype.drawCurrencyValue = function(value, unit, x, y, width) {
    var unitWidth = Math.min(80, this.textWidth(unit));
    this.resetTextColor();
    this.drawText(value, x, y, width - unitWidth - 6, 'right');
    this.changeTextColor(this.systemColor());
    this.drawText(unit, x + width - unitWidth, y, unitWidth, 'right');
};
/**参数改变文本颜色 */
Window_Base.prototype.paramchangeTextColor = function(change) {
    if (change > 0) {
        return this.powerUpColor();
    } else if (change < 0) {
        return this.powerDownColor();
    } else {
        return this.normalColor();
    }
};
/**设置背景种类 */
Window_Base.prototype.setBackgroundType = function(type) {
    if (type === 0) {
        this.opacity = 255;
    } else {
        this.opacity = 0;
    }
    if (type === 1) {
        this.showBackgroundDimmer();
    } else {
        this.hideBackgroundDimmer();
    }
};
/**显示背景模糊 */
Window_Base.prototype.showBackgroundDimmer = function() {
    if (!this._dimmerSprite) {
        this._dimmerSprite = new Sprite();
        this._dimmerSprite.bitmap = new Bitmap(0, 0);
        this.addChildToBack(this._dimmerSprite);
    }
    var bitmap = this._dimmerSprite.bitmap;
    if (bitmap.width !== this.width || bitmap.height !== this.height) {
        this.refreshDimmerBitmap();
    }
    this._dimmerSprite.visible = true;
    this.updateBackgroundDimmer();
};
/**隐藏背景模糊 */
Window_Base.prototype.hideBackgroundDimmer = function() {
	//如果 模糊精灵
    if (this._dimmerSprite) {
	    //模糊精灵 显示 = false
        this._dimmerSprite.visible = false;
    }
};
/**更新背景模糊 */
Window_Base.prototype.updateBackgroundDimmer = function() {
	//如果 模糊精灵
    if (this._dimmerSprite) {
	    //模糊精灵 不透明度 = 开放性
        this._dimmerSprite.opacity = this.openness;
    }
};
/**刷新模糊图片 */
Window_Base.prototype.refreshDimmerBitmap = function() {
	//如果 模糊精灵
    if (this._dimmerSprite) {
	    //无图 = 模糊精灵 位图
        var bitmap = this._dimmerSprite.bitmap;
        //w = 宽
        var w = this.width;
        //h = 高
        var h = this.height;
        //m = 填充
        var m = this.padding;
        //c1 = 模糊颜色1
        var c1 = this.dimColor1();
        //c2 = 模糊颜色2
        var c2 = this.dimColor2();
        //位图 重设大小(w,h)
        bitmap.resize(w, h); 
        //位图 层次填充矩形( 0,0,w,m,c1,c2,true)
        bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
        //位图 填充矩形(0,m,w,h-m * 2 ,c1 )
        bitmap.fillRect(0, m, w, h - m * 2, c1);
        //位图 层次填充矩形( 0, h-w, w ,m,c1,c2,true)
        bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
        //模糊精灵 设置框(0,0,w,h)
        this._dimmerSprite.setFrame(0, 0, w, h);
    }
};
/**模糊颜色1 */
Window_Base.prototype.dimColor1 = function() {
	//返回 'rgba(0, 0, 0, 0.6)'  //半透明灰
    return 'rgba(0, 0, 0, 0.6)';
};
/**模糊颜色2 */
Window_Base.prototype.dimColor2 = function() {
	//返回 'rgba(0, 0, 0, 0)'  //透明
    return 'rgba(0, 0, 0, 0)';
};
/**画布到本地x */
Window_Base.prototype.canvasToLocalX = function(x) {
	//节点 = this 
    var node = this;
    //当 节点
    while (node) {
	    //x -= 节点 x
        x -= node.x;
        //节点 = 节点 父代
        node = node.parent;
    }
    //返回 x
    return x;
};
/**画布到到本地y */
Window_Base.prototype.canvasToLocalY = function(y) {
	//节点 = this 
    var node = this;
    //当 节点
    while (node) {
	    //y -= 节点 y
        y -= node.y;
        //节点 = 节点 父代
        node = node.parent;
    }
    //返回 y
    return y;
};

/**预约脸图 */
Window_Base.prototype.reserveFaceImages = function() {
    //游戏队伍 成员组() 对每一个 角色
    $gameParty.members().forEach(function(actor) {
        //图像管理器 预约脸图(角色 脸图名称())
        ImageManager.reserveFace(actor.faceName());
    //this)
    }, this);
};
