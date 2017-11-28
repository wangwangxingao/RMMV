function fourTree() {
    this.initialize.apply(this, arguments)
}

/**初始化 */
fourTree.prototype.initialize = function(bounds, level, root) {
    this.objects = []
    this.nodes = []
    this.level = level || 0
    this.bounds = bounds
    this.maxObjects = 10
    this.maxLevel = 4
    this.root = root || this
}

/**所有对象 */
fourTree.prototype.allObject = function() {
    var list = this.objects
    for (var i = 0; i < this.nodes.length; i++) {
        var node = this.nodes[i]
        list = list.concat(node.allObject())
    }
    return list
}


/**切割 */
fourTree.prototype.split = function() {
    if (this.nodes.length) {
        return
    }
    var w = this.bounds.w * 0.5
    var h = this.bounds.h * 0.5
    var x0 = this.bounds.x - w
    var x0 = this.bounds.y - h
    var x1 = this.bounds.x + w
    var y1 = this.bounds.y + h

    this.nodes = [
        /**左上 */
        new fourTree(Collides.body(x0, y0, w, h), this.level + 1, this.root),
        /**右上 */
        new fourTree(Collides.body(x1, y0, w, h), this.level + 1, this.root),
        /**右下 */
        new fourTree(Collides.body(x1, y1, w, h), this.level + 1, this.root),
        /**左下 */
        new fourTree(Collides.body(x0, y1, w, h), this.level + 1, this.root)
    ]
}

/**
 * 
 * @param {{body}} obj 对象
 * @param {boolean} checkIsInner 检查在矩形内
 */

fourTree.prototype.getIndex = function(obj, checkIsInner) {
    var aabb1 = obj.body
    var aabb2 = this.bounds
    var p1xx = aabb1.x - aabb1.w
    var p1xy = aabb1.x + aabb1.w

    var p2xx = aabb2.x - aabb2.w
    var p2xy = aabb2.x + aabb2.w

    var p1yx = aabb1.y - aabb1.h
    var p1yy = aabb1.y + aabb1.h

    var p2yx = aabb2.y - aabb2.h
    var p2yy = aabb2.y + aabb2.h

    if (checkIsInner && (
            (p1xx < p2xx || p1xy > p2xy) ||
            (p1yx < p2yx || p1yy > p2yy))) {
        return -1
    }
    var p20x = aabb2.x
    var p20y = aabb2.y

    var l = p1xy < p20x
    var r = p1xx > p20x
    var t = p1yy < p20y
    var b = p1yx > p20y

    if (t) {
        if (l) { return 0 }
        if (r) { return 1 }
    }
    if (b) {
        if (r) { return 2 }
        if (l) { return 3 }
    }
    return -1
}

/**是在之中 */
fourTree.prototype.isIn = function(obj) {
    //console.log(obj.body, this.bounds)  
    return Collides.bodyInBody(obj.body, this.bounds)
}


/**添加 */
fourTree.prototype.add = function(obj) {
    if (obj.fourTree) {
        if (obj.fourTree.root == this.root && obj.fourTree.isIn(obj)) {
            return
        }
        obj.fourTree.remove(obj)
    }
    var objs = this.objects
    var index = this.getIndex(obj)
    if (index == -1 || !this.nodes.length) {
        objs.push(obj)
        obj.fourTree = this
    } else {
        this.nodes[index].add(obj)
        return
    }
    this.addNodes()
}

/**添加到节点 */
fourTree.prototype.addNodes = function() {
    if (!this.nodes.length &&
        this.objects.length > this.maxObjects &&
        this.level < this.maxLevel) {
        this.split()
        for (var i = objs.length - 1; i >= 0; i--) {
            index = this.getIndex(objs[i])
            if (index != -1) {
                this.nodes[index].add(objs.splice(i, 1)[0])
            }
        }
    }
}

/**移除 */
fourTree.prototype.remove = function(obj) {
    var i = this.objects.indexOf(obj)
    if (i >= 0) {
        this.objects.splice(i, 1)
        obj.fourTree = null
    }
}

/**刷新 */
fourTree.prototype.refresh = function(root) {
    var objs = this.objects
    var index
    var i
    var len
    var root = root || this
    for (i = objs.length - 1; i >= 0; i--) {
        if (objs[i].destroy) {
            objs.splice(i, 1)
        } else {
            index = this.getIndex(objs[i], 1)
            if (index == -1) {
                if (this !== root) {
                    root.add(objs.splice(i, 1)[0])
                }
            } else {
                this.nodes[index].add(objs.splice(i, 1)[0], 1)
            }
        }
    }
    for (i = 0, len = this.nodes.length; i < len; i++) {
        this.nodes[i].refresh(root)
    }
}


fourTree.prototype.collidesWith = function(obj) {
    var result = []
    if (Collides.bodyInBody(obj.body, this.bounds)) {
        result = result.concat(this.objects)
        for (var i = 0; i < this.nodes.length; i++) {
            result = result.concat(this.nodes[i].collidesWith(rect))
        }
    }
    return result
}


fourTree.prototype.collidesMove = function(obj, xd, yd) {
    var result = []
    var index
    if (Collides.bodyMoveBodyIn(obj.body, this.bounds, dx, dy)) {
        result = result.concat(this.objects)
        for (var i = 0; i < this.nodes.length; i++) {
            result = result.concat(this.nodes[i].collidesWith(rect))
        }
    }
    return result
}


fourTree.prototype.collidesFun = function(obj, fun) {
    var result = []
    var index
    if (fun(obj.body, this.bounds)) {
        result = result.concat(this.objects)
        for (var i = 0; i < this.nodes.length; i++) {
            result = result.concat(this.nodes[i].collidesWith(rect))
        }
    }
    return result
}


Collides.bodyWithBody = function(body1, body2) {
    return Collides.chMoveCh(
        body1.x,
        body1.y,
        body1.w,
        body1.h,
        body2.x,
        body2.y,
        body2.w,
        body2.h
    )
}



Collides.bodyInBody = function(body1, body2) {
    return Collides.chInCh(
        body1.x,
        body1.y,
        body1.w,
        body1.h,
        body2.x,
        body2.y,
        body2.w,
        body2.h
    )
}

Collides.chWithCh = function(x, y, w, h, x1, y1, w1, h1) {
    var xa = x1 - x
    var ya = y1 - y
    var w2 = w + w1
    var h2 = h + h1
    var xa0 = xa - w2
    var xa1 = xa + w2
    var ya0 = ya - h2
    var ya1 = ya + h2
    if (xa0 <= 0 && xa1 >= 0 && ya0 <= 0 && ya1 >= 0) {
        return true
    } else {
        return false
    }
}

Collides.chInCh = function(x, y, w, h, x1, y1, w1, h1) {
    var p1xx = x - w
    var p1xy = x + w

    var p2xx = x1 - w1
    var p2xy = x1 + w1

    var p1yx = y - h
    var p1yy = y + h

    var p2yx = y - h
    var p2yy = y + h

    if (p2xx <= p1xx && p2xy >= p1xy && p2yx <= p1yx && p2yy >= p1yy) {
        return true
    }
    return false
}



Collides.bodyMoveBodyIn = function(body1, body2, xd, yd, type) {
    var l = Collides.chMoveCh(
        body1.x,
        body1.y,
        body1.w,
        body1.h,
        body2.x,
        body2.y,
        body2.w,
        body2.h,
        xd, yd, type
    )
    return l[0] == xd && l[1] == yd
}

Collides.bodyMoveBody = function(body1, body2, xd, yd, type) {
    return Collides.chMoveCh(
        body1.x,
        body1.y,
        body1.w,
        body1.h,
        body2.x,
        body2.y,
        body2.w,
        body2.h,
        xd, yd, type
    )
}


Collides.chMoveCh = function(x, y, w, h, x1, y1, w1, h1, xd, yd, type) {
    var xa = x1 - x
    var ya = y1 - y
    var w2 = w + w1
    var h2 = h + h1
    var xa0 = xa - w2
    var xa1 = xa + w2
    var ya0 = ya - h2
    var ya1 = ya + h2
    if (type == 2) {
        ya0 = ya1
    } else if (type == 8) {
        ya1 = ya0
    } else if (type == 4) {
        xa1 = xa0
    } else if (type == 6) {
        xa0 = xa1
    }

    /**y方向不变 */
    if (yd == 0) {
        //y轴上重合
        if (ya0 <= 0 && ya1 >= 0) {
            var xd = Collides.moved(xd, xa0, xa1)
        }
    } else if (xd == 0) {
        //y轴上重合
        if (xa0 <= 0 && xa1 >= 0) {
            var yd = Collides.moved(yd, ya0, ya1)
        }
    } else {
        var k = xd / yd
        var ya0 = k > 0 ? ya0 * k : ya1 * k
        var ya1 = k > 0 ? ya1 * k : ya0 * k
        if (ya1 >= xa0 && ya0 <= xa1) {
            var da0 = ya0 > xa0 ? ya0 : xa0
            var da1 = ya1 < xa1 ? ya1 : xa1
            var d = Collides.moved(xd, da0, da1)
            if (d != xd) {
                var xd = d
                var yd = d / k
            }
        }
    }
    return [xd, yd]
}



Collides.four = function(x, y, w, h, w1, h1, xd, yd, type) {
    var x0 = x - w
    var x1 = x + w
    if (xd > 0) {
        x1 += xd
    } else {
        x0 += xd
    }
    var y0 = y - h
    var y1 = y + h
    if (yd > 0) {
        y1 += yd
    } else {
        y0 += yd
    }

    var z = 0
    if ((type == 3 || type == 1) && (x0 < 0 && x1 > 0) || (x1 > w1 && x0 < w1)) {
        z += 1
    }
    if ((type == 3 || type == 2) && (y0 < 0 && y1 > 0) || (y1 > h1 && y0 < h1)) {
        z += 2
    }
    return z
}



Collides.body = function(x, y, w, h) {
    return { x: x, y: y, w: w, h: h }
}


Collides.bodymove = function(obj, x, y) {
    obj.x = x
    obj.y = y
}


Collides.moveIn = function(x, w, xd) {
    if (x + xd > w || x + xd < 0) {
        return false
    } else {
        return true
    }
}




Collides.moved = function(d, x, y) {
    if (0 < x) {
        if (d < 0) {
            return d
        } else {
            if (d < x) {
                return d
            } else {
                return x
            }
        }
    } else if (0 > y) {
        if (d > 0) {
            return d
        } else {
            if (d < y) {
                return y
            } else {
                return d
            }
        }
    } else {
        return 0
    }
}





Game_CharacterBase.prototype.moveStraight = function(d) {
    //设置移动成功( 能通过(x,y,d)  )
    this.setMovementSuccess(this.canPass(this._x, this._y, d));
    //如果( 是移动成功的() )
    if (this.isMovementSucceeded()) {
        //设置方向(d)
        this.setDirection(d);
        //x = 游戏地图 环x和方向(x,d)
        this._x = $gameMap.roundXWithDirection(this._x, d);
        //y = 游戏地图 环y和方向(y,d)
        this._y = $gameMap.roundYWithDirection(this._y, d);
        //真x = 游戏地图 x和方向(x, 相反方向(d)  )
        this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
        //真y = 游戏地图 y和方向(y, 相反方向(d)  )
        this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
        console.log(this._x, this._y, this._realX, this._realY)
            //增加步数()
        this.increaseSteps();
        //否则
    } else {
        //设置方向(d)
        this.setDirection(d);
        //检查正面事件触摸触发(d)
        this.checkEventTriggerTouchFront(d);
    }
};





























function Collides() {}


Collides.getAabbAxes = function() {
    if (!this._aabbaxes) {
        this._aabbaxes = [
            new Vector(1, 0),
            new Vector(0, 1)
        ]
    }
    return this._aabbaxes
}


Collides.getVectorId = function(p) {
    return "" + p.x + ":" + p.y
}

/** */
Collides.pointAbs = function(p1) {
    return new Vector(Math.abs(p1.x), Math.abs(p1.y))
}



/**点在x上 
 * 
 * 
 * @param {Vector} p1 基础点 
 * @param {number} x x坐标 
 * @return {boolean}  
 */
Collides.pointCollidesWithX = function(p1, x) {
    return p1.x == x
}

/**点在y上 
 * 
 * @param {Vector} p1 基础点 
 * @param {number} y y坐标 
 * @return {boolean}  
 */
Collides.pointCollidesWithY = function(p1, y) {
    return p1.y == y
}

/**点在x上的差值  
 * @param {Vector} p1 基础点 
 * @param {number} x x坐标 
 * @return {number}  
 */
Collides.pointDistanceWithX = function(p1, x) {
    return p1.x - x
}

/**点在y上的差值 
 * 
 * @param {Vector} p1 基础点  
 * @param {number} y y坐标 
 * @return {number}  
 */
Collides.pointDistanceWithY = function(p1, y) {
    return p1.y - y
}

/**点的距离 
 * 
 * @param {Vector} p1 基础点  
 * @return {number}  
 */

Collides.pointDistance = function(p1) {
    return Math.sqrt(Math.pow(p1.x, 2) + Math.pow(p1.y, 2));
}

/**点的距离平方
 * 
 * @param {Vector} p1 基础点  
 * @return {number}  
 * 
 */
Collides.pointDistance2 = function(p1) {
    return Math.pow(p1.x, 2) + Math.pow(p1.y, 2);
}

/**点与点的距离 
 * @param {Vector} p1 基础点 
 * @param {Vector} p2 目标点 
 * @return {number}  
 */
Collides.pointDistancePoint = function(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

/**点与点的距离的平方
 * @param {Vector} p1 基础点 
 * @param {Vector} p2 目标点 
 * @return {number}  
 */
Collides.pointDistancePoint2 = function(p1, p2) {
    return Math.pow(p1.x - point.x, 2) + Math.pow(p1.y - p2.y, 2)
}


/**两向量相减,得到边缘法向量 OA-OB = BA;*/
/**后点到前点 
 * 点与点相减
 * 后者朝向前者的向量 
 * @param {Vector} p1 基础点 
 * @param {Vector} p2 目标点 
 * @return {Vector}  
 */
Collides.pointFromPoint = function(p1, p2) {
    if (p2) {
        return new Vector(p1.x - p2.x, p1.y - p2.y)
    } else {
        return new Vector(p1.x, p1.y)
    }
}


/**前点到后点
 *==
 * 点与点相减
 *   
 * @param {Vector} p1 基础点 
 * @param {Vector} p2 目标点 
 * @return {Vector}  
 */
Collides.pointToPoint = function(p1, p2) {
    if (p2) {
        return new Vector(p2.x - p1.x, p2.y - p1.y)
    } else {
        return new Vector(-p1.x, -p1.y)
    }
}

/**两向量的点积，一个向量在别一处向量上的投影,得到的不是一个向量，是投影的长度*/
/**点与点的乘积 
 * @param {Vector} p1 基础点 
 * @param {Vector} p2 目标点 
 * @return {number}  
 */
Collides.pointDot = function(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}



/**点与点的乘,得到一个向量
 * @param {Vector} p1 基础点 
 * @param {Vector} p2 目标点 
 * @return {number}  
 */
Collides.dotVector = function(p1, p2) {
    return new Vector(p1.x * p2.x, p1.y * p2.y);
}


/**向量的垂直向量 
 *  *== 
 * @param {Vector} p1 基础点  
 * @return {Vector}  
 */
Collides.vectorVertical = function(p1) {
    return new Vector(p1.y, -p1.x);
}

/**两向量相加得到的新向量*/
/**点与点相加 
 * 前者加后者的向量
 * 
 * @param {Vector}p1 基础点 
 * @param {Vector}p2 目标点 
 * @return {Vector}  
 */
Collides.addVector = function(p1, p2) {
    return new Vector(p1.x + p2.x, p1.y + p2.y)
}

/**单位向量  
 * @param {Vector} p 基础点  
 * @return {Vector}  
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
 * 垂直单位向量
 */
Collides.vectorVerticalNormal = function(p) {
    var m = this.pointDistance(p);
    if (m == 0) {
        return new Vector(0, 0)
    } else {
        /**避免向量为0*/
        return new Vector(p.y / m, -p.x / m)
    }
}



/** 方向向量倍增 p1.x * m, p1.y * m
 * @param {Vector} p1 基础点 
 * @param {number} m 长度 
 * @return {Vector}  
 */
Collides.vectorNormalDistance = function(p1, m) {
    return new Vector(p1.x * m, p1.y * m);
}

/** 方向向量倍缩
 * @param {Vector} p1 基础点 
 * @param {number} m 长度 
 * @return {Vector}  
 */
Collides.vectorDistanceNormal = function(p1, m) {
    return new Vector(p1.x / m, p1.y / m);
}

/**点的轴
 * @param {Vector}p1 基础点  
 * @param {Vector}point 基础点  
 * @return { [undefined]|Vector }  
 */
Collides.pointFromPointAxis = function(p1, p2) {
    return this.vectorNormal(this.pointFromPoint(p1, p2))
}

/**向量是平行 */
Collides.vectorIsParallel = function(p1, p2) {
    return p1.y * p2.x - p2.y * p1.x;
}


/** 
 * 平移
 */
Collides.projectOffset = function(p, offset) {
    return new Vector(p.x + offset, p.y + offset)
}

/** 
 * 制作
 */
Collides.projectChange = function(x, y) {
    return x < y ? new Vector(x, y) : new Vector(y, x)
}


/** 
 * 制作相加
 */
Collides.projectAdd = function(p1, p2) {
    return new Vector(Math.min(p1.x, p2.x), Math.max(p1.y, p2.y))
}

/** 
 * 制作相减
 */
Collides.projectSub = function(p1, p2) {
    if (Collides.projectOverlaps(p1, p2)) {
        return new Vector(Math.max(p1.x, p2.x), Math.min(p1.y, p2.y))
    } else {
        return 0
    }
}





/**投影是否有重合,重叠返回true*/
/**是否重合*/
Collides.projectOverlaps = function(p1, p2) {
    return p1.y >= p2.x && p2.y >= p1.x;
}

/**投影不重合*/
Collides.projectNotOverlaps = function(p1, p2) {
    return p1.y < p2.x || p2.y < p1.x;
}

/**检测长度*/
Collides.projectLong = function(p) {
    return p.y - p.x;
}


/**返回投影最大最小移动距离 */
Collides.projectMove = function(p1, p2) {
    return new Vector(p2.x - p1.y, p2.y - p1.x)
}

/**目前相交 */
Collides.projectMoveZero = function(p) {
    return p.x > 0 || p.y < 0
}

/**
 * 图形碰撞
 */
Collides.collidesWith = function(p1, p2) {
    if (p1.type == "circle") {
        if (p2.type == "circle") {
            return Collides.circleWithCircle(p1, p2)
        } else {
            return Collides.circleWithPolygon(p2, p1, 1)
        }
    } else {
        if (p2.type == "circle") {
            return Collides.circleWithPolygon(p1, p2)
        } else if (p1.type == "aabb" && p2.type == "aabb") {
            return Collides.aabbWithAABB(p1, p2)
        } else {
            return Collides.polygonWithPolygon(p1, p2)
        }
    }
}


Collides.collidesMove = function(p1, p2, axie) {
    if (p1.type == "circle") {
        if (p2.type == "circle") {
            return Collides.circleMoveCircle(p1, p2, axie)
        } else {
            return Collides.circleMovePolygon(p1, p2, axie)
        }
    } else {
        if (p2.type == "circle") {
            return Collides.polygonMoveCircle(p1, p2, axie)
        } else {
            return Collides.polygonMovePolygon(p1, p2, axie)
        }
    }
}


/**圆形与圆形进行碰撞*/
Collides.circleWithCircle = function(c1, c2) {
    //两个圆的距离 
    var distance2 = Math.pow(c2.x - c1.x, 2) + Math.pow(c2.y - c1.y, 2);
    var overlap = c1.radius + c2.radius
        //中心距离
    var overlap2 = Math.pow(overlap, 2);
    return distance2 >= overlap2 ? false : true //{ distance2: distance2, overlap: overlap, type: "cc" };
}

/**多边形与圆形碰撞检测*/
Collides.circleWithPolygon = function(polygon, circle, c) {
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


/**
 * 多边形与多边形碰撞
 */
Collides.polygonWithPolygon = function(shape1, shape2) {
    /**得到拖拽形状与传入形状的所有投影轴集合*/
    var axes = shape1.axes().concat(shape2.axes());
    /**返回在任何一个投影轴上的投影是否有重合*/
    return this.collidesOnAxes(shape1, shape2, axes);
}



/**
 *  
 */
Collides.aabbWithAABB = function(aabb1, aabb2) {
    var b1 = aabb1.boundingBox()
    var b2 = aabb2.boundingBox()
    var px1 = Collides.projectOffset(b1[0], aabb1.x)
    var px2 = Collides.projectOffset(b2[0], aabb2.x)
    if (Collides.projectOverlaps(px1, px2)) {
        var py1 = Collides.projectOffset(b1[1], aabb1.y)
        var py2 = Collides.projectOffset(b2[1], aabb2.y)
        if (Collides.projectOverlaps(py1, py2)) {
            return true // { x: [px1, px2], y: [py1, py2], type: "aabb" }
        }
    }
    return false
}












/**
 * 轴上分离
 */
Collides.collidesOnAxes = function(shape1, shape2, axes, c) {
    var axis;
    var project1;
    var project2;
    var axesOverlap = {}
    for (var i = 0; i < axes.length; ++i) {
        axis = axes[i];
        if (!axis) { continue }
        var id = Collides.getVectorId(axis)
        if (!axesOverlap[id]) {
            /**得到形状在当前投影轴上的投影*/
            project1 = shape1.project(axis);
            /**得到当前拖拽形状在当前投影轴上的投影*/
            project2 = shape2.project(axis);
            /**检测两个投影在当前投影轴上是否重叠 */
            if (!Collides.projectOverlaps(project1, project2)) {
                /**在当前投影轴上分离返回 false ,表示两个形状肯定没有碰撞，不需在检测后面的投影轴了，*/
                return false;
            }
            axesOverlap[id] = true
                /** 
                if (c) {
                    axesOverlap[id] = [project2, project1, axis]
                } else {
                    axesOverlap[id] = [project1, project2, axis]
                }*/
        }
    };
    /**检测完全部的投影轴上的投影没和一个分离的，返回false;*/
    return true // { axesOverlap: axesOverlap, type: "ss" };
}




/**圆的移动距离 
 * 
 * 
 * 
 */
Collides.pointCircleMoveList = function(c1, c2, r1, r2, axie) {
    /**轴点  */
    var p1 = Collides.pointDot(axie, c1)
    var p2 = Collides.pointDot(axie, c2)
        /**轴距离 */
    var l = p2 - p1
    var l2 = Math.pow(l, 2)
        /**球心距离 */
    var dx = c1.x - c2.x
    var dy = c1.y - c2.y
    var d2 = Math.pow(dx, 2) + Math.pow(dy, 2)
        /**高2 */
    var h2 = d2 - l2
        /**两球半径和 */
    var rl = r1 + r2
    var rl2 = Math.pow(rl, 2)
        /**不相交 */
    if (h2 > rl2) {
        return []
    }
    var cl = h2 ? Math.sqrt(rl2 - h2) : rl
    if (cl) {
        return [l - cl, l + cl]
    } else {
        return [l]
    }
}


/**
 *  点与线段的距离
 * 
 * @param {Vector} p1 判定点
 * @param {Vector} p2 线段点1
 * @param {Vector} p3 线段点2
 * @param {Vector} axie 判定轴
 * 
 *  
 */
Collides.pointLineMoveList = function(p1, p2, p3, axie) {
    var v2 = Collides.pointFromPoint(p1, p2)
    var v3 = Collides.pointFromPoint(p1, p3)
    var a = Collides.vectorIsParallel(axie, v2)
    var b = Collides.vectorIsParallel(axie, v3)
    var l1 = Collides.pointDot(axie, p2)
    if (a == 0 && b == 0) {
        var l2 = Collides.pointDot(axie, p2)
        var l3 = Collides.pointDot(axie, p3)
        return [l2 - l1, l3 - l1]
    } else if (a == 0) {
        var l2 = Collides.pointDot(axie, p2)
        return [l2 - l1]
    } else if (b == 0) {
        var l2 = Collides.pointDot(axie, p3)
        return [l2 - l1]
    } else if ((a > 0 && b < 0) || (a < 0 && b > 0)) {
        var l2 = Collides.pointDot(axie, p2)
        var l3 = Collides.pointDot(axie, p3)
        var a = Math.abs(a)
        var b = Math.abs(b)
        var l4 = (l2 * b + l3 * a) / (a + b)
        return [l4]
    } else {
        return []
    }
}



/**
 * 点在轴上到多边形的距离 
 *  
 */
Collides.pointPointsMoveList = function(p1, ps, axie) {
    var list = []
    for (var i = 1; i < ps.length; i++) {
        var p1 = ps[i - 1]
        var p2 = ps[i]
        var l = Collides.pointLineMoveList(p1, p2, p3, axie)
        list.concat(l)
    }
    return list
}


/**
 * 点在轴上到矩形的距离
 * 
 * 
 */
Collides.pointLineCRMoveList = function(p1, p2, p3, r, axie) {
    var v1 = Collides.pointFromPoint(p2, p3)
    var v2 = Collides.vectorVerticalNormal()
    if (r) {
        var xr = v2.x * r
        var yr = v2.y * r
        var ps = [new Vector(p2.x + xr, p2.y + yr),
            new Vector(p2.x - xr, p2.y - yr),
            new Vector(p3.x - xr, p3.y - yr),
            new Vector(p3.x + xr, p3.y + yr)
        ]
        return Collides.pointPointsMoveList(p1, ps, axie)
    } else {
        return Collides.pointLineMoveList(p1, p2, p3, axie)
    }
}



/**
 * 点在轴上到多边形圆矩形的距离
 * 
 *  
 */
Collides.pointPointsCRMoveList = function(p1, ps, r, axie) {
    var list = []
    for (var i = 1; i < ps.length; i++) {
        var p1 = ps[i - 1]
        var p2 = ps[i]
        var l = Collides.pointLineCRMoveList(p1, p2, p3, r, axie)
        list.concat(l)
    }
    var p1 = ps[i - 1]
    var p2 = ps[0]
    var l = Collides.pointLineCRMoveList(p1, p2, p3, r, axie)
    list.concat(l)
    return list
}



/**
 * 
 * 
 */
Collides.pointPointsCMoveList = function(p1, ps, r, axie) {
    var list = []
    for (var i = 0; i < ps.length; i++) {
        var p1 = ps[i]
        var l = Collides.pointCircleMoveList(p1, p2, 0, r, axie)
        list.concat(l)
    }
    return list
}


/**
 * 圆在轴上到多边形的距离列表
 * 
 *  
 */
Collides.circlePointsMoveList = function(p1, ps, r, axie) {
    if (r) {
        var list = []
        var l = Collides.pointPointsCMoveList(p1, ps, r, axie)
        list.concat(l)
        var l = Collides.pointPointsCRMoveList(p1, ps, r, axie)
        list.concat(l)
        return list
    } else {
        return Collides.pointPointsMoveList(p1, ps, axie)
    }
}



/**
 * 圆与圆距离
 */
Collides.circleMoveCircle = function(s1, s2, axie) {
    var c1 = s1
    var c2 = s2
    var r1 = s1.radius || 0
    var r2 = s2.radius || 0
    var list = Collides.pointCircleMoveList(c1, c2, r1, r2, axie)
    if (list.length) {
        return new Vector(Math.min.apply(Math, list), Math.max.apply(Math, list))
    } else {
        return false
    }
}


/**
 * 圆与多边形距离
 * @param {Vector} p1 圆心
 * @param {[Vector]} p2 多边形中心
 * @param {number} r 圆半径
 * @param {[Vector]} ps 多边形点组
 * @param {Vector} axie 轴
 *  
 */
Collides.circleMovePolygon = function(s1, s2, axie, cs) {
    var p1 = s1
    var p2 = s2
    var r = s1.radius || 0
    var ps = s2.points || []
    var p = Collides.pointFromPoint(p1, p2)
    var list = Collides.circlePointsMoveList(p, ps, r, axie)
    if (list.length) {
        if (cs) {
            return new Vector(-Math.max.apply(Math, list), -Math.min.apply(Math, list))
        } else {
            return new Vector(Math.min.apply(Math, list), Math.max.apply(Math, list))
        }
    } else {
        return false
    }
}


/**
 * 多边形与圆距离
 * @param {Polygon}  s2
 * @param {Circle}  s1 
 * @param {Vector}  axie  轴
 * 
 */
Collides.polygonMoveCircle = function(s2, s1, axie) {
    return Collides.circleMovePolygon(s1, s2, axie, true)
}


/**
 * 多边形与多边形距离
 */
Collides.polygonMovePolygon = function(shape1, shape2, axie) {
    /**得到拖拽形状与传入形状的所有投影轴集合*/
    var axes = shape1.axes().concat(shape2.axes());
    /**返回在任何一个投影轴上的投影是否有重合*/
    return this.onAxesMove(shape1, shape2, axes, axie);
}



/**
 * 轴上分离
 */
Collides.onAxesMove = function(shape1, shape2, axes, axie) {
    var axis;
    var project1;
    var project2;

    var axesOverlap = {}
    var p = new Vector(-Infinity, Infinity)
    var ps = 0
    for (var i = 0; i < axes.length; ++i) {
        axis = axes[i];
        if (!axis) { continue }
        var id = Collides.getVectorId(axis)
        if (!axesOverlap[id]) {
            /**得到形状在当前投影轴上的投影*/
            project1 = shape1.project(axis);
            /**得到当前拖拽形状在当前投影轴上的投影*/
            project2 = shape2.project(axis);
            /**检测两个投影在当前投影轴上是否重叠 */
            var move = Collides.projectMove(project1, project2)
            axesOverlap[id] = true
            var l = Collides.axesAxieMove(move, axis, axie)
            if (l) {
                p = Collides.projectSub(p, p2)
                ps = 1
            } else {
                return false
            }
        }
    };
    return ps ? p : false
}


/**
 * 轴上分离
 */
Collides.axesAxieMove = function(move, a1, a2) {
    var d = Collides.pointDot(a1, a2)
    if (d) {
        return Collides.vectorDistanceNormal(move, d)
    } else {
        if (Collides.projectMoveZero(move)) {
            return new Vector(-Infinity, Infinity)
        } else {
            return false
        }
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



/**<!-- Shape对象 -->*/
function Shape() {
    this.initialize.apply(this, arguments);
};

Shape.prototype = Object.create(Vector.prototype);
Shape.prototype.constructor = Shape;

Shape.prototype.initialize = function() {
    this.x = 0
    this.y = 0
    this.type = "shape"
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

/**移动 */
Shape.prototype.move = function(dx, dy) {
        this.x = dx
        this.y = dy
    }
    /**接触*/
Shape.prototype.collidesWith = function(p) {
    return Collides.collidesWith(this, p)
}

Shape.prototype.collidesMove = function(p, axie) {
    return Collides.collidesMove(this, p, axie)
}



/**<!-- Circle对象 -->*/
function Circle() {
    this.initialize.apply(this, arguments);
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;



/**初始化*/
Circle.prototype.initialize = function(radius) {
    Shape.prototype.initialize.call(this)
    this.set(radius);
}

/**设置 */
Circle.prototype.set = function(radius) {
    this.radius = radius;
    this.big = this.small = radius
    this._projectHash = new Vector(-radius, radius)
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
    var offset = Collides.pointDot(this, axis)
        /**得到圆投影对象的最大值与最小值*/
    return Collides.projectOffset(project, offset);
};

/**制作包围盒子 */
Circle.prototype.makeBoundingBox = function() {
    var v = this._projectHash
    this._boundingBox = [v, v]
}


/**<!-- Polygon对象 多边形对象  -->*/
function Polygon() {
    this.initialize.apply(this, arguments);
};


Polygon.prototype = Object.create(Shape.prototype);
Polygon.prototype.constructor = Polygon;


Polygon.prototype.initialize = function(point) {
    Shape.prototype.initialize.call(this)
    this.set(point)
}

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
    this.type = "polygon"
};

/**用于得到多边形所有投影轴的方法*/
Polygon.prototype.makeAxes = function() {
    /**代表多边形的相邻两点*/
    var axes = [];
    if (this.points.length <= 1) {
        this._axes = Collides.getAabbAxes()
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


/**得到多边形各个点在某一条投影轴上投影，并得到投影两端点值，传递给投影对象project返回投影对象*/
Polygon.prototype.project = function(axis) {
    //获取本质投影
    var project = this.makeProjec(axis)
        //偏移量
    var offset = Collides.pointDot(this, axis)
    return Collides.projectOffset(project, offset)
};

/**制作投影 */
Polygon.prototype.makeProjec = function(axis) {
    var id = Collides.getVectorId(axis)
    if (!this._projectHash[id]) {
        /**用于存放所有点向量在投影轴向量上的点积集合，注意点积集合是数量不是向量*/
        var scalars = [];
        var v = new Vector();
        this.points.forEach(function(point) {
            v.x = point.x;
            v.y = point.y;
            scalars.push(Collides.pointDot(v, axis));
        });
        v.x = Math.min.apply(Math, scalars)
        v.y = Math.max.apply(Math, scalars);
        v.scalars = scalars
        this._projectHash[id] = v
    }
    return this._projectHash[id]
}


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
function AABB() {
    this.initialize.apply(this, arguments);
    this.set(width, height, scale)
}

AABB.prototype = Object.create(Polygon.prototype);
AABB.prototype.constructor = AABB;

AABB.prototype.initialize = function() {
    Shape.prototype.initialize.call(this)
    this.set(width, height, scale)
};



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
    this.makePoints()
    this.makeAxes()
    this.makeBoundingBox()
    this._projectHash = {}
    this.type = "aabb"
}

AABB.prototype.makeAxes = function() {
    this._axes = Collides.getAabbAxes()
    this.axis = this._axes[0]
    this.axis2 = this._axes[1]
}

AABB.prototype.makePoints = function() {
    var w1 = this.width * this.scale.x
    var w2 = w1 - this.width
    var h1 = this.height * this.scale.y
    var h2 = h1 - this.height
    this.points = []
    this.points.push(new Vector(w1, h1))
    this.points.push(new Vector(w2, h1))
    this.points.push(new Vector(w2, h2))
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
function OBB() {
    this.initialize.apply(this, arguments);
}
OBB.prototype = Object.create(Polygon.prototype);
OBB.prototype.constructor = OBB;


OBB.prototype.initialize = function(width, height, axis, scale) {
    Shape.prototype.initialize.call(this)
    this.set(width, height, axis, scale)
}

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
    this.makePoints()
    this.makeAxes()
    this.makeBoundingBox()
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
        project1 = shape1.project(axis);
        //投影2
        project2 = shape2.project(axis);
        //重叠 
        overlap = project1.overlap(project2);
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



/**线段到线段的距离 */
Collides.collidesDistanceLine = function(point1, point2, point3, point4) {
    var lin1y = Collides.projectChange(point1.y, point2.y)
    lin1y.z = (lin1y.x == point1.y)
    var lin2y = Collides.projectChange(point3.y, point4.y)
    lin2y.z = (lin2y.x == point3.y)
        //
    if (lin1y.x > lin2y.y) {
        return Infinity
    } else if (lin2y.x > lin1y.y) {
        return Infinity
    } else {
        var lin1 = Collides.pointToPoint(point3, point4)
        var l1 = Collides.pointDot(lin1, point1)
        var l2 = Collides.pointDot(lin1, point1)
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




/**线段上的点 */
/*
Collides.linePoint = function(p, p1, p2) {
    if (p1.x == p2.x) {
        if (p1.y > p2.y) {
            if (p.x < p1.x || p.x > p2.x) {
                return null
            }
        } else {
            if (p.x < p2.x || p.x > p1.x) {
                return null
            }
        }
    } else if (p1.x > p2.x) {
        if (p.x < p1.x || p.x > p2.x) {
            return null
        }
    } else {
        if (p.x < p2.x || p.x > p1.x) {
            return null
        }
    }
    return p
}
*/

/**两个线段 */
/*
Collides.lineLine = function(p1, p3, p2, p4) {
    var a1 = Collides.linePoint(p1, p2, p4)
    var a2 = Collides.linePoint(p3, p2, p4)
    var a3 = Collides.linePoint(p2, p1, p3)
    var a4 = Collides.linePoint(p4, p1, p3)
    var hash = {}
    if (a1) {
        hash[a1.getId()] = a1
    }
    if (a2) {
        hash[a2.getId()] = a2
    }
    if (a3) {
        hash[a3.getId()] = a3
    }
    if (a4) {
        hash[a4.getId()] = a4
    }
    var l = []
    for (var i in hash) {
        l.push(hash[i])
    }
    return l
}
*/

/*
Collides.collidesLine = function(p1, p2, v1, v2, l1, l2) {
    var y2x4 = v1.y * v2.x
    var x2y4 = v1.x * v2.y
    if (y2x4 == x2y4) {
        var v3 = Collides.pointToPoint(p1, p2)
        if (v1.x * v3.y == v1.y * v3.x) {
            if (l1) {
                if (l2) {
                    return [new Vector(p1.x, p1.y), new Vector(p1.x + v1.x, p1.y + v1.y), new Vector(p2.x, p2.y), new Vector(p2.x + v2.x, p2.y + v2.y)]
                } else {
                    return [new Vector(p2.x, p2.y), new Vector(p2.x + v2.x, p2.y + v2.y)]
                }
            } else {
                if (l2) {
                    return [new Vector(p1.x, p1.y), new Vector(p1.x + v1.x, p1.y + v1.y)]
                } else {
                    return Collides.lineLine(new Vector(p1.x, p1.y), new Vector(p1.x + v1.x, p1.y + v1.y), new Vector(p2.x, p2.y), new Vector(p2.x + v2.x, p2.y + v2.y))
                }
            }
        } else {
            return null
        }
    } else {
        var y1y2 = p1.y * v1.y

        var y1y2x4 = y1y2 * v2.x
        var y1y2y4 = y1y2 * v2.y

        var x1x2 = p1.x * v1.x
        var x1x2x4 = x1x2 * v2.x
        var x1x2y4 = x1x2 * v2.y

        var x3x4 = p2.x * v2.x
        var x2x3x4 = v1.x * x3x4
        var y2x3x4 = v1.y * x3x4

        var y3y4 = p2.y * v2.y
        var x2y3y4 = v1.x * y3y4
        var y2y3y4 = v1.y * y3y4

        var y = (x2x3x4 - x2y3y4 + y1y2x4 - x1x2x4) / (y2x4 - x2y4)
        var x = (y1y2y4 - x1x2y4 + y2x3x4 - y2y3y4) / (y2x4 - x2y4)
        var p = new Vector(x, y)
        if (lin1) {
            if (lin2) {
                return p
            } else {
                var p4 = new Vector(p2.x + v2.x, p2.y + v2.y)
                return Collides.linePoint(p, p2, p4)
            }
        } else {
            if (lin2) {
                var p3 = new Vector(p1.x + v1.x, p1.y + v1.y)
                return Collides.linePoint(p, p1, p3)
            } else {
                var p4 = new Vector(p2.x + v2.x, p2.y + v2.y)
                var p3 = new Vector(p1.x + v1.x, p1.y + v1.y)
                return Collides.linePoint(p, p2, p4) && Collides.linePoint(p, p1, p3)
            }
        }
    }
}

*/