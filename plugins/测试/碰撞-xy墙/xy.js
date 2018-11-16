 
/**
 * 区间
 * @param {number} x 
 * @param {number} y 
 * @param {number} i  0 () 1[) 2(] 3[]
 */
function region(x, y, i) {
    this.set(x, y, i)
}


region.prototype.set = function (x, y, i) {

    this._x = x 
    this._y = y
    this._length = y - x
    if (this._length == 0) {
        this._isPoint = true
        this._isEmpty = false   
    }else if (this._length < 0) {
        this._isEmpty = true
        this._isEmpty = false   
    }else{
        this._isEmpty = false
        this._isEmpty = false 
    }
    this._type = i
}

region.prototype.isPoint = function () {
    return this._isPoint
}

region.prototype.isEmpty = function () {
    return this._isEmpty
}
region.prototype.length = function () {
    return this._length
}

region.prototype.isNoEmpty = function () {
    return !this._isEmpty
}


region.prototype.eval = function(r0,t,r1){
 
    var w = new wall()
    if(t == "u"){
        r0._x,r0._y 
        r1._x,r1._y
        if(r0.x >=r1._y){
            w.push( new region(r1.x,r1.y),new region(r0.x,r0.y))
        } else if(r1._x>=r0.y){
            w.push( new region(r1.x,r1.y),new region(r0.x,r0.y))
        } else{
            w.push(new region( Math.min(r0.x,r1.x) ,Math.max(r0.y,r1.y)                  ))
        }
    }
    



}





















find = function find(i, l, r, list) {
    while (l != r && l + 1 != r) {
        var m = (l + r) >> 1
        if (list[m] == i) {
            return m
        } else if (list[m] < i) {
            l = m
        } else {
            r = m
        }
    }
    return l
}


