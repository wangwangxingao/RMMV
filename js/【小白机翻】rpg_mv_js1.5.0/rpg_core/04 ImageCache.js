/**
 * 图像缓存
 * ImageCache
 */
function ImageCache(){
    this.initialize.apply(this, arguments);
}
/**图像缓存 限制 */
ImageCache.limit = 10 * 1000 * 1000;
/**初始化 */
ImageCache.prototype.initialize = function(){
    //项目组 = {}
    this._items = {};
};
/**添加 */
ImageCache.prototype.add = function(key, value){
    //项目组[键] = 
    this._items[key] = {
        //位图 : 值
        bitmap: value,
        //触发 : 时间
        touch: Date.now(),
        //键 : 键
        key: key
    };
    //缩减缓存()
    this._truncateCache();
};
/**获取 */
ImageCache.prototype.get = function(key){
    if(this._items[key]){
        var item = this._items[key];
        item.touch = Date.now();
        return item.bitmap;
    }

    return null;
};
/**预订 */
ImageCache.prototype.reserve = function(key, value, reservationId){
    if(!this._items[key]){
        this._items[key] = {
            bitmap: value,
            touch: Date.now(),
            key: key
        };
    }
    //
    this._items[key].reservationId = reservationId;
};
/**释放预订 */
ImageCache.prototype.releaseReservation = function(reservationId){
    var items = this._items;

    Object.keys(items)
        .map(function(key){return items[key];})
        .forEach(function(item){
            if(item.reservationId === reservationId){
                delete item.reservationId;
            }
        });
};
/**缩减缓存 */
ImageCache.prototype._truncateCache = function(){
    //项目组 = 项目组
    var items = this._items;
    //最大值 = 图像缓存.限制
    var sizeLeft = ImageCache.limit;
    
    Object.keys(items).map(function(key){
        //返回 项目组[键]
        return items[key];
    }).sort(function(a, b){
        //返回 b.触发 - a.触发
        return b.touch - a.touch;
    }).forEach(function(item){
        //如果(最大值 > 0 或者 需要被保持)
        if(sizeLeft > 0 || this._mustBeHeld(item)){
            //位图 = 项目 位图
            var bitmap = item.bitmap;
            //最大值 -= 位图 宽 * 位图 高
            sizeLeft -= bitmap.width * bitmap.height;
        //否则
        }else{
            //删除 项目
            delete items[item.key];
        }
    }.bind(this));
};
/**需要被保持 */
ImageCache.prototype._mustBeHeld = function(item){
    //请求只是弱，所以可以清除 request only is weak so It's purgeable
    if(item.bitmap.isRequestOnly()) return false;
    //保留项必须保留  reserved item must be held
    if(item.reservationId) return true;
    //未准备好位图必须保持（来自检查isReady（）） not ready bitmap must be held (because of checking isReady())
    if(!item.bitmap.isReady()) return true;
    // then the item may purgeable
    return false;
};
/**是准备好 */
ImageCache.prototype.isReady = function(){
    //项目组 = 项目组
    var items = this._items;
    return !Object.keys(items).some(function(key){
        //返回 不是 []
        return !items[key].bitmap.isRequestOnly() && !items[key].bitmap.isReady();
    });
};
/**获取错误图片 */
ImageCache.prototype.getErrorBitmap = function(){
    var items = this._items;
    var bitmap = null;
    if(Object.keys(items).some(function(key){
            if(items[key].bitmap.isError()){
                bitmap = items[key].bitmap;
                return true;
            }
            return false;
        })) {
        return bitmap;
    }

    return null;
};