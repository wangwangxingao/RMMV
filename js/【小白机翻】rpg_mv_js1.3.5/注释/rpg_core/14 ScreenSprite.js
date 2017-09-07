
//-----------------------------------------------------------------------------
/**覆盖整个游戏画面的精灵
 * The sprite which covers the entire game screen.
 * 画面精灵
 * @class ScreenSprite
 * @constructor
 */
function ScreenSprite() {
    this.initialize.apply(this, arguments);
}
ScreenSprite.prototype = Object.create(PIXI.Container.prototype);
ScreenSprite.prototype.constructor = ScreenSprite;
//初始化
ScreenSprite.prototype.initialize = function() {
    PIXI.Container.call(this);

    this._graphics = new PIXI.Graphics();
    this.addChild(this._graphics);

    this.opacity = 0;

    this._red = -1;
    this._green = -1;
    this._blue = -1;
    this._colorText = '';
    this.setBlack();
};

/**精灵（0〜255）的不透明度
 * The opacity of the sprite (0 to 255).
 * 不透明度
 * @property opacity
 * @type Number
 */
//定义属性 
Object.defineProperty(ScreenSprite.prototype, 'opacity', {
    get: function () {
        return this.alpha * 255;
    },
    set: function (value) {
        this.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

ScreenSprite.YEPWarned = false;
ScreenSprite.warnYep = function () {
    if (!ScreenSprite.YEPWarned) {
        console.log("Deprecation warning. Please update YEP_CoreEngine. ScreenSprite is not a sprite, it has graphics inside.");
        ScreenSprite.YEPWarned = true;
    }
};
/**锚 */
Object.defineProperty(ScreenSprite.prototype, 'anchor', {
    get: function () {
        ScreenSprite.warnYep();
        //比例 x = 1
        this.scale.x = 1;
        //比例 y = 1
        this.scale.y = 1;
        //返回 {x:0,y:0}
        return {x: 0, y: 0};
    },
    set: function (value) {
        //透明度 = 值 在之间(0,255) / 255
        this.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});
/**混合模式 */
Object.defineProperty(ScreenSprite.prototype, 'blendMode', {
    get: function () {
        return this._graphics.blendMode;
    },
    set: function (value) {
        this._graphics.blendMode = value;
    },
    configurable: true
});


/**设置画面精灵的颜色 黑色
 * Sets black to the color of the screen sprite.
 * 设置黑色
 * @method setBlack
 */
ScreenSprite.prototype.setBlack = function() {
    this.setColor(0, 0, 0);
};

/**设置画面精灵的颜色 白色
 * Sets white to the color of the screen sprite.
 * 设置白色
 * @method setWhite
 */
ScreenSprite.prototype.setWhite = function() {
    this.setColor(255, 255, 255);
};

/**设置画面精灵颜色 值
 * Sets the color of the screen sprite by values.
 * 设置颜色
 * @method setColor
 * @param {Number} r The red value in the range (0, 255)
 * @param {Number} g The green value in the range (0, 255)
 * @param {Number} b The blue value in the range (0, 255)
 */
ScreenSprite.prototype.setColor = function(r, g, b) {
    if (this._red !== r || this._green !== g || this._blue !== b) {
        r = Math.round(r || 0).clamp(0, 255);
        g = Math.round(g || 0).clamp(0, 255);
        b = Math.round(b || 0).clamp(0, 255);
        this._red = r;
        this._green = g;
        this._blue = b;
        this._colorText = Utils.rgbToCssColor(r, g, b);

        var graphics = this._graphics;
        graphics.clear();
        var intColor = (r << 16) | (g << 8) | b;
        graphics.beginFill(intColor, 1);
        //whole screen with zoom. BWAHAHAHAHA
        graphics.drawRect(-Graphics.width * 5, -Graphics.height * 5, Graphics.width * 10, Graphics.height * 10);
    }
};


 