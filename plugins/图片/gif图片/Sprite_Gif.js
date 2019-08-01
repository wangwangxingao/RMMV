 /**  
  * gif精灵
  * @param {string} gifname gif图像名称
  * @param {number} index 图片索引
  * @param {number} time 时间 
  * @param {number} runs 运行次数
  */

 function Sprite_Gif(gifname, index, time, runs) {
     this.initialize.apply(this, arguments);
 }
 /**设置原形  */
 Sprite_Gif.prototype = Object.create(Sprite.prototype);
 /**设置创造者 */
 Sprite_Gif.prototype.constructor = Sprite_Gif;
 /**
  * 初始化
  * @param {string} gifname gif图像名称
  * @param {number} index 图片索引
  * @param {number} time 运行时间 
  * @param {number} runs 运行次数
  */
 Sprite_Gif.prototype.initialize = function (gifname, index, time, runs) {
     Sprite.prototype.initialize.call(this);
     this._index = index || 0
     this._gifname = gifname || ""
     this._info = null
     this._time = time || 0
     this._delay = 0
     this._runs = runs || 0
     this.refresh()
 };
 /**设置
  * @param {string} gifname gif图像名称
  * @param {number} index 图片索引
  * @param {number} time 运行时间 
  * @param {number} runs 运行次数
  */
 Sprite_Gif.prototype.set = function (gifname, index, time, runs) {
     this._index = index || 0
     this._gifname = gifname || ""
     this._info = null
     this._time = time || 0
     this._delay = 0
     this._runs = runs || 0
     this.refresh()
 };


 /**更新 */
 Sprite_Gif.prototype.update = function () {
     //精灵 更新 呼叫(this)
     Sprite.prototype.update.call(this);
     this.updateLoad()
     if (this._info) {
         this.updateFrame()
     }
 };

 /**更新读取 */
 Sprite_Gif.prototype.updateLoad = function () {
     if (!this._info || this._info.name != this._gifname) {
         this.refresh()
     }
 }

 /**更新帧 */
 Sprite_Gif.prototype.updateFrame = function () {
     if (this._runs > 0) {
         var t = this._info.frames.length *3
         while (this._delay < 0) {
             this._index++
             t--
             if (this._index > this._info.frames.length) {
                 this._runs--
                 this._index = 0
             }
             this.refreshOnIndex()
             if (this._runs <= 0 || t <0) {
                 break
             }
         }
         if (this._time > this._info.time) {
             var runs = Math.floor(this._time / this._info.time)
             if (this._runs > 1) {
                 this._runs -= runs
                 if (this._runs < 0) {
                     this._runs = 1
                 }
             } else {
                 this._runs -= runs
             } 
         }
         this._delay -= this._time % this._info.time
     }
 }
 Sprite_Gif.prototype.refresh = function () {
     ww.gif.load(this._gifname)
     this._info = this._gifname && ww.gif.save[this._gifname]
     if (this._info) {
         this.refreshOnLoad()
     } else {
         this.bitmap = ImageManager.loadEmptyBitmap()
     }
 }

 /**刷新当读取 */
 Sprite_Gif.prototype.refreshOnLoad = function () {
     this.refreshOnIndex()
 }

 /**刷新通过索引 */
 Sprite_Gif.prototype.refreshOnIndex = function () {
     var info
     if (this._info) {
         if (this._info.frames[this._index]) {
             var info = this._info.frames[this._index]
         } else {
             var info = this._info.frames[0]
         }
     }
     if (info) {
         this.bitmap = info.bitmap || ImageManager.loadEmptyBitmap() 
         var delay = info.ctrl ? info.ctrl.delay || 0 : 0 
     } else {
         this.bitmap = info.bitmap || ImageManager.loadEmptyBitmap()
         var delay = 0
     }
     this._delay += delay || 1
 }