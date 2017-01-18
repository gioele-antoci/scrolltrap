class scrolltrap {

    private static debug = false;

    private static elements: trappedElement[] = [];
    private static defaultTrapClassName = "trap-scroll-enabled";
    private static listenerToken: number;

    private static trappedElement: trappedElement;

    static attach(el: HTMLElement, options?: scrolltrapOptions): string {
        //Create a trapped element and assign an unique token
        const trapEl: trappedElement = {
            el: el,
            token: scrolltrap._generateToken(),
            options: options || {}
        };
        scrolltrap.elements.push(trapEl);

        el.addEventListener("mouseleave", scrolltrap._mouseLeave);
        el.addEventListener("mouseenter", e => scrolltrap._mouseEnter(trapEl));

        //Return token for later actions on this el
        return trapEl.token;
    }

    static destroy(token: string): void {
        //Find elelement we want to destroy and remove it from the array
        var trappedEl = scrolltrap.elements.filter((x: trappedElement) => x.token === token)[0];

        if (trappedEl) {
            //remove item from local collection of trapped elements
            scrolltrap.elements.splice(scrolltrap.elements.indexOf(trappedEl), 1);

            //De-attach event handlers
            trappedEl.el.removeEventListener("mouseleave", scrolltrap._mouseLeave);
            trappedEl.el.removeEventListener("mouseenter", e => scrolltrap._mouseEnter);

            if (!scrolltrap.elements.length) {
                document.removeEventListener("wheel", scrolltrap._trapWheel);
            }
        }
    }

    private static _mouseEnter(trappedEl: trappedElement): void {
        if (scrolltrap.debug) {
            console.log("mouse entered");
        }

        //Start listening for scroll events
        document.addEventListener("wheel", scrolltrap._trapWheel);
        scrolltrap._trapEngagementCheck(trappedEl);

        if (trappedEl.options.detectContentChanges) {
            ((el: HTMLElement) => {
                //Listen to live mofidications to trapped element
                el.addEventListener("DOMNodeRemoved DOMNodeInserted input", scrolltrap._domChanged);
            })(trappedEl.el);
        }
    }

    private static _mouseLeave(e: MouseEvent): void {
        if (scrolltrap.debug) {
            console.log("mouse left");
        }

        document.removeEventListener("wheel", scrolltrap._trapWheel);
        document.removeEventListener("DOMNodeRemoved DOMNodeInserted input", scrolltrap._domChanged);
        document.body.classList.remove(scrolltrap.defaultTrapClassName);


        if (scrolltrap.trappedElement && scrolltrap.trappedElement.options.classname) {
            scrolltrap.trappedElement.el.classList.remove(scrolltrap.trappedElement.options.classname);
        }

        scrolltrap.trappedElement = null;
    }

    private static _domChanged(e: MouseEvent) {
        if (scrolltrap.debug) {
            console.log(e.type);
        }

        // START Throttler 
        if (scrolltrap.listenerToken) {
            clearTimeout(scrolltrap.listenerToken);
        }

        scrolltrap.listenerToken = setTimeout(() => {
            //Re calculate whether trap should be engaged or nto
            scrolltrap._refresh(scrolltrap.trappedElement);
            scrolltrap.listenerToken = null;
        }, 100);
    }

    private static _refresh(trappedEl: trappedElement): void {
        if (trappedEl) {
            scrolltrap._trapEngagementCheck(trappedEl);
        }
    }

    private static _trapEngagementCheck(trappedEl: trappedElement): void {
        const el = trappedEl.el;
        const containerHeight = el.clientHeight;
        const contentHeight = el.scrollHeight; // height of scrollable content

        // Content is higher than container, scroll bar is VISIBLE
        if (contentHeight > containerHeight) {
            document.body.classList.add(scrolltrap.defaultTrapClassName);
            scrolltrap.trappedElement = trappedEl;
        }

        //Scroll bar is not VISIBLE
        else {
            document.body.classList.remove(scrolltrap.defaultTrapClassName);
            scrolltrap.trappedElement = null;
        }
    }

    private static _trapWheel(wheelEvent: WheelEvent): boolean {
        //Trap not engaged, let the scroll happen
        if (!document.body.classList.contains(scrolltrap.defaultTrapClassName)) {
            if (scrolltrap.trappedElement.options.classname) {
                scrolltrap.trappedElement.el.classList.remove(scrolltrap.trappedElement.options.classname);
            }
            return true;
        }

        //
        else {
            const el = scrolltrap.trappedElement.el;
            const curScrollPos = el.scrollTop;
            const dY = wheelEvent.deltaY;

            if (scrolltrap.debug) {
                console.log(`delta-y: ${dY}`);
                console.log(`cursor scroll Pos: ${curScrollPos}`);
            }

            const containerHeight = el.clientHeight;
            const contentHeight = el.scrollHeight; // height of scrollable content
            const scrollableDist = contentHeight - containerHeight;

            if (scrolltrap.debug) {
                console.log(`container height:${containerHeight}`);
                console.log(`content height:${contentHeight}`);
                console.log(`scrollable dist: ${scrollableDist}`);
            }

            // only trap events once we've scrolled to the end or beginning
            //Note that a positive deltaY is a scroll down (and viceversa)
            if ((dY > 0 && (curScrollPos >= scrollableDist ||
                curScrollPos + 1 >= scrollableDist)) ||
                (dY < 0 && curScrollPos <= 0)) {

                if (scrolltrap.debug) {
                    console.log("trapped");
                }

                if (scrolltrap.trappedElement.options.classname) {
                    scrolltrap.trappedElement.el.classList.add(scrolltrap.trappedElement.options.classname);
                }

                wheelEvent.preventDefault();
                return false;
            }

            else if (scrolltrap.trappedElement.options.classname) {
                scrolltrap.trappedElement.el.classList.remove(scrolltrap.trappedElement.options.classname);
            }
        }
    }

    private static _generateToken(): string {
        var _p8 = (s?: boolean): string => {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }

        return _p8() + _p8(true) + _p8(true) + _p8();
    }
}

export interface trappedElement {
    token: string;
    el: HTMLElement;
    options?: scrolltrapOptions;
}

export interface scrolltrapOptions {
    detectContentChanges?: boolean;
    classname?: string;
}