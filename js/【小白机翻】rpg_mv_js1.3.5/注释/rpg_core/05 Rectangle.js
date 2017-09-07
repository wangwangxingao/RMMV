
//-----------------------------------------------------------------------------
/**长方形的类
 * The rectangle class.
 * 矩形
 * @class Rectangle
 * @constructor
 * @param {Number} x The x coordinate for the upper-left corner x坐标,左上角
 * @param {Number} y The y coordinate for the upper-left corner Y坐标,左上角
 * @param {Number} width The width of the rectangle   矩形的宽度
 * @param {Number} height The height of the rectangle 矩形的高度
 */
function Rectangle() {
    this.initialize.apply(this, arguments);
}

Rectangle.prototype = Object.create(PIXI.Rectangle.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.initialize = function(x, y, width, height) {
    PIXI.Rectangle.call(this, x, y, width, height);
};

/**空矩形
 * @static
 * @property emptyRectangle
 * @type Rectangle
 * @private
 */
Rectangle.emptyRectangle = new Rectangle(0, 0, 0, 0);

/** x
 * The x coordinate for the upper-left corner.
 *
 * @property x
 * @type Number
 */

/** y
 * The y coordinate for the upper-left corner.
 *
 * @property y
 * @type Number
 */

/** 宽
 * The width of the rectangle.
 *
 * @property width
 * @type Number
 */

/** 高
 * The height of the rectangle.
 *
 * @property height
 * @type Number
 */
