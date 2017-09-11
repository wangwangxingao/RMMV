//检查

//类型


//需要者
/*
"1111111"
"0001000"
"0000001" 
"1000000"
*/
//提供者
/*
"0001001"
"1000000"
"0000100"
 */

hash = {}
get = function(v) {
        if (v in hash) {
            return hash[v]
        }
        var i = 0
        var z = 1
        var zi = 7
        while (zi--) {
            (v & z) ? i++ : i
            z <<= 1
        }
        hash[v] = i
        return i
    }
    //检查
jc = function(tgs0, xys0) {
    //检查前处理 
    var xys0 = xys0 || {}
    var xys = []
    var xys2 = []
        //提供者
    var tgs0 = tgs0 || {}
    var tgs = []
        //如果是数组
    for (var i in xys0) {
        var xy0 = i
        var xyz = parseInt(xy0, 2) || 0
        get(xyz)
        xys2.push(xyz)
        for (var i2 = 0; i2 < xys0[i]; i2++) {
            xys.push(xyz)
        }
    }
    //排序
    xys.sort(function(a, b) {
        var z = get(a) - get(b)
        if (z == 0) {
            return a - b
        }
        return z
    })
    var get2 = function(z) {
        var re = 0
        var i = xys2.length
        while (i--) {
            var v = xys2[i]
            v & z ? re++ : re
        }
        return re
    }
    var length = 0
    for (var tg0 in tgs0) {
        var tg = parseInt(tg0, 2) || 0

        var z = get2(tg)
        if (z) {
            tgs.push([tg, tgs0[tg0], get(tg), z])
            length += tgs0[tg0]
        }
    }
    tgs.sort(function(a, b) {
        return a[3] - b[3] || a[2] - b[2] || a[1] - b[1] || a[0] - b[0]
    })
    if (xys.length > length) { return false }
    return jc0(tgs, xys, 0, [], {}, [])
}

//检查基础处理
jc0 = function(tgs, xys, id, yj, clop, p) {
    console.log(id, yj, p.push(1))
    if (xys.length <= id) {
        return true
    }
    if (yj in clop) {
        return clop[yj]
    }
    var xy = xys[id]
        /**提供 */
    for (var id2 = 0; id2 < tgs.length; id2++) {
        var tg = tgs[id2]
            /**如果可以提供 */
        if (tg[1] > 0 && !!(xy & tg[0])) {
            var yj0 = yj.concat(tg[0]).sort()
            tg[1] -= 1
            if (jc0(tgs, xys, id + 1, yj0, clop, p)) {
                return true
            } else {
                tg[1] += 1
                clop[yj0] = false
            }
        }
    }
    return false
}

xys = {
    "1111111": 20,
    "0010000": 50,
    "0001000": 50,
    "0000100": 20,
    "1000000": 10,
}

tgs = {
    "0011011": 20,
    "0011000": 60,
    "0010000": 40,
    "0000001": 10,
    "0000100": 10,
    "1000100": 20,
}
jc(tgs, xys)



var input = this._kapai;
for (var i = input.length - 1; i >= 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var itemAtIndex = input[randomIndex];
    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
}