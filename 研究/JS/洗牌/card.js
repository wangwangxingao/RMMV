/*@license Xoshiro128 JS v0.1 | CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/deed) */var Xoshiro = function (f, z, y) { function d(b) { this.init(b) } d.i32 = 1 / 4294967296; y = function (b, c) { return b << c | b >>> 32 - c }; d.r = function (b) { return b * d.i32 }; d.f = function (b, c) { return 1 < c ? Math.floor(d.r(b) * c) : 0 }; z = "function" == typeof Math.imul ? Math.imul : function (b, c) { return (b * (c >>> 16) << 16) + b * (c & 65535) }; f = d.prototype; f.init = function (b) { b = new Uint32Array([b || 0, 0]); return this.s = this.s64(b) }; f.s64 = function (b) { var c = ((b[0] & 65535) + 31765 >>> 16) + (b[0] >>> 16) + 32586 >>> 16, a = new Uint32Array(2); a[0] = b[0] += 2135587861; a[1] = b[1] += 2654435769 + c; a[0] ^= (a[0] >>> 30) + (a[1] << 2); a[1] ^= a[1] >>> 30; b = a[0] & 65535; c = a[0] >>> 16; c = ((58809 * b >>> 16) + 7396 * b + 58809 * c >>> 16) + 7396 * c + z(a[0], 3210233709) + z(a[1], 484763065); a[0] = z(a[0], 484763065); a[1] = c; a[0] ^= (a[0] >>> 27) + (a[1] << 5); a[1] ^= a[1] >>> 27; b = a[0] & 65535; c = a[0] >>> 16; c = ((4587 * b >>> 16) + 4913 * b + 4587 * c >>> 16) + 4913 * c + z(a[0], 2496678331) + z(a[1], 321982955); a[0] = z(a[0], 321982955); a[1] = c; a[0] ^= (a[0] >>> 31) + (a[1] << 1); a[1] ^= a[1] >>> 31; return a }; f.random = function () { var b = this.s, a = b[0], e = b[1]; r = 2654435771 * a; e ^= a; b[0] = y(a, 26) ^ e ^ e << 9; b[1] = y(e, 13); return r >>> 0 }; f.randomReal = function () { return d.r(this.random()) }; f.randomFree = function (b) { return d.f(this.random(), b) }; return d }();



var ww = ww || {}
ww.card = {}
/**获取随机数 */
ww.card.random = new Xoshiro()
/**复制一个数组 */
ww.card.clone = function (l, c) {
    return (l).slice(0)
}
/**打乱一个数组 */
ww.card.shuffle = function (l, z, r) {
    if (Array.isArray(l)) {
        var n = l.length, t, i = 0;
        ww.card.random.init(z)
        // 如果还剩有元素…
        if (r) {
            l = this.clone(l)
        }
        while (n) {
            i = ww.card.random.randomFree(n--);
            t = l[n];
            l[n] = l[i];
            l[i] = t;
        } 
    } else {
        var l = []
    }
    return l;
}
/**还原一个数组 */
ww.card.reshuffle = function (l, z, r) {
    if (Array.isArray(l)) {
        var n = l.length, t, i = 0, c = [];
        ww.card.random.init(z)
        // 如果还剩有元素… 
        while (n) {
            t = ww.card.random.randomFree(n--);
            c[n] = t
        }
        if (r) { l = this.clone(l) }
        while (i < n) {
            t = l[c[i]];
            l[c[i]] = l[i];
            l[i++] = t;
        }
    } else {
        var l = []
    }
    return l;
}



