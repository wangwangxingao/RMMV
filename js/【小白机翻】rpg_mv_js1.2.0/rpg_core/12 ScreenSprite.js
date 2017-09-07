
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

ScreenSprite.prototype = Object.create(PIXI.Sprite.prototype);
ScreenSprite.prototype.constructor = ScreenSprite;
//初始化
ScreenSprite.prototype.initialize = function() {
    var texture = new PIXI.Texture(new PIXI.BaseTexture());

    PIXI.Sprite.call(this, texture);

    this._bitmap = new Bitmap(1, 1);
    this.texture.baseTexture = this._bitmap.baseTexture;
    this.texture.setFrame(new Rectangle(0, 0, 1, 1));
    this.scale.x = Graphics.width;
    this.scale.y = Graphics.height;
    this.opacity = 0;

    this._red = -1;
    this._green = -1;
    this._blue = -1;
    this._colorText = '';
    this.setBlack();
};

/**精灵（0〜255）的不透明度
 * The opacity of the sprite (0 to 255).
 *
 * @property opacity
 * @type Number
 */
//定义属性 
Object.defineProperty(ScreenSprite.prototype, 'opacity', {
    get: function() {
        return this.alpha * 255;
    },
    set: function(value) {
        this.alpha = value.clamp(0, 255) / 255;
    },
    configurable: true
});

/**设置画面精灵的颜色 黑色
 * Sets black to the color of the screen sprite.
 *
 * @method setBlack
 */
ScreenSprite.prototype.setBlack = function() {
    this.setColor(0, 0, 0);
};

/**设置画面精灵的颜色 白色
 * Sets white to the color of the screen sprite.
 *
 * @method setWhite
 */
ScreenSprite.prototype.setWhite = function() {
    this.setColor(255, 255, 255);
};

/**设置画面精灵颜色 值
 * Sets the color of the screen sprite by values.
 *
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
        this._bitmap.fillAll(this._colorText);
    }
};

/**给予画布
 * @method _renderCanvas
 * @param {Object} renderSession
 * @private
 */
ScreenSprite.prototype._renderCanvas = function(renderSession) {
    if (this.visible && this.alpha > 0) {
        var context = renderSession.context;
        var t = this.worldTransform;
        var r = renderSession.resolution;
        context.setTransform(t.a, t.b, t.c, t.d, t.tx * r, t.ty * r);
        context.globalCompositeOperation = PIXI.blendModesCanvas[this.blendMode];
        context.globalAlpha = this.alpha;
        context.fillStyle = this._colorText;
        context.fillRect(0, 0, Graphics.width, Graphics.height);
    }
};