 Object.defineProperty(Sprite.prototype, 'autoMask', {
     get: function() {
         return this._autoMask;
     },
     set: function(value) {
         this._autoMask = value;
         this._refresh();
     },
     configurable: true
 });
 Sprite.prototype._refresh_Mask = Sprite.prototype._refresh
 Sprite.prototype._refresh = function() {
     this._refresh_Mask()
     if (this.autoMask) {
         this._setMask(0, 0, this._frame.width, this._frame.height)
     }
 };

 Sprite.prototype.setMask = function(x, y, w, h) {
     this._setMask(x, y, w, h)
     this._autoMask = false
 }
 Sprite.prototype._setMask = function(x, y, w, h) {
     if (w && h) {
         if (!this.mask) {
             var mask = new PIXI.Graphics();
             mask.beginFill(0xffffff, 1);
             mask.drawRect(0, 0, 0, 0);
             mask.endFill();
             this.mask = mask
             this.addChild(this.mask)
         }
         var mask = this.mask
         mask.clear();
         mask.beginFill(0xffffff, 1);
         mask.drawRect(x || 0, y || 0, w, h);
         mask.lineStyle(0);
     } else {
         if (this.mask) {
             this.removeChild(this.mask)
             this.mask = null
         }
     }
 }