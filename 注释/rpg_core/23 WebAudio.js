
/**-----------------------------------------------------------------------------   
 * Web Audio API的音频对象
 * The audio object of Web Audio API.
 *
 * @class WebAudio
 * @constructor
 * @param {string} url The url of the audio file
 */
function WebAudio() {
    this.initialize.apply(this, arguments);
}
/**独立*/
WebAudio._standAlone = (function(top){
    //返回 不是 资源处理程序
    return !top.ResourceHandler;
})(this);

/**
 * 初始化
 * @param {*} url 
 */
WebAudio.prototype.initialize = function(url) {
    //如果 没有 网络音频 初始化 
    if (!WebAudio._initialized) {
        //网络音频 初始化()
        WebAudio.initialize();
    }
    //清除()
    this.clear();
    //如果 不是(网络音频独立)
    if(!WebAudio._standAlone){
        this._loader = ResourceHandler.createLoader(url, this._load.bind(this, url), function() {
            this._hasError = true;
        }.bind(this));
    }
    //读取(url)
    this._load(url);
    this._url = url;
};

/**主音量 */
WebAudio._masterVolume   = 1;
/**上下文 */
WebAudio._context        = null;
/**主增益节点 */
WebAudio._masterGainNode = null;
//初始化
WebAudio._initialized    = false;
//解锁
WebAudio._unlocked       = false;

/**初始化音频系统
 * Initializes the audio system.
 *
 * @static
 * @method initialize
 * @param {boolean} noAudio 标志为无音频模式Flag. for the no-audio mode
 * @return {boolean} 如果音频系统可用，则为True. True if the audio system is available
 */
WebAudio.initialize = function(noAudio) {
    if (!this._initialized) {
        if (!noAudio) {
            //创建上下文()
            this._createContext();
            //检测编解码器()
            this._detectCodecs();
            //创建主增益节点()
            this._createMasterGainNode();
            //设置事件处理程序()
            this._setupEventHandlers();
        }
        //初始化 = true
        this._initialized = true;
    }
    //返回 上下文
    return !!this._context;
};

/**检查浏览器是否可以播放OGG文件
 * Checks whether the browser can play ogg files.
 *
 * @static
 * @method canPlayOgg  可以播放ogg
 * @return {boolean} 如果浏览器可以播放ogg文件，则为True. True if the browser can play ogg files
 */
WebAudio.canPlayOgg = function() {
    if (!this._initialized) {
        this.initialize();
    }
    return !!this._canPlayOgg;
};

/**检查浏览器是否可以播放M4A等文件
 * Checks whether the browser can play m4a files.
 *
 * @static
 * @method canPlayM4a 可以播放m4a
 * @return {boolean} 如果浏览器可以播放m4a文件，则为True. True if the browser can play m4a files
 */
WebAudio.canPlayM4a = function() {
    if (!this._initialized) {
        this.initialize();
    }
    return !!this._canPlayM4a;
};

/**
 * 设置主音量
 * 设置所有音频的主音量。
 * Sets the master volume of the all audio.
 *
 * @static
 * @method setMasterVolume 设置主音量
 * @param {Number} value 主音量（最小值：0，最大值：1） Master volume (min: 0, max: 1)
 */
WebAudio.setMasterVolume = function(value) {
    //主音量 = 值;
    this._masterVolume = value;
    //如果(主增益节点)  
    if (this._masterGainNode) {
        //主增益节点 增益 设定值在时间( 主音量,上下文 当前时间 )
        this._masterGainNode.gain.setValueAtTime(this._masterVolume, this._context.currentTime);
    }
};

/**创建上下文
 * @static
 * @method _createContext  创建上下文
 * @private
 */
WebAudio._createContext = function() {
    try {
        //如果 音频上下文 !== 'undefined'
        if (typeof AudioContext !== 'undefined') {
            //上下文 = 新 音频上下文()
            this._context = new AudioContext();
        //否则 如果  webkit音频上下文  !== 'undefined'
        } else if (typeof webkitAudioContext !== 'undefined') {
            //上下文 = 新 webkit音频上下文()
            this._context = new webkitAudioContext();
        }
    } catch (e) {
        //上下文 = null
        this._context = null;
    }
};

/**探测编码译码器
 * @static
 * @method _detectCodecs 探测编码译码器
 * @private
 */
WebAudio._detectCodecs = function() {
    //音频 = 文件 创建元素(音频)
    var audio = document.createElement('audio');
    //音频 能播放类型
    if (audio.canPlayType) {
        //可以播放ogg = 音频 能播放种类('audio/ogg')
        this._canPlayOgg = audio.canPlayType('audio/ogg');
        //可以播放m4a = 音频 能播放种类('audio/mp4') 
        this._canPlayM4a = audio.canPlayType('audio/mp4');
    }
};

/**创建主增益节点
 * @static
 * @method _createMasterGainNode  创建主增益节点
 * @private
 */
WebAudio._createMasterGainNode = function() {
    //上下文 = 网络音频 上下文
    var context = WebAudio._context;
    //如果 上下文
    if (context) {
        //主增益节点 = 上下文 创建增益()
        this._masterGainNode = context.createGain(); 
        //主增益节点 增益 设定值在时间(主音量,上下文 当前时间)  
        this._masterGainNode.gain.setValueAtTime(this._masterVolume, context.currentTime);

        //主增益节点  连 (上下文 目的地)  //context.destination 声音数据传输给扬声器或者耳机
        this._masterGainNode.connect(context.destination);
    }
};

/**安装事件处理
 * @static
 * @method _setupEventHandlers 设置事件处理程序
 * @private
 */
WebAudio._setupEventHandlers = function() {
    //恢复处理程序
    var resumeHandler = function() {
        //上下文 = 网络音频 上下文
        var context = WebAudio._context;
        //如果 上下文 并且 
        //     上下文 状态 ==  "suspended"//暂停   并且 
        //     类型 上下文 恢复 ==="function"//方法 
        if (context && context.state === "suspended" && typeof context.resume === "function") {
            //上下文 恢复 然后 
            context.resume().then(function() {
                //网络音频 在触摸开始
                WebAudio._onTouchStart();
            })
        } else {
            //网络音频 在触摸开始
            WebAudio._onTouchStart();
        }
    };
    //文献.添加事件监听器（"keydown，恢复处理）
    document.addEventListener("keydown", resumeHandler);
    //文献.添加事件监听器（"mousedown"，恢复处理）
    document.addEventListener("mousedown", resumeHandler);
    //文献.添加事件监听器（"touchend"，恢复处理）
    document.addEventListener("touchend", resumeHandler);
    //文献.添加事件监听器（'touchstart',当触摸开始 )
    document.addEventListener('touchstart', this._onTouchStart.bind(this));
    //文献.添加事件监听器（'visibilitychange',当能见度变化 )
    document.addEventListener('visibilitychange', this._onVisibilityChange.bind(this));
};

/**当触摸开始
 * @static   
 * @method _onTouchStart
 * @private
 */ 
WebAudio._onTouchStart = function() {
    //上下文 = 网络音频 上下文
    var context = WebAudio._context;
    //如果(上下文 并且  不是 解锁)
    if (context && !this._unlocked) {
        // Unlock Web Audio on iOS
        //在iOS上解锁Web音频
        //节点 = 上下文 创建缓冲区源();
        var node = context.createBufferSource();
        //节点 开始(0)
        node.start(0);
        //解锁 = true 
        this._unlocked = true;
    }
};

/**当可见度改变
 * @static
 * @method _onVisibilityChange
 * @private
 */
WebAudio._onVisibilityChange = function() {
    //如果(文献.能见度状态 ==='hidden' )
    if (document.visibilityState === 'hidden') {
        //当隐藏()
        this._onHide();
    //否则
    } else {
        //当显示()
        this._onShow();
    }
};

/**当隐藏
 * @static
 * @method _onHide 当隐藏
 * @private
 */
WebAudio._onHide = function() {
    //需要消除当隐藏()
    if (this._shouldMuteOnHide()) {
        //淡出(1)
        this._fadeOut(1);
    }
};

/**当显示
 * @static
 * @method _onShow  当显示
 * @private
 */
WebAudio._onShow = function() {
    //需要消除当隐藏()
    if (this._shouldMuteOnHide()) {
        //淡入(0.5)
        this._fadeIn(0.5);
    }
};

/**需要消除当隐藏
 * @static
 * @method _shouldMuteOnHide 需要消除当隐藏
 * @private
 */
WebAudio._shouldMuteOnHide = function() {
    //返回  utils的 是移动设备
    return Utils.isMobileDevice();
};

/**淡入
 * @static
 * @method _fadeIn
 * @param {number} duration
 * @private
 */
WebAudio._fadeIn = function(duration) {
    if (this._masterGainNode) {
        var gain = this._masterGainNode.gain;
        var currentTime = WebAudio._context.currentTime;
        gain.setValueAtTime(0, currentTime);
        gain.linearRampToValueAtTime(this._masterVolume, currentTime + duration);
    }
};

/**淡出
 * @static
 * @method _fadeOut
 * @param {number} duration
 * @private
 */
WebAudio._fadeOut = function(duration) {
    if (this._masterGainNode) {
        var gain = this._masterGainNode.gain;
        var currentTime = WebAudio._context.currentTime;
        gain.setValueAtTime(this._masterVolume, currentTime);
        gain.linearRampToValueAtTime(0, currentTime + duration);
    }
};

/**清除音频数据
 * Clears the audio data.
 *
 * @method clear
 */
WebAudio.prototype.clear = function() {
    this.stop();
    this._buffer = null;
    this._sourceNode = null;
    this._gainNode = null;
    this._pannerNode = null;
    this._totalTime = 0;
    this._sampleRate = 0;
    this._loopStart = 0;
    this._loopLength = 0;
    this._startTime = 0;
    this._volume = 1;
    this._pitch = 1;
    this._pan = 0;
    this._endTimer = null;
    this._loadListeners = [];
    this._stopListeners = [];
    this._hasError = false;
    this._autoPlay = false;
};

/**url
 * 
 * [只读]音频文件 的 url
 * [read-only] The url of the audio file.
 *
 * @property url
 * @type String
 */
Object.defineProperty(WebAudio.prototype, 'url', {
    get: function() {
        return this._url;
    },
    configurable: true
});

/**volume
 *  
 * 音频的音量
 * The volume of the audio.
 *
 * @property volume
 * @type Number
 */ 
Object.defineProperty(WebAudio.prototype, 'volume', {
    get: function() {
        return this._volume;
    },
    set: function(value) {
        this._volume = value;
        if (this._gainNode) {
           this._gainNode.gain.setValueAtTime(this._volume, WebAudio._context.currentTime);
         }
    },
    configurable: true
});

/**pitch 
 * 
 * 音频的pitch调
 * The pitch of the audio.
 *
 * @property pitch
 * @type Number
 */
Object.defineProperty(WebAudio.prototype, 'pitch', {
    get: function() {
        return this._pitch;
    },
    set: function(value) {
        if (this._pitch !== value) {
            this._pitch = value;
            if (this.isPlaying()) {
                this.play(this._sourceNode.loop, 0);
            }
        }
    },
    configurable: true
});

/**pan
 * 
 * 音频的pan
 * The pan of the audio.
 *
 * @property pan
 * @type Number
 */
Object.defineProperty(WebAudio.prototype, 'pan', {
    get: function() {
        return this._pan;
    },
    set: function(value) {
        this._pan = value;
        this._updatePanner();
    },
    configurable: true
});

/**检查音频数据是否已准备好播放
 * Checks whether the audio data is ready to play.
 *
 * @method isReady
 * @return {boolean} True if the audio data is ready to play
 */
WebAudio.prototype.isReady = function() {
    return !!this._buffer;
};

/**检查是否发生了错误装载
 * Checks whether a loading error has occurred.
 *
 * @method isError
 * @return {boolean} True if a loading error has occurred
 */
WebAudio.prototype.isError = function() {
    return this._hasError;
};

/**检查音频是否正在播放
 * Checks whether the audio is playing.
 *
 * @method isPlaying
 * @return {boolean} True if the audio is playing
 */
WebAudio.prototype.isPlaying = function() {
    return !!this._sourceNode;
};

/**播放音频
 * Plays the audio.
 *
 * @method play
 * @param {boolean} loop Whether the audio data play in a loop
 * @param {number} offset The start position to play in seconds
 */
WebAudio.prototype.play = function(loop, offset) {
    if (this.isReady()) {
        offset = offset || 0;
        this._startPlaying(loop, offset);
    } else if (WebAudio._context) {
        this._autoPlay = true;
        this.addLoadListener(function() {
            if (this._autoPlay) {
                this.play(loop, offset);
            }
        }.bind(this));
    }
};

/**停止音频
 * Stops the audio.
 *
 * @method stop
 */
WebAudio.prototype.stop = function() {
    //自动播放 = false
    this._autoPlay = false;
    //结束计时器()
    this._removeEndTimer();
    //移除节点()
    this._removeNodes();
    //
    if (this._stopListeners) {
        while (this._stopListeners.length > 0) {
            var listner = this._stopListeners.shift();
            listner();
        }
    }
};

/**执行音频淡入
 * Performs the audio fade-in.
 *
 * @method fadeIn
 * @param {number} duration Fade-in time in seconds
 */
WebAudio.prototype.fadeIn = function(duration) {
    if (this.isReady()) {
        if (this._gainNode) {
            var gain = this._gainNode.gain;
            var currentTime = WebAudio._context.currentTime;
            gain.setValueAtTime(0, currentTime);
            gain.linearRampToValueAtTime(this._volume, currentTime + duration);
        }
    } else if (this._autoPlay) {
        this.addLoadListener(function() {
            this.fadeIn(duration);
        }.bind(this));
    }
};

/**执行音频淡出
 * Performs the audio fade-out.
 *
 * @method fadeOut
 * @param {number} duration Fade-out time in seconds
 */
WebAudio.prototype.fadeOut = function(duration) {
    if (this._gainNode) {
        var gain = this._gainNode.gain;
        var currentTime = WebAudio._context.currentTime;
          gain.setValueAtTime(this._volume, currentTime);
        gain.linearRampToValueAtTime(0, currentTime + duration);
    }
    this._autoPlay = false;
};

/**获取音频的查找位置
 * Gets the seek position of the audio.
 *
 * @method seek
 */
WebAudio.prototype.seek = function() {
    if (WebAudio._context) {
        var pos = (WebAudio._context.currentTime - this._startTime) * this._pitch;
        if (this._loopLength > 0) {
            while (pos >= this._loopStart + this._loopLength) {
                pos -= this._loopLength;
            }
        }
        return pos;
    } else {
        return 0;
    }
};

/**添加音频数据被加载时，将调用回调函数
 * Add a callback function that will be called when the audio data is loaded.
 *
 * @method addLoadListener
 * @param {Function} listner The callback function
 */
WebAudio.prototype.addLoadListener = function(listner) {
    this._loadListeners.push(listner);
};

/**添加音频数据被停止时，将调用回调函数
 * Add a callback function that will be called when the playback is stopped.
 *
 * @method addStopListener
 * @param {Function} listner The callback function
 */
WebAudio.prototype.addStopListener = function(listner) {
    this._stopListeners.push(listner);
};

/**读取
 * @method _load
 * @param {string} url
 * @private
 */
WebAudio.prototype._load = function(url) {
    if (WebAudio._context) {
        var xhr = new XMLHttpRequest();
        if(Decrypter.hasEncryptedAudio) {url = Decrypter.extToEncryptExt(url);}
        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            if (xhr.status < 400) {
                this._onXhrLoad(xhr);
            }
        }.bind(this);
        xhr.onerror = this._loader || function(){this._hasError = true;}.bind(this);
        xhr.send();
    }
};

/**当xhr读取
 * @method _onXhrLoad
 * @param {XMLHttpRequest} xhr
 * @private
 */
WebAudio.prototype._onXhrLoad = function(xhr) {
    var array = xhr.response;
    if(Decrypter.hasEncryptedAudio) array = Decrypter.decryptArrayBuffer(array);
    this._readLoopComments(new Uint8Array(array));
    WebAudio._context.decodeAudioData(array, function(buffer) {
        this._buffer = buffer;
        this._totalTime = buffer.duration;
        if (this._loopLength > 0 && this._sampleRate > 0) {
            this._loopStart /= this._sampleRate;
            this._loopLength /= this._sampleRate;
        } else {
            this._loopStart = 0;
            this._loopLength = this._totalTime;
        }
        this._onLoad();
    }.bind(this));
};

/**开始播放
 * @method _startPlaying
 * @param {boolean} loop
 * @param {number} offset
 * @private
 */
WebAudio.prototype._startPlaying = function(loop, offset) {
    if (this._loopLength > 0) {
        while (offset >= this._loopStart + this._loopLength) {
            offset -= this._loopLength;
        }
    }
    this._removeEndTimer();
    this._removeNodes();
    this._createNodes();
    this._connectNodes();
    this._sourceNode.loop = loop;
    this._sourceNode.start(0, offset);
    this._startTime = WebAudio._context.currentTime - offset / this._pitch;
    this._createEndTimer();
};

/**创建节点
 * @method _createNodes
 * @private
 */
WebAudio.prototype._createNodes = function() {
    var context = WebAudio._context;
    this._sourceNode = context.createBufferSource();
    this._sourceNode.buffer = this._buffer;
    this._sourceNode.loopStart = this._loopStart;
    this._sourceNode.loopEnd = this._loopStart + this._loopLength;
    this._sourceNode.playbackRate.setValueAtTime(this._pitch, context.currentTime);
    this._gainNode = context.createGain();
    this._gainNode.gain.setValueAtTime(this._volume, context.currentTime);
    this._pannerNode = context.createPanner();
    this._pannerNode.panningModel = 'equalpower';
    this._updatePanner();
};

/**连接节点
 * @method _connectNodes
 * @private
 */
WebAudio.prototype._connectNodes = function() {
    //源节点 连接 (增益节点)
    this._sourceNode.connect(this._gainNode);
    //增益节点 连接 (声相节点)
    this._gainNode.connect(this._pannerNode);
    //声相节点 连接 (网络音频 主增益节点)
    this._pannerNode.connect(WebAudio._masterGainNode);
};

/**移除节点
 * @method _removeNodes
 * @private
 */
WebAudio.prototype._removeNodes = function() {
    //如果 源节点  
    if (this._sourceNode) {
        //源节点 停止(0) 
        this._sourceNode.stop(0);
        //源节点 = null
        this._sourceNode = null;
        //增益节点 = null
        this._gainNode = null;
        //声相节点 = null
        this._pannerNode = null;
    }
};

/**创建结束计时器
 * @method _createEndTimer
 * @private
 */
WebAudio.prototype._createEndTimer = function() {
    //如果( 源节点 并且 不是 源节点 循环 )
    if (this._sourceNode && !this._sourceNode.loop) {
        //结束时间 = 开始时间 + 总时间 / 音高
        var endTime = this._startTime + this._totalTime / this._pitch;
        //间隔 = 结束时间 - 网络音频.上下文.当前时间
        var delay =  endTime - WebAudio._context.currentTime;
        //结束计时器 = 设置超时
        this._endTimer = setTimeout(function() {
            //停止()
            this.stop();
        //绑定 this  , 间隔 * 1000
        }.bind(this), delay * 1000);
    }
};

/**移除结束计时器
 * @method _removeEndTimer
 * @private
 */
WebAudio.prototype._removeEndTimer = function() {
    if (this._endTimer) {
        clearTimeout(this._endTimer);
        this._endTimer = null;
    }
};

/**更新pan
 * @method _updatePanner
 * @private
 */
WebAudio.prototype._updatePanner = function() {
    if (this._pannerNode) {
        var x = this._pan;
        var z = 1 - Math.abs(x);
        this._pannerNode.setPosition(x, 0, z);
    }
};

/**当读取
 * @method _onLoad
 * @private
 */
WebAudio.prototype._onLoad = function() {
    while (this._loadListeners.length > 0) {
        var listner = this._loadListeners.shift();
        listner();
    }
};

/**读取循环注释
 * @method _readLoopComments
 * @param {Uint8Array} array
 * @private
 */
WebAudio.prototype._readLoopComments = function(array) {
    this._readOgg(array);
    this._readMp4(array);
};

/**读ogg
 * @method _readOgg
 * @param {Uint8Array} array
 * @private
 */
WebAudio.prototype._readOgg = function(array) {
    var index = 0;
    while (index < array.length) {
        if (this._readFourCharacters(array, index) === 'OggS') {
            index += 26;
            var vorbisHeaderFound = false;
            var numSegments = array[index++];
            var segments = [];
            for (var i = 0; i < numSegments; i++) {
                segments.push(array[index++]);
            }
            for (i = 0; i < numSegments; i++) {
                if (this._readFourCharacters(array, index + 1) === 'vorb') {
                    var headerType = array[index];
                    if (headerType === 1) {
                        this._sampleRate = this._readLittleEndian(array, index + 12);
                    } else if (headerType === 3) {
                        this._readMetaData(array, index, segments[i]);
                    }
                    vorbisHeaderFound = true;
                }
                index += segments[i];
            }
            if (!vorbisHeaderFound) {
                break;
            }
        } else {
            break;
        }
    }
};

/**读mp4
 * @method _readMp4
 * @param {Uint8Array} array
 * @private
 */
WebAudio.prototype._readMp4 = function(array) {
    if (this._readFourCharacters(array, 4) === 'ftyp') {
        var index = 0;
        while (index < array.length) {
            var size = this._readBigEndian(array, index);
            var name = this._readFourCharacters(array, index + 4);
            if (name === 'moov') {
                index += 8;
            } else {
                if (name === 'mvhd') {
                    this._sampleRate = this._readBigEndian(array, index + 20);
                }
                if (name === 'udta' || name === 'meta') {
                    this._readMetaData(array, index, size);
                }
                index += size;
                if (size <= 1) {
                    break;
                }
            }
        }
    }
};

/**读元数据
 * @method _readMetaData
 * @param {Uint8Array} array
 * @param {number} index
 * @param {number} size
 * @private
 */
WebAudio.prototype._readMetaData = function(array, index, size) {
    for (var i = index; i < index + size - 10; i++) {
        if (this._readFourCharacters(array, i) === 'LOOP') {
            var text = '';
            while (array[i] > 0) {
                text += String.fromCharCode(array[i++]);
            }
            if (text.match(/LOOPSTART=([0-9]+)/)) {
                this._loopStart = parseInt(RegExp.$1);
            }
            if (text.match(/LOOPLENGTH=([0-9]+)/)) {
                this._loopLength = parseInt(RegExp.$1);
            }
            if (text == 'LOOPSTART' || text == 'LOOPLENGTH') {
                var text2 = '';
                i += 16;
                while (array[i] > 0) {
                    text2 += String.fromCharCode(array[i++]);
                }
                if (text == 'LOOPSTART') {
                    this._loopStart = parseInt(text2);
                } else {
                    this._loopLength = parseInt(text2);
                }
            }
        }
    }
};

/**读小Endian
 * @method _readLittleEndian
 * @param {Uint8Array} array
 * @param {number} index
 * @private
 */
WebAudio.prototype._readLittleEndian = function(array, index) {
    return (array[index + 3] * 0x1000000 + array[index + 2] * 0x10000 +
            array[index + 1] * 0x100 + array[index + 0]);
};

/**读大Endian
 * @method _readBigEndian
 * @param {Uint8Array} array
 * @param {number} index
 * @private
 */
WebAudio.prototype._readBigEndian = function(array, index) {
    return (array[index + 0] * 0x1000000 + array[index + 1] * 0x10000 +
            array[index + 2] * 0x100 + array[index + 3]);
};

/**读四个特征
 * @method _readFourCharacters
 * @param {Uint8Array} array
 * @param {number} index
 * @private
 */
WebAudio.prototype._readFourCharacters = function(array, index) {
    var string = '';
    for (var i = 0; i < 4; i++) {
        string += String.fromCharCode(array[index + i]);
    }
    return string;
};

