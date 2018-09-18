//=============================================================================
//  Scenen_ItemSet.js
//=============================================================================

/*:
 * @plugindesc  
 * Scene_ItemSet,物品场景设置 
 * @author wangwang
 *   
 * @param  Scene_ItemSet
 * @desc 插件 物品场景设置 ,作者:汪汪
 * @default 汪汪
 * 
 * 
 * @help
 *===========================================================
 * SceneManager.push(Scene_Item);   
 * SceneManager.prepareNextScene( [["资源道具", 'item']], 0 )
 *
 * 进入物品窗口 
 * 设置 种类列表为 [["资源道具", 'item']]
 * 设置 默认选项为 0   (直接进入0号种类,当为-1时不进入)  
 * 
 *
 * 当只有一个种类时,默认进入第一个并且不提供种类选择功能
 *
 * 必须调用
 *
 **===========================================================
 *
 * 列表物品,列出的是相应id的物品 
 * ww.sceneItemSet.listset 
 *
 * 游戏中可以用  
 * ww.sceneItemSet.listset["newlist"] = [1,5]  
 * 这样的修改
 * 种类为 "newlist" 的种类 ,使用的为 1,5 号物品
 *===========================================================
 *
 * 默认种类列表:
 * ww.sceneItemSet.list
 * 
 * 默认值  
 * [
 *    ["资源道具", 'item'], 
 *    ["特殊道具", 'hideItemA'],
 *    ["法器列表", 'hideItemB'],  
 *    ["制作列表", 'keyItem'],
 * ]
 */



var ww = ww || {}

ww.sceneItemSet = {}




ww.sceneItemSet.prepareList = []


/**列表物品,列出的是相应id的物品 
 * 
 * 游戏中可以用 
 * 
 * Scene_ItemBase.listset["newlist"] = [1,5] 
 * 
 * 这样的修改
 */
ww.sceneItemSet.listset = {


    "itemList": [1, 2, 3],
    "newList": [1, 5]



}



/** 种类的列表,前面是显示的文字,后面是种类的关键词
   Window_ItemCategory.list = [
      ["物品", 'item'],
      ["武器", 'weapon']
    ]
    游戏中可以用 这样的修改
*/
ww.sceneItemSet.list = [
    ["资源道具", 'item'],
    ["特殊道具", 'hideItemA'],
    ["法器列表", 'hideItemB'],
    ["制作列表", 'keyItem'],
]

 
 

Scene_Item.prototype.prepare = function (category, select) {
    var category = category || Window_ItemCategory.list
    var select = select === undefined ? -1 : select
    this._prepareset = [category, select]
};
 

Scene_Item.prototype.create = function () {
    this._prepareset = this._prepareset || [Window_ItemCategory.list, -1]
    ww.sceneItemSet.prepareList = this._prepareset

    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createCategoryWindow();
    this.createItemWindow();
    this.createActorWindow();
};

 


Scene_Item.prototype.start = function () {
    Scene_ItemBase.prototype.start.call(this);

    var select = -1
    if (this._categoryWindow.maxItems() == 1) {
        select = 0
    } else { 
        var set =  ww.sceneItemSet.prepareList
        var select = set ? set[1] : -1
    }
    if (select >= 0) {
        this._categoryWindow.select(select)
        this._categoryWindow.deactivate()
        this._categoryWindow.callOkHandler()
    }
};


/**当物品取消 */
Scene_Item.prototype.onItemCancel = function () {
    if (this._categoryWindow.maxItems() == 1) {
        this.popScene()
    } else {
        this._itemWindow.deselect();
        this._categoryWindow.activate();
    }
};
 

Window_ItemCategory.prototype.makeCommandList = function () {
    var set = ww.sceneItemSet.prepareList 
    var category = set ? set[0] || ww.sceneItemSet.list : ww.sceneItemSet.list
    for (var i = 0; i < category.length; i++) {
        var l = category[i]
        this.addCommand(l[0], l[1]);
    }
};

/**不同关键词对应的列表 */
Window_ItemList.prototype.includes = function (item) {
    switch (this._category) {
        //普通物品
        case 'item':
            return DataManager.isItem(item) && item.itypeId === 1;
        case 'weapon':
            return DataManager.isWeapon(item);
        case 'armor':
            return DataManager.isArmor(item);
        case 'keyItem':
            return DataManager.isItem(item) && item.itypeId === 2;
        //隐藏物品a
        case 'hideItemA':
            return DataManager.isItem(item) && item.itypeId === 3;
        //隐藏物品b
        case 'hideItemB':
            return DataManager.isItem(item) && item.itypeId === 4;
        //所有物品
        case 'itemAll':
            return DataManager.isItem(item);
        default:
            //列表物品
            var l = ww.sceneItemSet.listset
            var v = l[this._category]
            if (Array.isArray(v)) {
                return DataManager.isItem(item) && v.indexOf(item.id) >= 0;
            }

            return false;
    }
};