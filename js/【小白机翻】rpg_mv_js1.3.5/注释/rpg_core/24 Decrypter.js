
//-----------------------------------------------------------------------------
/**解密的静态类 
 * The static class is Decrypter.
 * 解密
 * @class Decrypter
 * @constructor
*/
function Decrypter() {
    throw new Error('This is a static class');
}

Decrypter.hasEncryptedImages = false;
Decrypter.hasEncryptedAudio = false;
Decrypter._requestImgFile = [];
Decrypter._headerlength = 16;
//请求ok = 400
Decrypter._xhrOk = 400;
Decrypter._encryptionKey = "";
Decrypter._ignoreList = [
    "img/system/Window.png"
];
Decrypter.SIGNATURE = "5250474d56000000";
Decrypter.VER = "000301";
Decrypter.REMAIN = "0000000000";

Decrypter.checkImgIgnore = function(url){
    for(var cnt = 0; cnt < this._ignoreList.length; cnt++) {
        if(url === this._ignoreList[cnt]) return true;
    }
    return false;
};
//解密图片
Decrypter.decryptImg = function(url, bitmap) {
    //url = 后缀转加密后缀(url)
    url = this.extToEncryptExt(url);
    
    //请求文件 = 新 XML网址请求()
    var requestFile = new XMLHttpRequest();
    requestFile.open("GET", url);
    requestFile.responseType = "arraybuffer";
    requestFile.send();
    //请求文件 当读取
    requestFile.onload = function () {
        //如果(状态< 解密 请求ok )
        if(this.status < Decrypter._xhrOk) {
            //二进制缓存 = 解密 解密二进制缓存(请求文件 结果)
            var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
            //位图 图像 src = 解密 创建二进制大对象地址(二进制缓存)
            bitmap._image.src = Decrypter.createBlobUrl(arrayBuffer);
            //位图 图像 当读取 = 位图 当读取 绑定(bitmap)
            bitmap._image.onload = Bitmap.prototype._onLoad.bind(bitmap);
            //位图 图像 当错误 = 位图 当错误 绑定(bitmap)
            bitmap._image.onerror = Bitmap.prototype._onError.bind(bitmap);
        }
    };
};
//解密HTML5Audio
Decrypter.decryptHTML5Audio = function(url, bgm, pos) {
    //请求文件 = 新 XML网址请求()
    var requestFile = new XMLHttpRequest(); 
    requestFile.open("GET", url);
    requestFile.responseType = "arraybuffer";
    requestFile.send();
    //请求文件 当读取 
    requestFile.onload = function () {
        //如果(状态< 解密 请求ok )
        if(this.status < Decrypter._xhrOk) {
            //二进制缓存 = 解密 解密二进制缓存(请求文件 结果)
            var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
            //url = 解密 创建二进制大对象地址(二进制缓存)
            var url = Decrypter.createBlobUrl(arrayBuffer);
            //音频管理器 创建解密缓冲区(url , bgm , pos)
            AudioManager.createDecryptBuffer(url, bgm, pos);
        }
    };
};
//切数组头
Decrypter.cutArrayHeader = function(arrayBuffer, length) {
    //返回 二进制缓存 剪切(长度)
    return arrayBuffer.slice(length);
};
//解密二进制缓存
Decrypter.decryptArrayBuffer = function(arrayBuffer) {
    //如果(不是 二进制缓存)返回 null
    if (!arrayBuffer){ return null;}
    //头 = 新 Uint8数组(二进制缓存 , 0 , 头长度)
    var header = new Uint8Array(arrayBuffer, 0, this._headerlength);

    var i;
    var ref = this.SIGNATURE + this.VER + this.REMAIN;
    var refBytes = new Uint8Array(16);
    for (i = 0; i < this._headerlength; i++) {
        refBytes[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
    }
    for (i = 0; i < this._headerlength; i++) {
        if (header[i] !== refBytes[i]) {
            throw new Error("Header is wrong");
        }
    }
    //二进制缓存 = 切数组头(二进制缓存,解密 头长度)
    arrayBuffer = this.cutArrayHeader(arrayBuffer, Decrypter._headerlength);
    //数据显示 = 新 数组显示(二进制缓存)
    var view = new DataView(arrayBuffer);
    //读取加密键()
    this.readEncryptionkey();
    //如果(二进制缓存)
    if (arrayBuffer) {
        //比特数组 = 新 Uint8数组(二进制缓存)
        var byteArray = new Uint8Array(arrayBuffer);
        //循环 (i =  0 ; i < 头长度 ; i++)
        for (i = 0; i < this._headerlength; i++) {
            //比特数组[i] = 比特数组[i] ^ 解码数( 加密键[i], 16)
            byteArray[i] = byteArray[i] ^ parseInt(Decrypter._encryptionKey[i], 16);
            //数据显示 设置uint8(i , byteArray[i])
            view.setUint8(i, byteArray[i]);
        }
    }
    //返回 二进制缓存
    return arrayBuffer;
};
//创建二进制大对象地址
Decrypter.createBlobUrl = function(arrayBuffer){
    //二进制大对象 = 新 二进制大对象([二进制缓存])
    var blob = new Blob([arrayBuffer]);
    //返回 窗口 地址 创建对象地址(二进制大对象)
    return window.URL.createObjectURL(blob);
};
//后缀转加密后缀
Decrypter.extToEncryptExt = function(url) {
    //后缀 = url 切割(".") 末尾()
    var ext = url.split('.').pop();
    //加密后缀 = 后缀
    var encryptedExt = ext;
    //如果 (后缀 === 'ogg')
    if(ext === "ogg") {
        //加密后缀 = ".rpgmvo"
        encryptedExt = ".rpgmvo";
    //否则 如果 (后缀 === 'm4a')
    }else if(ext === "m4a") {
        //加密后缀 = ".rpgmvm"
        encryptedExt = ".rpgmvm";
    //否则 如果 (后缀 === 'png')
    }else if(ext === "png") {
        //加密后缀 = ".rpgmvp"
        encryptedExt = ".rpgmvp";
    //否则
    }else{ 

        //加密后缀 = 后缀
        encryptedExt = ext;
    } 
    //返回 url 剪切(0 , url 最后索引于(后缀) - 1 ) + 加密后缀
    return url.slice(0, url.lastIndexOf(ext) - 1) + encryptedExt;
};
//读取加密键
Decrypter.readEncryptionkey = function(){
    //加密键 = 数据系统 加密键 切割 ( /(.(2)) /) 过滤 (Boolean)
    this._encryptionKey = $dataSystem.encryptionKey.split(/(.{2})/).filter(Boolean);
};
