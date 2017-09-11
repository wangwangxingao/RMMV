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
  
Window_Selectable.prototype.setHelpWindowItem = function(item) {
    if (this._helpWindow) {
	    this._helpWindow.setLy(this)
        this._helpWindow.setItem(item);
    }
};
 
Scene_MenuBase.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help();
    this.addChild(this._helpWindow);
};


Scene_Battle.prototype.createHelpWindow = function() {
	//帮助窗口 = 新 窗口帮助
    this._helpWindow = new Window_Help();
    //帮助窗口 设为 不可见 
    this._helpWindow.visible = false;
    //添加窗口(帮助窗口) 
    this.addChild(this._helpWindow);
};

  

//-----------------------------------------------------------------------------
// Window_FloatHelp
// 窗口浮动帮助
// The window for displaying the description of the selected item.
// 显示选择项目说明的窗口

function Window_FloatHelp() {
    this.initialize.apply(this, arguments);
}


Window_Help =  Window_FloatHelp 


//设置原形 
Window_FloatHelp.prototype = Object.create(Window_Base.prototype);
//设置创造者
Window_FloatHelp.prototype.constructor = Window_FloatHelp;

//窗口最小宽
Window_FloatHelp._ckiw = 0
//窗口最小高
Window_FloatHelp._ckih = 0
//窗口最大宽
Window_FloatHelp._ckaw = 408  
//窗口最大高
Window_FloatHelp._ckah = 312 
//开始y计数
Window_FloatHelp._startYCount =  -100  
//添加y计数
Window_FloatHelp._addYCount =   1 
//等待y计数
Window_FloatHelp._waitYCont  = 100 
//开始计数
Window_FloatHelp._startCount = -100 
//添加计数
Window_FloatHelp._addCount =  5
//结束计数
Window_FloatHelp._endCont =  255 

//读取
Window_FloatHelp.load = function ( ) {
	for (var i=0;i<$plugins.length;i++){
	    var plugin = $plugins[i]
	    if (plugin.parameters["Window_FloatHelp"]){
		    if(plugin.status == true ){
			    var w = plugin.parameters["minWidth"] * 1
			    Window_FloatHelp._ckiw = isFinite(w) ? w : Window_FloatHelp._ckiw 
			    var h = plugin.parameters["minHeight"] * 1
			    Window_FloatHelp._ckih = isFinite(h) ? h : Window_FloatHelp._ckih
			    var w = plugin.parameters["maxWidth"] * 1
			    Window_FloatHelp._ckaw = isFinite(w) ? w : Window_FloatHelp._ckaw 
			    var h = plugin.parameters["maxHeight"] * 1
			    Window_FloatHelp._ckah = isFinite(h) ? h : Window_FloatHelp._ckah
			
			    var h = plugin.parameters["startYCount"] * 1
			    Window_FloatHelp._startYCount  = isFinite(h) ? h : Window_FloatHelp._startYCount  
			    var h = plugin.parameters["addYCount"] * 1
			    Window_FloatHelp._addYCount = isFinite(h) ? h : Window_FloatHelp._addYCount 
				var h = plugin.parameters["waitYCont"] * 1
			    Window_FloatHelp._waitYCont = isFinite(h) ? h :Window_FloatHelp._waitYCont  
				 var h = plugin.parameters["startCount"] * 1
			    Window_FloatHelp._startCount = isFinite(h) ? h :Window_FloatHelp._startCount
				var h = plugin.parameters["addCount"] * 1
			    Window_FloatHelp._addCount  = isFinite(h) ? h : Window_FloatHelp._addCount
				var h = plugin.parameters["endCont"] * 1 
				Window_FloatHelp._endCont = isFinite(h) ? h : Window_FloatHelp._endCont
		    }
	    }
	}
}
Window_FloatHelp.load()
 
//初始化
Window_FloatHelp.prototype.initialize = function(w,h ) { 
    Window_Base.prototype.initialize.call(this, 0, 0, 0, 0); 
    this._text = '';
    this.startFloat() 
    this._lywin  = null
    this._lyindax = -10 
    this._ckw = w || 0
    this._ckh = h || 0
};
  
//开始计数
Window_FloatHelp.prototype.startCount = function() {
	return Window_FloatHelp._startCount
};
//添加计数
Window_FloatHelp.prototype.addCount = function() {
	return Window_FloatHelp._addCount 
};
//设置计数
Window_FloatHelp.prototype.setCount = function(i) {
	this._count = i || 0
};
//结束计数
Window_FloatHelp.prototype.endCont = function(i) {
	return Window_FloatHelp._endCont
};

//开始y计数
Window_FloatHelp.prototype.startYCount = function() {
	return Window_FloatHelp._startYCount
};
//添加y计数
Window_FloatHelp.prototype.addYCount = function() {
	return Window_FloatHelp._addYCount 
};
//设置y计数
Window_FloatHelp.prototype.setYCount = function(i) {
	this._ycount = i || 0
};
//结束y计数
Window_FloatHelp.prototype.endYCont = function() {
	var c = this.contents.height - ( this.height - this.standardPadding() * 2) 
	return  c   
};
//等待y计数
Window_FloatHelp.prototype.waitYCont = function() {
	return Window_FloatHelp._waitYCont
};


//更新
Window_FloatHelp.prototype.update = function() {
    Window_Base.prototype.update.call(this); 
    this.updateFloat() 
}; 

//更新浮动
Window_FloatHelp.prototype.updateFloat = function() {
	if( this._text ){
		if(this._count < this.endCont()){
			this._count += this.addCount() 
			this._count = Math.min(this._count,this.endCont() )
			if(  this._count >= 0 ){
				this.setOpacity(this._count) 
			} 
		}else{
			if(this._ygd == true ){
				if(this._ycount < this.endYCont() + this.waitYCont()  ){
					this._ycount += this.addYCount()  
					if(  this._ycount >0 ){ 
						if( this._ycount < this.endYCont() ){ 
							this.origin.y = Math.round(this._ycount) 
						}else if ( this._ycount < this.endYCont()+ this.waitYCont() ){
							this.origin.y = this.contents.height - (this.height - this.standardPadding() * 2)
						}  
					}
				}else{ 
					this.origin.y =  0
					this._ycount = this.startYCount()
				}  
			}
		}
	}
};



//开始浮动
Window_FloatHelp.prototype.startFloat  = function() {
	this._ycount = this.startYCount()
	this._ygd = false 
	this._count = this.startCount()
    this.setOpacity(this._count)
	this.updateXywh()  
	this.origin.y = 0 
};

 
Window_FloatHelp.prototype.updateXywh = function() {
	if( this._lywin ){   
		var rect = this.getRect(this._lywin )
		var x0 = rect.x 
		var y0 = rect.y
		var x1 = rect.x + rect.width
		var y1 = rect.y + rect.height
		var x = 0
		var y = 0
	    var w = this._ckw
	    var h = this._ckh 
		if(w==0 && h == 0){
			var wh = this.getWh() 
			var w = wh[0].clamp(  Window_FloatHelp._ckiw ,Window_FloatHelp._ckaw)
			var h = wh[1].clamp(  Window_FloatHelp._ckih ,Window_FloatHelp._ckah)
		}
	    var sw = SceneManager._screenWidth 
	    if((sw - x1 - w ) >  (x0 - w) ){
		    x = x1  + this.standardPadding()
	    }else{
		    x = x0  - w + this.standardPadding()
	    }
	    var sh = SceneManager._screenHeight 
	    if( ( sh - y1 - h ) >  (y0 - h)  ){ 
		    y = y1 + this.standardPadding()
	    }else{
		    y = y0 - h  +  this.standardPadding()
	    }  
	    this.setMove(x,y,w,h) 
	} 
};

Window_FloatHelp.prototype.getWh = function() {
	if( this._text ){    
		var texts = this.getTextEx(this._text)  
		var w = texts.allweight
		var h = texts.allheight 
		w += this.standardPadding() * 2
		h += this.standardPadding() * 2 
	    this.contents = new Bitmap(w,h);
	    return [w,h]
	} 
	return [0,0]
}; 

Window_FloatHelp.prototype.getRect = function(ly) {
	var ly = ly  
	var rect = ly.itemRect( ly._index ) 
	rect.x -=  ly.canvasToLocalX(0)
	rect.y -=  ly.canvasToLocalY(0) 
	return rect
};
 
Window_FloatHelp.prototype.setMove = function(x,y,w,h) {
	var w = w || 0
	var h = h || 0
	var x = x || 0
	var y = y || 0
	var x = x.clamp( 0, SceneManager._screenWidth  - w ) 
	var y = y.clamp( 0, SceneManager._screenHeight  - h ) 
	this.move(x,y,w,h) 
};
 
//设置来源层
Window_FloatHelp.prototype.setLy = function(win) { 
    this._lywin = win;
    this._lyindex = -10  
};


//设置文本
Window_FloatHelp.prototype.setText = function(text) {  
    this._text = text; 
    this.startFloat()  
    this.refresh() 
};

//设置不透明度
Window_FloatHelp.prototype.setOpacity = function (i) {
	var i = i || 0
	this.opacity = i  
	this.contentsOpacity = i 
	this.backOpacity =   Math.min( i, this.standardBackOpacity())
} 

 
//清除
Window_FloatHelp.prototype.clear = function() {
    this.setText('');
};
  
//设置项目
Window_FloatHelp.prototype.setItem = function(item) {
    this.setText(item ? item.description : '');
};
//刷新
Window_FloatHelp.prototype.refresh = function() { 
    this.contents.clear();
    this.drawTextEx(this._text,0, 0);
};
 
 
Window_FloatHelp.prototype.getTextEx = function(text) { 
	var text = text || '' 
    var textState = { index: 0, x: 0, y: 0, left:0 ,allheight :0 ,allweight : 0 }; 
    textState.text = this.convertEscapeCharacters(text);
    textState.height = this.calcTextHeight(textState, false); 
    textState.allheight = textState.height   
    this.resetFontSettings(); 
    while (textState.index < textState.text.length) { 
        this.getTextEx2(textState);
    } 
    return textState  
};
 
//处理字符
Window_FloatHelp.prototype.getTextEx2 = function(textState) { 
    switch (textState.text[textState.index]) { 
    case '\n': 
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
    if( textState.allweight  <  textState.x){
	    textState.allweight = textState.x
    }
}; 

 
//添加新行
Window_FloatHelp.prototype.convertEscapeCharacters = function(text) { 
    text = text.replace(/\\/g, '\x1b'); 
    text = text.replace(/\x1b\x1b/g, '\\'); 
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this)); 
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
    text = text.replace(/\x1bnw/gi, "\n");
    return text;
};



Window_FloatHelp.prototype.processNormalCharacter = function(textState) {
    var c = textState.text[textState.index++];
    var w = this.textWidth(c);
    if( textState.x +  w  > Window_FloatHelp._ckaw - this.standardPadding() * 2 ){
	    this.processNewLine(textState); 
	    textState.index--
    }
    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
    textState.x += w;
};
//处理新行
Window_FloatHelp.prototype.processNewLine = function(textState) {
    textState.x = textState.left;
    textState.y += textState.height;
    textState.height = this.calcTextHeight(textState, false);
    
    textState.allheight = textState.y + textState.height;
    if(  textState.allheight > Window_FloatHelp._ckah  - this.standardPadding() * 2 ){
	    this._ygd = true 
    }
    textState.index++;
}; 
 
//处理绘制图标
Window_FloatHelp.prototype.processDrawIcon = function(iconIndex, textState) {
    if(textState.x +  Window_Base._iconWidth + 4 > Window_FloatHelp._ckaw - this.standardPadding() * 2  ){
	    this.processNewLine(textState); 
	    textState.index--  
    }
    this.drawIcon(iconIndex, textState.x + 2, textState.y + 2);
    textState.x += Window_Base._iconWidth + 4;
};