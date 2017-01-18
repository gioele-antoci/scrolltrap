;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.scrolltrap = factory();
  }
}(this, function() {
var scrolltrap = (function () {
    function scrolltrap() {
    }
    scrolltrap.attach = function (el, options) {
        //Create a trapped element and assign an unique token
        var trapEl = {
            el: el,
            token: scrolltrap._generateToken(),
            options: options || {}
        };
        scrolltrap._elements.push(trapEl);
        el.addEventListener("mouseleave", scrolltrap._mouseLeave);
        el.addEventListener("mouseenter", function (e) { return scrolltrap._mouseEnter(trapEl); });
        //Return token for later actions on this el
        return trapEl.token;
    };
    scrolltrap.destroy = function (token) {
        //Find elelement we want to destroy and remove it from the array
        var trappedEl = scrolltrap._elements.filter(function (x) { return x.token === token; })[0];
        if (trappedEl) {
            //remove item from local collection of trapped elements
            scrolltrap._elements.splice(scrolltrap._elements.indexOf(trappedEl), 1);
            //De-attach event handlers
            trappedEl.el.removeEventListener("mouseleave", scrolltrap._mouseLeave);
            trappedEl.el.removeEventListener("mouseenter", function (e) { return scrolltrap._mouseEnter; });
            if (!scrolltrap._elements.length) {
                document.removeEventListener("wheel", scrolltrap._trapWheel);
            }
        }
    };
    scrolltrap._mouseEnter = function (trappedEl) {
        if (scrolltrap.debug) {
            console.log("mouse entered");
        }
        //Start listening for scroll events
        document.addEventListener("wheel", scrolltrap._trapWheel);
        scrolltrap._trapEngagementCheck(trappedEl);
        if (trappedEl.options.detectContentChanges) {
            (function (el) {
                //Listen to live mofidications to trapped element
                el.addEventListener("DOMNodeRemoved DOMNodeInserted input", scrolltrap._domChanged);
            })(trappedEl.el);
        }
    };
    scrolltrap._mouseLeave = function (e) {
        if (scrolltrap.debug) {
            console.log("mouse left");
        }
        document.removeEventListener("wheel", scrolltrap._trapWheel);
        document.removeEventListener("DOMNodeRemoved DOMNodeInserted input", scrolltrap._domChanged);
        scrolltrap.trapEngageable = false;
        if (scrolltrap._trappedElement && scrolltrap._trappedElement.options.classname) {
            scrolltrap._removeClass(scrolltrap._trappedElement.el, scrolltrap._trappedElement.options.classname);
        }
        scrolltrap._trappedElement = null;
    };
    scrolltrap._domChanged = function (e) {
        if (scrolltrap.debug) {
            console.log(e.type);
        }
        // START Throttler 
        if (scrolltrap._listenerToken) {
            clearTimeout(scrolltrap._listenerToken);
        }
        scrolltrap._listenerToken = setTimeout(function () {
            //Re calculate whether trap should be engaged or nto
            scrolltrap._refresh(scrolltrap._trappedElement);
            scrolltrap._listenerToken = null;
        }, 100);
    };
    scrolltrap._refresh = function (trappedEl) {
        if (trappedEl) {
            scrolltrap._trapEngagementCheck(trappedEl);
        }
    };
    scrolltrap._trapEngagementCheck = function (trappedEl) {
        var el = trappedEl.el;
        var containerHeight = el.clientHeight;
        var contentHeight = el.scrollHeight; // height of scrollable content
        // Content is higher than container, scroll bar is VISIBLE
        if (contentHeight > containerHeight) {
            scrolltrap.trapEngageable = true;
            scrolltrap._trappedElement = trappedEl;
        }
        else {
            scrolltrap.trapEngageable = false;
            scrolltrap._trappedElement = null;
        }
    };
    scrolltrap._trapWheel = function (wheelEvent) {
        //Trap not engaged, let the scroll happen
        if (!scrolltrap.trapEngageable) {
            if (scrolltrap._trappedElement.options.classname) {
                scrolltrap._removeClass(scrolltrap._trappedElement.el, scrolltrap._trappedElement.options.classname);
            }
            return true;
        }
        else {
            var el = scrolltrap._trappedElement.el;
            var curScrollPos = el.scrollTop;
            var dY = wheelEvent.deltaY;
            if (scrolltrap.debug) {
                console.log("delta-y: " + dY);
                console.log("cursor scroll Pos: " + curScrollPos);
            }
            var containerHeight = el.clientHeight;
            var contentHeight = el.scrollHeight; // height of scrollable content
            var scrollableDist = contentHeight - containerHeight;
            if (scrolltrap.debug) {
                console.log("container height:" + containerHeight);
                console.log("content height:" + contentHeight);
                console.log("scrollable dist: " + scrollableDist);
            }
            // only trap events once we've scrolled to the end or beginning
            //Note that a positive deltaY is a scroll down (and viceversa)
            if ((dY > 0 && (curScrollPos >= scrollableDist ||
                curScrollPos + 1 >= scrollableDist)) ||
                (dY < 0 && curScrollPos <= 0)) {
                if (scrolltrap.debug) {
                    console.log("trapped");
                }
                if (scrolltrap._trappedElement.options.classname) {
                    scrolltrap._addClass(scrolltrap._trappedElement.el, scrolltrap._trappedElement.options.classname);
                }
                wheelEvent.preventDefault();
                return false;
            }
            else if (scrolltrap._trappedElement.options.classname) {
                scrolltrap._removeClass(scrolltrap._trappedElement.el, scrolltrap._trappedElement.options.classname);
            }
        }
    };
    scrolltrap._generateToken = function () {
        var _p8 = function (s) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        };
        return _p8() + _p8(true) + _p8(true) + _p8();
    };
    scrolltrap._addClass = function (el, classname) {
        if (el.className.indexOf(classname) === -1) {
            el.className += " " + classname;
        }
    };
    scrolltrap._removeClass = function (el, classname) {
        if (el.className.indexOf(classname) !== -1) {
            el.className = el.className.replace(" " + classname, "");
        }
    };
    return scrolltrap;
}());
scrolltrap.debug = false;
scrolltrap._elements = [];

return scrolltrap;
}));
