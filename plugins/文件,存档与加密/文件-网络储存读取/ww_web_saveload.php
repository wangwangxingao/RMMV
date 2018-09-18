
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