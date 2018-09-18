//=============================================================================
// Game_PinTu.js
//=============================================================================

/*:
 * @plugindesc 拼图
 * @author wangwang
 *   
 * @param Game_PinTu
 * @desc 插件 拼图
 * @default 汪汪
 * 
 * 
 * @help
 * --------------------------
 * p = new Game_PinTu(list)
 * 初始化一个拼图
 * list 数组 如 [2,3,4,5,6,7,8,9,1]
 * 数字为事件id ,
 * 最后一个数字为空格的事件id
 * --------------------------
 * p.hunluan()
 * 打乱次序
 * --------------------------
 * p.re()
 * 回到本次打乱最初次序
 * --------------------------
 * p.re0()
 * 回到完美状态
 * --------------------------
 * p.wancheng()
 * 判断是否完成拼图 返回 true / false
 * --------------------------
 * p.move(d)
 * 空格向d(2,4,6,8)方向移动 ,直接交换两个事件的位置
 * 如果成功返回 ture 否则 false
 * --------------------------
 * p.moveei()
 * 获取空格向d(2,4,6,8)方向移动对应的事件id,没有为0
 * 
 * 
 * */
 

function Game_PinTu() {
    this.initialize.apply(this, arguments);
}

//设置创造者
Game_PinTu.prototype.constructor = Game_PinTu;
 

Game_PinTu.prototype.initialize = function (list, l) {
    this._list = list
    this._kong = list[list.length - 1]
    this._getweizhi()
    this.hunluan()
}

Game_PinTu.prototype._getweizhi = function () {
    this._poslist = [] 
    for (var i = 0; i < this._list.length; i++) {
        var id = this._list[i]
        var e = $gameMap.event(id)
        this._poslist.push([e.x, e.y])
    }
}

Game_PinTu.prototype.hunluan = function () { 
    this._poslist2 = this._getKeJiePingTu(this._list.length)
    for (var i = 0; i < this._list.length; i++) {
        var id = this._list[i]
        var e = $gameMap.event(id) 
        var pi = this._poslist2[i] 
        var pos = this._poslist[pi] 
        e.setPosition(pos[0], pos[1])
    }
}

Game_PinTu.prototype.wancheng = function () {
    for (var i = 0; i < this._list.length; i++) {
        var id = this._list[i]
        var e = $gameMap.event(id)
        var pos = this._poslist[i]
        if (e.x != pos[0] || e.y != pos[1]) {
            return false
        }
    }
    return true
}

Game_PinTu.prototype.move = function (d) {
    var kong = $gameMap.event(this._kong)
    var ei = this.moveei(d)
    if (ei) {
        kong.swap($gameMap.event(ei))
        return true
    } else {
        return false
    }
}
Game_PinTu.prototype.moveei = function (d) {
    var nd = d // 10 - d
    var kong = $gameMap.event(this._kong)
    var dx = $gameMap.roundXWithDirection(kong.x, nd)
    var dy = $gameMap.roundYWithDirection(kong.y, nd)
    for (var i = 0; i < this._list.length; i++) {
        var id = this._list[i]
        var e = $gameMap.event(id)
        if (e.x == dx && e.y == dy) {
            return id
        }
    }
    return 0
}



Game_PinTu.prototype.re = function () {
    for (var i = 0; i < this._list.length; i++) {
        var id = this._list[i]
        var e = $gameMap.event(id)
        var pi = this._poslist2[i]
        var pos = this._poslist[pi]
        e.setPosition(pos[0], pos[1])
    }
}
Game_PinTu.prototype.re0 = function () {
    for (var i = 0; i < this._list.length; i++) {
        var id = this._list[i]
        var e = $gameMap.event(id)
        var pos = this._poslist[i]
        e.setPosition(pos[0], pos[1])
    }
}

Game_PinTu.prototype._getKeJiePingTu = function (length) {
    var data = [];
    var maxnumber = length - 1;
    for (var i = 0; i < maxnumber; ++i) {
        data[i] = i;
    }
    for (var i = data.length - 1; i >= 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var itemAtIndex = data[randomIndex];
        data[randomIndex] = data[i];
        data[i] = itemAtIndex;
    } 
    data[maxnumber] = maxnumber;
    //计算逆序对数
    var coverPairCount = 0;
    for (var i = 0; i < maxnumber; ++i) {
        for (var j = i + 1; j < maxnumber; ++j) {
            if (data[i] > data[j])
                coverPairCount++;
        }
    }
    if ((coverPairCount & 1) == 1) {
        var t = data[maxnumber - 1];
        data[maxnumber - 1] = data[maxnumber - 2];
        data[maxnumber - 2] = t;
    }
    return data;
}  