/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "sudoku-max/css/mobile.css",
    "revision": "4a1daf09a49769cdb3beffde66c7270c"
  },
  {
    "url": "sudoku-max/css/sudoku-max-2.css",
    "revision": "ec1122315fcaa38d90c922d3bd868521"
  },
  {
    "url": "sudoku-max/css/sudoku-max.css",
    "revision": "686e481aa076d21c11aaaca002564bf1"
  },
  {
    "url": "sudoku-max/js/controls.js",
    "revision": "0d42cd72854483608aa06db9298b44a0"
  },
  {
    "url": "sudoku-max/js/ia-controls-3.js",
    "revision": "84075b9569db52267ad91c0b561643cc"
  },
  {
    "url": "sudoku-max/js/ia-controls.js",
    "revision": "360bcfa8031f301f6c3c662bf65274f7"
  },
  {
    "url": "sudoku-max/js/sudoku-max-2.js",
    "revision": "ceb7909d93e0d2731450ff88ac015052"
  },
  {
    "url": "sudoku-max/js/sudoku-max-3.js",
    "revision": "b61a20c6cf17c8405c235c288025e3e5"
  },
  {
    "url": "sudoku-max/js/sudoku-max.js",
    "revision": "061b20ec1d47200326d01fa199bae91c"
  },
  {
    "url": "css/box-model.css",
    "revision": "29557e22625ae4f32de5bf4762d2f2f2"
  },
  {
    "url": "css/color-sliders.css",
    "revision": "d3405941324a61a8e97ac0b0140408b1"
  },
  {
    "url": "css/examples-reset.css",
    "revision": "d30921679698ad410ab7571ac803ce5b"
  },
  {
    "url": "css/green-form.css",
    "revision": "aa6f2e186c878cdc6f919b7497635ef5"
  },
  {
    "url": "css/iam.css",
    "revision": "cbefedd2de3afea74e5a7ae1b7ad6335"
  },
  {
    "url": "css/log.css",
    "revision": "f4c968bfb66db8852f59f02badd70ea1"
  },
  {
    "url": "css/logo-maker-1.css",
    "revision": "f2a820f86a6414ba9791bb7fa589540e"
  },
  {
    "url": "css/main-index.css",
    "revision": "108e9210d944525b1af3fb6b7121b887"
  },
  {
    "url": "css/main.css",
    "revision": "e2d6a1ad1d63967a648666662f9dba7e"
  },
  {
    "url": "css/reset.css",
    "revision": "b0e92f8276b766000b8969b7c18cac9b"
  },
  {
    "url": "css/wrap-links.css",
    "revision": "b7d76573c40dd166b7efda441fa4a954"
  },
  {
    "url": "svg/displace-exp.js",
    "revision": "a7a2ad68772b41e5bd4fd6c1b23d4bff"
  },
  {
    "url": "svg/feDisplacementMap-exp-2.js",
    "revision": "d4b2d3a133bb97bcff87615b08373206"
  },
  {
    "url": "svg/js/filter-mania-1.js",
    "revision": "aa16c94d7f546efa560a808fc691bbf4"
  },
  {
    "url": "svg/js/filter-mania-improved-3.js",
    "revision": "2e29e8d16b5058da5b5726db327adea3"
  },
  {
    "url": "svg/old-svg-js.js",
    "revision": "a2a0ff5e576fb21fe25c591c5e3ae147"
  },
  {
    "url": "svg/tainted-filter-fix/data-url-inject.js",
    "revision": "dd2c9bc46940770fbd899561c127c536"
  },
  {
    "url": "svg/tainted-filter-fix/escapes.js",
    "revision": "e9859b8c51238669f8b548e5311e9d2d"
  },
  {
    "url": "svg/tainted-filter-fix/filter-bug.css",
    "revision": "54db1ebb1dcedca226720a520ab16288"
  },
  {
    "url": "app-install/housing-roster/www/participants/index.html",
    "revision": "cc2c0c96a3cae5d2213218c412611e62"
  },
  {
    "url": "app-install/vat/index.html",
    "revision": "c54d61fcc8ba4b408b1ec1fa7a71eda8"
  },
  {
    "url": "chemical-pi/index.html",
    "revision": "4750a6ab1c9be9ba43b55d0872cc4460"
  },
  {
    "url": "coroutine/index.html",
    "revision": "501bddc30d7a7ed1c1df6b826374d1bf"
  },
  {
    "url": "doc/index.html",
    "revision": "72ac6b6459acbab17fe97bf9bbef7541"
  },
  {
    "url": "doc2/index.html",
    "revision": "21002c705ccf5e34720315e00fc1ea22"
  },
  {
    "url": "game-of-life/index.html",
    "revision": "ac8db9237ade10c3897fd2133a1d9932"
  },
  {
    "url": "games/go/index.html",
    "revision": "60f17127dc1d4a19dbbde87e62597032"
  },
  {
    "url": "games/hex/index.html",
    "revision": "0bd5cd505eaa108567088ec721efc82f"
  },
  {
    "url": "index.html",
    "revision": "3a48c1c4858cc011cc0914e88de862cc"
  },
  {
    "url": "roman/ↈ_ↀ_ↁ_ↇ/index.html",
    "revision": "d932ead197d226749f37e659efaf924d"
  },
  {
    "url": "roman/idx-folder/index.html",
    "revision": "73d00ab48ae36afd1140af84779614fa"
  },
  {
    "url": "tartans/index.html",
    "revision": "bba30e6719048b3ca11c2fda605aa05b"
  },
  {
    "url": "sudoku-max/responsive.html",
    "revision": "c2f9ad710db4b0bf69ec5ddc930dded0"
  },
  {
    "url": "js/log-2.js",
    "revision": "d6c4d31a35d79c99102d66b41811d3c9"
  },
  {
    "url": "js/homepage-data.js",
    "revision": "218becf61895ef424bdb7fcc658da5a1"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
