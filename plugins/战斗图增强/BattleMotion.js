/*:
 * @plugindesc 战斗图像增强
 * @author BattleMotion
 *  
 * @help 
 * 在数据库中选择一个基本文件, 比如图片 Actor
 * 然后有文件夹中放入 Actor_0 Actor_1 .... 的图片
 * 这些图片会以 Actor 为基础切割 , 以Actor 的 5 x 2 倍大小的图片为例
 * 0,1,2,3,4
 * 5,6,7,8,9
 * 
 * 在脚本下面的
 * Sprite_Actor.MOTIONSLIST
 * 添加一个 
 * Actor:{},
 * 不要忘记括号 
 * 然后对各个动作设置
 * 如 
 * walk :{ index : 1 ,  loop:true ,}
 * index 是选择的文件 , 后面的值 为1 , 则所用的图片为 Actor_1 , 
 * loop 为true 则循环播放
 * abnormal: { index: 2, loop: true , loopcont: 3 , next:"missile", speed: 52 },
 * index为2 则为 Actor_2,
 * loop 为true 
 * loopcont 为3 则为循环3次
 * 则循环播放时为 (第1次)0,1,2,3,4,(第2次)0,1,2,3,4,(第3次)0,1,2,3,4, 这样循环
 * next 为 "missile" 则为 循环3次后 , 转到 "missile" 动作 
 * speed 为 52 ,则速度为52 速度越大变化越慢
 * victory:  { index: 10, loop: true  , reloop : true ,  loopcont: 3 , speed: 52},
 * index为10 则为 Actor_10, 
 * loop 为true 则循环播放 
 * loopcont 为3 则为循环3次 
 * reloop 为 true 则循环播放时 (第1次)0,1,2,3,4,3,2,1,(第2次)0,1,2,3,4,3,2,1,(第3次)0,1,2,3,4,3,2,1 这样循环
 * speed 为 52 ,则速度为52 速度越大变化越慢
 * 没有next ,播放完后会自动恢复到应该的状态
 * 
 * 
 * 当不设置图片 Actor 时 ,会自动用 Sprite_Actor.MOTIONS 代替 
 * 所以需要注意的是,必须有  Sprite_Actor.MOTIONS  里的这18个动作,以避免问题 
 * next 对应的可以不是 这18个动作之一 , 但必须是这个图片被设置过的动作的名字
 * 如可以添加一个
 * test:{index:1 , loop:true }
 * next:"test"
 * 这样也是可以的
 * 
 * 
 */  
Sprite_Actor.MOTIONS = {
    walk:     { index: 0,  loop: true  },
    wait:     { index: 1,  loop: true  },
    chant:    { index: 2,  loop: true  },
    guard:    { index: 3,  loop: true  },
    damage:   { index: 4,  loop: false },
    evade:    { index: 5,  loop: false },
    thrust:   { index: 6,  loop: false },
    swing:    { index: 7,  loop: false },
    missile:  { index: 8,  loop: false },
    skill:    { index: 9,  loop: false },
    spell:    { index: 10, loop: false },
    item:     { index: 11, loop: false },
    escape:   { index: 12, loop: true  },
    victory:  { index: 13, loop: true  },
    dying:    { index: 14, loop: true  },
    abnormal: { index: 15, loop: true  },
    sleep:    { index: 16, loop: true  },
    dead:     { index: 17, loop: true  }
};

//具体设置 举例:
Sprite_Actor.MOTIONSLIST = {
	Actor :{
		walk:     { index: 0,  loop: true  ,  speed: 52 },
		wait:     { index: 1,  loop: true ,  speed: 52 },
		chant:    { index: 2,  loop: true  ,  speed: 52},
		guard:    { index: 3,  loop: true  ,  speed: 52},
		damage:   { index: 4,  loop: false ,  speed: 52},
		evade:    { index: 5,  loop: false ,  speed: 52},
		thrust:   { index: 6,  loop: false,  speed: 52 },
		swing:    { index: 7,  loop: false ,  speed: 52},
		missile:  { index: 8,  loop: false ,  speed: 52},
		skill:    { index: 9,  loop: false,  speed: 52 },
		spell:    { index: 1, loop: false,  speed: 52 },
		item:     { index: 1, loop: false,  speed: 52 },
		escape:   { index: 1, loop: true  , reloop : true,   speed: 52},
		victory:  { index: 1, loop: true  , reloop : true ,  loopcont: 3 , speed: 52},
		dying:    { index: 1, loop: false , next:"item",  speed: 52 },
		abnormal: { index: 1, loop: true , loopcont: 3 , next:"missile", speed: 52 },
		sleep:    { index: 1, loop: true  ,  speed: 52},
		dead:     { index: 1, loop: true ,  speed: 52 }
	},	//注意逗号
	Bctor :{
		walk:     { index: 0,  loop: true  ,  speed: 52 },
		wait:     { index: 1,  loop: true ,  speed: 52 },
		chant:    { index: 2,  loop: true  ,  speed: 52},
		guard:    { index: 3,  loop: true  ,  speed: 52},
		damage:   { index: 4,  loop: false ,  speed: 52},
		evade:    { index: 5,  loop: false ,  speed: 52},
		thrust:   { index: 6,  loop: false,  speed: 52 },
		swing:    { index: 7,  loop: false ,  speed: 52},
		missile:  { index: 8,  loop: false ,  speed: 52},
		skill:    { index: 9,  loop: false,  speed: 52 },
		spell:    { index: 1, loop: false,  speed: 52 },
		item:     { index: 1, loop: false,  speed: 52 },
		escape:   { index: 1, loop: true  , reloop : true,   speed: 52},
		victory:  { index: 1, loop: true  , reloop : true ,  loopcont: 3 , speed: 52},
		dying:    { index: 1, loop: false , next:"item",  speed: 52 },
		abnormal: { index: 1, loop: true , loopcont: 3 , next:"missile", speed: 52 },
		sleep:    { index: 1, loop: true  ,  speed: 52}, 
	}
}; 


/**初始化成员 */
Sprite_Actor.prototype.initMembers = function() {
    Sprite_Battler.prototype.initMembers.call(this);
    this._battlerName = '';
    this._motion = null;
	this._motions = Sprite_Actor.MOTIONS  
	this._bitmaps = null 
	this._bitmapbase = null
	this._bitmapset = null
    this._motionCount = 0; 
	this._loopCont = 0 
    this._pattern = 0;
    this.createShadowSprite();
    this.createWeaponSprite();
    this.createMainSprite();
    this.createStateSprite(); 
}; 
 
  
/**开始动作 */
Sprite_Actor.prototype.startMotion = function(motionType) { 
    //新动作 = 精灵角色 动作组[动作种类]
    var newMotion = this._motions[motionType];
    //如果(动作 !== 新动作)
    if (this._motion !== newMotion) {
        //动作 = 新动作
        this._motion = newMotion;
        //动作计数 = 0
        this._motionCount = 0;
        //图案 = 0
        this._pattern = 0;  

		this._loopCont = 0 

		this.updateMotionBitmap2() 
		
    }
};

  
/**更新位图 */
Sprite_Actor.prototype.updateBitmap = function() {
    //精灵战斗者 更新位图 呼叫(this)
    Sprite_Battler.prototype.updateBitmap.call(this);
    //名称 = 角色 战斗者名称()
    var name = this._actor.battlerName();
    //如果(战斗者名称 !== 名称 )
    if (this._battlerName !== name) {  
		this.updateMotionBitmap(name) 
    }
};


Sprite_Actor.prototype.updateMotionBitmap = function(name) {
	var name = name 
	this._battlerName = name;
	if(Sprite_Actor.MOTIONSLIST[name]){
		this._motions = Sprite_Actor.MOTIONSLIST[name] 
	} else{
		this._motions = Sprite_Actor.MOTIONS 
	} 
	this._bitmapbase = null
	this._bitmaps = {}  
	this._bitmapset = {}

    var n2 = name  
	this._bitmapbase  =  ImageManager.loadSvActor(name)
	var that = this 
    this._bitmapbase.addLoadListener(
		function(){
			that.loadSvActor()
		}
	)
	for(var n in this._motions){
		var motion = this._motions[n]
		var i = motion.index
		if(!this._bitmaps[i]){
			var n2 = name + "_" + i
			this._bitmaps[i] =  ImageManager.loadSvActor(n2)  
			this._bitmaps[i].addLoadListener(
				function(){
					that.loadSvActor()
				}
			) 
		}
	}
	this.updateMotionBitmap2()
};

Sprite_Actor.prototype.updateMotionBitmap2 = function( ) {
   if(this._bitmaps){ 
		var motionIndex = this._motion ? this._motion.index : 0; 
		this._mainSprite.bitmap  = this._bitmaps[motionIndex]
		this.updateFrame()
	}
};

Sprite_Actor.prototype.loadSvActor = function(){
	if(this._bitmapbase &&  this._bitmaps){ 
		if(!this._bitmapbase._isLoading ){
			for(var n in this._bitmaps){
				if( !this._bitmaps[n]._isLoading ){ 
					this.updateBitmapSet(n) 
				} 
			} 
		}
	}
} 


Sprite_Actor.prototype.updateBitmapSet = function(name) {  
    if (this._bitmapset) {   
        if(!this._bitmapset[name] ){  
			var bitmap = this._bitmaps[name] 
			var b = this._bitmapbase 
			var w = b.width 
			var h = b.height 
 			var x =  Math.floor(bitmap.width / w)
			var y =  Math.floor(bitmap.height / h)
			this._bitmapset[name] = {w:w,h:h,x:x,y:y,all:x*y} 
		} 
	}
};

/**更新帧 */
Sprite_Actor.prototype.updateFrame = function() {
    Sprite_Battler.prototype.updateFrame.call(this);
    var bitmap = this._mainSprite.bitmap;
    if (bitmap && this._bitmapset) { 
        var motionIndex = this._motion ? this._motion.index : 0;  
		var set = this._bitmapset[motionIndex]
		if( set){ 
			var all = set.all
			var x = set.x
			var y = set.y
			var w = set.w
			var h = set.h 
			if(this._pattern <  all)  { 
			   var pattern = this._pattern   
			}else{
				var np = all + all - this._pattern - 2 
				if(np > 0 ){
			   		var pattern = np 
				}else{
					var pattern = 0 
				} 
			}  
			var cx = pattern % x
			var cy = (pattern - cx) / x 
			var cw = w;
			var ch = h; 
			this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
		}
    }
};
  


/**更新动作计数 */
Sprite_Actor.prototype.updateMotionCount = function() {
    //如果(动作 并且 ++动作技术 >= 动作速度() )
    if (this._motion && this._bitmapset && this._bitmapset[this._motion.index] && ++this._motionCount >= this.motionSpeed()) { 
		var set = this._bitmapset[this._motion.index]
		var all = set.all
		//如果(动作 循环)
		if (this._motion.loop) {
			this._pattern++ 
			var all = this._motion.reloop ? all + all - 2 : all 
			if(this._pattern  >=  all){ 
				this._pattern = 0
				if( "loopcont"  in  this._motion ){
					if (++this._loopCont >= this._motion.loopcont){
						this.nextMotion()
					}
				}
			}
		} else if (this._pattern < all) {
			this._pattern++;
		//否则
		} else { 
			this.nextMotion()
		}
        //动作计数 = 0
        this._motionCount = 0;
    }
};
/**动作速度 */
Sprite_Actor.prototype.motionSpeed = function() { 
	if(this._motion && this._motion.speed){
		return this._motion.speed
	}
    return 12;
};
 
Sprite_Actor.prototype.nextMotion = function() {  
    if (this._motion) {
		if( this._motion.next ){
			this.startMotion(this._motion.next) 
			return 
		}
	}
	this.refreshMotion();
};


var _Sprite_Actor_prototype_refreshMotion = Sprite_Actor.prototype.refreshMotion;
Sprite_Actor.prototype.refreshMotion = function() {
	_Sprite_Actor_prototype_refreshMotion.call(this);
    var actor = this._actor;
    if (actor) {
        var stateMotion = actor.stateMotionIndex();
        if (stateMotion > 17) {
			this.startMotion('motionSP'+(stateMotion-18).toString(10));
		}
	}
};



Game_Action.prototype.note = function() {
	obj = this.item();
	return obj.note;
};

Game_Battler.prototype.makeSPName = function(action) {
	var name = 'skill';
	var note = action.note(action);
	var xx = note.match(/<motionSP(\w+)>/);
	if(xx){
		name = 'motionSP' + RegExp.$1;
	}else{
		if(action.isMagicSkill()){
			name = 'spell';
		}else if (action.isSkill()){
			name = 'skill';
		}else if (action.isItem()){
			name = 'item';
		}
	}
	return name;
};

Game_Battler.prototype.stateMotionIndex = function() {
    var states = this.states();
    if (states.length > 0) {
		var note = states[0].note;
		var xx = note.match(/<motionSP(\w+)>/);
		if(xx){
			return parseInt(RegExp.$1,10) + 18;
		}else{
	        return states[0].motion;
		}
    } else {
        return 0;
    }
};

Game_Actor.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);
    if (action.isAttack()) {
        this.performAttack();
    } else if (action.isGuard()) {
        this.requestMotion('guard');
    } else if (action.isMagicSkill()) {
		this.requestMotion(this.makeSPName(action));
    } else if (action.isSkill()) {
		this.requestMotion(this.makeSPName(action));
    } else if (action.isItem()) {
		this.requestMotion(this.makeSPName(action));
    }
};

 
