
//-----------------------------------------------------------------------------
/**处理资源加载的静态类。
 * The static class that handles resource loading.
 * 资源处理程序
 * @class ResourceHandler
 */
function ResourceHandler() {
    throw new Error('This is a static class');
}

/**重试装载组 */
ResourceHandler._reloaders = [];
/**默认重试间隔 */
ResourceHandler._defaultRetryInterval = [500, 1000, 3000];
 
/**
 * 创建装载程序
 * @param {string} url 地址
 * @param {function} retryMethod  重试方法
 * @param {function} resignMethod 放弃方法 
 * @param {[number,]} retryInterval  重试间隔
 */
ResourceHandler.createLoader = function(url, retryMethod, resignMethod, retryInterval) {
    //重试间隔 = 重试间隔 或者 默认重试间隔
    retryInterval = retryInterval || this._defaultRetryInterval;
    //重试装载组
    var reloaders = this._reloaders;
    //重试计数 = 0
    var retryCount = 0;
    return function() {
        //如果( 重试计数 < 重试间隔 长度 )
        if (retryCount < retryInterval.length) {
            //设置超时(重试方法, 重试间隔[重试计数])
            setTimeout(retryMethod, retryInterval[retryCount]);
            //重试计数++
            retryCount++;
        //否则
        } else {
            //如果(放弃方法)
            if (resignMethod) {
                //放弃方法()
                resignMethod();
            }
            //如果(地址)
            if (url) {
                //如果(重试装载组 长度 === 0)
                if (reloaders.length === 0) {
                    //图形 显示加载错误(地址)
                    Graphics.printLoadingError(url);
                    //场景管理器 停止()
                    SceneManager.stop();
                }
                //重新加载组 添加
                reloaders.push(function() {
                    //重试计数 = 0
                    retryCount = 0;
                    //重试方法
                    retryMethod();
                });
            }
        }
    };
};


/**存在 */
ResourceHandler.exists = function() {
    return this._reloaders.length > 0;
};

/**重试 */
ResourceHandler.retry = function() {
    //如果(重新加载组 长度 >  0)
    if (this._reloaders.length > 0) {
        //图形 清除加载错误()
        Graphics.eraseLoadingError();
        //场景管理器 重新开始()
        SceneManager.resume();
        //重新加载组 对每一个 重新加载
        this._reloaders.forEach(function(reloader) {
            //重新加载()
            reloader();
        });
        //重新加载组 长度 = 0
        this._reloaders.length = 0;
    }
};