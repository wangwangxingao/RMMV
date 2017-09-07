 get = function(list) {

     var hash = {}
     var hash2 = {}


     var dl = []
     var label = { p: {}, t: {} }
     var body = { type: "body", child: [] }
     var now = body
     var indent = 0

     var s = function(l) {
         var t = "-"
         for (var i = 0; i < l; i++) {
             t += "  "
         }
         return t
     }
     var end = function(arr, v) {
         v !== void(0) && (arr[arr.length - 1] = v)
         return arr[arr.length - 1]
     }
     var start = function(arr, v) {
         v !== void(0) && (arr[0] = v)
         return arr[0]
     }

     var dladd = function(i, type) {
         var o = { type: type, list: [], child: [] }
         if (type == "switch") { o.break = [] }
         if (type == "do") {
             o.next = [];
             o.break = []
         }
         dl.push(o)
         now.child.push(o)
         o.fa = now
         now = o
         now.start = i
         return o
     }
     var dltype = function() {
         var o = dlend()
         return (o && o.type) || void(0)
     }
     var dlend = function() {
         return end(dl)
     }
     var dli = function() {
         var o = dlend()
         return (o && end(o.list)) || void(0)
     }
     var dladdi = function(i) {
         var o = dlend()
         o && o.list.push(i)
     }
     var dlbreak = function(i) {
         var o = dlend()
         return (o && o.break) || []
     }
     var dlnext = function(i) {
         var o = dlend()
         return (o && o.next) || []
     }
     var dlpop = function(i) {
         dl.pop()
         now.end = i
         now = now.fa
     }

     for (var i = 0; i < list.length; i++) {
         var code = list[i][0]
         var params = list[i][1]
             /**获取表 */
         switch (code) {
             /**条件分歧 */
             case "switch":
                 console.log(s(dl.length), "流程", i)
                 dladd(i, "switch")
                 break
                 /**当 */
             case "when":
             case "case":
             case "default":
                 if (dltype() != "switch") { dladd(i, "switch") }
                 console.log(s(dl.length - 1), "当", i)
                 hash[dli()] = i - 1
                 dladdi(i)
                 break;
                 /**结束 */
             case "switchend":
                 if (dltype() != "switch") { break }
                 hash[dli()] = i
                 var l = dlbreak()
                 var li = 0
                 while (li < l.length) {
                     hash[l[li++]] = i
                 }
                 dlpop(i)
                 console.log(s(dl.length), "结束流程", i)
                 break
             case "if":
                 console.log(s(dl.length), "条件分歧", i)
                 dladd(i, "if")
                 dladdi(i)
                 break
             case "else":
                 console.log(s(dl.length - 1), "否则", i)
                 if (dltype() != "if") { break }
                 hash[dli()] = i
                 dladdi(i)
                 break
             case "ifend":
                 if (dltype() != "if") { break }
                 hash[dli()] = i
                 dlpop(i)
                 console.log(s(dl.length), "条件分歧结束", i)
                 break
                 /**循环 */
             case "do":
                 console.log(s(dl.length), "循环", i)
                 dladd(i, "do")
                 dladdi(i)
                 break;
                 /**循环结束 */
             case "while":
                 if (dltype() != "do") { break }
                 hash[i] = dli() - 1
                 var l = dlbreak()
                 var li = 0
                 while (li < l.length) {
                     hash[l[li++]] = i
                 }
                 var l = dlnext()
                 var li = 0
                 while (li < l.length) {
                     hash[l[li++]] = hash[i]
                 }
                 dlpop(i)
                 console.log(s(dl.length), "循环结束", i)
                 break;
             case "end":
                 var type = dltype()
                 if (type == "do") {
                     hash[i] = dli() - 1
                     var l = dlbreak()
                     var li = 0
                     while (li < l.length) {
                         hash[l[li++]] = i
                     }
                     var l = dlnext()
                     var li = 0
                     while (li < l.length) {
                         hash[l[li++]] = hash[i]
                     }
                     dlpop(i)
                     console.log(s(dl.length), "循环结束", i)
                 } else if (type == "switch") {
                     hash[dli()] = i
                     var l = dlbreak()
                     var li = 0
                     while (li < l.length) {
                         hash[l[li++]] = i
                     }
                     dlpop(i)
                     console.log(s(dl.length), "结束流程", i)
                 } else if (type == "if") {
                     hash[dli()] = i
                     dlpop(i)
                     console.log(s(dl.length), "条件分歧结束", i)
                     break
                 }
                 break;
                 /**循环断开 */
             case "break":
                 if (!dlend()) { break }
                 console.log(s(dl.length), "断开", i)
                 for (var li = dl.length - 1; li >= 0; li--) {
                     var l = dl[li]
                     if (l.break) { l.break.push(i); break }
                 }
                 break
                 /**下一个 */
             case "next":
                 if (!dlend()) { break }
                 console.log(s(dl.length), "断开", i)
                 for (var z = dl.length - 1; z >= 0; z--) {
                     var l = dl[z]
                     if (l.next) { l.next.push(i); break }
                 }
                 break;
                 /**标签 */
             case "label":
                 var id = params[0]
                 if (label.p[id] === void(0)) {
                     label.p[id] = i
                         //获取跳转标签并赋值
                     label.t[l] = label.t[l] || []
                     var li = 0
                     while (li < label.t[l].length) {
                         hash[li] = i
                     }
                 }
                 console.log(s(dl.length), "标签", i, id)
                 break;
                 /**跳转标签 */
             case "to":
                 var id = params[0]
                 label.t[id] = (label.t[id] || []).push(i)
                 label.p[id] !== void(0) && (hash[i] = label.p[id])
                 console.log(s(dl.length), "跳转标签", i, id)
                 break;
                 /**结束事件 */
             case "exit":
                 console.log(s(dl.length), "结束", i)
                 hash[i] = list.length
                 break;
             default:
                 break;
         }
         /**获取进度 */
         switch (code) {
             /**条件分歧 */
             case "do":
             case "if":
             case "switch":
                 hash2[i] = indent
                 indent++
                 break
                 /**当 */
             case "when":
             case "case":
             case "default":
             case "else":
                 hash2[i] = indent - 1
                 break;
                 /**结束 */
             case "ifend":
             case "switchend":
             case "while":
             case "end":
                 indent--
                 hash2[i] = indent
                 break
             default:
                 hash2[i] = indent
                 break;
         }
     }
     delete hash[void(0)]
     console.log(body)
     for (var i = 0; i < list.length; i++) {
         var code = list[i][0]
         console.log(s(hash2[i]) + code + "  " + i, hash2[i])
     }
     return hash
 }

 get(
     [
         ["if"],
         ["sd1f35"],
         ["else"],
         ["end"],
         ["sd1f35"],
         ["sd1f35"],
         ["switch"],
         ["sd1f35"],
         ["sd1f35"],
         ["sd1f35"],
         ["sd1f35"],
         ["case"],
         ["case"],
         ["if"],
         ["sd1f35"],
         ["sd1f35"],
         ["sd1f35"],
         ["sd1f35"],
         ["else if"],
         ["else"],
         ["break"],
         ["sd1f35"],
         ["sd1f35"],
         ["end"],
         ["case"],
         ["if"],
         ["sd1f35"],
         ["else if"],
         ["sd1f35"],
         ["sd1f35"],
         ["else"],
         ["sd1f35"],
         ["break"],
         ["end"],
         ["case"],
         ["sd1f35"],
         ["sd1f35"],
         ["if"],
         ["sd1f35"],
         ["else if"],
         ["else"],
         ["break"],
         ["end"],
         ["case"],
         ["do"],
         ["do"],
         ["end"],
         ["while"],
         ["end"],
         [],
         [],
         [],
         [],
         [],
         [],
         [],
         [],
         [],
         [],
         [],
     ]
 )