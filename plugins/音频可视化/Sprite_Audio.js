/**创建节点
 * @method _createNodes
 * @private
 */
WebAudio.prototype._createNodes = function () {
    var context = WebAudio._context;
    this._sourceNode = context.createBufferSource();
    this._sourceNode.buffer = this._buffer;
    this._sourceNode.loopStart = this._loopStart;
    this._sourceNode.loopEnd = this._loopStart + this._loopLength;
    this._sourceNode.playbackRate.setValueAtTime(this._pitch, context.currentTime);

    this._analyserNode = context.createAnalyser()

    this._gainNode = context.createGain();
    this._gainNode.gain.setValueAtTime(this._volume, context.currentTime);
    this._pannerNode = context.createPanner();
    this._pannerNode.panningModel = 'equalpower';
    this._updatePanner();
};



WebAudio.prototype._connectNodes = function () {
    //源节点 连接 (增益节点)
    this._sourceNode.connect(this._analyserNode);

    this._analyserNode.connect(this._gainNode);

    //增益节点 连接 (声相节点)
    this._gainNode.connect(this._pannerNode);
    //声相节点 连接 (网络音频 主增益节点)
    this._pannerNode.connect(WebAudio._masterGainNode);
};




/**
 * 
 * 绘制  
 * 
 * @param {number} w
 * @param {number} h
 * @param {string} name
 * @param {boolean} type
 * @param {number} length
 * @param {{}} set
 * 
 */

function Sprite_Audio(w, h, name, type, length, set) {
    this.initialize.apply(this, arguments);
}
/**设置原形  */
Sprite_Audio.prototype = Object.create(Sprite.prototype);
/**设置创造者 */
Sprite_Audio.prototype.constructor = Sprite_Audio;
/**初始化 */
Sprite_Audio.prototype.initialize = function (w, h, name, type, length, set) {
    Sprite.prototype.initialize.call(this);

    this.setWH(w, h)
    this._name = name
    this._type = type

    this.setLength(length)
    this._set = set
};


Sprite_Audio.prototype.getAudio = function () {
    if (this._name) {
        return AudioManager[this._name]
    } else {
        return null
    }

}


Sprite_Audio.prototype.setWH = function (w, h) {

    if (this._width != w || this._height != h) {
        this.bitmap = new Bitmap(w, h)
        this._width = w
        this._height = h
    }
}



Sprite_Audio.prototype.setLength = function (length) {

    if (this._length !== length) {
        this._length = length || 256
        this._length2 = Math.ceil(this._length * 0.5)
        this._array = new Uint8Array(this._length2)
        this._array0 = new Uint8Array(this._length2)
        this._array2 = new Uint8Array(this._length2)
    }
}


/**
getFloatFrequencyData
getByteFrequencyData
getByteTimeDomainData
getFloatTimeDomainData 
*/
Sprite_Audio.prototype.getAudioArray = function () {

    var audio = this.getAudio()
    if (audio && audio._analyserNode) {
        audio._analyserNode.fftSize = this._length
        if (this._set) {
            for (var i in this._set) {
                audio._analyserNode[i] = this._set[i]
            }
        }
        if (!this._type) {
            audio._analyserNode.getByteFrequencyData(this._array)
        } else {
            audio._analyserNode.getByteTimeDomainData(this._array)
        }
        return this._array
    } else {
        return 0
    }
};



Sprite_Audio.prototype.draw = function () {

    var canvasCtx = this.bitmap._context

    canvasCtx.clearRect(0, 0, this._width, this._height);
    var dataArray = this.getAudioArray()
    if (!dataArray) {
        if (this._lastArray) {
            this._array0.fill(0)
        }
        this._lastArray = 0
        return
    }
    var lastArray = this._array0

    var bufferLength = dataArray.length
    var barWidth = (this._width / bufferLength);
    var barHeight;
    var x = 0;

    var c = this._type ? ',0' : ',255'//',50,50)'

    for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        if (dataArray[i] >lastArray[i]) {
            lastArray[i] = dataArray[i]
            var c2 = ",255)"
            if(i+1<bufferLength &&i-1>=0){
                if(dataArray[i]<dataArray[i+1]||
                    dataArray[i]<dataArray[i-1] 
                    ){
                    barHeight= 0 
                } 
            }
        } else {
            lastArray[i] = dataArray[i]

            barHeight= 0
            var c2 = ",0)"
        }
        canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + c + c2;
        canvasCtx.fillRect(x, this._height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
    //lastArray.set(dataArray, 0);
    this._lastArray = 1
    this.bitmap._setDirty()
}


Sprite_Audio.prototype.update = function () {
    Sprite.prototype.update.call(this)
    this.draw()
}



Sprite_Audio.test = function () {
    var s = new Sprite_Audio(500, 300, "_bgmBuffer", 1, 32)
    SceneManager._scene.addChild(s)
    this._test = s

    var s = new Sprite_Audio(500, 300, "_bgmBuffer", 0, 32)
    SceneManager._scene.addChild(s)
    s.y = 300
    this._test2 = s

}


 
/*
AnalyserNode.fftSize
    一个无符号长整形(unsigned long)的值, 用于确定频域的 FFT (快速傅里叶变换) 的大小。
AnalyserNode.frequencyBinCount 只读
    一个无符号长整形(unsigned long)的值, 值为fftSize的一半。这通常等于将要用于可视化的数据值的数量。
AnalyserNode.minDecibels
    Is a double value representing the minimum power value in the scaling range for the FFT analysis data, for conversion to unsigned byte values — basically, this specifies the minimum value for the range of results when using getByteFrequencyData().
    节 
    双数，代表最小值分贝用于缩放 FFT 分析数据的值，在哪里0分贝是最响亮的声音，-10DB 是其中的十分之一。默认值是-100分贝 
    当获得数据时从getFloatFrequencyData()或getByteFrequencyData()，任何振幅为minDecibels或更低的将返回为0.0或0分别。
AnalyserNode.maxDecibels
    Is a double value representing the maximum power value in the scaling range for the FFT analysis data, for conversion to unsigned byte values — basically, this specifies the maximum value for the range of results when using getByteFrequencyData().
    双数，代表最大值分贝用于缩放 FFT 分析数据的值，在哪里0分贝是最响亮的声音，-10DB 是其中的十分之一。默认值是-30分贝
    当获得数据时从getFloatFrequencyData()或getByteFrequencyData()，任何振幅为maxDecibels或更高的将返回为+1.0或255分别。
AnalyserNode.smoothingTimeConstant
    是一个双精度浮点型(double)的值，表示最后一个分析帧的平均常数 — 基本上，它随时间使值之间的过渡更平滑。
    smoothingTimeConstant 属性的默认值为 0.8; 值的范围必须在 0 ~ 1 之间. 如果设置为0, 则不进行平均, 而值为1意味着 "在计算值时重叠上一个缓冲区和当前缓冲区相当多", 它基本上平滑了 AnalyserNode.getFloatFrequencyData/AnalyserNode.getByteFrequencyData 调用的变化.
    


AnalyserNode.getFloatFrequencyData()
    将当前频域数据拷贝进Float32Array数组。

AnalyserNode.getByteFrequencyData()
    将当前频域数据拷贝进Uint8Array数组（无符号字节数组）。

AnalyserNode.getFloatTimeDomainData()
    将当前波形，或者时域数据拷贝进Float32Array数组。
AnalyserNode.getByteTimeDomainData()
    将当前波形，或者时域数据拷贝进 Uint8Array数组（无符号字节数组）。  
*/