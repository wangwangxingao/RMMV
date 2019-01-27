var ww = ww || {}




ww.d2 = {}


/**
 * 点 
 * @param {number}  x  x值
 * @param {number}  y  y值
 * 
 */
ww.d2.point = function (x, y) {
	return { x: x, y: y }
}
/**
 * 线段 
 * @param {number}  ax  a点x值
 * @param {number}  ay  a点y值
 * 
 * @param {number}  bx  b点x值
 * @param {number}  by  b点y值
 * 
 */

ww.d2.segment = function () {
	return { a: { x: ax, y: ay }, b: { x: bx, y: by } }
}
/**
 * 射线
 * @param {number}  ax  a点x值
 * @param {number}  ay  a点y值
 * 
 * @param {number}  bx  b点x值
 * @param {number}  by  b点y值
 */
ww.d2.ray = function (ax, ay, bx, by) {
	return { a: { x: ax, y: ay }, b: { x: bx, y: by } }
}

/**点与点 */

ww.d2.pointPoint = function (r_px, r_py, r_dx, r_dy, s_px, s_py, s_dx, s_dy) {

	if (r_px == s_px && r_py == s_py) {
		return {
			x: r_px,
			y: r_py,
			param: 0
		}
	}
	return null

}

 
/**点线段 */

ww.d2.pointSegment = function (r_px, r_py, r_dx, r_dy, s_px, s_py, s_dx, s_dy) {

	var sr_xd = (s_px - r_px)
	var sr_yd = (s_py - r_py)

	if (sr_xd * s_dy == sr_yd * s_dx) {
		var z = sr_xd / s_dx
		if (z > 1 || z < 0) {
			return null
		}
		return {
			x: r_px,
			y: r_py,
			param: 0
		}
	}
	return null



}

/**射线点的交点 */
ww.d2.rayPoint = function (r_px, r_py, r_dx, r_dy, s_px, s_py, s_dx, s_dy) {

	var sr_xd = (s_px - r_px)
	var sr_yd = (s_py - r_py)
	if (sr_xd * r_dy == sr_yd * r_dx || r_dx == 0 || r_dy == 0) {

		if (r_dx) {
			var T1 = sr_xd / r_dx 
		} else {
			var T1 = sr_yd / r_dy 
		}

		if (T1 < 0) {
			return null
		}
		return {
			x: s_px,
			y: s_py,
			param: T1
		}
	}
}

/**射线与线段 */
ww.d2.raySegment = function (r_px, r_py, r_dx, r_dy, s_px, s_py, s_dx, s_dy) {
	var sr_xy = s_dx * r_dy
	var sr_yx = s_dy * r_dx

	//是否平行 
	if (sr_xy == sr_yx) {
		//方向相同
		return null;
	}

	var sr_l = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px))
	var sr_d = (sr_xy - sr_yx)


	var T2 = sr_l / sr_d;
	if (r_dx) {
		var T1 = (s_px + s_dx * T2 - r_px) / r_dx;
	} else {
		var T1 = (s_py + s_dy * T2 - r_py) / r_dy;
	}

	//必须在参数范围内 
	if (T1 < 0) return null;
	if (T2 < 0 || T2 > 1) return null;

	//返回交叉点
	return {
		x: r_px + r_dx * T1,
		y: r_py + r_dy * T1,
		param: T1
	};

}
/**射线与线段的交点 */
ww.d2.rayIntersection = function (ray, segment) {

	//射线参数
	var r_px = ray.a.x;
	var r_py = ray.a.y;
	var r_dx = ray.b.x - ray.a.x;
	var r_dy = ray.b.y - ray.a.y;

	//线段参数  
	var s_px = segment.a.x;
	var s_py = segment.a.y;
	var s_dx = segment.b.x - segment.a.x;
	var s_dy = segment.b.y - segment.a.y;


	var rt = r_dx != 0 || r_dy != 0
	var st = s_dx != 0 || s_dy != 0
	if (rt) {
		if (st) {
			return this.raySegment(r_px, r_py, r_dx, r_dy, s_px, s_py, s_dx, s_dy)
		} else {
			return this.rayPoint(r_px, r_py, r_dx, r_dy, s_px, s_py, s_dx, s_dy)
		}
	} else {
		if (st) {
			return this.pointSegment(r_px, r_py, r_dx, r_dy, s_px, s_py, s_dx, s_dy)
		} else {
			return this.pointPoint(r_px, r_py, r_dx, r_dy, s_px, s_py, s_dx, s_dy)
		}
	}
}

///////////////////////////////////////////////////////

// DRAWING 
/**绘制 */
ww.d2.draw = function(bitmap,Mouse,segments,color){ 

	var color = color || "#999"

	var ctx = bitmap._context
	//清除画布
	// Clear canvas
	ctx.clearRect(0, 0, bitmap.width, bitmap.height);

	//绘制片段
	// Draw segments
	/*
	ctx.strokeStyle = color //"#999";
	for (var i = 0; i < segments.length; i++) {
		var seg = segments[i];
		ctx.beginPath();
		ctx.moveTo(seg.a.x, seg.a.y);
		ctx.lineTo(seg.b.x, seg.b.y);
		ctx.stroke();
	}
	*/

	//获取所有点 Get all unique points
	var points = (function (segments) {
		var a = [];
		segments.forEach(function (seg) {
			a.push(seg.a, seg.b);
		});
		return a;
	})(segments);
	//合并点
	var uniquePoints = (function (points) {
		var set = {};
		return points.filter(function (p) {
			var key = p.x + "," + p.y;
			if (key in set) {
				return false;
			} else {
				set[key] = true;
				return true;
			}
		});
	})(points);

	//获取所有角度 Get all angles
	var uniqueAngles = [];
	for (var j = 0; j < uniquePoints.length; j++) {
		var uniquePoint = uniquePoints[j];
		var angle = Math.atan2(uniquePoint.y - Mouse.y, uniquePoint.x - Mouse.x);
		uniquePoint.angle = angle;
		uniqueAngles.push(angle - 0.00001, angle, angle + 0.00001);
	}
	//所有方向的光线
	// RAYS IN ALL DIRECTIONS
	var intersects = [];
	for (var j = 0; j < uniqueAngles.length; j++) {
		var angle = uniqueAngles[j];
		//从角度计算dx和dy
		// Calculate dx & dy from angle
		var dx = Math.cos(angle);
		var dy = Math.sin(angle);
		//从屏幕中心射到鼠标
		// Ray from center of screen to mouse
		var ray = {
			a: { x: Mouse.x, y: Mouse.y },
			b: { x: Mouse.x + dx, y: Mouse.y + dy }
		};
		//找到CLOSEST交点
		// Find CLOSEST intersection
		var closestIntersect = null;
		for (var i = 0; i < segments.length; i++) {
			var intersect = ww.d2.rayIntersection(ray, segments[i]);
			if (!intersect) continue;
			if (!closestIntersect || intersect.param < closestIntersect.param) {
				closestIntersect = intersect;
			}
		}

		//相交角
		// Intersect angle
		if (!closestIntersect) continue;
		closestIntersect.angle = angle;

		//添加到相交列表
		// Add to list of intersects
		intersects.push(closestIntersect);

	}

	//按角度排序相交
	// Sort intersects by angle
	intersects = intersects.sort(function (a, b) {
		return a.angle - b.angle;
	});

	//绘制为巨型多边形
	// DRAW AS A GIANT POLYGON
	ctx.fillStyle =  color //"#dd3838";
	ctx.beginPath();
	ctx.moveTo(intersects[0].x, intersects[0].y);
	for (var i = 1; i < intersects.length; i++) {
		var intersect = intersects[i];
		ctx.lineTo(intersect.x, intersect.y);
	}
	ctx.fill();

	//绘制调试线
	// DRAW DEBUG LINES
	/*ctx.strokeStyle = color //"#f55";
	for (var i = 0; i < intersects.length; i++) {
		var intersect = intersects[i];
		ctx.beginPath();
		ctx.moveTo(Mouse.x, Mouse.y);
		ctx.lineTo(intersect.x, intersect.y);
		ctx.stroke();
	}
*/
}

  // LINE SEGMENTS
var segments = [

	// Border
	{ a: { x: 0, y: 0 }, b: { x: 640, y: 0 } },
	{ a: { x: 640, y: 0 }, b: { x: 640, y: 360 } },
	{ a: { x: 640, y: 360 }, b: { x: 0, y: 360 } },
	{ a: { x: 0, y: 360 }, b: { x: 0, y: 0 } },

	// Polygon #1
	{ a: { x: 100, y: 150 }, b: { x: 120, y: 50 } },
	{ a: { x: 120, y: 50 }, b: { x: 200, y: 80 } },
	{ a: { x: 200, y: 80 }, b: { x: 140, y: 210 } },
	{ a: { x: 140, y: 210 }, b: { x: 100, y: 150 } },

	// Polygon #2
	{ a: { x: 100, y: 200 }, b: { x: 120, y: 250 } },
	{ a: { x: 120, y: 250 }, b: { x: 60, y: 300 } },
	{ a: { x: 60, y: 300 }, b: { x: 100, y: 200 } },

	// Polygon #3
	{ a: { x: 200, y: 260 }, b: { x: 220, y: 150 } },
	{ a: { x: 220, y: 150 }, b: { x: 300, y: 200 } },
	{ a: { x: 300, y: 200 }, b: { x: 350, y: 320 } },
	{ a: { x: 350, y: 320 }, b: { x: 200, y: 260 } },

	// Polygon #4
	{ a: { x: 340, y: 60 }, b: { x: 360, y: 40 } },
	{ a: { x: 360, y: 40 }, b: { x: 370, y: 70 } },
	{ a: { x: 370, y: 70 }, b: { x: 340, y: 60 } },

	// Polygon #5
	{ a: { x: 450, y: 190 }, b: { x: 560, y: 170 } },
	{ a: { x: 560, y: 170 }, b: { x: 540, y: 270 } },
	{ a: { x: 540, y: 270 }, b: { x: 430, y: 290 } },
	{ a: { x: 430, y: 290 }, b: { x: 450, y: 190 } },

	// Polygon #6
	{ a: { x: 400, y: 95 }, b: { x: 580, y: 50 } },
	{ a: { x: 580, y: 50 }, b: { x: 480, y: 150 } },
	{ a: { x: 480, y: 150 }, b: { x: 400, y: 95 } }

];
