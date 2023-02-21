const CACHE_VERSION = 2;
const CACHE_NAME = 'static-cache-v' + CACHE_VERSION;
const STATIC_CACHE_FILES = [
    "./index.html",
    // "./styles.css",
    "./script.js",
    "./install.js",
    "./assets/bot.png",
    "./assets/send.png",
    "./assets/user.png",
    "./assets/icons/favicon128x128.png",
    "./assets/icons/favicon180x180.png",
    "./assets/icons/favicon192x192.png",
    "./assets/icons/favicon256x256.png",
    "./assets/icons/favicon512x512.png",
    "./assets/icons/favicon640x640.png",
];

self.addEventListener('install', (evt) => {
    // console.log('Service Worker installed!');
    evt.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log("[Service Worker] Caching all: app shell and content");
                return cache.addAll(STATIC_CACHE_FILES)
            })
            .catch(err => console.log("[Service Worker] Intallation failed. Couldn't cache files properly: ", err))
    );
});

self.addEventListener('activate', (evt) => {
    // console.log('[Service Worker] Activation succeeded');
    evt.waitUntil(
        caches.keys()
            .then(async keys => {
                return Promise.all(
                    keys.map(key => {
                        if (key !== CACHE_NAME) {
                            caches.delete(key);
                        };
                    })
                );
            })
            .catch(err => console.log("[Service Worker] Activation failed", err))
    );
});

self.addEventListener('fetch', (evt) => {
    console.log(`[Service Worker] Fetched resource ${evt.request.url}`);
    if (evt.request.method !== 'GET') {
        return fetch(evt.request).then(response => response);
    }
    evt.respondWith(
        caches.open(CACHE_NAME)
            .then(async cache => {
                return cache.match(evt.request)
                    .then(cacheRes => {
                        if (cacheRes) {
                            console.log("[Service Worker] Found response in cache:", cacheRes);
                            return cacheRes;
                        }
                        console.log(`[Service Worker] No response for ${evt.request.url} found in cache. About to fetch from network…`);
                        return fetch(evt.request.clone())
                            .then(response => {
                                putCache(evt.request, response.clone());
                                return response
                            });
                    })
            })
            .catch(err => console.log('[Service Worker] Something went wrong...', err))
    )
});


function putCache(request, response) {
    if (request.method !== "GET") return;
    if (response.status < 400 && response.type !== "error") {
        return caches
            .open(CACHE_NAME)
            .then(cache => cache.put(request, response));
    }
    console.log("[Service Worker] Not caching the response to", evt.request.url);
    return Promise.resolve(); // do not put in cache network errors
}


