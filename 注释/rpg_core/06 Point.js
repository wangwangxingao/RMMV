
/**-----------------------------------------------------------------------------  
 *点的类
 * The point class.
 * 点
 * @class Point
 * @constructor
 * @param {number} x The x coordinate
 * @param {number} y The y coordinate
 */
function Point() {
    this.initialize.apply(this, arguments);
}

Point.prototype = Object.create(PIXI.Point.prototype);
Point.prototype.constructor = Point;
/**初始化
 * @param {number} x x坐标
 * @param {number} y y坐标
 * 
 */
Point.prototype.initialize = function(x, y) {
    PIXI.Point.call(this, x, y);
};

/** 点x 
 * The x coordinate.
 *
 * @property x
 * @type Number
 */

/** 点y
 * The y coordinate.
 *
 * @property y
 * @type Number
 */
