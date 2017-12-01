//=============================================================================
// onLadder.js
//=============================================================================
/*:
 * @plugindesc 
 * onLadder,在梯子上
 * @author wangwang
 * 
 * @param  onLadder 
 * @desc 插件 在梯子上 ,作者:汪汪
 * @default  汪汪, 
 *  
 * @help 
 *  .ladderset(梯子种类,移动种类 )
 * 梯子种类: 0 上了梯子就修改行走图 , 1 上了梯子且之前是梯子时修改行走图
 * 移动种类: 梯子上 0 只显示8方向 , 1 显示28方向, 3 显示4 方向
 *  .ladderImg(行走图名称,索引)
 * 举例:
 * $gamePlayer.ladderset(0,0)
 * $gamePlayer.ladderImg($gamePlayer._characterName ,$gamePlayer._characterIndex +1 )
 * 
 * 
 * 
 */



Game_CharacterBase.prototype.increaseSteps = function() {
    this.ladderSet()
        //重设停止计数()
    this.resetStopCount();
    //刷新灌木丛深度()
    this.refreshBushDepth();
};


/**设置 */
Game_CharacterBase.prototype.ladderset = function(laddertype, movetype) {
    this._ladderType = laddertype || 0
    this._ladderMove = movetype || 0
}



/**设置图像 */
Game_CharacterBase.prototype.ladderImg = function(characterName, characterIndex) {
    this._ladderName = characterName;
    //行走图索引 = characterName//行走图索引
    this._ladderIndex = characterIndex;
    if (characterName) {
        this._laddering = this._laddering || 1
    } else {
        this.noladderUse()
        this._laddering = 0
    }
}

Game_CharacterBase.prototype.ladderUse = function() {
    if (this._laddering == 1) {
        this.noladderSave()
        this.setImage(this._ladderName, this._ladderIndex)
        this._laddering = 2
    }
}

Game_CharacterBase.prototype.noladderUse = function() {
    if (this._laddering == 2) {
        this.setImage(this._noladderName, this._noladderIndex)
        this._laddering = 1
    }
}


Game_CharacterBase.prototype.noladderSave = function() {
    this._noladderName = this._characterName;
    this._noladderIndex = this._characterIndex;
}


Game_CharacterBase.prototype.ladderSet = function() {
    if (!this._ladderType) {
        if (this.isOnLadder()) {
            this.ladderUse()
        } else {
            this.noladderUse()
        }
    } else {
        if (this.isOnLadder() && this.oldOnLoadder()) {
            this.ladderUse()
        } else {
            this.noladderUse()
        }
    }


    if (!this._ladderMove) {
        if (this.isOnLadder()) {
            //设置方向(8)
            this.setDirection(8);
        }
    } else if (this._ladderMove == 1) {
        if (this.isOnLadder()) {
            if (this._realX > this._x) {
                this.setDirection(8);
            } else {
                this.setDirection(2);
            }
        }

    } else {

    }
    /*
     //如果需要在梯子上移动 朝向为两面的 的请上面那个注释掉用这个 
     //如果不想锁定朝向 ,两个都注释掉 
    if (this.isOnLadder()) {
        if (this._realX > this._x) {
            this.setDirection(8);
        } else {
            this.setDirection(2);
        }
    }
    */
}






Game_CharacterBase.prototype.oldOnLoadder = function() {
    var rx = $gameMap.roundX(this._realX)
    var ry = $gameMap.roundY(this._realY)
    return $gameMap.isLadder(rx, ry)
};



Game_CharacterBase.prototype.oldOnLoadder = function() {

    var rx = $gameMap.roundX(this._realX)
    var ry = $gameMap.roundY(this._realY)
    return $gameMap.isLadder(rx, ry)
};