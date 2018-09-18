


onmessage = function (event) {
    var re = getRe(event)
    postMessage(re)
}



   
WorkerManager = function (url, data, fun) {
    var worker = new Worker(url)
    worker.onmessage = function (event) {
        fun(event)
    }
    worker.postMessage(data)
};
var LZString = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", _f: String.fromCharCode, compressToBase64: function (e) { if (e == null) return ""; var t = ""; var n, r, i, s, o, u, a; var f = 0; e = LZString.compress(e); while (f < e.length * 2) { if (f % 2 == 0) { n = e.charCodeAt(f / 2) >> 8; r = e.charCodeAt(f / 2) & 255; if (f / 2 + 1 < e.length) i = e.charCodeAt(f / 2 + 1) >> 8; else i = NaN } else { n = e.charCodeAt((f - 1) / 2) & 255; if ((f + 1) / 2 < e.length) { r = e.charCodeAt((f + 1) / 2) >> 8; i = e.charCodeAt((f + 1) / 2) & 255 } else r = i = NaN } f += 3; s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + LZString._keyStr.charAt(s) + LZString._keyStr.charAt(o) + LZString._keyStr.charAt(u) + LZString._keyStr.charAt(a) } return t }, decompressFromBase64: function (e) { if (e == null) return ""; var t = "", n = 0, r, i, s, o, u, a, f, l, c = 0, h = LZString._f; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (c < e.length) { u = LZString._keyStr.indexOf(e.charAt(c++)); a = LZString._keyStr.indexOf(e.charAt(c++)); f = LZString._keyStr.indexOf(e.charAt(c++)); l = LZString._keyStr.indexOf(e.charAt(c++)); i = u << 2 | a >> 4; s = (a & 15) << 4 | f >> 2; o = (f & 3) << 6 | l; if (n % 2 == 0) { r = i << 8; if (f != 64) { t += h(r | s) } if (l != 64) { r = o << 8 } } else { t = t + h(r | i); if (f != 64) { r = s << 8 } if (l != 64) { t += h(r | o) } } n += 3 } return LZString.decompress(t) }, compressToUTF16: function (e) { if (e == null) return ""; var t = "", n, r, i, s = 0, o = LZString._f; e = LZString.compress(e); for (n = 0; n < e.length; n++) { r = e.charCodeAt(n); switch (s++) { case 0: t += o((r >> 1) + 32); i = (r & 1) << 14; break; case 1: t += o(i + (r >> 2) + 32); i = (r & 3) << 13; break; case 2: t += o(i + (r >> 3) + 32); i = (r & 7) << 12; break; case 3: t += o(i + (r >> 4) + 32); i = (r & 15) << 11; break; case 4: t += o(i + (r >> 5) + 32); i = (r & 31) << 10; break; case 5: t += o(i + (r >> 6) + 32); i = (r & 63) << 9; break; case 6: t += o(i + (r >> 7) + 32); i = (r & 127) << 8; break; case 7: t += o(i + (r >> 8) + 32); i = (r & 255) << 7; break; case 8: t += o(i + (r >> 9) + 32); i = (r & 511) << 6; break; case 9: t += o(i + (r >> 10) + 32); i = (r & 1023) << 5; break; case 10: t += o(i + (r >> 11) + 32); i = (r & 2047) << 4; break; case 11: t += o(i + (r >> 12) + 32); i = (r & 4095) << 3; break; case 12: t += o(i + (r >> 13) + 32); i = (r & 8191) << 2; break; case 13: t += o(i + (r >> 14) + 32); i = (r & 16383) << 1; break; case 14: t += o(i + (r >> 15) + 32, (r & 32767) + 32); s = 0; break } } return t + o(i + 32) }, decompressFromUTF16: function (e) { if (e == null) return ""; var t = "", n, r, i = 0, s = 0, o = LZString._f; while (s < e.length) { r = e.charCodeAt(s) - 32; switch (i++) { case 0: n = r << 1; break; case 1: t += o(n | r >> 14); n = (r & 16383) << 2; break; case 2: t += o(n | r >> 13); n = (r & 8191) << 3; break; case 3: t += o(n | r >> 12); n = (r & 4095) << 4; break; case 4: t += o(n | r >> 11); n = (r & 2047) << 5; break; case 5: t += o(n | r >> 10); n = (r & 1023) << 6; break; case 6: t += o(n | r >> 9); n = (r & 511) << 7; break; case 7: t += o(n | r >> 8); n = (r & 255) << 8; break; case 8: t += o(n | r >> 7); n = (r & 127) << 9; break; case 9: t += o(n | r >> 6); n = (r & 63) << 10; break; case 10: t += o(n | r >> 5); n = (r & 31) << 11; break; case 11: t += o(n | r >> 4); n = (r & 15) << 12; break; case 12: t += o(n | r >> 3); n = (r & 7) << 13; break; case 13: t += o(n | r >> 2); n = (r & 3) << 14; break; case 14: t += o(n | r >> 1); n = (r & 1) << 15; break; case 15: t += o(n | r); i = 0; break }s++ } return LZString.decompress(t) }, compressToUint8Array: function (e) { var t = LZString.compress(e); var n = new Uint8Array(t.length * 2); for (var r = 0, i = t.length; r < i; r++) { var s = t.charCodeAt(r); n[r * 2] = s >>> 8; n[r * 2 + 1] = s % 256 } return n }, decompressFromUint8Array: function (e) { if (e === null || e === undefined) { return LZString.decompress(e) } else { var t = new Array(e.length / 2); for (var n = 0, r = t.length; n < r; n++) { t[n] = e[n * 2] * 256 + e[n * 2 + 1] } return LZString.decompress(String.fromCharCode.apply(null, t)) } }, compressToEncodedURIComponent: function (e) { return LZString.compressToBase64(e).replace(/=/g, "$").replace(/\//g, "-") }, decompressFromEncodedURIComponent: function (e) { if (e) e = e.replace(/$/g, "=").replace(/-/g, "/"); return LZString.decompressFromBase64(e) }, compress: function (e) { if (e == null) return ""; var t, n, r = {}, i = {}, s = "", o = "", u = "", a = 2, f = 3, l = 2, c = "", h = 0, p = 0, d, v = LZString._f; for (d = 0; d < e.length; d += 1) { s = e.charAt(d); if (!Object.prototype.hasOwnProperty.call(r, s)) { r[s] = f++; i[s] = true } o = u + s; if (Object.prototype.hasOwnProperty.call(r, o)) { u = o } else { if (Object.prototype.hasOwnProperty.call(i, u)) { if (u.charCodeAt(0) < 256) { for (t = 0; t < l; t++) { h = h << 1; if (p == 15) { p = 0; c += v(h); h = 0 } else { p++ } } n = u.charCodeAt(0); for (t = 0; t < 8; t++) { h = h << 1 | n & 1; if (p == 15) { p = 0; c += v(h); h = 0 } else { p++ } n = n >> 1 } } else { n = 1; for (t = 0; t < l; t++) { h = h << 1 | n; if (p == 15) { p = 0; c += v(h); h = 0 } else { p++ } n = 0 } n = u.charCodeAt(0); for (t = 0; t < 16; t++) { h = h << 1 | n & 1; if (p == 15) { p = 0; c += v(h); h = 0 } else { p++ } n = n >> 1 } } a--; if (a == 0) { a = Math.pow(2, l); l++ } delete i[u] } else { n = r[u]; for (t = 0; t < l; t++) { h = h << 1 | n & 1; if (p == 15) { p = 0; c += v(h); h = 0 } else { p++ } n = n >> 1 } } a--; if (a == 0) { a = Math.pow(2, l); l++ } r[o] = f++; u = String(s) } } if (u !== "") { if (Object.prototype.hasOwnProperty.call(i, u)) { if (u.charCodeAt(0) < 256) { for (t = 0; t < l; t++) { h = h << 1; if (p == 15) { p = 0; c += v(h); h = 0 } else { p++ } } n = u.charCodeAt(0); for (t = 0; t < 8; t++) { h = h << 1 | n & 1; if (p == 15) { p = 0; c += v(h); h = 0 } else { p++ } n = n >> 1 } } else { n = 1; for (t = 0; t < l; t++) { h = h << 1 | n; if (p == 15) { p = 0; c += v(h); h = 0 } else { p++ } n = 0 } n = u.charCodeAt(0); for (t = 0; t < 16; t++) { h = h << 1 | n & 1; if (p == 15) { p = 0; c += v(h); h = 0 } else { p++ } n = n >> 1 } } a--; if (a == 0) { a = Math.pow(2, l); l++ } delete i[u] } else { n = r[u]; for (t = 0; t < l; t++) { h = h << 1 | n & 1; if (p == 15) { p = 0; c += v(h); h = 0 } else { p++ } n = n >> 1 } } a--; if (a == 0) { a = Math.pow(2, l); l++ } } n = 2; for (t = 0; t < l; t++) { h = h << 1 | n & 1; if (p == 15) { p = 0; c += v(h); h = 0 } else { p++ } n = n >> 1 } while (true) { h = h << 1; if (p == 15) { c += v(h); break } else p++ } return c }, decompress: function (e) { if (e == null) return ""; if (e == "") return null; var t = [], n, r = 4, i = 4, s = 3, o = "", u = "", a, f, l, c, h, p, d, v = LZString._f, m = { string: e, val: e.charCodeAt(0), position: 32768, index: 1 }; for (a = 0; a < 3; a += 1) { t[a] = a } l = 0; h = Math.pow(2, 2); p = 1; while (p != h) { c = m.val & m.position; m.position >>= 1; if (m.position == 0) { m.position = 32768; m.val = m.string.charCodeAt(m.index++) } l |= (c > 0 ? 1 : 0) * p; p <<= 1 } switch (n = l) { case 0: l = 0; h = Math.pow(2, 8); p = 1; while (p != h) { c = m.val & m.position; m.position >>= 1; if (m.position == 0) { m.position = 32768; m.val = m.string.charCodeAt(m.index++) } l |= (c > 0 ? 1 : 0) * p; p <<= 1 } d = v(l); break; case 1: l = 0; h = Math.pow(2, 16); p = 1; while (p != h) { c = m.val & m.position; m.position >>= 1; if (m.position == 0) { m.position = 32768; m.val = m.string.charCodeAt(m.index++) } l |= (c > 0 ? 1 : 0) * p; p <<= 1 } d = v(l); break; case 2: return "" }t[3] = d; f = u = d; while (true) { if (m.index > m.string.length) { return "" } l = 0; h = Math.pow(2, s); p = 1; while (p != h) { c = m.val & m.position; m.position >>= 1; if (m.position == 0) { m.position = 32768; m.val = m.string.charCodeAt(m.index++) } l |= (c > 0 ? 1 : 0) * p; p <<= 1 } switch (d = l) { case 0: l = 0; h = Math.pow(2, 8); p = 1; while (p != h) { c = m.val & m.position; m.position >>= 1; if (m.position == 0) { m.position = 32768; m.val = m.string.charCodeAt(m.index++) } l |= (c > 0 ? 1 : 0) * p; p <<= 1 } t[i++] = v(l); d = i - 1; r--; break; case 1: l = 0; h = Math.pow(2, 16); p = 1; while (p != h) { c = m.val & m.position; m.position >>= 1; if (m.position == 0) { m.position = 32768; m.val = m.string.charCodeAt(m.index++) } l |= (c > 0 ? 1 : 0) * p; p <<= 1 } t[i++] = v(l); d = i - 1; r--; break; case 2: return u }if (r == 0) { r = Math.pow(2, s); s++ } if (t[d]) { o = t[d] } else { if (d === i) { o = f + f.charAt(0) } else { return null } } u += o; t[i++] = f + o.charAt(0); r--; f = o; if (r == 0) { r = Math.pow(2, s); s++ } } } }; if (typeof module !== "undefined" && module != null) { module.exports = LZString }


var MD5=function(e){function g(a,b){var c,d,e,f;e=a&2147483648;f=b&2147483648;c=a&1073741824;d=b&1073741824;a=(a&1073741823)+(b&1073741823);return c&d?a^2147483648^e^f:c|d?a&1073741824?a^3221225472^e^f:a^1073741824^e^f:a^e^f}function h(a,b,c,d,e,f,n){a=g(a,g(g(b&c|~b&d,e),n));return g(a<<f|a>>>32-f,b)}function k(a,b,c,d,e,f,n){a=g(a,g(g(b&d|c&~d,e),n));return g(a<<f|a>>>32-f,b)}function l(a,b,d,c,e,f,n){a=g(a,g(g(b^d^c,e),n));return g(a<<f|a>>>32-f,b)}function m(a,b,d,c,e,f,n){a=g(a,g(g(d^(b|~c),e),n));return g(a<<f|a>>>32-f,b)}function p(a){var b="",d,c;for(c=0;3>=c;c++)d=a>>>8*c&255,d="0"+d.toString(16),b+=d.substr(d.length-2,2);return b}var f=[],q,r,t,u,a,b,c,d;e=function(a){a=a.replace(/\r\n/g,"\n");for(var b="",d=0;d<a.length;d++){var c=a.charCodeAt(d);128>c?b+=String.fromCharCode(c):(127<c&&2048>c?b+=String.fromCharCode(c>>6|192):(b+=String.fromCharCode(c>>12|224),b+=String.fromCharCode(c>>6&63|128)),b+=String.fromCharCode(c&63|128))}return b}(e);f=function(a){var b,c=a.length;b=c+8;for(var d=16*((b-b%64)/64+1),e=Array(d-1),f,g=0;g<c;)b=(g-g%4)/4,f=g%4*8,e[b]|=a.charCodeAt(g)<<f,g++;b=(g-g%4)/4;e[b]|=128<<g%4*8;e[d-2]=c<<3;e[d-1]=c>>>29;return e}(e);a=1732584193;b=4023233417;c=2562383102;d=271733878;for(e=0;e<f.length;e+=16)q=a,r=b,t=c,u=d,a=h(a,b,c,d,f[e+0],7,3614090360),d=h(d,a,b,c,f[e+1],12,3905402710),c=h(c,d,a,b,f[e+2],17,606105819),b=h(b,c,d,a,f[e+3],22,3250441966),a=h(a,b,c,d,f[e+4],7,4118548399),d=h(d,a,b,c,f[e+5],12,1200080426),c=h(c,d,a,b,f[e+6],17,2821735955),b=h(b,c,d,a,f[e+7],22,4249261313),a=h(a,b,c,d,f[e+8],7,1770035416),d=h(d,a,b,c,f[e+9],12,2336552879),c=h(c,d,a,b,f[e+10],17,4294925233),b=h(b,c,d,a,f[e+11],22,2304563134),a=h(a,b,c,d,f[e+12],7,1804603682),d=h(d,a,b,c,f[e+13],12,4254626195),c=h(c,d,a,b,f[e+14],17,2792965006),b=h(b,c,d,a,f[e+15],22,1236535329),a=k(a,b,c,d,f[e+1],5,4129170786),d=k(d,a,b,c,f[e+6],9,3225465664),c=k(c,d,a,b,f[e+11],14,643717713),b=k(b,c,d,a,f[e+0],20,3921069994),a=k(a,b,c,d,f[e+5],5,3593408605),d=k(d,a,b,c,f[e+10],9,38016083),c=k(c,d,a,b,f[e+15],14,3634488961),b=k(b,c,d,a,f[e+4],20,3889429448),a=k(a,b,c,d,f[e+9],5,568446438),d=k(d,a,b,c,f[e+14],9,3275163606),c=k(c,d,a,b,f[e+3],14,4107603335),b=k(b,c,d,a,f[e+8],20,1163531501),a=k(a,b,c,d,f[e+13],5,2850285829),d=k(d,a,b,c,f[e+2],9,4243563512),c=k(c,d,a,b,f[e+7],14,1735328473),b=k(b,c,d,a,f[e+12],20,2368359562),a=l(a,b,c,d,f[e+5],4,4294588738),d=l(d,a,b,c,f[e+8],11,2272392833),c=l(c,d,a,b,f[e+11],16,1839030562),b=l(b,c,d,a,f[e+14],23,4259657740),a=l(a,b,c,d,f[e+1],4,2763975236),d=l(d,a,b,c,f[e+4],11,1272893353),c=l(c,d,a,b,f[e+7],16,4139469664),b=l(b,c,d,a,f[e+10],23,3200236656),a=l(a,b,c,d,f[e+13],4,681279174),d=l(d,a,b,c,f[e+0],11,3936430074),c=l(c,d,a,b,f[e+3],16,3572445317),b=l(b,c,d,a,f[e+6],23,76029189),a=l(a,b,c,d,f[e+9],4,3654602809),d=l(d,a,b,c,f[e+12],11,3873151461),c=l(c,d,a,b,f[e+15],16,530742520),b=l(b,c,d,a,f[e+2],23,3299628645),a=m(a,b,c,d,f[e+0],6,4096336452),d=m(d,a,b,c,f[e+7],10,1126891415),c=m(c,d,a,b,f[e+14],15,2878612391),b=m(b,c,d,a,f[e+5],21,4237533241),a=m(a,b,c,d,f[e+12],6,1700485571),d=m(d,a,b,c,f[e+3],10,2399980690),c=m(c,d,a,b,f[e+10],15,4293915773),b=m(b,c,d,a,f[e+1],21,2240044497),a=m(a,b,c,d,f[e+8],6,1873313359),d=m(d,a,b,c,f[e+15],10,4264355552),c=m(c,d,a,b,f[e+6],15,2734768916),b=m(b,c,d,a,f[e+13],21,1309151649),a=m(a,b,c,d,f[e+4],6,4149444226),d=m(d,a,b,c,f[e+11],10,3174756917),c=m(c,d,a,b,f[e+2],15,718787259),b=m(b,c,d,a,f[e+9],21,3951481745),a=g(a,q),b=g(b,r),c=g(c,t),d=g(d,u);return(p(a)+p(b)+p(c)+p(d)).toUpperCase()};
var MD5 = function (string) {
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

    return temp.toUpperCase();
}



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  AES implementation in JavaScript (c) Chris Veness 2005-2012                                   */
/*   - see http://csrc.nist.gov/publications/PubsFIPS.html#197                                    */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Aes = {  // Aes namespace

    /**
     * AES Cipher function: encrypt 'input' state with Rijndael algorithm
     *   applies Nr rounds (10/12/14) using key schedule w for 'add round key' stage
     *
     * @param {Number[]} input 16-byte (128-bit) input state array
     * @param {Number[][]} w   Key schedule as 2D byte-array (Nr+1 x Nb bytes)
     * @returns {Number[]}     Encrypted output state array
     */
    cipher: function (input, w) {    // main Cipher function [§5.1]
        var Nb = 4;               // block size (in words): no of columns in state (fixed at 4 for AES)
        var Nr = w.length / Nb - 1; // no of rounds: 10/12/14 for 128/192/256-bit keys

        var state = [[], [], [], []];  // initialise 4xNb byte-array 'state' with input [§3.4]
        for (var i = 0; i < 4 * Nb; i++) state[i % 4][Math.floor(i / 4)] = input[i];

        state = Aes.addRoundKey(state, w, 0, Nb);

        for (var round = 1; round < Nr; round++) {
            state = Aes.subBytes(state, Nb);
            state = Aes.shiftRows(state, Nb);
            state = Aes.mixColumns(state, Nb);
            state = Aes.addRoundKey(state, w, round, Nb);
        }

        state = Aes.subBytes(state, Nb);
        state = Aes.shiftRows(state, Nb);
        state = Aes.addRoundKey(state, w, Nr, Nb);

        var output = new Array(4 * Nb);  // convert state to 1-d array before returning [§3.4]
        for (var i = 0; i < 4 * Nb; i++) output[i] = state[i % 4][Math.floor(i / 4)];
        return output;
    },

    /**
     * Perform Key Expansion to generate a Key Schedule
     *
     * @param {Number[]} key Key as 16/24/32-byte array
     * @returns {Number[][]} Expanded key schedule as 2D byte-array (Nr+1 x Nb bytes)
     */
    keyExpansion: function (key) {  // generate Key Schedule (byte-array Nr+1 x Nb) from Key [§5.2]
        var Nb = 4;            // block size (in words): no of columns in state (fixed at 4 for AES)
        var Nk = key.length / 4  // key length (in words): 4/6/8 for 128/192/256-bit keys
        var Nr = Nk + 6;       // no of rounds: 10/12/14 for 128/192/256-bit keys

        var w = new Array(Nb * (Nr + 1));
        var temp = new Array(4);

        for (var i = 0; i < Nk; i++) {
            var r = [key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]];
            w[i] = r;
        }

        for (var i = Nk; i < (Nb * (Nr + 1)); i++) {
            w[i] = new Array(4);
            for (var t = 0; t < 4; t++) temp[t] = w[i - 1][t];
            if (i % Nk == 0) {
                temp = Aes.subWord(Aes.rotWord(temp));
                for (var t = 0; t < 4; t++) temp[t] ^= Aes.rCon[i / Nk][t];
            } else if (Nk > 6 && i % Nk == 4) {
                temp = Aes.subWord(temp);
            }
            for (var t = 0; t < 4; t++) w[i][t] = w[i - Nk][t] ^ temp[t];
        }

        return w;
    },

    /*
     * ---- remaining routines are private, not called externally ----
     */

    subBytes: function (s, Nb) {    // apply SBox to state S [§5.1.1]
        for (var r = 0; r < 4; r++) {
            for (var c = 0; c < Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
        }
        return s;
    },

    shiftRows: function (s, Nb) {    // shift row r of state S left by r bytes [§5.1.2]
        var t = new Array(4);
        for (var r = 1; r < 4; r++) {
            for (var c = 0; c < 4; c++) t[c] = s[r][(c + r) % Nb];  // shift into temp copy
            for (var c = 0; c < 4; c++) s[r][c] = t[c];         // and copy back
        }          // note that this will work for Nb=4,5,6, but not 7,8 (always 4 for AES):
        return s;  // see asmaes.sourceforge.net/rijndael/rijndaelImplementation.pdf
    },

    mixColumns: function (s, Nb) {   // combine bytes of each col of state S [§5.1.3]
        for (var c = 0; c < 4; c++) {
            var a = new Array(4);  // 'a' is a copy of the current column from 's'
            var b = new Array(4);  // 'b' is a•{02} in GF(2^8)
            for (var i = 0; i < 4; i++) {
                a[i] = s[i][c];
                b[i] = s[i][c] & 0x80 ? s[i][c] << 1 ^ 0x011b : s[i][c] << 1;

            }
            // a[n] ^ b[n] is a•{03} in GF(2^8)
            s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; // 2*a0 + 3*a1 + a2 + a3
            s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; // a0 * 2*a1 + 3*a2 + a3
            s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; // a0 + a1 + 2*a2 + 3*a3
            s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; // 3*a0 + a1 + a2 + 2*a3
        }
        return s;
    },

    addRoundKey: function (state, w, rnd, Nb) {  // xor Round Key into state S [§5.1.4]
        for (var r = 0; r < 4; r++) {
            for (var c = 0; c < Nb; c++) state[r][c] ^= w[rnd * 4 + c][r];
        }
        return state;
    },

    subWord: function (w) {    // apply SBox to 4-byte word w
        for (var i = 0; i < 4; i++) w[i] = Aes.sBox[w[i]];
        return w;
    },

    rotWord: function (w) {    // rotate 4-byte word w left by one byte
        var tmp = w[0];
        for (var i = 0; i < 3; i++) w[i] = w[i + 1];
        w[3] = tmp;
        return w;
    },

    // sBox is pre-computed multiplicative inverse in GF(2^8) used in subBytes and keyExpansion [§5.1.1]
    sBox: [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
        0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
        0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
        0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
        0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
        0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
        0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
        0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
        0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
        0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
        0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
        0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
        0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
        0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
        0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
        0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16],

    // rCon is Round Constant used for the Key Expansion [1st col is 2^(r-1) in GF(2^8)] [§5.2]
    rCon: [
        [0x00, 0x00, 0x00, 0x00],
        [0x01, 0x00, 0x00, 0x00],
        [0x02, 0x00, 0x00, 0x00],
        [0x04, 0x00, 0x00, 0x00],
        [0x08, 0x00, 0x00, 0x00],
        [0x10, 0x00, 0x00, 0x00],
        [0x20, 0x00, 0x00, 0x00],
        [0x40, 0x00, 0x00, 0x00],
        [0x80, 0x00, 0x00, 0x00],
        [0x1b, 0x00, 0x00, 0x00],
        [0x36, 0x00, 0x00, 0x00]],


    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
    /*  AES Counter-mode implementation in JavaScript (c) Chris Veness 2005-2012                      */
    /*   - see http://csrc.nist.gov/publications/nistpubs/800-38a/sp800-38a.pdf                       */
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    Ctr: {   // Aes.Ctr namespace: a subclass or extension of Aes

        /**
         * Encrypt a text using AES encryption in Counter mode of operation
         *
         * Unicode multi-byte character safe
         *
         * @param {String} plaintext Source text to be encrypted
         * @param {String} password  The password to use to generate a key
         * @param {Number} nBits     Number of bits to be used in the key (128, 192, or 256)
         * @returns {string}         Encrypted text
         */
        encrypt: function (plaintext, password, nBits) {
            var nBits = nBits || 128
            var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
            if (!(nBits == 128 || nBits == 192 || nBits == 256)) return '';  // standard allows 128/192/256 bit keys
            plaintext = Aes.Utf8.encode(plaintext);
            password = Aes.Utf8.encode(password);

            //var t = new Date();  // timer

            // use AES itself to encrypt password to get cipher key (using plain password as source for key
            // expansion) - gives us well encrypted key (though hashed key might be preferred for prod'n use)
            var nBytes = nBits / 8;  // no bytes in key (16/24/32)
            var pwBytes = new Array(nBytes);
            for (var i = 0; i < nBytes; i++) {  // use 1st 16/24/32 chars of password for key
                pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
            }
            var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));  // gives us 16-byte key
            key = key.concat(key.slice(0, nBytes - 16));  // expand key to 16/24/32 bytes long

            // initialise 1st 8 bytes of counter block with nonce (NIST SP800-38A §B.2): [0-1] = millisec,
            // [2-3] = random, [4-7] = seconds, together giving full sub-millisec uniqueness up to Feb 2106
            var counterBlock = new Array(blockSize);

            var nonce = (new Date()).getTime();  // timestamp: milliseconds since 1-Jan-1970
            var nonceMs = nonce % 1000;
            var nonceSec = Math.floor(nonce / 1000);
            var nonceRnd = Math.floor(Math.random() * 0xffff);

            for (var i = 0; i < 2; i++) counterBlock[i] = (nonceMs >>> i * 8) & 0xff;
            for (var i = 0; i < 2; i++) counterBlock[i + 2] = (nonceRnd >>> i * 8) & 0xff;
            for (var i = 0; i < 4; i++) counterBlock[i + 4] = (nonceSec >>> i * 8) & 0xff;

            // and convert it to a string to go on the front of the ciphertext
            var ctrTxt = '';
            for (var i = 0; i < 8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

            // generate key schedule - an expansion of the key into distinct Key Rounds for each round
            var keySchedule = Aes.keyExpansion(key);

            var blockCount = Math.ceil(plaintext.length / blockSize);
            var ciphertxt = new Array(blockCount);  // ciphertext as array of strings

            for (var b = 0; b < blockCount; b++) {
                // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
                // done in two stages for 32-bit ops: using two words allows us to go past 2^32 blocks (68GB)
                for (var c = 0; c < 4; c++) counterBlock[15 - c] = (b >>> c * 8) & 0xff;
                for (var c = 0; c < 4; c++) counterBlock[15 - c - 4] = (b / 0x100000000 >>> c * 8)

                var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // -- encrypt counter block --

                // block size is reduced on final block
                var blockLength = b < blockCount - 1 ? blockSize : (plaintext.length - 1) % blockSize + 1;
                var cipherChar = new Array(blockLength);

                for (var i = 0; i < blockLength; i++) {  // -- xor plaintext with ciphered counter char-by-char --
                    cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b * blockSize + i);
                    cipherChar[i] = String.fromCharCode(cipherChar[i]);
                }
                ciphertxt[b] = cipherChar.join('');
            }

            // Array.join is more efficient than repeated string concatenation in IE
            var ciphertext = ctrTxt + ciphertxt.join('');
            ciphertext = Aes.Base64.encode(ciphertext);  // encode in base64

            //alert((new Date()) - t);
            return ciphertext;
        },

        /**
         * Decrypt a text encrypted by AES in counter mode of operation
         *
         * @param {String} ciphertext Source text to be encrypted
         * @param {String} password   The password to use to generate a key
         * @param {Number} nBits      Number of bits to be used in the key (128, 192, or 256)
         * @returns {String}          Decrypted text
         */
        decrypt: function (ciphertext, password, nBits) {
            var nBits = nBits || 128
            var blockSize = 16;  // block size fixed at 16 bytes / 128 bits (Nb=4) for AES
            if (!(nBits == 128 || nBits == 192 || nBits == 256)) return '';  // standard allows 128/192/256 bit keys
            ciphertext = Aes.Base64.decode(ciphertext);
            password = Aes.Utf8.encode(password);
            //var t = new Date();  // timer

            // use AES to encrypt password (mirroring encrypt routine)
            var nBytes = nBits / 8;  // no bytes in key
            var pwBytes = new Array(nBytes);
            for (var i = 0; i < nBytes; i++) {
                pwBytes[i] = isNaN(password.charCodeAt(i)) ? 0 : password.charCodeAt(i);
            }
            var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
            key = key.concat(key.slice(0, nBytes - 16));  // expand key to 16/24/32 bytes long

            // recover nonce from 1st 8 bytes of ciphertext
            var counterBlock = new Array(8);
            ctrTxt = ciphertext.slice(0, 8);
            for (var i = 0; i < 8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);

            // generate key schedule
            var keySchedule = Aes.keyExpansion(key);

            // separate ciphertext into blocks (skipping past initial 8 bytes)
            var nBlocks = Math.ceil((ciphertext.length - 8) / blockSize);
            var ct = new Array(nBlocks);
            for (var b = 0; b < nBlocks; b++) ct[b] = ciphertext.slice(8 + b * blockSize, 8 + b * blockSize + blockSize);
            ciphertext = ct;  // ciphertext is now array of block-length strings

            // plaintext will get generated block-by-block into array of block-length strings
            var plaintxt = new Array(ciphertext.length);

            for (var b = 0; b < nBlocks; b++) {
                // set counter (block #) in last 8 bytes of counter block (leaving nonce in 1st 8 bytes)
                for (var c = 0; c < 4; c++) counterBlock[15 - c] = ((b) >>> c * 8) & 0xff;
                for (var c = 0; c < 4; c++) counterBlock[15 - c - 4] = (((b + 1) / 0x100000000 - 1) >>> c * 8) & 0xff;

                var cipherCntr = Aes.cipher(counterBlock, keySchedule);  // encrypt counter block

                var plaintxtByte = new Array(ciphertext[b].length);
                for (var i = 0; i < ciphertext[b].length; i++) {
                    // -- xor plaintxt with ciphered counter byte-by-byte --
                    plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
                    plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
                }
                plaintxt[b] = plaintxtByte.join('');
            }

            // join array of blocks into single plaintext string
            var plaintext = plaintxt.join('');
            plaintext = Aes.Utf8.decode(plaintext);  // decode from UTF8 back to Unicode multi-byte chars

            //alert((new Date()) - t);
            return plaintext;
        }
    },

    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
    /*  Aes.Base64 class: Base 64 encoding / decoding (c) Chris Veness 2002-2012                          */
    /*    note: depends on Utf8 class                                                                 */
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    Base64: {   // Base64 namespace

        code: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        /**
         * Encode string into Aes.Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
         * (instance method extending String object). As per RFC 4648, no newlines are added.
         *
         * @param {String} str The string to be encoded as base-64
         * @param {Boolean} [utf8encode=false] Flag to indicate whether str is Unicode string to be encoded
         *   to UTF8 before conversion to base64; otherwise string is assumed to be 8-bit characters
         * @returns {String} Base64-encoded string
         */
        encode: function (str, utf8encode) {  // http://tools.ietf.org/html/rfc4648
            utf8encode = (typeof utf8encode == 'undefined') ? false : utf8encode;
            var o1, o2, o3, bits, h1, h2, h3, h4, e = [], pad = '', c, plain, coded;
            var b64 = Aes.Base64.code;

            plain = utf8encode ? str.encodeUTF8() : str;

            c = plain.length % 3;  // pad string to length of multiple of 3
            if (c > 0) { while (c++ < 3) { pad += '='; plain += '\0'; } }
            // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars

            for (c = 0; c < plain.length; c += 3) {  // pack three octets into four hexets
                o1 = plain.charCodeAt(c);
                o2 = plain.charCodeAt(c + 1);
                o3 = plain.charCodeAt(c + 2);

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                // use hextets to index into code string
                e[c / 3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
            }
            coded = e.join('');  // join() is far faster than repeated string concatenation in IE

            // replace 'A's from padded nulls with '='s
            coded = coded.slice(0, coded.length - pad.length) + pad;

            return coded;
        },

        /**
         * Decode string from Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
         * (instance method extending String object). As per RFC 4648, newlines are not catered for.
         *
         * @param {String} str The string to be decoded from base-64
         * @param {Boolean} [utf8decode=false] Flag to indicate whether str is Unicode string to be decoded
         *   from UTF8 after conversion from base64
         * @returns {String} decoded string
         */
        decode: function (str, utf8decode) {
            utf8decode = (typeof utf8decode == 'undefined') ? false : utf8decode;
            var o1, o2, o3, h1, h2, h3, h4, bits, d = [], plain, coded;
            var b64 = Aes.Base64.code;

            coded = utf8decode ? str.decodeUTF8() : str;


            for (var c = 0; c < coded.length; c += 4) {  // unpack four hexets into three octets
                h1 = b64.indexOf(coded.charAt(c));
                h2 = b64.indexOf(coded.charAt(c + 1));
                h3 = b64.indexOf(coded.charAt(c + 2));
                h4 = b64.indexOf(coded.charAt(c + 3));

                bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

                o1 = bits >>> 16 & 0xff;
                o2 = bits >>> 8 & 0xff;
                o3 = bits & 0xff;

                d[c / 4] = String.fromCharCode(o1, o2, o3);
                // check for padding
                if (h4 == 0x40) d[c / 4] = String.fromCharCode(o1, o2);
                if (h3 == 0x40) d[c / 4] = String.fromCharCode(o1);
            }
            plain = d.join('');  // join() is far faster than repeated string concatenation in IE

            return utf8decode ? plain.decodeUTF8() : plain;
        }

    },
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
    /*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
    /*              single-byte character encoding (c) Chris Veness 2002-2012                         */
    /* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    Utf8: {   // Aes.Utf8 namespace
        /**
         * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
         * (BMP / basic multilingual plane only)
         *
         * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
         *
         * @param {String} strUni Unicode string to be encoded as UTF-8
         * @returns {String} encoded string
         */
        encode: function (strUni) {
            // use regular expressions & String.replace callback function for better efficiency
            // than procedural approaches
            var strUtf = strUni.replace(
                /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
                function (c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
                }
            );
            strUtf = strUtf.replace(
                /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
                function (c) {
                    var cc = c.charCodeAt(0);
                    return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
                }
            );
            return strUtf;
        },

        /**
         * Decode utf-8 encoded string back into multi-byte Unicode characters
         *
         * @param {String} strUtf UTF-8 string to be decoded back to Unicode
         * @returns {String} decoded string
         */
        decode: function (strUtf) {
            // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
            var strUni = strUtf.replace(
                /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
                function (c) {  // (note parentheses for precence)
                    var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                    return String.fromCharCode(cc);
                }
            );
            strUni = strUni.replace(
                /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
                function (c) {  // (note parentheses for precence)
                    var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                    return String.fromCharCode(cc);
                }
            );
            return strUni;
        }
    }
}
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

