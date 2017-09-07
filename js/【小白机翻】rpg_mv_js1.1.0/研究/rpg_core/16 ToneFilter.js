
//-----------------------------------------------------------------------------
/**WebGL的颜色矩阵滤镜
 * The color matrix filter for WebGL.
 *
 * @class ToneFilter
 * @constructor
 */
function ToneFilter() {
    PIXI.AbstractFilter.call(this);
    this.initialize.apply(this, arguments);
}

ToneFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
ToneFilter.prototype.constructor = ToneFilter;
//初始化
ToneFilter.prototype.initialize = function() {
    this.passes = [this];

    this.uniforms = {
        matrix: {
            type: 'mat4',
            value: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
        }
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform mat4 matrix;',
        'uniform sampler2D uSampler;',
        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord) * matrix;',
        '}'
    ];
};

/**重设过滤器
 * Resets the filter.
 *
 * @method reset
 */
ToneFilter.prototype.reset = function() {
    this.uniforms.matrix.value = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
};

/**改变色调
 * Changes the hue.
 *
 * @method adjustHue
 * @param {Number} value The hue value in the range (-360, 360)
 */
ToneFilter.prototype.adjustHue = function(value) {
    value = (value || 0) / 180;

    if (value !== 0) {
        var c = Math.cos(value * Math.PI);
        var s = Math.sin(value * Math.PI);
        var a00 = 0.213 + c * 0.787 - s * 0.213;
        var a01 = 0.715 - c * 0.715 - s * 0.715;
        var a02 = 0.072 - c * 0.072 + s * 0.928;
        var a10 = 0.213 - c * 0.213 + s * 0.143;
        var a11 = 0.715 + c * 0.285 + s * 0.140;
        var a12 = 0.072 - c * 0.072 - s * 0.283;
        var a20 = 0.213 - c * 0.213 - s * 0.787;
        var a21 = 0.715 - c * 0.715 + s * 0.715;
        var a22 = 0.072 + c * 0.928 + s * 0.072;
        this._multiplyMatrix([
            a00, a01, a02, 0,
            a10, a11, a12, 0,
            a20, a21, a22, 0,
              0,   0,   0, 1
        ]);
    }
};

/**改变饱和度
 * Changes the saturation.
 *
 * @method adjustSaturation
 * @param {Number} value The saturation value in the range (-255, 255)
 */
ToneFilter.prototype.adjustSaturation = function(value) {
    value = (value || 0).clamp(-255, 255) / 255;

    if (value !== 0) {
        var a = 1 + value;
        var a00 = 0.213 + 0.787 * a;
        var a01 = 0.715 - 0.715 * a;
        var a02 = 0.072 - 0.072 * a;
        var a10 = 0.213 - 0.213 * a;
        var a11 = 0.715 + 0.285 * a;
        var a12 = 0.072 - 0.072 * a;
        var a20 = 0.213 - 0.213 * a;
        var a21 = 0.715 - 0.715 * a;
        var a22 = 0.072 + 0.928 * a;
        this._multiplyMatrix([
            a00, a01, a02, 0,
            a10, a11, a12, 0,
            a20, a21, a22, 0,
              0,   0,   0, 1
        ]);
    }
};

/**改变色调
 * Changes the tone.
 *
 * @method adjustTone
 * @param {Number} r The red strength in the range (-255, 255)
 * @param {Number} g The green strength in the range (-255, 255)
 * @param {Number} b The blue strength in the range (-255, 255)
 */
ToneFilter.prototype.adjustTone = function(r, g, b) {
    r = (r || 0).clamp(-255, 255) / 255;
    g = (g || 0).clamp(-255, 255) / 255;
    b = (b || 0).clamp(-255, 255) / 255;

    if (r !== 0 || g !== 0 || b !== 0) {
        this._multiplyMatrix([
            1, 0, 0, r,
            0, 1, 0, g,
            0, 0, 1, b,
            0, 0, 0, 1
        ]);
    }
};

/**乘矩阵
 * @method _multiplyMatrix
 * @param {Array} matrix
 * @private
 */
ToneFilter.prototype._multiplyMatrix = function(matrix) {
    var value = this.uniforms.matrix.value;
    var temp = [];

    for (var i = 0; i < 4; i++) {
        for (var m = 0; m < 4; m++) {
            temp[m] = value[i * 4 + m];
        }
        for (var j = 0; j < 4; j++) {
            var val = 0;
            for (var n = 0; n < 4; n++) {
                val += matrix[n * 4 + j] * temp[n];
            }
            value[i * 4 + j] = val;
        }
    }
};