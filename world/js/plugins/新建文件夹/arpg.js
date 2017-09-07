function Game_ArpgAction (){
    this.initialize.apply(this, arguments);
}
/**初始化 */
Game_ArpgAction.prototype.initialize =function (){
    this._item = new Game_Item(); 
    this._subject = null
    this._target = null 
} 

/**设置技能
 * @param {number} skillId 技能id
 * 
*/
Game_ArpgAction.prototype.setSkill = function (skillId) {
    //项目 设置对象 (数据技能组[技能id])
    this._item.setObject($dataSkills[skillId]);
};
/**设置物品
 * @param {number} itemId 物品id
 * 
*/
Game_ArpgAction.prototype.setItem = function (itemId) {
    //项目 设置对象 (数据物品 物品id)
    this._item.setObject($dataItems[itemId]);
};
/**设置项目对象
 * @param {object} object 对象
 * 
*/
Game_ArpgAction.prototype.setItemObject = function (object) {
    //项目 设置对象(object)
    this._item.setObject(object);
};

/**项目
 * @return {object} 项目的对象 data数据库中的item
*/
Game_ArpgAction.prototype.item = function () {
    //返回 项目 对象
    return this._item.object();
};

/**arpg 项目 
 * @return { } 
*/
Game_ArpgAction.prototype.arpgItem= function () {
    //返回 项目 是物品
    return this.item() && this.item().meta;
};

/**是技能 
 * @return {boolean} 
*/
Game_ArpgAction.prototype.isSkill = function () {
    //返回 项目 是技能
    return this._item.isSkill();
};
/**是物品
 * @return {boolean} 
*/
Game_ArpgAction.prototype.isItem = function () {
    //返回 项目 是物品
    return this._item.isItem();
}; 









