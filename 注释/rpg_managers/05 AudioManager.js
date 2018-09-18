
/**----------------------------------------------------------------------------- */
/** AudioManager */
/** 音频管理器 */
/** The static class that handles BGM, BGS, ME and SE. */
/** 这个静态的类 处理 bgm bgs me se */

function AudioManager() {
    throw new Error('This is a static class');
}

AudioManager._masterVolume   = 1;   // (min: 0, max: 1)
/** 音频管理器 bgm大小 */
AudioManager._bgmVolume      = 100;
/** 音频管理器 bgs大小 */
AudioManager._bgsVolume      = 100;
/** 音频管理器 me大小 */
AudioManager._meVolume       = 100;
/** 音频管理器 se大小 */
AudioManager._seVolume       = 100;
/** 音频管理器 当前的bgm */
AudioManager._currentBgm     = null;
/** 音频管理器 当前的bgs */
AudioManager._currentBgs     = null;
/** 音频管理器 bgm缓存 */
AudioManager._bgmBuffer      = null;
/** 音频管理器 bgs缓存 */
AudioManager._bgsBuffer      = null;
/** 音频管理器 me缓存 */
AudioManager._meBuffer       = null;
/** 音频管理器 se缓存 */
AudioManager._seBuffers      = [];
/** 音频管理器 静态缓存 */
AudioManager._staticBuffers  = [];
/** 音频管理器 重播淡入时间 */
AudioManager._replayFadeTime = 0.5;
/** 音频管理器 路径 */
AudioManager._path           = 'audio/';
/** 音频管理器 blobUrl */
AudioManager._blobUrl        = null;

Object.defineProperty(AudioManager, 'masterVolume', {
    get: function() {
        return this._masterVolume;
    },
    set: function(value) {
        this._masterVolume = value;
        WebAudio.setMasterVolume(this._masterVolume);
        Graphics.setVideoVolume(this._masterVolume);
    },
    configurable: true
});

/** 定义属性 bgmVolume */
Object.defineProperty(AudioManager, 'bgmVolume', {
	//获得
    get: function() {
	    //返回 bgm大小
        return this._bgmVolume;
    },
    //设置
    set: function(value) {
	    //bgm大小 = value
        this._bgmVolume = value;
        //更新bgm参数(当前的bgm)
        this.updateBgmParameters(this._currentBgm);
    },
    //可设置的 :true
    configurable: true
});
/** 定义属性 bgsVolume */
Object.defineProperty(AudioManager, 'bgsVolume', {
    //获得 
    get: function () {
        return this._bgsVolume;
    },
    //设置 
    set: function (value) {
        this._bgsVolume = value;
        this.updateBgsParameters(this._currentBgs);
    },
    //可设置的 :true 
    configurable: true
});

/**定义属性 meVolume */
Object.defineProperty(AudioManager, 'meVolume', {
    //获得 
    get: function () {
        return this._meVolume;
    },
    //设置 
    set: function (value) {
        this._meVolume = value;
        this.updateMeParameters(this._currentMe);
    },
    //可设置的 :true 
    configurable: true
});

/**定义属性 seVolume */
Object.defineProperty(AudioManager, 'seVolume', {
    //获得 
    get: function () {
        return this._seVolume;
    },
    //设置 
    set: function (value) {
        this._seVolume = value;
    },
    //可设置的 :true 
    configurable: true
});
/**播放bgm (bgm,位置) */
AudioManager.playBgm = function(bgm, pos) {
	//如果 是当前的 bgm
    if (this.isCurrentBgm(bgm)) {
	    //更新bgm参数
        this.updateBgmParameters(bgm);
    } else {
	    //停止bgm
        this.stopBgm();
        //如果 bgm的名字
        if (bgm.name) { 
            if(Decrypter.hasEncryptedAudio && this.shouldUseHtml5Audio()){
                this.playEncryptedBgm(bgm, pos);
            }
            else {
                this._bgmBuffer = this.createBuffer('bgm', bgm.name);
                this.updateBgmParameters(bgm);
                if (!this._meBuffer) {
                    this._bgmBuffer.play(true, pos || 0);
                }
            }
        }
    }
    //更新当前的bgm(bgm,位置)
    this.updateCurrentBgm(bgm, pos);
};
/**播放加密BGM */
AudioManager.playEncryptedBgm = function(bgm, pos) {
    var ext = this.audioFileExt();
    var url = this._path + 'bgm/' + encodeURIComponent(bgm.name) + ext;
    url = Decrypter.extToEncryptExt(url);
    Decrypter.decryptHTML5Audio(url, bgm, pos);
};
/**创建解密缓冲区 */
AudioManager.createDecryptBuffer = function(url, bgm, pos){
    this._blobUrl = url;
    this._bgmBuffer = this.createBuffer('bgm', bgm.name);
    this.updateBgmParameters(bgm);
    if (!this._meBuffer) {
        this._bgmBuffer.play(true, pos || 0);
    }
    this.updateCurrentBgm(bgm, pos);
};

/**重播bgm(bgm) */
AudioManager.replayBgm = function(bgm) {
	//如果 是当前的bgm
    if (this.isCurrentBgm(bgm)) {
	    //更新bgm参数(bgm)
        this.updateBgmParameters(bgm);
    } else {
	    //播放bgm(bgm,bgm的位置)
        this.playBgm(bgm, bgm.pos);
        //如果 bgm缓存
        if (this._bgmBuffer) {
	        //bgm缓存 淡入(重播淡入时间)
            this._bgmBuffer.fadeIn(this._replayFadeTime);
        }
    }
};
/**是当前的bgm(bgm) */
AudioManager.isCurrentBgm = function(bgm) {
	//返回 当前的bgm 并且 bgm缓存 并且 当前的bgm的名字 全等 bgm的名字
    return (this._currentBgm && this._bgmBuffer &&
            this._currentBgm.name === bgm.name);
};
/**更新bgm参数(bgm) */
AudioManager.updateBgmParameters = function(bgm) {
	//更新缓存参数(bgm缓存,bgm大小,bgm)
    this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm);
};
/**更新当前的bgm(bgm,位置) */
AudioManager.updateCurrentBgm = function(bgm, pos) {
	//当前的bgm = {
    this._currentBgm = {
	    //名字 bgm的名字
        name: bgm.name,
        //大小 bgm的大小
        volume: bgm.volume,
        //音高 bgm的音高
        pitch: bgm.pitch,
        //pan bgm的pan
        pan: bgm.pan,
        //位置 位置
        pos: pos
    // }
    };
};
/**停止bgm */
AudioManager.stopBgm = function() {
	//如果 bgm缓存
    if (this._bgmBuffer) {
	    //bgm缓存 停止
        this._bgmBuffer.stop();
        //bgm缓存  =  null
        this._bgmBuffer = null;
        //当前的bgm  =  null
        this._currentBgm = null;
    }
};
/**淡出bgm(持续时间) */
AudioManager.fadeOutBgm = function(duration) {
	//如果 bgm缓存 并且 当前的bgm
    if (this._bgmBuffer && this._currentBgm) {
	    //bgm缓存 淡出(持续时间)
        this._bgmBuffer.fadeOut(duration);
        //当前的bgm  =  null
        this._currentBgm = null;
    }
};
/**淡入bgm(持续时间) */
AudioManager.fadeInBgm = function(duration) {
	//如果 bgm缓存 并且 当前的bgm
    if (this._bgmBuffer && this._currentBgm) {
	    //bgm缓存 淡入(持续时间)
        this._bgmBuffer.fadeIn(duration);
    }
};
/**播放bgs (bgs,位置) */
AudioManager.playBgs = function(bgs, pos) {
	//如果 是当前的 bgs
    if (this.isCurrentBgs(bgs)) {
	    //更新bgs参数
        this.updateBgsParameters(bgs);
    } else {
	    //停止bgs
        this.stopBgs();
        //如果 bgs的名字
        if (bgs.name) {
	        //bgs 缓存 =  创建缓存('bgs',bgs的名字)
            this._bgsBuffer = this.createBuffer('bgs', bgs.name);
            //更新bgs参数(bgs)
            this.updateBgsParameters(bgs);
            //如果 不是 me缓存
            if (!this._meBuffer) {
	            //bgs缓存 播放(true,位置 或 0 )
                this._bgsBuffer.play(true, pos || 0);
            }
        }
    }
    //更新当前的bgs(bgs,位置)
    this.updateCurrentBgs(bgs, pos);
};
/**重播bgs(bgs) */
AudioManager.replayBgs = function(bgs) {
	//如果 是当前的bgs
    if (this.isCurrentBgs(bgs)) {
	    //更新bgs参数(bgs)
        this.updateBgsParameters(bgs);
    } else {
	    //播放bgs(bgs,bgs的位置)
        this.playBgs(bgs, bgs.pos);
        //如果 bgs缓存
        if (this._bgsBuffer) {
	        //bgs缓存 淡入(重播淡入时间)
            this._bgsBuffer.fadeIn(this._replayFadeTime);
        }
    }
};
/**是当前的bgs(bgs) */
AudioManager.isCurrentBgs = function(bgs) {
	//返回 当前的bgs 并且 bgs缓存 并且 当前的bgs的名字 全等于 bgs的名字
    return (this._currentBgs && this._bgsBuffer &&
            this._currentBgs.name === bgs.name);
};
/**更新bgs参数(bgs) */
AudioManager.updateBgsParameters = function(bgs) {
	//更新缓存参数(bgs缓存,bgs大小,bgs)
    this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs);
};
/**更新当前的bgs(bgs,位置) */
AudioManager.updateCurrentBgs = function(bgs, pos) {
	//当前的bgs = {
    this._currentBgs = {
	    //名字 bgs的名字
        name: bgs.name,
        //大小 bgs的大小
        volume: bgs.volume,
        //音高 bgs的音高
        pitch: bgs.pitch,
        //pan bgs的pan
        pan: bgs.pan,
        //位置 位置
        pos: pos
    //  }
    };
};
/**停止bgs */
AudioManager.stopBgs = function() {
	//如果 bgs缓存
    if (this._bgsBuffer) {
	    //bgs缓存 停止
        this._bgsBuffer.stop();
        //bgs缓存  =  null
        this._bgsBuffer = null;
        //当前的bgs  =  null
        this._currentBgs = null;
    }
};
/**淡出bgs(持续时间) */
AudioManager.fadeOutBgs = function(duration) {
	//如果 bgs缓存 并且 当前的bgs
    if (this._bgsBuffer && this._currentBgs) {
	    //bgs缓存 淡出(持续时间)
        this._bgsBuffer.fadeOut(duration);
        //当前的bgs  =  null
        this._currentBgs = null;
    }
};
/**淡入bgs(持续时间) */
AudioManager.fadeInBgs = function(duration) {
	//如果 bgs缓存 并且 当前的bgs
    if (this._bgsBuffer && this._currentBgs) {
	    //bgs缓存 淡入(持续时间)
        this._bgsBuffer.fadeIn(duration);
    }
};
/**播放me */
AudioManager.playMe = function(me) {
    this.stopMe();
    if (me.name) {
        if (this._bgmBuffer && this._currentBgm) {
            this._currentBgm.pos = this._bgmBuffer.seek();
            this._bgmBuffer.stop();
        }
        this._meBuffer = this.createBuffer('me', me.name);
        this.updateMeParameters(me);
        this._meBuffer.play(false);
        this._meBuffer.addStopListener(this.stopMe.bind(this));
    }
};
/**更新me参数 */
AudioManager.updateMeParameters = function(me) {
    this.updateBufferParameters(this._meBuffer, this._meVolume, me);
};
/**淡出me */
AudioManager.fadeOutMe = function(duration) {
    if (this._meBuffer) {
        this._meBuffer.fadeOut(duration);
    }
};
/**停止me */
AudioManager.stopMe = function() {
    if (this._meBuffer) {
        this._meBuffer.stop();
        this._meBuffer = null;
        if (this._bgmBuffer && this._currentBgm && !this._bgmBuffer.isPlaying()) {
            this._bgmBuffer.play(true, this._currentBgm.pos);
            this._bgmBuffer.fadeIn(this._replayFadeTime);
        }
    }
};
/**播放se */
AudioManager.playSe = function(se) {
    if (se.name) {
        this._seBuffers = this._seBuffers.filter(function(audio) {
            return audio.isPlaying();
        });
        var buffer = this.createBuffer('se', se.name);
        this.updateSeParameters(buffer, se);
        buffer.play(false);
        this._seBuffers.push(buffer);
    }
};
/**更新se参数 */
AudioManager.updateSeParameters = function(buffer, se) {
    this.updateBufferParameters(buffer, this._seVolume, se);
};
/**停止se */
AudioManager.stopSe = function() {
    this._seBuffers.forEach(function(buffer) {
        buffer.stop();
    });
    this._seBuffers = [];
};
/**播放静态se(se) */
AudioManager.playStaticSe = function(se) {
	//如果 se的名字
    if (se.name) {
	    //读取静态se
        this.loadStaticSe(se);
        //循环 ,i = 0 ,如果 i< 静态缓存的长 ,每次i + 1
        for (var i = 0; i < this._staticBuffers.length; i++) {
	        // 缓存的 = 静态缓存[i]
            var buffer = this._staticBuffers[i];
            //如果 缓存的 保存se名字 全等于 se的名字
            if (buffer._reservedSeName === se.name) {
	            //缓存的停止
                buffer.stop();
                //更新se参数(缓存的,se)
                this.updateSeParameters(buffer, se);
                //缓存的播放(false)
                buffer.play(false);
                break;
            }
        }
    }
};
/**读取静态se(se) */
AudioManager.loadStaticSe = function(se) {
	//如果 se 的名字 并且 不是 是静态se
    if (se.name && !this.isStaticSe(se)) {
	    //缓存的 = 创造缓存("se",se的名字)
        var buffer = this.createBuffer('se', se.name);
        //缓存的 保存se名字 = se的名字
        buffer._reservedSeName = se.name;
        //静态缓存 添加 缓存的
        this._staticBuffers.push(buffer);
        //如果 会用到Html5Audio
        if (this.shouldUseHtml5Audio()) {
	        //Html5Audio 设置静态se(缓存的 地址)
            Html5Audio.setStaticSe(buffer._url);
        }
    }
};
/**是静态se(se) */
AudioManager.isStaticSe = function(se) {
	//循环 ,i = 0 ,如果 i< 静态缓存的长 ,每次i + 1
    for (var i = 0; i < this._staticBuffers.length; i++) {
	    //缓存的 = 静态的缓存[i]
        var buffer = this._staticBuffers[i];
        //如果 缓存的 保存se名字 全等于 se的名字
        if (buffer._reservedSeName === se.name) {
	        //返回 true
            return true;
        }
    }
    //返回 false
    return false;
};
/**停止所有 */
AudioManager.stopAll = function() {
    this.stopMe();
    this.stopBgm();
    this.stopBgs();
    this.stopSe();
};
/**保存bgm */
AudioManager.saveBgm = function() {
	//如果 当前的bgm
    if (this._currentBgm) {
        var bgm = this._currentBgm;
        return {
	        //名字 bgm的名字
            name: bgm.name,
            //大小 bgm的大小
            volume: bgm.volume,
            //音高 bgm的音高
            pitch: bgm.pitch,
            //pan bgm的pan
            pan: bgm.pan,
            //位置 bgm缓存 ? bgm缓存 查找 : 0
            pos: this._bgmBuffer ? this._bgmBuffer.seek() : 0
        };
    } else {
	    //返回 制作空音频对象
        return this.makeEmptyAudioObject();
    }
};
/**保存bgs */
AudioManager.saveBgs = function() {
    if (this._currentBgs) {
        var bgs = this._currentBgs;
        return {
            name: bgs.name,
            volume: bgs.volume,
            pitch: bgs.pitch,
            pan: bgs.pan,
            pos: this._bgsBuffer ? this._bgsBuffer.seek() : 0
        };
    } else {
        return this.makeEmptyAudioObject();
    }
};
/**制作空音频对象 */
AudioManager.makeEmptyAudioObject = function() {
	//名字 :"" ,大小 0 ,音高 0
    return { name: '', volume: 0, pitch: 0 };
};
/**创造缓存 (文件夹 ,名字) */
AudioManager.createBuffer = function(folder, name) {
	//提取 = 音频文件提取
    var ext = this.audioFileExt();
    //地址 = 路径 + 文件夹 +"/" + 编码(name) + 提取
    var url = this._path + folder + '/' + encodeURIComponent(name) + ext;
    //如果 会用到Html5Audio 并且 文件夹 全等于 bgm
    if (this.shouldUseHtml5Audio() && folder === 'bgm') {
        if(this._blobUrl) {
            //Html5Audio安装(地址)
            Html5Audio.setup(this._blobUrl);
        }else{
            //Html5Audio安装(地址)
            Html5Audio.setup(url);
        }
        //返回 Html5Audio
        return Html5Audio;
    } else {
	    //返回  WebAudio(url)
        return new WebAudio(url);
    }
};
/**更新缓存参数(缓存的,大小,音频) */
AudioManager.updateBufferParameters = function(buffer, configVolume, audio) {
    if (buffer && audio) {
	    //缓存的声音 = 大小 * (音频大小 或 0) / 10000
        buffer.volume = configVolume * (audio.volume || 0) / 10000;
        //
        buffer.pitch = (audio.pitch || 0) / 100;
        buffer.pan = (audio.pan || 0) / 100;
    }
};
/**音频文件提取 */
AudioManager.audioFileExt = function() {
	//如果 web音频 可以播放ogg 并且 不是 是移动设备
    if (WebAudio.canPlayOgg() && !Utils.isMobileDevice()) {
        return '.ogg';
    } else {
        return '.m4a';
    }
};
/** 会用到Html5Audio  */
AudioManager.shouldUseHtml5Audio = function() {
    // The only case where we wanted html5audio was android/ no encrypt
    // Atsuma-ru asked to force webaudio there too, so just return false for ALL    
    // return Utils.isAndroidChrome() && !Decrypter.hasEncryptedAudio;
    return false;
};
/**检查错误 */
AudioManager.checkErrors = function() {
	//检查web音频错误
    this.checkWebAudioError(this._bgmBuffer);
    this.checkWebAudioError(this._bgsBuffer);
    this.checkWebAudioError(this._meBuffer);
    this._seBuffers.forEach(function(buffer) {
        this.checkWebAudioError(buffer);
    }.bind(this));
    this._staticBuffers.forEach(function(buffer) {
        this.checkWebAudioError(buffer);
    }.bind(this));
};
/**检查web音频错误 */
AudioManager.checkWebAudioError = function(webAudio) {
	//如果 webAudio 并且 webAudio是错误
    if (webAudio && webAudio.isError()) {
	    //抛出 新错误 (读取 webAudio 失败)
        throw new Error('Failed to load: ' + webAudio.url);
    }
};
