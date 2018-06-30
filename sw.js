

const staticCacheName = 'CC-v2';

self.addEventListener('install', (event) => {

    event.waitUntil(
        //I cache the currencies
        caches.open(staticCacheName).then((cache) => {
            return cache.addAll([
                './',
                './assets/js/main.js',
                './assets/js/idb.js',
                './assets/js/idbController.js',
                './assets/js/serviceWorker.js',
                './assets/css/main.css',
                
                'https://free.currencyconverterapi.com/api/v5/currencies',
            ]);
        })
    )
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        //Check if Cache match then fetch from cache else fetch original request 
        caches.match(event.request).then((response) => {
            if (response) return response;
            return fetch(event.request);
        })
    )
});


self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith('CC-') &&
                        cacheName != staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});