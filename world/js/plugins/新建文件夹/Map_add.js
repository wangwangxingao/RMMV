//=============================================================================
// Map_Add.js
//=============================================================================
/*:
 * @plugindesc 地图修改编辑
 * @author wangwang
 *
 * @param v
 * @desc 版本
 * @default 1.2
 *
 * @help
 * 
 *======================图块========================
 *
 * mapid地图x,y,z处图块改变为tile
 * ww_mapAdd.editTile(mapid,x,y,z,tile)
 *
 * 本地图的 x,y,z处图块,复制到tx,ty,tz
 * ww_mapAdd.copyTile(x,y,z,tx,ty,tz)
 *
 * 本地图的 x,y处图块,复制到tx,ty(全部层)
 * ww_mapAdd.copyTile1(x,y,tx,ty)
 *
 * 本地图的 x,y处图块,复制到tx,ty(0层以上)
 * ww_mapAdd.copyTile2(x,y,tx,ty)
 *
 * fmapid地图的x,y,z的图块,克隆到tmapid地图的tx,ty,tz
 * ww_mapAdd.copyTileByMap(fmapid,x,y,z,tmapid,tx,ty,tz)
 *
 * fmapid地图的x,y的图块,克隆到tmapid地图的tx,ty(全部层)
 * ww_mapAdd.copyTileByMap1(fmapid,x,y,tmapid,tx,ty)
 *
 * fmapid地图的x,y的图块,克隆到tmapid地图的tx,ty(0层以上)
 * ww_mapAdd.copyTileByMap2(fmapid,x,y,tmapid,tx,ty)
 *
 * 本地图的x,y,w,h,z区域的图块,复制到tx,ty,tz
 * ww_mapAdd.copyTileArea(x,y,w,h,z,tx,ty,tz)
 *
 * 本地图的x,y,w,h区域的图块,复制到tx,ty (全部层)
 * ww_mapAdd.copyTileArea1(x,y,w,h,tx,ty)
 *
 * 本地图的x,y,w,h区域的图块,复制到tx,ty (0层以上)
 * ww_mapAdd.copyTileArea2(x,y,w,h,tx,ty)
 *
 * 地图,x,y,w,h,z,区域图块全改变为tile
 * ww_mapAdd.editTileAreaById(mapid,x,y,w,h,z,tile)
 *
 * 复制 fmapid地图 x,y,w,h,z 区域图块到 tmapid 地图tx,ty tz
 * ww_mapAdd.copyTileAreaByMap(fmapid,x,y,w,h,z,tmapid,tx,ty,tz)
 *
 * 复制 fmapid地图 x,y,w,h 区域图块到 tmapid 地图tx,ty (全部层)
 * ww_mapAdd.copyTileAreaByMap1(fmapid,x,y,w,h,tmapid,tx,ty)
 *
 * 复制 fmapid地图 x,y,w,h区域图块到 tmapid 地图tx,ty (对0层之上)
 * ww_mapAdd.copyTileAreaByMap2(fmapid,x,y,w,h,tmapid,tx,ty)
 *
 * 改变当前地图图块(不会保存修改)
 * ww_mapAdd._changeNowMapTile(x, y, z, tile) 
 *
 * 改变当前地图图块区域(不会保存修改)
 * ww_mapAdd._changeNowMapTileArea(x0, y0, z, tileArea) 
 *
 * 读取 mapid 地图图块(必须已经读取)
 * ww_mapAdd.loadMapTile(mapid,x,y,z) 
 *
 * 读取 mapid 地图区域图块(必须已经读取)
 * ww_mapAdd.loadMapTileArea(mapid,x0,y0,w,h,z) 
 *
 * 读取当前地图图块
 * ww_mapAdd.loadNowMapTile(x,y,z) 
 *
 * 读取当前地图区域图块
 * ww_mapAdd.loadNowMapTileArea(x0,y0,w,h,z) 
 *
 *======================地图========================
 *
 * 改变mapid地图滚动种类type
 * ww_mapAdd.editMapScrollType(mapid,type)
 *
 * 改变mapid地图大小(清空地图)
 * ww_mapAdd.editMap(mapid,w,h)
 *
 * 改变mapid地图大小 (并将原来的地图移动到tx,ty)
 * ww_mapAdd.editMap1(mapid,w,h,tx,ty)
 *
 * 改变mapid地图大小 (并将原来的地图fx,fy,fw,fh 区域 移动到tx,ty)
 * ww_mapAdd.editMap2(mapid,w,h,fx,fy,fw,fh,tx,ty)
 *
 * 改变现在地图的大小(不会保存修改)
 * ww_mapAdd._changeNowMap(w,h) 
 *
 * 改变现在地图滚动种类type(不会保存修改)
 * ww_mapAdd._changeNowMapScrollType(type) 
 *
 *======================事件========================
 *
 * 复制fid事件到tid ,x,y
 * ww_mapAdd.copyEvent(fid,tid)  
 * 
 * 复制fmapid地图fid事件到tmapid地图tid事件x,y)
 * ww_mapAdd.copyEventByMap(fmapid,fid,tmapid,tid,x,y) 
 * 
 * 复制事件到tmapid地图tid事件x,y)
 * ww_mapAdd.eventByMap(event,tmapid,tid,x,y) 
 *
 * 改变当前地图id事件为 event   (不会保存修改)
 * ww_mapAdd._changeNowMapEvent (id, event,csh) 
 *
 * 改变当前地图id事件为 event  (不会保存修改)
 * ww_mapAdd._changeNowMapEvent2 (id, event,csh) 
 *
 * 移除当前地图事件(不会保存修改)
 * ww_mapAdd._removeNowMapEvent(id) 
 * 
 * 添加当前地图事件(不会保存修改)
 * ww_mapAdd._addNowMapEvent(id) 
 *
 * 读取fmapid地图id事件
 * ww_mapAdd.loadMapEvent(fmapid,id) 
 *
 * 读取当前地图id事件
 * ww_mapAdd.loadNowMapEvent(id) 
 *
 * 获取一个新事件
 * ww_mapAdd._newEvent() 
 *
 * 获取一个新事件页
 * ww_mapAdd._newEventPage() 
 *
 *
 * 具体见脚本注释
 * bug未知
 * 主要修改: 
 * 		DataManager
 *		Scene_Map
 * 		$dataMap
 * 		$gameMap
 *
 */




(function () {
	ww_mapAdd = {}
	//临时读取 地图文件
	ww_mapAdd._tempMapData = {}
	//清除临时读取 地图文件
	ww_mapAdd._tempMapData_clear = function () {
		ww_mapAdd._tempMapData = {}
	};
	//地图记录
	ww_mapAdd._mapDataAdd = {}
	//清除全部记录
	ww_mapAdd._mapDataAdd_clear = function () {
		ww_mapAdd._mapDataAdd = {}
	};
	//清除id地图记录
	ww_mapAdd._mapDataAdd_clearId = function (id) {
		ww_mapAdd._mapDataAdd[id] = []
	};
	//======================保存读取========================
	//制作保存内容
	ww_mapAdd.DataManager_makeSaveContents = DataManager.makeSaveContents
	DataManager.makeSaveContents = function () {
		var contents = ww_mapAdd.DataManager_makeSaveContents.call(this);
		contents._mapDataAdd = ww_mapAdd._mapDataAdd
		return contents
	};
	//读取保存内容
	ww_mapAdd.DataManager_extractSaveContents = DataManager.extractSaveContents
	DataManager.extractSaveContents = function (contents) {
		ww_mapAdd.DataManager_extractSaveContents.call(this, contents)
		ww_mapAdd._mapDataAdd = contents._mapDataAdd
	};
	//开始新游戏
	ww_mapAdd.DataManager_setupNewGame = DataManager.setupNewGame
	DataManager.setupNewGame = function () {
		ww_mapAdd._tempMapData_clear()
		ww_mapAdd._mapDataAdd_clear()
		ww_mapAdd.DataManager_setupNewGame.call(this)
	};

	//======================读取临时地图处理========================
	ww_mapAdd._loadListeners = {}
	//当读取后呼叫
	ww_mapAdd._callLoadListeners = function (mapId) {
		var loadListeners = ww_mapAdd._loadListeners[mapId]
		if (Array.isArray(loadListeners)) {
			while (loadListeners.length > 0) {
				var listener = loadListeners.shift();
				listener();
			}
		}
		ww_mapAdd._loadListeners[mapId] = []
	};
	//添加方法
	ww_mapAdd.addLoadListener = function (mapId, listner) {
		//如果 临时地图数据中有 该地图
		if (ww_mapAdd._tempMapData[mapId]) {
			// 调用监听方法
			listner();
		} else {
			//如果 地图id的读取监听 不是数组
			if (!Array.isArray(ww_mapAdd._loadListeners[mapId])) {
				//创建数组
				ww_mapAdd._loadListeners[mapId] = []
			}
			//添加 监听方法
			ww_mapAdd._loadListeners[mapId].push(listner);
			//如果 临时地图数据 不是null 即未读取时
			if (ww_mapAdd._tempMapData[mapId] !== null) {
				//临时地图数据读取
				ww_mapAdd._tempMapDataLoad(mapId)
			}
		}
	};
	//读取数据文件
	ww_mapAdd.loadDataFile = function (mapId, src) {
		var xhr = new XMLHttpRequest();
		var url = 'data/' + src;
		xhr.open('GET', url);
		xhr.overrideMimeType('application/json');
		//当读取后
		xhr.onload = function () {
			if (xhr.status < 400) {
				//解析数据
				ww_mapAdd._tempMapData[mapId] = JSON.parse(xhr.responseText);
				//当读取
				ww_mapAdd.onLoad(ww_mapAdd._tempMapData[mapId]);
				//呼叫监听事件
				ww_mapAdd._callLoadListeners(mapId)
			}
		};
		//当错误时
		xhr.onerror = function () {
			DataManager._errorUrl = DataManager._errorUrl || url;
		};
		//临时地图数据 = null
		ww_mapAdd._tempMapData[mapId] = null;
		xhr.send();
	};
	//当读取
	ww_mapAdd.onLoad = function (object) {
		var array;
		DataManager.extractMetadata(object);
		array = object.events;
		if (Array.isArray(array)) {
			for (var i = 0; i < array.length; i++) {
				var data = array[i];
				if (data && data.note !== undefined) {
					DataManager.extractMetadata(data);
				}
			}
		}
	};
	//读取临时地图数据
	ww_mapAdd._tempMapDataLoad = function (mapId) {
		//如果 地图id > 0 
		if (mapId > 0) {
			var filename = 'Map%1.json'.format(mapId.padZero(3));
			//读取地图数据
			ww_mapAdd.loadDataFile(mapId, filename);
		} else {
			//制作空白地图
			ww_mapAdd._makeEmptyMap(mapId);
		}
	}
	//制作空白地图
	ww_mapAdd._makeEmptyMap = function (mapId) {
		ww_mapAdd._tempMapData[mapId] = {};
		var MapData = ww_mapAdd._tempMapData[mapId]
		MapData.data = [];
		MapData.events = [];
		MapData.width = 100;
		MapData.height = 100;
		MapData.scrollType = 3;
	};


	//======================方法========================
	//是横向循环
	ww_mapAdd._isLoopHorizontal = function (scrollType) {
		return scrollType === 2 || scrollType === 3;
	};
	//是纵向循环
	ww_mapAdd._isLoopVertical = function (scrollType) {
		return scrollType === 1 || scrollType === 3;
	};
	//======================图块========================
	//mapid地图x,y,z处图块改变为tile
	ww_mapAdd.editTile = function (mapid, x, y, z, tile) {
		ww_mapAdd._mapDataAdd[mapid] = ww_mapAdd._mapDataAdd[mapid] || []
		var key = ["editTile", x, y, z, tile]
		ww_mapAdd._mapDataAdd[mapid].push(key)
		if (mapid == $gameMap.mapId() && DataManager.isMapLoaded()) {
			ww_mapAdd._changeNowMapTile(x, y, z, tile)
			//$gameMap.requestRefresh()
		}
	}
	//本地图的 x,y,z处图块,复制到tx,ty,tz
	ww_mapAdd.copyTile = function (x, y, z, tx, ty, tz) {
		var tile = ww_mapAdd.loadNowMapTile(x, y, z)
		var tmapid = $gameMap.mapId()
		ww_mapAdd.editTile(tmapid, tx, ty, tz, tile)
	}

	//本地图的 x,y处图块,复制到tx,ty(全部层)
	ww_mapAdd.copyTile1 = function (x, y, tx, ty) {
		for (var z = 0; z < 5; z++) {
			ww_mapAdd.copyTile(x, y, z, tx, ty, z)
		}
	}
	//本地图的 x,y处图块,复制到tx,ty(0层以上)
	ww_mapAdd.copyTile2 = function (x, y, tx, ty) {
		for (var z = 1; z < 5; z++) {
			ww_mapAdd.copyTile(x, y, z, tx, ty, z)
		}
	}



	//fmapid地图的x,y,z的图块,克隆到tmapid地图的tx,ty,tz
	ww_mapAdd.copyTileByMap = function (fmapid, x, y, z, tmapid, tx, ty, tz) {
		ww_mapAdd.addLoadListener(
			fmapid,
			function () {
				var tile = ww_mapAdd.loadMapTile(fmapid, x, y, z)
				ww_mapAdd.editTile(tmapid, tx, ty, tz, tile)
			}
		)
	}
	//fmapid地图的x,y的图块,克隆到tmapid地图的tx,ty(全部层)
	ww_mapAdd.copyTileByMap1 = function (fmapid, x, y, tmapid, tx, ty) {
		for (var z = 0; z < 5; z++) {
			ww_mapAdd.copyTileByMap(fmapid, x, y, z, tmapid, tx, ty, z)
		}
	}
	//fmapid地图的x,y的图块,克隆到tmapid地图的tx,ty(0层以上)
	ww_mapAdd.copyTileByMap2 = function (fmapid, x, y, tmapid, tx, ty) {
		for (var z = 1; z < 5; z++) {
			ww_mapAdd.copyTileByMap(fmapid, x, y, z, tmapid, tx, ty, z)
		}
	}


	//本地图的x,y,w,h,z区域的图块,复制到tx,ty,tz
	ww_mapAdd.copyTileArea = function (x, y, w, h, z, tx, ty, tz) {
		var mapid = $gameMap.mapId()
		ww_mapAdd._mapDataAdd[mapid] = ww_mapAdd._mapDataAdd[mapid] || []
		var key = ["copyTileArea", x, y, w, h, z, tx, ty, tz]
		ww_mapAdd._mapDataAdd[mapid].push(key)
		if (DataManager.isMapLoaded()) {
			var tileArea = ww_mapAdd.loadNowMapTileArea(x, y, w, h, z)
			ww_mapAdd._changeNowMapTileArea(x, y, z, tileArea)
			//$gameMap.requestRefresh()
		}
	}
	//本地图的x,y,w,h区域的图块,复制到tx,ty (全部层)
	ww_mapAdd.copyTileArea1 = function (x, y, w, h, tx, ty) {
		for (var z = 0; z < 5; z++) {
			ww_mapAdd.copyTileArea(x, y, w, h, z, tx, ty, z)
		}
	}
	//本地图的x,y,w,h区域的图块,复制到tx,ty (0层以上)
	ww_mapAdd.copyTileArea2 = function (x, y, w, h, tx, ty) {
		for (var z = 1; z < 5; z++) {
			ww_mapAdd.copyTileArea(x, y, w, h, z, tx, ty, z)
		}
	}




	//地图,x,y,w,h,z,区域图块全改变为tile
	ww_mapAdd.editTileAreaById = function (mapid, x, y, w, h, z, tile) {
		ww_mapAdd._mapDataAdd[mapid] = ww_mapAdd._mapDataAdd[mapid] || []
		var tile = tile || 0
		var key = ["editTileAreaById", x, y, w, h, z, tile]
		ww_mapAdd._mapDataAdd[mapid].push(key)
		if (mapid == $gameMap.mapId() && DataManager.isMapLoaded()) {
			var tileArea = []
			for (var wi = 0; wi < w; wi++) {
				tileArea[wi] = []
				for (var hi = 0; hi < h; hi++) {
					tileArea[wi][hi] = tile
				}
			}
			ww_mapAdd._changeNowMapTileArea(x, y, z, tileArea)
		}
	}


	//复制 fmapid地图 x,y,w,h,z 区域图块到 tmapid 地图tx,ty tz
	ww_mapAdd.copyTileAreaByMap = function (fmapid, x, y, w, h, z, tmapid, tx, ty, tz) {
		var mapid = tmapid || 0
		ww_mapAdd._mapDataAdd[mapid] = ww_mapAdd._mapDataAdd[mapid] || []
		var key = ["copyTileAreaByMap", fmapid, x, y, w, h, z, tx, ty, tz]
		ww_mapAdd._mapDataAdd[mapid].push(key)
		if (mapid == $gameMap.mapId() && DataManager.isMapLoaded()) {
			ww_mapAdd.addLoadListener(
				fmapid,
				function () {
					var tileArea = ww_mapAdd.loadMapTileArea(fmapid, x, y, w, h, z)
					if (Array.isArray(tileArea)) {
						ww_mapAdd._changeNowMapTileArea(tx, ty, tz, tileArea)
					}
				}
			)
		}
	}
	//复制 fmapid地图 x,y,w,h 区域图块到 tmapid 地图tx,ty (全部层)
	ww_mapAdd.copyTileAreaByMap1 = function (fmapid, x, y, w, h, tmapid, tx, ty) {
		for (var z = 0; z < 5; z++) {
			ww_mapAdd.copyTileAreaByMap(fmapid, x, y, w, h, z, tmapid, tx, ty, z)
		}
	}
	//复制 fmapid地图 x,y,w,h区域图块到 tmapid 地图tx,ty (对0层之上)
	ww_mapAdd.copyTileAreaByMap2 = function (fmapid, x, y, w, h, tmapid, tx, ty) {
		for (var z = 1; z < 5; z++) {
			ww_mapAdd.copyTileAreaByMap(fmapid, x, y, w, h, z, tmapid, tx, ty, z)
		}
	}


	//改变当前地图图块
	ww_mapAdd._changeNowMapTile = function (x, y, z, tile) {
		var tile = tile || 0
		if ($dataMap.data) {
			var width = $dataMap.width;
			var height = $dataMap.height;
			var horizontalWrap = ww_mapAdd._isLoopHorizontal($dataMap.scrollType)
			var verticalWrap = ww_mapAdd._isLoopVertical($dataMap.scrollType)
			if (horizontalWrap) {
				x = x.mod(width);
			}
			if (verticalWrap) {
				y = y.mod(height);
			}
			if (x >= 0 && x < width && y >= 0 && y < height) {
				$dataMap.data[(z * height + y) * width + x] = tile
			}
		}
	};
	//改变当前地图图块区域
	ww_mapAdd._changeNowMapTileArea = function (x0, y0, z, tileArea) {
		var tileArea = tileArea
		if ($dataMap.data) {
			var width = $dataMap.width;
			var height = $dataMap.height;
			var horizontalWrap = ww_mapAdd._isLoopHorizontal($dataMap.scrollType);
			var verticalWrap = ww_mapAdd._isLoopVertical($dataMap.scrollType);
			for (var wi = 0; wi < tileArea.length; wi++) {
				var tileArea2 = tileArea[wi]
				if (Array.isArray(tileArea2)) {
					for (var hi = 0; hi < tileArea2.length; hi++) {
						var tile = tileArea2[hi]
						var x = x0 + wi
						var y = x0 + hi
						if (horizontalWrap) {
							x = x.mod(width);
						};
						if (verticalWrap) {
							y = y.mod(height);
						};
						if (x >= 0 && x < width && y >= 0 && y < height) {
							$dataMap.data[(z * height + y) * width + x] = tile;
						};
					};
				};
			};
		};
	};


	//读取 mapid 地图图块
	ww_mapAdd.loadMapTile = function (mapid, x, y, z) {
		var mapdata = ww_mapAdd._tempMapData[mapid]
		if (mapdata) {
			var data = mapdata.data
			if (data) {
				var width = mapdata.width
				var height = mapdata.height
				var horizontalWrap = ww_mapAdd._isLoopHorizontal(mapdata.scrollType)
				var verticalWrap = ww_mapAdd._isLoopVertical(mapdata.scrollType)
				if (horizontalWrap) {
					x = x.mod(width);
				}
				if (verticalWrap) {
					y = y.mod(height);
				}
				if (x >= 0 && x < width && y >= 0 && y < height) {
					return data[(z * height + y) * width + x] || 0;
				}
			}
		}
		return 0;
	}
	//读取mapid 地图区域图块
	ww_mapAdd.loadMapTileArea = function (mapid, x0, y0, w, h, z) {
		var tileArea = []
		for (var wi = 0; wi < w; wi++) {
			tileArea[wi] = []
			for (var hi = 0; hi < h; hi++) {
				tileArea[wi][hi] = 0
			}
		}
		var mapdata = ww_mapAdd._tempMapData[mapid]
		if (mapdata) {
			var data = mapdata.data
			if (data) {
				var width = mapdata.width
				var height = mapdata.height
				var horizontalWrap = ww_mapAdd._isLoopHorizontal(mapdata.scrollType)
				var verticalWrap = ww_mapAdd._isLoopVertical(mapdata.scrollType)
				for (var wi = 0; wi < w; wi++) {
					for (var hi = 0; hi < h; hi++) {
						var x = x0 + wi
						var y = x0 + hi
						if (horizontalWrap) {
							x = x.mod(width);
						}
						if (verticalWrap) {
							y = y.mod(height);
						}
						if (x >= 0 && x < width && y >= 0 && y < height) {
							tileArea[wi][hi] = data[(z * height + y) * width + x] || 0;
						}
					}
				}
			}
		}
		return tileArea;
	}

	//读取当前地图图块
	ww_mapAdd.loadNowMapTile = function (x, y, z) {
		var mapdata = $dataMap
		if (mapdata) {
			var data = mapdata.data
			if (data) {
				var width = mapdata.width
				var height = mapdata.height
				var horizontalWrap = ww_mapAdd._isLoopHorizontal(mapdata.scrollType)
				var verticalWrap = ww_mapAdd._isLoopVertical(mapdata.scrollType)
				if (horizontalWrap) {
					x = x.mod(width);
				}
				if (verticalWrap) {
					y = y.mod(height);
				}
				if (x >= 0 && x < width && y >= 0 && y < height) {
					return data[(z * height + y) * width + x] || 0;
				}
			}
		}
		return 0;
	}

	//读取当前地图区域图块
	ww_mapAdd.loadNowMapTileArea = function (x0, y0, w, h, z) {
		var tileArea = []
		for (var wi = 0; wi < w; wi++) {
			tileArea[wi] = []
			for (var hi = 0; hi < h; hi++) {
				tileArea[wi][hi] = 0
			}
		}
		var mapdata = $dataMap
		if (mapdata) {
			var data = mapdata.data
			if (data) {
				var width = mapdata.width
				var height = mapdata.height
				var horizontalWrap = ww_mapAdd._isLoopHorizontal(mapdata.scrollType)
				var verticalWrap = ww_mapAdd._isLoopVertical(mapdata.scrollType)
				for (var wi = 0; wi < w; wi++) {
					for (var hi = 0; hi < h; hi++) {
						var x = x0 + wi
						var y = x0 + hi
						if (horizontalWrap) {
							x = x.mod(width);
						}
						if (verticalWrap) {
							y = y.mod(height);
						}
						if (x >= 0 && x < width && y >= 0 && y < height) {
							tileArea[wi][hi] = data[(z * height + y) * width + x] || 0;
						}
					}
				}
			}
		}
		return tileArea;
	}
	//======================地图========================
	//改变mapid地图滚动种类type
	ww_mapAdd.editMapScrollType = function (mapid, type) {
		ww_mapAdd._mapDataAdd[mapid] = ww_mapAdd._mapDataAdd[mapid] || []
		var key = ["editMapScrollType", type]
		ww_mapAdd._mapDataAdd[mapid].push(key)
		if (mapid == $gameMap.mapId() && DataManager.isMapLoaded()) {
			ww_mapAdd._changeNowMapScrollType(w, h)
		}
	}

	//改变mapid地图大小(清空地图)
	ww_mapAdd.editMap = function (mapid, w, h) {
		ww_mapAdd._mapDataAdd[mapid] = ww_mapAdd._mapDataAdd[mapid] || []
		var key = ["editMap", w, h]
		ww_mapAdd._mapDataAdd[mapid].push(key)
		if (mapid == $gameMap.mapId() && DataManager.isMapLoaded()) {
			ww_mapAdd._changeNowMap(w, h)
		}
	}

	//改变mapid地图大小 (并将原来的地图移动到tx,ty)
	ww_mapAdd.editMap1 = function (mapid, w, h, tx, ty) {
		ww_mapAdd._mapDataAdd[mapid] = ww_mapAdd._mapDataAdd[mapid] || []
		var key = ["editMap1", w, h, tx, ty]
		ww_mapAdd._mapDataAdd[mapid].push(key)
		if (mapid == $gameMap.mapId() && DataManager.isMapLoaded()) {
			var fx = 0
			var fy = 0
			var fw = $dataMap.width
			var fh = $dataMap.height
			var tiles = []
			for (var z = 0; z < 5; z++) {
				tiles[z] = ww_mapAdd.loadNowMapTileArea(fx, fy, fw, fh, z)
			}
			ww_mapAdd._changeNowMap(w, h)
			for (var z = 0; z < 5; z++) {
				ww_mapAdd._changeNowMapTileArea(tx, ty, z, tiles[z])
			}
		}
	}

	//改变mapid地图大小 (并将原来的地图fx,fy,fw,fh 区域 移动到tx,ty)
	ww_mapAdd.editMap2 = function (mapid, w, h, fx, fy, fw, fh, tx, ty) {
		ww_mapAdd._mapDataAdd[mapid] = ww_mapAdd._mapDataAdd[mapid] || []
		var key = ["editMap2", w, h, fx, fy, fw, fh, tx, ty]
		ww_mapAdd._mapDataAdd[mapid].push(key)
		if (mapid == $gameMap.mapId() && DataManager.isMapLoaded()) {
			var tiles = []
			for (var z = 0; z < 5; z++) {
				tiles[z] = ww_mapAdd.loadNowMapTileArea(fx, fy, fw, fh, z)
			}
			ww_mapAdd._changeNowMap(w, h)
			for (var z = 0; z < 5; z++) {
				ww_mapAdd._changeNowMapTileArea(tx, ty, z, tiles[z])
			}
		}
	}

	//改变现在地图的大小
	ww_mapAdd._changeNowMap = function (w, h) {
		$dataMap.data.length = 0
		for (var z = 0; z < 5; z++) {
			for (var wi = 0; wi < w; wi++) {
				for (var hi = 0; hi < h; hi++) {
					$dataMap.data[(z * h + hi) * w + wi] = 0
				}
			}
		}
		$dataMap.width = w
		$dataMap.height = h
		//如果目前在地图上 
		if (SceneManager && SceneManager._scene && SceneManager._scene.constructor == Scene_Map &&
			SceneManager._scene._spriteset && SceneManager._scene._spriteset._tilemap) {
			var tilemap = SceneManager._scene._spriteset._tilemap;
			tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
		}
		return $dataMap
	}
	//改变现在地图滚动种类type
	ww_mapAdd._changeNowMapScrollType = function (type) {
		$dataMap.scrollType = type || 0
		//如果目前在地图上 
		if (SceneManager && SceneManager._scene && SceneManager._scene.constructor == Scene_Map &&
			SceneManager._scene._spriteset && SceneManager._scene._spriteset._tilemap) {
			var tilemap = SceneManager._scene._spriteset._tilemap;
			tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
			tilemap.verticalWrap = $gameMap.isLoopVertical();
		}
		return $dataMap
	}



	//======================事件========================


	//删除事件
	ww_mapAdd.deleEvent = function (mapid, tid) {
		var mapid = mapid
		ww_mapAdd._mapDataAdd[mapid] = ww_mapAdd._mapDataAdd[mapid] || []
		var key = ["eventByMap", false, tid]
		ww_mapAdd._mapDataAdd[mapid].push(key)
		if (DataManager.isMapLoaded()) {
			ww_mapAdd._changeNowMapEvent(tid)
			$gameMap.requestRefresh()
		}
	}


	//复制fid事件到tid x ,y
	ww_mapAdd.copyEvent = function (fid, tid, x, y) {
		var mapid = $gameMap.mapId()
		ww_mapAdd._mapDataAdd[mapid] = ww_mapAdd._mapDataAdd[mapid] || []
		var key = ["copyEvent", fid, tid]
		if (!(x === null || x === undefined)) { key[3] = x * 1 }
		if (!(y === null || y === undefined)) { key[4] = y * 1 }
		ww_mapAdd._mapDataAdd[mapid].push(key)
		if (DataManager.isMapLoaded()) {
			var event = ww_mapAdd.loadNowMapEvent(fid)
			event.id = tid
			if (!(x === null || x === undefined)) { event.x = x * 1 }
			if (!(y === null || y === undefined)) { event.y = y * 1 }
			ww_mapAdd._changeNowMapEvent(tid, event)
			$gameMap.requestRefresh()
		}
	}

	//复制fmapid地图fid事件到tmapid地图tid事件 x ,y
	ww_mapAdd.copyEventByMap = function (fmapid, fid, tmapid, tid, x, y) {
		var mapid = tmapid
		ww_mapAdd._mapDataAdd[mapid] = ww_mapAdd._mapDataAdd[mapid] || []
		var key = ["copyEventByMap", fmapid, fid, tid]
		if (!(x === null || x === undefined)) { key[4] = x * 1 }
		if (!(y === null || y === undefined)) { key[5] = y * 1 }
		ww_mapAdd._mapDataAdd[mapid].push(key)
		if (mapid == $gameMap.mapId() && DataManager.isMapLoaded()) {
			ww_mapAdd.addLoadListener(
				fmapid,
				function () {
					var event = ww_mapAdd.loadMapEvent(fmapid, fid)
					event.id = tid
					if (!(x === null || x === undefined)) {
						event.x = x * 1
					}
					if (!(y === null || y === undefined)) { event.y = y * 1 }
					ww_mapAdd._changeNowMapEvent(tid, event)
					$gameMap.requestRefresh()
				}
			)
		}
	}

	//复制 事件到tmapid地图tid事件 x ,y
	ww_mapAdd.eventByMap = function (event, tmapid, tid, x, y) {
		var mapid = tmapid
		ww_mapAdd._mapDataAdd[mapid] = ww_mapAdd._mapDataAdd[mapid] || []
		var key = ["eventByMap", event, tid]
		if (!(x === null || x === undefined)) { key[3] = x * 1 }
		if (!(y === null || y === undefined)) { key[4] = y * 1 }
		ww_mapAdd._mapDataAdd[mapid].push(key)
		if (mapid == $gameMap.mapId() && DataManager.isMapLoaded()) {
			var event = JSON.parse(event);
			DataManager.extractMetadata(event)
			event.id = tid
			if (!(x === null || x === undefined)) { event.x = x * 1 }
			if (!(y === null || y === undefined)) { event.y = y * 1 }
			ww_mapAdd._changeNowMapEvent(tid, event)
			$gameMap.requestRefresh()
		}
	}
	//改变当前地图id事件为 event  
	ww_mapAdd._changeNowMapEvent = function (id, event) {
		if (event) {
			ww_mapAdd._removeNowMapEvent(id)
			$dataMap.events[id] = event;
			ww_mapAdd._addNowMapEvent(id)
		} else {
			ww_mapAdd._removeNowMapEvent(id)
		}
	}


	//改变当前地图id事件为 event (未创建精灵时用)   
	ww_mapAdd._changeNowMapEvent2 = function (id, event) {
		if (event) {
			$dataMap.events[id] = event;
		} else {
			$dataMap.events[id] = undefined
		}
	}


	//移除当前地图事件
	ww_mapAdd._removeNowMapEvent = function (id) {
		if (SceneManager && SceneManager._scene && SceneManager._scene.constructor == Scene_Map) {
			if (SceneManager._scene._spriteset && SceneManager._scene._spriteset._characterSprites) {
				var spriteset = SceneManager._scene._spriteset
				var characterSprites = spriteset._characterSprites
				var tilemap = spriteset._tilemap
				var event = $gameMap._events[id]
				if (event) {
					characterSprites.forEach(
						function (sprite) {
							if (sprite._character && sprite._character == event) {
								tilemap.removeChild(sprite)
								characterSprites.splice(characterSprites.indexOf(sprite), 1)
							}
						}
					)
				}
			}
		}
		$gameMap._events[id] = undefined;
		$dataMap.events[id] = undefined;
	}

	//添加当前地图事件
	ww_mapAdd._addNowMapEvent = function (id) {
		if ($dataMap.events[id]) {
			$gameMap._events[id] = new Game_Event($gameMap.mapId(), id)
			$gameMap.r($gameMap._events[id])
		}
	}

	ww_mapAdd.clone = function (obj) {
		return JSON.parse(JSON.stringify(obj));
	}
	//读取fmapid地图id事件
	ww_mapAdd.loadMapEvent = function (fmapid, id) {
		var event;
		var mapdata = ww_mapAdd._tempMapData[fmapid]
		if (mapdata) {
			var events = mapdata.events
			if (events) {
				var event = ww_mapAdd.clone(events[id])
			}
		}
		return event || ww_mapAdd._newEvent();
	}
	//读取当前地图id事件
	ww_mapAdd.loadNowMapEvent = function (id) {
		var event;
		var mapdata = $dataMap
		if (mapdata) {
			var events = mapdata.events
			if (events) {
				var event = ww_mapAdd.clone(events[id])
			}
		}
		return event || ww_mapAdd._newEvent();
	}
	//获取一个新事件
	ww_mapAdd._newEvent = function () {
		var event = {
			"id": 0,
			"name": "EV000",
			"note": "",
			"pages": [],
			"x": 0,
			"y": 0
		}
		var page = ww_mapAdd._newEventPage()
		event.pages.push(page)
		DataManager.extractMetadata(event)
		return event;
	}
	//获取一个新事件页
	ww_mapAdd._newEventPage = function () {
		var page = {
			"conditions": {
				"actorId": 1,
				"actorValid": false,
				"itemId": 1,
				"itemValid": false,
				"selfSwitchCh": "A",
				"selfSwitchValid": false,
				"switch1Id": 1,
				"switch1Valid": false,
				"switch2Id": 1,
				"switch2Valid": false,
				"variableId": 1,
				"variableValid": false,
				"variableValue": 0
			},
			"directionFix": false,
			"image": {
				"characterIndex": 0,
				"characterName": "",
				"direction": 2,
				"pattern": 0,
				"tileId": 0
			},
			"list": [{
				"code": 0,
				"indent": 0,
				"parameters": []
			}],
			"moveFrequency": 3,
			"moveRoute": {
				"list": [{
					"code": 0,
					"parameters": []
				}],
				"repeat": true,
				"skippable": false,
				"wait": false
			},
			"moveSpeed": 3,
			"moveType": 0,
			"priorityType": 0,
			"stepAnime": false,
			"through": false,
			"trigger": 0,
			"walkAnime": true
		}
		return page;
	}


	//======================地图载入时处理========================
	ww_mapAdd.Scene_Map_isReady = Scene_Map.prototype.isReady
	Scene_Map.prototype.isReady = function () {
		return ww_mapAdd.isReady() && ww_mapAdd.Scene_Map_isReady.call(this);
	};

	ww_mapAdd.isReady = function () {
		var mapId = $gamePlayer.isTransferring() ? $gamePlayer.newMapId() : $gameMap.mapId();
		var mapDataAdds = ww_mapAdd._mapDataAdd[mapId]
		if (Array.isArray(mapDataAdds)) {
			for (var i = 0; i < mapDataAdds.length; i++) {
				var mapDataAdd = mapDataAdds[i];
				if (mapDataAdd[0]) {
					if (mapDataAdd[0] == "copyTileAreaByMap") {
						var fmapid = mapDataAdd[1]
						if (ww_mapAdd._tempMapData[fmapid]) {
						} else {
							if (ww_mapAdd._tempMapData[fmapid] !== null) {
								ww_mapAdd._tempMapDataLoad(fmapid)
							}
							return false
						}
					}
					if (mapDataAdd[0] == "copyEventByMap") {
						var fmapid = mapDataAdd[1]
						if (ww_mapAdd._tempMapData[fmapid]) {
						} else {
							if (ww_mapAdd._tempMapData[fmapid] !== null) {
								ww_mapAdd._tempMapDataLoad(fmapid)
							}
							return false
						}
					}

				}
			}
		}
		return true;
	}



	ww_mapAdd.Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded
	Scene_Map.prototype.onMapLoaded = function () {
		ww_mapAdd._onMapLoaded1()
		ww_mapAdd.Scene_Map_onMapLoaded.call(this)
	};

	ww_mapAdd._onMapLoaded1 = function () {
		var mapid = $gamePlayer.isTransferring() ? $gamePlayer.newMapId() : $gameMap.mapId();
		var mapDataAdds = ww_mapAdd._mapDataAdd[mapid]
		if (Array.isArray(mapDataAdds)) {
			for (var i = 0; i < mapDataAdds.length; i++) {
				var mapDataAdd = mapDataAdds[i];
				if (mapDataAdd[0]) {
					if (mapDataAdd[0] == "editMapScrollType") {
						var type = mapDataAdd[1] || 0
						ww_mapAdd_changeNowMapScrollType(type)
					}
					if (mapDataAdd[0] == "editMap") {
						var w = mapDataAdd[1] || 0
						var h = mapDataAdd[2] || 0
						ww_mapAdd._changeNowMap(w, h)
					}

					if (mapDataAdd[0] == "editMap1") {
						var w = mapDataAdd[1] || 0
						var h = mapDataAdd[2] || 0

						var tx = mapDataAdd[3] || 0
						var ty = mapDataAdd[4] || 0

						var fx = 0
						var fy = 0
						var fw = $dataMap.width
						var fh = $dataMap.height

						var tiles = []
						for (var z = 0; z < 5; z++) {
							tiles[z] = ww_mapAdd.loadNowMapTileArea(fx, fy, fw, fh, z)
						}
						ww_mapAdd._changeNowMap(w, h)
						for (var z = 0; z < 5; z++) {
							ww_mapAdd._changeNowMapTileArea(tx, ty, z, tiles[z])
						}
					}
					if (mapDataAdd[0] == "editMap2") {
						var w = mapDataAdd[1] || 0
						var h = mapDataAdd[2] || 0
						var fx = mapDataAdd[3] || 0
						var fy = mapDataAdd[4] || 0
						var fw = mapDataAdd[5] || 0
						var fh = mapDataAdd[6] || 0
						var tx = mapDataAdd[7] || 0
						var ty = mapDataAdd[8] || 0
						var tiles = []
						for (var z = 0; z < 5; z++) {
							tiles[z] = ww_mapAdd.loadNowMapTileArea(fx, fy, fw, fh, z)
						}
						ww_mapAdd._changeNowMap(w, h)
						for (var z = 0; z < 5; z++) {
							ww_mapAdd._changeNowMapTileArea(tx, ty, z, tiles[z])
						}
					}
					if (mapDataAdd[0] == "editTile") {
						var x = mapDataAdd[1] || 0
						var y = mapDataAdd[2] || 0
						var z = mapDataAdd[3] || 0
						var tile = mapDataAdd[4] || 0
						ww_mapAdd._changeNowMapTile(x, y, z, tile)
					}
					if (mapDataAdd[0] == "editTileAreaById") {
						var x = mapDataAdd[1] || 0
						var y = mapDataAdd[2] || 0
						var w = mapDataAdd[3] || 0
						var h = mapDataAdd[4] || 0
						var z = mapDataAdd[5] || 0
						var tile = mapDataAdd[6] || 0
						var tileArea = []
						for (var wi = 0; wi < w; wi++) {
							tileArea[wi] = []
							for (var hi = 0; hi < h; hi++) {
								tileArea[wi][hi] = tile
							}
						}
						ww_mapAdd._changeNowMapTileArea(x, y, z, tileArea)
					}
					if (mapDataAdd[0] == "copyTileAreaByMap") {
						var fmapid = mapDataAdd[1] || 0
						var x = mapDataAdd[2] || 0
						var y = mapDataAdd[3] || 0
						var w = mapDataAdd[4] || 0
						var h = mapDataAdd[5] || 0
						var z = mapDataAdd[6] || 0
						var tx = mapDataAdd[7] || 0
						var ty = mapDataAdd[8] || 0
						var tz = mapDataAdd[9] || 0
						var tileArea = ww_mapAdd.loadMapTileArea(fmapid, x, y, w, h, z)
						if (Array.isArray(tileArea)) {
							ww_mapAdd._changeNowMapTileArea(tx, ty, tz, tileArea)
						}
					}
					if (mapDataAdd[0] == "copyEvent") {
						var fid = mapDataAdd[1] || 0
						var tid = mapDataAdd[2] || 0

						var event = ww_mapAdd.loadNowMapEvent(fid)
						event.id = tid
						event.x = isFinite(mapDataAdd[3]) ? mapDataAdd[3] * 1 : event.x
						event.y = isFinite(mapDataAdd[4]) ? mapDataAdd[4] * 1 : event.y

						ww_mapAdd._changeNowMapEvent2(tid, event)
					}
					if (mapDataAdd[0] == "copyEventByMap") {
						var fmapid = mapDataAdd[1] || 0
						var fid = mapDataAdd[2] || 0
						var tid = mapDataAdd[3] || 0
						var event = ww_mapAdd.loadMapEvent(fmapid, fid)
						event.id = tid
						event.x = isFinite(mapDataAdd[4]) ? mapDataAdd[4] * 1 : event.x
						event.y = isFinite(mapDataAdd[5]) ? mapDataAdd[5] * 1 : event.y
						ww_mapAdd._changeNowMapEvent2(tid, event)
					}
					if (mapDataAdd[0] == "eventByMap") {
						var event = mapDataAdd[1]
						var tid = mapDataAdd[2] || 0
						if (event) {
							event = JSON.parse(event)
							DataManager.extractMetadata(event)
							event.id = tid
							event.x = isFinite(mapDataAdd[3]) ? mapDataAdd[3] * 1 : event.x
							event.y = isFinite(mapDataAdd[4]) ? mapDataAdd[4] * 1 : event.y
							ww_mapAdd._changeNowMapEvent2(tid, event)
						} else {
							ww_mapAdd._changeNowMapEvent2(tid, event)
						}
					}
				}
			}
		}
		return true;
	}

})();