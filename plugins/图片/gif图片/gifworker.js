/**
 * 
 * 
 * 
 * 
 * @help
 * 本插件不用添加!!
 */

var ww = ww || {}
ww.gif = {}
/**
 * 解析
 * 
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
    return info
}
/**获取真实位置 */
ww.gif.getImageDataPos = function (k, w, h, fx, fy, fw, fh) {

    var ry = Math.floor(k / fw)
    var rx = k % fw 
    var rx2 = rx + fx
    var ry2 = ry + fy

    return ry2 * w + rx2
}
/**获取数据 */
ww.gif.getImageData = function (x, y, w, h) {
    return new Uint8Array(w * h * 4)
}
 
/**解析图片 */
ww.gif.parseBitmap = function (info) {
    if (!info) {
        return
    }
    var offset = 0,
        lastDisp = -1,
        lastCans = null,
        imgData, tab,
        datas = [],
        info = info || {
            frames: [],
            comment: ''
        },
        frame;
    info.datas = []

    info.frames.forEach(function (e, i) { 
        var imgData = ww.gif.getImageData(0, 0, info.w, info.h)
 
        //获取上下文 
        e.img.m ? tab = e.img.colorTab : tab = info.colorTab;
      
        //解压
        ww.gif.lzw(e.img.srcBuf, e.img.codeSize).decode().forEach(function (j, k) {
            var k = ww.gif.getImageDataPos(k, info.w, info.h, e.img.x, e.img.y, e.img.w, e.img.h)
            imgData[k * 4] = tab[j * 3];
            imgData[k * 4 + 1] = tab[j * 3 + 1];
            imgData[k * 4 + 2] = tab[j * 3 + 2];
            imgData[k * 4 + 3] = 255;
            e.ctrl.t ? (j == e.ctrl.tranIndex ? imgData[k * 4 + 3] = 0 : 0) : 0;
        });
        e.img.srcBuf = 0
 

        if (lastCans) {
            var lastData = lastCans  
            for (var j = 0; j < imgData.length; j += 4) {
                if (imgData[j + 3] == 0) {
                    imgData[j] = lastData[j];
                    imgData[j + 1] = lastData[j + 1];
                    imgData[j + 2] = lastData[j + 2];
                    imgData[j + 3] = lastData[j + 3];
                }
            } 
        }
        lastDisp = e.ctrl.disp;
        if (e.ctrl.disp === 1 || e.ctrl.disp === 0) {
            lastCans = imgData.slice(0);
        } 
        postMessage({
            name: info.name,
            index: i,
            w: info.w,
            h: info.h,
            data: imgData.buffer
        }, [imgData.buffer])
    });

    var lastCans = null;
    var imgData = null;

    return info
}


/**
 * lzw解压
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
addEventListener('message', function (e) { 
    var o = {
        name: e.data.name,
        info: ww.gif.parse(e.data.buffer, e.data.name)
    } 
    postMessage(o);
}, false);

postMessage("gif open");