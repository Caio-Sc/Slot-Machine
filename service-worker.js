// Nome do cache com versão
const CACHE_VERSION = 'v1.0.1'; // Atualize essa versão quando mudar o conteúdo
const CACHE_NAME = `Slot-Machine-${CACHE_VERSION}`;

// Arquivos que serão cacheados
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/favicon.png',
    '/personagemGanhando.gif',
    '/personagemPerdendo.gif',
    '/personagemTorcendo.gif',
    '/slotreel.webp',
    '/js/script.js'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                // Força o Service Worker a se ativar imediatamente
                return self.skipWaiting();
            })
    );
});

// Resposta a requisições
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna o cache ou faz a requisição e cacheia a resposta
                return response || fetch(event.request).then(response => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
    );
});

// Atualização do Service Worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Se o cache não está na whitelist, delete-o
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            // Controla todas as páginas abertas para usar o novo Service Worker
            return self.clients.claim();
        })
    );
});
