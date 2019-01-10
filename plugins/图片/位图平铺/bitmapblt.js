
/**块传输图像
 * 执行块传输，采用假设原始图像没有被修改（无色相）
 * Performs a block transfer, using assumption that original image was not modified (no hue)
 *
 * @method blt
 * @param {Bitmap} source 要绘制的位图  The bitmap to draw
 * @param {number} sx 源中的x坐标  The x coordinate in the source
 * @param {number} sy 源中的y坐标  The y coordinate in the source
 * @param {number} sw 源图像的宽度  The width of the source image
 * @param {number} sh 源图像的高度  The height of the source image
 * @param {number} dx 目标中的y坐标  The x coordinate in the destination
 * @param {number} dy 目标中的y坐标  The y coordinate in the destination
 * @param {number} [dw=sw] 在目标中绘制图像的宽度  The width to draw the image in the destination
 * @param {number} [dh=sh] 在目标中绘制图像的高度  The height to draw the image in the destination
 */
Bitmap.prototype.bltImage = function (source, sx, sy, sw, sh, dx, dy, dw, dh, wt, ht) {

  var dw = dw || sw
  var dh = dh || sh

  if (dw > 0 && dh > 0 && sw > 0 && sh > 0 && sx + sw > 0 && sy + sh > 0 && dx + dw > 0 && dy + dh > 0 && sx + sw <= source.width && sy + sh <= source.height) {
    var context = this._context;
    this._context.globalCompositeOperation = 'source-over';











  }





  this._context.drawImage(source._image, sx, sy, sw, sh, dx, dy, dw, dh);

  this._setDirty();


};



Bitmap.prototype.bltImage = function (source, sx, sy, sw, sh, dx, dy, dw, dh, wt, ht) {

  //以中心为界
  var xn = Math.ceil(dw / sw) + 2

  //以两侧为界
  var xn = Math.ceil(dw * 0.5 / sw) * 2 + 2


  //拉伸
  var xn = 1

  //以中心为界
  var yn = Math.ceil(dh / sh) + 2

  //以两侧为界
  var yn = Math.ceil(dh * 0.5 / sh) * 2 + 2


  //拉伸
  var yn = 1
  //绘制区域较小





};







ctx.drawImage(img, -10, 130, 90, 80, 0, 20, 90, 80);