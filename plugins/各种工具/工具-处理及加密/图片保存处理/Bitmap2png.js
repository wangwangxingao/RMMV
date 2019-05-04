bitmapChange = {}

/**保存图片到png格式(图片,文件名,文件夹名)*/

/**图片 获取 dataurl 
 *
 * 
 * @param {"image/png"}  type 
*/
bitmapChange.bitmap2DataURL = function (bitmap, type) {
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
bitmapChange.dataURL2Buffer = function (imgData) {
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
bitmapChange.bitmap2Buffer = function (bitmap, type) {
    var imgData = this.bitmap2DataURL(bitmap, type)
    return this.dataURL2Buffer(imgData);
}


/**
 * 
 * dataURL 转化为 blob
 * @param {*} imgData 
 * 
 */
bitmapChange.dataURL2Blob = function (imgData) {
    if (!imgData) {
        var blob = new Blob()
    } else {
        var blob = this.base64Img2Blob(imgData)
    }
    // 下载后的文件名 
    return blob;
}


bitmapChange.base64Img2Blob = function (code) {
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





/**
 * 
 * dataURL 转化为 blob
 * @param {*} imgData 
 * 
 */
bitmapChange.bitmap2Blob = function (bitmap, type) {
    var imgData = this.bitmap2DataURL(bitmap, type)
    return this.dataURL2Blob(imgData);
}

