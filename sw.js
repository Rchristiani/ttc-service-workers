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

self.addEventListener('fetch', function(e) {
	e.respondWith(
		fetch(e.request)
			.then((response) => {
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
			})
			.catch(() => {
				return caches.open(cacheVersion)
					.then(function(cache) {
						return caches.match(e.request)
							.then(function(res) {
								return res;
							});
					});
			})
	);
});