ImageManager.loadBitmap = function (folder, filename, hue, smooth, filename2) {
    //如果(文件名称)
    if (filename) {
        //位置 = 文件夹 + 编码(文件名称) + ".png"
        var path = folder + encodeURIComponent(filename) + '.png';
        //位图 = 读取普通位图(位置,色相 || 0 )
        var bitmap = this.loadNormalBitmap(path, hue || 0);


        if (filename2) {
            var path2 = folder + encodeURIComponent(filename) + '.png';
            bitmap._otherUrl = path2;
        } 

        //位图 平滑 = smooth //平滑
        bitmap.smooth = smooth;
        //返回 位图
        return bitmap;
    } else {
        //返回 读取空白图片()
        return this.loadEmptyBitmap();
    }
};








/**
 * 请求图像
 * 
 */
Bitmap.prototype._requestImage = function (url) {

    if (this._otherUrlmust && this._otherUrl) {
        var url = this._otherUrl
        this._otherUrl = null
    }

    //如果(位图 请求图像组 长度 !== 0)
    if (Bitmap._reuseImages.length !== 0) {
        //图像 = 位图 请求图像组 末尾()
        this._image = Bitmap._reuseImages.pop();
    } else {
        //图像 = 新 图像()
        this._image = new Image();
    }

    if (this._decodeAfterRequest && !this._loader) {
        this._loader = ResourceHandler.createLoader(url, this._requestImage.bind(this, url), this._onError.bind(this));
    }

    this._image = new Image();
    this._url = url;
    this._loadingState = 'requesting';

    if (!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages) {
        this._loadingState = 'decrypting';
        Decrypter.decryptImg(url, this);
    } else {
        this._image.src = url;

        this._image.addEventListener('load', this._loadListener = Bitmap.prototype._onLoad.bind(this));
        this._image.addEventListener('error', this._errorListener = this._loader || Bitmap.prototype._onError.bind(this));
    }

    this._otherUrlmust = !this._otherUrlmust
};