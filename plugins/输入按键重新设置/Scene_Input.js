//=============================================================================
// Scene_Input.js
//=============================================================================
/*:
 * @plugindesc 输入按键重新设置
 * @author 汪汪
 *
 * @param cs
 * @desc 默认参数
 * @default 汪汪
 *
 * @help
 * SceneManager.push(Scene_Input)
 * 按键后该键添加或删除
 * 按键后显示的为该键值，或者该键值在Scene_Input._codekeys 里的对应值，可以修改 Scene_Input._codekeys 来让键值更直观
 */






//-----------------------------------------------------------------------------
// Scene_Input
// 选项场景
// The scene class of the options screen.
// 处理 选项画面 的类

function Scene_Input() {
    this.initialize.apply(this, arguments);
}


//设置原形 
Scene_Input.prototype = Object.create(Scene_MenuBase.prototype);
//设置创造者
Scene_Input.prototype.constructor = Scene_Input;
//初始化
Scene_Input.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};
//创建
Scene_Input.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createOptionsWindow();
};
//终止
Scene_Input.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    ConfigManager.save();
};
//创建选项窗口
Scene_Input.prototype.createOptionsWindow = function() {
    this._optionsWindow = new Window_Input();
    this._optionsWindow.setHandler('cancel', this.cancel.bind(this));
    this._optionsWindow.setHandler('ok', this.ok.bind(this));
    this.addChild(this._optionsWindow);
	this._optionsWindow2 = new Window_Input2()
    this.addChild(this._optionsWindow2);

};

Scene_Input.prototype.cancel = function() { 
    var se=this._optionsWindow
	var i = se.getnullKey() 
	if(i < 0 ){
		se.savekeys()
   	 	this.popScene()
		return
	}
	se.select(i);
	this.ok()
};
 

Scene_Input.prototype.ok = function() { 
    var se=this._optionsWindow
    var se2=this._optionsWindow2
    se.deactivate()
	se2.open("请设置按")
    var f = function(event) {  
        document.removeEventListener('keydown', f);
		se.setKey(event.keyCode) 
		se2.refresh(Scene_Input.codeKey( event.keyCode) )
		setTimeout(function(){
			se2.close()
			se.activate()
		},1000)
    };
    document.addEventListener('keydown', f);
    
};



Scene_Input._keysLoad = function(){
    this.keyMapper = {}  
    for(var i in Input.keyMapper){
        this.keyMapper[i] = Input.keyMapper[i]
    }     
    this.gamepadMapper ={}
    for(var i in Input.gamepadMapper){
        this.gamepadMapper[i] = Input.gamepadMapper[i]
    } 
}

Scene_Input._keysLoad()

 
Scene_Input._codekeys = {
     9: 'tab',       // tab
    13: 'enter',       // 
    16: 'shift',    // shift
    17: 'control',  // control
    18: 'alt',  // alt
    27: 'escape',   // escape
    32: 'space',       // space
    33: 'pageup',   // pageup
    34: 'pagedown', // pagedown
    37: 'left',     // left arrow
    38: 'up',       // up arrow
    39: 'right',    // right arrow
    40: 'down',     // down arrow
    45: 'insert',   // insert
    81: 'Q',   // Q
    87: 'W', // W
    88: 'X',   // X
    90: 'Z',       // Z
    96: '0',   // numpad 0
    98: 'num 2',     // numpad 2
    100: 'num 4',    // numpad 4
    102: 'num 6',   // numpad 6
    104: 'num 8',      // numpad 8
    120: 'F9'    // F9
}




Scene_Input.codeKey = function(code){
	return Scene_Input._codekeys[code] ? Scene_Input._codekeys[code]  : code
}

Scene_Input._nonullkeys = function(){
    this.keyMapper = {}  
    for(var i in Input.keyMapper){
        this.keyMapper[i] = Input.keyMapper[i]
    }     
    this.gamepadMapper ={}
    for(var i in Input.gamepadMapper){
        this.gamepadMapper[i] = Input.gamepadMapper[i]
    } 
}



function Window_Input() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_Input.prototype = Object.create(Window_Command.prototype);
//设置创造者
Window_Input.prototype.constructor = Window_Input;
//初始化
Window_Input.prototype.initialize = function() {
    this._tempKeys = this.getLastkeys()
    this._lastKeys = this.getLastkeys()
	Window_Command.prototype.initialize.call(this, 0, 0);
	 
    this.updatePlacement(); 
};


Window_Input.prototype.getLastkeys = function() { 
    var temp = {}
    for(var i in Input.keyMapper){
        var key = Input.keyMapper[i]
        if(!temp[key]){
            temp[key] = []
        }
        temp[key].push(i)
    }    
    return temp
};
Window_Input.prototype.savekeys = function() { 
    var temp = this._tempKeys
    Input.keyMapper = {}
	for(var key in temp){
        var keys = temp[key]
        for(var i=0; i < keys.length; i++){
            var code = keys[i]
			Input.keyMapper[code] = key
        }
    }
	ConfigManager.save()
};


Window_Input.prototype.setKey = function(code) { 
    var key = this.currentSymbol()
	var code = "" + code
    if (key == null ){return}
    var temp = this._tempKeys
    var add = true
    for(var i in temp){
        var keys = temp[i]
        for(;;){
            var index = keys.indexOf(code)
            if (index > -1) {
                keys.splice(index, 1);
                if(i == key){
                    add = false
                }
            }else{
                break
            }
        }
    }
    if(add){
        temp[key].push(code)
    }
	this.refresh()
};



Window_Input.prototype.getnullKey = function() { 
    var temp = this._tempKeys
    for(var i in temp){
        var keys = temp[i] 
		if(keys.length <= 0 ){
			var index = this.findSymbol(i);
			return index
		}
    }
	return -1 
};


//窗口宽
Window_Input.prototype.windowWidth = function() {
    return 400;
};
//窗口高
Window_Input.prototype.windowHeight = function() {
    return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
};
//更新位置
Window_Input.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
};
//制作命令列表
Window_Input.prototype.makeCommandList = function() {
    var temp = this._tempKeys
    for(var i in temp){
        this.addCommand(i, i) 
	}
};
//绘制项目
Window_Input.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var statusWidth = this.statusWidth();
    var titleWidth = rect.width - statusWidth;
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, 'left');
    this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, 'right');
};
//状态宽
Window_Input.prototype.statusWidth = function() {
    return 280;
};
//状态文本
Window_Input.prototype.statusText = function(index) {
    var key = this.commandSymbol(index)
    var text = ""
    var temp = this._tempKeys
	var keys = temp[key]
	if(keys){
		var keys2 = keys.map(Scene_Input.codeKey)
		text = keys2.join(",")
	}
    return text
};


function Window_Input2() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_Input2.prototype = Object.create(Window_Base.prototype);
//设置创造者
Window_Input2.prototype.constructor = Window_Input2;
//初始化
Window_Input2.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this,0,0, width, height);
	this.openness = 0
    this.updatePlacement()
    this.refresh();
};
//窗口宽
Window_Input2.prototype.windowWidth = function() {
    return 240;
};
//窗口高
Window_Input2.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};

Window_Input2.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
};
//刷新
Window_Input2.prototype.refresh = function(code) {
    var x = this.textPadding();
    var width = this.contents.width - this.textPadding() * 2;
    this.contents.clear();
    this.drawCurrencyValue(code, this.currencyUnit(), x, 0, width);
};

//货币单位
Window_Input2.prototype.currencyUnit = function() {
    return "键";
};
//打开
Window_Input2.prototype.open = function(code) {
    this.refresh(code);
    Window_Base.prototype.open.call(this);
};



//制作数据
ConfigManager.makeData = function() {
    var config = {};
    config.alwaysDash = this.alwaysDash;
    config.commandRemember = this.commandRemember;
    config.bgmVolume = this.bgmVolume;
    config.bgsVolume = this.bgsVolume;
    config.meVolume = this.meVolume;
    config.seVolume = this.seVolume;
	config.input = Input.keyMapper
    return config;
};
//应用数据
ConfigManager.applyData = function(config) {
    this.alwaysDash = this.readFlag(config, 'alwaysDash');
    this.commandRemember = this.readFlag(config, 'commandRemember');
    this.bgmVolume = this.readVolume(config, 'bgmVolume');
    this.bgsVolume = this.readVolume(config, 'bgsVolume');
    this.meVolume = this.readVolume(config, 'meVolume');
    this.seVolume = this.readVolume(config, 'seVolume');
	Input.keyMapper = config.input || Input.keyMapper 
};

















