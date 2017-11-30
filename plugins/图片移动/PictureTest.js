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



(function() {

    wwtest = {
        pictureId: 0,
        move: false,
        x: 0,
        y: 0,
    }

    wwtest.show = function() {
        if ($gameScreen) {
            $gameScreen.movePicture2(this.pictureId, this.x, this.y)
        }
    }
    wwtest.load = function() {
        if ($gameScreen) {
            var picture = $gameScreen.picture(this.pictureId);
            if (picture) {
                this.x = picture._x
                this.y = picture._y
                this.move = true
            }
        }
    }

    wwtest._p = gui.add(wwtest, "pictureId", 0, 100, 1)
    wwtest._p.onChange(function() {
        wwtest.load()
    });
    wwtest._move = gui.add(wwtest, "move")
    wwtest._move.listen()


    wwtest._x = gui.add(wwtest, 'x');
    wwtest._y = gui.add(wwtest, 'y');

    wwtest._x.listen()
    wwtest._y.listen()


    Scene_Map.prototype.processMapTouch = function() {
        //如果( 触摸输入 是刚按下() 或者 触摸计数 >0) 
        if (TouchInput.isTriggered() || this._touchCount > 0) {
            //如果( 触摸输入 是按下() )
            if (TouchInput.isPressed()) {
                //如果 (触摸计数== 0 或者 触摸计数 >= 15)
                if (this._touchCount === 0 || this._touchCount >= 15) {
                    if (wwtest.move) {
                        wwtest.x = TouchInput.x
                        wwtest.y = TouchInput.y
                        wwtest.show()
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
})()