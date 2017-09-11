/*
方法	描述
addTextTrack()	向音频/视频添加新的文本轨道
canPlayType()	检测浏览器是否能播放指定的音频/视频类型
load()	重新加载音频/视频元素
play()	开始播放音频/视频
pause()	暂停当前播放的音频/视频
HTML5 Audio/Video 属性
属性	描述
audioTracks	返回表示可用音轨的 AudioTrackList 对象
autoplay	设置或返回是否在加载完成后随即播放音频/视频
buffered	返回表示音频/视频已缓冲部分的 TimeRanges 对象
controller	返回表示音频/视频当前媒体控制器的 MediaController 对象
controls	设置或返回音频/视频是否显示控件（比如播放/暂停等）
crossOrigin	设置或返回音频/视频的 CORS 设置
currentSrc	返回当前音频/视频的 URL
currentTime	设置或返回音频/视频中的当前播放位置（以秒计）
defaultMuted	设置或返回音频/视频默认是否静音
defaultPlaybackRate	设置或返回音频/视频的默认播放速度
duration	返回当前音频/视频的长度（以秒计）
ended	返回音频/视频的播放是否已结束
error	返回表示音频/视频错误状态的 MediaError 对象
loop	设置或返回音频/视频是否应在结束时重新播放
mediaGroup	设置或返回音频/视频所属的组合（用于连接多个音频/视频元素）
muted	设置或返回音频/视频是否静音
networkState	返回音频/视频的当前网络状态
paused	设置或返回音频/视频是否暂停
playbackRate	设置或返回音频/视频播放的速度
played	返回表示音频/视频已播放部分的 TimeRanges 对象
preload	设置或返回音频/视频是否应该在页面加载后进行加载
readyState	返回音频/视频当前的就绪状态
seekable	返回表示音频/视频可寻址部分的 TimeRanges 对象
seeking	返回用户是否正在音频/视频中进行查找
src	设置或返回音频/视频元素的当前来源
startDate	返回表示当前时间偏移的 Date 对象
textTracks	返回表示可用文本轨道的 TextTrackList 对象
videoTracks	返回表示可用视频轨道的 VideoTrackList 对象
volume	设置或返回音频/视频的音量
HTML5 Audio/Video 事件
事件	描述
abort	当音频/视频的加载已放弃时
canplay	当浏览器可以播放音频/视频时
canplaythrough	当浏览器可在不因缓冲而停顿的情况下进行播放时
durationchange	当音频/视频的时长已更改时
emptied	当目前的播放列表为空时
ended	当目前的播放列表已结束时
error	当在音频/视频加载期间发生错误时
loadeddata	当浏览器已加载音频/视频的当前帧时
loadedmetadata	当浏览器已加载音频/视频的元数据时
loadstart	当浏览器开始查找音频/视频时
pause	当音频/视频已暂停时
play	当音频/视频已开始或不再暂停时
playing	当音频/视频在已因缓冲而暂停或停止后已就绪时
progress	当浏览器正在下载音频/视频时
ratechange	当音频/视频的播放速度已更改时
seeked	当用户已移动/跳跃到音频/视频中的新位置时
seeking	当用户开始移动/跳跃到音频/视频中的新位置时
stalled	当浏览器尝试获取媒体数据，但数据不可用时
suspend	当浏览器刻意不获取媒体数据时
timeupdate	当目前的播放位置已更改时
volumechange	当音量已更改时
waiting	当视频由于需要缓冲下一帧而停止
*/
    
/*
v = Video.load("1")  
s = v.sprite(816,624) ;SceneManager._scene.addChild(s)

    */
function Video() {
	//初始化
    this.initialize.apply(this, arguments);
}
 
    
    Video.prototype.sprite = function( w,h) {
        this._texture = PIXI.VideoTexture.textureFromVideo(this._video);
        this._spriteVideo = new PIXI.Sprite(this._texture);
        this._spriteVideo.width = w;
        this._spriteVideo.height = h;
        return  this._spriteVideo
    };

    Video.prototype.pauseVideo = function() {
        this._video.pause();
    };

    Video.prototype.playVideo = function() {
        this._video.play();
    };

 

Video.prototype.initialize = function() {
	this._name = ""
	this._posterName = "";
	this._video = document.createElement('video');
    this._video.autoPlay = true;
	this._video.loop = true;
	this._video.muted = false;
	this._video.poster = ''
} 

//PIXI.Texture.fromVideo
Video.prototype.sprite =function (w ,h) {
	var texture = PIXI.VideoTexture.textureFromVideo(this._video);
    var sprite = new PIXI.Sprite(texture);
    sprite.video = this._video
    sprite.width = w
    sprite.height = h 
	return sprite;
} 
 
Video.prototype.video =function ( ) { 
	return this._video;
} 
Video.prototype.pauseVideo = function() {
    this._video.pause();
};

Video.prototype.playVideo = function() {
    this._video.play();
};

Video.prototype.loop = function(r) {
    if( r === true ){
	    this._video.loop = true;
    }else if( r === false ){
	    this._video.loop = false
    }
    return  this._video.loop
};
//自动播放
Video.prototype.autoPlay = function(r) {
    if( r === true ){
	    this._video.autoPlay = true;
    }else if( r === false ){
	    this._video.autoPlay = false
    }
    return  this._video.autoPlay
};
//静音
Video.prototype.muted = function(r ) {
    if( r === true ){
	    this._video.muted = true;
    }else if( r === false ){
	    this._video.muted = false
    }
    return  this._video.muted
};
 

Video.prototype.poster = function(url,cs) {
	if(cs){ 
		this._posterName = url
		this._video.poster  = url
	} 
    return  this._video.poster 
};



Video.prototype.load = function(url) {
    this._video.src = url;
    this._video.onloadeddata = this._onVideoLoad.bind(this);
    this._video.onerror = this._onVideoError.bind(this);
    this._video.onended = this._onVideoEnd.bind(this);
    this._video.style.width = 0;
    this._video.style.height = 0;
    this._video.load();  
    // this.sprite(816,624) 
};


Video.prototype._onVideoLoad = function() { 
    console.log(this._name)
    this._video.play();
};

Video.prototype._onVideoError = function() {
};

Video.prototype._onVideoEnd = function() {
};


Video.load =function (name,posterName) {
	var video = new Video()
	video._name = name 
	if(posterName){
		video.poster(posterName,true)
	}
    var ext =  this.videoFileExt();
	var url = 'movies/' + name + ext 
	video.load(url)
	//document.body.appendChild(video._video);
	return video
}


Video.videoFileExt = function() {
    if (Graphics.canPlayVideoType('video/webm') && !Utils.isMobileDevice()) {
        return '.webm';
    } else {
        return '.mp4';
    }
};



 

    /* Overwritten Scene_Title methods */
    Scene_Title.prototype.create = function() {

        /* Prevent the video to be duplicated */
     
        this.videoTitle =   Video.load("1");
        this.videoTitle.playVideo(); 
        this.addChild(this.videoTitle.sprite(816,624));
        this.createForeground();
        this.createWindowLayer();
        this.createCommandWindow();
    };

    Scene_Title.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        SceneManager.clearStack(); 
        this.startFadeIn(this.fadeSpeed(), false);
    };

    Scene_Title.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        this.videoTitle.pauseVideo();
        SceneManager.snapForBackground();
    };












