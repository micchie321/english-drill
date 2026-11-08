// Spell Blaster - Cache Cleaner & Self-Destructing Service Worker
// 古い画面キャッシュを確実にパージし、自身を登録解除して最新のアセットを表示させます。
// ※ localStorage (学習履歴・所持SP・称号など) には一切触らないため、データは100%安全です。

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      // 過去の古い全キャッシュ(CacheStorage)を完全削除
      return Promise.all(keys.map((k) => caches.delete(k)));
    }).then(() => {
      // 自身を登録解除（二度と古いキャッシュを作らないように自滅）
      return self.registration.unregister();
    }).then(() => {
      return self.clients.matchAll({ type: 'window' });
    }).then((clients) => {
      // 画面をリロードして最新のHTMLを直接表示
      for (const client of clients) {
        if (client.url && 'navigate' in client) {
          client.navigate(client.url);
        }
      }
    })
  );
  self.clients.claim();
});

// すべての通信を一切キャッシュせず、直接通過させる
self.addEventListener('fetch', (e) => {
  return;
});
