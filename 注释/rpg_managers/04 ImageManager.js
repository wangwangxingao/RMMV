
/**-----------------------------------------------------------------------------   
 * ImageManager   
 * 图像管理器   
 * The static class that loads images, creates bitmap objects and retains them.   
 * 这个静态的类 读取 图像 创造图片对象 和 保存他们 */

function ImageManager() {
    throw new Error('This is a static class');
}
/**储存 */
ImageManager.cache = new CacheMap(ImageManager);
ImageManager._imageCache = new ImageCache();
ImageManager._requestQueue = new RequestQueue();
ImageManager._systemReservationId = Utils.generateRuntimeId();

ImageManager._generateCacheKey = function(path, hue){
    return  path + ':' + hue;
};

/**读取动画
 * @param {string} filename 文件名
 * @param {number} hue 色相
 */
ImageManager.loadAnimation = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/animations/', filename, hue, true);
};

/**读取战斗背景1
 * @param {string} filename 文件名
 * @param {number} hue 色相
 */
ImageManager.loadBattleback1 = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/battlebacks1/', filename, hue, true);
};
/**读取战斗背景2 
 * @param {string} filename 文件名
 * @param {number} hue 色相
*/
ImageManager.loadBattleback2 = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/battlebacks2/', filename, hue, true);
};
/**读取敌人 
 * @param {string} filename 文件名
 * @param {number} hue 色相
*/
ImageManager.loadEnemy = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/enemies/', filename, hue, true);
};
/**读取行走图 
 * @param {string} filename 文件名
 * @param {number} hue 色相
*/
ImageManager.loadCharacter = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/characters/', filename, hue, false);
};
/**读取脸图 
 * @param {string} filename 文件名
 * @param {number} hue 色相
*/
ImageManager.loadFace = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/faces/', filename, hue, true);
};
/**读取远景图 
 * @param {string} filename 文件名
 * @param {number} hue 色相
*/
ImageManager.loadParallax = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/parallaxes/', filename, hue, true);
};
/**读取图片 
 * @param {string} filename 文件名
 * @param {number} hue 色相
*/
ImageManager.loadPicture = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/pictures/', filename, hue, true);
};
/**读取sv角色 */
ImageManager.loadSvActor = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/sv_actors/', filename, hue, false);
};
/**读取sv敌人 
 * @param {string} filename 文件名
 * @param {number} hue 色相
*/
ImageManager.loadSvEnemy = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/sv_enemies/', filename, hue, true);
};
/**读取系统 
 * @param {string} filename 文件名
 * @param {number} hue 色相
*/
ImageManager.loadSystem = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/system/', filename, hue, false);
};
/**读取图块组 
 * @param {string} filename 文件名
 * @param {number} hue 色相
*/
ImageManager.loadTileset = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/tilesets/', filename, hue, false);
};
/**读取标题画面1 
 * @param {string} filename 文件名
 * @param {number} hue 色相
*/
ImageManager.loadTitle1 = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/titles1/', filename, hue, true);
};
/**读取标题画面2 
 * @param {string} filename 文件名
 * @param {number} hue 色相
*/
ImageManager.loadTitle2 = function(filename, hue) {
    //返回 读取图片
    return this.loadBitmap('img/titles2/', filename, hue, true);
};
/**读取图片 
 * @param {string} filename 文件名
 * @param {number} hue 色相
*/
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
/**读取空图片 */
ImageManager.loadEmptyBitmap = function() {
    var empty = this._imageCache.get('empty');
    if(!empty){
        empty = new Bitmap();
        this._imageCache.add('empty', empty);
        this._imageCache.reserve('empty', empty, this._systemReservationId);
    }

    return empty;
};

/**读取正常图片 
 * @param {string} path 地址
 * @param {number} hue 色相
*/
ImageManager.loadNormalBitmap = function(path, hue) {
    var key = this._generateCacheKey(path, hue);
    var bitmap = this._imageCache.get(key);
    if (!bitmap) {
        bitmap = Bitmap.load(decodeURIComponent(path));
        bitmap.addLoadListener(function() {
            bitmap.rotateHue(hue);
        });
        this._imageCache.add(key, bitmap);
    }else if(!bitmap.isReady()){
        bitmap.decode();
    }

    return bitmap;
};
/**清除 */
ImageManager.clear = function() {
    this._imageCache = new ImageCache();
};
/**是准备好 */
ImageManager.isReady = function() {
    return this._imageCache.isReady();
};
/**是物体特征 */
ImageManager.isObjectCharacter = function(filename) {
    var sign = filename.match(/^[\!\$]+/);
    return sign && sign[0].contains('!');
};
/**是大特征 */
ImageManager.isBigCharacter = function(filename) {
    var sign = filename.match(/^[\!\$]+/);
    return sign && sign[0].contains('$');
};
/**是0视差 */
ImageManager.isZeroParallax = function(filename) {
    return filename.charAt(0) === '!';
};

/**预订动画 
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
 */
ImageManager.reserveAnimation = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/animations/', filename, hue, true, reservationId);
};
/**预订战斗背景1
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
 */
ImageManager.reserveBattleback1 = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/battlebacks1/', filename, hue, true, reservationId);
};
/**预订战斗背景2 
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
*/
ImageManager.reserveBattleback2 = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/battlebacks2/', filename, hue, true, reservationId);
};
/**预订敌人
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
 */
ImageManager.reserveEnemy = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/enemies/', filename, hue, true, reservationId);
};
/**预订行走图 
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
*/
ImageManager.reserveCharacter = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/characters/', filename, hue, false, reservationId);
};
/**预订脸图 
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
*/
ImageManager.reserveFace = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/faces/', filename, hue, true, reservationId);
};
/**预订远景图 
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
*/
ImageManager.reserveParallax = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/parallaxes/', filename, hue, true, reservationId);
};
/**预订图片
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
 */
ImageManager.reservePicture = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/pictures/', filename, hue, true, reservationId);
};
/**预订sv角色 
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
*/
ImageManager.reserveSvActor = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/sv_actors/', filename, hue, false, reservationId);
};
/**预订sv敌人 
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
*/
ImageManager.reserveSvEnemy = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/sv_enemies/', filename, hue, true, reservationId);
};
/**预订系统 
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
*/
ImageManager.reserveSystem = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/system/', filename, hue, false, reservationId || this._systemReservationId);
};
/**预订图块组 
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
*/
ImageManager.reserveTileset = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/tilesets/', filename, hue, false, reservationId);
};
/**预订标题画面1 
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
*/
ImageManager.reserveTitle1 = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/titles1/', filename, hue, true, reservationId);
};
/**预订标题画面2 
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
*/
ImageManager.reserveTitle2 = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/titles2/', filename, hue, true, reservationId);
};
/**预订图片 
 * @param {string} filename 文件名
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
*/
ImageManager.reserveBitmap = function(folder, filename, hue, smooth, reservationId) {
    if (filename) {
        var path = folder + encodeURIComponent(filename) + '.png';
        var bitmap = this.reserveNormalBitmap(path, hue || 0, reservationId || this._defaultReservationId);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};
/**预订正常图片 
 * @param {string} path 地址
 * @param {number} hue 色相
 * @param {number} reservationId 预定id
*/
ImageManager.reserveNormalBitmap = function(path, hue, reservationId){
    var bitmap = this.loadNormalBitmap(path, hue);
    this._imageCache.reserve(this._generateCacheKey(path, hue), bitmap, reservationId);

    return bitmap;
};
/**释放预订  
 * @param {number} reservationId 预定id
*/
ImageManager.releaseReservation = function(reservationId){
    this._imageCache.releaseReservation(reservationId);
};
/**设置缺省预订id 
 * @param {number} reservationId 预定id
*/
ImageManager.setDefaultReservationId = function(reservationId){
    this._defaultReservationId = reservationId;
};

/**请求动画 
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestAnimation = function(filename, hue) {
    return this.requestBitmap('img/animations/', filename, hue, true);
};
/**请求战斗背景1 
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestBattleback1 = function(filename, hue) {
    return this.requestBitmap('img/battlebacks1/', filename, hue, true);
};
/**请求战斗背景2
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestBattleback2 = function(filename, hue) {
    return this.requestBitmap('img/battlebacks2/', filename, hue, true);
};
/**请求敌人
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestEnemy = function(filename, hue) {
    return this.requestBitmap('img/enemies/', filename, hue, true);
};
/**请求行走图
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestCharacter = function(filename, hue) {
    return this.requestBitmap('img/characters/', filename, hue, false);
};
/**请求脸图
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestFace = function(filename, hue) {
    return this.requestBitmap('img/faces/', filename, hue, true);
};
/**请求远景图
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestParallax = function(filename, hue) {
    return this.requestBitmap('img/parallaxes/', filename, hue, true);
};
/**请求图片
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestPicture = function(filename, hue) {
    return this.requestBitmap('img/pictures/', filename, hue, true);
};
/**请求sv角色
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestSvActor = function(filename, hue) {
    return this.requestBitmap('img/sv_actors/', filename, hue, false);
};
/**请求sv敌人
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestSvEnemy = function(filename, hue) {
    return this.requestBitmap('img/sv_enemies/', filename, hue, true);
};
/**请求系统
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestSystem = function(filename, hue) {
    return this.requestBitmap('img/system/', filename, hue, false);
};
/**请求图块组
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestTileset = function(filename, hue) {
    return this.requestBitmap('img/tilesets/', filename, hue, false);
};
/**请求标题画面1
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestTitle1 = function(filename, hue) {
    return this.requestBitmap('img/titles1/', filename, hue, true);
};
/**请求标题画面2
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestTitle2 = function(filename, hue) {
    return this.requestBitmap('img/titles2/', filename, hue, true);
};
/**请求图片
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestBitmap = function(folder, filename, hue, smooth) {
    if (filename) {
        var path = folder + encodeURIComponent(filename) + '.png';
        var bitmap = this.requestNormalBitmap(path, hue || 0);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};
/**请求正常图片
 * @param {string} filename 文件名
 * @param {number} hue 色相 
 */
ImageManager.requestNormalBitmap = function(path, hue){
    var key = this._generateCacheKey(path, hue);
    var bitmap = this._imageCache.get(key);
    if(!bitmap){
        bitmap = Bitmap.request(path);
        bitmap.addLoadListener(function(){
            bitmap.rotateHue(hue);
        });
        this._imageCache.add(key, bitmap);
        this._requestQueue.enqueue(key, bitmap);
    }else{
        this._requestQueue.raisePriority(key);
    }

    return bitmap;
};
/**更新 */
ImageManager.update = function(){
    this._requestQueue.update();
};
/**清除请求 */
ImageManager.clearRequest = function(){
    this._requestQueue.clear();
};