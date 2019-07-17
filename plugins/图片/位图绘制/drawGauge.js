var ww = ww || {}



ww.drawGauge = {}
ww.drawGauge.getGauge = [
    {
        type: "stroke",  //"stroke" 绘制边框 , "fill" 填充
        color: "#fff",   //颜色 ,也可以使用 [0,"#fff",0.5,"#f0f",1,"#000"]
        //color:[0,"#fff",0.5,"#f0f",1,"#000"],
        line: {
            lineCap: "round",	//设置或返回线条的结束端点样式
            lineJoin: "round",	//设置或返回两条线相交时，所创建的拐角类型
            lineWidth: 1,	//设置或返回当前的线条宽度(绘制边框的宽度)
            //miterLimit:0  ,//设置或返回最大斜接长度
        },
        height: 12,  //血条绘制高度  不设置或为0为行高
        rate: false,   //是否根据当前比例改变宽  false 不是
        radius: 4,  //边角处圆弧的大小
        xp: 0,  //绘制时x的偏移值
        yp: 0,  //绘制时y的偏移值
        wp: 0,  //绘制时宽的偏移值  
        hp: 0,  //绘制时高的偏移值 
        j0: 0, j1: 0, j2: 0, j3: 0,  //四个角是否用圆弧 1 不用, 0 使用
        vertical: false,   
    } 
]



Bitmap.prototype.drawGaugeDo = function (x, y, width,height , set) {
 
    var type = set.type
    var line = set.line
    var radius = set.radius || 0 
    var xp = set.xp || 0
    var yp = set.yp || 0
    var wp = set.wp || 0
    var hp = set.hp || 0
    var gaugeX = x + xp
    var gaugeY = y  + yp
    var gaugeW = width + wp   
    var gaugeH = height + hp

    var color = set.color
 
    if (Array.isArray( color)) {
        var color = color.slice(0)
        if (set.vertical) {
            color.unshift("createLinearGradient", gaugeX, gaugeY, gaugeX, gaugeY + gaugeH);
        } else {
            color.unshift("createLinearGradient", gaugeX, gaugeY, gaugeX + gaugeW, gaugeY);
        }
    }
    this.drawRoundedRectangle(gaugeX, gaugeY, gaugeW, gaugeH, radius, color, line, type)

}

Bitmap.prototype.drawGauge = function (x, y, width, height ) { 
    for (var i = 0; i < ww.draw.getGauge.length; i++) {
        var set = ww.draw.getGauge[i]
        this.drawGaugeDo(x, y, width, height, set)
    }
};