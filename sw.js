const cacheVersion = 'union-times-v3';

self.addEventListener('install', function(e) {
	caches.open(cacheVersion)
		.then(function(cache) {
			return cache.addAll([
				'',
				'js/script.js',
				'js/templater.js',
				'css/style.css'
			]);
		})
		.catch(console.log);
});

self.addEventListener('activate', function(e) {
	e.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.filter(() => true)
					.map((cache) => caches.delete(cache))
			);
		})
	);
});

function pullFromCache(e) {
	return caches.open(cacheVersion)
		.then(function(cache) {
			return caches.match(e.request)
				.then(function(res) {
					return res;
				});
		});
}

function networkThenCache(response,e) {
	return caches.open(cacheVersion)
		.then(function(cache) {
			return caches.match(e.request)
				.then(function(res) {
				e.request.url.match('chrome-extension://') ? 
				'' : 
				cache.put(e.request, response.clone());
				return response;
			});
		});
}

self.addEventListener('fetch', function(e) {
	e.respondWith(
		fetch(e.request)
			.then((response) => networkThenCache(response,e))
			.catch(() => pullFromCache(e))
	);
});