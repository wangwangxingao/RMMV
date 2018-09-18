//=============================================================================
// ww_equipEx.js
//=============================================================================

/*:
 * @plugindesc 装备槽种类扩展
 * @author wangwang
 * 
 * 
 * @help
 * 
 * 

 * 
 * 
 * 
 * 
 * 
 *  
 * Game_Item._equipTypeOK 
 * 装备种类对应的可以装备到装备槽中的装备种类
 * (装备种类从1开始,比如武器实际上种类是1)
 * 
 * 
 * Game_Item._equipTypeMax 
 * 装备种类的数量 , 目前为 7 (7-1 =6) ,也就是角色实际上有6个装备槽(主手,副手...诱发物)
 * 
 *  
 * Game_Item.equipTypeOK( slotType, equipType )
 * 
 * 判断方法, 
 * slotType 为 装备槽允许的装备种类   如 actor.equipSlots()[0]  第一个装备槽的装备种类
 * equipType  为 装备物品的装备种类  如 item.etypeId
 * 
 *  
 * 
 * 队伍里第一个角色
 * var actor = $gameParty.members()[0]
 * 数据库中第一个角色
 * var actor = $gameActors.actor(1)
 * 
 * 
 * 武器
 * actor && actor.changeEquip( slotId , $dataWeapons[itemId]  )
 * 
 * 防具
 * actor && actor.changeEquip(slotId, $dataArmors[itemId] )
 * 
 * slotId 装备槽的id 从0开始
 * itemId  对应数据中的物品编号
 * 
 * 
 */



Game_Item._equipTypeOK = {
    0: [],
    1: [1],
    2: [2],
    3: [3],
    4: [4],
    5: [5],
    6: [6],
    7: [1, 2, 3, 4, 5, 6, 7]
}

Game_Item._equipTypeMax = 7

Game_Item.equipTypeOK = function (slotType, equipType) {
    var hash = Game_Item._equipTypeOK
    var list = hash[equipType] || [] 
    return list.indexOf(slotType) >= 0
}



Game_Actor.prototype.equipSlots = function() {
    var slots = [];
    for (var i = 1; i < Game_Item._equipTypeMax; i++) {
        slots.push(i);
    }
    if (slots.length >= 2 && this.isDualWield()) {
        slots[1] = 1;
    }
    return slots;
};


Game_Actor.prototype.changeEquip = function(slotId, item) {
    if (this.tradeItemWithParty(item, this.equips()[slotId]) &&
            (
                !item || 
                Game_Item.equipTypeOK(this.equipSlots()[slotId], item.etypeId))
              //  this.equipSlots()[slotId] === item.etypeId)
            ) {
        this._equips[slotId].setObject(item);
        this.refresh();
    }
};


Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
    for (;;) {
        var slots = this.equipSlots();
        var equips = this.equips();
        var changed = false;
        for (var i = 0; i < equips.length; i++) {
            var item = equips[i];
            if (item && (!this.canEquip(item) || 
               !Game_Item.equipTypeOK(slots[i], item.etypeId)
             //item.etypeId !== slots[i]
            ) 
        ) {
                if (!forcing) {
                    this.tradeItemWithParty(null, item);
                }
                this._equips[i].setObject(null);
                changed = true;
            }
        }
        if (!changed) {
            break;
        }
    }
};




Game_Actor.prototype.bestEquipItem = function(slotId) {
    var etypeId = this.equipSlots()[slotId];
    var items = $gameParty.equipItems().filter(function(item) {
        return Game_Item.equipTypeOK(etypeId, item.etypeId) && this.canEquip(item); //item.etypeId === etypeId && this.canEquip(item);
    }, this);
    var bestItem = null;
    var bestPerformance = -1000;
    for (var i = 0; i < items.length; i++) {
        var performance = this.calcEquipItemPerformance(items[i]);
        if (performance > bestPerformance) {
            bestPerformance = performance;
            bestItem = items[i];
        }
    }
    return bestItem;
};



Window_EquipItem.prototype.includes = function(item) {
    if (item === null) {
        return true;
    }
    if (this._slotId < 0 || 

        !Game_Item.equipTypeOK(this._actor.equipSlots()[this._slotId], item.etypeId)
       // item.etypeId !== this._actor.equipSlots()[this._slotId]
    
    ) {
        return false;
    }
    return this._actor.canEquip(item);
};



Window_ShopStatus.prototype.currentEquippedItem = function(actor, etypeId) {
    var list = [];
    var equips = actor.equips();
    var slots = actor.equipSlots();
    for (var i = 0; i < slots.length; i++) {

        if (Game_Item.equipTypeOK(slots[i] , etypeId)){
        
        //if (slots[i] === etypeId) {
            list.push(equips[i]);
        }
    }
    var paramId = this.paramId();
    var worstParam = Number.MAX_VALUE;
    var worstItem = null;
    for (var j = 0; j < list.length; j++) {
        if (list[j] && list[j].params[paramId] < worstParam) {
            worstParam = list[j].params[paramId];
            worstItem = list[j];
        }
    }
    return worstItem;
};
  