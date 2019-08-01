//=============================================================================
// Sprite_ShopBuy.js
//=============================================================================

/*:
 * @plugindesc 显示商店购买的窗口
 * @author 汪汪
 * @version 2.0
 * 
 * 
 * @param ww_xinxishopbuy
 * @desc 显示商店购买窗口
 * @default 0.1
 * 
 * 
 * @param shopid 
 * @desc  默认的商店窗口的id,当使用事件中的商店后会赋值给这个
 * @default 3
 * 
 * 
 * @param goldid 
 * @desc  默认的金钱变量的id,当买东西后赋值,与shopsell通用
 * @default 40
 * 
 * @param goldpid 
 * @desc  默认的金钱变量显示图片的id,与shopsell通用
 * @default 206
 * 
 * @help
 * 
 * 
 * 窗口设置
 * type : "shopbuy" 使用商店买的窗口
 * 
 * w : 200  显示内容宽
 * h : 300  显示内容高
 * numw:20    数值的宽度  为0时不显示 
 *  
 * 
 * goods  卖出的物品,数组 
 *           数组由一个个good数组构成 
 *           good 第1个值为种类 0 物品,  1 武器, 2 防具
 *           good 第2个值为id 
 *           good 第3个值为是否使用自定义价格,如果未设置或为0则默认价格
 *           good 第4个值为自定义价格
 *           如 goods:[[0,1,0,0],[0,2,1,133]]
 * 
 *   
 * dzz 设置折扣比例,如0.1 买入时的值为价格的 1-0.1 = 0.9 倍
 * 
 * 
 * cclick 清除键调用的公共事件  为0则为默认设置
 * lclick 左键点击调用的公共事件 为0则为默认设置
 * rclick 右键点击用的公共事件  为0则为默认设置 
 * tid  赋值的变量id 如果为0则不设置 ,左键右键都会赋值,赋值的为物品的种类, 0 ,物品, 1 武器,2 防具 
 * vid  赋值的变量id 如果为0则不设置 ,左键右键都会赋值,赋值的为物品的id
 * 
 * 
 * 
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
//获得物品
i=100
while(i--){
$gameParty.gainItem($dataItems[i],i*i*10) 
}

//设置
ww.xinxi.set(3, {
    type: "shopbuy", w:200,h:300,  numw: 40,
    bjb: "bag-0", bjx: -28, bjy: -90,
    cbhkw:30,cbhkh:30,cbhkl:4,
    cblb: "bag-1",
    cbb: "bag-2",
    helpx: -300, helpy: 0, helpw: 250, helph: 300,helpbw:20,helpbh:20 ,helpbl:5
})
//用图片显示3号窗口
 $gameScreen.showPicture(1,"x/3", 0,125, 130,100, 100, 255, 0);
 


*/


var ww = ww || {}
ww.xinxishopbuy = {}
ww.xinxishopbuy.shopid = 3
ww.xinxishopbuy.goldid = 40
ww.xinxishopbuy.goldpid = 206
ww.plugin.get("ww_xinxishopbuy", ww.xinxishopbuy);



ww.xinxishopbuy.setGoods = function (goods) {
    if (this.shopid) {
        ww.xinxi.set(this.shopid, { goods: goods })
    }
}

ww.xinxishopbuy.Game_Interpreter_prototype_command302 = Game_Interpreter.prototype.command302


Game_Interpreter.prototype.command302 = function () {
    if (ww.xinxishopbuy.shopid) {
        if (!$gameParty.inBattle()) {
            //货物组 = [参数组]
            var goods = [this._params];
            //当 (下一个事件编码() === 605 )
            while (this.nextEventCode() === 605) {
                //索引++
                this._index++;
                //货物组 添加(当前命令() 参数组 )
                goods.push(this.currentCommand().parameters);
            }
            ww.xinxishopbuy.setGoods(goods)
        }
        return true;
    } else {
        return ww_xinxishopbuy.Game_Interpreter_prototype_command302.call(this)

    }

}

function Sprite_ShopBuy() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Sprite_ShopBuy.prototype = Object.create(Sprite_WuPin.prototype);
//设置创造者
Sprite_ShopBuy.prototype.constructor = Sprite_ShopBuy;
//初始化
Sprite_ShopBuy.prototype.initialize = function (w, h, get) {
    Sprite_XinXi.prototype.initialize.call(this, w, h, get);
    this.refresh();
};



Sprite_ShopBuy.prototype.price = function (item) {
    var dzz = this.get("dzz") || 0
    var zz = 1 - dzz
    if (zz < 0) { zz = 0 }
    var price = this._price[this._data.indexOf(item)] || 0
    return price * zz;
};

Sprite_ShopBuy.prototype.isEnabled = function (item) {
    return (item && this.price(item) <= $gameParty.gold() &&
        !$gameParty.hasMaxItems(item));
};


/**制作物品列表 */
Sprite_ShopBuy.prototype.makeItemList = function () {
    var shopGoods = this.get("goods") || []
    this._data = [];
    this._price = [];
    shopGoods.forEach(function (goods) {
        var item = null;
        switch (goods[0]) {
            case 0:
                item = $dataItems[goods[1]];
                break;
            case 1:
                item = $dataWeapons[goods[1]];
                break;
            case 2:
                item = $dataArmors[goods[1]];
                break;
        }
        if (item) {
            this._data.push(item);
            this._price.push(!goods[2] ? item.price : goods[3]);
        }
    }, this);
};



Sprite_ShopBuy.prototype.drawHelp = function (item) {
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





/**绘制项目 */
Sprite_ShopBuy.prototype.drawText = function (item, s) {
    if (item) {
        var icon = item.iconIndex
        var name = item.name
        var value = this.price(item) + TextManager.currencyUnit

        //var bi = this.drawIcon(icon)
        var name = "\\i[" + icon + "]" + name
        var bn = this.drawName(name)
        var bv = this.drawValue(value)
        var h = Math.max(bn.height, bv.height)// , bi.height, )
        var w = this.pageH()
        if (s) {
            /*if (s.setIcon(icon)) {
                s._iconSprite.bitmap = bi
            }*/
            if (s.setName(name)) {
                s._nameSprite.bitmap = bn
            }
            if (s.setValue(value)) {
                s._valueSprite.bitmap = bv
            }
            s.width = w
            s.height = h
        }
        return h
    } else {
        return 0
    }
}




/**右键按下 */
Sprite_ShopBuy.prototype.onRClick = function () {
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
                this.doBuy(item)
            } else {
                return
            }
        }
        //this.refresh()
    }
}

Sprite_ShopBuy.prototype.doBuy = function (item) {
    if (this.isEnabled(item)) {
        SoundManager.playShop();
        $gameParty.loseGold(this.price(item));
        $gameParty.gainItem(item, 1);
        ww.xinxishopbuy.DTextPicture()
    } else {
        SoundManager.playBuzzer();
    }
}


ww.xinxishopbuy.DTextPicture = function () {
    if (!ww.xinxishopbuy.Interpreter) {
        ww.xinxishopbuy.Interpreter = new Game_Interpreter()
    }
    var gid = ww.xinxishopbuy.goldid
    if (!gid) { return }
    var pid = ww.xinxishopbuy.goldpid
    $gameVariables.setValue(gid, $gameParty.gold())
    if ($gameScreen.picture(pid)) {
        ww.xinxishopbuy.Interpreter.pluginCommand("D_TEXT", ["\\c[32]\\v[" + gid + "]", "18"])
        $gameScreen.showPicture(pid, false, 1, 170, 280, 100, 100, 255, 0);
    }
};
