
//=============================================================================
// loadBitmapOnError.js
//=============================================================================
/*:
 * @plugindesc 当错误时用其他图片代替
 * @author wangwang
 *  
 *  
 * @param loadBitmapOnError
 * @desc 当错误时用其他图片代替 
 * @default 汪汪
 * 
 *  
 * @param img/animations/
 * @desc 动画 
 * @default 
 *  
 * @param img/battlebacks1/
 * @desc 战斗背景1 
 * @default 
 * 
 * @param img/battlebacks2/ 
 * @desc 战斗背景2 
 * @default  
 *  
 * @param img/enemies/
 * @desc 敌人 
 * @default 
 *  
 * @param img/characters/
 * @desc 选择题 
 * @default 
 *  
 * @param img/faces/
 * @desc 脸图 
 * @default 
 *  
 * @param img/parallaxes/
 * @desc 远景图 
 * @default 
 *  
 * @param img/pictures/
 * @desc 图片 
 * @default 
 *  
 * @param img/sv_actors/
 * @desc 角色 
 * @default 
 *  
 * @param img/sv_enemies/
 * @desc 敌人 
 * @default 
 *  
 * @param img/tilesets/
 * @desc 地图图块 
 * @default 
 *  
 * @param img/system/
 * @desc 系统 
 * @default 
 *  
 * @param img/titles1/
 * @desc 标题画面1 
 * @default 
 * 
 *  
 * @param img/titles2/
 * @desc 标题画面2 
 * @default 
 * 
 *  
 * @param imgOther
 * @desc 其他的添加 
 * @default {"":""}
 * 
 * 
 * @param default
 * @desc 如果没有设置读取空图片 
 * @default true
 * 
 * 
*/








var ww = ww || {}


ww.PluginManager = {}
ww.PluginManager.get = function (n) {
    var find = function (n) {
        var l = PluginManager._parameters;
        var p = l[(n || "").toLowerCase()];
        if (!p) { for (var m in l) { if (l[m] && (n in l[m])) { p = l[m]; } } }
        return p || {}
    }
    var parse = function (i) {
        try { return JSON.parse(i) } catch (e) { return i }
    }
    var m, o = {}, p = find(n)
    for (m in p) { o[m] = parse(p[m]) }
    return o
}



ww.loadBitmapOnError = ww.PluginManager.get("loadBitmapOnError")



ImageManager.loadBitmap = function (folder, filename, hue, smooth, filename2) {
    //如果(文件名称)
    if (filename) {
        //位置 = 文件夹 + 编码(文件名称) + ".png"
        var path = folder + encodeURIComponent(filename) + '.png';
        //位图 = 读取普通位图(位置,色相 || 0 )
        var bitmap = this.loadNormalBitmap(path, hue || 0);

        //位图 平滑 = smooth //平滑
        bitmap.smooth = smooth;


        ImageManager.loadBitmapOnError(bitmap, folder, filename2)

        //返回 位图
        return bitmap;
    } else {
        //返回 读取空白图片()
        return this.loadEmptyBitmap();
    }
};


/**请求图片
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestBitmap = function (folder, filename, hue, smooth, filename2) {
    if (filename) {
        var path = folder + encodeURIComponent(filename) + '.png';
        var bitmap = this.requestNormalBitmap(path, hue || 0);
        bitmap.smooth = smooth;

        ImageManager.loadBitmapOnError(bitmap, folder, filename2)

        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};



ImageManager.loadBitmapOnError = function (bitmap, folder, filename2) {

    var filename2 = filename2 || ""
    var names = ww.loadBitmapOnError
    if (!filename2) {
        if (typeof names == "object") {
            var name = names[folder]
            if (name) {
                filename2 = name
            } else {
                var names = names["imgOther"]
                if (typeof names == "object") {
                    var name = names[folder]
                    if (name) {
                        filename2 = name
                    }
                }
            }
        }
    }
    if (filename2) {
        var path2 = folder + encodeURIComponent(filename2) + '.png';
        bitmap._otherUrl = path2;
    } else {
        if (names.default) {
            bitmap._otherUrl = "none"
        }
    }
    bitmap._otherUrlmust = false

}






/**
 * 请求图像
 * 
 */
Bitmap.prototype._requestImage = function (url) {

    if (this._otherUrlmust && this._otherUrl) {
        if (this._otherUrl == "none") {
            console.log("useother", url, this._otherUrl)
            var url = this._otherUrl
            this._otherUrl = ""
        } else {
            console.log("usenone", url)
            this._otherUrl = ""
            this.initialize()
            return
        }
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




Bitmap.prototype._requestImage = function (url) {

    if (this._otherUrlmust) {

        if (this._otherUrl) {
            console.log("useother", url, this._otherUrl)

            var url = this._otherUrl
            this._otherUrl = ""
        } else {
            console.log("none", url)
            this.initialize()
            return

        }

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