/**
 * 根据父记录回溯并返回路径。
  *（包括开始和结束节点）
 * @param {Node} node 结束节点
 * @return {[[number,number]]} 路径
 */
function backtrace(node) {
    var path = [[node.x, node.y]];
    while (node.parent) {
        node = node.parent;
        path.push([node.x, node.y]);
    }
    return path.reverse();
}
exports.backtrace = backtrace;

/**
 * 从开始和结束节点回溯，并返回路径。
 * （包括开始和结束节点）
 * @param {Node} nodeA 节点A
 * @param {Node} nodeB 节点B
 */
function biBacktrace(nodeA, nodeB) {
    var pathA = backtrace(nodeA),
        pathB = backtrace(nodeB);
    return pathA.concat(pathB.reverse());
}
exports.biBacktrace = biBacktrace;

/**
 *计算路径的长度。
 * @param {[[number,number]]} path 路径
 * @return {number} 长度
 */
function pathLength(path) {
    var i, sum = 0, a, b, dx, dy;
    for (i = 1; i < path.length; ++i) {
        a = path[i - 1];
        b = path[i];
        dx = a[0] - b[0];
        dy = a[1] - b[1];
        sum += Math.sqrt(dx * dx + dy * dy);
    }
    return sum;
}
exports.pathLength = pathLength;


/**
 * 给定起点和终点坐标，返回所有坐标
 * 基于Bresenham的算法，在这些坐标形成的线上。
 * http://en.wikipedia.org/wiki/Bresenham's_line_algorithm#Simplification
 *
 * @param {number} x0 起始x坐标
 * @param {number} y0 起始y坐标
 * @param {number} x1 结束x坐标
 * @param {number} y1 结束y坐标
 * @return {[[number,number]]}  在线上协调
 */


function interpolate(x0, y0, x1, y1) {
    var abs = Math.abs,
        line = [],
        sx, sy, dx, dy, err, e2;

    dx = abs(x1 - x0);
    dy = abs(y1 - y0);

    sx = (x0 < x1) ? 1 : -1;
    sy = (y0 < y1) ? 1 : -1;

    //初始化e以补偿非零截距
    err = dx - dy;

    while (true) {
        line.push([x0, y0]);

        if (x0 === x1 && y0 === y1) {
            break;
        }

        e2 = err + err;
        //如果 
        if (e2 > -dy) {
            err = err - dy;
            x0 = x0 + sx;
        }
        if (e2 < dx) {
            err = err + dx;
            y0 = y0 + sy;
        }
    }

    return line;
}
exports.interpolate = interpolate;


/**
 * 给定压缩路径，返回包含所有段的新路径
 * 在其内插。
 * @param {[[number,number]]} path 路径
 * @return {[[number,number]]} 扩展的路径
 */
function expandPath(path) {
    var expanded = [],
        len = path.length,
        coord0, coord1,
        interpolated,
        interpolatedLen,
        i, j;

    if (len < 2) {
        return expanded;
    }

    for (i = 0; i < len - 1; ++i) {
        coord0 = path[i];
        coord1 = path[i + 1];

        interpolated = interpolate(coord0[0], coord0[1], coord1[0], coord1[1]);
        interpolatedLen = interpolated.length - 1;
        for (j = 0; j < interpolatedLen; ++j) {
            expanded.push(interpolated[j]);
        }
    }
    expanded.push(path[len - 1]);

    return expanded;
}
exports.expandPath = expandPath;


/**
 * 平滑路径
 * 原始路径不会被修改; 将返回一条新路径。
 * @param {Map} map
 * @param {[[number,number]]} path 路径
 */
function smoothenPath(map, path) {
    if (!path.length) { return [] }
    var len = path.length,
        x0 = path[0][0],        // 路径开始x
        y0 = path[0][1],        // 路径开始y
        x1 = path[len - 1][0],  // 路径结束x
        y1 = path[len - 1][1],  // 路径结束y
        sx, sy,                 // 当前开始坐标
        ex, ey,                 // 当前结束坐标
        newPath,
        i, j, coord, line, testCoord, blocked;

    sx = x0;
    sy = y0;
    newPath = [[sx, sy]];

    for (i = 2; i < len; ++i) {
        coord = path[i];
        ex = coord[0];
        ey = coord[1];
        line = interpolate(sx, sy, ex, ey);

        blocked = false;
        for (j = 1; j < line.length; ++j) {
            testCoord = line[j];

            if (!map.isWalkableAt(testCoord[0], testCoord[1])) {
                blocked = true;
                break;
            }
        }
        if (blocked) {
            lastValidCoord = path[i - 1];
            newPath.push(lastValidCoord);
            sx = lastValidCoord[0];
            sy = lastValidCoord[1];
        }
    }
    newPath.push([x1, y1]);

    return newPath;
}
exports.smoothenPath = smoothenPath;


/**压缩路径，删除冗余节点而不改变形状
 * 原始路径未修改
 * @param {[[number,number]]} path 路径
 * @return {[[number,number]]} 压缩后的路径
 */
function compressPath(path) {

    //不需要压缩 
    if (path.length < 3) {
        return path;
    }

    var compressed = [],
        sx = path[0][0], // 开始x
        sy = path[0][1], // 开始y
        px = path[1][0], // 第二点x
        py = path[1][1], // 第二点y
        dx = px - sx, // 两点之间的方向
        dy = py - sy, // 两点之间的方向
        lx, ly,
        ldx, ldy,
        sq, i;

    // 规范化方向 
    xd = dx > 0 ? 1 : dx < 0?-1: 0
    yd = dy > 0 ? 1 : dy < 0?-1: 0

    // 开始新的道路
    compressed.push([sx, sy]);

    for (i = 2; i < path.length; i++) {

        // 存储最后一点
        lx = px;
        ly = py;
        // 最后的方向
        ldx = dx
        ldy = dy
        lxd = xd
        lyd = yd 
        // 下一点
        px = path[i][0];
        py = path[i][1]; 
        // 下一个方向
        dx = px - lx;
        dy = py - ly;
        // 正常化 
        xd = dx > 0 ? 1 : dx < 0?-1: 0
        yd = dy > 0 ? 1 : dy < 0?-1: 0 
        // 如果方向已改变，请存储该点
        if (xd != lxd || yd != lyd || (dx * ldy != dy * ldx)) {
            compressed.push([lx, ly]);
        }
    } 
    //存储最后一点
    compressed.push([px, py]);

    return compressed;
}
exports.compressPath = compressPath;



 