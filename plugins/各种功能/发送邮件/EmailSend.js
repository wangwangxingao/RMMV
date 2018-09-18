//=============================================================================
// EmailSend.js
//=============================================================================

/*:
 * @plugindesc 可以通过腾讯邮箱的邮我发送信息
 * @author wangwang
 *
 * @param EmailSend
 * @desc  邮箱发送,
 * @default 汪汪 
 * 
 * @param YouWo
 * @desc 腾讯邮箱的邮我连接(只需要网址连接部分) ,见http://openmail.qq.com/
 * @default http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=k6GgoKaqoKSmoqPT4uK98Pz_
 * 
 * @param YouXiang
 * @desc 预留邮箱
 * @default 2335937510
 *  
 * @param YouXiangHZ
 * @desc 预留邮箱后缀
 * @default qq.com 
 * 
 * @param JiaMi
 * @desc 加密
 * @default false  
 * 
 * @param YaSuo
 * @desc 压缩
 * @default false
 * 
 * @param CunDang
 * @desc 存档
 * @default false
 * 
 * @help
 * 邮我见:
 * http://openmail.qq.com/ 
 * 可以通过腾讯邮箱的邮我发送信息,
 * 默认当出bug时会发送相关信息
 * 
 */

(function () {


    EmailSend = {}

    EmailSend.get = function () {

        var parse = function (i, type) {
            try {
                if (type) {
                    return i
                }
                return JSON.parse(i)
            } catch (e) {
                return i
            }
        }
        var find = function (name) {
            var parameters = PluginManager._parameters[name];
            if (parameters) {
            } else {
                var pls = PluginManager._parameters
                for (var n in pls) {
                    if (pls[n] && (name in pls[n])) {
                        parameters = pls[n]
                    }
                }
            }
            return parameters = parameters || {}
        }
        var get = function (p, n, unde) {
            try {
                var i = p[n]
            } catch (e) {
                var i = unde
            }
            return i === undefined ? unde : i
        }

        var parameters = find('EmailSend');
        EmailSend.url = get(parameters, 'YouWo', "")
        EmailSend.emileurl = get(parameters, 'YouXiang') + "@" + get(parameters, 'YouXiangHZ')
        EmailSend.jm = parse(get(parameters, 'JiaMi'))
        EmailSend.ys = parse(get(parameters, 'YaSuo'))
        EmailSend.cd = parse(get(parameters, 'CunDang'))
        return
    }
    EmailSend.get()
    EmailSend.send = function (emailname, emailvalue, emailtype) {
        if (!EmailSend.url) {
            console.log("未设置邮我")
            alert("作者未设置邮箱")
            return
        }
        var emailname = emailname || ""
        var emailvalue = emailvalue || ""
        var emailtype = emailtype || false
        var w = window.open(EmailSend.url)
        w.onload = function () {
            w.document.getElementById('subject').value = emailname
            w.document.getElementById('descriptiontx').value = EmailSend.hz() + emailvalue
            if (emailtype) {
                evt = w.document.createEvent("HTMLEvents");
                evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错 
                w.document.getElementById('sendbtn').dispatchEvent(evt);
            }
        }
    }
    EmailSend.sendError = function (emailname, emailvalue, emailtype) {
        if (!EmailSend.url) {
            console.log("未设置邮我")
            alert("作者未设置邮箱")
            return
        }
        var emailname = emailname || ""
        var emailvalue = emailvalue || ""
        var emailtype = emailtype || false
        var value = {}
        value.error = emailvalue
        if (EmailSend.cd) {
            try {
                if ($gameSystem) {
                    $gameSystem.onBeforeSave();
                    value.save = DataManager.makeSaveContents()
                }
            } catch (e) { }
        }
        value = JsonEx.stringify(value)
        if(EmailSend.ys){
            value = LZString.compressToBase64(value)
        } 
        EmailSend.send(emailname, value, emailtype)
        return value
    }
    EmailSend.hz = function () {
        return "使用QQ邮箱的邮我功能发送,原始链接为:" + EmailSend.url + "\n如果对安全有疑虑,可以自己发送邮件至:" + EmailSend.emileurl + "\n\n\n\n\n"
    }
    SceneManager.catchException = function (e) {
        if (e instanceof Error) {
            var value =  EmailSend.sendError(e.toString(), [e.name, e.message, e.stack, e])
            Graphics.printError(e.name, value);
//            Graphics.printError(e.name, e.message);
            console.error(e.stack);
        } else {
           // EmailSend.sendError('UnknownError', [e])
            Graphics.printError('UnknownError', e);
        }
        AudioManager.stopAll();
        this.stop();
    };

    SceneManager.onError = function (e) {
        console.error(e.message);
        console.error(e.filename, e.lineno);
        try {
            this.stop();
            EmailSend.sendError(JSON.stringify(["Error", e.message]), [e.filename, e.lineno, e])
            Graphics.printError('Error', e.message);
            AudioManager.stopAll();
        } catch (e2) {
        }
    };
})()