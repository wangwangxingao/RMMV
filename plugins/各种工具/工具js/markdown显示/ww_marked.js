

; (function (root) {
    'use strict';


    function wwMarked(src, opt, callback) {



        var myMarked = marked;

        // Get reference
        var renderer = new myMarked.Renderer();

        // Override function
        renderer.link = function (text, level) {
            var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

            return `
                  <h${level}>
                    <a name="${escapedText}" class="anchor" href="#${escapedText}">
                      <span class="header-link"></span>
                    </a>
                    ${text}
                  </h${level}>`;
        };

        // Run marked
        console.log(myMarked('# heading+', { renderer: renderer }));

    }


    /**
     * Expose
     */


    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = marked;
    } else if (typeof define === 'function' && define.amd) {
        define(function () { return wwmarked; });
    } else {
        root.wwmarked = wwmarked;
    }
})(this || (typeof window !== 'undefined' ? window : global));
