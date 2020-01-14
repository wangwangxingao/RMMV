
/**-----------------------------------------------------------------------------  
 *资源的类。允许被收集作为垃圾如果不是使用一段时间 
 * The resource class. Allows to be collected as a garbage if not use for some time or ticks
 * 缓存条目
 * @class CacheEntry
 * @constructor
 * @param {ResourceManager} resource manager
 * @param {string} key, url of the resource
 * @param {string} item - Bitmap, HTML5Audio, WebAudio - whatever you want to store in the cache
 */
function CacheEntry(cache, key, item) {
    //缓存 = cache
    this.cache = cache;
    this.key = key;
    this.item = item;
    this.cached = false;
    this.touchTicks = 0;
    this.touchSeconds = 0;
    this.ttlTicks = 0;
    this.ttlSeconds = 0;
    this.freedByTTL = false;
}

/**释放
 * 
 * 释放资源
 * frees the resource 
 * 
 */
CacheEntry.prototype.free = function (byTTL) {
    this.freedByTTL = byTTL || false;
    //如果( 缓存的 )
    if (this.cached) {
        //缓存的 = false
        this.cached = false;
        //删除 缓存
        delete this.cache._inner[this.key];
    }
};

/**分配
 * 
 * 分配资源
 * Allocates the resource
 * @returns {CacheEntry} 
 * 
 */
CacheEntry.prototype.allocate = function () {
    //如果( 不是 缓存的 )
    if (!this.cached) {
        this.cache._inner[this.key] = this;
        //缓存的 = true 
        this.cached = true;
    }
    //触发()
    this.touch();
    //返回 this
    return this;
};

/**设置生存时间
 * Sets the time to live
 * @param {number} ticks TTL in ticks, 0 if not set
 * @param {number} time TTL in seconds, 0 if not set
 * @returns {CacheEntry} 
 */
CacheEntry.prototype.setTimeToLive = function (ticks, seconds) {
    //生存标记 = ticks || 0 
    this.ttlTicks = ticks || 0;
    //生存秒数 = seconds || 0
    this.ttlSeconds = seconds || 0;
    return this;
};
/**
 * 是生存状态
 */
CacheEntry.prototype.isStillAlive = function () {
    var cache = this.cache;
    //返回  ( 生存标记 == 0  或者  (  触发标记 + 生存标记 < 缓存 更新标记  ) ) 并且  
    return ((this.ttlTicks == 0) || (this.touchTicks + this.ttlTicks < cache.updateTicks )) &&
    //   ( 生存秒数 == 0  或者  (  触发秒数 + 生存秒数 < 缓存 更新秒数  )   )
        ((this.ttlSeconds == 0) || (this.touchSeconds + this.ttlSeconds < cache.updateSeconds ));
};

/**可以确保资源不会被释放通过生存时间 
 * makes sure that resource wont freed by Time To Live
 * 如果 资源 已经被释放 通过 ttl , 把它放到缓存里再一次
 * if resource was already freed by TTL, put it in cache again
 * 
 * 触发
 */
CacheEntry.prototype.touch = function () {
    var cache = this.cache;
    //如果(缓存的)
    if (this.cached) {
        //触发标记 = 缓存 更新标记
        this.touchTicks = cache.updateTicks;
        this.touchSeconds = cache.updateSeconds;
    //否则 如果( 解放通过生存时间 )
    } else if (this.freedByTTL) {
        //解放通过生存时间 = false
        this.freedByTTL = false; 
        //TODO: shall we log this event? its not 
        //TODO: 我们将记录此事件？不正常
        if (!cache._inner[this.key]) {
            cache._inner[this.key] = this;
        }
    }
};

/**缓存图像，音频，或任何其他类型的资源
 * Cache for images, audio, or any other kind of resource
 * @param manager
 * @constructor
 * 
 * 缓存映射
 */  
function CacheMap(manager) {
    this.manager = manager;
    this._inner = {};
    this._lastRemovedEntries = {};
    //更新标记 = 0 
    this.updateTicks = 0;
    //最后检查生存时间 = 0
    this.lastCheckTTL = 0;
    //延迟检查生存时间
    this.delayCheckTTL = 100.0;
    //更新秒数
    this.updateSeconds = Date.now();
}

/**检查所有元素的TTL(生存时间)和去除死的那些
 * checks ttl of all elements and removes dead ones
 * 
 * 检查TTL(生存时间)
 */ 
CacheMap.prototype.checkTTL = function () {
    var cache = this._inner;
    var temp = this._lastRemovedEntries;
    if (!temp) {
        temp = [];
        this._lastRemovedEntries = temp;
    }
    for (var key in cache) {
        var entry = cache[key];
        //如果(不是 是生存状态() )
        if (!entry.isStillAlive()) {
            //临时 添加( entry )
            temp.push(entry);
        }
    }
    for (var i = 0; i < temp.length; i++) {
        temp[i].free(true);
    }
    temp.length = 0;
};

/**项目
 * cache item
 * @param key url of cache element
 * @returns {*|null}
 * 
 * 获取项目
 */ 
CacheMap.prototype.getItem = function (key) {
    var entry = this._inner[key];
    if (entry) {
        return entry.item;
    }
    return null;
};
/**
 * 清除
 */
CacheMap.prototype.clear = function () {
    var keys = Object.keys(this._inner);
    for (var i = 0; i < keys.length; i++) {
        this._inner[keys[i]].free();
    }
};

/**
 * 设置项目
 */
CacheMap.prototype.setItem = function (key, item) {
    return new CacheEntry(this, key, item).allocate();
};

/**
 *  更新
 */
CacheMap.prototype.update = function(ticks, delta) {
    this.updateTicks += ticks;
    this.updateSeconds += delta;
    if (this.updateSeconds >= this.delayCheckTTL + this.lastCheckTTL) {
        this.lastCheckTTL = this.updateSeconds;
        //检查TTL()
        this.checkTTL();
    }
};
