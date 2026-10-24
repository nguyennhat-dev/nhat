const VERSION = 'v1.0.0'
const CORE_CACHE = 'core-' + VERSION
const RUNTIME_CACHE = 'runtime-v1'
const APP_SHELL = [
  './', './index.html', './manifest.json',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'
]
const HLS_JS = 'cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js'

function shouldBypass(req) {
  if (req.method !== 'GET') return true
  if (req.headers.has('range')) return true
  const dest = req.destination
  if (dest === 'audio' || dest === 'video') return true
  const url = req.url
  if (/\.(m3u8|ts|aac|mp3|m4s)(\?|$)/i.test(url)) return true
  try {
    const u = new URL(url)
    if (u.origin !== self.location.origin && !u.href.includes(HLS_JS)) return true
  } catch (e) { return true }
  return false
}

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CORE_CACHE).then(function (c) {
    return c.addAll(APP_SHELL).catch(function () {})
  }))
})

self.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) {
      return k.indexOf('core-') === 0 && k !== CORE_CACHE
    }).map(function (k) {
      return caches.delete(k)
    }))
  }).then(function () {
    return self.clients.claim()
  }))
})

self.addEventListener('fetch', function (e) {
  const req = e.request
  if (shouldBypass(req)) return
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./index.html', { ignoreSearch: true }).then(function (cached) {
      var net = fetch(req).then(function (resp) {
        try {
          caches.open(CORE_CACHE).then(function (c) { c.put(req, resp.clone()) })
        } catch (e) {}
        return resp
      }).catch(function () { return cached })
      return cached || net
    }))
    return
  }
  e.respondWith(caches.match(req).then(function (cached) {
    if (cached) return cached
    return fetch(req).then(function (resp) {
      try {
        var cacheName = req.url.indexOf(HLS_JS) >= 0 ? RUNTIME_CACHE : CORE_CACHE
        caches.open(cacheName).then(function (c) { c.put(req, resp.clone()) })
      } catch (e) {}
      return resp
    }).catch(function () { return cached })
  }))
})
