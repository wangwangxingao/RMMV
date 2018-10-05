var ww = ww || {}


ww.lsxls = {}

/**
 * 保存
 * @param {*} sheet 表格/二维数组
 * @param {*} name 名称
 * @param {*} list 合并设置
 */
ww.lsxls.save = function (sheet, name, list) {
    var fs = require("fs")
    if (!fs) {
        ww.lsxls.down(sheet, name, list);
        return
    }
    var sheet = ww.lsxls.toSheet(sheet, list)
    var data = new Buffer(ww.lsxls.sheet2Uint8Array(sheet))
    ww.lsxls.writeFileSync(name, data)
}

/**
 * 下载
 * @param {*} sheet 表格/二维数组
 * @param {*} name 名称
 * @param {*} list 合并设置
 */
ww.lsxls.down = function (sheet, name, list) {
    var sheet = ww.lsxls.toSheet(sheet, list)
    var blob = ww.lsxls.sheet2Blob(sheet)
    console.log(blob)
    ww.lsxls.downBlob(blob, name)
}


/**
 * 获取
 * @param {string} url
 * @param {function(result)} load
 * 
 */
ww.lsxls.load = function (url, onload) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = "arraybuffer"
    var onload = onload || ww.lsxls.onload
    xhr.onloadend = function () {
        if (xhr.status < 400) {
            try {
                var result = ww.lsxls.onloadxls(xhr.response, xhr)
                if (typeof onload == "function") {
                    onload(result, url)
                } else {
                    console.log(result)
                }
            } catch (error) {
                console.error("未能读取")
            }
            return
        }
        console.error("未能读取")
    };
    /* xhr.onerror = function () {
        console.error("未能读取")
    } */
    //xhr. = onloadend
    xhr.send()
    return xhr
}







/**
 * 
 * 表格操作
 * 
 * 
 */


/**
 * 合并表格  
 * @param {*} sheet 表格或数组
 * @param {*} list 
 */
ww.lsxls.sheetMerges = function (sheet, list) {

    if (Array.isArray(sheet)) {
        var sheet = XLS.utils.aoa_to_sheet(sheet)
    }
    if (Array.isArray(list) && list.length) {
        sheet['!merges'] = sheet['!merges'] || [];
        for (var i = 0; i < list.length; i++) {
            var l = list[i]
            sheet['!merges'].push(
                { s: { r: l[0], c: l[1] }, e: { r: l[2], c: l[3] } }
            )
        }
    }
    return sheet
}



/**转化为表格 */
ww.lsxls.toSheet = function (object, type) {
    if (Array.isArray(object)) {
        return XLS.utils.aoa_to_sheet(object)
        //: 这个工具类最强大也最实用了，将一个二维数组转成sheet，会自动处理number、string、boolean、date等类型数据； 
    } else if (typeof object == "object") {
        if (object.tagName == "TABLE") {
            XLS.utils.table_to_sheet(Object) //: 将一个table dom直接转成sheet，会自动识别colspan和rowspan并将其转成对应的单元格合并； 
        } else if (object["!ref"]) {
            return object
        } else {
            return XLS.utils.json_to_sheet(object)//: 将一个由对象组成的数组转成sheet； 
        }
    }

};


/**
 * 转化为json对象
 * @param {*} workbook xls表格组
 * @param {*} type 种类 对象/数组
 */
ww.lsxls.toJson = function (workbook, type) {
    var result = type ? [[], []] : {};
    workbook.SheetNames.forEach(function (sheetName) {
        var roa = XLS.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        if (roa.length) {
            if (!type) {
                result[sheetName] = roa;
            } else {
                result[0].push(sheetName)
                result[1].push(roa);
            }
        };
    });
    return result;
};



/**
 * 表格转uint8arry
 * @param {*} sheet 
 * @param {*} sheetName 
 */
ww.lsxls.sheet2Uint8Array = function (sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLS.write(workbook, wopts);
    // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xFF
        };
        return view;
    }
    var view = s2ab(wbout)
    return view;
}

/**
 * 
 * @param {*} sheet 
 * @param {*} sheetName 
 */
ww.lsxls.sheet2Blob = function (sheet, sheetName) {
    var buf = ww.lsxls.sheet2Uint8Array(sheet, sheetName)
    var blob = new Blob([buf], { type: "application/octet-stream" });

    return blob;
}


/***
 * 
 * 读取方法
 * 
 * 
 * 
 */



ww.lsxls._load = {}
/**
 * 默认当读取
 * @param {*} result 
 * @param {*} url 
 */
ww.lsxls.onload = function (result, url) {
    ww.lsxls._load[url] = result
    console.log(result)
};


/**
 * 当读取xls数据
 * @param {*} response 
 * @param {*} xhr 
 */
ww.lsxls.onloadxls = function (response, xhr) {
    var result = {}
    if (response) {
        var data = new Uint8Array(response)
        var wb = XLS.read(data, { type: 'array' })
        var result = ww.lsxls.toJson(wb)
    }
    return result;
};






// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载



/***
 * 下载/保存方法
 * 
 * 
 */



/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
ww.lsxls.downBlob = function (url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) {
        event = new MouseEvent('click');
    } else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}




/**
 * 位置
 */

ww.lsxls.localdir = function () {
    if (!ww.lsxls._localdir) {
        var path = null;// require &&typeof(require) =="function" && require('path');  
        if (path) {
            ww.lsxls._localdir = path.dirname(process.mainModule.filename)
        } else {
            var pathname = window.location.pathname
            var path = pathname.replace(/(\/www|)\/[^\/]*$/, "");
            if (path.match(/^\/([A-Z]\:)/)) {
                path = path.slice(1);
            }
            ww.lsxls._localdir = decodeURIComponent(path);
        }
    }
    return ww.lsxls._localdir
};



ww.lsxls._dirs = {}
/**本地文件位置名称
 * 
 * 获取一个位置的本地名称,如果没有,创建地址
 * 
 * 
 */
ww.lsxls.localFileName = function (name) {
    if (name) {
        var namelist = name.split("/")
        var dirPath = ww.lsxls.localdir()
        var fs = require('fs');
        var d = ""
        for (var i = 0; i < namelist.length - 1; i++) {
            d = d + ((d || dirPath) ? '/' : "") + namelist[i];
            var d2 = dirPath + d
            if (!ww.lsxls._dirs[d]) {
                /**如果文件夹是空的 */
                if (!fs.existsSync(d2)) {
                    /**制作文件夹 */
                    fs.mkdirSync(d2);
                }
                ww.lsxls._dirs[d] = 1
            }
        }
        d = d + ((d || dirPath) ? '/' : "") + namelist[i];
        return dirPath + d
    }
}

 
ww.lsxls.writeFileSync = function (file, data, options) {
    var fs = require("fs")
    return fs.writeFileSync(ww.lsxls.localFileName(file), data, options)
}