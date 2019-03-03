/**
 * 手写轨迹
 * 
 * 
 * 参考内容:
 * Technology-手写汉字识别 
 * http://www.linyibin.cn/2016/11/10/technology-IME-HandWritingRecognization/
 *  
 * 
*/

var ww = ww || {}


ww.track = (function () {

    var MAXFLOAT = Infinity

    var DEAFULT_WIDTH = 1000
    var DEAFULT_HEIGHT = 1000

    var MAX_DIFF_PER_STROKE = 35
    var MAX_DIRETION = 1000
    var VERTICAL = 1001
    var HORIZONTAL = 1002
    /**
     * 
     * @param {Point} lastPoint  
     * @param {Point} startPoint 
     */
    function dir(lastPoint, startPoint) {
        var result = -1;
        result = Math.atan2(startPoint.y - lastPoint.y, startPoint.x - lastPoint.x) * 10;
        return result;
    }


    function distance(lastPoint, startPoint) {
        var result = -1;
        result = Math.abs(startPoint.y - lastPoint.y) + Math.abs(startPoint.x - lastPoint.x) * 10;
        return result;
    }

    /**
     * 
     * @param {Character} character 
     */
    function norm(character) {
        var lastPoint = {};
        lastPoint.x = -1;
        lastPoint.y = -1;
        for (var i = 0; i < character.strokeCount; ++i) {
            var stroke = character.strokes[i];
            var tmpPoint;
            for (var j = 0; j < stroke.points.length; ++j) {
                tmpPoint = stroke.points[j];
                tmpPoint.dir = (lastPoint.x == -1 && lastPoint.y == -1) ? 0 : dir(lastPoint, tmpPoint);
                lastPoint = tmpPoint;
            }
        }
    };

    /**
     * 
     * @param {Character} character 
     */
    function long(character) {
        var lastPoint = {};
        lastPoint.x = -1;
        lastPoint.y = -1;
        lastPoint.d = -1;
        for (var i = 0; i < character.strokeCount; ++i) {
            var stroke = character.strokes[i];
            var tmpPoint;
            for (var j = 0; j < stroke.points.length; ++j) {
                tmpPoint = stroke.points[j];
                tmpPoint.d = (lastPoint.x == -1 && lastPoint.y == -1) ? 0 : distance(lastPoint, tmpPoint);
                tmpPoint.dn = (lastPoint.d <= 0) ? 0 : tmpPoint.d / lastPoint.d
                lastPoint = tmpPoint;
            }
        }
    };



    /**
     *  
     * @param {Stroke} stroke  
     * @param {*} points 
     * @param {any} pointIndex1
     * @param {*} pointIndex2 
     */
    function turnPoints(stroke, points, pointIndex1, pointIndex2) {
        if (pointIndex1 < 0 || pointIndex2 <= 0 || pointIndex1 >= pointIndex2 - 1) {
            return;
        }
        var a = stroke.points[pointIndex2].x - stroke.points[pointIndex1].x;
        var b = stroke.points[pointIndex2].y - stroke.points[pointIndex1].y;
        var c = stroke.points[pointIndex1].x * stroke.points[pointIndex2].y - stroke.points[pointIndex2].x * stroke.points[pointIndex1].y;
        var max = 3000;
        var maxDistPointIndex = -1;
        for (var i = pointIndex1 + 1; i < pointIndex2; ++i) {
            var point = stroke.points[i];
            var dist = Math.abs((a * point.y) - (b * point.x) + c);
            console.log(dist)
            //td:: cout << dist << std:: endl;
            if (dist > max) {
                max = dist;
                maxDistPointIndex = i;
            }
        }
        if (maxDistPointIndex != -1) {
            turnPoints(stroke, points, pointIndex1, maxDistPointIndex);
            points.push(stroke.points[maxDistPointIndex]);
            turnPoints(stroke, points, maxDistPointIndex, pointIndex2);
        }
    }
    /**
     *  
     * @param {Character} character 
     */
    function getTurnPoints(character) {
        for (var i = 0; i < character.strokeCount; ++i) {
            var stroke = character.strokes[i];
            if (stroke.points.length > 1) {
                //std:: vector < Point > points;
                var points = []
                points.push(stroke.points[0]);
                turnPoints(stroke, points, 0, stroke.points.length - 1);
                points.push(stroke.points[stroke.points.length - 1]);
                stroke.points.length = 0;
                for (var i = 0; i < points.length; ++i) {
                    stroke.points.push(points[i]);
                }
            }
        }
        //console.log(charccter);
        return character
    }


    function evalCharacter(character) {
        if (!character.eval) {
            norm(character)
            getTurnPoints(character)
            long(character)
            character.eval = true
        }
    }

    /**
     * 
     * @param {Stroke} stroke1 
     * @param {Stroke} stroke2 
     */
    function distBetweenStrokes(stroke1, stroke2) {
        var strokeDist = MAXFLOAT;
        //std:: cout << "Stroke size::" << stroke1.points.length << " " << stroke2.points.length << std:: endl; 
        var dist = 0// 0.0f;
        var minLength = Math.min(stroke1.points.length, stroke2.points.length);
        var largeStroke = stroke1.points.length > minLength ? stroke1 : stroke2;
        var smallStroke = stroke1.points.length > minLength ? stroke2 : stroke1;
        for (var j = 1; j < minLength; ++j) {
            var diretion1 = largeStroke.points[j].dir;
            var diretion2 = smallStroke.points[j].dir;

            dist += Math.abs(diretion1 - diretion2);
            //console.log(diretion1, diretion2, VERTICAL, HORIZONTAL)
            // 垂直笔画处理
            /*if (diretion1 == VERTICAL && diretion2 == VERTICAL) {
                dist += Math.abs(0.1);
                // 水平笔画处理
            } else if (Math.abs(diretion1) == HORIZONTAL && Math.abs(diretion2) == HORIZONTAL) {
                dist += Math.abs(diretion1 - diretion2);
            } else {
                if (Math.abs(diretion1) == HORIZONTAL) {
                    diretion1 = 0.1;
                }
                if (Math.abs(diretion2) == HORIZONTAL) {
                    diretion2 = 0.1;
                }
                dist += Math.abs(diretion1 - diretion2);
            }
            */
        }
        // 当前笔与上一笔的largeStroke位置
        dist += Math.abs(largeStroke.points[0].dir - smallStroke.points[0].dir);
        strokeDist = dist / minLength;
        //std:: cout << strokeDist << std:: endl;
        return strokeDist;
    }


    var allMax = 0, allMin = MAXFLOAT;
    /**
     *  
     * @param {Character} character1  
     * @param {Character} character2 
     */
    function dist(character1, character2) {
        evalCharacter(character1)
        evalCharacter(character2)
        var dist = MAXFLOAT;
        if (character2.strokeCount >= character1.strokeCount && character2.strokeCount <= character1.strokeCount + 2) {
            //std:: cout << character1.word << ":" << character1.strokeCount << "." << character2.word << ":" << character2.strokeCount << std:: endl;
            var allStrokeDist = 0.0;
            for (var i = 0; i < character1.strokeCount; ++i) {
                var stroke1 = character1.strokes[i];
                var stroke2 = character2.strokes[i];
                var strokeDist = distBetweenStrokes(stroke1, stroke2);

                //笔画距离  > 全部最大
                if (strokeDist > allMax) {
                    allMax = strokeDist;
                }
                if (strokeDist < allMin) {
                    allMin = strokeDist;
                }

                allStrokeDist += strokeDist;

                if (strokeDist > MAX_DIFF_PER_STROKE) {
                    allStrokeDist = MAXFLOAT;
                    return allStrokeDist;
                }
            }
            // 笔画更接近的优先级更高
            return allStrokeDist / character1.strokeCount + character2.strokeCount - character1.strokeCount;
        }
        return dist;
    }

    /**
     *  
     * @param {Word} word1  
     * @param {Word} word2 
     */
    function cmp_word_dist(word1, word2) {
        return word1.dist < word2.dist;
    }
    function Stroke() {
        //std::vector<Point> points;
        this.points = []
    };


    function Character(width, height) {
        this.lastStrokeId = -1;
        this.strokeCount = 0
        this.strokes = []
        this.clear();
        var width = width || 1000
        var height = height || 1000
        this.initSize(width, height);

    };


    Character.prototype.clear = function () {
        this.strokeCount = 0;
        this.lastStrokeId = -1;
        //this.width = DEAFULT_WIDTH;
        //this.height = DEAFULT_HEIGHT;
        this.strokes.length = 0;
        this.eval = false
    }


    /**
     * 
     */
    Character.prototype.initSize = function (tmpWidth, tmpHeight) {
        this.width = tmpWidth;
        this.height = tmpHeight;
    }

    /**
     * 
     */
    Character.prototype.addPoint = function (strokeId, x, y) {
        if (strokeId < 0) {
            return false;
        }
        if (strokeId != this.lastStrokeId) {
            this.lastStrokeId = strokeId;
            this.strokeCount++;
            var stroke = new Stroke();
            this.strokes.push(stroke);
        }
        var point = {};
        point.x = x / this.width * DEAFULT_WIDTH;
        point.y = y / this.height * DEAFULT_HEIGHT;
        this.strokes[this.strokeCount - 1].points.push(point);

        this.eval = false
        return this
    };

    Character.prototype.setDirectionList = function (list) {
        this.strokeCount = 0;
        this.strokes.length = 0;
        for (var i = 0; i < list.length; i++) {
            var l2 = list[i]
            if (l2) {
                this.strokeCount++;
                var stroke = new Stroke();
                this.strokes.push(stroke);
                for (var i2 = 0; i2 < l2.length; i2++) {
                    stroke.points.push({ dir: l2[i2] });
                }
            }
        }
        this.eval = true
        return this
    }

    Character.prototype.setPointList = function (list) {
        this.clear()
        for (var i = 0; i < list.length; i++) {
            var l2 = list[i]
            if (l2) {
                this.strokeCount++;
                var stroke = new Stroke();
                this.strokes.push(stroke);
                for (var i2 = 0; i2 < l2.length; i2++) {
                    if (l2[i2]) {
                        if (Array.isArray(l2[i2])) {
                            var x = l2[i2][0]
                            var y = l2[i2][1]
                        } else {
                            var x = l2[i2].x
                            var y = l2[i2].y
                        }
                        var x = x / this.width * DEAFULT_WIDTH;
                        var y = y / this.height * DEAFULT_HEIGHT;
                        stroke.points.push({ x: x, y: y });
                    }
                }
            }
        }
        this.eval = false
        return this
    }


    function formPoints(list) {
        var c = new Character()
        c.setPointList(list)
        evalCharacter(c)
        return c
    }


    function formDirs(list) {
        var c = new Character()
        c.setDirectionList(list)
        return c
    }

    return {
        eval:evalCharacter,
        char: Character,
        dist: dist,
        formPoints: formPoints,
        formDirs: formDirs
    }
})();
