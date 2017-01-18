# Scrolltrap

![Dependency Status](https://img.shields.io/badge/Dependencies-None-brightgreen.svg "No dependencies") [![npm version](https://img.shields.io/badge/npm%20package-1.0.3-brightgreen.svg "Go to NPM's website now!")](https://www.npmjs.com/package/scrolltrap)

Prevent the page from scrolling after having reached the end of a scrollable element.  
Super lightweight: ~1007 bytes gzipped.


### [DEMO](https://gioele-antoci.github.io/scrolltrap/ "Check me out!")



### Installing

**Npm**

```
npm install --save scrolltrap
```

...bundle it cozily with [Browserify](http://browserify.org/) or [Webpack](https://webpack.github.io/) and import it:

```js
import scrolltrap from 'scrolltrap'
```

or

```js
const scrolltrap = require("scrolltrap");
```

**Use a CDN**
```html
<script src="https://cdn.rawgit.com/gioele-antoci/scrolltrap/2ce75825/dist/scrolltrap.js"></script>
```

**Or grab the file directly** from the [dist](dist) folder
```html
<script src="scrolltrap.min.js"></script>
```

## How to use

Simply get an element and pass it to `scrolltrap.attach`. That is it.
```js
const trappableEl = document.getElementsByClassName("element-to-trap")[0];
scrolltrap.attach(trappableEl);
```

## API

**Attach trap**

This will inform _scrolltrap_ to listen for future scrolls on the element passed.
It returns a GUID-like token with which you can later destroy the trap.
```js
attach(el: HTMLElement, options?: scrolltrapOptions): string
```

Optionally a second parameter (options) can be passed.

**Options**

**scrolltrapOptions**

| Field                    | Type       | Default       | Description                                |
| -----------------        | ---------- | -----------   | ------------------------------------------ |
| `detectContentChanges` | `boolean` | `false`      | Detects eventual DOM changes inside trapped element. e.g. the element is `contentEditable`
| `classname`             | `string`  | `NONE`  | Class to add to trapped element once the trap engages. The class will be removed on trap disengagement |


**Destroy trap**

This will inform _scrolltrap_ to stop listening to scroll events. Requires the token that was returned when trap got attached.
```js
destroy(token: string): void
```
___
* If you need to troubleshoot eventual issues set `scrolltrap.debug` to `true`.
* The current version of _scrolltrap_ depends on mouse events. You have no mouse, you have no traps.
* Nested traps are to use to your own peril. 



## Authors

* **Gioele Antoci** - *Initial work* - [gioele-antoci](https://github.com/gioele-antoci)
* **Ian Schmitz** - *Initial work* - [ianSchmitz](https://github.com/ianSchmitz)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details



