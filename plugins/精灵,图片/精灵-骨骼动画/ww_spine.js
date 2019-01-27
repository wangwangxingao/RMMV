//=============================================================================
// Show_Spine.js 
//=============================================================================
/*:
* @plugindesc 
* @author 
* 
*
* @param X
* @desc The x position of spine. this is a eval param, so you can use Variables.
* @default Graphics.width/2
*
* @param Y
* @desc The y position of spine. this is a eval param, so you can use Variables.
* @default Graphics.height/2
*
* @param scalex
* @desc The scale x of spine.
* @default 1
*
* @param scaley
* @desc The scale y of spine.
* @default 1
*
* @param opacity
* @desc The opacity of spine.
* @default 1
*
* @param rotation
* @desc The rotation of spine.
* @default 0
*
* @param loop
* @desc The loop of spine action.
* @default true
*
* @help
* Introduction
* This plugin support rmmv show Spine.
* Easy to use and powerful. Dependent on ww_Toast.js
* 
* Example:
* show:
* ww_Spine.show({filename:'spineboy', action:'walk'}); 
* all args with default:
* ww_Spine.show({id:1,x:400, y:600, action:'walk', filename:'spineboy',scalex:0.5,scaley:0.5,opacity:0.5,rotation:180,loop:true});
* remove:
* ww_Spine.remove(1);
* removeall:
* ww_Spine.removeall();
* action:
* ww_Spine.action({action:'jump'});
* ww_Spine.action({id:1,type:'loop',action:'jump',x:100,y:200,opacity:0.5,rotation:180,scalex:1.5,scaley:0.5});
* id is 1 by default; type may are loop/end/temp, default is temp;
* 
*/

 
// Parameter Variables
var ww = ww || {};
ww.Spine = ww.Spine || {};

ww.Spine.Parameters = PluginManager.parameters('ww_Spine');
ww.Spine.Param = ww.Spine.Param || {};

// 
//ww.Spine.Param.action = String(ww.Spine.Parameters['action']);
ww.Spine.Param.X = String(ww.Spine.Parameters['X']);
ww.Spine.Param.Y = String(ww.Spine.Parameters['Y']);
ww.Spine.Param.scalex = parseFloat(ww.Spine.Parameters['scalex']);
ww.Spine.Param.scaley = parseFloat(ww.Spine.Parameters['scaley']);
ww.Spine.Param.opacity = parseFloat(ww.Spine.Parameters['opacity']);
ww.Spine.Param.rotation = parseFloat(ww.Spine.Parameters['rotation']);
//ww.Spine.Param.zIndex = parseInt(ww.Spine.Parameters['zIndex']);
//ww.Spine.Param.delay = parseInt(ww.Spine.Parameters['delay']);
ww.Spine.Param.path = String(ww.Spine.Parameters['path']);
ww.Spine.Param.loop = ww.Spine.Parameters['loop'].toLowerCase() === 'true';
ww.Spine.Param.spine = [];
ww.Spine.Param.spinecontainer = [];

//main
//Spine
var ww_Spine = {
	show: function () {
		//console.log(arguments[3]);
		var wwSpineArgs = arguments[0] ? arguments[0] : {};
		var filename = wwSpineArgs['filename'] ? wwSpineArgs['filename'] : "";
		//var delay	 	=	 wwSpineArgs['delay'] ? wwSpineArgs['delay'] : ww.Spine.Param.delay;
		var id = wwSpineArgs['id'] ? wwSpineArgs['id'] : 1;
		var x = wwSpineArgs['x'] != undefined ? eval(wwSpineArgs['x']) : eval(ww.Spine.Param.X);
		var y = wwSpineArgs['y'] != undefined ? eval(wwSpineArgs['y']) : eval(ww.Spine.Param.Y);
		var scalex = wwSpineArgs['scalex'] != undefined ? wwSpineArgs['scalex'] : ww.Spine.Param.scalex;
		var scaley = wwSpineArgs['scaley'] != undefined ? wwSpineArgs['scaley'] : ww.Spine.Param.scaley;
		var opacity = wwSpineArgs['opacity'] != undefined ? wwSpineArgs['opacity'] : ww.Spine.Param.opacity;
		var rotation = wwSpineArgs['rotation'] != undefined ? wwSpineArgs['rotation'] : ww.Spine.Param.rotation;
		var action = wwSpineArgs['action'] ? wwSpineArgs['action'] : "";
		var loop = wwSpineArgs['loop'] != undefined ? wwSpineArgs['loop'] : ww.Spine.Param.loop;

		if (!action) {
			return;
		}
		if (!filename) {
			return;
		}

		var processSpine = function () {
			if (ww.Spine.Param.spine[id]) {
				SceneManager._scene.addChild(ww.Spine.Param.spine[id]);
			}else{
				return

			}
			if ( ww.Spine.Param.spine[id].filename != filename) {
				return

			}  
			ww.Spine.Param.spine[id].x = x;
			ww.Spine.Param.spine[id].y = y;
			ww.Spine.Param.spine[id].scale.x = scalex;
			ww.Spine.Param.spine[id].scale.y = scaley;
			ww.Spine.Param.spine[id].rotation = rotation;
			ww.Spine.Param.spine[id].alpha = opacity;
			ww.Spine.Param.spine[id].state.setAnimationByName(0, action, loop);
			ww.Spine.Param.spine[id].action = action;

			//console.log(ww.Spine.Param.spine);
			//console.log(ww.Spine.Param.spinecontainer);
			//console.log(ww.Spine.Param.spine[id].state.getCurrent());

			// set up the mixes!
			//spine.stateData.setMixByName("walk", "jump", 0.2);
			//spine.stateData.setMixByName("jump", "walk", 0.4);

			/*scene.stage.click = function()
			{
				spine.state.setAnimationByName(0, "jump", false);
				spine.state.addAnimationByName(0, "walk", true, 0);

			}*/
		};

		if (!ww.Spine.Param.spine[id]) {
			ww.Spine.Param.spine[id] = new Spine(filename)
		}
		ww.Spine.Param.spine[id].spineName = filename
		ww.Spine.Param.spine[id].filename = filename
		ww.Spine.Param.spine[id].addLoadListener(processSpine)
		//spine.state.setAnimationByName(0, 'jump', false);

		/*if(delay>=1){
			setTimeout(function()
			{
				$('#wwSpine'+id).remove();
			}, delay);
		}*/

		//console.log(css);
		//console.log($gameParty);
		//console.log($gameSystem);
		//console.log(TextManager.currencyUnit);

		//$('#wwSpine'+id+' img').stop().show().animate({"width": "100%","height": "100%"}, "normal");
	},
	action: function () {
		var wwSpineArgs = arguments[0] ? arguments[0] : {};
		var id = wwSpineArgs['id'] ? wwSpineArgs['id'] : 1;
		var x = wwSpineArgs['x'] != undefined ? eval(wwSpineArgs['x']) : null;
		var y = wwSpineArgs['y'] != undefined ? eval(wwSpineArgs['y']) : null;
		var scalex = wwSpineArgs['scalex'] != undefined ? wwSpineArgs['scalex'] : null;
		var scaley = wwSpineArgs['scaley'] != undefined ? wwSpineArgs['scaley'] : null;
		var opacity = wwSpineArgs['opacity'] != undefined ? wwSpineArgs['opacity'] : null;
		var rotation = wwSpineArgs['rotation'] != undefined ? wwSpineArgs['rotation'] : null;
		var action = wwSpineArgs['action'] ? wwSpineArgs['action'] : "";
		var type = wwSpineArgs['type'] ? wwSpineArgs['type'] : "temp";
		//console.log(wwSpineArgs['loop']);

		if (!action) {
			return;
		}
		if (ww.Spine.Param.spine[id]) {
			if (x) ww.Spine.Param.spine[id].x = x;
			if (y) ww.Spine.Param.spine[id].y = y;
			if (scalex) ww.Spine.Param.spine[id].scale.x = scalex;
			if (scaley) ww.Spine.Param.spine[id].scale.y = scaley;
			if (rotation) ww.Spine.Param.spine[id].rotation = rotation;
			if (opacity) ww.Spine.Param.spine[id].alpha = opacity;

			switch (type) {
				case 'loop':
					ww.Spine.Param.spine[id].state.setAnimationByName(0, action, true);
					ww.Spine.Param.spine[id].action = action;
					break;
				case 'end':
					ww.Spine.Param.spine[id].state.setAnimationByName(0, action, false);
					break;
				case 'temp':
				default:
					ww.Spine.Param.spine[id].state.setAnimationByName(0, action, false);
					ww.Spine.Param.spine[id].state.addAnimationByName(0, ww.Spine.Param.spine[id].action, true, 0);
					break;
			}
			//ww.Spine.Param.spine[id].state.setAnimationByName(0, action, loop);
			//if(!loop)
			//ww.Spine.Param.spine[id].state.addAnimationByName(0, "walk", true, 0);
		}

		//console.log(SceneManager._scene);

		//if(SceneManager._scene.children.length > id){
		//console.log(ww.Spine.Param.spine);
		//console.log(ww.Spine.Param.spinecontainer);
		//console.log(loader);
		//console.log((SceneManager._scene.getChildAt(id).toString()));
		//console.log((SceneManager._scene.getChildAt(id) instanceof PIXI.DisplayObjectContainer));
		//console.log((SceneManager._scene.getChildAt(id) instanceof Spriteset_Map));
		//console.log(typeof(SceneManager._scene.getChildAt(id)));
		/*if(SceneManager._scene.getChildAt(id) instanceof PIXI.DisplayObjectContainer){
			console.log((SceneManager._scene.getChildAt(id)));
			//SceneManager._scene.removeChildAt(id);
		}*/
		//}
	},
	remove: function () {
		var id = arguments[0] ? arguments[0] : 1;
		if (ww.Spine.Param.spine[id]) {
			SceneManager._scene.removeChild(ww.Spine.Param.spine[id]);
			ww.Spine.Param.spine[id] = null;
		}
		//console.log(SceneManager._scene);

		//if(SceneManager._scene.children.length > id){
		//console.log(ww.Spine.Param.spine);
		//console.log(ww.Spine.Param.spinecontainer);
		//console.log(loader);
		//console.log((SceneManager._scene.getChildAt(id).toString()));
		//console.log((SceneManager._scene.getChildAt(id) instanceof PIXI.DisplayObjectContainer));
		//console.log((SceneManager._scene.getChildAt(id) instanceof Spriteset_Map));
		//console.log(typeof(SceneManager._scene.getChildAt(id)));
		/*if(SceneManager._scene.getChildAt(id) instanceof PIXI.DisplayObjectContainer){
			console.log((SceneManager._scene.getChildAt(id)));
			//SceneManager._scene.removeChildAt(id);
		}*/
		//}
	},
	removeall: function () {
		console.log(SceneManager._scene);
		/*var id = [];
		SceneManager._scene.children.forEach(function(val,index,arr){
			if(val.children[0].name == 'wwSPINE'){
				id.push(index);
				//console.log(val.children[0].name);
				//console.log(val.children[0].id);
				//console.log(index);
			}
		});
		//console.log(id);
		for (var i = id.length-1; i >= 0; i--) {
			//console.log(i);
			//console.log(id[i]);
			SceneManager._scene.removeChildAt(id[i]);
		}*/
		ww.Spine.Param.spine.forEach(function (val, index, arr) {
			SceneManager._scene.removeChild(ww.Spine.Param.spine[index]);
			ww.Spine.Param.spine[index] = null;
		});
	}
};