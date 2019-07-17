//=============================================================================
// ww_track.js
//=============================================================================

/*:
 * @name ww_track
 * @plugindesc 轨迹处理
 * @author 汪汪
 * @version 2.0
 * 
 * 
 * @help
 * 推荐放在p+.js 后
 * 
 * 轨迹识别的插件,用于一些基础处理
 * 
 * 参考内容:
 * Technology-手写汉字识别 
 * http://www.linyibin.cn/2016/11/10/technology-IME-HandWritingRecognization/
 *  
 * 
*/

var ww = ww || {} ;
ww.track =  ww.track||{};
;(function () { 
    var MAXFLOAT = Infinity
    var MAX_DIFF_PER_STROKE = 35

    /**
     * 
     * @param {Point} lastPoint  
     * @param {Point} startPoint 
     */
    function dir(lastPoint, startPoint) {
        var result = Math.atan2(startPoint.y - lastPoint.y, startPoint.x - lastPoint.x) * 10;
        return result;
    }


    function xydist(lastPoint, startPoint) {
        var result = Math.abs(startPoint.y - lastPoint.y) + Math.abs(startPoint.x - lastPoint.x);
        return result;
    }

    function distance(lastPoint, startPoint) {
        var y = startPoint.y - lastPoint.y
        var x = startPoint.x - lastPoint.x
        return x * x + y * y
    }

    /**
     * 
     * @param {Character} character 
     */
    function evalXY(character) {
        var tmpPoint;
        var l = []
        var size = characterSize(character)
        var size = size ? 1 / size : 1
        var xy = Centroid(character)
        for (var i = 0; i < character.strokes.length; i++) {
            var stroke = character.strokes[i];
            var l2 = []
            l.push(l2)
            for (var j = 0; j < stroke.length; j++) {
                tmpPoint = stroke[j];
                var x = (tmpPoint.x - xy[0]) * size
                var y = (tmpPoint.y - xy[1]) * size
                var dist = tmpPoint.dist * size
                l2.push({ x: x, y: y, dir: tmpPoint.dir, dist: dist })
            }
        }
        character.reeval = l
        return l
    };

    function Centroid(character) {
        var x = 0.0, y = 0.0;
        var length = 0
        for (var i = 0; i < character.strokes.length; i++) {
            var stroke = character.strokes[i];
            for (var j = 0; j < stroke.length; j++) {
                length++
                tmpPoint = stroke[j];
                x += tmpPoint.x
                y += tmpPoint.y
            }
        }
        if (length) {
            x = x / length
            y = y / length
        }
        return [x, y];
    };



    /**
     * 
     * @param {Character} character 
     */
    function evalDir(character) {
        var lastPoint = 0
        var tmpPoint;
        for (var i = 0; i < character.strokes.length; i++) {
            var stroke = character.strokes[i];
            for (var j = 0; j < stroke.length; j++) {
                tmpPoint = stroke[j];
                tmpPoint.dir = (lastPoint) ? dir(lastPoint, tmpPoint) : 0;
                lastPoint = tmpPoint;
            }
        }
    };

    /**
     * 计算的长度
     * @param {Character} character 
     */
    function evalDist(character) {
        var lastPoint = 0
        var tmpPoint;
        for (var i = 0; i < character.strokes.length; i++) {
            var stroke = character.strokes[i];
            for (var j = 0; j < stroke.length; j++) {
                tmpPoint = stroke[j];
                tmpPoint.dist = lastPoint ? distance(lastPoint, tmpPoint) : 0;
                lastPoint = tmpPoint;
            }
        }
    };



    /**
     * 单个轨迹跨度
     * @param {Stroke} stroke   
     */
    function strokeSize(stroke) {
        var maxx = 0
        var minx = 0
        var maxy = 0
        var miny = 0
        var startpoint = 0
        var maxdist = 0
        var index = -1
        for (var i2 = 0; i2 < stroke.length; i2++) {
            var point = stroke[i2];
            if (point) {
                if (!startpoint) {
                    var maxx = point.x
                    var minx = point.x
                    var maxy = point.y
                    var miny = point.y
                    var startpoint = point
                } else {
                    var dist = xydist(point, startpoint)
                    if (dist > maxdist) {
                        maxdist = dist
                        index = i2
                    }
                    var x = point.x
                    var y = point.y
                    if (x > maxx) { maxx = x } else if (x < minx) { minx = x }
                    if (y > maxy) { maxy = y } else if (y < miny) { miny = y }
                }
            }
        }
        var z = Math.max(maxx - minx, maxy - miny)
        return [z, index]
    }

    /**
     * 全部轨迹跨度
     * @param {Character} character  
     */
    function characterSize(character) {
        var maxx = 0
        var minx = 0
        var maxy = 0
        var miny = 0
        var startpoint = 0
        for (var i = 0; i < character.strokes.length; i++) {
            var stroke = character.strokes[i];
            for (var i2 = 0; i2 < stroke.length; i2++) {
                var point = stroke[i2];
                if (point) {
                    if (!startpoint) {
                        var maxx = point.x
                        var minx = point.x
                        var maxy = point.y
                        var miny = point.y
                        var startpoint = point
                    } else {
                        var x = point.x
                        var y = point.y
                        if (x > maxx) { maxx = x } else if (x < minx) { minx = x }
                        if (y > maxy) { maxy = y } else if (y < miny) { miny = y }
                    }
                }
            }
        }

        var z = Math.max(maxx - minx, maxy - miny)
        return z
    }

    var MaxValue = 1000
    function getMax() {
        return MaxValue
    }

    function setMax(v) {
        return MaxValue = v
    }

    var MaxDirValue = Math.PI / 180 * 20
    function getDirMax() {
        return MaxDirValue
    }

    function setDirMax(v) {
        return MaxDirValue = v
    }


    /**
     *  跳转点
     * @param {Stroke} stroke  
     * @param {[]} points 
     * @param {number} pointIndex1
     * @param {number} pointIndex2 
     * @param {number} size 
     */
    function turnPoints(stroke, points, pointIndex1, pointIndex2, size) {
        if (pointIndex1 < 0 || pointIndex2 <= 0 || pointIndex1 >= pointIndex2 - 1) {
            return;
        }
        var a = stroke[pointIndex2].x - stroke[pointIndex1].x;
        var b = stroke[pointIndex2].y - stroke[pointIndex1].y;
        var c = stroke[pointIndex1].x * stroke[pointIndex2].y - stroke[pointIndex2].x * stroke[pointIndex1].y;
        var max = getMax() * size;
        //var maxDir = getDirMax()
        var maxDistPointIndex = -1;
        for (var i = pointIndex1 + 1; i < pointIndex2; i++) {
            var point = stroke[i];
            var dist = Math.abs((a * point.y) - (b * point.x) + c);
            //var dir = Math.abs(Math.atan2(a, b) - Math.atan2(point.x - stroke[pointIndex1].x, point.y - stroke[pointIndex1].y))
            //td:: cout << dist << std:: endl;

            if (dist > max) {
                max = dist;
                maxDistPointIndex = i;
            }
            //if (dir > maxDir) {maxDir = dir ;maxDistPointIndex = i; }
        }
        if (maxDistPointIndex != -1) {
            turnPoints(stroke, points, pointIndex1, maxDistPointIndex, size);
            points.push(stroke[maxDistPointIndex]);
            turnPoints(stroke, points, maxDistPointIndex, pointIndex2, size);
        }
    }


    /**
     *  获取跳转点
     * @param {Character} character 
     */
    function getTurnPoints(character) {
        var c = new Character()
        var size = characterSize(character)
        for (var i = 0; i < character.strokes.length; i++) {
            var stroke = character.strokes[i];
            //获取结果缓存
            if (character.evals[i]) {
                c.strokes.push(character.evals[i]);
            } else if (stroke.length > 1) {
                var stroke2 = [];
                c.strokes.push(stroke2);
                var size = strokeSize(stroke)
                var index = size[1]
                var size = (size[0] * size[0]) * 0.0001

                stroke2.push(stroke[0]);
                if (index > 0 && index != stroke2.length - 1) {
                    turnPoints(stroke, stroke2, 0, index, size);
                    stroke2.push(stroke[index]);
                } else {
                    index = 0
                }
                turnPoints(stroke, stroke2, index, stroke.length - 1, size);
                stroke2.push(stroke[stroke.length - 1]);

                character.evals[i] = stroke2
            }
        }
        c.eval = c 
        //console.log(charccter);
        return c
    }


    function evalCharacter(character) {

        if (!character.eval) {
            character.eval = getTurnPoints(character)
            evalDir(character.eval)
            evalDist(character.eval)
            evalXY(character.eval) 
            character.reeval = character.eval.reeval
        }
        return character.eval
    }

    /**
     * 
     * @param {Stroke} stroke1 
     * @param {Stroke} stroke2 
     */
    function distBetweenStrokes(stroke1, stroke2) {
        var strokeDist = MAXFLOAT;
        var dist = 0// 0.0f;
        var minLength = Math.min(stroke1.length, stroke2.length);
        var largeStroke = stroke1.length > minLength ? stroke1 : stroke2;
        var smallStroke = stroke1.length > minLength ? stroke2 : stroke1;
        for (var j = 1; j < minLength; j++) {
            var diretion1 = largeStroke[j].dir;
            var diretion2 = smallStroke[j].dir;

            dist += Math.abs(diretion1 - diretion2);
        }
        // 当前笔与上一笔的largeStroke位置
        dist += Math.abs(largeStroke[0].dir - smallStroke[0].dir);
        strokeDist = dist / minLength;
        //std:: cout << strokeDist << std:: endl;
        return strokeDist;
    }


    var allMax = 0, allMin = MAXFLOAT;
    /**
     *  
     * @param {Character} c1  
     * @param {Character} c2 
     */
    function chardist(c1, c2) {
        var character1 = evalCharacter(c1)
        var character2 = evalCharacter(c2)
        console.log(c1, c2)
        var dist = MAXFLOAT;
        if (character2.reeval.length >= character1.reeval.length && character2.reeval.length <= character1.reeval.length + 2) {
            var allStrokeDist = 0.0;
            for (var i = 0; i < character1.reeval.length; i++) {
                var stroke1 = character1.reeval[i];
                var stroke2 = character2.reeval[i];
                var strokeDist = distBetweenStrokes(stroke1, stroke2);

                /*  //笔画距离  > 全部最大
                  if (strokeDist > allMax) {
                      allMax = strokeDist;
                  }
                  if (strokeDist < allMin) {
                      allMin = strokeDist;
                  }
  */
                allStrokeDist += strokeDist;

                /*if (strokeDist > MAX_DIFF_PER_STROKE) {
                    allStrokeDist = MAXFLOAT;
                    return allStrokeDist;
                }*/
            }
            // 笔画更接近的优先级更高
            return allStrokeDist // / character1.strokes.length + character2.strokes.length - character1.strokes.length;
        }
        return dist;
    }




    function Character() {
        this.lastStrokeId = -1; 
        this.strokes = []
        this.evals = []
        this.clear();
    };


    Character.prototype.clear = function () {

        this.lastStrokeId = -1;
        //this.width = DEAFULT_WIDTH;
        //this.height = DEAFULT_HEIGHT;
        this.strokes.length = 0;
        this.eval = false
        this.evals = []
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

            var stroke = [];
            this.strokes.push(stroke);
        }
        var x = x || 0 //this.posX(x) //x / this.width * DEAFULT_WIDTH;
        var y = y || 0//this.posX(y)//y / this.height * DEAFULT_HEIGHT; 
        var id = this.strokes.length - 1
        this.strokes[id].push({ x: x, y: y });
        this.evals[id] = false
        this.eval = false
        this.reeval = false
        return this
    };

    Character.prototype.setDirectionList = function (list) {
        this.clear() 
        for (var i = 0; i < list.length; i++) {
            var l2 = list[i]
            if (l2) {
                var stroke = [];
                this.strokes.push(stroke);
                for (var i2 = 0; i2 < l2.length; i2++) {
                    stroke.push({ dir: l2[i2] });
                }
                this.evals[this.strokes.length - 1] = stroke
            }
        }
        this.eval = this
        return this
    }


    Character.prototype.pointCloud = function () {
        var l = []
        for (var i = 0; i < this.strokes.length; i++) {
            var stroke = this.strokes[i];
            for (var i2 = 0; i2 < stroke.length; i2++) {
                var point = stroke[i2];
                if (point) {
                    l.push(new pdollarplus.Point(point.x, point.y, i))
                }
            }
        }
        return l
    }

    Character.prototype.setPointList = function (list) {
        this.clear()
        for (var i = 0; i < list.length; i++) {
            var l2 = list[i]
            if (l2) {
                var stroke = [];
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
                        var x = x || 0 //this.posX(x) //x / this.width * DEAFULT_WIDTH;
                        var y = y || 0 //this.posX(y) // y / this.height * DEAFULT_HEIGHT;
                        stroke.push({ x: x, y: y });
                    }
                }
            }
        }
        this.eval = false
        this.reeval = false
        return this
    }



    Character.prototype.posY = function (y) {
        return y//  y / this.height * DEAFULT_HEIGHT;

    }
    Character.prototype.posX = function (x) {
        return x// x / this.width * DEAFULT_WIDTH;

    }

    Character.prototype.clone = function () {
        var c = formPoints(this.strokes)
        return c
    }

    Character.prototype.geteval = function () {
        return evalCharacter(this)
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

     
    ww.track.eval=evalCharacter;
    ww.track.char=Character;
    ww.track.chardist=chardist;
    ww.track.formPoints=formPoints;
    ww.track.formDirs=formDirs;
    ww.track.setMax=setMax;
    ww.track.getMax=getMax;
   
})();

/**轨迹录入处理(废弃) */
;(function () { 
    ww.track._list = []
    ww.track.addTrack = function (name, character) {
        this._list.push(name, character.clone())
    }
    ww.track.getTrack = function (character) {
        for (var i = 0; i < this._list.length; i += 2) {
            var n = this._list[i]
            var c = this._list[i + 1]
            var d = this.chardist(c, character)
        }
    }
    ww.track.loadTrack = function (all) {
        if (!all) { return }
        for (var i = 0; i < all.length; i++) // for each point-cloud template
        {
            var sts = all[i]
            var name = sts[0]
            var l = []
            for (var i2 = 1; i2 < sts.length; i2++) {
                var l1 = sts[i2]
                l.push(l2)
                var l2 = []
                for (var i3 = 0; i3 < l1.length; i3 += 2) {
                    l2.push([l1[i3], l1[i3 + 1]])
                }
            }
            var c = this.formPoints(l)
            this.addTrack(name, c)
        }
    }
})(); 


/**轨迹录入识别处理 */
;(function () { 
    ww.track._list = []
    ww.track.addTrack = function () { }
    ww.track.getTrack = function () { }
    ww.track.loadTrack = function () { }



    ww.track.pdollar = new pdollarplus.PDollarPlusRecognizer() 
    ww.track._nodraw = new pdollarplus.Result("没有输入", -1, 0)
 


    /**设置添加 */
    ww.track.setAdd = function (name) {
        this._addname = name
        this._addResult = new pdollarplus.Result(name, -2, 0)
    }

    /**设置获取 */
    ww.track.setGet = function (name) {
        this.setAdd()
        this._getname = name
    }

    /**进行轨迹处理 */
    ww.track.doPdollar = function (character) {
        if (!character) { return ww.track._nodraw }
        if (this._addname) {
            return this.addPdollar(character)
        } else {
            return this.getPdollar(character)
        }
    }

    /**添加轨迹 */
    ww.track.addPdollar = function (character, name) {
        if (!character) { return ww.track._nodraw }
        var name = name || this._addname
        if (name) {
            if (!ww.track.nouseEval) {
                var character = character.geteval()
            }
            this.addTrack(name, character)
            console.log(this.pdollar.Recognize(character.pointCloud()))
            this.pdollar.AddGesture(name, character.pointCloud())
            return this._addResult
        } else {
            return this.getPdollar(character, name)
        }
    }

    /**获取轨迹 */
    ww.track.getPdollar = function (character, name) {
        if (!character) { return ww.track._nodraw }
        var name = name || this._getname
        if (!ww.track.nouseEval) {
            var character = character.geteval()
        }
        this.getTrack(character)
        var re = this.pdollar.Recognize(character.pointCloud(), name)
        return re
    }


    /**清空所有轨迹 */
    ww.track.clearPdollar = function () {
        this._list = []
        return this.pdollar.DeleteUserGestures()
    }
    /**删除上一个记录的轨迹 */
    ww.track.popPdollar = function () {
        this._list.pop()
        this.pdollar.PointClouds.pop()
    }

    ww.track.PointCloudsSave = function (pdollar) {
        var all = []
        for (var i = 0; i < pdollar.PointClouds.length; i++) // for each point-cloud template
        {

            var points = pdollar.PointClouds[i].PointCloud
            var name =  pdollar.PointClouds[i].Name
            var l = [name]
            var id = -Infinity
            for (var i2 = 0; i2 < points.length; i2++) {
                var p = points[i2]
                var x = p.X
                var y = p.Y
                if (id != p.ID || i2 == 0) {
                    id = p.ID
                    var l2 = []
                    l.push(l2)
                }
                l2.push(x, y)
            }
            all.push(l)
        }
        return all
    }

    ww.track.PointCloudsLoad = function (pdollar, all) {
        if (!all) { return }
        for (var i = 0; i < all.length; i++) // for each point-cloud template
        {
            var sts = all[i]
            var name = sts[0]
            var l = []
            for (var i2 = 1; i2 < sts.length; i2++) {
                var l1 = sts[i2]
                for (var i3 = 0; i3 < l1.length; i3 += 2) {
                    l.push(new pdollarplus.Point(l1[i3], l1[i3 + 1], i2))
                }
            }
            pdollar.AddGesture(name, l)
        }
    }

    /**读取 */
    ww.track.load = function (a) {
        this.loadTrack(a)
        return this.PointCloudsLoad(this.pdollar, a)
    }

    /**保存 */
    ww.track.save = function () {
        if (Utils.isNwjs()) {
            var data = "ww.track.load(" + JSON.stringify(this.PointCloudsSave(this.pdollar)) + ");"
            var fs = require('fs');
            var path = require('path');
            var base = path.dirname(process.mainModule.filename);
            var dirPath = path.join(base, 'js/plugins/');
            var filePath = dirPath + "simpleHandwriting.js";
            if (!fs.existsSync(dirPath)) {
                //fs 建立目录(目录路径)
                fs.mkdirSync(dirPath);
            }
            //fs 写入文件(文件路径, 数据 )
            fs.writeFileSync(filePath, data);
        };
    }



    /**当获得结果 */
    ww.track.onEnd = function (re) {
        if (re) {
            this._reName = re.Name
            this._reScore = re.Score
        } else {
            this._reName = ""
            this._reScore = -1
        }
        return this._reName
    }


})();

