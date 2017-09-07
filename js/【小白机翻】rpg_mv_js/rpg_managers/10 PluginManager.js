
//-----------------------------------------------------------------------------
// PluginManager
// 插件管理器
// The static class that manages the plugins.
// 这个静态的类 管理 插件

function PluginManager() {
    throw new Error('This is a static class');
}
//路径
PluginManager._path         = 'js/plugins/';
//脚本组
PluginManager._scripts      = [];
//错误地址组
PluginManager._errorUrls    = [];
//参数组
PluginManager._parameters   = {};
//安装
PluginManager.setup = function(plugins) {
    plugins.forEach(function(plugin) {
	    //如果 插件 状态 并且 不是 脚本组 包含 插件名
        if (plugin.status && !this._scripts.contains(plugin.name)) {
	        //设置参数
            this.setParameters(plugin.name, plugin.parameters);
            //读取脚本
            this.loadScript(plugin.name + '.js');
            //脚本组添加
            this._scripts.push(plugin.name);
        }
    }, this);
};
//检查错误
PluginManager.checkErrors = function() {
    var url = this._errorUrls.shift();
    if (url) {
        throw new Error('Failed to load: ' + url);
    }
};
//参数
PluginManager.parameters = function(name) {
	//返回 参数组[名称 把字符串转换为小写] 或者 {}
    return this._parameters[name.toLowerCase()] || {};
};
//设置参数组
PluginManager.setParameters = function(name, parameters) {
	//参数组[名称 把字符串转换为小写 ] = 参数组
    this._parameters[name.toLowerCase()] = parameters;
};
//读取脚本
PluginManager.loadScript = function(name) {
    var url = this._path + name;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.onerror = this.onError.bind(this);
    script._url = url;
    document.body.appendChild(script);
};
//在错误
PluginManager.onError = function(e) {
	//错误地址组
    this._errorUrls.push(e.target._url);
};
