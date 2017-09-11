//-----------------------------------------------------------------------------
// Sprite_FloatBatter 
// 浮动战斗精灵
// The sprite class with a feature which displays animations.
// 显示一个动画特征的精灵类

function Sprite_FloatBatter() {
    this.initialize.apply(this, arguments);
}
//设置原形 
Sprite_FloatBatter.prototype = Object.create(Sprite.prototype);
//设置创造者
Sprite_FloatBatter.prototype.constructor = Sprite_FloatBatter;
//初始化
Sprite_FloatBatter.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._hiding = false;
    this._sp = { "x": 0, "y": 0 }
    this._tp = { "x": 0, "y": 0 }
    this._hideing = false
    this._showing = false
    this._count = 0
    this._ecount = 255
};

Sprite_FloatBatter.prototype.setBattler = function(b) {
        //z   0 为角色 1 为敌人
        var z = 0
            //如果 不是 角色 
        if (!b.isActor()) {
            //z 设为 1 
            z = 1
        }


        var n = ""
            //获得角色战斗名称(原始的)
        n = b.battlerName()
            //这里是用来测试的.....
        n = "Actor1_3"
            //
        this.setBitmap(n, z)
    }
    //设置图片
Sprite_FloatBatter.prototype.setBitmap = function(n, z, h) {
        var bitmap
        var z = z || 0
        if (z == 1) {
            bitmap = ImageManager.loadFloatEnemies(n, h)
        } else {
            bitmap = ImageManager.loadFloatActors(n, h)
        }
        var a = this
        bitmap.addLoadListener(
            function() {
                if (z == 1) {
                    //敌人 图片初始位置 为 场景宽 ,  100 
                    a.setsp(SceneManager._screenWidth, 100)
                        //敌人 图片移动到位置  场景宽 - 图片宽 , 100
                    a.settp(SceneManager._screenWidth - bitmap.width, 100)
                        //移动到开始点
                    a.movesp()
                } else {
                    //角色 图片初始位置 为 - 图片宽 ,  100 
                    a.setsp(-bitmap.width, 100)
                        //角色 图片移动到位置 0 , 100
                    a.settp(0, 100)
                        //移动到开始点
                    a.movesp()

                }

            }
        );
        this.bitmap = bitmap
    }
    //读取角色文件夹 
ImageManager.loadFloatActors = function(filename, hue) {
    return this.loadBitmap('img/FloatActors/', filename, hue, false);
};
//读取敌人文件夹 

ImageManager.loadFloatEnemies = function(filename, hue) {
    return this.loadBitmap('img/FloatEnemies/', filename, hue, true);
};


Sprite_FloatBatter.prototype.setUnit = function(i) {
    this._unit = i
};

//设置开始位置
Sprite_FloatBatter.prototype.setsp = function(x, y) {
    var x = x || 0
    var y = y || 0
    this._sp = { "x": x, "y": y }
};
//设置结束位置
Sprite_FloatBatter.prototype.settp = function(x, y) {
    var x = x || 0
    var y = y || 0
    this._tp = { "x": x, "y": y }
};

//设置结束计数 (越小越快但要大于0)
Sprite_FloatBatter.prototype.setec = function(x) {
    var x = x || 0
    this._ecount = x
};
Sprite_FloatBatter.prototype.setc = function(x) {
    var x = x || 0
    this._count = x
};

Sprite_FloatBatter.prototype.movesp = function() {
    this.x = this._sp.x
    this.y = this._sp.y
    this.opacity = 0

    this.setc(0)
    return true;
}
Sprite_FloatBatter.prototype.movetp = function() {
    this.x = this._tp.x
    this.y = this._tp.y
    this.opacity = 255

    this.setc(this._ecount)
    return true;
}

Sprite_FloatBatter.prototype.hide2 = function() {
    this._showing = false;
    this._hideing = true;
}

Sprite_FloatBatter.prototype.show2 = function() {
    this._showing = true;
    this._hideing = false;
    this.show()
};


Sprite_FloatBatter.prototype.updateVisibility2 = function() {
    if (this._hideing) {
        if (this._count > 0) {
            var d = this._count
            this.x = (this.x * (d - 1) + this._sp.x) / d
            this.y = (this.y * (d - 1) + this._sp.y) / d
            this.opacity = (this.opacity * (d - 1) + 0) / d
            this._count--
        } else if (this._count == 0) {
            this.hide()
            this.x = this._sp.x
            this.y = this._sp.y
            this._count--
        }
    }
    if (this._showing) {
        if (this._count < this._ecount) {
            var d = this._ecount - this._count
            this.x = (this.x * (d - 1) + this._tp.x) / d
            this.y = (this.y * (d - 1) + this._tp.y) / d
            this.opacity = (this.opacity * (d - 1) + 255) / d
            this._count++
        } else if (this._count == this._ecount) {
            this.x = this._tp.x
            this.y = this._tp.y
            this._count++
        }
    }
};

//更新
Sprite_FloatBatter.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateVisibility();
    this.updateVisibility2() //处理浮动
    this.updateUnit() //看是否需要新的浮动
};
//隐藏
Sprite_FloatBatter.prototype.hide = function() {
    this._hiding = true;
    this.updateVisibility();
};
//显示
Sprite_FloatBatter.prototype.show = function() {
    this._hiding = false;
    this.updateVisibility();
};

//更新可见度
Sprite_FloatBatter.prototype.updateVisibility = function() {
    this.visible = !this._hiding;
};

Sprite_FloatBatter.prototype.updateUnit = function() {
    //当设置小组时
    if (this._unit) {
        // 如果 小组 有浮出标志
        if (this._unit._float) {
            //关闭 标志
            this._unit._float = false
                //如果 有设置浮出对象 (是一个对象而不是 null )
            if (this._unit._floatBatter) {
                //设置战斗者
                this.setBattler(this._unit._floatBatter)
                    //显示2
                this.show2()
            } else {
                //隐藏2
                this.hide2()
            }
        }
    }
};
//小组选择时
Game_Unit.prototype.select0 = Game_Unit.prototype.select
Game_Unit.prototype.select = function(activeMember) {
    this.select0(activeMember)
        //添加浮出标记
    this._float = true
        //设置浮出对象 
    this._floatBatter = activeMember

};

BattleManager.changeActor0 = BattleManager.changeActor
    //战斗管理器 改变角色时
BattleManager.changeActor = function(newActorIndex, lastActorActionState) {
    this.changeActor0(newActorIndex, lastActorActionState)
    var newActor = this.actor();
    //角色的队伍 添加浮出标记
    $gameParty._float = true
        //角色的队伍 设置浮出对象
    $gameParty._floatBatter = newActor
};



Spriteset_Battle.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createBackground();
    this.createBattleField();
    this.createBattleback();
    this.createEnemies();
    this.createActors();
    //创建浮出战斗者
    this.createFloatBatter()
};

Spriteset_Battle.prototype.createFloatBatter = function() {
    //设置 浮出角色
    this._floatActors = new Sprite_FloatBatter()
    this._floatActors.setUnit($gameParty)
    this._floatActors.hide()
    this.addChild(this._floatActors)
        //设置 浮出敌人
    this._floatEnemies = new Sprite_FloatBatter()
    this._floatEnemies.setUnit($gameTroop)
    this.addChild(this._floatEnemies)
    this._floatEnemies.hide()


};