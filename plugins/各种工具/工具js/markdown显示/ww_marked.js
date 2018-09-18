
wwMarked = function (src, opt, callback) {
    var renderer = new marked.Renderer();
    // Override function
    renderer.linkbase = renderer.link

    renderer.changeLink =  function(href,text){
        var href = href || ""
        if (!href) {
            href = text
        } else {
            if (text && typeof href == "string") { 
                var match = href.match(/^(\$*)(.*)/) //(/^(\$*)(\@*)(.*)/) 
                if (match) {
                    var l1 = match[1].replace(/\$/g, "..\/") 
                    var l2 = match[2]
                    if (l2) {
                        var match = l2.match(/(.*)\#(.*)/) 
                        if (match) {
                            l2 = (match[1] ? match[1] : text) + "#" + (match[2] ? match[2] : text)
                        } 
                    } else {
                        l2 = text
                    } 
                    href = l1 + l2 
                }  
            }
        } 
        return href
    }
    renderer.link = function (href, title, text) {
        var href = this.changeLink(href,text) 
        return this.linkbase(href, title, text);
    }; 
    // Run marked
    var opt = opt ||{}
    opt.renderer  = opt.renderer ?  opt.renderer  :renderer
    return marked(src, opt ,callback) 
}