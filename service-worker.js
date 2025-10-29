/* == Tesbihat SW: prod + staging uyumlu ===============================
   - Prod path:    /tesbihat/
   - Staging path: /tesbihat/staging/
   - SW, scope’una bakıp doğru BASE_PATH’i ve CACHE_NAME’i seçer.
   - Cache politikası: cache-first (+ runtime cache yazma)
   - SPA/deep link için: navigate isteklerinde index.html fallback
   =================================================================== */

/* Versiyon numarasını her “önemli” değişimde artır ki eski cache temizlensin. */
const CACHE_VERSION = 'v34';

/* Scope → /tesbihat/  veya  /tesbihat/staging/  tespiti */
const SCOPE_URL = self.registration && self.registration.scope ? new URL(self.registration.scope) : new URL('/', self.location.origin);
const PATHNAME   = SCOPE_URL.pathname;                       // örn: /tesbihat/  veya  /tesbihat/staging/
const IS_STAGING = PATHNAME.includes('/tesbihat/staging/');  // staging mi?
const BASE_PATH  = IS_STAGING ? '/tesbihat/staging/' : '/tesbihat/';

/* Ortam bazlı cache adı (karışmasın diye farklı) */
const CACHE_NAME = `tesbihat-${IS_STAGING ? 'staging' : 'prod'}-${CACHE_VERSION}`;

/* Kökteki dosyaların listelemesi — BASE_PATH ile ön eklenir */
const RAW_ASSETS = [
  '',                     // kök (dir index)
  'index.html',
  'styles.css',
  'main.js',
  'manifest.webmanifest',

  // içerikler
  'sabah.md',
  'sabahCleanAR.md',
  'OgleTesbihat.md',
  'oglenCleanAR.md',
  'IkindiTesbihat.md',
  'ikindiCleanAR.md',
  'AksamTesbihat.md',
  'aksamCleanAR.md',
  'YatsiTesbihat.md',
  'yatsiCleanAR.md',
  'AksamYatsiZikirleri.md',
  'GunlukZikirler.md',
  'BirKirikDilekce.txt',
  'KuranDualari.txt',
  'HadislerdenDualar.txt',
  'HomeFeatures.md',
  'TesbihatinOnemi.txt',
  'zikir-defaults.json',
  'names.json',

  // ikonlar
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png',

  // SPA/deeplink için tavsiye edilen fallback
  '404.html',
];

/* BASE_PATH ile tamlaştırılmış precache listesi */
const ASSETS = RAW_ASSETS.map(p => BASE_PATH + p);

/* ---------------------------------------------------- Install (precache) */
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const results = await Promise.allSettled(
      ASSETS.map((assetPath) =>
        cache.add(assetPath).catch((error) => {
          console.warn('[SW] Precache atlandı:', assetPath, error);
          throw error;
        })
      )
    );

    const failedAssets = [];
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        failedAssets.push(ASSETS[index]);
      }
    });
    if (failedAssets.length > 0) {
      console.warn('[SW] Önbelleğe alınamayan dosyalar:', failedAssets);
    }

    await self.skipWaiting();
  })());
});

/* --------------------------------------- Activate (eski cache’leri sil) */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('tesbihat-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ---------------------------------------------------------- Fetch hook */
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Sadece GET ve aynı origin
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isNavigation = req.mode === 'navigate';

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;

      // network → cache’e yaz → dön
      return fetch(req)
        .then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          // offline fallback: SPA/deeplink’te index.html
          if (isNavigation) {
            return caches.match(BASE_PATH + 'index.html')
                   || caches.match(BASE_PATH); // directory index denemesi
          }
          // asset ise, sessizce düş
          return new Response('', { status: 504 });
        });
    })
  );
});
