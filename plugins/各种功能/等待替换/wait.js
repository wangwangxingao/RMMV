
var ww = ww || {}


ww.waitdraw = {}

ww.waitdraw.draw = function (canvas, tick) {
    var ctx = canvas.getContext("2d"),
        w = canvas.width,
        h = canvas.height,
        x = w / 2,
        y = h / 2,
        radius = 30;

     
    
    var r = [1, 2, 3, 4, 4.5, 5, 6, 7];
    var angle = [10, 25, 45, 65, 90, 105, 120, 135];
    var alpha = [0.01, 0.02, 0.25, 0.35, 0.45, 0.65, 0.8, 1];
    var x1 = [], y1 = [];

    /* ctx.fillStyle = "#000";
     ctx.fillRect(0, 0, w, h);*/
    x1 = [];
    y1 = [];
    for (var i = 0; i < r.length; i++) {
        var z = (angle[i] + tick) % 360;
        ctx.beginPath();
        ctx.font = "1rem sans-serif";
        ctx.fillStyle = "rgba(156,236,255," + alpha[i] + ")";
        x1.push(x + radius * Math.cos(z * Math.PI / 180));
        y1.push(y + radius * Math.sin(z * Math.PI / 180));
        ctx.arc(x1[i], y1[i], r[i], 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }
}



Graphics.setLoadingImage = function (src) {
};
Graphics._paintUpperCanvas = function () {
    this._clearUpperCanvas();
    if (this._loadingCount >= 0) {
        ww.waitdraw.draw(this._upperCanvas, this._loadingCount)
    }
};

Graphics.setLoadingImage = function (src) {
    this._loadingImage = ImageManager.loadSystem("Loading")
};
Graphics._paintUpperCanvas = function () {
    this._clearUpperCanvas();

    if (this._loadingImage && this._loadingCount >= 20) {
        var context = this._upperCanvas.getContext('2d');
        var dx = (this._width - this._loadingImage.width) / 2;
        var dy = (this._height - this._loadingImage.height) / 2;
        var alpha = ((this._loadingCount - 20) / 30).clamp(0, 1);
        context.save();
        context.globalAlpha = alpha;
        context.drawImage(this._loadingImage.canvas, dx, dy);
        context.restore();
    }
};


