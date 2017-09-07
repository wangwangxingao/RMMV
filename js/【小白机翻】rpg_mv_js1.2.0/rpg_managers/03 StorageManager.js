
//-----------------------------------------------------------------------------
// StorageManager
// 存储管理器
// The static class that manages storage for saving game data.
// 这个静态的类 管理存储 保存游戏数据

function StorageManager() {
    throw new Error('This is a static class');
}

//保存
StorageManager.save = function(savefileId, json) {
	//如果 是本地模式
    if (this.isLocalMode()) {
	    //保存到本地文件
        this.saveToLocalFile(savefileId, json);
    } else {
	    //保存到网络存储
        this.saveToWebStorage(savefileId, json);
    }
};
//读取
StorageManager.load = function(savefileId) {
	//如果 是本地模式
    if (this.isLocalMode()) {
	    // 读取从本地文件
        return this.loadFromLocalFile(savefileId);
    } else {
	    // 读取从网络存储
        return this.loadFromWebStorage(savefileId);
    }
};
//存在 
StorageManager.exists = function(savefileId) {
	//如果 是本地模式
    if (this.isLocalMode()) {
	    //本地文件存在
        return this.localFileExists(savefileId);
    } else {
	    //网络存储存在
        return this.webStorageExists(savefileId);
    }
};
//删除
StorageManager.remove = function(savefileId) {
	//如果 是本地模式
    if (this.isLocalMode()) {
	    //删除本地文件
        this.removeLocalFile(savefileId);
    } else {
	    //删除网络存储
        this.removeWebStorage(savefileId);
    }
};

//备份
StorageManager.backup = function(savefileId) {
    if (this.exists(savefileId)) {
        if (this.isLocalMode()) {
            var data = this.loadFromLocalFile(savefileId);
            var compressed = LZString.compressToBase64(data);
            var fs = require('fs');
            var dirPath = this.localFileDirectoryPath();
            var filePath = this.localFilePath(savefileId) + ".bak";
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            fs.writeFileSync(filePath, compressed);
        } else {
            var data = this.loadFromWebStorage(savefileId);
            var compressed = LZString.compressToBase64(data);
            var key = this.webStorageKey(savefileId) + "bak";
            localStorage.setItem(key, compressed);
        }
    }
};
//备份存在
StorageManager.backupExists = function(savefileId) {
    if (this.isLocalMode()) {
        return this.localFileBackupExists(savefileId);
    } else {
        return this.webStorageBackupExists(savefileId);
    }
};
//清除备份
StorageManager.cleanBackup = function(savefileId) {
	if (this.backupExists(savefileId)) {
		if (this.isLocalMode()) {
			var fs = require('fs');
            var dirPath = this.localFileDirectoryPath();
            var filePath = this.localFilePath(savefileId);
            fs.unlinkSync(filePath + ".bak");
		} else {
		    var key = this.webStorageKey(savefileId);
			localStorage.removeItem(key + "bak");
		}
	}
};
//还原备份
StorageManager.restoreBackup = function(savefileId) {
    if (this.backupExists(savefileId)) {
        if (this.isLocalMode()) {
            var data = this.loadFromLocalBackupFile(savefileId);
            var compressed = LZString.compressToBase64(data);
            var fs = require('fs');
            var dirPath = this.localFileDirectoryPath();
            var filePath = this.localFilePath(savefileId);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            fs.writeFileSync(filePath, compressed);
            fs.unlinkSync(filePath + ".bak");
        } else {
            var data = this.loadFromWebStorageBackup(savefileId);
            var compressed = LZString.compressToBase64(data);
            var key = this.webStorageKey(savefileId);
            localStorage.setItem(key, compressed);
            localStorage.removeItem(key + "bak","");
        }
    }
};

//是本地模式
StorageManager.isLocalMode = function() {
	//Utils是Nwjs
    return Utils.isNwjs();
};
//保存到本地文件
StorageManager.saveToLocalFile = function(savefileId, json) {
	// data 设置为 LZString的压缩到基准64(json)
    var data = LZString.compressToBase64(json);
    // 使用fs的方法
    var fs = require('fs');
    // 目录路径 设置为 本地文件目录路径
    var dirPath = this.localFileDirectoryPath();
    // 文件路径 设置为 本地文件路径(savefileId)
    var filePath = this.localFilePath(savefileId);
    //如果 不是 检测文件存在(目录路径)
    if (!fs.existsSync(dirPath)) {
	    //建立 目录路径
        fs.mkdirSync(dirPath);
    }
    //写入文件(文件路径,data)
    fs.writeFileSync(filePath, data);
};
//读取从本地文件
StorageManager.loadFromLocalFile = function(savefileId) {
	//data 设为 null
    var data = null;
    // 使用fs的方法
    var fs = require('fs');
    // 文件路径 设置为 本地文件路径(savefileId)
    var filePath = this.localFilePath(savefileId);
    //如果 检测文件存在(文件路径)
    if (fs.existsSync(filePath)) {
	    //data 设置为 读取文件(文件路径,{编码:utf8})
        data = fs.readFileSync(filePath, { encoding: 'utf8' });
    }
    //返回 LZString的解压从基础64(data)
    return LZString.decompressFromBase64(data);
};
//读取从本地存储备份文件
StorageManager.loadFromLocalBackupFile = function(savefileId) {
    var data = null;
    var fs = require('fs');
    var filePath = this.localFilePath(savefileId) + ".bak";
    if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath, { encoding: 'utf8' });
    }
    return LZString.decompressFromBase64(data);
};
//本地文件备份存在
StorageManager.localFileBackupExists = function(savefileId) {
    var fs = require('fs');
    return fs.existsSync(this.localFilePath(savefileId) + ".bak");
};

//本地文件存在
StorageManager.localFileExists = function(savefileId) {
	// 使用fs的方法
    var fs = require('fs');
    //返回 检测文件存在(本地文件路径(savefileId))
    return fs.existsSync(this.localFilePath(savefileId));
};
//删除本地文件
StorageManager.removeLocalFile = function(savefileId) {
	// 使用fs的方法
    var fs = require('fs');
    // 文件路径 设置为 本地文件路径(savefileId)
    var filePath = this.localFilePath(savefileId);
    //如果 检测文件存在(文件路径)
    if (fs.existsSync(filePath)) {
	    //删除文件(文件路径)
        fs.unlinkSync(filePath);
    }
};
//保存到网络存储
StorageManager.saveToWebStorage = function(savefileId, json) {
	//键设置为 网络存储键(savefileId)
    var key = this.webStorageKey(savefileId);
    // data 设置为  LZString的压缩到基准64(json)
    var data = LZString.compressToBase64(json);
    //没有时间限制的数据存储 设置项目(键,data)
    localStorage.setItem(key, data);
};
//读取从网络存储
StorageManager.loadFromWebStorage = function(savefileId) {
	//键设置为 网络存储键(savefileId)
    var key = this.webStorageKey(savefileId);
    //data 设置为 没有时间限制的数据存储 获取项目(key)
    var data = localStorage.getItem(key);
    //返回 LZString的解压从基础64(data)
    return LZString.decompressFromBase64(data);
};
//读取从网络存储备份
StorageManager.loadFromWebStorageBackup = function(savefileId) {
    var key = this.webStorageKey(savefileId) + "bak";
    var data = localStorage.getItem(key);
    return LZString.decompressFromBase64(data);
};
//网络存储备份存在
StorageManager.webStorageBackupExists = function(savefileId) {
    var key = this.webStorageKey(savefileId) + "bak";
    return !!localStorage.getItem(key);
};

//网络存储存在
StorageManager.webStorageExists = function(savefileId) {
	//键 设置为 网络存储键(savefileId)
    var key = this.webStorageKey(savefileId);
    // 返回 没有时间限制的数据存储 获取项目(key) 的布尔值
    return !!localStorage.getItem(key);
};
//删除网络存储
StorageManager.removeWebStorage = function(savefileId) {
	//键 设置为 网络存储键(savefileId)
    var key = this.webStorageKey(savefileId);
    //没有时间限制的数据存储 删除项目(key) 
    localStorage.removeItem(key);
};
//本地文件目录路径
StorageManager.localFileDirectoryPath = function() {
	//路径 设置为 窗口 位置 的 路径名称 的 /www/和之后 代替为 save/   (揣测)
    var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, '/save/');
    //路径 比较 (正则表达式什么的完全不会)
    if (path.match(/^\/([A-Z]\:)/)) {
	    //设置为 切片(1)
        path = path.slice(1);
    }
    //返回 解码(路径)
    return decodeURIComponent(path);
};
//本地文件路径
StorageManager.localFilePath = function(savefileId) {
    var name;
    if (savefileId < 0) {
        name = 'config.rpgsave';
    } else if (savefileId === 0) {
        name = 'global.rpgsave';
    } else {
        name = 'file%1.rpgsave'.format(savefileId);
    }
    return this.localFileDirectoryPath() + name;
};
//网络存储键
StorageManager.webStorageKey = function(savefileId) {
	//如果 savefileId < 0 
    if (savefileId < 0) {
	    //返回 rpg 配置
        return 'RPG Config';
        //如果 savefileId 全等于0
    } else if (savefileId === 0) {
	    //返回 rpg 共用
        return 'RPG Global';
    } else {
	    //返回 rpg file + savefileId
        return 'RPG File%1'.format(savefileId);
    }
};

/*
=======================================================================================================
=======================================================================================================
网络储存的操作
转自网络

localStorage和sessionStorage操作
localStorage和sessionStorage都具有相同的操作方法，例如setItem、getItem和removeItem等
localStorage和sessionStorage的方法：
setItem存储value
用途：将value存储到key字段
用法：.setItem( key, value)
代码示例：

复制代码代码如下:
sessionStorage.setItem("key", "value");
localStorage.setItem("site", "js8.in");

getItem获取value
用途：获取指定key本地存储的值
用法：.getItem(key)
代码示例：

复制代码代码如下:
var value = sessionStorage.getItem("key"); 
var site = localStorage.getItem("site");

removeItem删除key
用途：删除指定key本地存储的值
用法：.removeItem(key)
代码示例：

复制代码代码如下:
sessionStorage.removeItem("key"); 
localStorage.removeItem("site");

clear清除所有的key/value
用途：清除所有的key/value
用法：.clear()
代码示例：

复制代码代码如下:
sessionStorage.clear(); 
localStorage.clear();

四、其他操作方法：点操作和[]
web Storage不但可以用自身的setItem,getItem等方便存取，也可以像普通对象一样用点(.)操作符，及[]的方式进行数据存储，像如下的代码：

复制代码代码如下:

var storage = window.localStorage; storage.key1 = "hello"; 
storage["key2"] = "world"; 
console.log(storage.key1); 
console.log(storage["key2"]);

五、localStorage和sessionStorage的key和length属性实现遍历
sessionStorage和localStorage提供的key()和length可以方便的实现存储的数据遍历，例如下面的代码：

复制代码代码如下:

var storage = window.localStorage; 
for (var i=0, len = storage.length; i < len; i++)
{
var key = storage.key(i); 
var value = storage.getItem(key); 
console.log(key + "=" + value); 
}

六、storage事件
storage还提供了storage事件，当键值改变或者clear的时候，就可以触发storage事件，如下面的代码就添加了一个storage事件改变的监听：

复制代码代码如下:
if(window.addEventListener){ 
window.addEventListener("storage",handle_storage,false); 
}
else if(window.attachEvent)
{ 
window.attachEvent("onstorage",handle_storage); 
} 
function handle_storage(e){
if(!e){e=window.event;} 
}

storage事件对象的具体属性如下表：
Property	Type	Description
key	String	The named key that was added, removed, or moddified
oldValue	Any	The previous value(now overwritten), or null if a new item was added
newValue	Any	The new value, or null if an item was added
url/uri	String	The page that called the method that triggered this change


=======================================================================================================
=======================================================================================================


本地文件的操作
转自网络

File System 
    关于文件操作，那么这边主要的就是 fs 这个模块。对于node中 fs 模块提供的API很多，但是其所有的方法均有同步和异步的形式。对于读取文件内容来说，最需要注意的一点就是异步与同步之间控制执行流程的问题~

var fs = require('fs');
// 使用异步回调的方式 因为是异步的，所以对于数据读取完后的操作我们需要使用回调的方式进行处理
// 这点对于习惯事件操作的前端开发应该是习以为常的 。
fs.readFile('data.json',function(err, data){
  if(err){ }else{ 
    console.log(data.length);
   }
});


    每个异步的API，都有其回调函数可以使用，那么对于下面的方式就会报错，就犹如在JS使用的setTimeout等类似，                                                      

var fs = require('fs');
//会有错 因为是异步读取文件 ，在console的时候数据还未读取出来
var data = fs.readFile('data.json');
console.log(data.length);



    或者干脆直接     使用其对应的同步API使用

var fs = require('fs');
// 或者改为同步的API读取
var data = fs.readFileSync('data.json');
console.log(data.length);



    其他一些简单的API

fs.writeFile('delete.txt','1234567890'，function(err){
    console('youxi!');
});

// 删除文件
fs.unlink('delete.txt', function(){
 console.log('success');
});

// 修改文件名称
fs.rename('delete.txt','anew.txt',function(err){
 console.log('rename success');

 // 查看文件状态
fs.stat('anew.txt', function(err, stat){
  console.log(stat);
 });
});

// 判断文件是否存在
fs.exists('a.txt', function( exists ){
    console.log( exists );
});

fs.existsSync()  同步版的 fs.exists() 。


File System API

fs.open( path, flags,  [mode], callback );
flags为：
    'r' - 以只读方式打开文件，当文件不存在的时候发生异常
    'r+' - 以读写方式打开文件，当文件不存在的时候发生异常
    'rs' - 以只读方式同步打开文件，绕过本地缓存文件进行系统操作
    'rs+' - 以读写方式同步打开文件 ，绕过本地缓存文件进行系统操作
    'w' - 以只写方式打开文件，当文件不存在时创建文件，或者存在的时候覆盖文件
    'wx' - 与'w'一致，但只适用于文件不存在的时候( 测试的时候,，node版本为v0.10.26，如果文件不存在则正常创建文件并且写入数据，但是当文件不存在的时候，报错为必须要写上callback，加上callback后不报错但是不执行任何操作。 )
    'w+' - 以读写方式打开文件
    'ws+' - 与'w+'一致，但只适用于文件不存在的时候
    'a' - 以添加数据的方式打开文件，文件不存在则创建
    'a+' - 以添加和读取的方式打开文件，文件不存在则创建
    'ax+' - 与'a+'一致，但是存在的时候会失败

mode为：
    设置文件的模式，默认为 0666，可读可写。

callback：
    给出了两个参数 (  err, fd )


fs.readFile( filename, [optins], callback );
filename : String
option : Object
    encoding : String | Null, default = Null
    flag : String default = 'r'    
callback : Function
// callback 具有两个参数，( err, data )，和node中大部分回调接口类似。


fs.writeFile( filename, data,  [optins], callback );
filename : String
data : String | Buffer（之后会简单介绍）
option : Object
    encoding : String | Null, default = 'utf8'
    mode : Number default = 438
    flag : String default = 'w'    
callback : Function


// 将数据添加到文件末尾
fs.appendFile( filename, data,  [optins], callback );
filename : String
data : String | Buffer
option : Object
    encoding : String | Null, default = 'utf8'
    mode : Number default = 438
    flag : String default = 'w'    
callback : Function

以上比较常用的异步API 均有与之对应的同步API，在异步API后面加上Sync即是同步的API。更多的API请查看官方文档 http://nodejs.org/api/fs.html



Stream

    Stream可以算是node里的一出重头戏，与大数据处理方面有密切不可分的关系。

var fs = require('fs');
function copy( src, dest ){
  fs.writeFileSync( dest, fs.readFileSync(src) );
 }
copy('data.json', 'dataStream.json');

    上面是一个对文件拷贝的代码，看似没什么问题，也的确在处理小文件的时候没什么大问题，但是一旦处理数量级很大的文件的时候可以看出，先将数据读取出来，在写入，内存作为中转，如果文件太大就会产生问题。

    在需要处理大文件的情况时，便要使用file system的另外几个API，createReadStream和fs.createWriteStream，将文件作为一块一块小的数据流进行处理，而不是一整块大型数据。

// 也可能出现内存爆仓 写入数据跟不上读取速度 一直读取的文件不断放入内存中
// 但是两个操作速度绝对是不一样的，于是未被写入的数据在内存中不断变大，就可能会导致内存的爆仓。
var fs = require('fs');
var rs = fs.createReadStream('data.json'); 
 var ws = fs.createWriteStream('dataStream.json')
 rs.on('data',function(chunk){
  console.log('data chunk read ok');
  times++;
  ws.write(chunk,function(){
   console.log('data chunk write ok'); 
  });
 });
 rs.on('end',function(){
  console.log(times);
 });


这边可以看出对于读取和写入的速度不同，在最开始的时候读取完2块数据块后，第一块数据块写入才完毕，当累计很多之后势必会造成内存问题。所以对于流操作还需要改进一下

var fs = require('fs');
var rs = fs.createReadStream('data.json');
 var ws = fs.createWriteStream('dataStream.json')
 // eg 1 可以看数据流 drain事件表示为 只写数据流已将缓存里的数据写入目标
 rs.on('data',function(chunk){
  console.log('data chunk read ok');
  if( ws.write(chunk,function(){
    console.log('data chunk write ok')
  }) == false ){
   rs.pause()
  }
 });
 rs.on('end',function(){
  ws.end()
 });
 ws.on('drain',function(){
  rs.resume();
 });

或者：
//eg2
 function reStartRead( rs ){
  console.log('lasted readed data write OK, reStart Read.');
  rs.resume();
 }
 rs.on('data',function(chunk){
  console.log('data chunk read ok' );
  if( ws.write(chunk,function(){
    reStartRead( rs );
   }) == false ){
   rs.pause()
  }
 });
 rs.on('end',function(){
  ws.end()
 });



上面两个方式相当于每次读取完一块data块之后便暂停读取，直到该块写入已经完成才再次开启读取的stream。

对于这种情况 node里面有一个pipe的方法 连接两个数据流，犹如导管一样将数据读入写入

function copy( src, dest ){
  fs.createReadStream( src ).pipe( fs.createWriteStream( dest ) );
 }
 copy('data.json', 'dataStream.json');






fs.mkdirSync 同步版的 fs.mkdir() 。

fs.mkdirSync(path, [mode])
由于该方法属于fs模块，使用前需要引入fs模块（var fs= require(“fs”) ）
接收参数：
path            将创建的目录路径
mode          目录权限（读写权限），默认0777
 
 */ 