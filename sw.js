self.addEventListener('install', function(e) {
	caches.open('union-times')
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

self.addEventListener('fetch', function(e) {
	e.respondWith(
		caches.open('union-times')
			.then(function(cache) {
				return caches.match(e.request)
					.then(function(res) {
						return res || fetch(e.request).then(res => {
							e.request.url.match('chrome-extension://') ? '' : cache.put(e.request, res.clone());
							//then return it from the cache
							return res;
						});
					});
			})
	);
});