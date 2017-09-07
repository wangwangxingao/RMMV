/**请求队列 */
function RequestQueue(){
    this.initialize.apply(this, arguments);
}
/**初始化 */
RequestQueue.prototype.initialize = function(){
    this._queue = [];
};
/**入队 */
RequestQueue.prototype.enqueue = function(key, value){
    this._queue.push({
        key: key,
        value: value,
    });
};
/**更新 */
RequestQueue.prototype.update = function(){
    //如果(队列 长度 ===  0 ) 返回
    if(this._queue.length === 0) return;
    //顶 = 队列[0]
    var top = this._queue[0];
    //如果(顶 值 是请求准备好)
    if(top.value.isRequestReady()){
        //队列 移除头部()
        this._queue.shift();
        //如果(队列 长度 !== 0)
        if(this._queue.length !== 0){
            //队列[0] 值 开始请求()
            this._queue[0].value.startRequest();
        }
    }else{
        //顶 值 开始请求()
        top.value.startRequest();
    }
};
/**提高优先度 */
RequestQueue.prototype.raisePriority = function(key){
    for(var n = 0; n < this._queue.length; n++){
        var item = this._queue[n];
        if(item.key === key){
            this._queue.splice(n, 1);
            this._queue.unshift(item);
            break;
        }
    }
};
/**清除 */
RequestQueue.prototype.clear = function(){
    this._queue.splice(0);
};