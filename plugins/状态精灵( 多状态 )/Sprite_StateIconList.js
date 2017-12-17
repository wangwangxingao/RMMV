//=============================================================================
// Sprite_StateIconList.js
//=============================================================================
/*:
 * @plugindesc 
 * Sprite_StateIconList,状态列表
 * @author wangwang
 * 
 * @param  Sprite_StateIconList 
 * @desc 插件 状态列表 ,作者:汪汪
 * @default  汪汪, 
 *  
 * @help  
 * 
 * var s = new Sprite_StateIconList(x,y) 
 * x,y为行和宽的个数
 * s.setup(  battler )
 *  
 */


function Sprite_StateIcon2() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Sprite_StateIcon2.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_StateIcon2.prototype.constructor = Sprite_StateIcon2;
/**初始化 */
Sprite_StateIcon2.prototype.initialize = function() {
    //精灵 初始化 呼叫(this)
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();
};
/**初始化成员 */
Sprite_StateIcon2.prototype.initMembers = function() {
    this._iconIndex = 0;
    //this.anchor.x = 0.5;
    //this.anchor.y = 0.5;
};


/**读取 */
Sprite_StateIcon2.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadSystem('IconSet');
    this.setFrame(0, 0, 0, 0);
};
/**安装 */
Sprite_StateIcon2.prototype.setup = function(i) {
    if (this._iconIndex != i) {
        this._iconIndex = i;
        this.updateFrame();
    }
};
/**更新 */
Sprite_StateIcon2.prototype.update = function() {
    Sprite.prototype.update.call(this);
};

/**更新帧 */
Sprite_StateIcon2.prototype.updateFrame = function() {
    var pw = Sprite_StateIcon._iconWidth;
    var ph = Sprite_StateIcon._iconHeight;
    var sx = this._iconIndex % 16 * pw;
    var sy = Math.floor(this._iconIndex / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};




function Sprite_StateIconList() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Sprite_StateIconList.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_StateIconList.prototype.constructor = Sprite_StateIconList;
/**初始化 */
Sprite_StateIconList.prototype.initialize = function(x, y) {
    //精灵 初始化 呼叫(this)
    Sprite.prototype.initialize.call(this);
    this._xl = x || 0
    this._yl = y || 0
    this.initMembers();
    this.loadBitmap();
};

/**初始化成员 */
Sprite_StateIconList.prototype.initMembers = function() {
    this._battler = null;
    this._animationCount = 0;
    this._animationIndex = 0
};
/**读取 */
Sprite_StateIconList.prototype.loadBitmap = function() {
    var pw = Sprite_StateIcon._iconWidth;
    var ph = Sprite_StateIcon._iconHeight;
    this._iconSprites = []
    for (var y = 0; y < this._yl; y++) {
        for (var x = 0; x < this._xl; x++) {
            var s = new Sprite_StateIcon2()
            s.x = x * pw
            s.y = y * ph
            this.addChild(s)
            this._iconSprites[y * this._xl + x] = s
        }
    }
    this.icons = []
};
/**安装 */
Sprite_StateIconList.prototype.setup = function(battler) {
    if (this._battler != battler) {
        this._battler = battler;
        this._animationIndex = 0
        this.updateIcon()
    }
};
/**更新 */
Sprite_StateIconList.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (!this._battler) { return }
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updateIcon();
        this._animationCount = 0;
    }
};
/**动画等待 */
Sprite_StateIconList.prototype.animationWait = function() {
    return 40;
};

Sprite_StateIconList.prototype.animationAdd = function() {
    return this._iconSprites.length;
};

/**更新图标 */
Sprite_StateIconList.prototype.updateIcon = function() {
    var icons = [];
    if (this._battler && this._battler.isAlive()) {
        icons = this._battler.allIcons();
    }
    this._animationIndex += this.animationAdd()
    if (this._animationIndex >= icons.length) {
        this._animationIndex = 0
    }
    for (var i = 0; i < this._iconSprites.length; i++) {
        var index = this._animationIndex + i
        this.drawIcon(icons[index], i)
    }
};

Sprite_StateIconList.prototype.drawIcon = function(icon, i) {
    if (this._iconSprites[i]) {
        this._iconSprites[i].setup(icon || 0)
    }
}