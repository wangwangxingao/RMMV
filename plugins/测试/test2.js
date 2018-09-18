




js1 = function () {
    var re = {}
    re.list = []
    re.all = 0
    for (var i = 0; i < 6; i++) {
        var z = Math.randomInt2(90, 6)
        re.list[i] = z
        re.all += z
    }
    re.z = Math.randomInt2(75,20)


    re.allpj = Math.to2(re.all / 6)


    re.v = Math.to2(re.z * 0.2 + re.allpj * 0.8)
   // console.log(re)
    return re
}


js2 = function () {

    var  list = []

     console.log(list.length)
     t = 0 
    while (list.length < 11  &&t < 1000 ) {
        t ++
        var r1 = js1()
        var r2 = js1()

        var pj = Math.to2((r1.v + r2.v) / 2)
        var add = true
        for (var i = 0; i < list.length; i++) {
            var v = list[i][0]
            if (pj<92) {
                add = false
                break
            }
        }
        if (add) {
            console.log(list)
            list.push([pj, r1, r2])
        }
    } 
    return list
 
}

js2()