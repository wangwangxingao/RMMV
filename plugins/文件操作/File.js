
FileManager = {}
/**拍照 */
FileManager.Bitmap_snap = function (stage) {
    var width = Graphics.width;
    var height = Graphics.height;
    var bitmap = new Bitmap(width, height);
    var context = bitmap._context;
    var canvas = document.createElement('canvas');
    var options = { view: canvas };
    var renderTexture = new PIXI.CanvasRenderer(width, height, options);
    if (stage) {
        renderTexture.render(stage);
        stage.worldTransform.identity();
    }
    context.drawImage(canvas, 0, 0);
    bitmap._setDirty();
    return bitmap;
};

/**位置 */
FileManager.dirpath = function (name) {
    if (name) {
        var weizhi = "/" + name
    } else {
        var weizhi = ""
    }
    var dirpath = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, weizhi);
    if (dirpath.match(/^\/([A-Z]\:)/)) {
        dirpath = dirpath.slice(1);
    }
    var dirpath = decodeURIComponent(dirpath);
    return dirpath
}


FileManager.dirName2Url = function (dirpath, name) {
    if (name) {
        var url = dirpath + '/' + name
    } else {
        var url = dirpath
    }
    return url
}


FileManager.web = {}
FileManager.web.loading = false


/*读取输入*/
FileManager.web.loadInput = function (fun, type, that) {
    var input = document.createElement("input");
    input.type = "file"
    input.style.zIndex = 12;
    input.style.position = 'absolute';
    input.style.margin = 'auto';
    var loadingData = function () {
        var file = input.files[0];
        var reader = new FileReader();
        if (type == "text") {
            reader.readAsText(file);
        } else if (type == "dataURL") {
            reader.readAsDataURL(file);
        } else {
            reader.readAsArrayBuffer(file)
        }
        //将文件以文本形式读入页面
        input.remove()
        reader.onload = function () {
            fun(this.result, that)
        }
    }
    input.onchange = function () {
        loadingData()
    }
    document.body.appendChild(input);
}

/**读取文件 */
FileManager.web.loadFile = function (fun, type, that) {
    var input = document.createElement("input");
    input.type = "file"
    input.style.display = "none"
    var loadingData = function () {
        var file = input.files[0];
        var reader = new FileReader();
        if (type == "text") {
            reader.readAsText(file);
        } else if (type == "dataURL") {
            reader.readAsDataURL(file);
        } else {
            reader.readAsArrayBuffer(file)
        }
        //将文件以文本形式读入页面
        input.remove()
        reader.onload = function () {
            fun(this.result, that)
        }
    }
    input.onchange = function () {
        loadingData()
    }
    input.click()
}

/**保存blob大数据
 */
FileManager.web.saveBlob = function (blob, fileName) {
    var aLink = document.createElement('a');
    aLink.download = fileName;
    aLink.href = window.URL.createObjectURL(blob);

    //aLink.click()
    /*
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错 
    aLink.dispatchEvent(evt);
    */
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    aLink.dispatchEvent(event);
}
/**保存数据 */
FileManager.web.saveData = function (data, filename) {
    var blob = new Blob([data])
    this.saveBlob(blob, filename)
    return data;
}

/**保存png */
FileManager.web.savePng = function (bitmap, filename, type) {
    var type = type || 'png';
    if (bitmap instanceof Bitmap) {
        var dataURL = bitmap.canvas.toDataURL(type);
        return this.saveDataURL2png(dataURL, filename, type);
    } else {
        return false
    }
}

/**保存DataURL到png格式(数据,文件名,文件夹名)*/
FileManager.web.saveDataURL2png = function (dataURL, filename, type) {
    var type = type || 'png';
    if (!dataURL) {
        return false
    };
    function base64Img2Blob(code) {
        var parts = code.split(';base64,');
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);
        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: contentType });
    }
    // 下载后的文件名
    var filename = filename + '.' + type;
    var blob = base64Img2Blob(dataURL)

    // download
    this.saveBlob(blob, filename);
    return dataURL;
}




FileManager.fs = {}

FileManager.fs.fs = require("fs")

/**读取 文件/文件夹 数据 
 *  dirPath 目录位置 
 *  name  名称 
 *  type  种类(单独/全部)
*/

FileManager.fs.loadStateSync = function (dirpath, name, type) {
    if (!Utils.isNwjs()) {
        console.log("not is Nwjs")
        return {}
    }
    var fs = require('fs');
    var loadStateSync = function (dirpath, name, type) {
        var file = {}
        file.dirpath = dirpath
        file.name = name
        var url = FileManager.dirName2Url(dirpath, name)
        if (fs.existsSync(url)) {
            var filesj = fs.statSync(url)
            if (filesj.isDirectory()) {
                file.stat = filesj
                file.type = "dir"
                if (type > 0) {
                    file.list = loadDirListSync(url, type - 1)
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
    var loadDirListSync = function (dirpath, type) {
        var files = fs.readdirSync(dirpath)
        var list = []
        files.forEach(
            function (filename) {
                var file = loadStateSync(dirpath, filename, type)
                list.push(file)
            }
        )
        return list
    }
    var state = loadStateSync(dirpath, name, type)
    return state
}
/**文件夹地址 */
FileManager.fs.dirPath = function (dirpath) {
    var fs = require('fs');
    if (fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath);
    }
    return dirpath;
}
/**制作文件夹 */
FileManager.fs.mkdir = function (dirpath) {
    var fs = require('fs');
    fs.mkdirSync(dirpath);
}
/**保存数据(数据,文件名,文件夹名)*/
FileManager.fs.saveData = function (data, filePath) {
    var fs = require('fs');
    fs.writeFileSync(filePath, data);
    return data;
};


/**保存图片到png格式(图片,文件名,文件夹名)*/
FileManager.fs.savePng = function (bitmap, filePath, type) {
    var type = type || 'png';
    if (bitmap instanceof Bitmap) {
        var dataURL = bitmap.canvas.toDataURL(type);
        return this.saveDataURL2png(dataURL);
    } else {
        return false
    }
}

/**保存DataURL到png格式(数据,文件名,文件夹名)*/
FileManager.fs.saveDataURL2png = function (dataURL, filePath, type) {
    if (!dataURL) {
        return false
    };
    var imgData = dataURL;
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');
    var filePath = filePath + "." + type
    this.saveData(dataBuffer, filePath)
    return imgData;
}



/*读取数据 (文件名,文件夹名)*/
FileManager.fs.LoadData = function (filePath,type) {
    var fs = require('fs');
    var data = null
    if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath,type);
    };
    return data;
}



FileManager.fs._localURL = ""
FileManager.fs.localURL = function () {
    
    if (!this._localURL) {
        var path = null// require && typeof(require) =="function" && require('path');  
        if (path) {
            this._localURL = path.dirname(process.mainModule.filename)
        } else {
            var pathname = window.location.pathname
            var path = pathname.replace(/(\/www|)\/[^\/]*$/, "");
            if (path.match(/^\/([A-Z]\:)/)) {
                path = path.slice(1);
            }
            this._localURL = decodeURIComponent(path);
        }
    } 
    return this._localURL
};

FileManager.fs.localFileName = function (name) { 
    if (name) {
        var namelist = name.split("/")
        var dirPath = this.localURL()
        var fs = require('fs');
        var d = ""
        for (var i = 0; i < namelist.length - 1; i++) {
            d = d + ((d || dirPath) ? '/' : "") + namelist[i];
            var d2 = dirPath + d
            if (!this._dirs[d]) {
                if (!fs.existsSync(d2)) {
                    fs.mkdirSync(d2);
                }
                this._dirs[d] = 1
            }
        }
        d = d + ((d || dirPath) ? '/' : "") + namelist[i];
        return dirPath + d
    }  
}
/**获取所有文件 */
FileManager.fs.getAllfile = function (pagh) {
    var o = {}
    var fs = require('fs');
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
    }
    return get(path)
}
/**获取所有文件 */
FileManager.fs.getMd5 = function(date,type){
    var t = type || "md5"
    var c = require('crypto')
    var m = c.createHash(t)
    m.update(date)
    var z = m.digest("hex").toUpperCase();;
    return z
}