const CACHE = 'calorie-tracker-v1';
const ASSETS = [
  '/calorie-tracker/',
  '/calorie-tracker/index.html',
  '/calorie-tracker/manifest.json',
  '/calorie-tracker/icon.svg',
  '/calorie-tracker/icon-192.png',
  '/calorie-tracker/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok) {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => {
    return Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
  }));
});
