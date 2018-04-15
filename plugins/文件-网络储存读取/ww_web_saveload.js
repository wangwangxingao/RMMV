//=============================================================================
// ww_web_saveload.js
//=============================================================================
/*:
 * @plugindesc 网络服务器储存读取
 * @author wangwang
 *
 * @param ww_web_saveload
 * @desc 确定插件参数,请勿修改
 * @default wangwang
 * 
 * @param php
 * @desc 网络服务器php名称
 * @default websaveload.php
 *
 * @param name
 * @desc 默认账号
 * @default wangwang
 *
 * @param mima
 * @desc 默认密码
 * @default wangwang
 *
 * @help
 * 如果没有账号与密码则新建
 * ww_web_saveload.get()
 * 输入账号,密码
 * ww_web_saveload.prompt() 
 * 确定账号,密码 是否正确
 * ww_web_saveload.isMima()
 * 账户密码是否成功的记录 
 * ww_web_saveload._ismima 
 * 更换密码,如果账户密码不成功则重新输入
 * ww_web_saveload.reMima()
 * 移除项目
 * ww_web_saveload.removeItem (key)
 * 设置项目
 * ww_web_saveload.setItem (key, data)
 * 读取项目
 * ww_web_saveload.getItem (key)
 *
 *
 * 修改部分 
 *
 * Game_System.prototype.isSaveEnabled 
 * DataManager.loadGlobalInfo
 * StorageManager.saveToWebStorage  
 * StorageManager.loadFromWebStorage  
 * StorageManager.webStorageExists 
 * StorageManager.removeWebStorage  
 */

(function () {
    ww_web_saveload = {}

    //获取设置
    ww_web_saveload.getplu = function () {
        for (var i in PluginManager._parameters) {
            var plugin = PluginManager._parameters[i]
            if ("ww_web_saveload" in plugin) {
                if (plugin["ww_web_saveload"] == "wangwang") {
                    if (plugin["php"]) {
                        ww_web_saveload._php = plugin["php"]
                    }
                    ww_web_saveload._name = plugin["name"]
                    ww_web_saveload._mima = plugin["mima"]
                }
            }
        }
    }
    //php位置
    ww_web_saveload._php = "websaveload.php"
    //账号
    ww_web_saveload._name = "wangwang"
    //密码
    ww_web_saveload._mima = "wangwang"

    //进行 获取设置
    ww_web_saveload.getplu()

    //输入密码
    ww_web_saveload.prompt = function () {
        var name = prompt("输入姓名", this._name)
        var mima = prompt("输入密码", this._mima)
        if (name && mima) {
            this._ismima = null
            this._name = name.slice(0, 16)
            this._mima = mima.slice(0, 16)
            this.isMima()
            return this._ismima
        }
        return false
    }
    //是否已获取密码
    ww_web_saveload.get = function () {
        if (!(this._name && this._mima)) {
            return this.prompt()
        }
        return true
    }
    //是否正确的保存
    ww_web_saveload._ismima = null
    //判断是否正确
    ww_web_saveload.isMima = function () {
        if (!this.get()) { return }
        var name = this._name
        var mima = this._mima
        var redata = null
        var mode = "isMima"
        var key = ""
        var data = ""
        var json = JSON.stringify({ "mode": mode, "name": name, "mima": mima, "key": key, "data": data });
        var url = this._php || "websaveload.php";
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, false);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            if (xhr.status < 400) {
                redata = xhr.responseText
            }
        };
        xhr.onerror = function () {
            redata = "error"
        };
        xhr.send("json=" + json);
        console.log(redata)
        if (redata != "mima==mima") {
            this._ismima = false
            return false
        }
        this._ismima = true
        return true
    }
    //进行 判断是否正确
    ww_web_saveload.isMima()

    //设置密码
    ww_web_saveload.setMima = function (key) {
        if (!this.get()) { return }
        var redata = null
        var name = this._name
        var mima = this._mima
        var mode = "remima"
        var key = key
        var data = ""
        var json = JSON.stringify({ "mode": mode, "name": name, "mima": mima, "key": key, "data": data });
        var url = this._php || "websaveload.php";
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, false);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            if (xhr.status < 400) {
                redata = xhr.responseText
            }
        };
        xhr.onerror = function () {
            redata = "error"
        };
        xhr.send("json=" + json);
        console.log(redata)
        if (redata != "mima==remima") {
            return redate
        }
        this._mima = key
        return redata
    }
    //重置密码
    ww_web_saveload.reMima = function (key) {
        if (this._ismima) {
            var mima = prompt("输入密码", this._mima)
            if (!mima) { return }
            this.setMima(mima.slice(0, 16))
        } else {
            this.prompt()
        }
    }


    //移除项目
    ww_web_saveload.removeItem = function (key) {
        this.setItem(key, "load==null")
    }
    //设置项目
    ww_web_saveload.setItem = function (key, data) {
        if (!this.get()) { return }
        var name = this._name
        var mima = this._mima
        var mode = "save"
        var key = key
        var data = data
        var json = JSON.stringify({ "mode": mode, "name": name, "mima": mima, "key": key, "data": data });
        var url = this._php || "websaveload.php";
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            if (xhr.status < 400) {
                console.log(key + ' ' + xhr.responseText)
            }
        };
        xhr.onerror = function () {
            console.log(key + " error")
        };
        xhr.send("json=" + json);
    }
    //读取项目
    ww_web_saveload.getItem = function (key) {
        if (!this.get()) { return }
        var name = this._name
        var mima = this._mima

        var redata = null

        var mode = "load"
        var key = key
        var data = ""
        var json = JSON.stringify({ "mode": mode, "name": name, "mima": mima, "key": key, "data": data });
        var url = this._php || "websaveload.php";


        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, false);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            if (xhr.status < 400) {
                redata = xhr.responseText
            }
        };
        xhr.onerror = function () {
            redata = "error"
        };
        xhr.send("json=" + json);

        if (redata == "error" || redata == "mima==remima" || redata == "mode!=true" ||
            redata == "mima!=mima" || redata == "load==null" || redata == "" || !redata) {
            console.log(key + " " + redata)
            return false
        }
        console.log(key + " " + "load==true")
        redata = redata.replace(/\s+/g, "+");
        return redata
    }




    /*
    StorageManager.isLocalMode = function() { 
        return 0 ;
    }; 
    */


    Game_System.prototype.isSaveEnabled = function () {
        if (!StorageManager.isLocalMode()) {
            return ww_web_saveload._ismima && this._saveEnabled
        }
        return this._saveEnabled
    };


    DataManager._loadGlobalInfo = null

    //加载全局信息
    DataManager.loadGlobalInfo = function () {
        if (!StorageManager.isLocalMode() && this._loadGlobalInfo) {
            return this._loadGlobalInfo
        }
        var json;
        try {
            json = StorageManager.load(0);
        } catch (e) {
            console.error(e);
            this._loadGlobalInfo = []
            return this._loadGlobalInfo;
        }
        if (json) {
            var globalInfo = JSON.parse(json);
            for (var i = 1; i <= this.maxSavefiles(); i++) {
                if (!StorageManager.exists(i)) {
                    delete globalInfo[i];
                }
            }
            this._loadGlobalInfo = globalInfo
            return this._loadGlobalInfo;
        } else {
            this._loadGlobalInfo = []
            return this._loadGlobalInfo;
        }
    };


    StorageManager.saveToWebStorage = function (savefileId, json) {
        var key = this.webStorageKey(savefileId);
        var data = LZString.compressToBase64(json);
        ww_web_saveload.setItem(key, data);
    };
    StorageManager.loadFromWebStorage = function (savefileId) {
        var key = this.webStorageKey(savefileId);
        var data = ww_web_saveload.getItem(key)
        return data && LZString.decompressFromBase64(data);
    };

    StorageManager.webStorageExists = function (savefileId) {
        var key = this.webStorageKey(savefileId);
        return !!ww_web_saveload.getItem(key);
    };
    StorageManager.removeWebStorage = function (savefileId) {
        var key = this.webStorageKey(savefileId);
        ww_web_saveload.removeItem(key);
    };

})();




/*
<? php

//后台 ?
//==========================================================
//die(md5($str)." ".md5($str)." ".md5($str)." ".md5($str));
$dir = "save";


$dir = iconv("utf-8", "gbk", $dir);
$dir = trim($dir);
if ($dir != "") {
    if (!is_dir($dir)) {
        $newdir = mkdir($dir);
        if (!$newdir) {
            die('dir=nil');
        };
    };
    //密码保存文件 
    $dir2 = $dir."/";
};

clearstatcache();
//读取json数据
$json = $_POST['json'];
//解析json
$obj = json_decode($json, true);
//模式
$mode = $obj['mode'];
//名称
$name = $obj['name'];
//密码
$mima = $obj['mima'];
//键
$key = $obj['key'];
//数据
$data = $obj['data'];
//密码保存文件 
$mimafile = $dir2."mima.rpg";

if ((strlen($name) > 0)and(strlen($mima) > 0)) {
    $name0 = md5($name);
    $mima0 = md5($mima);
    //$name0 = $name; 
    //$mima0 = $mima; 
}else {
    die("name=nil||mima==nil");
};

//如果存在 密码保存文件
if (file_exists($mimafile)) {
    //读取 密码保存文件
    $file = file_get_contents($mimafile);
    //解析 密码保存文件
    $fileo = json_decode($file, true);
    //检查 = 0 
    $jc = 0;
    //如果 密码保存文件中 包含 名称
    if (array_key_exists($name0, $fileo)) {
        //如果 密码 == 密码保存文件 中 名称对应值
        if ($mima0 == $fileo[$name0]) {
            //检查 = 1
            $jc = 1;
        } else {
            //检查 = 0
            $jc = 0;
        };
    } else {
        //如果 密码保存文件 含有的 内容 少于 1000 个
        if (count($fileo) <= 1000) {
            //密码保存文件 [名称] = 密码
            $fileo[$name0] = $mima0;
            //变成json字符串
            $file = json_encode($fileo);
            //保存字符串 到 密码保存文件
            file_put_contents($mimafile, $file);
            //jc = 2
            $jc = 2;
        } else {
            //jc = -1
            $jc = -1;
        };
    };
} else {
    //密码保存文件 [名称] = 密码
    $fileo[$name0] = $mima0;
    //变成json字符串
    $file = json_encode($fileo);
    //保存字符串 到 密码保存文件
    file_put_contents($mimafile, $file);
    //检查 = 2   
    $jc = 2;
};
//如果 检查 >= 1 (密码正确 或者 创建了新的)
if ($jc >= 1) {
    //原名称
    //名称 转换编码
    //$name2 = iconv("utf-8","gbk",$name);
    //保存文件名称   
    //$filename = $dir2.$name2.".rpgsave";
    //md5名称
    $filename = $dir2.$name0.".rpgsave";
    //如果 模式 == save 
    if ($mode == "save") {
        //如果 有 保存文件
        if (file_exists($filename)) {
            //读取保存文件
            $save = file_get_contents($filename);
            //解析保存文件
            $saveo = json_decode($save, true);
            //保存文件 [键] = 数据
            $saveo[$key] = $data;
            //保存json字符串
            $save2 = json_encode($saveo);
            //字符串 保存到 保存文件
            file_put_contents($filename, $save2);
        } else {
            //保存文件 [键] = 数据
            $saveo[$key] = $data;
            //保存json字符串
            $save2 = json_encode($saveo);
            //字符串 保存到 保存文件
            file_put_contents($filename, $save2);
        };
        //返回 "save==ok"
        die("save==ok");
    } elseif($mode == "load"){
        //如果 有 保存文件
        if (file_exists($filename)) {
            //读取保存文件
            $save = file_get_contents($filename);
            //解析保存文件
            $saveo = json_decode($save, true);
            //如果 保存文件 中 有 键
            if (array_key_exists($key, $saveo)) {
                //读取 对应数据
                $data = $saveo[$key];
                //返回 数据
                die($data);
            };
        };
        //返回 "load==null"
        die("load==null");
    } elseif($mode == "remima"){
        if (strlen($key) > 0) {
            $mima0 = md5($key);
            //读取 密码保存文件
            $file = file_get_contents($mimafile);
            //解析 密码保存文件
            $fileo = json_decode($file, true);
            //密码保存文件 [名称] = 密码
            $fileo[$name0] = $mima0;
            //变成json字符串
            $file = json_encode($fileo);
            //保存字符串 到 密码保存文件
            file_put_contents($mimafile, $file);
            die("mima==remima");
        } else {
            die("mima==null");
        };
    } elseif($mode == "isMima"){
        die("mima==mima");
    };
    //返回  "mode!=true"
    die("mode!=true");
};
//返回 "mima!=mima"
die("mima!=mima");
?>
*/