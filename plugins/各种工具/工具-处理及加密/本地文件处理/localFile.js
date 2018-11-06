


/**本地文件处理 */
localFile = {}

var fs = require("fs")



/**
 * 本地文件夹
 * 返回 本地文件夹地址
 * @returns {string}
 */
localFile.localdir = function () {
    if (this._localdir === undefined) {
        if (typeof require === 'function' && typeof process === 'object') {
            var path = require('path');
            var base = path.dirname(process.mainModule.filename);
            /* 打包时 
            if (path.basename(base) == "www") {
                var base = path.dirname(base);
            } 
            */
            this._localdir = base;
        }else{
            this._localdir = ""
        }
        /*  
             var pathname = window.location.pathname
             var path = pathname.replace(/(\/www|)\/[^\/]*$/, "");
             if (path.match(/^\/([A-Z]\:)/)) {
                 path = path.slice(1);
             }
            this._localdir = decodeURIComponent(path);
        */
    }
    return this._localdir
};



/**文件夹保存 */
localFile._dirs = {}

/**本地文件位置名称
 * 
 * 获取一个位置的本地名称,如果没有,创建地址
 * 
 * 
 */
localFile.localFileName = function (name) {
    if (name) {
        var namelist = name.split("/")
        var dirPath = this.localdir()
        var fs = require('fs');
        var d = ""
        for (var i = 0; i < namelist.length - 1; i++) {
            d = d + ((d || dirPath) ? '/' : "") + namelist[i];
            var d2 = dirPath + d
            if (!this._dirs[d]) {
                /**如果文件夹是空的 */
                if (!fs.existsSync(d2)) {
                    /**制作文件夹 */
                    fs.mkdirSync(d2);
                }
                this._dirs[d] = 1
            }
        }
        d = d + ((d || dirPath) ? '/' : "") + namelist[i];
        return dirPath + d
    }
}



localFile.dirAndName = function (dirpath, name) {
    return name ? dirPath + "/" + name : dirpath
}




/**
 * 是否存在
 */
localFile.existsSync = function (path) {
    return fs.existsSync(path)
}


/**
 * 写入数据
 *  
    file <string> | <Buffer> | <URL> | <integer> 文件名或文件描述符。
    data <string> | <Buffer> | <Uint8Array>
    options <Object> | <string>

    encoding <string> | <null> 默认为 'utf8'。
    mode <integer> 默认为 0o666。
    flag <string> 详见支持的文件系统flag。默认为 'w'。
    返回 undefined。
 * @param {*} file 
 * @param {*} data 
 * @param {*} options 
 */
localFile.writeFileSync = function (file, data, options) {
    return fs.writeFileSync(file, data, options)
}

/**
 * 创建文件夹
 *  
    file <string> | <Buffer> | <URL> | <integer> 文件名或文件描述符。
    data <string> | <Buffer> | <Uint8Array>
    options <Object> | <string>

    encoding <string> | <null> 默认为 'utf8'。
    mode <integer> 默认为 0o666。
    flag <string> 详见支持的文件系统flag。默认为 'w'。
    返回 undefined。
 * @param {*} file 
 * @param {*} data 
 * @param {*} options 
 */
localFile.mkdirSync = function (path) {
    return fs.mkdirSync(path)
}


/**
 * 状态
 *   
 * @param {*} path  
 * @param {*} options 
 */
localFile.statSync = function (path) {
    return fs.statSync(path)
}



/**
 * 读取目录
 *   
 * @param {*} path  
 * @param {*} options 
 */
localFile.readdirSync = function (path) {
    return fs.readdirSync(path)
}



/**
 * 读取文件
 *   
 * @param {*} path  
 * @param {*} options 
 */
localFile.readFileSync = function (path) {
    return fs.readFileSync(path)
}

/**
* 删除文件
*   
* @param {*} path  
* @param {*} options 
*/
localFile.unlinkSync = function (path) {
    return fs.unlinkSync(path)
}




/**
* 拷贝
*   src <string> | <Buffer> | <URL> 要被拷贝的源文件名称
*   dest <string> | <Buffer> | <URL> 拷贝操作的目标文件名
* @param {*} src  
* @param {*} dest 
*/
localFile.copyFileSync = function (src, dest) {
    return fs.copyFileSync(src, dest)
}


/**
* 重命名
*   oldPath <string> | <Buffer> | <URL> 源文件名称
*   newPath <string> | <Buffer> | <URL> 目标文件名
* @param {*} oldPath  
* @param {*} newPath 
*/
localFile.renameSyncSync = function (oldPath, newPath) {
    return fs.renameSyncSync(oldPath, newPath)
}



/**
* 删除文件夹 
* @param {*} path   
*/
localFile.rmdirSync = function (path) {
    return fs.rmdirSync(path)
}







/**获取文件信息 */
localFile.loadFileSync = function (dirpath, name, type) {
    var file = {}
    file.dirpath = dirpath
    file.name = name
    var path = this.dirAndName(dirpath, name)
    if (fs.existsSync(path)) {
        var filesj = fs.statSync(path)
        if (filesj.isDirectory()) {
            file.stat = filesj
            file.type = "dir"
            if (type > 0) {
                file.list = this.loadDirListSync(path, type - 1)
            }
        } else {
            file.stat = filesj
            file.type = "file"
        }
    } else {
        file.type = "null"

    }
    return file
}

/**获取目录信息 */
localFile.loadDirListSync = function (dirpath, type) {
    var files = fs.readdirSync(dirpath)
    var list = []
    for (var i = 0; i < files.length; i++) {
        var name = files[i];
        var file = this.loadFileSync(dirpath, name, type);
        list.push(file)
    }
    return list
}





/**获取所有文件状态 */
localFile.getAllfile = function (path) {
    var o = {}
    var dir = this.localdir()
    var get = function (f) {
        var p = f ? dir + "/" + f : dir
        if (fs.existsSync(p)) {
            var stats = fs.statSync(p)
            if (stats.isDirectory()) {
                var files = fs.readdirSync(p)
                files.forEach(function (n) {
                    var f2 = f ? f + '/' + n : n
                    get(f2, o)
                })
            } else {
                o[f] = stats
            }
        }
        return o
    }
    return get(path)
}






/**获取所有文件 */
localFile.getMd5 = function (date, type) {
    var t = type || "md5"
    var c = require('crypto')
    var m = c.createHash(t)
    m.update(date)
    var z = m.digest("hex").toUpperCase();;
    return z
}
















localFile.readFile = function () {

    // 异步读取
    this.fs.readFile('input.txt', function (err, data) {
        if (err) return console.log(err);
        console.log('异步读取：' + data.toString());
    })


}





