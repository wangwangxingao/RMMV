//=============================================================================
// ww_makeRenwu.js
//=============================================================================
/*:
 * @plugindesc 人物生成
 * @author wangwang
 *
 * @param path_name
 * @desc 默认保存文件夹的名称
 * @default chucun
 *
 * @param dataid
 * @desc 默认保存数据变量
 * @default 100
 *
 * @help
 *
 *=============================================================================
 *使用准备: 
 * 
 *  把mv程序里的Generator 文件夹移动到工程的img文件夹下面
 *   
 *  脚本会 调用 ww_makeRenwu.tool.load() 方法 读取  img/Generator/ww_makeRenwu.json 
 *  如果没有该文件 ,那么会调用 ww_makeRenwu.tool.duqu() 来处理数据
 *  并在 Generator文件夹下会生成 ww_makeRenwu.json 
 *  目前此方法只适用于电脑上,建议在电脑上运行本脚本一次后再转到其他地方
 *
 *
 *  目前支持存档内的图片保存,保存到 $gameVariables._data[dataid],但不支持存档画面上的人物图的改变
 *  
 *  脚本会自动检查并创建必要文件夹 img/Generator 和 img/Generator0
 *  把要添加的自制素材放到 img/Generator0/Female 或 img/Generator0/Male 下 
 *  运行 ww_makeRenwu.tool.add()
 *  素材会添加到 img/Generator 里(额,如果要修改系统的,把这个工程的Generator移回去就好)
 *
 *=============================================================================
 * 方法: 
 *    以下都是在脚本或控制台里使用
 *-------------------------------------------
 *
 *   读取处理文件列表 
 *   ww_makeRenwu.tool.load() 读取img/Generator/ww_makeRenwu.json如果没有,调用 ww_makeRenwu.tool.duqu() 
 *   ww_makeRenwu.tool.duqu() 读取img/Generator/下的素材
 *
 *-------------------------------------------
 *
 *   添加素材
 *   把要添加的素材放到 
 *   img/Generator0/Female 或 img/Generator0/Male 下
 *   运行 ww_makeRenwu.tool.add()
 *   素材会添加到 img/Generator 里(额,如果要修改系统的,把这个工程的Generator移回去就好)
 *
 * 
 *-------------------------------------------
 *
 *   获取一个空白人物数据
 *   new ww_makeRenwu()
 *
 *-------------------------------------------
 *
 *   进入人物生成界面
 *   ww_makeRenwu.goto(name,index,sjid,jc)   
 *      name 是文件名,
 *      index 是人物编号,
 *      sjid 随机类型 ,目前只有 0 (女), 1 (男)
 *           如要添加 修改 ww_makeRenwu.data.sjb ,参考已有内容进行设置
 *      jc 是检查类型 0,严格型 ,1,基本可以型,2,不检查 ,更多请自行设置 ww_makeRenwu.data.jiancha
 *   
 *-------------------------------------------
 *
 *   随机人物功能:
 *   (不智能)
 *   获得一个随机的人物数据 
 *   ww_makeRenwu.new(sjid)
 *   人物数据进行随机构建
 *   ww_makeRenwu.make.new(obj,sjid)
 *   建立8个随机人物 并保存 图片
 *   ww_makeRenwu.newRenwu(name,sjid)
 *
 *-------------------------------------------
 *
 *   保存功能:
 *   保存人物数据为图片,并且本方法使用1秒后会刷新场景(解决菜单界面修改后不改变的情况)
 *   ww_makeRenwu.baocun.sxall(obj,name,index)
 *   
 *   使用:可以新建一个人物数据,设置后使用本方法保存,
 *   如
 *        var rw = new ww_makeRenwu() 
 *        //"AccA"设置为女性"AccA"第2种(男性 为 maid )
 *        rw.jl["AccA"] = ww_makeRenwu.make.feid("AccA", 2) 
 *        //保存人物数据到 Actor1 的 0 号人物(即系统默认的 哈罗德)  
 *        ww_makeRenwu.baocun.sxall(rw,"Actor1",0)
 *   
 *-------------------------------------------
 * 
 *   随机人物设置
 *
 *   随机表  ww_makeRenwu.data.sjb
 *   	
 *
 *   lxlist  种类随机表 
 *       举例 : 
 *             "AccA":[1,2,3,5,9]  类型 1,2,3,5,9 中随机 
 *       为空时调用 lx 
 *   lx 确定类型 
 *       0 空缺  
 *       - (负数)包含空缺 
 *       1 女 2 男 3 男女都有　
 *       >=4 男女种类如果有的话一致
 *       举例: 
 *            "AccA":-3  包含 空缺的男女都可的随机
 *              
 *   yslist 颜色随机表 
 *	     hsl2 参数 h s l    hsl转化到的值
 *       rgba 参数 r g b a  rgba增加值
 *       hsla 参数 h s l a  hsla增加值
 *       举例  "#F9C19D":[{"hsl2":{"h":100}} 皮肤颜色转换为 h 值 100 (大略转换)
 *  计算概率时默认每个都为1
 *  如果lxgl ,ysgl 中有设置的话,那一项为gl中的值,
 *
 *  检查表 ww_makeRenwu.data.jiancha
 *      0 必须空缺  
 *      - (负数)允许空缺 
 *      1 必须女 2 必须男 3 男女都可
 *      >=4 男女种类如果有的话必须一致
 *

 *=============================================================================
 *
 *  其他方法: 
 *  ww_makeRenwu.clone(obj) 借助JOSN复制一个对象
 *  
 *  人物数据记录:
 *  ww_makeRenwu.save.save() 保存记录的人物数据 
 *  ww_makeRenwu.save.load() 读取保存的人物记录 
 * 	ww_makeRenwu.save.addjc(path,id) 
 *     添加记录人物数据时ImageManager内path图片的情况到记录 
 *     path 位置, id = 1 系统已经读取图片
 *  ww_makeRenwu.save.addrw =function (ww_make,filename,index) 
 *     添加人物数据到记录 (人物数据,文件名,编号)
 *  ww_makeRenwu.save.clear()  清除人物数据记录 
 *
 *
 *
 *  
 *=============================================================================
 *  
 *  其他:
 *  大概可以支持更多图层 具体在 ww_makeRenwu.data 下修改 
 *
 *  注:Scene_makeRenwu界面什么的没有优化,写的很烂,可以自己修改....
 *
 *=============================================================================
 *
 *  注意: 人物保存生成时 是直接以 ImageManager._cache[key] 进行修改,
 *        如果没有会生成一个空白文件作为  ImageManager._cache[key] ,
 *        额,虽然也可以先尝试读取,如果不行再生成空白文件,但看起来得不偿失
 *        所以如果是修改原有的 图片(行走图,脸图,战斗图),建议把图片 先调用后再调用本方法(比如菜单那里的脸图)
 *        不过,处理时会先读取一遍$gameParty里角色的行走图,脸图,战斗图,不过不能保证不出意外
 *
 *=============================================================================
 *
 *  可能脚本冲突部分: 
 *  ImageManager._cache
 *  Scene_Title.prototype.initialize
 *  DataManager.makeSaveContents
 *  DataManager.extractSaveContents 
 *  $gameVariables._data[dataid]
 * 
 *=============================================================================
 */


//=============================================================================
// 
//           检查/建立必要文件夹 (可删除)
//
//=============================================================================

(function(){
    var fs = require('fs');	
    var path_name = PluginManager.parameters("ww_makeRenwu")["path_name"]
 	var weizhi_name = path_name || 'chucun';
    var weizhi = '/' + weizhi_name + '/';
 	var dirpath = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, weizhi);
    if (dirpath.match(/^\/([A-Z]\:)/)) {
        dirpath = dirpath.slice(1);
    }
    var dirpath = decodeURIComponent(dirpath);
    if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath);
    }
	var fpath = window.location.pathname.replace(/(\/|)\/[^\/]*$/,"/img/Generator0" );
		if (fpath.match(/^\/([A-Z]\:)/)) {
			fpath = fpath.slice(1);
		}
	fpath = decodeURIComponent(fpath);
	if (!fs.existsSync(fpath)) {
            fs.mkdirSync(fpath);
    }
	var tpath = window.location.pathname.replace(/(\/|)\/[^\/]*$/,"/img/Generator" );
	if (tpath.match(/^\/([A-Z]\:)/)) {
		tpath = tpath.slice(1);
	}
	tpath = decodeURIComponent(tpath);
	if (!fs.existsSync(tpath)) {
            fs.mkdirSync(tpath);
    }
	var fm = { "/Female":"Female","/Male":"Male"}
	var key = {"FG":"/Face","TV":"/TV","SV":"/SV", "TVD":"/TVD", "icon":"/Variation"};
	for(var i in fm){
		var path1 = fpath + i
		if (!fs.existsSync(path1)) {
           fs.mkdirSync(path1);
        }
    }
	for (var i in key){
		var path1 = tpath + key[i]
		if (!fs.existsSync(path1)) {
                fs.mkdirSync(path1);
        }
		for(var i2 in fm){
			var path1 = tpath + key[i] +  i2
			if (!fs.existsSync(path1)) {
	                fs.mkdirSync(path1);
	        }
        }
	}
})()
 

//=============================================================================
// 
//            制作工具方法 
//
//=============================================================================


 
function ww_makeRenwu() {
	this.initialize.apply(this, arguments);
}

(function() {
	

//=============================================================================
// 制作工具
//=============================================================================	

	//数据克隆
	ww_makeRenwu.clone =function (obj) {
		return  JSON.parse(JSON.stringify(obj))
	}
    //随机人物数据
	ww_makeRenwu.new = function (sjid) {
		var ww_make = new ww_makeRenwu() 
		return ww_makeRenwu.make.new(ww_make,sjid)
	}
	//随机人物图片(8)
	ww_makeRenwu.newRenwu = function (name,sjid) {
		for (var i =0 ;i<8;i++){
			var ww = ww_makeRenwu.new(sjid)
			ww_makeRenwu.baocun.sxall(ww,name,i)
		}
	}


//=============================================================================
// 初始化人物数据
//=============================================================================

	ww_makeRenwu.prototype.constructor = ww_makeRenwu;
	ww_makeRenwu.prototype.initialize = function() {
		this.jl = ww_makeRenwu.clone(ww_makeRenwu.data.ijl)
		this.cjl = {}
	}
	
//=============================================================================
// 图片管理器
//=============================================================================
	ww_makeRenwu.imageManager = {}
	ww_makeRenwu.imageManager._cache = {}
	//全部清除
	ww_makeRenwu.imageManager.clear = function () {
		ww_makeRenwu.imageManager._cache = {}
	} 
	
    //读取图片(返回一个图片的克隆)
    ww_makeRenwu.imageManager.load = function (path) {
	    var bitmap  = new Bitmap();
	    bitmap._isLoading = true;
		if (!ww_makeRenwu.imageManager._cache[path]) {
		 	ww_makeRenwu.imageManager._cache[path] = Bitmap.load(path);
		}
		var bitmap_c = ww_makeRenwu.imageManager._cache[path]
		bitmap_c.addLoadListener(
			function() {
				bitmap.resize(bitmap_c.width, bitmap_c.height)
				bitmap.blt(bitmap_c,0,0,bitmap_c.width,bitmap_c.height,0,0,bitmap_c.width,bitmap_c.height)
				bitmap._isLoading = false
				bitmap._callLoadListeners();
			}
		);
		return bitmap
    }
    
//=============================================================================
// 存档工具
//=============================================================================
	ww_makeRenwu.save = {}
	ww_makeRenwu.save.id = parseInt(PluginManager.parameters("ww_makeRenwu")["dataid"], 10);
	ww_makeRenwu.save.data = {"jc":{},"rw":{}}
	
	ww_makeRenwu.save.clear =function () {
		ww_makeRenwu.save.data = {"jc":{},"rw":{}}
		var id = ww_makeRenwu.save.id ||0
		$gameVariables._data[id] = JSON.stringify(ww_makeRenwu.save.data)
	}
	
	ww_makeRenwu.save.save =function () {
		var id = ww_makeRenwu.save.id ||0
		$gameVariables._data[id] = JSON.stringify(ww_makeRenwu.save.data)
	}
	ww_makeRenwu.save.load =function () {
		var id = ww_makeRenwu.save.id ||0
		if( $gameVariables._data[id] ){
			ww_makeRenwu.save.data = JSON.parse( $gameVariables._data[id] )
		}
		ww_makeRenwu.save.loadall()
	}

	//标题画面初始化
	Scene_Title.prototype.initialize = function() {
		ww_makeRenwu.save.Titleclear()
	    Scene_Base.prototype.initialize.call(this);
	};

	ww_makeRenwu.save.Titleclear =function () {
		ww_makeRenwu.save.clear()
		for (var key in  ImageManager._cache){
			if (key.indexOf('img/system/')<0){
				delete(ImageManager._cache[key])
			}
		}
	}

	//生成保存目录
	DataManager.makeSaveContents = function() {
		ww_makeRenwu.save.save()
	    // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
	    var contents = {};
	    contents.system       = $gameSystem;
	    contents.screen       = $gameScreen;
	    contents.timer        = $gameTimer;
	    contents.switches     = $gameSwitches;
	    contents.variables    = $gameVariables;
	    contents.selfSwitches = $gameSelfSwitches;
	    contents.actors       = $gameActors;
	    contents.party        = $gameParty;
	    contents.map          = $gameMap;
	    contents.player       = $gamePlayer;
	    return contents;
	};
	//提取保存目录
	DataManager.extractSaveContents = function(contents) {
	    $gameSystem        = contents.system;
	    $gameScreen        = contents.screen;
	    $gameTimer         = contents.timer;
	    $gameSwitches      = contents.switches;
	    $gameVariables     = contents.variables;
	    $gameSelfSwitches  = contents.selfSwitches;
	    $gameActors        = contents.actors;
	    $gameParty         = contents.party;
	    $gameMap           = contents.map;
	    $gamePlayer        = contents.player;
	    ww_makeRenwu.save.load()
	};

	
	ww_makeRenwu.save.addjc =function (path,id) {
		var id = id || 2
		var jc = ww_makeRenwu.save.data.jc
		jc[path]=  jc[path] || id
		
	}
	
	ww_makeRenwu.save.addrw =function (ww_make,filename,index) {
		var rw = ww_makeRenwu.save.data.rw
		rw[filename]= rw[filename] || {}
		rw[filename][index] = ww_make
	}

	
	ww_makeRenwu.save.loadall =function () {
		var rw = ww_makeRenwu.save.data.rw
		var jc = ww_makeRenwu.save.data.jc
		for(var i in  jc){
			if (jc[i] == 1){
				ww_makeRenwu.save.loadjc(i,1)
			}else{
				ww_makeRenwu.save.loadjc(i,2)
			}
		}
		for(var i in  rw){
			for(var i2 in rw[i]){
				ww_makeRenwu.save.loadrw(rw[i][i2],i,i2)
			}
		}
	}

	ww_makeRenwu.save.loadjc =function (path,id) {
		var key = path + ':' + 0;
		if(id == 1){
		    var bitmap = Bitmap.load(path);
			ImageManager._cache[key] = bitmap;			
		}else{
			delete(ImageManager._cache[key])
		}
	}
	
	ww_makeRenwu.save.loadrw =function (ww_make,filename,index) {
		ww_makeRenwu.baocun.sxall(ww_make,filename,index)
	}

//=============================================================================
// 保存工具
//=============================================================================
	ww_makeRenwu.baocun = {}
	
	ww_makeRenwu.baocun.sxall = function(ww_make,filename,index) {
		//读取菜单需要的脸图(防止没有在载入脸图时会建立空白脸图)
		ww_makeRenwu.baocun.loadMenuStatusImages()
		
		var index = index * 1
		//储存人物数据
		ww_makeRenwu.save.addrw(ww_make,filename,index)
		
		ww_makeRenwu.baocun.sxface(ww_make,filename,index)
		ww_makeRenwu.baocun.sxtv(ww_make,filename,index)
		ww_makeRenwu.baocun.sxtvd(ww_make,filename,index)
		ww_makeRenwu.baocun.sxsv(ww_make,filename,index)
		
		// 1 秒后 刷新场景)(处理脸图改变后菜单窗口不改变问题)
		setTimeout(ww_makeRenwu.baocun.sxscene ,1000) 
	}


	//读取菜单需要的脸图(防止没有在载入脸图时会建立空白脸图)
	ww_makeRenwu.baocun.loadMenuStatusImages = function() {
	    $gameParty.members().forEach(function(actor) {
	        ImageManager.loadSvActor(actor.battlerName());
	    }, this);		
	    $gameParty.members().forEach(function(actor) {
	        ImageManager.loadFace(actor.faceName());
	    }, this);
	    $gameParty.members().forEach(function(actor) {
	        ImageManager.loadCharacter(actor.characterName());
	    }, this);
	};

	//刷新场景
	ww_makeRenwu.baocun.sxscene = function() {
		if(SceneManager && SceneManager._scene){
			if(SceneManager._scene.refresh){SceneManager._scene.refresh()}
		    ww_makeRenwu.baocun.sxchild(SceneManager._scene)
		}
	};
	ww_makeRenwu.baocun.sxchild = function(childs) {
		childs.children.forEach(
			function(child) {
		        if (child.refresh) {
		            child.refresh();
		        }
		        ww_makeRenwu.baocun.sxchild(child)
		    }
		)
	};

	
	ww_makeRenwu.baocun.sxface = function(ww_make,filename,index) {
		var badds = ww_makeRenwu.make.makeFace(ww_make)
		var bitmap = ww_makeRenwu.bitmap.makeRenwu(badds)
		bitmap.addLoadListener(
			function() {
	        	ww_makeRenwu.baocun.Face(bitmap,filename,index)
	        }
	    );
	}
	
	ww_makeRenwu.baocun.sxtv = function(ww_make,filename,index) {
		var badds = ww_makeRenwu.make.makeTV(ww_make )
		var bitmap = ww_makeRenwu.bitmap.makeRenwu(badds)
		bitmap.addLoadListener(
			function() {
	        	ww_makeRenwu.baocun.TV(bitmap,filename,index)
	        }
	    );
	}
	
	ww_makeRenwu.baocun.sxsv = function(ww_make,filename,index) {
		var badds = ww_makeRenwu.make.makeSV(ww_make )
		var bitmap = ww_makeRenwu.bitmap.makeRenwu(badds)
		bitmap.addLoadListener(
			function() {
	        	ww_makeRenwu.baocun.SV(bitmap,filename,index)
	        }
	    );
	}
	
	ww_makeRenwu.baocun.sxtvd= function(ww_make,filename,index) {
		var badds = ww_makeRenwu.make.makeTVD(ww_make)
		var bitmap = ww_makeRenwu.bitmap.makeRenwu(badds)
		bitmap.addLoadListener(
			function() {
	        	ww_makeRenwu.baocun.TVD(bitmap,filename,index)
	        }
	    );
	}
	
	ww_makeRenwu.baocun.Face = function (bitmap,filename,index){
        var path = 'img/faces/' + filename + '.png';
        var bitmap2 = ww_makeRenwu.baocun.loadBitmap(path,"Face");
	    var sx = 0
	    var sy = 0
	 	var sw = bitmap.width;
	    var sh = bitmap.height; 
	    var dx = index % 4 * bitmap.width;
	    var dy =  Math.floor(index / 4) * bitmap.height
	    var dw = bitmap.width
	    var dh = bitmap.height
        bitmap2.addLoadListener(function() {
	        bitmap2.clearRect(dx,dy,dw,dh)
            bitmap2.blt(bitmap, sx,sy,sw,sh,dx,dy,dw,dh);
            ww_makeRenwu.baocun.SavePng( bitmap2,"" +filename+'_face' +'.png' )
        });
		return bitmap2;
	}
	
	ww_makeRenwu.baocun.TV = function (bitmap,filename,index){
        var path = 'img/characters/' + filename + '.png';
        var bitmap2 = ww_makeRenwu.baocun.loadBitmap(path,"TV");
	    var sx = 0
	    var sy = 0
	 	var sw = bitmap.width;
	    var sh = bitmap.height; 
	    var dx = index % 4 * bitmap.width;
	    var dy =  Math.floor(index/ 4) * bitmap.height
	    var dw = bitmap.width
	    var dh = bitmap.height
        bitmap2.addLoadListener(function() {
	        bitmap2.clearRect(dx,dy,dw,dh)
            bitmap2.blt(bitmap, sx,sy,sw,sh,dx,dy,dw,dh);
            ww_makeRenwu.baocun.SavePng( bitmap2,"" +filename +'_tv' +'.png' )
        });
		return bitmap2;
	}
	
	ww_makeRenwu.baocun.TVD = function (bitmap,filename,index){
        var path = 'img/characters/' + filename + '_tvd' + '.png';
        var bitmap2 = ww_makeRenwu.baocun.loadBitmap(path,"TVD");
	    var sx = 0
	    var sy = 0
	 	var sw = bitmap.width;
	    var sh = bitmap.height; 
	    var dx = Math.floor(index / 4) *bitmap.width;
	    var dy = index % 4 * bitmap.height
	    var dw = bitmap.width
	    var dh = bitmap.height
        bitmap2.addLoadListener(function() {
	        bitmap2.clearRect(dx,dy,dw,dh)
            bitmap2.blt(bitmap, sx,sy,sw,sh,dx,dy,dw,dh);
            ww_makeRenwu.baocun.SavePng( bitmap2, "" +filename +'_tvd'+ '.png' )
        });
		return bitmap2;
	}
	
	ww_makeRenwu.baocun.SV = function (bitmap,filename,index){
		var i = index + 1 
        var path = 'img/sv_actors/' + filename + "_"+i+ '.png';
        var bitmap2 = ww_makeRenwu.baocun.loadBitmap(path,"SV");
	    var sx = 0
	    var sy = 0
	 	var sw = bitmap.width;
	    var sh = bitmap.height; 
	    var dx = 0
	    var dy = 0
	    var dw = bitmap.width
	    var dh = bitmap.height
        bitmap2.addLoadListener(function() {
	        bitmap2.clearRect(dx,dy,dw,dh)
            bitmap2.blt(bitmap, sx,sy,sw,sh,dx,dy,dw,dh);
            ww_makeRenwu.baocun.SavePng( bitmap2, "" + filename+ "_"+i + '_sv' +'.png' )
        });
		return bitmap2;
	}
	
    ww_makeRenwu.baocun.loadBitmap = function(path,zl) {
	    var key = path + ':' + 0;
	    var zl = zl || 0 
	    var w = 0
	    var h = 0
	    if (!ImageManager._cache[key]) {
		    if (zl == "Face"){
        		w = 144 * 4
        		h = 144 * 2	
		    }else{
			    w = 144 * 4
				h = 192 * 2
		    }
		    var bitmap = new Bitmap(w,h);
            ww_makeRenwu.save.addjc(path,2)
	        ImageManager._cache[key] = bitmap;
	    }else{
		    ww_makeRenwu.save.addjc(path,1)
	    }
	    return ImageManager._cache[key];
	};
    ww_makeRenwu.baocun.path_name = PluginManager.parameters("ww_makeRenwu")["path_name"];

    //文件夹位置
    ww_makeRenwu.baocun.dirPath = function(name) {

            var weizhi_name = name || this.path_name || 'chucun';
            var weizhi = '/' + weizhi_name + '/';

            var path = window.location.pathname.replace(/(\/www|)\/[^\/]*$/, weizhi);
            if (path.match(/^\/([A-Z]\:)/)) {
                    path = path.slice(1);
            }
            
            var dirpath = decodeURIComponent(path);
            
            var fs = require('fs');
            if (!fs.existsSync(dirpath)) {
                fs.mkdirSync(dirpath);
            }
            return dirpath;
    }


    //保存图片到png格式(图片,文件名,文件夹名)
    ww_makeRenwu.baocun.SavePng = function(bitmap, name, wzname) {

            var name = name || 'tupian.png';
            if (!bitmap || !bitmap.canvas) {
                    return bitmap
            };
            
            var imgData = bitmap.canvas.toDataURL();
            var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = new Buffer(base64Data, 'base64');

            var filePath = this.dirPath(wzname) + name;

            var fs = require("fs");
            fs.writeFile(filePath, dataBuffer, function(err) {
                    if (err) {
                            return false;
                    } else {
                            return true;
                    }
            });

            return imgData;
    }

    //无用产物...
    ww_makeRenwu.baocun.getHouZhui = function() {
            var myDate = new Date();
            var ye = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
            var mo = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
            var d = myDate.getDate(); //获取当前日(1-31)
            var h = myDate.getHours(); //获取当前小时数(0-23)
            var m = myDate.getMinutes(); //获取当前分钟数(0-59)
            var s = myDate.getSeconds(); //获取当前秒数(0-59)
            var ms = myDate.getMilliseconds(); //获取当前毫秒数(0-999)

            var houzhui = '';
            if (arguments[0]) {
                    houzhui += ye + '-' + (mo + 1) + '-' + d + '-' + h + '-' + m + '-' + s + '-' + ms;
            } else {
                    houzhui += ye + '' + (mo + 1) + '' + d + '' + h + '' + m + '' + s + '' + ms;
            };
            return houzhui;
    }



//=============================================================================
// 人物数据制作(核心)
//=============================================================================

	ww_makeRenwu.make ={}


	//制作随机人物(人物数据,随机表id)
    ww_makeRenwu.make.new = function (obj,sjid) {
	    var obj2 = new ww_makeRenwu()
	    var jl = obj2.jl
	    var cjl= obj2.cjl
	    var sjid = sjid || 0
	    
	    var sjb = ww_makeRenwu.data.sjb[sjid]|| ww_makeRenwu.data.sjb[0]
			sjb = ww_makeRenwu.clone(sjb)
	    var lx = sjb.lx
	    var lxlist = sjb.lxlist
	    var lxgl = sjb.lxgl
	    var yslist = sjb.yslist 
	    var ysgl= sjb.ysgl
	    
	    var k = 0
	    //随机类型
	    do 
	    {   k +=1
		    var bc = 0
		    var ty = {}
		    for (var zlm in jl){
			    if(lxlist && (zlm in lxlist) && lxlist[zlm].length>0){
				    var list = lxlist[zlm]
			    }else if(lx && (zlm in lx)){
				 	var list2 = ww_makeRenwu.make.dulxlist(zlm)
				 	var lxid= lx[zlm]
				 	if (lxid >= 4 || lxid <= -4){
					 	var tyid = Math.abs(lxid)
					 	ty[tyid] = ty[tyid] || (Math.randomInt(2)+1) * (lxid / tyid)
					 	lxid = ty[tyid]
					}
				 	var list = ww_makeRenwu.make.dulxlist2(list2,lxid)
			    }else{
				    continue
			    }
			 	var leng = 0
			 	if( lxgl && (zlm in lxgl)  && lxgl[zlm].length >0 ){
				 	for (var i = 0;i< lxgl[zlm].length;i++ ){
					    leng += lxgl[zlm][i] || 0 
				 	}
				 	var leng2 = leng
				 	leng += (list.length - lxgl[zlm].length > 0 )? list.length - lxgl[zlm].length : 0 
				 	leng = leng || 0
					var sjs = Math.randomInt(leng) +1
					var id 
					if (sjs  > leng2 ){
						id = sjs - leng2 + lxgl[zlm].length 
					}else{
						var last = 0
						for (var i = 0;i< lxgl[zlm].length;i++ ){
							last += lxgl[zlm][i] || 0 
							if( sjs  <= last ){
								id = i
							}
						}
					}
			 	}else{
				 	leng = list.length
				 	leng = leng || 0
					var id =  Math.randomInt(leng)+1
			 	}
			 	jl[zlm] = list[id-1] 
			}
		}while( k <100 && ww_makeRenwu.make.jiancha(obj2,1) != "true" )
		if (k == 100){ jl =ww_makeRenwu.clone(ww_makeRenwu.data.ijl )}
			
		//随机颜色
		if (yslist){
			for (var zlm in yslist){
				if(yslist[zlm].length>0){
					var leng = 0
				 	if( ysgl &&　zlm in ysgl && ysgl[zlm].length >0){
					 	for (var i = 0;i< ysgl[zlm].length;i++ ){
						    leng += ysgl[zlm][i] || 0 
					 	}
					 	var leng2 = leng
					 	leng += (yslist[zlm].length - ysgl[zlm].length > 0 )? yslist[zlm].length - ysgl[zlm].length : 0 
					 	leng = leng || 0
						var sjs = Math.randomInt(leng) +1
						var id 
						if (sjs  > leng2 ){
							id = sjs - leng2 + ysgl[zlm].length 
						}else{
							var last =0
							for (var i = 0;i< ysgl[zlm].length;i++ ){
								last += ysgl[zlm][i] || 0 
								if( sjs  <= last ){
									id = i
								}
							}
						}
				 	}else{
					 	leng = yslist[zlm].length
					 	leng = leng || 0
						var id =  Math.randomInt(leng)+1
				 	}
				 	if(yslist[zlm][id-1]){
					 	cjl[zlm] = yslist[zlm][id-1]
				 	}
				}
			}
		}
		
        obj.jl = jl
        obj.cjl=cjl
	    return obj
    }
    
	//读取种类名
	ww_makeRenwu.make.duzl = function (zl) {
		var zlm = "nil"
		if ( ww_makeRenwu.tool.wjlbloaded && !ww_makeRenwu.tool.wjlbonerror ){
			if (ww_makeRenwu.data.zhongleibiao[zl] && ww_makeRenwu.data.zhongleibiao[zl][1]) {
				zlm = ww_makeRenwu.data.zhongleibiao[zl][1]
			}
		}else if ( ww_makeRenwu.tool.wjlbloaded && ww_makeRenwu.tool.wjlbonerror){
			zlm = "err"
		}
		return zlm
	}
	
	//读取类型列表
	ww_makeRenwu.make.dulxlist  = function (zlm) {
	    var list =[]
	    
		if (zlm =="Body"){
			var vari = ww_makeRenwu.data.wjlb.Face
		    if(  zlm  in  vari ){
			    for (var i in vari[zlm]){
				    for (var i2 in vari[zlm][i]){
					    list.push([i,i2])
				    }
			    }
		    }
		}else{
		    var vari = ww_makeRenwu.data.wjlb.Variation
		    if(  zlm  in  vari ){
			    for (var i in vari[zlm]){
				    for (var i2 in vari[zlm][i]){
					    list.push([i,i2])
				    }
			    }		    
		    }			
		}
	    list.sort()  
	    list.unshift(["","nil"])  	
		return list;
	}
	//读取类型列表(随机人物使用)
	ww_makeRenwu.make.dulxlist2 = function (list,pd) {
		var list = list 
		var list2 =[]
		var pd = pd || 0
		if (pd <=0){
			list2.push(0)
			pd = Math.abs(pd)
		}
		for (var i = 0;i< list.length ;i++ ){
			if(pd == 1 || pd == 3 ){
				if(list[i][0]== "Female"){
					list2.push(i)
				}
			}
			if(pd == 2 || pd == 3){
				if(list[i][0]== "Male"){
					list2.push(i)
				}
			}
		}
		return list2
	}
	//读取男女类型id
	ww_makeRenwu.make.lxfmid = function (zlm,pd,id) {
		var list = ww_makeRenwu.make.dulxlist(zlm) 
		var list2 = ww_makeRenwu.make.dulxlist2(list,pd) 
		return list2[id]
	}

	//读取女性类型id
	ww_makeRenwu.make.feid = function (zlm,id) {
		return ww_makeRenwu.make.lxfmid(zlm,-1,id)
	}
	//读取男性类型id
	ww_makeRenwu.make.maid = function (zlm,id) {
		return ww_makeRenwu.make.lxfmid(zlm,-2,id)
	}
	
	//读取男女
	ww_makeRenwu.make.isfm  = function (zlm,sj) {
		var list = ww_makeRenwu.make.dulxlist(zlm)
		if (list[sj]){
			if(list[sj][0]=="Female" ){
				return 1
			}else if(list[sj][0]=="Male") {
				return 2
			}
		}
		return 0;
	} 

    // 检查是否符合
	ww_makeRenwu.make.jiancha  = function (obj,jcid) {
		var jl = obj.jl
		var jcid = jcid || 0 
		var jclog = ""
		var jc = ww_makeRenwu.data.jiancha[jcid]
		var ty ={}
			ty.fm ={}
		    ty.log={}
		    ty.log2={}
		if(jc){
			for (var i in jc){
				if (i in jl){
					var fm = ww_makeRenwu.make.isfm(i,jl[i])
					if(fm == 0 && jc[i] >0 ){
						jclog += i + "  不能空缺\n"
					}
					if(jc[i] == 0){
						jclog += i + "  必须空缺\n"
					}else if(jc[i]==1 || jc[i] == -1){
					 	if (fm != 1){jclog += i  + "  必须为女\n"} 
					}else if(jc[i]==2 || jc[i] == -2){
						if (fm != 2){jclog += i  + "  必须为男\n"} 
					}else if(jc[i]==3 || jc[i] == -3 ){
					}else if(jc[i]>= 4 || jc[i]<= -4){
					 	var tyid = Math.abs(jc[i])
					 	ty.fm[tyid] = ty.fm[tyid] || fm || 0
					 	ty.log[tyid] = ty.log[tyid] || []
					 	ty.log[tyid].push(i)
					 	ty.log2[tyid] = ty.log2[tyid] || (fm !=0 && ty.fm[tyid] !=0 && fm != ty.fm[tyid])
					}
				}else{
					jclog+= i + "  数据不足\n"
				}
			}
			for(var tyid in ty.log2){
				if(ty.log2[tyid]){
					jclog += ty.log[tyid].join(",") + "  需要男女一致\n"
				}
			}
		}
		if (jclog == "" ){
			jclog ="true"
		}
		return  jclog
	}
	
	//制作判定
	ww_makeRenwu.make.makepd =function (pd) {
	    var pd = pd
		var rgb= {}
		var r = parseInt( pd.slice(1,3) ,16 )
		rgb.r = new Function ( "i","if(i == "+r+"){return true}else{return false}" );
		var g = parseInt( pd.slice(3,5) ,16  )
	    rgb.g = new Function ( "i","if(i == "+g+"){return true}else{return false}" );
        var b = parseInt( pd.slice(5,7) ,16 )
	    rgb.b = new Function ( "i","if(i == "+b+"){return true}else{return false}" );
		return  rgb
	}
	//制作颜色键
	ww_makeRenwu.make.duyskey =function (zlm,lx,ys) {
		var zlm = zlm
		var lx = lx 
		var ys = ys
		var key
		if(zlm &&　(zlm in ww_makeRenwu.data.icolor)){
			var list = ww_makeRenwu.data.icolor[zlm]
		    //key = ""+ zlm +","+lx +","+list[ys].pd
			key =  ""+list[ys].pd //+"," +lx
		}
		return key
	} 

	
	//制作Face
	ww_makeRenwu.make.makeFace = function (new_ww) {
		//人物数据//
		var jl = new_ww.jl;
		var cjl = new_ww.cjl;		
		//基础数据//
		//元种类颜色表
		var ic = ww_makeRenwu.data.icolor;
		//独立基础数据//
		badds =[];
		badds.width = 144;
		badds.height = 144;
		//文件列表
		var wjlb = ww_makeRenwu.data.wjlb.Face;
		//次序表
		var cxlist = ww_makeRenwu.data.cxlist.Face
		//次序对应表
        var keylist = ww_makeRenwu.data.keylist.Face

		//基础位置
		var path  = "img/Generator/Face";
		//基础名称
		var name = "FG_";
		//循环次序表
		for ( var i=0 ;i < cxlist.length;i++ ){
			var	cxm =  cxlist[i]
			if ( cxm in wjlb){
				var zlm = keylist[cxm]
				if ( zlm =="nil"  ){
				}else if(zlm == "err"){
				}else{
					if (zlm in  jl ){ 
						//种类类型
						var lx = jl[zlm]
						//不是空白时 
						if (lx!=0){
							//读取种类表						
							var list = ww_makeRenwu.make.dulxlist(zlm)						
							//类型数据
							var p =  list[lx]
							//如果 数据 ,位置 ,名称 存在
							if (p && p[0] && p[1]){
								//类型数据 位置			
								var ph = path + "/"+ p[0]+"/"
								//类型数据 名称
								var pn = name + cxm +"_p" + p[1]
								//类型 层 表
								var pc = []
								//添加 类型的所有层
								for ( var cm in wjlb[cxm][p[0]][p[1]]){
									pc.push( wjlb[cxm][p[0]][p[1]][cm] )
								}
								//排序 , 倒序
								pc.sort()
								pc.reverse()
								//循环 层
								for ( var ci=0 ;ci< pc.length ;ci++ ){
									//层名
									var cn = pn + pc[ci]
									var badd = {}
									//添加图片名 = 位置 + 层名  
									badd.bitmap = ph + cn + ".png"
									//如果 种类 在 颜色表里
									if (zlm in ic) {
										//循环 颜色表[种类]
										for (var ici = 0 ;ici<ic[zlm].length;ici++){
											//k = 制作颜色键
											var k = ww_makeRenwu.make.duyskey(zlm,lx,ici)
											//如果 颜色键 在 颜色记录中 并且 颜色表[种类][某个]后缀 存在
											if ((k  in cjl) && ic[zlm][ici].hz  ){
												//如果文件 有 该后缀
												if (pc[ci].contains( ic[zlm][ici].hz)){
													//创建改变
													var changes = []
													//如果hsl2 
													if( cjl[k].hsl2){
														var change = {}
														change.pd = {
															"a":function(i){
																if(i !=0){
																	return true
																}else{
																	return false
																}
															}
														}
													    change.hsl2= cjl[k].hsl2
													    changes.push(change)
													}
													//如果rgba
												    if( cjl[k].rgba){
													    var change = {}
													    change.rgba= cjl[k].rgba
													    changes.push(change)
													}
													//如果 hsla
													if( cjl[k].hsla){
														var change = {}
													    change.hsla= cjl[k].hsla
													    changes.push(change)
													}
													//badd颜色改变
													badd.change=changes
												}
											}
										}
									}
									badds.push(badd)
								}
							}
						}
					}
				}
			}
		}
		return badds
	}


	//制作TV
	ww_makeRenwu.make.makeTV = function (new_ww) {
		//人物数据//
		var jl = new_ww.jl;
		var cjl = new_ww.cjl;		
		//基础数据//
		//元种类颜色表
		var ic = ww_makeRenwu.data.icolor;
		//独立基础数据//
		badds =[]
		badds.width = 144
		badds.height = 192		
		//文件列表
		var wjlb = ww_makeRenwu.data.wjlb.TV
		//次序表
		var cxlist = ww_makeRenwu.data.cxlist.TV
		//次序对应表
		var keylist = ww_makeRenwu.data.keylist.TV
		//基础位置
		var path  = "img/Generator/TV"
		//基础名称
		var name = "TV_" 
		//循环 次序表	
		for ( var i=0 ;i < cxlist.length;i++ ){
			//次序名
			var	cxm =  cxlist[i]
			if ( cxm in wjlb){
				var zlm = keylist[cxm]
				if ( zlm =="nil"  ){
				}else if(zlm == "err"){
				}else{
					if (zlm in  jl ){ 
						//读取类型
						var lx =  jl[zlm] 
						//如果类型 不为 0 
						if (lx!=0){
							//读取种类表
							var list = ww_makeRenwu.make.dulxlist(zlm)
							//读取 类型数据
							var p =  list[lx]
							//如果 类型 位置 名称 存在
							if (p && p[0] && p[1]){
								//如果 tv次序层 位置 存在 并且  tv次序层 位置 名称 存在
								if (wjlb[cxm][p[0]] && wjlb[cxm][p[0]][p[1]]){
									//类型位置
									var ph = path + "/"+ p[0]+"/"
									//类型名
									var pn = name + cxm +"_p" + p[1]
									var badd = {}
									//层数
									for ( var cm in wjlb[cxm][p[0]][p[1]]){
										//后缀
										var hz =  wjlb[cxm][p[0]][p[1]][cm]
										if (hz ==""){
											//层名
											var cn = pn + hz
											//位置 + 层名
											badd.bitmap = ph + cn + ".png"
										}else if( hz == "_c"){
											//层名
											var cn = pn + hz
											//位置 + 层名 
											badd.bitmap_c = ph + cn + ".png"
											var changes = []
											for (var ici =0 ;ici<ic[zlm].length;ici++){
												//颜色键
												var k = ww_makeRenwu.make.duyskey(zlm,lx,ici)
												//如果颜色键 在 颜色记录 中 并且 存在pd
												if ((k  in cjl)&&  ic[zlm][ici].pd ){
													//如果 hsl2 改变
													if( cjl[k].hsl2){
														var change = {}
														change.pd = ww_makeRenwu.make.makepd(ic[zlm][ici].pd)
													    change.hsl2 = cjl[k].hsl2
													    changes.push(change)
													}
													//如果 rgba 改变	
													if( cjl[k].rgba){
														var change = {}
														change.pd = ww_makeRenwu.make.makepd(ic[zlm][ici].pd)
														change.rgba= cjl[k].rgba
														changes.push(change)
													}  
													//如果 hsla 改变 
													if( cjl[k].hsla){
														var change = {}
													    change.pd = ww_makeRenwu.make.makepd(ic[zlm][ici].pd)
													    change.hsla= cjl[k].hsla
													    changes.push(change)
													}
												}
											}
											//badd 颜色改变
											badd.change_c=changes
										}
									}
									//添加一个badd
									badds.push(badd)
								}	
							}
						}
					}
				}
			}
		}								   
		return badds
	}
	
	//制作SV
	ww_makeRenwu.make.makeSV = function (new_ww) {
		//人物数据//
		var jl = new_ww.jl;
		var cjl = new_ww.cjl;		
		//基础数据//
		//元种类颜色表
		var ic = ww_makeRenwu.data.icolor;
		//独立基础数据//		
		badds =[]
		badds.width = 576
		badds.height = 384	
		//文件列表
		var wjlb = ww_makeRenwu.data.wjlb.SV
		//次序表
		var cxlist = ww_makeRenwu.data.cxlist.SV
		//次序对应表
		var keylist = ww_makeRenwu.data.keylist.SV
		//基础位置
		var path  = "img/Generator/SV"
		//基础名称
		var name = "SV_" 	
		//循环 次序表	
		for ( var i=0 ;i < cxlist.length;i++ ){
			//次序名
			var	cxm =  cxlist[i]
			if (cxm in wjlb){
				var zlm = keylist[cxm]
				if ( zlm =="nil"  ){
				}else if(zlm == "err"){
				}else{
					if (zlm in  jl ){ 
						//读取类型
						var lx =  jl[zlm] 
						//如果类型 不为 0 
						if (lx!=0){
							//读取种类表
							var list = ww_makeRenwu.make.dulxlist(zlm)
							//读取 类型数据
							var p =  list[lx]
							//如果 类型 位置 名称 存在
							if (p && p[0] && p[1]){
								//如果 tv次序层 位置 存在 并且  tv次序层 位置 名称 存在
								if (wjlb[cxm][p[0]] && wjlb[cxm][p[0]][p[1]]){
									//类型位置
									var ph = path + "/"+ p[0]+"/"
									//类型名
									var pn = name + cxm +"_p" + p[1]
									var badd = {}
									//层数
									for ( var cm in wjlb[cxm][p[0]][p[1]]){
										//后缀
										var hz =  wjlb[cxm][p[0]][p[1]][cm]
										if (hz ==""){
											//层名
											var cn = pn + hz
											//位置 + 层名
											badd.bitmap = ph + cn + ".png"
										}else if( hz == "_c"){
											//层名
											var cn = pn + hz
											//位置 + 层名 
											badd.bitmap_c = ph + cn + ".png"
											var changes = []
											for (var ici =0 ;ici<ic[zlm].length;ici++){
												//颜色键
												var k = ww_makeRenwu.make.duyskey(zlm,lx,ici)
												//如果颜色键 在 颜色记录 中 并且 存在pd
												if ((k  in cjl)&&  ic[zlm][ici].pd ){
													//如果 hsl2 改变
													if( cjl[k].hsl2){
														var change = {}
														change.pd = ww_makeRenwu.make.makepd(ic[zlm][ici].pd)
													    change.hsl2 = cjl[k].hsl2
													    changes.push(change)
													}
													//如果 rgba 改变	
													if( cjl[k].rgba){
														var change = {}
														change.pd = ww_makeRenwu.make.makepd(ic[zlm][ici].pd)
														change.rgba= cjl[k].rgba
														changes.push(change)
													}  
													//如果 hsla 改变 
													if( cjl[k].hsla){
														var change = {}
													    change.pd = ww_makeRenwu.make.makepd(ic[zlm][ici].pd)
													    change.hsla= cjl[k].hsla
													    changes.push(change)
													}
												}
											}
											//badd 颜色改变
											badd.change_c=changes
										}
									}
									//添加一个badd
									badds.push(badd)
								}	
							}
						}
					}
				}
			}
		}								   
		return badds
	}
	//制作TVD
	ww_makeRenwu.make.makeTVD = function (new_ww) {
		//人物数据//
		var jl = new_ww.jl;
		var cjl = new_ww.cjl;		
		//基础数据//
		//元种类颜色表
		var ic = ww_makeRenwu.data.icolor;
		//独立基础数据//		
		badds =[]
		badds.width = 144
		badds.height = 48	
		//文件列表
		var wjlb = ww_makeRenwu.data.wjlb.TVD
		//次序表
		var cxlist = ww_makeRenwu.data.cxlist.TVD
		//次序对应表
		var keylist = ww_makeRenwu.data.keylist.TVD
		//基础位置
		var path  = "img/Generator/TVD"
		//基础名称
		var name = "TVD_" 
		//循环 次序表	
		for ( var i=0 ;i < cxlist.length;i++ ){
			//次序名
			var	cxm =  cxlist[i]
			if ( cxm in wjlb){
				var zlm = keylist[cxm]
				if ( zlm =="nil"  ){
				}else if(zlm == "err"){
				}else{
					if (zlm in  jl ){ 
						//读取类型
						var lx = jl[zlm] 
						//如果类型 不为 0 
						if (lx!=0){ 
							//读取种类表
							var list = ww_makeRenwu.make.dulxlist(zlm)
							//读取 类型数据
							var p =  list[lx]
							//如果 类型 位置 名称 存在
							if (p && p[0] && p[1]){
								//如果 tv次序层 位置 存在 并且  tv次序层 位置 名称 存在
								if (wjlb[cxm][p[0]] && wjlb[cxm][p[0]][p[1]]){
									//类型位置
									var ph = path + "/"+ p[0]+"/"
									//类型名
									var pn = name + cxm +"_p" + p[1]
									var badd = {}
									//层数
									for ( var cm in wjlb[cxm][p[0]][p[1]]){
										//后缀
										var hz =  wjlb[cxm][p[0]][p[1]][cm]
										if (hz ==""){
											//层名
											var cn = pn + hz
											//位置 + 层名
											badd.bitmap = ph + cn + ".png"
										}else if( hz == "_c"){
											//层名
											var cn = pn + hz
											//位置 + 层名 
											badd.bitmap_c = ph + cn + ".png"
											var changes = []
											for (var ici =0 ;ici<ic[zlm].length;ici++){
												//颜色键
												var k = ww_makeRenwu.make.duyskey(zlm,lx,ici)
												//如果颜色键 在 颜色记录 中 并且 存在pd
												if ((k  in cjl)&&  ic[zlm][ici].pd ){
													//如果 hsl2 改变
													if( cjl[k].hsl2){
														var change = {}
														change.pd = ww_makeRenwu.make.makepd(ic[zlm][ici].pd)
													    change.hsl2 = cjl[k].hsl2
													    changes.push(change)
													}
													//如果 rgba 改变	
													if( cjl[k].rgba){
														var change = {}
														change.pd = ww_makeRenwu.make.makepd(ic[zlm][ici].pd)
														change.rgba= cjl[k].rgba
														changes.push(change)
													}  
													//如果 hsla 改变 
													if( cjl[k].hsla){
														var change = {}
													    change.pd = ww_makeRenwu.make.makepd(ic[zlm][ici].pd)
													    change.hsla= cjl[k].hsla
													    changes.push(change)
													}
												}
											}
											//badd 颜色改变
											badd.change_c=changes
										}
									}
									//添加一个badd
									badds.push(badd)
								}	
							}
						}
					}
				}
			}
		}								   
		return badds
	}

//=============================================================================
// 图片制作工具 (核心)
//=============================================================================

    ww_makeRenwu.bitmap={}

    //rgba 判定
	ww_makeRenwu.bitmap.rgba_pd = function(rgba, pd) {
		if (pd.r && typeof(pd.r)  == "function" && !pd.r(rgba[0])) {return false}
		if (pd.g && typeof(pd.g)  == "function" && !pd.g(rgba[1])) {return false}
		if (pd.b && typeof(pd.b)  == "function" && !pd.b(rgba[2])) {return false}
		if (pd.a && typeof(pd.a)  == "function" && !pd.a(rgba[3])) {return false}
		return true;
	}
    //rgba 根据 rgba 的更改
	ww_makeRenwu.bitmap.rgba_RgbaChange = function(rgba, r, g, b, a) {
		if (r) {rgba[0] = (rgba[0] + r).clamp(0, 255)}
		if (g) {rgba[1] = (rgba[1] + g).clamp(0, 255)}
		if (b) {rgba[2] = (rgba[2] + b).clamp(0, 255)}
		if (a) {rgba[3] = (rgba[3] + a).clamp(0, 255)}
		return [rgba[0], rgba[1], rgba[2], rgba[3]];
	}
    //rbga 根据hsla 的更改
	ww_makeRenwu.bitmap.rgba_HslaChange = function(rgba, h, s, l, a) {
		var hsl = ww_makeRenwu.bitmap.rgbToHsl(rgba[0], rgba[1], rgba[2]);
		if (h) {hsl[0] = (((hsl[0] + h) % 360) + 360) % 360}
		if (s) {hsl[1] = (hsl[1] + s).clamp(0, 255)}
		if (l) {hsl[2] = (hsl[2] + l).clamp(0, 255)}
		if (a) {rgba[3] = (rgba[3] + a).clamp(0, 255)}
		var rgb = ww_makeRenwu.bitmap.hslToRgb(hsl[0], hsl[1], hsl[2]);
		return [rgb[0], rgb[1], rgb[2], rgba[3]]
	}

    //rgb 转 hsl
	ww_makeRenwu.bitmap.rgbToHsl = function(r, g, b) {
		var r = r.clamp(0, 255)
		var g = g.clamp(0, 255)
		var b = b.clamp(0, 255)
		var cmin = Math.min(r, g, b);
		var cmax = Math.max(r, g, b);
		var h = 0;
		var s = 0;
		var l = (cmin + cmax) / 2;
		var delta = cmax - cmin;
		if (delta > 0) {
			if (r === cmax) {
				h = 60 * (((g - b) / delta + 6) % 6);
			} else if (g === cmax) {
				h = 60 * ((b - r) / delta + 2);
			} else {
				h = 60 * ((r - g) / delta + 4);
			}
			s = delta / (255 - Math.abs(2 * l - 255)) * 255;
		}
		return [h, s, l];
	}
    //hsl 转 rgb
	ww_makeRenwu.bitmap.hslToRgb = function(h, s, l) {
		var h = ((h % 360) + 360) % 360
		var s = s.clamp(0, 255)
		var l = l.clamp(0, 255)
		var c = (255 - Math.abs(2 * l - 255)) * s / 255;
		var x = c * (1 - Math.abs((h / 60) % 2 - 1));
		var m = l - c / 2;
		var cm = c + m;
		var xm = x + m;
		if (h < 60) {
			return [cm, xm, m];
		} else if (h < 120) {
			return [xm, cm, m];
		} else if (h < 180) {
			return [m, cm, xm];
		} else if (h < 240) {
			return [m, xm, cm];
		} else if (h < 300) {
			return [xm, m, cm];
		} else {
			return [cm, m, xm];
		}
	}

	//制作人物 (获得一个图片)
	ww_makeRenwu.bitmap.makeRenwu = function(badds) {
		//如果badds长度大于0 
		if (badds.length > 0) {
			var bitmap = new Bitmap()
			bitmap = ww_makeRenwu.bitmap.makeRenwu2(bitmap,badds)
		} else {
			var bitmap = new Bitmap()
			return bitmap
		}
		return bitmap;
	}

    //制作人物 2 (对图片进行处理)
	ww_makeRenwu.bitmap.makeRenwu2 = function(bitmap,badds) {
		if (badds.length>0){
			bitmap._isLoading  = true
			if(badds.iszdsize){
				bitmap.iszdsize = true 	
				if(badds.iszdsize.gdw){bitmap.iszdsize.gdw = badds.iszdsize.gdw }
				if(badds.iszdsize.gdh){bitmap.iszdsize.gdh = badds.iszdsize.gdh }
			}else{
				var width = badds.width || bitmap.width
				var height = badds.height || bitmap.height	
				bitmap.resize(width, height) 	
			}
		}else{
			return bitmap
		}
		bitmap.badds = []
		bitmap.badds.loading = true
		for (var i = 0; i < badds.length; i++) {
			if (badds[i]) {
				bitmap.badds[i] = {};
				if (badds[i].bitmap) {
					bitmap.badds[i].bitmap = ww_makeRenwu.imageManager.load(badds[i].bitmap)
					if (badds[i].change){
						bitmap.badds[i].change = badds[i].change
					}					
					bitmap.badds[i].bitmap.addLoadListener(
						function() {
							ww_makeRenwu.bitmap.makeAdd(bitmap)
						}
					);
					if (badds[i].bitmap_c && badds[i].change_c) {
						bitmap.badds[i].change_c = badds[i].change_c
						bitmap.badds[i].bitmap_c = ww_makeRenwu.imageManager.load(badds[i].bitmap_c)
						bitmap.badds[i].bitmap_c.addLoadListener(
							function() {
								ww_makeRenwu.bitmap.makeAdd(bitmap)
							}
						);
					}
				}
			}
		}
		bitmap.badds.loading = false
		ww_makeRenwu.bitmap.makeAdd(bitmap)
		return bitmap;
	}

	//制作添加
	ww_makeRenwu.bitmap.makeAdd = function(bitmap) {
			var bitmap = bitmap
			var badds = bitmap.badds
			//如果是添加加载中
			if (badds.loading) {return}
			//如果是全部添加加载ok
			if (ww_makeRenwu.bitmap.baddsok(badds)){
				//添加加载绘制
				ww_makeRenwu.bitmap.baddsblt(bitmap,badds)
			}
	}
    //判断是否添加完成
	ww_makeRenwu.bitmap.baddsok =function (badds) {
		for (var i = 0; i < badds.length; i++) {
			if (badds[i]) {
				//如果有基础图片　并且　图片是　载入中
				if (badds[i].bitmap && badds[i].bitmap._isLoading) {return false}
				//不然 如果有 附加图片 并且 附加图片 是载入中
				if (badds[i].bitmap_c && badds[i].bitmap_c._isLoading) {return false} 
			}
		}		
		return true;
	}
    //添加绘制
	ww_makeRenwu.bitmap.baddsblt = function (bitmap, badds) {

		//基础图片的清除
		if (badds.clear){
			var bx = badds.clear.x || 0
			var by = badds.clear.y || 0
			var bw = badds.clear.w || bitmap.width
			var bh = badds.clear.h || bitmap.height
			bitmap.clearRect(bx, by, bw, bh)
		}
		var length = badds.length
		for (var i = 0; i < length ; i++) {
			if (badds[i]) {
				//如果图片存在
				if (badds[i].bitmap) {
					//如果有 基础修改
					if (badds[i].change) {							
						ww_makeRenwu.bitmap.bitmap_change(badds[i].bitmap, badds[i].change)
				    }
				    //如果透过图片存在并且 存在 基于透过图片的改变
					if (badds[i].bitmap_c && badds[i].change_c) {
						ww_makeRenwu.bitmap.bitmap_change_c(badds[i].bitmap, badds[i].bitmap_c, badds[i].change_c)
					}
					var x = badds[i].x || 0
					var y = badds[i].y || 0
					var width = badds[i].width || badds[i].bitmap.width
					var height= badds[i].heigh || badds[i].bitmap.height
					var x2 = badds[i].x2 || 0 
					var y2 = badds[i].y2 || 0
					var width2 = badds[i].width2 || badds[i].bitmap.width
					var height2= badds[i].heigh2 || badds[i].bitmap.height
					//如果图片自动大小
					if (bitmap.iszdsize){
						if (width2> bitmap.width || height2 > bitmap.height){
							var zdwidth = bitmap.iszdsize.gdw ? bitmap.iszdsize.gdw: width2> bitmap.width? width2 : bitmap.width
							var zdheight = bitmap.iszdsize.gdh ?bitmap.iszdsize.gdh:height2 > bitmap.height?height2 : bitmap.height
							bitmap.resize(zdwidth, zdheight)
						}
					}
					if( badds[i].clear){
						bitmap.clearRect(x2, y2, width2, height2)
					}
					//图片绘制
					bitmap.blt(badds[i].bitmap,x, y, width, height,x2, y2, width2, height2)	
				}
			} 
		}
		bitmap._isLoading  = false
		bitmap._callLoadListeners()
		return true;
	}
	
    //基础图片转换
	ww_makeRenwu.bitmap.bitmap_change = function(bitmap, change) {
		var bitmap = bitmap
		var change = change
		//转换改变内容 (没用到)
		change = ww_makeRenwu.bitmap.change_zh(bitmap, change)
		//处理图片
		if (change.length > 0 && bitmap.width > 0 && bitmap.height > 0) {
			var context = bitmap._context;
			var imageData = context.getImageData(0, 0, bitmap.width, bitmap.height);
			var pixels = imageData.data;
			for (var i = 0; i < pixels.length; i += 4) {
				var rgba = [pixels[i + 0], pixels[i + 1], pixels[i + 2], pixels[i + 3]]
				rgba = ww_makeRenwu.bitmap.rgba_change(rgba, change)
				pixels[i + 0] = rgba[0];
				pixels[i + 1] = rgba[1];
				pixels[i + 2] = rgba[2];
				pixels[i + 3] = rgba[3];
			}
			context.putImageData(imageData, 0, 0);
			bitmap._setDirty();
		}
	};
    //基于透过图片的转换
	ww_makeRenwu.bitmap.bitmap_change_c = function(bitmap, bitmap_c, change_c) {
		var bitmap = bitmap
		var bitmap_c = bitmap_c
		var change_c = change_c
		//转换改变内容(没用到)
		change_c = ww_makeRenwu.bitmap.change_c_zh(bitmap, bitmap_c, change_c)
		//处理图片
		if (change_c && bitmap && change_c.length > 0 &&
			bitmap.width > 0 && bitmap.height > 0 &&
			bitmap_c.width > 0 && bitmap_c.height > 0) {
			var width = bitmap.width > bitmap_c.width ? bitmap_c.width : bitmap.width
			var height = bitmap.height > bitmap_c.height ? bitmap_c.height : bitmap.height
			var imageData = bitmap._context.getImageData(0, 0, width, height);
			var imageData_c = bitmap_c.context.getImageData(0, 0, width, height);
			var pixels = imageData.data;
			var pixels_c = imageData_c.data;
			for (var i = 0; i < pixels_c.length; i += 4) {
				var rgba_c = [pixels_c[i + 0], pixels_c[i + 1], pixels_c[i + 2], pixels_c[i + 3]]
				var rgba = [pixels[i + 0], pixels[i + 1], pixels[i + 2], pixels[i + 3]]
				rgba = ww_makeRenwu.bitmap.rgba_change2(rgba, rgba_c, change_c)
				pixels[i + 0] = rgba[0];
				pixels[i + 1] = rgba[1];
				pixels[i + 2] = rgba[2];
				pixels[i + 3] = rgba[3];
			}
			bitmap._context.putImageData(imageData, 0, 0);
			bitmap._setDirty();
		}
	};
    //rgba转换
	ww_makeRenwu.bitmap.rgba_change = function(rgba, change) {
		var rgba = rgba
		var change = change
		for (var i = 0; i < change.length; i++) {
			if (change[i]) {
				if (!(change[i].pd && !ww_makeRenwu.bitmap.rgba_pd(rgba, change[i].pd))){
					if (change[i].rgba) {
						rgba = ww_makeRenwu.bitmap.rgba_RgbaChange(rgba,
							change[i].rgba.r,
							change[i].rgba.g,
							change[i].rgba.b,
							change[i].rgba.a
						)
					}
					if (change[i].hsla) {
						rgba = ww_makeRenwu.bitmap.rgba_HslaChange(rgba,
							change[i].hsla.h,
							change[i].hsla.s,
							change[i].hsla.l,
							change[i].hsla.a
						)
					}
				}
			}
		}
		return rgba;
	}

    //基于透过图片的rgba 转换
	ww_makeRenwu.bitmap.rgba_change2 = function(rgba, rgba_c, change) {
		var rgba = rgba
		var rgba_c = rgba_c
		var change = change
		for (var i = 0; i < change.length; i++) {
			if (change[i]) {
				if (change[i].pd && !ww_makeRenwu.bitmap.rgba_pd(rgba_c, change[i].pd)) {} else {
					if (change[i].rgba) {
						rgba = ww_makeRenwu.bitmap.rgba_RgbaChange(rgba,
							change[i].rgba.r,
							change[i].rgba.g,
							change[i].rgba.b,
							change[i].rgba.a
						)
					}
					if (change[i].hsla) {
						rgba = ww_makeRenwu.bitmap.rgba_HslaChange(rgba,
							change[i].hsla.h,
							change[i].hsla.s,
							change[i].hsla.l,
							change[i].hsla.a
						)
					}
				}
			}
		}
		return rgba;
	}


	//基本变更转换
	ww_makeRenwu.bitmap.change_zh = function(bitmap, change) {
		var change = change
		var xyzh = false
		var qy = {}
		for (var i = 0; i < change.length; i++) {
			if (change[i].pd && change[i].hsl2) {
				qy[i] = {}
				qy[i].palette_hsl = {}
				qy[i].palette_hsl.h ={}
				qy[i].palette_hsl.s ={}
				qy[i].palette_hsl.l ={}
				
				xyzh = true
			}
		}
		if (!xyzh) {return change }
		if (change && bitmap && change.length > 0 && bitmap.width > 0 && bitmap.height > 0) {
			var context = bitmap._context;
			var imageData = context.getImageData(0, 0, bitmap.width, bitmap.height);
			var pixels = imageData.data;
			for (var i = 0; i < pixels.length; i += 4) {
				var rgba = [pixels[i + 0], pixels[i + 1], pixels[i + 2], pixels[i + 3]]

				for (var i2 = 0; i2 < change.length; i2++) {
					if (change[i2].pd && change[i2].hsl2 && ww_makeRenwu.bitmap.rgba_pd(rgba, change[i2].pd)) {
						var hsl = ww_makeRenwu.bitmap.rgbToHsl(pixels[i + 0], pixels[i + 1], pixels[i + 2])
						var ht = hsl[0].mod(360).toFixed()
						var st = Math.round(hsl[1]).toString()
						var lt = Math.round(hsl[2]).toString()
					
						if (ht in qy[i2].palette_hsl.h) {
							qy[i2].palette_hsl.h[ht] += 1
						} else {
							qy[i2].palette_hsl.h[ht] = 1
						}
						if (st in qy[i2].palette_hsl.s) {
							qy[i2].palette_hsl.s[st] += 1
						} else {
							qy[i2].palette_hsl.s[st] = 1
						}
						if (lt in qy[i2].palette_hsl.l) {
							qy[i2].palette_hsl.l[lt] += 1
						} else {
							qy[i2].palette_hsl.l[lt] = 1
						}
					}
				}
			}
			for (var i = 0; i < change.length; i++) {
				if (change[i].pd && change[i].hsl2) {
					change[i].hsla = {}
					if (isFinite(change[i].hsl2.h)) {
						change[i].hsla.h = change[i].hsl2.h - ww_makeRenwu.math.qypj(qy[i].palette_hsl.h, 10, 360)
					}
					if (isFinite(change[i].hsl2.s)) {
						change[i].hsla.s = change[i].hsl2.s - ww_makeRenwu.math.qypj(qy[i].palette_hsl.s, 10)
					}
					if (isFinite(change[i].hsl2.l)) {
						change[i].hsla.l = change[i].hsl2.l - ww_makeRenwu.math.qypj(qy[i].palette_hsl.l, 10)
					}
				}
			}
		}
		return change
	};




	//基于透过图片的变更转换
	ww_makeRenwu.bitmap.change_c_zh = function(bitmap, bitmap_c, change_c) {
		var change_c = change_c
		var xyzh = false
		var qy = {}
		for (var i = 0; i < change_c.length; i++) {
			if (change_c[i].pd && change_c[i].hsl2) {
				qy[i] = {}
				qy[i].palette_hsl = {}
				qy[i].palette_hsl.h ={}
				qy[i].palette_hsl.s ={}
				qy[i].palette_hsl.l ={}
				
				xyzh = true
			}
		}
		if (!xyzh) {return change_c}

		var bitmap_c = bitmap_c
		if (change_c && bitmap && bitmap_c && change_c.length > 0 &&
			bitmap.width > 0 && bitmap.height > 0 &&
			bitmap_c.width > 0 && bitmap_c.height > 0) {

			var width = bitmap.width > bitmap_c.width ? bitmap_c.width : bitmap.width
			var height = bitmap.height > bitmap_c.height ? bitmap_c.height : bitmap.height

			var imageData = bitmap.context.getImageData(0, 0, width, height);
			var imageData_c = bitmap_c.context.getImageData(0, 0, width, height);

			var pixels = imageData.data;
			var pixels_c = imageData_c.data;

			for (var i = 0; i < pixels_c.length; i += 4) {
				var rgba_c = [pixels_c[i + 0], pixels_c[i + 1], pixels_c[i + 2], pixels_c[i + 3]]
				var rgba = [pixels[i + 0], pixels[i + 1], pixels[i + 2], pixels[i + 3]]

				for (var i2 = 0; i2 < change_c.length; i2++) {
					if (change_c[i2].pd && change_c[i2].hsl2 && ww_makeRenwu.bitmap.rgba_pd(rgba_c, change_c[i2].pd)) {
						var hsl = ww_makeRenwu.bitmap.rgbToHsl(pixels[i + 0], pixels[i + 1], pixels[i + 2])
						var ht = hsl[0].mod(360).toFixed()
						var st = Math.round(hsl[1]).toString()
						var lt = Math.round(hsl[2]).toString()
						if (ht in qy[i2].palette_hsl.h) {
							qy[i2].palette_hsl.h[ht] += 1
						} else {
							qy[i2].palette_hsl.h[ht] = 1
						}
						if (st in qy[i2].palette_hsl.s) {
							qy[i2].palette_hsl.s[st] += 1
						} else {
							qy[i2].palette_hsl.s[st] = 1
						}
						if (lt in qy[i2].palette_hsl.l) {
							qy[i2].palette_hsl.l[lt] += 1
						} else {
							qy[i2].palette_hsl.l[lt] = 1
						}
					}
				}
			}
			for (var i = 0; i < change_c.length; i++) {
				if (change_c[i].pd && change_c[i].hsl2) {
					change_c[i].hsla = {}
					if (isFinite(change_c[i].hsl2.h)) {
						change_c[i].hsla.h = change_c[i].hsl2.h - ww_makeRenwu.math.qypj(qy[i].palette_hsl.h, 10, 360)
					}
					if (isFinite(change_c[i].hsl2.s)) {
						change_c[i].hsla.s = change_c[i].hsl2.s - ww_makeRenwu.math.qypj(qy[i].palette_hsl.s, 10)
					}
					if (isFinite(change_c[i].hsl2.l)) {
						change_c[i].hsla.l = change_c[i].hsl2.l - ww_makeRenwu.math.qypj(qy[i].palette_hsl.l, 10)
					}
				}
			}
		}
		return change_c
	};

	//绘制 s l (未用到)
	ww_makeRenwu.bitmap.make_SL_Rect = function(bitmap,h, ss, es, sl, el) {
		if (bitmap && this.width > 0 && this.height > 0) {
			var h = h ? h : 0
			var ss = isFinite(ss) ? ss : 0
			var es = isFinite(es) ? es : 255
			var sse = es - ss
			var sl = isFinite(sl) ? sl : 127
			var el = isFinite(el) ? el : 127
			var lse = el - sl
			var context = this._context;
			var imageData = context.getImageData(0, 0, this.width, this.height);
			var pixels = imageData.data;
			for (var x = 0; x < this.width; x++) {
				for (var y = 0; y < this.height; y++) {
					var i = (x + y * this.width) * 4
					var rgb = ww_makeRenwu.bitmap.hslToRgb(
						h,
						sse / (this.width - 1) * x + ss,
						lse / (this.height - 1) * ((this.height - 1) - y) + sl
					)
					pixels[i + 0] = rgb[0];
					pixels[i + 1] = rgb[1];
					pixels[i + 2] = rgb[2];
					pixels[i + 3] = 255
				}

			}
			context.putImageData(imageData, 0, 0);
			this._setDirty();
		}
	};

	//绘制 h矩形  未用到
	ww_makeRenwu.bitmap.make_H_Rect = function(bitmap,sh, eh) {
		if (bitmap && bitmap.width > 0 && bitmap.height > 0) {
			var sh = isFinite(sh) ? sh : 0
			var eh = isFinite(eh) ? eh : 360
			var hse = eh - sh
			var context = bitmap._context;
			var imageData = context.getImageData(0, 0, bitmap.width, bitmap.height);
			var pixels = imageData.data;
			for (var x = 0; x < bitmap.width; x++) {
				for (var y = 0; y < bitmap.height; y++) {
					var i = (y * bitmap.width + x) * 4
					var rgb = ww_makeRenwu.hslToRgb(hse / (bitmap.width - 1) * x + sh, 255, 127)
					pixels[i + 0] = rgb[0];
					pixels[i + 1] = rgb[1];
					pixels[i + 2] = rgb[2];
					pixels[i + 3] = 255
				}
			}
			context.putImageData(imageData, 0, 0);
			bitmap._setDirty();
		}
	};

	
//=============================================================================
// 数学计算工具 (配合色调转换到....然而没用到)
//=============================================================================
    ww_makeRenwu.math = {}
   	//区域平均数
	ww_makeRenwu.math.qypj = function(obj, n, l) {
		var s = 1 * ww_makeRenwu.math.quyu(obj, n, l)
		var e = s + n
		return ww_makeRenwu.math.quyu2(obj, s, e)
	}
	ww_makeRenwu.math.quyu = function(obj, n, l) {
		var zuida = 0
		var shu = 0
		var zuidai = 0
		for (var id in obj) {
			var i = 1 * id
			for (var id2 in obj) {
				if (l) {
					var i2 = (1 * id2).mod(l)
				} else {
					var i2 = (1 * id2)
				}
				if (i2 >= i && i2 <= i + n) {
					shu += obj[id2]
					if (shu > zuida) {
						zuida = shu
						zuidai = id
					}
				}
			}
			shu = 0
		}
		return zuidai
	}
	ww_makeRenwu.math.quyu2 = function(obj, s, e) {
		var i = 0
		var zs = 0
		for (var id in obj) {
			if (id >= s && id < e) {
				i += obj[id]
				zs += obj[id] * id
			}
		}
		return zs / i
	}
	//平均数
	ww_makeRenwu.math.pjs = function(obj) {
			var i = 0
			var zs = 0
			for (var id in obj) {
				i += obj[id]
				zs += obj[id] * id
			}
			return zs / i
		}
		//中位数
	ww_makeRenwu.math.zws = function(obj) {
			var i = 0
			for (var id in obj) {
				i += obj[id]
			}
			var i2 = 0
			var s = 1
			for (var id in obj) {
				i2 += obj[id]
				if (i2 >= i / 2) {
					return s * id
				}
			}
		}
		//标准差
	ww_makeRenwu.math.pjc = function(obj) {
		var i = 0
		var zs = 0
		
		for (var id in obj) {
			i += obj[id]
			zs += obj[id] * id
		}
		zs = zs / i
		var fc = 0
		for (var id in obj) {
			fc += obj[id] * (zs - id) * (zs - id)
		}
		return Math.sqrt(fc / i)
	}


//=============================================================================
// 文件处理工具 (扩增原文件时使用) 
//=============================================================================
	ww_makeRenwu.tool={}
	//临时数据
	ww_makeRenwu.tool.temp =[]
	
	//添加非系统文件
	ww_makeRenwu.tool.add = function () {
		ww_makeRenwu.tool.wjlbloaded = false
		ww_makeRenwu.tool.wjlbonerror = false
		ww_makeRenwu.tool.temp[0] ={} 
		ww_makeRenwu.tool.explorer2(ww_makeRenwu.tool.temp[0])
	}
	
	//读取文件数据
	ww_makeRenwu.tool.explorer2 = function (obj){		
		var fpath = window.location.pathname.replace(/(\/|)\/[^\/]*$/,"/img/Generator0" );
		if (fpath.match(/^\/([A-Z]\:)/)) {
			fpath = fpath.slice(1);
		}
		fpath = decodeURIComponent(fpath);
	    var fs = require('fs');
		var path1 = fpath + "/Female"
		fs.readdir(
			path1,
			function(err, files){
				if(err){
					console.log('error:\n' + err);
					return;
				}
				obj["/Female"]= files
				ww_makeRenwu.tool.chuli2()
			}
		)
		var path2 = fpath + "/Male"
		fs.readdir(
			path2,
			function(err, files){
				if(err){
					console.log('error:\n' + err);
					return;
				}
				obj["/Male"]=  files
				ww_makeRenwu.tool.chuli2()
			}
		)
		return obj
	}


    //数据处理
	ww_makeRenwu.tool.chuli2 = function (){
		if(ww_makeRenwu.tool.id2)(clearTimeout(ww_makeRenwu.tool.id2 ))
		ww_makeRenwu.tool.id2 = setTimeout(ww_makeRenwu.tool.clff2 ,1000) 	
	}
	
    //处理方法
	ww_makeRenwu.tool.clff2 = function () {
		
		//对读取文件名的处理
		ww_makeRenwu.tool.shujuchuli2(ww_makeRenwu.tool.temp[0])
		//保存(/img/Generator/ww_makeRenwu.json文件)
		ww_makeRenwu.tool.saveJson(ww_makeRenwu.tool.temp[1])
	    //wjlb读取
		ww_makeRenwu.data.wjlb = ww_makeRenwu.clone(ww_makeRenwu.tool.temp[1])
		ww_makeRenwu.tool.temp = []
		ww_makeRenwu.tool.wjlbloaded = true
		ww_makeRenwu.tool.wjlbonerror = false
	}


	ww_makeRenwu.tool.shujuchuli2 =function (obj){
		var fpath = window.location.pathname.replace(/(\/|)\/[^\/]*$/,"/img/Generator0" );
			if (fpath.match(/^\/([A-Z]\:)/)) {
				fpath = fpath.slice(1);
			}
		fpath = decodeURIComponent(fpath);
		var tpath = window.location.pathname.replace(/(\/|)\/[^\/]*$/,"/img/Generator" );
		if (tpath.match(/^\/([A-Z]\:)/)) {
			tpath = tpath.slice(1);
		}
		tpath = decodeURIComponent(tpath);
    	var fs = require('fs');
		var wjlb = ww_makeRenwu.clone(ww_makeRenwu.data.wjlb) 
		//基础名称
		var key = {"FG":"Face","TV":"TV","SV":"SV", "TVD":"TVD", "icon":"Variation"};
		var fm = { "/Female":"Female","/Male":"Male"}
	    for(var fmn in fm){
			var path = fpath + fmn
			var files = obj[fmn]
			var length = files.length
			var pi = {}
			for ( var i = 0 ;i < length ;i++ ){
				var file = files[i]
				// 全文件名 数组
			    // icon_AccA_p02.png
				var z = file.split(".")
				if (!z[0]){continue}
				//z = [icon_AccA_p02]
				//文件名 切割 数组
				var d = z[0].split("_")
				//d = [icon , AccA,p02]
				//基础 
				if ( !d[0]|| !d[1]|| !d[2] ){continue}
				var n0 = key[d[0]]
				
				if (!n0){continue}
				//n0 = "Variation"
				//种类
				if( ww_makeRenwu.data.keylist[n0]){ 
					//n1 = AccA
					var n1 = ww_makeRenwu.data.keylist[n0][d[1]] 
				}else{
					var n1 = d[1]
				}
				if (!n1){continue}
				//nz = Female
				//男女
				var n2 = fm[fmn]
				//所有类型
				if( n1!= "Body"){
					var psi = "Variation"
				}else{
					var psi = "Face"
				}
				if(wjlb && wjlb[psi] && wjlb[psi][n1]){
					var ps = wjlb[psi][n1][n2] || {}
					for(var psi2 in pi){
						ps[pi[psi2]] = psi2
					}
				}else{
					var ps = {}
				}
				//p = ["", 01]
				var p = d[2].split("p")
				var ypi = p[1]
				
				if(!ypi){continue}
				//hzq =    icon_AccA_p02
				var hzq = d[0] +"_" +d[1] +"_" + d[2]
				//hzs = icon_AccA_p02 , .png 
				var hzs = file.split(hzq)
				//hz = .png
				var hz =  hzs[1]
				
				var hzs2 = z[0].split(hzq)	
				//hzs2 = icon_AccA_p02 ,""
				var hz2 = hzs2[1]
				pi[ypi] = pi[ypi] || 0 
				if (pi[ypi] == 0){
					var pid = 0
					do{
						pid++
						if (pid <10){var pidz = "0" + pid}else{var pidz = "" + pid }
					}while(pidz in ps )
					pi[ypi] = pidz
				}
				//制作后缀
				wjlb[n0] = wjlb[n0] || {}
				wjlb[n0][d[1]] = wjlb[n0][d[1]]||  {}
				wjlb[n0][d[1]][n2]= wjlb[n0][d[1]][n2] ||  {}
				wjlb[n0][d[1]][n2][pi[ypi]] = wjlb[n0][d[1]][n2][pi[ypi]] ||  {}
				var c = 0
				for (var ci in wjlb[n0][d[1]][n2][pi[ypi]] ){
					c += 1
				}
				wjlb[n0][d[1]][n2][pi[ypi]][c]= hz2
				
				var nname = tpath +"/" + n0 + fmn +"/" +d[0] +"_" +d[1] +"_p" + pi[ypi]  + hz
				var lname = fpath  +fmn +"/" +file
				fs.rename(lname,nname )
			}
		}
		ww_makeRenwu.tool.temp[1] = wjlb 
	}

	//读取文件(未用)
	ww_makeRenwu.tool.load =function () {	
		ww_makeRenwu.tool.loadDataFile( "ww_makeRenwu.json")
	}
	//读取文件
	ww_makeRenwu.tool.loadDataFile = function(src) {
		ww_makeRenwu.tool.wjlbloaded = false
		ww_makeRenwu.tool.wjlbonerror = false
	    var xhr = new XMLHttpRequest();
	    var url = "img/Generator/" + src;
	    xhr.open('GET', url);
	    xhr.overrideMimeType('application/json');
	    xhr.onload = function() {
	        if (xhr.status < 400) {
	            ww_makeRenwu.data.wjlb = JSON.parse(xhr.responseText);
	            ww_makeRenwu.tool.wjlbloaded = true 
	            ww_makeRenwu.tool.wjlbonerror = false
	        }
	    };
	    xhr.onerror = function() {  
		    ww_makeRenwu.tool.duqu()
		    ww_makeRenwu.tool.wjlbloaded = true ; 
		    ww_makeRenwu.tool.wjlbonerror = true  
		};
	    xhr.send();
	};

	//生成文件
	ww_makeRenwu.tool.duqu = function () {
		var path = window.location.pathname.replace(/(\/|)\/[^\/]*$/,"/img/Generator" );
			if (path.match(/^\/([A-Z]\:)/)) {
				path = path.slice(1);
			}
			path = decodeURIComponent(path);
		ww_makeRenwu.tool.temp[0] ={} 
		ww_makeRenwu.tool.temp[1] ={}
		ww_makeRenwu.tool.temp[2] ={} 
		ww_makeRenwu.tool.explorer(path,ww_makeRenwu.tool.temp[0],ww_makeRenwu.tool.temp[1])
	}
	
    //数据处理
	ww_makeRenwu.tool.chuli = function (){
		if(ww_makeRenwu.tool.id)(clearTimeout(ww_makeRenwu.tool.id ))
		ww_makeRenwu.tool.id = setTimeout( ww_makeRenwu.tool.clff ,1000) 
	}
	
    //处理方法
	ww_makeRenwu.tool.clff = function () {
		//对读取文件名的处理
		ww_makeRenwu.tool.shujuchuli(ww_makeRenwu.tool.temp[1],ww_makeRenwu.tool.temp[2])
		//保存(/img/Generator/ww_makeRenwu.json文件)
		ww_makeRenwu.tool.saveJson(ww_makeRenwu.tool.temp[2] )
	    //wjlb读取
		ww_makeRenwu.data.wjlb = ww_makeRenwu.tool.temp[2]
		ww_makeRenwu.tool.temp =[]
		ww_makeRenwu.tool.wjlbloaded = true
		ww_makeRenwu.tool.wjlbonerror = false
		
	}
	
    //保存文件(限电脑)
	ww_makeRenwu.tool.saveJson = function(json) {
		var data = JSON.stringify(json);
		var path = window.location.pathname.replace(/(\/|)\/[^\/]*$/,"/img/Generator" )   
		if (path.match(/^\/([A-Z]\:)/)) {
				path = path.slice(1);
			}
			path = decodeURIComponent(path);
		var filePath = path +  "/ww_makeRenwu.json"
		var fs = require('fs');
		fs.writeFile(filePath, data);
		return data;
	};
	
	//读取文件数据
	ww_makeRenwu.tool.explorer = function (path,obj,obj2,path2){
		var path2 = path2 || path
	    var fs = require('fs');
	    obj.log =[]
	    obj.log.path = path
		fs.readdir(path,function(err, files){
			if(err){
				console.log('error:\n' + err);
				return;
			}
			files.forEach(function(file){
				fs.stat( (path + '/' + file ), function(err, stat){
					if(err){console.log(err); return;}
					if(stat.isDirectory()){
						obj[file] = {}
						ww_makeRenwu.tool.explorer(path + '/' + file,obj[file],obj2,path2);
					}else{
						obj.log.push(file)
						obj.log.sort()
	 					var paths = path.split(path2)[1].split("/")
						if (paths[1]){
							if (obj2[paths[1]]){}else{obj2[paths[1]]={}}
						}
						if (paths[1]&& paths[2]){
							obj2[paths[1]][paths[2]] = obj.log
						}
					}	
					//处理
					ww_makeRenwu.tool.chuli()
				})
			},this)
		})
		return obj ,obj2
	}

	//数据处理
	ww_makeRenwu.tool.shujuchuli=function (obj,obj2) {
		// i1 种类
		for (var i1 in obj){
			obj2[i1]= {}
			// i2 男女 
			for (var i2 in obj[i1]){
				//i3 类型
				for(var i3 = 0; i3< obj[i1][i2].length ; i3++){
					// 全文件名 数组
					var z = obj[i1][i2][i3].split(".")
					//文件名 切割 数组
					var d = z[0].split("_")
					obj2[i1][d[1]] = obj2[i1][d[1]] || {}
					obj2[i1][d[1]][i2]= obj2[i1][d[1]][i2] || {}
					var p = d[2].split("p")
					obj2[i1][d[1]][i2][p[1]]= obj2[i1][d[1]][i2][p[1]] ||  {}
					var c = 0
					for (var i in obj2[i1][d[1]][i2][p[1]]){
						c += 1
					}
					//制作后缀
					var l = d[0]+"_"+d[1]+"_"+d[2]
					var l2 =z[0].split(l)
					obj2[i1][d[1]][i2][p[1]][c]= l2[1] 
				}
			}
		}
		return obj2
	}



//=============================================================================
// 基础数据
//=============================================================================
	ww_makeRenwu.data={}
	//种类表
	ww_makeRenwu.data.zhongleibiao= [
		['脸', 'Face'],
		['身体', 'Body'],
		['前发', 'FrontHair'],
		['后发', 'RearHair'],
		['耳朵', 'Ears'],
		['眼睛', 'Eyes'],
		['眉毛', 'Eyebrows'],
		['鼻子', 'Nose'],
		['嘴巴', 'Mouth'],
		['胡子', 'Beard'],
		['面部特征', 'FacialMark'],
		['衣服', 'Clothing'],
		['披风', 'Cloak'],
		['兽耳', 'BeastEars'],
		['尾巴', 'Tail'],
		['翅膀', 'Wing'],
		['眼镜', 'Glasses'],
		['配件A', 'AccA'],
		['配件B', 'AccB']
	]

	//图层表
    ww_makeRenwu.data.cxlist ={}
	//Face图层表
	ww_makeRenwu.data.cxlist.Face =[
		"RearHair2",
		"Cloak2",
		"Body",
		"Clothing2",
		"Face",
		"FacialMark",
		"RearHair1",
		"Ears",
		"BeastEars",
		"Eyes",
		"Mouth",
		"Nose",
		"Clothing1",
		"Eyebrows",
		"Beard"	,
		"Cloak1",
		"AccA",
		"Glasses",
		"FrontHair",
		"AccB",
	]
	//TV图层表
	ww_makeRenwu.data.cxlist.TV=[
		"Wing2",
		"FrontHair2",
		"Cloak2",
		"Beard2",
		"Tail2",
		"Body",
		"FacialMark",
		"RearHair2",
		"Clothing2",
		"Clothing1",
		"Beard1",
		"Tail1",
		"Cloak1",
		"BeastEars",
		"Glasses",
		"RearHair1",
		"AccA",
		"FrontHair1",
		"AccB",
		"Wing1",
	]
	//TVD图层表
	ww_makeRenwu.data.cxlist.TVD=[
		"Wing",
		"Body",
		"FacialMark",
		"RearHair",
		"BeastEars",
		"Clothing",
		"Beard"	,
		"Tail",
		"Cloak",
		"AccA",
		"Glasses",
		"FrontHair",
		"AccB",
	]
	//SV图层表
	ww_makeRenwu.data.cxlist.SV=[
		"Cloak2",
		"Tail",
		"Wing",
		"body",
		"FacialMark",
		"RearHair1",
		"BeastEars",	
		"Clothing2"	,
		"Clothing1",
		"Beard",
		"Cloak1",
		"AccA",
		"Glasses",
		"FrontHair",
		"AccB",
	]

	
    //对应种类表
	ww_makeRenwu.data.keylist ={}
	//Face图层对应种类表
	ww_makeRenwu.data.keylist.Face ={
		"AccA":"AccA",
		"AccB":"AccB",
		"BeastEars":"BeastEars",
		"Body":"Body",
		"Cloak1":"Cloak",
		"Cloak2":"Cloak",
		"Clothing1":"Clothing",
		"Clothing2":"Clothing",
		"Ears":"Ears",
		"Eyebrows":"Eyebrows",
		"Eyes":"Eyes",
		"Face":"Face",
		"FacialMark":"FacialMark",
		"FrontHair":"FrontHair",
		"Glasses":"Glasses",
		"Mouth":"Mouth",
		"Nose":"Nose",
		"RearHair1":"RearHair",
		"RearHair2":"RearHair",
		"Beard":"Beard"
	}
	//TV图层对应种类表
	ww_makeRenwu.data.keylist.TV={
		"AccA":"AccA",
		"AccB":"AccB",
		"BeastEars":"BeastEars",
		"Body":"Body",
		"Cloak1":"Cloak",
		"Cloak2":"Cloak",
		"Clothing1":"Clothing",
		"FacialMark":"FacialMark",
		"FrontHair1":"FrontHair",
		"FrontHair2":"FrontHair",
		"Glasses":"Glasses",
		"RearHair1":"RearHair",
		"RearHair2":"RearHair",
		"Tail1":"Tail",
		"Tail2":"Tail",
		"Wing1":"Wing",
		"Wing2":"Wing",
		"Beard1":"Beard",
		"Beard2":"Beard",
		"Clothing2":"Clothing"
	}
	//TVD图层对应种类表
	ww_makeRenwu.data.keylist.TVD={
		"AccA":"AccA",
		"AccB":"AccB",
		"BeastEars":"BeastEars",
		"Body":"Body",
		"Cloak":"Cloak",
		"Clothing":"Clothing",
		"FacialMark":"FacialMark",
		"FrontHair":"FrontHair",
		"Glasses":"Glasses",
		"RearHair":"RearHair",
		"Tail":"Tail",
		"Wing":"Wing",
		"Beard":"Beard"
	}
	//SV图层对应种类表
	ww_makeRenwu.data.keylist.SV={
		"AccA":"AccA",
		"AccB":"AccB",
		"BeastEars":"BeastEars",
		"Cloak1":"Cloak",
		"Cloak2":"Cloak",
		"Clothing1":"Clothing",
		"FacialMark":"FacialMark",
		"FrontHair":"FrontHair",
		"Glasses":"Glasses",
		"RearHair1":"RearHair",
		"Tail":"Tail",
		"Wing":"Wing",
		"body":"Body",
		"Beard":"Beard",
		"Clothing2":"Clothing"
	}
	
	//元种类颜色表
	ww_makeRenwu.data.icolor ={
		"AccA":[
			{"hz":"013","pd":"#D3CEC2"},
			{"hz":"014","pd":"#DA346E"},
			{"hz":"015","pd":"#A4C911"}
		],
		"AccB":[
			{"hz":"016","pd":"#C78407"},
			{"hz":"017","pd":"#C0D3D2"},
			{"hz":"018","pd":"#4155B6"},
			{"hz":"019","pd":"#BA3B45"}
		],
		"Body":[
			{"hz":"001","pd":"#F9C19D"},
			{"hz":"002","pd":"#2C80CB"}
		],
		"Beard":[
			{"hz":"003","pd":"#FCCB0A"}
		],
		"BeastEars":[
			{"hz":"006","pd":"#D3CEC7"}
		],
		"Cloak":[
			{"hz":"011","pd":"#D8AC00"}	,
			{"hz":"012","pd":"#A30708"}
		],
		"Clothing":[
			{"hz":"007","pd":"#AE8682"}	,
			{"hz":"008","pd":"#FE9D1E"}	,
			{"hz":"009","pd":"#1C76D0"}	,
			{"hz":"010","pd":"#D9A404"}
		],
		"Ears":[
			{"hz":"001","pd":"#F9C19D"}
		],
		"Eyebrows":[
			{"hz":"001","pd":"#F9C19D"}	,
			{"hz":"003","pd":"#FCCB0A"}
		],
		"Eyes":[
			{"hz":"002","pd":"#2C80CB"}
		],
		"Face":[
			{"hz":"001","pd":"#F9C19D"}
		],
		"FacialMark":[
			{"hz":"001","pd":"#F9C19D"},
			{"hz":"005","pd":"#009296"}
		],
		"FrontHair":[
			{"hz":"003","pd":"#FCCB0A"},
			{"hz":"004","pd":"#B892C5"}
		],
		"Glasses":[
			{"hz":"020","pd":"#999999"},
			{"hz":"021","pd":"#CCBAD2"},
			{"hz":"022","pd":"#607E4B"}
		],
		"Mouth":[
			{"hz":"003","pd":"#F9C19D"}
		],
		"Nose":[
			{"hz":"003","pd":"#F9C19D"}
		],
		"RearHair":[
			{"hz":"003","pd":"#FCCB0A"},
			{"hz":"004","pd":"#B892C5"}
		],
		"Tail":[
			{"pd":"#E6D6BD"}
		],
		"Wing":[
			{"pd":"#A7D6D6"}
		],
	}

	//检查设置
	ww_makeRenwu.data.jiancha =[
		
		{	//严格检查
			"AccA":-3,
			"AccB":-3,
			"Body":4,
			"Beard":-3,
			"BeastEars":-3,
			"Cloak":-3,
			"Clothing":-4,
			"Ears":3,
			"Eyebrows":3,
			"Eyes":3,
			"Face":3,
			"FacialMark":-3,
			"FrontHair":-3,
			"Glasses":-3,
			"Mouth":-3,
			"Nose":-3,
			"RearHair":-3,
			"Tail":-3,
			"Wing":-3
		},{
			//普通检查
			"AccA":-3,
			"AccB":-3,
			"Body":3,
			"Beard":-3,
			"BeastEars":-3,
			"Cloak":-3,
			"Clothing":-3,
			"Ears":3,
			"Eyebrows":3,
			"Eyes":3,
			"Face":3,
			"FacialMark":-3,
			"FrontHair":-3,
			"Glasses":-3,
			"Mouth":-3,
			"Nose":-3,
			"RearHair":-3,
			"Tail":-3,
			"Wing":-3
		},{
		    //空白检查
		}
	]




	
	//原种类设置
	ww_makeRenwu.data.ijl ={
		"AccA":0,
		"AccB":0,
		"Body":1,
		"Beard":0,
		"BeastEars":0,
		"Cloak":0,
		"Clothing":1,
		"Ears":1,
		"Eyebrows":1,
		"Eyes":1,
		"Face":1,
		"FacialMark":0,
		"FrontHair":1,
		"Glasses":0,
		"Mouth":1,
		"Nose":1,
		"RearHair":1,
		"Tail":0,
		"Wing":0
	}

//文件列表 
    ww_makeRenwu.data.wjlb = {}
    ww_makeRenwu.tool.load()    //读取


    //随机表

	ww_makeRenwu.data.sjb =[
		//女
		{   
			"lx":{
				"AccA":0,
				"AccB":0,
				"Body":1,
				"Beard":0,
				"BeastEars":0,
				"Cloak":0,
				"Clothing":1,
				"Ears":1,
				"Eyebrows":1,
				"Eyes":1,
				"Face":1,
				"FacialMark":0,
				"FrontHair":1,
				"Glasses":0,
				"Mouth":1,
				"Nose":1,
				"RearHair":1,
				"Tail":0,
				"Wing":0,
			},
			"lxlist":{
				"AccA":[],
				"AccB":[],
				"Body":[],
				"Beard":[],
				"BeastEars":[],
				"Cloak":[],
				"Clothing":[],
				"Ears":[],
				"Eyebrows":[],
				"Eyes":[],
				"Face":[],
				"FacialMark":[],
				"FrontHair":[],
				"Glasses":[],
				"Mouth":[],
				"Nose":[],
				"RearHair":[],
				"Tail":[],
				"Wing":[]
			},
			"lxgl":{
				"AccA":[],
				"AccB":[],
				"Body":[],
				"Beard":[],
				"BeastEars":[],
				"Cloak":[],
				"Clothing":[],
				"Ears":[],
				"Eyebrows":[],
				"Eyes":[],
				"Face":[],
				"FacialMark":[],
				"FrontHair":[],
				"Glasses":[],
				"Mouth":[],
				"Nose":[],
				"RearHair":[],
				"Tail":[],
				"Wing":[]
			},
			"yslist":{
				//"Body""Face""Mouth""Ears""Nose""Beard""FacialMark"	
				"#F9C19D":[

				//示例
					{
						"hsl2":{"h":100}
					},{
						"hsl2":{"h":0}
					},{
						"hsl2":{"h":200}
					} 
						
				],
				//"FacialMark"	
				"#009296":[],
				//"Body""Eyes"
				"#2C80CB":[],
				//"FrontHair""RearHair""Beard""Eyebrows"
				"#FCCB0A":[],
				//"FrontHair""RearHair"
				"#B892C5":[],
				//"BeastEars"
				"#D3CEC7":[],
				//"Cloak"
				"#D8AC00":[],
				"#A30708":[],
				//"Clothing"
				"#AE8682":[],
				"#FE9D1E":[],
				"#1C76D0":[],
				"#D9A404":[],
				//"Glasses"
				"#999999":[],
				"#CCBAD2":[],
				"#607E4B":[],
				//"Tail"
				"#E6D6BD":[],
				//"Wing"
				"#A7D6D6":[],
				//"AccA"				
				"#D3CEC2":[],
				"#DA346E":[],
				"#A4C911":[],
				//"AccB"					
				"#C78407":[],
				"#C0D3D2":[],
				"#4155B6":[],
				"#BA3B45":[]
			},
			"ysgl":{
				//"Body""Face""Mouth""Ears""Nose""Beard""FacialMark"	
				"#F9C19D":[],
				//"FacialMark"	
				"#009296":[],
				//"Body""Eyes"
				"#2C80CB":[],
				//"FrontHair""RearHair""Beard""Eyebrows"
				"#FCCB0A":[],
				//"FrontHair""RearHair"
				"#B892C5":[],
				//"BeastEars"
				"#D3CEC7":[],
				//"Cloak"
				"#D8AC00":[],
				"#A30708":[],
				//"Clothing"
				"#AE8682":[],
				"#FE9D1E":[],
				"#1C76D0":[],
				"#D9A404":[],
				//"Glasses"
				"#999999":[],
				"#CCBAD2":[],
				"#607E4B":[],
				//"Tail"
				"#E6D6BD":[],
				//"Wing"
				"#A7D6D6":[],
				//"AccA"				
				"#D3CEC2":[],
				"#DA346E":[],
				"#A4C911":[],
				//"AccB"					
				"#C78407":[],
				"#C0D3D2":[],
				"#4155B6":[],
				"#BA3B45":[]
			}
		},
		//男
		{   
			"lx":{
				"AccA":0,
				"AccB":0,
				"Body":2,
				"Beard":0,
				"BeastEars":0,
				"Cloak":0,
				"Clothing":2,
				"Ears":2,
				"Eyebrows":2,
				"Eyes":2,
				"Face":2,
				"FacialMark":0,
				"FrontHair":2,
				"Glasses":0,
				"Mouth":2,
				"Nose":2,
				"RearHair":2,
				"Tail":0,
				"Wing":0,
			},
			"lxlist":{
				"AccA":[],
				"AccB":[],
				"Body":[],
				"Beard":[],
				"BeastEars":[],
				"Cloak":[],
				"Clothing":[],
				"Ears":[],
				"Eyebrows":[],
				"Eyes":[],
				"Face":[],
				"FacialMark":[],
				"FrontHair":[],
				"Glasses":[],
				"Mouth":[],
				"Nose":[],
				"RearHair":[],
				"Tail":[],
				"Wing":[]
			},
			"lxgl":{
				"AccA":[],
				"AccB":[],
				"Body":[],
				"Beard":[],
				"BeastEars":[],
				"Cloak":[],
				"Clothing":[],
				"Ears":[],
				"Eyebrows":[],
				"Eyes":[],
				"Face":[],
				"FacialMark":[],
				"FrontHair":[],
				"Glasses":[],
				"Mouth":[],
				"Nose":[],
				"RearHair":[],
				"Tail":[],
				"Wing":[]
			},
			"yslist":{
				//"Body""Face""Mouth""Ears""Nose""Beard""FacialMark"	
				"#F9C19D":[

				//示例
				/*	{
						"hsl2":{"h":100}
					},{
						"pd":{
							"a":function(i){if(i !=0){return true}else{return false}}
						},
						"hsl2":{"h":0}
					} 
				*/
				],
				//"FacialMark"	
				"#009296":[],
				//"Body""Eyes"
				"#2C80CB":[],
				//"FrontHair""RearHair""Beard""Eyebrows"
				"#FCCB0A":[],
				//"FrontHair""RearHair"
				"#B892C5":[],
				//"BeastEars"
				"#D3CEC7":[],
				//"Cloak"
				"#D8AC00":[],
				"#A30708":[],
				//"Clothing"
				"#AE8682":[],
				"#FE9D1E":[],
				"#1C76D0":[],
				"#D9A404":[],
				//"Glasses"
				"#999999":[],
				"#CCBAD2":[],
				"#607E4B":[],
				//"Tail"
				"#E6D6BD":[],
				//"Wing"
				"#A7D6D6":[],
				//"AccA"				
				"#D3CEC2":[],
				"#DA346E":[],
				"#A4C911":[],
				//"AccB"					
				"#C78407":[],
				"#C0D3D2":[],
				"#4155B6":[],
				"#BA3B45":[]
			},
			"ysgl":{
				//"Body""Face""Mouth""Ears""Nose""Beard""FacialMark"	
				"#F9C19D":[],
				//"FacialMark"	
				"#009296":[],
				//"Body""Eyes"
				"#2C80CB":[],
				//"FrontHair""RearHair""Beard""Eyebrows"
				"#FCCB0A":[],
				//"FrontHair""RearHair"
				"#B892C5":[],
				//"BeastEars"
				"#D3CEC7":[],
				//"Cloak"
				"#D8AC00":[],
				"#A30708":[],
				//"Clothing"
				"#AE8682":[],
				"#FE9D1E":[],
				"#1C76D0":[],
				"#D9A404":[],
				//"Glasses"
				"#999999":[],
				"#CCBAD2":[],
				"#607E4B":[],
				//"Tail"
				"#E6D6BD":[],
				//"Wing"
				"#A7D6D6":[],
				//"AccA"				
				"#D3CEC2":[],
				"#DA346E":[],
				"#A4C911":[],
				//"AccB"					
				"#C78407":[],
				"#C0D3D2":[],
				"#4155B6":[],
				"#BA3B45":[]
			}
		}
		
	]
	


})();





//=============================================================================
// 
//           制作场景  Scene_makeRenwu (可删除)
//
//=============================================================================


function Scene_makeRenwu() {
	this.initialize.apply(this, arguments);
}

function Window_ZhongLei() {
	this.initialize.apply(this, arguments);
}
function Window_LeiXing() {
	this.initialize.apply(this, arguments);
}

function Window_LeiXingBZ() {
    this.initialize.apply(this, arguments);
}
function Window_Yanse() {
    this.initialize.apply(this, arguments);
}

function Window_Yansebz() {
    this.initialize.apply(this, arguments);
}

function Window_BC() {
    this.initialize.apply(this, arguments);
}


(function() {

//=============================================================================
// 转到制作场景
//=============================================================================
	ww_makeRenwu.goto = function (name,id,sjid,jc) {
		SceneManager.push(Scene_makeRenwu)
		SceneManager.prepareNextScene(name,id,sjid,jc)
	}


//=============================================================================
// 人物制作场景
//=============================================================================
Scene_makeRenwu.prototype = Object.create(Scene_Base.prototype);
Scene_makeRenwu.prototype.constructor = Scene_makeRenwu;
Scene_makeRenwu.prototype.initialize = function() {
	this.ww_makeRenwu= new ww_makeRenwu()
	this.chushihua()
	Scene_Base.prototype.initialize.call(this);
}
Scene_makeRenwu.prototype.chushihua = function() {
	this.dq = {}
	this.dq.ck = 0
	this.dq.zl = 0
	this.dq.lx = 0
	this.dq.ys = 0
	this.dq.xz = 0
}


//准备
Scene_makeRenwu.prototype.prepare = function(name, index,sjid,jc) {
    this._name = name || "ww_makeRenwu";
    this._index = index || 0;
    this._sjid = sjid || 0  
    this._jc = jc ||0
};


Scene_makeRenwu.prototype.create = function() {
	Scene_Base.prototype.create.call(this);

	//种类
	this.createXuanxiang()
	//保存
	this.createBC()
	//类型    
	this.createleixingbz()	
	this.createleixing()
	//颜色
    this.createyanse()
    this.createyansebz()
	//脸图
	this.createFace();
	this.createSV()
	this.createTV()
	this.createTVD()
	this.sxall()
	
	this._message = new Window_Message()
	this.addChild(this._message);
};
//创建种类窗口
Scene_makeRenwu.prototype.createXuanxiang = function() {
	this._zhonglei_window = new Window_ZhongLei()
	this._zhonglei_window.x = 0 
	this._zhonglei_window.y = 0 
	this._zhonglei_window.setHandler('dianji', this.ZhongleiXuanze.bind(this));
	this.addChild(this._zhonglei_window);
	this._zhonglei_window.dq = this.dq
}
//创建随机 保存 退出 窗口
Scene_makeRenwu.prototype.createBC= function() {
	this._sj_window = new Window_BC("随机")
	this._sj_window.x = 0 
	this._sj_window.y =  this._zhonglei_window.height 
	this._sj_window.setHandler('dianji', this.Suiji.bind(this));
	this.addChild(this._sj_window);
	this._bc_window = new Window_BC("保存")
	this._bc_window.x = 0 
	this._bc_window.y =  this._zhonglei_window.height + this._sj_window.height 
	this._bc_window.setHandler('dianji', this.Baocun.bind(this));
	this.addChild(this._bc_window);	
	this._tc_window = new Window_BC("退出")
	this._tc_window.x = 0 
	this._tc_window.y =  this._zhonglei_window.height + this._sj_window.height +  this._bc_window.height
	this._tc_window.setHandler('dianji', this.Tuichu.bind(this));
	this.addChild(this._tc_window);
}
//保存
Scene_makeRenwu.prototype.Baocun =function () {
	var txt = ww_makeRenwu.make.jiancha(this.ww_makeRenwu,this._jc)
	if ( txt  == "true"){
		ww_makeRenwu.baocun.sxall( this.ww_makeRenwu, this._name , this._index  )
	}else {
		this.Message(txt)
	}
}

//随机
Scene_makeRenwu.prototype.Suiji =function () {
	this.LeiXingCancel()
	ww_makeRenwu.make.new( this.ww_makeRenwu,this._sjid)
	this.sxall()
	
	
}


//退出
Scene_makeRenwu.prototype.Tuichu =function () {
	this.popScene()
}

//显示信息
Scene_makeRenwu.prototype.Message =function (txt) {
	$gameMessage.setBackground(1)
    $gameMessage.setPositionType(1)
    $gameMessage.add(txt)
}

//创建类型窗口
Scene_makeRenwu.prototype.createleixing = function() {
	this._leixing_window = new Window_LeiXing()
	this._leixing_window.x =   this._zhonglei_window.x + this._zhonglei_window.width
	this._leixing_window.y =  this._leixingbz_window.y +this._leixingbz_window.height
	this._leixing_window.setHandler('dianji', this.LeiXingXuanze.bind(this));
	this._leixing_window.setHandler('cancel', this.LeiXingCancel.bind(this));
	this.addChild(this._leixing_window);
	this._leixing_window.dq = this.dq
}

//创建类型帮助
Scene_makeRenwu.prototype.createleixingbz = function() {
	this._leixingbz_window = new Window_LeiXingBZ()
	this._leixingbz_window.x = this._zhonglei_window.x+ this._zhonglei_window.width
	this._leixingbz_window.y = 0
	this.addChild(this._leixingbz_window);
}


//创建颜色窗口 
Scene_makeRenwu.prototype.createyanse = function() {
	this._yanse_window = new Window_Yanse()
	this._yanse_window.x =Graphics.boxWidth - 80
	this._yanse_window.y = 0
	this._yanse_window.setHandler('dianji', this.YanSeXuanze.bind(this));
	this._yanse_window.setHandler('cancel', this.YanSeCancel.bind(this));

	this.addChild(this._yanse_window);
	this._yanse_window.dq = this.dq
}
//创建颜色帮助窗口 
Scene_makeRenwu.prototype.createyansebz = function() {
	this._yansebz_window = new Window_Yansebz()
	this._yansebz_window.x = 160
	this._yansebz_window.y = 0
	this.addChild(this._yansebz_window);
	this._yansebz_window.dq = this.dq
}
//种类选择
Scene_makeRenwu.prototype.ZhongleiXuanze = function() {
	var id = this._zhonglei_window._index||0
	if (this.dq.zl != id || this._leixing_window.isClosed() ) {
		this.dq.zl = id 
		this._leixing_window.shuaxin();
		this._leixingbz_window.shuaxin()
		this._yanse_window.close();
		this._yansebz_window.close()
		this.dq.ck = 1
		this.dq.xz = false
		this.sxall()
	}
}

//类型取消
Scene_makeRenwu.prototype.LeiXingCancel =function () {
	this._leixingbz_window.close()
	this._leixing_window.close()
	this._yanse_window.close()
	this._yansebz_window.close()
	this.dq.ck = 0
	this.dq.xz = false
}

//类型选择
Scene_makeRenwu.prototype.LeiXingXuanze =function () {
	var zl = this.dq.zl
	var id = this._leixing_window._index || 0
	var zlm = ww_makeRenwu.make.duzl(zl)
	if (zlm !="nil" && zlm !="err"){
		var jl =this.ww_makeRenwu.jl 
		if(zlm in jl){
			if (jl[zlm] != id || this._yanse_window.isClosed()   ){
				jl[zlm]= id
				this.dq.lx = id			
				this.dq.ck = 2
				this.dq.xz = false
				this._leixingbz_window.shuaxin()
				this._yanse_window.shuaxin();
				this._yansebz_window.shuaxin();
				this.sxall()
			}
		}
	}
}

//颜色选择
Scene_makeRenwu.prototype.YanSeXuanze =function () {
	var zl = this.dq.zl
	var id = this._yanse_window._index || 0
	var zlm = ww_makeRenwu.make.duzl(zl)
	if (zlm !="nil" && zlm !="err"){
		this.dq.ys = id
		this.dq.ck = 2
		this.dq.xz = false
		this._yansebz_window.shuaxin()
		this.sxall()
		
	}
}

Scene_makeRenwu.prototype.YanSeCancel =function () {
	this.dq.ck = 1
	this._yansebz_window.close()
	this._yanse_window.close()
	this._leixing_window.shuaxin();
	this._leixingbz_window.shuaxin()	
}
Scene_makeRenwu.prototype.sxall = function() {
	this.sxface()
	this.sxtv()
	this.sxsv()
	this.sxtvd()
}

Scene_makeRenwu.prototype.sxface = function() {
	var badds = ww_makeRenwu.make.makeFace(this.ww_makeRenwu)
	ww_makeRenwu.bitmap.makeRenwu2(this._face,badds)
}
Scene_makeRenwu.prototype.sxtv= function() {
	var badds = ww_makeRenwu.make.makeTV(this.ww_makeRenwu )
	ww_makeRenwu.bitmap.makeRenwu2(this._tv,badds)
}
Scene_makeRenwu.prototype.sxsv= function() {
	var badds = ww_makeRenwu.make.makeSV(this.ww_makeRenwu )
	ww_makeRenwu.bitmap.makeRenwu2(this._sv,badds)
}
Scene_makeRenwu.prototype.sxtvd= function() {
	var badds = ww_makeRenwu.make.makeTVD(this.ww_makeRenwu)
	ww_makeRenwu.bitmap.makeRenwu2(this._tvd,badds)
}


Scene_makeRenwu.prototype.createFace = function() {
	this._face = new Bitmap(144,144)
	this._face.fillAll( "#ffff77")
	this._fs = new Sprite(this._face)
	this._fs.x = 160
	this._fs.y = 200
	this.addChild(this._fs);
}
Scene_makeRenwu.prototype.createSV = function() {
    this._sv =new Bitmap(576,384)
    this._sv.fillAll( "#ff7777")
	this._svs =new Sprite(this._sv)
	this._svs.x = 160 + 144 
	this._svs.y = 200
	this._svs.setFrame(576/9,0,576/9*7,384)
	this.addChild(this._svs);
}
Scene_makeRenwu.prototype.createTV = function() {
    this._tv =new Bitmap(144,192)
	this._tv.fillAll( "#7777ff")
	this._tvs =new Sprite(this._tv)
	
	this._tvs.x = 160
	this._tvs.y = 144 + 200 
	this.addChild(this._tvs);
}
Scene_makeRenwu.prototype.createTVD = function() {
	this._tvd =new Bitmap(144,48)
	this._tvd.fillAll( "#ff77ff")
	this._tvds =new Sprite(this._tvd)
	this._tvds.x = 160
	this._tvds.y = 144 + 200 + 192
	this.addChild(this._tvds);
}

Scene_makeRenwu.prototype.update = function() {
	Scene_Base.prototype.update.call(this);
};


//=============================================================================
// 种类选择窗口
//=============================================================================
Window_ZhongLei.prototype = Object.create(Window_Command.prototype);
Window_ZhongLei.prototype.constructor = Window_ZhongLei;
//初始化
Window_ZhongLei.prototype.initialize = function() {
	this.dq = {}
	this.dq.ck = 0
	this.dq.zl = 0
	this.dq.lx = 0
	this.dq.ys = 0
	this.dq.xz = 0
	Window_Command.prototype.initialize.call(this, 0, 0);
	this.select(0);
};


Window_ZhongLei.prototype.processCursorMove = function() {
    if (this.dq.ck == 0 ){
        var lastIndex = this.index();
        if (Input.isRepeated('down')) {
            this.cursorDown(Input.isTriggered('down'));
        }
        if (Input.isRepeated('up')) {
            this.cursorUp(Input.isTriggered('up'));
        }
        if (Input.isRepeated('right')) {
            this.cursorRight(Input.isTriggered('right'));
        }
        if (Input.isRepeated('left')) {
            this.cursorLeft(Input.isTriggered('left'));
        }
        if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.cursorPagedown();
        }
        if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
};

Window_ZhongLei.prototype.processHandling = function() {
    if (this.dq.ck == 0 ) {
        if (this.isOkEnabled() && this.isOkTriggered()) {
            this.processOk();
        } else if (this.isCancelEnabled() && this.isCancelTriggered()) {
            this.processCancel();	    
        } else if (this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.processPagedown();
        } else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.processPageup();
        }
    }
};



Window_ZhongLei.prototype.standardFontSize = function() {
	return 16;
};


//窗口宽
Window_ZhongLei.prototype.windowWidth = function() {
	return 80;
};

Window_ZhongLei.prototype.lineHeight = function() {
	return 20;
};

Window_ZhongLei.prototype.standardPadding = function() {
	return 16;
};
//文本填充
Window_ZhongLei.prototype.textPadding = function() {
	return 0;
};


//制作命令列表
Window_ZhongLei.prototype.makeCommandList = function() {
	var zlbiao = ww_makeRenwu.data.zhongleibiao
	for (var i = 0 ; i < zlbiao.length;i++){
		this.addCommand(zlbiao[i][0], zlbiao[i][1])
	}
};

//处理确定
Window_ZhongLei.prototype.processOk = function() {
	this.callHandler('dianji')
};


//=============================================================================
// 保存 退出 窗口
//=============================================================================

Window_BC.prototype = Object.create(Window_Base.prototype);
Window_BC.prototype.constructor = Window_BC;
//初始化
Window_BC.prototype.initialize = function(text) {
    var width = 80
    var height = this.fittingHeight(1);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this._handlers = {};
    this._text = '';
    this.setText(text)
    
};
Window_BC.prototype.standardFontSize = function() {
	return 16;
};
Window_BC.prototype.lineHeight = function() {
	return 20;
};

Window_BC.prototype.standardPadding = function() {
	return 16;
};
Window_BC.prototype.textPadding = function() {
	return 0;
};
//设置文本
Window_BC.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};
//清除
Window_BC.prototype.clear = function() {
    this.setText('');
};

//刷新
Window_BC.prototype.refresh = function() {
    this.contents.clear();
    this.drawTextEx(this._text, this.textPadding(), 0);
};

Window_BC.prototype.shuaxin = function (){
	this.openness = 0
	var text = "保存"
	this.setText(text)
	this.open()
}


Window_BC.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.dianji()
};

Window_BC.prototype.setHandler = function(symbol, method) {
    this._handlers[symbol] = method;
};
Window_BC.prototype.isHandled = function(symbol) {
    return !!this._handlers[symbol];
};
Window_BC.prototype.callHandler = function(symbol) {
    if (this.isHandled(symbol)) {
        this._handlers[symbol]();
    }
};
Window_BC.prototype.dianji = function() {
    if (this.isOpen()) {
        if (TouchInput.isTriggered()) {
	        var x = this.canvasToLocalX(TouchInput.x);
		    var y = this.canvasToLocalY(TouchInput.y);
		    if(x >= 0 && y >= 0 && x < this.width && y < this.height){
			    this.callHandler("dianji")
		    }
        } 
    } 
};

//=============================================================================
// 类型选择窗口
//=============================================================================

Window_LeiXing.prototype = Object.create(Window_Command.prototype);
Window_LeiXing.prototype.constructor = Window_LeiXing;
Window_LeiXing.prototype.initialize = function() {
	this.dq = {}
	this.dq.ck = 0
	this.dq.zl = 0
	this.dq.lx = 0
	this.dq.ys = 0
	this.dq.xz = 0
	Window_Command.prototype.initialize.call(this, 0, 0);
	this.openness = 0
};

Window_LeiXing.prototype.standardFontSize = function() {
	return 16;
};


Window_LeiXing.prototype.windowWidth = function() {
	return 80;
};

Window_LeiXing.prototype.lineHeight = function() {
	return 20;
};

Window_LeiXing.prototype.standardPadding = function() {
	return 16;
};

Window_LeiXing.prototype.textPadding = function() {
	return 0;
};

Window_LeiXing.prototype.makeCommandList = function() {
	var zlm ="nil"
	zlm = ww_makeRenwu.make.duzl(this.dq.zl )
	if ( zlm =="nil"  ){
		this.addCommand('载入中...','nil')
	}else if(zlm == "err"){
		this.addCommand('错误','err')
	}else{
	    var vari = ww_makeRenwu.data.wjlb.Variation
	    var list =ww_makeRenwu.make.dulxlist(zlm)
	    for (var i =0 ;i < list.length;i++){
		    var name = list[i][0].slice(0,2) + " "+ list[i][1]   
		    var bz = list[i].join(",")
			this.addCommand(name,bz) 
	    }		
	}
};
//

Window_LeiXing.prototype.processCursorMove = function() {
    if (this.dq.ck == 1 ){
        var lastIndex = this.index();
        if (Input.isRepeated('down')) {
            this.cursorDown(Input.isTriggered('down'));
        }
        if (Input.isRepeated('up')) {
            this.cursorUp(Input.isTriggered('up'));
        }
        if (Input.isRepeated('right')) {
            this.cursorRight(Input.isTriggered('right'));
        }
        if (Input.isRepeated('left')) {
            this.cursorLeft(Input.isTriggered('left'));
        }
        if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.cursorPagedown();
        }
        if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
};

Window_LeiXing.prototype.processHandling = function() {
    if (this.dq.ck == 1 ) {
        if (this.isOkEnabled() && this.isOkTriggered()) {
            this.processOk();
        } else if (this.isCancelEnabled() && this.isCancelTriggered()) {
            this.processCancel();	    
        } else if (this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.processPagedown();
        } else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.processPageup();
        }
    }
};


//处理确定
Window_LeiXing.prototype.processOk = function() {
	this.callHandler('dianji')
};

//选择列表
Window_LeiXing.prototype.selectjl = function() {
	var i =0
	var zlm ="nil"
	zlm = ww_makeRenwu.make.duzl(this.dq.zl)
	var jl = this.parent.ww_makeRenwu.jl
	if (zlm != "nil" && zlm != "err" ){
		if (zlm in  jl){
			i = jl[zlm]
		}
	}
	this.dq.lx = i
	this.select(i)
};

Window_LeiXing.prototype.shuaxin = function() {
	  this.openness = 0
	  this.clearCommandList()
	  this.makeCommandList()
	  var width = this.windowHeight() > this.fittingHeight(25) ? this.fittingHeight(25) : this.windowHeight()
	  this.move(this.x, this.y, 80,width )
	  this.refresh()
      this.setTopRow(0)
	  this.selectjl()
	  this.open()
	  this.active = true;
}
//=============================================================================
// 类型帮助窗口
//=============================================================================

Window_LeiXingBZ.prototype = Object.create(Window_Base.prototype);
Window_LeiXingBZ.prototype.constructor = Window_LeiXingBZ;
//初始化
Window_LeiXingBZ.prototype.initialize = function(numLines) {
    var width = 80
    var height = this.fittingHeight(1);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.openness = 0
    this._text = '';
};
Window_LeiXingBZ.prototype.standardFontSize = function() {
	return 16;
};
Window_LeiXingBZ.prototype.lineHeight = function() {
	return 20;
};
Window_LeiXingBZ.prototype.standardPadding = function() {
	return 16;
};
Window_LeiXingBZ.prototype.textPadding = function() {
	return 0;
};

//设置文本
Window_LeiXingBZ.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};
//清除
Window_LeiXingBZ.prototype.clear = function() {
    this.setText('');
};

//刷新
Window_LeiXingBZ.prototype.refresh = function() {
    this.contents.clear();
    this.drawTextEx(this._text, this.textPadding(), 0);
};

Window_LeiXingBZ.prototype.shuaxin = function (){
	this.openness = 0
	var win = this.parent._leixing_window 
	var text =  win._list[win.dq.lx].name
	this.setText(text)
	this.open()
}

//=============================================================================
// 颜色窗口
//=============================================================================

Window_Yanse.prototype = Object.create(Window_Command.prototype);
Window_Yanse.prototype.constructor = Window_Yanse;
Window_Yanse.prototype.initialize = function() {
	this.dq = {}
	this.dq.ck = 0
	this.dq.zl = 0
	this.dq.lx = 0
	this.dq.ys = 0
	this.dq.xz = 0
	Window_Command.prototype.initialize.call(this, 0, 0);
	this.openness =0
};

Window_Yanse.prototype.standardFontSize = function() {
	return 16;
};


Window_Yanse.prototype.windowWidth = function() {
	return 80;
};

Window_Yanse.prototype.lineHeight = function() {
	return 20;
};

Window_Yanse.prototype.standardPadding = function() {
	return 16;
};

Window_Yanse.prototype.textPadding = function() {
	return 0;
};

Window_Yanse.prototype.makeCommandList = function() {
    var zlm ="nil"
	if( this.parent){zlm = ww_makeRenwu.make.duzl(this.parent.dq.zl )}
	if ( zlm =="nil"  ){
		this.addCommand('载入中...','nil')
	}else if(zlm == "err"){
		this.addCommand('错误','err')
	}else{
	    if (zlm in  ww_makeRenwu.data.icolor ){
		    var list = ww_makeRenwu.data.icolor[zlm]
			for (var i =0 ;i < list.length;i++){
			    var name = "颜色 " + i  
			    var bz = "" + i
				this.addCommand(name,bz) 
			}
	    }
	}
};

Window_Yanse.prototype.processCursorMove = function() {
    if (this.dq.ck == 2 ){
        var lastIndex = this.index();
        if (Input.isRepeated('down')) {
            this.cursorDown(Input.isTriggered('down'));
        }
        if (Input.isRepeated('up')) {
            this.cursorUp(Input.isTriggered('up'));
        }
        if (Input.isRepeated('right')) {
            this.cursorRight(Input.isTriggered('right'));
        }
        if (Input.isRepeated('left')) {
            this.cursorLeft(Input.isTriggered('left'));
        }
        if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.cursorPagedown();
        }
        if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.cursorPageup();
        }
        if (this.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
};


Window_Yanse.prototype.processHandling = function() {
    if (this.dq.ck == 2) {
        if (this.isOkEnabled() && this.isOkTriggered()) {
            this.processOk();
        } else if (this.isCancelEnabled() && this.isCancelTriggered()) {
            this.processCancel();	    
        } else if (this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.processPagedown();
        } else if (this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.processPageup();
        }
    }
};



//处理确定
Window_Yanse.prototype.processOk = function() {
	this.callHandler('dianji')
};

//选择列表
Window_Yanse.prototype.selectjl = function() {
	this.select(0)
	this.dq.ys = 0
};

Window_Yanse.prototype.shuaxin = function() {
	  this.openness = 0
	  this.clearCommandList()
	  this.makeCommandList()
	  var width = this.fittingHeight(this.maxItems()) 
	  this.move(this.x, this.y, 80,width )
	  this.refresh()
      this.setTopRow(0)
	  this.selectjl()
	  this.open()
	  this.active = true;
}

//=============================================================================
// 颜色帮助窗口(设置)
//=============================================================================

Window_Yansebz.prototype = Object.create(Window_Base.prototype);
Window_Yansebz.prototype.constructor = Window_Yansebz;
//初始化
Window_Yansebz.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth - 80 * 3
    var height = this.fittingHeight(5);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.chuangjian();
    this.openness = 0
    this._text = '';
};
Window_Yansebz.prototype.standardFontSize = function() {
	return 16;
};
Window_Yansebz.prototype.lineHeight = function() {
	return 24;
};
Window_Yansebz.prototype.standardPadding = function() {
	return 10;
};
Window_Yansebz.prototype.textPadding = function() {
	return 0;
};

Window_Yansebz.prototype.chuangjian = function() {
	this._xz0b =new Bitmap(16*4,16)
	this._xz0b.fontSize = 16
	this._xz0s = new Sprite( this._xz0b)
	this._xz0s.x = 8
	this._xz0s.y = this.standardPadding() + 4
	this._windowSpriteContainer.addChild( this._xz0s)

	
	this._xz1b =new Bitmap(16*3,16)
	this._xz1b.fontSize = 14
	this._xz1b.drawText("初始化",0,0,16*3,16) 
	this._xz1s = new Sprite( this._xz1b)
	this._xz1s.x = this.width - 16* 5
	this._xz1s.y = this.standardPadding() + 4
	this._windowSpriteContainer.addChild( this._xz1s)

	this._xz2b = new Bitmap(255+1+255,10)
	this._xz2b.fillAll( "#ff7777")
	this._xz2s = new Sprite(this._xz2b)
	this._xz2s.x = 16+8+8+8
	this._xz2s.y = this.standardPadding() + this.lineHeight()	+ 8
	this._windowSpriteContainer.addChild( this._xz2s)

	this._xz3b = new Bitmap(255+1+255,10)
	this._xz3b.fillAll( "#77ff77")
	this._xz3s = new Sprite(this._xz3b)
	this._xz3s.x = 16+8+8+8
	this._xz3s.y = this.standardPadding() + this.lineHeight() * 2	+ 8
	this._windowSpriteContainer.addChild( this._xz3s)

	this._xz4b = new Bitmap(255+1+255,10)
	this._xz4b.fillAll( "#7777ff")
	this._xz4s = new Sprite(this._xz4b)
	this._xz4s.x = 16+8+8+8
	this._xz4s.y = this.standardPadding() + this.lineHeight() * 3	+ 8
	this._windowSpriteContainer.addChild( this._xz4s)

	this._xz5b = new Bitmap(255+1+255,10)
	this._xz5b.fillAll( "#777777")
	this._xz5s = new Sprite(this._xz5b)
	this._xz5s.x = 16+8+8+8
	this._xz5s.y = this.standardPadding() + this.lineHeight() * 4	+ 8
	this._windowSpriteContainer.addChild( this._xz5s)


	this._xz2xb = new Bitmap(7,16)
	this._xz2xb.fillAll( "#ff0000")
	this._xz2xs = new Sprite(this._xz2xb)
	this._xz2xs.x = 16+8+8+8 - 3    + 255 + 1  
	this._xz2xs.y = this.standardPadding() + this.lineHeight()	+ 8 - 3
	this._windowSpriteContainer.addChild( this._xz2xs)


	this._xz3xb =  new Bitmap(7,16)
	this._xz3xb.fillAll( "#00ff00")
	this._xz3xs = new Sprite(this._xz3xb)
	this._xz3xs.x = 16+8+8+8 -   3 + 255 + 1
	this._xz3xs.y = this.standardPadding() + this.lineHeight() * 2	+8 -3
	this._windowSpriteContainer.addChild( this._xz3xs)

	this._xz4xb =  new Bitmap(7,16)
	this._xz4xb.fillAll( "#0000ff")
	this._xz4xs = new Sprite(this._xz4xb)
	this._xz4xs.x = 16+8+8+8  -  3 + 255 + 1
	this._xz4xs.y = this.standardPadding() + this.lineHeight() * 3	+8 -3
	this._windowSpriteContainer.addChild( this._xz4xs)

	this._xz5xb = new Bitmap(7,16)
	this._xz5xb.fillAll( "#ffffff")
	this._xz5xs = new Sprite(this._xz5xb)
	this._xz5xs.x = 16+8+8+8 -3 + 255 + 1
	this._xz5xs.y = this.standardPadding() + this.lineHeight() * 4	+8 - 3
	this._windowSpriteContainer.addChild( this._xz5xs)

};

Window_Yansebz.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};

Window_Yansebz.prototype.clear = function() {
    this.setText('');
};


Window_Yansebz.prototype.refresh = function() {
    this.contents.clear();
    this.drawTextEx(this._text, this.textPadding(), 0);
};

Window_Yansebz.prototype.shuaxin = function (){
	this.openness = 0
	if (this.dq.xz){
		var text = "HSLA\nH:\nS:\nL:\nA:\n"
	}else{
		var text = "RGBA\nR:\nG:\nB:\nA:\n"
	}
	var zlm = ww_makeRenwu.make.duzl(this.dq.zl)
	var k = ww_makeRenwu.make.duyskey(zlm,this.dq.lx,this.dq.ys)
	var cjl = this.parent.ww_makeRenwu.cjl
	if (!(k in  cjl)){ cjl[k] ={}}
	if(this.dq.xz){
		if( cjl[k].hsla){
			if( cjl[k].hsla.h){             
				this._xz2xs.x =  this._xz2s.x - 3    +255 + 1 +  cjl[k].hsla.h/180 * 255
			}else{
				this._xz2xs.x = this._xz2s.x - 3     + 255 + 1 
			}
			if( cjl[k].hsla.s){             
				this._xz3xs.x =  this._xz3s.x - 3    +255 + 1 +  cjl[k].hsla.s
			}else{
				this._xz3xs.x = this._xz3s.x - 3     + 255 + 1 
			}
			if( cjl[k].hsla.l){             
				this._xz4xs.x =  this._xz4s.x - 3    +255 + 1 +  cjl[k].hsla.l
			}else{
				this._xz4xs.x = this._xz4s.x - 3     + 255 + 1 
			}
			if( cjl[k].hsla.a){             
				this._xz5xs.x =  this._xz5s.x - 3    +255 + 1 +  cjl[k].hsla.a
			}else{
				this._xz5xs.x = this._xz5s.x - 3     + 255 + 1 
			}
		}else{
			cjl[k].hsla={}
			this._xz2xs.x = this._xz2s.x - 3     + 255 + 1  
			this._xz3xs.x = this._xz3s.x - 3     + 255 + 1  
			this._xz4xs.x = this._xz4s.x - 3     + 255 + 1  
			this._xz5xs.x = this._xz5s.x - 3     + 255 + 1  
		} 
	}else{  
		if( cjl[k].rgba){
			if( cjl[k].rgba.r){             
				this._xz2xs.x =  this._xz2s.x - 3    +255 + 1 +  cjl[k].rgba.r
			}else{
				this._xz2xs.x = this._xz2s.x - 3     + 255 + 1 
			}
			if( cjl[k].rgba.g){             
				this._xz3xs.x =  this._xz3s.x - 3    +255 + 1 +  cjl[k].rgba.g
			}else{
				this._xz3xs.x = this._xz3s.x - 3     + 255 + 1 
			}
			if( cjl[k].rgba.b){             
				this._xz4xs.x =  this._xz4s.x - 3    +255 + 1 +  cjl[k].rgba.b
			}else{
				this._xz4xs.x = this._xz4s.x - 3     + 255 + 1 
			}
			if( cjl[k].rgba.a){             
				this._xz5xs.x =  this._xz5s.x - 3    +255 + 1 +  cjl[k].rgba.a
			}else{
				this._xz5xs.x = this._xz5s.x - 3     + 255 + 1 
			}
		}else{
			 cjl[k].rgba={}
			this._xz2xs.x = this._xz2s.x - 3     + 255 + 1  
			this._xz3xs.x = this._xz3s.x - 3     + 255 + 1  
			this._xz4xs.x = this._xz4s.x - 3     + 255 + 1  
			this._xz5xs.x = this._xz5s.x -3   + 255 + 1  
		} 
	}
	this.setText(text)
	this.open()
}

Window_Yansebz.prototype.dianji = function() {
    if (this.isOpen()) {
        if (TouchInput.isTriggered()) {
	        var x = this.canvasToLocalX(TouchInput.x);
		    var y = this.canvasToLocalY(TouchInput.y);
		    if(x >= 0 && y >= 0 && x < this.width && y < this.height){
			    var id 
			    var x1
			    if( x > this._xz0s.x  && y>= this._xz0s.y  && x < this._xz0s.x+ this._xz0s.width && y <this._xz0s.y+ this._xz0s.height){
					id =0
				} 
				if( x > this._xz1s.x  && y>= this._xz1s.y  &&
					 x < this._xz1s.x+ this._xz1s.width && y <this._xz1s.y+ this._xz1s.height){
					id = 1
					this._xz2xs.x = this._xz2s.x - 3     + 255 + 1  
					this._xz3xs.x = this._xz3s.x - 3     + 255 + 1  
					this._xz4xs.x = this._xz4s.x - 3     + 255 + 1  
					this._xz5xs.x = this._xz5s.x - 3     + 255 + 1  
				}  
			   if( x > this._xz2s.x  && y>= this._xz2s.y  && 
			  		 x < this._xz2s.x+ this._xz2s.width  && y <this._xz2s.y+ this._xz2s.height){
					id = 2;
					x1 = x- this._xz2s.x
					this._xz2xs.x = x - 3
				}
				if( x > this._xz3s.x  && y>= this._xz3s.y  && 
					x < this._xz3s.x+ this._xz3s.width && y <this._xz3s.y+ this._xz3s.height){
					id = 3;
					x1 = x- this._xz3s.x
					this._xz3xs.x = x - 3
				}
				if( x > this._xz4s.x  && y>= this._xz4s.y  && 
					x < this._xz4s.x+ this._xz4s.width && y <this._xz4s.y+ this._xz4s.height){
					id = 4
					x1 = x- this._xz4s.x
					this._xz4xs.x = x - 3
				}    
				if( x > this._xz5s.x  && y>= this._xz5s.y  && 
					x < this._xz5s.x+ this._xz5s.width && y <this._xz5s.y+ this._xz5s.height){
					id = 5
					x1 = x- this._xz5s.x
					this._xz5xs.x = x - 3
				}    
				this.chuli(id,x1)
		    }
        } 
    } 
};
Window_Yansebz.prototype.chuli= function (id,x1) {
	if (id == 0){
		this.dq.xz = !this.dq.xz
		this.shuaxin()
	}else{
		var zlm = ww_makeRenwu.make.duzl(this.dq.zl)
		var k = ww_makeRenwu.make.duyskey(zlm,this.dq.lx,this.dq.ys)
		var cjl = this.parent.ww_makeRenwu.cjl
		if (!(k in  cjl)){ cjl[k] ={}}
		if (id == 1){
			if(this.dq.xz){
				 cjl[k].hsla = {}
			}else{  
				 cjl[k].rgba = {}
			}
		}
		if (id == 2){
			if(this.dq.xz){
				var h =   (x1-(255 + 1))/255 * 180
				if (  cjl[k].hsla ){
					 cjl[k].hsla.h = h
				}else{ 
					 cjl[k].hsla={}
					 cjl[k].hsla.h = h
				}
			}else{
				var r =   x1 - (255 + 1) 
				if (  cjl[k].rgba ){
					 cjl[k].rgba.r = r
				}else{ 
					 cjl[k].rgba={}
					 cjl[k].rgba.r = r
				} 
			}
		}
		if (id == 3){
			if(this.dq.xz){
				var h =   x1 - (255 + 1)
				if (  cjl[k].hsla ){
					 cjl[k].hsla.s = h
				}else{ 
					 cjl[k].hsla={}
					 cjl[k].hsla.s = h
				}
			}else{
				var r =   x1 - (255 + 1) 
				if (  cjl[k].rgba ){
					 cjl[k].rgba.g = r
				}else{ 
					 cjl[k].rgba={}
					 cjl[k].rgba.g = r
				} 
			}
		}
		if (id == 4){
			if(this.dq.xz){
				var h =   x1 - (255 + 1) 
				if (  cjl[k].hsla ){
					 cjl[k].hsla.l = h
				}else{ 
					 cjl[k].hsla={}
					 cjl[k].hsla.l = h
				}
			}else{
				var r =   x1 - (255 + 1) 
				if (  cjl[k].rgba ){
					 cjl[k].rgba.b = r
				}else{ 
					 cjl[k].rgba={}
					 cjl[k].rgba.b = r
				} 
			}
		}
		if (id == 5){
			if(this.dq.xz){
				var h =   x1 - (255 + 1)
				if (  cjl[k].hsla ){
					 cjl[k].hsla.a = h
				}else{ 
					 cjl[k].hsla={}
					 cjl[k].hsla.a = h
				}
			}else{
				var r =   x1 - (255 + 1) 
				if (  cjl[k].rgba ){
					 cjl[k].rgba.a = r
				}else{ 
					 cjl[k].rgba={}
					 cjl[k].rgba.a = r
				} 
			}
		}
		this.parent.sxall()
	}
}
	

Window_Yansebz.prototype.update = function() {
	this.dianji()
    Window_Base.prototype.update.call(this);
};


})();

