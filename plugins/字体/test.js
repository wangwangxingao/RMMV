(function () {

    //Graphics._cssFontLoading  = false

    Graphics.fonts = ["SimHei", "Heiti TC", "sans-serif", "宋体", "黑体", "楷体", 'GameFont',]


    /**游戏字体加载完成 
     * @return {boolean}
    */
    Scene_Boot.prototype.isGameFontLoaded = function () {

        for (var i = 0; i < Graphics.fonts.length; i++) {
            if (Graphics.isFontLoaded(Graphics.fonts[i])) {
                console.log(Graphics.fonts[i])
                return true
            }
        }
        //如果 (图形 'GameFont' 字体加载完成)
        if (Graphics.isFontLoaded('GameFont')) {
            //返回 true
            return true;
            //否则
        } else if (!Graphics.canUseCssFontLoading()) {
            var elapsed = Date.now() - this._startDate;
            if (elapsed >= 60000) {
                throw new Error('Failed to load GameFont');
            }
        }
    };



    var Bitmap_prototype_initialize = Bitmap.prototype.initialize
    Bitmap.prototype.initialize = function (width, height) {
        Bitmap_prototype_initialize.call(this, width, height)
        this.fontFace = Graphics.fonts.join(", ")
    };


    /**标准字体 */
    Window_Base.prototype.standardFontFace = function () {
        //如果 游戏系统 是中文
        if ($gameSystem.isChinese()) {
            //返回 'SimHei, Heiti TC, sans-serif'
            return 'SimHei, Heiti TC, sans-serif';
            //否则 如果 游戏系统 是韩语
        } else if ($gameSystem.isKorean()) {
            //返回 'Dotum, AppleGothic, sans-serif'
            return 'Dotum, AppleGothic, sans-serif';
            //否则
        } else {
            //返回 游戏字体
            return Graphics.fonts.join(", ") // 'GameFont';
        }
    };

})()
