self.addEventListener('install', event => {
	event.waitUntil(
		caches.open('v1')
			.then(cache => {
				return cache.addAll([
					'/',
					'index.html',
					'images/titleicon50.png',
					'fontactic.css',
					'css/style.css',
					'css/media.css',
					'js/handlebars-v4.0.11.js',
					'js/modelModule.js',
					'js/viewModule.js',
					'js/controlModule.js',
					'js/script.js'
				]);
			})
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.match(event.request)
			.then( resp => {
				return resp || fetch(event.request)
					.then(response => response)
					.catch(err => console.log('Offline' + err))
			})
	);
});