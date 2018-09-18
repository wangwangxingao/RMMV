//=============================================================================
// PictureTest.js
//=============================================================================
/*:
 * @plugindesc 
 * PictureTest,图片测试
 * @author wangwang
 * 
 * @param  PictureTest 
 * @desc 插件 图片测试 ,作者:汪汪
 * @default  汪汪,dat_gui
 * 
 * 
 * @help
 * pictureId:图片编号
 * move:是否捕捉
 * 
 *  
 * 
 */


if (dat) {
    if (!gui) {
        var gui = new dat.GUI()
    }
}



//(function() {

var wwtest = wwtest || {}

wwtest.picture = {
    pictureId: 0,
    move: false,
    x: 0,
    y: 0,
    tx: 0,
    ty: 0
}

wwtest.picture.init = function() {
    this.show = function() {
        if ($gameScreen) {
            $gameScreen.movePicture2(this.pictureId, this.x, this.y)
        }
    }

    this.load = function() {
        if ($gameScreen) {
            var picture = $gameScreen.picture(this.pictureId);
            if (picture) {
                this.tx = this.x = picture._x
                this.ty = this.y = picture._y
                this.move = true
            }
        }
    }

    this._folder = gui.addFolder("图片移动")
    this._pictureId = this._folder.add(this, "pictureId", 0, 100, 1)
    this._pictureId.onChange(function() {
        wwtest.picture.load()
    });

    this._pictureId.onFinishChange(function() {
        wwtest.picture.load()
    });

    this._move = this._folder.add(this, "move")
    this._move.listen()

    this._x = this._folder.add(this, 'x');
    this._y = this._folder.add(this, 'y');

    this._x.listen()
    this._y.listen()

    this._tofolder = this._folder.addFolder("移动到")
    this.tomove = function() {
        this.x = this.tx
        this.y = this.ty
        this.show()
    }
    this._tomove = this._tofolder.add(this, 'tomove');
    this._tx = this._tofolder.add(this, 'tx');
    this._ty = this._tofolder.add(this, 'ty');

}

wwtest.picture.init()

Scene_Map.prototype.processMapTouch = function() {
    //如果( 触摸输入 是刚按下() 或者 触摸计数 >0) 
    if (TouchInput.isTriggered() || this._touchCount > 0) {
        //如果( 触摸输入 是按下() )
        if (TouchInput.isPressed()) {
            //如果 (触摸计数== 0 或者 触摸计数 >= 15)
            if (this._touchCount === 0 || this._touchCount >= 15) {
                if (wwtest.picture.move) {
                    wwtest.picture.x = TouchInput.x
                    wwtest.picture.y = TouchInput.y
                    wwtest.picture.show()
                } else {
                    //x = 游戏地图 画面到地图x (触摸输入 x)
                    var x = $gameMap.canvasToMapX(TouchInput.x);
                    //y = 游戏地图 画面到地图y (触摸输入 y)
                    var y = $gameMap.canvasToMapY(TouchInput.y);
                    //游戏临时 设置目的地 (x,y)
                    $gameTemp.setDestination(x, y);
                }
            }
            //触摸计数 ++
            this._touchCount++;
            //否则
        } else {
            //触摸计数 = 0
            this._touchCount = 0;
        }
    }
};




Scene_Map.prototype.updateCallMenu = function() {
    //如果( 是能够菜单() )
    if (wwtest.picture.move) {
        if (this.isMenuCalled()) {
            wwtest.picture.move = false
            this.menuCalling = false;

        }
    } else {
        if (this.isMenuEnabled()) {
            //如果( 是菜单呼叫后() )
            if (this.isMenuCalled()) {
                //菜单呼叫中 = true
                this.menuCalling = true;
            }
            //如果 (菜单呼叫中  并且 不是 游戏游戏者 是移动中() )
            if (this.menuCalling && !$gamePlayer.isMoving()) {
                //呼叫菜单()
                this.callMenu();
            }
            //否则
        } else {
            //菜单呼叫中 = false
            this.menuCalling = false;
        }
    }
};



Game_Screen.prototype.movePicture2 = function(pictureId, x, y) {
    //图片 = 图片(图片id)
    var picture = this.picture(pictureId);
    //如果 图片 
    if (picture) {
        //图片 移动  (原点,x,y,比例x,比例y,不透明度,混合方式,持续时间)
        picture.move2(x, y);
    }
};



Game_Picture.prototype.move2 = function(x, y) {
    //目标x = x 
    this._targetX = x;
    //目标y = y 
    this._targetY = y;
    //持续时间 = 持续时间
    this._duration = 1;
};
//})()