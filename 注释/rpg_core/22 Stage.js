/**----------------------------------------------------------------------------- */
/**显示树图的根本对象
 * The root object of the display tree.
 * 舞台
 * @class Stage
 * @constructor
 */

function Stage() {
    this.initialize.apply(this, arguments);
}

Stage.prototype = Object.create(PIXI.Container.prototype);
Stage.prototype.constructor = Stage;
/**初始化 */
Stage.prototype.initialize = function() {
    //pixi 舞台 呼叫(this)
    PIXI.Container.call(this);

    // The interactive flag causes a memory leak.
    //交互式标志会导致内存泄漏。
    //交互 = false
    this.interactive = false;
};

/**[只读]场景子项的数组
 * [read-only] The array of children of the stage.
 *
 * @property children
 * @type Array
 */

/**容器增加子项
 * Adds a child to the container.
 *
 * @method addChild
 * @param {{}} child The child to add
 * @return {{}} The child that was added
 */

/**添加一个子项到容器中指定索引处
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {{}} child The child to add
 * @param {number} index The index to place the child in
 * @return {{}} The child that was added
 */

/**从容器中删除一个子项
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {{}} child The child to remove
 * @return {{}} The child that was removed
 */

/**从指定索引位置的删除一个子项
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {number} index The index to get the child from
 * @return {{}} The child that was removed
 */