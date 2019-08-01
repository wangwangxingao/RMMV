var ww = ww || {}

/**
 * 后台运行
 */
ww.worker = {}


/**
 * 后台运行组
 */
ww.worker._workers = {}


/**
 * 打开
 * @param {string|number} name 名称 
 * @param {string} js js文本
 * @param {function} fun 运行方法
 * @param {function} err 错误
 */
ww.worker.open = function (name, js, fun, err) {
    try {
        this.del(name)
        if (js) {
            var blob = new Blob([js]);
            var url = window.URL.createObjectURL(blob);
        } else {
            var url = PluginManager._path + name + ".js"
        }
        var worker = new Worker(url, {
            name: name
        });
        worker.url = url
        this._workers[name] = {
            worker: worker,
            do: typeof fun == "function" ? fun : null,
            err: typeof err == "function" ? err : null,
        }

        worker.onmessage = function (e) {
            ww.worker.do(name, e.data, e)
        }


        worker.onerror = function (e) {
            ww.worker.err(name, e)
        }
        worker.onmessageerror = function (e) {
            ww.worker.err(name, e, 1)
        }

        return true
    } catch (error) {
        this._workers[name] = false
        console.error(name, js, fun, err)
        return false
    }
}
/**
 * 接受信息后运行
 * @param {string|number} name 
 * @param {*} data 
 * @param {*} e 
 */
ww.worker.do = function (name, data, e) {
    var set = this._workers[name]
    if (set) {
        if (set.do) {
            set.do(data, e, name)
        }
    }
}

/**
 * 当错误
 * @param {string|number} name 
 * @param {*} e 
 * @param {*} t 
 */
ww.worker.err = function (name, e, t) {
    var set = this._workers[name]
    if (set) {
        if (set.err) {
            set.err(e, t)
        }
    }
}
/**
 * 设置运行
 * @param {string|number} name 
 * @param {function} fun 
 */
ww.worker.setdo = function (name, fun) {
    var set = this._workers[name]
    if (set) {
        set.do = typeof fun == "function" ? fun : null
    }
}
/**
 * 设置错误 
 * @param {string|number} name 
 * @param {function} fun 
 */
ww.worker.seterr = function (name, fun) {
    var set = this._workers[name]
    if (set) {
        set.err = typeof fun == "function" ? fun : null
    }
}
/**
 * 推送消息
 * @param {string|number} name 
 * @param {*} data 
 */
ww.worker.push = function (name, data, type) {
    var set = this._workers[name]
    if (set && set.worker) {
        set.worker.postMessage(data, type)
    }
}
/**
 * 关闭
 * @param {string|number} name 
 */
ww.worker.close = function (name) {
    var set = this._workers[name]
    if (set && set.worker) {
        set.worker.terminate()
    }
}
/**
 * 删除
 * @param {string|number} name 
 */
ww.worker.del = function (name) {
    this.close(name)
    delete this._workers[name]
}





var ww = ww || {}
ww.gif = {}
ww.gif.save = {}
ww.gif._loadListeners = {}


/**
 * 清除
 * @param {*} name 
 */
ww.gif.clear = function (name) {
    if (name !== void 0) {
        delete ww.gif.save[name]
        delete ww.gif._loadListeners[name]
    } else {
        ww.gif.save = {}
        ww.gif._loadListeners = {}
    }
}
/**
 * 设置
 * @param {string} name 名称
 * @param {*} info 信息
 */
ww.gif.set = function (name, info) {
    if (info && name) {
        info.name = name
        ww.gif.save[name] = info
        ww.gif._callLoadListeners(name)
    }
}

ww.gif.addLoadListener = function (name, listner) {
    if (!ww.gif.save[name]) {
        if (!ww.gif._loadListeners[name]) {
            ww.gif._loadListeners[name] = []
        }
        ww.gif._loadListeners[name].push(listner);
    } else {
        listner(ww.gif.save[name]);
    }
};

ww.gif._callLoadListeners = function (name) {
    var l = ww.gif._loadListeners[name]
    if (Array.isArray(l) && ww.gif.save[name]) {
        while (l.length > 0) {
            var listener = l.shift();
            listener(ww.gif.save[name]);
        }
    }
};



/**
 * 临时
 */
ww.gif.temp = {}
/**
 * 解析数据
 * @param {*} info 
 */
ww.gif.parseData = function (info) {
   
    if (!info) {
        return
    }
    var name = info.name
    var i = info.index
    var data = info.data
    ww.gif.temp[name] = ww.gif.temp[name] || []

    //创建canvans 
    var bitmap = new Bitmap(info.w, info.h);
    var canvas = bitmap.canvas;
    // var bitmap = canvas = document.createElement('canvas') 
    //var canvas = document.createElement('canvas'),
    //获取上下文
    ///ctx = canvas.getContext('2d');
    //获取上下文
    var ctx = canvas.getContext('2d');
    var imgData = ctx.getImageData(0, 0, info.w, info.h);

    imgData.data.set(new Uint8ClampedArray(info.data))

    ctx.putImageData(imgData, 0, 0);
    //e.canvas = canvas
    ww.gif.temp[name][i] = bitmap
    return info
}
/**
 * gif解析图片信息
 * @param {*} buffer buffer
 */

ww.gif.parseInfo = function (info) {
    if (!info) {
        return
    }
    info.time =0
    info.frames.forEach(function (e, i) {
        info.time+= e.ctrl ? e.ctrl.delay || 0 : 0
        //创建canvans  
        if (ww.gif.temp[info.name] && ww.gif.temp[info.name][i]) {
            //e.canvas = canvas
            e.bitmap = ww.gif.temp[info.name][i]
            // info.datas[i] = 0
        }
    });
    delete ww.gif.temp[info.name]
    return info
}

/**
 * 处理数据
 * @param {*} data 
 */
ww.gif.do = function (data) {
    if (typeof data == "object" && data) {
        if (data.data) {
            ww.gif.parseData(data)
        } else if (data.info) {
            var name = data.name
            var info = data.info
            ww.gif.parseInfo(info)
            if (ww.gif.save[name] === 0) {
                ww.gif.set(name, info)
            }
        }
    } else {
        console.log(data)
    }
}
 
/**
 * gif解析 非worker 
 * @param {*} buffer buffer
 */

ww.gif.parse = function (buffer, name) {
    //转化为uint8array 
    var view = new Uint8Array(buffer),
        offset = 0,
        lastDisp = -1,
        lastCans = null,
        imgData, tab,
        info = {
            name: name,
            frames: [],
            comment: ''
        },
        frame;

    //读取
    function read(len) {
        return view.slice(offset, offset += len);
    }

    /**
     * 获取头
     */
    function getHeader() {
        info.header = '';
        read(6).forEach(function (e, i, arr) {
            info.header += String.fromCharCode(e);
        });
    }
    /**
     * 得到 scr 降序
     */
    function getScrDesc() {
        var arr = read(7),
            i;
        info.w = arr[0] + (arr[1] << 8);
        info.h = arr[2] + (arr[3] << 8);
        info.m = 1 & arr[4] >> 7;
        info.cr = 7 & arr[4] >> 4;
        info.s = 1 & arr[4] >> 3;
        info.pixel = arr[4] & 0x07;
        info.bgColor = arr[5];
        info.radio = arr[6];
        if (info.m) {
            info.colorTab = read((2 << info.pixel) * 3);
        }
        decode();
    }

    /**
     * 解码 
     **/
    function decode() {
        var arr = read(1),
            s, codeSize, i, ss,
            srcBuf = [];
        switch (arr[0]) {
            case 33: //扩展块
                extension();
                break;
            case 44: //图像标识符
                arr = read(9);
                frame.img = {
                    x: arr[0] + (arr[1] << 8),
                    y: arr[2] + (arr[3] << 8),
                    w: arr[4] + (arr[5] << 8),
                    h: arr[6] + (arr[7] << 8),
                    colorTab: 0
                };
                frame.img.m = 1 & arr[8] >> 7;
                frame.img.i = 1 & arr[8] >> 6;
                frame.img.s = 1 & arr[8] >> 5;
                frame.img.r = 3 & arr[8] >> 3;
                frame.img.pixel = arr[8] & 0x07;
                if (frame.img.m) {
                    frame.img.colorTab = read((2 << frame.img.pixel) * 3);
                }
                frame.img.codeSize = read(1)[0];
                srcBuf = [];
                while (1) {
                    arr = read(1);
                    if (arr[0]) {
                        read(arr[0]).forEach(function (e, i, arr) {
                            srcBuf.push(e);
                        });
                    } else {
                        frame.img.srcBuf = srcBuf;
                        decode();
                        break;
                    }
                };
                break;
            case 59:
                //console.log('The end.', offset, buffer.byteLength)
                break;
            default:
                //console.log(arr);
                break;
        }
    }

    /**
     * 延期
     */
    function extension() {
        var arr = read(1),
            o, s;
        switch (arr[0]) {
            case 255: //应用程序扩展
                if (read(1)[0] == 11) {
                    info.appVersion = '';
                    read(11).forEach(function (e, i, arr) {
                        info.appVersion += String.fromCharCode(e);
                    });
                    while (1) {
                        arr = read(1);
                        if (arr[0]) {
                            read(arr[0]);
                        } else {
                            decode();
                            break;
                        }
                    };
                } else {
                    throw new Error('解析出错');
                }
                break;
            case 249: //图形控制扩展
                if (read(1)[0] == 4) {
                    arr = read(4);
                    frame = {};
                    frame.ctrl = {
                        disp: 7 & arr[0] >> 2,
                        i: 1 & arr[0] >> 1,
                        t: arr[0] & 0x01,
                        delay: arr[1] + (arr[2] << 8),
                        tranIndex: arr[3]
                    };
                    info.frames.push(frame);
                    if (read(1)[0] == 0) {
                        decode();
                    } else {
                        throw new Error('解析出错');
                    }
                } else {
                    throw new Error('解析出错');
                }
                break;
            case 254: //注释块
                arr = read(1);
                if (arr[0]) {
                    read(arr[0]).forEach(function (e, i, arr) {
                        info.comment += String.fromCharCode(e);
                    });
                    if (read(1)[0] == 0) {
                        decode();
                    };
                }
                break;
            default:
                //console.log(arr);
                break;
        }
    }


    getHeader(), getScrDesc();
    //window.gif = info;
    ww.gif.parseBitmap(info)
    //console.log(info)
    return info
}
ww.gif.parseBitmap = function (info) {
   
    if (!info) {
        return
    }
    var offset = 0,
        lastDisp = -1,
        lastCans = null,
        imgData, tab,
        info = info || {
            frames: [],
            comment: ''
        },
        frame;

    info.time = 0
    info.frames.forEach(function (e, i) {
        //console.log(e,i)
        //创建canvans 
        info.time+= e.ctrl ? e.ctrl.delay || 0 : 0
        var bitmap = new Bitmap(info.w, info.h);
        var canvas = bitmap.canvas;
        // var bitmap = canvas = document.createElement('canvas')


        //var canvas = document.createElement('canvas'),
        //获取上下文
        ///ctx = canvas.getContext('2d');
        //获取上下文
        var ctx = canvas.getContext('2d');
        e.img.m ? tab = e.img.colorTab : tab = info.colorTab;
        canvas.width = info.w;
        canvas.height = info.h;
        //添加画布到body
        //document.body.insertBefore(canvas, el);
        imgData = ctx.getImageData(e.img.x, e.img.y, e.img.w, e.img.h);
        //解压
        ww.gif.lzw(e.img.srcBuf, e.img.codeSize).decode().forEach(function (j, k) {
            imgData.data[k * 4] = tab[j * 3];
            imgData.data[k * 4 + 1] = tab[j * 3 + 1];
            imgData.data[k * 4 + 2] = tab[j * 3 + 2];
            imgData.data[k * 4 + 3] = 255;
            e.ctrl.t ? (j == e.ctrl.tranIndex ? imgData.data[k * 4 + 3] = 0 : 0) : 0;
        });
        ctx.putImageData(imgData, e.img.x, e.img.y, 0, 0, e.img.w, e.img.h);
        imgData = ctx.getImageData(0, 0, info.w, info.h);

        if (lastCans) {
            var lastData = lastCans.getContext('2d').getImageData(0, 0, info.w, info.h);
            for (var i = 0; i < imgData.data.length; i += 4) {
                if (imgData.data[i + 3] == 0) {
                    imgData.data[i] = lastData.data[i];
                    imgData.data[i + 1] = lastData.data[i + 1];
                    imgData.data[i + 2] = lastData.data[i + 2];
                    imgData.data[i + 3] = lastData.data[i + 3];
                }
            }
            ctx.putImageData(imgData, 0, 0);
        }
        lastDisp = e.ctrl.disp;
        if (e.ctrl.disp === 1 || e.ctrl.disp === 0) {
            lastCans = canvas;
        }
        //e.canvas = canvas
        e.bitmap = bitmap
    });
    return info
}
/**
 * LZW
 * @param {*} arr 
 * @param {*} min 
 */
ww.gif.lzw = function (arr, min) {
    var clearCode = 1 << min,
        eofCode = clearCode + 1,
        size = min + 1,
        dict = [],
        pos = 0;

    function clear() {
        var i;
        dict = [];
        size = min + 1;
        for (i = 0; i < clearCode; i++) {
            dict[i] = [i];
        }
        dict[clearCode] = [];
        dict[eofCode] = null;
    }

    function decode() {
        var out = [],
            code, last;
        while (1) {
            last = code;
            code = read(size);
            if (code == clearCode) {
                clear();
                continue;
            }
            if (code == eofCode) {
                break;
            }
            if (code < dict.length) {
                if (last !== clearCode) {
                    dict.push(dict[last].concat(dict[code][0]));
                }
            } else {
                if (code !== dict.length) {
                    throw new Error('LZW解析出错');
                }
                dict.push(dict[last].concat(dict[last][0]));
            }
            out.push.apply(out, dict[code]);
            if (dict.length === (1 << size) && size < 12) {
                size++;
            }
        }
        return out;
    }

    function read(size) {
        var i, code = 0;
        for (i = 0; i < size; i++) {
            if (arr[pos >> 3] & 1 << (pos & 7)) {
                code |= 1 << i;
            }
            pos++;
        }
        return code;
    }
    return {
        decode: decode
    }
}



/**
 * 读取gif
 * @param {*} name 
 */
ww.gif.load = function (name) {
    if (!name || ww.gif.save[name] || ww.gif.save[name] === 0) {
        return
    }
    ww.gif.save[name] = 0
    var xhr = new XMLHttpRequest();
    var url = 'img/gif/' + name + ".gif";
    xhr.open('GET', url);
    xhr.responseType = "arraybuffer"
    //xhr.overrideMimeType('application/json');
    xhr.onload = function () {
        if (xhr.status < 400) {
            if (ww.gif.save[name] === 0) { 
                if (ww.gif.worker) {
                    ww.worker.push("gifworker", {
                        name: name,
                        buffer: xhr.response
                    }, [xhr.response])
                } else {
                    ww.gif.set(name, ww.gif.parse(xhr.response))
                }
            }
        }
    };
    xhr.onerror = function () {
        console.log(error)
    };
    xhr.send();
}


ww.gif.worker = ww.worker.open("gifworker", 0, ww.gif.do, console.log)

