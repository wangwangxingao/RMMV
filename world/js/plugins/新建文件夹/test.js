
var MyXMLHttpRequest = function () {
    var xmlhttprequest;
    if (window.XMLHttpRequest) {
        xmlhttprequest = new XMLHttpRequest();
        if (xmlhttprequest.overrideMimeType) {
            xmlhttprequest.overrideMimeType("text/xml");
        }
    } else if (window.ActiveXObject) {
        var activeName = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
        for (var i = 0; i < activeName.length; i++) {
            try {
                xmlhttprequest = new ActiveXObject(activeName[i]);
                break;
            } catch (e) {

            }
        }
    }

    if (xmlhttprequest == undefined || xmlhttprequest == null) {
        alert("XMLHttpRequest对象创建失败！！");
    } else {
        this.xmlhttp = xmlhttprequest;
    }

    //用户发送请求的方法  
    MyXMLHttpRequest.prototype.send = function (method, url, data, callback, failback) {
        if (this.xmlhttp != undefined && this.xmlhttp != null) {
            method = method.toUpperCase();
            if (method != "GET" && method != "POST") {
                alert("HTTP的请求方法必须为GET或POST!!!");
                return;
            }
            if (url == null || url == undefined) {
                alert("HTTP的请求地址必须设置！");
                return;
            }
            var tempxmlhttp = this.xmlhttp;
            this.xmlhttp.onreadystatechange = function () {
                if (tempxmlhttp.readyState == 4) {
                    if (temxmlhttp.status == 200) {
                        var responseText = temxmlhttp.responseText;
                        var responseXML = temxmlhttp.reponseXML;
                        if (callback == undefined || callback == null) {
                            alert("没有设置处理数据正确返回的方法");
                            alert("返回的数据：" + responseText);
                        } else {
                            callback(responseText, responseXML);
                        }
                    } else {
                        if (failback == undefined || failback == null) {
                            alert("没有设置处理数据返回失败的处理方法！");
                            alert("HTTP的响应码：" + tempxmlhttp.status + ",响应码的文本信息：" + tempxmlhttp.statusText);
                        } else {
                            failback(tempxmlhttp.status, tempxmlhttp.statusText);
                        }
                    }
                }
            }

            //解决缓存的转换  
            if (url.indexOf("?") >= 0) {
                url = url + "&t=" + (new Date()).valueOf();
            } else {
                url = url + "?+=" + (new Date()).valueOf();
            }

            //解决跨域的问题  
            if (url.indexOf("http://") >= 0) {
                url.replace("?", "&");
                url = "Proxy?url=" + url;
            }
            this.xmlhttp.open(method, url, true);

            //如果是POST方式，需要设置请求头  
            if (method == "POST") {
                this.xmlhttp.setRequestHeader("Content-type", "application/x-www-four-urlencoded");
            }
            this.xmlhttp.send(data);
        } else {
            alert("XMLHttpRequest对象创建失败，无法发送数据！");
        }
        MyXMLHttpRequest.prototype.abort = function () {
            this.xmlhttp.abort();
        }
    }
}




clone = function (i) { return JsonEx.parse(JsonEx.stringify(i)) }
DataManager.loadDataFile = function (name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onreadystatechange = function () {
        console.log(clone(xhr))
    }
    xhr.onprogress = function (e) {
        console.log(clone(e))
        this.onprogress = null
    }
    xhr.onload = function () {
        if (xhr.status < 400) {
            window[name] = JSON.parse(xhr.responseText);
            DataManager.onLoad(window[name]);
        }
    };
    xhr.onerror = function () {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    window[name] = null;
    xhr.send();
};
DataManager.loadDataFile("s", 'Actors1.json')





b2 = new Blob([ss])
url = window.URL.createObjectURL(b2)
b = new Bitmap()
b._image = new Image()

b._image.src = url

b.canvas.toDataURL()








Decrypter.decryptImg = function (src) {
    var bitmap = new Bitmap()
    bitmap._image = new Image()
    var requestFile = new XMLHttpRequest();
    var url = 'img/' + src;
    requestFile.open("GET", url);
    requestFile.responseType = "arraybuffer";
    requestFile.send();
    requestFile.onload = function () {
        if (this.status < Decrypter._xhrOk) {
            arrayBuffer = requestFile.response
            bitmap._image.src = Decrypter.createBlobUrl(arrayBuffer);
            bitmap._image.onload = Bitmap.prototype._onLoad.bind(bitmap);
            bitmap._image.onerror = Bitmap.prototype._onError.bind(bitmap);
        }
    };
};



clone = function (i) { return JsonEx.parse(JsonEx.stringify(i)) }
DataManager.loadDataFile = function (name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'img/' + src;
    xhr.open('GET', url);
    xhr.responseType = "arraybuffer";
    xhr.onprogress = function (e) {
        console.log((e))
    }
    xhr.onload = function () {
        if (xhr.status < 400) {
            ss = xhr.response
        }
    };
    xhr.send();
};
DataManager.loadDataFile("s", 'Clouds.png')


b2 = new Blob([ss])
url = window.URL.createObjectURL(b2)
b = new Bitmap()
b._image = new Image()

b._image.src = url

b.canvas.toDataURL()

var reader = new FileReader(); //通过 FileReader 读取blob类型
reader.onload = function () {
    console.log(l = this); //base64编码
}
reader.readAsText(b2);



a = function () {
    var l = []
    for (var i = 0; i < 1000; i++) {
        l.push(arrayBuffer)
    }
    var t = Date.now()
    array = []
    var i00 = 0
    for (var i0 = 0; i < l.length; i++) {
        var a = l[i0]
        var b = new Uint8Array(a);
        for (i = 0; i < b.length; i++) {
            array[i00] = b[i]
            i00++
        }
    }
    var t2 = Date.now()
    console.log(t, t2, t2 - t)
    var t = Date.now()
    brray = new Blob(l)
    var t2 = Date.now()
    console.log(t, t2, t2 - t)
}






















 **




    /**实验项目效果
     * @param {object} target 对象
     * @param {object} effect 效果
     * @return {boolean} 是否有效
     * */
    Game_Action.prototype.testItemEffect = function (target, effect) {
        //检查 (效果 编码)
        switch (effect.code) {
            //当 游戏动作 效果恢复hp
            case Game_Action.EFFECT_RECOVER_HP:
                //返回 目标 hp <  目标 mhp || 效果 值1 < 0 || 效果 值2 < 0;
                return target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0;
            //当 游戏动作 效果恢复mp
            case Game_Action.EFFECT_RECOVER_MP:
                //返回 目标 mp <  目标 mmp || 效果 值1 < 0 || 效果 值2 < 0;
                return target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0;
            //当 游戏动作 效果添加状态
            case Game_Action.EFFECT_ADD_STATE:
                //返回 不是 目标 是状态影响 (效果 数据id)
                return !target.isStateAffected(effect.dataId);
            //当 游戏动作 效果移除状态
            case Game_Action.EFFECT_REMOVE_STATE:
                //返回 目标 是状态影响 (效果 数据id)
                return target.isStateAffected(effect.dataId);
            //当 游戏动作 效果添加正面效果
            case Game_Action.EFFECT_ADD_BUFF:
                //返回 不是 目标 是最大正面效果影响 (效果 数据id)
                return !target.isMaxBuffAffected(effect.dataId);
            //当 游戏动作 效果添加负面效果
            case Game_Action.EFFECT_ADD_DEBUFF:
                //返回 不是 目标 是最大负面效果影响 (效果 数据id)
                return !target.isMaxDebuffAffected(effect.dataId);
            //当 游戏动作 效果移除正面效果
            case Game_Action.EFFECT_REMOVE_BUFF:
                //返回 目标 是正面效果影响 (效果 数据id)
                return target.isBuffAffected(effect.dataId);
            //当 游戏动作 效果移除负面效果
            case Game_Action.EFFECT_REMOVE_DEBUFF:
                //返回 目标 是负面效果影响 (效果 数据id)
                return target.isDebuffAffected(effect.dataId);
            //当 游戏动作 效果学习技能
            case Game_Action.EFFECT_LEARN_SKILL:
                //返回 目标 是角色 并且 不是 目标 是学习了的技能 (效果 数据id)
                return target.isActor() && !target.isLearnedSkill(effect.dataId);
            //缺省
            default:
                //返回 true 
                return true;
        }
    };
/**项目反击比例
 * @param {object} target 对象
 * @return {number}  
 * */
Game_Action.prototype.itemCnt = function (target) {
    //如果 (是物理 并且 目标 能移动)
    if (this.isPhysical() && target.canMove()) {
        //返回 目标 反击比例
        return target.cnt;
        //否则
    } else {
        //返回 0
        return 0;
    }
};
/**项目魔法反射比例
 * @param {object} target 对象
 * @return {number}  
 * */
Game_Action.prototype.itemMrf = function (target) {
    //如果 (是魔法)
    if (this.isMagical()) {
        //返回 目标 魔法反射比例
        return target.mrf;
        //否则
    } else {
        //返回 0
        return 0;
    }
};
/**项目击中
 * @param {object} target 对象
 * @return {number}  
 * */
Game_Action.prototype.itemHit = function (target) {
    //如果 (是物理)
    if (this.isPhysical()) {
        //返回 项目 成功比例 * 0.01 * 主体 命中比例
        return this.item().successRate * 0.01 * this.subject().hit;
        //否则
    } else {
        //返回 项目 成功比例 * 0.01  
        return this.item().successRate * 0.01;
    }
};
/**项目闪避
 * @param {object} target 对象
 * @return {number}  
 * */
Game_Action.prototype.itemEva = function (target) {
    //如果 (是物理)
    if (this.isPhysical()) {
        //返回 目标 闪避比例
        return target.eva;
        //否则 如果 (是魔法)
    } else if (this.isMagical()) {
        //返回 目标 魔法躲避比例
        return target.mev;
        //否则
    } else {
        //返回 0
        return 0;
    }
};
/**项目会心比例
 * @param {object} target 对象
 * @return {number}  
 * */
Game_Action.prototype.itemCri = function (target) {
    //返回  项目 伤害 会心 ? 主体 会心比例 * ( 1 - 会心回避比例) : 0 
    return this.item().damage.critical ? this.subject().cri * (1 - target.cev) : 0;
};
/**应用
 * @param {object} target 对象 
 * */
Game_Action.prototype.apply = function (target) {
    //结果 = 目标 结果 
    var result = target.result();
    //主体 清除结果
    this.subject().clearResult();
    //结果 清除
    result.clear();
    //结果 使用的 = 测试应用(目标)
    result.used = this.testApply(target);
    //结果 未击中的 = (结果 使用的 并且  数学 随机数 >= 项目击中(目标)  )
    result.missed = (result.used && Math.random() >= this.itemHit(target));
    //结果 闪避的 = (不是 结果 未击中的  并且 数学 随机数 < 项目闪避(目标)
    result.evaded = (!result.missed && Math.random() < this.itemEva(target));
    //结果 物理 = 是物理
    result.physical = this.isPhysical();
    //结果 吸收 = 是吸收
    result.drain = this.isDrain();

    //结果 (是击中)
    if (result.isHit()) {
        //如果 (项目 伤害 种类 > 0 )
        if (this.item().damage.type > 0) {
            //结果 会心 = ( 数学 随机数 < 项目会心比例(目标) )
            result.critical = (Math.random() < this.itemCri(target));
            //值 = 制作伤害数据 (目标 , 结果 会心)
            var value = this.makeDamageValue(target, result.critical);
            //执行伤害 (目标 ,值)
            this.executeDamage(target, value);
        }
        //项目 效果组 对每一个 (效果)
        this.item().effects.forEach(function (effect) {
            //应用项目效果(目标 效果)
            this.applyItemEffect(target, effect);
            //this
        }, this);
        //应用项目使用者效果(目标)
        this.applyItemUserEffect(target);
    }
};
/**制作伤害数据
 * @param {object} target 对象
 * @param {boolean} critical 会心
 * @return {number} 
 * */
Game_Action.prototype.makeDamageValue = function (target, critical) {
    //项目 = 项目
    var item = this.item();
    //基础值 = 执行伤害公式(目标)
    var baseValue = this.evalDamageFormula(target);
    //值 = 基础值 * 计算元素比例
    var value = baseValue * this.calcElementRate(target);
    //如果 (是物理)
    if (this.isPhysical()) {
        //值 *= 目标 物理伤害比例
        value *= target.pdr;
    }
    //如果 (是魔法 )
    if (this.isMagical()) {
        //值 *= 目标 魔法伤害比例
        value *= target.mdr;
    }
    //如果 (基础值 <0)
    if (baseValue < 0) {
        //值 *= 恢复效果比例
        value *= target.rec;
    }
    //如果 (会心)
    if (critical) {
        //值 = 应用会心(值)
        value = this.applyCritical(value);
    }
    //值 =  应用分散(值, 项目 伤害 分散)
    value = this.applyVariance(value, item.damage.variance);
    //值 = 应用防御 (值 ,目标)
    value = this.applyGuard(value, target);
    //值 = 数学 向上取最近整数(值)
    value = Math.round(value);
    //返回 值
    return value;
};
/**执行伤害公式
 * @param {object} target 对象 
 * @return {number} 
 * */
Game_Action.prototype.evalDamageFormula = function (target) {
    //测试
    try {
        //项目 = 项目
        var item = this.item();
        //a = 主体
        var a = this.subject();
        //b = 目标
        var b = target;
        //v = 游戏变量 _数据
        var v = $gameVariables._data;
        //符号 = 如果 (  [3,4] 包含(项目 伤害 种类) ) ? -1 : 1
        var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
        //值 = 数学 最大 (  执行(项目 伤害 公式), 0 ) * 符号
        var value = Math.max(eval(item.damage.formula), 0) * sign;
        //如果 (  是非法的数字(值) ) 值 = 0
        if (isNaN(value)) value = 0;
        //返回 值
        return value;
        //如果错误(e)
    } catch (e) {
        //返回 0 
        return 0;
    }
};
/**计算元素比例
 * @param {object} target 对象 
 * @return {number} 
 * */
Game_Action.prototype.calcElementRate = function (target) {
    //如果 项目 伤害 元素id < 0 
    if (this.item().damage.elementId < 0) {
        //返回 元素最大比例(目标 , 主体 攻击元素组)
        return this.elementsMaxRate(target, this.subject().attackElements());
        //否则 
    } else {
        //返回 目标 元素比例 (项目 伤害 元素id)
        return target.elementRate(this.item().damage.elementId);
    }
};
/**元素最大比例
 * @param {object} target 对象
 * @param {[number]} elements 元素组
 * @return {number} 
 * */
Game_Action.prototype.elementsMaxRate = function (target, elements) {
    //如果 ( 元素 长度 > 0 )
    if (elements.length > 0) {
        //返回 数学 最大 应用 (null , 元素 映射 ( 元素id)
        return Math.max.apply(null, elements.map(function (elementId) {
            //返回 目标 元素比例(元素id)
            return target.elementRate(elementId);
            //this
        }, this));
        //否则
    } else {
        //返回 1 
        return 1;
    }
};
/**应用会心
 * @param {number} damage 伤害 
 * @return {number} 
 * */
Game_Action.prototype.applyCritical = function (damage) {
    //返回 伤害 * 3 
    return damage * 3;
};
/**应用分散
 * @param {number} damage 伤害 
 * @param {number} variance 偏差
 * @return {number} 
 * */
Game_Action.prototype.applyVariance = function (damage, variance) {
    //amp = 数学 向下取整 ( 数学 最大值  ( 数学 绝对值( 伤害 )* 偏差 /100  , 0 ) )
    var amp = Math.floor(Math.max(Math.abs(damage) * variance / 100, 0));
    //v =  数学 随机整数 (amp + 1 ) + 数学 随机整数 (amp + 1 ) - amp
    var v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
    //返回   伤害 >=0 ? 伤害 + v : 伤害 - v 
    return damage >= 0 ? damage + v : damage - v;
};
/**应用防御
 * @param {number} damage 伤害
 * @param {object} target 目标 
 * @return {number} 
 * */
Game_Action.prototype.applyGuard = function (damage, target) {
    //返回 伤害 / (  伤害 >0 并且 目标 是防御  ? 2 * 目标 防守效果比例 : 1 )
    return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
};
/**执行伤害
 * @param {object} target 目标 
 * @param {number} value 值  
 * */
Game_Action.prototype.executeDamage = function (target, value) {
    //结果 = 目标 结果
    var result = target.result();
    //如果 ( 值 === 0 )
    if (value === 0) {
        //结果 会心 = false
        result.critical = false;
    }
    //如果  ( 是hp效果)
    if (this.isHpEffect()) {
        //执行hp伤害( 目标 , 值 )
        this.executeHpDamage(target, value);
    }
    //如果 ( 是mp效果 )
    if (this.isMpEffect()) {
        //执行mp伤害( 目标 , 值 )
        this.executeMpDamage(target, value);
    }
};
/**执行hp伤害
 * @param {object} target 目标 
 * @param {number} value 值  
 * */
Game_Action.prototype.executeHpDamage = function (target, value) {
    //如果 (是吸收)
    if (this.isDrain()) {
        //值 = 数学 较小值( 目标 hp , 值 ) 
        value = Math.min(target.hp, value);
    }
    //制作成功(目标)
    this.makeSuccess(target);
    //目标 获得hp( -值 )
    target.gainHp(-value);
    //如果 值 > 0
    if (value > 0) {
        //目标 当伤害( 值 )
        target.onDamage(value);
    }
    //获得吸收hp( 值 )
    this.gainDrainedHp(value);
};
/**执行mp伤害
 * @param {object} target 目标 
 * @param {number} value 值  
 * */
Game_Action.prototype.executeMpDamage = function (target, value) {
    //如果 (不是 是mp恢复)
    if (!this.isMpRecover()) {
        //值 = 数学 较小值( 目标 mp , 值 ) 
        value = Math.min(target.mp, value);
    }
    //如果 ( 值 !== 0 )
    if (value !== 0) {
        //制作成功(目标)
        this.makeSuccess(target);
    }
    //目标 获得mp( -值 ) 
    target.gainMp(-value);
    //获得吸收mp( 值 )
    this.gainDrainedMp(value);
};
/**获得吸收hp 
 * @param {number} value 值  
 * */
Game_Action.prototype.gainDrainedHp = function (value) {
    //如果 (是吸收)
    if (this.isDrain()) {
        //获得目标 = 主体()
        var gainTarget = this.subject();
        //如果( 反射目标 !== undefined)
        if (this._reflectionTarget !== undefined) {
            //获得目标 = 反射目标
            gainTarget = this._reflectionTarget;
        }
        //获得目标 获得hp( 值 ) 
        gainTarget.gainHp(value);
    }
};
/**获取吸收mp 
 * @param {number} value 值  
 * */
Game_Action.prototype.gainDrainedMp = function (value) {
    //如果 (是吸收)
    if (this.isDrain()) {
        //获得目标 = 主体()
        var gainTarget = this.subject();
        //如果( 反射目标 !== undefined)
        if (this._reflectionTarget !== undefined) {
            //获得目标 = 反射目标
            gainTarget = this._reflectionTarget;
        }
        //获得目标 获得mp( 值 ) 
        gainTarget.gainMp(value);
    }
};
/**应用项目效果
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.applyItemEffect = function (target, effect) {
    //检查 (效果 编码) 
    switch (effect.code) {
        //当 游戏动作 效果恢复hp
        case Game_Action.EFFECT_RECOVER_HP:
            //项目效果恢复hp( 目标 效果 )
            this.itemEffectRecoverHp(target, effect);
            //跳出
            break;
        //当 游戏动作 效果恢复mp
        case Game_Action.EFFECT_RECOVER_MP:
            //项目效果恢复mp( 目标 效果 )
            this.itemEffectRecoverMp(target, effect);
            //跳出
            break;
        //当 游戏动作 效果获得tp
        case Game_Action.EFFECT_GAIN_TP:
            //项目效果获得tp ( 目标 效果 )
            this.itemEffectGainTp(target, effect);
            //跳出
            break;
        //当 游戏动作 效果添加状态
        case Game_Action.EFFECT_ADD_STATE:
            //项目效果添加状态( 目标 效果 )
            this.itemEffectAddState(target, effect);
            //跳出
            break;
        //当 游戏动作 效果移除状态
        case Game_Action.EFFECT_REMOVE_STATE:
            //项目效果移除状态( 目标 效果 )
            this.itemEffectRemoveState(target, effect);
            //跳出
            break;
        //当 游戏动作 效果添加正面效果
        case Game_Action.EFFECT_ADD_BUFF:
            //项目效果添加正面效果( 目标 效果 )
            this.itemEffectAddBuff(target, effect);
            //跳出
            break;
        //当 游戏动作 效果添加负面效果
        case Game_Action.EFFECT_ADD_DEBUFF:
            //项目效果添加负面效果( 目标 效果 )
            this.itemEffectAddDebuff(target, effect);
            //跳出
            break;
        //当 游戏动作 效果移除正面效果
        case Game_Action.EFFECT_REMOVE_BUFF:
            //项目效果移除正面效果( 目标 效果 )
            this.itemEffectRemoveBuff(target, effect);
            //跳出
            break;
        //当 游戏动作 效果移除负面效果
        case Game_Action.EFFECT_REMOVE_DEBUFF:
            //项目效果移除负面效果( 目标 效果 )
            this.itemEffectRemoveDebuff(target, effect);
            break;
        //当 游戏动作 效果额外的
        case Game_Action.EFFECT_SPECIAL:
            //项目效果额外的( 目标 效果 )
            this.itemEffectSpecial(target, effect);
            //跳出
            break;
        //当 游戏动作 效果生长
        case Game_Action.EFFECT_GROW:
            //项目效果生长( 目标 效果 )
            this.itemEffectGrow(target, effect);
            //跳出
            break;
        //当 游戏动作 效果学习技能
        case Game_Action.EFFECT_LEARN_SKILL:
            //项目效果学习技能( 目标 效果 )
            this.itemEffectLearnSkill(target, effect);
            //跳出
            break;
        //当 游戏动作 效果公共事件
        case Game_Action.EFFECT_COMMON_EVENT:
            //项目效果公共事件( 目标 效果 )	
            this.itemEffectCommonEvent(target, effect);
            //跳出
            break;
    }
};
/**项目效果恢复hp
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectRecoverHp = function (target, effect) {
    //值 = (目标 mhp * 效果 值1 + 效果 值2 ) * 目标 恢复效果比例
    var value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    //如果 是物品
    if (this.isItem()) {
        //值 *= 主体 药物知识
        value *= this.subject().pha;
    }
    //值 =  数学 向下取整 ( 值 )
    value = Math.floor(value);
    //如果 (值 !== 0)
    if (value !== 0) {
        //目标 获得hp( 值 ) 
        target.gainHp(value);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
/**项目效果恢复mp
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectRecoverMp = function (target, effect) {
    //值 = (目标 mmp * 效果 值1 + 效果 值2 ) * 目标 恢复效果比例 
    var value = (target.mmp * effect.value1 + effect.value2) * target.rec;
    //如果 是物品
    if (this.isItem()) {
        //值 *= 主体 药物知识
        value *= this.subject().pha;
    }
    //值 =  数学 向下取整 ( 值 )
    value = Math.floor(value);
    //如果 (值 !== 0)
    if (value !== 0) {
        //目标 获得mp( 值 ) 
        target.gainMp(value);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
/**项目效果获得tp
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectGainTp = function (target, effect) {
    //值 = 数学 向下取整( 效果 值1  ) 
    var value = Math.floor(effect.value1);
    //如果( 值 !== 0 )
    if (value !== 0) {
        //目标 获得tp( 值 ) 
        target.gainTp(value);
        //制作成功 目标(目标)
        this.makeSuccess(target);
    }
};
/**项目效果添加状态
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectAddState = function (target, effect) {
    //如果( 效果 数据id === 0 )
    if (effect.dataId === 0) {
        //项目效果添加攻击状态 ( 目标, 效果 )
        this.itemEffectAddAttackState(target, effect);
        //否则 
    } else {
        //项目效果添加普通状态  ( 目标, 效果 )
        this.itemEffectAddNormalState(target, effect);
    }
};
/**项目效果添加攻击状态
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectAddAttackState = function (target, effect) {
    //主体 攻击状态 对每一个 状态id
    this.subject().attackStates().forEach(function (stateId) {
        //概率 =  效果 值1
        var chance = effect.value1;
        //概率 *= 目标 状态比例(状态id)
        chance *= target.stateRate(stateId);
        //概率 *= 主体 攻击状态比例(状态id) 
        chance *= this.subject().attackStatesRate(stateId);
        //概率 *= 运气效果比例(目标)
        chance *= this.lukEffectRate(target);
        //如果 数学 随机数 < 概率
        if (Math.random() < chance) {
            //目标 添加状态(状态id)
            target.addState(stateId);
            //制作成功 (目标)
            this.makeSuccess(target);
        }
        //绑定 this ,目标 
    }.bind(this), target);
};
/**项目效果添加普通状态
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectAddNormalState = function (target, effect) {
    //概率 = 效果 值1
    var chance = effect.value1;
    //如果(不是 是必中)
    if (!this.isCertainHit()) {
        //概率 *= 目标 状态比例(效果 数据id)
        chance *= target.stateRate(effect.dataId);
        //概率 *= 运气效果比例(目标)
        chance *= this.lukEffectRate(target);
    }
    //如果 (数学 随机数 < 概率)
    if (Math.random() < chance) {
        //目标 添加状态(效果 数据id)
        target.addState(effect.dataId);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
/**项目效果移除状态
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectRemoveState = function (target, effect) {
    //概率 = 效果 值1
    var chance = effect.value1;
    //如果 (数学 随机数 < 概率)
    if (Math.random() < chance) {
        //目标 移除状态(效果 数据id) 
        target.removeState(effect.dataId);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
/**项目效果添加正面效果
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectAddBuff = function (target, effect) {
    //目标 添加正面效果(效果 数据id,效果 值1)
    target.addBuff(effect.dataId, effect.value1);
    //制作成功 (目标)
    this.makeSuccess(target);
};
/**项目效果添加负面效果
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectAddDebuff = function (target, effect) {
    //概率 = 目标 负面效果比例 ( 效果 数据id )  * 运气效果比例(目标)
    var chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
    //如果 (数学 随机数 < 概率) 
    if (Math.random() < chance) {
        //目标 添加负面效果(效果 数据id , 效果 值1) 
        target.addDebuff(effect.dataId, effect.value1);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
/**项目效果移除正面效果
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectRemoveBuff = function (target, effect) {
    //如果 ( 目标 是正面效果影响(效果 数据id) )
    if (target.isBuffAffected(effect.dataId)) {
        //目标 移除正面效果(效果 数据id)
        target.removeBuff(effect.dataId);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
/**项目效果移除负面效果
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectRemoveDebuff = function (target, effect) {
    //如果 ( 目标 是负面效果影响(效果 数据id) ) 
    if (target.isDebuffAffected(effect.dataId)) {
        //目标 移除负面效果(效果 数据id)
        target.removeBuff(effect.dataId);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
/**项目效果额外的
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectSpecial = function (target, effect) {
    //如果 ( 效果 数据id = 游戏动作 特殊效果逃跑 )
    if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
        //目标 逃跑
        target.escape();
        //制作成功(目标)
        this.makeSuccess(target);
    }
};
/**项目效果生长
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectGrow = function (target, effect) {
    //目标 增加参数( 效果 数据id , 数学 向下取整( 效果 值1)   )
    target.addParam(effect.dataId, Math.floor(effect.value1));
    //制作成功 (目标)
    this.makeSuccess(target);
};
/**项目效果学习技能
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectLearnSkill = function (target, effect) {
    //如果 ( 目标 是角色 )
    if (target.isActor()) {
        //目标 学习技能( 效果 数据id )
        target.learnSkill(effect.dataId);
        //制作成功 (目标)
        this.makeSuccess(target);
    }
};
/**项目效果公共事件
 * @param {object} target 目标 
 * @param {object} effect 效果  
 * */
Game_Action.prototype.itemEffectCommonEvent = function (target, effect) {
};
/**制作成功
 * @param {object} target 目标  
 * */
Game_Action.prototype.makeSuccess = function (target) {
    //目标 结果 成功 = true
    target.result().success = true;
};
/**应用项目使用者效果
 * @param {object} target 目标   
 * */
Game_Action.prototype.applyItemUserEffect = function (target) {
    //值 = 数学 向下取整( 项目 tp获得 * 主体 充能比例 ) 
    var value = Math.floor(this.item().tpGain * this.subject().tcr);
    //主体 获得无声tp(值)
    this.subject().gainSilentTp(value);
};
/**运气效果比例
 * @param {object} target 目标  
 * @return {number}   
 * */
Game_Action.prototype.lukEffectRate = function (target) {
    //返回 数学 较大值 ( 1.0 + (主体 运气 - 目标运气 ) * 0.001 , 0.0 )
    return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
};
/**应用通用的*/
Game_Action.prototype.applyGlobal = function () {
    //项目 效果组 对每一个 效果
    this.item().effects.forEach(function (effect) {
        //如果 效果 编码 === 游戏 项目效果公共事件
        if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
            //游戏临时 储存公共事件(效果 数据id)
            $gameTemp.reserveCommonEvent(effect.dataId);
        }
        //this
    }, this);
};
