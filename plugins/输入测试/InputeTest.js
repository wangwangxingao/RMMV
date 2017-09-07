
function KeyBoard() {
    this.initialize.apply(this, arguments);
}

/**键时间 */
KeyBoard._keyTime = 1
/**更新 */
KeyBoard.update = function () {
    this._keyTime++
};

/**初始化 */
KeyBoard.prototype.initialize = function () {
    this.clear();
};

/**清除 */
KeyBoard.prototype.clear = function () {
    console.log(JSON.parse(JSON.stringify(this)))
    this._keyboard = {}
    this._keyboardtype = {}
};
/**时间 */
KeyBoard.prototype.time = function () {
    return KeyBoard._keyTime
};

/**按键基础 */
KeyBoard.prototype.keyBase = function (i, z, x, y) {
    console.log(i, z, x, y)
    if (!this._keyboardtype[i]) {
        this._keyboardtype[i] = new KeyInput()
    }
    this._keyboardtype[i].keyChange(z, this.time(), x, y)
};

/**全部按键 */
KeyBoard.prototype.keyAll = function (x, y) {
    var z = Object.getOwnPropertyNames(this._keyboard)
    this.keyBase("all", z, x, y)
};

/**移动基础 */
KeyBoard.prototype.keyMoveBase = function (i, x, y) {
    if (!this._keyboardtype[i]) {
        this._keyboardtype[i] = new KeyInput()
    }
    this._keyboardtype[i].keyMove(this.time(), x, y)
};
/**键移动 */
KeyBoard.prototype.keyMove = function (i, x, y) {
    this.keyMoveBase(i, x, y)
    this.keyAllMove(x, y)
};

KeyBoard.prototype.keyAllMove = function (x, y) {
    this.keyMoveBase("all", x, y)
};
/**按键 */
KeyBoard.prototype.keyDown = function (i, x, y) {
    if (!this._keyboard[i]) {
        this._keyboard[i] = this.time()
        this.keyBase(i, 1, x, y)
        this.keyAll(x, y)
    }
};
/**抬起 */
KeyBoard.prototype.keyUp = function (i, x, y) {
    delete this._keyboard[i]
    this.keyBase(i, 0, x, y)
    this.keyAll(0, x, y)
};


function KeyInput() {
    this.initialize.apply(this, arguments);
}
KeyInput.prototype.initialize = function () {
    this.clear()
};
KeyInput.prototype.clear = function () {
    this._move = []
    this.setTemp(0)
};
/**设置当前 */
KeyInput.prototype.setTemp = function (i) {
    this._temp = {
        "down": i,
        "move": [],
        "start": null,
        "long": null,
        "end": null,
        "ismove": false,
        "islong": false,
        "ti": false,
    }
};
/**储存临时 */
KeyInput.prototype.saveTemp = function () {
    this._move.unshift(this._temp)
};
/**改变 */
KeyInput.prototype.keyChange = function (i, time, x, y) {
    this.saveTemp()
    this.setTemp(i)
    this.keyMove(time, x, y)
};

/**移动 */
KeyInput.prototype.keyMove = function (time, x, y) {
    this._temp.move.unshift([time, x, y])
    if (!this._temp.start) {
        this._temp.start = [time, x, y]
        this._temp.long = [time + 60, x, y]
        this._temp.ti = true 
    }else{
        this._temp.ti = false 
    }
    this._temp.end = [time, x, y]
};
/**触发 */
KeyInput.prototype.keyisTi = function () { 
    return this._temp.ti
}; 

/**按下 */
KeyInput.prototype.keyisDown = function () {
    return this._temp.down
};

/**长时间 */
KeyInput.prototype.keyisLong = function () {
    if (this._temp.islong) {
    } else {
        var xy1 = this._temp.start
        var xy0 = this._temp.long
        this._temp.islong = xy1[0] >= xy0[0]
    }
    return this._temp.islong
};
 
/**移动 */
KeyInput.prototype.keyisMove = function () {
    if (this._temp.ismove) {
    } else {
        var xy1 = this._temp.start
        var xy0 = this._temp.end
        this._temp.ismove = Math.abs(xy1[1] - xy0[1]) + Math.abs(xy1[2] - xy0[2]) > 20
    }
    return this._temp.ismove
};
 
/**手势
 * 
 * 
  //手势设置清除
    KeyInput.Gesture_clear = function() {
	    
	    this._Gesture_last_dChain = [];
	    this._Gesture_last_time = 0;
	    this._Gesture_directionChain = [];
	    this._Gesture_time = 0;
	    
	    this._Gesture_lastX = 0;
		this._Gesture_lastY = 0;
	

	    //n方向   读取默认值
	    var fx = parseInt(PluginManager.parameters("ww_Gesture")["fx"], 10);
	    if (isFinite(fx) &&　[0,4,8].contains(fx) ){
		    this._Gesture_fx = fx;
	    }else {
		    this._Gesture_fx  = 4;
	    }
	    //不定向判断 重置  
	    var fx0 =(PluginManager.parameters("ww_Gesture")["fx0"])
        if(fx0 != ""){
	        this._Gesture_fx0 = JSON.parse(fx0);
        }else{
	        this._Gesture_fx0 = [];
        } 
	    //时间输入方式 读取默认值
	    var sjshuru = parseInt(PluginManager.parameters("ww_Gesture")["sjshuru"], 10);

	    if (isFinite(sjshuru) &&　[0,1].contains(sjshuru) )
	    {
		    this._Gesture_sjshuru = sjshuru
	    }else {
		    this._Gesture_sjshuru  = 0;
	    } 

	    //位置输入方式 读取默认值
	    var wzshuru = parseInt(PluginManager.parameters("ww_Gesture")["wzshuru"], 10);
	    if (isFinite(wzshuru) &&　[0,1].contains(wzshuru) ) {
		    this._Gesture_wzshuru = wzshuru;
	    }else {
		    this._Gesture_wzshuru  = 0;
	    } 
	    //位置间隔 读取默认值
	    var wzjiange = parseInt(PluginManager.parameters("ww_Gesture")["wzjiange"], 10);
	    if (isFinite(wzjiange) &&　wzjiange > 0 ){
		    this._Gesture_wzjiange  = wzjiange;
	    }else {
		    this._Gesture_wzjiange  = 100;
	    }
	    //时间间隔 读取默认值
	    var sjjiange = parseInt(PluginManager.parameters("ww_Gesture")["sjjiange"], 10);
	    if (isFinite(sjjiange) &&　sjjiange > 0 ) {
		    this._Gesture_sjjiange  = sjjiange;
	    }else {
		    this._Gesture_sjjiange  = 1;
	    }
	    
	    //判断方式 读取默认值
	    var fangshi = parseInt(PluginManager.parameters("ww_Gesture")["fangshi"], 10);
	    if (isFinite(fangshi) &&　[0,1,2,3].contains(fangshi) ){
		    this._Gesture_fangshi  = fangshi;
	    }else {
		    this._Gesture_fangshi  = 0;
	    }
	    //判断是否即时 读取默认值
	    var jishi =parseInt(PluginManager.parameters("ww_Gesture")["jishi"], 10);
	  
	    if (isFinite(jishi) &&　[0,1,2].contains(jishi) ) {
		    this._Gesture_jishi  = jishi;
	    }else {
		    this._Gesture_jishi  = 0;
	    }

    }

 
    //开始手势
	KeyInput.startGesture = function (x,y) {
		this._Gesture_lastX = x;
		this._Gesture_lastY = y;
		this._Gesture_time = 0;
		this._Gesture_directionChain = [];
	}
	
	//进行手势
	KeyInput.progressGesture = function (x,y) {
		//手势时间++
		this._Gesture_time ++;
		//判断时间间隔
        if (this._Gesture_sjjiange> 0){
	        if (this._Gesture_time.mod(this._Gesture_sjjiange) != 0){
		        //时间输入方式
				this.Gesture_sjshuru(x,y) ;
		        return;
	        }
        }
        
		var x1 = this._Gesture_lastX;
		var y1 = this._Gesture_lastY;
		var x2 = x;
		var y2 = y;
	    var wzjiange = this._Gesture_wzjiange;
	    var jiaodu;
	    var direction ;
	    
		//位置输入方式
	    this.Gesture_wzshuru(x,y) ; 

        //n方向判断
        var fx = this._Gesture_fx;
        if (fx == 4){
	        //4方向
	        direction = this.Gesture_4d(x1,y1,x2,y2,wzjiange);
        }else {
	        //计算角度
	        jiaodu = this.Gesture_jd(x1,y1,x2,y2,wzjiange);
	        if (!isFinite(jiaodu)){return  };
	        if(fx==8){
		        //8方向
		        direction = this.Gesture_8d(jiaodu)
	        }else {
		        //不定方向
		        direction = this.Gesture_0d(jiaodu)
	        }
        }
        if (!isFinite(direction)){return   }  ;
        // 手势 添加
        this.Gesture_push(direction);
        
        // 记录最后位置
		this._Gesture_lastX = x;
		this._Gesture_lastY = y;
	}
 
	//停止手势
	KeyInput.stopGesture = function (x,y) {
		this._Gesture_last_time = this._Gesture_time 
		this._Gesture_last_dChain  = this._Gesture_directionChain
		this._Gesture_directionChain = [];
		this._Gesture_time = 0;
		this._Gesture_lastX = x;
		this._Gesture_lastY = y;
	}

    //时间输入方式
    KeyInput.Gesture_sjshuru  = function (x,y) {
	    if (this._Gesture_sjshuru == 1){
		    this._Gesture_lastX = x;
		    this._Gesture_lastY = y;
	    }
    }
   
    //位置输入方式
    KeyInput.Gesture_wzshuru  = function (x,y) {
	    if (this._Gesture_wzshuru == 1){
		    this._Gesture_lastX = x;
		    this._Gesture_lastY = y;
	    }
    }

    //四方向
    KeyInput.Gesture_4d= function (x1,y1,x2,y2,wzjiange){
	    var x = x2;
		var y = y2;
		var lastX = x1;
		var lastY = y1;
		var wzjiange = wzjiange;
		//差值
		var subX = x - lastX;
		var subY = y - lastY;
		//差值的绝对值
		var distX = (subX > 0 ? subX : (-subX))
		var distY = (subY > 0 ? subY : (-subY));
		var direction;
		//如果差值绝对值小于间隔
		if (distX < wzjiange && distY < wzjiange )
			return ;
	    // 如果 x 差值 > y 差值
		if (distX > distY){
		    //方向左
			direction = subX < 0 ? 4 : 6;
	    }else{
		    //方向上下
			direction = subY < 0 ? 8 : 2;
	    }
	    return direction;
    } 
 
    
    //360 角度计算
    KeyInput.Gesture_jd =function (x1,y1,x2,y2,wzjiange) {
    	var subx=Math.abs(x1-x2);
		var suby=Math.abs(y1-y2);
		var subz2 = subx*subx +suby*suby;
      
		//如果间隔距离的平方和 小于间隔的平方
		if (subz2 < wzjiange*wzjiange){
			return ;
		}
		//判定角度
	    if ((x2-x1)==0  && (y2-y1)==0 ){
	        return ;
	    }else if (x2-x1 == 0){
	        if ((y1-y2)>0) {
		        jiaodu = 90;
		    }else if ((y1-y2)<0){ 
			    jiaodu = 270;
		    }
	    }else if (y2-y1 == 0){
	        if ((x2-x1)>0) {
		        jiaodu = 0;
		    }else if ((x2-x1)<0){ 
			    jiaodu = 180;
		    }
		}else{
		    var subz=Math.sqrt(subz2);
		    var jiaodu =((Math.asin(suby/subz)/Math.PI)*180);
	
		    if ((x2-x1) > 0 && (y1-y2)>0){
			    jiaodu = jiaodu.mod(360);
			}else if ((x2-x1) > 0 && (y1-y2)<0 )  {
				jiaodu = (-jiaodu).mod(360);
			}else if ((x2-x1) < 0 && (y1-y2)<0 ) {
		        jiaodu = (180+ jiaodu).mod(360);
		    }else if ((x2-x1) < 0 && (y1-y2)>0 ){
			    jiaodu = (180-jiaodu).mod(360);
		    }
	    }	
    	return jiaodu;
    }

    
    //8方向
    KeyInput.Gesture_8d= function (jiaodu) {
	    var direction;
	    var jiaodu=jiaodu.mod(360)
	    var dirs =[6,9,8,7,4,1,2,3,6]
	    var dirjd=[0,45,90,135,180,225,270,315,360]
	    for (var id =0;id < dirjd.length  ;id++){
			if ( Math.abs(dirjd[id]-jiaodu) <= 22.5 ){
				direction = dirs[id]
				return direction;
			}
        }
    	return direction;
    }

    // 不定方向
    KeyInput.Gesture_0d= function (jiaodu) {
        var direction	 ;
	    var jiaodu = jiaodu.mod(360);
	    var dirjd = this._Gesture_fx0 ;
	    for (var id =0;id < dirjd.length  ;id++){
			if ((jiaodu >= (dirjd[id][1]).mod(360) )&& (jiaodu <= (dirjd[id][2]).mod(360) ) ){
			    direction = dirjd[id][0];
				return direction;
			}
        }
    	return direction;
    }



    // 方向添加    
	KeyInput.Gesture_push = function (direction) {
		if (direction != this._Gesture_directionChain[this._Gesture_directionChain.length - 1]) {
			this._Gesture_directionChain.push(direction);
		}
	}



	//手势
    KeyInput.Gesture = function(){
	    var arg =[]
	    for (var i=0;i<arguments.length;i++){arg.push(arguments[i])}
	    var gt = arg 
	    
	    //是否即时
	    var jishi =  this._Gesture_jishi ;
	    
	    var  gesture;
	    var  gesture2 ;
	    //即时手势
	    if  ( jishi == 1  ||  jishi == 0){
		    gesture = this._Gesture_directionChain.clone();
		    gesture2= gt.clone();
		    if (this.Gesture_true(gesture,gesture2)){
			    return true;
		    }
	    }
	    //之前的手势
	    if (jishi == 2 || jishi == 0){
		    gesture = this._Gesture_last_dChain.clone();
		    gesture2= gt.clone();
		    if (this.Gesture_true(gesture,gesture2)){
			    return true;
		    }
	    }
	    return false;
    }
	    
	KeyInput.Gesture_true = function (gesture,gesture2) {
		//判定方式
		var fangshi = this._Gesture_fangshi;
		if(gesture.join()!= "" && gesture2.join() != ""){
			//完全符合
			if (fangshi == 0){
				if ( gesture.join() == gesture2.join()){
					return true;
				}
			}
			//结尾符合
			if ( fangshi == 1 ){
				gesture.reverse();
				gesture2.reverse();
				if( gesture.join().indexOf( gesture2.join()) == 0 ){
				    return true;
			    }
		    }
		    //开头符合
		    if ( fangshi == 2 ){
			    if( gesture.join().indexOf( gesture2.join()) == 0 ){
				    return true;
			    }
		    }
		    //包含
			if ( fangshi == 3 ){
				if( gesture.join().indexOf( gesture2.join()) >= 0 ){
					return true;
				}
			}
		}
		return false ;
	}
 



 */
   

















//-----------------------------------------------------------------------------





//-----------------------------------------------------------------------------
/**从键盘和游戏手柄处理输入数据的静态类。
 * The static class that handles input data from the keyboard and gamepads.
 * 输入
 * @class Input
 */
/**function Input() {
    throw new Error('This is a static class');
}
*/
/**
 * 初始化
 * 
 * 初始化输入系统。
 * Initializes the input system.
 *
 * @static
 * @method initialize
 */
Input.initialize = function () {
    //清除
    this.clear();
    //包裹nwjs警报
    this._wrapNwjsAlert();
    //安装事件处理者
    this._setupEventHandlers();
};

/**
 * 键重复等待
 * 
 * 在帧中的键重复的等待时间
 * The wait time of the key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */
Input.keyRepeatWait = 24;

/**
 * 键重复间隔时间
 * 
 * 在帧中的键重复的间隔时间
 * The interval of the key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */
Input.keyRepeatInterval = 6;

/**
 * 键映射
 * 
 * 一个哈希表来从一个虚拟键代码转换为一个映射的键名
 * A hash table to convert from a virtual key code to a mapped key name.
 *
 * @static
 * @property keyMapper
 * @type Object
 */
Input.keyMapper = {
    9: 'tab',       // tab
    13: 'ok',       // enter
    16: 'shift',    // shift
    17: 'control',  // control
    18: 'control',  // alt
    27: 'escape',   // escape
    32: 'ok',       // space
    33: 'pageup',   // pageup
    34: 'pagedown', // pagedown
    37: 'left',     // left arrow
    38: 'up',       // up arrow
    39: 'right',    // right arrow
    40: 'down',     // down arrow
    45: 'escape',   // insert
    81: 'pageup',   // Q
    87: 'pagedown', // W
    88: 'escape',   // X
    90: 'ok',       // Z
    96: 'escape',   // numpad 0
    98: 'down',     // numpad 2
    100: 'left',    // numpad 4
    102: 'right',   // numpad 6
    104: 'up',      // numpad 8
    120: 'debug'    // F9
};

/**
 * 手柄按钮映射
 * 
 * 一个哈希表来从手柄按钮转换为映射的键名。
 * A hash table to convert from a gamepad button to a mapped key name.
 *
 * @static
 * @property gamepadMapper
 * @type Object
 */
Input.gamepadMapper = {
    0: 'ok',        // A
    1: 'cancel',    // B
    2: 'shift',     // X
    3: 'menu',      // Y
    4: 'pageup',    // LB
    5: 'pagedown',  // RB
    12: 'up',       // D-pad up
    13: 'down',     // D-pad down
    14: 'left',     // D-pad left
    15: 'right',    // D-pad right
};

/**
 * 清除
 * 
 * 清除所有的输入数据。
 * Clears all the input data.
 *
 * @static
 * @method clear
 */
Input.clear = function () {
    //当前状态
    this._keyboard = new KeyBoard();
    //游戏手柄状态
    this._gamepadStates = {};
    //最新键
    this._latestButton = null;
    //按下时间
    this._pressedTime = 0;
    //4方向
    this._dir4 = 0;
    //8方向
    this._dir8 = 0;
    //优先轴
    this._preferredAxis = '';
    //日期
    this._date = 0;
};

/**
 * 更新
 * 
 * 更新的输入数据。
 * Updates the input data.
 * 
 * @static
 * @method update
 */
Input.update = function () {
    //轮询游戏手柄
    this._pollGamepads();
    //更新方向
    this._updateDirection();
};



/**[只读]为数字小键盘上​​四方向值，或者0
 * [read-only] The four direction value as a number of the numpad, or 0 for neutral.
 *
 * 方向4
 * 
 * @static
 * @property dir4
 * @type Number
 */
//定义属性 
Object.defineProperty(Input, 'dir4', {
    get: function () {
        //返回 _dir4
        return this._dir4;
    },
    configurable: true
});

/**[只读]​​八个方向值为数字小键盘上，或者为0中性。
 * [read-only] The eight direction value as a number of the numpad, or 0 for neutral.
 *
 * 方向8
 * 
 * @static
 * @property dir8
 * @type Number
 */
//定义属性
Object.defineProperty(Input, 'dir8', {
    get: function () {
        //返回 _dir8
        return this._dir8;
    },
    configurable: true
});

/**[只读]的最后一个输入的时间 ​​毫秒
 * [read-only] The time of the last input in milliseconds.
 *
 * 时间
 * 
 * @static
 * @property date
 * @type Number
 */
//定义属性 
Object.defineProperty(Input, 'date', {
    get: function () {
        //返回 _date
        return this._date;
    },
    configurable: true
});

/**包裹nwjs警报
 * @static
 * @method _wrapNwjsAlert
 * @private
 */
Input._wrapNwjsAlert = function () {
    if (Utils.isNwjs()) {
        var _alert = window.alert;
        window.alert = function () {
            var gui = require('nw.gui');
            var win = gui.Window.get();
            _alert.apply(this, arguments);
            win.focus();
            Input.clear();
        };
    }
};

/**安装事件处理者
 * @static
 * @method _setupEventHandlers
 * @private
 */
//安装事件处理者
Input._setupEventHandlers = function () {
    //文件 添加事件监听 ('keydown', 当键按下(绑定(this)))
    document.addEventListener('keydown', this._onKeyDown.bind(this));
    //文件 添加事件监听 ('keyup', 当键抬起(绑定(this)))
    document.addEventListener('keyup', this._onKeyUp.bind(this));
    //窗口 添加事件监听 ('blur', 当失去焦点(绑定(this)))
    window.addEventListener('blur', this._onLostFocus.bind(this));
};

/**当键按下
 * @static
 * @method _onKeyDown
 * @param {KeyboardEvent} event
 * @private
 */
//当键按下
Input._onKeyDown = function (event) {
    //如果 需要避免默认 (键值)
    if (this._shouldPreventDefault(event.keyCode)) {
        //避免默认
        event.preventDefault();
    }
    //键值===144
    if (event.keyCode === 144) {    // Numlock  数字开关
        //清除
        this.clear();
    }
    //当前状态 键 =true
    this._keyboard.keyDown(event.keyCode)
};

/**需要避免默认
 * @static
 * @method _shouldPreventDefault
 * @param {Number} keyCode
 * @private
 */
//需要避免默认
Input._shouldPreventDefault = function (keyCode) {
    switch (keyCode) {
        case 8:     // backspace  删除
        case 33:    // pageup     页上
        case 34:    // pagedown   页下
        case 37:    // left arrow  左箭头
        case 38:    // up arrow   上箭头
        case 39:    // right arrow  右箭头
        case 40:    // down arrow  下箭头
            return true;
    }
    return false;
};

/**当键抬起
 * @static
 * @method _onKeyUp
 * @param {KeyboardEvent} event
 * @private
 */
//当键抬起
Input._onKeyUp = function (event) {
    this._keyboard.keyUp(event.keyCode)
    // 如果 键值===0
    if (event.keyCode === 0) {  // For QtWebEngine on OS X
        //清除
        this.clear();
    }
};

/**当失去焦点
 * @static
 * @method _onLostFocus
 * @private
 */
//当失去焦点
Input._onLostFocus = function () {
    //清除
    this.clear();
};

/**轮询游戏手柄
 * @static
 * @method _pollGamepads
 * @private
 */
//轮询游戏手柄
Input._pollGamepads = function () {
    //浏览器获得 游戏手柄组
    if (navigator.getGamepads) {
        //游戏手柄组 = 浏览器获得游戏手柄组
        var gamepads = navigator.getGamepads();
        //如果 游戏手柄组 存在
        if (gamepads) {
            //循环 在 游戏手柄组
            for (var i = 0; i < gamepads.length; i++) {
                //游戏手柄 = 游戏手柄组[i]
                var gamepad = gamepads[i];
                //如果 游戏手柄 并且 游戏手柄 连接的
                if (gamepad && gamepad.connected) {
                    //更新 游戏手柄状态[游戏手柄]
                    this._updateGamepadState(gamepad);
                }
            }
        }
    }
};

/**更新游戏手柄状态
 * @static
 * @method _updateGamepadState
 * @param {Gamepad} gamepad
 * @param {Number} index
 * @private
 */
//更新游戏手柄状态
Input._updateGamepadState = function (gamepad, i) {
    // 最后状态 = 游戏手柄 状态[游戏手柄.索引]
    var lastState = this._gamepadStates[gamepad.index] || [];
    //新的状态 = []
    var newState = [];
    //按键组 = 游戏手柄.按键组
    var buttons = gamepad.buttons;
    //坐标轴 = 游戏手柄 坐标轴 
    var axes = gamepad.axes;
    //临界值 = 0.5
    var threshold = 0.5;

    newState[12] = false;
    newState[13] = false;
    newState[14] = false;
    newState[15] = false;
    //循环 开始时 i = 0 ; 当 i < 按键组 长度 时 ; 每一次 i++
    for (var i = 0; i < buttons.length; i++) {
        //新状态[i] = 按键组[i].按下
        newState[i] = buttons[i].pressed;
    }
    //如果 坐标轴[1]< -临界值
    if (axes[1] < -threshold) {
        //新状态[12] = true 上 
        newState[12] = true;    // up
        //否则 如果 坐标轴[1] > 临界值 
    } else if (axes[1] > threshold) {
        //新状态[13] = true 下
        newState[13] = true;    // down
    }
    //如果 坐标轴[0]< -临界值
    if (axes[0] < -threshold) {
        //新状态[14] = true 左
        newState[14] = true;    // left
        //否则 如果 坐标轴[0] > 临界值 
    } else if (axes[0] > threshold) {
        //新状态[15] = true 右
        newState[15] = true;    // right
    }
    //循环 开始时 j = 0 ; 当 j < 新状态 长度 时 ; 每一次 j++
    for (var j = 0; j < newState.length; j++) {
        //按下
        if (newState[j]) {
            newState[j] = (lastState[j] || 0) + 1;
        } else {
            //抬起
            newState[j] = 0
        }
    }
    this._gamepadStates[gamepad.index] = newState
};

/**更新方向
 * @static
 * @method _updateDirection
 * @private
 */
Input._updateDirection = function () {
    var x = this._signX();
    var y = this._signY();
    //8 方向
    this._dir8 = this._makeNumpadDirection(x, y);

    if (x !== 0 && y !== 0) {
        //优先轴 设置为 x
        if (this._preferredAxis === 'x') {
            y = 0;
        } else {
            x = 0;
        }
        // x 不等于0
    } else if (x !== 0) {
        //优先轴 设置为 y
        this._preferredAxis = 'y';
        //  y不等于0
    } else if (y !== 0) {
        //优先轴 设置为 x
        this._preferredAxis = 'x';
    }
    //4 方向
    this._dir4 = this._makeNumpadDirection(x, y);
};

/**标记x
 * @static
 * @method _signX
 * @private
 */
Input._signX = function () {
    var x = 0;
    //是按下 left 左
    if (this.isPressed('left')) {
        x--;
    }
    //是按下 right 右
    if (this.isPressed('right')) {
        x++;
    }
    return x;
};

/**标记y
 * @static
 * @method _signY
 * @private
 */
Input._signY = function () {
    var y = 0;
    //是按下 up 上
    if (this.isPressed('up')) {
        y--;
    }
    //是按下 down  下
    if (this.isPressed('down')) {
        y++;
    }
    return y;
};

/**制作数字方向
 * @static
 * @method _makeNumpadDirection
 * @param {Number} x
 * @param {Number} y
 * @return {Number}
 * @private
 */
Input._makeNumpadDirection = function (x, y) {
    if (x !== 0 || y !== 0) {
        return 5 - y * 3 + x;
    }
    return 0;
};

/**是逃跑一致
 * @static
 * @method _isEscapeCompatible
 * @param {String} keyName
 * @return {Boolean}
 * @private
 */
Input._isEscapeCompatible = function (keyName) {
    // 键名=== 'cancel' 或 'menu'
    return keyName === 'cancel' || keyName === 'menu';
};




Input.isPressed = function (keyName) {
    return false
};
Input.isTriggered = function (keyName) {
    return false
};
Input.isRepeated = function (keyName) {
    return false
};


Input.isLongPressed = function (keyName) {

    return false
};



Input.initialize()




//-----------------------------------------------------------------------------
/**来自鼠标和触摸屏处理输入数据的静态类
 * The static class that handles input data from the mouse and touchscreen.
 * 触摸输入 
 * @class TouchInput
 */
/**function TouchInput() {
    throw new Error('This is a static class');
}
*/
/**初始化触摸系统
 * Initializes the touch system.
 *
 * @static
 * @method initialize
 */
//初始化
TouchInput.initialize = function () {
    //清除
    this.clear();
    //安装 事件处理组()
    this._setupEventHandlers();
};

/**在帧中的伪键重复的等待时间
 * The wait time of the pseudo key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */
//键重复等待
TouchInput.keyRepeatWait = 24;

/**在帧中的伪键重复的间隔时间。
 * The interval of the pseudo key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */
//键重复间隔
TouchInput.keyRepeatInterval = 6;

/**清除所有的触摸数据。
 * Clears all the touch data.
 *
 * @static
 * @method clear
 */
//清除
TouchInput.clear = function () {
    this._touch = new KeyBoard();
};


/**更新触摸数据
 * Updates the touch data.
 *
 * @static
 * @method update
 */
//更新
TouchInput.update = function () {
};


/**安装事件处理组
 * @static
 * @method _setupEventHandlers
 * @private
 */
//安装事件处理组
TouchInput._setupEventHandlers = function () {
    //鼠标按下
    document.addEventListener('mousedown', this._onMouseDown.bind(this));
    //鼠标移动
    document.addEventListener('mousemove', this._onMouseMove.bind(this));
    //鼠标抬起
    document.addEventListener('mouseup', this._onMouseUp.bind(this));
    //轮
    document.addEventListener('wheel', this._onWheel.bind(this));
    //触摸开始
    document.addEventListener('touchstart', this._onTouchStart.bind(this));
    //触摸移动
    document.addEventListener('touchmove', this._onTouchMove.bind(this));
    //触摸结束
    document.addEventListener('touchend', this._onTouchEnd.bind(this));
    //触摸取消
    document.addEventListener('touchcancel', this._onTouchCancel.bind(this));
    //指针按下
    document.addEventListener('pointerdown', this._onPointerDown.bind(this));
};

/**当鼠标按下
 * @static
 * @method _onMouseDown
 * @param {MouseEvent} event
 * @private
 */
//当鼠标按下
TouchInput._onMouseDown = function (event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    this._touch.keyDown(event.button, x, y)
    //this._touch.keyAll(x, y)
};

//当鼠标移动
TouchInput._onMouseMove = function (event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    this._touch.keyMove(event.button, x, y);
    //this._touch.keyAllMove(x, y)
};


//当鼠标抬起
TouchInput._onMouseUp = function (event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    this._touch.keyUp(event.button, x, y)
    //this._touch.keyAll(   x, y)
};

/**当滚动
 * @static
 * @method _onWheel
 * @param {WheelEvent} event
 * @private
 */
//当滚动
TouchInput._onWheel = function (event) {

    //事件 轮x
    this.wheelX += event.deltaX;
    //事件 轮y
    this.wheelY += event.deltaY;
    //避免缺省
    event.preventDefault();
};

/**当触摸开始
 * @static
 * @method _onTouchStart
 * @param {TouchEvent} event
 * @private
 */
//当触摸开始
TouchInput._onTouchStart = function (event) {
    //循环 在 事件改变触摸组
    for (var i = 0; i < event.changedTouches.length; i++) {
        //触摸 =  事件改变触摸组[i]
        var touch = event.changedTouches[i];
        //画布x
        var x = Graphics.pageToCanvasX(touch.pageX);
        //画布y
        var y = Graphics.pageToCanvasY(touch.pageY);
        //id 
        var id = touch.identifier

        //是在画布中
        if (Graphics.isInsideCanvas(x, y)) {
            //避免默认
            event.preventDefault();
        }
    }
    if (window.cordova || window.navigator.standalone) {
        //避免默认
        event.preventDefault();
    }
};

/**当触摸移动
 * @static
 * @method _onTouchMove
 * @param {TouchEvent} event
 * @private
 */
//当触摸移动
TouchInput._onTouchMove = function (event) {
    //循环 在 事件改变触摸组
    for (var i = 0; i < event.changedTouches.length; i++) {
        //触摸 = 事件改变触摸组[i]
        var touch = event.changedTouches[i];
        //画布x
        var x = Graphics.pageToCanvasX(touch.pageX);
        //画布y
        var y = Graphics.pageToCanvasY(touch.pageY);
        //当移动 (x,y)
        this._onMove(x, y);
    }
};

/**当触摸结束
 * @static
 * @method _onTouchEnd
 * @param {TouchEvent} event
 * @private
 */
//当触摸结束
TouchInput._onTouchEnd = function (event) {
    //循环 在 事件改变触摸组
    for (var i = 0; i < event.changedTouches.length; i++) {
        //触摸 = 事件改变触摸组[i]
        var touch = event.changedTouches[i];
        //画布x
        var x = Graphics.pageToCanvasX(touch.pageX);
        //画布y
        var y = Graphics.pageToCanvasY(touch.pageY);
        //屏幕按下 = false
        this._screenPressed = false;
        //当释放(x,y)
        this._onRelease(x, y);
    }
};

/**当触摸取消
 * @static
 * @method _onTouchCancel
 * @param {TouchEvent} event
 * @private
 */
//当触摸取消
TouchInput._onTouchCancel = function (event) {
    this._screenPressed = false;
};

/**当指示物按下
 * @static
 * @method _onPointerDown
 * @param {PointerEvent} event
 * @private
 */
//当指示物按下
TouchInput._onPointerDown = function (event) {
    if (event.pointerType === 'touch' && !event.isPrimary) {
        var x = Graphics.pageToCanvasX(event.pageX);
        var y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            // For Microsoft Edge
            this._onCancel(x, y);
            event.preventDefault();
        }
    }
};

/**当触发
 * @static
 * @method _onTrigger
 * @param {Number} x
 * @param {Number} y
 * @private
 */
//当触发
TouchInput._onTrigger = function (x, y) {
    this._events.triggered = true;
    this._x = x;
    this._y = y;
    this._date = Date.now();
};

/**当取消 x,y
 * @static
 * @method _onCancel
 * @param {Number} x
 * @param {Number} y
 * @private
 */
//当取消
TouchInput._onCancel = function (x, y) {
    this._events.cancelled = true;
    this._x = x;
    this._y = y;
};

/**当移动 x,y
 * @static
 * @method _onMove
 * @param {Number} x
 * @param {Number} y
 * @private
 */
//当移动
TouchInput._onMove = function (x, y) {


};

/**当释放
 * @static
 * @method _onRelease
 * @param {Number} x
 * @param {Number} y
 * @private
 */
//当释放
TouchInput._onRelease = function (x, y) {
    this._events.released = true;
    this._x = x;
    this._y = y;
};
TouchInput.initialize()