
var ww = ww || {}
ww.card = {}

/**打乱一个数组 */
ww.card.shuffle = function (l) {
    if (Array.isArray(l)) {
        var n = l.length,
            t, i;
        // 如果还剩有元素…
        while (n) {
            // 随机选取一个元素…
            i = Math.floor(Math.random() * n--);
            // 与当前元素进行交换
            t = l[n];
            l[n] = l[i];
            l[i] = t;
        }
    } else {
        var l = []
    }
    return l;
}

/**对一个数组排序 */
ww.card.sort = function (l, fun) {
    if (Array.isArray(l)) {
        l.sort(fun)
    } else {
        var l = []
    }
    return l;
}


/**获取数组第一个值并删除它 */
ww.card.shift = function (l) {
    if (!Array.isArray(l)) { return 0 }
    return l.shift();
}

/**获取数组最后一个值并删除它 */
ww.card.pop = function (l) {
    if (!Array.isArray(l)) { return 0 }
    return l.pop();
}


/**获取数组中随机的一个值并删除它 */
ww.card.randomPop = function (l) {
    if (!Array.isArray(l)) { return 0 }
    var n = l.length
    var i = Math.floor(Math.random() * n);
    var r = l[i]
    l.splice(i, 1)
    return r;
}


/**获取数组中 一个值的索引 */
ww.card.indexOf = function (l, i) {
    if (!Array.isArray(l)) { return -1 } 
    return l.indexOf(i);
}

/**获取索引位置的值 */
ww.card.index  = function(l,i){ 
    if (!Array.isArray(l)) { return 0 } 
    return l[i];
}


/**获取数组中 一个值并删除它 */
ww.card.indexPop = function (l, i) {
    if (!Array.isArray(l)) { return 0 }
    var r = l[i]
    l.splice(i, 1)
    return r;
}

/**获取数组第一个值 (不删除它)*/
ww.card.start = function (l) {
    if (!Array.isArray(l)) { return 0 }
    return l[0];
}



/**获取数组最后一个值 (不删除它)*/
ww.card.end = function (l) {
    if (!Array.isArray(l)) { return 0 }
    return l[l.length - 1];
}


/**获取数组中随机的一个值  (不删除它) */
ww.card.random = function (l) {
    if (!Array.isArray(l)) { return 0 }
    var n = l.length
    var i = Math.floor(Math.random() * n);
    return l[i];
}


/**获取物品id的数组  如果输入一个数组,则返回输入数组中的物品 */
ww.card.getItem = function (l) {
    var items = $gameParty.items()

    var re = []
    if (Array.isArray(l)) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i]
            if (item) {
                var id = item.id
                if (l.indexOf(id) >= 0) {
                    re.push(id)
                }
            }
        }
    } else {
        for (var i = 0; i < items.length; i++) {
            var item = items[i]
            if (item) {
                var id = item.id
                re.push(id)
            }
        }
    }
    return re
}




ww.card._save = {}


/**保存数组 */
ww.card.save = function(n,l){
    ww.card._save[n] = l||[]
}

/**读取数组 */
ww.card.load = function(n){
    
    if(!ww.card._save[n]){
        ww.card._save[n] = []
    } 
    return  ww.card._save[n] 
    
}