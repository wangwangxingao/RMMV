//=============================================================================
// Fx8Character.js
//=============================================================================

/*:
 * @plugindesc 八方向行走图
 * @author wangwang
 *   
 * @param Fx8Character
 * @desc 插件 八方向行走图
 * @default 汪汪
 *   
 * @param Fx8
 * @desc 文件名包含有 xx 的字符串
 * @default 8fx
 * 
 * @param Switche
 * @desc 控制 8方向的开关 , "true" ,"false" 或 游戏开关id 
 * @default true
 * 
 * @help 
 * 参数 Switche 为 true 或者对应的游戏开关为true 时开启 8方向行走
 * 此效果没有特殊8方向行走图也可使用
 * 
 * 特殊8方向行走图
 * 行走图文件名包含有 参数 Fx8 对应的字符串 且 行走图索引< 4(两排中上面的那排)
 * 即可使用下面那排作为其他方向的行走图,
 * 对应如下
 * =============================
 * 2 下
 * 4 左
 * 6 右
 * 8 上
 * 1 左下    下 2 (4,2)
 * 7 左上    左 4 (4,8)
 * 3 右下    右 6 (6,2)
 * 9 右上    上 8 (6,8)
 * =============================
 * 
 * 
 */
ImageManager.is8fxCharacter = function (characterName, characterIndex) {
    if (this._8fx) {
        if (this._8fx === true) {
            return true
        }
        if (characterName.indexOf(this._8fx) >= 0 && characterIndex < 4) {
            return true
        }
    } else if (this._8fx === false) {
        return false
    } else {
        this._load_8fx()
        this.is8fxCharacter(characterName, characterIndex)
    }
    return false
};

ImageManager.use8fx = function () {
    if (this._use8fx) {
        if (this._use8fx === true) {
            return true
        }
        return $gameSwitches.value(this._use8fx)
    } else if (this._use8fx === false) {
        return false
    } else {
        this._load_8fx()
        return this.use8fx()
    }
    return true
};

ImageManager._load_8fx = function () { 
    var psl = PluginManager._parameters
    for (var key in psl) {
        var ps = psl[key]
        if ('Fx8Character' in ps) {
            this._8fx = ps["Fx8"] || true
            var use = ps["Switche"]
            if (use === "true") {
                this._use8fx = true
            } else {
                if (isNaN(use * 1)) {
                    this._use8fx = false
                } else {
                    this._use8fx = use * 1 || false
                }
            }
            return true 
        }
    }
    this._8fx = false
    this._use8fx = false
    return false 
}

/**
调整寻路计算..
Game_Map.prototype.distance = function(x1, y1, x2, y2) { 
    if( ImageManager.use8fx()){ var x = this.deltaX(x1, x2)  ; var y =   this.deltaY(y1, y2)  ;   return Math.sqrt(x *x + y*y) }
    return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
};
*/

Game_CharacterBase.prototype.setImage = function (characterName, characterIndex) {
    //图块id = 0
    this._tileId = 0;
    //行走图名称 = characterName//行走图名称
    this._characterName = characterName;
    //行走图索引 = characterName//行走图索引
    this._characterIndex = characterIndex;
    //是物体特征 = 图像管理器 是物体特征(行走图名称)
    this._isObjectCharacter = ImageManager.isObjectCharacter(characterName);
    this._is8fxCharacter = ImageManager.is8fxCharacter(characterName, characterIndex);
};

Game_CharacterBase.prototype.moveDiagonally = function (horz, vert) {
    //设置移动成功( 能通过对角(x,y,水平,垂直)  )
    this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
    //如果( 是移动成功的() )
    if (this.isMovementSucceeded()) {
        //x = 游戏地图 环x和方向(x,水平)
        this._x = $gameMap.roundXWithDirection(this._x, horz);
        //y = 游戏地图 环y和方向(y,垂直)
        this._y = $gameMap.roundYWithDirection(this._y, vert);
        //真x = 游戏地图 x和方向(x, 相反方向(水平)  )
        this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
        //真y = 游戏地图 y和方向(y, 相反方向(垂直)  )
        this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
        //增加步数()
        this.increaseSteps();
    }
    if (ImageManager.use8fx() && this.is8fxCharacter()) {
        var d = 0
        var x = (horz === 6 ? 1 : horz === 4 ? -1 : 0)
        var y = (vert === 2 ? 1 : vert === 8 ? -1 : 0)
        if (x !== 0 || y !== 0) {
            var d = 5 - y * 3 + x;
        }
        this.setDirection(d);
        return
    }
    //如果(方向 === 相反方向(水平) )
    if (this._direction === this.reverseDir(horz)) {
        //设置方向(水平)
        this.setDirection(horz);
    }
    //如果(方向 === 相反方向(垂直) )
    if (this._direction === this.reverseDir(vert)) {
        //设置方向(垂直)
        this.setDirection(vert);
    }
};



Game_CharacterBase.prototype.is8fxing = function () {
    return ImageManager.use8fx() && this.is8fxCharacter() && (this.direction() % 2)
};


Game_CharacterBase.prototype.is8fxCharacter = function () {
    return this._is8fxCharacter
};

//寻找方向到
Game_Character.prototype.findDirectionTo = function (goalX, goalY) {
    //搜寻限制 = 搜寻限制()
    var searchLimit = this.searchLimit();
    //地图宽 = 游戏地图 宽()
    var mapWidth = $gameMap.width();
    //节点列表 = []
    var nodeList = [];
    //打开列表 = []
    var openList = [];
    //关闭列表 = []
    var closedList = [];
    //开始 = {}
    var start = {};
    //最好 = 开始
    var best = start;
    //如果(x == 目标x 并且 y == 目标y)
    if (this.x === goalX && this.y === goalY) {
        //返回 0
        return 0;
    }

    //开始 父亲 = null
    start.parent = null;
    //开始 x = x
    start.x = this.x;
    //开始 y = y
    start.y = this.y;
    //开始 g = 0
    start.g = 0;
    //开始 f = 游戏地图 距离(开始 x ,开始 y , 目标x ,目标y)
    start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
    //节点列表 添加(开始)
    nodeList.push(start);
    //打开列表 添加(开始 y * 地图宽 + 开始 x)
    openList.push(start.y * mapWidth + start.x);

    //当(节点列表 长度 > 0)
    while (nodeList.length > 0) {
        //最好索引 = 0
        var bestIndex = 0;
        //循环(开始时 i = 0 ;当 i < 节点列表 长度 ; 每一次 i++)
        for (var i = 0; i < nodeList.length; i++) {
            //如果(节点列表[i] f < 节点列表[最好索引] f)
            if (nodeList[i].f < nodeList[bestIndex].f) {
                //最好索引 = i
                bestIndex = i;
            }
        }
        //当前 = 节点列表[最好索引]
        var current = nodeList[bestIndex];
        //x1 = 当前 x
        var x1 = current.x;
        //y1 = 当前 y
        var y1 = current.y;
        //位置1 = y1 * 地图宽 + x1
        var pos1 = y1 * mapWidth + x1;
        //g1 = 当前 g
        var g1 = current.g;

        //节点列表 剪切(最好索引 ,1)
        nodeList.splice(bestIndex, 1);
        //打开列表 剪切(打开列表 索引于(位置1) ,1)
        openList.splice(openList.indexOf(pos1), 1);
        //关闭列表 添加(位置1)
        closedList.push(pos1);

        //如果(当前 x == 目标x 并且 当前 y == 目标y)
        if (current.x === goalX && current.y === goalY) {
            //最好 = 当前
            best = current;
            //达成目标 = true  2w:这个可以去掉吧
            goaled = true;
            //中断
            break;
        }

        //如果( g1 >= 搜寻限制 )
        if (g1 >= searchLimit) {
            //下一个
            continue;
        }

        for (var j = 1; j <= 9; j++) {
            if (j == 5) {
                continue
            }
            var direction = j
            if (j % 2) {
                if (!ImageManager.use8fx()) { continue }
                var l = [[0, 0], [4, 2], [2, 2], [6, 2], [4, 4], [0, 0], [6, 6], [4, 8], [8, 8], [6, 8]]
                var hv = l[direction]
                var h = hv[0]
                var v = hv[1]
                //x2 = 游戏地图 环x和方向(x1 ,方向 )
                var x2 = $gameMap.roundXWithDirection(x1, h);
                //y2 = 游戏地图 环y和方向(y1 ,方向 )
                var y2 = $gameMap.roundYWithDirection(y1, v);
                //位置2 = y2 * 地图宽 + x2
                var pos2 = y2 * mapWidth + x2;
                //如果(关闭列表 包含(位置2))
                if (closedList.contains(pos2)) {
                    //下一个
                    continue;
                }
                //如果(不是 能通过(x1,y1,方向))
                if (!this.canPassDiagonally(x1, y1, h, v)) {
                    //下一个
                    continue;
                }
                var g2 = g1 + 1.4 // Math.sqrt(2);
            } else {

                //x2 = 游戏地图 环x和方向(x1 ,方向 )
                var x2 = $gameMap.roundXWithDirection(x1, direction);
                //y2 = 游戏地图 环y和方向(y1 ,方向 )
                var y2 = $gameMap.roundYWithDirection(y1, direction);
                //位置2 = y2 * 地图宽 + x2
                var pos2 = y2 * mapWidth + x2;
                //如果(关闭列表 包含(位置2))
                if (closedList.contains(pos2)) {
                    //下一个
                    continue;
                }
                //如果(不是 能通过(x1,y1,方向))
                if (!this.canPass(x1, y1, direction)) {
                    //下一个
                    continue;
                }
                //g2 = g1 + 1
                var g2 = g1 + 1;
            }



            //索引2 = 打开列表 索引于(位置2)
            var index2 = openList.indexOf(pos2);

            //如果(索引列表 < 0 或者 g2 < 节点列表[索引2] g)
            if (index2 < 0 || g2 < nodeList[index2].g) {
                //邻居
                var neighbor;
                //如果(索引2 >= 0)
                if (index2 >= 0) {
                    //邻居 = 节点列表[索引2]
                    neighbor = nodeList[index2];
                    //否则 
                } else {
                    //邻居 = {}
                    neighbor = {};
                    //节点列表 添加(邻居)
                    nodeList.push(neighbor);
                    //打开列表 添加(位置2)
                    openList.push(pos2);
                }
                //邻居 父亲 = 当前
                neighbor.parent = current;
                //邻居 x = x2
                neighbor.x = x2;
                //邻居 y = y2 
                neighbor.y = y2;
                //邻居 g = g2
                neighbor.g = g2;
                //邻居 f = g2 + 游戏地图 距离(x2,y2,目标x,目标y)
                neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
                //如果(不是 最好 或者 邻居 f - 邻居 g < 最好 f - 最好 g )
                if (!best || neighbor.f - neighbor.g < best.f - best.g) {
                    //最好 = 邻居
                    best = neighbor;
                }
            }
        }
    }
    //节点 = 最好
    var node = best;
    //当(节点 父亲 并且 节点 父亲 !== 开始)
    while (node.parent && node.parent !== start) {
        //节点 = 节点 父亲
        node = node.parent;
    }

    if (ImageManager.use8fx()) {
        //三角x1 = 游戏地图 三角x(节点 x ,开始 x) 
        var deltaX1 = $gameMap.deltaX(node.x, start.x);
        //三角y1 = 游戏地图 三角y(节点 y, 开始 y)
        var deltaY1 = $gameMap.deltaY(node.y, start.y);
        var x = 0
        var y = 0
        if (deltaY1 > 0) {
            y = 1;
        } else if (deltaY1 < 0) {
            y = -1;
        }
        if (deltaX1 < 0) {
            x = -1;
        } else if (deltaX1 > 0) {
            x = 1;
        }
        if (x !== 0 || y !== 0) {
            return 5 - y * 3 + x;
        }
        //三角x2 = 三角x从(目标x)
        var deltaX2 = this.deltaXFrom(goalX);
        //三角y2 = 三角y从(目标y)
        var deltaY2 = this.deltaYFrom(goalY); 

        if (deltaY2 > 0) {
            y = -1;
        } else if (deltaY2 < 0) {
            y = 1;
        }
        if (deltaX2 < 0) {
            x = 1;
        } else if (deltaX2 > 0) {
            x = -1;
        }
        if (x !== 0 || y !== 0) {
            return 5 - y * 3 + x;
        }
        return 0
    } else {
        //三角x1 = 游戏地图 三角x(节点 x ,开始 x) 
        var deltaX1 = $gameMap.deltaX(node.x, start.x);
        //三角y1 = 游戏地图 三角y(节点 y, 开始 y)
        var deltaY1 = $gameMap.deltaY(node.y, start.y);
        //如果(三角y1 > 0)
        if (deltaY1 > 0) {
            //返回 2
            return 2;
            //否则 如果(三角x1 < 0)
        } else if (deltaX1 < 0) {
            //返回 4
            return 4;
            //否则 如果(三角x1 > 0)
        } else if (deltaX1 > 0) {
            return 6;
            //否则 如果(三角y1 < 0)
        } else if (deltaY1 < 0) {
            //返回 8
            return 8;
        }

        //三角x2 = 三角x从(目标x)
        var deltaX2 = this.deltaXFrom(goalX);
        //三角y2 = 三角y从(目标y)
        var deltaY2 = this.deltaYFrom(goalY);
        //如果(数学 绝对值(三角x2) > 数学 绝对值(三角y2) )
        if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
            //返回 三角x2 > 0 ? 返回 4 否则 返回 6 
            return deltaX2 > 0 ? 4 : 6;
            //否则 如果(三角y2 !== 0)
        } else if (deltaY2 !== 0) {
            //返回 三角y2 > 0 ? 返回 4 否则 返回 6 
            return deltaY2 > 0 ? 8 : 2;
        }

        //返回 0
        return 0;
    }
};
Game_Player.prototype.getInputDirection = function () {

    if (ImageManager.use8fx()) {

        return Input.dir8;
    }
    //返回 输入 方向4
    return Input.dir4;
};


Game_Player.prototype.executeMove = function (direction) {
    if (ImageManager.use8fx() && direction % 2) {
        var l = [[0, 0], [4, 2], [2, 2], [6, 2], [4, 4], [0, 0], [6, 6], [4, 8], [8, 8], [6, 8]]
        var hv = l[direction]
        this.moveDiagonally(hv[0], hv[1])
    } else {
        this.moveStraight(direction);
    }
};



//人物块y
Sprite_Character.prototype.characterBlockY = function () {
    if (this._isBigCharacter) {
        return 0;
    } else {
        if (this._character.is8fxing()) {
            return 4;
        }
        var index = this._character.characterIndex();
        return Math.floor(index / 4) * 4;
    }
};


//人物图案y
Sprite_Character.prototype.characterPatternY = function () {
    if (this._character.is8fxing()) {
        var d = this._character.direction()
        var l = [, 0, , 2, , , , 1, , 3]
        return l[d]
    }
    return (this._character.direction() - 2) / 2;
};


Sprite_Character.prototype.patternHeight = function () {
    if (this._tileId > 0) {
        return $gameMap.tileHeight();
    } else if (this._isBigCharacter) {
        if (this._character.is8fxCharacter()) {
            return this.bitmap.height / 8;
        }
        return this.bitmap.height / 4;
    } else {
        return this.bitmap.height / 8;
    }
};
