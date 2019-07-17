




//https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=OITANorlq6xVeKQEocBZTgX7&client_secret=55kIUvVn0solIjF7PYzGekm9S7TIkVFP



function r(name, type, token) {
    var fs = require('fs')
    var name = name || 'assets/16k_test'
    var type = type || "pcm" 
    var voice = fs.readFileSync(name + "." + type) 
    var voiceBase64s = voice.toString('base64')
    var o = {
        "format": type,
        "rate": 16000,
        "dev_pid": 1536,
        "channel": 1,
        "token": token,
        "cuid": "baidu_workshop",
        "len": voice.length,
        "speech": voiceBase64s, // xxx为 base64（FILE_CONTENT）
    }

    var s = new XMLHttpRequest()

    s.open("POST", "http://vop.baidu.com/server_api");

    s.setRequestHeader("Content-type", "application/json; charset=utf-8");
    s.onreadystatechange = function () {
        if (s.readyState == 4) {
            if (s.status == 200) {
                //实际操作
                console.log(s.response)
            }
        }
    }
    s.send(JSON.stringify(o))
}

o = {
    grant_type: "client_credentials",
    client_id: "OITANorlq6xVeKQEocBZTgX7",
    client_secret: "55kIUvVn0solIjF7PYzGekm9S7TIkVFP",
}
function d(o, name, type) {


    /*   o = {
           grant_type: "client_credentials",
           client_id: "OITANorlq6xVeKQEocBZTgX7",
           client_secret: "55kIUvVn0solIjF7PYzGekm9S7TIkVFP",
       }
       */
      var s = new XMLHttpRequest()

    s.open("POST", "https://openapi.baidu.com/oauth/2.0/token?" +
        "grant_type" + "=" + "client_credentials" + "&" +
        "client_id" + "=" + o.client_id + "&" +
        "client_secret" + "=" + o.client_secret,

        false);

    s.onreadystatechange = function () {
        if (s.readyState == 4) {
            if (s.status == 200) {
                //实际操作
                console.log(s.response)

                var z = JSON.parse(s.response)
                r(name, type, z.access_token)
            }
        }
    }
    s.send()

}

