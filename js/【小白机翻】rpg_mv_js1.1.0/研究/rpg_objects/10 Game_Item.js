
//-----------------------------------------------------------------------------
// Game_Item
// 游戏项目
// The game object class for handling skills, items, weapons, and armor. It is
// required because save data should not include the database object itself.
// 处理技能物品武器盔甲的游戏对象类,它是必须的因为保存数据不会包括游戏数据库自己

function Game_Item() {
    this.initialize.apply(this, arguments);
}
//初始化
Game_Item.prototype.initialize = function(item) {
	//数据分类 = ""
    this._dataClass = '';
    //项目id = 0
    this._itemId = 0;
    //如果 项目
    if (item) {
	    //设置对象 (项目)
        this.setObject(item);
    }
};
//是技能
Game_Item.prototype.isSkill = function() {
	//返回 数据分类 = "skill"
    return this._dataClass === 'skill';
};
//是物品
Game_Item.prototype.isItem = function() {
	//返回 数据分类 = "item"
    return this._dataClass === 'item';
};
//是可用项目
Game_Item.prototype.isUsableItem = function() {
	//返回 是技能 或者 是物品
    return this.isSkill() || this.isItem();
};
//是武器
Game_Item.prototype.isWeapon = function() {
	//返回 数据分类 = "weapon"
    return this._dataClass === 'weapon';
};
//是防具
Game_Item.prototype.isArmor = function() {
	//返回 数据分类 = "armor"
    return this._dataClass === 'armor';
};
//是装备物品
Game_Item.prototype.isEquipItem = function() {
	//返回 是武器 或者 是防具
    return this.isWeapon() || this.isArmor();
};
//是无效的
Game_Item.prototype.isNull = function() {
	//返回 数据分类 = ""
    return this._dataClass === '';
};
//项目id
Game_Item.prototype.itemId = function() {
	//返回 项目id
    return this._itemId;
};
//对象
Game_Item.prototype.object = function() {
	//如果 是技能
    if (this.isSkill()) {
	    //返回 数据技能[项目id]
        return $dataSkills[this._itemId];
    //否则 如果 是物品
    } else if (this.isItem()) {
	    //返回 数据物品[项目id]
        return $dataItems[this._itemId];
    //否则 如果 是武器
    } else if (this.isWeapon()) {
	    //返回 数据武器[项目id]
        return $dataWeapons[this._itemId];
    //否则 如果 是防具
    } else if (this.isArmor()) {
	    //返回 数据防具[项目id]
        return $dataArmors[this._itemId];
    //否则 
    } else {
	    //返回 null
        return null;
    }
};
//设置对象
Game_Item.prototype.setObject = function(item) {
	//如果 数据管理器 是技能(item)
    if (DataManager.isSkill(item)) {
	    //数据分类 = "skill"
        this._dataClass = 'skill';
	//否则 如果 数据管理器 是物品(item)
    } else if (DataManager.isItem(item)) {
	    //数据分类 = "item"
        this._dataClass = 'item';
	//否则 如果 数据管理器 是武器(item)
    } else if (DataManager.isWeapon(item)) {
	    //数据分类 = "weapon"
        this._dataClass = 'weapon';
	//否则 如果 数据管理器 是防具(item)
    } else if (DataManager.isArmor(item)) {
	    //数据分类 = "armor"
        this._dataClass = 'armor';
    //否则 
    } else {
	    //数据分类 = ""
        this._dataClass = '';
    }
    //项目id = 如果 项目 返回 项目 id 否则 返回 0 
    this._itemId = item ? item.id : 0;
};
//设置装备
Game_Item.prototype.setEquip = function(isWeapon, itemId) {
	//数据分类 = 如果 是武器 返回 weapon 否则 返回 armor 
    this._dataClass = isWeapon ? 'weapon' : 'armor';
    //项目id = itemId
    this._itemId = itemId;
};
