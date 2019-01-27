
var ww = ww || {}
ww.cardPicture = {}


/**使用的卡组 */
ww.cardPicture._usePictures = []

/**未使用图片 */
ww.cardPicture._noUsePictures = []


ww.cardPicture._pictureIndex = 100


/**获取一个可以使用的图片 */
ww.cardPicture.canUseIndex = function () {
    if (!this._noUsePictures.length) {
        return this._pictureIndex++
    } else {
        return this._noUsePictures.pop()
    }
}
/**添加 已经使用的图片 */
ww.cardPicture.addUseIndex = function (index) {
    this._usePictures.push(index)
}

/**添加 可以使用的图片 */
ww.cardPicture.addNoUseIndex = function (index) {
    this._noUsePictures.push(index)
}


/**图片位置 */
ww.cardPicture.pos = function (index, length, type) {

    if (!type) {

        var x = index * 100 + 100
        var y = 300
        return [x, y]
    }
    return 0
}

/**获取索引 */
ww.cardPicture.index = function (i) {
    return this._usePictures.indexOf(i)
}



/**显示图片 */
ww.cardPicture.showPicture = function (pictureId, cardId, index, length) {
    var pictureId = pictureId
    var name = "" + cardId
    var x = 500
    var y = 600
    var scaleX = 100
    var scaleX = 100
    var opacity = 0
    var blendMode = 0
    //$gameScreen.showPicture(pictureId, name, origin, x, y,
    //  scaleX, scaleY, opacity, blendMode) 
    $gameScreen.showPicture(pictureId, name, origin, x, y,
        scaleX, scaleY, opacity, blendMode)
}

ww.cardPicture.movePicture = function (pictureId, cardId, index, length) {
    var pos = this.pos(i, l)
    if (pos) {

        var pictureId = pictureId
        var origin = 0

        var x = pos[0]
        var y = pos[1]


        var scaleX = 100
        var scaleX = 100
        var opacity = 255
        var blendMode = 0
        var duration = 60

        //$gameScreen.movePicture(pictureId, origin, x, y, scaleX,
        //  scaleY, opacity, blendMode, duration) 
        $gameScreen.movePicture(pictureId, origin, x, y, scaleX,
            scaleY, opacity, blendMode, duration)


    } else {

    }

}


/**隐藏图片 */
ww.cardPicture.hidePicture = function (pictureId) {
    $gameScreen.erasePicture(pictureId)
}


/**添加卡 */
ww.cardPicture.addCard = function (cardId) {

    if (cardId) {

        var pictureId = ww.cardPicture.index(cardId)

        //添加到卡组
        ww.cardPicture.addUseIndex(pictureId)


        ww.cardPicture.showPicture(pictureId)

        this.refresh()

    }

}


/**移除图片 */
ww.cardPicture.removeCard = function (pictureId) {

    if (cardId) {

        var index  = ww.cardPicture.canUseIndex(pictureId)

        //添加到卡组
        ww.card.indexPop(ww.cardPicture._usePictures, index)//.addUseIndex(pictureId)
 
        ww.cardPicture._noUsePictures.push(pictureId)
        
        this.refresh()

    }

}


ww.cardPicture.refresh = function () {

    var l = this._usePictures.length
    for (var i = 0; i < l; i++) {
        var pictureId = this._usePictures[i]

        if (pos) {
            this.movePicture(pictureId, cardId, i, l)
        } else {
            this.hidePicture(pictureId)
        }
    }


    var l = this._noUsePictures.length
    for (var i = 0; i < l; i++) {
        var pictureId = this._noUsePictures[i] 
        this.hidePicture(pictureId) 
    }
}