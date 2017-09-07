/**
 举例: 
s = new Sprite_Break( ImageManager.loadTitle1("WorldMap")) 
SceneManager._scene.addChild(s)
 */




Math.randomRange = function(min, max) {
    return min + (max - min) * Math.random();
}


function Sprite_Break() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Sprite_Break.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_Break.prototype.constructor = Sprite_Break;

Sprite_Break.prototype.initialize = function(bitmap) {

    Sprite.prototype.initialize.call(this);
    this._target = bitmap
    this._vertices = []
    this._boxs = []
    this._sprites = []
    this._indices = []
    this._end = 0
    this.make(bitmap)
};


/**三角*/
Sprite_Break.prototype.make = function(bitmap) {
    var imageWidth = bitmap.width
    var imageHeight = bitmap.height
    var x
    var y
    var dx = imageWidth / 8
    var dy = imageHeight / 8
    var offset = 0.5;

    for (var i = 0; i <= imageWidth; i += dx) {
        for (var j = 0; j <= imageHeight; j += dy) {
            if (i && (i !== imageWidth)) {
                x = i + Math.randomRange(-dx * offset, dx * offset);
            } else {
                x = i
            };
            if (j && (j !== imageHeight)) {
                y = j + Math.randomRange(-dy * offset, dy * offset);
            } else {
                y = j
            };
            this._vertices.push([x, y]);
        }
    }

    this._indices = this.Delaunay.triangulate(this._vertices);
    this.makeSprites(bitmap)
}

Sprite_Break.prototype.makeSprites = function(bitmap) {

    var indices = this._indices
    var vertices = this._vertices
    var boxs = this._boxs
    var sprites = this._sprites
    var imageWidth = bitmap.width
    var imageHeight = bitmap.height
    var x
    var y

    for (var i = 0; i < indices.length; i += 3) {
        var p0 = vertices[indices[i + 0]];
        var p1 = vertices[indices[i + 1]];
        var p2 = vertices[indices[i + 2]];
        var xMin = Math.min(p0[0], p1[0], p2[0]);
        var xMax = Math.max(p0[0], p1[0], p2[0]);
        var yMin = Math.min(p0[1], p1[1], p2[1]);
        var yMax = Math.max(p0[1], p1[1], p2[1]);
        var box = {
            x: xMin,
            y: yMin,
            w: xMax - xMin,
            h: yMax - yMin
        }

        boxs.push(box);
        var sprite = this.makeSprite(bitmap, p0, p1, p2, box)
        sprites.push(sprite)
        this.addChild(sprite)
    }
}

Sprite_Break.prototype.makeSprite = function(bitmap, p0, p1, p2, box) {

    var sprite = new Sprite(this.break(bitmap, p0, p1, p2, box))
    sprite.x = box.x
    sprite.y = box.y


    // sprite.shootx = Math.randomRange(0, 0.1)
    // sprite.fx = Math.random() > 0.5 ? -1 : 1

    sprite.shooty = Math.randomRange(0, 10)
    sprite.fy = 1 //Math.random() > 0.5 ? -1 : 1

    return sprite
}

Sprite_Break.prototype.break = function(source, v0, v1, v2, box) {
    var bitmap = new Bitmap(box.w, box.h)
    var context = bitmap._context;
    context.save();
    context.translate(-box.x, -box.y);
    context.beginPath();
    context.moveTo(v0[0], v0[1]);
    context.lineTo(v1[0], v1[1]);
    context.lineTo(v2[0], v2[1]);
    context.closePath();
    context.clip();
    context.drawImage(source._canvas, 0, 0);
    context.restore();
    bitmap._setDirty();
    return bitmap
};

Sprite_Break.prototype.update = function() {
    //Sprite.prototype.update.call(this); 
    this.shoot()
}

Sprite_Break.prototype.isend = function(i) {
    if (i !== void(0)) {
        this._end = i
    }
    return this._end
}
Sprite_Break.prototype.shoot = function() {
    var nohave = 1
    for (var i = 0; i < this._sprites.length; i++) {
        var s = this._sprites[i]
        if (s.shootx > 0) {
            have = 0
            s.x += s.fx * (s.shootx -= Math.randomRange(0.01, 0.03))
        }
        if (s.shooty > 0) {
            nohave = 0
            s.y += s.fy * (s.shooty -= Math.randomRange(0.01, 0.03))
        }
    }
    if (nohave) {
        this.isend(1)
    }

};


Sprite_Break.prototype.Delaunay = {
    triangulate: function(vertices, key) {
        var EPSILON = 1.0 / 1048576.0;
        /**超级三角形 */
        function supertriangle(vertices) {
            var xmin = Number.POSITIVE_INFINITY,
                ymin = Number.POSITIVE_INFINITY,
                xmax = Number.NEGATIVE_INFINITY,
                ymax = Number.NEGATIVE_INFINITY,
                i, dx, dy, dmax, xmid, ymid;

            for (i = vertices.length; i--;) {
                if (vertices[i][0] < xmin) xmin = vertices[i][0];
                if (vertices[i][0] > xmax) xmax = vertices[i][0];
                if (vertices[i][1] < ymin) ymin = vertices[i][1];
                if (vertices[i][1] > ymax) ymax = vertices[i][1];
            }

            dx = xmax - xmin;
            dy = ymax - ymin;
            dmax = Math.max(dx, dy);
            xmid = xmin + dx * 0.5;
            ymid = ymin + dy * 0.5;

            return [
                [xmid - 20 * dmax, ymid - dmax],
                [xmid, ymid + 20 * dmax],
                [xmid + 20 * dmax, ymid - dmax]
            ];
        }
        /**外接圆 */
        function circumcircle(vertices, i, j, k) {
            var x1 = vertices[i][0],
                y1 = vertices[i][1],
                x2 = vertices[j][0],
                y2 = vertices[j][1],
                x3 = vertices[k][0],
                y3 = vertices[k][1],
                fabsy1y2 = Math.abs(y1 - y2),
                fabsy2y3 = Math.abs(y2 - y3),
                xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;

            /* Check for coincident points */
            if (fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)
                throw new Error("Eek! Coincident points!");

            if (fabsy1y2 < EPSILON) {
                m2 = -((x3 - x2) / (y3 - y2));
                mx2 = (x2 + x3) / 2.0;
                my2 = (y2 + y3) / 2.0;
                xc = (x2 + x1) / 2.0;
                yc = m2 * (xc - mx2) + my2;
            } else if (fabsy2y3 < EPSILON) {
                m1 = -((x2 - x1) / (y2 - y1));
                mx1 = (x1 + x2) / 2.0;
                my1 = (y1 + y2) / 2.0;
                xc = (x3 + x2) / 2.0;
                yc = m1 * (xc - mx1) + my1;
            } else {
                m1 = -((x2 - x1) / (y2 - y1));
                m2 = -((x3 - x2) / (y3 - y2));
                mx1 = (x1 + x2) / 2.0;
                mx2 = (x2 + x3) / 2.0;
                my1 = (y1 + y2) / 2.0;
                my2 = (y2 + y3) / 2.0;
                xc = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
                yc = (fabsy1y2 > fabsy2y3) ?
                    m1 * (xc - mx1) + my1 :
                    m2 * (xc - mx2) + my2;
            }

            dx = x2 - xc;
            dy = y2 - yc;
            return { i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy };
        }
        /**去重 */
        function dedup(edges) {
            var i, j, a, b, m, n;

            for (j = edges.length; j;) {
                b = edges[--j];
                a = edges[--j];

                for (i = j; i;) {
                    n = edges[--i];
                    m = edges[--i];

                    if ((a === m && b === n) || (a === n && b === m)) {
                        edges.splice(j, 2);
                        edges.splice(i, 2);
                        break;
                    }
                }
            }
        }
        var n = vertices.length,
            i, j, indices, st, open, closed, edges, dx, dy, a, b, c;

        /* Bail if there aren't enough vertices to form any triangles. */
        if (n < 3)
            return [];

        /* Slice out the actual vertices from the passed objects. (Duplicate the
         * array even if we don't, though, since we need to make a supertriangle
         * later on!) */
        vertices = vertices.slice(0);

        if (key)
            for (i = n; i--;)
                vertices[i] = vertices[i][key];

        /* Make an array of indices into the vertex array, sorted by the
         * vertices' x-position. */
        indices = new Array(n);

        for (i = n; i--;)
            indices[i] = i;

        indices.sort(function(i, j) {
            return vertices[j][0] - vertices[i][0];
        });

        /* Next, find the vertices of the supertriangle (which contains all other
         * triangles), and append them onto the end of a (copy of) the vertex
         * array. */
        st = supertriangle(vertices);
        vertices.push(st[0], st[1], st[2]);

        /* Initialize the open list (containing the supertriangle and nothing
         * else) and the closed list (which is empty since we havn't processed
         * any triangles yet). */
        open = [circumcircle(vertices, n + 0, n + 1, n + 2)];
        closed = [];
        edges = [];

        /* Incrementally add each vertex to the mesh. */
        for (i = indices.length; i--; edges.length = 0) {
            c = indices[i];

            /* For each open triangle, check to see if the current point is
             * inside it's circumcircle. If it is, remove the triangle and add
             * it's edges to an edge list. */
            for (j = open.length; j--;) {
                /* If this point is to the right of this triangle's circumcircle,
                 * then this triangle should never get checked again. Remove it
                 * from the open list, add it to the closed list, and skip. */
                dx = vertices[c][0] - open[j].x;
                if (dx > 0.0 && dx * dx > open[j].r) {
                    closed.push(open[j]);
                    open.splice(j, 1);
                    continue;
                }

                /* If we're outside the circumcircle, skip this triangle. */
                dy = vertices[c][1] - open[j].y;
                if (dx * dx + dy * dy - open[j].r > EPSILON)
                    continue;

                /* Remove the triangle and add it's edges to the edge list. */
                edges.push(
                    open[j].i, open[j].j,
                    open[j].j, open[j].k,
                    open[j].k, open[j].i
                );
                open.splice(j, 1);
            }

            /* Remove any doubled edges. */
            dedup(edges);

            /* Add a new triangle for each edge. */
            for (j = edges.length; j;) {
                b = edges[--j];
                a = edges[--j];
                open.push(circumcircle(vertices, a, b, c));
            }
        }

        /* Copy any remaining open triangles to the closed list, and then
         * remove any triangles that share a vertex with the supertriangle,
         * building a list of triplets that represent triangles. */
        for (i = open.length; i--;)
            closed.push(open[i]);
        open.length = 0;

        for (i = closed.length; i--;)
            if (closed[i].i < n && closed[i].j < n && closed[i].k < n)
                open.push(closed[i].i, closed[i].j, closed[i].k);

            /* Yay, we're done! */
        return open;
    },
    contains: function(tri, p) {
        /* Bounding box test first, for quick rejections. */
        if ((p[0] < tri[0][0] && p[0] < tri[1][0] && p[0] < tri[2][0]) ||
            (p[0] > tri[0][0] && p[0] > tri[1][0] && p[0] > tri[2][0]) ||
            (p[1] < tri[0][1] && p[1] < tri[1][1] && p[1] < tri[2][1]) ||
            (p[1] > tri[0][1] && p[1] > tri[1][1] && p[1] > tri[2][1]))
            return null;

        var a = tri[1][0] - tri[0][0],
            b = tri[2][0] - tri[0][0],
            c = tri[1][1] - tri[0][1],
            d = tri[2][1] - tri[0][1],
            i = a * d - b * c;

        /* Degenerate tri. */
        if (i === 0.0)
            return null;

        var u = (d * (p[0] - tri[0][0]) - b * (p[1] - tri[0][1])) / i,
            v = (a * (p[1] - tri[0][1]) - c * (p[0] - tri[0][0])) / i;

        /* If we're outside the tri, fail. */
        if (u < 0.0 || v < 0.0 || (u + v) > 1.0)
            return null;

        return [u, v];
    }
};


/*
a = new Bitmap(100, 100)
a.fillAll("#ff00ff")
b = new Bitmap()
b.drawbreak(a, [10, 10], [75, 5], [80, 70])
s = new Sprite(b)
SceneManager._scene.addChild(s)










var b = new Bitmap(100, 100)
b.fillAll("#ffffff")
var s = new Sprite(b)
s.x = 100
s.y = 100
SceneManager._scene.addChild(s)
f = function(sprite, color) {
    var w = sprite.width
    var h = sprite.height
    var k = 10
    var hash = []
    var zy = [-k, 0, h]
    var zx = [-k, 0, w]
    var zw = [k, w, k]
    var zh = [k, h, k]
    for (var iy = 0; iy < 3; iy++) {
        var sy = zy[iy]
        var sh = zh[iy]
        for (var ix = 0; ix < 3; ix++) {
            var sx = zx[ix]
            var sw = zw[ix]
            var i = iy * 3 + ix
            if (i == 4) { continue }
            var b = new Bitmap(sw, sh)
            b.fillAll(color || "rgba(0, 0, 255, 0.3) ")
            var s = new Sprite(b)
            s.x = sx
            s.y = sy
            hash[i] = s
            sprite.addChild(hash[i])
        }
    }
    return hash
}
f(s)*/