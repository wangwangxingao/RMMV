//=============================================================================
// SaveVer.js
//=============================================================================

/*:
 * @plugindesc 存档版本修改
 * @author wangwang 
 * 
 * @param SaveVer
 * @desc 修改存档版本
 * @default  汪汪
 *    
 * @help 
 * 
 * 额,不知道会有什么问题,需要测试...
 *  
 */
(function () {
    SaveVer = {}

    SaveVer.temp = {}
    
    SaveVer.change = [
        [0],
        [1,
            function (c,s) {


            } 
        ] 
    ]
 

    /**
     * 保存内容
     * @param {{}} contents 
     */ 
    SaveVer.save = function (contents) {
        var s = 0
        var c = this.change
        if (Array.isArray(c)) {
            for (var i = 0; i < c.length; i++) {
                var a = c[i]
                if (Array.isArray(a)) {
                    s = a[0]
                }
            }
        }
        contents.saveid = s
        return contents
    }

    /**
     * 读取内容 
     * @param {{}} contents 
     * 
     * 
     */ 
    SaveVer.load = function (contents) { 
        this.temp = {}
        var m = 0
        var c = this.change
        if (Array.isArray(c)) { 
            for (var i = 0; i < c.length; i++) { 
                var a = c[i]
                if (Array.isArray(a)) {
                    if (m) {
                        for (var fi = 1; fi < a.length; fi++) {
                            var f = a[fi]
                            if (typeof f == "function") {
                                f(contents,this)
                            }
                        }
                    } else { 
                        m = a[0] == contents.saveid
                    }
                } 
            }
        }
        return contents
    }
 



    SaveVer.makeSaveContents = DataManager.makeSaveContents
    //制作保存内容
    DataManager.makeSaveContents = function () {
        var contents = SaveVer.makeSaveContents.call(this)
        var contents = SaveVer.save(contents)
        //返回 内容
        return contents;
    };


    SaveVer.extractSaveContents = DataManager.extractSaveContents
    //提取保存内容v
    DataManager.extractSaveContents = function (contents) {
        var contents = SaveVer.load(contents)
        SaveVer.extractSaveContents.call(this,contents)
    };
})()