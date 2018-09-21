//=============================================================================
// changPictureName.js
//=============================================================================

/*:
 * @plugindesc 改变图片名称
 * @author wangwang
 *   
 * @param changPictureName
 * @desc 插件 改变图片名称
 * @default 汪汪
 *
 * @param valueIndex
 * @desc  变量的值,如果为0 则直接在人物上赋值,否则用变量,用变量后,不要对这个变量进行操作
 * @default 0
 *
 * 
 * @param facenameHash
 * @desc   如果脸图名为 actor1 则使用1号的后缀,为 bat 则用2号的 
 * @default  {"actor1":1,"bat":2}
 * 
 * 
 * @param facePictureIndex
 * @desc  脸图的后缀的变量名称 ,不用修改
 * @default  facePictureIndex
 *  
 * 
 * @param standPicture
 * @desc  standPicture图的变量名称,不用修改
 * @default  standPicture
 * 
 *  
 * @param standPictureIndex
 * @desc standPicture图后缀的变量名称,不用修改
 * @default  standPictureIndex
 * 
 * 
 * @param characterNameHash
 * @desc   如果行走图名为 actor1 则使用1号的后缀,为 bat 则用2号的 
 * @default  {"actor1":1,"bat":2}
 *  
 * @param characterChange
 * @desc 行走图后缀的变量名称,不用修改
 * @default  characterChange
 * 
 * 
 *  
 * @param battlerChange
 * @desc 战斗图后缀的变量名称,不用修改
 * @default  battlerChange
 * 
 *  
 *  
 * 
 * 
 * @help
 *  
 * ***********************************************
 * StandPicture图部分
 * ***********************************************
 *  StandPicture图的名称最终为  图名 +  后缀 
 * 
 * 
 * 
 *  ww.changPictureName.setActorStandPicture (id, name)
 * 
 * 设置 id 的角色 的 StandPicture 图 为 name  ,如果没设置则使用注释中的内容
 *  
 * 如   ww.changPictureName.setActorStandPicture (1, "stand") 
 *  
 * 
 *  
 * ww.changPictureName.setActorStandPictureIndex (id, index)  
 * 设置 id 的角色 的 StandPicture 图的后缀为 index  
 *  
 * 如  ww.changPictureName.setActorStandPictureIndex (1, "test") 
 *  
 * 
 * 
 * 
 * ***********************************************
 * 脸图部分
 * ***********************************************
 * 
 * 
 *  脸图的名称最终为  图名 + "-" + 脸图索引 + 后缀 
 * 
 * 
 *  
 * ww.changPictureName.setActorFacePictureIndex  (id, hz) 
 * 设置 id 的角色 的脸图的后缀为 hz  
 *  
 * 如  ww.changPictureName.setActorFacePictureIndex (1, "test") 
 * 
 * 
 * 
 * ***********************************************
 * 行走图部分
 * ***********************************************
 *  
 *  
 * ww.changPictureName.setCharacterPictureIndex  (id, hz) 
 * 设置 id 的角色 的行走图的后缀为 hz  
 *  
 * 如  ww.changPictureName.setCharacterPictureIndex (1, "test") 
 * 
 * 
 * 
 * ***********************************************
 * 战斗图部分
 * ***********************************************
 * 
 *  
 *  
 * ww.changPictureName.setBattlerPictureIndex  (id, hz) 
 * 设置 id 的角色 的战斗图的后缀为 hz  
 *  
 * 如  ww.changPictureName.setBattlerPictureIndex (1, "test") 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 *  
 * 
 */













var ww = ww || {}



ww.PluginManager = {
    find: function (n) { var l = PluginManager._parameters; var p = l[(n || "").toLowerCase()]; if (!p) { for (var m in l) { if (l[m] && (n in l[m])) { p = l[m]; } } }; return p || {} },
    parse: function (i) { try { return JSON.parse(i) } catch (e) { return i } },
    get: function (n) { var m, o = {}, p = this.find(n); for (m in p) { o[m] = this.parse(p[m]) }; return o }
}




ww.changPictureName = {}


ww.changPictureName.set = ww.PluginManager.get("changPictureName")


/**   
 ww.changPictureName.set.facenameHash = {  
 } 
 */


ww.changPictureName.actor = function (id) {

    var i = this.set.valueIndex || 0
    if (i) {
        if (typeof $gameVariables._data[i] != "object") {
            $gameVariables._data[i] = {}
        }
        $gameVariables._data[i][id] = $gameVariables._data[i][id] || {}
        return $gameVariables._data[i][id]
    } else {
        return $gameActors.actor(id)

    }

}


/**
 * 
 * @param {*} id
 */
ww.changPictureName.changeStandPicture = function (id) {

    var name = ""
    if (id) {
        var basename = this.getActorStandPicture(id)
        var hz = this.getActorStandPictureIndex(id)
        var name = basename + hz
    }
    return name
}

ww.changPictureName.changeFacePicture = function () {

    var name = ""
    var facename = $gameMessage.faceName()
    if (facename) {
        var index = ($gameMessage.faceIndex() + 1)
        var hz = this.getActorFacePictureIndex(facename)
        var name = facename + "_" + index + hz  // +  Galv.MB.f
    }
    return name
}



/**
 * 
 * @param {*} id
 */
ww.changPictureName.getBattlerPictureIndex = function (id) {

    var actor = this.actor(id)
    var name = ""
    if (actor) {
        var name = actor[this.set.battlerChange] || ""//|| $dataActors[actor.actorId()].meta.stand_picture || "";
    }
    return name
}


/**
 * 
 * @param {*} id 
 * @param {*} name 
 */
ww.changPictureName.setBattlerPictureIndex = function (id, name) {
    var actor = this.actor(id)
    if (actor) {
        var v = this.set.battlerChange
        if (v) {
            actor[v] = name || ""
        }
    }
    return name
}



/**
 * 
 * @param {*} name 
 */
ww.changPictureName.getCharacterPictureIndex = function (face) {
    var name = face||""
    if (face) {
        var characterNameHash = this.set.characterNameHash || {}
        var id = characterNameHash[face] || 0
        if (id) {
            var actor = this.actor(id)
            if (actor) {
                var name = face + (actor[this.set.characterChange] || "")
            }
        }
    }
    return name
}


/**
 * 
 * @param {*} id 
 * @param {*} name 
 */
ww.changPictureName.setCharacterPictureIndex = function (id, name) {
    var actor = this.actor(id)
    if (actor) {
        var v = this.set.characterChange
        if (v) {
            actor[v] = name || ""
        }
    }
    return name
}




/**
 * 
 * @param {*} id
 */
ww.changPictureName.getActorStandPicture = function (id) {

    var actor = this.actor(id)
    var name = ""
    if (actor) {
        var name = actor[this.set.standPicture] || $dataActors[id].meta.stand_picture || "";
    }
    return name
}




/**
 * 
 * @param {*} id 
 * @param {*} name 
 */
ww.changPictureName.setActorStandPicture = function (id, name) {
    var actor = this.actor(id)
    if (actor) {

        var v = this.set.standPicture
        if (v) {
            actor[v] = name || ""
        }
    }
    return name
}







/**
 * 
 * @param {*} id
 */
ww.changPictureName.getActorStandPictureIndex = function (id) {

    var actor = this.actor(id)
    var name = ""
    if (actor) {
        var name = actor[this.set.standPictureIndex] || ""//|| $dataActors[actor.actorId()].meta.stand_picture || "";
    }
    return name
}




/**
 * 
 * @param {*} id 
 * @param {*} index 
 */
ww.changPictureName.setActorStandPictureIndex = function (id, index) {
    var actor = this.actor(id)
    if (actor) {
        var v = this.set.standPictureIndex
        if (v) {
            actor[v] = index || ""//|| $dataActors[actor.actorId()].meta.stand_picture || "";
        }
    }
    return name
}



/**
 * 
 * @param {*} name 
 */
ww.changPictureName.getActorFacePictureIndex = function (face) {
    var name = ""
    if (face) {
        var facenameHash = this.set.facenameHash || {}
        var id = facenameHash[face] || 0
        if (id) {
            var actor = this.actor(id)
            if (actor) {
                var name = actor[this.set.facePictureIndex] || ""
            }
        }
    }
    return name
}



/**
 * 
 * @param {*} id 
 * @param {*} name 
 */
ww.changPictureName.setActorFacePictureIndex = function (id, name) {
    var actor = this.actor(id)
    if (actor) {
        var v = this.set.facePictureIndex
        if (v) {
            actor[v] = name || ""
        }
    }
    return name
}




Game_Actor.prototype.characterName = function () {
    return ww.changPictureName.getCharacterPictureIndex(this._characterName);
};


Game_CharacterBase.prototype.characterName = function() { 
    return ww.changPictureName.getCharacterPictureIndex(this._characterName);
    
};

Game_Actor.prototype.battlerName = function () {
    //返回 战斗图名称
    return this._battlerName ? this._battlerName + ww.changPictureName.getBattlerPictureIndex(this.actorId()) : this._battlerName;
};






Window_MenuStatus.prototype.drawItemImage = function (index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRectForText(index);
    // load stand_picture
    var bitmapName = ww.changPictureName.changeStandPicture(actor.actorId())  //   $dataActors[actor.actorId()].meta.stand_picture;



    var bitmap = bitmapName ? ImageManager.loadPicture(bitmapName) : null;
    var w = Math.min(rect.width, (bitmapName ? bitmap.width : 144));
    var h = Math.min(rect.height, (bitmapName ? bitmap.height : 144));
    var lineHeight = this.lineHeight();
    this.changePaintOpacity(actor.isBattleMember());
    if (bitmap) {
        var sx = (bitmap.width > w) ? (bitmap.width - w) / 2 : 0;
        var sy = (bitmap.height > h) ? (bitmap.height - h) / 2 : 0;
        var dx = (bitmap.width > rect.width) ? rect.x :
            rect.x + (rect.width - bitmap.width) / 2;
        var dy = (bitmap.height > rect.height) ? rect.y :
            rect.y + (rect.height - bitmap.height) / 2;
        this.contents.blt(bitmap, sx, sy, w, h, dx, dy);
    } else { // when bitmap is not set, do the original process.
        this.drawActorFace(actor, rect.x, rect.y + lineHeight * 2.5, w, h);
    }
    this.changePaintOpacity(true);
};



Sprite_GalvBust.prototype.loadBitmap = function () {
    var name = ww.changPictureName.changeFacePicture() //  $gameMessage.faceName() + "_" + ($gameMessage.faceIndex() + 1);
    if ($gameSystem.bustDisable) {
        var img = ImageManager.loadPicture('');
    } else {
        var img = ImageManager.loadPicture(name);
    };
    if (img.isReady()) {
        if (this.bitmap) {
            //this._destroyCachedSprite();
            this.bitmap = null;
        };
        this.bitmap = img;
        this.name = name;
        this.hasBust = true;
    };
};









Sprite_GalvBust.prototype.controlBitmap = function () {
    var name = ww.changPictureName.changeFacePicture()

    if ($gameMessage.faceName() && this.name !== name) {
        this.loadBitmap();  // If image changed, reload bitmap
    };

    if (Galv.MB.msgWindow.openness <= 0 || !this.hasBust || $gameSystem.bustDisable) {
        this.opacity = 0;
        this.name = "";
        this.hasBust = false;
        return;
    };

    if ($gameSystem.bustMirror) {
        this.scale.x = -1;
        var offset = this.bitmap.width;
    } else {
        this.scale.x = 1;
        var offset = 0;
    };

    this.opacity = $gameMessage.faceName() ? Galv.MB.msgWindow._openness : this.opacity - 32;

    // Control image position
    switch (Galv.MB.msgWindow.tempPosType) {
        case 0:
            this.y = this.baseY();
            break;
        case 1:
            //top and middle
            this.y = this.baseY() - Galv.MB.msgWindow.y;
            break;
        case 2:
            //bottom
            if (Galv.MB.prio == 1) {
                this.y = Galv.MB.msgWindow.height - this.bitmap.height;
            } else if (Galv.MB.pos === 1) {
                this.y = this.baseY();
            } else {
                this.y = this.baseY() - Galv.MB.msgWindow.height;
            };
            break;
    };

    if ($gameSystem.bustPos == 1) {
        // if on the right
        if (Galv.MB.prio == 1) {
            this.x = Galv.MB.msgWindow.width - this.bitmap.width + offset;
        } else {
            this.x = Galv.MB.msgWindow.x + Galv.MB.msgWindow.width - this.bitmap.width + offset;
        };
    } else {
        // else on the left
        if (Galv.MB.prio == 1) {
            this.x = 0 + offset;
        } else {
            this.x = Galv.MB.msgWindow.x + offset;
        };
    };
};





