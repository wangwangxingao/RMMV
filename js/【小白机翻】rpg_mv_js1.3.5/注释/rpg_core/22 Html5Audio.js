
//-----------------------------------------------------------------------------
/**处理HTML5音频的静态类
 * The static class that handles HTML5 Audio.
 *
 * @class Html5Audio
 * @constructor
 */
function Html5Audio() {
    throw new Error('This is a static class');
}

Html5Audio._initialized = false;
Html5Audio._unlocked = false;
Html5Audio._audioElement = null;
Html5Audio._gainTweenInterval = null;
Html5Audio._tweenGain = 0;
Html5Audio._tweenTargetGain = 0;
Html5Audio._tweenGainStep = 0;
Html5Audio._staticSePath = null;

/**设定HTML5的音频
 * Sets up the Html5 Audio.
 *
 * @static
 * @method setup
 * @param {String} url The url of the audio file
 */
Html5Audio.setup = function (url) {
    if (!this._initialized) {
        this.initialize();
    }
    this.clear();
    
    if(Decrypter.hasEncryptedAudio && this._audioElement.src) {
        window.URL.revokeObjectURL(this._audioElement.src);
    }
    
    this._url = url;
};

/**初始化音频系统
 * Initializes the audio system.
 *
 * @static
 * @method initialize
 * @return {Boolean} True if the audio system is available
 */
Html5Audio.initialize = function () {
    if (!this._initialized) {
        if (!this._audioElement) {
            try {
                this._audioElement = new Audio();
            } catch (e) {
                this._audioElement = null;
            }
        }
        if (!!this._audioElement) this._setupEventHandlers();
        this._initialized = true;
    }
    return !!this._audioElement;
};

/**设定事件处理
 * @static
 * @method _setupEventHandlers
 * @private
 */
Html5Audio._setupEventHandlers = function () {
    document.addEventListener('touchstart', this._onTouchStart.bind(this));
    document.addEventListener('visibilitychange', this._onVisibilityChange.bind(this));
    this._audioElement.addEventListener("loadeddata", this._onLoadedData.bind(this));
    this._audioElement.addEventListener("error", this._onError.bind(this));
    this._audioElement.addEventListener("ended", this._onEnded.bind(this));
};

/**当触摸开始
 * @static
 * @method _onTouchStart
 * @private
 */
Html5Audio._onTouchStart = function () {
    if (this._audioElement && !this._unlocked) {
        if (this._isLoading) {
            this._load(this._url);
            this._unlocked = true;
        } else {
            if (this._staticSePath) {
                this._audioElement.src = this._staticSePath;
                this._audioElement.volume = 0;
                this._audioElement.loop = false;
                this._audioElement.play();
                this._unlocked = true;
            }
        }
    }
};

/**当可见性改变
 * @static
 * @method _onVisibilityChange
 * @private
 */
Html5Audio._onVisibilityChange = function () {
    if (document.visibilityState === 'hidden') {
        this._onHide();
    } else {
        this._onShow();
    }
};

/**当读取数据
 * @static
 * @method _onLoadedData
 * @private
 */
Html5Audio._onLoadedData = function () {
    this._buffered = true;
    if (this._unlocked) this._onLoad();
};

/**当错误
 * @static
 * @method _onError
 * @private
 */
Html5Audio._onError = function () {
    this._hasError = true;
};

/**当结束后
 * @static
 * @method _onEnded
 * @private
 */
Html5Audio._onEnded = function () {
    if (!this._audioElement.loop) {
        this.stop();
    }
};

/**当隐藏
 * @static
 * @method _onHide
 * @private
 */
Html5Audio._onHide = function () {
    this._audioElement.volume = 0;
    this._tweenGain = 0;
};

/**当显示
 * @static
 * @method _onShow
 * @private
 */
Html5Audio._onShow = function () {
    this.fadeIn(0.5);
};

/**清除音频数据
 * Clears the audio data.
 *
 * @static
 * @method clear
 */
Html5Audio.clear = function () {
    this.stop();
    this._volume = 1;
    this._loadListeners = [];
    this._hasError = false;
    this._autoPlay = false;
    this._isLoading = false;
    this._buffered = false;
};

/**设置静态se的URL
 * Set the URL of static se.
 *
 * @static
 * @param {String} url
 */
Html5Audio.setStaticSe = function (url) {
    if (!this._initialized) {
        this.initialize();
        this.clear();
    }
    this._staticSePath = url;
};

/**[只读]音频文件 的 url
 * [read-only] The url of the audio file.
 *
 * @property url
 * @type String
 */
//定义属性 
Object.defineProperty(Html5Audio, 'url', {
    get: function () {
        return Html5Audio._url;
    },
    configurable: true
});

/**音频的音量
 * The volume of the audio.
 *
 * @property volume
 * @type Number
 */
//定义属性 
Object.defineProperty(Html5Audio, 'volume', {
    get: function () {
        return Html5Audio._volume;
    }.bind(this),
    set: function (value) {
        Html5Audio._volume = value;
        if (Html5Audio._audioElement) {
            Html5Audio._audioElement.volume = this._volume;
        }
    },
    configurable: true
});

/**检查音频数据是否已准备好播放
 * Checks whether the audio data is ready to play.
 *
 * @static
 * @method isReady
 * @return {Boolean} True if the audio data is ready to play
 */
Html5Audio.isReady = function () {
    return this._buffered;
};

/**检查是否发生了错误装载
 * Checks whether a loading error has occurred.
 *
 * @static
 * @method isError
 * @return {Boolean} True if a loading error has occurred
 */
Html5Audio.isError = function () {
    return this._hasError;
};

/**检查音频是否正在播放
 * Checks whether the audio is playing.
 *
 * @static
 * @method isPlaying
 * @return {Boolean} True if the audio is playing
 */
Html5Audio.isPlaying = function () {
    return !this._audioElement.paused;
};

/**播放音频
 * Plays the audio.
 *
 * @static
 * @method play
 * @param {Boolean} loop Whether the audio data play in a loop
 * @param {Number} offset The start position to play in seconds
 */
Html5Audio.play = function (loop, offset) {
    if (this.isReady()) {
        offset = offset || 0;
        this._startPlaying(loop, offset);
    } else if (Html5Audio._audioElement) {
        this._autoPlay = true;
        this.addLoadListener(function () {
            if (this._autoPlay) {
                this.play(loop, offset);
                if (this._gainTweenInterval) {
                    clearInterval(this._gainTweenInterval);
                    this._gainTweenInterval = null;
                }
            }
        }.bind(this));
        if (!this._isLoading) this._load(this._url);
    }
};

/**停止音频
 * Stops the audio.
 *
 * @static
 * @method stop
 */
Html5Audio.stop = function () {
    if (this._audioElement) this._audioElement.pause();
    this._autoPlay = false;
    if (this._tweenInterval) {
        clearInterval(this._tweenInterval);
        this._tweenInterval = null;
        this._audioElement.volume = 0;
    }
};

/**执行音频淡入
 * Performs the audio fade-in.
 *
 * @static
 * @method fadeIn
 * @param {Number} duration Fade-in time in seconds
 */
Html5Audio.fadeIn = function (duration) {
    if (this.isReady()) {
        if (this._audioElement) {
            this._tweenTargetGain = this._volume;
            this._tweenGain = 0;
            this._startGainTween(duration);
        }
    } else if (this._autoPlay) {
        this.addLoadListener(function () {
            this.fadeIn(duration);
        }.bind(this));
    }
};

/**执行音频淡出
 * Performs the audio fade-out.
 *
 * @static
 * @method fadeOut
 * @param {Number} duration Fade-out time in seconds
 */
Html5Audio.fadeOut = function (duration) {
    if (this._audioElement) {
        this._tweenTargetGain = 0;
        this._tweenGain = this._volume;
        this._startGainTween(duration);
    }
};

/**获取音频的查找位置
 * Gets the seek position of the audio.
 *
 * @static
 * @method seek
 */
Html5Audio.seek = function () {
    if (this._audioElement) {
        return this._audioElement.currentTime;
    } else {
        return 0;
    }
};

/**添加音频数据被加载时，将调用回调函数
 * Add a callback function that will be called when the audio data is loaded.
 *
 * @static
 * @method addLoadListener
 * @param {Function} listner The callback function
 */
Html5Audio.addLoadListener = function (listner) {
    this._loadListeners.push(listner);
};

/**读取
 * @static
 * @method _load
 * @param {String} url
 * @private
 */
Html5Audio._load = function (url) {
    if (this._audioElement) {
        this._isLoading = true;
        this._audioElement.src = url;
        this._audioElement.load();
    }
};

/**开始播放
 * @static
 * @method _startPlaying
 * @param {Boolean} loop
 * @param {Number} offset
 * @private
 */
Html5Audio._startPlaying = function (loop, offset) {
    this._audioElement.loop = loop;
    if (this._gainTweenInterval) {
        clearInterval(this._gainTweenInterval);
        this._gainTweenInterval = null;
    }
    if (this._audioElement) {
        this._audioElement.volume = this._volume;
        this._audioElement.currentTime = offset;
        this._audioElement.play();
    }
};

/**当读取
 * @static
 * @method _onLoad
 * @private
 */
Html5Audio._onLoad = function () {
    this._isLoading = false;
    while (this._loadListeners.length > 0) {
        var listener = this._loadListeners.shift();
        listener();
    }
};

/**开始获得之间
 * @static
 * @method _startGainTween
 * @params {Number} duration
 * @private
 */
Html5Audio._startGainTween = function (duration) {
    this._audioElement.volume = this._tweenGain;
    if (this._gainTweenInterval) {
        clearInterval(this._gainTweenInterval);
        this._gainTweenInterval = null;
    }
    this._tweenGainStep = (this._tweenTargetGain - this._tweenGain) / (60 * duration);
    this._gainTweenInterval = setInterval(function () {
        Html5Audio._applyTweenValue(Html5Audio._tweenTargetGain);
    }, 1000 / 60);
};

/**应用之间数据
 * @static
 * @method _applyTweenValue
 * @param {Number} volume
 * @private
 */
Html5Audio._applyTweenValue = function (volume) {
    Html5Audio._tweenGain += Html5Audio._tweenGainStep;
    if (Html5Audio._tweenGain < 0 && Html5Audio._tweenGainStep < 0) {
        Html5Audio._tweenGain = 0;
    }
    else if (Html5Audio._tweenGain > volume && Html5Audio._tweenGainStep > 0) {
        Html5Audio._tweenGain = volume;
    }

    if (Math.abs(Html5Audio._tweenTargetGain - Html5Audio._tweenGain) < 0.01) {
        Html5Audio._tweenGain = Html5Audio._tweenTargetGain;
        clearInterval(Html5Audio._gainTweenInterval);
        Html5Audio._gainTweenInterval = null;
    }

    Html5Audio._audioElement.volume = Html5Audio._tweenGain;
};