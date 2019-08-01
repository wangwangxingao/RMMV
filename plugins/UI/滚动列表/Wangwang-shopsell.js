//=============================================================================
// Sprite_ShopSell.js
//=============================================================================

/*:
 * @plugindesc 显示商店卖出窗口
 * @author 汪汪
 * @version 2.0
 * 
 * 
 * @param ww_xinxishopsell
 * @desc 显示商店卖出窗口
 * @default 0.1
 * 
 * 
 * @param shopid 
 * @desc  默认的物品窗口的id,可以是数组如[3,5,6],当获得失去物品时进行刷新该窗口
 * @default 4
 *  
 * 
 * @help 
 * 
 * type 种类  "shopsell" 物品卖的窗口
 * 
 * category  物品种类 
 *    "item", 普通物品 
 *    'weapon' 武器
 *    'armor'  防具
 *    'keyItem'  关键物品
 *    'itemall' 全部物品
 *    'all'    物品+武器+防具
 *    数组 []  其中的值对应的种类
 *    对象 {}  item:[id]  id的物品
 *             weapon:[id]  id的武器
 *             armor:[id]  id的防具
 * 
 * goods 设置价格的对象 {}  item:[id]  id的物品的价格
 *                weapon:[id]  id的武器的价格
 *                armor:[id]  id的防具的价格
 *                如  goods:{item:{1:0,3:100},weapon:{30:20}}
 *                不设置为原价
 * 
 * dzz 设置折扣比例,如0.1 价格为物品价格的 1-0.1 = 0.9 倍
 * 
 * zerosell  如果为 1 价格大于等于0才可以卖
 *           如果为 2 价格大于0才可以卖 
 *           如果为 3 价格小于等于0才可以卖..什么鬼
 *           如果为 4 价格小于0才可以卖..什么鬼
 *           如果为 5 价格等于0才可以卖..什么鬼 
 *           如果为 6 价格都可以卖..什么鬼 
 *           数组 [] 第一个值为上面的设置,第二个值为代替0 ,如果有第三第四个则为多重判断...
 * 
 * 
 * cclick 清除键调用的公共事件  为0则为默认设置
 * lclick 左键点击调用的公共事件 为0则为默认设置
 * rclick 右键点击用的公共事件  为0则为默认设置 
 * tid  赋值的变量id 如果为0则不设置 ,左键右键都会赋值,赋值的为物品的种类, 0 ,物品, 1 武器,2 防具 
 * vid  赋值的变量id 如果为0则不设置 ,左键右键都会赋值,赋值的为物品的id
 * 
 * 
 * w : 200  显示内容宽
 * h : 300  显示内容高
 * numw:20    数值的宽度  为0时不显示 
 *  
 * bjb 背景图片名
 * bjx 背景x坐标
 * bjy 背景y坐标
 * 
 * cblb 侧边栏图片名
 * cblx 侧边栏x坐标  相对窗口的页面右侧
 * cbly 侧边栏y坐标   点击侧边栏时可以移动滑块到该位置
 * 
 * cbhkb 侧边滑块名 
 * cbhkx 侧边滑块x坐标  相对窗口的页面右侧
 * cbhkw 侧边滑块的宽
 * cbhkh 侧边滑块的最小高
 * cbhkl 侧边滑块黑框的宽度
 * 
 * cbb 清除按钮图片名 
 * cbx 清除按钮x坐标  
 * cby 清除按钮y坐标  按下时隐藏窗口
 * 
 * 
 * helpx 帮助窗口 x
 * helpy 帮助窗口 y
 * helpw 帮助窗口 宽
 * helph 帮助窗口 高
 * helpbw 帮助窗口背景的w偏离值(背景比帮助窗口宽大的值)
 * helpbh 帮助窗口背景的b偏离值(背景比帮助窗口高大的值)
 * helpbl  帮助窗口背景的框的宽度
 * 
 *  
 * 
 * 
================
//测试用 添加物品
i=100
while(i--){
$gameParty.gainItem($dataItems[i],i*i*10) 
}
================
 * 
//设置 
 ww.xinxi.set(4 ,{
    type: "shopsell",category: "item" ,w:200,h:300,   numw: 40,
    bjb: "bag-0", bjx: -28, bjy: -90,
    cbhkw:30,cbhkh:30,cbhkl:4,
    cblb: "bag-1",
    cbb: "bag-2",
    helpx: -300, helpy: 0, helpw: 250, helph: 300,helpbw:20,helpbh:20 ,helpbl:5
})

//用图片显示4号窗口
 $gameScreen.showPicture(1,"x/4", 0,125, 130,100, 100, 255, 0);

 
*/


var ww = ww || {}
ww.xinxishopsell = {}
ww.xinxishopsell.shopid = 4
ww.plugin.get("ww_xinxishopsell", ww.xinxishopsell);



ww.xinxishopsell.setGoods = function (goods) {
    ww.xinxi.set(ww.xinxishopsell.shopid, { goods: goods })
}


ww.xinxiwupin.refresh = function () {
    var sid = ww.xinxiwupin.wupinid
    if (sid) {
        if (Array.isArray(sid)) {
            for (var i = 0; i < sid.length; i++) {
                var id = sid[i]
                ww.xinxi.refresh(id)
            }
        } else {
            ww.xinxi.refresh(sid)
        }
    }
    var sid = ww.xinxishopsell.shopid
    if (sid) {
        if (Array.isArray(sid)) {
            for (var i = 0; i < sid.length; i++) {
                var id = sid[i]
                ww.xinxi.refresh(id)
            }
        } else {
            ww.xinxi.refresh(sid)
        }
    }

}



function Sprite_ShopSell() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Sprite_ShopSell.prototype = Object.create(Sprite_WuPin.prototype);
//设置创造者
Sprite_ShopSell.prototype.constructor = Sprite_ShopSell;
//初始化
/*
Sprite_ShopSell.prototype.initialize = function (w, h, get) {
    Sprite_WuPin.prototype.initialize.call(this, w, h, get);
}; 
*/
Sprite_ShopSell.prototype.isEnabled = function (item) {

    var zerosell = this.get("zerosell")
    if (zerosell) {
        if (Array.isArray(zerosell)) {
            var t = zerosell[0]
            var z = zerosell[1]
        } else {
            var zerosell = [zerosell, 0]
        }
        var p = this.price(item)
        var can = true

        for (var i = 0; i < zerosell.length; i += 2) {
            var t = zerosell[i] || 0
            var z = zerosell[i + 1] || 0
            if (t == 1) {
                can = can && p >= z
            } else if (t == 2) {
                can = can && p > z
            } else if (t == 3) {
                can = can && p <= z
            } else if (t == 4) {
                can = can && p < z
            } else if (t == 5) {
                can = can && p == z
            } else if (t == 6) {
                can = can && true
            }else{
                can = can && p > z 
            }
        }
        return can
    }
    return this.price(item) > 0;
};

Sprite_ShopSell.prototype.price = function (item) {
    if (item) {
        var shopGoods = this.get("goods") || {}
        var dzz = this.get("dzz") || 0
        var zz = 1 - dzz
        if (zz < 0) { zz = 0 }
        var price = 0
        if (DataManager.isItem(item)) {
            price = shopGoods.item
        } else if (DataManager.isWeapon(item)) {
            price = shopGoods.weapon
        } else if (DataManager.isArmor(item)) {
            price = shopGoods.armor
        }
        if (price && item.id in price) {
            price = price[item.id] || 0
        } else {
            price = item.price || 0
        }
        return price * zz
    }
    return 0;
};



Sprite_ShopSell.prototype.drawHelp = function (item) {
    if (item) {

        var name = item.name
        var icon = item.iconIndex || 0

        var price = this.price(item) + TextManager.currencyUnit
        var desc = item.description

        var t = ""
        //图标
        t += "\\i[" + icon + "]"
        //名称
        t += name
        t += " (" // "\n"
        //价格
        t += price
        t += ") " // "\n"

        //换行
        t += "\n"
        //说明
        t += desc

        var text = "h+" + t
        if (this._hash[text]) { return this._hash[text] }
        var w = this._helpw
        var h = this._helph
        var s = new Sprite_Art(w, h, t, 0, 2)
        this._hash[text] = s.bitmap
        return this._hash[text]
    } else {
        return 0
    }
};






/**右键按下 */
Sprite_ShopSell.prototype.onRClick = function () {
    var s = this.onClickSprites()
    if (s) {
        var item = s._item
        this.setHelp(item, 1)
        this.setItem(item)

        var rclick = this.get("rclick") || 0
        if (rclick) {
            this.startEvent(rclick)
        } else {
            if (item) {
                this.doSell(item)
            } else {
                return
            }
        }
        //this.refresh()
    }
}

Sprite_ShopSell.prototype.doSell = function (item) {
    if (this.isEnabled(item) && $gameParty.numItems(item)) {
        SoundManager.playShop();
        $gameParty.gainGold(this.price(item));
        $gameParty.loseItem(item, 1);

        ww.xinxishopbuy.DTextPicture()

    } else {
        SoundManager.playBuzzer();
    }
}
