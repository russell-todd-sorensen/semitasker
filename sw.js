importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
  new RegExp('.*\.js'),
  workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
  // Cache CSS files
  /.*\.css/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'css-cache',
  })
);

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|webp|gif)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 200 images
        maxEntries: 200,
        // Cache for a maximum of a month
        maxAgeSeconds: 30 * 24 * 60 * 60,
      })
    ],
  })
);

workbox.precaching.precacheAndRoute([
  {
    "url": "index.html",
    "revision": "8c0062c68e68021b2a5edb4f607ff8d0"
  },
  {
    "url": "favicon.ico",
    "revision": "ff2c8612b75b5f9a6175e016fe4aa609"
  },
  {
    "url": "js/binary-hex-conversions.js",
    "revision": "91a00709b394e16138e9c3affc38c1b3"
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
    "url": "js/create-imagedata.tcl",
    "revision": "21a8de19ce19632af3248d8c8b9f175b"
  },
  {
    "url": "js/d3.js",
    "revision": "610de2fa83968d2dd4a1e4643743e8fb"
  },
  {
    "url": "js/d3.v3.js",
    "revision": "edbbae7cca2dd0ef5c24207b4136dfa6"
  },
  {
    "url": "js/d3.v4.js",
    "revision": "610de2fa83968d2dd4a1e4643743e8fb"
  },
  {
    "url": "js/data.js",
    "revision": "bb8432427e27a1401d36ee97fd26b78e"
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
    "revision": "6b763ffb41631e7bb6ef17110d476d66"
  },
  {
    "url": "js/homepage-data.js",
    "revision": "7b9dcba70aa547c91b587ca56320a35d"
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
    "revision": "2bf49d80d39e784e004a785c3f6f1f54"
  },
  {
    "url": "js/jquery-3.1.1.min.map",
    "revision": "8490e50bf7bcfd54a131ab0f9220ceeb"
  },
  {
    "url": "js/jquery.js",
    "revision": "9e936b27d8d0e4e07ebef242d7c6e2cc"
  },
  {
    "url": "js/jquery.textareaAutoResize.js",
    "revision": "1fa3a7014e1f595de50d8c651b2d4fdc"
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
    "revision": "23389b837c4ad82be985d5e8a4677472"
  },
  {
    "url": "js/mouse-events-3.js",
    "revision": "23389b837c4ad82be985d5e8a4677472"
  },
  {
    "url": "js/mouse-events.js",
    "revision": "71791addac2bac567cdb847dce21e59b"
  },
  {
    "url": "js/panel-show-hide.js",
    "revision": "044dc9d3bbe507d827bd658a68de15d8"
  },
  {
    "url": "js/schedule-function.js",
    "revision": "1b30ee62f49ee451e0f22457b06d989d"
  },
  {
    "url": "js/svg-transform.js",
    "revision": "4d781f7a6cd18db6024612c38914519c"
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
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/images/ui-bg_flat_0_aaaaaa_40x100.png",
    "revision": "2a44fbdb7360c60122bcf6dcef0387d8"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/images/ui-bg_flat_75_ffffff_40x100.png",
    "revision": "8692e6efddf882acbff144c38ea7dfdf"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/images/ui-bg_glass_55_fbf9ee_1x400.png",
    "revision": "f8f4558e0b92ff2cd6136781533902ec"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/images/ui-bg_glass_65_ffffff_1x400.png",
    "revision": "e5a8f32e28fd5c27bf0fed33c8a8b9b5"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/images/ui-bg_glass_75_dadada_1x400.png",
    "revision": "c12c6510dad3ebfa64c8a30e959a2469"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/images/ui-bg_glass_75_e6e6e6_1x400.png",
    "revision": "f4254356c2a8c9a383205ef2c4de22c4"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/images/ui-bg_glass_95_fef1ec_1x400.png",
    "revision": "5a3be2d8fff8324d59aec3df7b0a0c83"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/images/ui-bg_highlight-soft_75_cccccc_1x100.png",
    "revision": "72c593d16e998952cd8d798fee33c6f3"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/images/ui-icons_222222_256x240.png",
    "revision": "9129e086dc488d8bcaf808510bc646ba"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/images/ui-icons_2e83ff_256x240.png",
    "revision": "25162bf857a8eb83ea932a58436e1049"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/images/ui-icons_454545_256x240.png",
    "revision": "771099482bdc1571ece41073b1752596"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/images/ui-icons_888888_256x240.png",
    "revision": "faf6f5dc44e713178784c1fb053990aa"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/images/ui-icons_cd0a0a_256x240.png",
    "revision": "5d8808d43cefca6f6781a5316d176632"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery-ui.css",
    "revision": "f83d316694dd9150bc9245e88a5ffd5e"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.accordion.css",
    "revision": "6e3796684a969c80bd4688585baccf19"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.all.css",
    "revision": "b5c0a02a213430bff074dd8f535bb3f7"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.autocomplete.css",
    "revision": "211424149d53a258284806093e39781e"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.base.css",
    "revision": "43674b4e245bd7226c7e1a40789f48e2"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.button.css",
    "revision": "3aee16b1f2163d531a2bd677b2a8383e"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.core.css",
    "revision": "dd67d2ceffe11142f7d354b970a11f0d"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.datepicker.css",
    "revision": "7c6baacbd52c2f0dd141d477529b73de"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.dialog.css",
    "revision": "a45a2214c728b1d73ac335e1ae0684dd"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.progressbar.css",
    "revision": "dd0d2af0fe3ace00b2652ef7a6b4fb77"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.resizable.css",
    "revision": "c89857f1428d380a4781450960ae72ca"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.selectable.css",
    "revision": "fe20529a22185782bb4dc16db2e5cf1b"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.slider.css",
    "revision": "85f881d6cd9fda2456a139a122973a83"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.tabs.css",
    "revision": "9a0ad2737d7a2b88ea414c203f79c7ef"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Content/themes/base/jquery.ui.theme.css",
    "revision": "6d8cd45ad7193edb1b7d85e3fbc6bbbd"
  },
  {
    "url": "js/jQuery.UI.Combined.1.8.20.1/Content/Scripts/jquery-ui-1.8.20.js",
    "revision": "e14a0d269a7a4fd9a301f57d52fad0ce"
  },
  {
    "url": "js/jQuery.Validation.1.9.0.1/Content/Scripts/jquery.validate.js",
    "revision": "cf2fc67882aff005c943b77d1ce3208c"
  }
]);
