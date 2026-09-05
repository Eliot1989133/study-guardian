const CACHE = 'study-guardian-v1';
self.addEventListener('install', function(e){
  self.skipWaiting();
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
// network-first: 优先拉最新版，离线才用缓存
self.addEventListener('fetch', function(e){
  e.respondWith(
    fetch(e.request).then(function(res){
      if (res && res.ok && e.request.method === 'GET') {
        const copy = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
      }
      return res;
    }).catch(function(){
      return caches.match(e.request).then(function(r){ return r || caches.match('./index.html'); });
    })
  );
});