/*@license Xoshiro128 JS v0.1 | CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/deed) */

function Xoshiro(seed) {
    this.init.apply(this, arguments)
}



Xoshiro.i32 = (1.0 / 4294967296.0)

Xoshiro.rotl = function (x, k) { return (x << k) | (x >>> (32 - k)); };


/**
 * 
 * @param {number} v 计算值
 * @returns {number} [0,1) 0-1的小数
 */
Xoshiro.real = function (v) {
    return v * Xoshiro.i32;
} //[0,1)

/**
 * @param {number} v 计算值
 * @param {number} num  区间
 * @returns {number} [0,num) 0-num的整数
 */
Xoshiro.free = function (v, num) {
    return num > 1 ? Math.floor(Xoshiro.real(v) * num) : 0;
} //[0,1)

Xoshiro.imul = (typeof Math.imul == "function") ? Math.imul : function (a, b) { return ((a * (b >>> 16)) << 16) + (a * (b & 0xffff)); };

Xoshiro.prototype.init = function (seed) {
    this.s = new Uint32Array([123456789, 362436069, 521288629, 88675123]);
    var l = arguments.length
    if (l == 1) {
        if (Array.isArray(seed)) {
            this.init_array(seed);
        } else if (typeof seed === "number" && seed >= 0) {
            this.init_int(seed); 
        } else {
            this.init_random()
        }
    } else if (l > 1) {
        this.init_array(arguments);
    } else {
        this.init_random()
    }
    return this.s
}

/**
 * splitmix64
 * @param {[number,number]} seed 种子
 * @returns {[number,number]}  结果
 */
Xoshiro.prototype.splitmix64 = function (seed) {
    var temp = ((((seed[0] & 0xffff) + 0x7c15) >>> 16) + (seed[0] >>> 16) + 0x7f4a) >>> 16, z0l, z0h;
    var z = new Uint32Array(2);
    z[0] = (seed[0] += 0x7f4a7c15);
    z[1] = (seed[1] += (0x9e3779b9 + temp));

    z[0] ^= (z[0] >>> 30) + (z[1] << 2); z[1] ^= z[1] >>> 30;
    z0l = z[0] & 0xffff; z0h = z[0] >>> 16;
    temp = ((((z0l * 0xe5b9) >>> 16) + (z0l * 0x1ce4) + (z0h * 0xe5b9)) >>> 16) + (z0h * 0x1ce4) + Xoshiro.imul(z[0], 0xbf58476d) + Xoshiro.imul(z[1], 0x1ce4e5b9);
    z[0] = Xoshiro.imul(z[0], 0x1ce4e5b9); z[1] = temp;

    z[0] ^= (z[0] >>> 27) + (z[1] << 5); z[1] ^= z[1] >>> 27;
    z0l = z[0] & 0xffff; z0h = z[0] >>> 16;
    temp = ((((z0l * 0x11eb) >>> 16) + (z0l * 0x1331) + (z0h * 0x11eb)) >>> 16) + (z0h * 0x1331) + Xoshiro.imul(z[0], 0x94d049bb) + Xoshiro.imul(z[1], 0x133111eb);
    z[0] = Xoshiro.imul(z[0], 0x133111eb); z[1] = temp;

    z[0] ^= (z[0] >>> 31) + (z[1] << 1); z[1] ^= z[1] >>> 31;
    return z;
}

/**初始化通过数值 */
Xoshiro.prototype.init_int = function (seed) {
    var sp = new Uint32Array([seed, 0]);
    var out = this.splitmix64(sp);
    this.s[0] = out[0];
    this.s[1] = out[1];
    out = this.splitmix64(sp);
    this.s[2] = out[0];
    this.s[3] = out[1];
}

/**初始化通过数组 */
Xoshiro.prototype.init_array = function (seed) {
    if (seed.length <= 0) {
        return this.init_int(0);
    }
    else if (seed.length == 1) {
        return this.init_int(seed[0]);
    }
    var out;
    var sp = new Uint32Array([seed[0], seed[1]]);
    out = this.splitmix64(sp);
    this.s[0] = out[0];
    this.s[1] = out[1];

    out = this.splitmix64(sp);
    this.s[2] = out[0];
    this.s[3] = out[1];
    for (var i = 3; i < seed.length; i += 2) {
        sp[0] = seed[i - 1],
            sp[1] = seed[i];
        out = this.splitmix64(sp);
        this.s[0] ^= out[0];
        this.s[1] ^= out[1];
        out = this.splitmix64(sp);
        this.s[2] ^= out[0];
        this.s[3] ^= out[1];
    }
    if (seed.length & 1) {
        sp[0] = seed[seed.length - 1], sp[1] = 0;
        out = this.splitmix64(sp); this.s[0] ^= out[0]; this.s[1] ^= out[1];
        out = this.splitmix64(sp); this.s[2] ^= out[0]; this.s[3] ^= out[1];
    }
}


/**随机初始化 */
Xoshiro.prototype.init_random = function () {
    this.init_int(Math.floor(0xffffffff * Math.random()));
}





Xoshiro.prototype.random64s = function () {
    var s = this.s
    var rotl = Xoshiro.rotl
    var s0 = s[0], s1 = s[1]
    result_star = s0 * 0x9E3779BB;
    s1 ^= s0;
    s[0] = rotl(s0, 26) ^ s1 ^ (s1 << 9); // a, b
    s[1] = rotl(s1, 13); // c 
    return result_star >>> 0;
}


Xoshiro.prototype.random64ss = function () {
    var s = this.s
    var rotl = Xoshiro.rotl
    var s0 = s[0], s1 = s[1]

    result_starstar = rotl(s0 * 0x9E3779BB, 5) * 5;

    s1 ^= s0;
    s[0] = rotl(s0, 26) ^ s1 ^ (s1 << 9); // a, b
    s[1] = rotl(s1, 13); // c 
    return result_starstar >>> 0;
}



Xoshiro.prototype.random128p = function () {
    var s = this.s
    var rotl = Xoshiro.rotl

    var result_plus = s[0] + s[3];

    var t = s[1] << 9;

    s[2] ^= s[0];
    s[3] ^= s[1];
    s[1] ^= s[2];
    s[0] ^= s[3];

    s[2] ^= t;

    s[3] = rotl(s[3], 11);
    return result_plus >>> 0;
}

Xoshiro.prototype.random128ss = function () {
    var s = this.s
    var rotl = Xoshiro.rotl
    var s0 = s[0], s1 = s[1], s2 = s[2], s3 = s[3];
    var result_starstar = rotl(s0 * 5, 7) * 9;
    var t = s1 << 9;
    s2 = s2 ^ s0;
    s3 = s3 ^ s1;
    s1 = s1 ^ s2;
    s0 = s0 ^ s3;
    s2 = s2 ^ t;
    s3 = rotl(s3, 11);
    s[0] = s0; s[1] = s1; s[2] = s2; s[3] = s3;
    return result_starstar >>> 0;
}





Xoshiro.prototype.random64sReal = function () {
    return Xoshiro.real(this.random64s());
} //[0,1)


Xoshiro.prototype.random64ssReal = function () {
    return Xoshiro.real(this.random64ss());
} //[0,1)


Xoshiro.prototype.random128pReal = function () {
    return Xoshiro.real(this.random128p());
} //[0,1)
Xoshiro.prototype.random128ssReal = function () {
    return Xoshiro.real(this.random128ss());
} //[0,1)


Xoshiro.prototype.random64sFree = function (num) {
    return Xoshiro.free(this.random64sReal(), num);
} //[0, num)

Xoshiro.prototype.random64ssFree = function (num) {
    return Xoshiro.free(this.random64ssReal(), num);
} //[0, num)



Xoshiro.prototype.random128pFree = function (num) {
    return Xoshiro.free(this.random128p(), num);
} //[0, num)


Xoshiro.prototype.random128ssFree = function (num) {
    return Xoshiro.free(this.random128ssReal(), num);
} //[0, num)


