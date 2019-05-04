//=============================================================================
// psdui.js
//=============================================================================

/**
 * @name psdui.js
 * @plugindesc PSD转换UI
 * @author 汪汪
 * @version 1.0
 *  
 * @help  
 *  
 * p = PSDManager.load("1")  //获取一个psd文件
 * p.saveAll()  //当读取后,保存这个psd文件的图片
 * 
 * PSDManager.saveData() 保存所有psd的数据及图片,生成一个 psdData.js ,使用该插件可以在不读取psd而是读取从psd中提取的png
 * 
 * 
 * 
 * 
 * 
 * 创建一个精灵(参数可不填)
 * s = new Sprire_PSD(path,data) 
 * 需要在psd 文件读取后进行调用,或不设置参数,在psd文件调用后使用下面的方法赋值,或者使用PSDManager.saveData() 保存png文件及psdData.js后加入psdData.js插件后调用
 * 
 * 设置psd精灵
 * s.setThis(path,data)
 * 
 *  
 * path   psd的路径,如 "1" psd文件1, "1/c1"  psd 文件1中的c1   "1/c1/c2"  psd 文件1中的c1的c2
 * data 一个对象或字符串或true/false  
 * false : 重置该层
 * true  : 重置该层及所有
 * 字符串 : 如果该层为图片层则设置为 pictures文件夹下的图片,如果为文本层则设置为文本
 * 对象: {位置:设置内容} 
 *    如 {"c1":{"bitmap":"123"}} 让该psd精灵中的c1层位图设置为图片 123
 *    如 {"c1":{"text":"1223"}} 让该psd精灵中的c1层位图设置为文本 1223
 *       可以添加 width,height参数重新定义宽高
 *    如 {"c1":{"re":true}} 让该psd精灵中的c1层重置 该层
 *    如 {"c1":{"reall":true}} 让该psd精灵中的c1层重置所有
 *    以上可以添加 x,y,visible,opacity 设置相关参数
 *  
 *    如 {"c1":false} 让该psd精灵中的c1层 重置 该层
 *    如 {"c1":true} 让该psd精灵中的c1层 重置 所有
 *     
 *    位置为"" 时为本身
 * 
 * 
 * 
 * 
 */

 var ww = ww ||{}
 ww.psd = true


/**
 * PSD管理器
 * PSDManager
 * 
 */

function PSDManager() {
    throw new Error('This is a static class');
}


PSDManager.PSD = require('psd');

/**
 * psd的文件夹
 */
PSDManager._path = "psd/"

/**
 * 
 * 获取一个PSD路径的列表
 * 
 * 
 */
PSDManager.getPSDPathList = function (name) {
    var list = []
    if (name) {
        var list = name.split("/")
    }
    return list;
}


/**获取一个路径中psd文件的名称 
 * 
*/
PSDManager.getPSDName = function (name) {
    var list = []
    if (name) {
        var list = name.split("/")
    }
    var psdname = list.shift()
    if (psdname) {
        return psdname
    }
    return "";
}


/**获取位图地址 */
PSDManager.getPSDBitmapPath = function (name) {
    return this._path + name + ".png"
}


/**获取psd位置 */
PSDManager.getPSDPath = function (name) {
    return this._path + name + ".psd"
}



/**
 * ===============================================
 * PSDManager 树的保存  
 * ===============================================
 * 
 */

PSDManager._data = {}

PSDManager.setData = function (name, tree) {
    if (tree) {
        tree.name = name
        tree.type = "root"
        tree.visible = true
        tree.opacity = 1
        this._data[name] = tree
    }
}

/**获取树 */
PSDManager.getData = function (name) {
    return this._data[name]
}




/**获取节点中的特定名称的子节点 */
PSDManager.getDataNodeChild = function (node, name) {
    if (!node || !node.children) {
        return
    } else {
        for (var i = node.children.length - 1; i >= 0; i--) {
            var n = node.children[i]
            if (n && n.name == name) {
                return n
            }
        }
    }
    return
}


/**获取节点 */
PSDManager.getDataNode = function (name) {
    var psdlist = PSDManager.getPSDPathList(name)
    if (psdlist.length) {
        var psdname = psdlist.shift()
        if (psdname) {
            var node = PSDManager.getData(psdname)
            var n = ""
            while (n = psdlist.shift()) {
                if (node) {
                    node = PSDManager.getDataNodeChild(node, n)
                } else {
                    return
                }
            }
            return node
        }
    }
    return
}


/**树节点的种类 */
PSDManager.getDataType = function (node) {
    if (node) {
        if (node.type == "layer") {
            if (node.text) {
                return "text"
            }
        }
        return node.type
    }
    return ""
}


/**
 * 获取文本节点的设置
 */
PSDManager.getDataNodeTextSet = function (node) {
    var re = ""
    var font = node && node.text && node.text.font
    if (font) {
        var c = font.colors //&& font.sizes[0]
        var fontName = font.name //&& font.sizes[0]
        var fontSize = font.sizes && font.sizes[0]
        var alignments = { "center": 1, "left": 0, "right": 2 }
        var alignment = alignments[font.alignment] || 0
        if (c) {
            re += "\\c[rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (c[3] / 255) + ")]"
        }
        if (fontName) {
            re += ""
        }
        if (fontSize) {
            re += "\\{}[" + fontSize + "]"
        }
        if (alignment) {
            re += "\\wt[" + alignment + "]"
        }
    }
    return re
}



/**
 * ===================================
 * 读取 psd 
 * ===================================
 * 
 */
PSDManager._items = {}

PSDManager._isNoReady = 0
/**添加一个读取 */
PSDManager.add = function (name) {
    var name = PSDManager.getPSDName(name)
    if (!this._items[name]) {
        PSDManager.mustReady(name)
        this._items[name] = {
            name: name,
            value: new PSDFile(name),
            touch: Date.now(),
        };
    }
};

/**获取一个psd */
PSDManager.get = function (name) {
    var name = PSDManager.getPSDName(name)
    if (this._items[name]) {
        var item = this._items[name];
        item.touch = Date.now();
        return item.value;
    }
    return null;
};

/*读取一个psd*/
PSDManager.load = function (name) {
    this.add(name)
    return this.get(name)
}

/**没有准备好 */
PSDManager.isReady = function () {
    return !this._isNoReady
}

/**需要准备 */
PSDManager.mustReady = function (name) {
    this._isNoReady = this._isNoReady || {}
    this._isNoReady[name] = 1
}
/**结束准备 */
PSDManager.overReady = function (name) {
    if (this._isNoReady) {
        delete this._isNoReady[name]
        var l = Object.getOwnPropertyNames(this._isNoReady)
        if (!l.length) {
            this._isNoReady = 0
        }
    }
}


PSDManager.isPSDNodeType = function (psdnode) {
    if (psdnode) {
        if (psdnode.isLayer()) {
            return "layer"
        } else if (psdnode.isRoot()) {
            return "root"
        } else {
            return ""
        }
    }
    return ""
}



/**
 * =================================
 * 处理位图 
 * =================================
 * 
 */

/**如果没有位图,创建一个新的位图并调用读取 */
PSDManager.newPSDBitmap = function (name) {
    var psdname = PSDManager.getPSDName(name)
    if (psdname) {
        var psd = PSDManager.load(psdname)
        psd.addLoadListener(
            function () {
                psd.setPSDPathBitmap(name)
            }
        )
    } else {
        return true
    }
}

/**位图 通过节点
 * 
 * bitmap  需要绘制的位图
 * psdnode  psd节点,只有是layer或者root时进行绘制
 * 
 * 
 */
PSDManager.bitmapByPSDNode = function (bitmap, psdnode) {
    bitmap._loadingState = "loaded"
    var type = PSDManager.isPSDNodeType(psdnode)
    if (type == "root") {
        var w = psdnode.psd.image.width()
        var h = psdnode.psd.image.height()
        var d = psdnode.psd.image.pixelData
        PSDManager.bitmapBywhPixelData(bitmap, w, h, d)
    } else if (type == "layer") {
        var w = psdnode.layer.image.width()
        var h = psdnode.layer.image.height()
        var d = psdnode.layer.image.pixelData
        PSDManager.bitmapBywhPixelData(bitmap, w, h, d)
    }
    bitmap._callLoadListeners()
}


/**位图 通过宽高和数据 */
PSDManager.bitmapBywhPixelData = function (bitmap, w, h, data) {

    bitmap.resize(w, h)
    //环境 = 环境 
    var context = bitmap._context;
    var imageData = context.getImageData(0, 0, bitmap.width, bitmap.height);
    var pixels = imageData.data;
    for (var i = 0, len = data.length; i < len; i++) {
        pixels[i] = data[i];
    }
    context.putImageData(imageData, 0, 0);
    //设置发生更改()
    bitmap._setDirty();
}




/**
 * 设置全部psd位图到图片管理器
 * 
 */
PSDManager.setPSDAllBitmap = function (o) {
    var o = o || {}
    for (var psdpath in o) {
        this.setPSDPathBitmap(o, psdpath)
    }
    return o
}

/**设置psd位图
 * 
 */
PSDManager.setPSDPathBitmap = function (o, psdpath) {
    var o = o || {}
    var psdnode = o[psdpath]
    var bitmap = ImageManager.getPSDBitmap(psdpath)
    if (!bitmap.isReady()) {
        PSDManager.bitmapByPSDNode(bitmap, psdnode)
    }
    return o
}



/**获取所有的图片节点 */
PSDManager.getAllPSDBitmapNode = function (psdpath, psdnode, o) {
    var o = o || {}
    if (PSDManager.isPSDNodeType(psdnode)) {
        o[psdpath] = psdnode
    }
    if (psdnode && psdnode._children) {
        for (var i = 0; i < psdnode._children.length; i++) {
            var n = psdnode._children[i]
            if (n) {
                var p = psdpath + "/" + n.name
                PSDManager.getAllPSDBitmapNode(p, n, o)
            }
        }
    }
    return o
}





/**图片 获取 dataurl 
 * 
 * @param {"image/png"}  type 
*/
PSDManager.bitmap2DataURL = function (bitmap, type) {
    var imgData = ""
    if (!bitmap) {
    } else if (typeof bitmap == "string") {
        imgData = bitmap
    } else if (bitmap instanceof Bitmap) {
        imgData = bitmap.canvas && bitmap.canvas.toDataURL(type)
    } else {
        imgData = bitmap.toDataURL && bitmap.toDataURL(type)
    }
    return imgData || ""
}


/**
 * 
 * dataURL 转化为 buffer
 * @param {*} imgData 
 * 
 */
PSDManager.dataURL2Buffer = function (imgData) {
    if (!imgData) {
        var dataBuffer = new Buffer(0);
    } else {
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');
    }
    return dataBuffer;
}

/**
 * 
 * bitmap  转化为 buffer
 * @param {*} bitmap 
 * @param {*} type 
 */
PSDManager.bitmap2Buffer = function (bitmap, type) {
    var imgData = this.bitmap2DataURL(bitmap, type)
    return this.dataURL2Buffer(imgData);
}



/**
 * ================================== 
 * 保存部分 
 * ==================================
 *  
 * 
 */


try {
    PSDManager.fs = require('fs')
} catch (error) {
    PSDManager.fs = 0
}
PSDManager._dirs = {}
PSDManager.localdir = function () {
    if (!PSDManager.fs) { console.error("非本地模式"); return "" }


    if (this._localdir === undefined) {
        var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '');
        if (path.match(/^\/([A-Z]\:)/)) {
            path = path.slice(1);
        }
        this._localdir = decodeURIComponent(path);
        return this._localdir
        if (typeof require === 'function' && typeof process === 'object') {
            var path = require('path');
            var base = path.dirname(process.mainModule.filename);
            /* 打包时 */
            if (path.basename(base) == "www") {
                var base = path.dirname(base);
            }

            this._localdir = base;
        } else {
            this._localdir = ""
        }
    }
    return this._localdir
};
PSDManager.localFileName = function (name) {
    if (!PSDManager.fs) { console.error("非本地模式"); return }


    if (name) {
        var namelist = name.split("/")
        var dirPath = this.localdir()
        var fs = this.fs;
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



PSDManager.saveData = function () {
    this.saveDataJS()
    this.saveAllBitmap()
    this.saveDataJS()
}

PSDManager.saveAllBitmap = function () {

    for (var n in this._data) {
        var p = this.get(n)
        if (p) {
            p.saveALL()
        } else {
            delete this._data[n]
        }
    }
}

PSDManager.saveDataJS = function () {
    if (!PSDManager.fs) { console.error("非本地模式"); return }


    var path = "js/plugins/psdData.js"
    var h = "//=============================================================================\n\n// psdData.js\n//=============================================================================\n\n/*:\n * @plugindesc PSD内容\n * @author 汪汪\n * @version 1.0\n * \n * @help \n * 保存的psd文件结构,根据该插件可以不读取psd而采取读取的位图进行读取  \n * */"
    var f = ""//"\nImageManager.loadPSDBitmap=ImageManager.loadPSDBitmap2;\n"
    var tree = "\nPSDManager._data = " + JSON.stringify(this._data) + ";\n"
    var data = h + f + tree

    var file = PSDManager.localFileName(path)
    this.saveFile(file, data)
}



PSDManager.saveBitmap = function (name, bitmap) {
    if (!PSDManager.fs) { console.error("非本地模式"); return }


    var file = PSDManager.getPSDBitmapPath(name)
    var file = PSDManager.localFileName(file)
    var data = PSDManager.bitmap2Buffer(bitmap)
    return this.saveFile(file, data);
}


PSDManager.saveFile = function (file, data) {
    if (!PSDManager.fs) { console.error("非本地模式"); return }


    var fs = this.fs;
    return fs.writeFile(file, data);
}





PSDManager.savePSDAllBitmap = function (o) {

    var o = o || {}
    for (var psdpath in o) {
        this.savePSDPathBitmap(o, psdpath)
    }
}

/**
 * 保存节点的图片
 * 
 */
PSDManager.savePSDPathBitmap = function (o, psdpath) {
    var o = o || {}
    var psdnode = o[psdpath]
    if (psdnode) {
        var bitmap = ImageManager.getPSDBitmap(psdpath);
        if (bitmap && !bitmap.isReady()) {
            PSDManager.bitmapByPSDNode(bitmap, psdnode)
        }
        PSDManager.saveBitmap(psdpath, bitmap)
    }
}


function PSDFile() {
    this.initialize.apply(this, arguments);
}
PSDFile.index = 0

PSDFile.prototype.initialize = function (name) {
    //索引
    this._index = PSDFile.index++
    //名称
    this._name = ""
    //文件名称
    this._file = ""
    //psd文件
    this._psd = null
    //树
    this._tree = null
    //读取中
    this._loadingState = ""
    //触发时间
    this._touch = Date.now()

    this._bitmapNodes = {}

    this._loadListeners = []
    if (name) {
        this.load(name)
    }

}

/**读取 */
PSDFile.prototype.load = function (name) {
    //确保唯一性
    if (this._loadingState) { return }
    //文件位置
    var file = PSDManager.getPSDPath(name)
    //名称
    this._name = name
    //
    this._file = file
    if (name) {
        PSDManager.PSD.fromURL(file).then((function (psd) {
            console.log(psd)
            this.onLoad(psd)
        }).bind(this), (function (e) {
            console.error(e)
            this.onLoad()
        }).bind(this));
    } else {
        this.onLoad()
    }
}

/**是准备好 */
PSDFile.prototype.isReady = function () {
    return this.isLoaded() || this.isEmpty();
};

PSDFile.prototype.isLoaded = function () {
    return this._loadingState === 'loaded';
};

PSDFile.prototype.isEmpty = function () {
    return this._loadingState === 'null';
};

/**当触发 */
PSDFile.prototype.onTouch = function () {
    this._touch = Date.now()
}


/**当读取后 */
PSDFile.prototype.onLoad = function (psd) {
    PSDManager.overReady(this._name)
    if (psd) {
        this._psdFile = psd;
        this._psdTree = psd.tree()
        this._psdData = this._psdTree.export()
        this._loadingState = 'loaded'
        PSDManager.setData(this._name, this._psdData)
        this._bitmapNodes = this.getAllPSDBitmapNode(this._name, this._psdTree)
    } else {
        this._loadingState = 'null'
        this._psdTree = {}
        PSDManager.setData(this._name, {})
        this._bitmapNodes = this.getAllPSDBitmapNode(this._name)

    }
    //处理之后的事件
    this._callLoadListeners()
}


PSDFile.prototype.getAllPSDBitmapNode = function () {
    return PSDManager.getAllPSDBitmapNode(this._name, this._psdTree)
}

PSDFile.prototype.saveALL = function () {
    this.addLoadListener(this.doSaveALL.bind(this))
}

PSDFile.prototype.doSaveALL = function () {
    if (!this._haveSave) {
        this._haveSave = true
        PSDManager.savePSDAllBitmap(this._bitmapNodes)
    }
}


/**添加事件 */
PSDFile.prototype.addLoadListener = function (listner) {
    if (!this.isReady()) {
        this._loadListeners.push(listner);
    } else {
        listner(this);
    }
};

/**处理事件 */
PSDFile.prototype._callLoadListeners = function () {
    while (this._loadListeners.length > 0) {
        var listener = this._loadListeners.shift();
        listener(this);
    }
};


/**获取该位置的节点 */
PSDFile.prototype.getPathNode = function (path, opt) {
    if (this.isReady()) {
        //没有时,根节点
        if (!path) {
            return this._psdTree
        } else {
            var nodes = this._psdTree.childrenAtPath(path, opt)
            if (nodes) {
                return nodes[0]
            }
        }
    }
    return
};




/**保存所有位图节点 */
PSDFile.prototype.setPSDAllBitmap = function () {
    PSDManager.setPSDAllBitmap(this._bitmapNodes)
}

/**保存某位置的节点 */
PSDFile.prototype.setPSDPathBitmap = function (psdpath) {
    PSDManager.setPSDAllBitmap(this._bitmapNodes, psdpath)
}











function Sprire_PSD() {
    this.initialize.apply(this, arguments);
}

/**设置原形  */
Sprire_PSD.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprire_PSD.prototype.constructor = Sprire_PSD;

Sprire_PSD.prototype.initialize = function (path, data) {
    Sprite.prototype.initialize.call(this)
    this._path = ''
    this._data = {}
    this._hash = {}
    this._localhash = {}

    this.setThis(path, data)
}

Sprire_PSD.prototype.clear = function () {
    this.bitmap = ImageManager.loadEmptyBitmap()
    var s = null
    while (s = this.children[0]) {
        if (s) {
            this.removeChild(s)
        }
    }
}


Sprire_PSD.prototype.add2Down = function () {
    for (var i = 0; i < arguments.length; i++) {
        var s = arguments[i]
        if (s) {
            this.addChildAt(s, 0)
        }
    }
}


Sprire_PSD.prototype.setThis = function (path, data) {
    if (path) {
        this.setPSDPath(path)
    }
    if (data !== undefined) {
        this.setNodeData(data)
    }
}


Sprire_PSD.prototype.setPSDPath = function (path) {
    var data = PSDManager.getDataNode(path)
    this.setPSDData(data, path, "", "", {})
}

Sprire_PSD.prototype.setPSDData = function (data, path, fname, name, hash) {
    this.clear()
    this._data = data || ""
    this._fname = fname || ""
    this._name = name || ""
    this.name = this._name
    this._basePath = path || ""
    this._loaclPath = (fname ? fname + "/" : fname) + name || ""
    this._path = this._basePath + (this._loaclPath ? "/" + this._loaclPath : "")
    this._type = PSDManager.getDataType(data)

    var hash = hash || {}
    hash[this._loaclPath] = this
    if (this._type) {
        this._name = data.name
        if (this._type == "layer" || this._type == "text") {
            this.bitmap = ImageManager.loadPSDBitmapBase(this._path)
        }
        if (data.children) {
            //var mske = [] 
            for (var i = 0; i < data.children.length; i++) {
                var d = data.children[i]
                if (d) {
                    var s = new Sprire_PSD()
                    s.setPSDData(d, this._basePath, this._loaclPath, d.name, hash)
                    this._hash[d.name] = s
                    this.add2Down(s)
                }
            }
        }
        this.x = data.left || 0
        this.y = data.top || 0
        this.visible = data.visible || false
        this.opacity = (data.opacity || 0) * 255
    }
    this._localhash = hash
}

/**设置节点数据 */
Sprire_PSD.prototype.setNodeData = function (data) {
    var type = typeof (data)
    if (type == "object" && data) {
        for (var p in data) {
            this.setPathData(data[p], p)
        }
    } else {
        this.setThisData(data) 
    }
}




/**设置某个路径的数据 */
Sprire_PSD.prototype.setPathData = function (data, path) {
    var s = this
    if (path) {
        var s = this._localhash[path]
    }
    if (!s) { var s = this._hash[path] }
    if (!s) { return }
    s.setThisData(data)
}

Sprire_PSD.prototype.setThisData = function (data) {
    var d = this._data
    var type = PSDManager.getDataType(d)

    var dt = typeof (data)
    if (dt == "string") {
        if (type == "text") {
            this.setText(data)
        } else {
            this.setBitmap(data)
        }
    } else if (dt == "object" && data) {
        var re = data.re
        var reall = data.reall
        var bitmap = data.bitmap
        var text = data.text || data[0]
        if (type == "text") {
            text = text || data.value || ""
        } else {
            bitmap = bitmap || data.value || ""
        }
        if (re) {
            this.setReNode()
        } else if (reall) {
            this.setReAllNode()
        } else if (bitmap || !text) {
            this.setBitmap(bitmap)
        } else {
            this.setText(text, data.w || data.width || data[1] || 0, data.h || data.height || data[2] || 0)
        }
        if (data.x !== undefined) {
            this.x = data.x
        }
        if (data.y !== undefined) {
            this.y = data.y
        }
        if (data.visible !== undefined) {
            this.visible = data.visible
        }
        if (data.opacity !== undefined) {
            this.opacity = data.opacity
        }
    } else if (data) {
        this.setReAllNode()
    } else {
        this.setReNode()
    }
}

/**重置本节点 */
Sprire_PSD.prototype.setReNode = function () {
    var data = this._data
    var type = PSDManager.getDataType(data)
    if (type) {
        if (type == "layer" || type == "text") {
            this.bitmap = ImageManager.loadPSDBitmapBase(this._path)
        } else {
            this.bitmap = ImageManager.loadEmptyBitmap()
        }
        this.x = data.left || 0
        this.y = data.top || 0
        this.visible = data.visible || false
        this.opacity = (data.opacity || 0) * 255
    }
}


/**重置本节点及全部子节点 */
Sprire_PSD.prototype.setReAllNode = function () {
    this.setReNode()
    for (var i = this.children.length - 1; i >= 0; i--) {
        var n = this.children[i]
        n.setReAllNode()
    }
}



Sprire_PSD.prototype.setBitmap = function (name) {
    this.bitmap = ImageManager.loadPicture(name)
}


/**设置文本 */
Sprire_PSD.prototype.setText = function (t, w, h) {
    var data = this._data
    var type = PSDManager.getDataType(data)
    if (type) {
        console.log(data)
        var t = PSDManager.getDataNodeTextSet(data) + (t || "")
        var w = w || data.width
        var h = h || data.height
        var b = new Bitmap(w, h)
        var win = b.window()
        win.drawTextEx(t, 0, 0, w, h)
        this.bitmap = b
        console.log(this, b)
    }
}



/**
 * 图片管理器获取psd位图 
 * 
 * 通过读取psd文件
 * 
 */
ImageManager.getPSDBitmap = function (name) {
    if (!name) {
        return this.loadEmptyBitmap()
    }
    var path = PSDManager.getPSDBitmapPath(name)
    var key = path
    var bitmap = this._imageCache.get(key);
    if (!bitmap) {
        var bitmap = new Bitmap()
        bitmap._loadingState = "loading"
        this._imageCache.add(key, bitmap);
        if (PSDManager.newPSDBitmap(name)) {
            bitmap._loadingState = "loaded"
        }
    }
    return bitmap;
}

/**
 * 图片管理器 读取psd的png图片
 * 读取本地png文件
 * 
 */
ImageManager.loadPSDBitmapBase = function (name) {
    var path = PSDManager.getPSDBitmapPath(name)
    var key = path
    var bitmap = this._imageCache.get(key);
    if (!bitmap) {
        bitmap = Bitmap.load2(decodeURIComponent(path));
        this._imageCache.add(key, bitmap);
    }
    return bitmap
}


Bitmap.load2 = function (url) {
    //位图 = 创建位图
    var bitmap = Object.create(Bitmap.prototype);
    //延缓 = true 
    bitmap._defer = true;
    //初始化
    bitmap.initialize();
    bitmap._loader = function () {
        bitmap._loadingState = "loaded"
        bitmap._callLoadListeners()
    }
    //请求后解码 = true 
    bitmap._decodeAfterRequest = true;
    //请求图片(url)
    bitmap._requestImage(url);

    return bitmap;
};


/**读取位图通过hub */
ImageManager.loadPSDBitmap = function (name, hue) {
    if(!hue){
        return ImageManager.loadPSDBitmapBase(name)
    }
    var path = PSDManager.getPSDBitmapPath(name)
    var key = this._generateCacheKey(path, hue);
    var bitmap = this._imageCache.get(key);
    if (!bitmap) {
        bitmap = new Bitmap()
        bitmap._loadingState = "loading"
        var b = ImageManager.loadPSDBitmapBase(name)
        b.addLoadListener(function () {
            bitmap.resize(b.width, b.height)
            bitmap.blt(b, 0, 0, b.width, b.height, 0, 0, b.width, b.height)
            bitmap.rotateHue(hue)
            bitmap._loadingState = 'loaded';
            bitmap._callLoadListeners();
        })
        this._imageCache.add(key, bitmap);
    }
    return bitmap
}


