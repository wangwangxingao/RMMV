//=============================================================================
// ww_TSG.js
//=============================================================================
/*:
 * @plugindesc 简易图书馆
 * @author wangwang
 *
 * @param  ww_TSG 
 * @desc 图书馆 1.1
 * @default 汪汪
 *
 * @help
 * >><json><< {"name": "图书馆使用方法","status": "汪汪","desc": "ww_TSG.new() 打开 默认图书馆, ww_TSG.goto(tsg,wzlist) 打开 一个新图书馆 选择(ww_TSG.open 打开)对应项目,"}  >><json><<       
 * 图片添加:(目前不支持文字环绕)
 * >><image><< {"url":"img/enemies/Actor1_3.png","x":0,"wx":0.5,"ox":0.5,"size":{"w2":100,"h2":100}} >><image><<
 * 使用方法
 * ww_TSG.new(wzlist) 打开 默认图书馆 选择选择对应项目
 * ww_TSG.goto(tsg,wzlist) 打开 一个新图书馆 选择对应项目
 * ww_TSG.open(tsg,wzlist) 打开 一个新图书馆 并打开对应项目
 *
 *  
 * 图书馆是一个对象  必须包含 name 和 wz 
 *  
 *  {
 *    "name": "名称",
 *	  "wz": "js/plugins/ww_TSG.js",  
 *	  "status": "汪汪", 
 *	  "desc": "测试"
 *    "valid":true  //可不填 当为 false 时 不能使用
 *    "validnr":{"name": "不能使用时显示的内容"} // 当为 "info" 或 未设置 时 显示原本的内容
 *  }
 *
 *  wz可以设置为字符串 ,如果是字符串 则打开 字符串对应 的位置
 *  也可以是数组 ,数组 是 图书馆的一层
 *  也可以是方法 
 *  如 "wz": function () {console.log("不进行操作");return  ;}
 *  如 "wz": function () {console.log("返回一个数组时 进入该层");return ww_TSG._tsg.wz ;}
 *  如 "wz": function () {console.log("返回一个空数组时 进入空层");return [] ;}
 *  如 "wz": function () {ww_TSG.new();console.log("打开 新 图书馆");return  ;}
 *  如 "wz": function () {ww_TSG.goto( {"name":"图书","wz": "js/plugins/ww_TSG.js",);console.log("打开 图书馆/图书");return  ;}}
 *  返回值为 非 字符串或数组 时 不进行操作 , 方法调用后进入
 *
 *
 */

function Scene_TSG() {
    this.initialize.apply(this, arguments);
}


function Window_TSG() {
    this.initialize.apply(this, arguments);
}

function Window_TextList() {
    this.initialize.apply(this, arguments);
}



(function() {


ww_TSG ={}
//ww_TSG =function () {return ww_TSG.scene()}

ww_TSG.new = function (wz,sz) {
    ww_TSG.goto(ww_TSG._tsg ,wz,sz,[1]); 
}
ww_TSG.open = function (obj,wz,sz,clone) {
	var wz = wz || []
	wz.push(-1)
	ww_TSG.goto(obj,wz,sz,clone)
}

ww_TSG.goto = function (obj,wz,sz,clone) {
	ww_TSG.save(obj,wz,sz,clone)
	SceneManager.push(Scene_TSG);
}

//记录
ww_TSG._jl = []
//添加一条记录
ww_TSG.save = function (obj,wz,sz,clone) {
	return ww_TSG._jl.push([obj,wz,sz,clone]) 
};
//读取并删除一条记录
ww_TSG.load = function () {
	return ww_TSG._jl.pop()
};
//清除记录
ww_TSG.clear = function () {
	return ww_TSG._jl=[]
}; 

ww_TSG.scene = function () {
    if(ww_TSG._isScene()){
		return SceneManager._scene
	}else{
		return false
	}
};

ww_TSG.stsg = function () {
 	return  ww_TSG.sz("_tsg")  
}; 
ww_TSG.swz = function () {
 	return  ww_TSG.sz("_wzlist")  
}; 



ww_TSG.snrl = function () {
 	return  ww_TSG.sz("_listWindow")  && ww_TSG.sz("_listWindow")["_nrlist"]
}; 

ww_TSG.sz = function (m) {
    var scene = ww_TSG.scene()
 	return  scene && scene[m]
};

ww_TSG._isNextScene = function () {
	return SceneManager.isNextScene( Scene_TSG )
}; 

ww_TSG._isPreviousScene = function() {
    return  SceneManager.isPreviousScene(Scene_TSG)
};

ww_TSG._isScene = function() {
    return  SceneManager._scene && SceneManager._scene.constructor === Scene_TSG
};




ww_TSG.DeepCopy = function (that) {
	var that = that 
    var obj, i; 
	if (typeof(that) === "object") {  
		if (that === null) {  
  			obj = null;  
		} else if ( Array.isArray(that) ){  //Object.prototype.toString.call(that) === '[object Array]') { 
     		obj = [];  
	        for (var i=0; i<that.length; i++) {  
	          	obj.push(ww_TSG.DeepCopy(that[i]));  
	        }
   	 	} else {  
	   	 	obj = {}
			for (i in that) {
      			obj[i] = ww_TSG.DeepCopy(that[i])  
  			}
    	}
  	} else {
   		obj= that  
  	}  
    return obj;  
};  

ww_TSG._tsg = {
	"name":"图书馆",
	"zjjson":{
		/*>><json><< {"name": "章节设置","status": "汪汪","desc": "\"bz\":\"章节设置的标志\", \"zjid \":\"第%1章\"章节数 , \"zjm\":\"%1\"章节名, \"zjjs\":\"%1\"章节介绍, \"zjsx\":\"%1\"章节属性"} >><json><<*/"bz":">><json><<",
	    "zjid":"第%1章  ",
	    "zjm":"%1",
	    "zjjs":"%1",
	    "zjsx":"%1",
	},
	"status": "图书馆",
	"desc": "这是一个图书馆",
	"wz": "js/plugins/ww_TSG.js",//使用这个直接进入图书
	"wz1":[{     //进入图书馆
		"name": "ww_TSG",
		"wz": [{
				"name": "ww_TSG1",
				"wz": [
					{
						"name": "ww_TSG11",
						"wz": [
							
							{
								"name": "ww_TSG111",
								"wz": [
									{
										"name": "ww_TSG1111",
										"wz": "js/plugins/ww_TSG.js",
										"status": "汪汪",
										"desc": "测试"
									},{
										"name": "ww_TSG1112",
										"wz": function () {console.log(this);return  ;},
										"status": "汪汪",
										"desc": "测试"
									},{
										"name": "ww_TSG1113",
										"wz": function () {ww_TSG.goto( {"name":"图书","wz": "js/plugins/ww_TSG.js"});console.log("打开 图书馆/图书");return  ;},
										"status": "汪汪",
										"desc": "测试"
									}
								],
								"status": "汪汪",
								"desc": "测试"
							},
						],
						"status": "汪汪",
						"desc": "测试"
					},{
						"name": "ww_TSG12",
						"wz": [
							
							{
								"name": "ww_TSG121",
								"wz": [
									{
										"name": "ww_TSG1211",
										"wz": "js/plugins/ww_TSG.js",
										"status": "汪汪",
										"desc": "测试"
									},{
										"name": "ww_TSG1212",
										"wz": function () {console.log("返回一个空数组时 进入空层");return [] ;},
										"status": "汪汪",
										"desc": "测试"
									},{
										"name": "ww_TSG1213",
										"wz": function () {ww_TSG.new();console.log("打开 新 图书馆");return  ;},
										"status": "汪汪",
										"desc": "测试"
									}
								],
								"status": "汪汪",
								"desc": "测试"
							},
						],
						"valid":false,
						/*"validnr":{
							"name":"不显示",
							"status": "汪汪",
						    "desc": "测试",
						},*/
						"status": "汪汪",
						"desc": "测试"
					},
				],
				"status": "汪汪",
				"desc": "测试"
			},
		],
		"status": false,
		"desc": "测试"
	}, ]
}




//删除左右两端的空格
ww_TSG.trim = function (str){ 
	return str.replace(/(^\s*)|(\s*$)/g, "");
}
//删除左边的空格
ww_TSG.ltrim　=　 function (str){ 
	return str.replace(/(^\s*)/g,"");
}
//删除右边的空格
ww_TSG.rtrim　=　 function (str){ 
	return str.replace(/(\s*$)/g, "" );
}


ww_TSG._getnr = function( m,tsg,wzlist) {
	var wzlist =  wzlist  || []
	var tsg = tsg || ww_TSG._tsg 
	var nr = tsg[m] 
	nr =  nr || ww_TSG._tsg[m]
	return ww_TSG.DeepCopy(nr)
};

ww_TSG._get_zjjson = function() {
	return ww_TSG._getnr("zjjson" ,ww_TSG._tsg )  
}; 

ww_TSG._get_wztsg = function(tsg,wzlist ) {
	var wzlist =  wzlist || []
	var tsg = tsg || ww_TSG._tsg
	var wzname = []
	for( var i = 0 ;i<=wzlist.length;i++ ){
		if (typeof(tsg) == "object"){
			wzname.push(tsg.name)
			if(i==wzlist.length){break}
			var id = wzlist[i]
			if(id<0){ break }
			var wz = tsg.wz
			if(typeof(wz) == "function"){
				wz = wz()
			}
			if( Array.isArray(wz) && typeof(wz[id]) == "object"  ){
				tsg = wz[id]
			}else{
				break
			}
		}else{
			break
		}
	}
	return [tsg,wzname]
};

//复制 设置tsg
    ww_TSG._set_tsg2 = function(tsg,obj,cs) {
	var tsg = tsg
    var obj = obj
    var tsg0 ={}
    if(tsg &&  typeof(tsg) == "object"  ){
		if(!cs){
			tsg0 = ww_TSG.DeepCopy(tsg)
		}
		if( obj &&  typeof(obj) == "object"  ){
			for ( i in obj){
				tsg0[i] = ww_TSG.DeepCopy(obj[i]) 
			}
		}
	}
	return tsg0
    };
//设置 tsg






ww_TSG._cl_tsg =function (tsg) {
	for(var i in tsg){
		delete(tsg[i])
	}
}

ww_TSG._set_tsg = function(tsg,obj,cs) {
	var tsg = tsg
    var obj = obj || {}
    var cs = cs || 0
    if(tsg &&  typeof(tsg) == "object"  && obj &&  typeof(obj) == "object" ){   
	    if(cs){
	    	for(var i in tsg){
		    	delete(tsg[i])
	    	}
    	}
		for (var i in obj){
			tsg[i] = obj[i]
		}
	}
	return tsg
};
ww_TSG._set_tsg_wz  = function (tsg,arry,cs) {
	if(tsg && typeof(tsg) == "object" ){
		var arry = arry
		var cs = cs || 0
		if(    Array.isArray(arry)){
			if (!Array.isArray(tsg.wz) || cs ){
				tsg.wz = []
			}
			for(var i=0 ;i<arry.length; i++){
				if(arry[i]){
				    wz[i] = arry[i]
				}
			}
		}
	}

}

//设置 位置处tsg 
ww_TSG._set_wztsg = function(tsg,wzlist,obj,cs) {
	var wztsg = this._get_wztsg(tsg,wzlist)
	var tsg = wztsg[0]
	return this._set_tsg(tsg,obj,cs)
};
//复制 设置 设置处tsg
	ww_TSG._set_wztsg2 = function(tsg,wzlist,obj,cs) {
		var wztsg = this._get_wztsg(tsg,wzlist)
		var tsg = wztsg[0]
		return this._set_tsg2(tsg,obj,cs)
	};
//设置 位置处 wzarry
ww_TSG._set_wztsg_wz = function(tsg,wzlist,arry,cs) {
	var wztsg = this._get_wztsg(tsg,wzlist)
	var tsg = wztsg[0] 
	return this._set_tsg_wz(tsg,arry,cs)
};
/*
ww_TSG._set_wztsg_wzid = function(tsg,wzlist,id,arry,arrycs) {
	var wztsg = this._get_wztsg(tsg,wzlist)
	var tsg = wztsg[0]
    var arry = arry
    var arrycs = arrycs
    if( tsg &&  typeof(tsg) == "object"  ){
		var wz = tsg.wz
		if( Array.isArray(wz)){
			for(var i=0 ;i<arry.length; i++){
				var cs =(arrycs && arrycs[i] ) || 0 
				if(cs==0){
					if(arry[i]){
						wz[i] = arry[i]
					}
				}else{
					wz[i] = arry[i]
				}
			}
			wz[id] = obj
		}
	}
	return tsg
};

*/


//设置原形 
Scene_TSG.prototype = Object.create(Scene_Base.prototype);
//设置创造者
Scene_TSG.prototype.constructor = Scene_TSG;


//初始化
Scene_TSG.prototype.initialize = function() {
	this._textok = null
	this._textnr = null	
	
	this._tsg = null;
	this._wzlist  = null
	//读取记录
	var jl = ww_TSG.load()
	var clone 
	if(jl){this._tsg = jl[0];this._wzlist  =  jl[1];clone = jl[2]}
	this._tsg =  this._tsg || ww_TSG._tsg 
	this._wzlist  = this._wzlist || []
	
	if( clone &&　clone[0]){ this._tsg = ww_TSG.DeepCopy(this._tsg) }
	if( clone &&　clone[1]){ this._wzlist = ww_TSG.DeepCopy(this._wzlist)}
	
	ww_TSG.save(this._tsg ,this._wzlist) 

    Scene_Base.prototype.initialize.call(this);
};




//创建
Scene_TSG.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createBackground();
    this.createWindowLayer();
    this.createBJWindow();
    this.createHelpWindow();
    this.createListWindow();
    this.createHelpListWindow();
};



Scene_TSG.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    var id = this._wzlist.pop() 
	if(id <= -2){
		id =  this._wzlist.pop() 
	}else if(id>=0){
		this._wzlist.push(id)
		id = -1
	}
    this.refresh()
	if(id === undefined){return}
    this._listWindow.select(id ) 
};





//创建背景
Scene_TSG.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
};
//设置背景不透明度
Scene_TSG.prototype.setBackgroundOpacity = function(opacity) {
    this._backgroundSprite.opacity = opacity;
};

Scene_TSG.prototype.createBJWindow = function() {
    this._bjWindow = new Window_TextList();
	this._bjWindow.deactivate();
    this.addWindow(this._bjWindow);
};


Scene_TSG.prototype.createHelpListWindow = function() {
    this._helplistWindow = new Window_TextList();
    this._helplistWindow.setHandler('ok',     this.helplistOk.bind(this));
    this._helplistWindow.setHandler('cancel', this.helplistCancle.bind(this));
    this._helplistWindow.openness = 0;
    this.addWindow(this._helplistWindow);
};



//创建帮助窗口
Scene_TSG.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help(1);
    this.addWindow(this._helpWindow);
};

//创建列表窗口
Scene_TSG.prototype.createListWindow = function() {
    var x = 0;
    var y = this._helpWindow.height;
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight - y;
    this._listWindow = new Window_TSG(x, y, width, height);
    this._listWindow.setHandler('ok',     this.onWzOk.bind(this));
    this._listWindow.setHandler('cancel', this.onWzPop.bind(this));
    this.addWindow(this._listWindow);
};


//创建帮助窗口
Scene_TSG.prototype.HelpWindowSetText = function(list) {
	var w = this._helpWindow
	var width = w.contentsWidth()
	var text = ""
	var lsit = list 
	for(var i=0 ;i<list.length;i++){
		if(i>0){
			text += " < "
		}
		text += list[i]
	}
	if( w.textWidth(text) > width   ){
		var l = text.length
		for (var i= l; i >=0 ;i--){
			if (w.textWidth(text.slice(i,l)) <= width  ){
				text1 = text.slice(i,l)
			}else{
				break
			}
		}
	   	text = text1		
	}
   	w = null
    this._helpWindow.setText(text)
};


//wzID
Scene_TSG.prototype.wzId = function() {
    return this._listWindow.index() ;
};
Scene_TSG.prototype.helpId = function() {
    return this._helplistWindow.index();
};


Scene_TSG.prototype.helplistOk = function() {
	console.log( this._helplistWindow.commandIndex(this._helplistWindow.index() ) );
}

Scene_TSG.prototype.helplistCancle = function() {
	if( this._textnr && this._textnr.mode == 1){
		this.onWzPop() 
	}else{
		this._helplistWindow.deactivate();
	    this._helplistWindow.close()	
	    this._listWindow.activate();
		this._listWindow.open();		
	}
};


Scene_TSG.prototype._getnr = function(m) {
	return ww_TSG._getnr( m,this._tsg , this._wzlist  )
};

Scene_TSG.prototype._get_zjjson = function() {
	return this._getnr("zjjson") 
};

Scene_TSG.prototype._get_wztsg = function() {
	return ww_TSG._get_wztsg(this._tsg ,this._wzlist)
};


 
Scene_TSG.prototype.getwz = function(wzlist) {
	return  this._wzlist 
};



Scene_TSG.prototype.set_nwztsg = function(tsg,cs) {
	ww_TSG._set_wztsg(this._tsg,this._wzlist,tsg,cs)
	this.refresh()
};

Scene_TSG.prototype.set_wztsg = function(wzlist,tsg,cs) {
	ww_TSG._set_wztsg(this._tsg,wzlist,tsg,cs)
	this.refresh() 
};
Scene_TSG.prototype.set_nwztsg_wz = function(wzlist,wz,cs ) {
	ww_TSG._set_wztsg_wz(this._tsg,wzlist,wz,cs)
	this.refresh()
};
Scene_TSG.prototype.set_wztsg_wz = function(wzlist,wz,cs ) {
	ww_TSG._set_wztsg_wz(this._tsg,wzlist,wz,cs)
	this.refresh() 
};

Scene_TSG.prototype.he_reop =function (cs) {
	this._helplistWindow.refresh();
	this._helplistWindow.activate();
	if(!cs){this._helplistWindow.deselect();}
	this._helplistWindow.open()
}




//当保存文件确定
Scene_TSG.prototype.onWzOk = function() {
	var id = this.wzId()
 	var info = this._listWindow._nrlist[id] ;
    if (info) {
	    var valid = info.valid 
	    if(valid !== false){valid = true}
		if (valid){
			if(this._textok && this._textnr ){ 
				if ( this._textnr.mode == 2 ){
					this.tm_22()
				}
			}else{
				//选择位置
				this.pushwz()
			}
		}else{
			this.li_reop()
		}
	}else{
		this._listWindow.activate(); 
	}
	
};

Scene_TSG.prototype.pushwz =function () {
	this._listWindow.openness = 0 
	this._wzlist.push(this.wzId())
	this.refresh() 
	this._listWindow.open();
}



//列表重打开
Scene_TSG.prototype.li_reop =function (se) {
	this._listWindow.refresh();	
    this._listWindow.activate();
	if(!se){this._listWindow.deselect()}
	this._listWindow.open()
}



Scene_TSG.prototype.tm_send =function () {
	if(this._textok && this._textnr){
		//读取后
		this.tm_open()
	}else {
		//没有读取时
		this.tm_nok()
	}
}


Scene_TSG.prototype.tm_open =function () {
	if(this._textnr.mode == 2){
		this.tm_21()
	}else if(this._textnr.mode == 1){
		this.tm_1()
	}
}

Scene_TSG.prototype.tm_nok =function () {
	this._listWindow.deactivate();
	this._helplistWindow._nrlist = []
	this._helplistWindow.refresh();
	this._helplistWindow.openness = 255
}


//文件 模式 2 时 打开方式
Scene_TSG.prototype.tm_21 =function () {
	this._listWindow.openness = 0 
	this._listWindow._nrlist =  this._textnr.mlist    
	this._helplistWindow.deactivate()
    this._helplistWindow.openness = 0
	this.li_reop()
}

//文件 模式 2 时 选择章节
Scene_TSG.prototype.tm_22 =function () {
	this._listWindow.deactivate();
	this._helplistWindow.openness = 0 
	if(this._textnr.mlist[this.wzId()]){
		this._helplistWindow._nrlist =  this._textnr.mlist[this.wzId()].list || []		
	}else {
		this._helplistWindow._nrlist =  []
	}
	this.he_reop()
}


//文件 模式 1 时打开方式
Scene_TSG.prototype.tm_1 =function () {
	this._listWindow.deactivate();
	this._helplistWindow.openness = 0	
	this._helplistWindow._nrlist = this._textnr.list
	this.he_reop()
}




Scene_TSG.prototype.onWzPop = function() {
	if(this._wzlist.length>0 ){
		//退后位置
 		this.popwz()
	}else{
		this.popScene(); 
	}
};




//退后位置
Scene_TSG.prototype.popwz =function () {
	this._helplistWindow.deactivate()
    this._helplistWindow.close();  
	this._listWindow.openness = 0 
	var wz = this._wzlist.pop();
	this.refresh();
	this._listWindow.activate();
	this._listWindow.select(wz);
	this._listWindow.open();
}

Scene_TSG.prototype.popScene = function() {
	ww_TSG.load()
	Scene_MenuBase.prototype.popScene.call(this); 
};
Scene_TSG.prototype.sz = function (obj) {
	if (obj && obj.text){
		obj.mode = 1
		obj.list = obj.text.split("\n")
		var zjjson =  this._get_zjjson()
		var zjjson0 = ww_TSG._get_zjjson()
		var bz = zjjson.bz || zjjson0.bz || ""
		if(bz != "" && obj.text.indexOf(bz) >=0){
			obj.mode = 2
			var mlist = []
			var id = 0 
			var zjid = zjjson.zjid || zjjson0.zjid || ""
			var zjm = zjjson.zjm || zjjson0.zjm || ""
			var zjjs = zjjson.zjjs || zjjson0.zjjs || ""
			var zjsx = zjjson.zjsx || zjjson0.zjsx || ""
			for(var i= 0 ;i< obj.list.length ;i++){
				var lin = obj.list[i]
				if (lin.indexOf(bz) >=0){
					var lins = lin.split(bz)
					id++
					try{ 
						var cs = JSON.parse(lins[1])
						var info =  {}
						var name = cs.name || ""
						info.name =  zjid.format(id)  + zjm.format(name) 
						var status = cs.status || ""
						info.status = zjsx.format(status)
						var  desc = cs.desc || ""
						info.desc =   zjjs.format(desc)
						info.valid = (cs.valid === false) ? false : true
						info.validnr = cs.validnr || "info"
						info.list = []
						mlist.push(info)
					}catch(e){
						var info =  {}
						var name =  ""
						info.name =  zjid.format(id)  + zjm.format(name) 
						var  status = ""
						info.status = zjsx.format(status)
						var  desc = ""
						info.desc =  zjjs.format(desc)	
						info.valid = true
						info.validnr = "info" //{}
						info.list = []
						mlist.push(info)
					}
					var key = lins[0] +  bz + lins[1] + bz
					var lin1 = lin.split(key)[1]
					var lin2 = ww_TSG.trim(lin1)
					if(id>0 && lin2){
						mlist[id-1].list.push(lin1)
					}
				}else{
					if(id>0){
						mlist[id-1].list.push(lin)
					}					
				}
			}
			obj.mlist = mlist
		}
		this.tm_open()
	}
}

Scene_TSG.prototype.send = function (url){
	var url = url;
	if( !this._textnr  || this._textnr.url != url ){
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', url);
	    xhr.overrideMimeType('application/json');
	    var that = this 
	    xhr.onload = function() {
	        if (xhr.status < 400) {
				that._textnr ={}
				that._textnr.url = url
	            that._textnr.text = xhr.responseText
	            that.sz(that._textnr)
	            that._textok = true 
	        }
	    };
	    xhr.onerror = function() {
	        DataManager._errorUrl = DataManager._errorUrl || url;
	    };
	    this._textnr = null
	    this._textok = false
	    xhr.send();
	    return false
	    
	}else{
	    this._textok = true
	    return true
	}
}

Scene_TSG.prototype.refresh =function () {
	//位置
	var wztsg = this._get_wztsg()
	
	var wz = (typeof(wztsg[0]) == "object") ?  wztsg[0].wz : false
	var namelist = wztsg[1] 
	//如果当前是文件位置
	var type = typeof( wz )
	//如果是 方法 
	if(type == "function"){
		var id = this._wzlist.pop()
		var wz = wz.call(this) 
		type = typeof( wz ) 
		if (SceneManager.isNextScene(Scene_TSG)){
			this._wzlist.push(id);
			this._wzlist.push(-2);
			return
		}else{ 
			if (Array.isArray(wz) ||  type  ==  "string"  ) {
				this._wzlist.push(id)
			}
		} 
	}
	if (Array.isArray(wz) ||  type  ==  "string"  ) {
		this.HelpWindowSetText(namelist);
	}
	//如果是字符串
	if(  type ==  "string" ){
		var se  = this.send(wz)
		//发送请求
		this.tm_send()
	//如果是其他请求
	} else {
		//不是文件请求
		this._textok = false
		//是列表时
		if (Array.isArray(wz)){
			this._listWindow._nrlist = wz
			this.li_reop()
		} else{
			//其他时
		    this.li_reop()
		}
	}
}







//设置原形 
Window_TSG.prototype = Object.create(Window_Selectable.prototype);
//设置创造者
Window_TSG.prototype.constructor = Window_TSG;
//初始化
Window_TSG.prototype.initialize = function(x, y, width, height) {
	this._nrlist = []
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.activate();
    this.select(0);
};


//最大项目
Window_TSG.prototype.maxItems = function() {
    return this._nrlist.length ;
};
//最大显示项目
Window_TSG.prototype.maxVisibleItems = function() {
    return 5;
};
//项目高
Window_TSG.prototype.itemHeight = function() {
    var innerHeight = this.height - this.padding * 2;
    return Math.floor(innerHeight / this.maxVisibleItems());
};
//绘制项目
Window_TSG.prototype.drawItem = function(index) {
    var id = index ;
    var info = this._nrlist[id] ;
    var rect = this.itemRectForText(index);
    this.resetTextColor();
    if (info) {
	    var valid = info.valid 
	    if(valid !== false){valid = true}
	    this.contents.paintOpacity =  valid  ? 255 : 100 
        this.drawContents(info, rect, valid );
        this.changePaintOpacity(true);
    }
};

//绘制内容
Window_TSG.prototype.drawContents = function(info, rect,  valid ) {
	//名称

	var x = rect.x 
	var y = rect.y
	var width = rect.width //this.contentsWidth() 
	if(valid){
		var name = info.name || ""
		var desc = info.desc || ""
		var status = info.status || ""
	}else{
		var validnr =  info.validnr || "info"
		if( validnr == "info"  ){
			var validnr = info || {}
		}else{
			var validnr = info.validnr || {}
		}
		  
		var name = validnr.name || ""
		var desc = validnr.desc || ""
		var status = validnr.status || ""
	}
	if (name != "" || status != ""){	
		this.changeTextColor(this.textColor(14))	
		var ll = 0;
		var rl = 0;
		var nl =  this.textWidth(name);
	    var zl =  this.textWidth(status);
		var ol =  this.textWidth(" ");
	    if(nl + zl  <= width - ol){
		    ll = nl;
		    rl = zl;
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
		var text = name 
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
	    //状态
	    this.resetTextColor() 
		this.changeTextColor(this.textColor(9))
		var text =  status
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
	    
	    //介绍
	    this.resetTextColor()
	}
    

	desc = ww_TSG.rtrim(desc)
    if(desc != "" ){
		this.makeFontSmaller()
	    var y = rect.y + this.lineHeight()
		var text = desc
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
	    this.resetFontSettings() 
    }
};


//播放使用

Window_TSG.prototype.playOkSound = function() {
    SoundManager.playOk();
};




//设置原形 
Window_TextList.prototype = Object.create(Window_Selectable.prototype);
//设置创造者
Window_TextList.prototype.constructor = Window_TextList;
//初始化
Window_TextList.prototype.initialize = function(x, y) {
	this._nrlist = []
    this.clearCommandList();
    this.makeCommandList();
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.select(-1);
};
//设置顶部行
Window_Selectable.prototype.setTopRow = function(row) { 
    var scrollY = row.clamp(0, this.maxTopRow()) * this.itemHeight(); 
    if (this._scrollY !== scrollY) { 
        this._scrollY = scrollY;    
	    if (this.contents) { 
	        this.contents.clear(); 
	        this.drawAllItems();
	    } 
        this.updateCursor();
    }
};

//窗口宽
Window_TextList.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};
//窗口高
Window_TextList.prototype.windowHeight = function() {
    return  Graphics.boxHeight  
};
//可见行数
Window_TextList.prototype.numVisibleRows = function() {
    return 10;
};
//最大项目数
Window_TextList.prototype.maxItems = function() {
    return this._list.length;
};
//清除命令列表
Window_TextList.prototype.clearCommandList = function() {
    this._list = [];
};
//制作命令列表
Window_TextList.prototype.makeCommandList = function() {
	var list = this._nrlist 
	for (var i =0 ;i < list.length;i++){
		this.addCommand(list[i],i)
	}
};

//添加命令
Window_TextList.prototype.addCommand = function(text,id) {
	if( text.indexOf(">><image><<")  >=0) {
			var lins = text.split(">><image><<")
			try{  
				var image = JSON.parse(lins[1])
				if (image.url){
					var key = image.url
					//var key2 = JSON.stringify({"url":image.url,"size":image.size}) 
					image.key = JSON.stringify({ "size":image.size}) 
					var key2 = key +":"+ image.key
					
					if (!ImageManager._cache[key2]) {
						if (!ImageManager._cache[key]) {
					        var bitmap = Bitmap.load(key);
					        ImageManager._cache[key] = bitmap;
					    }else{
							var bitmap = ImageManager._cache[key]
					    }
					    var that = this 
					    bitmap.addLoadListener(function() {
							var size = image.size
							if(size){
								var x0 = size.x0 || 0
								var y0 = size.y0 || 0
								var w0 = size.w0 || bitmap.width
								var h0 = size.h0 || bitmap.height
								var x2 = size.x2 || 0
								var y2 = size.y2 || 0
								var w2 = size.w2 || bitmap.width
								var h2 = size.h2 || bitmap.height
								var hue = size.hue || 0 
								var bitmap2 = new Bitmap(x2+w2,y2+h2)
								bitmap2.blt(bitmap,x0,y0,w0,h0,x2,y2,w2,h2)
								bitmap2.rotateHue(hue)
								ImageManager._cache[key2] = bitmap2
							}else{
								var w0 = bitmap.width
								var h0 = bitmap.height
								var bitmap2 = new Bitmap(w0,h0)
								bitmap2.blt(bitmap,0,0,w0,h0,0,0)
								ImageManager._cache[key2] = bitmap2
							} 
						    that.refresh()
					    })
				    }
				    image.h = 0
				    this._list.push( {"lx":"image","image":image ,"lin":id})
				    return
				}
			}catch(e){ 
			}
	}
	var width = this.contentsWidth()  
	var text =  ww_TSG.rtrim(text)
	var text1 = ""
	var text2 = text
	var cs = 0 
	do{ 
		var i = 0
		i++
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
		this._list.push({"lx":"text","text":text1,"lin": id });
		var text1 = ""
	}while(text2.length>0)
};


//命令名
Window_TextList.prototype.commandIndex = function(index) {
    return this._list[index];
};

//命令 行
Window_TextList.prototype.commandLin = function(index) {
    return this._list[index].lin;
};

//命令 图片
Window_TextList.prototype.commandImage = function(index) {
    return this._list[index].image;
};

//命令 类型
Window_TextList.prototype.commandName = function(index) {
    return  this._list[index].lx;
};

//命令 文本
Window_TextList.prototype.commandText = function(index) {
    return  this._list[index].name;
};
//绘制项目
Window_TextList.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
	var item = this.commandIndex(index)
    if( item.image ){
	    var image = item.image 
		var key = image.url +":"+ image.key
		if(ImageManager._cache[key]) { 
			var bitmap =  ImageManager._cache[key] 
			//图片起始
			image.y = image.y || 0
			var x = image.x || 0
			var wx = image.wx || 0
			wx = wx * rect.width 
			var ox = image.ox || 0
			ox = ox * bitmap.width 
			//剩余图片高 
			image.h = image.h  || bitmap.height - image.y
			if( image.h > rect.height ){
				image.h = rect.height 
				var image2 = ww_TSG.DeepCopy(image)
				image2.y = image.y + image.h
				image2.h = 0
			    this._list.splice(index+1,0,{"lx":"image","image" :image2,"lin":item.lin})
			}
			this.contents.blt(bitmap, 0, image.y, bitmap.width, image.h,rect.x + wx - ox + x,rect.y); 
			return
		}
	}
	if(item.text){
		this.resetTextColor();
		this.drawText(item.text, rect.x, rect.y, rect.width, align);
	}

};
//项目文本排列
Window_TextList.prototype.itemTextAlign = function() {
    return 'left';
};

//呼叫 确定处理
Window_TextList.prototype.callOkHandler = function() { 
    this.activate()
    Window_Selectable.prototype.callOkHandler.call(this)
};
//刷新
Window_TextList.prototype.refresh = function() {
    this.clearCommandList();
    this.makeCommandList();
    this.createContents();
    Window_Selectable.prototype.refresh.call(this);
};


Window_TextList.prototype.drawAllItems = function() { 
    var topIndex = this.topIndex(); 
    for (var i = 0; i < this.maxPageItems(); i++) {
        var index = topIndex + i; 
        if (index < this.maxItems()) {  
            this.drawItem(index);
        }
    }
};

Window_TextList.prototype.processCursorMove = function() {
	//如果光标能移动
    if (this.isCursorMovable()) {
	    //最后的索引
        var lastIndex = this.index();
        //是重复 down
        if (Input.isRepeated('down')) {
            this.cursorDown(Input.isTriggered('down'));
        }
        //是重复 up
        if (Input.isRepeated('up')) {
            this.cursorUp(Input.isTriggered('up'));
        }
        //是重复 right
        if (Input.isRepeated('right')) {
            this.cursorRight(Input.isTriggered('right'));
            this.cursorPagedown();
        }
        //是重复 left
        if (Input.isRepeated('left')) {
	        //光标左
            this.cursorLeft(Input.isTriggered('left'));
            this.cursorPageup();
        }
        //是pagedown处理者 不存在并且按下 pagedown
        if (!this.isHandled('pagedown') && Input.isTriggered('pagedown')) {
            this.cursorPagedown();
        }
        //是pageup处理者不存在并且按下 pageup
        if (!this.isHandled('pageup') && Input.isTriggered('pageup')) {
            this.cursorPageup();
        }
        //如果 索引 不等于 最后的索引
        if (Math.abs(this.index() - lastIndex )  > 5) {
	        SoundManager.playCursor();
        }
    }
};

/*

滚动帮助窗口
function Window_ScrollHelp() {
    this.initialize.apply(this, arguments);
}


//设置原形 
Window_ScrollHelp.prototype = Object.create(Window_Help.prototype);
//设置创造者
Window_ScrollHelp.prototype.constructor = Window_ScrollHelp;

Window_ScrollHelp.prototype.initialize = function(numLines) {
    Window_Help.prototype.initialize.call(this,numLines);
    this._id = 0
	this._wz = 0
	this._list = []
};



//更新
Window_ScrollHelp.prototype.update = function() {
    Window_Help.prototype.update.call(this);
 	if (this._text0 != this._text) {
	 	if ( (this._id * this.speed()) / 60  >= 1){
			this.updateMessage();
			this._id = 0 
		} 
		this._id++
    }
};

Window_ScrollHelp.prototype.setText = function(text) {
	this._id = 0
	this._wz = 0
	this._list = []
    if (this._text0 !== text) {
        this._text0 = text;
   		this._text = null
    }
};


//更新信息
Window_ScrollHelp.prototype.updateMessage = function() {
	var text = this._text0
	var width = this.contentsWidth()
	if( this.textWidth(text) <= width ){
   		this._text = this._text0 
	}else{
		var text2 = text + "               " 
		if(this._wz == text2.length){
			this._wz = 0
		}
	
		text2 +=  text 
		var wz = this._wz	
		if(this._list[wz]){
			this._text = this._list[wz] 
		}else{
			for (var i= wz ; i <= text2.length;i++){
				if (this.textWidth(text2.slice(wz,i)) <= width  ){
					text1 = text2.slice(wz,i)
				}else{
					break
				}
			}
	   		this._text = text1
	   		this._list[wz] = text1
		}
		this._wz++ 
	}
    this.refresh();
};


//是快发送
Window_ScrollHelp.prototype.speed= function() {
    return 6;
};

*/

})();


