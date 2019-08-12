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
    "revision": "ed0b8ba6365c0c471f319d66b457566f"
  },
  {
    "url": "sudoku-max/css/sudoku-max-2.css",
    "revision": "422e13a1d81db31b6983cbac7e6a9dc1"
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
    "revision": "e7bb94a7f6c56e829c21f1c86dfa6c68"
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
    "revision": "c2bb46e943d0fd8f7feda10218a707fe"
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
    "url": "js/binary-hex-conversions.js",
    "revision": "ed042edfc6b8587bb265ed5e7ff748ce"
  },
  {
    "url": "js/checkbox.js",
    "revision": "4bc2ae84e72b212021e9ab04b17049a1"
  },
  {
    "url": "js/color-sliders.js",
    "revision": "e0bf57c46ac166d019a68153b2da2d3e"
  },
  {
    "url": "js/d3.js",
    "revision": "3b3deb02bc7d847c1f5b2175be884931"
  },
  {
    "url": "js/d3.v3.js",
    "revision": "edbbae7cca2dd0ef5c24207b4136dfa6"
  },
  {
    "url": "js/d3.v4.js",
    "revision": "3b3deb02bc7d847c1f5b2175be884931"
  },
  {
    "url": "js/data.js",
    "revision": "88c16aecaab3ba2c1e29a7bff93ead96"
  },
  {
    "url": "js/dynamic-pages-user-login.js",
    "revision": "3a0fbd2e276170d9bea140eb0d9f3552"
  },
  {
    "url": "js/dynamic-pages-users.js",
    "revision": "3a0fbd2e276170d9bea140eb0d9f3552"
  },
  {
    "url": "js/example-library.js",
    "revision": "2c6baac2e0d3e022698f4c262907b49f"
  },
  {
    "url": "js/form-save-restore.js",
    "revision": "6ce5a1c08b6650c767decbf76a7142cd"
  },
  {
    "url": "js/form.js",
    "revision": "f48788572c18f7c71435898d4c2a021d"
  },
  {
    "url": "js/homepage-data.js",
    "revision": "b5d7616072afcbe77c4a29588bbb58e9"
  },
  {
    "url": "js/html-utilities.js",
    "revision": "b8bf16e17ddb79af4f9a2bf01fa27f22"
  },
  {
    "url": "js/jquery-1.7.1.js",
    "revision": "d813f51ab5ce94302ea039d5e68a7df4"
  },
  {
    "url": "js/jquery-3.1.1.js",
    "revision": "46836bbc603c9565b5cc061100ccbac8"
  },
  {
    "url": "js/jquery.js",
    "revision": "7df0a08f438c12a75b267cc83bfa03e8"
  },
  {
    "url": "js/jquery.textareaAutoResize.js",
    "revision": "1fa3a7014e1f595de50d8c651b2d4fdc"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery-ui.css",
    "revision": "4f126fe37e7aa8dffed0c20c695ed79c"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.accordion.css",
    "revision": "edecf04d9573612eaa8117ad99cdf0e4"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.all.css",
    "revision": "230ad530ef772cc76e8409f8209e045c"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.autocomplete.css",
    "revision": "bc8cf4cc7944d6f9cea8374882e57639"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.base.css",
    "revision": "5e0c848bf2c690f00724bb035054f3ff"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.button.css",
    "revision": "7c77090a958d7b16f216e2a14bdb7f60"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.core.css",
    "revision": "649ac84c54cda4773efae42ee52102a5"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.datepicker.css",
    "revision": "1073d0cf9235807dced01db3748576e5"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.dialog.css",
    "revision": "ff12ab357c78ea60bee2dcc65f7c42c4"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.progressbar.css",
    "revision": "2e5e863fe4b1e4fb7f12a33b3444fe1b"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.resizable.css",
    "revision": "5269e7121e121fe6bf6828024d8dd782"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.selectable.css",
    "revision": "37f9c254641f9caa84275f584e12a328"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.slider.css",
    "revision": "dfcad5c95a0139b90f924f2c11ce382d"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.tabs.css",
    "revision": "f26922313bf81aea6f02acd880406e55"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.theme.css",
    "revision": "6361b2fbeeb913604d10f710409b9a5b"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Scripts/jquery-ui-1.8.20.js",
    "revision": "aa878e37c9523cef798915d1361972ff"
  },
  {
    "url": "js/jQuery.Validation.1.9.0.1/Content/Scripts/jquery.validate.js",
    "revision": "d55af5b3667099e1968f67e883b6fd4d"
  },
  {
    "url": "js/log-2.js",
    "revision": "d6c4d31a35d79c99102d66b41811d3c9"
  },
  {
    "url": "js/log.js",
    "revision": "78731060481c05dfc3f52c4543c4d016"
  },
  {
    "url": "js/mouse-events-2.js",
    "revision": "83190b5c042304aedcf61e023e75b297"
  },
  {
    "url": "js/mouse-events-3.js",
    "revision": "83190b5c042304aedcf61e023e75b297"
  },
  {
    "url": "js/mouse-events.js",
    "revision": "71791addac2bac567cdb847dce21e59b"
  },
  {
    "url": "js/panel-show-hide.js",
    "revision": "2dd39f5a23448e14d369095446cedd70"
  },
  {
    "url": "js/schedule-function.js",
    "revision": "649bc57ee2efd393b9a03e896baac1d6"
  },
  {
    "url": "js/svg-transform.js",
    "revision": "6d2d26509f05a96e88fae289dab8786f"
  },
  {
    "url": "js/vertical-products-2.js",
    "revision": "d5b6384612e6a77dbe3b4b7d64816231"
  },
  {
    "url": "js/vertical-products-3.js",
    "revision": "d5b6384612e6a77dbe3b4b7d64816231"
  },
  {
    "url": "js/wrap-page.js",
    "revision": "08e27341679aacc826018fee4b06f835"
  },
  {
    "url": "js/x-test.js",
    "revision": "e14a0d269a7a4fd9a301f57d52fad0ce"
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
    "url": "main.css",
    "revision": "5a6cb7290a66ddb7c81c7d539fd43eb4"
  },
  {
    "url": "sw-preinject.js",
    "revision": "25d16548176209f2bf6aa7c1f4bfe309"
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
    "url": "game-of-life/index.html",
    "revision": "ac8db9237ade10c3897fd2133a1d9932"
  },
  {
    "url": "games/go/index.html",
    "revision": "08037967055fc012c85e90613a3ab074"
  },
  {
    "url": "games/hex/index.html",
    "revision": "0bd5cd505eaa108567088ec721efc82f"
  },
  {
    "url": "index.html",
    "revision": "a9eb2563891afed65aaa4f537b5425db"
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
    "url": "sudoku-max/index-newer.html",
    "revision": "4359abb4b717dfcc0ad8b28fcf4d3a37"
  },
  {
    "url": "sudoku-max/responsive.html",
    "revision": "b7b092eb9539233873a854847a38d16e"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
