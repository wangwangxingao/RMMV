//=============================================================================
// ww_PluginManager.js
//=============================================================================
/*:
 * @plugindesc 插件管理器
 * @author wangwang
 *
 * @param  ww_PluginManager 
 * @desc 确定是插件管理器的参数,请勿修改
 * @default 汪汪
 *
 * @help
 * 插件管理器  
 * 使用 SceneManager.push(Scene_PM) 打开调试界面,从而控制插件开关
 * 当 本插件 关闭 时读取原有插件设置, 打开 时读取储存在 config 里的 plugins 
 *
 */




function Scene_PM() {
    this.initialize.apply(this, arguments);
}
function Scene_PMi() {
    this.initialize.apply(this, arguments);
}

function Window_PM() {
    this.initialize.apply(this, arguments);
}

function Window_HelpList() {
    this.initialize.apply(this, arguments);
}

(function() {


ConfigManager.makeData = function() {
    var config = {};
    config.alwaysDash = this.alwaysDash;
    config.commandRemember = this.commandRemember;
    config.bgmVolume = this.bgmVolume;
    config.bgsVolume = this.bgsVolume;
    config.meVolume = this.meVolume;
    config.seVolume = this.seVolume;
    config.plugins = $plugins
    return config;
};

ConfigManager.loadPlugin = function() {
    var json;
    var config = {};
    try {
        json = StorageManager.load(-1);
    } catch (e) {
        console.error(e);
    }
    if (json) {
        config = JSON.parse(json);
    }
    $plugins = config.plugins ||  $plugins

};



PluginManager.pluginsInitf = function () {
	var ww_PluginManager = false 
    for (var i=0;i<$plugins.length;i++){
	    var plugin = $plugins[i]
	    if (plugin.parameters["ww_PluginManager"] == "汪汪" ){
		    if(plugin.status == false ){
			    PluginManager.pluginsInit()
		    }
	    }
	}
} 

PluginManager.pluginsInit = function (status) {
	$plugins = PluginManager.pluginsIni.slice(0)
} 

PluginManager.pluginsIni = $plugins.slice(0)
ConfigManager.loadPlugin();
PluginManager.pluginsInitf();
PluginManager.setup($plugins);


String.prototype.trim = function (){ //删除左右两端的空格
　　 return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim　=　 function (){ //删除左边的空格
　　 return this.replace(/(^\s*)/g,"");
}
String.prototype.rtrim　=　 function (){ //删除右边的空格
　　 return this.replace(/(\s*$)/g, "" );
}



//设置原形 
Scene_PM.prototype = Object.create(Scene_MenuBase.prototype);
//设置创造者
Scene_PM.prototype.constructor = Scene_PM;
//初始化
Scene_PM.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};
//创建
Scene_PM.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this); 
    this.createHelpWindow();
    this.createListWindow();
};
//开始
Scene_PM.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._listWindow.refresh();
};


Scene_PM.prototype.makeList =function () {
	var list = []
	for(var i=0 ;i<$plugins.length;i++ ){
		var info ={}
		info.param = $plugins[i].name
		info.default = $plugins[i].status
		info.desc =$plugins[i].description 
		list.push(info)
	}
	return list;
}

//保存文件id
Scene_PM.prototype.savefileId = function() {
    return this._listWindow.index() ;
};

//创建帮助窗口
Scene_PM.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help(1);
    this._helpWindow.setText(this.helpWindowText());
    this.addWindow(this._helpWindow);
};
//创建列表窗口
Scene_PM.prototype.createListWindow = function() {
    var x = 0;
    var y = this._helpWindow.height;
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight - y;
    this._listWindow = new Window_PM(x, y, width, height);
    this._listWindow._nrlist = this.makeList()
    this._listWindow.setHandler('ok',     this.onSavefileOk.bind(this));
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    this._listWindow.refresh();
    this.addWindow(this._listWindow);
};
//模式
Scene_PM.prototype.mode = function() {
    return null;
};
//活动列表窗口
Scene_PM.prototype.activateListWindow = function() {
    this._listWindow.activate();
};
//帮助窗口文本
Scene_PM.prototype.helpWindowText = function() {
    return '插件管理器';
};
//第一个保存文件索引
Scene_PM.prototype.firstSavefileIndex = function() {
    return 0;
};
//当保存文件确定
Scene_PM.prototype.onSavefileOk = function() {
	SceneManager.push(Scene_PMi)
	SceneManager.prepareNextScene (this.savefileId() );
};

Scene_PM.prototype.popScene = function() {
    ConfigManager.save()
 	Scene_MenuBase.prototype.popScene.call(this);
 	//this.saveReload() //保存到1号存档并刷新
};

//保存到1号存档并刷新
Scene_PM.prototype.saveReload=function () {
    $gameSystem.onBeforeSave();
	alert("保存到1号存档:" + DataManager.saveGame(1))
    location.reload();	
}


//设置原形 
Scene_PMi.prototype = Object.create(Scene_MenuBase.prototype);
//设置创造者
Scene_PMi.prototype.constructor = Scene_PMi;
//初始化
Scene_PMi.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};
Scene_PMi.prototype.prepare = function(id) {
	this.pluginsEN = null
	this.pluginsNr = null
    this.pluginId = id
    this._helpl = 0
    this._nrl = 0
    this.send(id)
};


Scene_PMi.prototype.isReady = function() {
    return this.pluginsEN && Scene_MenuBase.prototype.isReady.call(this);
};

//创建
Scene_PMi.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
};

//开始
Scene_PMi.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);    
    this.createHelpWindow();
    this.createListWindow();
    this.createHelpListWindow();
    this._listWindow.refresh();
};


Scene_PMi.prototype.makeList = function() {
    var list = []
    var info 
	info ={}
	info.param = "作者:"  
	info.default = this.pluginsNr.status 
	info.desc= "" + this.pluginsNr.author 
	list.push(info)		
	info ={}
	info.param = "描述:"  
	info.default = this.pluginsNr.text.length 
	info.desc= "" + this.pluginsNr.desc 
	list.push(info)		
	info = {}
	info.param = "帮助:"  
	info.default = "" + this.pluginsNr.help.length +" 行"
	info.desc= "显示插件帮助文字" 
	list.push(info)
    var parlist = this.pluginsNr.parlist
	for(var i=0 ;i< parlist.length;i++ ){
		info ={}
		info.param = parlist[i].param
		info.default = parlist[i].default
		info.desc = parlist[i].desc 
		list.push(info)
	}
	return list
};



//保存文件id
Scene_PMi.prototype.savefileId = function() {
    return this._listWindow.index() ;
};

//创建帮助窗口
Scene_PMi.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help(1);
    this._helpWindow.setText(this.helpWindowText());
    this.addWindow(this._helpWindow);
};

//创建帮助窗口
Scene_PMi.prototype.createHelpListWindow = function() {
    this._helplistWindow = new Window_HelpList();
    this._helplistWindow.setHandler('ok',     this.helplistOk.bind(this));
    this._helplistWindow.setHandler('cancel', this.helplistCancle.bind(this));
    this.addWindow(this._helplistWindow);
};


Scene_PMi.prototype.helplistOk = function() {
	
};

Scene_PMi.prototype.helplistCancle = function() {
	if( this.savefileId() == 1){
    	this._nrl = this._helplistWindow.index()
	}else if( this.savefileId() == 2){
    	this._helpl = this._helplistWindow.index()
	}
	this._helplistWindow.deactivate();
    this._helplistWindow.close()
	this._listWindow.refresh()
   	this._listWindow.activate();
   	
};




//创建列表窗口
Scene_PMi.prototype.createListWindow = function() {
    var x = 0;
    var y = this._helpWindow.height;
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight - y;
    this._listWindow = new Window_PM(x, y, width, height);
    this._listWindow._nrlist = this.makeList()
    this._listWindow.setHandler('ok',     this.onSavefileOk.bind(this));
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    this._listWindow.refresh();
    this.addWindow(this._listWindow);
};
//模式
Scene_PMi.prototype.mode = function() {
    return null;
};

//帮助窗口文本
Scene_PMi.prototype.helpWindowText = function() {
    return  this.pluginsNr.name ;
};
//第一个保存文件索引
Scene_PMi.prototype.firstSavefileIndex = function() {
    return 0;
};




//当保存文件确定
Scene_PMi.prototype.onSavefileOk = function() {
	var nr =this._listWindow._nrlist[this.savefileId()]
	if(  this.savefileId() == 0 ){
		nr.default  = !nr.default 
		this._listWindow.refresh()
   		this._listWindow.activate();
	}else if( this.savefileId() >= 3  ){
		var zhi = prompt( nr.desc ,nr.default )
		if (zhi!= null && zhi != nr.default){
		    nr.default = zhi
			this._listWindow.refresh()
		}
   		this._listWindow.activate();
	}else {
		if( this.savefileId() == 1){
			this._helplistWindow._nrlist = this.pluginsNr.list  
   			this._helplistWindow.select(this._nrl);
			
		}else if( this.savefileId() == 2){
			this._helplistWindow._nrlist = this.pluginsNr.help  
   			this._helplistWindow.select(this._helpl);
		}
		this._helplistWindow.refresh()
		this._listWindow.deactivate();
		this._helplistWindow.activate();
	    this._helplistWindow.open()
	}
};







Scene_PMi.prototype.popScene = function() {
	var id = this.pluginId 
	if ( $plugins[id] && this._listWindow){
		var plugin = $plugins[id]
		var list = this._listWindow._nrlist
		if(list[0].default != plugin.status){
			plugin.status = list[0].default 
		}
		for(var i = 3;i<list.length ;i++){
			var param = list[i].param
			if( (param in plugin.parameters) && list[i].default !=  plugin.parameters[param] ){
				plugin.parameters[param] = list[i].default
			}
		}
	}
	ConfigManager.save()
    Scene_MenuBase.prototype.popScene.call(this);
};


Scene_PMi.prototype.sz = function (obj) {
	if (obj && obj.text){
		obj.list = obj.text.split("\n")
		var id = obj.id
		obj.name = $plugins[id].name
	    obj.desc = $plugins[id].description
	    obj.status = $plugins[id].status
	    obj.parameters = $plugins[id].parameters
		obj.parlist = []
		var zs = false
		var cs = []
		var csi = -1
		var help = []
		var helpkg = false
		for(var i= 0 ;i< obj.list.length ;i++){
			var lin = obj.list[i]
			if (  (lin.indexOf("/*") >= 0) && 
			      (lin.indexOf("//") <0 ||( lin.indexOf("//") > lin.indexOf("/*")  ) )
			){
				zs = true;
			}
			if ( zs == true &&  (lin.indexOf("*/") >= 0) && 
			      (lin.indexOf("//") <0 || ( lin.indexOf("//") > lin.indexOf("*/")  ) )
			){
				zs = false;
				helpkg = false
			}
			if(zs == true){
				if(lin.indexOf("@help") >= 0){
					helpkg = true
					continue
				}
				if( helpkg == false ){
					if(lin.indexOf("@author ") >= 0){
						var zhi = lin.split("@author ")[1]
						obj.author =  zhi.trim()
					}
					if(lin.indexOf("@param ") >= 0){
						csi += 1
						cs[csi] = cs[csi]  || {}
						var zhi = lin.split("@param ")[1]
						cs[csi].param = zhi.trim()
					}
					if(lin.indexOf("@desc ") >= 0){
						cs[csi] = cs[csi]  || {}
						var zhi = lin.split("@desc " )[1]
						cs[csi].desc = zhi.trim()
					}				
					if(lin.indexOf("@default ") >= 0){
						cs[csi] = cs[csi]  || {}
						var zhi = lin.split("@default ")[1]
						cs[csi].default = zhi.trim()
					}
				}else{
					help.push(lin)
				}
			}
		}
		obj.help = help
		for(var i = 0; i <cs.length;i++){
			if (cs[i].param){
				if (cs[i].param in obj.parameters ){
					cs[i].default = obj.parameters[cs[i].param]
					cs[i].desc = cs[i].desc || ""
					obj.parlist.push(cs[i]) 
				}
			}
		}
	}
}

Scene_PMi.prototype.send = function (id){
	if($plugins[id]  && this.pluginsEN !== false ){
		var name = $plugins[id].name
	    var xhr = new XMLHttpRequest();
	    var url = 'js/plugins/'+ name+ ".js";
	    xhr.open('GET', url);
	    xhr.overrideMimeType('application/json');
	    var that = this 
	    xhr.onload = function() {
	        if (xhr.status < 400) {
				that.pluginsNr ={}
	            that.pluginsNr.id = id
	            that.pluginsNr.text = xhr.responseText
	            that.sz(that.pluginsNr)
	            that.pluginsEN = true 
	        }
	    };
	    xhr.onerror = function() {
	        DataManager._errorUrl = DataManager._errorUrl || url;
	    };
	    this.pluginsNr = null
	    this.pluginsEN = false
	    xhr.send();
	}
}




//设置原形 
Window_PM.prototype = Object.create(Window_Selectable.prototype);
//设置创造者
Window_PM.prototype.constructor = Window_PM;
//初始化
Window_PM.prototype.initialize = function(x, y, width, height,list) {
	this._nrlist = []
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.activate();
    this.select(0);
};

//最大项目
Window_PM.prototype.maxItems = function() {
    return this._nrlist.length ;
};
//最大显示项目
Window_PM.prototype.maxVisibleItems = function() {
    return 5;
};
//项目高
Window_PM.prototype.itemHeight = function() {
    var innerHeight = this.height - this.padding * 2;
    return Math.floor(innerHeight / this.maxVisibleItems());
};
//绘制项目
Window_PM.prototype.drawItem = function(index) {
    var id = index ;
    var info = this._nrlist[id] ;
    var rect = this.itemRectForText(index);
    this.resetTextColor();
    if (info) {
	    var valid = info.default 
	    this.contents.paintOpacity = valid  ? 255 : 100 
        this.drawContents(info, rect, valid);
        this.changePaintOpacity(true);
    }
};

//绘制内容
Window_PM.prototype.drawContents = function(info, rect, valid) {
	this.drawZT(info, rect.x , rect.y, rect.width);
    var y = rect.y + this.lineHeight() //rect.height;
    this.drawDesc(info, rect.x, y, rect.width);
};

//绘制文件id
Window_PM.prototype.drawZT = function(info, x, y,width) {
	this.changeTextColor(this.textColor(14))
	var width = width //this.contentsWidth()  
	var ll = 0
	var rl = 0
	
	var nl =  this.textWidth(info.param )
    var zl =  this.textWidth(info.default)
	var ol =  this.textWidth(" " )
    if(nl + zl  <= width - ol){
	    ll = nl
	    rl = zl
    }else{
	    if(zl <= (width-ol) /2){
		    ll = width - ol - zl
		    rl = zl
	    }else if(nl <= (width-ol) /2){
		    ll = nl 
		    rl = width - ol - nl
	    }else{
		    ll = width /2
		    rl = width /2
	    }
    }
	var text = info.param 
	var text1 = text
	if(  this.textWidth(text) > ll  ){
		for (var i= 0 ; i<=text.length;i++){
			if (this.textWidth( text.slice(0,i)) < ll  ){
				text1 = text.slice(0,i)
			}else{
				break
			}
		}
	}
    this.drawText(text1, x, y,width,"left");
    this.resetTextColor()    
    
    var i = info.default  ? 9 : 10
	this.changeTextColor(this.textColor(i))
	var text =  info.default
	var text1 = text
	if(  this.textWidth(text) > rl  ){
		for (var i= 0 ; i<=text.length;i++){
			if (this.textWidth( text.slice(0,i)) < rl  ){
				text1 = text.slice(0,i)
			}else{
				break
			}
		}		
	}
    this.drawText(text1, x, y,width,'right');
    this.resetTextColor()
};




//绘制说明
Window_PM.prototype.drawDesc = function(info, x, y,width) {
	this.makeFontSmaller()
    if (info.desc) {
		var text = info.desc.rtrim()
		var text1 = text
		var text2 = ""
		for (var i= 0 ; i<=text.length;i++){
			if (this.textWidth( text.slice(0,i)) < width  ){
				text1 = text.slice(0,i)
				text2 = text.slice(i)
			}else{
				break
			}
		}
		text = text2
		for (var i= 0 ; i<=text.length;i++){
			if (this.textWidth( text.slice(0,i)) < width  ){
				text2 = text.slice(0,i)
			}else{
				break
			}
		}
		this.drawText( "" + text1, x, y, width ) //, 'left');
		this.drawText( "" + text2, x, y + this.lineHeight()  , width) //, 'left');
	
    }
    this.resetFontSettings() 
};
//播放使用
Window_PM.prototype.playOkSound = function() {
};




//设置原形 
Window_HelpList.prototype = Object.create(Window_Selectable.prototype);
//设置创造者
Window_HelpList.prototype.constructor = Window_HelpList;
//初始化
Window_HelpList.prototype.initialize = function(x, y) {
	this._nrlist = []
    this.clearCommandList();
    this.makeCommandList();
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.select(0);
    this.openness = 0;
    
    //this.activate();
    
};


//窗口宽
Window_HelpList.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};
//窗口高
Window_HelpList.prototype.windowHeight = function() {
    return  Graphics.boxHeight  
};
//可见行数
Window_HelpList.prototype.numVisibleRows = function() {
    return 10;
};
//最大项目数
Window_HelpList.prototype.maxItems = function() {
    return this._list.length;
};
//清除命令列表
Window_HelpList.prototype.clearCommandList = function() {
    this._list = [];
};
//制作命令列表
Window_HelpList.prototype.makeCommandList = function() {
	var list = this._nrlist 
	for (var i =0 ;i < list.length;i++){
		this.addCommand(list[i])
		
	}
};
//SceneManager.push(Scene_PM)
//添加命令
Window_HelpList.prototype.addCommand = function(text) {
	var width = this.contentsWidth()  
	var text = text.rtrim()
	var text1 = ""
	var text2 = text
	var cs = 0 
	do{ 
		if ( this.textWidth(text)   <= width  ){
			text1 = text
			text2 = ""
		}else{
			if (this.textWidth(text.slice(0,cs)) <= width   ){
				for (var i= cs ; i<=text.length;i++){
					if (this.textWidth(text.slice(0,i)) <= width  ){
						text1 = text.slice(0,i)
						text2 = text.slice(i)
						
					}else{
						cs = i 
						text = text2
						break
					}
				}			
			}else{
				for (var i= cs ; i>=0;i--){
					if (this.textWidth(text.slice(0,i)) <= width  ){
						text1 = text.slice(0,i)
						text2 = text.slice(i)
						cs = i 
						text = text2
						break					
					}
				}		
			}
			
		}
		this._list.push(text1);
		var text1 = ""
	}while(text2.length>0)
};
//命令名
Window_HelpList.prototype.commandName = function(index) {
    return this._list[index];
};

//绘制项目
Window_HelpList.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    this.resetTextColor();
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};
//项目文本排列
Window_HelpList.prototype.itemTextAlign = function() {
    return 'left';
};

//呼叫 确定处理
Window_HelpList.prototype.callOkHandler = function() {
    this.activate()
};
//刷新
Window_HelpList.prototype.refresh = function() {
    this.clearCommandList();
    this.makeCommandList();
    this.createContents();
    Window_Selectable.prototype.refresh.call(this);
};



})();


