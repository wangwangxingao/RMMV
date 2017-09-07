
/**-----------------------------------------------------------------------------*/
/** Game_Item*/
/** 游戏项目*/
/** The game object class for handling skills, items, weapons, and armor. It is*/
/** required because save data should not include the database object itself.*/
/** 处理技能物品武器盔甲的游戏对象类,它是必须的因为保存数据不会包括游戏数据库自己*/

function Game_Item() {
    this.initialize.apply(this, arguments);
}
/**初始化
 * @param {object} item 数据库中的item对象
*/
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
/**是技能
 * @return {boolean}  
 * */
Game_Item.prototype.isSkill = function() {
	//返回 数据分类 = "skill"
    return this._dataClass === 'skill';
};
/**是物品
 * @return {boolean}  
 * */
Game_Item.prototype.isItem = function() {
	//返回 数据分类 = "item"
    return this._dataClass === 'item';
};
/**是可用项目
 * @return {boolean}  
 * */
Game_Item.prototype.isUsableItem = function() {
	//返回 是技能 或者 是物品
    return this.isSkill() || this.isItem();
};
/**是武器
 * @return {boolean}  
 * */
Game_Item.prototype.isWeapon = function() {
	//返回 数据分类 = "weapon"
    return this._dataClass === 'weapon';
};
/**是防具
 * @return {boolean} 
 * */ 
Game_Item.prototype.isArmor = function() {
	//返回 数据分类 = "armor"
    return this._dataClass === 'armor';
};
/**是装备物品 
 * @return {boolean}  
 * */
Game_Item.prototype.isEquipItem = function() {
	//返回 是武器 或者 是防具
    return this.isWeapon() || this.isArmor();
};
/**是无效的 
 * @return {boolean} 
 * */
Game_Item.prototype.isNull = function() {
	//返回 数据分类 = ""
    return this._dataClass === '';
};
/**项目id
 * @return {number}  
 * */
Game_Item.prototype.itemId = function() {
	//返回 项目id
    return this._itemId;
};
/**对象
 * @return {object} 数据库中的item对象
 * */
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
/**设置对象
 * @param {object} item  数据库中的item对象
 * */
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
    //项目id =  项目 ? 项目 id : 0 
    this._itemId = item ? item.id : 0;
};
/**设置装备
 * @param {boolean} isWeapon  是否是武器
 * @param {number} itemId  项目id
 * */ 
Game_Item.prototype.setEquip = function(isWeapon, itemId) {
	//数据分类 =  是武器 ? weapon : armor 
    this._dataClass = isWeapon ? 'weapon' : 'armor';
    //项目id = itemId
    this._itemId = itemId;
};


/**解读
 * 
 * Game_Item 储存物品,技能的对象,
 * 
 * 保存内容为 
 * 
 * 数据分类 = ""
 * this._dataClass = '';
 * 项目id = 0
 * this._itemId = 0;
 * 
 * 
 * 初始化时传入一个item , 通过
 * .setObject(item) 设置 这个item的分类和id .setEquip 设置装备 
 * .object() 通过 分类 和 id 获取 data 类的 item 内容 
 * 通过 
 * .isArmor *是防具*  , .isWeapon  *是武器* , .isEquipItem  *是装备*,
 * .isItem  *是物品*  , .isSkill  *是技能*,   .isUsableItem  *是可用项目* ,
 * .isNull  *是无效的* ,
 * 获取类型
 * .itemId  *项目id* 
 * 获取项目id 
 * 
 * 
 */