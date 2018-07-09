
Bitmap.prototype.getColors = function () {
    var o = {}
    if (this.width > 0 && this.height > 0) {
        //环境 = 环境 
        var context = this._context;
        var imageData = context.getImageData(0, 0, this.width, this.height);
        var pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4) {
            var r = Math.floor(pixels[i + 0] / 10)
            var g = Math.floor(pixels[i + 1] / 10)
            var b = Math.floor(pixels[i + 2] / 10)
            var a = Math.floor(pixels[i + 3] / 10)
            var z = [r, g, b, a]
            o[z] = o[z] || 0
            o[z]++
        }
    }
    return o
};




Bitmap.prototype.getColorsNumber = function (colors) {
    var i = 0
    for (var color in colors) {
        colors[color] = i
        i++
    }

    return i
}


Bitmap.prototype.makeUni = function () {
    var o = this.getColors()
    var n = this.getColorsNumber(o)

    var list = []
    if (this.width > 0 && this.height > 0) {
        if (length == 0) {
            var context = this._context;
            var imageData = context.getImageData(0, 0, this.width, this.height);
            var pixels = imageData.data;
            for (var i = 0; i < pixels.length; i += 4) {
                var r = Math.floor(pixels[i + 0] / 10)
                var g = Math.floor(pixels[i + 1] / 10)
                var b = Math.floor(pixels[i + 2] / 10)
                var a = Math.floor(pixels[i + 3] / 10)
                var z = [r, g, b, a]
                var v = o[z]
                list.push(v)
            }
        }
    }
    return list
}

s3 = ImageManager.loadFace("A-01")


s3.makeUni()




/**变长字节 */
makeChangeLength = function (number) {

    var list = []
    var have = 0
    do { 
        var z = number & 127
        var number = number >> 7
        if (have) {
            z = z | 128
        }
        have = 1
        list.unshift(z)
    } while (number)
    return list
}

/**变长字节解析 */
getList = function (list, st) {
    console.log(list)
    var st = st || 0
    var i = 0
    var all = 0
    do {
        var number = list[st + i]
        var have = number >> 7
        var number = number & 127 
        var all = all << 7 | number
        i++
        console.log( have.toString(2),number.toString(2) ,all.toString(2),number , all)
    } while (have)
    return [all,i]  
}

getList(makeChangeLength(5236))


(
    function(){
        l = [3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101]
        for(var i = 0 ; i <l.length ;i++){
            var n = l[i] * l[i]
            console.log(n)
            var n2 = n - 18
            for(var i2= 0 ; i2 <=i ; i2++){
            var n3 =  n2 / l[i2]
            console.log(n2,l[i2],n3)
            if(l.indexOf(n3)>=0){
                return n 
            }
            } 
        }
    }
)()




[
    0,0,1,1,0,0,0,
    0,1,0,2,1,0,0,
    1,0,1,3,2,1,1
]




if (!this.isMoving() && this.canMove()) { var direction =   Input.dir4 ; if (direction > 0) { this.moveStraight(direction);} }
    //方向 = 获得输入方向()
   ;
    //如果(方向 > 0 )
    if (direction > 0) { 
        $gameTemp.clearDestination(); 
    } else if ($gameTemp.isDestinationValid()) { 
        var x = $gameTemp.destinationX(); 
        var y = $gameTemp.destinationY(); 
        direction = this.findDirectionTo(x, y);
    } 
    
}
 


if (!this.isMoving() && $gamePlayer.isMoving()) {  this.moveStraight($gamePlayer.direction() )}