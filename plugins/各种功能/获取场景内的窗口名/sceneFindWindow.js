function sceneFindWindow(o) {
    var s = {}
    for (var i in o) {
        if (o[i] && o[i]._isWindow  && //i.match(/_(.*)[W|w]indow/) &&
         i != "_windowLayer"&& i != "_helpWindow") {
            s[i]={}
            s[i].moveSize = [o[i].x,o[i].y,o[i].width,o[i].height] 
        } 
    } 
    return JSON.stringify(s) 
}