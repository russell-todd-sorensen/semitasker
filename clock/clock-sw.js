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
    "url": "images/icons/icon-128x128.png",
    "revision": "25be5857e8c4be187890d79e03cefa47"
  },
  {
    "url": "images/icons/icon-144x144.png",
    "revision": "4da0362099a3665bdf6475ed9d497d77"
  },
  {
    "url": "images/icons/icon-152x152.png",
    "revision": "72476470e52f728830edb1b99f5da062"
  },
  {
    "url": "images/icons/icon-192x192.png",
    "revision": "e001445cc806760dc3026af04838783b"
  },
  {
    "url": "images/icons/icon-384x384.png",
    "revision": "f05895c7d8fd8060f5f6588e776a8ab2"
  },
  {
    "url": "images/icons/icon-512x512.png",
    "revision": "73b27e68291bd86687ac33be86912a81"
  },
  {
    "url": "images/icons/icon-72x72.png",
    "revision": "3e1c9564e566fabf020397e342ddc96c"
  },
  {
    "url": "images/icons/icon-96x96.png",
    "revision": "280e4cd44efb8d07594e926eded0b6e6"
  },
  {
    "url": "clock.html",
    "revision": "7f47e80911a7f27c3fee5881d2b13d16"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
