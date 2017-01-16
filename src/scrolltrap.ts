﻿class scrollTrap {

    private static debug = false;

    private static trappedElements: trappedElement[] = [];
    private static defaultTrapClassName = "trap-scroll-enabled";
    private static listenerToken: number;

    private static trappedObj: trappedObject;

    static attachScrollTrap(el: HTMLElement, options?: scrollTrapOptions): string {

        //Create a trapped element and assign an unique token
        const trapEl: trappedElement = {
            el: el,
            token: this.generateToken(),
            options: options || {}
        };
        this.trappedElements.push(trapEl);

        el.addEventListener("mouseleave", this.mouseLeave);
        el.addEventListener("mouseenter", e => this.mouseEnter(trapEl));

        //Return token for later actions on this el
        return trapEl.token;
    }

    static destroyScrollTrap(token: string): void {

        //Find elelement we want to destroy and remove it from the array
        var trappedEl = this.trappedElements.filter((x: trappedElement) => x.token === token)[0];

        if (trappedEl) {
            //remove item from local collection of trapped elements
            this.trappedElements.splice(this.trappedElements.indexOf(trappedEl), 1);

            //De-attach event handlers
            trappedEl.el.removeEventListener("mouseleave", this.mouseLeave);
            trappedEl.el.removeEventListener("mouseenter", e => this.mouseEnter);

            if (!this.trappedElements.length) {
                document.removeEventListener("wheel", this.trapWheel);
            }
        }
    }

    private static mouseEnter(trappedEl: trappedElement): void {

        if (this.debug) {
            console.log("mouse entered");
        }

        //Start listening for scroll events
        document.addEventListener("wheel", scrollTrap.trapWheel);
        this.trapEngagementCheck(trappedEl.el);

        if (trappedEl.options.detectContentChanges) {
            ((el: HTMLElement) => {
                //Listen to live mofidications to trapped element
                el.addEventListener("DOMNodeRemoved DOMNodeInserted input", scrollTrap.domChanged);
            })(trappedEl.el);
        }
    }

    private static mouseLeave(e: MouseEvent): void {
        if (this.debug) {
            console.log("mouse left");
        }

        document.removeEventListener("wheel", this.trapWheel);
        document.removeEventListener("DOMNodeRemoved DOMNodeInserted input", scrollTrap.domChanged);
        document.body.classList.remove(scrollTrap.defaultTrapClassName);
    }

    private static domChanged(e: MouseEvent) {

        if (scrollTrap.debug) {
            console.log(e.type);
        }

        // START Throttler 
        if (scrollTrap.listenerToken) {
            clearTimeout(scrollTrap.listenerToken);
        }

        scrollTrap.listenerToken = setTimeout(() => {
            //Re calculate whether trap should be engaged or nto
            scrollTrap.refreshTrap(<HTMLElement>e.target);
            scrollTrap.listenerToken = null;
        }, 100);
    }

    private static refreshTrap(el: HTMLElement): void {
        scrollTrap.trapEngagementCheck(el);
    }

    private static trapEngagementCheck(el: HTMLElement): void {

        const containerHeight = el.clientHeight;
        const contentHeight = el.scrollHeight; // height of scrollable content

        const scrollableDist = contentHeight - containerHeight;

        if (scrollTrap.debug) {
            console.log(`container height:${containerHeight}`);
            console.log(`content height:${contentHeight}`);
            console.log(`scrollable dist: ${scrollableDist}`);
        }

        // Content is higher than container, scroll bar is VISIBLE
        if (contentHeight > containerHeight) {
            document.body.classList.add(scrollTrap.defaultTrapClassName);
            scrollTrap.trappedObj = {
                el,
                scrollableDistance: scrollableDist
            };
        }

        //Scroll bar is not VISIBLE
        else {
            document.body.classList.remove(scrollTrap.defaultTrapClassName);
        }
    }

    private static trapWheel(wheelEvent: WheelEvent): boolean {

        //Trap not engaged, let the scroll happen
        if (!document.body.classList.contains(scrollTrap.defaultTrapClassName)) {
            wheelEvent.preventDefault();
            return false;
        }

        //
        else {

            const curScrollPos = scrollTrap.trappedObj.el.scrollTop;
            const dY = wheelEvent.deltaY;

            if (scrollTrap.debug) {
                console.log(`delta-y: ${dY}`);
                console.log(`cursor scroll Pos: ${curScrollPos}`);
            }

            // only trap events once we've scrolled to the end or beginning
            //Note that a positive deltaY is a scroll down (and viceversa)
            if ((dY > 0 && (curScrollPos >= scrollTrap.trappedObj.scrollableDistance ||
                curScrollPos + 1 >= scrollTrap.trappedObj.scrollableDistance)) ||
                (dY < 0 && curScrollPos <= 0)) {

                if (scrollTrap.debug) {
                    console.log("trapped");
                }
                wheelEvent.preventDefault();
                return false;
            }
        }
    }

    private static generateToken(): string {
        var _p8 = (s?: boolean): string => {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }

        return _p8() + _p8(true) + _p8(true) + _p8();
    }
}

export interface trappedObject {
    el: HTMLElement;
    scrollableDistance: number

}

export interface trappedElement {
    token: string;
    el: HTMLElement;
    options?: scrollTrapOptions;
}


export interface scrollTrapOptions {
    detectContentChanges?: boolean;
}