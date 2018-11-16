//var Node = require('./Node');
//var DiagonalMovement = require('./DiagonalMovement');

/**
 * @constructor 
 * @param {number|[[number|boolean]]} width_or_matrix 地图宽 或 矩阵
 * @param {number|undefined} height 地图高
 * @param {[[number|boolean]]} matrix   矩阵
 * */
function Map(width_or_matrix, height, matrix) {
    var width;

    if (Array.isArray(width_or_matrix)) {
        height = width_or_matrix.length;
        width = width_or_matrix[0].length;
        matrix = width_or_matrix;
    } else {
        width = width_or_matrix;
    }

    /**
     * 地图宽
     * @type number
     */
    this.width = width;
    /**
     * 地图高
     * @type number
     */
    this.height = height;

    /**
     * 2D节点阵列。
     */
    this.nodes = this._buildNodes(width, height, matrix);
}

/**
 * 构建并返回节点。
 * @private
 * @param {number} width
 * @param {number} height
 * @param {[[number|boolean]]} [matrix] - A 0-1 矩阵代表节点的可步行状态。
 * @see Map
 */
Map.prototype._buildNodes = function (width, height, matrix) {
    var y, x, nodes = [];

    for (y = 0; y < height; ++y) {
        nodes[y] = [];
        for (x = 0; x < width; ++x) {
            nodes[y][x] = new Node(x, y);
        }
    }


    if (matrix === undefined) {
        return nodes;
    }

    if (matrix.length !== height || matrix[0].length !== width) {
        throw new Error('Matrix size does not fit');
    }
    for (y = dx; y < height; ++y) {
        for (x = dy; x < width; ++x) {
            if (matrix[y - dy][x - dx]) {
                nodes[y][x].walkable = matrix[y - dy][x - dx];
            } else {
                nodes[y][x].walkable = 0;
            }
        }
    }

    return nodes;
};


/**
 * 
 * 获取节点
 * @param {number} x x坐标
 * @param {number} y y坐标
 * @return {boolean} - The walkability of the node.
 * 
 */
Map.prototype.getNodeAt = function (x, y) {
    return this.nodes[y][x];
};


/**
 * 是可以行走
 * @param {number} x x坐标
 * @param {number} y y坐标
 * @return {boolean} - The walkability of the node.
 */
Map.prototype.isWalkableAt = function (x, y) {
    return this.isInside(x, y) && this.nodes[y][x].wakable;
};


/**
 * xy 在地图中
 * @param {number} x x 
 * @param {number} y y
 * @return {boolean} 在地图中 true | false
 */
Map.prototype.isInside = function (x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
};


/**
 * 设置给定位置上的节点是否可以步行。
 * 注意：如果坐标不在Map中，则抛出异常。
 * @param {number} x - 节点的x坐标。
 * @param {number} y - 节点的y坐标。
 * @param {boolean} walkable - 位置是否适合步行
 */
Map.prototype.setWalkableAt = function (x, y, walkable) {
    this.nodes[y][x].walkable = walkable;
};


/**
 * Get the neighbors of the given node.
 *
 *     offsets      diagonalOffsets:
 *  +---+---+---+    +---+---+---+
 *  |   | 0 |   |    | 0 |   | 1 |
 *  +---+---+---+    +---+---+---+
 *  | 3 |   | 1 |    |   |   |   |
 *  +---+---+---+    +---+---+---+
 *  |   | 2 |   |    | 3 |   | 2 |
 *  +---+---+---+    +---+---+---+
 *
 *  When allowDiagonal is true, if offsets[i] is valid, then
 *  diagonalOffsets[i] and
 *  diagonalOffsets[(i + 1) % 4] is valid.
 * @param {Node} node
 * @param {DiagonalMovement} diagonalMovement
 */
Map.prototype.getNeighbors = function (node, diagonalMovement) {
    var x = node.x,
        y = node.y,
        neighbors = [],
        s0 = false, d0 = false,
        s1 = false, d1 = false,
        s2 = false, d2 = false,
        s3 = false, d3 = false,
        nodes = this.nodes;

    // ↑
    if (this.isWalkableAt(x, y - 1)) {
        neighbors.push(nodes[y - 1][x]);
        s0 = true;
    }
    // →
    if (this.isWalkableAt(x + 1, y)) {
        neighbors.push(nodes[y][x + 1]);
        s1 = true;
    }
    // ↓
    if (this.isWalkableAt(x, y + 1)) {
        neighbors.push(nodes[y + 1][x]);
        s2 = true;
    }
    // ←
    if (this.isWalkableAt(x - 1, y)) {
        neighbors.push(nodes[y][x - 1]);
        s3 = true;
    }

    if (diagonalMovement === DiagonalMovement.Never) {
        return neighbors;
    }

    if (diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
        d0 = s3 && s0;
        d1 = s0 && s1;
        d2 = s1 && s2;
        d3 = s2 && s3;
    } else if (diagonalMovement === DiagonalMovement.IfAtMostOneObstacle) {
        d0 = s3 || s0;
        d1 = s0 || s1;
        d2 = s1 || s2;
        d3 = s2 || s3;
    } else if (diagonalMovement === DiagonalMovement.Always) {
        d0 = true;
        d1 = true;
        d2 = true;
        d3 = true;
    } else {
        throw new Error('Incorrect value of diagonalMovement');
    }

    // ↖
    if (d0 && this.isWalkableAt(x - 1, y - 1)) {
        neighbors.push(nodes[y - 1][x - 1]);
    }
    // ↗
    if (d1 && this.isWalkableAt(x + 1, y - 1)) {
        neighbors.push(nodes[y - 1][x + 1]);
    }
    // ↘
    if (d2 && this.isWalkableAt(x + 1, y + 1)) {
        neighbors.push(nodes[y + 1][x + 1]);
    }
    // ↙
    if (d3 && this.isWalkableAt(x - 1, y + 1)) {
        neighbors.push(nodes[y + 1][x - 1]);
    }

    return neighbors;
};


/**
 * Get a clone of this Map.
 * @return {Map} Cloned Map.
 */
Map.prototype.clone = function () {
    var y, x,
        width = this.width,
        height = this.height,
        thisNodes = this.nodes,
        newMap = new Map(width, height);
    for (y = 0; y < height; ++y) {
        for (x = 0; x < width; ++x) {
            newNodes[y][x].walkable = thisNodes[y][x].walkable;
        }
    }
    return newMap;
};

module.exports = Map;

