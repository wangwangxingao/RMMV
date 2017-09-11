
/*
b = ImageManager.loadTitle1($dataSystem.title1Name)
c = ImageManager.loadSystem("1 (1)")
a = new Bitmap()
a.setTransitions(b,c)
s = new Sprite_Base()
SceneManager._scene.addChild(s)
s.bitmap = a 
s.setTransitions(200,10,256,-1)


b = ImageManager.loadTitle1($dataSystem.title1Name)
c = ImageManager.loadSystem("1 (12)")
a.setTransitions(b,c)
s.setTransitions(50,10,-1,256,1)

*/











Bitmap.prototype.setTransitions = function (bitmap0,bitmap1){
	if( bitmap0 && bitmap1){
		this._isLoading = true 
		this._transitionsBitamp = false 
		var that = this
		var bitmap0 = bitmap0 
		var bitmap1 = bitmap1 
		bitmap0.addLoadListener(  
			function (){
				if(!bitmap1._isLoading && !that._transitionsBitamp){
					that.setTransitionsBitamp(bitmap0,bitmap1)
				}
			} 
		) 		
		bitmap1.addLoadListener(  
			function (){
				if(!bitmap0._isLoading && !that._transitionsBitamp){
					that.setTransitionsBitamp(bitmap0,bitmap1)
				}
			} 
		)  
		return true
	}
	return false
}





Bitmap.prototype.setTransitionsBitamp = function (bitmap0,bitmap1){
	this._transitionsBitamp = true 
	var b0 = bitmap0  
	var b1 = new Bitmap(b0.width,b0.height)
	b1.blt(bitmap1,0,0,bitmap1.width,bitmap1.height,0,0,b0.width,b0.height)
	this._transitionsBitamp0 = b0
	this._transitionsBitamp1 = b1 
	this.resize(b0.width,b0.height);
	this.clear()
	this.blt(b0,0,0,b0.width,b0.height,0,0,b0.width,b0.height)

	this._isLoading = false;
    //设置发生更改()
    this._setDirty();
    this._callLoadListeners();
	return true
}


Bitmap.prototype.transitionsToAlpha = function(a) {
    if (this._transitionsBitamp && this.width > 0 && this.height > 0) {  
		var a = a || 0 
        var context0 = this._transitionsBitamp0._context;
        var imageData0 = context0.getImageData(0, 0, this.width, this.height);
        var pixels0 = imageData0.data;  
        var context = this._context;
        var imageData = context.getImageData(0, 0, this.width, this.height); 
        var pixels = imageData.data;
        for (var i = 0; i < pixels.length; i += 4) { 
			if( pixels[i + 3] == 0 ){
				pixels[i + 0] = pixels0[i + 0] 
				pixels[i + 1] = pixels0[i + 1] 
				pixels[i + 2] = pixels0[i + 2] 
			}
			pixels[i + 3] = pixels0[i + 3] - (255 - a)　
        }
        context.putImageData(imageData, 0, 0); 
        this._setDirty();
		return true	
    }
	return false
};


Bitmap.prototype.transitionsAlphaByBitmap = function(a,cs) {
    if (this._transitionsBitamp && this.width > 0 && this.height > 0) {  
		var a = a || 0
		a = Math.floor (a) 
		var cs = cs || 0
		if( this._transitionsAlpha != a ){
			this._transitionsAlpha = a 
			var context0 = this._transitionsBitamp0._context;
			var imageData0 = context0.getImageData(0, 0, this.width, this.height);
			var pixels0 = imageData0.data;     

			var context1 = this._transitionsBitamp1._context;
			var imageData1 = context1.getImageData(0, 0, this.width, this.height);
			var pixels1 = imageData1.data;  

			var context = this._context;
			var imageData = context.getImageData(0, 0, this.width, this.height); 
			var pixels = imageData.data;
			
			if(cs == 0 ){
				for (var i = 0; i < pixels.length; i += 4) { 
					if(  pixels1[i + 0] < a 　){ 
						if(  pixels[i + 3] != pixels0[i + 3]){
							pixels[i + 0] = pixels0[i + 0] 
							pixels[i + 1] = pixels0[i + 1] 
							pixels[i + 2] = pixels0[i + 2] 
							pixels[i + 3] = pixels0[i + 3]　
						}
					}else {
						pixels[i + 3] = 0
					}
				}
			}else {
				for (var i = 0; i < pixels.length; i += 4) { 
					if(  pixels1[i + 0] > a 　){ 
						if(  pixels[i + 3] != pixels0[i + 3]){
							pixels[i + 0] = pixels0[i + 0] 
							pixels[i + 1] = pixels0[i + 1] 
							pixels[i + 2] = pixels0[i + 2] 
							pixels[i + 3] = pixels0[i + 3]　
						}
					}else {
						pixels[i + 3] = 0
					}
				}		
			}



			context.putImageData(imageData, 0, 0); 
			this._setDirty();
		}
    }
};
 
//更新
Sprite.prototype.update0 = Sprite.prototype.update 
Sprite.prototype.update = function() {
	this.update0()
	this.updateTransitions()
};

Sprite.prototype.updateTransitions = function() {
    if (  this.bitmap  && this.bitmap._transitionsBitamp  &&  this._transitionsDuration > 0) {
		if(this._transitionsDuration % this._transitionsDuration2 == 1 ){ 
			var d = Math.floor(this._transitionsDuration / this._transitionsDuration2 ) + 1 ; 
			this._transitionsAlpha = this._transitionsAlpha || 0
			this._transitionsAlpha = (this._transitionsAlpha * (d - 1) + this._transitionsTargetAlpha) / d;
			var a = this._transitionsAlpha || 0
			var cs = this._transitionsCS || 0 
			this.bitmap.transitionsAlphaByBitmap(a , cs )
		} 
        this._transitionsDuration--;
    }
};


Sprite.prototype.setTransitions = function(d ,d2 , a , ta , cs ) {
    this._transitionsDuration = d || 0
	this._transitionsDuration2 = d2 || 1 
    this._transitionsAlpha =  a || 0 
	this._transitionsTargetAlpha = ta || 0  
	this._transitionsCS = cs || 0
};
