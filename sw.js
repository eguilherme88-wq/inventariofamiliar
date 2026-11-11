const CACHE='inventario-familiar-static-20261111-v1';
const ROOT=new URL('./',self.location.href);
const STATIC=['./index.html','./manifest.webmanifest','./assets/pdf-lib.min.js','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png'];
const allowed=new Set(STATIC.map(p=>new URL(p,ROOT).href));
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(STATIC.map(p=>new URL(p,ROOT).href))))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('inventario-familiar-static-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting()});
self.addEventListener('fetch',event=>{const request=event.request,url=new URL(request.url);if(request.method!=='GET'||url.origin!==ROOT.origin)return;if(request.mode==='navigate'&&url.pathname.startsWith(ROOT.pathname)){event.respondWith(fetch(request).then(response=>response).catch(()=>caches.match(new URL('./index.html',ROOT).href)));return}if(!allowed.has(url.href))return;event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy))}return response}))) });
