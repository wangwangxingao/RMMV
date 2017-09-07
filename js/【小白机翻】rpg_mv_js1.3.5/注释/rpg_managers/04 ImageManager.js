
//-----------------------------------------------------------------------------
// ImageManager
// 图像管理器
// The static class that loads images, creates bitmap objects and retains them.
// 这个静态的类 读取 图像 创造图片对象 和 保存他们

function ImageManager() {
    throw new Error('This is a static class');
}
//储存
ImageManager.cache = new CacheMap(ImageManager);

//读取动画
ImageManager.loadAnimation = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/animations/', filename, hue, true);
};

//读取战斗背景1
ImageManager.loadBattleback1 = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/battlebacks1/', filename, hue, true);
};
//读取战斗背景2
ImageManager.loadBattleback2 = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/battlebacks2/', filename, hue, true);
};
//读取敌人
ImageManager.loadEnemy = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/enemies/', filename, hue, true);
};
//读取行走图
ImageManager.loadCharacter = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/characters/', filename, hue, false);
};
//读取脸图
ImageManager.loadFace = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/faces/', filename, hue, true);
};
//读取远景图
ImageManager.loadParallax = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/parallaxes/', filename, hue, true);
};
//读取图片
ImageManager.loadPicture = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/pictures/', filename, hue, true);
};
//读取sv角色
ImageManager.loadSvActor = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/sv_actors/', filename, hue, false);
};
//读取sv敌人
ImageManager.loadSvEnemy = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/sv_enemies/', filename, hue, true);
};
//读取系统
ImageManager.loadSystem = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/system/', filename, hue, false);
};
//读取图块组
ImageManager.loadTileset = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/tilesets/', filename, hue, false);
};
//读取标题画面1
ImageManager.loadTitle1 = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/titles1/', filename, hue, true);
};
//读取标题画面2
ImageManager.loadTitle2 = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/titles2/', filename, hue, true);
};
//读取图片
ImageManager.loadBitmap = function(folder, filename, hue, smooth) {
	//如果(文件名称)
    if (filename) {
	    //位置 = 文件夹 + 编码(文件名称) + ".png"
        var path = folder + encodeURIComponent(filename) + '.png';
        //位图 = 读取普通位图(位置,色相 || 0 )
        var bitmap = this.loadNormalBitmap(path, hue || 0);
        //位图 平滑 = smooth //平滑
        bitmap.smooth = smooth;
        //返回 位图
        return bitmap;
    } else {
	    //返回 读取空白图片()
        return this.loadEmptyBitmap();
    }
};
//读取空图片
ImageManager.loadEmptyBitmap = function() {
    var empty = this.cache.getItem('empty');
    if (!empty) {
        empty = new Bitmap();
        this.cache.setItem('empty', empty);
    }
    return empty;
};
//读取正常图片
ImageManager.loadNormalBitmap = function(path, hue) {
    var key = path + ':' + hue;
    var bitmap = this.cache.getItem(key);
    if (!bitmap) {
        bitmap = Bitmap.load(path);
        bitmap.addLoadListener(function() {
            bitmap.rotateHue(hue);
        });
        this.cache.setItem(key, bitmap);
    }
    return bitmap; 
};
//清除
ImageManager.clear = function() {
    this.cache.clear();
};
//是准备好
ImageManager.isReady = function() {
    for (var key in this.cache._inner) {
        var bitmap = this.cache._inner[key].item;
        if (bitmap.isError()) {
            throw new Error('Failed to load: ' + bitmap.url);
        }
        if (!bitmap.isReady()) {
            return false;
        }
    }
    return true;
};
//是物体特征
ImageManager.isObjectCharacter = function(filename) {
    var sign = filename.match(/^[\!\$]+/);
    return sign && sign[0].contains('!');
};
//是大特征
ImageManager.isBigCharacter = function(filename) {
    var sign = filename.match(/^[\!\$]+/);
    return sign && sign[0].contains('$');
};
//是0视差
ImageManager.isZeroParallax = function(filename) {
    return filename.charAt(0) === '!';
};
