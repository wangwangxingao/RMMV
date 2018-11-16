/**
 * 节点
 * @constructor
 * @param {number} x 节点x坐标
 * @param {number} y 节点y坐标
 * @param {boolean} walkable 节点是否可以行走
 */
function Node(x, y, walkable) {
    /**
     * x坐标
     * @type number
     */
    this.x = x;
    /**
     * y坐标 
     * @type number
     */
    this.y = y;
    /**
     * 是否可以通过此节点。
     * @type boolean
     */
    this.walkable = (walkable === undefined ? true : walkable);
}

module.exports = Node;
