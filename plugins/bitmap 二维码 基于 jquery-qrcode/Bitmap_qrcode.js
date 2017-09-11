//=============================================================================
// Bitmap_qrcode.js
//=============================================================================
/*:
 * @plugindesc 二维码
 * @author wangwang
 *  
 * @help
 * 参考 https://github.com/jeromeetienne/jquery-qrcode 
 * 
 * 简单设置
 * var b = Bitmap.qrcode("www.baidu.com")
 * 
 * 高级设置
 * var b = Bitmap.qrcode({ "text":"www.baidu.com" , "width": 100,"height":100 })
 *
 *
 */

 
(function(){ 
	Bitmap.qrcode = function(options) {
		// if options is string, 
		if( typeof options === 'string' ){
			options	= { text: options };
		}		
		var text = options.text || "" 
		var width	=	options.height || 256
		var height	=	options.height  ||  256 
		var background    =  options.background  || "#ffffff"
		var foreground   =  options.background || "#000000" 
		var type = ( "type" in  options )?  options.type : -1 
		var corr=  ( "corr" in  options )?options.corr: QRErrorCorrectLevel.H
		// create the qrcode itself
		var qrcode	= new QRCode(type, corr);
		qrcode.addData(text);
		qrcode.make();
		// create canvas element
		var bitmap	=  new Bitmap(width,height) 
		 
		// compute tileW/tileH based on options.width/options.height
		var tileW	= width  / qrcode.getModuleCount();
		var tileH	= height / qrcode.getModuleCount();
		// draw in the canvas
		for( var row = 0; row < qrcode.getModuleCount(); row++ ){
			for( var col = 0; col < qrcode.getModuleCount(); col++ ){
				color = qrcode.isDark(row, col) ? foreground : background;
				var w = (Math.ceil((col+1)*tileW) - Math.floor(col*tileW));
				var h = (Math.ceil((row+1)*tileW) - Math.floor(row*tileW));
				bitmap.fillRect(Math.round(col*tileW),Math.round(row*tileH), w, h,color);  
			}	
		}
		// return just built canvas
		return bitmap; 
	}; 
})();
