//=============================================================================
// ww_BCsave.js.js
//=============================================================================
/*:
 * @plugindesc 保存到本地
 * @author wangwang
 *
 * @param 版本
 * @desc 0.1
 * @default 0.1
 *
 */






(function() {

DataManager.isAnySavefileExists = function() {
    return true;
};



Scene_File.prototype.savefileId = function() {
    return this._listWindow.index() + 1 - 1;// 修改 - 1
};

Window_SavefileList.prototype.maxItems = function() {
    return DataManager.maxSavefiles() + 1 ;//修改 + 1 
};

Window_SavefileList.prototype.drawItem = function(index) {
    var id = index + 1  - 1 ; // 修改 - 1
    if(id == 0 ){
	    var valid = true
		var info = {};
	    info.title  = $dataSystem.gameTitle;
	} else{
	    var valid = DataManager.isThisGameFile(id);
	    var info = DataManager.loadSavefileInfo(id);
    }
    var rect = this.itemRectForText(index);
    this.resetTextColor();
    if (this._mode === 'load') {
        this.changePaintOpacity(valid);
    }
    this.drawFileId(id, rect.x, rect.y);
    if (info) {
        this.changePaintOpacity(valid);
        this.drawContents(info, rect, valid);
        this.changePaintOpacity(true);
    }
};
Window_SavefileList.prototype.drawFileId = function(id, x, y) {
	if(id === 0 ){
		this.drawText("本地"+ TextManager.file , x, y, 180);
	}else{
		this.drawText(TextManager.file + ' ' + id, x, y, 180);
	}
};
Scene_Load.prototype.firstSavefileIndex = function() {
    return DataManager.latestSavefileId() - 1 + 1 ; //修改 + 1
};

Scene_Load.prototype.onSavefileOk = function() {
    Scene_File.prototype.onSavefileOk.call(this);
    if(this.savefileId() == 0 ){
	    this.onBaocunOk()
    }else{
	    if (DataManager.loadGame(this.savefileId())) {
	        this.onLoadSuccess();
	    } else {
	        this.onLoadFailure();
	    }
	}
};

Scene_Load.prototype.onBaocunOk = function () {
	if(ww_BCsave.loading == false){
		var input  = document.createElement("input");
		input.type ="file"
		input.style.display ="none"
		var that = this
		input.onchange = function () {
			ww_BCsave.loadingData(input,that)
		}
		input.click()
		this.activateListWindow();	
	}else{
		this.onLoadFailure();
	}
}


Scene_Save.prototype.firstSavefileIndex = function() {
    return DataManager.lastAccessedSavefileId() - 1 + 1 ;//修改 +1
};


Scene_Save.prototype.onSavefileOk = function() {
    Scene_File.prototype.onSavefileOk.call(this);
    $gameSystem.onBeforeSave();
    if(this.savefileId() == 0 ){
	    this.onBaocunOk()
    }else{
	    if (DataManager.saveGame(this.savefileId())) {
	        this.onSaveSuccess();
	    } else {
	        this.onSaveFailure();
	    }
	}
};

Scene_Save.prototype.onBaocunOk = function () {
	if(ww_BCsave.save()){
		this.onSaveSuccess();
	}else{
		this.onSaveFailure();
	}
}








	ww_BCsave = {}
	ww_BCsave._f64 = function (data) {
		try {return LZString.decompressFromBase64(data);}catch (e) {console.error(e);return ""}
	}
	ww_BCsave._t64 = function (data) {
		try {return LZString.compressToBase64(data);}catch (e) {console.error(e);return ""}
	}

	ww_BCsave.loading = false 

	ww_BCsave.loadingData = function(input,that) {
		ww_BCsave.loading = true 
		var input = input
		var that = that 
		var file = input.files[0];
	    var reader = new FileReader(); 
		reader.onload = function(file){
			ww_BCsave.loading = false 
		    if(ww_BCsave.load(this.result)){
			    that.onLoadSuccess(); 
		    }else{
			    that.onLoadFailure();
		    }
		}		   
		//将文件以文本形式读入页面
		reader.readAsText(file);

		input.remove()
	}

	ww_BCsave.save = function(data) {     
		try {
	        var json = JsonEx.stringify(DataManager.makeSaveContents())
			var data = ww_BCsave._t64(json)
			var saveFile = function(data, filename){
				var urlObject = window.URL || window.webkitURL || window;
				var export_blob = new Blob([data]);
				var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
				save_link.href = urlObject.createObjectURL(export_blob);
				save_link.download = filename;
			    var event = document.createEvent('MouseEvents');
			    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			    save_link.dispatchEvent(event);
			};
			var name = $dataSystem.gameTitle + "-"+ ww_BCsave._getHz() ;
			saveFile(data,name);
			return true
	    } catch (e) {
	        console.error(e);
	        return false;
	    }
	}
	




	
	ww_BCsave.load = function(data) {     
		try {
	        return ww_BCsave.loadGameWithoutRescue(data);
	    } catch (e) {
	        console.error(e);
	        return false;
	    }
	}
	
	ww_BCsave.loadGameWithoutRescue=function (data) {
	    if (data) {
	        var json = ww_BCsave._f64(data)
	        DataManager.createGameObjects();
	        DataManager.extractSaveContents(JsonEx.parse(json));
	        return true;
	    } else {
	        return false;
	    }		
	}


	ww_BCsave._getHz = function(sz) {
		var myDate = new Date();
		var ye = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
		var mo = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
		var d = myDate.getDate(); //获取当前日(1-31)
		var h = myDate.getHours(); //获取当前小时数(0-23)
		var m = myDate.getMinutes(); //获取当前分钟数(0-59)
		var s = myDate.getSeconds(); //获取当前秒数(0-59)
		var ms = myDate.getMilliseconds(); //获取当前毫秒数(0-999)
		var houzhui = '';
		houzhui += ye + '_' + (mo + 1).padZero(2) + '_' + d.padZero(2) + '-' + h.padZero(2) + '_' + m.padZero(2) + '_' + s.padZero(2) //+ '-' + ms;
		return houzhui;
	}








})()
