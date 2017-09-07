//=============================================================================
// bitmap_add.js
//=============================================================================
/*:
 * @plugindesc bitmap_add
 * @author wangwang
 *
 *
 * @help
 * bitmap增强
 *
 *
 */




 
(function() {



Bitmap.prototype.initialize = function(width, height) {
    this._canvas = document.createElement('canvas');
    this._context = this._canvas.getContext('2d');
    this._canvas.width = Math.max(width || 0, 1);
    this._canvas.height = Math.max(height || 0, 1);
    this._baseTexture = new PIXI.BaseTexture(this._canvas);
    this._baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
    this._image = null;
    this._url = '';
    this._paintOpacity = 255;
    this._smooth = false;
    this._loadListeners = [];
    this._isLoading = false;
    this._hasError = false;

    /**字体
     * The face name of the font.
     *
     * @property fontFace
     * @type String
     */
    this.fontFace = 'GameFont';

    /**字体大小
     * The size of the font in pixels.
     *
     * @property fontSize
     * @type Number
     */
    this.fontSize = 28;
    
    /**黑体
     * Whether the font is bold.
     *
     * @property fontBold
     * @type Boolean
     */
    this.fontBold = false;
    /**斜体
     * Whether the font is italic.
     *
     * @property fontItalic
     * @type Boolean
     */
    this.fontItalic = false;

    /**在CSS格式的文本的颜色。
     * The color of the text in CSS format.
     *
     * @property textColor
     * @type String
     */
    this.textColor = '#ffffff';

    /**在CSS格式的文本轮廓的颜色。
     * The color of the outline of the text in CSS format.
     *
     * @property outlineColor
     * @type String
     */
    this.outlineColor = 'rgba(0, 0, 0, 0.5)';

    /**文字轮廓的宽度。
     * The width of the outline of the text.
     *
     * @property outlineWidth
     * @type Number
     */
    this.outlineWidth = 4;
};




Bitmap.prototype._makeFontNameText = function() {
    return (this.fontBold ? "bold ": '') +( this.fontItalic ? 'Italic ' : '') +
            this.fontSize + 'px ' + this.fontFace;
};










})();


