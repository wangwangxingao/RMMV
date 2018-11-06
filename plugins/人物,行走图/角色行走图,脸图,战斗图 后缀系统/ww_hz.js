//=============================================================================
// ww_hz.js
//=============================================================================
/*:
 * @plugindesc 角色行走图,脸图,战斗图 后缀系统
 * @author wangwang
 *
 * @help
 *==========================================================
 * 脚本会 使用 ww_hz.load() 通过 ww_hz.loadFile() 读取
 * 'img/faces.json',
 * 'img/sv_actors.json',
 * 'img/characters.json' 
 * 如果不能读取,会尝试使用方法 ww_hz.filesload() 
 * 试图读取 'img/faces','img/sv_actors','img/characters' 里面的全部文件名 
 * 并保存为
 * 'img/faces.json','img/sv_actors.json','img/characters.json'
 * 发布时 在确保 'img/faces.json','img/sv_actors.json','img/characters.json' 存在情况下,可以修改脚本,
 * 把可替换部分替换为 目前被注释掉的 可替换部分 
 *==========================================================
 * mv 内设置
 * 在角色注释,职业注释,技能注释,状态注释,武器防具注释中添加 后缀内容 
 *  假设是"hzm" 
 * <fhz:hzm> 添加 脸图 后缀 hzm
 * <bhz:hzm> 添加 战斗图 后缀 hzm
 * <chz:hzm> 添加 行走图 后缀 hzm
 *  假设是"tj" 
 * <fhz:tj> 添加 脸图 后缀 tj
 * <bhz:tj> 添加 战斗图 后缀 tj
 * <chz:tj> 添加 行走图 后缀 tj
 *==========================================================
 * 图片设置
 * 以 Actor1.png 为例
 * 在基础图片名 "Actor1" 后添加  "_awdwd" 表示 是 后缀替换文件
 * 也就是    Actor1_awdwd.png (不建议不带后缀,就这样命名)
 * 后面 添加后缀 , 如 添加 后缀 "hzm"  ,使用 "_" 分隔开
 * 也就是 Actor1_awdwd_hzm.png
 *
 * 如果再添加 后缀 ,比如  后缀 "tj"  , 同上
 * 也就是 Actor1_awdwd_hzm_tj.png
 *
 * 当然再添加 后缀 可以是之前已经有的后缀,比如  后缀 "hzm"  
 * 也就是 Actor1_awdwd_hzm_hzm.png 
 * 大概是主角玩二刀流吧, 
 * 后缀没有顺序要求
 *
 *==========================================================
 * 脚本运行说明 :
 * 以 脸图为例
 * 当 角色 (假设原脸图名为 "Actor1" ) 
 * 当这个角色 的  角色注释,职业注释,技能注释,状态注释,武器防具注释  中 
 * 比如 存在 <fhz:hzm> 时
 * 脚本会 寻找 "Actor1_awdwd_hzm.png" 
 * (
 *    额,如果上面注释中有2个 就是 "Actor1_awdwd_hzm_hzm.png" ,以此类推,
 *    找不到 "Actor1_awdwd_hzm_hzm.png" 会退而求其次,找 "Actor1_awdwd_hzm.png" 
 *  )
 * 如果找到 ,则修改角色脸图为 "Actor1_awdwd_hzm"
 * (
 *    额,如果上面注释中有2个 就是 "Actor1_awdwd_hzm_hzm" ,以此类推,
 *    找到,则修改角色脸图为 "Actor1_awdwd_hzm_hzm"
 *    找不到 "Actor1_awdwd_hzm_hzm.png" 会退而求其次,找 "Actor1_awdwd_hzm.png" 
 *    如果找到 ,则修改角色脸图为 "Actor1_awdwd_hzm"
 *  )
 * 
 * 实际上,脚本会把 角色注释,职业注释,技能注释,状态注释,武器防具注释 中的 <fhz:xxx> 添加进一个数组
 * 然后 把文件名 中的后缀变成数组
 * 然后对比文件名中 后缀 的数组 与  注释中 后缀 的数组 
 * 进行权重计算, 原文件名为 0 , 无后缀为 1 ,
 * 每有一个后缀 符合 ,权重 + 2 
 * 并将 其从 文件名中 后缀 的数组 与  注释中 后缀 的数组  中删除
 * 如果有一个 文件名中 后缀 不在 注释中后缀的数组中存在 时 不再计算这一个, 开始计算下一个
 * 最后选择 权重最大者 作为要替换的 文件名 
 *==========================================================
 *冲突可能:
 *  修改部分:
 *  Game_Actor.prototype.refresh 
 * 	Game_Actor.prototype.discardEquip 
 *	Game_Actor.prototype.learnSkill
 *	Game_Actor.prototype.forgetSkill
 *  Game_Actor.prototype.setCharacterImage 
 *  Game_Actor.prototype.setFaceImage
 *  Game_Actor.prototype.setBattlerImage
 *  以上修改部分都是添加 this.hzChang
 *  添加部分:
 *  Game_Actor.prototype.hzChang
 *  Game_Actor.prototype.getHz
 *bug可能:
 *   初学,脚本写错
 *
 * 
 *==========================================================
 */




(function() {

	ww_hz = {}
	ww_hz._data ={}
	ww_hz._ok={}



	//===========================================
	//可替换
	ww_hz.loadFile = function(url,fu,stfu,errfu) {
		stfu && stfu(url)
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', url+".json");
	    xhr.overrideMimeType('application/json');
	    xhr.onload = function() {
	        if (xhr.status < 400) {
	            fu && fu(JSON.parse(xhr.responseText),url)
	        }
	    };
	    xhr.onerror = function() { 
		    errfu && errfu(url)
		};
	    xhr.send();
	};
 	ww_hz.filesload = function (url,fuc) {
	 	var fs = require('fs');
	 	
		if (typeof require === 'function' && typeof process === 'object') {
            var path = require('path');
            var base = path.dirname(process.mainModule.filename);
            /* 打包时 
            if (path.basename(base) == "www") {
                var base = path.dirname(base);
            } 
            */
            var path = base;
        }else{
            var path = ""
		}
		var path = path + url
		fs.readdir(
			path,
			function(err, files){
				fuc(files,url)
			}
		)
	}
	ww_hz.saveJSON = function(json,url) {
		var data = JSON.stringify(json);
		var path = require('path');
        var path = path.dirname(process.mainModule.filename);
        /* 打包时 
        if (path.basename(base) == "www") {
            var base = path.dirname(base);
        } 
        */ 
        
		var fs = require('fs');
		fs.writeFile(path, data);
		return data;
	};
    //读取成功时
    ww_hz.fu = function (json,url) {
	    ww_hz.ed(url)
	    ww_hz._data[url]= json
	};
	//读取失败时
    ww_hz.errfu = function (url) {
	    ww_hz.st(url)
	    ww_hz.filesload(url,ww_hz.fu2)
	};
    //文件夹读取成功时
    ww_hz.fu2 = function (files,url) {
	    ww_hz.ed(url)
	    ww_hz._data[url]= files
	    ww_hz.sv(files,url) 
	};
    //读取开始时
    ww_hz.st = function (url) {ww_hz._ok[url] =false}
    //读取结束
    ww_hz.ed = function (url) {ww_hz._ok[url] = true}
    //保存
    ww_hz.sv = function (data,url) { ww_hz.saveJSON(data,url+".json")}

    ww_hz.load=function () {
	    var wz= ['img/faces','img/sv_actors','img/characters']
	    for (var i=0 ;i<wz.length;i++){
		    var url = wz[i]
		    ww_hz.loadFile(url,ww_hz.fu,ww_hz.st,ww_hz.errfu) 
	    }
    }
	ww_hz.load()
    //===========================================


	ww_hz.sc=function (jcm,url,arry) {
		var arry = arry
		//基础名
		var jcm = jcm
		//文件列表
		var files = ww_hz._data[url] 
		//如果有
		var cs = [[0,jcm+".png"]]
		if(files && files.constructor == Array && files.length >=0){
			for (var i =0 ;i<files.length ;i++){
				var file = files[i]
				var filel = file.split(".")
				var filell = filel.length  
				if(filell>1 && filel[filell-1] == "png"){
					var jcmjcl = jcm.split("_awdwd")
					var filejcl = filel[0].split("_awdwd")
					if ( jcmjcl[0] == filejcl[0]){
						if ( filejcl.length == 1){
							cs.push([1,file])
						}else{
							var hz = filejcl[1]
							var hzl = hz.split("_")
							if (hzl[0] == ""){hzl.shift() }
							if(hzl.length <= arry.length){
								var csz = 0
								var cw = 0
								var a = arry.clone()
								do{
									var az = a.pop()
									var hzid =hzl.indexOf(az)
									if ( hzid < 0){
										cw = 1
								    }else{
									    hzl.splice(hzid,1)
									    csz +=2
								    }
								    
								}while(a.length > 0 && hzl.length > 0  && cw == 0 )	
								if(cw == 0){
									cs.push([csz,file])
								}
							}
						}
					}
				}
			}
		}
		cs.sort()
		
		var nhz = cs.pop()
		if (nhz && nhz[1]){
			return nhz[1].split(".png")[0]
		}else{
			return
		}
		return   
	}

	Game_Actor.prototype.hzChang = function() {
		var fn = this.faceName()
		var bn = this.battlerName()
		var cn = this.characterName()
		var wz= ["",'img/faces','img/sv_actors','img/characters']
		var fhzs = this.getHz(1)
		var bhzs = this.getHz(2)
		var chzs = this.getHz(3)
		var fn2 = ww_hz.sc( fn,wz[1],fhzs)
		var bn2 = ww_hz.sc( bn,wz[2],bhzs)
		var cn2 = ww_hz.sc( cn,wz[3],chzs)
		if(fn2 && fn2 != fn){
			this._faceName = fn2
		}
		if(bn2 && bn2 != bn){
			this._battlerName  = bn2
		}
		if(cn2 && cn2 != cn){
			this._characterName  = cn2
		}
	　　 $gamePlayer && $gamePlayer.refresh && $gamePlayer.refresh()
	}
	
	Game_Actor.prototype.getHz = function(zl) {	
		var arry =[]
		var lxs
		var lxn 
		var equips = this.equips()
		var skills = this.skills()
		var states = this.states()
		var classes =this.currentClass()
		var actor =  this.actor()
		switch(zl){
			//脸图
			case 1:
				lxn = "fhz"
			break 
			//战斗图
			case 2:
				lxn = "bhz"
			break 
			//行走图
			case 3:
				lxn = "chz" 
			break 
			default:
			 	return arry
		}
		lxs = equips
		for (var i =0; i<lxs.length;i++ ){
			var lx = lxs[i]
			if(lx && lx.meta && lx.meta[lxn]){
			
				var hz = lx.meta[lxn]
				if (hz != "" ){
					hz = "" + hz
					arry.push(hz) 
				}
			}
		}
		lxs = skills
		for (var i =0; i<lxs.length;i++ ){
			var lx = lxs[i]
			if(lx && lx.meta && lx.meta[lxn]){
			
				var hz = lx.meta[lxn]
				if (hz != "" ){
					hz = "" + hz
					arry.push(hz) 
				}
			}
		}
		lxs = states
		for (var i =0; i<lxs.length;i++ ){
			var lx = lxs[i]
			if(lx && lx.meta && lx.meta[lxn]){
			
				var hz = lx.meta[lxn]
				if (hz != "" ){
					hz = "" + hz
					arry.push(hz) 
				}
			}
		}
		var lx = classes
		if(lx && lx.meta && lx.meta[lxn]){
			
			var hz = lx.meta[lxn]
			if (hz != "" ){
				hz = "" + hz
				arry.push(hz) 
			}
		}
		var lx =  actor
			
		if(lx && lx.meta && lx.meta[lxn]){
			var hz = lx.meta[lxn]
			if (hz != "" ){
				hz = "" + hz
				arry.push(hz) 
			}
		}
		return arry
	};




	Game_Actor.prototype.refresh = function() {
	    this.releaseUnequippableItems(false);
	    Game_Battler.prototype.refresh.call(this);
	    this.hzChang()
	};
	Game_Actor.prototype.discardEquip = function(item) {
	    var slotId = this.equips().indexOf(item);
	    if (slotId >= 0) {
	        this._equips[slotId].setObject(null);
	        this.hzChang()
	    }
	};

	//学习技能
	Game_Actor.prototype.learnSkill = function(skillId) {
	    if (!this.isLearnedSkill(skillId)) {
	        this._skills.push(skillId);
	        this._skills.sort(function(a, b) {
	            return a - b;
	        });
	        this.hzChang()
	    }
	};
	//忘记技能
	Game_Actor.prototype.forgetSkill = function(skillId) {
	    var index = this._skills.indexOf(skillId);
	    if (index >= 0) {
	        this._skills.splice(index, 1);
	        this.hzChang()
	    }
	};


	Game_Actor.prototype.setCharacterImage = function(characterName, characterIndex) {
	    this._characterName = characterName;
	    this._characterIndex = characterIndex;
	    this.hzChang()
	    
	};
	//设置脸图图像
	Game_Actor.prototype.setFaceImage = function(faceName, faceIndex) {
	    this._faceName = faceName;
	    this._faceIndex = faceIndex;
	    this.hzChang()
	    
	};
	//设置战斗图图像
	Game_Actor.prototype.setBattlerImage = function(battlerName) {
	    this._battlerName = battlerName;
	    this.hzChang()
	    
	};


/*
	//===========================================
	//可替换
	ww_hz.loadFile = function(url,fu,stfu,errfu) {
		stfu && stfu(url)
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', url+".json");
	    xhr.overrideMimeType('application/json');
	    xhr.onload = function() {
	        if (xhr.status < 400) {
	            fu && fu(JSON.parse(xhr.responseText),url)
	        }
	    };
	    xhr.onerror = function() { 
		    errfu && errfu(url)
		};
	    xhr.send();
	};


    //读取成功时
    ww_hz.fu = function (json,url) {
	    ww_hz.ed(url)
	    ww_hz._data[url]= json
	};
    ww_hz.errfu = function (url) {
	    throw new Error('Failed to load: ' + url +".json");
	};




    //读取开始时
    ww_hz.st = function (url) {ww_hz._ok[url] =false}
    //读取结束
    ww_hz.ed = function (url) {ww_hz._ok[url] = true}

    ww_hz.load=function () {
	    var wz= ['img/faces','img/sv_actors','img/characters']
	    for (var i=0 ;i<wz.length;i++){
		    var url = wz[i]
		    ww_hz.loadFile(url,ww_hz.fu,ww_hz.st,ww_hz.errfu) 
	    }
    }
	ww_hz.load()
	//===========================================
*/



})();











