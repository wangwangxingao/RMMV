//=============================================================================
// ww_Animation2target.js
//=============================================================================
/*:
 * @plugindesc 动画到目标
 * @author wangwang
 *
 * @help
 * 设置 ww_Animation2target.animations (使用功能的动画)
 * 例如
 * ww_Animation2target.animations = [120]
 * ww_Animation2target.animations_sz(对动画的的详细设置)
 * 例如
 * 对于 120 号动画 的详细设置
 * ww_Animation2target.animations_sz[120] = [[0,10,0,100],[20,0,0,0]]
 * 0帧 开始 10帧 从 0(播放动画的sprite) 移动到 100(目标)
 * 20帧 开始 0帧 回到 0 (播放动画的sprite) 
 * 
 */

(function() {

ww_Animation2target = {}

//示例
ww_Animation2target.animations = [120]

ww_Animation2target.animations_sz = []

//对于 120 号动画 的详细设置
//0帧 开始 10帧 从 0(播放动画的sprite) 移动到 100(目标)
//20帧 开始 0帧 从 0 到 0 (播放动画的sprite) 
ww_Animation2target.animations_sz[120] = [[0,10,0,100],[20,0,0,0]]



Sprite_Base.prototype.startAnimation = function(animation, mirror, delay,target2) {
    var sprite = new Sprite_Animation();
    sprite.setup(this._effectTarget, animation, mirror, delay , target2);
    this.parent.addChild(sprite);
    this._animationSprites.push(sprite);
};


//安装动画
Sprite_Battler.prototype.setupAnimation = function() {
    while (this._battler.isAnimationRequested()) {
        var data = this._battler.shiftAnimation();
        var animation = $dataAnimations[data.animationId];
        var mirror = data.mirror;
        var delay = animation.position === 3 ? 0 : data.delay;


        var target = null
        var target2 = data.target2 ;
        var children = this.parent.children
        for (var i = 0 ;i< children.length;i++){
	        child= children[i]
	        if(child){
				if(( child._character && child._character == target2 ) ||
				  (child._battler && child._battler == target2)){
					var target = child
					break 
				}
		    } 
        }
        this.startAnimation(animation, mirror, delay,target);
        for (var i = 0; i < this._animationSprites.length; i++) {
            var sprite = this._animationSprites[i];
            sprite.visible = this._battler.isSpriteVisible();
        }
    }
};



//初始化成员
Sprite_Animation.prototype.initMembers = function() {
    this._target = null;
    
    this._target2 = null
    
    this._animation = null;
    this._mirror = false;
    this._delay = 0;
    this._rate = 4;
    this._duration = 0;
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
    this._screenFlashDuration = 0;
    this._hidingDuration = 0;
    this._bitmap1 = null;
    this._bitmap2 = null;
    this._cellSprites = [];
    this._screenFlashSprite = null;
    this._duplicated = false;
    this.z = 8;
};
//设置
Sprite_Animation.prototype.setup = function(target, animation, mirror, delay, target2) {
    this._target = target;
    this._animation = animation;
    this._mirror = mirror;
    this._delay = delay;
    
    this._target2 = target2
    
    if (this._animation) {
        this.remove();
        this.setupRate();
        this.setupDuration();
        this.loadBitmaps();
        this.createSprites();

    }
};

//更新位置
Sprite_Animation.prototype.updatePosition = function() {

	//如果 动画 位置 == 3
    if (this._animation.position === 3) {
	    //x = this父类 宽 / 2 
        this.x = this.parent.width / 2;
        //y = this父类 高 / 2
        this.y = this.parent.height / 2;
    } else {
	    //父类 = 目标的 父类
        var parent = this._target.parent;
        //祖父类 = 如果 父类  则返回 父类 的 父类 否则返回 null
        var grandparent = parent ? parent.parent : null;
        //x = 目标 x 
        var x = this._target.x;
        //y = 目标 y
        var y = this._target.y;
        //如果 this 父类 == 祖父类
        if (this.parent === grandparent) {
	        //x += 父类(目标的 父类) x 
            x += parent.x;
            //y += 父类(目标的 父类) y
            y += parent.y;
        }
        //如果 动画 位置 == 0
        if (this._animation.position === 0) {
	        //y -= 目标 高
            y -= this._target.height;
        //否则 如果 动画位置 == 1
        } else if (this._animation.position === 1) {
	        //y -= 目标 高 / 2
            y -= this._target.height / 2;
        }
	    if (this._target2){
			//父类 = 目标的 父类
	        var parent2 = this._target2.parent;
	        //祖父类 = 如果 父类  则返回 父类 的 父类 否则返回 null
	        var grandparent2 = parent2 ? parent2.parent : null;
	        //x = 目标 x 
	        var x2 = this._target2.x;
	        //y = 目标 y
	        var y2 = this._target2.y;
	        //如果 this 父类 == 祖父类
	        if (this.parent === grandparent2) {
		        //x += 父类(目标的 父类) x 
	            x2 += parent2.x;
	            //y += 父类(目标的 父类) y
	            y2 += parent2.y;
	        }
	        //如果 动画 位置 == 0
	        if (this._animation.position === 0) {
		        //y -= 目标 高
	            y2 -= this._target2.height;
	        //否则 如果 动画位置 == 1
	        } else if (this._animation.position === 1) {
		        //y -= 目标 高 / 2
	            y2 -= this._target2.height / 2;
	        }
	        var id = this._animation.id
	        var sz = ww_Animation2target.animations_sz[id] || [1,this._animation.frames.length,0,100]
	        var frameIndex = this.currentFrameIndex();
	        var x_d = (x2 - x) / 100
	        var y_d = (y2 - y) / 100
	        var isz
	        for(var i = 0 ; i<sz.length;i++){
		        if(sz[i] && frameIndex >= sz[i][0] ){
			         isz = sz[i]
		        }
		   	}
		   	var l = 0
			if (isz){
				var d = this._animation.frames.length * this._rate - this._duration 
				var f = d / this._rate 
				var d2= f - isz[0]
				if(d2<=0){
					var d3 = 0 
				}else if((d2>=isz[1]-1) || isz[1] <=1 ){
					var d3 = 1 
				}else {
					var d3 =  d2 / (isz[1]-1) 
				}
				var l = isz[2] + d3 * (isz[3] - isz[2] )
			}
	        x += x_d * l
	        y += y_d * l
	    }
	    this.x = x
	    this.y = y
    }
};

//显示动画
Window_BattleLog.prototype.showAnimation = function(subject, targets, animationId) {
    if (animationId < 0) {
        this.showAttackAnimation(subject, targets);
    } else {
        this.showNormalAnimation(targets, animationId,false,subject);
    }
};

//显示角色攻击动画
Window_BattleLog.prototype.showActorAttackAnimation = function(subject, targets) {
    this.showNormalAnimation(targets, subject.attackAnimationId1(), false,subject);
    this.showNormalAnimation(targets, subject.attackAnimationId2(), true,subject);
};

//显示正常动画
Window_BattleLog.prototype.showNormalAnimation = function(targets, animationId, mirror,subject) {
    var animation = $dataAnimations[animationId];
    if (animation) {
        var delay = this.animationBaseDelay();
        var nextDelay = this.animationNextDelay();
       	var as = ww_Animation2target.animations || []
        if(as && as.contains(animationId)){
	       	targets.forEach(function(target) {
	           	subject.startAnimation(animationId, mirror, delay,target);
	            delay += nextDelay;
	        });
        }else{ 
	        targets.forEach(function(target) {
	            target.startAnimation(animationId, mirror, delay);
	            delay += nextDelay;
	        });

        }
    }
};


Game_Battler.prototype.startAnimation = function(animationId, mirror, delay,target2) {
	/*数据 = {
		动画id = animationId
		镜反 = mirror
		延迟 = delay
	}*/
    var data = { animationId: animationId, mirror: mirror, delay: delay ,target2:target2};
    //动画组 添加 (数据)
    this._animations.push(data);
};
//开始动画
Game_Actor.prototype.startAnimation = function(animationId, mirror, delay,target2) {
    mirror = !mirror;
    Game_Battler.prototype.startAnimation.call(this, animationId, mirror, delay,target2);
};








})();
