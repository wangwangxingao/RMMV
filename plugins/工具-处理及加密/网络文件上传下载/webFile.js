

webFile = {}
//webFile.loading = false


/**
 * 
 * @param {string} url 地址
 * @param {""|"arraybuffer"|"blob"|"document"|"text"} type 种类
 * @param {function(response,xhr)} loaded 
 * @param {function(ProgressEvent)} progress 
 * @param {function(Error)} error 
 * @param {function(abort)} abort 
 */
webFile.get = function (url, type, loaded, progress, error, abort) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = (typeof (type) == "string") ? type : "arraybuffer"
    xhr.onload = function () {
        if (xhr.status < 400) {
            if (typeof loaded == "function") {
                loaded(xhr.response, xhr)
            }
        }
    };
    xhr.onprogress = progress
    xhr.onerror = error
    xhr.onabort = abort
    xhr.send()
    return xhr
}


/**
 * 
 * @param {string} url 地址
 * @param {function(response,xhr)} loaded 
 * @param {function(ProgressEvent)} progress 
 * @param {function(Error)} error 
 * @param {function(abort)} abort 
 */
webFile.post = function (url, data, loaded, progress, error, abort) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);

    //"multipart/form-data"
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status < 400) {
            if (typeof loaded == "function") {
                loaded(xhr.response, xhr)
            }
        }
    };
    xhr.onprogress = progress
    xhr.onerror = error
    xhr.onabort = abort
    xhr.send(data)
    return xhr
}





/* lastModified：数值，表示最近一次修改时间的毫秒数；

lastModifiedDate：对象，表示最后一次表示最近一次修改时间的Date对象（高程中说是字符串，根据上图可看出应该为对象，为了层级清晰未对其展开，大家可自行查看，其可调用Date对象的有关方法，例如getDay方法）；

name：本地文件系统中的文件名；

size：文件的字节大小；

type：字符串，文件的MIME类型；

weblitRelativePath：此处为空；当在input上加上webkitdirectory属性时，用户可选择文件夹，此时weblitRelativePath表示文件夹中文件的相对路径。

*/
webFile.read = function (file, type, loaded, progress, error, abort) {

    var reader = new FileReader();
    /* readAsArrayBuffer(file)	按字节读取文件内容，结果用ArrayBuffer对象表示
        readAsBinaryString(file)	按字节读取文件内容，结果为文件的二进制串
        readAsDataURL(file)	读取文件内容，结果用data:url的字符串形式表示
        readAsText(file,encoding)	按字符读取文件内容，结果用字符串形式表示 */

    if (type == "ab") {
        reader.readAsArrayBuffer(file)
    } else if (type == "bs") {
        reader.readAsBinaryString(file)
    } else if (type == "du") {
        reader.readAsDataURL(file)
    } else {
        reader.readAsText(file)
    }
    reader.onload = function () {
        if (typeof loaded == "function") {
            loaded(this.result)
        }
    };
    reader.onprogress = progress
    reader.onerror = error
    reader.onabort = abort

    return reader
}


//FileReader.abort()
//中止读取操作。在返回时，readyState属性为DONE。
//FileReader.readAsArrayBuffer()
//开始读取指定的 Blob中的内容, 一旦完成, result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象.
//FileReader.readAsBinaryString() 
//开始读取指定的Blob中的内容。一旦完成，result属性中将包含所读取文件的原始二进制数据。
//FileReader.readAsDataURL()
//开始读取指定的Blob中的内容。一旦完成，result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容。
//FileReader.readAsText()

//onabort	中断时触发
//onerror	出错时触发
//onload	文件读取成功完成时触发
//onloadend	读取完成时触发，无论读取成功或失败
//onloadstart	读取开始时触发
//onprogress	读取中







/**读取文件 */
webFile.inputFile = function (change, multiple) {
    var input = document.createElement("input");
    input.type = "file"
    input.style.display = "none"

    if (multiple == "more") {

        input.multiple = "multiple"

    } else if (multiple == "dir") {
        input.multiple = "multiple"
        input.webkitdirectory = ""
        input.directory = ""
        //input["directory accept"]="*/*"
    }
    input.onchange = function () {
        var files = input.files;
        if (typeof change == "function") {
            change(files, input)
        }
        input.remove()
    }
    input.click()
    /* 
    input.style.zIndex = 12;
    input.style.position = 'absolute';
    input.style.margin = 'auto';
    document.body.appendChild(input); 
    */
}



/**
 * 
 * 保存blob大数据
 */
webFile.downloadBlob = function (blob, fileName) {
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




/**
 * 数据转化为blob
 * @param {[ArrayBuffer,ArrayBufferView,Blob,string]} data   是一个由ArrayBuffer, ArrayBufferView, Blob, DOMString 等对象构成的 Array ，或者其他类似对象的混合体，它将会被放进 Blob。DOMStrings会被编码为UTF-8。
 * @param {{type:"",endings:"transparent"}} options   是一个可选的BlobPropertyBag字典，它可能会指定如下两个属性：
 *           type，默认值为 ""，它代表了将会被放入到blob中的数组内容的MIME类型。
 *           endings，默认值为"transparent"，用于指定包含行结束符\n的字符串如何被写入。 它是以下两个值中的一个： "native"，代表行结束符会被更改为适合宿主操作系统文件系统的换行符，或者 "transparent"，代表会保持blob中保存的结束符不变 
 *
 */
webFile.data2Blob = function (data, options) {
    var blob = new Blob([data], options)
    return blob;
}


/**
 * dataurl 转blob
 * @param {*} dataurl 
 */
webFile.dataURLtoBlob = function (dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

