

(function () {

    Window_Base.prototype.processNormalCharacter = function (textState) {
 
        var regExp = /^\w+/i;
        var arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            if (arr[0]) {
                var t = arr[0]
                var w = this.textWidth(t);
                if (textState.x > textState.left && w + textState.x > this.contentsWidth() && w < 300) {
                    this.processNewLine(textState)
                    textState.index--;
                } else if (textState.x + w <= this.contentsWidth()) {
                    this.contents.drawText(t, textState.x, textState.y, w * 2, textState.height);
                    textState.index += arr[0].length;
                    textState.x += w;
                } else {
                    for (var i = 0; i < t.length; i++) {
                        var c = t[i]
                        var w = this.textWidth(c);
                        if (textState.x <= textState.left || w + textState.x <= this.contentsWidth()) {
                            textState.index++;
                            this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
                            textState.x += w;
                        } else {
                            this.processNewLine(textState)
                            textState.index--;
                            break
                        }
                    }
                }
                return
            }
        }
        var c = textState.text[textState.index];

        var w = this.textWidth(c);
        if (textState.x <= textState.left || w + textState.x <= this.contentsWidth()) {
            textState.index++
            this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
            textState.x += w;
        } else {
            while (c == " ") {
                textState.index++;
                var c = textState.text[textState.index];
            }
            this.processNewLine(textState)
            textState.index--;
            if (textState.text[textState.index] === '\n') {
                textState.index++;
            }
        }
    };





    Window_Base_prototype_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter
    Window_Base.prototype.processEscapeCharacter = function (code, textState) {

        //检查 参数
        switch (code) {
            //当 "I"
            case 'I':
                if (textState.x + Window_Base._iconWidth + 4 <= this.contentsWidth()) {
                    //处理绘制图标(  获得转换参数(文本状态) 文本状态)
                    this.processDrawIcon(this.obtainEscapeParam(textState), textState);
                } else {
                    this.processNewLine(textState)
                    textState.index--;
                    textState.index--
                    textState.index--
                }
                break;

            default:
                Window_Base_prototype_processEscapeCharacter.call(code, textState)
                break;

        }


    };






})()