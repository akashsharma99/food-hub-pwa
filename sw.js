const staticCacheName = 'site-static-v3';
const dynamicCache='site-dynamic-v3';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.js',
    '/css/styles.css',
    '/css/materialize.css',
    '/img/dish.png',
    '/pages/fallback.html',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
];
//install service worker
self.addEventListener('install', evt=>{
    //console.log('service worker has been installed');
    //if cache doesnt exist it creates in the browser
    evt.waitUntil(
        caches.open(staticCacheName).then(cache=>{
            console.log('caching shll assets');
            cache.addAll(assets);
        })
    );
    
});

//activate event
self.addEventListener('activate',evt=>{
    //console.log('service worker has been activated');
    evt.waitUntil(
        caches.keys().then(keys=>{
            //console.log(keys);
            return Promise.all(keys
                .filter(key=>key!==staticCacheName && key !== dynamicCache)
                .map(key=>caches.delete(key))
            )
        })
    );
});
//cache size limit
const limitCacheSize = (name, size)=>{
    caches.open(name)
        .then(cache=>{
            cache.keys().then(keys=>{
                if(keys.length>size){
                    cache.delete(keys[0]).then(limitCacheSize(name,size));
                }
            })
        })
}
//fetch event
self.addEventListener('fetch', (evt)=>{
    //console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheResponse=>{
            return cacheResponse || fetch(evt.request).then(fetchResponse=>{
                return caches.open(dynamicCache).then(cache=>{
                    cache.put(evt.request.url, fetchResponse.clone());
                    limitCacheSize(dynamicCache,20);
                    return fetchResponse;
                })
            });
        }).catch(()=>{
            if(evt.request.url.indexOf('.html')>-1){
            return caches.match('/pages/fallback.html');
            }
        })
    );
});