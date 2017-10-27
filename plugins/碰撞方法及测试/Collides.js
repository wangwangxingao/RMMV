function Collides(a, b) {
    this.a = a
    this.b = b
}


Collides.getAABBAxes = function() {
    if (!this._AABBaxes) {
        this._AABBaxes = [
            new Vector(1, 0),
            new Vector(0, 1)
        ]
    }
    return this._AABBaxes
}

Collides.pointAbs = function(p1) {
    return new Vector(Math.abs(p1.x), Math.abs(p1.y))
}


/**点在x上 
 * 
 */
Collides.pointCollidesWithX = function(p1, x) {
    return p1.x == x
}

/**点在y上 
 */
Collides.pointCollidesWithY = function(p1, y) {
    return p1.y == y
}


/**点在x上的差值 
 */
Collides.pointDistanceWithX = function(p1, x) {
    return p1.x - x
}

/**点在x上的差值 
 * 
 * @param {{x:number ,y:number}} p1 基础点 
 * @param {number} y y坐标 
 * @return {number}  
 */
Collides.pointDistanceWithY = function(p1, y) {
    return p1.y - y
}


/**点的距离 
 * 
 * @param {{x:number ,y:number}} p1 基础点  
 * @return {number}  
 */

Collides.pointDistance = function(p1) {
    return Math.sqrt(Math.pow(p1.x, 2) + Math.pow(p1.y, 2));
}

/**点的距离平方
 * 
 * @param {{x:number ,y:number}} p1 基础点  
 * @return {number}  
 */

Collides.pointDistance2 = function(p1) {
    return Math.pow(p1.x, 2) + Math.pow(p1.y, 2);
}

/**点与点的距离 
 * @param {{x:number ,y:number}} p1 基础点 
 * @param {{x:number ,y:number}} p2 目标点 
 * @return {number}  
 */
Collides.pointDistancePoint = function(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}



/**点与点的距离的平方
 * @param {{x:number ,y:number}} p1 基础点 
 * @param {{x:number ,y:number}} p2 目标点 
 * @return {number}  
 */
Collides.pointDistancePoint2 = function(p1, p2) {
    return Math.pow(p1.x - point.x, 2) + Math.pow(p1.y - p2.y, 2)
}



/**两向量相减,得到边缘法向量 OA-OB = BA;*/
/**后点到前点 
 * 点与点相减
 * 后者朝向前者的向量 
 * @param {{x:number ,y:number}} p1 基础点 
 * @param {{x:number ,y:number}} p2 目标点 
 * @return {{x:number ,y:number}}  
 */
Collides.pointFromPoint = function(p1, p2) {
    return new Vector(p1.x - p2.x, p1.y - p2.y)
}




/**向量的反向量  
 * @param {{x:number ,y:number}} p1 基础点  
 * @return {number}  
 */

Collides.pointTo = function(p1) {
    return new Vector(-p1.x, -p1.y);
}


/**前点到后点
 *==
 * 点与点相减
 *   
 * @param {{x:number ,y:number}} p1 基础点 
 * @param {{x:number ,y:number}} p2 目标点 
 * @return {{x:number ,y:number}}  
 */
Collides.pointToPoint = function(p1, p2) {
    return new Vector(p2.x - p1.x, p2.y - p1.y)
}

/**两向量的点积，一个向量在别一处向量上的投影,得到的不是一个向量，是投影的长度*/
/**点与点的乘积 
 * @param {{x:number ,y:number}} p1 基础点 
 * @param {{x:number ,y:number}} p2 目标点 
 * @return {number}  
 */
Collides.pointDotProduct = function(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}





/**点与点的乘,得到一个向量
 * @param {{x:number ,y:number}} p1 基础点 
 * @param {{x:number ,y:number}} p2 目标点 
 * @return {number}  
 */
Collides.dotVector = function(p1, p2) {
    return new Vector(p1.x * p2.x, p1.y * p2.y);
}


/**向量的垂直向量 
 *  *== 
 * @param {{x:number ,y:number}} p1 基础点  
 * @return {{x:number ,y:number}}  
 */
Collides.vectorVertical = function(p1) {
    return new Vector(p1.y, -p1.x);
}

/**两向量相加得到的新向量*/
/**点与点相加 
 * 前者加后者的向量
 * 
 * @param {{x:number ,y:number}}p1 基础点 
 * @param {{x:number ,y:number} }p2 目标点 
 * @return {{x:number ,y:number} }  
 */
Collides.addVector = function(p1, p2) {
    return new Vector(p1.x + p2.x, p1.y + p2.y)
}

/**点的单位向量  
 * @param {{x:number ,y:number}}p 基础点  
 * @return {{x:number ,y:number} }  
 */
Collides.vectorNormal = function(p) {
    var m = this.pointDistance(p);
    if (m == 0) {
        return new Vector(0, 0)
    } else { /**避免向量为0*/
        return new Vector(p.x / m, p.y / m)
    }
}

/**
 * 点的垂直单位向量
 */
Collides.vectorVerticalNormal = function(p) {
    var m = this.pointDistance(new Vector(p.y, -p.x));
    if (m == 0) {
        return new Vector(0, 0)
    } else { /**避免向量为0*/
        return new Vector(p.y / m, -p.x / m)
    }
}



/** 方向向量倍增 p1.x * m, p1.y * m
 * @param {{x:number ,y:number}} p1 基础点 
 * @param {number} m 长度 
 * @return {{x:number ,y:number}}  
 */
Collides.vectorNormalDistance = function(p1, m) {
    return new Vector(p1.x * m, p1.y * m);
}

/** 方向向量倍缩
 * @param {{x:number ,y:number}} p1 基础点 
 * @param {number} m 长度 
 * @return {{x:number ,y:number}}  
 */
Collides.vectorDistanceNormal = function(p1, m) {
    return new Vector(p1.x / m, p1.y / m);
}

/** 
 * 平移
 */
Collides.projectionOffset = function(p, offset) {
    return new Vector(p.x + offset, p.y + offset)
}

/** 
 * 平移
 */
Collides.projectionChange = function(x, y) {
    return x < y ? new Vector(x, y) : new Vector(y, x)
}


/**点的轴
 * @param {{x:number ,y:number}}p1 基础点  
 * @param {{x:number ,y:number}}point 基础点  
 * @return { [undefined]|{x:number ,y:number} }  
 */
Collides.pointFromPointAxis = function(p1, p2) {
    return this.vectorNormal(this.pointFromPoint(p1, p2))
}




/**投影是否有重合,重叠返回true*/
/**是否重合*/
Collides.projectionOverlaps = function(p1, p2) {
    return p1.y >= p2.x && p2.y >= p1.x;
}

/**检测长度*/
Collides.projectionLong = function(p) {
    return p.y - p.x;
}


/**检测到碰撞*/
Collides.collisionDetected = function(mtv) {
    /**返回true代表碰撞了*/
    return mtv.axis != undefined || mtv.overlap !== 0;
}


/**向量相撞 */
Collides.collidesWithVector = function(p1, vector, p2) {
    var a = Collides.collidesWith(p1, p2)
    var vectorBox = p1.vectorBox(vector)
    if (vectorBox) {
        var b = Collides.collidesWith(vectorBox, p2)
        var x = p1.x
        var y = p1.y
        p1.x += vector.x
        p1.y += vector.y
        var c = Collides.collidesWith(p1, p2)
        p1.x = x
        p1.y = y
        return [a, b, c]
    } else {
        return [a, a, a]
    }
}

/**
 * 图形碰撞
 */
Collides.collidesWith = function(p1, p2) {
    if (p1.type == "circle") {
        if (p2.type == "circle") {
            return Collides.circleCollidesWithCircle(p1, p2)
        } else {
            return Collides.polygonCollidesWithCircle(p2, p1, 1)
        }
    } else {
        if (p2.type == "circle") {
            return Collides.polygonCollidesWithCircle(p1, p2)
        } else if (p1.type == "aabb" && p2.type == "aabb") {
            return Collides.aabbCollidesWithAABB(p1, p2)
        } else {
            return Collides.collidesWithPolygon(p1, p2)
        }
    }
}



/**圆形与圆形进行碰撞*/
Collides.circleCollidesWithCircle = function(c1, c2) {
    //两个圆的距离 
    var distance2 = Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2);
    var overlap = c1.radius + c2.radius
        //中心距离
    var overlap2 = Math.pow(overlap, 2);
    return distance2 >= overlap2 ? false : { distance2: distance2, overlap: overlap, type: "cc" };
}

/**多边形与圆形碰撞检测*/
Collides.polygonCollidesWithCircle = function(polygon, circle, c) {
    /**console.log('多边形与圆形碰撞检测');*/
    /**
     * 最近的点
     */
    /**添加圆点与关闭点的轴 , 单位向量*/
    var closestPoint = this.getPolygonPointClosestToCircle(polygon, circle);
    var axis = this.pointFromPointAxis(circle, closestPoint)
    var axes = polygon.axes();
    axes.push(axis);
    return this.collidesOnAxes(polygon, circle, axes, c);
};

/**
 * 多边形与多边形碰撞
 */
Collides.collidesWithPolygon = function(shape1, shape2) {
    /**得到拖拽形状与传入形状的所有投影轴集合*/
    var axes = shape1.axes().concat(shape2.axes());
    /**返回在任何一个投影轴上的投影是否有重合*/
    return this.collidesOnAxes(shape1, shape2, axes);
}

/**aabb 与 aabb 是否碰撞 */
Collides.aabbCollidesWithAABB = function(aabb1, aabb2) {
    var axes = this.getAABBAxes()
    return this.collidesOnAxes(aabb1, aabb2, axes);
}

Collides.aabbCollidesWithAABB = function(aabb1, aabb2) {
    var b1 = aabb1.boundingBox()
    var b2 = aabb2.boundingBox()
    var px1 = Collides.projectionOffset(b1[0], aabb1.x)
    var px2 = Collides.projectionOffset(b2[0], aabb2.x)
    if (Collides.projectionOverlaps(px1, px2)) {
        var py1 = Collides.projectionOffset(b1[1], aabb1.y)
        var py2 = Collides.projectionOffset(b2[1], aabb2.y)
        if (Collides.projectionOverlaps(py1, py2)) {
            return { x: [px1, px2], y: [py1, py2], type: "aabb" }
        }
    }
    return false
}


/**
 * 轴上分离
 */
Collides.collidesOnAxes = function(shape1, shape2, axes, c) {
    var axis;
    var projection1;
    var projection2;
    var axesOverlap = {}
    for (var i = 0; i < axes.length; ++i) {
        axis = axes[i];
        if (!axis) { continue }
        var id = axis.getId()
        if (!axesOverlap[id]) {
            /**得到形状在当前投影轴上的投影*/
            projection1 = shape1.project(axis);
            /**得到当前拖拽形状在当前投影轴上的投影*/
            projection2 = shape2.project(axis);
            /**检测两个投影在当前投影轴上是否重叠 */
            if (!Collides.projectionOverlaps(projection1, projection2)) {
                /**在当前投影轴上分离返回 false ,表示两个形状肯定没有碰撞，不需在检测后面的投影轴了，*/
                return false;
            }
            if (c) {
                axesOverlap[id] = [projection2, projection1, axis]
            } else {
                axesOverlap[id] = [projection1, projection2, axis]
            }
        }
    };
    /**检测完全部的投影轴上的投影没和一个分离的，返回false;*/
    return { axesOverlap: axesOverlap, type: "ss" };
}


/**<!-- 检测多边形与圆形之间的碰撞 -->*/
/*
 *圆与多边形碰撞的原理：圆可以近似的看成一个有无数条边的正多边形，而我们不可能按照这些边一一进行投影测试，我们只需要将圆形投射到一条投影轴上即可，
 *这条轴就是圆心与距其最近的多边形顶点之前的连线。
 * */
/**得到多边形距离圆形最近点*/
Collides.getPolygonPointClosestToCircle = function(polygon, circle) {
    var min = 100000; /**设置一个相对大的值做为相距起始比较值*/
    var length2;
    var testPoint;
    var closestPoint;
    /**后点 到前点 */
    var vector = this.pointFromPoint(polygon, circle)
    for (var i = 0; i < polygon.points.length; i++) {
        testPoint = polygon.points[i];
        length2 = Math.pow(vector.x + testPoint.x, 2) + Math.pow(vector.y + testPoint.y, 2)
        if (length2 < min) {
            min = length2;
            closestPoint = testPoint;
        }
    };
    return this.addVector(polygon, closestPoint);
};


/**多边形与多边形进行碰撞检测*/
Collides.polygonCollidesWithPolygon = function(p1, p2) {
    /**得到P1,P2在p1投影轴上的最小平移向量*/
    var mtv1 = this.minimumTranslationVector(p1, p1.axes(), p2);
    /**得到P1,P2在p2投影轴上的最小平移向量*/
    var mtv2 = this.minimumTranslationVector(p1, p2.axes(), p2);
    if (mtv1.overlap === 0 && mtv2.overlap === 0) {
        /**说明两多边形没有碰撞*/
        return {
            axis: undefined,
            overlap: 0
        }
    } else {
        return mtv1.overlap < mtv2.overlap ? mtv1 : mtv2; /**取最小平移向量值*/
    }
};



/**<!-- 最小平移向量对象 -->*/
Collides.getMinimumTranslationVector = function(axis, overlap) {
    return { axis: axis /**表示平移的方向*/ , overlap: overlap /**表示平移的长度*/ }
}


/**物体在 轴上 到另一个物体的方向,距离 */
Collides.minimumTranslationVector = function(shape1, shape2, axes) {
    var minmumOverlap = 100000;
    /**最小平移向量的长度*/
    var overlap;
    /**最小平移向量所在的投影轴*/
    var axisWithSmallestOverlap;

    for (var i = 0; i < axes.length; i++) {
        axis = axes[i];
        //投影1
        projection1 = shape1.project(axis);
        //投影2
        projection2 = shape2.project(axis);
        //重叠 
        overlap = projection1.overlap(projection2);
        /**代表只要有一个投影轴上的返回0了，就代表两个形状没有相碰撞*/
        if (overlap === 0) {
            /**console.log('两个形状没有碰撞');*/
            return {
                axis: undefined,
                overlap: 0
            }
            /**碰撞了*/
        } else {
            if (overlap < minmumOverlap) {
                minmumOverlap = overlap;
                axisWithSmallestOverlap = axis;
            }
        }
    };
    return {
        axis: axisWithSmallestOverlap,
        /**碰撞的平移向量的方向*/
        overlap: minmumOverlap /**碰撞的平移向量的长度*/
    }
}



Collides.makeOBB = function(width, height, vector, scale) {
    var x0 = (vector.x == 0)
    var y0 = (vector.y == 0)
    var x1 = (vector.x > 0)
    var y1 = (vector.y > 0)
    if (x0 && y0) {
        return undefined
    } else {
        var f = y0 ? (x1 ? 4 : 2) : (x0 ? (y1 ? 1 : 3) : -1)
        if (f == 4) {
            return new AABB(width, height, new Vector(scale.x, scale.y))
        } else if (f == 2) {
            return new AABB(width, height, new Vector(1 - scale.x, 1 - scale.y))
        } else if (f == 1) {
            return new AABB(height, width, new Vector(1 - scale.y, scale.x))
        } else if (f == 3) {
            return new AABB(height, width, new Vector(scale.y, 1 - scale.x))
        } else {
            return new OBB(width, height, vector, scale)
        }
    }
}




/**线段到线段的距离 */
Collides.collidesDistanceLine = function(point1, point2, point3, point4) {
    var lin1y = Collides.projectionChange(point1.y, point2.y)
    lin1y.z = (lin1y.x == point1.y)
    var lin2y = Collides.projectionChange(point3.y, point4.y)
    lin2y.z = (lin2y.x == point3.y)
        //
    if (lin1y.x > lin2y.y) {
        return Infinity
    } else if (lin2y.x > lin1y.y) {
        return Infinity
    } else {
        var lin1 = Collides.pointTo(point3, point4)
        var l1 = Collides.pointDotProduct(lin1, point1)
        var l2 = Collides.pointDotProduct(lin1, point1)

        var long = [Infinity]

        var lin1xl = point1.x - point2.x
        var lin2xl = point3.x - point4.x
        var lin1yl = point1.y - point2.y
        var lin2yl = point3.y - point4.y
        var lin1k = lin1yl ? (lin1xl / lin1yl) : lin1xl > 0 ? point1.x : point2.x //线段1 的较大值
        var lin2k = lin2yl ? (lin2xl / lin2yl) : lin2xl < 0 ? point3.x : point4.x // 线段2 的较小值 
        if (lin1y.x >= lin2y.x) {
            var x = lin1y.z ? point1.x : point2.x
            var y = lin1y.x
            var x2 = lin2yl ? point3.x - (point3.y - y) * lin2k : lin2k
            long.push(x2 - x)
        }
        if (lin1y.y <= lin2y.y) {
            var x = lin1y.z ? point2.x : point1.x
            var y = lin1y.y
            var x2 = lin2yl ? point3.x - (point3.y - y) * lin2k : lin2k
            long.push(x2 - x)
        }
        if (lin2y.x > lin1y.x) {
            var x = lin2y.z ? point3.x : point4.x
            var y = lin2y.x
            var x2 = lin1yl ? point1.x - (point1.y - y) * lin1k : lin1k
            long.push(x - x2)
        }
        if (lin2y.y < lin1y.y) {
            var x = lin2y.z ? point4.x : point3.x
            var y = lin2y.y
            var x2 = lin1yl ? point1.x - (point1.y - y) * lin1k : lin1k
            long.push(x - x2)
        }
        return Math.min.apply(Math, long)
    }
}

/**前圆到后圆的距离 */
Collides.collidesDistanceCircle = function(point1, r1, point2, r2) {
    var y = point2.y - point1.y
    var r = r1 + r2
    if (y > r) {
        return Infinity
    } else if (-y > r) {
        return Infinity
    } else {
        if (r == 0) {
            return point2.x - point1.x
        } else {
            var y2 = Math.pow(y, 2)
            var r2 = Math.pow(r, 2)
            var x2 = r2 - y2
            return point2.x - point1.x - Math.sqrt(x2)
        }
    }
}

/**圆到线段 */
Collides.collidesDistanceCircleLine = function(point1, r, point2, point3) {
    return this.collidesDistanceLineCircle(point2, point3, point1, r)
}

/**线段到圆 */
Collides.collidesDistanceLineCircle = function(point1, point2, point3, r, xf) {
    var ly = point2.y - point1.y
    var lx = point2.x - point1.x
        /**这是一个点 */
    if (!lx && !ly) {
        /**返回 圆和圆  */
        if (xf) {
            return this.collidesDistanceCircle(point3, r, point1, 0)
        } else {
            return this.collidesDistanceCircle(point1, 0, point3, r)
        }
    }
    /**圆的投影最小 */
    var cy1 = point3.y - r
        /**圆的投影最大 */
    var cy2 = point3.y + r
    var ly1 = ly < 0 ? point2.y : point1.y
    var ly2 = ly > 0 ? point2.y : point1.y
    if (ly1 > cy2) {
        return Infinity
    } else if (cy1 > ly2) {
        return Infinity
    } else {
        if (ly) {
            if (lx) {
                /**非竖线时计算切点 */
                var x2 = Math.pow(lx, 2)
                var y2 = Math.pow(ly, 2)
                var r2 = Math.pow(r, 2)
                var h2 = (x2 * r2) / (x2 + y2)
                var m2 = (y2 * r2) / (x2 + y2)
                var h = Math.sqrt(h2)
                var m = Math.sqrt(m2)
                var f = lx * ly
                if ((f > 0 && !xf) || (xf && f < 0)) {
                    var qy = point3.y + h
                } else {
                    var qy = point3.y - h
                }
            } else {
                /**竖线时 */
                var qy = point3.y
                var h = 0
                var m = r
            }
            var pcy1 = point1.y - qy
            var pcy2 = point2.y - qy
                /**在切点同一边 */
            if (pcy1 * pcy2 > 0) {
                /**选择各种点 */
                if (point1.y < cy1 && point1.y > cy1) {
                    var oy = point3.y - point2.y
                    var ox = point2.x
                } else if (point2.y < cy1 && point1.y > cy1) {
                    var oy = point3.y - point1.y
                    var ox = point1.x
                } else {
                    if (Math.abs(pcy1) > Math.abs(pcy2)) {
                        var oy = point3.y - point2.y
                        var ox = point2.x
                    } else {
                        var oy = point3.y - point1.y
                        var ox = point1.x
                    }
                }
                /**计算点距离 */
                var oy2 = Math.pow(oy, 2)
                var or2 = Math.pow(r, 2)
                var ox2 = or2 - oy2
                    /**如果是圆和直线 */
                if (xf) {
                    //最靠近圆的点 
                    return ox - point3.x - Math.sqrt(ox2)
                } else {
                    /**最靠近圆的点 */
                    return point3.x - ox - Math.sqrt(ox2)
                }
                /**在切点不同边时取切点 */
            } else {
                /**获取直线切点x */
                if (lx) {
                    var qx = point2.x - (point2.y - qy) * (lx / ly)
                } else {
                    var qx = point2.x
                }
                /**圆与线段 */
                if (xf) {
                    return qx - point3.x - m
                } else {
                    return point3.x - qx - m
                }
            }
        } else {
            /**横线时判断点即可 */
            var y = point3.y - point1.y
            var y2 = Math.pow(y, 2)
            var r2 = Math.pow(r, 2)
            var x2 = r2 - y2
                /**如果是圆和直线 */
            if (xf) {
                //最左边的点
                var x = lx < 0 ? point2.x : point1.x
                return x - point3.x + Math.sqrt(x2)
                    /**直线和圆 */
            } else {
                /**最右点 */
                var x = lx > 0 ? point2.x : point1.x
                return point3.x - x - Math.sqrt(x2)
            }
        }
    }
}



/**<!-- Vector对象 向量对象 -->*/
/**坐标系中的向量，以0，0出发，到点x,y，为一个向量，向量长度方向相同为同一个向量
 * 
 * @param {number} x
 * @param {number} y
 * 
 */
function Vector(x, y) {
    this.x = x;
    this.y = y;
};


Vector.prototype.getId = function() {
    return "" + this.x + ":" + this.y
}



/**<!-- Shape对象 -->*/
function Shape() {
    this.initialize.apply(this, arguments);
};

Shape.prototype = Object.create(Vector.prototype);
Shape.prototype.constructor = Shape;

Shape.prototype.initialize = function() {
    this.x = 0
    this.y = 0
};


/**返回投影的最大值与最小值*/
Shape.prototype.project = function(axis) {
    throw 'project(axis) 还没有实现呢';
    /**这里不写是因为不同的形状的计算投影最大值与最小值的方法不同，不能统一写在这里*/
}

/**得到形状所有的投影轴*/
Shape.prototype.axes = function() {
    return this._axes
}

Shape.prototype.makeBoundingBox = function() {
    throw 'boundingBox() 还没有实现呢';
}

Shape.prototype.boundingBox = function() {
    return this._boundingBox
}

/**移动形状*/
Shape.prototype.move = function(dx, dy) {
    throw 'move(dx,dy) 还没有实现呢';
    /**这里不写是因为不同的形状移动的方法不同，不能统一写在这里*/
}


Shape.prototype.vectorBox = function(vector) {
    var m = Collides.pointDistance(vector)
    if (m) {
        return this.makeVectorBox(vector, m)
    } else {
        return undefined
    }
}

Shape.prototype.makeVectorBox = function(vector) {
    throw 'makeVectorBox(vector) 还没有实现呢';
};

/**接触*/
Shape.prototype.collidesWith = function(p) {
    return Collides.collidesWith(this, p)
}

/**<!-- Circle对象 -->*/
function Circle(radius) {
    this.initialize.apply(this, arguments);
    this.set(radius);
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.set = function(radius) {
    this.radius = radius;
    this.big = this.small = radius
    this._projectHash = new Vector(-radius, radius)
    this._vectorBoxs = {}
    this.makeAxes()
    this.makeBoundingBox()
    this.type = "circle"
}

/**圆形可以看做有无数个边的多边形，所以不能用找多边形投影轴的方法来找圆形的投影轴*/
Circle.prototype.makeAxes = function() {
    this._axes = [];
};

/**圆形在投影轴上的投影对象*/
Circle.prototype.project = function(axis) {
    //获取本质投影
    var project = this._projectHash
        //偏移量
    var offset = Collides.pointDotProduct(this, axis)
        /**得到圆投影对象的最大值与最小值*/
    return Collides.projectionOffset(project, offset);
};

/**制作包围盒子 */
Circle.prototype.makeBoundingBox = function() {
    var v = this._projectHash
    this._boundingBox = [v, v]
}

/**圆形向量移动的投影对象*/
Circle.prototype.makeVectorBox = function(vector, m) {
    var id = vector.getId()
    if (!this._vectorBoxs[id]) {
        /**移动范围 */
        this._vectorBoxs[id] = Collides.makeOBB(m, this.radius * 2, vector, new Vector(1, 0.5))
    }
    return this._vectorBoxs[id]
};


/**<!-- Polygon对象 多边形对象  -->*/
function Polygon(set) {
    this.initialize.apply(this, arguments);
    this.set(set)
};


Polygon.prototype = Object.create(Shape.prototype);
Polygon.prototype.constructor = Polygon;


Polygon.prototype.set = function(points) {
    this.points = []
    if (points) {
        var type = typeof(points[0])
        var lx
        var ly
        if (type == "object") {
            for (var i = 0; i < points.length; i++) {
                var x = points[i].x
                var y = points[i].y
                if (i > 0 && (x != lx || y != ly)) {
                    this.points.push(new Vector(x, y));
                } else {
                    this.points.push(new Vector(x, y));
                }
                var lx = x
                var ly = y
            }
        } else {
            for (var i = 0; i < points.length; i += 2) {
                var x = points[i]
                var y = points[i + 1]
                if (i > 0 && (x != lx || y != ly)) {
                    this.points.push(new Vector(x, y));
                } else {
                    this.points.push(new Vector(x, y));
                }
                var lx = x
                var ly = y
            }
        }
        if (this.points.length > 1) {
            var p0 = this.points[0]
            var p1 = this.points[this.points.length - 1]
            if (p0.x == p1.x && p0.y == p1.y) {
                this.points.pop()
            }
        }
    }
    this.makeAxes()
    this.makeBoundingBox()
    this._projectHash = {}
    this._vectorBoxs = {}
    this.type = "polygon"
};

/**用于得到多边形所有投影轴的方法*/
Polygon.prototype.makeAxes = function() {
    /**代表多边形的相邻两点*/
    var axes = [];
    if (this.points.length <= 1) {
        this._axes = Collides.getAABBAxes()
    } else if (this.points.length == 2) {
        var vector = Collides.pointFromPoint(this.points[0], this.points[1])
        axes.push(Collides.vectorVerticalNormal(vector));
        axes.push(Collides.vectorNormal(vector));
    } else {
        /**遍历多边形所有相邻的点得去所有的投影轴*/
        for (var i = 0; i < this.points.length - 1; i++) {
            var vector = Collides.pointFromPoint(this.points[i], this.points[i + 1])
            axes.push(Collides.vectorVerticalNormal(vector));
        };
        /**将收尾两点的投影轴也加入*/
        var vector = Collides.pointFromPoint(this.points[i], this.points[0])
        axes.push(Collides.vectorVerticalNormal(vector));
    }
    this._axes = axes
};


/**得到多边形各个点在某一条投影轴上投影，并得到投影两端点值，传递给投影对象Projection返回投影对象*/
Polygon.prototype.project = function(axis) {
    //获取本质投影
    var project = this.makeProjec(axis)
        //偏移量
    var offset = Collides.pointDotProduct(this, axis)
    return Collides.projectionOffset(project, offset)
};

/**制作投影 */
Polygon.prototype.makeProjec = function(axis) {
    var id = axis.getId()
    if (!this._projectHash[id]) {
        /**用于存放所有点向量在投影轴向量上的点积集合，注意点积集合是数量不是向量*/
        var scalars = [];
        var v = new Vector();
        this.points.forEach(function(point) {
            v.x = point.x;
            v.y = point.y;
            scalars.push(Collides.pointDotProduct(v, axis));
        });
        v.x = Math.min.apply(Math, scalars)
        v.y = Math.max.apply(Math, scalars);
        v.scalars = scalars
        this._projectHash[id] = v
    }
    return this._projectHash[id]
}

/**制作 */
Polygon.prototype.makeVectorBox = function(vector) {
    var id = vector.getId()
    if (!this._vectorBoxs[id]) {
        /**垂直 */
        var axis = Collides.vectorVerticalNormal(vector)
        var project1 = this.makeProjec(axis)
        var scalars = project1.scalars
        var minIndex = scalars.indexOf(project1.x)
        var maxIndex = scalars.indexOf(project1.y)
        console.log(vector, axis, project1)
            /**最小点 */
        var point1 = this.points[minIndex]

        /**最小点移动后的点 */
        var point3 = Collides.addVector(point1, vector)

        /**最大点 */
        var point2 = this.points[maxIndex]

        /**最大点移动后的点 */
        var point4 = Collides.addVector(point2, vector)

        this._vectorBoxs[id] = new Polygon([point1, point3, point4, point2])
    }
    return this._vectorBoxs[id]
};

/**为多边形增加新的点*/
/*
Polygon.prototype.addPoint = function(x, y) {
    this.points.push(new Vector(x, y));
    this.makeAxes()
    this.makeBoundingBox()
    this._projectHash = {}
};
*/

/**得到多边形的最左最上，最下最右的点*/
Polygon.prototype.makeBoundingBox = function() {
    var xs = []
    var ys = []
        /**遍历多边形全部点，更新多边形位置*/
    for (var i = 0, point; i < this.points.length; i++) {
        point = this.points[i];
        xs.push(point.x)
        ys.push(point.y)
    }
    var x = new Vector(Math.min.apply(Math, xs), Math.max.apply(Math, xs))
    var y = new Vector(Math.min.apply(Math, ys), Math.max.apply(Math, ys))
    this._boundingBox = [x, y]
}



/**AABB */
function AABB(width, height, scale) {
    this.initialize.apply(this, arguments);
    this.set(width, height, scale)
}

AABB.prototype = Object.create(Polygon.prototype);
AABB.prototype.constructor = AABB;

AABB.prototype.set = function(width, height, scale) {
    this.width = width
    this.height = height
    this.scale = scale || new Vector(1, 1)
    if (this.width > this.height) {
        this.big = width
        this.small = height
    } else {
        this.big = height
        this.small = width
    }
    this.makeAxes()
    this.makePoints()
    this.makeBoundingBox()
    this._vectorBoxs = {}
    this._projectHash = {}
    this.type = "aabb"
}

AABB.prototype.makeAxes = function() {
    this._axes = Collides.getAABBAxes()
}


AABB.prototype.makePoints = function() {
    var w1 = this.width * this.scale.x
    var w2 = w1 - this.width
    var h1 = this.height * this.scale.y
    var h2 = h1 - this.height
    this.points = []
    this.points.push(new Vector(w2, h2))
    this.points.push(new Vector(w2, h1))
    this.points.push(new Vector(w1, h1))
    this.points.push(new Vector(w1, h2))
}

AABB.prototype.makeBoundingBox = function() {
    var p2 = this.points[0]
    var p1 = this.points[2]
    var x = new Vector(p2.x, p1.x)
    var y = new Vector(p2.y, p1.y)
    this._boundingBox = [x, y]
}



/**OBB */
function OBB(width, height, axis, scale) {
    this.initialize.apply(this, arguments);
    this.set(width, height, axis, scale)
}
OBB.prototype = Object.create(Polygon.prototype);
OBB.prototype.constructor = OBB;

OBB.prototype.set = function(width, height, axis, scale) {
    this.width = width
    this.height = height
    this.scale = scale || new Vector(0.5, 0.5)
    this.axis = Collides.vectorNormal(axis)
    this.axis2 = Collides.vectorVertical(this.axis)
    if (this.width > this.height) {
        this.big = width
        this.small = height
    } else {
        this.big = height
        this.small = width
    }
    this.makeAxes()
    this.makePoints()
    this.makeBoundingBox()
    this._vectorBoxs = {}
    this._projectHash = {}
    this.type = "obb"
}

/**制作 */
OBB.prototype.makeAxes = function() {
    this._axes = [this.axis, this.axis2]
}

/**制作点 */
OBB.prototype.makePoints = function() {
    var w1 = this.width * this.scale.x
    var w2 = w1 - this.width
    var h1 = this.height * this.scale.y
    var h2 = h1 - this.height
    var a = Collides.vectorNormalDistance(this.axis, w1)
    var b = Collides.vectorNormalDistance(this.axis, w2)
    var c = Collides.vectorNormalDistance(this.axis2, h1)
    var d = Collides.vectorNormalDistance(this.axis2, h2)
    this.points = []
    this.points.push(Collides.addVector(a, c))
    this.points.push(Collides.addVector(b, c))
    this.points.push(Collides.addVector(b, d))
    this.points.push(Collides.addVector(a, d))
}