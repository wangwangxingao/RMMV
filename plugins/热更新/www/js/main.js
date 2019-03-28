//=============================================================================
// main.js
//=============================================================================

 



game = game || {}

game.cn = localStorage.getItem("ver") || {
    ver: 0,
    datas: {},
    plugin: 0,
    plugins: {},
};


game.datas = JSON.parse(localStorage.getItem("datas") || "{}");
game.plugins = JSON.parse(localStorage.getItem("plugins") || "{}");

game.url = ""
game.url2 = ""




/**获取全部版本 */
game.verchangeTo = function (change) {
    var now = now || 0
    var c = {
        ver: 0,
        datas: {},
        plugin: 0,
        plugins: {},
    }
    for (var i = 0; i < change.length; i++) {
        var z = change[i]
        if (z) {
            c.ver = z.ver
            for (var di = 0; di < z.datas.length; di++) {
                var name = z.datas[di]
                c.datas[name] = z.ver
            }
            if (z.plugin) {
                c.plugin = z.ver
            }
            for (var di = 0; di < z.plugins.length; di++) {
                var name = z.plugins[di]
                c.plugins[name] = z.ver
            }
        }
    }
    return c
}


/**需要改变 */
game.mustchange = function (type, name) {
    if (type == "datas") {
        if (game.cn.datas[name] != game.cto.datas[name]) {
            //需要更新
            return 1
        } else {
            if (!game.cto.datas[name]) {
                //使用基础
                return 0
            } else {
                //使用存档的
                return 2
            }
        }
    } else if (type == "plugins") {
        if (game.cn.plugins[name] != game.cto.plugins[name]) {
            //需要更新
            return 1
        } else {
            if (!game.cto.plugins[name]) {
                //使用基础
                return 0
            } else {
                //使用存档的
                return 2
            }
        }
    } else if (type == "plugin") {
        if (game.cn.plugin != game.cto.plugin) {
            //需要更新
            return 1
        } else {
            if (!game.cto.plugin) {
                //使用基础
                return 0
            } else {
                //使用存档的
                return 2
            }
        }
    }
}

/**保存 */
game.save = function (type, name, data) {
    if (type == "datas") {
        game.datas[name] = data
        game.cn.datas[name] = game.cto.datas[name]
        localStorage.setItem("datas", JSON.stringify(game.data))
    } else if (type == "plugins") {
        game.plugins[name] = data
        game.cn.plugins[name] = game.cto.plugins[name]
        localStorage.setItem("plugins", JSON.stringify(game.plugins))
    }
}


DataManager.loadDataFile = function (name, src) { 
    var type = game.mustchange("datas", src)
    if (type == 2) {
        if (game.data[src]) {
            alert("读取储存" + src)
            window[name] = JSON.parse(game.data[name]);
            //数据管理器 当读取(窗口[name] )
            DataManager.onLoad(window[name]);
            return
        } else {
            type = 1
        }
    }
    if (type == 1) {
        alert("读取网络" + src)
        var url = game.url2 + 'data/' + src;
    } else {
        alert("读取本地" + src)
        var url = 'data/' + src;
    }

    //网址请求 = 新 XML网址请求()
    var xhr = new XMLHttpRequest();
    //url位置 = "data" + src
    //网址请求 打开( 'GET' , url位置)
    xhr.open('GET', url);
    //网址请求 文件类型('application/json')
    xhr.overrideMimeType('application/json');
    //网址请求 当读取
    xhr.onload = function () {
        //如果 网址请求 状态 < 400
        if (xhr.status < 400) {
            if (type == 1) {
                game.save("datas", src, xhr.responseText)
            }
            //窗口[name] = json解析(网址请求 返回text)
            window[name] = JSON.parse(xhr.responseText);
            //数据管理器 当读取(窗口[name] )
            DataManager.onLoad(window[name]);
        }
    };
    //网址请求 当错误
    xhr.onerror = this._mapLoader || function () {
        DataManager._errorUrl = DataManager._errorUrl || ((type == 1 ? "数据更新失败..." : "") + url);
    };
    //窗口[name] = null
    window[name] = null;
    //网址请求 发出
    xhr.send();
}

PluginManager.loadScript = function (name) {
    var type = game.mustchange("plugins", name)
    if (type == 2) {
        alert("读取储存" + name)
        PluginManager.loadScript2(name)
    } else if (type == 1) {
        alert("读取网络" + name)
        PluginManager.loadScript1(name)
    } else {
        alert("读取本地" + name)
        PluginManager.loadScript0(name)
    }
}

PluginManager.loadScript0 = function (name) {
    //url位置 = 路径 + 名称
    var url = this._path + name;
    //脚本 = 文档 创建对象("script"//脚本)
    var script = document.createElement('script');
    //脚本 种类 = "text/javascript" 
    script.type = 'text/javascript';
    //脚本 位置 = url位置
    script.src = url;
    //脚本 异步 = false 
    script.async = false;
    //脚本 当错误 = 当错误 绑定(this)
    script.onerror = this.onError.bind(this);
    //脚本 url位置 = url位置
    script._url = url;
    //文档 主体 添加子节点(脚本)
    document.body.appendChild(script);

};


PluginManager.loadScript1 = function (name) {
    //url位置 = 路径 + 名称
    var url = game.url2 + this._path + name;
    //脚本 = 文档 创建对象("script"//脚本)
    var script = document.createElement('script');
    //脚本 种类 = "text/javascript" 
    script.type = 'text/javascript';
    //脚本 位置 = url位置
    script.src = url;
    //脚本 异步 = false 
    script.async = false;
    //脚本 当错误 = 当错误 绑定(this)
    script.onerror = this.onError.bind(this);
    //脚本 url位置 = url位置
    script._url = url;
    //文档 主体 添加子节点(脚本)
    document.body.appendChild(script);


    //网址请求 = 新 XML网址请求()
    var xhr = new XMLHttpRequest();
    //url位置 = "data" + src
    //网址请求 打开( 'GET' , url位置)
    xhr.open('GET', url);
    //网址请求 文件类型('application/json')
    xhr.overrideMimeType('application/json');
    //网址请求 当读取
    xhr.onload = function () {
        //如果 网址请求 状态 < 400
        if (xhr.status < 400) {
            game.save("plugins", name, xhr.responseText)
        }
    };
};


PluginManager.loadScript2 = function (name) {
    var js = game.plugins[name]
    var url = this._path + name;
    try {
        if (js) {
            var os = document.createElement("script");
            os.language = "javascript";
            os.type = "text/javascript";
            os.id = url;
            os.defer = true;
            try {
                os.appendChild(document.createTextNode(js));
            } catch (ex) {
                os.text = js;
            }
            document.body.appendChild(os)
        } else {
            PluginManager.loadScript1(name)
        }
    } catch (e) {
        PluginManager.loadScript1(name)
    }
}


game.loadScript = function (name, type) {
    //url位置 = 路径 + 名称
    var url = (type ? "" : game.url2) + name;
    //脚本 = 文档 创建对象("script"//脚本)
    var script = document.createElement('script');
    //脚本 种类 = "text/javascript" 
    script.type = 'text/javascript';
    //脚本 位置 = url位置
    script.src = url;
    //脚本 异步 = false 
    script.async = false;
    //脚本 当错误 = 当错误 绑定(this)
    script.onerror = this.onError.bind(this);
    //脚本 url位置 = url位置
    script._url = url;
    //文档 主体 添加子节点(脚本)
    document.body.appendChild(script);
};

game.start = function () {
    if (game.mustchange("plugin")) {
        game.loadScript("js/plugins.js")
        game.loadScript("js/setup.js", 1)
    } else {
        PluginManager.setup($plugins)
    }
}

game.loadScript("js/change.js",1)


//

//PluginManager.setup($plugins);

window.onload = function () { 
    SceneManager.run(Scene_Boot);
};
