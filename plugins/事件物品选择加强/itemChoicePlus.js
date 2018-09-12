//=============================================================================
// itemChoicePlus.js
//=============================================================================

/*:
 * @plugindesc 弹出信息
 * @author wangwang
 *   
 * @param itemChoicePlus
 * @desc 插件 弹出信息
 * @default 汪汪
 *
 * @help
 * 
 * 
 * 
 * 
 * 
 * $gameMessage.setAllItemsType = type
 *  type
 *  0   全部物品
 *  1   可变装备
 *  2   全部物品 + 可变装备
 *  3   全部 装备
 *  4   全部物品+装备
 * 
 * weapon :武器  如果后面有值则为 wtypeid 值
 * item :普通物品  如果后面有值则为 itypeId 值 
 * armor :防具  如果后面有值则为 atypeId 值
 * 
 * $gameMessage.setItemChoice(1,"weapon" )
 * 显示武器物品窗口
 * 返回值为 物品的id 
 * 
 * 
 * $gameMessage.setItemChoice(1,["weapon1","item","armor"])
 * 
 * 
 * 武器物品防具三种类窗口
 * 
 * 种类 "w" 武器 "i" 物品 "a" 防具 其他为其他
 * 返回值为 [种类,物品的id ]
 *  
 * 
 */
DataManager.includesString = function (item, type) {
    var type = type || ""
    switch (type) {
        case 'item':
            return DataManager.isItem(item) && item.itypeId === 1;
        case 'weapon':
            return DataManager.isWeapon(item);
        case 'armor':
            return DataManager.isArmor(item);
        case 'keyItem':
            return DataManager.isItem(item) && item.itypeId === 2;
        case 'itemall':
            return DataManager.isItem(item);
        case 'all':
            return DataManager.isItem(item) || DataManager.isArmor(item) || DataManager.isWeapon(item);
        default:
            if (type.indexOf("item") == 0) {
                var itypeId = type.slice(4) * 1
                return DataManager.isItem(item) && item.itypeId == itypeId;
            } else if (type.indexOf("weapon") == 0) {
                var itypeId = type.slice(6) * 1
                return DataManager.isWeapon(item) && item.wtypeId == itypeId;
            } else if (type.indexOf("armor") == 0) {
                var itypeId = type.slice(5) * 1
                return DataManager.isArmor(item) && item.atypeId == itypeId;
            } else if (type.indexOf("etype") == 0) {
                var itypeId = type.slice(5) * 1
                return (DataManager.isArmor(item) || DataManager.isWeapon(item)) && item.etypeId == itypeId;
            }
            return false;
    }
};

Game_Party.prototype.allEquips = function (change) {
    //返回 角色组 映射 方法(id)
    var list = []
    var actors = this.allMembers()
    for (var ai = 0; ai < actors.length; ai++) {
        actor = actors[ai]
        if (actor) {
            //槽组 = 装备槽组
            var slots = actor.equipSlots();
            //最大槽数 = 槽组 长度
            var maxSlots = slots.length;
            var equips = actor.equips();
            if (change) {
                list.concat(equips)
            } else {
                for (var j = 0; j < maxSlots; j++) {
                    if (actor.isEquipChangeOk(j)) {
                        list.push(equips[j])
                    }
                }
            }
        }
    }


    var o = { items: {}, weapons: {}, armors: {} }


    for (var i = 0; i < list.length; i++) {
        var item = list[i]
        if (item) {
            if (DataManager.isWeapon(item)) {
                o.weapons[item.id] = o.weapons[item.id] || 0
                o.weapons[item.id]++
            } else if (DataManager.isArmor(item)) {
                o.armors[item.id] = o.armors[item.id] || 0
                o.armors[item.id]++
            }
        }
    }
    return o
};


/**全部物品的 
 * 
 * @param {} change  是否允许改变,true 全部都 , false 不能改变的不列入
 * @param {} use 0 全 1 队伍 2装备中
*/
Game_Party.prototype.allItemsPlus = function (use, change) {


    var o = use != 1 ? this.allEquips(change) : { items: {}, weapons: {}, armors: {} }


    if (use != 2) {
        for (var i in this._items) {
            o.items[i] = o.items[i] || 0
            o.items[i] += this._items[i]

        }

        for (var i in this._weapons) {
            o.weapons[i] = o.weapons[i] || 0
            o.weapons[i] += this._weapons[i]

        }


        for (var i in this._armors) {
            o.armors[i] = o.armors[i] || 0
            o.armors[i] += this._armors[i]
        }
    }


    return o
};



Game_Party.prototype.allItemsObject = function (o) {

    var items = this.itemsByAllObject(o)
    var weapons = this.weaponsByAllObject(o)
    var armors = this.armorsByAllObject(o)
    return items.concat(weapons).concat(armors)

};


Game_Party.prototype.itemsByAllObject = function (o) {
    //列表 = []
    var list = [];
    //循环 (id 在 物品组)
    for (var id in o.items) {
        //列表 添加( 数据物品组[id] )
        list.push($dataItems[id]);
    }
    //返回 列表
    return list;
};
/**武器组*/
Game_Party.prototype.weaponsByAllObject = function (o) {
    //列表 = []
    var list = [];
    //循环 (id 在 武器组)
    for (var id in o.weapons) {
        //列表 添加( 数据武器组[id] )
        list.push($dataWeapons[id]);
    }
    //返回 列表
    return list;
};
/**防具组*/
Game_Party.prototype.armorsByAllObject = function (o) {
    //列表 = []
    var list = [];
    //循环 (id 在 防具组)
    for (var id in o.armors) {
        //列表 添加( 数据防具组[id] )
        list.push($dataArmors[id]);
    }
    //返回 列表
    return list;
};


/**
 *  0   全部物品
 *  1   可变装备
 *  2   全部物品 + 可变装备
 *  3   全部 装备
 *  4   全部物品+装备
 *  
 * 
 */
Game_Message.prototype.setAllItemsType = function (type) {
    this._allItemsType = type

}

Game_Message.prototype.getAllItemsType = function () {
    return this._allItemsType

}


Window_EventItem.prototype.getAllItems = function () {


    var o = { items: {}, weapons: {}, armors: {} }

    var type = $gameMessage._allItemsType

    if (!type) {

        var o = $gameParty.allItemsPlus(1)

    } else if (type == 1) {
        var o = $gameParty.allItemsPlus(2)

    } else if (type == 2) {
        var o = $gameParty.allItemsPlus(0)

    } else if (type == 3) {
        var o = $gameParty.allItemsPlus(2, 1)

    } else if (type == 4) {
        var o = $gameParty.allItemsPlus(0, 1)
    }

    this._itemContainer = o

    return $gameParty.allItemsObject(o)
}













Window_EventItem.prototype.makeItemList = function () {
    this._data = this.getAllItems().filter(function (item) {
        return this.includes(item);
    }, this);
    if (this.includes(null)) {
        this._data.push(null);
    }
};



Window_EventItem.prototype.includes = function (item) {
    if (!item) { return false }

    var itypeId = $gameMessage.itemChoiceItypeId();

    if (typeof (itypeId) == "number") {
        return DataManager.isItem(item) && item.itypeId === itypeId;
    } else if (typeof (itypeId) == "string") {
        return DataManager.includesString(item, itypeId)
    } else if (Array.isArray(itypeId)) {
        for (var i = 0; i < itypeId.length; i++) {
            var type = itypeId[i]
            var re = DataManager.includesString(item, type)
            if (re) {
                return true
            }
        }
    } else if (typeof (itypeId) == "object") {
        for (var i in itypeId) {
            var type = i
            var list = itypeId[i]
            var re = DataManager.includesString(item, type)
            if (re) {
                if (Array.isArray(list)) {
                    re = list.indexOf(item.id) >= 0
                    if (re) {
                        return re
                    }
                } else {
                    return true
                }
            }
        }
    }
    return false
};



Window_EventItem.prototype.getItemType = function (item) {

    if (DataManager.isWeapon(item)) {
        return "w"
    } else if (DataManager.isArmor(item)) {
        return "a"
    } else if (DataManager.isItem(item)) {
        return "i"
    } else {
        return ""
    }

}


Window_ItemList.prototype.numItems = function (item) {

    if (!item) {
        return 0;
    } else if (DataManager.isItem(item)) {
        return this._itemContainer ? this._itemContainer.items[item.id] : 0;
    } else if (DataManager.isWeapon(item)) {
        return this._itemContainer ? this._itemContainer.weapons[item.id] : 0;
    } else if (DataManager.isArmor(item)) {
        return this._itemContainer ? this._itemContainer.armors[item.id] : 0;
    } else {
        return 0;
    }


};

Window_ItemList.prototype.drawItemNumber = function (item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText(':', x, y, width - this.textWidth('00'), 'right');
        this.drawText(this.numItems(item), x, y, width, 'right');
    }
};



Window_EventItem.prototype.getItemId = function (item) {

    var itypeId = $gameMessage.itemChoiceItypeId();

    if (typeof (itypeId) == "number") {
        return item ? item.id : 0;
    } else if (typeof (itypeId) == "string") {
        if (itypeId == "all" || itypeId.indexOf("etype") >= 0) {
            return [this.getItemType(item), item ? item.id : 0];
        } else {
            return item ? item.id : 0;
        }
    } else {
        return [this.getItemType(item), item ? item.id : 0];
    }
};




Window_EventItem.prototype.onOk = function () {
    var item = this.item();
    var itemId = this.getItemId(item);
    $gameVariables.setValue($gameMessage.itemChoiceVariableId(), itemId);
    this._messageWindow.terminateMessage();
    this.close();
};