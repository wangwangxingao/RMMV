//=============================================================================
// DecrypterEX.js
//=============================================================================
/*:
 * @plugindesc 仿mv加密
 * @author wangwang
 *
 * @param DecrypterEX
 * @desc 仿mv加密
 * @default 1.0
 *
 * @param MiYao
 * @desc 输入密钥
 * @default 测试
 *
 * @param img
 * @desc 图片是否加密
 * @default true
 *
 * @param audio
 * @desc 音频是否加密
 * @default true
 *
 * @param data
 * @desc 数据是否加密
 * @default true
 *
 * @param workerurl
 * @desc worker 的位置 
 * @default DecrypterExWorker
 *
 * @help
 * 会替代原有保存在$dataSystem里的加密设置 (但本加密对图片音频所用加密手段与mv原版相同)
 * 推荐加密时使用 Sync 的 方法
 * Decrypter.encryptSync()  加密所有需要加秘的文件 (设置上true的项目)
 * Decrypter.encryptDirSync(dir)  加密所有需要加秘的文件夹 dir 文件夹名 
 * Decrypter.encryptFileSync(dirpath, name, type )  加密需要加秘的文件 dirpath 文件夹地址 name 名称 type 深度 
 *
 * 
 *
 */


var MD5 = function(string) {
	function RotateLeft(lValue, iShiftBits) {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	}

	function AddUnsigned(lX, lY) {
		var lX4, lY4, lX8, lY8, lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
	}

	function F(x, y, z) {
		return (x & y) | ((~x) & z);
	}

	function G(x, y, z) {
		return (x & z) | (y & (~z));
	}

	function H(x, y, z) {
		return (x ^ y ^ z);
	}

	function I(x, y, z) {
		return (y ^ (x | (~z)));
	}

	function FF(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function GG(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function HH(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function II(a, b, c, d, x, s, ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};

	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	};

	function WordToHex(lValue) {
		var WordToHexValue = "",
			WordToHexValue_temp = "",
			lByte, lCount;
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
		}
		return WordToHexValue;
	};

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	};

	var x = Array();
	var k, AA, BB, CC, DD, a, b, c, d;
	var S11 = 7,
		S12 = 12,
		S13 = 17,
		S14 = 22;
	var S21 = 5,
		S22 = 9,
		S23 = 14,
		S24 = 20;
	var S31 = 4,
		S32 = 11,
		S33 = 16,
		S34 = 23;
	var S41 = 6,
		S42 = 10,
		S43 = 15,
		S44 = 21;

	string = Utf8Encode(string);

	x = ConvertToWordArray(string);

	a = 0x67452301;
	b = 0xEFCDAB89;
	c = 0x98BADCFE;
	d = 0x10325476;

	for (k = 0; k < x.length; k += 16) {
		AA = a;
		BB = b;
		CC = c;
		DD = d;
		a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		a = AddUnsigned(a, AA);
		b = AddUnsigned(b, BB);
		c = AddUnsigned(c, CC);
		d = AddUnsigned(d, DD);
	}

	var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

	return temp.toLowerCase();
}

DataManager.loadDataFile = function(name, src) {
	var xhr = new XMLHttpRequest();
	var url = 'data/' + src;
	if (Decrypter.hasEncryptedData && !Decrypter.checkImgIgnore(url)) {
		var url = Decrypter.extToEncryptExt(url)
		xhr.open('GET', url);
		xhr.responseType = "arraybuffer"
		xhr.onload = function() {
			if (xhr.status < 400) {
				window[name] = JSON.parse(Decrypter.decryptText(xhr.response));
				DataManager.onLoad(window[name]);
			}
		};
	} else {
		xhr.open('GET', url);
		xhr.overrideMimeType('application/json');
		xhr.onload = function() {
			if (xhr.status < 400) {
				window[name] = JSON.parse(xhr.responseText);
				DataManager.onLoad(window[name]);
			}
		};
	}
	xhr.onerror = function() {
		DataManager._errorUrl = DataManager._errorUrl || url;
	};
	window[name] = null;
	xhr.send();
};

DataManager.onLoad = function(object) {
	var array;
	if (object === $dataMap) {
		this.extractMetadata(object);
		array = object.events;
	} else {
		array = object;
	}
	if (Array.isArray(array)) {
		for (var i = 0; i < array.length; i++) {
			var data = array[i];
			if (data && data.note !== undefined) {
				this.extractMetadata(data);
			}
		}
	}
	if (object === $dataSystem) {
		Scene_Boot.loadSystemImages();
	}
};

 
function Decrypter() {
	throw new Error('This is a static class');
}
 
Decrypter.hasEncryptedImages = false;
Decrypter.hasEncryptedAudio = false;
Decrypter.hasEncryptedData = false;

Decrypter._requestImgFile = [];
Decrypter._headerlength = 16;
Decrypter._xhrOk = 400;
Decrypter._encryptionKey = "";
Decrypter._ignoreList = [
	"img/system/Window.png"
];
Decrypter.SIGNATURE = "5250474d56000000";
Decrypter.VER = "000301";
Decrypter.REMAIN = "0000000000";




/**检查是否需要跳过*/
Decrypter.checkImgIgnore = function(url) {
	return Decrypter._ignoreList.indexOf(url) >= 0
};
/**读取加密键 */
Decrypter.readEncryptionkey = function() {
	if (!this._encryptionKey) {
		var encryptionKey = Decrypter._encryptionKey2.split(/(.{2})/).filter(Boolean);
		var keys = []
		for (var i = 0; i < this._headerlength; i++) {
			keys[i] = parseInt(encryptionKey[i], 16)
		}
		this._encryptionKey = keys
	}
};
/**切arraybuffer头*/
Decrypter.cutArrayHeader = function(arrayBuffer, length) {
	return arrayBuffer.slice(length);
};
/**创建 blob url地址*/
Decrypter.createBlobUrl = function(arrayBuffer) {
	var blob = new Blob([arrayBuffer]);
	return window.URL.createObjectURL(blob);
};

/**后缀 到 加密后缀 */
Decrypter.extToEncryptExt = function(url) {
	var ext = url.split('.').pop();
	var encryptedExt = ext;
	if (ext === "ogg") encryptedExt = ".rpgmvo";
	else if (ext === "m4a") encryptedExt = ".rpgmvm";
	else if (ext === "png") encryptedExt = ".rpgmvp";
	else if (ext === "json") encryptedExt = ".rpgmvj";
	else encryptedExt = ext;
	return url.slice(0, url.lastIndexOf(ext) - 1) + encryptedExt;
};
/*
Decrypter.readEncryptionkey = function () {
    this._encryptionKey = $dataSystem.encryptionKey.split(/(.{2})/).filter(Boolean);
};
*/

/**制作头为了 ArrayBuffer  */
Decrypter.makerHeader = null
Decrypter.makerHeaderForArrayBuffer = function() {
	if (!Decrypter.makerHeader) {
		var header = new Buffer(16);
		var ref = this.SIGNATURE + this.VER + this.REMAIN;
		for (i = 0; i < this._headerlength; i++) {
			header[i] = parseInt("0x" + ref.substr(i * 2, 2), 16);
		}
		Decrypter.makerHeader = header
	}
	return Decrypter.makerHeader
}


/**解密图片*/
Decrypter.decryptImg = function(url, bitmap) {
	url = this.extToEncryptExt(url);
	var requestFile = new XMLHttpRequest();
	requestFile.open("GET", url);
	requestFile.responseType = "arraybuffer";
	requestFile.send();
	requestFile.onload = function() {
		if (this.status < Decrypter._xhrOk) {
			var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
			bitmap._image.src = Decrypter.createBlobUrl(arrayBuffer);
			bitmap._image.onload = Bitmap.prototype._onLoad.bind(bitmap);
			bitmap._image.onerror = Bitmap.prototype._onError.bind(bitmap);
		}
	};
};
/**解密 音频*/
Decrypter.decryptHTML5Audio = function(url, bgm, pos) {
	var requestFile = new XMLHttpRequest();
	requestFile.open("GET", url);
	requestFile.responseType = "arraybuffer";
	requestFile.send();
	requestFile.onload = function() {
		if (this.status < Decrypter._xhrOk) {
			var arrayBuffer = Decrypter.decryptArrayBuffer(requestFile.response);
			var url = Decrypter.createBlobUrl(arrayBuffer);
			AudioManager.createDecryptBuffer(url, bgm, pos);
		}
	};
};


/**解密 arraybuffer */
Decrypter.decryptArrayBuffer = function(arrayBuffer) {
	if (!arrayBuffer) return null;
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
	arrayBuffer = this.cutArrayHeader(arrayBuffer, Decrypter._headerlength);
	var view = new DataView(arrayBuffer);
	this.readEncryptionkey();
	if (arrayBuffer) {
		var keys = Decrypter._encryptionKey
		var byteArray = new Uint8Array(arrayBuffer);
		for (i = 0; i < this._headerlength; i++) {
			var key = keys[i]
			var code = byteArray[i]
			byteArray[i] = key ^ code
			view.setUint8(i, byteArray[i]);
		}
	}
	return arrayBuffer;
};
 
/**加密 ArrayBuffer */
Decrypter.encryptArrayBuffer = function(arrayBuffer) {
	var eD = []
	if (!arrayBuffer) {
		var arrayBuffer = new ArrayBuffer()
		var byteArray = new Uint8Array(arrayBuffer);
	} else {
		var keys = Decrypter._encryptionKey
		var byteArray = new Uint8Array(arrayBuffer);
		for (i = 0; i < this._headerlength; i++) {
			var key = keys[i]
			var code = byteArray[i]
			byteArray[i] = key ^ code
		}
	}
	eD = [this.makerHeaderForArrayBuffer(), new Buffer(byteArray)]
	eD = Buffer.concat(eD)
	return eD
}


/**加密增强版*/
Decrypter.encryptArrayBufferEX = function(arrayBuffer) {
		var eD = []
		if (!arrayBuffer) {
			var arrayBuffer = new ArrayBuffer()
			var byteArray = new Uint8Array(arrayBuffer);
		} else {
			var byteArray = new Uint8Array(arrayBuffer);
			var cl = byteArray.length
			if (cl > 0) {
				var keys = this._encryptionKey
				var ini = (keys[cl % 16] + keys[(cl + cl) % 16]) % cl

				var keyid = ini
				var i = ini

				var code = byteArray[i]
				var key = keys[keyid % 16]
				var tcode = code ^ key
				byteArray[i] = tcode
				var keyid0 = code

				var keyid = -1
				for (var i = 0; i < cl; i++) {
					if (i == ini) {} else {
						if (keyid == -1) {
							keyid = keyid0
						}
						var code = byteArray[i]
						var key = keys[keyid % 16]
						var tcode = code ^ key
						byteArray[i] = tcode
						keyid = code
					}
				}
			}
		} 
		eD = [this.makerHeaderForArrayBuffer(), new Buffer(byteArray)]
		eD = Buffer.concat(eD)
		return eD
	}
/**解密 arraybuffer 增强*/
Decrypter.decryptArrayBufferEX = function(arrayBuffer) {
	if (!arrayBuffer) {
		return null;
	}
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
	this.readEncryptionkey();
	var arrayBuffer = this.cutArrayHeader(arrayBuffer, Decrypter._headerlength);
	var byteArray = new Uint8Array(arrayBuffer);
	var cl = byteArray.length
	if (cl > 0) {
		var keys = this._encryptionKey

		var ini = (keys[cl % 16] + keys[(cl + cl) % 16]) % cl

		var keyid = ini
		var i = ini

		var key = keys[keyid % 16]
		var code = byteArray[i]
		var tcode = key ^ code
		var keyid0 = tcode

		var keyid = -1
		for (var i = 0; i < cl; i++) {
			if (i == ini) {
				var tcode = keyid0
			} else {
				if (keyid == -1) {
					keyid = keyid0
				}
				var key = keys[keyid % 16]
				var code = byteArray[i]
				var tcode = key ^ code
				keyid = tcode
			}
			byteArray[i] = tcode
		}
	}
	return byteArray;
};

/**加密文本 */
Decrypter.encryptText = function(data) {
	var eD = []
	if (!data) {
		data = ""
	}
	/**压缩文本 */
	var c = LZString.compressToBase64(data);

	/**文本长度 */
	var cl = c.length
	var ab = new ArrayBuffer(cl)
	var byteArray = new Uint8Array(ab);
	if (cl > 0) {
		var keys = this._encryptionKey
			/**初始位置 */
		var ini = (keys[cl % 16] + keys[(cl + cl) % 16]) % cl
		var keyid = ini
		var i = ini
		var code = c.charCodeAt(i)
		var key = keys[keyid % 16]
		var tcode = code ^ key
		byteArray[i] = tcode
		var keyid0 = code
		var keyid = -1
		for (var i = 0; i < cl; i++) {
			if (i == ini) {} else {
				if (keyid == -1) {
					keyid = keyid0
				}
				var code = c.charCodeAt(i)
				var key = keys[keyid % 16]
				var tcode = code ^ key
				byteArray[i] = tcode
				keyid = code
			}
		}
	}
	eD = [this.makerHeaderForArrayBuffer(), new Buffer(byteArray)]
	eD = Buffer.concat(eD)
	return eD
}

/**解密文本 */
Decrypter.decryptText = function(arrayBuffer) {
	//如果(不是 二进制缓存)返回 null
	if (!arrayBuffer) {
		return null;
	}
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
	//读取加密键()
	this.readEncryptionkey();
	var arrayBuffer = this.cutArrayHeader(arrayBuffer, Decrypter._headerlength);
	var byteArray = new Uint8Array(arrayBuffer);

	var t = ""
	var cl = byteArray.length
	if (cl > 0) {
		var keys = this._encryptionKey

		var ini = (keys[cl % 16] + keys[(cl + cl) % 16]) % cl

		var keyid = ini
		var i = ini

		var key = keys[keyid % 16]
		var code = byteArray[i]
		var tcode = key ^ code

		var keyid0 = tcode

		var keyid = -1
		for (var i = 0; i < cl; i++) {
			if (i == ini) {
				var tcode = keyid0
			} else {
				if (keyid == -1) {
					keyid = keyid0
				}
				var key = keys[keyid % 16]
				var code = byteArray[i]
				var tcode = key ^ code
				keyid = tcode
			}
			t += String.fromCharCode(tcode)
		}
	} 
	var data = LZString.decompressFromBase64(t)
	return data;
};



 
/*
WorkerManager = function (url, data, fun) {
    var worker = new Worker(url)
    worker.onmessage = function (event) {
        fun(event)
    }
    //发送信息
    worker.postMessage(data)
};
*/

Decrypter.encryptfilelist = {
	"last":null,
	"file": [],
	"fileend": [],
	"chuli": {},
	"isok": function() {
		return this.file.length == this.fileend.length
	},
	"isoking": function() {
		return [this.fileend.length, this.file.length, this.fileend.length / (this.file.length || 1)]
	},
	"isfirst": function() {
		return this.file.length == 0
	},
	"starttime": 0,
	"start": function(url, i) {
		if (this.isfirst()) {
			this.starttime = Date.now()
			console.log(this.starttime)
		}
		this.chuli[url] = i
		this.file.push(url)
		//console.log(this.isoking() , url, i)
	},
	"change": function(url, i) {
		this.chuli[url] = i
	},
	"chulitime": 0,
	"endtime": 0,
	
	
	"end": function(url, i) {
		this.chuli[url] = i
		this.fileend.push(url)
		//console.log(this.isoking(), url, i)
		if (this.isok()) { 
			this.endtime = Date.now()
			this.chulitime = this.endtime - this.starttime
			console.log(this.endtime)
			console.log(this.chulitime)
			this.last = null 
			this.last = JSON.parse(JSON.stringify(this))
			console.log(this.last)
			this.clear()
		}
	},
	"clear": function() {
		this.file = []
		this.fileend = []
		this.starttime = 0 
		this.endtime = 0
		this.chulitime = 0
	}

}

Decrypter.encrypt = function() {
	Decrypter.encryptfilelist.start("encrypt", "file looding")
	if (Decrypter.hasEncryptedImages) {
		Decrypter.encryptDir("img")
	}
	if (Decrypter.hasEncryptedAudio) {
		Decrypter.encryptDir("audio")
	}
	if (Decrypter.hasEncryptedData) {
		Decrypter.encryptDir("data")
	}
	Decrypter.encryptfilelist.end("encrypt", "file end")
}

Decrypter.encryptDir = function(dir) {
	if (!Utils.isNwjs()) {
		console.log("not is Nwjs")
		return {}
	}
	var localFileDirectoryPath = function(url) {
		var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '');
		if (path.match(/^\/([A-Z]\:)/)) {
			path = path.slice(1);
		}
		return decodeURIComponent(path);
	};
	var dirpath = localFileDirectoryPath();
	this.encryptFile(dirpath, dir, Infinity)
}

Decrypter.encryptFile = function(dirpath, name, type) {
	if (!Utils.isNwjs()) {
		console.log("not is Nwjs")
		return {}
	}
	Decrypter.fs = require('fs');
	var fs = Decrypter.fs;
	var dirName2Url = function(dirpath, name) {
		if (name) {
			var url = dirpath + '/' + name
		} else {
			var url = dirpath
		}
		return url
	}
	var loadState = function(dirpath, name, type) {
		var url = dirName2Url(dirpath, name)
		Decrypter.encryptfilelist.start(url, "must")
		if (Decrypter.checkImgIgnore(url)) {
			Decrypter.encryptfilelist.end(url, "ignore")
			return
		}
		fs.exists(url, function(exists) {
			if (exists) {
				fs.stat(url, function(err, filesj) {
					if (err) {
						Decrypter.encryptfilelist.end(url, "filestat err")
					}
					if (filesj.isDirectory()) {
						Decrypter.encryptfilelist.change(url, "is Directory")
						if (type > 0) {
							loadDirList(url, type - 1)
						} else {
							Decrypter.encryptfilelist.end(url, "Directory to deep")
						}
					} else {
						encryptSave(url)
					}
				})
			} else {
				Decrypter.encryptfilelist.end(url, "not exists")
			}
		})
	}
	var loadDirList = function(url, type) {
		Decrypter.encryptfilelist.change(url, "Directory loading")
		var files = fs.readdir(url, function(err, files) {
			if (err) {
				Decrypter.encryptfilelist.end(url, "Directory load err")
				return
			}
			files.forEach(
				function(file) {
					loadState(url, file, type)
				}
			)
			Decrypter.encryptfilelist.end(url, "Directory loaded")
		})
	}
	var encryptSave = function(url) {
		Decrypter.encryptfilelist.change(url, "file changeing")
		var saveEncryptFile = function(url, data) {
			Decrypter.encryptfilelist.start(url, "file saveing")

			fs.writeFile(url, data, function() {
				Decrypter.encryptfilelist.end(url, "file saveed") 
			});
		};
		var getEncryptExt = function(url) {
			var ext = url.split('.').pop();
			if (ext === "ogg") {
				return ".rpgmvo";
			} else if (ext === "m4a") {
				return ".rpgmvm";
			} else if (ext === "png") {
				return ".rpgmvp";
			} else if (ext === "json") {
				return ".rpgmvj";
			} else {
				return null
			}
		};
		var requestFile = new XMLHttpRequest();
		requestFile.open("GET", url);
		var type = getEncryptExt(url)
		if (type === ".rpgmvo" || type === ".rpgmvm" || type === ".rpgmvp") {
			requestFile.responseType = "arraybuffer"
			requestFile.onload = function() {
				if (this.status < Decrypter._xhrOk) {
					var url2 = Decrypter.extToEncryptExt(url)
					if (Decrypter.workerurl) {
						var data = {}
						data.type = "arrayBuffer"
						data.rety = "save"
						data.url = [url, url2]
						data.headerlength = Decrypter._headerlength
						data.data = requestFile.response
						data.key = Decrypter._encryptionKey
						Decrypter.worker.postMessage(data)
						Decrypter.encryptfilelist.start(url2, "file must post")
						Decrypter.encryptfilelist.change(url, "file posted")
					} else {
						var data = Decrypter.encryptArrayBuffer(requestFile.response)
						saveEncryptFile(url2, data)
						Decrypter.encryptfilelist.end(url, "file changeend")
					}
				} else {
					Decrypter.encryptfilelist.end(url, "file loaderr")
				}
			};
			requestFile.send();
		} else if (type === ".rpgmvj") {
			requestFile.responseType = "text"
			requestFile.onload = function() {
				if (this.status < Decrypter._xhrOk) {
					var url2 = Decrypter.extToEncryptExt(url)
					if (Decrypter.workerurl) {
						var data = {}
						data.type = "text"
						data.rety = "save"
						data.url = [url, url2]
						data.headerlength = Decrypter._headerlength
						data.data = requestFile.response
						data.key = Decrypter._encryptionKey
						Decrypter.worker.postMessage(data)
						Decrypter.encryptfilelist.start(url2, "file must post")
						Decrypter.encryptfilelist.change(url, "file posted")
					} else {
						var data = Decrypter.encryptText(requestFile.response)
						saveEncryptFile(url2, data)
						Decrypter.encryptfilelist.end(url, "file changeend")
					}
				} else {
					Decrypter.encryptfilelist.end(url, "file loaderr")
				}
			};
			requestFile.send();
		} else {
			Decrypter.encryptfilelist.end(url, "file is not type")
			return null
		}
	}
	loadState(dirpath, name, type)
	return
}

Decrypter._saveEncryptFile = function(url, data) {
	var url0 = url[0]
	var url = url[1]
	Decrypter.encryptfilelist.change(url, "file saveing")
	Decrypter.encryptfilelist.end(url0, "file posted")
	var data = [this.makerHeaderForArrayBuffer(), new Buffer(data)]
	var data = Buffer.concat(data)
	Decrypter.fs.writeFile(url, data, function() {
		Decrypter.encryptfilelist.end(url, "file saveed")
	});
};

Decrypter.encryptSync = function() { 
	Decrypter.encryptfilelist.start("encrypt", "file looding")
	if (Decrypter.hasEncryptedImages) {
		Decrypter.encryptDirSync("img")
	}
	if (Decrypter.hasEncryptedAudio) {
		Decrypter.encryptDirSync("audio")
	}
	if (Decrypter.hasEncryptedData) {
		Decrypter.encryptDirSync("data")
	}
	Decrypter.encryptfilelist.end("encrypt", "file end")
}

Decrypter.encryptDirSync = function(dir) {
	if (!Utils.isNwjs()) {
		console.log("not is Nwjs")
		return {}
	}
	var localFileDirectoryPath = function() {
		var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '');
		if (path.match(/^\/([A-Z]\:)/)) {
			path = path.slice(1);
		}
		return decodeURIComponent(path);
	};
	var dirpath = localFileDirectoryPath();
	this.encryptFileSync(dirpath, dir, Infinity)
	return
}

Decrypter.encryptFileSync = function(dirpath, name, type) {
	if (!Utils.isNwjs()) {
		console.log("not is Nwjs")
		return {}
	}
	Decrypter.fs = require('fs');
	var fs = Decrypter.fs;
	var dirName2Url = function(dirpath, name) {
		if (name) {
			var url = dirpath + '/' + name
		} else {
			var url = dirpath
		}
		return url
	}
	var list = []
	var loadState = function(dirpath, name, type) {

		var url = dirName2Url(dirpath, name)
		Decrypter.encryptfilelist.start(url, "must")

		if (Decrypter.checkImgIgnore(url)) {
			Decrypter.encryptfilelist.end(url, "ignore")
			return
		}
		if (fs.existsSync(url)) {
			var filesj = fs.statSync(url)
			if (filesj.isDirectory()) {
				Decrypter.encryptfilelist.change(url, "is Directory")
				if (type > 0) {
					loadDirList(url, type - 1)
				} else {
					Decrypter.encryptfilelist.end(url, "Directory to deep")
				}
			} else {
				encryptSave(url)
			}
		} else {
			Decrypter.encryptfilelist.end(url, "not exists")
		}
	}
	var loadDirList = function(url, type) {
		Decrypter.encryptfilelist.change(url, "Directory loading")
		var files = fs.readdirSync(url)
		files.forEach(
			function(file) {
				loadState(url, file, type)
			}
		)
		Decrypter.encryptfilelist.end(url, "Directory loaded")

	}
	var encryptSave = function(url) {
		Decrypter.encryptfilelist.change(url, "file changeing")
		var fs = Decrypter.fs;
		var saveEncryptFile = function(url, data) {
			Decrypter.encryptfilelist.start(url, "file saveing")
			fs.writeFileSync(url, data);
			Decrypter.encryptfilelist.end(url, "file saveed")
		};
		var getEncryptExt = function(url) {
			var ext = url.split('.').pop();
			if (ext === "ogg") {
				return ".rpgmvo";
			} else if (ext === "m4a") {
				return ".rpgmvm";
			} else if (ext === "png") {
				return ".rpgmvp";
			} else if (ext === "json") {
				return ".rpgmvj";
			} else {
				return null
			}
		};
		var requestFile = new XMLHttpRequest();
		requestFile.open("GET", url);
		var type = getEncryptExt(url)
		if (type === ".rpgmvo" || type === ".rpgmvm" || type === ".rpgmvp") {
			requestFile.responseType = "arraybuffer"
			requestFile.onload = function() {
				if (this.status < Decrypter._xhrOk) {
					var url2 = Decrypter.extToEncryptExt(url)
					if (Decrypter.workerurl) {
						var data = {}
						data.type = "arrayBuffer"
						data.rety = "save2"
						data.url = [url, url2]
						data.headerlength = Decrypter._headerlength
						data.data = requestFile.response
						data.key = Decrypter._encryptionKey 
						Decrypter.worker.postMessage(data)
						Decrypter.encryptfilelist.start(url2, "file must post")
						Decrypter.encryptfilelist.change(url, "file posted")
					} else {
						var data = Decrypter.encryptArrayBuffer(requestFile.response)
						saveEncryptFile(url2, data)
						Decrypter.encryptfilelist.end(url, "file changeend")
					}
				} else {
					Decrypter.encryptfilelist.end(url, "file loaderr")
				}
			};
			requestFile.send();
		} else if (type === ".rpgmvj") {
			requestFile.responseType = "text"
			requestFile.onload = function() {
				if (this.status < Decrypter._xhrOk) {
					var url2 = Decrypter.extToEncryptExt(url)
					if (Decrypter.workerurl) {
						var data = {}
						data.type = "text"
						data.rety = "save2"
						data.url = [url, url2] 
						data.headerlength = Decrypter._headerlength
						data.data = requestFile.response
						data.key = Decrypter._encryptionKey 
						Decrypter.worker.postMessage(data)
						Decrypter.encryptfilelist.start(url2, "file must post")
						Decrypter.encryptfilelist.change(url, "file posted")
					} else {
						var data = Decrypter.encryptText(requestFile.response)
						saveEncryptFile(url2, data)
						Decrypter.encryptfilelist.end(url, "file changeend")
					}
				} else {
					Decrypter.encryptfilelist.end(url, "file loaderr")
				}
			};
			requestFile.send();
		} else {
			Decrypter.encryptfilelist.end(url, "file is not type")
			return null
		}
	}
	loadState(dirpath, name, type)
	return
}

Decrypter._saveEncryptFileSync = function(url, data) {
	var url0 = url[0]
	var url = url[1]
	Decrypter.encryptfilelist.change(url, "file saveing")
	Decrypter.encryptfilelist.end(url0, "file posted")
	var data = [this.makerHeaderForArrayBuffer(), new Buffer(data)]
	var data = Buffer.concat(data) 
	Decrypter.fs.writeFileSync(url, data);
	Decrypter.encryptfilelist.end(url, "file saved")
};

/**获取*/
Decrypter.get = function() {
	var parse = function(i, type) {
		try {
			if (type) {
				return i
			}
			return JSON.parse(i)
		} catch (e) {
			return i
		}
	}
	var miyao = ""
	for (var i = 0; i < $plugins.length; i++) {
		var plugin = $plugins[i]
		if ("DecrypterEX" in plugin.parameters) {
			if (plugin.status == true) {
				var miyao = plugin.parameters["MiYao"]
				var audio = parse(plugin.parameters["audio"]) || false
				var img = parse(plugin.parameters["img"]) || false
				var data = parse(plugin.parameters["data"]) || false
				var workerurl = parse(plugin.parameters["workerurl"]) || false

				Decrypter._encryptionKey2 = MD5(miyao)
				Decrypter.hasEncryptedImages = img;
				Decrypter.hasEncryptedAudio = audio;
				Decrypter.hasEncryptedData = data;

				Decrypter.readEncryptionkey()
				if (workerurl) {
					workerurl = PluginManager._path + workerurl + ".js"
					Decrypter.worker = new Worker(workerurl)
					Decrypter.worker.onmessage = function(event) {
							Decrypter.workerurl = event.data.url
							console.log( "Decrypter.worker can use" )
							Decrypter.worker.onmessage = function(event) {
								var data = event.data
								var type = data.type
								if (type == 'save') {
									var url = data.url
									var re = data.data
									Decrypter._saveEncryptFile(url, re)
								} else if (type == "save2") {
									var url = data.url
									var re = data.data
									Decrypter._saveEncryptFileSync(url, re)
								}
							}
						}
					//发送信息
					Decrypter.worker.postMessage({
						url: workerurl
					})
				}
			}
		}
	}
};

Decrypter.get()