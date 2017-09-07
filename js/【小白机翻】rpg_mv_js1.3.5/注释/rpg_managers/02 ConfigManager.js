
//-----------------------------------------------------------------------------
// ConfigManager
// 配置管理器
// The static class that manages the configuration data.
//这个静态的类 管理 配置数据

function ConfigManager() {
    throw new Error('This is a static class');
}
//始终冲刺 = false
ConfigManager.alwaysDash        = false;
//命令记忆 = false
ConfigManager.commandRemember   = false;

//定义属性 bgm大小
Object.defineProperty(ConfigManager, 'bgmVolume', {
    //获得
    get: function() {
        //返回 音频管理器 bgm大小
        return AudioManager._bgmVolume;
    },
    //设置
    set: function(value) {
        //音频管理器 bgm大小 = value//值
        AudioManager.bgmVolume = value;
    },
    //可配置 : true
    configurable: true
});

//定义属性 bgs大小
Object.defineProperty(ConfigManager, 'bgsVolume', {
    //获得
    get: function() {
        //返回 音频管理器 bgs大小
        return AudioManager.bgsVolume;
    },
    //设置
    set: function(value) {
        //音频管理器 bgs大小 = value//值
        AudioManager.bgsVolume = value;
    },
    //可配置 : true
    configurable: true
});

//定义属性 me大小
Object.defineProperty(ConfigManager, 'meVolume', {
    //获得
    get: function() {
        //返回 音频管理器 me大小
        return AudioManager.meVolume;
    },
    //设置
    set: function(value) {
        //音频管理器 me大小 = value//值
        AudioManager.meVolume = value;
    },
    //可配置 : true
    configurable: true
});

//定义属性 se大小
Object.defineProperty(ConfigManager, 'seVolume', {
    //获得
    get: function() {
        //返回 音频管理器 se大小
        return AudioManager.seVolume;
    },
    //设置
    set: function(value) {
        //音频管理器 se大小 = value//值
        AudioManager.seVolume = value;
    },
    //可配置 : true
    configurable: true
});
//读取
ConfigManager.load = function() {
    //json
    var json;
    //配置 = {}
    var config = {};
    //测试
    try {
        //json = 存储管理器 读取(-1)
        json = StorageManager.load(-1);
    //如果错误(e)
    } catch (e) {
        //控制台 错误(e)
        console.error(e);
    }
    //如果(json)
    if (json) {
        //配置 = JSON 解析(json)
        config = JSON.parse(json);
    }
    //应用数据(配置)
    this.applyData(config);
};
//保存
ConfigManager.save = function() {
    //存储管理器 保存(-1 , JSON 转换( 制作数据() ))
    StorageManager.save(-1, JSON.stringify(this.makeData()));
};
//制作数据
ConfigManager.makeData = function() {
    //配置 = {}
    var config = {};
    //配置 始终冲刺 = 始终冲刺 
    config.alwaysDash = this.alwaysDash;
    //配置 命令记忆 = 命令记忆
    config.commandRemember = this.commandRemember;
    //配置 bgm大小 = bgm大小
    config.bgmVolume = this.bgmVolume;
    //配置 bgs大小 = bgs大小
    config.bgsVolume = this.bgsVolume;
    //配置 me大小 = me大小
    config.meVolume = this.meVolume;
    //配置 se大小 = se大小
    config.seVolume = this.seVolume;
    //返回 配置
    return config;
};
//应用数据
ConfigManager.applyData = function(config) {
    //始终冲刺 = 读取标志( 配置 , 'alwaysDash'//始终冲刺)
    this.alwaysDash = this.readFlag(config, 'alwaysDash');
    //命令记忆 = 读取标志( 配置 , 'commandRemember'//命令记忆)
    this.commandRemember = this.readFlag(config, 'commandRemember');
    //bgm大小 = 读取大小( 配置 , 'bgmVolume'//bgm大小)
    this.bgmVolume = this.readVolume(config, 'bgmVolume');
    //bgs大小 = 读取大小( 配置 , 'bgsVolume'//bgs大小)
    this.bgsVolume = this.readVolume(config, 'bgsVolume');
    //me大小 = 读取大小( 配置 , 'meVolume'//me大小)
    this.meVolume = this.readVolume(config, 'meVolume');
    //se大小 = 读取大小( 配置 , 'seVolume'/se大小)
    this.seVolume = this.readVolume(config, 'seVolume');
};
//读取标志
ConfigManager.readFlag = function(config, name) {
    //返回 !!配置[名称]
    return !!config[name];
};
//读取大小
ConfigManager.readVolume = function(config, name) {
    //值 = 配置[名称]
    var value = config[name];
    //如果( 值 !== undefined//未定义 )
    if (value !== undefined) {
        //返回 数字(值).在之间(0,100)
        return Number(value).clamp(0, 100);
    //否则 
    } else {
        //返回 100
        return 100;
    }
};
