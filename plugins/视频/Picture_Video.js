//=============================================================================
// Picture_Video.js
//=============================================================================
/*:
 * @plugindesc 图片视频精灵
 * @author wangwang
 *
 * @param  图片视频精灵
 * @desc 插件 图片视频精灵 ,作者:汪汪
 * @default  汪汪
 * 
 * @help 
 * 
 *  
 * $gameScreen.showPicture(1,"",0,0,0,100,100,255,0)
 * 初始化1号图片 位置 0,0 ,xy比例100,不透明度255 
 * $gameScreen.pictureVideo(1,"1",1,1,300,300)
 * 一号图片.播放名字为 "1" 的视频,音量1, 大小300*300(0*0为原始大小)
 * 
 * 
 */



(function () {


    var ww = ww || {}

    ww.spriteVideo = {}


    ww.spriteVideo.Sprite_Picture_prototype_update = Sprite_Picture.prototype.update
    Sprite_Picture.prototype.update = function () {
        ww.spriteVideo.Sprite_Picture_prototype_update.call(this);
        if (this.visible) {
            this.updateVideo();
        }
    };

    Sprite_Picture.prototype.setVideo = function (name) {

        if (name) {
            this._video._name = name
            var url = Video.videoNameToUrl(name)
            this._video._load(url)
            this._videoSprite.bitmap = this._video
        }
    }

    Sprite_Picture.prototype.updateVideo = function () {
        if (!this._video) {
            this._video = new Video()
            this._videoSprite = new Sprite_Video(null, 0, 0)
            this.addChild(this._videoSprite)
        }
        var video = this.picture() ? this.picture()._video : 0
        var video = video||[]
         var name = video[0] || ""
        var play = video[1] || ""

        var vl = video[2] ||0
        var w = video[3] ||0
        var h = video[4] ||0

        if (name != this._videoName) {
            this._videoName = name
            this.setVideo(this._videoName)
            if(name){          
                this.addChild(this._videoSprite) 
            }else{
                this.removeChild(this._videoSprite) 
            } 
        }

        this._video.volume = vl
        if (this._videoName) {
            this._videoSprite.visible = true
            if (play ) {
                this._video.play()
            } else {
                this._video.pause()
            }
        } else {
            this._video.pause()
            this._videoSprite.visible = false
        }
        if(w ==0 && h == 0){
            this._videoSprite.width = this._video.width 
            this._videoSprite.height =  this._video.height  
        } 

        

    }


    /**
     * 
     *
     */
    Game_Screen.prototype.pictureVideo = function (pictureId, name, play, vl ,w, h) {
        var picture = this.picture(pictureId);
        if (picture) {
            picture.setVideo(name, play, vl , w, h)
        }
    };


    /**
     */
    Game_Picture.prototype.setVideo = function (name, play,vl, w, h) {
        this._video = [name, play,vl, w, h]
    };



})()



















//=============================================================================
// VideoSprite.js
//=============================================================================
/*:
 * @plugindesc 视频精灵
 * @author wangwang
 *
 * @param  VideoSprite
 * @desc 插件 视频精灵 ,作者:汪汪
 * @default  汪汪
 * 
 * @help 
 * 
 * var video = Video.load("1") 
 * var vsprite = new Sprite_Video(video,816,624)
 * video.play()
 * video.pause()
 * 
 * 播放名为 movies 文件夹内 "1" 文件  
 * 
 *     
 * video._video  
 * 方法	描述
 * addTextTrack()	向音频/视频添加新的文本轨道
 * canPlayType()	检测浏览器是否能播放指定的音频/视频类型
 * load()	重新加载音频/视频元素
 * play()	开始播放音频/视频
 * pause()	暂停当前播放的音频/视频
 * HTML5 Audio/Video 属性
 * 属性	描述
 * audioTracks	返回表示可用音轨的 AudioTrackList 对象
 * autoplay	设置或返回是否在加载完成后随即播放音频/视频
 * buffered	返回表示音频/视频已缓冲部分的 TimeRanges 对象
 * controller	返回表示音频/视频当前媒体控制器的 MediaController 对象
 * controls	设置或返回音频/视频是否显示控件（比如播放/暂停等）
 * crossOrigin	设置或返回音频/视频的 CORS 设置
 * currentSrc	返回当前音频/视频的 URL
 * currentTime	设置或返回音频/视频中的当前播放位置（以秒计）
 * defaultMuted	设置或返回音频/视频默认是否静音
 * defaultPlaybackRate	设置或返回音频/视频的默认播放速度
 * duration	返回当前音频/视频的长度（以秒计）
 * ended	返回音频/视频的播放是否已结束
 * error	返回表示音频/视频错误状态的 MediaError 对象
 * loop	设置或返回音频/视频是否应在结束时重新播放
 * mediaGroup	设置或返回音频/视频所属的组合（用于连接多个音频/视频元素）
 * muted	设置或返回音频/视频是否静音
 * networkState	返回音频/视频的当前网络状态
 * paused	设置或返回音频/视频是否暂停
 * playbackRate	设置或返回音频/视频播放的速度
 * played	返回表示音频/视频已播放部分的 TimeRanges 对象
 * preload	设置或返回音频/视频是否应该在页面加载后进行加载
 * readyState	返回音频/视频当前的就绪状态
 * seekable	返回表示音频/视频可寻址部分的 TimeRanges 对象
 * seeking	返回用户是否正在音频/视频中进行查找
 * src	设置或返回音频/视频元素的当前来源
 * startDate	返回表示当前时间偏移的 Date 对象
 * textTracks	返回表示可用文本轨道的 TextTrackList 对象
 * videoTracks	返回表示可用视频轨道的 VideoTrackList 对象
 * volume	设置或返回音频/视频的音量
 * HTML5 Audio/Video 事件
 * 事件	描述
 * abort	当音频/视频的加载已放弃时
 * canplay	当浏览器可以播放音频/视频时
 * canplaythrough	当浏览器可在不因缓冲而停顿的情况下进行播放时
 * durationchange	当音频/视频的时长已更改时
 * emptied	当目前的播放列表为空时
 * ended	当目前的播放列表已结束时
 * error	当在音频/视频加载期间发生错误时
 * loadeddata	当浏览器已加载音频/视频的当前帧时
 * loadedmetadata	当浏览器已加载音频/视频的元数据时
 * loadstart	当浏览器开始查找音频/视频时
 * pause	当音频/视频已暂停时
 * play	当音频/视频已开始或不再暂停时
 * playing	当音频/视频在已因缓冲而暂停或停止后已就绪时
 * progress	当浏览器正在下载音频/视频时
 * ratechange	当音频/视频的播放速度已更改时
 * seeked	当用户已移动/跳跃到音频/视频中的新位置时
 * seeking	当用户开始移动/跳跃到音频/视频中的新位置时
 * stalled	当浏览器尝试获取媒体数据，但数据不可用时
 * suspend	当浏览器刻意不获取媒体数据时
 * timeupdate	当目前的播放位置已更改时
 * volumechange	当音量已更改时
 * waiting	当视频由于需要缓冲下一帧而停止
 * 
 * autoplay	设置或返回是否在加载完成后随即播放音频/视频  
 * currentSrc	返回当前音频/视频的 URL
 * currentTime	设置或返回音频/视频中的当前播放位置（以秒计）
 * defaultMuted	设置或返回音频/视频默认是否静音
 * defaultPlaybackRate	设置或返回音频/视频的默认播放速度
 * duration	返回当前音频/视频的长度（以秒计）
 * ended	返回音频/视频的播放是否已结束
 * error	返回表示音频/视频错误状态的 MediaError 对象
 * loop	设置或返回音频/视频是否应在结束时重新播放 
 * muted	设置或返回音频/视频是否静音 
 * paused	设置或返回音频/视频是否暂停
 * playbackRate	设置或返回音频/视频播放的速度
 * played	返回表示音频/视频已播放部分的 TimeRanges 对象 
 * seeking	返回用户是否正在音频/视频中进行查找 
 * volume	设置或返回音频/视频的音量 
 */






function Video() {
    //初始化
    this.initialize.apply(this, arguments);
}
//初始化
Video.prototype.initialize = function() {

    this._video = document.createElement('video');

    this._baseTexture = new PIXI.Texture.fromVideo(this._video);

    this.name = ""
        //this._baseTexture.mipmap = false;
        // this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;  
    this._loadListeners = [];

    this._isLoading = false;
    this._hasError = false;

    /**缓存条目，为图像。在所有情况下_url 是相同的 缓存条目 键
     * Cache entry, for images. In all cases _url is the same as cacheEntry.key
     * @type CacheEntry  
     */
    this.cacheEntry = null;
};


Video.prototype.update = function() {
    if (this.baseTexture) {
        this.baseTexture.update()
    }
}



/**加载一个图像文件，并返回一个新的位图对象。
 * Loads a image file and returns a new Video object.
 *
 * @static
 * @method load
 * @param {String} url The image url of the texture
 * @return Video
 */
Video.load = function(name) {
    var video = new Video();
    video._name = name
    var url = this.videoNameToUrl(name)
    video._load(url)
    return video;
};


Video.videoNameToUrl = function(name) {
    var url = 'movies/' + name + this.videoFileExt();
    return url;
};


/**检查位图是否是已经做好准备
 * Checks whether the Video is ready to render.
 *
 * @method isReady
 * @return {Boolean} True if the Video is ready to render
 */
//是准备好
Video.prototype.isReady = function() {
    return !this._isLoading;
};

/**检查是否发生了错误装载。
 * Checks whether a loading error has occurred.
 *
 * @method isError
 * @return {Boolean} True if a loading error has occurred
 */
//是错误 
Video.prototype.isError = function() {
    return this._hasError;
};

/**触摸资源
 * touch the resource
 * @method touch
 */
//触摸
Video.prototype.touch = function() {
    if (this.cacheEntry) {
        this.cacheEntry.touch();
    }
};


Video.prototype._load = function(url) {
    this._isLoading = true;
    this._video.src = url;
    this._video.onloadeddata = this._onLoad.bind(this)
    this._video.onerror = this._onError.bind(this)
    this._video.onended = this._onEnd.bind(this)
        //this._video.autoplay = true
    this._video.style.width = 0;
    this._video.style.height = 0;
    this._video.load()
};






Object.defineProperties(Video.prototype, {
    url: { get: function() { return this._video.currentSrc; }, configurable: true },
    ended: { get: function() { return this._video.ended }, configurable: true },
    autoplay: { get: function() { return this._video.autoplay }, set: function(v) { return this._video.autoplay = v }, configurable: true },
    currentSrc: { get: function() { return this._video.currentSrc }, configurable: true },
    currentTime: { get: function() { return this._video.currentTime }, set: function(v) { return this._video.currentTime = v }, configurable: true },
    defaultMuted: { get: function() { return this._video.defaultMuted }, set: function(v) { return this._video.defaultMuted = v }, configurable: true },
    defaultPlaybackRate: { get: function() { return this._video.defaultPlaybackRate }, set: function(v) { return this._video.defaultPlaybackRate = v }, configurable: true },
    duration: { get: function() { return this._video.duration }, configurable: true },
    error: { get: function() { return this._video.error }, configurable: true },
    loop: { get: function() { return this._video.loop }, set: function(v) { return this._video.loop = v }, configurable: true },
    muted: { get: function() { return this._video.muted }, set: function(v) { return this._video.muted = v }, configurable: true },
    paused: { get: function() { return this._video.paused }, set: function(v) { return this._video.paused = v }, configurable: true },
    played: { get: function() { return this._video.played }, configurable: true },
    volume: { get: function() { return this._video.volume }, set: function(v) { return this._video.volume = v }, configurable: true },
    playbackRate: { get: function() { return this._video.playbackRate }, set: function(v) { return this._video.playbackRate = v }, configurable: true },
    width: { get: function() { return this._video.videoWidth }, configurable: true },
    height: { get: function() { return this._video.videoHeight }, configurable: true },

});



Object.defineProperty(Video.prototype, 'baseTexture', {
    //获得 
    get: function() {
        return this._baseTexture;
    },
    configurable: true
});

Video.prototype.addLoadListener = function(listner) {
    if (this._isLoading) {
        this._loadListeners.push(listner);
    } else {
        listner();
    }
};


Video.prototype._onLoad = function() {
    this._isLoading = false;
    this._callLoadListeners();
};

/**呼叫读取监听
 * @method _callLoadListeners
 * @private
 */
Video.prototype._callLoadListeners = function() {
    while (this._loadListeners.length > 0) {
        var listener = this._loadListeners.shift();
        listener();
    }
};

/**当错误
 * @method _onError
 * @private
 */
//当错误
Video.prototype._onError = function() {
    this._hasError = true;
};

Video.prototype._onEnd = function() {
    this._video.currentTime = 0
};

Video.prototype.pause = function() {
    this._video.pause();
};

Video.prototype.play = function() {
    this._video.play();
};


Video.videoFileExt = function() {
    if (Graphics.canPlayVideoType('video/webm') && !Utils.isMobileDevice()) {
        return '.webm';
    } else {
        return '.mp4';
    }
};


//检查发生更改
Video.prototype.checkDirty = function() {};



function Sprite_Video() {
    this.initialize.apply(this, arguments);
}

Sprite_Video.prototype = Object.create(PIXI.Sprite.prototype);
Sprite_Video.prototype.constructor = Sprite_Video;

Sprite.voidFilter = new PIXI.filters.VoidFilter();

//初始化
Sprite_Video.prototype.initialize = function(bitmap, w, h) {
    var texture = new PIXI.Texture(new PIXI.BaseTexture());
    PIXI.Sprite.call(this, texture);

    this._bitmap = null;
    this._frame = new Rectangle();
    this._realFrame = new Rectangle();

    this._needRefresh = false

    this.spriteId = Sprite._counter++;

    this.width = w || 0
    this.height = h || 0
    this.bitmap = bitmap;
};


Object.defineProperty(Sprite_Video.prototype, 'bitmap', {
    get: function() {
        return this._bitmap;
    },
    set: function(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            if (this._bitmap) {
                this.setFrame(0, 0, 0, 0);
                this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
            } else {
                this.texture.frame = Rectangle.emptyRectangle;
            }
        }
    },
    configurable: true
});

Sprite_Video.prototype.setFrame = function(x, y, width, height) {
    var frame = this._frame;
    if (x !== frame.x || y !== frame.y ||
        width !== frame.width || height !== frame.height) {
        frame.x = x;
        frame.y = y;
        frame.width = width;
        frame.height = height;
        this._needRefresh = true
    }
};

Sprite_Video.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
};

Sprite_Video.prototype.update = function() {
    if (this._needRefresh) {
        this._refresh()
        if (this._needRefresh == 2) {
            if (this.bitmap.autoplay === false) {
                this.bitmap.pause()
            }
        }
        this._needRefresh = false
    }
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
    if (this.bitmap) {
        this.bitmap.update()
    }
};

Sprite_Video.prototype._isInBitmapRect = function(x, y, w, h) {
    return (this._bitmap && x + w > 0 && y + h > 0 &&
        x < this._bitmap.width && y < this._bitmap.height);
};


Sprite_Video.prototype.size = function(width, height) {
    this.width = width || this._bitmap.width || 0
    this.height = height || this._bitmap.height || 0
};


Sprite_Video.prototype._onBitmapLoad = function() {
    //修改大小
    this.size(this.width, this.height)
    if (this._frame.width === 0 && this._frame.height === 0) {
        this._frame.width = this._bitmap.width;
        this._frame.height = this._bitmap.height;
    }
    this._needRefresh = 2
};


Sprite_Video.prototype._refresh = function() {
    var frameX = Math.floor(this._frame.x);
    var frameY = Math.floor(this._frame.y);
    var frameW = Math.floor(this._frame.width);
    var frameH = Math.floor(this._frame.height);
    var bitmapW = this._bitmap ? this._bitmap.width : 0;
    var bitmapH = this._bitmap ? this._bitmap.height : 0;
    var realX = frameX.clamp(0, bitmapW);
    var realY = frameY.clamp(0, bitmapH);
    var realW = (frameW - realX + frameX).clamp(0, bitmapW - realX);
    var realH = (frameH - realY + frameY).clamp(0, bitmapH - realY);

    this._realFrame.x = realX;
    this._realFrame.y = realY;
    this._realFrame.width = realW;
    this._realFrame.height = realH;

    if (realW > 0 && realH > 0) {
        if (this._bitmap) {
            this.texture = new PIXI.Texture(this._bitmap.baseTexture)
        }
        this.texture.frame = this._realFrame;
    } else if (this._bitmap) {
        this.texture.frame = Rectangle.emptyRectangle;
    } else {
        //TODO: remove this
        //TODO: 移除它
        this.texture.baseTexture = new PIXI.BaseTexture()
        this.texture.frame = Rectangle.emptyRectangle;
    }

};