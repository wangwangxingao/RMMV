
//-----------------------------------------------------------------------------
/**天气效果显示雨，暴雨或雪
 * The weather effect which displays rain, storm, or snow.
 * 天气
 * @class Weather
 * @constructor
 */
function Weather() {
    this.initialize.apply(this, arguments);
}

Weather.prototype = Object.create(PIXI.Container.prototype);
Weather.prototype.constructor = Weather;
//初始化
Weather.prototype.initialize = function() {
    PIXI.Container.call(this);

    this._width = Graphics.width;
    this._height = Graphics.height;
    this._sprites = [];

    this._createBitmaps();
    this._createDimmer();

    /**天气类型在['无'，'雨'，'风暴'，'雪']
     * The type of the weather in ['none', 'rain', 'storm', 'snow'].
     *
     * @property type
     * @type String
     */
    this.type = 'none';

    /**天气强度（0,9）
     * The power of the weather in the range (0, 9).
     *
     * @property power
     * @type Number
     */
    this.power = 0;

    /**天气滚动的原点
     * The origin point of the weather for scrolling.
     *
     * @property origin
     * @type Point
     */
    this.origin = new Point();
};

/**更新每一帧
 * Updates the weather for each frame.
 *
 * @method update
 */
Weather.prototype.update = function() {
    this._updateDimmer();
    this._updateAllSprites();
};

/**创建位图
 * @method _createBitmaps
 * @private
 */
Weather.prototype._createBitmaps = function() {
    this._rainBitmap = new Bitmap(1, 60);
    this._rainBitmap.fillAll('white');
    this._stormBitmap = new Bitmap(2, 100);
    this._stormBitmap.fillAll('white');
    this._snowBitmap = new Bitmap(9, 9);
    this._snowBitmap.drawCircle(4, 4, 4, 'white');
};

/**创建调光器
 * @method _createDimmer
 * @private
 */
Weather.prototype._createDimmer = function() {
    this._dimmerSprite = new ScreenSprite();
    this._dimmerSprite.setColor(80, 80, 80);
    this.addChild(this._dimmerSprite);
};

/**更新调光器
 * @method _updateDimmer
 * @private
 */
Weather.prototype._updateDimmer = function() {
    this._dimmerSprite.opacity = Math.floor(this.power * 6);
};

/**更新所有精灵
 * @method _updateAllSprites
 * @private
 */
Weather.prototype._updateAllSprites = function() {
    var maxSprites = Math.floor(this.power * 10);
    while (this._sprites.length < maxSprites) {
        this._addSprite();
    }
    while (this._sprites.length > maxSprites) {
        this._removeSprite();
    }
    this._sprites.forEach(function(sprite) {
        this._updateSprite(sprite);
        sprite.x = sprite.ax - this.origin.x;
        sprite.y = sprite.ay - this.origin.y;
    }, this);
};

/**添加精灵
 * @method _addSprite
 * @private
 */
Weather.prototype._addSprite = function() {
    var sprite = new Sprite(this.viewport);
    sprite.opacity = 0;
    this._sprites.push(sprite);
    this.addChild(sprite);
};

/**移除精灵
 * @method _removeSprite
 * @private
 */
Weather.prototype._removeSprite = function() {
    this.removeChild(this._sprites.pop());
};

/**更新精灵
 * @method _updateSprite
 * @param {Sprite} sprite
 * @private
 */
Weather.prototype._updateSprite = function(sprite) {
    switch (this.type) {
    case 'rain':
        this._updateRainSprite(sprite);
        break;
    case 'storm':
        this._updateStormSprite(sprite);
        break;
    case 'snow':
        this._updateSnowSprite(sprite);
        break;
    }
    if (sprite.opacity < 40) {
        this._rebornSprite(sprite);
    }
};

/**更新雨精灵
 * @method _updateRainSprite
 * @param {Sprite} sprite
 * @private
 */
Weather.prototype._updateRainSprite = function(sprite) {
    sprite.bitmap = this._rainBitmap;
    sprite.rotation = Math.PI / 16;
    sprite.ax -= 6 * Math.sin(sprite.rotation);
    sprite.ay += 6 * Math.cos(sprite.rotation);
    sprite.opacity -= 6;
};

/**更新风暴精灵
 * @method _updateStormSprite
 * @param {Sprite} sprite
 * @private
 */
Weather.prototype._updateStormSprite = function(sprite) {
    sprite.bitmap = this._stormBitmap;
    sprite.rotation = Math.PI / 8;
    sprite.ax -= 8 * Math.sin(sprite.rotation);
    sprite.ay += 8 * Math.cos(sprite.rotation);
    sprite.opacity -= 8;
};

/**更新雪精灵
 * @method _updateSnowSprite
 * @param {Sprite} sprite
 * @private
 */
Weather.prototype._updateSnowSprite = function(sprite) {
    sprite.bitmap = this._snowBitmap;
    sprite.rotation = Math.PI / 16;
    sprite.ax -= 3 * Math.sin(sprite.rotation);
    sprite.ay += 3 * Math.cos(sprite.rotation);
    sprite.opacity -= 3;
};

/**再生精灵
 * @method _rebornSprite
 * @param {Sprite} sprite
 * @private
 */
Weather.prototype._rebornSprite = function(sprite) {
    sprite.ax = Math.randomInt(Graphics.width + 100) - 100 + this.origin.x;
    sprite.ay = Math.randomInt(Graphics.height + 200) - 200 + this.origin.y;
    sprite.opacity = 160 + Math.randomInt(60);
};